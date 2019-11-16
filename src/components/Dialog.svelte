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
    min-width: 400px;
    min-height: 200px;
    padding: 15px;
    overflow: auto;
    border: 0;
    border-radius: 2px;
    transform: translateY(-50%);

    &.md
    {
      width: 60vw;
      height: 60vh;
    }

    &.lg
    {
      width: 80vw;
      height: 80vh;
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
  <slot></slot>
</dialog>