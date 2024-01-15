import DB from '../../_db';

export const load = async ({ params, locals, cookies }) => {
  const { vid } = params;
  const db = await DB();

  const data = db.get('songs')
    .find({ id: vid })
    .value();

  locals.played.add(vid);
  cookies.set('played', Array.from(locals.played).join(), {
    path: '/',
  });

  const suggestions = db.get('songs').filter(it => !locals.played.has(it.id));

  let [suggestion] = suggestions
    .filter(it => it.meta.genre === data.meta.genre && it.meta.language === data.meta.language)
    .shuffle()
    .value();

  if (!suggestion) {
    [suggestion] = suggestions
      .filter(it => it.meta.language === data.meta.language)
      .shuffle()
      .value();
  }

  if (suggestion) {
    data.suggestion = suggestion.meta;
  }

  return data;
};