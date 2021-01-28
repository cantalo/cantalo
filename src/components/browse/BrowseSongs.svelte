<script context="module">
  import SystemRequirements from '../../services/SystemRequirements';

  SystemRequirements.addCSS('scroll-snap', () => CSS.supports('scroll-snap-type', 'x mandatory'));
  SystemRequirements.addCSS('shape-outside', () => CSS.supports('shape-outside', 'polygon(0 0, 0% 100%, 100% 100%)'));
</script>

<script>
  import searchFilter from '../../services/SearchFilter';

  export let songs = [];
  export let search;

  let songsElm;

  $: songsView = searchFilter(songs, search);

  function intersecting(entries)
  {
    entries.forEach(({ target, isIntersecting }) =>
    {
      target.classList.toggle('active', isIntersecting);
    });
  }

  let observer;

  function observe(node)
  {
    if (!observer)
    {
      observer = new IntersectionObserver(intersecting, {
        root: songsElm,
        rootMargin: '-60% 0% -40% 0%',
      });
    }

    observer.observe(node);
  }
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

  .song
  {
    position: relative;
    display: flex;
    flex-direction: row-reverse;
    transform: skew(calc(var(--angle-deg) * -1)) translateX(28px);
    transform-origin: top left;
    margin: 10% 0;
    scroll-snap-align: start;
    text-decoration: none;
  }

  .song .thumbnail
  {
    width: calc(var(--thumbnail-bar-width) + 100px);
    height: 250px;
    margin-right: -100px;
    overflow: hidden;
    clip-path: polygon(0% 0%, 76.5% 0%, 100% 120%, 19.5% 100%); /* TODO replace magic numbers with calc */
    background: rgba(0,0,0,.2);

    img
    {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }
  }

  .meta
  {
    flex: 1;
    color: #fff;
    transition: opacity .3s ease-out;
  }

  .meta::before
  {
    content: '';
    width: 75px;
    height: 100%;
    float: left;
    shape-outside: polygon(0 25%, 0% 100%, 100% 100%);
  }

  .meta .title
  {
    padding: 0 10% 4px 0;
    font-size: 36px;
    border-bottom: 2px solid #fff;
  }

  .meta .artist
  {
    padding-top: 10px;
    font-size: 26px;
  }

  .meta .details
  {
    display: inline-flex;
    padding-top: 20px;
    padding-left: 4px;
    font-size: 20px;
    gap: 15px;
  }

  .meta .details > div
  {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .meta .details sub
  {
    font-variant: small-caps;
  }

  .song:not(.active) .meta
  {
    opacity: 0;
  }
</style>

<div class="songs" bind:this={songsElm} on:scroll>
  {#each songsView as song}
    <a class="song" href={"sing/" + song.id} lang={song.language} use:observe>
      <div class="thumbnail">
        <img src="https://img.youtube.com/vi/{song.id}/hqdefault.jpg" alt="" loading="lazy">
      </div>
      <div class="meta">
        <div class="title">{song.title}</div>
        <div class="artist">{song.artist}</div>
        <div>
          <div class="details">
            {#if song.genre}
              <div>
                {song.genre}
                <sub>genre</sub>
              </div>
            {/if}
            {#if song.language}
              <div>
                {song.language.toUpperCase()}
                <sub>language</sub>
              </div>
            {/if}
            {#if song.year}
              <div>
                {song.year}
                <sub>year</sub>
              </div>
            {/if}
          </div>
        </div>
      </div>
    </a>
  {/each}
</div>