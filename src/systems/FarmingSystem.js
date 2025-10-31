import * as THREE from 'three';
import { ModelLoader } from '../core/ModelLoader.js';

/**
 * Farming System - Plant, grow, and harvest crops including regular crops and cannabis
 * Uses real plant models from Stylized Nature MegaKit
 */
export class FarmingSystem {
    constructor(scene, modelLoader) {
        this.scene = scene;
        this.modelLoader = modelLoader || new ModelLoader();
        
        // Crop types
        this.cropTypes = {
            // Regular crops
            WHEAT: {
                name: 'Wheat',
                model: '/assets/models/nature/Grass_2.gltf',
                growTime: 120000, // 2 minutes
                waterNeeded: 3,
                yield: { wheat: 3 },
                sellPrice: 5,
                season: 'any'
            },
            CORN: {
                name: 'Corn',
                model: '/assets/models/nature/Grass_3.gltf',
                growTime: 180000, // 3 minutes
                waterNeeded: 4,
                yield: { corn: 2 },
                sellPrice: 8,
                season: 'summer'
            },
            CARROT: {
                name: 'Carrot',
                model: '/assets/models/nature/Grass_1.gltf',
                growTime: 90000, // 1.5 minutes
                waterNeeded: 2,
                yield: { carrot: 4 },
                sellPrice: 3,
                season: 'any'
            },
            POTATO: {
                name: 'Potato',
                model: '/assets/models/nature/Grass_2.gltf',
                growTime: 100000,
                waterNeeded: 3,
                yield: { potato: 5 },
                sellPrice: 4,
                season: 'any'
            },
            TOMATO: {
                name: 'Tomato',
                model: '/assets/models/nature/Plant_1.gltf',
                growTime: 150000,
                waterNeeded: 5,
                yield: { tomato: 3 },
                sellPrice: 7,
                season: 'summer'
            },
            
            // Herbs
            BASIL: {
                name: 'Basil',
                model: '/assets/models/nature/Plant_7.gltf',
                growTime: 60000, // 1 minute
                waterNeeded: 2,
                yield: { basil: 3 },
                sellPrice: 6,
                season: 'any'
            },
            MINT: {
                name: 'Mint',
                model: '/assets/models/nature/Plant_1.gltf',
                growTime: 60000,
                waterNeeded: 3,
                yield: { mint: 4 },
                sellPrice: 5,
                season: 'any'
            },
            
            // Cannabis strains (mystical herbs)
            PURPLE_HAZE_SEED: {
                name: 'Purple Haze',
                model: '/assets/models/nature/Plant_1_Big.gltf',
                growTime: 180000, // 3 minutes
                waterNeeded: 5,
                yield: { purple_haze: 2 },
                sellPrice: 50,
                season: 'any',
                isCannabis: true,
                magicPower: 10
            },
            NORTHERN_LIGHTS_SEED: {
                name: 'Northern Lights',
                model: '/assets/models/nature/Plant_7_Big.gltf',
                growTime: 240000, // 4 minutes
                waterNeeded: 6,
                yield: { northern_lights: 2 },
                sellPrice: 75,
                season: 'any',
                isCannabis: true,
                magicPower: 15
            },
            BLUE_DREAM_SEED: {
                name: 'Blue Dream',
                model: '/assets/models/nature/Plant_1_Big.gltf',
                growTime: 300000, // 5 minutes
                waterNeeded: 7,
                yield: { blue_dream: 2 },
                sellPrice: 100,
                season: 'any',
                isCannabis: true,
                magicPower: 20
            },
            
            // Special crops
            MANA_BLOSSOM: {
                name: 'Mana Blossom',
                model: '/assets/models/nature/Flower_3.gltf',
                growTime: 240000,
                waterNeeded: 8,
                yield: { mana_essence: 1 },
                sellPrice: 150,
                season: 'any',
                isSpecial: true
            },
            MOONFLOWER: {
                name: 'Moonflower',
                model: '/assets/models/nature/Flower_2.gltf',
                growTime: 300000,
                waterNeeded: 6,
                yield: { moonpetal: 2 },
                sellPrice: 200,
                season: 'any',
                isSpecial: true,
                glowAtNight: true
            }
        };
        
        // Farm plots
        this.farmPlots = [];
        this.maxPlots = 20;
        
        // Growing crops
        this.growingCrops = [];
        
        // Seasons
        this.currentSeason = 'spring'; // spring, summer, fall, winter
        this.seasonDuration = 600000; // 10 minutes per season
        this.seasonStartTime = Date.now();
        
        this.initialize();
    }
    
    async initialize() {
        // Create initial farm plots
        await this.createFarmPlots();
    }
    
    async createFarmPlots() {
        // Load ground tile for farm plot
        const plotModel = await this.modelLoader.load('/assets/models/buildings/Floor_UnevenBrick.gltf');
        
        // Create plots in a grid
        const plotsPerRow = 5;
        const spacing = 3;
        
        for (let i = 0; i < this.maxPlots; i++) {
            const row = Math.floor(i / plotsPerRow);
            const col = i % plotsPerRow;
            
            const plot = {
                id: i,
                position: new THREE.Vector3(
                    col * spacing,
                    0,
                    row * spacing
                ),
                crop: null,
                plantTime: null,
                growthStage: 0, // 0-4
                waterLevel: 0,
                isFertilized: false
            };
            
            // Create visual
            const plotMesh = plotModel ? plotModel.clone() : this.createFallbackPlot();
            plotMesh.position.copy(plot.position);
            plotMesh.scale.set(1.2, 0.5, 1.2);
            this.scene.add(plotMesh);
            
            plot.mesh = plotMesh;
            this.farmPlots.push(plot);
        }
    }
    
    createFallbackPlot() {
        const geometry = new THREE.BoxGeometry(2, 0.2, 2);
        const material = new THREE.MeshStandardMaterial({ color: 0x654321 });
        return new THREE.Mesh(geometry, material);
    }
    
    async plantCrop(plotId, cropType) {
        if (plotId >= this.farmPlots.length) return false;
        
        const plot = this.farmPlots[plotId];
        if (plot.crop) return false; // Already has crop
        
        const crop = this.cropTypes[cropType];
        if (!crop) return false;
        
        // Check season (if crop has season requirement)
        if (crop.season !== 'any' && crop.season !== this.currentSeason) {
            return false; // Wrong season
        }
        
        // Plant the crop
        plot.crop = cropType;
        plot.plantTime = Date.now();
        plot.growthStage = 0;
        plot.waterLevel = 0;
        
        // Load crop model
        const cropModel = await this.modelLoader.load(crop.model);
        if (cropModel) {
            const cropMesh = cropModel.clone();
            cropMesh.position.copy(plot.position);
            cropMesh.position.y = 0.5;
            cropMesh.scale.set(0.3, 0.3, 0.3); // Start small
            
            // Apply special effects for cannabis/special crops
            if (crop.isCannabis || crop.isSpecial) {
                cropMesh.traverse((child) => {
                    if (child.isMesh) {
                        child.material.emissive = new THREE.Color(crop.isCannabis ? 0x9d4edd : 0x00ffff);
                        child.material.emissiveIntensity = 0.3;
                    }
                });
            }
            
            this.scene.add(cropMesh);
            plot.cropMesh = cropMesh;
        }
        
        this.growingCrops.push(plot);
        return true;
    }
    
    waterPlot(plotId) {
        if (plotId >= this.farmPlots.length) return false;
        
        const plot = this.farmPlots[plotId];
        if (!plot.crop) return false;
        
        const crop = this.cropTypes[plot.crop];
        plot.waterLevel = Math.min(plot.waterLevel + 1, crop.waterNeeded);
        
        // Add water particles visual effect
        this.createWaterEffect(plot.position);
        
        return true;
    }
    
    createWaterEffect(position) {
        // Simple water droplet particle effect
        const particleCount = 20;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = position.x + (Math.random() - 0.5) * 2;
            positions[i * 3 + 1] = position.y + Math.random() * 2 + 1;
            positions[i * 3 + 2] = position.z + (Math.random() - 0.5) * 2;
        }
        
        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const material = new THREE.PointsMaterial({
            color: 0x00aaff,
            size: 0.1,
            transparent: true,
            opacity: 0.8
        });
        
        const particleSystem = new THREE.Points(particles, material);
        this.scene.add(particleSystem);
        
        // Remove after animation
        setTimeout(() => this.scene.remove(particleSystem), 1000);
    }
    
    fertilizePlot(plotId) {
        if (plotId >= this.farmPlots.length) return false;
        
        const plot = this.farmPlots[plotId];
        if (!plot.crop) return false;
        
        plot.isFertilized = true;
        return true;
    }
    
    harvestCrop(plotId) {
        if (plotId >= this.farmPlots.length) return false;
        
        const plot = this.farmPlots[plotId];
        if (!plot.crop || plot.growthStage < 4) return null; // Not ready
        
        const crop = this.cropTypes[plot.crop];
        
        // Calculate yield (fertilizer increases yield by 50%)
        const yieldMultiplier = plot.isFertilized ? 1.5 : 1;
        const harvestedItems = {};
        
        for (const [item, amount] of Object.entries(crop.yield)) {
            harvestedItems[item] = Math.floor(amount * yieldMultiplier);
        }
        
        // Remove crop visual
        if (plot.cropMesh) {
            this.scene.remove(plot.cropMesh);
            plot.cropMesh = null;
        }
        
        // Clear plot
        plot.crop = null;
        plot.plantTime = null;
        plot.growthStage = 0;
        plot.waterLevel = 0;
        plot.isFertilized = false;
        
        // Remove from growing crops
        const index = this.growingCrops.indexOf(plot);
        if (index > -1) {
            this.growingCrops.splice(index, 1);
        }
        
        return harvestedItems;
    }
    
    update(deltaTime) {
        // Update season
        const currentTime = Date.now();
        if (currentTime - this.seasonStartTime >= this.seasonDuration) {
            this.changeSeason();
            this.seasonStartTime = currentTime;
        }
        
        // Update growing crops
        for (const plot of this.growingCrops) {
            if (!plot.crop || !plot.plantTime) continue;
            
            const crop = this.cropTypes[plot.crop];
            const elapsed = currentTime - plot.plantTime;
            
            // Check if properly watered
            if (plot.waterLevel < crop.waterNeeded) {
                // Slow growth if not enough water
                continue;
            }
            
            // Calculate growth progress
            const progress = elapsed / crop.growTime;
            const newStage = Math.min(Math.floor(progress * 5), 4);
            
            if (newStage !== plot.growthStage) {
                plot.growthStage = newStage;
                
                // Update visual scale
                if (plot.cropMesh) {
                    const scale = 0.3 + (newStage * 0.2);
                    plot.cropMesh.scale.set(scale, scale, scale);
                    
                    // Increase glow when fully grown
                    if (newStage === 4 && (crop.isCannabis || crop.isSpecial)) {
                        plot.cropMesh.traverse((child) => {
                            if (child.isMesh && child.material) {
                                child.material.emissiveIntensity = 0.6;
                            }
                        });
                    }
                }
            }
            
            // Water depletes over time
            plot.waterLevel = Math.max(0, plot.waterLevel - deltaTime * 0.01);
        }
    }
    
    changeSeason() {
        const seasons = ['spring', 'summer', 'fall', 'winter'];
        const currentIndex = seasons.indexOf(this.currentSeason);
        this.currentSeason = seasons[(currentIndex + 1) % seasons.length];
        
        // Kill crops that can't survive the new season
        for (const plot of this.growingCrops) {
            if (!plot.crop) continue;
            
            const crop = this.cropTypes[plot.crop];
            if (crop.season !== 'any' && crop.season !== this.currentSeason) {
                // Crop dies in wrong season
                if (plot.cropMesh) {
                    this.scene.remove(plot.cropMesh);
                    plot.cropMesh = null;
                }
                plot.crop = null;
                plot.plantTime = null;
                plot.growthStage = 0;
            }
        }
    }
    
    getCropTypes() {
        return Object.keys(this.cropTypes).map(key => ({
            key,
            ...this.cropTypes[key]
        }));
    }
    
    getGrowingCrops() {
        return this.growingCrops.filter(p => p.crop).map(plot => ({
            plotId: plot.id,
            cropType: plot.crop,
            crop: this.cropTypes[plot.crop],
            growthStage: plot.growthStage,
            progress: plot.plantTime ? 
                Math.min((Date.now() - plot.plantTime) / this.cropTypes[plot.crop].growTime, 1) : 0,
            waterLevel: plot.waterLevel,
            isFertilized: plot.isFertilized
        }));
    }
    
    getCurrentSeason() {
        return this.currentSeason;
    }
}
