/**
import { logger } from '../core/Logger.js';
 * NPCSystem - Non-Player Character management with AI and dialogue
 * Provides interactive NPCs for quests, trading, and world building
 */

import * as THREE from 'three';

export class NPCSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.scene = gameEngine.scene;
        
        this.npcs = [];
        this.npcTypes = {
            merchant: {
                name: 'Merchant',
                icon: '🏪',
                color: 0xffd700,
                dialogues: [
                    'Welcome to my shop!',
                    'I have the finest wares in all the land.',
                    'Come back any time!',
                    'Looking to buy or sell?'
                ],
                interactions: ['trade', 'buy', 'sell']
            },
            questGiver: {
                name: 'Quest Giver',
                icon: '📜',
                color: 0x4488ff,
                dialogues: [
                    'I need your help, adventurer.',
                    'There is trouble in the nearby forest.',
                    'Will you accept this quest?',
                    'Thank you for your service!'
                ],
                interactions: ['quest', 'talk']
            },
            guard: {
                name: 'Guard',
                icon: '🛡️',
                color: 0xff4444,
                dialogues: [
                    'Halt! State your business.',
                    'Move along, citizen.',
                    'Keep the peace.',
                    'No trouble on my watch!'
                ],
                interactions: ['talk', 'directions']
            },
            innkeeper: {
                name: 'Innkeeper',
                icon: '🍺',
                color: 0x8b4513,
                dialogues: [
                    'Welcome to the inn!',
                    'Rest here for the night?',
                    'Rooms are 50 gold per night.',
                    'Safe travels, friend.'
                ],
                interactions: ['rest', 'talk', 'rent']
            },
            blacksmith: {
                name: 'Blacksmith',
                icon: '⚒️',
                color: 0x696969,
                dialogues: [
                    'Need something forged?',
                    'My hammer never rests!',
                    'Quality craftsmanship, guaranteed.',
                    'Come back when you need repairs.'
                ],
                interactions: ['craft', 'repair', 'upgrade']
            },
            healer: {
                name: 'Healer',
                icon: '💚',
                color: 0x52b788,
                dialogues: [
                    'Let me tend to your wounds.',
                    'Health is wealth, traveler.',
                    'You look better already!',
                    'May the spirits watch over you.'
                ],
                interactions: ['heal', 'cure', 'bless']
            },
            sage: {
                name: 'Sage',
                icon: '🔮',
                color: 0x9d4edd,
                dialogues: [
                    'The future is clouded...',
                    'Seek wisdom, not just power.',
                    'The answers you seek lie within.',
                    'Magic flows through all things.'
                ],
                interactions: ['talk', 'train', 'enchant']
            },
            villager: {
                name: 'Villager',
                icon: '👥',
                color: 0xaaaaaa,
                dialogues: [
                    'Hello there!',
                    'Beautiful day, isn\'t it?',
                    'Have you heard the news?',
                    'Safe travels!'
                ],
                interactions: ['talk', 'gossip']
            }
        };
        
        this.init();
    }
    
    init() {
        logger.info('🧑 NPC System initialized');
    }
    
    createNPC(type, position, name = null) {
        const npcType = this.npcTypes[type];
        if (!npcType) {
            logger.error(`NPC type ${type} not found`);
            return null;
        }
        
        // Create NPC mesh
        const geometry = new THREE.CapsuleGeometry(0.5, 1.5, 8, 16);
        const material = new THREE.MeshStandardMaterial({
            color: npcType.color,
            roughness: 0.7,
            metalness: 0.1
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(position);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        // Add icon above NPC
        const iconSprite = this.createIconSprite(npcType.icon);
        iconSprite.position.y = 2.5;
        mesh.add(iconSprite);
        
        this.scene.add(mesh);
        
        const npc = {
            id: this.npcs.length,
            type: type,
            name: name || `${npcType.name} ${this.npcs.length + 1}`,
            mesh: mesh,
            position: position.clone(),
            dialogues: [...npcType.dialogues],
            currentDialogue: 0,
            interactions: [...npcType.interactions],
            isInteracting: false,
            cooldown: 0,
            wanderTarget: null,
            wanderCooldown: 0
        };
        
        this.npcs.push(npc);
        
        logger.info(`Created NPC: ${npc.name} at (${position.x.toFixed(1)}, ${position.z.toFixed(1)})`);
        
        return npc;
    }
    
    createIconSprite(icon) {
        // Create canvas for icon
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        // Draw icon
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(icon, 32, 32);
        
        // Create sprite
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(1, 1, 1);
        
        return sprite;
    }
    
    getNearbyNPCs(position, radius = 5) {
        return this.npcs.filter(npc => {
            return npc.position.distanceTo(position) <= radius;
        }).sort((a, b) => {
            return a.position.distanceTo(position) - b.position.distanceTo(position);
        });
    }
    
    interact(npc) {
        if (npc.isInteracting || npc.cooldown > 0) {
            return null;
        }
        
        npc.isInteracting = true;
        
        // Get current dialogue
        const dialogue = npc.dialogues[npc.currentDialogue];
        npc.currentDialogue = (npc.currentDialogue + 1) % npc.dialogues.length;
        
        // Show dialogue
        if (this.gameEngine.modernUISystem) {
            this.gameEngine.modernUISystem.showNotification(
                `${npc.name}: "${dialogue}"`,
                'info',
                4000
            );
        }
        
        // Set cooldown
        npc.cooldown = 2.0;
        
        setTimeout(() => {
            npc.isInteracting = false;
        }, 2000);
        
        return {
            npc: npc,
            dialogue: dialogue,
            interactions: npc.interactions
        };
    }
    
    updateNPCBehavior(npc, deltaTime) {
        // Update cooldown
        if (npc.cooldown > 0) {
            npc.cooldown -= deltaTime;
        }
        
        // Simple wandering behavior
        npc.wanderCooldown -= deltaTime;
        
        if (npc.wanderCooldown <= 0) {
            // Set new wander target
            npc.wanderTarget = new THREE.Vector3(
                npc.position.x + (Math.random() - 0.5) * 10,
                npc.position.y,
                npc.position.z + (Math.random() - 0.5) * 10
            );
            npc.wanderCooldown = 5 + Math.random() * 5;
        }
        
        // Move towards wander target
        if (npc.wanderTarget) {
            const direction = new THREE.Vector3()
                .subVectors(npc.wanderTarget, npc.mesh.position)
                .normalize();
            
            const distance = npc.mesh.position.distanceTo(npc.wanderTarget);
            
            if (distance > 0.5) {
                npc.mesh.position.add(direction.multiplyScalar(deltaTime * 2));
                
                // Make NPC look in movement direction
                npc.mesh.lookAt(npc.wanderTarget);
            } else {
                npc.wanderTarget = null;
            }
        }
    }
    
    spawnNPCGroup(type, centerPosition, count = 3, radius = 10) {
        const group = [];
        
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const distance = Math.random() * radius;
            
            const position = new THREE.Vector3(
                centerPosition.x + Math.cos(angle) * distance,
                centerPosition.y,
                centerPosition.z + Math.sin(angle) * distance
            );
            
            const npc = this.createNPC(type, position);
            if (npc) {
                group.push(npc);
            }
        }
        
        logger.info(`Spawned ${group.length} NPCs of type ${type}`);
        
        return group;
    }
    
    removeNPC(npc) {
        const index = this.npcs.indexOf(npc);
        if (index !== -1) {
            this.npcs.splice(index, 1);
            
            if (npc.mesh) {
                this.scene.remove(npc.mesh);
                if (npc.mesh.geometry) npc.mesh.geometry.dispose();
                if (npc.mesh.material) npc.mesh.material.dispose();
            }
        }
    }
    
    update(deltaTime) {
        // Update all NPCs
        this.npcs.forEach(npc => {
            this.updateNPCBehavior(npc, deltaTime);
        });
        
        // Check for player interaction
        if (this.gameEngine.player) {
            const nearbyNPCs = this.getNearbyNPCs(
                this.gameEngine.player.mesh.position,
                3
            );
            
            // Show interaction prompt for nearest NPC
            if (nearbyNPCs.length > 0 && !nearbyNPCs[0].isInteracting) {
                // Could show UI prompt here
            }
        }
    }
    
    dispose() {
        this.npcs.forEach(npc => this.removeNPC(npc));
        logger.info('🧑 NPC System disposed');
    }
}
