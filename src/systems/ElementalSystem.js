/**
 * ElementalSystem - Comprehensive elemental damage and interaction system
 * Manages elemental types, resistances, weaknesses, and reactions
 * Part of Phase 2: Advanced Combat Systems
 */

class ElementalSystem {
    constructor(combatSystem, particleSystem, audioSystem) {
        this.combatSystem = combatSystem;
        this.particleSystem = particleSystem;
        this.audioSystem = audioSystem;
        
        this.elements = this.initializeElements();
        this.elementalChart = this.initializeElementalChart();
        this.reactions = this.initializeReactions();
        this.activeAuras = new Map(); // entityId -> aura data
        this.elementalStates = new Map(); // entityId -> elemental state
    }
    
    initializeElements() {
        return {
            physical: {
                name: 'Physical',
                color: '#808080',
                description: 'Raw physical damage',
                icon: 'sword'
            },
            fire: {
                name: 'Fire',
                color: '#ff4400',
                description: 'Burns enemies and ignites objects',
                icon: 'flame',
                dotEffect: 'burn'
            },
            ice: {
                name: 'Ice',
                color: '#00ddff',
                description: 'Freezes enemies and slows movement',
                icon: 'snowflake',
                statusEffect: 'frozen',
                slowAmount: 0.5
            },
            lightning: {
                name: 'Lightning',
                color: '#ffff00',
                description: 'Chains between targets and stuns',
                icon: 'bolt',
                statusEffect: 'stunned',
                chainCount: 3,
                chainRange: 5
            },
            earth: {
                name: 'Earth',
                color: '#8b4513',
                description: 'Heavy damage with knockback',
                icon: 'mountain',
                knockbackMultiplier: 1.5
            },
            wind: {
                name: 'Wind',
                color: '#99ff99',
                description: 'Light, fast attacks with knockback',
                icon: 'wind',
                speedBonus: 1.3
            },
            water: {
                name: 'Water',
                color: '#0088ff',
                description: 'Heals and cleanses status effects',
                icon: 'droplet',
                healingMultiplier: 1.0
            },
            light: {
                name: 'Light',
                color: '#ffffdd',
                description: 'Holy damage effective vs undead/dark',
                icon: 'sun',
                vsUndead: 2.0,
                vsDark: 1.5
            },
            dark: {
                name: 'Dark',
                color: '#330033',
                description: 'Corrupts and drains life',
                icon: 'moon',
                lifeDrain: 0.2,
                corruptionChance: 0.3
            },
            poison: {
                name: 'Poison',
                color: '#00ff00',
                description: 'Deals damage over time',
                icon: 'skull',
                dotEffect: 'poison',
                dotDuration: 10000
            }
        };
    }
    
    initializeElementalChart() {
        // Damage multipliers: attacker element -> defender element
        return {
            fire: {
                fire: 0.5,      // Weak vs fire
                ice: 2.0,       // Strong vs ice
                water: 0.5,     // Weak vs water
                earth: 1.0,
                wind: 1.5,
                lightning: 1.0,
                light: 1.0,
                dark: 1.0,
                physical: 1.0,
                poison: 1.0
            },
            ice: {
                fire: 0.5,
                ice: 0.5,
                water: 1.5,
                earth: 1.0,
                wind: 0.75,
                lightning: 1.0,
                light: 1.0,
                dark: 1.0,
                physical: 1.0,
                poison: 1.5
            },
            lightning: {
                fire: 1.0,
                ice: 1.5,
                water: 2.0,
                earth: 0.5,
                wind: 1.5,
                lightning: 0.5,
                light: 1.0,
                dark: 1.5,
                physical: 1.0,
                poison: 1.0
            },
            water: {
                fire: 2.0,
                ice: 1.0,
                water: 0.5,
                earth: 1.5,
                wind: 1.0,
                lightning: 0.5,
                light: 1.0,
                dark: 1.0,
                physical: 1.0,
                poison: 0.75
            },
            earth: {
                fire: 1.0,
                ice: 1.0,
                water: 0.75,
                earth: 0.5,
                wind: 0.5,
                lightning: 2.0,
                light: 1.0,
                dark: 1.0,
                physical: 1.5,
                poison: 1.0
            },
            wind: {
                fire: 1.5,
                ice: 1.0,
                water: 1.0,
                earth: 2.0,
                wind: 0.5,
                lightning: 1.0,
                light: 1.0,
                dark: 1.0,
                physical: 1.0,
                poison: 1.5
            },
            light: {
                fire: 1.0,
                ice: 1.0,
                water: 1.0,
                earth: 1.0,
                wind: 1.0,
                lightning: 1.0,
                light: 0.5,
                dark: 2.5,
                physical: 1.0,
                poison: 1.5
            },
            dark: {
                fire: 1.0,
                ice: 1.0,
                water: 1.0,
                earth: 1.0,
                wind: 1.0,
                lightning: 1.0,
                light: 0.5,
                dark: 0.5,
                physical: 1.0,
                poison: 1.5
            },
            poison: {
                fire: 1.0,
                ice: 0.75,
                water: 1.5,
                earth: 1.0,
                wind: 0.75,
                lightning: 1.0,
                light: 0.5,
                dark: 1.5,
                physical: 1.0,
                poison: 0.5
            },
            physical: {
                fire: 1.0,
                ice: 1.0,
                water: 1.0,
                earth: 0.75,
                wind: 1.0,
                lightning: 1.0,
                light: 1.0,
                dark: 1.0,
                physical: 1.0,
                poison: 1.0
            }
        };
    }
    
    initializeReactions() {
        // Elemental reactions when two elements combine
        return {
            'fire+ice': {
                name: 'Steam Explosion',
                effect: 'aoe_damage',
                multiplier: 1.5,
                radius: 5,
                particle: 'steam'
            },
            'fire+water': {
                name: 'Steam',
                effect: 'obscure_vision',
                duration: 3000,
                particle: 'steam'
            },
            'fire+wind': {
                name: 'Inferno',
                effect: 'amplified_fire',
                multiplier: 1.8,
                particle: 'tornado_fire'
            },
            'ice+water': {
                name: 'Blizzard',
                effect: 'aoe_freeze',
                radius: 6,
                duration: 2000,
                particle: 'blizzard'
            },
            'ice+wind': {
                name: 'Frost Storm',
                effect: 'slow_aoe',
                radius: 8,
                slowAmount: 0.7,
                duration: 4000,
                particle: 'frost_storm'
            },
            'lightning+water': {
                name: 'Electrocution',
                effect: 'chain_lightning',
                multiplier: 2.0,
                chainCount: 5,
                particle: 'electric_water'
            },
            'lightning+wind': {
                name: 'Thunderstorm',
                effect: 'random_strikes',
                strikeCount: 5,
                radius: 10,
                particle: 'lightning_storm'
            },
            'earth+water': {
                name: 'Mud Trap',
                effect: 'immobilize',
                duration: 3000,
                particle: 'mud'
            },
            'light+dark': {
                name: 'Void Rift',
                effect: 'damage_amplify',
                multiplier: 3.0,
                duration: 2000,
                particle: 'void_explosion'
            },
            'poison+fire': {
                name: 'Toxic Fumes',
                effect: 'poison_aoe',
                radius: 7,
                duration: 8000,
                particle: 'toxic_cloud'
            }
        };
    }
    
    calculateElementalDamage(attackerElement, defenderElement, baseDamage) {
        const multiplier = this.elementalChart[attackerElement]?.[defenderElement] || 1.0;
        return {
            damage: baseDamage * multiplier,
            multiplier: multiplier,
            effective: multiplier > 1.0,
            resisted: multiplier < 1.0
        };
    }
    
    applyElementalAttack(attackerId, targetId, element, baseDamage) {
        // Get target's elemental resistance
        const targetElement = this.getEntityElement(targetId);
        const damageCalc = this.calculateElementalDamage(element, targetElement, baseDamage);
        
        // Apply damage
        this.combatSystem.dealDamage(attackerId, targetId, damageCalc.damage);
        
        // Apply elemental effects
        this.applyElementalEffect(targetId, element, damageCalc.damage);
        
        // Check for elemental reaction
        this.checkElementalReaction(targetId, element);
        
        // Visual and audio feedback
        this.playElementalEffect(targetId, element, damageCalc.effective, damageCalc.resisted);
        
        return damageCalc;
    }
    
    applyElementalEffect(targetId, element, damage) {
        const elementData = this.elements[element];
        if (!elementData) return;
        
        // Apply DOT effects
        if (elementData.dotEffect) {
            const dotDamage = damage * 0.1;
            const duration = elementData.dotDuration || 5000;
            this.combatSystem.applyStatusEffect(targetId, elementData.dotEffect, duration, dotDamage);
        }
        
        // Apply status effects
        if (elementData.statusEffect) {
            this.combatSystem.applyStatusEffect(targetId, elementData.statusEffect, 2000);
        }
        
        // Special effects
        switch (element) {
            case 'lightning':
                this.chainLightning(targetId, damage, elementData.chainCount, elementData.chainRange);
                break;
            case 'earth':
                this.combatSystem.applyKnockback(targetId, null, 3 * elementData.knockbackMultiplier);
                break;
            case 'dark':
                const lifeDrain = damage * elementData.lifeDrain;
                // Would heal attacker here
                break;
        }
    }
    
    chainLightning(originId, baseDamage, maxChains, range) {
        const position = this.combatSystem.getPosition(originId);
        const targets = this.combatSystem.getEnemiesInRadius(position, range);
        
        let currentDamage = baseDamage * 0.7; // Each chain does 70% of previous
        let chainedTargets = [originId];
        
        for (let i = 0; i < Math.min(maxChains, targets.length); i++) {
            // Find nearest unchained target
            const nextTarget = targets.find(t => !chainedTargets.includes(t));
            if (!nextTarget) break;
            
            this.combatSystem.dealDamage(null, nextTarget, currentDamage);
            chainedTargets.push(nextTarget);
            
            // Visual chain effect
            if (this.particleSystem) {
                const from = this.combatSystem.getPosition(chainedTargets[chainedTargets.length - 2]);
                const to = this.combatSystem.getPosition(nextTarget);
                this.particleSystem.createLightningBolt(from, to);
            }
            
            currentDamage *= 0.7;
        }
    }
    
    checkElementalReaction(targetId, newElement) {
        const currentState = this.elementalStates.get(targetId);
        if (!currentState) {
            // Set new elemental state
            this.elementalStates.set(targetId, {
                element: newElement,
                timestamp: Date.now()
            });
            return null;
        }
        
        // Check if reaction can occur (within time window)
        const timeDiff = Date.now() - currentState.timestamp;
        if (timeDiff > 3000) {
            // Update to new element
            this.elementalStates.set(targetId, {
                element: newElement,
                timestamp: Date.now()
            });
            return null;
        }
        
        // Try to trigger reaction
        const reactionKey1 = `${currentState.element}+${newElement}`;
        const reactionKey2 = `${newElement}+${currentState.element}`;
        const reaction = this.reactions[reactionKey1] || this.reactions[reactionKey2];
        
        if (reaction) {
            this.triggerReaction(targetId, reaction);
            this.elementalStates.delete(targetId); // Clear state after reaction
            return reaction;
        }
        
        return null;
    }
    
    triggerReaction(targetId, reaction) {
        const position = this.combatSystem.getPosition(targetId);
        
        // Play reaction effect
        if (this.particleSystem) {
            this.particleSystem.createEffect(reaction.particle, position, {
                scale: 1.5,
                duration: 2000
            });
        }
        
        if (this.audioSystem) {
            this.audioSystem.playSFX('elemental_reaction', 1.5);
        }
        
        // Apply reaction effect
        switch (reaction.effect) {
            case 'aoe_damage':
                const targets = this.combatSystem.getEnemiesInRadius(position, reaction.radius);
                targets.forEach(id => {
                    const damage = this.combatSystem.getBaseDamage(targetId) * reaction.multiplier;
                    this.combatSystem.dealDamage(null, id, damage);
                });
                break;
                
            case 'aoe_freeze':
                const freezeTargets = this.combatSystem.getEnemiesInRadius(position, reaction.radius);
                freezeTargets.forEach(id => {
                    this.combatSystem.applyStatusEffect(id, 'frozen', reaction.duration);
                });
                break;
                
            case 'slow_aoe':
                const slowTargets = this.combatSystem.getEnemiesInRadius(position, reaction.radius);
                slowTargets.forEach(id => {
                    this.combatSystem.applyStatusEffect(id, 'slow', reaction.duration, reaction.slowAmount);
                });
                break;
                
            case 'chain_lightning':
                this.chainLightning(targetId, 
                    this.combatSystem.getBaseDamage(targetId) * reaction.multiplier, 
                    reaction.chainCount, 10);
                break;
                
            case 'immobilize':
                this.combatSystem.applyStatusEffect(targetId, 'immobilized', reaction.duration);
                break;
        }
    }
    
    createElementalAura(entityId, element, radius, duration) {
        this.activeAuras.set(entityId, {
            element: element,
            radius: radius,
            duration: duration,
            startTime: Date.now()
        });
        
        // Visual aura effect
        if (this.particleSystem) {
            this.particleSystem.createAura(entityId, element, radius);
        }
    }
    
    getEntityElement(entityId) {
        // Get entity's elemental affinity/resistance
        // Would integrate with entity stats system
        return 'physical'; // Default
    }
    
    playElementalEffect(targetId, element, effective, resisted) {
        if (!this.particleSystem || !this.audioSystem) return;
        
        const position = this.combatSystem.getPosition(targetId);
        const elementData = this.elements[element];
        
        // Particle effect
        this.particleSystem.createEffect(`elemental_${element}`, position, {
            color: elementData.color,
            scale: effective ? 1.5 : (resisted ? 0.7 : 1.0)
        });
        
        // Sound effect
        const volume = effective ? 1.2 : (resisted ? 0.8 : 1.0);
        this.audioSystem.playSFX(`element_${element}`, volume);
    }
    
    update(deltaTime) {
        const now = Date.now();
        
        // Update elemental states (decay over time)
        for (const [entityId, state] of this.elementalStates.entries()) {
            if (now - state.timestamp > 3000) {
                this.elementalStates.delete(entityId);
            }
        }
        
        // Update auras
        for (const [entityId, aura] of this.activeAuras.entries()) {
            if (now - aura.startTime > aura.duration) {
                this.activeAuras.delete(entityId);
            } else {
                // Apply aura effects to nearby entities
                const position = this.combatSystem.getPosition(entityId);
                const nearby = this.combatSystem.getEnemiesInRadius(position, aura.radius);
                nearby.forEach(id => {
                    // Apply weak elemental damage per tick
                    this.applyElementalAttack(entityId, id, aura.element, 5 * (deltaTime / 1000));
                });
            }
        }
    }
}

export default ElementalSystem;
