<script context="module">
  export async function preload({ params })
  {
    const { vid } = params;

    const res = await this.fetch(`api/song/${vid}.json`);
    const data = await res.json();

    if (res.status === 200)
    {
      return { vid, data };
    }

    if (res.status === 404)
    {
      return { vid, data: null };
    }

    this.error(res.status, data.message);
  }
</script>

<script>
  import Untapped from '../../components/editor/Untapped.svelte';
  import Gap from '../../components/editor/Gap.svelte';
  import BeatGrid from '../../components/editor/BeatGrid.svelte';
  import Cue from '../../components/editor/Cue.svelte';
  import Keyboard from '../../components/hardware/Keyboard.svelte';
  import YouTube, { playing, duration, time, seekTo, loadVideo } from '../../components/YouTube.svelte';

  import { getFromStorage, meta, lines, videoInBackground, zoom, untapped } from './_editor';

  export let vid;
  export let data;

  if (data && data.meta && data.lines)
  {
    $meta = data.meta;
    $lines = data.lines;
    loadVideo(data.meta.id, $meta.videogap, $meta.videoend);
  }
  else if (vid)
  {
    const _meta = getFromStorage('meta_' + vid);

    if (_meta)
    {
      $meta = _meta;
      $lines = getFromStorage('song_' + vid) || [];
      $untapped = getFromStorage('untapped_' + vid) || [];
    }
    else
    {
      $meta.id = vid;
    }

    loadVideo(vid, $meta.videogap, $meta.videoend);
  }

  let timeline;
  let currentBeat;

  $: zoomFactor = Math.pow((11 - $zoom) / 2, 2);
  $: videoTimeWidth = $duration / zoomFactor;
  $: videoStartWidth = (($meta.videogap * 1000) || 0) / zoomFactor;
  $: videoEndWidth = ($duration - (($meta.videoend * 1000) || $duration)) / zoomFactor;
  $: songStartWidth = ($meta.gap || 0) / zoomFactor;
  $: songEndWidth = (($duration - ($meta.end || $duration)) / zoomFactor) - videoEndWidth;
  $: beats = Math.floor((($duration - ($meta.gap || 0) - ($duration - ($meta.end || $duration))) / 250 / 60) * $meta.bpm);

  $: if (process.browser && $meta.id)
  {
    localStorage.setItem('editor_meta_' + $meta.id, JSON.stringify($meta));
    localStorage.setItem('editor_song_' + $meta.id, JSON.stringify($lines));
  }

  $: if (timeline && $playing)
  {
    timeline.scrollLeft = $time / zoomFactor;
  }

  function timelineScroll()
  {
    const newTime = timeline.scrollLeft * zoomFactor;

    if ($playing === false && parseInt($time) !== parseInt(newTime))
    {
      seekTo(newTime / 1000);
    }

    currentBeat = Math.floor((newTime - (($meta.videogap || 0) * 1000) - ($meta.gap || 0)) / (250 / $meta.bpm * 60))
  }

  function gapDiff(e)
  {
    return $duration - ((videoTimeWidth + e.detail) * zoomFactor);
  }

  function gapSetter(field, message, factor = 1)
  {
    return diff =>
    {
      const max = $duration / factor;
      let value;

      if (diff)
      {
        value = ($meta[field] || max) - diff / factor;
      }
      else
      {
        value = parseInt(prompt(message, $meta[field]));
      }

      if (!isNaN(value))
      {
        $meta[field] = value > max ? undefined : Math.max(0, value);
      }
    }
  }

  const setVideoStart = gapSetter('videogap', 'Set video start time (in seconds):', 1000);
  const setVideoEnd = gapSetter('videoend', 'Set video end time (in seconds):', 1000);
  const setSongStart = gapSetter('gap', 'Set song start time (in milliseconds):');
  const setSongEnd = gapSetter('end', 'Set song end time (in milliseconds):');
</script>

<style>
  .video-player:not(.bg)
  {
    position: fixed;
    right: 16px;
    bottom: 100px;
    height: 200px;
    width: 300px;
    z-index: 1;
  }

  .timeline,
  .video-player.bg
  {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  .timeline
  {
    display: flex;
    overflow-y: hidden;
    overflow-x: scroll;
  }

  .video-time
  {
    position: relative;
    display: flex;
    height: 100%;
    background: rgba(220, 220, 220, .95);
  }
</style>

<Keyboard on:space={() => $playing = !$playing} />

<div class="video-player" class:bg={$videoInBackground}>
  <YouTube />
</div>

<div class="timeline" bind:this={timeline} on:scroll={timelineScroll}>
  {#if $duration}
    <Gap outside />

    <div class="video-time" style="min-width: {videoTimeWidth}px">
      <Gap video width={videoStartWidth}
           on:shift={e => setVideoStart(gapDiff(e))}
           on:set={() => setVideoStart()} />

      <Gap song width={songStartWidth}
           on:shift={e => setSongStart(gapDiff(e))}
           on:set={() => setSongStart()} />

      <BeatGrid {beats} {currentBeat} />

      <Gap song end width={songEndWidth}
           on:shift={e => setSongEnd(gapDiff(e))}
           on:set={() => setSongEnd()}/>

      <Gap video end width={videoEndWidth}
           on:shift={e => setVideoEnd(gapDiff(e))}
           on:set={() => setVideoEnd()}/>
    </div>

    <Gap outside />
  {/if}
</div>

<Untapped />

<Cue {currentBeat} />