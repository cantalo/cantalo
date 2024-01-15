<script>
  import * as Sentry from '@sentry/browser';
  import { onMount } from 'svelte';
  import { _ } from 'svelte-i18n';
  import { get as getStore } from 'svelte/store';

  import { time } from '$lib/components/YouTube.svelte';
  import { currentLine, currentSyllable } from '$lib/stores/song';

  export let data;

  onMount(() =>
  {
    Sentry.init({
      dsn: 'https://4793b8ca7f7a4478ab9b336dfa9142c9@o226409.ingest.sentry.io/5218450',
      blacklistUrls: /localhost/,
      beforeSend(event)
      {
        try
        {
          event.extra = event.extra || {};

          const $time = getStore(time);
          if ($time) event.extra.playTime = $time;

          const $currentLine = getStore(currentLine);
          if ($currentLine) event.extra.currentLine = $currentLine;

          const $currentSyllable = getStore(currentSyllable);
          if ($currentSyllable) event.extra.currentSyllable = $currentSyllable;
        }
        catch (err)
        {
          console.error(err);
        }

        return event;
      },
    });
  })
</script>

<svelte:head>
  <meta name="application-name" content={$_('app.name')}>
  <meta name="description" content={$_('app.description')}>
  <meta name="keywords" lang="en" content="sing, karaoke, game, singstar, youtube, webaudio">
</svelte:head>

<slot></slot>