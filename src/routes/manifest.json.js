import { get as getStore } from 'svelte/store';
import { _ as translate, locale } from 'svelte-i18n';

export function get(req, res)
{
  const _ = getStore(translate);
  const lang = getStore(locale);

  res.writeHead(200, { 'Content-Type': 'application/manifest+json' });
  res.end(JSON.stringify({
    name: _('app.name'),
    description: _('app.description'),
    lang,
    display: 'fullscreen',
    start_url: '/?installed',
    orientation: 'landscape',
    icons:
    [
      {
        src: 'assets/icons/maskable.png',
        sizes: '1024x1024',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
  }));
}