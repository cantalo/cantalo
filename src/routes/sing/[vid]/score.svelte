<script context="module">
  import SystemRequirements from '../../../services/SystemRequirements';
  SystemRequirements.addCSS('grid', () => CSS.supports('display', 'grid'));
  SystemRequirements.addJS('IndexedDB', () => !!indexedDB);
</script>

<script>
  import { onMount, getContext } from 'svelte';
  import { fly } from 'svelte/transition';
  import { _ } from 'svelte-i18n';
  import Icon from 'svelte-icon'

  import { players } from '../../../stores/players';
  import { getHighScoreStore } from "../../../stores/highscores";

  import ScoreTable from '../../../components/ScoreTable.svelte';

  import backIcon from './back-icon.svg';
  import winIcon from './win-icon.svg';

  const meta = getContext('meta');
  const highScores = getHighScoreStore(meta.id);
  const highScoreKeys = new Map();

  let showCurrentScore = false;
  let showHighScore = !process.browser;

  $: highScoresView = $highScores.sort((a, b) => b.score - a.score).slice(0, 10);

  onMount(() =>
  {
    setTimeout(() => showCurrentScore = true, 100);
    setTimeout(() => showHighScore = true, 1000);
  });

  async function save(playerIndex, data)
  {
    if (highScoreKeys.has(playerIndex))
    {
      await highScores.update(highScoreKeys.get(playerIndex), data.playerName);
    }
    else
    {
      highScoreKeys.set(playerIndex, await highScores.add(data));
    }
  }
</script>

<svelte:head>
  <title>{$_('score.title', { values: { song: meta.title, artist: meta.artist, title: $_('app.title') }})}</title>
</svelte:head>

<style>
  main
  {
    display: flex;
    color: #fff;
  }

  nav
  {
    padding: 30px 15px;
    font-size: 1.2em;

    a
    {
      display: inline-flex;
      align-items: center;
      border: 1px solid rgba(#fff, .5);
      border-radius: 8px;
      padding: 4px 10px;
    }

    a span
    {
      margin-left: 10px;
    }

    a:link,
    a:visited
    {
      color: inherit;
      text-decoration: none;
    }
  }

  section
  {
    position: relative;
    width: 60vw;
    margin: 0 auto;
  }

  .icon
  {
    position: absolute;
    bottom: 0;
    right: 40px;
    opacity: .25;
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

  .high-scores table
  {
    width: 60%;
    border-collapse: collapse;
    font-size: 1.1em;
  }

  .high-scores tr
  {
    counter-increment: high-scores;

    &:nth-child(even)
    {
      background: rgba(#fff, .05);
    }
  }

  .high-scores th
  {
    padding: 4px;
    text-align: left;

    &::before
    {
      content: counter(high-scores) '.';
      margin-right: 10px;
    }
  }

  .high-scores td
  {
    padding: 4px;
    text-align: right;
  }

  .empty
  {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 200px;
    font-style: italic;
    font-size: 1.2em;
  }
</style>

<main class="absolute background scrollable">
  <nav>
    <a href="/">
      <Icon data={backIcon} viewBox="0 0 512 512" size="1em" />
      <span>{$_('score.back')}</span>
    </a>
  </nav>
  <div class="icon">
    <Icon data={winIcon} viewBox="0 0 512 512" size="35vh" />
  </div>
  <section>
    <h1>
      {$_('score.headline')}
    </h1>

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
          <ScoreTable {index} {player} on:save={({ detail }) => save(index, detail)} />
        {/each}
      </div>
    {/if}

    {#if showHighScore}
      {#if $highScores && $highScores.length}
        <div class="high-scores" in:fly={{ y: 50, duration: 2000 }}>
          <h2>{$_('score.highscores.headline')}</h2>
          <table>
            {#each highScoresView as entry}
              <tr>
                <th>{entry.playerName}</th>
                <td>{entry.score}</td>
              </tr>
            {/each}
          </table>
        </div>
      {:else}
        <div class="empty">{$_('score.highscores.empty')}</div>
      {/if}
    {/if}
  </section>
</main>
