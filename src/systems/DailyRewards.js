/**
 * DailyRewards - Daily login rewards system for player retention
 * Provides escalating rewards for consecutive daily logins
 */

export class DailyRewards {
    constructor(engine) {
        this.engine = engine;
        
        // Reward tiers (day streak -> rewards)
        this.rewardTiers = {
            1: { exp: 100, gold: 50, items: [], message: 'Welcome back!' },
            2: { exp: 150, gold: 75, items: ['health_potion'], message: 'Day 2 Bonus!' },
            3: { exp: 200, gold: 100, items: ['health_potion', 'mana_potion'], message: 'Day 3 Bonus!' },
            4: { exp: 300, gold: 150, items: ['rare_item'], message: 'Day 4 - Rare Item!' },
            5: { exp: 500, gold: 250, items: ['epic_item'], message: 'Day 5 - Epic Reward!' },
            6: { exp: 750, gold: 400, items: ['epic_item', 'health_potion'], message: 'Day 6 - Keep Going!' },
            7: { exp: 1500, gold: 1000, items: ['legendary_item'], message: 'Week Complete - Legendary!' },
            14: { exp: 3000, gold: 2500, items: ['legendary_item', 'epic_item'], message: '2 Weeks - Amazing!' },
            30: { exp: 10000, gold: 10000, items: ['legendary_item', 'legendary_item'], message: 'Monthly Master!' }
        };
        
        // State
        this.lastLoginDate = null;
        this.currentStreak = 0;
        this.longestStreak = 0;
        this.totalLogins = 0;
        this.lastRewardClaimed = false;
        
        // UI
        this.rewardPanel = null;
        
        this.init();
        console.log('🎁 Daily Rewards System initialized');
    }
    
    init() {
        this.checkDailyLogin();
        this.createRewardUI();
    }
    
    checkDailyLogin() {
        const today = this.getTodayString();
        
        if (!this.lastLoginDate) {
            // First time login
            this.lastLoginDate = today;
            this.currentStreak = 1;
            this.longestStreak = 1;
            this.totalLogins = 1;
            this.lastRewardClaimed = false;
            
            console.log('🎉 First login! Welcome to Dynasty of Emberveil!');
            this.showWelcomeBonus();
        } else if (this.lastLoginDate !== today) {
            // New day
            const yesterday = this.getYesterdayString();
            
            if (this.lastLoginDate === yesterday) {
                // Consecutive day
                this.currentStreak++;
                if (this.currentStreak > this.longestStreak) {
                    this.longestStreak = this.currentStreak;
                }
            } else {
                // Streak broken
                this.currentStreak = 1;
            }
            
            this.lastLoginDate = today;
            this.totalLogins++;
            this.lastRewardClaimed = false;
            
            // Show daily reward notification
            this.showDailyRewardNotification();
        }
        
        // Save state
        if (this.engine.saveSystem) {
            this.engine.saveSystem.saveGame('Daily login check');
        }
    }
    
    getTodayString() {
        const date = new Date();
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    }
    
    getYesterdayString() {
        const date = new Date();
        date.setDate(date.getDate() - 1);
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    }
    
    createRewardUI() {
        // Create daily rewards button
        const rewardButton = document.createElement('div');
        rewardButton.id = 'daily-rewards-button';
        rewardButton.innerHTML = '🎁 Daily<br>Rewards';
        rewardButton.style.cssText = `
            position: absolute;
            top: 120px;
            right: 20px;
            background: linear-gradient(135deg, #ffd60a, #ff6b9d);
            border: 2px solid #ffd60a;
            border-radius: 10px;
            padding: 10px 15px;
            color: #fff;
            cursor: pointer;
            font-weight: bold;
            pointer-events: auto;
            z-index: 100;
            text-align: center;
            font-size: 0.85em;
            line-height: 1.2;
            animation: ${!this.lastRewardClaimed ? 'rewardPulse 2s infinite' : 'none'};
        `;
        rewardButton.addEventListener('click', () => this.toggleRewardPanel());
        document.getElementById('ui-overlay').appendChild(rewardButton);
        
        this.rewardButton = rewardButton;
        
        // Create reward panel
        this.rewardPanel = document.createElement('div');
        this.rewardPanel.id = 'daily-reward-panel';
        this.rewardPanel.style.cssText = `
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 80%;
            max-width: 600px;
            background: rgba(0, 0, 0, 0.95);
            border: 3px solid #ffd60a;
            border-radius: 15px;
            padding: 20px;
            color: #fff;
            display: none;
            pointer-events: auto;
            z-index: 1000;
            box-shadow: 0 0 50px rgba(255, 215, 0, 0.5);
        `;
        document.getElementById('ui-overlay').appendChild(this.rewardPanel);
        
        this.updateRewardUI();
    }
    
    toggleRewardPanel() {
        const isVisible = this.rewardPanel.style.display === 'block';
        this.rewardPanel.style.display = isVisible ? 'none' : 'block';
        
        if (!isVisible) {
            this.updateRewardUI();
        }
    }
    
    updateRewardUI() {
        if (!this.rewardPanel) return;
        
        const currentReward = this.getCurrentReward();
        const nextMilestone = this.getNextMilestone();
        
        let html = '<div style="text-align: center;">';
        html += '<h2 style="color: #ffd60a; margin-bottom: 15px;">🎁 Daily Rewards</h2>';
        
        // Streak info
        html += '<div style="margin-bottom: 20px;">';
        html += `<div style="font-size: 1.2em; color: #fff;">Current Streak: <span style="color: #ff6b9d; font-weight: bold;">${this.currentStreak} days</span></div>`;
        html += `<div style="color: #aaa; margin-top: 5px;">Longest Streak: ${this.longestStreak} | Total Logins: ${this.totalLogins}</div>`;
        html += '</div>';
        
        // Current day reward
        html += '<div style="background: rgba(255, 215, 0, 0.1); border: 2px solid #ffd60a; border-radius: 10px; padding: 20px; margin-bottom: 20px;">';
        html += `<h3 style="color: #ffd60a; margin-bottom: 10px;">Day ${this.currentStreak} Reward</h3>`;
        html += `<div style="font-size: 1.1em; color: #e0aaff; margin-bottom: 15px;">${currentReward.message}</div>`;
        html += '<div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap;">';
        html += `<div style="text-align: center;"><div style="font-size: 2em;">✨</div><div>+${currentReward.exp} EXP</div></div>`;
        html += `<div style="text-align: center;"><div style="font-size: 2em;">💰</div><div>+${currentReward.gold} Gold</div></div>`;
        if (currentReward.items.length > 0) {
            html += `<div style="text-align: center;"><div style="font-size: 2em;">🎁</div><div>${currentReward.items.length} Items</div></div>`;
        }
        html += '</div>';
        
        if (!this.lastRewardClaimed) {
            html += '<button id="claim-reward-btn" style="margin-top: 15px; background: linear-gradient(135deg, #52b788, #2d6a4f); border: none; border-radius: 8px; padding: 12px 30px; color: #fff; font-weight: bold; cursor: pointer; font-size: 1.1em;">Claim Reward!</button>';
        } else {
            html += '<div style="margin-top: 15px; color: #52b788; font-weight: bold;">✓ Reward Claimed Today</div>';
            html += '<div style="color: #888; font-size: 0.9em; margin-top: 5px;">Come back tomorrow for more!</div>';
        }
        html += '</div>';
        
        // Next milestone
        if (nextMilestone) {
            const daysUntil = nextMilestone - this.currentStreak;
            html += '<div style="background: rgba(157, 78, 221, 0.1); border: 2px solid #9d4edd; border-radius: 10px; padding: 15px;">';
            html += `<h4 style="color: #9d4edd; margin-bottom: 10px;">Next Milestone (Day ${nextMilestone})</h4>`;
            html += `<div style="color: #aaa;">Keep your streak for ${daysUntil} more ${daysUntil === 1 ? 'day' : 'days'}!</div>`;
            const milestoneReward = this.rewardTiers[nextMilestone];
            html += `<div style="margin-top: 10px; color: #e0aaff;">${milestoneReward.message}</div>`;
            html += '</div>';
        }
        
        html += '</div>';
        
        this.rewardPanel.innerHTML = html;
        
        // Add claim button handler
        const claimBtn = document.getElementById('claim-reward-btn');
        if (claimBtn) {
            claimBtn.addEventListener('click', () => this.claimReward());
        }
    }
    
    getCurrentReward() {
        // Check for milestone rewards
        if (this.rewardTiers[this.currentStreak]) {
            return this.rewardTiers[this.currentStreak];
        }
        
        // Default scaling reward
        const baseExp = 100;
        const baseGold = 50;
        const multiplier = Math.floor(this.currentStreak / 7) + 1;
        
        return {
            exp: baseExp * multiplier,
            gold: baseGold * multiplier,
            items: this.currentStreak % 3 === 0 ? ['health_potion'] : [],
            message: `Day ${this.currentStreak} - Keep it up!`
        };
    }
    
    getNextMilestone() {
        const milestones = Object.keys(this.rewardTiers).map(Number).sort((a, b) => a - b);
        return milestones.find(m => m > this.currentStreak);
    }
    
    claimReward() {
        if (this.lastRewardClaimed) {
            console.log('Reward already claimed today');
            return;
        }
        
        const reward = this.getCurrentReward();
        
        // Give rewards
        if (this.engine.player) {
            this.engine.player.gainExp(reward.exp);
        }
        
        // Add items to inventory
        if (reward.items.length > 0 && this.engine.inventorySystem) {
            reward.items.forEach(itemType => {
                const floor = this.engine.endlessMode?.currentFloor || 1;
                let rarity = 'common';
                
                if (itemType === 'rare_item') rarity = 'rare';
                else if (itemType === 'epic_item') rarity = 'epic';
                else if (itemType === 'legendary_item') rarity = 'legendary';
                
                const item = this.engine.inventorySystem.generateLoot(floor, rarity);
                this.engine.inventorySystem.addItem(item);
            });
        }
        
        this.lastRewardClaimed = true;
        
        // Play sound
        if (this.engine.audioSystem) {
            this.engine.audioSystem.playSoundEffect('achievement');
        }
        
        // Update UI
        this.updateRewardUI();
        this.rewardButton.style.animation = 'none';
        
        // Save
        if (this.engine.saveSystem) {
            this.engine.saveSystem.saveGame('Daily reward claimed');
        }
        
        // Show celebration
        this.showRewardClaimedEffect();
        
        console.log(`🎁 Claimed daily reward: Day ${this.currentStreak}`);
    }
    
    showDailyRewardNotification() {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20%;
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
            animation: rewardNotificationPop 4s ease-out forwards;
            pointer-events: none;
        `;
        
        notification.innerHTML = `
            <div style="font-size: 3em; margin-bottom: 10px;">🎁</div>
            <div style="font-size: 1.5em; color: #ffd60a; font-weight: bold; margin-bottom: 10px;">Daily Reward Available!</div>
            <div style="color: #e0aaff;">Day ${this.currentStreak} Streak</div>
            <div style="color: #aaa; font-size: 0.9em; margin-top: 10px;">Click the gift icon to claim!</div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 4000);
    }
    
    showWelcomeBonus() {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.5);
            background: linear-gradient(135deg, #2d0a4e, #4a0e7a);
            border: 3px solid #ffd60a;
            border-radius: 15px;
            padding: 40px;
            color: #fff;
            font-size: 1.3em;
            z-index: 10000;
            text-align: center;
            box-shadow: 0 0 50px rgba(255, 215, 0, 1);
            opacity: 0;
            animation: rewardNotificationPop 5s ease-out forwards;
            pointer-events: none;
            max-width: 500px;
        `;
        
        notification.innerHTML = `
            <div style="font-size: 4em; margin-bottom: 15px;">🎉</div>
            <div style="font-size: 1.8em; color: #ffd60a; font-weight: bold; margin-bottom: 15px;">Welcome to Dynasty of Emberveil!</div>
            <div style="color: #e0aaff; margin-bottom: 20px;">You've received a welcome bonus!</div>
            <div style="font-size: 1.1em; color: #52b788;">+100 EXP | +50 Gold</div>
            <div style="color: #aaa; font-size: 0.9em; margin-top: 20px;">Log in daily to build your streak and earn bigger rewards!</div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 5000);
    }
    
    showRewardClaimedEffect() {
        const effect = document.createElement('div');
        effect.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 5em;
            z-index: 10001;
            pointer-events: none;
            animation: rewardClaimedEffect 2s ease-out forwards;
        `;
        effect.textContent = '🎁✨';
        
        document.body.appendChild(effect);
        
        setTimeout(() => {
            if (document.body.contains(effect)) {
                document.body.removeChild(effect);
            }
        }, 2000);
    }
    
    // Save/Load
    getSaveData() {
        return {
            lastLoginDate: this.lastLoginDate,
            currentStreak: this.currentStreak,
            longestStreak: this.longestStreak,
            totalLogins: this.totalLogins,
            lastRewardClaimed: this.lastRewardClaimed
        };
    }
    
    loadSaveData(data) {
        if (data.lastLoginDate) this.lastLoginDate = data.lastLoginDate;
        if (data.currentStreak) this.currentStreak = data.currentStreak;
        if (data.longestStreak) this.longestStreak = data.longestStreak;
        if (data.totalLogins) this.totalLogins = data.totalLogins;
        if (data.lastRewardClaimed !== undefined) this.lastRewardClaimed = data.lastRewardClaimed;
        
        // Check if it's a new day
        this.checkDailyLogin();
        this.updateRewardUI();
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes rewardPulse {
        0%, 100% { transform: scale(1); box-shadow: 0 0 10px rgba(255, 215, 0, 0.5); }
        50% { transform: scale(1.1); box-shadow: 0 0 20px rgba(255, 215, 0, 1); }
    }
    
    @keyframes rewardNotificationPop {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
        10% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
        15% { transform: translate(-50%, -50%) scale(1); }
        85% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
    }
    
    @keyframes rewardClaimedEffect {
        0% { opacity: 1; transform: translate(-50%, -50%) scale(1) rotate(0deg); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(3) rotate(360deg); }
    }
`;
document.head.appendChild(style);
