import { writable, derived } from 'svelte/store';

const storeMap = new Map();

let unsubscriber;

function recreate()
{
  if (storeMap.size < 2) return;
  if (unsubscriber) unsubscriber();

  const scoreStores = Array.from(storeMap.keys()).map(player => ({ ...player.score, player }));

  const aheadPlayerStore = derived(scoreStores, (scores) =>
  {
    const maxScore = Math.max(...scores.map(score => score.total));
    if (!maxScore) return;
    const maxScoreIndex = scores.findIndex(score => score.total === maxScore);
    return scoreStores[maxScoreIndex].player;
  });

  unsubscriber = aheadPlayerStore.subscribe(aheadPlayer =>
  {
    storeMap.forEach((store, player) =>
    {
      store.set(player === aheadPlayer);
    });
  });
}

export default function(player)
{
  const store = writable(false, (set) =>
  {
    set(false);
    storeMap.set(player, store);

    recreate();

    return () =>
    {
      storeMap.delete(player);
    };
  });

  return {
    subscribe: store.subscribe,
  };
}