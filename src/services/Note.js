const noteStrings = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export default class Note extends Number
{
  constructor(pitch)
  {
    // pitch = pitch + 12*4;
    super(pitch % 12);
    this.pitch = pitch;
  }

  toString()
  {
    return noteStrings[this.valueOf()];
  }
}