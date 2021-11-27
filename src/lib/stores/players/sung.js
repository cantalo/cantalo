import { derived } from 'svelte/store';
import Note from '../../services/Note';
import { currentLine, currentSyllable } from '../song';
import { time } from '../../components/YouTube.svelte';

class SungData extends Object
{
  at(line, syllable)
  {
    if (!this[line.id])
    {
      this[line.id] = { [syllable.id]: [] };
    }
    else if (!this[line.id][syllable.id])
    {
      this[line.id][syllable.id] = [];
    }

    return this[line.id][syllable.id];
  }
}

export default function (microphone)
{
  let sungData = new SungData();
  let setStore;

  const storeUpdate = ([$currentLine, $currentSyllable, $time], set) =>
  {
    setStore = set;
    const currentPitch = microphone.getPitch();

    if ($currentLine && $currentSyllable)
    {
      const sung = sungData.at($currentLine, $currentSyllable);
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
    ...derived([currentLine, currentSyllable, time], storeUpdate, sungData),
    reset()
    {
      sungData = new SungData();
      setStore(sungData);
    },
  };
}

function getMatchingPoints(syllable, input)
{
  // match golden note            = p * 2.5
  // match regular                = p * 1.5
  // match freestyle              = p * 1
  // too low/high / unknown pitch = p * 0.5

  if (!input)
  {
    return 0;
  }

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
  if (!input)
  {
    return null;
  }

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