<svelte:head>
  <link href="https://fonts.googleapis.com/css?family=Play:400,700&amp;subset=latin-ext" rel="stylesheet">
</svelte:head>

<script>
  import { fade } from 'svelte/transition';
  import Syllable from './Syllable.svelte';
  export let song, time, playing;
</script>

<style>
  .song
  {
    position: absolute;
    bottom: 10%;
    left: 0;
    right: 0;
    height: 2em;
    overflow: hidden;
    font-family: Play;
    font-size: 2em;
    font-weight: bold;
    text-align: center;
    line-height: 1;
    background-color: rgba(0,0,0,.5);
    color: lightskyblue;
  }
  .inactive
  {
    animation-play-state: paused;
  }
</style>

<div class="song">
  {#each song as line}
    {#if line.end > time && time > (line.start - 2000)}
    <div in:fade>
      <div class:inactive={line.start > time || !playing}>
        {#each line.syllables as syllable}
          <Syllable offset={syllable.start - line.start} duration={syllable.length}>{syllable.text}</Syllable>
        {/each}
      </div>
    </div>
    {/if}
  {/each}
</div>