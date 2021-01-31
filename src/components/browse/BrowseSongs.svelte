<script context="module">
  import SystemRequirements from '../../services/SystemRequirements';

  SystemRequirements.addCSS('scroll-snap', () => CSS.supports('scroll-snap-type', 'x mandatory'));
  SystemRequirements.addCSS('shape-outside', () => CSS.supports('shape-outside', 'polygon(0 0, 0% 100%, 100% 100%)'));
</script>

<script>
  import SongEntry from './SongEntry.svelte';

  import searchFilter from '../../services/SearchFilter';

  export let songs = [];
  export let search;

  let songsElm;

  $: songsView = searchFilter(songs, search);
</script>

<style>
  .songs
  {
    position: absolute;
    top: 0;
    right: calc(100vh * var(--tan));
    bottom: 0;
    left: 0;
    padding-top: 25vh;
    overflow-y: auto;
    overflow-x: hidden;
    scroll-snap-type: y mandatory;
    scroll-padding-top: 45vh;
    scroll-padding-bottom: 10vh;
    transform: skew(var(--angle-deg));
    transform-origin: top left;
    background: linear-gradient(to left, rgba(0, 0, 0, .25) var(--thumbnail-bar-width), transparent calc(var(--thumbnail-bar-width) + 1px));
  }

  .songs::-webkit-scrollbar
  {
    width: 15px;
  }

  .songs::-webkit-scrollbar-track
  {
    background-color: rgba(0, 0, 0, .1);
  }

  .songs::-webkit-scrollbar-track-piece
  {
    background-color: rgba(0,0,0,.1);
  }

  .songs::-webkit-scrollbar-thumb
  {
    background-color: rgba(0,0,0,.3);
    border-radius: 10px;
    border: 0 none;
    outline: 0 none;
  }

  .songs::-webkit-scrollbar-button
  {
    display: none;
  }
</style>

<div class="songs" bind:this={songsElm} on:scroll>
  {#each songsView as song}
    <SongEntry {song} {songsElm} />
  {/each}
</div>