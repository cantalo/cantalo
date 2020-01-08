import { writable } from 'svelte/store';

const playerColors = ['red', 'deepskyblue'];
const playersStore = writable([]);

export const players = {
  subscribe: playersStore.subscribe,
  add(deviceId, channel)
  {
    const score = writable(0);
    return playersStore.update(playersList => [...playersList,
    {
      id: `${deviceId}:${channel}`,
      name: '',
      color: playerColors[playersList.length],
      mic:
      {
        deviceId,
        channel,
      },
      score:
      {
        subscribe: score.subscribe,
        set(sungData)
        {
          score.set(parseInt(Object
            .values(sungData)
            .reduce((sumA, syllable) =>
              syllable.reduce((sumB, item) =>
                sumB + ((100 - item.end - item.start) * item.points || 0), sumA), 0), 10));
        },
      },
    }]);
  },
  reset()
  {
    playersStore.set([]);
  },
};
