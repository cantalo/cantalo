<script>
  import { createEventDispatcher } from 'svelte';
  import { get as getStore } from 'svelte/store';

  export let index;
  export let player;

  const { score } = player;
  const dispatchEvent = createEventDispatcher();

  function save()
  {
    const _score = getStore(score);

    if (player.name.length > 1 && _score > 0)
    {
      dispatchEvent('save', { playerName: player.name, score: _score });
    }
  }
</script>

<style>
  input
  {
    appearance: none;
    display: block;
    background: transparent;
    color: inherit;
    border: 0 none;
    padding: 0 0 2px;
    margin: 0;
    font-size: inherit;
    width: 100%;
    border-bottom: 2px solid transparent;
  }

  input::placeholder
  {
    color: rgba(255,255,255, .5);
    font-style: italic;
  }

  input:focus
  {
    outline: none;
    border-bottom-color: rgba(255,255,255, .3);
  }

  .player
  {
    display: flex;
    margin: 1em 0 .5em;
    font-size: 2em;
  }

  .player .color
  {
    width: calc(1em + 4px);
    height: 1em;
    border-radius: 6px;
    border: 1px solid rgba(0,0,0, .3);
    margin: 2px 10px 0 0;
    box-shadow: inset 0 5px 20px rgba(255,255,255, .5);
    opacity: .8;
  }

  table
  {
    border-collapse: collapse;
    width: 100%;
  }

  th
  {
    text-align: left;
  }

  td
  {
    text-align: right;
  }

  tfoot
  {
    font-size: 1.5em;
  }

  tfoot td,
  tfoot th
  {
    padding-top: .75em;
  }
</style>

{#if $score}
<div class="score">
  <div class="player">
    <div class="color" style="background-color: {player.color}"></div>
    <input type="text" bind:value={player.name} placeholder="Player {index + 1}" spellcheck="false" on:blur={save}>
  </div>

  <table>
    <tbody>
    <tr>
      <th>notes</th>
      <td>{$score}</td>
    </tr>
    <tr>
      <th>line bonus</th>
      <td>{$score.lineBonus}</td>
    </tr>
    <tr>
      <th>golden notes</th>
      <td>{$score.goldenNotes}</td>
    </tr>
    </tbody>
    <tfoot>
    <tr>
      <th>total</th>
      <td>{$score}</td>
    </tr>
    </tfoot>
  </table>
</div>
{/if}
