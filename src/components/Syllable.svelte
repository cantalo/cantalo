<script>
  export let offset, duration;
</script>

<style>
  span
  {
    background: linear-gradient(to right, #fff, #fff 49%, currentColor 50%, currentColor);
    background-clip: text;
    background-size: 200% auto;
    text-fill-color: transparent;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shine var(--duration) linear var(--offset) forwards;
    animation-play-state: inherit;
  }
  @keyframes shine
  {
    to { background-position: -100% center; }
  }
</style>

<span style="--duration: {duration * .8}ms; --offset: {offset}ms">
  <slot></slot>
</span>