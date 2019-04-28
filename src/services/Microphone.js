import { readable } from 'svelte/store';

import SystemRequirements from './SystemRequirements';
SystemRequirements.addJS('Permissions', () => navigator.permissions instanceof Permissions);
SystemRequirements.addJS('MediaDevices', () => navigator.mediaDevices instanceof MediaDevices);
SystemRequirements.addJS('Float32Array', () => !!Float32Array);
SystemRequirements.addJS('AudioContext', () => !!AudioContext);
SystemRequirements.addJS('requestAnimationFrame', () => !!requestAnimationFrame);

const { permissions, mediaDevices } = navigator;

const noteStrings = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const bufferSize = 1024;
const leftBuffer = new Float32Array(bufferSize);
const rightBuffer = new Float32Array(bufferSize);

const constraints = {
  audio:
  {
    echoCancellation: false,
    autoGainControl: false,
    noiseSuppression: false,
    highpassFilter: false,
  }
};

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

function autoCorrelate( buf, sampleRate ) {
  var SIZE = buf.length;
  var MAX_SAMPLES = Math.floor(SIZE/2);
  var best_offset = -1;
  var best_correlation = 0;
  var rms = 0;
  var foundGoodCorrelation = false;
  var correlations = new Array(MAX_SAMPLES);

  for (var i=0;i<SIZE;i++) {
    var val = buf[i];
    rms += val*val;
  }
  rms = Math.sqrt(rms/SIZE);
  if (rms<0.01) // not enough signal
    return -1;

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

let animationFrameId;

class Microphone
{
  constructor()
  {
  }

  async requestPermission()
  {
    const { state } = await permissions.query({ name: 'microphone' });

    if (state === 'prompt')
    {
      try
      {
        // Start and stop stream to request microphone permissions
        const stream = await mediaDevices.getUserMedia(constraints);
        const [track] = stream.getAudioTracks();
        track.stop();

        return 'granted';
      }
      catch (error)
      {
        if (error instanceof DOMException && /permission denied/i.test(error.message))
        {
          return 'denied';
        }

        throw error;
      }
    }

    return state;
  }

  async start()
  {
    this.stream = await mediaDevices.getUserMedia(constraints);
    this.audioContext = new AudioContext();
    this.stereoSplitter = this.audioContext.createChannelSplitter(2);
    this.leftAnalyser = this.audioContext.createAnalyser();
    this.leftAnalyser.fftSize = 2048;
    this.rightAnalyser = this.audioContext.createAnalyser();
    this.rightAnalyser.fftSize = 2048;
    this.audioSource = this.audioContext.createMediaStreamSource(this.stream);
    this.audioSource.connect(this.stereoSplitter);
    this.stereoSplitter.connect(this.rightAnalyser, 0);
    this.stereoSplitter.connect(this.leftAnalyser, 1);
    // this.updatePitch();
  }

  updates()
  {
    return readable({}, (set) =>
    {
      const update = () =>
      {
        this.leftAnalyser.getFloatTimeDomainData(leftBuffer);
        this.rightAnalyser.getFloatTimeDomainData(rightBuffer);

        const leftPitch = autoCorrelate(leftBuffer, this.audioContext.sampleRate);
        const rightPitch = autoCorrelate(rightBuffer, this.audioContext.sampleRate);

        let left, right;

        console.debug('updatePitch leftPitch', leftPitch);
        console.debug('updatePitch rightPitch', rightPitch);

        if (leftPitch > -1)
        {
          const note = noteFromPitch(leftPitch);
          left = {
            pitch: Math.round(leftPitch),
            note: noteStrings[note%12],
            detune: centsOffFromPitch(leftPitch, note),
          };
        }

        if (rightPitch > -1)
        {
          const note = noteFromPitch(rightPitch);
          right = {
            pitch: Math.round(rightPitch),
            note: noteStrings[note%12],
            detune: centsOffFromPitch(rightPitch, note),
          };
        }

        if (left || right)
        {
          set({ left, right });
        }

        animationFrameId = requestAnimationFrame(update);
      };

      update();

    	return () => { cancelAnimationFrame(animationFrameId); };
    });
  }
}

export default new Microphone();