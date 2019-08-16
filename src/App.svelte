<svelte:head>
  <link href="https://fonts.googleapis.com/css?family=Nunito:400,400i,600" rel="stylesheet">
</svelte:head>

<script>
  import { onMount, tick } from 'svelte';
  import Microphone from './services/Microphone';
  import SystemRequirements from './services/SystemRequirements';

  import Browse from './components/Browse.svelte';
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
</style>

{#if selectedSong}
  <Play meta={selectedSong} />
{:else if songs}
  <Browse {songs} on:select={({ detail }) => selectedSong = detail} />
{/if}