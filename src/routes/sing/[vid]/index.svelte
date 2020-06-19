<script>
  import { onMount, onDestroy, getContext } from 'svelte';
  import { get as getStore } from 'svelte/store';
  import { _ } from 'svelte-i18n';
  import { goto } from '@sapper/app';
  import Icon from 'svelte-icon'

  import Notes from '../../../components/Notes.svelte';
  import Lyrics from '../../../components/Lyrics.svelte';
  import Keyboard from '../../../components/hardware/Keyboard.svelte';
  import IconButton from '../../../components/IconButton.svelte';

  import { players } from '../../../stores/players';
  import { video, playing, time, playerApi } from '../../../stores/video';

  import playIcon from './play-icon.svg';
  import pauseIcon from './pause-icon.svg';
  import backIcon from './back-icon.svg';
  import restartIcon from './restart-icon.svg';
  import videoIcon from './video-icon.svg';

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

  function togglePause()
  {
    $playing ? $playerApi.pauseVideo() : $playerApi.playVideo();
  }

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
  .overlay
  {
    display: flex;
    flex-direction: column;
  }

  .pause
  {
    display: flex;
    z-index: 1;
    color: #fff;
    --background-opacity: .8;
  }

  .headline
  {
    position: absolute;
    top: 50px;
    left: 50px;

    display: flex;
    align-items: center;

    h1
    {
      font-size: 3em;
      margin-left: 10px;
    }
  }

  nav
  {
    margin: auto;
  }
</style>

<Keyboard on:space={togglePause} on:escape={togglePause} />

<div class="absolute overlay" on:click={togglePause}>
  {#each $players as player}
  <Notes {player} />
  {/each}
  <Lyrics />
</div>

{#if !$playing && $time > 0}
  <div class="absolute background pause">
    <div class="headline">
      <Icon data={pauseIcon} size="5em" />
      <h1>{$_('sing.pause.headline')}</h1>
    </div>

    <nav>
      <IconButton icon={backIcon} href="/">
        {$_('sing.pause.back')}
      </IconButton>
      <IconButton icon={playIcon} on:click={togglePause}>
        {$_('sing.pause.continue')}
      </IconButton>
      <IconButton icon={restartIcon} on:click={() => location.reload()}>
        {$_('sing.pause.restart')}
      </IconButton>
      <IconButton icon={videoIcon} href={'http://youtu.be/' + meta.id}>
        {$_('sing.pause.open_youtube')}
      </IconButton>
    </nav>
  </div>
{/if}