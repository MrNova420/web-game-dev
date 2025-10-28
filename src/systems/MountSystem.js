/**
 * MountSystem.js
 * Handles rideable mounts for faster travel, mount abilities, and customization
 * Part of Phase 5: Pet/Companion Combat
 */

export class MountSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // Mount collection
        this.ownedMounts = new Map();
        this.activeMount = null;
        this.isMounted = false;
        
        // Mount database
        this.mountTypes = new Map();
        
        // Breeding system
        this.breedingPairs = [];
        this.eggs = [];
        
        this.initializeMountTypes();
    }
    
    /**
     * Initialize mount types
     */
    initializeMountTypes() {
        // Common mounts
        this.addMountType({
            id: 'smoke_horse',
            name: 'Smoke Horse',
            rarity: 'common',
            type: 'terrestrial',
            description: 'A spectral horse made of smoke',
            baseStats: {
                speed: 15,
                stamina: 100,
                jump: 2
            },
            abilities: [
                {
                    id: 'smoke_dash',
                    name: 'Smoke Dash',
                    description: 'Burst of speed leaving smoke trail',
                    cooldown: 10000,
                    effect: {
                        speedBoost: 2.0,
                        duration: 3000
                    }
                }
            ],
            unlockRequirement: { level: 5 }
        });
        
        this.addMountType({
            id: 'crystal_stag',
            name: 'Crystal Stag',
            rarity: 'uncommon',
            type: 'terrestrial',
            description: 'A majestic stag with crystalline antlers',
            baseStats: {
                speed: 18,
                stamina: 120,
                jump: 3
            },
            abilities: [
                {
                    id: 'crystal_leap',
                    name: 'Crystal Leap',
                    description: 'High jump with crystal shockwave on landing',
                    cooldown: 15000,
                    effect: {
                        jumpBoost: 3,
                        landingDamage: 100,
                        landingRadius: 5
                    }
                }
            ],
            unlockRequirement: { level: 10 }
        });
        
        // Rare mounts
        this.addMountType({
            id: 'shadow_wolf',
            name: 'Shadow Wolf',
            rarity: 'rare',
            type: 'terrestrial',
            description: 'A wolf that runs through shadows',
            baseStats: {
                speed: 22,
                stamina: 150,
                jump: 2.5
            },
            abilities: [
                {
                    id: 'shadow_run',
                    name: 'Shadow Run',
                    description: 'Phase through enemies and obstacles',
                    cooldown: 20000,
                    effect: {
                        phaseMode: true,
                        duration: 5000,
                        speedBoost: 1.5
                    }
                },
                {
                    id: 'pack_call',
                    name: 'Pack Call',
                    description: 'Summon shadow wolves to fight',
                    cooldown: 60000,
                    effect: {
                        summonCount: 3,
                        duration: 30000
                    }
                }
            ],
            unlockRequirement: { level: 20 }
        });
        
        this.addMountType({
            id: 'flame_raptor',
            name: 'Flame Raptor',
            rarity: 'rare',
            type: 'terrestrial',
            description: 'A fierce raptor wreathed in flames',
            baseStats: {
                speed: 25,
                stamina: 130,
                jump: 4
            },
            abilities: [
                {
                    id: 'flame_charge',
                    name: 'Flame Charge',
                    description: 'Charge forward dealing fire damage',
                    cooldown: 12000,
                    effect: {
                        chargeDamage: 150,
                        burnDuration: 5000,
                        chargeDistance: 20
                    }
                }
            ],
            unlockRequirement: { achievement: 'fire_master' }
        });
        
        // Flying mounts
        this.addMountType({
            id: 'sky_manta',
            name: 'Sky Manta',
            rarity: 'epic',
            type: 'flying',
            description: 'A graceful manta ray that glides through air',
            baseStats: {
                speed: 20,
                stamina: 200,
                jump: 10,
                canFly: true
            },
            abilities: [
                {
                    id: 'aerial_dive',
                    name: 'Aerial Dive',
                    description: 'Dive bomb enemies from above',
                    cooldown: 15000,
                    effect: {
                        diveDamage: 200,
                        stunDuration: 2000,
                        diveSpeed: 40
                    }
                },
                {
                    id: 'wind_current',
                    name: 'Wind Current',
                    description: 'Create updraft for sustained flight',
                    cooldown: 30000,
                    effect: {
                        flightDuration: 20000,
                        noStamina: true
                    }
                }
            ],
            unlockRequirement: { floor: 30 }
        });
        
        this.addMountType({
            id: 'void_drake',
            name: 'Void Drake',
            rarity: 'epic',
            type: 'flying',
            description: 'A dragon-like creature from the void',
            baseStats: {
                speed: 28,
                stamina: 250,
                jump: 12,
                canFly: true
            },
            abilities: [
                {
                    id: 'void_breath',
                    name: 'Void Breath',
                    description: 'Breathe void energy at enemies',
                    cooldown: 20000,
                    effect: {
                        breathDamage: 300,
                        coneRange: 15,
                        voidEffect: true
                    }
                },
                {
                    id: 'dimension_shift',
                    name: 'Dimension Shift',
                    description: 'Teleport to any visible location',
                    cooldown: 40000,
                    effect: {
                        teleport: true,
                        maxRange: 50
                    }
                }
            ],
            unlockRequirement: { floor: 50, achievement: 'void_walker' }
        });
        
        // Legendary mounts
        this.addMountType({
            id: 'celestial_phoenix',
            name: 'Celestial Phoenix',
            rarity: 'legendary',
            type: 'flying',
            description: 'The immortal phoenix of legend',
            baseStats: {
                speed: 35,
                stamina: 999,
                jump: 20,
                canFly: true,
                infiniteStamina: true
            },
            abilities: [
                {
                    id: 'rebirth',
                    name: 'Rebirth',
                    description: 'Resurrect at phoenix with full stats',
                    cooldown: 300000, // 5 minutes
                    effect: {
                        autoRevive: true,
                        fullHealth: true
                    }
                },
                {
                    id: 'solar_flare',
                    name: 'Solar Flare',
                    description: 'Massive AOE fire damage',
                    cooldown: 60000,
                    effect: {
                        damage: 1000,
                        radius: 30,
                        burn: 10000
                    }
                },
                {
                    id: 'divine_flight',
                    name: 'Divine Flight',
                    description: 'Unlimited flight with healing aura',
                    cooldown: 0,
                    effect: {
                        flight: true,
                        healOverTime: 10,
                        auraRadius: 15
                    }
                }
            ],
            unlockRequirement: { achievement: 'legendary_collector', floor: 100 }
        });
        
        this.addMountType({
            id: 'nightmare_steed',
            name: 'Nightmare Steed',
            rarity: 'legendary',
            type: 'terrestrial',
            description: 'A terrifying horse from nightmares',
            baseStats: {
                speed: 40,
                stamina: 500,
                jump: 5,
                combatMount: true
            },
            abilities: [
                {
                    id: 'terror_charge',
                    name: 'Terror Charge',
                    description: 'Charge that fears all enemies',
                    cooldown: 30000,
                    effect: {
                        damage: 500,
                        fearDuration: 8000,
                        chargeSpeed: 50
                    }
                },
                {
                    id: 'nightmare_realm',
                    name: 'Nightmare Realm',
                    description: 'Create realm where you are invincible',
                    cooldown: 120000,
                    effect: {
                        invincible: true,
                        duration: 15000,
                        damageBoost: 2.0
                    }
                }
            ],
            unlockRequirement: { achievement: 'nightmare_complete' }
        });
        
        // Aquatic mount
        this.addMountType({
            id: 'tidal_serpent',
            name: 'Tidal Serpent',
            rarity: 'rare',
            type: 'aquatic',
            description: 'A serpentine creature of the depths',
            baseStats: {
                speed: 30,
                stamina: 180,
                jump: 1,
                waterSpeed: 40
            },
            abilities: [
                {
                    id: 'tidal_wave',
                    name: 'Tidal Wave',
                    description: 'Summon wave that knocks back enemies',
                    cooldown: 25000,
                    effect: {
                        damage: 200,
                        knockback: 10,
                        waveWidth: 20
                    }
                }
            ],
            unlockRequirement: { floor: 25 }
        });
    }
    
    /**
     * Add mount type to database
     */
    addMountType(mountType) {
        this.mountTypes.set(mountType.id, mountType);
    }
    
    /**
     * Obtain new mount
     */
    obtainMount(mountId) {
        const mountType = this.mountTypes.get(mountId);
        if (!mountType) {
            return { success: false, reason: 'Mount type not found' };
        }
        
        // Check unlock requirements
        if (mountType.unlockRequirement) {
            const req = mountType.unlockRequirement;
            
            if (req.level && this.gameEngine.player.level < req.level) {
                return { success: false, reason: `Requires level ${req.level}` };
            }
            
            if (req.floor) {
                const currentFloor = this.gameEngine.endlessMode?.currentFloor || 1;
                if (currentFloor < req.floor) {
                    return { success: false, reason: `Requires floor ${req.floor}` };
                }
            }
        }
        
        // Create mount instance
        const mount = this.createMountInstance(mountType);
        this.ownedMounts.set(mount.instanceId, mount);
        
        console.log(`🐴 Obtained new mount: ${mount.name}!`);
        
        return { success: true, mount };
    }
    
    /**
     * Create mount instance
     */
    createMountInstance(mountType) {
        return {
            instanceId: `mount_${Date.now()}_${Math.random()}`,
            typeId: mountType.id,
            name: mountType.name,
            rarity: mountType.rarity,
            type: mountType.type,
            description: mountType.description,
            level: 1,
            exp: 0,
            stats: { ...mountType.baseStats },
            baseStats: { ...mountType.baseStats },
            abilities: [...mountType.abilities],
            customization: {
                color: null,
                armor: null,
                saddle: null,
                accessories: []
            },
            obtainedAt: Date.now()
        };
    }
    
    /**
     * Mount the mount
     */
    mount(mountInstanceId) {
        if (this.isMounted) {
            return { success: false, reason: 'Already mounted' };
        }
        
        const mount = this.ownedMounts.get(mountInstanceId);
        if (!mount) {
            return { success: false, reason: 'Mount not found' };
        }
        
        this.activeMount = mount;
        this.isMounted = true;
        
        // Apply mount speed bonus to player
        if (this.gameEngine.player) {
            this.gameEngine.player.stats.speed *= mount.stats.speed / 10;
        }
        
        console.log(`🐴 Mounted ${mount.name}!`);
        
        return { success: true, mount };
    }
    
    /**
     * Dismount
     */
    dismount() {
        if (!this.isMounted) {
            return { success: false, reason: 'Not mounted' };
        }
        
        // Restore player speed
        if (this.gameEngine.player && this.activeMount) {
            this.gameEngine.player.stats.speed /= (this.activeMount.stats.speed / 10);
        }
        
        console.log(`🐴 Dismounted ${this.activeMount.name}`);
        
        this.isMounted = false;
        this.activeMount = null;
        
        return { success: true };
    }
    
    /**
     * Use mount ability
     */
    useMountAbility(abilityId) {
        if (!this.isMounted || !this.activeMount) {
            return { success: false, reason: 'Not mounted' };
        }
        
        const ability = this.activeMount.abilities.find(a => a.id === abilityId);
        if (!ability) {
            return { success: false, reason: 'Ability not found' };
        }
        
        // Check cooldown (simplified)
        console.log(`⚡ Used mount ability: ${ability.name}!`);
        
        return {
            success: true,
            ability,
            effect: ability.effect
        };
    }
    
    /**
     * Customize mount appearance
     */
    customizeMount(mountInstanceId, customization) {
        const mount = this.ownedMounts.get(mountInstanceId);
        if (!mount) {
            return { success: false, reason: 'Mount not found' };
        }
        
        // Apply customization
        if (customization.color) {
            mount.customization.color = customization.color;
        }
        
        if (customization.armor) {
            mount.customization.armor = customization.armor;
        }
        
        if (customization.saddle) {
            mount.customization.saddle = customization.saddle;
        }
        
        if (customization.accessories) {
            mount.customization.accessories = customization.accessories;
        }
        
        return { success: true, mount };
    }
    
    /**
     * Start breeding process
     */
    breedMounts(mount1Id, mount2Id) {
        const mount1 = this.ownedMounts.get(mount1Id);
        const mount2 = this.ownedMounts.get(mount2Id);
        
        if (!mount1 || !mount2) {
            return { success: false, reason: 'One or both mounts not found' };
        }
        
        if (mount1.typeId === mount2.typeId) {
            return { success: false, reason: 'Cannot breed same type' };
        }
        
        // Create breeding pair
        const pair = {
            id: `breeding_${Date.now()}`,
            mount1: mount1Id,
            mount2: mount2Id,
            startTime: Date.now(),
            duration: 3600000, // 1 hour
            completed: false
        };
        
        this.breedingPairs.push(pair);
        
        console.log(`💕 Started breeding ${mount1.name} and ${mount2.name}!`);
        
        return { success: true, pair };
    }
    
    /**
     * Check breeding progress
     */
    checkBreeding() {
        const now = Date.now();
        
        for (const pair of this.breedingPairs) {
            if (!pair.completed && now - pair.startTime >= pair.duration) {
                pair.completed = true;
                
                // Create egg
                const egg = this.createEgg(pair);
                this.eggs.push(egg);
                
                console.log(`🥚 Breeding complete! Received a mount egg!`);
            }
        }
    }
    
    /**
     * Create egg from breeding
     */
    createEgg(pair) {
        const mount1 = this.ownedMounts.get(pair.mount1);
        const mount2 = this.ownedMounts.get(pair.mount2);
        
        // Determine egg rarity based on parents
        const rarityOrder = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
        const rarity1Index = rarityOrder.indexOf(mount1.rarity);
        const rarity2Index = rarityOrder.indexOf(mount2.rarity);
        const avgRarity = Math.floor((rarity1Index + rarity2Index) / 2);
        
        return {
            id: `egg_${Date.now()}`,
            parent1: pair.mount1,
            parent2: pair.mount2,
            rarity: rarityOrder[Math.min(avgRarity, rarityOrder.length - 1)],
            hatchTime: 1800000, // 30 minutes
            createdAt: Date.now()
        };
    }
    
    /**
     * Hatch egg
     */
    hatchEgg(eggId) {
        const egg = this.eggs.find(e => e.id === eggId);
        if (!egg) {
            return { success: false, reason: 'Egg not found' };
        }
        
        const elapsed = Date.now() - egg.createdAt;
        if (elapsed < egg.hatchTime) {
            const remaining = Math.ceil((egg.hatchTime - elapsed) / 1000 / 60);
            return { success: false, reason: `Egg needs ${remaining} more minutes to hatch` };
        }
        
        // Create hybrid mount
        const mount = this.createHybridMount(egg);
        this.ownedMounts.set(mount.instanceId, mount);
        
        // Remove egg
        const index = this.eggs.indexOf(egg);
        if (index > -1) {
            this.eggs.splice(index, 1);
        }
        
        console.log(`🐣 Egg hatched into ${mount.name}!`);
        
        return { success: true, mount };
    }
    
    /**
     * Create hybrid mount from egg
     */
    createHybridMount(egg) {
        const parent1 = this.ownedMounts.get(egg.parent1);
        const parent2 = this.ownedMounts.get(egg.parent2);
        
        // Create hybrid stats
        const hybridStats = {};
        for (const stat in parent1.baseStats) {
            hybridStats[stat] = Math.floor(
                (parent1.baseStats[stat] + parent2.baseStats[stat]) / 2 * 1.1
            );
        }
        
        // Combine abilities
        const abilities = [
            ...parent1.abilities.slice(0, 2),
            ...parent2.abilities.slice(0, 1)
        ];
        
        return {
            instanceId: `mount_${Date.now()}_${Math.random()}`,
            typeId: 'hybrid',
            name: `Hybrid ${parent1.name}-${parent2.name}`,
            rarity: egg.rarity,
            type: parent1.type,
            description: 'A unique hybrid mount',
            level: 1,
            exp: 0,
            stats: hybridStats,
            baseStats: hybridStats,
            abilities: abilities,
            hybrid: true,
            parents: [egg.parent1, egg.parent2],
            customization: {
                color: null,
                armor: null,
                saddle: null,
                accessories: []
            },
            obtainedAt: Date.now()
        };
    }
    
    /**
     * Get all owned mounts
     */
    getAllMounts() {
        return Array.from(this.ownedMounts.values());
    }
    
    /**
     * Save system state
     */
    save() {
        return {
            ownedMounts: Array.from(this.ownedMounts.entries()),
            activeMount: this.activeMount?.instanceId,
            isMounted: this.isMounted,
            breedingPairs: this.breedingPairs,
            eggs: this.eggs
        };
    }
    
    /**
     * Load system state
     */
    load(data) {
        if (!data) return;
        
        if (data.ownedMounts) {
            this.ownedMounts = new Map(data.ownedMounts);
        }
        
        if (data.activeMount) {
            this.activeMount = this.ownedMounts.get(data.activeMount);
        }
        
        if (data.isMounted !== undefined) {
            this.isMounted = data.isMounted;
        }
        
        if (data.breedingPairs) {
            this.breedingPairs = data.breedingPairs;
        }
        
        if (data.eggs) {
            this.eggs = data.eggs;
        }
    }
    
    /**
     * Update system (called each frame)
     */
    update(deltaTime) {
        // Check breeding progress
        this.checkBreeding();
        
        // Regenerate mount stamina when not mounted
        if (!this.isMounted && this.activeMount) {
            this.activeMount.stats.stamina = Math.min(
                this.activeMount.baseStats.stamina,
                this.activeMount.stats.stamina + deltaTime * 10
            );
        }
    }
}
