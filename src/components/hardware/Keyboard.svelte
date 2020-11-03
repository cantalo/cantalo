<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  function keydown(event)
  {
    if(/input|button|textarea/i.test(document.activeElement.tagName)) return;

    switch(event.code)
    {
      case 'Space': dispatch('space', event); break;
      case 'Escape': dispatch('escape', event); break;
      case 'KeyX': if (event.ctrlKey) dispatch('cut', event); break;
      case 'KeyC': if (event.ctrlKey) dispatch('copy', event); break;
      case 'KeyV': if (event.ctrlKey) dispatch('paste', event); break;
      case 'KeyA': if (event.ctrlKey) dispatch('select-all', event); break;
      case 'ArrowLeft':
        if (event.shiftKey)
        {
          dispatch('shift-left', event);
        }
        else
        {
          dispatch('left', event);
        }
        break;
      case 'ArrowRight':
        if (event.shiftKey)
        {
          dispatch('shift-right', event);
        }
        else
        {
          dispatch('right', event);
        }
        break;
      default: console.debug(event);
    }
  }
</script>

<svelte:window on:keydown={keydown} />