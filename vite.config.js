import { defineConfig } from 'vite';
import os from 'os';

// Get local network IP address
function getLocalNetworkIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

export default defineConfig({
  // Base path for deployment - use '/' for root deployment
  base: '/',
  
  server: {
    host: '0.0.0.0', // Listen on all network interfaces for local WiFi access
    port: 5173,
    strictPort: false, // Try next port if 5173 is taken
    open: true,
    cors: true,
    // Display network URL on startup
    hmr: {
      host: getLocalNetworkIP(),
    }
  },
  
  preview: {
    host: '0.0.0.0', // Also allow local network access for preview
    port: 4173,
    strictPort: false,
    open: true,
    cors: true
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
