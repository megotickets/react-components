import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['index.ts'],
  format: ['cjs', 'esm'],
  sourcemap: true,
  dts: true,
  esbuildOptions(options) {
    options.loader = {
      ...options.loader,
      '.css': 'text'
    };
  },
  // Esclude dal bundle le dipendenze che devono essere gestite dal consumer
  external: ['@rainbow-me/rainbowkit', 'wagmi'],
});