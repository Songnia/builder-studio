import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig(() => {
  const appMode = process.env.VITE_APP_MODE || 'public';

  return {
    base: '/',
    plugins: [
      inspectAttr(), 
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        devOptions: {
          enabled: true
        },
        workbox: {
          // The admin bundle is currently larger than Workbox's default 2 MiB limit.
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
          // Rollup emits the selected HTML input under its original name. Keep
          // that file in the build so Workbox can precache and serve it for SPA
          // navigations; index.html is a deployment-compatible copy.
          navigateFallback: appMode === 'admin' ? 'index-admin.html' : 'index-public.html',
        },
        manifest: {
          name: 'VANDA STUDIO Admin',
          short_name: 'VANDA STUDIO',
          description: 'Administration Panel for Vanda Studio',
          theme_color: '#4caf50',
          background_color: '#ffffff',
          display: 'standalone',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            }
          ]
        }
      })
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: process.env.VITE_DEV_API_TARGET || 'http://localhost:8000',
          changeOrigin: true,
        },
        '/media': {
          target: process.env.VITE_DEV_API_TARGET || 'http://localhost:8000',
          changeOrigin: true,
        },
      },
    },
    build: {
      outDir: appMode === 'admin' ? 'dist-admin' : 'dist-public',
      rollupOptions: {
        input: appMode === 'admin' ? 'index-admin.html' : 'index-public.html',
        output: {
          // Rename the HTML entry to index.html in the output
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash][extname]',
        },
      },
    },
  };
});
