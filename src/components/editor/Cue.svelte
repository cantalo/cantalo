<script>
  import Fab, { Icon } from '@smui/fab';

  export let currentBeat;
</script>

<style>
  .cue
  {
    position: absolute;
    left: 50%;
    top: 20px;
    z-index: 1;
    bottom: 20px;
    width: 2px;
    margin-left: -1px;
    background: red;
    border-radius: 2px;
    opacity: .9;
  }

  .cue .beat
  {
    position: absolute;
    bottom: 64px;
    left: 50%;
    padding: 2px 4px;
    background: inherit;
    border-radius: 3px;
    font-size: 12px;
    color: #fff;
    transform: translateX(-50%);
  }

  .cue :global(button)
  {
    position: absolute;
    bottom: 8px;
    left: 50%;
    transform: translateX(-50%);
  }
</style>

<div class="cue">
  {#if !isNaN(currentBeat)}
    <div class="beat">{currentBeat}</div>
  {/if}
  <Fab color="primary" mini>
    <Icon class="material-icons">add</Icon>
  </Fab>
</div>