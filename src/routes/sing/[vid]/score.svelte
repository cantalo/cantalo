<script context="module">
  import SystemRequirements from '../../../services/SystemRequirements';
  SystemRequirements.addCSS('grid', () => CSS.supports('display', 'grid'));
  SystemRequirements.addJS('IndexedDB', () => !!indexedDB);
</script>

<script>
  import { onMount, getContext } from 'svelte';
  import { fly } from 'svelte/transition';

  import { players } from '../../../stores/players';
  import { getHighScoreStore } from "../../../stores/highscores";
  import { title } from '../../../config';

  import ScoreTable from '../../../components/ScoreTable.svelte';

  const meta = getContext('meta');
  const highScores = getHighScoreStore(meta.id);

  let showCurrentScore = false;
  let showHighScore = !process.browser;

  onMount(() =>
  {
    setTimeout(() => showCurrentScore = true, 100);
    setTimeout(() => showHighScore = true, 1000);
  });
</script>

<svelte:head>
  <title>Song score for {meta.title} from {meta.artist} at {title}</title>
</svelte:head>

<style>
  section
  {
    color: #fff;
    width: 60vw;
    margin: auto;
  }

  h1
  {
    font-size: 2em;
    margin-bottom: 10px;
  }

  h2
  {
    font-size: 1.5em;
  }

  h3
  {
    font-size: 1em;
  }

  .song
  {
    overflow: hidden;
  }

  .song h2
  {
    margin-bottom: 0;
  }

  .song h3
  {
    margin-top: 0;
  }

  .cover
  {
    float: left;
    height: 4em;
    width: 4em;
    margin: 15px 10px 0 0;
  }

  .current-scores
  {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 100px;
    font-size: 1.2em;
  }

  .current-scores:not(:empty) + .high-scores
  {
    margin-top: 4em;
    border-top: 1px solid rgba(255, 255, 255, .3);
  }
</style>

<div class="absolute background">
  <section>
    <h1>Song score</h1>

    <div class="song">
      <div class="cover">
        <img src="https://img.youtube.com/vi/{meta.id}/hqdefault.jpg" alt="Cover">
      </div>
      <h2>{meta.title}</h2>
      <h3>{meta.artist}</h3>
    </div>

    {#if showCurrentScore}
      <div class="current-scores" in:fly={{ y: 30, duration: 700 }}>
        {#each $players as player, index}
          <ScoreTable {index} {player} on:save={({ detail }) => highScores.add(detail)} />
        {/each}
      </div>
    {/if}

    {#if showHighScore && $highScores && $highScores.length}
      <div class="high-scores" in:fly={{ y: 50, duration: 2000 }}>
        <h2>High scores</h2>
        <table>
          {#each $highScores as entry, index}
            <tr>
              <th>{index + 1}.</th>
              <th>{entry.playerName}</th>
              <td>{entry.score}</td>
            </tr>
          {/each}
        </table>
      </div>
    {/if}
  </section>
</div>
