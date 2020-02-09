import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import commonjs from 'rollup-plugin-commonjs';
import svelte from 'rollup-plugin-svelte';
import sveltePreprocessPostcss from 'svelte-preprocess-postcss';
import { terser } from 'rollup-plugin-terser';
import json from '@rollup/plugin-json';
import config from 'sapper/config/rollup.js';
import pkg from './package.json';

const mode = process.env.NODE_ENV;
const dev = mode === 'development';

const dedupe = importee => importee === 'svelte' || importee.startsWith('svelte/');
const onwarn = (warning, onwarn) => {
	if (
		(warning.code === 'CIRCULAR_DEPENDENCY' &&
			/[/\\]@sapper[/\\]/.test(warning.message))
	) {
		return
	}

	// ignores the annoying this is undefined warning
	if(warning.code === 'THIS_IS_UNDEFINED') {
		return
	}

	onwarn(warning)
};

const stylePreprocessor = sveltePreprocessPostcss
({
	useConfigFile: false,
	plugins:
	[
		require('postcss-nested'),
		require('postcss-hexrgba'),
		require('autoprefixer'),
	],
});

export default {
	client: {
		input: config.client.input(),
		output: config.client.output(),
		plugins: [
			json(),
			replace({
				'process.browser': true,
				'process.env.NODE_ENV': JSON.stringify(mode)
			}),
			svelte({
				dev,
				hydratable: true,
				emitCss: true,
				preprocess: {
					style: stylePreprocessor
				},
			}),
			resolve({
				browser: true,
				dedupe
			}),
			commonjs(),
			!dev && terser({
				module: true
			})
		],

		onwarn,
	},

	server: {
		input: config.server.input(),
		output: config.server.output(),
		plugins: [
			json(),
			replace({
				'process.browser': false,
				'process.env.NODE_ENV': JSON.stringify(mode)
			}),
			svelte({
				generate: 'ssr',
				dev,
				preprocess: {
					style: stylePreprocessor
				},
			}),
			resolve({
				dedupe
			}),
			commonjs({
				extensions: ['.js', '.mjs']
			})
		],
		external: Object.keys(pkg.dependencies).concat(
			require('module').builtinModules || Object.keys(process.binding('natives'))
		),

		onwarn,
	},
};
