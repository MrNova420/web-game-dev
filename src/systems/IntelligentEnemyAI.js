// Phase 8.1: Intelligent Enemy AI System with Behavior Trees and Learning
export class IntelligentEnemyAI {
    constructor() {
        this.enemies = new Map();
        this.behaviorTrees = this.initializeBehaviorTrees();
        this.learningData = new Map(); // Track player patterns
        this.packCoordination = new Map();
        
        // AI personality types
        this.personalities = {
            aggressive: { attackChance: 0.8, retreatThreshold: 0.2, useSkillChance: 0.7 },
            defensive: { attackChance: 0.5, retreatThreshold: 0.5, useSkillChance: 0.4 },
            tactical: { attackChance: 0.6, retreatThreshold: 0.4, useSkillChance: 0.9 },
            berserker: { attackChance: 0.95, retreatThreshold: 0.05, useSkillChance: 0.3 }
        };
        
        this.lastUpdate = Date.now();
    }
    
    initializeBehaviorTrees() {
        return {
            patrol: {
                name: 'Patrol',
                priority: 1,
                conditions: ['notInCombat', 'hasPatrolRoute'],
                actions: ['moveToNextPatrolPoint', 'lookAround']
            },
            hunt: {
                name: 'Hunt',
                priority: 5,
                conditions: ['playerDetected', 'withinAggroRange'],
                actions: ['moveTowardsPlayer', 'prepareAttack']
            },
            ambush: {
                name: 'Ambush',
                priority: 4,
                conditions: ['playerNearby', 'hasHidingSpot'],
                actions: ['moveToHidingSpot', 'waitForPlayer', 'surpriseAttack']
            },
            flee: {
                name: 'Flee',
                priority: 6,
                conditions: ['lowHealth', 'outmatched'],
                actions: ['retreatToSafety', 'callForHelp']
            },
            attackMelee: {
                name: 'AttackMelee',
                priority: 7,
                conditions: ['inMeleeRange', 'canAttack'],
                actions: ['executeAttack', 'useCombatSkill']
            },
            attackRanged: {
                name: 'AttackRanged',
                priority: 7,
                conditions: ['inRangedRange', 'hasRangedWeapon', 'canAttack'],
                actions: ['findOptimalPosition', 'executeRangedAttack']
            },
            useSkill: {
                name: 'UseSkill',
                priority: 8,
                conditions: ['skillReady', 'tacticalAdvantage'],
                actions: ['selectBestSkill', 'positionForSkill', 'castSkill']
            },
            coordinateAttack: {
                name: 'CoordinateAttack',
                priority: 9,
                conditions: ['hasAllies', 'targetShared'],
                actions: ['synchronizeAttack', 'formationMove', 'comboSkill']
            }
        };
    }
    
    createEnemy(enemyId, config) {
        const enemy = {
            id: enemyId,
            position: config.position || { x: 0, y: 0, z: 0 },
            health: config.health || 100,
            maxHealth: config.maxHealth || 100,
            level: config.level || 1,
            personality: config.personality || 'aggressive',
            aggroRange: config.aggroRange || 15,
            meleeRange: config.meleeRange || 2,
            rangedRange: config.rangedRange || 10,
            hasRangedWeapon: config.hasRangedWeapon || false,
            skills: config.skills || [],
            currentBehavior: 'patrol',
            target: null,
            patrolRoute: config.patrolRoute || [],
            currentPatrolIndex: 0,
            lastAttackTime: 0,
            attackCooldown: 2000,
            skillCooldowns: new Map(),
            environmentalAwareness: {
                nearestCover: null,
                nearestAmbushPoint: null,
                nearestAllies: [],
                threateningEnemies: []
            },
            learningProfile: {
                playerDodgePattern: [],
                playerAttackPattern: [],
                playerSkillUsage: new Map(),
                successfulCounters: new Map()
            },
            state: {
                isAggro: false,
                isFleeing: false,
                isHiding: false,
                lastPlayerPosition: null
            }
        };
        
        this.enemies.set(enemyId, enemy);
        return enemy;
    }
    
    update(deltaTime, playerPosition, playerState) {
        const currentTime = Date.now();
        const dt = deltaTime / 1000; // Convert to seconds
        
        for (const [enemyId, enemy] of this.enemies) {
            // Update environmental awareness
            this.updateEnvironmentalAwareness(enemy, playerPosition);
            
            // Learn from player behavior
            this.learnFromPlayer(enemy, playerState);
            
            // Select best behavior based on conditions
            const behavior = this.selectBehavior(enemy, playerPosition, currentTime);
            enemy.currentBehavior = behavior.name;
            
            // Execute behavior actions
            this.executeBehavior(enemy, behavior, playerPosition, dt, currentTime);
            
            // Update pack coordination if part of a group
            this.updatePackCoordination(enemy, playerPosition);
        }
        
        this.lastUpdate = currentTime;
    }
    
    updateEnvironmentalAwareness(enemy, playerPosition) {
        // Find nearest cover (simplified - would use actual world geometry)
        const coverPoints = this.findNearbyPoints(enemy.position, 'cover', 20);
        enemy.environmentalAwareness.nearestCover = coverPoints[0] || null;
        
        // Find ambush points
        const ambushPoints = this.findNearbyPoints(enemy.position, 'ambush', 15);
        enemy.environmentalAwareness.nearestAmbushPoint = ambushPoints[0] || null;
        
        // Find nearby allies
        enemy.environmentalAwareness.nearestAllies = [];
        for (const [otherId, otherEnemy] of this.enemies) {
            if (otherId !== enemy.id) {
                const distance = this.getDistance(enemy.position, otherEnemy.position);
                if (distance < 25) {
                    enemy.environmentalAwareness.nearestAllies.push({
                        id: otherId,
                        enemy: otherEnemy,
                        distance: distance
                    });
                }
            }
        }
    }
    
    learnFromPlayer(enemy, playerState) {
        if (!playerState) return;
        
        // Track player dodge patterns
        if (playerState.justDodged) {
            enemy.learningProfile.playerDodgePattern.push({
                time: Date.now(),
                direction: playerState.dodgeDirection
            });
            
            // Keep only recent patterns (last 10 dodges)
            if (enemy.learningProfile.playerDodgePattern.length > 10) {
                enemy.learningProfile.playerDodgePattern.shift();
            }
        }
        
        // Track player attack patterns
        if (playerState.justAttacked) {
            enemy.learningProfile.playerAttackPattern.push({
                time: Date.now(),
                type: playerState.attackType
            });
            
            if (enemy.learningProfile.playerAttackPattern.length > 10) {
                enemy.learningProfile.playerAttackPattern.shift();
            }
        }
        
        // Track player skill usage
        if (playerState.skillUsed) {
            const count = enemy.learningProfile.playerSkillUsage.get(playerState.skillUsed) || 0;
            enemy.learningProfile.playerSkillUsage.set(playerState.skillUsed, count + 1);
        }
    }
    
    selectBehavior(enemy, playerPosition, currentTime) {
        const distance = this.getDistance(enemy.position, playerPosition);
        const healthPercent = enemy.health / enemy.maxHealth;
        const personality = this.personalities[enemy.personality];
        
        // Evaluate conditions for each behavior
        const availableBehaviors = [];
        
        for (const behaviorKey in this.behaviorTrees) {
            const behavior = this.behaviorTrees[behaviorKey];
            const conditionsMet = this.evaluateConditions(
                behavior.conditions,
                enemy,
                distance,
                healthPercent,
                currentTime
            );
            
            if (conditionsMet) {
                availableBehaviors.push(behavior);
            }
        }
        
        // Sort by priority and select highest
        availableBehaviors.sort((a, b) => b.priority - a.priority);
        
        return availableBehaviors[0] || this.behaviorTrees.patrol;
    }
    
    evaluateConditions(conditions, enemy, distance, healthPercent, currentTime) {
        const conditionChecks = {
            notInCombat: () => !enemy.state.isAggro,
            hasPatrolRoute: () => enemy.patrolRoute.length > 0,
            playerDetected: () => distance < enemy.aggroRange,
            withinAggroRange: () => distance < enemy.aggroRange,
            playerNearby: () => distance < enemy.aggroRange * 1.5,
            hasHidingSpot: () => enemy.environmentalAwareness.nearestAmbushPoint !== null,
            lowHealth: () => healthPercent < this.personalities[enemy.personality].retreatThreshold,
            outmatched: () => enemy.environmentalAwareness.threateningEnemies.length > 2,
            inMeleeRange: () => distance < enemy.meleeRange,
            canAttack: () => currentTime - enemy.lastAttackTime > enemy.attackCooldown,
            inRangedRange: () => distance < enemy.rangedRange && distance > enemy.meleeRange,
            hasRangedWeapon: () => enemy.hasRangedWeapon,
            skillReady: () => this.hasAvailableSkill(enemy, currentTime),
            tacticalAdvantage: () => this.evaluateTacticalAdvantage(enemy),
            hasAllies: () => enemy.environmentalAwareness.nearestAllies.length > 0,
            targetShared: () => this.hasSharedTarget(enemy)
        };
        
        return conditions.every(condition => {
            const check = conditionChecks[condition];
            return check ? check() : false;
        });
    }
    
    executeBehavior(enemy, behavior, playerPosition, deltaTime, currentTime) {
        const actions = {
            moveToNextPatrolPoint: () => this.patrol(enemy, deltaTime),
            lookAround: () => this.lookAround(enemy),
            moveTowardsPlayer: () => this.moveTowardsTarget(enemy, playerPosition, deltaTime),
            prepareAttack: () => this.prepareAttack(enemy),
            moveToHidingSpot: () => this.moveToHidingSpot(enemy, deltaTime),
            waitForPlayer: () => this.waitInAmbush(enemy),
            surpriseAttack: () => this.executeSurpriseAttack(enemy, playerPosition, currentTime),
            retreatToSafety: () => this.retreat(enemy, playerPosition, deltaTime),
            callForHelp: () => this.callForHelp(enemy),
            executeAttack: () => this.executeMeleeAttack(enemy, currentTime),
            useCombatSkill: () => this.useCombatSkill(enemy, currentTime),
            findOptimalPosition: () => this.findRangedPosition(enemy, playerPosition, deltaTime),
            executeRangedAttack: () => this.executeRangedAttack(enemy, playerPosition, currentTime),
            selectBestSkill: () => this.selectBestSkill(enemy, playerPosition),
            positionForSkill: () => this.positionForSkill(enemy, playerPosition, deltaTime),
            castSkill: () => this.castSkill(enemy, currentTime),
            synchronizeAttack: () => this.synchronizeWithAllies(enemy),
            formationMove: () => this.moveInFormation(enemy, playerPosition, deltaTime),
            comboSkill: () => this.executeComboSkill(enemy, currentTime)
        };
        
        // Execute all actions for the behavior
        behavior.actions.forEach(actionName => {
            const action = actions[actionName];
            if (action) action();
        });
    }
    
    // Behavior action implementations
    patrol(enemy, deltaTime) {
        if (enemy.patrolRoute.length === 0) return;
        
        const targetPoint = enemy.patrolRoute[enemy.currentPatrolIndex];
        const direction = this.getDirection(enemy.position, targetPoint);
        const speed = 2; // units per second
        
        enemy.position.x += direction.x * speed * deltaTime;
        enemy.position.z += direction.z * speed * deltaTime;
        
        const distance = this.getDistance(enemy.position, targetPoint);
        if (distance < 1) {
            enemy.currentPatrolIndex = (enemy.currentPatrolIndex + 1) % enemy.patrolRoute.length;
        }
    }
    
    moveTowardsTarget(enemy, targetPosition, deltaTime) {
        enemy.state.isAggro = true;
        const direction = this.getDirection(enemy.position, targetPosition);
        const speed = 4; // faster when chasing
        
        enemy.position.x += direction.x * speed * deltaTime;
        enemy.position.z += direction.z * speed * deltaTime;
    }
    
    retreat(enemy, playerPosition, deltaTime) {
        enemy.state.isFleeing = true;
        const direction = this.getDirection(playerPosition, enemy.position); // Away from player
        const speed = 5; // even faster when fleeing
        
        enemy.position.x += direction.x * speed * deltaTime;
        enemy.position.z += direction.z * speed * deltaTime;
    }
    
    executeMeleeAttack(enemy, currentTime) {
        if (currentTime - enemy.lastAttackTime < enemy.attackCooldown) return null;
        
        enemy.lastAttackTime = currentTime;
        
        // Predict player dodge based on learning
        const predictedDodge = this.predictPlayerDodge(enemy);
        
        return {
            type: 'melee',
            damage: 10 + enemy.level * 2,
            position: enemy.position,
            predictedDodge: predictedDodge
        };
    }
    
    executeRangedAttack(enemy, playerPosition, currentTime) {
        if (currentTime - enemy.lastAttackTime < enemy.attackCooldown) return null;
        
        enemy.lastAttackTime = currentTime;
        
        // Lead target based on distance
        const distance = this.getDistance(enemy.position, playerPosition);
        const projectileSpeed = 20;
        const timeToHit = distance / projectileSpeed;
        
        return {
            type: 'ranged',
            damage: 8 + enemy.level * 1.5,
            position: enemy.position,
            target: playerPosition,
            timeToHit: timeToHit
        };
    }
    
    selectBestSkill(enemy, playerPosition) {
        const availableSkills = enemy.skills.filter(skill => {
            const cooldown = enemy.skillCooldowns.get(skill.id) || 0;
            return Date.now() - cooldown > skill.cooldown;
        });
        
        if (availableSkills.length === 0) {
            enemy.selectedSkill = null;
            return;
        }
        
        // Use learning data to counter player's most-used skill
        let bestSkill = availableSkills[0];
        const playerFavoriteSkill = this.getPlayerFavoriteSkill(enemy);
        
        if (playerFavoriteSkill) {
            const counterSkill = availableSkills.find(s => 
                s.counters && s.counters.includes(playerFavoriteSkill)
            );
            if (counterSkill) bestSkill = counterSkill;
        }
        
        enemy.selectedSkill = bestSkill;
    }
    
    castSkill(enemy, currentTime) {
        if (!enemy.selectedSkill) return null;
        
        enemy.skillCooldowns.set(enemy.selectedSkill.id, currentTime);
        
        return {
            type: 'skill',
            skill: enemy.selectedSkill,
            position: enemy.position,
            caster: enemy.id
        };
    }
    
    updatePackCoordination(enemy, playerPosition) {
        const allies = enemy.environmentalAwareness.nearestAllies;
        if (allies.length === 0) return;
        
        // Create or update pack data
        const packId = this.findOrCreatePack(enemy, allies);
        let pack = this.packCoordination.get(packId);
        
        if (!pack) {
            pack = {
                id: packId,
                members: [enemy.id, ...allies.map(a => a.id)],
                leader: enemy.id,
                target: playerPosition,
                formation: 'surround',
                nextCoordinatedAttack: Date.now() + 5000
            };
            this.packCoordination.set(packId, pack);
        }
        
        // Update pack target
        pack.target = playerPosition;
    }
    
    synchronizeWithAllies(enemy) {
        // Find pack
        for (const [packId, pack] of this.packCoordination) {
            if (pack.members.includes(enemy.id)) {
                enemy.packId = packId;
                enemy.isLeader = pack.leader === enemy.id;
                return pack;
            }
        }
        return null;
    }
    
    // Helper methods
    getDistance(pos1, pos2) {
        const dx = pos2.x - pos1.x;
        const dz = pos2.z - pos1.z;
        return Math.sqrt(dx * dx + dz * dz);
    }
    
    getDirection(from, to) {
        const dx = to.x - from.x;
        const dz = to.z - from.z;
        const length = Math.sqrt(dx * dx + dz * dz);
        return length > 0 ? { x: dx / length, z: dz / length } : { x: 0, z: 0 };
    }
    
    findNearbyPoints(position, type, radius) {
        // Simplified - would query actual world data
        return [];
    }
    
    hasAvailableSkill(enemy, currentTime) {
        return enemy.skills.some(skill => {
            const lastUse = enemy.skillCooldowns.get(skill.id) || 0;
            return currentTime - lastUse > skill.cooldown;
        });
    }
    
    evaluateTacticalAdvantage(enemy) {
        // Consider health, position, allies
        const healthPercent = enemy.health / enemy.maxHealth;
        const hasAllies = enemy.environmentalAwareness.nearestAllies.length > 0;
        const hasCover = enemy.environmentalAwareness.nearestCover !== null;
        
        return (healthPercent > 0.5 && hasAllies) || hasCover;
    }
    
    hasSharedTarget(enemy) {
        return enemy.environmentalAwareness.nearestAllies.some(ally => 
            ally.enemy.state.isAggro
        );
    }
    
    predictPlayerDodge(enemy) {
        const pattern = enemy.learningProfile.playerDodgePattern;
        if (pattern.length < 3) return null;
        
        // Simple pattern detection - player tends to dodge in same direction
        const recentDodges = pattern.slice(-3);
        const directions = recentDodges.map(d => d.direction);
        
        // If 2 out of 3 recent dodges are same direction, predict that
        const directionCounts = {};
        directions.forEach(dir => {
            directionCounts[dir] = (directionCounts[dir] || 0) + 1;
        });
        
        for (const dir in directionCounts) {
            if (directionCounts[dir] >= 2) return dir;
        }
        
        return null;
    }
    
    getPlayerFavoriteSkill(enemy) {
        const usage = enemy.learningProfile.playerSkillUsage;
        let maxCount = 0;
        let favoriteSkill = null;
        
        for (const [skill, count] of usage) {
            if (count > maxCount) {
                maxCount = count;
                favoriteSkill = skill;
            }
        }
        
        return favoriteSkill;
    }
    
    findOrCreatePack(enemy, allies) {
        // Use sorted member IDs as pack ID
        const memberIds = [enemy.id, ...allies.map(a => a.id)].sort();
        return memberIds.join('-');
    }
    
    // Stub methods for actions not fully implemented
    lookAround(enemy) { enemy.state.scanning = true; }
    prepareAttack(enemy) { enemy.state.preparing = true; }
    moveToHidingSpot(enemy, deltaTime) { /* Move to ambush point */ }
    waitInAmbush(enemy) { enemy.state.isHiding = true; }
    executeSurpriseAttack(enemy, playerPosition, currentTime) { 
        return this.executeMeleeAttack(enemy, currentTime);
    }
    callForHelp(enemy) { enemy.state.callingHelp = true; }
    useCombatSkill(enemy, currentTime) { /* Use basic skill */ }
    findRangedPosition(enemy, playerPosition, deltaTime) { /* Find optimal range */ }
    positionForSkill(enemy, playerPosition, deltaTime) { /* Move to skill range */ }
    moveInFormation(enemy, playerPosition, deltaTime) { /* Move with pack */ }
    executeComboSkill(enemy, currentTime) { /* Coordinated skill */ }
    
    // API methods
    getEnemyBehavior(enemyId) {
        const enemy = this.enemies.get(enemyId);
        return enemy ? enemy.currentBehavior : null;
    }
    
    getEnemyState(enemyId) {
        return this.enemies.get(enemyId);
    }
    
    removeEnemy(enemyId) {
        this.enemies.delete(enemyId);
    }
}
