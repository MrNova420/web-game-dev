// Phase 9.1: Anime Character System with Detailed Models and Customization
export class AnimeCharacterSystem {
    constructor(scene) {
        this.scene = scene;
        this.characters = new Map();
        this.customizationOptions = this.initializeCustomization();
        this.animations = this.initializeAnimations();
        this.physics = { hairWind: { x: 0, y: 0, z: 0 }, clothWind: { x: 0, y: 0, z: 0 } };
        this.lastUpdate = Date.now();
    }
    
    initializeCustomization() {
        return {
            faces: [
                'cheerful', 'serious', 'cute', 'elegant', 'mysterious', 'fierce',
                'gentle', 'mischievous', 'stoic', 'innocent', 'seductive', 'wise',
                'youthful', 'mature', 'battle-worn', 'divine', 'demonic', 'ethereal',
                'playful', 'determined'
            ],
            eyeShapes: [
                'round', 'almond', 'narrow', 'wide', 'cat-like', 'sharp',
                'doe-eyed', 'sleepy', 'intense', 'mystical'
            ],
            eyeColors: [
                '#FF0000', '#00FF00', '#0000FF', '#FFD700', '#FF00FF', '#00FFFF',
                '#FFA500', '#800080', '#FF1493', '#00FA9A', '#FF6B6B', '#4ECDC4'
            ],
            hairstyles: [
                'long_straight', 'long_wavy', 'short_spiky', 'twin_tails', 'ponytail',
                'bob_cut', 'hime_cut', 'drill_curls', 'messy_short', 'braided',
                'bun', 'mohawk', 'undercut', 'flowing_long', 'wild_spiky',
                'elegant_updo', 'side_swept', 'shaggy', 'layered', 'asymmetric',
                'pigtails', 'warrior_top_knot', 'mage_hood', 'flowing_ethereal',
                'battle_braid', 'royal_crown', 'mystical_floating', 'punk_mohawk',
                'gentle_waves', 'fierce_spikes'
            ],
            hairColors: [
                '#000000', '#FFD700', '#FF0000', '#0000FF', '#FF00FF', '#FFFFFF',
                '#FFA500', '#00FFFF', '#FF69B4', '#9370DB', '#32CD32', '#FF1493',
                '#4169E1', '#FF6347', '#7CFC00', '#FF4500', '#DA70D6', '#00CED1'
            ],
            bodyTypes: [
                'petite', 'average', 'athletic', 'muscular', 'curvy', 'slender',
                'tall', 'short', 'heroic', 'delicate'
            ],
            skinTones: [
                '#FFE0BD', '#F1C27D', '#E0AC69', '#C68642', '#8D5524', '#FFF0E1',
                '#FFE4C4', '#DEB887', '#D2B48C', '#BC8F8F'
            ],
            costumes: [
                // Magical Girl
                { name: 'magical_girl_pink', type: 'dress', colors: ['#FF69B4', '#FFFFFF', '#FFD700'] },
                { name: 'magical_girl_blue', type: 'dress', colors: ['#4169E1', '#FFFFFF', '#87CEEB'] },
                
                // Warrior
                { name: 'knight_armor', type: 'armor', colors: ['#C0C0C0', '#FFD700', '#8B0000'] },
                { name: 'samurai_armor', type: 'armor', colors: ['#8B0000', '#000000', '#FFD700'] },
                { name: 'berserker_outfit', type: 'light_armor', colors: ['#8B4513', '#FF0000', '#000000'] },
                
                // Mage
                { name: 'wizard_robes', type: 'robes', colors: ['#4B0082', '#9370DB', '#FFD700'] },
                { name: 'sorcerer_outfit', type: 'robes', colors: ['#000080', '#00FFFF', '#FFFFFF'] },
                { name: 'battle_mage', type: 'robes', colors: ['#8B0000', '#FF4500', '#FFD700'] },
                
                // Rogue
                { name: 'ninja_outfit', type: 'light_armor', colors: ['#000000', '#808080', '#8B0000'] },
                { name: 'assassin_cloak', type: 'cloak', colors: ['#2F4F4F', '#000000', '#B22222'] },
                { name: 'thief_leather', type: 'leather', colors: ['#8B4513', '#000000', '#FFD700'] },
                
                // Fantasy
                { name: 'elf_dress', type: 'dress', colors: ['#228B22', '#FFFFFF', '#FFD700'] },
                { name: 'angel_robes', type: 'robes', colors: ['#FFFFFF', '#FFD700', '#87CEEB'] },
                { name: 'demon_outfit', type: 'dark_armor', colors: ['#8B0000', '#000000', '#FF0000'] },
                { name: 'fairy_dress', type: 'dress', colors: ['#FF69B4', '#7CFC00', '#FFD700'] },
                
                // Royal
                { name: 'princess_gown', type: 'gown', colors: ['#FFB6C1', '#FFD700', '#FFFFFF'] },
                { name: 'prince_tunic', type: 'tunic', colors: ['#4169E1', '#FFD700', '#FFFFFF'] },
                { name: 'queen_dress', type: 'gown', colors: ['#9370DB', '#FFD700', '#8B0000'] },
                
                // Modern Fantasy
                { name: 'school_uniform', type: 'uniform', colors: ['#000080', '#FFFFFF', '#8B0000'] },
                { name: 'battle_suit', type: 'suit', colors: ['#000000', '#00FFFF', '#FFFFFF'] },
                { name: 'idol_outfit', type: 'dress', colors: ['#FF69B4', '#FFFFFF', '#FFD700'] }
            ],
            accessories: [
                'angel_wings', 'demon_wings', 'fairy_wings', 'dragon_wings',
                'cat_ears', 'fox_ears', 'wolf_ears', 'rabbit_ears',
                'cat_tail', 'fox_tail', 'demon_tail', 'dragon_tail',
                'halo', 'demon_horns', 'dragon_horns', 'crown',
                'tiara', 'circlet', 'headband', 'glasses',
                'eyepatch', 'mask', 'scarf', 'cape'
            ],
            voices: [
                'cheerful_high', 'mature_low', 'energetic_mid', 'soft_whisper',
                'commanding', 'mysterious', 'playful', 'serious', 'elegant', 'cute'
            ]
        };
    }
    
    initializeAnimations() {
        return {
            idle: [
                { name: 'standing_casual', loop: true, weight: 1.0 },
                { name: 'confident_pose', loop: true, weight: 1.0 },
                { name: 'shy_fidget', loop: true, weight: 1.0 },
                { name: 'battle_ready', loop: true, weight: 1.0 },
                { name: 'magical_float', loop: true, weight: 1.0 }
            ],
            combat: [
                { name: 'sword_slash', duration: 0.5 },
                { name: 'spell_cast', duration: 1.0 },
                { name: 'kick_combo', duration: 0.8 },
                { name: 'dodge_roll', duration: 0.4 },
                { name: 'parry_stance', duration: 0.3 },
                { name: 'ultimate_pose', duration: 2.0 }
            ],
            emotes: [
                { name: 'wave', duration: 1.5 },
                { name: 'dance', duration: 3.0, loop: true },
                { name: 'laugh', duration: 2.0 },
                { name: 'cry', duration: 2.5 },
                { name: 'cheer', duration: 2.0 },
                { name: 'sit', duration: 1.0, loop: true },
                { name: 'sleep', duration: 1.5, loop: true },
                { name: 'think', duration: 2.0 },
                { name: 'angry', duration: 1.5 },
                { name: 'surprised', duration: 1.0 }
            ],
            victory: [
                { name: 'victory_pose_heroic', duration: 2.0 },
                { name: 'victory_pose_cute', duration: 2.0 },
                { name: 'victory_pose_cool', duration: 2.0 }
            ],
            facial: [
                { name: 'blink', duration: 0.2, frequency: 3000 },
                { name: 'smile', blend: true },
                { name: 'frown', blend: true },
                { name: 'angry_eyes', blend: true },
                { name: 'surprised_eyes', blend: true },
                { name: 'sad_eyes', blend: true }
            ]
        };
    }
    
    createCharacter(characterId, customization) {
        const character = {
            id: characterId,
            mesh: null,
            bones: {},
            customization: {
                face: customization.face || 'cheerful',
                eyeShape: customization.eyeShape || 'round',
                eyeColor: customization.eyeColor || '#4169E1',
                hairstyle: customization.hairstyle || 'long_straight',
                hairColor: customization.hairColor || '#FFD700',
                bodyType: customization.bodyType || 'average',
                skinTone: customization.skinTone || '#FFE0BD',
                costume: customization.costume || this.customizationOptions.costumes[0],
                accessories: customization.accessories || [],
                voice: customization.voice || 'cheerful_high',
                height: customization.height || 1.0
            },
            animations: {
                current: 'standing_casual',
                queue: [],
                blendTime: 0.3,
                mixer: null
            },
            expressions: {
                current: 'neutral',
                blendWeights: new Map()
            },
            physics: {
                hairBones: [],
                clothBones: [],
                velocity: { x: 0, y: 0, z: 0 }
            }
        };
        
        // Create the 3D model
        this.buildCharacterModel(character);
        
        // Setup animations
        this.setupAnimations(character);
        
        this.characters.set(characterId, character);
        return character;
    }
    
    buildCharacterModel(character) {
        const custom = character.customization;
        
        // Create base body (anime proportions)
        const bodyGeometry = new THREE.CapsuleGeometry(0.3 * custom.height, 1.4 * custom.height, 16, 32);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: custom.skinTone,
            roughness: 0.7,
            metalness: 0.1
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        
        // Create head (larger for anime style)
        const headGeometry = new THREE.SphereGeometry(0.25 * custom.height, 32, 32);
        const head = new THREE.Mesh(headGeometry, bodyMaterial);
        head.position.y = 1.0 * custom.height;
        body.add(head);
        
        // Create anime eyes (large, expressive)
        this.createAnimeEyes(head, custom);
        
        // Create mouth
        this.createMouth(head, custom);
        
        // Create hair with physics
        this.createHair(head, custom, character);
        
        // Create costume with cloth simulation
        this.createCostume(body, custom, character);
        
        // Add accessories
        custom.accessories.forEach(accessory => {
            this.addAccessory(body, head, accessory, custom);
        });
        
        // Add glowing outline effect
        this.addOutlineEffect(body, custom);
        
        // Add particle trail
        this.addParticleTrail(body, character);
        
        character.mesh = body;
        this.scene.add(body);
    }
    
    createAnimeEyes(head, custom) {
        // Left eye
        const eyeGeometry = new THREE.CircleGeometry(0.08, 32);
        const eyeMaterial = new THREE.MeshBasicMaterial({
            color: custom.eyeColor,
            transparent: true,
            opacity: 1.0
        });
        
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.08, 0.05, 0.22);
        head.add(leftEye);
        
        // Add eye shine (anime sparkle)
        const shineGeometry = new THREE.CircleGeometry(0.03, 16);
        const shineMaterial = new THREE.MeshBasicMaterial({
            color: 0xFFFFFF,
            transparent: true,
            opacity: 0.8
        });
        const leftShine = new THREE.Mesh(shineGeometry, shineMaterial);
        leftShine.position.set(0.02, 0.02, 0.01);
        leftEye.add(leftShine);
        
        // Right eye (mirror)
        const rightEye = leftEye.clone();
        rightEye.position.x = 0.08;
        head.add(rightEye);
        
        // Store for animations
        head.userData.eyes = { left: leftEye, right: rightEye };
    }
    
    createMouth(head, custom) {
        const mouthGeometry = new THREE.TorusGeometry(0.04, 0.01, 8, 16, Math.PI);
        const mouthMaterial = new THREE.MeshBasicMaterial({ color: 0xFF6B6B });
        const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
        mouth.position.set(0, -0.05, 0.22);
        mouth.rotation.z = Math.PI;
        head.add(mouth);
        
        head.userData.mouth = mouth;
    }
    
    createHair(head, custom, character) {
        const hairConfig = this.getHairConfig(custom.hairstyle);
        const hairMaterial = new THREE.MeshStandardMaterial({
            color: custom.hairColor,
            roughness: 0.6,
            metalness: 0.2,
            emissive: custom.hairColor,
            emissiveIntensity: 0.1
        });
        
        hairConfig.strands.forEach((strand, index) => {
            const strandGeometry = this.createHairStrand(strand);
            const strandMesh = new THREE.Mesh(strandGeometry, hairMaterial);
            strandMesh.position.copy(strand.origin);
            head.add(strandMesh);
            
            // Add to physics simulation
            character.physics.hairBones.push({
                mesh: strandMesh,
                restPosition: strand.origin.clone(),
                velocity: { x: 0, y: 0, z: 0 },
                mass: strand.mass || 0.1
            });
        });
    }
    
    getHairConfig(hairstyle) {
        // Different hair configurations for various styles
        const configs = {
            long_straight: {
                strands: [
                    { origin: { x: -0.15, y: 0.2, z: 0 }, length: 0.8, segments: 12, mass: 0.15 },
                    { origin: { x: -0.10, y: 0.2, z: 0 }, length: 0.9, segments: 12, mass: 0.15 },
                    { origin: { x: 0, y: 0.25, z: 0 }, length: 1.0, segments: 12, mass: 0.2 },
                    { origin: { x: 0.10, y: 0.2, z: 0 }, length: 0.9, segments: 12, mass: 0.15 },
                    { origin: { x: 0.15, y: 0.2, z: 0 }, length: 0.8, segments: 12, mass: 0.15 }
                ]
            },
            twin_tails: {
                strands: [
                    { origin: { x: -0.18, y: 0.15, z: 0 }, length: 0.7, segments: 10, mass: 0.2 },
                    { origin: { x: -0.18, y: 0.12, z: -0.05 }, length: 0.7, segments: 10, mass: 0.2 },
                    { origin: { x: 0.18, y: 0.15, z: 0 }, length: 0.7, segments: 10, mass: 0.2 },
                    { origin: { x: 0.18, y: 0.12, z: -0.05 }, length: 0.7, segments: 10, mass: 0.2 }
                ]
            },
            short_spiky: {
                strands: [
                    { origin: { x: -0.1, y: 0.25, z: 0.1 }, length: 0.15, segments: 3, mass: 0.05 },
                    { origin: { x: 0, y: 0.27, z: 0.1 }, length: 0.18, segments: 3, mass: 0.05 },
                    { origin: { x: 0.1, y: 0.25, z: 0.1 }, length: 0.15, segments: 3, mass: 0.05 },
                    { origin: { x: 0, y: 0.25, z: -0.1 }, length: 0.12, segments: 3, mass: 0.05 }
                ]
            }
        };
        
        return configs[hairstyle] || configs.long_straight;
    }
    
    createHairStrand(config) {
        const points = [];
        for (let i = 0; i <= config.segments; i++) {
            const t = i / config.segments;
            points.push(new THREE.Vector3(0, -config.length * t, 0));
        }
        
        return new THREE.TubeGeometry(
            new THREE.CatmullRomCurve3(points),
            config.segments,
            0.02,
            8,
            false
        );
    }
    
    createCostume(body, custom, character) {
        const costume = custom.costume;
        
        // Create costume based on type
        let costumeMesh;
        switch (costume.type) {
            case 'dress':
                costumeMesh = this.createDress(costume.colors);
                break;
            case 'armor':
                costumeMesh = this.createArmor(costume.colors);
                break;
            case 'robes':
                costumeMesh = this.createRobes(costume.colors);
                break;
            default:
                costumeMesh = this.createDress(costume.colors);
        }
        
        body.add(costumeMesh);
        
        // Add cloth physics bones
        if (costume.type === 'dress' || costume.type === 'robes') {
            character.physics.clothBones.push({
                mesh: costumeMesh,
                restRotation: costumeMesh.rotation.clone()
            });
        }
    }
    
    createDress(colors) {
        const dressGeometry = new THREE.ConeGeometry(0.5, 1.0, 16);
        const dressMaterial = new THREE.MeshStandardMaterial({
            color: colors[0],
            roughness: 0.8,
            metalness: 0.1
        });
        const dress = new THREE.Mesh(dressGeometry, dressMaterial);
        dress.position.y = -0.5;
        return dress;
    }
    
    createArmor(colors) {
        const armorGroup = new THREE.Group();
        
        // Chest plate
        const chestGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.3);
        const armorMaterial = new THREE.MeshStandardMaterial({
            color: colors[0],
            roughness: 0.3,
            metalness: 0.9,
            emissive: colors[1],
            emissiveIntensity: 0.2
        });
        const chest = new THREE.Mesh(chestGeometry, armorMaterial);
        chest.position.y = 0.2;
        armorGroup.add(chest);
        
        return armorGroup;
    }
    
    createRobes(colors) {
        const robesGeometry = new THREE.CylinderGeometry(0.4, 0.6, 1.2, 16);
        const robesMaterial = new THREE.MeshStandardMaterial({
            color: colors[0],
            roughness: 0.9,
            metalness: 0.0,
            emissive: colors[1],
            emissiveIntensity: 0.1
        });
        const robes = new THREE.Mesh(robesGeometry, robesMaterial);
        robes.position.y = -0.3;
        return robes;
    }
    
    addAccessory(body, head, accessoryType, custom) {
        // Create different accessories
        let accessory;
        
        if (accessoryType.includes('wings')) {
            accessory = this.createWings(accessoryType);
            accessory.position.set(0, 0.5, -0.3);
            body.add(accessory);
        } else if (accessoryType.includes('ears')) {
            accessory = this.createEars(accessoryType);
            head.add(accessory);
        } else if (accessoryType.includes('tail')) {
            accessory = this.createTail(accessoryType);
            accessory.position.set(0, -0.5, -0.3);
            body.add(accessory);
        } else if (accessoryType === 'halo') {
            accessory = this.createHalo();
            accessory.position.y = 0.4;
            head.add(accessory);
        }
    }
    
    createWings(type) {
        const wingsGroup = new THREE.Group();
        const wingMaterial = new THREE.MeshStandardMaterial({
            color: type.includes('angel') ? 0xFFFFFF : 0x8B0000,
            transparent: true,
            opacity: 0.9,
            emissive: type.includes('angel') ? 0xFFD700 : 0xFF0000,
            emissiveIntensity: 0.3
        });
        
        // Left wing
        const wingGeometry = new THREE.PlaneGeometry(0.5, 0.8);
        const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
        leftWing.position.set(-0.3, 0, 0);
        leftWing.rotation.y = -Math.PI / 6;
        wingsGroup.add(leftWing);
        
        // Right wing (mirror)
        const rightWing = leftWing.clone();
        rightWing.position.x = 0.3;
        rightWing.rotation.y = Math.PI / 6;
        wingsGroup.add(rightWing);
        
        return wingsGroup;
    }
    
    createEars(type) {
        const earsGroup = new THREE.Group();
        const earGeometry = new THREE.ConeGeometry(0.05, 0.15, 8);
        const earMaterial = new THREE.MeshStandardMaterial({ color: 0xFFB6C1 });
        
        const leftEar = new THREE.Mesh(earGeometry, earMaterial);
        leftEar.position.set(-0.15, 0.15, 0);
        leftEar.rotation.z = -Math.PI / 4;
        earsGroup.add(leftEar);
        
        const rightEar = leftEar.clone();
        rightEar.position.x = 0.15;
        rightEar.rotation.z = Math.PI / 4;
        earsGroup.add(rightEar);
        
        return earsGroup;
    }
    
    createTail(type) {
        const tailGeometry = new THREE.CylinderGeometry(0.05, 0.02, 0.6, 8);
        const tailMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
        const tail = new THREE.Mesh(tailGeometry, tailMaterial);
        tail.rotation.x = Math.PI / 4;
        return tail;
    }
    
    createHalo() {
        const haloGeometry = new THREE.TorusGeometry(0.15, 0.02, 16, 32);
        const haloMaterial = new THREE.MeshStandardMaterial({
            color: 0xFFD700,
            emissive: 0xFFD700,
            emissiveIntensity: 1.0
        });
        return new THREE.Mesh(haloGeometry, haloMaterial);
    }
    
    addOutlineEffect(body, custom) {
        // Create outline shader material
        const outlineMaterial = new THREE.ShaderMaterial({
            uniforms: {
                color: { value: new THREE.Color(custom.costume.colors[1] || 0xFFD700) },
                thickness: { value: 0.03 }
            },
            vertexShader: `
                uniform float thickness;
                void main() {
                    vec3 newPosition = position + normal * thickness;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 color;
                void main() {
                    gl_FragColor = vec4(color, 1.0);
                }
            `,
            side: THREE.BackSide
        });
        
        const outline = body.clone();
        outline.material = outlineMaterial;
        body.add(outline);
    }
    
    addParticleTrail(body, character) {
        // Particle system for character trail
        const particleCount = 50;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount * 3; i++) {
            positions[i] = 0;
        }
        
        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            color: character.customization.costume.colors[0],
            size: 0.05,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        
        const particleSystem = new THREE.Points(particles, particleMaterial);
        body.add(particleSystem);
        
        character.particleTrail = particleSystem;
    }
    
    setupAnimations(character) {
        // Animation mixer setup would go here
        // For now, store animation states
        character.animations.mixer = {
            currentAction: null,
            actions: new Map()
        };
    }
    
    update(deltaTime) {
        const dt = deltaTime / 1000;
        
        for (const [id, character] of this.characters) {
            // Update hair physics
            this.updateHairPhysics(character, dt);
            
            // Update cloth physics
            this.updateClothPhysics(character, dt);
            
            // Update particle trail
            this.updateParticleTrail(character, dt);
            
            // Update facial animations (blink)
            this.updateFacialAnimations(character, dt);
        }
        
        this.lastUpdate = Date.now();
    }
    
    updateHairPhysics(character, deltaTime) {
        const wind = this.physics.hairWind;
        const gravity = { x: 0, y: -9.8, z: 0 };
        
        character.physics.hairBones.forEach(bone => {
            // Simple physics simulation
            const force = {
                x: wind.x + (Math.random() - 0.5) * 0.5,
                y: gravity.y + wind.y,
                z: wind.z + (Math.random() - 0.5) * 0.5
            };
            
            bone.velocity.x += force.x * deltaTime / bone.mass;
            bone.velocity.y += force.y * deltaTime / bone.mass;
            bone.velocity.z += force.z * deltaTime / bone.mass;
            
            // Apply damping
            bone.velocity.x *= 0.98;
            bone.velocity.y *= 0.98;
            bone.velocity.z *= 0.98;
            
            // Update position
            bone.mesh.position.x += bone.velocity.x * deltaTime;
            bone.mesh.position.y += bone.velocity.y * deltaTime;
            bone.mesh.position.z += bone.velocity.z * deltaTime;
            
            // Constraint to rest position (spring)
            const springK = 5.0;
            const dx = bone.restPosition.x - bone.mesh.position.x;
            const dy = bone.restPosition.y - bone.mesh.position.y;
            const dz = bone.restPosition.z - bone.mesh.position.z;
            
            bone.velocity.x += dx * springK * deltaTime;
            bone.velocity.y += dy * springK * deltaTime;
            bone.velocity.z += dz * springK * deltaTime;
        });
    }
    
    updateClothPhysics(character, deltaTime) {
        // Simple cloth sway animation
        character.physics.clothBones.forEach(bone => {
            const time = Date.now() / 1000;
            bone.mesh.rotation.x = Math.sin(time * 2) * 0.1;
            bone.mesh.rotation.z = Math.cos(time * 1.5) * 0.05;
        });
    }
    
    updateParticleTrail(character, deltaTime) {
        if (!character.particleTrail) return;
        
        const positions = character.particleTrail.geometry.attributes.position.array;
        
        // Shift particles back
        for (let i = positions.length - 3; i >= 3; i -= 3) {
            positions[i] = positions[i - 3];
            positions[i + 1] = positions[i - 2];
            positions[i + 2] = positions[i - 1];
        }
        
        // Add new particle at character position
        if (character.mesh) {
            positions[0] = character.mesh.position.x;
            positions[1] = character.mesh.position.y;
            positions[2] = character.mesh.position.z;
        }
        
        character.particleTrail.geometry.attributes.position.needsUpdate = true;
    }
    
    updateFacialAnimations(character, deltaTime) {
        // Blink animation
        if (character.mesh && character.mesh.children[0].userData.eyes) {
            const time = Date.now();
            if (time % 3000 < 200) { // Blink every 3 seconds
                const eyes = character.mesh.children[0].userData.eyes;
                const blinkProgress = (time % 200) / 200;
                const scale = 1 - Math.sin(blinkProgress * Math.PI) * 0.8;
                eyes.left.scale.y = scale;
                eyes.right.scale.y = scale;
            }
        }
    }
    
    playAnimation(characterId, animationName) {
        const character = this.characters.get(characterId);
        if (!character) return;
        
        character.animations.current = animationName;
        // Animation playback would be implemented here
    }
    
    setExpression(characterId, expressionName) {
        const character = this.characters.get(characterId);
        if (!character) return;
        
        character.expressions.current = expressionName;
        // Facial expression blending would be implemented here
    }
    
    setWind(windVector) {
        this.physics.hairWind = windVector;
        this.physics.clothWind = windVector;
    }
    
    getCharacter(characterId) {
        return this.characters.get(characterId);
    }
    
    removeCharacter(characterId) {
        const character = this.characters.get(characterId);
        if (character && character.mesh) {
            this.scene.remove(character.mesh);
        }
        this.characters.delete(characterId);
    }
}
