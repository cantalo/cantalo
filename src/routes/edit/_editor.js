import { writable, derived, get } from 'svelte/store';
import { getMetaData, getSongData } from '../../../../parser';

export function getFromStorage(name)
{
  if (!process.browser) return;
  const item = localStorage.getItem('editor_' + name);
  return item && JSON.parse(item);
}

export let videoInBackground = writable(false);

export let zoom = writable(getFromStorage('zoom') || 6);
if (process.browser) zoom.subscribe($zoom => localStorage.editor_zoom = $zoom);

export let meta = writable({
  artist: '',
  title: '',
  genre: '',
  language: '',
  year: '',
  bpm: '',
});

export let lines = writable([]);

export function parseUsdFile(usdFile)
{
  meta.update($meta => Object.assign($meta, getMetaData(usdFile)));
  lines.set(getSongData(get(meta), usdFile));
}