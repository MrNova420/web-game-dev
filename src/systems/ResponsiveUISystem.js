/**
 * Responsive UI and Mobile Touch Controls System
 * Makes the game playable on all devices with optimized controls
 */

export class ResponsiveUISystem {
    constructor() {
        this.isMobile = this.detectMobile();
        this.isTablet = this.detectTablet();
        this.screenSize = this.getScreenSize();
        this.orientation = this.getOrientation();
        
        this.touchControls = {
            enabled: this.isMobile || this.isTablet,
            joystick: null,
            actionButtons: [],
            sensitivity: 1.0
        };

        this.uiScaling = {
            base: 1.0,
            current: 1.0,
            min: 0.7,
            max: 1.5
        };

        this.init();
    }

    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    detectTablet() {
        return /iPad|Android/i.test(navigator.userAgent) && window.innerWidth >= 768;
    }

    getScreenSize() {
        const width = window.innerWidth;
        if (width < 576) return 'xs'; // Phone portrait
        if (width < 768) return 'sm'; // Phone landscape
        if (width < 992) return 'md'; // Tablet
        if (width < 1200) return 'lg'; // Desktop
        return 'xl'; // Large desktop
    }

    getOrientation() {
        return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
    }

    init() {
        // Setup responsive listeners
        window.addEventListener('resize', () => this.handleResize());
        window.addEventListener('orientationchange', () => this.handleOrientationChange());

        // Apply initial scaling
        this.applyUIScaling();

        // Setup touch controls if mobile
        if (this.touchControls.enabled) {
            this.setupTouchControls();
        }

        // Setup accessibility
        this.setupAccessibility();
    }

    handleResize() {
        this.screenSize = this.getScreenSize();
        this.orientation = this.getOrientation();
        this.applyUIScaling();
        
        // Adjust touch controls
        if (this.touchControls.enabled) {
            this.adjustTouchControlsLayout();
        }
    }

    handleOrientationChange() {
        setTimeout(() => {
            this.orientation = this.getOrientation();
            this.applyUIScaling();
            
            if (this.touchControls.enabled) {
                this.adjustTouchControlsLayout();
            }
        }, 200);
    }

    applyUIScaling() {
        let scale = 1.0;

        // Scale based on screen size
        switch (this.screenSize) {
            case 'xs':
                scale = 0.75;
                break;
            case 'sm':
                scale = 0.85;
                break;
            case 'md':
                scale = 0.95;
                break;
            case 'lg':
                scale = 1.0;
                break;
            case 'xl':
                scale = 1.1;
                break;
        }

        // Adjust for portrait on mobile
        if (this.isMobile && this.orientation === 'portrait') {
            scale *= 0.9;
        }

        this.uiScaling.current = Math.max(this.uiScaling.min, Math.min(this.uiScaling.max, scale));

        // Apply scaling to UI elements
        document.documentElement.style.setProperty('--ui-scale', this.uiScaling.current);
    }

    setupTouchControls() {
        // Create virtual joystick for movement
        this.createVirtualJoystick();

        // Create action buttons
        this.createActionButtons();

        // Setup gesture controls
        this.setupGestures();
    }

    createVirtualJoystick() {
        const joystickContainer = document.createElement('div');
        joystickContainer.id = 'virtual-joystick';
        joystickContainer.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            width: 120px;
            height: 120px;
            background: rgba(255, 255, 255, 0.1);
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            z-index: 1000;
            touch-action: none;
        `;

        const joystickStick = document.createElement('div');
        joystickStick.id = 'joystick-stick';
        joystickStick.style.cssText = `
            position: absolute;
            width: 50px;
            height: 50px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
        `;

        joystickContainer.appendChild(joystickStick);
        document.body.appendChild(joystickContainer);

        // Handle joystick input
        let isDragging = false;
        let startPos = { x: 0, y: 0 };

        joystickContainer.addEventListener('touchstart', (e) => {
            e.preventDefault();
            isDragging = true;
            const rect = joystickContainer.getBoundingClientRect();
            startPos.x = rect.left + rect.width / 2;
            startPos.y = rect.top + rect.height / 2;
        });

        document.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            const touch = e.touches[0];
            const dx = touch.clientX - startPos.x;
            const dy = touch.clientY - startPos.y;
            
            // Limit to circle radius
            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxDistance = 35;
            
            let finalX = dx;
            let finalY = dy;
            
            if (distance > maxDistance) {
                finalX = (dx / distance) * maxDistance;
                finalY = (dy / distance) * maxDistance;
            }

            joystickStick.style.transform = `translate(calc(-50% + ${finalX}px), calc(-50% + ${finalY}px))`;

            // Calculate movement vector
            const angle = Math.atan2(dy, dx);
            const strength = Math.min(distance / maxDistance, 1);

            this.touchControls.joystick = {
                angle: angle,
                strength: strength,
                x: Math.cos(angle) * strength,
                y: Math.sin(angle) * strength
            };
        });

        document.addEventListener('touchend', () => {
            if (!isDragging) return;
            isDragging = false;
            joystickStick.style.transform = 'translate(-50%, -50%)';
            this.touchControls.joystick = null;
        });
    }

    createActionButtons() {
        const buttons = [
            { id: 'btn-attack', label: 'ATK', action: 'attack', color: 'rgba(255, 100, 100, 0.8)' },
            { id: 'btn-special', label: 'SP', action: 'special', color: 'rgba(100, 100, 255, 0.8)' },
            { id: 'btn-dodge', label: 'DODGE', action: 'dodge', color: 'rgba(100, 255, 100, 0.8)' },
            { id: 'btn-interact', label: 'USE', action: 'interact', color: 'rgba(255, 255, 100, 0.8)' }
        ];

        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'action-buttons';
        buttonContainer.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            z-index: 1000;
        `;

        buttons.forEach((btn, index) => {
            const button = document.createElement('button');
            button.id = btn.id;
            button.textContent = btn.label;
            button.style.cssText = `
                width: 70px;
                height: 70px;
                border-radius: 50%;
                border: 2px solid white;
                background: ${btn.color};
                color: white;
                font-weight: bold;
                font-size: 12px;
                touch-action: none;
                cursor: pointer;
            `;

            button.addEventListener('touchstart', (e) => {
                e.preventDefault();
                button.style.transform = 'scale(0.9)';
                this.triggerAction(btn.action);
            });

            button.addEventListener('touchend', (e) => {
                e.preventDefault();
                button.style.transform = 'scale(1)';
            });

            buttonContainer.appendChild(button);
            this.touchControls.actionButtons.push({ element: button, action: btn.action });
        });

        document.body.appendChild(buttonContainer);
    }

    adjustTouchControlsLayout() {
        const joystick = document.getElementById('virtual-joystick');
        const actionButtons = document.getElementById('action-buttons');

        if (!joystick || !actionButtons) return;

        if (this.orientation === 'landscape') {
            // Landscape: buttons on right, joystick on left
            joystick.style.left = '20px';
            joystick.style.bottom = '20px';
            actionButtons.style.right = '20px';
            actionButtons.style.bottom = '20px';
        } else {
            // Portrait: stack buttons vertically
            joystick.style.left = '20px';
            joystick.style.bottom = '100px';
            actionButtons.style.right = '20px';
            actionButtons.style.bottom = '100px';
        }
    }

    setupGestures() {
        let touchStartTime = 0;
        let touchStartPos = { x: 0, y: 0 };

        document.addEventListener('touchstart', (e) => {
            if (e.touches.length === 2) {
                // Two finger gesture
                touchStartTime = Date.now();
                touchStartPos.x = (e.touches[0].clientX + e.touches[1].clientX) / 2;
                touchStartPos.y = (e.touches[0].clientY + e.touches[1].clientY) / 2;
            }
        });

        document.addEventListener('touchend', (e) => {
            const duration = Date.now() - touchStartTime;
            
            // Double tap to lock target
            if (duration < 300 && e.changedTouches.length === 1) {
                this.triggerAction('lock-target');
            }
        });

        // Pinch to zoom (if applicable)
        let lastScale = 1;
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length === 2) {
                const dist = Math.hypot(
                    e.touches[0].clientX - e.touches[1].clientX,
                    e.touches[0].clientY - e.touches[1].clientY
                );
                
                const scale = dist / 200; // Normalize
                
                if (Math.abs(scale - lastScale) > 0.1) {
                    this.triggerAction('zoom', { scale });
                    lastScale = scale;
                }
            }
        });
    }

    setupAccessibility() {
        // Add skip to content link
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.style.cssText = `
            position: absolute;
            left: -9999px;
            z-index: 9999;
            padding: 1em;
            background: black;
            color: white;
        `;
        skipLink.addEventListener('focus', () => {
            skipLink.style.left = '0';
        });
        skipLink.addEventListener('blur', () => {
            skipLink.style.left = '-9999px';
        });
        document.body.insertBefore(skipLink, document.body.firstChild);

        // Add ARIA labels to interactive elements
        this.addARIALabels();

        // Setup keyboard navigation
        this.setupKeyboardNavigation();

        // Add focus indicators
        this.addFocusIndicators();
    }

    addARIALabels() {
        // Would add ARIA labels to all interactive elements
        document.querySelectorAll('button, a, input').forEach(element => {
            if (!element.getAttribute('aria-label') && element.textContent) {
                element.setAttribute('aria-label', element.textContent.trim());
            }
        });
    }

    setupKeyboardNavigation() {
        // Tab navigation for UI elements
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    addFocusIndicators() {
        const style = document.createElement('style');
        style.textContent = `
            .keyboard-navigation *:focus {
                outline: 3px solid #4A90E2 !important;
                outline-offset: 2px;
            }
        `;
        document.head.appendChild(style);
    }

    triggerAction(action, data = {}) {
        // Dispatch custom event for game to handle
        const event = new CustomEvent('gameAction', {
            detail: { action, data }
        });
        window.dispatchEvent(event);
    }

    getMovementInput() {
        if (this.touchControls.joystick) {
            return {
                x: this.touchControls.joystick.x,
                y: this.touchControls.joystick.y,
                strength: this.touchControls.joystick.strength
            };
        }
        return null;
    }

    // User-friendly settings
    setTouchSensitivity(value) {
        this.touchControls.sensitivity = Math.max(0.5, Math.min(2.0, value));
    }

    setUIScale(value) {
        this.uiScaling.current = Math.max(this.uiScaling.min, Math.min(this.uiScaling.max, value));
        document.documentElement.style.setProperty('--ui-scale', this.uiScaling.current);
    }

    toggleTouchControls(enabled) {
        this.touchControls.enabled = enabled;
        
        const joystick = document.getElementById('virtual-joystick');
        const buttons = document.getElementById('action-buttons');
        
        if (joystick) joystick.style.display = enabled ? 'block' : 'none';
        if (buttons) buttons.style.display = enabled ? 'flex' : 'none';
    }

    // Help overlay for new players
    showControlsHelp() {
        const helpOverlay = document.createElement('div');
        helpOverlay.id = 'controls-help';
        helpOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            padding: 20px;
            box-sizing: border-box;
        `;

        const helpContent = `
            <div style="max-width: 600px; text-align: center;">
                <h2>Controls Guide</h2>
                
                ${this.isMobile ? `
                    <h3>Touch Controls</h3>
                    <p>🎮 Left Joystick: Move character</p>
                    <p>🔴 ATK Button: Attack enemies</p>
                    <p>🔵 SP Button: Use special ability</p>
                    <p>🟢 DODGE Button: Dodge/roll</p>
                    <p>🟡 USE Button: Interact with objects</p>
                    <p>👆 Double Tap: Lock onto target</p>
                    <p>🤏 Pinch: Zoom camera</p>
                ` : `
                    <h3>Keyboard Controls</h3>
                    <p>WASD / Arrow Keys: Move</p>
                    <p>Left Click: Attack</p>
                    <p>Right Click: Special ability</p>
                    <p>Space: Dodge/roll</p>
                    <p>E: Interact</p>
                    <p>I: Inventory</p>
                    <p>M: Map</p>
                    <p>ESC: Menu</p>
                `}
                
                <button id="close-help" style="
                    margin-top: 20px;
                    padding: 10px 30px;
                    font-size: 16px;
                    background: #4A90E2;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                ">Got it!</button>
            </div>
        `;

        helpOverlay.innerHTML = helpContent;
        document.body.appendChild(helpOverlay);

        document.getElementById('close-help').addEventListener('click', () => {
            document.body.removeChild(helpOverlay);
        });
    }

    // Export settings
    exportSettings() {
        return {
            touchSensitivity: this.touchControls.sensitivity,
            uiScale: this.uiScaling.current,
            touchControlsEnabled: this.touchControls.enabled
        };
    }

    // Import settings
    importSettings(settings) {
        if (settings.touchSensitivity) {
            this.setTouchSensitivity(settings.touchSensitivity);
        }
        if (settings.uiScale) {
            this.setUIScale(settings.uiScale);
        }
        if (settings.touchControlsEnabled !== undefined) {
            this.toggleTouchControls(settings.touchControlsEnabled);
        }
    }
}
