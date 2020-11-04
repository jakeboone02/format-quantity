import typescriptPlugin from 'rollup-plugin-typescript2';
import pkg from './package.json';

export default {
  input: 'src/format-quantity.ts',
  output: [
    { file: pkg.browser, format: 'umd', name: 'formatQuantity' },
    { file: pkg.main, format: 'cjs', exports: 'default' },
    { file: pkg.module, format: 'es' },
  ],
  plugins: [
    typescriptPlugin({
      typescript: require('typescript'),
    }),
  ],
};
