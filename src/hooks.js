import acceptLanguage from 'accept-language';
import cookie from 'cookie';

acceptLanguage.languages(['en', 'de']); // TODO get dynamically

function getPlayedFromCookies(cookieString)
{
  const cookies = cookie.parse(cookieString || '');
  return new Set(cookies.played ? cookies.played.split(',') : []);
}

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ request, resolve }) {
  request.locals.played = getPlayedFromCookies(request.headers.cookie);
  request.locals.lang = acceptLanguage.get(request.headers['accept-language']);

  return resolve(request);
}

/** @type {import('@sveltejs/kit').GetSession} */
export function getSession(request) {
  return {
    appVersion: process.env['VERSION'],
    ...request.locals,
  };
}