<script context="module">
  export async function preload()
  {
    const res = await this.fetch(`api/edit.json`);
    const data = await res.json();

    if (res.status === 200)
    {
      return data;
    }

    this.error(res.status, data.message);
  }
</script>

<script>
  import Menu from '@smui/menu';
  import List, { Item, Text, Separator } from '@smui/list';
  import TextField from '@smui/textfield';
  import IconButton, { Icon } from '@smui/icon-button';
  import LinearProgress from '@smui/linear-progress';
  import Slider from '@smui/slider';
  import FormField from '@smui/form-field';
  import Snackbar, { Label } from '@smui/snackbar';
  import AnalyseVocals from '../../components/editor/AnalyseVocals.svelte';

  import ImportSearch from '../../components/editor/ImportSearch.svelte';
  import ImportLyrics from '../../components/editor/ImportLyrics.svelte';
  import Marker from '../../components/editor/Marker.svelte';

  import { playing, time, duration, speed, buffer, seekTo } from '../../components/YouTube.svelte';
  import { meta, lines, videoInBackground, zoom, pitches, parseUsdFile, parseLyrics } from './_editor';

  export let availableGenres;
  export let availableLanguages;

  let importSearch;
  let importExportMenu;
  let savedSnackbar;
  let importLyrics;
  let analyseVocals;

  $: disabled = !$meta.id;
  $: progress = $time / $duration;

  const formatTime = t => new Date(t)
    .toLocaleTimeString('en', {
      second: '2-digit',
      minute: 'numeric',
    })
    .replace(/^0(.+)$/, '$1');

  async function save()
  {
    try
    {
      const response = await fetch(`api/song/${$meta.id}.json`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            meta: $meta,
            lines: $lines,
          }),
        });

      if (!response.ok)
      {
        throw response;
      }

      savedSnackbar.open();
    }
    catch (err)
    {
      console.error(err);
    }
  }
</script>

<style>
  .editor
  {
    display: flex;
    flex-direction: column;
    background: #fff;
  }

  main
  {
    position: relative;
    display: flex;
    flex: 1;
    box-shadow: 0 -2px 15px #999 inset;
  }

  header, footer
  {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 8px 16px;
  }

  header .spacer,
  footer .spacer
  {
    flex: 1;
  }

  .progress
  {
    position: relative;
  }

  .progress :global(.mdc-linear-progress__bar)
  {
    transition: none;
  }

  .editor.stopped .progress :global(.mdc-linear-progress)
  {
    visibility: hidden;
  }

  .editor :global(.mdc-snackbar)
  {
    top: 80px;
    bottom: auto;
  }
</style>

<svelte:head>
  <meta name="robots" content="none">
</svelte:head>

<datalist id="meta-genres">
  {#each availableGenres as genre}
    <option value={genre}>
  {/each}
</datalist>

<datalist id="meta-languages">
  {#each availableLanguages as lang}
    <option value={lang}>
  {/each}
</datalist>

<div class="editor absolute" class:stopped={$playing === null}>
  <header>
    <TextField label="Artist" bind:value={$meta.artist} {disabled} input$required />
    <TextField label="Title" bind:value={$meta.title} {disabled} input$required />
    <TextField label="Genre" bind:value={$meta.genre} {disabled} input$required input$list="meta-genres" />
    <TextField label="Language" bind:value={$meta.language} {disabled} input$required input$list="meta-language" input$maxlength="2" />
    <TextField type="number" label="Year" bind:value={$meta.year} {disabled} input$required input$min="1900" input$max={new Date().getFullYear()} />
    <div class="spacer"></div>
    <div>
      <IconButton class="material-icons" disabled>undo</IconButton>
      <IconButton class="material-icons" disabled>redo</IconButton>
    </div>
    <div>
      <IconButton class="material-icons" {disabled} on:click={() => importExportMenu.setOpen(true)}>import_export</IconButton>
      <Menu bind:this={importExportMenu}>
        <List>
          <Item on:SMUI:action={() => importSearch.open()}><Text>Import from USDB</Text></Item>
          <Item on:SMUI:action={() => importLyrics.open()}><Text>Import Lyrics</Text></Item>
          <Item on:SMUI:action={() => analyseVocals.open()}><Text>Analyse &amp; import vocals</Text></Item>
<!--          <Item><Text>Import from USD txt file</Text></Item>-->
<!--          <Separator />-->
<!--          <Item><Text>Export as USD txt file</Text></Item>-->
        </List>
      </Menu>

      <IconButton class="material-icons" {disabled} on:click={save}>save</IconButton>
      <IconButton class="material-icons" {disabled}>cloud_upload</IconButton>
    </div>
  </header>

  <main>
    <slot />
  </main>

  <div class="progress">
    {#if $duration}
      <Marker position={($meta.videogap * 1000 || 0) / $duration}>
        <Icon class="material-icons">movie</Icon>
      </Marker>
      <Marker position={($meta.videoend * 1000 || $duration) / $duration}>
        <Icon class="material-icons">movie</Icon>
      </Marker>
      <Marker position={(($meta.videogap * 1000 || 0) + ($meta.gap || 0)) / $duration}>
        <Icon class="material-icons">music_note</Icon>
      </Marker>
      <Marker position={($meta.end || $duration) / $duration}>
        <Icon class="material-icons">music_note</Icon>
      </Marker>
    {/if}
    <LinearProgress {progress} buffer={$buffer} />
  </div>

  <Snackbar bind:this={savedSnackbar}>
    <Label>Saved.</Label>
  </Snackbar>

  <footer>
    <TextField type="number" class="field shaped-outlined" variant="outlined"
               label="BPM" {disabled} bind:value={$meta.bpm}
               input$max="999" input$min="10" input$required>
    </TextField>

    <IconButton class="material-icons" {disabled} on:click={() => seekTo(($time / 1000) - 5)}>replay_5</IconButton>

    <FormField style="display: flex">
      <span slot="label" style="padding-left: 8px; width: max-content; display: block;">
        <span title={$time}>{formatTime($time)}</span> / {formatTime($duration)}</span>
      <IconButton toggle bind:pressed={$playing} {disabled}>
        <Icon class="material-icons">play_arrow</Icon>
        <Icon class="material-icons" on>pause</Icon>
      </IconButton>
    </FormField>

    <div class="spacer"></div>

    <FormField align="end" style="display: flex; width: 200px">
      <span slot="label" style="padding-right: 8px; width: max-content; display: block;">Speed</span>
      <Slider bind:value={$speed} min={25} max={150} step={25} {disabled} discrete displayMarkers />
    </FormField>

    <FormField align="end" style="display: flex; width: 200px">
      <span slot="label" style="padding-right: 8px; width: max-content; display: block;">Zoom</span>
      <Slider bind:value={$zoom} min={1} max={10} step={1} {disabled} discrete />
    </FormField>

    <IconButton toggle bind:pressed={$videoInBackground} {disabled}>
      <Icon class="material-icons">aspect_ratio</Icon>
      <Icon class="material-icons" on>picture_in_picture_alt</Icon>
    </IconButton>
  </footer>
</div>

<ImportSearch bind:this={importSearch} on:import={e => parseUsdFile(e.detail)} />
<ImportLyrics bind:this={importLyrics} on:import={e => parseLyrics(e.detail)} />
<AnalyseVocals bind:this={analyseVocals} on:import={e => pitches.set(e.detail)} />