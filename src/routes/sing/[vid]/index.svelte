<script>
  import { onMount, onDestroy, getContext } from 'svelte';
  import { get as getStore } from 'svelte/store';
  import { _ } from 'svelte-i18n';
  import { goto } from '$app/navigation';

  import MicSetup from '../../../components/MicSetup.svelte';
  import Icon from '../../../components/Icon.svelte';
  import Notes from '../../../components/Notes.svelte';
  import Lyrics from '../../../components/Lyrics.svelte';
  import Keyboard from '../../../components/hardware/Keyboard.svelte';
  import IconButton from '../../../components/IconButton.svelte';

  import { players } from '../../../stores/players';
  import { playing, time, loadVideo } from '../../../components/YouTube.svelte';

  import playIcon from './play-icon.svg?raw';
  import pauseIcon from './pause-icon.svg?raw';
  import backIcon from './back-icon.svg?raw';
  import restartIcon from './restart-icon.svg?raw';
  import videoIcon from './video-icon.svg?raw';

  const meta = getContext('meta');

  onMount(async () =>
  {
    await players.initialized;
    await Promise.all(getStore(players).map(player => player.mic.init()));
    loadVideo(meta.id, meta.videogap, meta.videoend, true);
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
    $playing = !$playing;
  }

  $: {
    if ($playing === null && $time > 0 || meta.end && $time > meta.end)
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

<MicSetup>
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
</MicSetup>