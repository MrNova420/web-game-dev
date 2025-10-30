/**
 * Combat & Enemy System - Dynasty of Emberveil
 * 
 * COMPLETE FIGHTING RPG COMBAT SYSTEM
 * 
 * Features:
 * - Real-time action combat
 * - Magic spells and abilities
 * - Enemy AI with behaviors
 * - Dynamic enemy spawning
 * - World events
 * - Boss encounters
 * - Loot and XP system
 * - Combo system
 * - Dodge/parry mechanics
 */

import * as THREE from 'three';
import { assetRegistry } from '../core/AssetRegistry.js';

export class CombatEnemySystem {
    constructor(scene, modelLoader, player) {
        this.scene = scene;
        this.modelLoader = modelLoader;
        this.player = player;
        this.assetRegistry = assetRegistry;
        
        // Enemy management
        this.activeEnemies = [];
        this.enemySpawnPoints = [];
        this.maxEnemies = 100; // Max enemies in world at once
        
        // Enemy types with stats
        this.enemyTypes = {
            // Starting zone enemies (Level 1-15)
            skeleton_minion: {
                name: 'Skeleton Minion',
                model: 'Skeleton_Minion.glb',
                level: 1,
                health: 50,
                damage: 5,
                xp: 10,
                loot: ['bones', 'rusty_sword'],
                behavior: 'aggressive',
                speed: 2
            },
            skeleton_warrior: {
                name: 'Skeleton Warrior',
                model: 'Skeleton_Warrior.glb',
                level: 5,
                health: 120,
                damage: 15,
                xp: 30,
                loot: ['bones', 'iron_sword', 'leather_armor'],
                behavior: 'aggressive',
                speed: 3
            },
            skeleton_mage: {
                name: 'Skeleton Mage',
                model: 'Skeleton_Mage.glb',
                level: 8,
                health: 80,
                damage: 25,
                xp: 50,
                loot: ['magic_essence', 'staff', 'mana_potion'],
                behavior: 'ranged',
                speed: 2.5
            },
            skeleton_rogue: {
                name: 'Skeleton Rogue',
                model: 'Skeleton_Rogue.glb',
                level: 10,
                health: 100,
                damage: 30,
                xp: 60,
                loot: ['daggers', 'gold', 'rare_gem'],
                behavior: 'stealth',
                speed: 4
            },
            
            // Elite enemies
            skeleton_captain: {
                name: 'Skeleton Captain',
                level: 15,
                health: 300,
                damage: 40,
                xp: 150,
                loot: ['epic_sword', 'gold', 'rare_armor'],
                behavior: 'tactical',
                speed: 3,
                isElite: true
            },
            
            // World boss
            ancient_lich: {
                name: 'Ancient Lich',
                level: 20,
                health: 5000,
                damage: 100,
                xp: 1000,
                loot: ['legendary_staff', 'lich_crown', 'epic_loot_chest'],
                behavior: 'boss',
                speed: 2,
                isBoss: true,
                abilities: ['death_ray', 'summon_skeletons', 'life_drain']
            }
        };
        
        // World events
        this.worldEvents = [];
        this.activeEvents = [];
        
        // Combat state
        this.inCombat = false;
        this.combatMusic = null;
        this.comboCounter = 0;
        this.lastHitTime = 0;
        
        // Magic system
        this.magicSpells = {
            fireball: {
                name: 'Fireball',
                damage: 50,
                manaCost: 20,
                cooldown: 3000,
                element: 'fire',
                effect: 'explosive'
            },
            ice_lance: {
                name: 'Ice Lance',
                damage: 40,
                manaCost: 15,
                cooldown: 2000,
                element: 'ice',
                effect: 'freeze'
            },
            lightning_bolt: {
                name: 'Lightning Bolt',
                damage: 60,
                manaCost: 25,
                cooldown: 4000,
                element: 'lightning',
                effect: 'chain'
            },
            heal: {
                name: 'Heal',
                healing: 100,
                manaCost: 30,
                cooldown: 5000,
                element: 'holy',
                effect: 'restore'
            }
        };
        
        // Loot tables
        this.lootTables = {
            common: ['health_potion', 'mana_potion', 'gold_coins', 'bones'],
            uncommon: ['iron_sword', 'leather_armor', 'magic_scroll'],
            rare: ['steel_sword', 'chainmail', 'rare_gem', 'enchanted_ring'],
            epic: ['flame_sword', 'dragon_armor', 'epic_staff'],
            legendary: ['legendary_blade', 'mythic_armor', 'lich_crown']
        };
        
        console.log('⚔️ Combat & Enemy System initialized');
    }
    
    /**
     * Initialize enemy spawning across the world
     */
    async initializeEnemySpawns(biomes) {
        console.log('💀 Setting up enemy spawn points...');
        
        let totalSpawns = 0;
        
        biomes.forEach(biome => {
            if (biome.isHub) return; // No enemies in hub
            
            const biomeCenter = biome.pos;
            const biomeSize = 1000;
            const spawnsPerBiome = 50;
            
            // Create spawn points across biome
            for (let i = 0; i < spawnsPerBiome; i++) {
                const spawnPoint = {
                    biome: biome.id,
                    position: new THREE.Vector3(
                        biomeCenter[0] + (Math.random() - 0.5) * biomeSize * 0.8,
                        0,
                        biomeCenter[1] + (Math.random() - 0.5) * biomeSize * 0.8
                    ),
                    enemyType: this.getEnemyTypeForLevel(biome.level),
                    respawnTime: 60000, // 1 minute respawn
                    lastSpawn: 0,
                    active: false
                };
                
                this.enemySpawnPoints.push(spawnPoint);
                totalSpawns++;
            }
        });
        
        console.log(`   ✅ Created ${totalSpawns} enemy spawn points`);
        
        // Spawn initial enemies
        await this.spawnInitialEnemies();
    }
    
    /**
     * Get appropriate enemy type for level range
     */
    getEnemyTypeForLevel(levelRange) {
        const minLevel = parseInt(levelRange.split('-')[0]);
        
        if (minLevel <= 5) return 'skeleton_minion';
        if (minLevel <= 10) return 'skeleton_warrior';
        if (minLevel <= 15) return 'skeleton_mage';
        if (minLevel <= 20) return 'skeleton_rogue';
        return 'skeleton_captain';
    }
    
    /**
     * Spawn initial enemies in world
     */
    async spawnInitialEnemies() {
        console.log('💀 Spawning initial enemies...');
        
        const spawnsToActivate = Math.min(this.maxEnemies, this.enemySpawnPoints.length);
        
        for (let i = 0; i < spawnsToActivate; i++) {
            const spawnPoint = this.enemySpawnPoints[i];
            await this.spawnEnemyAtPoint(spawnPoint);
        }
        
        console.log(`   ✅ Spawned ${this.activeEnemies.length} enemies`);
    }
    
    /**
     * Spawn enemy at specific spawn point
     */
    async spawnEnemyAtPoint(spawnPoint) {
        if (spawnPoint.active) return;
        if (this.activeEnemies.length >= this.maxEnemies) return;
        
        const enemyData = this.enemyTypes[spawnPoint.enemyType];
        if (!enemyData) return;
        
        try {
            // Try to load enemy model
            const enemyPath = this.assetRegistry.getEnemyCharacterPath(
                Object.keys(this.enemyTypes).indexOf(spawnPoint.enemyType)
            );
            
            let enemyMesh = await this.modelLoader.load(enemyPath);
            
            if (!enemyMesh) {
                // Fallback enemy
                enemyMesh = this.createFallbackEnemy(enemyData);
            }
            
            enemyMesh.position.copy(spawnPoint.position);
            enemyMesh.castShadow = true;
            enemyMesh.receiveShadow = true;
            
            const enemy = {
                mesh: enemyMesh,
                type: spawnPoint.enemyType,
                data: enemyData,
                health: enemyData.health,
                maxHealth: enemyData.health,
                level: enemyData.level,
                damage: enemyData.damage,
                xp: enemyData.xp,
                loot: enemyData.loot,
                behavior: enemyData.behavior,
                speed: enemyData.speed,
                spawnPoint: spawnPoint,
                state: 'idle',
                target: null,
                lastAttack: 0,
                attackCooldown: 2000,
                detectionRange: 20,
                attackRange: 3,
                isElite: enemyData.isElite || false,
                isBoss: enemyData.isBoss || false
            };
            
            // Add health bar
            this.addHealthBar(enemy);
            
            // Add to scene
            this.scene.add(enemyMesh);
            this.activeEnemies.push(enemy);
            spawnPoint.active = true;
            spawnPoint.lastSpawn = Date.now();
            
        } catch (error) {
            console.warn(`Failed to spawn enemy: ${error.message}`);
        }
    }
    
    /**
     * Create fallback enemy (simple mesh)
     */
    createFallbackEnemy(enemyData) {
        const group = new THREE.Group();
        
        // Body
        const bodyGeom = new THREE.CapsuleGeometry(0.5, 1.5, 8, 16);
        const bodyMat = new THREE.MeshStandardMaterial({ 
            color: enemyData.isBoss ? 0xff0000 : 0x666666 
        });
        const body = new THREE.Mesh(bodyGeom, bodyMat);
        body.position.y = 1;
        body.castShadow = true;
        group.add(body);
        
        // Head
        const headGeom = new THREE.SphereGeometry(0.4, 16, 16);
        const head = new THREE.Mesh(headGeom, bodyMat);
        head.position.y = 2.2;
        head.castShadow = true;
        group.add(head);
        
        if (enemyData.isBoss) {
            // Crown for boss
            const crownGeom = new THREE.ConeGeometry(0.5, 0.5, 8);
            const crownMat = new THREE.MeshStandardMaterial({ color: 0xffd700 });
            const crown = new THREE.Mesh(crownGeom, crownMat);
            crown.position.y = 2.8;
            group.add(crown);
            
            // Make boss larger
            group.scale.setScalar(2);
        }
        
        return group;
    }
    
    /**
     * Add health bar above enemy
     */
    addHealthBar(enemy) {
        const barWidth = 2;
        const barHeight = 0.2;
        
        // Background
        const bgGeom = new THREE.PlaneGeometry(barWidth, barHeight);
        const bgMat = new THREE.MeshBasicMaterial({ color: 0x333333 });
        const bg = new THREE.Mesh(bgGeom, bgMat);
        bg.position.y = 3;
        
        // Health fill
        const fillGeom = new THREE.PlaneGeometry(barWidth, barHeight);
        const fillMat = new THREE.MeshBasicMaterial({ 
            color: enemy.isBoss ? 0xff0000 : 0xff6666 
        });
        const fill = new THREE.Mesh(fillGeom, fillMat);
        fill.position.y = 3;
        fill.position.z = 0.01;
        
        enemy.mesh.add(bg);
        enemy.mesh.add(fill);
        
        enemy.healthBar = { bg, fill, width: barWidth };
    }
    
    /**
     * Update enemy AI and combat
     */
    update(deltaTime) {
        if (!this.player || !this.player.mesh) return;
        
        const playerPos = this.player.mesh.position;
        
        this.activeEnemies.forEach(enemy => {
            if (enemy.health <= 0) {
                this.killEnemy(enemy);
                return;
            }
            
            // Update health bar
            this.updateHealthBar(enemy);
            
            // Update AI based on behavior
            this.updateEnemyAI(enemy, playerPos, deltaTime);
            
            // Make health bar face camera
            if (enemy.healthBar) {
                enemy.healthBar.bg.lookAt(this.scene.getObjectByName('camera').position);
                enemy.healthBar.fill.lookAt(this.scene.getObjectByName('camera').position);
            }
        });
        
        // Respawn dead enemies
        this.checkRespawns();
        
        // Update world events
        this.updateWorldEvents(deltaTime);
    }
    
    /**
     * Update enemy AI
     */
    updateEnemyAI(enemy, playerPos, deltaTime) {
        const enemyPos = enemy.mesh.position;
        const distanceToPlayer = enemyPos.distanceTo(playerPos);
        
        // Detection
        if (distanceToPlayer <= enemy.detectionRange) {
            enemy.state = 'chase';
            enemy.target = this.player;
        } else if (enemy.state === 'chase' && distanceToPlayer > enemy.detectionRange * 1.5) {
            enemy.state = 'return';
            enemy.target = null;
        }
        
        // Behavior
        switch (enemy.state) {
            case 'chase':
                this.chasePlayer(enemy, playerPos, deltaTime);
                break;
            case 'attack':
                this.attackPlayer(enemy);
                break;
            case 'return':
                this.returnToSpawn(enemy, deltaTime);
                break;
            default:
                this.idleBehavior(enemy, deltaTime);
        }
    }
    
    /**
     * Chase player
     */
    chasePlayer(enemy, playerPos, deltaTime) {
        const enemyPos = enemy.mesh.position;
        const distance = enemyPos.distanceTo(playerPos);
        
        if (distance <= enemy.attackRange) {
            enemy.state = 'attack';
            return;
        }
        
        // Move towards player
        const direction = new THREE.Vector3()
            .subVectors(playerPos, enemyPos)
            .normalize();
        
        enemy.mesh.position.add(
            direction.multiplyScalar(enemy.speed * deltaTime)
        );
        
        // Face player
        enemy.mesh.lookAt(playerPos);
    }
    
    /**
     * Attack player
     */
    attackPlayer(enemy) {
        const now = Date.now();
        if (now - enemy.lastAttack < enemy.attackCooldown) return;
        
        // Deal damage to player
        if (this.player.takeDamage) {
            this.player.takeDamage(enemy.damage);
        }
        
        // Visual feedback
        this.createAttackEffect(enemy.mesh.position, enemy.behavior);
        
        enemy.lastAttack = now;
        enemy.state = 'chase'; // Go back to chasing
        
        console.log(`⚔️ ${enemy.data.name} attacks for ${enemy.damage} damage!`);
    }
    
    /**
     * Return to spawn point
     */
    returnToSpawn(enemy, deltaTime) {
        const spawnPos = enemy.spawnPoint.position;
        const distance = enemy.mesh.position.distanceTo(spawnPos);
        
        if (distance < 1) {
            enemy.state = 'idle';
            enemy.health = enemy.maxHealth; // Heal when returning
            return;
        }
        
        const direction = new THREE.Vector3()
            .subVectors(spawnPos, enemy.mesh.position)
            .normalize();
        
        enemy.mesh.position.add(
            direction.multiplyScalar(enemy.speed * deltaTime)
        );
    }
    
    /**
     * Idle behavior
     */
    idleBehavior(enemy, deltaTime) {
        // Simple idle animation - slight bobbing
        enemy.mesh.position.y = Math.sin(Date.now() * 0.001) * 0.1;
    }
    
    /**
     * Update health bar display
     */
    updateHealthBar(enemy) {
        if (!enemy.healthBar) return;
        
        const healthPercent = enemy.health / enemy.maxHealth;
        enemy.healthBar.fill.scale.x = healthPercent;
        enemy.healthBar.fill.position.x = -(enemy.healthBar.width / 2) * (1 - healthPercent);
        
        // Change color based on health
        if (healthPercent < 0.3) {
            enemy.healthBar.fill.material.color.setHex(0xff0000);
        } else if (healthPercent < 0.6) {
            enemy.healthBar.fill.material.color.setHex(0xffaa00);
        }
    }
    
    /**
     * Kill enemy and drop loot
     */
    killEnemy(enemy) {
        console.log(`💀 ${enemy.data.name} defeated! +${enemy.xp} XP`);
        
        // Drop loot
        this.dropLoot(enemy);
        
        // Award XP
        if (this.player.addExperience) {
            this.player.addExperience(enemy.xp);
        }
        
        // Death effect
        this.createDeathEffect(enemy.mesh.position);
        
        // Remove from scene
        this.scene.remove(enemy.mesh);
        
        // Remove from active list
        const index = this.activeEnemies.indexOf(enemy);
        if (index > -1) {
            this.activeEnemies.splice(index, 1);
        }
        
        // Mark spawn point as inactive
        if (enemy.spawnPoint) {
            enemy.spawnPoint.active = false;
            enemy.spawnPoint.lastSpawn = Date.now();
        }
    }
    
    /**
     * Drop loot
     */
    dropLoot(enemy) {
        const lootPos = enemy.mesh.position.clone();
        
        enemy.loot.forEach(itemName => {
            // Create loot drop visual
            const lootMesh = this.createLootDrop(itemName);
            lootMesh.position.copy(lootPos);
            lootMesh.position.x += (Math.random() - 0.5) * 2;
            lootMesh.position.z += (Math.random() - 0.5) * 2;
            
            this.scene.add(lootMesh);
            
            // Remove after 30 seconds if not picked up
            setTimeout(() => {
                this.scene.remove(lootMesh);
            }, 30000);
        });
    }
    
    /**
     * Create loot drop mesh
     */
    createLootDrop(itemName) {
        const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0xffd700,
            emissive: 0xffaa00,
            emissiveIntensity: 0.5
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.userData = { type: 'loot', item: itemName };
        
        // Add glow
        const light = new THREE.PointLight(0xffd700, 1, 5);
        mesh.add(light);
        
        return mesh;
    }
    
    /**
     * Create attack effect
     */
    createAttackEffect(position, behavior) {
        const geometry = new THREE.SphereGeometry(1, 16, 16);
        const material = new THREE.MeshBasicMaterial({ 
            color: behavior === 'ranged' ? 0x0088ff : 0xff4444,
            transparent: true,
            opacity: 0.7
        });
        const effect = new THREE.Mesh(geometry, material);
        effect.position.copy(position);
        
        this.scene.add(effect);
        
        // Animate and remove
        let scale = 1;
        const animate = () => {
            scale += 0.1;
            effect.scale.setScalar(scale);
            effect.material.opacity -= 0.05;
            
            if (effect.material.opacity <= 0) {
                this.scene.remove(effect);
            } else {
                requestAnimationFrame(animate);
            }
        };
        animate();
    }
    
    /**
     * Create death effect
     */
    createDeathEffect(position) {
        // Particle explosion
        for (let i = 0; i < 20; i++) {
            const geometry = new THREE.SphereGeometry(0.1, 8, 8);
            const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
            const particle = new THREE.Mesh(geometry, material);
            
            particle.position.copy(position);
            particle.position.y += 1;
            
            const velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 5,
                Math.random() * 5,
                (Math.random() - 0.5) * 5
            );
            
            this.scene.add(particle);
            
            // Animate particle
            let life = 1;
            const animate = () => {
                particle.position.add(velocity.multiplyScalar(0.05));
                velocity.y -= 0.1; // Gravity
                life -= 0.02;
                particle.scale.setScalar(life);
                
                if (life <= 0) {
                    this.scene.remove(particle);
                } else {
                    requestAnimationFrame(animate);
                }
            };
            animate();
        }
    }
    
    /**
     * Check for enemy respawns
     */
    checkRespawns() {
        const now = Date.now();
        
        this.enemySpawnPoints.forEach(spawnPoint => {
            if (!spawnPoint.active && 
                now - spawnPoint.lastSpawn >= spawnPoint.respawnTime) {
                this.spawnEnemyAtPoint(spawnPoint);
            }
        });
    }
    
    /**
     * Update world events
     */
    updateWorldEvents(deltaTime) {
        // TODO: Implement dynamic world events
        // - Skeleton army invasions
        // - Boss spawns
        // - Resource gathering events
        // - PvP tournaments
    }
    
    /**
     * Cast magic spell
     */
    castSpell(spellName, target) {
        const spell = this.magicSpells[spellName];
        if (!spell) return;
        
        if (this.player.mana < spell.manaCost) {
            console.log('Not enough mana!');
            return;
        }
        
        // TODO: Check cooldown
        
        // Deduct mana
        this.player.mana -= spell.manaCost;
        
        // Create spell effect
        this.createSpellEffect(spell, target);
        
        // Apply damage/healing
        if (spell.damage && target) {
            target.health -= spell.damage;
            console.log(`✨ ${spell.name} hits for ${spell.damage} damage!`);
        }
        
        if (spell.healing) {
            this.player.health = Math.min(
                this.player.health + spell.healing,
                this.player.maxHealth
            );
            console.log(`💚 ${spell.name} heals for ${spell.healing}!`);
        }
    }
    
    /**
     * Create spell visual effect
     */
    createSpellEffect(spell, target) {
        // TODO: Create spectacular spell effects based on element
        const color = {
            fire: 0xff4400,
            ice: 0x00aaff,
            lightning: 0xffff00,
            holy: 0xffffaa
        }[spell.element] || 0xffffff;
        
        const geometry = new THREE.SphereGeometry(0.5, 16, 16);
        const material = new THREE.MeshBasicMaterial({ 
            color: color,
            transparent: true
        });
        const effect = new THREE.Mesh(geometry, material);
        
        if (target && target.mesh) {
            effect.position.copy(target.mesh.position);
        } else {
            effect.position.copy(this.player.mesh.position);
        }
        
        this.scene.add(effect);
        
        // Animate
        setTimeout(() => this.scene.remove(effect), 1000);
    }
}
