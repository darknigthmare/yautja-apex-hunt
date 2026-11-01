import { defineConfig } from 'vite';
import { audioMethodChunksPlugin, audioMethodChunkName } from './scripts/build/audioMethodChunks.js';

export default defineConfig({
  plugins: [{ ...audioMethodChunksPlugin(), apply: 'build' }],
  build: {
    // Bound each real module group without pulling its shared dependencies into
    // the player; retain the full sound API in separate production chunks.
    chunkSizeWarningLimit: 550,
    rolldownOptions: {
      output: {
        strictExecutionOrder: true,
        codeSplitting: {
          groups: [
            {
              name: audioMethodChunkName,
              priority: 23,
              includeDependenciesRecursively: false,
            },
            {
              name: 'graphics-effects',
              test: /node_modules[\\/]three[\\/]examples[\\/]/,
              priority: 21,
              includeDependenciesRecursively: false,
            },
            {
              name: 'three',
              test: /node_modules[\\/]three[\\/]/,
              priority: 20,
              includeDependenciesRecursively: false,
            },
            {
              name: 'game-audio',
              test: /src[\\/]AudioSynthesizer\.js$/,
              priority: 19,
              includeDependenciesRecursively: false,
            },
            {
              name: 'game-player',
              test: /src[\\/]entities[\\/]YautjaPlayer\.js$/,
              priority: 18,
              includeDependenciesRecursively: false,
            },
            {
              name: 'game-npcs',
              test: /src[\\/]entities[\\/]HuntNPC\.js$/,
              priority: 17,
              includeDependenciesRecursively: false,
            },
            {
              name: 'game-entities',
              test: /src[\\/]entities[\\/]/,
              priority: 15,
              includeDependenciesRecursively: false,
            },
            {
              name: 'game-archives',
              test: /src[\\/]data[\\/](?:PreyTaxonomyAndCrossoverCatalog|CanonPreyExpansionV251|CrossoverUniverseEncounters|PreyReferenceMetadata|encounters[\\/])/,
              priority: 16,
              includeDependenciesRecursively: false,
            },
            {
              name: 'game-world',
              test: /src[\\/]world[\\/]/,
              priority: 14,
              includeDependenciesRecursively: false,
            },
            {
              name: 'game-systems',
              test: /src[\\/](data|gameplay)[\\/]/,
              priority: 13,
              includeDependenciesRecursively: false,
            },
          ],
        },
      },
    },
  },
});
