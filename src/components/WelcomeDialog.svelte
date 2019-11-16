<script>
  import { onMount } from 'svelte';
  import { _ } from '../services/Translations';
  import AnimationFrames from "../services/AnimationFrames";
  import Microphone, { constraints } from "../services/Microphone";
  import Dialog from './Dialog.svelte';

  let firstDialog;
  let microphonePermissions;
  let externalMicrophone;
  let detectedMicrophone;
  let detectedInput;
  let allChecked;
  let channels = [
    {
      label: 'A',
      volume: 0,
      hadSignal: false,
    },
    {
      label: 'B',
      volume: 0,
      hadSignal: false,
    },
  ];

  onMount(async () =>
  {
    await checkMicrophonePermissions();
    await checkDevices();
    await checkInputSignals();
    navigator.mediaDevices.addEventListener('devicechange', checkDevices);
  });

  async function checkDevices()
  {
    const devices = await navigator.mediaDevices.enumerateDevices();
    detectedMicrophone = devices.find(device => /singstar/i.test(device.label));
    externalMicrophone = detectedMicrophone ? true : undefined;
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

        channels[1].volume = mic.getRightVolume();
        channels[1].hadSignal = channels[1].hadSignal || channels[1].volume > 50;

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

  function open(node, initValue)
  {
    if (initValue)
    {
      node.setAttribute('open', '');
    }

    return {
      update(updateValue)
      {
        if (updateValue)
        {
          node.setAttribute('open', '');
        }
        else
        {
          node.removeAttribute('open');
        }
      }
    }
  }

  function next()
  {
    firstDialog.close();
  }
</script>

<script context="module">
  import SystemRequirements from '../services/SystemRequirements.js';
  SystemRequirements.addJS('HTMLDetailsElement', () => typeof HTMLDetailsElement === 'function');
</script>

<style type="text/scss">
  h1
  {
    margin-top: 0;
  }

  details
  {
    margin-left: 1em;
  }

  summary
  {
    margin-bottom: 5px;
  }

  summary > h3
  {
    margin: 0;
    display: inline-flex;
    justify-content: space-between;
    width: calc(100% - 40px);
  }

  small
  {
    font-weight: normal;
    color: #666;
  }

  .icon
  {
    font-family: "Noto Color Emoji", sans-serif;
  }
</style>

<Dialog size="md" bind:this={firstDialog}>
  <h1>{$_('welcome.title')}</h1>

  <h2><span class="icon">{'\u{1F3A4}'}</span> {$_('welcome.setup.title')}</h2>

  <details use:open={microphonePermissions !== 'granted'}>
    <summary>
      <h3>
        {$_('welcome.setup.permissions')}
        <span class="icon">{resolveIcon(microphonePermissions)}</span>
      </h3>
    </summary>
    <p>{$_('welcome.setup.permissions_desc')}</p>
    <div class="actions">
      {#if microphonePermissions !== 'granted'}
      <button on:click={requestMicrophonePermissions}>erteilen</button>
      {/if}
    </div>
  </details>

  <details use:open={!externalMicrophone}>
    <summary>
      <h3>
        <span>
          {$_('welcome.setup.connect')}
          {#if detectedMicrophone}
          <small>({detectedMicrophone.label})</small>
          {/if}
        </span>
        <span class="icon">{resolveIcon(externalMicrophone)}</span>
      </h3>
    </summary>
    <p>{$_('welcome.setup.connect_desc')}</p>
  </details>

  <details use:open={!detectedInput}>
    <summary>
      <h3>
        {$_('welcome.setup.signal')}
        <span class="icon">{resolveIcon(detectedInput)}</span>
      </h3>
    </summary>
    <p>{$_('welcome.setup.signal_desc', { channels: channels.length })}</p>
    {#each channels as channel}
    <div>
      {channel.label} <progress value={channel.volume}></progress>
      {#if channel.hadSignal}
      <span class="icon">✔️</span>
      {/if}
    </div>
    {/each}
  </details>

  <button on:click={next}>{$_('welcome.continue')}</button>
</Dialog>