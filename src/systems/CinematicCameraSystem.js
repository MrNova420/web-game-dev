/**
import { logger } from '../core/Logger.js';
 * CinematicCameraSystem - AAA cinematic camera controls and effects
 * Provides professional camera work for an immersive experience
 */

import * as THREE from 'three';

export class CinematicCameraSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.camera = gameEngine.camera;
        this.scene = gameEngine.scene;
        
        this.modes = {
            THIRD_PERSON: 'third_person',
            FIRST_PERSON: 'first_person',
            CINEMATIC: 'cinematic',
            ORBIT: 'orbit',
            FOLLOW: 'follow',
            FIXED: 'fixed'
        };
        
        this.currentMode = this.modes.THIRD_PERSON;
        
        this.settings = {
            // Third person
            thirdPersonDistance: 10,
            thirdPersonHeight: 5,
            thirdPersonAngle: Math.PI / 6,
            
            // Camera smoothing
            smoothness: 0.1,
            rotationSmoothness: 0.15,
            
            // Field of view
            fovBase: 75,
            fovTarget: 75,
            fovSpeed: 2,
            
            // Shake
            shakeIntensity: 0,
            shakeDecay: 0.9,
            
            // Cinematic
            cinematicPath: [],
            cinematicIndex: 0,
            cinematicSpeed: 1.0
        };
        
        this.targetPosition = new THREE.Vector3();
        this.targetLookAt = new THREE.Vector3();
        this.currentVelocity = new THREE.Vector3();
        
        this.cameraRig = new THREE.Group();
        this.scene.add(this.cameraRig);
        
        this.init();
    }
    
    init() {
        this.setupCameraEffects();
        logger.info('🎥 Cinematic Camera System initialized');
    }
    
    setupCameraEffects() {
        // Motion blur effect (simplified)
        this.motionBlurEnabled = false;
        this.previousCameraPosition = this.camera.position.clone();
        this.previousCameraRotation = this.camera.rotation.clone();
    }
    
    setMode(mode, options = {}) {
        this.currentMode = mode;
        
        switch (mode) {
            case this.modes.CINEMATIC:
                if (options.path) {
                    this.settings.cinematicPath = options.path;
                    this.settings.cinematicIndex = 0;
                }
                break;
            case this.modes.FIRST_PERSON:
                this.settings.thirdPersonDistance = 0;
                break;
            case this.modes.THIRD_PERSON:
                this.settings.thirdPersonDistance = 10;
                break;
        }
        
        logger.info(`🎥 Camera mode: ${mode}`);
    }
    
    updateThirdPerson(target, deltaTime) {
        // Calculate desired camera position behind and above target
        const offset = new THREE.Vector3(
            0,
            this.settings.thirdPersonHeight,
            this.settings.thirdPersonDistance
        );
        
        // Rotate offset based on target's rotation
        if (target.rotation) {
            offset.applyEuler(new THREE.Euler(
                this.settings.thirdPersonAngle,
                target.rotation.y,
                0
            ));
        }
        
        this.targetPosition.copy(target.position).add(offset);
        this.targetLookAt.copy(target.position);
        
        // Smooth camera movement
        this.camera.position.lerp(
            this.targetPosition,
            this.settings.smoothness
        );
        
        // Smooth camera look at
        const currentLookAt = new THREE.Vector3();
        this.camera.getWorldDirection(currentLookAt);
        currentLookAt.multiplyScalar(10).add(this.camera.position);
        currentLookAt.lerp(this.targetLookAt, this.settings.rotationSmoothness);
        
        this.camera.lookAt(currentLookAt);
    }
    
    updateFirstPerson(target, deltaTime) {
        // Camera at target position
        this.targetPosition.copy(target.position);
        this.targetPosition.y += 1.6; // Eye height
        
        this.camera.position.lerp(
            this.targetPosition,
            this.settings.smoothness
        );
        
        // Use target's rotation for look direction
        if (target.rotation) {
            this.camera.rotation.y = target.rotation.y;
        }
    }
    
    updateOrbit(target, deltaTime) {
        // Orbit around target
        const time = Date.now() * 0.001;
        const radius = this.settings.thirdPersonDistance;
        
        this.camera.position.x = target.position.x + Math.cos(time * 0.5) * radius;
        this.camera.position.z = target.position.z + Math.sin(time * 0.5) * radius;
        this.camera.position.y = target.position.y + this.settings.thirdPersonHeight;
        
        this.camera.lookAt(target.position);
    }
    
    updateCinematic(deltaTime) {
        if (this.settings.cinematicPath.length === 0) return;
        
        const path = this.settings.cinematicPath;
        const speed = this.settings.cinematicSpeed * deltaTime;
        
        this.settings.cinematicIndex += speed;
        
        if (this.settings.cinematicIndex >= path.length - 1) {
            this.settings.cinematicIndex = 0; // Loop
        }
        
        const index = Math.floor(this.settings.cinematicIndex);
        const nextIndex = Math.min(index + 1, path.length - 1);
        const t = this.settings.cinematicIndex - index;
        
        // Interpolate between path points
        const current = path[index];
        const next = path[nextIndex];
        
        this.camera.position.lerpVectors(current.position, next.position, t);
        
        if (current.lookAt && next.lookAt) {
            const lookAt = new THREE.Vector3().lerpVectors(
                current.lookAt,
                next.lookAt,
                t
            );
            this.camera.lookAt(lookAt);
        }
    }
    
    createCinematicPath(points, lookAtPoints = null) {
        const path = [];
        
        for (let i = 0; i < points.length; i++) {
            path.push({
                position: points[i].clone(),
                lookAt: lookAtPoints ? lookAtPoints[i].clone() : points[i].clone()
            });
        }
        
        return path;
    }
    
    shake(intensity, duration = 0.3) {
        this.settings.shakeIntensity = intensity;
        this.shakeTimer = duration;
    }
    
    updateShake(deltaTime) {
        if (this.settings.shakeIntensity > 0.001) {
            const shake = this.settings.shakeIntensity;
            
            // Apply shake to camera position
            this.camera.position.x += (Math.random() - 0.5) * shake;
            this.camera.position.y += (Math.random() - 0.5) * shake;
            this.camera.position.z += (Math.random() - 0.5) * shake;
            
            // Decay shake
            this.settings.shakeIntensity *= this.settings.shakeDecay;
            
            if (this.shakeTimer !== undefined) {
                this.shakeTimer -= deltaTime;
                if (this.shakeTimer <= 0) {
                    this.settings.shakeIntensity = 0;
                }
            }
        }
    }
    
    setFOV(fov, smooth = true) {
        if (smooth) {
            this.settings.fovTarget = fov;
        } else {
            this.camera.fov = fov;
            this.camera.updateProjectionMatrix();
        }
    }
    
    updateFOV(deltaTime) {
        if (Math.abs(this.camera.fov - this.settings.fovTarget) > 0.1) {
            const diff = this.settings.fovTarget - this.camera.fov;
            this.camera.fov += diff * this.settings.fovSpeed * deltaTime;
            this.camera.updateProjectionMatrix();
        }
    }
    
    zoomIn(amount = 10) {
        this.setFOV(Math.max(30, this.camera.fov - amount));
    }
    
    zoomOut(amount = 10) {
        this.setFOV(Math.min(120, this.camera.fov + amount));
    }
    
    resetZoom() {
        this.setFOV(this.settings.fovBase);
    }
    
    dollyZoom(targetFOV, duration = 1.0) {
        // Famous "Vertigo" effect
        const startFOV = this.camera.fov;
        const startDistance = this.settings.thirdPersonDistance;
        
        // Calculate distance change to maintain apparent size
        const fovRatio = Math.tan((targetFOV * Math.PI / 180) / 2) /
                        Math.tan((startFOV * Math.PI / 180) / 2);
        const targetDistance = startDistance * fovRatio;
        
        // Animate over duration
        let elapsed = 0;
        const animate = (deltaTime) => {
            elapsed += deltaTime;
            const t = Math.min(elapsed / duration, 1.0);
            
            this.camera.fov = startFOV + (targetFOV - startFOV) * t;
            this.settings.thirdPersonDistance = startDistance + 
                (targetDistance - startDistance) * t;
            
            this.camera.updateProjectionMatrix();
            
            if (t < 1.0) {
                requestAnimationFrame(() => animate(deltaTime));
            }
        };
        
        animate(0);
    }
    
    panTo(position, duration = 2.0) {
        // Smooth pan to position
        const startPos = this.camera.position.clone();
        let elapsed = 0;
        
        const animate = (deltaTime) => {
            elapsed += deltaTime;
            const t = Math.min(elapsed / duration, 1.0);
            
            // Smooth easing
            const eased = t < 0.5 ?
                2 * t * t :
                -1 + (4 - 2 * t) * t;
            
            this.camera.position.lerpVectors(startPos, position, eased);
            
            if (t < 1.0) {
                requestAnimationFrame(() => animate(deltaTime));
            }
        };
        
        animate(0);
    }
    
    lookAtSmooth(target, duration = 1.0) {
        // Smooth camera rotation to look at target
        const startQuaternion = this.camera.quaternion.clone();
        
        // Calculate target quaternion
        const tempCamera = this.camera.clone();
        tempCamera.lookAt(target);
        const targetQuaternion = tempCamera.quaternion.clone();
        
        let elapsed = 0;
        const animate = (deltaTime) => {
            elapsed += deltaTime;
            const t = Math.min(elapsed / duration, 1.0);
            
            this.camera.quaternion.slerpQuaternions(
                startQuaternion,
                targetQuaternion,
                t
            );
            
            if (t < 1.0) {
                requestAnimationFrame(() => animate(deltaTime));
            }
        };
        
        animate(0);
    }
    
    update(deltaTime) {
        const target = this.gameEngine.player?.mesh;
        if (!target) return;
        
        // Update camera based on mode
        switch (this.currentMode) {
            case this.modes.THIRD_PERSON:
                this.updateThirdPerson(target, deltaTime);
                break;
            case this.modes.FIRST_PERSON:
                this.updateFirstPerson(target, deltaTime);
                break;
            case this.modes.ORBIT:
                this.updateOrbit(target, deltaTime);
                break;
            case this.modes.CINEMATIC:
                this.updateCinematic(deltaTime);
                break;
            case this.modes.FOLLOW:
                this.updateThirdPerson(target, deltaTime);
                break;
        }
        
        // Update effects
        this.updateShake(deltaTime);
        this.updateFOV(deltaTime);
        
        // Store previous position for motion blur
        this.previousCameraPosition.copy(this.camera.position);
        this.previousCameraRotation.copy(this.camera.rotation);
    }
    
    dispose() {
        if (this.cameraRig) {
            this.scene.remove(this.cameraRig);
        }
        
        logger.info('🎥 Cinematic Camera System disposed');
    }
}
