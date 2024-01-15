<script>
  import { setContext } from 'svelte';
  import { song as songStore } from '$lib/stores/song';

  import YouTube from "$lib/components/YouTube.svelte";

  export let data;

  $:
  {
    setContext('meta', data.meta);
    setContext('suggestion', data.suggestion);
    songStore.reset();
    songStore.set(data.meta, data.lines);
  }
</script>

<svelte:head>
  <meta name="robots" content="none">
</svelte:head>

<YouTube />

<slot/>