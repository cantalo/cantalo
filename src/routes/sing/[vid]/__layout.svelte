<script context="module">
  export async function load({ page, session, fetch })
  {
    const { params } = page;
    const res = await fetch(`/sing/${params.vid}.json`);
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
  import { setContext } from 'svelte';
  import { song as songStore } from '$lib/stores/song';

  import YouTube from "$lib/components/YouTube.svelte";

  export let meta;
  export let lines;
  export let suggestion;

  $:
  {
    setContext('meta', meta);
    setContext('suggestion', suggestion);
    songStore.reset();
    songStore.set(meta, lines);
  }
</script>

<svelte:head>
  <meta name="robots" content="none">
</svelte:head>

<YouTube />

<slot/>