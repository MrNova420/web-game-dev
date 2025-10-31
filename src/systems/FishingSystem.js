/**
 * FishingSystem.js
 * Phase 8 - Fishing Mini-Game System
 * Fishing mechanics, fish collection, and fishing progression
 * ~300 lines
 */

export class FishingSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // Fishing state
        this.isFishing = false;
        this.currentCast = null;
        this.caughtFish = new Map(); // fishId -> count
        
        // Fishing level and XP
        this.fishingLevel = 1;
        this.fishingXP = 0;
        this.fishingXPToNext = 100;
        
        // Equipment
        this.rod = { tier: 1, catchBonus: 0, rarityBonus: 0 };
        this.bait = null;
        
        // Fish database
        this.fishDatabase = this.createFishDatabase();
        
        // Fishing spots
        this.fishingSpots = new Map();
        this.currentSpot = null;
    }
    
    /**
     * Create fish database
     */
    createFishDatabase() {
        return {
            // Common fish
            minnow: { name: 'Minnow', rarity: 'common', value: 5, xp: 5, weight: [0.1, 0.3] },
            carp: { name: 'Carp', rarity: 'common', value: 10, xp: 10, weight: [0.5, 2] },
            trout: { name: 'Trout', rarity: 'common', value: 15, xp: 12, weight: [0.3, 1.5] },
            
            // Uncommon fish
            bass: { name: 'Bass', rarity: 'uncommon', value: 30, xp: 25, weight: [1, 4], minLevel: 5 },
            pike: { name: 'Pike', rarity: 'uncommon', value: 40, xp: 30, weight: [2, 8], minLevel: 8 },
            salmon: { name: 'Salmon', rarity: 'uncommon', value: 50, xp: 35, weight: [3, 10], minLevel: 10 },
            
            // Rare fish
            sturgeon: { name: 'Sturgeon', rarity: 'rare', value: 100, xp: 75, weight: [10, 50], minLevel: 20 },
            marlin: { name: 'Marlin', rarity: 'rare', value: 150, xp: 100, weight: [50, 200], minLevel: 25 },
            tuna: { name: 'Tuna', rarity: 'rare', value: 120, xp: 85, weight: [30, 100], minLevel: 22 },
            
            // Epic fish
            golden_koi: { name: 'Golden Koi', rarity: 'epic', value: 500, xp: 250, weight: [2, 5], minLevel: 40 },
            dragon_fish: { name: 'Dragon Fish', rarity: 'epic', value: 750, xp: 400, weight: [20, 80], minLevel: 50 },
            
            // Legendary fish
            leviathan: { name: 'Leviathan', rarity: 'legendary', value: 5000, xp: 2000, weight: [500, 2000], minLevel: 75 },
            kraken: { name: 'Kraken', rarity: 'legendary', value: 10000, xp: 5000, weight: [1000, 5000], minLevel: 90 }
        };
    }
    
    /**
     * Start fishing
     */
    startFishing(spotId) {
        if (this.isFishing) {
            return { success: false, message: 'Already fishing' };
        }
        
        const spot = this.fishingSpots.get(spotId) || this.getDefaultSpot();
        this.currentSpot = spot;
        this.isFishing = true;
        
        // Start cast
        const castId = `cast_${Date.now()}`;
        this.currentCast = {
            id: castId,
            spotId: spotId,
            startTime: Date.now(),
            biteTime: this.calculateBiteTime(),
            hasBite: false,
            hooked: false
        };
        
        return { success: true, castId: castId, biteTime: this.currentCast.biteTime };
    }
    
    /**
     * Calculate time until bite
     */
    calculateBiteTime() {
        const baseTime = 3000 + Math.random() * 7000; // 3-10 seconds
        const rodBonus = this.rod.tier * 500;
        const baitBonus = this.bait ? 1000 : 0;
        return Math.max(1000, baseTime - rodBonus - baitBonus);
    }
    
    /**
     * Update fishing state
     */
    update(deltaTime) {
        if (!this.isFishing || !this.currentCast) return;
        
        const elapsed = Date.now() - this.currentCast.startTime;
        
        // Check for bite
        if (!this.currentCast.hasBite && elapsed >= this.currentCast.biteTime) {
            this.currentCast.hasBite = true;
            this.triggerBite();
        }
        
        // Auto-fail if too long without hooking
        if (this.currentCast.hasBite && !this.currentCast.hooked && elapsed > this.currentCast.biteTime + 3000) {
            this.failCatch();
        }
    }
    
    /**
     * Trigger bite notification
     */
    triggerBite() {
        if (this.gameEngine.audioSystem) {
            this.gameEngine.audioSystem.playSound('fishing_bite');
        }
        logger.info('🎣 Bite! Press the button to hook!');
    }
    
    /**
     * Attempt to hook fish
     */
    hook() {
        if (!this.isFishing || !this.currentCast || !this.currentCast.hasBite) {
            return { success: false, message: 'No bite yet' };
        }
        
        if (this.currentCast.hooked) {
            return { success: false, message: 'Already hooked' };
        }
        
        // Check timing
        const elapsed = Date.now() - this.currentCast.startTime;
        const biteWindow = elapsed - this.currentCast.biteTime;
        
        if (biteWindow < 0 || biteWindow > 2000) {
            return this.failCatch();
        }
        
        // Success - start reeling
        this.currentCast.hooked = true;
        this.currentCast.reelingStartTime = Date.now();
        this.currentCast.reelingProgress = 0;
        this.currentCast.reelingTarget = 100;
        
        return { success: true, message: 'Hooked! Start reeling!' };
    }
    
    /**
     * Reel in
     */
    reel(power = 1.0) {
        if (!this.currentCast || !this.currentCast.hooked) {
            return { success: false, message: 'Nothing hooked' };
        }
        
        // Add progress
        const reelingPower = power * (1 + this.rod.catchBonus);
        this.currentCast.reelingProgress += reelingPower * 5;
        
        // Check if caught
        if (this.currentCast.reelingProgress >= this.currentCast.reelingTarget) {
            return this.catchFish();
        }
        
        return { 
            success: true, 
            progress: this.currentCast.reelingProgress,
            target: this.currentCast.reelingTarget 
        };
    }
    
    /**
     * Catch fish
     */
    catchFish() {
        if (!this.currentCast) return null;
        
        // Determine fish
        const fish = this.determineFish();
        if (!fish) return this.failCatch();
        
        // Calculate weight
        const fishData = this.fishDatabase[fish.id];
        const weight = fishData.weight[0] + Math.random() * (fishData.weight[1] - fishData.weight[0]);
        
        // Record catch
        const caught = {
            id: fish.id,
            name: fishData.name,
            rarity: fishData.rarity,
            weight: weight,
            value: Math.floor(fishData.value * (1 + weight / 10)),
            timestamp: Date.now()
        };
        
        // Update collection
        this.caughtFish.set(fish.id, (this.caughtFish.get(fish.id) || 0) + 1);
        
        // Add XP
        this.addFishingXP(fishData.xp);
        
        // Add to inventory
        if (this.gameEngine.inventorySystem) {
            this.gameEngine.inventorySystem.addItem(caught);
        }
        
        // Reset state
        this.isFishing = false;
        this.currentCast = null;
        
        logger.info(`🎣 Caught ${caught.name}! Weight: ${weight.toFixed(2)}kg`);
        
        return { success: true, fish: caught };
    }
    
    /**
     * Determine which fish was caught
     */
    determineFish() {
        const availableFish = [];
        
        for (const [fishId, fishData] of Object.entries(this.fishDatabase)) {
            // Check level requirement
            if (fishData.minLevel && this.fishingLevel < fishData.minLevel) continue;
            
            // Check spot compatibility
            if (this.currentSpot && this.currentSpot.fishTypes && !this.currentSpot.fishTypes.includes(fishId)) {
                continue;
            }
            
            // Add with rarity weight
            const rarityWeights = { common: 50, uncommon: 25, rare: 15, epic: 8, legendary: 2 };
            const weight = rarityWeights[fishData.rarity] || 10;
            const bonusWeight = this.rod.rarityBonus * (fishData.rarity === 'rare' || fishData.rarity === 'epic' ? 5 : 0);
            
            for (let i = 0; i < weight + bonusWeight; i++) {
                availableFish.push({ id: fishId, data: fishData });
            }
        }
        
        if (availableFish.length === 0) return null;
        
        return availableFish[Math.floor(Math.random() * availableFish.length)];
    }
    
    /**
     * Fail to catch
     */
    failCatch() {
        logger.info('❌ The fish got away!');
        this.isFishing = false;
        this.currentCast = null;
        return { success: false, message: 'Fish got away' };
    }
    
    /**
     * Add fishing XP
     */
    addFishingXP(amount) {
        this.fishingXP += amount;
        
        while (this.fishingXP >= this.fishingXPToNext) {
            this.fishingXP -= this.fishingXPToNext;
            this.fishingLevel++;
            this.fishingXPToNext = Math.floor(this.fishingXPToNext * 1.5);
            logger.info(`🎣 Fishing Level Up! Now level ${this.fishingLevel}`);
        }
    }
    
    /**
     * Upgrade rod
     */
    upgradeRod(tier) {
        const cost = tier * 500;
        if (this.gameEngine.economySystem && !this.gameEngine.economySystem.canAfford(cost)) {
            return { success: false, message: 'Not enough gold' };
        }
        
        if (this.gameEngine.economySystem) {
            this.gameEngine.economySystem.spendGold(cost);
        }
        
        this.rod = {
            tier: tier,
            catchBonus: (tier - 1) * 0.1,
            rarityBonus: tier - 1
        };
        
        return { success: true };
    }
    
    /**
     * Use bait
     */
    useBait(baitType) {
        this.bait = baitType;
        return { success: true };
    }
    
    /**
     * Get default fishing spot
     */
    getDefaultSpot() {
        return {
            id: 'default',
            name: 'Default Pond',
            fishTypes: ['minnow', 'carp', 'trout', 'bass']
        };
    }
    
    /**
     * Get fishing stats
     */
    getStats() {
        return {
            fishingLevel: this.fishingLevel,
            fishingXP: this.fishingXP,
            fishingXPToNext: this.fishingXPToNext,
            totalCaught: Array.from(this.caughtFish.values()).reduce((a, b) => a + b, 0),
            uniqueSpecies: this.caughtFish.size,
            rod: this.rod
        };
    }
}
