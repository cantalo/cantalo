import { writable, derived } from 'svelte/store';
import { time } from '../components/YouTube.svelte';

export const song = (() =>
{
  const { set, ...rest } = writable([]);
  return {
    ...rest,
    set(meta, lines)
    {
      const beatsToMs = beats => Math.round((250 / meta.bpm * 60) * beats * 100) / 100;
      const addGap = t => ((meta.videogap || 0) * 1000) + (meta.gap || 0) + t;

      set(lines.map((line, id) =>
      {
        const pitches = line.syllables.map(syllable => syllable.pitch);

        return {
          id,
          start: addGap(beatsToMs(line.start)),
          end: addGap(beatsToMs(line.end)),
          minPitch: Math.min(...pitches),
          maxPitch: Math.max(...pitches),
          syllables: line.syllables.map((syllable, i) =>
          ({
            id: i,
            ...syllable,
            start: addGap(beatsToMs(syllable.start)),
            length: beatsToMs(syllable.length),
          })),
        };
      }));
    },
    reset()
    {
      set(null);
    },
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