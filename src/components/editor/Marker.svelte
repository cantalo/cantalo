<script>
  export let position;
</script>

<style>
  .marker
  {
    position: absolute;
    bottom: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    color: #fff;
    background: #333;
    border-radius: 100%;
    transform: translate(-50%, -6px);
    pointer-events: none;
  }

  .marker :global(.material-icons)
  {
    font-size: 16px;
  }

  .marker::after
  {
    content: '';
    position: absolute;
    top: 60%;
    z-index: -1;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 16px 12px 0;
    border-color: #333 transparent transparent;
  }

  .marker[style="left: 0%;"]
  {
    transform: translate(0, -6px);
  }

  .marker[style="left: 0%;"]::after
  {
    border-width: 16px 24px 0 0;
    border-color: #333 transparent transparent;
  }

  .marker[style="left: 100%;"]
  {
    transform: translate(-100%, -6px);
  }

  .marker[style="left: 100%;"]::after
  {
    border-width: 0 24px 16px 0;
    border-color: transparent #333333 transparent transparent;
  }
</style>

<div class="marker" style="left: {position * 100}%">
  <slot />
</div>