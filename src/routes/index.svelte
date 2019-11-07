<script>
  import shuffle from 'lodash.shuffle';
  import { onMount } from 'svelte';

  import SystemRequirements from '../services/SystemRequirements';
  import Microphone from '../services/Microphone';
  import { title } from '../config';

  import CoverFlow from "../components/CoverFlow.svelte";

  SystemRequirements.addCSS('scroll-snap', () => CSS.supports('scroll-snap-type', 'x mandatory'));

  export let songs;
  let searchbar, search = '';

  onMount(async () =>
  {
    const permission = await Microphone.requestPermission();
    console.log('Microphone permission:', permission);
  });

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
    ) : shuffle(songs.filter(song => !song.beta)); // FIXME shuffles twice probably due to hydration
</script>

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

<svelte:window on:keypress={keypress} />

<svelte:head>
  <title>{title}</title>
</svelte:head>

<style type="text/scss">
  .browse
  {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }

/*
    &:not([lang="undefined"])::before
    {
      content: attr(lang);

      position: absolute;
      right: 4px;
      top: 4px;
      font-size: 12px;
      text-transform: uppercase;
      padding: 3px;
      border-radius: 3px;
      border: 1px solid rgba(255,255,255, .5);
      color: rgba(255,255,255, .8);
    }

    &:focus
    {
      outline: 0;
      box-shadow: 0 0 40px #fff;
    }

    .cover
    {
      max-height: 50vh;
      max-width: 50vh;
      overflow: hidden;
    }

    img
    {
      max-height: 50vh;
      margin-left: -25%;
    }

    dl
    {
      font-weight: bold;
      color: #fff;
      font-size: 2.5em;
    }
  }

  .artist
  {
    font-size: .5em;
  }*/

  input.search
  {
    background: none transparent;
    border: 0 none;
    border-bottom: 1px solid transparent;
    font-family: inherit;
    font-size: 3rem;
    color: #fff;
    text-align: center;
    max-height: 0;
    overflow: hidden;
    width: 80%;
    height: 100%;
    margin: 0 10%;

    transition: max-height .5s ease-in-out, border-bottom-color .5s ease-in-out;

    &:focus
    {
      outline: none;
    }

    &:focus,
    &:valid
    {
      max-height: 100px;
      border-bottom-color: currentColor;
    }
  }
</style>

<div class="browse">
  <input type="search" class="search"
         required spellcheck="false"
         bind:this={searchbar} bind:value={search}>

  <CoverFlow items={songsView} />
</div>