const noteStrings = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export default class Note extends Number
{
  constructor(pitch)
  {
    super(pitch);
  }

  toString()
  {
    return noteStrings[this.valueOf() % 12];
  }
}