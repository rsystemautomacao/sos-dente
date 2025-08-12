import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'SOS Dente - Primeiros Socorros em Trauma Dentário',
        short_name: 'SOS Dente',
        description: 'Aplicativo de primeiros socorros para trauma dentário em crianças e adolescentes',
        theme_color: '#3B82F6',
        background_color: '#F8FAFC',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/SOS DENTE.png',
            sizes: '64x64 32x32 24x24 16x16',
            type: 'image/png'
          },
          {
            src: '/SOS DENTE.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/SOS DENTE.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg}']
      }
    })
  ],
  server: {
    port: 3000
  }
})
