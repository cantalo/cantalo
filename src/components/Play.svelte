<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import AnimationFrames from '../services/AnimationFrames';

  import YouTube from './YouTube.svelte';
  import Notes from './Notes.svelte';
  import Lyrics from './Lyrics.svelte';

  export let meta;

  const dispatch = createEventDispatcher();
  let player, time, playing, ended = false;
  let song;

  onMount(async () =>
  {
    const response = await fetch(`api/songs/${meta.id}.json`);
    song = await response.json();
  });

  async function playerReady(event)
  {
    player = event.detail;

    // player.setPlaybackRate(0.1);
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
    justify-content: center;
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
      Game over
    </div>
  {:else}
    <YouTube on:ready={playerReady} on:stateChange={playerStateChange} />

    {#if song && time}
      <div class="overlay">
        <Notes {song} {time} {playing} />
        <Lyrics {song} {time} {playing} />
      </div>
    {/if}
  {/if}
</span>