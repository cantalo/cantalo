import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import acceptLanguage from 'accept-language';
import cookieParser from 'cookie-parser';
import * as sapper from '@sapper/server';
import { getPlayedFromCookies } from './utils';

import './i18n.js';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

acceptLanguage.languages(['en', 'de']);

polka()
	.use(
		compression({ threshold: 0 }),
		sirv('static', { dev }),
		cookieParser(),
		sapper.middleware({
			session: (req) => ({
				lang: acceptLanguage.get(req.headers['accept-language']),
				played: getPlayedFromCookies(req),
			}),
		})
	)
	.listen(PORT, err => {
		if (err) console.log('error', err);
	});
