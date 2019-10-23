import api from '../_api';

export async function get(req, res)
{
  const { vid } = req.params;

  const songsJson = await api('songs.json');
  const song = await api(`songs/${vid}.json`);

  const songs = JSON.parse(songsJson);

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    meta: songs.find(song => song.id === vid),
    song: JSON.parse(song),
  }));
}