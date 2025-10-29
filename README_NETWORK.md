# Dynasty of Emberveil v2.2.0 - Network & Multiplayer Update

## 🆕 What's New

### Local WiFi/Network Deployment
Play with friends on the same WiFi network!

**Quick Start:**
```bash
# Option 1: Development server with network access
npm run dev:network

# Option 2: Production build with WiFi server
npm run serve:wifi
```

The server will automatically display all network URLs:
```
🎮 Dynasty of Emberveil - Local WiFi Server

📡 Server is running on your local network!

Access URLs:
   🏠 Local:     http://localhost:8080
   
   🌐 Network URLs (share these with others on your WiFi):
   1. http://192.168.1.100:8080
      Interface: eth0
```

### Multiplayer Infrastructure Ready
Complete setup guide for 15,000+ concurrent players!

See `DEPLOYMENT_GUIDE.md` for:
- Game server implementation
- Database setup (PostgreSQL)
- Session management (Redis)
- Load balancing (NGINX)
- Performance monitoring (Prometheus + Grafana)
- Stress testing with k6

### Updated Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Local development (localhost only) |
| `npm run dev:network` | Development with network access |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run preview:network` | Preview with network access |
| `npm run serve:wifi` | Serve on local WiFi network |

## 🚀 Deployment Methods

### 1. Local Development
```bash
npm install
npm run dev
# Access at http://localhost:5173
```

### 2. Local WiFi (Same Network)
```bash
npm install
npm run serve:wifi
# Access from any device on your WiFi
# URL shown in console (e.g., http://192.168.1.100:8080)
```

### 3. Production Hosting
```bash
# Static hosting (Netlify, Vercel, GitHub Pages)
npm run build
# Deploy dist/ folder

# Or use Docker
docker-compose up -d
```

### 4. Multiplayer Server
```bash
# Full infrastructure with Docker
docker-compose up -d

# Includes:
# - Game servers (Node.js)
# - Database (PostgreSQL)
# - Cache (Redis)
# - Load balancer (NGINX)
# - Monitoring (Prometheus + Grafana)
```

## 📊 Features

### Single-Player (Current)
✅ 6 playable character classes
✅ 18+ unique abilities
✅ 6 monster types
✅ 17+ items (weapons, armor, consumables)
✅ Advanced anime/fantasy UI
✅ Collapsible panels
✅ Professional branding with mascots
✅ External asset integration

### Multiplayer (Infrastructure Ready)
📋 Real-time player synchronization
📋 Chat system
📋 PvP combat
📋 Leaderboards
📋 Guilds/parties
📋 Trading between players
📋 Shared world instances

## 🔧 Configuration

### Vite Config (vite.config.js)
```javascript
export default defineConfig({
  server: {
    host: '0.0.0.0', // Listen on all network interfaces
    port: 5173,
    strictPort: false,
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
  }
});
```

### Firewall Setup

**Windows:**
```powershell
New-NetFirewallRule -DisplayName "Dynasty Game" -Direction Inbound -LocalPort 5173,8080 -Protocol TCP -Action Allow
```

**macOS:**
System Preferences → Security & Privacy → Firewall → Allow

**Linux:**
```bash
sudo ufw allow 5173/tcp
sudo ufw allow 8080/tcp
```

## 📚 Documentation

- **DEPLOYMENT_GUIDE.md** - Complete deployment & multiplayer guide
- **README.md** - This file
- **docs/** - Detailed technical documentation

## 🎮 Gameplay

### Controls
- **WASD** - Movement
- **Mouse** - Camera rotation
- **Q, E, R, F** - Abilities
- **I** - Inventory
- **C** - Character
- **M** - Map
- **ESC** - Settings/Menu

### Character Classes
1. **Warrior** - High HP, melee combat
2. **Mage** - Elemental magic, high MP
3. **Rogue** - Stealth, critical hits
4. **Paladin** - Holy magic, tanking (unlock at level 5)
5. **Ranger** - Ranged attacks, traps (unlock at level 3)
6. **Necromancer** - Dark magic, summons (unlock at level 10)

## 🐛 Troubleshooting

### Can't access from other devices
1. Check firewall settings
2. Verify server is running with `host: '0.0.0.0'`
3. Ensure devices are on same WiFi network
4. Try accessing with IP address directly

### Port already in use
```bash
# Find process using port
lsof -i :5173
# Kill process
kill -9 <PID>
```

### Performance issues
- Build for production: `npm run build`
- Check browser console for errors
- Monitor network tab in DevTools
- Reduce graphics quality in settings

## 🔐 Security

For production deployment:
- Use HTTPS/WSS
- Implement authentication
- Rate limit API endpoints
- Validate all user inputs
- Keep dependencies updated
- Use environment variables for secrets

## 📈 Performance

### Current Stats (Single-Player)
- Initial load: ~2-3 seconds
- FPS: 60 (capped)
- Memory: ~200-300MB
- Bundle size: ~1.6MB (gzipped: ~430KB)

### Multiplayer Targets (15,000 players)
- Connection time: p95 < 500ms
- Message latency: p95 < 100ms
- Server CPU: < 80%
- Server RAM: < 16GB per instance

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

MIT License - See LICENSE file for details

## 🎉 Credits

### External Assets
- **Characters**: Mixamo (free rigged models)
- **Monsters**: Quaternius, Sketchfab (CC0)
- **Weapons/Armor**: Sketchfab Free
- **Textures**: Poly Haven (PBR materials)
- **Icons**: Kenney Assets, Custom SVG

### Technologies
- **Engine**: Three.js (3D), Cannon.js (Physics)
- **Build**: Vite 5
- **Server**: Node.js, Express, Socket.IO
- **Database**: PostgreSQL, Redis
- **Monitoring**: Prometheus, Grafana

## 🚀 Roadmap

### v2.3.0 (Next)
- [ ] Multiplayer server launch
- [ ] Player authentication
- [ ] Real-time combat
- [ ] Chat system

### v3.0.0 (Future)
- [ ] Mobile support
- [ ] Voice chat
- [ ] Custom shaders
- [ ] Advanced AI

---

**Made with ❤️ by MrNova420**

🌐 [GitHub](https://github.com/MrNova420/web-game-dev) | 🎮 [Play Now](https://mrnova420.github.io/web-game-dev)
