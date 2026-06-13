import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

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
  plugins: [
    figmaAssetResolver(),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/react-router/')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/@clerk/')) {
            return 'vendor-clerk';
          }
          if (id.includes('node_modules/framer-motion/') || id.includes('node_modules/motion/') || id.includes('node_modules/@emotion/')) {
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
        }
      }
    }
  }
})
