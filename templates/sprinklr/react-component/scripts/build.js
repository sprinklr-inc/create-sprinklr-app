import { readdirSync, statSync } from 'fs';
import { build } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

const BASE_PATH = resolve(process.cwd(), 'src/components');

const components = readdirSync(BASE_PATH).filter(function (folder) {
  return statSync(resolve(BASE_PATH, folder)).isDirectory();
});

components.forEach(async componentName => {
  console.log(`Building ${componentName}`);
  try {
    await build({
      define: {
        'process.env.NODE_ENV': process.env.DEV_MODE === 'true' ? '"dev"' : '"production"',
      },
      plugins: [react(), cssInjectedByJsPlugin()],
      build: {
        sourcemap: process.env.DEV_MODE === 'true' ? 'inline' : false,
        watch: process.env.DEV_MODE === 'true',
        emptyOutDir: false,
        chunkSizeWarningLimit: 300,
        outDir: `./out/${componentName}`,
        lib: {
          entry: resolve(BASE_PATH, `${componentName}/index.ts`),
          name: 'SpxComponent',
          formats: ['iife'],
          fileName(format, name) {
            return `${name}.js`;
          },
        },
        rollupOptions: {
          external: ['react', 'react-dom'],
          output: {
            globals: {
              react: 'window.React',
              'react-dom': 'window.ReactDOM',
            },
          },
        },
      },
    });
  } catch (error) {
    console.log(`Error while building ${componentName}`, error);
  }
});
