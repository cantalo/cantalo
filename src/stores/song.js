import { writable, derived } from 'svelte/store';
import { time } from './video';

export const song = writable([]);

let $currentLine;
export const currentLine = derived([song, time], ([$song, $time], set) =>
{
  if (!$song)
  {
    $currentLine = undefined;
    set($currentLine);
  }
  else if (!$currentLine || $currentLine.end < $time)
  {
    $currentLine = $song.find(line => line.end > $time && $time > line.start);
    set($currentLine);
  }
});

export const currentSyllable = derived([currentLine, time], ([line, $time]) =>
  line && line.syllables.find(syllable =>
    syllable.start < $time && $time < syllable.start + syllable.length
  )
);