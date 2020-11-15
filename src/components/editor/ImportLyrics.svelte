<script>
  import { createEventDispatcher } from 'svelte'
  import Dialog, { Title, Content, Actions } from '@smui/dialog';
  import Button, { Label } from '@smui/button';
  import Textfield from '@smui/textfield';
  import HelperText from '@smui/textfield/helper-text/index';

  const dispatch = createEventDispatcher();

  export const open = () => dialog.open();

  let dialog;
  let lyrics = '';
</script>

<style>
  .lyrics-container
  {
    width: 500px;
    padding-top: 10px;
  }

  .lyrics-container :global(.mdc-text-field__input)
  {
    height: calc(100vh - 202px);
    white-space: nowrap;
  }
</style>

<Dialog bind:this={dialog} aria-labelledby="lyrics-dialog-title" aria-describedby="lyrics-dialog-content">
  <Title id="lyrics-dialog-title">Import Lyrics</Title>
  <Content id="lyrics-dialog-content">
    <div class="lyrics-container">
      <Textfield fullwidth textarea bind:value={lyrics} label="Lyrics" input$aria-controls="helper-text-lyrics" input$aria-describedby="helper-text-lyrics" />
      <HelperText id="helper-text-lyrics">Paste Lyrics separated in lines and syllables using + character</HelperText>
    </div>
  </Content>
  <Actions>
    <Button color="secondary">
      <Label>Cancel</Label>
    </Button>
    <Button disabled={!lyrics} on:click={() => dispatch('import', lyrics)}>
      <Label>Import</Label>
    </Button>
  </Actions>
</Dialog>