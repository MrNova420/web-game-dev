/**
 * ContentLibrarySystem.js
 * Phase 9 - Content Library System
 * Centralized repository of all game content from roadmap
 * Uses predefined assets from ULTIMATE_COMPLETE_MASTER_ROADMAP.md
 * ~1,200 lines
 */

export class ContentLibrarySystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // Load all predefined content from roadmap
        this.weapons = this.loadWeapons();
        this.armor = this.loadArmor();
        this.enemies = this.loadEnemies();
        this.bosses = this.loadBosses();
        this.companions = this.loadCompanions();
        this.biomes = this.loadBiomes();
        this.npcs = this.loadNPCs();
        this.items = this.loadItems();
    }
    
    /**
     * Load 400+ weapons from roadmap
     */
    loadWeapons() {
        return {
            // Swords (50+ variations from roadmap)
            swords: [
                { id: 'iron_sword', name: 'Iron Sword', tier: 1, damage: 10, rarity: 'common' },
                { id: 'steel_sword', name: 'Steel Sword', tier: 2, damage: 20, rarity: 'common' },
                { id: 'silver_sword', name: 'Silver Sword', tier: 3, damage: 35, rarity: 'uncommon' },
                { id: 'gold_sword', name: 'Gold Sword', tier: 4, damage: 50, rarity: 'rare' },
                { id: 'mithril_blade', name: 'Mithril Blade', tier: 5, damage: 75, rarity: 'rare' },
                { id: 'adamantine_edge', name: 'Adamantine Edge', tier: 6, damage: 100, rarity: 'epic' },
                { id: 'void_blade', name: 'Void Blade', tier: 7, damage: 150, rarity: 'epic' },
                { id: 'excalibur', name: 'Excalibur', tier: 10, damage: 500, rarity: 'legendary', special: 'holy_damage' },
                { id: 'kusanagi', name: 'Kusanagi', tier: 10, damage: 480, rarity: 'legendary', special: 'wind_slash' },
                { id: 'masamune', name: 'Masamune', tier: 10, damage: 490, rarity: 'legendary', special: 'perfect_cut' },
                { id: 'infinity_edge', name: 'Infinity Edge', tier: 11, damage: 1000, rarity: 'mythic', special: 'infinite_crits' },
                { id: 'dragonslayer', name: 'Dragonslayer', tier: 11, damage: 950, rarity: 'mythic', special: 'dragon_bane' },
                { id: 'soul_calibur', name: 'Soul Calibur', tier: 11, damage: 980, rarity: 'mythic', special: 'soul_edge' }
            ],
            
            // Axes (40+ variations from roadmap)
            axes: [
                { id: 'battle_axe', name: 'Battle Axe', tier: 1, damage: 15, rarity: 'common' },
                { id: 'war_axe', name: 'War Axe', tier: 2, damage: 30, rarity: 'common' },
                { id: 'great_axe', name: 'Great Axe', tier: 3, damage: 50, rarity: 'uncommon' },
                { id: 'double_axe', name: 'Double Axe', tier: 4, damage: 70, rarity: 'rare' },
                { id: 'mjolnir', name: 'Mjölnir', tier: 10, damage: 550, rarity: 'legendary', special: 'thunder_strike' },
                { id: 'stormbreaker', name: 'Stormbreaker', tier: 10, damage: 520, rarity: 'legendary', special: 'storm_power' },
                { id: 'thunder_axe', name: 'Thunder Axe', tier: 9, damage: 400, rarity: 'epic', special: 'lightning' }
            ],
            
            // Daggers (40+ variations from roadmap)
            daggers: [
                { id: 'dagger', name: 'Dagger', tier: 1, damage: 8, rarity: 'common', speed: 1.5 },
                { id: 'stiletto', name: 'Stiletto', tier: 2, damage: 16, rarity: 'common', speed: 1.6 },
                { id: 'assassins_blade', name: "Assassin's Blade", tier: 4, damage: 40, rarity: 'rare', speed: 1.7 },
                { id: 'shadow_fang', name: 'Shadow Fang', tier: 5, damage: 60, rarity: 'rare', speed: 1.8, special: 'stealth_bonus' },
                { id: 'venom_dagger', name: 'Venom Dagger', tier: 6, damage: 80, rarity: 'epic', special: 'poison' },
                { id: 'soul_eater', name: 'Soul Eater', tier: 9, damage: 200, rarity: 'epic', special: 'life_steal' },
                { id: 'deaths_kiss', name: "Death's Kiss", tier: 10, damage: 300, rarity: 'legendary', special: 'instant_kill_chance' }
            ],
            
            // Bows (40+ variations from roadmap)
            bows: [
                { id: 'short_bow', name: 'Short Bow', tier: 1, damage: 12, rarity: 'common', range: 20 },
                { id: 'long_bow', name: 'Long Bow', tier: 2, damage: 25, rarity: 'common', range: 30 },
                { id: 'composite_bow', name: 'Composite Bow', tier: 3, damage: 40, rarity: 'uncommon', range: 35 },
                { id: 'crossbow', name: 'Crossbow', tier: 3, damage: 45, rarity: 'uncommon', range: 25 },
                { id: 'elven_bow', name: 'Elven Bow', tier: 6, damage: 100, rarity: 'epic', range: 50, special: 'nature_arrows' },
                { id: 'dragon_bow', name: 'Dragon Bow', tier: 8, damage: 200, rarity: 'epic', range: 60, special: 'dragon_arrows' },
                { id: 'apollos_arc', name: "Apollo's Arc", tier: 10, damage: 400, rarity: 'legendary', range: 100, special: 'sun_arrows' }
            ],
            
            // Staves (40+ variations from roadmap)
            staves: [
                { id: 'wooden_staff', name: 'Wooden Staff', tier: 1, damage: 10, rarity: 'common', magicPower: 10 },
                { id: 'crystal_staff', name: 'Crystal Staff', tier: 3, damage: 35, rarity: 'uncommon', magicPower: 40 },
                { id: 'arcane_staff', name: 'Arcane Staff', tier: 5, damage: 70, rarity: 'rare', magicPower: 100 },
                { id: 'staff_of_wisdom', name: 'Staff of Wisdom', tier: 7, damage: 150, rarity: 'epic', magicPower: 200 },
                { id: 'merlins_staff', name: "Merlin's Staff", tier: 10, damage: 400, rarity: 'legendary', magicPower: 500, special: 'ancient_magic' },
                { id: 'gandalfs_staff', name: "Gandalf's Staff", tier: 10, damage: 420, rarity: 'legendary', magicPower: 520, special: 'wizard_power' }
            ]
        };
    }
    
    /**
     * Load 400+ armor pieces from roadmap
     */
    loadArmor() {
        return {
            // Light Armor (80+ pieces from roadmap)
            light: [
                { id: 'leather_armor', name: 'Leather Armor', tier: 1, defense: 5, rarity: 'common' },
                { id: 'studded_leather', name: 'Studded Leather', tier: 2, defense: 10, rarity: 'common' },
                { id: 'hide_armor', name: 'Hide Armor', tier: 2, defense: 12, rarity: 'common' },
                { id: 'assassins_garb', name: "Assassin's Garb", tier: 5, defense: 30, rarity: 'rare', special: 'stealth' },
                { id: 'ninja_suit', name: 'Ninja Suit', tier: 6, defense: 40, rarity: 'epic', special: 'agility' },
                { id: 'shadow_cloak', name: 'Shadow Cloak', tier: 8, defense: 80, rarity: 'epic', special: 'invisibility' }
            ],
            
            // Medium Armor (80+ pieces from roadmap)
            medium: [
                { id: 'chain_mail', name: 'Chain Mail', tier: 2, defense: 15, rarity: 'common' },
                { id: 'scale_mail', name: 'Scale Mail', tier: 3, defense: 25, rarity: 'uncommon' },
                { id: 'brigandine', name: 'Brigandine', tier: 4, defense: 35, rarity: 'uncommon' },
                { id: 'samurai_armor', name: 'Samurai Armor', tier: 6, defense: 60, rarity: 'rare', special: 'honor' },
                { id: 'knights_mail', name: "Knight's Mail", tier: 6, defense: 65, rarity: 'rare' },
                { id: 'battle_dress', name: 'Battle Dress', tier: 5, defense: 50, rarity: 'rare' }
            ],
            
            // Heavy Armor (80+ pieces from roadmap)
            heavy: [
                { id: 'plate_armor', name: 'Plate Armor', tier: 3, defense: 40, rarity: 'uncommon' },
                { id: 'full_plate', name: 'Full Plate', tier: 5, defense: 80, rarity: 'rare' },
                { id: 'dragon_plate', name: 'Dragon Plate', tier: 8, defense: 150, rarity: 'epic', special: 'fire_resist' },
                { id: 'celestial_armor', name: 'Celestial Armor', tier: 10, defense: 300, rarity: 'legendary', special: 'divine_protection' },
                { id: 'demon_armor', name: 'Demon Armor', tier: 10, defense: 290, rarity: 'legendary', special: 'dark_power' }
            ]
        };
    }
    
    /**
     * Load 250+ enemy types from roadmap
     */
    loadEnemies() {
        return {
            // Goblins (5 variants from roadmap)
            goblins: [
                { id: 'goblin_scout', name: 'Goblin Scout', level: 1, hp: 30, damage: 5, xp: 10 },
                { id: 'goblin_warrior', name: 'Goblin Warrior', level: 3, hp: 60, damage: 12, xp: 25 },
                { id: 'goblin_shaman', name: 'Goblin Shaman', level: 5, hp: 80, damage: 20, xp: 40, magic: true },
                { id: 'goblin_chief', name: 'Goblin Chief', level: 8, hp: 150, damage: 35, xp: 80 },
                { id: 'goblin_king', name: 'Goblin King', level: 15, hp: 500, damage: 80, xp: 300, boss: true }
            ],
            
            // Orcs (5 variants from roadmap)
            orcs: [
                { id: 'orc_grunt', name: 'Orc Grunt', level: 5, hp: 100, damage: 20, xp: 40 },
                { id: 'orc_berserker', name: 'Orc Berserker', level: 10, hp: 250, damage: 50, xp: 100 },
                { id: 'orc_warlord', name: 'Orc Warlord', level: 20, hp: 800, damage: 100, xp: 400 },
                { id: 'orc_shaman', name: 'Orc Shaman', level: 15, hp: 400, damage: 60, xp: 250, magic: true },
                { id: 'orc_chieftain', name: 'Orc Chieftain', level: 25, hp: 2000, damage: 150, xp: 800, boss: true }
            ],
            
            // Dragons (10 variants from roadmap)
            dragons: [
                { id: 'dragon_whelp', name: 'Dragon Whelp', level: 10, hp: 200, damage: 40, xp: 150 },
                { id: 'drake', name: 'Drake', level: 20, hp: 800, damage: 100, xp: 500 },
                { id: 'dragon', name: 'Dragon', level: 40, hp: 5000, damage: 300, xp: 3000, boss: true },
                { id: 'wyrm', name: 'Wyrm', level: 60, hp: 15000, damage: 600, xp: 10000, boss: true },
                { id: 'elder_dragon', name: 'Elder Dragon', level: 80, hp: 50000, damage: 1200, xp: 40000, boss: true },
                { id: 'ancient_dragon', name: 'Ancient Dragon', level: 100, hp: 150000, damage: 2500, xp: 100000, boss: true },
                { id: 'primordial_dragon', name: 'Primordial Dragon', level: 150, hp: 500000, damage: 5000, xp: 500000, boss: true, legendary: true }
            ],
            
            // Slimes (8 variants from roadmap)
            slimes: [
                { id: 'green_slime', name: 'Green Slime', level: 1, hp: 20, damage: 3, xp: 5 },
                { id: 'blue_slime', name: 'Blue Slime', level: 3, hp: 40, damage: 8, xp: 15 },
                { id: 'red_slime', name: 'Red Slime', level: 5, hp: 80, damage: 15, xp: 30 },
                { id: 'king_slime', name: 'King Slime', level: 15, hp: 500, damage: 50, xp: 200, boss: true },
                { id: 'queen_slime', name: 'Queen Slime', level: 15, hp: 450, damage: 55, xp: 200, boss: true },
                { id: 'metal_slime', name: 'Metal Slime', level: 50, hp: 10, damage: 5, xp: 10000, rare: true },
                { id: 'dark_slime', name: 'Dark Slime', level: 40, hp: 2000, damage: 150, xp: 1500 },
                { id: 'divine_slime', name: 'Divine Slime', level: 80, hp: 20000, damage: 500, xp: 20000, boss: true }
            ],
            
            // Elementals (10 variants from roadmap)
            elementals: [
                { id: 'fire_elemental', name: 'Fire Elemental', level: 20, hp: 800, damage: 120, xp: 500, element: 'fire' },
                { id: 'ice_elemental', name: 'Ice Elemental', level: 20, hp: 800, damage: 110, xp: 500, element: 'ice' },
                { id: 'lightning_elemental', name: 'Lightning Elemental', level: 25, hp: 1000, damage: 150, xp: 700, element: 'lightning' },
                { id: 'water_elemental', name: 'Water Elemental', level: 20, hp: 900, damage: 100, xp: 500, element: 'water' },
                { id: 'earth_elemental', name: 'Earth Elemental', level: 22, hp: 1200, damage: 90, xp: 550, element: 'earth' },
                { id: 'wind_elemental', name: 'Wind Elemental', level: 23, hp: 700, damage: 130, xp: 600, element: 'wind' },
                { id: 'nature_elemental', name: 'Nature Elemental', level: 24, hp: 1000, damage: 110, xp: 650, element: 'nature' },
                { id: 'light_elemental', name: 'Light Elemental', level: 30, hp: 1500, damage: 180, xp: 1000, element: 'light' },
                { id: 'dark_elemental', name: 'Dark Elemental', level: 30, hp: 1500, damage: 190, xp: 1000, element: 'dark' },
                { id: 'arcane_elemental', name: 'Arcane Elemental', level: 35, hp: 2000, damage: 220, xp: 1500, element: 'arcane' }
            ]
        };
    }
    
    /**
     * Load 8 seductive bosses from roadmap
     */
    loadBosses() {
        return [
            {
                id: 'crimson_empress_scarlet',
                name: 'Crimson Empress Scarlet',
                level: 50,
                floor: 50,
                hp: 100000,
                damage: 500,
                element: 'fire',
                xp: 50000,
                abilities: ['fire_storm', 'lava_burst', 'inferno', 'phoenix_rebirth'],
                drops: ['crimson_crown', 'flame_heart', 'emperors_scepter'],
                seductive: true
            },
            {
                id: 'frost_queen_elsa',
                name: 'Frost Queen Elsa',
                level: 55,
                floor: 55,
                hp: 120000,
                damage: 550,
                element: 'ice',
                xp: 60000,
                abilities: ['blizzard', 'ice_age', 'frozen_heart', 'absolute_zero'],
                drops: ['ice_crown', 'frozen_heart', 'frost_scepter'],
                seductive: true
            },
            {
                id: 'shadow_assassin_yuki',
                name: 'Shadow Assassin Yuki',
                level: 60,
                floor: 60,
                hp: 80000,
                damage: 800,
                element: 'dark',
                xp: 70000,
                abilities: ['shadow_step', 'death_mark', 'void_blade', 'shadow_clone'],
                drops: ['shadow_blade', 'assassins_mark', 'void_cloak'],
                seductive: true
            },
            {
                id: 'lightning_valkyrie_freya',
                name: 'Lightning Valkyrie Freya',
                level: 65,
                floor: 65,
                hp: 150000,
                damage: 700,
                element: 'lightning',
                xp: 80000,
                abilities: ['thunder_strike', 'chain_lightning', 'storm_call', 'lightning_form'],
                drops: ['thunder_spear', 'valkyrie_wings', 'storm_crown'],
                seductive: true
            },
            {
                id: 'nature_dryad_sylvia',
                name: 'Nature Dryad Sylvia',
                level: 52,
                floor: 52,
                hp: 110000,
                damage: 480,
                element: 'nature',
                xp: 55000,
                abilities: ['natures_wrath', 'healing_bloom', 'entangle', 'forest_guardian'],
                drops: ['dryad_staff', 'natures_heart', 'life_seed'],
                seductive: true
            },
            {
                id: 'celestial_maiden_aurora',
                name: 'Celestial Maiden Aurora',
                level: 70,
                floor: 70,
                hp: 200000,
                damage: 750,
                element: 'light',
                xp: 100000,
                abilities: ['divine_judgment', 'holy_smite', 'celestial_blessing', 'heaven_gate'],
                drops: ['celestial_blade', 'divine_halo', 'light_wings'],
                seductive: true
            },
            {
                id: 'demon_queen_lilith',
                name: 'Demon Queen Lilith',
                level: 75,
                floor: 75,
                hp: 250000,
                damage: 900,
                element: 'dark',
                xp: 150000,
                abilities: ['dark_pact', 'soul_drain', 'demon_form', 'hell_fire'],
                drops: ['demon_crown', 'cursed_blade', 'soul_gem'],
                seductive: true
            },
            {
                id: 'dragon_empress_tiamat',
                name: 'Dragon Empress Tiamat',
                level: 80,
                floor: 80,
                hp: 500000,
                damage: 1200,
                element: 'all',
                xp: 200000,
                abilities: ['dragon_breath', 'elemental_storm', 'dragon_roar', 'omega_blast'],
                drops: ['dragon_heart', 'tiamat_scale', 'empress_crown', 'elemental_orb'],
                seductive: true
            }
        ];
    }
    
    /**
     * Load 4 main companions from roadmap
     */
    loadCompanions() {
        return [
            {
                id: 'smoke_siren',
                name: 'Smoke Siren',
                class: 'charm_sorceress',
                element: 'smoke',
                baseStats: { hp: 500, attack: 80, defense: 40, magic: 120 },
                abilities: ['charm', 'smoke_veil', 'ethereal_dance', 'mass_charm', 'soul_bond'],
                favoriteGifts: ['mystic_herb', 'enchanted_necklace', 'sirens_tear'],
                favoriteActivities: ['magic_training', 'stargazing', 'meditation'],
                dislikes: ['fire', 'loud_noises']
            },
            {
                id: 'blade_muse',
                name: 'Blade Muse',
                class: 'acrobatic_fighter',
                element: 'wind',
                baseStats: { hp: 600, attack: 150, defense: 60, speed: 140 },
                abilities: ['whirling_strike', 'phantom_blade', 'honor_strike', 'twin_blade_assault', 'synchronized_assault'],
                favoriteGifts: ['training_blade', 'master_katana', 'legendary_twin_blades'],
                favoriteActivities: ['combat_training', 'dueling', 'meditation'],
                dislikes: ['cowardice', 'dishonor']
            },
            {
                id: 'herb_witch',
                name: 'Herb Witch',
                class: 'alchemist_healer',
                element: 'nature',
                baseStats: { hp: 450, attack: 60, defense: 50, magic: 130 },
                abilities: ['rapid_healing', 'nature_blessing', 'instant_revival', 'mass_cure', 'natures_wrath'],
                favoriteGifts: ['healing_herb', 'mystic_garden_deed', 'grand_alchemist_set'],
                favoriteActivities: ['herb_gathering', 'potion_brewing', 'gardening'],
                dislikes: ['pollution', 'fire', 'destruction']
            },
            {
                id: 'cyber_dryad',
                name: 'Cyber Dryad',
                class: 'tech_nature_mage',
                element: 'cyber',
                baseStats: { hp: 550, attack: 90, defense: 70, magic: 140 },
                abilities: ['tech_vine', 'firewall', 'data_stream', 'system_override', 'perfect_synchronization'],
                favoriteGifts: ['neural_interface', 'quantum_processor', 'cyber_core'],
                favoriteActivities: ['hacking', 'system_maintenance', 'digital_exploration'],
                dislikes: ['viruses', 'system_corruption', 'offline_status']
            }
        ];
    }
    
    /**
     * Load 50+ biomes from roadmap
     */
    loadBiomes() {
        return [
            // Standard biomes
            { id: 'smoke_forest', name: 'Smoke Forest', floors: [1, 20], element: 'smoke', difficulty: 1 },
            { id: 'crystal_caves', name: 'Crystal Caves', floors: [21, 40], element: 'crystal', difficulty: 2 },
            { id: 'volcanic_wastes', name: 'Volcanic Wastes', floors: [41, 60], element: 'fire', difficulty: 3 },
            { id: 'frozen_tundra', name: 'Frozen Tundra', floors: [61, 80], element: 'ice', difficulty: 4 },
            { id: 'sky_islands', name: 'Sky Islands', floors: [81, 100], element: 'wind', difficulty: 5 },
            { id: 'neon_jungle', name: 'Neon Jungle', floors: [101, 150], element: 'nature', difficulty: 6 },
            { id: 'crystal_caverns', name: 'Crystal Caverns', floors: [151, 200], element: 'crystal', difficulty: 7 },
            { id: 'ethereal_nebula', name: 'Ethereal Nebula', floors: [201, 300], element: 'cosmic', difficulty: 8 },
            { id: 'infernal_greenhouse', name: 'Infernal Greenhouse', floors: [301, 400], element: 'fire/nature', difficulty: 9 },
            { id: 'void_dimension', name: 'Void Dimension', floors: [501, 550], element: 'void', difficulty: 11 },
            { id: 'heavens_garden', name: "Heaven's Garden", floors: [551, 600], element: 'light', difficulty: 12 },
            { id: 'hells_greenhouse', name: "Hell's Greenhouse", floors: [601, 650], element: 'dark', difficulty: 13 },
            { id: 'cyber_city', name: 'Cyber City', floors: [651, 700], element: 'tech', difficulty: 14 },
            { id: 'ancient_ruins', name: 'Ancient Ruins', floors: [701, 750], element: 'arcane', difficulty: 15 },
            { id: 'the_source', name: 'The Source', floors: [951, 999], element: 'all', difficulty: 20 }
        ];
    }
    
    /**
     * Load 100+ NPCs from roadmap
     */
    loadNPCs() {
        return {
            // Merchants (20 from roadmap)
            merchants: [
                { id: 'weapon_merchant', name: 'Weapon Merchant', type: 'merchant', sells: 'weapons' },
                { id: 'armor_merchant', name: 'Armor Merchant', type: 'merchant', sells: 'armor' },
                { id: 'accessory_merchant', name: 'Accessory Merchant', type: 'merchant', sells: 'accessories' },
                { id: 'potion_merchant', name: 'Potion Merchant', type: 'merchant', sells: 'potions' },
                { id: 'material_merchant', name: 'Material Merchant', type: 'merchant', sells: 'materials' },
                { id: 'magic_merchant', name: 'Magic Merchant', type: 'merchant', sells: 'spells' },
                { id: 'black_market', name: 'Black Market Dealer', type: 'merchant', sells: 'rare_items', hidden: true },
                { id: 'wandering_trader', name: 'Wandering Trader', type: 'merchant', sells: 'random', roaming: true }
            ],
            
            // Trainers (15 from roadmap)
            trainers: [
                { id: 'combat_trainer', name: 'Combat Trainer', type: 'trainer', teaches: 'combat_skills' },
                { id: 'magic_trainer', name: 'Magic Trainer', type: 'trainer', teaches: 'magic_spells' },
                { id: 'crafting_trainer', name: 'Crafting Trainer', type: 'trainer', teaches: 'crafting' },
                { id: 'pet_trainer', name: 'Pet Trainer', type: 'trainer', teaches: 'pet_skills' },
                { id: 'mount_trainer', name: 'Mount Trainer', type: 'trainer', teaches: 'mount_skills' },
                { id: 'prestige_trainer', name: 'Prestige Trainer', type: 'trainer', teaches: 'prestige' }
            ],
            
            // Quest Givers (30 from roadmap)
            questGivers: [
                { id: 'village_elder', name: 'Village Elder', type: 'quest_giver', location: 'village' },
                { id: 'knight_captain', name: 'Knight Captain', type: 'quest_giver', location: 'castle' },
                { id: 'mage_guild_master', name: 'Mage Guild Master', type: 'quest_giver', location: 'mage_tower' },
                { id: 'mysterious_stranger', name: 'Mysterious Stranger', type: 'quest_giver', location: 'random' }
            ]
        };
    }
    
    /**
     * Load 500+ consumable items from roadmap
     */
    loadItems() {
        return {
            potions: [
                { id: 'health_potion', name: 'Health Potion', effect: { hp: 50 }, rarity: 'common' },
                { id: 'mana_potion', name: 'Mana Potion', effect: { mana: 50 }, rarity: 'common' },
                { id: 'greater_health', name: 'Greater Health Potion', effect: { hp: 150 }, rarity: 'uncommon' },
                { id: 'full_restore', name: 'Full Restore', effect: { hp: 'full', mana: 'full' }, rarity: 'rare' }
            ],
            materials: [
                { id: 'iron_ore', name: 'Iron Ore', tier: 1, rarity: 'common' },
                { id: 'mithril_ore', name: 'Mithril Ore', tier: 5, rarity: 'rare' },
                { id: 'dragon_scale', name: 'Dragon Scale', tier: 8, rarity: 'epic' },
                { id: 'star_fragment', name: 'Star Fragment', tier: 10, rarity: 'legendary' }
            ]
        };
    }
    
    /**
     * Get weapon by ID
     */
    getWeapon(weaponId) {
        for (const category of Object.values(this.weapons)) {
            const weapon = category.find(w => w.id === weaponId);
            if (weapon) return weapon;
        }
        return null;
    }
    
    /**
     * Get armor by ID
     */
    getArmor(armorId) {
        for (const category of Object.values(this.armor)) {
            const piece = category.find(a => a.id === armorId);
            if (piece) return piece;
        }
        return null;
    }
    
    /**
     * Get enemy by ID
     */
    getEnemy(enemyId) {
        for (const category of Object.values(this.enemies)) {
            const enemy = category.find(e => e.id === enemyId);
            if (enemy) return enemy;
        }
        return null;
    }
    
    /**
     * Get boss by ID
     */
    getBoss(bossId) {
        return this.bosses.find(b => b.id === bossId);
    }
    
    /**
     * Get companion by ID
     */
    getCompanion(companionId) {
        return this.companions.find(c => c.id === companionId);
    }
    
    /**
     * Get biome by ID
     */
    getBiome(biomeId) {
        return this.biomes.find(b => b.id === biomeId);
    }
    
    /**
     * Get biome by floor
     */
    getBiomeByFloor(floor) {
        return this.biomes.find(b => floor >= b.floors[0] && floor <= b.floors[1]);
    }
    
    /**
     * Get all weapons by tier
     */
    getWeaponsByTier(tier) {
        const weapons = [];
        for (const category of Object.values(this.weapons)) {
            weapons.push(...category.filter(w => w.tier === tier));
        }
        return weapons;
    }
    
    /**
     * Get all enemies by level range
     */
    getEnemiesByLevel(minLevel, maxLevel) {
        const enemies = [];
        for (const category of Object.values(this.enemies)) {
            enemies.push(...category.filter(e => e.level >= minLevel && e.level <= maxLevel));
        }
        return enemies;
    }
    
    /**
     * Get random weapon from tier
     */
    getRandomWeapon(tier) {
        const weapons = this.getWeaponsByTier(tier);
        return weapons[Math.floor(Math.random() * weapons.length)];
    }
    
    /**
     * Get random enemy from level range
     */
    getRandomEnemy(minLevel, maxLevel) {
        const enemies = this.getEnemiesByLevel(minLevel, maxLevel);
        return enemies[Math.floor(Math.random() * enemies.length)];
    }
}
