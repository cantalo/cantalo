<script>
  import { afterUpdate } from 'svelte';

  export let label;
  export let group = 'meta';

  let definitionElm;

  $: name = label.toLowerCase().replace(/[^A-Za-z]/g, '-');

  afterUpdate(() =>
  {
    const input = definitionElm.querySelector('input');
    input.setAttribute('id', `${group}-${name}`);
    input.setAttribute('placeholder', `Enter ${label}`);
  });
</script>

<style>
  label
  {
    text-transform: capitalize;
  }

  dd
  {
    margin-left: 30px;
  }
</style>

<dt>
  <label for="{group}-{name}">{label}</label>
</dt>
<dd bind:this={definitionElm}>
  <slot></slot>
</dd>
