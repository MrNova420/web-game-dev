/**
 * TradingSystem.js
 * Handles NPC traders, traveling merchants, trade quests, and bartering
 * Part of Phase 4: Crafting & Economy
 */

export class TradingSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // Active traders
        this.activeTraders = new Map();
        this.traderSpawnPoints = [];
        
        // Trade offers
        this.availableTrades = [];
        this.completedTrades = new Set();
        
        // Trade quests
        this.tradeQuests = [];
        this.activeTradeQuests = [];
        
        // Barter system
        this.barterOffers = new Map();
        
        this.initializeTraders();
        this.initializeTradeQuests();
    }
    
    /**
     * Initialize trader types
     */
    initializeTraders() {
        this.traderTypes = {
            // Dungeon trader - appears in dungeons
            dungeon_trader: {
                name: 'Dungeon Trader',
                description: 'Offers emergency supplies',
                spawnChance: 0.15, // 15% per floor
                location: 'dungeon',
                offerTypes: ['healing', 'emergency_gear', 'escape_items'],
                trades: [
                    {
                        id: 'dt_health_potion',
                        give: { gold: 100 },
                        receive: { 
                            type: 'consumable',
                            name: 'Health Potion',
                            effect: 'heal',
                            value: 50
                        }
                    },
                    {
                        id: 'dt_mana_potion',
                        give: { gold: 100 },
                        receive: {
                            type: 'consumable',
                            name: 'Mana Potion',
                            effect: 'mana',
                            value: 50
                        }
                    },
                    {
                        id: 'dt_escape_scroll',
                        give: { gold: 500 },
                        receive: {
                            type: 'consumable',
                            name: 'Scroll of Escape',
                            effect: 'teleport',
                            value: 1
                        }
                    }
                ]
            },
            
            // Wandering merchant - rare, good deals
            wandering_merchant: {
                name: 'Wandering Merchant',
                description: 'Sells rare and exotic goods',
                spawnChance: 0.05, // 5% per floor
                location: 'random',
                offerTypes: ['rare_items', 'materials', 'special_goods'],
                trades: [],
                dynamicInventory: true
            },
            
            // Material exchanger - trades materials
            material_exchanger: {
                name: 'Material Exchanger',
                description: 'Exchanges crafting materials',
                spawnChance: 0.1, // 10% per floor
                location: 'dungeon',
                offerTypes: ['material_exchange'],
                trades: [
                    {
                        id: 'me_common_to_uncommon',
                        give: { material: 'essence_shard', amount: 10 },
                        receive: { material: 'mystical_ore', amount: 1 }
                    },
                    {
                        id: 'me_uncommon_to_rare',
                        give: { material: 'mystical_ore', amount: 5 },
                        receive: { material: 'void_essence', amount: 1 }
                    },
                    {
                        id: 'me_rare_to_epic',
                        give: { material: 'void_essence', amount: 3 },
                        receive: { material: 'primordial_dust', amount: 1 }
                    }
                ]
            },
            
            // Gear exchanger - trades equipment
            gear_exchanger: {
                name: 'Gear Exchanger',
                description: 'Exchanges equipment for different items',
                spawnChance: 0.08, // 8% per floor
                location: 'dungeon',
                offerTypes: ['gear_exchange'],
                acceptsItems: true
            },
            
            // Quest trader - offers special trade quests
            quest_trader: {
                name: 'Quest Trader',
                description: 'Offers trading challenges',
                spawnChance: 0.06, // 6% per floor
                location: 'special',
                offerTypes: ['trade_quests'],
                questGiver: true
            }
        };
    }
    
    /**
     * Initialize trade quests
     */
    initializeTradeQuests() {
        this.tradeQuestTemplates = [
            {
                id: 'tq_material_collection',
                name: 'Material Collector',
                description: 'Deliver specific materials',
                type: 'collection',
                requirements: [
                    { material: 'essence_shard', amount: 50 },
                    { material: 'mystical_ore', amount: 20 }
                ],
                rewards: {
                    gold: 2000,
                    exp: 500,
                    item: {
                        type: 'weapon',
                        rarity: 'rare'
                    }
                },
                repeatable: true,
                cooldown: 3600000 // 1 hour
            },
            {
                id: 'tq_rare_item_hunt',
                name: 'Rare Item Hunter',
                description: 'Find and deliver a rare item',
                type: 'item_delivery',
                requirements: [
                    { itemType: 'weapon', minRarity: 'rare', amount: 1 }
                ],
                rewards: {
                    gold: 5000,
                    gems: 10,
                    materials: [
                        { id: 'celestial_fragment', amount: 2 }
                    ]
                },
                repeatable: false
            },
            {
                id: 'tq_bulk_trade',
                name: 'Bulk Trader',
                description: 'Trade multiple items for a reward package',
                type: 'bulk_trade',
                requirements: [
                    { itemType: 'any', minRarity: 'uncommon', amount: 10 }
                ],
                rewards: {
                    gold: 3000,
                    exp: 1000,
                    randomItems: 5
                },
                repeatable: true,
                cooldown: 7200000 // 2 hours
            },
            {
                id: 'tq_artifact_exchange',
                name: 'Artifact Exchange',
                description: 'Exchange artifacts for legendary rewards',
                type: 'special',
                requirements: [
                    { material: 'godstone', amount: 1 },
                    { gold: 10000 }
                ],
                rewards: {
                    item: {
                        type: 'weapon',
                        rarity: 'legendary',
                        guaranteed: true
                    },
                    gems: 50
                },
                repeatable: false,
                unlockRequirement: { floor: 50 }
            }
        ];
    }
    
    /**
     * Spawn trader in dungeon
     */
    spawnTrader(floor, location = 'dungeon') {
        // Check each trader type for spawn
        for (const [traderType, config] of Object.entries(this.traderTypes)) {
            if (config.location !== location && config.location !== 'random') continue;
            
            if (Math.random() < config.spawnChance) {
                const trader = this.createTrader(traderType, floor);
                if (trader) {
                    this.activeTraders.set(trader.id, trader);
                    console.log(`🧙 ${trader.name} has appeared!`);
                    return trader;
                }
            }
        }
        
        return null;
    }
    
    /**
     * Create trader instance
     */
    createTrader(traderType, floor) {
        const config = this.traderTypes[traderType];
        if (!config) return null;
        
        const trader = {
            id: `trader_${traderType}_${Date.now()}`,
            type: traderType,
            name: config.name,
            description: config.description,
            floor: floor,
            spawnTime: Date.now(),
            location: this.generateTraderLocation(),
            ...config
        };
        
        // Generate dynamic inventory if needed
        if (config.dynamicInventory) {
            trader.trades = this.generateDynamicTrades(floor, config);
        }
        
        return trader;
    }
    
    /**
     * Generate dynamic trade offers
     */
    generateDynamicTrades(floor, config) {
        const trades = [];
        const numTrades = 3 + Math.floor(Math.random() * 3); // 3-5 trades
        
        for (let i = 0; i < numTrades; i++) {
            const trade = this.generateRandomTrade(floor);
            if (trade) {
                trades.push(trade);
            }
        }
        
        return trades;
    }
    
    /**
     * Generate random trade offer
     */
    generateRandomTrade(floor) {
        const tradeTypes = ['item_for_gold', 'material_for_item', 'item_for_item'];
        const tradeType = tradeTypes[Math.floor(Math.random() * tradeTypes.length)];
        
        switch (tradeType) {
            case 'item_for_gold':
                return {
                    id: `trade_${Date.now()}_${Math.random()}`,
                    give: { gold: Math.floor(500 + floor * 50 + Math.random() * 500) },
                    receive: this.generateRandomItem(floor, 'uncommon')
                };
                
            case 'material_for_item':
                return {
                    id: `trade_${Date.now()}_${Math.random()}`,
                    give: { 
                        material: this.getRandomMaterial('common'),
                        amount: 10 + Math.floor(Math.random() * 20)
                    },
                    receive: this.generateRandomItem(floor, 'rare')
                };
                
            case 'item_for_item':
                return {
                    id: `trade_${Date.now()}_${Math.random()}`,
                    give: { item: this.generateRandomItem(floor, 'uncommon') },
                    receive: this.generateRandomItem(floor, 'rare')
                };
        }
        
        return null;
    }
    
    /**
     * Generate random item for trade
     */
    generateRandomItem(floor, minRarity = 'common') {
        const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
        const minIndex = rarities.indexOf(minRarity);
        const rarity = rarities[minIndex + Math.floor(Math.random() * (rarities.length - minIndex))];
        
        const types = ['weapon', 'armor', 'accessory', 'consumable'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        return {
            type: type,
            rarity: rarity,
            level: floor,
            name: `${rarity} ${type}`,
            stats: this.generateItemStats(type, rarity, floor)
        };
    }
    
    /**
     * Generate item stats for trade
     */
    generateItemStats(type, rarity, floor) {
        const baseValue = {
            common: 10,
            uncommon: 25,
            rare: 50,
            epic: 100,
            legendary: 200
        }[rarity] || 10;
        
        const multiplier = 1 + (floor * 0.1);
        const stats = {};
        
        switch (type) {
            case 'weapon':
                stats.attack = Math.floor(baseValue * multiplier);
                break;
            case 'armor':
                stats.defense = Math.floor(baseValue * multiplier);
                stats.hp = Math.floor(baseValue * 2 * multiplier);
                break;
            case 'accessory':
                stats.attack = Math.floor(baseValue * 0.5 * multiplier);
                stats.defense = Math.floor(baseValue * 0.5 * multiplier);
                break;
        }
        
        return stats;
    }
    
    /**
     * Get random material
     */
    getRandomMaterial(rarity = 'common') {
        const materials = {
            common: ['essence_shard', 'monster_hide', 'bone_fragment'],
            uncommon: ['mystical_ore', 'corrupted_crystal', 'ethereal_fiber'],
            rare: ['dragons_scale', 'void_essence', 'phoenix_feather'],
            epic: ['celestial_fragment', 'primordial_dust', 'arcane_catalyst'],
            legendary: ['godstone', 'chaos_core', 'reality_crystal']
        };
        
        const pool = materials[rarity] || materials.common;
        return pool[Math.floor(Math.random() * pool.length)];
    }
    
    /**
     * Generate trader location
     */
    generateTraderLocation() {
        return {
            x: Math.random() * 100 - 50,
            y: 1,
            z: Math.random() * 100 - 50
        };
    }
    
    /**
     * Execute trade
     */
    executeTrade(traderId, tradeId) {
        const trader = this.activeTraders.get(traderId);
        if (!trader) {
            return { success: false, reason: 'Trader not found' };
        }
        
        const trade = trader.trades.find(t => t.id === tradeId);
        if (!trade) {
            return { success: false, reason: 'Trade not found' };
        }
        
        // Validate player has required items/currency
        const validation = this.validateTradeRequirements(trade.give);
        if (!validation.success) {
            return validation;
        }
        
        // Take required items/currency
        this.consumeTradeRequirements(trade.give);
        
        // Give rewards
        this.giveTradeRewards(trade.receive);
        
        // Mark trade as completed
        this.completedTrades.add(tradeId);
        
        // Remove from trader's available trades
        const index = trader.trades.indexOf(trade);
        if (index > -1) {
            trader.trades.splice(index, 1);
        }
        
        return {
            success: true,
            trade: trade,
            message: `Trade completed with ${trader.name}!`
        };
    }
    
    /**
     * Validate trade requirements
     */
    validateTradeRequirements(requirements) {
        if (requirements.gold) {
            if (this.gameEngine.economySystem) {
                if (this.gameEngine.economySystem.getCurrency('gold') < requirements.gold) {
                    return { success: false, reason: 'Not enough gold' };
                }
            }
        }
        
        if (requirements.material && requirements.amount) {
            if (this.gameEngine.craftingSystem) {
                const count = this.gameEngine.craftingSystem.getMaterialCount(requirements.material);
                if (count < requirements.amount) {
                    return { success: false, reason: `Not enough ${requirements.material}` };
                }
            }
        }
        
        if (requirements.item) {
            // Check if player has the item in inventory
            if (this.gameEngine.inventorySystem) {
                const hasItem = this.gameEngine.inventorySystem.hasItem(requirements.item);
                if (!hasItem) {
                    return { success: false, reason: 'Required item not in inventory' };
                }
            }
        }
        
        return { success: true };
    }
    
    /**
     * Consume trade requirements
     */
    consumeTradeRequirements(requirements) {
        if (requirements.gold && this.gameEngine.economySystem) {
            this.gameEngine.economySystem.removeCurrency('gold', requirements.gold);
        }
        
        if (requirements.material && requirements.amount && this.gameEngine.craftingSystem) {
            this.gameEngine.craftingSystem.removeMaterial(requirements.material, requirements.amount);
        }
        
        if (requirements.item && this.gameEngine.inventorySystem) {
            this.gameEngine.inventorySystem.removeItem(requirements.item.id || requirements.item);
        }
    }
    
    /**
     * Give trade rewards
     */
    giveTradeRewards(rewards) {
        if (rewards.gold && this.gameEngine.economySystem) {
            this.gameEngine.economySystem.addCurrency('gold', rewards.gold);
        }
        
        if (rewards.gems && this.gameEngine.economySystem) {
            this.gameEngine.economySystem.addCurrency('gems', rewards.gems);
        }
        
        if (rewards.material && rewards.amount && this.gameEngine.craftingSystem) {
            this.gameEngine.craftingSystem.addMaterial(rewards.material, rewards.amount);
        }
        
        if (rewards.type && this.gameEngine.inventorySystem) {
            // Add item to inventory
            this.gameEngine.inventorySystem.addItem(rewards);
        }
        
        if (rewards.materials && this.gameEngine.craftingSystem) {
            for (const mat of rewards.materials) {
                this.gameEngine.craftingSystem.addMaterial(mat.id, mat.amount);
            }
        }
    }
    
    /**
     * Barter with trader
     */
    proposeBarterOffer(traderId, offerItems, requestItems) {
        const trader = this.activeTraders.get(traderId);
        if (!trader) {
            return { success: false, reason: 'Trader not found' };
        }
        
        // Calculate offer value
        const offerValue = this.calculateItemsValue(offerItems);
        const requestValue = this.calculateItemsValue(requestItems);
        
        // Trader accepts if offer is >= 120% of request value
        const acceptanceRatio = 1.2;
        const accepted = offerValue >= requestValue * acceptanceRatio;
        
        if (accepted) {
            // Execute barter
            for (const item of offerItems) {
                if (this.gameEngine.inventorySystem) {
                    this.gameEngine.inventorySystem.removeItem(item.id);
                }
            }
            
            for (const item of requestItems) {
                if (this.gameEngine.inventorySystem) {
                    this.gameEngine.inventorySystem.addItem(item);
                }
            }
            
            return {
                success: true,
                message: 'Barter accepted!',
                offerValue: offerValue,
                requestValue: requestValue
            };
        } else {
            // Trader makes counter-offer
            const counterOffer = {
                ...requestItems,
                adjustedValue: offerValue / acceptanceRatio
            };
            
            return {
                success: false,
                reason: 'Offer too low',
                counterOffer: counterOffer,
                offerValue: offerValue,
                requestValue: requestValue
            };
        }
    }
    
    /**
     * Calculate total value of items
     */
    calculateItemsValue(items) {
        let totalValue = 0;
        
        for (const item of items) {
            if (this.gameEngine.enhancementSystem) {
                totalValue += this.gameEngine.enhancementSystem.getItemPowerLevel(item);
            } else {
                // Fallback calculation
                const rarityValues = {
                    common: 50,
                    uncommon: 150,
                    rare: 500,
                    epic: 2000,
                    legendary: 10000
                };
                totalValue += rarityValues[item.rarity] || 50;
            }
        }
        
        return totalValue;
    }
    
    /**
     * Create trade quest
     */
    createTradeQuest(templateId) {
        const template = this.tradeQuestTemplates.find(t => t.id === templateId);
        if (!template) return null;
        
        const quest = {
            ...template,
            questId: `${templateId}_${Date.now()}`,
            startTime: Date.now(),
            progress: {},
            completed: false
        };
        
        // Initialize progress tracking
        for (const req of template.requirements) {
            if (req.material) {
                quest.progress[req.material] = 0;
            } else if (req.itemType) {
                quest.progress[req.itemType] = 0;
            }
        }
        
        this.activeTradeQuests.push(quest);
        return quest;
    }
    
    /**
     * Complete trade quest
     */
    completeTradeQuest(questId) {
        const quest = this.activeTradeQuests.find(q => q.questId === questId);
        if (!quest) {
            return { success: false, reason: 'Quest not found' };
        }
        
        // Validate requirements
        for (const req of quest.requirements) {
            if (req.material) {
                if (this.gameEngine.craftingSystem) {
                    const count = this.gameEngine.craftingSystem.getMaterialCount(req.material);
                    if (count < req.amount) {
                        return { success: false, reason: `Not enough ${req.material}` };
                    }
                }
            }
        }
        
        // Consume requirements
        for (const req of quest.requirements) {
            if (req.material && this.gameEngine.craftingSystem) {
                this.gameEngine.craftingSystem.removeMaterial(req.material, req.amount);
            }
            if (req.gold && this.gameEngine.economySystem) {
                this.gameEngine.economySystem.removeCurrency('gold', req.gold);
            }
        }
        
        // Give rewards
        this.giveTradeRewards(quest.rewards);
        
        // Mark completed
        quest.completed = true;
        quest.completedTime = Date.now();
        
        // Remove from active quests
        const index = this.activeTradeQuests.indexOf(quest);
        if (index > -1) {
            this.activeTradeQuests.splice(index, 1);
        }
        
        return {
            success: true,
            quest: quest,
            rewards: quest.rewards,
            message: `Completed trade quest: ${quest.name}!`
        };
    }
    
    /**
     * Despawn trader
     */
    despawnTrader(traderId) {
        const trader = this.activeTraders.get(traderId);
        if (trader) {
            this.activeTraders.delete(traderId);
            console.log(`${trader.name} has left.`);
            return true;
        }
        return false;
    }
    
    /**
     * Get active traders
     */
    getActiveTraders() {
        return Array.from(this.activeTraders.values());
    }
    
    /**
     * Get available trades from trader
     */
    getTraderTrades(traderId) {
        const trader = this.activeTraders.get(traderId);
        return trader ? trader.trades : [];
    }
    
    /**
     * Save system state
     */
    save() {
        return {
            activeTraders: Array.from(this.activeTraders.entries()),
            completedTrades: Array.from(this.completedTrades),
            activeTradeQuests: this.activeTradeQuests
        };
    }
    
    /**
     * Load system state
     */
    load(data) {
        if (!data) return;
        
        if (data.activeTraders) {
            this.activeTraders = new Map(data.activeTraders);
        }
        
        if (data.completedTrades) {
            this.completedTrades = new Set(data.completedTrades);
        }
        
        if (data.activeTradeQuests) {
            this.activeTradeQuests = data.activeTradeQuests;
        }
    }
    
    /**
     * Update system (called each frame)
     */
    update(deltaTime) {
        const now = Date.now();
        
        // Check for trader despawns (after 5 minutes)
        for (const [traderId, trader] of this.activeTraders.entries()) {
            if (now - trader.spawnTime > 300000) { // 5 minutes
                this.despawnTrader(traderId);
            }
        }
        
        // Auto-spawn traders based on floor progression
        if (this.gameEngine.endlessMode) {
            const floor = this.gameEngine.endlessMode.currentFloor;
            
            // Try to spawn trader every 30 seconds if none active
            if (this.activeTraders.size === 0 && Math.random() < 0.01) {
                this.spawnTrader(floor);
            }
        }
    }
}
