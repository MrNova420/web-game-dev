/**
 * GameEngine - Core game engine using Three.js for 3D rendering
 * Handles scene management, rendering, and game state
 */

import * as THREE from 'three';
import { Player } from '../entities/Player.js';
import { CompanionManager } from '../systems/CompanionManager.js';
import { DungeonGenerator } from '../worlds/DungeonGenerator.js';
import { CombatSystem } from '../systems/CombatSystem.js';
import { ParticleSystem } from '../systems/ParticleSystem.js';
import { EnemyManager } from '../systems/EnemyManager.js';

export class GameEngine {
    constructor(canvas) {
        this.canvas = canvas;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.clock = new THREE.Clock();
        
        // Game systems
        this.player = null;
        this.companionManager = null;
        this.dungeonGenerator = null;
        this.combatSystem = null;
        this.particleSystem = null;
        this.enemyManager = null;
        
        // Game state
        this.isRunning = false;
        this.currentDungeon = null;
        
        // UI references
        this.uiElements = {
            hp: document.getElementById('hp-bar'),
            hpText: document.getElementById('hp-text'),
            mp: document.getElementById('mp-bar'),
            mpText: document.getElementById('mp-text'),
            companionName: document.getElementById('companion-name'),
            companionStatus: document.getElementById('companion-status')
        };
    }
    
    async init() {
        // Create Three.js scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a0033);
        this.scene.fog = new THREE.FogExp2(0x2d0a4e, 0.02);
        
        // Setup camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 10, 15);
        this.camera.lookAt(0, 0, 0);
        
        // Setup renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Add ambient lighting (purple twilight)
        const ambientLight = new THREE.AmbientLight(0x9d4edd, 0.4);
        this.scene.add(ambientLight);
        
        // Add directional light (moon-like)
        const dirLight = new THREE.DirectionalLight(0xc77dff, 0.6);
        dirLight.position.set(10, 20, 10);
        dirLight.castShadow = true;
        dirLight.shadow.camera.near = 0.1;
        dirLight.shadow.camera.far = 100;
        dirLight.shadow.camera.left = -20;
        dirLight.shadow.camera.right = 20;
        dirLight.shadow.camera.top = 20;
        dirLight.shadow.camera.bottom = -20;
        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;
        this.scene.add(dirLight);
        
        // Add atmospheric point lights (smoke magic effect)
        for (let i = 0; i < 5; i++) {
            const light = new THREE.PointLight(0x9d4edd, 0.5, 20);
            light.position.set(
                Math.random() * 20 - 10,
                Math.random() * 5 + 2,
                Math.random() * 20 - 10
            );
            this.scene.add(light);
        }
        
        // Initialize game systems
        this.companionManager = new CompanionManager();
        this.dungeonGenerator = new DungeonGenerator();
        this.combatSystem = new CombatSystem(this);
        this.particleSystem = new ParticleSystem(this.scene);
        this.enemyManager = new EnemyManager(this.scene, this.dungeonGenerator);
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
        
        return true;
    }
    
    async createWorld() {
        // Create player
        this.player = new Player(this.scene);
        await this.player.init();
        
        // Set initial companion
        this.companionManager.setActiveCompanion('smoke_siren');
        this.updateCompanionUI();
        
        // Generate starting dungeon
        this.currentDungeon = this.dungeonGenerator.generate('crystal_cavern', 1);
        this.loadDungeon(this.currentDungeon);
        
        // Spawn initial enemies using EnemyManager
        this.enemyManager.spawnEnemiesForDungeon(this.currentDungeon, 5);
    }
    
    loadDungeon(dungeon) {
        // Add dungeon geometry to scene
        this.scene.add(dungeon.floor);
        this.scene.add(dungeon.walls);
        
        // Add dungeon decorations
        if (dungeon.decorations) {
            dungeon.decorations.forEach(deco => this.scene.add(deco));
        }
        
        console.log(`📍 Loaded dungeon: ${dungeon.name} (${dungeon.biome})`);
    }
    
    start() {
        this.isRunning = true;
        console.log('🎮 Game engine started');
    }
    
    update() {
        if (!this.isRunning) return;
        
        const delta = this.clock.getDelta();
        
        // Update player
        if (this.player) {
            this.player.update(delta);
            this.updatePlayerUI();
        }
        
        // Update particle system
        if (this.particleSystem) {
            this.particleSystem.update(delta);
        }
        
        // Update combat system
        if (this.combatSystem) {
            this.combatSystem.update(delta);
        }
        
        // Update enemy manager
        if (this.enemyManager) {
            this.enemyManager.update(delta, this.player);
        }
        
        // Update camera to follow player
        if (this.player && this.player.mesh) {
            const targetPosition = this.player.mesh.position.clone();
            targetPosition.y += 10;
            targetPosition.z += 15;
            this.camera.position.lerp(targetPosition, 0.05);
            this.camera.lookAt(this.player.mesh.position);
        }
    }
    
    render() {
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }
    
    updatePlayerUI() {
        if (!this.player) return;
        
        const hpPercent = (this.player.stats.hp / this.player.stats.maxHp) * 100;
        const mpPercent = (this.player.stats.mp / this.player.stats.maxMp) * 100;
        
        this.uiElements.hp.style.width = `${hpPercent}%`;
        this.uiElements.hpText.textContent = `${this.player.stats.hp}/${this.player.stats.maxHp}`;
        this.uiElements.mp.style.width = `${mpPercent}%`;
        this.uiElements.mpText.textContent = `${this.player.stats.mp}/${this.player.stats.maxMp}`;
    }
    
    updateCompanionUI() {
        const companion = this.companionManager.getActiveCompanion();
        if (companion) {
            this.uiElements.companionName.textContent = companion.name;
            this.uiElements.companionStatus.textContent = companion.isOnCooldown ? 'Cooldown' : 'Ready';
        }
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    // Ability methods
    useAbility(abilityKey) {
        if (!this.player || !this.isRunning) return;
        
        switch(abilityKey) {
            case 'q':
                this.castSmokeBlast();
                break;
            case 'w':
                this.castShadowStep();
                break;
            case 'e':
                this.castEssenceDrain();
                break;
            case 'r':
                this.useCompanionAbility();
                break;
        }
    }
    
    castSmokeBlast() {
        if (this.player.stats.mp < 20) return;
        
        this.player.stats.mp -= 20;
        console.log('💨 Smoke Blast!');
        
        // Create smoke particle effect
        this.particleSystem.createSmokeBurst(this.player.mesh.position);
        
        // Damage nearby enemies
        const enemies = this.enemyManager.getEnemies();
        enemies.forEach(enemy => {
            const distance = enemy.mesh.position.distanceTo(this.player.mesh.position);
            if (distance < 5 && enemy.isAlive) {
                const damage = enemy.takeDamage(25);
                if (!enemy.isAlive) {
                    this.player.gainExp(enemy.stats.exp);
                }
            }
        });
    }
    
    castShadowStep() {
        if (this.player.stats.mp < 30) return;
        
        this.player.stats.mp -= 30;
        console.log('⚡ Shadow Step!');
        
        // Teleport player forward
        const direction = new THREE.Vector3(0, 0, -5);
        this.player.mesh.position.add(direction);
    }
    
    castEssenceDrain() {
        if (this.player.stats.mp < 25) return;
        
        this.player.stats.mp -= 25;
        console.log('💀 Essence Drain!');
        
        // Heal player and damage nearest enemy
        const nearestEnemy = this.findNearestEnemy();
        if (nearestEnemy) {
            nearestEnemy.takeDamage(15);
            this.player.stats.hp = Math.min(this.player.stats.maxHp, this.player.stats.hp + 15);
            if (!nearestEnemy.isAlive) {
                this.player.gainExp(nearestEnemy.stats.exp);
            }
        }
    }
    
    useCompanionAbility() {
        const companion = this.companionManager.getActiveCompanion();
        if (companion && !companion.isOnCooldown) {
            console.log(`💜 ${companion.name} Ability!`);
            companion.useAbility(this);
            this.updateCompanionUI();
        }
    }
    
    findNearestEnemy() {
        let nearest = null;
        let minDistance = Infinity;
        
        const enemies = this.enemyManager.getEnemies();
        enemies.forEach(enemy => {
            if (!enemy.isAlive) return;
            const distance = enemy.mesh.position.distanceTo(this.player.mesh.position);
            if (distance < minDistance) {
                minDistance = distance;
                nearest = enemy;
            }
        });
        
        return nearest;
    }
}
