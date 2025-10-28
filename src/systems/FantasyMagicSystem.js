/**
 * Fantasy Magic System
 * Core magic system with spells, elements, and anime-inspired abilities
 */

export class FantasyMagicSystem {
    constructor() {
        this.elements = this.initializeElements();
        this.spellSchools = this.initializeSpellSchools();
        this.magicCircles = this.initializeMagicCircles();
        this.ultimateSkills = this.initializeUltimateSkills();
        this.playerMagicLevel = 1;
        this.playerMagicExp = 0;
        this.unlockedSpells = [];
        this.activeBuffs = [];
        this.comboChain = 0;
        this.elementalAffinity = {};
    }

    initializeElements() {
        return {
            fire: {
                name: 'Fire',
                color: '#FF4500',
                strengths: ['ice', 'nature'],
                weaknesses: ['water', 'earth'],
                spells: [
                    { id: 'fireball', name: 'Fireball', damage: 100, manaCost: 20, level: 1 },
                    { id: 'flame_burst', name: 'Flame Burst', damage: 250, manaCost: 50, level: 5 },
                    { id: 'meteor_strike', name: 'Meteor Strike', damage: 500, manaCost: 100, level: 10 },
                    { id: 'inferno', name: 'Inferno', damage: 1000, manaCost: 200, level: 20 },
                    { id: 'phoenix_rebirth', name: 'Phoenix Rebirth', damage: 2000, manaCost: 500, level: 50 }
                ]
            },
            ice: {
                name: 'Ice',
                color: '#00BFFF',
                strengths: ['water', 'wind'],
                weaknesses: ['fire', 'lightning'],
                spells: [
                    { id: 'ice_shard', name: 'Ice Shard', damage: 80, manaCost: 15, level: 1 },
                    { id: 'frost_nova', name: 'Frost Nova', damage: 200, manaCost: 40, level: 5 },
                    { id: 'blizzard', name: 'Blizzard', damage: 450, manaCost: 90, level: 10 },
                    { id: 'absolute_zero', name: 'Absolute Zero', damage: 900, manaCost: 180, level: 20 },
                    { id: 'eternal_winter', name: 'Eternal Winter', damage: 1800, manaCost: 450, level: 50 }
                ]
            },
            lightning: {
                name: 'Lightning',
                color: '#FFD700',
                strengths: ['water', 'metal'],
                weaknesses: ['earth', 'nature'],
                spells: [
                    { id: 'lightning_bolt', name: 'Lightning Bolt', damage: 120, manaCost: 25, level: 1 },
                    { id: 'chain_lightning', name: 'Chain Lightning', damage: 280, manaCost: 60, level: 5 },
                    { id: 'thunder_storm', name: 'Thunder Storm', damage: 550, manaCost: 110, level: 10 },
                    { id: 'judgement', name: 'Divine Judgement', damage: 1100, manaCost: 220, level: 20 },
                    { id: 'gods_wrath', name: "God's Wrath", damage: 2200, manaCost: 550, level: 50 }
                ]
            },
            water: {
                name: 'Water',
                color: '#1E90FF',
                strengths: ['fire', 'earth'],
                weaknesses: ['lightning', 'ice'],
                spells: [
                    { id: 'water_jet', name: 'Water Jet', damage: 70, manaCost: 12, level: 1 },
                    { id: 'tidal_wave', name: 'Tidal Wave', damage: 180, manaCost: 35, level: 5 },
                    { id: 'tsunami', name: 'Tsunami', damage: 400, manaCost: 80, level: 10 },
                    { id: 'ocean_fury', name: 'Ocean Fury', damage: 800, manaCost: 160, level: 20 },
                    { id: 'leviathan', name: 'Summon Leviathan', damage: 1600, manaCost: 400, level: 50 }
                ]
            },
            earth: {
                name: 'Earth',
                color: '#8B4513',
                strengths: ['lightning', 'wind'],
                weaknesses: ['water', 'ice'],
                spells: [
                    { id: 'stone_spike', name: 'Stone Spike', damage: 90, manaCost: 18, level: 1 },
                    { id: 'earthquake', name: 'Earthquake', damage: 220, manaCost: 45, level: 5 },
                    { id: 'mountain_crush', name: 'Mountain Crush', damage: 480, manaCost: 95, level: 10 },
                    { id: 'continental_shift', name: 'Continental Shift', damage: 950, manaCost: 190, level: 20 },
                    { id: 'titan_fist', name: 'Titan Fist', damage: 1900, manaCost: 475, level: 50 }
                ]
            },
            wind: {
                name: 'Wind',
                color: '#E0E0E0',
                strengths: ['earth', 'nature'],
                weaknesses: ['fire', 'lightning'],
                spells: [
                    { id: 'wind_blade', name: 'Wind Blade', damage: 85, manaCost: 16, level: 1 },
                    { id: 'tornado', name: 'Tornado', damage: 210, manaCost: 42, level: 5 },
                    { id: 'tempest', name: 'Tempest', damage: 460, manaCost: 92, level: 10 },
                    { id: 'sky_dragon', name: 'Sky Dragon Roar', damage: 920, manaCost: 184, level: 20 },
                    { id: 'heaven_pierce', name: 'Heaven Pierce', damage: 1840, manaCost: 460, level: 50 }
                ]
            },
            nature: {
                name: 'Nature',
                color: '#228B22',
                strengths: ['water', 'earth'],
                weaknesses: ['fire', 'ice'],
                spells: [
                    { id: 'vine_whip', name: 'Vine Whip', damage: 75, manaCost: 14, level: 1 },
                    { id: 'thorn_burst', name: 'Thorn Burst', damage: 190, manaCost: 38, level: 5 },
                    { id: 'forest_rage', name: 'Forest Rage', damage: 420, manaCost: 84, level: 10 },
                    { id: 'world_tree', name: 'World Tree Wrath', damage: 840, manaCost: 168, level: 20 },
                    { id: 'gaia_force', name: 'Gaia Force', damage: 1680, manaCost: 420, level: 50 }
                ]
            },
            light: {
                name: 'Light',
                color: '#FFFACD',
                strengths: ['dark', 'undead'],
                weaknesses: ['void', 'shadow'],
                spells: [
                    { id: 'holy_bolt', name: 'Holy Bolt', damage: 110, manaCost: 22, level: 1 },
                    { id: 'divine_beam', name: 'Divine Beam', damage: 270, manaCost: 54, level: 5 },
                    { id: 'celestial_burst', name: 'Celestial Burst', damage: 520, manaCost: 104, level: 10 },
                    { id: 'archangel', name: 'Archangel Strike', damage: 1040, manaCost: 208, level: 20 },
                    { id: 'salvation', name: 'Salvation', damage: 2080, manaCost: 520, level: 50 }
                ]
            },
            dark: {
                name: 'Dark',
                color: '#4B0082',
                strengths: ['light', 'living'],
                weaknesses: ['holy', 'divine'],
                spells: [
                    { id: 'shadow_bolt', name: 'Shadow Bolt', damage: 105, manaCost: 21, level: 1 },
                    { id: 'dark_pulse', name: 'Dark Pulse', damage: 260, manaCost: 52, level: 5 },
                    { id: 'void_strike', name: 'Void Strike', damage: 510, manaCost: 102, level: 10 },
                    { id: 'demon_king', name: 'Demon King Wrath', damage: 1020, manaCost: 204, level: 20 },
                    { id: 'apocalypse', name: 'Apocalypse', damage: 2040, manaCost: 510, level: 50 }
                ]
            },
            arcane: {
                name: 'Arcane',
                color: '#9370DB',
                strengths: ['all'],
                weaknesses: ['none'],
                spells: [
                    { id: 'magic_missile', name: 'Magic Missile', damage: 95, manaCost: 19, level: 1 },
                    { id: 'arcane_blast', name: 'Arcane Blast', damage: 240, manaCost: 48, level: 5 },
                    { id: 'mana_storm', name: 'Mana Storm', damage: 490, manaCost: 98, level: 10 },
                    { id: 'reality_break', name: 'Reality Break', damage: 980, manaCost: 196, level: 20 },
                    { id: 'universe_end', name: 'Universe End', damage: 1960, manaCost: 490, level: 50 }
                ]
            }
        };
    }

    initializeSpellSchools() {
        return {
            evocation: {
                name: 'Evocation',
                description: 'Pure damage magic',
                bonuses: { damage: 1.5, manaCost: 1.0 }
            },
            conjuration: {
                name: 'Conjuration',
                description: 'Summon creatures and objects',
                bonuses: { summonPower: 1.5, duration: 1.3 }
            },
            enchantment: {
                name: 'Enchantment',
                description: 'Buff and debuff magic',
                bonuses: { buffPower: 1.4, debuffDuration: 1.5 }
            },
            illusion: {
                name: 'Illusion',
                description: 'Deceive and confuse enemies',
                bonuses: { evasion: 1.3, critChance: 1.2 }
            },
            necromancy: {
                name: 'Necromancy',
                description: 'Death and undead magic',
                bonuses: { lifesteal: 0.3, undeadDamage: 2.0 }
            },
            abjuration: {
                name: 'Abjuration',
                description: 'Protective magic',
                bonuses: { defense: 1.5, resistance: 1.4 }
            },
            transmutation: {
                name: 'Transmutation',
                description: 'Transform matter and energy',
                bonuses: { versatility: 1.3, adaptability: 1.4 }
            }
        };
    }

    initializeMagicCircles() {
        return [
            { circle: 1, level: 1, spellsUnlocked: 5, manaBonus: 100, description: 'Novice Mage' },
            { circle: 2, level: 10, spellsUnlocked: 10, manaBonus: 250, description: 'Apprentice Mage' },
            { circle: 3, level: 25, spellsUnlocked: 20, manaBonus: 500, description: 'Adept Mage' },
            { circle: 4, level: 50, spellsUnlocked: 35, manaBonus: 1000, description: 'Master Mage' },
            { circle: 5, level: 75, spellsUnlocked: 50, manaBonus: 2000, description: 'Archmage' },
            { circle: 6, level: 100, spellsUnlocked: 70, manaBonus: 4000, description: 'Grand Archmage' },
            { circle: 7, level: 150, spellsUnlocked: 100, manaBonus: 8000, description: 'Sage' },
            { circle: 8, level: 200, spellsUnlocked: 150, manaBonus: 16000, description: 'Transcendent Sage' },
            { circle: 9, level: 300, spellsUnlocked: 200, manaBonus: 32000, description: 'Magic God' }
        ];
    }

    initializeUltimateSkills() {
        return [
            {
                id: 'time_stop',
                name: 'Time Stop',
                description: 'Freeze time for 5 seconds',
                manaCost: 1000,
                cooldown: 300,
                effect: 'freeze_time'
            },
            {
                id: 'meteor_rain',
                name: 'Meteor Rain',
                description: 'Rain meteors across the battlefield',
                manaCost: 800,
                cooldown: 180,
                effect: 'aoe_damage_5000'
            },
            {
                id: 'dimensional_rift',
                name: 'Dimensional Rift',
                description: 'Tear a rift in space-time',
                manaCost: 1200,
                cooldown: 360,
                effect: 'dimensional_damage_8000'
            },
            {
                id: 'star_fall',
                name: 'Star Fall',
                description: 'Call down the stars themselves',
                manaCost: 1500,
                cooldown: 480,
                effect: 'cosmic_damage_12000'
            },
            {
                id: 'genesis',
                name: 'Genesis',
                description: 'Create a new world',
                manaCost: 2000,
                cooldown: 600,
                effect: 'ultimate_creation_20000'
            }
        ];
    }

    castSpell(spellId, element, caster, target) {
        const elementData = this.elements[element];
        if (!elementData) return null;

        const spell = elementData.spells.find(s => s.id === spellId);
        if (!spell) return null;

        if (caster.mana < spell.manaCost) {
            return { success: false, reason: 'Not enough mana' };
        }

        // Calculate damage with bonuses
        let damage = spell.damage;
        
        // Elemental advantages
        if (target.element && elementData.strengths.includes(target.element)) {
            damage *= 1.5; // 50% bonus against weak elements
        }
        if (target.element && elementData.weaknesses.includes(target.element)) {
            damage *= 0.75; // 25% penalty against strong elements
        }

        // Combo bonus
        if (this.comboChain > 0) {
            damage *= (1 + this.comboChain * 0.1); // 10% per combo hit
        }

        // Apply spell
        caster.mana -= spell.manaCost;
        this.comboChain++;

        return {
            success: true,
            damage: Math.floor(damage),
            element: element,
            spellName: spell.name,
            comboChain: this.comboChain,
            effects: this.generateSpellEffects(spell, element)
        };
    }

    generateSpellEffects(spell, element) {
        const effects = [];
        
        // Add visual effects based on element
        effects.push({
            type: 'particle',
            element: element,
            intensity: spell.damage / 100
        });

        // Add status effects for high-level spells
        if (spell.level >= 10) {
            effects.push({
                type: 'status',
                effect: `${element}_burn`,
                duration: 5,
                dotDamage: spell.damage * 0.1
            });
        }

        return effects;
    }

    learnSpell(spellId) {
        if (!this.unlockedSpells.includes(spellId)) {
            this.unlockedSpells.push(spellId);
            return true;
        }
        return false;
    }

    gainMagicExp(amount) {
        this.playerMagicExp += amount;
        
        const nextCircle = this.magicCircles.find(c => c.level > this.playerMagicLevel);
        if (nextCircle && this.playerMagicExp >= nextCircle.level * 1000) {
            this.playerMagicLevel = nextCircle.level;
            return {
                levelUp: true,
                newCircle: nextCircle,
                spellsUnlocked: nextCircle.spellsUnlocked
            };
        }
        
        return { levelUp: false };
    }

    resetComboChain() {
        this.comboChain = 0;
    }

    update(deltaTime) {
        // Update active buffs
        this.activeBuffs = this.activeBuffs.filter(buff => {
            buff.duration -= deltaTime;
            return buff.duration > 0;
        });

        // Decay combo chain over time
        if (this.comboChain > 0) {
            this.comboChain = Math.max(0, this.comboChain - deltaTime * 0.1);
        }
    }

    getPlayerMagicCircle() {
        return this.magicCircles.find(c => c.level <= this.playerMagicLevel) || this.magicCircles[0];
    }

    getAllSpells() {
        const allSpells = [];
        Object.entries(this.elements).forEach(([element, data]) => {
            data.spells.forEach(spell => {
                allSpells.push({
                    ...spell,
                    element: element,
                    elementColor: data.color
                });
            });
        });
        return allSpells;
    }
}
