import db from '../../../../../usdb/export.json';

const format = str => decodeURIComponent(str)
  .toLocaleLowerCase()
  .replace(/\+/g, ' ')
;

const responseHeaders = { 'Content-Type': 'application/json' };

export async function get(req, res)
{
  const { artist, title } = req.query;

  if (artist || title)
  {
    const result = db.filter(item =>
      (!artist || item.interpret.toLowerCase().includes(format(artist))) &&
      (!title || item.title.toLowerCase().includes(format(title)))
    );

    res.writeHead(200, responseHeaders);

    if (result.length > 0)
    {
      res.end(JSON.stringify(result.map(item =>
      {
        const song = { ...item };
        song.artist = song.interpret;
        delete song.interpret;
        return song;
      })));
    }
    else
    {
      res.end('[]');
    }
  }
  else
  {
    res.writeHead(400, responseHeaders);
    res.end('[]');
  }
}
