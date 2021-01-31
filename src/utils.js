export function getPlayedFromCookies(req)
{
  return new Set(req.cookies.played ? req.cookies.played.split(',') : []);
}