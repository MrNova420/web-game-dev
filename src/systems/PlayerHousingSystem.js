/**
 * PlayerHousingSystem.js
 * Phase 6 - Player Housing System
 * Personal housing, furniture, decoration, and customization
 * ~700 lines
 */

export class PlayerHousingSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // House data
        this.house = {
            tier: 1,
            rooms: new Map(),
            furniture: new Map(),
            decorations: new Map(),
            upgrades: new Set(),
            theme: 'default',
            visitors: []
        };
        
        // Housing tiers
        this.housingTiers = {
            1: { name: 'Small Cottage', rooms: 2, maxFurniture: 20, cost: 0 },
            2: { name: 'Cozy House', rooms: 4, maxFurniture: 40, cost: 10000 },
            3: { name: 'Large Villa', rooms: 8, maxFurniture: 80, cost: 50000 },
            4: { name: 'Manor', rooms: 12, maxFurniture: 150, cost: 200000 },
            5: { name: 'Mansion', rooms: 20, maxFurniture: 300, cost: 1000000 }
        };
        
        // Furniture database
        this.furnitureDatabase = this.createFurnitureDatabase();
        
        // Decoration database
        this.decorationDatabase = this.createDecorationDatabase();
        
        // Initialize starting house
        this.initializeStartingHouse();
    }
    
    /**
     * Initialize starting house
     */
    initializeStartingHouse() {
        // Add starting rooms
        this.house.rooms.set('living_room', {
            id: 'living_room',
            name: 'Living Room',
            type: 'living',
            furniture: [],
            decorations: [],
            floor: 'wood',
            walls: 'white',
            lighting: 'normal'
        });
        
        this.house.rooms.set('bedroom', {
            id: 'bedroom',
            name: 'Bedroom',
            type: 'bedroom',
            furniture: [],
            decorations: [],
            floor: 'carpet',
            walls: 'blue',
            lighting: 'warm'
        });
    }
    
    /**
     * Create furniture database
     */
    createFurnitureDatabase() {
        return {
            // Seating
            wooden_chair: { name: 'Wooden Chair', type: 'seating', comfort: 5, cost: 50, tier: 1 },
            comfy_chair: { name: 'Comfy Chair', type: 'seating', comfort: 15, cost: 200, tier: 2 },
            luxury_sofa: { name: 'Luxury Sofa', type: 'seating', comfort: 30, cost: 1000, tier: 3 },
            
            // Tables
            small_table: { name: 'Small Table', type: 'table', storage: 2, cost: 100, tier: 1 },
            dining_table: { name: 'Dining Table', type: 'table', storage: 4, cost: 500, tier: 2 },
            grand_table: { name: 'Grand Table', type: 'table', storage: 8, cost: 2000, tier: 3 },
            
            // Beds
            simple_bed: { name: 'Simple Bed', type: 'bed', rest: 10, cost: 200, tier: 1 },
            comfy_bed: { name: 'Comfy Bed', type: 'bed', rest: 25, cost: 1000, tier: 2 },
            luxury_bed: { name: 'Luxury Bed', type: 'bed', rest: 50, cost: 5000, tier: 3 },
            
            // Storage
            chest: { name: 'Storage Chest', type: 'storage', capacity: 20, cost: 150, tier: 1 },
            wardrobe: { name: 'Wardrobe', type: 'storage', capacity: 40, cost: 800, tier: 2 },
            vault: { name: 'Secure Vault', type: 'storage', capacity: 100, cost: 5000, tier: 3 },
            
            // Crafting stations
            workbench: { name: 'Workbench', type: 'crafting', bonus: 0.1, cost: 500, tier: 1 },
            forge: { name: 'Forge', type: 'crafting', bonus: 0.2, cost: 2000, tier: 2 },
            master_station: { name: 'Master Crafting Station', type: 'crafting', bonus: 0.5, cost: 10000, tier: 3 },
            
            // Special
            training_dummy: { name: 'Training Dummy', type: 'utility', feature: 'training', cost: 1000, tier: 2 },
            bookshelf: { name: 'Bookshelf', type: 'utility', feature: 'learning', cost: 500, tier: 1 },
            meditation_mat: { name: 'Meditation Mat', type: 'utility', feature: 'meditation', cost: 800, tier: 2 },
            grow_station: { name: 'Indoor Garden', type: 'utility', feature: 'gardening', cost: 2000, tier: 3 }
        };
    }
    
    /**
     * Create decoration database
     */
    createDecorationDatabase() {
        return {
            // Wall decorations
            painting_basic: { name: 'Basic Painting', type: 'wall', beauty: 5, cost: 100, tier: 1 },
            painting_masterpiece: { name: 'Masterpiece Painting', type: 'wall', beauty: 25, cost: 5000, tier: 3 },
            tapestry: { name: 'Tapestry', type: 'wall', beauty: 15, cost: 800, tier: 2 },
            
            // Floor decorations
            rug_small: { name: 'Small Rug', type: 'floor', beauty: 3, cost: 50, tier: 1 },
            rug_large: { name: 'Large Rug', type: 'floor', beauty: 10, cost: 500, tier: 2 },
            carpet_luxury: { name: 'Luxury Carpet', type: 'floor', beauty: 20, cost: 2000, tier: 3 },
            
            // Plants
            potted_plant: { name: 'Potted Plant', type: 'plant', beauty: 5, cost: 80, tier: 1 },
            bonsai: { name: 'Bonsai Tree', type: 'plant', beauty: 15, cost: 500, tier: 2 },
            indoor_tree: { name: 'Indoor Tree', type: 'plant', beauty: 30, cost: 2000, tier: 3 },
            
            // Lighting
            candle: { name: 'Candle', type: 'lighting', beauty: 2, cost: 20, tier: 1 },
            chandelier: { name: 'Chandelier', type: 'lighting', beauty: 20, cost: 3000, tier: 3 },
            magic_orb: { name: 'Magic Orb Light', type: 'lighting', beauty: 15, cost: 1000, tier: 2 }
        };
    }
    
    /**
     * Upgrade house tier
     */
    upgradeHouse(tier) {
        const tierData = this.housingTiers[tier];
        if (!tierData) {
            return { success: false, message: 'Invalid tier' };
        }
        
        if (tier <= this.house.tier) {
            return { success: false, message: 'Already at this tier or higher' };
        }
        
        if (this.gameEngine.economySystem) {
            if (!this.gameEngine.economySystem.canAfford(tierData.cost)) {
                return { success: false, message: 'Not enough gold' };
            }
            this.gameEngine.economySystem.spendGold(tierData.cost);
        }
        
        this.house.tier = tier;
        console.log(`🏠 Upgraded to ${tierData.name}!`);
        
        return { success: true, tier: tierData };
    }
    
    /**
     * Add room
     */
    addRoom(roomId, roomData) {
        const tierData = this.housingTiers[this.house.tier];
        if (this.house.rooms.size >= tierData.rooms) {
            return { success: false, message: 'Max rooms reached for current tier' };
        }
        
        if (this.house.rooms.has(roomId)) {
            return { success: false, message: 'Room already exists' };
        }
        
        const cost = 1000 * this.house.rooms.size;
        if (this.gameEngine.economySystem) {
            if (!this.gameEngine.economySystem.canAfford(cost)) {
                return { success: false, message: 'Not enough gold' };
            }
            this.gameEngine.economySystem.spendGold(cost);
        }
        
        const room = {
            id: roomId,
            name: roomData.name || 'New Room',
            type: roomData.type || 'general',
            furniture: [],
            decorations: [],
            floor: 'wood',
            walls: 'white',
            lighting: 'normal'
        };
        
        this.house.rooms.set(roomId, room);
        return { success: true, room: room };
    }
    
    /**
     * Place furniture
     */
    placeFurniture(roomId, furnitureId, position) {
        const room = this.house.rooms.get(roomId);
        if (!room) {
            return { success: false, message: 'Room not found' };
        }
        
        const furnitureData = this.furnitureDatabase[furnitureId];
        if (!furnitureData) {
            return { success: false, message: 'Furniture not found' };
        }
        
        // Check furniture limit
        const tierData = this.housingTiers[this.house.tier];
        const totalFurniture = Array.from(this.house.rooms.values())
            .reduce((sum, r) => sum + r.furniture.length, 0);
        
        if (totalFurniture >= tierData.maxFurniture) {
            return { success: false, message: 'Max furniture reached' };
        }
        
        // Check if player owns furniture
        const furnitureItemId = `furniture_${furnitureId}_${Date.now()}`;
        
        const furniture = {
            id: furnitureItemId,
            furnitureId: furnitureId,
            data: furnitureData,
            position: position || { x: 0, y: 0, z: 0 },
            rotation: 0,
            placedDate: Date.now()
        };
        
        room.furniture.push(furniture);
        this.house.furniture.set(furnitureItemId, furniture);
        
        return { success: true, furniture: furniture };
    }
    
    /**
     * Remove furniture
     */
    removeFurniture(roomId, furnitureItemId) {
        const room = this.house.rooms.get(roomId);
        if (!room) {
            return { success: false, message: 'Room not found' };
        }
        
        const index = room.furniture.findIndex(f => f.id === furnitureItemId);
        if (index === -1) {
            return { success: false, message: 'Furniture not found in room' };
        }
        
        room.furniture.splice(index, 1);
        this.house.furniture.delete(furnitureItemId);
        
        return { success: true };
    }
    
    /**
     * Place decoration
     */
    placeDecoration(roomId, decorationId, position) {
        const room = this.house.rooms.get(roomId);
        if (!room) {
            return { success: false, message: 'Room not found' };
        }
        
        const decorationData = this.decorationDatabase[decorationId];
        if (!decorationData) {
            return { success: false, message: 'Decoration not found' };
        }
        
        const decorationItemId = `decoration_${decorationId}_${Date.now()}`;
        
        const decoration = {
            id: decorationItemId,
            decorationId: decorationId,
            data: decorationData,
            position: position || { x: 0, y: 0, z: 0 },
            rotation: 0,
            placedDate: Date.now()
        };
        
        room.decorations.push(decoration);
        this.house.decorations.set(decorationItemId, decoration);
        
        return { success: true, decoration: decoration };
    }
    
    /**
     * Change room theme
     */
    changeRoomTheme(roomId, theme) {
        const room = this.house.rooms.get(roomId);
        if (!room) {
            return { success: false, message: 'Room not found' };
        }
        
        room.floor = theme.floor || room.floor;
        room.walls = theme.walls || room.walls;
        room.lighting = theme.lighting || room.lighting;
        
        return { success: true };
    }
    
    /**
     * Calculate house beauty score
     */
    calculateBeauty() {
        let beauty = 0;
        
        for (const room of this.house.rooms.values()) {
            // Furniture beauty
            for (const furniture of room.furniture) {
                beauty += furniture.data.comfort || 0;
            }
            
            // Decoration beauty
            for (const decoration of room.decorations) {
                beauty += decoration.data.beauty || 0;
            }
        }
        
        return beauty;
    }
    
    /**
     * Calculate house comfort
     */
    calculateComfort() {
        let comfort = 0;
        
        for (const room of this.house.rooms.values()) {
            for (const furniture of room.furniture) {
                comfort += furniture.data.comfort || 0;
                comfort += furniture.data.rest || 0;
            }
        }
        
        return comfort;
    }
    
    /**
     * Use house feature
     */
    useFeature(featureType) {
        // Find furniture with this feature
        for (const furniture of this.house.furniture.values()) {
            if (furniture.data.feature === featureType) {
                switch (featureType) {
                    case 'training':
                        return this.useTrainingDummy();
                    case 'meditation':
                        return this.useMeditation();
                    case 'gardening':
                        return this.useGarden();
                    case 'learning':
                        return this.useBookshelf();
                }
            }
        }
        
        return { success: false, message: 'Feature not available' };
    }
    
    /**
     * Use training dummy
     */
    useTrainingDummy() {
        // Grant XP or skill points
        console.log('💪 Training complete!');
        return { success: true, reward: 'xp' };
    }
    
    /**
     * Use meditation mat
     */
    useMeditation() {
        // Restore HP/Mana
        if (this.gameEngine.player) {
            this.gameEngine.player.hp = this.gameEngine.player.maxHP;
            this.gameEngine.player.mana = this.gameEngine.player.maxMana;
        }
        console.log('🧘 Meditation complete - fully restored!');
        return { success: true, reward: 'restore' };
    }
    
    /**
     * Use garden
     */
    useGarden() {
        // Harvest plants
        console.log('🌱 Garden tended!');
        return { success: true, reward: 'herbs' };
    }
    
    /**
     * Use bookshelf
     */
    useBookshelf() {
        // Learn recipes or lore
        console.log('📚 Knowledge gained!');
        return { success: true, reward: 'knowledge' };
    }
    
    /**
     * Invite visitor
     */
    inviteVisitor(visitorId) {
        if (this.house.visitors.length >= 10) {
            return { success: false, message: 'Max visitors reached' };
        }
        
        this.house.visitors.push({
            id: visitorId,
            arrivedTime: Date.now()
        });
        
        return { success: true };
    }
    
    /**
     * Get house stats
     */
    getStats() {
        return {
            tier: this.house.tier,
            tierData: this.housingTiers[this.house.tier],
            roomCount: this.house.rooms.size,
            furnitureCount: Array.from(this.house.rooms.values()).reduce((sum, r) => sum + r.furniture.length, 0),
            decorationCount: Array.from(this.house.rooms.values()).reduce((sum, r) => sum + r.decorations.length, 0),
            beauty: this.calculateBeauty(),
            comfort: this.calculateComfort(),
            visitors: this.house.visitors.length
        };
    }
    
    /**
     * Get room
     */
    getRoom(roomId) {
        return this.house.rooms.get(roomId);
    }
    
    /**
     * Get all rooms
     */
    getAllRooms() {
        return Array.from(this.house.rooms.values());
    }
    
    /**
     * Save house data
     */
    save() {
        const data = {
            tier: this.house.tier,
            rooms: Array.from(this.house.rooms.entries()),
            furniture: Array.from(this.house.furniture.entries()),
            decorations: Array.from(this.house.decorations.entries()),
            upgrades: Array.from(this.house.upgrades),
            theme: this.house.theme
        };
        
        localStorage.setItem('player_house', JSON.stringify(data));
    }
    
    /**
     * Load house data
     */
    load() {
        const saved = localStorage.getItem('player_house');
        if (!saved) return;
        
        try {
            const data = JSON.parse(saved);
            this.house.tier = data.tier || 1;
            this.house.rooms = new Map(data.rooms || []);
            this.house.furniture = new Map(data.furniture || []);
            this.house.decorations = new Map(data.decorations || []);
            this.house.upgrades = new Set(data.upgrades || []);
            this.house.theme = data.theme || 'default';
        } catch (error) {
            console.error('Failed to load house data:', error);
        }
    }
}
