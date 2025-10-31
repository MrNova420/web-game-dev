import { logger } from '../core/Logger.js';
/**
 * BiomeDungeonsSystem.js
 * Phase 4.5 - Biome-Specific Dungeons System
 * Creates unique dungeons for each biome with themed bosses and loot
 * ~400 lines
 */

export class BiomeDungeonsSystem {
    constructor(scene) {
        this.scene = scene;
        
        // Dungeon templates per biome (3 dungeons per biome)
        this.dungeonTemplates = {
            // Mystic Forest dungeons
            mystic_forest_1: {
                name: 'Whispering Grove Labyrinth',
                biome: 'mystic_forest',
                difficulty: 1,
                minLevel: 1,
                size: 'medium',
                rooms: 8,
                boss: 'ancient_treant',
                miniBosses: ['vine_beast'],
                enemies: ['forest_sprite', 'vine_beast'],
                hazards: ['poison_spores', 'vine_traps'],
                loot: ['ancient_wood', 'healing_herb', 'nature_essence'],
                specialFeatures: ['healing_springs', 'nature_shrines']
            },
            mystic_forest_2: {
                name: 'Enchanted Canopy Temple',
                biome: 'mystic_forest',
                difficulty: 2,
                minLevel: 5,
                size: 'large',
                rooms: 12,
                boss: 'forest_guardian',
                miniBosses: ['ancient_treant'],
                enemies: ['forest_sprite', 'vine_beast', 'forest_warden'],
                hazards: ['magical_vines', 'illusion_paths'],
                loot: ['nature_essence', 'enchanted_wood', 'forest_crown'],
                specialFeatures: ['teleport_portals', 'magic_circles']
            },
            mystic_forest_3: {
                name: 'Root Depths Sanctuary',
                biome: 'mystic_forest',
                difficulty: 3,
                minLevel: 10,
                size: 'large',
                rooms: 15,
                boss: 'primordial_oak',
                miniBosses: ['ancient_treant', 'forest_guardian'],
                enemies: ['forest_sprite', 'vine_beast', 'nature_elemental'],
                hazards: ['root_mazes', 'poison_pools'],
                loot: ['nature_core', 'ancient_seed', 'primordial_essence'],
                specialFeatures: ['growth_zones', 'nature_portals']
            },
            
            // Volcanic Wastes dungeons
            volcanic_wastes_1: {
                name: 'Ember Forge Cavern',
                biome: 'volcanic_wastes',
                difficulty: 4,
                minLevel: 15,
                size: 'medium',
                rooms: 10,
                boss: 'magma_titan',
                miniBosses: ['magma_golem'],
                enemies: ['fire_elemental', 'lava_serpent', 'magma_golem'],
                hazards: ['lava_flows', 'heat_vents', 'collapsing_rocks'],
                loot: ['obsidian_shard', 'magma_crystal', 'sulfur_powder'],
                specialFeatures: ['forge_stations', 'lava_bridges']
            },
            volcanic_wastes_2: {
                name: 'Inferno Core Sanctum',
                biome: 'volcanic_wastes',
                difficulty: 5,
                minLevel: 20,
                size: 'large',
                rooms: 14,
                boss: 'volcanic_phoenix',
                miniBosses: ['magma_titan', 'fire_lord'],
                enemies: ['fire_elemental', 'lava_serpent', 'flame_wraith'],
                hazards: ['eruptions', 'fire_storms', 'magma_pools'],
                loot: ['phoenix_feather', 'magma_heart', 'eternal_flame'],
                specialFeatures: ['resurrection_altar', 'fire_trials']
            },
            volcanic_wastes_3: {
                name: 'Molten Throne Fortress',
                biome: 'volcanic_wastes',
                difficulty: 6,
                minLevel: 25,
                size: 'massive',
                rooms: 20,
                boss: 'volcano_king',
                miniBosses: ['volcanic_phoenix', 'magma_titan'],
                enemies: ['fire_elemental', 'lava_serpent', 'inferno_knight'],
                hazards: ['lava_tsunamis', 'flame_barriers'],
                loot: ['volcanic_crown', 'magma_throne_gem', 'king_essence'],
                specialFeatures: ['throne_room', 'armory']
            },
            
            // Azure Depths dungeons
            azure_depths_1: {
                name: 'Sunken Ship Graveyard',
                biome: 'azure_depths',
                difficulty: 3,
                minLevel: 10,
                size: 'medium',
                rooms: 9,
                boss: 'drowned_captain',
                miniBosses: ['coral_guardian'],
                enemies: ['sea_serpent', 'coral_guardian', 'ghost_sailor'],
                hazards: ['strong_currents', 'whirlpools', 'oxygen_zones'],
                loot: ['coral_fragment', 'pearl', 'ship_treasure'],
                specialFeatures: ['treasure_rooms', 'air_pockets']
            },
            azure_depths_2: {
                name: 'Coral Palace Ruins',
                biome: 'azure_depths',
                difficulty: 4,
                minLevel: 15,
                size: 'large',
                rooms: 13,
                boss: 'sea_empress',
                miniBosses: ['drowned_captain', 'coral_guardian'],
                enemies: ['sea_serpent', 'depth_horror', 'water_elemental'],
                hazards: ['pressure_chambers', 'coral_spikes'],
                loot: ['royal_pearl', 'aqua_essence', 'ocean_crown'],
                specialFeatures: ['throne_room', 'pearl_gardens']
            },
            azure_depths_3: {
                name: 'Abyssal Trench Temple',
                biome: 'azure_depths',
                difficulty: 7,
                minLevel: 30,
                size: 'massive',
                rooms: 18,
                boss: 'leviathan',
                miniBosses: ['sea_empress', 'depth_horror'],
                enemies: ['depth_horror', 'abyssal_horror', 'void_kraken'],
                hazards: ['extreme_pressure', 'darkness', 'tentacles'],
                loot: ['leviathan_scale', 'abyssal_pearl', 'deep_essence'],
                specialFeatures: ['void_portal', 'ancient_altar']
            },
            
            // Sky Citadel dungeons
            sky_citadel_1: {
                name: 'Cloudtop Monastery',
                biome: 'sky_citadel',
                difficulty: 5,
                minLevel: 20,
                size: 'medium',
                rooms: 11,
                boss: 'storm_monk',
                miniBosses: ['wind_wraith'],
                enemies: ['sky_serpent', 'cloud_elemental', 'wind_wraith'],
                hazards: ['wind_gusts', 'lightning_strikes', 'falling_platforms'],
                loot: ['sky_crystal', 'cloud_essence', 'wind_shard'],
                specialFeatures: ['meditation_chambers', 'wind_trials']
            },
            sky_citadel_2: {
                name: 'Celestial Observatory',
                biome: 'sky_citadel',
                difficulty: 6,
                minLevel: 25,
                size: 'large',
                rooms: 15,
                boss: 'star_keeper',
                miniBosses: ['storm_monk', 'celestial_guardian'],
                enemies: ['cloud_elemental', 'star_spirit', 'celestial_knight'],
                hazards: ['cosmic_radiation', 'star_falls', 'gravity_shifts'],
                loot: ['star_fragment', 'celestial_essence', 'cosmic_gem'],
                specialFeatures: ['star_chart_room', 'telescope_chamber']
            },
            sky_citadel_3: {
                name: 'Heaven\'s Spire Pinnacle',
                biome: 'sky_citadel',
                difficulty: 8,
                minLevel: 35,
                size: 'massive',
                rooms: 22,
                boss: 'sky_emperor',
                miniBosses: ['star_keeper', 'storm_monk'],
                enemies: ['celestial_knight', 'sky_dragon', 'heaven_guard'],
                hazards: ['divine_lightning', 'celestial_barriers'],
                loot: ['heaven_crown', 'emperor_essence', 'divine_artifact'],
                specialFeatures: ['throne_of_clouds', 'divine_armory']
            },
            
            // Scorched Desert dungeons
            scorched_desert_1: {
                name: 'Sandstorm Catacombs',
                biome: 'scorched_desert',
                difficulty: 3,
                minLevel: 12,
                size: 'medium',
                rooms: 9,
                boss: 'sand_worm_queen',
                miniBosses: ['sand_worm'],
                enemies: ['sand_worm', 'desert_scarab', 'mummy_warrior'],
                hazards: ['quicksand', 'sandstorms', 'collapsing_tunnels'],
                loot: ['desert_glass', 'sun_stone', 'ancient_coins'],
                specialFeatures: ['treasure_vaults', 'mummy_chambers']
            },
            scorched_desert_2: {
                name: 'Sun Temple Pyramid',
                biome: 'scorched_desert',
                difficulty: 5,
                minLevel: 20,
                size: 'large',
                rooms: 14,
                boss: 'sun_pharaoh',
                miniBosses: ['sand_worm_queen', 'anubis_guard'],
                enemies: ['mummy_warrior', 'scarab_swarm', 'sun_priest'],
                hazards: ['sun_beams', 'cursed_traps', 'sand_walls'],
                loot: ['pharaoh_mask', 'sun_stone', 'royal_scepter'],
                specialFeatures: ['burial_chamber', 'ritual_room']
            },
            scorched_desert_3: {
                name: 'Mirage Palace Labyrinth',
                biome: 'scorched_desert',
                difficulty: 6,
                minLevel: 27,
                size: 'large',
                rooms: 17,
                boss: 'desert_djinn',
                miniBosses: ['sun_pharaoh', 'mirage_phantom'],
                enemies: ['mirage_phantom', 'sand_djinn', 'desert_demon'],
                hazards: ['illusions', 'dimension_shifts', 'reality_breaks'],
                loot: ['djinn_lamp', 'mirage_crystal', 'wish_gem'],
                specialFeatures: ['wish_chamber', 'mirror_maze']
            },
            
            // Frozen Tundra dungeons
            frozen_tundra_1: {
                name: 'Icebound Caverns',
                biome: 'frozen_tundra',
                difficulty: 4,
                minLevel: 15,
                size: 'medium',
                rooms: 10,
                boss: 'ice_wyvern',
                miniBosses: ['ice_golem'],
                enemies: ['ice_golem', 'frost_wolf', 'ice_troll'],
                hazards: ['ice_spikes', 'freezing_winds', 'avalanches'],
                loot: ['eternal_ice', 'frost_crystal', 'ice_fang'],
                specialFeatures: ['ice_slides', 'frozen_waterfalls']
            },
            frozen_tundra_2: {
                name: 'Frost Giant Stronghold',
                biome: 'frozen_tundra',
                difficulty: 6,
                minLevel: 25,
                size: 'large',
                rooms: 16,
                boss: 'frost_king',
                miniBosses: ['ice_wyvern', 'frost_giant'],
                enemies: ['frost_giant', 'ice_elemental', 'winter_wraith'],
                hazards: ['blizzards', 'ice_walls', 'frozen_floors'],
                loot: ['frost_crown', 'giant_axe', 'winter_essence'],
                specialFeatures: ['great_hall', 'ice_throne']
            },
            frozen_tundra_3: {
                name: 'Eternal Winter Citadel',
                biome: 'frozen_tundra',
                difficulty: 8,
                minLevel: 35,
                size: 'massive',
                rooms: 20,
                boss: 'winter_god',
                miniBosses: ['frost_king', 'ice_wyvern'],
                enemies: ['winter_wraith', 'ice_dragon', 'eternal_guardian'],
                hazards: ['absolute_zero', 'ice_storms', 'frozen_time'],
                loot: ['eternal_winter_gem', 'god_essence', 'timeless_ice'],
                specialFeatures: ['divine_altar', 'time_chamber']
            },
            
            // Shadow Realm dungeons
            shadow_realm_1: {
                name: 'Void Rift Catacombs',
                biome: 'shadow_realm',
                difficulty: 6,
                minLevel: 25,
                size: 'large',
                rooms: 13,
                boss: 'void_lord',
                miniBosses: ['shadow_demon'],
                enemies: ['shadow_demon', 'void_spawn', 'dark_wraith'],
                hazards: ['void_portals', 'corruption', 'sanity_drain'],
                loot: ['void_essence', 'shadow_crystal', 'corruption_gem'],
                specialFeatures: ['void_altars', 'corruption_pools']
            },
            shadow_realm_2: {
                name: 'Nightmare Cathedral',
                biome: 'shadow_realm',
                difficulty: 7,
                minLevel: 30,
                size: 'massive',
                rooms: 18,
                boss: 'nightmare_emperor',
                miniBosses: ['void_lord', 'nightmare_beast'],
                enemies: ['nightmare_beast', 'fear_demon', 'void_horror'],
                hazards: ['fear_aura', 'nightmare_visions', 'madness'],
                loot: ['nightmare_crown', 'fear_essence', 'madness_gem'],
                specialFeatures: ['fear_chambers', 'nightmare_portal']
            },
            shadow_realm_3: {
                name: 'Oblivion Nexus',
                biome: 'shadow_realm',
                difficulty: 10,
                minLevel: 40,
                size: 'colossal',
                rooms: 25,
                boss: 'void_entity',
                miniBosses: ['nightmare_emperor', 'void_lord'],
                enemies: ['void_horror', 'oblivion_spawn', 'chaos_being'],
                hazards: ['reality_collapse', 'void_storms', 'existence_erasure'],
                loot: ['void_heart', 'oblivion_essence', 'reality_shard'],
                specialFeatures: ['void_core', 'reality_anchor']
            }
        };
        
        // Active dungeon instances
        this.activeDungeons = [];
        
        logger.info('🏰 BiomeDungeonsSystem initialized with', Object.keys(this.dungeonTemplates).length, 'dungeon types');
    }
    
    /**
     * Get dungeons for a specific biome
     */
    getDungeonsForBiome(biomeId) {
        const dungeons = [];
        for (const [key, dungeon] of Object.entries(this.dungeonTemplates)) {
            if (dungeon.biome === biomeId) {
                dungeons.push({ id: key, ...dungeon });
            }
        }
        return dungeons;
    }
    
    /**
     * Create a dungeon instance
     */
    createDungeonInstance(dungeonId, entrancePosition) {
        const template = this.dungeonTemplates[dungeonId];
        if (!template) {
            logger.warn('Unknown dungeon:', dungeonId);
            return null;
        }
        
        const instance = {
            id: `dungeon_${Date.now()}`,
            templateId: dungeonId,
            ...JSON.parse(JSON.stringify(template)),
            entrancePosition,
            createdAt: Date.now(),
            state: 'active',
            playersInside: [],
            clearedRooms: 0,
            bossDefeated: false
        };
        
        this.activeDungeons.push(instance);
        logger.info(`🏰 Created dungeon instance: ${template.name}`);
        
        return instance;
    }
    
    /**
     * Get dungeon by difficulty level
     */
    getDungeonsByDifficulty(difficulty) {
        const dungeons = [];
        for (const [key, dungeon] of Object.entries(this.dungeonTemplates)) {
            if (dungeon.difficulty === difficulty) {
                dungeons.push({ id: key, ...dungeon });
            }
        }
        return dungeons;
    }
    
    /**
     * Get dungeon by player level
     */
    getDungeonsForPlayerLevel(playerLevel) {
        const dungeons = [];
        for (const [key, dungeon] of Object.entries(this.dungeonTemplates)) {
            if (playerLevel >= dungeon.minLevel && playerLevel < dungeon.minLevel + 10) {
                dungeons.push({ id: key, ...dungeon });
            }
        }
        return dungeons;
    }
    
    /**
     * Complete a dungeon
     */
    completeDungeon(instanceId) {
        const instance = this.activeDungeons.find(d => d.id === instanceId);
        if (!instance) return;
        
        instance.state = 'completed';
        instance.bossDefeated = true;
        
        // Award loot
        logger.info(`🏆 Dungeon completed: ${instance.name}`);
        return instance.loot;
    }
    
    /**
     * Get active dungeons
     */
    getActiveDungeons() {
        return this.activeDungeons;
    }
    
    /**
     * Remove dungeon instance
     */
    removeDungeonInstance(instanceId) {
        const index = this.activeDungeons.findIndex(d => d.id === instanceId);
        if (index !== -1) {
            this.activeDungeons.splice(index, 1);
        }
    }
}
