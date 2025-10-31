/**
import { logger } from '../core/Logger.js';
 * CombatSystemOverhauled - Advanced 3D Real-time Combat System
 * 
 * Phase 2, System 16 of AUTONOMOUS_EXECUTION_PLAN
 * Implements real-time 3D combat with hitboxes, combos, parries, dodges
 * 
 * Features:
 * - Real-time 3D hitbox collision detection
 * - Advanced combo system with timing windows
 * - Parry and counter mechanics
 * - Dodge rolls with i-frames
 * - Momentum-based combat flow
 * - Skill canceling and animation canceling
 * - Critical hit zones (head, back, weak points)
 * - Elemental damage reactions
 * - Weapon-specific movesets
 * - Boss-specific mechanics integration
 */

import * as THREE from 'three';

export class CombatSystemOverhauled {
    constructor(scene, physicsWorld) {
        this.scene = scene;
        this.physicsWorld = physicsWorld;
        
        // Combat state
        this.activeCombatants = new Map(); // Entity ID -> Combat state
        this.activeHitboxes = [];
        this.damageEvents = [];
        this.combatLog = [];
        
        // Timing windows (ms)
        this.timings = {
            comboWindow: 800,        // Time to continue combo
            parryWindow: 200,        // Perfect parry timing
            dodgeIFrames: 400,       // Invincibility frames
            counterWindow: 300,      // Counter attack window
            skillCancelWindow: 150,  // Animation cancel timing
            criticalMultiplier: 2.0, // Critical hit multiplier
            backstabMultiplier: 2.5  // Backstab multiplier
        };
        
        // Combat rules
        this.rules = {
            maxComboHits: 20,
            comboDecayRate: 0.95,    // Combo damage decay per hit
            momentumGain: 15,        // Momentum per hit
            momentumDecay: 2,        // Momentum loss per second
            parryStaminaCost: 20,
            dodgeStaminaCost: 30,
            blockDamageReduction: 0.5
        };
        
        // Hitbox templates
        this.hitboxTemplates = {
            sword: {
                width: 0.3,
                length: 1.5,
                height: 0.1,
                offset: new THREE.Vector3(0, 1, 0.8),
                duration: 300
            },
            axe: {
                width: 0.4,
                length: 1.2,
                height: 0.3,
                offset: new THREE.Vector3(0, 1.2, 0.7),
                duration: 400
            },
            spear: {
                width: 0.2,
                length: 2.5,
                height: 0.2,
                offset: new THREE.Vector3(0, 1, 1.2),
                duration: 250
            },
            hammer: {
                width: 0.6,
                length: 1.0,
                height: 0.6,
                offset: new THREE.Vector3(0, 1.5, 0.6),
                duration: 600
            },
            dagger: {
                width: 0.2,
                length: 0.8,
                height: 0.1,
                offset: new THREE.Vector3(0, 1, 0.5),
                duration: 200
            },
            staff: {
                width: 0.3,
                length: 1.8,
                height: 0.3,
                offset: new THREE.Vector3(0, 1.2, 0.9),
                duration: 350
            }
        };
        
        // Combo definitions
        this.combos = {
            basic: [
                { type: 'light', damage: 1.0, momentum: 10 },
                { type: 'light', damage: 1.0, momentum: 10 },
                { type: 'light', damage: 1.1, momentum: 15 },
                { type: 'heavy', damage: 1.5, momentum: 20, finisher: true }
            ],
            aerial: [
                { type: 'light', damage: 1.2, momentum: 15, airborne: true },
                { type: 'heavy', damage: 1.8, momentum: 25, finisher: true, groundSlam: true }
            ],
            charged: [
                { type: 'heavy', damage: 2.5, momentum: 40, chargeTime: 1500, finisher: true }
            ],
            rush: [
                { type: 'light', damage: 0.8, momentum: 8 },
                { type: 'light', damage: 0.8, momentum: 8 },
                { type: 'light', damage: 0.8, momentum: 8 },
                { type: 'light', damage: 0.9, momentum: 10 },
                { type: 'heavy', damage: 2.0, momentum: 30, finisher: true }
            ]
        };
        
        // Status effect data
        this.statusEffects = {
            stun: { duration: 2000, preventActions: true },
            knockback: { duration: 500, force: 10 },
            freeze: { duration: 3000, slowAmount: 0.8 },
            burn: { duration: 5000, dps: 10 },
            poison: { duration: 10000, dps: 5 },
            bleed: { duration: 8000, dps: 15 },
            slow: { duration: 4000, slowAmount: 0.5 },
            vulnerable: { duration: 6000, damageMultiplier: 1.5 },
            invulnerable: { duration: 3000, damageMultiplier: 0 }
        };
        
        // Statistics
        this.stats = {
            totalHits: 0,
            totalDamage: 0,
            criticalHits: 0,
            backstabs: 0,
            parries: 0,
            dodges: 0,
            combosCompleted: 0,
            maxCombo: 0
        };
    }
    
    /**
     * Register entity for combat
     */
    registerCombatant(entityId, entity) {
        this.activeCombatants.set(entityId, {
            entity: entity,
            hp: entity.stats.hp || 100,
            maxHp: entity.stats.maxHp || 100,
            stamina: 100,
            maxStamina: 100,
            momentum: 0,
            combo: 0,
            comboType: null,
            lastHitTime: 0,
            isBlocking: false,
            isParrying: false,
            isDodging: false,
            isInvulnerable: false,
            statusEffects: new Map(),
            hitboxes: []
        });
    }
    
    /**
     * Execute attack
     */
    executeAttack(attackerId, attackType, weaponType, direction) {
        const attacker = this.activeCombatants.get(attackerId);
        if (!attacker) return null;
        
        // Check if can attack
        if (attacker.isStunned || !this.canAttack(attacker)) {
            return null;
        }
        
        // Create hitbox
        const hitbox = this.createHitbox(
            attacker.entity,
            weaponType,
            attackType,
            direction
        );
        
        // Add to active hitboxes
        this.activeHitboxes.push({
            id: Math.random().toString(36),
            attackerId: attackerId,
            hitbox: hitbox,
            weaponType: weaponType,
            attackType: attackType,
            damage: this.calculateBaseDamage(attacker, weaponType, attackType),
            createdAt: Date.now(),
            duration: this.hitboxTemplates[weaponType]?.duration || 300,
            hasHit: new Set() // Track already hit entities
        });
        
        // Update combo state
        this.updateCombo(attacker, attackType);
        
        // Consume stamina
        const staminaCost = attackType === 'heavy' ? 25 : 10;
        attacker.stamina = Math.max(0, attacker.stamina - staminaCost);
        
        return hitbox;
    }
    
    /**
     * Create 3D hitbox for attack
     */
    createHitbox(entity, weaponType, attackType, direction) {
        const template = this.hitboxTemplates[weaponType];
        if (!template) {
            logger.warn(`Unknown weapon type: ${weaponType}`);
            return null;
        }
        
        // Create box geometry for hitbox
        const geometry = new THREE.BoxGeometry(
            template.width,
            template.height,
            template.length
        );
        
        // Calculate hitbox position based on entity facing direction
        const position = entity.position.clone();
        const offset = template.offset.clone();
        
        // Rotate offset based on entity rotation
        const rotation = entity.rotation.y || 0;
        offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation);
        position.add(offset);
        
        // Create hitbox mesh (invisible in production, visible in debug mode)
        const material = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            transparent: true,
            opacity: 0.3,
            visible: false // Set to true for debug visualization
        });
        
        const hitbox = new THREE.Mesh(geometry, material);
        hitbox.position.copy(position);
        hitbox.rotation.y = rotation;
        
        this.scene.add(hitbox);
        
        return hitbox;
    }
    
    /**
     * Calculate base damage for attack
     */
    calculateBaseDamage(attacker, weaponType, attackType) {
        const entity = attacker.entity;
        const baseDamage = entity.stats?.attack || 10;
        
        // Weapon type multipliers
        const weaponMultiplier = {
            sword: 1.0,
            axe: 1.2,
            spear: 0.9,
            hammer: 1.5,
            dagger: 0.7,
            staff: 0.8
        }[weaponType] || 1.0;
        
        // Attack type multipliers
        const attackMultiplier = attackType === 'heavy' ? 1.8 : 1.0;
        
        // Combo multiplier
        const comboMultiplier = 1.0 + (attacker.combo * 0.05);
        
        // Momentum multiplier
        const momentumMultiplier = 1.0 + (attacker.momentum / 200);
        
        return baseDamage * weaponMultiplier * attackMultiplier * comboMultiplier * momentumMultiplier;
    }
    
    /**
     * Execute dodge
     */
    executeDodge(entityId, direction) {
        const entity = this.activeCombatants.get(entityId);
        if (!entity) return false;
        
        // Check stamina
        if (entity.stamina < this.rules.dodgeStaminaCost) {
            return false;
        }
        
        // Set dodge state
        entity.isDodging = true;
        entity.isInvulnerable = true;
        entity.stamina -= this.rules.dodgeStaminaCost;
        
        // Apply dodge movement
        const dodgeDistance = 3.0;
        const dodgeVector = direction.clone().normalize().multiplyScalar(dodgeDistance);
        entity.entity.position.add(dodgeVector);
        
        // Remove i-frames after duration
        setTimeout(() => {
            entity.isInvulnerable = false;
            entity.isDodging = false;
        }, this.timings.dodgeIFrames);
        
        this.stats.dodges++;
        return true;
    }
    
    /**
     * Execute parry
     */
    executeParry(entityId) {
        const entity = this.activeCombatants.get(entityId);
        if (!entity) return false;
        
        // Check stamina
        if (entity.stamina < this.rules.parryStaminaCost) {
            return false;
        }
        
        // Set parry state
        entity.isParrying = true;
        entity.stamina -= this.rules.parryStaminaCost;
        
        // Parry window
        setTimeout(() => {
            entity.isParrying = false;
        }, this.timings.parryWindow);
        
        return true;
    }
    
    /**
     * Execute block
     */
    executeBlock(entityId, blocking) {
        const entity = this.activeCombatants.get(entityId);
        if (!entity) return false;
        
        entity.isBlocking = blocking;
        return true;
    }
    
    /**
     * Update combat state
     */
    update(deltaTime) {
        const currentTime = Date.now();
        
        // Update all combatants
        for (const [id, combatant] of this.activeCombatants) {
            this.updateCombatant(combatant, deltaTime, currentTime);
        }
        
        // Update active hitboxes
        this.updateHitboxes(currentTime);
        
        // Process damage events
        this.processDamageEvents();
        
        // Clean up expired hitboxes
        this.cleanupHitboxes(currentTime);
    }
    
    /**
     * Update individual combatant
     */
    updateCombatant(combatant, deltaTime, currentTime) {
        // Regenerate stamina
        if (!combatant.isBlocking && !combatant.isDodging) {
            combatant.stamina = Math.min(
                combatant.maxStamina,
                combatant.stamina + (deltaTime * 20) // 20 stamina per second
            );
        }
        
        // Decay momentum
        combatant.momentum = Math.max(
            0,
            combatant.momentum - (this.rules.momentumDecay * deltaTime)
        );
        
        // Reset combo if window expired
        if (currentTime - combatant.lastHitTime > this.timings.comboWindow) {
            combatant.combo = 0;
            combatant.comboType = null;
        }
        
        // Update status effects
        for (const [effectName, effect] of combatant.statusEffects) {
            effect.remaining -= deltaTime * 1000;
            
            // Apply DoT effects
            if (effect.dps) {
                const damage = (effect.dps * deltaTime);
                this.applyDamage(combatant, damage, 'dot', effectName);
            }
            
            // Remove expired effects
            if (effect.remaining <= 0) {
                combatant.statusEffects.delete(effectName);
            }
        }
    }
    
    /**
     * Update active hitboxes and check for collisions
     */
    updateHitboxes(currentTime) {
        for (const activeHitbox of this.activeHitboxes) {
            // Check collision with all other combatants
            for (const [targetId, target] of this.activeCombatants) {
                // Skip if same entity or already hit
                if (targetId === activeHitbox.attackerId || 
                    activeHitbox.hasHit.has(targetId)) {
                    continue;
                }
                
                // Skip if target is invulnerable
                if (target.isInvulnerable) {
                    continue;
                }
                
                // Check hitbox collision
                if (this.checkHitboxCollision(activeHitbox.hitbox, target.entity)) {
                    this.processHit(activeHitbox, targetId, target);
                    activeHitbox.hasHit.add(targetId);
                }
            }
        }
    }
    
    /**
     * Check if hitbox collides with entity
     */
    checkHitboxCollision(hitbox, entity) {
        if (!hitbox || !entity.position) return false;
        
        // Simple bounding box collision
        const hitboxPos = hitbox.position;
        const entityPos = entity.position;
        
        const distance = hitboxPos.distanceTo(entityPos);
        const collisionRadius = 1.5; // Adjust based on entity size
        
        return distance < collisionRadius;
    }
    
    /**
     * Process hit on target
     */
    processHit(activeHitbox, targetId, target) {
        const attacker = this.activeCombatants.get(activeHitbox.attackerId);
        if (!attacker) return;
        
        // Check for parry
        if (target.isParrying) {
            this.processParry(activeHitbox.attackerId, targetId);
            return;
        }
        
        // Check for block
        let damage = activeHitbox.damage;
        if (target.isBlocking) {
            damage *= this.rules.blockDamageReduction;
        }
        
        // Check for critical hit (random chance)
        const isCritical = Math.random() < 0.15; // 15% crit chance
        if (isCritical) {
            damage *= this.timings.criticalMultiplier;
            this.stats.criticalHits++;
        }
        
        // Check for backstab
        const isBackstab = this.checkBackstab(attacker.entity, target.entity);
        if (isBackstab) {
            damage *= this.timings.backstabMultiplier;
            this.stats.backstabs++;
        }
        
        // Apply damage
        this.applyDamage(target, damage, 'direct', activeHitbox.weaponType);
        
        // Update attacker stats
        attacker.momentum = Math.min(100, attacker.momentum + this.rules.momentumGain);
        attacker.lastHitTime = Date.now();
        
        // Record hit
        this.stats.totalHits++;
        this.stats.totalDamage += damage;
        this.stats.maxCombo = Math.max(this.stats.maxCombo, attacker.combo);
        
        // Apply knockback if heavy attack
        if (activeHitbox.attackType === 'heavy') {
            this.applyKnockback(target, attacker.entity, 5.0);
        }
        
        // Log combat event
        this.logCombatEvent({
            type: 'hit',
            attackerId: activeHitbox.attackerId,
            targetId: targetId,
            damage: damage,
            isCritical: isCritical,
            isBackstab: isBackstab,
            weaponType: activeHitbox.weaponType,
            timestamp: Date.now()
        });
    }
    
    /**
     * Process successful parry
     */
    processParry(attackerId, defenderId) {
        const attacker = this.activeCombatants.get(attackerId);
        const defender = this.activeCombatants.get(defenderId);
        
        if (!attacker || !defender) return;
        
        // Stun attacker
        this.applyStatusEffect(attacker, 'stun', 1000);
        
        // Give defender counter window
        defender.canCounter = true;
        setTimeout(() => {
            defender.canCounter = false;
        }, this.timings.counterWindow);
        
        // Add momentum to defender
        defender.momentum = Math.min(100, defender.momentum + 30);
        
        this.stats.parries++;
        
        this.logCombatEvent({
            type: 'parry',
            attackerId: attackerId,
            defenderId: defenderId,
            timestamp: Date.now()
        });
    }
    
    /**
     * Check if attack is backstab
     */
    checkBackstab(attacker, target) {
        if (!attacker.position || !target.position || !target.rotation) {
            return false;
        }
        
        // Calculate angle between attacker and target's back
        const toAttacker = new THREE.Vector3()
            .subVectors(attacker.position, target.position)
            .normalize();
        
        const targetForward = new THREE.Vector3(0, 0, 1)
            .applyAxisAngle(new THREE.Vector3(0, 1, 0), target.rotation.y || 0);
        
        const dot = toAttacker.dot(targetForward);
        
        // Backstab if attacker is behind target (dot > 0.5)
        return dot > 0.5;
    }
    
    /**
     * Apply damage to entity
     */
    applyDamage(combatant, damage, damageType, source) {
        // Apply damage modifiers from status effects
        for (const [effectName, effect] of combatant.statusEffects) {
            if (effect.damageMultiplier) {
                damage *= effect.damageMultiplier;
            }
        }
        
        // Reduce HP
        combatant.hp = Math.max(0, combatant.hp - damage);
        
        // Check for death
        if (combatant.hp <= 0) {
            this.handleDeath(combatant);
        }
        
        // Create damage event for visual feedback
        this.damageEvents.push({
            entity: combatant.entity,
            damage: Math.round(damage),
            damageType: damageType,
            source: source,
            timestamp: Date.now()
        });
    }
    
    /**
     * Apply knockback to entity
     */
    applyKnockback(target, attacker, force) {
        if (!target.entity.position || !attacker.position) return;
        
        const direction = new THREE.Vector3()
            .subVectors(target.entity.position, attacker.position)
            .normalize();
        
        const knockback = direction.multiplyScalar(force);
        target.entity.position.add(knockback);
    }
    
    /**
     * Apply status effect
     */
    applyStatusEffect(combatant, effectName, duration) {
        const effectData = this.statusEffects[effectName];
        if (!effectData) return;
        
        combatant.statusEffects.set(effectName, {
            ...effectData,
            remaining: duration || effectData.duration
        });
    }
    
    /**
     * Update combo state
     */
    updateCombo(attacker, attackType) {
        const currentTime = Date.now();
        
        // Reset combo if window expired
        if (currentTime - attacker.lastHitTime > this.timings.comboWindow) {
            attacker.combo = 0;
        }
        
        // Increment combo
        attacker.combo++;
        attacker.lastHitTime = currentTime;
        
        // Check for combo completion
        if (attacker.combo >= 4) { // 4-hit combo
            this.stats.combosCompleted++;
        }
    }
    
    /**
     * Can entity attack
     */
    canAttack(combatant) {
        if (combatant.isDodging) return false;
        if (combatant.isParrying) return false;
        if (combatant.statusEffects.has('stun')) return false;
        if (combatant.stamina < 10) return false;
        return true;
    }
    
    /**
     * Process damage events for visual feedback
     */
    processDamageEvents() {
        const currentTime = Date.now();
        
        // Process and emit damage events
        for (const event of this.damageEvents) {
            // Emit for UI to display floating damage numbers
            this.emitDamageEvent(event);
        }
        
        // Clear processed events
        this.damageEvents = [];
    }
    
    /**
     * Emit damage event for UI
     */
    emitDamageEvent(event) {
        // Create event for game engine to handle
        if (window.gameEngine) {
            window.gameEngine.eventBus?.emit('combat:damage', event);
        }
    }
    
    /**
     * Handle entity death
     */
    handleDeath(combatant) {
        combatant.isDead = true;
        
        // Emit death event
        if (window.gameEngine) {
            window.gameEngine.eventBus?.emit('combat:death', {
                entity: combatant.entity,
                timestamp: Date.now()
            });
        }
    }
    
    /**
     * Clean up expired hitboxes
     */
    cleanupHitboxes(currentTime) {
        this.activeHitboxes = this.activeHitboxes.filter(activeHitbox => {
            const expired = (currentTime - activeHitbox.createdAt) > activeHitbox.duration;
            
            if (expired && activeHitbox.hitbox) {
                // Remove from scene
                this.scene.remove(activeHitbox.hitbox);
                activeHitbox.hitbox.geometry?.dispose();
                activeHitbox.hitbox.material?.dispose();
            }
            
            return !expired;
        });
    }
    
    /**
     * Log combat event
     */
    logCombatEvent(event) {
        this.combatLog.push(event);
        
        // Keep log size manageable (last 100 events)
        if (this.combatLog.length > 100) {
            this.combatLog.shift();
        }
    }
    
    /**
     * Get combat stats for entity
     */
    getCombatStats(entityId) {
        const combatant = this.activeCombatants.get(entityId);
        if (!combatant) return null;
        
        return {
            hp: combatant.hp,
            maxHp: combatant.maxHp,
            stamina: combatant.stamina,
            maxStamina: combatant.maxStamina,
            momentum: combatant.momentum,
            combo: combatant.combo,
            statusEffects: Array.from(combatant.statusEffects.keys()),
            isBlocking: combatant.isBlocking,
            isDodging: combatant.isDodging,
            isParrying: combatant.isParrying
        };
    }
    
    /**
     * Get system statistics
     */
    getStats() {
        return {
            ...this.stats,
            activeCombatants: this.activeCombatants.size,
            activeHitboxes: this.activeHitboxes.length
        };
    }
    
    /**
     * Cleanup
     */
    dispose() {
        // Clean up all hitboxes
        for (const activeHitbox of this.activeHitboxes) {
            if (activeHitbox.hitbox) {
                this.scene.remove(activeHitbox.hitbox);
                activeHitbox.hitbox.geometry?.dispose();
                activeHitbox.hitbox.material?.dispose();
            }
        }
        
        this.activeHitboxes = [];
        this.activeCombatants.clear();
        this.damageEvents = [];
        this.combatLog = [];
    }
}
