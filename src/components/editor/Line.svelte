<script>
  import IconButton, { Icon } from '@smui/icon-button';

  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let line;
  export let beats;
  export let selected = false;
  export let cut = false;

  $: hasComment = !!line.comment;

  function comment(e)
  {
    e.stopPropagation();
    dispatch('comment');
  }
</script>

<style>
  .line
  {
    position: absolute;
    cursor: default;
  }

  .line .info
  {
    padding: 0 8px;
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    background: rgba(#708090, .1);
    border: 1px solid #708090;
    border-radius: 2px;
  }

  .line.selected .info
  {
    background: rgba(#1E90FF, .35);
    border-color: #1e90ff;
  }

  .line.selected.cut .info
  {
    opacity: .6;
  }

  .line .actions
  {
    display: flex;
    justify-content: center;
  }

  .line .actions :global(.comment-yes)
  {
    color: orangered;
    transform: scaleX(-1);
  }

  .line:not(:hover) .actions :global(.comment-no)
  {
    visibility: hidden;
  }
</style>

<div class="line" class:selected class:cut on:click
     style="left: {100 / beats * line.start}%;
            width: {100 / beats * (line.end - line.start)}%">
  <div class="actions">
    <IconButton bind:pressed={hasComment} title={line.comment} on:click={comment}>
      <Icon class="material-icons comment-no">add_comment</Icon>
      <Icon class="material-icons comment-yes" on>feedback</Icon>
    </IconButton>
  </div>

  <div class="info">
    <div>{line.start}</div>
    <div>
      <slot />
    </div>
    <div>{line.end}</div>
  </div>
</div>