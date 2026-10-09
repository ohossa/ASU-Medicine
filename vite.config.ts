import bankManifest from './src/app/generated/bankManifest.json';
import { localApi } from './server/local-api';
import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig, type UserConfig, type Plugin } from 'vite'
import type { InlineConfig } from 'vitest/node'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

/// <reference types="vitest" />

function figmaAssetResolver(): Plugin {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

const config: UserConfig & { test: InlineConfig } = {
  base: process.env.VITE_BASE_PATH || '/',
  esbuild: {
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  },
  plugins: [
    localApi(),
    figmaAssetResolver(),
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2,mp3}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        globIgnores: Object.keys(bankManifest).map(code=>`**/${code}-*.js`),
        runtimeCaching:[{urlPattern:new RegExp('/assets/(?:'+Object.keys(bankManifest).join('|')+')-[^/]+\\.js$'),handler:'CacheFirst',options:{cacheName:'asu-visited-banks-v1',cacheableResponse:{statuses:[200]},expiration:{maxEntries:60,maxAgeSeconds:90*24*60*60}}}],
      },
    }),
    ...(process.env.ANALYZE ? [visualizer({ open: true, gzipSize: true, brotliSize: true, filename: 'stats.html' })] : []),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
  build: {
    reportCompressedSize: false,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/react-router/')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/@clerk/')) {
            return 'vendor-clerk';
          }
          if (id.includes('node_modules/motion/') || id.includes('node_modules/@emotion/')) {
            return 'vendor-motion';
          }
          if (id.includes('node_modules/@mui/')) {
            return 'vendor-mui';
          }
          if (id.includes('node_modules/lucide-react/')) {
            return 'vendor-lucide';
          }
          if (id.includes('node_modules/recharts/') || id.includes('node_modules/d3-')) {
            return 'vendor-recharts';
          }
          if (id.includes('node_modules/@radix-ui/') || id.includes('node_modules/vaul/') || id.includes('node_modules/date-fns/') || id.includes('node_modules/class-variance-authority/') || id.includes('node_modules/tailwind-merge/') || id.includes('node_modules/clsx/')) {
            return 'vendor-utils';
          }
          if (id.includes('canvas-confetti') || id.includes('src/app/lib/celebrate') || id.includes('src/app/lib/sound')) {
            return 'fx-libs';
          }
        },
      },
    },
  },
  test: {
    globals: true,
    // Bound concurrent full-bank fixtures to avoid CPU/JSON-import contention.
    maxWorkers: 4,
    environment: 'happy-dom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/app/**/*.ts'],
      exclude: ['src/app/**/*.d.ts', 'node_modules/'],
    },
  },
}

export default defineConfig(config)
