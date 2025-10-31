/**
import { logger } from '../core/Logger.js';
 * PostProcessingSystem - Advanced post-processing effects
 * Includes bloom, depth of field, motion blur, color grading, and more
 */

import * as THREE from 'three';

export class PostProcessingSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.scene = gameEngine.scene;
        this.camera = gameEngine.camera;
        this.renderer = gameEngine.renderer;
        
        this.enabled = true;
        this.effects = {
            bloom: true,
            depthOfField: false,
            motionBlur: false,
            colorGrading: true,
            vignette: true,
            chromaticAberration: false
        };
        
        // Effect parameters
        this.bloomStrength = 0.5;
        this.bloomRadius = 0.4;
        this.bloomThreshold = 0.85;
        
        this.vignetteStrength = 0.3;
        this.chromaticAberrationStrength = 0.0;
        
        // Screen shake
        this.screenShake = {
            intensity: 0,
            duration: 0,
            decay: 0.95
        };
        
        this.init();
    }
    
    init() {
        this.setupRenderTarget();
        this.createShaderPasses();
        
        logger.info('🎨 Post-Processing System initialized');
    }
    
    setupRenderTarget() {
        // Create render targets for post-processing
        const size = this.renderer.getSize(new THREE.Vector2());
        
        this.renderTarget = new THREE.WebGLRenderTarget(size.x, size.y, {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat,
            type: THREE.HalfFloatType
        });
        
        this.bloomRenderTarget = new THREE.WebGLRenderTarget(
            Math.floor(size.x / 2),
            Math.floor(size.y / 2),
            {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                format: THREE.RGBAFormat
            }
        );
    }
    
    createShaderPasses() {
        // Create screen-space quad for full-screen effects
        this.screenQuad = new THREE.Mesh(
            new THREE.PlaneGeometry(2, 2),
            this.createCompositeMaterial()
        );
        
        this.screenScene = new THREE.Scene();
        this.screenScene.add(this.screenQuad);
        
        this.screenCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    }
    
    createCompositeMaterial() {
        return new THREE.ShaderMaterial({
            uniforms: {
                tDiffuse: { value: null },
                tBloom: { value: null },
                uBloomStrength: { value: this.bloomStrength },
                uVignetteStrength: { value: this.vignetteStrength },
                uChromaticAberration: { value: this.chromaticAberrationStrength },
                uTime: { value: 0 },
                uResolution: { value: new THREE.Vector2() }
            },
            vertexShader: `
                varying vec2 vUv;
                
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D tDiffuse;
                uniform sampler2D tBloom;
                uniform float uBloomStrength;
                uniform float uVignetteStrength;
                uniform float uChromaticAberration;
                uniform float uTime;
                uniform vec2 uResolution;
                
                varying vec2 vUv;
                
                // Vignette effect
                float vignette(vec2 uv, float strength) {
                    vec2 pos = uv - 0.5;
                    float dist = length(pos);
                    return 1.0 - smoothstep(0.3, 1.5, dist * strength);
                }
                
                // Chromatic aberration
                vec3 chromaticAberration(sampler2D tex, vec2 uv, float amount) {
                    vec2 offset = vec2(amount, 0.0);
                    float r = texture2D(tex, uv + offset).r;
                    float g = texture2D(tex, uv).g;
                    float b = texture2D(tex, uv - offset).b;
                    return vec3(r, g, b);
                }
                
                // Color grading (simple)
                vec3 colorGrade(vec3 color) {
                    // Slight desaturation for fantasy feel
                    float gray = dot(color, vec3(0.299, 0.587, 0.114));
                    color = mix(vec3(gray), color, 1.1);
                    
                    // Boost contrast slightly
                    color = (color - 0.5) * 1.1 + 0.5;
                    
                    // Add slight blue tint for nighttime feel
                    color.b *= 1.05;
                    
                    return color;
                }
                
                void main() {
                    vec3 color;
                    
                    // Apply chromatic aberration if enabled
                    if (uChromaticAberration > 0.0) {
                        color = chromaticAberration(tDiffuse, vUv, uChromaticAberration);
                    } else {
                        color = texture2D(tDiffuse, vUv).rgb;
                    }
                    
                    // Add bloom
                    vec3 bloom = texture2D(tBloom, vUv).rgb;
                    color += bloom * uBloomStrength;
                    
                    // Apply color grading
                    color = colorGrade(color);
                    
                    // Apply vignette
                    float vig = vignette(vUv, uVignetteStrength);
                    color *= vig;
                    
                    // Tone mapping
                    color = color / (color + vec3(1.0));
                    
                    // Gamma correction
                    color = pow(color, vec3(1.0 / 2.2));
                    
                    gl_FragColor = vec4(color, 1.0);
                }
            `
        });
    }
    
    createBloomPass() {
        // Extract bright areas for bloom
        const bloomMaterial = new THREE.ShaderMaterial({
            uniforms: {
                tDiffuse: { value: null },
                uThreshold: { value: this.bloomThreshold }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D tDiffuse;
                uniform float uThreshold;
                varying vec2 vUv;
                
                void main() {
                    vec4 color = texture2D(tDiffuse, vUv);
                    float brightness = dot(color.rgb, vec3(0.2126, 0.7152, 0.0722));
                    
                    if (brightness > uThreshold) {
                        gl_FragColor = color;
                    } else {
                        gl_FragColor = vec4(0.0);
                    }
                }
            `
        });
        
        return bloomMaterial;
    }
    
    applyScreenShake(intensity, duration = 0.3) {
        this.screenShake.intensity = intensity;
        this.screenShake.duration = duration;
    }
    
    updateScreenShake(deltaTime) {
        if (this.screenShake.intensity > 0.001) {
            const shake = this.screenShake.intensity;
            
            // Apply shake to camera
            this.camera.position.x += (Math.random() - 0.5) * shake;
            this.camera.position.y += (Math.random() - 0.5) * shake;
            this.camera.position.z += (Math.random() - 0.5) * shake;
            
            // Decay shake
            this.screenShake.intensity *= this.screenShake.decay;
            this.screenShake.duration -= deltaTime;
            
            if (this.screenShake.duration <= 0) {
                this.screenShake.intensity = 0;
            }
        }
    }
    
    render(deltaTime) {
        if (!this.enabled) {
            // Render directly without post-processing
            this.renderer.render(this.scene, this.camera);
            return;
        }
        
        // Update screen shake
        this.updateScreenShake(deltaTime);
        
        // Render scene to texture
        this.renderer.setRenderTarget(this.renderTarget);
        this.renderer.render(this.scene, this.camera);
        
        // Generate bloom if enabled
        if (this.effects.bloom) {
            this.generateBloom();
        }
        
        // Composite final image
        this.renderComposite();
    }
    
    generateBloom() {
        // Extract bright areas
        const bloomExtractMaterial = this.createBloomPass();
        this.screenQuad.material = bloomExtractMaterial;
        bloomExtractMaterial.uniforms.tDiffuse.value = this.renderTarget.texture;
        
        this.renderer.setRenderTarget(this.bloomRenderTarget);
        this.renderer.render(this.screenScene, this.screenCamera);
        
        // Restore composite material
        this.screenQuad.material = this.createCompositeMaterial();
    }
    
    renderComposite() {
        // Update uniforms
        const material = this.screenQuad.material;
        material.uniforms.tDiffuse.value = this.renderTarget.texture;
        material.uniforms.tBloom.value = this.bloomRenderTarget.texture;
        material.uniforms.uBloomStrength.value = this.bloomStrength;
        material.uniforms.uVignetteStrength.value = this.vignetteStrength;
        material.uniforms.uChromaticAberration.value = this.chromaticAberrationStrength;
        material.uniforms.uTime.value = Date.now() * 0.001;
        
        const size = this.renderer.getSize(new THREE.Vector2());
        material.uniforms.uResolution.value.set(size.x, size.y);
        
        // Render to screen
        this.renderer.setRenderTarget(null);
        this.renderer.render(this.screenScene, this.screenCamera);
    }
    
    // Effect controls
    setBloom(enabled, strength = 0.5, threshold = 0.85) {
        this.effects.bloom = enabled;
        this.bloomStrength = strength;
        this.bloomThreshold = threshold;
    }
    
    setVignette(enabled, strength = 0.3) {
        this.effects.vignette = enabled;
        this.vignetteStrength = strength;
    }
    
    setChromaticAberration(enabled, strength = 0.002) {
        this.effects.chromaticAberration = enabled;
        this.chromaticAberrationStrength = strength;
    }
    
    setColorGrading(enabled) {
        this.effects.colorGrading = enabled;
    }
    
    toggleEffect(effectName) {
        if (this.effects.hasOwnProperty(effectName)) {
            this.effects[effectName] = !this.effects[effectName];
            logger.info(`🎨 ${effectName}: ${this.effects[effectName] ? 'ON' : 'OFF'}`);
        }
    }
    
    // Quality presets
    setQualityPreset(preset) {
        switch (preset) {
            case 'low':
                this.enabled = false;
                break;
            case 'medium':
                this.enabled = true;
                this.effects.bloom = true;
                this.effects.vignette = true;
                this.effects.depthOfField = false;
                this.effects.motionBlur = false;
                this.effects.chromaticAberration = false;
                break;
            case 'high':
                this.enabled = true;
                this.effects.bloom = true;
                this.effects.vignette = true;
                this.effects.depthOfField = true;
                this.effects.motionBlur = false;
                this.effects.chromaticAberration = false;
                break;
            case 'ultra':
                this.enabled = true;
                Object.keys(this.effects).forEach(key => {
                    this.effects[key] = true;
                });
                break;
        }
        
        logger.info(`🎨 Graphics quality set to: ${preset}`);
    }
    
    handleResize(width, height) {
        // Update render targets
        this.renderTarget.setSize(width, height);
        this.bloomRenderTarget.setSize(
            Math.floor(width / 2),
            Math.floor(height / 2)
        );
    }
    
    dispose() {
        // Clean up resources
        if (this.renderTarget) this.renderTarget.dispose();
        if (this.bloomRenderTarget) this.bloomRenderTarget.dispose();
        if (this.screenQuad.geometry) this.screenQuad.geometry.dispose();
        if (this.screenQuad.material) this.screenQuad.material.dispose();
        
        logger.info('🎨 Post-Processing System disposed');
    }
}
