<script context="module">
  import SystemRequirements from '../services/SystemRequirements';
  SystemRequirements.addJS('CSS Typed OM', () => !!(CSS && CSS.number));
</script>

<script>
  export let color;

  let shapeValues = {};

  function getRandomInt(min, max)
  {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  export function randomShape() // TODO call this for every finished line
  {
    const min = 15, max = 40;
    const top = getRandomInt(min, max);
    const right = getRandomInt(min, max);
    const bottom = getRandomInt(min, max);
    const left = getRandomInt(min, max);

    shapeValues = { top, right, bottom, left };
  }

  function shape({ attributeStyleMap }, { top, right, bottom, left })
  {
    attributeStyleMap.set('border-radius', `
      ${top}% ${100-top}%
      ${bottom}% ${100-bottom}%
      /
      ${left}% ${right}%
      ${100-right}% ${100-left}%
    `);
  }

  randomShape();
</script>

<style>
  div
  {
    padding: 10px 20px;
    font-size: 40px;
    color: #fff;
    border-radius: 49% 51% 52% 48% / 43% 34% 66% 57%;
  }

  :global(.red)
  {
    background: linear-gradient(to top right, #FF4B2B, #FF416C);
  }

  :global(.deepskyblue)
  {
    background: linear-gradient(to top right, #373b44, #4286f4);
  }
</style>

<div class={color} use:shape={shapeValues}>
  <slot></slot>
</div>