/**
 * WeatherSystemAdvanced.js
 * 
 * Advanced weather simulation system with visual effects
 * Includes rain, snow, storms, fog, wind, and atmospheric effects
 * Integrates with ParticleSystem for weather VFX
 * Uses Kenney particle sprites for weather effects
 * 
 * Features:
 * - Multiple weather types (clear, rain, snow, storm, fog, blizzard)
 * - Dynamic weather transitions
 * - Weather intensity system
 * - Lightning effects for storms
 * - Wind simulation affecting particles
 * - Atmospheric effects (fog, clouds)
 * - Sound effects integration
 * - Day/night cycle integration
 */

export class WeatherSystemAdvanced {
    constructor(scene, particleSystem, soundManager, dayNightCycle) {
        this.scene = scene;
        this.particleSystem = particleSystem;
        this.soundManager = soundManager;
        this.dayNightCycle = dayNightCycle;
        
        // Current weather state
        this.currentWeather = 'clear';
        this.targetWeather = 'clear';
        this.transitionProgress = 1.0; // 0 = current, 1 = target
        this.transitionDuration = 5.0; // seconds
        
        // Weather types
        this.weatherTypes = {
            clear: {
                fogDensity: 0.0,
                windSpeed: 0.1,
                lightingMultiplier: 1.0,
                ambientSound: null,
                particles: []
            },
            rain: {
                fogDensity: 0.002,
                windSpeed: 0.3,
                lightingMultiplier: 0.7,
                ambientSound: 'rain',
                particles: [{ type: 'rain', count: 1000 }]
            },
            snow: {
                fogDensity: 0.003,
                windSpeed: 0.2,
                lightingMultiplier: 0.9,
                ambientSound: 'wind',
                particles: [{ type: 'snow', count: 500 }]
            },
            storm: {
                fogDensity: 0.005,
                windSpeed: 0.6,
                lightingMultiplier: 0.4,
                ambientSound: 'storm',
                particles: [
                    { type: 'rain', count: 2000 },
                    { type: 'fog', count: 100 }
                ],
                lightning: true
            },
            fog: {
                fogDensity: 0.01,
                windSpeed: 0.1,
                lightingMultiplier: 0.6,
                ambientSound: 'wind',
                particles: [{ type: 'fog', count: 200 }]
            },
            blizzard: {
                fogDensity: 0.008,
                windSpeed: 0.8,
                lightingMultiplier: 0.5,
                ambientSound: 'blizzard',
                particles: [
                    { type: 'snow', count: 1500 },
                    { type: 'fog', count: 150 }
                ]
            },
            sandstorm: {
                fogDensity: 0.01,
                windSpeed: 0.7,
                lightingMultiplier: 0.6,
                ambientSound: 'wind',
                particles: [
                    { type: 'dust', count: 800 }
                ]
            }
        };
        
        // Weather intensity (0-1)
        this.intensity = 1.0;
        
        // Lightning system
        this.lightning = {
            enabled: false,
            nextStrike: 0,
            strikeInterval: 3.0, // seconds
            flashDuration: 0.2,
            currentFlash: 0
        };
        
        // Wind
        this.wind = {
            direction: { x: 1, y: 0, z: 0 },
            speed: 0.1,
            turbulence: 0.1
        };
        
        // Active particle emitters
        this.activeEmitters = [];
        
        // Weather change callbacks
        this.weatherChangeCallbacks = [];
        
        this.initialize();
    }
    
    initialize() {
        logger.info('[WeatherSystemAdvanced] Initializing weather system...');
        
        // Set initial weather
        this.setWeather('clear', 0);
        
        logger.info('[WeatherSystemAdvanced] Weather system initialized');
    }
    
    // Set weather type with optional transition time
    setWeather(weatherType, transitionTime = 5.0) {
        if (!this.weatherTypes[weatherType]) {
            logger.warn(`[WeatherSystemAdvanced] Unknown weather type: ${weatherType}`);
            return;
        }
        
        if (this.currentWeather === weatherType) {
            return;
        }
        
        logger.info(`[WeatherSystemAdvanced] Changing weather from ${this.currentWeather} to ${weatherType}`);
        
        this.targetWeather = weatherType;
        this.transitionDuration = transitionTime;
        this.transitionProgress = 0.0;
        
        // Trigger callbacks
        this.weatherChangeCallbacks.forEach(callback => {
            callback(weatherType, this.currentWeather);
        });
    }
    
    // Set weather intensity (0-1)
    setIntensity(intensity) {
        this.intensity = Math.max(0, Math.min(1, intensity));
        this.updateWeatherEffects();
    }
    
    // Update weather effects based on current state
    updateWeatherEffects() {
        const currentWeatherData = this.weatherTypes[this.currentWeather];
        const targetWeatherData = this.weatherTypes[this.targetWeather];
        
        if (!currentWeatherData || !targetWeatherData) return;
        
        // Interpolate between current and target
        const t = this.transitionProgress;
        
        // Update fog
        const fogDensity = this.lerp(currentWeatherData.fogDensity, targetWeatherData.fogDensity, t) * this.intensity;
        this.updateFog(fogDensity);
        
        // Update wind
        this.wind.speed = this.lerp(currentWeatherData.windSpeed, targetWeatherData.windSpeed, t) * this.intensity;
        
        // Update lighting
        const lightingMultiplier = this.lerp(currentWeatherData.lightingMultiplier, targetWeatherData.lightingMultiplier, t);
        this.updateLighting(lightingMultiplier);
        
        // Update particles
        if (t >= 0.5) {
            // Switch to target particles halfway through transition
            this.updateParticles(targetWeatherData.particles);
        } else {
            this.updateParticles(currentWeatherData.particles);
        }
        
        // Update ambient sound
        if (t >= 1.0 && targetWeatherData.ambientSound) {
            this.updateAmbientSound(targetWeatherData.ambientSound);
        }
        
        // Update lightning
        this.lightning.enabled = targetWeatherData.lightning || false;
    }
    
    // Update fog
    updateFog(density) {
        if (this.scene.fog) {
            this.scene.fog.density = density;
        }
    }
    
    // Update lighting based on weather
    updateLighting(multiplier) {
        if (this.dayNightCycle) {
            // Adjust day/night cycle lighting by weather multiplier
            // This would be integrated with the DayNightCycleSystem
        }
    }
    
    // Update particle effects
    updateParticles(particleConfigs) {
        // Clear existing emitters
        this.clearParticleEmitters();
        
        // Create new emitters
        if (!this.particleSystem) return;
        
        particleConfigs.forEach(config => {
            const emitterId = this.particleSystem.createEffect(
                `weather_${config.type}`,
                { x: 0, y: 20, z: 0 },
                {
                    type: config.type,
                    count: Math.floor(config.count * this.intensity),
                    lifetime: 5.0,
                    velocity: { x: this.wind.direction.x, y: -5, z: this.wind.direction.z },
                    spread: 50.0,
                    continuous: true
                }
            );
            
            this.activeEmitters.push(emitterId);
        });
    }
    
    // Clear particle emitters
    clearParticleEmitters() {
        if (!this.particleSystem) return;
        
        this.activeEmitters.forEach(emitterId => {
            this.particleSystem.removeEffect(emitterId);
        });
        
        this.activeEmitters = [];
    }
    
    // Update ambient sound
    updateAmbientSound(soundName) {
        if (!this.soundManager) return;
        
        this.soundManager.playAmbient(soundName, true);
    }
    
    // Lightning strike
    triggerLightning() {
        if (!this.lightning.enabled) return;
        
        logger.info('[WeatherSystemAdvanced] Lightning strike!');
        
        // Flash effect
        this.lightning.currentFlash = this.lightning.flashDuration;
        
        // Play thunder sound
        if (this.soundManager) {
            const delay = Math.random() * 2.0; // Thunder delay
            setTimeout(() => {
                this.soundManager.playSFX('thunder', 0.8);
            }, delay * 1000);
        }
        
        // Visual lightning effect
        if (this.particleSystem) {
            const randomX = (Math.random() - 0.5) * 100;
            const randomZ = (Math.random() - 0.5) * 100;
            
            this.particleSystem.createEffect(
                'lightning_bolt',
                { x: randomX, y: 50, z: randomZ },
                {
                    type: 'lightning',
                    count: 50,
                    lifetime: 0.3,
                    velocity: { x: 0, y: -50, z: 0 },
                    spread: 2.0
                }
            );
        }
    }
    
    // Linear interpolation
    lerp(a, b, t) {
        return a + (b - a) * t;
    }
    
    // Update method (called each frame)
    update(deltaTime) {
        // Update weather transition
        if (this.transitionProgress < 1.0) {
            this.transitionProgress += deltaTime / this.transitionDuration;
            
            if (this.transitionProgress >= 1.0) {
                this.transitionProgress = 1.0;
                this.currentWeather = this.targetWeather;
                logger.info(`[WeatherSystemAdvanced] Weather transition complete: ${this.currentWeather}`);
            }
            
            this.updateWeatherEffects();
        }
        
        // Update lightning
        if (this.lightning.enabled) {
            this.lightning.nextStrike -= deltaTime;
            
            if (this.lightning.nextStrike <= 0) {
                this.triggerLightning();
                this.lightning.nextStrike = this.lightning.strikeInterval + Math.random() * 5.0;
            }
        }
        
        // Update lightning flash
        if (this.lightning.currentFlash > 0) {
            this.lightning.currentFlash -= deltaTime;
            
            // Apply flash effect to scene
            const flashIntensity = this.lightning.currentFlash / this.lightning.flashDuration;
            this.applyLightningFlash(flashIntensity);
        }
        
        // Update wind turbulence
        this.updateWind(deltaTime);
    }
    
    // Update wind with turbulence
    updateWind(deltaTime) {
        // Add turbulence to wind direction
        const time = Date.now() * 0.001;
        this.wind.direction.x = Math.cos(time * 0.5) * this.wind.turbulence;
        this.wind.direction.z = Math.sin(time * 0.5) * this.wind.turbulence;
    }
    
    // Apply lightning flash effect
    applyLightningFlash(intensity) {
        // Would increase ambient light intensity temporarily
        // Integrated with scene lighting system
    }
    
    // Get current weather info
    getCurrentWeather() {
        return {
            type: this.currentWeather,
            intensity: this.intensity,
            transitionProgress: this.transitionProgress,
            wind: this.wind
        };
    }
    
    // Register callback for weather changes
    onWeatherChange(callback) {
        this.weatherChangeCallbacks.push(callback);
    }
    
    // Random weather
    setRandomWeather() {
        const weatherTypes = Object.keys(this.weatherTypes);
        const randomType = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
        this.setWeather(randomType);
    }
    
    // Weather cycle (for dynamic worlds)
    startWeatherCycle(interval = 60.0) {
        setInterval(() => {
            this.setRandomWeather();
        }, interval * 1000);
        
        logger.info(`[WeatherSystemAdvanced] Weather cycle started (${interval}s interval)`);
    }
    
    // Cleanup
    dispose() {
        this.clearParticleEmitters();
        this.weatherChangeCallbacks = [];
        logger.info('[WeatherSystemAdvanced] Disposed');
    }
}
