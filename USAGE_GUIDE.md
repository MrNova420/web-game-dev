# Dynasty of Emberveil - Complete Usage Guide

## Table of Contents
1. [Quick Start](#quick-start)
2. [Game Controls](#game-controls)
3. [Core Gameplay Systems](#core-gameplay-systems)
4. [Advanced Features](#advanced-features)
5. [Tips & Strategies](#tips--strategies)
6. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Running Locally (Fastest Method)
```bash
# Install dependencies (first time only)
npm install

# Start local development server
npm run dev

# Game will be available at http://localhost:5173
```

### Alternative: Quick Python Server
```bash
# Build the game first
npm run build

# Serve from dist folder
cd dist
python -m http.server 8000

# Open http://localhost:8000 in your browser
```

### Playing the Game
1. Open your browser to the local server URL
2. Click "Start Game" on the main menu
3. Create your character
4. Begin your adventure in the Smoke Forest!

---

## Game Controls

### Basic Controls
- **WASD** or **Arrow Keys**: Move character
- **Spacebar**: Jump
- **Shift**: Sprint
- **Mouse**: Look around (when enabled)
- **Left Click**: Primary attack
- **Right Click**: Secondary attack/Block
- **E**: Interact with objects/NPCs
- **ESC**: Pause menu

### Combat Controls
- **1-9**: Use ability/spell in hotbar
- **Q**: Toggle target lock
- **R**: Reload/Charge ability
- **F**: Dodge roll
- **V**: Parry (timing-based)
- **C**: Use consumable item
- **Tab**: Cycle targets

### Menu Controls
- **I**: Open inventory
- **K**: Open skill tree
- **M**: Open map
- **L**: Open quest log
- **P**: Open character stats
- **G**: Open guild menu
- **H**: Open player housing

### Advanced Combat
- **Ctrl + 1-9**: Quick cast spells
- **Alt + Click**: AoE targeting
- **Shift + Click**: Force attack
- **Z**: Previous weapon set
- **X**: Next weapon set

---

## Core Gameplay Systems

### 1. Character Progression

#### Leveling System
- Gain XP from defeating enemies, completing quests, discovering locations
- Level cap: 300 (base), infinite with prestige
- Each level grants: +5 stat points, +1 skill point
- Level milestones unlock new features (10, 25, 50, 75, 100, etc.)

#### Power Ranking System
- **14 Power Ranks**: F → E → D → C → B → A → S → SS → SSS → EX → Z → ZZ → ZZZ → OMEGA
- Power calculated from: Base stats + Equipment + Skills + Masteries
- Rank unlocks: Special abilities, titles, cosmetics, areas
- Displayed on leaderboards

#### Prestige System
- **Requirements**: Level 100 + S Rank minimum
- **Benefits**: +0.5x permanent multiplier per prestige, unique skills, exclusive zones
- **Keep**: 10% of power, all unlocks, all cosmetics
- **Reset**: Level to 1, basic equipment
- **Max Prestige**: 100 levels

#### Evolution Stages
1. **Mortal** (0-10k power): 1x stats
2. **Awakened** (10k-50k): 2x stats, 1.5x skills
3. **Ascended** (50k-250k): 4x stats, 2x skills
4. **Transcendent** (250k-1M): 8x stats, 3x skills
5. **Divine** (1M-5M): 16x stats, 5x skills
6. **Godhood** (5M+): 32x stats, 10x skills, infinite cap

### 2. Magic System

#### Elemental Schools (10 Types)
1. **Fire**: High damage, burn DoT
2. **Ice**: Crowd control, freeze
3. **Lightning**: Fast casts, chain damage
4. **Water**: Healing, shields
5. **Earth**: Defense, stuns
6. **Wind**: Speed, mobility
7. **Nature**: Healing, buffs
8. **Light**: Support, cleansing
9. **Dark**: Debuffs, lifesteal
10. **Arcane**: Versatile, mana manipulation

#### Magic Circles (9 Progression Levels)
- **Circle 1** (Lv 1): Novice Mage - 5 spells, +100 mana
- **Circle 2** (Lv 10): Apprentice - 10 spells, +250 mana
- **Circle 3** (Lv 25): Adept - 20 spells, +500 mana
- **Circle 4** (Lv 50): Master - 35 spells, +1000 mana
- **Circle 5** (Lv 75): Archmage - 50 spells, +2000 mana
- **Circle 6** (Lv 100): Grand Archmage - 70 spells, +4000 mana
- **Circle 7** (Lv 150): Sage - 100 spells, +8000 mana
- **Circle 8** (Lv 200): Transcendent Sage - 150 spells, +16000 mana
- **Circle 9** (Lv 300): Magic God - 200 spells, +32000 mana

#### Elemental Reactions
- **Overload** (Fire + Lightning): 2.0x damage, knockback
- **Freeze** (Ice + Water): Freeze enemy for 3 seconds
- **Vaporize** (Fire + Water): 2.5x damage
- **Electro-Charged** (Lightning + Water): Chain damage to nearby enemies
- **Melt** (Fire + Ice): 2.0x damage, remove freeze
- **Superconduct** (Ice + Lightning): 1.8x damage, -50% defense
- **Swirl** (Wind + any element): Spread element to area
- **Crystallize** (Earth + any element): Generate shield

### 3. Combat Mechanics

#### Combo System
- **Elemental Fusion**: Use 3 different elements in sequence (5.0x damage)
- **Triple Strike**: Land 3 hits within 500ms (2.5x damage)
- **Magic Chain**: Cast 5 spells in 3 seconds (3.0x damage)
- **Perfect Counter**: Counter within 200ms of enemy attack (4.0x damage)
- **Assassinate**: Backstab critical hit combo (3.5x damage)

#### Momentum System
- Gauge fills from: Kills, crits, combos, dodges, perfect blocks
- **0-25**: Focused - +10% damage
- **26-50**: Flowing - +20% damage, +10% attack speed
- **51-75**: Blazing - +35% damage, +20% attack speed, +15% crit
- **76-100**: Godmode - +50% damage, +50% attack speed, +25% crit, 3s invulnerability

#### Stagger/Break System
- Build stagger gauge by attacking enemies
- When full: Enemy staggers for 5 seconds
- Staggered: 2.0x damage, +50% vulnerability
- Boss enemies require more stagger damage

#### Positioning Bonuses
- **Backstab**: 1.5x damage, +30% crit, guaranteed crit
- **Flanking**: 1.25x damage, +15% crit
- **High Ground**: 1.15x damage, +10% accuracy, +2 range
- **Cover**: 1.3x defense, +20% evasion
- **Formation**: 1.2x defense, 1.15x team bonus

### 4. Seductive Bosses

#### 8 Anime-Inspired Boss Characters

**1. Crimson Empress Scarlet** (Lv 50, Fire)
- Location: Infernal Throne Room (Floor 50)
- Abilities: Crimson Dance, Empress Authority, Flame Temptation, Scarlet Apocalypse
- Affection Rewards: Battle Dress cosmetic, Flame Familiar pet, Crimson Fire ultimate skill

**2. Frost Queen Elsa** (Lv 55, Ice)
- Location: Frozen Palace (Floor 55)
- Abilities: Frozen Heart, Absolute Zero Kiss, Ice Queen's Blessing, Eternal Winter Storm
- Special Scene at 500 Affection: Ice Palace Romance
- Rewards: Ice Crown, Frost Phoenix mount, Glacial Prison skill

**3. Shadow Assassin Yuki** (Lv 60, Dark)
- Location: Shadow Realm (Floor 60)
- Abilities: Shadow Strike, Deadly Dance, Assassination Attempt, Dance of Death
- Rewards: Shadow Outfit, Void Step skill, Moonlight Meeting scene

**4. Lightning Valkyrie Freya** (Lv 65, Lightning)
- Location: Thunderdome Arena (Floor 65)
- Abilities: Valkyrie Strike, Thunder Judgement, Divine Spark, Ragnarok Thunder
- Rewards: Valkyrie Armor, Thunder Hawk pet, God's Judgement skill

**5. Nature Dryad Sylvia** (Lv 52, Nature)
- Location: Ancient Forest Heart (Floor 52)
- Abilities: Forest Embrace, Nature's Wrath, Life Drain Kiss, Gaia's Judgement
- Rewards: Dryad Outfit, Forest Spirit companion, World Tree Power

**6. Celestial Maiden Aurora** (Lv 70, Light)
- Location: Starlight Cathedral (Floor 70)
- Abilities: Starlight Caress, Celestial Judgement, Divine Protection, Genesis Star Fall
- Special Scene: Starlit Confession
- Rewards: Celestial Wings, Star Guardian pet, Holy Genesis skill

**7. Demon Queen Lilith** (Lv 75, Dark)
- Location: Demon Throne (Floor 75)
- Abilities: Demonic Seduction, Hell's Embrace, Queen's Command, Demon King's Bride
- Special Scene: Throne Room Submission
- Rewards: Demon Queen outfit, Succubus familiar, Demon Lord transformation

**8. Dragon Empress Tiamat** (Lv 100, Arcane)
- Location: Dragon's Lair (Floor 100)
- HP: 100,000 | Attack: 5,000 | Magic: 5,500
- Abilities: Five Element Breath, Dragon's Majesty, Empress Transformation, World Eater Dragon
- Special Scene: Dragon's Lair Ceremony
- Rewards: Dragon Empress Set, Five-Headed Dragon mount, Draconic Ascension ultimate

#### Affection System
- **Gain Affection**: Defeat bosses (5-20 points based on performance)
- **Affection Levels**: 50, 100, 200, 500 (unlock rewards)
- **Rewards**: Cosmetics, pets, skills, special romantic scenes
- **Track Progress**: Relationship menu shows defeats, affection level, unlocked rewards

### 5. Infinite Dungeon System

#### Floor Progression
- **Floors 1-999**: Structured progression
- **Floor 1000+**: True infinite mode
- **Boss Floors**: Every 5 floors
- **Super Bosses**: Every 25 floors
- **Checkpoints**: Every 10 floors

#### Floor Modifiers (13 Types)
**Buffs**:
- Double XP, Triple Gold, Super Loot, Speed Boost

**Challenges**:
- Dense Fog, Burning Floor, Frozen Ground, Swarm, Elite Enemies, Cursed, Chaos, Volatile, Mystery Box

**Stacking**: One new modifier every 10 floors (max 5 active)

#### Floor Events (8 Random Events)
- **Treasure Room** (5%): Massive loot explosion
- **Traveling Merchant** (8%): Rare items for sale
- **Puzzle Chamber** (3%): Solve for rewards
- **Safe Haven** (4%): Full heal + checkpoint
- **Champion Challenge** (6%): Mini-boss fight
- **Ancient Shrine** (2%): Permanent stat buff
- **Cursed Altar** (3%): Risk for legendary item
- **Dimensional Rift** (1%): Skip 5-10 floors

#### Difficulty Scaling
- Base: 3% increase per floor
- Milestone Bonus: +25% at each milestone (10, 25, 50, 75, 100, etc.)
- Challenge Modifiers: +20% per active modifier
- Affects: Enemy HP, Attack, Defense, XP, Gold

### 6. Endless Battle System

#### Difficulty Levels (8)
1. **Easy**: 0.5x enemies, 0.8x rewards
2. **Normal**: 1x baseline
3. **Hard**: 1.5x enemies, 1.3x rewards, 1.2x drops
4. **Expert**: 2x enemies, 1.8x rewards, 1.5x drops
5. **Master**: 3x enemies, 2.5x rewards, 2x drops
6. **Insane**: 5x enemies, 4x rewards, 3x drops
7. **Hell**: 10x enemies, 8x rewards, 5x drops
8. **Nightmare**: 20x enemies, 15x rewards, 10x drops

#### Wave System
- Boss waves: Every 10, 25, 50, 75, 100
- Scaling: 5% per wave, 10% per floor
- Max enemies per wave: 50
- Kill streak bonuses active

#### Kill Streak Bonuses
- **10 kills**: Double Damage (2x for 10s)
- **25 kills**: Triple Gold (3x for 30s)
- **50 kills**: Quad Experience (4x for 30s)
- **100 kills**: Guaranteed Legendary Drop
- **250 kills**: God Mode (30s invulnerability)
- **500 kills**: Guaranteed Mythic Weapon
- **1000 kills**: Ultimate Power Boost (10x all stats for 60s)

---

## Advanced Features

### Auto-Save System
- **Auto-saves**: Every 30 seconds
- **4-Layer Redundancy**: Primary + 3 backups + emergency recovery
- **Corruption Protection**: Checksum verification on all saves
- **Cloud Sync Ready**: Will sync to backend when available
- **Export/Import**: Save your progress to file
- **Never Lose Progress**: Multiple failsafes ensure data safety

### Performance Optimization
- **Adaptive Quality**: Automatically adjusts graphics based on FPS
- **Performance Modes**: Battery Saver (30 FPS), Balanced (60 FPS), Performance (144 FPS)
- **Object Pooling**: Efficient memory usage for particles and effects
- **Culling**: Only renders visible objects
- **LOD System**: Quality scales with distance

### Accessibility Features
- **Colorblind Modes**: Protanopia, Deuteranopia, Tritanopia
- **Screen Reader**: Full support for visually impaired
- **Remappable Controls**: Customize all keybindings
- **Difficulty Options**: Adjust game speed, damage, etc.
- **Subtitles**: Full text for all dialogue
- **High Contrast Mode**: For better visibility

---

## Tips & Strategies

### Early Game (Levels 1-25)
1. Focus on one elemental school initially
2. Complete tutorial quests for free equipment
3. Collect materials from every enemy
4. Join a guild early for XP bonuses
5. Save gems for premium shop items

### Mid Game (Levels 26-75)
1. Branch into 2-3 elemental schools for reactions
2. Farm boss affection for powerful rewards
3. Upgrade crafting stations to level 5+
4. Participate in daily challenges
5. Start building your perfect equipment set

### Late Game (Levels 76-100)
1. Master elemental reactions for maximum damage
2. Farm Mythic+ dungeons for best gear
3. Max out all masteries
4. Prepare for first prestige
5. Complete story campaign

### End Game (Level 100+)
1. Prestige for permanent bonuses
2. Push infinite dungeon floors
3. Participate in guild wars
4. Collect all seductive boss rewards
5. Aim for OMEGA power rank

### Combat Tips
1. **Always Combo**: Combos give massive damage bonuses
2. **Use Reactions**: Elemental reactions are key to high damage
3. **Build Momentum**: Stay aggressive to maintain momentum
4. **Position Matters**: Backstabs and flanking deal huge damage
5. **Parry Boss Attacks**: Perfect parries stagger bosses faster

### Economy Tips
1. **Sell Excess Materials**: Don't hoard common materials
2. **Buy from Traveling Merchants**: They have rare items
3. **Enhancement to +10**: Safe enhancement up to +10
4. **Socket Early**: Gems provide major stat boosts
5. **Save Tokens**: Challenge tokens for exclusive items

---

## Troubleshooting

### Game Won't Load
1. Clear browser cache
2. Try different browser (Chrome, Firefox, Edge)
3. Check console for errors (F12)
4. Ensure JavaScript is enabled
5. Try incognito/private mode

### Low FPS/Performance Issues
1. Lower graphics quality in settings
2. Enable "Battery Saver" mode
3. Close other browser tabs
4. Update graphics drivers
5. Try "Performance" mode for 144 FPS

### Save Data Lost
1. Check backup saves (Settings → Load Game → Backup 1/2/3)
2. Check emergency recovery save
3. Import exported save if available
4. Check IndexedDB isn't full
5. Contact support with save timestamp

### Controls Not Working
1. Check keybindings in Settings
2. Reset controls to default
3. Ensure keyboard is connected
4. Try different input device
5. Restart game

### Audio Issues
1. Check browser audio permissions
2. Unmute game in Settings
3. Adjust volume sliders separately
4. Try different browser
5. Check system audio mixer

### Can't Connect to Multiplayer
1. Check internet connection
2. Verify server status
3. Disable VPN/proxy
4. Check firewall settings
5. Try different network

---

## Support & Community

- **Report Bugs**: GitHub Issues
- **Feature Requests**: GitHub Discussions
- **Game Wiki**: (Coming Soon)
- **Discord Server**: (Coming Soon)

---

## Quick Reference

### Keyboard Shortcuts
| Key | Action |
|-----|--------|
| WASD | Move |
| Space | Jump |
| Shift | Sprint |
| E | Interact |
| I | Inventory |
| K | Skills |
| M | Map |
| L | Quests |
| P | Stats |
| G | Guild |
| H | Housing |
| ESC | Pause |
| F | Dodge |
| V | Parry |
| Q | Lock Target |
| Tab | Cycle Target |

### Power Rank Requirements
| Rank | Power Needed |
|------|--------------|
| F | 0 |
| E | 1,000 |
| D | 5,000 |
| C | 10,000 |
| B | 25,000 |
| A | 50,000 |
| S | 100,000 |
| SS | 250,000 |
| SSS | 500,000 |
| EX | 1,000,000 |
| Z | 2,500,000 |
| ZZ | 5,000,000 |
| ZZZ | 7,500,000 |
| OMEGA | 10,000,000 |

---

**Enjoy your adventure in Dynasty of Emberveil!** 🎮✨
