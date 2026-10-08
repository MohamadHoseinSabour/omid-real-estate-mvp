import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://MohamadHoseinSabour.github.io',
  base: '/omid-real-estate-mvp',
  trailingSlash: 'always',
  integrations: [tailwind(), react()],
});
