import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['index.ts'],
  format: ['cjs', 'esm'],
  sourcemap: true,
  dts: true,
  // Esclude dal bundle le dipendenze che devono essere gestite dal consumer
  external: ['@rainbow-me/rainbowkit', 'wagmi'],
});