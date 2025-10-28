/**
 * BiomeGenerationSystem.js
 * Phase 4.1 - Biome Expansion System
 * Generates diverse biomes with unique visuals, enemies, and mechanics
 * ~400 lines
 */

export class BiomeGenerationSystem {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        
        // Biome definitions with enhanced variety
        this.biomes = {
            // Original biomes
            mystic_forest: {
                name: 'Mystic Forest',
                colors: { primary: 0x2d5016, secondary: 0x4a7c59, accent: 0x7fb069 },
                weather: ['clear', 'fog', 'light_rain'],
                enemies: ['forest_sprite', 'vine_beast', 'ancient_treant'],
                difficulty: 1,
                music: 'forest_ambient',
                features: ['dense_trees', 'mushroom_groves', 'hidden_paths']
            },
            crystal_cavern: {
                name: 'Crystal Cavern',
                colors: { primary: 0x1a1a2e, secondary: 0x4b4ba3, accent: 0x7d7dff },
                weather: ['clear', 'crystal_mist'],
                enemies: ['crystal_golem', 'shadow_bat', 'cave_lurker'],
                difficulty: 2,
                music: 'cave_echo',
                features: ['glowing_crystals', 'underground_lakes', 'stalactites']
            },
            
            // New Phase 4 biomes
            volcanic_wastes: {
                name: 'Volcanic Wastes',
                colors: { primary: 0x4a0e0e, secondary: 0x8b1e1e, accent: 0xff4500 },
                weather: ['heat_haze', 'ash_fall', 'lava_eruption'],
                enemies: ['fire_elemental', 'lava_serpent', 'magma_golem'],
                difficulty: 4,
                music: 'volcanic_rumble',
                features: ['lava_flows', 'volcanic_vents', 'obsidian_spires'],
                temperature: 'extreme_heat',
                hazards: ['lava_damage', 'heat_exhaustion']
            },
            
            azure_depths: {
                name: 'Azure Depths',
                colors: { primary: 0x001a33, secondary: 0x003d66, accent: 0x00a8ff },
                weather: ['underwater', 'current_strong', 'bioluminescence'],
                enemies: ['sea_serpent', 'coral_guardian', 'depth_horror'],
                difficulty: 3,
                music: 'ocean_depths',
                features: ['coral_reefs', 'underwater_ruins', 'kelp_forests'],
                temperature: 'cold',
                mechanics: ['swimming', 'oxygen_management', 'water_resistance'],
                hazards: ['drowning', 'pressure_damage']
            },
            
            sky_citadel: {
                name: 'Sky Citadel',
                colors: { primary: 0x87ceeb, secondary: 0xb0e0e6, accent: 0xffffff },
                weather: ['clear', 'strong_winds', 'cloud_cover'],
                enemies: ['sky_serpent', 'cloud_elemental', 'wind_wraith'],
                difficulty: 5,
                music: 'celestial_heights',
                features: ['floating_islands', 'wind_streams', 'ancient_ruins'],
                temperature: 'cold',
                mechanics: ['gliding', 'wind_navigation', 'updrafts'],
                hazards: ['fall_damage', 'wind_knockback']
            },
            
            scorched_desert: {
                name: 'Scorched Desert',
                colors: { primary: 0xc2b280, secondary: 0xe3c567, accent: 0xffd700 },
                weather: ['clear', 'sandstorm', 'heat_wave'],
                enemies: ['sand_worm', 'desert_scarab', 'mirage_phantom'],
                difficulty: 3,
                music: 'desert_winds',
                features: ['sand_dunes', 'oasis', 'buried_temples'],
                temperature: 'extreme_heat',
                mechanics: ['sand_navigation', 'heat_resistance'],
                hazards: ['dehydration', 'sandstorm_damage']
            },
            
            frozen_tundra: {
                name: 'Frozen Tundra',
                colors: { primary: 0xe0f2f7, secondary: 0xb3e5fc, accent: 0x81d4fa },
                weather: ['snowfall', 'blizzard', 'aurora'],
                enemies: ['ice_golem', 'frost_wolf', 'blizzard_elemental'],
                difficulty: 4,
                music: 'icy_winds',
                features: ['ice_formations', 'frozen_lakes', 'snow_caves'],
                temperature: 'extreme_cold',
                mechanics: ['ice_skating', 'cold_resistance'],
                hazards: ['hypothermia', 'ice_slipping', 'frost_damage']
            },
            
            shadow_realm: {
                name: 'Shadow Realm',
                colors: { primary: 0x1a0033, secondary: 0x2d004d, accent: 0x5500aa },
                weather: ['darkness', 'void_storms', 'shadow_fog'],
                enemies: ['shadow_demon', 'void_spawn', 'nightmare_beast'],
                difficulty: 6,
                music: 'void_whispers',
                features: ['void_rifts', 'shadow_pools', 'corrupted_terrain'],
                temperature: 'void',
                mechanics: ['shadow_walk', 'void_navigation'],
                hazards: ['void_corruption', 'sanity_drain']
            },
            
            blossom_grove: {
                name: 'Blossom Grove',
                colors: { primary: 0xffb7c5, secondary: 0xffc9d4, accent: 0xffffff },
                weather: ['clear', 'petal_rain', 'gentle_breeze'],
                enemies: ['bloom_sprite', 'thorn_guardian', 'pollen_elemental'],
                difficulty: 2,
                music: 'tranquil_garden',
                features: ['cherry_blossoms', 'flower_fields', 'healing_springs'],
                temperature: 'mild',
                mechanics: ['nature_attunement'],
                hazards: ['pollen_clouds']
            }
        };
        
        // Current active biomes
        this.activeBiomes = [];
        this.currentBiome = null;
        
        // Biome transition system
        this.transitionDuration = 5000; // 5 seconds
        this.transitionProgress = 0;
        this.isTransitioning = false;
        
        // Biome generation parameters
        this.biomeSize = 200; // Size of each biome area
        this.chunkSize = 50;  // Size of generation chunks
        this.generatedChunks = new Map();
        
        // Performance tracking
        this.lastGenerationTime = 0;
        this.generationInterval = 1000; // Generate new chunks every second
        
        console.log('🌍 BiomeGenerationSystem initialized with', Object.keys(this.biomes).length, 'biomes');
    }
    
    /**
     * Initialize the biome system and generate starting biome
     */
    init() {
        // Start with mystic forest
        this.setCurrentBiome('mystic_forest');
        this.generateInitialChunks();
    }
    
    /**
     * Set the current active biome
     */
    setCurrentBiome(biomeId) {
        if (!this.biomes[biomeId]) {
            console.warn('Biome not found:', biomeId);
            return;
        }
        
        const biome = this.biomes[biomeId];
        this.currentBiome = {
            id: biomeId,
            data: biome,
            startTime: Date.now()
        };
        
        console.log('🌲 Entered biome:', biome.name);
        return biome;
    }
    
    /**
     * Generate initial chunks around player spawn
     */
    generateInitialChunks() {
        const centerChunk = { x: 0, z: 0 };
        const radius = 3; // Generate 3x3 chunks initially
        
        for (let x = -radius; x <= radius; x++) {
            for (let z = -radius; z <= radius; z++) {
                this.generateChunk(centerChunk.x + x, centerChunk.z + z);
            }
        }
    }
    
    /**
     * Generate a biome chunk at given coordinates
     */
    generateChunk(chunkX, chunkZ) {
        const chunkKey = `${chunkX},${chunkZ}`;
        
        // Skip if already generated
        if (this.generatedChunks.has(chunkKey)) {
            return;
        }
        
        const biome = this.currentBiome?.data;
        if (!biome) return;
        
        const chunk = {
            x: chunkX,
            z: chunkZ,
            biome: this.currentBiome.id,
            features: [],
            enemies: [],
            resources: []
        };
        
        // Generate biome-specific features
        this.generateFeatures(chunk, biome);
        
        // Mark as generated
        this.generatedChunks.set(chunkKey, chunk);
        
        return chunk;
    }
    
    /**
     * Generate biome-specific features in a chunk
     */
    generateFeatures(chunk, biome) {
        // Determine number of features based on biome
        const featureCount = Math.floor(Math.random() * 5) + 3;
        
        for (let i = 0; i < featureCount; i++) {
            const feature = biome.features[Math.floor(Math.random() * biome.features.length)];
            const position = {
                x: chunk.x * this.chunkSize + Math.random() * this.chunkSize,
                y: 0,
                z: chunk.z * this.chunkSize + Math.random() * this.chunkSize
            };
            
            chunk.features.push({
                type: feature,
                position,
                scale: 0.5 + Math.random() * 1.5
            });
        }
    }
    
    /**
     * Update biome system (called every frame)
     */
    update(playerPosition, deltaTime) {
        if (!this.currentBiome) return;
        
        // Check for biome transitions based on player position
        this.checkBiomeTransition(playerPosition);
        
        // Generate new chunks as player moves
        const currentTime = Date.now();
        if (currentTime - this.lastGenerationTime > this.generationInterval) {
            this.generateNearbyChunks(playerPosition);
            this.lastGenerationTime = currentTime;
        }
        
        // Update biome-specific effects
        this.updateBiomeEffects(deltaTime);
    }
    
    /**
     * Check if player should transition to a new biome
     */
    checkBiomeTransition(playerPosition) {
        // Determine which biome player should be in based on position
        const distance = Math.sqrt(playerPosition.x ** 2 + playerPosition.z ** 2);
        
        let targetBiome = 'mystic_forest';
        
        // Simple distance-based biome selection
        if (distance > 500) {
            targetBiome = 'shadow_realm';
        } else if (distance > 400) {
            targetBiome = 'sky_citadel';
        } else if (distance > 300) {
            targetBiome = 'frozen_tundra';
        } else if (distance > 200) {
            targetBiome = 'volcanic_wastes';
        } else if (distance > 100) {
            targetBiome = 'scorched_desert';
        }
        
        // Trigger transition if biome changed
        if (targetBiome !== this.currentBiome.id) {
            this.startBiomeTransition(targetBiome);
        }
    }
    
    /**
     * Start transition to a new biome
     */
    startBiomeTransition(targetBiomeId) {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        this.transitionProgress = 0;
        
        const oldBiome = this.currentBiome;
        this.setCurrentBiome(targetBiomeId);
        
        console.log(`🔄 Transitioning from ${oldBiome.data.name} to ${this.currentBiome.data.name}`);
        
        // Animate transition over time
        const transitionInterval = setInterval(() => {
            this.transitionProgress += 100 / (this.transitionDuration / 100);
            
            if (this.transitionProgress >= 100) {
                clearInterval(transitionInterval);
                this.isTransitioning = false;
                console.log('✅ Biome transition complete');
            }
        }, 100);
    }
    
    /**
     * Generate chunks near player position
     */
    generateNearbyChunks(playerPosition) {
        const playerChunkX = Math.floor(playerPosition.x / this.chunkSize);
        const playerChunkZ = Math.floor(playerPosition.z / this.chunkSize);
        const loadRadius = 2; // Load 2 chunks in each direction
        
        for (let x = -loadRadius; x <= loadRadius; x++) {
            for (let z = -loadRadius; z <= loadRadius; z++) {
                this.generateChunk(playerChunkX + x, playerChunkZ + z);
            }
        }
    }
    
    /**
     * Update biome-specific environmental effects
     */
    updateBiomeEffects(deltaTime) {
        if (!this.currentBiome) return;
        
        const biome = this.currentBiome.data;
        
        // Apply temperature effects
        if (biome.temperature) {
            this.applyTemperatureEffect(biome.temperature);
        }
        
        // Apply hazard effects
        if (biome.hazards) {
            this.applyHazardEffects(biome.hazards, deltaTime);
        }
    }
    
    /**
     * Apply temperature-based effects
     */
    applyTemperatureEffect(temperature) {
        // This would affect player stats, UI, and visuals
        // Implemented as a stub for now
    }
    
    /**
     * Apply biome hazard effects
     */
    applyHazardEffects(hazards, deltaTime) {
        // This would apply damage or status effects to the player
        // Implemented as a stub for now
    }
    
    /**
     * Get current biome information
     */
    getCurrentBiome() {
        return this.currentBiome;
    }
    
    /**
     * Get list of all available biomes
     */
    getAllBiomes() {
        return Object.keys(this.biomes).map(id => ({
            id,
            ...this.biomes[id]
        }));
    }
    
    /**
     * Get biome by ID
     */
    getBiome(biomeId) {
        return this.biomes[biomeId];
    }
}
