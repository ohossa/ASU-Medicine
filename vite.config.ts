import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

/// <reference types="vitest" />

function figmaAssetResolver() {
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

export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        ws: true,
      },
    },
  },
  plugins: [
    figmaAssetResolver(),
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2,mp3}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB to handle large quiz bank chunks
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
})
