import DB from '../../_db';
import { getPlayedFromCookies } from '../../../utils';

export async function get(req, res)
{
  const { vid } = req.params;
  const db = await DB();

  const data = db.get('songs')
    .find({ id: vid })
    .value();

  if (data)
  {
    const played = getPlayedFromCookies(req);
    played.add(vid);

    const suggestions = db.get('songs').filter(it => !played.has(it.id));

    let [suggestion] = suggestions
      .filter(it => it.meta.genre === data.meta.genre && it.meta.language === data.meta.language)
      .shuffle()
      .value();

    if (!suggestion)
    {
      [suggestion] = suggestions
        .filter(it => it.meta.language === data.meta.language)
        .shuffle()
        .value()
    }

    if (suggestion)
    {
      data.suggestion = suggestion.meta;
    }

    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Set-Cookie': `played=${Array.from(played).join()}; Path=/; Max-Age=${6 * 60 * 60}`,
    });
    res.end(JSON.stringify(data));
  }
  else
  {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end('{ "message": "Song not found." }');
  }
}

export async function post(req, res)
{
  const { vid } = req.params;
  const { meta, lines } = req.body;

  meta.id = vid;

  for (let key of Object.keys(meta))
  {
    if (meta[key] === '')
    {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(`{ "message": "Meta field  \\"${key}\\" is empty." }`);
      return;
    }
  }

  const db = await DB();

  const entry = db.get('songs')
    .find({ id: vid })
    .size()
    .value();

  if (entry)
  {
    await db.get('songs')
      .find({ id: vid })
      .assign({ meta, lines })
      .write();

    res.writeHead(204); // no content
  }
  else
  {
    await db.get('songs')
      .push({ id: vid, v: 2, meta, lines })
      .write();

    res.writeHead(201); // created
  }

  res.end();
}
