<script context="module">
  import SystemRequirements from '$lib/services/SystemRequirements';
  SystemRequirements.addCSS('grid', () => CSS.supports('display', 'grid'));
  SystemRequirements.addJS('IndexedDB', () => !!indexedDB);
</script>

<script>
  import { onMount, getContext, onDestroy } from 'svelte';
  import { get as getStore } from 'svelte/store';
  import { fly } from 'svelte/transition';
  import { _ } from 'svelte-i18n';
  import { goto } from '$app/navigation';
  import { browser } from '$app/env';

  import { players } from '$lib/stores/players';
  import { getHighScoreStore } from '$lib/stores/highscores';

  import Icon from '$lib/components/Icon.svelte';
  import IconButton from '$lib/components/IconButton.svelte';
  import ScoreTable from '$lib/components/ScoreTable.svelte';
  import PlayerColor from '$lib/components/PlayerColor.svelte';
  import { resetVideo } from '$lib/components/YouTube.svelte';

  import backIcon from './back-icon.svg?raw';
  import winIcon from './win-icon.svg?raw';

  const meta = getContext('meta');
  const suggestion = getContext('suggestion');
  const highScores = getHighScoreStore(meta.id);
  const highScoreIdByPlayer = new Map();
  const playerColorByHighScoreId = {};

  let showCurrentScore = false;
  let showHighScore = !browser;

  $: highScoresView = $highScores.sort((a, b) => b.score - a.score).slice(0, 10);

  onMount(() =>
  {
    setTimeout(() => showCurrentScore = true, 100);
    setTimeout(() => showHighScore = true, 1000);
  });

  onDestroy(() =>
  {
    getStore(players).forEach(player => player.sung.reset());
  });

  async function save(playerIndex, playerColor, data)
  {
    if (highScoreIdByPlayer.has(playerIndex))
    {
      await highScores.update(highScoreIdByPlayer.get(playerIndex), data.playerName);
    }
    else
    {
      const id = await highScores.add(data);
      highScoreIdByPlayer.set(playerIndex, id);
      playerColorByHighScoreId[id] = playerColor;
    }
  }

  function goToSuggestion()
  {
    resetVideo();
    goto(`/sing/${suggestion.id}/`, { replaceState: true });
  }
</script>

<svelte:head>
  <title>{$_('score.title', { values: { song: meta.title, artist: meta.artist, title: $_('app.title') }})}</title>
</svelte:head>

<style type="text/scss">
  main
  {
    display: flex;
    color: #fff;
  }

  nav
  {
    padding: 30px 15px;
  }

  section
  {
    position: relative;
    width: 60vw;
    margin: 0 auto;
  }

  .icon
  {
    position: fixed;
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

  h2
  {
    margin-bottom: 0;
  }

  h3
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

  .suggestion
  {
    position: absolute;
    top: 20px;
    right: 20px;
    opacity: 0;
    transform: scale(0.75);
    animation: fade-in .5s linear 3s forwards;
    cursor: pointer;
  }

  .suggestion > div
  {
    display: flex;
    width: 250px;
    height: 200px;
    transition: transform .15s ease-in-out;
  }

  .suggestion:hover > div
  {
    transform: scale(1.1);
  }

  .suggestion > div::before
  {
    content: 'next';
    position: absolute;
    right: 100%;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    text-transform: uppercase;
    padding: 2px;
    writing-mode: tb;
    font-weight: bold;
    font-size: 20px;
    background: rgba(0,0,0,.5);
    transform: scale(-1) translateX(-100%);
    animation: pop-out .3s linear 3.2s forwards;
  }

  .suggestion img
  {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .suggestion .overlay
  {
    position: relative;
    width: 100%;
    padding: 0 10px;
    margin-top: auto;
    background: linear-gradient(to top, black 25%, transparent);
  }

  @keyframes fade-in
  {
    50%
    {
      transform: scale(1);
    }
    to
    {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes pop-out
  {
    to
    {
      transform: scale(-1) translateX(0);
    }
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
    margin: 4em 0 2rem;
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
    <IconButton icon={backIcon} href="/">
      {$_('score.back')}
    </IconButton>
  </nav>

  <div class="icon">
    <Icon data={winIcon} size="35vh" />
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
          <ScoreTable {index} {player} on:save={({ detail }) => save(index, player.color, detail)} />
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
                <th>
                  {#if playerColorByHighScoreId[entry.id]}
                    <PlayerColor inline color={playerColorByHighScoreId[entry.id]}>
                      {entry.playerName}
                    </PlayerColor>
                  {:else}
                    {entry.playerName}
                  {/if}
                </th>
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

  {#if suggestion}
    <div class="suggestion" on:click={goToSuggestion}>
      <div>
        <img src="https://img.youtube.com/vi/{suggestion.id}/hqdefault.jpg" alt="Cover">

        <div class="overlay">
          <h2>{suggestion.title}</h2>
          <h3>{suggestion.artist}</h3>
        </div>
      </div>
    </div>
  {/if}
</main>
