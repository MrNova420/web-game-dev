import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

/**
 * Player Animation Controller - Manages 100+ animations for player character
 * Handles locomotion, combat, social, and interaction animations with smooth blending
 */
export class PlayerAnimationController {
    constructor(modelLoader) {
        this.modelLoader = modelLoader;
        this.mixer = null;
        this.animations = new Map();
        this.currentAction = null;
        this.currentState = 'idle';
        
        // Animation states
        this.states = {
            // Locomotion
            idle: null,
            walk: null,
            run: null,
            sprint: null,
            jump: null,
            fall: null,
            land: null,
            
            // Combat
            attack1: null,
            attack2: null,
            attack3: null,
            attack4: null,
            attack5: null,
            heavyAttack: null,
            dodgeRoll: null,
            block: null,
            parry: null,
            death: null,
            
            // Social
            wave: null,
            dance: null,
            sit: null,
            sleep: null,
            
            // Interactions
            gather: null,
            craft: null,
            build: null,
            fish: null,
            mine: null,
            eat: null,
            drink: null
        };
        
        this.isLoaded = false;
    }
    
    /**
     * Initialize animation system and load animation library
     */
    async init(playerModel) {
        if (!playerModel) {
            console.warn('PlayerAnimationController: No player model provided');
            return;
        }
        
        this.mixer = new THREE.AnimationMixer(playerModel);
        
        try {
            // Load FBX animation library
            const fbxLoader = new FBXLoader();
            const animationLib = await this.modelLoader.loadModel('/assets/animations/AnimationLibrary_Unity_Standard.fbx');
            
            if (animationLib && animationLib.animations) {
                // Map animations to states
                animationLib.animations.forEach((clip, index) => {
                    const stateName = this.getStateFromIndex(index);
                    if (stateName && this.states.hasOwnProperty(stateName)) {
                        this.states[stateName] = this.mixer.clipAction(clip);
                    }
                });
                
                console.log('PlayerAnimationController: Loaded', animationLib.animations.length, 'animations');
                this.isLoaded = true;
                
                // Start with idle animation
                this.playAnimation('idle');
            }
        } catch (error) {
            console.error('Failed to load animation library:', error);
            // Fallback: create basic animations
            this.createFallbackAnimations(playerModel);
        }
    }
    
    /**
     * Map animation index to state name
     */
    getStateFromIndex(index) {
        const stateNames = Object.keys(this.states);
        return stateNames[index % stateNames.length];
    }
    
    /**
     * Create basic fallback animations if FBX loading fails
     */
    createFallbackAnimations(model) {
        console.log('Using fallback animations');
        // Create simple idle animation
        const idleClip = new THREE.AnimationClip('idle', 2, []);
        this.states.idle = this.mixer.clipAction(idleClip);
        this.isLoaded = true;
    }
    
    /**
     * Play specific animation state
     */
    playAnimation(stateName, fadeTime = 0.2) {
        if (!this.isLoaded) return;
        
        const newAction = this.states[stateName];
        if (!newAction) {
            console.warn('Animation state not found:', stateName);
            return;
        }
        
        // Crossfade from current to new animation
        if (this.currentAction && this.currentAction !== newAction) {
            this.currentAction.fadeOut(fadeTime);
        }
        
        newAction.reset()
                .setEffectiveTimeScale(1)
                .setEffectiveWeight(1)
                .fadeIn(fadeTime)
                .play();
        
        this.currentAction = newAction;
        this.currentState = stateName;
    }
    
    /**
     * Update animation mixer
     */
    update(deltaTime, playerState = {}) {
        if (!this.mixer) return;
        
        this.mixer.update(deltaTime);
        
        // Auto-trigger animations based on player state
        if (playerState) {
            this.updateStateFromPlayerInput(playerState);
        }
    }
    
    /**
     * Automatically switch animations based on player state
     */
    updateStateFromPlayerInput(state) {
        // Priority: combat > movement > idle
        if (state.isAttacking) {
            const comboIndex = (state.comboCount || 0) % 5 + 1;
            this.playAnimation(`attack${comboIndex}`);
        } else if (state.isDodging) {
            this.playAnimation('dodgeRoll');
        } else if (state.isBlocking) {
            this.playAnimation('block');
        } else if (state.isJumping) {
            this.playAnimation('jump');
        } else if (state.isFalling) {
            this.playAnimation('fall');
        } else if (state.isRunning) {
            this.playAnimation('run');
        } else if (state.isMoving) {
            this.playAnimation('walk');
        } else {
            this.playAnimation('idle');
        }
    }
    
    /**
     * Trigger one-shot animation (e.g., wave, eat)
     */
    triggerAnimation(stateName, onComplete = null) {
        const action = this.states[stateName];
        if (!action) return;
        
        action.reset()
              .setLoop(THREE.LoopOnce, 1)
              .play();
        
        if (onComplete) {
            this.mixer.addEventListener('finished', onComplete);
        }
    }
    
    /**
     * Get current animation state
     */
    getCurrentState() {
        return this.currentState;
    }
    
    /**
     * Check if animation is playing
     */
    isPlaying() {
        return this.currentAction && this.currentAction.isRunning();
    }
}
