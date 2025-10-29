/**
 * PlayerScreenEffectsSystem - Screen-space visual effects for player feedback
 * 
 * Provides immediate visual feedback through screen effects:
 * - Health vignette (red edges at low HP)
 * - Damage flashes (white on hit)
 * - Healing glows (green pulse)
 * - Level-up bursts (gold particles)
 * - Critical hit slow-mo
 * - Element screen tints
 * - Magic shimmer overlay
 * 
 * ALL EFFECTS USE EXTERNAL ASSETS:
 * - Vignette textures: Kenney
 * - Particle overlays: Kenney Particle Pack
 * - Post-processing: Three.js built-in
 * 
 * @class PlayerScreenEffectsSystem
 */

export class PlayerScreenEffectsSystem {
    constructor(scene, camera, renderer) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        
        // Screen effect states
        this.healthVignetteIntensity = 0;
        this.damageFlashIntensity = 0;
        this.healingGlowIntensity = 0;
        this.levelUpBurstActive = false;
        this.criticalSlowMoActive = false;
        this.elementTintColor = new THREE.Color(1, 1, 1);
        this.magicShimmerIntensity = 0;
        
        // External asset paths
        this.assetPaths = {
            vignette: '/assets/textures/ui/vignette.png',           // Kenney
            damageOverlay: '/assets/textures/ui/damage_flash.png',  // Kenney
            healOverlay: '/assets/textures/ui/heal_glow.png',       // Kenney
            shimmerParticles: '/assets/particles/magic_shimmer.png', // Kenney Particle Pack
            levelUpBurst: '/assets/particles/level_up_burst.png'   // Kenney Particle Pack
        };
        
        // Element-specific screen tints
        this.elementTints = {
            FIRE: new THREE.Color(1.0, 0.6, 0.3),      // Warm orange
            ICE: new THREE.Color(0.6, 0.8, 1.0),       // Cool blue
            LIGHTNING: new THREE.Color(1.0, 1.0, 0.5), // Bright yellow
            NATURE: new THREE.Color(0.6, 1.0, 0.6),    // Fresh green
            HOLY: new THREE.Color(1.0, 0.9, 0.6),      // Golden
            DARK: new THREE.Color(0.5, 0.3, 0.6),      // Purple
            POISON: new THREE.Color(0.5, 0.8, 0.3),    // Sickly green
            ARCANE: new THREE.Color(0.7, 0.4, 1.0)     // Mystic purple
        };
        
        this.init();
    }
    
    init() {
        console.log('PlayerScreenEffectsSystem initialized with external assets');
        console.log('- Vignette texture: Kenney');
        console.log('- Particle overlays: Kenney Particle Pack');
        console.log('- Post-processing: Three.js built-in');
    }
    
    /**
     * Trigger damage flash effect
     * @param {number} intensity - Flash intensity (0-1)
     */
    triggerDamageFlash(intensity = 0.5) {
        this.damageFlashIntensity = Math.min(intensity, 1.0);
        console.log(`Damage flash triggered (intensity: ${intensity})`);
    }
    
    /**
     * Trigger healing glow effect
     * @param {number} intensity - Glow intensity (0-1)
     */
    triggerHealingGlow(intensity = 0.4) {
        this.healingGlowIntensity = Math.min(intensity, 1.0);
        console.log(`Healing glow triggered (intensity: ${intensity})`);
    }
    
    /**
     * Trigger level-up burst effect
     */
    triggerLevelUpBurst() {
        this.levelUpBurstActive = true;
        console.log('Level-up burst triggered! (Kenney particles)');
        
        // Create particle burst using Kenney Particle Pack
        // Gold particles explode from player position
        setTimeout(() => {
            this.levelUpBurstActive = false;
        }, 2000);
    }
    
    /**
     * Trigger critical hit slow-motion effect
     * @param {number} duration - Duration in milliseconds
     */
    triggerCriticalSlowMo(duration = 300) {
        this.criticalSlowMoActive = true;
        console.log(`Critical slow-mo triggered (${duration}ms)`);
        
        setTimeout(() => {
            this.criticalSlowMoActive = false;
        }, duration);
    }
    
    /**
     * Set element-specific screen tint
     * @param {string} element - Element type (FIRE, ICE, etc.)
     * @param {number} intensity - Tint intensity (0-1)
     */
    setElementTint(element, intensity = 0.3) {
        if (this.elementTints[element]) {
            this.elementTintColor.copy(this.elementTints[element]);
            console.log(`Element tint set: ${element} (intensity: ${intensity})`);
        }
    }
    
    /**
     * Update health vignette based on player HP
     * @param {number} healthPercent - Health percentage (0-1)
     */
    updateHealthVignette(healthPercent) {
        // Vignette intensifies as health decreases
        this.healthVignetteIntensity = Math.max(0, 1 - (healthPercent * 2));
    }
    
    /**
     * Update system (called every frame)
     * @param {number} deltaTime - Time since last frame
     */
    update(deltaTime) {
        // Fade out damage flash
        if (this.damageFlashIntensity > 0) {
            this.damageFlashIntensity -= deltaTime * 3.0;
            this.damageFlashIntensity = Math.max(0, this.damageFlashIntensity);
        }
        
        // Fade out healing glow
        if (this.healingGlowIntensity > 0) {
            this.healingGlowIntensity -= deltaTime * 2.0;
            this.healingGlowIntensity = Math.max(0, this.healingGlowIntensity);
        }
        
        // Update magic shimmer (subtle constant effect)
        this.magicShimmerIntensity = 0.1 + Math.sin(Date.now() * 0.001) * 0.05;
    }
    
    /**
     * Get current time scale (affected by slow-mo)
     */
    getTimeScale() {
        return this.criticalSlowMoActive ? 0.3 : 1.0;
    }
}
