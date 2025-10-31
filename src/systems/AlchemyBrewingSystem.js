import { logger } from '../core/Logger.js';
/**
 * AlchemyBrewingSystem.js
 * Phase 8 - Alchemy and Brewing System
 * Potion crafting, brewing mechanics, and alchemical experimentation
 * ~700 lines
 */

export class AlchemyBrewingSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // Brewing state
        this.activeBrews = new Map(); // brewId -> brew data
        this.completedPotions = new Set();
        this.discoveredRecipes = new Set(['basic_health_potion', 'basic_mana_potion']);
        
        // Player alchemy level
        this.alchemyLevel = 1;
        this.alchemyXP = 0;
        this.alchemyXPToNext = 100;
        
        // Brewing equipment
        this.equipment = {
            cauldron: { tier: 1, slots: 3, quality: 1.0 },
            alembic: null,
            mortar: { tier: 1, grindSpeed: 1.0 },
            phials: { count: 10, tier: 1 }
        };
        
        // Recipe database
        this.recipes = this.createRecipeDatabase();
        
        // Ingredient properties
        this.ingredients = this.createIngredientDatabase();
        
        // Brewing process types
        this.brewingMethods = {
            boil: { time: 30, difficulty: 1, qualityMod: 1.0 },
            simmer: { time: 60, difficulty: 2, qualityMod: 1.2 },
            distill: { time: 120, difficulty: 3, qualityMod: 1.5 },
            infuse: { time: 90, difficulty: 2, qualityMod: 1.3 },
            ferment: { time: 300, difficulty: 4, qualityMod: 1.8 },
            transmute: { time: 180, difficulty: 5, qualityMod: 2.0 }
        };
    }
    
    /**
     * Create recipe database
     */
    createRecipeDatabase() {
        return {
            // Basic potions
            basic_health_potion: {
                name: 'Basic Health Potion',
                type: 'health',
                tier: 1,
                ingredients: [
                    { id: 'red_herb', amount: 2 },
                    { id: 'spring_water', amount: 1 }
                ],
                method: 'boil',
                duration: 30,
                difficulty: 1,
                result: { hp: 50 },
                xpGain: 10
            },
            basic_mana_potion: {
                name: 'Basic Mana Potion',
                type: 'mana',
                tier: 1,
                ingredients: [
                    { id: 'blue_herb', amount: 2 },
                    { id: 'spring_water', amount: 1 }
                ],
                method: 'boil',
                duration: 30,
                difficulty: 1,
                result: { mana: 50 },
                xpGain: 10
            },
            
            // Intermediate potions
            greater_health_potion: {
                name: 'Greater Health Potion',
                type: 'health',
                tier: 2,
                ingredients: [
                    { id: 'red_herb', amount: 3 },
                    { id: 'honey', amount: 1 },
                    { id: 'purified_water', amount: 1 }
                ],
                method: 'simmer',
                duration: 60,
                difficulty: 2,
                result: { hp: 150 },
                xpGain: 25,
                unlockLevel: 5
            },
            strength_elixir: {
                name: 'Elixir of Strength',
                type: 'buff',
                tier: 2,
                ingredients: [
                    { id: 'iron_root', amount: 2 },
                    { id: 'beast_blood', amount: 1 },
                    { id: 'alcohol', amount: 1 }
                ],
                method: 'infuse',
                duration: 90,
                difficulty: 3,
                result: { attackBonus: 20, duration: 300 },
                xpGain: 40,
                unlockLevel: 10
            },
            swiftness_potion: {
                name: 'Potion of Swiftness',
                type: 'buff',
                tier: 2,
                ingredients: [
                    { id: 'feather_grass', amount: 3 },
                    { id: 'lightning_essence', amount: 1 },
                    { id: 'purified_water', amount: 1 }
                ],
                method: 'simmer',
                duration: 60,
                difficulty: 2,
                result: { speedBonus: 30, duration: 180 },
                xpGain: 35,
                unlockLevel: 8
            },
            
            // Advanced potions
            grand_healing_elixir: {
                name: 'Grand Healing Elixir',
                type: 'health',
                tier: 3,
                ingredients: [
                    { id: 'golden_herb', amount: 2 },
                    { id: 'phoenix_tear', amount: 1 },
                    { id: 'celestial_water', amount: 1 },
                    { id: 'honey', amount: 2 }
                ],
                method: 'distill',
                duration: 120,
                difficulty: 4,
                result: { hp: 500, regen: 50 },
                xpGain: 80,
                unlockLevel: 20
            },
            invisibility_potion: {
                name: 'Potion of Invisibility',
                type: 'buff',
                tier: 3,
                ingredients: [
                    { id: 'shadow_bloom', amount: 3 },
                    { id: 'ghost_essence', amount: 1 },
                    { id: 'void_water', amount: 1 }
                ],
                method: 'infuse',
                duration: 120,
                difficulty: 5,
                result: { invisible: true, duration: 60 },
                xpGain: 100,
                unlockLevel: 25
            },
            
            // Master potions
            philosophers_stone: {
                name: "Philosopher's Stone",
                type: 'legendary',
                tier: 4,
                ingredients: [
                    { id: 'primordial_essence', amount: 1 },
                    { id: 'dragon_blood', amount: 1 },
                    { id: 'star_dust', amount: 1 },
                    { id: 'eternal_flame', amount: 1 }
                ],
                method: 'transmute',
                duration: 300,
                difficulty: 10,
                result: { transmute: true },
                xpGain: 500,
                unlockLevel: 50
            },
            elixir_of_immortality: {
                name: 'Elixir of Immortality',
                type: 'legendary',
                tier: 4,
                ingredients: [
                    { id: 'phoenix_tear', amount: 3 },
                    { id: 'unicorn_horn', amount: 1 },
                    { id: 'ambrosia', amount: 1 },
                    { id: 'time_crystal', amount: 1 }
                ],
                method: 'transmute',
                duration: 360,
                difficulty: 10,
                result: { revive: true, fullHeal: true },
                xpGain: 1000,
                unlockLevel: 75
            },
            
            // Cannabis-themed potions
            green_goddess_brew: {
                name: 'Green Goddess Brew',
                type: 'special',
                tier: 2,
                ingredients: [
                    { id: 'cannabis_flower', amount: 3 },
                    { id: 'honey', amount: 2 },
                    { id: 'mint_leaf', amount: 2 },
                    { id: 'spring_water', amount: 1 }
                ],
                method: 'infuse',
                duration: 90,
                difficulty: 3,
                result: { relaxation: 100, creativity: 50, duration: 600 },
                xpGain: 60,
                unlockLevel: 15
            },
            cosmic_elixir: {
                name: 'Cosmic Elixir',
                type: 'special',
                tier: 3,
                ingredients: [
                    { id: 'psychedelic_mushroom', amount: 2 },
                    { id: 'cannabis_concentrate', amount: 1 },
                    { id: 'star_dust', amount: 1 },
                    { id: 'void_water', amount: 1 }
                ],
                method: 'ferment',
                duration: 240,
                difficulty: 6,
                result: { consciousness: 200, visions: true, duration: 300 },
                xpGain: 150,
                unlockLevel: 40
            }
        };
    }
    
    /**
     * Create ingredient database
     */
    createIngredientDatabase() {
        return {
            // Common herbs
            red_herb: { name: 'Red Herb', rarity: 'common', properties: ['healing', 'vitality'] },
            blue_herb: { name: 'Blue Herb', rarity: 'common', properties: ['mana', 'magic'] },
            spring_water: { name: 'Spring Water', rarity: 'common', properties: ['pure', 'neutral'] },
            
            // Uncommon ingredients
            iron_root: { name: 'Iron Root', rarity: 'uncommon', properties: ['strength', 'endurance'] },
            feather_grass: { name: 'Feather Grass', rarity: 'uncommon', properties: ['speed', 'lightness'] },
            honey: { name: 'Honey', rarity: 'uncommon', properties: ['sweet', 'binding'] },
            purified_water: { name: 'Purified Water', rarity: 'uncommon', properties: ['pure', 'enhanced'] },
            
            // Rare ingredients
            golden_herb: { name: 'Golden Herb', rarity: 'rare', properties: ['healing', 'divine'] },
            shadow_bloom: { name: 'Shadow Bloom', rarity: 'rare', properties: ['stealth', 'darkness'] },
            lightning_essence: { name: 'Lightning Essence', rarity: 'rare', properties: ['speed', 'electric'] },
            beast_blood: { name: 'Beast Blood', rarity: 'rare', properties: ['power', 'primal'] },
            
            // Epic ingredients
            phoenix_tear: { name: 'Phoenix Tear', rarity: 'epic', properties: ['resurrection', 'fire'] },
            dragon_blood: { name: 'Dragon Blood', rarity: 'epic', properties: ['power', 'magic'] },
            unicorn_horn: { name: 'Unicorn Horn', rarity: 'epic', properties: ['purity', 'healing'] },
            ghost_essence: { name: 'Ghost Essence', rarity: 'epic', properties: ['ethereal', 'stealth'] },
            
            // Legendary ingredients
            primordial_essence: { name: 'Primordial Essence', rarity: 'legendary', properties: ['creation', 'power'] },
            star_dust: { name: 'Star Dust', rarity: 'legendary', properties: ['cosmic', 'magic'] },
            time_crystal: { name: 'Time Crystal', rarity: 'legendary', properties: ['time', 'eternal'] },
            eternal_flame: { name: 'Eternal Flame', rarity: 'legendary', properties: ['fire', 'immortal'] },
            
            // Special ingredients
            cannabis_flower: { name: 'Cannabis Flower', rarity: 'uncommon', properties: ['relaxation', 'healing'] },
            cannabis_concentrate: { name: 'Cannabis Concentrate', rarity: 'rare', properties: ['potent', 'psychoactive'] },
            psychedelic_mushroom: { name: 'Psychedelic Mushroom', rarity: 'rare', properties: ['vision', 'consciousness'] },
            void_water: { name: 'Void Water', rarity: 'epic', properties: ['void', 'transformation'] },
            celestial_water: { name: 'Celestial Water', rarity: 'epic', properties: ['divine', 'pure'] },
            ambrosia: { name: 'Ambrosia', rarity: 'legendary', properties: ['divine', 'immortality'] }
        };
    }
    
    /**
     * Start brewing a potion
     */
    startBrew(recipeId) {
        const recipe = this.recipes[recipeId];
        if (!recipe) {
            return { success: false, message: 'Recipe not found' };
        }
        
        // Check if recipe is discovered
        if (!this.discoveredRecipes.has(recipeId)) {
            return { success: false, message: 'Recipe not discovered' };
        }
        
        // Check level requirement
        if (recipe.unlockLevel && this.alchemyLevel < recipe.unlockLevel) {
            return { success: false, message: `Requires Alchemy Level ${recipe.unlockLevel}` };
        }
        
        // Check ingredients
        for (const ingredient of recipe.ingredients) {
            if (!this.hasIngredient(ingredient.id, ingredient.amount)) {
                return { success: false, message: `Missing ${ingredient.amount}x ${this.ingredients[ingredient.id]?.name}` };
            }
        }
        
        // Check equipment
        const method = this.brewingMethods[recipe.method];
        if (!method) {
            return { success: false, message: 'Invalid brewing method' };
        }
        
        // Consume ingredients
        for (const ingredient of recipe.ingredients) {
            this.consumeIngredient(ingredient.id, ingredient.amount);
        }
        
        // Create brew
        const brewId = `brew_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const brew = {
            id: brewId,
            recipeId: recipeId,
            recipe: recipe,
            method: recipe.method,
            startTime: Date.now(),
            duration: recipe.duration * 1000, // Convert to ms
            difficulty: recipe.difficulty,
            stage: 'brewing',
            quality: 0,
            progress: 0,
            events: [],
            requiredActions: this.generateBrewingActions(recipe.difficulty)
        };
        
        this.activeBrews.set(brewId, brew);
        
        logger.info(`Started brewing ${recipe.name}`);
        return { success: true, brewId: brewId };
    }
    
    /**
     * Generate random brewing actions player must perform
     */
    generateBrewingActions(difficulty) {
        const actions = [];
        const actionCount = Math.floor(difficulty / 2) + 1;
        const actionTypes = ['stir', 'heat', 'cool', 'add_reagent', 'filter', 'shake'];
        
        for (let i = 0; i < actionCount; i++) {
            const actionType = actionTypes[Math.floor(Math.random() * actionTypes.length)];
            actions.push({
                type: actionType,
                timing: Math.random() * 0.8 + 0.1, // 10% to 90% through brew
                completed: false,
                window: 5000 // 5 second window to complete
            });
        }
        
        return actions.sort((a, b) => a.timing - b.timing);
    }
    
    /**
     * Update brewing process
     */
    update(deltaTime) {
        const now = Date.now();
        
        for (const [brewId, brew] of this.activeBrews) {
            if (brew.stage !== 'brewing') continue;
            
            const elapsed = now - brew.startTime;
            brew.progress = Math.min(1.0, elapsed / brew.duration);
            
            // Check for action windows
            for (const action of brew.requiredActions) {
                if (action.completed) continue;
                
                const actionTime = brew.startTime + (brew.duration * action.timing);
                const timeSinceAction = now - actionTime;
                
                if (timeSinceAction > 0 && timeSinceAction < action.window) {
                    // Action window is open
                    brew.currentAction = action;
                } else if (timeSinceAction >= action.window) {
                    // Action window missed
                    action.completed = true;
                    action.missed = true;
                    brew.quality -= 0.1;
                    brew.events.push({ type: 'missed_action', action: action.type, time: now });
                }
            }
            
            // Check if brewing complete
            if (brew.progress >= 1.0) {
                this.completeBrew(brewId);
            }
        }
    }
    
    /**
     * Perform brewing action
     */
    performAction(brewId, actionType) {
        const brew = this.activeBrews.get(brewId);
        if (!brew || brew.stage !== 'brewing') {
            return { success: false, message: 'Invalid brew' };
        }
        
        if (!brew.currentAction || brew.currentAction.type !== actionType) {
            return { success: false, message: 'Wrong action or timing' };
        }
        
        // Mark action complete
        brew.currentAction.completed = true;
        brew.currentAction = null;
        
        // Increase quality based on timing
        brew.quality += 0.2;
        brew.events.push({ type: 'action_completed', action: actionType, time: Date.now() });
        
        return { success: true, quality: brew.quality };
    }
    
    /**
     * Complete brewing process
     */
    completeBrew(brewId) {
        const brew = this.activeBrews.get(brewId);
        if (!brew) return null;
        
        brew.stage = 'complete';
        brew.endTime = Date.now();
        
        // Calculate final quality
        const methodMod = this.brewingMethods[brew.method].qualityMod;
        const equipmentMod = this.equipment.cauldron.quality;
        const actionsCompleted = brew.requiredActions.filter(a => a.completed && !a.missed).length;
        const actionBonus = actionsCompleted / brew.requiredActions.length;
        
        brew.finalQuality = Math.max(0, Math.min(1.0, 
            (brew.quality * 0.5 + actionBonus * 0.5) * methodMod * equipmentMod
        ));
        
        // Create potion with quality modifiers
        const potion = this.createPotion(brew.recipe, brew.finalQuality);
        
        // Award XP
        const xp = Math.floor(brew.recipe.xpGain * (1 + brew.finalQuality));
        this.addAlchemyXP(xp);
        
        // Mark recipe as completed
        this.completedPotions.add(brew.recipeId);
        
        // Add to inventory
        if (this.gameEngine.inventorySystem) {
            this.gameEngine.inventorySystem.addItem(potion);
        }
        
        logger.info(`Completed ${brew.recipe.name} with ${(brew.finalQuality * 100).toFixed(0)}% quality`);
        
        // Remove from active brews
        this.activeBrews.delete(brewId);
        
        return { potion, quality: brew.finalQuality, xp };
    }
    
    /**
     * Create potion item with quality
     */
    createPotion(recipe, quality) {
        const potion = {
            id: `${recipe.type}_${Date.now()}`,
            name: recipe.name,
            type: 'potion',
            tier: recipe.tier,
            quality: quality,
            effects: { ...recipe.result }
        };
        
        // Apply quality multiplier to numeric effects
        for (const [key, value] of Object.entries(potion.effects)) {
            if (typeof value === 'number') {
                potion.effects[key] = Math.floor(value * (0.5 + quality * 0.5));
            }
        }
        
        return potion;
    }
    
    /**
     * Discover new recipe through experimentation
     */
    experimentBrew(ingredients) {
        // Check for valid recipe combination
        for (const [recipeId, recipe] of Object.entries(this.recipes)) {
            if (this.discoveredRecipes.has(recipeId)) continue;
            
            // Check if ingredients match
            if (this.ingredientsMatch(ingredients, recipe.ingredients)) {
                this.discoveredRecipes.add(recipeId);
                logger.info(`Discovered recipe: ${recipe.name}!`);
                return { success: true, recipe: recipe };
            }
        }
        
        // Failed experiment
        logger.info('Experiment failed - no recipe discovered');
        return { success: false };
    }
    
    /**
     * Check if ingredient lists match
     */
    ingredientsMatch(provided, required) {
        if (provided.length !== required.length) return false;
        
        const providedMap = new Map();
        const requiredMap = new Map();
        
        for (const ing of provided) {
            providedMap.set(ing.id, (providedMap.get(ing.id) || 0) + ing.amount);
        }
        
        for (const ing of required) {
            requiredMap.set(ing.id, (requiredMap.get(ing.id) || 0) + ing.amount);
        }
        
        for (const [id, amount] of requiredMap) {
            if (providedMap.get(id) !== amount) return false;
        }
        
        return true;
    }
    
    /**
     * Add alchemy XP and check for level up
     */
    addAlchemyXP(amount) {
        this.alchemyXP += amount;
        
        while (this.alchemyXP >= this.alchemyXPToNext) {
            this.alchemyXP -= this.alchemyXPToNext;
            this.alchemyLevel++;
            this.alchemyXPToNext = Math.floor(this.alchemyXPToNext * 1.5);
            
            logger.info(`Alchemy Level Up! Now level ${this.alchemyLevel}`);
            this.onLevelUp();
        }
    }
    
    /**
     * Handle alchemy level up
     */
    onLevelUp() {
        // Unlock recipes at certain levels
        for (const [recipeId, recipe] of Object.entries(this.recipes)) {
            if (recipe.unlockLevel === this.alchemyLevel) {
                this.discoveredRecipes.add(recipeId);
                logger.info(`Unlocked recipe: ${recipe.name}`);
            }
        }
    }
    
    /**
     * Upgrade equipment
     */
    upgradeEquipment(equipmentType, tier) {
        if (!this.equipment[equipmentType]) {
            return { success: false, message: 'Invalid equipment type' };
        }
        
        const cost = tier * 1000;
        if (this.gameEngine.economySystem) {
            if (!this.gameEngine.economySystem.canAfford(cost)) {
                return { success: false, message: 'Not enough gold' };
            }
            this.gameEngine.economySystem.spendGold(cost);
        }
        
        this.equipment[equipmentType].tier = tier;
        this.equipment[equipmentType].quality = 1.0 + (tier - 1) * 0.2;
        
        return { success: true };
    }
    
    /**
     * Helper methods
     */
    hasIngredient(ingredientId, amount) {
        if (!this.gameEngine.inventorySystem) return true; // Assume true for testing
        return this.gameEngine.inventorySystem.hasItem(ingredientId, amount);
    }
    
    consumeIngredient(ingredientId, amount) {
        if (this.gameEngine.inventorySystem) {
            this.gameEngine.inventorySystem.removeItem(ingredientId, amount);
        }
    }
    
    getActiveBrews() {
        return Array.from(this.activeBrews.values());
    }
    
    getDiscoveredRecipes() {
        return Array.from(this.discoveredRecipes).map(id => this.recipes[id]);
    }
    
    getAlchemyStats() {
        return {
            level: this.alchemyLevel,
            xp: this.alchemyXP,
            xpToNext: this.alchemyXPToNext,
            discoveredRecipes: this.discoveredRecipes.size,
            totalRecipes: Object.keys(this.recipes).length,
            completedPotions: this.completedPotions.size,
            equipment: this.equipment
        };
    }
}
