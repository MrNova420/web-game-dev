import * as THREE from 'three';
import { ModelLoader } from '../core/ModelLoader.js';

/**
 * Building System - Place and construct buildings using real models from Medieval Village MegaKit
 * Includes houses, workshops, farms, walls, etc.
 */
export class BuildingSystem {
    constructor(scene, modelLoader) {
        this.scene = scene;
        this.modelLoader = modelLoader || new ModelLoader();
        
        // Available building types from Medieval Village MegaKit
        this.buildingTypes = {
            // Houses
            SMALL_HOUSE: {
                name: 'Small House',
                model: '/assets/models/buildings/Wall_Wood_Half.gltf',
                cost: { wood: 50, stone: 20 },
                buildTime: 30000, // 30 seconds
                category: 'housing',
                size: { width: 4, length: 4, height: 3 }
            },
            LARGE_HOUSE: {
                name: 'Large House',
                model: '/assets/models/buildings/Wall_Wood.gltf',
                cost: { wood: 100, stone: 50 },
                buildTime: 60000,
                category: 'housing',
                size: { width: 6, length: 6, height: 4 }
            },
            
            // Production Buildings
            WORKSHOP: {
                name: 'Workshop',
                model: '/assets/models/buildings/Wall_Wood.gltf',
                cost: { wood: 80, stone: 40, iron: 20 },
                buildTime: 45000,
                category: 'production',
                size: { width: 5, length: 5, height: 3 }
            },
            FORGE: {
                name: 'Forge',
                model: '/assets/models/buildings/Wall_Wood.gltf',
                cost: { wood: 60, stone: 100, iron: 50 },
                buildTime: 60000,
                category: 'production',
                size: { width: 4, length: 6, height: 4 }
            },
            ALCHEMY_LAB: {
                name: 'Alchemy Lab',
                model: '/assets/models/buildings/Wall_Wood.gltf',
                cost: { wood: 70, stone: 50, crystal: 30 },
                buildTime: 50000,
                category: 'production',
                size: { width: 5, length: 4, height: 3 }
            },
            
            // Farms
            CROP_FARM: {
                name: 'Crop Farm',
                model: '/assets/models/buildings/Floor_UnevenBrick.gltf',
                cost: { wood: 30, stone: 10 },
                buildTime: 20000,
                category: 'farming',
                size: { width: 8, length: 8, height: 1 }
            },
            HERB_GARDEN: {
                name: 'Herb Garden',
                model: '/assets/models/buildings/Floor_UnevenBrick.gltf',
                cost: { wood: 40, stone: 15 },
                buildTime: 25000,
                category: 'farming',
                size: { width: 6, length: 6, height: 1 }
            },
            GREENHOUSE: {
                name: 'Greenhouse',
                model: '/assets/models/buildings/Wall_Wood_Half.gltf',
                cost: { wood: 80, stone: 30, glass: 40 },
                buildTime: 40000,
                category: 'farming',
                size: { width: 6, length: 8, height: 3 }
            },
            
            // Storage
            WAREHOUSE: {
                name: 'Warehouse',
                model: '/assets/models/buildings/Wall_Wood.gltf',
                cost: { wood: 100, stone: 60 },
                buildTime: 45000,
                category: 'storage',
                size: { width: 8, length: 6, height: 4 }
            },
            SILO: {
                name: 'Silo',
                model: '/assets/models/buildings/Wall_Wood.gltf',
                cost: { wood: 60, stone: 80 },
                buildTime: 35000,
                category: 'storage',
                size: { width: 4, length: 4, height: 6 }
            },
            
            // Defense
            WALL: {
                name: 'Wall',
                model: '/assets/models/buildings/Wall_Stone.gltf',
                cost: { stone: 30 },
                buildTime: 15000,
                category: 'defense',
                size: { width: 4, length: 1, height: 3 }
            },
            TOWER: {
                name: 'Watch Tower',
                model: '/assets/models/buildings/Wall_Stone.gltf',
                cost: { stone: 80, wood: 40 },
                buildTime: 50000,
                category: 'defense',
                size: { width: 4, length: 4, height: 8 }
            },
            GATE: {
                name: 'Gate',
                model: '/assets/models/buildings/Door_2_Flat.gltf',
                cost: { wood: 50, iron: 30 },
                buildTime: 30000,
                category: 'defense',
                size: { width: 4, length: 2, height: 4 }
            },
            
            // Special
            MAGIC_CIRCLE: {
                name: 'Magic Circle',
                model: '/assets/models/buildings/Floor_UnevenBrick.gltf',
                cost: { stone: 50, crystal: 40, mana: 100 },
                buildTime: 60000,
                category: 'special',
                size: { width: 6, length: 6, height: 0.5 }
            },
            PORTAL: {
                name: 'Portal',
                model: '/assets/models/buildings/DoorFrame_Round_Brick.gltf',
                cost: { stone: 100, crystal: 80, mana: 200 },
                buildTime: 120000,
                category: 'special',
                size: { width: 4, length: 2, height: 5 }
            }
        };
        
        // Placed buildings in world
        this.placedBuildings = [];
        
        // Currently building (construction in progress)
        this.buildingInProgress = [];
        
        // Preview mode
        this.previewMode = false;
        this.previewBuilding = null;
        this.previewMesh = null;
    }
    
    async startBuildingPreview(buildingType) {
        const building = this.buildingTypes[buildingType];
        if (!building) return false;
        
        this.previewMode = true;
        this.previewBuilding = buildingType;
        
        // Load model for preview
        const model = await this.modelLoader.load(building.model);
        if (model) {
            this.previewMesh = model.clone();
            this.previewMesh.traverse((child) => {
                if (child.isMesh) {
                    child.material = child.material.clone();
                    child.material.transparent = true;
                    child.material.opacity = 0.5;
                    child.material.emissive = new THREE.Color(0x00ff00);
                    child.material.emissiveIntensity = 0.3;
                }
            });
            this.scene.add(this.previewMesh);
        }
        
        return true;
    }
    
    updateBuildingPreview(position) {
        if (!this.previewMode || !this.previewMesh) return;
        
        this.previewMesh.position.copy(position);
        
        // Check if position is valid (not overlapping, etc.)
        const isValid = this.isValidBuildingPosition(position, this.previewBuilding);
        
        // Change color based on validity
        this.previewMesh.traverse((child) => {
            if (child.isMesh) {
                child.material.emissive.setHex(isValid ? 0x00ff00 : 0xff0000);
            }
        });
    }
    
    isValidBuildingPosition(position, buildingType) {
        const building = this.buildingTypes[buildingType];
        if (!building) return false;
        
        // Check if too close to other buildings
        for (const placed of this.placedBuildings) {
            const distance = position.distanceTo(placed.position);
            const minDistance = (building.size.width + placed.size.width) / 2 + 1;
            if (distance < minDistance) {
                return false; // Too close
            }
        }
        
        return true;
    }
    
    async placeBuilding(position, buildingType, hasResources = true) {
        if (!this.previewMode) return false;
        
        const building = this.buildingTypes[buildingType];
        if (!building) return false;
        
        // Check if position is valid
        if (!this.isValidBuildingPosition(position, buildingType)) {
            return false;
        }
        
        // Check if player has resources (simplified)
        if (!hasResources) {
            return false;
        }
        
        // Create building instance
        const newBuilding = {
            type: buildingType,
            ...building,
            position: position.clone(),
            rotation: 0,
            buildProgress: 0,
            isComplete: false,
            builtAt: Date.now()
        };
        
        // Load actual model
        const model = await this.modelLoader.load(building.model);
        if (model) {
            const buildingMesh = model.clone();
            buildingMesh.position.copy(position);
            
            // Start with low opacity (under construction)
            buildingMesh.traverse((child) => {
                if (child.isMesh) {
                    child.material = child.material.clone();
                    child.material.transparent = true;
                    child.material.opacity = 0.3;
                }
            });
            
            this.scene.add(buildingMesh);
            newBuilding.mesh = buildingMesh;
        }
        
        // Add to building in progress
        this.buildingInProgress.push(newBuilding);
        
        // Clear preview
        this.cancelBuildingPreview();
        
        return true;
    }
    
    cancelBuildingPreview() {
        if (this.previewMesh) {
            this.scene.remove(this.previewMesh);
            this.previewMesh = null;
        }
        this.previewMode = false;
        this.previewBuilding = null;
    }
    
    update(deltaTime) {
        // Update buildings under construction
        for (let i = this.buildingInProgress.length - 1; i >= 0; i--) {
            const building = this.buildingInProgress[i];
            
            // Increase build progress
            building.buildProgress += (deltaTime * 1000); // Convert to milliseconds
            
            // Update visual opacity based on progress
            if (building.mesh) {
                const progress = Math.min(building.buildProgress / building.buildTime, 1);
                building.mesh.traverse((child) => {
                    if (child.isMesh && child.material.transparent) {
                        child.material.opacity = 0.3 + (progress * 0.7);
                    }
                });
            }
            
            // Check if construction is complete
            if (building.buildProgress >= building.buildTime) {
                building.isComplete = true;
                
                // Make fully opaque
                if (building.mesh) {
                    building.mesh.traverse((child) => {
                        if (child.isMesh) {
                            child.material.transparent = false;
                            child.material.opacity = 1.0;
                        }
                    });
                }
                
                // Move to placed buildings
                this.placedBuildings.push(building);
                this.buildingInProgress.splice(i, 1);
            }
        }
    }
    
    demolishBuilding(buildingIndex) {
        if (buildingIndex >= this.placedBuildings.length) return false;
        
        const building = this.placedBuildings[buildingIndex];
        
        // Remove mesh from scene
        if (building.mesh) {
            this.scene.remove(building.mesh);
        }
        
        // Remove from array
        this.placedBuildings.splice(buildingIndex, 1);
        
        // Optionally return some resources
        return true;
    }
    
    getPlacedBuildings() {
        return this.placedBuildings.map(b => ({
            type: b.type,
            name: b.name,
            position: b.position,
            category: b.category,
            isComplete: b.isComplete
        }));
    }
    
    getBuildingsInProgress() {
        return this.buildingInProgress.map(b => ({
            type: b.type,
            name: b.name,
            progress: (b.buildProgress / b.buildTime) * 100,
            timeRemaining: Math.max(0, b.buildTime - b.buildProgress) / 1000
        }));
    }
    
    getBuildingTypes() {
        return Object.keys(this.buildingTypes).map(key => ({
            key,
            ...this.buildingTypes[key]
        }));
    }
}
