import lowDB from 'lowdb';
import FileAsync from 'lowdb/adapters/FileAsync';

const adapter = new FileAsync(process.env.DB_PATH);

export default async function()
{
  const db = await lowDB(adapter);
  return db.defaults({ songs: [] })
}
