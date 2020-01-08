<script>
  import { goto } from '@sapper/app';

  import List, { Item, Text, Graphic } from '@smui/list';
  import MenuSurface from '@smui/menu-surface';
  import VideoSearch from '../../components/editor/VideoSearch.svelte';

  let videoSearchDialog;
</script>

<VideoSearch bind:this={videoSearchDialog} on:selected={({ detail }) => goto(`edit/${detail.id}`)} />

<MenuSurface static style="margin: auto; width: 300px">
  <List>
    <Item on:SMUI:action={() => videoSearchDialog.open()}>
      <Graphic class="material-icons">add_circle</Graphic>
      <Text>Add new song</Text>
    </Item>
    <Item on:SMUI:action={() => console.log('edit')}>
      <Graphic class="material-icons">folder</Graphic>
      <Text>Open existing song</Text>
    </Item>
  </List>
</MenuSurface>