import { YoutubeDataAPI } from 'youtube-v3-api';

const api = new YoutubeDataAPI(''); // TODO use env var
const responseHeaders = { 'Content-Type': 'application/json' };
const fields = ({ id, snippet }) => ({
  id: id.videoId,
  title: snippet.title,
  channel: snippet.channelTitle,
  thumbnails: snippet.thumbnails,
});

export async function get(req, res)
{
  const { search } = req.query;

  if (search)
  {
    try
    {
      const result = await api.searchAll(search, 15, { type: 'video' });
      res.writeHead(200, responseHeaders);
      res.end(JSON.stringify(result.items.map(fields)));
    }
    catch (err)
    {
      console.error(err);
      res.writeHead(500, responseHeaders);
      res.end('[]');
    }
  }
  else
  {
    res.writeHead(400, responseHeaders);
    res.end('[]');
  }
}
