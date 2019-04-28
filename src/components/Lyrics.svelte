<script>
  import { fade } from 'svelte/transition';
  import Syllable from './Syllable.svelte';
  export let song, time, playing;
</script>

<style>
  .song
  {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    height: 25%;
    background-color: rgba(0,0,0,.5);
    pointer-events: none;
  }
  .text
  {
    height: calc(2em * 1.5);
    overflow: hidden;
    margin: auto;
    text-align: center;
    font-size: 2em;
    font-weight: bold;
    line-height: 1.5;
    color: lightskyblue;
  }
  .inactive
  {
    animation-play-state: paused;
  }
  .paused
  {
    background: rgba(0,0,0, .9);
  }
</style>

<div class="song" class:paused={!playing}>
  <div class="text">
    {#each song as line}
      {#if line.end > time && time > (line.start - 2000)}
      <div in:fade>
        <div class:inactive={line.start > time || !playing}>
          {#each line.syllables as syllable}
            <Syllable type={syllable.type} offset={syllable.start - line.start} duration={syllable.length}>{syllable.text}</Syllable>
          {/each}
        </div>
      </div>
      {/if}
    {/each}
  </div>
</div>