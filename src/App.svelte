<svelte:window bind:innerHeight={windowHeight} bind:innerWidth={windowWidth} />

<script>
  import { onMount } from 'svelte';
  import YouTube from './components/YouTube.svelte';

  let player;
  let playing = true;
  let windowHeight, windowWidth;
  let canvasElm, canvasCtx;
  let text = '';
  let song;
  let prev_bpm, bpm, time;

  onMount(() =>
  {
    canvasCtx = canvasElm.getContext('2d');
  });

  async function playerReady(event)
  {
    player = event.detail;

    const response = await fetch('songfiles/ohrbooten.json');
    song = await response.json();

    //player.setPlaybackRate(0.1);
    player.loadVideoById('LqDe5QeUjHY', 30);
  }

  function playerStateChange(event)
  {
    if (event.detail == YT.PlayerState.PLAYING)
    {
      setInterval(updateCanvas, 10); // TODO add clearInterval onDestroy
    }
  }

  function updateCanvas()
  {
    time = (player.getCurrentTime() - (song.gap / 1000));
    bpm = parseInt(time / 60 * (song.bpm * 4), 10); // WTF bpm * 4?

    if (prev_bpm != bpm)
    {
      prev_bpm = bpm;

      const row = song.song.find(item => item.bpm_start === bpm);

      if (row)
      {
        if (row.text)
        {
          text += row.text;
        }
        if (row.type === 'LINE_BREAK')
        {
          text = '';
        }
      }
    }
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

  h1
  {
    position: absolute;
    bottom: 10%;
    left: 0;
    right: 0;
    /*text-shadow: 0 0 3px #333;*/
    color: #fff;
    text-align: center;
    background-color: rgba(0,0,0,.5);
  }

  dl
  {
    position: absolute;
    top: 10%;
    right: 10%;
    background-color: rgba(0,0,0,.8);
    padding: 10px;
    width: 400px;
    color: #fff;
  }
</style>

<YouTube on:ready={playerReady}
          on:stateChange={playerStateChange}/>

<canvas bind:this={canvasElm}
        width={windowWidth}
        height={windowHeight}
        on:click={togglePlayState}>
</canvas>


<dl>
  {#if song}
  <dd>BPM: {song.bpm}</dd>
  <dd>Gap: {song.gap}</dd>
  {/if}
  <dd>Time: {time}</dd>
  <dd>Current Beat: {bpm}</dd>
</dl>

<h1>{text}</h1>
