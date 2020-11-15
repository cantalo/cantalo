<script>
  import { createEventDispatcher } from 'svelte';

  import Dialog, { Title, Content, Actions } from '@smui/dialog';
  import Button, { Label } from '@smui/button';

  const dispatch = createEventDispatcher();

  export const open = () => dialog.open();

  let dialog;
  let pitches = [];

  function readAsArrayBuffer(file)
  {
    const fileReader = new FileReader();

    return new Promise(resolve =>
    {
      fileReader.onload = e => resolve(e.target.result);
      fileReader.readAsArrayBuffer(file);
    });
  }

  async function analyse({ target })
  {
    const audioCtx = new AudioContext();
    const PitchDetection = (await import('../../services/PitchDetection')).default;
    const audioData = await readAsArrayBuffer(target.files[0]);
    const buffer = await audioCtx.decodeAudioData(audioData);
    const offlineCtx = new OfflineAudioContext(1, buffer.duration * 3000, 3000);
    const pitchDetection = new PitchDetection(offlineCtx);
    const source = offlineCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(offlineCtx.destination);
    source.connect(pitchDetection);
    source.start();

    const collection = [];

    for (let i = 0; i < buffer.duration; i += 1/20)
    {
      offlineCtx.suspend(i).then(() =>
      {
        const detected = pitchDetection.getPitch();
        collection.push({ note: detected && detected.note, start: parseInt(i * 1000) });
        return offlineCtx.resume();
      });
    }

    const renderedBuffer = await offlineCtx.startRendering();

    pitches = collection
      .reduce((acc, cur) =>
      {
        const last = acc[acc.length - 1];

        if (!cur.note)
        {
          cur.note = { unknown: true };
        }

        if (last && cur.note.pitch !== last.note.pitch)
        {
          last.end = cur.start;
        }

        if (!last || cur.note.pitch !== last.note.pitch)
        {
          acc.push(cur);
        }

        return acc;
      }, [])
      .filter(it => !it.note.unknown);
  }
</script>

<Dialog bind:this={dialog} aria-labelledby="vocals-dialog-title" aria-describedby="vocals-dialog-content">
  <Title id="vocals-dialog-title">Import Vocals</Title>
  <Content id="vocals-dialog-content">
    <input type="file" on:change={analyse}>
  </Content>
  <Actions>
    <Button color="secondary">
      <Label>Cancel</Label>
    </Button>
    <Button disabled={!pitches.length} on:click={() => dispatch('import', pitches)}>
      <Label>Import</Label>
    </Button>
  </Actions>
</Dialog>