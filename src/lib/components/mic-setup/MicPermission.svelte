<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import { _, locale } from 'svelte-i18n';

  import Microphone, { constraints } from '../../services/Microphone';
  import MicSetupView from './MicSetupView.svelte';

  const dispatch = createEventDispatcher();

  let browser;
  let permission;
  let permissionsMicrophoneNotSupported;

  async function stepOneMicrophonePermissions()
  {
    await checkMicrophonePermissions();

    if (permission === 'prompt')
    {
      await requestMicrophonePermissions();
    }

    if (permission === 'granted')
    {
      dispatch('granted');
    }
  }

  async function checkMicrophonePermissions()
  {
    if (permissionsMicrophoneNotSupported)
    {
      const mics = await Microphone.getInputDevices();

      if (mics.every(mic => mic.label !== ''))
      {
        permission = 'granted';
      }
      else
      {
        await requestMicrophonePermissions();
      }

      return;
    }

    try
    {
      const { state } = await navigator.permissions.query({ name: 'microphone' });
      permission = state;
    }
    catch (err)
    {
      if (err.message.includes('not a valid value for enumeration PermissionName'))
      {
        permissionsMicrophoneNotSupported = true;
        permission = 'prompt';
      }
    }
  }

  async function requestMicrophonePermissions()
  {
    try
    {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const [track] = stream.getAudioTracks();
      track.stop();
    }
    catch (err)
    {
      if (err.name === 'NotAllowedError')
      {
        permission = 'denied';
        return;
      }
    }

    await checkMicrophonePermissions();
  }

  onMount(() =>
  {
    browser = /firefox/i.test(navigator.userAgent) ? 'firefox' : 'chrome';
    stepOneMicrophonePermissions()
  });
</script>

<style>
  .left
  {
    display: flex;
  }

  .prompt-arrow
  {
    position: absolute;
    top: 140px;
    left: 330px;
    width: 140px;
  }

  .firefox .prompt-arrow
  {
    top: 170px;
    left: 520px; /* TODO not responsive */
  }

  .denied-arrow
  {
    position: absolute;
    top: 5px;
    left: 110px;
    height: 100px;
  }

  .firefox .denied-arrow
  {
    left: 280px;
  }

  img.denied
  {
    margin: 110px auto auto;
    box-shadow: 0 0 25px #333;
    border-radius: 4px;
  }

  ol
  {
    counter-reset: steps;
    list-style: none;
    margin-top: 25px;
    padding-left: 10px;
  }

  ol > li
  {
    position: relative;
    padding-left: 40px;
    margin-bottom: 20px;
  }

  ol > li::before
  {
    counter-increment: steps;
    content: counter(steps);

    position: absolute;
    left: 0;
    top: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.2em;
    height: 1.2em;
    transform: translateY(-50%);

    border-radius: 100%;
    background: #fff;
    color: rgb(53, 132, 167);
    font-size: 24px;
    opacity: .9;
  }
</style>

<MicSetupView {browser}>
  <div class="left {browser}" slot="left">
    {#if permission === 'prompt'}
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35 40" class="prompt-arrow">
        <g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-miterlimit="10">
          <path d="M10.34 7.74c-.23 7.73-.185 20.344 4.537 26.833 5.306 7.29 11.102.634 16.463-3.833"/>
          <path stroke-linejoin="round"
                d="M3.66 11.665c3.721-2.325 4.35-6.603 7.404-9.481 1.045 3.027 3.441 9.07 6.125 11.113"/>
        </g>
      </svg>
    {:else if permission !== 'granted'}
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 40" class="denied-arrow">
        <g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
           stroke-miterlimit="10">
          <path
              d="M9.572 37.573c1.59-8.981.079-20.268.667-29.333M16.803 12.367c-3.562-2.561-3.912-6.87-6.775-9.94-1.238 2.954-4.023 8.829-6.831 10.695"/>
        </g>
      </svg>
      <img src="/assets/mic-permission/{browser}-{$locale}.png" class="denied" alt="">
    {/if}
  </div>

  <div slot="right">
    <h1>{$_('welcome.setup.title')}</h1>
    <h3>{$_('welcome.setup.permissions')}</h3>
    <p>{$_('welcome.setup.permissions_desc')}</p>
    <ol>
      {#if browser === 'firefox'}
        {#if permission !== 'granted' && permission !== 'prompt'}
          <li>{$_('welcome.setup.permissions_step_address_bar')}</li>
          <li>{$_('welcome.setup.permissions_step_remove_blocked')}</li>
          <li>{$_('welcome.setup.permissions_step_reload')}</li>
        {/if}
        <li>{@html $_('welcome.setup.permissions_step_remember')}</li>
        <li>{@html $_('welcome.setup.permissions_step_allow')}</li>
      {:else}
        {#if permission !== 'granted' && permission !== 'prompt'}
          <li>{$_('welcome.setup.permissions_step_address_bar')}</li>
        {/if}
        <li>{@html $_('welcome.setup.permissions_step_allow')}</li>
      {/if}
    </ol>
  </div>
</MicSetupView>
