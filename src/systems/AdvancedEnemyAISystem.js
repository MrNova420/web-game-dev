/**
 * Advanced Enemy AI System
 * Implements sophisticated AI behaviors, tactics, and decision-making for enemies
 * Includes behavior trees, state machines, squad tactics, and adaptive difficulty
 */

export class AdvancedEnemyAISystem {
    constructor(combatSystem, physics) {
        this.combatSystem = combatSystem;
        this.physics = physics;
        
        this.enemies = new Map(); // enemyId -> AI state
        this.squads = new Map(); // squadId -> enemy IDs
        this.behaviors = new Map(); // behaviorId -> behavior definition
        
        this.initializeBehaviors();
    }
    
    initializeBehaviors() {
        // Behavior patterns for different enemy types
        this.behaviors.set('aggressive', {
            name: 'Aggressive',
            engageRange: 15,
            retreatThreshold: 0.2,
            attackFrequency: 1.0,
            circlePlayer: false,
            useSkills: true,
            tactics: ['rush', 'relentless_attack']
        });
        
        this.behaviors.set('defensive', {
            name: 'Defensive',
            engageRange: 10,
            retreatThreshold: 0.5,
            attackFrequency: 0.6,
            circlePlayer: true,
            useSkills: true,
            tactics: ['block', 'counter', 'retreat_heal']
        });
        
        this.behaviors.set('tactical', {
            name: 'Tactical',
            engageRange: 12,
            retreatThreshold: 0.3,
            attackFrequency: 0.8,
            circlePlayer: true,
            useSkills: true,
            tactics: ['flank', 'coordinate', 'use_environment']
        });
        
        this.behaviors.set('ranged', {
            name: 'Ranged',
            engageRange: 20,
            retreatThreshold: 0.4,
            attackFrequency: 0.7,
            circlePlayer: true,
            useSkills: true,
            tactics: ['kite', 'maintain_distance', 'use_cover']
        });
        
        this.behaviors.set('support', {
            name: 'Support',
            engageRange: 15,
            retreatThreshold: 0.6,
            attackFrequency: 0.3,
            circlePlayer: false,
            useSkills: true,
            tactics: ['buff_allies', 'heal', 'debuff_player']
        });
        
        this.behaviors.set('ambush', {
            name: 'Ambush',
            engageRange: 8,
            retreatThreshold: 0.1,
            attackFrequency: 1.2,
            circlePlayer: false,
            useSkills: true,
            tactics: ['stealth', 'backstab', 'burst_damage']
        });
    }
    
    registerEnemy(enemyId, enemyData, behaviorType = 'aggressive') {
        const behavior = this.behaviors.get(behaviorType) || this.behaviors.get('aggressive');
        
        this.enemies.set(enemyId, {
            id: enemyId,
            data: enemyData,
            behavior: behavior,
            behaviorType: behaviorType,
            
            // AI State
            state: 'idle', // idle, patrol, chase, attack, retreat, dead
            target: null,
            lastAttackTime: 0,
            lastSkillTime: 0,
            
            // Position & Movement
            position: enemyData.position || {x: 0, y: 0, z: 0},
            destination: null,
            patrolPoints: [],
            currentPatrolIndex: 0,
            
            // Combat State
            health: enemyData.maxHealth || 100,
            maxHealth: enemyData.maxHealth || 100,
            inCombat: false,
            lastDamagedTime: 0,
            
            // Awareness
            alertLevel: 0, // 0-100
            canSeePlayer: false,
            lastSeenPlayerPos: null,
            hearingRange: 15,
            sightRange: 20,
            
            // Decision Making
            decisionTimer: 0,
            currentTactic: null,
            
            // Squad
            squadId: null,
            isLeader: false,
            
            // Skill cooldowns
            skillCooldowns: new Map()
        });
    }
    
    createSquad(squadId, enemyIds, leaderId = null) {
        this.squads.set(squadId, {
            id: squadId,
            members: enemyIds,
            leader: leaderId || enemyIds[0],
            formation: 'spread', // spread, line, circle, wedge
            tactic: null
        });
        
        enemyIds.forEach(enemyId => {
            const enemy = this.enemies.get(enemyId);
            if (enemy) {
                enemy.squadId = squadId;
                enemy.isLeader = enemyId === (leaderId || enemyIds[0]);
            }
        });
    }
    
    update(deltaTime, playerPosition) {
        this.enemies.forEach(enemy => {
            if (enemy.state === 'dead') return;
            
            enemy.decisionTimer -= deltaTime;
            
            // Update awareness
            this.updateAwareness(enemy, playerPosition);
            
            // Make decisions periodically
            if (enemy.decisionTimer <= 0) {
                this.makeDecision(enemy, playerPosition);
                enemy.decisionTimer = 0.5; // Decide every 0.5 seconds
            }
            
            // Execute current behavior
            this.executeBehavior(enemy, playerPosition, deltaTime);
            
            // Update squad tactics
            if (enemy.squadId) {
                this.updateSquadTactics(enemy.squadId, playerPosition);
            }
        });
    }
    
    updateAwareness(enemy, playerPosition) {
        const distance = this.getDistance(enemy.position, playerPosition);
        
        // Sight check
        enemy.canSeePlayer = distance <= enemy.sightRange && this.hasLineOfSight(enemy.position, playerPosition);
        
        if (enemy.canSeePlayer) {
            enemy.lastSeenPlayerPos = {...playerPosition};
            enemy.alertLevel = Math.min(100, enemy.alertLevel + 5);
        } else {
            enemy.alertLevel = Math.max(0, enemy.alertLevel - 1);
        }
        
        // Hearing - detect player if close even without LOS
        if (distance <= enemy.hearingRange) {
            enemy.alertLevel = Math.max(enemy.alertLevel, 50);
        }
        
        // Detect damage
        if (Date.now() - enemy.lastDamagedTime < 1000) {
            enemy.alertLevel = 100;
            enemy.lastSeenPlayerPos = {...playerPosition};
        }
    }
    
    makeDecision(enemy, playerPosition) {
        const distance = this.getDistance(enemy.position, playerPosition);
        const healthPercent = enemy.health / enemy.maxHealth;
        
        // Dead check
        if (enemy.health <= 0) {
            enemy.state = 'dead';
            return;
        }
        
        // Retreat if low health
        if (healthPercent < enemy.behavior.retreatThreshold && enemy.inCombat) {
            enemy.state = 'retreat';
            return;
        }
        
        // Chase if alert and can see player
        if (enemy.alertLevel > 50 && enemy.canSeePlayer) {
            if (distance > enemy.behavior.engageRange * 0.7) {
                enemy.state = 'chase';
                enemy.target = playerPosition;
            } else {
                enemy.state = 'attack';
                enemy.target = playerPosition;
            }
            enemy.inCombat = true;
            return;
        }
        
        // Search if alert but can't see player
        if (enemy.alertLevel > 30 && !enemy.canSeePlayer && enemy.lastSeenPlayerPos) {
            enemy.state = 'chase';
            enemy.target = enemy.lastSeenPlayerPos;
            return;
        }
        
        // Patrol or idle
        if (enemy.alertLevel === 0) {
            if (enemy.patrolPoints.length > 0) {
                enemy.state = 'patrol';
            } else {
                enemy.state = 'idle';
            }
            enemy.inCombat = false;
        }
    }
    
    executeBehavior(enemy, playerPosition, deltaTime) {
        switch (enemy.state) {
            case 'idle':
                this.executeIdle(enemy, deltaTime);
                break;
            case 'patrol':
                this.executePatrol(enemy, deltaTime);
                break;
            case 'chase':
                this.executeChase(enemy, playerPosition, deltaTime);
                break;
            case 'attack':
                this.executeAttack(enemy, playerPosition, deltaTime);
                break;
            case 'retreat':
                this.executeRetreat(enemy, playerPosition, deltaTime);
                break;
        }
    }
    
    executeIdle(enemy, deltaTime) {
        // Random idle animations/movements
        if (Math.random() < 0.01) {
            // Occasionally look around
        }
    }
    
    executePatrol(enemy, deltaTime) {
        if (enemy.patrolPoints.length === 0) {
            enemy.state = 'idle';
            return;
        }
        
        const target = enemy.patrolPoints[enemy.currentPatrolIndex];
        const distance = this.getDistance(enemy.position, target);
        
        if (distance < 2) {
            enemy.currentPatrolIndex = (enemy.currentPatrolIndex + 1) % enemy.patrolPoints.length;
        } else {
            this.moveTowards(enemy, target, deltaTime);
        }
    }
    
    executeChase(enemy, playerPosition, deltaTime) {
        const target = enemy.target || playerPosition;
        const distance = this.getDistance(enemy.position, target);
        
        if (distance < enemy.behavior.engageRange * 0.7) {
            enemy.state = 'attack';
        } else {
            this.moveTowards(enemy, target, deltaTime);
        }
    }
    
    executeAttack(enemy, playerPosition, deltaTime) {
        const distance = this.getDistance(enemy.position, playerPosition);
        const now = Date.now();
        
        // Positioning based on behavior
        if (enemy.behavior.circlePlayer) {
            this.circleTarget(enemy, playerPosition, enemy.behavior.engageRange * 0.8, deltaTime);
        } else {
            // Move to attack range
            if (distance > enemy.behavior.engageRange * 0.5) {
                this.moveTowards(enemy, playerPosition, deltaTime);
            } else if (distance < enemy.behavior.engageRange * 0.3) {
                this.moveAway(enemy, playerPosition, deltaTime);
            }
        }
        
        // Attack if in range and cooldown ready
        const attackCooldown = 1000 / enemy.behavior.attackFrequency;
        if (distance <= enemy.data.attackRange && now - enemy.lastAttackTime > attackCooldown) {
            this.performAttack(enemy, playerPosition);
            enemy.lastAttackTime = now;
        }
        
        // Use skills
        if (enemy.behavior.useSkills && now - enemy.lastSkillTime > 3000) {
            this.useSkill(enemy, playerPosition);
            enemy.lastSkillTime = now;
        }
        
        // Execute tactics
        if (enemy.behavior.tactics.length > 0) {
            this.executeTactic(enemy, playerPosition);
        }
    }
    
    executeRetreat(enemy, playerPosition, deltaTime) {
        // Move away from player
        this.moveAway(enemy, playerPosition, deltaTime);
        
        // Look for health pickup or safe spot
        // Return to combat if health recovered
        if (enemy.health / enemy.maxHealth > enemy.behavior.retreatThreshold + 0.2) {
            enemy.state = 'chase';
        }
    }
    
    performAttack(enemy, playerPosition) {
        // Delegate to combat system
        this.combatSystem.attack(enemy.id, 'player', {
            attackType: enemy.data.attackType || 'melee',
            damage: enemy.data.damage || 10,
            element: enemy.data.element || 'physical',
            canCrit: true
        });
    }
    
    useSkill(enemy, playerPosition) {
        if (!enemy.data.skills || enemy.data.skills.length === 0) return;
        
        // Choose random skill that's not on cooldown
        const availableSkills = enemy.data.skills.filter(skill => {
            const cooldown = enemy.skillCooldowns.get(skill.id) || 0;
            return Date.now() > cooldown;
        });
        
        if (availableSkills.length > 0) {
            const skill = availableSkills[Math.floor(Math.random() * availableSkills.length)];
            
            // Use skill
            this.combatSystem.attack(enemy.id, 'player', {
                attackType: skill.type || 'magic',
                damage: skill.damage || 15,
                element: skill.element || 'fire',
                canCrit: false,
                isSkill: true
            });
            
            enemy.skillCooldowns.set(skill.id, Date.now() + (skill.cooldown || 5000));
        }
    }
    
    executeTactic(enemy, playerPosition) {
        const tactic = enemy.currentTactic || enemy.behavior.tactics[0];
        
        switch (tactic) {
            case 'flank':
                // Try to get behind player
                this.moveToFlank(enemy, playerPosition);
                break;
            case 'kite':
                // Maintain distance
                const distance = this.getDistance(enemy.position, playerPosition);
                if (distance < enemy.behavior.engageRange * 0.8) {
                    this.moveAway(enemy, playerPosition, 0.016);
                }
                break;
            case 'use_cover':
                // Move to nearest cover
                break;
        }
    }
    
    updateSquadTactics(squadId, playerPosition) {
        const squad = this.squads.get(squadId);
        if (!squad) return;
        
        const leader = this.enemies.get(squad.leader);
        if (!leader || leader.state === 'dead') {
            // Reassign leader
            const aliveMembers = squad.members.filter(id => {
                const enemy = this.enemies.get(id);
                return enemy && enemy.state !== 'dead';
            });
            if (aliveMembers.length > 0) {
                squad.leader = aliveMembers[0];
            }
            return;
        }
        
        // Coordinate attacks
        if (leader.inCombat) {
            squad.members.forEach((memberId, index) => {
                const member = this.enemies.get(memberId);
                if (!member || member.state === 'dead' || member.id === leader.id) return;
                
                // Position squad members based on formation
                switch (squad.formation) {
                    case 'spread':
                        // Spread around player
                        const angle = (index / squad.members.length) * Math.PI * 2;
                        member.destination = {
                            x: playerPosition.x + Math.cos(angle) * 8,
                            y: playerPosition.y,
                            z: playerPosition.z + Math.sin(angle) * 8
                        };
                        break;
                    case 'line':
                        // Form a line
                        member.destination = {
                            x: leader.position.x + (index - squad.members.length / 2) * 3,
                            y: leader.position.y,
                            z: leader.position.z
                        };
                        break;
                }
            });
        }
    }
    
    // Helper methods
    getDistance(pos1, pos2) {
        const dx = pos1.x - pos2.x;
        const dz = pos1.z - pos2.z;
        return Math.sqrt(dx * dx + dz * dz);
    }
    
    hasLineOfSight(from, to) {
        // Simple raycast check
        if (this.physics) {
            const result = this.physics.raycast(from, to);
            return !result.hasHit;
        }
        return true; // Assume LOS if no physics
    }
    
    moveTowards(enemy, target, deltaTime) {
        const speed = enemy.data.moveSpeed || 5;
        const dx = target.x - enemy.position.x;
        const dz = target.z - enemy.position.z;
        const distance = Math.sqrt(dx * dx + dz * dz);
        
        if (distance > 0.1) {
            enemy.position.x += (dx / distance) * speed * deltaTime;
            enemy.position.z += (dz / distance) * speed * deltaTime;
        }
    }
    
    moveAway(enemy, target, deltaTime) {
        const speed = enemy.data.moveSpeed || 5;
        const dx = enemy.position.x - target.x;
        const dz = enemy.position.z - target.z;
        const distance = Math.sqrt(dx * dx + dz * dz);
        
        if (distance > 0.1) {
            enemy.position.x += (dx / distance) * speed * deltaTime;
            enemy.position.z += (dz / distance) * speed * deltaTime;
        }
    }
    
    circleTarget(enemy, target, radius, deltaTime) {
        const speed = enemy.data.moveSpeed || 5;
        const dx = enemy.position.x - target.x;
        const dz = enemy.position.z - target.z;
        const distance = Math.sqrt(dx * dx + dz * dz);
        
        // Move tangentially
        const tangentX = -dz;
        const tangentZ = dx;
        const tangentLen = Math.sqrt(tangentX * tangentX + tangentZ * tangentZ);
        
        if (tangentLen > 0) {
            enemy.position.x += (tangentX / tangentLen) * speed * deltaTime;
            enemy.position.z += (tangentZ / tangentLen) * speed * deltaTime;
        }
        
        // Adjust distance to radius
        if (Math.abs(distance - radius) > 1) {
            const radialSpeed = (distance > radius ? -1 : 1) * speed * 0.5;
            enemy.position.x += (dx / distance) * radialSpeed * deltaTime;
            enemy.position.z += (dz / distance) * radialSpeed * deltaTime;
        }
    }
    
    moveToFlank(enemy, playerPosition) {
        // Get position behind player
        const angle = Math.random() * Math.PI * 2;
        enemy.destination = {
            x: playerPosition.x + Math.cos(angle) * 5,
            y: playerPosition.y,
            z: playerPosition.z + Math.sin(angle) * 5
        };
    }
    
    setPatrolPath(enemyId, patrolPoints) {
        const enemy = this.enemies.get(enemyId);
        if (enemy) {
            enemy.patrolPoints = patrolPoints;
            enemy.currentPatrolIndex = 0;
        }
    }
    
    takeDamage(enemyId, damage) {
        const enemy = this.enemies.get(enemyId);
        if (enemy) {
            enemy.health = Math.max(0, enemy.health - damage);
            enemy.lastDamagedTime = Date.now();
            
            if (enemy.health <= 0) {
                enemy.state = 'dead';
            }
        }
    }
    
    getEnemyState(enemyId) {
        return this.enemies.get(enemyId);
    }
    
    removeEnemy(enemyId) {
        // Remove from squad if in one
        const enemy = this.enemies.get(enemyId);
        if (enemy && enemy.squadId) {
            const squad = this.squads.get(enemy.squadId);
            if (squad) {
                squad.members = squad.members.filter(id => id !== enemyId);
            }
        }
        
        this.enemies.delete(enemyId);
    }
}
