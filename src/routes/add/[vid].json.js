import lowDB from 'lowdb';
import DB from '../_db';

export async function post(req, res)
{
  const { vid } = req.params;
  const { meta, song } = req.body;

  meta.id = vid;

  const db = await DB();

  const entry = db.get('songs')
    .find({ id: vid })
    .size()
    .value();

  if (entry)
  {
    await db.get('songs')
      .find({ id: vid })
      .assign({ meta, song })
      .write();
  }
  else
  {
    await db.get('songs')
      .push({ id: vid, meta, song })
      .write();
  }

  res.writeHead(201);
  res.end();
}
