import * as THREE from 'three';
import { ModelLoader } from '../core/ModelLoader.js';

/**
 * Seductive Boss System - Anime-Style Boss Characters with Affection Mechanics
 * Implements romance, relationship progression, and companion conversion
 * Uses real character models from Universal Base Characters and KayKit packs
 */
export class SeductiveBossSystem {
    constructor(scene, modelLoader) {
        this.scene = scene;
        this.modelLoader = modelLoader || new ModelLoader();
        
        // 8 Seductive Boss Characters
        this.bosses = {
            LILITH_NIGHTSHADE: {
                name: 'Lilith Nightshade',
                title: 'Shadow Empress',
                level: 25,
                health: 50000,
                element: 'Shadow',
                color: 0x8b00ff,
                personality: 'Mysterious and alluring',
                affectionRequired: 100,
                specialAbility: 'Shadow Embrace',
                drops: ['Shadow Rose', 'Dark Kiss Token', 'Empress Crown']
            },
            SCARLETT_BLAZE: {
                name: 'Scarlett Blaze',
                title: 'Inferno Queen',
                level: 35,
                health: 75000,
                element: 'Fire',
                color: 0xff1744,
                personality: 'Fiery and passionate',
                affectionRequired: 150,
                specialAbility: 'Burning Passion',
                drops: ['Flame Heart', 'Passion Ruby', 'Queen\'s Embrace']
            },
            AZURE_MOONLIGHT: {
                name: 'Azure Moonlight',
                title: 'Celestial Maiden',
                level: 45,
                health: 100000,
                element: 'Water',
                color: 0x00bcd4,
                personality: 'Elegant and graceful',
                affectionRequired: 200,
                specialAbility: 'Moonlit Serenade',
                drops: ['Moon Pearl', 'Celestial Tear', 'Maiden\'s Blessing']
            },
            EMERALD_WHISPER: {
                name: 'Emerald Whisper',
                title: 'Forest Enchantress',
                level: 50,
                health: 125000,
                element: 'Nature',
                color: 0x00e676,
                personality: 'Gentle and nurturing',
                affectionRequired: 250,
                specialAbility: 'Nature\'s Caress',
                drops: ['Enchanted Bloom', 'Forest Heart', 'Whisper\'s Gift']
            },
            VIOLET_DREAM: {
                name: 'Violet Dream',
                title: 'Illusion Mistress',
                level: 60,
                health: 150000,
                element: 'Psychic',
                color: 0xaa00ff,
                personality: 'Playful and mischievous',
                affectionRequired: 300,
                specialAbility: 'Dreamy Enchantment',
                drops: ['Dream Crystal', 'Illusion Ring', 'Mistress Charm']
            },
            CRYSTAL_SERAPHIM: {
                name: 'Crystal Seraphim',
                title: 'Divine Angel',
                level: 70,
                health: 200000,
                element: 'Holy',
                color: 0xffffff,
                personality: 'Pure and devoted',
                affectionRequired: 400,
                specialAbility: 'Heavenly Grace',
                drops: ['Seraph Feather', 'Divine Love', 'Angel\'s Kiss']
            },
            CRIMSON_ROSE: {
                name: 'Crimson Rose',
                title: 'Vampire Countess',
                level: 75,
                health: 250000,
                element: 'Blood',
                color: 0xc62828,
                personality: 'Seductive and dangerous',
                affectionRequired: 500,
                specialAbility: 'Bloodlust Waltz',
                drops: ['Blood Rose', 'Eternal Love', 'Countess Crown']
            },
            OMEGA_VENUS: {
                name: 'Omega Venus',
                title: 'Goddess of Love',
                level: 80,
                health: 500000,
                element: 'Divine Love',
                color: 0xff69b4,
                personality: 'All-encompassing affection',
                affectionRequired: 1000,
                specialAbility: 'Infinite Devotion',
                drops: ['Goddess Blessing', 'Love Incarnate', 'Venus Heart']
            }
        };
        
        // Boss instances in world
        this.activeBosses = new Map();
        
        // Affection levels for each boss
        this.affectionLevels = new Map();
        
        // Defeated but not yet companions
        this.defeatedBosses = new Set();
        
        // Bosses converted to companions
        this.companionBosses = new Set();
        
        // Relationship events
        this.relationshipEvents = [];
        
        this.initialize();
    }
    
    initialize() {
        // Initialize affection levels for all bosses
        for (const key in this.bosses) {
            this.affectionLevels.set(key, 0);
        }
    }
    
    async spawnBoss(bossKey, position) {
        if (this.activeBosses.has(bossKey)) return null;
        
        const bossData = this.bosses[bossKey];
        if (!bossData) return null;
        
        // Create boss instance
        const boss = {
            key: bossKey,
            ...bossData,
            currentHealth: bossData.health,
            position: position.clone(),
            state: 'idle', // idle, combat, defeated, companion
            currentPhase: 1,
            totalPhases: 3,
            isInvulnerable: false
        };
        
        // Create visual representation using real models
        await this.createBossVisual(boss);
        
        this.activeBosses.set(bossKey, boss);
        return boss;
    }
    
    async createBossVisual(boss) {
        // Load real character model from Universal Base Characters
        const characterModels = [
            '/assets/models/characters/Male.gltf',
            '/assets/models/characters/Female.gltf'
        ];
        
        // Use female model for seductive bosses
        const characterModel = await this.modelLoader.load(characterModels[1]);
        
        const bossGroup = new THREE.Group();
        
        if (characterModel) {
            // Clone and add the character model
            const charMesh = characterModel.clone();
            charMesh.scale.set(2, 2, 2); // Make bosses larger
            
            // Apply boss color tint
            charMesh.traverse((child) => {
                if (child.isMesh && child.material) {
                    child.material.emissive = new THREE.Color(boss.color);
                    child.material.emissiveIntensity = 0.2;
                }
            });
            
            bossGroup.add(charMesh);
        } else {
            // Fallback to simple geometry if model fails
            const bodyGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 16);
            const bodyMaterial = new THREE.MeshStandardMaterial({ 
                color: boss.color,
                emissive: boss.color,
                emissiveIntensity: 0.3
            });
            const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
            
            const headGeometry = new THREE.SphereGeometry(0.4, 16, 16);
            const headMaterial = new THREE.MeshStandardMaterial({ color: 0xffdbac });
            const headMesh = new THREE.Mesh(headGeometry, headMaterial);
            headMesh.position.y = 1.4;
            
            bossGroup.add(bodyMesh);
            bossGroup.add(headMesh);
        }
        
        bossGroup.position.copy(boss.position);
        
        // Add glow effect using actual model or sphere
        const glowGeometry = new THREE.SphereGeometry(1.5, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: boss.color,
            transparent: true,
            opacity: 0.2,
            side: THREE.BackSide
        });
        const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
        bossGroup.add(glowMesh);
        
        this.scene.add(bossGroup);
        boss.mesh = bossGroup;
        boss.glowMesh = glowMesh;
        
        // Create nameplate
        this.createNameplate(boss);
    }
    
    createNameplate(boss) {
        // Simple nameplate using plane geometry
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        
        // Background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, 512, 128);
        
        // Text
        ctx.fillStyle = '#' + boss.color.toString(16).padStart(6, '0');
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(boss.name, 256, 50);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '24px Arial';
        ctx.fillText(boss.title, 256, 85);
        
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(4, 1, 1);
        sprite.position.y = 3;
        
        boss.mesh.add(sprite);
    }
    
    damageBoss(bossKey, damage) {
        const boss = this.activeBosses.get(bossKey);
        if (!boss || boss.state === 'defeated' || boss.isInvulnerable) return false;
        
        boss.currentHealth -= damage;
        
        // Check for phase transition
        const healthPercent = boss.currentHealth / boss.health;
        const phaseThreshold = 1 - (boss.currentPhase / boss.totalPhases);
        
        if (healthPercent <= phaseThreshold && boss.currentPhase < boss.totalPhases) {
            this.triggerPhaseTransition(boss);
        }
        
        // Check for defeat
        if (boss.currentHealth <= 0) {
            this.defeatBoss(boss);
        }
        
        return true;
    }
    
    triggerPhaseTransition(boss) {
        boss.currentPhase++;
        boss.isInvulnerable = true;
        
        // Visual effect
        if (boss.glowMesh) {
            boss.glowMesh.material.opacity = 0.8;
        }
        
        // Emit special ability
        this.useSpecialAbility(boss);
        
        // End invulnerability after 2 seconds
        setTimeout(() => {
            boss.isInvulnerable = false;
            if (boss.glowMesh) {
                boss.glowMesh.material.opacity = 0.2;
            }
        }, 2000);
        
        this.createRelationshipEvent({
            boss: boss.key,
            type: 'phase_transition',
            message: `${boss.name} enters Phase ${boss.currentPhase}!`,
            affectionGain: 5
        });
    }
    
    useSpecialAbility(boss) {
        // Create ability visual effect
        const abilityGeometry = new THREE.TorusGeometry(3, 0.3, 16, 100);
        const abilityMaterial = new THREE.MeshBasicMaterial({
            color: boss.color,
            transparent: true,
            opacity: 0.8
        });
        const abilityMesh = new THREE.Mesh(abilityGeometry, abilityMaterial);
        abilityMesh.position.copy(boss.position);
        abilityMesh.rotation.x = Math.PI / 2;
        this.scene.add(abilityMesh);
        
        // Animate and remove after 2 seconds
        let time = 0;
        const animate = () => {
            time += 0.016;
            if (time < 2) {
                abilityMesh.rotation.z += 0.1;
                abilityMesh.scale.setScalar(1 + time);
                abilityMesh.material.opacity = 0.8 - (time * 0.4);
                requestAnimationFrame(animate);
            } else {
                this.scene.remove(abilityMesh);
            }
        };
        animate();
    }
    
    defeatBoss(boss) {
        boss.state = 'defeated';
        boss.currentHealth = 0;
        this.defeatedBosses.add(boss.key);
        
        // Add affection for defeating
        this.addAffection(boss.key, 20);
        
        this.createRelationshipEvent({
            boss: boss.key,
            type: 'defeated',
            message: `You have defeated ${boss.name}! She looks at you with newfound respect...`,
            affectionGain: 20
        });
        
        // Change visual to show defeat
        if (boss.mesh) {
            boss.mesh.rotation.z = Math.PI / 4; // Tilt
        }
    }
    
    giveGift(bossKey, giftValue) {
        const affectionGain = giftValue * 2;
        this.addAffection(bossKey, affectionGain);
        
        const boss = this.bosses[bossKey];
        this.createRelationshipEvent({
            boss: bossKey,
            type: 'gift',
            message: `${boss.name} accepts your gift with a smile!`,
            affectionGain
        });
    }
    
    addAffection(bossKey, amount) {
        const current = this.affectionLevels.get(bossKey) || 0;
        const newAmount = current + amount;
        this.affectionLevels.set(bossKey, newAmount);
        
        const boss = this.bosses[bossKey];
        
        // Check for companion conversion
        if (newAmount >= boss.affectionRequired && 
            this.defeatedBosses.has(bossKey) && 
            !this.companionBosses.has(bossKey)) {
            this.convertToCompanion(bossKey);
        }
        
        return newAmount;
    }
    
    convertToCompanion(bossKey) {
        this.companionBosses.add(bossKey);
        
        const boss = this.activeBosses.get(bossKey);
        const bossData = this.bosses[bossKey];
        
        if (boss) {
            boss.state = 'companion';
            
            // Change visual to show companion status
            if (boss.mesh && boss.glowMesh) {
                boss.glowMesh.material.color.setHex(0xff69b4); // Pink for companion
                boss.glowMesh.material.opacity = 0.4;
            }
        }
        
        this.createRelationshipEvent({
            boss: bossKey,
            type: 'companion',
            message: `${bossData.name} has joined you as a companion! ❤️`,
            affectionGain: 0
        });
    }
    
    createRelationshipEvent(event) {
        event.timestamp = Date.now();
        this.relationshipEvents.push(event);
        
        // Keep only last 50 events
        if (this.relationshipEvents.length > 50) {
            this.relationshipEvents.shift();
        }
    }
    
    update(deltaTime) {
        // Update active bosses
        for (const [key, boss] of this.activeBosses) {
            if (!boss.mesh) continue;
            
            // Animate glow
            if (boss.glowMesh) {
                boss.glowMesh.rotation.y += deltaTime;
                
                // Pulse effect
                const pulse = Math.sin(Date.now() * 0.002) * 0.1 + 0.9;
                boss.glowMesh.scale.setScalar(pulse);
            }
            
            // Idle animation
            if (boss.state === 'idle' || boss.state === 'companion') {
                boss.mesh.position.y = boss.position.y + Math.sin(Date.now() * 0.001) * 0.1;
            }
        }
    }
    
    getAffectionLevel(bossKey) {
        return this.affectionLevels.get(bossKey) || 0;
    }
    
    getAllBossesStatus() {
        return Object.keys(this.bosses).map(key => ({
            key,
            ...this.bosses[key],
            affection: this.affectionLevels.get(key) || 0,
            defeated: this.defeatedBosses.has(key),
            isCompanion: this.companionBosses.has(key),
            affectionPercent: ((this.affectionLevels.get(key) || 0) / this.bosses[key].affectionRequired) * 100
        }));
    }
    
    getRecentEvents(count = 10) {
        return this.relationshipEvents.slice(-count).reverse();
    }
    
    getCompanions() {
        return Array.from(this.companionBosses).map(key => ({
            key,
            ...this.bosses[key],
            affection: this.affectionLevels.get(key)
        }));
    }
}
