import DB from './_db';

export async function get()
{
  const db = await DB();

  return {
    body: db.get('songs')
      .map(it => it.meta)
      .shuffle()
      .value(),
  }
}