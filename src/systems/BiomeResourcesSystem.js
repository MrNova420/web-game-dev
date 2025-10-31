import { logger } from '../core/Logger.js';
/**
 * BiomeResourcesSystem.js
 * Phase 4.4 - Biome-Specific Resources System
 * Manages harvestable resources, materials, and crafting items per biome
 * ~400 lines
 */

export class BiomeResourcesSystem {
    constructor(scene) {
        this.scene = scene;
        
        // Resource node definitions per biome
        this.resourceTypes = {
            // Forest resources
            ancient_wood: {
                name: 'Ancient Wood',
                biomes: ['mystic_forest', 'blossom_grove'],
                rarity: 'common',
                value: 5,
                uses: ['crafting', 'building'],
                harvestTime: 2000,
                respawnTime: 120000,
                stackSize: 50,
                icon: '🪵'
            },
            healing_herb: {
                name: 'Healing Herb',
                biomes: ['mystic_forest', 'blossom_grove'],
                rarity: 'common',
                value: 8,
                uses: ['alchemy', 'crafting'],
                harvestTime: 1500,
                respawnTime: 60000,
                stackSize: 99,
                icon: '🌿'
            },
            nature_essence: {
                name: 'Nature Essence',
                biomes: ['mystic_forest'],
                rarity: 'rare',
                value: 50,
                uses: ['enchanting', 'alchemy'],
                harvestTime: 3000,
                respawnTime: 300000,
                stackSize: 20,
                icon: '✨'
            },
            
            // Volcanic resources
            obsidian_shard: {
                name: 'Obsidian Shard',
                biomes: ['volcanic_wastes'],
                rarity: 'uncommon',
                value: 25,
                uses: ['weapon_crafting', 'armor_crafting'],
                harvestTime: 3000,
                respawnTime: 180000,
                stackSize: 30,
                icon: '🪨'
            },
            magma_crystal: {
                name: 'Magma Crystal',
                biomes: ['volcanic_wastes'],
                rarity: 'rare',
                value: 75,
                uses: ['enchanting', 'weapon_crafting'],
                harvestTime: 5000,
                respawnTime: 400000,
                stackSize: 10,
                icon: '💎'
            },
            sulfur_powder: {
                name: 'Sulfur Powder',
                biomes: ['volcanic_wastes'],
                rarity: 'common',
                value: 10,
                uses: ['alchemy', 'explosives'],
                harvestTime: 2000,
                respawnTime: 90000,
                stackSize: 50,
                icon: '⚗️'
            },
            
            // Underwater resources
            coral_fragment: {
                name: 'Coral Fragment',
                biomes: ['azure_depths'],
                rarity: 'common',
                value: 12,
                uses: ['jewelry', 'decoration'],
                harvestTime: 2500,
                respawnTime: 120000,
                stackSize: 40,
                icon: '🪸'
            },
            pearl: {
                name: 'Pearl',
                biomes: ['azure_depths'],
                rarity: 'uncommon',
                value: 40,
                uses: ['jewelry', 'alchemy'],
                harvestTime: 3500,
                respawnTime: 240000,
                stackSize: 20,
                icon: '⚪'
            },
            aqua_essence: {
                name: 'Aqua Essence',
                biomes: ['azure_depths'],
                rarity: 'rare',
                value: 60,
                uses: ['enchanting', 'alchemy'],
                harvestTime: 4000,
                respawnTime: 350000,
                stackSize: 15,
                icon: '💧'
            },
            
            // Sky resources
            sky_crystal: {
                name: 'Sky Crystal',
                biomes: ['sky_citadel'],
                rarity: 'uncommon',
                value: 35,
                uses: ['enchanting', 'jewelry'],
                harvestTime: 3000,
                respawnTime: 200000,
                stackSize: 25,
                icon: '💠'
            },
            cloud_essence: {
                name: 'Cloud Essence',
                biomes: ['sky_citadel'],
                rarity: 'rare',
                value: 70,
                uses: ['alchemy', 'enchanting'],
                harvestTime: 4500,
                respawnTime: 380000,
                stackSize: 12,
                icon: '☁️'
            },
            wind_shard: {
                name: 'Wind Shard',
                biomes: ['sky_citadel'],
                rarity: 'uncommon',
                value: 30,
                uses: ['weapon_crafting', 'enchanting'],
                harvestTime: 2800,
                respawnTime: 160000,
                stackSize: 30,
                icon: '💨'
            },
            
            // Desert resources
            desert_glass: {
                name: 'Desert Glass',
                biomes: ['scorched_desert'],
                rarity: 'uncommon',
                value: 20,
                uses: ['crafting', 'decoration'],
                harvestTime: 2000,
                respawnTime: 140000,
                stackSize: 35,
                icon: '🔆'
            },
            sun_stone: {
                name: 'Sun Stone',
                biomes: ['scorched_desert'],
                rarity: 'rare',
                value: 80,
                uses: ['enchanting', 'jewelry'],
                harvestTime: 5000,
                respawnTime: 420000,
                stackSize: 8,
                icon: '☀️'
            },
            cactus_fiber: {
                name: 'Cactus Fiber',
                biomes: ['scorched_desert'],
                rarity: 'common',
                value: 6,
                uses: ['crafting', 'alchemy'],
                harvestTime: 1800,
                respawnTime: 80000,
                stackSize: 60,
                icon: '🌵'
            },
            
            // Tundra resources
            eternal_ice: {
                name: 'Eternal Ice',
                biomes: ['frozen_tundra'],
                rarity: 'uncommon',
                value: 28,
                uses: ['alchemy', 'weapon_crafting'],
                harvestTime: 3200,
                respawnTime: 180000,
                stackSize: 25,
                icon: '🧊'
            },
            frost_crystal: {
                name: 'Frost Crystal',
                biomes: ['frozen_tundra'],
                rarity: 'rare',
                value: 65,
                uses: ['enchanting', 'armor_crafting'],
                harvestTime: 4200,
                respawnTime: 360000,
                stackSize: 15,
                icon: '❄️'
            },
            winter_herb: {
                name: 'Winter Herb',
                biomes: ['frozen_tundra'],
                rarity: 'common',
                value: 9,
                uses: ['alchemy', 'cooking'],
                harvestTime: 2000,
                respawnTime: 100000,
                stackSize: 50,
                icon: '🍃'
            },
            
            // Shadow realm resources
            void_essence: {
                name: 'Void Essence',
                biomes: ['shadow_realm'],
                rarity: 'epic',
                value: 150,
                uses: ['enchanting', 'dark_magic'],
                harvestTime: 6000,
                respawnTime: 600000,
                stackSize: 5,
                icon: '🌑'
            },
            shadow_crystal: {
                name: 'Shadow Crystal',
                biomes: ['shadow_realm'],
                rarity: 'rare',
                value: 90,
                uses: ['weapon_crafting', 'enchanting'],
                harvestTime: 5000,
                respawnTime: 450000,
                stackSize: 10,
                icon: '⬛'
            },
            dark_essence: {
                name: 'Dark Essence',
                biomes: ['shadow_realm'],
                rarity: 'uncommon',
                value: 45,
                uses: ['alchemy', 'dark_magic'],
                harvestTime: 3500,
                respawnTime: 220000,
                stackSize: 20,
                icon: '🔮'
            },
            
            // Blossom grove resources
            cherry_blossom: {
                name: 'Cherry Blossom',
                biomes: ['blossom_grove'],
                rarity: 'common',
                value: 7,
                uses: ['alchemy', 'decoration'],
                harvestTime: 1500,
                respawnTime: 70000,
                stackSize: 70,
                icon: '🌸'
            },
            life_essence: {
                name: 'Life Essence',
                biomes: ['blossom_grove'],
                rarity: 'rare',
                value: 55,
                uses: ['enchanting', 'healing'],
                harvestTime: 3800,
                respawnTime: 330000,
                stackSize: 18,
                icon: '💖'
            },
            petal_dust: {
                name: 'Petal Dust',
                biomes: ['blossom_grove'],
                rarity: 'uncommon',
                value: 22,
                uses: ['alchemy', 'enchanting'],
                harvestTime: 2400,
                respawnTime: 150000,
                stackSize: 35,
                icon: '✨'
            }
        };
        
        // Active resource nodes in the world
        this.activeNodes = [];
        this.maxNodes = 100;
        
        // Player's harvested resources
        this.playerResources = {};
        
        logger.info('💎 BiomeResourcesSystem initialized with', Object.keys(this.resourceTypes).length, 'resource types');
    }
    
    /**
     * Spawn resource nodes in a biome chunk
     */
    spawnResourceNodesInChunk(chunkX, chunkZ, biomeId) {
        // Get resources for this biome
        const biomeResources = this.getResourcesForBiome(biomeId);
        if (biomeResources.length === 0) return;
        
        // Spawn 2-5 resource nodes per chunk
        const nodeCount = Math.floor(Math.random() * 4) + 2;
        
        for (let i = 0; i < nodeCount && this.activeNodes.length < this.maxNodes; i++) {
            // Pick random resource from biome
            const resourceType = biomeResources[Math.floor(Math.random() * biomeResources.length)];
            const resource = this.resourceTypes[resourceType];
            
            // Random position within chunk
            const position = {
                x: chunkX * 50 + Math.random() * 50,
                y: 0.5,
                z: chunkZ * 50 + Math.random() * 50
            };
            
            const node = {
                id: `node_${Date.now()}_${Math.random()}`,
                type: resourceType,
                data: resource,
                position,
                biome: biomeId,
                state: 'available',
                spawnTime: Date.now(),
                lastHarvestTime: 0,
                harvestCount: 0
            };
            
            this.activeNodes.push(node);
        }
    }
    
    /**
     * Get all resources that can spawn in a biome
     */
    getResourcesForBiome(biomeId) {
        const resources = [];
        for (const [key, resource] of Object.entries(this.resourceTypes)) {
            if (resource.biomes.includes(biomeId)) {
                resources.push(key);
            }
        }
        return resources;
    }
    
    /**
     * Attempt to harvest a resource node
     */
    harvestNode(nodeId, playerId) {
        const node = this.activeNodes.find(n => n.id === nodeId);
        if (!node) return null;
        
        if (node.state !== 'available') {
            return { success: false, message: 'Resource is depleted' };
        }
        
        // Mark as harvesting
        node.state = 'harvesting';
        
        // Simulate harvest time
        setTimeout(() => {
            if (node.state === 'harvesting') {
                // Complete harvest
                node.state = 'depleted';
                node.lastHarvestTime = Date.now();
                node.harvestCount++;
                
                // Add to player's inventory
                this.addResourceToPlayer(playerId, node.type, 1);
                
                // Schedule respawn
                setTimeout(() => {
                    node.state = 'available';
                }, node.data.respawnTime);
            }
        }, node.data.harvestTime);
        
        return {
            success: true,
            message: `Harvesting ${node.data.name}...`,
            harvestTime: node.data.harvestTime
        };
    }
    
    /**
     * Add resource to player's inventory
     */
    addResourceToPlayer(playerId, resourceType, amount) {
        if (!this.playerResources[playerId]) {
            this.playerResources[playerId] = {};
        }
        
        if (!this.playerResources[playerId][resourceType]) {
            this.playerResources[playerId][resourceType] = 0;
        }
        
        const resource = this.resourceTypes[resourceType];
        const currentAmount = this.playerResources[playerId][resourceType];
        const newAmount = Math.min(currentAmount + amount, resource.stackSize);
        
        this.playerResources[playerId][resourceType] = newAmount;
        
        logger.info(`💰 Player gained ${amount}x ${resource.name} (Total: ${newAmount}/${resource.stackSize})`);
    }
    
    /**
     * Get player's resources
     */
    getPlayerResources(playerId) {
        return this.playerResources[playerId] || {};
    }
    
    /**
     * Get nearby resource nodes
     */
    getNearbyNodes(position, radius = 10) {
        return this.activeNodes.filter(node => {
            const dx = node.position.x - position.x;
            const dz = node.position.z - position.z;
            const distance = Math.sqrt(dx * dx + dz * dz);
            return distance <= radius;
        });
    }
    
    /**
     * Update resource system
     */
    update(deltaTime) {
        // Clean up old depleted nodes that have respawned
        const currentTime = Date.now();
        
        for (const node of this.activeNodes) {
            if (node.state === 'depleted') {
                const timeSinceHarvest = currentTime - node.lastHarvestTime;
                if (timeSinceHarvest >= node.data.respawnTime) {
                    node.state = 'available';
                }
            }
        }
    }
    
    /**
     * Get resource info by type
     */
    getResourceInfo(resourceType) {
        return this.resourceTypes[resourceType];
    }
    
    /**
     * Get all active nodes
     */
    getActiveNodes() {
        return this.activeNodes;
    }
    
    /**
     * Remove a node (when chunk unloads, etc)
     */
    removeNode(nodeId) {
        const index = this.activeNodes.findIndex(n => n.id === nodeId);
        if (index !== -1) {
            this.activeNodes.splice(index, 1);
        }
    }
}
