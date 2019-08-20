<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  export let songs;
  let searchbar, search = '';

  function keypress()
  {
    if (document.activeElement !== searchbar)
    {
      searchbar.focus();
    }
  }

  $: searchTerm = search.toLowerCase();
  $: songsView = search ?
    songs.filter(song =>
      song.title.toLowerCase().startsWith(searchTerm) ||
      song.artist.toLowerCase().startsWith(searchTerm) ||
      (song.genre && song.genre.toLowerCase().includes(searchTerm)) ||
      (song.edition && song.edition.toLowerCase().includes(searchTerm)) ||
      (song.language && searchTerm === `lang:${song.language}`) ||
      (song.year && searchTerm === `year:${song.year}`)
    ) : songs;
</script>

<svelte:window on:keypress={keypress} />

<style>
  .browse
  {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }

  .songs
  {
    display: flex;
    align-items: center;
    flex: 1;
    scroll-snap-type: x mandatory;
    scroll-padding: 0 10vw;
    overflow-x: scroll;
    overflow-y: hidden;
    scroll-behavior: smooth;
    padding: 0 10%;
  }

  .song
  {
    position: relative;
    display: flex;
    align-items: center;
    min-width: 70%;
    scroll-snap-align: center;
    margin: 0 10%;
    background-color: rgba(0,0,0,.3);
    cursor: pointer;

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
  }

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

  <div class="songs">
    {#each songsView as song, i}
      <div class="song" on:click={() => dispatch('select', song)} lang={song.language} tabindex={i}>
        <div class="cover">
          <img src="https://img.youtube.com/vi/{song.id}/hqdefault.jpg" alt="Cover">
        </div>
        <dl>
          <dd>{song.title}</dd>
          <dd class="artist">{song.artist}</dd>
        </dl>
      </div>
    {/each}
  </div>
</div>