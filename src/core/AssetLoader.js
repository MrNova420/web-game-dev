/**
 * AssetLoader - Loads and manages game assets
 */

export class AssetLoader {
    constructor() {
        this.assets = {
            textures: {},
            models: {},
            sounds: {},
            data: {}
        };
        
        this.totalAssets = 0;
        this.loadedAssets = 0;
    }
    
    async loadAll(progressCallback) {
        // Simulate asset loading for now
        // In production, this would load actual textures, models, and sounds
        
        const assetList = [
            { name: 'texture_player', size: 'small' },
            { name: 'texture_ground', size: 'small' },
            { name: 'texture_wall', size: 'small' },
            { name: 'model_player', size: 'medium' },
            { name: 'model_companion', size: 'medium' },
            { name: 'sound_attack', size: 'small' },
            { name: 'sound_ambient', size: 'medium' },
            { name: 'data_companions', size: 'tiny' },
            { name: 'data_enemies', size: 'tiny' },
            { name: 'data_dungeons', size: 'tiny' }
        ];
        
        this.totalAssets = assetList.length;
        
        // Load assets with retry mechanism
        for (let i = 0; i < assetList.length; i++) {
            const asset = assetList[i];
            let loaded = false;
            let attempts = 0;
            const maxAttempts = 3;
            
            while (!loaded && attempts < maxAttempts) {
                try {
                    await this.simulateLoad(asset.name, asset.size);
                    this.loadedAssets++;
                    loaded = true;
                    
                    if (progressCallback) {
                        progressCallback(this.loadedAssets / this.totalAssets, asset.name);
                    }
                } catch (error) {
                    attempts++;
                    console.warn(`Failed to load ${asset.name}, attempt ${attempts}/${maxAttempts}`);
                    
                    if (attempts >= maxAttempts) {
                        console.error(`Failed to load ${asset.name} after ${maxAttempts} attempts`);
                        // Mark as loaded anyway to prevent freezing
                        this.loadedAssets++;
                        if (progressCallback) {
                            progressCallback(this.loadedAssets / this.totalAssets, asset.name);
                        }
                    } else {
                        // Wait before retry
                        await new Promise(resolve => setTimeout(resolve, 500));
                    }
                }
            }
        }
        
        console.log('✅ All assets loaded');
        return true;
    }
    
    async simulateLoad(assetName, size = 'medium') {
        // Simulate network delay based on asset size
        const delays = {
            tiny: 20,
            small: 50,
            medium: 100,
            large: 200
        };
        
        const baseDelay = delays[size] || delays.medium;
        const randomDelay = baseDelay + Math.random() * 50;
        
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate occasional network issues (5% failure rate)
                if (Math.random() < 0.05) {
                    reject(new Error(`Network error loading ${assetName}`));
                    return;
                }
                
                // Store placeholder asset
                if (assetName.startsWith('texture')) {
                    this.assets.textures[assetName] = { loaded: true, name: assetName };
                } else if (assetName.startsWith('model')) {
                    this.assets.models[assetName] = { loaded: true, name: assetName };
                } else if (assetName.startsWith('sound')) {
                    this.assets.sounds[assetName] = { loaded: true, name: assetName };
                } else if (assetName.startsWith('data')) {
                    this.assets.data[assetName] = { loaded: true, name: assetName };
                }
                resolve();
            }, randomDelay);
        });
    }
    
    getTexture(name) {
        return this.assets.textures[name];
    }
    
    getModel(name) {
        return this.assets.models[name];
    }
    
    getSound(name) {
        return this.assets.sounds[name];
    }
    
    getData(name) {
        return this.assets.data[name];
    }
}
