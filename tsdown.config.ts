import { writeFile } from 'fs/promises';
import type { UserConfig } from 'tsdown';
import { defineConfig } from 'tsdown';

const config: ReturnType<typeof defineConfig> = defineConfig(options => {
  const commonOptions: UserConfig = {
    entry: {
      'format-quantity': 'src/index.ts',
    },
    platform: 'neutral',
    sourcemap: true,
    ...options,
  };

  const productionOptions: UserConfig = {
    minify: true,
    define: { NODE_ENV: 'production' },
  };

  const opts: UserConfig[] = [
    // ESM, standard bundler dev, embedded `process` references
    {
      ...commonOptions,
      format: 'esm',
      clean: true,
    },
    // ESM, Webpack 4 support. Target ES2017 syntax to compile away optional chaining and spreads
    {
      ...commonOptions,
      entry: {
        'format-quantity.legacy-esm': 'src/index.ts',
      },
      // ESBuild outputs `'.mjs'` by default for the 'esm' format. Force '.js'
      outExtensions: () => ({ js: '.js' }),
      format: 'esm',
      target: 'es2017',
      suppressWarnings: [
        'Big integer literals are not available in the configured target environment.',
      ],
    },
    // ESM for use in browsers. Minified, with `process` compiled away
    {
      ...commonOptions,
      ...productionOptions,
      entry: {
        'format-quantity.production': 'src/index.ts',
      },
      outExtensions: () => ({ js: '.mjs' }),
      format: 'esm',
    },
    // CJS development
    {
      ...commonOptions,
      entry: {
        'format-quantity.cjs.development': 'src/index.ts',
      },
      format: 'cjs',
      outDir: './dist/cjs/',
    },
    // CJS production
    {
      ...commonOptions,
      ...productionOptions,
      entry: {
        'format-quantity.cjs.production': 'src/index.ts',
      },
      format: 'cjs',
      outDir: './dist/cjs/',
      onSuccess: async () => {
        // Write the CJS index file
        await Promise.all([
          writeFile(
            'dist/cjs/index.js',
            `'use strict';
if (process.env.NODE_ENV === 'production') {
  module.exports = require('./format-quantity.cjs.production.js');
} else {
  module.exports = require('./format-quantity.cjs.development.js');
}
`
          ),
          writeFile('dist/cjs/index.d.ts', `export * from './format-quantity.cjs.development.js';`),
        ]);
      },
    },
    // UMD (browser global `FormatQuantity`, plus CJS/AMD interop)
    {
      ...commonOptions,
      ...productionOptions,
      dts: false,
      format: 'umd',
      globalName: 'FormatQuantity',
      deps: { alwaysBundle: ['numeric-quantity'] },
      outExtensions: () => ({ js: '.min.js' }),
      // Bundlers that treat classic <script> tags as CJS modules (e.g. Bun's HTML entrypoint
      // support) hit the UMD `exports` branch, so the browser global never gets defined.
      // Re-expose it explicitly when running in a browser.
      footer: {
        js: `typeof window<"u"&&typeof exports=="object"&&(window.FormatQuantity=exports);`,
      },
    },
  ];

  return opts;
});

export default config;
