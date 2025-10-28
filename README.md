# Dynasty of Emberveil

A browser-based 2D/2.5D/3D psychedelic fantasy action RPG inspired by classic dungeon crawlers, built with modern web technologies.

## 🎮 Game Overview

**Dynasty of Emberveil** is a free-to-play web game set in a twilight kingdom where reality dissolves into overlapping "Vibespheres" - realms shaped by emotion, color, and intoxication. Players become **Wielders**, diving into procedurally generated dungeons to harvest **Essence** and battle corrupted creatures.

### Features

- **Browser-Based**: No installation required - play instantly in your browser
- **3D Graphics**: Powered by Three.js with psychedelic visual effects
- **Companion System**: Recruit and fight alongside unique companions:
  - �� **Smoke Siren** - Charm-based sorceress
  - ⚔️ **Blade Muse** - Acrobatic rhythm fighter
  - 🌿 **Herb Witch** - Alchemist healer
  - ⚡ **Cyber Dryad** - Tech-nature fusion mage
- **Procedural Dungeons**: Five unique biomes with different challenges:
  - Crystal Caverns
  - Fungal City
  - Vine Cathedral
  - Broken Starship
  - Twilight Throne
- **Smoke Magic**: Unique particle-based magic system
- **Real-time Combat**: Action-oriented gameplay with abilities and combos

## 🚀 Quick Start - Local Hosting

### Play Locally (Recommended)

This game runs entirely in your browser with **no backend server required**. Perfect for local/offline play!

**Prerequisites:**
- Node.js 16+ installed
- Modern web browser (Chrome, Firefox, Edge, Safari)

**Installation:**

```bash
# Clone the repository
git clone https://github.com/MrNova420/web-game-dev.git
cd web-game-dev

# Install dependencies
npm install

# Start local development server
npm run dev
```

The game will open at `http://localhost:3000` - fully playable with auto-save to localStorage!

**Production Build (for hosting/distribution):**

```bash
# Build optimized version
npm run build

# Preview production build
npm run preview
```

The `dist/` folder contains the complete game ready to deploy anywhere.

### Controls

- **WASD** or **Arrow Keys**: Move character
- **Mouse**: Look around / Aim
- **Left Click**: Basic attack
- **Q**: Smoke Blast (AOE damage)
- **W**: Shadow Step (Teleport)
- **E**: Essence Drain (Damage + Heal)
- **R**: Companion Ability

## 🎨 Game Design

### Theme & Aesthetics

The game features a **psychedelic fantasy** aesthetic with:
- Purple and twilight color schemes
- Bioluminescent environments
- Smoke and particle effects
- Toon-shader style graphics

### Progression System

- Level up by defeating enemies and completing dungeons
- Unlock new companions through gameplay
- Acquire and upgrade equipment
- Master different magic abilities

### Monetization (Friendly F2P)

- **Free-to-play** with optional accounts
- **Cosmetics only**: No pay-to-win mechanics
- Seasonal "Dream Passes" with new content
- Collectible herbs for in-game buffs (non-monetized)

## 🛠️ Technology Stack

- **Frontend**: Three.js for 3D rendering, Vite for bundling
- **Physics**: Cannon-ES for physics simulation
- **Architecture**: Modular ES6 classes
- **Styling**: Custom CSS with gradient effects

## 📂 Project Structure

```
web-game-dev/
├── src/
│   ├── core/           # Core engine systems
│   │   ├── GameEngine.js
│   │   ├── AssetLoader.js
│   │   └── InputManager.js
│   ├── entities/       # Game entities
│   │   └── Player.js
│   ├── systems/        # Game systems
│   │   ├── CompanionManager.js
│   │   ├── CombatSystem.js
│   │   └── ParticleSystem.js
│   ├── worlds/         # World generation
│   │   └── DungeonGenerator.js
│   └── main.js         # Entry point
├── index.html          # Main HTML file
├── vite.config.js      # Vite configuration
└── package.json        # Dependencies
```

## 🎯 Development Roadmap

- [x] Core game engine with Three.js
- [x] Player character system
- [x] Companion system (4 unique companions)
- [x] Procedural dungeon generation
- [x] Combat system with abilities
- [x] Particle effects for magic
- [x] UI/HUD system
- [ ] Enemy AI and behavior
- [ ] More enemy types and bosses
- [ ] Inventory and equipment system
- [ ] Save/Load functionality
- [ ] Multiplayer co-op (Socket.io)
- [ ] Audio system (music + SFX)
- [ ] Quest and lore system
- [ ] Advanced procedural generation
- [ ] Mobile touch controls
- [ ] Performance optimizations

## 🎮 Gameplay Tips

1. **Use Cover**: Dungeon decorations can block enemy attacks
2. **Manage Resources**: Balance HP, MP, and ability cooldowns
3. **Companion Synergy**: Each companion excels in different situations
4. **Explore Thoroughly**: Hidden areas may contain powerful items
5. **Master Abilities**: Learn ability combos for maximum effectiveness

## 🤝 Contributing

This is a demonstration project built for educational purposes. Feel free to fork and create your own version!

## 📜 License

MIT License - Feel free to use this code for your own projects

## 🌟 Credits

- Inspired by Goblin Slayer: Endless Hunting (G123)
- Game concept and design based on Dynasty of Emberveil lore
- Built with Three.js, Vite, and modern web technologies

---

**Play now and dive into the Dynasty of Emberveil!** 🎮✨
