<script context="module">
  import SystemRequirements from '../services/SystemRequirements.js';
  SystemRequirements.addJS('CSS Typed OM', () => !!(CSS && CSS.number));
</script>

<script>
  import { onMount, onDestroy } from 'svelte';
  import Microphone from '../services/Microphone';
  import Note from '../services/Note';

  onMount(async () =>
  {
    await Microphone.start();
    Microphone.init();
  });

  onDestroy(() =>
  {
    Microphone.stop();
  });

  export let song, time, playing;

  let sungLeft = {};

  $: {
    const line = song.find(line => line.end > time && time > line.start);

    if (line)
    {
      const currentSyllable = line.syllables.find(syllable => syllable.start < time && time < syllable.start + syllable.length);

      if (currentSyllable)
      {
        sungLeft = checkMic(sungLeft, currentSyllable, Microphone.getLeft());
      }
    }
  };

  function checkMic(sungData, syllable, input)
  {
    const sung = sungData[syllable.start] = sungData[syllable.start] || [];
    const lastSung = sung[sung.length - 1];
    const start = (time - syllable.start) * (100 / syllable.length);
    const match = getMatchingClass(syllable, input);

    if (lastSung && lastSung.match === match)
    {
      lastSung.end = 100 - start;
    }
    else
    {
      sung.push({ start, match });
    }

    return sungData;
  }

  function getMatchingClass(syllable, input)
  {
    if (input !== null)
    {
      if (syllable.type === 0)
      {
        return 'match';
      }

      if (input.note)
      {
        const note = new Note(syllable.pitch);
        const diff = input.note - note;

        if (Math.abs(diff) < 2) // allow half-note tolerance
        {
          return 'match' + (syllable.type === 2 ? ' golden' : '');
        }
        else if (diff < 0)
        {
          return 'too-low';
        }
        else
        {
          return 'too-high';
        }
      }
    }

    return '';
  }

  function notePosition({ attributeStyleMap }, { line, syllable })
  {
    const factor = 100 / (line.end - line.start);

    attributeStyleMap.set('top', CSS.percent((syllable.pitch % 12) * 10));
    attributeStyleMap.set('left', CSS.percent((syllable.start - line.start) * factor));
    attributeStyleMap.set('width', CSS.percent(syllable.length * factor));
  }
</script>

<style>
  .notes
  {
    position: absolute;
    top: 10%;
    right: 15%;
    bottom: 40%;
    left: 15%;
    pointer-events: none;
  }

  .note
  {
    position: absolute;
    height: 20px;
    animation-play-state: inherit;
  }

  .note > div
  {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 6px;
    border: 1px solid transparent;
  }

  .note .pill
  {
    border: 1px solid rgba(255,255,255, .8);
    background: linear-gradient(
      hsla(0, 0%, 100%, 0.6),
      hsla(0, 0%, 100%, 0) 50%,
      hsla(0, 0%, 0%, 0.3) 50%,
      hsla(0, 0%, 100%, 0.2)
    );
    box-shadow: inset 0 -5px 20px hsla(0, 0%, 0%, 0.4),
                inset 0 5px 20px hsla(0, 0%, 100%, 0.4),
                -8px 8px 5px hsla(0, 0%, 0%, 0.15),
                5px 18px 10px hsla(0, 0%, 0%, 0.2);
  }

  .note .time
  {
    background-color: #fff;
    width: 0%;
    opacity: 0;
    animation: grow var(--duration) linear var(--offset) forwards;
    animation-play-state: inherit;
  }

  .note .sung .running
  {
    will-change: right;
  }

  .note .sung .match
  {
    position: absolute;
    top: 0;
    bottom: 0;
    background: red;
  }

  .note .sung .too-high,
  .note .sung .too-low
  {
    position: absolute;
    height: 10px;
    background: red;
    border-radius: 3px;
    z-index: 1;
    opacity: .5;
    margin: 1px 0;
  }

  .note .sung .too-low
  {
    top: 100%;
  }

  .note .sung .too-high
  {
    bottom: 100%;
  }

  .inactive
  {
    animation-play-state: paused;
  }

  @keyframes grow
  {
    1% { opacity: 1; }
    to { opacity: 1; width: 100%; } /* TODO animating width is bad for performence */
  }
</style>

<div class="notes" class:inactive={!playing}>
  {#each song as line}
    {#if line.end > time && time > line.start}
      {#each line.syllables as syllable}
        {#if syllable.type}
          <div class="note" use:notePosition={{line, syllable}}>
            <div class="time" style="--duration: {syllable.length}ms; --offset: {syllable.start - line.start}ms"></div>
            <div class="sung">
              {#if sungLeft[syllable.start]}
                {#each sungLeft[syllable.start] as sung}
                  {#if sung.end && sung.match}
                    <div class={sung.match}
                         class:running={syllable.start + syllable.length > time}
                         style="left: {sung.start}%; right: {sung.end}%">
                    </div>
                  {/if}
                {/each}
              {/if}
            </div>
            <div class="pill"></div>
          </div>
        {/if}
      {/each}
    {/if}
  {/each}
</div>