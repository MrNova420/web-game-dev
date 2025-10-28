/**
 * CompanionManager - Manages companion characters (waifus)
 * Based on the Dynasty of Emberveil lore
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
            console.log(`💜 Active companion: ${this.companions[companionId].name}`);
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
            console.log(`✨ Unlocked companion: ${this.companions[companionId].name}`);
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
        console.log('💨 Smoke Siren uses Mind Cloud!');
        // Create confusion effect on enemies
        engine.enemies.forEach(enemy => {
            if (enemy.userData.isAlive) {
                enemy.userData.confused = true;
                setTimeout(() => {
                    enemy.userData.confused = false;
                }, 5000);
            }
        });
    },
    
    blade_muse: (engine) => {
        console.log('⚔️ Blade Muse performs Rhythm Strike!');
        // Deal damage to multiple enemies in sequence
        let delay = 0;
        engine.enemies.slice(0, 3).forEach(enemy => {
            if (enemy.userData.isAlive) {
                setTimeout(() => {
                    enemy.userData.hp -= 30;
                    if (enemy.userData.hp <= 0) {
                        enemy.userData.isAlive = false;
                        engine.scene.remove(enemy);
                    }
                }, delay);
                delay += 200;
            }
        });
    },
    
    herb_witch: (engine) => {
        console.log('🌿 Herb Witch casts Greenfire Burst!');
        // Heal player and damage enemies
        if (engine.player) {
            engine.player.heal(40);
        }
        engine.enemies.forEach(enemy => {
            if (enemy.userData.isAlive) {
                enemy.userData.hp -= 20;
                if (enemy.userData.hp <= 0) {
                    enemy.userData.isAlive = false;
                    engine.scene.remove(enemy);
                }
            }
        });
    },
    
    cyber_dryad: (engine) => {
        console.log('⚡ Cyber Dryad activates Tech-Nature Fusion!');
        // Drain energy from all enemies
        engine.enemies.forEach(enemy => {
            if (enemy.userData.isAlive) {
                enemy.userData.hp -= 25;
                if (engine.player && engine.player.stats.mp < engine.player.stats.maxMp) {
                    engine.player.stats.mp += 10;
                }
                if (enemy.userData.hp <= 0) {
                    enemy.userData.isAlive = false;
                    engine.scene.remove(enemy);
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
