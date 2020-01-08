<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  function keydown(event)
  {
    switch(event.code)
    {
      case 'Space': dispatch('space', event); break;
      case 'Escape': dispatch('escape', event); break;
      case 'KeyX': if (event.ctrlKey) dispatch('cut', event); break;
      case 'KeyC': if (event.ctrlKey) dispatch('copy', event); break;
      case 'KeyV': if (event.ctrlKey) dispatch('paste', event); break;
      default: console.debug(event);
    }
  }
</script>

<svelte:window on:keydown={keydown} />