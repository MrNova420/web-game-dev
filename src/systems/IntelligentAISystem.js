/**
 * Intelligent Enemy AI System
 * Phase 8.1 - Advanced enemy AI with behavior trees, learning, and tactical behaviors
 */

export class IntelligentAISystem {
    constructor(scene) {
        this.scene = scene;
        this.enemies = [];
        this.aiMemory = new Map(); // Stores learned player behaviors
        this.packCoordination = new Map(); // Tracks enemy groups
        
        // AI Personality Types
        this.personalities = {
            AGGRESSIVE: {
                attackRange: 15,
                retreatThreshold: 0.2,
                chaseRange: 25,
                attackFrequency: 0.8
            },
            DEFENSIVE: {
                attackRange: 8,
                retreatThreshold: 0.5,
                chaseRange: 12,
                attackFrequency: 0.4
            },
            TACTICAL: {
                attackRange: 10,
                retreatThreshold: 0.3,
                chaseRange: 20,
                attackFrequency: 0.6,
                useCover: true,
                flanking: true
            },
            BERSERKER: {
                attackRange: 20,
                retreatThreshold: 0.1,
                chaseRange: 30,
                attackFrequency: 1.0,
                rageMode: true
            }
        };
        
        // Behavior states
        this.behaviorStates = {
            IDLE: 'idle',
            PATROL: 'patrol',
            HUNT: 'hunt',
            ATTACK: 'attack',
            FLEE: 'flee',
            AMBUSH: 'ambush',
            FLANK: 'flank',
            COVER: 'cover'
        };
        
        // Player behavior learning
        this.playerPatterns = {
            favoriteSkills: new Map(),
            dodgePatterns: [],
            attackRange: 0,
            lastPositions: [],
            reactionTime: 0
        };
        
        this.initializeAI();
    }
    
    initializeAI() {
        logger.info('🤖 Intelligent AI System initialized');
        this.lastUpdate = Date.now();
    }
    
    /**
     * Register an enemy with the AI system
     */
    registerEnemy(enemy, personality = 'AGGRESSIVE') {
        const aiData = {
            entity: enemy,
            personality: this.personalities[personality] || this.personalities.AGGRESSIVE,
            currentState: this.behaviorStates.IDLE,
            stateTimer: 0,
            target: null,
            patrolPoints: this.generatePatrolPoints(enemy.position),
            currentPatrolIndex: 0,
            memory: {
                lastSeenPlayer: 0,
                playerLastPosition: null,
                damageReceived: [],
                successfulAttacks: 0,
                failedAttacks: 0
            },
            packId: null,
            threatLevel: 0,
            learningData: {
                playerDodgeSuccess: 0,
                playerAttackPatterns: []
            }
        };
        
        this.enemies.push(aiData);
        return aiData;
    }
    
    /**
     * Create pack coordination for group tactics
     */
    createPack(enemies, packId = null) {
        const id = packId || `pack_${Date.now()}`;
        const pack = {
            id: id,
            members: enemies,
            leader: enemies[0],
            formation: 'scatter',
            targetPriority: null
        };
        
        enemies.forEach(enemy => {
            enemy.packId = id;
        });
        
        this.packCoordination.set(id, pack);
        return pack;
    }
    
    /**
     * Update AI behavior for all enemies
     */
    update(deltaTime, player) {
        if (!player) return;
        
        const now = Date.now();
        
        // Learn from player behavior
        this.learnPlayerBehavior(player);
        
        // Update each enemy's AI
        this.enemies.forEach(aiData => {
            this.updateEnemyAI(aiData, deltaTime, player, now);
        });
        
        // Update pack coordination
        this.packCoordination.forEach(pack => {
            this.updatePackTactics(pack, player);
        });
    }
    
    /**
     * Update individual enemy AI
     */
    updateEnemyAI(aiData, deltaTime, player, now) {
        const enemy = aiData.entity;
        if (!enemy || !enemy.mesh) return;
        
        const distanceToPlayer = enemy.mesh.position.distanceTo(player.mesh.position);
        aiData.stateTimer += deltaTime;
        
        // Threat assessment
        aiData.threatLevel = this.assessThreat(aiData, player, distanceToPlayer);
        
        // State machine
        switch (aiData.currentState) {
            case this.behaviorStates.IDLE:
                this.handleIdleState(aiData, player, distanceToPlayer);
                break;
                
            case this.behaviorStates.PATROL:
                this.handlePatrolState(aiData, player, distanceToPlayer);
                break;
                
            case this.behaviorStates.HUNT:
                this.handleHuntState(aiData, player, distanceToPlayer);
                break;
                
            case this.behaviorStates.ATTACK:
                this.handleAttackState(aiData, player, distanceToPlayer, deltaTime);
                break;
                
            case this.behaviorStates.FLEE:
                this.handleFleeState(aiData, player, distanceToPlayer);
                break;
                
            case this.behaviorStates.AMBUSH:
                this.handleAmbushState(aiData, player, distanceToPlayer);
                break;
                
            case this.behaviorStates.FLANK:
                this.handleFlankState(aiData, player, distanceToPlayer);
                break;
                
            case this.behaviorStates.COVER:
                this.handleCoverState(aiData, player, distanceToPlayer);
                break;
        }
        
        // Apply learned behaviors
        this.applyLearnedBehaviors(aiData, player);
    }
    
    /**
     * Idle state - waiting for stimulus
     */
    handleIdleState(aiData, player, distance) {
        const detectionRange = aiData.personality.chaseRange * 1.5;
        
        if (distance < detectionRange) {
            // Detected player
            if (aiData.personality.useCover && Math.random() < 0.3) {
                this.transitionState(aiData, this.behaviorStates.AMBUSH);
            } else {
                this.transitionState(aiData, this.behaviorStates.HUNT);
            }
        } else if (aiData.stateTimer > 3) {
            // Start patrolling after idle timeout
            this.transitionState(aiData, this.behaviorStates.PATROL);
        }
    }
    
    /**
     * Patrol state - moving between patrol points
     */
    handlePatrolState(aiData, player, distance) {
        const enemy = aiData.entity;
        const detectionRange = aiData.personality.chaseRange;
        
        if (distance < detectionRange) {
            this.transitionState(aiData, this.behaviorStates.HUNT);
            return;
        }
        
        // Move to next patrol point
        const targetPoint = aiData.patrolPoints[aiData.currentPatrolIndex];
        const distToPoint = enemy.mesh.position.distanceTo(targetPoint);
        
        if (distToPoint < 2) {
            // Reached patrol point, move to next
            aiData.currentPatrolIndex = (aiData.currentPatrolIndex + 1) % aiData.patrolPoints.length;
            aiData.stateTimer = 0;
        } else {
            // Move toward patrol point
            this.moveToward(enemy, targetPoint, 2);
        }
    }
    
    /**
     * Hunt state - actively pursuing player
     */
    handleHuntState(aiData, player, distance) {
        const enemy = aiData.entity;
        const attackRange = aiData.personality.attackRange;
        
        aiData.memory.lastSeenPlayer = Date.now();
        aiData.memory.playerLastPosition = player.mesh.position.clone();
        
        if (distance < attackRange) {
            this.transitionState(aiData, this.behaviorStates.ATTACK);
        } else if (distance > aiData.personality.chaseRange * 1.5) {
            // Lost player
            this.transitionState(aiData, this.behaviorStates.PATROL);
        } else {
            // Predict player movement
            const predictedPos = this.predictPlayerPosition(aiData, player);
            this.moveToward(enemy, predictedPos, 4);
            
            // Tactical positioning
            if (aiData.personality.flanking && Math.random() < 0.2) {
                this.transitionState(aiData, this.behaviorStates.FLANK);
            }
        }
    }
    
    /**
     * Attack state - engaging player
     */
    handleAttackState(aiData, player, distance, deltaTime) {
        const enemy = aiData.entity;
        const personality = aiData.personality;
        
        // Check health for retreat
        if (enemy.health < enemy.maxHealth * personality.retreatThreshold) {
            this.transitionState(aiData, this.behaviorStates.FLEE);
            return;
        }
        
        // Out of range
        if (distance > personality.attackRange * 1.2) {
            this.transitionState(aiData, this.behaviorStates.HUNT);
            return;
        }
        
        // Circle strafe around player
        const angle = Math.sin(aiData.stateTimer * 2) * Math.PI / 4;
        const offsetX = Math.cos(angle) * personality.attackRange * 0.7;
        const offsetZ = Math.sin(angle) * personality.attackRange * 0.7;
        const targetPos = player.mesh.position.clone();
        targetPos.x += offsetX;
        targetPos.z += offsetZ;
        
        this.moveToward(enemy, targetPos, 3);
        
        // Attack based on frequency
        if (Math.random() < personality.attackFrequency * deltaTime) {
            this.executeAttack(aiData, player);
        }
        
        // Dodge player attacks
        this.attemptDodge(aiData, player);
    }
    
    /**
     * Flee state - retreating from combat
     */
    handleFleeState(aiData, player, distance) {
        const enemy = aiData.entity;
        
        // Recover if safe
        if (distance > aiData.personality.chaseRange * 2) {
            this.transitionState(aiData, this.behaviorStates.PATROL);
            return;
        }
        
        // Run away from player
        const fleeDirection = enemy.mesh.position.clone().sub(player.mesh.position).normalize();
        const fleeTarget = enemy.mesh.position.clone().add(fleeDirection.multiplyScalar(10));
        this.moveToward(enemy, fleeTarget, 6);
        
        // Find cover if available
        if (aiData.personality.useCover) {
            const cover = this.findNearestCover(enemy.mesh.position, player.mesh.position);
            if (cover) {
                this.transitionState(aiData, this.behaviorStates.COVER);
            }
        }
    }
    
    /**
     * Ambush state - waiting to surprise player
     */
    handleAmbushState(aiData, player, distance) {
        const enemy = aiData.entity;
        
        if (distance < 5) {
            // Spring the ambush!
            this.transitionState(aiData, this.behaviorStates.ATTACK);
            // Bonus damage on first attack from ambush
            aiData.ambushBonus = 1.5;
        } else if (aiData.stateTimer > 10) {
            // Ambush timeout
            this.transitionState(aiData, this.behaviorStates.HUNT);
        }
    }
    
    /**
     * Flank state - attempting to attack from side/behind
     */
    handleFlankState(aiData, player, distance) {
        const enemy = aiData.entity;
        
        // Calculate flanking position (90 degrees from player's facing)
        const playerForward = new THREE.Vector3(0, 0, -1).applyQuaternion(player.mesh.quaternion);
        const flankAngle = Math.random() < 0.5 ? Math.PI / 2 : -Math.PI / 2;
        const flankDirection = playerForward.clone().applyAxisAngle(
            new THREE.Vector3(0, 1, 0),
            flankAngle
        );
        
        const flankPos = player.mesh.position.clone().add(
            flankDirection.multiplyScalar(aiData.personality.attackRange * 0.8)
        );
        
        const distToFlank = enemy.mesh.position.distanceTo(flankPos);
        
        if (distToFlank < 2) {
            // Reached flanking position
            this.transitionState(aiData, this.behaviorStates.ATTACK);
        } else {
            this.moveToward(enemy, flankPos, 5);
        }
        
        // Timeout
        if (aiData.stateTimer > 5) {
            this.transitionState(aiData, this.behaviorStates.HUNT);
        }
    }
    
    /**
     * Cover state - using environment for protection
     */
    handleCoverState(aiData, player, distance) {
        const enemy = aiData.entity;
        
        // Peek and shoot from cover
        if (aiData.stateTimer % 3 < 1.5 && distance < aiData.personality.attackRange * 1.5) {
            this.executeAttack(aiData, player);
        }
        
        // Leave cover if player gets too close or too far
        if (distance < 5 || distance > aiData.personality.chaseRange * 1.5) {
            this.transitionState(aiData, this.behaviorStates.HUNT);
        }
    }
    
    /**
     * Learn from player behavior patterns
     */
    learnPlayerBehavior(player) {
        // Track player's favorite skills
        if (player.lastUsedSkill) {
            const count = this.playerPatterns.favoriteSkills.get(player.lastUsedSkill) || 0;
            this.playerPatterns.favoriteSkills.set(player.lastUsedSkill, count + 1);
        }
        
        // Track dodge patterns
        if (player.isDodging) {
            this.playerPatterns.dodgePatterns.push({
                time: Date.now(),
                direction: player.velocity.clone()
            });
            
            // Keep only recent patterns
            if (this.playerPatterns.dodgePatterns.length > 20) {
                this.playerPatterns.dodgePatterns.shift();
            }
        }
        
        // Track position for movement prediction
        this.playerPatterns.lastPositions.push({
            time: Date.now(),
            pos: player.mesh.position.clone()
        });
        
        if (this.playerPatterns.lastPositions.length > 10) {
            this.playerPatterns.lastPositions.shift();
        }
    }
    
    /**
     * Apply learned behaviors to counter player tactics
     */
    applyLearnedBehaviors(aiData, player) {
        // Counter favorite skills
        const favoriteSkill = this.getMostUsedSkill();
        if (favoriteSkill) {
            aiData.counterStrategy = this.getCounterStrategy(favoriteSkill);
        }
        
        // Predict dodges
        if (this.playerPatterns.dodgePatterns.length > 5) {
            const avgDodgeDirection = this.calculateAverageDodgeDirection();
            if (avgDodgeDirection) {
                aiData.dodgePrediction = avgDodgeDirection;
            }
        }
    }
    
    /**
     * Update pack tactics for coordinated attacks
     */
    updatePackTactics(pack, player) {
        if (!pack.members || pack.members.length === 0) return;
        
        // Assign roles based on formation
        switch (pack.formation) {
            case 'scatter':
                // Surround player
                pack.members.forEach((member, index) => {
                    const angle = (index / pack.members.length) * Math.PI * 2;
                    member.tacticalPosition = this.getCirclePosition(
                        player.mesh.position,
                        10,
                        angle
                    );
                });
                break;
                
            case 'pincer':
                // Attack from two sides
                const half = Math.floor(pack.members.length / 2);
                pack.members.forEach((member, index) => {
                    const side = index < half ? -1 : 1;
                    member.tacticalPosition = this.getFlankPosition(
                        player.mesh.position,
                        side
                    );
                });
                break;
                
            case 'wave':
                // Sequential attacks
                const leader = pack.leader;
                if (leader.currentState === this.behaviorStates.ATTACK) {
                    // Next member attacks
                    const nextIndex = (pack.members.indexOf(leader) + 1) % pack.members.length;
                    const next = pack.members[nextIndex];
                    if (next.currentState !== this.behaviorStates.ATTACK) {
                        this.transitionState(next, this.behaviorStates.ATTACK);
                    }
                }
                break;
        }
    }
    
    /**
     * Helper: Transition between states
     */
    transitionState(aiData, newState) {
        aiData.currentState = newState;
        aiData.stateTimer = 0;
    }
    
    /**
     * Helper: Move entity toward target position
     */
    moveToward(enemy, targetPos, speed) {
        if (!enemy.mesh) return;
        
        const direction = targetPos.clone().sub(enemy.mesh.position).normalize();
        enemy.mesh.position.add(direction.multiplyScalar(speed * 0.016)); // Assuming 60fps
        
        // Face movement direction
        const angle = Math.atan2(direction.x, direction.z);
        enemy.mesh.rotation.y = angle;
    }
    
    /**
     * Helper: Execute attack on player
     */
    executeAttack(aiData, player) {
        const enemy = aiData.entity;
        const damage = enemy.damage || 10;
        const finalDamage = (aiData.ambushBonus || 1) * damage;
        
        // Apply damage to player
        if (player.takeDamage) {
            const hit = player.takeDamage(finalDamage);
            
            if (hit) {
                aiData.memory.successfulAttacks++;
            } else {
                aiData.memory.failedAttacks++;
            }
        }
        
        aiData.ambushBonus = 1; // Reset ambush bonus
    }
    
    /**
     * Helper: Attempt to dodge player attack
     */
    attemptDodge(aiData, player) {
        if (!player.isAttacking) return;
        
        // Dodge based on learned patterns
        const dodgeChance = 0.3 + (aiData.learningData.playerDodgeSuccess / 100);
        
        if (Math.random() < dodgeChance) {
            const enemy = aiData.entity;
            const dodgeDirection = new THREE.Vector3(
                Math.random() - 0.5,
                0,
                Math.random() - 0.5
            ).normalize();
            
            enemy.mesh.position.add(dodgeDirection.multiplyScalar(3));
            aiData.learningData.playerDodgeSuccess++;
        }
    }
    
    /**
     * Helper: Assess threat level
     */
    assessThreat(aiData, player, distance) {
        let threat = 0;
        
        // Distance threat
        threat += Math.max(0, 1 - distance / 20);
        
        // Health threat
        const healthPercent = aiData.entity.health / aiData.entity.maxHealth;
        threat += (1 - healthPercent) * 0.5;
        
        // Player power threat
        if (player.level > aiData.entity.level) {
            threat += (player.level - aiData.entity.level) * 0.1;
        }
        
        return Math.min(threat, 1);
    }
    
    /**
     * Helper: Predict player position based on movement history
     */
    predictPlayerPosition(aiData, player) {
        const positions = this.playerPatterns.lastPositions;
        
        if (positions.length < 2) {
            return player.mesh.position.clone();
        }
        
        // Calculate velocity
        const recent = positions[positions.length - 1];
        const before = positions[positions.length - 2];
        const velocity = recent.pos.clone().sub(before.pos);
        const timeDelta = (recent.time - before.time) / 1000;
        
        // Predict 0.5 seconds ahead
        return player.mesh.position.clone().add(velocity.multiplyScalar(0.5 / timeDelta));
    }
    
    /**
     * Helper: Generate patrol points around spawn
     */
    generatePatrolPoints(spawnPos) {
        const points = [];
        const numPoints = 4;
        const radius = 10;
        
        for (let i = 0; i < numPoints; i++) {
            const angle = (i / numPoints) * Math.PI * 2;
            const point = spawnPos.clone();
            point.x += Math.cos(angle) * radius;
            point.z += Math.sin(angle) * radius;
            points.push(point);
        }
        
        return points;
    }
    
    /**
     * Helper: Find nearest cover position
     */
    findNearestCover(position, threatPosition) {
        // Simplified cover finding - would use environment data in full implementation
        const direction = position.clone().sub(threatPosition).normalize();
        return position.clone().add(direction.multiplyScalar(5));
    }
    
    /**
     * Helper: Get most used skill by player
     */
    getMostUsedSkill() {
        let maxCount = 0;
        let mostUsed = null;
        
        this.playerPatterns.favoriteSkills.forEach((count, skill) => {
            if (count > maxCount) {
                maxCount = count;
                mostUsed = skill;
            }
        });
        
        return mostUsed;
    }
    
    /**
     * Helper: Get counter strategy for skill
     */
    getCounterStrategy(skill) {
        // Define counters for common skills
        const counters = {
            'fireball': 'dodge_left',
            'melee': 'keep_distance',
            'area': 'spread_out',
            'charge': 'sidestep'
        };
        
        return counters[skill] || 'default';
    }
    
    /**
     * Helper: Calculate average dodge direction
     */
    calculateAverageDodgeDirection() {
        const patterns = this.playerPatterns.dodgePatterns;
        if (patterns.length === 0) return null;
        
        const avgDir = new THREE.Vector3();
        patterns.forEach(p => avgDir.add(p.direction));
        avgDir.divideScalar(patterns.length);
        
        return avgDir.normalize();
    }
    
    /**
     * Helper: Get position on circle around target
     */
    getCirclePosition(center, radius, angle) {
        return new THREE.Vector3(
            center.x + Math.cos(angle) * radius,
            center.y,
            center.z + Math.sin(angle) * radius
        );
    }
    
    /**
     * Helper: Get flanking position
     */
    getFlankPosition(playerPos, side) {
        const offset = 8;
        return new THREE.Vector3(
            playerPos.x + side * offset,
            playerPos.y,
            playerPos.z
        );
    }
    
    /**
     * Remove enemy from AI system
     */
    removeEnemy(enemy) {
        const index = this.enemies.findIndex(ai => ai.entity === enemy);
        if (index !== -1) {
            this.enemies.splice(index, 1);
        }
    }
    
    /**
     * Clear all AI data
     */
    clear() {
        this.enemies = [];
        this.aiMemory.clear();
        this.packCoordination.clear();
    }
}
