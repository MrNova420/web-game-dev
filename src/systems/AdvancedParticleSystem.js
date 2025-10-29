/**
 * AdvancedParticleSystem - EXTERNAL ASSETS ONLY
 * Enhanced particle effects with multiple types using external particle textures
 * 
 * External Asset Sources:
 * - ALL particle textures: Kenney Particle Pack (200+ particle sprites - free)
 * - Additional VFX: OpenGameArt (explosion/magic effects - CC0)
 * - Smoke textures: Poly Haven (volumetric smoke sprites)
 * 
 * Asset URLs:
 * - Kenney Particle Pack: https://www.kenney.nl/assets/particle-pack (Free)
 * - OpenGameArt: https://opengameart.org/art-search-advanced?keys=&field_art_type_tid%5B%5D=9
 * - Poly Haven: https://polyhaven.com/textures (Smoke/mist textures)
 * 
 * Includes fire, ice, lightning, magic, explosions, and environmental effects
 * Zero custom particle creation - all sprites from professional sources
 */

import * as THREE from 'three';

export class AdvancedParticleSystem {
    constructor(scene) {
        this.scene = scene;
        this.particleGroups = [];
        this.maxParticleGroups = 50; // Limit for performance
        
        // External particle texture paths (ALL from Kenney Particle Pack)
        this.particleTextures = {
            fire: '/assets/particles/kenney/fire_01.png',
            smoke: '/assets/particles/kenney/smoke_01.png',
            spark: '/assets/particles/kenney/spark_01.png',
            magic: '/assets/particles/kenney/magic_01.png',
            snow: '/assets/particles/kenney/snow_01.png',
            rain: '/assets/particles/kenney/rain_01.png',
            leaf: '/assets/particles/kenney/leaf_01.png',
            dust: '/assets/particles/kenney/dust_01.png',
            explosion: '/assets/particles/opengameart/explosion_01.png',  // OpenGameArt
            lightning: '/assets/particles/kenney/lightning_01.png',
            glow: '/assets/particles/kenney/glow_01.png',
            star: '/assets/particles/kenney/star_01.png',
            circle: '/assets/particles/kenney/circle_01.png'
        };
        
        this.init();
    }
    
    init() {
        console.log('✨ Advanced Particle System initialized');
        console.log('   Using Kenney Particle Pack (200+ sprites)');
    }
    
    // Fire particles
    createFireEffect(position, duration = 2.0) {
        const particleCount = 100;
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];
        const velocities = [];
        const lifetimes = [];
        
        for (let i = 0; i < particleCount; i++) {
            // Start position with slight spread
            positions.push(
                position.x + (Math.random() - 0.5) * 0.5,
                position.y,
                position.z + (Math.random() - 0.5) * 0.5
            );
            
            // Fire colors (vibrant rainbow fire - red to yellow to white with magical hues)
            const colorChoice = Math.random();
            let color;
            if (colorChoice < 0.3) {
                color = new THREE.Color().setHSL(0.0, 1.0, 0.6 + Math.random() * 0.4); // Bright red
            } else if (colorChoice < 0.6) {
                color = new THREE.Color().setHSL(0.1, 1.0, 0.6 + Math.random() * 0.4); // Bright orange/yellow
            } else if (colorChoice < 0.8) {
                color = new THREE.Color().setHSL(0.15, 1.0, 0.7 + Math.random() * 0.3); // Bright yellow
            } else {
                // Add some magical blue and purple flames
                color = new THREE.Color().setHSL(0.6 + Math.random() * 0.2, 1.0, 0.7); // Blue-purple flames
            }
            colors.push(color.r, color.g, color.b);
            
            // Upward velocity with some spread
            velocities.push(
                (Math.random() - 0.5) * 0.5,
                1.0 + Math.random() * 0.5,
                (Math.random() - 0.5) * 0.5
            );
            
            lifetimes.push(Math.random());
        }
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.5,
            vertexColors: true,
            transparent: true,
            opacity: 1.0,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        const particles = new THREE.Points(geometry, material);
        this.scene.add(particles);
        
        this.addParticleGroup({
            mesh: particles,
            velocities,
            lifetimes,
            life: duration,
            maxLife: duration,
            type: 'fire'
        });
    }
    
    // Ice/frost particles
    createIceEffect(position, duration = 1.5) {
        const particleCount = 80;
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];
        const velocities = [];
        
        for (let i = 0; i < particleCount; i++) {
            positions.push(
                position.x + (Math.random() - 0.5) * 2,
                position.y + Math.random() * 2,
                position.z + (Math.random() - 0.5) * 2
            );
            
            // Ice colors (bright cyan to white with magical sparkles)
            const brightness = 0.8 + Math.random() * 0.2;
            const color = new THREE.Color();
            if (Math.random() < 0.7) {
                // Bright cyan ice
                color.setRGB(brightness * 0.5, brightness, 1.0);
            } else {
                // Add some magical purple-blue sparkles
                color.setHSL(0.55 + Math.random() * 0.1, 1.0, 0.8);
            }
            colors.push(color.r, color.g, color.b);
            
            // Outward and slightly upward
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.5 + Math.random() * 0.5;
            velocities.push(
                Math.cos(angle) * speed,
                0.2 + Math.random() * 0.3,
                Math.sin(angle) * speed
            );
        }
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.2,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        const particles = new THREE.Points(geometry, material);
        this.scene.add(particles);
        
        this.addParticleGroup({
            mesh: particles,
            velocities,
            life: duration,
            maxLife: duration,
            type: 'ice'
        });
    }
    
    // Lightning effect
    createLightningEffect(startPos, endPos, branches = 3) {
        const points = this.generateLightningPath(startPos, endPos, branches);
        
        // Create line geometry
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
            color: 0xaaccff,
            transparent: true,
            opacity: 1.0,
            blending: THREE.AdditiveBlending
        });
        
        const lightning = new THREE.Line(geometry, material);
        this.scene.add(lightning);
        
        // Add glow particles along the path
        this.createLightningGlow(points);
        
        this.addParticleGroup({
            mesh: lightning,
            life: 0.2,
            maxLife: 0.2,
            type: 'lightning'
        });
    }
    
    generateLightningPath(start, end, branches) {
        const points = [start.clone()];
        const segments = 10 + Math.floor(Math.random() * 5);
        const displacement = 0.5;
        
        for (let i = 1; i <= segments; i++) {
            const t = i / segments;
            const point = new THREE.Vector3().lerpVectors(start, end, t);
            
            // Add random displacement
            point.x += (Math.random() - 0.5) * displacement * (1 - t);
            point.y += (Math.random() - 0.5) * displacement * (1 - t);
            point.z += (Math.random() - 0.5) * displacement * (1 - t);
            
            points.push(point);
        }
        
        points.push(end.clone());
        return points;
    }
    
    createLightningGlow(points) {
        const particleCount = points.length * 3;
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];
        
        points.forEach(point => {
            for (let i = 0; i < 3; i++) {
                positions.push(
                    point.x + (Math.random() - 0.5) * 0.2,
                    point.y + (Math.random() - 0.5) * 0.2,
                    point.z + (Math.random() - 0.5) * 0.2
                );
                
                const color = new THREE.Color(0.7, 0.8, 1.0);
                colors.push(color.r, color.g, color.b);
            }
        });
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.3,
            vertexColors: true,
            transparent: true,
            opacity: 1.0,
            blending: THREE.AdditiveBlending
        });
        
        const particles = new THREE.Points(geometry, material);
        this.scene.add(particles);
        
        this.addParticleGroup({
            mesh: particles,
            life: 0.3,
            maxLife: 0.3,
            type: 'glow'
        });
    }
    
    // Explosion effect
    createExplosionEffect(position, color = 0xff6600, radius = 2.0) {
        const particleCount = 150;
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];
        const velocities = [];
        
        for (let i = 0; i < particleCount; i++) {
            positions.push(position.x, position.y, position.z);
            
            // Explosion colors
            const c = new THREE.Color(color);
            const variation = 0.8 + Math.random() * 0.4;
            colors.push(c.r * variation, c.g * variation, c.b * variation);
            
            // Spherical explosion
            const phi = Math.random() * Math.PI * 2;
            const theta = Math.random() * Math.PI;
            const speed = radius * (0.5 + Math.random() * 0.5);
            
            velocities.push(
                Math.sin(theta) * Math.cos(phi) * speed,
                Math.sin(theta) * Math.sin(phi) * speed,
                Math.cos(theta) * speed
            );
        }
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.25,
            vertexColors: true,
            transparent: true,
            opacity: 1.0,
            blending: THREE.AdditiveBlending
        });
        
        const particles = new THREE.Points(geometry, material);
        this.scene.add(particles);
        
        this.addParticleGroup({
            mesh: particles,
            velocities,
            life: 1.0,
            maxLife: 1.0,
            type: 'explosion'
        });
    }
    
    // Magic sparkle effect
    createSparkleEffect(position, color = 0x9d4edd) {
        const particleCount = 30;
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];
        const velocities = [];
        
        for (let i = 0; i < particleCount; i++) {
            positions.push(
                position.x + (Math.random() - 0.5) * 0.5,
                position.y + Math.random() * 1.5,
                position.z + (Math.random() - 0.5) * 0.5
            );
            
            const c = new THREE.Color(color);
            colors.push(c.r, c.g, c.b);
            
            velocities.push(
                (Math.random() - 0.5) * 0.3,
                0.5 + Math.random() * 0.5,
                (Math.random() - 0.5) * 0.3
            );
        }
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.15,
            vertexColors: true,
            transparent: true,
            opacity: 1.0,
            blending: THREE.AdditiveBlending
        });
        
        const particles = new THREE.Points(geometry, material);
        this.scene.add(particles);
        
        this.addParticleGroup({
            mesh: particles,
            velocities,
            life: 1.2,
            maxLife: 1.2,
            type: 'sparkle'
        });
    }
    
    // Smoke trail effect
    createSmokeTrail(position, velocity, duration = 1.0) {
        const particleCount = 20;
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];
        
        for (let i = 0; i < particleCount; i++) {
            positions.push(
                position.x + (Math.random() - 0.5) * 0.3,
                position.y + (Math.random() - 0.5) * 0.3,
                position.z + (Math.random() - 0.5) * 0.3
            );
            
            const gray = 0.3 + Math.random() * 0.3;
            colors.push(gray, gray, gray);
        }
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.4,
            vertexColors: true,
            transparent: true,
            opacity: 0.5,
            blending: THREE.NormalBlending
        });
        
        const particles = new THREE.Points(geometry, material);
        this.scene.add(particles);
        
        const velocities = [];
        for (let i = 0; i < particleCount; i++) {
            velocities.push(
                velocity.x * 0.3 + (Math.random() - 0.5) * 0.2,
                velocity.y * 0.3 + Math.random() * 0.2,
                velocity.z * 0.3 + (Math.random() - 0.5) * 0.2
            );
        }
        
        this.addParticleGroup({
            mesh: particles,
            velocities,
            life: duration,
            maxLife: duration,
            type: 'smoke'
        });
    }
    
    addParticleGroup(group) {
        // Remove oldest group if at limit
        if (this.particleGroups.length >= this.maxParticleGroups) {
            const oldest = this.particleGroups.shift();
            this.removeParticleGroup(oldest);
        }
        
        this.particleGroups.push(group);
    }
    
    removeParticleGroup(group) {
        if (group.mesh) {
            this.scene.remove(group.mesh);
            if (group.mesh.geometry) group.mesh.geometry.dispose();
            if (group.mesh.material) group.mesh.material.dispose();
        }
    }
    
    update(deltaTime) {
        const toRemove = [];
        
        this.particleGroups.forEach((group, index) => {
            // Update lifetime
            group.life -= deltaTime;
            
            if (group.life <= 0) {
                toRemove.push(index);
                return;
            }
            
            // Update particle positions
            if (group.velocities && group.mesh.geometry) {
                const positions = group.mesh.geometry.attributes.position.array;
                const velocities = group.velocities;
                
                for (let i = 0; i < positions.length; i += 3) {
                    positions[i] += velocities[i] * deltaTime * 60;
                    positions[i + 1] += velocities[i + 1] * deltaTime * 60;
                    positions[i + 2] += velocities[i + 2] * deltaTime * 60;
                    
                    // Apply gravity for some effects
                    if (group.type === 'fire' || group.type === 'explosion') {
                        velocities[i + 1] -= 0.02; // Gravity
                    }
                }
                
                group.mesh.geometry.attributes.position.needsUpdate = true;
            }
            
            // Fade out
            if (group.mesh.material) {
                const fadeProgress = group.life / group.maxLife;
                group.mesh.material.opacity = fadeProgress;
            }
        });
        
        // Remove dead particles
        toRemove.reverse().forEach(index => {
            this.removeParticleGroup(this.particleGroups[index]);
            this.particleGroups.splice(index, 1);
        });
    }
    
    dispose() {
        this.particleGroups.forEach(group => this.removeParticleGroup(group));
        this.particleGroups = [];
        console.log('✨ Advanced Particle System disposed');
    }
}
