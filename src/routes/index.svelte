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
  import { onMount } from 'svelte';
  import { _ } from 'svelte-i18n';

  import SystemRequirements from '../services/SystemRequirements';

  SystemRequirements.addCSS('scroll-snap', () => CSS.supports('scroll-snap-type', 'x mandatory'));

  export let songs;
  let searchbar, search = '';
  let songsElm, viewHeight;
  const angle = 360 -25;

  function keypress()
  {
    if (document.activeElement !== searchbar)
    {
      searchbar.focus();
    }
  }

  $: searchTerm = search.replace(/beta:\s?/, '').toLowerCase();
  $: songsView = search ?
    songs
    .filter(song => search.startsWith('beta:') === !!song.beta)
    .filter(song =>
      song.title.toLowerCase().startsWith(searchTerm) ||
      song.artist.toLowerCase().startsWith(searchTerm) ||
      (song.genre && song.genre.toLowerCase().includes(searchTerm)) ||
      (song.edition && song.edition.toLowerCase().includes(searchTerm)) ||
      (song.language && searchTerm === `lang:${song.language}`) ||
      (song.year && searchTerm === `year:${song.year}`)
    ) : songs.filter(song => !song.beta);

  $: songsViewHeight = songsElm && Math.ceil((songsElm.clientWidth * Math.sin(angle) + viewHeight) / Math.sin(180 - angle)) - 500;
  // $: songsViewHeight = viewHeight + 500;

  function intersecting(entries)
  {
    entries.forEach(({ target, isIntersecting }) =>
    {
      target.classList.toggle('active', isIntersecting);
    });
  }

  let observer;

  function observe(node)
  {
    if (!observer)
    {
      observer = new IntersectionObserver(intersecting, { root: songsElm, rootMargin: '-60% 0% -30% 0%' });
    }

    observer.observe(node);
  }
</script>

<svelte:head>
  <title>{$_('app.title')}</title>
  <meta name="robots" content="index,nofollow">
</svelte:head>

<svelte:window on:keypress={keypress} bind:innerHeight={viewHeight} />

<style type="text/scss">
  .songs
  {
    --thumbnail-bar-width: 500px;

    position: absolute;
    bottom: 0;
    right: -50px;
    height: 100%;
    padding-top: 80vh;
    overflow-y: scroll;
    overflow-x: hidden;
    scroll-snap-type: y proximity;
    transform: rotate(var(--angle));
    transform-origin: bottom right;
    background: linear-gradient(to left, rgba(0, 0, 0, .25) var(--thumbnail-bar-width), transparent calc(var(--thumbnail-bar-width) + 1px));
  }

  .song
  {
    position: relative;
    display: flex;
    flex-direction: row-reverse;
    transform: rotate(calc(var(--angle) * -1));
    margin: 10% 0;
    scroll-snap-align: start;
  }

  .song .thumbnail
  {
    width: calc(var(--thumbnail-bar-width) + 100px);
    height: 250px;
    margin-right: -100px;
    overflow: hidden;
    clip-path: polygon(0% 0%, 75% 0%, 100% 120%, 20% 100%);
    text-decoration: none;

    img
    {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }
  }

  .song dl
  {
    flex: 1;
    color: #fff;
    font-size: 30px;
    border-top: 2px solid #fff;
    padding-right: 10%;
    transition: opacity .3s ease-out;
  }

  .song:not(.active) dl
  {
    opacity: 0;
  }
</style>

<div class="browse absolute background">
<!--  <input type="search" class="search"-->
<!--         required spellcheck="false"-->
<!--         bind:this={searchbar} bind:value={search}>-->

  <div class="songs" bind:this={songsElm} style="--angle: {angle}deg; height: {songsViewHeight}px">
    {#each songsView as song}
      <div class="song" lang={song.language} use:observe>
        <a class="thumbnail" href={"sing/" + song.id}>
          <img src="https://img.youtube.com/vi/{song.id}/hqdefault.jpg" alt="Cover">
        </a>
        <dl>
          <dd>{song.title}</dd>
          <dd class="artist">{song.artist}</dd>
        </dl>
      </div>
    {/each}
  </div>
</div>