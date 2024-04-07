import { env } from '$env/dynamic/private';

export async function getSongs() {
  const response = await fetch(env.SONG_SERVICE);
  return response.json();
}

export async function getSong(id) {
  const response = await fetch(`${env.SONG_SERVICE}/${id}.json`);
  return response.json();
}