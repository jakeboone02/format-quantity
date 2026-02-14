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
          writeFile(
            'dist/cjs/index.d.ts',
            `export * from './format-quantity.cjs.development.js';`
          ),
        ]);
      },
    },
    // UMD (ish)
    {
      ...commonOptions,
      ...productionOptions,
      dts: false,
      format: 'iife',
      globalName: 'FormatQuantity',
      outputOptions: { globals: { 'numeric-quantity': 'numericQuantity' } },
      outExtensions: () => ({ js: '.umd.min.js' }),
    },
  ];

  return opts;
});

export default config;
