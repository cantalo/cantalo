<script>
  import { onMount, onDestroy, getContext } from 'svelte';
  import { get as getStore } from 'svelte/store';
  import { _ } from 'svelte-i18n';
  import { goto } from '@sapper/app';

  import Notes from '../../../components/Notes.svelte';
  import Lyrics from '../../../components/Lyrics.svelte';

  import { players } from '../../../stores/players';
  import { video, playing, time } from '../../../stores/video';

  const meta = getContext('meta');

  onMount(async () =>
  {
    await players.initialized;
    await Promise.all(getStore(players).map(player => player.mic.init()));
    video.play(meta.id, meta.videogap);
  });

  onDestroy(() =>
  {
    getStore(players).forEach(player =>
    {
      player.mic.stop();
    });
  });

  $: {
    if ($playing === null || meta.videoend && $time > meta.videoend * 1000)
    {
      goto(`/sing/${meta.id}/score`, { replaceState: true });
    }
  }

</script>

<svelte:head>
  <title>{$_('sing.title', { values: { song: meta.title, artist: meta.artist, title: $_('app.title') }})}</title>
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