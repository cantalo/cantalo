import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import acceptLanguage from 'accept-language';
import * as sapper from '@sapper/server';

import './i18n.js';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

acceptLanguage.languages(['en', 'de']);

polka()
	.use(
		compression({ threshold: 0 }),
		sirv('static', { dev }),
		sapper.middleware({
			session: (req) => ({
				lang: acceptLanguage.get(req.headers['accept-language'])
			}),
		})
	)
	.listen(PORT, err => {
		if (err) console.log('error', err);
	});
