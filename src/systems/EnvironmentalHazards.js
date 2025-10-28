/**
 * EnvironmentalHazards - Interactive environmental dangers and obstacles
 * Provides traps, hazards, and interactive elements for dynamic combat environments
 */

import * as THREE from 'three';

export class EnvironmentalHazards {
    constructor(engine) {
        this.engine = engine;
        this.hazards = [];
        this.hazardTypes = {
            SPIKE_TRAP: 'spike_trap',
            POISON_CLOUD: 'poison_cloud',
            FIRE_ZONE: 'fire_zone',
            LIGHTNING_TRAP: 'lightning_trap',
            ICE_PATCH: 'ice_patch',
            LAVA_POOL: 'lava_pool',
            ARROW_TRAP: 'arrow_trap',
            BLADE_SPINNER: 'blade_spinner'
        };
        
        this.enabled = true;
    }
    
    init() {
        // Hazards will be spawned dynamically
    }
    
    // Spawn a hazard at a specific location
    spawnHazard(type, position, biome = 'forest') {
        const hazard = this.createHazard(type, position, biome);
        if (hazard) {
            this.hazards.push(hazard);
            return hazard;
        }
        return null;
    }
    
    createHazard(type, position, biome) {
        switch (type) {
            case this.hazardTypes.SPIKE_TRAP:
                return this.createSpikeTrap(position);
            case this.hazardTypes.POISON_CLOUD:
                return this.createPoisonCloud(position);
            case this.hazardTypes.FIRE_ZONE:
                return this.createFireZone(position);
            case this.hazardTypes.LIGHTNING_TRAP:
                return this.createLightningTrap(position);
            case this.hazardTypes.ICE_PATCH:
                return this.createIcePatch(position);
            case this.hazardTypes.LAVA_POOL:
                return this.createLavaPool(position);
            case this.hazardTypes.ARROW_TRAP:
                return this.createArrowTrap(position);
            case this.hazardTypes.BLADE_SPINNER:
                return this.createBladeSpinner(position);
            default:
                return null;
        }
    }
    
    createSpikeTrap(position) {
        const geometry = new THREE.CylinderGeometry(1.5, 1.5, 0.2, 8);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0x888888,
            metalness: 0.6,
            roughness: 0.4
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(position);
        mesh.position.y = 0.1;
        
        this.engine.scene.add(mesh);
        
        return {
            type: this.hazardTypes.SPIKE_TRAP,
            mesh: mesh,
            position: position.clone(),
            radius: 1.5,
            damage: 15,
            damageInterval: 0.5, // seconds between damage ticks
            lastDamageTime: 0,
            active: false,
            activationDelay: 1.0,
            timer: 0,
            duration: 2.0, // How long spikes stay up
            cooldown: 3.0,
            state: 'idle' // idle, activating, active, retracting
        };
    }
    
    createPoisonCloud(position) {
        const geometry = new THREE.SphereGeometry(2, 16, 16);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0x00ff00,
            transparent: true,
            opacity: 0.3,
            emissive: 0x00ff00,
            emissiveIntensity: 0.5
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(position);
        mesh.position.y = 1;
        
        this.engine.scene.add(mesh);
        
        return {
            type: this.hazardTypes.POISON_CLOUD,
            mesh: mesh,
            position: position.clone(),
            radius: 2,
            damage: 8,
            damageInterval: 1.0,
            lastDamageTime: 0,
            active: true,
            lifetime: 15, // seconds before dissipating
            timer: 0,
            statusEffect: 'poison'
        };
    }
    
    createFireZone(position) {
        const geometry = new THREE.CircleGeometry(2.5, 32);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0xff4400,
            transparent: true,
            opacity: 0.6,
            emissive: 0xff4400,
            emissiveIntensity: 1.0,
            side: THREE.DoubleSide
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(position);
        mesh.position.y = 0.05;
        mesh.rotation.x = -Math.PI / 2;
        
        this.engine.scene.add(mesh);
        
        return {
            type: this.hazardTypes.FIRE_ZONE,
            mesh: mesh,
            position: position.clone(),
            radius: 2.5,
            damage: 20,
            damageInterval: 0.5,
            lastDamageTime: 0,
            active: true,
            lifetime: 10,
            timer: 0,
            particleTimer: 0
        };
    }
    
    createLightningTrap(position) {
        const geometry = new THREE.CylinderGeometry(0.3, 0.3, 3, 8);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0xffff00,
            emissive: 0xffff00,
            emissiveIntensity: 2.0
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(position);
        mesh.position.y = 1.5;
        
        this.engine.scene.add(mesh);
        
        return {
            type: this.hazardTypes.LIGHTNING_TRAP,
            mesh: mesh,
            position: position.clone(),
            radius: 3,
            damage: 35,
            damageInterval: 2.5,
            lastDamageTime: 0,
            active: false,
            chargeTime: 2.0,
            timer: 0,
            state: 'charging' // charging, zapping, cooldown
        };
    }
    
    createIcePatch(position) {
        const geometry = new THREE.CircleGeometry(3, 32);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0xaaccff,
            transparent: true,
            opacity: 0.7,
            metalness: 0.8,
            roughness: 0.1,
            side: THREE.DoubleSide
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(position);
        mesh.position.y = 0.02;
        mesh.rotation.x = -Math.PI / 2;
        
        this.engine.scene.add(mesh);
        
        return {
            type: this.hazardTypes.ICE_PATCH,
            mesh: mesh,
            position: position.clone(),
            radius: 3,
            damage: 5,
            damageInterval: 1.0,
            lastDamageTime: 0,
            active: true,
            slowEffect: 0.5, // Slows movement by 50%
            lifetime: 20,
            timer: 0
        };
    }
    
    createLavaPool(position) {
        const geometry = new THREE.CircleGeometry(2, 32);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0xff3300,
            emissive: 0xff3300,
            emissiveIntensity: 1.5,
            side: THREE.DoubleSide
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(position);
        mesh.position.y = 0.1;
        mesh.rotation.x = -Math.PI / 2;
        
        this.engine.scene.add(mesh);
        
        return {
            type: this.hazardTypes.LAVA_POOL,
            mesh: mesh,
            position: position.clone(),
            radius: 2,
            damage: 30,
            damageInterval: 0.3,
            lastDamageTime: 0,
            active: true,
            permanent: true // Doesn't expire
        };
    }
    
    createArrowTrap(position) {
        const geometry = new THREE.BoxGeometry(0.5, 2, 0.5);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0x8B4513
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(position);
        mesh.position.y = 1;
        
        this.engine.scene.add(mesh);
        
        return {
            type: this.hazardTypes.ARROW_TRAP,
            mesh: mesh,
            position: position.clone(),
            radius: 1,
            damage: 25,
            active: false,
            fireInterval: 3.0,
            timer: 0,
            projectileSpeed: 15,
            direction: new THREE.Vector3(1, 0, 0) // Direction arrows fly
        };
    }
    
    createBladeSpinner(position) {
        const geometry = new THREE.BoxGeometry(3, 0.2, 0.5);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0xcccccc,
            metalness: 1.0,
            roughness: 0.2
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(position);
        mesh.position.y = 1;
        
        this.engine.scene.add(mesh);
        
        return {
            type: this.hazardTypes.BLADE_SPINNER,
            mesh: mesh,
            position: position.clone(),
            radius: 2,
            damage: 40,
            damageInterval: 0.5,
            lastDamageTime: 0,
            active: true,
            rotationSpeed: 3, // radians per second
            permanent: true
        };
    }
    
    update(delta) {
        if (!this.enabled) return;
        
        const currentTime = Date.now() / 1000;
        
        // Update each hazard
        for (let i = this.hazards.length - 1; i >= 0; i--) {
            const hazard = this.hazards[i];
            
            // Update hazard state
            this.updateHazardState(hazard, delta, currentTime);
            
            // Check player collision
            this.checkPlayerCollision(hazard, currentTime);
            
            // Check enemy collisions
            this.checkEnemyCollisions(hazard, currentTime);
            
            // Remove expired hazards
            if (this.shouldRemoveHazard(hazard)) {
                this.removeHazard(i);
            }
        }
    }
    
    updateHazardState(hazard, delta, currentTime) {
        hazard.timer += delta;
        
        switch (hazard.type) {
            case this.hazardTypes.SPIKE_TRAP:
                this.updateSpikeTrap(hazard, delta);
                break;
            case this.hazardTypes.POISON_CLOUD:
                this.updatePoisonCloud(hazard, delta);
                break;
            case this.hazardTypes.FIRE_ZONE:
                this.updateFireZone(hazard, delta);
                break;
            case this.hazardTypes.LIGHTNING_TRAP:
                this.updateLightningTrap(hazard, delta);
                break;
            case this.hazardTypes.ARROW_TRAP:
                this.updateArrowTrap(hazard, delta);
                break;
            case this.hazardTypes.BLADE_SPINNER:
                this.updateBladeSpinner(hazard, delta);
                break;
        }
    }
    
    updateSpikeTrap(hazard, delta) {
        const player = this.engine.player;
        if (!player || !player.mesh) return;
        
        const distance = hazard.position.distanceTo(player.mesh.position);
        
        if (distance < hazard.radius + 2 && hazard.state === 'idle') {
            hazard.state = 'activating';
            hazard.timer = 0;
        }
        
        if (hazard.state === 'activating') {
            if (hazard.timer > hazard.activationDelay) {
                hazard.state = 'active';
                hazard.active = true;
                hazard.timer = 0;
                // Raise spikes
                hazard.mesh.position.y = 0.5;
            }
        } else if (hazard.state === 'active') {
            if (hazard.timer > hazard.duration) {
                hazard.state = 'retracting';
                hazard.active = false;
                hazard.timer = 0;
                // Lower spikes
                hazard.mesh.position.y = 0.1;
            }
        } else if (hazard.state === 'retracting') {
            if (hazard.timer > hazard.cooldown) {
                hazard.state = 'idle';
                hazard.timer = 0;
            }
        }
    }
    
    updatePoisonCloud(hazard, delta) {
        // Pulsing animation
        const scale = 1 + Math.sin(hazard.timer * 2) * 0.1;
        hazard.mesh.scale.set(scale, scale, scale);
    }
    
    updateFireZone(hazard, delta) {
        // Flickering animation
        hazard.particleTimer += delta;
        if (hazard.particleTimer > 0.1) {
            hazard.particleTimer = 0;
            // Create fire particles
            if (this.engine.particleSystem) {
                const particlePos = hazard.position.clone();
                particlePos.x += (Math.random() - 0.5) * hazard.radius * 2;
                particlePos.z += (Math.random() - 0.5) * hazard.radius * 2;
                this.engine.particleSystem.createFireParticle(particlePos);
            }
        }
        
        hazard.mesh.material.emissiveIntensity = 0.8 + Math.sin(hazard.timer * 10) * 0.3;
    }
    
    updateLightningTrap(hazard, delta) {
        if (hazard.state === 'charging') {
            // Increase glow
            hazard.mesh.material.emissiveIntensity = 2 + Math.sin(hazard.timer * 15) * 1;
            
            if (hazard.timer > hazard.chargeTime) {
                hazard.state = 'zapping';
                hazard.active = true;
                hazard.timer = 0;
                
                // Visual lightning effect
                hazard.mesh.scale.set(1, 3, 1);
            }
        } else if (hazard.state === 'zapping') {
            if (hazard.timer > 0.2) {
                hazard.state = 'cooldown';
                hazard.active = false;
                hazard.timer = 0;
                hazard.mesh.scale.set(1, 1, 1);
            }
        } else if (hazard.state === 'cooldown') {
            if (hazard.timer > 2.0) {
                hazard.state = 'charging';
                hazard.timer = 0;
            }
        }
    }
    
    updateArrowTrap(hazard, delta) {
        if (hazard.timer > hazard.fireInterval) {
            hazard.timer = 0;
            this.fireArrow(hazard);
        }
    }
    
    updateBladeSpinner(hazard, delta) {
        // Rotate blade
        hazard.mesh.rotation.y += hazard.rotationSpeed * delta;
    }
    
    fireArrow(hazard) {
        // Create projectile
        const player = this.engine.player;
        if (!player || !player.mesh) return;
        
        // Aim at player
        const direction = new THREE.Vector3();
        direction.subVectors(player.mesh.position, hazard.position).normalize();
        
        // Create arrow visual (simplified)
        if (this.engine.audioSystem) {
            this.engine.audioSystem.playSoundEffect('projectile');
        }
        
        // Damage player if in line of sight
        const distance = hazard.position.distanceTo(player.mesh.position);
        if (distance < 15) {
            setTimeout(() => {
                if (player.takeDamage) {
                    player.takeDamage(hazard.damage);
                }
            }, 200); // Arrow travel time
        }
    }
    
    checkPlayerCollision(hazard, currentTime) {
        if (!hazard.active) return;
        
        const player = this.engine.player;
        if (!player || !player.mesh) return;
        
        const distance = hazard.position.distanceTo(player.mesh.position);
        
        if (distance < hazard.radius) {
            // Player is in hazard area
            if (currentTime - hazard.lastDamageTime > hazard.damageInterval) {
                hazard.lastDamageTime = currentTime;
                
                // Deal damage
                if (player.takeDamage) {
                    player.takeDamage(hazard.damage);
                }
                
                // Apply status effects
                if (hazard.statusEffect) {
                    this.applyStatusEffect(player, hazard.statusEffect);
                }
                
                // Play sound
                if (this.engine.audioSystem) {
                    this.engine.audioSystem.playSoundEffect('hit');
                }
            }
        }
    }
    
    checkEnemyCollisions(hazard, currentTime) {
        if (!hazard.active) return;
        if (!this.engine.enemies) return;
        
        for (const enemy of this.engine.enemies) {
            if (!enemy.mesh || enemy.isDead) continue;
            
            const distance = hazard.position.distanceTo(enemy.mesh.position);
            
            if (distance < hazard.radius) {
                if (currentTime - hazard.lastDamageTime > hazard.damageInterval) {
                    // Deal damage to enemy
                    if (enemy.takeDamage) {
                        enemy.takeDamage(hazard.damage * 0.5); // Half damage to enemies
                    }
                }
            }
        }
    }
    
    applyStatusEffect(entity, effect) {
        // Status effects can be expanded in the future
        if (effect === 'poison') {
            // Poison effect - could integrate with a status system
        }
    }
    
    shouldRemoveHazard(hazard) {
        if (hazard.permanent) return false;
        if (hazard.lifetime && hazard.timer > hazard.lifetime) return true;
        return false;
    }
    
    removeHazard(index) {
        const hazard = this.hazards[index];
        if (hazard.mesh) {
            this.engine.scene.remove(hazard.mesh);
            hazard.mesh.geometry.dispose();
            hazard.mesh.material.dispose();
        }
        this.hazards.splice(index, 1);
    }
    
    // Spawn hazards randomly in an area
    spawnRandomHazards(center, radius, count, biome = 'forest') {
        const hazardTypesArray = Object.values(this.hazardTypes);
        
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * radius;
            
            const position = new THREE.Vector3(
                center.x + Math.cos(angle) * distance,
                center.y,
                center.z + Math.sin(angle) * distance
            );
            
            const randomType = hazardTypesArray[Math.floor(Math.random() * hazardTypesArray.length)];
            this.spawnHazard(randomType, position, biome);
        }
    }
    
    // Clear all hazards
    clearAll() {
        for (let i = this.hazards.length - 1; i >= 0; i--) {
            this.removeHazard(i);
        }
    }
    
    // Get hazards in area (for AI to avoid)
    getHazardsInArea(position, radius) {
        return this.hazards.filter(hazard => {
            const distance = hazard.position.distanceTo(position);
            return distance < radius + hazard.radius;
        });
    }
}
