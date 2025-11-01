import { logger } from '../core/Logger.js';
/**
 * WeaponSkillSystem.js
 * Phase 5.3 - Weapon Skill and Mastery System
 * Weapon proficiency, unique skills per weapon, mastery bonuses
 * ~500 lines
 */

export class WeaponSkillSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // Weapon types and their base stats
        this.weaponTypes = {
            sword: {
                name: 'Sword',
                baseDamage: 25,
                attackSpeed: 1.0,
                range: 2,
                skills: ['slash', 'thrust', 'whirlwind', 'blade_dance', 'execute'],
                masteryBonus: { damage: 1.5, critChance: 0.15 }
            },
            axe: {
                name: 'Axe',
                baseDamage: 35,
                attackSpeed: 0.8,
                range: 2,
                skills: ['cleave', 'rend', 'berserker_rage', 'shatter', 'devastate'],
                masteryBonus: { damage: 1.8, critDamage: 2.0 }
            },
            bow: {
                name: 'Bow',
                baseDamage: 20,
                attackSpeed: 1.2,
                range: 15,
                skills: ['power_shot', 'multi_shot', 'rain_of_arrows', 'snipe', 'volley'],
                masteryBonus: { damage: 1.4, range: 1.5 }
            },
            staff: {
                name: 'Staff',
                baseDamage: 30,
                attackSpeed: 0.9,
                range: 10,
                skills: ['fireball', 'ice_lance', 'arcane_blast', 'meteor', 'chain_lightning'],
                masteryBonus: { magicPower: 1.8, manaCost: 0.7 }
            },
            dagger: {
                name: 'Dagger',
                baseDamage: 15,
                attackSpeed: 1.5,
                range: 1.5,
                skills: ['backstab', 'poison_strike', 'shadow_step', 'assassinate', 'flurry'],
                masteryBonus: { critChance: 0.25, attackSpeed: 1.3 }
            },
            spear: {
                name: 'Spear',
                baseDamage: 28,
                attackSpeed: 1.1,
                range: 3,
                skills: ['pierce', 'sweep', 'charge', 'impale', 'dragon_strike'],
                masteryBonus: { damage: 1.6, range: 1.3 }
            },
            hammer: {
                name: 'Hammer',
                baseDamage: 40,
                attackSpeed: 0.7,
                range: 2,
                skills: ['crush', 'ground_slam', 'shockwave', 'earthquake', 'titanic_blow'],
                masteryBonus: { damage: 2.0, stun: 1.5 }
            },
            wand: {
                name: 'Wand',
                baseDamage: 18,
                attackSpeed: 1.3,
                range: 8,
                skills: ['magic_missile', 'heal', 'shield', 'teleport', 'time_warp'],
                masteryBonus: { magicPower: 1.5, castSpeed: 1.3 }
            }
        };
        
        // Player weapon proficiency tracking
        this.proficiency = {};
        Object.keys(this.weaponTypes).forEach(type => {
            this.proficiency[type] = {
                level: 1,
                experience: 0,
                nextLevel: 100,
                masteryTier: 'novice', // novice, adept, expert, master, grandmaster
                unlockedSkills: [this.weaponTypes[type].skills[0]], // First skill unlocked
                bonuses: {}
            };
        });
        
        // Current equipped weapon
        this.equippedWeapon = null;
        
        // Mastery tier thresholds
        this.masteryTiers = {
            novice: { level: 1, bonusMultiplier: 1.0 },
            adept: { level: 10, bonusMultiplier: 1.2 },
            expert: { level: 25, bonusMultiplier: 1.5 },
            master: { level: 50, bonusMultiplier: 2.0 },
            grandmaster: { level: 100, bonusMultiplier: 3.0 }
        };
        
        // Skill cooldowns
        this.skillCooldowns = {};
        
        // Weapon evolution system
        this.weaponEvolution = {
            tiers: ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'],
            requirements: {
                uncommon: { proficiencyLevel: 5, materials: ['basic_ore'] },
                rare: { proficiencyLevel: 15, materials: ['rare_gem', 'enchanted_metal'] },
                epic: { proficiencyLevel: 30, materials: ['epic_crystal', 'ancient_rune'] },
                legendary: { proficiencyLevel: 50, materials: ['legendary_essence', 'dragon_scale'] },
                mythic: { proficiencyLevel: 75, materials: ['mythic_fragment', 'void_core', 'celestial_dust'] }
            }
        };
        
        logger.info('⚔️ WeaponSkillSystem initialized');
    }
    
    /**
     * Equip a weapon
     */
    equipWeapon(weaponType, tier = 'common') {
        if (!this.weaponTypes[weaponType]) {
            logger.warn('Unknown weapon type:', weaponType);
            return;
        }
        
        this.equippedWeapon = {
            type: weaponType,
            tier,
            data: this.weaponTypes[weaponType],
            proficiency: this.proficiency[weaponType]
        };
        
        logger.info(`⚔️ Equipped ${tier} ${weaponType}`);
    }
    
    /**
     * Use a weapon skill
     */
    useSkill(skillName) {
        if (!this.equippedWeapon) {
            return { success: false, reason: 'no_weapon' };
        }
        
        const prof = this.equippedWeapon.proficiency;
        
        // Check if skill is unlocked
        if (!prof.unlockedSkills.includes(skillName)) {
            return { success: false, reason: 'skill_locked' };
        }
        
        // Check cooldown
        const cooldown = this.skillCooldowns[skillName];
        if (cooldown && Date.now() < cooldown) {
            return { success: false, reason: 'on_cooldown', remaining: cooldown - Date.now() };
        }
        
        // Calculate damage with proficiency bonus
        const baseDamage = this.getSkillDamage(skillName);
        const proficiencyBonus = this.getProficiencyBonus();
        const finalDamage = baseDamage * proficiencyBonus;
        
        // Set cooldown
        this.skillCooldowns[skillName] = Date.now() + this.getSkillCooldown(skillName);
        
        // Grant experience
        this.gainExperience(this.equippedWeapon.type, 10);
        
        logger.info(`💥 Used ${skillName}: ${finalDamage.toFixed(0)} damage`);
        
        return {
            success: true,
            skillName,
            damage: finalDamage,
            proficiencyBonus
        };
    }
    
    /**
     * Get skill damage
     */
    getSkillDamage(skillName) {
        if (!this.equippedWeapon) return 0;
        
        const weaponData = this.equippedWeapon.data;
        const skillIndex = weaponData.skills.indexOf(skillName);
        
        // Higher tier skills do more damage
        return weaponData.baseDamage * (1 + skillIndex * 0.5);
    }
    
    /**
     * Get skill cooldown in ms
     */
    getSkillCooldown(skillName) {
        if (!this.equippedWeapon) return 0;
        
        const weaponData = this.equippedWeapon.data;
        const skillIndex = weaponData.skills.indexOf(skillName);
        
        // Higher tier skills have longer cooldowns
        return 1000 + (skillIndex * 2000); // 1s to 9s
    }
    
    /**
     * Gain weapon proficiency experience
     */
    gainExperience(weaponType, amount) {
        const prof = this.proficiency[weaponType];
        if (!prof) return;
        
        prof.experience += amount;
        
        // Check for level up
        while (prof.experience >= prof.nextLevel) {
            prof.experience -= prof.nextLevel;
            prof.level++;
            prof.nextLevel = Math.floor(prof.nextLevel * 1.5);
            
            this.onProficiencyLevelUp(weaponType, prof);
        }
    }
    
    /**
     * Handle proficiency level up
     */
    onProficiencyLevelUp(weaponType, prof) {
        logger.info(`📈 ${weaponType} proficiency reached level ${prof.level}!`);
        
        // Unlock new skills every 5 levels
        if (prof.level % 5 === 0) {
            const weaponData = this.weaponTypes[weaponType];
            const skillIndex = Math.floor(prof.level / 5);
            
            if (skillIndex < weaponData.skills.length) {
                const newSkill = weaponData.skills[skillIndex];
                prof.unlockedSkills.push(newSkill);
                logger.info(`✨ Unlocked skill: ${newSkill}`);
            }
        }
        
        // Update mastery tier
        this.updateMasteryTier(weaponType, prof);
        
        // Calculate bonuses
        this.calculateProficiencyBonuses(weaponType, prof);
    }
    
    /**
     * Update mastery tier
     */
    updateMasteryTier(weaponType, prof) {
        const oldTier = prof.masteryTier;
        
        if (prof.level >= 100) prof.masteryTier = 'grandmaster';
        else if (prof.level >= 50) prof.masteryTier = 'master';
        else if (prof.level >= 25) prof.masteryTier = 'expert';
        else if (prof.level >= 10) prof.masteryTier = 'adept';
        else prof.masteryTier = 'novice';
        
        if (oldTier !== prof.masteryTier) {
            logger.info(`🏆 ${weaponType} mastery: ${prof.masteryTier.toUpperCase()}!`);
        }
    }
    
    /**
     * Calculate proficiency bonuses
     */
    calculateProficiencyBonuses(weaponType, prof) {
        const weaponData = this.weaponTypes[weaponType];
        const tierBonus = this.masteryTiers[prof.masteryTier].bonusMultiplier;
        
        prof.bonuses = {};
        
        // Apply mastery bonuses scaled by tier
        Object.entries(weaponData.masteryBonus).forEach(([stat, value]) => {
            prof.bonuses[stat] = value * tierBonus;
        });
    }
    
    /**
     * Get current proficiency bonus multiplier
     */
    getProficiencyBonus() {
        if (!this.equippedWeapon) return 1.0;
        
        const prof = this.equippedWeapon.proficiency;
        const tierBonus = this.masteryTiers[prof.masteryTier].bonusMultiplier;
        
        return 1.0 + (prof.level * 0.02 * tierBonus); // +2% per level, scaled by mastery
    }
    
    /**
     * Evolve weapon to next tier
     */
    evolveWeapon(weaponType, materials) {
        if (!this.equippedWeapon || this.equippedWeapon.type !== weaponType) {
            return { success: false, reason: 'weapon_not_equipped' };
        }
        
        const currentTier = this.equippedWeapon.tier;
        const tiers = this.weaponEvolution.tiers;
        const currentIndex = tiers.indexOf(currentTier);
        
        if (currentIndex >= tiers.length - 1) {
            return { success: false, reason: 'max_tier' };
        }
        
        const nextTier = tiers[currentIndex + 1];
        const requirements = this.weaponEvolution.requirements[nextTier];
        
        // Check proficiency level
        const prof = this.proficiency[weaponType];
        if (prof.level < requirements.proficiencyLevel) {
            return {
                success: false,
                reason: 'proficiency_too_low',
                required: requirements.proficiencyLevel,
                current: prof.level
            };
        }
        
        // Check materials (simplified - assumes player has materials)
        // In real implementation, would check inventory
        
        // Evolve weapon
        this.equippedWeapon.tier = nextTier;
        
        logger.info(`✨ Weapon evolved to ${nextTier}!`);
        
        return {
            success: true,
            newTier: nextTier
        };
    }
    
    /**
     * Get weapon stats with all bonuses applied
     */
    getWeaponStats() {
        if (!this.equippedWeapon) return null;
        
        const weaponData = this.equippedWeapon.data;
        const prof = this.equippedWeapon.proficiency;
        const tierMultiplier = this.getTierMultiplier(this.equippedWeapon.tier);
        const profBonus = this.getProficiencyBonus();
        
        return {
            type: this.equippedWeapon.type,
            tier: this.equippedWeapon.tier,
            damage: weaponData.baseDamage * tierMultiplier * profBonus,
            attackSpeed: weaponData.attackSpeed * (prof.bonuses.attackSpeed || 1),
            range: weaponData.range * (prof.bonuses.range || 1),
            proficiencyLevel: prof.level,
            masteryTier: prof.masteryTier,
            unlockedSkills: prof.unlockedSkills,
            bonuses: prof.bonuses
        };
    }
    
    /**
     * Get tier damage multiplier
     */
    getTierMultiplier(tier) {
        const multipliers = {
            common: 1.0,
            uncommon: 1.3,
            rare: 1.7,
            epic: 2.2,
            legendary: 3.0,
            mythic: 5.0
        };
        return multipliers[tier] || 1.0;
    }
    
    /**
     * Get all proficiency data
     */
    getAllProficiency() {
        return Object.entries(this.proficiency).map(([type, prof]) => ({
            weapon: type,
            level: prof.level,
            experience: prof.experience,
            nextLevel: prof.nextLevel,
            masteryTier: prof.masteryTier,
            unlockedSkills: prof.unlockedSkills.length,
            totalSkills: this.weaponTypes[type].skills.length
        }));
    }
    
    /**
     * Update system
     */
    update(deltaTime) {
        // Update cooldowns display could go here
        // For now, cooldowns are checked when skills are used
    }
    
    /**
     * Get system state for UI
     */
    getState() {
        return {
            equippedWeapon: this.equippedWeapon ? {
                type: this.equippedWeapon.type,
                tier: this.equippedWeapon.tier,
                stats: this.getWeaponStats()
            } : null,
            proficiency: this.getAllProficiency(),
            availableSkills: this.equippedWeapon ? this.equippedWeapon.proficiency.unlockedSkills : []
        };
    }
}
