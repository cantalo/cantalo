<script context="module">
  export async function preload({ params })
  {
    const { vid } = params;

    const res = await this.fetch(`sing/${vid}.json`);
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
  import { Icon } from '@smui/icon-button';
  import BeatGrid from '../../components/editor/BeatGrid.svelte';
  import Cue from '../../components/editor/Cue.svelte';
  import Keyboard from '../../components/hardware/Keyboard.svelte';
  import YouTube, { playing, duration, time, seekTo, loadVideo } from '../../components/YouTube.svelte';

  import { getFromStorage, meta, lines, videoInBackground, zoom } from './_editor';

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
      $lines = getFromStorage('song_' + vid);
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
  $: songEndWidth = ($duration - ($meta.end || $duration)) / zoomFactor;
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

  .gap
  {
    position: relative;
    height: 100%;
  }

  .gap.outside
  {
    min-width: 50vw;
    background: rgba(150, 150, 150, .9);
  }

  .gap.video
  {
    background: repeating-linear-gradient(
        110deg,
        rgba(255, 255, 255, .9),
        rgba(255, 255, 255, .9) 8px,
        transparent 8px,
        transparent 16px
    );
  }

  .handle
  {
    position: absolute;
    top: 0;
    bottom: 0;
    z-index: 1;
    width: 4px;
    color: #fff;
    cursor: grab;
    opacity: .8;
  }

  .handle :global(.material-icons)
  {
    position: absolute;
    top: 50%;
    left: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: inherit;
    transform: translate(-50%, -50%);
    border-radius: 100%;
  }

  .gap.video .handle :global(.material-icons)
  {
    top: 45%;
  }

  .gap:not(.end) .handle
  {
    right: 0;
  }

  .video .handle
  {
    background: #2f4f4f;
  }

  .song .handle
  {
    background: orangered;
  }
</style>

<Keyboard on:space={() => $playing = !$playing} />

<div class="video-player" class:bg={$videoInBackground}>
  <YouTube />
</div>

<div class="timeline" bind:this={timeline} on:scroll={timelineScroll}>
  {#if $duration}
    <div class="gap outside"></div>

    <div class="video-time" style="min-width: {videoTimeWidth}px">
      <div class="gap video" style="width: {videoStartWidth}px">
        <div class="handle">
          <Icon class="material-icons">movie</Icon>
        </div>
      </div>

      <div class="gap song" style="width: {songStartWidth}px">
        <div class="handle">
          <Icon class="material-icons">music_note</Icon>
        </div>
      </div>

      <BeatGrid {beats} {currentBeat} />

      <div class="gap song end" style="width: {songEndWidth}px">
        <div class="handle">
          <Icon class="material-icons">music_note</Icon>
        </div>
      </div>

      <div class="gap video end" style="width: {videoEndWidth}px">
        <div class="handle">
          <Icon class="material-icons">movie</Icon>
        </div>
      </div>
    </div>

    <div class="gap outside"></div>
  {/if}
</div>

<Cue {currentBeat} />