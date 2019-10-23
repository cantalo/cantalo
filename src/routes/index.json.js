import api from './_api';

export async function get(req, res)
{
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(await api('songs.json'));
}