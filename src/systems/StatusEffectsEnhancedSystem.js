/**
 * StatusEffectsEnhancedSystem - Advanced status effect management
 * Handles 15+ status effects with stacking, duration, immunity, cleanse
 */

class StatusEffectsEnhancedSystem {
    constructor(combatSystem, uiSystem, audioSystem, particleSystem) {
        this.combat = combatSystem;
        this.ui = uiSystem;
        this.audio = audioSystem;
        this.particles = particleSystem;
        
        this.activeEffects = new Map(); // entityId -> [effects]
        this.immunities = new Map(); // entityId -> Set of effect types
        this.resistances = new Map(); // entityId -> Map of effect -> resistance %
        
        this.effectDefinitions = this.initializeEffectDefinitions();
    }
    
    initializeEffectDefinitions() {
        return {
            // Positive effects
            regeneration: {
                type: 'positive',
                category: 'healing',
                maxStacks: 5,
                tickInterval: 1000, // 1s
                effect: (entity, stacks) => ({ healPerTick: 10 * stacks }),
                color: '#00FF00',
                icon: 'regeneration'
            },
            haste: {
                type: 'positive',
                category: 'buff',
                maxStacks: 3,
                effect: (entity, stacks) => ({ attackSpeedMult: 1 + (0.15 * stacks), moveSpeedMult: 1 + (0.1 * stacks) }),
                color: '#FFFF00',
                icon: 'haste'
            },
            shield: {
                type: 'positive',
                category: 'protection',
                maxStacks: 1,
                effect: (entity, stacks, power) => ({ absorbDamage: power || 100 }),
                color: '#00FFFF',
                icon: 'shield'
            },
            strength: {
                type: 'positive',
                category: 'buff',
                maxStacks: 5,
                effect: (entity, stacks) => ({ attackMult: 1 + (0.1 * stacks) }),
                color: '#FF0000',
                icon: 'strength'
            },
            wisdom: {
                type: 'positive',
                category: 'buff',
                maxStacks: 5,
                effect: (entity, stacks) => ({ magicPowerMult: 1 + (0.15 * stacks) }),
                color: '#9370DB',
                icon: 'wisdom'
            },
            luck: {
                type: 'positive',
                category: 'buff',
                maxStacks: 3,
                effect: (entity, stacks) => ({ critChanceBonus: 0.05 * stacks, lootBonus: 0.1 * stacks }),
                color: '#FFD700',
                icon: 'luck'
            },
            
            // Negative effects
            poison: {
                type: 'negative',
                category: 'dot',
                maxStacks: 10,
                tickInterval: 1000,
                effect: (entity, stacks, power) => ({ damagePerTick: (power || 10) * stacks }),
                color: '#00FF00',
                icon: 'poison'
            },
            burn: {
                type: 'negative',
                category: 'dot',
                maxStacks: 5,
                tickInterval: 500,
                effect: (entity, stacks, power) => ({ damagePerTick: (power || 15) * stacks }),
                color: '#FF4500',
                icon: 'burn'
            },
            freeze: {
                type: 'negative',
                category: 'cc',
                maxStacks: 1,
                effect: (entity, stacks) => ({ moveSpeedMult: 0, canAttack: false, canMove: false }),
                color: '#87CEEB',
                icon: 'freeze'
            },
            stun: {
                type: 'negative',
                category: 'cc',
                maxStacks: 1,
                effect: (entity, stacks) => ({ moveSpeedMult: 0, canAttack: false, canMove: false, canDodge: false }),
                color: '#FFD700',
                icon: 'stun'
            },
            slow: {
                type: 'negative',
                category: 'debuff',
                maxStacks: 5,
                effect: (entity, stacks) => ({ moveSpeedMult: 1 - (0.1 * stacks), attackSpeedMult: 1 - (0.08 * stacks) }),
                color: '#4169E1',
                icon: 'slow'
            },
            bleed: {
                type: 'negative',
                category: 'dot',
                maxStacks: 10,
                tickInterval: 1000,
                effect: (entity, stacks, power) => ({ damagePerTick: (power || 8) * stacks, healingReduction: 0.5 }),
                color: '#8B0000',
                icon: 'bleed'
            },
            weakness: {
                type: 'negative',
                category: 'debuff',
                maxStacks: 5,
                effect: (entity, stacks) => ({ attackMult: 1 - (0.1 * stacks), defenseMult: 1 - (0.05 * stacks) }),
                color: '#696969',
                icon: 'weakness'
            },
            curse: {
                type: 'negative',
                category: 'debuff',
                maxStacks: 3,
                effect: (entity, stacks) => ({ allStatsMult: 1 - (0.1 * stacks), damageTakenMult: 1 + (0.15 * stacks) }),
                color: '#4B0082',
                icon: 'curse'
            },
            confusion: {
                type: 'negative',
                category: 'cc',
                maxStacks: 1,
                effect: (entity, stacks) => ({ accuracyMult: 0.5, movementReversed: true }),
                color: '#FF69B4',
                icon: 'confusion'
            }
        };
    }
    
    applyEffect(entityId, effectType, duration, power = 0, stacks = 1) {
        // Check immunity
        if (this.isImmune(entityId, effectType)) {
            return { success: false, reason: 'immune' };
        }
        
        const definition = this.effectDefinitions[effectType];
        if (!definition) return { success: false, reason: 'unknown_effect' };
        
        // Apply resistance
        const resistance = this.getResistance(entityId, effectType);
        const effectiveDuration = duration * (1 - resistance);
        const effectiveStacks = Math.max(1, Math.floor(stacks * (1 - resistance)));
        
        if (!this.activeEffects.has(entityId)) {
            this.activeEffects.set(entityId, []);
        }
        
        const effects = this.activeEffects.get(entityId);
        const existing = effects.find(e => e.type === effectType);
        
        if (existing) {
            // Stack or refresh
            existing.stacks = Math.min(definition.maxStacks, existing.stacks + effectiveStacks);
            existing.duration = Math.max(existing.duration, effectiveDuration);
            existing.power = Math.max(existing.power || 0, power);
        } else {
            // New effect
            effects.push({
                type: effectType,
                stacks: Math.min(definition.maxStacks, effectiveStacks),
                duration: effectiveDuration,
                maxDuration: effectiveDuration,
                power: power,
                appliedAt: Date.now(),
                lastTick: Date.now()
            });
        }
        
        // Visual & audio feedback
        this.showEffectApplied(entityId, effectType, definition);
        
        return { success: true, stacks: effectiveStacks, duration: effectiveDuration };
    }
    
    update(deltaTime) {
        const now = Date.now();
        
        for (const [entityId, effects] of this.activeEffects.entries()) {
            for (let i = effects.length - 1; i >= 0; i--) {
                const effect = effects[i];
                const definition = this.effectDefinitions[effect.type];
                
                // Update duration
                effect.duration -= deltaTime;
                
                // Handle DOT/HOT ticks
                if (definition.tickInterval) {
                    const timeSinceLastTick = now - effect.lastTick;
                    if (timeSinceLastTick >= definition.tickInterval) {
                        this.processEffectTick(entityId, effect, definition);
                        effect.lastTick = now;
                    }
                }
                
                // Remove expired effects
                if (effect.duration <= 0) {
                    this.removeEffect(entityId, effect.type);
                }
            }
        }
    }
    
    processEffectTick(entityId, effect, definition) {
        const effectResult = definition.effect(entityId, effect.stacks, effect.power);
        
        if (effectResult.damagePerTick) {
            this.combat?.takeDamage(entityId, effectResult.damagePerTick, {
                type: 'dot',
                source: effect.type
            });
            this.showDOTDamage(entityId, effectResult.damagePerTick, definition.color);
        }
        
        if (effectResult.healPerTick) {
            this.combat?.heal(entityId, effectResult.healPerTick);
            this.showHOTHealing(entityId, effectResult.healPerTick);
        }
    }
    
    removeEffect(entityId, effectType) {
        const effects = this.activeEffects.get(entityId);
        if (!effects) return;
        
        const index = effects.findIndex(e => e.type === effectType);
        if (index !== -1) {
            effects.splice(index, 1);
            this.showEffectRemoved(entityId, effectType);
        }
    }
    
    hasEffect(entityId, effectType) {
        const effects = this.activeEffects.get(entityId);
        return effects?.some(e => e.type === effectType) || false;
    }
    
    getEffect(entityId, effectType) {
        const effects = this.activeEffects.get(entityId);
        return effects?.find(e => e.type === effectType);
    }
    
    getEffects(entityId, category = null) {
        const effects = this.activeEffects.get(entityId) || [];
        if (category) {
            return effects.filter(e => this.effectDefinitions[e.type]?.category === category);
        }
        return effects;
    }
    
    cleanse(entityId, typeOrCategory = 'all') {
        const effects = this.activeEffects.get(entityId);
        if (!effects) return 0;
        
        let cleansedCount = 0;
        
        for (let i = effects.length - 1; i >= 0; i--) {
            const effect = effects[i];
            const definition = this.effectDefinitions[effect.type];
            
            const shouldCleanse = 
                typeOrCategory === 'all' ||
                effect.type === typeOrCategory ||
                definition.type === typeOrCategory ||
                definition.category === typeOrCategory;
            
            if (shouldCleanse) {
                effects.splice(i, 1);
                cleansedCount++;
                this.showEffectRemoved(entityId, effect.type);
            }
        }
        
        if (cleansedCount > 0) {
            this.audio?.playSFX('cleanse', 1.0);
            this.particles?.createEffect('cleanse', this.getEntityPosition(entityId));
        }
        
        return cleansedCount;
    }
    
    setImmunity(entityId, effectType, duration = null) {
        if (!this.immunities.has(entityId)) {
            this.immunities.set(entityId, new Map());
        }
        
        const immunityMap = this.immunities.get(entityId);
        immunityMap.set(effectType, duration ? Date.now() + duration : Infinity);
    }
    
    removeImmunity(entityId, effectType) {
        const immunityMap = this.immunities.get(entityId);
        if (immunityMap) {
            immunityMap.delete(effectType);
        }
    }
    
    isImmune(entityId, effectType) {
        const immunityMap = this.immunities.get(entityId);
        if (!immunityMap) return false;
        
        const immunityExpiry = immunityMap.get(effectType);
        if (immunityExpiry === undefined) return false;
        
        if (immunityExpiry !== Infinity && Date.now() > immunityExpiry) {
            immunityMap.delete(effectType);
            return false;
        }
        
        return true;
    }
    
    setResistance(entityId, effectType, resistancePercent) {
        if (!this.resistances.has(entityId)) {
            this.resistances.set(entityId, new Map());
        }
        
        this.resistances.get(entityId).set(effectType, resistancePercent);
    }
    
    getResistance(entityId, effectType) {
        return this.resistances.get(entityId)?.get(effectType) || 0;
    }
    
    getStatModifiers(entityId) {
        const modifiers = {
            moveSpeedMult: 1,
            attackSpeedMult: 1,
            attackMult: 1,
            defenseMult: 1,
            magicPowerMult: 1,
            critChanceBonus: 0,
            damageTakenMult: 1,
            healingReduction: 0,
            canAttack: true,
            canMove: true,
            canDodge: true
        };
        
        const effects = this.activeEffects.get(entityId) || [];
        
        for (const effect of effects) {
            const definition = this.effectDefinitions[effect.type];
            const effectResult = definition.effect(entityId, effect.stacks, effect.power);
            
            // Merge modifiers
            for (const [key, value] of Object.entries(effectResult)) {
                if (key.endsWith('Mult')) {
                    modifiers[key] *= value;
                } else if (key.endsWith('Bonus') || key.endsWith('Reduction')) {
                    modifiers[key] += value;
                } else if (typeof value === 'boolean') {
                    modifiers[key] = modifiers[key] && value;
                } else {
                    modifiers[key] = value;
                }
            }
        }
        
        return modifiers;
    }
    
    showEffectApplied(entityId, effectType, definition) {
        const position = this.getEntityPosition(entityId);
        
        // UI indicator
        this.ui?.addStatusIcon(entityId, effectType, definition.icon, definition.color);
        
        // Particle effect
        this.particles?.createEffect(effectType + '_applied', position, {
            color: definition.color
        });
        
        // Audio
        this.audio?.playSFX('status_applied', 0.7);
    }
    
    showEffectRemoved(entityId, effectType) {
        this.ui?.removeStatusIcon(entityId, effectType);
    }
    
    showDOTDamage(entityId, damage, color) {
        const position = this.getEntityPosition(entityId);
        this.ui?.showDamageNumber(position, damage, {
            type: 'dot',
            color: color
        });
    }
    
    showHOTHealing(entityId, amount) {
        const position = this.getEntityPosition(entityId);
        this.ui?.showDamageNumber(position, amount, {
            type: 'heal',
            color: '#00FF00'
        });
    }
    
    getEntityPosition(entityId) {
        // Get position from combat system or entity
        return this.combat?.getEntityPosition?.(entityId) || { x: 0, y: 0, z: 0 };
    }
    
    save(entityId) {
        const effects = this.activeEffects.get(entityId);
        if (!effects) return null;
        
        return effects.map(e => ({
            type: e.type,
            stacks: e.stacks,
            duration: e.duration,
            power: e.power
        }));
    }
    
    load(entityId, savedEffects) {
        if (!savedEffects) return;
        
        for (const saved of savedEffects) {
            this.applyEffect(entityId, saved.type, saved.duration, saved.power, saved.stacks);
        }
    }
}

// Export for use in other systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StatusEffectsEnhancedSystem;
}
