import { derived } from 'svelte/store';

export default function(sung)
{
  return derived(sung, ($sung) =>
  {
    const sungLines = Object.values($sung);
    const result = {
      total: 0,
      notes: 0,
      goldenNotes: 0,
      lineBonus: 0,
    };

    return sungLines.reduce((lineResult, line) =>
    {
      const syllables = Object.values(line);
      let linePercentage = 0;

      lineResult = syllables.reduce((syllableResult, syllable) =>
      {
        return syllable.reduce((sum, item) =>
        {
          if (item.end)
          {
            const percentage = 100 - item.end - item.start;
            const value = parseInt(percentage * item.points || 0, 10);

            if (item.match) linePercentage += percentage;
            if (item.golden) sum.goldenNotes += value;
            else sum.notes += value;
          }

          return sum;
        }, syllableResult);
      }, lineResult);

      const lastSyllable = syllables[syllables.length - 1];
      if (lastSyllable.length && lastSyllable[lastSyllable.length - 1].end)
      {
        lineResult.lineBonus += parseInt(Math.max((linePercentage / syllables.length) - 70, 0) * 2, 10);
      }

      lineResult.total = lineResult.notes + lineResult.goldenNotes + lineResult.lineBonus;

      return lineResult;
    }, result);
  });
}