import DB from '../../_db';
import { getPlayedFromCookies } from '../../../utils';

export async function get(req, res)
{
  const { vid } = req.params;
  const db = await DB();

  const data = db.get('songs')
    .find({ id: vid })
    .value();

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
