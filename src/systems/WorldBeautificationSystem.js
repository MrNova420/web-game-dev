/**
 * World Beautification System  
 * Phase 9.3 - Environmental details, animations, architecture, and immersive world elements
 */

import * as THREE from 'three';

export class WorldBeautificationSystem {
    constructor(scene) {
        this.scene = scene;
        
        // Environmental elements
        this.flora = [];
        this.fauna = [];
        this.structures = [];
        this.decorations = [];
        this.interactiveObjects = [];
        
        // Weather and atmosphere
        this.weatherParticles = [];
        this.celestialObjects = [];
        
        // Animation systems
        this.animatedElements = [];
        
        this.initialize();
    }
    
    initialize() {
        console.log('🌸 World Beautification System initialized');
        
        // Create beautiful world elements
        this.createFlora();
        this.createFauna();
        this.createArchitecture();
        this.createDecorations();
        this.createCelestialObjects();
        this.createAtmosphericEffects();
    }
    
    /**
     * Create animated flora (grass, flowers, trees)
     */
    createFlora() {
        // Swaying grass fields
        this.createGrassField(new THREE.Vector3(0, 0, 0), 50, 50);
        
        // Blooming flowers
        this.createFlowerGarden(new THREE.Vector3(10, 0, 10), 20);
        
        // Rustling trees
        this.createMagicalTrees(new THREE.Vector3(-20, 0, -20), 10);
        
        // Glowing mushrooms
        this.createGlowingMushrooms(new THREE.Vector3(15, 0, -15), 15);
        
        // Cherry blossom trees
        this.createCherryBlossoms(new THREE.Vector3(-10, 0, 10), 5);
    }
    
    /**
     * Create ambient fauna (butterflies, birds, fireflies)
     */
    createFauna() {
        // Butterflies
        for (let i = 0; i < 20; i++) {
            this.createButterfly(this.getRandomPosition(30));
        }
        
        // Birds
        for (let i = 0; i < 10; i++) {
            this.createBird(this.getRandomPosition(50));
        }
        
        // Fireflies (at night)
        for (let i = 0; i < 50; i++) {
            this.createFirefly(this.getRandomPosition(40));
        }
        
        // Magical spirits
        for (let i = 0; i < 15; i++) {
            this.createSpirit(this.getRandomPosition(35));
        }
    }
    
    /**
     * Create fantasy architecture
     */
    createArchitecture() {
        // Central tower
        this.createFantasyTower(new THREE.Vector3(0, 0, 0), 20);
        
        // Floating platforms
        for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2;
            const radius = 30;
            this.createFloatingPlatform(
                new THREE.Vector3(
                    Math.cos(angle) * radius,
                    10 + i * 3,
                    Math.sin(angle) * radius
                )
            );
        }
        
        // Magical bridges
        this.createMagicalBridge(
            new THREE.Vector3(-20, 5, 0),
            new THREE.Vector3(20, 5, 0)
        );
        
        // Market stalls
        this.createMarketArea(new THREE.Vector3(25, 0, 25));
        
        // Shrine
        this.createShrine(new THREE.Vector3(-25, 0, -25));
    }
    
    /**
     * Create decorative elements
     */
    createDecorations() {
        // Floating crystals
        for (let i = 0; i < 20; i++) {
            this.createFloatingCrystal(this.getRandomPosition(40));
        }
        
        // Magical lanterns
        for (let i = 0; i < 30; i++) {
            this.createMagicalLantern(this.getRandomPosition(45));
        }
        
        // Fountains
        this.createMagicalFountain(new THREE.Vector3(0, 0, 15));
        
        // Campfires
        this.createCampfire(new THREE.Vector3(10, 0, -10));
        
        // Banners and flags
        for (let i = 0; i < 10; i++) {
            this.createBanner(this.getRandomPosition(35));
        }
        
        // Statues
        for (let i = 0; i < 5; i++) {
            this.createStatue(this.getRandomPosition(30));
        }
        
        // Gardens
        this.createMagicalGarden(new THREE.Vector3(-15, 0, 15));
    }
    
    /**
     * Create celestial objects
     */
    createCelestialObjects() {
        // Floating islands in sky
        for (let i = 0; i < 3; i++) {
            this.createFloatingIsland(
                new THREE.Vector3(
                    (Math.random() - 0.5) * 100,
                    50 + Math.random() * 30,
                    (Math.random() - 0.5) * 100
                )
            );
        }
        
        // Magical aurora
        this.createAurora();
        
        // Shooting stars
        this.createShootingStarSystem();
    }
    
    /**
     * Create atmospheric effects
     */
    createAtmosphericEffects() {
        // Ambient particles (dust, magic sparkles)
        this.createAmbientParticles();
        
        // God rays
        this.createGodRays();
        
        // Mist/fog layers
        this.createMysticalMist();
    }
    
    // ===== IMPLEMENTATION METHODS =====
    
    /**
     * Create swaying grass field
     */
    createGrassField(position, width, depth) {
        const grassCount = width * depth * 2;
        const grassField = {
            type: 'grass',
            position: position,
            blades: [],
            windPhase: Math.random() * Math.PI * 2
        };
        
        for (let i = 0; i < grassCount; i++) {
            const blade = this.createGrassBlade(
                position.clone().add(new THREE.Vector3(
                    (Math.random() - 0.5) * width,
                    0,
                    (Math.random() - 0.5) * depth
                ))
            );
            grassField.blades.push(blade);
            this.scene.add(blade.mesh);
        }
        
        this.flora.push(grassField);
        this.animatedElements.push(grassField);
        
        return grassField;
    }
    
    createGrassBlade(position) {
        const height = 0.3 + Math.random() * 0.3;
        const geometry = new THREE.PlaneGeometry(0.05, height);
        const material = new THREE.MeshLambertMaterial({
            color: new THREE.Color(0x228b22).lerp(new THREE.Color(0x90ee90), Math.random()),
            side: THREE.DoubleSide
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(position);
        mesh.position.y = height / 2;
        mesh.rotation.y = Math.random() * Math.PI * 2;
        
        return {
            mesh: mesh,
            basePosition: position.clone(),
            swayPhase: Math.random() * Math.PI * 2,
            swaySpeed: 1 + Math.random() * 0.5
        };
    }
    
    /**
     * Create flower garden
     */
    createFlowerGarden(position, count) {
        const garden = {
            type: 'flowers',
            position: position,
            flowers: []
        };
        
        for (let i = 0; i < count; i++) {
            const flower = this.createFlower(
                position.clone().add(new THREE.Vector3(
                    (Math.random() - 0.5) * 10,
                    0,
                    (Math.random() - 0.5) * 10
                ))
            );
            garden.flowers.push(flower);
            this.scene.add(flower.mesh);
        }
        
        this.flora.push(garden);
        this.animatedElements.push(garden);
        
        return garden;
    }
    
    createFlower(position) {
        const colors = [0xff69b4, 0xff1493, 0xffd700, 0xff6347, 0x9370db, 0x00bfff];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // Stem
        const stemGeom = new THREE.CylinderGeometry(0.02, 0.02, 0.4);
        const stemMat = new THREE.MeshLambertMaterial({ color: 0x228b22 });
        const stem = new THREE.Mesh(stemGeom, stemMat);
        stem.position.copy(position);
        stem.position.y = 0.2;
        
        // Petals
        const petalGeom = new THREE.CircleGeometry(0.15, 6);
        const petalMat = new THREE.MeshLambertMaterial({ color: color });
        const petals = new THREE.Mesh(petalGeom, petalMat);
        petals.position.y = 0.4;
        petals.rotation.x = -Math.PI / 2;
        stem.add(petals);
        
        this.scene.add(stem);
        
        return {
            mesh: stem,
            petals: petals,
            bloomPhase: Math.random() * Math.PI * 2,
            baseScale: 1
        };
    }
    
    /**
     * Create magical trees
     */
    createMagicalTrees(position, count) {
        const trees = {
            type: 'trees',
            position: position,
            trees: []
        };
        
        for (let i = 0; i < count; i++) {
            const tree = this.createMagicalTree(
                position.clone().add(new THREE.Vector3(
                    (Math.random() - 0.5) * 20,
                    0,
                    (Math.random() - 0.5) * 20
                ))
            );
            trees.trees.push(tree);
        }
        
        this.flora.push(trees);
        this.animatedElements.push(trees);
        
        return trees;
    }
    
    createMagicalTree(position) {
        const tree = new THREE.Group();
        
        // Trunk
        const trunkGeom = new THREE.CylinderGeometry(0.3, 0.5, 5);
        const trunkMat = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
        const trunk = new THREE.Mesh(trunkGeom, trunkMat);
        trunk.position.y = 2.5;
        tree.add(trunk);
        
        // Canopy
        const canopyGeom = new THREE.SphereGeometry(3, 16, 16);
        const canopyMat = new THREE.MeshLambertMaterial({
            color: 0x32cd32,
            emissive: 0x00ff00,
            emissiveIntensity: 0.1
        });
        const canopy = new THREE.Mesh(canopyGeom, canopyMat);
        canopy.position.y = 6;
        tree.add(canopy);
        
        // Magical leaves (particles)
        const leaves = [];
        for (let i = 0; i < 50; i++) {
            const leafGeom = new THREE.PlaneGeometry(0.1, 0.1);
            const leafMat = new THREE.MeshBasicMaterial({
                color: 0x90ee90,
                transparent: true,
                opacity: 0.8
            });
            const leaf = new THREE.Mesh(leafGeom, leafMat);
            leaf.position.set(
                (Math.random() - 0.5) * 6,
                6 + (Math.random() - 0.5) * 3,
                (Math.random() - 0.5) * 6
            );
            tree.add(leaf);
            leaves.push({ mesh: leaf, phase: Math.random() * Math.PI * 2 });
        }
        
        tree.position.copy(position);
        this.scene.add(tree);
        
        return {
            mesh: tree,
            canopy: canopy,
            leaves: leaves,
            sway: 0
        };
    }
    
    /**
     * Create glowing mushrooms
     */
    createGlowingMushrooms(position, count) {
        for (let i = 0; i < count; i++) {
            const mushroom = this.createMushroom(
                position.clone().add(new THREE.Vector3(
                    (Math.random() - 0.5) * 10,
                    0,
                    (Math.random() - 0.5) * 10
                ))
            );
            this.scene.add(mushroom.mesh);
            this.flora.push(mushroom);
            this.animatedElements.push(mushroom);
        }
    }
    
    createMushroom(position) {
        const mushroom = new THREE.Group();
        
        // Stem
        const stemGeom = new THREE.CylinderGeometry(0.1, 0.15, 0.4);
        const stemMat = new THREE.MeshLambertMaterial({ color: 0xfff8dc });
        const stem = new THREE.Mesh(stemGeom, stemMat);
        stem.position.y = 0.2;
        mushroom.add(stem);
        
        // Cap
        const capGeom = new THREE.SphereGeometry(0.3, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
        const capMat = new THREE.MeshLambertMaterial({
            color: 0xff1493,
            emissive: 0xff1493,
            emissiveIntensity: 0.5
        });
        const cap = new THREE.Mesh(capGeom, capMat);
        cap.position.y = 0.4;
        mushroom.add(cap);
        
        // Glow light
        const light = new THREE.PointLight(0xff1493, 0.5, 3);
        light.position.y = 0.4;
        mushroom.add(light);
        
        mushroom.position.copy(position);
        this.scene.add(mushroom);
        
        return {
            type: 'mushroom',
            mesh: mushroom,
            light: light,
            glowPhase: Math.random() * Math.PI * 2
        };
    }
    
    /**
     * Create cherry blossom trees
     */
    createCherryBlossoms(position, count) {
        for (let i = 0; i < count; i++) {
            const tree = this.createCherryBlossomTree(
                position.clone().add(new THREE.Vector3(
                    (Math.random() - 0.5) * 15,
                    0,
                    (Math.random() - 0.5) * 15
                ))
            );
            this.scene.add(tree.mesh);
            this.flora.push(tree);
            this.animatedElements.push(tree);
        }
    }
    
    createCherryBlossomTree(position) {
        const tree = new THREE.Group();
        
        // Trunk (same as magical tree)
        const trunkGeom = new THREE.CylinderGeometry(0.3, 0.5, 5);
        const trunkMat = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
        const trunk = new THREE.Mesh(trunkGeom, trunkMat);
        trunk.position.y = 2.5;
        tree.add(trunk);
        
        // Pink canopy
        const canopyGeom = new THREE.SphereGeometry(3, 16, 16);
        const canopyMat = new THREE.MeshLambertMaterial({
            color: 0xffb7c5,
            transparent: true,
            opacity: 0.8
        });
        const canopy = new THREE.Mesh(canopyGeom, canopyMat);
        canopy.position.y = 6;
        tree.add(canopy);
        
        // Falling petals
        const petals = [];
        for (let i = 0; i < 100; i++) {
            const petalGeom = new THREE.PlaneGeometry(0.05, 0.08);
            const petalMat = new THREE.MeshBasicMaterial({
                color: 0xffc0cb,
                transparent: true,
                opacity: 0.9
            });
            const petal = new THREE.Mesh(petalGeom, petalMat);
            petal.position.set(
                (Math.random() - 0.5) * 10,
                Math.random() * 10,
                (Math.random() - 0.5) * 10
            );
            tree.add(petal);
            petals.push({
                mesh: petal,
                fallSpeed: 0.5 + Math.random() * 0.5,
                swayPhase: Math.random() * Math.PI * 2
            });
        }
        
        tree.position.copy(position);
        this.scene.add(tree);
        
        return {
            type: 'cherry_blossom',
            mesh: tree,
            petals: petals
        };
    }
    
    /**
     * Create animated creatures
     */
    createButterfly(position) {
        const butterfly = {
            type: 'butterfly',
            position: position.clone(),
            targetPosition: position.clone(),
            speed: 2,
            wingPhase: Math.random() * Math.PI * 2,
            changeTargetTimer: 0
        };
        
        // Simple butterfly mesh
        const geometry = new THREE.PlaneGeometry(0.2, 0.15);
        const material = new THREE.MeshBasicMaterial({
            color: new THREE.Color().setHSL(Math.random(), 0.8, 0.6),
            side: THREE.DoubleSide
        });
        butterfly.mesh = new THREE.Mesh(geometry, material);
        butterfly.mesh.position.copy(position);
        
        this.scene.add(butterfly.mesh);
        this.fauna.push(butterfly);
        this.animatedElements.push(butterfly);
        
        return butterfly;
    }
    
    createBird(position) {
        const bird = {
            type: 'bird',
            position: position.clone(),
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 5,
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 5
            ),
            wingPhase: Math.random() * Math.PI * 2
        };
        
        const geometry = new THREE.ConeGeometry(0.1, 0.3, 4);
        const material = new THREE.MeshLambertMaterial({ color: 0x4a4a4a });
        bird.mesh = new THREE.Mesh(geometry, material);
        bird.mesh.position.copy(position);
        bird.mesh.rotation.x = Math.PI / 2;
        
        this.scene.add(bird.mesh);
        this.fauna.push(bird);
        this.animatedElements.push(bird);
        
        return bird;
    }
    
    createFirefly(position) {
        const firefly = {
            type: 'firefly',
            position: position.clone(),
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2
            ),
            glowPhase: Math.random() * Math.PI * 2
        };
        
        const geometry = new THREE.SphereGeometry(0.05, 8, 8);
        const material = new THREE.MeshBasicMaterial({
            color: 0xffff00,
            emissive: 0xffff00,
            emissiveIntensity: 1
        });
        firefly.mesh = new THREE.Mesh(geometry, material);
        firefly.mesh.position.copy(position);
        
        // Add point light
        const light = new THREE.PointLight(0xffff00, 0.5, 2);
        firefly.mesh.add(light);
        firefly.light = light;
        
        this.scene.add(firefly.mesh);
        this.fauna.push(firefly);
        this.animatedElements.push(firefly);
        
        return firefly;
    }
    
    createSpirit(position) {
        const spirit = {
            type: 'spirit',
            position: position.clone(),
            floatPhase: Math.random() * Math.PI * 2,
            orbitRadius: 2 + Math.random() * 3,
            orbitSpeed: 0.5 + Math.random() * 0.5
        };
        
        const geometry = new THREE.SphereGeometry(0.15, 16, 16);
        const material = new THREE.MeshBasicMaterial({
            color: 0x9d4edd,
            transparent: true,
            opacity: 0.6,
            emissive: 0x9d4edd,
            emissiveIntensity: 0.5
        });
        spirit.mesh = new THREE.Mesh(geometry, material);
        spirit.mesh.position.copy(position);
        
        this.scene.add(spirit.mesh);
        this.fauna.push(spirit);
        this.animatedElements.push(spirit);
        
        return spirit;
    }
    
    /**
     * Create structures
     */
    createFantasyTower(position, height) {
        const tower = new THREE.Group();
        
        // Base
        const baseGeom = new THREE.CylinderGeometry(3, 4, 5);
        const baseMat = new THREE.MeshLambertMaterial({ color: 0x708090 });
        const base = new THREE.Mesh(baseGeom, baseMat);
        base.position.y = 2.5;
        tower.add(base);
        
        // Main tower
        const towerGeom = new THREE.CylinderGeometry(2, 2.5, height);
        const towerMat = new THREE.MeshLambertMaterial({ color: 0x778899 });
        const main = new THREE.Mesh(towerGeom, towerMat);
        main.position.y = 5 + height / 2;
        tower.add(main);
        
        // Roof
        const roofGeom = new THREE.ConeGeometry(3, 4, 8);
        const roofMat = new THREE.MeshLambertMaterial({ color: 0x8b0000 });
        const roof = new THREE.Mesh(roofGeom, roofMat);
        roof.position.y = 5 + height + 2;
        tower.add(roof);
        
        // Magical light at top
        const light = new THREE.PointLight(0x9d4edd, 2, 30);
        light.position.y = 5 + height + 4;
        tower.add(light);
        
        tower.position.copy(position);
        this.scene.add(tower);
        this.structures.push({ mesh: tower, light: light });
        
        return tower;
    }
    
    createFloatingPlatform(position) {
        const platform = {
            type: 'floating_platform',
            mesh: null,
            basePosition: position.clone(),
            floatPhase: Math.random() * Math.PI * 2,
            floatSpeed: 0.5 + Math.random() * 0.5,
            floatHeight: 0.5
        };
        
        const geometry = new THREE.CylinderGeometry(3, 3, 0.5, 8);
        const material = new THREE.MeshLambertMaterial({
            color: 0x9d4edd,
            emissive: 0x9d4edd,
            emissiveIntensity: 0.2
        });
        platform.mesh = new THREE.Mesh(geometry, material);
        platform.mesh.position.copy(position);
        
        this.scene.add(platform.mesh);
        this.structures.push(platform);
        this.animatedElements.push(platform);
        
        return platform;
    }
    
    createMagicalBridge(start, end) {
        const bridgeGeom = new THREE.BoxGeometry(
            start.distanceTo(end),
            0.3,
            2
        );
        const bridgeMat = new THREE.MeshLambertMaterial({
            color: 0x9d4edd,
            transparent: true,
            opacity: 0.7
        });
        const bridge = new THREE.Mesh(bridgeGeom, bridgeMat);
        
        bridge.position.lerpVectors(start, end, 0.5);
        bridge.lookAt(end);
        
        this.scene.add(bridge);
        this.structures.push({ mesh: bridge });
        
        return bridge;
    }
    
    createMarketArea(position) {
        const stalls = [];
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const stallPos = position.clone().add(new THREE.Vector3(
                Math.cos(angle) * 10,
                0,
                Math.sin(angle) * 10
            ));
            
            const stall = this.createMarketStall(stallPos);
            stalls.push(stall);
        }
        
        return stalls;
    }
    
    createMarketStall(position) {
        const stall = new THREE.Group();
        
        // Counter
        const counterGeom = new THREE.BoxGeometry(3, 1, 2);
        const counterMat = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
        const counter = new THREE.Mesh(counterGeom, counterMat);
        counter.position.y = 0.5;
        stall.add(counter);
        
        // Canopy
        const canopyGeom = new THREE.ConeGeometry(2, 2, 4);
        const canopyMat = new THREE.MeshLambertMaterial({ color: 0xff6347 });
        const canopy = new THREE.Mesh(canopyGeom, canopyMat);
        canopy.position.y = 3;
        canopy.rotation.y = Math.PI / 4;
        stall.add(canopy);
        
        stall.position.copy(position);
        this.scene.add(stall);
        this.structures.push({ mesh: stall });
        
        return stall;
    }
    
    createShrine(position) {
        const shrine = new THREE.Group();
        
        // Base platform
        const baseGeom = new THREE.CylinderGeometry(4, 4, 0.5, 8);
        const baseMat = new THREE.MeshLambertMaterial({ color: 0xdcdcdc });
        const base = new THREE.Mesh(baseGeom, baseMat);
        base.position.y = 0.25;
        shrine.add(base);
        
        // Pillars
        for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2;
            const pillarGeom = new THREE.CylinderGeometry(0.3, 0.3, 3);
            const pillarMat = new THREE.MeshLambertMaterial({ color: 0xf5f5f5 });
            const pillar = new THREE.Mesh(pillarGeom, pillarMat);
            pillar.position.set(
                Math.cos(angle) * 3,
                2,
                Math.sin(angle) * 3
            );
            shrine.add(pillar);
        }
        
        // Roof
        const roofGeom = new THREE.ConeGeometry(5, 2, 8);
        const roofMat = new THREE.MeshLambertMaterial({ color: 0xff4500 });
        const roof = new THREE.Mesh(roofGeom, roofMat);
        roof.position.y = 4.5;
        shrine.add(roof);
        
        // Sacred light
        const light = new THREE.PointLight(0xffd700, 1.5, 15);
        light.position.y = 2;
        shrine.add(light);
        
        shrine.position.copy(position);
        this.scene.add(shrine);
        this.structures.push({ mesh: shrine, light: light });
        
        return shrine;
    }
    
    /**
     * Create decorations
     */
    createFloatingCrystal(position) {
        const crystal = {
            type: 'crystal',
            basePosition: position.clone(),
            rotationSpeed: 1 + Math.random() * 2,
            floatPhase: Math.random() * Math.PI * 2,
            floatSpeed: 0.8 + Math.random() * 0.4
        };
        
        const geometry = new THREE.OctahedronGeometry(0.3);
        const material = new THREE.MeshLambertMaterial({
            color: 0x9d4edd,
            emissive: 0x9d4edd,
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.9
        });
        crystal.mesh = new THREE.Mesh(geometry, material);
        crystal.mesh.position.copy(position);
        
        // Add light
        const light = new THREE.PointLight(0x9d4edd, 0.8, 5);
        crystal.mesh.add(light);
        crystal.light = light;
        
        this.scene.add(crystal.mesh);
        this.decorations.push(crystal);
        this.animatedElements.push(crystal);
        
        return crystal;
    }
    
    createMagicalLantern(position) {
        const lantern = {
            type: 'lantern',
            position: position.clone(),
            flickerPhase: Math.random() * Math.PI * 2
        };
        
        // Lantern body
        const bodyGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.4, 6);
        const bodyMat = new THREE.MeshLambertMaterial({ color: 0xffd700 });
        lantern.mesh = new THREE.Mesh(bodyGeom, bodyMat);
        lantern.mesh.position.copy(position);
        
        // Light
        const light = new THREE.PointLight(0xffa500, 1, 8);
        lantern.mesh.add(light);
        lantern.light = light;
        
        this.scene.add(lantern.mesh);
        this.decorations.push(lantern);
        this.animatedElements.push(lantern);
        
        return lantern;
    }
    
    createMagicalFountain(position) {
        const fountain = {
            type: 'fountain',
            position: position.clone(),
            particles: []
        };
        
        // Basin
        const basinGeom = new THREE.CylinderGeometry(2, 2, 1, 16);
        const basinMat = new THREE.MeshLambertMaterial({ color: 0x708090 });
        fountain.mesh = new THREE.Mesh(basinGeom, basinMat);
        fountain.mesh.position.copy(position);
        fountain.mesh.position.y = 0.5;
        
        // Water particles
        for (let i = 0; i < 50; i++) {
            const particleGeom = new THREE.SphereGeometry(0.05, 8, 8);
            const particleMat = new THREE.MeshBasicMaterial({
                color: 0x00bfff,
                transparent: true,
                opacity: 0.7
            });
            const particle = new THREE.Mesh(particleGeom, particleMat);
            particle.position.copy(position);
            this.scene.add(particle);
            
            fountain.particles.push({
                mesh: particle,
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 2,
                    2 + Math.random() * 3,
                    (Math.random() - 0.5) * 2
                ),
                lifetime: 0
            });
        }
        
        this.scene.add(fountain.mesh);
        this.decorations.push(fountain);
        this.animatedElements.push(fountain);
        
        return fountain;
    }
    
    createCampfire(position) {
        const fire = {
            type: 'campfire',
            position: position.clone(),
            particles: []
        };
        
        // Fire pit
        const pitGeom = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 8);
        const pitMat = new THREE.MeshLambertMaterial({ color: 0x2f4f4f });
        fire.mesh = new THREE.Mesh(pitGeom, pitMat);
        fire.mesh.position.copy(position);
        fire.mesh.position.y = 0.1;
        
        // Fire particles
        for (let i = 0; i < 30; i++) {
            const particleGeom = new THREE.SphereGeometry(0.1, 8, 8);
            const particleMat = new THREE.MeshBasicMaterial({
                color: 0xff4500,
                transparent: true,
                opacity: 0.8
            });
            const particle = new THREE.Mesh(particleGeom, particleMat);
            particle.position.copy(position);
            this.scene.add(particle);
            
            fire.particles.push({
                mesh: particle,
                phase: Math.random() * Math.PI * 2,
                speed: 0.5 + Math.random() * 1
            });
        }
        
        // Light
        const light = new THREE.PointLight(0xff4500, 2, 10);
        light.position.copy(position);
        light.position.y = 1;
        this.scene.add(light);
        fire.light = light;
        
        this.scene.add(fire.mesh);
        this.decorations.push(fire);
        this.animatedElements.push(fire);
        
        return fire;
    }
    
    createBanner(position) {
        const banner = {
            type: 'banner',
            position: position.clone(),
            wavePhase: Math.random() * Math.PI * 2
        };
        
        // Pole
        const poleGeom = new THREE.CylinderGeometry(0.05, 0.05, 4);
        const poleMat = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
        const pole = new THREE.Mesh(poleGeom, poleMat);
        pole.position.copy(position);
        pole.position.y = 2;
        
        // Flag
        const flagGeom = new THREE.PlaneGeometry(1.5, 1);
        const flagMat = new THREE.MeshLambertMaterial({
            color: 0x9d4edd,
            side: THREE.DoubleSide
        });
        banner.mesh = new THREE.Mesh(flagGeom, flagMat);
        banner.mesh.position.set(0.75, 3, 0);
        pole.add(banner.mesh);
        
        this.scene.add(pole);
        this.decorations.push(banner);
        this.animatedElements.push(banner);
        
        return banner;
    }
    
    createStatue(position) {
        const statue = new THREE.Group();
        
        // Pedestal
        const pedestalGeom = new THREE.CylinderGeometry(0.8, 1, 1, 8);
        const pedestalMat = new THREE.MeshLambertMaterial({ color: 0x708090 });
        const pedestal = new THREE.Mesh(pedestalGeom, pedestalMat);
        pedestal.position.y = 0.5;
        statue.add(pedestal);
        
        // Figure (simplified)
        const figureGeom = new THREE.CapsuleGeometry(0.4, 2, 8, 16);
        const figureMat = new THREE.MeshLambertMaterial({ color: 0xdcdcdc });
        const figure = new THREE.Mesh(figureGeom, figureMat);
        figure.position.y = 2.5;
        statue.add(figure);
        
        statue.position.copy(position);
        this.scene.add(statue);
        this.decorations.push({ mesh: statue });
        
        return statue;
    }
    
    createMagicalGarden(position) {
        const garden = {
            type: 'garden',
            position: position.clone(),
            elements: []
        };
        
        // Create various elements
        for (let i = 0; i < 20; i++) {
            const flower = this.createFlower(
                position.clone().add(new THREE.Vector3(
                    (Math.random() - 0.5) * 10,
                    0,
                    (Math.random() - 0.5) * 10
                ))
            );
            garden.elements.push(flower);
        }
        
        return garden;
    }
    
    /**
     * Create celestial objects
     */
    createFloatingIsland(position) {
        const island = new THREE.Group();
        
        // Rock base
        const rockGeom = new THREE.DodecahedronGeometry(5);
        const rockMat = new THREE.MeshLambertMaterial({ color: 0x8b7355 });
        const rock = new THREE.Mesh(rockGeom, rockMat);
        island.add(rock);
        
        // Grass top
        const grassGeom = new THREE.SphereGeometry(5.2, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
        const grassMat = new THREE.MeshLambertMaterial({ color: 0x228b22 });
        const grass = new THREE.Mesh(grassGeom, grassMat);
        grass.position.y = 2;
        island.add(grass);
        
        // Add some trees
        for (let i = 0; i < 3; i++) {
            const treePos = new THREE.Vector3(
                (Math.random() - 0.5) * 4,
                2,
                (Math.random() - 0.5) * 4
            );
            const tree = this.createMagicalTree(treePos);
            island.add(tree.mesh);
        }
        
        island.position.copy(position);
        this.scene.add(island);
        this.celestialObjects.push({
            mesh: island,
            floatPhase: Math.random() * Math.PI * 2,
            basePosition: position.clone()
        });
        this.animatedElements.push(this.celestialObjects[this.celestialObjects.length - 1]);
        
        return island;
    }
    
    createAurora() {
        // Simplified aurora - would use shaders in production
        const aurora = {
            type: 'aurora',
            waves: []
        };
        
        for (let i = 0; i < 5; i++) {
            const waveGeom = new THREE.PlaneGeometry(100, 20, 32, 4);
            const waveMat = new THREE.MeshBasicMaterial({
                color: new THREE.Color().setHSL(0.5 + i * 0.1, 0.8, 0.5),
                transparent: true,
                opacity: 0.3,
                side: THREE.DoubleSide
            });
            const wave = new THREE.Mesh(waveGeom, waveMat);
            wave.position.set(0, 40 + i * 5, -50);
            wave.rotation.x = Math.PI / 4;
            this.scene.add(wave);
            
            aurora.waves.push({
                mesh: wave,
                phase: i * Math.PI / 3
            });
        }
        
        this.celestialObjects.push(aurora);
        this.animatedElements.push(aurora);
        
        return aurora;
    }
    
    createShootingStarSystem() {
        // Stars spawn periodically - managed in update
        this.shootingStars = {
            type: 'shooting_stars',
            stars: [],
            spawnTimer: 0,
            spawnInterval: 5000 // 5 seconds
        };
        
        this.animatedElements.push(this.shootingStars);
    }
    
    createAmbientParticles() {
        const particles = {
            type: 'ambient_particles',
            particles: []
        };
        
        for (let i = 0; i < 200; i++) {
            const particleGeom = new THREE.SphereGeometry(0.02, 4, 4);
            const particleMat = new THREE.MeshBasicMaterial({
                color: 0x9d4edd,
                transparent: true,
                opacity: 0.6
            });
            const particle = new THREE.Mesh(particleGeom, particleMat);
            particle.position.set(
                (Math.random() - 0.5) * 100,
                Math.random() * 20,
                (Math.random() - 0.5) * 100
            );
            this.scene.add(particle);
            
            particles.particles.push({
                mesh: particle,
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.5,
                    (Math.random() - 0.5) * 0.5,
                    (Math.random() - 0.5) * 0.5
                )
            });
        }
        
        this.animatedElements.push(particles);
        
        return particles;
    }
    
    createGodRays() {
        // Simplified - would use volumetric lighting in production
        console.log('God rays created (requires post-processing)');
    }
    
    createMysticalMist() {
        // Simplified - would use fog and particle system in production
        this.scene.fog = new THREE.FogExp2(0x9d4edd, 0.01);
    }
    
    /**
     * Update all animated elements
     */
    update(deltaTime) {
        const time = Date.now() / 1000;
        
        this.animatedElements.forEach(element => {
            switch (element.type) {
                case 'grass':
                    this.updateGrass(element, time, deltaTime);
                    break;
                case 'flowers':
                    this.updateFlowers(element, time);
                    break;
                case 'trees':
                    this.updateTrees(element, time);
                    break;
                case 'mushroom':
                    this.updateMushroom(element, time);
                    break;
                case 'cherry_blossom':
                    this.updateCherryBlossom(element, deltaTime);
                    break;
                case 'butterfly':
                    this.updateButterfly(element, deltaTime);
                    break;
                case 'bird':
                    this.updateBird(element, deltaTime);
                    break;
                case 'firefly':
                    this.updateFirefly(element, deltaTime);
                    break;
                case 'spirit':
                    this.updateSpirit(element, time);
                    break;
                case 'floating_platform':
                    this.updateFloatingPlatform(element, time);
                    break;
                case 'crystal':
                    this.updateCrystal(element, time, deltaTime);
                    break;
                case 'lantern':
                    this.updateLantern(element, time);
                    break;
                case 'fountain':
                    this.updateFountain(element, deltaTime);
                    break;
                case 'campfire':
                    this.updateCampfire(element, time);
                    break;
                case 'banner':
                    this.updateBanner(element, time);
                    break;
                case 'aurora':
                    this.updateAurora(element, time);
                    break;
                case 'shooting_stars':
                    this.updateShootingStars(element, deltaTime);
                    break;
                case 'ambient_particles':
                    this.updateAmbientParticles(element, deltaTime);
                    break;
            }
        });
    }
    
    /**
     * Update methods for each element type
     */
    
    updateGrass(grassField, time, deltaTime) {
        grassField.blades.forEach(blade => {
            const sway = Math.sin(time * blade.swaySpeed + blade.swayPhase) * 0.1;
            blade.mesh.rotation.z = sway;
        });
    }
    
    updateFlowers(garden, time) {
        garden.flowers.forEach(flower => {
            const scale = 1 + Math.sin(time + flower.bloomPhase) * 0.1;
            flower.petals.scale.set(scale, scale, scale);
        });
    }
    
    updateTrees(trees, time) {
        trees.trees.forEach(tree => {
            tree.sway = Math.sin(time * 0.5) * 0.02;
            tree.canopy.rotation.y += 0.001;
            
            tree.leaves.forEach(leaf => {
                leaf.mesh.position.y += Math.sin(time * 2 + leaf.phase) * 0.005;
            });
        });
    }
    
    updateMushroom(mushroom, time) {
        const glow = 0.3 + Math.sin(time * 2 + mushroom.glowPhase) * 0.2;
        mushroom.light.intensity = glow;
    }
    
    updateCherryBlossom(tree, deltaTime) {
        tree.petals.forEach(petal => {
            petal.mesh.position.y -= petal.fallSpeed * deltaTime;
            petal.mesh.position.x += Math.sin(petal.swayPhase) * 0.5 * deltaTime;
            petal.mesh.rotation.z += deltaTime;
            
            if (petal.mesh.position.y < 0) {
                petal.mesh.position.y = 10;
            }
        });
    }
    
    updateButterfly(butterfly, deltaTime) {
        butterfly.changeTargetTimer += deltaTime;
        
        if (butterfly.changeTargetTimer > 3) {
            butterfly.targetPosition.set(
                (Math.random() - 0.5) * 40,
                2 + Math.random() * 3,
                (Math.random() - 0.5) * 40
            );
            butterfly.changeTargetTimer = 0;
        }
        
        // Move toward target
        const direction = butterfly.targetPosition.clone().sub(butterfly.position).normalize();
        butterfly.position.add(direction.multiplyScalar(butterfly.speed * deltaTime));
        butterfly.mesh.position.copy(butterfly.position);
        
        // Wing flapping
        butterfly.wingPhase += deltaTime * 10;
        butterfly.mesh.rotation.z = Math.sin(butterfly.wingPhase) * 0.5;
    }
    
    updateBird(bird, deltaTime) {
        bird.position.add(bird.velocity.clone().multiplyScalar(deltaTime));
        bird.mesh.position.copy(bird.position);
        
        // Bounds check
        if (Math.abs(bird.position.x) > 50 || Math.abs(bird.position.z) > 50) {
            bird.velocity.x = -bird.velocity.x * 0.8;
            bird.velocity.z = -bird.velocity.z * 0.8;
        }
        
        // Wing flapping
        bird.wingPhase += deltaTime * 8;
        bird.mesh.scale.y = 1 + Math.sin(bird.wingPhase) * 0.2;
    }
    
    updateFirefly(firefly, deltaTime) {
        firefly.position.add(firefly.velocity.clone().multiplyScalar(deltaTime));
        firefly.mesh.position.copy(firefly.position);
        
        // Random direction changes
        if (Math.random() < 0.02) {
            firefly.velocity.set(
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2
            );
        }
        
        // Glow pulse
        firefly.glowPhase += deltaTime * 2;
        const glow = 0.3 + Math.sin(firefly.glowPhase) * 0.2;
        firefly.light.intensity = glow;
    }
    
    updateSpirit(spirit, time) {
        spirit.floatPhase += 0.016 * spirit.orbitSpeed;
        
        const x = Math.cos(spirit.floatPhase) * spirit.orbitRadius;
        const z = Math.sin(spirit.floatPhase) * spirit.orbitRadius;
        const y = spirit.position.y + Math.sin(time * 2) * 0.5;
        
        spirit.mesh.position.set(
            spirit.position.x + x,
            y,
            spirit.position.z + z
        );
    }
    
    updateFloatingPlatform(platform, time) {
        platform.floatPhase += 0.016 * platform.floatSpeed;
        
        const floatOffset = Math.sin(platform.floatPhase) * platform.floatHeight;
        platform.mesh.position.y = platform.basePosition.y + floatOffset;
    }
    
    updateCrystal(crystal, time, deltaTime) {
        crystal.mesh.rotation.y += deltaTime * crystal.rotationSpeed;
        
        crystal.floatPhase += 0.016 * crystal.floatSpeed;
        const floatOffset = Math.sin(crystal.floatPhase) * 0.5;
        crystal.mesh.position.y = crystal.basePosition.y + floatOffset;
        
        // Glow pulse
        const glow = 0.4 + Math.sin(time * 3) * 0.1;
        crystal.light.intensity = glow;
    }
    
    updateLantern(lantern, time) {
        const flicker = 0.8 + Math.sin(time * 10 + lantern.flickerPhase) * 0.2;
        lantern.light.intensity = flicker;
    }
    
    updateFountain(fountain, deltaTime) {
        fountain.particles.forEach(p => {
            p.lifetime += deltaTime;
            
            if (p.lifetime > 2) {
                // Reset particle
                p.mesh.position.copy(fountain.position);
                p.velocity.set(
                    (Math.random() - 0.5) * 2,
                    2 + Math.random() * 3,
                    (Math.random() - 0.5) * 2
                );
                p.lifetime = 0;
            } else {
                // Update position
                p.velocity.y -= 9.8 * deltaTime; // Gravity
                p.mesh.position.add(p.velocity.clone().multiplyScalar(deltaTime));
            }
        });
    }
    
    updateCampfire(fire, time) {
        fire.particles.forEach(p => {
            p.phase += p.speed * 0.016;
            
            const height = Math.sin(p.phase) * 1.5;
            const radius = 0.3 * (1 - height / 1.5);
            const angle = p.phase * 2;
            
            p.mesh.position.set(
                fire.position.x + Math.cos(angle) * radius,
                fire.position.y + height,
                fire.position.z + Math.sin(angle) * radius
            );
            
            // Color transition
            const t = height / 1.5;
            p.mesh.material.color.setHSL(0.05 + t * 0.1, 1, 0.5);
        });
        
        // Light flicker
        fire.light.intensity = 1.5 + Math.sin(time * 10) * 0.5;
    }
    
    updateBanner(banner, time) {
        // Wave effect on banner
        banner.wavePhase += 0.016;
        banner.mesh.rotation.z = Math.sin(banner.wavePhase * 2) * 0.2;
    }
    
    updateAurora(aurora, time) {
        aurora.waves.forEach(wave => {
            wave.phase += 0.016;
            wave.mesh.material.opacity = 0.2 + Math.sin(wave.phase) * 0.1;
            
            // Subtle movement
            wave.mesh.position.x = Math.sin(time * 0.1 + wave.phase) * 5;
        });
    }
    
    updateShootingStars(system, deltaTime) {
        system.spawnTimer += deltaTime * 1000;
        
        // Spawn new shooting star
        if (system.spawnTimer > system.spawnInterval && Math.random() < 0.3) {
            const star = this.createShootingStar();
            system.stars.push(star);
            system.spawnTimer = 0;
        }
        
        // Update existing stars
        system.stars = system.stars.filter(star => {
            star.lifetime += deltaTime;
            
            if (star.lifetime > 3) {
                this.scene.remove(star.mesh);
                return false;
            }
            
            star.mesh.position.add(star.velocity.clone().multiplyScalar(deltaTime));
            return true;
        });
    }
    
    createShootingStar() {
        const geometry = new THREE.SphereGeometry(0.15, 8, 8);
        const material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            emissive: 0xffffff,
            emissiveIntensity: 1
        });
        const mesh = new THREE.Mesh(geometry, material);
        
        mesh.position.set(
            (Math.random() - 0.5) * 100,
            50 + Math.random() * 20,
            (Math.random() - 0.5) * 100
        );
        
        this.scene.add(mesh);
        
        return {
            mesh: mesh,
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 20,
                -15,
                (Math.random() - 0.5) * 20
            ),
            lifetime: 0
        };
    }
    
    updateAmbientParticles(particles, deltaTime) {
        particles.particles.forEach(p => {
            p.mesh.position.add(p.velocity.clone().multiplyScalar(deltaTime));
            
            // Bounds check and wrap
            ['x', 'y', 'z'].forEach(axis => {
                if (Math.abs(p.mesh.position[axis]) > 50) {
                    p.mesh.position[axis] = -p.mesh.position[axis];
                }
            });
        });
    }
    
    /**
     * Helper methods
     */
    
    getRandomPosition(range) {
        return new THREE.Vector3(
            (Math.random() - 0.5) * range,
            Math.random() * 5,
            (Math.random() - 0.5) * range
        );
    }
    
    /**
     * Cleanup
     */
    clear() {
        // Remove all created elements from scene
        [...this.flora, ...this.fauna, ...this.structures, ...this.decorations].forEach(element => {
            if (element.mesh) {
                this.scene.remove(element.mesh);
            }
        });
    }
}
