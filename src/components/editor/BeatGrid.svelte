<script>
  import Menu from '@smui/menu';
  import List, { Item, Text, Separator } from '@smui/list';

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

  let selectedSyllables = new Set();

  function selectSyllable(e, syllable)
  {
    if (selectedSyllables.has(syllable))
    {
      selectedSyllables.delete(syllable);
    }
    else
    {
      if (!e.ctrlKey)
      {
        selectedSyllables.clear();
      }
      selectedSyllables.add(syllable);
    }

    selectedSyllables = selectedSyllables;
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

  function selectAll({ detail: e })
  {
    e.preventDefault();
    $lines.forEach(line => selectedLines.add(line));
    selectedLines = selectedLines;
  }

  function paste()
  {
    if (selectedLines.size > 0 && cutSelectedLines && currentBeat)
    {
      const _lines = Array.from(selectedLines);
      const diff = _lines[0].start - currentBeat;

      _lines.forEach(line =>
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

  function moveBeat({ detail: e }, factor)
  {
    e.preventDefault();

    selectedSyllables.forEach(syllable =>
    {
      syllable.start += factor;
    });

    $lines = $lines;
  }

  function changeBeatLength({ detail: e }, factor)
  {
    e.preventDefault();

    selectedSyllables.forEach(syllable =>
    {
      syllable.length += factor;
    });

    $lines = $lines;
  }

  let syllableMenu;
  let stylableMenuDetails;

  function openSyllableMenu({ detail })
  {
    stylableMenuDetails = detail;
    const position = detail.element.getBoundingClientRect();
    syllableMenu.setAbsolutePosition(position.x + (position.width / 2), position.y + (position.height / 2));
    syllableMenu.hoistMenuToBody(true);
    syllableMenu.setOpen(true);
  }

  function changeSyllableText({ syllable })
  {
    syllable.text = prompt('Syllable text:', syllable.text) || syllable.text;
    $lines = $lines;
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

<Keyboard on:cut={() => { if (selectedLines.size > 0) cutSelectedLines = true }}
          on:paste={paste}
          on:select-all={selectAll}
          on:right={e => moveBeat(e, 1)}
          on:left={e => moveBeat(e, -1)}
          on:shift-right={e => changeBeatLength(e, 1)}
          on:shift-left={e => changeBeatLength(e, -1)}
/>

<div class="grid" style="--beat-size: {100 / beats}%">
  {#each $lines as line, index}
    <Line {line} {beats} cut={cutSelectedLines} selected={selectedLines.has(line)}
          on:click={() => selectLine(line)} on:comment={() => addComment(line)}>
      Line  {index + 1}
    </Line>
    {#each line.syllables as syllable}
      <Syllable {syllable} {beats} selected={selectedSyllables.has(syllable)}
                on:click={e => selectSyllable(e, syllable)}
                on:menu={e => openSyllableMenu({ line, syllable, element: e.detail } )} />
    {/each}
  {/each}
</div>

<Menu bind:this={syllableMenu} anchor={false}>
  <List>
    <Item on:SMUI:action={() => changeSyllableText(stylableMenuDetails)}><Text>Change Text</Text></Item>
    <Item on:SMUI:action={() => console.log('Change Note')}><Text>Change Note</Text></Item>
    <Separator />
    <Item on:SMUI:action={() => console.log('Split')}><Text>Split</Text></Item>
    <Item on:SMUI:action={() => console.log('Remove')}><Text>Remove</Text></Item>
  </List>
</Menu>