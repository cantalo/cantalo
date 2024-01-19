import { getSongs } from '$lib/server/db.js';

const shiftPlayedToEnd = played => song => played.has(song.id) ? 1 : -1;

export const load = async ({ locals }) => {
  const songs = await getSongs();

  return {
    songs: songs.sort(shiftPlayedToEnd(locals.played)),
  }
};