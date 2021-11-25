<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import { _ } from 'svelte-i18n';

  import MicSetupView from './MicSetupView.svelte';

  import Microphone from '../../services/Microphone';

  const dispatch = createEventDispatcher();

  let detectedMicrophones = [];
  let selectedMicrophone;
  let channels = 1;

  $: externalMicrophone = selectedMicrophone && selectedMicrophone.label &&
      !/(eingebautes|built-?in)/i.test(selectedMicrophone.label);

  async function stepTwoCheckDevices()
  {
    await checkDevices();
    navigator.mediaDevices.addEventListener('devicechange', checkDevices);
  }

  async function checkDevices()
  {
    detectedMicrophones = await Microphone.getInputDevices();
    selectedMicrophone = detectedMicrophones.find(device => /singstar/i.test(device.label));

    channels = selectedMicrophone ? 2 : 1; // for SingStar USB Mic we have 2 channels
  }

  onMount(stepTwoCheckDevices);
</script>

<style>
  .left
  {
    display: flex;
  }

  .settings
  {
    display: grid;
    grid-template-columns: auto auto;
    grid-gap: 8px;
    margin: 170px auto auto;
  }
</style>

<MicSetupView>
  <div slot="left" class="left">
    <div class="settings">
      <label for="input-device">{$_('welcome.setup.connect_device')}</label>
      <select id="input-device" bind:value={selectedMicrophone}>
        <option value={undefined} disabled>{$_('welcome.setup.connect_device_choose')}</option>
        {#each detectedMicrophones as microphone}
          <option value={microphone}>{microphone.label}</option>
        {/each}
      </select>

      <label for="device-channels">{$_('welcome.setup.connect_device_channels')}</label>
      <div>
        <input id="device-channels" type="number" min="1" max="2" bind:value={channels}>
      </div>

      <div>
        <button on:click={() => dispatch('selected', { device: selectedMicrophone, channels })}>{$_('welcome.continue')}</button>
      </div>
    </div>
  </div>

  <div slot="right">
    <h1>{$_('welcome.setup.title')}</h1>
    <h3>{$_('welcome.setup.connect')}</h3>
    <p>{$_('welcome.setup.connect_desc')}</p>
    {#if externalMicrophone === false}
      <p>You selected a build-in microphone. Using build in microphones may not work properly!</p>
    {/if}
  </div>
</MicSetupView>