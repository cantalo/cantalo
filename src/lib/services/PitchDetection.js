// https://github.com/cwilso/PitchDetect

import Note from './Note';
import SystemRequirements from './SystemRequirements';
SystemRequirements.addJS('Float32Array', () => !!Float32Array);
SystemRequirements.addJS('AnalyserNode', () => !!AnalyserNode);

function noteFromPitch( frequency ) {
  var noteNum = 12 * (Math.log( frequency / 440 )/Math.log(2) );
  return Math.round( noteNum ) + 69;
}

function frequencyFromNoteNumber( note ) {
  return 440 * Math.pow(2,(note-69)/12);
}

function centsOffFromPitch( frequency, note ) {
  return Math.floor( 1200 * Math.log( frequency / frequencyFromNoteNumber( note ))/Math.log(2) );
}


var MIN_SAMPLES = 0;  // will be initialized when AudioContext is created.
var GOOD_ENOUGH_CORRELATION = 0.9; // this is the "bar" for how close a correlation needs to be

function isNotEnoughSignal(buf)
{
  var rms = 0;
  for (var i=0;i<buf.length;i++) {
    var val = buf[i];
    rms += val*val;
  }
  rms = Math.sqrt(rms/buf.length);
  return rms<0.01;
}

function autoCorrelate( buf, sampleRate ) {
  var SIZE = buf.length;
  var MAX_SAMPLES = Math.floor(SIZE/2);
  var best_offset = -1;
  var best_correlation = 0;
  var foundGoodCorrelation = false;
  var correlations = new Array(MAX_SAMPLES);

  var lastCorrelation=1;
  for (var offset = MIN_SAMPLES; offset < MAX_SAMPLES; offset++) {
    var correlation = 0;

    for (var i=0; i<MAX_SAMPLES; i++) {
      correlation += Math.abs((buf[i])-(buf[i+offset]));
    }
    correlation = 1 - (correlation/MAX_SAMPLES);
    correlations[offset] = correlation; // store it, for the tweaking we need to do below.
    if ((correlation>GOOD_ENOUGH_CORRELATION) && (correlation > lastCorrelation)) {
      foundGoodCorrelation = true;
      if (correlation > best_correlation) {
        best_correlation = correlation;
        best_offset = offset;
      }
    } else if (foundGoodCorrelation) {
      // short-circuit - we found a good correlation, then a bad one, so we'd just be seeing copies from here.
      // Now we need to tweak the offset - by interpolating between the values to the left and right of the
      // best offset, and shifting it a bit.  This is complex, and HACKY in this code (happy to take PRs!) -
      // we need to do a curve fit on correlations[] around best_offset in order to better determine precise
      // (anti-aliased) offset.

      // we know best_offset >=1,
      // since foundGoodCorrelation cannot go to true until the second pass (offset=1), and
      // we can't drop into this clause until the following pass (else if).
      var shift = (correlations[best_offset+1] - correlations[best_offset-1])/correlations[best_offset];
      return sampleRate/(best_offset+(8*shift));
    }
    lastCorrelation = correlation;
  }
  if (best_correlation > 0.01) {
    // console.log('f = ' + sampleRate/best_offset + 'Hz (rms: ' + rms + ' confidence: ' + best_correlation + ')')
    return sampleRate/best_offset;
  }
  return -1;
//  var best_frequency = sampleRate/best_offset;
}

export default class PitchDetection extends AnalyserNode
{
  constructor(audioContext)
  {
    super(audioContext);
    this.audioBuffer = new Float32Array(this.frequencyBinCount);
  }

  getPitch()
  {
    this.getFloatTimeDomainData(this.audioBuffer);

    if (isNotEnoughSignal(this.audioBuffer))
    {
      return null;
    }

    const pitch = autoCorrelate(this.audioBuffer, this.context.sampleRate);

    if (pitch > -1)
    {
      const note = noteFromPitch(pitch);

      return {
        pitch: Math.round(pitch),
        note: new Note(note),
        detune: centsOffFromPitch(pitch, note),
      };
    }

    return { unknown: true };
  }

  getVolume()
  {
    this.getFloatTimeDomainData(this.audioBuffer);
    const total = this.audioBuffer.reduce((acc, cur) => acc + (cur ** 2), 0);
    const rms = Math.sqrt(total / this.audioBuffer.length);
    let db = 20 * Math.log10(rms);
    // sanity check
    db = Math.max(-48, Math.min(db, 0));
    return 100 + (db * 2.083);
  }
}