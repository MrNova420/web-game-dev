/**
import { logger } from '../core/Logger.js';
 * Dynamic Difficulty Scaling System
 * Phase 8.2 - Adaptive difficulty that scales with player skill and performance
 */

import * as THREE from 'three';

export class DynamicDifficultySystem {
    constructor(scene) {
        this.scene = scene;
        
        // Player skill metrics
        this.playerSkillData = {
            reactionTime: [],
            dodgeSuccessRate: 0,
            comboUsage: 0,
            averageCombatTime: 0,
            deathCount: 0,
            perfectDodges: 0,
            damageAvoidance: 0,
            skillLevel: 0.5, // 0 to 1 scale
            lastUpdate: Date.now()
        };
        
        // Difficulty settings
        this.difficultyMultiplier = 1.0; // Base multiplier
        this.minMultiplier = 0.8;
        this.maxMultiplier = 1.5;
        
        // Scaling parameters
        this.scalingConfig = {
            enemyHealth: true,
            enemyDamage: true,
            enemySpeed: true,
            spawnRate: true,
            lootQuality: true,
            experienceGain: true
        };
        
        // Challenge zones
        this.challengeZones = [];
        this.currentZone = null;
        
        // Death penalty system
        this.deathPenalty = {
            active: false,
            reductionAmount: 0.2,
            duration: 300000, // 5 minutes
            startTime: 0
        };
        
        // Mastery rewards
        this.masteryThresholds = {
            BEGINNER: 0.3,
            INTERMEDIATE: 0.5,
            ADVANCED: 0.7,
            EXPERT: 0.85,
            MASTER: 0.95
        };
        
        this.currentMasteryLevel = 'BEGINNER';
        
        this.initialize();
    }
    
    initialize() {
        logger.info('⚖️ Dynamic Difficulty Scaling System initialized');
        
        // Create challenge zones
        this.createChallengeZones();
        
        // Start skill analysis
        this.startSkillAnalysis();
    }
    
    /**
     * Create challenge zones in the world
     */
    createChallengeZones() {
        const zones = [
            {
                name: 'Safe Haven',
                position: new THREE.Vector3(0, 0, 0),
                radius: 20,
                difficultyMultiplier: 0.7,
                level: 1
            },
            {
                name: 'Outskirts',
                position: new THREE.Vector3(50, 0, 0),
                radius: 30,
                difficultyMultiplier: 1.0,
                level: 5
            },
            {
                name: 'Wilderness',
                position: new THREE.Vector3(100, 0, 50),
                radius: 40,
                difficultyMultiplier: 1.2,
                level: 10
            },
            {
                name: 'Danger Zone',
                position: new THREE.Vector3(150, 0, 100),
                radius: 35,
                difficultyMultiplier: 1.4,
                level: 15
            },
            {
                name: 'Death Valley',
                position: new THREE.Vector3(200, 0, 150),
                radius: 30,
                difficultyMultiplier: 1.5,
                level: 20
            }
        ];
        
        this.challengeZones = zones;
    }
    
    /**
     * Update difficulty based on player performance
     */
    update(deltaTime, player, combatStats) {
        if (!player) return;
        
        // Update current zone
        this.updateCurrentZone(player.mesh.position);
        
        // Analyze player skill
        this.analyzePlayerSkill(combatStats);
        
        // Adjust difficulty multiplier
        this.adjustDifficulty();
        
        // Update death penalty if active
        this.updateDeathPenalty();
        
        // Check for mastery level changes
        this.checkMasteryLevel();
    }
    
    /**
     * Analyze player skill based on combat performance
     */
    analyzePlayerSkill(combatStats) {
        if (!combatStats) return;
        
        const now = Date.now();
        const timeSinceLastUpdate = (now - this.playerSkillData.lastUpdate) / 1000;
        
        if (timeSinceLastUpdate < 5) return; // Update every 5 seconds
        
        // Calculate dodge success rate
        if (combatStats.dodgeAttempts > 0) {
            this.playerSkillData.dodgeSuccessRate = 
                combatStats.successfulDodges / combatStats.dodgeAttempts;
        }
        
        // Track reaction time
        if (combatStats.lastReactionTime) {
            this.playerSkillData.reactionTime.push(combatStats.lastReactionTime);
            if (this.playerSkillData.reactionTime.length > 20) {
                this.playerSkillData.reactionTime.shift();
            }
        }
        
        // Track combo usage
        this.playerSkillData.comboUsage = combatStats.averageComboLength || 0;
        
        // Track combat time
        this.playerSkillData.averageCombatTime = combatStats.averageCombatDuration || 0;
        
        // Track damage avoidance
        if (combatStats.potentialDamage > 0) {
            this.playerSkillData.damageAvoidance = 
                1 - (combatStats.damageTaken / combatStats.potentialDamage);
        }
        
        // Track perfect dodges
        this.playerSkillData.perfectDodges = combatStats.perfectDodges || 0;
        
        // Calculate overall skill level
        this.calculateSkillLevel();
        
        this.playerSkillData.lastUpdate = now;
    }
    
    /**
     * Calculate overall skill level from metrics
     */
    calculateSkillLevel() {
        let skillScore = 0;
        let weights = 0;
        
        // Dodge success rate (weight: 0.25)
        skillScore += this.playerSkillData.dodgeSuccessRate * 0.25;
        weights += 0.25;
        
        // Reaction time (weight: 0.2)
        if (this.playerSkillData.reactionTime.length > 0) {
            const avgReaction = this.playerSkillData.reactionTime.reduce((a, b) => a + b, 0) 
                / this.playerSkillData.reactionTime.length;
            const reactionScore = Math.max(0, 1 - avgReaction / 1000); // Lower is better, max 1 second
            skillScore += reactionScore * 0.2;
            weights += 0.2;
        }
        
        // Combo usage (weight: 0.15)
        const comboScore = Math.min(1, this.playerSkillData.comboUsage / 5);
        skillScore += comboScore * 0.15;
        weights += 0.15;
        
        // Damage avoidance (weight: 0.25)
        skillScore += this.playerSkillData.damageAvoidance * 0.25;
        weights += 0.25;
        
        // Perfect dodges (weight: 0.15)
        const perfectScore = Math.min(1, this.playerSkillData.perfectDodges / 10);
        skillScore += perfectScore * 0.15;
        weights += 0.15;
        
        // Normalize and smooth
        if (weights > 0) {
            const newSkillLevel = skillScore / weights;
            // Smooth transition
            this.playerSkillData.skillLevel = 
                this.playerSkillData.skillLevel * 0.8 + newSkillLevel * 0.2;
        }
    }
    
    /**
     * Adjust difficulty multiplier based on skill level
     */
    adjustDifficulty() {
        const skillLevel = this.playerSkillData.skillLevel;
        
        // Calculate target multiplier
        let targetMultiplier = 0.8 + (skillLevel * 0.7); // 0.8 to 1.5 range
        
        // Apply zone multiplier
        if (this.currentZone) {
            targetMultiplier *= this.currentZone.difficultyMultiplier;
        }
        
        // Apply death penalty reduction
        if (this.deathPenalty.active) {
            targetMultiplier *= (1 - this.deathPenalty.reductionAmount);
        }
        
        // Clamp to min/max
        targetMultiplier = Math.max(this.minMultiplier, 
            Math.min(this.maxMultiplier, targetMultiplier));
        
        // Smooth transition
        this.difficultyMultiplier = 
            this.difficultyMultiplier * 0.95 + targetMultiplier * 0.05;
    }
    
    /**
     * Scale enemy stats based on difficulty
     */
    scaleEnemy(enemy, playerLevel) {
        if (!enemy) return;
        
        const baseMultiplier = this.difficultyMultiplier;
        
        // Level-based scaling (0.8x to 1.5x player level)
        const levelVariance = 0.8 + Math.random() * 0.7;
        const scaledLevel = Math.floor(playerLevel * levelVariance * baseMultiplier);
        enemy.level = Math.max(1, scaledLevel);
        
        // Health scaling
        if (this.scalingConfig.enemyHealth) {
            const healthScale = baseMultiplier * (0.9 + Math.random() * 0.2);
            enemy.maxHealth *= healthScale;
            enemy.health = enemy.maxHealth;
        }
        
        // Damage scaling
        if (this.scalingConfig.enemyDamage) {
            const damageScale = baseMultiplier * (0.95 + Math.random() * 0.1);
            enemy.damage *= damageScale;
        }
        
        // Speed scaling
        if (this.scalingConfig.enemySpeed) {
            const speedScale = 0.9 + (baseMultiplier - 1) * 0.5;
            enemy.speed *= speedScale;
        }
        
        // Visual indicator for difficulty
        this.addDifficultyIndicator(enemy);
        
        return enemy;
    }
    
    /**
     * Scale boss based on performance and party size
     */
    scaleBoss(boss, playerLevel, partySize = 1) {
        if (!boss) return;
        
        const baseMultiplier = this.difficultyMultiplier;
        const partyMultiplier = 1 + (partySize - 1) * 0.5; // 50% more per additional player
        
        // Boss gets higher scaling
        const bossScale = baseMultiplier * partyMultiplier;
        
        // Multi-phase boss scaling
        boss.phases = boss.phases || 3;
        boss.currentPhase = 1;
        
        for (let phase = 1; phase <= boss.phases; phase++) {
            const phaseMultiplier = 1 + (phase - 1) * 0.3; // Each phase 30% stronger
            
            boss[`phase${phase}Health`] = boss.maxHealth * phaseMultiplier * bossScale;
            boss[`phase${phase}Damage`] = boss.damage * phaseMultiplier * bossScale;
            
            // Unlock new abilities each phase
            boss[`phase${phase}Abilities`] = this.getPhaseAbilities(phase);
        }
        
        // Adjust based on player performance
        if (this.playerSkillData.skillLevel > 0.8) {
            // Expert players get tougher bosses
            boss.enrageTimer = 180; // 3 minutes before enrage
        } else if (this.playerSkillData.skillLevel < 0.3) {
            // Beginners get more time
            boss.enrageTimer = 600; // 10 minutes
        }
        
        return boss;
    }
    
    /**
     * Scale loot quality based on difficulty
     */
    scaleLootQuality(baseLoot, difficultyMultiplier = null) {
        const multiplier = difficultyMultiplier || this.difficultyMultiplier;
        
        // Higher difficulty = better loot
        const qualityBonus = (multiplier - 1) * 2; // 0 to 1 bonus
        
        const loot = { ...baseLoot };
        
        // Increase rarity chance
        if (loot.rarityChance) {
            loot.rarityChance = Math.min(1, loot.rarityChance * (1 + qualityBonus));
        }
        
        // Increase quantity
        if (loot.quantity) {
            loot.quantity = Math.floor(loot.quantity * (1 + qualityBonus * 0.5));
        }
        
        // Increase quality
        if (loot.quality) {
            loot.quality = Math.min(10, loot.quality + Math.floor(qualityBonus * 5));
        }
        
        // Add bonus items for high difficulty
        if (multiplier > 1.3) {
            loot.bonusItems = Math.floor((multiplier - 1.3) * 5);
        }
        
        return loot;
    }
    
    /**
     * Scale experience gain
     */
    scaleExperience(baseExp, difficultyMultiplier = null) {
        const multiplier = difficultyMultiplier || this.difficultyMultiplier;
        
        // Higher difficulty = more exp
        const expMultiplier = 0.5 + multiplier; // 1.3x to 2.0x
        
        return Math.floor(baseExp * expMultiplier);
    }
    
    /**
     * Handle player death - activate death penalty
     */
    onPlayerDeath() {
        this.playerSkillData.deathCount++;
        
        // Activate death penalty
        this.deathPenalty.active = true;
        this.deathPenalty.startTime = Date.now();
        
        // Increase reduction based on recent deaths
        const recentDeaths = Math.min(5, this.playerSkillData.deathCount);
        this.deathPenalty.reductionAmount = 0.1 + (recentDeaths * 0.05);
        
        logger.info(`💀 Death penalty active: -${Math.floor(this.deathPenalty.reductionAmount * 100)}% difficulty for 5 minutes`);
    }
    
    /**
     * Update death penalty timer
     */
    updateDeathPenalty() {
        if (!this.deathPenalty.active) return;
        
        const elapsed = Date.now() - this.deathPenalty.startTime;
        
        if (elapsed > this.deathPenalty.duration) {
            this.deathPenalty.active = false;
            logger.info('✅ Death penalty expired - difficulty normalized');
        }
    }
    
    /**
     * Check and update mastery level
     */
    checkMasteryLevel() {
        const skillLevel = this.playerSkillData.skillLevel;
        let newLevel = this.currentMasteryLevel;
        
        if (skillLevel >= this.masteryThresholds.MASTER) {
            newLevel = 'MASTER';
        } else if (skillLevel >= this.masteryThresholds.EXPERT) {
            newLevel = 'EXPERT';
        } else if (skillLevel >= this.masteryThresholds.ADVANCED) {
            newLevel = 'ADVANCED';
        } else if (skillLevel >= this.masteryThresholds.INTERMEDIATE) {
            newLevel = 'INTERMEDIATE';
        } else {
            newLevel = 'BEGINNER';
        }
        
        if (newLevel !== this.currentMasteryLevel) {
            this.onMasteryLevelUp(this.currentMasteryLevel, newLevel);
            this.currentMasteryLevel = newLevel;
        }
    }
    
    /**
     * Handle mastery level up
     */
    onMasteryLevelUp(oldLevel, newLevel) {
        logger.info(`🏆 Mastery Level Up: ${oldLevel} → ${newLevel}`);
        
        // Award mastery rewards
        const rewards = this.getMasteryRewards(newLevel);
        
        // Notify player
        if (this.scene.ui && this.scene.ui.showNotification) {
            this.scene.ui.showNotification(
                `Mastery Level Up!`,
                `You've reached ${newLevel} mastery!`,
                'achievement'
            );
        }
        
        return rewards;
    }
    
    /**
     * Get rewards for mastery level
     */
    getMasteryRewards(level) {
        const rewards = {
            BEGINNER: {
                title: 'Novice',
                bonusExp: 1.0,
                bonusLoot: 1.0
            },
            INTERMEDIATE: {
                title: 'Apprentice',
                bonusExp: 1.1,
                bonusLoot: 1.1,
                unlockedFeature: 'Advanced Combos'
            },
            ADVANCED: {
                title: 'Adept',
                bonusExp: 1.2,
                bonusLoot: 1.2,
                unlockedFeature: 'Perfect Dodge Rewards'
            },
            EXPERT: {
                title: 'Veteran',
                bonusExp: 1.3,
                bonusLoot: 1.3,
                unlockedFeature: 'Legendary Loot Chance'
            },
            MASTER: {
                title: 'Master',
                bonusExp: 1.5,
                bonusLoot: 1.5,
                unlockedFeature: 'Master Mode Unlocked',
                specialReward: 'Master Aura'
            }
        };
        
        return rewards[level] || rewards.BEGINNER;
    }
    
    /**
     * Update current challenge zone based on player position
     */
    updateCurrentZone(playerPosition) {
        let closestZone = null;
        let closestDistance = Infinity;
        
        this.challengeZones.forEach(zone => {
            const distance = playerPosition.distanceTo(zone.position);
            
            if (distance < zone.radius && distance < closestDistance) {
                closestZone = zone;
                closestDistance = distance;
            }
        });
        
        if (closestZone !== this.currentZone) {
            this.currentZone = closestZone;
            
            if (closestZone) {
                logger.info(`🗺️ Entered ${closestZone.name} (Difficulty: ${closestZone.difficultyMultiplier}x)`);
            }
        }
    }
    
    /**
     * Get phase-specific boss abilities
     */
    getPhaseAbilities(phase) {
        const abilities = {
            1: ['basic_attack', 'charge'],
            2: ['basic_attack', 'charge', 'area_attack', 'summon_adds'],
            3: ['basic_attack', 'charge', 'area_attack', 'summon_adds', 'rage_mode', 'ultimate']
        };
        
        return abilities[phase] || abilities[1];
    }
    
    /**
     * Add visual difficulty indicator to enemy
     */
    addDifficultyIndicator(enemy) {
        if (!enemy.mesh) return;
        
        const multiplier = this.difficultyMultiplier;
        let color = 0x00ff00; // Green for easy
        
        if (multiplier > 1.3) {
            color = 0xff0000; // Red for hard
        } else if (multiplier > 1.1) {
            color = 0xffff00; // Yellow for moderate
        }
        
        // Add glow effect
        if (enemy.mesh.material) {
            enemy.mesh.material.emissive = new THREE.Color(color);
            enemy.mesh.material.emissiveIntensity = 0.2;
        }
    }
    
    /**
     * Get current difficulty status
     */
    getStatus() {
        return {
            difficultyMultiplier: this.difficultyMultiplier,
            skillLevel: this.playerSkillData.skillLevel,
            masteryLevel: this.currentMasteryLevel,
            currentZone: this.currentZone ? this.currentZone.name : 'None',
            deathPenaltyActive: this.deathPenalty.active,
            metrics: {
                dodgeSuccessRate: Math.floor(this.playerSkillData.dodgeSuccessRate * 100),
                averageReactionTime: this.playerSkillData.reactionTime.length > 0
                    ? Math.floor(this.playerSkillData.reactionTime.reduce((a, b) => a + b, 0) 
                        / this.playerSkillData.reactionTime.length)
                    : 0,
                comboUsage: this.playerSkillData.comboUsage,
                damageAvoidance: Math.floor(this.playerSkillData.damageAvoidance * 100)
            }
        };
    }
    
    /**
     * Reset difficulty scaling
     */
    reset() {
        this.difficultyMultiplier = 1.0;
        this.playerSkillData = {
            reactionTime: [],
            dodgeSuccessRate: 0,
            comboUsage: 0,
            averageCombatTime: 0,
            deathCount: 0,
            perfectDodges: 0,
            damageAvoidance: 0,
            skillLevel: 0.5,
            lastUpdate: Date.now()
        };
        this.deathPenalty.active = false;
        this.currentMasteryLevel = 'BEGINNER';
    }
}
