import { defineConfig } from 'cypress';

export default defineConfig({
  viewportWidth: 1200,
  viewportHeight: 1000,
  video: false,
  downloadsFolder: 'cypress/downloads',
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      return require('./cypress/plugins/index.js')(on, config);
    },
    baseUrl: 'http://localhost:3000',
  },
});
