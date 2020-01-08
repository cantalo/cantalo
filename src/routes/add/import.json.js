import usdb from 'usdb';

const { USDB_USER, USDB_PASSWORD } = process.env;
let login;

export async function get(req, res)
{
  const { id } = req.query;

  if (!id || id.length <= 0)
  {
    res.writeHead(400);
  }

  if (!login)
  {
    login = usdb.login(USDB_USER, USDB_PASSWORD);
  }
  await login;

  const file = await usdb.getFile(id);

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ file: file.content }));
}
