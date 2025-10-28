/**
 * AchievementSystem - Tracks player achievements and milestones
 * Provides goals and rewards for various accomplishments
 */

export class AchievementSystem {
    constructor(engine) {
        this.engine = engine;
        this.achievements = this.createAchievements();
        this.unlockedAchievements = new Set();
        this.progress = {}; // Track progress for incremental achievements
        
        // UI element
        this.achievementPanel = null;
        this.notificationQueue = [];
        
        this.init();
        console.log('🏆 Achievement System initialized');
    }
    
    init() {
        // Create achievement UI
        this.createAchievementUI();
        
        // Initialize progress tracking
        Object.keys(this.achievements).forEach(id => {
            this.progress[id] = 0;
        });
    }
    
    createAchievements() {
        return {
            // Combat achievements
            first_kill: {
                id: 'first_kill',
                name: 'First Blood',
                description: 'Defeat your first enemy',
                icon: '⚔️',
                requirement: 1,
                reward: { exp: 100 },
                category: 'combat'
            },
            slayer_10: {
                id: 'slayer_10',
                name: 'Demon Slayer',
                description: 'Defeat 10 enemies',
                icon: '💀',
                requirement: 10,
                reward: { exp: 500 },
                category: 'combat'
            },
            slayer_50: {
                id: 'slayer_50',
                name: 'Monster Hunter',
                description: 'Defeat 50 enemies',
                icon: '🗡️',
                requirement: 50,
                reward: { exp: 2000, item: 'rare_weapon' },
                category: 'combat'
            },
            slayer_100: {
                id: 'slayer_100',
                name: 'Death Incarnate',
                description: 'Defeat 100 enemies',
                icon: '☠️',
                requirement: 100,
                reward: { exp: 5000, item: 'epic_weapon' },
                category: 'combat'
            },
            slayer_500: {
                id: 'slayer_500',
                name: 'Legendary Warrior',
                description: 'Defeat 500 enemies',
                icon: '⚡',
                requirement: 500,
                reward: { exp: 10000, item: 'legendary_weapon' },
                category: 'combat'
            },
            
            // Boss achievements
            first_boss: {
                id: 'first_boss',
                name: 'Boss Slayer',
                description: 'Defeat your first boss',
                icon: '👑',
                requirement: 1,
                reward: { exp: 1000 },
                category: 'boss'
            },
            boss_5: {
                id: 'boss_5',
                name: 'Giant Killer',
                description: 'Defeat 5 bosses',
                icon: '🔱',
                requirement: 5,
                reward: { exp: 3000, item: 'epic_armor' },
                category: 'boss'
            },
            boss_10: {
                id: 'boss_10',
                name: 'Titan Slayer',
                description: 'Defeat 10 bosses',
                icon: '⚜️',
                requirement: 10,
                reward: { exp: 5000, item: 'legendary_armor' },
                category: 'boss'
            },
            
            // Floor achievements
            floor_5: {
                id: 'floor_5',
                name: 'Adventurer',
                description: 'Reach floor 5',
                icon: '🚪',
                requirement: 5,
                reward: { exp: 500 },
                category: 'progression'
            },
            floor_10: {
                id: 'floor_10',
                name: 'Explorer',
                description: 'Reach floor 10',
                icon: '🗺️',
                requirement: 10,
                reward: { exp: 1000 },
                category: 'progression'
            },
            floor_25: {
                id: 'floor_25',
                name: 'Deep Delver',
                description: 'Reach floor 25',
                icon: '⛏️',
                requirement: 25,
                reward: { exp: 3000, item: 'rare_accessory' },
                category: 'progression'
            },
            floor_50: {
                id: 'floor_50',
                name: 'Abyss Walker',
                description: 'Reach floor 50',
                icon: '🌀',
                requirement: 50,
                reward: { exp: 5000, item: 'epic_accessory' },
                category: 'progression'
            },
            floor_100: {
                id: 'floor_100',
                name: 'Master of the Veil',
                description: 'Reach floor 100',
                icon: '✨',
                requirement: 100,
                reward: { exp: 10000, item: 'legendary_accessory' },
                category: 'progression'
            },
            
            // Level achievements
            level_10: {
                id: 'level_10',
                name: 'Novice Wielder',
                description: 'Reach level 10',
                icon: '🌟',
                requirement: 10,
                reward: { exp: 500 },
                category: 'level'
            },
            level_25: {
                id: 'level_25',
                name: 'Skilled Wielder',
                description: 'Reach level 25',
                icon: '⭐',
                requirement: 25,
                reward: { exp: 2000 },
                category: 'level'
            },
            level_50: {
                id: 'level_50',
                name: 'Master Wielder',
                description: 'Reach level 50',
                icon: '💫',
                requirement: 50,
                reward: { exp: 5000, item: 'epic_weapon' },
                category: 'level'
            },
            level_100: {
                id: 'level_100',
                name: 'Legendary Wielder',
                description: 'Reach level 100',
                icon: '🌠',
                requirement: 100,
                reward: { exp: 10000, item: 'legendary_weapon' },
                category: 'level'
            },
            
            // Collection achievements
            items_10: {
                id: 'items_10',
                name: 'Treasure Hunter',
                description: 'Collect 10 items',
                icon: '📦',
                requirement: 10,
                reward: { exp: 500 },
                category: 'collection'
            },
            items_50: {
                id: 'items_50',
                name: 'Hoarder',
                description: 'Collect 50 items',
                icon: '💎',
                requirement: 50,
                reward: { exp: 2000 },
                category: 'collection'
            },
            legendary_item: {
                id: 'legendary_item',
                name: 'Legendary Find',
                description: 'Find a legendary item',
                icon: '👑',
                requirement: 1,
                reward: { exp: 2000 },
                category: 'collection'
            },
            
            // Speed achievements
            quick_clear: {
                id: 'quick_clear',
                name: 'Speed Runner',
                description: 'Clear floor 5 in under 2 minutes',
                icon: '⚡',
                requirement: 1,
                reward: { exp: 1000 },
                category: 'speed'
            },
            
            // Survival achievements
            survivor_30min: {
                id: 'survivor_30min',
                name: 'Endurance',
                description: 'Survive for 30 minutes',
                icon: '⏰',
                requirement: 1800, // 30 minutes in seconds
                reward: { exp: 2000 },
                category: 'survival'
            },
            survivor_1hour: {
                id: 'survivor_1hour',
                name: 'Marathon Runner',
                description: 'Survive for 1 hour',
                icon: '🏃',
                requirement: 3600,
                reward: { exp: 5000, item: 'epic_armor' },
                category: 'survival'
            },
            
            // Special achievements
            no_damage_floor: {
                id: 'no_damage_floor',
                name: 'Untouchable',
                description: 'Complete a floor without taking damage',
                icon: '🛡️',
                requirement: 1,
                reward: { exp: 1500 },
                category: 'special'
            },
            perfect_boss: {
                id: 'perfect_boss',
                name: 'Perfect Victory',
                description: 'Defeat a boss without taking damage',
                icon: '👑',
                requirement: 1,
                reward: { exp: 3000, item: 'legendary_accessory' },
                category: 'special'
            }
        };
    }
    
    createAchievementUI() {
        // Create achievement toggle button
        const toggleButton = document.createElement('div');
        toggleButton.id = 'achievement-toggle';
        toggleButton.innerHTML = '🏆 Achievements (A)';
        toggleButton.style.cssText = `
            position: absolute;
            bottom: 100px;
            right: 20px;
            background: linear-gradient(135deg, #2d0a4e, #4a0e7a);
            border: 2px solid #9d4edd;
            border-radius: 10px;
            padding: 10px 20px;
            color: #fff;
            cursor: pointer;
            font-weight: bold;
            pointer-events: auto;
            z-index: 100;
        `;
        toggleButton.addEventListener('click', () => this.togglePanel());
        toggleButton.addEventListener('mouseenter', () => {
            toggleButton.style.background = 'linear-gradient(135deg, #4a0e7a, #9d4edd)';
        });
        toggleButton.addEventListener('mouseleave', () => {
            toggleButton.style.background = 'linear-gradient(135deg, #2d0a4e, #4a0e7a)';
        });
        document.getElementById('ui-overlay').appendChild(toggleButton);
        
        // Create achievement panel
        this.achievementPanel = document.createElement('div');
        this.achievementPanel.id = 'achievement-panel';
        this.achievementPanel.style.cssText = `
            position: absolute;
            right: 20px;
            bottom: 150px;
            width: 400px;
            max-height: 500px;
            overflow-y: auto;
            background: rgba(0, 0, 0, 0.95);
            border: 2px solid #9d4edd;
            border-radius: 10px;
            padding: 15px;
            color: #fff;
            display: none;
            pointer-events: auto;
            z-index: 100;
        `;
        document.getElementById('ui-overlay').appendChild(this.achievementPanel);
        
        this.updateAchievementUI();
        
        // Add keyboard shortcut
        document.addEventListener('keydown', (e) => {
            if (e.key === 'a' || e.key === 'A') {
                this.togglePanel();
            }
        });
    }
    
    togglePanel() {
        const isVisible = this.achievementPanel.style.display === 'block';
        this.achievementPanel.style.display = isVisible ? 'none' : 'block';
        if (!isVisible) {
            this.updateAchievementUI();
        }
    }
    
    updateAchievementUI() {
        if (!this.achievementPanel) return;
        
        const categories = {
            combat: '⚔️ Combat',
            boss: '👑 Boss Battles',
            progression: '🗺️ Progression',
            level: '⭐ Levels',
            collection: '💎 Collection',
            speed: '⚡ Speed',
            survival: '⏰ Survival',
            special: '✨ Special'
        };
        
        let html = '<h3 style="color: #c77dff; margin-bottom: 15px;">🏆 Achievements</h3>';
        html += `<p style="color: #e0aaff; margin-bottom: 15px;">${this.unlockedAchievements.size} / ${Object.keys(this.achievements).length} Unlocked</p>`;
        
        // Group by category
        Object.entries(categories).forEach(([cat, label]) => {
            const categoryAchievements = Object.values(this.achievements).filter(a => a.category === cat);
            if (categoryAchievements.length === 0) return;
            
            html += `<h4 style="color: #e0aaff; margin-top: 15px; margin-bottom: 10px;">${label}</h4>`;
            
            categoryAchievements.forEach(ach => {
                const unlocked = this.unlockedAchievements.has(ach.id);
                const progress = this.progress[ach.id] || 0;
                const percent = Math.min(100, (progress / ach.requirement) * 100);
                
                const bgColor = unlocked ? 'rgba(157, 78, 221, 0.3)' : 'rgba(45, 10, 78, 0.3)';
                const textColor = unlocked ? '#c77dff' : '#888';
                
                html += `
                    <div style="
                        background: ${bgColor};
                        border: 1px solid ${unlocked ? '#9d4edd' : '#444'};
                        border-radius: 8px;
                        padding: 10px;
                        margin: 8px 0;
                    ">
                        <div style="display: flex; align-items: center; margin-bottom: 5px;">
                            <span style="font-size: 24px; margin-right: 10px;">${ach.icon}</span>
                            <div style="flex: 1;">
                                <div style="color: ${textColor}; font-weight: bold;">${ach.name}</div>
                                <div style="color: #aaa; font-size: 0.85em;">${ach.description}</div>
                            </div>
                            ${unlocked ? '<span style="color: #52b788; font-size: 20px;">✓</span>' : ''}
                        </div>
                        ${!unlocked ? `
                            <div style="background: rgba(0, 0, 0, 0.5); border-radius: 5px; height: 8px; margin-top: 8px; overflow: hidden;">
                                <div style="background: linear-gradient(90deg, #9d4edd, #c77dff); height: 100%; width: ${percent}%; transition: width 0.3s;"></div>
                            </div>
                            <div style="color: #aaa; font-size: 0.8em; margin-top: 3px; text-align: right;">
                                ${progress} / ${ach.requirement}
                            </div>
                        ` : ''}
                    </div>
                `;
            });
        });
        
        this.achievementPanel.innerHTML = html;
    }
    
    checkAchievement(achievementId, currentValue) {
        const achievement = this.achievements[achievementId];
        if (!achievement || this.unlockedAchievements.has(achievementId)) return;
        
        this.progress[achievementId] = currentValue;
        
        if (currentValue >= achievement.requirement) {
            this.unlockAchievement(achievementId);
        }
    }
    
    unlockAchievement(achievementId) {
        if (this.unlockedAchievements.has(achievementId)) return;
        
        const achievement = this.achievements[achievementId];
        this.unlockedAchievements.add(achievementId);
        
        console.log(`🏆 Achievement Unlocked: ${achievement.name}`);
        
        // Give rewards
        if (achievement.reward) {
            if (achievement.reward.exp) {
                this.engine.player.gainExp(achievement.reward.exp);
            }
            if (achievement.reward.item) {
                // Generate item based on reward type
                const floor = this.engine.endlessMode?.currentFloor || 1;
                const item = this.engine.inventorySystem.generateLoot(floor, achievement.reward.item.split('_')[0]);
                this.engine.inventorySystem.addItem(item);
            }
        }
        
        // Show notification
        this.showAchievementNotification(achievement);
        
        // Update UI
        this.updateAchievementUI();
        
        // Save progress
        if (this.engine.saveSystem) {
            this.engine.saveSystem.saveGame('Achievement unlocked');
        }
    }
    
    showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.5);
            background: linear-gradient(135deg, #2d0a4e, #4a0e7a);
            border: 3px solid #ffd60a;
            border-radius: 15px;
            padding: 30px;
            color: #fff;
            font-size: 1.2em;
            z-index: 10000;
            text-align: center;
            box-shadow: 0 0 40px rgba(255, 215, 0, 0.8);
            opacity: 0;
            animation: achievementPop 3s ease-out forwards;
            max-width: 400px;
        `;
        
        notification.innerHTML = `
            <div style="font-size: 3em; margin-bottom: 10px;">${achievement.icon}</div>
            <div style="font-size: 1.5em; color: #ffd60a; font-weight: bold; margin-bottom: 10px;">Achievement Unlocked!</div>
            <div style="font-size: 1.2em; color: #c77dff; margin-bottom: 5px;">${achievement.name}</div>
            <div style="font-size: 0.9em; color: #e0aaff;">${achievement.description}</div>
            ${achievement.reward && achievement.reward.exp ? `
                <div style="margin-top: 15px; color: #52b788; font-size: 0.9em;">
                    +${achievement.reward.exp} EXP
                </div>
            ` : ''}
        `;
        
        document.body.appendChild(notification);
        
        // Play sound (if audio system available)
        // this.engine.audioSystem?.playSoundEffect('achievement');
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    }
    
    // Event handlers for achievement tracking
    onEnemyDefeated(isBoss = false) {
        const totalKills = this.engine.endlessMode?.enemiesDefeated || 0;
        
        // Combat achievements
        this.checkAchievement('first_kill', totalKills);
        this.checkAchievement('slayer_10', totalKills);
        this.checkAchievement('slayer_50', totalKills);
        this.checkAchievement('slayer_100', totalKills);
        this.checkAchievement('slayer_500', totalKills);
        
        // Boss achievements
        if (isBoss) {
            const bossKills = this.getBossKillCount();
            this.checkAchievement('first_boss', bossKills);
            this.checkAchievement('boss_5', bossKills);
            this.checkAchievement('boss_10', bossKills);
        }
    }
    
    onFloorReached(floor) {
        this.checkAchievement('floor_5', floor);
        this.checkAchievement('floor_10', floor);
        this.checkAchievement('floor_25', floor);
        this.checkAchievement('floor_50', floor);
        this.checkAchievement('floor_100', floor);
    }
    
    onLevelReached(level) {
        this.checkAchievement('level_10', level);
        this.checkAchievement('level_25', level);
        this.checkAchievement('level_50', level);
        this.checkAchievement('level_100', level);
    }
    
    onItemCollected(itemRarity) {
        const totalItems = this.getTotalItemsCollected();
        this.checkAchievement('items_10', totalItems);
        this.checkAchievement('items_50', totalItems);
        
        if (itemRarity === 'legendary') {
            this.checkAchievement('legendary_item', 1);
        }
    }
    
    onTimeElapsed(seconds) {
        this.checkAchievement('survivor_30min', seconds);
        this.checkAchievement('survivor_1hour', seconds);
    }
    
    // Helper methods
    getBossKillCount() {
        // Count boss kills from progress
        let count = 0;
        if (this.progress.first_boss >= 1) count++;
        if (this.progress.boss_5 >= 1) count = Math.max(count, this.progress.boss_5);
        if (this.progress.boss_10 >= 1) count = Math.max(count, this.progress.boss_10);
        return count;
    }
    
    getTotalItemsCollected() {
        return this.engine.inventorySystem?.items?.length || 0;
    }
    
    // Save/Load
    getSaveData() {
        return {
            unlockedAchievements: Array.from(this.unlockedAchievements),
            progress: this.progress
        };
    }
    
    loadSaveData(data) {
        if (data.unlockedAchievements) {
            this.unlockedAchievements = new Set(data.unlockedAchievements);
        }
        if (data.progress) {
            this.progress = data.progress;
        }
        this.updateAchievementUI();
    }
}

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes achievementPop {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
        10% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
        20% { transform: translate(-50%, -50%) scale(1); }
        80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
    }
`;
document.head.appendChild(style);
