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
            'texture_player',
            'texture_ground',
            'texture_wall',
            'model_player',
            'model_companion',
            'sound_attack',
            'sound_ambient',
            'data_companions',
            'data_enemies',
            'data_dungeons'
        ];
        
        this.totalAssets = assetList.length;
        
        for (let i = 0; i < assetList.length; i++) {
            await this.simulateLoad(assetList[i]);
            this.loadedAssets++;
            if (progressCallback) {
                progressCallback(this.loadedAssets / this.totalAssets);
            }
        }
        
        console.log('✅ All assets loaded');
        return true;
    }
    
    async simulateLoad(assetName) {
        // Simulate network delay
        return new Promise(resolve => {
            setTimeout(() => {
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
            }, Math.random() * 100 + 50);
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
