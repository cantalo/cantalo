import { writable, derived } from 'svelte/store';
import { time } from './video';

export const song = (() =>
{
  const { set, ...rest } = writable([]);
  return {
    ...rest,
    set(lines)
    {
      set(lines && lines.map((line, i) =>
      {
        line.id = i;
        line.syllables = line.syllables.map((syllable, j) =>
        {
          syllable.id = j;
          return syllable;
        });

        return line;
      }));
    }
  }
})();

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