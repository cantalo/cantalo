import api from '../../_api';

export async function get(req, res)
{
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify([
    {
      artist: 'Bloodhound Gang',
      title: 'Foxtrott Uniform Charlie Kilo',
    },
    {
      artist: 'Bloodhound Gang',
      title: 'The bad touch',
    },
    {
      artist: 'Bloodhound Gang',
      title: 'The ballad of Chasey Lane',
    },
  ]));
}
