<script>
  import { createEventDispatcher } from 'svelte';

  import Note from '../../services/Note';

  export let syllable;
  export let beats;
  export let selected = false;

  const dispatch = createEventDispatcher();
</script>

<style>
  .syllable
  {
    position: absolute;
    top: 80px;
    bottom: 120px;
  }

  .syllable .pitch
  {
    position: absolute;
    width: 100%;
    font-weight: bold;
    font-size: 12px;
    text-align: center;
    white-space: nowrap;
    background: rgba(#A52A2A, .1);
    border-left: 1px solid rgba(0,0,0, .1);
    border-right: 1px solid rgba(0,0,0, .1);
  }

  .syllable .bar
  {
    position: absolute;
    top: 100%;
    width: 100%;
  }

  .syllable .bar::before
  {
    content: '';
    display: block;
    height: 15px;
    background: rgba(#A52A2A, .5);
    border-radius: 5px;
    border: 1px solid rgba(0,0,0, .6);
  }

  .syllable.freestyle .pitch
  {
    background: rgba(#ccc, .1);
  }

  .syllable.freestyle .bar::before
  {
    background: rgba(#ccc, .5);
    border-style: dashed;
  }

  .syllable.golden .pitch
  {
    background: rgba(#DAA520, .1);
  }

  .syllable.golden .bar::before
  {
    background: rgba(#DAA520, .5);
  }

  .syllable .bar.selected::before
  {
    box-shadow: 0 0 10px #1e90ff;
  }
</style>

<div class="syllable" class:freestyle={syllable.type === 0} class:golden={syllable.type === 2}
     style="left: {100 / beats * syllable.start}%;
            width: {100 / beats * syllable.length}%">
  <div class="text">{syllable.text}</div>
  <div class="pitch" style="height: {syllable.pitch ? (100 / 12 * (syllable.pitch % 12)) : 10}%">
    <div class="bar" class:selected on:click
         on:contextmenu|preventDefault={e => { dispatch('menu', e.target); return false }}>
      {#if syllable.pitch}
        {new Note(syllable.pitch).toString()}<sub>{Math.ceil(syllable.pitch / 12)}</sub>
      {/if}
    </div>
  </div>
</div>