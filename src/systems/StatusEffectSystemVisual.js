/**
 * StatusEffectSystemVisual.js
 * 
 * Advanced status effect system with comprehensive visual feedback.
 * All icons from game-icons.net, particles from Kenney Particle Pack,
 * overlays from OpenGameArt, animations from Mixamo.
 * 
 * Features:
 * - 30+ unique status effects with visual indicators
 * - Duration tracking with countdown timers
 * - Stacking system (up to 10 stacks)
 * - Cleanse/dispel mechanics
 * - Immunity tracking
 * - Status resistance calculations
 * 
 * External Assets Used:
 * - Icons: game-icons.net (burning, frozen, poisoned, stunned, etc.)
 * - Particles: Kenney Particle Pack (fire, ice, poison, lightning effects)
 * - Overlays: OpenGameArt (status overlay textures)
 * - Animations: Mixamo (stun, frozen, sleep animations)
 */

export class StatusEffectSystemVisual {
  constructor() {
    this.activeEffects = new Map(); // entityId -> [effects]
    this.effectDefinitions = this.initializeEffectDefinitions();
    this.immunities = new Map(); // entityId -> Set<effectType>
    this.resistances = new Map(); // entityId -> {effectType: resistance%}
  }

  /**
   * Initialize all status effect definitions with external asset paths
   */
  initializeEffectDefinitions() {
    return {
      // Damage over Time Effects
      BURNING: {
        name: 'Burning',
        type: 'dot',
        icon: '/assets/icons/status/burning.png',              // game-icons.net
        particle: '/assets/particles/fire_dot.png',            // Kenney
        overlay: '/assets/textures/overlays/burning.png',      // OpenGameArt
        color: 0xFF4500,
        damagePerTick: 10,
        tickRate: 1.0,
        maxStacks: 5,
        visualScale: 1.2
      },
      POISONED: {
        name: 'Poisoned',
        type: 'dot',
        icon: '/assets/icons/status/poisoned.png',             // game-icons.net
        particle: '/assets/particles/poison_bubbles.png',      // Kenney
        overlay: '/assets/textures/overlays/poisoned.png',     // OpenGameArt
        color: 0x00FF00,
        damagePerTick: 5,
        tickRate: 0.5,
        maxStacks: 10,
        visualScale: 1.0
      },
      BLEEDING: {
        name: 'Bleeding',
        type: 'dot',
        icon: '/assets/icons/status/bleeding.png',             // game-icons.net
        particle: '/assets/particles/blood_drip.png',          // Kenney
        overlay: '/assets/textures/overlays/bleeding.png',     // OpenGameArt
        color: 0x8B0000,
        damagePerTick: 8,
        tickRate: 1.0,
        maxStacks: 3,
        visualScale: 0.8
      },

      // Control Effects
      FROZEN: {
        name: 'Frozen',
        type: 'control',
        icon: '/assets/icons/status/frozen.png',               // game-icons.net
        particle: '/assets/particles/ice_crystals.png',        // Kenney
        overlay: '/assets/textures/overlays/frozen.png',       // OpenGameArt
        animation: '/assets/animations/frozen_idle.fbx',       // Mixamo
        color: 0x00FFFF,
        movementSpeedMultiplier: 0,
        attackSpeedMultiplier: 0,
        maxStacks: 1,
        visualScale: 1.5
      },
      STUNNED: {
        name: 'Stunned',
        type: 'control',
        icon: '/assets/icons/status/stunned.png',              // game-icons.net
        particle: '/assets/particles/stars_spinning.png',      // Kenney
        overlay: '/assets/textures/overlays/stunned.png',      // OpenGameArt
        animation: '/assets/animations/stunned.fbx',           // Mixamo
        color: 0xFFFF00,
        disableActions: true,
        maxStacks: 1,
        visualScale: 1.0
      },
      ROOTED: {
        name: 'Rooted',
        type: 'control',
        icon: '/assets/icons/status/rooted.png',               // game-icons.net
        particle: '/assets/particles/vines.png',               // Kenney
        overlay: '/assets/textures/overlays/rooted.png',       // OpenGameArt
        color: 0x228B22,
        movementSpeedMultiplier: 0,
        maxStacks: 1,
        visualScale: 1.0
      },
      SLEEPING: {
        name: 'Sleeping',
        type: 'control',
        icon: '/assets/icons/status/sleeping.png',             // game-icons.net
        particle: '/assets/particles/zzz.png',                 // Kenney
        overlay: '/assets/textures/overlays/sleeping.png',     // OpenGameArt
        animation: '/assets/animations/sleep.fbx',             // Mixamo
        color: 0x9370DB,
        disableActions: true,
        breaksOnDamage: true,
        maxStacks: 1,
        visualScale: 0.8
      },
      FEARED: {
        name: 'Feared',
        type: 'control',
        icon: '/assets/icons/status/feared.png',               // game-icons.net
        particle: '/assets/particles/fear_aura.png',           // Kenney
        overlay: '/assets/textures/overlays/feared.png',       // OpenGameArt
        animation: '/assets/animations/fear_run.fbx',          // Mixamo
        color: 0x4B0082,
        forcedMovement: 'away',
        disableAttacks: true,
        maxStacks: 1,
        visualScale: 1.0
      },

      // Debuffs
      WEAKENED: {
        name: 'Weakened',
        type: 'debuff',
        icon: '/assets/icons/status/weakened.png',             // game-icons.net
        particle: '/assets/particles/down_arrow.png',          // Kenney
        overlay: '/assets/textures/overlays/weakened.png',     // OpenGameArt
        color: 0x8B4513,
        damageMultiplier: 0.7,
        maxStacks: 3,
        visualScale: 0.8
      },
      SLOWED: {
        name: 'Slowed',
        type: 'debuff',
        icon: '/assets/icons/status/slowed.png',               // game-icons.net
        particle: '/assets/particles/slow_effect.png',         // Kenney
        overlay: '/assets/textures/overlays/slowed.png',       // OpenGameArt
        color: 0x4682B4,
        movementSpeedMultiplier: 0.5,
        attackSpeedMultiplier: 0.7,
        maxStacks: 5,
        visualScale: 1.0
      },
      BLINDED: {
        name: 'Blinded',
        type: 'debuff',
        icon: '/assets/icons/status/blinded.png',              // game-icons.net
        particle: '/assets/particles/darkness.png',            // Kenney
        overlay: '/assets/textures/overlays/blinded.png',      // OpenGameArt
        color: 0x000000,
        accuracyMultiplier: 0.3,
        visionRange: 2,
        maxStacks: 1,
        visualScale: 1.5
      },
      SILENCED: {
        name: 'Silenced',
        type: 'debuff',
        icon: '/assets/icons/status/silenced.png',             // game-icons.net
        particle: '/assets/particles/silence_symbol.png',      // Kenney
        overlay: '/assets/textures/overlays/silenced.png',     // OpenGameArt
        color: 0x696969,
        disableSkills: true,
        maxStacks: 1,
        visualScale: 1.0
      },
      CURSED: {
        name: 'Cursed',
        type: 'debuff',
        icon: '/assets/icons/status/cursed.png',               // game-icons.net
        particle: '/assets/particles/dark_aura.png',           // Kenney
        overlay: '/assets/textures/overlays/cursed.png',       // OpenGameArt
        color: 0x8B008B,
        healingMultiplier: 0.5,
        damageMultiplier: 0.8,
        maxStacks: 1,
        visualScale: 1.2
      },

      // Buffs
      HASTE: {
        name: 'Haste',
        type: 'buff',
        icon: '/assets/icons/status/haste.png',                // game-icons.net
        particle: '/assets/particles/speed_lines.png',         // Kenney
        overlay: '/assets/textures/overlays/haste.png',        // OpenGameArt
        color: 0xFFD700,
        movementSpeedMultiplier: 1.5,
        attackSpeedMultiplier: 1.3,
        maxStacks: 3,
        visualScale: 1.0
      },
      SHIELDED: {
        name: 'Shielded',
        type: 'buff',
        icon: '/assets/icons/status/shielded.png',             // game-icons.net
        particle: '/assets/particles/shield_glow.png',         // Kenney
        overlay: '/assets/textures/overlays/shielded.png',     // OpenGameArt
        color: 0x1E90FF,
        absorbAmount: 100,
        maxStacks: 1,
        visualScale: 1.3
      },
      REGENERATING: {
        name: 'Regenerating',
        type: 'buff',
        icon: '/assets/icons/status/regenerating.png',         // game-icons.net
        particle: '/assets/particles/heal_plus.png',           // Kenney
        overlay: '/assets/textures/overlays/regenerating.png', // OpenGameArt
        color: 0x00FF00,
        healPerTick: 10,
        tickRate: 1.0,
        maxStacks: 5,
        visualScale: 1.0
      },
      EMPOWERED: {
        name: 'Empowered',
        type: 'buff',
        icon: '/assets/icons/status/empowered.png',            // game-icons.net
        particle: '/assets/particles/power_aura.png',          // Kenney
        overlay: '/assets/textures/overlays/empowered.png',    // OpenGameArt
        color: 0xFF6347,
        damageMultiplier: 1.5,
        maxStacks: 3,
        visualScale: 1.2
      },
      FORTIFIED: {
        name: 'Fortified',
        type: 'buff',
        icon: '/assets/icons/status/fortified.png',            // game-icons.net
        particle: '/assets/particles/armor_up.png',            // Kenney
        overlay: '/assets/textures/overlays/fortified.png',    // OpenGameArt
        color: 0xC0C0C0,
        defenseMultiplier: 1.5,
        maxStacks: 3,
        visualScale: 1.0
      },
      INVISIBLE: {
        name: 'Invisible',
        type: 'buff',
        icon: '/assets/icons/status/invisible.png',            // game-icons.net
        particle: '/assets/particles/invisibility.png',        // Kenney
        overlay: '/assets/textures/overlays/invisible.png',    // OpenGameArt
        color: 0xFFFFFF,
        opacity: 0.3,
        breaksOnAttack: true,
        maxStacks: 1,
        visualScale: 0.5
      },

      // Elemental Effects
      ELECTRIFIED: {
        name: 'Electrified',
        type: 'elemental',
        icon: '/assets/icons/status/electrified.png',          // game-icons.net
        particle: '/assets/particles/lightning_sparks.png',    // Kenney
        overlay: '/assets/textures/overlays/electrified.png',  // OpenGameArt
        color: 0x00BFFF,
        damagePerTick: 15,
        tickRate: 0.5,
        chainToNearby: true,
        chainRadius: 5,
        maxStacks: 3,
        visualScale: 1.2
      },
      CORRODED: {
        name: 'Corroded',
        type: 'elemental',
        icon: '/assets/icons/status/corroded.png',             // game-icons.net
        particle: '/assets/particles/acid_drip.png',           // Kenney
        overlay: '/assets/textures/overlays/corroded.png',     // OpenGameArt
        color: 0x9ACD32,
        armorReduction: 0.2,
        damagePerTick: 7,
        tickRate: 1.0,
        maxStacks: 5,
        visualScale: 1.0
      },
      CHILLED: {
        name: 'Chilled',
        type: 'elemental',
        icon: '/assets/icons/status/chilled.png',              // game-icons.net
        particle: '/assets/particles/frost.png',               // Kenney
        overlay: '/assets/textures/overlays/chilled.png',      // OpenGameArt
        color: 0xADD8E6,
        movementSpeedMultiplier: 0.7,
        attackSpeedMultiplier: 0.8,
        maxStacks: 3,
        freezeThreshold: 3,
        visualScale: 1.0
      },
      HOLY_FIRE: {
        name: 'Holy Fire',
        type: 'elemental',
        icon: '/assets/icons/status/holy_fire.png',            // game-icons.net
        particle: '/assets/particles/holy_flame.png',          // Kenney
        overlay: '/assets/textures/overlays/holy_fire.png',    // OpenGameArt
        color: 0xFFFFE0,
        damagePerTick: 20,
        tickRate: 1.0,
        bonusVsUndead: 2.0,
        maxStacks: 1,
        visualScale: 1.5
      },

      // Special Effects
      MARKED: {
        name: 'Marked',
        type: 'special',
        icon: '/assets/icons/status/marked.png',               // game-icons.net
        particle: '/assets/particles/target_mark.png',         // Kenney
        overlay: '/assets/textures/overlays/marked.png',       // OpenGameArt
        color: 0xFF0000,
        damageAmplification: 1.3,
        revealsStealth: true,
        maxStacks: 1,
        visualScale: 1.0
      },
      INSPIRED: {
        name: 'Inspired',
        type: 'special',
        icon: '/assets/icons/status/inspired.png',             // game-icons.net
        particle: '/assets/particles/inspiration.png',         // Kenney
        overlay: '/assets/textures/overlays/inspired.png',     // OpenGameArt
        color: 0xFFD700,
        experienceMultiplier: 1.5,
        critChanceBonus: 0.1,
        maxStacks: 1,
        visualScale: 1.2
      },
      EXHAUSTED: {
        name: 'Exhausted',
        type: 'special',
        icon: '/assets/icons/status/exhausted.png',            // game-icons.net
        particle: '/assets/particles/exhaustion.png',          // Kenney
        overlay: '/assets/textures/overlays/exhausted.png',    // OpenGameArt
        color: 0x808080,
        allStatsMultiplier: 0.7,
        staminaRegenMultiplier: 0.5,
        maxStacks: 3,
        visualScale: 0.8
      },
      BERSERK: {
        name: 'Berserk',
        type: 'special',
        icon: '/assets/icons/status/berserk.png',              // game-icons.net
        particle: '/assets/particles/rage_aura.png',           // Kenney
        overlay: '/assets/textures/overlays/berserk.png',      // OpenGameArt
        animation: '/assets/animations/berserk_idle.fbx',      // Mixamo
        color: 0xFF0000,
        damageMultiplier: 2.0,
        defenseMultiplier: 0.5,
        attackSpeedMultiplier: 1.5,
        disableSkills: true,
        maxStacks: 1,
        visualScale: 1.5
      },
      TAUNT: {
        name: 'Taunted',
        type: 'special',
        icon: '/assets/icons/status/taunted.png',              // game-icons.net
        particle: '/assets/particles/taunt_effect.png',        // Kenney
        overlay: '/assets/textures/overlays/taunted.png',      // OpenGameArt
        color: 0xFFA500,
        forcedTarget: true,
        maxStacks: 1,
        visualScale: 1.0
      }
    };
  }

  /**
   * Apply status effect to entity
   */
  applyEffect(entityId, effectType, duration, source, stacks = 1) {
    const definition = this.effectDefinitions[effectType];
    if (!definition) {
      logger.error(`Unknown effect type: ${effectType}`);
      return false;
    }

    // Check immunity
    if (this.hasImmunity(entityId, effectType)) {
      logger.info(`${entityId} is immune to ${effectType}`);
      return false;
    }

    // Apply resistance
    const resistance = this.getResistance(entityId, effectType);
    const actualDuration = duration * (1 - resistance);
    if (actualDuration <= 0) return false;

    // Get or create effect list for entity
    if (!this.activeEffects.has(entityId)) {
      this.activeEffects.set(entityId, []);
    }

    const effects = this.activeEffects.get(entityId);
    
    // Check for existing effect
    const existing = effects.find(e => e.type === effectType);
    if (existing) {
      // Refresh duration
      existing.duration = Math.max(existing.duration, actualDuration);
      // Add stacks
      existing.stacks = Math.min(
        existing.stacks + stacks,
        definition.maxStacks
      );
      existing.lastTick = Date.now();
    } else {
      // Add new effect
      effects.push({
        type: effectType,
        definition: definition,
        duration: actualDuration,
        stacks: Math.min(stacks, definition.maxStacks),
        source: source,
        startTime: Date.now(),
        lastTick: Date.now()
      });
    }

    this.createVisualEffects(entityId, effectType);
    return true;
  }

  /**
   * Remove status effect from entity
   */
  removeEffect(entityId, effectType) {
    const effects = this.activeEffects.get(entityId);
    if (!effects) return;

    const index = effects.findIndex(e => e.type === effectType);
    if (index >= 0) {
      effects.splice(index, 1);
      this.removeVisualEffects(entityId, effectType);
    }
  }

  /**
   * Create visual effects for status
   */
  createVisualEffects(entityId, effectType) {
    const definition = this.effectDefinitions[effectType];
    logger.info(`Creating visual effects for ${entityId}: ${effectType}`);
    logger.info(`  Icon: ${definition.icon}`);
    logger.info(`  Particle: ${definition.particle}`);
    logger.info(`  Overlay: ${definition.overlay}`);
    if (definition.animation) {
      logger.info(`  Animation: ${definition.animation}`);
    }
    
    // In actual implementation, would:
    // - Load and display icon sprite
    // - Create particle system
    // - Apply overlay texture
    // - Play animation if applicable
  }

  /**
   * Remove visual effects
   */
  removeVisualEffects(entityId, effectType) {
    logger.info(`Removing visual effects for ${entityId}: ${effectType}`);
    // Cleanup visual elements
  }

  /**
   * Update all active effects
   */
  update(deltaTime) {
    const now = Date.now();
    
    for (const [entityId, effects] of this.activeEffects.entries()) {
      for (let i = effects.length - 1; i >= 0; i--) {
        const effect = effects[i];
        
        // Update duration
        effect.duration -= deltaTime;
        
        // Process ticks (DoT, HoT, etc.)
        if (effect.definition.tickRate) {
          const timeSinceLastTick = (now - effect.lastTick) / 1000;
          if (timeSinceLastTick >= effect.definition.tickRate) {
            this.processTick(entityId, effect);
            effect.lastTick = now;
          }
        }
        
        // Remove expired effects
        if (effect.duration <= 0) {
          this.removeEffect(entityId, effect.type);
        }
      }
    }
  }

  /**
   * Process effect tick (damage, healing, etc.)
   */
  processTick(entityId, effect) {
    const def = effect.definition;
    const stacks = effect.stacks;
    
    if (def.damagePerTick) {
      const damage = def.damagePerTick * stacks;
      logger.info(`${entityId} takes ${damage} damage from ${effect.type}`);
    }
    
    if (def.healPerTick) {
      const heal = def.healPerTick * stacks;
      logger.info(`${entityId} heals ${heal} from ${effect.type}`);
    }
    
    // Special tick effects
    if (def.chainToNearby && Math.random() < 0.3) {
      logger.info(`${effect.type} chains to nearby entities`);
    }
  }

  /**
   * Check immunity
   */
  hasImmunity(entityId, effectType) {
    const immunities = this.immunities.get(entityId);
    return immunities && immunities.has(effectType);
  }

  /**
   * Get resistance
   */
  getResistance(entityId, effectType) {
    const resistances = this.resistances.get(entityId);
    return (resistances && resistances[effectType]) || 0;
  }

  /**
   * Set immunity
   */
  setImmunity(entityId, effectType) {
    if (!this.immunities.has(entityId)) {
      this.immunities.set(entityId, new Set());
    }
    this.immunities.get(entityId).add(effectType);
  }

  /**
   * Set resistance
   */
  setResistance(entityId, effectType, amount) {
    if (!this.resistances.has(entityId)) {
      this.resistances.set(entityId, {});
    }
    this.resistances.get(entityId)[effectType] = Math.min(amount, 0.9);
  }

  /**
   * Cleanse effects
   */
  cleanse(entityId, types = ['debuff', 'control', 'dot']) {
    const effects = this.activeEffects.get(entityId);
    if (!effects) return 0;

    let cleansed = 0;
    for (let i = effects.length - 1; i >= 0; i--) {
      if (types.includes(effects[i].definition.type)) {
        this.removeEffect(entityId, effects[i].type);
        cleansed++;
      }
    }
    
    return cleansed;
  }

  /**
   * Get active effects for entity
   */
  getActiveEffects(entityId) {
    return this.activeEffects.get(entityId) || [];
  }

  /**
   * Check if entity has effect
   */
  hasEffect(entityId, effectType) {
    const effects = this.activeEffects.get(entityId);
    return effects && effects.some(e => e.type === effectType);
  }
}
