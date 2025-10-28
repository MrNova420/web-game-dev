#!/usr/bin/env node

/**
 * Quick Local Server for Dynasty of Emberveil
 * 
 * Usage:
 *   node serve.js [port] [mode]
 * 
 * Examples:
 *   node serve.js              # Serve dist/ on port 8000
 *   node serve.js 3000         # Serve dist/ on port 3000
 *   node serve.js 8080 dev     # Serve root (dev mode) on port 8080
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

// Configuration
const args = process.argv.slice(2);
const port = parseInt(args[0]) || 8000;
const mode = args[1] || 'prod'; // 'prod' or 'dev'
const rootDir = mode === 'dev' ? __dirname : path.join(__dirname, 'dist');

// MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'font/otf',
  '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg'
};

// Check if dist folder exists in prod mode
if (mode === 'prod' && !fs.existsSync(rootDir)) {
  console.error('❌ Error: dist/ folder not found!');
  console.log('Please build the game first:');
  console.log('  npm run build');
  console.log('');
  console.log('Or run in dev mode:');
  console.log('  node serve.js 8000 dev');
  process.exit(1);
}

// Create HTTP server
const server = http.createServer((req, res) => {
  // Parse URL
  let filePath = path.join(rootDir, req.url === '/' ? 'index.html' : req.url);
  
  // Get file extension
  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  // Security: prevent directory traversal
  const resolvedPath = path.resolve(filePath);
  const resolvedRoot = path.resolve(rootDir);
  if (!resolvedPath.startsWith(resolvedRoot)) {
    res.writeHead(403);
    res.end('403 Forbidden');
    return;
  }

  // Read and serve file
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // File not found - serve index.html for SPA routing
        fs.readFile(path.join(rootDir, 'index.html'), (error, content) => {
          if (error) {
            res.writeHead(500);
            res.end('500 Internal Server Error');
          } else {
            res.writeHead(200, { 
              'Content-Type': 'text/html',
              'Cache-Control': 'no-cache'
            });
            res.end(content, 'utf-8');
          }
        });
      } else {
        res.writeHead(500);
        res.end('500 Internal Server Error: ' + error.code);
      }
    } else {
      // Serve file with appropriate cache headers
      const cacheControl = extname === '.html' 
        ? 'no-cache' 
        : 'public, max-age=31536000'; // 1 year for assets

      res.writeHead(200, { 
        'Content-Type': contentType,
        'Cache-Control': cacheControl,
        'Access-Control-Allow-Origin': '*' // CORS for dev
      });
      res.end(content, 'utf-8');
    }
  });
});

// Start server
server.listen(port, () => {
  console.log('');
  console.log('🎮 Dynasty of Emberveil - Local Server');
  console.log('═══════════════════════════════════════');
  console.log('');
  console.log(`✨ Mode: ${mode === 'dev' ? 'Development' : 'Production'}`);
  console.log(`📁 Serving: ${rootDir}`);
  console.log(`🌐 URL: http://localhost:${port}`);
  console.log('');
  console.log('Press Ctrl+C to stop the server');
  console.log('');
  
  if (mode === 'dev') {
    console.log('⚠️  Dev mode: No hot-reload. Use "npm run dev" for development.');
    console.log('');
  }
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('');
  console.log('👋 Shutting down server...');
  server.close(() => {
    console.log('✅ Server stopped');
    process.exit(0);
  });
});

// Handle errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${port} is already in use!`);
    console.log('Try a different port:');
    console.log(`  node serve.js 8080`);
  } else {
    console.error('❌ Server error:', error);
  }
  process.exit(1);
});
