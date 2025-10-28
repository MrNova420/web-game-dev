/**
 * WeatherSystem - Advanced weather effects for immersive atmosphere
 * Supports rain, snow, fog, storms, and dynamic weather transitions
 */

import * as THREE from 'three';

export class WeatherSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.scene = gameEngine.scene;
        this.camera = gameEngine.camera;
        
        this.currentWeather = 'clear';
        this.weatherIntensity = 0.0;
        this.targetIntensity = 0.0;
        this.transitionSpeed = 0.01;
        
        this.weatherEffects = {
            rain: null,
            snow: null,
            fog: null,
            storm: null
        };
        
        this.weatherParticles = [];
        this.lightningFlashes = [];
        
        this.init();
    }
    
    init() {
        this.createRainSystem();
        this.createSnowSystem();
        this.createFogSystem();
        this.createStormSystem();
        
        console.log('🌦️ Weather System initialized');
    }
    
    createRainSystem() {
        const particleCount = 5000;
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const velocities = [];
        
        const spread = 100;
        const height = 80;
        
        for (let i = 0; i < particleCount; i++) {
            positions.push(
                (Math.random() - 0.5) * spread,
                Math.random() * height,
                (Math.random() - 0.5) * spread
            );
            
            velocities.push(
                0,
                -0.5 - Math.random() * 0.3,
                0
            );
        }
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        
        const material = new THREE.PointsMaterial({
            color: 0x88aacc,
            size: 0.1,
            transparent: true,
            opacity: 0.6,
            blending: THREE.NormalBlending
        });
        
        const rainParticles = new THREE.Points(geometry, material);
        rainParticles.visible = false;
        this.scene.add(rainParticles);
        
        this.weatherEffects.rain = {
            particles: rainParticles,
            velocities: velocities,
            geometry: geometry
        };
    }
    
    createSnowSystem() {
        const particleCount = 3000;
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const velocities = [];
        
        const spread = 100;
        const height = 80;
        
        for (let i = 0; i < particleCount; i++) {
            positions.push(
                (Math.random() - 0.5) * spread,
                Math.random() * height,
                (Math.random() - 0.5) * spread
            );
            
            velocities.push(
                (Math.random() - 0.5) * 0.1,
                -0.1 - Math.random() * 0.1,
                (Math.random() - 0.5) * 0.1
            );
        }
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        
        const material = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.3,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        const snowParticles = new THREE.Points(geometry, material);
        snowParticles.visible = false;
        this.scene.add(snowParticles);
        
        this.weatherEffects.snow = {
            particles: snowParticles,
            velocities: velocities,
            geometry: geometry
        };
    }
    
    createFogSystem() {
        // Fog is handled by THREE.Fog, just store settings
        this.weatherEffects.fog = {
            near: 1,
            far: 100,
            color: new THREE.Color(0x888888),
            density: 0.02
        };
    }
    
    createStormSystem() {
        // Storm combines rain with lightning
        this.weatherEffects.storm = {
            lightningInterval: 3000,
            lastLightning: 0,
            intensity: 1.5
        };
    }
    
    setWeather(weatherType, intensity = 1.0) {
        this.currentWeather = weatherType;
        this.targetIntensity = Math.max(0, Math.min(1, intensity));
        
        console.log(`🌦️ Setting weather to ${weatherType} (intensity: ${this.targetIntensity})`);
    }
    
    update(deltaTime) {
        // Smooth transition to target intensity
        if (Math.abs(this.weatherIntensity - this.targetIntensity) > 0.01) {
            const diff = this.targetIntensity - this.weatherIntensity;
            this.weatherIntensity += diff * this.transitionSpeed;
        }
        
        // Update active weather systems
        switch (this.currentWeather) {
            case 'rain':
                this.updateRain(deltaTime);
                break;
            case 'snow':
                this.updateSnow(deltaTime);
                break;
            case 'fog':
                this.updateFog(deltaTime);
                break;
            case 'storm':
                this.updateStorm(deltaTime);
                break;
            case 'clear':
                this.updateClear(deltaTime);
                break;
        }
        
        // Update visibility based on intensity
        this.updateWeatherVisibility();
    }
    
    updateRain(deltaTime) {
        const rain = this.weatherEffects.rain;
        if (!rain) return;
        
        const positions = rain.geometry.attributes.position.array;
        const velocities = rain.velocities;
        
        for (let i = 0; i < positions.length; i += 3) {
            // Apply velocity
            positions[i] += velocities[i] * deltaTime * 60 * this.weatherIntensity;
            positions[i + 1] += velocities[i + 1] * deltaTime * 60 * this.weatherIntensity;
            positions[i + 2] += velocities[i + 2] * deltaTime * 60 * this.weatherIntensity;
            
            // Reset particles that fall below ground
            if (positions[i + 1] < 0) {
                positions[i + 1] = 80;
                if (this.camera) {
                    positions[i] = this.camera.position.x + (Math.random() - 0.5) * 100;
                    positions[i + 2] = this.camera.position.z + (Math.random() - 0.5) * 100;
                }
            }
        }
        
        rain.geometry.attributes.position.needsUpdate = true;
    }
    
    updateSnow(deltaTime) {
        const snow = this.weatherEffects.snow;
        if (!snow) return;
        
        const positions = snow.geometry.attributes.position.array;
        const velocities = snow.velocities;
        const time = Date.now() * 0.001;
        
        for (let i = 0; i < positions.length; i += 3) {
            // Apply velocity with wind effect
            const windX = Math.sin(time + i * 0.1) * 0.05;
            const windZ = Math.cos(time + i * 0.1) * 0.05;
            
            positions[i] += (velocities[i] + windX) * deltaTime * 60 * this.weatherIntensity;
            positions[i + 1] += velocities[i + 1] * deltaTime * 60 * this.weatherIntensity;
            positions[i + 2] += (velocities[i + 2] + windZ) * deltaTime * 60 * this.weatherIntensity;
            
            // Reset particles that fall below ground
            if (positions[i + 1] < 0) {
                positions[i + 1] = 80;
                if (this.camera) {
                    positions[i] = this.camera.position.x + (Math.random() - 0.5) * 100;
                    positions[i + 2] = this.camera.position.z + (Math.random() - 0.5) * 100;
                }
            }
        }
        
        snow.geometry.attributes.position.needsUpdate = true;
    }
    
    updateFog(deltaTime) {
        if (this.scene.fog) {
            const targetDensity = 0.05 * this.weatherIntensity;
            if (this.scene.fog.density !== targetDensity) {
                const diff = targetDensity - this.scene.fog.density;
                this.scene.fog.density += diff * 0.05;
            }
        }
    }
    
    updateStorm(deltaTime) {
        // Storm is rain + lightning
        this.updateRain(deltaTime);
        this.updateLightning();
    }
    
    updateLightning() {
        const storm = this.weatherEffects.storm;
        const now = Date.now();
        
        if (now - storm.lastLightning > storm.lightningInterval) {
            if (Math.random() < this.weatherIntensity * 0.3) {
                this.createLightningFlash();
                storm.lastLightning = now;
            }
        }
    }
    
    createLightningFlash() {
        // Brief intense light
        const lightning = new THREE.PointLight(0xaaccff, 10, 200);
        lightning.position.set(
            (Math.random() - 0.5) * 100,
            50 + Math.random() * 30,
            (Math.random() - 0.5) * 100
        );
        
        this.scene.add(lightning);
        
        // Remove after short duration
        setTimeout(() => {
            this.scene.remove(lightning);
        }, 100 + Math.random() * 100);
    }
    
    updateClear(deltaTime) {
        // Gradually clear all weather effects
        if (this.scene.fog && this.scene.fog.density > 0.02) {
            this.scene.fog.density -= 0.001;
        }
    }
    
    updateWeatherVisibility() {
        const threshold = 0.1;
        
        if (this.weatherEffects.rain && this.weatherEffects.rain.particles) {
            this.weatherEffects.rain.particles.visible = 
                (this.currentWeather === 'rain' || this.currentWeather === 'storm') && 
                this.weatherIntensity > threshold;
            
            if (this.weatherEffects.rain.particles.visible) {
                this.weatherEffects.rain.particles.material.opacity = 
                    0.6 * this.weatherIntensity;
            }
        }
        
        if (this.weatherEffects.snow && this.weatherEffects.snow.particles) {
            this.weatherEffects.snow.particles.visible = 
                this.currentWeather === 'snow' && 
                this.weatherIntensity > threshold;
            
            if (this.weatherEffects.snow.particles.visible) {
                this.weatherEffects.snow.particles.material.opacity = 
                    0.8 * this.weatherIntensity;
            }
        }
    }
    
    // Preset weather conditions
    setRain(intensity = 0.7) {
        this.setWeather('rain', intensity);
    }
    
    setSnow(intensity = 0.5) {
        this.setWeather('snow', intensity);
    }
    
    setFog(intensity = 0.8) {
        this.setWeather('fog', intensity);
    }
    
    setStorm(intensity = 1.0) {
        this.setWeather('storm', intensity);
    }
    
    setClear() {
        this.setWeather('clear', 0.0);
    }
    
    // Random weather for variety
    setRandomWeather() {
        const weathers = ['clear', 'rain', 'snow', 'fog', 'storm'];
        const weights = [0.4, 0.25, 0.15, 0.15, 0.05]; // Clear is most common
        
        let roll = Math.random();
        let weatherIndex = 0;
        
        for (let i = 0; i < weights.length; i++) {
            roll -= weights[i];
            if (roll <= 0) {
                weatherIndex = i;
                break;
            }
        }
        
        const weather = weathers[weatherIndex];
        const intensity = 0.3 + Math.random() * 0.7;
        
        this.setWeather(weather, intensity);
        
        console.log(`🌦️ Random weather: ${weather} (${(intensity * 100).toFixed(0)}%)`);
    }
    
    dispose() {
        // Clean up resources
        Object.values(this.weatherEffects).forEach(effect => {
            if (effect && effect.particles) {
                if (effect.particles.geometry) effect.particles.geometry.dispose();
                if (effect.particles.material) effect.particles.material.dispose();
                this.scene.remove(effect.particles);
            }
        });
        
        console.log('🌦️ Weather System disposed');
    }
}
