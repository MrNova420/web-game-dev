import { logger } from '../core/Logger.js';
/**
 * AscensionSystem.js
 * Phase 7 - Ascension System
 * Transcendence mechanics, deity-level powers, and planar ascension
 * ~400 lines
 */

export class AscensionSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // Ascension state
        this.ascensionLevel = 0;
        this.maxAscensionLevel = 10;
        this.divineEssence = 0;
        this.celestialFragments = 0;
        
        // Ascended abilities
        this.ascendedAbilities = new Set();
        this.learnedPerks = new Set(); // Perks that have been learned
        
        // Ascension tiers
        this.ascensionTiers = [
            { level: 1, name: 'Touched', requirement: 100, color: '#ffffff' },
            { level: 2, name: 'Empowered', requirement: 250, color: '#ffff00' },
            { level: 3, name: 'Enlightened', requirement: 500, color: '#00ffff' },
            { level: 4, name: 'Transcendent', requirement: 1000, color: '#ff00ff' },
            { level: 5, name: 'Demigod', requirement: 2500, color: '#ff8800' },
            { level: 6, name: 'Lesser Deity', requirement: 5000, color: '#8800ff' },
            { level: 7, name: 'Greater Deity', requirement: 10000, color: '#ff0088' },
            { level: 8, name: 'Primordial', requirement: 25000, color: '#00ff88' },
            { level: 9, name: 'Cosmic Entity', requirement: 50000, color: '#ff00ff' },
            { level: 10, name: 'Omnipotent', requirement: 100000, color: '#ffffff' }
        ];
        
        // Divine abilities database
        this.divineAbilities = this.createDivineAbilities();
        
        // Divine perks database
        this.divinePerksDatabase = this.createDivinePerks();
        
        // Planar realms
        this.unlockedPlanes = new Set(['material']);
        this.currentPlane = 'material';
    }
    
    /**
     * Create divine abilities
     */
    createDivineAbilities() {
        return {
            // Tier 1 - Touched
            divine_shield: {
                tier: 1,
                name: 'Divine Shield',
                description: 'Summon an impenetrable shield',
                cooldown: 60,
                cost: { divineEssence: 10 },
                effect: { shield: 1000, duration: 5 }
            },
            holy_smite: {
                tier: 1,
                name: 'Holy Smite',
                description: 'Call down divine judgment',
                cooldown: 30,
                cost: { divineEssence: 5 },
                effect: { damage: 500, element: 'holy', aoe: 5 }
            },
            
            // Tier 2 - Empowered
            divine_wrath: {
                tier: 2,
                name: 'Divine Wrath',
                description: 'Unleash devastating holy power',
                cooldown: 45,
                cost: { divineEssence: 15 },
                effect: { damage: 1500, element: 'holy', aoe: 10 }
            },
            blessing_of_gods: {
                tier: 2,
                name: 'Blessing of the Gods',
                description: 'Grant divine blessings to self and allies',
                cooldown: 90,
                cost: { divineEssence: 20 },
                effect: { allStats: 1.5, duration: 30 }
            },
            
            // Tier 3 - Enlightened
            reality_shift: {
                tier: 3,
                name: 'Reality Shift',
                description: 'Manipulate the fabric of reality',
                cooldown: 120,
                cost: { divineEssence: 30 },
                effect: { teleport: true, range: 'unlimited', invulnerable: 3 }
            },
            time_manipulation: {
                tier: 3,
                name: 'Time Manipulation',
                description: 'Control the flow of time',
                cooldown: 180,
                cost: { divineEssence: 50 },
                effect: { timeStop: true, duration: 10, selfTime: 2.0 }
            },
            
            // Tier 4 - Transcendent
            divine_ascension: {
                tier: 4,
                name: 'Divine Ascension',
                description: 'Temporarily achieve full divinity',
                cooldown: 300,
                cost: { divineEssence: 100, celestialFragments: 1 },
                effect: { allStats: 3.0, invulnerable: true, duration: 30 }
            },
            judgment_day: {
                tier: 4,
                name: 'Judgment Day',
                description: 'Rain destruction upon all enemies',
                cooldown: 240,
                cost: { divineEssence: 75 },
                effect: { damage: 10000, aoe: 'screen', multihit: 10 }
            },
            
            // Tier 5 - Demigod
            creation: {
                tier: 5,
                name: 'Creation',
                description: 'Create matter from nothing',
                cooldown: 600,
                cost: { divineEssence: 200, celestialFragments: 5 },
                effect: { createItems: true, legendary: true }
            },
            resurrection: {
                tier: 5,
                name: 'Resurrection',
                description: 'Return from death automatically',
                cooldown: 0,
                cost: { divineEssence: 0, celestialFragments: 10 },
                effect: { autoRevive: true, fullHeal: true },
                passive: true
            },
            
            // Tier 6+ - Deity abilities
            omniscience: {
                tier: 6,
                name: 'Omniscience',
                description: 'Know all secrets of the universe',
                cooldown: 0,
                cost: { divineEssence: 500 },
                effect: { seeAll: true, infiniteVision: true },
                passive: true
            },
            omnipresence: {
                tier: 7,
                name: 'Omnipresence',
                description: 'Exist everywhere simultaneously',
                cooldown: 0,
                cost: { divineEssence: 1000 },
                effect: { teleportAnywhere: true, instantTravel: true },
                passive: true
            },
            omnipotence: {
                tier: 10,
                name: 'Omnipotence',
                description: 'Achieve ultimate power',
                cooldown: 0,
                cost: { divineEssence: 10000, celestialFragments: 100 },
                effect: { infinitePower: true, invulnerable: true, infiniteResources: true },
                passive: true
            }
        };
    }
    
    /**
     * Create divine perks
     */
    createDivinePerks() {
        return {
            // Passive bonuses
            divine_vitality: {
                name: 'Divine Vitality',
                tier: 1,
                description: 'HP regenerates constantly',
                effect: { hpRegen: 10 }
            },
            celestial_armor: {
                name: 'Celestial Armor',
                tier: 1,
                description: 'Reduce all damage taken',
                effect: { damageReduction: 0.2 }
            },
            holy_strength: {
                name: 'Holy Strength',
                tier: 2,
                description: 'Permanently increased damage',
                effect: { damageBonus: 0.5 }
            },
            divine_speed: {
                name: 'Divine Speed',
                tier: 2,
                description: 'Move at supernatural speeds',
                effect: { speedBonus: 0.5 }
            },
            immortal_soul: {
                name: 'Immortal Soul',
                tier: 3,
                description: 'Cannot die from damage over time',
                effect: { dotImmune: true }
            },
            perfect_dodge: {
                name: 'Perfect Dodge',
                tier: 3,
                description: 'Greatly increased dodge chance',
                effect: { dodgeBonus: 0.3 }
            },
            infinite_mana: {
                name: 'Infinite Mana',
                tier: 4,
                description: 'Mana costs reduced to zero',
                effect: { manaCost: 0 }
            },
            eternal_life: {
                name: 'Eternal Life',
                tier: 5,
                description: 'Revive automatically once per day',
                effect: { autoReviveDaily: true }
            },
            cosmic_awareness: {
                name: 'Cosmic Awareness',
                tier: 6,
                description: 'See all enemies and items on map',
                effect: { fullMapVision: true }
            },
            reality_bender: {
                name: 'Reality Bender',
                tier: 7,
                description: 'Critical hits deal 10x damage',
                effect: { critMultiplier: 10.0 }
            },
            time_lord: {
                name: 'Time Lord',
                tier: 8,
                description: 'All cooldowns reduced by 90%',
                effect: { cooldownReduction: 0.9 }
            },
            god_mode: {
                name: 'God Mode',
                tier: 10,
                description: 'Take no damage from any source',
                effect: { invulnerable: true }
            }
        };
    }
    
    /**
     * Attempt to ascend
     */
    ascend() {
        if (this.ascensionLevel >= this.maxAscensionLevel) {
            logger.info('Already at maximum ascension level');
            return false;
        }
        
        const nextTier = this.ascensionTiers[this.ascensionLevel];
        if (!nextTier) return false;
        
        // Check requirement
        if (this.divineEssence < nextTier.requirement) {
            logger.info(`Need ${nextTier.requirement} Divine Essence (have ${this.divineEssence})`);
            return false;
        }
        
        // Consume essence
        this.divineEssence -= nextTier.requirement;
        
        // Ascend
        this.ascensionLevel++;
        
        // Apply ascension bonuses
        this.applyAscensionBonuses();
        
        // Unlock tier abilities
        this.unlockTierAbilities(this.ascensionLevel);
        
        // Visual effects
        this.triggerAscensionEffect(nextTier);
        
        logger.info(`Ascended to ${nextTier.name}!`);
        
        // Save progress
        this.saveAscension();
        
        return true;
    }
    
    /**
     * Apply bonuses for current ascension level
     */
    applyAscensionBonuses() {
        if (!this.gameEngine.player) return;
        
        const player = this.gameEngine.player;
        const level = this.ascensionLevel;
        
        // Each ascension level grants massive bonuses
        const multiplier = 1 + (level * 0.5); // +50% per level
        
        player.maxHP *= multiplier;
        player.hp = player.maxHP;
        player.baseDamage *= multiplier;
        player.defense *= multiplier;
        player.magicPower = (player.magicPower || 1.0) * multiplier;
        
        // Grant divine essence generation
        player.divineEssencePerKill = level * 2;
    }
    
    /**
     * Unlock abilities for tier
     */
    unlockTierAbilities(tier) {
        for (const [abilityId, ability] of Object.entries(this.divineAbilities)) {
            if (ability.tier === tier) {
                this.ascendedAbilities.add(abilityId);
                logger.info(`Unlocked: ${ability.name}`);
            }
        }
    }
    
    /**
     * Learn divine perk
     */
    learnPerk(perkId) {
        const perk = this.divinePerksDatabase[perkId];
        if (!perk) return false;
        
        // Check tier requirement
        if (perk.tier > this.ascensionLevel) {
            logger.info(`Requires Ascension Level ${perk.tier}`);
            return false;
        }
        
        // Check cost
        const cost = perk.tier * 100;
        if (this.celestialFragments < cost) {
            logger.info(`Need ${cost} Celestial Fragments`);
            return false;
        }
        
        // Learn perk
        this.celestialFragments -= cost;
        this.learnedPerks.add(perkId);
        
        // Apply perk effects
        this.applyPerkEffect(perk);
        
        logger.info(`Learned: ${perk.name}`);
        return true;
    }
    
    /**
     * Apply perk effect to player
     */
    applyPerkEffect(perk) {
        if (!this.gameEngine.player) return;
        
        const player = this.gameEngine.player;
        const effect = perk.effect;
        
        if (effect.hpRegen) {
            player.hpRegenRate = (player.hpRegenRate || 0) + effect.hpRegen;
        }
        if (effect.damageReduction) {
            player.damageReduction = (player.damageReduction || 0) + effect.damageReduction;
        }
        if (effect.damageBonus) {
            player.baseDamage *= (1 + effect.damageBonus);
        }
        if (effect.speedBonus) {
            player.moveSpeed *= (1 + effect.speedBonus);
        }
        if (effect.dotImmune) {
            player.immuneToDOT = true;
        }
        if (effect.dodgeBonus) {
            player.dodgeChance = (player.dodgeChance || 0) + effect.dodgeBonus;
        }
        if (effect.manaCost !== undefined) {
            player.manaCostMultiplier = effect.manaCost;
        }
        if (effect.autoReviveDaily) {
            player.hasAutoRevive = true;
        }
        if (effect.fullMapVision) {
            player.fullMapVision = true;
        }
        if (effect.critMultiplier) {
            player.critMultiplier = effect.critMultiplier;
        }
        if (effect.cooldownReduction) {
            player.cooldownMultiplier = 1 - effect.cooldownReduction;
        }
        if (effect.invulnerable) {
            player.isInvulnerable = true;
        }
    }
    
    /**
     * Use divine ability
     */
    useDivineAbility(abilityId) {
        if (!this.ascendedAbilities.has(abilityId)) {
            logger.info('Ability not unlocked');
            return false;
        }
        
        const ability = this.divineAbilities[abilityId];
        if (!ability) return false;
        
        // Check cooldown
        if (this.isOnCooldown(abilityId)) {
            logger.info('Ability on cooldown');
            return false;
        }
        
        // Check cost
        if (ability.cost) {
            if (ability.cost.divineEssence && this.divineEssence < ability.cost.divineEssence) {
                logger.info('Not enough Divine Essence');
                return false;
            }
            if (ability.cost.celestialFragments && this.celestialFragments < ability.cost.celestialFragments) {
                logger.info('Not enough Celestial Fragments');
                return false;
            }
        }
        
        // Use ability
        if (ability.cost) {
            if (ability.cost.divineEssence) {
                this.divineEssence -= ability.cost.divineEssence;
            }
            if (ability.cost.celestialFragments) {
                this.celestialFragments -= ability.cost.celestialFragments;
            }
        }
        
        // Apply effect
        this.applyAbilityEffect(ability);
        
        // Set cooldown (unless passive)
        if (!ability.passive) {
            this.setCooldown(abilityId, ability.cooldown);
        }
        
        logger.info(`Used: ${ability.name}`);
        return true;
    }
    
    /**
     * Apply divine ability effect
     */
    applyAbilityEffect(ability) {
        const effect = ability.effect;
        
        // Implement ability effects here
        if (effect.shield) {
            this.applyShield(effect.shield, effect.duration);
        }
        if (effect.damage) {
            this.dealDivineDamage(effect.damage, effect.element, effect.aoe);
        }
        if (effect.allStats) {
            this.applyStatBuff(effect.allStats, effect.duration);
        }
        if (effect.timeStop) {
            this.activateTimeStop(effect.duration);
        }
        if (effect.invulnerable) {
            this.activateInvulnerability(effect.duration || true);
        }
        if (effect.createItems) {
            this.createLegendaryItems();
        }
        if (effect.autoRevive) {
            this.grantAutoRevive();
        }
    }
    
    /**
     * Add divine essence
     */
    addDivineEssence(amount) {
        this.divineEssence += amount;
    }
    
    /**
     * Add celestial fragments
     */
    addCelestialFragments(amount) {
        this.celestialFragments += amount;
    }
    
    /**
     * Unlock planar realm
     */
    unlockPlane(planeId) {
        this.unlockedPlanes.add(planeId);
        logger.info(`Unlocked plane: ${planeId}`);
    }
    
    /**
     * Travel to plane
     */
    travelToPlane(planeId) {
        if (!this.unlockedPlanes.has(planeId)) {
            logger.info('Plane not unlocked');
            return false;
        }
        
        this.currentPlane = planeId;
        logger.info(`Traveled to: ${planeId}`);
        
        // Trigger plane transition
        if (this.gameEngine.worldSystem) {
            this.gameEngine.worldSystem.changePlane(planeId);
        }
        
        return true;
    }
    
    /**
     * Get ascension status
     */
    getAscensionStatus() {
        const currentTier = this.ascensionTiers[this.ascensionLevel - 1];
        const nextTier = this.ascensionTiers[this.ascensionLevel];
        
        return {
            level: this.ascensionLevel,
            currentTier: currentTier,
            nextTier: nextTier,
            divineEssence: this.divineEssence,
            celestialFragments: this.celestialFragments,
            unlockedAbilities: Array.from(this.ascendedAbilities),
            learnedPerks: Array.from(this.learnedPerks),
            unlockedPlanes: Array.from(this.unlockedPlanes),
            currentPlane: this.currentPlane
        };
    }
    
    /**
     * Trigger ascension visual effect
     */
    triggerAscensionEffect(tier) {
        if (this.gameEngine.particleSystem) {
            this.gameEngine.particleSystem.createAscensionEffect(tier.color);
        }
        if (this.gameEngine.audioSystem) {
            this.gameEngine.audioSystem.playSound('ascension');
        }
    }
    
    /**
     * Helper methods for ability effects
     */
    applyShield(amount, duration) {
        if (this.gameEngine.player) {
            this.gameEngine.player.shield = amount;
            this.gameEngine.player.shieldDuration = duration;
        }
    }
    
    dealDivineDamage(damage, element, aoe) {
        // Deal damage to all enemies in range
        if (this.gameEngine.enemyManager) {
            this.gameEngine.enemyManager.dealAOEDamage(damage, aoe, element);
        }
    }
    
    applyStatBuff(multiplier, duration) {
        if (this.gameEngine.player) {
            this.gameEngine.player.tempStatMultiplier = multiplier;
            this.gameEngine.player.buffDuration = duration;
        }
    }
    
    activateTimeStop(duration) {
        if (this.gameEngine) {
            this.gameEngine.timeScale = 0.01; // Almost frozen
            setTimeout(() => {
                this.gameEngine.timeScale = 1.0;
            }, duration * 1000);
        }
    }
    
    activateInvulnerability(duration) {
        if (this.gameEngine.player) {
            this.gameEngine.player.isInvulnerable = true;
            if (typeof duration === 'number') {
                setTimeout(() => {
                    this.gameEngine.player.isInvulnerable = false;
                }, duration * 1000);
            }
        }
    }
    
    createLegendaryItems() {
        if (this.gameEngine.inventorySystem) {
            // Create random legendary items
            this.gameEngine.inventorySystem.addLegendaryItem();
        }
    }
    
    grantAutoRevive() {
        if (this.gameEngine.player) {
            this.gameEngine.player.autoRevive = true;
        }
    }
    
    /**
     * Cooldown management
     */
    isOnCooldown(abilityId) {
        if (!this.abilityCooldowns) {
            this.abilityCooldowns = new Map();
        }
        const cooldownEnd = this.abilityCooldowns.get(abilityId);
        if (!cooldownEnd) return false;
        return Date.now() < cooldownEnd;
    }
    
    setCooldown(abilityId, duration) {
        if (!this.abilityCooldowns) {
            this.abilityCooldowns = new Map();
        }
        this.abilityCooldowns.set(abilityId, Date.now() + (duration * 1000));
    }
    
    /**
     * Save ascension progress
     */
    saveAscension() {
        const data = {
            ascensionLevel: this.ascensionLevel,
            divineEssence: this.divineEssence,
            celestialFragments: this.celestialFragments,
            ascendedAbilities: Array.from(this.ascendedAbilities),
            learnedPerks: Array.from(this.learnedPerks),
            unlockedPlanes: Array.from(this.unlockedPlanes)
        };
        
        localStorage.setItem('ascension_data', JSON.stringify(data));
    }
    
    /**
     * Load ascension progress
     */
    loadAscension() {
        const saved = localStorage.getItem('ascension_data');
        if (!saved) return;
        
        try {
            const data = JSON.parse(saved);
            this.ascensionLevel = data.ascensionLevel || 0;
            this.divineEssence = data.divineEssence || 0;
            this.celestialFragments = data.celestialFragments || 0;
            this.ascendedAbilities = new Set(data.ascendedAbilities || []);
            this.learnedPerks = new Set(data.learnedPerks || []);
            this.unlockedPlanes = new Set(data.unlockedPlanes || ['material']);
        } catch (error) {
            logger.error('Failed to load ascension data:', error);
        }
    }
}
