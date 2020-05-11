import { derived } from 'svelte/store';
import Note from '../../services/Note';
import { currentSyllable } from '../song';
import { time } from '../video';

export default function (microphone)
{
  let sungData = {};

  const storeUpdate = ([$currentSyllable, $time], set) =>
  {
    const currentPitch = microphone.getPitch();

    if ($currentSyllable && currentPitch !== null)
    {
      const sung = sungData[$currentSyllable.start] = sungData[$currentSyllable.start] || [];
      const lastSung = sung[sung.length - 1];
      const start = ($time - $currentSyllable.start) * (100 / $currentSyllable.length);
      const match = getMatchingClass($currentSyllable, currentPitch);
      const points = getMatchingPoints($currentSyllable, currentPitch);

      if (lastSung)
      {
        lastSung.end = 100 - start;
      }
      if (!lastSung || lastSung.match !== match)
      {
        sung.push({
          start,
          match,
          points,
          golden: $currentSyllable.type === 2,
        });
      }

      set(sungData);
    }

    if ($time === 0)
    {
      set(sungData);
    }
  };

  return {
    ...derived([currentSyllable, time], storeUpdate, sungData),
    reset()
    {
      sungData = {};
    },
  };
}

function getMatchingPoints(syllable, input)
{
  // match golden note            = p * 2.5
  // match regular                = p * 1.5
  // match freestyle              = p * 1
  // too low/high / unknown pitch = p * 0.5

  if (syllable.type === 0)
  {
    return 1;
  }

  if (input.note)
  {
    const note = new Note(syllable.pitch);
    const diff = input.note - note;

    if (Math.abs(diff) < 2) // allow half-note tolerance
    {
      return syllable.type + 0.5;
    }
  }

  return 0.5;
}

function getMatchingClass(syllable, input)
{
  if (syllable.type === 0)
  {
    return 'match';
  }

  if (input.note)
  {
    const note = new Note(syllable.pitch);
    const diff = input.note - note;

    if (Math.abs(diff) < 2) // allow half-note tolerance
    {
      return 'match';
    }
    else if (diff < 0)
    {
      return 'too-low';
    }
    else
    {
      return 'too-high';
    }
  }
}