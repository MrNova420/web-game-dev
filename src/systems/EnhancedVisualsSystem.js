/**
 * EnhancedVisualsSystem - Improved visual effects and graphics enhancements
 * Adds post-processing, better particle effects, and visual polish
 */

import * as THREE from 'three';

export class EnhancedVisualsSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.scene = gameEngine.scene;
        this.camera = gameEngine.camera;
        this.renderer = gameEngine.renderer;
        
        this.visualEffects = [];
        this.screenShakeIntensity = 0;
        this.chromaticAberration = 0;
        
        this.init();
    }
    
    init() {
        this.setupEnhancedLighting();
        this.setupFog();
        this.setupGlowEffects();
        
        console.log('✨ Enhanced Visuals System initialized');
    }
    
    setupEnhancedLighting() {
        // Add subtle ambient light variation
        if (this.scene.children) {
            const ambientLights = this.scene.children.filter(
                child => child instanceof THREE.AmbientLight
            );
            
            ambientLights.forEach(light => {
                this.animateAmbientLight(light);
            });
        }
    }
    
    animateAmbientLight(light) {
        const baseIntensity = light.intensity;
        const animate = () => {
            const time = Date.now() * 0.001;
            light.intensity = baseIntensity + Math.sin(time * 0.5) * 0.1;
            requestAnimationFrame(animate);
        };
        animate();
    }
    
    setupFog() {
        // Add atmospheric fog
        this.scene.fog = new THREE.FogExp2(0x1a0033, 0.02);
    }
    
    setupGlowEffects() {
        // This will be used for glowing objects
        this.glowObjects = [];
    }
    
    addGlowToObject(object, color, intensity = 1.0) {
        if (object.material) {
            object.material.emissive = new THREE.Color(color);
            object.material.emissiveIntensity = intensity;
            this.glowObjects.push({
                object,
                baseIntensity: intensity,
                time: 0
            });
        }
    }
    
    createHitEffect(position, color = 0xff0000) {
        // Create impact particle burst
        const particleCount = 20;
        const particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            const geometry = new THREE.SphereGeometry(0.1, 4, 4);
            const material = new THREE.MeshBasicMaterial({
                color,
                transparent: true,
                opacity: 1
            });
            
            const particle = new THREE.Mesh(geometry, material);
            particle.position.copy(position);
            
            // Random velocity
            particle.userData.velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2
            );
            particle.userData.lifetime = 1.0;
            
            this.scene.add(particle);
            particles.push(particle);
        }
        
        this.visualEffects.push({
            type: 'hitEffect',
            particles,
            time: 0,
            duration: 1.0
        });
    }
    
    createLevelUpEffect(position) {
        // Create rising particles for level up
        const particleCount = 50;
        const particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            const geometry = new THREE.SphereGeometry(0.15, 6, 6);
            const material = new THREE.MeshBasicMaterial({
                color: 0xffd700,
                transparent: true,
                opacity: 1
            });
            
            const particle = new THREE.Mesh(geometry, material);
            const angle = (i / particleCount) * Math.PI * 2;
            const radius = 2 + Math.random();
            
            particle.position.set(
                position.x + Math.cos(angle) * radius,
                position.y,
                position.z + Math.sin(angle) * radius
            );
            
            particle.userData.velocity = new THREE.Vector3(0, 2 + Math.random(), 0);
            particle.userData.lifetime = 2.0;
            
            this.scene.add(particle);
            particles.push(particle);
        }
        
        this.visualEffects.push({
            type: 'levelUp',
            particles,
            time: 0,
            duration: 2.0
        });
        
        // Screen flash
        this.flashScreen(0xffd700, 0.3);
    }
    
    createTeleportEffect(startPos, endPos) {
        // Create spiral effect
        const particleCount = 30;
        const particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            const geometry = new THREE.SphereGeometry(0.2, 8, 8);
            const material = new THREE.MeshBasicMaterial({
                color: 0x9d4edd,
                transparent: true,
                opacity: 1
            });
            
            const particle = new THREE.Mesh(geometry, material);
            particle.position.copy(startPos);
            
            const progress = i / particleCount;
            particle.userData.startPos = startPos.clone();
            particle.userData.endPos = endPos.clone();
            particle.userData.progress = progress;
            particle.userData.lifetime = 1.0;
            
            this.scene.add(particle);
            particles.push(particle);
        }
        
        this.visualEffects.push({
            type: 'teleport',
            particles,
            time: 0,
            duration: 1.0
        });
    }
    
    flashScreen(color, duration = 0.2) {
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: ${new THREE.Color(color).getStyle()};
            opacity: 0.5;
            pointer-events: none;
            z-index: 1500;
        `;
        
        document.getElementById('ui-overlay').appendChild(flash);
        
        setTimeout(() => {
            flash.style.transition = `opacity ${duration}s`;
            flash.style.opacity = '0';
            setTimeout(() => flash.remove(), duration * 1000);
        }, 50);
    }
    
    screenShake(intensity = 1.0, duration = 0.3) {
        this.screenShakeIntensity = intensity;
        
        setTimeout(() => {
            this.screenShakeIntensity = 0;
        }, duration * 1000);
    }
    
    applyScreenShake() {
        if (this.screenShakeIntensity > 0 && this.camera) {
            const offsetX = (Math.random() - 0.5) * this.screenShakeIntensity;
            const offsetY = (Math.random() - 0.5) * this.screenShakeIntensity;
            const offsetZ = (Math.random() - 0.5) * this.screenShakeIntensity;
            
            this.camera.position.x += offsetX;
            this.camera.position.y += offsetY;
            this.camera.position.z += offsetZ;
        }
    }
    
    createTrailEffect(object, color = 0x9d4edd, length = 10) {
        // Create motion trail for fast-moving objects
        const trail = {
            object,
            positions: [],
            color,
            maxLength: length,
            meshes: []
        };
        
        for (let i = 0; i < length; i++) {
            const geometry = new THREE.SphereGeometry(0.3, 8, 8);
            const material = new THREE.MeshBasicMaterial({
                color,
                transparent: true,
                opacity: 1 - (i / length)
            });
            
            const mesh = new THREE.Mesh(geometry, material);
            mesh.visible = false;
            this.scene.add(mesh);
            trail.meshes.push(mesh);
        }
        
        this.visualEffects.push({
            type: 'trail',
            trail
        });
        
        return trail;
    }
    
    update(deltaTime) {
        // Update all visual effects
        for (let i = this.visualEffects.length - 1; i >= 0; i--) {
            const effect = this.visualEffects[i];
            effect.time += deltaTime;
            
            if (effect.type === 'hitEffect' || effect.type === 'levelUp') {
                this.updateParticleEffect(effect, deltaTime);
            } else if (effect.type === 'teleport') {
                this.updateTeleportEffect(effect, deltaTime);
            } else if (effect.type === 'trail') {
                this.updateTrailEffect(effect);
            }
            
            // Remove completed effects
            if (effect.time >= effect.duration && effect.type !== 'trail') {
                effect.particles?.forEach(p => this.scene.remove(p));
                this.visualEffects.splice(i, 1);
            }
        }
        
        // Update glow effects
        this.glowObjects.forEach(glow => {
            glow.time += deltaTime;
            const pulse = Math.sin(glow.time * 3) * 0.3 + 0.7;
            if (glow.object.material) {
                glow.object.material.emissiveIntensity = glow.baseIntensity * pulse;
            }
        });
        
        // Apply screen shake
        this.applyScreenShake();
    }
    
    updateParticleEffect(effect, deltaTime) {
        effect.particles.forEach(particle => {
            // Update position
            particle.position.add(
                particle.userData.velocity.clone().multiplyScalar(deltaTime)
            );
            
            // Apply gravity for hit effects
            if (effect.type === 'hitEffect') {
                particle.userData.velocity.y -= 9.8 * deltaTime;
            }
            
            // Fade out
            const progress = effect.time / effect.duration;
            if (particle.material) {
                particle.material.opacity = 1 - progress;
            }
            
            // Shrink
            const scale = 1 - progress * 0.5;
            particle.scale.set(scale, scale, scale);
        });
    }
    
    updateTeleportEffect(effect, deltaTime) {
        effect.particles.forEach((particle, index) => {
            const progress = (effect.time + particle.userData.progress) / effect.duration;
            
            if (progress <= 1) {
                // Interpolate between start and end
                particle.position.lerpVectors(
                    particle.userData.startPos,
                    particle.userData.endPos,
                    progress
                );
                
                // Add spiral motion
                const angle = progress * Math.PI * 4;
                const radius = 1 - progress;
                particle.position.x += Math.cos(angle) * radius;
                particle.position.z += Math.sin(angle) * radius;
                
                // Fade
                if (particle.material) {
                    particle.material.opacity = 1 - progress;
                }
            }
        });
    }
    
    updateTrailEffect(effect) {
        const trail = effect.trail;
        const objectPos = trail.object.position;
        
        // Add current position
        trail.positions.unshift(objectPos.clone());
        
        // Remove old positions
        if (trail.positions.length > trail.maxLength) {
            trail.positions.pop();
        }
        
        // Update trail meshes
        trail.meshes.forEach((mesh, index) => {
            if (index < trail.positions.length) {
                mesh.position.copy(trail.positions[index]);
                mesh.visible = true;
            } else {
                mesh.visible = false;
            }
        });
    }
    
    cleanup() {
        // Remove all visual effects
        this.visualEffects.forEach(effect => {
            effect.particles?.forEach(p => this.scene.remove(p));
            effect.trail?.meshes.forEach(m => this.scene.remove(m));
        });
        this.visualEffects = [];
        this.glowObjects = [];
    }
}
