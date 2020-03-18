import { derived } from 'svelte/store';

export default function(sung)
{
  return derived(sung, ($sung) => parseInt(Object
    .values($sung)
    .reduce((sumA, syllable) =>
      syllable.reduce((sumB, item) =>
        sumB + ((100 - item.end - item.start) * item.points || 0), sumA), 0), 10));
}