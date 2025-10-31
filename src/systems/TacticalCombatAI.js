/**
 * TacticalCombatAI.js
 * Phase 5.4 - Advanced Tactical Combat AI System
 * Enemy formations, boss phases, cooperation, adaptive difficulty
 * ~600 lines
 */

export class TacticalCombatAI {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // AI difficulty levels
        this.difficultySettings = {
            easy: {
                reactionTime: 1000,
                accuracy: 0.5,
                strategyComplexity: 1,
                cooperationLevel: 0.3
            },
            normal: {
                reactionTime: 500,
                accuracy: 0.7,
                strategyComplexity: 2,
                cooperationLevel: 0.6
            },
            hard: {
                reactionTime: 250,
                accuracy: 0.85,
                strategyComplexity: 3,
                cooperationLevel: 0.8
            },
            expert: {
                reactionTime: 100,
                accuracy: 0.95,
                strategyComplexity: 4,
                cooperationLevel: 1.0
            }
        };
        
        this.currentDifficulty = 'normal';
        
        // Enemy formations
        this.formations = {
            circle: {
                name: 'Circle Formation',
                positions: (center, count, radius = 5) => {
                    const positions = [];
                    for (let i = 0; i < count; i++) {
                        const angle = (i / count) * Math.PI * 2;
                        positions.push({
                            x: center.x + Math.cos(angle) * radius,
                            z: center.z + Math.sin(angle) * radius
                        });
                    }
                    return positions;
                },
                strategy: 'surround'
            },
            line: {
                name: 'Line Formation',
                positions: (center, count, spacing = 2) => {
                    const positions = [];
                    const startX = center.x - (count / 2) * spacing;
                    for (let i = 0; i < count; i++) {
                        positions.push({
                            x: startX + i * spacing,
                            z: center.z
                        });
                    }
                    return positions;
                },
                strategy: 'frontal_assault'
            },
            wedge: {
                name: 'Wedge Formation',
                positions: (center, count) => {
                    const positions = [];
                    let row = 0;
                    let inRow = 1;
                    let totalPlaced = 0;
                    
                    while (totalPlaced < count) {
                        const startX = center.x - (inRow / 2) * 2;
                        for (let i = 0; i < inRow && totalPlaced < count; i++) {
                            positions.push({
                                x: startX + i * 2,
                                z: center.z - row * 2
                            });
                            totalPlaced++;
                        }
                        row++;
                        inRow += 2;
                    }
                    return positions;
                },
                strategy: 'breakthrough'
            },
            scattered: {
                name: 'Scattered Formation',
                positions: (center, count, radius = 10) => {
                    const positions = [];
                    for (let i = 0; i < count; i++) {
                        const angle = Math.random() * Math.PI * 2;
                        const distance = Math.random() * radius;
                        positions.push({
                            x: center.x + Math.cos(angle) * distance,
                            z: center.z + Math.sin(angle) * distance
                        });
                    }
                    return positions;
                },
                strategy: 'guerrilla'
            }
        };
        
        // Boss AI phases
        this.bossPhases = {
            phase1: {
                name: 'Normal',
                healthThreshold: 1.0,
                attackPattern: 'basic',
                speed: 1.0,
                abilities: ['basic_attack']
            },
            phase2: {
                name: 'Enraged',
                healthThreshold: 0.75,
                attackPattern: 'aggressive',
                speed: 1.3,
                abilities: ['basic_attack', 'power_attack', 'dash']
            },
            phase3: {
                name: 'Desperate',
                healthThreshold: 0.5,
                attackPattern: 'mixed',
                speed: 1.5,
                abilities: ['basic_attack', 'power_attack', 'dash', 'summon_minions']
            },
            phase4: {
                name: 'Berserk',
                healthThreshold: 0.25,
                attackPattern: 'chaos',
                speed: 1.8,
                abilities: ['basic_attack', 'power_attack', 'dash', 'summon_minions', 'ultimate']
            }
        };
        
        // Active enemy groups
        this.enemyGroups = [];
        
        // Adaptive difficulty tracking
        this.playerPerformance = {
            wins: 0,
            losses: 0,
            avgTimeToKill: 30,
            damageTaken: 0,
            perfectDodges: 0
        };
        
        // Cooperation strategies
        this.cooperationStrategies = [
            'focus_fire', // All attack same target
            'protect_weak', // Strong protect injured
            'combo_attack', // Coordinate special attacks
            'flank', // Split and surround
            'heal_support' // Healers prioritize allies
        ];
        
        logger.info('🧠 TacticalCombatAI initialized');
    }
    
    /**
     * Create enemy group with formation
     */
    createEnemyGroup(centerPosition, enemyCount, formationType = 'circle') {
        const formation = this.formations[formationType];
        if (!formation) {
            logger.warn('Unknown formation:', formationType);
            return null;
        }
        
        const positions = formation.positions(centerPosition, enemyCount);
        const strategy = formation.strategy;
        
        const group = {
            id: `group_${Date.now()}`,
            centerPosition,
            formation: formationType,
            strategy,
            enemies: [],
            active: true,
            createdAt: Date.now()
        };
        
        // Create enemies at positions
        positions.forEach((pos, index) => {
            group.enemies.push({
                id: `enemy_${Date.now()}_${index}`,
                position: { ...pos, y: 0 },
                formationPosition: index,
                targetPosition: pos,
                state: 'idle',
                health: 100,
                maxHealth: 100
            });
        });
        
        this.enemyGroups.push(group);
        logger.info(`👥 Created ${formationType} formation with ${enemyCount} enemies`);
        
        return group;
    }
    
    /**
     * Update boss AI based on current phase
     */
    updateBossAI(boss, deltaTime) {
        if (!boss) return;
        
        // Determine current phase based on health
        const healthPercent = boss.health / boss.maxHealth;
        let currentPhase = this.bossPhases.phase1;
        
        Object.values(this.bossPhases).forEach(phase => {
            if (healthPercent <= phase.healthThreshold) {
                currentPhase = phase;
            }
        });
        
        // Update boss behavior based on phase
        if (boss.currentPhase !== currentPhase.name) {
            boss.currentPhase = currentPhase.name;
            this.onBossPhaseTransition(boss, currentPhase);
        }
        
        // Execute phase-specific behavior
        this.executeBossPhase(boss, currentPhase, deltaTime);
    }
    
    /**
     * Handle boss phase transition
     */
    onBossPhaseTransition(boss, newPhase) {
        logger.info(`⚡ Boss entered ${newPhase.name} phase!`);
        
        // Apply phase bonuses
        boss.speed = boss.baseSpeed * newPhase.speed;
        boss.availableAbilities = newPhase.abilities;
        
        // Special phase transition effects
        if (newPhase.name === 'Enraged') {
            logger.info('💢 Boss is now enraged!');
        } else if (newPhase.name === 'Berserk') {
            logger.info('🔥 Boss has entered berserk mode!');
        }
    }
    
    /**
     * Execute boss phase behavior
     */
    executeBossPhase(boss, phase, deltaTime) {
        const pattern = phase.attackPattern;
        
        switch (pattern) {
            case 'basic':
                this.executeBasicPattern(boss, deltaTime);
                break;
            case 'aggressive':
                this.executeAggressivePattern(boss, deltaTime);
                break;
            case 'mixed':
                this.executeMixedPattern(boss, deltaTime);
                break;
            case 'chaos':
                this.executeChaosPattern(boss, deltaTime);
                break;
        }
    }
    
    /**
     * Execute basic attack pattern
     */
    executeBasicPattern(boss, deltaTime) {
        // Simple attack pattern
        if (!boss.nextAttackTime || Date.now() >= boss.nextAttackTime) {
            this.bossAttack(boss, 'basic_attack');
            boss.nextAttackTime = Date.now() + 2000; // Attack every 2 seconds
        }
    }
    
    /**
     * Execute aggressive pattern
     */
    executeAggressivePattern(boss, deltaTime) {
        if (!boss.nextAttackTime || Date.now() >= boss.nextAttackTime) {
            // Mix basic and power attacks
            const attack = Math.random() > 0.3 ? 'basic_attack' : 'power_attack';
            this.bossAttack(boss, attack);
            boss.nextAttackTime = Date.now() + 1500; // Faster attacks
        }
    }
    
    /**
     * Execute mixed pattern
     */
    executeMixedPattern(boss, deltaTime) {
        if (!boss.nextAttackTime || Date.now() >= boss.nextAttackTime) {
            // Random ability selection
            const abilities = boss.availableAbilities;
            const ability = abilities[Math.floor(Math.random() * abilities.length)];
            this.bossAttack(boss, ability);
            boss.nextAttackTime = Date.now() + 1000;
        }
    }
    
    /**
     * Execute chaos pattern
     */
    executeChaosPattern(boss, deltaTime) {
        // Rapid, unpredictable attacks
        if (!boss.nextAttackTime || Date.now() >= boss.nextAttackTime) {
            const abilities = boss.availableAbilities;
            const ability = abilities[Math.floor(Math.random() * abilities.length)];
            this.bossAttack(boss, ability);
            boss.nextAttackTime = Date.now() + (500 + Math.random() * 1000); // Variable timing
        }
    }
    
    /**
     * Boss executes an attack
     */
    bossAttack(boss, ability) {
        logger.info(`💥 Boss uses ${ability}!`);
        // Actual attack logic would go here
    }
    
    /**
     * Update enemy group tactics
     */
    updateGroupTactics(group, playerPosition, deltaTime) {
        if (!group.active) return;
        
        const difficulty = this.difficultySettings[this.currentDifficulty];
        const strategy = this.selectCooperationStrategy(group, difficulty);
        
        // Execute strategy
        switch (strategy) {
            case 'focus_fire':
                this.executeFocusFire(group, playerPosition);
                break;
            case 'protect_weak':
                this.executeProtectWeak(group);
                break;
            case 'combo_attack':
                this.executeComboAttack(group, playerPosition);
                break;
            case 'flank':
                this.executeFlank(group, playerPosition);
                break;
            case 'heal_support':
                this.executeHealSupport(group);
                break;
        }
        
        // Update individual enemy AI
        group.enemies.forEach(enemy => {
            this.updateEnemyAI(enemy, playerPosition, difficulty, deltaTime);
        });
    }
    
    /**
     * Select cooperation strategy based on situation
     */
    selectCooperationStrategy(group, difficulty) {
        const cooperationRoll = Math.random();
        
        if (cooperationRoll > difficulty.cooperationLevel) {
            return null; // No cooperation
        }
        
        // Analyze situation to pick best strategy
        const weakEnemies = group.enemies.filter(e => e.health < e.maxHealth * 0.3).length;
        const totalEnemies = group.enemies.length;
        
        if (weakEnemies > totalEnemies * 0.3) {
            return 'protect_weak';
        } else if (totalEnemies >= 3) {
            return 'combo_attack';
        } else {
            return this.cooperationStrategies[Math.floor(Math.random() * this.cooperationStrategies.length)];
        }
    }
    
    /**
     * Execute focus fire strategy
     */
    executeFocusFire(group, playerPosition) {
        // All enemies attack the same target (player)
        group.enemies.forEach(enemy => {
            enemy.targetPosition = playerPosition;
            enemy.strategy = 'aggressive';
        });
    }
    
    /**
     * Execute protect weak strategy
     */
    executeProtectWeak(group) {
        const weakEnemies = group.enemies.filter(e => e.health < e.maxHealth * 0.3);
        const strongEnemies = group.enemies.filter(e => e.health >= e.maxHealth * 0.3);
        
        // Strong enemies position themselves between weak ones and player
        strongEnemies.forEach(strong => {
            strong.strategy = 'protect';
        });
    }
    
    /**
     * Execute combo attack strategy
     */
    executeComboAttack(group, playerPosition) {
        // Coordinate attacks for combo effect
        const attackDelay = 500; // 0.5 second between attacks
        
        group.enemies.forEach((enemy, index) => {
            enemy.attackTime = Date.now() + (index * attackDelay);
            enemy.strategy = 'combo';
        });
    }
    
    /**
     * Execute flank strategy
     */
    executeFlank(group, playerPosition) {
        const halfCount = Math.floor(group.enemies.length / 2);
        
        // Split into two groups and flank from sides
        group.enemies.forEach((enemy, index) => {
            const side = index < halfCount ? -1 : 1;
            enemy.targetPosition = {
                x: playerPosition.x + side * 5,
                z: playerPosition.z
            };
            enemy.strategy = 'flank';
        });
    }
    
    /**
     * Execute heal support strategy
     */
    executeHealSupport(group) {
        // Designate healers to support damaged allies
        const healers = group.enemies.filter(e => e.type === 'healer');
        const damaged = group.enemies.filter(e => e.health < e.maxHealth * 0.7);
        
        healers.forEach(healer => {
            if (damaged.length > 0) {
                healer.healTarget = damaged[0];
                healer.strategy = 'support';
            }
        });
    }
    
    /**
     * Update individual enemy AI
     */
    updateEnemyAI(enemy, playerPosition, difficulty, deltaTime) {
        // Add reaction time delay
        if (!enemy.canAct) {
            if (!enemy.nextActionTime || Date.now() >= enemy.nextActionTime) {
                enemy.canAct = true;
            } else {
                return;
            }
        }
        
        // Calculate movement based on strategy
        const strategy = enemy.strategy || 'default';
        
        switch (strategy) {
            case 'aggressive':
                this.moveTowards(enemy, playerPosition, deltaTime);
                break;
            case 'defensive':
                this.maintainDistance(enemy, playerPosition, 5, deltaTime);
                break;
            case 'evasive':
                this.evadePlayer(enemy, playerPosition, deltaTime);
                break;
            default:
                // Basic AI
                const distance = this.getDistance(enemy.position, playerPosition);
                if (distance > 10) {
                    this.moveTowards(enemy, playerPosition, deltaTime);
                } else if (distance < 3) {
                    this.moveAway(enemy, playerPosition, deltaTime);
                }
        }
        
        // Set next action time based on reaction time
        enemy.canAct = false;
        enemy.nextActionTime = Date.now() + difficulty.reactionTime;
    }
    
    /**
     * Move enemy towards target
     */
    moveTowards(enemy, targetPos, deltaTime) {
        const dx = targetPos.x - enemy.position.x;
        const dz = targetPos.z - enemy.position.z;
        const distance = Math.sqrt(dx * dx + dz * dz);
        
        if (distance > 0.5) {
            const speed = 2;
            enemy.position.x += (dx / distance) * speed * deltaTime * 0.01;
            enemy.position.z += (dz / distance) * speed * deltaTime * 0.01;
        }
    }
    
    /**
     * Move enemy away from target
     */
    moveAway(enemy, targetPos, deltaTime) {
        const dx = enemy.position.x - targetPos.x;
        const dz = enemy.position.z - targetPos.z;
        const distance = Math.sqrt(dx * dx + dz * dz);
        
        if (distance > 0.1) {
            const speed = 2;
            enemy.position.x += (dx / distance) * speed * deltaTime * 0.01;
            enemy.position.z += (dz / distance) * speed * deltaTime * 0.01;
        }
    }
    
    /**
     * Maintain distance from target
     */
    maintainDistance(enemy, targetPos, idealDistance, deltaTime) {
        const distance = this.getDistance(enemy.position, targetPos);
        
        if (distance < idealDistance - 1) {
            this.moveAway(enemy, targetPos, deltaTime);
        } else if (distance > idealDistance + 1) {
            this.moveTowards(enemy, targetPos, deltaTime);
        }
    }
    
    /**
     * Evade player
     */
    evadePlayer(enemy, playerPos, deltaTime) {
        // Move perpendicular to player direction
        const dx = enemy.position.x - playerPos.x;
        const dz = enemy.position.z - playerPos.z;
        
        enemy.position.x += dz * deltaTime * 0.01;
        enemy.position.z -= dx * deltaTime * 0.01;
    }
    
    /**
     * Get distance between positions
     */
    getDistance(pos1, pos2) {
        const dx = pos1.x - pos2.x;
        const dz = pos1.z - pos2.z;
        return Math.sqrt(dx * dx + dz * dz);
    }
    
    /**
     * Update adaptive difficulty
     */
    updateAdaptiveDifficulty(playerWon, timeToKill, damageTaken) {
        if (playerWon) {
            this.playerPerformance.wins++;
        } else {
            this.playerPerformance.losses++;
        }
        
        this.playerPerformance.avgTimeToKill = 
            (this.playerPerformance.avgTimeToKill + timeToKill) / 2;
        this.playerPerformance.damageTaken += damageTaken;
        
        // Adjust difficulty based on performance
        const winRate = this.playerPerformance.wins / 
            (this.playerPerformance.wins + this.playerPerformance.losses);
        
        if (winRate > 0.8 && this.currentDifficulty !== 'expert') {
            this.increaseDifficulty();
        } else if (winRate < 0.3 && this.currentDifficulty !== 'easy') {
            this.decreaseDifficulty();
        }
    }
    
    /**
     * Increase AI difficulty
     */
    increaseDifficulty() {
        const levels = ['easy', 'normal', 'hard', 'expert'];
        const currentIndex = levels.indexOf(this.currentDifficulty);
        if (currentIndex < levels.length - 1) {
            this.currentDifficulty = levels[currentIndex + 1];
            logger.info(`⚡ AI Difficulty increased to: ${this.currentDifficulty}`);
        }
    }
    
    /**
     * Decrease AI difficulty
     */
    decreaseDifficulty() {
        const levels = ['easy', 'normal', 'hard', 'expert'];
        const currentIndex = levels.indexOf(this.currentDifficulty);
        if (currentIndex > 0) {
            this.currentDifficulty = levels[currentIndex - 1];
            logger.info(`📉 AI Difficulty decreased to: ${this.currentDifficulty}`);
        }
    }
    
    /**
     * Update system
     */
    update(deltaTime, playerPosition) {
        // Update all enemy groups
        this.enemyGroups.forEach(group => {
            if (group.active) {
                this.updateGroupTactics(group, playerPosition, deltaTime);
            }
        });
    }
    
    /**
     * Get system state
     */
    getState() {
        return {
            difficulty: this.currentDifficulty,
            activeGroups: this.enemyGroups.filter(g => g.active).length,
            playerPerformance: this.playerPerformance
        };
    }
}
