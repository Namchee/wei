import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/',
  publicDir: './src/assets',
  plugins: [
    VitePWA({
      base: '/',
      manifest: {
        name: 'Wei',
        short_name: 'Wei',
        theme_color: '#FFFFFF',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
});
