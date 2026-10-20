import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    // Séparer le joueur et les PNJ évite un unique bloc d'entités de près de 700 kB.
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
              name: 'game-player',
              test: /src[\\/]entities[\\/]YautjaPlayer\.js$/,
              priority: 18,
            },
            {
              name: 'game-npcs',
              test: /src[\\/]entities[\\/]HuntNPC\.js$/,
              priority: 17,
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
