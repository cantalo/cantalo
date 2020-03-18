import SystemRequirements from './SystemRequirements';
SystemRequirements.addJS('Permissions', () => navigator.permissions instanceof Permissions);
SystemRequirements.addJS('MediaDevices', () => navigator.mediaDevices instanceof MediaDevices);
SystemRequirements.addJS('AudioContext', () => !!AudioContext);

export const constraints = {
  audio:
  {
    echoCancellation: false,
    autoGainControl: false,
    noiseSuppression: false,
  }
};

let PitchDetection;
const devices = new Map();

export default class Microphone
{
  constructor(deviceId, channel)
  {
    this.deviceId = deviceId;
    this.channel = channel;
  }

  async init()
  {
    if (!PitchDetection)
    {
      PitchDetection = (await import('./PitchDetection')).default;
    }

    if (!devices.has(this.deviceId))
    {
      const init = async () =>
      {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: {
          deviceId: this.deviceId,
          ...constraints.audio,
        } });

        const audioContext = new AudioContext();
        const audioSource = audioContext.createMediaStreamSource(stream);

        let stereoSplitter;

        if (typeof this.channel === 'number')
        {
          stereoSplitter = audioContext.createChannelSplitter(2);
          audioSource.connect(stereoSplitter);
        }

        return { stream, audioContext, audioSource, stereoSplitter };
      };

      devices.set(this.deviceId, init());
    }

    const { stream, audioContext, audioSource, stereoSplitter } = await devices.get(this.deviceId);
    this.stream = stream;
    this.analyser = new PitchDetection(audioContext);

    if (stereoSplitter)
    {
      stereoSplitter.connect(this.analyser, this.channel);
    }
    else
    {
      audioSource.connect(this.analyser);
    }
  }

  stop()
  {
    const [track] = this.stream.getAudioTracks();
    track.stop();
  }

  getPitch()
  {
    return this.analyser.getPitch();
  }

  getVolume()
  {
    return this.analyser.getVolume();
  }
}