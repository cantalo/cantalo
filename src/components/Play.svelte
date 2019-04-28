<script>
  import { onMount } from 'svelte';

  import YouTube from './YouTube.svelte';
  import Notes from './Notes.svelte';
  import Lyrics from './Lyrics.svelte';

  export let meta;

  let player, time, playing = true;
  let song;
  let windowHeight, windowWidth;
  let canvasElm, canvasCtx;

  onMount(async () =>
  {
    // canvasCtx = canvasElm.getContext('2d');

    const response = await fetch(`api/songs/${meta.id}.json`);
    song = await response.json();
  });

  async function playerReady(event)
  {
    player = event.detail;

    // player.setPlaybackRate(0.1);
    player.loadVideoById(meta.id, meta.gap);
  }

  function playerStateChange(event)
  {
    if (event.detail == YT.PlayerState.PLAYING)
    {
      // WARNING/FIXME can cause double interval when toggling play/pause
      setInterval(updatePlayTime, 50); // TODO add clearInterval onDestroy
    }
  }

  function updatePlayTime()
  {
    time = player.getCurrentTime() * 1000;
  }

  function togglePlayState()
  {
    if (playing)
    {
      player.pauseVideo();
    }
    else
    {
      player.playVideo();
    }

    playing = !playing;
  }
</script>

<style>
  canvas
  {
    position: absolute;
    top: 0;
  }
</style>

<svelte:window bind:innerHeight={windowHeight} bind:innerWidth={windowWidth} />

<YouTube on:ready={playerReady}
         on:stateChange={playerStateChange}/>

<canvas bind:this={canvasElm}
        width={windowWidth}
        height={windowHeight}
        on:click={togglePlayState}>
</canvas>

{#if song && time}
  <Notes {song} {time} {playing} />
  <Lyrics {song} {time} {playing} />
{/if}
