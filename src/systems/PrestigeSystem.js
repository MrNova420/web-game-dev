import { logger } from '../core/Logger.js';
/**
 * PrestigeSystem.js
 * Handles prestige/ascension mechanics with cosmic powers and permanent upgrades
 * Part of Phase 7: Advanced Progression
 * Cannabis theme: "Enlightenment" - transcending to higher planes
 */

export class PrestigeSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // Prestige data
        this.prestigeLevel = 0;
        this.astralEssence = 0; // Cosmic currency earned on prestige
        this.totalPrestiges = 0;
        
        // Prestige requirements
        this.prestigeRequirements = {
            minLevel: 50,
            minFloor: 100
        };
        
        // Permanent upgrades
        this.permanentUpgrades = this.initializePermanentUpgrades();
        this.purchasedUpgrades = new Map();
        
        // Ascension skills (prestige-only abilities)
        this.ascensionSkills = this.initializeAscensionSkills();
        this.unlockedSkills = new Set();
        
        // Prestige bonuses
        this.prestigeBonuses = this.calculatePrestigeBonuses();
        
        // Prestige zones (special dungeons)
        this.prestigeZones = this.initializePrestigeZones();
        this.unlockedZones = new Set();
        
        // Prestige cosmetics
        this.prestigeCosmetics = this.initializePrestigeCosmetics();
        this.unlockedCosmetics = new Set();
    }
    
    /**
     * Initialize permanent upgrades
     */
    initializePermanentUpgrades() {
        return {
            // Starting bonuses
            starting_gold: {
                name: 'Starter Wealth',
                description: 'Start new runs with bonus gold',
                maxLevel: 20,
                cost: (level) => 10 * Math.pow(2, level),
                bonus: (level) => level * 1000
            },
            starting_level: {
                name: 'Experience of Ages',
                description: 'Start at higher level',
                maxLevel: 10,
                cost: (level) => 50 * Math.pow(2, level),
                bonus: (level) => level * 5
            },
            starting_gear: {
                name: 'Ancient Arsenal',
                description: 'Start with better equipment',
                maxLevel: 5,
                cost: (level) => 100 * Math.pow(2, level),
                bonus: (level) => ['common', 'uncommon', 'rare', 'epic', 'legendary'][Math.min(level, 4)]
            },
            
            // Stat bonuses
            cosmic_power: {
                name: 'Cosmic Power',
                description: 'Permanent attack bonus',
                maxLevel: 50,
                cost: (level) => 5 * level,
                bonus: (level) => level * 2
            },
            cosmic_defense: {
                name: 'Cosmic Shield',
                description: 'Permanent defense bonus',
                maxLevel: 50,
                cost: (level) => 5 * level,
                bonus: (level) => level * 2
            },
            cosmic_vitality: {
                name: 'Cosmic Vitality',
                description: 'Permanent HP bonus',
                maxLevel: 50,
                cost: (level) => 5 * level,
                bonus: (level) => level * 10
            },
            
            // Resource bonuses
            essence_magnet: {
                name: 'Essence Magnet',
                description: 'Increased XP gain',
                maxLevel: 10,
                cost: (level) => 20 * level,
                bonus: (level) => level * 0.05 // 5% per level
            },
            loot_fortune: {
                name: "Fortune's Blessing",
                description: 'Increased loot drop rate',
                maxLevel: 10,
                cost: (level) => 30 * level,
                bonus: (level) => level * 0.03 // 3% per level
            },
            gold_multiplier: {
                name: 'Midas Touch',
                description: 'Gold drops multiplier',
                maxLevel: 10,
                cost: (level) => 25 * level,
                bonus: (level) => 1 + (level * 0.1) // +10% per level
            },
            
            // Gameplay bonuses
            extra_lives: {
                name: 'Phoenix Soul',
                description: 'Extra lives per run',
                maxLevel: 3,
                cost: (level) => 200 * Math.pow(2, level),
                bonus: (level) => level
            },
            skill_points: {
                name: 'Knowledge Keeper',
                description: 'Bonus skill points on start',
                maxLevel: 10,
                cost: (level) => 30 * level,
                bonus: (level) => level * 5
            },
            inventory_space: {
                name: 'Dimensional Pockets',
                description: 'Permanent inventory expansion',
                maxLevel: 20,
                cost: (level) => 10 * level,
                bonus: (level) => level * 5
            }
        };
    }
    
    /**
     * Initialize ascension skills
     */
    initializeAscensionSkills() {
        return {
            // Tier 1 (Prestige 1+)
            ethereal_step: {
                name: 'Ethereal Step',
                description: 'Dash leaves afterimage that damages enemies',
                tier: 1,
                prestigeRequired: 1,
                cost: 50,
                cooldown: 8000,
                damage: 100
            },
            astral_shield: {
                name: 'Astral Shield',
                description: 'Absorb next 3 hits completely',
                tier: 1,
                prestigeRequired: 1,
                cost: 75,
                cooldown: 30000,
                charges: 3
            },
            void_blast: {
                name: 'Void Blast',
                description: 'AOE that ignores armor',
                tier: 1,
                prestigeRequired: 1,
                cost: 60,
                cooldown: 12000,
                damage: 200,
                radius: 10
            },
            
            // Tier 2 (Prestige 5+)
            time_dilation: {
                name: 'Time Dilation',
                description: 'Slow all enemies for 10 seconds',
                tier: 2,
                prestigeRequired: 5,
                cost: 150,
                cooldown: 45000,
                duration: 10000,
                slowAmount: 0.5
            },
            dimension_shift: {
                name: 'Dimension Shift',
                description: 'Become invulnerable for 5 seconds',
                tier: 2,
                prestigeRequired: 5,
                cost: 200,
                cooldown: 60000,
                duration: 5000
            },
            cosmic_storm: {
                name: 'Cosmic Storm',
                description: 'Rain meteors across entire floor',
                tier: 2,
                prestigeRequired: 5,
                cost: 175,
                cooldown: 40000,
                duration: 8000,
                meteorsPerSecond: 3
            },
            
            // Tier 3 (Prestige 10+)
            reality_break: {
                name: 'Reality Break',
                description: 'Stop time and deal massive damage',
                tier: 3,
                prestigeRequired: 10,
                cost: 300,
                cooldown: 90000,
                duration: 3000,
                damageMultiplier: 10
            },
            ascended_form: {
                name: 'Ascended Form',
                description: 'Transform into cosmic entity for 15 seconds',
                tier: 3,
                prestigeRequired: 10,
                cost: 350,
                cooldown: 120000,
                duration: 15000,
                statMultiplier: 3
            },
            singularity: {
                name: 'Singularity',
                description: 'Pull all enemies to point and crush',
                tier: 3,
                prestigeRequired: 10,
                cost: 400,
                cooldown: 100000,
                damage: 1000,
                pullRadius: 50
            }
        };
    }
    
    /**
     * Initialize prestige zones
     */
    initializePrestigeZones() {
        return {
            cosmic_greenhouse: {
                name: 'The Cosmic Greenhouse',
                description: 'Floating grow operation in space',
                prestigeRequired: 1,
                minFloor: 1,
                maxFloor: 50,
                biome: 'space',
                rewards: 'Double material drops'
            },
            astral_temple: {
                name: 'Astral Temple',
                description: 'Ancient temple in the void',
                prestigeRequired: 3,
                minFloor: 25,
                maxFloor: 75,
                biome: 'void',
                rewards: 'Unique legendary drops'
            },
            dimension_rift: {
                name: 'Dimension Rift',
                description: 'Unstable reality between worlds',
                prestigeRequired: 5,
                minFloor: 50,
                maxFloor: 100,
                biome: 'rift',
                rewards: 'Triple XP and gold'
            },
            higher_plane: {
                name: 'The Higher Plane',
                description: 'Realm of pure consciousness',
                prestigeRequired: 10,
                minFloor: 100,
                maxFloor: 999,
                biome: 'transcendent',
                rewards: 'Exclusive prestige gear'
            }
        };
    }
    
    /**
     * Initialize prestige cosmetics
     */
    initializePrestigeCosmetics() {
        return {
            // Auras
            aura_cosmic: { name: 'Cosmic Aura', type: 'aura', prestigeRequired: 1, color: 0x00ffff },
            aura_astral: { name: 'Astral Aura', type: 'aura', prestigeRequired: 5, color: 0xff00ff },
            aura_void: { name: 'Void Aura', type: 'aura', prestigeRequired: 10, color: 0x9900ff },
            aura_transcendent: { name: 'Transcendent Aura', type: 'aura', prestigeRequired: 25, color: 0xffd700 },
            
            // Trails
            trail_stardust: { name: 'Stardust Trail', type: 'trail', prestigeRequired: 1 },
            trail_nebula: { name: 'Nebula Trail', type: 'trail', prestigeRequired: 5 },
            trail_galaxy: { name: 'Galaxy Trail', type: 'trail', prestigeRequired: 10 },
            
            // Titles
            title_enlightened: { name: 'The Enlightened', type: 'title', prestigeRequired: 1 },
            title_ascended: { name: 'Ascended Master', type: 'title', prestigeRequired: 5 },
            title_cosmic: { name: 'Cosmic Entity', type: 'title', prestigeRequired: 10 },
            title_transcendent: { name: 'Transcendent One', type: 'title', prestigeRequired: 25 },
            
            // Weapon effects
            weapon_cosmic_glow: { name: 'Cosmic Weapon Glow', type: 'weapon', prestigeRequired: 3 },
            weapon_astral_flames: { name: 'Astral Flames', type: 'weapon', prestigeRequired: 7 },
            weapon_void_energy: { name: 'Void Energy', type: 'weapon', prestigeRequired: 15 }
        };
    }
    
    /**
     * Check if player can prestige
     */
    canPrestige() {
        const player = this.gameEngine.player;
        const endlessMode = this.gameEngine.endlessMode;
        
        if (!player || !endlessMode) return false;
        
        const levelCheck = player.level >= this.prestigeRequirements.minLevel;
        const floorCheck = endlessMode.currentFloor >= this.prestigeRequirements.minFloor;
        
        return levelCheck && floorCheck;
    }
    
    /**
     * Calculate prestige rewards
     */
    calculatePrestigeRewards() {
        const player = this.gameEngine.player;
        const endlessMode = this.gameEngine.endlessMode;
        
        if (!player || !endlessMode) return 0;
        
        // Base essence from level and floor
        let essence = 0;
        essence += Math.floor(player.level * 2);
        essence += Math.floor(endlessMode.currentFloor * 1.5);
        
        // Bonus from achievements
        if (this.gameEngine.achievementSystem) {
            const completed = this.gameEngine.achievementSystem.getCompletedCount();
            essence += Math.floor(completed * 0.5);
        }
        
        // Bonus from collections
        if (this.gameEngine.petSystem) {
            essence += Math.floor(this.gameEngine.petSystem.ownedPets.size * 2);
        }
        
        // Previous prestige multiplier
        const prestigeBonus = 1 + (this.prestigeLevel * 0.1);
        essence = Math.floor(essence * prestigeBonus);
        
        return essence;
    }
    
    /**
     * Perform prestige
     */
    prestige() {
        if (!this.canPrestige()) {
            return { success: false, reason: 'Requirements not met' };
        }
        
        const essence = this.calculatePrestigeRewards();
        
        // Add essence
        this.astralEssence += essence;
        this.prestigeLevel++;
        this.totalPrestiges++;
        
        // Recalculate bonuses
        this.prestigeBonuses = this.calculatePrestigeBonuses();
        
        // Unlock new content
        this.checkUnlocks();
        
        // Reset run (will be handled by game engine)
        logger.info(`✨ Ascended to Prestige ${this.prestigeLevel}! Gained ${essence} Astral Essence!`);
        
        return {
            success: true,
            essence,
            prestigeLevel: this.prestigeLevel,
            newUnlocks: this.getNewUnlocks()
        };
    }
    
    /**
     * Check and unlock new content
     */
    checkUnlocks() {
        // Unlock ascension skills
        for (const [skillId, skill] of Object.entries(this.ascensionSkills)) {
            if (this.prestigeLevel >= skill.prestigeRequired && !this.unlockedSkills.has(skillId)) {
                this.unlockedSkills.add(skillId);
                logger.info(`🌟 Unlocked ascension skill: ${skill.name}!`);
            }
        }
        
        // Unlock prestige zones
        for (const [zoneId, zone] of Object.entries(this.prestigeZones)) {
            if (this.prestigeLevel >= zone.prestigeRequired && !this.unlockedZones.has(zoneId)) {
                this.unlockedZones.add(zoneId);
                logger.info(`🚪 Unlocked prestige zone: ${zone.name}!`);
            }
        }
        
        // Unlock cosmetics
        for (const [cosmeticId, cosmetic] of Object.entries(this.prestigeCosmetics)) {
            if (this.prestigeLevel >= cosmetic.prestigeRequired && !this.unlockedCosmetics.has(cosmeticId)) {
                this.unlockedCosmetics.add(cosmeticId);
                logger.info(`✨ Unlocked cosmetic: ${cosmetic.name}!`);
            }
        }
    }
    
    /**
     * Get newly unlocked content
     */
    getNewUnlocks() {
        const unlocks = {
            skills: [],
            zones: [],
            cosmetics: []
        };
        
        for (const [skillId, skill] of Object.entries(this.ascensionSkills)) {
            if (this.prestigeLevel === skill.prestigeRequired) {
                unlocks.skills.push(skill.name);
            }
        }
        
        for (const [zoneId, zone] of Object.entries(this.prestigeZones)) {
            if (this.prestigeLevel === zone.prestigeRequired) {
                unlocks.zones.push(zone.name);
            }
        }
        
        for (const [cosmeticId, cosmetic] of Object.entries(this.prestigeCosmetics)) {
            if (this.prestigeLevel === cosmetic.prestigeRequired) {
                unlocks.cosmetics.push(cosmetic.name);
            }
        }
        
        return unlocks;
    }
    
    /**
     * Purchase permanent upgrade
     */
    purchaseUpgrade(upgradeId) {
        const upgrade = this.permanentUpgrades[upgradeId];
        
        if (!upgrade) {
            return { success: false, reason: 'Upgrade not found' };
        }
        
        const currentLevel = this.purchasedUpgrades.get(upgradeId) || 0;
        
        if (currentLevel >= upgrade.maxLevel) {
            return { success: false, reason: 'Max level reached' };
        }
        
        const cost = upgrade.cost(currentLevel);
        
        if (this.astralEssence < cost) {
            return { success: false, reason: 'Not enough Astral Essence' };
        }
        
        // Purchase
        this.astralEssence -= cost;
        this.purchasedUpgrades.set(upgradeId, currentLevel + 1);
        
        // Recalculate bonuses
        this.prestigeBonuses = this.calculatePrestigeBonuses();
        
        logger.info(`⭐ Purchased ${upgrade.name} Level ${currentLevel + 1}!`);
        
        return {
            success: true,
            level: currentLevel + 1,
            bonus: upgrade.bonus(currentLevel + 1)
        };
    }
    
    /**
     * Unlock ascension skill
     */
    unlockAscensionSkill(skillId) {
        const skill = this.ascensionSkills[skillId];
        
        if (!skill) {
            return { success: false, reason: 'Skill not found' };
        }
        
        if (this.prestigeLevel < skill.prestigeRequired) {
            return { success: false, reason: `Prestige ${skill.prestigeRequired} required` };
        }
        
        if (this.unlockedSkills.has(skillId)) {
            return { success: false, reason: 'Skill already unlocked' };
        }
        
        if (this.astralEssence < skill.cost) {
            return { success: false, reason: 'Not enough Astral Essence' };
        }
        
        // Unlock
        this.astralEssence -= skill.cost;
        this.unlockedSkills.add(skillId);
        
        logger.info(`🌟 Unlocked ${skill.name}!`);
        
        return { success: true, skill };
    }
    
    /**
     * Calculate all prestige bonuses
     */
    calculatePrestigeBonuses() {
        const bonuses = {
            // Stat bonuses
            attack: 0,
            defense: 0,
            hp: 0,
            
            // Resource bonuses
            xpMultiplier: 1.0,
            lootMultiplier: 1.0,
            goldMultiplier: 1.0,
            
            // Starting bonuses
            startingGold: 0,
            startingLevel: 0,
            startingGearRarity: 'common',
            
            // Gameplay bonuses
            extraLives: 0,
            bonusSkillPoints: 0,
            inventorySpace: 0
        };
        
        // Apply purchased upgrades
        for (const [upgradeId, level] of this.purchasedUpgrades.entries()) {
            const upgrade = this.permanentUpgrades[upgradeId];
            const bonus = upgrade.bonus(level);
            
            switch (upgradeId) {
                case 'cosmic_power':
                    bonuses.attack += bonus;
                    break;
                case 'cosmic_defense':
                    bonuses.defense += bonus;
                    break;
                case 'cosmic_vitality':
                    bonuses.hp += bonus;
                    break;
                case 'essence_magnet':
                    bonuses.xpMultiplier += bonus;
                    break;
                case 'loot_fortune':
                    bonuses.lootMultiplier += bonus;
                    break;
                case 'gold_multiplier':
                    bonuses.goldMultiplier = bonus;
                    break;
                case 'starting_gold':
                    bonuses.startingGold = bonus;
                    break;
                case 'starting_level':
                    bonuses.startingLevel = bonus;
                    break;
                case 'starting_gear':
                    bonuses.startingGearRarity = bonus;
                    break;
                case 'extra_lives':
                    bonuses.extraLives = bonus;
                    break;
                case 'skill_points':
                    bonuses.bonusSkillPoints = bonus;
                    break;
                case 'inventory_space':
                    bonuses.inventorySpace = bonus;
                    break;
            }
        }
        
        // Base prestige bonuses (per prestige level)
        bonuses.attack += this.prestigeLevel * 5;
        bonuses.defense += this.prestigeLevel * 5;
        bonuses.hp += this.prestigeLevel * 25;
        bonuses.xpMultiplier += this.prestigeLevel * 0.02; // 2% per prestige
        
        return bonuses;
    }
    
    /**
     * Apply prestige bonuses to player
     */
    applyPrestigeBonuses(player) {
        if (!player) return;
        
        const bonuses = this.prestigeBonuses;
        
        // Apply stat bonuses
        player.stats.attack += bonuses.attack;
        player.stats.defense += bonuses.defense;
        player.stats.maxHp += bonuses.hp;
        player.stats.hp = player.stats.maxHp;
        
        // Store multipliers for other systems to read
        player.prestigeMultipliers = {
            xp: bonuses.xpMultiplier,
            loot: bonuses.lootMultiplier,
            gold: bonuses.goldMultiplier
        };
    }
    
    /**
     * Apply starting bonuses on new run
     */
    applyStartingBonuses(player) {
        if (!player) return;
        
        const bonuses = this.prestigeBonuses;
        
        // Starting gold
        if (bonuses.startingGold > 0 && this.gameEngine.economySystem) {
            this.gameEngine.economySystem.addCurrency('gold', bonuses.startingGold);
        }
        
        // Starting level
        if (bonuses.startingLevel > 0) {
            for (let i = 0; i < bonuses.startingLevel; i++) {
                player.levelUp();
            }
        }
        
        // Extra lives
        if (bonuses.extraLives > 0) {
            player.lives = (player.lives || 1) + bonuses.extraLives;
        }
        
        // Skill points
        if (bonuses.bonusSkillPoints > 0 && this.gameEngine.skillTreeSystem) {
            this.gameEngine.skillTreeSystem.skillPoints += bonuses.bonusSkillPoints;
        }
        
        // Starting gear would be handled by inventory system
        logger.info(`✨ Applied prestige bonuses: +${bonuses.startingLevel} levels, ${bonuses.startingGold} gold, ${bonuses.extraLives} lives`);
    }
    
    /**
     * Get prestige info
     */
    getPrestigeInfo() {
        return {
            level: this.prestigeLevel,
            essence: this.astralEssence,
            totalPrestiges: this.totalPrestiges,
            canPrestige: this.canPrestige(),
            nextReward: this.calculatePrestigeRewards(),
            bonuses: this.prestigeBonuses,
            unlockedSkills: Array.from(this.unlockedSkills),
            unlockedZones: Array.from(this.unlockedZones),
            unlockedCosmetics: Array.from(this.unlockedCosmetics)
        };
    }
    
    /**
     * Save system state
     */
    save() {
        return {
            prestigeLevel: this.prestigeLevel,
            astralEssence: this.astralEssence,
            totalPrestiges: this.totalPrestiges,
            purchasedUpgrades: Array.from(this.purchasedUpgrades.entries()),
            unlockedSkills: Array.from(this.unlockedSkills),
            unlockedZones: Array.from(this.unlockedZones),
            unlockedCosmetics: Array.from(this.unlockedCosmetics)
        };
    }
    
    /**
     * Load system state
     */
    load(data) {
        if (!data) return;
        
        if (data.prestigeLevel !== undefined) {
            this.prestigeLevel = data.prestigeLevel;
        }
        
        if (data.astralEssence !== undefined) {
            this.astralEssence = data.astralEssence;
        }
        
        if (data.totalPrestiges !== undefined) {
            this.totalPrestiges = data.totalPrestiges;
        }
        
        if (data.purchasedUpgrades) {
            this.purchasedUpgrades = new Map(data.purchasedUpgrades);
        }
        
        if (data.unlockedSkills) {
            this.unlockedSkills = new Set(data.unlockedSkills);
        }
        
        if (data.unlockedZones) {
            this.unlockedZones = new Set(data.unlockedZones);
        }
        
        if (data.unlockedCosmetics) {
            this.unlockedCosmetics = new Set(data.unlockedCosmetics);
        }
        
        // Recalculate bonuses
        this.prestigeBonuses = this.calculatePrestigeBonuses();
    }
    
    /**
     * Update system (called each frame)
     */
    update(deltaTime) {
        // Prestige system is mostly event-driven
        // Could add passive effects here if needed
    }
}
