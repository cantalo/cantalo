<svelte:head>
  {#if !win.YT}<script src="https://www.youtube.com/iframe_api"></script>{/if}
</svelte:head>

<script>
  import { onDestroy, onMount } from 'svelte';
  import AnimationFrames from '../services/AnimationFrames';
  import { video, time, playing, playerApi } from '../stores/video';

  const win = process.browser ? window : {};
  let player, playerElement;
  let animationFrames, videoUnsubscriber;

  function init()
  {
    let bufferingCount = 0;
    let suggestedQuality = 'default';

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
        onReady()
        {
          $playerApi = player;

          videoUnsubscriber = video.subscribe(({ id, gap, end }) =>
          {
            if (id)
            {
              player.loadVideoById({
                videoId: id,
                startSeconds: gap,
                endSeconds: end,
              });
            }
            else
            {
              player.stopVideo();
              $playing = false;
              $time = 0;
            }
          });
        },
        onStateChange({ data: playerState })
        {
          if (playerState === YT.PlayerState.PLAYING)
          {
            updatePlayTime();
            $playing = true;
          }
          else
          {
            animationFrames.remove('PlayTime');
            $playing = false;

            if (playerState === YT.PlayerState.BUFFERING)
            {
              const currentQuality = player.getPlaybackQuality();

              if (bufferingCount > 0)
              {
                const qualityLevels = player.getAvailableQualityLevels();

                if (/default|audto/.test(suggestedQuality))
                {
                  const currentQualityIndex = qualityLevels.indexOf(currentQuality);

                  if (currentQualityIndex > -1)
                  {
                    suggestedQuality = qualityLevels[currentQualityIndex + 1];
                  }
                  else
                  {
                    suggestedQuality = qualityLevels[1];
                  }
                }
                else
                {
                  const suggestedQualityIndex = qualityLevels.indexOf(suggestedQuality);
                  suggestedQuality = qualityLevels[suggestedQualityIndex + 1];
                }

                if (!suggestedQuality)
                {
                  suggestedQuality = 'default';
                }

                player.setPlaybackQuality(suggestedQuality);
              }

              bufferingCount++;

              console.debug('Buffering... Current quality:', currentQuality, '; Suggested quality:', suggestedQuality);
            }

            if (playerState === YT.PlayerState.ENDED)
            {
              $playing = null;
            }
          }
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
    $time = player.getCurrentTime() * 1000;
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
    $time = 0;
    $playing = false;
    $playerApi = {};
  });
</script>

<style>
  div
  {
    z-index: 0;
  }
</style>

<div class="absolute">
  <span bind:this={playerElement}></span>
</div>
