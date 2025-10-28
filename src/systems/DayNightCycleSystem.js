/**
 * DayNightCycleSystem - Dynamic day/night cycle with realistic lighting
 * Controls sun position, ambient lighting, fog, and atmospheric colors
 */

import * as THREE from 'three';

export class DayNightCycleSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.scene = gameEngine.scene;
        this.renderer = gameEngine.renderer;
        
        // Time of day (0-24 hours)
        this.currentTime = 12.0; // Start at noon
        this.timeSpeed = 0.1; // Hours per real second
        this.paused = false;
        
        // Lighting
        this.sunLight = null;
        this.moonLight = null;
        this.ambientLight = null;
        this.hemisphereLight = null;
        
        // Sky colors
        this.skyColors = {
            day: {
                top: new THREE.Color(0x0077ff),
                bottom: new THREE.Color(0x89b2eb),
                fog: new THREE.Color(0x89b2eb)
            },
            sunset: {
                top: new THREE.Color(0xff6b35),
                bottom: new THREE.Color(0xffd23f),
                fog: new THREE.Color(0xff9a56)
            },
            night: {
                top: new THREE.Color(0x0a0e27),
                bottom: new THREE.Color(0x1a1e3e),
                fog: new THREE.Color(0x1a2847)
            }
        };
        
        this.init();
    }
    
    init() {
        this.createLights();
        this.updateLighting();
        
        console.log('🌅 Day/Night Cycle System initialized');
    }
    
    createLights() {
        // Sun light (directional)
        this.sunLight = new THREE.DirectionalLight(0xffffff, 1.0);
        this.sunLight.castShadow = true;
        this.sunLight.shadow.mapSize.width = 2048;
        this.sunLight.shadow.mapSize.height = 2048;
        this.sunLight.shadow.camera.near = 0.5;
        this.sunLight.shadow.camera.far = 500;
        this.sunLight.shadow.camera.left = -100;
        this.sunLight.shadow.camera.right = 100;
        this.sunLight.shadow.camera.top = 100;
        this.sunLight.shadow.camera.bottom = -100;
        this.scene.add(this.sunLight);
        
        // Moon light (softer directional)
        this.moonLight = new THREE.DirectionalLight(0x6699cc, 0.3);
        this.moonLight.castShadow = false;
        this.scene.add(this.moonLight);
        
        // Ambient light
        this.ambientLight = new THREE.AmbientLight(0x404060, 0.4);
        this.scene.add(this.ambientLight);
        
        // Hemisphere light
        this.hemisphereLight = new THREE.HemisphereLight(0x4488ff, 0x223344, 0.3);
        this.scene.add(this.hemisphereLight);
    }
    
    update(deltaTime) {
        if (this.paused) return;
        
        // Advance time
        this.currentTime += this.timeSpeed * deltaTime;
        
        // Wrap around 24 hours
        if (this.currentTime >= 24.0) {
            this.currentTime -= 24.0;
            console.log('🌅 New day begins!');
        }
        
        this.updateLighting();
    }
    
    updateLighting() {
        const time = this.currentTime;
        
        // Calculate sun angle (0-360 degrees)
        const sunAngle = (time / 24.0) * Math.PI * 2 - Math.PI / 2;
        const sunHeight = Math.sin(sunAngle);
        
        // Position sun
        const sunDistance = 200;
        this.sunLight.position.set(
            Math.cos(sunAngle) * sunDistance,
            sunHeight * sunDistance,
            0
        );
        
        // Position moon (opposite of sun)
        this.moonLight.position.set(
            -Math.cos(sunAngle) * sunDistance,
            -sunHeight * sunDistance,
            0
        );
        
        // Determine time of day phase
        let phase, blend;
        
        if (time >= 5 && time < 7) {
            // Dawn
            phase = 'dawn';
            blend = (time - 5) / 2;
        } else if (time >= 7 && time < 17) {
            // Day
            phase = 'day';
            blend = 1.0;
        } else if (time >= 17 && time < 19) {
            // Dusk
            phase = 'dusk';
            blend = 1 - ((time - 17) / 2);
        } else {
            // Night
            phase = 'night';
            blend = 0.0;
        }
        
        // Update light intensities
        this.updateLightIntensities(sunHeight, blend);
        
        // Update sky and fog colors
        this.updateSkyColors(phase, blend);
    }
    
    updateLightIntensities(sunHeight, dayBlend) {
        // Sun brightness (0 at night, 1 during day)
        const sunBrightness = Math.max(0, sunHeight);
        this.sunLight.intensity = sunBrightness * 1.2;
        
        // Moon brightness (inverse of sun)
        const moonBrightness = Math.max(0, -sunHeight) * 0.3;
        this.moonLight.intensity = moonBrightness;
        
        // Ambient light (dimmer at night)
        const ambientIntensity = 0.2 + dayBlend * 0.3;
        this.ambientLight.intensity = ambientIntensity;
        
        // Hemisphere light
        this.hemisphereLight.intensity = 0.1 + dayBlend * 0.3;
        
        // Update light colors
        if (sunHeight < 0.2 && sunHeight > -0.2) {
            // Sunset/sunrise colors
            this.sunLight.color.setHex(0xffaa66);
        } else {
            this.sunLight.color.setHex(0xffffff);
        }
    }
    
    updateSkyColors(phase, blend) {
        let topColor, bottomColor, fogColor;
        
        if (phase === 'dawn' || phase === 'dusk') {
            // Blend between night and day through sunset colors
            topColor = this.blendColors(
                this.skyColors.night.top,
                this.skyColors.sunset.top,
                phase === 'dawn' ? blend : 1 - blend
            );
            bottomColor = this.blendColors(
                this.skyColors.night.bottom,
                this.skyColors.sunset.bottom,
                phase === 'dawn' ? blend : 1 - blend
            );
            fogColor = this.blendColors(
                this.skyColors.night.fog,
                this.skyColors.sunset.fog,
                phase === 'dawn' ? blend : 1 - blend
            );
        } else if (phase === 'day') {
            topColor = this.skyColors.day.top;
            bottomColor = this.skyColors.day.bottom;
            fogColor = this.skyColors.day.fog;
        } else {
            topColor = this.skyColors.night.top;
            bottomColor = this.skyColors.night.bottom;
            fogColor = this.skyColors.night.fog;
        }
        
        // Update scene background
        this.scene.background = bottomColor.clone();
        
        // Update fog
        if (this.scene.fog) {
            this.scene.fog.color = fogColor.clone();
        }
    }
    
    blendColors(color1, color2, blend) {
        return new THREE.Color(
            color1.r + (color2.r - color1.r) * blend,
            color1.g + (color2.g - color1.g) * blend,
            color1.b + (color2.b - color1.b) * blend
        );
    }
    
    // Time control methods
    setTime(hours) {
        this.currentTime = Math.max(0, Math.min(24, hours));
        this.updateLighting();
        console.log(`🕐 Time set to ${this.getTimeString()}`);
    }
    
    setTimeSpeed(speed) {
        this.timeSpeed = speed;
        console.log(`⏱️ Time speed: ${speed}x`);
    }
    
    pause() {
        this.paused = true;
        console.log('⏸️ Day/Night cycle paused');
    }
    
    resume() {
        this.paused = false;
        console.log('▶️ Day/Night cycle resumed');
    }
    
    // Preset times
    setMorning() {
        this.setTime(8);
    }
    
    setNoon() {
        this.setTime(12);
    }
    
    setEvening() {
        this.setTime(18);
    }
    
    setMidnight() {
        this.setTime(0);
    }
    
    // Get current time as string
    getTimeString() {
        const hours = Math.floor(this.currentTime);
        const minutes = Math.floor((this.currentTime - hours) * 60);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
    
    // Get time of day description
    getTimeOfDay() {
        const time = this.currentTime;
        
        if (time >= 5 && time < 7) return 'Dawn';
        if (time >= 7 && time < 11) return 'Morning';
        if (time >= 11 && time < 14) return 'Midday';
        if (time >= 14 && time < 17) return 'Afternoon';
        if (time >= 17 && time < 19) return 'Dusk';
        if (time >= 19 || time < 5) return 'Night';
        
        return 'Unknown';
    }
    
    // Check if it's daytime
    isDaytime() {
        return this.currentTime >= 6 && this.currentTime < 18;
    }
    
    isNighttime() {
        return !this.isDaytime();
    }
    
    dispose() {
        if (this.sunLight) this.scene.remove(this.sunLight);
        if (this.moonLight) this.scene.remove(this.moonLight);
        if (this.ambientLight) this.scene.remove(this.ambientLight);
        if (this.hemisphereLight) this.scene.remove(this.hemisphereLight);
        
        console.log('🌅 Day/Night Cycle System disposed');
    }
}
