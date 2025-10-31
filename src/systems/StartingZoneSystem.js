/**
import { logger } from '../core/Logger.js';
 * StartingZoneSystem - Tutorial and starting area for new players
 * Guides players through game mechanics before first dungeon
 */

import * as THREE from 'three';

export class StartingZoneSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.scene = gameEngine.scene;
        
        this.tutorialSteps = [];
        this.currentStep = 0;
        this.tutorialComplete = false;
        
        this.startingPosition = new THREE.Vector3(0, 0, 0);
        
        this.init();
    }
    
    init() {
        this.createStartingZone();
        this.setupTutorialSteps();
        this.createTutorialUI();
        
        logger.info('🎓 Starting Zone System initialized');
    }
    
    createStartingZone() {
        // Create safe starting platform
        const platformGeometry = new THREE.CylinderGeometry(20, 20, 1, 32);
        const platformMaterial = new THREE.MeshStandardMaterial({
            color: 0x4CAF50,
            roughness: 0.7,
            metalness: 0.2
        });
        
        const platform = new THREE.Mesh(platformGeometry, platformMaterial);
        platform.position.copy(this.startingPosition);
        platform.position.y = -0.5;
        platform.receiveShadow = true;
        this.scene.add(platform);
        
        // Add welcome sign
        this.createWelcomeSign();
        
        // Add practice dummies
        this.createPracticeDummies();
        
        // Add tutorial NPCs
        this.createTutorialNPCs();
        
        logger.info('🏛️ Starting zone created');
    }
    
    createWelcomeSign() {
        // Create sign post
        const postGeometry = new THREE.BoxGeometry(0.5, 3, 0.5);
        const postMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
        const post = new THREE.Mesh(postGeometry, postMaterial);
        post.position.set(0, 1.5, -8);
        this.scene.add(post);
        
        // Create sign board
        const boardGeometry = new THREE.BoxGeometry(4, 2, 0.2);
        const boardMaterial = new THREE.MeshStandardMaterial({ color: 0xD2691E });
        const board = new THREE.Mesh(boardGeometry, boardMaterial);
        board.position.set(0, 3.5, -8);
        this.scene.add(board);
        
        // Add text sprite
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Welcome!', 256, 80);
        ctx.font = '32px Arial';
        ctx.fillText('Dynasty of Emberveil', 256, 140);
        ctx.font = '24px Arial';
        ctx.fillText('Start Your Adventure', 256, 200);
        
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(4, 2, 1);
        sprite.position.set(0, 3.5, -7.8);
        this.scene.add(sprite);
    }
    
    createPracticeDummies() {
        // Create 3 practice dummies around the zone
        for (let i = 0; i < 3; i++) {
            const angle = (i / 3) * Math.PI * 2;
            const radius = 10;
            
            const position = new THREE.Vector3(
                Math.cos(angle) * radius,
                0,
                Math.sin(angle) * radius
            );
            
            this.createDummy(position);
        }
    }
    
    createDummy(position) {
        // Body
        const bodyGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 8);
        const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xCD853F });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.copy(position);
        body.position.y = 1;
        body.castShadow = true;
        this.scene.add(body);
        
        // Head
        const headGeometry = new THREE.SphereGeometry(0.4, 8, 8);
        const headMaterial = new THREE.MeshStandardMaterial({ color: 0xD2691E });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.copy(position);
        head.position.y = 2.5;
        head.castShadow = true;
        this.scene.add(head);
        
        // Label
        const labelCanvas = document.createElement('canvas');
        labelCanvas.width = 128;
        labelCanvas.height = 64;
        const ctx = labelCanvas.getContext('2d');
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('DUMMY', 64, 40);
        
        const texture = new THREE.CanvasTexture(labelCanvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(2, 1, 1);
        sprite.position.copy(position);
        sprite.position.y = 3.5;
        this.scene.add(sprite);
    }
    
    createTutorialNPCs() {
        if (!this.gameEngine.npcSystem) return;
        
        // Create guide NPC
        const guidePosition = new THREE.Vector3(-5, 0, -5);
        this.gameEngine.npcSystem.createNPC('sage', guidePosition, 'Tutorial Guide');
        
        // Create merchant NPC
        const merchantPosition = new THREE.Vector3(5, 0, -5);
        this.gameEngine.npcSystem.createNPC('merchant', merchantPosition, 'Starter Merchant');
    }
    
    setupTutorialSteps() {
        this.tutorialSteps = [
            {
                title: 'Welcome to Dynasty of Emberveil!',
                description: 'Use WASD or Arrow Keys to move around',
                objective: 'move',
                completed: false
            },
            {
                title: 'Camera Control',
                description: 'Use your mouse to look around',
                objective: 'camera',
                completed: false
            },
            {
                title: 'Combat Training',
                description: 'Click on a practice dummy to attack',
                objective: 'attack',
                completed: false
            },
            {
                title: 'Talk to NPCs',
                description: 'Approach the Tutorial Guide and press E to interact',
                objective: 'talk',
                completed: false
            },
            {
                title: 'Check Your Inventory',
                description: 'Press I to open your inventory',
                objective: 'inventory',
                completed: false
            },
            {
                title: 'Choose Your Class',
                description: 'Select a character class to begin your journey',
                objective: 'class',
                completed: false
            },
            {
                title: 'Ready for Adventure!',
                description: 'You can now leave the starting zone and explore the world',
                objective: 'complete',
                completed: false
            }
        ];
    }
    
    createTutorialUI() {
        const container = document.createElement('div');
        container.id = 'tutorial-ui';
        container.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.9);
            border: 3px solid #4CAF50;
            border-radius: 15px;
            padding: 20px;
            max-width: 500px;
            color: white;
            font-family: Arial, sans-serif;
            z-index: 1000;
            display: none;
        `;
        
        container.innerHTML = `
            <h2 id="tutorial-title" style="margin: 0 0 10px 0; color: #4CAF50;">Tutorial</h2>
            <p id="tutorial-description" style="margin: 0 0 15px 0; color: #ccc;"></p>
            <div style="background: rgba(255,255,255,0.1); height: 20px; border-radius: 10px; overflow: hidden;">
                <div id="tutorial-progress" style="background: #4CAF50; height: 100%; width: 0%; transition: width 0.3s;"></div>
            </div>
            <p id="tutorial-step-counter" style="margin: 10px 0 0 0; color: #888; text-align: center;"></p>
        `;
        
        document.body.appendChild(container);
        this.tutorialUI = container;
        
        // Show first step
        this.showTutorialStep(0);
    }
    
    showTutorialStep(stepIndex) {
        if (stepIndex >= this.tutorialSteps.length) {
            this.completeTutorial();
            return;
        }
        
        this.currentStep = stepIndex;
        const step = this.tutorialSteps[stepIndex];
        
        if (!this.tutorialUI) return;
        
        this.tutorialUI.style.display = 'block';
        
        document.getElementById('tutorial-title').textContent = step.title;
        document.getElementById('tutorial-description').textContent = step.description;
        
        const progress = ((stepIndex) / this.tutorialSteps.length) * 100;
        document.getElementById('tutorial-progress').style.width = `${progress}%`;
        document.getElementById('tutorial-step-counter').textContent = 
            `Step ${stepIndex + 1} of ${this.tutorialSteps.length}`;
    }
    
    completeTutorialStep(objective) {
        const step = this.tutorialSteps[this.currentStep];
        if (step && step.objective === objective && !step.completed) {
            step.completed = true;
            
            // Show completion notification
            if (this.gameEngine.modernUISystem) {
                this.gameEngine.modernUISystem.showNotification(
                    `✅ ${step.title} Complete!`,
                    'success',
                    2000
                );
            }
            
            // Move to next step
            setTimeout(() => {
                this.showTutorialStep(this.currentStep + 1);
            }, 1500);
        }
    }
    
    completeTutorial() {
        this.tutorialComplete = true;
        
        if (this.tutorialUI) {
            this.tutorialUI.style.display = 'none';
        }
        
        if (this.gameEngine.modernUISystem) {
            this.gameEngine.modernUISystem.showNotification(
                '🎉 Tutorial Complete! Your adventure begins now!',
                'achievement',
                5000
            );
        }
        
        logger.info('✅ Tutorial completed');
    }
    
    spawnPlayerInStartingZone() {
        if (this.gameEngine.player && this.gameEngine.player.mesh) {
            this.gameEngine.player.mesh.position.copy(this.startingPosition);
            this.gameEngine.player.mesh.position.y = 1;
            
            logger.info('👤 Player spawned in starting zone');
        }
    }
    
    update(deltaTime) {
        // Check tutorial objectives
        if (!this.tutorialComplete && this.gameEngine.player) {
            // Auto-complete objectives based on player actions
            // This would be connected to actual game events
        }
    }
    
    dispose() {
        if (this.tutorialUI && this.tutorialUI.parentElement) {
            this.tutorialUI.parentElement.removeChild(this.tutorialUI);
        }
        
        logger.info('🎓 Starting Zone System disposed');
    }
}
