/**
 * Enemy Camp System - Spawn enemy camps throughout world with loot
 */
import * as THREE from 'three';

export class EnemyCampSystem {
    constructor(scene, modelLoader) {
        this.scene = scene;
        this.modelLoader = modelLoader;
        this.camps = [];
        this.campTypes = [
            {
                name: 'Bandit Camp',
                enemies: ['skeleton', 'skeleton', 'skeleton_warrior'],
                loot: ['gold', 'sword', 'armor'],
                structures: ['tent', 'campfire', 'chest'],
                size: 15
            },
            {
                name: 'Orc Outpost',
                enemies: ['orc', 'orc', 'orc_warrior', 'orc_chief'],
                loot: ['gold', 'axe', 'potion', 'rare_gem'],
                structures: ['hut', 'campfire', 'chest', 'weapon_rack'],
                size: 20
            },
            {
                name: 'Necromancer Shrine',
                enemies: ['skeleton', 'skeleton', 'skeleton_mage'],
                loot: ['magic_staff', 'scroll', 'potion'],
                structures: ['altar', 'brazier', 'chest'],
                size: 12
            },
            {
                name: 'Goblin Den',
                enemies: ['goblin', 'goblin', 'goblin', 'goblin_chief'],
                loot: ['gold', 'dagger', 'leather_armor'],
                structures: ['tent', 'campfire', 'barrel', 'chest'],
                size: 18
            }
        ];
    }
    
    async spawnCamp(position, biome) {
        const campType = this.campTypes[Math.floor(Math.random() * this.campTypes.length)];
        const camp = {
            position: position.clone(),
            type: campType,
            enemies: [],
            structures: [],
            loot: [],
            discovered: false
        };
        
        // Create camp area
        const campRadius = campType.size;
        
        // Add campfire at center
        const campfire = await this.createCampfire(position);
        if (campfire) {
            this.scene.add(campfire);
            camp.structures.push(campfire);
        }
        
        // Add structures around campfire
        for (let i = 0; i < campType.structures.length; i++) {
            const angle = (i / campType.structures.length) * Math.PI * 2;
            const dist = campRadius * 0.6;
            const structPos = new THREE.Vector3(
                position.x + Math.cos(angle) * dist,
                position.y,
                position.z + Math.sin(angle) * dist
            );
            
            const structure = await this.createStructure(campType.structures[i], structPos);
            if (structure) {
                this.scene.add(structure);
                camp.structures.push(structure);
            }
        }
        
        // Spawn enemies
        for (let i = 0; i < campType.enemies.length; i++) {
            const angle = (i / campType.enemies.length) * Math.PI * 2 + Math.PI;
            const dist = campRadius * 0.8;
            const enemyPos = new THREE.Vector3(
                position.x + Math.cos(angle) * dist,
                position.y,
                position.z + Math.sin(angle) * dist
            );
            
            const enemy = await this.spawnEnemy(campType.enemies[i], enemyPos);
            if (enemy) {
                this.scene.add(enemy);
                camp.enemies.push(enemy);
            }
        }
        
        // Add loot chests
        const chestPos = new THREE.Vector3(
            position.x + campRadius * 0.3,
            position.y,
            position.z
        );
        const chest = await this.createLootChest(chestPos, campType.loot);
        if (chest) {
            this.scene.add(chest);
            camp.loot.push(chest);
        }
        
        // Add marker
        const marker = this.createMarker(position, campType.name);
        this.scene.add(marker);
        camp.marker = marker;
        
        this.camps.push(camp);
        console.log(`✅ Spawned ${campType.name} at (${position.x}, ${position.z})`);
        
        return camp;
    }
    
    async createCampfire(position) {
        // Create campfire with logs and fire particles
        const campfire = new THREE.Group();
        campfire.position.copy(position);
        
        // Logs arranged in square
        const logGeom = new THREE.CylinderGeometry(0.2, 0.2, 2, 8);
        const logMat = new THREE.MeshStandardMaterial({ color: 0x4a2511 });
        
        for (let i = 0; i < 4; i++) {
            const log = new THREE.Mesh(logGeom, logMat);
            log.rotation.z = Math.PI / 2;
            log.rotation.y = (i * Math.PI) / 2;
            log.position.y = 0.2;
            campfire.add(log);
        }
        
        // Fire glow
        const fireGlow = new THREE.PointLight(0xff6600, 2, 10);
        fireGlow.position.y = 1;
        campfire.add(fireGlow);
        
        // Particle system for fire
        const fireParticles = this.createFireParticles();
        fireParticles.position.y = 0.5;
        campfire.add(fireParticles);
        
        campfire.userData.interactive = true;
        campfire.userData.type = 'campfire';
        
        return campfire;
    }
    
    createFireParticles() {
        const particleCount = 20;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 0.5;
            positions[i * 3 + 1] = Math.random() * 2;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
        }
        
        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const particleMat = new THREE.PointsMaterial({
            color: 0xff6600,
            size: 0.2,
            transparent: true,
            opacity: 0.8
        });
        
        return new THREE.Points(particles, particleMat);
    }
    
    async createStructure(type, position) {
        let structure;
        
        switch(type) {
            case 'tent':
                structure = this.createTent(position);
                break;
            case 'hut':
                structure = this.createHut(position);
                break;
            case 'chest':
                structure = this.createChest(position);
                break;
            case 'barrel':
                structure = this.createBarrel(position);
                break;
            case 'weapon_rack':
                structure = this.createWeaponRack(position);
                break;
            case 'altar':
                structure = this.createAltar(position);
                break;
            case 'brazier':
                structure = this.createBrazier(position);
                break;
            default:
                structure = this.createTent(position);
        }
        
        if (structure) {
            structure.userData.interactive = true;
            structure.userData.type = type;
        }
        
        return structure;
    }
    
    createTent(position) {
        const tent = new THREE.Group();
        tent.position.copy(position);
        
        // Tent body (triangular prism)
        const shape = new THREE.Shape();
        shape.moveTo(-2, 0);
        shape.lineTo(2, 0);
        shape.lineTo(0, 2);
        shape.lineTo(-2, 0);
        
        const extrudeSettings = { depth: 3, bevelEnabled: false };
        const tentGeom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        const tentMat = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
        const tentMesh = new THREE.Mesh(tentGeom, tentMat);
        tentMesh.rotation.y = Math.PI / 2;
        tent.add(tentMesh);
        
        return tent;
    }
    
    createHut(position) {
        const hut = new THREE.Group();
        hut.position.copy(position);
        
        // Walls
        const wallGeom = new THREE.BoxGeometry(3, 2.5, 3);
        const wallMat = new THREE.MeshStandardMaterial({ color: 0x8b6914 });
        const walls = new THREE.Mesh(wallGeom, wallMat);
        walls.position.y = 1.25;
        hut.add(walls);
        
        // Roof
        const roofGeom = new THREE.ConeGeometry(2.5, 1.5, 4);
        const roofMat = new THREE.MeshStandardMaterial({ color: 0x654321 });
        const roof = new THREE.Mesh(roofGeom, roofMat);
        roof.position.y = 3.25;
        roof.rotation.y = Math.PI / 4;
        hut.add(roof);
        
        return hut;
    }
    
    createChest(position) {
        const chest = new THREE.Group();
        chest.position.copy(position);
        
        const chestGeom = new THREE.BoxGeometry(1, 0.8, 0.6);
        const chestMat = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
        const chestMesh = new THREE.Mesh(chestGeom, chestMat);
        chestMesh.position.y = 0.4;
        chest.add(chestMesh);
        
        // Glow to show it's lootable
        const glow = new THREE.PointLight(0xffff00, 1, 3);
        glow.position.y = 1;
        chest.add(glow);
        
        chest.userData.lootable = true;
        
        return chest;
    }
    
    createBarrel(position) {
        const barrel = new THREE.Mesh(
            new THREE.CylinderGeometry(0.4, 0.4, 0.8, 16),
            new THREE.MeshStandardMaterial({ color: 0x8b4513 })
        );
        barrel.position.copy(position);
        barrel.position.y = 0.4;
        return barrel;
    }
    
    createWeaponRack(position) {
        const rack = new THREE.Group();
        rack.position.copy(position);
        
        // Vertical posts
        const postGeom = new THREE.CylinderGeometry(0.1, 0.1, 2, 8);
        const postMat = new THREE.MeshStandardMaterial({ color: 0x654321 });
        
        const post1 = new THREE.Mesh(postGeom, postMat);
        post1.position.set(-0.5, 1, 0);
        rack.add(post1);
        
        const post2 = new THREE.Mesh(postGeom, postMat);
        post2.position.set(0.5, 1, 0);
        rack.add(post2);
        
        // Horizontal bar
        const barGeom = new THREE.CylinderGeometry(0.05, 0.05, 1.2, 8);
        const bar = new THREE.Mesh(barGeom, postMat);
        bar.rotation.z = Math.PI / 2;
        bar.position.y = 1.5;
        rack.add(bar);
        
        return rack;
    }
    
    createAltar(position) {
        const altar = new THREE.Group();
        altar.position.copy(position);
        
        const baseGeom = new THREE.BoxGeometry(2, 0.5, 1);
        const baseMat = new THREE.MeshStandardMaterial({ color: 0x444444 });
        const base = new THREE.Mesh(baseGeom, baseMat);
        base.position.y = 0.25;
        altar.add(base);
        
        // Purple glow
        const glow = new THREE.PointLight(0x9400D3, 2, 5);
        glow.position.y = 1;
        altar.add(glow);
        
        return altar;
    }
    
    createBrazier(position) {
        const brazier = new THREE.Group();
        brazier.position.copy(position);
        
        const bowlGeom = new THREE.CylinderGeometry(0.4, 0.3, 0.4, 16);
        const bowlMat = new THREE.MeshStandardMaterial({ color: 0x666666 });
        const bowl = new THREE.Mesh(bowlGeom, bowlMat);
        bowl.position.y = 1.5;
        brazier.add(bowl);
        
        const poleGeom = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 8);
        const pole = new THREE.Mesh(poleGeom, bowlMat);
        pole.position.y = 0.75;
        brazier.add(pole);
        
        // Fire
        const fire = new THREE.PointLight(0xff6600, 2, 8);
        fire.position.y = 2;
        brazier.add(fire);
        
        return brazier;
    }
    
    async spawnEnemy(type, position) {
        // Use actual skeleton models from assets
        try {
            const enemyModel = await this.modelLoader.load('/assets/models/enemies/skeleton.gltf');
            if (enemyModel) {
                enemyModel.position.copy(position);
                enemyModel.scale.set(1, 1, 1);
                enemyModel.userData.enemy = true;
                enemyModel.userData.type = type;
                enemyModel.userData.health = 100;
                return enemyModel;
            }
        } catch (error) {
            // Fallback to procedural enemy
            const enemyGeom = new THREE.CapsuleGeometry(0.5, 1.5, 4, 8);
            const enemyMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
            const enemy = new THREE.Mesh(enemyGeom, enemyMat);
            enemy.position.copy(position);
            enemy.position.y = 1;
            enemy.userData.enemy = true;
            enemy.userData.type = type;
            enemy.userData.health = 100;
            return enemy;
        }
    }
    
    async createLootChest(position, loot) {
        const chest = this.createChest(position);
        chest.userData.loot = loot;
        return chest;
    }
    
    createMarker(position, name) {
        // Create floating marker above camp
        const markerGeom = new THREE.SphereGeometry(0.3, 8, 8);
        const markerMat = new THREE.MeshBasicMaterial({ 
            color: 0xff0000,
            transparent: true,
            opacity: 0.8
        });
        const marker = new THREE.Mesh(markerGeom, markerMat);
        marker.position.set(position.x, position.y + 5, position.z);
        marker.userData.campName = name;
        return marker;
    }
    
    async populateWorld(biomes) {
        console.log('🏕️ Spawning enemy camps throughout world...');
        
        // Spawn camps in each biome
        const campsPerBiome = 3;
        let totalCamps = 0;
        
        for (const biome of biomes) {
            for (let i = 0; i < campsPerBiome; i++) {
                const angle = (i / campsPerBiome) * Math.PI * 2;
                const dist = 30 + Math.random() * 40;
                const position = new THREE.Vector3(
                    biome.position.x + Math.cos(angle) * dist,
                    0,
                    biome.position.z + Math.sin(angle) * dist
                );
                
                await this.spawnCamp(position, biome.name);
                totalCamps++;
            }
        }
        
        console.log(`✅ Spawned ${totalCamps} enemy camps across ${biomes.length} biomes!`);
    }
    
    update(delta) {
        // Animate fire particles and markers
        this.camps.forEach(camp => {
            if (camp.marker) {
                camp.marker.position.y += Math.sin(Date.now() * 0.003) * 0.01;
            }
        });
    }
    
    getNearestCamp(position, maxDistance = 50) {
        let nearest = null;
        let minDist = maxDistance;
        
        this.camps.forEach(camp => {
            const dist = position.distanceTo(camp.position);
            if (dist < minDist) {
                minDist = dist;
                nearest = camp;
            }
        });
        
        return nearest;
    }
}
