import preact from '@preact/preset-vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Relative asset URLs let the build run from any sub-path, such as a preview or a project sub-path.
  base: './',
  plugins: [preact()],
  test: {
    include: ['src/**/*.test.ts'],
  },
});
