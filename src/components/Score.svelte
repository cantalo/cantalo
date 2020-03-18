<script>
  export let color;

  let shapeValues = {};

  function getRandomInt(min, max)
  {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  export function randomShape()
  {
    const min = 15, max = 40;
    const top = getRandomInt(min, max);
    const right = getRandomInt(min, max);
    const bottom = getRandomInt(min, max);
    const left = getRandomInt(min, max);

    shapeValues = { top, right, bottom, left };
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
    transition: border-radius 100ms ease;
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

<div class={color} style="border-radius:
      {shapeValues.top}% {100-shapeValues.top}%
      {shapeValues.bottom}% {100-shapeValues.bottom}%
      /
      {shapeValues.left}% {shapeValues.right}%
      {100-shapeValues.right}% {100-shapeValues.left}%">
  <slot></slot>
</div>