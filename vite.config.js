import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    // Three.js est isolé dans son propre chunk vendor ; les chunks applicatifs restent sous 400 kB.
    chunkSizeWarningLimit: 550,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'three',
              test: /node_modules[\\/]three[\\/]/,
              priority: 20,
            },
            {
              name: 'game-entities',
              test: /src[\\/]entities[\\/]/,
              priority: 15,
            },
            {
              name: 'game-world',
              test: /src[\\/]world[\\/]/,
              priority: 14,
            },
            {
              name: 'game-systems',
              test: /src[\\/](data|gameplay)[\\/]/,
              priority: 13,
            },
          ],
        },
      },
    },
  },
});
