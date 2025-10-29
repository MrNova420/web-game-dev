/**
 * CombatCombosSystem - Advanced combo chain system
 * Manages combo attacks, timing windows, and finishers
 * Part of Phase 2: Advanced Combat Systems
 */

class CombatCombosSystem {
    constructor(combatSystem, particleSystem, audioSystem, uiSystem) {
        this.combatSystem = combatSystem;
        this.particleSystem = particleSystem;
        this.audioSystem = audioSystem;
        this.uiSystem = uiSystem;
        
        this.combos = new Map(); // entityId -> combo state
        this.comboDefinitions = this.initializeComboDefinitions();
        this.activeChains = new Map(); // entityId -> active chain data
    }
    
    initializeComboDefinitions() {
        return {
            // Basic Weapon Combos
            sword_basic: {
                name: 'Sword Triple Slash',
                attacks: ['light', 'light', 'light'],
                timingWindow: 1000, // ms between attacks
                damageMultipliers: [1.0, 1.2, 1.5],
                finisher: {
                    name: 'Devastating Blow',
                    damageMultiplier: 2.5,
                    effect: 'knockback',
                    animation: 'heavy_attack'
                }
            },
            sword_advanced: {
                name: 'Blade Dance',
                attacks: ['light', 'heavy', 'light', 'heavy'],
                timingWindow: 800,
                damageMultipliers: [1.0, 1.3, 1.5, 1.8],
                finisher: {
                    name: 'Whirlwind Strike',
                    damageMultiplier: 3.0,
                    effect: 'aoe',
                    radius: 5,
                    animation: 'spin_attack'
                }
            },
            axe_heavy: {
                name: 'Crushing Combo',
                attacks: ['heavy', 'heavy', 'heavy'],
                timingWindow: 1200,
                damageMultipliers: [1.5, 1.8, 2.2],
                finisher: {
                    name: 'Skull Splitter',
                    damageMultiplier: 4.0,
                    effect: 'stun',
                    duration: 2000,
                    animation: 'overhead_smash'
                }
            },
            
            // Dual Wield Combos
            dual_wield_fast: {
                name: 'Flurry of Blades',
                attacks: ['light', 'light', 'light', 'light', 'light'],
                timingWindow: 600,
                damageMultipliers: [0.8, 0.9, 1.0, 1.2, 1.5],
                finisher: {
                    name: 'Cross Slash',
                    damageMultiplier: 2.8,
                    effect: 'bleed',
                    animation: 'cross_strike'
                }
            },
            
            // Magic Combos
            mage_elemental: {
                name: 'Elemental Cascade',
                attacks: ['fire', 'ice', 'lightning'],
                timingWindow: 1500,
                damageMultipliers: [1.0, 1.3, 1.6],
                finisher: {
                    name: 'Elemental Explosion',
                    damageMultiplier: 3.5,
                    effect: 'aoe_elemental',
                    radius: 8,
                    elements: ['fire', 'ice', 'lightning'],
                    animation: 'elemental_burst'
                }
            },
            
            // Martial Arts Combos
            monk_basic: {
                name: 'Tiger Fist Combo',
                attacks: ['punch', 'punch', 'kick'],
                timingWindow: 700,
                damageMultipliers: [1.0, 1.2, 1.6],
                finisher: {
                    name: 'Rising Dragon Kick',
                    damageMultiplier: 2.8,
                    effect: 'launch',
                    animation: 'uppercut'
                }
            },
            monk_advanced: {
                name: 'Thousand Palm Strike',
                attacks: ['punch', 'punch', 'punch', 'punch', 'kick', 'kick'],
                timingWindow: 500,
                damageMultipliers: [0.9, 1.0, 1.1, 1.2, 1.5, 1.8],
                finisher: {
                    name: 'Divine Palm',
                    damageMultiplier: 4.5,
                    effect: 'stun_knockback',
                    animation: 'palm_strike'
                }
            },
            
            // Rogue/Assassin Combos
            rogue_backstab: {
                name: 'Shadow Strike Chain',
                attacks: ['backstab', 'slash', 'slash'],
                timingWindow: 900,
                damageMultipliers: [2.0, 1.5, 1.8],
                requiresBackAttack: true,
                finisher: {
                    name: 'Eviscerate',
                    damageMultiplier: 5.0,
                    effect: 'bleed_heavy',
                    animation: 'finisher_strike'
                }
            },
            
            // Ranged Combos
            bow_rapid: {
                name: 'Rapid Shot',
                attacks: ['arrow', 'arrow', 'arrow', 'arrow'],
                timingWindow: 800,
                damageMultipliers: [1.0, 1.1, 1.2, 1.4],
                finisher: {
                    name: 'Piercing Shot',
                    damageMultiplier: 3.0,
                    effect: 'pierce',
                    pierceCount: 3,
                    animation: 'power_shot'
                }
            }
        };
    }
    
    startCombo(entityId, comboType) {
        const definition = this.comboDefinitions[comboType];
        if (!definition) {
            console.warn(`Combo type ${comboType} not found`);
            return false;
        }
        
        this.combos.set(entityId, {
            type: comboType,
            definition: definition,
            currentStep: 0,
            startTime: Date.now(),
            lastAttackTime: Date.now(),
            totalDamage: 0,
            hits: []
        });
        
        // Show combo UI
        if (this.uiSystem) {
            this.uiSystem.showComboTracker(entityId, definition.name, definition.attacks.length);
        }
        
        return true;
    }
    
    advanceCombo(entityId, attackType, targetId) {
        const combo = this.combos.get(entityId);
        if (!combo) {
            return { success: false, reason: 'No active combo' };
        }
        
        const now = Date.now();
        const timeSinceLastAttack = now - combo.lastAttackTime;
        
        // Check timing window
        if (timeSinceLastAttack > combo.definition.timingWindow) {
            this.breakCombo(entityId);
            return { success: false, reason: 'Timing window expired' };
        }
        
        // Check if attack type matches expected
        const expectedAttack = combo.definition.attacks[combo.currentStep];
        if (attackType !== expectedAttack) {
            this.breakCombo(entityId);
            return { success: false, reason: 'Wrong attack type' };
        }
        
        // Check backstab requirement if needed
        if (combo.definition.requiresBackAttack && combo.currentStep === 0) {
            // Would check angle to target here
        }
        
        // Apply damage with multiplier
        const multiplier = combo.definition.damageMultipliers[combo.currentStep];
        const baseDamage = this.combatSystem.getBaseDamage(entityId);
        const finalDamage = baseDamage * multiplier;
        
        // Deal damage
        this.combatSystem.dealDamage(entityId, targetId, finalDamage);
        
        // Record hit
        combo.hits.push({
            step: combo.currentStep,
            damage: finalDamage,
            time: now
        });
        combo.totalDamage += finalDamage;
        combo.currentStep++;
        combo.lastAttackTime = now;
        
        // Show combo counter
        if (this.uiSystem) {
            this.uiSystem.updateComboCounter(entityId, combo.currentStep, combo.definition.attacks.length);
        }
        
        // Play combo hit effect
        this.playComboEffect(entityId, targetId, combo.currentStep);
        
        // Check if combo is complete
        if (combo.currentStep >= combo.definition.attacks.length) {
            return this.executeFinisher(entityId, targetId);
        }
        
        return {
            success: true,
            step: combo.currentStep,
            totalSteps: combo.definition.attacks.length,
            damage: finalDamage,
            multiplier: multiplier
        };
    }
    
    executeFinisher(entityId, targetId) {
        const combo = this.combos.get(entityId);
        if (!combo) return { success: false };
        
        const finisher = combo.definition.finisher;
        const baseDamage = this.combatSystem.getBaseDamage(entityId);
        const finisherDamage = baseDamage * finisher.damageMultiplier;
        
        // Deal finisher damage
        this.combatSystem.dealDamage(entityId, targetId, finisherDamage);
        
        // Apply finisher effects
        this.applyFinisherEffect(entityId, targetId, finisher);
        
        // Show finisher effect
        this.playFinisherEffect(entityId, targetId, finisher);
        
        // Calculate combo bonus
        const comboBonus = this.calculateComboBonus(combo);
        
        // Show combo complete UI
        if (this.uiSystem) {
            this.uiSystem.showComboComplete(entityId, {
                comboName: combo.definition.name,
                totalDamage: combo.totalDamage + finisherDamage,
                hits: combo.hits.length,
                finisherName: finisher.name,
                bonus: comboBonus
            });
        }
        
        // Clean up combo
        this.combos.delete(entityId);
        
        return {
            success: true,
            comboComplete: true,
            finisher: finisher.name,
            totalDamage: combo.totalDamage + finisherDamage,
            finisherDamage: finisherDamage,
            bonus: comboBonus
        };
    }
    
    applyFinisherEffect(entityId, targetId, finisher) {
        switch (finisher.effect) {
            case 'knockback':
                this.combatSystem.applyKnockback(targetId, entityId, 10);
                break;
                
            case 'aoe':
                const position = this.combatSystem.getPosition(targetId);
                const nearbyEnemies = this.combatSystem.getEnemiesInRadius(position, finisher.radius);
                nearbyEnemies.forEach(enemyId => {
                    if (enemyId !== targetId) {
                        this.combatSystem.dealDamage(entityId, enemyId, 
                            this.combatSystem.getBaseDamage(entityId) * finisher.damageMultiplier * 0.5);
                    }
                });
                break;
                
            case 'stun':
                this.combatSystem.applyStatusEffect(targetId, 'stun', finisher.duration);
                break;
                
            case 'bleed':
                this.combatSystem.applyStatusEffect(targetId, 'bleed', 5000, 
                    this.combatSystem.getBaseDamage(entityId) * 0.1);
                break;
                
            case 'bleed_heavy':
                this.combatSystem.applyStatusEffect(targetId, 'bleed', 8000, 
                    this.combatSystem.getBaseDamage(entityId) * 0.2);
                break;
                
            case 'launch':
                this.combatSystem.applyLaunch(targetId, 5);
                break;
                
            case 'stun_knockback':
                this.combatSystem.applyStatusEffect(targetId, 'stun', 1500);
                this.combatSystem.applyKnockback(targetId, entityId, 8);
                break;
                
            case 'pierce':
                // Piercing attack handled in combat system
                break;
                
            case 'aoe_elemental':
                const pos = this.combatSystem.getPosition(targetId);
                const targets = this.combatSystem.getEnemiesInRadius(pos, finisher.radius);
                targets.forEach(enemyId => {
                    finisher.elements.forEach(element => {
                        this.combatSystem.dealElementalDamage(entityId, enemyId, 
                            this.combatSystem.getBaseDamage(entityId) * 0.8, element);
                    });
                });
                break;
        }
    }
    
    playComboEffect(entityId, targetId, step) {
        if (!this.particleSystem || !this.audioSystem) return;
        
        const targetPos = this.combatSystem.getPosition(targetId);
        
        // Particle effect
        this.particleSystem.createEffect(`combo_hit_${step}`, targetPos, {
            type: 'impact',
            color: this.getComboColor(step),
            count: 20 + (step * 10)
        });
        
        // Sound effect
        const pitch = 1.0 + (step * 0.1);
        this.audioSystem.playSFX('combo_hit', 1.0, pitch);
    }
    
    playFinisherEffect(entityId, targetId, finisher) {
        if (!this.particleSystem || !this.audioSystem) return;
        
        const targetPos = this.combatSystem.getPosition(targetId);
        
        // Epic particle effect
        this.particleSystem.createEffect('finisher', targetPos, {
            type: finisher.effect,
            scale: 2.0,
            duration: 2000
        });
        
        // Dramatic sound
        this.audioSystem.playSFX('combo_finisher', 1.5);
        
        // Camera shake
        if (this.uiSystem && this.uiSystem.cameraShake) {
            this.uiSystem.cameraShake(0.8, 0.5);
        }
    }
    
    getComboColor(step) {
        const colors = ['#ffffff', '#ffff00', '#ff8800', '#ff0000', '#ff00ff'];
        return colors[Math.min(step, colors.length - 1)];
    }
    
    calculateComboBonus(combo) {
        const avgTimeBetweenHits = combo.hits.reduce((sum, hit, idx) => {
            if (idx === 0) return 0;
            return sum + (hit.time - combo.hits[idx-1].time);
        }, 0) / (combo.hits.length - 1);
        
        // Bonus for fast execution
        const timingBonus = Math.max(0, 1.5 - (avgTimeBetweenHits / combo.definition.timingWindow));
        
        return {
            experienceBonus: 50 + (combo.hits.length * 10),
            damageBonus: timingBonus,
            stylePoints: combo.hits.length * 100
        };
    }
    
    breakCombo(entityId) {
        const combo = this.combos.get(entityId);
        if (combo) {
            // Show combo break UI
            if (this.uiSystem) {
                this.uiSystem.showComboBreak(entityId);
            }
            
            this.combos.delete(entityId);
        }
    }
    
    getActiveCombo(entityId) {
        return this.combos.get(entityId);
    }
    
    isComboActive(entityId) {
        return this.combos.has(entityId);
    }
    
    getAvailableCombos(entityId, weaponType) {
        // Return combos available for current weapon/class
        const available = [];
        
        for (const [key, combo] of Object.entries(this.comboDefinitions)) {
            if (key.startsWith(weaponType)) {
                available.push({
                    id: key,
                    ...combo
                });
            }
        }
        
        return available;
    }
    
    update(deltaTime) {
        const now = Date.now();
        
        // Check for expired combos
        for (const [entityId, combo] of this.combos.entries()) {
            const timeSinceLastAttack = now - combo.lastAttackTime;
            
            if (timeSinceLastAttack > combo.definition.timingWindow) {
                this.breakCombo(entityId);
            }
        }
    }
}

export default CombatCombosSystem;
