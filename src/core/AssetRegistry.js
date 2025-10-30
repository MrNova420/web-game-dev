/**
 * Asset Registry - Central registry for all game assets
 * Manages 500+ models, textures, and animations
 */

export class AssetRegistry {
    constructor() {
        this.assetBase = '/assets/models';
        this.textureBase = '/assets/textures';
        this.animationBase = '/assets/animations';
        
        // Asset catalogs
        // Universal Base Characters for players (male/female superhero bases)
        this.universalCharacters = [
            'Superhero_Male.gltf',
            'Superhero_Female.gltf'
        ];
        
        // Universal animations for all character movements
        this.universalAnimations = [
            'AnimationLibrary_Godot_Standard.glb'
        ];
        
        // Hairstyles for character customization
        this.hairstyles = [
            'Hair_Long_HO.gltf',
            'Hair_Buns_HO.gltf',
            'Hair_SimpleParted_HO.gltf',
            'Hair_Buzzed_HO.gltf',
            'Hair_BuzzedFemale_HO.gltf',
            'Hair_Beard_HO.gltf',
            'Eyebrows_Regular_HO.gltf',
            'Eyebrows_Female_HO.gltf'
        ];
        
        // KayKit Adventurers - for NPCs/companions
        this.npcCharacters = [
            'Barbarian.glb',
            'Knight.glb',
            'Mage.glb',
            'Ranger.glb',
            'Rogue.glb',
            'Rogue_Hooded.glb'
        ];
        
        // Enemy characters (skeletons and other mobs)
        this.enemyCharacters = [
            'Skeleton_Mage.glb',
            'Skeleton_Minion.glb',
            'Skeleton_Rogue.glb',
            'Skeleton_Warrior.glb'
        ];
        
        // Nature assets - organized by type (ALL 68 models from Stylized Nature MegaKit)
        this.trees = [
            // Common Trees
            'CommonTree_1.gltf', 'CommonTree_2.gltf', 'CommonTree_3.gltf',
            'CommonTree_4.gltf', 'CommonTree_5.gltf',
            // Pine Trees
            'Pine_1.gltf', 'Pine_2.gltf', 'Pine_3.gltf', 'Pine_4.gltf', 'Pine_5.gltf',
            // Twisted Trees (mystical)
            'TwistedTree_1.gltf', 'TwistedTree_2.gltf', 'TwistedTree_3.gltf',
            'TwistedTree_4.gltf', 'TwistedTree_5.gltf',
            // Dead Trees (spooky areas)
            'DeadTree_1.gltf', 'DeadTree_2.gltf', 'DeadTree_3.gltf',
            'DeadTree_4.gltf', 'DeadTree_5.gltf'
        ];
        
        this.rocks = [
            // Large Rocks
            'Rock_Large_1.gltf', 'Rock_Large_2.gltf', 'Rock_Large_3.gltf',
            'Rock_Large_4.gltf', 'Rock_Large_5.gltf', 'Rock_Large_6.gltf',
            // Medium Rocks
            'Rock_Medium_1.gltf', 'Rock_Medium_2.gltf', 'Rock_Medium_3.gltf',
            'Rock_Medium_4.gltf', 'Rock_Medium_5.gltf',
            // Round Pebbles
            'Pebble_Round_1.gltf', 'Pebble_Round_2.gltf', 'Pebble_Round_3.gltf',
            'Pebble_Round_4.gltf', 'Pebble_Round_5.gltf',
            // Square Pebbles
            'Pebble_Square_1.gltf', 'Pebble_Square_2.gltf', 'Pebble_Square_3.gltf',
            'Pebble_Square_4.gltf', 'Pebble_Square_5.gltf', 'Pebble_Square_6.gltf',
            // Rock Paths
            'RockPath_Round_Small_1.gltf', 'RockPath_Round_Small_2.gltf',
            'RockPath_Round_Wide.gltf', 'RockPath_Square_Small_1.gltf',
            'RockPath_Square_Thin.gltf'
        ];
        
        this.plants = [
            // Ground Plants
            'Plant_1.gltf', 'Plant_1_Big.gltf', 'Plant_7.gltf', 'Plant_7_Big.gltf',
            // Grass
            'Grass_Common_Short.gltf', 'Grass_Common_Tall.gltf',
            'Grass_Wispy_Short.gltf', 'Grass_Wispy_Tall.gltf',
            // Flowers (single and groups)
            'Flower_3_Single.gltf', 'Flower_3_Group.gltf',
            'Flower_4_Single.gltf', 'Flower_4_Group.gltf',
            // Petals
            'Petal_1.gltf', 'Petal_2.gltf', 'Petal_3.gltf', 'Petal_4.gltf', 'Petal_5.gltf',
            // Clover
            'Clover_1.gltf', 'Clover_2.gltf',
            // Bushes
            'Bush_Common.gltf', 'Bush_Common_Flowers.gltf',
            // Ferns
            'Fern_1.gltf',
            // Mushrooms
            'Mushroom_Common.gltf', 'Mushroom_Laetiporus.gltf'
        ];
        
        // Props for villages and interiors
        this.props = {
            furniture: [
                'Table_Large.gltf', 'Cabinet.gltf', 'Shelf_Simple.gltf',
                'Nightstand_Shelf.gltf', 'Bench.gltf'
            ],
            containers: [
                'Barrel.gltf', 'Chest_Wood.gltf', 'Bucket_Wooden_1.gltf',
                'Crate_Fruit.gltf'
            ],
            items: [
                'Book_5.gltf', 'Book_7.gltf', 'Potion_2.gltf',
                'SmallBottle.gltf', 'Chalice.gltf', 'Mug.gltf'
            ],
            tools: [
                'Axe_Bronze.gltf', 'Pickaxe_Bronze.gltf', 'Key_Metal.gltf'
            ],
            decorations: [
                'Banner_2.gltf', 'Candle_1.gltf', 'Peg_Rack.gltf'
            ]
        };
        
        // Dungeon assets
        this.dungeon = {
            walls: [
                'wall.gltf', 'wall_cracked.gltf', 'wall_archedwindow_gated.gltf',
                'wall_corner_scaffold.gltf', 'wall_half_endcap_sloped.gltf'
            ],
            floors: [
                'floor_tile_small_broken_A.gltf', 'floor_wood_large.gltf',
                'floor_wood_small.gltf', 'floor_dirt_small_C.gltf',
                'floor_foundation_corner.gltf'
            ],
            props: [
                'barrel_small.gltf', 'stool.gltf', 'shelf_small.gltf',
                'trunk_medium_B.gltf', 'key.gltf'
            ],
            decorations: [
                'banner_red.gltf', 'banner_thin_blue.gltf',
                'banner_patternC_yellow.gltf', 'banner_shield_white.gltf'
            ]
        };
        
        // Loaded assets cache
        this.loadedAssets = new Map();
    }
    
    /**
     * Get full path for a player character model (Universal Base Character)
     */
    getPlayerCharacterPath(gender = 'male') {
        const char = gender === 'female' ? this.universalCharacters[1] : this.universalCharacters[0];
        return `${this.assetBase}/characters/universal/${char}`;
    }
    
    /**
     * Get animation library path
     */
    getAnimationLibraryPath() {
        return `${this.animationBase}/universal/${this.universalAnimations[0]}`;
    }
    
    /**
     * Get hairstyle path
     */
    getHairstylePath(index = 0) {
        const hairstyle = this.hairstyles[index % this.hairstyles.length];
        return `${this.assetBase}/characters/hairstyles/${hairstyle}`;
    }
    
    /**
     * Get NPC character path (KayKit Adventurers for companions/NPCs)
     */
    getNPCCharacterPath(index = 0) {
        const char = this.npcCharacters[index % this.npcCharacters.length];
        return `${this.assetBase}/characters/player/${char}`;
    }
    
    /**
     * Get full path for an enemy character model
     */
    getEnemyCharacterPath(index = 0) {
        const char = this.enemyCharacters[index % this.enemyCharacters.length];
        return `${this.assetBase}/characters/enemies/${char}`;
    }
    
    /**
     * Get random tree model path
     */
    getRandomTree() {
        const tree = this.trees[Math.floor(Math.random() * this.trees.length)];
        return `${this.assetBase}/environment/nature/${tree}`;
    }
    
    /**
     * Get random rock model path
     */
    getRandomRock() {
        const rock = this.rocks[Math.floor(Math.random() * this.rocks.length)];
        return `${this.assetBase}/environment/nature/${rock}`;
    }
    
    /**
     * Get random plant/grass model path
     */
    getRandomPlant() {
        const plant = this.plants[Math.floor(Math.random() * this.plants.length)];
        return `${this.assetBase}/environment/nature/${plant}`;
    }
    
    /**
     * Get prop by category and index
     */
    getProp(category, index = null) {
        if (!this.props[category]) return null;
        const items = this.props[category];
        const item = index !== null ? items[index % items.length] : 
                     items[Math.floor(Math.random() * items.length)];
        return `${this.assetBase}/environment/props/${item}`;
    }
    
    /**
     * Get dungeon asset by category
     */
    getDungeonAsset(category, index = null) {
        if (!this.dungeon[category]) return null;
        const items = this.dungeon[category];
        const item = index !== null ? items[index % items.length] :
                     items[Math.floor(Math.random() * items.length)];
        return `${this.assetBase}/dungeon/${item}`;
    }
    
    /**
     * Cache loaded asset
     */
    cacheAsset(path, asset) {
        this.loadedAssets.set(path, asset);
    }
    
    /**
     * Get cached asset
     */
    getCachedAsset(path) {
        return this.loadedAssets.get(path);
    }
    
    /**
     * Get all available player characters
     */
    getAllPlayerCharacters() {
        return this.playerCharacters.map(char => 
            `${this.assetBase}/characters/player/${char}`
        );
    }
    
    /**
     * Get all available enemies
     */
    getAllEnemies() {
        return this.enemyCharacters.map(char =>
            `${this.assetBase}/characters/enemies/${char}`
        );
    }
}

// Export singleton instance
export const assetRegistry = new AssetRegistry();
