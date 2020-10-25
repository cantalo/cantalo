<script>
  import { createEventDispatcher } from 'svelte';
  import { Icon } from '@smui/icon-button';

  const dispatch = createEventDispatcher();

  export let width = undefined;
  export let outside = false;
  export let video = false;
  export let song = false;
  export let end = false;

  let handle;
  let startPosition;

  function mousedown(e)
  {
    e.preventDefault();
    startPosition = e.clientX;
  }

  function mousemove(e)
  {
    if (startPosition)
    {
      handle.style.transform = `translateX(${e.clientX - startPosition}px)`;
    }
  }

  function mouseup(e)
  {
    if (startPosition)
    {
      const diff = e.clientX - startPosition;
      if (diff !== 0) dispatch('shift', diff);
      startPosition = undefined;
      handle.style.transform = '';
    }
  }
</script>

<style>
  .gap
  {
    position: relative;
    height: 100%;
  }

  .gap.outside
  {
    min-width: 50vw;
    background: rgba(150, 150, 150, .9);
  }

  .gap.video
  {
    background: repeating-linear-gradient(
        110deg,
        rgba(255, 255, 255, .9),
        rgba(255, 255, 255, .9) 8px,
        transparent 8px,
        transparent 16px
    );
  }

  .handle
  {
    position: absolute;
    top: 0;
    bottom: 0;
    z-index: 1;
    width: 4px;
    color: #fff;
    opacity: .8;
    cursor: e-resize;
  }

  .handle :global(.material-icons)
  {
    position: absolute;
    top: 50%;
    left: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: inherit;
    transform: translate(-50%, -50%);
    border-radius: 100%;
  }

  .gap.video .handle :global(.material-icons)
  {
    top: 45%;
  }

  .gap:not(.end) .handle
  {
    right: 0;
  }

  .video .handle
  {
    background: #2f4f4f;
  }

  .song .handle
  {
    background: orangered;
  }
</style>

<svelte:window on:mousemove={mousemove} on:mouseup={mouseup} />

<div class="gap" style="width: {width}px" class:outside class:video class:song class:end>
  {#if video || song}
    <div class="handle" bind:this={handle}
         on:mousedown={mousedown}
         on:dblclick|preventDefault={() => dispatch('set')}>
      {#if video}
        <Icon class="material-icons">movie</Icon>
      {:else if song}
        <Icon class="material-icons">music_note</Icon>
      {/if}
    </div>
  {/if}
</div>