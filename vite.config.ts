import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // Enable polyfills for specific packages
      include: ['buffer'],
      // Whether to polyfill specific globals
      globals: {
        Buffer: true,
      },
    }),
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'cms-vendor': ['decap-cms-app'],
          'markdown-vendor': ['react-markdown', 'remark-gfm', 'gray-matter'],
        }
      }
    }
  },
  resolve: {
    alias: {
      'ajv-keywords/dist/keywords': 'ajv-keywords/keywords',
    }
  }
});