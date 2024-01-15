import { VERSION } from '$env/static/private';

export const load = async () => {
  return {
    appVersion: VERSION,
  }
}