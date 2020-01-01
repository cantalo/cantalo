import { locale, dictionary } from 'svelte-i18n'
export { _ } from 'svelte-i18n';

const dictionaries = {
  en:
  {
    welcome:
    {
      title: 'Welcome to Cantalo!',
      setup:
      {
        title: 'Setup microphones',
        permissions: 'Microphone permissions',
        permissions_desc: 'To play Cantalo we need the permission to access your microphone. Click on "Allow always" button in top left pop-over.',
        connect: 'Connect external microphone',
        connect_desc: 'To better detect your voice it is recommended to connect an external microphone, instead of a build-in',
        connect_device: 'Input device:',
        connect_device_choose: '(Choose input device)',
        connect_device_channels: 'Microphones:',
        signal: 'Testing microphone signals',
        signal_desc: 'Please speak shortly into each microphone to check if the signal works.',
      },
      continue: 'Continue',
    },
  },
  de:
  {
    welcome:
    {
      title: 'Willkommen bei Cantalo!',
      setup:
      {
        title: 'Mikrofone einrichten',
        permissions: 'Zugriff auf das Mikrofon',
        permissions_desc: 'Damit du Cantalo spielen kannst benötigen wir die Berechtigung auf dein Mikrofone zuzugreifen. Bitte bestätige oben links mit "Immer zulassen".',
        connect: 'Externes Microphone angeschlossen',
        connect_desc: 'Um deine Stimme bestmöglich zu erkennen empfiehlt es sich ein externes Mikrofone, anstelle eines im Gerät verbauten, anzuschließen. Am Besten funktioniert es mit den Original SingStar Mikrofonen.',
        connect_device: 'Eingabegerät:',
        connect_device_choose: '(Eingabegerät auswählen)',
        connect_device_channels: 'Mikrofone:',
        signal: 'Mikrofon-Signal testen',
        signal_desc: 'Bitte spreche kurz in jedes Mikrofon um zu testen ob alles einwandfrei funktioniert.',
      },
      continue: 'Weiter',
    },
  },
};

dictionary.set(dictionaries);

function getLocale()
{
  if (process.browser)
  {
    navigator.languages.forEach(language =>
    {
      if (language in dictionaries)
      return language;
    });
  }
  // TODO use Accept-Languages header server side

  return 'en';
}

locale.set(getLocale());