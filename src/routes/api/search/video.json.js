import { YoutubeDataAPI } from 'youtube-v3-api';

const { YOUTUBE_API_KEY } = process.env;

const api = new YoutubeDataAPI(YOUTUBE_API_KEY);
const responseHeaders = { 'Content-Type': 'application/json' };
const fields = ({ id, snippet }) => ({
  id: id.videoId,
  title: snippet.title,
  channel: snippet.channelTitle,
  thumbnails: snippet.thumbnails,
});

function parseDuration(durationString)
{
  const { hours, minutes, seconds } = durationString.match(/PT(((?<hours>[0-9]+)H)?(?<minutes>[0-9]+)M)?(?<seconds>[0-9]+)S/).groups;
  const date = new Date(0);
  if (hours) date.setHours(hours);
  if (minutes) date.setMinutes(minutes);
  date.setSeconds(seconds);
  return date.getTime();
}

export async function get(req, res)
{
  const { search, id } = req.query;

  if (search)
  {
    try
    {
      const result = await api.searchAll(search, 25, { type: 'video' });
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
  else if(id)
  {
    try
    {
      const result = await api.searchVideo(id);
      res.writeHead(200, responseHeaders);
      res.end(JSON.stringify({
        title: result.items[0].snippet.title,
        duration: parseDuration(result.items[0].contentDetails.duration),
      }));
    }
    catch (err)
    {
      console.error(err);
      res.writeHead(500, responseHeaders);
      res.end('{}');
    }
  }
  else
  {
    res.writeHead(400, responseHeaders);
    res.end('[]');
  }
}
