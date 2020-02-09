import usdb from 'usdb';

let login;

export async function get(req, res)
{
  const { id } = req.query;

  if (!login)
  {
    login = usdb.login('', ''); // TODO use env vars
  }
  await login;

  const file = await usdb.getFile(id);

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ file: file.content }));
}
