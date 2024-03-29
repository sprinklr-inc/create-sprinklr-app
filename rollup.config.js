import esbuild from 'rollup-plugin-esbuild';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
import shebang from 'rollup-plugin-preserve-shebang';

export default {
  input: './index.ts',
  output: {
    file: 'dist/index.js',
    name: 'index.js',
    format: 'cjs',
  },
  plugins: [
    nodeResolve({
      exportConditions: ['node'], // add node option here,
      preferBuiltins: false,
    }),
    shebang(),
    commonjs(),
    json(),
    esbuild({
      minify: process.env.NODE_ENV === 'production',
      define: {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      },
    }),
    copy({
      targets: [
        {
          src: 'templates/*',
          dest: 'dist/templates',
        },
      ],
    }),
  ],
};
