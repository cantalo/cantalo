<script>
  import { untapped } from '../../routes/edit/_editor';
</script>

<style>
  .untapped
  {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 50%;
    display: flex;
    align-items: center;
    height: 110px;
    padding-left: 16px;
    overflow: hidden;
    pointer-events: none;
  }

  .untapped .syllable
  {
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 8px 16px;
    margin-left: 16px;
    background: #fff;
  }
</style>

{#if $untapped.length}
  <div class="untapped">
    {#each $untapped as line}
      {#each line.syllables as syllable}
        <div class="syllable">
          {syllable.text}
        </div>
      {/each}
    {/each}
  </div>
{/if}