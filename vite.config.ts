import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// index.html stays at the project root, where Vite expects it. The only thing
// that needs configuring is publicDir: the challenge ships pre-optimized assets
// in /images, so they are served from the root as /icon-dice.svg and friends.
export default defineConfig({
  plugins: [react()],
  publicDir: 'images',
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
  },
});
