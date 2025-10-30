/**
 * Universal Input System - Dynasty of Emberveil
 * 
 * Handles input from:
 * - Keyboard (PC)
 * - Mouse (PC)
 * - Touch/Tap (Mobile/Tablet)
 * - Gamepad (Controller support)
 * 
 * Features:
 * - Cross-platform compatibility
 * - Virtual joystick for mobile
 * - Touch buttons for mobile
 * - Mouse controls
 * - Keyboard shortcuts
 * - Responsive design
 */

export class UniversalInputSystem {
    constructor(camera, player) {
        this.camera = camera;
        this.player = player;
        
        // Input states
        this.keys = {};
        this.mouseButtons = {};
        this.touches = {};
        this.gamepad = null;
        
        // Mobile detection
        this.isMobile = this.detectMobile();
        this.isTablet = this.detectTablet();
        this.isTouchDevice = 'ontouchstart' in window;
        
        // Virtual controls for mobile
        this.virtualJoystick = null;
        this.touchButtons = [];
        
        // Input settings
        this.sensitivity = {
            mouse: 0.002,
            touch: 0.003,
            joystick: 1.0
        };
        
        this.init();
    }
    
    /**
     * Initialize input system
     */
    init() {
        console.log('🎮 Initializing Universal Input System...');
        console.log(`   Platform: ${this.getPlatformName()}`);
        console.log(`   Touch Device: ${this.isTouchDevice}`);
        
        // Setup keyboard
        this.setupKeyboard();
        
        // Setup mouse
        this.setupMouse();
        
        // Setup touch/mobile
        if (this.isTouchDevice) {
            this.setupTouch();
            this.createMobileControls();
        }
        
        // Setup gamepad
        this.setupGamepad();
        
        // Setup window resize
        window.addEventListener('resize', () => this.handleResize());
        
        console.log('✅ Universal Input System initialized');
    }
    
    /**
     * Detect mobile device
     */
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    /**
     * Detect tablet device
     */
    detectTablet() {
        return /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(navigator.userAgent);
    }
    
    /**
     * Get platform name
     */
    getPlatformName() {
        if (this.isMobile && !this.isTablet) return 'Mobile';
        if (this.isTablet) return 'Tablet';
        return 'Desktop';
    }
    
    /**
     * Setup keyboard controls
     */
    setupKeyboard() {
        // Key down
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            this.handleKeyPress(e.code, true);
        });
        
        // Key up
        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
            this.handleKeyPress(e.code, false);
        });
        
        console.log('   ⌨️ Keyboard controls enabled');
    }
    
    /**
     * Setup mouse controls
     */
    setupMouse() {
        // Mouse down
        window.addEventListener('mousedown', (e) => {
            this.mouseButtons[e.button] = true;
            this.handleMouseClick(e.button, e.clientX, e.clientY);
        });
        
        // Mouse up
        window.addEventListener('mouseup', (e) => {
            this.mouseButtons[e.button] = false;
        });
        
        // Mouse move
        window.addEventListener('mousemove', (e) => {
            this.handleMouseMove(e.movementX, e.movementY);
        });
        
        // Mouse wheel
        window.addEventListener('wheel', (e) => {
            this.handleMouseWheel(e.deltaY);
        });
        
        console.log('   🖱️ Mouse controls enabled');
    }
    
    /**
     * Setup touch controls
     */
    setupTouch() {
        // Touch start
        window.addEventListener('touchstart', (e) => {
            for (let touch of e.changedTouches) {
                this.touches[touch.identifier] = {
                    startX: touch.clientX,
                    startY: touch.clientY,
                    currentX: touch.clientX,
                    currentY: touch.clientY
                };
            }
            this.handleTouchStart(e);
        }, { passive: false });
        
        // Touch move
        window.addEventListener('touchmove', (e) => {
            for (let touch of e.changedTouches) {
                if (this.touches[touch.identifier]) {
                    this.touches[touch.identifier].currentX = touch.clientX;
                    this.touches[touch.identifier].currentY = touch.clientY;
                }
            }
            this.handleTouchMove(e);
        }, { passive: false });
        
        // Touch end
        window.addEventListener('touchend', (e) => {
            for (let touch of e.changedTouches) {
                delete this.touches[touch.identifier];
            }
            this.handleTouchEnd(e);
        }, { passive: false });
        
        console.log('   📱 Touch controls enabled');
    }
    
    /**
     * Setup gamepad controls
     */
    setupGamepad() {
        window.addEventListener('gamepadconnected', (e) => {
            console.log(`   🎮 Gamepad connected: ${e.gamepad.id}`);
            this.gamepad = e.gamepad;
        });
        
        window.addEventListener('gamepaddisconnected', (e) => {
            console.log(`   🎮 Gamepad disconnected`);
            this.gamepad = null;
        });
    }
    
    /**
     * Create mobile controls (virtual joystick + buttons)
     */
    createMobileControls() {
        console.log('   📱 Creating mobile controls...');
        
        // Create container
        const container = document.createElement('div');
        container.id = 'mobile-controls';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 999;
        `;
        
        // Create virtual joystick (left side)
        this.createVirtualJoystick(container);
        
        // Create action buttons (right side)
        this.createActionButtons(container);
        
        document.body.appendChild(container);
        
        console.log('      ✅ Mobile controls created');
    }
    
    /**
     * Create virtual joystick
     */
    createVirtualJoystick(container) {
        const joystickBase = document.createElement('div');
        joystickBase.id = 'joystick-base';
        joystickBase.style.cssText = `
            position: absolute;
            bottom: 80px;
            left: 80px;
            width: 120px;
            height: 120px;
            background: radial-gradient(circle, rgba(255,255,255,0.2), rgba(0,0,0,0.5));
            border: 3px solid rgba(255,255,255,0.5);
            border-radius: 50%;
            pointer-events: auto;
            touch-action: none;
        `;
        
        const joystickStick = document.createElement('div');
        joystickStick.id = 'joystick-stick';
        joystickStick.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 60px;
            height: 60px;
            background: radial-gradient(circle, rgba(255,215,0,0.8), rgba(255,165,0,0.6));
            border: 2px solid rgba(255,255,255,0.8);
            border-radius: 50%;
            pointer-events: none;
        `;
        
        joystickBase.appendChild(joystickStick);
        container.appendChild(joystickBase);
        
        // Joystick logic
        let joystickActive = false;
        let joystickCenter = { x: 0, y: 0 };
        
        joystickBase.addEventListener('touchstart', (e) => {
            e.preventDefault();
            joystickActive = true;
            const rect = joystickBase.getBoundingClientRect();
            joystickCenter = {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
            };
        });
        
        joystickBase.addEventListener('touchmove', (e) => {
            if (!joystickActive) return;
            e.preventDefault();
            
            const touch = e.touches[0];
            const dx = touch.clientX - joystickCenter.x;
            const dy = touch.clientY - joystickCenter.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxDistance = 30;
            
            if (distance > maxDistance) {
                const angle = Math.atan2(dy, dx);
                joystickStick.style.left = `${50 + Math.cos(angle) * maxDistance}px`;
                joystickStick.style.top = `${50 + Math.sin(angle) * maxDistance}px`;
                
                // Update player movement
                this.handleJoystickMove(
                    Math.cos(angle) * this.sensitivity.joystick,
                    Math.sin(angle) * this.sensitivity.joystick
                );
            } else {
                joystickStick.style.left = `${50 + dx}px`;
                joystickStick.style.top = `${50 + dy}px`;
                
                // Update player movement
                this.handleJoystickMove(
                    dx / maxDistance * this.sensitivity.joystick,
                    dy / maxDistance * this.sensitivity.joystick
                );
            }
        });
        
        joystickBase.addEventListener('touchend', (e) => {
            e.preventDefault();
            joystickActive = false;
            joystickStick.style.left = '50%';
            joystickStick.style.top = '50%';
            this.handleJoystickMove(0, 0);
        });
        
        this.virtualJoystick = { base: joystickBase, stick: joystickStick };
    }
    
    /**
     * Create action buttons
     */
    createActionButtons(container) {
        const buttons = [
            { id: 'attack', label: '⚔️', bottom: 120, right: 80, action: 'attack' },
            { id: 'jump', label: '🔼', bottom: 80, right: 150, action: 'jump' },
            { id: 'skill1', label: '1', bottom: 200, right: 100, action: 'skill1' },
            { id: 'skill2', label: '2', bottom: 200, right: 180, action: 'skill2' }
        ];
        
        buttons.forEach(btn => {
            const button = document.createElement('button');
            button.id = `mobile-btn-${btn.id}`;
            button.textContent = btn.label;
            button.style.cssText = `
                position: absolute;
                bottom: ${btn.bottom}px;
                right: ${btn.right}px;
                width: 60px;
                height: 60px;
                background: radial-gradient(circle, rgba(255,215,0,0.8), rgba(255,165,0,0.6));
                border: 3px solid rgba(255,255,255,0.8);
                border-radius: 50%;
                color: #fff;
                font-size: 24px;
                font-weight: bold;
                cursor: pointer;
                pointer-events: auto;
                touch-action: none;
                box-shadow: 0 4px 8px rgba(0,0,0,0.3);
                transition: all 0.1s;
            `;
            
            // Button press effects
            button.addEventListener('touchstart', (e) => {
                e.preventDefault();
                button.style.transform = 'scale(0.9)';
                button.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
                this.handleButtonPress(btn.action, true);
            });
            
            button.addEventListener('touchend', (e) => {
                e.preventDefault();
                button.style.transform = 'scale(1)';
                button.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
                this.handleButtonPress(btn.action, false);
            });
            
            container.appendChild(button);
            this.touchButtons.push({ element: button, action: btn.action });
        });
    }
    
    /**
     * Handle key press
     */
    handleKeyPress(code, isDown) {
        // Movement keys
        if (code === 'KeyW' || code === 'ArrowUp') {
            this.player?.moveForward(isDown ? 1 : 0);
        }
        if (code === 'KeyS' || code === 'ArrowDown') {
            this.player?.moveBackward(isDown ? 1 : 0);
        }
        if (code === 'KeyA' || code === 'ArrowLeft') {
            this.player?.moveLeft(isDown ? 1 : 0);
        }
        if (code === 'KeyD' || code === 'ArrowRight') {
            this.player?.moveRight(isDown ? 1 : 0);
        }
        
        // Action keys
        if (code === 'Space' && isDown) {
            this.player?.jump();
        }
        if (code === 'ShiftLeft' || code === 'ShiftRight') {
            this.player?.sprint(isDown);
        }
        
        // Skill keys (1-6)
        if (isDown) {
            if (code === 'Digit1') this.player?.useSkill(1);
            if (code === 'Digit2') this.player?.useSkill(2);
            if (code === 'Digit3') this.player?.useSkill(3);
            if (code === 'Digit4') this.player?.useSkill(4);
            if (code === 'Digit5') this.player?.useSkill(5);
            if (code === 'Digit6') this.player?.useSkill(6);
        }
        
        // UI keys
        if (isDown) {
            if (code === 'KeyI' || code === 'Tab') {
                window.enhancedUI?.togglePanel('inventoryPanel');
            }
            if (code === 'KeyC') {
                window.enhancedUI?.togglePanel('characterSheet');
            }
            if (code === 'KeyK') {
                window.enhancedUI?.togglePanel('skillTree');
            }
            if (code === 'KeyM') {
                window.enhancedUI?.togglePanel('minimap');
            }
            if (code === 'Escape') {
                window.enhancedUI?.togglePanel('settingsMenu');
            }
        }
    }
    
    /**
     * Handle mouse click
     */
    handleMouseClick(button, x, y) {
        if (button === 0) { // Left click
            this.player?.attack();
        }
        if (button === 2) { // Right click
            this.player?.useSecondaryAction();
        }
    }
    
    /**
     * Handle mouse move
     */
    handleMouseMove(deltaX, deltaY) {
        if (!this.camera) return;
        
        // Rotate camera based on mouse movement
        const rotationX = deltaX * this.sensitivity.mouse;
        const rotationY = deltaY * this.sensitivity.mouse;
        
        // Apply rotation (would be handled by camera controller)
        this.camera.rotateY(-rotationX);
        this.camera.rotateX(-rotationY);
    }
    
    /**
     * Handle mouse wheel
     */
    handleMouseWheel(delta) {
        // Zoom camera in/out
        const zoomAmount = delta * 0.001;
        // Would be handled by camera controller
    }
    
    /**
     * Handle touch start
     */
    handleTouchStart(e) {
        // Prevent default for game area
        if (e.target.id !== 'mobile-controls') {
            e.preventDefault();
        }
    }
    
    /**
     * Handle touch move
     */
    handleTouchMove(e) {
        // Camera rotation with touch (right side of screen)
        const touch = e.touches[0];
        if (touch.clientX > window.innerWidth / 2) {
            // Right side - camera control
            const touchData = this.touches[touch.identifier];
            if (touchData) {
                const deltaX = touchData.currentX - touchData.startX;
                const deltaY = touchData.currentY - touchData.startY;
                
                const rotationX = deltaX * this.sensitivity.touch;
                const rotationY = deltaY * this.sensitivity.touch;
                
                // Apply camera rotation
                if (this.camera) {
                    this.camera.rotateY(-rotationX * 0.1);
                    this.camera.rotateX(-rotationY * 0.1);
                }
                
                // Update start position for next frame
                touchData.startX = touchData.currentX;
                touchData.startY = touchData.currentY;
            }
        }
    }
    
    /**
     * Handle touch end
     */
    handleTouchEnd(e) {
        // Clean up touches
    }
    
    /**
     * Handle joystick movement
     */
    handleJoystickMove(x, y) {
        if (!this.player) return;
        
        // Convert joystick input to player movement
        const angle = Math.atan2(y, x);
        const magnitude = Math.sqrt(x * x + y * y);
        
        if (magnitude > 0.1) {
            this.player.moveForward(Math.cos(angle) * magnitude);
            this.player.moveRight(Math.sin(angle) * magnitude);
        } else {
            this.player.moveForward(0);
            this.player.moveRight(0);
        }
    }
    
    /**
     * Handle button press
     */
    handleButtonPress(action, isDown) {
        if (!this.player) return;
        
        switch(action) {
            case 'attack':
                if (isDown) this.player.attack();
                break;
            case 'jump':
                if (isDown) this.player.jump();
                break;
            case 'skill1':
                if (isDown) this.player.useSkill(1);
                break;
            case 'skill2':
                if (isDown) this.player.useSkill(2);
                break;
        }
    }
    
    /**
     * Handle window resize
     */
    handleResize() {
        // Adjust mobile controls for new screen size
        if (this.isTouchDevice && this.virtualJoystick) {
            // Controls automatically adjust with CSS
        }
    }
    
    /**
     * Update (called every frame)
     */
    update(deltaTime) {
        // Update gamepad if connected
        if (this.gamepad) {
            this.updateGamepad();
        }
        
        // Handle continuous key presses
        this.updateKeyboardMovement();
    }
    
    /**
     * Update keyboard movement
     */
    updateKeyboardMovement() {
        if (!this.player) return;
        
        let moveX = 0;
        let moveZ = 0;
        
        if (this.keys['KeyW'] || this.keys['ArrowUp']) moveZ -= 1;
        if (this.keys['KeyS'] || this.keys['ArrowDown']) moveZ += 1;
        if (this.keys['KeyA'] || this.keys['ArrowLeft']) moveX -= 1;
        if (this.keys['KeyD'] || this.keys['ArrowRight']) moveX += 1;
        
        if (moveX !== 0 || moveZ !== 0) {
            // Normalize diagonal movement
            const length = Math.sqrt(moveX * moveX + moveZ * moveZ);
            moveX /= length;
            moveZ /= length;
        }
    }
    
    /**
     * Update gamepad
     */
    updateGamepad() {
        const gamepads = navigator.getGamepads();
        if (!gamepads[0]) return;
        
        const gp = gamepads[0];
        
        // Left stick - movement
        const moveX = gp.axes[0];
        const moveY = gp.axes[1];
        
        if (Math.abs(moveX) > 0.1 || Math.abs(moveY) > 0.1) {
            this.player?.moveForward(-moveY);
            this.player?.moveRight(moveX);
        }
        
        // Right stick - camera
        const lookX = gp.axes[2];
        const lookY = gp.axes[3];
        
        if (Math.abs(lookX) > 0.1 || Math.abs(lookY) > 0.1) {
            if (this.camera) {
                this.camera.rotateY(-lookX * 0.05);
                this.camera.rotateX(-lookY * 0.05);
            }
        }
        
        // Buttons
        if (gp.buttons[0].pressed) this.player?.attack(); // A/X
        if (gp.buttons[1].pressed) this.player?.jump(); // B/Circle
    }
    
    /**
     * Show mobile controls
     */
    showMobileControls() {
        const container = document.getElementById('mobile-controls');
        if (container) container.style.display = 'block';
    }
    
    /**
     * Hide mobile controls
     */
    hideMobileControls() {
        const container = document.getElementById('mobile-controls');
        if (container) container.style.display = 'none';
    }
    
    /**
     * Destroy input system
     */
    destroy() {
        // Remove all event listeners
        window.removeEventListener('keydown', this.handleKeyPress);
        window.removeEventListener('keyup', this.handleKeyPress);
        window.removeEventListener('mousedown', this.handleMouseClick);
        window.removeEventListener('mouseup', this.handleMouseClick);
        window.removeEventListener('mousemove', this.handleMouseMove);
        window.removeEventListener('wheel', this.handleMouseWheel);
        
        // Remove mobile controls
        const container = document.getElementById('mobile-controls');
        if (container) container.remove();
        
        console.log('🎮 Universal Input System destroyed');
    }
}
