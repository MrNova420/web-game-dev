/**
 * ModernUISystem - Enhanced UI with theme-aware design and animations
 * Provides a more polished and immersive user interface experience
 */

export class ModernUISystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.currentTheme = 'fantasy';
        
        this.themes = {
            fantasy: {
                primary: '#9d4edd',
                secondary: '#c77dff',
                accent: '#e0aaff',
                background: 'rgba(26, 0, 51, 0.9)',
                border: '#9d4edd',
                text: '#ffffff'
            },
            dark: {
                primary: '#1a1e3e',
                secondary: '#2d3561',
                accent: '#4a5f8f',
                background: 'rgba(10, 14, 39, 0.95)',
                border: '#4a5f8f',
                text: '#e0e7ff'
            },
            arcane: {
                primary: '#0077ff',
                secondary: '#00aaff',
                accent: '#66ccff',
                background: 'rgba(0, 20, 60, 0.9)',
                border: '#00aaff',
                text: '#ffffff'
            },
            nature: {
                primary: '#52b788',
                secondary: '#74c69d',
                accent: '#95d5b2',
                background: 'rgba(20, 50, 30, 0.9)',
                border: '#52b788',
                text: '#ffffff'
            },
            infernal: {
                primary: '#ff0844',
                secondary: '#ff6b9d',
                accent: '#ffadd2',
                background: 'rgba(50, 10, 20, 0.9)',
                border: '#ff0844',
                text: '#ffffff'
            }
        };
        
        this.animations = {
            fadeIn: 'fadeIn 0.3s ease-in',
            slideIn: 'slideIn 0.4s ease-out',
            pulse: 'pulse 2s infinite',
            glow: 'glow 1.5s ease-in-out infinite'
        };
        
        this.init();
    }
    
    init() {
        this.injectStyles();
        this.enhanceExistingUI();
        this.createModernElements();
        
        console.log('🎨 Modern UI System initialized');
    }
    
    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Modern UI Animations */
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideIn {
                from { 
                    transform: translateY(20px);
                    opacity: 0;
                }
                to { 
                    transform: translateY(0);
                    opacity: 1;
                }
            }
            
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            
            @keyframes glow {
                0%, 100% { 
                    box-shadow: 0 0 10px currentColor;
                    filter: brightness(1);
                }
                50% { 
                    box-shadow: 0 0 20px currentColor;
                    filter: brightness(1.2);
                }
            }
            
            @keyframes shimmer {
                0% { background-position: -1000px 0; }
                100% { background-position: 1000px 0; }
            }
            
            /* Modern UI Components */
            .modern-panel {
                background: var(--ui-background);
                border: 2px solid var(--ui-border);
                border-radius: 12px;
                padding: 20px;
                box-shadow: 0 0 30px rgba(157, 78, 221, 0.3);
                backdrop-filter: blur(10px);
                animation: fadeIn 0.3s ease-in;
                transition: all 0.3s ease;
            }
            
            .modern-panel:hover {
                box-shadow: 0 0 40px rgba(157, 78, 221, 0.5);
                transform: translateY(-2px);
            }
            
            .modern-button {
                background: linear-gradient(135deg, var(--ui-primary), var(--ui-secondary));
                border: 2px solid var(--ui-accent);
                border-radius: 8px;
                padding: 12px 24px;
                color: var(--ui-text);
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }
            
            .modern-button::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, 
                    transparent, 
                    rgba(255, 255, 255, 0.3), 
                    transparent
                );
                transition: left 0.5s;
            }
            
            .modern-button:hover::before {
                left: 100%;
            }
            
            .modern-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 20px rgba(157, 78, 221, 0.5);
            }
            
            .modern-button:active {
                transform: translateY(0);
            }
            
            .modern-progress-bar {
                width: 100%;
                height: 24px;
                background: rgba(0, 0, 0, 0.5);
                border-radius: 12px;
                overflow: hidden;
                position: relative;
                border: 2px solid var(--ui-border);
            }
            
            .modern-progress-fill {
                height: 100%;
                background: linear-gradient(90deg, var(--ui-primary), var(--ui-secondary));
                transition: width 0.3s ease;
                position: relative;
                overflow: hidden;
            }
            
            .modern-progress-fill::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, 
                    transparent, 
                    rgba(255, 255, 255, 0.3), 
                    transparent
                );
                animation: shimmer 2s infinite;
            }
            
            .modern-stat-display {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 8px;
                background: rgba(0, 0, 0, 0.3);
                border-radius: 8px;
                margin: 5px 0;
            }
            
            .modern-stat-icon {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                background: var(--ui-primary);
                font-size: 14px;
            }
            
            .modern-stat-value {
                flex: 1;
                font-weight: bold;
                color: var(--ui-text);
            }
            
            .modern-notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: var(--ui-background);
                border: 2px solid var(--ui-border);
                border-radius: 8px;
                padding: 15px 20px;
                min-width: 250px;
                box-shadow: 0 0 20px rgba(157, 78, 221, 0.5);
                animation: slideIn 0.4s ease-out;
                z-index: 10000;
            }
            
            .modern-tooltip {
                position: absolute;
                background: rgba(0, 0, 0, 0.95);
                border: 2px solid var(--ui-border);
                border-radius: 8px;
                padding: 10px 15px;
                color: var(--ui-text);
                font-size: 14px;
                max-width: 300px;
                pointer-events: none;
                z-index: 10001;
                animation: fadeIn 0.2s ease-in;
            }
            
            .modern-divider {
                height: 2px;
                background: linear-gradient(90deg, 
                    transparent, 
                    var(--ui-border), 
                    transparent
                );
                margin: 15px 0;
            }
            
            /* Icon styles */
            .ui-icon {
                display: inline-block;
                font-size: 20px;
                margin-right: 8px;
            }
            
            /* Improved ability buttons */
            .ability-button-modern {
                width: 70px;
                height: 70px;
                background: linear-gradient(135deg, 
                    rgba(45, 10, 78, 0.9), 
                    rgba(74, 14, 122, 0.9)
                );
                border: 3px solid var(--ui-border);
                border-radius: 12px;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 32px;
                position: relative;
                overflow: hidden;
            }
            
            .ability-button-modern::before {
                content: '';
                position: absolute;
                top: -2px;
                left: -2px;
                right: -2px;
                bottom: -2px;
                background: linear-gradient(45deg, 
                    var(--ui-primary), 
                    var(--ui-secondary), 
                    var(--ui-accent)
                );
                border-radius: 12px;
                opacity: 0;
                transition: opacity 0.3s;
                z-index: -1;
            }
            
            .ability-button-modern:hover::before {
                opacity: 1;
                animation: glow 1.5s ease-in-out infinite;
            }
            
            .ability-button-modern:hover {
                transform: scale(1.1) translateY(-5px);
                box-shadow: 0 10px 30px rgba(157, 78, 221, 0.8);
            }
            
            .ability-cooldown {
                position: absolute;
                bottom: 5px;
                right: 5px;
                background: rgba(0, 0, 0, 0.8);
                border-radius: 4px;
                padding: 2px 6px;
                font-size: 12px;
                font-weight: bold;
            }
        `;
        document.head.appendChild(style);
        
        // Set CSS variables
        this.applyTheme(this.currentTheme);
    }
    
    applyTheme(themeName) {
        const theme = this.themes[themeName] || this.themes.fantasy;
        const root = document.documentElement;
        
        root.style.setProperty('--ui-primary', theme.primary);
        root.style.setProperty('--ui-secondary', theme.secondary);
        root.style.setProperty('--ui-accent', theme.accent);
        root.style.setProperty('--ui-background', theme.background);
        root.style.setProperty('--ui-border', theme.border);
        root.style.setProperty('--ui-text', theme.text);
        
        this.currentTheme = themeName;
        console.log(`🎨 UI theme changed to: ${themeName}`);
    }
    
    enhanceExistingUI() {
        // Enhance HUD panels
        const hudPanels = document.querySelectorAll('.hud');
        hudPanels.forEach(panel => {
            panel.classList.add('modern-panel');
        });
        
        // Enhance ability buttons
        const abilityButtons = document.querySelectorAll('.ability-button');
        abilityButtons.forEach(button => {
            button.classList.add('ability-button-modern');
        });
        
        // Enhance progress bars
        const progressBars = document.querySelectorAll('.bar');
        progressBars.forEach(bar => {
            bar.classList.add('modern-progress-bar');
        });
        
        const progressFills = document.querySelectorAll('.bar-fill');
        progressFills.forEach(fill => {
            fill.classList.add('modern-progress-fill');
        });
    }
    
    createModernElements() {
        // Create notification container
        this.notificationContainer = document.createElement('div');
        this.notificationContainer.id = 'modern-notifications';
        this.notificationContainer.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            z-index: 10000;
            pointer-events: none;
        `;
        document.body.appendChild(this.notificationContainer);
    }
    
    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = 'modern-notification';
        
        const icons = {
            info: 'ℹ️',
            success: '✅',
            warning: '⚠️',
            error: '❌',
            achievement: '🏆'
        };
        
        notification.innerHTML = `
            <span class="ui-icon">${icons[type] || icons.info}</span>
            ${message}
        `;
        
        this.notificationContainer.appendChild(notification);
        
        // Auto-remove after duration
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, duration);
    }
    
    createTooltip(element, text) {
        let tooltip = null;
        
        element.addEventListener('mouseenter', (e) => {
            tooltip = document.createElement('div');
            tooltip.className = 'modern-tooltip';
            tooltip.textContent = text;
            document.body.appendChild(tooltip);
            
            const rect = element.getBoundingClientRect();
            tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
            tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
        });
        
        element.addEventListener('mouseleave', () => {
            if (tooltip) {
                tooltip.remove();
                tooltip = null;
            }
        });
    }
    
    update(deltaTime) {
        // Update any animated UI elements
    }
    
    dispose() {
        if (this.notificationContainer) {
            this.notificationContainer.remove();
        }
        console.log('🎨 Modern UI System disposed');
    }
}
