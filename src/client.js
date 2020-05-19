import * as Sentry from '@sentry/browser';
import * as sapper from '@sapper/app';

import './i18n.js';

Sentry.init({
	dsn: 'https://4793b8ca7f7a4478ab9b336dfa9142c9@o226409.ingest.sentry.io/5218450',
	release: process.env.VERSION,
	blacklistUrls: /localhost/,
});

sapper.start({
	target: document.querySelector('cantalo')
});
