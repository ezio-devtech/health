import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { mkdirSync, writeFileSync } from 'fs';
import { terser } from 'rollup-plugin-terser';

const extensions = ['.ts'];

const globals = {
  pdfmake: 'pdfmake',
  stream: 'stream',
};

const sourcemapPathTransform = (path) => path.replaceAll('\\', '/').replaceAll('../../../src', '../../src');

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/cjs/index.js',
        format: 'umd',
        name: 'medplum.core',
        sourcemap: true,
        sourcemapPathTransform,
        globals,
      },
      {
        file: 'dist/cjs/index.min.js',
        format: 'umd',
        name: 'medplum.core',
        plugins: [terser()],
        sourcemap: true,
        sourcemapPathTransform,
        globals,
      },
    ],
    plugins: [
      json(),
      resolve({ extensions }),
      typescript({ tsconfig: 'tsconfig.cjs.json', resolveJsonModule: true }),
      {
        buildEnd: () => {
          mkdirSync('./dist/cjs', { recursive: true });
          writeFileSync('./dist/cjs/package.json', '{"type": "commonjs"}');
        },
      },
    ],
    external: Object.keys(globals),
  },
  {
    input: 'src/index.ts',
    output: [
      {
        dir: 'dist/esm',
        format: 'esm',
        preserveModules: true,
        preserveModulesRoot: 'src',
        sourcemap: true,
        sourcemapPathTransform,
      },
      {
        file: 'dist/esm/index.min.js',
        format: 'esm',
        plugins: [terser()],
        sourcemap: true,
        sourcemapPathTransform,
      },
    ],
    plugins: [
      json(),
      resolve({ extensions }),
      typescript({ tsconfig: 'tsconfig.esm.json', resolveJsonModule: true }),
      {
        buildEnd: () => {
          mkdirSync('./dist/esm/node_modules/tslib', { recursive: true });
          writeFileSync('./dist/esm/package.json', '{"type": "module"}');
          writeFileSync('./dist/esm/node_modules/tslib/package.json', '{"type": "module"}');
        },
      },
    ],
    external: Object.keys(globals),
  },
];
