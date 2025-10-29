/**
 * Local WiFi Server - Serve Dynasty of Emberveil on your local network
 * Run with: node local-wifi-server.js
 */

const express = require('express');
const path = require('path');
const os = require('os');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8080;

// Get all network interfaces
function getNetworkInterfaces() {
  const nets = os.networkInterfaces();
  const results = [];
  
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip internal (loopback) and non-IPv4 addresses
      if (net.family === 'IPv4' && !net.internal) {
        results.push({
          name,
          address: net.address,
          netmask: net.netmask,
          mac: net.mac
        });
      }
    }
  }
  
  return results;
}

// Serve static files from dist folder
const distPath = path.join(__dirname, 'dist');

if (!fs.existsSync(distPath)) {
  console.error('❌ Error: dist folder not found!');
  console.log('\n📦 Please build the game first:');
  console.log('   npm run build\n');
  process.exit(1);
}

app.use(express.static(distPath));

// Handle SPA routing - serve index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  const interfaces = getNetworkInterfaces();
  
  console.log('\n🎮 Dynasty of Emberveil - Local WiFi Server\n');
  console.log('━'.repeat(60));
  console.log('\n📡 Server is running on your local network!\n');
  console.log('Access URLs:');
  console.log(`   🏠 Local:     http://localhost:${PORT}`);
  console.log(`   🏠 Local:     http://127.0.0.1:${PORT}`);
  
  if (interfaces.length > 0) {
    console.log('\n   🌐 Network URLs (share these with others on your WiFi):');
    interfaces.forEach((iface, index) => {
      console.log(`   ${index + 1}. http://${iface.address}:${PORT}`);
      console.log(`      Interface: ${iface.name}`);
    });
  } else {
    console.log('\n   ⚠️  No network interfaces found');
  }
  
  console.log('\n━'.repeat(60));
  console.log('\n💡 Tips:');
  console.log('   • Share the Network URL with others on your WiFi');
  console.log('   • Make sure your firewall allows port', PORT);
  console.log('   • Press Ctrl+C to stop the server');
  console.log('\n🔥 Enjoy playing Dynasty of Emberveil!\n');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Shutting down server...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\n👋 Shutting down server...');
  process.exit(0);
});
