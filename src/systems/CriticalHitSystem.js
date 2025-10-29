/**
 * CriticalHitSystem - Advanced critical hit mechanics
 * Handles crit chance, crit damage, crit types, backstab, headshot bonuses
 */

class CriticalHitSystem {
    constructor(combatSystem, cameraSystem, uiSystem, audioSystem, particleSystem) {
        this.combat = combatSystem;
        this.camera = cameraSystem;
        this.ui = uiSystem;
        this.audio = audioSystem;
        this.particles = particleSystem;
        
        this.baseCritChance = 0.05; // 5%
        this.baseCritMultiplier = 1.5;
        
        this.critModifiers = new Map(); // entityId -> modifiers
        this.critStreaks = new Map(); // entityId -> consecutive crits
        this.nonCritCounters = new Map(); // entityId -> non-crits since last crit
        this.critStats = new Map(); // entityId -> stats
        
        this.critTypes = {
            normal: { name: 'Critical Hit', multiplier: 1.5, color: '#FFFF00', chance: 0.70 },
            strong: { name: 'Strong Critical', multiplier: 2.0, color: '#FF8800', chance: 0.20 },
            deadly: { name: 'Deadly Critical', multiplier: 2.5, color: '#FF4400', chance: 0.08 },
            legendary: { name: 'Legendary Critical', multiplier: 3.0, color: '#FF0000', chance: 0.02 }
        };
    }
    
    calculateCritical(attackerId, baseDamage, options = {}) {
        const {
            isBackstab = false,
            isHeadshot = false,
            targetId = null,
            ignoreModifiers = false
        } = options;
        
        // Calculate crit chance
        let critChance = this.baseCritChance;
        
        if (!ignoreModifiers) {
            const modifiers = this.getCritModifiers(attackerId);
            critChance += modifiers.critChanceBonus;
        }
        
        // Lucky strike system (guaranteed crit after X non-crits)
        const nonCritCount = this.nonCritCounters.get(attackerId) || 0;
        const luckyStrikeThreshold = 20;
        
        if (nonCritCount >= luckyStrikeThreshold) {
            critChance = 1.0; // Guaranteed crit
        }
        
        // Roll for crit
        const critRoll = Math.random();
        const isCritical = critRoll < critChance;
        
        if (!isCritical) {
            // Not a crit
            this.nonCritCounters.set(attackerId, nonCritCount + 1);
            this.resetCritStreak(attackerId);
            return {
                isCritical: false,
                damage: baseDamage,
                multiplier: 1.0
            };
        }
        
        // It's a crit! Determine type
        const critType = this.determineCritType();
        let critMultiplier = critType.multiplier;
        
        // Apply modifiers
        if (!ignoreModifiers) {
            const modifiers = this.getCritModifiers(attackerId);
            critMultiplier *= modifiers.critDamageMult;
        }
        
        // Backstab bonus
        if (isBackstab) {
            critMultiplier *= 2.0;
        }
        
        // Headshot bonus
        if (isHeadshot) {
            critMultiplier *= 2.5;
        }
        
        // Calculate final damage
        const critDamage = Math.floor(baseDamage * critMultiplier);
        
        // Update stats and streaks
        this.nonCritCounters.set(attackerId, 0);
        this.incrementCritStreak(attackerId);
        this.updateCritStats(attackerId, critType.name, critDamage);
        
        // Visual and audio feedback
        this.showCriticalHit(attackerId, targetId, critDamage, critType, isBackstab, isHeadshot);
        
        return {
            isCritical: true,
            type: critType.name,
            damage: critDamage,
            multiplier: critMultiplier,
            isBackstab: isBackstab,
            isHeadshot: isHeadshot,
            streak: this.getCritStreak(attackerId)
        };
    }
    
    determineCritType() {
        const roll = Math.random();
        let cumulative = 0;
        
        // Check from legendary -> normal
        const types = Object.values(this.critTypes).reverse();
        
        for (const type of types) {
            cumulative += type.chance;
            if (roll < cumulative) {
                return type;
            }
        }
        
        // Fallback to normal
        return this.critTypes.normal;
    }
    
    checkBackstab(attackerId, targetId) {
        // Check if attacker is behind target
        const attackerPos = this.getEntityPosition(attackerId);
        const targetPos = this.getEntityPosition(targetId);
        const targetFacing = this.getEntityFacing(targetId);
        
        if (!attackerPos || !targetPos || !targetFacing) return false;
        
        // Calculate angle between target facing and direction to attacker
        const dx = attackerPos.x - targetPos.x;
        const dz = attackerPos.z - targetPos.z;
        const angleToAttacker = Math.atan2(dz, dx);
        
        const angleDiff = Math.abs(angleToAttacker - targetFacing);
        const normalizedAngle = ((angleDiff + Math.PI) % (Math.PI * 2)) - Math.PI;
        
        // Within 60 degrees behind target
        return Math.abs(normalizedAngle) > (2 * Math.PI / 3);
    }
    
    checkHeadshot(attackerId, targetId, hitPosition) {
        // Check if hit was on target's head
        const targetPos = this.getEntityPosition(targetId);
        if (!targetPos || !hitPosition) return false;
        
        // Simple check: hit was 1.5-2.0 units above target center (head height)
        const heightDiff = hitPosition.y - targetPos.y;
        return heightDiff >= 1.5 && heightDiff <= 2.0;
    }
    
    setCritModifiers(entityId, modifiers = {}) {
        this.critModifiers.set(entityId, {
            critChanceBonus: modifiers.critChanceBonus || 0,
            critDamageMult: modifiers.critDamageMult || 1.0
        });
    }
    
    getCritModifiers(entityId) {
        return this.critModifiers.get(entityId) || {
            critChanceBonus: 0,
            critDamageMult: 1.0
        };
    }
    
    addCritChanceBonus(entityId, bonus) {
        const modifiers = this.getCritModifiers(entityId);
        modifiers.critChanceBonus += bonus;
        this.critModifiers.set(entityId, modifiers);
    }
    
    addCritDamageMultiplier(entityId, mult) {
        const modifiers = this.getCritModifiers(entityId);
        modifiers.critDamageMult *= mult;
        this.critModifiers.set(entityId, modifiers);
    }
    
    incrementCritStreak(entityId) {
        const streak = this.critStreaks.get(entityId) || 0;
        this.critStreaks.set(entityId, streak + 1);
    }
    
    resetCritStreak(entityId) {
        this.critStreaks.set(entityId, 0);
    }
    
    getCritStreak(entityId) {
        return this.critStreaks.get(entityId) || 0;
    }
    
    updateCritStats(entityId, critType, damage) {
        if (!this.critStats.has(entityId)) {
            this.critStats.set(entityId, {
                totalCrits: 0,
                critsByType: {},
                totalCritDamage: 0,
                highestCrit: 0,
                longestStreak: 0
            });
        }
        
        const stats = this.critStats.get(entityId);
        stats.totalCrits++;
        stats.critsByType[critType] = (stats.critsByType[critType] || 0) + 1;
        stats.totalCritDamage += damage;
        stats.highestCrit = Math.max(stats.highestCrit, damage);
        stats.longestStreak = Math.max(stats.longestStreak, this.getCritStreak(entityId));
    }
    
    getCritStats(entityId) {
        return this.critStats.get(entityId) || {
            totalCrits: 0,
            critsByType: {},
            totalCritDamage: 0,
            highestCrit: 0,
            longestStreak: 0
        };
    }
    
    showCriticalHit(attackerId, targetId, damage, critType, isBackstab, isHeadshot) {
        const position = this.getEntityPosition(targetId);
        
        // Damage number
        this.ui?.showDamageNumber(position, damage, {
            type: 'critical',
            critType: critType.name,
            color: critType.color,
            scale: 1.5 + (critType.multiplier - 1.5) * 0.5,
            isBackstab: isBackstab,
            isHeadshot: isHeadshot
        });
        
        // Particle effect
        this.particles?.createEffect('critical_hit', position, {
            color: critType.color,
            intensity: critType.multiplier
        });
        
        // Camera shake
        const shakeIntensity = 0.1 * critType.multiplier;
        this.camera?.shake(shakeIntensity, 0.3);
        
        // Audio
        const critSound = critType.multiplier >= 2.5 ? 'crit_massive' : 'crit_normal';
        this.audio?.playSFX(critSound, 1.0);
        
        // Streak notification
        const streak = this.getCritStreak(attackerId);
        if (streak >= 3) {
            this.ui?.showNotification(`${streak}x Critical Streak!`, 'achievement');
        }
    }
    
    getEntityPosition(entityId) {
        return this.combat?.getEntityPosition?.(entityId) || { x: 0, y: 0, z: 0 };
    }
    
    getEntityFacing(entityId) {
        return this.combat?.getEntityFacing?.(entityId) || 0;
    }
}

// Export for use in other systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CriticalHitSystem;
}
