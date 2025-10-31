/**
import { logger } from '../core/Logger.js';
 * AnimeStyleRenderingSystem - Cel-shaded anime-inspired rendering
 * Provides stylized anime aesthetics with toon shading and outlines
 */

import * as THREE from 'three';

export class AnimeStyleRenderingSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.scene = gameEngine.scene;
        this.camera = gameEngine.camera;
        this.renderer = gameEngine.renderer;
        
        this.enabled = true;
        this.outlineEnabled = true;
        this.celShadingEnabled = true;
        
        this.settings = {
            outlineThickness: 0.03,
            outlineColor: 0x000000,
            celShades: 4, // Number of color bands
            rimLightStrength: 0.5,
            rimLightColor: 0xffffff,
            saturationBoost: 1.2,
            brightnessAdjust: 1.1
        };
        
        this.materialCache = new Map();
        
        this.init();
    }
    
    init() {
        this.setupCelShading();
        this.setupOutlines();
        
        logger.info('🎨 Anime Style Rendering System initialized');
    }
    
    setupCelShading() {
        // Create toon shader material
        this.toonShader = {
            vertexShader: `
                varying vec3 vNormal;
                varying vec3 vViewPosition;
                varying vec2 vUv;
                
                void main() {
                    vUv = uv;
                    vNormal = normalize(normalMatrix * normal);
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    vViewPosition = -mvPosition.xyz;
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                uniform vec3 color;
                uniform float celShades;
                uniform float rimLightStrength;
                uniform vec3 rimLightColor;
                uniform float saturationBoost;
                uniform float brightnessAdjust;
                
                varying vec3 vNormal;
                varying vec3 vViewPosition;
                varying vec2 vUv;
                
                void main() {
                    // Calculate lighting
                    vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
                    float NdotL = max(dot(vNormal, lightDir), 0.0);
                    
                    // Cel shading - posterize the lighting
                    float shade = floor(NdotL * celShades) / celShades;
                    shade = max(shade, 0.3); // Minimum brightness
                    
                    // Rim lighting for anime effect
                    vec3 viewDir = normalize(vViewPosition);
                    float rimDot = 1.0 - max(dot(viewDir, vNormal), 0.0);
                    float rimIntensity = pow(rimDot, 3.0) * rimLightStrength;
                    
                    // Apply cel shading
                    vec3 shadedColor = color * shade;
                    
                    // Add rim light
                    shadedColor += rimLightColor * rimIntensity;
                    
                    // Boost saturation for vibrant anime colors
                    vec3 gray = vec3(dot(shadedColor, vec3(0.299, 0.587, 0.114)));
                    shadedColor = mix(gray, shadedColor, saturationBoost);
                    
                    // Adjust brightness
                    shadedColor *= brightnessAdjust;
                    
                    gl_FragColor = vec4(shadedColor, 1.0);
                }
            `
        };
    }
    
    setupOutlines() {
        // Outline pass using inverted hull method
        this.outlineShader = {
            vertexShader: `
                uniform float outlineThickness;
                
                void main() {
                    vec3 offset = normalize(normal) * outlineThickness;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position + offset, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 outlineColor;
                
                void main() {
                    gl_FragColor = vec4(outlineColor, 1.0);
                }
            `
        };
    }
    
    createAnimeStyleMaterial(baseColor, options = {}) {
        const {
            celShades = this.settings.celShades,
            rimLightStrength = this.settings.rimLightStrength,
            rimLightColor = this.settings.rimLightColor,
            saturationBoost = this.settings.saturationBoost,
            brightnessAdjust = this.settings.brightnessAdjust
        } = options;
        
        const material = new THREE.ShaderMaterial({
            uniforms: {
                color: { value: new THREE.Color(baseColor) },
                celShades: { value: celShades },
                rimLightStrength: { value: rimLightStrength },
                rimLightColor: { value: new THREE.Color(rimLightColor) },
                saturationBoost: { value: saturationBoost },
                brightnessAdjust: { value: brightnessAdjust }
            },
            vertexShader: this.toonShader.vertexShader,
            fragmentShader: this.toonShader.fragmentShader
        });
        
        return material;
    }
    
    createOutlineMaterial() {
        return new THREE.ShaderMaterial({
            uniforms: {
                outlineThickness: { value: this.settings.outlineThickness },
                outlineColor: { value: new THREE.Color(this.settings.outlineColor) }
            },
            vertexShader: this.outlineShader.vertexShader,
            fragmentShader: this.outlineShader.fragmentShader,
            side: THREE.BackSide
        });
    }
    
    applyAnimeStyle(mesh, color) {
        if (!this.enabled) return;
        
        // Apply cel-shaded material
        if (this.celShadingEnabled) {
            const animeMaterial = this.createAnimeStyleMaterial(color);
            mesh.material = animeMaterial;
        }
        
        // Add outline
        if (this.outlineEnabled) {
            const outline = mesh.clone();
            outline.material = this.createOutlineMaterial();
            outline.scale.multiplyScalar(1.02);
            mesh.add(outline);
        }
    }
    
    createMagicalEffect(position, color, type = 'sparkle') {
        // Anime-style magical effects
        const particleCount = 30;
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];
        
        for (let i = 0; i < particleCount; i++) {
            // Star-shaped sparkle positions
            const angle = (i / particleCount) * Math.PI * 2;
            const distance = 0.5 + Math.random() * 0.5;
            
            positions.push(
                position.x + Math.cos(angle) * distance,
                position.y + Math.random() * 1.5,
                position.z + Math.sin(angle) * distance
            );
            
            const c = new THREE.Color(color);
            colors.push(c.r * 1.5, c.g * 1.5, c.b * 1.5); // Bright colors
        }
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.3,
            vertexColors: true,
            transparent: true,
            opacity: 1.0,
            blending: THREE.AdditiveBlending,
            map: this.createStarTexture()
        });
        
        const particles = new THREE.Points(geometry, material);
        this.scene.add(particles);
        
        // Animate and fade out
        const duration = 1.5;
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = (Date.now() - startTime) / 1000;
            if (elapsed < duration) {
                material.opacity = 1 - (elapsed / duration);
                
                // Rotate for magical effect
                particles.rotation.y += 0.05;
                
                requestAnimationFrame(animate);
            } else {
                this.scene.remove(particles);
                if (geometry) geometry.dispose();
                if (material) material.dispose();
            }
        };
        
        animate();
    }
    
    createStarTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        // Draw star shape
        ctx.fillStyle = 'white';
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
            const x = 32 + Math.cos(angle) * 30;
            const y = 32 + Math.sin(angle) * 30;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        
        const texture = new THREE.CanvasTexture(canvas);
        return texture;
    }
    
    createAnimeCharacterMaterial(skinTone = 0xffdbac) {
        // Special material for anime characters
        return this.createAnimeStyleMaterial(skinTone, {
            celShades: 3,
            rimLightStrength: 0.8,
            saturationBoost: 1.3,
            brightnessAdjust: 1.2
        });
    }
    
    applyGlowEffect(mesh, glowColor = 0x00ffff) {
        // Anime-style glow effect
        const glowMaterial = new THREE.ShaderMaterial({
            uniforms: {
                glowColor: { value: new THREE.Color(glowColor) },
                intensity: { value: 1.0 }
            },
            vertexShader: `
                varying vec3 vNormal;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 glowColor;
                uniform float intensity;
                varying vec3 vNormal;
                
                void main() {
                    float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0);
                    gl_FragColor = vec4(glowColor, fresnel * intensity);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            side: THREE.BackSide
        });
        
        const glow = mesh.clone();
        glow.material = glowMaterial;
        glow.scale.multiplyScalar(1.1);
        mesh.add(glow);
    }
    
    setQuality(quality) {
        switch (quality) {
            case 'low':
                this.settings.celShades = 3;
                this.outlineEnabled = false;
                break;
            case 'medium':
                this.settings.celShades = 4;
                this.outlineEnabled = true;
                this.settings.outlineThickness = 0.02;
                break;
            case 'high':
                this.settings.celShades = 5;
                this.outlineEnabled = true;
                this.settings.outlineThickness = 0.03;
                break;
            case 'ultra':
                this.settings.celShades = 6;
                this.outlineEnabled = true;
                this.settings.outlineThickness = 0.04;
                break;
        }
        
        logger.info(`🎨 Anime rendering quality: ${quality}`);
    }
    
    update(deltaTime) {
        // Update animated effects
    }
    
    dispose() {
        this.materialCache.forEach(material => {
            if (material.dispose) material.dispose();
        });
        this.materialCache.clear();
        
        logger.info('🎨 Anime Style Rendering System disposed');
    }
}
