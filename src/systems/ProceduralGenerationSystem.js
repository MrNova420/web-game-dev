/**
 * ProceduralGenerationSystem.js
 * Endless procedural content generation based on player progress
 * Auto-generates levels, worlds, modes, items, and content dynamically
 * ~600 lines
 */

export class ProceduralGenerationSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // Generation state tracking
        this.worldSeed = Date.now();
        this.generatedContent = {
            levels: new Map(),
            worlds: new Map(),
            items: new Map(),
            enemies: new Map(),
            quests: new Map(),
            dungeons: new Map()
        };
        
        // Player progress tracking for scaled generation
        this.progressMetrics = {
            playerLevel: 1,
            totalPlayTime: 0,
            itemsCollected: 0,
            enemiesDefeated: 0,
            questsCompleted: 0,
            dungeonsCleared: 0,
            areasExplored: 0
        };
        
        // Generation configuration
        this.config = {
            levelScaling: {
                baseEnemyHealth: 50,
                healthPerLevel: 10,
                baseDamage: 10,
                damagePerLevel: 2,
                experienceMultiplier: 1.15
            },
            itemGeneration: {
                baseDropRate: 0.3,
                rareDropRate: 0.05,
                epicDropRate: 0.01,
                legendaryDropRate: 0.001,
                itemsPerTier: 20
            },
            worldExpansion: {
                initialSize: 1000, // 1km²
                expansionRate: 500, // +500m per progress milestone
                maxSize: 10000 // 10km²
            },
            contentThresholds: {
                newBiomeEvery: 5, // levels
                newDungeonEvery: 3,
                newQuestlineEvery: 10,
                newGameModeEvery: 20
            }
        };
        
        // Procedural templates for generation
        this.templates = {
            itemPrefixes: ['Ancient', 'Mystical', 'Cursed', 'Blessed', 'Ethereal', 'Void', 'Celestial', 'Infernal', 'Frozen', 'Burning'],
            itemSuffixes: ['of Power', 'of Wisdom', 'of Destruction', 'of Protection', 'of Speed', 'of Regeneration', 'of the Ancients', 'of Chaos', 'of Order', 'of Eternity'],
            enemyTypes: ['Wraith', 'Golem', 'Dragon', 'Demon', 'Elemental', 'Beast', 'Construct', 'Spirit', 'Horror', 'Titan'],
            enemyModifiers: ['Shadow', 'Flame', 'Frost', 'Storm', 'Toxic', 'Radiant', 'Void', 'Arcane', 'Primal', 'Divine'],
            dungeonThemes: ['Ruins', 'Catacombs', 'Tower', 'Fortress', 'Temple', 'Abyss', 'Nexus', 'Sanctum', 'Citadel', 'Labyrinth']
        };
        
        logger.info('🎲 ProceduralGenerationSystem initialized');
    }
    
    /**
     * Initialize the system with player data
     */
    init(playerData) {
        if (playerData) {
            this.progressMetrics.playerLevel = playerData.level || 1;
        }
        
        // Generate initial content pool
        this.generateInitialContent();
    }
    
    /**
     * Generate initial content pool
     */
    generateInitialContent() {
        // Pre-generate some content for early game
        for (let i = 0; i < 10; i++) {
            this.generateLevel(i);
            this.generateItems(5, i);
        }
        
        logger.info('✨ Initial content pool generated');
    }
    
    /**
     * Update progress metrics
     */
    updateProgress(metric, value) {
        if (this.progressMetrics.hasOwnProperty(metric)) {
            this.progressMetrics[metric] += value;
            
            // Check if new content should be generated
            this.checkContentGeneration();
        }
    }
    
    /**
     * Check if new content should be generated based on progress
     */
    checkContentGeneration() {
        const level = this.progressMetrics.playerLevel;
        
        // Generate new biome
        if (level % this.config.contentThresholds.newBiomeEvery === 0) {
            this.generateBiome(level);
        }
        
        // Generate new dungeon
        if (level % this.config.contentThresholds.newDungeonEvery === 0) {
            this.generateDungeon(level);
        }
        
        // Generate new questline
        if (level % this.config.contentThresholds.newQuestlineEvery === 0) {
            this.generateQuestline(level);
        }
        
        // Generate new game mode
        if (level % this.config.contentThresholds.newGameModeEvery === 0) {
            this.generateGameMode(level);
        }
    }
    
    /**
     * Generate a procedural level
     */
    generateLevel(levelNumber) {
        const seed = this.seededRandom(this.worldSeed + levelNumber);
        
        const level = {
            id: `level_${levelNumber}`,
            number: levelNumber,
            difficulty: Math.floor(levelNumber / 5) + 1,
            size: this.config.worldExpansion.initialSize + (levelNumber * 100),
            enemyCount: 10 + (levelNumber * 2),
            bossCount: Math.max(1, Math.floor(levelNumber / 5)),
            treasureCount: 5 + Math.floor(levelNumber / 2),
            theme: this.templates.dungeonThemes[Math.floor(seed * this.templates.dungeonThemes.length)],
            generatedAt: Date.now()
        };
        
        this.generatedContent.levels.set(level.id, level);
        return level;
    }
    
    /**
     * Generate procedural items
     */
    generateItems(count, tier) {
        const items = [];
        
        for (let i = 0; i < count; i++) {
            const seed = this.seededRandom(this.worldSeed + tier + i * 100);
            const rarity = this.determineRarity(seed);
            
            const item = {
                id: `item_${tier}_${i}_${Date.now()}`,
                name: this.generateItemName(seed, rarity),
                tier,
                rarity,
                stats: this.generateItemStats(tier, rarity),
                value: Math.floor((tier + 1) * 100 * (rarity === 'legendary' ? 10 : rarity === 'epic' ? 5 : rarity === 'rare' ? 2 : 1)),
                requiredLevel: tier * 5,
                generatedAt: Date.now()
            };
            
            items.push(item);
            this.generatedContent.items.set(item.id, item);
        }
        
        return items;
    }
    
    /**
     * Generate item name
     */
    generateItemName(seed, rarity) {
        const prefixIdx = Math.floor(seed * this.templates.itemPrefixes.length);
        const suffixIdx = Math.floor((seed * 13) % this.templates.itemSuffixes.length);
        
        const prefix = rarity !== 'common' ? this.templates.itemPrefixes[prefixIdx] : '';
        const suffix = rarity === 'epic' || rarity === 'legendary' ? this.templates.itemSuffixes[suffixIdx] : '';
        
        const baseNames = ['Sword', 'Staff', 'Bow', 'Shield', 'Armor', 'Ring', 'Amulet', 'Helm', 'Boots', 'Gloves'];
        const baseIdx = Math.floor((seed * 7) % baseNames.length);
        const baseName = baseNames[baseIdx];
        
        return `${prefix} ${baseName} ${suffix}`.trim();
    }
    
    /**
     * Generate item stats based on tier and rarity
     */
    generateItemStats(tier, rarity) {
        const multiplier = rarity === 'legendary' ? 3 : rarity === 'epic' ? 2 : rarity === 'rare' ? 1.5 : 1;
        
        return {
            attack: Math.floor((10 + tier * 5) * multiplier),
            defense: Math.floor((5 + tier * 3) * multiplier),
            health: Math.floor((20 + tier * 10) * multiplier),
            mana: Math.floor((15 + tier * 8) * multiplier),
            speed: Math.floor((5 + tier * 2) * multiplier)
        };
    }
    
    /**
     * Determine item rarity
     */
    determineRarity(seed) {
        if (seed < this.config.itemGeneration.legendaryDropRate) return 'legendary';
        if (seed < this.config.itemGeneration.epicDropRate) return 'epic';
        if (seed < this.config.itemGeneration.rareDropRate) return 'rare';
        return 'common';
    }
    
    /**
     * Generate procedural enemy
     */
    generateEnemy(level, position) {
        const seed = this.seededRandom(this.worldSeed + level + position.x + position.z);
        
        const typeIdx = Math.floor(seed * this.templates.enemyTypes.length);
        const modIdx = Math.floor((seed * 11) % this.templates.enemyModifiers.length);
        
        const enemy = {
            id: `enemy_${level}_${Date.now()}_${Math.random()}`,
            name: `${this.templates.enemyModifiers[modIdx]} ${this.templates.enemyTypes[typeIdx]}`,
            level,
            health: this.config.levelScaling.baseEnemyHealth + (level * this.config.levelScaling.healthPerLevel),
            damage: this.config.levelScaling.baseDamage + (level * this.config.levelScaling.damagePerLevel),
            experience: Math.floor(50 * Math.pow(this.config.levelScaling.experienceMultiplier, level)),
            position,
            abilities: this.generateEnemyAbilities(level, seed),
            lootTable: this.generateLootTable(level),
            generatedAt: Date.now()
        };
        
        this.generatedContent.enemies.set(enemy.id, enemy);
        return enemy;
    }
    
    /**
     * Generate enemy abilities
     */
    generateEnemyAbilities(level, seed) {
        const abilityCount = Math.min(1 + Math.floor(level / 5), 5);
        const abilities = [];
        
        const abilityPool = ['fireball', 'ice_blast', 'lightning_strike', 'poison_cloud', 'heal', 'shield', 'teleport', 'summon', 'rage', 'fear'];
        
        for (let i = 0; i < abilityCount; i++) {
            const idx = Math.floor((seed * (i + 1) * 7) % abilityPool.length);
            abilities.push(abilityPool[idx]);
        }
        
        return abilities;
    }
    
    /**
     * Generate loot table for enemy
     */
    generateLootTable(level) {
        return {
            items: this.generateItems(Math.floor(1 + level / 10), Math.floor(level / 5)),
            gold: Math.floor(50 + level * 25),
            experience: Math.floor(50 * Math.pow(this.config.levelScaling.experienceMultiplier, level))
        };
    }
    
    /**
     * Generate procedural biome
     */
    generateBiome(unlockLevel) {
        const seed = this.seededRandom(this.worldSeed + unlockLevel * 1000);
        
        const themes = ['Volcanic', 'Frozen', 'Desert', 'Ocean', 'Sky', 'Shadow', 'Crystal', 'Fungal', 'Mechanical', 'Ethereal'];
        const themeIdx = Math.floor(seed * themes.length);
        
        const biome = {
            id: `biome_${unlockLevel}_${Date.now()}`,
            name: `${themes[themeIdx]} Expanse`,
            unlockLevel,
            difficulty: Math.floor(unlockLevel / 5) + 1,
            size: 2000 + (unlockLevel * 100),
            enemyLevel: unlockLevel,
            resources: this.generateBiomeResources(unlockLevel, themes[themeIdx]),
            weather: this.generateBiomeWeather(themes[themeIdx]),
            generatedAt: Date.now()
        };
        
        this.generatedContent.worlds.set(biome.id, biome);
        logger.info(`🌍 Generated new biome: ${biome.name} (Level ${unlockLevel})`);
        return biome;
    }
    
    /**
     * Generate biome resources
     */
    generateBiomeResources(level, theme) {
        const resourceCount = 5 + Math.floor(level / 10);
        const resources = [];
        
        for (let i = 0; i < resourceCount; i++) {
            resources.push({
                name: `${theme} Essence`,
                rarity: this.determineRarity(this.seededRandom(level + i)),
                value: 10 + level * 5
            });
        }
        
        return resources;
    }
    
    /**
     * Generate biome weather
     */
    generateBiomeWeather(theme) {
        const weatherMap = {
            'Volcanic': ['lava_eruption', 'ash_fall', 'heat_wave'],
            'Frozen': ['blizzard', 'snowfall', 'ice_storm'],
            'Desert': ['sandstorm', 'heat_wave', 'clear'],
            'Ocean': ['underwater', 'current_strong', 'rain'],
            'Sky': ['strong_winds', 'cloud_cover', 'clear'],
            'Shadow': ['darkness', 'void_storms', 'shadow_fog'],
            'Crystal': ['crystal_mist', 'clear', 'shimmer'],
            'Fungal': ['spore_clouds', 'fog', 'light_rain'],
            'Mechanical': ['oil_rain', 'spark_storm', 'clear'],
            'Ethereal': ['aurora', 'mist', 'shimmer']
        };
        
        return weatherMap[theme] || ['clear'];
    }
    
    /**
     * Generate procedural dungeon
     */
    generateDungeon(unlockLevel) {
        const seed = this.seededRandom(this.worldSeed + unlockLevel * 500);
        const themeIdx = Math.floor(seed * this.templates.dungeonThemes.length);
        
        const dungeon = {
            id: `dungeon_${unlockLevel}_${Date.now()}`,
            name: `${this.templates.dungeonThemes[themeIdx]} of Level ${unlockLevel}`,
            unlockLevel,
            difficulty: Math.floor(unlockLevel / 3) + 1,
            rooms: 5 + Math.floor(unlockLevel / 2),
            bossName: this.generateBossName(unlockLevel, seed),
            loot: this.generateDungeonLoot(unlockLevel),
            generatedAt: Date.now()
        };
        
        this.generatedContent.dungeons.set(dungeon.id, dungeon);
        logger.info(`🏰 Generated new dungeon: ${dungeon.name}`);
        return dungeon;
    }
    
    /**
     * Generate boss name
     */
    generateBossName(level, seed) {
        const titles = ['Lord', 'King', 'Queen', 'Emperor', 'Empress', 'Guardian', 'Destroyer', 'Keeper', 'Master', 'Overlord'];
        const names = ['Azrael', 'Malachai', 'Seraphina', 'Drakonis', 'Mortis', 'Infernus', 'Glacius', 'Tempest', 'Umbra', 'Aether'];
        
        const titleIdx = Math.floor(seed * titles.length);
        const nameIdx = Math.floor((seed * 13) % names.length);
        
        return `${titles[titleIdx]} ${names[nameIdx]} the Level ${level}`;
    }
    
    /**
     * Generate dungeon loot
     */
    generateDungeonLoot(level) {
        return {
            items: this.generateItems(3 + Math.floor(level / 5), Math.floor(level / 3)),
            gold: 500 + level * 100,
            experience: 1000 + level * 200
        };
    }
    
    /**
     * Generate procedural questline
     */
    generateQuestline(unlockLevel) {
        const seed = this.seededRandom(this.worldSeed + unlockLevel * 750);
        
        const questline = {
            id: `questline_${unlockLevel}_${Date.now()}`,
            name: `The ${this.generateQuestlineName(seed)} Chronicle`,
            unlockLevel,
            questCount: 5 + Math.floor(unlockLevel / 10),
            difficulty: Math.floor(unlockLevel / 10) + 1,
            rewards: this.generateQuestlineRewards(unlockLevel),
            generatedAt: Date.now()
        };
        
        this.generatedContent.quests.set(questline.id, questline);
        logger.info(`📜 Generated new questline: ${questline.name}`);
        return questline;
    }
    
    /**
     * Generate questline name
     */
    generateQuestlineName(seed) {
        const adjectives = ['Forgotten', 'Ancient', 'Lost', 'Hidden', 'Eternal', 'Divine', 'Cursed', 'Sacred', 'Mystical', 'Legendary'];
        const nouns = ['Prophecy', 'Legacy', 'Destiny', 'Covenant', 'Alliance', 'War', 'Revelation', 'Mystery', 'Secret', 'Truth'];
        
        const adjIdx = Math.floor(seed * adjectives.length);
        const nounIdx = Math.floor((seed * 17) % nouns.length);
        
        return `${adjectives[adjIdx]} ${nouns[nounIdx]}`;
    }
    
    /**
     * Generate questline rewards
     */
    generateQuestlineRewards(level) {
        return {
            items: this.generateItems(2, Math.floor(level / 5)),
            gold: 1000 + level * 200,
            experience: 2000 + level * 500,
            title: `The ${level} Hero`
        };
    }
    
    /**
     * Generate procedural game mode
     */
    generateGameMode(unlockLevel) {
        const modes = ['Survival', 'Time Attack', 'Boss Rush', 'Endless Waves', 'Puzzle Challenge', 'Stealth Mission', 'Tower Defense', 'Race Mode', 'Gauntlet', 'Arena'];
        const seed = this.seededRandom(this.worldSeed + unlockLevel * 2000);
        const modeIdx = Math.floor(seed * modes.length);
        
        const gameMode = {
            id: `mode_${unlockLevel}_${Date.now()}`,
            name: `${modes[modeIdx]} Mode`,
            unlockLevel,
            difficulty: Math.floor(unlockLevel / 20) + 1,
            description: `Special ${modes[modeIdx]} gameplay mode`,
            rewards: this.generateItems(5, Math.floor(unlockLevel / 10)),
            generatedAt: Date.now()
        };
        
        logger.info(`🎮 Generated new game mode: ${gameMode.name}`);
        return gameMode;
    }
    
    /**
     * Seeded random number generator
     */
    seededRandom(seed) {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    }
    
    /**
     * Get content for player level
     */
    getContentForLevel(level) {
        return {
            levels: Array.from(this.generatedContent.levels.values()).filter(l => l.number <= level),
            items: Array.from(this.generatedContent.items.values()).filter(i => i.requiredLevel <= level),
            biomes: Array.from(this.generatedContent.worlds.values()).filter(b => b.unlockLevel <= level),
            dungeons: Array.from(this.generatedContent.dungeons.values()).filter(d => d.unlockLevel <= level),
            quests: Array.from(this.generatedContent.quests.values()).filter(q => q.unlockLevel <= level)
        };
    }
    
    /**
     * Update system
     */
    update(deltaTime) {
        // Update play time
        this.progressMetrics.totalPlayTime += deltaTime;
        
        // Auto-generate content as needed
        const currentLevel = this.progressMetrics.playerLevel;
        const levelsAhead = 5; // Pre-generate 5 levels ahead
        
        for (let i = currentLevel; i <= currentLevel + levelsAhead; i++) {
            if (!this.generatedContent.levels.has(`level_${i}`)) {
                this.generateLevel(i);
            }
        }
    }
    
    /**
     * Get system statistics
     */
    getStatistics() {
        return {
            levels: this.generatedContent.levels.size,
            items: this.generatedContent.items.size,
            enemies: this.generatedContent.enemies.size,
            worlds: this.generatedContent.worlds.size,
            dungeons: this.generatedContent.dungeons.size,
            quests: this.generatedContent.quests.size,
            playerProgress: this.progressMetrics
        };
    }
}
