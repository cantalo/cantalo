import { writable } from 'svelte/store';

const { set, subscribe } = writable({});

export const time = writable(0);
export const playing = writable(false);
export const playerApi = writable({});

export const video = {
  subscribe,
  play: (id, gap = 0) => set({ id, gap }),
};