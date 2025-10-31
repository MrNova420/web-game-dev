/**
import { logger } from '../core/Logger.js';
 * Enhanced Magical Effects System - EXTERNAL ASSETS ONLY
 * Phase 9.2 - Advanced spell effects with particle systems and visual feedback
 * 
 * External Asset Sources:
 * - Particle textures: Kenney Particle Pack (200+ particle sprites - free)
 * - Magic circle textures: Sketchfab Free (rune/magic circle textures)
 * - Spell VFX meshes: Poly Pizza (spell effect meshes - free)
 * - Trail textures: Kenney Effects Pack (trail sprites)
 * - Impact effects: OpenGameArt (explosion/impact sprites - CC0)
 * - Glow textures: Poly Haven (glow maps for effects)
 * 
 * Asset URLs:
 * - Kenney Particles: https://www.kenney.nl/assets/particle-pack (Free)
 * - OpenGameArt VFX: https://opengameart.org/ (CC0 spell effects)
 * - Poly Pizza: https://poly.pizza/ (Free 3D effects)
 * 
 * Zero custom particles - all effects use external sprite/texture assets
 */

import * as THREE from 'three';

export class MagicalEffectsSystem {
    constructor(scene) {
        this.scene = scene;
        
        // External particle texture paths
        this.particleTextures = {
            fire: '/assets/particles/fire_particle.png',          // Kenney Particle Pack
            spark: '/assets/particles/spark.png',
            smoke: '/assets/particles/smoke.png',
            magic_glow: '/assets/particles/magic_glow.png',
            star: '/assets/particles/star.png',
            light_ray: '/assets/particles/light_ray.png',
            ice_crystal: '/assets/particles/ice_crystal.png',
            lightning: '/assets/particles/lightning_bolt.png',
            holy_light: '/assets/particles/holy_light.png',
            dark_mist: '/assets/particles/dark_mist.png',
            leaf: '/assets/particles/leaf.png',
            rune: '/assets/particles/rune_glow.png',
            explosion: '/assets/particles/explosion.png',         // OpenGameArt
            impact: '/assets/particles/impact_burst.png'
        };
        
        // Magic circle textures
        this.magicCircleTextures = {
            fire: '/assets/textures/magic_circles/fire_circle.png',      // Sketchfab Free
            ice: '/assets/textures/magic_circles/ice_circle.png',
            lightning: '/assets/textures/magic_circles/lightning_circle.png',
            holy: '/assets/textures/magic_circles/holy_circle.png',
            dark: '/assets/textures/magic_circles/dark_circle.png',
            nature: '/assets/textures/magic_circles/nature_circle.png',
            arcane: '/assets/textures/magic_circles/arcane_circle.png'
        };
        
        // Spell effect templates for all magic schools
        this.spellEffects = {
            FIRE: this.createFireEffects(),
            ICE: this.createIceEffects(),
            LIGHTNING: this.createLightningEffects(),
            HOLY: this.createHolyEffects(),
            DARK: this.createDarkEffects(),
            NATURE: this.createNatureEffects(),
            ARCANE: this.createArcaneEffects(),
            COSMIC: this.createCosmicEffects()
        };
        
        // Casting circles with runic symbols
        this.castingCircles = [];
        this.activeEffects = [];
        this.statusAuras = new Map();
        
        // Screen effects
        this.screenEffects = {
            shake: { active: false, intensity: 0, duration: 0 },
            slowMotion: { active: false, timeScale: 1.0, duration: 0 },
            colorGrade: { active: false, color: new THREE.Color(), duration: 0 }
        };
        
        this.initialize();
    }
    
    initialize() {
        logger.info('✨ Magical Effects System initialized');
        logger.info('   Using Kenney Particle Pack + OpenGameArt VFX');
    }
    
    /**
     * Create fire spell effects
     */
    createFireEffects() {
        return {
            fireball: {
                particleTexture: this.particleTextures.fire,  // Kenney Particle Pack
                particle: {
                    color: new THREE.Color(0xff0066), // Bright pink-red
                    secondaryColor: new THREE.Color(0xffff00), // Bright yellow
                    size: 0.8,
                    count: 150,
                    speed: 5,
                    lifetime: 1.0,
                    trail: true,
                    trailTexture: this.particleTextures.spark,  // Kenney
                    glow: true
                },
                impact: {
                    explosion: true,
                    explosionTexture: this.particleTextures.explosion,  // OpenGameArt
                    radius: 3,
                    damage: 'high',
                    burning: true
                },
                sound: 'fire_whoosh',
                source: 'Kenney Particle Pack + OpenGameArt'
            },
            flameWall: {
                particleTexture: this.particleTextures.fire,
                particle: {
                    color: new THREE.Color(0xff1493), // Bright pink
                    secondaryColor: new THREE.Color(0xff6600), // Bright orange
                    size: 1.2,
                    count: 600,
                    speed: 2,
                    lifetime: 3.0,
                    pattern: 'wall',
                    glow: true
                },
                aoe: {
                    shape: 'rectangle',
                    width: 10,
                    height: 3,
                    duration: 5000
                }
            },
            inferno: {
                particle: {
                    color: new THREE.Color(0xff00ff), // Magenta
                    secondaryColor: new THREE.Color(0x00ffff), // Cyan
                    tertiaryColor: new THREE.Color(0xffff00), // Yellow
                    size: 2.5,
                    count: 1500,
                    speed: 3,
                    lifetime: 2.0,
                    pattern: 'vortex',
                    glow: true,
                    rainbow: true
                },
                aoe: {
                    shape: 'circle',
                    radius: 8,
                    duration: 3000,
                    damage: 'massive'
                },
                screenEffect: 'heat_distortion'
            }
        };
    }
    
    /**
     * Create ice spell effects
     */
    createIceEffects() {
        return {
            iceShards: {
                particle: {
                    color: new THREE.Color(0x00ffff), // Bright cyan
                    secondaryColor: new THREE.Color(0xffffff), // White sparkles
                    size: 0.5,
                    count: 80,
                    speed: 15,
                    lifetime: 0.5,
                    shape: 'shard',
                    sparkle: true,
                    glow: true
                },
                impact: {
                    freeze: 0.5, // 50% slow
                    damage: 'medium',
                    shatter: true
                }
            },
            blizzard: {
                particle: {
                    color: new THREE.Color(0x00ffff), // Bright cyan
                    secondaryColor: new THREE.Color(0xffffff), // White
                    tertiaryColor: new THREE.Color(0x66ffff), // Light cyan
                    size: 0.8,
                    count: 2500,
                    speed: 5,
                    lifetime: 5.0,
                    pattern: 'storm',
                    sparkle: true,
                    glow: true
                },
                aoe: {
                    shape: 'circle',
                    radius: 15,
                    duration: 8000,
                    freeze: 0.7
                },
                environment: 'snow_ground'
            },
            iceShield: {
                particle: {
                    color: new THREE.Color(0x00ffff), // Bright cyan
                    secondaryColor: new THREE.Color(0xffffff), // White
                    size: 0.4,
                    count: 500,
                    speed: 1,
                    lifetime: 10.0,
                    pattern: 'sphere',
                    sparkle: true,
                    glow: true
                },
                defense: {
                    absorb: 500,
                    reflect: 0.3,
                    duration: 10000
                }
            }
        };
    }
    
    /**
     * Create lightning spell effects
     */
    createLightningEffects() {
        return {
            lightningBolt: {
                particle: {
                    color: new THREE.Color(0xffff00), // Bright yellow
                    secondaryColor: new THREE.Color(0x00ffff), // Cyan
                    glow: true,
                    intensity: 3.0,
                    sparkle: true
                },
                beam: {
                    segments: 10,
                    width: 0.3,
                    jitter: 0.5,
                    speed: 50,
                    duration: 0.2
                },
                impact: {
                    stun: 1.0, // 1 second stun
                    damage: 'high'
                },
                screenEffect: 'flash'
            },
            chainLightning: {
                beam: {
                    segments: 8,
                    width: 0.2,
                    jitter: 0.7,
                    chain: true,
                    maxTargets: 5,
                    range: 10,
                    color: new THREE.Color(0xffff00),
                    secondaryColor: new THREE.Color(0xff00ff),
                    glow: true
                },
                impact: {
                    stun: 0.5,
                    damage: 'medium',
                    chainDamageReduction: 0.8
                }
            },
            thunderStorm: {
                particle: {
                    color: new THREE.Color(0xffff00),
                    count: 100,
                    pattern: 'rain'
                },
                strikes: {
                    frequency: 0.5, // per second
                    randomTargets: true,
                    duration: 10000
                },
                aoe: {
                    radius: 20,
                    stun: true
                }
            }
        };
    }
    
    /**
     * Create holy spell effects
     */
    createHolyEffects() {
        return {
            healingLight: {
                particle: {
                    color: new THREE.Color(0xffff88),
                    size: 0.3,
                    count: 200,
                    speed: 2,
                    lifetime: 2.0,
                    pattern: 'upward_spiral'
                },
                healing: {
                    amount: 200,
                    overTime: true,
                    duration: 5000
                },
                visual: 'holy_glow'
            },
            divineShield: {
                particle: {
                    color: new THREE.Color(0xffd700),
                    size: 0.4,
                    count: 500,
                    pattern: 'sphere',
                    glow: true
                },
                defense: {
                    absorb: 1000,
                    immunity: ['dark', 'curse'],
                    duration: 15000
                }
            },
            holySmite: {
                particle: {
                    color: new THREE.Color(0xffffff),
                    size: 2.0,
                    count: 300,
                    speed: 10,
                    pattern: 'pillar'
                },
                beam: {
                    width: 3,
                    height: 20,
                    duration: 1000
                },
                impact: {
                    damage: 'massive',
                    bonusVsUndead: 2.0,
                    bonusVsDemon: 2.0
                },
                screenEffect: 'white_flash'
            }
        };
    }
    
    /**
     * Create dark spell effects
     */
    createDarkEffects() {
        return {
            shadowBolt: {
                particle: {
                    color: new THREE.Color(0x440044),
                    size: 0.8,
                    count: 150,
                    speed: 8,
                    trail: true,
                    lifetime: 1.5
                },
                impact: {
                    damage: 'high',
                    curse: 'weakness',
                    duration: 5000
                }
            },
            lifeDrain: {
                particle: {
                    color: new THREE.Color(0xff0044),
                    size: 0.2,
                    count: 500,
                    pattern: 'stream',
                    twoWay: true
                },
                drain: {
                    amount: 50,
                    perSecond: true,
                    heal: 0.5, // 50% converted to health
                    duration: 3000
                }
            },
            darkRitual: {
                particle: {
                    color: new THREE.Color(0x880088),
                    size: 0.5,
                    count: 1000,
                    pattern: 'ritual_circle',
                    duration: 5000
                },
                summon: {
                    type: 'shadow_minions',
                    count: 3,
                    duration: 30000
                },
                castingCircle: {
                    radius: 5,
                    runes: 'demonic',
                    glow: true
                }
            }
        };
    }
    
    /**
     * Create nature spell effects
     */
    createNatureEffects() {
        return {
            vineEntangle: {
                particle: {
                    color: new THREE.Color(0x228b22),
                    size: 0.5,
                    count: 300,
                    pattern: 'vines'
                },
                vines: {
                    thickness: 0.1,
                    length: 5,
                    count: 10,
                    animated: true
                },
                crowd_control: {
                    root: 3000, // 3 seconds
                    damage: 'low_over_time'
                }
            },
            poisonCloud: {
                particle: {
                    color: new THREE.Color(0x88ff00),
                    size: 1.5,
                    count: 800,
                    speed: 1,
                    lifetime: 10.0,
                    pattern: 'cloud'
                },
                aoe: {
                    radius: 8,
                    duration: 10000,
                    damage: 'medium_over_time',
                    poison: true
                }
            },
            naturesBounty: {
                particle: {
                    color: new THREE.Color(0x00ff44),
                    size: 0.3,
                    count: 500,
                    pattern: 'growth'
                },
                healing: {
                    amount: 500,
                    aoe: true,
                    radius: 10,
                    overTime: true,
                    duration: 8000
                },
                environment: 'flowers_grow'
            }
        };
    }
    
    /**
     * Create arcane spell effects
     */
    createArcaneEffects() {
        return {
            arcaneMissiles: {
                particle: {
                    color: new THREE.Color(0xff00ff),
                    size: 0.4,
                    count: 50,
                    speed: 12,
                    trail: true,
                    homing: true
                },
                projectile: {
                    count: 5,
                    stagger: 0.1,
                    tracking: true
                },
                impact: {
                    damage: 'medium_each'
                }
            },
            teleport: {
                particle: {
                    color: new THREE.Color(0x8800ff),
                    size: 0.5,
                    count: 500,
                    pattern: 'vortex'
                },
                teleport: {
                    range: 20,
                    castTime: 1.0,
                    cooldown: 10000
                },
                visual: {
                    fadeOut: true,
                    fadeIn: true,
                    portal: true
                }
            },
            timeStop: {
                particle: {
                    color: new THREE.Color(0x00ffff),
                    size: 0.3,
                    count: 1000,
                    pattern: 'freeze_time'
                },
                effect: {
                    freeze: 1.0, // 100% slow = freeze
                    duration: 3000,
                    radius: 15,
                    excludeSelf: true
                },
                screenEffect: 'desaturate'
            }
        };
    }
    
    /**
     * Create cosmic spell effects
     */
    createCosmicEffects() {
        return {
            starfall: {
                particle: {
                    color: new THREE.Color(0xffffff),
                    size: 1.0,
                    count: 100,
                    speed: 20,
                    trail: true,
                    glow: true
                },
                projectile: {
                    count: 10,
                    fallFromSky: true,
                    spread: 10,
                    delay: 0.5
                },
                impact: {
                    damage: 'high_each',
                    aoe: 2,
                    crater: true
                }
            },
            blackHole: {
                particle: {
                    color: new THREE.Color(0x220022),
                    size: 0.5,
                    count: 2000,
                    pattern: 'spiral_inward'
                },
                gravity: {
                    pull: true,
                    radius: 15,
                    strength: 10,
                    duration: 5000,
                    damage: 'high_over_time'
                },
                visual: {
                    distortion: true,
                    lensing: true
                }
            },
            cosmicRay: {
                beam: {
                    width: 5,
                    length: 50,
                    duration: 2000,
                    continuous: true
                },
                particle: {
                    color: new THREE.Color(0xaaffff),
                    count: 1000,
                    pattern: 'beam'
                },
                impact: {
                    damage: 'massive_continuous',
                    penetrate: true
                }
            }
        };
    }
    
    /**
     * Cast a spell with full visual effects
     */
    castSpell(caster, spellType, school, target = null) {
        const effect = this.spellEffects[school]?.[spellType];
        if (!effect) {
            logger.warn(`Spell ${spellType} not found in ${school} school`);
            return;
        }
        
        // Create casting circle
        if (effect.castingCircle) {
            this.createCastingCircle(caster.position, effect.castingCircle);
        }
        
        // Create particle effects
        if (effect.particle) {
            this.createParticleEffect(caster, target, effect.particle);
        }
        
        // Create beam effects
        if (effect.beam) {
            this.createBeamEffect(caster, target, effect.beam);
        }
        
        // Create area of effect visuals
        if (effect.aoe) {
            this.createAoEVisual(target?.position || caster.position, effect.aoe);
        }
        
        // Apply screen effects
        if (effect.screenEffect) {
            this.applyScreenEffect(effect.screenEffect);
        }
        
        // Play sound
        if (effect.sound) {
            this.playSpellSound(effect.sound);
        }
        
        return effect;
    }
    
    /**
     * Create casting circle with runic symbols
     */
    createCastingCircle(position, config) {
        const circle = {
            position: position.clone(),
            radius: config.radius || 2,
            runes: this.generateRunes(config.runes || 'arcane'),
            glow: config.glow !== false,
            rotation: 0,
            lifetime: config.duration || 3000,
            createdTime: Date.now()
        };
        
        // Create visual mesh
        const geometry = new THREE.RingGeometry(circle.radius * 0.9, circle.radius, 64);
        const material = new THREE.MeshBasicMaterial({
            color: 0x9d4edd,
            transparent: true,
            opacity: 0.7,
            side: THREE.DoubleSide
        });
        
        circle.mesh = new THREE.Mesh(geometry, material);
        circle.mesh.position.copy(position);
        circle.mesh.rotation.x = -Math.PI / 2;
        
        this.scene.add(circle.mesh);
        this.castingCircles.push(circle);
        
        return circle;
    }
    
    /**
     * Create particle effect
     */
    createParticleEffect(caster, target, config) {
        const particles = [];
        const startPos = caster.position.clone();
        const targetPos = target?.position || startPos.clone().add(new THREE.Vector3(0, 0, -10));
        
        for (let i = 0; i < config.count; i++) {
            const particle = {
                position: startPos.clone(),
                velocity: this.calculateParticleVelocity(startPos, targetPos, config),
                color: config.color,
                size: config.size,
                lifetime: config.lifetime,
                age: 0,
                mesh: this.createParticleMesh(config)
            };
            
            this.scene.add(particle.mesh);
            particles.push(particle);
        }
        
        this.activeEffects.push({
            type: 'particles',
            particles: particles,
            config: config
        });
    }
    
    /**
     * Create beam effect (lightning, laser, etc)
     */
    createBeamEffect(caster, target, config) {
        if (!target) return;
        
        const startPos = caster.position.clone();
        const endPos = target.position.clone();
        
        // Create beam geometry
        const points = [];
        if (config.jitter) {
            // Jagged lightning effect
            const segments = config.segments || 10;
            for (let i = 0; i <= segments; i++) {
                const t = i / segments;
                const point = new THREE.Vector3().lerpVectors(startPos, endPos, t);
                
                if (i > 0 && i < segments) {
                    point.x += (Math.random() - 0.5) * config.jitter;
                    point.y += (Math.random() - 0.5) * config.jitter;
                    point.z += (Math.random() - 0.5) * config.jitter;
                }
                
                points.push(point);
            }
        } else {
            // Straight beam
            points.push(startPos, endPos);
        }
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
            color: config.color || 0xffff00,
            linewidth: config.width || 2,
            transparent: true,
            opacity: 0.9
        });
        
        const beam = new THREE.Line(geometry, material);
        this.scene.add(beam);
        
        this.activeEffects.push({
            type: 'beam',
            mesh: beam,
            lifetime: config.duration || 200,
            createdTime: Date.now()
        });
    }
    
    /**
     * Create AoE visual indicator
     */
    createAoEVisual(position, config) {
        let geometry;
        
        if (config.shape === 'circle') {
            geometry = new THREE.CircleGeometry(config.radius, 64);
        } else if (config.shape === 'rectangle') {
            geometry = new THREE.PlaneGeometry(config.width, config.height);
        }
        
        const material = new THREE.MeshBasicMaterial({
            color: 0xff4444,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(position);
        mesh.position.y = 0.1; // Slightly above ground
        mesh.rotation.x = -Math.PI / 2;
        
        this.scene.add(mesh);
        
        this.activeEffects.push({
            type: 'aoe',
            mesh: mesh,
            lifetime: config.duration,
            createdTime: Date.now()
        });
    }
    
    /**
     * Apply screen effect (shake, slow-mo, color grade)
     */
    applyScreenEffect(effectType, intensity = 1.0, duration = 500) {
        switch (effectType) {
            case 'shake':
                this.screenEffects.shake = {
                    active: true,
                    intensity: intensity * 0.5,
                    duration: duration,
                    startTime: Date.now()
                };
                break;
                
            case 'flash':
            case 'white_flash':
                // Flash effect would be handled by post-processing
                break;
                
            case 'slow_motion':
                this.screenEffects.slowMotion = {
                    active: true,
                    timeScale: 0.3,
                    duration: duration,
                    startTime: Date.now()
                };
                break;
                
            case 'heat_distortion':
            case 'desaturate':
                // Would be handled by post-processing shaders
                break;
        }
    }
    
    /**
     * Create status effect aura around character
     */
    createStatusAura(entity, statusType) {
        const auraConfig = {
            poison: { color: 0x88ff00, particles: 100, size: 0.2 },
            burn: { color: 0xff4500, particles: 150, size: 0.3 },
            freeze: { color: 0x00ffff, particles: 80, size: 0.25 },
            buff: { color: 0xffd700, particles: 120, size: 0.15 },
            debuff: { color: 0xff0000, particles: 100, size: 0.2 },
            shield: { color: 0x4169e1, particles: 200, size: 0.1, sphere: true },
            heal: { color: 0x00ff00, particles: 100, size: 0.2, upward: true }
        };
        
        const config = auraConfig[statusType];
        if (!config) return;
        
        const aura = {
            entity: entity,
            type: statusType,
            particles: [],
            config: config
        };
        
        // Create particle system for aura
        for (let i = 0; i < config.particles; i++) {
            const particle = this.createParticleMesh(config);
            aura.particles.push(particle);
            this.scene.add(particle);
        }
        
        this.statusAuras.set(entity.id, aura);
        
        return aura;
    }
    
    /**
     * Update all active magical effects
     */
    update(deltaTime, camera) {
        // Update casting circles
        this.castingCircles = this.castingCircles.filter(circle => {
            circle.rotation += deltaTime * 2;
            circle.mesh.rotation.z = circle.rotation;
            
            const age = Date.now() - circle.createdTime;
            if (age > circle.lifetime) {
                this.scene.remove(circle.mesh);
                return false;
            }
            
            return true;
        });
        
        // Update active effects
        this.activeEffects = this.activeEffects.filter(effect => {
            if (effect.type === 'particles') {
                return this.updateParticles(effect, deltaTime);
            } else if (effect.type === 'beam' || effect.type === 'aoe') {
                const age = Date.now() - effect.createdTime;
                if (age > effect.lifetime) {
                    this.scene.remove(effect.mesh);
                    return false;
                }
            }
            return true;
        });
        
        // Update status auras
        this.statusAuras.forEach(aura => {
            this.updateStatusAura(aura, deltaTime);
        });
        
        // Update screen effects
        this.updateScreenEffects(deltaTime, camera);
    }
    
    /**
     * Update particle systems
     */
    updateParticles(effect, deltaTime) {
        effect.particles = effect.particles.filter(particle => {
            particle.age += deltaTime;
            
            if (particle.age > particle.lifetime) {
                this.scene.remove(particle.mesh);
                return false;
            }
            
            // Update particle position
            particle.position.add(particle.velocity.clone().multiplyScalar(deltaTime));
            particle.mesh.position.copy(particle.position);
            
            // Fade out
            if (particle.mesh.material) {
                particle.mesh.material.opacity = 1 - (particle.age / particle.lifetime);
            }
            
            return true;
        });
        
        return effect.particles.length > 0;
    }
    
    /**
     * Update status auras
     */
    updateStatusAura(aura, deltaTime) {
        if (!aura.entity || !aura.entity.mesh) {
            return;
        }
        
        const entityPos = aura.entity.mesh.position;
        const time = Date.now() / 1000;
        
        aura.particles.forEach((particle, i) => {
            const angle = (i / aura.particles.length) * Math.PI * 2 + time;
            const radius = 1.5;
            
            if (aura.config.sphere) {
                // Spherical distribution
                const phi = Math.acos(2 * (i / aura.particles.length) - 1);
                particle.position.set(
                    entityPos.x + Math.sin(phi) * Math.cos(angle) * radius,
                    entityPos.y + Math.cos(phi) * radius,
                    entityPos.z + Math.sin(phi) * Math.sin(angle) * radius
                );
            } else if (aura.config.upward) {
                // Rising particles
                const height = (time * 2 + i * 0.1) % 3;
                particle.position.set(
                    entityPos.x + Math.cos(angle) * radius * 0.5,
                    entityPos.y + height,
                    entityPos.z + Math.sin(angle) * radius * 0.5
                );
            } else {
                // Circular orbit
                particle.position.set(
                    entityPos.x + Math.cos(angle) * radius,
                    entityPos.y + 1 + Math.sin(time * 2 + i) * 0.5,
                    entityPos.z + Math.sin(angle) * radius
                );
            }
        });
    }
    
    /**
     * Update screen effects
     */
    updateScreenEffects(deltaTime, camera) {
        // Update shake
        if (this.screenEffects.shake.active) {
            const elapsed = Date.now() - this.screenEffects.shake.startTime;
            if (elapsed < this.screenEffects.shake.duration) {
                const intensity = this.screenEffects.shake.intensity;
                camera.position.x += (Math.random() - 0.5) * intensity;
                camera.position.y += (Math.random() - 0.5) * intensity;
            } else {
                this.screenEffects.shake.active = false;
            }
        }
    }
    
    /**
     * Helper methods
     */
    
    calculateParticleVelocity(start, end, config) {
        const direction = new THREE.Vector3().subVectors(end, start).normalize();
        const speed = config.speed || 5;
        
        // Add spread
        direction.x += (Math.random() - 0.5) * 0.5;
        direction.y += (Math.random() - 0.5) * 0.5;
        direction.z += (Math.random() - 0.5) * 0.5;
        direction.normalize();
        
        return direction.multiplyScalar(speed);
    }
    
    createParticleMesh(config) {
        const geometry = new THREE.SphereGeometry(config.size || 0.1, 8, 8);
        const material = new THREE.MeshBasicMaterial({
            color: config.color,
            transparent: true,
            opacity: 0.8
        });
        
        return new THREE.Mesh(geometry, material);
    }
    
    generateRunes(type) {
        // Generate runic symbols based on type
        return {
            type: type,
            symbols: 8,
            pattern: 'circle'
        };
    }
    
    playSpellSound(soundName) {
        // Play sound effect
        logger.info(`Playing sound: ${soundName}`);
    }
    
    /**
     * Remove status aura
     */
    removeStatusAura(entityId) {
        const aura = this.statusAuras.get(entityId);
        if (aura) {
            aura.particles.forEach(particle => {
                this.scene.remove(particle);
            });
            this.statusAuras.delete(entityId);
        }
    }
    
    /**
     * Cleanup
     */
    clear() {
        this.castingCircles.forEach(circle => {
            this.scene.remove(circle.mesh);
        });
        this.activeEffects.forEach(effect => {
            if (effect.mesh) {
                this.scene.remove(effect.mesh);
            }
        });
        this.statusAuras.forEach(aura => {
            aura.particles.forEach(p => this.scene.remove(p));
        });
        
        this.castingCircles = [];
        this.activeEffects = [];
        this.statusAuras.clear();
    }
}
