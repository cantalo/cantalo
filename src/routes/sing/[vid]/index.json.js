import DB from '../../_db';

export async function get(req, res)
{
  const { vid } = req.params;
  const db = await DB();

  const data = db.get('songs')
    .find({ id: vid })
    .value();

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}
