<script>
  import Keyboard from '../hardware/Keyboard.svelte';
  import Line from './Line.svelte';
  import Syllable from './Syllable.svelte';

  import { lines } from '../../routes/edit/_editor';

  export let beats;
  export let currentBeat;

  function addComment(line)
  {
    const comment = prompt('Comment:', line.comment || ''); // TODO UI

    if (comment)
    {
      line.comment = comment;
    }
    else if (comment === '')
    {
      delete line.comment;
    }

    $lines = $lines;
  }

  let cutSelectedLines = false;
  let selectedLines = new Set();

  function selectLine(line)
  {
    if (selectedLines.has(line))
    {
      selectedLines.delete(line);
    }
    else
    {
      selectedLines.add(line);
    }

    selectedLines = selectedLines;

    if (cutSelectedLines && selectedLines.size === 0)
    {
      cutSelectedLines = false;
    }
  }

  function paste()
  {
    if (selectedLines.size > 0 && cutSelectedLines && currentBeat)
    {
      const lines = Array.from(selectedLines);
      const diff = lines[0].start - currentBeat;

      lines.forEach(line =>
      {
        line.start -= diff;
        line.end -= diff;

        line.syllables.forEach(syllable =>
        {
          syllable.start -= diff;
        });
      })

      cutSelectedLines = false;
      selectedLines.clear();
      $lines = $lines.sort(byLineStart);
    }
  }

  function byLineStart(a, b)
  {
    return a.start - b.start;
  }
</script>

<style>
  .grid
  {
    position: relative;
    flex: 1;
    background: repeating-linear-gradient(
        90deg,
        rgba(255, 255, 255, .5),
        rgba(255, 255, 255, .5) var(--beat-size),
        transparent var(--beat-size),
        transparent calc(var(--beat-size) * 2)
    );
  }
</style>

<Keyboard on:cut={() => { if (selectedLines.size > 0) cutSelectedLines = true }} on:paste={paste} />

<div class="grid" style="--beat-size: {100 / beats}%">
  {#each $lines as line, index}
    <Line {line} {beats} cut={cutSelectedLines} selected={selectedLines.has(line)}
          on:click={() => selectLine(line)} on:comment={() => addComment(line)}>
      Line  {index + 1}
    </Line>
    {#each line.syllables as syllable}
      <Syllable {syllable} {beats} />
    {/each}
  {/each}
</div>