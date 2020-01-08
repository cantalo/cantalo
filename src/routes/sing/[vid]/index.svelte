<script>
  import { onMount, onDestroy, getContext } from 'svelte';
  import { goto } from '@sapper/app';

  import YouTube from '../../../components/YouTube.svelte';
  import Notes from '../../../components/Notes.svelte';
  import Lyrics from '../../../components/Lyrics.svelte';

  import AnimationFrames from "../../../services/AnimationFrames";
  import Microphone from '../../../services/Microphone';
  import { players } from '../../../stores/players';
  import { title } from '../../../config';

  const meta = getContext('meta');
  const song = getContext('song');

  let animationFrames, microphone;

  let player, time, playing;

  onMount(async () =>
  {
    animationFrames = new AnimationFrames();
    microphone = new Microphone();

    await microphone.start();
    microphone.init();

    // TODO move mic bindings into players store
    const micInputs = [microphone.getLeft.bind(microphone), microphone.getRight.bind(microphone)];
    players.subscribe(_players =>
    {
      _players.forEach((player, i) =>
      {
        player.mic.getPitch = micInputs[i];
      });
    })
  });

  onDestroy(() =>
  {
    if (process.browser)
    {
      microphone.stop();
    }
  });

  async function playerReady(event)
  {
    player = event.detail;

    player[sessionStorage.microphoneDeviceId ? 'loadVideoById' : 'cueVideoById'](meta.id, meta.videogap || 0);
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
      animationFrames.remove('PlayTime');
      playing = false;

      if (event.detail === YT.PlayerState.ENDED)
      {
        microphone.stop();
        goto(`/sing/${meta.id}/score`, { replaceState: true });
      }
    }
  }

  function updatePlayTime()
  {
    time = player.getCurrentTime() * 1000;
    animationFrames.add('PlayTime', updatePlayTime);
  }
</script>

<svelte:head>
  <title>Sing {meta.title} from {meta.artist} at {title}</title>
</svelte:head>

<style type="text/scss">
  :global(.overlay)
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
</style>

<span>
  <YouTube on:ready={playerReady} on:stateChange={playerStateChange} />

  {#if time}
    <div class="overlay">
      {#each $players as player}
      <Notes {time} {playing} {player} />
      {/each}
      <Lyrics {time} {playing} />
    </div>
  {/if}
</span>
