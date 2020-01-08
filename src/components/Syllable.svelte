<script context="module">
  import SystemRequirements from '../services/SystemRequirements';
  SystemRequirements.addCSS('background-clip', () => CSS.supports('background-clip', 'text') || CSS.supports('-webkit-background-clip', 'text'));
  SystemRequirements.addCSS('text-fill-color', () => CSS.supports('text-fill-color', 'transparent') || CSS.supports('-webkit-text-fill-color', 'transparent'));
  SystemRequirements.addCSS('variables', () => CSS.supports('color', 'var(--duration)'));
</script>

<script>
  export let type, offset, duration;
</script>

<style>
  span
  {
    background: linear-gradient(to right, #fff, #fff 49%, currentColor 50%, currentColor);
    background-clip: text;
    background-size: 200% auto;
    -webkit-text-fill-color: transparent;
    animation: shine var(--duration) linear var(--offset) forwards;
    animation-play-state: inherit;
  }

  .freestyle
  {
    font-weight: normal;
    font-style: italic;
  }

  @keyframes shine
  {
    to { background-position: -100% center; }
  }
</style>

<span class:freestyle={type === 0} style="--duration: {duration * .8}ms; --offset: {offset}ms">
  <slot></slot>
</span>
