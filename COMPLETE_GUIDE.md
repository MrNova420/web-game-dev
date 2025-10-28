# Dynasty of Emberveil - Complete Guide

## Table of Contents
1. [Game Overview](#game-overview)
2. [Quick Start](#quick-start)
3. [Installation & Setup](#installation--setup)
4. [Gameplay Guide](#gameplay-guide)
5. [Systems & Features](#systems--features)
6. [Controls](#controls)
7. [Tips & Strategies](#tips--strategies)

---

## Game Overview

**Dynasty of Emberveil** is a feature-rich fantasy magic RPG browser game with:
- **83+ major systems** providing deep gameplay
- **60,664+ lines** of production-ready code
- **Infinite progression** with endless content
- **10 elemental magic schools** with 50+ spells each
- **8 seductive anime-inspired boss characters**
- **Infinite power scaling** (F rank → OMEGA rank)
- **Endless battle loops** with escalating difficulty
- **Full auto-save system** (never lose progress)

### Game Theme
- **Primary**: Fantasy magic RPG with anime influences
- **Combat**: Strategic action with combos, reactions, and positioning
- **Progression**: Infinite scaling with prestige and evolution systems
- **Social**: Guilds, clans, PvP, raids, and marketplace

---

## Quick Start

### Option 1: Local Development Server (Recommended)
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Game will open at http://localhost:5173
```

### Option 2: Quick Play Server
```bash
# Simple HTTP server (no build needed)
npm run serve

# Game opens at http://localhost:3000
```

### Option 3: Production Build
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Installation & Setup

### Prerequisites
- **Node.js** v16+ (recommended v18+)
- **npm** v7+ or **yarn** v1.22+
- Modern web browser (Chrome, Firefox, Edge, Safari)

### Step-by-Step Installation

1. **Clone Repository**
   ```bash
   git clone https://github.com/MrNova420/web-game-dev.git
   cd web-game-dev
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start Development**
   ```bash
   npm run dev
   ```

4. **Open Browser**
   - Navigate to `http://localhost:5173`
   - Game loads automatically

### System Requirements

**Minimum**:
- CPU: Dual-core 2.0 GHz
- RAM: 4 GB
- GPU: Integrated graphics
- Browser: Chrome 90+, Firefox 88+, Safari 14+

**Recommended**:
- CPU: Quad-core 3.0 GHz
- RAM: 8 GB
- GPU: Dedicated graphics (any)
- Browser: Latest Chrome/Firefox/Edge

---

## Gameplay Guide

### Character Creation
1. Choose your starting **magic element** (Fire, Ice, Lightning, etc.)
2. Select initial **build preset** (Warrior, Mage, Assassin, Tank, Hybrid)
3. Customize appearance (50+ options)
4. Name your character

### Core Gameplay Loop
1. **Explore Dungeons** - Progress through 999+ floors
2. **Defeat Enemies** - Gain XP, loot, and materials
3. **Level Up** - Unlock spells and abilities
4. **Craft Equipment** - Use materials to create powerful gear
5. **Prestige** - Reset for permanent bonuses
6. **Repeat** - Endless progression!

### Progression Path

**Early Game (Levels 1-25)**:
- Learn basic combat mechanics
- Unlock first magic circle spells
- Complete tutorial quests
- Join a guild

**Mid Game (Levels 25-75)**:
- Master combos and reactions
- Defeat seductive bosses for affection
- Craft rare equipment
- Reach S rank power level

**Late Game (Levels 75-150)**:
- Prestige for permanent bonuses
- Challenge mythic+ dungeons
- Compete in PvP arena
- Collect legendary gear

**End Game (Levels 150+)**:
- Achieve Godhood evolution stage
- Reach OMEGA power rank
- Complete ultimate trials
- Join raid bosses (10-40 players)

---

## Systems & Features

### Combat Systems

#### Fantasy Magic (10 Elements)
- **Fire**: High damage, burn DOT
- **Ice**: Freeze enemies, slow effects
- **Lightning**: Fast attacks, chain damage
- **Water**: Healing, cleansing
- **Earth**: Defense, shields
- **Wind**: Speed, mobility
- **Nature**: Regeneration, summons
- **Light**: Holy damage, buffs
- **Dark**: Lifesteal, debuffs
- **Arcane**: Pure magic, versatile

#### Combo System
- **Elemental Fusion**: Combine 2 elements (3.0x damage)
- **Triple Strike**: 3 hits in 500ms (2.5x damage)
- **Magic Chain**: 4+ spells in sequence (4.0x damage)
- **Perfect Counter**: Parry → counter (3.0x damage)
- **Assassinate**: Backstab critical (5.0x damage)

#### Reaction System (Genshin Impact-style)
- **Overload**: Fire + Lightning → AOE explosion
- **Freeze**: Water + Ice → Freeze enemy (2s)
- **Vaporize**: Fire + Water → 2.0x damage
- **Electro-Charged**: Water + Lightning → Chain damage
- **Melt**: Fire + Ice → 2.5x damage
- **Superconduct**: Ice + Lightning → -50% defense
- **Swirl**: Wind + any → Spread element AOE
- **Crystallize**: Earth + any → Shield

#### Momentum System
- **0-24**: Normal state (1.0x)
- **25-49**: Focused (1.1x attack speed, +5% crit)
- **50-74**: Empowered (1.25x damage, +10% crit)
- **75-99**: Unstoppable (1.4x all stats, +15% crit)
- **100**: Godmode (1.5x attack speed, 1.5x damage, +25% crit, 3s invulnerable)

#### Positioning Bonuses
- **Flanking**: 1.25x damage, +15% crit
- **Backstab**: 1.5x damage, +30% crit, guaranteed crit
- **High Ground**: 1.15x damage, +10% accuracy
- **Cover**: 1.3x defense, +20% evasion

### Progression Systems

#### Power Ranking (14 Tiers)
1. **F Rank** (0-999): Novice
2. **E Rank** (1k-4.9k): Beginner
3. **D Rank** (5k-9.9k): Intermediate
4. **C Rank** (10k-24.9k): Advanced
5. **B Rank** (25k-49.9k): Expert
6. **A Rank** (50k-99.9k): Master
7. **S Rank** (100k-249k): Elite
8. **SS Rank** (250k-499k): Champion
9. **SSS Rank** (500k-999k): Legend
10. **EX Rank** (1M-2.49M): Mythic
11. **Z Rank** (2.5M-4.99M): Transcendent
12. **ZZ Rank** (5M-9.99M): Divine
13. **ZZZ Rank** (10M+): Supreme
14. **OMEGA Rank**: Supreme Being (no cap)

#### Evolution Stages (6 Stages)
1. **Mortal** (10k cap): 1x stats
2. **Awakened** (50k cap): 2x stats, 1.5x skills
3. **Ascended** (250k cap): 4x stats, 2x skills
4. **Transcendent** (1M cap): 8x stats, 3x skills
5. **Divine** (5M cap): 16x stats, 5x skills
6. **Godhood** (Infinite): 32x stats, 10x skills

#### Prestige System
- **Requirement**: Level 100 + S Rank minimum
- **Rewards**: +0.5x multiplier permanent, +10% per prestige tier
- **Keep**: 10% of previous power
- **Unlock**: Prestige-exclusive abilities
- **Reset**: Level, equipment, but keep masteries

### Crafting & Economy

#### Materials (17 Types)
- **Common**: Iron Ore, Wood, Leather
- **Uncommon**: Steel, Hardwood, Quality Leather
- **Rare**: Mithril, Ironwood, Dragon Leather
- **Epic**: Adamantium, Eldertree Wood, Phoenix Leather
- **Legendary**: Celestial Ore, World Tree Wood, Divine Leather
- **Mythic**: Cosmic Essence, Infinity Fragments

#### Crafting Stations (5 Types)
- **Forge**: Weapons, armor (Level 1-10)
- **Alchemy**: Potions, consumables (Level 1-10)
- **Arcane Table**: Magic items, enchantments (Level 1-10)
- **Jeweler**: Gems, accessories (Level 1-10)
- **Enchanter**: Enchantments, upgrades (Level 1-10)

#### Enhancement System
- **Enhancement**: +1 to +15 (10% stats per level)
- **Success Rates**: 100% (+1) → 15% (+15)
- **Sockets**: Up to 3 per item
- **Gems**: 9 types (Ruby, Sapphire, Diamond, etc.)
- **Reforging**: ±20% stat variation
- **Fusion**: Combine 2 items → 1 upgraded
- **Transmog**: Change appearance cosmetically

#### Currency (3 Types)
- **Gold**: General purchases, repairs
- **Gems**: Premium items, shortcuts
- **Tokens**: Challenge rewards, exclusive items

### Social Features

#### Guilds ("Smoke Circles")
- **Capacity**: 50 members
- **Ranks**: 5 (Seedling → Founder)
- **Guild Bank**: Shared gold, materials, items
- **Perks**: XP boost, loot boost, crafting speed, storage, discounts
- **Quests**: 4 types (Harvest, Extermination, Exploration, Crafting)

#### Clan Wars
- **Modes**: 5v5, 10v10, 20v20
- **Types**: Capture the Flag, King of the Hill, Team Deathmatch
- **Territory**: 20 territories with bonuses
- **Seasons**: Monthly with rewards

#### Player Housing ("The Crib")
- **Tiers**: 5 (Studio → Palace)
- **Rooms**: 8 types (Living, Grow, Workshop, Trophy, Storage, Kitchen, Garage, Vault)
- **Furniture**: 100+ items
- **Functions**: Fast travel, crafting, storage, display

#### Marketplace
- **Trading**: Player-to-player direct trades
- **Auction House**: Timed auctions (1h-7d)
- **Price History**: Track market trends
- **Tax**: 5% (2% for premium)

### Boss Characters (8 Seductive Bosses)

1. **Crimson Empress Scarlet** (Level 50, Fire)
   - Dominant flame enchantress
   - Abilities: Crimson Dance, Empress Authority, Flame Temptation
   - Reward: Battle dress, fire familiar, ultimate fire skill

2. **Frost Queen Elsa** (Level 55, Ice)
   - Cool ice princess
   - Abilities: Frozen Heart, Absolute Zero Kiss, Ice Queen's Blessing
   - Special: Ice Palace Romance at 500 affection

3. **Shadow Assassin Yuki** (Level 60, Dark)
   - Mysterious deadly beauty
   - Abilities: Shadow Strike, Deadly Dance, Assassination Attempt
   - Reward: Shadow outfit, void step skill, moonlight meeting

4. **Lightning Valkyrie Freya** (Level 65, Lightning)
   - Proud thunder goddess
   - Abilities: Valkyrie Strike, Thunder Judgement, Divine Spark
   - Reward: Valkyrie armor, thunder hawk, god's judgement skill

5. **Nature Dryad Sylvia** (Level 52, Nature)
   - Ethereal forest enchantress
   - Abilities: Forest Embrace, Nature's Wrath, Life Drain Kiss
   - Reward: Dryad outfit, forest spirit, world tree power

6. **Celestial Maiden Aurora** (Level 70, Light)
   - Divine starlight princess
   - Abilities: Starlight Caress, Celestial Judgement, Divine Protection
   - Special: Starlit Confession

7. **Demon Queen Lilith** (Level 75, Dark)
   - Seductive temptress
   - Abilities: Demonic Seduction, Hell's Embrace, Queen's Command
   - Special: Throne Room Submission

8. **Dragon Empress Tiamat** (Level 100, Arcane)
   - Five-headed ultimate boss
   - Abilities: Five Element Breath, Dragon's Majesty, Empress Transformation
   - Special: Dragon's Lair Ceremony
   - HP: 100,000 | Extreme difficulty

**Affection System**:
- Gain 5-20 points per defeat (based on performance)
- Rewards at 50, 100, 200, 500 affection
- Unlock cosmetics, pets, skills, special scenes

### Mini-Games

1. **Cannabis Cultivation** - Grow and breed strains
2. **Smoke Session** - Rhythm game with combos
3. **Alchemy Brewing** - Craft potions and edibles
4. **Casino Games** - Blackjack, Slots, Poker, Dice
5. **Puzzle Challenges** - Pattern, Memory, Logic, Word, Maze

### Endless Content

#### Infinite Dungeon
- **Floors**: 1-999+ (then true infinite)
- **Bosses**: Every 5 floors
- **Super Bosses**: Every 25 floors
- **Checkpoints**: Every 10 floors
- **Modifiers**: Stack every 10 floors (max 5)
- **Events**: 8 random types (2-10% spawn chance)

#### Endless Battle Waves
- **Difficulty**: 8 levels (Easy → Nightmare)
- **Waves**: Infinite progression
- **Kill Streaks**:
  - 10: Double Damage
  - 25: Triple Gold
  - 50: Quad XP
  - 100: Guaranteed Legendary
  - 250: God Mode (30s)
  - 500: Guaranteed Mythic
  - 1000: Ultimate Power Boost (10x all)

---

## Controls

### Keyboard (Default)
- **WASD** / **Arrow Keys**: Movement
- **Space**: Jump / Dodge
- **1-5**: Quick spell slots
- **Q/E**: Cycle targets
- **R**: Use item
- **F**: Interact
- **Tab**: Toggle menu
- **Esc**: Pause
- **Shift**: Sprint
- **Ctrl**: Crouch

### Mouse
- **Left Click**: Basic attack
- **Right Click**: Block / Aim
- **Middle Click**: Lock target
- **Scroll**: Zoom camera

### Gamepad Support
- Full gamepad mapping available
- Customize in Settings > Controls

### Touch (Mobile)
- **Virtual Joystick**: Movement
- **Tap**: Basic attack
- **Swipe**: Dodge / Dash
- **Pinch**: Zoom
- **Button Array**: Skills and items

---

## Tips & Strategies

### Early Game Tips
1. **Complete Tutorial**: Learn all mechanics
2. **Join Guild Early**: Get XP bonuses
3. **Focus One Element**: Master before branching
4. **Save Materials**: Don't sell rare materials
5. **Learn Combos**: Practice in training area

### Combat Strategies
1. **Use Reactions**: 2x-2.5x damage boost
2. **Position Wisely**: Backstab for guaranteed crits
3. **Build Momentum**: Reach 100 for Godmode
4. **Parry Timing**: Perfect parry = 3x damage
5. **Combo Chain**: 4+ spells for 4x damage

### Progression Optimization
1. **Prestige at S Rank**: Maximize bonuses
2. **Complete Masteries**: Permanent stat boosts
3. **Defeat All Bosses**: Unlock affection rewards
4. **Join Raids**: Best loot in game
5. **PvP for Honor**: Exclusive gear

### Resource Management
1. **Auto-Save Active**: Progress never lost
2. **Backup Saves**: Export regularly
3. **Sell Commons**: Keep rare+ materials
4. **Enhance to +10**: Good balance of success/cost
5. **Socket Wisely**: Gems are expensive to remove

### End Game Goals
1. **Reach Godhood**: 32x stats, infinite power
2. **OMEGA Rank**: Ultimate power tier
3. **Complete Collections**: All pets, mounts, cosmetics
4. **Master All Elements**: 10 magic schools
5. **Pantheon of Champions**: Hall of fame

---

## Additional Resources

- **DEPLOYMENT_GUIDE.md**: Production deployment instructions
- **TECHNICAL_REFERENCE.md**: System architecture details
- **API_DOCUMENTATION.md**: Complete API reference
- **SYSTEM_VALIDATION.md**: Quality assurance report

---

## Support & Community

- **Report Bugs**: Use GitHub Issues
- **Suggestions**: Submit feature requests
- **Discord**: Join community (link TBD)
- **Wiki**: Community-maintained guide (link TBD)

---

**Version**: 1.0.0  
**Last Updated**: 2025-10-28  
**Total Lines**: 60,664  
**Systems**: 83+  
**Status**: Production Ready ✅
