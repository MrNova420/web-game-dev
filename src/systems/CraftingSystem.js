import { logger } from '../core/Logger.js';
/**
 * CraftingSystem.js
 * Handles material gathering, crafting recipes, and item creation
 * Part of Phase 4: Crafting & Economy
 */

export class CraftingSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.materials = new Map(); // Material name -> quantity
        this.recipes = new Map(); // Recipe ID -> Recipe
        this.craftingStations = [];
        this.unlockedRecipes = new Set();
        
        this.initializeMaterials();
        this.initializeRecipes();
        this.initializeStations();
    }
    
    /**
     * Initialize material types
     */
    initializeMaterials() {
        // Basic materials from enemies
        this.materialTypes = {
            // Common drops
            'essence_shard': { name: 'Essence Shard', rarity: 'common', value: 5 },
            'monster_hide': { name: 'Monster Hide', rarity: 'common', value: 3 },
            'bone_fragment': { name: 'Bone Fragment', rarity: 'common', value: 2 },
            
            // Uncommon drops
            'mystical_ore': { name: 'Mystical Ore', rarity: 'uncommon', value: 15 },
            'corrupted_crystal': { name: 'Corrupted Crystal', rarity: 'uncommon', value: 12 },
            'ethereal_fiber': { name: 'Ethereal Fiber', rarity: 'uncommon', value: 10 },
            
            // Rare drops
            'dragons_scale': { name: "Dragon's Scale", rarity: 'rare', value: 50 },
            'void_essence': { name: 'Void Essence', rarity: 'rare', value: 45 },
            'phoenix_feather': { name: 'Phoenix Feather', rarity: 'rare', value: 40 },
            
            // Epic drops
            'celestial_fragment': { name: 'Celestial Fragment', rarity: 'epic', value: 150 },
            'primordial_dust': { name: 'Primordial Dust', rarity: 'epic', value: 120 },
            'arcane_catalyst': { name: 'Arcane Catalyst', rarity: 'epic', value: 100 },
            
            // Legendary drops
            'godstone': { name: 'Godstone', rarity: 'legendary', value: 500 },
            'chaos_core': { name: 'Chaos Core', rarity: 'legendary', value: 400 },
            'reality_crystal': { name: 'Reality Crystal', rarity: 'legendary', value: 350 }
        };
    }
    
    /**
     * Initialize crafting recipes
     */
    initializeRecipes() {
        // Weapon recipes
        this.addRecipe({
            id: 'sword_iron',
            name: 'Iron Sword',
            type: 'weapon',
            rarity: 'common',
            station: 'forge',
            materials: {
                'essence_shard': 5,
                'monster_hide': 3,
                'bone_fragment': 2
            },
            result: {
                type: 'weapon',
                subtype: 'sword',
                stats: { attack: 15, critChance: 0.05 }
            },
            unlocked: true
        });
        
        this.addRecipe({
            id: 'sword_steel',
            name: 'Steel Sword',
            type: 'weapon',
            rarity: 'uncommon',
            station: 'forge',
            materials: {
                'mystical_ore': 8,
                'corrupted_crystal': 4,
                'essence_shard': 10
            },
            result: {
                type: 'weapon',
                subtype: 'sword',
                stats: { attack: 30, critChance: 0.1 }
            },
            unlocked: false
        });
        
        this.addRecipe({
            id: 'staff_basic',
            name: 'Apprentice Staff',
            type: 'weapon',
            rarity: 'common',
            station: 'arcane_table',
            materials: {
                'essence_shard': 8,
                'ethereal_fiber': 4
            },
            result: {
                type: 'weapon',
                subtype: 'staff',
                stats: { magicPower: 20, manaRegen: 2 }
            },
            unlocked: true
        });
        
        this.addRecipe({
            id: 'staff_void',
            name: 'Void Staff',
            type: 'weapon',
            rarity: 'rare',
            station: 'arcane_table',
            materials: {
                'void_essence': 5,
                'corrupted_crystal': 8,
                'arcane_catalyst': 2
            },
            result: {
                type: 'weapon',
                subtype: 'staff',
                stats: { magicPower: 50, manaRegen: 5, critChance: 0.15 }
            },
            unlocked: false
        });
        
        // Armor recipes
        this.addRecipe({
            id: 'armor_leather',
            name: 'Leather Armor',
            type: 'armor',
            rarity: 'common',
            station: 'forge',
            materials: {
                'monster_hide': 10,
                'bone_fragment': 5
            },
            result: {
                type: 'armor',
                subtype: 'light',
                stats: { defense: 10, evasion: 0.05 }
            },
            unlocked: true
        });
        
        this.addRecipe({
            id: 'armor_chain',
            name: 'Chainmail Armor',
            type: 'armor',
            rarity: 'uncommon',
            station: 'forge',
            materials: {
                'mystical_ore': 12,
                'monster_hide': 8,
                'essence_shard': 6
            },
            result: {
                type: 'armor',
                subtype: 'medium',
                stats: { defense: 25, hp: 50 }
            },
            unlocked: false
        });
        
        this.addRecipe({
            id: 'armor_dragon',
            name: 'Dragon Scale Armor',
            type: 'armor',
            rarity: 'epic',
            station: 'forge',
            materials: {
                'dragons_scale': 8,
                'primordial_dust': 4,
                'mystical_ore': 15
            },
            result: {
                type: 'armor',
                subtype: 'heavy',
                stats: { defense: 60, hp: 150, fireResist: 0.3 }
            },
            unlocked: false
        });
        
        // Accessory recipes
        this.addRecipe({
            id: 'ring_power',
            name: 'Ring of Power',
            type: 'accessory',
            rarity: 'uncommon',
            station: 'jeweler',
            materials: {
                'corrupted_crystal': 6,
                'essence_shard': 10
            },
            result: {
                type: 'accessory',
                subtype: 'ring',
                stats: { attack: 10, magicPower: 10 }
            },
            unlocked: true
        });
        
        this.addRecipe({
            id: 'amulet_life',
            name: 'Amulet of Vitality',
            type: 'accessory',
            rarity: 'rare',
            station: 'jeweler',
            materials: {
                'phoenix_feather': 4,
                'void_essence': 3,
                'corrupted_crystal': 8
            },
            result: {
                type: 'accessory',
                subtype: 'amulet',
                stats: { hp: 100, hpRegen: 5 }
            },
            unlocked: false
        });
        
        // Consumable recipes
        this.addRecipe({
            id: 'potion_health_small',
            name: 'Small Health Potion',
            type: 'consumable',
            rarity: 'common',
            station: 'alchemy',
            materials: {
                'ethereal_fiber': 2,
                'essence_shard': 3
            },
            result: {
                type: 'consumable',
                subtype: 'potion',
                effect: 'heal',
                value: 50
            },
            unlocked: true,
            craftAmount: 3 // Craft 3 potions at once
        });
        
        this.addRecipe({
            id: 'potion_health_large',
            name: 'Large Health Potion',
            type: 'consumable',
            rarity: 'uncommon',
            station: 'alchemy',
            materials: {
                'phoenix_feather': 1,
                'ethereal_fiber': 5,
                'essence_shard': 8
            },
            result: {
                type: 'consumable',
                subtype: 'potion',
                effect: 'heal',
                value: 150
            },
            unlocked: false,
            craftAmount: 2
        });
        
        this.addRecipe({
            id: 'potion_mana',
            name: 'Mana Potion',
            type: 'consumable',
            rarity: 'common',
            station: 'alchemy',
            materials: {
                'corrupted_crystal': 2,
                'essence_shard': 4
            },
            result: {
                type: 'consumable',
                subtype: 'potion',
                effect: 'mana',
                value: 50
            },
            unlocked: true,
            craftAmount: 3
        });
        
        this.addRecipe({
            id: 'potion_strength',
            name: 'Strength Elixir',
            type: 'consumable',
            rarity: 'rare',
            station: 'alchemy',
            materials: {
                'dragons_scale': 2,
                'arcane_catalyst': 1,
                'essence_shard': 10
            },
            result: {
                type: 'consumable',
                subtype: 'buff',
                effect: 'strength',
                value: 30, // +30% attack
                duration: 60000 // 60 seconds
            },
            unlocked: false,
            craftAmount: 1
        });
        
        // Enchantment recipes
        this.addRecipe({
            id: 'enchant_fire',
            name: 'Fire Enchantment',
            type: 'enchantment',
            rarity: 'rare',
            station: 'enchanter',
            materials: {
                'phoenix_feather': 3,
                'arcane_catalyst': 2,
                'essence_shard': 15
            },
            result: {
                type: 'enchantment',
                element: 'fire',
                stats: { fireDamage: 20, burnChance: 0.15 }
            },
            unlocked: false
        });
        
        this.addRecipe({
            id: 'enchant_void',
            name: 'Void Enchantment',
            type: 'enchantment',
            rarity: 'epic',
            station: 'enchanter',
            materials: {
                'void_essence': 5,
                'primordial_dust': 3,
                'celestial_fragment': 1
            },
            result: {
                type: 'enchantment',
                element: 'void',
                stats: { voidDamage: 35, lifesteal: 0.1 }
            },
            unlocked: false
        });
        
        // Special legendary recipes
        this.addRecipe({
            id: 'weapon_godslayer',
            name: 'Godslayer Blade',
            type: 'weapon',
            rarity: 'legendary',
            station: 'forge',
            materials: {
                'godstone': 2,
                'chaos_core': 1,
                'dragons_scale': 10,
                'celestial_fragment': 5
            },
            result: {
                type: 'weapon',
                subtype: 'sword',
                stats: { 
                    attack: 150, 
                    critChance: 0.3,
                    critDamage: 2.5,
                    lifesteal: 0.15
                }
            },
            unlocked: false
        });
        
        this.addRecipe({
            id: 'armor_reality',
            name: 'Reality Warper Armor',
            type: 'armor',
            rarity: 'legendary',
            station: 'forge',
            materials: {
                'reality_crystal': 3,
                'godstone': 1,
                'primordial_dust': 8,
                'celestial_fragment': 4
            },
            result: {
                type: 'armor',
                subtype: 'heavy',
                stats: { 
                    defense: 100, 
                    hp: 300,
                    allResist: 0.25,
                    damageReflect: 0.2
                }
            },
            unlocked: false
        });
    }
    
    /**
     * Initialize crafting stations
     */
    initializeStations() {
        this.stationTypes = {
            forge: {
                name: 'Forge',
                description: 'Craft weapons and armor',
                unlocked: true,
                level: 1,
                maxLevel: 10
            },
            alchemy: {
                name: 'Alchemy Table',
                description: 'Brew potions and elixirs',
                unlocked: true,
                level: 1,
                maxLevel: 10
            },
            arcane_table: {
                name: 'Arcane Table',
                description: 'Craft magical weapons',
                unlocked: false,
                level: 1,
                maxLevel: 10,
                unlockRequirement: { playerLevel: 10 }
            },
            jeweler: {
                name: 'Jeweler Bench',
                description: 'Craft accessories',
                unlocked: false,
                level: 1,
                maxLevel: 10,
                unlockRequirement: { playerLevel: 15 }
            },
            enchanter: {
                name: 'Enchanting Altar',
                description: 'Apply enchantments to items',
                unlocked: false,
                level: 1,
                maxLevel: 10,
                unlockRequirement: { playerLevel: 20 }
            }
        };
    }
    
    /**
     * Add a recipe to the system
     */
    addRecipe(recipe) {
        this.recipes.set(recipe.id, recipe);
        if (recipe.unlocked) {
            this.unlockedRecipes.add(recipe.id);
        }
    }
    
    /**
     * Add material to inventory
     */
    addMaterial(materialId, amount = 1) {
        const current = this.materials.get(materialId) || 0;
        this.materials.set(materialId, current + amount);
        
        // Check for recipe unlocks based on discovered materials
        this.checkRecipeUnlocks();
        
        return this.materials.get(materialId);
    }
    
    /**
     * Remove material from inventory
     */
    removeMaterial(materialId, amount = 1) {
        const current = this.materials.get(materialId) || 0;
        if (current >= amount) {
            this.materials.set(materialId, current - amount);
            return true;
        }
        return false;
    }
    
    /**
     * Get material quantity
     */
    getMaterialCount(materialId) {
        return this.materials.get(materialId) || 0;
    }
    
    /**
     * Drop materials from enemy
     */
    dropMaterialsFromEnemy(enemy) {
        const drops = [];
        const floor = this.gameEngine.endlessMode?.currentFloor || 1;
        
        // Determine drop rates based on enemy type and floor
        const baseDropChance = 0.5; // 50% base chance
        const rarityBonus = enemy.isBoss ? 0.3 : 0;
        const floorBonus = Math.min(floor * 0.01, 0.3); // +1% per floor, max 30%
        
        const dropChance = Math.min(baseDropChance + rarityBonus + floorBonus, 0.95);
        
        if (Math.random() < dropChance) {
            // Determine material rarity
            const rarityRoll = Math.random();
            let materialRarity;
            
            if (rarityRoll < 0.5) {
                materialRarity = 'common';
            } else if (rarityRoll < 0.75) {
                materialRarity = 'uncommon';
            } else if (rarityRoll < 0.90) {
                materialRarity = 'rare';
            } else if (rarityRoll < 0.98) {
                materialRarity = 'epic';
            } else {
                materialRarity = 'legendary';
            }
            
            // Get materials of this rarity
            const materialsOfRarity = Object.entries(this.materialTypes)
                .filter(([_, mat]) => mat.rarity === materialRarity)
                .map(([id, _]) => id);
            
            if (materialsOfRarity.length > 0) {
                const materialId = materialsOfRarity[Math.floor(Math.random() * materialsOfRarity.length)];
                const amount = enemy.isBoss ? Math.floor(Math.random() * 3) + 2 : 1;
                
                this.addMaterial(materialId, amount);
                drops.push({ id: materialId, amount, material: this.materialTypes[materialId] });
            }
        }
        
        return drops;
    }
    
    /**
     * Check if player can craft recipe
     */
    canCraft(recipeId) {
        const recipe = this.recipes.get(recipeId);
        if (!recipe) return false;
        
        // Check if recipe is unlocked
        if (!this.unlockedRecipes.has(recipeId)) return false;
        
        // Check if station is available
        const station = this.stationTypes[recipe.station];
        if (!station || !station.unlocked) return false;
        
        // Check materials
        for (const [materialId, required] of Object.entries(recipe.materials)) {
            const available = this.getMaterialCount(materialId);
            if (available < required) return false;
        }
        
        return true;
    }
    
    /**
     * Craft an item from recipe
     */
    craft(recipeId) {
        if (!this.canCraft(recipeId)) {
            return { success: false, reason: 'Cannot craft this recipe' };
        }
        
        const recipe = this.recipes.get(recipeId);
        
        // Consume materials
        for (const [materialId, required] of Object.entries(recipe.materials)) {
            this.removeMaterial(materialId, required);
        }
        
        // Create the item(s)
        const craftAmount = recipe.craftAmount || 1;
        const items = [];
        
        for (let i = 0; i < craftAmount; i++) {
            const item = this.createItemFromRecipe(recipe);
            items.push(item);
            
            // Add to inventory if available
            if (this.gameEngine.inventorySystem) {
                this.gameEngine.inventorySystem.addItem(item);
            }
        }
        
        // Gain crafting experience
        this.gainCraftingExp(recipe);
        
        return {
            success: true,
            recipe: recipe,
            items: items
        };
    }
    
    /**
     * Create item from recipe with stat rolls
     */
    createItemFromRecipe(recipe) {
        const item = {
            id: `crafted_${recipe.id}_${Date.now()}`,
            name: recipe.name,
            type: recipe.result.type,
            subtype: recipe.result.subtype,
            rarity: recipe.rarity,
            stats: { ...recipe.result.stats },
            crafted: true,
            craftedAt: Date.now()
        };
        
        // Add special properties
        if (recipe.result.effect) {
            item.effect = recipe.result.effect;
            item.value = recipe.result.value;
            item.duration = recipe.result.duration;
        }
        
        if (recipe.result.element) {
            item.element = recipe.result.element;
        }
        
        // Apply random stat variation (±10%)
        if (item.stats) {
            for (const [stat, value] of Object.entries(item.stats)) {
                if (typeof value === 'number' && value > 1) {
                    const variation = 0.1; // 10% variation
                    const minVal = Math.floor(value * (1 - variation));
                    const maxVal = Math.ceil(value * (1 + variation));
                    item.stats[stat] = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
                }
            }
        }
        
        return item;
    }
    
    /**
     * Gain crafting experience
     */
    gainCraftingExp(recipe) {
        const expValues = {
            common: 10,
            uncommon: 25,
            rare: 50,
            epic: 100,
            legendary: 250
        };
        
        const exp = expValues[recipe.rarity] || 10;
        
        // Add to player's crafting skill (if system exists)
        if (this.gameEngine.player) {
            // This would integrate with a skill system
            logger.info(`Gained ${exp} crafting experience from ${recipe.name}`);
        }
    }
    
    /**
     * Check for recipe unlocks
     */
    checkRecipeUnlocks() {
        for (const [recipeId, recipe] of this.recipes.entries()) {
            if (!this.unlockedRecipes.has(recipeId)) {
                // Check material discovery unlock
                const hasMaterials = Object.keys(recipe.materials).some(matId => 
                    this.getMaterialCount(matId) > 0
                );
                
                if (hasMaterials && Math.random() < 0.1) { // 10% chance to discover
                    this.unlockRecipe(recipeId);
                }
            }
        }
    }
    
    /**
     * Unlock a recipe
     */
    unlockRecipe(recipeId) {
        const recipe = this.recipes.get(recipeId);
        if (recipe && !this.unlockedRecipes.has(recipeId)) {
            this.unlockedRecipes.add(recipeId);
            logger.info(`Discovered recipe: ${recipe.name}!`);
            return true;
        }
        return false;
    }
    
    /**
     * Unlock crafting station
     */
    unlockStation(stationId) {
        const station = this.stationTypes[stationId];
        if (station && !station.unlocked) {
            // Check requirements
            if (station.unlockRequirement) {
                const player = this.gameEngine.player;
                if (station.unlockRequirement.playerLevel && 
                    player.level < station.unlockRequirement.playerLevel) {
                    return false;
                }
            }
            
            station.unlocked = true;
            logger.info(`Unlocked crafting station: ${station.name}!`);
            return true;
        }
        return false;
    }
    
    /**
     * Upgrade crafting station
     */
    upgradeStation(stationId, cost = {}) {
        const station = this.stationTypes[stationId];
        if (!station || !station.unlocked) return false;
        
        if (station.level >= station.maxLevel) return false;
        
        // Check and consume cost
        for (const [materialId, required] of Object.entries(cost)) {
            if (this.getMaterialCount(materialId) < required) return false;
        }
        
        for (const [materialId, required] of Object.entries(cost)) {
            this.removeMaterial(materialId, required);
        }
        
        station.level++;
        logger.info(`Upgraded ${station.name} to level ${station.level}!`);
        return true;
    }
    
    /**
     * Get all available recipes
     */
    getAvailableRecipes(filter = {}) {
        const recipes = [];
        
        for (const [recipeId, recipe] of this.recipes.entries()) {
            if (!this.unlockedRecipes.has(recipeId)) continue;
            
            // Apply filters
            if (filter.type && recipe.type !== filter.type) continue;
            if (filter.rarity && recipe.rarity !== filter.rarity) continue;
            if (filter.station && recipe.station !== filter.station) continue;
            
            recipes.push({
                id: recipeId,
                ...recipe,
                canCraft: this.canCraft(recipeId)
            });
        }
        
        return recipes;
    }
    
    /**
     * Get all materials
     */
    getAllMaterials() {
        const materials = [];
        
        for (const [materialId, material] of Object.entries(this.materialTypes)) {
            materials.push({
                id: materialId,
                ...material,
                count: this.getMaterialCount(materialId)
            });
        }
        
        return materials;
    }
    
    /**
     * Save system state
     */
    save() {
        return {
            materials: Array.from(this.materials.entries()),
            unlockedRecipes: Array.from(this.unlockedRecipes),
            stations: Object.entries(this.stationTypes).map(([id, station]) => ({
                id,
                unlocked: station.unlocked,
                level: station.level
            }))
        };
    }
    
    /**
     * Load system state
     */
    load(data) {
        if (!data) return;
        
        if (data.materials) {
            this.materials = new Map(data.materials);
        }
        
        if (data.unlockedRecipes) {
            this.unlockedRecipes = new Set(data.unlockedRecipes);
        }
        
        if (data.stations) {
            for (const stationData of data.stations) {
                const station = this.stationTypes[stationData.id];
                if (station) {
                    station.unlocked = stationData.unlocked;
                    station.level = stationData.level;
                }
            }
        }
    }
    
    /**
     * Update system (called each frame)
     */
    update(deltaTime) {
        // Auto-unlock stations based on player level
        if (this.gameEngine.player) {
            for (const [stationId, station] of Object.entries(this.stationTypes)) {
                if (!station.unlocked && station.unlockRequirement) {
                    if (this.gameEngine.player.level >= station.unlockRequirement.playerLevel) {
                        this.unlockStation(stationId);
                    }
                }
            }
        }
    }
}
