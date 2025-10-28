/**
 * EconomySystem.js
 * Handles currency, shops, merchants, and trading economy
 * Part of Phase 4: Crafting & Economy
 */

export class EconomySystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // Currencies
        this.currencies = {
            gold: 100, // Starting gold
            gems: 0,   // Premium currency
            tokens: 0  // Special event currency
        };
        
        // Shops and merchants
        this.merchants = new Map();
        this.shopInventories = new Map();
        this.merchantEvents = [];
        
        // Pricing
        this.basePrices = new Map();
        this.priceMultipliers = {
            common: 1.0,
            uncommon: 2.5,
            rare: 6.0,
            epic: 15.0,
            legendary: 40.0
        };
        
        // Trading history
        this.transactionHistory = [];
        this.dailyTransactionCount = 0;
        this.lastResetDate = Date.now();
        
        this.initializeMerchants();
    }
    
    /**
     * Initialize merchant types
     */
    initializeMerchants() {
        // General merchant - always available in safe zones
        this.addMerchant({
            id: 'general_merchant',
            name: 'General Merchant',
            type: 'general',
            location: 'town',
            permanent: true,
            stock: {
                weapons: 5,
                armor: 5,
                consumables: 10,
                materials: 15
            },
            buyMultiplier: 1.0,  // Normal prices
            sellMultiplier: 0.5, // Buys at 50% value
            restockTime: 3600000, // 1 hour
            lastRestock: Date.now()
        });
        
        // Traveling merchant - appears randomly
        this.addMerchant({
            id: 'traveling_merchant',
            name: 'Traveling Merchant',
            type: 'traveling',
            location: 'dungeon',
            permanent: false,
            spawnChance: 0.05, // 5% chance per floor
            stock: {
                weapons: 3,
                armor: 3,
                accessories: 4,
                rare_materials: 8
            },
            buyMultiplier: 0.8,  // 20% discount
            sellMultiplier: 0.7, // Buys at 70% value
            duration: 300000, // 5 minutes before leaving
            spawnTime: null
        });
        
        // Black market merchant - expensive but rare items
        this.addMerchant({
            id: 'black_market',
            name: 'Black Market Dealer',
            type: 'black_market',
            location: 'hidden',
            permanent: false,
            unlockRequirement: { floor: 25 },
            stock: {
                legendary_items: 2,
                epic_items: 5,
                forbidden_materials: 10
            },
            buyMultiplier: 2.0,  // Double prices
            sellMultiplier: 1.0, // Buys at full value
            restockTime: 7200000, // 2 hours
            lastRestock: Date.now()
        });
        
        // Specialty merchants
        this.addMerchant({
            id: 'weaponsmith',
            name: 'Master Weaponsmith',
            type: 'specialty',
            specialty: 'weapons',
            location: 'town',
            permanent: true,
            stock: {
                weapons: 10,
                weapon_materials: 20
            },
            buyMultiplier: 0.9,
            sellMultiplier: 0.6,
            restockTime: 1800000, // 30 minutes
            lastRestock: Date.now()
        });
        
        this.addMerchant({
            id: 'alchemist',
            name: 'Master Alchemist',
            type: 'specialty',
            specialty: 'potions',
            location: 'town',
            permanent: true,
            stock: {
                potions: 15,
                elixirs: 10,
                alchemy_materials: 25
            },
            buyMultiplier: 0.9,
            sellMultiplier: 0.6,
            restockTime: 1800000,
            lastRestock: Date.now()
        });
    }
    
    /**
     * Add merchant to system
     */
    addMerchant(merchant) {
        this.merchants.set(merchant.id, merchant);
        this.generateShopInventory(merchant);
    }
    
    /**
     * Generate shop inventory for merchant
     */
    generateShopInventory(merchant) {
        const inventory = [];
        const floor = this.gameEngine.endlessMode?.currentFloor || 1;
        
        // Generate items based on merchant stock
        for (const [category, count] of Object.entries(merchant.stock)) {
            for (let i = 0; i < count; i++) {
                const item = this.generateShopItem(category, floor, merchant);
                if (item) {
                    inventory.push(item);
                }
            }
        }
        
        this.shopInventories.set(merchant.id, inventory);
        return inventory;
    }
    
    /**
     * Generate a shop item
     */
    generateShopItem(category, floor, merchant) {
        const rarityRoll = Math.random();
        let rarity;
        
        // Adjust rarity chances based on merchant type and floor
        const rarityBonus = merchant.type === 'black_market' ? 0.3 : 0;
        const floorBonus = Math.min(floor * 0.01, 0.2);
        
        const adjustedRoll = rarityRoll - rarityBonus - floorBonus;
        
        if (adjustedRoll < 0.4) {
            rarity = 'common';
        } else if (adjustedRoll < 0.65) {
            rarity = 'uncommon';
        } else if (adjustedRoll < 0.85) {
            rarity = 'rare';
        } else if (adjustedRoll < 0.96) {
            rarity = 'epic';
        } else {
            rarity = 'legendary';
        }
        
        const item = {
            id: `shop_${category}_${Date.now()}_${Math.random()}`,
            category: category,
            rarity: rarity,
            name: this.generateItemName(category, rarity),
            level: Math.max(1, floor - 2 + Math.floor(Math.random() * 5)),
            stats: this.generateItemStats(category, rarity, floor),
            price: this.calculatePrice(category, rarity, floor, merchant),
            stock: category.includes('consumable') || category.includes('material') ? 
                   Math.floor(Math.random() * 5) + 1 : 1
        };
        
        return item;
    }
    
    /**
     * Generate item name
     */
    generateItemName(category, rarity) {
        const prefixes = {
            common: ['Simple', 'Basic', 'Common', 'Standard'],
            uncommon: ['Quality', 'Enhanced', 'Superior', 'Fine'],
            rare: ['Rare', 'Exquisite', 'Exceptional', 'Masterwork'],
            epic: ['Epic', 'Legendary', 'Ancient', 'Mythical'],
            legendary: ['Godlike', 'Divine', 'Transcendent', 'Eternal']
        };
        
        const categoryNames = {
            weapons: ['Sword', 'Blade', 'Staff', 'Wand', 'Bow'],
            armor: ['Armor', 'Plate', 'Mail', 'Robe', 'Guard'],
            accessories: ['Ring', 'Amulet', 'Charm', 'Talisman'],
            consumables: ['Potion', 'Elixir', 'Tonic'],
            potions: ['Potion', 'Elixir'],
            materials: ['Material', 'Essence', 'Crystal', 'Fragment']
        };
        
        const prefix = prefixes[rarity][Math.floor(Math.random() * prefixes[rarity].length)];
        const base = categoryNames[category] ? 
                     categoryNames[category][Math.floor(Math.random() * categoryNames[category].length)] :
                     'Item';
        
        return `${prefix} ${base}`;
    }
    
    /**
     * Generate item stats
     */
    generateItemStats(category, rarity, floor) {
        const baseValue = {
            common: 10,
            uncommon: 25,
            rare: 50,
            epic: 100,
            legendary: 200
        }[rarity];
        
        const floorMultiplier = 1 + (floor * 0.1);
        const stats = {};
        
        if (category.includes('weapon')) {
            stats.attack = Math.floor(baseValue * floorMultiplier);
            if (rarity !== 'common') {
                stats.critChance = 0.05 * Object.keys(baseValue).indexOf(rarity);
            }
        } else if (category.includes('armor')) {
            stats.defense = Math.floor(baseValue * floorMultiplier);
            stats.hp = Math.floor(baseValue * 2 * floorMultiplier);
        } else if (category.includes('accessory')) {
            stats.attack = Math.floor(baseValue * 0.5 * floorMultiplier);
            stats.defense = Math.floor(baseValue * 0.5 * floorMultiplier);
        }
        
        return stats;
    }
    
    /**
     * Calculate item price
     */
    calculatePrice(category, rarity, floor, merchant) {
        const basePrice = {
            common: 50,
            uncommon: 150,
            rare: 500,
            epic: 2000,
            legendary: 10000
        }[rarity];
        
        const floorMultiplier = 1 + (floor * 0.05);
        const merchantMultiplier = merchant.buyMultiplier || 1.0;
        
        // Dynamic pricing based on demand (simplified)
        const demandMultiplier = 1 + (Math.random() * 0.2 - 0.1); // ±10%
        
        const finalPrice = Math.floor(
            basePrice * 
            floorMultiplier * 
            merchantMultiplier * 
            demandMultiplier
        );
        
        return Math.max(1, finalPrice);
    }
    
    /**
     * Buy item from merchant
     */
    buyItem(merchantId, itemId, quantity = 1) {
        const merchant = this.merchants.get(merchantId);
        if (!merchant) {
            return { success: false, reason: 'Merchant not found' };
        }
        
        const inventory = this.shopInventories.get(merchantId);
        const item = inventory?.find(i => i.id === itemId);
        
        if (!item) {
            return { success: false, reason: 'Item not found' };
        }
        
        if (item.stock < quantity) {
            return { success: false, reason: 'Not enough stock' };
        }
        
        const totalCost = item.price * quantity;
        
        if (this.currencies.gold < totalCost) {
            return { success: false, reason: 'Not enough gold' };
        }
        
        // Process transaction
        this.currencies.gold -= totalCost;
        item.stock -= quantity;
        
        // Remove item if out of stock
        if (item.stock <= 0) {
            const index = inventory.indexOf(item);
            if (index > -1) {
                inventory.splice(index, 1);
            }
        }
        
        // Add to player inventory
        if (this.gameEngine.inventorySystem) {
            for (let i = 0; i < quantity; i++) {
                this.gameEngine.inventorySystem.addItem({ ...item });
            }
        }
        
        // Record transaction
        this.recordTransaction({
            type: 'buy',
            merchantId: merchantId,
            item: item.name,
            quantity: quantity,
            cost: totalCost,
            timestamp: Date.now()
        });
        
        return { success: true, item, quantity, cost: totalCost };
    }
    
    /**
     * Sell item to merchant
     */
    sellItem(merchantId, item, quantity = 1) {
        const merchant = this.merchants.get(merchantId);
        if (!merchant) {
            return { success: false, reason: 'Merchant not found' };
        }
        
        // Calculate sell value
        const baseValue = this.calculateItemValue(item);
        const sellValue = Math.floor(baseValue * merchant.sellMultiplier * quantity);
        
        // Process transaction
        this.currencies.gold += sellValue;
        
        // Remove from player inventory
        if (this.gameEngine.inventorySystem) {
            this.gameEngine.inventorySystem.removeItem(item.id, quantity);
        }
        
        // Record transaction
        this.recordTransaction({
            type: 'sell',
            merchantId: merchantId,
            item: item.name,
            quantity: quantity,
            value: sellValue,
            timestamp: Date.now()
        });
        
        return { success: true, item, quantity, value: sellValue };
    }
    
    /**
     * Calculate item value for selling
     */
    calculateItemValue(item) {
        const rarityValues = {
            common: 25,
            uncommon: 75,
            rare: 250,
            epic: 1000,
            legendary: 5000
        };
        
        let value = rarityValues[item.rarity] || 10;
        
        // Add value based on item level
        if (item.level) {
            value += item.level * 5;
        }
        
        // Add value based on stats
        if (item.stats) {
            const statTotal = Object.values(item.stats)
                .filter(v => typeof v === 'number')
                .reduce((sum, v) => sum + v, 0);
            value += statTotal * 2;
        }
        
        return Math.max(1, Math.floor(value));
    }
    
    /**
     * Check for merchant events
     */
    checkMerchantEvents(floor) {
        // Traveling merchant spawn
        const travelingMerchant = this.merchants.get('traveling_merchant');
        if (travelingMerchant && !travelingMerchant.spawnTime) {
            if (Math.random() < travelingMerchant.spawnChance) {
                this.spawnTravelingMerchant();
            }
        }
        
        // Check if traveling merchant should despawn
        if (travelingMerchant?.spawnTime) {
            const elapsed = Date.now() - travelingMerchant.spawnTime;
            if (elapsed > travelingMerchant.duration) {
                this.despawnTravelingMerchant();
            }
        }
        
        // Special merchant events
        if (floor % 10 === 0 && Math.random() < 0.3) {
            this.triggerMerchantEvent(floor);
        }
    }
    
    /**
     * Spawn traveling merchant
     */
    spawnTravelingMerchant() {
        const merchant = this.merchants.get('traveling_merchant');
        if (merchant) {
            merchant.spawnTime = Date.now();
            this.generateShopInventory(merchant);
            console.log('🧙 A traveling merchant has appeared!');
            return true;
        }
        return false;
    }
    
    /**
     * Despawn traveling merchant
     */
    despawnTravelingMerchant() {
        const merchant = this.merchants.get('traveling_merchant');
        if (merchant) {
            merchant.spawnTime = null;
            this.shopInventories.set('traveling_merchant', []);
            console.log('🧙 The traveling merchant has left...');
            return true;
        }
        return false;
    }
    
    /**
     * Trigger special merchant event
     */
    triggerMerchantEvent(floor) {
        const events = [
            {
                name: 'Flash Sale',
                description: 'All items 30% off!',
                effect: () => {
                    // Apply discount to all merchants
                    for (const merchant of this.merchants.values()) {
                        merchant.buyMultiplier *= 0.7;
                    }
                },
                duration: 180000, // 3 minutes
                endEffect: () => {
                    // Reset prices
                    this.initializeMerchants();
                }
            },
            {
                name: 'Merchant Festival',
                description: 'Merchants buy items at 80% value!',
                effect: () => {
                    for (const merchant of this.merchants.values()) {
                        merchant.sellMultiplier = 0.8;
                    }
                },
                duration: 300000, // 5 minutes
                endEffect: () => {
                    this.initializeMerchants();
                }
            },
            {
                name: 'Rare Item Shipment',
                description: 'Legendary items available!',
                effect: () => {
                    // Add legendary items to shops
                    for (const merchantId of this.merchants.keys()) {
                        const merchant = this.merchants.get(merchantId);
                        if (merchant.permanent) {
                            const inventory = this.shopInventories.get(merchantId);
                            for (let i = 0; i < 3; i++) {
                                const legendaryItem = this.generateShopItem(
                                    'weapons', 
                                    floor, 
                                    { ...merchant, buyMultiplier: merchant.buyMultiplier * 1.5 }
                                );
                                legendaryItem.rarity = 'legendary';
                                inventory.push(legendaryItem);
                            }
                        }
                    }
                },
                duration: 600000, // 10 minutes
                endEffect: () => {
                    // Items will naturally be bought or despawn with restock
                }
            }
        ];
        
        const event = events[Math.floor(Math.random() * events.length)];
        event.effect();
        
        console.log(`🎉 Merchant Event: ${event.name} - ${event.description}`);
        
        // Schedule event end
        setTimeout(() => {
            event.endEffect();
            console.log(`Event ended: ${event.name}`);
        }, event.duration);
        
        this.merchantEvents.push({
            ...event,
            startTime: Date.now(),
            floor: floor
        });
    }
    
    /**
     * Restock merchant inventory
     */
    restockMerchant(merchantId) {
        const merchant = this.merchants.get(merchantId);
        if (!merchant) return false;
        
        const timeSinceRestock = Date.now() - merchant.lastRestock;
        
        if (timeSinceRestock >= merchant.restockTime) {
            this.generateShopInventory(merchant);
            merchant.lastRestock = Date.now();
            console.log(`${merchant.name} has restocked their inventory!`);
            return true;
        }
        
        return false;
    }
    
    /**
     * Currency conversion
     */
    convertCurrency(fromCurrency, toCurrency, amount) {
        const conversionRates = {
            'gold_to_gems': 100,    // 100 gold = 1 gem
            'gems_to_tokens': 10,   // 10 gems = 1 token
            'tokens_to_gold': 1000  // 1 token = 1000 gold
        };
        
        const rateKey = `${fromCurrency}_to_${toCurrency}`;
        const rate = conversionRates[rateKey];
        
        if (!rate) {
            return { success: false, reason: 'Invalid conversion' };
        }
        
        if (this.currencies[fromCurrency] < amount * rate) {
            return { success: false, reason: `Not enough ${fromCurrency}` };
        }
        
        this.currencies[fromCurrency] -= amount * rate;
        this.currencies[toCurrency] += amount;
        
        return { 
            success: true, 
            converted: amount,
            spent: amount * rate,
            rate: rate
        };
    }
    
    /**
     * Add currency
     */
    addCurrency(currency, amount) {
        if (this.currencies.hasOwnProperty(currency)) {
            this.currencies[currency] += amount;
            return this.currencies[currency];
        }
        return 0;
    }
    
    /**
     * Remove currency
     */
    removeCurrency(currency, amount) {
        if (this.currencies.hasOwnProperty(currency)) {
            if (this.currencies[currency] >= amount) {
                this.currencies[currency] -= amount;
                return true;
            }
        }
        return false;
    }
    
    /**
     * Get currency amount
     */
    getCurrency(currency) {
        return this.currencies[currency] || 0;
    }
    
    /**
     * Record transaction
     */
    recordTransaction(transaction) {
        this.transactionHistory.push(transaction);
        this.dailyTransactionCount++;
        
        // Keep only last 100 transactions
        if (this.transactionHistory.length > 100) {
            this.transactionHistory.shift();
        }
    }
    
    /**
     * Get merchant inventory
     */
    getMerchantInventory(merchantId) {
        return this.shopInventories.get(merchantId) || [];
    }
    
    /**
     * Get available merchants
     */
    getAvailableMerchants() {
        const floor = this.gameEngine.endlessMode?.currentFloor || 1;
        const available = [];
        
        for (const [id, merchant] of this.merchants.entries()) {
            // Check if merchant is available
            if (merchant.permanent) {
                available.push({ id, ...merchant });
            } else if (merchant.spawnTime) {
                // Traveling merchant is spawned
                available.push({ id, ...merchant });
            } else if (merchant.unlockRequirement) {
                // Check unlock requirements
                if (floor >= merchant.unlockRequirement.floor) {
                    available.push({ id, ...merchant });
                }
            }
        }
        
        return available;
    }
    
    /**
     * Reset daily counters
     */
    resetDaily() {
        const now = Date.now();
        const daysSinceReset = (now - this.lastResetDate) / (1000 * 60 * 60 * 24);
        
        if (daysSinceReset >= 1) {
            this.dailyTransactionCount = 0;
            this.lastResetDate = now;
            console.log('Economy daily counters reset');
        }
    }
    
    /**
     * Save system state
     */
    save() {
        return {
            currencies: { ...this.currencies },
            merchants: Array.from(this.merchants.entries()).map(([id, m]) => ({
                id,
                lastRestock: m.lastRestock,
                spawnTime: m.spawnTime,
                unlocked: m.unlocked
            })),
            shopInventories: Array.from(this.shopInventories.entries()),
            transactionHistory: this.transactionHistory.slice(-50), // Save last 50
            dailyTransactionCount: this.dailyTransactionCount,
            lastResetDate: this.lastResetDate
        };
    }
    
    /**
     * Load system state
     */
    load(data) {
        if (!data) return;
        
        if (data.currencies) {
            this.currencies = { ...data.currencies };
        }
        
        if (data.merchants) {
            for (const merchantData of data.merchants) {
                const merchant = this.merchants.get(merchantData.id);
                if (merchant) {
                    merchant.lastRestock = merchantData.lastRestock;
                    merchant.spawnTime = merchantData.spawnTime;
                    merchant.unlocked = merchantData.unlocked;
                }
            }
        }
        
        if (data.shopInventories) {
            this.shopInventories = new Map(data.shopInventories);
        }
        
        if (data.transactionHistory) {
            this.transactionHistory = data.transactionHistory;
        }
        
        if (data.dailyTransactionCount !== undefined) {
            this.dailyTransactionCount = data.dailyTransactionCount;
        }
        
        if (data.lastResetDate) {
            this.lastResetDate = data.lastResetDate;
        }
    }
    
    /**
     * Update system (called each frame)
     */
    update(deltaTime) {
        // Check for restocks
        for (const merchantId of this.merchants.keys()) {
            this.restockMerchant(merchantId);
        }
        
        // Check for daily reset
        this.resetDaily();
        
        // Check for merchant events
        if (this.gameEngine.endlessMode) {
            this.checkMerchantEvents(this.gameEngine.endlessMode.currentFloor);
        }
    }
}
