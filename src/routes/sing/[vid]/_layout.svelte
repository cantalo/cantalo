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
  import { onDestroy, setContext } from 'svelte';
  import { song as songStore } from '../../../stores/song';

  import YouTube from "../../../components/YouTube.svelte";

  export let meta;
  export let song;

  setContext('meta', meta);
  songStore.set(song);

  onDestroy(() =>
  {
    songStore.set(null);
  });
</script>

<YouTube />

<slot></slot>