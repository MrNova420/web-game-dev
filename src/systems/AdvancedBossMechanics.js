import { logger } from '../core/Logger.js';
/**
 * Advanced Boss Mechanics System
 * Implements multi-phase boss fights with unique mechanics and patterns
 */

export class AdvancedBossMechanics {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.activeBosses = new Map(); // boss -> mechanics data
        this.phaseTransitions = [];
        this.patterns = this.createPatterns();
    }

    /**
     * Initialize boss with advanced mechanics
     */
    initializeBoss(boss) {
        const mechanics = {
            boss: boss,
            currentPhase: 1,
            maxPhases: 3,
            phaseThresholds: [0.66, 0.33], // HP % for phase transitions
            isTransitioning: false,
            transitionTimer: 0,
            transitionDuration: 3,
            
            // Phase-specific mechanics
            phaseData: {
                1: {
                    pattern: 'standard',
                    abilityRate: 5,
                    moveSpeed: 1.0,
                    abilities: ['melee', 'charge']
                },
                2: {
                    pattern: 'aggressive',
                    abilityRate: 3,
                    moveSpeed: 1.3,
                    abilities: ['melee', 'charge', 'aoe_slam', 'summon_adds']
                },
                3: {
                    pattern: 'enrage',
                    abilityRate: 2,
                    moveSpeed: 1.5,
                    abilities: ['melee', 'charge', 'aoe_slam', 'summon_adds', 'beam', 'teleport']
                }
            },
            
            // Ability tracking
            abilityTimer: 0,
            lastAbility: null,
            abilityQueue: [],
            
            // Add spawning
            addSpawnTimer: 0,
            addSpawnInterval: 15,
            maxAdds: 5,
            currentAdds: [],
            
            // Telegraphed attacks
            currentTelegraph: null,
            telegraphTimer: 0,
            
            // Special mechanics
            isInvulnerable: false,
            invulnerabilityTimer: 0,
            enrageTimer: 0,
            enrageActive: false,
            
            // Stats tracking
            damageDealt: 0,
            abilitiesUsed: 0,
            phasesCompleted: 0
        };
        
        this.activeBosses.set(boss, mechanics);
        this.applyPhaseModifiers(boss, mechanics);
        
        // Trigger boss entrance
        if (this.gameEngine.particleSystem) {
            this.gameEngine.particleSystem.createBossEffect(boss.position);
        }
        if (this.gameEngine.audioSystem) {
            this.gameEngine.audioSystem.playSoundEffect('boss_roar');
        }
    }

    /**
     * Update all active boss mechanics
     */
    update(deltaTime, player, enemies) {
        for (const [boss, mechanics] of this.activeBosses) {
            if (!boss || boss.health <= 0) {
                this.onBossDefeated(boss, mechanics);
                continue;
            }
            
            // Check for phase transitions
            const healthPercent = boss.health / boss.maxHealth;
            this.checkPhaseTransition(boss, mechanics, healthPercent);
            
            if (mechanics.isTransitioning) {
                this.updatePhaseTransition(boss, mechanics, deltaTime);
                continue;
            }
            
            // Update abilities
            this.updateAbilities(boss, mechanics, deltaTime, player, enemies);
            
            // Update adds
            this.updateAdds(boss, mechanics, deltaTime, player, enemies);
            
            // Update telegraphs
            this.updateTelegraphs(boss, mechanics, deltaTime);
            
            // Update special mechanics
            this.updateSpecialMechanics(boss, mechanics, deltaTime);
        }
    }

    /**
     * Check if boss should transition to next phase
     */
    checkPhaseTransition(boss, mechanics, healthPercent) {
        if (mechanics.isTransitioning) return;
        
        const currentPhase = mechanics.currentPhase;
        const threshold = mechanics.phaseThresholds[currentPhase - 1];
        
        if (threshold && healthPercent <= threshold) {
            this.startPhaseTransition(boss, mechanics);
        }
    }

    /**
     * Start phase transition sequence
     */
    startPhaseTransition(boss, mechanics) {
        mechanics.isTransitioning = true;
        mechanics.transitionTimer = 0;
        mechanics.isInvulnerable = true;
        mechanics.currentPhase++;
        mechanics.phasesCompleted++;
        
        // Visual effects
        if (this.gameEngine.particleSystem) {
            this.gameEngine.particleSystem.createLevelUpEffect(boss.position);
        }
        if (this.gameEngine.audioSystem) {
            this.gameEngine.audioSystem.playSoundEffect('boss_phase');
        }
        
        // Create notification
        this.showPhaseNotification(mechanics.currentPhase);
    }

    /**
     * Update phase transition
     */
    updatePhaseTransition(boss, mechanics, deltaTime) {
        mechanics.transitionTimer += deltaTime;
        
        // Pulse effect during transition
        const pulse = Math.sin(mechanics.transitionTimer * 5) * 0.2 + 1;
        if (boss.mesh) {
            boss.mesh.scale.setScalar(boss.scale * pulse);
        }
        
        if (mechanics.transitionTimer >= mechanics.transitionDuration) {
            mechanics.isTransitioning = false;
            mechanics.isInvulnerable = false;
            this.applyPhaseModifiers(boss, mechanics);
            
            // Final phase enters enrage
            if (mechanics.currentPhase === 3) {
                mechanics.enrageActive = true;
            }
        }
    }

    /**
     * Apply phase-specific modifiers
     */
    applyPhaseModifiers(boss, mechanics) {
        const phaseData = mechanics.phaseData[mechanics.currentPhase];
        if (!phaseData) return;
        
        // Apply stat modifiers
        boss.baseSpeed = boss.baseSpeed || boss.speed;
        boss.speed = boss.baseSpeed * phaseData.moveSpeed;
        
        // Update AI aggression
        if (boss.ai) {
            boss.ai.aggroDecayRate *= 0.7; // Boss stays aggressive longer
        }
    }

    /**
     * Update boss abilities
     */
    updateAbilities(boss, mechanics, deltaTime, player, enemies) {
        const phaseData = mechanics.phaseData[mechanics.currentPhase];
        if (!phaseData) return;
        
        mechanics.abilityTimer += deltaTime;
        
        if (mechanics.abilityTimer >= phaseData.abilityRate) {
            mechanics.abilityTimer = 0;
            this.useRandomAbility(boss, mechanics, player, enemies);
        }
    }

    /**
     * Use a random ability from current phase
     */
    useRandomAbility(boss, mechanics, player, enemies) {
        const phaseData = mechanics.phaseData[mechanics.currentPhase];
        const abilities = phaseData.abilities.filter(a => a !== mechanics.lastAbility);
        const ability = abilities[Math.floor(Math.random() * abilities.length)];
        
        mechanics.lastAbility = ability;
        mechanics.abilitiesUsed++;
        
        switch (ability) {
            case 'melee':
                this.executeMeleeAttack(boss, mechanics, player);
                break;
            case 'charge':
                this.executeCharge(boss, mechanics, player);
                break;
            case 'aoe_slam':
                this.executeAOESlam(boss, mechanics, player);
                break;
            case 'summon_adds':
                this.executeSummonAdds(boss, mechanics, enemies);
                break;
            case 'beam':
                this.executeBeam(boss, mechanics, player);
                break;
            case 'teleport':
                this.executeTeleport(boss, mechanics, player);
                break;
        }
    }

    /**
     * Execute melee attack
     */
    executeMeleeAttack(boss, mechanics, player) {
        const distance = boss.position.distanceTo(player.position);
        if (distance < 5) {
            const damage = boss.damage * 1.5;
            player.takeDamage(damage);
            mechanics.damageDealt += damage;
            
            if (this.gameEngine.particleSystem) {
                this.gameEngine.particleSystem.createHitEffect(player.position);
            }
            if (this.gameEngine.audioSystem) {
                this.gameEngine.audioSystem.playSoundEffect('attack');
            }
        }
    }

    /**
     * Execute charge attack with telegraph
     */
    executeCharge(boss, mechanics, player) {
        // Telegraph phase
        mechanics.currentTelegraph = {
            type: 'charge',
            direction: player.position.clone().sub(boss.position).normalize(),
            duration: 1.5,
            timer: 0,
            startPos: boss.position.clone()
        };
        
        this.showTelegraph(boss.position, 'charge');
    }

    /**
     * Execute AOE slam attack
     */
    executeAOESlam(boss, mechanics, player) {
        mechanics.currentTelegraph = {
            type: 'aoe_slam',
            radius: 10,
            duration: 2,
            timer: 0,
            position: boss.position.clone()
        };
        
        this.showTelegraph(boss.position, 'aoe');
    }

    /**
     * Execute add summoning
     */
    executeSummonAdds(boss, mechanics, enemies) {
        if (mechanics.currentAdds.length >= mechanics.maxAdds) return;
        
        const addCount = Math.min(2, mechanics.maxAdds - mechanics.currentAdds.length);
        
        for (let i = 0; i < addCount; i++) {
            const angle = (Math.PI * 2 / addCount) * i;
            const offset = 5;
            const spawnPos = boss.position.clone();
            spawnPos.x += Math.cos(angle) * offset;
            spawnPos.z += Math.sin(angle) * offset;
            
            // Create add (would integrate with enemy spawn system)
            const add = {
                position: spawnPos,
                health: 50,
                maxHealth: 50,
                damage: 10,
                isBossAdd: true,
                bossOwner: boss
            };
            
            mechanics.currentAdds.push(add);
            
            if (this.gameEngine.particleSystem) {
                this.gameEngine.particleSystem.createTeleportEffect(spawnPos);
            }
        }
        
        if (this.gameEngine.audioSystem) {
            this.gameEngine.audioSystem.playSoundEffect('summon');
        }
    }

    /**
     * Execute beam attack
     */
    executeBeam(boss, mechanics, player) {
        mechanics.currentTelegraph = {
            type: 'beam',
            direction: player.position.clone().sub(boss.position).normalize(),
            duration: 3,
            timer: 0,
            startPos: boss.position.clone()
        };
        
        this.showTelegraph(boss.position, 'beam');
    }

    /**
     * Execute teleport
     */
    executeTeleport(boss, mechanics, player) {
        const angle = Math.random() * Math.PI * 2;
        const distance = 15;
        
        boss.position.x = player.position.x + Math.cos(angle) * distance;
        boss.position.z = player.position.z + Math.sin(angle) * distance;
        
        if (boss.mesh) {
            boss.mesh.position.copy(boss.position);
        }
        
        if (this.gameEngine.particleSystem) {
            this.gameEngine.particleSystem.createTeleportEffect(boss.position);
        }
        if (this.gameEngine.audioSystem) {
            this.gameEngine.audioSystem.playSoundEffect('teleport');
        }
    }

    /**
     * Update telegraphed attacks
     */
    updateTelegraphs(boss, mechanics, deltaTime) {
        if (!mechanics.currentTelegraph) return;
        
        const telegraph = mechanics.currentTelegraph;
        telegraph.timer += deltaTime;
        
        if (telegraph.timer >= telegraph.duration) {
            this.executeTelegraphedAttack(boss, mechanics, telegraph);
            mechanics.currentTelegraph = null;
        }
    }

    /**
     * Execute telegraphed attack
     */
    executeTelegraphedAttack(boss, mechanics, telegraph) {
        const player = this.gameEngine.player;
        
        switch (telegraph.type) {
            case 'charge':
                // Execute charge in direction
                boss.velocity = telegraph.direction.multiplyScalar(20);
                setTimeout(() => { boss.velocity.set(0, 0, 0); }, 500);
                
                // Damage check
                if (boss.position.distanceTo(player.position) < 3) {
                    const damage = boss.damage * 2;
                    player.takeDamage(damage);
                    mechanics.damageDealt += damage;
                }
                break;
                
            case 'aoe_slam':
                // AOE damage
                const distance = boss.position.distanceTo(player.position);
                if (distance < telegraph.radius) {
                    const damage = boss.damage * 2.5 * (1 - distance / telegraph.radius);
                    player.takeDamage(damage);
                    mechanics.damageDealt += damage;
                }
                
                if (this.gameEngine.particleSystem) {
                    this.gameEngine.particleSystem.createExplosionEffect(telegraph.position);
                }
                break;
                
            case 'beam':
                // Line damage check
                const toPlayer = player.position.clone().sub(telegraph.startPos);
                const projection = toPlayer.dot(telegraph.direction);
                const perpDistance = toPlayer.clone().sub(
                    telegraph.direction.clone().multiplyScalar(projection)
                ).length();
                
                if (perpDistance < 2 && projection > 0 && projection < 30) {
                    const damage = boss.damage * 3;
                    player.takeDamage(damage);
                    mechanics.damageDealt += damage;
                }
                break;
        }
        
        if (this.gameEngine.audioSystem) {
            this.gameEngine.audioSystem.playSoundEffect('explosion');
        }
    }

    /**
     * Update boss adds
     */
    updateAdds(boss, mechanics, deltaTime, player, enemies) {
        // Remove defeated adds
        mechanics.currentAdds = mechanics.currentAdds.filter(add => add.health > 0);
        
        // Update add spawn timer
        if (mechanics.currentPhase >= 2) {
            mechanics.addSpawnTimer += deltaTime;
            
            if (mechanics.addSpawnTimer >= mechanics.addSpawnInterval) {
                mechanics.addSpawnTimer = 0;
                this.executeSummonAdds(boss, mechanics, enemies);
            }
        }
    }

    /**
     * Update special mechanics
     */
    updateSpecialMechanics(boss, mechanics, deltaTime) {
        // Invulnerability
        if (mechanics.isInvulnerable) {
            mechanics.invulnerabilityTimer += deltaTime;
            if (mechanics.invulnerabilityTimer >= 3) {
                mechanics.isInvulnerable = false;
                mechanics.invulnerabilityTimer = 0;
            }
        }
        
        // Enrage timer
        if (mechanics.enrageActive) {
            mechanics.enrageTimer += deltaTime;
            
            // Increase damage over time in enrage
            const enrageDamageBonus = 1 + (mechanics.enrageTimer * 0.05);
            boss.baseDamage = boss.baseDamage || boss.damage;
            boss.damage = boss.baseDamage * enrageDamageBonus;
        }
    }

    /**
     * Show telegraph warning
     */
    showTelegraph(position, type) {
        // Create visual telegraph indicator (would integrate with particle system)
        logger.info(`Telegraph: ${type} at`, position);
    }

    /**
     * Show phase notification
     */
    showPhaseNotification(phase) {
        // Create UI notification for phase change
        logger.info(`Boss entering Phase ${phase}!`);
    }

    /**
     * Handle boss defeated
     */
    onBossDefeated(boss, mechanics) {
        this.activeBosses.delete(boss);
        
        // Trigger achievements
        if (this.gameEngine.achievementSystem) {
            this.gameEngine.achievementSystem.onBossDefeated(true, mechanics.currentPhase);
        }
        
        // Reward scaling based on phases completed
        const bonusReward = mechanics.phasesCompleted * 100;
        
        // Clean up adds
        mechanics.currentAdds.forEach(add => {
            add.health = 0;
        });
    }

    /**
     * Handle boss taking damage
     */
    onBossDamaged(boss, damage) {
        const mechanics = this.activeBosses.get(boss);
        if (!mechanics) return;
        
        // Block damage during invulnerability
        if (mechanics.isInvulnerable) {
            return 0;
        }
        
        return damage;
    }

    /**
     * Create ability patterns
     */
    createPatterns() {
        return {
            standard: {
                sequence: ['melee', 'melee', 'charge'],
                loop: true
            },
            aggressive: {
                sequence: ['charge', 'aoe_slam', 'melee', 'summon_adds'],
                loop: true
            },
            enrage: {
                sequence: ['beam', 'teleport', 'aoe_slam', 'charge'],
                loop: true
            }
        };
    }

    /**
     * Get active boss count
     */
    getActiveBossCount() {
        return this.activeBosses.size;
    }

    /**
     * Get boss mechanics data
     */
    getBossMechanics(boss) {
        return this.activeBosses.get(boss);
    }
}
