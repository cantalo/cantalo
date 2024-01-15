<script>
  import { page } from '$app/stores';
  import { _ } from 'svelte-i18n';

  import Logo from '$lib/components/Logo.svelte';
  import BrowseSongs from '$lib/components/browse/BrowseSongs.svelte';
  import SearchBar from '$lib/components/browse/SearchBar.svelte';

  export let data;

  const { url } = $page;

  let search = url.searchParams.get('q') || '';

  let pause = false;
  let scrollTimeout;

  function scrolling()
  {
    if (scrollTimeout)
    {
      clearTimeout(scrollTimeout);
    }

    pause = true;

    scrollTimeout = setTimeout(() => pause = false, 1000);
  }
</script>

<svelte:head>
  <title>{$_('app.title')}</title>
  <meta name="robots" content="index,nofollow">
</svelte:head>

<style type="text/scss">
  :root
  {
    --thumbnail-bar-width: 500px;
    --angle: 25;
    --angle-deg: calc(1deg * var(--angle));
    --angle-rad: calc(0.017453292519943295 * var(--angle));
    --tan-term1: var(--angle-rad);
    --tan-term2: calc((1/3) * var(--angle-rad) * var(--angle-rad) * var(--angle-rad));
    --tan-term3: calc((2 / 15) * var(--angle-rad) * var(--angle-rad) * var(--angle-rad) * var(--angle-rad) * var(--angle-rad));
    --tan-term4: calc((17/315) * var(--angle-rad) * var(--angle-rad) * var(--angle-rad) * var(--angle-rad) * var(--angle-rad) * var(--angle-rad) * var(--angle-rad));
    --tan: calc(var(--tan-term1) + var(--tan-term2) + var(--tan-term3) + var(--tan-term4));
  }

  header
  {
    display: flex;
    height: 100px;
    padding: 20px;
  }

  .pause
  {
    animation-play-state: paused;
  }
</style>

<div class="browse absolute background" class:pause>
  <header>
    <Logo />
  </header>

  <BrowseSongs songs={data.songs} {search} on:scroll={scrolling} />

  <SearchBar bind:value={search} />
</div>
