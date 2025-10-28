/**
 * Player - Main player character class
 */

import * as THREE from 'three';

export class Player {
    constructor(scene) {
        this.scene = scene;
        this.mesh = null;
        
        // Player stats
        this.stats = {
            hp: 100,
            maxHp: 100,
            mp: 100,
            maxMp: 100,
            attack: 15,
            defense: 10,
            speed: 5,
            level: 1,
            exp: 0,
            expToNext: 100
        };
        
        // Movement flags
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;
        
        // Combat
        this.lastAttackTime = 0;
        this.attackCooldown = 0.5; // seconds
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
        // Handle movement
        const moveSpeed = this.stats.speed * delta;
        
        if (this.moveForward) {
            this.mesh.position.z -= moveSpeed;
        }
        if (this.moveBackward) {
            this.mesh.position.z += moveSpeed;
        }
        if (this.moveLeft) {
            this.mesh.position.x -= moveSpeed;
        }
        if (this.moveRight) {
            this.mesh.position.x += moveSpeed;
        }
        
        // Regenerate MP slowly
        if (this.stats.mp < this.stats.maxMp) {
            this.stats.mp = Math.min(this.stats.maxMp, this.stats.mp + 5 * delta);
        }
        
        // Animate aura
        if (this.mesh.children[0]) {
            this.mesh.children[0].rotation.y += delta;
            const scale = 1 + Math.sin(Date.now() * 0.002) * 0.1;
            this.mesh.children[0].scale.set(scale, scale, scale);
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
        const actualDamage = Math.max(1, amount - this.stats.defense);
        this.stats.hp = Math.max(0, this.stats.hp - actualDamage);
        
        // Flash red when hit
        const originalColor = this.mesh.material.color.clone();
        this.mesh.material.color.setHex(0xff0000);
        setTimeout(() => {
            this.mesh.material.color.copy(originalColor);
        }, 100);
        
        if (this.stats.hp <= 0) {
            this.die();
        }
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
        
        // Increase stats
        this.stats.maxHp += 20;
        this.stats.maxMp += 15;
        this.stats.hp = this.stats.maxHp;
        this.stats.mp = this.stats.maxMp;
        this.stats.attack += 3;
        this.stats.defense += 2;
        
        console.log(`🌟 Level Up! Now level ${this.stats.level}`);
        
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
