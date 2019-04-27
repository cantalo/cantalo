<svelte:window bind:innerHeight={windowHeight} bind:innerWidth={windowWidth} />

<script>
  import { onMount } from 'svelte';
  import Microphone from './services/Microphone.js';

  import YouTube from './components/YouTube.svelte';
  import Lyrics from './components/Lyrics.svelte';

  export let songId;

  let player, time, playing = true;
  let song;
  let windowHeight, windowWidth;
  let canvasElm, canvasCtx;
  let micLeft = {}, micRight = {};

  onMount(async () =>
  {
    // canvasCtx = canvasElm.getContext('2d');
    const permission = await Microphone.requestPermission();
    console.log('Microphone permission:', permission);

    const response = await fetch(`api/songs/${songId}.json`);
    song = await response.json();
  });

  async function playerReady(event)
  {
    player = event.detail;

    // player.setPlaybackRate(0.1);
    player.loadVideoById('LqDe5QeUjHY', 30);
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

  async function startMic()
  {
    await Microphone.start();

    Microphone.updates().subscribe(data =>
    {
      micLeft = data.left;
      micRight = data.right;
    });
  }
</script>

<style>
  :global(html, body)
  {
    height: 100%;
    width: 100%;
    margin: 0;
    overflow: hidden;
  }

  canvas
  {
    position: absolute;
    top: 0;
  }
</style>

<!-- <button on:click={startMic}>Start</button>

<div style="display:flex">
  <div style="width: 100px">
    <h4>Left</h4>
    Note: {micLeft && micLeft.note || ''}
  </div>

  <div style="width:100px">
    <h4>Right</h4>
    Note: {micRight && micRight.note || ''}
  </div>
</div> -->

<YouTube on:ready={playerReady}
         on:stateChange={playerStateChange}/>

<canvas bind:this={canvasElm}
        width={windowWidth}
        height={windowHeight}
        on:click={togglePlayState}>
</canvas>

{#if song && time}
  <Lyrics song={song} time={time} playing={playing} />
{/if}
