/**
 * AdvancedUIInterfaceSystem - Rich, animated UI with anime-inspired effects
 * Advanced menus, pop-ups, character displays, and interactive interfaces
 */

export class AdvancedUIInterfaceSystem {
    constructor() {
        this.activeMenus = new Map();
        this.animations = [];
        this.initializeStyles();
        this.createMainInterfaces();
    }

    initializeStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .advanced-ui-container {
                position: fixed;
                pointer-events: none;
                z-index: 1000;
                font-family: 'Arial', sans-serif;
            }

            .advanced-ui-container * {
                pointer-events: auto;
            }

            .character-display-panel {
                position: fixed;
                top: 20px;
                left: 20px;
                width: 350px;
                background: linear-gradient(135deg, rgba(20, 20, 40, 0.95), rgba(40, 20, 60, 0.95));
                border: 3px solid #8b00ff;
                border-radius: 20px;
                padding: 20px;
                box-shadow: 0 0 30px rgba(139, 0, 255, 0.6), inset 0 0 20px rgba(139, 0, 255, 0.2);
                animation: slideInLeft 0.5s ease-out, glowPulse 2s infinite;
            }

            .character-portrait {
                width: 100px;
                height: 100px;
                border-radius: 50%;
                border: 4px solid #ffd700;
                background: linear-gradient(135deg, #4b0082, #8b00ff);
                margin: 0 auto 15px;
                box-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
                position: relative;
                overflow: hidden;
                animation: rotateBorder 3s linear infinite;
            }

            .character-portrait::before {
                content: '';
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%);
                animation: shine 3s infinite;
            }

            .character-name {
                text-align: center;
                font-size: 24px;
                font-weight: bold;
                color: #ffd700;
                text-shadow: 0 0 10px #ff8800, 2px 2px 4px #000;
                margin-bottom: 10px;
                animation: textGlow 2s infinite;
            }

            .character-class {
                text-align: center;
                font-size: 16px;
                color: #00ffff;
                text-shadow: 0 0 8px #00aaaa;
                margin-bottom: 15px;
            }

            .stat-bar-container {
                margin: 10px 0;
                position: relative;
            }

            .stat-label {
                display: flex;
                justify-content: space-between;
                color: #ffffff;
                font-size: 14px;
                margin-bottom: 5px;
                text-shadow: 1px 1px 2px #000;
            }

            .stat-bar {
                height: 24px;
                background: linear-gradient(90deg, rgba(0,0,0,0.7), rgba(50,50,50,0.7));
                border-radius: 12px;
                border: 2px solid rgba(255,255,255,0.3);
                overflow: hidden;
                position: relative;
                box-shadow: inset 0 2px 4px rgba(0,0,0,0.5);
            }

            .stat-fill {
                height: 100%;
                transition: width 0.3s ease;
                position: relative;
                border-radius: 10px;
            }

            .stat-fill.hp {
                background: linear-gradient(90deg, #ff0000, #ff6600);
                box-shadow: 0 0 10px rgba(255, 0, 0, 0.8);
            }

            .stat-fill.mp {
                background: linear-gradient(90deg, #0000ff, #00ffff);
                box-shadow: 0 0 10px rgba(0, 0, 255, 0.8);
            }

            .stat-fill.exp {
                background: linear-gradient(90deg, #ffd700, #ffaa00);
                box-shadow: 0 0 10px rgba(255, 215, 0, 0.8);
            }

            .stat-fill::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 50%;
                background: linear-gradient(180deg, rgba(255,255,255,0.4), transparent);
                border-radius: 10px 10px 0 0;
            }

            .stat-text {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: #fff;
                font-weight: bold;
                text-shadow: 2px 2px 4px #000;
                font-size: 13px;
            }

            .ability-bar {
                display: flex;
                gap: 10px;
                margin-top: 15px;
                justify-content: center;
            }

            .ability-button {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                border: 3px solid #8b00ff;
                background: linear-gradient(135deg, rgba(70, 0, 150, 0.9), rgba(139, 0, 255, 0.9));
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                transition: all 0.2s;
                box-shadow: 0 4px 8px rgba(0,0,0,0.5), 0 0 15px rgba(139, 0, 255, 0.6);
                position: relative;
            }

            .ability-button:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 12px rgba(0,0,0,0.7), 0 0 25px rgba(139, 0, 255, 1);
                border-color: #ffd700;
            }

            .ability-button:active {
                transform: scale(0.95);
            }

            .ability-button.cooldown {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .ability-button.cooldown::after {
                content: attr(data-cooldown);
                position: absolute;
                color: #fff;
                font-size: 16px;
                font-weight: bold;
                text-shadow: 2px 2px 4px #000;
            }

            .popup-notification {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0);
                background: linear-gradient(135deg, rgba(139, 0, 255, 0.95), rgba(255, 0, 139, 0.95));
                border: 4px solid #ffd700;
                border-radius: 30px;
                padding: 40px 60px;
                box-shadow: 0 0 50px rgba(255, 215, 0, 1), inset 0 0 30px rgba(255,255,255,0.3);
                z-index: 10000;
                animation: popupEnter 0.5s ease-out forwards;
                text-align: center;
            }

            .popup-title {
                font-size: 48px;
                font-weight: bold;
                color: #ffd700;
                text-shadow: 0 0 20px #ff8800, 4px 4px 8px #000;
                margin-bottom: 20px;
                animation: textFloat 2s infinite;
            }

            .popup-message {
                font-size: 24px;
                color: #ffffff;
                text-shadow: 2px 2px 4px #000;
            }

            .combat-text {
                position: fixed;
                font-size: 36px;
                font-weight: bold;
                text-shadow: 3px 3px 6px #000;
                animation: floatUp 2s ease-out forwards;
                pointer-events: none;
                z-index: 9999;
            }

            .combat-text.damage {
                color: #ff0000;
                text-shadow: 0 0 10px #ff0000, 3px 3px 6px #000;
            }

            .combat-text.heal {
                color: #00ff00;
                text-shadow: 0 0 10px #00ff00, 3px 3px 6px #000;
            }

            .combat-text.critical {
                color: #ff8800;
                font-size: 48px;
                text-shadow: 0 0 20px #ff8800, 4px 4px 8px #000;
            }

            .main-menu-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, rgba(20, 0, 40, 0.95), rgba(40, 0, 60, 0.95));
                z-index: 5000;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.5s ease-out;
            }

            .main-menu-container {
                width: 800px;
                max-height: 80vh;
                background: linear-gradient(135deg, rgba(40, 20, 80, 0.98), rgba(80, 20, 100, 0.98));
                border: 5px solid #8b00ff;
                border-radius: 30px;
                padding: 40px;
                box-shadow: 0 0 60px rgba(139, 0, 255, 1), inset 0 0 40px rgba(139, 0, 255, 0.3);
                overflow-y: auto;
            }

            .menu-title {
                font-size: 56px;
                font-weight: bold;
                color: #ffd700;
                text-align: center;
                text-shadow: 0 0 30px #ff8800, 4px 4px 8px #000;
                margin-bottom: 30px;
                animation: textGlow 2s infinite;
            }

            .menu-tabs {
                display: flex;
                gap: 10px;
                margin-bottom: 30px;
                border-bottom: 3px solid #8b00ff;
                padding-bottom: 10px;
            }

            .menu-tab {
                flex: 1;
                padding: 15px;
                background: linear-gradient(135deg, rgba(70, 0, 150, 0.7), rgba(100, 0, 180, 0.7));
                border: 2px solid #8b00ff;
                border-radius: 15px 15px 0 0;
                color: #ffffff;
                font-size: 18px;
                font-weight: bold;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s;
                text-shadow: 2px 2px 4px #000;
            }

            .menu-tab:hover {
                background: linear-gradient(135deg, rgba(100, 0, 180, 0.9), rgba(139, 0, 255, 0.9));
                transform: translateY(-5px);
                box-shadow: 0 5px 15px rgba(139, 0, 255, 0.8);
            }

            .menu-tab.active {
                background: linear-gradient(135deg, rgba(139, 0, 255, 1), rgba(255, 0, 139, 1));
                border-color: #ffd700;
                box-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
            }

            .menu-content {
                padding: 20px;
                color: #ffffff;
            }

            .item-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
                gap: 15px;
            }

            .item-slot {
                width: 120px;
                height: 120px;
                border: 3px solid #8b00ff;
                border-radius: 15px;
                background: linear-gradient(135deg, rgba(50, 20, 80, 0.8), rgba(70, 20, 100, 0.8));
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s;
                position: relative;
                box-shadow: inset 0 0 10px rgba(0,0,0,0.5);
            }

            .item-slot:hover {
                transform: scale(1.05);
                border-color: #ffd700;
                box-shadow: 0 0 20px rgba(255, 215, 0, 0.8), inset 0 0 10px rgba(255,255,255,0.2);
            }

            .item-slot.legendary {
                border-color: #ffd700;
                box-shadow: 0 0 20px rgba(255, 215, 0, 1);
                animation: glowPulse 2s infinite;
            }

            .item-slot.epic {
                border-color: #a020f0;
                box-shadow: 0 0 15px rgba(160, 32, 240, 0.8);
            }

            .item-slot.rare {
                border-color: #0080ff;
                box-shadow: 0 0 10px rgba(0, 128, 255, 0.6);
            }

            .item-icon {
                font-size: 48px;
                filter: drop-shadow(0 0 5px rgba(255,255,255,0.5));
            }

            .item-count {
                position: absolute;
                bottom: 5px;
                right: 5px;
                background: rgba(0,0,0,0.8);
                color: #fff;
                padding: 2px 6px;
                border-radius: 8px;
                font-size: 12px;
                font-weight: bold;
            }

            .action-button {
                padding: 15px 40px;
                background: linear-gradient(135deg, #8b00ff, #ff00ff);
                border: 3px solid #ffd700;
                border-radius: 25px;
                color: #ffffff;
                font-size: 20px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s;
                text-shadow: 2px 2px 4px #000;
                box-shadow: 0 5px 15px rgba(139, 0, 255, 0.6);
                margin: 10px;
            }

            .action-button:hover {
                transform: translateY(-3px);
                box-shadow: 0 8px 25px rgba(139, 0, 255, 1);
                background: linear-gradient(135deg, #ff00ff, #ffd700);
            }

            .action-button:active {
                transform: translateY(-1px);
            }

            @keyframes slideInLeft {
                from {
                    transform: translateX(-100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            @keyframes glowPulse {
                0%, 100% {
                    box-shadow: 0 0 20px rgba(139, 0, 255, 0.6);
                }
                50% {
                    box-shadow: 0 0 40px rgba(139, 0, 255, 1);
                }
            }

            @keyframes rotateBorder {
                from {
                    transform: rotate(0deg);
                }
                to {
                    transform: rotate(360deg);
                }
            }

            @keyframes shine {
                from {
                    transform: rotate(0deg);
                }
                to {
                    transform: rotate(360deg);
                }
            }

            @keyframes textGlow {
                0%, 100% {
                    text-shadow: 0 0 10px #ff8800, 2px 2px 4px #000;
                }
                50% {
                    text-shadow: 0 0 30px #ff8800, 0 0 40px #ffd700, 2px 2px 4px #000;
                }
            }

            @keyframes popupEnter {
                0% {
                    transform: translate(-50%, -50%) scale(0) rotate(-180deg);
                    opacity: 0;
                }
                100% {
                    transform: translate(-50%, -50%) scale(1) rotate(0deg);
                    opacity: 1;
                }
            }

            @keyframes textFloat {
                0%, 100% {
                    transform: translateY(0);
                }
                50% {
                    transform: translateY(-10px);
                }
            }

            @keyframes floatUp {
                0% {
                    transform: translateY(0) scale(1);
                    opacity: 1;
                }
                100% {
                    transform: translateY(-100px) scale(1.5);
                    opacity: 0;
                }
            }

            @keyframes fadeIn {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }

            .particles-background {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 0;
                overflow: hidden;
            }

            .particle {
                position: absolute;
                width: 4px;
                height: 4px;
                background: radial-gradient(circle, rgba(139, 0, 255, 1), transparent);
                border-radius: 50%;
                animation: particleFloat 3s infinite ease-in-out;
            }

            @keyframes particleFloat {
                0%, 100% {
                    transform: translateY(0) translateX(0);
                    opacity: 0;
                }
                50% {
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }

    createMainInterfaces() {
        // Create main UI container
        this.container = document.createElement('div');
        this.container.className = 'advanced-ui-container';
        document.body.appendChild(this.container);

        // Create character display panel
        this.createCharacterPanel();

        // Create particle background for ambiance
        this.createParticleBackground();
    }

    createCharacterPanel() {
        const panel = document.createElement('div');
        panel.className = 'character-display-panel';
        panel.innerHTML = `
            <div class="character-portrait"></div>
            <div class="character-name">Hero Name</div>
            <div class="character-class">Level 1 Warrior</div>
            
            <div class="stat-bar-container">
                <div class="stat-label">
                    <span>HP</span>
                    <span class="hp-value">100 / 100</span>
                </div>
                <div class="stat-bar">
                    <div class="stat-fill hp" style="width: 100%"></div>
                    <div class="stat-text">100%</div>
                </div>
            </div>

            <div class="stat-bar-container">
                <div class="stat-label">
                    <span>MP</span>
                    <span class="mp-value">50 / 50</span>
                </div>
                <div class="stat-bar">
                    <div class="stat-fill mp" style="width: 100%"></div>
                    <div class="stat-text">100%</div>
                </div>
            </div>

            <div class="stat-bar-container">
                <div class="stat-label">
                    <span>EXP</span>
                    <span class="exp-value">0 / 100</span>
                </div>
                <div class="stat-bar">
                    <div class="stat-fill exp" style="width: 0%"></div>
                    <div class="stat-text">0%</div>
                </div>
            </div>

            <div class="ability-bar">
                <div class="ability-button" data-ability="1" title="Ability 1">🔥</div>
                <div class="ability-button" data-ability="2" title="Ability 2">⚔️</div>
                <div class="ability-button" data-ability="3" title="Ability 3">🛡️</div>
                <div class="ability-button" data-ability="4" title="Ability 4">⚡</div>
            </div>
        `;

        this.container.appendChild(panel);
        this.characterPanel = panel;

        // Add ability click handlers
        panel.querySelectorAll('.ability-button').forEach(btn => {
            btn.addEventListener('click', (e) => this.onAbilityClick(e));
        });
    }

    createParticleBackground() {
        const particleBg = document.createElement('div');
        particleBg.className = 'particles-background';
        
        // Create 30 floating particles
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 3}s`;
            particle.style.animationDuration = `${3 + Math.random() * 3}s`;
            particleBg.appendChild(particle);
        }

        document.body.appendChild(particleBg);
    }

    updateCharacterStats(stats) {
        if (!this.characterPanel) return;

        // Update name and class
        const nameEl = this.characterPanel.querySelector('.character-name');
        const classEl = this.characterPanel.querySelector('.character-class');
        if (nameEl && stats.name) nameEl.textContent = stats.name;
        if (classEl && stats.className && stats.level) {
            classEl.textContent = `Level ${stats.level} ${stats.className}`;
        }

        // Update HP
        if (stats.hp !== undefined && stats.maxHp !== undefined) {
            const hpPercent = (stats.hp / stats.maxHp) * 100;
            const hpFill = this.characterPanel.querySelector('.stat-fill.hp');
            const hpValue = this.characterPanel.querySelector('.hp-value');
            const hpText = hpFill?.parentElement?.querySelector('.stat-text');
            
            if (hpFill) hpFill.style.width = `${hpPercent}%`;
            if (hpValue) hpValue.textContent = `${Math.floor(stats.hp)} / ${stats.maxHp}`;
            if (hpText) hpText.textContent = `${Math.floor(hpPercent)}%`;
        }

        // Update MP
        if (stats.mp !== undefined && stats.maxMp !== undefined) {
            const mpPercent = (stats.mp / stats.maxMp) * 100;
            const mpFill = this.characterPanel.querySelector('.stat-fill.mp');
            const mpValue = this.characterPanel.querySelector('.mp-value');
            const mpText = mpFill?.parentElement?.querySelector('.stat-text');
            
            if (mpFill) mpFill.style.width = `${mpPercent}%`;
            if (mpValue) mpValue.textContent = `${Math.floor(stats.mp)} / ${stats.maxMp}`;
            if (mpText) mpText.textContent = `${Math.floor(mpPercent)}%`;
        }

        // Update EXP
        if (stats.exp !== undefined && stats.expToLevel !== undefined) {
            const expPercent = (stats.exp / stats.expToLevel) * 100;
            const expFill = this.characterPanel.querySelector('.stat-fill.exp');
            const expValue = this.characterPanel.querySelector('.exp-value');
            const expText = expFill?.parentElement?.querySelector('.stat-text');
            
            if (expFill) expFill.style.width = `${expPercent}%`;
            if (expValue) expValue.textContent = `${Math.floor(stats.exp)} / ${stats.expToLevel}`;
            if (expText) expText.textContent = `${Math.floor(expPercent)}%`;
        }
    }

    showPopupNotification(title, message, duration = 3000) {
        const popup = document.createElement('div');
        popup.className = 'popup-notification';
        popup.innerHTML = `
            <div class="popup-title">${title}</div>
            <div class="popup-message">${message}</div>
        `;

        document.body.appendChild(popup);

        setTimeout(() => {
            popup.style.animation = 'popupEnter 0.5s ease-out reverse';
            setTimeout(() => popup.remove(), 500);
        }, duration);
    }

    showCombatText(text, x, y, type = 'damage') {
        const combatText = document.createElement('div');
        combatText.className = `combat-text ${type}`;
        combatText.textContent = text;
        combatText.style.left = `${x}px`;
        combatText.style.top = `${y}px`;

        document.body.appendChild(combatText);

        setTimeout(() => combatText.remove(), 2000);
    }

    showMainMenu(menuType = 'inventory') {
        const overlay = document.createElement('div');
        overlay.className = 'main-menu-overlay';

        const container = document.createElement('div');
        container.className = 'main-menu-container';
        container.innerHTML = `
            <div class="menu-title">⚔️ ${menuType.toUpperCase()} ⚔️</div>
            <div class="menu-tabs">
                <div class="menu-tab ${menuType === 'inventory' ? 'active' : ''}" data-tab="inventory">🎒 Inventory</div>
                <div class="menu-tab ${menuType === 'character' ? 'active' : ''}" data-tab="character">👤 Character</div>
                <div class="menu-tab ${menuType === 'skills' ? 'active' : ''}" data-tab="skills">⭐ Skills</div>
                <div class="menu-tab ${menuType === 'quests' ? 'active' : ''}" data-tab="quests">📜 Quests</div>
            </div>
            <div class="menu-content">
                ${this.getMenuContent(menuType)}
            </div>
            <div style="text-align: center; margin-top: 20px;">
                <button class="action-button close-menu">Close</button>
            </div>
        `;

        overlay.appendChild(container);
        document.body.appendChild(overlay);

        // Add event listeners
        overlay.querySelector('.close-menu').addEventListener('click', () => {
            overlay.remove();
        });

        container.querySelectorAll('.menu-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                container.querySelectorAll('.menu-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                container.querySelector('.menu-content').innerHTML = this.getMenuContent(tabName);
            });
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });

        this.activeMenus.set(menuType, overlay);
    }

    getMenuContent(menuType) {
        switch(menuType) {
            case 'inventory':
                return `
                    <div class="item-grid">
                        ${this.generateItemSlots(24)}
                    </div>
                `;

            case 'character':
                return `
                    <div style="text-align: center;">
                        <div style="font-size: 32px; color: #ffd700; margin: 20px 0;">⚔️ Character Stats ⚔️</div>
                        <div style="font-size: 20px; color: #fff; line-height: 2;">
                            <div>💪 Attack: 25</div>
                            <div>🛡️ Defense: 18</div>
                            <div>❤️ Max HP: 100</div>
                            <div>💙 Max MP: 50</div>
                            <div>⚡ Speed: 12</div>
                            <div>✨ Critical: 15%</div>
                        </div>
                    </div>
                `;

            case 'skills':
                return `
                    <div style="text-align: center;">
                        <div style="font-size: 32px; color: #ffd700; margin: 20px 0;">⭐ Skill Tree ⭐</div>
                        <div class="item-grid">
                            ${this.generateSkillSlots(12)}
                        </div>
                    </div>
                `;

            case 'quests':
                return `
                    <div style="font-size: 18px; color: #fff; line-height: 2;">
                        <div style="margin: 15px 0; padding: 15px; background: rgba(139, 0, 255, 0.3); border-radius: 15px;">
                            📜 <strong>Main Quest:</strong> Defeat the Dark Lord<br>
                            Progress: 2/5 Objectives Complete
                        </div>
                        <div style="margin: 15px 0; padding: 15px; background: rgba(0, 128, 255, 0.3); border-radius: 15px;">
                            📜 <strong>Side Quest:</strong> Collect 10 Crystals<br>
                            Progress: 7/10 Crystals
                        </div>
                        <div style="margin: 15px 0; padding: 15px; background: rgba(255, 140, 0, 0.3); border-radius: 15px;">
                            📜 <strong>Daily Quest:</strong> Defeat 20 Monsters<br>
                            Progress: 13/20 Monsters
                        </div>
                    </div>
                `;

            default:
                return '<div>Content not available</div>';
        }
    }

    generateItemSlots(count) {
        const rarities = ['common', 'rare', 'epic', 'legendary'];
        const icons = ['⚔️', '🛡️', '💎', '🔮', '🏺', '📿', '👑', '🗝️'];
        let slots = '';

        for (let i = 0; i < count; i++) {
            if (Math.random() > 0.3) {
                const rarity = rarities[Math.floor(Math.random() * rarities.length)];
                const icon = icons[Math.floor(Math.random() * icons.length)];
                const count = Math.floor(Math.random() * 99) + 1;
                slots += `
                    <div class="item-slot ${rarity}">
                        <div class="item-icon">${icon}</div>
                        <div class="item-count">${count}</div>
                    </div>
                `;
            } else {
                slots += `<div class="item-slot"></div>`;
            }
        }

        return slots;
    }

    generateSkillSlots(count) {
        const skills = ['🔥', '⚡', '❄️', '🌪️', '💥', '✨', '🌟', '⚔️', '🛡️', '💫', '🌙', '☀️'];
        let slots = '';

        for (let i = 0; i < count; i++) {
            const skill = skills[i % skills.length];
            const unlocked = Math.random() > 0.5;
            slots += `
                <div class="item-slot ${unlocked ? 'epic' : ''}" style="${unlocked ? '' : 'opacity: 0.3;'}">
                    <div class="item-icon">${skill}</div>
                    ${unlocked ? '<div class="item-count">✓</div>' : ''}
                </div>
            `;
        }

        return slots;
    }

    onAbilityClick(event) {
        const button = event.currentTarget;
        const abilityNum = button.dataset.ability;

        if (button.classList.contains('cooldown')) return;

        // Trigger cooldown animation
        button.classList.add('cooldown');
        let cooldown = 3;
        button.dataset.cooldown = cooldown;

        const interval = setInterval(() => {
            cooldown--;
            button.dataset.cooldown = cooldown;
            if (cooldown <= 0) {
                clearInterval(interval);
                button.classList.remove('cooldown');
                delete button.dataset.cooldown;
            }
        }, 1000);

        // Show ability usage notification
        this.showCombatText(`Ability ${abilityNum}!`, 
            window.innerWidth / 2, 
            window.innerHeight / 2, 
            'critical');
    }

    update(delta) {
        // Update animations if needed
    }

    dispose() {
        this.container?.remove();
        this.activeMenus.forEach(menu => menu.remove());
        this.activeMenus.clear();
    }
}
