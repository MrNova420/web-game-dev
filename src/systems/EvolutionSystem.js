/**
 * EvolutionSystem.js
 * Phase 7 - Evolution System
 * Character, pet, and weapon evolution mechanics
 * ~400 lines
 */

export class EvolutionSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // Evolution tracking
        this.playerEvolutions = [];
        this.petEvolutions = new Map(); // petId -> evolution data
        this.weaponEvolutions = new Map(); // weaponId -> evolution data
        
        // Evolution tiers
        this.evolutionTiers = ['base', 'evolved', 'advanced', 'ultimate', 'transcendent'];
        
        // Evolution requirements database
        this.evolutionDatabase = this.createEvolutionDatabase();
    }
    
    /**
     * Create evolution database
     */
    createEvolutionDatabase() {
        return {
            // Player class evolutions
            player: {
                warrior: {
                    tier1: {
                        name: 'Berserker',
                        requirements: { level: 25, kills: 500, bossKills: 10 },
                        bonuses: { attack: 1.3, critDamage: 1.5, hp: 1.2 },
                        newAbilities: ['rage', 'blood_frenzy'],
                        appearance: 'berserker_skin'
                    },
                    tier2: {
                        name: 'Warlord',
                        requirements: { level: 50, kills: 2000, bossKills: 50 },
                        bonuses: { attack: 1.6, critDamage: 2.0, hp: 1.5, defense: 1.3 },
                        newAbilities: ['war_cry', 'devastate', 'last_stand'],
                        appearance: 'warlord_skin'
                    },
                    tier3: {
                        name: 'Titan',
                        requirements: { level: 100, kills: 10000, bossKills: 200 },
                        bonuses: { attack: 2.0, critDamage: 3.0, hp: 2.0, defense: 1.6 },
                        newAbilities: ['titan_form', 'world_breaker', 'unstoppable'],
                        appearance: 'titan_skin'
                    }
                },
                mage: {
                    tier1: {
                        name: 'Archmage',
                        requirements: { level: 25, spellsCast: 1000, magicDamage: 50000 },
                        bonuses: { magicPower: 1.4, manaCost: 0.8, cooldown: 0.9 },
                        newAbilities: ['arcane_mastery', 'spell_weaving'],
                        appearance: 'archmage_skin'
                    },
                    tier2: {
                        name: 'Sage',
                        requirements: { level: 50, spellsCast: 5000, magicDamage: 500000 },
                        bonuses: { magicPower: 1.8, manaCost: 0.6, cooldown: 0.7 },
                        newAbilities: ['omniscience', 'meteor_swarm', 'time_stop'],
                        appearance: 'sage_skin'
                    },
                    tier3: {
                        name: 'Transcendent',
                        requirements: { level: 100, spellsCast: 20000, magicDamage: 5000000 },
                        bonuses: { magicPower: 2.5, manaCost: 0.4, cooldown: 0.5 },
                        newAbilities: ['reality_warp', 'cosmic_cascade', 'infinite_mana'],
                        appearance: 'transcendent_skin'
                    }
                },
                rogue: {
                    tier1: {
                        name: 'Shadow Assassin',
                        requirements: { level: 25, criticalHits: 500, backstabs: 100 },
                        bonuses: { critChance: 1.5, critDamage: 1.8, speed: 1.3 },
                        newAbilities: ['shadow_step', 'assassinate'],
                        appearance: 'assassin_skin'
                    },
                    tier2: {
                        name: 'Phantom',
                        requirements: { level: 50, criticalHits: 2000, backstabs: 500 },
                        bonuses: { critChance: 2.0, critDamage: 2.5, speed: 1.6, dodge: 1.5 },
                        newAbilities: ['phantom_dance', 'death_mark', 'shadow_clone'],
                        appearance: 'phantom_skin'
                    },
                    tier3: {
                        name: 'Void Walker',
                        requirements: { level: 100, criticalHits: 10000, backstabs: 2000 },
                        bonuses: { critChance: 3.0, critDamage: 4.0, speed: 2.0, dodge: 2.0 },
                        newAbilities: ['void_step', 'dimensional_strike', 'perfect_assassination'],
                        appearance: 'void_walker_skin'
                    }
                }
            },
            
            // Pet evolutions
            pets: {
                dragon: {
                    tier1: { 
                        name: 'Drake', 
                        level: 1,
                        stats: { hp: 100, attack: 20, defense: 15 },
                        abilities: ['flame_breath', 'claw_strike']
                    },
                    tier2: { 
                        name: 'Dragon', 
                        level: 25,
                        requirements: { battles: 50, wins: 30 },
                        stats: { hp: 300, attack: 60, defense: 45 },
                        abilities: ['flame_breath', 'claw_strike', 'dragon_roar', 'tail_sweep']
                    },
                    tier3: { 
                        name: 'Elder Dragon', 
                        level: 50,
                        requirements: { battles: 200, wins: 150 },
                        stats: { hp: 800, attack: 150, defense: 120 },
                        abilities: ['inferno', 'dragon_dive', 'dragon_roar', 'wing_gust', 'fireball']
                    },
                    tier4: { 
                        name: 'Ancient Dragon', 
                        level: 100,
                        requirements: { battles: 500, wins: 400, legendary: true },
                        stats: { hp: 2000, attack: 350, defense: 300 },
                        abilities: ['meteor_storm', 'dragon_ascension', 'infernal_wrath', 'time_dilation']
                    }
                },
                wolf: {
                    tier1: { 
                        name: 'Pup', 
                        level: 1,
                        stats: { hp: 80, attack: 25, defense: 10 },
                        abilities: ['bite', 'growl']
                    },
                    tier2: { 
                        name: 'Wolf', 
                        level: 25,
                        requirements: { battles: 50, wins: 30 },
                        stats: { hp: 200, attack: 70, defense: 30 },
                        abilities: ['savage_bite', 'howl', 'pack_tactics']
                    },
                    tier3: { 
                        name: 'Dire Wolf', 
                        level: 50,
                        requirements: { battles: 200, wins: 150 },
                        stats: { hp: 500, attack: 180, defense: 80 },
                        abilities: ['feral_rush', 'alpha_howl', 'blood_rage', 'shadow_pounce']
                    },
                    tier4: { 
                        name: 'Fenrir', 
                        level: 100,
                        requirements: { battles: 500, wins: 400, legendary: true },
                        stats: { hp: 1500, attack: 400, defense: 200 },
                        abilities: ['world_eater', 'ragnarok_howl', 'chains_breaker', 'fenrir_bite']
                    }
                }
            },
            
            // Weapon evolutions
            weapons: {
                sword: {
                    tier1: { 
                        name: 'Iron Sword', 
                        damage: 20, 
                        rarity: 'common',
                        effects: []
                    },
                    tier2: { 
                        name: 'Steel Blade', 
                        damage: 50,
                        requirements: { kills: 100 },
                        rarity: 'uncommon',
                        effects: ['sharpness_1']
                    },
                    tier3: { 
                        name: 'Mithril Sword', 
                        damage: 120,
                        requirements: { kills: 500, material: 'mithril_ore' },
                        rarity: 'rare',
                        effects: ['sharpness_2', 'lightweight']
                    },
                    tier4: { 
                        name: 'Legendary Blade', 
                        damage: 300,
                        requirements: { kills: 2000, bossKills: 50, material: 'legendary_essence' },
                        rarity: 'legendary',
                        effects: ['sharpness_3', 'critical_edge', 'soul_stealer']
                    },
                    tier5: { 
                        name: 'Excalibur', 
                        damage: 750,
                        requirements: { kills: 10000, bossKills: 200, legendary: true },
                        rarity: 'mythic',
                        effects: ['divine_strike', 'holy_aura', 'legendary_power', 'invincible']
                    }
                },
                staff: {
                    tier1: { 
                        name: 'Wooden Staff', 
                        damage: 15, 
                        rarity: 'common',
                        effects: []
                    },
                    tier2: { 
                        name: 'Crystal Staff', 
                        damage: 40,
                        requirements: { spellsCast: 200 },
                        rarity: 'uncommon',
                        effects: ['magic_amp_1']
                    },
                    tier3: { 
                        name: 'Arcane Staff', 
                        damage: 100,
                        requirements: { spellsCast: 1000, material: 'arcane_crystal' },
                        rarity: 'rare',
                        effects: ['magic_amp_2', 'mana_efficiency']
                    },
                    tier4: { 
                        name: 'Cosmic Rod', 
                        damage: 250,
                        requirements: { spellsCast: 5000, bossKills: 50, material: 'star_fragment' },
                        rarity: 'legendary',
                        effects: ['magic_amp_3', 'spell_echo', 'cosmic_power']
                    },
                    tier5: { 
                        name: 'Staff of Eternity', 
                        damage: 650,
                        requirements: { spellsCast: 20000, bossKills: 200, legendary: true },
                        rarity: 'mythic',
                        effects: ['infinite_power', 'reality_bend', 'time_master', 'omnipotence']
                    }
                }
            }
        };
    }
    
    /**
     * Check if evolution is available
     */
    canEvolve(entityType, entityId, evolutionTier) {
        const evolutionData = this.getEvolutionData(entityType, entityId, evolutionTier);
        if (!evolutionData) return { can: false, reason: 'Evolution not found' };
        
        // Check requirements
        if (evolutionData.requirements) {
            const missing = [];
            
            for (const [req, value] of Object.entries(evolutionData.requirements)) {
                if (!this.checkRequirement(entityType, entityId, req, value)) {
                    missing.push(`${req}: ${value}`);
                }
            }
            
            if (missing.length > 0) {
                return { can: false, reason: 'Missing requirements', missing };
            }
        }
        
        return { can: true };
    }
    
    /**
     * Get evolution data
     */
    getEvolutionData(entityType, entityId, tier) {
        const db = this.evolutionDatabase[entityType];
        if (!db) return null;
        
        // For player evolutions
        if (entityType === 'player' && this.gameEngine.player) {
            const playerClass = this.gameEngine.player.class || 'warrior';
            const classData = db[playerClass];
            return classData ? classData[tier] : null;
        }
        
        // For pets/weapons
        return db[entityId] ? db[entityId][tier] : null;
    }
    
    /**
     * Check if requirement is met
     */
    checkRequirement(entityType, entityId, requirement, value) {
        if (entityType === 'player' && this.gameEngine.player) {
            const player = this.gameEngine.player;
            
            switch (requirement) {
                case 'level':
                    return player.level >= value;
                case 'kills':
                    return (player.stats?.kills || 0) >= value;
                case 'bossKills':
                    return (player.stats?.bossKills || 0) >= value;
                case 'spellsCast':
                    return (player.stats?.spellsCast || 0) >= value;
                case 'magicDamage':
                    return (player.stats?.totalMagicDamage || 0) >= value;
                case 'criticalHits':
                    return (player.stats?.criticalHits || 0) >= value;
                case 'backstabs':
                    return (player.stats?.backstabs || 0) >= value;
                case 'legendary':
                    return value === true && this.hasLegendaryStatus();
                default:
                    return false;
            }
        }
        
        if (entityType === 'pets') {
            const petData = this.petEvolutions.get(entityId);
            if (!petData) return false;
            
            switch (requirement) {
                case 'battles':
                    return petData.battles >= value;
                case 'wins':
                    return petData.wins >= value;
                case 'legendary':
                    return value === true && petData.legendary;
                default:
                    return false;
            }
        }
        
        if (entityType === 'weapons') {
            const weaponData = this.weaponEvolutions.get(entityId);
            if (!weaponData) return false;
            
            switch (requirement) {
                case 'kills':
                    return weaponData.kills >= value;
                case 'bossKills':
                    return weaponData.bossKills >= value;
                case 'spellsCast':
                    return weaponData.spellsCast >= value;
                case 'material':
                    return this.hasMaterial(value);
                case 'legendary':
                    return value === true && weaponData.legendary;
                default:
                    return false;
            }
        }
        
        return false;
    }
    
    /**
     * Evolve player class
     */
    evolvePlayer(tier) {
        if (!this.gameEngine.player) return false;
        
        const check = this.canEvolve('player', null, tier);
        if (!check.can) {
            console.log('Cannot evolve:', check.reason, check.missing);
            return false;
        }
        
        const evolutionData = this.getEvolutionData('player', null, tier);
        if (!evolutionData) return false;
        
        const player = this.gameEngine.player;
        
        // Apply bonuses
        if (evolutionData.bonuses) {
            for (const [stat, multiplier] of Object.entries(evolutionData.bonuses)) {
                this.applyStatBonus(player, stat, multiplier);
            }
        }
        
        // Unlock abilities
        if (evolutionData.newAbilities) {
            for (const ability of evolutionData.newAbilities) {
                this.unlockAbility(ability);
            }
        }
        
        // Change appearance
        if (evolutionData.appearance) {
            this.changeAppearance(player, evolutionData.appearance);
        }
        
        // Record evolution
        this.playerEvolutions.push({
            tier: tier,
            name: evolutionData.name,
            timestamp: Date.now()
        });
        
        console.log(`Player evolved to ${evolutionData.name}!`);
        return true;
    }
    
    /**
     * Evolve pet
     */
    evolvePet(petId, tier) {
        const check = this.canEvolve('pets', petId, tier);
        if (!check.can) {
            console.log('Cannot evolve:', check.reason, check.missing);
            return false;
        }
        
        const evolutionData = this.getEvolutionData('pets', petId, tier);
        if (!evolutionData) return false;
        
        // Get pet from pet system
        const pet = this.gameEngine.petSystem?.getPet(petId);
        if (!pet || !pet.stats) {
            console.log('Invalid pet or missing stats');
            return false;
        }
        
        // Apply evolution
        pet.name = evolutionData.name;
        pet.stats = { ...evolutionData.stats };
        pet.abilities = [...evolutionData.abilities];
        pet.tier = tier;
        
        console.log(`Pet evolved to ${evolutionData.name}!`);
        return true;
    }
    
    /**
     * Evolve weapon
     */
    evolveWeapon(weaponId, tier) {
        const check = this.canEvolve('weapons', weaponId, tier);
        if (!check.can) {
            console.log('Cannot evolve:', check.reason, check.missing);
            return false;
        }
        
        const evolutionData = this.getEvolutionData('weapons', weaponId, tier);
        if (!evolutionData) return false;
        
        // Get weapon from inventory
        const weapon = this.gameEngine.inventorySystem?.getItem(weaponId);
        if (!weapon || typeof weapon.damage === 'undefined') {
            console.log('Invalid weapon or missing damage property');
            return false;
        }
        
        // Consume materials if required
        if (evolutionData.requirements?.material) {
            this.consumeMaterial(evolutionData.requirements.material);
        }
        
        // Apply evolution
        weapon.name = evolutionData.name;
        weapon.damage = evolutionData.damage;
        weapon.rarity = evolutionData.rarity;
        weapon.effects = [...evolutionData.effects];
        weapon.tier = tier;
        
        console.log(`Weapon evolved to ${evolutionData.name}!`);
        return true;
    }
    
    /**
     * Apply stat bonus to player
     */
    applyStatBonus(player, stat, multiplier) {
        switch (stat) {
            case 'attack':
                player.baseDamage *= multiplier;
                break;
            case 'critDamage':
                player.critMultiplier = (player.critMultiplier || 2.0) * multiplier;
                break;
            case 'hp':
                player.maxHP *= multiplier;
                player.hp = player.maxHP;
                break;
            case 'defense':
                player.defense *= multiplier;
                break;
            case 'magicPower':
                player.magicPower = (player.magicPower || 1.0) * multiplier;
                break;
            case 'manaCost':
                player.manaCostMultiplier = multiplier;
                break;
            case 'cooldown':
                player.cooldownMultiplier = multiplier;
                break;
            case 'critChance':
                player.critChance = (player.critChance || 0.1) * multiplier;
                break;
            case 'speed':
                player.moveSpeed *= multiplier;
                break;
            case 'dodge':
                player.dodgeChance = (player.dodgeChance || 0) * multiplier;
                break;
        }
    }
    
    /**
     * Unlock new ability
     */
    unlockAbility(abilityId) {
        if (this.gameEngine.player) {
            if (!this.gameEngine.player.unlockedAbilities) {
                this.gameEngine.player.unlockedAbilities = [];
            }
            this.gameEngine.player.unlockedAbilities.push(abilityId);
        }
    }
    
    /**
     * Change player appearance
     */
    changeAppearance(player, appearanceId) {
        if (player.mesh && player.mesh.material) {
            // Apply skin/appearance changes
            console.log(`Appearance changed to ${appearanceId}`);
        }
    }
    
    /**
     * Check if player has legendary status
     */
    hasLegendaryStatus() {
        return this.gameEngine.player?.legendary || false;
    }
    
    /**
     * Check if player has required material
     */
    hasMaterial(materialId) {
        if (this.gameEngine.inventorySystem) {
            return this.gameEngine.inventorySystem.hasItem(materialId);
        }
        return false;
    }
    
    /**
     * Consume material for evolution
     */
    consumeMaterial(materialId) {
        if (this.gameEngine.inventorySystem) {
            this.gameEngine.inventorySystem.removeItem(materialId);
        }
    }
    
    /**
     * Initialize pet evolution tracking
     */
    initializePetTracking(petId) {
        if (!this.petEvolutions.has(petId)) {
            this.petEvolutions.set(petId, {
                battles: 0,
                wins: 0,
                kills: 0,
                legendary: false
            });
        }
    }
    
    /**
     * Initialize weapon evolution tracking
     */
    initializeWeaponTracking(weaponId) {
        if (!this.weaponEvolutions.has(weaponId)) {
            this.weaponEvolutions.set(weaponId, {
                kills: 0,
                bossKills: 0,
                spellsCast: 0,
                legendary: false
            });
        }
    }
    
    /**
     * Record pet battle
     */
    recordPetBattle(petId, won) {
        const data = this.petEvolutions.get(petId);
        if (data) {
            data.battles++;
            if (won) data.wins++;
        }
    }
    
    /**
     * Record weapon kill
     */
    recordWeaponKill(weaponId, isBoss = false) {
        const data = this.weaponEvolutions.get(weaponId);
        if (data) {
            data.kills++;
            if (isBoss) data.bossKills++;
        }
    }
}
