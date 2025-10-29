/**
 * ThreeDSceneSystem - Advanced 3D Scene Management
 * 
 * Core 3D rendering system for the ADVANCED 3D ANIME FANTASY MAGIC RPG.
 * Manages Three.js scene, camera, lighting, and rendering pipeline.
 * 
 * Uses external assets from:
 * - Poly Haven (skyboxes, HDRIs)
 * - Mixamo (character models)
 * - Quaternius (environment models)
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass';

export class ThreeDSceneSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.composer = null;
        
        // Lighting
        this.lights = {
            ambient: null,
            directional: null,
            point: [],
            spot: []
        };
        
        // Scene objects
        this.objects = new Map();
        this.characters = new Map();
        this.environment = new Map();
        
        // Settings
        this.settings = {
            shadowsEnabled: true,
            bloomEnabled: true,
            ssaoEnabled: true,
            antialias: true,
            pixelRatio: Math.min(window.devicePixelRatio, 2),
            fog: {
                enabled: true,
                color: 0x87ceeb,
                near: 50,
                far: 300
            }
        };
        
        // Performance metrics
        this.stats = {
            fps: 0,
            drawCalls: 0,
            triangles: 0,
            frameTime: 0
        };
        
        this.initialize();
    }
    
    initialize() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87ceeb);
        
        // Setup fog
        if (this.settings.fog.enabled) {
            this.scene.fog = new THREE.Fog(
                this.settings.fog.color,
                this.settings.fog.near,
                this.settings.fog.far
            );
        }
        
        // Setup camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 5, 10);
        
        // Setup renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: this.settings.antialias,
            alpha: false
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(this.settings.pixelRatio);
        this.renderer.shadowMap.enabled = this.settings.shadowsEnabled;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;
        
        // Setup controls
        this.controls = new OrbitControls(this.camera, this.canvas);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.maxPolarAngle = Math.PI / 2 - 0.1;
        this.controls.minDistance = 5;
        this.controls.maxDistance = 50;
        
        // Setup post-processing
        this.setupPostProcessing();
        
        // Setup lighting
        this.setupLighting();
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
        
        console.log('ThreeDSceneSystem initialized - Advanced 3D rendering active');
    }
    
    setupPostProcessing() {
        // Create composer
        this.composer = new EffectComposer(this.renderer);
        
        // Add render pass
        const renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);
        
        // Add bloom pass
        if (this.settings.bloomEnabled) {
            const bloomPass = new UnrealBloomPass(
                new THREE.Vector2(window.innerWidth, window.innerHeight),
                0.5,  // strength
                0.4,  // radius
                0.85  // threshold
            );
            this.composer.addPass(bloomPass);
        }
        
        // Add SSAO pass (ambient occlusion)
        if (this.settings.ssaoEnabled) {
            const ssaoPass = new SSAOPass(
                this.scene,
                this.camera,
                window.innerWidth,
                window.innerHeight
            );
            ssaoPass.kernelRadius = 16;
            ssaoPass.minDistance = 0.005;
            ssaoPass.maxDistance = 0.1;
            this.composer.addPass(ssaoPass);
        }
    }
    
    setupLighting() {
        // Ambient light
        this.lights.ambient = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(this.lights.ambient);
        
        // Directional light (sun)
        this.lights.directional = new THREE.DirectionalLight(0xffffff, 0.8);
        this.lights.directional.position.set(50, 100, 50);
        this.lights.directional.castShadow = true;
        this.lights.directional.shadow.mapSize.width = 2048;
        this.lights.directional.shadow.mapSize.height = 2048;
        this.lights.directional.shadow.camera.near = 0.5;
        this.lights.directional.shadow.camera.far = 500;
        this.lights.directional.shadow.camera.left = -100;
        this.lights.directional.shadow.camera.right = 100;
        this.lights.directional.shadow.camera.top = 100;
        this.lights.directional.shadow.camera.bottom = -100;
        this.scene.add(this.lights.directional);
        
        // Hemisphere light (sky/ground ambient)
        const hemiLight = new THREE.HemisphereLight(0x87ceeb, 0x545454, 0.3);
        this.scene.add(hemiLight);
    }
    
    /**
     * Load skybox from Poly Haven
     * @param {string} skyboxName - Name of skybox (e.g., 'kloppenheim_02', 'abandoned_hall')
     */
    async loadSkybox(skyboxName) {
        const loader = new THREE.CubeTextureLoader();
        const extension = '.jpg';
        const baseUrl = `/assets/textures/skyboxes/${skyboxName}/`;
        
        const urls = [
            baseUrl + 'px' + extension, // right
            baseUrl + 'nx' + extension, // left
            baseUrl + 'py' + extension, // top
            baseUrl + 'ny' + extension, // bottom
            baseUrl + 'pz' + extension, // front
            baseUrl + 'nz' + extension  // back
        ];
        
        try {
            const texture = await loader.loadAsync(urls);
            this.scene.background = texture;
            this.scene.environment = texture;
            return texture;
        } catch (error) {
            console.warn(`Skybox ${skyboxName} not found, using color background`);
            return null;
        }
    }
    
    /**
     * Add character model to scene (from Mixamo/external)
     */
    addCharacter(id, model, position = { x: 0, y: 0, z: 0 }) {
        model.position.set(position.x, position.y, position.z);
        model.castShadow = true;
        model.receiveShadow = true;
        
        // Enable shadows for all meshes
        model.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        
        this.scene.add(model);
        this.characters.set(id, model);
        
        return model;
    }
    
    /**
     * Add environment model to scene (from Quaternius/external)
     */
    addEnvironment(id, model, position = { x: 0, y: 0, z: 0 }) {
        model.position.set(position.x, position.y, position.z);
        model.receiveShadow = true;
        
        // Environment objects receive shadows but typically don't cast
        model.traverse((child) => {
            if (child.isMesh) {
                child.receiveShadow = true;
            }
        });
        
        this.scene.add(model);
        this.environment.set(id, model);
        
        return model;
    }
    
    /**
     * Add point light (for magic effects, torches, etc.)
     */
    addPointLight(position, color = 0xffffff, intensity = 1, distance = 10) {
        const light = new THREE.PointLight(color, intensity, distance);
        light.position.set(position.x, position.y, position.z);
        light.castShadow = true;
        this.scene.add(light);
        this.lights.point.push(light);
        return light;
    }
    
    /**
     * Add spot light (for dramatic lighting)
     */
    addSpotLight(position, target, color = 0xffffff, intensity = 1) {
        const light = new THREE.SpotLight(color, intensity);
        light.position.set(position.x, position.y, position.z);
        light.target.position.set(target.x, target.y, target.z);
        light.castShadow = true;
        light.angle = Math.PI / 6;
        light.penumbra = 0.3;
        this.scene.add(light);
        this.scene.add(light.target);
        this.lights.spot.push(light);
        return light;
    }
    
    /**
     * Update camera to follow target
     */
    followTarget(target, offset = { x: 0, y: 5, z: 10 }) {
        const targetPos = target.position || target;
        this.controls.target.set(targetPos.x, targetPos.y, targetPos.z);
        
        const cameraPos = new THREE.Vector3(
            targetPos.x + offset.x,
            targetPos.y + offset.y,
            targetPos.z + offset.z
        );
        this.camera.position.lerp(cameraPos, 0.1);
    }
    
    /**
     * Update scene lighting based on time of day
     */
    updateDayNightLighting(timeOfDay) {
        // timeOfDay: 0-24 (0 = midnight, 12 = noon)
        const hour = timeOfDay % 24;
        
        // Adjust directional light (sun)
        if (hour >= 6 && hour <= 18) {
            // Daytime
            const dayProgress = (hour - 6) / 12;
            const angle = Math.PI * dayProgress;
            this.lights.directional.position.x = Math.cos(angle) * 50;
            this.lights.directional.position.y = Math.abs(Math.sin(angle)) * 100;
            this.lights.directional.intensity = 0.5 + Math.sin(angle) * 0.5;
            
            // Adjust colors
            if (hour < 8) {
                // Dawn
                this.lights.directional.color.setHex(0xffcc99);
            } else if (hour > 16) {
                // Dusk
                this.lights.directional.color.setHex(0xff9966);
            } else {
                // Midday
                this.lights.directional.color.setHex(0xffffff);
            }
        } else {
            // Nighttime
            this.lights.directional.intensity = 0.1;
            this.lights.directional.color.setHex(0x6699cc);
        }
        
        // Adjust ambient light
        this.lights.ambient.intensity = hour >= 6 && hour <= 18 ? 0.4 : 0.2;
    }
    
    /**
     * Remove object from scene
     */
    removeObject(id) {
        if (this.objects.has(id)) {
            const obj = this.objects.get(id);
            this.scene.remove(obj);
            this.objects.delete(id);
        } else if (this.characters.has(id)) {
            const char = this.characters.get(id);
            this.scene.remove(char);
            this.characters.delete(id);
        } else if (this.environment.has(id)) {
            const env = this.environment.get(id);
            this.scene.remove(env);
            this.environment.delete(id);
        }
    }
    
    /**
     * Update scene
     */
    update(deltaTime) {
        // Update controls
        this.controls.update();
        
        // Update stats
        this.stats.drawCalls = this.renderer.info.render.calls;
        this.stats.triangles = this.renderer.info.render.triangles;
        this.stats.frameTime = deltaTime;
        this.stats.fps = Math.round(1 / deltaTime);
    }
    
    /**
     * Render scene
     */
    render() {
        if (this.composer) {
            this.composer.render();
        } else {
            this.renderer.render(this.scene, this.camera);
        }
    }
    
    /**
     * Handle window resize
     */
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        
        if (this.composer) {
            this.composer.setSize(window.innerWidth, window.innerHeight);
        }
    }
    
    /**
     * Enable/disable post-processing effects
     */
    togglePostProcessing(enabled) {
        if (enabled && !this.composer) {
            this.setupPostProcessing();
        }
        // Composer toggle handled in render()
    }
    
    /**
     * Get scene statistics
     */
    getStats() {
        return {
            ...this.stats,
            objects: this.objects.size + this.characters.size + this.environment.size,
            characters: this.characters.size,
            environment: this.environment.size,
            lights: this.lights.point.length + this.lights.spot.length + 2
        };
    }
    
    /**
     * Dispose of resources
     */
    dispose() {
        this.renderer.dispose();
        this.controls.dispose();
        if (this.composer) {
            this.composer.dispose();
        }
        
        // Dispose geometries and materials
        this.scene.traverse((object) => {
            if (object.geometry) {
                object.geometry.dispose();
            }
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });
    }
}
