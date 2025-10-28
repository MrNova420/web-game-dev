/**
 * AdvancedThemeSystem - Rich fantasy color themes with dynamic switching
 * Replaces simple purple theme with immersive, multi-layered color palettes
 */

export class AdvancedThemeSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.currentTheme = 'fantasy_realm';
        
        // Rich fantasy color themes
        this.themes = {
            fantasy_realm: {
                name: 'Fantasy Realm',
                primary: {
                    dark: '#0a0e27',      // Deep midnight blue
                    medium: '#1a2847',    // Royal blue
                    light: '#2d4a7c'      // Sky blue
                },
                secondary: {
                    gold: '#d4af37',      // Rich gold
                    crimson: '#dc143c',   // Crimson red
                    emerald: '#50c878'    // Emerald green
                },
                magical: {
                    arcane: '#4169e1',    // Royal blue magic
                    fire: '#ff4500',      // Fire orange
                    nature: '#32cd32',    // Lime green
                    frost: '#00ced1',     // Dark turquoise
                    shadow: '#9370db'     // Medium purple
                },
                seductive: {
                    rose: '#ff69b4',      // Hot pink
                    wine: '#722f37',      // Wine red
                    midnight: '#191970',  // Midnight blue
                    gold: '#ffb6c1'       // Light pink gold
                },
                environment: {
                    grass: '#228b22',     // Forest green
                    stone: '#696969',     // Dim gray
                    water: '#4682b4',     // Steel blue
                    lava: '#ff4500',      // Orange red
                    crystal: '#e0ffff'    // Light cyan
                }
            },
            
            dark_fantasy: {
                name: 'Dark Fantasy',
                primary: {
                    dark: '#0d0d0d',      // Almost black
                    medium: '#1a1a1a',    // Very dark gray
                    light: '#2d2d2d'      // Dark gray
                },
                secondary: {
                    blood: '#8b0000',     // Dark red
                    bone: '#f5f5dc',      // Beige
                    shadow: '#36013f'     // Deep purple
                },
                magical: {
                    arcane: '#8a2be2',    // Blue violet
                    fire: '#b22222',      // Fire brick
                    nature: '#2e8b57',    // Sea green
                    frost: '#4682b4',     // Steel blue
                    shadow: '#483d8b'     // Dark slate blue
                },
                seductive: {
                    rose: '#c71585',      // Medium violet red
                    wine: '#800020',      // Burgundy
                    midnight: '#0f0f1e',  // Dark midnight
                    gold: '#b8860b'       // Dark goldenrod
                },
                environment: {
                    grass: '#1a4d2e',     // Dark green
                    stone: '#36454f',     // Charcoal
                    water: '#2f4f4f',     // Dark slate gray
                    lava: '#cc0000',      // Dark red
                    crystal: '#778899'    // Light slate gray
                }
            },
            
            arcane_sanctum: {
                name: 'Arcane Sanctum',
                primary: {
                    dark: '#1a0033',      // Deep purple
                    medium: '#2e1a47',    // Dark purple
                    light: '#4a2c6b'      // Purple
                },
                secondary: {
                    arcane: '#9d4edd',    // Bright purple
                    gold: '#ffd700',      // Gold
                    cyan: '#00ffff'       // Cyan
                },
                magical: {
                    arcane: '#9370db',    // Medium purple
                    fire: '#ff00ff',      // Magenta
                    nature: '#00ff00',    // Lime
                    frost: '#00ffff',     // Cyan
                    shadow: '#8b00ff'     // Electric purple
                },
                seductive: {
                    rose: '#ff00ff',      // Fuchsia
                    wine: '#800080',      // Purple
                    midnight: '#4b0082',  // Indigo
                    gold: '#da70d6'       // Orchid
                },
                environment: {
                    grass: '#9370db',     // Magical grass
                    stone: '#8470ff',     // Light slate blue
                    water: '#7b68ee',     // Medium slate blue
                    lava: '#ff1493',      // Deep pink
                    crystal: '#e6e6fa'    // Lavender
                }
            },
            
            nature_grove: {
                name: 'Nature Grove',
                primary: {
                    dark: '#0a2e0a',      // Dark green
                    medium: '#1a4d1a',    // Forest green
                    light: '#2d7a2d'      // Medium green
                },
                secondary: {
                    gold: '#daa520',      // Goldenrod
                    brown: '#8b4513',     // Saddle brown
                    emerald: '#50c878'    // Emerald
                },
                magical: {
                    arcane: '#00fa9a',    // Medium spring green
                    fire: '#ff8c00',      // Dark orange
                    nature: '#00ff00',    // Lime
                    frost: '#00ced1',     // Dark turquoise
                    shadow: '#556b2f'     // Dark olive green
                },
                seductive: {
                    rose: '#ff69b4',      // Hot pink
                    wine: '#8b4513',      // Saddle brown
                    midnight: '#2f4f2f',  // Dark slate gray
                    gold: '#ffd700'       // Gold
                },
                environment: {
                    grass: '#228b22',     // Forest green
                    stone: '#808080',     // Gray
                    water: '#4682b4',     // Steel blue
                    lava: '#ff6347',      // Tomato
                    crystal: '#98fb98'    // Pale green
                }
            },
            
            infernal_depths: {
                name: 'Infernal Depths',
                primary: {
                    dark: '#1a0000',      // Very dark red
                    medium: '#330000',    // Dark red
                    light: '#4d0000'      // Dark maroon
                },
                secondary: {
                    flame: '#ff4500',     // Orange red
                    ash: '#696969',       // Dim gray
                    lava: '#ff6347'       // Tomato
                },
                magical: {
                    arcane: '#ff0000',    // Red
                    fire: '#ff4500',      // Orange red
                    nature: '#8b0000',    // Dark red
                    frost: '#4169e1',     // Royal blue
                    shadow: '#2f1f1f'     // Very dark brown
                },
                seductive: {
                    rose: '#dc143c',      // Crimson
                    wine: '#800020',      // Burgundy
                    midnight: '#2b0000',  // Very dark red
                    gold: '#ff8c00'       // Dark orange
                },
                environment: {
                    grass: '#8b0000',     // Dark red
                    stone: '#2f1f1f',     // Very dark brown
                    water: '#ff4500',     // Orange red (lava)
                    lava: '#ff0000',      // Pure red
                    crystal: '#ff6347'    // Tomato
                }
            }
        };
        
        this.init();
    }
    
    init() {
        this.applyTheme(this.currentTheme);
        console.log('🎨 Advanced Theme System initialized with', this.themes[this.currentTheme].name);
    }
    
    applyTheme(themeName) {
        if (!this.themes[themeName]) {
            console.warn(`Theme ${themeName} not found, using default`);
            themeName = 'fantasy_realm';
        }
        
        this.currentTheme = themeName;
        const theme = this.themes[themeName];
        
        // Apply to CSS variables for global styling
        this.applyCSSVariables(theme);
        
        // Update scene lighting
        this.updateSceneLighting(theme);
        
        // Update UI theme
        this.updateUITheme(theme);
        
        // Update particle effects
        if (this.gameEngine.particleSystem) {
            this.updateParticleColors(theme);
        }
        
        console.log(`🎨 Theme switched to: ${theme.name}`);
    }
    
    applyCSSVariables(theme) {
        const root = document.documentElement;
        
        // Primary colors
        root.style.setProperty('--color-primary-dark', theme.primary.dark);
        root.style.setProperty('--color-primary-medium', theme.primary.medium);
        root.style.setProperty('--color-primary-light', theme.primary.light);
        
        // Secondary colors
        Object.entries(theme.secondary).forEach(([key, value]) => {
            root.style.setProperty(`--color-secondary-${key}`, value);
        });
        
        // Magical colors
        Object.entries(theme.magical).forEach(([key, value]) => {
            root.style.setProperty(`--color-magic-${key}`, value);
        });
        
        // Seductive colors
        Object.entries(theme.seductive).forEach(([key, value]) => {
            root.style.setProperty(`--color-seductive-${key}`, value);
        });
        
        // Environment colors
        Object.entries(theme.environment).forEach(([key, value]) => {
            root.style.setProperty(`--color-env-${key}`, value);
        });
        
        // Apply to body background
        document.body.style.background = `linear-gradient(135deg, ${theme.primary.dark} 0%, ${theme.primary.medium} 50%, ${theme.primary.light} 100%)`;
    }
    
    updateSceneLighting(theme) {
        if (!this.gameEngine.scene) return;
        
        // Remove old lights
        const lightsToRemove = [];
        this.gameEngine.scene.children.forEach(child => {
            if (child.isLight && child.userData.themeLight) {
                lightsToRemove.push(child);
            }
        });
        lightsToRemove.forEach(light => this.gameEngine.scene.remove(light));
        
        // Add new themed lighting
        const ambientLight = new THREE.AmbientLight(
            this.hexToColor(theme.magical.arcane),
            0.4
        );
        ambientLight.userData.themeLight = true;
        this.gameEngine.scene.add(ambientLight);
        
        // Add directional light with theme color
        const dirLight = new THREE.DirectionalLight(
            this.hexToColor(theme.secondary.gold || theme.magical.arcane),
            0.6
        );
        dirLight.position.set(10, 20, 10);
        dirLight.castShadow = true;
        dirLight.userData.themeLight = true;
        this.gameEngine.scene.add(dirLight);
        
        // Add accent lights
        const accentColors = [
            theme.magical.fire,
            theme.magical.frost,
            theme.magical.nature
        ];
        
        accentColors.forEach((color, i) => {
            const angle = (i / accentColors.length) * Math.PI * 2;
            const light = new THREE.PointLight(
                this.hexToColor(color),
                0.5,
                20
            );
            light.position.set(
                Math.cos(angle) * 15,
                5,
                Math.sin(angle) * 15
            );
            light.userData.themeLight = true;
            this.gameEngine.scene.add(light);
        });
        
        // Update fog
        if (this.gameEngine.scene.fog) {
            this.gameEngine.scene.fog.color = this.hexToColor(theme.primary.medium);
        }
    }
    
    updateUITheme(theme) {
        // Update loading screen
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.background = `linear-gradient(135deg, ${theme.primary.dark} 0%, ${theme.primary.medium} 50%, ${theme.primary.light} 100%)`;
        }
        
        // Update main menu
        const mainMenu = document.getElementById('main-menu');
        if (mainMenu) {
            mainMenu.style.background = `linear-gradient(135deg, ${theme.primary.dark} 0%, ${theme.primary.medium} 50%, ${theme.primary.light} 100%)`;
        }
        
        // Update buttons and UI elements with new colors
        this.updateButtonStyles(theme);
    }
    
    updateButtonStyles(theme) {
        const style = document.createElement('style');
        style.id = 'theme-button-styles';
        
        // Remove old style if exists
        const oldStyle = document.getElementById('theme-button-styles');
        if (oldStyle) oldStyle.remove();
        
        style.textContent = `
            button, .btn {
                background: linear-gradient(135deg, ${theme.primary.medium}, ${theme.primary.light}) !important;
                border: 2px solid ${theme.secondary.gold || theme.magical.arcane} !important;
                box-shadow: 0 0 20px ${theme.magical.arcane}50 !important;
            }
            
            button:hover, .btn:hover {
                box-shadow: 0 0 30px ${theme.magical.arcane}80 !important;
                border-color: ${theme.seductive.rose} !important;
            }
            
            .ui-panel {
                background: ${theme.primary.dark}ee !important;
                border: 2px solid ${theme.secondary.gold || theme.magical.arcane} !important;
            }
            
            .text-primary {
                color: ${theme.secondary.gold || theme.magical.arcane} !important;
            }
            
            .text-secondary {
                color: ${theme.seductive.rose} !important;
            }
        `;
        
        document.head.appendChild(style);
    }
    
    updateParticleColors(theme) {
        // Update particle system colors based on theme
        if (this.gameEngine.particleSystem) {
            this.gameEngine.particleSystem.defaultColors = {
                primary: this.hexToColor(theme.magical.arcane),
                secondary: this.hexToColor(theme.magical.fire),
                accent: this.hexToColor(theme.seductive.rose)
            };
        }
    }
    
    hexToColor(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!result) return 0xffffff;
        
        const r = parseInt(result[1], 16);
        const g = parseInt(result[2], 16);
        const b = parseInt(result[3], 16);
        
        return (r << 16) | (g << 8) | b;
    }
    
    getThemeColor(category, key) {
        const theme = this.themes[this.currentTheme];
        if (theme[category] && theme[category][key]) {
            return theme[category][key];
        }
        return '#ffffff';
    }
    
    switchTheme(themeName) {
        this.applyTheme(themeName);
        
        // Save preference
        localStorage.setItem('dynasty_theme', themeName);
        
        // Trigger visual transition effect
        this.playThemeTransitionEffect();
    }
    
    playThemeTransitionEffect() {
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: ${this.getThemeColor('magical', 'arcane')};
            opacity: 0.5;
            pointer-events: none;
            z-index: 9999;
        `;
        
        document.body.appendChild(flash);
        
        setTimeout(() => {
            flash.style.transition = 'opacity 0.5s';
            flash.style.opacity = '0';
            setTimeout(() => flash.remove(), 500);
        }, 50);
    }
    
    getAvailableThemes() {
        return Object.keys(this.themes).map(key => ({
            id: key,
            name: this.themes[key].name
        }));
    }
    
    createThemeSwitcher() {
        const container = document.createElement('div');
        container.id = 'theme-switcher';
        container.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: ${this.getThemeColor('primary', 'dark')}ee;
            border: 2px solid ${this.getThemeColor('secondary', 'gold')};
            border-radius: 10px;
            padding: 15px;
            z-index: 1000;
            color: white;
        `;
        
        const title = document.createElement('h4');
        title.textContent = '🎨 Themes';
        title.style.margin = '0 0 10px 0';
        container.appendChild(title);
        
        this.getAvailableThemes().forEach(theme => {
            const btn = document.createElement('button');
            btn.textContent = theme.name;
            btn.style.cssText = `
                display: block;
                width: 100%;
                margin: 5px 0;
                padding: 8px;
                border-radius: 5px;
                cursor: pointer;
            `;
            
            if (theme.id === this.currentTheme) {
                btn.style.fontWeight = 'bold';
            }
            
            btn.addEventListener('click', () => {
                this.switchTheme(theme.id);
                // Update button states
                container.querySelectorAll('button').forEach(b => {
                    b.style.fontWeight = 'normal';
                });
                btn.style.fontWeight = 'bold';
            });
            
            container.appendChild(btn);
        });
        
        document.body.appendChild(container);
    }
    
    update(deltaTime) {
        // Animate theme-based effects
        if (this.gameEngine.scene) {
            // Slowly rotate accent lights
            this.gameEngine.scene.children.forEach(child => {
                if (child.isLight && child.userData.themeLight && child.isPointLight) {
                    const angle = Date.now() * 0.0005;
                    const radius = 15;
                    child.position.x = Math.cos(angle) * radius;
                    child.position.z = Math.sin(angle) * radius;
                }
            });
        }
    }
}
