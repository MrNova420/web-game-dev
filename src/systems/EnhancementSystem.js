/**
 * EnhancementSystem.js
 * Handles item upgrading, socketing, reforging, fusion, and transmog
 * Part of Phase 4: Crafting & Economy
 */

export class EnhancementSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // Enhancement levels
        this.maxEnhancementLevel = 15;
        this.enhancementCosts = this.initializeEnhancementCosts();
        
        // Socket system
        this.maxSockets = 3;
        this.gemTypes = this.initializeGemTypes();
        
        // Reforge system
        this.reforgeStats = ['attack', 'defense', 'hp', 'magicPower', 'critChance', 'critDamage'];
        
        // Durability system
        this.maxDurability = 100;
        this.repairCostPerPoint = 5; // gold per durability point
        
        // Transmog collections
        this.transmogCollection = new Set();
        
        // Success rates
        this.enhancementSuccessRates = this.initializeSuccessRates();
    }
    
    /**
     * Initialize enhancement costs
     */
    initializeEnhancementCosts() {
        const costs = {};
        
        for (let level = 1; level <= this.maxEnhancementLevel; level++) {
            costs[level] = {
                gold: Math.floor(50 * Math.pow(1.5, level)),
                materials: {
                    'essence_shard': Math.floor(2 * level),
                    'mystical_ore': level > 5 ? Math.floor(level - 5) : 0,
                    'corrupted_crystal': level > 10 ? Math.floor(level - 10) : 0
                }
            };
        }
        
        return costs;
    }
    
    /**
     * Initialize success rates for enhancement
     */
    initializeSuccessRates() {
        const rates = {};
        
        for (let level = 1; level <= this.maxEnhancementLevel; level++) {
            if (level <= 5) {
                rates[level] = 1.0; // 100% success
            } else if (level <= 10) {
                rates[level] = 0.9 - ((level - 5) * 0.1); // 90% to 40%
            } else {
                rates[level] = 0.4 - ((level - 10) * 0.05); // 40% to 15%
            }
        }
        
        return rates;
    }
    
    /**
     * Initialize gem types
     */
    initializeGemTypes() {
        return {
            ruby: {
                name: 'Ruby',
                rarity: 'uncommon',
                stats: { attack: 10 },
                color: '#ff0000'
            },
            sapphire: {
                name: 'Sapphire',
                rarity: 'uncommon',
                stats: { defense: 10 },
                color: '#0000ff'
            },
            emerald: {
                name: 'Emerald',
                rarity: 'uncommon',
                stats: { hp: 30 },
                color: '#00ff00'
            },
            diamond: {
                name: 'Diamond',
                rarity: 'rare',
                stats: { attack: 15, defense: 15 },
                color: '#ffffff'
            },
            amethyst: {
                name: 'Amethyst',
                rarity: 'rare',
                stats: { magicPower: 20 },
                color: '#9966cc'
            },
            topaz: {
                name: 'Topaz',
                rarity: 'rare',
                stats: { critChance: 0.05 },
                color: '#ffaa00'
            },
            onyx: {
                name: 'Onyx',
                rarity: 'epic',
                stats: { critDamage: 0.5 },
                color: '#000000'
            },
            opal: {
                name: 'Opal',
                rarity: 'epic',
                stats: { attack: 20, magicPower: 20 },
                color: '#ccffff'
            },
            prismatic: {
                name: 'Prismatic Gem',
                rarity: 'legendary',
                stats: { attack: 30, defense: 30, hp: 50 },
                color: 'rainbow'
            }
        };
    }
    
    /**
     * Enhance item to next level
     */
    enhanceItem(item, safeMode = false) {
        if (!item) {
            return { success: false, reason: 'No item provided' };
        }
        
        // Initialize enhancement level
        if (!item.enhancement) {
            item.enhancement = 0;
        }
        
        if (item.enhancement >= this.maxEnhancementLevel) {
            return { success: false, reason: 'Maximum enhancement level reached' };
        }
        
        const nextLevel = item.enhancement + 1;
        const cost = this.enhancementCosts[nextLevel];
        
        // Check gold cost
        if (this.gameEngine.economySystem) {
            if (this.gameEngine.economySystem.getCurrency('gold') < cost.gold) {
                return { success: false, reason: 'Not enough gold' };
            }
        }
        
        // Check material costs
        if (this.gameEngine.craftingSystem) {
            for (const [material, amount] of Object.entries(cost.materials)) {
                if (amount > 0) {
                    if (this.gameEngine.craftingSystem.getMaterialCount(material) < amount) {
                        return { success: false, reason: `Not enough ${material}` };
                    }
                }
            }
        }
        
        // Calculate success chance
        let successRate = this.enhancementSuccessRates[nextLevel];
        
        // Safe mode guarantees success but costs 2x
        if (safeMode) {
            successRate = 1.0;
            cost.gold *= 2;
            for (const material in cost.materials) {
                cost.materials[material] *= 2;
            }
        }
        
        // Consume resources
        if (this.gameEngine.economySystem) {
            this.gameEngine.economySystem.removeCurrency('gold', cost.gold);
        }
        
        if (this.gameEngine.craftingSystem) {
            for (const [material, amount] of Object.entries(cost.materials)) {
                if (amount > 0) {
                    this.gameEngine.craftingSystem.removeMaterial(material, amount);
                }
            }
        }
        
        // Roll for success
        const success = Math.random() < successRate;
        
        if (success) {
            item.enhancement = nextLevel;
            this.applyEnhancementBonus(item);
            
            return {
                success: true,
                level: nextLevel,
                item: item,
                message: `Enhanced ${item.name} to +${nextLevel}!`
            };
        } else {
            // Failed enhancement
            if (nextLevel > 10) {
                // High level failures can break the item or reduce enhancement
                const rollDestruction = Math.random();
                if (rollDestruction < 0.3) {
                    // Item destroyed
                    return {
                        success: false,
                        destroyed: true,
                        message: `Enhancement failed! ${item.name} was destroyed!`
                    };
                } else {
                    // Enhancement reduced
                    item.enhancement = Math.max(0, item.enhancement - 1);
                    this.applyEnhancementBonus(item);
                    return {
                        success: false,
                        reduced: true,
                        level: item.enhancement,
                        message: `Enhancement failed! ${item.name} reduced to +${item.enhancement}`
                    };
                }
            } else {
                // Low level failures just waste resources
                return {
                    success: false,
                    message: `Enhancement failed! Resources lost.`
                };
            }
        }
    }
    
    /**
     * Apply enhancement bonus to item stats
     */
    applyEnhancementBonus(item) {
        if (!item.stats || !item.enhancement) return;
        
        // Store base stats if not already stored
        if (!item.baseStats) {
            item.baseStats = { ...item.stats };
        }
        
        // Calculate enhancement multiplier (10% per level)
        const multiplier = 1 + (item.enhancement * 0.1);
        
        // Apply multiplier to base stats
        for (const [stat, baseValue] of Object.entries(item.baseStats)) {
            if (typeof baseValue === 'number') {
                item.stats[stat] = Math.floor(baseValue * multiplier);
            }
        }
    }
    
    /**
     * Add socket to item
     */
    addSocket(item, cost = {}) {
        if (!item) {
            return { success: false, reason: 'No item provided' };
        }
        
        // Initialize sockets
        if (!item.sockets) {
            item.sockets = [];
        }
        
        if (item.sockets.length >= this.maxSockets) {
            return { success: false, reason: 'Maximum sockets reached' };
        }
        
        // Default cost
        const socketCost = cost.gold || 1000 * (item.sockets.length + 1);
        
        // Check cost
        if (this.gameEngine.economySystem) {
            if (this.gameEngine.economySystem.getCurrency('gold') < socketCost) {
                return { success: false, reason: 'Not enough gold' };
            }
            this.gameEngine.economySystem.removeCurrency('gold', socketCost);
        }
        
        // Add socket
        item.sockets.push(null); // Empty socket
        
        return {
            success: true,
            sockets: item.sockets.length,
            message: `Added socket to ${item.name}! (${item.sockets.length}/${this.maxSockets})`
        };
    }
    
    /**
     * Insert gem into socket
     */
    insertGem(item, socketIndex, gemType) {
        if (!item || !item.sockets) {
            return { success: false, reason: 'Item has no sockets' };
        }
        
        if (socketIndex < 0 || socketIndex >= item.sockets.length) {
            return { success: false, reason: 'Invalid socket index' };
        }
        
        if (item.sockets[socketIndex] !== null) {
            return { success: false, reason: 'Socket already occupied' };
        }
        
        const gem = this.gemTypes[gemType];
        if (!gem) {
            return { success: false, reason: 'Invalid gem type' };
        }
        
        // Insert gem
        item.sockets[socketIndex] = gemType;
        
        // Apply gem stats
        this.applySocketBonuses(item);
        
        return {
            success: true,
            gem: gem,
            message: `Inserted ${gem.name} into ${item.name}!`
        };
    }
    
    /**
     * Remove gem from socket
     */
    removeGem(item, socketIndex, preserve = false) {
        if (!item || !item.sockets) {
            return { success: false, reason: 'Item has no sockets' };
        }
        
        if (socketIndex < 0 || socketIndex >= item.sockets.length) {
            return { success: false, reason: 'Invalid socket index' };
        }
        
        const gemType = item.sockets[socketIndex];
        if (!gemType) {
            return { success: false, reason: 'Socket is empty' };
        }
        
        // Cost to preserve gem (otherwise destroyed)
        if (preserve) {
            const cost = 500;
            if (this.gameEngine.economySystem) {
                if (this.gameEngine.economySystem.getCurrency('gold') < cost) {
                    return { success: false, reason: 'Not enough gold to preserve gem' };
                }
                this.gameEngine.economySystem.removeCurrency('gold', cost);
            }
        }
        
        // Remove gem
        item.sockets[socketIndex] = null;
        
        // Reapply socket bonuses
        this.applySocketBonuses(item);
        
        return {
            success: true,
            gem: gemType,
            preserved: preserve,
            message: preserve ? 
                     `Removed and preserved ${this.gemTypes[gemType].name}` :
                     `Removed ${this.gemTypes[gemType].name} (destroyed)`
        };
    }
    
    /**
     * Apply all socket bonuses to item
     */
    applySocketBonuses(item) {
        if (!item.sockets || !item.stats) return;
        
        // Reset to base stats + enhancement
        if (item.baseStats) {
            for (const stat in item.baseStats) {
                item.stats[stat] = item.baseStats[stat];
            }
            if (item.enhancement) {
                this.applyEnhancementBonus(item);
            }
        }
        
        // Store socket bonuses separately
        item.socketBonuses = {};
        
        // Apply each socketed gem
        for (const gemType of item.sockets) {
            if (gemType) {
                const gem = this.gemTypes[gemType];
                if (gem && gem.stats) {
                    for (const [stat, value] of Object.entries(gem.stats)) {
                        item.socketBonuses[stat] = (item.socketBonuses[stat] || 0) + value;
                        item.stats[stat] = (item.stats[stat] || 0) + value;
                    }
                }
            }
        }
    }
    
    /**
     * Reforge item stats
     */
    reforgeItem(item, targetStat = null) {
        if (!item || !item.stats) {
            return { success: false, reason: 'Invalid item' };
        }
        
        // Cost to reforge
        const baseCost = 500;
        const rarityCost = {
            common: 1,
            uncommon: 2,
            rare: 4,
            epic: 8,
            legendary: 16
        }[item.rarity] || 1;
        
        const totalCost = baseCost * rarityCost;
        
        if (this.gameEngine.economySystem) {
            if (this.gameEngine.economySystem.getCurrency('gold') < totalCost) {
                return { success: false, reason: 'Not enough gold' };
            }
            this.gameEngine.economySystem.removeCurrency('gold', totalCost);
        }
        
        // Select stat to reroll
        const availableStats = Object.keys(item.stats);
        const statToReroll = targetStat || 
                            availableStats[Math.floor(Math.random() * availableStats.length)];
        
        if (!availableStats.includes(statToReroll)) {
            return { success: false, reason: 'Stat not found on item' };
        }
        
        // Store old value
        const oldValue = item.stats[statToReroll];
        
        // Reroll stat (±20% of current value)
        const variation = 0.2;
        const minValue = Math.floor(oldValue * (1 - variation));
        const maxValue = Math.ceil(oldValue * (1 + variation));
        const newValue = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
        
        item.stats[statToReroll] = Math.max(1, newValue);
        
        // Update base stats if exists
        if (item.baseStats && item.baseStats[statToReroll]) {
            item.baseStats[statToReroll] = item.stats[statToReroll];
        }
        
        return {
            success: true,
            stat: statToReroll,
            oldValue: oldValue,
            newValue: item.stats[statToReroll],
            improved: item.stats[statToReroll] > oldValue,
            message: `Reforged ${statToReroll}: ${oldValue} → ${item.stats[statToReroll]}`
        };
    }
    
    /**
     * Fuse two items together
     */
    fuseItems(item1, item2) {
        if (!item1 || !item2) {
            return { success: false, reason: 'Need two items to fuse' };
        }
        
        if (item1.type !== item2.type) {
            return { success: false, reason: 'Items must be same type' };
        }
        
        // Cost to fuse
        const cost = 2000;
        
        if (this.gameEngine.economySystem) {
            if (this.gameEngine.economySystem.getCurrency('gold') < cost) {
                return { success: false, reason: 'Not enough gold' };
            }
            this.gameEngine.economySystem.removeCurrency('gold', cost);
        }
        
        // Create fused item
        const fusedItem = {
            ...item1,
            id: `fused_${Date.now()}`,
            name: `Fused ${item1.name}`,
            fused: true,
            stats: {}
        };
        
        // Combine stats (average + bonus)
        const allStats = new Set([
            ...Object.keys(item1.stats || {}),
            ...Object.keys(item2.stats || {})
        ]);
        
        for (const stat of allStats) {
            const val1 = item1.stats?.[stat] || 0;
            const val2 = item2.stats?.[stat] || 0;
            
            if (typeof val1 === 'number' && typeof val2 === 'number') {
                // Average + 10% bonus
                fusedItem.stats[stat] = Math.floor((val1 + val2) / 2 * 1.1);
            } else {
                // Take higher value for non-numeric stats
                fusedItem.stats[stat] = val1 || val2;
            }
        }
        
        // Inherit highest enhancement level
        if (item1.enhancement || item2.enhancement) {
            fusedItem.enhancement = Math.max(item1.enhancement || 0, item2.enhancement || 0);
        }
        
        // Combine sockets
        if (item1.sockets || item2.sockets) {
            fusedItem.sockets = [
                ...(item1.sockets || []),
                ...(item2.sockets || [])
            ].slice(0, this.maxSockets);
        }
        
        // Upgrade rarity if both are same rarity
        if (item1.rarity === item2.rarity) {
            const rarityUpgrade = {
                common: 'uncommon',
                uncommon: 'rare',
                rare: 'epic',
                epic: 'legendary',
                legendary: 'legendary'
            };
            fusedItem.rarity = rarityUpgrade[item1.rarity] || item1.rarity;
        }
        
        return {
            success: true,
            fusedItem: fusedItem,
            message: `Fused items into ${fusedItem.name}!`
        };
    }
    
    /**
     * Apply transmog (cosmetic appearance)
     */
    applyTransmog(item, appearanceItem) {
        if (!item || !appearanceItem) {
            return { success: false, reason: 'Need base item and appearance item' };
        }
        
        // Cost
        const cost = 250;
        
        if (this.gameEngine.economySystem) {
            if (this.gameEngine.economySystem.getCurrency('gold') < cost) {
                return { success: false, reason: 'Not enough gold' };
            }
            this.gameEngine.economySystem.removeCurrency('gold', cost);
        }
        
        // Apply transmog
        item.transmog = {
            appearance: appearanceItem.name,
            rarity: appearanceItem.rarity,
            appliedAt: Date.now()
        };
        
        // Add to collection
        this.transmogCollection.add(appearanceItem.name);
        
        return {
            success: true,
            message: `${item.name} now appears as ${appearanceItem.name}!`
        };
    }
    
    /**
     * Remove transmog
     */
    removeTransmog(item) {
        if (!item || !item.transmog) {
            return { success: false, reason: 'Item has no transmog' };
        }
        
        delete item.transmog;
        
        return {
            success: true,
            message: 'Transmog removed'
        };
    }
    
    /**
     * Handle item durability
     */
    reduceDurability(item, amount = 1) {
        if (!item) return;
        
        // Initialize durability
        if (item.durability === undefined) {
            item.durability = this.maxDurability;
        }
        
        item.durability = Math.max(0, item.durability - amount);
        
        // Item breaks at 0 durability
        if (item.durability === 0) {
            item.broken = true;
            return { broken: true };
        }
        
        return { durability: item.durability };
    }
    
    /**
     * Repair item
     */
    repairItem(item, points = null) {
        if (!item) {
            return { success: false, reason: 'No item provided' };
        }
        
        // Initialize durability
        if (item.durability === undefined) {
            item.durability = this.maxDurability;
        }
        
        if (item.durability >= this.maxDurability) {
            return { success: false, reason: 'Item is already at full durability' };
        }
        
        // Determine points to repair
        const pointsToRepair = points || (this.maxDurability - item.durability);
        const actualPoints = Math.min(pointsToRepair, this.maxDurability - item.durability);
        
        // Calculate cost
        const cost = actualPoints * this.repairCostPerPoint;
        
        if (this.gameEngine.economySystem) {
            if (this.gameEngine.economySystem.getCurrency('gold') < cost) {
                return { success: false, reason: 'Not enough gold' };
            }
            this.gameEngine.economySystem.removeCurrency('gold', cost);
        }
        
        // Repair
        item.durability += actualPoints;
        item.broken = false;
        
        return {
            success: true,
            repaired: actualPoints,
            cost: cost,
            durability: item.durability,
            message: `Repaired ${item.name} (${item.durability}/${this.maxDurability})`
        };
    }
    
    /**
     * Get item's total power level
     */
    getItemPowerLevel(item) {
        if (!item || !item.stats) return 0;
        
        let power = 0;
        
        // Add up all numeric stats
        for (const value of Object.values(item.stats)) {
            if (typeof value === 'number') {
                power += value;
            }
        }
        
        // Enhancement bonus
        if (item.enhancement) {
            power *= (1 + item.enhancement * 0.1);
        }
        
        // Rarity multiplier
        const rarityMultipliers = {
            common: 1,
            uncommon: 1.5,
            rare: 2.5,
            epic: 4,
            legendary: 7
        };
        
        power *= rarityMultipliers[item.rarity] || 1;
        
        return Math.floor(power);
    }
    
    /**
     * Save system state
     */
    save() {
        return {
            transmogCollection: Array.from(this.transmogCollection)
        };
    }
    
    /**
     * Load system state
     */
    load(data) {
        if (!data) return;
        
        if (data.transmogCollection) {
            this.transmogCollection = new Set(data.transmogCollection);
        }
    }
    
    /**
     * Update system (called each frame)
     */
    update(deltaTime) {
        // Passive durability decay could be added here if desired
    }
}
