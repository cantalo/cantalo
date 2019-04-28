<script context="module">
  import SystemRequirements from '../services/SystemRequirements.js';
  SystemRequirements.addJS('CSS Typed OM', () => !!(CSS && CSS.number));
</script>

<script>
  import { onMount } from 'svelte';
  import Microphone from '../services/Microphone';
  import Note from '../services/Note';

  export let song, time, playing;

  let micLeft = {},
      micRight = {};
  let songNote = '';

  $: micLeftNote = micLeft && micLeft.note && micLeft.note.toString() || '';
  $: micRightNote = micRight && micRight.note && micRight.note.toString() || '';
  $: {
    try
    {
      const line = song.find(line => line.end > time && time > line.start);
      const syllable = line.syllables.find(syllable => syllable.start < time && time < syllable.start + syllable.length);
      songNote = new Note(syllable.pitch).toString();
    }
    catch (err) { songNote = ''; }
  };

  onMount(async () =>
  {
    await Microphone.start();

    Microphone.updates().subscribe(data =>
    {
      micLeft = data.left;
      micRight = data.right;
    });
  });

  function position({ attributeStyleMap }, { line, syllable })
  {
    const factor = (100 / (line.end - line.start));

    attributeStyleMap.set('top', CSS.percent((syllable.pitch % 12) * 10));
    attributeStyleMap.set('left', CSS.percent((syllable.start - line.start) * factor));
    attributeStyleMap.set('width', CSS.percent(syllable.length * factor));
  }
</script>

<style>
  .note-info
  {
    position: absolute;
    top: 10%;
    right: 5%;
    background: rgba(0,0,0, .8);
    color: #fff;
    font-size: 20px;
  }

  .note-info > div
  {
    height: 100px;
  }

  .note-info > h4
  {
    margin-top: 0;
  }

  .notes
  {
    position: absolute;
    top: 10%;
    right: 20%;
    bottom: 40%;
    left: 20%;
    pointer-events: none;
  }

  .note
  {
    position: absolute;
    height: 20px;
  }

  .note > div
  {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 6px;
    border: 1px solid transparent;
  }

  .note .pill
  {
    border: 1px solid rgba(255,255,255, .8);
    background: linear-gradient(
      hsla(0, 0%, 100%, 0.6),
      hsla(0, 0%, 100%, 0) 50%,
      hsla(0, 0%, 0%, 0.3) 50%,
      hsla(0, 0%, 100%, 0.2)
    );
    box-shadow: inset 0 -5px 20px hsla(0, 0%, 0%, 0.4),
                inset 0 5px 20px hsla(0, 0%, 100%, 0.4),
                -8px 8px 5px hsla(0, 0%, 0%, 0.15),
                5px 18px 10px hsla(0, 0%, 0%, 0.2);
  }

  .note .time
  {
    background-color: #fff;
    width: 0%;
    opacity: 0;
    animation: grow var(--duration) linear var(--offset) forwards;
    animation-play-state: inherit;
  }

  .inactive
  {
    animation-play-state: paused;
  }

  @keyframes grow
  {
    1% { opacity: 1; }
    to { width: 100%; opacity: 1; }
  }

  .match
  {
    color: red;
  }
</style>

<div class="notes">
  {#each song as line}
    {#if line.end > time && time > line.start}
      {#each line.syllables as syllable}
        <div class="note" use:position={{line, syllable}} class:inactive={!playing}>
          <div class="time" style="--duration: {syllable.length}ms; --offset: {syllable.start - line.start}ms"></div>
          <div class="sung"></div>
          <div class="pill"></div>
        </div>
      {/each}
    {/if}
  {/each}
</div>

<div class="note-info">
  <div>
    <h4>Song</h4>
    <div>Note:</div>
    {songNote}
  </div>

  <div class:match={micLeftNote && micLeftNote === songNote}>
    <h4>Left Mic</h4>
    <div>Note:</div>
    {micLeftNote}
  </div>

  <div class:match={micRightNote && micRightNote === songNote}>
    <h4>Right Mic</h4>
    <div>Note:</div>
    {micRightNote}
  </div>
</div>