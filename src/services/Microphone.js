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
    echoCancellation: false,
    autoGainControl: false,
    noiseSuppression: false,
  }
};

class Microphone
{
  async start()
  {
    this.stream = await mediaDevices.getUserMedia(constraints);
  }

  stop()
  {
    const [track] = this.stream.getAudioTracks();
    track.stop();
  }

  async requestPermission()
  {
    const { state } = await permissions.query({ name: 'microphone' });

    if (state === 'prompt')
    {
      try
      {
        // Start and stop stream to request microphone permissions
        await this.start();
        this.stop();

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

  init()
  {
    const audioSource = audioContext.createMediaStreamSource(this.stream);
    const stereoSplitter = audioContext.createChannelSplitter(2);
    audioSource.connect(stereoSplitter);

    this.leftAnalyser = new PitchDetection(audioContext);
    stereoSplitter.connect(this.leftAnalyser, 1);

    this.rightAnalyser = new PitchDetection(audioContext);
    stereoSplitter.connect(this.rightAnalyser, 0);
  }

  getLeft()
  {
    return this.leftAnalyser.getPitch();
  }

  getRight()
  {
    return this.rightAnalyser.getPitch();
  }
}

export default new Microphone();