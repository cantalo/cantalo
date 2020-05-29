import DB from './_db';

export async function get(req, res)
{
  const db = await DB();

  const songs = db.get('songs')
    .map(it => it.meta)
    .value();

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(songs));
}