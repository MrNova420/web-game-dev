/**
 * DodgeRollParrySystem - Advanced evasion and defense mechanics
 * Handles dodge rolls with i-frames, perfect dodge, parry, counterattack
 */

class DodgeRollParrySystem {
    constructor(characterController, combatSystem, audioSystem, particleSystem) {
        this.controller = characterController;
        this.combat = combatSystem;
        this.audio = audioSystem;
        this.particles = particleSystem;
        
        this.entityStates = new Map(); // entityId -> state
        this.iFrames = new Map(); // entityId -> expiry timestamp
        this.parryWindows = new Map(); // entityId -> expiry timestamp
        
        this.config = {
            dodge: {
                staminaCost: 25,
                cooldown: 1000, // 1s
                iFrameDuration: 500, // 0.5s
                perfectDodgeWindow: 150, // 150ms
                distance: 5, // Units
                speed: 10 // Units per second
            },
            parry: {
                window: 300, // 300ms timing window
                perfectWindow: 100, // 100ms for perfect parry
                staminaCost: 15,
                cooldown: 2000, // 2s
                reflectDamagePercent: 0.5,
                stunDuration: 1500, // 1.5s stun on perfect parry
                counterMultiplier: 2.0
            },
            stamina: {
                max: 100,
                regenRate: 10, // per second
                regenDelay: 1000 // 1s delay after using stamina
            }
        };
    }
    
    initializeEntity(entityId, maxStamina = 100) {
        this.entityStates.set(entityId, {
            stamina: maxStamina,
            maxStamina: maxStamina,
            lastStaminaUse: 0,
            lastDodge: 0,
            lastParry: 0,
            isDodging: false,
            isParrying: false,
            dodgeDirection: null
        });
    }
    
    update(deltaTime) {
        const now = Date.now();
        
        // Update stamina regeneration
        for (const [entityId, state] of this.entityStates.entries()) {
            const timeSinceLastUse = now - state.lastStaminaUse;
            
            if (timeSinceLastUse >= this.config.stamina.regenDelay && state.stamina < state.maxStamina) {
                const regen = (this.config.stamina.regenRate * deltaTime) / 1000;
                state.stamina = Math.min(state.maxStamina, state.stamina + regen);
            }
        }
        
        // Clean up expired i-frames
        for (const [entityId, expiry] of this.iFrames.entries()) {
            if (now > expiry) {
                this.iFrames.delete(entityId);
            }
        }
        
        // Clean up expired parry windows
        for (const [entityId, expiry] of this.parryWindows.entries()) {
            if (now > expiry) {
                this.parryWindows.delete(entityId);
                const state = this.entityStates.get(entityId);
                if (state) state.isParrying = false;
            }
        }
    }
    
    dodge(entityId, direction = 'back') {
        const state = this.entityStates.get(entityId);
        if (!state) {
            this.initializeEntity(entityId);
            return this.dodge(entityId, direction);
        }
        
        const now = Date.now();
        
        // Check cooldown
        if (now - state.lastDodge < this.config.dodge.cooldown) {
            return { success: false, reason: 'cooldown' };
        }
        
        // Check if entity is stunned or frozen
        if (!this.canDodge(entityId)) {
            return { success: false, reason: 'disabled' };
        }
        
        // Perfect dodge - no stamina cost if timed perfectly
        const isPerfectDodge = this.checkPerfectDodgeTiming(entityId);
        
        // Check stamina
        if (!isPerfectDodge && state.stamina < this.config.dodge.staminaCost) {
            return { success: false, reason: 'no_stamina' };
        }
        
        // Consume stamina (unless perfect dodge)
        if (!isPerfectDodge) {
            state.stamina -= this.config.dodge.staminaCost;
            state.lastStaminaUse = now;
        }
        
        // Perform dodge
        state.lastDodge = now;
        state.isDodging = true;
        state.dodgeDirection = direction;
        
        // Grant i-frames
        const iFrameDuration = isPerfectDodge ? 
            this.config.dodge.iFrameDuration * 1.5 : 
            this.config.dodge.iFrameDuration;
        this.iFrames.set(entityId, now + iFrameDuration);
        
        // Move character
        this.performDodgeMovement(entityId, direction);
        
        // Visual and audio feedback
        this.showDodgeEffect(entityId, direction, isPerfectDodge);
        
        // Reset dodge state after animation
        setTimeout(() => {
            state.isDodging = false;
        }, 500);
        
        return {
            success: true,
            isPerfect: isPerfectDodge,
            stamina: state.stamina,
            iFrameDuration: iFrameDuration
        };
    }
    
    parry(entityId, attackerId, damage) {
        const state = this.entityStates.get(entityId);
        if (!state) {
            this.initializeEntity(entityId);
            return this.parry(entityId, attackerId, damage);
        }
        
        const now = Date.now();
        
        // Check cooldown
        if (now - state.lastParry < this.config.parry.cooldown) {
            return { success: false, reason: 'cooldown' };
        }
        
        // Check if can parry
        if (!this.canParry(entityId)) {
            return { success: false, reason: 'disabled' };
        }
        
        // Check stamina
        if (state.stamina < this.config.parry.staminaCost) {
            return { success: false, reason: 'no_stamina' };
        }
        
        // Check if within parry window (must be activated before attack)
        const parryExpiry = this.parryWindows.get(entityId);
        if (!parryExpiry || now > parryExpiry) {
            return { success: false, reason: 'no_parry_window' };
        }
        
        // Consume stamina
        state.stamina -= this.config.parry.staminaCost;
        state.lastStaminaUse = now;
        state.lastParry = now;
        
        // Check if perfect parry
        const timeInWindow = parryExpiry - now;
        const isPerfectParry = timeInWindow >= (this.config.parry.window - this.config.parry.perfectWindow);
        
        // Calculate reflected damage
        const reflectedDamage = Math.floor(damage * this.config.parry.reflectDamagePercent);
        
        if (isPerfectParry) {
            // Perfect parry: reflect damage and stun attacker
            this.combat?.takeDamage(attackerId, reflectedDamage, {
                type: 'reflected',
                source: entityId
            });
            
            this.combat?.applyStatusEffect(attackerId, 'stun', this.config.parry.stunDuration);
            
            // Enable counterattack
            this.enableCounterattack(entityId, attackerId);
        }
        
        // Visual and audio feedback
        this.showParryEffect(entityId, attackerId, isPerfectParry);
        
        // Clean up parry window
        this.parryWindows.delete(entityId);
        state.isParrying = false;
        
        return {
            success: true,
            isPerfect: isPerfectParry,
            reflectedDamage: reflectedDamage,
            stunned: isPerfectParry,
            stamina: state.stamina
        };
    }
    
    startParryWindow(entityId) {
        const state = this.entityStates.get(entityId);
        if (!state) return false;
        
        const now = Date.now();
        
        // Check cooldown
        if (now - state.lastParry < this.config.parry.cooldown) {
            return false;
        }
        
        // Start parry window
        this.parryWindows.set(entityId, now + this.config.parry.window);
        state.isParrying = true;
        
        // Visual indicator
        this.showParryWindow(entityId);
        
        return true;
    }
    
    enableCounterattack(entityId, targetId) {
        // Allow a counterattack with bonus damage
        if (this.combat) {
            const counterCallback = () => {
                const baseDamage = this.combat.getEntityAttackDamage(entityId);
                const counterDamage = baseDamage * this.config.parry.counterMultiplier;
                
                this.combat.attack(entityId, targetId, {
                    damage: counterDamage,
                    type: 'counter',
                    ignoreDefense: true
                });
            };
            
            // Give 1 second window for counterattack
            setTimeout(() => {
                // Counterattack window expired
            }, 1000);
            
            this.audio?.playSFX('counter_ready', 1.0);
        }
    }
    
    performDodgeMovement(entityId, direction) {
        const distance = this.config.dodge.distance;
        const position = this.getEntityPosition(entityId);
        const facing = this.getEntityFacing(entityId);
        
        let targetX = position.x;
        let targetZ = position.z;
        
        switch (direction) {
            case 'forward':
                targetX += Math.cos(facing) * distance;
                targetZ += Math.sin(facing) * distance;
                break;
            case 'back':
                targetX -= Math.cos(facing) * distance;
                targetZ -= Math.sin(facing) * distance;
                break;
            case 'left':
                targetX += Math.cos(facing - Math.PI / 2) * distance;
                targetZ += Math.sin(facing - Math.PI / 2) * distance;
                break;
            case 'right':
                targetX += Math.cos(facing + Math.PI / 2) * distance;
                targetZ += Math.sin(facing + Math.PI / 2) * distance;
                break;
        }
        
        // Move entity
        this.controller?.moveEntity(entityId, { x: targetX, y: position.y, z: targetZ }, this.config.dodge.speed);
    }
    
    checkPerfectDodgeTiming(entityId) {
        // Check if there's an incoming attack within perfect dodge window
        // This would integrate with combat system to check for imminent attacks
        return false; // Placeholder
    }
    
    canDodge(entityId) {
        // Check if entity can dodge (not stunned, frozen, etc.)
        return !this.combat?.hasStatusEffect(entityId, 'stun') &&
               !this.combat?.hasStatusEffect(entityId, 'freeze');
    }
    
    canParry(entityId) {
        // Check if entity can parry
        return !this.combat?.hasStatusEffect(entityId, 'stun') &&
               !this.combat?.hasStatusEffect(entityId, 'freeze') &&
               !this.combat?.hasStatusEffect(entityId, 'confusion');
    }
    
    hasIFrames(entityId) {
        const expiry = this.iFrames.get(entityId);
        return expiry && Date.now() < expiry;
    }
    
    getStamina(entityId) {
        const state = this.entityStates.get(entityId);
        return state ? state.stamina : 0;
    }
    
    setStamina(entityId, value) {
        const state = this.entityStates.get(entityId);
        if (state) {
            state.stamina = Math.max(0, Math.min(state.maxStamina, value));
        }
    }
    
    showDodgeEffect(entityId, direction, isPerfect) {
        const position = this.getEntityPosition(entityId);
        
        // Trail effect
        this.particles?.createEffect('dodge_trail', position, {
            direction: direction,
            color: isPerfect ? '#FFD700' : '#FFFFFF'
        });
        
        // Audio
        const sound = isPerfect ? 'dodge_perfect' : 'dodge';
        this.audio?.playSFX(sound, 1.0);
        
        if (isPerfect) {
            this.audio?.playSFX('perfect_timing', 0.7);
        }
    }
    
    showParryEffect(entityId, attackerId, isPerfect) {
        const position = this.getEntityPosition(entityId);
        const attackerPos = this.getEntityPosition(attackerId);
        
        // Spark effect at parry point
        this.particles?.createEffect('parry_spark', position, {
            color: isPerfect ? '#FFD700' : '#FFFFFF',
            intensity: isPerfect ? 2.0 : 1.0
        });
        
        // Audio
        const sound = isPerfect ? 'parry_perfect' : 'parry';
        this.audio?.playSFX(sound, 1.0);
        
        if (isPerfect) {
            this.audio?.playSFX('perfect_timing', 0.7);
        }
    }
    
    showParryWindow(entityId) {
        // Visual indicator that parry window is active
        const position = this.getEntityPosition(entityId);
        this.particles?.createEffect('parry_ready', position, {
            duration: this.config.parry.window
        });
    }
    
    getEntityPosition(entityId) {
        return this.controller?.getEntityPosition?.(entityId) || { x: 0, y: 0, z: 0 };
    }
    
    getEntityFacing(entityId) {
        return this.controller?.getEntityFacing?.(entityId) || 0;
    }
}

// Export for use in other systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DodgeRollParrySystem;
}
