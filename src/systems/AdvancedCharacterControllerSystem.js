/**
 * AdvancedCharacterControllerSystem - 3D Character Movement & Animation
 * 
 * Handles character movement, animation state machine, and physics
 * for the ADVANCED 3D ANIME FANTASY MAGIC RPG.
 * 
 * Works with Mixamo character models and animations.
 */

import * as THREE from 'three';

export class AdvancedCharacterControllerSystem {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        
        // Characters
        this.characters = new Map();
        this.playerCharacter = null;
        
        // Input state
        this.keys = {};
        this.mousePosition = { x: 0, y: 0 };
        
        // Movement settings
        this.settings = {
            walkSpeed: 5,
            runSpeed: 10,
            sprintSpeed: 15,
            jumpForce: 8,
            gravity: -20,
            rotationSpeed: 5,
            smoothing: 0.1
        };
        
        this.setupInputHandlers();
    }
    
    setupInputHandlers() {
        // Keyboard
        window.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            
            // Space for jump
            if (e.key === ' ' && this.playerCharacter) {
                this.jump(this.playerCharacter.id);
            }
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
        
        // Mouse for camera rotation
        window.addEventListener('mousemove', (e) => {
            this.mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });
    }
    
    /**
     * Register character with controller
     * @param {string} id - Character ID
     * @param {THREE.Object3D} model - Character 3D model (from Mixamo)
     * @param {Object} animations - Animation clips from Mixamo
     */
    registerCharacter(id, model, animations = {}) {
        const character = {
            id,
            model,
            animations: {},
            mixer: null,
            currentAction: null,
            state: 'idle',
            velocity: new THREE.Vector3(),
            isGrounded: true,
            isPlayer: false,
            stats: {
                speed: this.settings.walkSpeed,
                jumpHeight: this.settings.jumpForce
            }
        };
        
        // Setup animation mixer
        if (animations && Object.keys(animations).length > 0) {
            character.mixer = new THREE.AnimationMixer(model);
            
            // Store animation actions
            for (const [name, clip] of Object.entries(animations)) {
                character.animations[name] = character.mixer.clipAction(clip);
            }
            
            // Play idle animation by default
            if (character.animations.idle) {
                character.currentAction = character.animations.idle;
                character.currentAction.play();
            }
        }
        
        this.characters.set(id, character);
        return character;
    }
    
    /**
     * Set character as player-controlled
     */
    setPlayerCharacter(id) {
        const character = this.characters.get(id);
        if (character) {
            character.isPlayer = true;
            this.playerCharacter = character;
        }
    }
    
    /**
     * Update character movement and animations
     */
    update(deltaTime) {
        for (const [id, character] of this.characters.entries()) {
            if (character.isPlayer) {
                this.updatePlayerMovement(character, deltaTime);
            }
            
            // Update animations
            if (character.mixer) {
                character.mixer.update(deltaTime);
            }
            
            // Apply gravity
            if (!character.isGrounded) {
                character.velocity.y += this.settings.gravity * deltaTime;
            }
            
            // Apply velocity
            character.model.position.add(
                character.velocity.clone().multiplyScalar(deltaTime)
            );
            
            // Ground check (simple - at y=0)
            if (character.model.position.y <= 0) {
                character.model.position.y = 0;
                character.velocity.y = 0;
                character.isGrounded = true;
            } else {
                character.isGrounded = false;
            }
        }
    }
    
    /**
     * Update player-controlled character
     */
    updatePlayerMovement(character, deltaTime) {
        const moveSpeed = this.getMoveSpeed(character);
        const moveDirection = new THREE.Vector3();
        
        // Get camera forward/right vectors
        const cameraForward = new THREE.Vector3();
        this.camera.getWorldDirection(cameraForward);
        cameraForward.y = 0;
        cameraForward.normalize();
        
        const cameraRight = new THREE.Vector3();
        cameraRight.crossVectors(cameraForward, THREE.Object3D.DefaultUp).normalize();
        
        // Calculate movement direction based on input
        let isMoving = false;
        
        if (this.keys['w'] || this.keys['arrowup']) {
            moveDirection.add(cameraForward);
            isMoving = true;
        }
        if (this.keys['s'] || this.keys['arrowdown']) {
            moveDirection.sub(cameraForward);
            isMoving = true;
        }
        if (this.keys['a'] || this.keys['arrowleft']) {
            moveDirection.sub(cameraRight);
            isMoving = true;
        }
        if (this.keys['d'] || this.keys['arrowright']) {
            moveDirection.add(cameraRight);
            isMoving = true;
        }
        
        // Normalize and apply speed
        if (moveDirection.length() > 0) {
            moveDirection.normalize();
            character.velocity.x = moveDirection.x * moveSpeed;
            character.velocity.z = moveDirection.z * moveSpeed;
            
            // Rotate character to face movement direction
            const targetRotation = Math.atan2(moveDirection.x, moveDirection.z);
            character.model.rotation.y = THREE.MathUtils.lerp(
                character.model.rotation.y,
                targetRotation,
                this.settings.smoothing
            );
        } else {
            // Decelerate
            character.velocity.x *= 0.9;
            character.velocity.z *= 0.9;
        }
        
        // Update animation state
        this.updateAnimationState(character, isMoving);
    }
    
    /**
     * Get movement speed based on input modifiers
     */
    getMoveSpeed(character) {
        if (this.keys['shift']) {
            return this.settings.sprintSpeed;
        } else if (this.keys['control']) {
            return this.settings.walkSpeed * 0.5; // Crouch/sneak
        }
        return this.settings.runSpeed;
    }
    
    /**
     * Update character animation state
     */
    updateAnimationState(character, isMoving) {
        let newState = 'idle';
        
        if (!character.isGrounded) {
            newState = character.velocity.y > 0 ? 'jump' : 'fall';
        } else if (isMoving) {
            if (this.keys['shift']) {
                newState = 'sprint';
            } else if (this.keys['control']) {
                newState = 'sneak';
            } else {
                newState = 'run';
            }
        }
        
        // Change animation if state changed
        if (newState !== character.state) {
            this.transitionAnimation(character, newState);
            character.state = newState;
        }
    }
    
    /**
     * Transition to new animation
     */
    transitionAnimation(character, newState) {
        const newAnimation = character.animations[newState];
        
        if (!newAnimation) return;
        
        // Fade out current animation
        if (character.currentAction) {
            character.currentAction.fadeOut(0.2);
        }
        
        // Fade in new animation
        newAnimation.reset();
        newAnimation.fadeIn(0.2);
        newAnimation.play();
        
        character.currentAction = newAnimation;
    }
    
    /**
     * Make character jump
     */
    jump(characterId) {
        const character = this.characters.get(characterId);
        if (character && character.isGrounded) {
            character.velocity.y = character.stats.jumpHeight;
            character.isGrounded = false;
        }
    }
    
    /**
     * Move character to position
     */
    moveToPosition(characterId, targetPosition, speed = null) {
        const character = this.characters.get(characterId);
        if (!character) return;
        
        const moveSpeed = speed || character.stats.speed;
        const direction = new THREE.Vector3()
            .subVectors(targetPosition, character.model.position)
            .normalize();
        
        character.velocity.x = direction.x * moveSpeed;
        character.velocity.z = direction.z * moveSpeed;
        
        // Rotate to face target
        const targetRotation = Math.atan2(direction.x, direction.z);
        character.model.rotation.y = targetRotation;
    }
    
    /**
     * Play specific animation
     */
    playAnimation(characterId, animationName, loop = true) {
        const character = this.characters.get(characterId);
        if (!character || !character.animations[animationName]) return;
        
        const animation = character.animations[animationName];
        animation.reset();
        animation.setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce);
        animation.play();
        
        character.currentAction = animation;
    }
    
    /**
     * Get character position
     */
    getPosition(characterId) {
        const character = this.characters.get(characterId);
        return character ? character.model.position.clone() : null;
    }
    
    /**
     * Set character position
     */
    setPosition(characterId, position) {
        const character = this.characters.get(characterId);
        if (character) {
            character.model.position.set(position.x, position.y, position.z);
        }
    }
    
    /**
     * Get character rotation
     */
    getRotation(characterId) {
        const character = this.characters.get(characterId);
        return character ? character.model.rotation.y : 0;
    }
    
    /**
     * Set character rotation
     */
    setRotation(characterId, rotation) {
        const character = this.characters.get(characterId);
        if (character) {
            character.model.rotation.y = rotation;
        }
    }
    
    /**
     * Remove character
     */
    removeCharacter(characterId) {
        const character = this.characters.get(characterId);
        if (character) {
            if (character.mixer) {
                character.mixer.stopAllAction();
            }
            this.characters.delete(characterId);
        }
    }
    
    /**
     * Get all character positions
     */
    getAllPositions() {
        const positions = {};
        for (const [id, character] of this.characters.entries()) {
            positions[id] = character.model.position.clone();
        }
        return positions;
    }
}
