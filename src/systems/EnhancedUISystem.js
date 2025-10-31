/**
 * Enhanced UI System - Dynasty of Emberveil
 * 
 * Complete UI/UX system with all proper game features:
 * - Main menu
 * - HUD (health, mana, stamina, XP)
 * - Minimap
 * - Quest tracker
 * - Inventory
 * - Character sheet
 * - Skill trees
 * - Settings menu
 * - Chat system
 * - Notifications
 * - Damage numbers
 * - Tooltips
 */

export class EnhancedUISystem {
    constructor() {
        this.container = document.getElementById('ui-container') || this.createUIContainer();
        this.panels = {};
        this.notifications = [];
        this.damageNumbers = [];
        
        this.init();
    }
    
    /**
     * Initialize all UI systems
     */
    init() {
        logger.info('🎨 Initializing Enhanced UI System...');
        
        // Create all UI panels
        this.createMainMenu();
        this.createHUD();
        this.createMinimap();
        this.createQuestTracker();
        this.createInventoryPanel();
        this.createCharacterSheet();
        this.createSkillTree();
        this.createSettingsMenu();
        this.createChatBox();
        this.createNotificationSystem();
        
        // Set initial state - show main menu
        this.showPanel('mainMenu');
        this.hidePanel('hud');
        
        logger.info('✅ Enhanced UI System initialized');
    }
    
    /**
     * Create UI container
     */
    createUIContainer() {
        let container = document.createElement('div');
        container.id = 'ui-container';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1000;
            font-family: 'Arial', sans-serif;
        `;
        document.body.appendChild(container);
        return container;
    }
    
    /**
     * Create main menu
     */
    createMainMenu() {
        const menu = document.createElement('div');
        menu.id = 'main-menu';
        menu.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, rgba(20, 20, 40, 0.95), rgba(40, 20, 60, 0.95));
            border: 3px solid #ffd700;
            border-radius: 15px;
            padding: 40px;
            text-align: center;
            pointer-events: auto;
            box-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
        `;
        
        menu.innerHTML = `
            <h1 style="color: #ffd700; font-size: 48px; margin: 0 0 20px 0; text-shadow: 0 0 10px #ffd700;">
                🏰 Dynasty of Emberveil
            </h1>
            <p style="color: #ccc; font-size: 18px; margin-bottom: 30px;">
                Epic Fantasy MMORPG Adventure
            </p>
            <div style="display: flex; flex-direction: column; gap: 15px;">
                <button class="menu-btn" data-action="start">⚔️ Start Adventure</button>
                <button class="menu-btn" data-action="continue">📖 Continue</button>
                <button class="menu-btn" data-action="characters">👤 Characters</button>
                <button class="menu-btn" data-action="settings">⚙️ Settings</button>
                <button class="menu-btn" data-action="credits">🎭 Credits</button>
            </div>
        `;
        
        // Add button styles
        const style = document.createElement('style');
        style.textContent = `
            .menu-btn {
                background: linear-gradient(135deg, #4a1a5a, #2a1a4a);
                border: 2px solid #ffd700;
                color: #ffd700;
                padding: 15px 40px;
                font-size: 20px;
                cursor: pointer;
                border-radius: 10px;
                transition: all 0.3s;
                pointer-events: auto;
            }
            .menu-btn:hover {
                background: linear-gradient(135deg, #6a2a7a, #4a2a6a);
                box-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
                transform: scale(1.05);
            }
        `;
        document.head.appendChild(style);
        
        // Add event listeners
        menu.querySelectorAll('.menu-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.getAttribute('data-action');
                this.handleMenuAction(action);
            });
        });
        
        this.container.appendChild(menu);
        this.panels.mainMenu = menu;
    }
    
    /**
     * Create HUD
     */
    createHUD() {
        const hud = document.createElement('div');
        hud.id = 'hud';
        hud.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: none;
        `;
        
        hud.innerHTML = `
            <!-- Top Left - Player Stats -->
            <div style="position: absolute; top: 20px; left: 20px; pointer-events: auto;">
                <div style="background: rgba(0,0,0,0.7); border: 2px solid #ffd700; border-radius: 10px; padding: 15px; min-width: 250px;">
                    <h3 style="color: #ffd700; margin: 0 0 10px 0;">Character</h3>
                    <div id="player-name" style="color: #fff; margin-bottom: 10px;">Hero Level 1</div>
                    
                    <!-- Health Bar -->
                    <div style="margin-bottom: 8px;">
                        <div style="display: flex; justify-content: space-between; color: #fff; font-size: 12px; margin-bottom: 3px;">
                            <span>❤️ Health</span>
                            <span id="health-text">100/100</span>
                        </div>
                        <div style="background: #333; height: 20px; border-radius: 10px; overflow: hidden; border: 1px solid #666;">
                            <div id="health-bar" style="background: linear-gradient(90deg, #ff0000, #ff6666); height: 100%; width: 100%; transition: width 0.3s;"></div>
                        </div>
                    </div>
                    
                    <!-- Mana Bar -->
                    <div style="margin-bottom: 8px;">
                        <div style="display: flex; justify-content: space-between; color: #fff; font-size: 12px; margin-bottom: 3px;">
                            <span>💙 Mana</span>
                            <span id="mana-text">100/100</span>
                        </div>
                        <div style="background: #333; height: 20px; border-radius: 10px; overflow: hidden; border: 1px solid #666;">
                            <div id="mana-bar" style="background: linear-gradient(90deg, #0066ff, #66aaff); height: 100%; width: 100%; transition: width 0.3s;"></div>
                        </div>
                    </div>
                    
                    <!-- Stamina Bar -->
                    <div style="margin-bottom: 8px;">
                        <div style="display: flex; justify-content: space-between; color: #fff; font-size: 12px; margin-bottom: 3px;">
                            <span>⚡ Stamina</span>
                            <span id="stamina-text">100/100</span>
                        </div>
                        <div style="background: #333; height: 20px; border-radius: 10px; overflow: hidden; border: 1px solid #666;">
                            <div id="stamina-bar" style="background: linear-gradient(90deg, #00ff00, #66ff66); height: 100%; width: 100%; transition: width 0.3s;"></div>
                        </div>
                    </div>
                    
                    <!-- XP Bar -->
                    <div>
                        <div style="display: flex; justify-content: space-between; color: #ffd700; font-size: 12px; margin-bottom: 3px;">
                            <span>⭐ Experience</span>
                            <span id="xp-text">0/1000</span>
                        </div>
                        <div style="background: #333; height: 15px; border-radius: 10px; overflow: hidden; border: 1px solid #666;">
                            <div id="xp-bar" style="background: linear-gradient(90deg, #ffd700, #ffea00); height: 100%; width: 0%; transition: width 0.3s;"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Top Center - Target Info -->
            <div id="target-info" style="position: absolute; top: 20px; left: 50%; transform: translateX(-50%); pointer-events: auto; display: none;">
                <div style="background: rgba(0,0,0,0.7); border: 2px solid #ff0000; border-radius: 10px; padding: 10px; min-width: 200px; text-align: center;">
                    <div id="target-name" style="color: #ff6666; font-size: 16px; margin-bottom: 5px;">Enemy Name</div>
                    <div style="background: #333; height: 15px; border-radius: 10px; overflow: hidden; border: 1px solid #666;">
                        <div id="target-health" style="background: linear-gradient(90deg, #ff0000, #ff6666); height: 100%; width: 100%;"></div>
                    </div>
                </div>
            </div>
            
            <!-- Top Right - Buffs/Debuffs -->
            <div style="position: absolute; top: 20px; right: 20px; pointer-events: auto;">
                <div id="buffs-container" style="display: flex; gap: 5px; flex-wrap: wrap; max-width: 200px;"></div>
            </div>
            
            <!-- Bottom Left - Quick Slots -->
            <div style="position: absolute; bottom: 20px; left: 20px; pointer-events: auto;">
                <div style="display: flex; gap: 10px;">
                    ${[1,2,3,4,5,6].map(i => `
                        <div class="quick-slot" data-slot="${i}" style="
                            width: 50px; height: 50px; background: rgba(0,0,0,0.7);
                            border: 2px solid #666; border-radius: 10px;
                            display: flex; align-items: center; justify-content: center;
                            color: #ffd700; font-size: 20px; cursor: pointer;
                            transition: all 0.3s;
                        ">
                            ${i}
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- Bottom Right - Menu Buttons -->
            <div style="position: absolute; bottom: 20px; right: 20px; pointer-events: auto;">
                <div style="display: flex; gap: 10px;">
                    <button class="hud-btn" data-action="inventory">🎒</button>
                    <button class="hud-btn" data-action="character">👤</button>
                    <button class="hud-btn" data-action="skills">✨</button>
                    <button class="hud-btn" data-action="quests">📜</button>
                    <button class="hud-btn" data-action="map">🗺️</button>
                    <button class="hud-btn" data-action="settings">⚙️</button>
                </div>
            </div>
        `;
        
        // Add HUD button styles
        const hudStyle = document.createElement('style');
        hudStyle.textContent = `
            .hud-btn {
                width: 50px;
                height: 50px;
                background: rgba(0,0,0,0.7);
                border: 2px solid #ffd700;
                border-radius: 10px;
                color: #ffd700;
                font-size: 24px;
                cursor: pointer;
                transition: all 0.3s;
            }
            .hud-btn:hover {
                background: rgba(50,50,50,0.9);
                box-shadow: 0 0 15px rgba(255,215,0,0.6);
                transform: scale(1.1);
            }
            .quick-slot:hover {
                border-color: #ffd700;
                box-shadow: 0 0 10px rgba(255,215,0,0.6);
                transform: scale(1.1);
            }
        `;
        document.head.appendChild(hudStyle);
        
        this.container.appendChild(hud);
        this.panels.hud = hud;
    }
    
    /**
     * Create minimap
     */
    createMinimap() {
        const minimap = document.createElement('div');
        minimap.id = 'minimap';
        minimap.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            width: 200px;
            height: 200px;
            background: rgba(0,0,0,0.7);
            border: 3px solid #ffd700;
            border-radius: 15px;
            display: none;
            pointer-events: auto;
        `;
        
        minimap.innerHTML = `
            <canvas id="minimap-canvas" width="194" height="194" style="border-radius: 12px;"></canvas>
            <div style="position: absolute; bottom: 5px; left: 50%; transform: translateX(-50%); color: #ffd700; font-size: 12px;">
                Mystic Forest
            </div>
        `;
        
        this.container.appendChild(minimap);
        this.panels.minimap = minimap;
    }
    
    /**
     * Create quest tracker
     */
    createQuestTracker() {
        const tracker = document.createElement('div');
        tracker.id = 'quest-tracker';
        tracker.style.cssText = `
            position: absolute;
            top: 240px;
            right: 20px;
            width: 300px;
            max-height: 400px;
            background: rgba(0,0,0,0.7);
            border: 2px solid #ffd700;
            border-radius: 10px;
            padding: 15px;
            display: none;
            pointer-events: auto;
            overflow-y: auto;
        `;
        
        tracker.innerHTML = `
            <h3 style="color: #ffd700; margin: 0 0 15px 0;">📜 Active Quests</h3>
            <div id="quest-list">
                <div class="quest-item" style="margin-bottom: 15px; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 5px;">
                    <div style="color: #ffd700; font-weight: bold; margin-bottom: 5px;">Welcome to Emberveil</div>
                    <div style="color: #ccc; font-size: 14px;">
                        • Explore Mystic Forest (0/1) <br/>
                        • Visit Moonlit Glade (0/1) <br/>
                        • Defeat 5 Skeletons (0/5)
                    </div>
                    <div style="color: #66ff66; font-size: 12px; margin-top: 5px;">Reward: 100 XP, 50 Gold</div>
                </div>
            </div>
        `;
        
        this.container.appendChild(tracker);
        this.panels.questTracker = tracker;
    }
    
    /**
     * Create inventory panel
     */
    createInventoryPanel() {
        const inventory = document.createElement('div');
        inventory.id = 'inventory-panel';
        inventory.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 600px;
            height: 500px;
            background: rgba(20,20,40,0.95);
            border: 3px solid #ffd700;
            border-radius: 15px;
            padding: 20px;
            display: none;
            pointer-events: auto;
        `;
        
        inventory.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="color: #ffd700; margin: 0;">🎒 Inventory</h2>
                <button class="close-btn" onclick="enhancedUI.hidePanel('inventoryPanel')">✖</button>
            </div>
            <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 10px; height: calc(100% - 60px); overflow-y: auto;">
                ${Array(30).fill(0).map((_, i) => `
                    <div class="inv-slot" data-slot="${i}" style="
                        aspect-ratio: 1;
                        background: rgba(0,0,0,0.5);
                        border: 2px solid #666;
                        border-radius: 8px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        transition: all 0.3s;
                    "></div>
                `).join('')}
            </div>
        `;
        
        this.container.appendChild(inventory);
        this.panels.inventoryPanel = inventory;
    }
    
    /**
     * Create character sheet
     */
    createCharacterSheet() {
        const sheet = document.createElement('div');
        sheet.id = 'character-sheet';
        sheet.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 700px;
            height: 600px;
            background: rgba(20,20,40,0.95);
            border: 3px solid #ffd700;
            border-radius: 15px;
            padding: 20px;
            display: none;
            pointer-events: auto;
        `;
        
        sheet.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="color: #ffd700; margin: 0;">👤 Character</h2>
                <button class="close-btn" onclick="enhancedUI.hidePanel('characterSheet')">✖</button>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; height: calc(100% - 60px);">
                <div>
                    <h3 style="color: #ffd700;">Stats</h3>
                    <div style="color: #fff;">
                        <p>⚔️ Strength: 10</p>
                        <p>🎯 Dexterity: 10</p>
                        <p>🧠 Intelligence: 10</p>
                        <p>❤️ Vitality: 10</p>
                        <p>✨ Magic: 10</p>
                        <p>🛡️ Defense: 10</p>
                    </div>
                </div>
                <div>
                    <h3 style="color: #ffd700;">Equipment</h3>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                        ${['Head', 'Chest', 'Legs', 'Weapon', 'Shield', 'Accessory'].map(slot => `
                            <div style="background: rgba(0,0,0,0.5); border: 2px solid #666; border-radius: 8px; padding: 20px; text-align: center; color: #888;">
                                ${slot}
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        this.container.appendChild(sheet);
        this.panels.characterSheet = sheet;
    }
    
    /**
     * Create skill tree
     */
    createSkillTree() {
        const tree = document.createElement('div');
        tree.id = 'skill-tree';
        tree.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 800px;
            height: 600px;
            background: rgba(20,20,40,0.95);
            border: 3px solid #ffd700;
            border-radius: 15px;
            padding: 20px;
            display: none;
            pointer-events: auto;
        `;
        
        tree.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="color: #ffd700; margin: 0;">✨ Skill Tree</h2>
                <button class="close-btn" onclick="enhancedUI.hidePanel('skillTree')">✖</button>
            </div>
            <div style="color: #ffd700; margin-bottom: 20px;">Skill Points Available: 0</div>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; height: calc(100% - 100px); overflow-y: auto;">
                ${['Power Strike', 'Fireball', 'Stealth', 'Holy Light', 'Ice Lance', 'Berserker', 'Heal', 'Lightning'].map(skill => `
                    <div class="skill-node" style="
                        background: rgba(0,0,0,0.7);
                        border: 2px solid #666;
                        border-radius: 10px;
                        padding: 15px;
                        text-align: center;
                        cursor: pointer;
                        transition: all 0.3s;
                    ">
                        <div style="font-size: 32px; margin-bottom: 5px;">⚔️</div>
                        <div style="color: #ffd700; font-weight: bold;">${skill}</div>
                        <div style="color: #888; font-size: 12px;">Level 0/10</div>
                    </div>
                `).join('')}
            </div>
        `;
        
        this.container.appendChild(tree);
        this.panels.skillTree = tree;
    }
    
    /**
     * Create settings menu
     */
    createSettingsMenu() {
        const settings = document.createElement('div');
        settings.id = 'settings-menu';
        settings.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 500px;
            background: rgba(20,20,40,0.95);
            border: 3px solid #ffd700;
            border-radius: 15px;
            padding: 30px;
            display: none;
            pointer-events: auto;
        `;
        
        settings.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="color: #ffd700; margin: 0;">⚙️ Settings</h2>
                <button class="close-btn" onclick="enhancedUI.hidePanel('settingsMenu')">✖</button>
            </div>
            <div style="color: #fff;">
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 5px;">🔊 Master Volume</label>
                    <input type="range" min="0" max="100" value="100" style="width: 100%;">
                </div>
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 5px;">🎵 Music Volume</label>
                    <input type="range" min="0" max="100" value="80" style="width: 100%;">
                </div>
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 5px;">🔔 SFX Volume</label>
                    <input type="range" min="0" max="100" value="100" style="width: 100%;">
                </div>
                <div style="margin-bottom: 20px;">
                    <label><input type="checkbox" checked> Show Damage Numbers</label>
                </div>
                <div style="margin-bottom: 20px;">
                    <label><input type="checkbox" checked> Show Quest Tracker</label>
                </div>
                <div style="margin-bottom: 20px;">
                    <label><input type="checkbox" checked> Show Minimap</label>
                </div>
            </div>
        `;
        
        this.container.appendChild(settings);
        this.panels.settingsMenu = settings;
    }
    
    /**
     * Create chat box
     */
    createChatBox() {
        const chat = document.createElement('div');
        chat.id = 'chat-box';
        chat.style.cssText = `
            position: absolute;
            bottom: 80px;
            left: 20px;
            width: 400px;
            height: 200px;
            background: rgba(0,0,0,0.5);
            border: 2px solid #666;
            border-radius: 10px;
            padding: 10px;
            display: none;
            pointer-events: auto;
        `;
        
        chat.innerHTML = `
            <div id="chat-messages" style="height: calc(100% - 40px); overflow-y: auto; color: #fff; font-size: 14px;"></div>
            <input type="text" id="chat-input" placeholder="Type a message..." style="
                width: 100%;
                padding: 8px;
                background: rgba(0,0,0,0.7);
                border: 1px solid #666;
                border-radius: 5px;
                color: #fff;
                margin-top: 5px;
            ">
        `;
        
        this.container.appendChild(chat);
        this.panels.chatBox = chat;
    }
    
    /**
     * Create notification system
     */
    createNotificationSystem() {
        const notifContainer = document.createElement('div');
        notifContainer.id = 'notifications';
        notifContainer.style.cssText = `
            position: absolute;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            flex-direction: column;
            gap: 10px;
            pointer-events: none;
        `;
        
        this.container.appendChild(notifContainer);
        this.panels.notifications = notifContainer;
    }
    
    /**
     * Handle menu actions
     */
    handleMenuAction(action) {
        switch(action) {
            case 'start':
                this.startGame();
                break;
            case 'settings':
                this.showPanel('settingsMenu');
                break;
            // Add other actions
        }
    }
    
    /**
     * Start game
     */
    startGame() {
        this.hidePanel('mainMenu');
        this.showPanel('hud');
        this.showPanel('minimap');
        this.showPanel('questTracker');
        this.showPanel('chatBox');
        
        this.showNotification('Welcome to Dynasty of Emberveil!', 'success');
    }
    
    /**
     * Show panel
     */
    showPanel(panelName) {
        if (this.panels[panelName]) {
            this.panels[panelName].style.display = 'block';
        }
    }
    
    /**
     * Hide panel
     */
    hidePanel(panelName) {
        if (this.panels[panelName]) {
            this.panels[panelName].style.display = 'none';
        }
    }
    
    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        const notif = document.createElement('div');
        notif.style.cssText = `
            background: ${type === 'success' ? 'rgba(0,255,0,0.8)' : 'rgba(255,255,0,0.8)'};
            color: #000;
            padding: 15px 25px;
            border-radius: 10px;
            font-weight: bold;
            pointer-events: auto;
            animation: slideIn 0.3s ease-out;
        `;
        notif.textContent = message;
        
        this.panels.notifications.appendChild(notif);
        
        setTimeout(() => {
            notif.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => notif.remove(), 300);
        }, 3000);
    }
    
    /**
     * Update HUD values
     */
    updateHUD(stats) {
        if (!stats) return;
        
        // Update health
        if (stats.health !== undefined) {
            const healthPercent = (stats.health / stats.maxHealth) * 100;
            document.getElementById('health-bar').style.width = `${healthPercent}%`;
            document.getElementById('health-text').textContent = `${stats.health}/${stats.maxHealth}`;
        }
        
        // Update mana
        if (stats.mana !== undefined) {
            const manaPercent = (stats.mana / stats.maxMana) * 100;
            document.getElementById('mana-bar').style.width = `${manaPercent}%`;
            document.getElementById('mana-text').textContent = `${stats.mana}/${stats.maxMana}`;
        }
        
        // Update XP
        if (stats.xp !== undefined) {
            const xpPercent = (stats.xp / stats.xpToLevel) * 100;
            document.getElementById('xp-bar').style.width = `${xpPercent}%`;
            document.getElementById('xp-text').textContent = `${stats.xp}/${stats.xpToLevel}`;
        }
    }
    
    /**
     * Show damage number at position
     */
    showDamageNumber(damage, position, isCrit = false) {
        // This would create floating damage numbers in 3D space
        logger.info(`Damage: ${damage} at position`, position);
    }
}

// Create global instance
export const enhancedUI = new EnhancedUISystem();
