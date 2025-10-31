/**
 * MountCustomizationSystem.js
 * Phase 5 - Mount Customization System
 * Visual customization, mount armor, and mount abilities
 * ~300 lines
 */

export class MountCustomizationSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.mountCustomizations = new Map(); // mountId -> customization data
        this.mountArmor = this.createArmorDatabase();
        this.mountAbilities = this.createAbilityDatabase();
        this.mountCosmetics = this.createCosmeticDatabase();
        
        // Customization slots
        this.customizationSlots = {
            head: ['horns', 'crown', 'helm', 'mask'],
            body: ['saddle', 'armor', 'cloak', 'wings'],
            legs: ['boots', 'shoes', 'greaves'],
            tail: ['ribbon', 'armor', 'flame', 'spike'],
            accessories: ['necklace', 'pendant', 'charm', 'banner']
        };
    }
    
    /**
     * Create armor database
     */
    createArmorDatabase() {
        return {
            // Head armor
            leather_helm: {
                slot: 'head',
                name: 'Leather Helm',
                tier: 'common',
                defense: 5,
                speed: -2,
                unlockLevel: 1
            },
            iron_helm: {
                slot: 'head',
                name: 'Iron Helm',
                tier: 'uncommon',
                defense: 15,
                speed: -5,
                unlockLevel: 10
            },
            dragon_crown: {
                slot: 'head',
                name: 'Dragon Crown',
                tier: 'legendary',
                defense: 50,
                speed: 0,
                special: 'fire_resistance',
                unlockLevel: 50
            },
            
            // Body armor
            basic_saddle: {
                slot: 'body',
                name: 'Basic Saddle',
                tier: 'common',
                comfort: 10,
                speed: 0,
                unlockLevel: 1
            },
            knights_saddle: {
                slot: 'body',
                name: 'Knight\'s Saddle',
                tier: 'uncommon',
                comfort: 25,
                defense: 10,
                unlockLevel: 15
            },
            plate_armor: {
                slot: 'body',
                name: 'Plate Armor',
                tier: 'rare',
                defense: 40,
                speed: -10,
                durability: 200,
                unlockLevel: 25
            },
            celestial_armor: {
                slot: 'body',
                name: 'Celestial Armor',
                tier: 'legendary',
                defense: 100,
                speed: 10,
                special: 'holy_aura',
                unlockLevel: 60
            },
            
            // Leg armor
            iron_boots: {
                slot: 'legs',
                name: 'Iron Boots',
                tier: 'uncommon',
                defense: 10,
                speed: -3,
                unlockLevel: 5
            },
            speed_boots: {
                slot: 'legs',
                name: 'Speed Boots',
                tier: 'rare',
                defense: 15,
                speed: 15,
                unlockLevel: 30
            },
            
            // Tail armor
            spiked_tail: {
                slot: 'tail',
                name: 'Spiked Tail Armor',
                tier: 'rare',
                defense: 20,
                attack: 10,
                unlockLevel: 20
            },
            flame_tail: {
                slot: 'tail',
                name: 'Flame Tail',
                tier: 'epic',
                attack: 30,
                special: 'burn_trail',
                unlockLevel: 40
            }
        };
    }
    
    /**
     * Create ability database
     */
    createAbilityDatabase() {
        return {
            // Movement abilities
            dash: {
                name: 'Dash',
                type: 'movement',
                cooldown: 5,
                effect: { speedBoost: 2.0, duration: 3 },
                unlockLevel: 10
            },
            flight: {
                name: 'Flight',
                type: 'movement',
                cooldown: 30,
                effect: { canFly: true, duration: 10 },
                requirement: 'wings',
                unlockLevel: 25
            },
            teleport: {
                name: 'Teleport',
                type: 'movement',
                cooldown: 20,
                effect: { range: 50 },
                unlockLevel: 35
            },
            
            // Combat abilities
            charge: {
                name: 'Charge',
                type: 'combat',
                cooldown: 10,
                effect: { damage: 50, knockback: 10 },
                unlockLevel: 15
            },
            trample: {
                name: 'Trample',
                type: 'combat',
                cooldown: 15,
                effect: { aoe: true, damage: 30, radius: 5 },
                unlockLevel: 20
            },
            roar: {
                name: 'Intimidating Roar',
                type: 'combat',
                cooldown: 25,
                effect: { fear: true, radius: 10, duration: 5 },
                unlockLevel: 30
            },
            
            // Support abilities
            heal: {
                name: 'Healing Aura',
                type: 'support',
                cooldown: 60,
                effect: { healing: 100, aura: true, duration: 10 },
                unlockLevel: 40
            },
            shield: {
                name: 'Protective Shield',
                type: 'support',
                cooldown: 45,
                effect: { shield: 200, duration: 5 },
                unlockLevel: 35
            },
            
            // Special abilities
            elemental_burst: {
                name: 'Elemental Burst',
                type: 'special',
                cooldown: 90,
                effect: { damage: 200, aoe: true, radius: 15 },
                requirement: 'elemental_type',
                unlockLevel: 50
            }
        };
    }
    
    /**
     * Create cosmetic database
     */
    createCosmeticDatabase() {
        return {
            // Colors
            colors: {
                midnight_black: { name: 'Midnight Black', hex: '#1a1a1a', unlockLevel: 1 },
                snow_white: { name: 'Snow White', hex: '#f5f5f5', unlockLevel: 1 },
                crimson_red: { name: 'Crimson Red', hex: '#dc143c', unlockLevel: 5 },
                emerald_green: { name: 'Emerald Green', hex: '#50c878', unlockLevel: 5 },
                sapphire_blue: { name: 'Sapphire Blue', hex: '#0f52ba', unlockLevel: 10 },
                golden_yellow: { name: 'Golden Yellow', hex: '#ffd700', unlockLevel: 15 },
                royal_purple: { name: 'Royal Purple', hex: '#7851a9', unlockLevel: 20 },
                cosmic_pink: { name: 'Cosmic Pink', hex: '#ff1493', unlockLevel: 25 },
                celestial_silver: { name: 'Celestial Silver', hex: '#c0c0c0', unlockLevel: 30 },
                rainbow_gradient: { name: 'Rainbow Gradient', type: 'gradient', unlockLevel: 50 }
            },
            
            // Patterns
            patterns: {
                stripes: { name: 'Stripes', unlockLevel: 10 },
                spots: { name: 'Spots', unlockLevel: 10 },
                flames: { name: 'Flame Pattern', unlockLevel: 20 },
                stars: { name: 'Starry Pattern', unlockLevel: 25 },
                tribal: { name: 'Tribal Marks', unlockLevel: 30 },
                runes: { name: 'Glowing Runes', unlockLevel: 40 },
                galaxy: { name: 'Galaxy Pattern', unlockLevel: 50 }
            },
            
            // Effects
            effects: {
                sparkles: { name: 'Sparkle Trail', type: 'particle', unlockLevel: 15 },
                flames: { name: 'Flame Aura', type: 'particle', unlockLevel: 20 },
                lightning: { name: 'Lightning Crackle', type: 'particle', unlockLevel: 25 },
                frost: { name: 'Frost Aura', type: 'particle', unlockLevel: 30 },
                shadow: { name: 'Shadow Trail', type: 'particle', unlockLevel: 35 },
                divine_light: { name: 'Divine Light', type: 'glow', unlockLevel: 45 },
                void_darkness: { name: 'Void Darkness', type: 'glow', unlockLevel: 45 },
                cosmic_energy: { name: 'Cosmic Energy', type: 'aura', unlockLevel: 60 }
            },
            
            // Accessories
            accessories: {
                flowers: { name: 'Flower Crown', slot: 'head', unlockLevel: 5 },
                ribbons: { name: 'Decorative Ribbons', slot: 'tail', unlockLevel: 5 },
                banner: { name: 'War Banner', slot: 'accessories', unlockLevel: 15 },
                bells: { name: 'Musical Bells', slot: 'accessories', unlockLevel: 10 },
                lantern: { name: 'Hanging Lantern', slot: 'accessories', unlockLevel: 20 },
                wings: { name: 'Angelic Wings', slot: 'body', unlockLevel: 35 },
                demon_wings: { name: 'Demon Wings', slot: 'body', unlockLevel: 35 },
                crystal_spikes: { name: 'Crystal Spikes', slot: 'back', unlockLevel: 40 }
            }
        };
    }
    
    /**
     * Initialize mount customization
     */
    initializeMountCustomization(mountId) {
        if (this.mountCustomizations.has(mountId)) {
            return this.mountCustomizations.get(mountId);
        }
        
        const customization = {
            mountId: mountId,
            equipped: {
                head: null,
                body: 'basic_saddle',
                legs: null,
                tail: null,
                accessories: []
            },
            appearance: {
                primaryColor: '#ffffff',
                secondaryColor: '#000000',
                pattern: null,
                effects: []
            },
            abilities: [],
            stats: {
                defense: 0,
                attack: 0,
                speed: 0,
                comfort: 0
            }
        };
        
        this.mountCustomizations.set(mountId, customization);
        this.recalculateStats(mountId);
        
        return customization;
    }
    
    /**
     * Equip armor piece
     */
    equipArmor(mountId, armorId) {
        const customization = this.mountCustomizations.get(mountId);
        if (!customization) return false;
        
        const armor = this.mountArmor[armorId];
        if (!armor) return false;
        
        // Check level requirement
        if (this.gameEngine.player && armor.unlockLevel > this.gameEngine.player.level) {
            logger.info(`Requires level ${armor.unlockLevel}`);
            return false;
        }
        
        // Equip armor
        customization.equipped[armor.slot] = armorId;
        this.recalculateStats(mountId);
        this.applyVisualChanges(mountId);
        
        return true;
    }
    
    /**
     * Unequip armor piece
     */
    unequipArmor(mountId, slot) {
        const customization = this.mountCustomizations.get(mountId);
        if (!customization) return false;
        
        customization.equipped[slot] = null;
        this.recalculateStats(mountId);
        this.applyVisualChanges(mountId);
        
        return true;
    }
    
    /**
     * Learn mount ability
     */
    learnAbility(mountId, abilityId) {
        const customization = this.mountCustomizations.get(mountId);
        if (!customization) return false;
        
        const ability = this.mountAbilities[abilityId];
        if (!ability) return false;
        
        // Check level requirement
        if (this.gameEngine.player && ability.unlockLevel > this.gameEngine.player.level) {
            logger.info(`Requires level ${ability.unlockLevel}`);
            return false;
        }
        
        // Check requirement (e.g., wings for flight)
        if (ability.requirement) {
            if (ability.requirement === 'wings') {
                const hasWings = customization.equipped.body && 
                               (customization.equipped.body.includes('wings') || 
                                customization.appearance.effects.includes('wings'));
                if (!hasWings) {
                    logger.info('Requires wings to be equipped');
                    return false;
                }
            }
        }
        
        // Add ability
        if (!customization.abilities.includes(abilityId)) {
            customization.abilities.push(abilityId);
            logger.info(`Learned ${ability.name}!`);
        }
        
        return true;
    }
    
    /**
     * Change mount color
     */
    changeColor(mountId, colorType, colorId) {
        const customization = this.mountCustomizations.get(mountId);
        if (!customization) return false;
        
        const color = this.mountCosmetics.colors[colorId];
        if (!color) return false;
        
        if (colorType === 'primary') {
            customization.appearance.primaryColor = color.hex || color;
        } else if (colorType === 'secondary') {
            customization.appearance.secondaryColor = color.hex || color;
        }
        
        this.applyVisualChanges(mountId);
        return true;
    }
    
    /**
     * Apply pattern
     */
    applyPattern(mountId, patternId) {
        const customization = this.mountCustomizations.get(mountId);
        if (!customization) return false;
        
        const pattern = this.mountCosmetics.patterns[patternId];
        if (!pattern) return false;
        
        customization.appearance.pattern = patternId;
        this.applyVisualChanges(mountId);
        
        return true;
    }
    
    /**
     * Add effect
     */
    addEffect(mountId, effectId) {
        const customization = this.mountCustomizations.get(mountId);
        if (!customization) return false;
        
        const effect = this.mountCosmetics.effects[effectId];
        if (!effect) return false;
        
        if (!customization.appearance.effects.includes(effectId)) {
            customization.appearance.effects.push(effectId);
            this.applyVisualChanges(mountId);
        }
        
        return true;
    }
    
    /**
     * Remove effect
     */
    removeEffect(mountId, effectId) {
        const customization = this.mountCustomizations.get(mountId);
        if (!customization) return false;
        
        const index = customization.appearance.effects.indexOf(effectId);
        if (index > -1) {
            customization.appearance.effects.splice(index, 1);
            this.applyVisualChanges(mountId);
        }
        
        return true;
    }
    
    /**
     * Recalculate mount stats from equipment
     */
    recalculateStats(mountId) {
        const customization = this.mountCustomizations.get(mountId);
        if (!customization) return;
        
        // Reset stats
        customization.stats = {
            defense: 0,
            attack: 0,
            speed: 0,
            comfort: 0
        };
        
        // Add stats from equipped armor
        for (const [slot, armorId] of Object.entries(customization.equipped)) {
            if (!armorId) continue;
            
            const armor = this.mountArmor[armorId];
            if (!armor) continue;
            
            if (armor.defense) customization.stats.defense += armor.defense;
            if (armor.attack) customization.stats.attack += armor.attack;
            if (armor.speed) customization.stats.speed += armor.speed;
            if (armor.comfort) customization.stats.comfort += armor.comfort;
        }
    }
    
    /**
     * Apply visual changes to mount
     */
    applyVisualChanges(mountId) {
        const customization = this.mountCustomizations.get(mountId);
        if (!customization) return;
        
        // Get mount from engine
        if (this.gameEngine.mountSystem) {
            const mount = this.gameEngine.mountSystem.getMount(mountId);
            if (mount && mount.mesh) {
                // Apply colors
                if (mount.mesh.material) {
                    mount.mesh.material.color.setStyle(customization.appearance.primaryColor);
                }
                
                // Apply effects (particles, etc.)
                for (const effectId of customization.appearance.effects) {
                    this.applyMountEffect(mount, effectId);
                }
            }
        }
    }
    
    /**
     * Apply visual effect to mount
     */
    applyMountEffect(mount, effectId) {
        const effect = this.mountCosmetics.effects[effectId];
        if (!effect) return;
        
        // Create particle systems or visual effects
        if (this.gameEngine.particleSystem) {
            switch (effect.type) {
                case 'particle':
                    this.gameEngine.particleSystem.attachToMount(mount, effectId);
                    break;
                case 'glow':
                    // Add glow effect
                    break;
                case 'aura':
                    // Add aura effect
                    break;
            }
        }
    }
    
    /**
     * Get mount customization data
     */
    getCustomization(mountId) {
        return this.mountCustomizations.get(mountId);
    }
    
    /**
     * Get available customizations for level
     */
    getAvailableCustomizations(level) {
        const available = {
            armor: [],
            abilities: [],
            colors: [],
            patterns: [],
            effects: [],
            accessories: []
        };
        
        // Filter by level
        for (const [id, armor] of Object.entries(this.mountArmor)) {
            if (armor.unlockLevel <= level) {
                available.armor.push({ id, ...armor });
            }
        }
        
        for (const [id, ability] of Object.entries(this.mountAbilities)) {
            if (ability.unlockLevel <= level) {
                available.abilities.push({ id, ...ability });
            }
        }
        
        for (const [id, color] of Object.entries(this.mountCosmetics.colors)) {
            if (color.unlockLevel <= level) {
                available.colors.push({ id, ...color });
            }
        }
        
        for (const [id, pattern] of Object.entries(this.mountCosmetics.patterns)) {
            if (pattern.unlockLevel <= level) {
                available.patterns.push({ id, ...pattern });
            }
        }
        
        for (const [id, effect] of Object.entries(this.mountCosmetics.effects)) {
            if (effect.unlockLevel <= level) {
                available.effects.push({ id, ...effect });
            }
        }
        
        for (const [id, accessory] of Object.entries(this.mountCosmetics.accessories)) {
            if (accessory.unlockLevel <= level) {
                available.accessories.push({ id, ...accessory });
            }
        }
        
        return available;
    }
}
