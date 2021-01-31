<script context="module">
  export async function preload({ params }, session)
  {
    const res = await this.fetch(`sing/${params.vid}.json`);
    const data = await res.json();

    if (res.status === 200)
    {
      session.played.add(params.vid);
      return data;
    }

    this.error(res.status, data.message);
  }
</script>

<script>
  import { onDestroy, setContext } from 'svelte';
  import { get as getStore } from 'svelte/store';
  import { song as songStore } from '../../../stores/song';
  import { video } from '../../../stores/video';
  import { players } from '../../../stores/players'

  import YouTube from "../../../components/YouTube.svelte";

  export let meta;
  export let lines;

  setContext('meta', meta);
  songStore.set(meta, lines);

  onDestroy(() =>
  {
    songStore.reset();
    video.play(null);
    getStore(players).forEach(player => player.sung.reset());
  });
</script>

<svelte:head>
  <meta name="robots" content="none">
</svelte:head>

<YouTube />

<slot/>