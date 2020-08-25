<script context="module">
  import SystemRequirements from '../services/SystemRequirements';
  SystemRequirements.addCSS('grid', () => CSS.supports('display', 'grid'));
</script>

<script>
  import { onMount } from 'svelte';

  import MicSignal from './mic-setup/MicSignal.svelte';
  import MicDevice from './mic-setup/MicDevice.svelte';
  import MicPermission from './mic-setup/MicPermission.svelte';

  import Microphone from '../services/Microphone';

  import { players } from '../stores/players';

  let step = 'permission';
  let show = false;
  let device;
  let channels;

  onMount(async () =>
  {
    if (sessionStorage.microphoneDeviceId)
    {
      const devices = await Microphone.getInputDevices();

      if (devices.find(device => device.deviceId === sessionStorage.microphoneDeviceId && device.label !== ''))
      {
        await initPlayers(sessionStorage.microphoneDeviceId, sessionStorage.microphoneCount);
        return;
      }
    }

    show = true;
  });

  function deviceSelected({ detail })
  {
    device = detail.device;
    channels = detail.channels;
    step = 'signal';
  }

  function done()
  {
    // navigator.mediaDevices.removeEventListener('devicechange', checkDevices); // TODO
    sessionStorage.microphoneDeviceId = device.deviceId;
    sessionStorage.microphoneCount = channels;
    initPlayers(device.deviceId, channels);
    show = false;
  }

  function initPlayers(deviceId, channels)
  {
    players.reset();

    for (let i = channels; i > 0; i--)
    {
      players.add(deviceId, i - 1);
    }

    players.initialized.resolve();
  }
</script>

{#if show}
  {#if step === 'permission'}
    <MicPermission on:granted={() => step = 'device'} />
  {:else if step === 'device'}
    <MicDevice on:selected={deviceSelected} />
  {:else if step === 'signal'}
    <MicSignal {device} {channels} on:detected={done} />
  {/if}
{:else}
  <slot />
{/if}