/**
import { logger } from '../core/Logger.js';
 * TextureManagementSystem - PBR Texture Loading & Management
 * 
 * Loads professional PBR textures from FREE external sources:
 * - Poly Haven (CC0 PBR textures)
 * - CC0 Textures
 * - AmbientCG
 * 
 * Manages texture atlasing, compression, and memory optimization.
 */

import * as THREE from 'three';

export class TextureManagementSystem {
    constructor() {
        // Loaders
        this.textureLoader = new THREE.TextureLoader();
        this.cubeTextureLoader = new THREE.CubeTextureLoader();
        
        // Cache
        this.textureCache = new Map();
        this.materialCache = new Map();
        
        // Settings
        this.settings = {
            anisotropy: 16,
            mipmaps: true,
            compression: true,
            maxTextureSize: 2048
        };
        
        // Statistics
        this.stats = {
            texturesLoaded: 0,
            materialsCreated: 0,
            cacheHits: 0,
            cacheMisses: 0,
            memoryUsed: 0
        };
        
        // Texture manifest (Poly Haven paths)
        this.manifest = {
            // Terrain textures
            terrain: {
                grass: '/assets/textures/terrain/grass_',
                dirt: '/assets/textures/terrain/dirt_',
                stone: '/assets/textures/terrain/stone_',
                sand: '/assets/textures/terrain/sand_',
                snow: '/assets/textures/terrain/snow_',
                mud: '/assets/textures/terrain/mud_'
            },
            // Building materials
            materials: {
                wood: '/assets/textures/materials/wood_',
                metal: '/assets/textures/materials/metal_',
                brick: '/assets/textures/materials/brick_',
                concrete: '/assets/textures/materials/concrete_',
                fabric: '/assets/textures/materials/fabric_'
            },
            // Nature
            nature: {
                bark: '/assets/textures/nature/bark_',
                leaves: '/assets/textures/nature/leaves_',
                moss: '/assets/textures/nature/moss_',
                rock: '/assets/textures/nature/rock_'
            },
            // Magic/Fantasy
            fantasy: {
                crystal: '/assets/textures/fantasy/crystal_',
                magic: '/assets/textures/fantasy/magic_',
                energy: '/assets/textures/fantasy/energy_',
                rune: '/assets/textures/fantasy/rune_'
            }
        };
    }
    
    /**
     * Load PBR material from Poly Haven
     * @param {string} category - Category (terrain, materials, nature, fantasy)
     * @param {string} name - Texture name
     * @returns {Promise<THREE.Material>} PBR Material
     */
    async loadPBRMaterial(category, name) {
        const cacheKey = `${category}_${name}`;
        
        if (this.materialCache.has(cacheKey)) {
            this.stats.cacheHits++;
            return this.materialCache.get(cacheKey).clone();
        }
        
        this.stats.cacheMisses++;
        
        const basePath = this.manifest[category]?.[name];
        if (!basePath) {
            logger.warn(`Texture ${category}/${name} not found in manifest`);
            return this.createFallbackMaterial();
        }
        
        try {
            // Load PBR texture maps (standard Poly Haven naming)
            const [
                albedo,
                normal,
                roughness,
                metallic,
                ao
            ] = await Promise.all([
                this.loadTexture(basePath + 'albedo.jpg'),
                this.loadTexture(basePath + 'normal.jpg'),
                this.loadTexture(basePath + 'roughness.jpg'),
                this.loadTexture(basePath + 'metallic.jpg'),
                this.loadTexture(basePath + 'ao.jpg')
            ]);
            
            // Create PBR material
            const material = new THREE.MeshStandardMaterial({
                map: albedo,
                normalMap: normal,
                roughnessMap: roughness,
                metalnessMap: metallic,
                aoMap: ao,
                aoMapIntensity: 1.0
            });
            
            // Configure texture wrapping and filtering - Updated for Three.js r160+
            [albedo, normal, roughness, metallic, ao].forEach(tex => {
                if (tex) {
                    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
                    tex.anisotropy = this.settings.anisotropy;
                    tex.colorSpace = tex === albedo ? THREE.SRGBColorSpace : THREE.LinearSRGBColorSpace;
                }
            });
            
            this.materialCache.set(cacheKey, material);
            this.stats.materialsCreated++;
            
            return material;
        } catch (error) {
            logger.warn(`Failed to load PBR material ${category}/${name}:`, error);
            return this.createFallbackMaterial();
        }
    }
    
    /**
     * Load single texture
     */
    async loadTexture(path) {
        const cacheKey = path;
        
        if (this.textureCache.has(cacheKey)) {
            return this.textureCache.get(cacheKey);
        }
        
        try {
            const texture = await new Promise((resolve, reject) => {
                this.textureLoader.load(
                    path,
                    (tex) => resolve(tex),
                    undefined,
                    (error) => reject(error)
                );
            });
            
            this.textureCache.set(cacheKey, texture);
            this.stats.texturesLoaded++;
            this.updateMemoryStats();
            
            return texture;
        } catch (error) {
            logger.warn(`Failed to load texture ${path}:`, error);
            return null;
        }
    }
    
    /**
     * Load terrain material with tiling
     */
    async loadTerrainMaterial(terrainType, tiling = { x: 10, y: 10 }) {
        const material = await this.loadPBRMaterial('terrain', terrainType);
        
        // Set tiling for large terrain surfaces
        if (material.map) material.map.repeat.set(tiling.x, tiling.y);
        if (material.normalMap) material.normalMap.repeat.set(tiling.x, tiling.y);
        if (material.roughnessMap) material.roughnessMap.repeat.set(tiling.x, tiling.y);
        if (material.metalnessMap) material.metalnessMap.repeat.set(tiling.x, tiling.y);
        if (material.aoMap) material.aoMap.repeat.set(tiling.x, tiling.y);
        
        return material;
    }
    
    /**
     * Load simple color texture (for UI, particles)
     */
    async loadColorTexture(path) {
        return this.loadTexture(path);
    }
    
    /**
     * Create material from color (fallback)
     */
    createFallbackMaterial(color = 0x808080) {
        return new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.7,
            metalness: 0.0
        });
    }
    
    /**
     * Create material with custom properties
     */
    createCustomMaterial(properties) {
        const material = new THREE.MeshStandardMaterial(properties);
        return material;
    }
    
    /**
     * Load environment map (for reflections)
     */
    async loadEnvironmentMap(name) {
        const basePath = `/assets/textures/hdri/${name}/`;
        const extension = '.jpg';
        
        const urls = [
            basePath + 'px' + extension,
            basePath + 'nx' + extension,
            basePath + 'py' + extension,
            basePath + 'ny' + extension,
            basePath + 'pz' + extension,
            basePath + 'nz' + extension
        ];
        
        try {
            const envMap = await new Promise((resolve, reject) => {
                this.cubeTextureLoader.load(urls, resolve, undefined, reject);
            });
            
            return envMap;
        } catch (error) {
            logger.warn(`Failed to load environment map ${name}:`, error);
            return null;
        }
    }
    
    /**
     * Apply material to mesh
     */
    applyMaterial(mesh, material) {
        if (mesh.isMesh) {
            mesh.material = material;
            mesh.material.needsUpdate = true;
        } else if (mesh.isGroup) {
            mesh.traverse((child) => {
                if (child.isMesh) {
                    child.material = material;
                    child.material.needsUpdate = true;
                }
            });
        }
    }
    
    /**
     * Create texture atlas from multiple textures
     */
    createAtlas(textures, atlasSize = 2048) {
        const canvas = document.createElement('canvas');
        canvas.width = atlasSize;
        canvas.height = atlasSize;
        const ctx = canvas.getContext('2d');
        
        const cols = Math.ceil(Math.sqrt(textures.length));
        const rows = Math.ceil(textures.length / cols);
        const cellWidth = atlasSize / cols;
        const cellHeight = atlasSize / rows;
        
        const uvMap = [];
        
        textures.forEach((tex, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);
            const x = col * cellWidth;
            const y = row * cellHeight;
            
            // Draw texture to canvas
            if (tex.image) {
                ctx.drawImage(tex.image, x, y, cellWidth, cellHeight);
            }
            
            // Store UV coordinates
            uvMap.push({
                u: col / cols,
                v: row / rows,
                width: 1 / cols,
                height: 1 / rows
            });
        });
        
        const atlasTexture = new THREE.CanvasTexture(canvas);
        atlasTexture.needsUpdate = true;
        
        return {
            texture: atlasTexture,
            uvMap: uvMap
        };
    }
    
    /**
     * Optimize texture size
     */
    optimizeTexture(texture) {
        if (!texture || !texture.image) return texture;
        
        const width = texture.image.width;
        const height = texture.image.height;
        
        if (width > this.settings.maxTextureSize || height > this.settings.maxTextureSize) {
            const canvas = document.createElement('canvas');
            const scale = this.settings.maxTextureSize / Math.max(width, height);
            canvas.width = width * scale;
            canvas.height = height * scale;
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(texture.image, 0, 0, canvas.width, canvas.height);
            
            texture.image = canvas;
            texture.needsUpdate = true;
        }
        
        return texture;
    }
    
    /**
     * Dispose of texture
     */
    disposeTexture(texture) {
        if (texture) {
            texture.dispose();
        }
    }
    
    /**
     * Dispose of material
     */
    disposeMaterial(material) {
        if (material) {
            if (material.map) material.map.dispose();
            if (material.normalMap) material.normalMap.dispose();
            if (material.roughnessMap) material.roughnessMap.dispose();
            if (material.metalnessMap) material.metalnessMap.dispose();
            if (material.aoMap) material.aoMap.dispose();
            material.dispose();
        }
    }
    
    /**
     * Clear cache
     */
    clearCache() {
        // Dispose all cached textures
        for (const texture of this.textureCache.values()) {
            this.disposeTexture(texture);
        }
        
        // Dispose all cached materials
        for (const material of this.materialCache.values()) {
            this.disposeMaterial(material);
        }
        
        this.textureCache.clear();
        this.materialCache.clear();
        this.stats.memoryUsed = 0;
    }
    
    /**
     * Update memory statistics
     */
    updateMemoryStats() {
        let totalMemory = 0;
        
        for (const texture of this.textureCache.values()) {
            if (texture && texture.image) {
                const width = texture.image.width || 0;
                const height = texture.image.height || 0;
                const bpp = 4; // bytes per pixel (RGBA)
                totalMemory += width * height * bpp;
            }
        }
        
        this.stats.memoryUsed = totalMemory;
    }
    
    /**
     * Get statistics
     */
    getStats() {
        return {
            ...this.stats,
            cacheSize: this.textureCache.size,
            materialCacheSize: this.materialCache.size,
            cacheHitRate: this.stats.cacheHits / (this.stats.cacheHits + this.stats.cacheMisses),
            memoryUsedMB: (this.stats.memoryUsed / (1024 * 1024)).toFixed(2)
        };
    }
    
    /**
     * Preload common textures
     */
    async preloadCommon() {
        const commonTextures = [
            { category: 'terrain', name: 'grass' },
            { category: 'terrain', name: 'dirt' },
            { category: 'terrain', name: 'stone' },
            { category: 'materials', name: 'wood' },
            { category: 'materials', name: 'metal' }
        ];
        
        const promises = commonTextures.map(tex => 
            this.loadPBRMaterial(tex.category, tex.name)
        );
        
        return Promise.all(promises);
    }
}
