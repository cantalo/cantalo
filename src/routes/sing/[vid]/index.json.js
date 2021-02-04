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

  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Set-Cookie': `played=${Array.from(played).join()}; Path=/; Max-Age=${6 * 60 * 60}`,
  });
  res.end(JSON.stringify(data));
}
