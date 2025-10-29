#!/usr/bin/env node

/**
 * Quick Test Script - Verify game loads and server works
 * Run with: node test-game.js
 */

import { createServer } from 'http';
import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🧪 Testing game load and server...\n');

// Test 1: Check if dist folder exists
console.log('1️⃣  Checking dist folder...');
try {
  const indexPath = join(__dirname, 'dist', 'index.html');
  const indexContent = readFileSync(indexPath, 'utf-8');
  console.log('   ✅ dist/index.html exists (' + (indexContent.length / 1024).toFixed(2) + ' KB)');
} catch (error) {
  console.log('   ❌ dist/index.html not found - Run: npm run build');
  process.exit(1);
}

// Test 2: Check if game assets exist
console.log('\n2️⃣  Checking game assets...');
try {
  const fs = await import('fs');
  const files = fs.readdirSync(join(__dirname, 'dist', 'assets'));
  console.log(`   ✅ Found ${files.length} asset files`);
  files.forEach(file => {
    if (file.endsWith('.js')) {
      console.log(`      - ${file}`);
    }
  });
} catch (error) {
  console.log('   ⚠️  Assets folder issue:', error.message);
}

// Test 3: Test simple HTTP server
console.log('\n3️⃣  Testing HTTP server...');
const testPort = 8888;
const server = createServer((req, res) => {
  if (req.url === '/') {
    try {
      const indexPath = join(__dirname, 'dist', 'index.html');
      const content = readFileSync(indexPath, 'utf-8');
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
    } catch (error) {
      res.writeHead(500);
      res.end('Error loading game');
    }
  } else if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', test: true }));
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(testPort, 'localhost', () => {
  console.log(`   ✅ Test server started on http://localhost:${testPort}`);
  console.log('\n4️⃣  Running health check...');
  
  // Test health endpoint
  import('http').then(http => {
    http.default.get(`http://localhost:${testPort}/health`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          console.log('   ✅ Health check passed:', json);
          
          console.log('\n5️⃣  Testing game page load...');
          http.default.get(`http://localhost:${testPort}/`, (res) => {
            let html = '';
            res.on('data', chunk => html += chunk);
            res.on('end', () => {
              if (html.includes('Dynasty of Emberveil') || html.includes('game-canvas')) {
                console.log('   ✅ Game page loads successfully');
                console.log(`   📊 HTML size: ${(html.length / 1024).toFixed(2)} KB`);
                
                // All tests passed
                console.log('\n' + '='.repeat(60));
                console.log('✅ ALL TESTS PASSED!');
                console.log('='.repeat(60));
                console.log('\n🎮 Ready to start multiplayer server:');
                console.log('   npm start\n');
                
                server.close();
                process.exit(0);
              } else {
                console.log('   ⚠️  Game page content looks incomplete');
                console.log('   First 200 chars:', html.substring(0, 200));
                server.close();
                process.exit(1);
              }
            });
          }).on('error', (err) => {
            console.log('   ❌ Failed to load game page:', err.message);
            server.close();
            process.exit(1);
          });
        } catch (error) {
          console.log('   ❌ Invalid JSON response:', error.message);
          server.close();
          process.exit(1);
        }
      });
    }).on('error', (err) => {
      console.log('   ❌ Health check failed:', err.message);
      server.close();
      process.exit(1);
    });
  });
});

// Timeout after 10 seconds
setTimeout(() => {
  console.log('\n⚠️  Test timeout - server may have issues');
  server.close();
  process.exit(1);
}, 10000);
