<script>
  export let color;
  export let inline = false;
</script>

<style>
  div
  {
    display: flex;
    align-items: center;
  }

  div.inline
  {
    display: inline-flex;
    vertical-align: text-bottom;
  }

  span
  {
    width: 1em;
    min-width: 1em;
    height: 1em;
    border-radius: 6px;
    border: 1px solid rgba(0,0,0, .3);
    margin-right: .25em;
    box-shadow: inset 0 5px 20px rgba(255,255,255, .5);
    opacity: .8;
  }
</style>

<div class:inline>
  <span style="background-color: {color}" {...$$restProps}></span>
  <slot />
</div>
