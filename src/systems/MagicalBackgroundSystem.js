/**
import { logger } from '../core/Logger.js';
 * Magical Background System
 * Creates vibrant, colorful, anime-style magical particles floating in the background
 * Adds sparkles, stars, and magical auras to enhance the fantasy atmosphere
 */

import * as THREE from 'three';

export class MagicalBackgroundSystem {
    constructor(scene) {
        this.scene = scene;
        this.sparkleParticles = [];
        this.floatingMagicParticles = [];
        this.magicalAuras = [];
        this.sparkBurstParticles = []; // Track burst particles for cleanup
        
        // Constants
        this.POINT_SIZE_SCALE = 300.0;
        
        this.init();
    }
    
    init() {
        logger.info('✨ Initializing Magical Background System...');
        
        this.createFloatingSparkles();
        this.createMagicalStars();
        this.createFloatingMagicOrbs();
        this.createRainbowAuras();
        
        logger.info('✅ Magical Background System initialized');
    }
    
    /**
     * Create floating sparkle particles throughout the world
     */
    createFloatingSparkles() {
        const particleCount = 100; // Reduced from 500 for better performance
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];
        const sizes = [];
        
        for (let i = 0; i < particleCount; i++) {
            // Random position in a large area
            positions.push(
                Math.random() * 100 - 50,
                Math.random() * 50,
                Math.random() * 100 - 50
            );
            
            // Rainbow colors
            const hue = Math.random();
            const color = new THREE.Color().setHSL(hue, 1.0, 0.7);
            colors.push(color.r, color.g, color.b);
            
            // Varying sizes
            sizes.push(Math.random() * 0.3 + 0.1); // Smaller particles
        }
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
        
        // Custom shader for sparkles with glow
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 }
            },
            vertexShader: `
                attribute float size;
                attribute vec3 color;
                varying vec3 vColor;
                uniform float time;
                
                void main() {
                    vColor = color;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    
                    // Twinkle effect
                    float twinkle = sin(time * 2.0 + position.x * 10.0) * 0.5 + 0.5;
                    gl_PointSize = size * twinkle * 20.0 * (${this.POINT_SIZE_SCALE} / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                
                void main() {
                    // Circular sparkle shape
                    vec2 center = gl_PointCoord - vec2(0.5);
                    float dist = length(center);
                    
                    if (dist > 0.5) discard;
                    
                    // Bright center with glow
                    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
                    alpha = pow(alpha, 0.5); // Make it brighter
                    
                    gl_FragColor = vec4(vColor * 2.0, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        const particles = new THREE.Points(geometry, material);
        this.scene.add(particles);
        this.sparkleParticles.push({ mesh: particles, material });
    }
    
    /**
     * Create magical floating stars
     */
    createMagicalStars() {
        const starCount = 50; // Reduced from 200 for better performance
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];
        
        for (let i = 0; i < starCount; i++) {
            positions.push(
                Math.random() * 80 - 40,
                Math.random() * 40 + 10,
                Math.random() * 80 - 40
            );
            
            // Bright star colors (white, yellow, cyan, magenta)
            const colorChoice = Math.random();
            let color;
            if (colorChoice < 0.25) {
                color = new THREE.Color(1, 1, 1); // White
            } else if (colorChoice < 0.5) {
                color = new THREE.Color(1, 1, 0); // Yellow
            } else if (colorChoice < 0.75) {
                color = new THREE.Color(0, 1, 1); // Cyan
            } else {
                color = new THREE.Color(1, 0, 1); // Magenta
            }
            colors.push(color.r, color.g, color.b);
        }
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.6, // Smaller stars
            vertexColors: true,
            transparent: true,
            opacity: 0.8, // Slightly more transparent
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            sizeAttenuation: true
        });
        
        const stars = new THREE.Points(geometry, material);
        this.scene.add(stars);
        this.floatingMagicParticles.push(stars);
    }
    
    /**
     * Create floating magical orbs
     */
    createFloatingMagicOrbs() {
        const orbCount = 30;
        const magicColors = [
            0xff00ff, // Magenta
            0x00ffff, // Cyan
            0xffff00, // Yellow
            0xff0066, // Pink
            0x00ff00, // Green
            0xff6600  // Orange
        ];
        
        for (let i = 0; i < orbCount; i++) {
            const geometry = new THREE.SphereGeometry(0.3, 16, 16);
            const color = magicColors[Math.floor(Math.random() * magicColors.length)];
            const material = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.6,
                blending: THREE.AdditiveBlending
            });
            
            const orb = new THREE.Mesh(geometry, material);
            orb.position.set(
                Math.random() * 60 - 30,
                Math.random() * 30 + 5,
                Math.random() * 60 - 30
            );
            
            // Store animation data
            orb.userData = {
                baseY: orb.position.y,
                speed: Math.random() * 0.5 + 0.5,
                phase: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.02
            };
            
            this.scene.add(orb);
            this.floatingMagicParticles.push(orb);
        }
    }
    
    /**
     * Create rainbow aura effects
     */
    createRainbowAuras() {
        const auraCount = 15;
        
        for (let i = 0; i < auraCount; i++) {
            const geometry = new THREE.RingGeometry(2, 3, 32);
            const material = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    colorA: { value: new THREE.Color(0xff00ff) },
                    colorB: { value: new THREE.Color(0x00ffff) }
                },
                vertexShader: `
                    varying vec2 vUv;
                    
                    void main() {
                        vUv = uv;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform float time;
                    uniform vec3 colorA;
                    uniform vec3 colorB;
                    varying vec2 vUv;
                    
                    void main() {
                        // Rainbow gradient
                        float hue = fract(vUv.x * 3.0 + time * 0.5);
                        vec3 rainbow = vec3(
                            sin(hue * 6.28318) * 0.5 + 0.5,
                            sin((hue + 0.333) * 6.28318) * 0.5 + 0.5,
                            sin((hue + 0.666) * 6.28318) * 0.5 + 0.5
                        );
                        
                        // Fade at edges
                        float alpha = smoothstep(0.0, 0.2, vUv.y) * smoothstep(1.0, 0.8, vUv.y);
                        alpha *= 0.4;
                        
                        gl_FragColor = vec4(rainbow * 2.0, alpha);
                    }
                `,
                transparent: true,
                blending: THREE.AdditiveBlending,
                side: THREE.DoubleSide,
                depthWrite: false
            });
            
            const aura = new THREE.Mesh(geometry, material);
            aura.position.set(
                Math.random() * 50 - 25,
                Math.random() * 20 + 2,
                Math.random() * 50 - 25
            );
            aura.rotation.x = Math.PI / 2;
            
            // Store animation data
            aura.userData = {
                rotationSpeed: (Math.random() - 0.5) * 0.01,
                pulseSpeed: Math.random() * 0.5 + 0.5,
                baseScale: 1.0
            };
            
            this.scene.add(aura);
            this.magicalAuras.push(aura);
        }
    }
    
    /**
     * Update all magical background effects
     */
    update(deltaTime) {
        const time = Date.now() * 0.001;
        
        // Update sparkle particles
        this.sparkleParticles.forEach(particleObj => {
            if (particleObj.material.uniforms) {
                particleObj.material.uniforms.time.value = time;
            }
            
            // Rotate slowly
            particleObj.mesh.rotation.y += deltaTime * 0.1;
        });
        
        // Update floating magic orbs
        this.floatingMagicParticles.forEach(particle => {
            if (particle.userData) {
                const data = particle.userData;
                
                // Float up and down
                particle.position.y = data.baseY + Math.sin(time * data.speed + data.phase) * 2;
                
                // Rotate
                if (data.rotationSpeed) {
                    particle.rotation.y += data.rotationSpeed;
                    particle.rotation.x += data.rotationSpeed * 0.5;
                }
            }
        });
        
        // Update rainbow auras
        this.magicalAuras.forEach(aura => {
            if (aura.material.uniforms) {
                aura.material.uniforms.time.value = time;
            }
            
            const data = aura.userData;
            
            // Rotate
            aura.rotation.z += data.rotationSpeed;
            
            // Pulse scale
            const pulse = Math.sin(time * data.pulseSpeed) * 0.2 + 1.0;
            aura.scale.set(pulse, pulse, pulse);
        });
        
        // Update and cleanup spark burst particles
        const particlesToRemove = [];
        this.sparkBurstParticles.forEach((particle, index) => {
            const data = particle.userData;
            data.lifetime -= deltaTime;
            
            if (data.lifetime <= 0) {
                // Mark for removal
                particlesToRemove.push(index);
                this.scene.remove(particle);
                particle.geometry.dispose();
                particle.material.dispose();
            } else {
                // Update particle
                particle.position.add(
                    data.velocity.clone().multiplyScalar(deltaTime)
                );
                data.velocity.y -= 9.8 * deltaTime; // Gravity
                
                // Fade out
                particle.material.opacity = data.lifetime / data.maxLifetime;
            }
        });
        
        // Remove dead particles from array (in reverse to maintain indices)
        for (let i = particlesToRemove.length - 1; i >= 0; i--) {
            this.sparkBurstParticles.splice(particlesToRemove[i], 1);
        }
    }
    
    /**
     * Create a burst of magical sparkles at a position
     * Note: Uses individual meshes for simplicity. For production, consider using
     * instanced rendering or BufferGeometry-based particle system for better performance.
     */
    createSparkBurst(position, color = 0xff00ff, count = 50) {
        for (let i = 0; i < count; i++) {
            const geometry = new THREE.SphereGeometry(0.1, 8, 8);
            const material = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 1,
                blending: THREE.AdditiveBlending
            });
            
            const particle = new THREE.Mesh(geometry, material);
            particle.position.copy(position);
            
            // Random velocity
            const velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 5,
                Math.random() * 5 + 2,
                (Math.random() - 0.5) * 5
            );
            
            particle.userData = {
                velocity: velocity,
                lifetime: 1.0,
                maxLifetime: 1.0
            };
            
            this.scene.add(particle);
            this.sparkBurstParticles.push(particle);
        }
    }
}
