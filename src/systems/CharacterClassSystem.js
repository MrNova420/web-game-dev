import { logger } from '../core/Logger.js';
/**
 * CharacterClassSystem - Multiple playable character classes with unique abilities
 * Provides different playstyles for an RPG experience
 */

export class CharacterClassSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        this.classes = {
            warrior: {
                name: 'Warrior',
                description: 'Master of melee combat with high defense',
                icon: '⚔️',
                baseStats: {
                    hp: 150,
                    mp: 50,
                    attack: 20,
                    defense: 15,
                    speed: 8
                },
                abilities: [
                    { name: 'Power Strike', damage: 30, cost: 10, cooldown: 3 },
                    { name: 'Shield Bash', damage: 20, cost: 15, cooldown: 5, stun: 2 },
                    { name: 'Whirlwind', damage: 40, cost: 25, cooldown: 10, aoe: true },
                    { name: 'Battle Rage', damage: 0, cost: 20, cooldown: 15, buff: 'attack', duration: 10 }
                ],
                equipment: ['sword', 'shield', 'heavy_armor']
            },
            mage: {
                name: 'Mage',
                description: 'Powerful spellcaster with devastating magic',
                icon: '🔮',
                baseStats: {
                    hp: 80,
                    mp: 200,
                    attack: 10,
                    defense: 5,
                    speed: 10
                },
                abilities: [
                    { name: 'Fireball', damage: 45, cost: 20, cooldown: 2, element: 'fire' },
                    { name: 'Ice Lance', damage: 35, cost: 15, cooldown: 3, element: 'ice', slow: 3 },
                    { name: 'Lightning Bolt', damage: 50, cost: 30, cooldown: 5, element: 'lightning' },
                    { name: 'Arcane Explosion', damage: 60, cost: 50, cooldown: 12, aoe: true }
                ],
                equipment: ['staff', 'robe', 'hat']
            },
            rogue: {
                name: 'Rogue',
                description: 'Swift assassin with high critical damage',
                icon: '🗡️',
                baseStats: {
                    hp: 100,
                    mp: 100,
                    attack: 15,
                    defense: 8,
                    speed: 15
                },
                abilities: [
                    { name: 'Backstab', damage: 40, cost: 15, cooldown: 3, critBonus: 2 },
                    { name: 'Poison Blade', damage: 25, cost: 20, cooldown: 5, dot: 5, duration: 6 },
                    { name: 'Shadow Step', damage: 0, cost: 15, cooldown: 8, teleport: 10 },
                    { name: 'Assassinate', damage: 80, cost: 40, cooldown: 15, critBonus: 3 }
                ],
                equipment: ['dagger', 'dagger', 'light_armor']
            },
            ranger: {
                name: 'Ranger',
                description: 'Skilled archer with nature magic',
                icon: '🏹',
                baseStats: {
                    hp: 110,
                    mp: 120,
                    attack: 18,
                    defense: 10,
                    speed: 12
                },
                abilities: [
                    { name: 'Piercing Arrow', damage: 35, cost: 10, cooldown: 2, pierce: true },
                    { name: 'Multi-Shot', damage: 25, cost: 20, cooldown: 4, targets: 3 },
                    { name: 'Trap', damage: 30, cost: 15, cooldown: 6, trap: true },
                    { name: 'Call of the Wild', damage: 0, cost: 30, cooldown: 20, summon: 'beast' }
                ],
                equipment: ['bow', 'arrows', 'medium_armor']
            },
            cleric: {
                name: 'Cleric',
                description: 'Holy healer with divine protection',
                icon: '✨',
                baseStats: {
                    hp: 120,
                    mp: 150,
                    attack: 12,
                    defense: 12,
                    speed: 9
                },
                abilities: [
                    { name: 'Heal', damage: -40, cost: 20, cooldown: 2, heal: true },
                    { name: 'Holy Smite', damage: 35, cost: 15, cooldown: 3, element: 'holy' },
                    { name: 'Divine Shield', damage: 0, cost: 25, cooldown: 10, shield: 50, duration: 5 },
                    { name: 'Resurrection', damage: 0, cost: 50, cooldown: 30, revive: true }
                ],
                equipment: ['mace', 'shield', 'robe']
            },
            necromancer: {
                name: 'Necromancer',
                description: 'Dark mage who commands the undead',
                icon: '💀',
                baseStats: {
                    hp: 90,
                    mp: 180,
                    attack: 12,
                    defense: 6,
                    speed: 9
                },
                abilities: [
                    { name: 'Life Drain', damage: 30, cost: 15, cooldown: 3, lifesteal: 0.5 },
                    { name: 'Raise Dead', damage: 0, cost: 30, cooldown: 8, summon: 'skeleton' },
                    { name: 'Curse', damage: 20, cost: 20, cooldown: 5, debuff: 'defense', duration: 8 },
                    { name: 'Death Nova', damage: 55, cost: 45, cooldown: 12, aoe: true, element: 'dark' }
                ],
                equipment: ['staff', 'robe', 'tome']
            }
        };
        
        this.currentClass = null;
        this.level = 1;
        this.experience = 0;
        this.experienceToNextLevel = 100;
        
        this.init();
    }
    
    init() {
        logger.info('👤 Character Class System initialized');
        logger.info(`Available classes: ${Object.keys(this.classes).length}`);
    }
    
    selectClass(className) {
        if (!this.classes[className]) {
            logger.error(`Class ${className} not found`);
            return false;
        }
        
        this.currentClass = className;
        const classData = this.classes[className];
        
        // Apply base stats to player
        if (this.gameEngine.player) {
            Object.assign(this.gameEngine.player.stats, classData.baseStats);
            this.gameEngine.player.stats.maxHp = classData.baseStats.hp;
            this.gameEngine.player.stats.maxMp = classData.baseStats.mp;
        }
        
        logger.info(`✅ Selected class: ${classData.name} ${classData.icon}`);
        
        // Show notification
        if (this.gameEngine.modernUISystem) {
            this.gameEngine.modernUISystem.showNotification(
                `Class Selected: ${classData.name}`,
                'success',
                3000
            );
        }
        
        return true;
    }
    
    getClassData(className) {
        return this.classes[className] || null;
    }
    
    getCurrentClassData() {
        return this.currentClass ? this.classes[this.currentClass] : null;
    }
    
    getAvailableAbilities() {
        const classData = this.getCurrentClassData();
        if (!classData) return [];
        
        return classData.abilities.filter(ability => {
            // Unlock abilities based on level
            const abilityIndex = classData.abilities.indexOf(ability);
            return this.level >= (abilityIndex * 5 + 1);
        });
    }
    
    useAbility(abilityName) {
        const classData = this.getCurrentClassData();
        if (!classData) return null;
        
        const ability = classData.abilities.find(a => a.name === abilityName);
        if (!ability) return null;
        
        // Check if player has enough MP
        if (this.gameEngine.player && this.gameEngine.player.stats.mp < ability.cost) {
            logger.info(`Not enough MP for ${abilityName}`);
            return null;
        }
        
        // Consume MP
        if (this.gameEngine.player) {
            this.gameEngine.player.stats.mp -= ability.cost;
        }
        
        return ability;
    }
    
    addExperience(amount) {
        this.experience += amount;
        
        // Check for level up
        while (this.experience >= this.experienceToNextLevel) {
            this.levelUp();
        }
    }
    
    levelUp() {
        this.level++;
        this.experience -= this.experienceToNextLevel;
        this.experienceToNextLevel = Math.floor(this.experienceToNextLevel * 1.5);
        
        // Increase stats
        const classData = this.getCurrentClassData();
        if (classData && this.gameEngine.player) {
            const player = this.gameEngine.player;
            player.stats.maxHp += Math.floor(classData.baseStats.hp * 0.1);
            player.stats.maxMp += Math.floor(classData.baseStats.mp * 0.1);
            player.stats.attack += Math.floor(classData.baseStats.attack * 0.05);
            player.stats.defense += Math.floor(classData.baseStats.defense * 0.05);
            
            // Restore HP and MP
            player.stats.hp = player.stats.maxHp;
            player.stats.mp = player.stats.maxMp;
        }
        
        logger.info(`🎉 Level Up! Now level ${this.level}`);
        
        // Show notification
        if (this.gameEngine.modernUISystem) {
            this.gameEngine.modernUISystem.showNotification(
                `Level Up! You are now level ${this.level}`,
                'achievement',
                4000
            );
        }
    }
    
    getClassList() {
        return Object.keys(this.classes).map(key => ({
            id: key,
            ...this.classes[key]
        }));
    }
    
    update(deltaTime) {
        // Update ability cooldowns, buffs, debuffs, etc.
    }
    
    dispose() {
        logger.info('👤 Character Class System disposed');
    }
}
