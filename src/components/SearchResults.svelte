<script>
  export let request;
  export let value;
</script>

<style>
  .view
  {
    max-height: 200px;
    overflow: auto;
  }

  label
  {
    display: table-row;
    cursor: pointer;
  }

  input,
  label > :global(img)
  {
    display: table-cell;
  }

  label > :global(div)
  {
    display: table-cell;
    vertical-align: middle;
    padding: 3px 6px;
  }

  label:nth-child(even)
  {
    background: rgba(#fff, .3);
  }
</style>

{#if request}
  {#await request}
    <i>Searching ...</i>
  {:then results}
    <div class="view">
      <table>
        {#each results as result}
          <label>
            <div>
              <input type="radio" bind:group={value} value={result}>
            </div>
            <slot {result} />
          </label>
        {/each}
      </table>
    </div>
  {:catch err}
    <i>Something went wrong: {err.message}</i>
  {/await}
{/if}