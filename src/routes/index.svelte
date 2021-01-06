<script context="module">
  export async function preload()
  {
    const res = await this.fetch(`index.json`);
    const data = await res.json();

    if (res.status === 200)
    {
      return { songs: data };
    }

    this.error(res.status, data.message);
  }
</script>

<script>
  import { get as getStore } from 'svelte/store';
  import { stores } from '@sapper/app';
  import { _ } from 'svelte-i18n';

  import Logo from '../components/Logo.svelte';
  import BrowseSongs from '../components/browse/BrowseSongs.svelte';
  import SearchBar from '../components/browse/SearchBar.svelte';

  export let songs;

  const { query } = getStore(stores().page);

  let search = query.q || '';
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
</style>

<div class="browse absolute background">
  <header>
    <Logo />
  </header>

  <BrowseSongs {songs} {search} />

  <SearchBar bind:value={search} />
</div>
