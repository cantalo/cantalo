<script>
  import Fab, { Icon } from '@smui/fab';
  import Menu from '@smui/menu';
  import List, {Item, Separator, Text} from '@smui/list';

  import { lines, untapped } from '../../routes/edit/_editor';

  export let currentBeat;

  let menu;

  function addLine()
  {
    // TODO
  }

  function addSyllable()
  {
    // TODO
  }

  function setSongStart()
  {
    // TODO
  }

  function setSongEnd()
  {
    // TODO
  }

  let tapActive;
  let currentTapSyllable;

  function tapStart()
  {
    if (tapActive) return;
    tapActive = true;

    let syllable = $untapped[0].syllables.shift();

    currentTapSyllable = {
      ...syllable,
      start: currentBeat,
      length: undefined,
    };

    console.log(currentTapSyllable);

    lines.update(_lines =>
    {
      const last = _lines.length - 1;

      if (_lines.length === 0 || _lines[last].end)
      {
        _lines.push({ start: currentBeat, syllables: [currentTapSyllable] })
      }
      else
      {
        _lines[last].syllables.push(currentTapSyllable);
      }

      return _lines;
    });

    $untapped = $untapped;
  }

  function tapEnd()
  {
    tapActive = false;

    currentTapSyllable.length = currentBeat - currentTapSyllable.start;

    if (!$untapped[0].syllables.length)
    {
      lines.update(_lines =>
      {
        _lines[_lines.length - 1].end = currentBeat;
        return _lines;
      });

      $untapped.shift();
      $untapped = $untapped;
    }
  }
</script>

<style>
  .cue
  {
    position: absolute;
    left: 50%;
    top: 20px;
    z-index: 1;
    bottom: 20px;
    width: 2px;
    margin-left: -1px;
    background: red;
    border-radius: 2px;
    opacity: .9;
  }

  .cue .beat
  {
    position: absolute;
    bottom: 64px;
    left: 50%;
    padding: 2px 4px;
    background: inherit;
    border-radius: 3px;
    font-size: 12px;
    color: #fff;
    transform: translateX(-50%);
  }

  .cue .button
  {
    position: absolute;
    bottom: 8px;
    left: 50%;
    transform: translateX(-50%);
  }
</style>

<div class="cue">
  {#if !isNaN(currentBeat)}
    <div class="beat">{currentBeat}</div>
  {/if}

  <div class="button">
    {#if $untapped.length > 0}
      <Fab color="primary"
           on:mouseenter={e => e.target.focus()}
           on:mousedown={tapStart} on:mouseup={tapEnd}
           on:keydown={tapStart} on:keyup={tapEnd}>
        <Icon class="material-icons">touch_app</Icon>
      </Fab>
    {:else}
      <Fab color="primary" mini on:click={() => menu.setOpen(true)}>
        <Icon class="material-icons">add</Icon>
      </Fab>
    {/if}

    <Menu bind:this={menu}>
      <List>
        <Item on:SMUI:action={setSongEnd}><Text>Set song end</Text></Item>
        <Item on:SMUI:action={setSongStart}><Text>Set song start</Text></Item>
        <Separator />
        <Item on:SMUI:action={addSyllable}><Text>Add Syllable</Text></Item>
        <Item on:SMUI:action={addLine}><Text>Add Line</Text></Item>
      </List>
    </Menu>
  </div>
</div>