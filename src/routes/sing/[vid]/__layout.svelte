<script context="module">
  export async function load({ page, session, fetch })
  {
    const { params } = page;
    const res = await fetch(`${params.vid}.json`);
    const data = await res.json();

    if (res.status === 200)
    {
      session.played.add(params.vid);
      return { props: data };
    }

    return {
      status: res.status,
      error: data.message,
    }
  }
</script>

<script>
  import { onDestroy, setContext } from 'svelte';
  import { get as getStore } from 'svelte/store';
  import { song as songStore } from '$lib/stores/song';
  import { players } from '$lib/stores/players'

  import YouTube, { resetVideo } from "$lib/components/YouTube.svelte";

  export let meta;
  export let lines;
  export let suggestion;

  function reset()
  {
    songStore.reset();
    resetVideo();
    getStore(players).forEach(player => player.sung.reset())
  }

  $:
  {
    reset();
    setContext('meta', meta);
    setContext('suggestion', suggestion);
    songStore.set(meta, lines);
  }

  onDestroy(reset);
</script>

<svelte:head>
  <meta name="robots" content="none">
</svelte:head>

<YouTube />

<slot/>