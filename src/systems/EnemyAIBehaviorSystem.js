/**
 * Enhanced Enemy AI and Behavior System
 * Comprehensive AI with advanced behaviors, tactics, and reactions
 */

export class EnemyAIBehaviorSystem {
    constructor() {
        this.enemies = new Map();
        this.behaviorStates = {
            IDLE: 'idle',
            PATROL: 'patrol',
            ALERT: 'alert',
            CHASE: 'chase',
            ATTACK: 'attack',
            FLEE: 'flee',
            DEAD: 'dead'
        };
        
        this.enemyTypes = this.defineEnemyTypes();
        this.bossTypes = this.defineBossTypes();
        this.eliteModifiers = this.defineEliteModifiers();
    }

    defineEnemyTypes() {
        return {
            // Melee enemies
            GOBLIN: {
                name: 'Goblin',
                baseHP: 100,
                baseAttack: 15,
                baseDefense: 5,
                moveSpeed: 3.5,
                attackRange: 2,
                detectionRange: 15,
                personality: 'cowardly',
                abilities: ['quick_strike', 'backstab'],
                lootTable: ['common_weapon', 'gold', 'potion'],
                xp: 50
            },
            ORC: {
                name: 'Orc',
                baseHP: 250,
                baseAttack: 30,
                baseDefense: 15,
                moveSpeed: 2.5,
                attackRange: 3,
                detectionRange: 20,
                personality: 'aggressive',
                abilities: ['power_slam', 'war_cry'],
                lootTable: ['uncommon_weapon', 'armor_piece', 'gold'],
                xp: 100
            },
            TROLL: {
                name: 'Troll',
                baseHP: 500,
                baseAttack: 45,
                baseDefense: 25,
                moveSpeed: 2,
                attackRange: 4,
                detectionRange: 18,
                personality: 'defensive',
                abilities: ['regeneration', 'ground_smash'],
                lootTable: ['rare_material', 'troll_hide', 'gold'],
                xp: 200
            },
            
            // Ranged enemies
            SKELETON_ARCHER: {
                name: 'Skeleton Archer',
                baseHP: 80,
                baseAttack: 25,
                baseDefense: 3,
                moveSpeed: 3,
                attackRange: 20,
                detectionRange: 25,
                personality: 'tactical',
                abilities: ['arrow_volley', 'piercing_shot'],
                lootTable: ['arrows', 'bow', 'bones'],
                xp: 60
            },
            DARK_MAGE: {
                name: 'Dark Mage',
                baseHP: 150,
                baseAttack: 40,
                baseDefense: 8,
                moveSpeed: 2.8,
                attackRange: 25,
                detectionRange: 30,
                personality: 'tactical',
                abilities: ['shadow_bolt', 'curse', 'teleport'],
                lootTable: ['spell_scroll', 'mana_crystal', 'staff'],
                xp: 150
            },
            
            // Flying enemies
            HARPY: {
                name: 'Harpy',
                baseHP: 120,
                baseAttack: 20,
                baseDefense: 10,
                moveSpeed: 5,
                attackRange: 5,
                detectionRange: 30,
                personality: 'aggressive',
                abilities: ['dive_attack', 'screech'],
                canFly: true,
                lootTable: ['feather', 'talon', 'gold'],
                xp: 80
            },
            
            // Beast enemies
            DIRE_WOLF: {
                name: 'Dire Wolf',
                baseHP: 180,
                baseAttack: 28,
                baseDefense: 12,
                moveSpeed: 4.5,
                attackRange: 2.5,
                detectionRange: 25,
                personality: 'aggressive',
                abilities: ['pack_howl', 'savage_bite'],
                packBehavior: true,
                lootTable: ['wolf_pelt', 'fang', 'meat'],
                xp: 90
            },
            
            // Undead
            ZOMBIE: {
                name: 'Zombie',
                baseHP: 150,
                baseAttack: 18,
                baseDefense: 8,
                moveSpeed: 1.5,
                attackRange: 2,
                detectionRange: 12,
                personality: 'aggressive',
                abilities: ['infectious_bite', 'undead_resilience'],
                lootTable: ['rotten_flesh', 'virus_sample'],
                xp: 70
            },
            WRAITH: {
                name: 'Wraith',
                baseHP: 200,
                baseAttack: 35,
                baseDefense: 5,
                moveSpeed: 4,
                attackRange: 3,
                detectionRange: 20,
                personality: 'aggressive',
                abilities: ['phase_shift', 'life_drain', 'spectral_touch'],
                lootTable: ['ectoplasm', 'soul_fragment'],
                xp: 120
            },
            
            // Elemental
            FIRE_ELEMENTAL: {
                name: 'Fire Elemental',
                baseHP: 220,
                baseAttack: 38,
                baseDefense: 15,
                moveSpeed: 3,
                attackRange: 15,
                detectionRange: 20,
                personality: 'aggressive',
                abilities: ['fireball', 'flame_aura', 'combustion'],
                immunities: ['fire'],
                weaknesses: ['water', 'ice'],
                lootTable: ['fire_essence', 'ember_core'],
                xp: 140
            },
            ICE_ELEMENTAL: {
                name: 'Ice Elemental',
                baseHP: 220,
                baseAttack: 32,
                baseDefense: 20,
                moveSpeed: 2.5,
                attackRange: 15,
                detectionRange: 20,
                personality: 'defensive',
                abilities: ['ice_shard', 'freeze_aura', 'blizzard'],
                immunities: ['ice'],
                weaknesses: ['fire'],
                lootTable: ['ice_essence', 'frozen_core'],
                xp: 140
            }
        };
    }

    defineBossTypes() {
        return {
            GOBLIN_KING: {
                name: 'Goblin King',
                baseHP: 5000,
                baseAttack: 80,
                baseDefense: 40,
                moveSpeed: 3,
                attackRange: 5,
                detectionRange: 50,
                personality: 'elite',
                phases: [
                    {
                        hpThreshold: 100,
                        abilities: ['royal_slash', 'summon_goblins'],
                        behavior: 'aggressive'
                    },
                    {
                        hpThreshold: 50,
                        abilities: ['royal_slash', 'summon_goblins', 'berserker_rage'],
                        behavior: 'berserker',
                        speedMultiplier: 1.5
                    },
                    {
                        hpThreshold: 25,
                        abilities: ['royal_slash', 'summon_elite_goblins', 'berserker_rage', 'crown_of_thorns'],
                        behavior: 'desperate',
                        speedMultiplier: 2,
                        damageMultiplier: 1.5
                    }
                ],
                lootTable: ['legendary_weapon', 'goblin_crown', 'gold_pile'],
                xp: 5000
            },
            
            DRAGON: {
                name: 'Ancient Dragon',
                baseHP: 20000,
                baseAttack: 150,
                baseDefense: 80,
                moveSpeed: 4,
                attackRange: 30,
                detectionRange: 100,
                personality: 'boss',
                canFly: true,
                phases: [
                    {
                        hpThreshold: 100,
                        abilities: ['fire_breath', 'tail_swipe', 'wing_buffet'],
                        behavior: 'tactical',
                        flying: false
                    },
                    {
                        hpThreshold: 66,
                        abilities: ['fire_breath', 'tail_swipe', 'wing_buffet', 'aerial_assault'],
                        behavior: 'aggressive',
                        flying: true
                    },
                    {
                        hpThreshold: 33,
                        abilities: ['fire_breath', 'tail_swipe', 'inferno_rain', 'dragon_roar'],
                        behavior: 'berserker',
                        flying: false,
                        damageMultiplier: 1.8
                    },
                    {
                        hpThreshold: 10,
                        abilities: ['apocalypse_breath', 'cataclysm', 'dragon_rage'],
                        behavior: 'desperate',
                        flying: true,
                        damageMultiplier: 2.5,
                        speedMultiplier: 1.5
                    }
                ],
                lootTable: ['mythic_weapon', 'dragon_scale', 'dragon_heart', 'massive_gold'],
                xp: 50000
            },
            
            LICH_LORD: {
                name: 'Lich Lord',
                baseHP: 15000,
                baseAttack: 120,
                baseDefense: 60,
                moveSpeed: 2,
                attackRange: 40,
                detectionRange: 80,
                personality: 'boss',
                phases: [
                    {
                        hpThreshold: 100,
                        abilities: ['death_bolt', 'summon_skeletons', 'life_drain'],
                        behavior: 'tactical'
                    },
                    {
                        hpThreshold: 75,
                        abilities: ['death_bolt', 'summon_wraiths', 'life_drain', 'curse_of_weakness'],
                        behavior: 'aggressive'
                    },
                    {
                        hpThreshold: 50,
                        abilities: ['death_wave', 'summon_death_knight', 'life_drain', 'plague_storm'],
                        behavior: 'tactical',
                        summonPhylactery: true
                    },
                    {
                        hpThreshold: 25,
                        abilities: ['apocalypse', 'summon_army', 'death_realm', 'soul_harvest'],
                        behavior: 'desperate',
                        damageMultiplier: 2,
                        invulnerablePhases: true
                    }
                ],
                lootTable: ['legendary_staff', 'phylactery_fragment', 'necromancy_tome', 'soul_gems'],
                xp: 40000
            }
        };
    }

    defineEliteModifiers() {
        return {
            ENRAGED: {
                name: 'Enraged',
                hpMultiplier: 1.5,
                damageMultiplier: 1.8,
                speedMultiplier: 1.3,
                color: 'red',
                aura: 'flame'
            },
            FORTIFIED: {
                name: 'Fortified',
                hpMultiplier: 2,
                defenseMultiplier: 2,
                damageReduction: 0.3,
                color: 'gray',
                aura: 'stone'
            },
            SWIFT: {
                name: 'Swift',
                hpMultiplier: 1.2,
                speedMultiplier: 2,
                dodgeChance: 0.3,
                color: 'cyan',
                aura: 'wind'
            },
            VAMPIRIC: {
                name: 'Vampiric',
                hpMultiplier: 1.3,
                lifesteal: 0.3,
                abilities: ['life_drain'],
                color: 'crimson',
                aura: 'blood'
            },
            TOXIC: {
                name: 'Toxic',
                hpMultiplier: 1.3,
                abilities: ['poison_cloud', 'toxic_attack'],
                color: 'green',
                aura: 'poison'
            },
            ARCANE: {
                name: 'Arcane',
                hpMultiplier: 1.4,
                damageMultiplier: 1.5,
                abilities: ['arcane_shield', 'teleport', 'magic_missile'],
                color: 'purple',
                aura: 'magic'
            }
        };
    }

    createEnemy(type, position, level = 1, isElite = false, eliteModifier = null) {
        const enemyData = this.enemyTypes[type] || this.enemyTypes.GOBLIN;
        const enemy = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            level,
            position: { ...position },
            
            // Stats scaled by level
            maxHP: enemyData.baseHP * (1 + (level - 1) * 0.15),
            hp: enemyData.baseHP * (1 + (level - 1) * 0.15),
            attack: enemyData.baseAttack * (1 + (level - 1) * 0.12),
            defense: enemyData.baseDefense * (1 + (level - 1) * 0.1),
            moveSpeed: enemyData.moveSpeed,
            
            // Behavior
            state: this.behaviorStates.PATROL,
            personality: enemyData.personality,
            target: null,
            lastSeenPosition: null,
            alertLevel: 0,
            
            // Combat
            attackRange: enemyData.attackRange,
            detectionRange: enemyData.detectionRange,
            lastAttackTime: 0,
            attackCooldown: 1000,
            abilities: [...enemyData.abilities],
            lastAbilityUse: {},
            
            // Pathfinding
            path: [],
            pathUpdateTime: 0,
            stuckCounter: 0,
            
            // Special
            canFly: enemyData.canFly || false,
            packBehavior: enemyData.packBehavior || false,
            immunities: enemyData.immunities || [],
            weaknesses: enemyData.weaknesses || [],
            
            // Loot & XP
            lootTable: enemyData.lootTable,
            xp: enemyData.xp * level,
            
            // AI memory
            memory: {
                playerLastPosition: null,
                timeSinceLastSeen: 0,
                damageReceived: [],
                alliesNearby: [],
                healthThreshold: 0.3
            }
        };

        // Apply elite modifiers
        if (isElite && eliteModifier) {
            const modifier = this.eliteModifiers[eliteModifier];
            if (modifier) {
                enemy.isElite = true;
                enemy.eliteType = eliteModifier;
                enemy.maxHP *= modifier.hpMultiplier || 1;
                enemy.hp = enemy.maxHP;
                enemy.attack *= modifier.damageMultiplier || 1;
                enemy.defense *= modifier.defenseMultiplier || 1;
                enemy.moveSpeed *= modifier.speedMultiplier || 1;
                if (modifier.abilities) {
                    enemy.abilities.push(...modifier.abilities);
                }
                enemy.eliteModifier = modifier;
            }
        }

        this.enemies.set(enemy.id, enemy);
        return enemy;
    }

    createBoss(type, position, level = 1) {
        const bossData = this.bossTypes[type] || this.bossTypes.GOBLIN_KING;
        const boss = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            level,
            position: { ...position },
            isBoss: true,
            
            // Stats
            maxHP: bossData.baseHP * (1 + (level - 1) * 0.2),
            hp: bossData.baseHP * (1 + (level - 1) * 0.2),
            attack: bossData.baseAttack * (1 + (level - 1) * 0.15),
            defense: bossData.baseDefense * (1 + (level - 1) * 0.12),
            moveSpeed: bossData.moveSpeed,
            
            // Boss-specific
            currentPhase: 0,
            phases: bossData.phases,
            phaseTransitioning: false,
            
            // Behavior
            state: this.behaviorStates.IDLE,
            personality: bossData.personality,
            target: null,
            
            // Combat
            attackRange: bossData.attackRange,
            detectionRange: bossData.detectionRange,
            lastAttackTime: 0,
            attackCooldown: 800,
            abilities: [...bossData.phases[0].abilities],
            lastAbilityUse: {},
            
            // Special
            canFly: bossData.canFly || false,
            isFlying: false,
            
            // Loot & XP
            lootTable: bossData.lootTable,
            xp: bossData.xp * level,
            
            // AI
            memory: {
                playerLastPosition: null,
                timeSinceLastSeen: 0,
                summonedMinions: [],
                phaseAbilitiesUsed: []
            }
        };

        this.enemies.set(boss.id, boss);
        return boss;
    }

    update(deltaTime, player, allEnemies) {
        for (const [id, enemy] of this.enemies) {
            if (enemy.state === this.behaviorStates.DEAD) continue;

            // Check for boss phase transitions
            if (enemy.isBoss) {
                this.updateBossPhase(enemy);
            }

            // Update AI state machine
            this.updateBehaviorState(enemy, player, allEnemies, deltaTime);

            // Execute current behavior
            this.executeBehavior(enemy, player, deltaTime);

            // Update memory
            this.updateMemory(enemy, player, deltaTime);
        }
    }

    updateBehaviorState(enemy, player, allEnemies, deltaTime) {
        const distanceToPlayer = this.getDistance(enemy.position, player.position);

        switch (enemy.state) {
            case this.behaviorStates.IDLE:
                if (distanceToPlayer < enemy.detectionRange) {
                    enemy.state = this.behaviorStates.ALERT;
                    enemy.alertLevel = 50;
                } else if (Math.random() < 0.01) {
                    enemy.state = this.behaviorStates.PATROL;
                }
                break;

            case this.behaviorStates.PATROL:
                if (distanceToPlayer < enemy.detectionRange) {
                    enemy.state = this.behaviorStates.ALERT;
                    enemy.alertLevel = 50;
                }
                break;

            case this.behaviorStates.ALERT:
                enemy.alertLevel += deltaTime * 20;
                if (enemy.alertLevel >= 100) {
                    enemy.state = this.behaviorStates.CHASE;
                    enemy.target = player;
                } else if (distanceToPlayer > enemy.detectionRange * 1.5) {
                    enemy.alertLevel = 0;
                    enemy.state = this.behaviorStates.PATROL;
                }
                break;

            case this.behaviorStates.CHASE:
                if (distanceToPlayer <= enemy.attackRange) {
                    enemy.state = this.behaviorStates.ATTACK;
                } else if (distanceToPlayer > enemy.detectionRange * 2) {
                    enemy.state = this.behaviorStates.PATROL;
                    enemy.target = null;
                }
                
                // Flee if low HP (cowardly personality)
                if (enemy.personality === 'cowardly' && enemy.hp < enemy.maxHP * 0.3) {
                    enemy.state = this.behaviorStates.FLEE;
                }
                break;

            case this.behaviorStates.ATTACK:
                if (distanceToPlayer > enemy.attackRange * 1.5) {
                    enemy.state = this.behaviorStates.CHASE;
                } else if (enemy.personality === 'defensive' && enemy.hp < enemy.maxHP * 0.5) {
                    if (Math.random() < 0.1) {
                        enemy.state = this.behaviorStates.FLEE;
                    }
                }
                break;

            case this.behaviorStates.FLEE:
                // Stop fleeing if far enough or HP recovered
                if (distanceToPlayer > enemy.detectionRange * 2 || enemy.hp > enemy.maxHP * 0.6) {
                    enemy.state = this.behaviorStates.PATROL;
                }
                break;
        }

        // Pack behavior - call for help
        if (enemy.packBehavior && enemy.state === this.behaviorStates.CHASE) {
            this.callNearbyAllies(enemy, allEnemies);
        }
    }

    executeBehavior(enemy, player, deltaTime) {
        switch (enemy.state) {
            case this.behaviorStates.IDLE:
                // Just stand there, maybe look around
                break;

            case this.behaviorStates.PATROL:
                this.patrolBehavior(enemy, deltaTime);
                break;

            case this.behaviorStates.ALERT:
                // Look towards player, ready to engage
                this.lookAtTarget(enemy, player.position);
                break;

            case this.behaviorStates.CHASE:
                this.chaseBehavior(enemy, player, deltaTime);
                break;

            case this.behaviorStates.ATTACK:
                this.attackBehavior(enemy, player, deltaTime);
                break;

            case this.behaviorStates.FLEE:
                this.fleeBehavior(enemy, player, deltaTime);
                break;
        }
    }

    patrolBehavior(enemy, deltaTime) {
        // Simple patrol: wander randomly
        if (!enemy.patrolTarget || this.getDistance(enemy.position, enemy.patrolTarget) < 1) {
            // Pick new patrol point within 20 units
            enemy.patrolTarget = {
                x: enemy.position.x + (Math.random() - 0.5) * 40,
                y: enemy.position.y,
                z: enemy.position.z + (Math.random() - 0.5) * 40
            };
        }

        this.moveTowards(enemy, enemy.patrolTarget, deltaTime * 0.5); // Slower patrol speed
    }

    chaseBehavior(enemy, player, deltaTime) {
        // Different chase tactics based on personality
        switch (enemy.personality) {
            case 'aggressive':
                // Direct pursuit
                this.moveTowards(enemy, player.position, deltaTime);
                break;

            case 'tactical':
                // Try to flank
                const flankPosition = this.calculateFlankPosition(enemy, player);
                this.moveTowards(enemy, flankPosition, deltaTime * 0.9);
                break;

            case 'defensive':
                // Maintain some distance, circle
                if (this.getDistance(enemy.position, player.position) < enemy.attackRange * 0.7) {
                    this.moveAwayFrom(enemy, player.position, deltaTime * 0.8);
                } else {
                    this.moveTowards(enemy, player.position, deltaTime * 0.7);
                }
                break;

            default:
                this.moveTowards(enemy, player.position, deltaTime);
        }
    }

    attackBehavior(enemy, player, deltaTime) {
        const now = Date.now();
        
        // Check if can attack
        if (now - enemy.lastAttackTime > enemy.attackCooldown) {
            // Face target
            this.lookAtTarget(enemy, player.position);
            
            // Use ability or basic attack
            if (enemy.abilities.length > 0 && Math.random() < 0.3) {
                this.useRandomAbility(enemy, player);
            } else {
                this.performBasicAttack(enemy, player);
            }
            
            enemy.lastAttackTime = now;
        }
    }

    fleeBehavior(enemy, player, deltaTime) {
        // Run away from player
        this.moveAwayFrom(enemy, player.position, deltaTime * 1.2); // Faster when fleeing
        
        // Try to find allies
        if (enemy.packBehavior && Math.random() < 0.05) {
            enemy.state = this.behaviorStates.CHASE; // Brave up if allies nearby
        }
    }

    updateBossPhase(boss) {
        const hpPercent = (boss.hp / boss.maxHP) * 100;
        const currentPhase = boss.currentPhase;
        
        // Check if should transition to next phase
        if (currentPhase < boss.phases.length - 1) {
            const nextPhase = boss.phases[currentPhase + 1];
            if (hpPercent <= nextPhase.hpThreshold && !boss.phaseTransitioning) {
                boss.phaseTransitioning = true;
                boss.currentPhase++;
                
                // Update abilities for new phase
                boss.abilities = [...boss.phases[boss.currentPhase].abilities];
                
                // Apply phase multipliers
                const phase = boss.phases[boss.currentPhase];
                if (phase.speedMultiplier) {
                    boss.moveSpeed *= phase.speedMultiplier;
                }
                if (phase.damageMultiplier) {
                    boss.attack *= phase.damageMultiplier;
                }
                if (phase.flying !== undefined) {
                    boss.isFlying = phase.flying;
                }
                
                // Trigger phase transition effects (heal, summons, etc.)
                this.triggerPhaseTransition(boss);
                
                setTimeout(() => { boss.phaseTransitioning = false; }, 2000);
            }
        }
    }

    triggerPhaseTransition(boss) {
        // Heal a bit
        boss.hp = Math.min(boss.maxHP, boss.hp + boss.maxHP * 0.1);
        
        // Become invulnerable briefly
        boss.invulnerable = true;
        setTimeout(() => { boss.invulnerable = false; }, 3000);
        
        // Visual effects, roar, etc. would go here
    }

    moveTowards(enemy, target, deltaTime) {
        const dx = target.x - enemy.position.x;
        const dz = target.z - enemy.position.z;
        const distance = Math.sqrt(dx * dx + dz * dz);
        
        if (distance > 0.1) {
            const moveDistance = enemy.moveSpeed * deltaTime;
            enemy.position.x += (dx / distance) * moveDistance;
            enemy.position.z += (dz / distance) * moveDistance;
        }
    }

    moveAwayFrom(enemy, target, deltaTime) {
        const dx = enemy.position.x - target.x;
        const dz = enemy.position.z - target.z;
        const distance = Math.sqrt(dx * dx + dz * dz);
        
        if (distance > 0.1) {
            const moveDistance = enemy.moveSpeed * deltaTime;
            enemy.position.x += (dx / distance) * moveDistance;
            enemy.position.z += (dz / distance) * moveDistance;
        }
    }

    lookAtTarget(enemy, target) {
        const dx = target.x - enemy.position.x;
        const dz = target.z - enemy.position.z;
        enemy.rotation = Math.atan2(dx, dz);
    }

    calculateFlankPosition(enemy, player) {
        const angle = Math.random() * Math.PI * 2;
        const distance = enemy.attackRange * 0.8;
        return {
            x: player.position.x + Math.cos(angle) * distance,
            y: player.position.y,
            z: player.position.z + Math.sin(angle) * distance
        };
    }

    callNearbyAllies(enemy, allEnemies) {
        for (const ally of allEnemies) {
            if (ally.id !== enemy.id && ally.type === enemy.type) {
                const distance = this.getDistance(enemy.position, ally.position);
                if (distance < 30 && ally.state === this.behaviorStates.PATROL) {
                    ally.state = this.behaviorStates.CHASE;
                    ally.target = enemy.target;
                }
            }
        }
    }

    useRandomAbility(enemy, player) {
        if (enemy.abilities.length === 0) return;
        
        const ability = enemy.abilities[Math.floor(Math.random() * enemy.abilities.length)];
        // Ability execution would be handled by combat system
        enemy.lastAbilityUse[ability] = Date.now();
    }

    performBasicAttack(enemy, player) {
        // Calculate damage
        const damage = enemy.attack * (1 - player.defense / (player.defense + 100));
        // Damage application would be handled by combat system
    }

    updateMemory(enemy, player, deltaTime) {
        enemy.memory.timeSinceLastSeen += deltaTime;
        
        const distanceToPlayer = this.getDistance(enemy.position, player.position);
        if (distanceToPlayer < enemy.detectionRange) {
            enemy.memory.playerLastPosition = { ...player.position };
            enemy.memory.timeSinceLastSeen = 0;
        }
    }

    takeDamage(enemyId, damage, source) {
        const enemy = this.enemies.get(enemyId);
        if (!enemy || enemy.state === this.behaviorStates.DEAD) return;

        // Apply damage
        enemy.hp -= damage;
        
        // Record damage in memory
        enemy.memory.damageReceived.push({
            amount: damage,
            source,
            time: Date.now()
        });

        // Become alert if hit while idle/patrol
        if (enemy.state === this.behaviorStates.IDLE || enemy.state === this.behaviorStates.PATROL) {
            enemy.state = this.behaviorStates.ALERT;
            enemy.alertLevel = 100;
        }

        // Check if dead
        if (enemy.hp <= 0) {
            enemy.hp = 0;
            enemy.state = this.behaviorStates.DEAD;
            this.onEnemyDeath(enemy);
        }
    }

    onEnemyDeath(enemy) {
        // Drop loot
        const loot = this.generateLoot(enemy);
        
        // Grant XP
        const xp = enemy.xp;
        
        // Clean up after delay
        setTimeout(() => {
            this.enemies.delete(enemy.id);
        }, 5000);

        return { loot, xp };
    }

    generateLoot(enemy) {
        const loot = [];
        for (const item of enemy.lootTable) {
            if (Math.random() < 0.3) { // 30% drop chance per item
                loot.push(item);
            }
        }
        return loot;
    }

    getDistance(pos1, pos2) {
        const dx = pos1.x - pos2.x;
        const dz = pos1.z - pos2.z;
        return Math.sqrt(dx * dx + dz * dz);
    }

    getEnemyById(id) {
        return this.enemies.get(id);
    }

    getAllEnemies() {
        return Array.from(this.enemies.values());
    }

    getEnemiesInRange(position, range) {
        return this.getAllEnemies().filter(enemy => {
            return this.getDistance(enemy.position, position) <= range;
        });
    }

    clearAllEnemies() {
        this.enemies.clear();
    }
}
