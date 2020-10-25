import DB from '../_db';

export async function get(req, res)
{
  const db = await DB();

  const songs = db.get('songs')
    .map(it => it.meta)
    .value();

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    availableGenres: Array.from(new Set(songs.map(it => it.genre))).filter(Boolean),
    availableLanguages: Array.from(new Set(songs.map(it => it.language))).filter(Boolean),
  }));
}