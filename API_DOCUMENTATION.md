# API & System Documentation - Dynasty of Emberveil

Complete reference for all 83 game systems and their APIs.

---

## Table of Contents

1. [Core Systems](#core-systems)
2. [Progression Systems](#progression-systems)
3. [Combat Systems](#combat-systems)
4. [Economy & Crafting](#economy--crafting)
5. [Social Systems](#social-systems)
6. [Content Systems](#content-systems)
7. [Quality & Performance](#quality--performance)
8. [Live Service](#live-service)

---

## Core Systems

### GameEngine

**Purpose**: Main game orchestrator

```javascript
// Initialize
gameEngine.init();

// Main loop
gameEngine.update(deltaTime);

// Render
gameEngine.render();

// State management
const state = gameEngine.getState();
gameEngine.setState(newState);

// Save/Load
await gameEngine.save();
await gameEngine.load();
```

**Events**:
- `onInit`: Fired when engine initializes
- `onUpdate`: Fired every frame
- `onSave`: Fired when save triggered
- `onLoad`: Fired when load complete

---

### AutoSaveSystem

**Purpose**: Bulletproof save system with multi-layer redundancy

```javascript
// Initialize (30s interval default)
autoSave.init(30000);

// Manual save
await autoSave.save();

// Load (tries all layers)
const data = await autoSave.load();

// Export to file
const blob = await autoSave.exportSave();
const url = URL.createObjectURL(blob);

// Import from file
await autoSave.importSave(file);

// Get save history
const history = autoSave.getSaveHistory(); // Last 10 saves

// Verify integrity
const isValid = autoSave.verifyIntegrity(saveData);

// Clear all saves (dangerous!)
autoSave.clearAllSaves();
```

**Save Layers**:
1. LocalStorage (primary, ~5-10MB)
2. IndexedDB (backup, ~50-100MB)
3. Rotating backups (3x)
4. Emergency recovery

**Data Structure**:
```javascript
{
    version: "1.0.0",
    timestamp: 1698765432000,
    checksum: "sha256hash...",
    compressed: true,
    player: {...},
    systems: {...},
    metadata: {
        totalPlayTime: 500000,
        saveCount: 1523
    }
}
```

---

### PerformanceOptimizer

**Purpose**: Real-time performance monitoring and optimization

```javascript
// Initialize
performanceOptimizer.init();

// Set performance mode
performanceOptimizer.setMode('balanced'); // 'battery' | 'balanced' | 'performance'

// Get metrics
const metrics = performanceOptimizer.getMetrics();
// Returns: { fps, avgFps, frameTime, memory, entityCount, quality }

// Get full report
const report = performanceOptimizer.getReport();

// Object pooling
const particle = performanceOptimizer.pools.particles.acquire();
// ... use particle
performanceOptimizer.pools.particles.release(particle);

// Manual cleanup
performanceOptimizer.performEmergencyCleanup();

// Culling
performanceOptimizer.cullEntities(entities, camera);

// LOD calculation
const lodLevel = performanceOptimizer.calculateLOD(entity, camera);
```

**Performance Modes**:
- **Battery Saver**: 30 FPS, low quality
- **Balanced**: 60 FPS, auto quality (default)
- **Performance**: 144 FPS, ultra quality

**Adaptive Quality Levels**:
- **Low**: 100 particles, no shadows, low textures
- **Medium**: 500 particles, simple shadows, medium textures
- **High**: 1000 particles, full shadows, high textures
- **Ultra**: 2000 particles, enhanced shadows, ultra textures

---

## Progression Systems

### PowerLevelingSystem

**Purpose**: Infinite power scaling with 14 ranks

```javascript
// Calculate power from stats
const power = powerLeveling.calculatePower(stats);

// Get power rank
const rank = powerLeveling.getRank(power);
// Returns: 'F' | 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'SS' | 'SSS' | 'EX' | 'Z' | 'ZZ' | 'ZZZ' | 'OMEGA'

// Check prestige eligibility
const canPrestige = powerLeveling.canPrestige(level, rank);

// Perform prestige
const prestigeData = powerLeveling.prestige();
// Returns: { newPower, bonusMultiplier, prestigeLevel }

// Get evolution stage
const stage = powerLeveling.getEvolutionStage(power);
// Returns: 'Mortal' | 'Awakened' | 'Ascended' | 'Transcendent' | 'Divine' | 'Godhood'

// Get stage bonuses
const bonuses = powerLeveling.getEvolutionBonuses(stage);
// Returns: { statMultiplier, skillMultiplier, powerCap }

// Add training XP
powerLeveling.addTrainingXP(amount, type);
// Type: 'combat' | 'dungeon' | 'boss' | 'raid' | 'pvp' | 'quest'
```

**Power Ranks**:
```javascript
{
    F: { threshold: 0, title: "Novice" },
    E: { threshold: 1000, title: "Beginner" },
    D: { threshold: 5000, title: "Intermediate" },
    C: { threshold: 10000, title: "Advanced" },
    B: { threshold: 25000, title: "Expert" },
    A: { threshold: 50000, title: "Master" },
    S: { threshold: 100000, title: "Elite" },
    SS: { threshold: 250000, title: "Champion" },
    SSS: { threshold: 500000, title: "Legend" },
    EX: { threshold: 1000000, title: "Mythic" },
    Z: { threshold: 2500000, title: "Transcendent" },
    ZZ: { threshold: 5000000, title: "Divine" },
    ZZZ: { threshold: 10000000, title: "Supreme" },
    OMEGA: { threshold: Infinity, title: "Supreme Being" }
}
```

---

### PrestigeSystem

**Purpose**: Reset for permanent bonuses

```javascript
// Check eligibility (level 50, floor 100)
const canPrestige = prestige.canPrestige(player);

// Perform prestige
const result = prestige.performPrestige(player);
// Returns: { prestigeLevel, bonusMultiplier, ascensionSkills, zones }

// Get ascension skills
const skills = prestige.getAscensionSkills(prestigeLevel);

// Unlock prestige zone
prestige.unlockZone(zoneName);

// Get prestige bonuses
const bonuses = prestige.getPrestigeBonuses(prestigeLevel);
// Returns: { attack, defense, hp, xpMultiplier }
```

**Ascension Skills** (9 total):
```javascript
// Tier 1 (Prestige 1+)
{ id: "ethereal_step", name: "Ethereal Step", tier: 1, effect: "Teleport" },
{ id: "astral_shield", name: "Astral Shield", tier: 1, effect: "Shield" },
{ id: "void_blast", name: "Void Blast", tier: 1, effect: "Damage" },

// Tier 2 (Prestige 5+)
{ id: "time_dilation", name: "Time Dilation", tier: 2, effect: "Slow time" },
{ id: "dimension_shift", name: "Dimension Shift", tier: 2, effect: "Phase" },
{ id: "cosmic_storm", name: "Cosmic Storm", tier: 2, effect: "AOE" },

// Tier 3 (Prestige 10+)
{ id: "reality_break", name: "Reality Break", tier: 3, effect: "Reality warp" },
{ id: "ascended_form", name: "Ascended Form", tier: 3, effect: "Transformation" },
{ id: "singularity", name: "Singularity", tier: 3, effect: "Black hole" }
```

---

### MasterySystem

**Purpose**: Track proficiency in weapons, strains, enemies, biomes

```javascript
// Add mastery XP
mastery.addWeaponXP(weaponType, amount);
mastery.addStrainXP(strainType, amount);
mastery.addEnemyKill(enemyType);
mastery.addBiomeTime(biomeType, timeSpent);

// Get mastery level
const weaponLevel = mastery.getWeaponMastery(weaponType); // 0-100
const strainLevel = mastery.getStrainMastery(strainType); // 0-50

// Get mastery bonuses
const bonuses = mastery.getMasteryBonuses(type, level);

// Check if mastered
const isMastered = mastery.isMastered(type, subtype);

// Get all masteries
const all = mastery.getAllMasteries();
```

**Mastery Types**:
- **Weapon** (10 types, 100 levels each): Swords, Axes, Daggers, Bows, Staves, Spears, Hammers, Dual Wield, Magic, Unarmed
- **Strain** (8 types, 50 levels): Sativa, Indica, Hybrid, Purple Haze, Green Crack, White Widow, OG Kush, Northern Lights
- **Enemy** (12 types, 100 levels): Varies by kill count
- **Biome** (8 biomes, 50 levels): Based on time spent

---

## Combat Systems

### FantasyMagicSystem

**Purpose**: 10 elemental magic schools with spell progression

```javascript
// Cast spell
const result = magic.castSpell(spellId, target, caster);
// Returns: { success, damage, effects, manaUsed }

// Learn spell
magic.learnSpell(spellId, player);

// Check if can cast
const canCast = magic.canCast(spellId, player);

// Get available spells
const spells = magic.getAvailableSpells(player);

// Regenerate mana
magic.regenerateMana(player, deltaTime);

// Get magic circle
const circle = magic.getMagicCircle(player.level);
// Returns: 1-9

// Calculate spell damage
const damage = magic.calculateSpellDamage(spell, caster, target);
```

**Elements**:
```javascript
const elements = [
    { id: "fire", name: "Fire", color: "#FF4500" },
    { id: "ice", name: "Ice", color: "#00CED1" },
    { id: "lightning", name: "Lightning", color: "#FFD700" },
    { id: "water", name: "Water", color: "#1E90FF" },
    { id: "earth", name: "Earth", color: "#8B4513" },
    { id: "wind", name: "Wind", color: "#87CEEB" },
    { id: "nature", name: "Nature", color: "#32CD32" },
    { id: "light", name: "Light", color: "#FFFACD" },
    { id: "dark", name: "Dark", color: "#4B0082" },
    { id: "arcane", name: "Arcane", color: "#9400D3" }
];
```

**Spell Structure**:
```javascript
{
    id: "fireball",
    name: "Fireball",
    element: "fire",
    tier: 2,
    circle: 3,
    manaCost: 50,
    damage: 200,
    cooldown: 2000,
    range: 20,
    aoe: 5,
    effects: ["burn"],
    description: "Hurl a blazing fireball"
}
```

---

### EnhancedGameMechanics

**Purpose**: Advanced combat mechanics (combos, reactions, momentum, stagger, parry, burst)

```javascript
// Process combo
const combo = mechanics.processCombo(actions, timings);
// Returns: { type, multiplier, damage, success }

// Check elemental reaction
const reaction = mechanics.checkReaction(element1, element2);
// Returns: { type, multiplier, effects } or null

// Update momentum
mechanics.updateMomentum(action, value);
// Actions: 'kill', 'crit', 'combo', 'dodge', 'perfectBlock', 'decay'

// Get momentum state
const momentum = mechanics.getMomentumState();
// Returns: { value: 0-100, tier, bonuses, isGodmode }

// Process stagger
mechanics.applyStaggerDamage(target, amount);
const isStaggered = mechanics.isStaggered(target);

// Process parry
const parryResult = mechanics.processParry(timing);
// Returns: { success, isPerfect, multiplier, stunDuration }

// Activate burst
mechanics.activateBurst(mode, player);
// Modes: 'berserker' | 'tank' | 'assassin' | 'mage' | 'support'

// Get positioning bonus
const bonus = mechanics.getPositioningBonus(attackerPos, targetPos);
// Returns: { type, damageMultiplier, critBonus }

// Update durability
mechanics.updateDurability(weapon, damageDealt);
```

**Combo Types**:
```javascript
{
    ELEMENTAL_FUSION: { multiplier: 3.0, window: 2000 },
    TRIPLE_STRIKE: { multiplier: 2.5, window: 500 },
    MAGIC_CHAIN: { multiplier: 4.0, window: 3000 },
    PERFECT_COUNTER: { multiplier: 3.0, window: 500 },
    ASSASSINATE: { multiplier: 5.0, window: 5000 }
}
```

**Reactions**:
```javascript
{
    OVERLOAD: { elements: ['fire', 'lightning'], multiplier: 2.0, effect: 'aoe_explosion' },
    FREEZE: { elements: ['water', 'ice'], multiplier: 1.5, effect: 'freeze_2s' },
    VAPORIZE: { elements: ['fire', 'water'], multiplier: 2.0, effect: 'steam_damage' },
    ELECTRO_CHARGED: { elements: ['water', 'lightning'], multiplier: 1.8, effect: 'chain_damage' },
    MELT: { elements: ['fire', 'ice'], multiplier: 2.5, effect: 'high_damage' },
    SUPERCONDUCT: { elements: ['ice', 'lightning'], multiplier: 1.7, effect: 'defense_down' },
    SWIRL: { elements: ['wind', '*'], multiplier: 1.5, effect: 'spread_element' },
    CRYSTALLIZE: { elements: ['earth', '*'], multiplier: 1.0, effect: 'shield' }
}
```

**Momentum Tiers**:
```javascript
{
    NORMAL: { range: [0, 24], bonuses: { attackSpeed: 1.0, damage: 1.0, crit: 0 } },
    FOCUSED: { range: [25, 49], bonuses: { attackSpeed: 1.1, damage: 1.0, crit: 0.05 } },
    EMPOWERED: { range: [50, 74], bonuses: { attackSpeed: 1.25, damage: 1.25, crit: 0.10 } },
    UNSTOPPABLE: { range: [75, 99], bonuses: { attackSpeed: 1.4, damage: 1.4, crit: 0.15 } },
    GODMODE: { range: [100, 100], bonuses: { attackSpeed: 1.5, damage: 1.5, crit: 0.25, invulnerable: 3000 } }
}
```

---

### EndlessBattleSystem

**Purpose**: Infinite battle waves with escalating difficulty

```javascript
// Start battle
endlessBattle.startBattle(difficulty);
// Difficulties: 'easy' | 'normal' | 'hard' | 'expert' | 'master' | 'insane' | 'hell' | 'nightmare'

// Spawn wave
const wave = endlessBattle.spawnWave(waveNumber, floor);

// Update kill streak
endlessBattle.addKill();
const streak = endlessBattle.getKillStreak();

// Get streak bonuses
const bonuses = endlessBattle.getStreakBonuses(streak);

// Check wave completion
const isComplete = endlessBattle.isWaveComplete();

// Get floor modifiers
const modifiers = endlessBattle.getFloorModifiers(floor);

// Calculate difficulty multiplier
const multiplier = endlessBattle.getDifficultyMultiplier(difficulty, floor);
```

**Difficulty Settings**:
```javascript
{
    easy: { enemyMult: 0.5, rewardMult: 0.8, dropMult: 0.6 },
    normal: { enemyMult: 1.0, rewardMult: 1.0, dropMult: 1.0 },
    hard: { enemyMult: 1.5, rewardMult: 1.3, dropMult: 1.2 },
    expert: { enemyMult: 2.0, rewardMult: 1.8, dropMult: 1.5 },
    master: { enemyMult: 3.0, rewardMult: 2.5, dropMult: 2.0 },
    insane: { enemyMult: 5.0, rewardMult: 4.0, dropMult: 3.0 },
    hell: { enemyMult: 10.0, rewardMult: 8.0, dropMult: 5.0 },
    nightmare: { enemyMult: 20.0, rewardMult: 15.0, dropMult: 10.0 }
}
```

**Kill Streak Bonuses**:
```javascript
{
    10: { name: "Double Damage", effect: { damage: 2.0 } },
    25: { name: "Triple Gold", effect: { gold: 3.0 } },
    50: { name: "Quad XP", effect: { xp: 4.0 } },
    100: { name: "Guaranteed Legendary", effect: { loot: "legendary" } },
    250: { name: "God Mode 30s", effect: { godmode: 30000 } },
    500: { name: "Guaranteed Mythic", effect: { loot: "mythic" } },
    1000: { name: "Ultimate Power", effect: { allStats: 10.0 } }
}
```

---

### SeductiveBaddiesSystem

**Purpose**: 8 anime-inspired boss characters with affection system

```javascript
// Get boss
const boss = baddies.getBoss(bossId);

// Defeat boss (gain affection)
const affectionGained = baddies.defeatBoss(bossId, performance);
// Performance: 'poor' | 'average' | 'good' | 'excellent' | 'perfect'

// Get affection level
const affection = baddies.getAffection(bossId);

// Check affection rewards
const rewards = baddies.checkAffectionRewards(bossId);

// Unlock special scene
const scene = baddies.unlockSpecialScene(bossId);

// Get all bosses
const allBosses = baddies.getAllBosses();

// Get boss abilities
const abilities = baddies.getBossAbilities(bossId);
```

**Boss Structure**:
```javascript
{
    id: "scarlet",
    name: "Crimson Empress Scarlet",
    title: "Dominant Flame Enchantress",
    level: 50,
    element: "fire",
    hp: 50000,
    attack: 2000,
    magic: 2500,
    abilities: [
        { id: "crimson_dance", damage: 1500, cooldown: 5000 },
        { id: "empress_authority", damage: 2000, cooldown: 10000 },
        { id: "flame_temptation", damage: 2500, cooldown: 15000 },
        { id: "scarlet_apocalypse", damage: 5000, cooldown: 30000 }
    ],
    affectionRewards: {
        50: { cosmetic: "battle_dress" },
        100: { pet: "fire_familiar" },
        200: { skill: "ultimate_fire_skill" },
        500: { scene: "throne_room_scene" }
    },
    drops: ["legendary_fire_weapon", "empress_crown", "flame_essence"]
}
```

---

## Economy & Crafting

### CraftingSystem

**Purpose**: Material gathering and item crafting

```javascript
// Craft item
const result = crafting.craftItem(recipeId, player);
// Returns: { success, item, materialsUsed }

// Drop materials from enemy
const drops = crafting.dropMaterialsFromEnemy(enemy);

// Check recipe availability
const canCraft = crafting.canCraftRecipe(recipeId, player);

// Discover recipe
crafting.discoverRecipe(recipeId);

// Upgrade crafting station
crafting.upgradeStation(stationType);

// Get all recipes
const recipes = crafting.getAllRecipes();

// Get materials inventory
const materials = crafting.getMaterials();
```

**Material Rarities**:
- Common (50% drop)
- Uncommon (30% drop)
- Rare (15% drop)
- Epic (4% drop)
- Legendary (0.9% drop)
- Mythic (0.1% drop)

---

### EconomySystem

**Purpose**: Currency management and merchants

```javascript
// Add currency
economy.addGold(amount);
economy.addGems(amount);
economy.addTokens(amount);

// Spend currency
const success = economy.spendGold(amount);

// Convert currency
economy.convertCurrency(fromType, toType, amount);
// Conversion rates: 1 gem = 100 gold, 1 token = 500 gold

// Buy from merchant
const result = economy.buyItem(merchantId, itemId);

// Sell to merchant
const gold = economy.sellItem(itemId, quantity);

// Check merchant inventory
const inventory = economy.getMerchantInventory(merchantId);

// Trigger merchant event
economy.triggerMerchantEvent(eventType);
// Events: 'flash_sale' | 'festival' | 'rare_shipment'
```

---

### EnhancementSystem

**Purpose**: Item enhancement, sockets, reforging

```javascript
// Enhance item
const result = enhancement.enhanceItem(item);
// Returns: { success, newLevel, stats }

// Add socket
enhancement.addSocket(item);

// Insert gem
enhancement.insertGem(item, socketIndex, gemType);

// Reforge stats
const reforged = enhancement.reforgeItem(item);

// Fuse items
const fused = enhancement.fuseItems(item1, item2);

// Transmog (cosmetic)
enhancement.transmog(item, cosmeticId);

// Repair item
enhancement.repairItem(item);
```

**Enhancement Success Rates**:
```javascript
{
    1: 100%, 2: 95%, 3: 90%, 4: 85%, 5: 80%,
    6: 70%, 7: 60%, 8: 50%, 9: 40%, 10: 30%,
    11: 25%, 12: 20%, 13: 18%, 14: 16%, 15: 15%
}
```

---

## Social Systems

### GuildSystem

**Purpose**: Player guilds with ranks, bank, perks, quests

```javascript
// Create guild
const guild = guilds.createGuild(name, emblem, player);

// Join guild
guilds.joinGuild(guildId, player);

// Promote/demote member
guilds.setMemberRank(guildId, playerId, rank);
// Ranks: 'seedling' | 'cultivator' | 'grower' | 'master_grower' | 'founder'

// Guild bank deposit
guilds.depositToBank(guildId, type, amount);
// Types: 'gold' | 'materials' | 'items'

// Guild bank withdraw
guilds.withdrawFromBank(guildId, type, amount);

// Level up guild
guilds.addGuildXP(guildId, amount);

// Upgrade perk
guilds.upgradePerk(guildId, perkType);
// Perks: 'collective_growth' | 'shared_harvest' | 'workshop_efficiency' | 'guild_vault' | 'bulk_purchase'

// Start guild quest
guilds.startQuest(guildId, questId);

// Get guild info
const info = guilds.getGuildInfo(guildId);
```

---

### LeaderboardSystem

**Purpose**: Competitive rankings with rewards

```javascript
// Update score
leaderboards.updateScore(category, playerId, score);
// Categories: 'floor', 'speedrun', 'damage', 'survival', 'enemies', 'achievements', 'bosses', 'combos', 'gold', 'pets'

// Get leaderboard
const board = leaderboards.getLeaderboard(category, period);
// Periods: 'daily' | 'weekly' | 'monthly'

// Get player rank
const rank = leaderboards.getPlayerRank(category, playerId);

// Distribute rewards
leaderboards.distributeRewards(category);

// Reset leaderboard
leaderboards.resetLeaderboard(category);
```

---

### PlayerHousing

**Purpose**: Personal player homes ("The Crib")

```javascript
// Purchase house
const house = housing.purchaseHouse(tier);
// Tiers: 'studio' | 'villa' | 'mansion' | 'estate' | 'palace'

// Add room
housing.addRoom(roomType);
// Types: 'living' | 'grow' | 'workshop' | 'trophy' | 'storage' | 'kitchen' | 'garage' | 'vault'

// Place furniture
housing.placeFurniture(furnitureId, position);

// Invite player
housing.invite(playerId);

// Set public/private
housing.setVisibility(isPublic);

// Upgrade room
housing.upgradeRoom(roomId);
```

---

## Content Systems

### InfiniteDungeonSystem

**Purpose**: Floors 1-999+ with infinite scaling

```javascript
// Enter floor
const floor = infiniteDungeon.enterFloor(floorNumber);

// Generate enemies
const enemies = infiniteDungeon.generateEnemies(floor);

// Check checkpoint
const hasCheckpoint = infiniteDungeon.hasCheckpoint(floor);

// Save checkpoint
infiniteDungeon.saveCheckpoint(floor);

// Get floor modifiers
const modifiers = infiniteDungeon.getFloorModifiers(floor);

// Trigger random event
const event = infiniteDungeon.triggerRandomEvent(floor);
// Events: 'treasure_room' | 'merchant' | 'puzzle' | 'safe_haven' | 'champion' | 'shrine' | 'altar' | 'rift'

// Calculate loot quality
const quality = infiniteDungeon.calculateLootQuality(floor);

// Get milestone reward
const reward = infiniteDungeon.getMilestoneReward(floor);
// Milestones: 10, 25, 50, 75, 100, 150, 200, 250, 500, 750, 999
```

---

### BiomeSystem

**Purpose**: 25 unique biomes with themed content

```javascript
// Get biome for floor
const biome = biomes.getBiomeForFloor(floor);

// Get biome info
const info = biomes.getBiomeInfo(biomeId);

// Get biome enemies
const enemies = biomes.getBiomeEnemies(biomeId);

// Get environmental hazards
const hazards = biomes.getHazards(biomeId);

// Apply biome effects
biomes.applyBiomeEffects(player);

// Check biome mastery
const mastery = biomes.getBiomeMastery(biomeId);
```

**Biomes** (25 total):
- Floors 1-50: Forest, Desert, Mountain, Tundra, Swamp
- Floors 51-100: Neon Jungle, Crystal Caverns, Ethereal Nebula, Infernal Greenhouse, Frozen Tundra
- Floors 101+: Void Dimension, Heaven's Garden, Hell's Greenhouse, Cyber City, Ancient Ruins, Mushroom Kingdom, Underwater Palace, Desert Oasis, Jungle Temple, The Source
- Floor 1000+: Random rotation

---

### EnemyGallery

**Purpose**: 25+ enemy types across 5 factions

```javascript
// Get enemy
const enemy = enemies.getEnemy(enemyId);

// Spawn enemy
const spawned = enemies.spawnEnemy(enemyId, level, position);

// Get faction enemies
const factionEnemies = enemies.getFactionEnemies(faction);
// Factions: 'cartel' | 'cops' | 'growers' | 'narcs' | 'horrors'

// Check enemy drops
const drops = enemies.getEnemyDrops(enemy);

// Update faction reputation
enemies.updateFactionReputation(faction, amount);
```

---

### StoryCampaign

**Purpose**: "The Green Awakening" - 10 chapter story

```javascript
// Start chapter
story.startChapter(chapterNumber);

// Complete quest
story.completeQuest(questId);

// Make dialogue choice
const result = story.makeChoice(choiceId);

// Get current progress
const progress = story.getProgress();

// Check ending
const ending = story.determineEnding(player);
// Endings based on morality choices

// Get character relationships
const relationships = story.getRelationships();
```

---

### DynamicEvents

**Purpose**: Random world events

```javascript
// Check for event spawn
const event = events.checkSpawn();

// Start event
events.startEvent(eventId);

// Complete event
const rewards = events.completeEvent(eventId);

// Get active events
const active = events.getActiveEvents();

// Contribute to community event
events.contribute(eventId, amount);
```

**Event Categories**:
- Invasion (defend against waves)
- Merchant (special traders)
- Environmental (weather effects)
- Social (community gatherings)
- Boss (world boss spawns)
- Discovery (find secrets)
- Challenge (limited-time challenges)
- Seasonal (holiday events)

---

## Quality & Performance

### VisualEffectsSystem

**Purpose**: Particle effects and screen effects

```javascript
// Spawn particle effect
vfx.spawnEffect(effectId, position, options);
// Effects: 'smoke', 'fire', 'ice', 'lightning', 'poison', 'healing', 'cosmic', etc.

// Apply screen effect
vfx.applyScreenEffect(effectId, duration);
// Effects: 'chromatic', 'colorShift', 'shake', 'blur', 'vignette', 'bloom', 'distortion', etc.

// Set visual theme
vfx.setTheme(themeId);
// Themes: 'classic' | 'neon' | 'retro' | 'cel_shaded' | 'realistic'

// Enable/disable effects
vfx.setEnabled(enabled);

// Set particle limit
vfx.setParticleLimit(limit);
```

---

### AchievementSystem

**Purpose**: 100+ achievements across 12 categories

```javascript
// Unlock achievement
achievements.unlock(achievementId);

// Check achievement progress
const progress = achievements.getProgress(achievementId);

// Get all achievements
const all = achievements.getAllAchievements();

// Get category achievements
const category = achievements.getByCategory(categoryName);

// Get completion percentage
const completion = achievements.getCompletionPercentage();

// Claim rewards
const rewards = achievements.claimRewards(achievementId);
```

**Categories**: Combat, Progression, Crafting, Economy, Cannabis Culture, Social, Collection, Mastery, Mini-Games, Story, Events, Misc

---

### AccessibilitySystem

**Purpose**: Inclusive design features

```javascript
// Set colorblind mode
accessibility.setColorblindMode(mode);
// Modes: 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia'

// Set contrast
accessibility.setHighContrast(enabled);

// Set text size
accessibility.setTextSize(size);
// Sizes: 'small' | 'medium' | 'large' | 'extra_large'

// Enable screen reader
accessibility.enableScreenReader(enabled);

// Remap controls
accessibility.remapControl(action, key);

// Set difficulty assist
accessibility.setDifficultyAssist(options);
// Options: { autoAim, slowMotion, invincibility, autoLoot }
```

---

## Live Service

### BattlePassSystem

**Purpose**: Seasonal progression with rewards

```javascript
// Purchase battle pass
battlePass.purchase(tier);
// Tiers: 'free' | 'premium' | 'elite'

// Add XP
battlePass.addXP(amount);

// Claim tier reward
const reward = battlePass.claimReward(tier);

// Get progress
const progress = battlePass.getProgress();

// Get season info
const season = battlePass.getCurrentSeason();
```

---

### CosmeticShop

**Purpose**: Cosmetic-only purchases (NO PAY-TO-WIN)

```javascript
// Get shop items
const items = shop.getItems(category);
// Categories: 'skins' | 'effects' | 'emotes' | 'poses' | 'pets' | 'mounts' | 'ui' | 'victory'

// Purchase item
const result = shop.purchaseItem(itemId);

// Equip cosmetic
shop.equipCosmetic(cosmeticId);

// Get owned cosmetics
const owned = shop.getOwnedCosmetics();
```

---

## Event Hooks

Subscribe to game events:

```javascript
// Save events
gameEngine.on('beforeSave', (data) => console.log('Saving...'));
gameEngine.on('afterSave', (data) => console.log('Saved!'));
gameEngine.on('saveError', (error) => console.error(error));

// Level up
gameEngine.on('levelUp', (newLevel) => console.log(`Level ${newLevel}!`));

// Boss defeated
gameEngine.on('bossDefeated', (bossId) => console.log(`Defeated ${bossId}`));

// Achievement unlocked
gameEngine.on('achievementUnlocked', (achievement) => console.log(`Achievement: ${achievement.name}`));

// Prestige
gameEngine.on('prestige', (data) => console.log(`Prestige ${data.level}!`));

// Error
gameEngine.on('error', (error) => console.error(error));
```

---

**Version**: 1.0.0  
**Last Updated**: 2025-10-28  
**Total APIs**: 83 systems  
**Status**: Complete Reference ✅
