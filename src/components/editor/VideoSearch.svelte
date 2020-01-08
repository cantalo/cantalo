<script>
  import { createEventDispatcher } from 'svelte'
  import TextField from '@smui/textfield';
  import Icon from '@smui/textfield/icon/index';
  import Dialog, { Title, Content, Actions, InitialFocus } from '@smui/dialog';
  import Button, { Label } from '@smui/button';
  import List, { Item, Text, Graphic, PrimaryText, SecondaryText } from '@smui/list';

  const dispatch = createEventDispatcher();

  let dialog;

  let searchTerm = '';
  let searchRequest;

  let selectedItem = null;

  export const open = () => dialog.open();

  function search()
  {
    if (searchTerm)
    {
      const queryString = new URLSearchParams();
      queryString.set('search', searchTerm);

      searchRequest = fetch('add/search/video.json?' + queryString).then(response => response.json());
    }
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
  <Title id="video-search-dialog-title">Search Video</Title>
  <Content id="video-search-dialog-content">
    <div class="search-container">
      <div class="search-bar">
        <TextField withLeadingIcon type="search" bind:value={searchTerm} variant="outlined"
                   input$placeholder="Search for a Video" input$required
                   style="flex: 1">
          <Icon class="material-icons">search</Icon>
        </TextField>
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
                <Graphic style="background: url({item.thumbnails.default.url}) 0 0 / cover; width: {item.thumbnails.default.width * 0.5}px; height: {item.thumbnails.default.height * 0.5}px"/>
                <Text>
                  <PrimaryText>{item.title}</PrimaryText>
                  <SecondaryText>{item.channel}</SecondaryText>
                </Text>
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
    <Button disabled={!selectedItem} on:click={() => dispatch('selected', selectedItem)}>
      <Label>Choose</Label>
    </Button>
  </Actions>
</Dialog>