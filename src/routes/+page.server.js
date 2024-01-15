import DB from './_db';

const shiftPlayedToEnd = played => song => played.has(song.id) ? 1 : -1;

export const load = async ({ locals }) => {
  const db = await DB();

  return {
    songs: db.get('songs')
      .map(it => it.meta)
      .shuffle()
      .value()
      .sort(shiftPlayedToEnd(locals.played)),
  }
};