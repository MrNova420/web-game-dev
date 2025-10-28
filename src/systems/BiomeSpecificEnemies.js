/**
 * BiomeSpecificEnemies.js
 * Phase 4.2 - Biome-Specific Enemy System
 * Creates unique enemies for each biome with special abilities
 * ~500 lines
 */

export class BiomeSpecificEnemies {
    constructor(scene) {
        this.scene = scene;
        
        // Enemy definitions by biome
        this.enemyTemplates = {
            // Forest enemies
            forest_sprite: {
                name: 'Forest Sprite',
                type: 'magical',
                health: 50,
                damage: 8,
                speed: 1.5,
                abilities: ['nature_bolt', 'heal', 'vine_snare'],
                size: 0.8,
                color: 0x7fb069,
                behavior: 'evasive',
                drops: ['forest_essence', 'healing_herb']
            },
            vine_beast: {
                name: 'Vine Beast',
                type: 'plant',
                health: 120,
                damage: 15,
                speed: 0.8,
                abilities: ['vine_whip', 'entangle', 'root'],
                size: 1.5,
                color: 0x2d5016,
                behavior: 'aggressive',
                drops: ['tough_vine', 'plant_fiber']
            },
            ancient_treant: {
                name: 'Ancient Treant',
                type: 'boss',
                health: 500,
                damage: 30,
                speed: 0.5,
                abilities: ['earthquake', 'summon_sprites', 'bark_armor'],
                size: 3.0,
                color: 0x4a3c27,
                behavior: 'guardian',
                drops: ['ancient_wood', 'nature_core']
            },
            
            // Volcanic enemies
            fire_elemental: {
                name: 'Fire Elemental',
                type: 'elemental',
                health: 80,
                damage: 20,
                speed: 1.8,
                abilities: ['fireball', 'flame_dash', 'ignite'],
                size: 1.2,
                color: 0xff4500,
                behavior: 'aggressive',
                drops: ['fire_essence', 'magma_core'],
                immunities: ['fire'],
                weaknesses: ['water', 'ice']
            },
            lava_serpent: {
                name: 'Lava Serpent',
                type: 'beast',
                health: 150,
                damage: 25,
                speed: 1.2,
                abilities: ['lava_spit', 'coil', 'submerge'],
                size: 2.0,
                color: 0x8b1e1e,
                behavior: 'predator',
                drops: ['serpent_scale', 'lava_fang'],
                immunities: ['fire', 'burn'],
                weaknesses: ['ice']
            },
            magma_golem: {
                name: 'Magma Golem',
                type: 'construct',
                health: 300,
                damage: 40,
                speed: 0.6,
                abilities: ['slam', 'eruption', 'molten_armor'],
                size: 2.5,
                color: 0x4a0e0e,
                behavior: 'tank',
                drops: ['obsidian_chunk', 'magma_heart'],
                immunities: ['fire', 'stun'],
                weaknesses: ['water']
            },
            
            // Underwater enemies
            sea_serpent: {
                name: 'Sea Serpent',
                type: 'beast',
                health: 180,
                damage: 22,
                speed: 2.0,
                abilities: ['water_jet', 'whirlpool', 'tidal_wave'],
                size: 2.2,
                color: 0x003d66,
                behavior: 'territorial',
                drops: ['sea_scale', 'aqua_pearl'],
                immunities: ['water', 'slow'],
                weaknesses: ['lightning']
            },
            coral_guardian: {
                name: 'Coral Guardian',
                type: 'guardian',
                health: 200,
                damage: 18,
                speed: 0.7,
                abilities: ['coral_spikes', 'regeneration', 'petrify'],
                size: 1.8,
                color: 0xff6b9d,
                behavior: 'defensive',
                drops: ['living_coral', 'ocean_gem'],
                immunities: ['poison'],
                weaknesses: ['fire']
            },
            depth_horror: {
                name: 'Depth Horror',
                type: 'horror',
                health: 250,
                damage: 35,
                speed: 1.0,
                abilities: ['tentacle_grab', 'ink_cloud', 'drain_life'],
                size: 2.8,
                color: 0x001a33,
                behavior: 'lurker',
                drops: ['void_essence', 'deep_pearl'],
                immunities: ['fear', 'darkness'],
                weaknesses: ['light']
            },
            
            // Sky enemies
            sky_serpent: {
                name: 'Sky Serpent',
                type: 'dragon',
                health: 220,
                damage: 28,
                speed: 2.5,
                abilities: ['wind_blade', 'dive_attack', 'lightning_breath'],
                size: 2.5,
                color: 0x87ceeb,
                behavior: 'aerial',
                drops: ['dragon_scale', 'sky_crystal'],
                immunities: ['wind', 'knockback'],
                weaknesses: ['gravity']
            },
            cloud_elemental: {
                name: 'Cloud Elemental',
                type: 'elemental',
                health: 100,
                damage: 15,
                speed: 1.5,
                abilities: ['wind_gust', 'thunder_shock', 'mist_form'],
                size: 1.5,
                color: 0xb0e0e6,
                behavior: 'evasive',
                drops: ['cloud_essence', 'storm_gem'],
                immunities: ['wind', 'lightning'],
                weaknesses: ['earth']
            },
            wind_wraith: {
                name: 'Wind Wraith',
                type: 'spirit',
                health: 90,
                damage: 20,
                speed: 2.2,
                abilities: ['wind_slash', 'teleport', 'curse'],
                size: 1.3,
                color: 0xffffff,
                behavior: 'assassin',
                drops: ['wraith_essence', 'wind_shard'],
                immunities: ['physical'],
                weaknesses: ['magic']
            },
            
            // Desert enemies
            sand_worm: {
                name: 'Sand Worm',
                type: 'beast',
                health: 280,
                damage: 32,
                speed: 1.5,
                abilities: ['burrow', 'sand_blast', 'devour'],
                size: 3.5,
                color: 0xc2b280,
                behavior: 'ambusher',
                drops: ['worm_hide', 'desert_pearl'],
                immunities: ['earth', 'blind'],
                weaknesses: ['water']
            },
            desert_scarab: {
                name: 'Desert Scarab',
                type: 'insect',
                health: 60,
                damage: 12,
                speed: 1.8,
                abilities: ['mandible_strike', 'carapace_shield', 'swarm'],
                size: 1.0,
                color: 0xe3c567,
                behavior: 'swarm',
                drops: ['chitin', 'scarab_gem'],
                immunities: ['poison'],
                weaknesses: ['fire']
            },
            mirage_phantom: {
                name: 'Mirage Phantom',
                type: 'illusion',
                health: 70,
                damage: 18,
                speed: 2.0,
                abilities: ['illusion', 'confusion', 'fade'],
                size: 1.2,
                color: 0xffd700,
                behavior: 'trickster',
                drops: ['phantom_dust', 'mirage_crystal'],
                immunities: ['physical', 'confusion'],
                weaknesses: ['true_sight']
            },
            
            // Tundra enemies
            ice_golem: {
                name: 'Ice Golem',
                type: 'construct',
                health: 320,
                damage: 35,
                speed: 0.5,
                abilities: ['ice_slam', 'freeze', 'avalanche'],
                size: 2.8,
                color: 0xe0f2f7,
                behavior: 'tank',
                drops: ['eternal_ice', 'frost_core'],
                immunities: ['ice', 'freeze'],
                weaknesses: ['fire']
            },
            frost_wolf: {
                name: 'Frost Wolf',
                type: 'beast',
                health: 140,
                damage: 24,
                speed: 2.2,
                abilities: ['bite', 'howl', 'frost_breath'],
                size: 1.6,
                color: 0xb3e5fc,
                behavior: 'pack_hunter',
                drops: ['wolf_pelt', 'frost_fang'],
                immunities: ['cold'],
                weaknesses: ['fire']
            },
            blizzard_elemental: {
                name: 'Blizzard Elemental',
                type: 'elemental',
                health: 110,
                damage: 22,
                speed: 1.4,
                abilities: ['blizzard', 'ice_shard', 'freeze_aura'],
                size: 1.8,
                color: 0x81d4fa,
                behavior: 'caster',
                drops: ['blizzard_essence', 'ice_crystal'],
                immunities: ['ice', 'wind'],
                weaknesses: ['fire']
            },
            
            // Shadow realm enemies
            shadow_demon: {
                name: 'Shadow Demon',
                type: 'demon',
                health: 260,
                damage: 38,
                speed: 1.6,
                abilities: ['shadow_strike', 'drain_soul', 'dark_portal'],
                size: 2.0,
                color: 0x2d004d,
                behavior: 'aggressive',
                drops: ['demon_essence', 'shadow_core'],
                immunities: ['darkness', 'fear'],
                weaknesses: ['light', 'holy']
            },
            void_spawn: {
                name: 'Void Spawn',
                type: 'aberration',
                health: 150,
                damage: 30,
                speed: 1.3,
                abilities: ['void_touch', 'reality_break', 'multiply'],
                size: 1.5,
                color: 0x1a0033,
                behavior: 'swarm',
                drops: ['void_fragment', 'corrupted_essence'],
                immunities: ['void', 'madness'],
                weaknesses: ['order']
            },
            nightmare_beast: {
                name: 'Nightmare Beast',
                type: 'horror',
                health: 400,
                damage: 45,
                speed: 1.1,
                abilities: ['nightmare', 'terror_aura', 'consume'],
                size: 3.2,
                color: 0x5500aa,
                behavior: 'boss',
                drops: ['nightmare_essence', 'dark_heart'],
                immunities: ['fear', 'sleep', 'darkness'],
                weaknesses: ['courage', 'light']
            },
            
            // Blossom grove enemies
            bloom_sprite: {
                name: 'Bloom Sprite',
                type: 'fairy',
                health: 40,
                damage: 10,
                speed: 2.0,
                abilities: ['petal_storm', 'charm', 'heal_ally'],
                size: 0.6,
                color: 0xffb7c5,
                behavior: 'support',
                drops: ['fairy_dust', 'blossom_petal'],
                immunities: ['charm'],
                weaknesses: ['dark']
            },
            thorn_guardian: {
                name: 'Thorn Guardian',
                type: 'plant',
                health: 160,
                damage: 20,
                speed: 0.9,
                abilities: ['thorn_volley', 'root_bind', 'bramble_wall'],
                size: 1.7,
                color: 0x8b4789,
                behavior: 'defensive',
                drops: ['thorn_spike', 'rose_essence'],
                immunities: ['poison', 'bleed'],
                weaknesses: ['fire']
            },
            pollen_elemental: {
                name: 'Pollen Elemental',
                type: 'elemental',
                health: 85,
                damage: 16,
                speed: 1.3,
                abilities: ['pollen_cloud', 'allergic_reaction', 'bloom'],
                size: 1.2,
                color: 0xffc9d4,
                behavior: 'area_control',
                drops: ['pollen_sac', 'flower_core'],
                immunities: ['nature'],
                weaknesses: ['wind']
            }
        };
        
        // Active enemies in the world
        this.activeEnemies = [];
        this.maxActiveEnemies = 50;
        
        // Spawn settings
        this.spawnInterval = 5000; // 5 seconds
        this.lastSpawnTime = 0;
        
        console.log('👾 BiomeSpecificEnemies initialized with', Object.keys(this.enemyTemplates).length, 'enemy types');
    }
    
    /**
     * Spawn an enemy of specific type at position
     */
    spawnEnemy(enemyType, position, biomeId) {
        if (!this.enemyTemplates[enemyType]) {
            console.warn('Unknown enemy type:', enemyType);
            return null;
        }
        
        if (this.activeEnemies.length >= this.maxActiveEnemies) {
            return null; // Too many enemies
        }
        
        const template = this.enemyTemplates[enemyType];
        const enemy = {
            id: `enemy_${Date.now()}_${Math.random()}`,
            type: enemyType,
            ...JSON.parse(JSON.stringify(template)), // Deep clone
            position: { ...position },
            biome: biomeId,
            state: 'idle',
            target: null,
            spawnTime: Date.now(),
            currentHealth: template.health
        };
        
        this.activeEnemies.push(enemy);
        return enemy;
    }
    
    /**
     * Get enemies suitable for a biome
     */
    getBiomeEnemies(biomeId) {
        // This maps biome IDs to their enemy types
        const biomeEnemyMap = {
            mystic_forest: ['forest_sprite', 'vine_beast', 'ancient_treant'],
            volcanic_wastes: ['fire_elemental', 'lava_serpent', 'magma_golem'],
            azure_depths: ['sea_serpent', 'coral_guardian', 'depth_horror'],
            sky_citadel: ['sky_serpent', 'cloud_elemental', 'wind_wraith'],
            scorched_desert: ['sand_worm', 'desert_scarab', 'mirage_phantom'],
            frozen_tundra: ['ice_golem', 'frost_wolf', 'blizzard_elemental'],
            shadow_realm: ['shadow_demon', 'void_spawn', 'nightmare_beast'],
            blossom_grove: ['bloom_sprite', 'thorn_guardian', 'pollen_elemental']
        };
        
        return biomeEnemyMap[biomeId] || [];
    }
    
    /**
     * Update all active enemies
     */
    update(deltaTime, playerPosition, currentBiome) {
        // Update each enemy
        for (let i = this.activeEnemies.length - 1; i >= 0; i--) {
            const enemy = this.activeEnemies[i];
            
            // Remove dead enemies
            if (enemy.currentHealth <= 0) {
                this.removeEnemy(i);
                continue;
            }
            
            // Update enemy behavior
            this.updateEnemyBehavior(enemy, playerPosition, deltaTime);
        }
        
        // Spawn new enemies if needed
        const currentTime = Date.now();
        if (currentTime - this.lastSpawnTime > this.spawnInterval) {
            this.spawnBiomeEnemies(currentBiome, playerPosition);
            this.lastSpawnTime = currentTime;
        }
    }
    
    /**
     * Update individual enemy behavior
     */
    updateEnemyBehavior(enemy, playerPosition, deltaTime) {
        const distance = this.getDistance(enemy.position, playerPosition);
        
        // Simple AI based on behavior type
        switch (enemy.behavior) {
            case 'aggressive':
                if (distance < 20) {
                    this.moveTowards(enemy, playerPosition, deltaTime);
                }
                break;
            case 'evasive':
                if (distance < 10) {
                    this.moveAway(enemy, playerPosition, deltaTime);
                }
                break;
            case 'territorial':
                if (distance < 15 && distance > 5) {
                    this.moveTowards(enemy, playerPosition, deltaTime);
                }
                break;
        }
    }
    
    /**
     * Spawn enemies for current biome near player
     */
    spawnBiomeEnemies(biome, playerPosition) {
        if (!biome || !biome.data.enemies) return;
        
        const spawnCount = Math.floor(Math.random() * 2) + 1;
        
        for (let i = 0; i < spawnCount; i++) {
            const enemyType = biome.data.enemies[Math.floor(Math.random() * biome.data.enemies.length)];
            
            // Spawn at random position around player
            const angle = Math.random() * Math.PI * 2;
            const distance = 15 + Math.random() * 10;
            const spawnPos = {
                x: playerPosition.x + Math.cos(angle) * distance,
                y: 0,
                z: playerPosition.z + Math.sin(angle) * distance
            };
            
            this.spawnEnemy(enemyType, spawnPos, biome.id);
        }
    }
    
    /**
     * Remove enemy from active list
     */
    removeEnemy(index) {
        this.activeEnemies.splice(index, 1);
    }
    
    /**
     * Get distance between two positions
     */
    getDistance(pos1, pos2) {
        const dx = pos1.x - pos2.x;
        const dz = pos1.z - pos2.z;
        return Math.sqrt(dx * dx + dz * dz);
    }
    
    /**
     * Move enemy towards target
     */
    moveTowards(enemy, targetPos, deltaTime) {
        const dx = targetPos.x - enemy.position.x;
        const dz = targetPos.z - enemy.position.z;
        const distance = Math.sqrt(dx * dx + dz * dz);
        
        if (distance > 0.1) {
            const moveAmount = enemy.speed * deltaTime * 0.01;
            enemy.position.x += (dx / distance) * moveAmount;
            enemy.position.z += (dz / distance) * moveAmount;
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
            const moveAmount = enemy.speed * deltaTime * 0.01;
            enemy.position.x += (dx / distance) * moveAmount;
            enemy.position.z += (dz / distance) * moveAmount;
        }
    }
    
    /**
     * Get all active enemies
     */
    getActiveEnemies() {
        return this.activeEnemies;
    }
    
    /**
     * Get enemy template
     */
    getEnemyTemplate(enemyType) {
        return this.enemyTemplates[enemyType];
    }
}
