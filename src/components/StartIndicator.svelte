<script>
  export let duration;
</script>

<style type="text/scss">
  div
  {
    display: inline-block;
    position: relative;

    &::after
    {
      content: '';
      position: absolute;
      display: inline-block;
      top: 0;
      right: -2px;
      bottom: 0;
      width: 100px;
      background: radial-gradient(at right, currentColor, transparent 35%) no-repeat 0;
      background-size: 0;
      animation: move var(--indicator-duration) linear var(--indicator-delay);
      animation-play-state: inherit;
    }
  }


  @keyframes move
  {
    from  { background-size: 0; }
    to    { background-size: 200%; }
  }
</style>

<div style="--indicator-duration: {duration}ms; --indicator-delay: {duration / 2}ms">&#8203;</div>
