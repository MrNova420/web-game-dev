import { defineConfig } from 'vite';

export default defineConfig({
  // Base path for deployment - use '/' for root deployment
  base: '/',
  
  server: {
    port: 3000,
    open: true
  },
  
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // Disable sourcemaps in production for smaller bundle
    minify: 'esbuild', // Use esbuild for faster builds (included by default)
    rollupOptions: {
      output: {
        manualChunks: {
          'three': ['three'],
          'cannon': ['cannon-es']
        }
      }
    },
    chunkSizeWarningLimit: 1000 // Increase limit since we have a large game
  },
  
  optimizeDeps: {
    include: ['three', 'cannon-es']
  }
});
