/**
 * VolumetricLightingSystem - AAA-grade volumetric lighting and god rays
 * Provides cinematic lighting effects for immersive atmosphere
 */

import * as THREE from 'three';

export class VolumetricLightingSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.scene = gameEngine.scene;
        this.camera = gameEngine.camera;
        this.renderer = gameEngine.renderer;
        
        this.volumetricLights = [];
        this.godRays = [];
        
        this.settings = {
            enabled: true,
            quality: 'high', // low, medium, high, ultra
            samples: 100,
            decay: 0.95,
            density: 0.5,
            weight: 0.4,
            exposure: 0.6
        };
        
        this.init();
    }
    
    init() {
        this.setupVolumetricFog();
        this.createGodRays();
        this.setupLightShafts();
        
        console.log('☀️ Volumetric Lighting System initialized');
    }
    
    setupVolumetricFog() {
        // Enhanced fog with depth and color variation
        this.scene.fog = new THREE.FogExp2(0x1a2847, 0.001);
        
        // Add volumetric fog shader
        this.fogMaterial = new THREE.ShaderMaterial({
            uniforms: {
                fogColor: { value: new THREE.Color(0x1a2847) },
                fogDensity: { value: 0.001 },
                fogHeight: { value: 50.0 },
                time: { value: 0.0 }
            },
            vertexShader: `
                varying vec3 vWorldPosition;
                varying float vHeight;
                
                void main() {
                    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                    vWorldPosition = worldPosition.xyz;
                    vHeight = worldPosition.y;
                    gl_Position = projectionMatrix * viewMatrix * worldPosition;
                }
            `,
            fragmentShader: `
                uniform vec3 fogColor;
                uniform float fogDensity;
                uniform float fogHeight;
                uniform float time;
                
                varying vec3 vWorldPosition;
                varying float vHeight;
                
                void main() {
                    float depth = gl_FragCoord.z / gl_FragCoord.w;
                    float heightFactor = exp(-max(0.0, vHeight - fogHeight) * 0.05);
                    float fogFactor = 1.0 - exp(-fogDensity * depth * heightFactor);
                    
                    // Add animated noise for moving fog
                    float noise = sin(vWorldPosition.x * 0.1 + time) * 
                                 cos(vWorldPosition.z * 0.1 + time * 0.5) * 0.1;
                    fogFactor += noise * heightFactor;
                    
                    gl_FragColor = vec4(fogColor, clamp(fogFactor, 0.0, 1.0));
                }
            `,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });
    }
    
    createGodRays() {
        // Create god ray effect from sun
        const rayCount = 8;
        const rayGeometry = new THREE.PlaneGeometry(2, 100);
        
        for (let i = 0; i < rayCount; i++) {
            const angle = (i / rayCount) * Math.PI * 2;
            
            const rayMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    sunColor: { value: new THREE.Color(0xffeeaa) },
                    opacity: { value: 0.1 },
                    time: { value: 0.0 },
                    offset: { value: i * 0.5 }
                },
                vertexShader: `
                    varying vec2 vUv;
                    
                    void main() {
                        vUv = uv;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform vec3 sunColor;
                    uniform float opacity;
                    uniform float time;
                    uniform float offset;
                    
                    varying vec2 vUv;
                    
                    void main() {
                        float dist = abs(vUv.x - 0.5);
                        float alpha = (1.0 - dist * 2.0) * opacity;
                        
                        // Animate intensity
                        alpha *= 0.7 + 0.3 * sin(time * 2.0 + offset);
                        
                        // Fade with distance
                        alpha *= (1.0 - vUv.y * 0.5);
                        
                        gl_FragColor = vec4(sunColor, alpha);
                    }
                `,
                transparent: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
                side: THREE.DoubleSide
            });
            
            const ray = new THREE.Mesh(rayGeometry, rayMaterial);
            ray.rotation.y = angle;
            ray.position.y = 50;
            
            this.godRays.push(ray);
            this.scene.add(ray);
        }
    }
    
    setupLightShafts() {
        // Create light shafts from point lights
        this.lightShaftMaterial = new THREE.ShaderMaterial({
            uniforms: {
                lightPosition: { value: new THREE.Vector3(0, 10, 0) },
                lightColor: { value: new THREE.Color(0xffffff) },
                intensity: { value: 1.0 },
                coneAngle: { value: Math.PI / 4 },
                time: { value: 0.0 }
            },
            vertexShader: `
                varying vec3 vWorldPosition;
                varying vec3 vNormal;
                
                void main() {
                    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
                    vNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
                    gl_Position = projectionMatrix * viewMatrix * vec4(vWorldPosition, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 lightPosition;
                uniform vec3 lightColor;
                uniform float intensity;
                uniform float coneAngle;
                uniform float time;
                
                varying vec3 vWorldPosition;
                varying vec3 vNormal;
                
                void main() {
                    vec3 lightDir = normalize(lightPosition - vWorldPosition);
                    float dist = length(lightPosition - vWorldPosition);
                    
                    // Cone falloff
                    float angle = acos(dot(lightDir, vec3(0, -1, 0)));
                    float coneFalloff = smoothstep(coneAngle, 0.0, angle);
                    
                    // Distance falloff
                    float distFalloff = 1.0 / (1.0 + dist * 0.1);
                    
                    // Add noise for volumetric effect
                    float noise = sin(vWorldPosition.x * 5.0 + time) * 
                                 cos(vWorldPosition.z * 5.0 + time * 0.7) * 0.1;
                    
                    float alpha = intensity * coneFalloff * distFalloff * (0.3 + noise);
                    
                    gl_FragColor = vec4(lightColor, alpha);
                }
            `,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });
    }
    
    addVolumetricLight(position, color = 0xffffff, intensity = 1.0, radius = 10) {
        const light = {
            position: position.clone(),
            color: new THREE.Color(color),
            intensity,
            radius,
            mesh: null
        };
        
        // Create visible light shaft geometry
        const shaftGeometry = new THREE.CylinderGeometry(
            0,
            radius,
            radius * 2,
            16,
            1,
            true
        );
        
        const shaftMaterial = this.lightShaftMaterial.clone();
        shaftMaterial.uniforms.lightPosition.value = position.clone();
        shaftMaterial.uniforms.lightColor.value = new THREE.Color(color);
        shaftMaterial.uniforms.intensity.value = intensity * 0.5;
        
        const shaft = new THREE.Mesh(shaftGeometry, shaftMaterial);
        shaft.position.copy(position);
        shaft.position.y -= radius;
        
        this.scene.add(shaft);
        light.mesh = shaft;
        
        this.volumetricLights.push(light);
        
        return light;
    }
    
    removeVolumetricLight(light) {
        const index = this.volumetricLights.indexOf(light);
        if (index !== -1) {
            this.volumetricLights.splice(index, 1);
            
            if (light.mesh) {
                this.scene.remove(light.mesh);
                if (light.mesh.geometry) light.mesh.geometry.dispose();
                if (light.mesh.material) light.mesh.material.dispose();
            }
        }
    }
    
    setGodRaysIntensity(intensity) {
        this.godRays.forEach(ray => {
            ray.material.uniforms.opacity.value = intensity * 0.1;
        });
    }
    
    setGodRaysColor(color) {
        const c = new THREE.Color(color);
        this.godRays.forEach(ray => {
            ray.material.uniforms.sunColor.value = c;
        });
    }
    
    updateGodRaysPosition(sunPosition) {
        this.godRays.forEach(ray => {
            ray.position.copy(sunPosition);
            ray.lookAt(this.camera.position);
        });
    }
    
    setQuality(quality) {
        this.settings.quality = quality;
        
        switch (quality) {
            case 'low':
                this.settings.samples = 50;
                this.settings.decay = 0.9;
                this.settings.density = 0.3;
                break;
            case 'medium':
                this.settings.samples = 75;
                this.settings.decay = 0.93;
                this.settings.density = 0.4;
                break;
            case 'high':
                this.settings.samples = 100;
                this.settings.decay = 0.95;
                this.settings.density = 0.5;
                break;
            case 'ultra':
                this.settings.samples = 150;
                this.settings.decay = 0.97;
                this.settings.density = 0.6;
                break;
        }
        
        console.log(`☀️ Volumetric lighting quality set to: ${quality}`);
    }
    
    update(deltaTime) {
        if (!this.settings.enabled) return;
        
        const time = Date.now() * 0.001;
        
        // Update god rays
        this.godRays.forEach(ray => {
            ray.material.uniforms.time.value = time;
        });
        
        // Update volumetric lights
        this.volumetricLights.forEach(light => {
            if (light.mesh && light.mesh.material.uniforms) {
                light.mesh.material.uniforms.time.value = time;
            }
        });
        
        // Update fog material
        if (this.fogMaterial) {
            this.fogMaterial.uniforms.time.value = time;
        }
        
        // Update god rays position based on day/night cycle
        if (this.gameEngine.dayNightCycleSystem && this.gameEngine.dayNightCycleSystem.sunLight) {
            const sunPos = this.gameEngine.dayNightCycleSystem.sunLight.position.clone();
            this.updateGodRaysPosition(sunPos);
            
            // Adjust god rays intensity based on sun height
            const sunHeight = sunPos.y;
            const intensity = Math.max(0, sunHeight / 200);
            this.setGodRaysIntensity(intensity);
        }
    }
    
    dispose() {
        // Remove all volumetric lights
        this.volumetricLights.forEach(light => {
            this.removeVolumetricLight(light);
        });
        
        // Remove god rays
        this.godRays.forEach(ray => {
            this.scene.remove(ray);
            if (ray.geometry) ray.geometry.dispose();
            if (ray.material) ray.material.dispose();
        });
        
        console.log('☀️ Volumetric Lighting System disposed');
    }
}
