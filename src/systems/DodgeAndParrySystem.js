/**
 * DodgeAndParrySystem.js
 * Phase 5.1 - Dodge and Parry Combat System
 * Implements dodge rolls, parry mechanics, and stamina management
 * ~300 lines
 */

export class DodgeAndParrySystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.player = null;
        
        // Dodge mechanics
        this.dodgeConfig = {
            cooldown: 1000, // 1 second cooldown
            duration: 500, // 0.5 seconds dodge duration
            distance: 5, // Units to dodge
            staminaCost: 25,
            iFrames: 300 // Invincibility frames (ms)
        };
        
        // Parry mechanics
        this.parryConfig = {
            cooldown: 2000, // 2 seconds cooldown
            windowDuration: 200, // Perfect parry window
            staminaCost: 20,
            counterMultiplier: 2.0, // Damage multiplier on successful parry
            perfectWindowStart: 50, // Perfect parry starts 50ms into animation
            perfectWindowEnd: 150 // Perfect parry ends 150ms into animation
        };
        
        // Stamina system
        this.staminaConfig = {
            max: 100,
            current: 100,
            regenRate: 10, // per second
            regenDelay: 1500, // Delay after using stamina
            exhaustedThreshold: 10 // Below this, player is exhausted
        };
        
        // State tracking
        this.isDodging = false;
        this.isParrying = false;
        this.isExhausted = false;
        this.hasIFrames = false;
        this.lastDodgeTime = 0;
        this.lastParryTime = 0;
        this.lastStaminaUse = 0;
        this.dodgeDirection = { x: 0, z: 0 };
        this.dodgeStartTime = 0;
        this.parryStartTime = 0;
        
        logger.info('🛡️ DodgeAndParrySystem initialized');
    }
    
    /**
     * Initialize with player reference
     */
    init(player) {
        this.player = player;
        this.staminaConfig.current = this.staminaConfig.max;
    }
    
    /**
     * Attempt to dodge
     */
    dodge(directionX, directionZ) {
        const currentTime = Date.now();
        
        // Check cooldown
        if (currentTime - this.lastDodgeTime < this.dodgeConfig.cooldown) {
            return { success: false, reason: 'cooldown' };
        }
        
        // Check stamina
        if (this.staminaConfig.current < this.dodgeConfig.staminaCost) {
            return { success: false, reason: 'no_stamina' };
        }
        
        // Can't dodge while parrying
        if (this.isParrying) {
            return { success: false, reason: 'parrying' };
        }
        
        // Execute dodge
        this.isDodging = true;
        this.hasIFrames = true;
        this.dodgeStartTime = currentTime;
        this.dodgeEndTime = currentTime + this.dodgeConfig.duration;
        this.iFrameEndTime = currentTime + this.dodgeConfig.iFrames;
        this.lastDodgeTime = currentTime;
        
        // Normalize direction
        const length = Math.sqrt(directionX * directionX + directionZ * directionZ);
        if (length > 0) {
            this.dodgeDirection.x = (directionX / length) * this.dodgeConfig.distance;
            this.dodgeDirection.z = (directionZ / length) * this.dodgeConfig.distance;
        } else {
            // Default backward dodge if no direction
            this.dodgeDirection.x = 0;
            this.dodgeDirection.z = -this.dodgeConfig.distance;
        }
        
        // Consume stamina
        this.useStamina(this.dodgeConfig.staminaCost);
        
        logger.info('⚡ Dodge executed');
        return { success: true };
    }
    
    /**
     * Attempt to parry
     */
    parry() {
        const currentTime = Date.now();
        
        // Check cooldown
        if (currentTime - this.lastParryTime < this.parryConfig.cooldown) {
            return { success: false, reason: 'cooldown' };
        }
        
        // Check stamina
        if (this.staminaConfig.current < this.parryConfig.staminaCost) {
            return { success: false, reason: 'no_stamina' };
        }
        
        // Can't parry while dodging
        if (this.isDodging) {
            return { success: false, reason: 'dodging' };
        }
        
        // Execute parry
        this.isParrying = true;
        this.parryStartTime = currentTime;
        this.parryEndTime = currentTime + this.parryConfig.windowDuration;
        this.lastParryTime = currentTime;
        
        // Consume stamina
        this.useStamina(this.parryConfig.staminaCost);
        
        logger.info('🛡️ Parry initiated');
        return { success: true, parryWindow: this.parryConfig.windowDuration };
    }
    
    /**
     * Check if incoming attack is parried
     */
    checkParry(attackTime) {
        if (!this.isParrying) return { parried: false };
        
        const timeSinceParry = attackTime - this.parryStartTime;
        
        // Check if within parry window
        if (timeSinceParry <= this.parryConfig.windowDuration) {
            // Check if perfect parry
            const isPerfect = timeSinceParry >= this.parryConfig.perfectWindowStart &&
                            timeSinceParry <= this.parryConfig.perfectWindowEnd;
            
            logger.info(isPerfect ? '✨ Perfect parry!' : '🛡️ Parry successful');
            
            return {
                parried: true,
                perfect: isPerfect,
                counterMultiplier: isPerfect ? this.parryConfig.counterMultiplier * 1.5 : this.parryConfig.counterMultiplier
            };
        }
        
        return { parried: false };
    }
    
    /**
     * Use stamina
     */
    useStamina(amount) {
        this.staminaConfig.current = Math.max(0, this.staminaConfig.current - amount);
        this.lastStaminaUse = Date.now();
        
        // Check if exhausted
        if (this.staminaConfig.current <= this.staminaConfig.exhaustedThreshold) {
            this.isExhausted = true;
            logger.warn('💨 Player exhausted!');
        }
    }
    
    /**
     * Regenerate stamina
     */
    regenerateStamina(deltaTime) {
        const currentTime = Date.now();
        
        // Check regen delay
        if (currentTime - this.lastStaminaUse < this.staminaConfig.regenDelay) {
            return;
        }
        
        // Regenerate stamina
        const regenAmount = this.staminaConfig.regenRate * deltaTime;
        this.staminaConfig.current = Math.min(
            this.staminaConfig.max,
            this.staminaConfig.current + regenAmount
        );
        
        // Clear exhausted state
        if (this.staminaConfig.current > this.staminaConfig.exhaustedThreshold) {
            this.isExhausted = false;
        }
    }
    
    /**
     * Check if player has invincibility frames
     */
    hasInvincibilityFrames() {
        return this.hasIFrames;
    }
    
    /**
     * Get current stamina percentage
     */
    getStaminaPercentage() {
        return (this.staminaConfig.current / this.staminaConfig.max) * 100;
    }
    
    /**
     * Update system
     */
    update(deltaTime) {
        const currentTime = Date.now();
        
        // Check and end dodge
        if (this.isDodging && currentTime >= this.dodgeEndTime) {
            this.isDodging = false;
        }
        
        // Check and end i-frames
        if (this.hasIFrames && currentTime >= this.iFrameEndTime) {
            this.hasIFrames = false;
        }
        
        // Check and end parry
        if (this.isParrying && currentTime >= this.parryEndTime) {
            this.isParrying = false;
        }
        
        // Update dodge movement
        if (this.isDodging && this.player) {
            const progress = (currentTime - this.dodgeStartTime) / this.dodgeConfig.duration;
            if (progress <= 1.0) {
                // Apply dodge movement (eased)
                const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
                const moveAmount = 1 - easeProgress;
                
                this.player.mesh.position.x += this.dodgeDirection.x * deltaTime * moveAmount;
                this.player.mesh.position.z += this.dodgeDirection.z * deltaTime * moveAmount;
            }
        }
        
        // Regenerate stamina
        this.regenerateStamina(deltaTime);
    }
    
    /**
     * Get system state for UI
     */
    getState() {
        return {
            stamina: this.staminaConfig.current,
            staminaMax: this.staminaConfig.max,
            staminaPercent: this.getStaminaPercentage(),
            isDodging: this.isDodging,
            isParrying: this.isParrying,
            isExhausted: this.isExhausted,
            hasIFrames: this.hasIFrames,
            canDodge: Date.now() - this.lastDodgeTime >= this.dodgeConfig.cooldown,
            canParry: Date.now() - this.lastParryTime >= this.parryConfig.cooldown
        };
    }
}
