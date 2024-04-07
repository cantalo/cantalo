import { env } from '$env/dynamic/private';

function shuffle(array) {
  let currentIndex = array.length;
  while (currentIndex !== 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}

export async function getSongs() {
  const response = await fetch(env.SONG_SERVICE);
  const result = await response.json();
  shuffle(result);
  return result;
}

export async function getSong(id) {
  const response = await fetch(`${env.SONG_SERVICE}/${id}.json`);
  return response.json();
}