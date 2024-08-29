import { defineConfig } from 'cypress';
import vitePreprocessor from 'cypress-vite';

export default defineConfig({
  video: false,
  e2e: {
    setupNodeEvents(on, _config) {
      on('file:preprocessor', vitePreprocessor());
    },
  },
});
