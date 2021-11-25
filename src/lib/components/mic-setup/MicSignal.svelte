<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { _ } from 'svelte-i18n';

  import MicSetupView from './MicSetupView.svelte';

  import AnimationFrames from '../../services/AnimationFrames';
  import Microphone from '../../services/Microphone';

  export let device;
  export let channels;

  const dispatch = createEventDispatcher();

  $: channelList = Array.apply(null, Array(channels)).map((item, i) =>
    ({
      label: String.fromCharCode(65 + i),
      volume: 0,
      hadSignal: false,
    }));

  async function checkInputSignals()
  {
    const animationFrames = new AnimationFrames();

    await Promise.all(channelList.map(async (channel, i) =>
    {
      channel.mic = new Microphone(device.deviceId, i);
      await channel.mic.init();
    }));

    const check = () =>
    {
      channelList = channelList.map(channel =>
      {
        channel.volume = channel.mic.getVolume();
        channel.hadSignal = channel.hadSignal || channel.volume > 70;
        return channel;
      });

      if (channelList.every(channel => channel.hadSignal))
      {
        channelList = channelList.map(channel => ({
          ...channel,
          volume: 0,
        }));

        dispatch('detected');
      }
      else
      {
        animationFrames.add('checkInputSignals', check);
      }
    };

    check();
  }

  onMount(checkInputSignals);
</script>

<style>
  .left
  {
    display: flex;
  }

  .settings
  {
    margin: 170px auto auto;
  }

  .settings > div
  {
    display: flex;
    margin: 3px 0;
  }

  progress[value]
  {
    appearance: none;
    height: 20px;
    width: 200px;
    margin-right: 5px;
    padding: 2px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, .25) inset;
  }

  progress[value]::-webkit-progress-bar
  {
    background: transparent;
  }

  progress[value]::-webkit-progress-value /* can not me merged with firefox pseudo selector */
  {
    background-image:
        linear-gradient(-45deg,
        transparent 33%, rgba(0, 0, 0, .1) 33%,
        rgba(0,0, 0, .1) 66%, transparent 66%),
        linear-gradient(to top,
        rgba(255, 255, 255, .25),
        rgba(0, 0, 0, .25)),
        linear-gradient(to right, #25cc00, #f44);

    border-radius: 4px;
    background-size: 35px 20px, 100% 100%, 200px 100%;
  }

  progress[value]::-moz-progress-bar
  {
    background-image:
        linear-gradient(-45deg,
        transparent 33%, rgba(0, 0, 0, .1) 33%,
        rgba(0,0, 0, .1) 66%, transparent 66%),
        linear-gradient(to top,
        rgba(255, 255, 255, .25),
        rgba(0, 0, 0, .25)),
        linear-gradient(to right, #25cc00, #f44);

    border-radius: 4px;
    background-size: 35px 20px, 100% 100%, 200px 100%;
  }

  progress.done
  {
    opacity: .75;
  }

  .icon
  {
    font-family: "Noto Color Emoji", sans-serif;
  }

  .hidden
  {
    visibility: hidden;
  }
</style>

<MicSetupView>
  <div slot="left" class="left">
    <div class="settings">
      {#each channelList as channel}
        <label for="channel-{channel.label}">Channel {channel.label}</label>
        <div>
          <progress id="channel-{channel.label}" value={channel.volume} max="100" class:done={channel.hadSignal}></progress>
          <span class="icon" class:hidden={!channel.hadSignal}>✔️</span>
        </div>
      {/each}
    </div>
  </div>

  <div slot="right">
    <h1>{$_('welcome.setup.title')}</h1>
    <h3>{$_('welcome.setup.signal')}</h3>
    <p>{$_('welcome.setup.signal_desc')}</p>
  </div>
</MicSetupView>
