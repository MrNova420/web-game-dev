/**
 * City & Village System - Create living, breathing settlements
 * Complete with economy, shops, NPCs, quests, and progression
 */
import * as THREE from 'three';

export class CityVillageSystem {
    constructor(scene, modelLoader) {
        this.scene = scene;
        this.modelLoader = modelLoader;
        this.settlements = [];
        this.economy = {
            globalMarket: new Map(),
            tradingPosts: [],
            currencies: { gold: 1, gems: 100, tokens: 1000 }
        };
    }
    
    async createWorld() {
        console.log('🏙️ BUILDING CITIES AND VILLAGES...');
        
        // Major Cities
        await this.createCity('Capital City', { x: 0, z: 0 }, 'large');
        await this.createCity('Port City', { x: 200, z: -100 }, 'medium');
        await this.createCity('Mountain City', { x: -150, z: 150 }, 'medium');
        
        // Villages
        await this.createVillage('Starter Village', { x: 50, z: 50 }, 'farming');
        await this.createVillage('Mining Village', { x: 100, z: 100 }, 'mining');
        await this.createVillage('Forest Village', { x: -80, z: 80 }, 'forestry');
        await this.createVillage('Desert Oasis', { x: 150, z: -50 }, 'trading');
        await this.createVillage('Ice Village', { x: -120, z: 120 }, 'fishing');
        await this.createVillage('Swamp Village', { x: -50, z: -100 }, 'alchemy');
        
        // Outposts
        await this.createOutpost('Border Outpost', { x: 180, z: 180 });
        await this.createOutpost('Desert Outpost', { x: 170, z: -70 });
        
        console.log(`✅ Created ${this.settlements.length} settlements!`);
        
        // Initialize economy
        this.initializeEconomy();
    }
    
    async createCity(name, position, size) {
        console.log(`   🏛️ Building ${name}...`);
        
        const city = {
            name,
            position: new THREE.Vector3(position.x, 0, position.z),
            type: 'city',
            size,
            buildings: [],
            npcs: [],
            shops: [],
            services: [],
            quests: [],
            level: size === 'large' ? 3 : 2
        };
        
        const buildingCount = size === 'large' ? 40 : 25;
        const radius = size === 'large' ? 60 : 40;
        
        // City center - Town Hall
        const townHall = await this.buildStructure('town_hall', position);
        city.buildings.push(townHall);
        
        // Market District (center-north)
        await this.createMarketDistrict(city, { x: position.x, z: position.z + 20 });
        
        // Residential District (rings around center)
        await this.createResidentialDistrict(city, position, radius * 0.6, 15);
        
        // Commercial District (inner ring)
        await this.createCommercialDistrict(city, position, radius * 0.8);
        
        // Industrial District (outer ring)
        if (size === 'large') {
            await this.createIndustrialDistrict(city, position, radius * 0.95);
        }
        
        // City walls and gates
        await this.buildCityWalls(city, position, radius);
        
        // Spawn NPCs (100-150 for large city)
        const npcCount = size === 'large' ? 120 : 60;
        for (let i = 0; i < npcCount; i++) {
            const npc = await this.spawnCityNPC(city, position, radius);
            city.npcs.push(npc);
        }
        
        // Add city services
        city.services = [
            { type: 'bank', name: 'City Bank', position: { x: position.x + 10, z: position.z } },
            { type: 'inn', name: 'Royal Inn', position: { x: position.x - 10, z: position.z } },
            { type: 'guild_hall', name: 'Adventurers Guild', position: { x: position.x, z: position.z + 15 } },
            { type: 'library', name: 'Grand Library', position: { x: position.x + 15, z: position.z + 10 } },
            { type: 'arena', name: 'Battle Arena', position: { x: position.x - 20, z: position.z - 20 } }
        ];
        
        // Generate city quests
        city.quests = this.generateCityQuests(name, 10);
        
        this.settlements.push(city);
        console.log(`      ✅ ${name}: ${buildingCount} buildings, ${npcCount} NPCs`);
        
        return city;
    }
    
    async createMarketDistrict(city, position) {
        const shops = [
            { type: 'general_store', name: "General Goods", stock: 'basic' },
            { type: 'weapon_shop', name: "Steel & Edge", stock: 'weapons' },
            { type: 'armor_shop', name: "Iron Guard", stock: 'armor' },
            { type: 'magic_shop', name: "Mystic Emporium", stock: 'magic' },
            { type: 'potion_shop', name: "Healing Herbs", stock: 'potions' },
            { type: 'jewelry_shop', name: "Golden Touch", stock: 'accessories' },
            { type: 'food_market', name: "Fresh Produce", stock: 'food' },
            { type: 'tool_shop', name: "Crafters Corner", stock: 'tools' }
        ];
        
        for (let i = 0; i < shops.length; i++) {
            const angle = (i / shops.length) * Math.PI * 2;
            const dist = 15;
            const shopPos = {
                x: position.x + Math.cos(angle) * dist,
                z: position.z + Math.sin(angle) * dist
            };
            
            const shop = await this.createShop(shops[i], shopPos);
            city.shops.push(shop);
        }
    }
    
    async createShop(shopData, position) {
        const building = await this.buildStructure('shop', position);
        
        const shop = {
            ...shopData,
            building,
            position: new THREE.Vector3(position.x, 0, position.z),
            inventory: this.generateShopInventory(shopData.stock),
            prices: this.generatePrices(shopData.stock),
            merchant: this.createMerchantNPC(shopData.name),
            open: true,
            reputation: 50
        };
        
        // Add shop sign
        const sign = this.createShopSign(shopData.name);
        sign.position.set(position.x, 3, position.z);
        this.scene.add(sign);
        
        return shop;
    }
    
    generateShopInventory(stock) {
        const inventories = {
            basic: [
                { item: 'health_potion', quantity: 50, quality: 'common' },
                { item: 'bread', quantity: 100, quality: 'common' },
                { item: 'water', quantity: 100, quality: 'common' },
                { item: 'rope', quantity: 20, quality: 'common' },
                { item: 'torch', quantity: 30, quality: 'common' }
            ],
            weapons: [
                { item: 'iron_sword', quantity: 10, quality: 'common' },
                { item: 'steel_sword', quantity: 5, quality: 'uncommon' },
                { item: 'iron_axe', quantity: 8, quality: 'common' },
                { item: 'longbow', quantity: 6, quality: 'common' },
                { item: 'crossbow', quantity: 3, quality: 'uncommon' },
                { item: 'dagger', quantity: 15, quality: 'common' },
                { item: 'legendary_blade', quantity: 1, quality: 'legendary' }
            ],
            armor: [
                { item: 'leather_armor', quantity: 10, quality: 'common' },
                { item: 'iron_armor', quantity: 6, quality: 'uncommon' },
                { item: 'steel_armor', quantity: 3, quality: 'rare' },
                { item: 'leather_helmet', quantity: 12, quality: 'common' },
                { item: 'iron_shield', quantity: 8, quality: 'common' }
            ],
            magic: [
                { item: 'magic_staff', quantity: 5, quality: 'uncommon' },
                { item: 'spell_scroll_fireball', quantity: 10, quality: 'uncommon' },
                { item: 'spell_scroll_heal', quantity: 15, quality: 'common' },
                { item: 'mana_crystal', quantity: 20, quality: 'uncommon' },
                { item: 'enchanted_ring', quantity: 4, quality: 'rare' }
            ],
            potions: [
                { item: 'health_potion', quantity: 100, quality: 'common' },
                { item: 'mana_potion', quantity: 80, quality: 'common' },
                { item: 'stamina_potion', quantity: 60, quality: 'common' },
                { item: 'super_health_potion', quantity: 20, quality: 'uncommon' },
                { item: 'elixir_of_life', quantity: 5, quality: 'rare' }
            ],
            accessories: [
                { item: 'gold_ring', quantity: 10, quality: 'uncommon' },
                { item: 'diamond_necklace', quantity: 5, quality: 'rare' },
                { item: 'emerald_earrings', quantity: 8, quality: 'uncommon' },
                { item: 'magic_amulet', quantity: 3, quality: 'epic' }
            ],
            food: [
                { item: 'bread', quantity: 200, quality: 'common' },
                { item: 'cheese', quantity: 150, quality: 'common' },
                { item: 'meat', quantity: 100, quality: 'common' },
                { item: 'apple', quantity: 300, quality: 'common' },
                { item: 'cooked_steak', quantity: 50, quality: 'uncommon' }
            ],
            tools: [
                { item: 'pickaxe', quantity: 15, quality: 'common' },
                { item: 'axe', quantity: 12, quality: 'common' },
                { item: 'fishing_rod', quantity: 10, quality: 'common' },
                { item: 'hammer', quantity: 8, quality: 'common' }
            ]
        };
        
        return inventories[stock] || inventories.basic;
    }
    
    generatePrices(stock) {
        const basePrices = {
            common: 10,
            uncommon: 50,
            rare: 200,
            epic: 1000,
            legendary: 5000
        };
        
        const multipliers = {
            basic: 1.0,
            weapons: 2.0,
            armor: 2.5,
            magic: 3.0,
            potions: 1.5,
            accessories: 4.0,
            food: 0.5,
            tools: 1.2
        };
        
        return {
            basePrice: basePrices.common * (multipliers[stock] || 1),
            multiplier: multipliers[stock] || 1
        };
    }
    
    async createResidentialDistrict(city, center, radius, count) {
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const dist = radius + (Math.random() - 0.5) * 10;
            const pos = {
                x: center.x + Math.cos(angle) * dist,
                z: center.z + Math.sin(angle) * dist
            };
            
            const house = await this.buildStructure('house', pos);
            city.buildings.push(house);
        }
    }
    
    async createCommercialDistrict(city, center, radius) {
        const businesses = ['tavern', 'inn', 'workshop', 'stable', 'warehouse'];
        
        for (let i = 0; i < businesses.length; i++) {
            const angle = (i / businesses.length) * Math.PI * 2 + Math.PI / 4;
            const pos = {
                x: center.x + Math.cos(angle) * radius,
                z: center.z + Math.sin(angle) * radius
            };
            
            const building = await this.buildStructure(businesses[i], pos);
            city.buildings.push(building);
        }
    }
    
    async createIndustrialDistrict(city, center, radius) {
        const industries = ['forge', 'mill', 'lumber_yard', 'quarry'];
        
        for (let i = 0; i < industries.length; i++) {
            const angle = (i / industries.length) * Math.PI * 2 + Math.PI / 2;
            const pos = {
                x: center.x + Math.cos(angle) * radius,
                z: center.z + Math.sin(angle) * radius
            };
            
            const building = await this.buildStructure(industries[i], pos);
            city.buildings.push(building);
        }
    }
    
    async buildCityWalls(city, center, radius) {
        console.log(`      Building city walls...`);
        
        const wallSegments = 24;
        for (let i = 0; i < wallSegments; i++) {
            const angle = (i / wallSegments) * Math.PI * 2;
            const pos = {
                x: center.x + Math.cos(angle) * radius,
                z: center.z + Math.sin(angle) * radius
            };
            
            const wall = await this.buildStructure('wall', pos);
            wall.rotation.y = angle;
            city.buildings.push(wall);
        }
        
        // Gates (4 cardinal directions)
        const gates = [0, Math.PI/2, Math.PI, Math.PI*3/2];
        for (const angle of gates) {
            const pos = {
                x: center.x + Math.cos(angle) * radius,
                z: center.z + Math.sin(angle) * radius
            };
            
            const gate = await this.buildStructure('gate', pos);
            gate.rotation.y = angle;
            city.buildings.push(gate);
        }
    }
    
    async createVillage(name, position, specialty) {
        console.log(`   🏘️ Building ${name}...`);
        
        const village = {
            name,
            position: new THREE.Vector3(position.x, 0, position.z),
            type: 'village',
            specialty,
            buildings: [],
            npcs: [],
            shops: [],
            level: 1
        };
        
        // Village center
        const center = await this.buildStructure('village_center', position);
        village.buildings.push(center);
        
        // Houses (8-12)
        const houseCount = 8 + Math.floor(Math.random() * 5);
        for (let i = 0; i < houseCount; i++) {
            const angle = (i / houseCount) * Math.PI * 2;
            const dist = 15 + Math.random() * 10;
            const pos = {
                x: position.x + Math.cos(angle) * dist,
                z: position.z + Math.sin(angle) * dist
            };
            
            const house = await this.buildStructure('small_house', pos);
            village.buildings.push(house);
        }
        
        // Specialty buildings
        const specialtyBuildings = this.getSpecialtyBuildings(specialty);
        for (let i = 0; i < specialtyBuildings.length; i++) {
            const angle = (i / specialtyBuildings.length) * Math.PI * 2 + Math.PI;
            const pos = {
                x: position.x + Math.cos(angle) * 20,
                z: position.z + Math.sin(angle) * 20
            };
            
            const building = await this.buildStructure(specialtyBuildings[i], pos);
            village.buildings.push(building);
        }
        
        // Village shop
        const shop = await this.createShop({
            type: 'village_shop',
            name: `${name} Shop`,
            stock: this.getSpecialtyStock(specialty)
        }, { x: position.x + 5, z: position.z });
        village.shops.push(shop);
        
        // NPCs (20-30)
        const npcCount = 20 + Math.floor(Math.random() * 10);
        for (let i = 0; i < npcCount; i++) {
            const npc = await this.spawnVillageNPC(village, position, 25);
            village.npcs.push(npc);
        }
        
        this.settlements.push(village);
        console.log(`      ✅ ${name}: ${village.buildings.length} buildings, ${npcCount} NPCs`);
        
        return village;
    }
    
    getSpecialtyBuildings(specialty) {
        const buildings = {
            farming: ['barn', 'windmill', 'crop_field'],
            mining: ['mine_entrance', 'ore_processor', 'tool_shop'],
            forestry: ['lumber_mill', 'tree_nursery', 'woodworking_shop'],
            trading: ['trading_post', 'warehouse', 'stable'],
            fishing: ['fish_market', 'boat_dock', 'net_storage'],
            alchemy: ['alchemy_lab', 'herb_garden', 'potion_shop']
        };
        return buildings[specialty] || buildings.farming;
    }
    
    getSpecialtyStock(specialty) {
        const stocks = {
            farming: 'food',
            mining: 'tools',
            forestry: 'tools',
            trading: 'basic',
            fishing: 'food',
            alchemy: 'potions'
        };
        return stocks[specialty] || 'basic';
    }
    
    async createOutpost(name, position) {
        const outpost = {
            name,
            position: new THREE.Vector3(position.x, 0, position.z),
            type: 'outpost',
            buildings: [],
            npcs: [],
            garrison: 10
        };
        
        // Watchtower
        const tower = await this.buildStructure('watchtower', position);
        outpost.buildings.push(tower);
        
        // Barracks
        const barracks = await this.buildStructure('barracks', { x: position.x + 5, z: position.z });
        outpost.buildings.push(barracks);
        
        // Guards
        for (let i = 0; i < 10; i++) {
            const angle = (i / 10) * Math.PI * 2;
            const npc = await this.spawnGuard(position, angle * 10);
            outpost.npcs.push(npc);
        }
        
        this.settlements.push(outpost);
        return outpost;
    }
    
    async buildStructure(type, position) {
        // Try to load real building model
        try {
            const modelPath = `/assets/models/buildings/${type}.gltf`;
            const model = await this.modelLoader.load(modelPath);
            if (model) {
                model.position.set(position.x, 0, position.z);
                model.scale.set(1, 1, 1);
                this.scene.add(model);
                return model;
            }
        } catch (error) {
            // Fallback: create procedural building
            return this.createProceduralBuilding(type, position);
        }
    }
    
    createProceduralBuilding(type, position) {
        const building = new THREE.Group();
        building.position.set(position.x, 0, position.z);
        
        const sizes = {
            town_hall: { w: 15, h: 12, d: 15, color: 0xccaa66 },
            house: { w: 5, h: 4, d: 5, color: 0x8b6914 },
            small_house: { w: 4, h: 3, d: 4, color: 0x8b6914 },
            shop: { w: 6, h: 5, d: 5, color: 0xa0826d },
            wall: { w: 3, h: 6, d: 1, color: 0x808080 },
            gate: { w: 4, h: 8, d: 1, color: 0x654321 },
            watchtower: { w: 4, h: 15, d: 4, color: 0x808080 },
            barn: { w: 8, h: 6, d: 6, color: 0xa0522d },
            forge: { w: 6, h: 5, d: 6, color: 0x4a4a4a }
        };
        
        const size = sizes[type] || sizes.house;
        
        // Base
        const base = new THREE.Mesh(
            new THREE.BoxGeometry(size.w, size.h, size.d),
            new THREE.MeshStandardMaterial({ color: size.color })
        );
        base.position.y = size.h / 2;
        base.castShadow = true;
        base.receiveShadow = true;
        building.add(base);
        
        // Roof
        const roof = new THREE.Mesh(
            new THREE.ConeGeometry(size.w * 0.7, size.h * 0.4, 4),
            new THREE.MeshStandardMaterial({ color: 0x654321 })
        );
        roof.position.y = size.h + size.h * 0.2;
        roof.rotation.y = Math.PI / 4;
        building.add(roof);
        
        building.userData.type = type;
        building.userData.interactive = true;
        
        this.scene.add(building);
        return building;
    }
    
    createShopSign(name) {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(name, canvas.width / 2, canvas.height / 2 + 16);
        
        const texture = new THREE.CanvasTexture(canvas);
        const sign = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture }));
        sign.scale.set(4, 1, 1);
        
        return sign;
    }
    
    async spawnCityNPC(city, center, radius) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * radius;
        const position = new THREE.Vector3(
            center.x + Math.cos(angle) * dist,
            0,
            center.z + Math.sin(angle) * dist
        );
        
        // Create NPC (placeholder)
        const npc = new THREE.Group();
        npc.position.copy(position);
        
        const body = new THREE.Mesh(
            new THREE.CapsuleGeometry(0.4, 1.2, 4, 8),
            new THREE.MeshStandardMaterial({ color: 0x8b6914 })
        );
        body.position.y = 1;
        npc.add(body);
        
        npc.userData = {
            type: 'citizen',
            city: city.name,
            schedule: 'wander',
            dialogue: ['Hello!', 'Nice weather today.', 'Welcome to ' + city.name]
        };
        
        this.scene.add(npc);
        return npc;
    }
    
    async spawnVillageNPC(village, center, radius) {
        return this.spawnCityNPC(village, center, radius);
    }
    
    async spawnGuard(position, angle) {
        const guardPos = new THREE.Vector3(
            position.x + Math.cos(angle) * 8,
            0,
            position.z + Math.sin(angle) * 8
        );
        
        const guard = new THREE.Group();
        guard.position.copy(guardPos);
        
        const body = new THREE.Mesh(
            new THREE.CapsuleGeometry(0.4, 1.2, 4, 8),
            new THREE.MeshStandardMaterial({ color: 0x4169e1 })
        );
        body.position.y = 1;
        guard.add(body);
        
        guard.userData = {
            type: 'guard',
            patrol: true,
            dialogue: ['Halt!', 'State your business.', 'Stay safe, traveler.']
        };
        
        this.scene.add(guard);
        return guard;
    }
    
    createMerchantNPC(shopName) {
        return {
            name: `${shopName} Merchant`,
            type: 'merchant',
            dialogue: [
                'Welcome to my shop!',
                'Looking for something special?',
                'Best prices in town!'
            ]
        };
    }
    
    generateCityQuests(cityName, count) {
        const quests = [];
        const questTypes = [
            'delivery', 'gather', 'combat', 'escort', 'craft', 'explore'
        ];
        
        for (let i = 0; i < count; i++) {
            const type = questTypes[Math.floor(Math.random() * questTypes.length)];
            quests.push({
                id: `${cityName}_quest_${i}`,
                name: `${cityName} ${type} Quest #${i + 1}`,
                type,
                level: 1 + i,
                rewards: { gold: 100 * (i + 1), xp: 500 * (i + 1) }
            });
        }
        
        return quests;
    }
    
    initializeEconomy() {
        console.log('💰 Initializing global economy...');
        
        // Set base prices for all items
        this.economy.globalMarket.set('iron_sword', 500);
        this.economy.globalMarket.set('health_potion', 50);
        this.economy.globalMarket.set('bread', 5);
        
        // Economy will fluctuate based on supply/demand
        setInterval(() => this.updateEconomy(), 60000); // Update every minute
        
        console.log('   ✅ Economy initialized with dynamic pricing');
    }
    
    updateEconomy() {
        // Prices fluctuate ±20%
        this.economy.globalMarket.forEach((price, item) => {
            const change = (Math.random() - 0.5) * 0.2;
            this.economy.globalMarket.set(item, Math.floor(price * (1 + change)));
        });
    }
    
    getSettlementAt(position, radius = 50) {
        return this.settlements.find(s => 
            s.position.distanceTo(position) < radius
        );
    }
    
    update(delta) {
        // Animate NPCs
        this.settlements.forEach(settlement => {
            settlement.npcs.forEach(npc => {
                if (npc.userData.schedule === 'wander') {
                    npc.position.x += (Math.random() - 0.5) * 0.01;
                    npc.position.z += (Math.random() - 0.5) * 0.01;
                }
            });
        });
    }
}
