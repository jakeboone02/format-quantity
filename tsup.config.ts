import { writeFile } from 'fs/promises';
import type { Options } from 'tsup';
import { defineConfig } from 'tsup';

export default defineConfig(options => {
  const commonOptions: Options = {
    entry: {
      'format-quantity': 'src/index.ts',
    },
    sourcemap: true,
    dts: true,
    ...options,
  };

  const productionOptions: Options = {
    minify: true,
    replaceNodeEnv: true,
  };

  const opts: Options[] = [
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
      outExtension: () => ({ js: '.js' }),
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
      outExtension: () => ({ js: '.mjs' }),
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
        await writeFile(
          'dist/cjs/index.js',
          `'use strict';
if (process.env.NODE_ENV === 'production') {
  module.exports = require('./format-quantity.cjs.production.js');
} else {
  module.exports = require('./format-quantity.cjs.development.js');
}
`
        );
      },
    },
    // UMD (ish)
    {
      ...commonOptions,
      ...productionOptions,
      dts: false,
      format: 'iife',
      globalName: 'FormatQuantity',
      outExtension: () => ({ js: '.umd.min.js' }),
    },
  ];

  return opts;
});
