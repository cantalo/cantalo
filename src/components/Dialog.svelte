<script>
  import { onMount } from 'svelte';

  export let autoopen = true;
  export let closable = false;
  export let size;

  let dialog;

  onMount(() =>
  {
    if (autoopen)
    {
      open();
    }
  });

  export function open()
  {
    dialog.showModal();
  }

  export function close()
  {
    dialog.close();
  }
</script>

<script context="module">
  import SystemRequirements from '../services/SystemRequirements.js';
  SystemRequirements.addJS('HTMLDialogElement', () => typeof HTMLDialogElement === 'function');
</script>

<style type="text/scss">
  ::backdrop
  {
    background-color: rgba(#333, .75);
  }

  dialog
  {
    top: 50%;

    display: flex;
    flex-direction: column;
    min-width: 400px;
    min-height: 200px;
    padding: 0;
    border: 0;
    border-radius: 2px;
    transform: translateY(-50%);

    &:not([open])
    {
      display: none;
    }

    &.sm
    {
      width: 40vw;
      height: 40vh;
    }

    &.md
    {
      width: 50vw;
      height: 50vh;
    }

    &.lg
    {
      width: 80vw;
      height: 80vh;
    }

    header
    {
      padding: 15px 15px 0;
    }

    footer
    {
      padding: 15px;
      text-align: center;
    }

    main
    {
      flex: 1;
      padding: 0 15px;
      overflow: auto;
    }
  }

  .close
  {
    position: absolute;
    width: 20px;
    height: 20px;
    font-size: 20px;
    top: 5px;
    right: 5px;
  }
</style>

<dialog bind:this={dialog} on:close class={size}>
  {#if closable}
  <div on:click={close} role="button" class="close">&times;</div>
  {/if}
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</dialog>
