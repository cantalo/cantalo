<script>
  import { getMetaData } from '../../../../usd-parser';

  import * as config from '../../config';
  import MetaDefinition from '../../components/MetaDefinition.svelte';

  let artist;
  let title;
  let request;
  let videoUrl;

  let selectedSong;
  let selectedVideo = '';

  function searchSong() {
    const queryString = new URLSearchParams();
    if (artist) queryString.set('artist', artist);
    if (title) queryString.set('title', title);

    if (artist || title)
      request = fetch('add/search/song.json?' + queryString.toString()).then(response => response.json());
  }

  async function selectSong(song) {
    const response = await fetch('add/import.json');
    const {file} = await response.json();
    selectedSong = file;
  }

  $: meta = selectedSong && getMetaData(selectedSong);
</script>

<style>
  main
  {
    height: 100%;
    overflow: auto;
    padding: 50px 100px;
    color: #fff;
  }

  dl
  {
    display: inline-grid;
    grid-template-columns: max-content min-content;
    grid-row-gap: 8px;
    align-items: center;

    + dl
    {
      margin-left: 50px;
    }
  }

  input
  {
    padding: 3px 3px 3px 6px;
    border-radius: 3px;
    background-color: rgba(#fff, .8);
    border: 1px solid #fff;
    font-size: inherit;
  }

  button
  {
    font-size: inherit;
  }
</style>

<svelte:head>
  <title>Add a song {config.title}</title>
</svelte:head>

<main>
  <section id="song-data">
    <h2>1. Import song data</h2>
    <dl>
      <MetaDefinition group="search" label="artist">
        <input type="search" bind:value={artist}>
      </MetaDefinition>
      <MetaDefinition group="search" label="title">
        <input type="search" bind:value={title}>
      </MetaDefinition>
    </dl>
    <button on:click={searchSong}>Search</button>
    {#if request}
    {#await request}
      <i>Searching ...</i>
      {:then results}
      <ul>
        {#each results as result}
        <li on:click={() => selectSong(result)}>{result.artist} - {result.title}</li>
        {/each}
      </ul>
      {:catch err}
      <i>Something went wrong: {err.message}</i>
    {/await}
    {/if}
  </section>

  <section id="video">
    <h2>2. Find video</h2>
    <dl>
      <MetaDefinition group="search" label="video URL">
        <input type="url" required bind:value={selectedVideo}>
      </MetaDefinition>
    </dl>
  </section>

  {#if selectedSong && selectedVideo}
  <section id="editing">
    <h2>3. Editing</h2>
    <dl>
      <MetaDefinition label="artist">
        <input required bind:value={meta.artist}>
      </MetaDefinition>
      <MetaDefinition label="title">
        <input required bind:value={meta.title}>
      </MetaDefinition>
      <MetaDefinition label="genre">
        <input list="meta-genres" bind:value={meta.genre}>
        <datalist id="meta-genres">
          {#each config.availableGenres as genre}
            <option value={genre}>
          {/each}
        </datalist>
      </MetaDefinition>
      <MetaDefinition label="year">
        <input type="number" min="1900" max={(new Date()).getFullYear()} bind:value={meta.year}>
      </MetaDefinition>
      <MetaDefinition label="language">
        <input list="meta-languages" bind:value={meta.language}>
        <datalist id="meta-languages">
          {#each config.availableLanguages as lang}
          <option value={lang}>
          {/each}
        </datalist>
      </MetaDefinition>
      <MetaDefinition label="edition">
        <input bind:value={meta.edition}>
        <!-- TODO datalist of editions -->
      </MetaDefinition>
    </dl>
    <dl>
      <MetaDefinition label="video start">
        <input type="number" bind:value={meta.videogap}>
      </MetaDefinition>
      <MetaDefinition label="video end">
        <input type="number" bind:value={meta.videoend}>
      </MetaDefinition>
      <MetaDefinition label="song start">
        <input type="number" required bind:value={meta.gap}>
      </MetaDefinition>
      <MetaDefinition label="song end">
        <input type="number" bind:value={meta.end}>
      </MetaDefinition>
      <MetaDefinition label="BPM">
        <input type="number" required bind:value={meta.bpm}>
      </MetaDefinition>
    </dl>
    <pre>
      {JSON.stringify(meta, null, 2)}
    </pre>
  </section>
  {/if}
</main>
