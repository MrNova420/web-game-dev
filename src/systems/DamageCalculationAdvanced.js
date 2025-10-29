/**
 * DamageCalculationAdvanced.js
 * 
 * Advanced damage calculation system with complex formulas.
 * Handles armor penetration, resistances, critical hits, DoT, elemental advantages.
 * 
 * Features:
 * - Armor penetration calculations
 * - 8 element resistance system
 * - Critical hit location multipliers
 * - Damage over time calculations
 * - Elemental advantage/disadvantage matrix
 * - Combo damage multipliers
 * - Level scaling formulas
 * - Diminishing returns system
 * 
 * No visual assets needed - pure calculation system.
 */

export class DamageCalculationAdvanced {
  constructor() {
    this.elementalMatrix = this.initializeElementalMatrix();
    this.hitLocationMultipliers = {
      HEAD: 3.0,
      NECK: 2.5,
      TORSO: 1.5,
      ARM_LEFT: 1.2,
      ARM_RIGHT: 1.2,
      LEG_LEFT: 1.0,
      LEG_RIGHT: 1.0,
      HAND: 1.3,
      FOOT: 0.8
    };
    
    this.criticalMultipliers = {
      NORMAL: 2.0,
      IMPROVED: 2.5,
      DEADLY: 3.0,
      DEVASTATING: 4.0
    };
    
    this.damageTypes = ['PHYSICAL', 'MAGICAL', 'TRUE', 'MIXED'];
  }

  /**
   * Initialize elemental advantage/disadvantage matrix
   */
  initializeElementalMatrix() {
    return {
      FIRE: {
        strong: ['NATURE', 'ICE', 'DARK'],
        weak: ['WATER', 'HOLY'],
        neutral: ['LIGHTNING', 'ARCANE', 'POISON']
      },
      WATER: {
        strong: ['FIRE', 'LIGHTNING'],
        weak: ['NATURE', 'ICE'],
        neutral: ['HOLY', 'DARK', 'ARCANE', 'POISON']
      },
      ICE: {
        strong: ['WATER', 'NATURE'],
        weak: ['FIRE', 'HOLY'],
        neutral: ['LIGHTNING', 'DARK', 'ARCANE', 'POISON']
      },
      NATURE: {
        strong: ['WATER', 'LIGHTNING'],
        weak: ['FIRE', 'ICE', 'POISON'],
        neutral: ['HOLY', 'DARK', 'ARCANE']
      },
      LIGHTNING: {
        strong: ['WATER', 'ARCANE'],
        weak: ['NATURE'],
        neutral: ['FIRE', 'ICE', 'HOLY', 'DARK', 'POISON']
      },
      HOLY: {
        strong: ['DARK', 'POISON'],
        weak: ['ARCANE'],
        neutral: ['FIRE', 'WATER', 'ICE', 'NATURE', 'LIGHTNING']
      },
      DARK: {
        strong: ['HOLY', 'ARCANE'],
        weak: ['NATURE'],
        neutral: ['FIRE', 'WATER', 'ICE', 'LIGHTNING', 'POISON']
      },
      ARCANE: {
        strong: ['HOLY', 'LIGHTNING'],
        weak: ['DARK'],
        neutral: ['FIRE', 'WATER', 'ICE', 'NATURE', 'POISON']
      },
      POISON: {
        strong: ['NATURE'],
        weak: ['HOLY', 'FIRE'],
        neutral: ['WATER', 'ICE', 'LIGHTNING', 'DARK', 'ARCANE']
      }
    };
  }

  /**
   * Calculate final damage
   */
  calculateDamage(attacker, defender, damageInput) {
    let damage = damageInput.baseDamage;

    // Apply attacker modifiers
    damage *= this.getAttackerDamageMultiplier(attacker);

    // Apply elemental advantages
    if (damageInput.element) {
      damage *= this.getElementalMultiplier(
        damageInput.element,
        defender.resistances
      );
    }

    // Apply armor/resistance reduction
    if (damageInput.damageType === 'PHYSICAL') {
      damage *= this.calculateArmorReduction(
        defender.armor,
        attacker.armorPenetration || 0
      );
    } else if (damageInput.damageType === 'MAGICAL') {
      damage *= this.calculateMagicResistanceReduction(
        defender.magicResist,
        attacker.magicPenetration || 0
      );
    }

    // Apply critical hit
    if (damageInput.isCritical) {
      const critType = damageInput.criticalType || 'NORMAL';
      damage *= this.criticalMultipliers[critType];
      
      // Location-based crit bonus
      if (damageInput.hitLocation) {
        damage *= this.hitLocationMultipliers[damageInput.hitLocation];
      }
    }

    // Apply combo multiplier
    if (damageInput.comboCount > 1) {
      damage *= this.getComboMultiplier(damageInput.comboCount);
    }

    // Apply level difference scaling
    damage *= this.getLevelScaling(attacker.level, defender.level);

    // Apply damage modifiers from status effects
    damage *= this.getStatusEffectMultiplier(defender);

    // Apply backstab bonus
    if (damageInput.isBackstab) {
      damage *= 2.5;
    }

    // Apply vulnerability windows
    if (defender.isVulnerable) {
      damage *= 1.5;
    }

    // Apply damage reduction from shields/blocks
    if (defender.isBlocking && !damageInput.ignoresBlock) {
      damage *= 0.3; // 70% reduction when blocking
    }

    // Minimum damage threshold
    damage = Math.max(damage, damageInput.baseDamage * 0.1);

    return {
      finalDamage: Math.floor(damage),
      isCritical: damageInput.isCritical,
      damageType: damageInput.damageType,
      element: damageInput.element,
      breakdown: this.generateDamageBreakdown(damageInput, damage)
    };
  }

  /**
   * Calculate armor reduction
   */
  calculateArmorReduction(armor, penetration) {
    // Penetration reduces effective armor
    const effectiveArmor = Math.max(0, armor * (1 - penetration / 100));
    
    // Diminishing returns formula
    const reduction = effectiveArmor / (effectiveArmor + 100);
    
    // Return damage multiplier (1 - reduction)
    return Math.max(0.1, 1 - reduction);
  }

  /**
   * Calculate magic resistance reduction
   */
  calculateMagicResistanceReduction(magicResist, penetration) {
    const effectiveResist = Math.max(0, magicResist * (1 - penetration / 100));
    const reduction = effectiveResist / (effectiveResist + 100);
    return Math.max(0.1, 1 - reduction);
  }

  /**
   * Get elemental damage multiplier
   */
  getElementalMultiplier(attackElement, defenderResistances) {
    let multiplier = 1.0;

    // Check elemental advantages/disadvantages
    const elementData = this.elementalMatrix[attackElement];
    
    // Apply defender's elemental resistances
    if (defenderResistances && defenderResistances[attackElement]) {
      const resistance = defenderResistances[attackElement];
      multiplier *= (1 - resistance / 100);
    }

    return Math.max(0.1, multiplier);
  }

  /**
   * Get elemental advantage multiplier
   */
  getElementalAdvantage(attackElement, defenderElement) {
    if (!attackElement || !defenderElement) return 1.0;

    const elementData = this.elementalMatrix[attackElement];
    
    if (elementData.strong.includes(defenderElement)) {
      return 1.5; // 50% bonus damage
    } else if (elementData.weak.includes(defenderElement)) {
      return 0.75; // 25% penalty
    }
    
    return 1.0; // neutral
  }

  /**
   * Calculate combo multiplier
   */
  getComboMultiplier(comboCount) {
    if (comboCount <= 1) return 1.0;
    if (comboCount === 2) return 1.2;
    if (comboCount === 3) return 1.5;
    if (comboCount === 4) return 2.0;
    return 2.5; // 5+ hits
  }

  /**
   * Calculate level scaling
   */
  getLevelScaling(attackerLevel, defenderLevel) {
    const levelDiff = attackerLevel - defenderLevel;
    
    if (levelDiff >= 10) return 1.5;
    if (levelDiff >= 5) return 1.3;
    if (levelDiff >= 0) return 1.0;
    if (levelDiff >= -5) return 0.8;
    if (levelDiff >= -10) return 0.6;
    return 0.5; // 10+ levels lower
  }

  /**
   * Get attacker damage multiplier
   */
  getAttackerDamageMultiplier(attacker) {
    let multiplier = 1.0;

    // Apply stat-based modifiers
    if (attacker.strength) {
      multiplier *= (1 + attacker.strength / 100);
    }

    // Apply buffs
    if (attacker.buffs) {
      if (attacker.buffs.EMPOWERED) multiplier *= 1.5;
      if (attacker.buffs.BERSERK) multiplier *= 2.0;
      if (attacker.buffs.WEAKENED) multiplier *= 0.7;
    }

    return multiplier;
  }

  /**
   * Get status effect multiplier for defender
   */
  getStatusEffectMultiplier(defender) {
    let multiplier = 1.0;

    if (defender.statusEffects) {
      if (defender.statusEffects.MARKED) multiplier *= 1.3;
      if (defender.statusEffects.CURSED) multiplier *= 1.2;
      if (defender.statusEffects.FORTIFIED) multiplier *= 0.7;
    }

    return multiplier;
  }

  /**
   * Calculate damage over time
   */
  calculateDoT(baseDamage, duration, tickRate, stacks = 1) {
    const ticks = Math.floor(duration / tickRate);
    const damagePerTick = baseDamage * stacks;
    const totalDamage = damagePerTick * ticks;

    return {
      damagePerTick: Math.floor(damagePerTick),
      totalTicks: ticks,
      totalDamage: Math.floor(totalDamage),
      duration: duration,
      tickRate: tickRate
    };
  }

  /**
   * Calculate critical hit chance
   */
  calculateCritChance(baseCritChance, attacker, defender) {
    let critChance = baseCritChance;

    // Attacker bonuses
    if (attacker.critBonus) critChance += attacker.critBonus;
    if (attacker.buffs && attacker.buffs.INSPIRED) critChance += 0.1;

    // Defender penalties
    if (defender.isVulnerable) critChance += 0.2;

    // Location bonuses
    if (attacker.targetingHead) critChance *= 1.5;

    return Math.min(critChance, 0.95); // Max 95% crit chance
  }

  /**
   * Calculate penetration effectiveness
   */
  calculatePenetrationEffectiveness(penetration, armor) {
    if (penetration >= armor) return 1.0; // Full penetration
    
    const effectiveness = penetration / armor;
    return Math.max(0, effectiveness);
  }

  /**
   * Apply diminishing returns
   */
  applyDiminishingReturns(value, cap, exponent = 0.75) {
    if (value <= 0) return 0;
    if (value >= cap) return cap;
    
    return cap * Math.pow(value / cap, exponent);
  }

  /**
   * Generate damage breakdown for UI
   */
  generateDamageBreakdown(damageInput, finalDamage) {
    return {
      baseDamage: damageInput.baseDamage,
      armorReduction: finalDamage < damageInput.baseDamage,
      criticalBonus: damageInput.isCritical,
      comboBonus: damageInput.comboCount > 1,
      elementalBonus: damageInput.element !== undefined,
      finalDamage: Math.floor(finalDamage)
    };
  }

  /**
   * Calculate effective health (EHP)
   */
  calculateEffectiveHealth(health, armor, magicResist) {
    const physicalEHP = health / this.calculateArmorReduction(armor, 0);
    const magicalEHP = health / this.calculateMagicResistanceReduction(magicResist, 0);
    
    return {
      physical: Math.floor(physicalEHP),
      magical: Math.floor(magicalEHP),
      average: Math.floor((physicalEHP + magicalEHP) / 2)
    };
  }

  /**
   * Calculate damage per second (DPS)
   */
  calculateDPS(damagePerHit, attackSpeed) {
    return damagePerHit * attackSpeed;
  }

  /**
   * Calculate burst damage
   */
  calculateBurstDamage(attacks) {
    let totalDamage = 0;
    let comboCount = 1;

    for (const attack of attacks) {
      const damageResult = this.calculateDamage(
        attack.attacker,
        attack.defender,
        {
          ...attack,
          comboCount: comboCount
        }
      );
      
      totalDamage += damageResult.finalDamage;
      comboCount++;
    }

    return totalDamage;
  }
}
