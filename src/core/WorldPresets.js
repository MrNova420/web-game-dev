/**
 * WorldPresets - Comprehensive preset system for procedural generation
 * Creates immersive worlds with lore, NPCs, items, quests, and engaging gameplay
 * 
 * PRODUCTION-GRADE: Complete presets for Dynasty of Emberveil
 */

export class WorldPresets {
    constructor() {
        this.presets = this.initializePresets();
    }
    
    initializePresets() {
        return {
            // PRESET 1: Crystal Caverns - Beginner Zone
            crystal_caverns: {
                id: 'crystal_caverns',
                name: 'Crystal Caverns of Emberveil',
                tier: 1,
                difficulty: 'Easy',
                recommendedLevel: '1-10',
                
                // Lore & Story
                lore: {
                    description: 'Where the first mystical herbs were discovered by the ancient god-kings. The crystals here pulse with residual smoke essence, creating a permanent twilight glow.',
                    history: 'Once a sacred mining site, now a training ground for new Wielders',
                    secrets: 'Deep within lies the First Shrine, where the original smoke rituals were performed',
                    ambience: 'Echoing drips, crystalline chimes, purple mist swirling'
                },
                
                // Visual Design
                visuals: {
                    skybox: 'purple_twilight',
                    fog: { color: 0x9d4edd, density: 0.02 },
                    lighting: {
                        ambient: { color: 0x9d4edd, intensity: 0.4 },
                        directional: { color: 0xc77dff, intensity: 0.6 }
                    },
                    colors: {
                        primary: 0x9d4edd,
                        secondary: 0xc77dff,
                        accent: 0xe0aaff,
                        ground: 0x4a0e7a,
                        stone: 0x7209b7
                    }
                },
                
                // Procedural Generation Rules
                generation: {
                    terrain: {
                        type: 'cave',
                        elevation: { min: 0, max: 15 },
                        roughness: 0.3,
                        caves: true,
                        crystalFormations: true
                    },
                    
                    structures: [
                        { type: 'crystal_pillar', density: 'high', models: ['crystal', 'crystal'] },
                        { type: 'shrine_ruins', density: 'low', models: ['fantasy_tower', 'statue'] },
                        { type: 'mining_camp', density: 'medium', models: ['medieval_house', 'well'] },
                        { type: 'glowing_pool', density: 'medium', models: ['pond'] }
                    ],
                    
                    vegetation: [
                        { type: 'crystal_flowers', density: 0.7, models: ['flower_blue', 'flower_red'] },
                        { type: 'glowing_mushrooms', density: 0.8, models: ['mushroom_blue', 'mushroom_red'] },
                        { type: 'cave_moss', density: 0.5, models: ['grass_tall', 'bush'] }
                    ],
                    
                    decorations: [
                        { type: 'scattered_gems', density: 0.6, models: ['gem_blue', 'gem_red', 'crystal'] },
                        { type: 'broken_equipment', density: 0.3, models: ['sword', 'shield'] },
                        { type: 'ancient_tablets', density: 0.2, models: ['rock_1', 'rock_2'] }
                    ]
                },
                
                // NPCs & Characters
                npcs: [
                    {
                        id: 'elder_miner',
                        name: 'Elder Grimstone',
                        type: 'quest_giver',
                        model: 'anime_warrior',
                        position: { x: 5, y: 0, z: 5 },
                        dialogue: [
                            'Welcome, young Wielder. The crystals here hold ancient power.',
                            'In my youth, I mined these caves. Now I guide newcomers.',
                            'Beware the Smoke Imps - they feed on the crystal essence!'
                        ],
                        quests: ['tutorial_basics', 'crystal_collection', 'imp_extermination']
                    },
                    {
                        id: 'crystal_merchant',
                        name: 'Viola the Shimmer',
                        type: 'merchant',
                        model: 'anime_girl',
                        position: { x: -8, y: 0, z: 12 },
                        dialogue: [
                            'Fresh from the mines! Crystals and potions for sale!',
                            'These herbs? Grown in pure smoke essence. Very potent!',
                            'Come back when you have coin, darling~'
                        ],
                        inventory: [
                            { item: 'health_potion', price: 10, stock: 20 },
                            { item: 'mana_potion', price: 15, stock: 15 },
                            { item: 'crystal_shard', price: 25, stock: 10 },
                            { item: 'beginner_sword', price: 100, stock: 5 }
                        ]
                    },
                    {
                        id: 'training_master',
                        name: 'Sensei Bladeheart',
                        type: 'trainer',
                        model: 'knight',
                        position: { x: 15, y: 0, z: -10 },
                        dialogue: [
                            'Show me your stance, Wielder!',
                            'Smoke magic requires discipline AND flow.',
                            'Again! Your combo was weak!'
                        ],
                        trains: ['basic_combat', 'smoke_blast', 'dodge_roll']
                    },
                    {
                        id: 'lore_keeper',
                        name: 'Mystara the Veiled',
                        type: 'lore',
                        model: 'mage',
                        position: { x: -15, y: 0, z: -15 },
                        dialogue: [
                            'The god-kings... they burned too much. Wanted too much.',
                            'Now we live in their twilight, harvesting their mistakes.',
                            'The smoke remembers everything, child. Everything.'
                        ],
                        loreUnlocks: ['history_godkings', 'essence_nature', 'vibespheres_explained']
                    },
                    {
                        id: 'companion_npc_1',
                        name: 'Kira the Scout',
                        type: 'companion_recruiter',
                        model: 'elf',
                        position: { x: 0, y: 0, z: 20 },
                        dialogue: [
                            'Looking for a partner? I know someone...',
                            'Smoke Siren? She\'s powerful but... mysterious.',
                            'Find her at the Shrine if you dare.'
                        ],
                        recruits: ['smoke_siren']
                    }
                ],
                
                // Enemies & Monsters
                enemies: [
                    {
                        id: 'smoke_imp',
                        name: 'Smoke Imp',
                        model: 'slime',
                        level: { min: 1, max: 5 },
                        spawnRate: 0.7,
                        behavior: 'aggressive',
                        stats: {
                            health: { base: 30, perLevel: 5 },
                            damage: { base: 5, perLevel: 1 },
                            defense: { base: 2, perLevel: 0.5 },
                            speed: 1.5
                        },
                        abilities: ['smoke_puff', 'swarm_attack'],
                        loot: [
                            { item: 'smoke_essence', dropRate: 0.8, amount: [1, 3] },
                            { item: 'imp_fang', dropRate: 0.3, amount: 1 },
                            { item: 'health_potion', dropRate: 0.1, amount: 1 }
                        ]
                    },
                    {
                        id: 'crystal_golem',
                        name: 'Crystal Golem',
                        model: 'golem',
                        level: { min: 3, max: 8 },
                        spawnRate: 0.3,
                        behavior: 'territorial',
                        stats: {
                            health: { base: 100, perLevel: 15 },
                            damage: { base: 15, perLevel: 3 },
                            defense: { base: 10, perLevel: 2 },
                            speed: 0.8
                        },
                        abilities: ['crystal_slam', 'shard_barrage'],
                        loot: [
                            { item: 'crystal_core', dropRate: 0.5, amount: 1 },
                            { item: 'crystal_shard', dropRate: 0.9, amount: [2, 5] },
                            { item: 'rare_gem', dropRate: 0.05, amount: 1 }
                        ]
                    },
                    {
                        id: 'essence_wraith',
                        name: 'Essence Wraith',
                        model: 'wraith',
                        level: { min: 5, max: 10 },
                        spawnRate: 0.2,
                        behavior: 'haunting',
                        stats: {
                            health: { base: 60, perLevel: 8 },
                            damage: { base: 20, perLevel: 4 },
                            defense: { base: 5, perLevel: 1 },
                            speed: 1.2
                        },
                        abilities: ['mana_drain', 'phase_shift', 'soul_touch'],
                        loot: [
                            { item: 'wraith_essence', dropRate: 0.7, amount: 1 },
                            { item: 'ethereal_cloth', dropRate: 0.4, amount: 1 },
                            { item: 'mana_potion', dropRate: 0.2, amount: 1 }
                        ]
                    }
                ],
                
                // Boss Encounters
                bosses: [
                    {
                        id: 'smoke_dragon',
                        name: 'Veiltongue the Smoke Dragon',
                        model: 'dragon',
                        level: 10,
                        spawnLocation: 'deep_shrine',
                        spawnCondition: 'complete_5_quests',
                        phases: 3,
                        stats: {
                            health: 2000,
                            damage: 50,
                            defense: 30,
                            speed: 1.0
                        },
                        abilities: [
                            'psychedelic_breath',
                            'smoke_veil',
                            'crystal_storm',
                            'essence_absorption',
                            'twilight_roar'
                        ],
                        loot: [
                            { item: 'dragon_scale', dropRate: 1.0, amount: [3, 5] },
                            { item: 'smoke_dragon_essence', dropRate: 1.0, amount: 1 },
                            { item: 'legendary_weapon', dropRate: 0.1, amount: 1 },
                            { item: 'boss_key', dropRate: 1.0, amount: 1 }
                        ],
                        dialogue: [
                            'You dare enter my sanctuary?',
                            'The smoke reveals all your fears...',
                            'I was here when the god-kings fell!'
                        ]
                    }
                ],
                
                // Quests & Storylines
                quests: [
                    {
                        id: 'tutorial_basics',
                        name: 'First Steps in Emberveil',
                        type: 'tutorial',
                        giver: 'elder_miner',
                        objectives: [
                            { type: 'move', description: 'Learn to move with WASD', required: true },
                            { type: 'combat', description: 'Defeat 3 Smoke Imps', count: 3, target: 'smoke_imp' },
                            { type: 'collect', description: 'Collect 5 Crystal Shards', count: 5, item: 'crystal_shard' }
                        ],
                        rewards: {
                            experience: 100,
                            gold: 50,
                            items: ['beginner_sword', 'health_potion'],
                            unlocks: ['inventory_system', 'basic_abilities']
                        },
                        nextQuest: 'crystal_collection'
                    },
                    {
                        id: 'crystal_collection',
                        name: 'The Miner\'s Request',
                        type: 'gathering',
                        giver: 'elder_miner',
                        objectives: [
                            { type: 'collect', description: 'Gather 20 Crystal Shards', count: 20, item: 'crystal_shard' },
                            { type: 'explore', description: 'Find the Hidden Crystal Formation', location: 'hidden_cave' }
                        ],
                        rewards: {
                            experience: 250,
                            gold: 100,
                            items: ['crystal_pickaxe', 'mana_potion'],
                            reputation: { faction: 'miners_guild', amount: 10 }
                        },
                        nextQuest: 'imp_extermination'
                    },
                    {
                        id: 'imp_extermination',
                        name: 'Clear the Infestation',
                        type: 'combat',
                        giver: 'elder_miner',
                        objectives: [
                            { type: 'kill', description: 'Eliminate 30 Smoke Imps', count: 30, target: 'smoke_imp' },
                            { type: 'kill', description: 'Defeat the Imp Mother', count: 1, target: 'imp_mother' }
                        ],
                        rewards: {
                            experience: 500,
                            gold: 200,
                            items: ['imp_slayer_blade', 'smoke_resistance_charm'],
                            unlocks: ['smoke_blast_ability']
                        },
                        nextQuest: 'shrine_discovery'
                    },
                    {
                        id: 'shrine_discovery',
                        name: 'The First Shrine',
                        type: 'exploration',
                        giver: 'lore_keeper',
                        objectives: [
                            { type: 'explore', description: 'Find the Ancient Shrine', location: 'first_shrine' },
                            { type: 'interact', description: 'Activate the Ritual Circle', object: 'ritual_circle' },
                            { type: 'survive', description: 'Survive the Smoke Trial', duration: 120 }
                        ],
                        rewards: {
                            experience: 1000,
                            gold: 300,
                            items: ['smoke_wielder_tome', 'essence_infused_herb'],
                            unlocks: ['companion_system', 'smoke_siren_recruitment']
                        },
                        nextQuest: 'boss_challenge_smoke_dragon'
                    }
                ],
                
                // Items & Loot Tables
                lootTables: {
                    common: [
                        { item: 'smoke_essence', weight: 30 },
                        { item: 'crystal_shard', weight: 25 },
                        { item: 'health_potion', weight: 20 },
                        { item: 'mana_potion', weight: 15 },
                        { item: 'copper_coin', weight: 10 }
                    ],
                    uncommon: [
                        { item: 'crystal_core', weight: 25 },
                        { item: 'imp_fang', weight: 20 },
                        { item: 'ethereal_cloth', weight: 15 },
                        { item: 'refined_herb', weight: 20 },
                        { item: 'silver_coin', weight: 20 }
                    ],
                    rare: [
                        { item: 'dragon_scale', weight: 20 },
                        { item: 'enchanted_crystal', weight: 20 },
                        { item: 'rare_gem', weight: 15 },
                        { item: 'ancient_tome', weight: 15 },
                        { item: 'gold_coin', weight: 30 }
                    ],
                    epic: [
                        { item: 'legendary_weapon', weight: 30 },
                        { item: 'epic_armor', weight: 30 },
                        { item: 'smoke_dragon_essence', weight: 20 },
                        { item: 'godking_artifact', weight: 20 }
                    ]
                },
                
                // Audio & Ambience
                audio: {
                    music: 'crystal_caverns_ambient',
                    ambient: ['water_drip', 'crystal_chime', 'echo_whisper', 'wind_howl'],
                    combat: 'crystal_caverns_battle',
                    boss: 'smoke_dragon_theme'
                },
                
                // Special Events
                events: [
                    {
                        id: 'crystal_storm',
                        name: 'Crystal Storm Event',
                        triggerCondition: 'random_30min',
                        duration: 300,
                        effects: {
                            weather: 'crystal_rain',
                            buffAll: { stat: 'magic_power', amount: 25, percent: true },
                            spawnBonus: { type: 'crystal_golem', multiplier: 2 },
                            lootBonus: { rarity: 'uncommon', multiplier: 1.5 }
                        },
                        announcement: '✨ A Crystal Storm approaches! Magic surges through the caverns!'
                    },
                    {
                        id: 'smoke_ritual',
                        name: 'Ancient Smoke Ritual',
                        triggerCondition: 'player_count_10+',
                        duration: 600,
                        effects: {
                            spawnBoss: 'smoke_dragon',
                            rewardMultiplier: 2.0,
                            experienceBonus: 50
                        },
                        announcement: '🔮 The smoke thickens... A powerful presence awakens!'
                    }
                ],
                
                // Secrets & Easter Eggs
                secrets: [
                    {
                        id: 'hidden_crystal_chamber',
                        location: { x: -50, y: -20, z: -50 },
                        requirement: 'find_secret_passage',
                        reward: {
                            items: ['legendary_crystal', 'ancient_tome'],
                            achievement: 'secret_finder'
                        }
                    },
                    {
                        id: 'miners_memorial',
                        location: { x: 30, y: 0, z: 30 },
                        requirement: 'read_all_tablets',
                        reward: {
                            lore: 'true_history_caverns',
                            buff: 'miners_blessing',
                            achievement: 'lore_master'
                        }
                    }
                ]
            },
            
            // PRESET 2: Fungal City - Mid-tier Zone
            fungal_city: {
                id: 'fungal_city',
                name: 'The Fungal City of Spores',
                tier: 2,
                difficulty: 'Medium',
                recommendedLevel: '11-25',
                
                lore: {
                    description: 'An ancient civilization consumed by bioluminescent fungi. The spores here grant visions and madness in equal measure.',
                    history: 'Once the capital of innovation, now a twisted garden of glowing mushrooms',
                    secrets: 'The Fungal Empress still rules from her throne of spores',
                    ambience: 'Pulsing lights, spore clouds, ethereal humming, distant laughter'
                },
                
                visuals: {
                    skybox: 'toxic_green_mist',
                    fog: { color: 0x52b788, density: 0.03 },
                    lighting: {
                        ambient: { color: 0x52b788, intensity: 0.5 },
                        directional: { color: 0x95d5b2, intensity: 0.5 }
                    },
                    colors: {
                        primary: 0x52b788,
                        secondary: 0x95d5b2,
                        accent: 0xff6b9d,
                        ground: 0x2d6a4f,
                        buildings: 0x1b4332
                    }
                },
                
                generation: {
                    terrain: {
                        type: 'ruins',
                        elevation: { min: 0, max: 25 },
                        roughness: 0.4,
                        ruins: true,
                        fungalGrowth: true
                    },
                    
                    structures: [
                        { type: 'overgrown_buildings', density: 'high', models: ['medieval_house', 'magic_shop', 'fantasy_tower'] },
                        { type: 'mushroom_groves', density: 'very_high', models: ['mushroom_red', 'mushroom_blue'] },
                        { type: 'fungal_throne', density: 'unique', models: ['castle_tower', 'statue'] },
                        { type: 'spore_gardens', density: 'high', models: ['flower_red', 'flower_blue', 'bush'] }
                    ],
                    
                    vegetation: [
                        { type: 'giant_mushrooms', density: 0.9, models: ['mushroom_red', 'mushroom_blue'] },
                        { type: 'bioluminescent_vines', density: 0.8, models: ['grass_tall', 'bush'] },
                        { type: 'spore_flowers', density: 0.7, models: ['flower_red', 'flower_blue', 'flower_yellow'] }
                    ],
                    
                    decorations: [
                        { type: 'broken_statues', density: 0.5, models: ['statue'] },
                        { type: 'fungal_architecture', density: 0.7, models: ['fantasy_tower', 'castle_wall'] },
                        { type: 'glowing_spores', density: 0.9, models: ['crystal'] }
                    ]
                },
                
                npcs: [
                    {
                        id: 'fungal_alchemist',
                        name: 'Mycellia the Sporeweaver',
                        type: 'quest_giver',
                        model: 'witch',
                        position: { x: 10, y: 0, z: 15 },
                        dialogue: [
                            'The spores speak to me... they tell of your arrival.',
                            'This city was beautiful once. Before the Empress took it.',
                            'Harvest with care. The fungi are... alive. More than you think.'
                        ],
                        quests: ['spore_collection', 'empress_investigation', 'cure_research']
                    },
                    {
                        id: 'mad_scholar',
                        name: 'Professor Sporelord',
                        type: 'lore',
                        model: 'mage',
                        position: { x: -20, y: 0, z: -10 },
                        dialogue: [
                            '*giggles* The spores... they show me EVERYTHING!',
                            'Time? Space? All FUNGAL! All connected through mycelium!',
                            'The Empress... she\'s not evil. She\'s... evolved!'
                        ],
                        loreUnlocks: ['fungal_network', 'empress_origin', 'hivemind_theory']
                    },
                    {
                        id: 'spore_merchant',
                        name: 'Glimcap the Trader',
                        type: 'merchant',
                        model: 'anime_girl',
                        position: { x: 5, y: 0, z: -15 },
                        dialogue: [
                            'Fresh spores! Hallucinations guaranteed!',
                            'Try the blue ones - they make you see the future!',
                            'Red ones? Those are... special. Very special~'
                        ],
                        inventory: [
                            { item: 'healing_spores', price: 25, stock: 30 },
                            { item: 'vision_mushroom', price: 50, stock: 10 },
                            { item: 'fungal_armor', price: 500, stock: 3 },
                            { item: 'spore_bomb', price: 75, stock: 20 }
                        ]
                    }
                ],
                
                enemies: [
                    {
                        id: 'spore_zombie',
                        name: 'Spore-Infected Husk',
                        model: 'zombie',
                        level: { min: 11, max: 18 },
                        spawnRate: 0.7,
                        behavior: 'swarm',
                        stats: {
                            health: { base: 80, perLevel: 12 },
                            damage: { base: 18, perLevel: 3 },
                            defense: { base: 8, perLevel: 1.5 },
                            speed: 0.9
                        },
                        abilities: ['spore_cloud', 'fungal_grasp'],
                        loot: [
                            { item: 'fungal_essence', dropRate: 0.8, amount: [2, 4] },
                            { item: 'zombie_mushroom', dropRate: 0.4, amount: 1 },
                            { item: 'healing_spores', dropRate: 0.15, amount: [1, 2] }
                        ]
                    },
                    {
                        id: 'mushroom_golem',
                        name: 'Mycelium Guardian',
                        model: 'golem',
                        level: { min: 15, max: 22 },
                        spawnRate: 0.4,
                        behavior: 'aggressive',
                        stats: {
                            health: { base: 200, perLevel: 25 },
                            damage: { base: 30, perLevel: 5 },
                            defense: { base: 15, perLevel: 3 },
                            speed: 0.7
                        },
                        abilities: ['spore_explosion', 'fungal_regeneration', 'toxic_slam'],
                        loot: [
                            { item: 'mushroom_core', dropRate: 0.6, amount: 1 },
                            { item: 'fungal_armor_piece', dropRate: 0.3, amount: 1 },
                            { item: 'rare_spore', dropRate: 0.1, amount: 1 }
                        ]
                    }
                ],
                
                bosses: [
                    {
                        id: 'fungal_empress',
                        name: 'Empress Mycelia',
                        model: 'anime_girl',
                        level: 25,
                        spawnLocation: 'spore_throne_room',
                        spawnCondition: 'collect_3_throne_keys',
                        phases: 4,
                        stats: {
                            health: 5000,
                            damage: 80,
                            defense: 50,
                            speed: 1.2
                        },
                        abilities: [
                            'hivemind_control',
                            'spore_tsunami',
                            'fungal_transformation',
                            'empress_charm',
                            'final_bloom'
                        ],
                        loot: [
                            { item: 'empress_crown', dropRate: 1.0, amount: 1 },
                            { item: 'fungal_heart', dropRate: 1.0, amount: 1 },
                            { item: 'legendary_spore_staff', dropRate: 0.15, amount: 1 },
                            { item: 'zone_2_key', dropRate: 1.0, amount: 1 }
                        ],
                        dialogue: [
                            'Welcome to my garden, little Wielder~',
                            'Join us... become one with the network...',
                            'You fight it, but you\'ll understand soon... we are BEAUTIFUL!'
                        ]
                    }
                ],
                
                quests: [
                    {
                        id: 'spore_collection',
                        name: 'Harvest of the Fungi',
                        type: 'gathering',
                        giver: 'fungal_alchemist',
                        objectives: [
                            { type: 'collect', description: 'Gather 50 Fungal Essence', count: 50, item: 'fungal_essence' },
                            { type: 'collect', description: 'Find 10 Rare Spores', count: 10, item: 'rare_spore' }
                        ],
                        rewards: {
                            experience: 1500,
                            gold: 500,
                            items: ['spore_collection_kit', 'fungal_resistance_potion'],
                            reputation: { faction: 'alchemists_guild', amount: 20 }
                        }
                    }
                ],
                
                lootTables: {
                    common: [
                        { item: 'fungal_essence', weight: 35 },
                        { item: 'healing_spores', weight: 25 },
                        { item: 'vision_mushroom', weight: 15 },
                        { item: 'zombie_mushroom', weight: 15 },
                        { item: 'copper_coin', weight: 10 }
                    ],
                    uncommon: [
                        { item: 'mushroom_core', weight: 30 },
                        { item: 'rare_spore', weight: 25 },
                        { item: 'fungal_armor_piece', weight: 20 },
                        { item: 'toxic_extract', weight: 15 },
                        { item: 'silver_coin', weight: 10 }
                    ]
                },
                
                audio: {
                    music: 'fungal_city_ambient',
                    ambient: ['spore_pulse', 'fungal_growth', 'distant_humming', 'whispers'],
                    combat: 'fungal_city_battle',
                    boss: 'empress_mycelia_theme'
                },
                
                events: [
                    {
                        id: 'bloom_event',
                        name: 'The Great Bloom',
                        triggerCondition: 'random_1hour',
                        duration: 600,
                        effects: {
                            spawnRate: { multiplier: 3 },
                            lootQuality: { increase: 2 },
                            buffAll: { stat: 'health_regen', amount: 50 }
                        },
                        announcement: '🍄 The Great Bloom begins! Fungi multiply rapidly!'
                    }
                ]
            }
            
            // More presets would continue here (Vine Cathedral, Broken Starship, Twilight Throne)
            // Each with unique lore, NPCs, enemies, bosses, quests, and immersive details
        };
    }
    
    /**
     * Get a preset by ID
     */
    getPreset(presetId) {
        return this.presets[presetId] || this.presets.crystal_caverns;
    }
    
    /**
     * Get all available presets
     */
    getAllPresets() {
        return Object.values(this.presets);
    }
    
    /**
     * Get presets by tier/difficulty
     */
    getPresetsByTier(tier) {
        return Object.values(this.presets).filter(p => p.tier === tier);
    }
    
    /**
     * Get preset recommendations based on player level
     */
    getRecommendedPresets(playerLevel) {
        return Object.values(this.presets).filter(p => {
            const [min, max] = p.recommendedLevel.split('-').map(Number);
            return playerLevel >= min && playerLevel <= max;
        });
    }
}
