/**
 * Advanced3DModelSystem - Professional 3D human and monster models
 * Replaces simple geometric shapes with detailed character models
 */

import * as THREE from 'three';

export class Advanced3DModelSystem {
    constructor(scene) {
        this.scene = scene;
        this.models = new Map();
        this.animations = new Map();
        this.modelCache = new Map();
        
        // Initialize model library
        this.initializeModels();
    }

    initializeModels() {
        // Create detailed human character models
        this.createHumanModels();
        
        // Create detailed monster models
        this.createMonsterModels();
        
        // Create weapon and equipment models
        this.createEquipmentModels();
    }

    createHumanModels() {
        const humanClasses = [
            {
                name: 'warrior',
                colors: { skin: 0xffdbac, hair: 0x8b4513, armor: 0x4a4a4a },
                build: 'muscular'
            },
            {
                name: 'mage',
                colors: { skin: 0xf5e6d3, hair: 0x4b0082, robe: 0x6a0dad },
                build: 'slender'
            },
            {
                name: 'rogue',
                colors: { skin: 0xffe4c4, hair: 0x2f4f4f, outfit: 0x1a1a1a },
                build: 'agile'
            },
            {
                name: 'ranger',
                colors: { skin: 0xf4a460, hair: 0x228b22, gear: 0x556b2f },
                build: 'athletic'
            },
            {
                name: 'cleric',
                colors: { skin: 0xfff5e1, hair: 0xffd700, robes: 0xffffff },
                build: 'balanced'
            },
            {
                name: 'necromancer',
                colors: { skin: 0xe6e6fa, hair: 0x1c1c1c, robes: 0x2f0f2f },
                build: 'gaunt'
            }
        ];

        humanClasses.forEach(classData => {
            this.models.set(classData.name, this.createDetailedHuman(classData));
        });
    }

    createDetailedHuman(classData) {
        const group = new THREE.Group();
        group.name = classData.name;

        // Head with facial features
        const headGeo = new THREE.SphereGeometry(0.5, 32, 32);
        const headMat = new THREE.MeshPhongMaterial({ 
            color: classData.colors.skin,
            shininess: 20,
            flatShading: false
        });
        const head = new THREE.Mesh(headGeo, headMat);
        head.position.y = 1.6;
        head.castShadow = true;
        group.add(head);

        // Eyes
        const eyeGeo = new THREE.SphereGeometry(0.08, 16, 16);
        const eyeMat = new THREE.MeshBasicMaterial({ color: 0x001f3f });
        
        const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
        leftEye.position.set(-0.15, 1.65, 0.4);
        group.add(leftEye);
        
        const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
        rightEye.position.set(0.15, 1.65, 0.4);
        group.add(rightEye);

        // Hair
        const hairGeo = new THREE.SphereGeometry(0.52, 32, 32);
        const hairMat = new THREE.MeshPhongMaterial({ 
            color: classData.colors.hair,
            shininess: 60
        });
        const hair = new THREE.Mesh(hairGeo, hairMat);
        hair.position.y = 1.7;
        hair.scale.set(1, 1.2, 0.9);
        hair.castShadow = true;
        group.add(hair);

        // Body (torso)
        const bodyGeo = new THREE.CylinderGeometry(0.3, 0.4, 1.2, 32);
        const bodyMat = new THREE.MeshPhongMaterial({ 
            color: classData.colors.armor || classData.colors.robe || classData.colors.outfit,
            shininess: 30
        });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.y = 0.8;
        body.castShadow = true;
        group.add(body);

        // Arms
        const armGeo = new THREE.CylinderGeometry(0.12, 0.1, 0.8, 16);
        const armMat = new THREE.MeshPhongMaterial({ 
            color: classData.colors.skin,
            shininess: 20
        });
        
        const leftArm = new THREE.Mesh(armGeo, armMat);
        leftArm.position.set(-0.5, 0.9, 0);
        leftArm.rotation.z = Math.PI / 6;
        leftArm.castShadow = true;
        group.add(leftArm);
        
        const rightArm = new THREE.Mesh(armGeo, armMat);
        rightArm.position.set(0.5, 0.9, 0);
        rightArm.rotation.z = -Math.PI / 6;
        rightArm.castShadow = true;
        group.add(rightArm);

        // Legs
        const legGeo = new THREE.CylinderGeometry(0.15, 0.12, 1.0, 16);
        const legMat = new THREE.MeshPhongMaterial({ 
            color: classData.colors.armor || classData.colors.outfit || 0x4a4a4a,
            shininess: 20
        });
        
        const leftLeg = new THREE.Mesh(legGeo, legMat);
        leftLeg.position.set(-0.2, -0.3, 0);
        leftLeg.castShadow = true;
        group.add(leftLeg);
        
        const rightLeg = new THREE.Mesh(legGeo, legMat);
        rightLeg.position.set(0.2, -0.3, 0);
        rightLeg.castShadow = true;
        group.add(rightLeg);

        // Add class-specific details
        this.addClassDetails(group, classData);

        return group;
    }

    addClassDetails(group, classData) {
        switch(classData.name) {
            case 'warrior':
                // Add shoulder pads
                const shoulderGeo = new THREE.BoxGeometry(0.3, 0.2, 0.3);
                const shoulderMat = new THREE.MeshPhongMaterial({ color: 0x8b8b8b, metalness: 0.8 });
                
                const leftShoulder = new THREE.Mesh(shoulderGeo, shoulderMat);
                leftShoulder.position.set(-0.5, 1.3, 0);
                group.add(leftShoulder);
                
                const rightShoulder = new THREE.Mesh(shoulderGeo, shoulderMat);
                rightShoulder.position.set(0.5, 1.3, 0);
                group.add(rightShoulder);
                break;

            case 'mage':
                // Add wizard hat
                const hatGeo = new THREE.ConeGeometry(0.4, 0.8, 32);
                const hatMat = new THREE.MeshPhongMaterial({ color: 0x4b0082 });
                const hat = new THREE.Mesh(hatGeo, hatMat);
                hat.position.y = 2.3;
                group.add(hat);

                // Add staff holder
                const staffGeo = new THREE.CylinderGeometry(0.05, 0.05, 2.0, 16);
                const staffMat = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
                const staff = new THREE.Mesh(staffGeo, staffMat);
                staff.position.set(0.6, 0.5, 0);
                group.add(staff);

                // Add magic orb on staff
                const orbGeo = new THREE.SphereGeometry(0.15, 32, 32);
                const orbMat = new THREE.MeshPhongMaterial({ 
                    color: 0x00ffff,
                    emissive: 0x0088ff,
                    emissiveIntensity: 0.5
                });
                const orb = new THREE.Mesh(orbGeo, orbMat);
                orb.position.set(0.6, 1.5, 0);
                group.add(orb);
                break;

            case 'rogue':
                // Add hood
                const hoodGeo = new THREE.ConeGeometry(0.6, 0.5, 32);
                const hoodMat = new THREE.MeshPhongMaterial({ color: 0x1a1a1a });
                const hood = new THREE.Mesh(hoodGeo, hoodMat);
                hood.position.y = 1.9;
                group.add(hood);

                // Add daggers
                const daggerGeo = new THREE.BoxGeometry(0.05, 0.4, 0.05);
                const daggerMat = new THREE.MeshPhongMaterial({ color: 0xc0c0c0 });
                
                const leftDagger = new THREE.Mesh(daggerGeo, daggerMat);
                leftDagger.position.set(-0.3, 0.5, 0.2);
                leftDagger.rotation.z = Math.PI / 4;
                group.add(leftDagger);
                
                const rightDagger = new THREE.Mesh(daggerGeo, daggerMat);
                rightDagger.position.set(0.3, 0.5, 0.2);
                rightDagger.rotation.z = -Math.PI / 4;
                group.add(rightDagger);
                break;

            case 'ranger':
                // Add bow
                const bowGeo = new THREE.TorusGeometry(0.5, 0.03, 16, 32, Math.PI);
                const bowMat = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
                const bow = new THREE.Mesh(bowGeo, bowMat);
                bow.position.set(-0.7, 0.8, 0);
                bow.rotation.z = Math.PI / 2;
                group.add(bow);

                // Add quiver
                const quiverGeo = new THREE.CylinderGeometry(0.1, 0.12, 0.5, 16);
                const quiverMat = new THREE.MeshPhongMaterial({ color: 0x654321 });
                const quiver = new THREE.Mesh(quiverGeo, quiverMat);
                quiver.position.set(0.3, 0.8, -0.3);
                group.add(quiver);
                break;

            case 'cleric':
                // Add halo
                const haloGeo = new THREE.TorusGeometry(0.4, 0.03, 16, 32);
                const haloMat = new THREE.MeshPhongMaterial({ 
                    color: 0xffd700,
                    emissive: 0xffaa00,
                    emissiveIntensity: 0.5
                });
                const halo = new THREE.Mesh(haloGeo, haloMat);
                halo.position.y = 2.3;
                halo.rotation.x = Math.PI / 2;
                group.add(halo);

                // Add holy symbol
                const symbolGeo = new THREE.BoxGeometry(0.15, 0.3, 0.05);
                const symbolMat = new THREE.MeshPhongMaterial({ color: 0xffd700 });
                const symbol = new THREE.Mesh(symbolGeo, symbolMat);
                symbol.position.set(0, 0.8, 0.45);
                group.add(symbol);
                break;

            case 'necromancer':
                // Add skull accessory
                const skullGeo = new THREE.SphereGeometry(0.15, 16, 16);
                const skullMat = new THREE.MeshPhongMaterial({ color: 0xeeeeee });
                const skull = new THREE.Mesh(skullGeo, skullMat);
                skull.position.set(0.5, 1.0, 0.3);
                group.add(skull);

                // Add dark aura
                const auraGeo = new THREE.SphereGeometry(1.2, 32, 32);
                const auraMat = new THREE.MeshPhongMaterial({ 
                    color: 0x1a001a,
                    transparent: true,
                    opacity: 0.2,
                    emissive: 0x440044,
                    emissiveIntensity: 0.3
                });
                const aura = new THREE.Mesh(auraGeo, auraMat);
                aura.position.y = 0.8;
                group.add(aura);
                break;
        }
    }

    createMonsterModels() {
        const monsterTypes = [
            { name: 'dragon', color: 0xff0000, size: 3.0 },
            { name: 'demon', color: 0x8b0000, size: 2.5 },
            { name: 'skeleton', color: 0xeeeeee, size: 1.8 },
            { name: 'orc', color: 0x2d5016, size: 2.0 },
            { name: 'goblin', color: 0x6b8e23, size: 1.2 },
            { name: 'elemental', color: 0x00ffff, size: 2.0 },
            { name: 'beast', color: 0x8b4513, size: 1.5 },
            { name: 'undead', color: 0x4a4a4a, size: 1.7 }
        ];

        monsterTypes.forEach(monster => {
            this.models.set(`monster_${monster.name}`, this.createDetailedMonster(monster));
        });
    }

    createDetailedMonster(monsterData) {
        const group = new THREE.Group();
        group.name = `monster_${monsterData.name}`;
        const scale = monsterData.size;

        switch(monsterData.name) {
            case 'dragon':
                // Dragon body
                const dragonBodyGeo = new THREE.SphereGeometry(1, 32, 32);
                const dragonBodyMat = new THREE.MeshPhongMaterial({ 
                    color: monsterData.color,
                    shininess: 100
                });
                const dragonBody = new THREE.Mesh(dragonBodyGeo, dragonBodyMat);
                dragonBody.scale.set(1.5, 1, 2);
                group.add(dragonBody);

                // Dragon head
                const headGeo = new THREE.ConeGeometry(0.6, 1.2, 32);
                const head = new THREE.Mesh(headGeo, dragonBodyMat);
                head.position.set(0, 0.5, 2);
                head.rotation.x = -Math.PI / 2;
                group.add(head);

                // Wings
                const wingGeo = new THREE.BoxGeometry(2, 0.1, 1.5);
                const leftWing = new THREE.Mesh(wingGeo, dragonBodyMat);
                leftWing.position.set(-1.5, 0.5, 0);
                leftWing.rotation.z = Math.PI / 6;
                group.add(leftWing);

                const rightWing = new THREE.Mesh(wingGeo, dragonBodyMat);
                rightWing.position.set(1.5, 0.5, 0);
                rightWing.rotation.z = -Math.PI / 6;
                group.add(rightWing);

                // Horns
                const hornGeo = new THREE.ConeGeometry(0.1, 0.5, 16);
                const hornMat = new THREE.MeshPhongMaterial({ color: 0x000000 });
                const leftHorn = new THREE.Mesh(hornGeo, hornMat);
                leftHorn.position.set(-0.3, 0.9, 2);
                group.add(leftHorn);

                const rightHorn = new THREE.Mesh(hornGeo, hornMat);
                rightHorn.position.set(0.3, 0.9, 2);
                group.add(rightHorn);

                // Fire effect (emissive eyes)
                const eyeGeo = new THREE.SphereGeometry(0.15, 16, 16);
                const eyeMat = new THREE.MeshPhongMaterial({ 
                    color: 0xff6600,
                    emissive: 0xff3300,
                    emissiveIntensity: 1.0
                });
                const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
                leftEye.position.set(-0.2, 0.7, 2.5);
                group.add(leftEye);

                const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
                rightEye.position.set(0.2, 0.7, 2.5);
                group.add(rightEye);
                break;

            case 'demon':
                // Demon body (muscular)
                const demonBodyGeo = new THREE.CylinderGeometry(0.6, 0.8, 2, 32);
                const demonMat = new THREE.MeshPhongMaterial({ 
                    color: monsterData.color,
                    shininess: 50
                });
                const demonBody = new THREE.Mesh(demonBodyGeo, demonMat);
                group.add(demonBody);

                // Demon head
                const demonHeadGeo = new THREE.SphereGeometry(0.5, 32, 32);
                const demonHead = new THREE.Mesh(demonHeadGeo, demonMat);
                demonHead.position.y = 1.5;
                group.add(demonHead);

                // Large horns
                const demonHornGeo = new THREE.ConeGeometry(0.15, 1.0, 16);
                const demonHornMat = new THREE.MeshPhongMaterial({ color: 0x000000 });
                const demonLeftHorn = new THREE.Mesh(demonHornGeo, demonHornMat);
                demonLeftHorn.position.set(-0.4, 2.0, 0);
                demonLeftHorn.rotation.z = Math.PI / 8;
                group.add(demonLeftHorn);

                const demonRightHorn = new THREE.Mesh(demonHornGeo, demonHornMat);
                demonRightHorn.position.set(0.4, 2.0, 0);
                demonRightHorn.rotation.z = -Math.PI / 8;
                group.add(demonRightHorn);

                // Glowing eyes
                const demonEyeGeo = new THREE.SphereGeometry(0.1, 16, 16);
                const demonEyeMat = new THREE.MeshPhongMaterial({ 
                    color: 0xff0000,
                    emissive: 0xff0000,
                    emissiveIntensity: 1.0
                });
                const demonLeftEye = new THREE.Mesh(demonEyeGeo, demonEyeMat);
                demonLeftEye.position.set(-0.2, 1.6, 0.4);
                group.add(demonLeftEye);

                const demonRightEye = new THREE.Mesh(demonEyeGeo, demonEyeMat);
                demonRightEye.position.set(0.2, 1.6, 0.4);
                group.add(demonRightEye);

                // Muscular arms
                const armGeo = new THREE.CylinderGeometry(0.2, 0.15, 1.5, 16);
                const leftArm = new THREE.Mesh(armGeo, demonMat);
                leftArm.position.set(-0.8, 0.5, 0);
                leftArm.rotation.z = Math.PI / 4;
                group.add(leftArm);

                const rightArm = new THREE.Mesh(armGeo, demonMat);
                rightArm.position.set(0.8, 0.5, 0);
                rightArm.rotation.z = -Math.PI / 4;
                group.add(rightArm);
                break;

            case 'skeleton':
                // Skeleton skull
                const skullGeo = new THREE.SphereGeometry(0.4, 32, 32);
                const boneMat = new THREE.MeshPhongMaterial({ 
                    color: monsterData.color,
                    shininess: 10
                });
                const skull = new THREE.Mesh(skullGeo, boneMat);
                skull.position.y = 1.5;
                group.add(skull);

                // Rib cage
                const ribGeo = new THREE.CylinderGeometry(0.3, 0.4, 1.0, 32, 1, true);
                const ribs = new THREE.Mesh(ribGeo, boneMat);
                ribs.position.y = 0.6;
                group.add(ribs);

                // Spine
                const spineGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.5, 16);
                const spine = new THREE.Mesh(spineGeo, boneMat);
                spine.position.y = 0.4;
                group.add(spine);

                // Bone arms
                const boneArmGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.8, 16);
                const skelLeftArm = new THREE.Mesh(boneArmGeo, boneMat);
                skelLeftArm.position.set(-0.5, 0.8, 0);
                skelLeftArm.rotation.z = Math.PI / 6;
                group.add(skelLeftArm);

                const skelRightArm = new THREE.Mesh(boneArmGeo, boneMat);
                skelRightArm.position.set(0.5, 0.8, 0);
                skelRightArm.rotation.z = -Math.PI / 6;
                group.add(skelRightArm);

                // Glowing eye sockets
                const socketGeo = new THREE.SphereGeometry(0.08, 16, 16);
                const socketMat = new THREE.MeshPhongMaterial({ 
                    color: 0x00ff00,
                    emissive: 0x00ff00,
                    emissiveIntensity: 1.0
                });
                const skelLeftEye = new THREE.Mesh(socketGeo, socketMat);
                skelLeftEye.position.set(-0.15, 1.55, 0.35);
                group.add(skelLeftEye);

                const skelRightEye = new THREE.Mesh(socketGeo, socketMat);
                skelRightEye.position.set(0.15, 1.55, 0.35);
                group.add(skelRightEye);
                break;

            default:
                // Generic monster (ogre/orc/goblin type)
                const bodyGeo = new THREE.SphereGeometry(0.6, 32, 32);
                const bodyMat = new THREE.MeshPhongMaterial({ 
                    color: monsterData.color,
                    shininess: 30
                });
                const body = new THREE.Mesh(bodyGeo, bodyMat);
                body.scale.set(1, 1.5, 1);
                group.add(body);

                const monsterHeadGeo = new THREE.SphereGeometry(0.4, 32, 32);
                const monsterHead = new THREE.Mesh(monsterHeadGeo, bodyMat);
                monsterHead.position.y = 1.2;
                group.add(monsterHead);

                // Fangs/tusks
                const tuskGeo = new THREE.ConeGeometry(0.08, 0.3, 16);
                const tuskMat = new THREE.MeshPhongMaterial({ color: 0xffffff });
                const leftTusk = new THREE.Mesh(tuskGeo, tuskMat);
                leftTusk.position.set(-0.15, 1.0, 0.35);
                leftTusk.rotation.x = Math.PI;
                group.add(leftTusk);

                const rightTusk = new THREE.Mesh(tuskGeo, tuskMat);
                rightTusk.position.set(0.15, 1.0, 0.35);
                rightTusk.rotation.x = Math.PI;
                group.add(rightTusk);
        }

        group.scale.multiplyScalar(scale);
        return group;
    }

    createEquipmentModels() {
        // Swords
        this.models.set('sword_basic', this.createSword(0xc0c0c0, 0x8b4513));
        this.models.set('sword_fire', this.createSword(0xff0000, 0x8b0000));
        this.models.set('sword_ice', this.createSword(0x00ffff, 0x0088ff));
        this.models.set('sword_legendary', this.createSword(0xffd700, 0xff8800));

        // Shields
        this.models.set('shield_basic', this.createShield(0x4a4a4a));
        this.models.set('shield_royal', this.createShield(0x0000ff));
        this.models.set('shield_legendary', this.createShield(0xffd700));
    }

    createSword(bladeColor, hiltColor) {
        const group = new THREE.Group();

        // Blade
        const bladeGeo = new THREE.BoxGeometry(0.1, 1.5, 0.05);
        const bladeMat = new THREE.MeshPhongMaterial({ 
            color: bladeColor,
            shininess: 100,
            metalness: 0.8
        });
        const blade = new THREE.Mesh(bladeGeo, bladeMat);
        blade.position.y = 0.75;
        group.add(blade);

        // Hilt
        const hiltGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.4, 16);
        const hiltMat = new THREE.MeshPhongMaterial({ 
            color: hiltColor,
            shininess: 50
        });
        const hilt = new THREE.Mesh(hiltGeo, hiltMat);
        group.add(hilt);

        // Crossguard
        const guardGeo = new THREE.BoxGeometry(0.5, 0.08, 0.08);
        const guard = new THREE.Mesh(guardGeo, bladeMat);
        group.add(guard);

        // Pommel
        const pommelGeo = new THREE.SphereGeometry(0.1, 16, 16);
        const pommel = new THREE.Mesh(pommelGeo, hiltMat);
        pommel.position.y = -0.2;
        group.add(pommel);

        return group;
    }

    createShield(color) {
        const group = new THREE.Group();

        // Shield face
        const shieldGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.1, 32);
        const shieldMat = new THREE.MeshPhongMaterial({ 
            color: color,
            shininess: 80,
            metalness: 0.6
        });
        const shield = new THREE.Mesh(shieldGeo, shieldMat);
        shield.rotation.x = Math.PI / 2;
        group.add(shield);

        // Shield boss (center)
        const bossGeo = new THREE.SphereGeometry(0.15, 32, 32);
        const bossMat = new THREE.MeshPhongMaterial({ 
            color: 0xffd700,
            shininess: 100
        });
        const boss = new THREE.Mesh(bossGeo, bossMat);
        group.add(boss);

        return group;
    }

    getModel(modelName) {
        return this.models.get(modelName)?.clone();
    }

    createCharacterModel(className) {
        return this.getModel(className);
    }

    createMonsterModel(monsterType) {
        return this.getModel(`monster_${monsterType}`);
    }

    createWeaponModel(weaponType) {
        return this.getModel(weaponType);
    }

    update(delta) {
        // Update model animations if any
    }

    dispose() {
        this.models.forEach(model => {
            model.traverse(child => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach(mat => mat.dispose());
                    } else {
                        child.material.dispose();
                    }
                }
            });
        });
        this.models.clear();
    }
}
