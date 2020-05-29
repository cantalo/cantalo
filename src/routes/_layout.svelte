<script context="module">
  import { waitLocale, init } from 'svelte-i18n';

  export async function preload(page, { lang })
  {
    init({
      fallbackLocale: 'en',
      initialLocale: lang,
    });

    return waitLocale(lang);
  }
</script>

<script>
  import { _ } from 'svelte-i18n';

  import WelcomeDialog from '../components/WelcomeDialog.svelte';
</script>

<svelte:head>
  <meta name="application-name" content={$_('app.name')}>
  <meta name="description" content={$_('app.description')}>
  <meta name="keywords" lang="en" content="sing, karaoke, game, singstar, youtube">
</svelte:head>

<WelcomeDialog />

<slot></slot>