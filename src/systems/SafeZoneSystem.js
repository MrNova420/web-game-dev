/**
import { logger } from '../core/Logger.js';
 * SafeZoneSystem - Manages safe zone hub area where players can rest, shop, and prepare
 * Provides a peaceful starting area with various NPCs and facilities
 */

import * as THREE from 'three';

export class SafeZoneSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.scene = gameEngine.scene;
        this.isInSafeZone = false;
        this.safeZoneObjects = [];
        this.npcs = [];
        
        logger.info('🏰 Safe Zone System initialized');
    }
    
    createSafeZone() {
        logger.info('🏰 Creating Safe Zone Hub...');
        this.isInSafeZone = true;
        
        // Clear existing dungeon if any
        this.clearDungeon();
        
        // Create safe zone environment
        this.createGround();
        this.createBuildings();
        this.createLighting();
        this.createNPCs();
        this.createDecorations();
        this.createPortals();
        
        // Position player at spawn point
        if (this.gameEngine.player && this.gameEngine.player.mesh) {
            this.gameEngine.player.mesh.position.set(0, 1, 0);
        }
        
        // Show safe zone UI
        this.showSafeZoneUI();
        
        logger.info('✅ Safe Zone Hub created');
    }
    
    clearDungeon() {
        // Remove existing dungeon objects
        if (this.gameEngine.currentDungeon) {
            if (this.gameEngine.currentDungeon.floor) {
                this.scene.remove(this.gameEngine.currentDungeon.floor);
            }
            if (this.gameEngine.currentDungeon.walls) {
                this.scene.remove(this.gameEngine.currentDungeon.walls);
            }
            if (this.gameEngine.currentDungeon.decorations) {
                this.gameEngine.currentDungeon.decorations.forEach(deco => {
                    this.scene.remove(deco);
                });
            }
        }
        
        // Clear enemies
        if (this.gameEngine.enemyManager) {
            const enemies = this.gameEngine.enemyManager.getEnemies();
            enemies.forEach(enemy => {
                if (enemy.mesh) {
                    this.scene.remove(enemy.mesh);
                }
            });
            this.gameEngine.enemyManager.enemies = [];
        }
    }
    
    createGround() {
        // Create a larger, more elaborate ground
        const groundGeometry = new THREE.CircleGeometry(30, 64);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x3a5f3a,
            roughness: 0.8,
            metalness: 0.2
        });
        
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        
        this.scene.add(ground);
        this.safeZoneObjects.push(ground);
        
        // Add stone path
        const pathGeometry = new THREE.PlaneGeometry(4, 40);
        const pathMaterial = new THREE.MeshStandardMaterial({
            color: 0x8a8a8a,
            roughness: 0.9
        });
        
        const path = new THREE.Mesh(pathGeometry, pathMaterial);
        path.rotation.x = -Math.PI / 2;
        path.position.y = 0.01;
        path.receiveShadow = true;
        
        this.scene.add(path);
        this.safeZoneObjects.push(path);
    }
    
    createBuildings() {
        // Central fountain/monument
        const monumentGeometry = new THREE.CylinderGeometry(2, 3, 4, 8);
        const monumentMaterial = new THREE.MeshStandardMaterial({
            color: 0x9d4edd,
            emissive: 0x5a189a,
            emissiveIntensity: 0.3,
            roughness: 0.4,
            metalness: 0.6
        });
        
        const monument = new THREE.Mesh(monumentGeometry, monumentMaterial);
        monument.position.set(0, 2, 0);
        monument.castShadow = true;
        
        this.scene.add(monument);
        this.safeZoneObjects.push(monument);
        
        // Shop buildings around the perimeter
        const buildings = [
            { pos: [10, 0, 0], color: 0x8b4513, name: 'Blacksmith' },
            { pos: [-10, 0, 0], color: 0x4169e1, name: 'Magic Shop' },
            { pos: [0, 0, 10], color: 0x2e8b57, name: 'Inn' },
            { pos: [0, 0, -10], color: 0xdaa520, name: 'Market' }
        ];
        
        buildings.forEach(building => {
            const buildingGroup = new THREE.Group();
            
            // Building base
            const baseGeometry = new THREE.BoxGeometry(6, 5, 6);
            const baseMaterial = new THREE.MeshStandardMaterial({
                color: building.color,
                roughness: 0.8
            });
            
            const base = new THREE.Mesh(baseGeometry, baseMaterial);
            base.position.y = 2.5;
            base.castShadow = true;
            
            // Roof
            const roofGeometry = new THREE.ConeGeometry(4.5, 2, 4);
            const roofMaterial = new THREE.MeshStandardMaterial({
                color: 0x8b0000,
                roughness: 0.9
            });
            
            const roof = new THREE.Mesh(roofGeometry, roofMaterial);
            roof.position.y = 6;
            roof.rotation.y = Math.PI / 4;
            roof.castShadow = true;
            
            buildingGroup.add(base);
            buildingGroup.add(roof);
            buildingGroup.position.set(...building.pos);
            
            this.scene.add(buildingGroup);
            this.safeZoneObjects.push(buildingGroup);
        });
    }
    
    createLighting() {
        // Warm ambient light for safe zone
        const ambientLight = new THREE.AmbientLight(0xffeaa7, 0.6);
        this.scene.add(ambientLight);
        this.safeZoneObjects.push(ambientLight);
        
        // Directional light (sunlight)
        const sunLight = new THREE.DirectionalLight(0xffd700, 0.8);
        sunLight.position.set(20, 30, 10);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        
        this.scene.add(sunLight);
        this.safeZoneObjects.push(sunLight);
        
        // Point lights around buildings
        const lightPositions = [
            [10, 4, 0],
            [-10, 4, 0],
            [0, 4, 10],
            [0, 4, -10]
        ];
        
        lightPositions.forEach(pos => {
            const light = new THREE.PointLight(0xff9900, 0.5, 15);
            light.position.set(...pos);
            this.scene.add(light);
            this.safeZoneObjects.push(light);
        });
    }
    
    createNPCs() {
        // Create simple NPC markers
        const npcPositions = [
            { pos: [10, 1, 0], name: 'Blacksmith', color: 0xff4444 },
            { pos: [-10, 1, 0], name: 'Mage', color: 0x4444ff },
            { pos: [0, 1, 10], name: 'Innkeeper', color: 0x44ff44 },
            { pos: [0, 1, -10], name: 'Merchant', color: 0xffff44 }
        ];
        
        npcPositions.forEach(npc => {
            const npcGeometry = new THREE.CapsuleGeometry(0.5, 1, 8, 16);
            const npcMaterial = new THREE.MeshStandardMaterial({
                color: npc.color,
                emissive: npc.color,
                emissiveIntensity: 0.3
            });
            
            const npcMesh = new THREE.Mesh(npcGeometry, npcMaterial);
            npcMesh.position.set(...npc.pos);
            npcMesh.castShadow = true;
            npcMesh.userData.npcName = npc.name;
            
            this.scene.add(npcMesh);
            this.safeZoneObjects.push(npcMesh);
            this.npcs.push({ mesh: npcMesh, name: npc.name });
        });
    }
    
    createDecorations() {
        // Add some trees/bushes
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const radius = 20 + Math.random() * 5;
            
            const treeGeometry = new THREE.CylinderGeometry(0.3, 0.5, 3, 8);
            const treeMaterial = new THREE.MeshStandardMaterial({ color: 0x654321 });
            const trunk = new THREE.Mesh(treeGeometry, treeMaterial);
            
            const leavesGeometry = new THREE.SphereGeometry(2, 8, 8);
            const leavesMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22 });
            const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
            leaves.position.y = 3;
            
            const tree = new THREE.Group();
            tree.add(trunk);
            tree.add(leaves);
            tree.position.set(
                Math.cos(angle) * radius,
                1.5,
                Math.sin(angle) * radius
            );
            
            this.scene.add(tree);
            this.safeZoneObjects.push(tree);
        }
    }
    
    createPortals() {
        // Create portal to dungeons
        const portalGeometry = new THREE.TorusGeometry(2, 0.4, 16, 32);
        const portalMaterial = new THREE.MeshStandardMaterial({
            color: 0x9d4edd,
            emissive: 0x9d4edd,
            emissiveIntensity: 0.8,
            transparent: true,
            opacity: 0.8
        });
        
        const portal = new THREE.Mesh(portalGeometry, portalMaterial);
        portal.position.set(0, 2, -20);
        portal.rotation.x = Math.PI / 2;
        portal.userData.isPortal = true;
        
        this.scene.add(portal);
        this.safeZoneObjects.push(portal);
        
        // Animate portal
        this.animatePortal(portal);
    }
    
    animatePortal(portal) {
        const animate = () => {
            if (this.isInSafeZone) {
                portal.rotation.z += 0.01;
                requestAnimationFrame(animate);
            }
        };
        animate();
    }
    
    showSafeZoneUI() {
        // Create safe zone info panel
        let infoPanel = document.getElementById('safe-zone-info');
        
        if (!infoPanel) {
            infoPanel = document.createElement('div');
            infoPanel.id = 'safe-zone-info';
            infoPanel.style.cssText = `
                position: absolute;
                top: 100px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(157, 78, 221, 0.9);
                padding: 20px 40px;
                border-radius: 15px;
                color: white;
                font-size: 1.2em;
                text-align: center;
                box-shadow: 0 0 30px rgba(157, 78, 221, 0.8);
                z-index: 100;
                pointer-events: none;
            `;
            document.getElementById('ui-overlay').appendChild(infoPanel);
        }
        
        infoPanel.innerHTML = `
            <h2 style="margin: 0 0 10px 0;">🏰 Welcome to Safe Zone Hub</h2>
            <p style="margin: 5px 0;">You are safe here. No enemies can harm you.</p>
            <p style="margin: 5px 0; font-size: 0.9em;">
                Visit NPCs to trade, upgrade, and prepare for your journey.
            </p>
            <p style="margin: 10px 0; font-size: 0.8em; color: #e0aaff;">
                Move to the portal at the south to enter the dungeons.
            </p>
        `;
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (infoPanel) {
                infoPanel.style.opacity = '0';
                infoPanel.style.transition = 'opacity 1s';
                setTimeout(() => infoPanel.remove(), 1000);
            }
        }, 5000);
    }
    
    leaveSafeZone() {
        logger.info('🚪 Leaving Safe Zone...');
        this.isInSafeZone = false;
        
        // Remove safe zone objects
        this.safeZoneObjects.forEach(obj => {
            this.scene.remove(obj);
        });
        this.safeZoneObjects = [];
        this.npcs = [];
        
        // Generate new dungeon
        if (this.gameEngine.dungeonGenerator && this.gameEngine.enemyManager) {
            this.gameEngine.currentDungeon = this.gameEngine.dungeonGenerator.generate('crystal_cavern', 1);
            this.gameEngine.loadDungeon(this.gameEngine.currentDungeon);
            this.gameEngine.enemyManager.spawnEnemiesForDungeon(this.gameEngine.currentDungeon, 5);
        }
    }
    
    update(deltaTime) {
        if (!this.isInSafeZone) return;
        
        // Check if player is near portal
        if (this.gameEngine.player && this.gameEngine.player.mesh) {
            const playerPos = this.gameEngine.player.mesh.position;
            const portalPos = new THREE.Vector3(0, 2, -20);
            const distance = playerPos.distanceTo(portalPos);
            
            if (distance < 5) {
                this.showPortalPrompt();
            }
        }
        
        // Heal player while in safe zone
        if (this.gameEngine.player && this.gameEngine.player.stats) {
            const healAmount = deltaTime * 5; // 5 HP per second
            this.gameEngine.player.stats.hp = Math.min(
                this.gameEngine.player.stats.maxHp,
                this.gameEngine.player.stats.hp + healAmount
            );
        }
    }
    
    showPortalPrompt() {
        let prompt = document.getElementById('portal-prompt');
        
        if (!prompt) {
            prompt = document.createElement('div');
            prompt.id = 'portal-prompt';
            prompt.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(157, 78, 221, 0.95);
                padding: 30px;
                border-radius: 15px;
                color: white;
                font-size: 1.2em;
                text-align: center;
                box-shadow: 0 0 40px rgba(157, 78, 221, 1);
                z-index: 200;
            `;
            
            prompt.innerHTML = `
                <h3 style="margin: 0 0 15px 0;">🌀 Dungeon Portal</h3>
                <p style="margin: 10px 0;">Press <strong>E</strong> to enter the dungeons</p>
                <p style="font-size: 0.8em; color: #e0aaff; margin: 10px 0;">
                    Warning: Enemies await beyond this point!
                </p>
            `;
            
            document.getElementById('ui-overlay').appendChild(prompt);
            
            // Add key listener
            const enterHandler = (e) => {
                if (e.key === 'e' || e.key === 'E') {
                    this.leaveSafeZone();
                    prompt.remove();
                    document.removeEventListener('keydown', enterHandler);
                }
            };
            document.addEventListener('keydown', enterHandler);
        }
    }
}
