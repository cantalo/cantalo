<script>
  import Note from '../../services/Note';

  export let syllable;
  export let beats;
</script>

<style>
  .syllable
  {
    position: absolute;
    top: 80px;
    bottom: 120px
  }

  .syllable .pitch
  {
    position: absolute;
    width: 100%;
    font-weight: bold;
    font-size: 12px;
    text-align: center;
    white-space: nowrap;
  }

  .syllable .pitch::before
  {
    content: '';
    display: block;
    height: 15px;
    background: rgba(#A52A2A, .5);
    border-radius: 5px;
    border: 1px solid brown;
  }
</style>

<div class="syllable" style="left: {100 / beats * syllable.start}%;
                             width: {100 / beats * syllable.length}%">
  <div class="text">{syllable.text}</div>
  <div class="pitch" style="top: {100 / 12 * (syllable.pitch % 12)}%">
    {new Note(syllable.pitch).toString()}<sub>{Math.ceil(syllable.pitch / 12)}</sub>
  </div>
</div>