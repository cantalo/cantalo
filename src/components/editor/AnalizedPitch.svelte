<script>
  export let pitch;
</script>

<style>
  div
  {
    position: absolute;
    background: lightcyan;
    overflow: hidden;
    height: 100%;
    border: 1px solid rgba(0,0,0, .5);
  }
</style>

<div {...$$restProps} title={pitch.note.pitch}>
  {pitch.note.toString()}
  <sub>{pitch.note.pitch}</sub>
</div>