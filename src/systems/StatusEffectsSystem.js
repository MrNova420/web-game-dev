/**
 * Status Effects System
 * Manages buffs, debuffs, and damage-over-time effects
 */

export class StatusEffectsSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // Active effects tracking
        this.activeEffects = new Map(); // entity -> effects array
        
        // Effect definitions
        this.effectTypes = this.createEffectTypes();
        
        // Stacking rules
        this.stackingRules = {
            poison: { maxStacks: 5, refreshDuration: true },
            burn: { maxStacks: 3, refreshDuration: true },
            bleed: { maxStacks: 10, refreshDuration: false },
            slow: { maxStacks: 1, refreshDuration: true },
            stun: { maxStacks: 1, refreshDuration: true },
            freeze: { maxStacks: 1, refreshDuration: false },
            regen: { maxStacks: 1, refreshDuration: true },
            shield: { maxStacks: 1, refreshDuration: false },
            haste: { maxStacks: 3, refreshDuration: true },
            strength: { maxStacks: 5, refreshDuration: true },
            weakness: { maxStacks: 5, refreshDuration: true },
            vulnerability: { maxStacks: 3, refreshDuration: true },
            immunity: { maxStacks: 1, refreshDuration: true },
            lifesteal: { maxStacks: 1, refreshDuration: true },
            thorns: { maxStacks: 3, refreshDuration: true }
        };
    }

    /**
     * Create effect type definitions
     */
    createEffectTypes() {
        return {
            // Damage over time effects
            poison: {
                name: 'Poison',
                type: 'debuff',
                damagePerSecond: 5,
                duration: 10,
                color: '#00ff00',
                icon: '☠️',
                particle: 'poison'
            },
            burn: {
                name: 'Burning',
                type: 'debuff',
                damagePerSecond: 8,
                duration: 6,
                color: '#ff6600',
                icon: '🔥',
                particle: 'fire'
            },
            bleed: {
                name: 'Bleeding',
                type: 'debuff',
                damagePerSecond: 3,
                duration: 15,
                color: '#cc0000',
                icon: '💉',
                particle: 'blood'
            },
            
            // Movement effects
            slow: {
                name: 'Slowed',
                type: 'debuff',
                speedMultiplier: 0.5,
                duration: 5,
                color: '#6699ff',
                icon: '❄️',
                particle: 'ice'
            },
            stun: {
                name: 'Stunned',
                type: 'debuff',
                speedMultiplier: 0,
                canAct: false,
                duration: 2,
                color: '#ffff00',
                icon: '⚡',
                particle: 'stun'
            },
            freeze: {
                name: 'Frozen',
                type: 'debuff',
                speedMultiplier: 0,
                canAct: false,
                duration: 3,
                color: '#00ccff',
                icon: '❄️',
                particle: 'freeze'
            },
            haste: {
                name: 'Haste',
                type: 'buff',
                speedMultiplier: 1.5,
                duration: 10,
                color: '#ffcc00',
                icon: '⚡',
                particle: 'speed'
            },
            
            // Healing effects
            regen: {
                name: 'Regeneration',
                type: 'buff',
                healPerSecond: 5,
                duration: 10,
                color: '#00ff00',
                icon: '💚',
                particle: 'heal'
            },
            
            // Defense effects
            shield: {
                name: 'Shield',
                type: 'buff',
                absorbAmount: 100,
                duration: 15,
                color: '#6666ff',
                icon: '🛡️',
                particle: 'shield'
            },
            
            // Stat modification effects
            strength: {
                name: 'Strength',
                type: 'buff',
                damageMultiplier: 1.2,
                duration: 15,
                color: '#ff0000',
                icon: '💪',
                particle: 'power'
            },
            weakness: {
                name: 'Weakness',
                type: 'debuff',
                damageMultiplier: 0.7,
                duration: 10,
                color: '#999999',
                icon: '💔',
                particle: 'weakness'
            },
            vulnerability: {
                name: 'Vulnerability',
                type: 'debuff',
                damageTakenMultiplier: 1.5,
                duration: 8,
                color: '#ff00ff',
                icon: '💢',
                particle: 'vulnerability'
            },
            
            // Special effects
            immunity: {
                name: 'Immunity',
                type: 'buff',
                immuneToDebuffs: true,
                duration: 5,
                color: '#ffffff',
                icon: '✨',
                particle: 'immunity'
            },
            lifesteal: {
                name: 'Lifesteal',
                type: 'buff',
                lifestealPercent: 0.15,
                duration: 12,
                color: '#cc00cc',
                icon: '🩸',
                particle: 'lifesteal'
            },
            thorns: {
                name: 'Thorns',
                type: 'buff',
                reflectPercent: 0.3,
                duration: 10,
                color: '#996633',
                icon: '🌵',
                particle: 'thorns'
            }
        };
    }

    /**
     * Apply status effect to entity
     */
    applyEffect(entity, effectType, duration = null, power = 1.0, source = null) {
        const effectDef = this.effectTypes[effectType];
        if (!effectDef) return false;
        
        // Check immunity
        if (this.hasImmunity(entity)) {
            return false;
        }
        
        // Get or create effects array for entity
        if (!this.activeEffects.has(entity)) {
            this.activeEffects.set(entity, []);
        }
        
        const effects = this.activeEffects.get(entity);
        
        // Check for existing effect
        const existing = effects.find(e => e.type === effectType);
        const stackingRule = this.stackingRules[effectType];
        
        if (existing) {
            // Handle stacking
            if (stackingRule) {
                const currentStacks = existing.stacks || 1;
                
                if (currentStacks < stackingRule.maxStacks) {
                    existing.stacks = currentStacks + 1;
                }
                
                if (stackingRule.refreshDuration) {
                    existing.duration = duration || effectDef.duration;
                    existing.timer = 0;
                }
            }
        } else {
            // Create new effect
            const effect = {
                type: effectType,
                ...effectDef,
                duration: duration || effectDef.duration,
                timer: 0,
                power: power,
                source: source,
                stacks: 1,
                shieldRemaining: effectDef.absorbAmount || 0
            };
            
            effects.push(effect);
            
            // Visual feedback
            this.showEffectApplied(entity, effect);
        }
        
        return true;
    }

    /**
     * Remove effect from entity
     */
    removeEffect(entity, effectType) {
        if (!this.activeEffects.has(entity)) return;
        
        const effects = this.activeEffects.get(entity);
        const index = effects.findIndex(e => e.type === effectType);
        
        if (index !== -1) {
            const effect = effects[index];
            effects.splice(index, 1);
            
            // Visual feedback
            this.showEffectRemoved(entity, effect);
            
            // Clean up if no more effects
            if (effects.length === 0) {
                this.activeEffects.delete(entity);
            }
        }
    }

    /**
     * Update all status effects
     */
    update(deltaTime) {
        for (const [entity, effects] of this.activeEffects) {
            if (!entity || entity.health <= 0) {
                this.activeEffects.delete(entity);
                continue;
            }
            
            for (let i = effects.length - 1; i >= 0; i--) {
                const effect = effects[i];
                effect.timer += deltaTime;
                
                // Apply effect
                this.applyEffectTick(entity, effect, deltaTime);
                
                // Remove expired effects
                if (effect.timer >= effect.duration) {
                    this.showEffectExpired(entity, effect);
                    effects.splice(i, 1);
                }
            }
            
            // Clean up if no more effects
            if (effects.length === 0) {
                this.activeEffects.delete(entity);
            }
        }
    }

    /**
     * Apply effect tick
     */
    applyEffectTick(entity, effect, deltaTime) {
        const stacks = effect.stacks || 1;
        
        // Damage over time
        if (effect.damagePerSecond) {
            const damage = effect.damagePerSecond * stacks * effect.power * deltaTime;
            entity.health -= damage;
            
            if (entity.health < 0) entity.health = 0;
            
            // Visual feedback for DoT
            if (Math.random() < 0.1 && this.gameEngine.particleSystem) {
                this.gameEngine.particleSystem.createDOTEffect(entity.position, effect.particle);
            }
        }
        
        // Healing over time
        if (effect.healPerSecond) {
            const healing = effect.healPerSecond * stacks * effect.power * deltaTime;
            entity.health += healing;
            
            if (entity.health > entity.maxHealth) {
                entity.health = entity.maxHealth;
            }
            
            // Visual feedback for HoT
            if (Math.random() < 0.1 && this.gameEngine.particleSystem) {
                this.gameEngine.particleSystem.createHealEffect(entity.position);
            }
        }
    }

    /**
     * Calculate movement speed multiplier
     */
    getSpeedMultiplier(entity) {
        if (!this.activeEffects.has(entity)) return 1.0;
        
        let multiplier = 1.0;
        const effects = this.activeEffects.get(entity);
        
        for (const effect of effects) {
            if (effect.speedMultiplier !== undefined) {
                multiplier *= effect.speedMultiplier;
            }
        }
        
        return multiplier;
    }

    /**
     * Calculate damage multiplier
     */
    getDamageMultiplier(entity) {
        if (!this.activeEffects.has(entity)) return 1.0;
        
        let multiplier = 1.0;
        const effects = this.activeEffects.get(entity);
        
        for (const effect of effects) {
            if (effect.damageMultiplier !== undefined) {
                const stacks = effect.stacks || 1;
                const stackBonus = (effect.damageMultiplier - 1) * stacks;
                multiplier *= (1 + stackBonus);
            }
        }
        
        return multiplier;
    }

    /**
     * Calculate damage taken multiplier
     */
    getDamageTakenMultiplier(entity) {
        if (!this.activeEffects.has(entity)) return 1.0;
        
        let multiplier = 1.0;
        const effects = this.activeEffects.get(entity);
        
        for (const effect of effects) {
            if (effect.damageTakenMultiplier !== undefined) {
                multiplier *= effect.damageTakenMultiplier;
            }
        }
        
        return multiplier;
    }

    /**
     * Process incoming damage with shields and thorns
     */
    processDamage(entity, damage, attacker = null) {
        if (!this.activeEffects.has(entity)) return damage;
        
        const effects = this.activeEffects.get(entity);
        let finalDamage = damage;
        
        // Apply damage taken multiplier
        finalDamage *= this.getDamageTakenMultiplier(entity);
        
        // Check shields
        for (const effect of effects) {
            if (effect.type === 'shield' && effect.shieldRemaining > 0) {
                const absorbed = Math.min(finalDamage, effect.shieldRemaining);
                effect.shieldRemaining -= absorbed;
                finalDamage -= absorbed;
                
                // Remove shield if depleted
                if (effect.shieldRemaining <= 0) {
                    this.removeEffect(entity, 'shield');
                }
                
                // Visual feedback
                if (this.gameEngine.particleSystem) {
                    this.gameEngine.particleSystem.createShieldBlockEffect(entity.position);
                }
                
                if (finalDamage <= 0) break;
            }
        }
        
        // Apply thorns reflection
        if (attacker) {
            for (const effect of effects) {
                if (effect.type === 'thorns') {
                    const reflectedDamage = damage * effect.reflectPercent * (effect.stacks || 1);
                    attacker.health -= reflectedDamage;
                    
                    // Visual feedback
                    if (this.gameEngine.particleSystem) {
                        this.gameEngine.particleSystem.createThornsEffect(attacker.position);
                    }
                }
            }
        }
        
        return Math.max(0, finalDamage);
    }

    /**
     * Process lifesteal on damage dealt
     */
    processLifesteal(entity, damageDealt) {
        if (!this.activeEffects.has(entity)) return 0;
        
        const effects = this.activeEffects.get(entity);
        let totalHealing = 0;
        
        for (const effect of effects) {
            if (effect.type === 'lifesteal') {
                const healing = damageDealt * effect.lifestealPercent;
                entity.health += healing;
                totalHealing += healing;
                
                if (entity.health > entity.maxHealth) {
                    entity.health = entity.maxHealth;
                }
                
                // Visual feedback
                if (this.gameEngine.particleSystem) {
                    this.gameEngine.particleSystem.createLifestealEffect(entity.position);
                }
            }
        }
        
        return totalHealing;
    }

    /**
     * Check if entity can act
     */
    canAct(entity) {
        if (!this.activeEffects.has(entity)) return true;
        
        const effects = this.activeEffects.get(entity);
        
        for (const effect of effects) {
            if (effect.canAct === false) {
                return false;
            }
        }
        
        return true;
    }

    /**
     * Check if entity has immunity
     */
    hasImmunity(entity) {
        if (!this.activeEffects.has(entity)) return false;
        
        const effects = this.activeEffects.get(entity);
        return effects.some(e => e.type === 'immunity');
    }

    /**
     * Check if entity has specific effect
     */
    hasEffect(entity, effectType) {
        if (!this.activeEffects.has(entity)) return false;
        
        const effects = this.activeEffects.get(entity);
        return effects.some(e => e.type === effectType);
    }

    /**
     * Get effect stack count
     */
    getEffectStacks(entity, effectType) {
        if (!this.activeEffects.has(entity)) return 0;
        
        const effects = this.activeEffects.get(entity);
        const effect = effects.find(e => e.type === effectType);
        
        return effect ? (effect.stacks || 1) : 0;
    }

    /**
     * Clear all effects from entity
     */
    clearAllEffects(entity) {
        if (this.activeEffects.has(entity)) {
            const effects = this.activeEffects.get(entity);
            effects.length = 0;
            this.activeEffects.delete(entity);
        }
    }

    /**
     * Clear effects of specific type (buff/debuff)
     */
    clearEffectsByType(entity, type) {
        if (!this.activeEffects.has(entity)) return;
        
        const effects = this.activeEffects.get(entity);
        
        for (let i = effects.length - 1; i >= 0; i--) {
            if (effects[i].type === type) {
                effects.splice(i, 1);
            }
        }
        
        if (effects.length === 0) {
            this.activeEffects.delete(entity);
        }
    }

    /**
     * Get all active effects for entity
     */
    getActiveEffects(entity) {
        return this.activeEffects.get(entity) || [];
    }

    /**
     * Show effect applied visual
     */
    showEffectApplied(entity, effect) {
        if (this.gameEngine.particleSystem) {
            this.gameEngine.particleSystem.createStatusEffect(entity.position, effect.particle);
        }
        if (this.gameEngine.audioSystem) {
            this.gameEngine.audioSystem.playSoundEffect('status_applied');
        }
    }

    /**
     * Show effect removed visual
     */
    showEffectRemoved(entity, effect) {
        // Could add visual feedback here
    }

    /**
     * Show effect expired visual
     */
    showEffectExpired(entity, effect) {
        // Could add visual feedback here
    }

    /**
     * Create status effect combinations
     */
    checkCombinations(entity) {
        if (!this.activeEffects.has(entity)) return;
        
        const effects = this.activeEffects.get(entity);
        const effectTypes = effects.map(e => e.type);
        
        // Burning + Poison = Extra DoT
        if (effectTypes.includes('burn') && effectTypes.includes('poison')) {
            // Boost both effects
        }
        
        // Freeze + Physical = Shatter (extra damage)
        if (effectTypes.includes('freeze')) {
            // Mark for shatter damage
        }
    }

    /**
     * Get effect description for UI
     */
    getEffectDescription(effectType) {
        const effect = this.effectTypes[effectType];
        if (!effect) return '';
        
        let desc = effect.name + ': ';
        
        if (effect.damagePerSecond) {
            desc += `${effect.damagePerSecond} damage/sec`;
        }
        if (effect.healPerSecond) {
            desc += `${effect.healPerSecond} healing/sec`;
        }
        if (effect.speedMultiplier !== undefined && effect.speedMultiplier !== 1) {
            const percent = Math.round((effect.speedMultiplier - 1) * 100);
            desc += `${percent > 0 ? '+' : ''}${percent}% speed`;
        }
        if (effect.damageMultiplier !== undefined) {
            const percent = Math.round((effect.damageMultiplier - 1) * 100);
            desc += `${percent > 0 ? '+' : ''}${percent}% damage`;
        }
        
        return desc;
    }
}
