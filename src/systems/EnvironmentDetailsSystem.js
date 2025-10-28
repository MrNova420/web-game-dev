/**
 * EnvironmentDetailsSystem - Enhanced environmental details and decorations
 * Adds foliage, rocks, ambient creatures, and atmospheric details to biomes
 */

import * as THREE from 'three';

export class EnvironmentDetailsSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.scene = gameEngine.scene;
        
        this.environmentObjects = [];
        this.maxObjects = 100;
        
        this.biomeConfigs = {
            crystal_caverns: {
                colors: [0x6699ff, 0x88aaff, 0xaaccff],
                decorations: ['crystals', 'rocks', 'glowOrbs'],
                density: 0.8
            },
            fungal_city: {
                colors: [0xff6b9d, 0xff88aa, 0xffaacc],
                decorations: ['mushrooms', 'vines', 'spores'],
                density: 0.9
            },
            vine_cathedral: {
                colors: [0x52b788, 0x74c69d, 0x95d5b2],
                decorations: ['vines', 'flowers', 'leaves'],
                density: 1.0
            },
            broken_starship: {
                colors: [0x0099ff, 0x00aaff, 0x66ccff],
                decorations: ['debris', 'terminals', 'lights'],
                density: 0.6
            },
            twilight_throne: {
                colors: [0x9d4edd, 0xc77dff, 0xe0aaff],
                decorations: ['pillars', 'statues', 'runes'],
                density: 0.7
            }
        };
        
        this.init();
    }
    
    init() {
        console.log('🌲 Environment Details System initialized');
    }
    
    populateBiome(biomeType, bounds) {
        this.clearEnvironment();
        
        const config = this.biomeConfigs[biomeType] || this.biomeConfigs.crystal_caverns;
        const objectCount = Math.floor(this.maxObjects * config.density);
        
        console.log(`🌲 Populating ${biomeType} with ${objectCount} objects`);
        
        for (let i = 0; i < objectCount; i++) {
            const decoration = this.getRandomDecoration(config.decorations);
            const position = this.getRandomPosition(bounds);
            
            this.createDecoration(decoration, position, config.colors);
        }
    }
    
    getRandomDecoration(decorations) {
        return decorations[Math.floor(Math.random() * decorations.length)];
    }
    
    getRandomPosition(bounds) {
        return new THREE.Vector3(
            bounds.min.x + Math.random() * (bounds.max.x - bounds.min.x),
            0,
            bounds.min.z + Math.random() * (bounds.max.z - bounds.min.z)
        );
    }
    
    createDecoration(type, position, colors) {
        let object = null;
        
        switch (type) {
            case 'crystals':
                object = this.createCrystal(position, colors);
                break;
            case 'rocks':
                object = this.createRock(position, colors);
                break;
            case 'glowOrbs':
                object = this.createGlowOrb(position, colors);
                break;
            case 'mushrooms':
                object = this.createMushroom(position, colors);
                break;
            case 'vines':
                object = this.createVine(position, colors);
                break;
            case 'spores':
                object = this.createSpores(position, colors);
                break;
            case 'flowers':
                object = this.createFlower(position, colors);
                break;
            case 'leaves':
                object = this.createLeaves(position, colors);
                break;
            case 'debris':
                object = this.createDebris(position, colors);
                break;
            case 'terminals':
                object = this.createTerminal(position, colors);
                break;
            case 'lights':
                object = this.createLight(position, colors);
                break;
            case 'pillars':
                object = this.createPillar(position, colors);
                break;
            case 'statues':
                object = this.createStatue(position, colors);
                break;
            case 'runes':
                object = this.createRune(position, colors);
                break;
        }
        
        if (object) {
            this.scene.add(object);
            this.environmentObjects.push(object);
        }
    }
    
    createCrystal(position, colors) {
        const height = 0.5 + Math.random() * 1.5;
        const geometry = new THREE.ConeGeometry(0.2, height, 6);
        const color = colors[Math.floor(Math.random() * colors.length)];
        const material = new THREE.MeshPhongMaterial({
            color,
            emissive: color,
            emissiveIntensity: 0.3,
            transparent: true,
            opacity: 0.8,
            shininess: 100
        });
        
        const crystal = new THREE.Mesh(geometry, material);
        crystal.position.copy(position);
        crystal.position.y = height / 2;
        crystal.rotation.x = (Math.random() - 0.5) * 0.3;
        crystal.rotation.z = (Math.random() - 0.5) * 0.3;
        
        // Add glow
        const glowGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color,
            transparent: true,
            opacity: 0.5
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.y = height;
        crystal.add(glow);
        
        return crystal;
    }
    
    createRock(position, colors) {
        const size = 0.3 + Math.random() * 0.7;
        const geometry = new THREE.DodecahedronGeometry(size, 0);
        const material = new THREE.MeshStandardMaterial({
            color: 0x555555,
            roughness: 0.9,
            metalness: 0.1
        });
        
        const rock = new THREE.Mesh(geometry, material);
        rock.position.copy(position);
        rock.position.y = size * 0.5;
        rock.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        
        return rock;
    }
    
    createGlowOrb(position, colors) {
        const size = 0.2 + Math.random() * 0.3;
        const geometry = new THREE.SphereGeometry(size, 16, 16);
        const color = colors[Math.floor(Math.random() * colors.length)];
        const material = new THREE.MeshBasicMaterial({
            color,
            transparent: true,
            opacity: 0.6
        });
        
        const orb = new THREE.Mesh(geometry, material);
        orb.position.copy(position);
        orb.position.y = 1 + Math.random() * 2;
        
        // Add point light
        const light = new THREE.PointLight(color, 0.5, 5);
        orb.add(light);
        
        // Animate floating
        orb.userData.baseY = orb.position.y;
        orb.userData.floatSpeed = 0.5 + Math.random() * 0.5;
        orb.userData.floatAmount = 0.3 + Math.random() * 0.3;
        
        return orb;
    }
    
    createMushroom(position, colors) {
        const group = new THREE.Group();
        
        // Stem
        const stemGeometry = new THREE.CylinderGeometry(0.05, 0.08, 0.3, 8);
        const stemMaterial = new THREE.MeshStandardMaterial({ color: 0xdddddd });
        const stem = new THREE.Mesh(stemGeometry, stemMaterial);
        stem.position.y = 0.15;
        group.add(stem);
        
        // Cap
        const capGeometry = new THREE.SphereGeometry(0.2, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2);
        const color = colors[Math.floor(Math.random() * colors.length)];
        const capMaterial = new THREE.MeshStandardMaterial({
            color,
            emissive: color,
            emissiveIntensity: 0.2
        });
        const cap = new THREE.Mesh(capGeometry, capMaterial);
        cap.position.y = 0.3;
        group.add(cap);
        
        group.position.copy(position);
        return group;
    }
    
    createVine(position, colors) {
        const points = [];
        const segments = 5 + Math.floor(Math.random() * 5);
        
        for (let i = 0; i < segments; i++) {
            points.push(new THREE.Vector3(
                (Math.random() - 0.5) * 0.5,
                i * 0.3,
                (Math.random() - 0.5) * 0.5
            ));
        }
        
        const curve = new THREE.CatmullRomCurve3(points);
        const geometry = new THREE.TubeGeometry(curve, segments * 2, 0.02, 8, false);
        const color = colors[Math.floor(Math.random() * colors.length)];
        const material = new THREE.MeshStandardMaterial({ color });
        
        const vine = new THREE.Mesh(geometry, material);
        vine.position.copy(position);
        
        return vine;
    }
    
    createSpores(position, colors) {
        const particleCount = 10;
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const particleColors = [];
        
        for (let i = 0; i < particleCount; i++) {
            positions.push(
                (Math.random() - 0.5) * 2,
                Math.random() * 2,
                (Math.random() - 0.5) * 2
            );
            
            const color = new THREE.Color(colors[Math.floor(Math.random() * colors.length)]);
            particleColors.push(color.r, color.g, color.b);
        }
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(particleColors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        
        const spores = new THREE.Points(geometry, material);
        spores.position.copy(position);
        
        return spores;
    }
    
    createFlower(position, colors) {
        const group = new THREE.Group();
        
        // Stem
        const stemGeometry = new THREE.CylinderGeometry(0.02, 0.03, 0.4, 8);
        const stemMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22 });
        const stem = new THREE.Mesh(stemGeometry, stemMaterial);
        stem.position.y = 0.2;
        group.add(stem);
        
        // Petals
        const petalCount = 5 + Math.floor(Math.random() * 3);
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        for (let i = 0; i < petalCount; i++) {
            const angle = (i / petalCount) * Math.PI * 2;
            const petalGeometry = new THREE.CircleGeometry(0.1, 8);
            const petalMaterial = new THREE.MeshStandardMaterial({ color, side: THREE.DoubleSide });
            const petal = new THREE.Mesh(petalGeometry, petalMaterial);
            
            petal.position.x = Math.cos(angle) * 0.1;
            petal.position.z = Math.sin(angle) * 0.1;
            petal.position.y = 0.4;
            petal.rotation.y = angle;
            petal.rotation.x = Math.PI / 4;
            
            group.add(petal);
        }
        
        group.position.copy(position);
        return group;
    }
    
    createLeaves(position, colors) {
        // Similar to spores but larger and slower
        return this.createSpores(position, colors);
    }
    
    createDebris(position, colors) {
        const geometry = new THREE.BoxGeometry(
            0.3 + Math.random() * 0.5,
            0.2 + Math.random() * 0.3,
            0.3 + Math.random() * 0.5
        );
        const material = new THREE.MeshStandardMaterial({
            color: 0x666666,
            roughness: 0.8,
            metalness: 0.4
        });
        
        const debris = new THREE.Mesh(geometry, material);
        debris.position.copy(position);
        debris.position.y = 0.1;
        debris.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        
        return debris;
    }
    
    createTerminal(position, colors) {
        const group = new THREE.Group();
        
        // Base
        const baseGeometry = new THREE.BoxGeometry(0.3, 0.5, 0.2);
        const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = 0.25;
        group.add(base);
        
        // Screen
        const screenGeometry = new THREE.PlaneGeometry(0.25, 0.2);
        const color = colors[Math.floor(Math.random() * colors.length)];
        const screenMaterial = new THREE.MeshBasicMaterial({
            color,
            emissive: color,
            emissiveIntensity: 0.5
        });
        const screen = new THREE.Mesh(screenGeometry, screenMaterial);
        screen.position.y = 0.3;
        screen.position.z = 0.11;
        group.add(screen);
        
        group.position.copy(position);
        return group;
    }
    
    createLight(position, colors) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const light = new THREE.PointLight(color, 1, 10);
        light.position.copy(position);
        light.position.y = 2 + Math.random();
        
        return light;
    }
    
    createPillar(position, colors) {
        const height = 2 + Math.random() * 2;
        const geometry = new THREE.CylinderGeometry(0.3, 0.35, height, 8);
        const color = colors[Math.floor(Math.random() * colors.length)];
        const material = new THREE.MeshStandardMaterial({
            color: 0x888888,
            emissive: color,
            emissiveIntensity: 0.1,
            roughness: 0.7
        });
        
        const pillar = new THREE.Mesh(geometry, material);
        pillar.position.copy(position);
        pillar.position.y = height / 2;
        
        return pillar;
    }
    
    createStatue(position, colors) {
        const group = new THREE.Group();
        
        // Base
        const baseGeometry = new THREE.BoxGeometry(0.5, 0.2, 0.5);
        const material = new THREE.MeshStandardMaterial({ color: 0x999999 });
        const base = new THREE.Mesh(baseGeometry, material);
        base.position.y = 0.1;
        group.add(base);
        
        // Body
        const bodyGeometry = new THREE.CylinderGeometry(0.15, 0.2, 0.8, 8);
        const body = new THREE.Mesh(bodyGeometry, material);
        body.position.y = 0.6;
        group.add(body);
        
        // Head
        const headGeometry = new THREE.SphereGeometry(0.2, 12, 12);
        const head = new THREE.Mesh(headGeometry, material);
        head.position.y = 1.2;
        group.add(head);
        
        group.position.copy(position);
        return group;
    }
    
    createRune(position, colors) {
        const geometry = new THREE.PlaneGeometry(0.3, 0.3);
        const color = colors[Math.floor(Math.random() * colors.length)];
        const material = new THREE.MeshBasicMaterial({
            color,
            transparent: true,
            opacity: 0.7,
            side: THREE.DoubleSide
        });
        
        const rune = new THREE.Mesh(geometry, material);
        rune.position.copy(position);
        rune.position.y = 0.01;
        rune.rotation.x = -Math.PI / 2;
        
        return rune;
    }
    
    update(deltaTime) {
        // Animate floating objects
        const time = Date.now() * 0.001;
        
        this.environmentObjects.forEach(obj => {
            if (obj.userData.floatSpeed) {
                obj.position.y = obj.userData.baseY + 
                    Math.sin(time * obj.userData.floatSpeed) * obj.userData.floatAmount;
            }
        });
    }
    
    clearEnvironment() {
        this.environmentObjects.forEach(obj => {
            this.scene.remove(obj);
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) {
                if (Array.isArray(obj.material)) {
                    obj.material.forEach(mat => mat.dispose());
                } else {
                    obj.material.dispose();
                }
            }
        });
        
        this.environmentObjects = [];
    }
    
    dispose() {
        this.clearEnvironment();
        console.log('🌲 Environment Details System disposed');
    }
}
