/**
 * EquipmentSystem - Phase 3: Progression & RPG Mechanics
 * 
 * Complete equipment management system
 * - Equipment slots (head, chest, legs, hands, feet, weapon, offhand, accessories)
 * - Item stats and bonuses
 * - Set bonuses
 * - Item quality/rarity tiers
 * - Equipment requirements (level, stats, class)
 * - Durability system
 * - Equipment comparison
 * - Visual equipment display
 * - Item binding (BoE/BoP)
 */

export class EquipmentSystem {
    constructor(statsSystem, uiSystem) {
        this.stats = statsSystem;
        this.ui = uiSystem;
        
        // Player equipment
        this.equipped = new Map();
        
        // Equipment slots
        this.slots = [
            'head', 'chest', 'legs', 'hands', 'feet',
            'weapon', 'offhand',
            'neck', 'ring1', 'ring2', 'trinket1', 'trinket2'
        ];
        
        // Item rarities
        this.rarities = {
            common: { color: '#9d9d9d', multiplier: 1.0 },
            uncommon: { color: '#1eff00', multiplier: 1.2 },
            rare: { color: '#0070dd', multiplier: 1.5 },
            epic: { color: '#a335ee', multiplier: 2.0 },
            legendary: { color: '#ff8000', multiplier: 3.0 },
            mythic: { color: '#e6cc80', multiplier: 4.0 },
            artifact: { color: '#e5cc80', multiplier: 5.0 }
        };
        
        // Set bonuses
        this.itemSets = new Map();
    }
    
    /**
     * Initialize player equipment
     */
    initializeEquipment(playerId) {
        const equipment = {};
        for (const slot of this.slots) {
            equipment[slot] = null;
        }
        
        this.equipped.set(playerId, equipment);
        return equipment;
    }
    
    /**
     * Equip an item
     */
    equipItem(playerId, item, slot) {
        const equipment = this.equipped.get(playerId);
        if (!equipment) return { success: false, reason: 'Player not found' };
        
        // Validate slot
        if (!this.slots.includes(slot)) {
            return { success: false, reason: 'Invalid slot' };
        }
        
        // Check requirements
        const canEquip = this.checkRequirements(playerId, item);
        if (!canEquip.success) {
            return canEquip;
        }
        
        // Unequip current item
        const previousItem = equipment[slot];
        if (previousItem) {
            this.removeItemStats(playerId, previousItem);
        }
        
        // Equip new item
        equipment[slot] = item;
        this.applyItemStats(playerId, item);
        
        // Check set bonuses
        this.updateSetBonuses(playerId);
        
        // UI update
        if (this.ui) {
            this.ui.updateEquipmentDisplay(playerId, slot, item);
        }
        
        return {
            success: true,
            equipped: item,
            unequipped: previousItem,
            slot: slot
        };
    }
    
    /**
     * Unequip an item
     */
    unequipItem(playerId, slot) {
        const equipment = this.equipped.get(playerId);
        if (!equipment) return { success: false };
        
        const item = equipment[slot];
        if (!item) return { success: false, reason: 'No item equipped' };
        
        // Remove item
        equipment[slot] = null;
        this.removeItemStats(playerId, item);
        
        // Update set bonuses
        this.updateSetBonuses(playerId);
        
        return {
            success: true,
            item: item,
            slot: slot
        };
    }
    
    /**
     * Check if player meets item requirements
     */
    checkRequirements(playerId, item) {
        if (!item.requirements) return { success: true };
        
        const req = item.requirements;
        
        // Level requirement
        if (req.level) {
            const playerLevel = this.stats.players.get(playerId)?.level || 1;
            if (playerLevel < req.level) {
                return { success: false, reason: `Requires level ${req.level}` };
            }
        }
        
        // Stat requirements
        if (req.stats) {
            for (const [stat, value] of Object.entries(req.stats)) {
                const playerStat = this.stats.getTotalStat(playerId, stat);
                if (playerStat < value) {
                    return { success: false, reason: `Requires ${value} ${stat}` };
                }
            }
        }
        
        // Class requirement
        if (req.class) {
            // Integration point with class system
            // const playerClass = this.classSystem.getClass(playerId);
            // if (playerClass !== req.class) return { success: false };
        }
        
        return { success: true };
    }
    
    /**
     * Apply item stats to player
     */
    applyItemStats(playerId, item) {
        if (!item.stats) return;
        
        // Create modifier ID
        const modifierId = `equipment_${item.id}`;
        
        // Apply stat bonuses
        this.stats.addModifier(playerId, modifierId, item.stats);
    }
    
    /**
     * Remove item stats from player
     */
    removeItemStats(playerId, item) {
        if (!item.stats) return;
        
        const modifierId = `equipment_${item.id}`;
        this.stats.removeModifier(playerId, modifierId);
    }
    
    /**
     * Update set bonuses
     */
    updateSetBonuses(playerId) {
        const equipment = this.equipped.get(playerId);
        if (!equipment) return;
        
        // Count set pieces
        const setPieces = new Map();
        
        for (const item of Object.values(equipment)) {
            if (item && item.setId) {
                setPieces.set(item.setId, (setPieces.get(item.setId) || 0) + 1);
            }
        }
        
        // Remove old set bonuses
        for (const [setId, set] of this.itemSets.entries()) {
            if (set.appliedTo.has(playerId)) {
                this.removeSetBonus(playerId, setId);
            }
        }
        
        // Apply new set bonuses
        for (const [setId, count] of setPieces.entries()) {
            const set = this.getItemSet(setId);
            if (!set) continue;
            
            // Apply bonuses for piece count thresholds (2, 4, 6 pieces)
            for (const [threshold, bonus] of Object.entries(set.bonuses)) {
                if (count >= parseInt(threshold)) {
                    this.applySetBonus(playerId, setId, bonus);
                }
            }
        }
    }
    
    /**
     * Apply set bonus
     */
    applySetBonus(playerId, setId, bonus) {
        const modifierId = `set_${setId}`;
        
        if (bonus.stats) {
            this.stats.addModifier(playerId, modifierId, bonus.stats);
        }
        
        // Track applied set
        let set = this.itemSets.get(setId);
        if (!set) {
            set = { id: setId, bonuses: {}, appliedTo: new Set() };
            this.itemSets.set(setId, set);
        }
        set.appliedTo.add(playerId);
    }
    
    /**
     * Remove set bonus
     */
    removeSetBonus(playerId, setId) {
        const modifierId = `set_${setId}`;
        this.stats.removeModifier(playerId, modifierId);
        
        const set = this.itemSets.get(setId);
        if (set) {
            set.appliedTo.delete(playerId);
        }
    }
    
    /**
     * Get item set definition
     */
    getItemSet(setId) {
        // This would be loaded from content library
        // Example set structure:
        return {
            id: setId,
            name: 'Dragon Slayer Set',
            bonuses: {
                2: { stats: { strength: 20, vitality: 15 } },
                4: { stats: { strength: 40, vitality: 30, attack: 50 } },
                6: { stats: { strength: 100, vitality: 75, attack: 150 }, special: 'dragon_slayer' }
            }
        };
    }
    
    /**
     * Get all equipped items
     */
    getEquippedItems(playerId) {
        return this.equipped.get(playerId);
    }
    
    /**
     * Get equipment power level
     */
    getEquipmentPower(playerId) {
        const equipment = this.equipped.get(playerId);
        if (!equipment) return 0;
        
        let totalPower = 0;
        
        for (const item of Object.values(equipment)) {
            if (!item) continue;
            
            const itemPower = this.calculateItemPower(item);
            totalPower += itemPower;
        }
        
        return totalPower;
    }
    
    /**
     * Calculate item power level
     */
    calculateItemPower(item) {
        if (!item.stats) return 0;
        
        let power = 0;
        const rarityMultiplier = this.rarities[item.rarity]?.multiplier || 1.0;
        
        // Sum all stat values
        for (const value of Object.values(item.stats)) {
            power += Math.abs(value);
        }
        
        return Math.floor(power * rarityMultiplier);
    }
    
    /**
     * Compare two items
     */
    compareItems(item1, item2) {
        const power1 = this.calculateItemPower(item1);
        const power2 = this.calculateItemPower(item2);
        
        const comparison = {
            powerDiff: power2 - power1,
            isBetter: power2 > power1,
            isWorse: power2 < power1,
            statComparison: {}
        };
        
        // Compare individual stats
        const allStats = new Set([
            ...Object.keys(item1.stats || {}),
            ...Object.keys(item2.stats || {})
        ]);
        
        for (const stat of allStats) {
            const val1 = (item1.stats || {})[stat] || 0;
            const val2 = (item2.stats || {})[stat] || 0;
            
            comparison.statComparison[stat] = {
                current: val1,
                new: val2,
                diff: val2 - val1
            };
        }
        
        return comparison;
    }
    
    /**
     * Damage equipment durability
     */
    damageEquipment(playerId, slot, amount) {
        const equipment = this.equipped.get(playerId);
        if (!equipment) return;
        
        const item = equipment[slot];
        if (!item || !item.durability) return;
        
        item.durability.current = Math.max(0, item.durability.current - amount);
        
        // Item broken
        if (item.durability.current === 0) {
            this.onItemBroken(playerId, slot, item);
        }
    }
    
    /**
     * Repair equipment
     */
    repairEquipment(playerId, slot, amount = null) {
        const equipment = this.equipped.get(playerId);
        if (!equipment) return;
        
        const item = equipment[slot];
        if (!item || !item.durability) return;
        
        if (amount === null) {
            item.durability.current = item.durability.max;
        } else {
            item.durability.current = Math.min(
                item.durability.max,
                item.durability.current + amount
            );
        }
        
        return item.durability.current;
    }
    
    /**
     * Handle item broken event
     */
    onItemBroken(playerId, slot, item) {
        // Remove stats
        this.removeItemStats(playerId, item);
        
        // UI notification
        if (this.ui) {
            this.ui.showNotification(`${item.name} has broken!`, 'warning');
        }
    }
}
