/**
 * PetSystem.js
 * Handles pet collection, leveling, abilities, evolution, and equipment
 * Part of Phase 5: Pet/Companion Combat
 */

export class PetSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // Pet collection
        this.ownedPets = new Map();
        this.activePet = null;
        this.petSlots = 3; // Can have up to 3 pets active
        this.activeTeam = [];
        
        // Pet database
        this.petTypes = new Map();
        
        // Evolution paths
        this.evolutionPaths = new Map();
        
        this.initializePetTypes();
        this.initializeEvolutionPaths();
    }
    
    /**
     * Initialize available pet types
     */
    initializePetTypes() {
        // Starter pets
        this.addPetType({
            id: 'smoke_pup',
            name: 'Smoke Pup',
            rarity: 'common',
            element: 'smoke',
            description: 'A playful pup made of swirling smoke',
            baseStats: {
                hp: 100,
                attack: 15,
                defense: 10,
                speed: 12,
                magicPower: 8
            },
            abilities: [
                {
                    id: 'smoke_bite',
                    name: 'Smoke Bite',
                    damage: 20,
                    cooldown: 3,
                    mpCost: 10
                }
            ],
            evolvesTo: 'smoke_wolf',
            evolveLevel: 10,
            equipmentSlots: ['collar', 'accessory']
        });
        
        this.addPetType({
            id: 'flame_sprite',
            name: 'Flame Sprite',
            rarity: 'common',
            element: 'fire',
            description: 'A tiny spirit of pure flame',
            baseStats: {
                hp: 80,
                attack: 20,
                defense: 8,
                speed: 15,
                magicPower: 12
            },
            abilities: [
                {
                    id: 'fireball',
                    name: 'Fireball',
                    damage: 25,
                    cooldown: 4,
                    mpCost: 15
                }
            ],
            evolvesTo: 'flame_guardian',
            evolveLevel: 10,
            equipmentSlots: ['charm', 'accessory']
        });
        
        this.addPetType({
            id: 'crystal_imp',
            name: 'Crystal Imp',
            rarity: 'uncommon',
            element: 'crystal',
            description: 'A mischievous creature formed from living crystal',
            baseStats: {
                hp: 120,
                attack: 18,
                defense: 15,
                speed: 10,
                magicPower: 15
            },
            abilities: [
                {
                    id: 'crystal_shard',
                    name: 'Crystal Shard',
                    damage: 30,
                    cooldown: 5,
                    mpCost: 20
                },
                {
                    id: 'crystal_shield',
                    name: 'Crystal Shield',
                    effect: 'defense_buff',
                    value: 30,
                    duration: 10000,
                    cooldown: 15,
                    mpCost: 25
                }
            ],
            evolvesTo: 'crystal_golem',
            evolveLevel: 15,
            equipmentSlots: ['collar', 'armor', 'accessory']
        });
        
        // Evolved forms
        this.addPetType({
            id: 'smoke_wolf',
            name: 'Smoke Wolf',
            rarity: 'uncommon',
            element: 'smoke',
            description: 'An ethereal wolf that phases through enemies',
            baseStats: {
                hp: 200,
                attack: 35,
                defense: 25,
                speed: 20,
                magicPower: 18
            },
            abilities: [
                {
                    id: 'smoke_bite',
                    name: 'Smoke Bite',
                    damage: 40,
                    cooldown: 3,
                    mpCost: 10
                },
                {
                    id: 'phase_strike',
                    name: 'Phase Strike',
                    damage: 60,
                    cooldown: 8,
                    mpCost: 30,
                    ignoreDefense: true
                }
            ],
            evolvesTo: 'shadow_fenrir',
            evolveLevel: 25,
            equipmentSlots: ['collar', 'armor', 'accessory']
        });
        
        this.addPetType({
            id: 'flame_guardian',
            name: 'Flame Guardian',
            rarity: 'rare',
            element: 'fire',
            description: 'A powerful flame elemental sworn to protect',
            baseStats: {
                hp: 180,
                attack: 45,
                defense: 20,
                speed: 22,
                magicPower: 30
            },
            abilities: [
                {
                    id: 'fireball',
                    name: 'Fireball',
                    damage: 50,
                    cooldown: 4,
                    mpCost: 15
                },
                {
                    id: 'flame_nova',
                    name: 'Flame Nova',
                    damage: 80,
                    aoe: true,
                    cooldown: 12,
                    mpCost: 40
                }
            ],
            evolvesTo: 'inferno_titan',
            evolveLevel: 30,
            equipmentSlots: ['charm', 'armor', 'accessory']
        });
        
        this.addPetType({
            id: 'crystal_golem',
            name: 'Crystal Golem',
            rarity: 'rare',
            element: 'crystal',
            description: 'A massive construct of animated crystal',
            baseStats: {
                hp: 300,
                attack: 40,
                defense: 50,
                speed: 15,
                magicPower: 35
            },
            abilities: [
                {
                    id: 'crystal_shard',
                    name: 'Crystal Shard',
                    damage: 60,
                    cooldown: 5,
                    mpCost: 20
                },
                {
                    id: 'crystal_shield',
                    name: 'Crystal Shield',
                    effect: 'defense_buff',
                    value: 50,
                    duration: 15000,
                    cooldown: 15,
                    mpCost: 25
                },
                {
                    id: 'earthquake',
                    name: 'Earthquake',
                    damage: 100,
                    aoe: true,
                    stun: 2000,
                    cooldown: 20,
                    mpCost: 50
                }
            ],
            evolvesTo: null,
            evolveLevel: null,
            equipmentSlots: ['collar', 'armor', 'accessory', 'relic']
        });
        
        // Legendary final forms
        this.addPetType({
            id: 'shadow_fenrir',
            name: 'Shadow Fenrir',
            rarity: 'legendary',
            element: 'shadow',
            description: 'The legendary shadow wolf of ancient prophecy',
            baseStats: {
                hp: 400,
                attack: 80,
                defense: 50,
                speed: 35,
                magicPower: 40
            },
            abilities: [
                {
                    id: 'shadow_maul',
                    name: 'Shadow Maul',
                    damage: 100,
                    cooldown: 3,
                    mpCost: 20
                },
                {
                    id: 'phase_strike',
                    name: 'Phase Strike',
                    damage: 120,
                    cooldown: 8,
                    mpCost: 30,
                    ignoreDefense: true
                },
                {
                    id: 'shadow_rampage',
                    name: 'Shadow Rampage',
                    damage: 200,
                    aoe: true,
                    cooldown: 25,
                    mpCost: 80,
                    ultimate: true
                }
            ],
            evolvesTo: null,
            evolveLevel: null,
            equipmentSlots: ['collar', 'armor', 'accessory', 'relic']
        });
        
        this.addPetType({
            id: 'inferno_titan',
            name: 'Inferno Titan',
            rarity: 'legendary',
            element: 'fire',
            description: 'A colossal titan wreathed in eternal flames',
            baseStats: {
                hp: 350,
                attack: 100,
                defense: 40,
                speed: 28,
                magicPower: 70
            },
            abilities: [
                {
                    id: 'molten_strike',
                    name: 'Molten Strike',
                    damage: 120,
                    cooldown: 4,
                    mpCost: 25,
                    burn: 5000
                },
                {
                    id: 'flame_nova',
                    name: 'Flame Nova',
                    damage: 150,
                    aoe: true,
                    cooldown: 12,
                    mpCost: 40
                },
                {
                    id: 'apocalypse',
                    name: 'Apocalypse',
                    damage: 300,
                    aoe: true,
                    burn: 10000,
                    cooldown: 30,
                    mpCost: 100,
                    ultimate: true
                }
            ],
            evolvesTo: null,
            evolveLevel: null,
            equipmentSlots: ['charm', 'armor', 'accessory', 'relic']
        });
        
        // Special/Rare pets
        this.addPetType({
            id: 'void_dragon',
            name: 'Void Dragon',
            rarity: 'epic',
            element: 'void',
            description: 'A dragon from the spaces between realities',
            baseStats: {
                hp: 500,
                attack: 90,
                defense: 60,
                speed: 30,
                magicPower: 80
            },
            abilities: [
                {
                    id: 'void_breath',
                    name: 'Void Breath',
                    damage: 150,
                    aoe: true,
                    cooldown: 10,
                    mpCost: 50
                },
                {
                    id: 'reality_tear',
                    name: 'Reality Tear',
                    damage: 250,
                    cooldown: 20,
                    mpCost: 80,
                    ignoreDefense: true,
                    ultimate: true
                }
            ],
            evolvesTo: null,
            evolveLevel: null,
            equipmentSlots: ['collar', 'armor', 'accessory', 'relic'],
            unlockRequirement: { floor: 50 }
        });
        
        this.addPetType({
            id: 'celestial_phoenix',
            name: 'Celestial Phoenix',
            rarity: 'legendary',
            element: 'celestial',
            description: 'The immortal bird of rebirth and light',
            baseStats: {
                hp: 450,
                attack: 85,
                defense: 55,
                speed: 40,
                magicPower: 90
            },
            abilities: [
                {
                    id: 'divine_flame',
                    name: 'Divine Flame',
                    damage: 140,
                    heal: 50,
                    cooldown: 8,
                    mpCost: 40
                },
                {
                    id: 'resurrection',
                    name: 'Resurrection',
                    effect: 'revive',
                    value: 0.5, // Revive with 50% HP
                    cooldown: 120,
                    mpCost: 100
                },
                {
                    id: 'supernova',
                    name: 'Supernova',
                    damage: 400,
                    aoe: true,
                    heal: 100,
                    cooldown: 40,
                    mpCost: 150,
                    ultimate: true
                }
            ],
            evolvesTo: null,
            evolveLevel: null,
            equipmentSlots: ['charm', 'armor', 'accessory', 'relic'],
            unlockRequirement: { achievement: 'legendary_collector' }
        });
    }
    
    /**
     * Add pet type to database
     */
    addPetType(petType) {
        this.petTypes.set(petType.id, petType);
    }
    
    /**
     * Initialize evolution paths
     */
    initializeEvolutionPaths() {
        this.evolutionPaths.set('smoke_pup', {
            stage1: 'smoke_wolf',
            stage2: 'shadow_fenrir'
        });
        
        this.evolutionPaths.set('flame_sprite', {
            stage1: 'flame_guardian',
            stage2: 'inferno_titan'
        });
        
        this.evolutionPaths.set('crystal_imp', {
            stage1: 'crystal_golem'
        });
    }
    
    /**
     * Obtain new pet
     */
    obtainPet(petId) {
        const petType = this.petTypes.get(petId);
        if (!petType) {
            return { success: false, reason: 'Pet type not found' };
        }
        
        // Check unlock requirements
        if (petType.unlockRequirement) {
            if (petType.unlockRequirement.floor) {
                const currentFloor = this.gameEngine.endlessMode?.currentFloor || 1;
                if (currentFloor < petType.unlockRequirement.floor) {
                    return { success: false, reason: 'Floor requirement not met' };
                }
            }
            if (petType.unlockRequirement.achievement) {
                // Check achievement (would integrate with achievement system)
                // For now, simplified
            }
        }
        
        // Create new pet instance
        const pet = this.createPetInstance(petType);
        this.ownedPets.set(pet.instanceId, pet);
        
        logger.info(`🐾 Obtained new pet: ${pet.name}!`);
        
        return { success: true, pet };
    }
    
    /**
     * Create pet instance from type
     */
    createPetInstance(petType) {
        return {
            instanceId: `pet_${Date.now()}_${Math.random()}`,
            typeId: petType.id,
            name: petType.name,
            rarity: petType.rarity,
            element: petType.element,
            description: petType.description,
            level: 1,
            exp: 0,
            stats: { ...petType.baseStats },
            baseStats: { ...petType.baseStats },
            abilities: [...petType.abilities],
            evolvesTo: petType.evolvesTo,
            evolveLevel: petType.evolveLevel,
            equipment: {},
            equipmentSlots: [...petType.equipmentSlots],
            happiness: 100,
            hunger: 100,
            obtainedAt: Date.now()
        };
    }
    
    /**
     * Add experience to pet
     */
    addExp(pet, amount) {
        if (!pet) return;
        
        pet.exp += amount;
        
        // Level up check
        const expNeeded = this.getExpForLevel(pet.level + 1);
        if (pet.exp >= expNeeded) {
            this.levelUpPet(pet);
        }
    }
    
    /**
     * Calculate exp needed for level
     */
    getExpForLevel(level) {
        return Math.floor(100 * Math.pow(1.15, level - 1));
    }
    
    /**
     * Level up pet
     */
    levelUpPet(pet) {
        pet.level++;
        pet.exp = 0;
        
        // Increase stats (5% per level)
        for (const stat in pet.baseStats) {
            pet.baseStats[stat] = Math.floor(pet.baseStats[stat] * 1.05);
            pet.stats[stat] = pet.baseStats[stat];
        }
        
        // Apply equipment bonuses
        this.applyEquipmentBonuses(pet);
        
        logger.info(`🐾 ${pet.name} leveled up to ${pet.level}!`);
        
        // Check for evolution
        if (pet.evolvesTo && pet.level >= pet.evolveLevel) {
            this.evolvePet(pet);
        }
    }
    
    /**
     * Evolve pet to next form
     */
    evolvePet(pet) {
        if (!pet.evolvesTo) {
            return { success: false, reason: 'Pet cannot evolve' };
        }
        
        if (pet.level < pet.evolveLevel) {
            return { success: false, reason: 'Level requirement not met' };
        }
        
        const newType = this.petTypes.get(pet.evolvesTo);
        if (!newType) {
            return { success: false, reason: 'Evolution type not found' };
        }
        
        const oldName = pet.name;
        
        // Evolve
        pet.typeId = newType.id;
        pet.name = newType.name;
        pet.rarity = newType.rarity;
        pet.element = newType.element;
        pet.description = newType.description;
        pet.abilities = [...newType.abilities];
        pet.evolvesTo = newType.evolvesTo;
        pet.evolveLevel = newType.evolveLevel;
        pet.equipmentSlots = [...newType.equipmentSlots];
        
        // Boost stats significantly on evolution
        for (const stat in newType.baseStats) {
            pet.baseStats[stat] = newType.baseStats[stat] + Math.floor(pet.level * 5);
            pet.stats[stat] = pet.baseStats[stat];
        }
        
        // Reapply equipment
        this.applyEquipmentBonuses(pet);
        
        logger.info(`✨ ${oldName} evolved into ${pet.name}!`);
        
        return { success: true, pet, oldName };
    }
    
    /**
     * Equip item on pet
     */
    equipItem(pet, item, slot) {
        if (!pet) {
            return { success: false, reason: 'Pet not found' };
        }
        
        if (!pet.equipmentSlots.includes(slot)) {
            return { success: false, reason: 'Invalid equipment slot for this pet' };
        }
        
        // Unequip current item if any
        if (pet.equipment[slot]) {
            this.unequipItem(pet, slot);
        }
        
        // Equip new item
        pet.equipment[slot] = item;
        this.applyEquipmentBonuses(pet);
        
        return { success: true, pet };
    }
    
    /**
     * Unequip item from pet
     */
    unequipItem(pet, slot) {
        if (!pet || !pet.equipment[slot]) {
            return { success: false };
        }
        
        const item = pet.equipment[slot];
        delete pet.equipment[slot];
        this.applyEquipmentBonuses(pet);
        
        return { success: true, item };
    }
    
    /**
     * Apply equipment bonuses to pet stats
     */
    applyEquipmentBonuses(pet) {
        // Reset to base stats
        for (const stat in pet.baseStats) {
            pet.stats[stat] = pet.baseStats[stat];
        }
        
        // Apply equipment bonuses
        for (const item of Object.values(pet.equipment)) {
            if (item && item.stats) {
                for (const [stat, value] of Object.entries(item.stats)) {
                    pet.stats[stat] = (pet.stats[stat] || 0) + value;
                }
            }
        }
    }
    
    /**
     * Feed pet to increase happiness
     */
    feedPet(pet, foodItem) {
        if (!pet) {
            return { success: false, reason: 'Pet not found' };
        }
        
        const hungerRestored = foodItem.hungerValue || 20;
        const happinessGained = foodItem.happinessValue || 10;
        
        pet.hunger = Math.min(100, pet.hunger + hungerRestored);
        pet.happiness = Math.min(100, pet.happiness + happinessGained);
        
        // Bonus exp if pet is happy
        if (pet.happiness >= 80) {
            this.addExp(pet, 50);
        }
        
        return {
            success: true,
            hunger: pet.hunger,
            happiness: pet.happiness
        };
    }
    
    /**
     * Use pet ability
     */
    usePetAbility(pet, abilityId, target) {
        if (!pet) {
            return { success: false, reason: 'Pet not found' };
        }
        
        const ability = pet.abilities.find(a => a.id === abilityId);
        if (!ability) {
            return { success: false, reason: 'Ability not found' };
        }
        
        // Check cooldown (would need to track this)
        // Check MP cost
        // For now, simplified
        
        return {
            success: true,
            ability,
            damage: ability.damage,
            effect: ability.effect
        };
    }
    
    /**
     * Set active pet
     */
    setActivePet(petInstanceId) {
        const pet = this.ownedPets.get(petInstanceId);
        if (!pet) {
            return { success: false, reason: 'Pet not found' };
        }
        
        this.activePet = pet;
        logger.info(`🐾 ${pet.name} is now active!`);
        
        return { success: true, pet };
    }
    
    /**
     * Add pet to active team
     */
    addToTeam(petInstanceId) {
        if (this.activeTeam.length >= this.petSlots) {
            return { success: false, reason: 'Team is full' };
        }
        
        const pet = this.ownedPets.get(petInstanceId);
        if (!pet) {
            return { success: false, reason: 'Pet not found' };
        }
        
        if (this.activeTeam.includes(petInstanceId)) {
            return { success: false, reason: 'Pet already in team' };
        }
        
        this.activeTeam.push(petInstanceId);
        
        return { success: true, team: this.getActiveTeam() };
    }
    
    /**
     * Remove pet from active team
     */
    removeFromTeam(petInstanceId) {
        const index = this.activeTeam.indexOf(petInstanceId);
        if (index === -1) {
            return { success: false, reason: 'Pet not in team' };
        }
        
        this.activeTeam.splice(index, 1);
        
        return { success: true, team: this.getActiveTeam() };
    }
    
    /**
     * Get active team
     */
    getActiveTeam() {
        return this.activeTeam.map(id => this.ownedPets.get(id)).filter(p => p);
    }
    
    /**
     * Get all owned pets
     */
    getAllPets() {
        return Array.from(this.ownedPets.values());
    }
    
    /**
     * Save system state
     */
    save() {
        return {
            ownedPets: Array.from(this.ownedPets.entries()),
            activePet: this.activePet?.instanceId,
            activeTeam: this.activeTeam
        };
    }
    
    /**
     * Load system state
     */
    load(data) {
        if (!data) return;
        
        if (data.ownedPets) {
            this.ownedPets = new Map(data.ownedPets);
        }
        
        if (data.activePet) {
            this.activePet = this.ownedPets.get(data.activePet);
        }
        
        if (data.activeTeam) {
            this.activeTeam = data.activeTeam;
        }
    }
    
    /**
     * Update system (called each frame)
     */
    update(deltaTime) {
        // Decrease hunger and happiness over time
        const timeInSeconds = deltaTime;
        const hungerDecay = 0.01; // Per second
        const happinessDecay = 0.005; // Per second
        
        for (const pet of this.ownedPets.values()) {
            pet.hunger = Math.max(0, pet.hunger - hungerDecay * timeInSeconds);
            
            // Happiness decreases faster if hungry
            const hungerPenalty = pet.hunger < 30 ? 2 : 1;
            pet.happiness = Math.max(0, pet.happiness - happinessDecay * timeInSeconds * hungerPenalty);
        }
    }
}
