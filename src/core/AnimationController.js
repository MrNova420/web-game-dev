/**
import { logger } from './core/Logger.js';
 * Animation Controller System
 * 
 * Manages all character and entity animations using the Animation Library
 * from "Animation Library[Standard]" with 100+ movements and actions
 * 
 * Features:
 * - Character locomotion (walk, run, sprint, jump, crouch)
 * - Combat animations (attack, block, dodge, special moves)
 * - Social animations (emotes, gestures, interactions)
 * - Environmental interactions
 * - Smooth animation blending
 */

import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

export class AnimationController {
    constructor() {
        this.fbxLoader = new FBXLoader();
        this.animations = new Map();
        this.mixers = new Map();
        this.currentAnimations = new Map();
        
        // Animation categories from the Standard Animation Library
        this.animationTypes = {
            // Locomotion
            IDLE: 'idle',
            WALK: 'walk',
            RUN: 'run',
            SPRINT: 'sprint',
            JUMP: 'jump',
            FALL: 'fall',
            LAND: 'land',
            CROUCH: 'crouch',
            CROUCH_WALK: 'crouch_walk',
            
            // Combat - Melee
            ATTACK_1: 'attack_1',
            ATTACK_2: 'attack_2',
            ATTACK_3: 'attack_3',
            HEAVY_ATTACK: 'heavy_attack',
            COMBO_1: 'combo_1',
            COMBO_2: 'combo_2',
            BLOCK: 'block',
            PARRY: 'parry',
            DODGE_LEFT: 'dodge_left',
            DODGE_RIGHT: 'dodge_right',
            DODGE_BACK: 'dodge_back',
            ROLL: 'roll',
            
            // Combat - Ranged
            BOW_DRAW: 'bow_draw',
            BOW_SHOOT: 'bow_shoot',
            THROW: 'throw',
            CAST_SPELL: 'cast_spell',
            CHANNEL: 'channel',
            
            // Combat - Hit Reactions
            HIT_FRONT: 'hit_front',
            HIT_BACK: 'hit_back',
            STAGGER: 'stagger',
            KNOCKDOWN: 'knockdown',
            GET_UP: 'get_up',
            DEATH_1: 'death_1',
            DEATH_2: 'death_2',
            
            // Social/Emotes
            WAVE: 'wave',
            POINT: 'point',
            CHEER: 'cheer',
            DANCE: 'dance',
            SIT: 'sit',
            SLEEP: 'sleep',
            LAUGH: 'laugh',
            CRY: 'cry',
            ANGRY: 'angry',
            THINK: 'think',
            
            // Interactions
            PICKUP: 'pickup',
            OPEN_DOOR: 'open_door',
            PULL_LEVER: 'pull_lever',
            CLIMB: 'climb',
            SWIM: 'swim',
            DRINK: 'drink',
            EAT: 'eat',
            
            // Special
            VICTORY: 'victory',
            LEVEL_UP: 'level_up',
            WOUNDED: 'wounded',
            EXHAUSTED: 'exhausted'
        };
        
        this.loadedLibrary = false;
    }
    
    /**
     * Load the animation library FBX file
     */
    async loadAnimationLibrary() {
        logger.info('🎭 Loading Animation Library (100+ animations)...');
        
        try {
            // Try to load from extracted location
            const libraryPath = '/assets/animations/AnimationLibrary_Unity_Standard.fbx';
            
            return new Promise((resolve, reject) => {
                this.fbxLoader.load(
                    libraryPath,
                    (fbx) => {
                        logger.info('✅ Animation Library loaded!');
                        this.parseAnimationLibrary(fbx);
                        this.loadedLibrary = true;
                        resolve(fbx);
                    },
                    (xhr) => {
                        const percent = (xhr.loaded / xhr.total * 100).toFixed(0);
                        if (percent % 20 === 0) {
                            logger.info(`   Loading animations: ${percent}%`);
                        }
                    },
                    (error) => {
                        logger.warn('Animation library not found, using fallback animations');
                        this.createFallbackAnimations();
                        resolve(null);
                    }
                );
            });
        } catch (error) {
            logger.warn('Could not load animation library:', error);
            this.createFallbackAnimations();
        }
    }
    
    /**
     * Parse animations from the loaded FBX library
     */
    parseAnimationLibrary(fbx) {
        if (!fbx.animations || fbx.animations.length === 0) {
            logger.warn('No animations found in library');
            return;
        }
        
        logger.info(`   Found ${fbx.animations.length} animations in library`);
        
        // Store all animations
        fbx.animations.forEach((clip, index) => {
            const name = clip.name || `animation_${index}`;
            this.animations.set(name.toLowerCase(), clip);
        });
        
        logger.info(`   ✅ ${this.animations.size} animations ready`);
    }
    
    /**
     * Create simple fallback animations if library not available
     */
    createFallbackAnimations() {
        logger.info('   Creating fallback animations...');
        
        // Create basic keyframe animations
        const createSimpleAnimation = (name, duration = 1.0) => {
            const times = [0, duration];
            const values = [0, 0, 0, 0, 0, 0];
            
            const positionKF = new THREE.VectorKeyframeTrack(
                '.position',
                times,
                values
            );
            
            const clip = new THREE.AnimationClip(name, duration, [positionKF]);
            this.animations.set(name, clip);
        };
        
        // Create basic animations
        Object.values(this.animationTypes).forEach(animType => {
            createSimpleAnimation(animType);
        });
        
        logger.info(`   ✅ ${this.animations.size} fallback animations created`);
    }
    
    /**
     * Create animation mixer for a model
     */
    createMixer(model, modelId) {
        if (!model) return null;
        
        const mixer = new THREE.AnimationMixer(model);
        this.mixers.set(modelId, mixer);
        return mixer;
    }
    
    /**
     * Play animation on a model
     */
    playAnimation(modelId, animationType, options = {}) {
        const {
            loop = true,
            crossFadeDuration = 0.3,
            timeScale = 1.0
        } = options;
        
        const mixer = this.mixers.get(modelId);
        if (!mixer) {
            logger.warn(`No mixer found for model: ${modelId}`);
            return null;
        }
        
        // Get animation clip
        const clip = this.animations.get(animationType);
        if (!clip) {
            logger.warn(`Animation not found: ${animationType}`);
            return null;
        }
        
        // Stop current animation if exists
        const currentAction = this.currentAnimations.get(modelId);
        
        // Create and play new action
        const action = mixer.clipAction(clip);
        action.setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce, loop ? Infinity : 1);
        action.timeScale = timeScale;
        
        if (currentAction && crossFadeDuration > 0) {
            action.reset();
            action.play();
            currentAction.crossFadeTo(action, crossFadeDuration, true);
        } else {
            action.play();
        }
        
        this.currentAnimations.set(modelId, action);
        return action;
    }
    
    /**
     * Update all animation mixers
     */
    update(deltaTime) {
        this.mixers.forEach(mixer => {
            mixer.update(deltaTime);
        });
    }
    
    /**
     * Get animation by type
     */
    getAnimation(type) {
        return this.animations.get(type);
    }
    
    /**
     * Stop animation for a model
     */
    stopAnimation(modelId) {
        const action = this.currentAnimations.get(modelId);
        if (action) {
            action.stop();
            this.currentAnimations.delete(modelId);
        }
    }
    
    /**
     * Remove mixer for a model (cleanup)
     */
    removeMixer(modelId) {
        this.stopAnimation(modelId);
        this.mixers.delete(modelId);
    }
}

// Global animation controller instance
export const animationController = new AnimationController();
