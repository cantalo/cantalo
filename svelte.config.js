import node from '@sveltejs/adapter-node';
import sveltePreprocessPostcss from 'svelte-preprocess-postcss';
import postcssNested from 'postcss-nested';
import postcssHexrgba from 'postcss-hexrgba';
import autoprefixer from 'autoprefixer';

const stylePreprocessor = sveltePreprocessPostcss
({
  useConfigFile: false,
  plugins:
  [
    postcssNested,
    postcssHexrgba,
    autoprefixer,
  ],
});

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: node(),
  },

  preprocess: {
    style: stylePreprocessor
  },
};

export default config;