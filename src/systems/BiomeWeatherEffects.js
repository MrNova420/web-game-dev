/**
import { logger } from '../core/Logger.js';
 * BiomeWeatherEffects.js
 * Phase 4.3 - Biome-Specific Weather Effects
 * Creates dynamic weather effects for each biome
 * ~300 lines
 */

import * as THREE from 'three';

export class BiomeWeatherEffects {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        
        // Weather particle systems
        this.weatherParticles = null;
        this.particleGeometry = null;
        this.particleMaterial = null;
        
        // Current weather state
        this.currentWeather = 'clear';
        this.weatherIntensity = 0.5;
        this.weatherTransition = 0;
        
        // Weather definitions
        this.weatherTypes = {
            clear: {
                particles: false,
                fogDensity: 0.002,
                fogColor: 0x87ceeb,
                ambientLight: 1.0
            },
            fog: {
                particles: false,
                fogDensity: 0.05,
                fogColor: 0xcccccc,
                ambientLight: 0.7
            },
            light_rain: {
                particles: true,
                particleCount: 1000,
                particleColor: 0xaaaaff,
                particleSpeed: 10,
                fogDensity: 0.01,
                fogColor: 0x888888,
                ambientLight: 0.6
            },
            sandstorm: {
                particles: true,
                particleCount: 2000,
                particleColor: 0xe3c567,
                particleSpeed: 8,
                fogDensity: 0.08,
                fogColor: 0xc2b280,
                ambientLight: 0.4
            },
            blizzard: {
                particles: true,
                particleCount: 1500,
                particleColor: 0xffffff,
                particleSpeed: 12,
                fogDensity: 0.06,
                fogColor: 0xe0f2f7,
                ambientLight: 0.5
            },
            ash_fall: {
                particles: true,
                particleCount: 800,
                particleColor: 0x333333,
                particleSpeed: 3,
                fogDensity: 0.04,
                fogColor: 0x4a0e0e,
                ambientLight: 0.5
            },
            lava_eruption: {
                particles: true,
                particleCount: 500,
                particleColor: 0xff4500,
                particleSpeed: 15,
                fogDensity: 0.03,
                fogColor: 0x8b1e1e,
                ambientLight: 0.7
            },
            underwater: {
                particles: true,
                particleCount: 300,
                particleColor: 0x00a8ff,
                particleSpeed: 2,
                fogDensity: 0.1,
                fogColor: 0x001a33,
                ambientLight: 0.3
            },
            petal_rain: {
                particles: true,
                particleCount: 600,
                particleColor: 0xffb7c5,
                particleSpeed: 2,
                fogDensity: 0.005,
                fogColor: 0xffc9d4,
                ambientLight: 0.9
            },
            aurora: {
                particles: false,
                fogDensity: 0.01,
                fogColor: 0x81d4fa,
                ambientLight: 0.6,
                specialEffect: 'aurora_borealis'
            }
        };
        
        // Particle pool for performance
        this.particlePositions = [];
        this.particleVelocities = [];
        
        logger.info('🌦️ BiomeWeatherEffects initialized');
    }
    
    /**
     * Initialize weather system
     */
    init() {
        // Setup fog
        this.scene.fog = new THREE.Fog(0x87ceeb, 10, 100);
        
        // Create initial particle system
        this.createParticleSystem();
    }
    
    /**
     * Create particle system for weather effects
     */
    createParticleSystem() {
        // Create geometry for particles
        const maxParticles = 2000;
        this.particleGeometry = new THREE.BufferGeometry();
        
        const positions = new Float32Array(maxParticles * 3);
        const colors = new Float32Array(maxParticles * 3);
        
        // Initialize particles
        for (let i = 0; i < maxParticles; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 50;
            positions[i3 + 1] = Math.random() * 50;
            positions[i3 + 2] = (Math.random() - 0.5) * 50;
            
            colors[i3] = 1;
            colors[i3 + 1] = 1;
            colors[i3 + 2] = 1;
            
            this.particleVelocities.push({
                x: (Math.random() - 0.5) * 0.5,
                y: -Math.random() * 2,
                z: (Math.random() - 0.5) * 0.5
            });
        }
        
        this.particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        // Create material
        this.particleMaterial = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        
        // Create particle system
        this.weatherParticles = new THREE.Points(this.particleGeometry, this.particleMaterial);
        this.weatherParticles.visible = false;
        this.scene.add(this.weatherParticles);
    }
    
    /**
     * Set weather based on biome
     */
    setWeatherFromBiome(biome) {
        if (!biome || !biome.weather) return;
        
        // Select random weather from biome options
        const weatherOptions = biome.weather;
        const selectedWeather = weatherOptions[Math.floor(Math.random() * weatherOptions.length)];
        
        this.setWeather(selectedWeather);
    }
    
    /**
     * Set specific weather type
     */
    setWeather(weatherType) {
        if (!this.weatherTypes[weatherType]) {
            logger.warn('Unknown weather type:', weatherType);
            return;
        }
        
        this.currentWeather = weatherType;
        const weather = this.weatherTypes[weatherType];
        
        // Update fog
        if (this.scene.fog) {
            this.scene.fog.density = weather.fogDensity;
            this.scene.fog.color.setHex(weather.fogColor);
        }
        
        // Update particles
        if (weather.particles) {
            this.activateParticles(weather);
        } else {
            this.deactivateParticles();
        }
        
        logger.info('🌦️ Weather set to:', weatherType);
    }
    
    /**
     * Activate particle system for weather
     */
    activateParticles(weather) {
        if (!this.weatherParticles) return;
        
        this.weatherParticles.visible = true;
        
        // Update particle count
        const positions = this.particleGeometry.attributes.position.array;
        const colors = this.particleGeometry.attributes.color.array;
        
        const particleCount = Math.min(weather.particleCount, positions.length / 3);
        const color = new THREE.Color(weather.particleColor);
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Reset position
            positions[i3 + 1] = Math.random() * 50;
            
            // Set color
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
            
            // Set velocity
            this.particleVelocities[i].y = -weather.particleSpeed * 0.1;
        }
        
        // Hide excess particles
        for (let i = particleCount; i < positions.length / 3; i++) {
            const i3 = i * 3;
            positions[i3 + 1] = -1000; // Move off screen
        }
        
        this.particleGeometry.attributes.position.needsUpdate = true;
        this.particleGeometry.attributes.color.needsUpdate = true;
    }
    
    /**
     * Deactivate particle system
     */
    deactivateParticles() {
        if (this.weatherParticles) {
            this.weatherParticles.visible = false;
        }
    }
    
    /**
     * Update weather effects
     */
    update(deltaTime, playerPosition) {
        if (!this.weatherParticles || !this.weatherParticles.visible) return;
        
        const positions = this.particleGeometry.attributes.position.array;
        const weather = this.weatherTypes[this.currentWeather];
        
        if (!weather || !weather.particles) return;
        
        const particleCount = Math.min(weather.particleCount, positions.length / 3);
        
        // Update each particle
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            const velocity = this.particleVelocities[i];
            
            // Update position
            positions[i3] += velocity.x * deltaTime * 0.01;
            positions[i3 + 1] += velocity.y * deltaTime * 0.01;
            positions[i3 + 2] += velocity.z * deltaTime * 0.01;
            
            // Keep particles near camera/player
            if (playerPosition) {
                const dx = positions[i3] - playerPosition.x;
                const dz = positions[i3 + 2] - playerPosition.z;
                const distance = Math.sqrt(dx * dx + dz * dz);
                
                if (distance > 30) {
                    // Reset to near player
                    const angle = Math.random() * Math.PI * 2;
                    const radius = Math.random() * 20;
                    positions[i3] = playerPosition.x + Math.cos(angle) * radius;
                    positions[i3 + 2] = playerPosition.z + Math.sin(angle) * radius;
                }
            }
            
            // Reset if particle falls too low
            if (positions[i3 + 1] < 0) {
                positions[i3 + 1] = 50;
                positions[i3] += (Math.random() - 0.5) * 20;
                positions[i3 + 2] += (Math.random() - 0.5) * 20;
            }
        }
        
        this.particleGeometry.attributes.position.needsUpdate = true;
    }
    
    /**
     * Get current weather type
     */
    getCurrentWeather() {
        return this.currentWeather;
    }
    
    /**
     * Set weather intensity (0-1)
     */
    setIntensity(intensity) {
        this.weatherIntensity = Math.max(0, Math.min(1, intensity));
        
        if (this.particleMaterial) {
            this.particleMaterial.opacity = 0.3 + this.weatherIntensity * 0.5;
        }
    }
    
    /**
     * Cleanup weather effects
     */
    dispose() {
        if (this.particleGeometry) {
            this.particleGeometry.dispose();
        }
        if (this.particleMaterial) {
            this.particleMaterial.dispose();
        }
        if (this.weatherParticles) {
            this.scene.remove(this.weatherParticles);
        }
    }
}
