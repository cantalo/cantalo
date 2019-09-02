<svelte:head>
  {#if !win.YT}<script src="https://www.youtube.com/iframe_api"></script>{/if}
</svelte:head>

<script>
  import { onDestroy, onMount, createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  const win = window;
  let player, playerElement;

  function init()
  {
    player = new YT.Player(playerElement,
    {
      height: '100%',
      width: '100%',
      playerVars:
      {
        controls: 0,
        disablekb: 0,
        showinfo: 0,
        cc_load_policy: 0,
        fs: 0,
        iv_load_policy: 3,
        rel: 0,
        modestbranding: 1,
      },
      events:
      {
        onReady(event) { dispatch('ready', event.target); },
        onStateChange(event) { dispatch('stateChange', event.data) },
        onPlaybackQualityChange(event) { dispatch('qualityChange', event.data); },
        onPlaybackRateChange(event) { dispatch('rateChange', event.data); },
        onError(event) { dispatch('error', event.datat); },
        onApiChange(event) { dispatch('apiChange', event.data); },
      }
    });
  }

  if (win.YT)
  {
    onMount(init);
  }
  else
  {
    win.onYouTubeIframeAPIReady = init;
  }

  onDestroy(() =>
  {
    if (player)
    {
      player.destroy();
    }
  });
</script>

<span>
  <div bind:this={playerElement}></div>
</span>
