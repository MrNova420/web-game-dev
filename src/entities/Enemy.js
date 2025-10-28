/**
 * Enemy - Enemy entity class
 * Different enemy types based on Dynasty of Emberveil lore
 */

import * as THREE from 'three';

export class Enemy {
    constructor(scene, type, position) {
        this.scene = scene;
        this.type = type;
        this.mesh = null;
        this.isAlive = true;
        
        // Enemy types and their stats
        this.types = {
            corrupted_angel: {
                name: 'Corrupted Angel',
                color: 0xffffff,
                emissive: 0xff6b9d,
                hp: 80,
                attack: 12,  // Reduced from 20
                defense: 15,
                speed: 3,
                exp: 50
            },
            weed_golem: {
                name: 'Weed-Fueled Golem',
                color: 0x52b788,
                emissive: 0x2d6a4f,
                hp: 120,
                attack: 15,  // Reduced from 25
                defense: 25,
                speed: 2,
                exp: 75
            },
            shadow_bard: {
                name: 'Shadow Bard',
                color: 0x1a0033,
                emissive: 0x9d4edd,
                hp: 60,
                attack: 18,  // Reduced from 30
                defense: 10,
                speed: 5,
                exp: 60
            },
            smoke_imp: {
                name: 'Smoke Imp',
                color: 0x7209b7,
                emissive: 0xc77dff,
                hp: 40,
                attack: 8,   // Reduced from 15
                defense: 8,
                speed: 6,
                exp: 30
            },
            essence_wraith: {
                name: 'Essence Wraith',
                color: 0x4a0e7a,
                emissive: 0xe0aaff,
                hp: 70,
                attack: 13,  // Reduced from 22
                defense: 12,
                speed: 4,
                exp: 55
            }
        };
        
        this.stats = { ...this.types[type] };
        this.maxHp = this.stats.hp;
        
        // Attack cooldown
        this.lastAttackTime = 0;
        this.attackCooldown = 2.0; // Increased from 1.0 seconds - enemies attack less frequently
        
        // Visual effects state
        this.isFlashing = false;
        this.fadeProgress = 1.0;
        
        this.init(position);
    }
    
    init(position) {
        // Create enemy mesh based on type
        const geometry = this.getGeometryForType();
        const material = new THREE.MeshStandardMaterial({
            color: this.stats.color,
            emissive: this.stats.emissive,
            emissiveIntensity: 0.5,
            metalness: 0.3,
            roughness: 0.7
        });
        
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(position);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        
        // Add glow effect
        const glowGeometry = new THREE.SphereGeometry(1.2, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: this.stats.emissive,
            transparent: true,
            opacity: 0.15,
            side: THREE.BackSide
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        this.mesh.add(glow);
        
        // Store enemy data
        this.mesh.userData = {
            type: 'enemy',
            enemyType: this.type,
            hp: this.stats.hp,
            maxHp: this.maxHp,
            attack: this.stats.attack,
            defense: this.stats.defense,
            speed: this.stats.speed,
            exp: this.stats.exp,
            isAlive: true,
            enemy: this
        };
        
        this.scene.add(this.mesh);
    }
    
    getGeometryForType() {
        switch(this.type) {
            case 'corrupted_angel':
                // Winged shape
                return new THREE.ConeGeometry(0.8, 2.5, 6);
            case 'weed_golem':
                // Large blocky shape
                return new THREE.BoxGeometry(1.5, 2.5, 1.5);
            case 'shadow_bard':
                // Slender humanoid
                return new THREE.CylinderGeometry(0.4, 0.5, 2, 8);
            case 'smoke_imp':
                // Small floating sphere
                return new THREE.SphereGeometry(0.6, 12, 12);
            case 'essence_wraith':
                // Wispy octahedron
                return new THREE.OctahedronGeometry(0.8, 0);
            default:
                return new THREE.BoxGeometry(1, 2, 1);
        }
    }
    
    update(delta, player) {
        if (!this.isAlive || !this.mesh) return;
        
        // Handle death fade-out animation
        if (this.fadeProgress < 1.0) {
            this.fadeProgress -= delta * 2;
            if (this.fadeProgress <= 0) {
                this.scene.remove(this.mesh);
                if (this.mesh.geometry) this.mesh.geometry.dispose();
                if (this.mesh.material) this.mesh.material.dispose();
                return;
            }
            this.mesh.material.transparent = true;
            this.mesh.material.opacity = this.fadeProgress;
            return;
        }
        
        // Handle damage flash effect
        if (this.isFlashing) {
            this.isFlashing = false;
            this.mesh.material.color.copy(this.originalColor);
        }
        
        // Simple AI: Move towards player
        if (player && player.mesh) {
            const direction = new THREE.Vector3();
            direction.subVectors(player.mesh.position, this.mesh.position);
            direction.normalize();
            
            // Move towards player
            this.mesh.position.add(direction.multiplyScalar(this.stats.speed * delta));
            
            // Look at player
            this.mesh.lookAt(player.mesh.position);
        }
        
        // Animate glow
        if (this.mesh.children[0]) {
            this.mesh.children[0].rotation.y += delta * 2;
            const scale = 1 + Math.sin(Date.now() * 0.003) * 0.15;
            this.mesh.children[0].scale.set(scale, scale, scale);
        }
    }
    
    takeDamage(amount) {
        if (!this.isAlive) return;
        
        const actualDamage = Math.max(1, amount - this.stats.defense);
        this.stats.hp = Math.max(0, this.stats.hp - actualDamage);
        this.mesh.userData.hp = this.stats.hp;
        
        // Flash red when hit (managed in update loop)
        if (!this.isFlashing) {
            this.isFlashing = true;
            this.originalColor = this.mesh.material.color.clone();
            this.mesh.material.color.setHex(0xff0000);
        }
        
        if (this.stats.hp <= 0) {
            this.die();
        }
        
        return actualDamage;
    }
    
    die() {
        this.isAlive = false;
        this.mesh.userData.isAlive = false;
        
        // Start fade-out animation (handled in update loop)
        this.fadeProgress = 1.0;
        
        // Drop materials if crafting system exists (Phase 4)
        if (this.scene && this.scene.userData && this.scene.userData.gameEngine) {
            const gameEngine = this.scene.userData.gameEngine;
            if (gameEngine.craftingSystem) {
                const drops = gameEngine.craftingSystem.dropMaterialsFromEnemy(this);
                if (drops && drops.length > 0) {
                    console.log(`💎 Materials dropped: ${drops.map(d => `${d.material.name} x${d.amount}`).join(', ')}`);
                }
            }
        }
        
        return this.stats.exp;
    }
    
    attackPlayer(player) {
        if (!this.isAlive || !player || !player.mesh) return;
        
        const currentTime = Date.now() / 1000;
        if (currentTime - this.lastAttackTime < this.attackCooldown) {
            return; // Still on cooldown
        }
        
        const distance = this.mesh.position.distanceTo(player.mesh.position);
        if (distance < 2.5) { // Slightly larger attack range
            player.takeDamage(this.stats.attack);
            this.lastAttackTime = currentTime;
            console.log(`👾 ${this.stats.name} attacks player for ${this.stats.attack} damage!`);
        }
    }
}
