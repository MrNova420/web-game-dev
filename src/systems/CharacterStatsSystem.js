/**
 * CharacterStatsSystem - Phase 3: Progression & RPG Mechanics
 * 
 * Complete character statistics management
 * - Primary stats: Strength, Agility, Intelligence, Vitality, Wisdom, Luck
 * - Secondary stats: HP, Mana, Stamina, Attack, Defense, Speed
 * - Stat allocation and respec
 * - Stat modifiers from gear, buffs, debuffs
 * - Stat scaling and calculations
 * - Stat caps and diminishing returns
 * - Stat synergies
 */

export class CharacterStatsSystem {
    constructor() {
        // Player stats
        this.players = new Map();
        
        // Stat configuration
        this.config = {
            // Primary stats
            primaryStats: ['strength', 'agility', 'intelligence', 'vitality', 'wisdom', 'luck'],
            
            // Base values at level 1
            baseStats: {
                strength: 10,
                agility: 10,
                intelligence: 10,
                vitality: 10,
                wisdom: 10,
                luck: 10
            },
            
            // Stat caps
            statCaps: {
                strength: 999,
                agility: 999,
                intelligence: 999,
                vitality: 999,
                wisdom: 999,
                luck: 999
            },
            
            // Secondary stat calculations
            secondaryStats: {
                maxHP: (stats) => 100 + (stats.vitality * 10),
                maxMana: (stats) => 100 + (stats.intelligence * 8) + (stats.wisdom * 5),
                maxStamina: (stats) => 100 + (stats.vitality * 3) + (stats.agility * 2),
                attack: (stats) => stats.strength * 2 + stats.agility * 0.5,
                magicPower: (stats) => stats.intelligence * 2 + stats.wisdom * 1.5,
                defense: (stats) => stats.vitality * 1.5 + stats.strength * 0.3,
                magicDefense: (stats) => stats.wisdom * 2 + stats.intelligence * 0.5,
                critChance: (stats) => 0.05 + (stats.luck * 0.002) + (stats.agility * 0.001),
                critDamage: (stats) => 1.5 + (stats.luck * 0.01),
                attackSpeed: (stats) => 1.0 + (stats.agility * 0.005),
                moveSpeed: (stats) => 5.0 + (stats.agility * 0.1),
                hpRegen: (stats) => (stats.vitality * 0.5) + (stats.wisdom * 0.2),
                manaRegen: (stats) => (stats.wisdom * 0.8) + (stats.intelligence * 0.3),
                staminaRegen: (stats) => 10 + (stats.vitality * 0.3),
                dodge: (stats) => 0.05 + (stats.agility * 0.002),
                block: (stats) => 0.05 + (stats.strength * 0.001) + (stats.vitality * 0.001),
                accuracy: (stats) => 0.95 + (stats.agility * 0.0005),
                parry: (stats) => 0.05 + (stats.strength * 0.001) + (stats.agility * 0.001)
            },
            
            // Stat synergies (bonus when stats are high)
            synergies: [
                {
                    stats: ['strength', 'vitality'],
                    threshold: 100,
                    bonus: { defense: 20, maxHP: 100 },
                    name: 'Fortress'
                },
                {
                    stats: ['intelligence', 'wisdom'],
                    threshold: 100,
                    bonus: { magicPower: 30, maxMana: 150 },
                    name: 'Archmage'
                },
                {
                    stats: ['agility', 'luck'],
                    threshold: 100,
                    bonus: { critChance: 0.10, dodge: 0.10 },
                    name: 'Shadow Assassin'
                },
                {
                    stats: ['strength', 'agility', 'intelligence'],
                    threshold: 80,
                    bonus: { attack: 40, attackSpeed: 0.2 },
                    name: 'Jack of All Trades'
                }
            ]
        };
        
        // Modifiers from gear, buffs, etc
        this.modifiers = new Map();
    }
    
    /**
     * Initialize character stats
     */
    initializeStats(playerId, options = {}) {
        const stats = {
            id: playerId,
            
            // Primary stats
            base: { ...this.config.baseStats },
            allocated: {
                strength: 0,
                agility: 0,
                intelligence: 0,
                vitality: 0,
                wisdom: 0,
                luck: 0
            },
            modifiers: {
                strength: 0,
                agility: 0,
                intelligence: 0,
                vitality: 0,
                wisdom: 0,
                luck: 0
            },
            
            // Secondary stats (calculated)
            secondary: {},
            
            // Current values (for HP, Mana, Stamina)
            current: {
                hp: 0,
                mana: 0,
                stamina: 0
            },
            
            // Active synergies
            synergies: [],
            
            // Respec count
            respecCount: 0
        };
        
        // Apply any initial allocations
        if (options.allocated) {
            stats.allocated = { ...stats.allocated, ...options.allocated };
        }
        
        // Calculate secondary stats
        this.calculateSecondaryStats(stats);
        
        // Set current values to max
        stats.current.hp = stats.secondary.maxHP;
        stats.current.mana = stats.secondary.maxMana;
        stats.current.stamina = stats.secondary.maxStamina;
        
        this.players.set(playerId, stats);
        this.modifiers.set(playerId, []);
        
        return stats;
    }
    
    /**
     * Get total stat value (base + allocated + modifiers)
     */
    getTotalStat(playerId, statName) {
        const stats = this.players.get(playerId);
        if (!stats) return 0;
        
        const base = stats.base[statName] || 0;
        const allocated = stats.allocated[statName] || 0;
        const modifier = stats.modifiers[statName] || 0;
        
        const total = base + allocated + modifier;
        const cap = this.config.statCaps[statName] || 999;
        
        return Math.min(total, cap);
    }
    
    /**
     * Allocate stat points
     */
    allocateStats(playerId, allocations) {
        const stats = this.players.get(playerId);
        if (!stats) return { success: false, reason: 'Player not found' };
        
        // Apply allocations
        for (const [stat, points] of Object.entries(allocations)) {
            if (!this.config.primaryStats.includes(stat)) continue;
            
            stats.allocated[stat] = (stats.allocated[stat] || 0) + points;
            
            // Apply cap
            const total = this.getTotalStat(playerId, stat);
            if (total > this.config.statCaps[stat]) {
                stats.allocated[stat] -= (total - this.config.statCaps[stat]);
            }
        }
        
        // Recalculate secondary stats
        this.calculateSecondaryStats(stats);
        
        // Check for synergies
        this.checkSynergies(playerId);
        
        return {
            success: true,
            stats: this.getAllStats(playerId)
        };
    }
    
    /**
     * Calculate all secondary stats
     */
    calculateSecondaryStats(stats) {
        const primaryStats = {};
        for (const stat of this.config.primaryStats) {
            primaryStats[stat] = this.getTotalStat(stats.id, stat);
        }
        
        // Calculate each secondary stat
        for (const [name, calculator] of Object.entries(this.config.secondaryStats)) {
            stats.secondary[name] = calculator(primaryStats);
        }
        
        // Apply synergy bonuses
        for (const synergy of stats.synergies) {
            for (const [stat, bonus] of Object.entries(synergy.bonus)) {
                stats.secondary[stat] = (stats.secondary[stat] || 0) + bonus;
            }
        }
        
        return stats.secondary;
    }
    
    /**
     * Check for stat synergies
     */
    checkSynergies(playerId) {
        const stats = this.players.get(playerId);
        if (!stats) return;
        
        stats.synergies = [];
        
        for (const synergy of this.config.synergies) {
            let qualifies = true;
            
            for (const stat of synergy.stats) {
                if (this.getTotalStat(playerId, stat) < synergy.threshold) {
                    qualifies = false;
                    break;
                }
            }
            
            if (qualifies) {
                stats.synergies.push(synergy);
            }
        }
        
        // Recalculate secondary stats with new synergies
        this.calculateSecondaryStats(stats);
    }
    
    /**
     * Add stat modifier (from gear, buff, etc)
     */
    addModifier(playerId, modifierId, modifications, duration = null) {
        const modifiers = this.modifiers.get(playerId);
        if (!modifiers) return;
        
        const modifier = {
            id: modifierId,
            modifications: modifications,
            expiresAt: duration ? Date.now() + duration : null
        };
        
        modifiers.push(modifier);
        
        // Apply modifier
        const stats = this.players.get(playerId);
        for (const [stat, value] of Object.entries(modifications)) {
            if (this.config.primaryStats.includes(stat)) {
                stats.modifiers[stat] = (stats.modifiers[stat] || 0) + value;
            }
        }
        
        // Recalculate
        this.calculateSecondaryStats(stats);
        this.checkSynergies(playerId);
        
        return modifier;
    }
    
    /**
     * Remove stat modifier
     */
    removeModifier(playerId, modifierId) {
        const modifiers = this.modifiers.get(playerId);
        if (!modifiers) return;
        
        const index = modifiers.findIndex(m => m.id === modifierId);
        if (index === -1) return;
        
        const modifier = modifiers[index];
        modifiers.splice(index, 1);
        
        // Remove modifier effects
        const stats = this.players.get(playerId);
        for (const [stat, value] of Object.entries(modifier.modifications)) {
            if (this.config.primaryStats.includes(stat)) {
                stats.modifiers[stat] = (stats.modifiers[stat] || 0) - value;
            }
        }
        
        // Recalculate
        this.calculateSecondaryStats(stats);
        this.checkSynergies(playerId);
    }
    
    /**
     * Respec all allocated stats
     */
    respecStats(playerId) {
        const stats = this.players.get(playerId);
        if (!stats) return { success: false };
        
        // Get total allocated points
        const totalPoints = Object.values(stats.allocated).reduce((sum, val) => sum + val, 0);
        
        // Reset allocations
        stats.allocated = {
            strength: 0,
            agility: 0,
            intelligence: 0,
            vitality: 0,
            wisdom: 0,
            luck: 0
        };
        
        stats.respecCount++;
        
        // Recalculate
        this.calculateSecondaryStats(stats);
        this.checkSynergies(playerId);
        
        return {
            success: true,
            pointsReturned: totalPoints,
            respecCount: stats.respecCount
        };
    }
    
    /**
     * Get all stats for a player
     */
    getAllStats(playerId) {
        const stats = this.players.get(playerId);
        if (!stats) return null;
        
        const result = {
            primary: {},
            secondary: { ...stats.secondary },
            current: { ...stats.current },
            synergies: stats.synergies.map(s => s.name)
        };
        
        for (const stat of this.config.primaryStats) {
            result.primary[stat] = {
                base: stats.base[stat],
                allocated: stats.allocated[stat],
                modifier: stats.modifiers[stat],
                total: this.getTotalStat(playerId, stat),
                cap: this.config.statCaps[stat]
            };
        }
        
        return result;
    }
    
    /**
     * Update current values (HP, Mana, Stamina)
     */
    updateCurrent(playerId, stat, value) {
        const stats = this.players.get(playerId);
        if (!stats) return;
        
        const maxStat = stats.secondary[`max${stat.charAt(0).toUpperCase() + stat.slice(1)}`];
        stats.current[stat] = Math.max(0, Math.min(value, maxStat));
        
        return stats.current[stat];
    }
    
    /**
     * Regenerate HP/Mana/Stamina
     */
    regenerate(playerId, deltaTime) {
        const stats = this.players.get(playerId);
        if (!stats) return;
        
        const regenPerSecond = {
            hp: stats.secondary.hpRegen,
            mana: stats.secondary.manaRegen,
            stamina: stats.secondary.staminaRegen
        };
        
        for (const [stat, regen] of Object.entries(regenPerSecond)) {
            const current = stats.current[stat];
            const max = stats.secondary[`max${stat.charAt(0).toUpperCase() + stat.slice(1)}`];
            
            if (current < max) {
                stats.current[stat] = Math.min(max, current + (regen * deltaTime));
            }
        }
    }
    
    /**
     * Update expired modifiers
     */
    update(deltaTime) {
        const now = Date.now();
        
        for (const [playerId, modifiers] of this.modifiers.entries()) {
            const expiredModifiers = modifiers.filter(m => m.expiresAt && m.expiresAt <= now);
            
            for (const modifier of expiredModifiers) {
                this.removeModifier(playerId, modifier.id);
            }
        }
    }
}
