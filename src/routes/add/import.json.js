import api from '../_api';

export async function get(req, res)
{
  // TODO auto detect encoding
  const file = await api(`../src/Bloodhound Gang - The ballad of Chasey Lane.txt`);

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ file }));
}
