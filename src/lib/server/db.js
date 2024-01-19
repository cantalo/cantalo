import lowDB from 'lowdb';
import FileAsync from 'lowdb/adapters/FileAsync.js';

const adapter = new FileAsync(process.env['DB_PATH'], {
  serialize: obj => JSON.stringify(obj),
});

export default async function DB()
{
  const db = await lowDB(adapter);
  return db.defaults({ songs: [] })
}

export async function getSongs() {
  const db = await DB();

  return db.get('songs')
    .map(it => it.meta)
    .shuffle()
    .value();
}

export async function getSong(id) {
  const db = await DB();

  return db.get('songs')
    .find({ id })
    .value();
}