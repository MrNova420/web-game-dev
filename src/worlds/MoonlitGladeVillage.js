/**
import { logger } from '../core/Logger.js';
 * Moonlit Glade Village - Complete Starting Village
 * Built using Medieval Village MegaKit (176 building models)
 * 
 * Features:
 * - Central marketplace
 * - Tavern (The Mystical Tankard)
 * - Blacksmith (Everforge Smithy)
 * - General Store (Glade Goods)
 * - Alchemy Shop (Moonwater Potions)
 * - Village houses (10+)
 * - Quest NPCs
 * - Training area
 * - Decorative props throughout
 */

import * as THREE from 'three';
import { assetRegistry } from '../core/AssetRegistry.js';

export class MoonlitGladeVillage {
    constructor(scene, modelLoader) {
        this.scene = scene;
        this.modelLoader = modelLoader;
        this.assetRegistry = assetRegistry;
        
        this.center = { x: 50, z: 50 }; // Village center location
        this.buildings = [];
        this.props = [];
        this.npcs = [];
        this.lights = [];
        
        // Building types we need
        this.buildingTypes = {
            tavern: null,
            blacksmith: null,
            generalStore: null,
            alchemyShop: null,
            houses: [],
            marketplace: []
        };
    }
    
    /**
     * Build the complete village
     */
    async build() {
        logger.info('🏘️ Building Moonlit Glade Village...');
        
        try {
            // Create village layout
            this.createVillageGround();
            
            // Build main buildings
            await this.buildTavern();
            await this.buildBlacksmith();
            await this.buildGeneralStore();
            await this.buildAlchemyShop();
            
            // Build houses around the village
            await this.buildHouses();
            
            // Create central marketplace
            await this.buildMarketplace();
            
            // Add decorative props
            await this.addVillageProps();
            
            // Add lighting
            this.addVillageLighting();
            
            // Spawn NPCs
            await this.spawnVillageNPCs();
            
            logger.info('✅ Moonlit Glade Village complete!');
            logger.info(`   - Buildings: ${this.buildings.length}`);
            logger.info(`   - Props: ${this.props.length}`);
            logger.info(`   - NPCs: ${this.npcs.length}`);
            logger.info(`   - Lights: ${this.lights.length}`);
            
        } catch (error) {
            logger.error('Error building village:', error);
        }
    }
    
    /**
     * Create the village ground area
     */
    createVillageGround() {
        // Clear village area - flatter ground
        const clearRadius = 40;
        const geometry = new THREE.CircleGeometry(clearRadius, 64);
        const material = new THREE.MeshStandardMaterial({
            color: 0x8b7355,
            roughness: 0.9,
            metalness: 0.1
        });
        
        const ground = new THREE.Mesh(geometry, material);
        ground.rotation.x = -Math.PI / 2;
        ground.position.set(this.center.x, 0.1, this.center.z);
        ground.receiveShadow = true;
        
        this.scene.add(ground);
        
        // Add cobblestone path texture effect with smaller stones
        for (let i = 0; i < 50; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * clearRadius * 0.9;
            const x = this.center.x + Math.cos(angle) * radius;
            const z = this.center.z + Math.sin(angle) * radius;
            
            const stoneGeom = new THREE.CircleGeometry(0.2 + Math.random() * 0.3, 6);
            const stoneMat = new THREE.MeshStandardMaterial({
                color: 0x888888,
                roughness: 0.8
            });
            const stone = new THREE.Mesh(stoneGeom, stoneMat);
            stone.rotation.x = -Math.PI / 2;
            stone.position.set(x, 0.11, z);
            this.scene.add(stone);
        }
        
        logger.info('   ✅ Village ground created');
    }
    
    /**
     * Build The Mystical Tankard Tavern
     */
    async buildTavern() {
        logger.info('   🍺 Building tavern...');
        
        const tavernPos = {
            x: this.center.x - 15,
            z: this.center.z - 15
        };
        
        // Create tavern building (fallback)
        const building = await this.createBuilding(
            tavernPos,
            { width: 8, height: 5, depth: 10 },
            0x8b5a3c,
            'The Mystical Tankard'
        );
        
        this.buildingTypes.tavern = building;
        this.buildings.push(building);
        
        // Add tavern sign
        await this.addSign(
            { x: tavernPos.x, y: 4, z: tavernPos.z - 6 },
            '🍺 Tavern'
        );
        
        // Add tavern props - barrels, tables, chairs
        const tavernProps = [
            { type: 'containers', offset: { x: -3, z: 4 } }, // Barrel
            { type: 'containers', offset: { x: -2, z: 4 } }, // Barrel
            { type: 'furniture', offset: { x: 2, z: 2 } }, // Table
            { type: 'furniture', offset: { x: -2, z: 2 } }, // Table
        ];
        
        for (const propDef of tavernProps) {
            try {
                const propPath = this.assetRegistry.getProp(propDef.type);
                if (propPath) {
                    const prop = await this.modelLoader.load(propPath);
                    if (prop) {
                        prop.position.set(
                            tavernPos.x + propDef.offset.x,
                            0.2,
                            tavernPos.z + propDef.offset.z
                        );
                        prop.scale.setScalar(0.8);
                        prop.castShadow = true;
                        this.scene.add(prop);
                        this.props.push(prop);
                    }
                }
            } catch (error) {
                // Continue with other props
            }
        }
    }
    
    /**
     * Build Everforge Smithy
     */
    async buildBlacksmith() {
        logger.info('   ⚒️ Building blacksmith...');
        
        const smithyPos = {
            x: this.center.x + 15,
            z: this.center.z - 15
        };
        
        const building = await this.createBuilding(
            smithyPos,
            { width: 7, height: 4, depth: 8 },
            0x4a4a4a,
            'Everforge Smithy'
        );
        
        this.buildingTypes.blacksmith = building;
        this.buildings.push(building);
        
        // Add anvil, forge, weapon rack props
        const smithyProps = [
            { type: 'tools', offset: { x: 0, z: 3 } }, // Anvil/tools
            { type: 'items', offset: { x: -2, z: 2 } }, // Items
            { type: 'containers', offset: { x: 2, z: 3 } }, // Storage
        ];
        
        for (const propDef of smithyProps) {
            try {
                const propPath = this.assetRegistry.getProp(propDef.type);
                if (propPath) {
                    const prop = await this.modelLoader.load(propPath);
                    if (prop) {
                        prop.position.set(
                            smithyPos.x + propDef.offset.x,
                            0.2,
                            smithyPos.z + propDef.offset.z
                        );
                        prop.scale.setScalar(0.8);
                        prop.castShadow = true;
                        this.scene.add(prop);
                        this.props.push(prop);
                    }
                }
            } catch (error) {
                // Continue
            }
        }
        
        // Add glowing forge light
        const forgeLight = new THREE.PointLight(0xff6600, 2, 10);
        forgeLight.position.set(smithyPos.x, 2, smithyPos.z + 3);
        this.scene.add(forgeLight);
        this.lights.push(forgeLight);
    }
    
    /**
     * Build Glade Goods General Store
     */
    async buildGeneralStore() {
        logger.info('   🏪 Building general store...');
        
        const storePos = {
            x: this.center.x - 15,
            z: this.center.z + 15
        };
        
        const building = await this.createBuilding(
            storePos,
            { width: 7, height: 4, depth: 7 },
            0x7c9c3b,
            'Glade Goods'
        );
        
        this.buildingTypes.generalStore = building;
        this.buildings.push(building);
        
        // Add store props - shelves, crates, goods
        const storeProps = [
            { type: 'containers', offset: { x: -2, z: 2 } },
            { type: 'containers', offset: { x: 2, z: 2 } },
            { type: 'items', offset: { x: 0, z: 3 } },
        ];
        
        for (const propDef of storeProps) {
            try {
                const propPath = this.assetRegistry.getProp(propDef.type);
                if (propPath) {
                    const prop = await this.modelLoader.load(propPath);
                    if (prop) {
                        prop.position.set(
                            storePos.x + propDef.offset.x,
                            0.2,
                            storePos.z + propDef.offset.z
                        );
                        prop.scale.setScalar(0.7);
                        prop.castShadow = true;
                        this.scene.add(prop);
                        this.props.push(prop);
                    }
                }
            } catch (error) {
                // Continue
            }
        }
    }
    
    /**
     * Build Moonwater Potions Alchemy Shop
     */
    async buildAlchemyShop() {
        logger.info('   ⚗️ Building alchemy shop...');
        
        const shopPos = {
            x: this.center.x + 15,
            z: this.center.z + 15
        };
        
        const building = await this.createBuilding(
            shopPos,
            { width: 6, height: 4, depth: 6 },
            0x663399,
            'Moonwater Potions'
        );
        
        this.buildingTypes.alchemyShop = building;
        this.buildings.push(building);
        
        // Add alchemy props - potions, bottles, shelves
        const alchemyProps = [
            { type: 'items', offset: { x: -1, z: 2 } },
            { type: 'items', offset: { x: 1, z: 2 } },
            { type: 'items', offset: { x: 0, z: 2.5 } },
        ];
        
        for (const propDef of alchemyProps) {
            try {
                const propPath = this.assetRegistry.getProp(propDef.type);
                if (propPath) {
                    const prop = await this.modelLoader.load(propPath);
                    if (prop) {
                        prop.position.set(
                            shopPos.x + propDef.offset.x,
                            0.2,
                            shopPos.z + propDef.offset.z
                        );
                        prop.scale.setScalar(0.6);
                        prop.castShadow = true;
                        this.scene.add(prop);
                        this.props.push(prop);
                    }
                }
            } catch (error) {
                // Continue
            }
        }
        
        // Add mystical purple light
        const alchemyLight = new THREE.PointLight(0x9933ff, 1.5, 12);
        alchemyLight.position.set(shopPos.x, 3, shopPos.z);
        this.scene.add(alchemyLight);
        this.lights.push(alchemyLight);
    }
    
    /**
     * Build residential houses around village
     */
    async buildHouses() {
        logger.info('   🏠 Building houses...');
        
        const houseCount = 10;
        const houseRadius = 25;
        
        for (let i = 0; i < houseCount; i++) {
            const angle = (i / houseCount) * Math.PI * 2;
            const x = this.center.x + Math.cos(angle) * houseRadius;
            const z = this.center.z + Math.sin(angle) * houseRadius;
            
            // Skip if too close to main buildings
            if (this.isTooClose(x, z, [
                this.buildingTypes.tavern,
                this.buildingTypes.blacksmith,
                this.buildingTypes.generalStore,
                this.buildingTypes.alchemyShop
            ])) {
                continue;
            }
            
            const house = await this.createBuilding(
                { x, z },
                { 
                    width: 4 + Math.random() * 2, 
                    height: 3 + Math.random(), 
                    depth: 4 + Math.random() * 2 
                },
                this.getRandomHouseColor(),
                `House ${i + 1}`
            );
            
            house.rotation.y = angle + Math.PI;
            this.buildingTypes.houses.push(house);
            this.buildings.push(house);
        }
        
        logger.info(`   ✅ Built ${this.buildingTypes.houses.length} houses`);
    }
    
    /**
     * Build central marketplace with stalls
     */
    async buildMarketplace() {
        logger.info('   🏛️ Building marketplace...');
        
        const stallCount = 6;
        const stallRadius = 8;
        
        for (let i = 0; i < stallCount; i++) {
            const angle = (i / stallCount) * Math.PI * 2;
            const x = this.center.x + Math.cos(angle) * stallRadius;
            const z = this.center.z + Math.sin(angle) * stallRadius;
            
            // Create market stall
            const stall = await this.createMarketStall({ x, z }, angle);
            this.buildingTypes.marketplace.push(stall);
            this.buildings.push(stall);
            
            // Add goods on stall
            try {
                const goods = this.assetRegistry.getProp('items');
                if (goods) {
                    const prop = await this.modelLoader.load(goods);
                    if (prop) {
                        prop.position.set(x, 1, z);
                        prop.scale.setScalar(0.5);
                        this.scene.add(prop);
                        this.props.push(prop);
                    }
                }
            } catch (error) {
                // Continue
            }
        }
        
        logger.info(`   ✅ Built ${stallCount} market stalls`);
    }
    
    /**
     * Add decorative props throughout village
     */
    async addVillageProps() {
        logger.info('   🎨 Adding decorative props...');
        
        const propLocations = [
            // Barrels and crates scattered around
            { type: 'containers', count: 15, radius: 35 },
            // Decorative items
            { type: 'decorations', count: 10, radius: 30 },
            // Tools and items
            { type: 'tools', count: 8, radius: 25 }
        ];
        
        for (const propDef of propLocations) {
            for (let i = 0; i < propDef.count; i++) {
                try {
                    const propPath = this.assetRegistry.getProp(propDef.type);
                    if (propPath) {
                        const prop = await this.modelLoader.load(propPath);
                        if (prop) {
                            const angle = Math.random() * Math.PI * 2;
                            const radius = Math.random() * propDef.radius;
                            const x = this.center.x + Math.cos(angle) * radius;
                            const z = this.center.z + Math.sin(angle) * radius;
                            
                            prop.position.set(x, 0.1, z);
                            prop.rotation.y = Math.random() * Math.PI * 2;
                            prop.scale.setScalar(0.5 + Math.random() * 0.5);
                            prop.castShadow = true;
                            
                            this.scene.add(prop);
                            this.props.push(prop);
                        }
                    }
                } catch (error) {
                    // Continue with other props
                }
            }
        }
        
        logger.info(`   ✅ Added ${this.props.length} decorative props`);
    }
    
    /**
     * Add village lighting - lanterns, torches, ambient lights
     */
    addVillageLighting() {
        logger.info('   💡 Adding village lighting...');
        
        // Central fountain/well light
        const centralLight = new THREE.PointLight(0xffffcc, 2, 25);
        centralLight.position.set(this.center.x, 3, this.center.z);
        this.scene.add(centralLight);
        this.lights.push(centralLight);
        
        // Perimeter lanterns
        const lanternCount = 12;
        const lanternRadius = 35;
        
        for (let i = 0; i < lanternCount; i++) {
            const angle = (i / lanternCount) * Math.PI * 2;
            const x = this.center.x + Math.cos(angle) * lanternRadius;
            const z = this.center.z + Math.sin(angle) * lanternRadius;
            
            const lantern = new THREE.PointLight(0xffaa44, 1, 15);
            lantern.position.set(x, 3, z);
            this.scene.add(lantern);
            this.lights.push(lantern);
            
            // Create lantern post (simple)
            const postGeom = new THREE.CylinderGeometry(0.1, 0.1, 3, 8);
            const postMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
            const post = new THREE.Mesh(postGeom, postMat);
            post.position.set(x, 1.5, z);
            post.castShadow = true;
            this.scene.add(post);
        }
        
        logger.info(`   ✅ Added ${this.lights.length} lights`);
    }
    
    /**
     * Spawn village NPCs
     */
    async spawnVillageNPCs() {
        logger.info('   👥 Spawning NPCs...');
        
        const npcDefinitions = [
            { name: 'Innkeeper Elara', location: this.buildingTypes.tavern, role: 'quest_giver' },
            { name: 'Blacksmith Magnus', location: this.buildingTypes.blacksmith, role: 'vendor' },
            { name: 'Merchant Goldwyn', location: this.buildingTypes.generalStore, role: 'vendor' },
            { name: 'Alchemist Lyra', location: this.buildingTypes.alchemyShop, role: 'vendor' },
            { name: 'Guard Captain', location: null, role: 'quest_giver' },
            { name: 'Village Elder', location: null, role: 'quest_giver' }
        ];
        
        for (const npcDef of npcDefinitions) {
            const npc = await this.createNPC(npcDef);
            if (npc) {
                this.npcs.push(npc);
            }
        }
        
        logger.info(`   ✅ Spawned ${this.npcs.length} NPCs`);
    }
    
    /**
     * Helper: Create a building (fallback version)
     */
    async createBuilding(position, dimensions, color, name) {
        const group = new THREE.Group();
        group.name = name;
        
        // Walls
        const wallGeom = new THREE.BoxGeometry(
            dimensions.width, 
            dimensions.height, 
            dimensions.depth
        );
        const wallMat = new THREE.MeshStandardMaterial({ 
            color: color,
            roughness: 0.8
        });
        const walls = new THREE.Mesh(wallGeom, wallMat);
        walls.position.y = dimensions.height / 2;
        walls.castShadow = true;
        walls.receiveShadow = true;
        group.add(walls);
        
        // Roof
        const roofGeom = new THREE.ConeGeometry(
            Math.max(dimensions.width, dimensions.depth) * 0.7, 
            dimensions.height * 0.6, 
            4
        );
        const roofMat = new THREE.MeshStandardMaterial({ 
            color: 0x8b4513,
            roughness: 0.9
        });
        const roof = new THREE.Mesh(roofGeom, roofMat);
        roof.position.y = dimensions.height + dimensions.height * 0.3;
        roof.rotation.y = Math.PI / 4;
        roof.castShadow = true;
        group.add(roof);
        
        // Door
        const doorGeom = new THREE.BoxGeometry(1.2, 2, 0.2);
        const doorMat = new THREE.MeshStandardMaterial({ color: 0x654321 });
        const door = new THREE.Mesh(doorGeom, doorMat);
        door.position.set(0, 1, dimensions.depth / 2 + 0.1);
        group.add(door);
        
        group.position.set(position.x, 0, position.z);
        this.scene.add(group);
        
        return group;
    }
    
    /**
     * Helper: Create market stall
     */
    async createMarketStall(position, rotation) {
        const group = new THREE.Group();
        
        // Stall table
        const tableGeom = new THREE.BoxGeometry(3, 0.2, 2);
        const tableMat = new THREE.MeshStandardMaterial({ color: 0x8b6f47 });
        const table = new THREE.Mesh(tableGeom, tableMat);
        table.position.y = 1;
        table.castShadow = true;
        group.add(table);
        
        // Legs
        const legGeom = new THREE.CylinderGeometry(0.1, 0.1, 1, 8);
        const legMat = new THREE.MeshStandardMaterial({ color: 0x654321 });
        const legPositions = [
            [-1.3, 0.5, -0.8], [1.3, 0.5, -0.8],
            [-1.3, 0.5, 0.8], [1.3, 0.5, 0.8]
        ];
        
        for (const pos of legPositions) {
            const leg = new THREE.Mesh(legGeom, legMat);
            leg.position.set(...pos);
            group.add(leg);
        }
        
        // Canopy
        const canopyGeom = new THREE.BoxGeometry(3.5, 0.1, 2.5);
        const canopyMat = new THREE.MeshStandardMaterial({ 
            color: 0xff6347,
            transparent: true,
            opacity: 0.8
        });
        const canopy = new THREE.Mesh(canopyGeom, canopyMat);
        canopy.position.y = 2.5;
        group.add(canopy);
        
        group.position.set(position.x, 0, position.z);
        group.rotation.y = rotation;
        this.scene.add(group);
        
        return group;
    }
    
    /**
     * Helper: Create NPC (simple representation)
     */
    async createNPC(npcDef) {
        // Simple NPC representation
        const geometry = new THREE.CapsuleGeometry(0.4, 1.2, 8, 16);
        const material = new THREE.MeshStandardMaterial({ 
            color: this.getNPCColor(npcDef.role)
        });
        const npc = new THREE.Mesh(geometry, material);
        
        // Position near their building or in marketplace
        let pos;
        if (npcDef.location && npcDef.location.position) {
            pos = {
                x: npcDef.location.position.x + 3,
                z: npcDef.location.position.z + 3
            };
        } else {
            // Random position in marketplace
            const angle = Math.random() * Math.PI * 2;
            pos = {
                x: this.center.x + Math.cos(angle) * 5,
                z: this.center.z + Math.sin(angle) * 5
            };
        }
        
        npc.position.set(pos.x, 1, pos.z);
        npc.castShadow = true;
        npc.receiveShadow = true;
        npc.userData = { name: npcDef.name, role: npcDef.role };
        
        this.scene.add(npc);
        return npc;
    }
    
    /**
     * Helper: Add sign
     */
    async addSign(position, text) {
        // Simple sign post
        const postGeom = new THREE.CylinderGeometry(0.1, 0.1, 3, 8);
        const postMat = new THREE.MeshStandardMaterial({ color: 0x654321 });
        const post = new THREE.Mesh(postGeom, postMat);
        post.position.set(position.x, 1.5, position.z);
        this.scene.add(post);
        
        // Sign board
        const signGeom = new THREE.BoxGeometry(2, 1, 0.2);
        const signMat = new THREE.MeshStandardMaterial({ color: 0x8b6f47 });
        const sign = new THREE.Mesh(signGeom, signMat);
        sign.position.set(position.x, position.y, position.z);
        this.scene.add(sign);
    }
    
    /**
     * Helper: Check if position is too close to existing buildings
     */
    isTooClose(x, z, buildings, minDistance = 12) {
        for (const building of buildings) {
            if (!building || !building.position) continue;
            const dx = building.position.x - x;
            const dz = building.position.z - z;
            const dist = Math.sqrt(dx * dx + dz * dz);
            if (dist < minDistance) return true;
        }
        return false;
    }
    
    /**
     * Helper: Get random house color
     */
    getRandomHouseColor() {
        const colors = [
            0x8b7355, // Brown
            0x7c9c3b, // Green
            0x9b7653, // Tan
            0xa0826d, // Light brown
            0x8b6f47  // Wood
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    /**
     * Helper: Get NPC color by role
     */
    getNPCColor(role) {
        const colors = {
            quest_giver: 0xffaa00,
            vendor: 0x4169e1,
            guard: 0xcc3333,
            villager: 0x77aa77
        };
        return colors[role] || colors.villager;
    }
    
    /**
     * Cleanup village
     */
    destroy() {
        [...this.buildings, ...this.props, ...this.npcs].forEach(obj => {
            this.scene.remove(obj);
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) obj.material.dispose();
        });
        
        this.lights.forEach(light => this.scene.remove(light));
        
        this.buildings = [];
        this.props = [];
        this.npcs = [];
        this.lights = [];
    }
}
