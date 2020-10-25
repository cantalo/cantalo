<script>
  import { createEventDispatcher } from 'svelte'
  import TextField from '@smui/textfield';
  import Dialog, { Title, Content, Actions, InitialFocus } from '@smui/dialog';
  import Button, { Label } from '@smui/button';
  import List, { Item, Text, PrimaryText, SecondaryText, Meta } from '@smui/list';

  const dispatch = createEventDispatcher();

  let dialog;

  let searchTerm = { artist: '', title: '' };
  let searchRequest;

  let selectedItem = null;

  export const open = () => dialog.open();

  function search()
  {
    if (searchTerm.artist || searchTerm.title)
    {
      const queryString = new URLSearchParams();
      if (searchTerm.artist) queryString.set('artist', searchTerm.artist);
      if (searchTerm.title) queryString.set('title', searchTerm.title);

      searchRequest = fetch('api/search/song.json?' + queryString).then(response => response.json());
    }
  }

  async function importSelected()
  {
    if (!selectedItem || !selectedItem.id) return;

    const queryString = new URLSearchParams();
    queryString.set('id', selectedItem.id);
    const response = await fetch('api/song/import.json?' + queryString);
    const { file } = await response.json();

    dispatch('import', file);
  }
</script>

<style>
  .search-container
  {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 500px;
    min-height: 200px;
  }

  .search-bar
  {
    position: sticky;
    top: 0;
    z-index: 2;
    display: flex;
    align-items: center;
    align-self: flex-start;
    width: 100%;
    background: #fff;
  }

  .message
  {
    margin: auto;
  }
</style>

<Dialog bind:this={dialog} aria-labelledby="video-search-dialog-title" aria-describedby="video-search-dialog-content">
  <Title id="video-search-dialog-title">Search in USDB</Title>
  <Content id="video-search-dialog-content">
    <div class="search-container">
      <div class="search-bar">
        <TextField type="search" label="Artist" bind:value={searchTerm.artist} style="flex: 1; margin-right: 8px"/>
        <TextField type="search" label="Title" bind:value={searchTerm.title} style="flex: 1"/>
        <Button on:click={search}>
          <Label>Ok</Label>
        </Button>
      </div>
      {#if searchRequest}
        {#await searchRequest}
          <div class="message">
            Searching...
          </div>
        {:then searchResults}
          <List class="mdc-list--thumbnail-list" twoLine singleSelection>
            {#each searchResults as item}
              <Item on:SMUI:action={() => selectedItem = item} selected={selectedItem === item}>
                <Text>
                  <PrimaryText>{item.title}</PrimaryText>
                  <SecondaryText>{item.artist}</SecondaryText>
                </Text>
                {#if item.goldenNotes === 'Yes'}
                  <Meta class="material-icons">brightness</Meta>
                {/if}
              </Item>
            {/each}
          </List>
        {:catch error}
          <div class="message">
            Something went wrong: {error.message}
          </div>
        {/await}
      {/if}
    </div>
  </Content>
  <Actions>
    <Button color="secondary">
      <Label>Cancel</Label>
    </Button>
    <Button disabled={!selectedItem} on:click={importSelected}>
      <Label>Import</Label>
    </Button>
  </Actions>
</Dialog>