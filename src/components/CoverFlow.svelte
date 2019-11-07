<script>
  import { onMount } from 'svelte';

  export let items;
  let elm, loaded;

  onMount(() =>
  {
    elm.scrollLeft = elm.scrollWidth / 2;
    loaded = true;

    let options = {
      root: elm,
      rootMargin: '100%',
    };

    let observer = new IntersectionObserver(entries => console.log(entries.map(entry => entry.isIntersecting)), options);
    // TODO move items in array

    observer.observe(elm.firstChild);
    observer.observe(elm.lastChild);
  });
</script>

<style>
  .songs
  {
    perspective: 1px;
    display: flex;
    align-items: center;
    flex: 1;
    scroll-snap-type: x mandatory;
    scroll-padding: 0 10vw;
    overflow-x: scroll;
    overflow-y: hidden;
  }

  .song
  {
    position: relative;
    display: flex;
    align-items: center;
    min-width: 50%;
    margin: 0 5%;
    scroll-snap-align: center;
    background-color: rgba(0, 0, 0, .3);
    cursor: pointer;
    text-decoration: none;
    visibility: hidden;
  }

  .loaded .song
  {
    visibility: visible;
  }
</style>

<div class="songs" class:loaded bind:this={elm}>
  <div></div>
  {#each items as song}
    <a class="song" href={"sing/" + song.id} lang={song.language}>
      <div class="cover">
        <img src="https://img.youtube.com/vi/{song.id}/hqdefault.jpg" alt="Cover">
      </div>
      <dl>
        <dd>{song.title}</dd>
        <dd class="artist">{song.artist}</dd>
      </dl>
    </a>
  {/each}
  <div></div>
</div>