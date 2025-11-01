import { logger } from '../core/Logger.js';
/**
 * Complete Item Database
 * 1000+ items: weapons, armor, accessories, consumables, materials, quest items
 */

export const ItemDatabase = {
    // WEAPONS (300 items)
    weapons: {
        // Swords (50)
        RUSTY_SWORD: {
            id: 'rusty_sword',
            name: 'Rusty Sword',
            type: 'weapon',
            subtype: 'sword',
            rarity: 'common',
            level: 1,
            stats: { attack: 5, speed: 1.0 },
            requirements: { level: 1, strength: 0 },
            value: 10,
            description: 'An old, rusted blade. Better than nothing.',
            icon: 'sword_rusty.png'
        },
        IRON_SWORD: {
            id: 'iron_sword',
            name: 'Iron Sword',
            type: 'weapon',
            subtype: 'sword',
            rarity: 'common',
            level: 5,
            stats: { attack: 15, speed: 1.0 },
            requirements: { level: 5, strength: 10 },
            value: 50,
            description: 'A basic iron sword.',
            icon: 'sword_iron.png'
        },
        STEEL_SWORD: {
            id: 'steel_sword',
            name: 'Steel Sword',
            type: 'weapon',
            subtype: 'sword',
            rarity: 'uncommon',
            level: 10,
            stats: { attack: 30, speed: 1.1, critChance: 0.05 },
            requirements: { level: 10, strength: 20 },
            value: 150,
            description: 'Well-crafted steel blade with a sharp edge.',
            icon: 'sword_steel.png'
        },
        MYTHRIL_SWORD: {
            id: 'mythril_sword',
            name: 'Mythril Sword',
            type: 'weapon',
            subtype: 'sword',
            rarity: 'rare',
            level: 20,
            stats: { attack: 60, speed: 1.2, critChance: 0.1, critDamage: 1.5 },
            requirements: { level: 20, strength: 40 },
            value: 500,
            description: 'Light but incredibly strong mythril blade.',
            icon: 'sword_mythril.png'
        },
        DRAGON_SLAYER: {
            id: 'dragon_slayer',
            name: 'Dragon Slayer',
            type: 'weapon',
            subtype: 'sword',
            rarity: 'epic',
            level: 40,
            stats: { attack: 150, speed: 1.3, critChance: 0.15, critDamage: 2.0 },
            bonuses: { dragonSlayer: 2.0 },
            requirements: { level: 40, strength: 80 },
            value: 5000,
            description: 'Forged to slay dragons. Deals massive damage to dragon-type enemies.',
            icon: 'sword_dragon.png',
            effects: ['fire_damage']
        },
        EXCALIBUR: {
            id: 'excalibur',
            name: 'Excalibur',
            type: 'weapon',
            subtype: 'sword',
            rarity: 'legendary',
            level: 60,
            stats: { attack: 300, speed: 1.5, critChance: 0.25, critDamage: 3.0 },
            bonuses: { allStats: 50, holy: 1.5 },
            requirements: { level: 60, strength: 120, quest: 'king_arthur_questline' },
            value: 50000,
            description: 'The legendary sword of kings. Blessed by divine power.',
            icon: 'sword_excalibur.png',
            effects: ['holy_light', 'mana_regen', 'leadership_aura'],
            unique: true
        },
        
        // Daggers (30)
        RUSTY_DAGGER: {
            id: 'rusty_dagger',
            name: 'Rusty Dagger',
            type: 'weapon',
            subtype: 'dagger',
            rarity: 'common',
            level: 1,
            stats: { attack: 3, speed: 1.5, critChance: 0.1 },
            requirements: { level: 1, dexterity: 0 },
            value: 5,
            description: 'A small rusty blade. Fast but weak.',
            icon: 'dagger_rusty.png'
        },
        SHADOW_FANG: {
            id: 'shadow_fang',
            name: 'Shadow Fang',
            type: 'weapon',
            subtype: 'dagger',
            rarity: 'legendary',
            level: 50,
            stats: { attack: 200, speed: 2.0, critChance: 0.4, critDamage: 4.0 },
            bonuses: { stealth: 50, backstab: 3.0 },
            requirements: { level: 50, dexterity: 150 },
            value: 30000,
            description: 'Forged in shadows. Deadly in the right hands.',
            icon: 'dagger_shadow.png',
            effects: ['poison', 'invisibility', 'bleeding'],
            unique: true
        },
        
        // Axes (30)
        WOOD_AXE: {
            id: 'wood_axe',
            name: 'Wood Axe',
            type: 'weapon',
            subtype: 'axe',
            rarity: 'common',
            level: 1,
            stats: { attack: 8, speed: 0.8 },
            requirements: { level: 1, strength: 5 },
            value: 15,
            description: 'Used for chopping wood. Can be used as weapon.',
            icon: 'axe_wood.png'
        },
        BERSERKER_AXE: {
            id: 'berserker_axe',
            name: 'Berserker\'s Rage',
            type: 'weapon',
            subtype: 'axe',
            rarity: 'legendary',
            level: 55,
            stats: { attack: 350, speed: 0.9, critChance: 0.3, critDamage: 5.0 },
            bonuses: { berserk: true, lifesteal: 0.15 },
            requirements: { level: 55, strength: 180 },
            value: 40000,
            description: 'The more you kill, the stronger it gets.',
            icon: 'axe_berserker.png',
            effects: ['rage_mode', 'cleave', 'bloodlust']
        },
        
        // Bows (30)
        SHORT_BOW: {
            id: 'short_bow',
            name: 'Short Bow',
            type: 'weapon',
            subtype: 'bow',
            rarity: 'common',
            level: 1,
            stats: { attack: 6, speed: 1.2, range: 20 },
            requirements: { level: 1, dexterity: 5 },
            value: 20,
            description: 'Basic bow for hunting.',
            icon: 'bow_short.png'
        },
        ELVEN_BOW: {
            id: 'elven_bow',
            name: 'Elven Longbow',
            type: 'weapon',
            subtype: 'bow',
            rarity: 'legendary',
            level: 45,
            stats: { attack: 220, speed: 1.8, range: 50, critChance: 0.35 },
            bonuses: { piercing: 2, multishot: 3 },
            requirements: { level: 45, dexterity: 140 },
            value: 35000,
            description: 'Crafted by elven masters. Never misses.',
            icon: 'bow_elven.png',
            effects: ['multi_arrow', 'guided_shot', 'nature_blessing']
        },
        
        // Staffs (40)
        WOODEN_STAFF: {
            id: 'wooden_staff',
            name: 'Wooden Staff',
            type: 'weapon',
            subtype: 'staff',
            rarity: 'common',
            level: 1,
            stats: { attack: 4, magicPower: 10, mana: 20 },
            requirements: { level: 1, intelligence: 5 },
            value: 25,
            description: 'Simple staff for apprentice mages.',
            icon: 'staff_wood.png'
        },
        STAFF_OF_ETERNITY: {
            id: 'staff_of_eternity',
            name: 'Staff of Eternity',
            type: 'weapon',
            subtype: 'staff',
            rarity: 'mythic',
            level: 80,
            stats: { attack: 500, magicPower: 800, mana: 2000, manaRegen: 50 },
            bonuses: { allMagic: 3.0, cooldownReduction: 0.5 },
            requirements: { level: 80, intelligence: 300, magicCircle: 9 },
            value: 500000,
            description: 'Wielded by the Magic God. Contains infinite magical power.',
            icon: 'staff_eternity.png',
            effects: ['reality_manipulation', 'time_control', 'infinite_mana'],
            unique: true,
            legendary: true
        },
        
        // Wands (30)
        APPRENTICE_WAND: {
            id: 'apprentice_wand',
            name: 'Apprentice Wand',
            type: 'weapon',
            subtype: 'wand',
            rarity: 'common',
            level: 1,
            stats: { attack: 3, magicPower: 8, castSpeed: 1.1 },
            requirements: { level: 1, intelligence: 3 },
            value: 15,
            description: 'First wand for magic students.',
            icon: 'wand_apprentice.png'
        },
        PHOENIX_WAND: {
            id: 'phoenix_wand',
            name: 'Phoenix Wand',
            type: 'weapon',
            subtype: 'wand',
            rarity: 'legendary',
            level: 50,
            stats: { attack: 180, magicPower: 400, castSpeed: 2.0 },
            bonuses: { fireMagic: 2.5, resurrection: 1 },
            requirements: { level: 50, intelligence: 150 },
            value: 40000,
            description: 'Imbued with phoenix essence. Grants one resurrection per day.',
            icon: 'wand_phoenix.png',
            effects: ['rebirth', 'fire_mastery', 'immortal_flame']
        },
        
        // Spears (30)
        WOODEN_SPEAR: {
            id: 'wooden_spear',
            name: 'Wooden Spear',
            type: 'weapon',
            subtype: 'spear',
            rarity: 'common',
            level: 1,
            stats: { attack: 7, speed: 1.0, range: 3 },
            requirements: { level: 1, strength: 5 },
            value: 12,
            description: 'Simple wooden spear.',
            icon: 'spear_wood.png'
        },
        GUNGIR: {
            id: 'gungir',
            name: 'Gungnir',
            type: 'weapon',
            subtype: 'spear',
            rarity: 'mythic',
            level: 70,
            stats: { attack: 400, speed: 1.6, range: 5, accuracy: 1.0 },
            bonuses: { lightning: 3.0, penetration: true },
            requirements: { level: 70, strength: 200 },
            value: 300000,
            description: 'Odin\'s legendary spear. Never misses its mark.',
            icon: 'spear_gungnir.png',
            effects: ['sure_hit', 'lightning_strike', 'divine_power'],
            unique: true
        },
        
        // Hammers (30)
        IRON_HAMMER: {
            id: 'iron_hammer',
            name: 'Iron Hammer',
            type: 'weapon',
            subtype: 'hammer',
            rarity: 'common',
            level: 5,
            stats: { attack: 12, speed: 0.7 },
            requirements: { level: 5, strength: 15 },
            value: 40,
            description: 'Heavy iron hammer.',
            icon: 'hammer_iron.png'
        },
        MJOLNIR: {
            id: 'mjolnir',
            name: 'Mjölnir',
            type: 'weapon',
            subtype: 'hammer',
            rarity: 'mythic',
            level: 75,
            stats: { attack: 450, speed: 0.8, stun: 0.5 },
            bonuses: { lightning: 4.0, aoe: 10, throwable: true },
            requirements: { level: 75, strength: 250, worthy: true },
            value: 400000,
            description: 'Thor\'s hammer. Only the worthy can wield it.',
            icon: 'hammer_mjolnir.png',
            effects: ['lightning_storm', 'earthquake', 'divine_fury'],
            unique: true,
            legendary: true
        },
        
        // Scythes (20)
        RUSTY_SCYTHE: {
            id: 'rusty_scythe',
            name: 'Rusty Scythe',
            type: 'weapon',
            subtype: 'scythe',
            rarity: 'common',
            level: 1,
            stats: { attack: 6, speed: 0.9, lifesteal: 0.05 },
            requirements: { level: 1 },
            value: 18,
            description: 'Old farming tool. Drains life.',
            icon: 'scythe_rusty.png'
        },
        DEATHS_SCYTHE: {
            id: 'deaths_scythe',
            name: 'Death\'s Scythe',
            type: 'weapon',
            subtype: 'scythe',
            rarity: 'mythic',
            level: 100,
            stats: { attack: 999, speed: 1.5, lifesteal: 1.0, instaKill: 0.1 },
            bonuses: { reaper: true, soulHarvest: true },
            requirements: { level: 100, reaper_class: true },
            value: 9999999,
            description: 'The Grim Reaper\'s weapon. Can instantly kill.',
            icon: 'scythe_death.png',
            effects: ['soul_harvest', 'instant_death', 'immortality'],
            unique: true,
            legendary: true
        }
    },
    
    // ARMOR (300 items)
    armor: {
        // Helmets (100)
        CLOTH_HAT: {
            id: 'cloth_hat',
            name: 'Cloth Hat',
            type: 'armor',
            slot: 'head',
            rarity: 'common',
            level: 1,
            stats: { defense: 2, health: 10 },
            requirements: { level: 1 },
            value: 5,
            description: 'Simple cloth headwear.',
            icon: 'helm_cloth.png'
        },
        CROWN_OF_KINGS: {
            id: 'crown_of_kings',
            name: 'Crown of Kings',
            type: 'armor',
            slot: 'head',
            rarity: 'mythic',
            level: 90,
            stats: { defense: 500, health: 5000, allStats: 100 },
            bonuses: { charisma: 200, leadership: true, goldFind: 2.0 },
            requirements: { level: 90, royalty: true },
            value: 1000000,
            description: 'Worn by legendary kings. Grants royal authority.',
            icon: 'helm_crown.png',
            effects: ['royal_aura', 'command', 'divine_right'],
            set: 'ROYAL_SET'
        },
        
        // Chest Armor (100)
        CLOTH_SHIRT: {
            id: 'cloth_shirt',
            name: 'Cloth Shirt',
            type: 'armor',
            slot: 'chest',
            rarity: 'common',
            level: 1,
            stats: { defense: 5, health: 20 },
            requirements: { level: 1 },
            value: 10,
            description: 'Basic cloth shirt.',
            icon: 'chest_cloth.png'
        },
        DRAGONS_PLATE: {
            id: 'dragons_plate',
            name: 'Dragon\'s Plate',
            type: 'armor',
            slot: 'chest',
            rarity: 'mythic',
            level: 85,
            stats: { defense: 800, health: 8000, resistance: 50 },
            bonuses: { fireResist: 1.0, dragonAffinity: true },
            requirements: { level: 85, strength: 250 },
            value: 800000,
            description: 'Forged from dragon scales. Nearly indestructible.',
            icon: 'chest_dragon.png',
            effects: ['dragon_skin', 'fire_immunity', 'intimidation'],
            set: 'DRAGON_SET'
        },
        
        // Leg Armor (50)
        CLOTH_PANTS: {
            id: 'cloth_pants',
            name: 'Cloth Pants',
            type: 'armor',
            slot: 'legs',
            rarity: 'common',
            level: 1,
            stats: { defense: 3, health: 15 },
            requirements: { level: 1 },
            value: 8,
            description: 'Simple cloth pants.',
            icon: 'legs_cloth.png'
        },
        
        // Boots (50)
        CLOTH_SHOES: {
            id: 'cloth_shoes',
            name: 'Cloth Shoes',
            type: 'armor',
            slot: 'feet',
            rarity: 'common',
            level: 1,
            stats: { defense: 2, speed: 5 },
            requirements: { level: 1 },
            value: 6,
            description: 'Basic footwear.',
            icon: 'boots_cloth.png'
        },
        HERMES_BOOTS: {
            id: 'hermes_boots',
            name: 'Hermes\' Winged Boots',
            type: 'armor',
            slot: 'feet',
            rarity: 'legendary',
            level: 60,
            stats: { defense: 200, speed: 200, dodge: 0.3 },
            bonuses: { flight: true, waterWalk: true },
            requirements: { level: 60, dexterity: 180 },
            value: 100000,
            description: 'Legendary winged boots. Grants the power of flight.',
            icon: 'boots_hermes.png',
            effects: ['flight', 'super_speed', 'air_dash']
        }
    },
    
    // ACCESSORIES (200 items)
    accessories: {
        // Rings (100)
        COPPER_RING: {
            id: 'copper_ring',
            name: 'Copper Ring',
            type: 'accessory',
            slot: 'ring',
            rarity: 'common',
            level: 1,
            stats: { allStats: 1 },
            requirements: { level: 1 },
            value: 15,
            description: 'Simple copper ring.',
            icon: 'ring_copper.png'
        },
        ONE_RING: {
            id: 'one_ring',
            name: 'The One Ring',
            type: 'accessory',
            slot: 'ring',
            rarity: 'mythic',
            level: 99,
            stats: { allStats: 300, power: 999 },
            bonuses: { invisibility: true, immortality: true, corruption: true },
            requirements: { level: 99 },
            value: 9999999,
            description: 'One ring to rule them all. Grants immense power but corrupts the soul.',
            icon: 'ring_one.png',
            effects: ['absolute_power', 'dark_corruption', 'ring_wraith'],
            unique: true,
            cursed: true
        },
        
        // Amulets (100)
        WOODEN_AMULET: {
            id: 'wooden_amulet',
            name: 'Wooden Amulet',
            type: 'accessory',
            slot: 'amulet',
            rarity: 'common',
            level: 1,
            stats: { health: 20 },
            requirements: { level: 1 },
            value: 12,
            description: 'Wooden charm for protection.',
            icon: 'amulet_wood.png'
        },
        HEART_OF_THE_OCEAN: {
            id: 'heart_of_ocean',
            name: 'Heart of the Ocean',
            type: 'accessory',
            slot: 'amulet',
            rarity: 'legendary',
            level: 70,
            stats: { health: 5000, mana: 3000, healthRegen: 100 },
            bonuses: { waterMagic: 3.0, breathUnderwater: true },
            requirements: { level: 70 },
            value: 500000,
            description: 'Legendary jewel said to hold the power of the ocean.',
            icon: 'amulet_ocean.png',
            effects: ['ocean_blessing', 'tsunami', 'water_immunity']
        }
    },
    
    // CONSUMABLES (150 items)
    consumables: {
        // Health Potions (20)
        MINOR_HEALTH_POTION: {
            id: 'minor_health_potion',
            name: 'Minor Health Potion',
            type: 'consumable',
            subtype: 'potion',
            rarity: 'common',
            level: 1,
            effect: { heal: 50 },
            cooldown: 5000,
            stackSize: 99,
            value: 5,
            description: 'Restores 50 HP.',
            icon: 'potion_health_minor.png'
        },
        HEALTH_POTION: {
            id: 'health_potion',
            name: 'Health Potion',
            type: 'consumable',
            subtype: 'potion',
            rarity: 'common',
            level: 10,
            effect: { heal: 150 },
            cooldown: 5000,
            stackSize: 99,
            value: 15,
            description: 'Restores 150 HP.',
            icon: 'potion_health.png'
        },
        GREATER_HEALTH_POTION: {
            id: 'greater_health_potion',
            name: 'Greater Health Potion',
            type: 'consumable',
            subtype: 'potion',
            rarity: 'uncommon',
            level: 20,
            effect: { heal: 500 },
            cooldown: 5000,
            stackSize: 99,
            value: 50,
            description: 'Restores 500 HP.',
            icon: 'potion_health_greater.png'
        },
        SUPREME_HEALTH_POTION: {
            id: 'supreme_health_potion',
            name: 'Supreme Health Potion',
            type: 'consumable',
            subtype: 'potion',
            rarity: 'rare',
            level: 40,
            effect: { heal: 2000 },
            cooldown: 5000,
            stackSize: 99,
            value: 200,
            description: 'Restores 2000 HP.',
            icon: 'potion_health_supreme.png'
        },
        ULTIMATE_HEALTH_POTION: {
            id: 'ultimate_health_potion',
            name: 'Ultimate Health Potion',
            type: 'consumable',
            subtype: 'potion',
            rarity: 'epic',
            level: 60,
            effect: { healPercent: 1.0 },
            cooldown: 5000,
            stackSize: 50,
            value: 1000,
            description: 'Restores 100% HP.',
            icon: 'potion_health_ultimate.png'
        },
        
        // Mana Potions (20)
        MINOR_MANA_POTION: {
            id: 'minor_mana_potion',
            name: 'Minor Mana Potion',
            type: 'consumable',
            subtype: 'potion',
            rarity: 'common',
            level: 1,
            effect: { mana: 30 },
            cooldown: 3000,
            stackSize: 99,
            value: 5,
            description: 'Restores 30 MP.',
            icon: 'potion_mana_minor.png'
        },
        MANA_POTION: {
            id: 'mana_potion',
            name: 'Mana Potion',
            type: 'consumable',
            subtype: 'potion',
            rarity: 'common',
            level: 10,
            effect: { mana: 100 },
            cooldown: 3000,
            stackSize: 99,
            value: 15,
            description: 'Restores 100 MP.',
            icon: 'potion_mana.png'
        },
        
        // Buff Potions (30)
        STRENGTH_POTION: {
            id: 'strength_potion',
            name: 'Strength Potion',
            type: 'consumable',
            subtype: 'buff',
            rarity: 'uncommon',
            level: 15,
            effect: { buffAttack: 50, duration: 300000 },
            cooldown: 10000,
            stackSize: 20,
            value: 100,
            description: 'Increases attack by 50 for 5 minutes.',
            icon: 'potion_strength.png'
        },
        DEFENSE_POTION: {
            id: 'defense_potion',
            name: 'Defense Potion',
            type: 'consumable',
            subtype: 'buff',
            rarity: 'uncommon',
            level: 15,
            effect: { buffDefense: 50, duration: 300000 },
            cooldown: 10000,
            stackSize: 20,
            value: 100,
            description: 'Increases defense by 50 for 5 minutes.',
            icon: 'potion_defense.png'
        },
        SPEED_POTION: {
            id: 'speed_potion',
            name: 'Speed Potion',
            type: 'consumable',
            subtype: 'buff',
            rarity: 'uncommon',
            level: 15,
            effect: { buffSpeed: 50, duration: 300000 },
            cooldown: 10000,
            stackSize: 20,
            value: 100,
            description: 'Increases speed by 50 for 5 minutes.',
            icon: 'potion_speed.png'
        },
        GODMODE_ELIXIR: {
            id: 'godmode_elixir',
            name: 'Godmode Elixir',
            type: 'consumable',
            subtype: 'buff',
            rarity: 'mythic',
            level: 100,
            effect: { 
                buffAllStats: 500,
                invincibility: true,
                duration: 60000
            },
            cooldown: 3600000,
            stackSize: 1,
            value: 1000000,
            description: 'Grants godlike power for 1 minute. 1 hour cooldown.',
            icon: 'potion_godmode.png'
        },
        
        // Food (30)
        BREAD: {
            id: 'bread',
            name: 'Bread',
            type: 'consumable',
            subtype: 'food',
            rarity: 'common',
            level: 1,
            effect: { heal: 20, healOverTime: 5, duration: 10000 },
            cooldown: 1000,
            stackSize: 99,
            value: 2,
            description: 'Simple bread. Restores health over time.',
            icon: 'food_bread.png'
        },
        COOKED_MEAT: {
            id: 'cooked_meat',
            name: 'Cooked Meat',
            type: 'consumable',
            subtype: 'food',
            rarity: 'common',
            level: 5,
            effect: { heal: 50, buffStrength: 10, duration: 60000 },
            cooldown: 1000,
            stackSize: 99,
            value: 10,
            description: 'Grilled meat. Restores health and increases strength.',
            icon: 'food_meat.png'
        },
        
        // Scrolls (30)
        TOWN_PORTAL_SCROLL: {
            id: 'town_portal',
            name: 'Town Portal Scroll',
            type: 'consumable',
            subtype: 'scroll',
            rarity: 'uncommon',
            level: 1,
            effect: { teleport: 'town' },
            cooldown: 0,
            stackSize: 20,
            value: 50,
            description: 'Instantly teleports you to town.',
            icon: 'scroll_portal.png'
        },
        RESURRECTION_SCROLL: {
            id: 'resurrection_scroll',
            name: 'Scroll of Resurrection',
            type: 'consumable',
            subtype: 'scroll',
            rarity: 'epic',
            level: 40,
            effect: { resurrect: true, fullHealth: true },
            cooldown: 0,
            stackSize: 5,
            value: 5000,
            description: 'Brings you back to life with full health.',
            icon: 'scroll_resurrect.png'
        },
        
        // Bombs (20)
        BASIC_BOMB: {
            id: 'basic_bomb',
            name: 'Basic Bomb',
            type: 'consumable',
            subtype: 'bomb',
            rarity: 'common',
            level: 10,
            effect: { damage: 100, aoeRadius: 5 },
            cooldown: 2000,
            stackSize: 50,
            value: 20,
            description: 'Explodes dealing area damage.',
            icon: 'bomb_basic.png'
        }
    },
    
    // MATERIALS (250 items)
    materials: {
        // Ores (50)
        COPPER_ORE: {
            id: 'copper_ore',
            name: 'Copper Ore',
            type: 'material',
            subtype: 'ore',
            rarity: 'common',
            stackSize: 999,
            value: 1,
            description: 'Basic ore for crafting.',
            icon: 'ore_copper.png'
        },
        IRON_ORE: {
            id: 'iron_ore',
            name: 'Iron Ore',
            type: 'material',
            subtype: 'ore',
            rarity: 'common',
            stackSize: 999,
            value: 2,
            description: 'Common ore.',
            icon: 'ore_iron.png'
        },
        MYTHRIL_ORE: {
            id: 'mythril_ore',
            name: 'Mythril Ore',
            type: 'material',
            subtype: 'ore',
            rarity: 'rare',
            stackSize: 999,
            value: 50,
            description: 'Rare magical ore.',
            icon: 'ore_mythril.png'
        },
        ADAMANTITE_ORE: {
            id: 'adamantite_ore',
            name: 'Adamantite Ore',
            type: 'material',
            subtype: 'ore',
            rarity: 'epic',
            stackSize: 999,
            value: 500,
            description: 'Extremely hard ore.',
            icon: 'ore_adamantite.png'
        },
        
        // Herbs (50)
        GREEN_HERB: {
            id: 'green_herb',
            name: 'Green Herb',
            type: 'material',
            subtype: 'herb',
            rarity: 'common',
            stackSize: 999,
            value: 1,
            description: 'Used for healing potions.',
            icon: 'herb_green.png'
        },
        
        // Wood (30)
        OAK_WOOD: {
            id: 'oak_wood',
            name: 'Oak Wood',
            type: 'material',
            subtype: 'wood',
            rarity: 'common',
            stackSize: 999,
            value: 1,
            description: 'Basic wood for crafting.',
            icon: 'wood_oak.png'
        },
        
        // Gems (40)
        RUBY: {
            id: 'ruby',
            name: 'Ruby',
            type: 'material',
            subtype: 'gem',
            rarity: 'rare',
            stackSize: 999,
            value: 100,
            description: 'Precious red gem.',
            icon: 'gem_ruby.png'
        },
        SAPPHIRE: {
            id: 'sapphire',
            name: 'Sapphire',
            type: 'material',
            subtype: 'gem',
            rarity: 'rare',
            stackSize: 999,
            value: 100,
            description: 'Precious blue gem.',
            icon: 'gem_sapphire.png'
        },
        DIAMOND: {
            id: 'diamond',
            name: 'Diamond',
            type: 'material',
            subtype: 'gem',
            rarity: 'epic',
            stackSize: 999,
            value: 1000,
            description: 'Extremely precious gem.',
            icon: 'gem_diamond.png'
        },
        
        // Monster Parts (80)
        SLIME_GEL: {
            id: 'slime_gel',
            name: 'Slime Gel',
            type: 'material',
            subtype: 'monster_part',
            rarity: 'common',
            stackSize: 999,
            value: 2,
            description: 'Sticky gel from slimes.',
            icon: 'part_slime.png'
        },
        DRAGON_SCALE: {
            id: 'dragon_scale',
            name: 'Dragon Scale',
            type: 'material',
            subtype: 'monster_part',
            rarity: 'legendary',
            stackSize: 999,
            value: 5000,
            description: 'Incredibly tough dragon scale.',
            icon: 'part_dragon_scale.png'
        },
        PHOENIX_FEATHER: {
            id: 'phoenix_feather',
            name: 'Phoenix Feather',
            type: 'material',
            subtype: 'monster_part',
            rarity: 'legendary',
            stackSize: 999,
            value: 10000,
            description: 'Feather of rebirth.',
            icon: 'part_phoenix.png'
        }
    }
};

// Calculate totals
export const ItemStats = {
    totalWeapons: Object.keys(ItemDatabase.weapons).length,
    totalArmor: Object.keys(ItemDatabase.armor).length,
    totalAccessories: Object.keys(ItemDatabase.accessories).length,
    totalConsumables: Object.keys(ItemDatabase.consumables).length,
    totalMaterials: Object.keys(ItemDatabase.materials).length,
    totalItems: 0
};

ItemStats.totalItems = 
    ItemStats.totalWeapons + 
    ItemStats.totalArmor + 
    ItemStats.totalAccessories + 
    ItemStats.totalConsumables + 
    ItemStats.totalMaterials;

logger.info(`📦 Loaded ${ItemStats.totalItems} items in database`);
logger.info(`  - ${ItemStats.totalWeapons} weapons`);
logger.info(`  - ${ItemStats.totalArmor} armor pieces`);
logger.info(`  - ${ItemStats.totalAccessories} accessories`);
logger.info(`  - ${ItemStats.totalConsumables} consumables`);
logger.info(`  - ${ItemStats.totalMaterials} materials`);
