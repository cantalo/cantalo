<script>
  import { createEventDispatcher } from 'svelte';
  import { get as getStore } from 'svelte/store';
  import { _ } from 'svelte-i18n';

  import PlayerColor from './PlayerColor.svelte';

  export let index;
  export let player;

  const { score } = player;
  const dispatchEvent = createEventDispatcher();

  function save()
  {
    const _score = getStore(score);

    if (player.name.length > 1 && _score.total > 0)
    {
      dispatchEvent('save', {
        playerName: player.name,
        score: _score.total,
      });
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
    padding: 2px 0;
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
    margin: 1em 0 .5em;
    font-size: 2em;
  }

  table
  {
    border-collapse: collapse;
    width: 100%;
  }

  th
  {
    padding: 4px 0;
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

{#if $score.total}
<div class="score">
  <div class="player">
    <PlayerColor color={player.color}>
      <input type="text" bind:value={player.name} placeholder="Player {index + 1}" spellcheck="false" on:blur={save}>
    </PlayerColor>
  </div>

  <table>
    <tbody>
    <tr>
      <th>{$_('score.table.notes')}</th>
      <td>{$score.notes}</td>
    </tr>
    <tr>
      <th>{$_('score.table.lineBonus')}</th>
      <td>{$score.lineBonus}</td>
    </tr>
    <tr>
      <th>{$_('score.table.goldenNotes')}</th>
      <td>{$score.goldenNotes}</td>
    </tr>
    </tbody>
    <tfoot>
    <tr>
      <th>{$_('score.table.total')}</th>
      <td>{$score.total}</td>
    </tr>
    </tfoot>
  </table>
</div>
{/if}
