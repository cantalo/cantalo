<script>
  import { onMount, onDestroy, getContext } from 'svelte';
  import { goto } from '@sapper/app';

  import YouTube from '../../../components/YouTube.svelte';
  import Notes from '../../../components/Notes.svelte';
  import Lyrics from '../../../components/Lyrics.svelte';

  import Microphone from '../../../services/Microphone';
  import { players } from '../../../stores/players';
  import { video, playing, time } from '../../../stores/video';
  import { title } from '../../../config';

  const meta = getContext('meta');
  const song = getContext('song');

  let microphone;

  onMount(async () =>
  {
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
    });

    video.play(meta.id, meta.videogap);
  });

  onDestroy(() =>
  {
    if (process.browser)
    {
      microphone.stop();
    }
  });

  $: {
    if ($playing === null || meta.videoend && $time > meta.videoend * 1000)
    {
      goto(`/sing/${meta.id}/score`, { replaceState: true });
    }
  }

</script>

<svelte:head>
  <title>Sing {meta.title} from {meta.artist} at {title}</title>
</svelte:head>

<style type="text/scss">
  div
  {
    display: flex;
    flex-direction: column;

    pointer-events: none;
  }
</style>

<div class="absolute">
  {#each $players as player}
  <Notes {player} />
  {/each}
  <Lyrics />
</div>