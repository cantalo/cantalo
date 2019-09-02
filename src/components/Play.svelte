<script>
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import AnimationFrames from '../services/AnimationFrames';
  import Microphone from '../services/Microphone';

  import YouTube from './YouTube.svelte';
  import Notes from './Notes.svelte';
  import Lyrics from './Lyrics.svelte';

  export let meta;

  const dispatch = createEventDispatcher();
  let player, time, playing, ended = false;
  let song;
  let mic = {
    left:
    {
      color: 'red',
      getPitch: Microphone.getLeft.bind(Microphone),
      score: 0,
      sung: {},
    },
    right:
    {
      color: 'blue',
      getPitch: Microphone.getRight.bind(Microphone),
      score: 0,
      sung: {},
    },
  };

  onMount(async () =>
  {
    const response = await fetch(`api/songs/${meta.id}.json`);
    song = await response.json();
    await Microphone.start();
    Microphone.init();
  });

  onDestroy(() =>
  {
    Microphone.stop();
  });

  async function playerReady(event)
  {
    player = event.detail;

    player.loadVideoById(meta.id, meta.videogap || 0);
  }

  function playerStateChange(event)
  {
    if (event.detail === YT.PlayerState.PLAYING)
    {
      updatePlayTime();
      playing = true;
    }
    else
    {
      AnimationFrames.remove('PlayTime');
      playing = false;
      ended = event.detail === YT.PlayerState.ENDED;

      if (ended)
      {
        Microphone.stop();
      }
    }
  }

  function updatePlayTime()
  {
    time = player.getCurrentTime() * 1000;
    AnimationFrames.add('PlayTime', updatePlayTime);
  }
</script>

<style>
  .overlay
  {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    display: flex;
    flex-direction: column;

    pointer-events: none;

    .notes
    {
      flex: 1;
    }
  }

  .game-over
  {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    height: 100%;
    font-size: 60px;
    text-transform: uppercase;
    color: #fff;
    cursor: pointer;
  }
</style>

<span>
  {#if ended}
    <div class="game-over" on:click={() => dispatch('exit')}>
      <div class="result">
        Player {mic.left.color}:<br>
        {mic.left.score}
      </div>
        <div class="result">
          Player {mic.right.color}:<br>
          {mic.right.score}
        </div>
    </div>
  {:else}
    <YouTube on:ready={playerReady} on:stateChange={playerStateChange} />

    {#if song && time}
      <div class="overlay">
        <Notes {song} {time} {playing} mic={mic.left} />
        <Notes {song} {time} {playing} mic={mic.right} />
        <Lyrics {song} {time} {playing} />
      </div>
    {/if}
  {/if}
</span>