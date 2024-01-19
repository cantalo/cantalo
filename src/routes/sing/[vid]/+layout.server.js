import { getSongs, getSong } from '$lib/server/db.js';

export const load = async ({ params, locals, cookies }) => {
  const { vid } = params;
  const data = await getSong(vid);
  const songs = await getSongs();

  locals.played.add(vid);
  cookies.set('played', Array.from(locals.played).join(), {
    path: '/',
  });

  const suggestions = songs.filter(it => !locals.played.has(it.id));

  let suggestionsByLanguage, suggestionsByGenre = suggestions
    .filter(it => it.genre === data.genre && it.language === data.language);

  if (!suggestionsByGenre) {
    suggestionsByLanguage = suggestions
      .filter(it => it.language === data.language);
  }

  if (suggestionsByGenre) {
    data.suggestion = suggestionsByGenre[Math.floor(Math.random() * suggestionsByGenre.length)];
  } else if (suggestionsByLanguage) {
    data.suggestion = suggestionsByLanguage[Math.floor(Math.random() * suggestionsByLanguage.length)];
  }

  return data;
};
