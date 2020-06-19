import * as Sentry from '@sentry/browser';
import * as sapper from '@sapper/app';
import { get as getStore } from 'svelte/store';

import { time } from './stores/video';
import { currentLine, currentSyllable } from './stores/song';

import './i18n.js';

Sentry.init({
	dsn: 'https://4793b8ca7f7a4478ab9b336dfa9142c9@o226409.ingest.sentry.io/5218450',
	release: process.env.VERSION,
	blacklistUrls: /localhost/,
	beforeSend(event)
	{
		try
		{
			event.extra = event.extra || {};
			event.context = event.context || {};

			const $time = getStore(time);
			if ($time) event.extra.playTime = $time;

			const $currentLine = getStore(currentLine);
			if ($currentLine) event.context.currentLine = $currentLine;

			const $currentSyllable = getStore(currentSyllable);
			if ($currentSyllable) event.context.currentSyllable = $currentSyllable;
		}
		catch (err)
		{
			console.error(err);
		}

		return event;
	},
});

const cantalo = document.querySelector('cantalo');
cantalo.setAttribute('version', process.env.VERSION);

sapper.start({ target: cantalo });
