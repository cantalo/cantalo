<script context="module">
  export async function preload({ params })
  {
    const res = await this.fetch(`sing/${params.vid}.json`);
    const data = await res.json();

    if (res.status === 200)
    {
      return data;
    }

    this.error(res.status, data.message);
  }
</script>

<script>
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';

  import YouTube from '../../components/YouTube.svelte';
  import Notes from '../../components/Notes.svelte';
  import Lyrics from '../../components/Lyrics.svelte';

  import AnimationFrames from "../../services/AnimationFrames";
  import Microphone from '../../services/Microphone';
  import { title } from '../../config';

  let animationFrames, microphone;

  export let meta;
  export let song;

  const dispatch = createEventDispatcher();
  let player, time, playing, ended = false;
  let mic = {
    left:
    {
      color: 'red',
      score: 0,
      sung: {},
    },
    right:
    {
      color: 'blue',
      score: 0,
      sung: {},
    },
  };

  onMount(async () =>
  {
    animationFrames = new AnimationFrames();
    microphone = new Microphone();

    await microphone.start();
    microphone.init();

    mic.left.getPitch = microphone.getLeft.bind(microphone);
    mic.right.getPitch = microphone.getRight.bind(microphone);
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
      animationFrames.remove('PlayTime');
      playing = false;
      ended = event.detail === YT.PlayerState.ENDED;

      if (ended)
      {
        microphone.stop();
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