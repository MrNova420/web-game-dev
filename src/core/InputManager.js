/**
 * InputManager - Handles keyboard and mouse input
 */

export class InputManager {
    constructor(canvas, engine) {
        this.canvas = canvas;
        this.engine = engine;
        
        this.keys = {};
        this.mousePosition = { x: 0, y: 0 };
        this.mouseButtons = {};
        
        this.init();
    }
    
    init() {
        // Keyboard events
        window.addEventListener('keydown', (e) => this.onKeyDown(e));
        window.addEventListener('keyup', (e) => this.onKeyUp(e));
        
        // Mouse events
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
        
        // Ability buttons
        const abilityButtons = document.querySelectorAll('.ability-button');
        abilityButtons.forEach(button => {
            button.addEventListener('click', () => {
                const key = button.getAttribute('data-key');
                if (key) {
                    this.engine.useAbility(key);
                }
            });
        });
        
        console.log('🎮 Input manager initialized');
    }
    
    onKeyDown(event) {
        this.keys[event.key.toLowerCase()] = true;
        
        // Handle movement keys
        if (this.engine.player) {
            switch(event.key.toLowerCase()) {
                case 'w':
                case 'arrowup':
                    this.engine.player.moveForward = true;
                    break;
                case 's':
                case 'arrowdown':
                    this.engine.player.moveBackward = true;
                    break;
                case 'a':
                case 'arrowleft':
                    this.engine.player.moveLeft = true;
                    break;
                case 'd':
                case 'arrowright':
                    this.engine.player.moveRight = true;
                    break;
            }
        }
        
        // Handle ability keys (Q, W, E, R)
        if (['q', 'w', 'e', 'r'].includes(event.key.toLowerCase())) {
            this.engine.useAbility(event.key.toLowerCase());
            event.preventDefault();
        }
    }
    
    onKeyUp(event) {
        this.keys[event.key.toLowerCase()] = false;
        
        // Handle movement keys
        if (this.engine.player) {
            switch(event.key.toLowerCase()) {
                case 'w':
                case 'arrowup':
                    this.engine.player.moveForward = false;
                    break;
                case 's':
                case 'arrowdown':
                    this.engine.player.moveBackward = false;
                    break;
                case 'a':
                case 'arrowleft':
                    this.engine.player.moveLeft = false;
                    break;
                case 'd':
                case 'arrowright':
                    this.engine.player.moveRight = false;
                    break;
            }
        }
    }
    
    onMouseMove(event) {
        const rect = this.canvas.getBoundingClientRect();
        this.mousePosition.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mousePosition.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }
    
    onMouseDown(event) {
        this.mouseButtons[event.button] = true;
        
        // Left click - basic attack
        if (event.button === 0 && this.engine.player) {
            this.engine.player.attack();
        }
    }
    
    onMouseUp(event) {
        this.mouseButtons[event.button] = false;
    }
    
    isKeyPressed(key) {
        return this.keys[key.toLowerCase()] || false;
    }
    
    isMouseButtonPressed(button) {
        return this.mouseButtons[button] || false;
    }
}
