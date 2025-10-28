# Dynasty of Emberveil - Complete Usage Guide
## Version 2.0.0 - Production Ready with 54,642 Lines

## Table of Contents
1. [Quick Start](#quick-start)
2. [Game Controls](#game-controls)
3. [Core Gameplay Systems](#core-gameplay-systems)
4. [Phase 8-9 Advanced Features](#phase-8-9-advanced-features)
5. [Advanced Features](#advanced-features)
6. [Tips & Strategies](#tips--strategies)
7. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Running Locally (Fastest Method)
```bash
# Install dependencies (first time only)
npm install

# Start development server with all 106 systems active
npm run dev

# Game available at http://localhost:5173
```

### Production Build
```bash
# Build optimized version (369KB gzipped)
npm run build

# Test production build
npm run preview

# OR serve on custom port
npm run serve:prod
```

### Deploy Anywhere
Upload `dist/` folder to any static host:
- Netlify, Vercel, GitHub Pages
- AWS S3, Azure, Cloudflare Pages
- Any web server
- Local file system

**No backend required** - fully client-side game!

### Playing the Game
1. Open browser to local server URL or deployed site
2. Click "Start Game" on main menu
3. Create your character (6 classes, 100+ customization options)
4. Choose starting biome (15 available)
5. Begin adventure with tutorial guidance
6. **Auto-saves every 60 seconds** - never lose progress!
7. Access cloud saves across devices (when available)

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

## Phase 8-9 Advanced Features

### Intelligent AI System (770 lines - IntelligentAISystem.js)

#### Behavior Trees
Enemies use advanced AI with multiple behavior states:
- **Patrol**: Wanders area, investigates sounds
- **Hunt**: Actively pursues player, predicts movement
- **Flee**: Retreats when low health, seeks backup
- **Ambush**: Sets traps, waits for opportune moment
- **Guard**: Protects objectives, holds position
- **Roam**: Random exploration patterns

#### Learning AI
AI learns from your tactics over time:
- **Dodge Prediction**: Learns your dodge patterns (0-100% accuracy)
- **Spell Recognition**: Remembers your favorite spells
- **Combo Awareness**: Anticipates combo sequences
- **Weakness Exploitation**: Targets your vulnerabilities
- **Adaptation Speed**: Fast learners (aggressive) vs. Slow learners (defensive)

#### Personality Types (8 Types)
1. **Aggressive**: Rushes in, high damage, low defense
2. **Defensive**: Waits for openings, blocks frequently
3. **Tactical**: Uses terrain, flanks, coordinates
4. **Berserker**: Goes berserk at low HP, 2x damage/speed
5. **Cowardly**: Flees often, calls for help
6. **Elite**: Balanced, uses all tactics
7. **Boss**: Multi-phase, learns fastest, ultimate challenge
8. **Swarm**: Weak individually, dangerous in groups

#### Pack Tactics
Enemies coordinate in groups:
- **Flanking**: Surrounds player, attacks from multiple angles
- **Focus Fire**: All target weakest player/companion
- **Distraction**: One distracts while others attack
- **Revive Fallen**: Attempts to resurrect downed allies
- **Call Reinforcements**: Summons backup when losing

**Access**: AI operates automatically - observe enemy behavior to identify patterns!

### Dynamic Difficulty System (650 lines - DynamicDifficultySystem.js)

#### Player Skill Analysis
System tracks your performance in real-time:
- **Kill Speed**: How fast you defeat enemies
- **Deaths**: Frequency of player deaths
- **Damage Taken**: Average damage received per fight
- **Combo Usage**: Frequency and quality of combos
- **Spell Efficiency**: Mana usage vs. damage output
- **Dodge Success**: Percentage of successful dodges
- **Parry Success**: Perfect parry timing

#### Adaptive Difficulty Tiers (10 Levels)
1. **Tutorial** (0-20 skill): Gentle introduction
2. **Beginner** (21-35): Learning basics
3. **Casual** (36-50): Comfortable play
4. **Normal** (51-60): Balanced challenge
5. **Skilled** (61-70): Requires mastery
6. **Expert** (71-80): Punishing difficulty
7. **Master** (81-88): Near-perfect play required
8. **Nightmare** (89-95): Extreme challenge
9. **Hell** (96-99): Ultimate test
10. **Impossible** (100): Reserved for the best

#### Adaptive Features
- **Enemy HP**: Scales 50%-200% based on your skill
- **Enemy Damage**: Adjusts 60%-180% 
- **Spawn Rate**: More enemies if you're dominating
- **Loot Quality**: Better rewards for harder difficulty
- **XP Gain**: Bonus XP at higher difficulties (+10% per tier above Normal)
- **Boss Scaling**: Bosses gain extra phases at high skill levels

#### Challenge Zones
Special areas that maintain fixed difficulty:
- **Training Grounds**: Always easy - practice without penalty
- **Challenge Dungeons**: Fixed nightmare difficulty - test your limits
- **Boss Arenas**: Scale to your current tier
- **World Bosses**: Scale with number of participants

**Access**: Settings → Gameplay → Difficulty (view current tier and adjust sensitivity)

### Progressive World System (950 lines - ProgressiveWorldSystem.js)

#### World Tiers (10 Tiers)
World evolves as you progress:

**Tier 1: Beginning** (Lv 1-10)
- Peaceful starter areas
- Basic enemies (slimes, wolves)
- Simple quests and tutorials

**Tier 2: Awakening** (Lv 11-25)
- Enemies become aggressive
- First dungeons appear
- Minor world events

**Tier 3: Rising Threat** (Lv 26-40)
- Elite enemies spawn
- Region bosses emerge
- Weather intensifies

**Tier 4: Dark Times** (Lv 41-55)
- Corruption spreads visually
- Harder enemy variants
- Random invasions

**Tier 5: Crisis** (Lv 56-70)
- World boss events
- Multiple simultaneous threats
- Environmental hazards increase

**Tier 6: Chaos** (Lv 71-85)
- World transforms dramatically
- Legendary enemies appear
- Reality rifts open

**Tier 7: Apocalypse** (Lv 86-95)
- Constant danger
- Mega bosses roam freely
- Multiple world events overlap

**Tier 8: Transcendence** (Lv 96-100)
- God-tier enemies
- World-ending threats
- Ultimate challenges

**Tier 9: Beyond** (Prestige 1-5)
- Post-game content
- Cosmic horrors
- Reality-breaking events

**Tier 10: Infinity** (Prestige 6+)
- True endgame
- Endless scaling
- Mythic world bosses

#### Region Evolution
Biomes change visually and mechanically:
- **Environmental Changes**: Flora dies/thrives based on tier
- **Architecture Decay**: Buildings show wear at higher tiers
- **NPC Reactions**: NPCs become more desperate/hopeful
- **Resource Availability**: Different materials per tier
- **Enemy Composition**: Monster types change

#### Random World Events (15 Types)
Events trigger dynamically based on conditions:

1. **Meteor Shower**: Meteors fall, creating craters with rare ores
2. **Blood Moon**: All enemies become elite for duration
3. **Treasure Goblin Invasion**: Rare monsters drop legendary loot
4. **Merchant Caravan**: Traveling merchants with limited stock
5. **Ancient Awakening**: Sleeping boss spawns and roams
6. **Rift Opening**: Portal to bonus dimension
7. **Monster Horde**: Massive enemy wave attacks
8. **Blessing of the Ancients**: Global buffs for all players
9. **Curse of Weakness**: Debuffs, must find cure
10. **Elemental Storm**: Environment becomes dangerous
11. **Festival**: NPCs celebrate, bonus rewards
12. **Plague Outbreak**: Contagious debuff spreads
13. **Treasure Hunt**: Clues lead to hidden cache
14. **Boss Rush**: Multiple bosses spawn in sequence
15. **World Boss Spawn**: Tier-appropriate world boss appears

#### World Bosses (4 Tiers)
**Tier 1 World Bosses** (Every 6 hours):
- HP: 50,000 | Power: 5,000
- Recommended: 5-10 players
- Loot: Rare items, materials

**Tier 2 World Bosses** (Every 12 hours):
- HP: 150,000 | Power: 15,000
- Recommended: 10-20 players
- Loot: Epic items, gems

**Tier 3 World Bosses** (Daily):
- HP: 500,000 | Power: 40,000
- Recommended: 20-30 players
- Loot: Legendary items, recipes

**Tier 4 World Bosses** (Weekly):
- HP: 2,000,000 | Power: 100,000
- Recommended: 30-50 players
- Loot: Mythic items, unique cosmetics

**Access**: World events announce globally - map marker shows location

### Magical Effects System (1,200 lines - MagicalEffectsSystem.js)

#### 8 Magic Schools

**1. Fire Magic** 🔥
- Theme: Damage over time, explosions
- Spells: Fireball, Inferno, Meteor Strike, Phoenix Form
- Particle Effects: Flames, embers, smoke trails
- School Color: Orange/Red

**2. Ice Magic** ❄️
- Theme: Crowd control, slowing
- Spells: Ice Shard, Blizzard, Frozen Tomb, Ice Age
- Particle Effects: Snowflakes, ice crystals, frost
- School Color: Cyan/White

**3. Lightning Magic** ⚡
- Theme: Chain damage, speed
- Spells: Lightning Bolt, Chain Lightning, Thunder Storm, God's Wrath
- Particle Effects: Electric arcs, sparks, plasma
- School Color: Yellow/Purple

**4. Water Magic** 💧
- Theme: Healing, shields
- Spells: Water Jet, Tidal Wave, Healing Rain, Ocean's Blessing
- Particle Effects: Water droplets, bubbles, mist
- School Color: Blue/Aqua

**5. Earth Magic** 🌍
- Theme: Defense, stuns
- Spells: Rock Throw, Earthquake, Stone Skin, Mountain's Fury
- Particle Effects: Dust, rocks, debris
- School Color: Brown/Green

**6. Wind Magic** 💨
- Theme: Mobility, knockback
- Spells: Wind Blade, Tornado, Gust, Hurricane
- Particle Effects: Wind trails, leaves, feathers
- School Color: White/Gray

**7. Nature Magic** 🌿
- Theme: Healing, buffs, DOT
- Spells: Vine Lash, Entangle, Forest's Embrace, Gaia's Wrath
- Particle Effects: Leaves, flowers, vines, pollen
- School Color: Green/Gold

**8. Arcane Magic** ✨
- Theme: Versatile, mana manipulation
- Spells: Arcane Missiles, Time Warp, Polymorph, Reality Break
- Particle Effects: Purple energy, runes, glyphs
- School Color: Purple/Pink

#### Spell Casting Visuals
Each spell features:
- **Casting Circle**: Animated rune circle at caster's feet
- **Charge Animation**: Energy gathers during cast time
- **Projectile Trail**: Unique trail for each spell school
- **Impact Effect**: Explosion/splash at target
- **Status Indicators**: Visual aura on affected targets
- **Particle Persistence**: Effects linger after cast

#### Combo Effects
Casting multiple schools together creates special effects:
- **Fire + Ice**: Steam explosion (2x damage)
- **Lightning + Water**: Electrocution (chain to nearby)
- **Earth + Wind**: Sandstorm (AOE blind)
- **Nature + Water**: Growth surge (heal + buff)
- **Arcane + Any**: Amplified effect (1.5x power)

**Access**: Skills menu (K) → Magic Schools → Select spells for hotbar (1-9)

### World Beautification System (1,900 lines - WorldBeautificationSystem.js)

#### Flora System
Each biome has unique plant life:
- **Trees**: 20+ types (oak, pine, palm, dead, crystal, etc.)
- **Grass**: Dynamic grass that sways in wind
- **Flowers**: 15+ species with bloom cycles
- **Mushrooms**: Glowing varieties in dark areas
- **Vines**: Hanging vegetation with physics
- **Bushes**: Cover for stealth gameplay

Flora reacts to:
- Wind direction and strength
- Player/enemy movement (parts when walked through)
- Magic effects (burns, freezes, etc.)
- Time of day (some flowers close at night)
- World tier (corruption affects appearance)

#### Fauna System
Ambient creatures add life:
- **Birds**: Fly overhead, perch on trees, flee from danger
- **Butterflies**: Flutter near flowers, follow player briefly
- **Fireflies**: Glow at night, create atmosphere
- **Small Animals**: Rabbits, squirrels, rats (non-combat)
- **Fish**: In water areas, can be caught
- **Insects**: Flies, bees, dragonflies

Fauna behavior:
- Flee from combat
- Follow day/night cycle
- Interact with environment
- Create ambient sounds

#### Atmospheric Effects
**Particle Systems**:
- **Dust Motes**: Floating in sunbeams
- **Pollen**: Spring biomes, golden particles
- **Ash**: Volcanic areas, falling cinders
- **Snow**: Winter biomes, gentle snowfall
- **Leaves**: Autumn areas, swirling leaves
- **Embers**: Near fires, floating upward
- **Fog**: Ground-level mist in swamps
- **Bubbles**: Underwater areas

**Lighting Effects**:
- **God Rays**: Sunbeams through trees
- **Bioluminescence**: Glowing plants at night
- **Reflections**: Water and crystal surfaces
- **Shadows**: Dynamic shadow casting
- **Ambient Occlusion**: Depth in crevices

**Weather Integration**:
- Rain creates puddles and splashes
- Wind affects all particles and flora
- Lightning illuminates briefly
- Snow accumulates on surfaces

**Access**: Runs automatically - all biomes have these features active!

### Monster Design System (1,650 lines - MonsterDesignSystem.js)

#### 50+ Unique Monster Types

**Common Monsters** (30 types):
- Forest: Wolves, Bears, Treants, Sprites
- Desert: Scorpions, Snakes, Sand Worms, Mummies
- Tundra: Yetis, Ice Wolves, Mammoths, Frost Giants
- Volcano: Fire Elementals, Lava Golems, Dragons (young)
- Swamp: Crocodiles, Bog Monsters, Will-o-wisps
- Caverns: Bats, Spiders, Goblins, Crystal Golems
- Sky: Eagles, Harpies, Wind Spirits, Cloud Serpents
- Underwater: Sharks, Merfolk, Krakens, Jellies
- Shadow: Shadow Beasts, Wraiths, Nightmares
- Demon: Imps, Demons, Hellhounds

**Elite Monsters** (15 types):
- Named variants with unique abilities
- 3x HP, 2x damage, special attacks
- Guaranteed rare/epic loot
- Visual indicators (aura, size, glow)

**Boss Monsters** (15 types):
- Multi-phase encounters
- Unique mechanics per boss
- Cinematic introductions
- Guaranteed legendary loot
- Achievement on first kill

#### Monster Appearance System
Each monster has:
- **Base Model**: 3D mesh or procedural geometry
- **Texture Variations**: 5+ color schemes per type
- **Size Scaling**: Small/Normal/Large/Giant variants
- **Particle Effects**: Auras, trails, glows
- **Animation Set**: Idle, walk, attack, death, special
- **Damage States**: Visual wear as HP decreases
- **Elite Indicators**: Glowing eyes, aura, larger size

#### Boss Transformation System
Epic bosses transform during fight:

**Phase 1** (100-75% HP):
- Base form
- Basic attacks
- Learning your patterns

**Phase 2** (75-50% HP):
- Size increases 1.2x
- New attacks unlock
- Summons minions
- Speed +20%

**Phase 3** (50-25% HP):
- Size increases 1.5x
- Ultimate attacks
- Enrage mode
- Speed +40%, Damage +50%

**Phase 4** (25-0% HP) *Legendary Bosses Only*:
- Final form (sometimes different model)
- All abilities available
- Desperation attacks
- Speed +60%, Damage +100%

**Visual Changes**:
- Color shift (e.g., red at low HP)
- Additional particle effects
- Glowing weak points
- Environmental changes

**Access**: Encounter monsters naturally in biomes or dungeons - bosses at dungeon ends!

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
