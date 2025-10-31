/**
import { logger } from '../core/Logger.js';
 * World Population System - Fill world with NPCs, enemies, quests, activities
 * Makes the game world feel alive and immersive
 */
import * as THREE from 'three';

export class WorldPopulationSystem {
    constructor(scene, modelLoader) {
        this.scene = scene;
        this.modelLoader = modelLoader;
        this.npcs = [];
        this.enemies = [];
        this.questGivers = [];
        this.merchants = [];
        this.activities = [];
    }
    
    async populate() {
        logger.info('🌍 POPULATING WORLD WITH LIFE...');
        
        // Spawn NPCs in villages and towns
        await this.spawnVillageNPCs();
        
        // Spawn enemies across biomes
        await this.spawnWorldEnemies();
        
        // Spawn quest givers
        await this.spawnQuestGivers();
        
        // Spawn merchants and vendors
        await this.spawnMerchants();
        
        // Create activities and points of interest
        await this.createActivities();
        
        logger.info(`✅ World populated with ${this.npcs.length} NPCs, ${this.enemies.length} enemies`);
    }
    
    async spawnVillageNPCs() {
        logger.info('👥 Spawning village NPCs...');
        
        const villagePositions = [
            { x: 0, z: 50, name: 'Starting Village' },
            { x: 100, z: 0, name: 'Mining Town' },
            { x: -100, z: 100, name: 'Forest Settlement' }
        ];
        
        for (const village of villagePositions) {
            // 10-15 NPCs per village
            const npcCount = 10 + Math.floor(Math.random() * 5);
            
            for (let i = 0; i < npcCount; i++) {
                const angle = (i / npcCount) * Math.PI * 2;
                const dist = 5 + Math.random() * 15;
                const position = new THREE.Vector3(
                    village.x + Math.cos(angle) * dist,
                    0,
                    village.z + Math.sin(angle) * dist
                );
                
                const npcTypes = ['villager', 'farmer', 'guard', 'child', 'elder'];
                const npcType = npcTypes[Math.floor(Math.random() * npcTypes.length)];
                
                const npc = await this.createNPC(npcType, position, village.name);
                this.npcs.push(npc);
            }
        }
        
        logger.info(`   ✅ Spawned ${this.npcs.length} NPCs in 3 villages`);
    }
    
    async createNPC(type, position, village) {
        const npc = new THREE.Group();
        npc.position.copy(position);
        
        // Try to load real character model
        try {
            const model = await this.modelLoader.load('/assets/models/characters/male_base.gltf');
            if (model) {
                model.scale.set(1, 1, 1);
                npc.add(model);
            }
        } catch (error) {
            // Fallback: create simple character
            const bodyGeom = new THREE.CapsuleGeometry(0.4, 1.2, 4, 8);
            const bodyMat = new THREE.MeshStandardMaterial({ 
                color: this.getNPCColor(type)
            });
            const body = new THREE.Mesh(bodyGeom, bodyMat);
            body.position.y = 1;
            npc.add(body);
            
            // Head
            const headGeom = new THREE.SphereGeometry(0.3, 8, 8);
            const head = new THREE.Mesh(headGeom, bodyMat);
            head.position.y = 2;
            npc.add(head);
        }
        
        // Add name tag
        const nameTag = this.createNameTag(this.generateNPCName(type));
        nameTag.position.y = 3;
        npc.add(nameTag);
        
        // Add interaction indicator
        const indicator = new THREE.Sprite(
            new THREE.SpriteMaterial({ color: 0x00ff00 })
        );
        indicator.scale.set(0.3, 0.3, 1);
        indicator.position.y = 2.5;
        npc.add(indicator);
        
        // NPC data
        npc.userData = {
            type: type,
            name: this.generateNPCName(type),
            village: village,
            interactive: true,
            dialogue: this.getDialogue(type),
            behavior: this.getBehavior(type),
            schedule: this.getSchedule(type)
        };
        
        this.scene.add(npc);
        return npc;
    }
    
    getNPCColor(type) {
        const colors = {
            villager: 0x8b6914,
            farmer: 0x228b22,
            guard: 0x4169e1,
            child: 0xffa500,
            elder: 0x808080
        };
        return colors[type] || 0x8b6914;
    }
    
    generateNPCName(type) {
        const names = {
            villager: ['Tom', 'Sarah', 'Jack', 'Emma', 'Bob'],
            farmer: ['Old MacDonald', 'Farmer Joe', 'Mary Green'],
            guard: ['Captain Steel', 'Guard Marcus', 'Sir Valor'],
            child: ['Timmy', 'Lucy', 'Bobby'],
            elder: ['Elder Wisdom', 'Granny Rose', 'Old Man River']
        };
        const list = names[type] || names.villager;
        return list[Math.floor(Math.random() * list.length)];
    }
    
    getDialogue(type) {
        const dialogues = {
            villager: [
                "Welcome to our village!",
                "Have you seen the market today?",
                "The weather has been strange lately..."
            ],
            farmer: [
                "My crops are growing well this season!",
                "Need some fresh vegetables?",
                "The harvest moon is coming soon."
            ],
            guard: [
                "Stay safe out there, traveler.",
                "Bandits have been spotted nearby.",
                "I protect this village with my life!"
            ],
            child: [
                "Wanna play tag?",
                "I saw a cool bug earlier!",
                "My mom makes the best cookies!"
            ],
            elder: [
                "In my day, things were different...",
                "The old legends speak of great heroes...",
                "Time moves slowly in these peaceful times."
            ]
        };
        return dialogues[type] || dialogues.villager;
    }
    
    getBehavior(type) {
        return {
            wander: true,
            wanderRadius: type === 'guard' ? 20 : 10,
            speed: type === 'child' ? 0.02 : 0.01,
            lookAtPlayer: true
        };
    }
    
    getSchedule(type) {
        // NPCs have daily schedules
        return {
            morning: type === 'farmer' ? 'farming' : 'wandering',
            afternoon: 'socializing',
            evening: type === 'guard' ? 'patrolling' : 'resting',
            night: 'sleeping'
        };
    }
    
    async spawnWorldEnemies() {
        logger.info('👹 Spawning world enemies...');
        
        const biomeEnemies = [
            // Mystic Forest
            { biome: 'forest', x: -50, z: -50, type: 'wolf', count: 8 },
            { biome: 'forest', x: -30, z: -70, type: 'goblin', count: 5 },
            
            // Crimson Peaks
            { biome: 'mountain', x: 100, z: 50, type: 'dragon', count: 2 },
            { biome: 'mountain', x: 120, z: 70, type: 'fire_elemental', count: 6 },
            
            // Dark areas
            { biome: 'dark', x: -100, z: -100, type: 'shadow_beast', count: 10 },
            { biome: 'dark', x: -80, z: -120, type: 'skeleton', count: 15 },
            
            // Desert
            { biome: 'desert', x: 150, z: -50, type: 'scorpion', count: 12 },
            { biome: 'desert', x: 170, z: -30, type: 'bandit', count: 8 },
            
            // Ice
            { biome: 'ice', x: -150, z: 100, type: 'ice_troll', count: 5 },
            { biome: 'ice', x: -130, z: 120, type: 'yeti', count: 3 },
        ];
        
        for (const spawn of biomeEnemies) {
            for (let i = 0; i < spawn.count; i++) {
                const offsetX = (Math.random() - 0.5) * 20;
                const offsetZ = (Math.random() - 0.5) * 20;
                const position = new THREE.Vector3(
                    spawn.x + offsetX,
                    0,
                    spawn.z + offsetZ
                );
                
                const enemy = await this.createEnemy(spawn.type, position);
                this.enemies.push(enemy);
            }
        }
        
        logger.info(`   ✅ Spawned ${this.enemies.length} enemies across the world`);
    }
    
    async createEnemy(type, position) {
        const enemy = new THREE.Group();
        enemy.position.copy(position);
        
        // Try to load real enemy model
        try {
            const model = await this.modelLoader.load('/assets/models/enemies/skeleton.gltf');
            if (model) {
                model.scale.set(1, 1, 1);
                enemy.add(model);
            }
        } catch (error) {
            // Fallback: create enemy based on type
            const size = this.getEnemySize(type);
            const color = this.getEnemyColor(type);
            
            const bodyGeom = new THREE.CapsuleGeometry(size * 0.4, size * 1.2, 4, 8);
            const bodyMat = new THREE.MeshStandardMaterial({ color });
            const body = new THREE.Mesh(bodyGeom, bodyMat);
            body.position.y = size;
            enemy.add(body);
        }
        
        // Health bar above enemy
        const healthBar = this.createHealthBar();
        healthBar.position.y = 3;
        enemy.add(healthBar);
        
        // Red glow to indicate enemy
        const glow = new THREE.PointLight(0xff0000, 1, 5);
        glow.position.y = 2;
        enemy.add(glow);
        
        // Enemy data
        enemy.userData = {
            type: type,
            enemy: true,
            health: this.getEnemyHealth(type),
            maxHealth: this.getEnemyHealth(type),
            damage: this.getEnemyDamage(type),
            level: this.getEnemyLevel(type),
            loot: this.getEnemyLoot(type),
            aggressive: true,
            aggroRange: 15,
            behavior: this.getEnemyBehavior(type)
        };
        
        this.scene.add(enemy);
        return enemy;
    }
    
    getEnemySize(type) {
        const sizes = {
            wolf: 0.8, goblin: 1, skeleton: 1, bandit: 1,
            dragon: 3, fire_elemental: 1.5, shadow_beast: 1.2,
            scorpion: 0.6, ice_troll: 2, yeti: 2.5
        };
        return sizes[type] || 1;
    }
    
    getEnemyColor(type) {
        const colors = {
            wolf: 0x8b4513, goblin: 0x228b22, skeleton: 0xeeeeee,
            bandit: 0x8b0000, dragon: 0xff4500, fire_elemental: 0xff6600,
            shadow_beast: 0x2f0f3f, scorpion: 0xdaa520, ice_troll: 0x87ceeb,
            yeti: 0xffffff
        };
        return colors[type] || 0xff0000;
    }
    
    getEnemyHealth(type) {
        const health = {
            wolf: 50, goblin: 80, skeleton: 100, bandit: 120,
            dragon: 500, fire_elemental: 200, shadow_beast: 150,
            scorpion: 60, ice_troll: 300, yeti: 400
        };
        return health[type] || 100;
    }
    
    getEnemyDamage(type) {
        const damage = {
            wolf: 10, goblin: 15, skeleton: 20, bandit: 25,
            dragon: 100, fire_elemental: 40, shadow_beast: 35,
            scorpion: 12, ice_troll: 50, yeti: 60
        };
        return damage[type] || 20;
    }
    
    getEnemyLevel(type) {
        const levels = {
            wolf: 5, goblin: 8, skeleton: 10, bandit: 12,
            dragon: 50, fire_elemental: 30, shadow_beast: 25,
            scorpion: 7, ice_troll: 35, yeti: 40
        };
        return levels[type] || 10;
    }
    
    getEnemyLoot(type) {
        const loot = {
            wolf: ['wolf_pelt', 'meat'],
            goblin: ['gold_coins', 'rusty_sword'],
            skeleton: ['bones', 'old_sword'],
            bandit: ['gold_coins', 'leather_armor'],
            dragon: ['dragon_scale', 'rare_gem', 'magic_weapon'],
            fire_elemental: ['fire_essence', 'mana_crystal'],
            shadow_beast: ['dark_essence', 'shadow_gem'],
            scorpion: ['scorpion_tail', 'venom'],
            ice_troll: ['ice_crystal', 'troll_hide'],
            yeti: ['yeti_fur', 'frost_gem']
        };
        return loot[type] || ['gold_coins'];
    }
    
    getEnemyBehavior(type) {
        return {
            patrol: true,
            patrolRadius: 20,
            attackRange: 3,
            chaseRange: 15,
            returnToSpawn: true
        };
    }
    
    async spawnQuestGivers() {
        logger.info('📜 Spawning quest givers...');
        
        const questGiverData = [
            { x: 0, z: 55, name: 'Village Elder', quest: 'main_story_1' },
            { x: 10, z: 60, name: 'Blacksmith', quest: 'forge_weapons' },
            { x: -10, z: 50, name: 'Farmer', quest: 'harvest_crops' },
            { x: 100, z: 5, name: 'Mine Foreman', quest: 'clear_mines' },
            { x: -95, z: 105, name: 'Forest Ranger', quest: 'protect_forest' }
        ];
        
        for (const data of questGiverData) {
            const position = new THREE.Vector3(data.x, 0, data.z);
            const questGiver = await this.createQuestGiver(data, position);
            this.questGivers.push(questGiver);
        }
        
        logger.info(`   ✅ Spawned ${this.questGivers.length} quest givers`);
    }
    
    async createQuestGiver(data, position) {
        const npc = await this.createNPC('elder', position, 'Quest Giver');
        
        // Add quest marker above head
        const marker = new THREE.Sprite(
            new THREE.SpriteMaterial({ color: 0xffff00 })
        );
        marker.scale.set(0.5, 0.5, 1);
        marker.position.y = 3.5;
        npc.add(marker);
        
        npc.userData.questGiver = true;
        npc.userData.questData = {
            id: data.quest,
            name: this.getQuestName(data.quest),
            description: this.getQuestDescription(data.quest),
            objectives: this.getQuestObjectives(data.quest),
            rewards: this.getQuestRewards(data.quest)
        };
        
        return npc;
    }
    
    getQuestName(id) {
        const names = {
            main_story_1: 'The Beginning of an Adventure',
            forge_weapons: 'Forge the Legendary Blade',
            harvest_crops: 'Help with the Harvest',
            clear_mines: 'Clear the Infested Mines',
            protect_forest: 'Protect the Ancient Forest'
        };
        return names[id] || 'Unknown Quest';
    }
    
    getQuestDescription(id) {
        const descriptions = {
            main_story_1: 'The village elder needs your help to uncover an ancient mystery.',
            forge_weapons: 'The blacksmith needs rare materials to forge a legendary weapon.',
            harvest_crops: 'The harvest season has arrived and the farmer needs extra hands.',
            clear_mines: 'Monsters have infested the mines. Clear them out!',
            protect_forest: 'Dark forces threaten the ancient forest. Protect it!'
        };
        return descriptions[id] || 'Help the NPC with their task.';
    }
    
    getQuestObjectives(id) {
        const objectives = {
            main_story_1: ['Talk to Elder', 'Visit Ancient Ruins', 'Defeat Shadow Boss'],
            forge_weapons: ['Gather 10 Iron Ore', 'Find Dragon Scale', 'Return to Blacksmith'],
            harvest_crops: ['Harvest 20 Wheat', 'Harvest 15 Corn', 'Return crops to Farmer'],
            clear_mines: ['Kill 15 Goblins', 'Defeat Mine Boss', 'Report to Foreman'],
            protect_forest: ['Kill 10 Shadow Beasts', 'Cleanse 3 Corrupted Trees']
        };
        return objectives[id] || ['Complete the task'];
    }
    
    getQuestRewards(id) {
        const rewards = {
            main_story_1: { xp: 1000, gold: 500, item: 'ancient_amulet' },
            forge_weapons: { xp: 2000, gold: 1000, item: 'legendary_sword' },
            harvest_crops: { xp: 500, gold: 200, item: 'farmers_hat' },
            clear_mines: { xp: 1500, gold: 800, item: 'miners_pickaxe' },
            protect_forest: { xp: 1800, gold: 900, item: 'forest_bow' }
        };
        return rewards[id] || { xp: 100, gold: 50 };
    }
    
    async spawnMerchants() {
        logger.info('💰 Spawning merchants...');
        
        const merchantData = [
            { x: 5, z: 52, type: 'general', name: 'General Store' },
            { x: 15, z: 58, type: 'weapons', name: 'Weapon Shop' },
            { x: -5, z: 48, type: 'potions', name: 'Alchemy Shop' },
            { x: 105, z: 10, type: 'mining', name: 'Mining Supplies' }
        ];
        
        for (const data of merchantData) {
            const position = new THREE.Vector3(data.x, 0, data.z);
            const merchant = await this.createMerchant(data, position);
            this.merchants.push(merchant);
        }
        
        logger.info(`   ✅ Spawned ${this.merchants.length} merchants`);
    }
    
    async createMerchant(data, position) {
        const npc = await this.createNPC('villager', position, 'Merchant');
        
        // Add shop marker
        const marker = new THREE.Sprite(
            new THREE.SpriteMaterial({ color: 0x00ffff })
        );
        marker.scale.set(0.5, 0.5, 1);
        marker.position.y = 3.5;
        npc.add(marker);
        
        npc.userData.merchant = true;
        npc.userData.shopData = {
            type: data.type,
            name: data.name,
            inventory: this.getMerchantInventory(data.type)
        };
        
        return npc;
    }
    
    getMerchantInventory(type) {
        const inventories = {
            general: [
                { item: 'health_potion', price: 50 },
                { item: 'bread', price: 10 },
                { item: 'water', price: 5 },
                { item: 'rope', price: 20 }
            ],
            weapons: [
                { item: 'iron_sword', price: 500 },
                { item: 'steel_axe', price: 600 },
                { item: 'wooden_bow', price: 300 }
            ],
            potions: [
                { item: 'health_potion', price: 50 },
                { item: 'mana_potion', price: 60 },
                { item: 'stamina_potion', price: 40 }
            ],
            mining: [
                { item: 'pickaxe', price: 200 },
                { item: 'torch', price: 10 },
                { item: 'dynamite', price: 100 }
            ]
        };
        return inventories[type] || inventories.general;
    }
    
    async createActivities() {
        logger.info('🎯 Creating world activities...');
        
        // Fishing spots
        this.createFishingSpots();
        
        // Mining nodes
        this.createMiningNodes();
        
        // Treasure chests
        this.createTreasureChests();
        
        // Rare spawns
        this.createRareSpawns();
        
        logger.info(`   ✅ Created ${this.activities.length} activities`);
    }
    
    createFishingSpots() {
        const spots = [
            { x: -20, z: 80, type: 'lake' },
            { x: 50, z: -30, type: 'river' },
            { x: -60, z: -10, type: 'pond' }
        ];
        
        spots.forEach(spot => {
            const position = new THREE.Vector3(spot.x, 0, spot.z);
            const fishingSpot = this.createActivityMarker(position, 'fishing', 0x00aaff);
            this.activities.push({
                type: 'fishing',
                position,
                marker: fishingSpot,
                data: { fishType: spot.type }
            });
        });
    }
    
    createMiningNodes() {
        const nodes = [
            { x: 110, z: 20, ore: 'iron' },
            { x: 115, z: 15, ore: 'gold' },
            { x: 108, z: 25, ore: 'diamond' }
        ];
        
        nodes.forEach(node => {
            const position = new THREE.Vector3(node.x, 0, node.z);
            const miningNode = this.createActivityMarker(position, 'mining', 0xffd700);
            this.activities.push({
                type: 'mining',
                position,
                marker: miningNode,
                data: { oreType: node.ore }
            });
        });
    }
    
    createTreasureChests() {
        for (let i = 0; i < 10; i++) {
            const x = (Math.random() - 0.5) * 300;
            const z = (Math.random() - 0.5) * 300;
            const position = new THREE.Vector3(x, 0, z);
            const chest = this.createActivityMarker(position, 'treasure', 0xffff00);
            this.activities.push({
                type: 'treasure',
                position,
                marker: chest,
                data: { loot: ['gold', 'gems', 'rare_item'] }
            });
        }
    }
    
    createRareSpawns() {
        const rares = [
            { x: -150, z: -150, name: 'Ancient Dragon' },
            { x: 200, z: 200, name: 'Shadow Lord' },
            { x: -200, z: 200, name: 'Ice Queen' }
        ];
        
        rares.forEach(rare => {
            const position = new THREE.Vector3(rare.x, 0, rare.z);
            const spawn = this.createActivityMarker(position, 'rare_boss', 0xff00ff);
            this.activities.push({
                type: 'rare_boss',
                position,
                marker: spawn,
                data: { bossName: rare.name }
            });
        });
    }
    
    createActivityMarker(position, type, color) {
        const marker = new THREE.Mesh(
            new THREE.SphereGeometry(0.5, 16, 16),
            new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.7 })
        );
        marker.position.copy(position);
        marker.position.y = 1;
        marker.userData.activityType = type;
        this.scene.add(marker);
        return marker;
    }
    
    createNameTag(name) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 64;
        
        context.fillStyle = 'rgba(0, 0, 0, 0.8)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        context.fillStyle = 'white';
        context.font = 'bold 24px Arial';
        context.textAlign = 'center';
        context.fillText(name, canvas.width / 2, canvas.height / 2 + 8);
        
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(2, 0.5, 1);
        
        return sprite;
    }
    
    createHealthBar() {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 128;
        canvas.height = 16;
        
        context.fillStyle = 'red';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        context.fillStyle = 'green';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(1, 0.2, 1);
        
        return sprite;
    }
    
    update(delta) {
        // Update NPCs (wander, look at player)
        this.npcs.forEach(npc => {
            if (npc.userData.behavior && npc.userData.behavior.wander) {
                // Simple wandering behavior
                npc.position.x += (Math.random() - 0.5) * npc.userData.behavior.speed;
                npc.position.z += (Math.random() - 0.5) * npc.userData.behavior.speed;
            }
        });
        
        // Update enemies (patrol, chase player)
        this.enemies.forEach(enemy => {
            if (enemy.userData.behavior && enemy.userData.behavior.patrol) {
                // Simple patrol
                enemy.position.x += (Math.random() - 0.5) * 0.02;
                enemy.position.z += (Math.random() - 0.5) * 0.02;
            }
        });
        
        // Animate activity markers
        this.activities.forEach(activity => {
            if (activity.marker) {
                activity.marker.position.y = 1 + Math.sin(Date.now() * 0.002) * 0.2;
                activity.marker.rotation.y += delta;
            }
        });
    }
    
    getNearestNPC(position, maxDist = 5) {
        let nearest = null;
        let minDist = maxDist;
        
        this.npcs.forEach(npc => {
            const dist = position.distanceTo(npc.position);
            if (dist < minDist) {
                minDist = dist;
                nearest = npc;
            }
        });
        
        return nearest;
    }
    
    getNearestEnemy(position, maxDist = 100) {
        let nearest = null;
        let minDist = maxDist;
        
        this.enemies.forEach(enemy => {
            const dist = position.distanceTo(enemy.position);
            if (dist < minDist) {
                minDist = dist;
                nearest = enemy;
            }
        });
        
        return nearest;
    }
}
