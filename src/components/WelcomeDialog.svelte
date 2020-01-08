<script>
  import { onMount } from 'svelte';
  import { _ } from '../services/Translations';
  import AnimationFrames from "../services/AnimationFrames";
  import Microphone, { constraints } from "../services/Microphone";
  import Dialog from './Dialog.svelte';

  let dialog;
  let microphonePermissions;
  let detectedMicrophones = [];
  let selectedMicrophone;
  let detectedInput;
  let channelCount = 1;
  let step = 1;

  $: externalMicrophone = selectedMicrophone && selectedMicrophone.label &&
      !/(eingebautes|built-?in)/i.test(selectedMicrophone.label) || undefined;
  $: channels = Array.apply(null, Array(channelCount)).map((item, i) =>
      ({
        label: String.fromCharCode(65 + i),
        volume: 0,
        hadSignal: false,
      }));

  onMount(async () =>
  {
    if (sessionStorage.microphoneDeviceId)
    {
      const devices = await getInputDevices();

      if (devices.find(device => device.deviceId === sessionStorage.microphoneDeviceId))
      {
        return;
      }
    }

    dialog.open();

    await stepOneMicrophonePermissions();
    await stepTwoCheckDevices();
    await checkInputSignals();
  });

  async function stepOneMicrophonePermissions()
  {
    await checkMicrophonePermissions();

    if (microphonePermissions === 'prompt')
    {
      await requestMicrophonePermissions();
    }

    if (microphonePermissions === 'granted')
    {
      return Promise.resolve()
    }

    return Promise.reject();
  }

  async function checkMicrophonePermissions()
  {
    const { state } = await navigator.permissions.query({ name: 'microphone' });
    microphonePermissions = state;
  }

  async function requestMicrophonePermissions()
  {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    const [track] = stream.getAudioTracks();
    track.stop();
    await checkMicrophonePermissions();
  }

  async function stepTwoCheckDevices()
  {
    await checkDevices();
    navigator.mediaDevices.addEventListener('devicechange', checkDevices);
  }

  async function getInputDevices()
  {
    return (await navigator.mediaDevices.enumerateDevices())
        .filter(device => device.kind === 'audioinput' && device.deviceId !== 'default');
  }

  async function checkDevices()
  {
    detectedMicrophones = await getInputDevices();
    selectedMicrophone = detectedMicrophones.find(device => /singstar/i.test(device.label));

    channelCount = selectedMicrophone ? 2 : 1; // for SingStar USB Mic we have 2 channels
    detectedInput = false;
    if (step === 3) step = 2;
  }

  async function checkInputSignals()
  {
    const mic = new Microphone();
    await mic.start();
    mic.init();

    const animationFrames = new AnimationFrames();

    return new Promise(resolve =>
    {
      const check = () =>
      {
        channels[0].volume = mic.getLeftVolume();
        channels[0].hadSignal = channels[0].hadSignal || channels[0].volume > 50;

        if (channels[1])
        {
          channels[1].volume = mic.getRightVolume();
          channels[1].hadSignal = channels[1].hadSignal || channels[1].volume > 50;
        }

        if (channels.every(channel => channel.hadSignal))
        {
          mic.stop();
          detectedInput = true;
          resolve();
        }
        else
        {
          animationFrames.add('checkInputSignals', check);
        }
      };

      check();
    });
  }

  function resolveIcon(status)
  {
    if (status === true || status === 'granted') return '😊️';
    if (typeof status === 'undefined') return '❓️';
    return '☹️';
  }

  function next()
  {
    switch (step)
    {
      case 1:
        if (microphonePermissions === 'granted') step = 2;
        break;
      case 2:
        if (selectedMicrophone) step = 3;
        break;
      case 3:
        if (detectedInput) done();
    }
  }

  function done()
  {
    navigator.mediaDevices.removeEventListener('devicechange', checkDevices);
    sessionStorage.microphoneDeviceId = selectedMicrophone.deviceId;
    sessionStorage.microphoneCount = channelCount;
    dialog.close();
  }
</script>

<style type="text/scss">
  h1
  {
    margin-top: 0;
  }

  h3
  {
    margin: 0;
  }

  small
  {
    font-weight: normal;
    color: #666;
  }

  .settings
  {
    display: grid;
    grid-template-columns: auto auto;
    grid-row-gap: 8px;
  }

  .icon
  {
    font-family: "Noto Color Emoji", sans-serif;
  }

  .main
  {
    padding-left: 35px;
  }
</style>

<Dialog size="md" autoopen={false} bind:this={dialog}>
  <div slot="header">
    <h1>{$_('welcome.title')}</h1>

    <h2><span class="icon">{'\u{1F3A4}'}</span> {$_('welcome.setup.title')}</h2>
  </div>

  <div class="main">
  {#if step === 1}
    <h3>
      {$_('welcome.setup.permissions')}
      <span class="icon">{resolveIcon(microphonePermissions)}</span>
    </h3>
    <p>{$_('welcome.setup.permissions_desc')}</p>
  {/if}

  {#if step === 2}
    <h3>
      <span>
        {$_('welcome.setup.connect')}
        {#if selectedMicrophone}
          <small>({selectedMicrophone.label})</small>
        {/if}
      </span>
      <span class="icon">{resolveIcon(externalMicrophone)}</span>
    </h3>
    <p>{$_('welcome.setup.connect_desc')}</p>
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
        <input id="device-channels" type="number" min="1" max="2" bind:value={channelCount}>
      </div>
    </div>
  {/if}

  {#if step === 3}
    <h3>
      {$_('welcome.setup.signal')}
      <span class="icon">{resolveIcon(detectedInput)}</span>
    </h3>
    <p>{$_('welcome.setup.signal_desc')}</p>
    {#each channels as channel}
    <div>
      {channel.label} <progress value={channel.volume}></progress>
      {#if channel.hadSignal}
      <span class="icon">✔️</span>
      {/if}
    </div>
    {/each}
  {/if}
  </div>

  <div slot="footer">
    <button on:click={next}>{$_('welcome.continue')}</button>
  </div>
</Dialog>
