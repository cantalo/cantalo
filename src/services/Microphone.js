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

export default class Microphone
{
  async start()
  {
    this.stream = await navigator.mediaDevices.getUserMedia(constraints);

    if (!this.PitchDetection)
    {
      const PitchDetection = await import('./PitchDetection');
      this.PitchDetection = PitchDetection.default;
    }
  }

  stop()
  {
    const [track] = this.stream.getAudioTracks();
    track.stop();
  }

  init()
  {
    const audioContext = new AudioContext();
    const audioSource = audioContext.createMediaStreamSource(this.stream);
    const stereoSplitter = audioContext.createChannelSplitter(2);
    audioSource.connect(stereoSplitter);

    this.leftAnalyser = new this.PitchDetection(audioContext);
    stereoSplitter.connect(this.leftAnalyser, 1);

    this.rightAnalyser = new this.PitchDetection(audioContext);
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

  getLeftVolume()
  {
    return this.leftAnalyser.getVolume();
  }

  getRightVolume()
  {
    return this.rightAnalyser.getVolume();
  }
}