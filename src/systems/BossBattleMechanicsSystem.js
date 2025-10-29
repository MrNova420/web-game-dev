/**
 * Boss Battle Mechanics System
 * Implements multi-phase boss battles with special mechanics, enrage timers, and unique abilities
 * Designed for epic encounters with 8 unique bosses from the roadmap
 */

export class BossBattleMechanicsSystem {
    constructor(combatSystem, particleSystem, audio, ui) {
        this.combatSystem = combatSystem;
        this.particleSystem = particleSystem;
        this.audio = audio;
        this.ui = ui;
        
        this.activeBoss = null;
        this.bossDefinitions = new Map();
        this.mechanics = new Map();
        
        this.initializeBosses();
    }
    
    initializeBosses() {
        // 8 Bosses from roadmap
        
        // 1. The Blaze Reaper - Fire boss
        this.bossDefinitions.set('blaze_reaper', {
            id: 'blaze_reaper',
            name: 'The Blaze Reaper',
            element: 'fire',
            maxHealth: 50000,
            phases: [
                {
                    threshold: 1.0,
                    name: 'Inferno Phase',
                    abilities: ['flame_wave', 'fire_breath', 'meteor_shower'],
                    mechanics: ['flame_pools'],
                    enrageTime: 600 // 10 minutes
                },
                {
                    threshold: 0.7,
                    name: 'Blazing Fury',
                    abilities: ['flame_wave', 'fire_breath', 'meteor_shower', 'infernal_chains'],
                    mechanics: ['flame_pools', 'adds_fire_elementals'],
                    attackSpeedMultiplier: 1.2
                },
                {
                    threshold: 0.3,
                    name: 'Apocalyptic Flame',
                    abilities: ['flame_wave', 'fire_breath', 'meteor_shower', 'infernal_chains', 'supernova'],
                    mechanics: ['flame_pools', 'adds_fire_elementals', 'burning_ground'],
                    attackSpeedMultiplier: 1.5,
                    damageMultiplier: 1.3
                }
            ]
        });
        
        // 2. Frostbite Colossus - Ice boss
        this.bossDefinitions.set('frostbite_colossus', {
            id: 'frostbite_colossus',
            name: 'Frostbite Colossus',
            element: 'ice',
            maxHealth: 60000,
            phases: [
                {
                    threshold: 1.0,
                    name: 'Frozen Domain',
                    abilities: ['ice_shard_barrage', 'frost_nova', 'blizzard'],
                    mechanics: ['frozen_ground']
                },
                {
                    threshold: 0.6,
                    name: 'Eternal Winter',
                    abilities: ['ice_shard_barrage', 'frost_nova', 'blizzard', 'ice_prison'],
                    mechanics: ['frozen_ground', 'ice_walls'],
                    attackSpeedMultiplier: 1.3
                },
                {
                    threshold: 0.2,
                    name: 'Absolute Zero',
                    abilities: ['ice_shard_barrage', 'frost_nova', 'blizzard', 'ice_prison', 'glacial_spike'],
                    mechanics: ['frozen_ground', 'ice_walls', 'freeze_aura'],
                    attackSpeedMultiplier: 1.4,
                    damageMultiplier: 1.5
                }
            ]
        });
        
        // 3. Storm Caller - Lightning boss
        this.bossDefinitions.set('storm_caller', {
            id: 'storm_caller',
            name: 'Storm Caller',
            element: 'lightning',
            maxHealth: 45000,
            phases: [
                {
                    threshold: 1.0,
                    name: 'Thunder Phase',
                    abilities: ['chain_lightning', 'thunder_strike', 'static_field'],
                    mechanics: ['lightning_orbs']
                },
                {
                    threshold: 0.5,
                    name: 'Tempest Rage',
                    abilities: ['chain_lightning', 'thunder_strike', 'static_field', 'lightning_storm'],
                    mechanics: ['lightning_orbs', 'adds_storm_elementals'],
                    attackSpeedMultiplier: 1.5,
                    movementSpeed: 1.3
                }
            ]
        });
        
        // 4. Voidheart - Dark/Void boss
        this.bossDefinitions.set('voidheart', {
            id: 'voidheart',
            name: 'Voidheart',
            element: 'dark',
            maxHealth: 55000,
            phases: [
                {
                    threshold: 1.0,
                    name: 'Void Emergence',
                    abilities: ['void_bolt', 'dark_pulse', 'shadow_step'],
                    mechanics: ['void_zones']
                },
                {
                    threshold: 0.65,
                    name: 'Abyssal Power',
                    abilities: ['void_bolt', 'dark_pulse', 'shadow_step', 'void_rift'],
                    mechanics: ['void_zones', 'shadow_clones'],
                    attackSpeedMultiplier: 1.2
                },
                {
                    threshold: 0.25,
                    name: 'Cosmic Horror',
                    abilities: ['void_bolt', 'dark_pulse', 'shadow_step', 'void_rift', 'reality_tear'],
                    mechanics: ['void_zones', 'shadow_clones', 'madness_aura'],
                    attackSpeedMultiplier: 1.4,
                    damageMultiplier: 1.4
                }
            ]
        });
        
        // 5. Earthshaker - Earth boss
        this.bossDefinitions.set('earthshaker', {
            id: 'earthshaker',
            name: 'Earthshaker',
            element: 'earth',
            maxHealth: 70000,
            phases: [
                {
                    threshold: 1.0,
                    name: 'Stone Warden',
                    abilities: ['rock_throw', 'ground_slam', 'tremor'],
                    mechanics: ['falling_rocks']
                },
                {
                    threshold: 0.5,
                    name: 'Mountain Rage',
                    abilities: ['rock_throw', 'ground_slam', 'tremor', 'earthquake'],
                    mechanics: ['falling_rocks', 'adds_stone_golems'],
                    attackSpeedMultiplier: 1.1,
                    defense: 1.5
                }
            ]
        });
        
        // 6. Toxic Emperor - Poison boss
        this.bossDefinitions.set('toxic_emperor', {
            id: 'toxic_emperor',
            name: 'Toxic Emperor',
            element: 'poison',
            maxHealth: 48000,
            phases: [
                {
                    threshold: 1.0,
                    name: 'Plague Bearer',
                    abilities: ['poison_spit', 'toxic_cloud', 'plague_rats'],
                    mechanics: ['poison_pools']
                },
                {
                    threshold: 0.6,
                    name: 'Pestilence',
                    abilities: ['poison_spit', 'toxic_cloud', 'plague_rats', 'viral_outbreak'],
                    mechanics: ['poison_pools', 'disease_aura'],
                    attackSpeedMultiplier: 1.3
                },
                {
                    threshold: 0.3,
                    name: 'Apocalyptic Rot',
                    abilities: ['poison_spit', 'toxic_cloud', 'plague_rats', 'viral_outbreak', 'necrotic_explosion'],
                    mechanics: ['poison_pools', 'disease_aura', 'adds_plague_zombies'],
                    attackSpeedMultiplier: 1.4,
                    damageMultiplier: 1.3
                }
            ]
        });
        
        // 7. Radiant Paladin - Light boss (corrupted holy warrior)
        this.bossDefinitions.set('radiant_paladin', {
            id: 'radiant_paladin',
            name: 'The Fallen Paladin',
            element: 'light',
            maxHealth: 52000,
            phases: [
                {
                    threshold: 1.0,
                    name: 'Holy Warrior',
                    abilities: ['smite', 'holy_shield', 'judgement'],
                    mechanics: ['healing_phase']
                },
                {
                    threshold: 0.4,
                    name: 'Corrupted Light',
                    abilities: ['smite', 'holy_shield', 'judgement', 'blinding_flash', 'resurrection'],
                    mechanics: ['healing_phase', 'summon_angels'],
                    attackSpeedMultiplier: 1.3,
                    defense: 1.4
                }
            ]
        });
        
        // 8. Ancient Dragon - Ultimate boss
        this.bossDefinitions.set('ancient_dragon', {
            id: 'ancient_dragon',
            name: 'Ancient Dragon',
            element: 'fire', // Can use multiple elements
            maxHealth: 100000,
            phases: [
                {
                    threshold: 1.0,
                    name: 'Dragon\'s Wrath',
                    abilities: ['fire_breath', 'tail_swipe', 'wing_buffet', 'bite'],
                    mechanics: ['flying_phase']
                },
                {
                    threshold: 0.75,
                    name: 'Elemental Mastery',
                    abilities: ['fire_breath', 'tail_swipe', 'wing_buffet', 'bite', 'frost_breath', 'lightning_breath'],
                    mechanics: ['flying_phase', 'elemental_shift'],
                    attackSpeedMultiplier: 1.2
                },
                {
                    threshold: 0.5,
                    name: 'Ancient Power',
                    abilities: ['fire_breath', 'tail_swipe', 'wing_buffet', 'bite', 'frost_breath', 'lightning_breath', 'roar'],
                    mechanics: ['flying_phase', 'elemental_shift', 'adds_dragonlings'],
                    attackSpeedMultiplier: 1.3,
                    damageMultiplier: 1.2
                },
                {
                    threshold: 0.2,
                    name: 'Cataclysm',
                    abilities: ['fire_breath', 'tail_swipe', 'wing_buffet', 'bite', 'frost_breath', 'lightning_breath', 'roar', 'meteor_storm'],
                    mechanics: ['flying_phase', 'elemental_shift', 'adds_dragonlings', 'enrage'],
                    attackSpeedMultiplier: 1.5,
                    damageMultiplier: 1.5,
                    movementSpeed: 1.3
                }
            ]
        });
    }
    
    startBossFight(bossId, playerLevel = 50) {
        const bossDef = this.bossDefinitions.get(bossId);
        if (!bossDef) {
            console.error(`Boss ${bossId} not found`);
            return null;
        }
        
        // Scale boss stats based on player level
        const scaleFactor = playerLevel / 50;
        
        this.activeBoss = {
            definition: bossDef,
            id: bossId,
            health: bossDef.maxHealth * scaleFactor,
            maxHealth: bossDef.maxHealth * scaleFactor,
            currentPhase: 0,
            phaseData: bossDef.phases[0],
            
            // Combat state
            position: {x: 0, y: 0, z: 0},
            isInvulnerable: false,
            mechanics: new Map(),
            
            // Timers
            startTime: Date.now(),
            lastAbilityTime: 0,
            enrageTimer: bossDef.phases[0].enrageTime || 0,
            phaseTransitionTime: 0,
            
            // Abilities
            abilityQueue: [],
            currentAbility: null,
            
            // Stats multipliers from current phase
            attackSpeedMultiplier: 1.0,
            damageMultiplier: 1.0,
            defenseMultiplier: 1.0,
            movementSpeed: 1.0
        };
        
        // Show boss health bar in UI
        if (this.ui) {
            this.ui.showBossHealthBar(bossDef.name, this.activeBoss.health, this.activeBoss.maxHealth);
        }
        
        // Start boss music
        if (this.audio) {
            this.audio.playMusic(`boss_${bossId}`, true, true);
        }
        
        // Initialize first phase mechanics
        this.initializePhase(0);
        
        return this.activeBoss;
    }
    
    update(deltaTime) {
        if (!this.activeBoss) return;
        
        const boss = this.activeBoss;
        const now = Date.now();
        
        // Check phase transitions
        const healthPercent = boss.health / boss.maxHealth;
        const nextPhaseIndex = boss.definition.phases.findIndex(phase => healthPercent <= phase.threshold);
        
        if (nextPhaseIndex > boss.currentPhase && nextPhaseIndex !== -1) {
            this.transitionPhase(nextPhaseIndex);
        }
        
        // Enrage timer
        if (boss.enrageTimer > 0) {
            const elapsed = (now - boss.startTime) / 1000;
            if (elapsed > boss.enrageTimer) {
                this.enrage();
            }
        }
        
        // Execute abilities
        if (now - boss.lastAbilityTime > 3000 && !boss.currentAbility) {
            this.selectAndExecuteAbility();
        }
        
        // Update active mechanics
        this.updateMechanics(deltaTime);
        
        // Update UI
        if (this.ui) {
            this.ui.updateBossHealthBar(boss.health, boss.maxHealth);
        }
    }
    
    initializePhase(phaseIndex) {
        const boss = this.activeBoss;
        const phase = boss.definition.phases[phaseIndex];
        
        boss.currentPhase = phaseIndex;
        boss.phaseData = phase;
        boss.attackSpeedMultiplier = phase.attackSpeedMultiplier || 1.0;
        boss.damageMultiplier = phase.damageMultiplier || 1.0;
        boss.defenseMultiplier = phase.defense || 1.0;
        boss.movementSpeed = phase.movementSpeed || 1.0;
        
        // Initialize phase mechanics
        phase.mechanics.forEach(mechanic => {
            this.activateMechanic(mechanic);
        });
        
        // Visual effects for phase
        if (this.particleSystem) {
            this.particleSystem.createEffect('phase_transition', boss.position, {
                type: boss.definition.element,
                count: 200,
                lifetime: 2.0
            });
        }
        
        // Play phase transition sound
        if (this.audio) {
            this.audio.playSFX('boss_phase_transition', 1.0);
        }
        
        // Show phase name
        if (this.ui) {
            this.ui.showNotification(`${boss.definition.name} enters ${phase.name}!`, 'boss', 3000);
        }
    }
    
    transitionPhase(phaseIndex) {
        const boss = this.activeBoss;
        
        // Make boss invulnerable during transition
        boss.isInvulnerable = true;
        boss.phaseTransitionTime = Date.now();
        
        setTimeout(() => {
            this.initializePhase(phaseIndex);
            boss.isInvulnerable = false;
        }, 2000); // 2 second transition
    }
    
    selectAndExecuteAbility() {
        const boss = this.activeBoss;
        const abilities = boss.phaseData.abilities;
        
        // Select random ability
        const ability = abilities[Math.floor(Math.random() * abilities.length)];
        
        this.executeAbility(ability);
        boss.lastAbilityTime = Date.now();
    }
    
    executeAbility(abilityId) {
        const boss = this.activeBoss;
        
        // Execute ability based on ID
        switch (abilityId) {
            case 'flame_wave':
                this.abilityFlameWave();
                break;
            case 'fire_breath':
                this.abilityFireBreath();
                break;
            case 'meteor_shower':
                this.abilityMeteorShower();
                break;
            case 'ice_shard_barrage':
                this.abilityIceShardBarrage();
                break;
            case 'chain_lightning':
                this.abilityChainLightning();
                break;
            case 'void_bolt':
                this.abilityVoidBolt();
                break;
            // Add more abilities...
            default:
                console.warn(`Unknown ability: ${abilityId}`);
        }
    }
    
    // Sample abilities
    abilityFlameWave() {
        const boss = this.activeBoss;
        
        if (this.particleSystem) {
            this.particleSystem.createEffect('flame_wave', boss.position, {
                type: 'fire',
                count: 150,
                spread: 5.0
            });
        }
        
        // Deal damage to player if in range
        this.combatSystem.attack(boss.id, 'player', {
            attackType: 'magic',
            damage: 500 * boss.damageMultiplier,
            element: 'fire',
            aoe: true,
            aoeRadius: 10
        });
    }
    
    abilityFireBreath() {
        const boss = this.activeBoss;
        
        if (this.particleSystem) {
            this.particleSystem.createEffect('fire_breath', boss.position, {
                type: 'fire',
                count: 300,
                velocity: {x: 0, y: 0, z: 10}
            });
        }
        
        this.combatSystem.attack(boss.id, 'player', {
            attackType: 'magic',
            damage: 800 * boss.damageMultiplier,
            element: 'fire',
            cone: true,
            coneAngle: 60
        });
    }
    
    abilityMeteorShower() {
        const boss = this.activeBoss;
        
        // Spawn multiple meteors
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const randomPos = {
                    x: boss.position.x + (Math.random() - 0.5) * 20,
                    y: boss.position.y + 20,
                    z: boss.position.z + (Math.random() - 0.5) * 20
                };
                
                if (this.particleSystem) {
                    this.particleSystem.createEffect('meteor', randomPos, {
                        type: 'fire',
                        count: 50
                    });
                }
                
                this.combatSystem.attack(boss.id, 'player', {
                    attackType: 'magic',
                    damage: 300 * boss.damageMultiplier,
                    element: 'fire',
                    aoe: true,
                    aoeRadius: 3,
                    position: randomPos
                });
            }, i * 500);
        }
    }
    
    abilityIceShardBarrage() {
        const boss = this.activeBoss;
        
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                if (this.particleSystem) {
                    this.particleSystem.createEffect('ice_shard', boss.position, {
                        type: 'ice',
                        count: 30
                    });
                }
                
                this.combatSystem.attack(boss.id, 'player', {
                    attackType: 'ranged',
                    damage: 200 * boss.damageMultiplier,
                    element: 'ice',
                    projectile: true
                });
            }, i * 200);
        }
    }
    
    abilityChainLightning() {
        const boss = this.activeBoss;
        
        if (this.particleSystem) {
            this.particleSystem.createEffect('chain_lightning', boss.position, {
                type: 'lightning',
                count: 100
            });
        }
        
        this.combatSystem.attack(boss.id, 'player', {
            attackType: 'magic',
            damage: 600 * boss.damageMultiplier,
            element: 'lightning',
            chain: true,
            chainTargets: 3
        });
    }
    
    abilityVoidBolt() {
        const boss = this.activeBoss;
        
        if (this.particleSystem) {
            this.particleSystem.createEffect('void_bolt', boss.position, {
                type: 'dark',
                count: 50
            });
        }
        
        this.combatSystem.attack(boss.id, 'player', {
            attackType: 'magic',
            damage: 700 * boss.damageMultiplier,
            element: 'dark',
            projectile: true
        });
    }
    
    activateMechanic(mechanicId) {
        const boss = this.activeBoss;
        
        // Activate boss mechanic
        boss.mechanics.set(mechanicId, {
            id: mechanicId,
            active: true,
            startTime: Date.now()
        });
    }
    
    updateMechanics(deltaTime) {
        const boss = this.activeBoss;
        
        boss.mechanics.forEach((mechanic, id) => {
            switch (id) {
                case 'flame_pools':
                    // Spawn flame pools periodically
                    if (Date.now() - mechanic.startTime > mechanic.lastSpawn || 5000) {
                        // Spawn pool
                        mechanic.lastSpawn = Date.now();
                    }
                    break;
                case 'adds_fire_elementals':
                    // Spawn adds
                    break;
                // More mechanics...
            }
        });
    }
    
    enrage() {
        const boss = this.activeBoss;
        
        boss.attackSpeedMultiplier *= 2.0;
        boss.damageMultiplier *= 2.0;
        boss.movementSpeed *= 1.5;
        
        if (this.ui) {
            this.ui.showNotification(`${boss.definition.name} is ENRAGED!`, 'danger', 5000);
        }
        
        if (this.audio) {
            this.audio.playSFX('boss_enrage', 1.0);
        }
    }
    
    takeDamage(damage) {
        if (!this.activeBoss || this.activeBoss.isInvulnerable) return 0;
        
        const actualDamage = damage / this.activeBoss.defenseMultiplier;
        this.activeBoss.health = Math.max(0, this.activeBoss.health - actualDamage);
        
        if (this.activeBoss.health <= 0) {
            this.onBossDefeat();
        }
        
        return actualDamage;
    }
    
    onBossDefeat() {
        const boss = this.activeBoss;
        
        if (this.ui) {
            this.ui.hideBossHealthBar();
            this.ui.showNotification(`${boss.definition.name} defeated!`, 'victory', 5000);
        }
        
        if (this.audio) {
            this.audio.stopMusic();
            this.audio.playSFX('boss_defeat', 1.0);
        }
        
        // Calculate rewards
        const rewards = this.calculateRewards(boss);
        
        this.activeBoss = null;
        
        return rewards;
    }
    
    calculateRewards(boss) {
        const fightDuration = (Date.now() - boss.startTime) / 1000;
        const timeBonus = fightDuration < boss.enrageTimer ? 1.5 : 1.0;
        
        return {
            experience: Math.floor(boss.maxHealth / 10 * timeBonus),
            gold: Math.floor(boss.maxHealth / 5 * timeBonus),
            items: this.generateBossLoot(boss.id),
            achievements: []
        };
    }
    
    generateBossLoot(bossId) {
        // Generate boss-specific legendary loot
        return [
            {type: 'legendary_weapon', bossId: bossId},
            {type: 'boss_soul', bossId: bossId},
            {type: 'crafting_material', rarity: 'legendary', amount: 5}
        ];
    }
    
    getActiveBoss() {
        return this.activeBoss;
    }
}
