/**
 * Player - Main player character class
 */

import * as THREE from 'three';

export class Player {
    constructor(scene) {
        this.scene = scene;
        this.mesh = null;
        
        // Base stats (before skill bonuses)
        this.baseStats = {
            maxHp: 150,  // Increased from 100
            maxMp: 100,
            attack: 20,  // Increased from 15
            defense: 15, // Increased from 10
            speed: 5
        };
        
        // Player stats (with skill bonuses applied)
        this.stats = {
            hp: 150,     // Increased from 100
            maxHp: 150,  // Increased from 100
            mp: 100,
            maxMp: 100,
            attack: 20,  // Increased from 15
            defense: 15, // Increased from 10
            speed: 5,
            level: 1,
            exp: 0,
            expToNext: 100
        };
        
        // Skill effects
        this.skillEffects = {};
        
        // Movement flags
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;
        
        // Combat
        this.lastAttackTime = 0;
        this.attackCooldown = 0.5; // seconds
        
        // Invulnerability frames
        this.isInvulnerable = false;
        this.invulnerabilityDuration = 1.0; // 1 second of invulnerability after taking damage
        this.lastDamageTime = 0;
        
        // Spawn protection
        this.spawnProtection = true;
        this.spawnProtectionDuration = 3.0; // 3 seconds of spawn protection
        this.spawnTime = Date.now() / 1000;
    }
    
    async init() {
        // Create player mesh (stylized character)
        const geometry = new THREE.CapsuleGeometry(0.5, 1.5, 8, 16);
        const material = new THREE.MeshStandardMaterial({
            color: 0x9d4edd,
            emissive: 0x4a0e7a,
            emissiveIntensity: 0.3,
            metalness: 0.3,
            roughness: 0.7
        });
        
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(0, 1, 0);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        
        // Add a glowing aura
        const auraGeometry = new THREE.SphereGeometry(0.8, 16, 16);
        const auraMaterial = new THREE.MeshBasicMaterial({
            color: 0xc77dff,
            transparent: true,
            opacity: 0.2,
            side: THREE.BackSide
        });
        const aura = new THREE.Mesh(auraGeometry, auraMaterial);
        aura.position.y = 0.5;
        this.mesh.add(aura);
        
        this.scene.add(this.mesh);
        
        console.log('👤 Player initialized');
    }
    
    update(delta) {
        const currentTime = Date.now() / 1000;
        
        // Handle spawn protection
        if (this.spawnProtection) {
            if (currentTime - this.spawnTime >= this.spawnProtectionDuration) {
                this.spawnProtection = false;
                console.log('🛡️ Spawn protection ended');
            }
        }
        
        // Handle invulnerability frames
        if (this.isInvulnerable) {
            if (currentTime - this.lastDamageTime >= this.invulnerabilityDuration) {
                this.isInvulnerable = false;
            }
            // Flicker effect during invulnerability
            if (this.mesh) {
                this.mesh.visible = Math.floor(currentTime * 10) % 2 === 0;
            }
        } else if (this.mesh) {
            this.mesh.visible = true;
        }
        
        // Handle movement with animation
        const moveSpeed = this.stats.speed * delta;
        let isMoving = false;
        
        if (this.moveForward) {
            this.mesh.position.z -= moveSpeed;
            isMoving = true;
        }
        if (this.moveBackward) {
            this.mesh.position.z += moveSpeed;
            isMoving = true;
        }
        if (this.moveLeft) {
            this.mesh.position.x -= moveSpeed;
            isMoving = true;
        }
        if (this.moveRight) {
            this.mesh.position.x += moveSpeed;
            isMoving = true;
        }
        
        // Bounce animation when moving
        if (isMoving) {
            const bounceHeight = Math.abs(Math.sin(Date.now() * 0.01)) * 0.15;
            this.mesh.position.y = 1 + bounceHeight;
            
            // Lean in direction of movement
            const targetRotation = this.moveForward ? 0.1 : (this.moveBackward ? -0.1 : 0);
            this.mesh.rotation.x += (targetRotation - this.mesh.rotation.x) * 0.1;
        } else {
            // Return to normal position
            this.mesh.position.y += (1 - this.mesh.position.y) * 0.1;
            this.mesh.rotation.x *= 0.9;
        }
        
        // Regenerate MP slowly
        if (this.stats.mp < this.stats.maxMp) {
            this.stats.mp = Math.min(this.stats.maxMp, this.stats.mp + 5 * delta);
        }
        
        // Animate aura with enhanced pulsing
        if (this.mesh.children[0]) {
            this.mesh.children[0].rotation.y += delta * 1.5;
            const scale = 1 + Math.sin(Date.now() * 0.003) * 0.15;
            this.mesh.children[0].scale.set(scale, scale, scale);
            
            // Pulse opacity
            const opacity = 0.2 + Math.sin(Date.now() * 0.002) * 0.1;
            this.mesh.children[0].material.opacity = opacity;
        }
    }
    
    attack() {
        const currentTime = Date.now() / 1000;
        if (currentTime - this.lastAttackTime < this.attackCooldown) {
            return;
        }
        
        this.lastAttackTime = currentTime;
        console.log('⚔️ Player attacks!');
        
        // TODO: Implement actual attack logic with hit detection
    }
    
    takeDamage(amount) {
        // Check for spawn protection
        if (this.spawnProtection) {
            console.log('🛡️ Spawn protection active - no damage taken');
            return 0;
        }
        
        // Check for invulnerability frames
        if (this.isInvulnerable) {
            return 0;
        }
        
        const actualDamage = Math.max(1, amount - this.stats.defense);
        this.stats.hp = Math.max(0, this.stats.hp - actualDamage);
        
        // Start invulnerability period
        this.isInvulnerable = true;
        this.lastDamageTime = Date.now() / 1000;
        
        // Flash red when hit
        const originalColor = this.mesh.material.color.clone();
        this.mesh.material.color.setHex(0xff0000);
        setTimeout(() => {
            if (this.mesh && this.mesh.material) {
                this.mesh.material.color.copy(originalColor);
            }
        }, 100);
        
        console.log(`💔 Player took ${actualDamage} damage (HP: ${this.stats.hp}/${this.stats.maxHp})`);
        
        if (this.stats.hp <= 0) {
            this.die();
        }
        
        return actualDamage;
    }
    
    heal(amount) {
        this.stats.hp = Math.min(this.stats.maxHp, this.stats.hp + amount);
        console.log(`💚 Healed for ${amount} HP`);
    }
    
    gainExp(amount) {
        this.stats.exp += amount;
        if (this.stats.exp >= this.stats.expToNext) {
            this.levelUp();
        }
    }
    
    levelUp() {
        this.stats.level++;
        this.stats.exp = 0;
        this.stats.expToNext = Math.floor(this.stats.expToNext * 1.5);
        
        // Increase base stats
        this.baseStats.maxHp += 20;
        this.baseStats.maxMp += 15;
        this.baseStats.attack += 3;
        this.baseStats.defense += 2;
        
        // Increase current stats
        this.stats.maxHp += 20;
        this.stats.maxMp += 15;
        this.stats.hp = this.stats.maxHp;
        this.stats.mp = this.stats.maxMp;
        this.stats.attack += 3;
        this.stats.defense += 2;
        
        console.log(`🌟 Level Up! Now level ${this.stats.level}`);
        
        // Play level up sound
        if (window.gameEngine && window.gameEngine.audioSystem) {
            window.gameEngine.audioSystem.playSoundEffect('level_up');
        }
        
        // Create level up particle effect
        if (window.gameEngine && window.gameEngine.particleSystem) {
            window.gameEngine.particleSystem.createLevelUpEffect(this.mesh.position);
        }
        
        // Track achievement
        if (window.gameEngine && window.gameEngine.achievementSystem) {
            window.gameEngine.achievementSystem.onLevelReached(this.stats.level);
        }
        
        // Update skill points
        if (window.gameEngine && window.gameEngine.skillTreeSystem) {
            window.gameEngine.skillTreeSystem.updateSkillPoints();
        }
        
        // Check for cosmetic unlocks
        if (window.gameEngine && window.gameEngine.characterCustomization) {
            window.gameEngine.characterCustomization.checkUnlocks();
        }
        
        // Notify quest system
        if (window.gameEngine && window.gameEngine.questSystem) {
            window.gameEngine.questSystem.onLevelUp(this.stats.level);
        }
        
        // Auto-save on level up
        if (window.gameEngine && window.gameEngine.saveSystem) {
            window.gameEngine.saveSystem.saveGame('Level up');
        }
    }
    
    die() {
        console.log('💀 Player defeated');
        // Trigger endless mode end
        if (window.gameEngine && window.gameEngine.endlessMode) {
            window.gameEngine.endlessMode.endRun(false);
        }
    }
}
