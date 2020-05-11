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

    return sungLines.reduce((line, syllable) =>
    {
      return syllable.reduce((sum, item) =>
      {
        if (item.end)
        {
          const value = parseInt((100 - item.end - item.start) * item.points || 0, 10);
          sum.notes += value;
          if (item.golden) sum.goldenNotes += value;
          sum.total = sum.notes + sum.goldenNotes;
        }

        return sum;
      }, line);
    }, result);
  });
}