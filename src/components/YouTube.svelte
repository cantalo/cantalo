<svelte:head>
  <script src="https://www.youtube.com/iframe_api"></script>
</svelte:head>

<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  let player, playerElement;

  window.onYouTubeIframeAPIReady = () =>
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
</script>

<div bind:this={playerElement}></div>