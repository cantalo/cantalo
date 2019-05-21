<script>
  import { onMount } from 'svelte';
  import AnimationFrames from '../services/AnimationFrames';

  import YouTube from './YouTube.svelte';
  import Notes from './Notes.svelte';
  import Lyrics from './Lyrics.svelte';

  export let meta;

  let player, time, playing;
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
    if (event.detail == YT.PlayerState.PLAYING)
    {
      updatePlayTime();
      playing = true;
    }
    else
    {
      AnimationFrames.remove('PlayTime');
      playing = false;
    }
  }

  function updatePlayTime()
  {
    time = player.getCurrentTime() * 1000;
    AnimationFrames.add('PlayTime', updatePlayTime);
  }
</script>

<YouTube on:ready={playerReady} on:stateChange={playerStateChange} />

{#if song && time}
  <Notes {song} {time} {playing} />
  <Lyrics {song} {time} {playing} />
{/if}
