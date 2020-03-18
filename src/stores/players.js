import { writable } from 'svelte/store';
import Microphone from '../services/Microphone';
import sungStore from './players/sung';
import scoreStore from './players/score';

const playerColors = ['red', 'deepskyblue'];
const playersStore = writable([]);

export const players = {
  subscribe: playersStore.subscribe,
  async add(deviceId, channel)
  {
    const mic = new Microphone(deviceId, channel);
    await mic.init();

    const sung = sungStore(mic);
    const score = scoreStore(sung);

    return playersStore.update(playersList => [...playersList,
    {
      id: `${deviceId}:${channel}`,
      name: '',
      color: playerColors[playersList.length],
      mic,
      sung,
      score,
    }]);
  },
  reset()
  {
    playersStore.set([]);
  },
};
