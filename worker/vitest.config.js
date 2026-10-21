import { defineConfig } from 'vitest/config';
import { cloudflareTest } from '@cloudflare/vitest-plugin';

export default defineConfig({
  plugins:[cloudflareTest({
    main:'./src/index.js',
    wrangler:{configPath:'./wrangler.test.toml'},
    miniflare:{
      bindings:{HOPE_STT_TOKEN:'test-only-hope-token'},
    },
  })],
  test:{include:['test/**/*.test.js']},
});
