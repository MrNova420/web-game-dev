/**
import { logger } from '../core/Logger.js';
 * Psychedelic Cel-Shading System
 * Combines anime-style cel-shading with psychedelic cannabis theme effects
 * Phase 1, Session 1.1 of ULTIMATE_AUTONOMOUS_ROADMAP.md
 */

import * as THREE from 'three';

export class PsychedelicCelShadingSystem {
    constructor(scene, renderer) {
        this.scene = scene;
        this.renderer = renderer;
        
        // Cannabis theme colors (vibrant anime-style fantasy colors)
        this.cannabisColors = {
            purple: new THREE.Color(0xff00ff),      // Bright magenta
            lightPurple: new THREE.Color(0xff66ff), // Vibrant light purple
            pink: new THREE.Color(0xff1493),        // Deep pink
            cyan: new THREE.Color(0x00ffff),        // Bright cyan
            yellow: new THREE.Color(0xffff00),      // Bright yellow
            green: new THREE.Color(0x00ff00),       // Bright green
            orange: new THREE.Color(0xff6600),      // Vibrant orange
            red: new THREE.Color(0xff0066)          // Bright red
        };
        
        // Psychedelic state
        this.tripLevel = 0.0; // 0-1, increases with herb power
        this.time = 0.0;
        
        // Material cache
        this.celMaterials = new Map();
        
        this.init();
    }
    
    init() {
        logger.info('🎨 Initializing Psychedelic Cel-Shading System...');
        this.createToonShaders();
        logger.info('✅ Psychedelic Cel-Shading System initialized');
    }
    
    /**
     * Create custom toon shader materials with psychedelic effects
     */
    createToonShaders() {
        // Vertex shader for cel-shading
        const vertexShader = `
            varying vec3 vNormal;
            varying vec3 vViewPosition;
            varying vec3 vWorldPosition;
            
            void main() {
                // Transform normal to view space
                vNormal = normalize(normalMatrix * normal);
                
                // Calculate view position
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                vViewPosition = -mvPosition.xyz;
                
                // World position for psychedelic effects
                vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
                
                gl_Position = projectionMatrix * mvPosition;
            }
        `;
        
        // Fragment shader with cel-shading + psychedelic effects
        const fragmentShader = `
            uniform vec3 lightDirection;
            uniform vec3 baseColor;
            uniform vec3 shadowColor;
            uniform vec3 highlightColor;
            uniform vec3 smokeColor;
            
            // Psychedelic uniforms
            uniform float time;
            uniform float tripLevel;
            uniform float waveAmplitude;
            uniform float colorShiftSpeed;
            
            // Cel-shading parameters
            uniform int toonSteps;
            uniform float outlineThickness;
            
            varying vec3 vNormal;
            varying vec3 vViewPosition;
            varying vec3 vWorldPosition;
            
            void main() {
                // Calculate lighting
                vec3 normal = normalize(vNormal);
                vec3 lightDir = normalize(lightDirection);
                float NdotL = dot(normal, lightDir);
                
                // Psychedelic color shift
                vec3 tripColor = vec3(
                    sin(time * colorShiftSpeed + vWorldPosition.x * 2.0) * 0.5 + 0.5,
                    sin(time * colorShiftSpeed + vWorldPosition.y * 2.0 + 2.0) * 0.5 + 0.5,
                    sin(time * colorShiftSpeed + vWorldPosition.z * 2.0 + 4.0) * 0.5 + 0.5
                );
                
                // Mix base color with psychedelic effect
                vec3 psychedelicBase = mix(baseColor, tripColor, tripLevel * 0.3);
                
                // 3-tone cel shading
                vec3 celColor;
                if (NdotL > 0.8) {
                    // Highlight
                    celColor = mix(highlightColor, tripColor, tripLevel * 0.2);
                } else if (NdotL > 0.3) {
                    // Mid-tone
                    celColor = psychedelicBase;
                } else {
                    // Shadow
                    celColor = mix(shadowColor, tripColor * 0.5, tripLevel * 0.15);
                }
                
                // Rim lighting (anime-style)
                vec3 viewDir = normalize(vViewPosition);
                float rim = 1.0 - max(dot(viewDir, normal), 0.0);
                rim = pow(rim, 3.0);
                vec3 rimColor = smokeColor * rim * (1.0 + tripLevel);
                
                // Fresnel effect for edges
                float fresnel = pow(1.0 - abs(dot(viewDir, normal)), 2.0);
                vec3 fresnelColor = smokeColor * fresnel * 0.3;
                
                // Combine all effects
                vec3 finalColor = celColor + rimColor + fresnelColor;
                
                // Add glow based on trip level
                finalColor += smokeColor * tripLevel * 0.2;
                
                gl_FragColor = vec4(finalColor, 1.0);
            }
        `;
        
        // Create base cel-shaded material
        this.baseCelMaterial = new THREE.ShaderMaterial({
            uniforms: {
                lightDirection: { value: new THREE.Vector3(0.5, 1.0, 0.5).normalize() },
                baseColor: { value: this.cannabisColors.purple },
                shadowColor: { value: new THREE.Color(0x4a0e7a) },
                highlightColor: { value: this.cannabisColors.pink },
                smokeColor: { value: this.cannabisColors.lightPurple },
                time: { value: 0.0 },
                tripLevel: { value: 0.0 },
                waveAmplitude: { value: 0.1 },
                colorShiftSpeed: { value: 1.0 },
                toonSteps: { value: 3 },
                outlineThickness: { value: 0.05 }
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            side: THREE.FrontSide
        });
    }
    
    /**
     * Create cel-shaded material for an object with custom colors
     */
    createCelMaterial(baseColor, options = {}) {
        const material = this.baseCelMaterial.clone();
        
        material.uniforms.baseColor.value = new THREE.Color(baseColor);
        
        // Custom shadow color (darker version)
        const shadowColor = new THREE.Color(baseColor).multiplyScalar(0.4);
        material.uniforms.shadowColor.value = shadowColor;
        
        // Custom highlight color (brighter version)
        const highlightColor = new THREE.Color(baseColor).multiplyScalar(1.3);
        material.uniforms.highlightColor.value = highlightColor;
        
        // Apply options
        if (options.smokeColor) {
            material.uniforms.smokeColor.value = new THREE.Color(options.smokeColor);
        }
        if (options.tripLevel !== undefined) {
            material.uniforms.tripLevel.value = options.tripLevel;
        }
        if (options.colorShiftSpeed !== undefined) {
            material.uniforms.colorShiftSpeed.value = options.colorShiftSpeed;
        }
        
        return material;
    }
    
    /**
     * Apply cel-shading to a mesh or group
     */
    applyCelShading(object, baseColor = 0x9d4edd, options = {}) {
        if (object.isMesh) {
            const celMaterial = this.createCelMaterial(baseColor, options);
            object.material = celMaterial;
            this.celMaterials.set(object.uuid, celMaterial);
        } else if (object.children) {
            object.traverse((child) => {
                if (child.isMesh) {
                    const celMaterial = this.createCelMaterial(baseColor, options);
                    child.material = celMaterial;
                    this.celMaterials.set(child.uuid, celMaterial);
                }
            });
        }
    }
    
    /**
     * Create outline effect for objects (anime-style)
     */
    createOutline(object, thickness = 0.05, color = 0x000000) {
        if (!object.isMesh) return null;
        
        // Create outline mesh
        const outlineMaterial = new THREE.MeshBasicMaterial({
            color: color,
            side: THREE.BackSide
        });
        
        const outlineMesh = new THREE.Mesh(
            object.geometry,
            outlineMaterial
        );
        
        // Scale slightly larger for outline effect
        outlineMesh.scale.multiplyScalar(1 + thickness);
        outlineMesh.renderOrder = object.renderOrder - 1;
        
        return outlineMesh;
    }
    
    /**
     * Apply outline to object and add to scene
     */
    applyOutline(object, thickness = 0.03, color = 0x000000) {
        if (object.isMesh) {
            const outline = this.createOutline(object, thickness, color);
            if (outline) {
                object.add(outline);
            }
        } else if (object.children) {
            object.traverse((child) => {
                if (child.isMesh) {
                    const outline = this.createOutline(child, thickness, color);
                    if (outline) {
                        child.add(outline);
                    }
                }
            });
        }
    }
    
    /**
     * Update psychedelic effects
     */
    update(deltaTime) {
        this.time += deltaTime;
        
        // Update all cel-shaded materials with current time and trip level
        for (const material of this.celMaterials.values()) {
            if (material.uniforms) {
                material.uniforms.time.value = this.time;
                material.uniforms.tripLevel.value = this.tripLevel;
            }
        }
    }
    
    /**
     * Set trip level (0-1)
     * Higher levels = more psychedelic effects
     */
    setTripLevel(level) {
        this.tripLevel = Math.max(0, Math.min(1, level));
    }
    
    /**
     * Increase trip level (when consuming herbs)
     */
    increaseTripLevel(amount) {
        this.setTripLevel(this.tripLevel + amount);
    }
    
    /**
     * Decrease trip level (over time)
     */
    decreaseTripLevel(amount) {
        this.setTripLevel(this.tripLevel - amount);
    }
    
    /**
     * Get current trip level
     */
    getTripLevel() {
        return this.tripLevel;
    }
    
    /**
     * Apply cannabis theme to player
     */
    applyPlayerTheme(playerMesh) {
        this.applyCelShading(playerMesh, this.cannabisColors.purple, {
            smokeColor: this.cannabisColors.lightPurple,
            tripLevel: this.tripLevel,
            colorShiftSpeed: 0.5
        });
        this.applyOutline(playerMesh, 0.03, 0x000000);
    }
    
    /**
     * Apply theme to enemy
     */
    applyEnemyTheme(enemyMesh, enemyColor = 0xff4444) {
        this.applyCelShading(enemyMesh, enemyColor, {
            smokeColor: 0xff8888,
            tripLevel: this.tripLevel * 0.5,
            colorShiftSpeed: 0.3
        });
        this.applyOutline(enemyMesh, 0.025, 0x000000);
    }
    
    /**
     * Apply theme to environment objects
     */
    applyEnvironmentTheme(objectMesh, objectColor = 0x44ff44) {
        this.applyCelShading(objectMesh, objectColor, {
            smokeColor: this.cannabisColors.cyan,
            tripLevel: this.tripLevel * 0.7,
            colorShiftSpeed: 0.2
        });
    }
    
    /**
     * Dispose of resources
     */
    dispose() {
        // Dispose all cel materials
        for (const material of this.celMaterials.values()) {
            material.dispose();
        }
        this.celMaterials.clear();
        
        if (this.baseCelMaterial) {
            this.baseCelMaterial.dispose();
        }
    }
}
