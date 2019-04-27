const { readFile, writeFile } = require('fs');

const metaRegExpStr = '#(?<key>[a-z]+):(?<value>.+)';
const metaRowRegExp = new RegExp(metaRegExpStr, 'gi');
const metaRegExp = new RegExp(metaRegExpStr, 'i');
const ignoreKeys = /^cover|video|encoding$/i;
const numberKeys = /^bpm|gap$/i;

const songRegExpStr = '(?<type>[:*F-])\\s(?<bpm_start>[0-9]+)(\\s(?<bpm_length>[0-9]+)\\s(?<pitch>[0-9]+)\\s(?<text>.+))?';
const songRowRegExp = new RegExp(songRegExpStr, 'g');
const songRegExp = new RegExp(songRegExpStr);

const metaDataReducer = (result, row) =>
{
  let { key, value } = row.match(metaRegExp).groups;

  if (ignoreKeys.test(key)) return result;

  if (numberKeys.test(key))
  {
    value = parseFloat(value);
  }

  return {
    ...result,
    [key.toLowerCase()]: value,
  };
};

const typeMapping = {
  ':': 'REGULAR',
  '*': 'GOLDEN',
  'F': 'FREESTYLE',
  '-': 'LINE_BREAK',
};

readFile('/home/benni/Downloads/Telegram Desktop/Ohrbooten - An Alle Ladies.txt', (err, content) =>
{
  const contentStr = content.toString();
  const meta = contentStr.match(metaRowRegExp).reduce(metaDataReducer, {});
  const song = [];
  let lastLine;

  if (/yes/i.test(meta.relative))
  {
    throw new Error('Parsing relative song files is not yet implemented!');
  }

  contentStr.match(songRowRegExp).forEach((row) =>
  {
    const { type, bpm_start, bpm_length, pitch, text } = row.match(songRegExp).groups;
    const start = meta.gap + (parseInt(bpm_start, 10) * meta.bpm);

    if (!lastLine || type === '-')
    {
      if (lastLine) lastLine.end = start;
      lastLine = { start, end: null, syllables: [] };
      song.push(lastLine);
      if (type === '-') return;
    }

    lastLine.syllables.push({
      type: typeMapping[type],
      start: meta.gap + (parseInt(bpm_start, 10) * meta.bpm),
      length: bpm_length && parseInt(bpm_length, 10) * meta.bpm,
      pitch: pitch && parseInt(pitch, 10), // TODO map pitch to note
      text,
    });
  });

  console.log(meta);

  writeFile('/home/benni/Git/cantalo/public/api/songs/LqDe5QeUjHY.json', JSON.stringify(song, null, 2), (err) =>
  {
    console.log('Saved');
  });
});