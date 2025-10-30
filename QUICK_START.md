# Quick Start Guide - Dynasty of Emberveil

## 🚀 NEW: Auto-Installer (Recommended!)

### The Easiest Way to Play:

**Mac/Linux:**
```bash
./auto-install-and-play.sh
```

**Windows:**
```cmd
auto-install-and-play.bat
```

**What it does:**
- ✅ Checks system requirements
- ✅ Installs dependencies automatically
- ✅ Builds the game
- ✅ Starts the server
- ✅ Opens in your browser

**Time:** ~2 minutes (first time only)

---

## Fastest Way to Play (3 Manual Options)

### ⚡ Option 1: Quick Play (No Build) - FASTEST!
```bash
# One command to install and play
npm install && npm run serve
```
**Opens at**: `http://localhost:3000`  
**Time**: ~30 seconds  
**Best for**: Quick testing, instant play

---

### 🔥 Option 2: Development Mode (Hot Reload)
```bash
# Install dependencies (first time only)
npm install

# Start development server with hot reload
npm run dev
```
**Opens at**: `http://localhost:5173`  
**Time**: ~45 seconds  
**Best for**: Development, making changes  
**Features**: Auto-refresh on code changes

---

### 🚀 Option 3: Production Build (Optimized)
```bash
# Install and build
npm install
npm run build

# Serve production build
npm run serve:prod
```
**Opens at**: `http://localhost:8000`  
**Time**: ~2 minutes  
**Best for**: Testing production performance  
**Features**: Minified, optimized, fast loading

---

## Command Reference

| Command | Description | Port | Mode |
|---------|-------------|------|------|
| `npm run serve` | Quick play server | 3000 | Dev |
| `npm run dev` | Development w/ hot reload | 5173 | Dev |
| `npm run build` | Build for production | - | - |
| `npm run serve:prod` | Serve production build | 8000 | Prod |
| `npm run preview` | Vite preview server | 4173 | Prod |

### Custom Ports
```bash
# Serve on custom port
node serve.js 8080 dev

# Vite dev on custom port
npx vite --port 3000
```

---

## Requirements

- **Node.js**: v16+ (v18+ recommended)
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **RAM**: 4 GB minimum (8 GB recommended)
- **Storage**: ~100 MB

### Check Node Version
```bash
node --version  # Should be v16+ or higher
npm --version   # Should be v7+ or higher
```

### Install Node.js (if needed)
- Download from: https://nodejs.org/
- Install LTS version (recommended)
- Restart terminal after installation

---

## First Time Setup

### 1. Clone or Download
```bash
# Using Git
git clone https://github.com/MrNova420/web-game-dev.git
cd web-game-dev

# Or download ZIP and extract
```

### 2. Install Dependencies
```bash
npm install
```

This installs:
- `vite` - Build tool and dev server
- `three` - 3D graphics library
- `cannon-es` - Physics engine

### 3. Start Playing!
```bash
# Quick play
npm run serve

# Or dev mode
npm run dev
```

---

## Troubleshooting

### Port Already in Use
```bash
# Try different port
node serve.js 8080 dev

# Or find and kill process
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

### Build Fails
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install

# Or use yarn
yarn install
```

### Game Won't Load
1. Check browser console (F12) for errors
2. Clear browser cache (Ctrl+Shift+Delete)
3. Try different browser
4. Ensure port 3000/5173/8000 isn't blocked by firewall

### Low Performance
1. Close other tabs/apps
2. Try production build (`npm run build` then `npm run serve:prod`)
3. Lower graphics settings in game
4. Use Battery Saver mode

---

## Playing the Game

### Controls
- **WASD**: Move
- **Space**: Jump/Dodge
- **1-5**: Cast spells
- **Mouse**: Aim/Attack
- **Tab**: Menu
- **Esc**: Pause

### Getting Started
1. **Create character** (choose magic element)
2. **Complete tutorial** (learn mechanics)
3. **Explore dungeons** (defeat enemies)
4. **Craft equipment** (use materials)
5. **Level up** (unlock abilities)
6. **Join guild** (social features)

### Tips
- Save often (auto-saves every 30s)
- Learn combo attacks (higher damage)
- Complete daily challenges (rewards)
- Defeat bosses for rare loot
- Join a guild early (XP bonus)

---

## Development

### File Structure
```
web-game-dev/
├── src/
│   ├── core/         # Game engine
│   ├── systems/      # Game systems (83+)
│   ├── entities/     # Player, enemies, NPCs
│   └── main.js       # Entry point
├── index.html        # Main HTML
├── package.json      # NPM config
├── vite.config.js    # Vite config
└── serve.js          # Simple HTTP server
```

### Making Changes
1. Edit files in `src/`
2. Save (auto-reload in dev mode)
3. Test in browser
4. Build for production when done

### Building
```bash
# Development build (fast, not optimized)
npm run dev

# Production build (slow, optimized)
npm run build

# Output in dist/ folder
```

---

## Deployment

See **DEPLOYMENT_COMPLETE.md** for full deployment guide including:
- Static hosting (Netlify, Vercel, GitHub Pages)
- VPS deployment (DigitalOcean, AWS)
- Docker containerization
- CDN setup
- Domain configuration

---

## Documentation

| File | Description |
|------|-------------|
| **README.md** | Project overview |
| **COMPLETE_GUIDE.md** | Full gameplay guide |
| **QUICK_START.md** | This file |
| **DEPLOYMENT_COMPLETE.md** | Deployment instructions |
| **TECHNICAL_REFERENCE.md** | Technical documentation |
| **SYSTEM_VALIDATION.md** | Quality assurance report |

---

## Support

- **Bugs**: Report on GitHub Issues
- **Questions**: Check documentation first
- **Feedback**: Submit feature requests

---

## License

MIT License - See LICENSE file

---

**Version**: 1.0.0  
**Last Updated**: 2025-10-28  
**Total Lines**: 60,664  
**Systems**: 83+  
**Status**: Production Ready ✅

---

# 🎮 Enjoy Dynasty of Emberveil! 🎮
