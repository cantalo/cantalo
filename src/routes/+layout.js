import '$lib/i18n';
import { locale, waitLocale } from 'svelte-i18n';
import { browser } from '$app/environment';

export const load = async () => {
  if (browser) {
    const _locale = new Intl.Locale(window.navigator.language);
    locale.set(_locale.language);
  }

  await waitLocale();
};