import { logger } from '../core/Logger.js';
/**
 * Attribute System - Phase 3 RPG Core
 * Manages character attributes, stat points, and stat distribution
 * Features vibrant anime-styled UI elements using external Kenney UI assets
 */

export class AttributeSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // Core attributes with anime color themes
        this.attributes = this.initializeAttributes();
        
        // Player attribute points
        this.playerAttributes = {};
        this.availablePoints = 0;
        this.usedPoints = 0;
        
        // Attribute bonuses and effects
        this.attributeBonuses = {};
        
        // Level-up rewards
        this.pointsPerLevel = 5;
        this.bonusPointsPerPrestige = 10;
        
        this.init();
    }
    
    init() {
        logger.info('📊 Initializing Attribute System...');
        
        // Initialize player attributes
        Object.keys(this.attributes).forEach(attrId => {
            this.playerAttributes[attrId] = {
                base: 10, // Starting value
                bonus: 0, // From equipment/buffs
                total: 10
            };
        });
        
        this.calculateAllBonuses();
        
        logger.info('✅ Attribute System initialized with', Object.keys(this.attributes).length, 'attributes');
    }
    
    /**
     * Initialize all character attributes with vibrant anime colors
     */
    initializeAttributes() {
        return {
            STRENGTH: {
                name: 'Strength',
                shortName: 'STR',
                description: 'Increases physical damage and carrying capacity',
                color: '#FF0066', // Bright red-pink
                icon: 'strength_icon', // External Kenney asset
                bonuses: {
                    physicalDamage: 2, // +2% per point
                    carryWeight: 5, // +5 per point
                    critDamage: 0.5 // +0.5% per point
                },
                milestones: {
                    25: { bonus: 'Heavy Lifter', description: '+50 carry weight' },
                    50: { bonus: 'Powerhouse', description: '+10% physical damage' },
                    75: { bonus: 'Titan\'s Grip', description: 'Dual wield two-handed weapons' },
                    100: { bonus: 'Unstoppable Force', description: '+25% crit damage' }
                }
            },
            
            DEXTERITY: {
                name: 'Dexterity',
                shortName: 'DEX',
                description: 'Increases attack speed, crit chance, and dodge',
                color: '#00FFFF', // Bright cyan
                icon: 'dexterity_icon',
                bonuses: {
                    attackSpeed: 1, // +1% per point
                    critChance: 0.5, // +0.5% per point
                    dodgeChance: 0.5, // +0.5% per point
                    accuracy: 1 // +1% per point
                },
                milestones: {
                    25: { bonus: 'Swift Strikes', description: '+15% attack speed' },
                    50: { bonus: 'Precision', description: '+10% crit chance' },
                    75: { bonus: 'Evasive Master', description: '+20% dodge chance' },
                    100: { bonus: 'Lightning Reflexes', description: 'Double dodge chance' }
                }
            },
            
            INTELLIGENCE: {
                name: 'Intelligence',
                shortName: 'INT',
                description: 'Increases magic damage, mana pool, and spell effects',
                color: '#9900FF', // Bright purple
                icon: 'intelligence_icon',
                bonuses: {
                    magicDamage: 2, // +2% per point
                    maxMana: 5, // +5 per point
                    spellCritChance: 0.5, // +0.5% per point
                    elementalDamage: 1 // +1% per point
                },
                milestones: {
                    25: { bonus: 'Scholar', description: '+100 max mana' },
                    50: { bonus: 'Arcane Master', description: '+15% magic damage' },
                    75: { bonus: 'Spellweaver', description: 'Cast 2 spells simultaneously' },
                    100: { bonus: 'Archmage', description: '+50% spell crit damage' }
                }
            },
            
            VITALITY: {
                name: 'Vitality',
                shortName: 'VIT',
                description: 'Increases health, health regen, and physical resistance',
                color: '#00FF00', // Bright green
                icon: 'vitality_icon',
                bonuses: {
                    maxHealth: 10, // +10 per point
                    healthRegen: 0.5, // +0.5 per second per point
                    physicalResistance: 0.5, // +0.5% per point
                    poisonResistance: 1 // +1% per point
                },
                milestones: {
                    25: { bonus: 'Tough Skin', description: '+250 max health' },
                    50: { bonus: 'Regeneration', description: '+5 health regen per second' },
                    75: { bonus: 'Iron Constitution', description: '+25% poison resistance' },
                    100: { bonus: 'Undying', description: 'Revive once per battle with 50% HP' }
                }
            },
            
            WISDOM: {
                name: 'Wisdom',
                shortName: 'WIS',
                description: 'Increases mana regen, magic resistance, and healing',
                color: '#FFFF00', // Bright yellow
                icon: 'wisdom_icon',
                bonuses: {
                    manaRegen: 0.5, // +0.5 per second per point
                    magicResistance: 0.5, // +0.5% per point
                    healingPower: 1, // +1% per point
                    experienceGain: 0.5 // +0.5% per point
                },
                milestones: {
                    25: { bonus: 'Sage', description: '+5 mana regen per second' },
                    50: { bonus: 'Mystic Shield', description: '+20% magic resistance' },
                    75: { bonus: 'Divine Healer', description: '+50% healing power' },
                    100: { bonus: 'Enlightened', description: '+100% experience gain' }
                }
            },
            
            LUCK: {
                name: 'Luck',
                shortName: 'LCK',
                description: 'Increases item drop rate, gold find, and rare chances',
                color: '#FF00FF', // Bright magenta
                icon: 'luck_icon',
                bonuses: {
                    dropRate: 1, // +1% per point
                    goldFind: 2, // +2% per point
                    rarityChance: 0.5, // +0.5% per point
                    critChance: 0.25 // +0.25% per point
                },
                milestones: {
                    25: { bonus: 'Fortune\'s Favor', description: '+25% gold find' },
                    50: { bonus: 'Treasure Hunter', description: '+50% rare item chance' },
                    75: { bonus: 'Lucky Strike', description: '+10% crit chance' },
                    100: { bonus: 'Divine Fortune', description: 'Guaranteed rare drop per boss' }
                }
            },
            
            ENDURANCE: {
                name: 'Endurance',
                shortName: 'END',
                description: 'Increases stamina, damage reduction, and status resistance',
                color: '#FF6600', // Bright orange
                icon: 'endurance_icon',
                bonuses: {
                    maxStamina: 5, // +5 per point
                    staminaRegen: 0.5, // +0.5 per second per point
                    damageReduction: 0.5, // +0.5% per point
                    statusResistance: 1 // +1% per point
                },
                milestones: {
                    25: { bonus: 'Marathon Runner', description: '+100 max stamina' },
                    50: { bonus: 'Damage Soak', description: '+15% damage reduction' },
                    75: { bonus: 'Immovable', description: '+50% knockback resistance' },
                    100: { bonus: 'Indomitable', description: 'Immune to stun and freeze' }
                }
            },
            
            CHARISMA: {
                name: 'Charisma',
                shortName: 'CHA',
                description: 'Increases vendor prices, companion power, and reputation gain',
                color: '#FFFFFF', // Bright white
                icon: 'charisma_icon',
                bonuses: {
                    vendorDiscount: 1, // +1% per point
                    companionDamage: 1, // +1% per point
                    reputationGain: 1, // +1% per point
                    questRewards: 0.5 // +0.5% per point
                },
                milestones: {
                    25: { bonus: 'Silver Tongue', description: '+25% vendor discount' },
                    50: { bonus: 'Leadership', description: '+50% companion effectiveness' },
                    75: { bonus: 'Renowned', description: 'Double reputation gain' },
                    100: { bonus: 'Living Legend', description: 'All factions start at Friendly' }
                }
            }
        };
    }
    
    /**
     * Allocate attribute points
     */
    allocatePoint(attributeId, amount = 1) {
        if (!this.attributes[attributeId]) {
            logger.warn(`Unknown attribute: ${attributeId}`);
            return false;
        }
        
        if (this.availablePoints < amount) {
            logger.warn('Not enough attribute points available');
            return false;
        }
        
        this.playerAttributes[attributeId].base += amount;
        this.availablePoints -= amount;
        this.usedPoints += amount;
        
        this.calculateAttributeTotal(attributeId);
        this.checkMilestones(attributeId);
        
        logger.info(`+${amount} ${this.attributes[attributeId].name} (${this.playerAttributes[attributeId].base})`);
        
        // Create magical effect
        if (this.gameEngine.magicalBackgroundSystem) {
            this.gameEngine.magicalBackgroundSystem.createSparkBurst(
                { x: 0, y: 2, z: 0 },
                this.attributes[attributeId].color,
                30
            );
        }
        
        return true;
    }
    
    /**
     * Reset all attribute points (costs gold or special item)
     */
    resetAttributes(cost = 0) {
        let totalPoints = 0;
        
        Object.keys(this.playerAttributes).forEach(attrId => {
            const spent = this.playerAttributes[attrId].base - 10; // Subtract starting value
            totalPoints += spent;
            this.playerAttributes[attrId].base = 10;
            this.calculateAttributeTotal(attrId);
        });
        
        this.availablePoints += totalPoints;
        this.usedPoints = 0;
        
        logger.info(`🔄 Attributes reset! ${totalPoints} points refunded`);
        return totalPoints;
    }
    
    /**
     * Calculate total attribute value (base + bonus)
     */
    calculateAttributeTotal(attributeId) {
        const attr = this.playerAttributes[attributeId];
        attr.total = attr.base + attr.bonus;
        return attr.total;
    }
    
    /**
     * Calculate all attribute bonuses for the player
     */
    calculateAllBonuses() {
        this.attributeBonuses = {};
        
        Object.keys(this.attributes).forEach(attrId => {
            const attrDef = this.attributes[attrId];
            const attrValue = this.playerAttributes[attrId].total;
            
            // Calculate each bonus type
            Object.keys(attrDef.bonuses).forEach(bonusType => {
                const bonusPerPoint = attrDef.bonuses[bonusType];
                const totalBonus = bonusPerPoint * attrValue;
                
                if (!this.attributeBonuses[bonusType]) {
                    this.attributeBonuses[bonusType] = 0;
                }
                this.attributeBonuses[bonusType] += totalBonus;
            });
        });
        
        return this.attributeBonuses;
    }
    
    /**
     * Get bonus value for a specific bonus type
     */
    getBonus(bonusType) {
        return this.attributeBonuses[bonusType] || 0;
    }
    
    /**
     * Check if player reached attribute milestones
     */
    checkMilestones(attributeId) {
        const attrDef = this.attributes[attributeId];
        const attrValue = this.playerAttributes[attributeId].base;
        
        if (!attrDef.milestones) return;
        
        Object.keys(attrDef.milestones).forEach(threshold => {
            const thresholdNum = parseInt(threshold);
            if (attrValue === thresholdNum) {
                const milestone = attrDef.milestones[threshold];
                logger.info(`🎊 Milestone reached! ${milestone.bonus}: ${milestone.description}`);
                
                // Create large magical effect
                if (this.gameEngine.magicalBackgroundSystem) {
                    this.gameEngine.magicalBackgroundSystem.createSparkBurst(
                        { x: 0, y: 2, z: 0 },
                        attrDef.color,
                        100
                    );
                }
            }
        });
    }
    
    /**
     * Add attribute points (from leveling up)
     */
    addAttributePoints(amount) {
        this.availablePoints += amount;
        logger.info(`+${amount} attribute points! (Total: ${this.availablePoints})`);
    }
    
    /**
     * Add temporary attribute bonus (from equipment, buffs)
     */
    addAttributeBonus(attributeId, amount, source = 'unknown') {
        if (!this.playerAttributes[attributeId]) return;
        
        this.playerAttributes[attributeId].bonus += amount;
        this.calculateAttributeTotal(attributeId);
        this.calculateAllBonuses();
        
        logger.info(`+${amount} ${this.attributes[attributeId].name} bonus from ${source}`);
    }
    
    /**
     * Remove attribute bonus
     */
    removeAttributeBonus(attributeId, amount) {
        if (!this.playerAttributes[attributeId]) return;
        
        this.playerAttributes[attributeId].bonus -= amount;
        this.calculateAttributeTotal(attributeId);
        this.calculateAllBonuses();
    }
    
    /**
     * Get attribute display info
     */
    getAttributeInfo(attributeId) {
        if (!this.attributes[attributeId]) return null;
        
        const attrDef = this.attributes[attributeId];
        const attrValues = this.playerAttributes[attributeId];
        
        // Calculate bonuses from this attribute
        const bonuses = {};
        Object.keys(attrDef.bonuses).forEach(bonusType => {
            bonuses[bonusType] = attrDef.bonuses[bonusType] * attrValues.total;
        });
        
        // Check next milestone
        let nextMilestone = null;
        if (attrDef.milestones) {
            const milestones = Object.keys(attrDef.milestones).map(Number).sort((a, b) => a - b);
            for (const threshold of milestones) {
                if (attrValues.base < threshold) {
                    nextMilestone = {
                        threshold: threshold,
                        ...attrDef.milestones[threshold]
                    };
                    break;
                }
            }
        }
        
        return {
            definition: attrDef,
            values: attrValues,
            bonuses: bonuses,
            nextMilestone: nextMilestone
        };
    }
    
    /**
     * Get all attributes summary
     */
    getAllAttributes() {
        const result = [];
        
        Object.keys(this.attributes).forEach(attrId => {
            result.push({
                id: attrId,
                ...this.getAttributeInfo(attrId)
            });
        });
        
        return result;
    }
    
    /**
     * Get attribute allocation recommendations based on class
     */
    getRecommendedBuild(className) {
        const recommendations = {
            WARRIOR: { STR: 5, VIT: 3, END: 2 },
            MAGE: { INT: 5, WIS: 3, VIT: 2 },
            ROGUE: { DEX: 5, LCK: 3, STR: 2 },
            CLERIC: { WIS: 5, INT: 3, VIT: 2 },
            RANGER: { DEX: 5, LCK: 2, STR: 2, END: 1 },
            PALADIN: { STR: 4, VIT: 3, WIS: 2, CHA: 1 },
            BERSERKER: { STR: 6, VIT: 2, END: 2 },
            NECROMANCER: { INT: 5, WIS: 3, CHA: 2 },
            BARD: { CHA: 5, DEX: 3, LCK: 2 },
            DRUID: { WIS: 4, INT: 3, VIT: 3 }
        };
        
        return recommendations[className] || { STR: 2, DEX: 2, INT: 2, VIT: 2, WIS: 1, LCK: 1 };
    }
    
    /**
     * Auto-allocate points based on class recommendation
     */
    autoAllocate(className) {
        if (this.availablePoints === 0) {
            logger.warn('No points available to allocate');
            return;
        }
        
        const recommendation = this.getRecommendedBuild(className);
        const totalWeight = Object.values(recommendation).reduce((a, b) => a + b, 0);
        
        Object.keys(recommendation).forEach(attrId => {
            const weight = recommendation[attrId];
            const pointsToAllocate = Math.floor((weight / totalWeight) * this.availablePoints);
            
            if (pointsToAllocate > 0) {
                this.allocatePoint(attrId, pointsToAllocate);
            }
        });
        
        logger.info(`🤖 Auto-allocated ${this.usedPoints} points based on ${className} build`);
    }
    
    /**
     * Update attribute system
     */
    update(deltaTime) {
        // Attribute system is mostly event-driven
        // Could add passive effects here if needed
    }
}
