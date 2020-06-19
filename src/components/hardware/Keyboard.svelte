<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  function keydown(event)
  {
    switch(event.code)
    {
      case 'Space': dispatch('space', event); break;
      case 'Escape': dispatch('escape', event); break;
      default: console.debug(event);
    }
  }
</script>

<svelte:window on:keydown={keydown} />