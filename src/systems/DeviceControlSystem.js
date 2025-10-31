/**
 * Device Detection & Control System
 * Auto-detects device type and adapts controls
 * Allows user to manually switch control schemes
 */

export class DeviceControlSystem {
  constructor(game) {
    this.game = game;
    this.deviceType = 'unknown';
    this.controlScheme = 'auto'; // auto, pc, mobile, gamepad
    this.isTouchDevice = false;
    this.screenSize = { width: 0, height: 0 };
    this.orientation = 'landscape';
    
    // Control states
    this.controls = {
      pc: {
        enabled: false,
        keys: {},
        mouse: { x: 0, y: 0, buttons: {} }
      },
      mobile: {
        enabled: false,
        touches: [],
        joystick: { active: false, x: 0, y: 0 }
      },
      gamepad: {
        enabled: false,
        connected: false,
        index: -1
      }
    };
    
    this.init();
  }
  
  init() {
    logger.info('🎮 Initializing Device Detection & Control System...');
    
    // Detect device on startup
    this.detectDevice();
    this.detectScreenSize();
    this.detectOrientation();
    
    // Auto-select control scheme
    this.selectControlScheme();
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Create control UI
    this.createControlUI();
    
    // Load saved preferences
    this.loadPreferences();
    
    logger.info(`✅ Device detected: ${this.deviceType}`);
    logger.info(`✅ Control scheme: ${this.controlScheme}`);
    logger.info(`✅ Screen: ${this.screenSize.width}x${this.screenSize.height}`);
  }
  
  detectDevice() {
    const userAgent = navigator.userAgent.toLowerCase();
    
    // Check for mobile devices
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const isTablet = /ipad|android(?!.*mobile)/i.test(userAgent) || 
                     (navigator.maxTouchPoints > 1 && /macintosh/i.test(userAgent));
    
    // Check for touch support
    this.isTouchDevice = ('ontouchstart' in window) || 
                         (navigator.maxTouchPoints > 0) || 
                         (navigator.msMaxTouchPoints > 0);
    
    // Determine device type
    if (isTablet) {
      this.deviceType = 'tablet';
    } else if (isMobile) {
      this.deviceType = 'mobile';
    } else {
      this.deviceType = 'desktop';
    }
    
    // Additional checks
    if (this.isTouchDevice && this.deviceType === 'desktop') {
      // Touchscreen laptop/desktop
      this.deviceType = 'desktop-touch';
    }
    
    return this.deviceType;
  }
  
  detectScreenSize() {
    this.screenSize = {
      width: window.innerWidth,
      height: window.innerHeight,
      ratio: window.innerWidth / window.innerHeight,
      dpr: window.devicePixelRatio || 1
    };
    
    return this.screenSize;
  }
  
  detectOrientation() {
    if (window.innerWidth > window.innerHeight) {
      this.orientation = 'landscape';
    } else {
      this.orientation = 'portrait';
    }
    
    return this.orientation;
  }
  
  selectControlScheme() {
    if (this.controlScheme === 'auto') {
      // Auto-select based on device
      if (this.deviceType === 'mobile' || this.deviceType === 'tablet') {
        this.setControlScheme('mobile');
      } else if (this.deviceType === 'desktop' || this.deviceType === 'desktop-touch') {
        this.setControlScheme('pc');
      }
    }
    
    // Check for gamepad
    this.checkGamepad();
  }
  
  setControlScheme(scheme) {
    logger.info(`🎮 Setting control scheme: ${scheme}`);
    
    // Disable all controls
    this.controls.pc.enabled = false;
    this.controls.mobile.enabled = false;
    this.controls.gamepad.enabled = false;
    
    // Enable selected scheme
    this.controlScheme = scheme;
    
    switch (scheme) {
      case 'pc':
        this.controls.pc.enabled = true;
        this.enablePCControls();
        break;
      case 'mobile':
        this.controls.mobile.enabled = true;
        this.enableMobileControls();
        break;
      case 'gamepad':
        this.controls.gamepad.enabled = true;
        this.enableGamepadControls();
        break;
    }
    
    // Update UI
    this.updateControlUI();
    
    // Save preference
    this.savePreferences();
    
    // Notify game
    if (this.game && this.game.onControlSchemeChanged) {
      this.game.onControlSchemeChanged(scheme);
    }
  }
  
  enablePCControls() {
    logger.info('⌨️  PC controls enabled (Keyboard + Mouse)');
    
    // Show PC control hints
    this.showControlHints('pc');
    
    // Hide mobile controls
    this.hideMobileControls();
  }
  
  enableMobileControls() {
    logger.info('📱 Mobile controls enabled (Touch)');
    
    // Show mobile control hints
    this.showControlHints('mobile');
    
    // Show touch controls
    this.showMobileControls();
  }
  
  enableGamepadControls() {
    logger.info('🎮 Gamepad controls enabled');
    
    // Show gamepad control hints
    this.showControlHints('gamepad');
  }
  
  setupEventListeners() {
    // Window resize
    window.addEventListener('resize', () => {
      this.detectScreenSize();
      this.detectOrientation();
      this.updateControlUI();
    });
    
    // Orientation change
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.detectOrientation();
        this.updateControlUI();
      }, 100);
    });
    
    // Gamepad connect/disconnect
    window.addEventListener('gamepadconnected', (e) => {
      logger.info('🎮 Gamepad connected:', e.gamepad.id);
      this.controls.gamepad.connected = true;
      this.controls.gamepad.index = e.gamepad.index;
      this.showGamepadNotification();
    });
    
    window.addEventListener('gamepaddisconnected', (e) => {
      logger.info('🎮 Gamepad disconnected');
      this.controls.gamepad.connected = false;
      if (this.controlScheme === 'gamepad') {
        this.setControlScheme('auto');
        this.selectControlScheme();
      }
    });
    
    // Keyboard events (PC)
    if (this.controls.pc.enabled) {
      document.addEventListener('keydown', (e) => this.handleKeyDown(e));
      document.addEventListener('keyup', (e) => this.handleKeyUp(e));
      document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
      document.addEventListener('mousedown', (e) => this.handleMouseDown(e));
      document.addEventListener('mouseup', (e) => this.handleMouseUp(e));
    }
    
    // Touch events (Mobile)
    if (this.controls.mobile.enabled || this.isTouchDevice) {
      document.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
      document.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
      document.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });
    }
  }
  
  checkGamepad() {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    for (let i = 0; i < gamepads.length; i++) {
      if (gamepads[i]) {
        this.controls.gamepad.connected = true;
        this.controls.gamepad.index = i;
        logger.info('🎮 Gamepad detected:', gamepads[i].id);
        return true;
      }
    }
    return false;
  }
  
  createControlUI() {
    // Create control switcher UI
    const controlPanel = document.createElement('div');
    controlPanel.id = 'control-panel';
    controlPanel.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: rgba(15, 15, 30, 0.95);
      border: 2px solid rgba(139, 0, 255, 0.5);
      border-radius: 12px;
      padding: 15px;
      z-index: 9999;
      min-width: 200px;
      box-shadow: 0 8px 32px rgba(139, 0, 255, 0.3);
      backdrop-filter: blur(10px);
    `;
    
    controlPanel.innerHTML = `
      <div style="color: #a78bfa; font-weight: bold; margin-bottom: 10px; font-size: 14px;">
        🎮 Controls
      </div>
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <button id="control-auto" class="control-btn" style="
          background: rgba(139, 0, 255, 0.2);
          border: 1px solid rgba(139, 0, 255, 0.5);
          color: #fff;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
          transition: all 0.3s;
        ">
          🤖 Auto Detect
        </button>
        <button id="control-pc" class="control-btn" style="
          background: rgba(139, 0, 255, 0.2);
          border: 1px solid rgba(139, 0, 255, 0.5);
          color: #fff;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
          transition: all 0.3s;
        ">
          ⌨️  PC (Keyboard + Mouse)
        </button>
        <button id="control-mobile" class="control-btn" style="
          background: rgba(139, 0, 255, 0.2);
          border: 1px solid rgba(139, 0, 255, 0.5);
          color: #fff;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
          transition: all 0.3s;
        ">
          📱 Mobile (Touch)
        </button>
        <button id="control-gamepad" class="control-btn" style="
          background: rgba(139, 0, 255, 0.2);
          border: 1px solid rgba(139, 0, 255, 0.5);
          color: #fff;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
          transition: all 0.3s;
          ${!this.controls.gamepad.connected ? 'opacity: 0.5;' : ''}
        ">
          🎮 Gamepad
        </button>
      </div>
      <div id="device-info" style="
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px solid rgba(139, 0, 255, 0.3);
        font-size: 11px;
        color: #a78bfa;
      ">
        Device: ${this.deviceType}<br>
        Screen: ${this.screenSize.width}x${this.screenSize.height}<br>
        Orientation: ${this.orientation}
      </div>
    `;
    
    document.body.appendChild(controlPanel);
    
    // Add button event listeners
    document.getElementById('control-auto').addEventListener('click', () => {
      this.controlScheme = 'auto';
      this.selectControlScheme();
    });
    
    document.getElementById('control-pc').addEventListener('click', () => {
      this.setControlScheme('pc');
    });
    
    document.getElementById('control-mobile').addEventListener('click', () => {
      this.setControlScheme('mobile');
    });
    
    document.getElementById('control-gamepad').addEventListener('click', () => {
      if (this.controls.gamepad.connected) {
        this.setControlScheme('gamepad');
      } else {
        alert('No gamepad detected. Please connect a gamepad first.');
      }
    });
    
    // Add hover effects
    const buttons = document.querySelectorAll('.control-btn');
    buttons.forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        btn.style.background = 'rgba(139, 0, 255, 0.4)';
        btn.style.transform = 'scale(1.05)';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.background = 'rgba(139, 0, 255, 0.2)';
        btn.style.transform = 'scale(1)';
      });
    });
    
    this.updateControlUI();
  }
  
  updateControlUI() {
    const buttons = {
      'control-auto': 'auto',
      'control-pc': 'pc',
      'control-mobile': 'mobile',
      'control-gamepad': 'gamepad'
    };
    
    Object.entries(buttons).forEach(([id, scheme]) => {
      const btn = document.getElementById(id);
      if (btn) {
        const isActive = (scheme === 'auto' && this.controlScheme === 'auto') || 
                        (scheme !== 'auto' && this.controlScheme === scheme);
        
        if (isActive) {
          btn.style.background = 'rgba(139, 0, 255, 0.6)';
          btn.style.borderColor = 'rgba(139, 0, 255, 1)';
          btn.style.boxShadow = '0 0 20px rgba(139, 0, 255, 0.5)';
        } else {
          btn.style.background = 'rgba(139, 0, 255, 0.2)';
          btn.style.borderColor = 'rgba(139, 0, 255, 0.5)';
          btn.style.boxShadow = 'none';
        }
      }
    });
    
    // Update device info
    const deviceInfo = document.getElementById('device-info');
    if (deviceInfo) {
      deviceInfo.innerHTML = `
        Device: ${this.deviceType}<br>
        Screen: ${this.screenSize.width}x${this.screenSize.height}<br>
        Orientation: ${this.orientation}<br>
        Active: ${this.controlScheme}
      `;
    }
  }
  
  showControlHints(scheme) {
    // Create or update control hints overlay
    let hints = document.getElementById('control-hints');
    if (!hints) {
      hints = document.createElement('div');
      hints.id = 'control-hints';
      hints.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        background: rgba(15, 15, 30, 0.9);
        border: 2px solid rgba(139, 0, 255, 0.5);
        border-radius: 12px;
        padding: 15px;
        z-index: 9998;
        max-width: 300px;
        backdrop-filter: blur(10px);
      `;
      document.body.appendChild(hints);
    }
    
    let content = '';
    switch (scheme) {
      case 'pc':
        content = `
          <div style="color: #a78bfa; font-weight: bold; margin-bottom: 10px;">⌨️  PC Controls</div>
          <div style="color: #fff; font-size: 12px; line-height: 1.8;">
            WASD - Move<br>
            Mouse - Look/Aim<br>
            Left Click - Attack<br>
            Right Click - Special<br>
            Q, E, R, F - Abilities<br>
            I - Inventory<br>
            M - Map<br>
            ESC - Menu<br>
            Enter - Chat
          </div>
        `;
        break;
      case 'mobile':
        content = `
          <div style="color: #a78bfa; font-weight: bold; margin-bottom: 10px;">📱 Touch Controls</div>
          <div style="color: #fff; font-size: 12px; line-height: 1.8;">
            Left Joystick - Move<br>
            Right Tap - Look/Aim<br>
            Attack Button - Attack<br>
            Ability Buttons - Use abilities<br>
            Menu Icon - Open menu<br>
            Tap UI Icons - Access features
          </div>
        `;
        break;
      case 'gamepad':
        content = `
          <div style="color: #a78bfa; font-weight: bold; margin-bottom: 10px;">🎮 Gamepad Controls</div>
          <div style="color: #fff; font-size: 12px; line-height: 1.8;">
            Left Stick - Move<br>
            Right Stick - Look/Aim<br>
            A/X - Attack<br>
            B/O - Jump/Dodge<br>
            X/□ - Special<br>
            Y/△ - Interact<br>
            LB/L1, RB/R1 - Abilities<br>
            Start - Menu
          </div>
        `;
        break;
    }
    
    hints.innerHTML = content;
    hints.style.display = 'block';
  }
  
  showMobileControls() {
    // Mobile touch controls would be created here
    logger.info('📱 Showing mobile touch controls');
    // TODO: Implement virtual joystick and buttons
  }
  
  hideMobileControls() {
    logger.info('📱 Hiding mobile touch controls');
    // TODO: Hide virtual controls
  }
  
  showGamepadNotification() {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(15, 15, 30, 0.95);
      border: 2px solid rgba(139, 0, 255, 0.8);
      border-radius: 12px;
      padding: 30px;
      z-index: 10000;
      text-align: center;
      box-shadow: 0 8px 32px rgba(139, 0, 255, 0.5);
    `;
    
    notification.innerHTML = `
      <div style="font-size: 48px; margin-bottom: 15px;">🎮</div>
      <div style="color: #a78bfa; font-size: 20px; font-weight: bold; margin-bottom: 10px;">
        Gamepad Connected!
      </div>
      <div style="color: #fff; font-size: 14px;">
        Switch to gamepad controls in the control panel
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
  
  // Event handlers (stubs - would be implemented fully)
  handleKeyDown(e) {
    this.controls.pc.keys[e.key] = true;
  }
  
  handleKeyUp(e) {
    this.controls.pc.keys[e.key] = false;
  }
  
  handleMouseMove(e) {
    this.controls.pc.mouse.x = e.clientX;
    this.controls.pc.mouse.y = e.clientY;
  }
  
  handleMouseDown(e) {
    this.controls.pc.mouse.buttons[e.button] = true;
  }
  
  handleMouseUp(e) {
    this.controls.pc.mouse.buttons[e.button] = false;
  }
  
  handleTouchStart(e) {
    this.controls.mobile.touches = Array.from(e.touches);
  }
  
  handleTouchMove(e) {
    this.controls.mobile.touches = Array.from(e.touches);
  }
  
  handleTouchEnd(e) {
    this.controls.mobile.touches = Array.from(e.touches);
  }
  
  savePreferences() {
    const prefs = {
      controlScheme: this.controlScheme,
      lastDeviceType: this.deviceType
    };
    localStorage.setItem('gameControlPreferences', JSON.stringify(prefs));
  }
  
  loadPreferences() {
    try {
      const prefs = JSON.parse(localStorage.getItem('gameControlPreferences'));
      if (prefs && prefs.controlScheme) {
        if (prefs.controlScheme !== 'auto') {
          this.setControlScheme(prefs.controlScheme);
        }
      }
    } catch (error) {
      // No preferences saved
    }
  }
  
  update(deltaTime) {
    // Update gamepad state if active
    if (this.controls.gamepad.enabled && this.controls.gamepad.connected) {
      this.updateGamepad();
    }
  }
  
  updateGamepad() {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    const gamepad = gamepads[this.controls.gamepad.index];
    
    if (gamepad) {
      // Process gamepad input
      // TODO: Implement gamepad input processing
    }
  }
  
  getActiveControl() {
    return this.controlScheme;
  }
  
  isPC() {
    return this.controls.pc.enabled;
  }
  
  isMobile() {
    return this.controls.mobile.enabled;
  }
  
  isGamepad() {
    return this.controls.gamepad.enabled;
  }
}
