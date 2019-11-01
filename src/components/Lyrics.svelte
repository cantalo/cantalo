<script>
  import { fade } from 'svelte/transition';
  import Syllable from './Syllable.svelte';
  import StartIndicator from "./StartIndicator.svelte";

  export let song, time, playing;

  const warmUpTime = 2000;

  function getIndicatorDuration(line)
  {
    const [firstSyllable] = line.syllables;
    return Math.min(warmUpTime + firstSyllable.start - line.start, firstSyllable.start);
  }
</script>

<style>
  .lyrics
  {
    position: relative;
    display: flex;
    height: 25%;
    background-color: rgba(0,0,0,.5);
    pointer-events: none;
  }
  .text
  {
    flex: 1;
    height: calc(2em * 1.5);
    overflow-y: hidden;
    margin: auto 0;
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

<div class="lyrics" class:paused={!playing}>
  <div class="text">
    {#each song as line}
      {#if line.end > time && time > (line.start - warmUpTime)}
      <div in:fade>
        <div class:inactive={!playing}>
          <StartIndicator duration={getIndicatorDuration(line)}
          /><span class:inactive={line.start > time}>
            {#each line.syllables as syllable}
              <Syllable type={syllable.type} offset={syllable.start - line.start} duration={syllable.length}>{syllable.text}</Syllable>
            {/each}
          </span>
        </div>
      </div>
      {/if}
    {/each}
  </div>
</div>