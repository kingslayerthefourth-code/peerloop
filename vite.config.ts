import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: './',
  plugins: [react(), VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['icon.svg'],
    manifest: {
      name: 'PeerLoop — Make room for everyone to help',
      short_name: 'PeerLoop',
      description: 'Free skill exchanges for your school club. Local, bilingual, and offline.',
      theme_color: '#14594d',
      background_color: '#f6f5ef',
      display: 'standalone',
      icons: [{ src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
    },
    workbox: { globPatterns: ['**/*.{js,css,html,svg,webmanifest}'], navigateFallback: 'index.html' },
  })],
  test: { include: ['src/**/*.test.{ts,tsx}'] },
});
