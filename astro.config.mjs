// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from "@astrojs/mdx";
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind({
    applyBaseStyles: false,
  }), mdx()],
  output: "hybrid",
  adapter: vercel({
    imageService: true,
    isr: true,
  }),
});
