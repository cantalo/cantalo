<script context="module">
  import { readable, writable } from 'svelte/store';
  import { defer } from '../services/utils';

  let player;

  let isReady = defer();

  let setTime = () => {};
  let setDuration = () => {};
  let setBuffer = () => {};

  export const time = readable(0, set => { setTime = set });
  export const duration = readable(0, set => { setDuration = set });
  export const buffer = readable(0, set => { setBuffer = set });

  export const speed = writable(100);
  export const playing = writable(null);

  export async function loadVideo(videoId, startSeconds, endSeconds, play)
  {
    await isReady;

    player[play ? 'loadVideoById' : 'cueVideoById']({
      videoId,
      startSeconds,
      endSeconds,
    });
  }

  export function resetVideo()
  {
    if (player)
    {
      player.stopVideo();
      setTime(0);
      setPlaying(null);
    }
  }

  export function seekTo(seconds)
  {
    player.seekTo(Math.max(seconds, 0));
    setTime(player.getCurrentTime() * 1000);
  }

  let playingInternalChange;
  let speedInternalChange;

  function setPlaying(value)
  {
    playingInternalChange = true;
    playing.set(value);
    playingInternalChange = false;
  }

  function setSpeed(value)
  {
    speedInternalChange = true;
    speed.set(value * 100);
    speedInternalChange = false;
  }

  class YouTubeError extends Error
  {
    constructor(code)
    {
      const errorCodes = {
        2: 'The request contains an invalid parameter value. For example, this error occurs if you specify a video ID that does not have 11 characters, or if the video ID contains invalid characters, such as exclamation points or asterisks.',
        5: 'The requested content cannot be played in an HTML5 player or another error related to the HTML5 player has occurred.',
        100: ' The video requested was not found. This error occurs when a video has been removed (for any reason) or has been marked as private.',
        101: 'The owner of the requested video does not allow it to be played in embedded players.',
      };

      errorCodes[150] = errorCodes[101];

      super(errorCodes[code] || 'Unknown error code ' + code);
    }
  }
</script>

<svelte:head>
  {#if !win.YT}<script src="https://www.youtube.com/iframe_api"></script>{/if}
</svelte:head>

<script>
  /* global YT */

  import { onDestroy, onMount } from 'svelte';
  import { goto } from '@sapper/app';
  import AnimationFrames from '../services/AnimationFrames';

  export let width;
  export let height;
  export let controls = false;

  const win = process.browser ? window : {};
  let playerElement;
  let animationFrames, videoUnsubscriber;
  let size = 100;

  if (isReady.resolved)
  {
    isReady = defer();
  }

  function init()
  {
    let bufferingCount = 0;

    player = new YT.Player(playerElement,
    {
      height: height || size + '%',
      width: width || size + '%',
      playerVars:
      {
        controls: Number(controls),
        disablekb: 1,
        showinfo: 0,
        cc_load_policy: 0,
        fs: 0,
        iv_load_policy: 3,
        rel: 0,
        modestbranding: 1,
      },
      events:
      {
        onReady()
        {
          isReady.resolve();

          playing.subscribe(_playing =>
          {
            if (playingInternalChange) return;
            player[_playing ? 'playVideo' : 'pauseVideo']();
          });

          speed.subscribe(_speed =>
          {
            if (speedInternalChange) return;
            player.setPlaybackRate(_speed / 100);
          });
        },
        onError({ data: error })
        {
          goto('/');
          throw new YouTubeError(error);
        },
        onStateChange({ data: playerState })
        {
          if (playerState === YT.PlayerState.PLAYING)
          {
            updatePlayTime();
            setPlaying(true);
            setDuration(player.getDuration() * 1000);

            player.unloadModule('captions');
            player.unloadModule('cc');
            player.unloadModule('iv');
          }
          else
          {
            animationFrames.remove('PlayTime');

            if (playerState === YT.PlayerState.BUFFERING)
            {
              const currentQuality = player.getPlaybackQuality();
              const qualityLevels = player.getAvailableQualityLevels();
              const currentQualityIndex = qualityLevels.indexOf(currentQuality);

              console.debug('Buffering... Current quality:', currentQuality);

              if (bufferingCount > 2 && size > 50 && currentQualityIndex < 3)
              {
                size -= 25;
                console.debug(`Decreased player size to ${size}% to reduce buffering`);
              }

              bufferingCount++;
            }

            if ([YT.PlayerState.PAUSED, YT.PlayerState.BUFFERING].includes(playerState))
            {
              setPlaying(false);
            }
            else
            {
              setPlaying(null);
            }
          }
        },
        onPlaybackRateChange({ data: playbackRate })
        {
          setSpeed(playbackRate);
        },
        onPlaybackQualityChange({ data: playbackQuality })
        {
          console.debug('Playback quality has changed:', playbackQuality);
        },
      }
    });
  }

  function updatePlayTime()
  {
    setTime(player.getCurrentTime() * 1000);
    setBuffer(player.getVideoLoadedFraction());
    animationFrames.add('PlayTime', updatePlayTime);
  }

  onMount(() =>
  {
    animationFrames = new AnimationFrames();

    if (win.YT)
    {
      init();
    }
    else
    {
      win.onYouTubeIframeAPIReady = init;
    }
  });

  onDestroy(() =>
  {
    if (videoUnsubscriber) videoUnsubscriber();
    if (animationFrames) animationFrames.remove('PlayTime');
    setTime(0);
    setPlaying(null);
  });
</script>

<style>
  div
  {
    z-index: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  div :global(iframe)
  {
    transform: var(--video-scale);
  }
</style>

<div class:absolute={!width && !height} style="--video-scale: scale({(100 / size)})">
  <span bind:this={playerElement}></span>
</div>
