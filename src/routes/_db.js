import lowDB from 'lowdb';
import FileAsync from 'lowdb/adapters/FileAsync.js';

const adapter = new FileAsync(process.env['DB_PATH'], {
  serialize: obj => JSON.stringify(obj),
});

export default async function()
{
  const db = await lowDB(adapter);
  return db.defaults({ songs: [] })
}
