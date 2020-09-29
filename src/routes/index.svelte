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

  import Logo from '../components/Logo.svelte';
  import Icon from '../components/Icon.svelte';

  import searchIcon from './search-icon.svg';

  import SystemRequirements from '../services/SystemRequirements';

  SystemRequirements.addCSS('scroll-snap', () => CSS.supports('scroll-snap-type', 'x mandatory'));
  SystemRequirements.addCSS('shape-outside', () => CSS.supports('shape-outside', 'polygon(0 0, 0% 100%, 100% 100%)'));

  export let songs = [];

  let searchbar, search = '';
  let songsElm;

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
      observer = new IntersectionObserver(intersecting, { root: songsElm, rootMargin: '-60% 0% -40% 0%' });
    }

    observer.observe(node);
  }
</script>

<svelte:head>
  <title>{$_('app.title')}</title>
  <meta name="robots" content="index,nofollow">
</svelte:head>

<svelte:window on:keypress={keypress} />

<style type="text/scss">
  header
  {
    display: flex;
    height: 100px;
    padding: 20px;
  }

  .menu
  {
    position: relative;
    align-self: stretch;
    width: 60px;
    margin-left: auto;
  }

  .menu::before
  {
    content: '';
    position: absolute;
    top: 15px;
    left: 10px;
    right: 10px;
    border-top: 2px solid #fff;
    box-shadow: 0 10px #fff, 0 20px #fff;
  }

  .songs
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

    position: absolute;
    top: 0;
    right: calc(100vh * var(--tan));
    bottom: 0;
    left: 0;
    padding-top: 25vh;
    overflow-y: auto;
    overflow-x: hidden;
    scroll-snap-type: y mandatory;
    scroll-padding-top: 45vh;
    scroll-padding-bottom: 10vh;
    transform: skew(var(--angle-deg));
    transform-origin: top left;
    background: linear-gradient(to left, rgba(0, 0, 0, .25) var(--thumbnail-bar-width), transparent calc(var(--thumbnail-bar-width) + 1px));
  }

  .songs::-webkit-scrollbar
  {
    width: 15px;
  }

  .songs::-webkit-scrollbar-track
  {
    background-color: rgba(0, 0, 0, .1);
  }

  .songs::-webkit-scrollbar-track-piece
  {
    background-color: rgba(0,0,0,.1);
  }

  .songs::-webkit-scrollbar-thumb
  {
    background-color: rgba(0,0,0,.3);
    border-radius: 10px;
    border: 0 none;
    outline: 0 none;
  }

  .songs::-webkit-scrollbar-button
  {
    display: none;
  }

  .song
  {
    position: relative;
    display: flex;
    flex-direction: row-reverse;
    transform: skew(calc(var(--angle-deg) * -1)) translateX(28px);
    transform-origin: top left;
    margin: 10% 0;
    scroll-snap-align: start;
    text-decoration: none;
  }

  .song .thumbnail
  {
    width: calc(var(--thumbnail-bar-width) + 100px);
    height: 250px;
    margin-right: -100px;
    overflow: hidden;
    clip-path: polygon(0% 0%, 76.5% 0%, 100% 120%, 19.5% 100%); /* TODO replace magic numbers with calc */
    background: rgba(0,0,0,.2);

    img
    {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }
  }

  .meta
  {
    flex: 1;
    color: #fff;
    transition: opacity .3s ease-out;
  }

  .meta::before
  {
    content: '';
    width: 75px;
    height: 100%;
    float: left;
    shape-outside: polygon(0 25%, 0% 100%, 100% 100%);
  }

  .meta .title
  {
    padding: 0 10% 4px 0;
    font-size: 36px;
    border-bottom: 2px solid #fff;
  }

  .meta .artist
  {
    padding-top: 10px;
    font-size: 26px;
  }

  .meta .details
  {
    display: inline-flex;
    padding-top: 20px;
    padding-left: 4px;
    font-size: 20px;
    gap: 15px;
  }

  .meta .details > div
  {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .meta .details sub
  {
    font-variant: small-caps;
  }

  .song:not(.active) .meta
  {
    opacity: 0;
  }

  .search
  {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 500px;
    height: 50px;
    color: #fff;
    overflow: hidden;
    clip-path: polygon(0 0, 0 100%, 100% 100%, 97.9% 0); /* TODO replace magic number with calc */
  }

  .search label
  {
    position: absolute;
    bottom: 4px;
    left: 8px;
    cursor: pointer;
  }

  .search input
  {
    appearance: none;
    height: 100%;
    width: 100%;
    padding: 4px 0 4px 50px;
    background-color: rgba(#000, 0);
    border: 0 none;
    border-top: 1px solid rgba(#fff, 0);
    color: #fff;
    font-size: 24px;
    transition: border-color .3s linear, background-color .3s linear;
  }

  .search input:invalid:not(:focus)
  {
    width: 0;
    box-shadow: none;
  }

  .search input:focus,
  .search input:valid
  {
    outline: 0 none;
    border-top: 1px solid #fff;
    background-color: rgba(#000, .2);
  }
</style>

<div class="browse absolute background">
  <header>
    <Logo />

    <div class="menu"></div>
  </header>
  <div class="songs" bind:this={songsElm}>
    {#each songsView as song}
      <a class="song" href={"sing/" + song.id} lang={song.language} use:observe>
        <div class="thumbnail">
          <img src="https://img.youtube.com/vi/{song.id}/hqdefault.jpg" alt="" loading="lazy">
        </div>
        <div class="meta">
          <div class="title">{song.title}</div>
          <div class="artist">{song.artist}</div>
          <div>
            <div class="details">
              {#if song.genre}
                <div>
                  {song.genre}
                  <sub>genre</sub>
                </div>
              {/if}
              {#if song.language}
                <div>
                  {song.language.toUpperCase()}
                  <sub>language</sub>
                </div>
              {/if}
              {#if song.year}
                <div>
                  {song.year}
                  <sub>year</sub>
                </div>
              {/if}
            </div>
          </div>
        </div>
      </a>
    {/each}
  </div>

  <div class="search">
    <input type="search" id="search" required spellcheck="false" autocomplete="off" bind:this={searchbar} bind:value={search}>

    <label for="search">
      <Icon data={searchIcon} size="32" />
    </label>
  </div>
</div>