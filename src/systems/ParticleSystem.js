/**
 * ParticleSystem - Manages visual effects and particles for smoke magic
 */

import * as THREE from 'three';

export class ParticleSystem {
    constructor(scene) {
        this.scene = scene;
        this.particleGroups = [];
    }
    
    createSmokeBurst(position) {
        const particleCount = 50;
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];
        const velocities = [];
        
        for (let i = 0; i < particleCount; i++) {
            // Position
            positions.push(
                position.x + (Math.random() - 0.5) * 2,
                position.y + Math.random() * 2,
                position.z + (Math.random() - 0.5) * 2
            );
            
            // Color (purple smoke)
            const color = new THREE.Color(0x9d4edd);
            colors.push(color.r, color.g, color.b);
            
            // Velocity
            velocities.push(
                (Math.random() - 0.5) * 2,
                Math.random() * 3,
                (Math.random() - 0.5) * 2
            );
        }
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.3,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        const particles = new THREE.Points(geometry, material);
        this.scene.add(particles);
        
        // Store particle data
        this.particleGroups.push({
            mesh: particles,
            velocities: velocities,
            life: 1.0,
            maxLife: 1.0
        });
    }
    
    createHealEffect(position) {
        const particleCount = 30;
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];
        
        for (let i = 0; i < particleCount; i++) {
            positions.push(
                position.x + (Math.random() - 0.5),
                position.y + Math.random() * 3,
                position.z + (Math.random() - 0.5)
            );
            
            // Green healing color
            const color = new THREE.Color(0x52b788);
            colors.push(color.r, color.g, color.b);
        }
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.2,
            vertexColors: true,
            transparent: true,
            opacity: 1.0
        });
        
        const particles = new THREE.Points(geometry, material);
        this.scene.add(particles);
        
        this.particleGroups.push({
            mesh: particles,
            velocities: new Array(particleCount * 3).fill(0).map(() => (Math.random() - 0.5) * 0.5),
            life: 0.8,
            maxLife: 0.8
        });
    }
    
    update(delta) {
        // Update all active particle groups
        for (let i = this.particleGroups.length - 1; i >= 0; i--) {
            const group = this.particleGroups[i];
            
            // Update life
            group.life -= delta;
            
            if (group.life <= 0) {
                // Remove dead particles
                this.scene.remove(group.mesh);
                group.mesh.geometry.dispose();
                group.mesh.material.dispose();
                this.particleGroups.splice(i, 1);
                continue;
            }
            
            // Update positions
            const positions = group.mesh.geometry.attributes.position.array;
            for (let j = 0; j < positions.length; j += 3) {
                positions[j] += group.velocities[j] * delta;
                positions[j + 1] += group.velocities[j + 1] * delta;
                positions[j + 2] += group.velocities[j + 2] * delta;
                
                // Apply gravity
                group.velocities[j + 1] -= 2 * delta;
            }
            group.mesh.geometry.attributes.position.needsUpdate = true;
            
            // Fade out
            const fadeProgress = group.life / group.maxLife;
            group.mesh.material.opacity = fadeProgress;
        }
    }
}
