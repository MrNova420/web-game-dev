/**
import { logger } from '../core/Logger.js';
 * ContentIntegrationSystem - Ensures all game content is accessible and properly linked
 * Integrates characters, monsters, items, abilities, and external assets
 */

import { Advanced3DModelSystem } from './Advanced3DModelSystem.js';
import { AnimeCharacterSystem } from './AnimeCharacterSystem.js';
import { MonsterDesignSystem } from './MonsterDesignSystem.js';
import { MascotBrandingSystem } from './MascotBrandingSystem.js';

export class ContentIntegrationSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.scene = gameEngine.scene;
        
        // Initialize sub-systems
        this.modelSystem = new Advanced3DModelSystem(this.scene);
        this.characterSystem = new AnimeCharacterSystem(this.scene);
        this.monsterSystem = new MonsterDesignSystem(this.scene);
        this.brandingSystem = new MascotBrandingSystem();
        
        // Content registries
        this.characters = new Map();
        this.monsters = new Map();
        this.items = new Map();
        this.abilities = new Map();
        this.npcs = new Map();
        
        // External asset URLs (CDN fallbacks for free assets)
        this.externalAssets = {
            mixamo: 'https://www.mixamo.com/api/v1/characters',
            quaternius: 'https://quaternius.com/assets',
            sketchfab: 'https://sketchfab.com/models',
            polyhaven: 'https://polyhaven.com/textures',
            kenney: 'https://www.kenney.nl/assets'
        };
        
        this.initializeContent();
        logger.info('🎮 Content Integration System initialized - All content accessible!');
    }
    
    initializeContent() {
        this.registerPlayableCharacters();
        this.registerMonsters();
        this.registerItems();
        this.registerAbilities();
        this.registerNPCs();
        this.linkSystems();
    }
    
    registerPlayableCharacters() {
        // Using Mixamo models with anime customization
        const characters = [
            {
                id: 'warrior',
                name: 'Battle Warrior',
                class: 'Warrior',
                model: '/assets/models/characters/warrior.glb',
                externalSource: 'Mixamo - Y Bot (Free)',
                stats: { hp: 150, mp: 50, str: 18, def: 14, spd: 8 },
                abilities: ['power_strike', 'shield_bash', 'war_cry', 'cleave'],
                weapons: ['greatsword', 'battle_axe', 'warhammer'],
                unlocked: true,
                mascot: 'battle_berserker'
            },
            {
                id: 'mage',
                name: 'Arcane Sorcerer',
                class: 'Mage',
                model: '/assets/models/characters/mage.glb',
                externalSource: 'Mixamo - X Bot (Free)',
                stats: { hp: 80, mp: 200, str: 6, def: 8, spd: 10, int: 20 },
                abilities: ['fireball', 'ice_lance', 'lightning_bolt', 'arcane_blast'],
                weapons: ['magic_staff', 'wand', 'tome'],
                unlocked: true,
                mascot: 'arcane_sorcerer'
            },
            {
                id: 'rogue',
                name: 'Shadow Assassin',
                class: 'Rogue',
                model: '/assets/models/characters/rogue.glb',
                externalSource: 'Mixamo - Kaya (Free)',
                stats: { hp: 100, mp: 100, str: 12, def: 10, spd: 18, agi: 18 },
                abilities: ['backstab', 'shadow_step', 'poison_blade', 'smoke_bomb'],
                weapons: ['dual_daggers', 'katana', 'throwing_knives'],
                unlocked: true,
                mascot: 'shadow_assassin'
            },
            {
                id: 'paladin',
                name: 'Holy Paladin',
                class: 'Paladin',
                model: '/assets/models/characters/paladin.glb',
                externalSource: 'Mixamo - Paladin (Free)',
                stats: { hp: 140, mp: 120, str: 14, def: 16, spd: 9, holy: 15 },
                abilities: ['divine_shield', 'holy_strike', 'heal', 'consecration'],
                weapons: ['longsword_shield', 'mace', 'holy_hammer'],
                unlocked: false,
                unlockLevel: 5
            },
            {
                id: 'ranger',
                name: 'Forest Ranger',
                class: 'Ranger',
                model: '/assets/models/characters/ranger.glb',
                externalSource: 'Mixamo - Archer (Free)',
                stats: { hp: 110, mp: 80, str: 10, def: 11, spd: 14, agi: 16 },
                abilities: ['arrow_shot', 'multishot', 'poison_arrow', 'trap'],
                weapons: ['longbow', 'crossbow', 'shortbow'],
                unlocked: false,
                unlockLevel: 3
            },
            {
                id: 'necromancer',
                name: 'Dark Necromancer',
                class: 'Necromancer',
                model: '/assets/models/characters/necromancer.glb',
                externalSource: 'Mixamo - Warlock (Free)',
                stats: { hp: 90, mp: 180, str: 7, def: 9, spd: 10, dark: 18 },
                abilities: ['summon_skeleton', 'drain_life', 'death_bolt', 'raise_dead'],
                weapons: ['scythe', 'cursed_staff', 'bone_wand'],
                unlocked: false,
                unlockLevel: 10
            }
        ];
        
        characters.forEach(char => {
            this.characters.set(char.id, char);
        });
        
        logger.info(`✅ ${characters.length} playable characters registered`);
    }
    
    registerMonsters() {
        // Using Quaternius and Sketchfab models
        const monsters = [
            {
                id: 'goblin',
                name: 'Goblin Warrior',
                model: '/assets/models/monsters/goblin.glb',
                externalSource: 'Quaternius - Ultimate Animated Pack (Free)',
                level: 1,
                hp: 40,
                damage: 8,
                abilities: ['slash', 'throw_rock'],
                drops: ['small_potion', 'goblin_ear', 'rusty_dagger']
            },
            {
                id: 'orc',
                name: 'Orc Brute',
                model: '/assets/models/monsters/orc.glb',
                externalSource: 'Quaternius - Monster Pack (Free)',
                level: 5,
                hp: 120,
                damage: 20,
                abilities: ['heavy_slam', 'rage'],
                drops: ['health_potion', 'orc_tusk', 'iron_axe']
            },
            {
                id: 'skeleton',
                name: 'Undead Skeleton',
                model: '/assets/models/monsters/skeleton.glb',
                externalSource: 'Quaternius - Undead Pack (Free)',
                level: 3,
                hp: 60,
                damage: 12,
                abilities: ['bone_throw', 'summon_help'],
                drops: ['bone_fragment', 'small_mana_potion', 'cursed_ring']
            },
            {
                id: 'dragon_whelp',
                name: 'Dragon Whelp',
                model: '/assets/models/monsters/dragon_small.glb',
                externalSource: 'Sketchfab - Low Poly Dragon (CC0)',
                level: 8,
                hp: 200,
                damage: 35,
                abilities: ['fire_breath', 'tail_swipe', 'wing_gust'],
                drops: ['dragon_scale', 'fire_gem', 'rare_potion']
            },
            {
                id: 'ice_golem',
                name: 'Frost Golem',
                model: '/assets/models/monsters/ice_golem.glb',
                externalSource: 'Quaternius - Elemental Pack (Free)',
                level: 10,
                hp: 300,
                damage: 40,
                abilities: ['ice_punch', 'freeze_aura', 'ice_spikes'],
                drops: ['ice_crystal', 'frost_essence', 'frozen_heart']
            },
            {
                id: 'demon_lord',
                name: 'Lesser Demon',
                model: '/assets/models/monsters/demon.glb',
                externalSource: 'Sketchfab - Demon Model (CC0)',
                level: 15,
                hp: 500,
                damage: 60,
                abilities: ['hellfire', 'dark_bolt', 'soul_drain', 'teleport'],
                drops: ['demon_horn', 'legendary_potion', 'cursed_artifact']
            }
        ];
        
        monsters.forEach(monster => {
            this.monsters.set(monster.id, monster);
        });
        
        logger.info(`✅ ${monsters.length} monster types registered`);
    }
    
    registerItems() {
        const items = [
            // Weapons - Sketchfab Free
            { id: 'greatsword', name: 'Greatsword', type: 'weapon', model: '/assets/models/weapons/greatsword.glb', source: 'Sketchfab Free', damage: 45 },
            { id: 'battle_axe', name: 'Battle Axe', type: 'weapon', model: '/assets/models/weapons/battle_axe.glb', source: 'Sketchfab Free', damage: 50 },
            { id: 'magic_staff', name: 'Magic Staff', type: 'weapon', model: '/assets/models/weapons/staff.glb', source: 'Sketchfab Free', magic: 40 },
            { id: 'dual_daggers', name: 'Dual Daggers', type: 'weapon', model: '/assets/models/weapons/daggers.glb', source: 'Sketchfab Free', damage: 30, speed: 2 },
            { id: 'longbow', name: 'Longbow', type: 'weapon', model: '/assets/models/weapons/longbow.glb', source: 'Sketchfab Free', damage: 35, range: 20 },
            
            // Armor - Sketchfab Free
            { id: 'plate_armor', name: 'Plate Armor', type: 'armor', model: '/assets/models/armor/plate.glb', source: 'Sketchfab Free', defense: 40 },
            { id: 'mage_robes', name: 'Mage Robes', type: 'armor', model: '/assets/models/armor/robes.glb', source: 'Sketchfab Free', magic: 30 },
            { id: 'leather_armor', name: 'Leather Armor', type: 'armor', model: '/assets/models/armor/leather.glb', source: 'Sketchfab Free', defense: 20, agility: 10 },
            
            // Consumables - Kenney Assets
            { id: 'health_potion', name: 'Health Potion', type: 'consumable', icon: 'potion_red', effect: { hp: 50 } },
            { id: 'mana_potion', name: 'Mana Potion', type: 'consumable', icon: 'potion_blue', effect: { mp: 50 } },
            { id: 'strength_elixir', name: 'Strength Elixir', type: 'consumable', icon: 'potion_orange', effect: { str: 5, duration: 60 } },
            
            // Quest Items
            { id: 'dragon_scale', name: 'Dragon Scale', type: 'material', rarity: 'rare' },
            { id: 'demon_horn', name: 'Demon Horn', type: 'material', rarity: 'legendary' },
            { id: 'ice_crystal', name: 'Ice Crystal', type: 'material', rarity: 'uncommon' }
        ];
        
        items.forEach(item => {
            this.items.set(item.id, item);
        });
        
        logger.info(`✅ ${items.length} items registered`);
    }
    
    registerAbilities() {
        const abilities = [
            // Warrior Abilities
            { id: 'power_strike', name: 'Power Strike', class: 'warrior', damage: 80, manaCost: 20, cooldown: 5, icon: 'sword' },
            { id: 'shield_bash', name: 'Shield Bash', class: 'warrior', damage: 40, stun: 2, manaCost: 15, cooldown: 8, icon: 'shield' },
            { id: 'war_cry', name: 'War Cry', class: 'warrior', buff: { str: 10, duration: 30 }, manaCost: 25, cooldown: 30, icon: 'strength_buff' },
            { id: 'cleave', name: 'Cleave', class: 'warrior', damage: 60, aoe: true, manaCost: 30, cooldown: 10, icon: 'battle_axe' },
            
            // Mage Abilities
            { id: 'fireball', name: 'Fireball', class: 'mage', damage: 70, element: 'fire', manaCost: 30, cooldown: 3, icon: 'fire' },
            { id: 'ice_lance', name: 'Ice Lance', class: 'mage', damage: 60, element: 'ice', slow: 0.5, manaCost: 25, cooldown: 4, icon: 'frost' },
            { id: 'lightning_bolt', name: 'Lightning Bolt', class: 'mage', damage: 90, element: 'lightning', manaCost: 40, cooldown: 6, icon: 'lightning' },
            { id: 'arcane_blast', name: 'Arcane Blast', class: 'mage', damage: 100, element: 'arcane', manaCost: 50, cooldown: 10, icon: 'magic_staff' },
            
            // Rogue Abilities
            { id: 'backstab', name: 'Backstab', class: 'rogue', damage: 120, critChance: 0.5, manaCost: 25, cooldown: 8, icon: 'dual_blades' },
            { id: 'shadow_step', name: 'Shadow Step', class: 'rogue', teleport: 10, stealth: 3, manaCost: 20, cooldown: 12, icon: 'speed_buff' },
            { id: 'poison_blade', name: 'Poison Blade', class: 'rogue', damage: 50, poison: 20, manaCost: 15, cooldown: 5, icon: 'poison_debuff' },
            { id: 'smoke_bomb', name: 'Smoke Bomb', class: 'rogue', stun: 2, aoe: true, manaCost: 30, cooldown: 20, icon: 'stun_debuff' },
            
            // Paladin Abilities
            { id: 'divine_shield', name: 'Divine Shield', class: 'paladin', defense: 50, duration: 5, manaCost: 40, cooldown: 30, icon: 'defense_buff' },
            { id: 'holy_strike', name: 'Holy Strike', class: 'paladin', damage: 75, element: 'holy', manaCost: 25, cooldown: 6, icon: 'sword' },
            { id: 'heal', name: 'Heal', class: 'paladin', healing: 80, manaCost: 35, cooldown: 8, icon: 'health_orb' },
            
            // Necromancer Abilities
            { id: 'summon_skeleton', name: 'Summon Skeleton', class: 'necromancer', summon: 'skeleton', duration: 30, manaCost: 50, cooldown: 20, icon: 'necromancer' },
            { id: 'drain_life', name: 'Drain Life', class: 'necromancer', damage: 40, healing: 40, manaCost: 30, cooldown: 5, icon: 'poison_debuff' },
            { id: 'death_bolt', name: 'Death Bolt', class: 'necromancer', damage: 85, element: 'dark', manaCost: 35, cooldown: 7, icon: 'magic_staff' }
        ];
        
        abilities.forEach(ability => {
            this.abilities.set(ability.id, ability);
        });
        
        logger.info(`✅ ${abilities.length} abilities registered`);
    }
    
    registerNPCs() {
        const npcs = [
            { id: 'blacksmith', name: 'Grimbold the Smith', role: 'vendor', sells: ['weapons', 'armor'], model: '/assets/models/npcs/blacksmith.glb' },
            { id: 'alchemist', name: 'Mystara the Alchemist', role: 'vendor', sells: ['potions', 'materials'], model: '/assets/models/npcs/alchemist.glb' },
            { id: 'quest_giver', name: 'Elder Sage', role: 'quest_giver', quests: ['main_story', 'side_quests'], model: '/assets/models/npcs/elder.glb' },
            { id: 'trainer', name: 'Master Sword', role: 'trainer', trains: ['warrior', 'paladin'], model: '/assets/models/npcs/trainer.glb' }
        ];
        
        npcs.forEach(npc => {
            this.npcs.set(npc.id, npc);
        });
        
        logger.info(`✅ ${npcs.length} NPCs registered`);
    }
    
    linkSystems() {
        // Link character system to player
        if (this.gameEngine.player) {
            const playerData = this.characters.get('warrior'); // Default
            this.gameEngine.player.characterData = playerData;
            this.gameEngine.player.abilities = playerData.abilities.map(id => this.abilities.get(id));
        }
        
        // Link monster system to enemy manager
        if (this.gameEngine.enemyManager) {
            this.gameEngine.enemyManager.monsterRegistry = this.monsters;
        }
        
        // Link items to inventory
        if (this.gameEngine.inventorySystem) {
            this.gameEngine.inventorySystem.itemRegistry = this.items;
        }
        
        // Link abilities to skill tree
        if (this.gameEngine.skillTreeSystem) {
            this.gameEngine.skillTreeSystem.abilityRegistry = this.abilities;
        }
        
        // Link branding to UI
        if (this.gameEngine.modernUISystem) {
            this.gameEngine.modernUISystem.brandingSystem = this.brandingSystem;
        }
        
        logger.info('🔗 All systems linked and integrated!');
    }
    
    // Utility Methods
    
    getCharacter(id) {
        return this.characters.get(id);
    }
    
    getMonster(id) {
        return this.monsters.get(id);
    }
    
    getItem(id) {
        return this.items.get(id);
    }
    
    getAbility(id) {
        return this.abilities.get(id);
    }
    
    getNPC(id) {
        return this.npcs.get(id);
    }
    
    getAllCharacters() {
        return Array.from(this.characters.values());
    }
    
    getAllMonsters() {
        return Array.from(this.monsters.values());
    }
    
    getAllItems() {
        return Array.from(this.items.values());
    }
    
    getAllAbilities() {
        return Array.from(this.abilities.values());
    }
    
    getUnlockedCharacters(playerLevel = 1) {
        return this.getAllCharacters().filter(char => 
            char.unlocked || (char.unlockLevel && playerLevel >= char.unlockLevel)
        );
    }
    
    getAbilitiesByClass(className) {
        return this.getAllAbilities().filter(ability => ability.class === className.toLowerCase());
    }
    
    async loadAsset(assetPath, type = 'model') {
        // Use the model system to load external assets
        if (type === 'model') {
            return await this.modelSystem.loadModel(assetPath);
        }
        // Add more loaders as needed
        return null;
    }
    
    injectBrandingIntoUI() {
        // Inject mascots and icons into UI elements
        this.brandingSystem.injectMascotIntoUI('loading-mascot', 'emberveil_guardian');
        this.brandingSystem.injectIconIntoUI('warrior-icon', 'warrior');
        this.brandingSystem.injectIconIntoUI('mage-icon', 'mage');
        this.brandingSystem.injectIconIntoUI('rogue-icon', 'rogue');
    }
    
    getContentSummary() {
        return {
            characters: this.characters.size,
            monsters: this.monsters.size,
            items: this.items.size,
            abilities: this.abilities.size,
            npcs: this.npcs.size,
            externalSources: Object.keys(this.externalAssets).length
        };
    }
}
