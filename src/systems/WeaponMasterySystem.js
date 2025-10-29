/**
 * WeaponMasterySystem - Weapon progression and specialization
 * Handles weapon mastery levels, passive bonuses, special moves
 */

class WeaponMasterySystem {
    constructor(combatSystem, uiSystem) {
        this.combat = combatSystem;
        this.ui = uiSystem;
        
        this.masteryData = new Map(); // entityId -> weapon mastery data
        
        this.weaponTypes = [
            'sword', 'axe', 'mace', 'dagger', 'bow', 'crossbow',
            'staff', 'wand', 'dual_wield', 'spear', 'shield'
        ];
        
        this.masteryTiers = [
            { level: 0, name: 'Novice', xpRequired: 0 },
            { level: 10, name: 'Apprentice', xpRequired: 100 },
            { level: 20, name: 'Adept', xpRequired: 500 },
            { level: 30, name: 'Expert', xpRequired: 1500 },
            { level: 40, name: 'Master', xpRequired: 3500 },
            { level: 50, name: 'Virtuoso', xpRequired: 7000 },
            { level: 60, name: 'Champion', xpRequired: 12000 },
            { level: 70, name: 'Legend', xpRequired: 20000 },
            { level: 80, name: 'Grandmaster', xpRequired: 35000 },
            { level: 90, name: 'Transcendent', xpRequired: 60000 },
            { level: 100, name: 'Deity', xpRequired: 100000 }
        ];
        
        this.specialMoves = this.initializeSpecialMoves();
    }
    
    initializeSpecialMoves() {
        return {
            sword: {
                name: 'Blade Master',
                unlockLevel: 70,
                description: 'Execute 3 lightning-fast strikes',
                cooldown: 15000,
                effect: (entityId, targetId) => {
                    for (let i = 0; i < 3; i++) {
                        setTimeout(() => {
                            this.combat?.attack(entityId, targetId, {
                                damage: this.combat.getEntityAttackDamage(entityId) * 0.85,
                                type: 'special'
                            });
                        }, i * 200);
                    }
                }
            },
            axe: {
                name: 'Executioner\'s Strike',
                unlockLevel: 70,
                description: 'Devastating blow that ignores armor',
                cooldown: 20000,
                effect: (entityId, targetId) => {
                    const damage = this.combat.getEntityAttackDamage(entityId) * 4.0;
                    this.combat?.attack(entityId, targetId, {
                        damage: damage,
                        type: 'special',
                        ignoreArmor: true
                    });
                }
            },
            bow: {
                name: 'Sniper Shot',
                unlockLevel: 70,
                description: 'Precise shot that pierces through multiple enemies',
                cooldown: 18000,
                effect: (entityId, targetId) => {
                    const damage = this.combat.getEntityAttackDamage(entityId) * 3.5;
                    this.combat?.attack(entityId, targetId, {
                        damage: damage,
                        type: 'special',
                        pierce: 5
                    });
                }
            },
            staff: {
                name: 'Arcane Mastery',
                unlockLevel: 70,
                description: 'Temporarily reduce all spell cooldowns by 30%',
                cooldown: 60000,
                effect: (entityId, targetId) => {
                    this.combat?.applyBuff(entityId, 'arcane_mastery', 15000, {
                        cooldownReduction: 0.3
                    });
                }
            },
            dual_wield: {
                name: 'Assassin\'s Dance',
                unlockLevel: 70,
                description: 'Flurry of 5 rapid strikes',
                cooldown: 12000,
                effect: (entityId, targetId) => {
                    for (let i = 0; i < 5; i++) {
                        setTimeout(() => {
                            this.combat?.attack(entityId, targetId, {
                                damage: this.combat.getEntityAttackDamage(entityId) * 0.6,
                                type: 'special'
                            });
                        }, i * 150);
                    }
                }
            },
            mace: {
                name: 'Shatter',
                unlockLevel: 70,
                description: 'Massive blow that stuns and deals AOE damage',
                cooldown: 25000,
                effect: (entityId, targetId) => {
                    const damage = this.combat.getEntityAttackDamage(entityId) * 3.0;
                    this.combat?.attack(entityId, targetId, {
                        damage: damage,
                        type: 'special',
                        aoe: 5,
                        stun: 2000
                    });
                }
            },
            dagger: {
                name: 'Shadow Strike',
                unlockLevel: 70,
                description: 'Teleport behind target and strike',
                cooldown: 10000,
                effect: (entityId, targetId) => {
                    // Teleport behind target
                    const damage = this.combat.getEntityAttackDamage(entityId) * 4.0;
                    this.combat?.attack(entityId, targetId, {
                        damage: damage,
                        type: 'special',
                        backstab: true
                    });
                }
            },
            spear: {
                name: 'Dragon Thrust',
                unlockLevel: 70,
                description: 'Powerful thrust that pierces and bleeds',
                cooldown: 15000,
                effect: (entityId, targetId) => {
                    const damage = this.combat.getEntityAttackDamage(entityId) * 3.2;
                    this.combat?.attack(entityId, targetId, {
                        damage: damage,
                        type: 'special',
                        pierce: 3,
                        bleed: 5000
                    });
                }
            },
            wand: {
                name: 'Spell Surge',
                unlockLevel: 70,
                description: 'Next 3 spells cost no mana',
                cooldown: 45000,
                effect: (entityId, targetId) => {
                    this.combat?.applyBuff(entityId, 'spell_surge', 10000, {
                        freeSpells: 3
                    });
                }
            },
            crossbow: {
                name: 'Explosive Bolt',
                unlockLevel: 70,
                description: 'Fire an explosive bolt dealing massive AOE damage',
                cooldown: 20000,
                effect: (entityId, targetId) => {
                    const damage = this.combat.getEntityAttackDamage(entityId) * 2.5;
                    this.combat?.attack(entityId, targetId, {
                        damage: damage,
                        type: 'special',
                        aoe: 8,
                        element: 'fire'
                    });
                }
            },
            shield: {
                name: 'Fortress',
                unlockLevel: 70,
                description: 'Become invulnerable for 3 seconds',
                cooldown: 60000,
                effect: (entityId, targetId) => {
                    this.combat?.applyBuff(entityId, 'fortress', 3000, {
                        invulnerable: true
                    });
                }
            }
        };
    }
    
    initializeEntity(entityId) {
        if (!this.masteryData.has(entityId)) {
            const data = {};
            
            for (const weaponType of this.weaponTypes) {
                data[weaponType] = {
                    level: 0,
                    xp: 0,
                    specialMoveLastUsed: 0
                };
            }
            
            this.masteryData.set(entityId, {
                weapons: data,
                currentWeapon: null
            });
        }
    }
    
    addMasteryXP(entityId, weaponType, xp) {
        this.initializeEntity(entityId);
        
        const data = this.masteryData.get(entityId);
        const weaponData = data.weapons[weaponType];
        
        if (!weaponData) return;
        
        const oldLevel = weaponData.level;
        weaponData.xp += xp;
        
        // Check for level up
        const newLevel = this.calculateLevel(weaponData.xp);
        
        if (newLevel > oldLevel) {
            weaponData.level = newLevel;
            this.onMasteryLevelUp(entityId, weaponType, newLevel);
        }
    }
    
    calculateLevel(xp) {
        for (let i = this.masteryTiers.length - 1; i >= 0; i--) {
            if (xp >= this.masteryTiers[i].xpRequired) {
                const tier = this.masteryTiers[i];
                const nextTier = this.masteryTiers[i + 1];
                
                if (!nextTier) return 100;
                
                const xpInTier = xp - tier.xpRequired;
                const xpForTier = nextTier.xpRequired - tier.xpRequired;
                const levelProgress = (xpInTier / xpForTier) * 10;
                
                return Math.min(100, tier.level + levelProgress);
            }
        }
        return 0;
    }
    
    getMasteryLevel(entityId, weaponType) {
        this.initializeEntity(entityId);
        
        const data = this.masteryData.get(entityId);
        return data.weapons[weaponType]?.level || 0;
    }
    
    getMasteryTier(level) {
        for (let i = this.masteryTiers.length - 1; i >= 0; i--) {
            if (level >= this.masteryTiers[i].level) {
                return this.masteryTiers[i];
            }
        }
        return this.masteryTiers[0];
    }
    
    getMasteryBonuses(entityId, weaponType) {
        const level = this.getMasteryLevel(entityId, weaponType);
        
        return {
            damageBonus: level * 0.01, // 1% per level
            attackSpeedBonus: level * 0.005, // 0.5% per level
            critChanceBonus: level * 0.002, // 0.2% per level
            durabilityBonus: level * 0.01 // 1% per level
        };
    }
    
    canUseSpecialMove(entityId, weaponType) {
        const level = this.getMasteryLevel(entityId, weaponType);
        const specialMove = this.specialMoves[weaponType];
        
        if (!specialMove) return false;
        if (level < specialMove.unlockLevel) return false;
        
        const data = this.masteryData.get(entityId);
        const weaponData = data.weapons[weaponType];
        const now = Date.now();
        
        return (now - weaponData.specialMoveLastUsed) >= specialMove.cooldown;
    }
    
    useSpecialMove(entityId, weaponType, targetId) {
        if (!this.canUseSpecialMove(entityId, weaponType)) {
            return { success: false, reason: 'not_available' };
        }
        
        const specialMove = this.specialMoves[weaponType];
        const data = this.masteryData.get(entityId);
        const weaponData = data.weapons[weaponType];
        
        // Execute special move
        specialMove.effect(entityId, targetId);
        
        // Set cooldown
        weaponData.specialMoveLastUsed = Date.now();
        
        // Visual and audio feedback
        this.showSpecialMove(entityId, specialMove.name);
        
        return { success: true, name: specialMove.name };
    }
    
    switchWeapon(entityId, weaponType) {
        this.initializeEntity(entityId);
        
        const data = this.masteryData.get(entityId);
        data.currentWeapon = weaponType;
        
        // Apply mastery bonuses
        const bonuses = this.getMasteryBonuses(entityId, weaponType);
        this.combat?.applyStatModifiers(entityId, bonuses);
    }
    
    onMasteryLevelUp(entityId, weaponType, newLevel) {
        const tier = this.getMasteryTier(newLevel);
        
        // Notification
        this.ui?.showNotification(`${weaponType.toUpperCase()} Mastery: ${tier.name}!`, 'achievement');
        
        // Check for special move unlock
        const specialMove = this.specialMoves[weaponType];
        if (specialMove && newLevel >= specialMove.unlockLevel) {
            this.ui?.showNotification(`Unlocked: ${specialMove.name}!`, 'achievement');
        }
        
        // Visual effect
        this.showMasteryLevelUp(entityId, weaponType, tier);
    }
    
    showSpecialMove(entityId, moveName) {
        this.ui?.showNotification(moveName, 'special_move');
    }
    
    showMasteryLevelUp(entityId, weaponType, tier) {
        // Visual celebration effect
    }
    
    getMasteryInfo(entityId, weaponType) {
        this.initializeEntity(entityId);
        
        const data = this.masteryData.get(entityId);
        const weaponData = data.weapons[weaponType];
        const level = weaponData.level;
        const tier = this.getMasteryTier(level);
        const nextTier = this.masteryTiers.find(t => t.level > level);
        const bonuses = this.getMasteryBonuses(entityId, weaponType);
        const specialMove = this.specialMoves[weaponType];
        
        return {
            level: level,
            tier: tier.name,
            xp: weaponData.xp,
            xpForNextTier: nextTier ? nextTier.xpRequired : null,
            bonuses: bonuses,
            specialMove: specialMove ? {
                name: specialMove.name,
                description: specialMove.description,
                unlocked: level >= specialMove.unlockLevel,
                unlockLevel: specialMove.unlockLevel
            } : null
        };
    }
    
    save(entityId) {
        return this.masteryData.get(entityId);
    }
    
    load(entityId, savedData) {
        if (savedData) {
            this.masteryData.set(entityId, savedData);
        }
    }
}

// Export for use in other systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WeaponMasterySystem;
}
