import { register, init, getLocaleFromNavigator } from 'svelte-i18n';

const appName = '¡\u202FCantalo\u202F!'

register('en', () => Promise.resolve({
  app:
  {
    name: appName,
    title: `${appName} (beta)`,
    description: 'Sing your favorite songs online on Cantalo!',
  },
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
  sing:
  {
    title: 'Sing {song} from {artist} at {title}',
    pause:
    {
      headline: 'Paused',
      continue: 'Continue playing',
      restart: 'Start from beginning',
      back: 'Back to overview',
      open_youtube: 'Open video on YouTube',
    },
  },
  score:
  {
    title: 'Song score for {song} from {artist} at {title}',
    headline: 'Song score',
    back: 'Song overview',
    table:
    {
      notes: 'notes',
      lineBonus: 'line bonus',
      goldenNotes: 'golden notes',
      total: 'total',
    },
    highscores:
    {
      headline: 'High scores',
      empty: 'No high score stored yet',
    }
  },
}));

register('de', () => Promise.resolve({
  app:
  {
    description: 'Singe auf Cantalo online deine lieblings Songs!',
  },
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
  sing:
  {
    title: 'Singe {song} von {artist} auf {title}',
    pause:
    {
      headline: 'Pausiert',
      continue: 'Weiter spielen',
      restart: 'Von vorne anfangen',
      back: 'Zurück zur Übersicht',
      open_youtube: 'Video auf YouTube öffnen',
    },
  },
  score:
  {
    title: 'Punkte für {song} von {artist} auf {title}',
    headline: 'Punkte',
    back: 'Zur Übersicht',
    table:
    {
      notes: 'Noten',
      lineBonus: 'Zeilenbonus',
      goldenNotes: 'Goldene Noten',
      total: 'Gesamt',
    },
    highscores:
    {
      headline: 'Bestenliste',
      empty: 'Bisher noch kein Eintrag',
    }
  },
}));

init({
  fallbackLocale: 'en',
  initialLocale: getLocaleFromNavigator(),
});
