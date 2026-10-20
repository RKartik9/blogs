// @ts-check
import fs from 'node:fs';
import { defineConfig, envField } from 'astro/config';
import node from '@astrojs/node';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// Vercel has no writable disk, so there the site is read-only: posts and
// images in data/ are bundled into the function at build time.
const dataFiles = () =>
  fs.readdirSync('data', { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => `./${entry.parentPath}/${entry.name}`);

export default defineConfig({
  output: 'server',
  adapter: process.env.VERCEL ? vercel({ includeFiles: dataFiles() }) : node({ mode: 'standalone' }),
  integrations: [react()],
  env: {
    schema: {
      ADMIN_PASSWORD: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
