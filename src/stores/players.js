import { writable } from 'svelte/store';
import Microphone from '../services/Microphone';
import sungStore from './players/sung';
import scoreStore from './players/score';

const playerColors = ['red', 'deepskyblue'];
const playersStore = writable([]);

function deferredPromise()
{
  let _resolve;
  const promise = new Promise(resolve => _resolve = resolve);
  promise.resolve = _resolve;
  return promise;
}

export const players = {
  subscribe: playersStore.subscribe,
  initialized: deferredPromise(),
  add(deviceId, channel)
  {
    const mic = new Microphone(deviceId, channel);
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
