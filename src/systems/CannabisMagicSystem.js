import * as THREE from 'three';
import { ModelLoader } from '../core/ModelLoader.js';

/**
 * Cannabis Magic System - Psychedelic Herb-Based Magic
 * Implements mystical cannabis cultivation and smoke wielding abilities
 * Uses real plant models from Stylized Nature MegaKit
 */
export class CannabisMagicSystem {
    constructor(scene, player, modelLoader) {
        this.scene = scene;
        this.player = player;
        this.modelLoader = modelLoader || new ModelLoader();
        
        // Mystical Herb Types
        this.herbTypes = {
            PURPLE_HAZE: {
                name: 'Purple Haze',
                color: 0x9d4edd,
                power: 10,
                effect: 'Psychedelic Vision',
                growTime: 60000, // 1 minute
                rarity: 'rare'
            },
            NORTHERN_LIGHTS: {
                name: 'Northern Lights',
                color: 0x10b981,
                power: 15,
                effect: 'Aurora Shield',
                growTime: 120000, // 2 minutes
                rarity: 'epic'
            },
            BLUE_DREAM: {
                name: 'Blue Dream',
                color: 0x3b82f6,
                power: 20,
                effect: 'Dream Walking',
                growTime: 180000, // 3 minutes
                rarity: 'legendary'
            },
            SOUR_DIESEL: {
                name: 'Sour Diesel',
                color: 0xeab308,
                power: 25,
                effect: 'Speed Burst',
                growTime: 240000, // 4 minutes
                rarity: 'mythical'
            },
            GIRL_SCOUT_COOKIES: {
                name: 'Girl Scout Cookies',
                color: 0xf97316,
                power: 30,
                effect: 'Cookie Shield',
                growTime: 300000, // 5 minutes
                rarity: 'mythical'
            },
            WHITE_WIDOW: {
                name: 'White Widow',
                color: 0xf0f0f0,
                power: 35,
                effect: 'Frost Nova',
                growTime: 360000, // 6 minutes
                rarity: 'divine'
            },
            GRANDDADDY_PURPLE: {
                name: 'Granddaddy Purple',
                color: 0x7c3aed,
                power: 40,
                effect: 'Gravity Well',
                growTime: 420000, // 7 minutes
                rarity: 'divine'
            },
            JACK_HERER: {
                name: 'Jack Herer',
                color: 0x059669,
                power: 45,
                effect: 'Nature\'s Wrath',
                growTime: 480000, // 8 minutes
                rarity: 'transcendent'
            },
            PINEAPPLE_EXPRESS: {
                name: 'Pineapple Express',
                color: 0xfbbf24,
                power: 50,
                effect: 'Tropical Storm',
                growTime: 540000, // 9 minutes
                rarity: 'transcendent'
            },
            GODLY_KUSH: {
                name: 'Godly Kush',
                color: 0xffd700,
                power: 100,
                effect: 'Divine Ascension',
                growTime: 600000, // 10 minutes
                rarity: 'omega'
            }
        };
        
        // Player's herb inventory
        this.herbInventory = new Map();
        
        // Growing herbs
        this.growingHerbs = [];
        
        // Active smoke effects
        this.activeSmokeEffects = [];
        
        // Smoke particles
        this.smokeParticles = [];
        
        // Cultivation plots
        this.cultivationPlots = [];
        this.maxPlots = 5;
        
        this.initialize();
    }
    
    initialize() {
        // Give player starter herbs
        this.herbInventory.set('PURPLE_HAZE', 3);
        
        // Create cultivation plots
        this.createCultivationPlots();
    }
    
    async createCultivationPlots() {
        // Load ground tile model from Building MegaKit for plots
        const plotModel = await this.modelLoader.load('/assets/models/buildings/Floor_UnevenBrick.gltf');
        
        for (let i = 0; i < this.maxPlots; i++) {
            const plot = {
                id: i,
                position: new THREE.Vector3(
                    this.player.position.x + (i - 2) * 5,
                    0,
                    this.player.position.z - 10
                ),
                herb: null,
                plantTime: null,
                growthStage: 0 // 0-4 (seed, sprout, growing, flowering, ready)
            };
            
            // Create visual representation using real ground tile model
            const plotMesh = plotModel ? plotModel.clone() : this.createFallbackPlot();
            plotMesh.position.copy(plot.position);
            plotMesh.scale.set(2, 1, 2);
            this.scene.add(plotMesh);
            
            plot.mesh = plotMesh;
            this.cultivationPlots.push(plot);
        }
    }
    
    createFallbackPlot() {
        const plotGeometry = new THREE.BoxGeometry(2, 0.2, 2);
        const plotMaterial = new THREE.MeshStandardMaterial({ color: 0x654321 });
        return new THREE.Mesh(plotGeometry, plotMaterial);
    }
    
    async plantHerb(plotId, herbType) {
        if (plotId >= this.cultivationPlots.length) return false;
        
        const plot = this.cultivationPlots[plotId];
        if (plot.herb) return false; // Plot already has herb
        
        const herbCount = this.herbInventory.get(herbType) || 0;
        if (herbCount <= 0) return false; // No herbs to plant
        
        // Plant the herb
        plot.herb = herbType;
        plot.plantTime = Date.now();
        plot.growthStage = 0;
        
        // Consume one herb seed
        this.herbInventory.set(herbType, herbCount - 1);
        
        // Load real plant model from Nature MegaKit
        const herb = this.herbTypes[herbType];
        const plantModels = [
            '/assets/models/nature/Plant_1.gltf',
            '/assets/models/nature/Plant_7.gltf',
            '/assets/models/nature/Plant_1_Big.gltf'
        ];
        const randomModel = plantModels[Math.floor(Math.random() * plantModels.length)];
        
        const plantMesh = await this.modelLoader.load(randomModel);
        
        if (plantMesh) {
            plantMesh.position.copy(plot.position);
            plantMesh.position.y = 0.5;
            plantMesh.scale.set(0.2, 0.2, 0.2); // Start small
            
            // Apply herb color tint to the model
            plantMesh.traverse((child) => {
                if (child.isMesh && child.material) {
                    child.material.emissive = new THREE.Color(herb.color);
                    child.material.emissiveIntensity = 0.3;
                }
            });
            
            this.scene.add(plantMesh);
            plot.plantMesh = plantMesh;
        } else {
            // Fallback to simple geometry if model fails
            const plantGeometry = new THREE.ConeGeometry(0.5, 2, 8);
            const plantMaterial = new THREE.MeshStandardMaterial({ 
                color: herb.color,
                emissive: herb.color,
                emissiveIntensity: 0.3
            });
            const fallbackMesh = new THREE.Mesh(plantGeometry, plantMaterial);
            fallbackMesh.position.copy(plot.position);
            fallbackMesh.position.y = 1;
            fallbackMesh.scale.set(0.2, 0.2, 0.2);
            this.scene.add(fallbackMesh);
            plot.plantMesh = fallbackMesh;
        }
        
        this.growingHerbs.push(plot);
        
        return true;
    }
    
    harvestHerb(plotId) {
        if (plotId >= this.cultivationPlots.length) return false;
        
        const plot = this.cultivationPlots[plotId];
        if (!plot.herb || plot.growthStage < 4) return false; // Not ready
        
        const herbType = plot.herb;
        const currentCount = this.herbInventory.get(herbType) || 0;
        this.herbInventory.set(herbType, currentCount + 3); // Harvest yields 3 herbs
        
        // Remove plant visual
        if (plot.plantMesh) {
            this.scene.remove(plot.plantMesh);
            plot.plantMesh = null;
        }
        
        // Clear plot
        plot.herb = null;
        plot.plantTime = null;
        plot.growthStage = 0;
        
        // Remove from growing list
        const index = this.growingHerbs.indexOf(plot);
        if (index > -1) {
            this.growingHerbs.splice(index, 1);
        }
        
        return true;
    }
    
    castSmokeAbility(herbType, targetPosition) {
        const herbCount = this.herbInventory.get(herbType) || 0;
        if (herbCount <= 0) return false;
        
        const herb = this.herbTypes[herbType];
        if (!herb) return false;
        
        // Consume herb
        this.herbInventory.set(herbType, herbCount - 1);
        
        // Create smoke effect
        this.createSmokeEffect(herb, targetPosition);
        
        // Apply effect based on herb type
        this.applyHerbEffect(herb, targetPosition);
        
        return true;
    }
    
    createSmokeEffect(herb, position) {
        // Create particle system for smoke
        const particleCount = 100;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = position.x + (Math.random() - 0.5) * 5;
            positions[i * 3 + 1] = position.y + Math.random() * 5;
            positions[i * 3 + 2] = position.z + (Math.random() - 0.5) * 5;
        }
        
        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            color: herb.color,
            size: 0.5,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        
        const particleSystem = new THREE.Points(particles, particleMaterial);
        this.scene.add(particleSystem);
        
        this.smokeParticles.push({
            system: particleSystem,
            life: 0,
            maxLife: 3000, // 3 seconds
            color: herb.color
        });
    }
    
    applyHerbEffect(herb, position) {
        const effect = {
            name: herb.effect,
            power: herb.power,
            position: position.clone(),
            duration: 5000, // 5 seconds
            startTime: Date.now(),
            color: herb.color
        };
        
        // Create effect visual
        const effectGeometry = new THREE.SphereGeometry(3, 16, 16);
        const effectMaterial = new THREE.MeshBasicMaterial({
            color: herb.color,
            transparent: true,
            opacity: 0.3,
            wireframe: true
        });
        const effectMesh = new THREE.Mesh(effectGeometry, effectMaterial);
        effectMesh.position.copy(position);
        this.scene.add(effectMesh);
        
        effect.mesh = effectMesh;
        this.activeSmokeEffects.push(effect);
    }
    
    update(deltaTime) {
        // Update growing herbs
        const currentTime = Date.now();
        
        for (const plot of this.growingHerbs) {
            if (!plot.herb || !plot.plantTime) continue;
            
            const herb = this.herbTypes[plot.herb];
            const elapsed = currentTime - plot.plantTime;
            const progress = elapsed / herb.growTime;
            
            // Update growth stage
            const newStage = Math.min(Math.floor(progress * 5), 4);
            if (newStage !== plot.growthStage) {
                plot.growthStage = newStage;
                
                // Update visual scale
                if (plot.plantMesh) {
                    const scale = 0.2 + (newStage * 0.2);
                    plot.plantMesh.scale.set(scale, scale, scale);
                    
                    // Add glow when ready
                    if (newStage === 4) {
                        plot.plantMesh.material.emissiveIntensity = 0.8;
                    }
                }
            }
        }
        
        // Update smoke particles
        for (let i = this.smokeParticles.length - 1; i >= 0; i--) {
            const smoke = this.smokeParticles[i];
            smoke.life += deltaTime * 1000;
            
            if (smoke.life >= smoke.maxLife) {
                // Remove particle system
                this.scene.remove(smoke.system);
                this.smokeParticles.splice(i, 1);
            } else {
                // Animate particles rising
                const positions = smoke.system.geometry.attributes.position.array;
                for (let j = 0; j < positions.length; j += 3) {
                    positions[j + 1] += deltaTime * 2; // Rise up
                }
                smoke.system.geometry.attributes.position.needsUpdate = true;
                
                // Fade out
                smoke.system.material.opacity = 0.6 * (1 - smoke.life / smoke.maxLife);
            }
        }
        
        // Update active effects
        for (let i = this.activeSmokeEffects.length - 1; i >= 0; i--) {
            const effect = this.activeSmokeEffects[i];
            const elapsed = currentTime - effect.startTime;
            
            if (elapsed >= effect.duration) {
                // Remove effect
                this.scene.remove(effect.mesh);
                this.activeSmokeEffects.splice(i, 1);
            } else {
                // Animate effect
                effect.mesh.rotation.y += deltaTime * 2;
                effect.mesh.scale.setScalar(1 + Math.sin(elapsed * 0.005) * 0.2);
            }
        }
    }
    
    getHerbCount(herbType) {
        return this.herbInventory.get(herbType) || 0;
    }
    
    getAllHerbs() {
        return Array.from(this.herbInventory.entries()).map(([type, count]) => ({
            type,
            ...this.herbTypes[type],
            count
        }));
    }
    
    getGrowingHerbs() {
        return this.growingHerbs.map(plot => ({
            plotId: plot.id,
            herbType: plot.herb,
            herb: this.herbTypes[plot.herb],
            growthStage: plot.growthStage,
            progress: plot.plantTime ? 
                Math.min((Date.now() - plot.plantTime) / this.herbTypes[plot.herb].growTime, 1) : 0
        }));
    }
    
    getHerbTypes() {
        return Object.entries(this.herbTypes).map(([key, herb]) => ({
            key,
            name: herb.name,
            color: herb.color,
            magicPower: herb.power,
            effect: herb.effect,
            growTime: herb.growTime,
            rarity: herb.rarity
        }));
    }
}
