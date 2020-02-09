<script>
  import { tick } from 'svelte';
  import { getMetaData, getSongData } from '../../../../parser';
  import * as config from '../../config';

  import MetaDefinition from '../../components/MetaDefinition.svelte';
  import SearchResults from '../../components/SearchResults.svelte';

  const section = {};
  const songSearch = { artist: '', title: '' };
  const videoSearch = { term: '' };

  let songContent;

  function searchSong()
  {
    const queryString = new URLSearchParams();
    if (songSearch.artist) queryString.set('artist', songSearch.artist);
    if (songSearch.title) queryString.set('title', songSearch.title);

    if (songSearch.artist || songSearch.title)
      songSearch.request = fetch('add/search/song.json?' + queryString).then(response => response.json());
  }

  async function importSong(song)
  {
    const queryString = new URLSearchParams();
    queryString.set('id', song.id);
    const response = await fetch('add/import.json?' + queryString);
    const { file } = await response.json();
    songContent = file;
  }

  async function searchVideo()
  {
    const queryString = new URLSearchParams();
    queryString.set('search', videoSearch.term);

    if (videoSearch.term)
    {
      videoSearch.request = await fetch('add/search/video.json?' + queryString).then(response => response.json());
    }
  }

  $: meta = songContent && getMetaData(songContent);
  $: song = songContent && meta && getSongData(meta, songContent);
  $: if (songSearch.selected)
  {
    videoSearch.term = `${songSearch.selected.artist} ${songSearch.selected.title}`;
  }
  $: if (songContent)
  {
    section.video.scrollIntoView({ behavior: 'smooth' });
  }
  $: if (videoSearch.selected)
  {
    tick().then(() =>
    {
      section.editing.scrollIntoView({ behavior: 'smooth' });
    });
  }
</script>

<style>
  main
  {
    height: 100%;
    overflow: auto;
    padding: 50px 100px;
    color: #fff;
  }

  section
  {
    min-height: 50vh;
    margin-bottom: 100px;
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
        <input type="search" bind:value={songSearch.artist}>
      </MetaDefinition>
      <MetaDefinition group="search" label="title">
        <input type="search" bind:value={songSearch.title}>
      </MetaDefinition>
    </dl>
    <button on:click={searchSong}>Search</button>
    <SearchResults let:result bind:value={songSearch.selected} request={songSearch.request}>
      <div>{result.artist}</div>
      <div>{result.title}</div>
    </SearchResults>
    <div>
      <button on:click={() => importSong(songSearch.selected)} disabled={!songSearch.selected}>Import</button>
    </div>
  </section>

  <section id="video" bind:this={section.video}>
    <h2>2. Find video</h2>
    <dl>
      <MetaDefinition group="search" label="video search">
        <input type="search" required bind:value={videoSearch.term} style="width:630px">
      </MetaDefinition>
    </dl>
    <button on:click={searchVideo}>Search</button>
    <SearchResults let:result bind:value={videoSearch.selected} request={videoSearch.request}>
      <img src={result.thumbnails.default.url}
           width={result.thumbnails.default.width * 0.5}
           height={result.thumbnails.default.height * 0.5}
           alt={result.title}>
      <div>{result.title}</div>
      <div>{result.channel}</div>
    </SearchResults>
  </section>

  {#if songSearch.selected && videoSearch.selected && songContent}
  <section id="editing" bind:this={section.editing}>
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
    <pre>
      {JSON.stringify(song, null, 2)}
    </pre>
  </section>
  {/if}
</main>
