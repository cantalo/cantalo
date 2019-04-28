<svelte:head>
  <link href="https://fonts.googleapis.com/css?family=Nunito:400,400i,600" rel="stylesheet">
</svelte:head>

<script>
  import { onMount, tick } from 'svelte';
  import Microphone from './services/Microphone';
  import SystemRequirements from './services/SystemRequirements';

  import Play from './components/Play.svelte';

  SystemRequirements.addJS('fetch', () => !!fetch);
  SystemRequirements.addCSS('scroll-snap', () => CSS.supports('scroll-snap-type', 'x mandatory'));

  let songs, selectedSong;

  onMount(async () =>
  {
    const permission = await Microphone.requestPermission();
    console.log('Microphone permission:', permission);

    const response = await fetch(`api/songs.json`);
    songs = await response.json();
  });
</script>

<style>
  :global(html, body)
  {
    height: 100%;
    width: 100%;
    margin: 0;
    overflow: hidden;
    font-family: Nunito;
    background: linear-gradient(258deg, #473B7B, #3584A7, #30D2BE);
    background-size: 600% 600%;

    animation: bg-move 60s ease infinite;

    @keyframes bg-move
    {
      0%  { background-position: 34% 0% }
      50% { background-position: 67% 100% }
      100%{ background-position: 34% 0% }
    }
  }

  .songs
  {
    display: flex;
    align-items: center;
    height: 100vh;
    scroll-snap-type: x mandatory;
    overflow-x: scroll;
    overflow-y: hidden;
    scroll-behavior: smooth;
    padding: 0 10%;
  }

  .song
  {
    display: flex;
    align-items: center;
    min-width: 70%;
    scroll-snap-align: center;
    margin: 0 10%;
    background-color: rgba(0,0,0,.3);
    cursor: pointer;

    img
    {
      max-height: 50vh;
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
</style>

{#if selectedSong}
  <Play meta={selectedSong} />
{:else if songs}
  <div class="songs">
    {#each songs as song}
      <div class="song" on:click={() => selectedSong = song}>
        <img src={song.cover} alt="Cover">
        <dl>
          <dd>{song.title}</dd>
          <dd class="artist">{song.artist}</dd>
        </dl>
      </div>
    {/each}
  </div>
{/if}