/**
 * QuestSystem - Manages quests and objectives
 * Simple quest system for Dynasty of Emberveil
 */

export class QuestSystem {
    constructor(engine) {
        this.engine = engine;
        this.activeQuests = [];
        this.completedQuests = [];
        this.availableQuests = [];
        
        // Initialize quests
        this.initializeQuests();
        
        // Give player starting quest
        this.startQuest('first_steps');
        
        console.log('📜 Quest System initialized');
    }
    
    initializeQuests() {
        this.questLibrary = {
            first_steps: {
                id: 'first_steps',
                name: 'First Steps',
                description: 'Defeat 5 enemies to prove yourself',
                objectives: [
                    { type: 'kill_enemies', target: 5, current: 0, text: 'Defeat 5 enemies' }
                ],
                rewards: {
                    exp: 100,
                    items: []
                },
                isStarterQuest: true
            },
            
            floor_climber: {
                id: 'floor_climber',
                name: 'Floor Climber',
                description: 'Reach floor 5',
                objectives: [
                    { type: 'reach_floor', target: 5, current: 0, text: 'Reach floor 5' }
                ],
                rewards: {
                    exp: 200,
                    items: []
                }
            },
            
            boss_slayer: {
                id: 'boss_slayer',
                name: 'Boss Slayer',
                description: 'Defeat your first boss',
                objectives: [
                    { type: 'kill_bosses', target: 1, current: 0, text: 'Defeat 1 boss' }
                ],
                rewards: {
                    exp: 500,
                    items: []
                }
            },
            
            treasure_hunter: {
                id: 'treasure_hunter',
                name: 'Treasure Hunter',
                description: 'Collect 10 items',
                objectives: [
                    { type: 'collect_items', target: 10, current: 0, text: 'Collect 10 items' }
                ],
                rewards: {
                    exp: 150,
                    items: []
                }
            },
            
            power_seeker: {
                id: 'power_seeker',
                name: 'Power Seeker',
                description: 'Reach level 10',
                objectives: [
                    { type: 'reach_level', target: 10, current: 0, text: 'Reach level 10' }
                ],
                rewards: {
                    exp: 300,
                    items: []
                }
            },
            
            survivor: {
                id: 'survivor',
                name: 'Survivor',
                description: 'Survive for 10 minutes',
                objectives: [
                    { type: 'survive_time', target: 600, current: 0, text: 'Survive for 10 minutes' }
                ],
                rewards: {
                    exp: 250,
                    items: []
                }
            }
        };
        
        // Add all non-starter quests to available
        Object.keys(this.questLibrary).forEach(questId => {
            const quest = this.questLibrary[questId];
            if (!quest.isStarterQuest) {
                this.availableQuests.push(questId);
            }
        });
    }
    
    startQuest(questId) {
        const quest = this.questLibrary[questId];
        if (!quest) return false;
        
        // Check if already active or completed
        if (this.activeQuests.find(q => q.id === questId)) return false;
        if (this.completedQuests.includes(questId)) return false;
        
        // Add to active quests
        const activeQuest = JSON.parse(JSON.stringify(quest)); // Deep copy
        this.activeQuests.push(activeQuest);
        
        // Remove from available
        const index = this.availableQuests.indexOf(questId);
        if (index !== -1) {
            this.availableQuests.splice(index, 1);
        }
        
        this.showQuestNotification('New Quest', quest.name);
        this.updateQuestUI();
        
        console.log(`📜 Quest started: ${quest.name}`);
        return true;
    }
    
    updateProgress(type, amount = 1) {
        let questsCompleted = [];
        
        this.activeQuests.forEach(quest => {
            let questComplete = true;
            
            quest.objectives.forEach(objective => {
                if (objective.type === type) {
                    objective.current = Math.min(objective.target, objective.current + amount);
                }
                
                if (objective.current < objective.target) {
                    questComplete = false;
                }
            });
            
            if (questComplete) {
                questsCompleted.push(quest);
            }
        });
        
        // Complete quests
        questsCompleted.forEach(quest => {
            this.completeQuest(quest.id);
        });
        
        this.updateQuestUI();
    }
    
    completeQuest(questId) {
        const questIndex = this.activeQuests.findIndex(q => q.id === questId);
        if (questIndex === -1) return;
        
        const quest = this.activeQuests[questIndex];
        
        // Give rewards
        if (quest.rewards.exp && this.engine.player) {
            this.engine.player.gainExp(quest.rewards.exp);
        }
        
        if (quest.rewards.items && this.engine.inventorySystem) {
            quest.rewards.items.forEach(item => {
                this.engine.inventorySystem.addItem(item);
            });
        }
        
        // Move to completed
        this.activeQuests.splice(questIndex, 1);
        this.completedQuests.push(questId);
        
        this.showQuestNotification('Quest Complete!', quest.name);
        this.updateQuestUI();
        
        // Unlock new quests
        this.unlockNewQuests();
        
        console.log(`✅ Quest completed: ${quest.name}`);
    }
    
    unlockNewQuests() {
        // Auto-start next available quest if player has less than 3 active
        if (this.activeQuests.length < 3 && this.availableQuests.length > 0) {
            const nextQuestId = this.availableQuests[0];
            setTimeout(() => {
                this.startQuest(nextQuestId);
            }, 2000);
        }
    }
    
    onEnemyDefeated(isBoss = false) {
        this.updateProgress('kill_enemies', 1);
        if (isBoss) {
            this.updateProgress('kill_bosses', 1);
        }
    }
    
    onFloorReached(floor) {
        this.updateProgress('reach_floor', floor);
    }
    
    onItemCollected() {
        this.updateProgress('collect_items', 1);
    }
    
    onLevelUp(level) {
        this.updateProgress('reach_level', level);
    }
    
    update(delta) {
        // Update time-based objectives
        this.activeQuests.forEach(quest => {
            quest.objectives.forEach(objective => {
                if (objective.type === 'survive_time') {
                    objective.current = Math.min(objective.target, objective.current + delta);
                }
            });
        });
    }
    
    showQuestNotification(title, questName) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 120px;
            right: 20px;
            background: rgba(0, 0, 0, 0.9);
            border: 2px solid #c77dff;
            border-radius: 10px;
            padding: 20px 30px;
            color: white;
            z-index: 9999;
            animation: slideInRight 3s ease-out;
            max-width: 300px;
        `;
        notification.innerHTML = `
            <div style="color: #c77dff; font-weight: bold; font-size: 1.2em; margin-bottom: 5px;">
                📜 ${title}
            </div>
            <div style="color: #e0aaff; font-size: 1em;">
                ${questName}
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 3000);
    }
    
    updateQuestUI() {
        const questPanel = document.getElementById('quest-panel');
        if (!questPanel) return;
        
        const questList = document.getElementById('quest-list');
        if (!questList) return;
        
        questList.innerHTML = '';
        
        if (this.activeQuests.length === 0) {
            questList.innerHTML = '<div style="opacity: 0.6;">No active quests</div>';
            return;
        }
        
        this.activeQuests.forEach(quest => {
            const questDiv = document.createElement('div');
            questDiv.className = 'quest-item';
            
            let objectivesHtml = '';
            quest.objectives.forEach(objective => {
                const progress = Math.min(100, (objective.current / objective.target) * 100);
                objectivesHtml += `
                    <div style="margin-top: 5px; font-size: 0.85em;">
                        ${objective.text}: ${objective.current}/${objective.target}
                        <div style="background: rgba(255,255,255,0.2); height: 4px; border-radius: 2px; margin-top: 2px;">
                            <div style="background: #52b788; height: 100%; width: ${progress}%; border-radius: 2px;"></div>
                        </div>
                    </div>
                `;
            });
            
            questDiv.innerHTML = `
                <div style="color: #c77dff; font-weight: bold;">${quest.name}</div>
                <div style="color: #e0aaff; font-size: 0.9em; margin-top: 3px;">${quest.description}</div>
                ${objectivesHtml}
            `;
            
            questList.appendChild(questDiv);
        });
    }
    
    getSaveData() {
        return {
            activeQuests: this.activeQuests,
            completedQuests: this.completedQuests,
            availableQuests: this.availableQuests
        };
    }
    
    loadSaveData(data) {
        if (data.activeQuests) this.activeQuests = data.activeQuests;
        if (data.completedQuests) this.completedQuests = data.completedQuests;
        if (data.availableQuests) this.availableQuests = data.availableQuests;
        
        this.updateQuestUI();
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        0% { opacity: 0; transform: translateX(100px); }
        20% { opacity: 1; transform: translateX(0); }
        80% { opacity: 1; transform: translateX(0); }
        100% { opacity: 0; transform: translateX(100px); }
    }
    
    .quest-item {
        background: rgba(157, 78, 221, 0.1);
        border-left: 3px solid #9d4edd;
        padding: 10px;
        margin: 10px 0;
        border-radius: 5px;
    }
`;
document.head.appendChild(style);
