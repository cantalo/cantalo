<script>
  import Icon from 'svelte-icon';

  export let icon;
  export let href = undefined;

  $: rel = href && href.startsWith('http') ? 'noopener noreferrer' : undefined;
  $: target = href && href.startsWith('http') ? '_blank' : undefined;
</script>

<style>
  a
  {
    display: inline-flex;
    flex-direction: column;
    align-items: center;

    padding: 10px;
    margin: 10px;

    border: 2px solid transparent;
    border-radius: 15px;

    &,
    &:link,
    &:visited
    {
      color: currentColor;
      text-decoration: none;
    }

    &:hover,
    &:focus
    {
      border-color: currentColor;
      background: rgba(0, 0, 0, .3);
    }
  }

  span
  {
    margin-top: 10px;
  }
</style>

<a {href} {rel} {target} on:click role="button">
  <Icon data={icon} size="4em" />
  <span>
    <slot></slot>
  </span>
</a>