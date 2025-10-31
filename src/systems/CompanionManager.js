/**
 * CompanionManager - Manages companion characters (waifus)
 * Based on the Dynasty of Emberveil lore
 * 
 * External Assets Used:
 * - Character models: Mixamo (free anime-style characters)
 * - Animations: Mixamo (free animation library)
 * - Textures: Poly Haven (PBR character textures)
 * - Icons: game-icons.net (companion portraits)
 */

export class CompanionManager {
    constructor() {
        this.companions = this.initializeCompanions();
        this.activeCompanion = null;
    }
    
    initializeCompanions() {
        return {
            smoke_siren: {
                id: 'smoke_siren',
                name: 'Smoke Siren',
                type: 'charm',
                description: 'A charm-based sorceress who clouds enemies\' minds with enchanting smoke',
                // External 3D model from Mixamo
                model: '/assets/models/companions/smoke_siren.glb',
                animations: {
                    idle: '/assets/animations/female_idle.fbx',
                    attack: '/assets/animations/spellcast.fbx',
                    walk: '/assets/animations/female_walk.fbx'
                },
                portrait: '/assets/ui/portraits/smoke_siren.png', // game-icons.net
                stats: {
                    power: 85,
                    defense: 60,
                    speed: 75,
                    charisma: 95
                },
                ability: {
                    name: 'Mind Cloud',
                    description: 'Confuses enemies in an area, reducing their accuracy',
                    cooldown: 15,
                    manaCost: 40
                },
                isOnCooldown: false,
                unlocked: true
            },
            blade_muse: {
                id: 'blade_muse',
                name: 'Blade Muse',
                type: 'fighter',
                description: 'An acrobatic fighter powered by rhythm and motion',
                // External 3D model from Mixamo
                model: '/assets/models/companions/blade_muse.glb',
                animations: {
                    idle: '/assets/animations/sword_idle.fbx',
                    attack: '/assets/animations/sword_slash.fbx',
                    walk: '/assets/animations/female_walk_2.fbx'
                },
                portrait: '/assets/ui/portraits/blade_muse.png', // game-icons.net
                stats: {
                    power: 90,
                    defense: 70,
                    speed: 95,
                    charisma: 80
                },
                ability: {
                    name: 'Rhythm Strike',
                    description: 'A chain of rapid attacks that crescendo in power',
                    cooldown: 12,
                    manaCost: 35
                },
                isOnCooldown: false,
                unlocked: true
            },
            herb_witch: {
                id: 'herb_witch',
                name: 'Herb Witch',
                type: 'alchemist',
                description: 'An alchemist cultivating greenfire crystals and healing herbs',
                // External 3D model from Mixamo
                model: '/assets/models/companions/herb_witch.glb',
                animations: {
                    idle: '/assets/animations/witch_idle.fbx',
                    attack: '/assets/animations/herb_cast.fbx',
                    walk: '/assets/animations/female_walk_3.fbx'
                },
                portrait: '/assets/ui/portraits/herb_witch.png', // game-icons.net
                stats: {
                    power: 70,
                    defense: 65,
                    speed: 60,
                    charisma: 85
                },
                ability: {
                    name: 'Greenfire Burst',
                    description: 'Heals allies and damages enemies with mystical herbs',
                    cooldown: 18,
                    manaCost: 45
                },
                isOnCooldown: false,
                unlocked: false
            },
            cyber_dryad: {
                id: 'cyber_dryad',
                name: 'Cyber Dryad',
                type: 'techno-mage',
                description: 'A forest spirit laced with luminous tech veins, bridging nature and technology',
                // External 3D model from Mixamo
                model: '/assets/models/companions/cyber_dryad.glb',
                animations: {
                    idle: '/assets/animations/cyber_idle.fbx',
                    attack: '/assets/animations/tech_cast.fbx',
                    walk: '/assets/animations/female_walk_4.fbx'
                },
                portrait: '/assets/ui/portraits/cyber_dryad.png', // game-icons.net
                stats: {
                    power: 88,
                    defense: 75,
                    speed: 82,
                    charisma: 90
                },
                ability: {
                    name: 'Tech-Nature Fusion',
                    description: 'Summons digital vines that drain enemy energy',
                    cooldown: 20,
                    manaCost: 50
                },
                isOnCooldown: false,
                unlocked: false
            }
        };
    }
    
    setActiveCompanion(companionId) {
        if (this.companions[companionId] && this.companions[companionId].unlocked) {
            this.activeCompanion = companionId;
            logger.info(`💜 Active companion: ${this.companions[companionId].name}`);
            return true;
        }
        return false;
    }
    
    getActiveCompanion() {
        return this.activeCompanion ? this.companions[this.activeCompanion] : null;
    }
    
    unlockCompanion(companionId) {
        if (this.companions[companionId]) {
            this.companions[companionId].unlocked = true;
            logger.info(`✨ Unlocked companion: ${this.companions[companionId].name}`);
            return true;
        }
        return false;
    }
    
    getAllCompanions() {
        return Object.values(this.companions);
    }
    
    getUnlockedCompanions() {
        return Object.values(this.companions).filter(c => c.unlocked);
    }
}

// Extend companion abilities
const companionAbilities = {
    smoke_siren: (engine) => {
        logger.info('💨 Smoke Siren uses Mind Cloud!');
        // Create confusion effect on enemies
        const enemies = engine.enemyManager.getEnemies();
        enemies.forEach(enemy => {
            if (enemy.isAlive) {
                enemy.mesh.userData.confused = true;
                setTimeout(() => {
                    if (enemy.mesh && enemy.mesh.userData) {
                        enemy.mesh.userData.confused = false;
                    }
                }, 5000);
            }
        });
    },
    
    blade_muse: (engine) => {
        logger.info('⚔️ Blade Muse performs Rhythm Strike!');
        // Deal damage to multiple enemies in sequence
        let delay = 0;
        const enemies = engine.enemyManager.getEnemies().slice(0, 3);
        enemies.forEach(enemy => {
            if (enemy.isAlive) {
                setTimeout(() => {
                    enemy.takeDamage(30);
                    if (!enemy.isAlive && engine.player) {
                        engine.player.gainExp(enemy.stats.exp);
                        if (engine.endlessMode) {
                            engine.endlessMode.onEnemyDefeated();
                        }
                        engine.dropLoot(enemy);
                        if (engine.questSystem) {
                            engine.questSystem.onEnemyDefeated(enemy.isBoss);
                        }
                    }
                }, delay);
                delay += 200;
            }
        });
    },
    
    herb_witch: (engine) => {
        logger.info('🌿 Herb Witch casts Greenfire Burst!');
        // Heal player and damage enemies
        if (engine.player) {
            engine.player.heal(40);
        }
        const enemies = engine.enemyManager.getEnemies();
        enemies.forEach(enemy => {
            if (enemy.isAlive) {
                enemy.takeDamage(20);
                if (!enemy.isAlive && engine.player) {
                    engine.player.gainExp(enemy.stats.exp);
                    if (engine.endlessMode) {
                        engine.endlessMode.onEnemyDefeated();
                    }
                    engine.dropLoot(enemy);
                    if (engine.questSystem) {
                        engine.questSystem.onEnemyDefeated(enemy.isBoss);
                    }
                }
            }
        });
    },
    
    cyber_dryad: (engine) => {
        logger.info('⚡ Cyber Dryad activates Tech-Nature Fusion!');
        // Drain energy from all enemies
        const enemies = engine.enemyManager.getEnemies();
        enemies.forEach(enemy => {
            if (enemy.isAlive) {
                enemy.takeDamage(25);
                if (engine.player && engine.player.stats.mp < engine.player.stats.maxMp) {
                    engine.player.stats.mp += 10;
                }
                if (!enemy.isAlive && engine.player) {
                    engine.player.gainExp(enemy.stats.exp);
                    if (engine.endlessMode) {
                        engine.endlessMode.onEnemyDefeated();
                    }
                    engine.dropLoot(enemy);
                    if (engine.questSystem) {
                        engine.questSystem.onEnemyDefeated(enemy.isBoss);
                    }
                }
            }
        });
    }
};

// Extend companion prototype with ability execution
CompanionManager.prototype.initializeCompanions = function() {
    const companions = {
        smoke_siren: {
            id: 'smoke_siren',
            name: 'Smoke Siren',
            type: 'charm',
            description: 'A charm-based sorceress who clouds enemies\' minds with enchanting smoke',
            stats: {
                power: 85,
                defense: 60,
                speed: 75,
                charisma: 95
            },
            ability: {
                name: 'Mind Cloud',
                description: 'Confuses enemies in an area, reducing their accuracy',
                cooldown: 15,
                manaCost: 40
            },
            isOnCooldown: false,
            unlocked: true,
            useAbility: function(engine) {
                if (!this.isOnCooldown && companionAbilities[this.id]) {
                    companionAbilities[this.id](engine);
                    this.isOnCooldown = true;
                    setTimeout(() => {
                        this.isOnCooldown = false;
                        if (engine.updateCompanionUI) engine.updateCompanionUI();
                    }, this.ability.cooldown * 1000);
                }
            }
        },
        blade_muse: {
            id: 'blade_muse',
            name: 'Blade Muse',
            type: 'fighter',
            description: 'An acrobatic fighter powered by rhythm and motion',
            stats: {
                power: 90,
                defense: 70,
                speed: 95,
                charisma: 80
            },
            ability: {
                name: 'Rhythm Strike',
                description: 'A chain of rapid attacks that crescendo in power',
                cooldown: 12,
                manaCost: 35
            },
            isOnCooldown: false,
            unlocked: true,
            useAbility: function(engine) {
                if (!this.isOnCooldown && companionAbilities[this.id]) {
                    companionAbilities[this.id](engine);
                    this.isOnCooldown = true;
                    setTimeout(() => {
                        this.isOnCooldown = false;
                        if (engine.updateCompanionUI) engine.updateCompanionUI();
                    }, this.ability.cooldown * 1000);
                }
            }
        },
        herb_witch: {
            id: 'herb_witch',
            name: 'Herb Witch',
            type: 'alchemist',
            description: 'An alchemist cultivating greenfire crystals and healing herbs',
            stats: {
                power: 70,
                defense: 65,
                speed: 60,
                charisma: 85
            },
            ability: {
                name: 'Greenfire Burst',
                description: 'Heals allies and damages enemies with mystical herbs',
                cooldown: 18,
                manaCost: 45
            },
            isOnCooldown: false,
            unlocked: false,
            useAbility: function(engine) {
                if (!this.isOnCooldown && companionAbilities[this.id]) {
                    companionAbilities[this.id](engine);
                    this.isOnCooldown = true;
                    setTimeout(() => {
                        this.isOnCooldown = false;
                        if (engine.updateCompanionUI) engine.updateCompanionUI();
                    }, this.ability.cooldown * 1000);
                }
            }
        },
        cyber_dryad: {
            id: 'cyber_dryad',
            name: 'Cyber Dryad',
            type: 'techno-mage',
            description: 'A forest spirit laced with luminous tech veins, bridging nature and technology',
            stats: {
                power: 88,
                defense: 75,
                speed: 82,
                charisma: 90
            },
            ability: {
                name: 'Tech-Nature Fusion',
                description: 'Summons digital vines that drain enemy energy',
                cooldown: 20,
                manaCost: 50
            },
            isOnCooldown: false,
            unlocked: false,
            useAbility: function(engine) {
                if (!this.isOnCooldown && companionAbilities[this.id]) {
                    companionAbilities[this.id](engine);
                    this.isOnCooldown = true;
                    setTimeout(() => {
                        this.isOnCooldown = false;
                        if (engine.updateCompanionUI) engine.updateCompanionUI();
                    }, this.ability.cooldown * 1000);
                }
            }
        }
    };
    
    return companions;
};
