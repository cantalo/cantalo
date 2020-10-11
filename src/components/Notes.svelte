<script>
  import Score from './Score.svelte';
  import { currentLine } from '../stores/song';
  import { time, playing } from '../stores/video';
  import isAhead from '../stores/players/ahead';

  export let player;
  const { sung, score } = player;
  const ahead = isAhead(player);

  let scoreElm;

  currentLine.subscribe(() =>
  {
    if (scoreElm)
    {
      scoreElm.randomShape();
    }
  });

  function notePosition({ style }, { line, syllable })
  {
    const factor = 100 / (line.end - line.start);

    style.top = (((syllable.pitch - line.minPitch || 1) * 90) / (line.maxPitch - line.minPitch || 2)) + '%';
    style.left = ((syllable.start - line.start) * factor) + '%';
    style.width = (syllable.length * factor) + '%';
  }
</script>

<style>
  .notes
  {
    position: relative;
    height: 100%;
    margin: 0 15%;
    flex: 1;
  }

  .note
  {
    position: absolute;
    height: 20px;
  }

  .note.golden
  {
    box-shadow: 0 0 15px 5px goldenrod;
    border-radius: 6px;
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
    width: 0;
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
    background: currentColor;
  }

  .note .sung .too-high,
  .note .sung .too-low
  {
    position: absolute;
    height: 10px;
    background: currentColor;
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
    to { opacity: 1; width: 100%; } /* TODO animating width is bad for performance */
  }

  .score
  {
    position: absolute;
    top: 50%;
    left: 100%;
    transform: translateY(-50%);
  }
</style>

<div class="notes" class:inactive={!$playing} style="color: {player.color}">
  {#if $currentLine}
    {#each $currentLine.syllables as syllable, i (syllable.start)}
      {#if syllable.type}
        <div class="note" use:notePosition={{line: $currentLine, syllable}} class:golden={syllable.type === 2}>
          <div class="time" style="--duration: {syllable.length}ms; --offset: {syllable.start - $currentLine.start}ms"></div>
          <div class="sung">
            {#if $sung.at($currentLine, syllable)}
              {#each $sung.at($currentLine, syllable) as sungPart}
                {#if sungPart.end && sungPart.match}
                  <div class={sungPart.match}
                       class:running={syllable.start + syllable.length > $time}
                       style="left: {sungPart.start}%; right: {sungPart.end}%">
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
  {#if $score.total}
    <div class="score">
      <Score bind:this={scoreElm} color={player.color} ahead={$ahead}>{$score.total}</Score>
    </div>
  {/if}
</div>
