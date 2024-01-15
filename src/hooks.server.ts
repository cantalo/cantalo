import type { Handle } from '@sveltejs/kit';
import { locale } from 'svelte-i18n';

export const handle: Handle = async ({ event, resolve }) => {
  const lang = event.request.headers.get('accept-language')?.split(',')[0];

  if (lang) {
    locale.set(lang);
  }

  const playedCookie = event.cookies.get('played');
  event.locals['played'] = new Set(playedCookie ? playedCookie.split(',') : []);

  return resolve(event);
};