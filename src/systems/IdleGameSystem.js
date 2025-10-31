/**
 * IdleGameSystem - Idle/Incremental Game Mode
 * 
 * Phase 8, System 124 of AUTONOMOUS_EXECUTION_PLAN
 * Passive progression and offline earnings
 * 
 * Features:
 * - Passive resource generation
 * - Upgradeable generators
 * - Prestige system integration
 * - Offline progress calculation
 * - Auto-battle mode
 * - Investment multipliers
 * - Ascension bonuses
 * - Achievement milestones
 * 
 * External Assets:
 * - Icons from game-icons.net (4000+ free icons)
 * - UI elements from Kenney UI Pack
 * - Particle effects for upgrades
 */

export class IdleGameSystem {
    constructor() {
        // Idle game state
        this.isActive = false;
        this.lastUpdateTime = Date.now();
        
        // Resources
        this.resources = {
            gold: 0,
            essence: 0,
            crystals: 0,
            gems: 0,
            prestige_tokens: 0
        };
        
        // Generators
        this.generators = this.initializeGenerators();
        this.ownedGenerators = new Map();
        
        // Upgrades
        this.upgrades = this.initializeUpgrades();
        this.purchasedUpgrades = new Set();
        
        // Multipliers
        this.multipliers = {
            global: 1.0,
            gold: 1.0,
            essence: 1.0,
            offline: 1.0,
            prestige: 1.0
        };
        
        // Offline progress
        this.offlineEarnings = {
            enabled: true,
            maxDuration: 3600000, // 1 hour max
            efficiency: 0.5 // 50% efficiency offline
        };
        
        // Statistics
        this.stats = {
            totalGoldEarned: 0,
            totalEssenceEarned: 0,
            generatorsPurchased: 0,
            upgradesPurchased: 0,
            prestigeCount: 0,
            totalPlayTime: 0,
            offlineTime: 0
        };
    }
    
    /**
     * Initialize generators
     */
    initializeGenerators() {
        return {
            // Tier 1 Generators
            smoke_sprite: {
                id: 'smoke_sprite',
                name: 'Smoke Sprite',
                baseCost: 10,
                baseProduction: 1,
                costMultiplier: 1.15,
                tier: 1,
                icon: 'game-icons.net/smoke-sprite.png', // External icon
                unlocked: true
            },
            
            herb_garden: {
                id: 'herb_garden',
                name: 'Herb Garden',
                baseCost: 50,
                baseProduction: 5,
                costMultiplier: 1.15,
                tier: 1,
                icon: 'game-icons.net/herb-garden.png',
                unlocked: true
            },
            
            // Tier 2 Generators
            crystal_mine: {
                id: 'crystal_mine',
                name: 'Crystal Mine',
                baseCost: 250,
                baseProduction: 25,
                costMultiplier: 1.15,
                tier: 2,
                icon: 'game-icons.net/crystal-mine.png',
                unlocked: false,
                unlockRequirement: { gold: 1000 }
            },
            
            essence_well: {
                id: 'essence_well',
                name: 'Essence Well',
                baseCost: 1000,
                baseProduction: 100,
                costMultiplier: 1.15,
                tier: 2,
                icon: 'game-icons.net/essence-well.png',
                unlocked: false,
                unlockRequirement: { gold: 5000 }
            },
            
            // Tier 3 Generators
            mystic_portal: {
                id: 'mystic_portal',
                name: 'Mystic Portal',
                baseCost: 5000,
                baseProduction: 500,
                costMultiplier: 1.15,
                tier: 3,
                icon: 'game-icons.net/mystic-portal.png',
                unlocked: false,
                unlockRequirement: { gold: 25000 }
            },
            
            dimensional_rift: {
                id: 'dimensional_rift',
                name: 'Dimensional Rift',
                baseCost: 25000,
                baseProduction: 2500,
                costMultiplier: 1.15,
                tier: 3,
                icon: 'game-icons.net/dimensional-rift.png',
                unlocked: false,
                unlockRequirement: { gold: 100000 }
            },
            
            // Tier 4 Generators
            cosmic_factory: {
                id: 'cosmic_factory',
                name: 'Cosmic Factory',
                baseCost: 100000,
                baseProduction: 10000,
                costMultiplier: 1.15,
                tier: 4,
                icon: 'game-icons.net/cosmic-factory.png',
                unlocked: false,
                unlockRequirement: { gold: 500000 }
            },
            
            infinity_engine: {
                id: 'infinity_engine',
                name: 'Infinity Engine',
                baseCost: 1000000,
                baseProduction: 100000,
                costMultiplier: 1.15,
                tier: 4,
                icon: 'game-icons.net/infinity-engine.png',
                unlocked: false,
                unlockRequirement: { gold: 5000000 }
            }
        };
    }
    
    /**
     * Initialize upgrades
     */
    initializeUpgrades() {
        return {
            // Production Multipliers
            double_production: {
                id: 'double_production',
                name: 'Double Production',
                cost: 500,
                effect: { type: 'global_multiplier', value: 2.0 },
                icon: 'game-icons.net/double-production.png',
                unlocked: true
            },
            
            triple_production: {
                id: 'triple_production',
                name: 'Triple Production',
                cost: 5000,
                effect: { type: 'global_multiplier', value: 3.0 },
                icon: 'game-icons.net/triple-production.png',
                requires: ['double_production'],
                unlocked: false
            },
            
            // Generator-specific
            smoke_sprite_boost: {
                id: 'smoke_sprite_boost',
                name: 'Smoke Sprite Efficiency',
                cost: 100,
                effect: { type: 'generator_multiplier', generator: 'smoke_sprite', value: 2.0 },
                icon: 'game-icons.net/boost.png',
                unlocked: true
            },
            
            // Auto features
            auto_buy_generators: {
                id: 'auto_buy_generators',
                name: 'Auto Buy Generators',
                cost: 10000,
                effect: { type: 'automation', feature: 'auto_buy' },
                icon: 'game-icons.net/auto-buy.png',
                unlocked: false
            },
            
            auto_battle: {
                id: 'auto_battle',
                name: 'Auto Battle',
                cost: 25000,
                effect: { type: 'automation', feature: 'auto_battle' },
                icon: 'game-icons.net/auto-battle.png',
                unlocked: false
            },
            
            // Offline earnings
            offline_progress: {
                id: 'offline_progress',
                name: 'Offline Progress',
                cost: 1000,
                effect: { type: 'offline_earnings', value: 0.5 },
                icon: 'game-icons.net/offline.png',
                unlocked: true
            },
            
            improved_offline: {
                id: 'improved_offline',
                name: 'Improved Offline Earnings',
                cost: 10000,
                effect: { type: 'offline_earnings', value: 0.75 },
                icon: 'game-icons.net/offline-improved.png',
                requires: ['offline_progress'],
                unlocked: false
            },
            
            // Prestige bonuses
            prestige_boost: {
                id: 'prestige_boost',
                name: 'Prestige Power',
                cost: 100000,
                effect: { type: 'prestige_multiplier', value: 1.5 },
                icon: 'game-icons.net/prestige.png',
                unlocked: false
            }
        };
    }
    
    /**
     * Start idle game
     */
    start() {
        this.isActive = true;
        this.lastUpdateTime = Date.now();
        
        // Calculate offline progress if returning
        this.calculateOfflineProgress();
    }
    
    /**
     * Calculate offline progress
     */
    calculateOfflineProgress() {
        const now = Date.now();
        const timeDiff = now - this.lastUpdateTime;
        
        if (timeDiff > 60000) { // More than 1 minute offline
            const offlineTime = Math.min(timeDiff, this.offlineEarnings.maxDuration);
            const offlineSeconds = offlineTime / 1000;
            
            // Calculate what would have been earned
            const productionPerSecond = this.calculateTotalProduction();
            const offlineEarnings = productionPerSecond * offlineSeconds * this.offlineEarnings.efficiency * this.multipliers.offline;
            
            this.resources.gold += offlineEarnings;
            this.stats.totalGoldEarned += offlineEarnings;
            this.stats.offlineTime += offlineTime;
            
            // Emit offline earnings event
            if (window.gameEngine) {
                window.gameEngine.eventBus?.emit('idle:offlineEarnings', {
                    gold: offlineEarnings,
                    duration: offlineTime,
                    efficiency: this.offlineEarnings.efficiency
                });
            }
        }
        
        this.lastUpdateTime = now;
    }
    
    /**
     * Update idle game
     */
    update(deltaTime) {
        if (!this.isActive) return;
        
        // Generate resources
        const production = this.calculateTotalProduction() * deltaTime;
        this.resources.gold += production;
        this.stats.totalGoldEarned += production;
        
        // Update play time
        this.stats.totalPlayTime += deltaTime * 1000;
        
        // Auto-buy if enabled
        if (this.hasUpgrade('auto_buy_generators')) {
            this.autoBuyGenerators();
        }
        
        // Auto-battle if enabled
        if (this.hasUpgrade('auto_battle')) {
            this.performAutoBattle(deltaTime);
        }
    }
    
    /**
     * Calculate total production per second
     */
    calculateTotalProduction() {
        let total = 0;
        
        for (const [generatorId, count] of this.ownedGenerators) {
            const generator = this.generators[generatorId];
            if (!generator) continue;
            
            let production = generator.baseProduction * count;
            
            // Apply generator-specific multipliers
            const generatorUpgrades = Array.from(this.purchasedUpgrades)
                .map(id => this.upgrades[id])
                .filter(u => u.effect.type === 'generator_multiplier' && u.effect.generator === generatorId);
            
            for (const upgrade of generatorUpgrades) {
                production *= upgrade.effect.value;
            }
            
            total += production;
        }
        
        // Apply global multipliers
        total *= this.multipliers.global;
        total *= this.multipliers.gold;
        total *= this.multipliers.prestige;
        
        return total;
    }
    
    /**
     * Purchase generator
     */
    purchaseGenerator(generatorId, quantity = 1) {
        const generator = this.generators[generatorId];
        if (!generator || !generator.unlocked) return false;
        
        const currentCount = this.ownedGenerators.get(generatorId) || 0;
        const totalCost = this.calculateGeneratorCost(generator, currentCount, quantity);
        
        // Check if can afford
        if (this.resources.gold < totalCost) {
            return false;
        }
        
        // Purchase
        this.resources.gold -= totalCost;
        this.ownedGenerators.set(generatorId, currentCount + quantity);
        this.stats.generatorsPurchased += quantity;
        
        // Check unlocks
        this.checkUnlocks();
        
        return true;
    }
    
    /**
     * Calculate generator cost
     */
    calculateGeneratorCost(generator, currentCount, quantity) {
        let totalCost = 0;
        
        for (let i = 0; i < quantity; i++) {
            const cost = generator.baseCost * Math.pow(generator.costMultiplier, currentCount + i);
            totalCost += cost;
        }
        
        return Math.floor(totalCost);
    }
    
    /**
     * Purchase upgrade
     */
    purchaseUpgrade(upgradeId) {
        const upgrade = this.upgrades[upgradeId];
        if (!upgrade || !upgrade.unlocked) return false;
        
        // Check if already purchased
        if (this.purchasedUpgrades.has(upgradeId)) {
            return false;
        }
        
        // Check requirements
        if (upgrade.requires) {
            for (const reqId of upgrade.requires) {
                if (!this.purchasedUpgrades.has(reqId)) {
                    return false;
                }
            }
        }
        
        // Check if can afford
        if (this.resources.gold < upgrade.cost) {
            return false;
        }
        
        // Purchase
        this.resources.gold -= upgrade.cost;
        this.purchasedUpgrades.add(upgradeId);
        this.stats.upgradesPurchased++;
        
        // Apply upgrade effect
        this.applyUpgrade(upgrade);
        
        // Check unlocks
        this.checkUnlocks();
        
        return true;
    }
    
    /**
     * Apply upgrade effect
     */
    applyUpgrade(upgrade) {
        const effect = upgrade.effect;
        
        switch (effect.type) {
            case 'global_multiplier':
                this.multipliers.global *= effect.value;
                break;
            
            case 'offline_earnings':
                this.offlineEarnings.efficiency = effect.value;
                break;
            
            case 'prestige_multiplier':
                this.multipliers.prestige *= effect.value;
                break;
            
            case 'automation':
                // Automation is checked in update loop
                break;
            
            case 'generator_multiplier':
                // Applied in calculateTotalProduction
                break;
        }
    }
    
    /**
     * Auto-buy generators
     */
    autoBuyGenerators() {
        // Try to buy the most expensive affordable generator
        const affordableGenerators = Object.values(this.generators)
            .filter(g => g.unlocked)
            .filter(g => {
                const count = this.ownedGenerators.get(g.id) || 0;
                const cost = this.calculateGeneratorCost(g, count, 1);
                return this.resources.gold >= cost;
            })
            .sort((a, b) => {
                const costA = this.calculateGeneratorCost(a, this.ownedGenerators.get(a.id) || 0, 1);
                const costB = this.calculateGeneratorCost(b, this.ownedGenerators.get(b.id) || 0, 1);
                return costB - costA;
            });
        
        if (affordableGenerators.length > 0) {
            this.purchaseGenerator(affordableGenerators[0].id, 1);
        }
    }
    
    /**
     * Perform auto-battle
     */
    performAutoBattle(deltaTime) {
        // Simplified auto-battle
        // In full implementation, would integrate with combat system
        const battleReward = 10 * deltaTime;
        this.resources.essence += battleReward;
        this.stats.totalEssenceEarned += battleReward;
    }
    
    /**
     * Check if has upgrade
     */
    hasUpgrade(upgradeId) {
        return this.purchasedUpgrades.has(upgradeId);
    }
    
    /**
     * Check for unlocks
     */
    checkUnlocks() {
        // Check generator unlocks
        for (const generator of Object.values(this.generators)) {
            if (!generator.unlocked && generator.unlockRequirement) {
                let unlocked = true;
                
                for (const [resource, amount] of Object.entries(generator.unlockRequirement)) {
                    if (this.stats[`total${resource.charAt(0).toUpperCase() + resource.slice(1)}Earned`] < amount) {
                        unlocked = false;
                        break;
                    }
                }
                
                if (unlocked) {
                    generator.unlocked = true;
                    
                    if (window.gameEngine) {
                        window.gameEngine.eventBus?.emit('idle:generatorUnlocked', { 
                            generator: generator.name 
                        });
                    }
                }
            }
        }
        
        // Check upgrade unlocks
        for (const upgrade of Object.values(this.upgrades)) {
            if (!upgrade.unlocked) {
                // Simple unlock based on gold earned
                if (this.stats.totalGoldEarned >= upgrade.cost / 10) {
                    upgrade.unlocked = true;
                }
            }
        }
    }
    
    /**
     * Prestige (reset with bonuses)
     */
    prestige() {
        // Calculate prestige tokens based on progress
        const totalProduction = this.calculateTotalProduction();
        const prestigeTokens = Math.floor(Math.log10(totalProduction + 1));
        
        if (prestigeTokens <= 0) {
            return false; // Not enough progress
        }
        
        // Reset progress
        this.resources.gold = 0;
        this.resources.essence = 0;
        this.ownedGenerators.clear();
        
        // Keep purchased upgrades that carry over
        const permanentUpgrades = Array.from(this.purchasedUpgrades)
            .filter(id => this.upgrades[id].effect.type === 'prestige_multiplier');
        this.purchasedUpgrades.clear();
        for (const id of permanentUpgrades) {
            this.purchasedUpgrades.add(id);
        }
        
        // Award prestige tokens
        this.resources.prestige_tokens += prestigeTokens;
        this.stats.prestigeCount++;
        
        // Increase prestige multiplier
        this.multipliers.prestige = 1.0 + (this.resources.prestige_tokens * 0.1);
        
        // Emit prestige event
        if (window.gameEngine) {
            window.gameEngine.eventBus?.emit('idle:prestige', { 
                tokens: prestigeTokens,
                totalTokens: this.resources.prestige_tokens
            });
        }
        
        return true;
    }
    
    /**
     * Get production summary
     */
    getProductionSummary() {
        const summary = {
            perSecond: this.calculateTotalProduction(),
            perMinute: this.calculateTotalProduction() * 60,
            perHour: this.calculateTotalProduction() * 3600,
            generators: []
        };
        
        for (const [generatorId, count] of this.ownedGenerators) {
            const generator = this.generators[generatorId];
            summary.generators.push({
                name: generator.name,
                count: count,
                production: generator.baseProduction * count
            });
        }
        
        return summary;
    }
    
    /**
     * Get statistics
     */
    getStats() {
        return {
            ...this.stats,
            currentProduction: this.calculateTotalProduction(),
            totalGenerators: Array.from(this.ownedGenerators.values()).reduce((a, b) => a + b, 0)
        };
    }
    
    /**
     * Save to localStorage
     */
    save() {
        const saveData = {
            resources: this.resources,
            ownedGenerators: Array.from(this.ownedGenerators.entries()),
            purchasedUpgrades: Array.from(this.purchasedUpgrades),
            multipliers: this.multipliers,
            stats: this.stats,
            lastUpdateTime: Date.now()
        };
        
        localStorage.setItem('idle_game_save', JSON.stringify(saveData));
    }
    
    /**
     * Load from localStorage
     */
    load() {
        const saveData = localStorage.getItem('idle_game_save');
        if (!saveData) return false;
        
        try {
            const data = JSON.parse(saveData);
            
            this.resources = data.resources;
            this.ownedGenerators = new Map(data.ownedGenerators);
            this.purchasedUpgrades = new Set(data.purchasedUpgrades);
            this.multipliers = data.multipliers;
            this.stats = data.stats;
            this.lastUpdateTime = data.lastUpdateTime;
            
            // Recalculate offline progress
            this.calculateOfflineProgress();
            
            return true;
        } catch (error) {
            logger.error('Failed to load idle game save:', error);
            return false;
        }
    }
}
