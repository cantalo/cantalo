import { readable } from 'svelte/store';

import AnimationFrames from './AnimationFrames';
import PitchDetection from './PitchDetection';
import SystemRequirements from './SystemRequirements';
SystemRequirements.addJS('Permissions', () => navigator.permissions instanceof Permissions);
SystemRequirements.addJS('MediaDevices', () => navigator.mediaDevices instanceof MediaDevices);
SystemRequirements.addJS('AudioContext', () => !!AudioContext);

const { permissions, mediaDevices } = navigator;
const audioContext = new AudioContext();
const constraints = {
  audio:
  {
    echoCancellation: true,
    autoGainControl: true,
    noiseSuppression: true,
  }
};

class Microphone
{
  async requestPermission()
  {
    const { state } = await permissions.query({ name: 'microphone' });

    if (state === 'prompt')
    {
      try
      {
        // Start and stop stream to request microphone permissions
        const stream = await mediaDevices.getUserMedia(constraints);
        const [track] = stream.getAudioTracks();
        track.stop();

        return 'granted';
      }
      catch (error)
      {
        if (error instanceof DOMException && /permission denied/i.test(error.message))
        {
          return 'denied';
        }

        throw error;
      }
    }

    return state;
  }

  async start()
  {
    this.stream = await mediaDevices.getUserMedia(constraints);

    const audioSource = audioContext.createMediaStreamSource(this.stream);
    const stereoSplitter = audioContext.createChannelSplitter(2);
    audioSource.connect(stereoSplitter);

    this.leftAnalyser = new PitchDetection(audioContext);
    stereoSplitter.connect(this.leftAnalyser, 1);

    this.rightAnalyser = new PitchDetection(audioContext);
    stereoSplitter.connect(this.rightAnalyser, 0);
  }

  stop()
  {
    this.stream.stop();
  }

  updates()
  {
    return readable({}, (set) =>
    {
      const update = () =>
      {
        const left = this.leftAnalyser.getPitch();
        const right = this.rightAnalyser.getPitch();

        console.debug('updatePitch leftPitch', left);
        console.debug('updatePitch rightPitch', right);

        if (left || right)
        {
          set({ left, right });
        }

        AnimationFrames.add(this.constructor.name, update);
      };

      update();

    	return () => { AnimationFrames.remove(this.constructor.name) };
    });
  }
}

export default new Microphone();