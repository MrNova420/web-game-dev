import { logger } from '../core/Logger.js';
/**
 * PlayerOnboardingSystem - Smooth experience for new and returning players
 * All assets from external sources (Mixamo, Kenney, game-icons.net)
 * 
 * @external Mixamo - Tutorial NPC animations
 * @external Kenney UI Pack - Tutorial UI, tooltips
 * @external game-icons.net - Tutorial icons, quest markers
 */

class PlayerOnboardingSystem {
    constructor() {
        this.tutorialSteps = [];
        this.completedSteps = new Set();
        this.currentStep = null;
        this.playerType = null; // 'new', 'returning', 'veteran'
        
        this.tutorialAssets = {
            npc: '/assets/models/npcs/tutorial_guide.glb', // Mixamo
            animations: {
                idle: '/assets/animations/npc_idle.fbx',
                talk: '/assets/animations/npc_talk.fbx',
                point: '/assets/animations/npc_point.fbx'
            },
            ui: {
                tooltip: '/assets/ui/tooltip_panel.png', // Kenney
                arrow: '/assets/ui/arrow_pointer.png'
            },
            icons: {
                move: '/assets/icons/movement.png', // game-icons.net
                attack: '/assets/icons/sword.png',
                inventory: '/assets/icons/bag.png'
            }
        };
    }
    
    initialize() {
        logger.info('[PlayerOnboarding] Initializing onboarding system...');
        
        // Detect player type
        this.detectPlayerType();
        
        // Set up appropriate onboarding flow
        this.setupOnboardingFlow();
        
        // Load player progress
        this.loadProgress();
        
        logger.info('[PlayerOnboarding] System initialized for', this.playerType, 'player');
    }
    
    detectPlayerType() {
        const saveData = this.loadSaveData();
        
        if (!saveData) {
            this.playerType = 'new';
        } else {
            const lastPlayTime = saveData.lastPlayTime || 0;
            const currentTime = Date.now();
            const daysSinceLastPlay = (currentTime - lastPlayTime) / (1000 * 60 * 60 * 24);
            
            if (daysSinceLastPlay > 30) {
                this.playerType = 'returning';
            } else if (saveData.level >= 60) {
                this.playerType = 'veteran';
            } else {
                this.playerType = 'continuing';
            }
        }
    }
    
    setupOnboardingFlow() {
        if (this.playerType === 'new') {
            this.setupNewPlayerTutorial();
        } else if (this.playerType === 'returning') {
            this.setupReturningPlayerGuide();
        } else {
            this.setupContinuingPlayerReminders();
        }
    }
    
    setupNewPlayerTutorial() {
        this.tutorialSteps = [
            {
                id: 'welcome',
                title: 'Welcome to Dynasty of Emberveil!',
                description: 'Let me show you around.',
                type: 'dialogue',
                duration: 5000,
                skippable: true
            },
            {
                id: 'movement',
                title: 'Movement Controls',
                description: 'Use WASD or Arrow Keys to move around.',
                type: 'interactive',
                target: 'move_10_units',
                skippable: false
            },
            {
                id: 'camera',
                title: 'Camera Control',
                description: 'Move your mouse to look around. Use mouse wheel to zoom.',
                type: 'interactive',
                target: 'rotate_camera',
                skippable: false
            },
            {
                id: 'combat_basics',
                title: 'Combat Basics',
                description: 'Left-click to attack. Try defeating this training dummy.',
                type: 'combat',
                target: 'defeat_training_dummy',
                skippable: false
            },
            {
                id: 'skills',
                title: 'Using Skills',
                description: 'Press 1-5 to use skills. Try using your first skill!',
                type: 'interactive',
                target: 'use_skill',
                skippable: false
            },
            {
                id: 'inventory',
                title: 'Inventory System',
                description: 'Press I to open your inventory. Items you collect appear here.',
                type: 'ui',
                target: 'open_inventory',
                skippable: true
            },
            {
                id: 'quests',
                title: 'Quests',
                description: 'Press J to see your quests. Complete quests to earn rewards!',
                type: 'ui',
                target: 'open_quest_log',
                skippable: true
            },
            {
                id: 'map',
                title: 'Map & Navigation',
                description: 'Press M for the world map. Use waypoints to fast travel.',
                type: 'ui',
                target: 'open_map',
                skippable: true
            },
            {
                id: 'social',
                title: 'Social Features',
                description: 'Press O for social panel. Join guilds, make friends, and team up!',
                type: 'ui',
                target: 'open_social',
                skippable: true
            },
            {
                id: 'complete',
                title: 'Tutorial Complete!',
                description: 'You\'re ready to explore! The world of Emberveil awaits you.',
                type: 'dialogue',
                duration: 5000,
                skippable: true,
                reward: {
                    gold: 100,
                    items: ['starter_potion_x5', 'beginner_weapon'],
                    xp: 500
                }
            }
        ];
    }
    
    setupReturningPlayerGuide() {
        this.tutorialSteps = [
            {
                id: 'welcome_back',
                title: 'Welcome Back!',
                description: 'Here\'s what\'s new since you\'ve been away:',
                type: 'summary',
                content: this.generateWhatsNew()
            },
            {
                id: 'changes_overview',
                title: 'Recent Changes',
                description: 'New content, balance changes, and events.',
                type: 'list',
                content: this.generateChangeList()
            },
            {
                id: 'comeback_rewards',
                title: 'Comeback Rewards',
                description: 'Here are some rewards for returning!',
                type: 'reward',
                reward: {
                    gold: 500,
                    items: ['welcome_back_chest'],
                    xp: 1000
                }
            },
            {
                id: 'quick_recap',
                title: 'Quick Recap',
                description: 'You were last: ' + this.getLastActivity(),
                type: 'info'
            }
        ];
    }
    
    setupContinuingPlayerReminders() {
        // Minimal, non-intrusive reminders
        this.tutorialSteps = [
            {
                id: 'daily_reminder',
                title: 'Daily Quests Available',
                description: 'Don\'t forget your daily quests for bonus rewards!',
                type: 'reminder',
                duration: 3000,
                skippable: true
            }
        ];
    }
    
    startOnboarding() {
        if (this.tutorialSteps.length === 0) return;
        
        this.currentStep = this.tutorialSteps[0];
        this.showStep(this.currentStep);
    }
    
    showStep(step) {
        logger.info('[PlayerOnboarding] Showing step:', step.title);
        
        // Create tutorial UI
        const tutorialUI = this.createTutorialUI(step);
        document.body.appendChild(tutorialUI);
        
        // Handle step type
        switch (step.type) {
            case 'dialogue':
                this.handleDialogueStep(step);
                break;
            case 'interactive':
                this.handleInteractiveStep(step);
                break;
            case 'combat':
                this.handleCombatStep(step);
                break;
            case 'ui':
                this.handleUIStep(step);
                break;
            case 'summary':
                this.handleSummaryStep(step);
                break;
            default:
                this.handleGenericStep(step);
        }
    }
    
    createTutorialUI(step) {
        const container = document.createElement('div');
        container.id = 'tutorial-ui';
        container.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.85);
            color: white;
            padding: 20px 30px;
            border-radius: 10px;
            max-width: 500px;
            z-index: 9999;
            border: 2px solid #FFD700;
        `;
        
        container.innerHTML = `
            <h3 style="margin: 0 0 10px 0; color: #FFD700;">${step.title}</h3>
            <p style="margin: 0 0 15px 0;">${step.description}</p>
            ${step.skippable ? '<button id="skip-tutorial" style="padding: 8px 15px; background: #666; color: white; border: none; border-radius: 5px; cursor: pointer;">Skip</button>' : ''}
        `;
        
        if (step.skippable) {
            setTimeout(() => {
                const skipBtn = document.getElementById('skip-tutorial');
                if (skipBtn) {
                    skipBtn.addEventListener('click', () => this.skipStep());
                }
            }, 0);
        }
        
        return container;
    }
    
    handleDialogueStep(step) {
        // Auto-advance after duration
        if (step.duration) {
            setTimeout(() => {
                this.completeStep(step.id);
            }, step.duration);
        }
    }
    
    handleInteractiveStep(step) {
        // Wait for player to complete action
        this.waitForAction(step.target, () => {
            this.completeStep(step.id);
        });
    }
    
    handleCombatStep(step) {
        // Spawn training dummy and wait for defeat
        // Implementation depends on game's combat system
        this.completeStep(step.id);
    }
    
    handleUIStep(step) {
        // Wait for UI element to be opened
        this.waitForUIOpen(step.target, () => {
            this.completeStep(step.id);
        });
    }
    
    handleSummaryStep(step) {
        // Show summary and wait for player to close
        setTimeout(() => {
            this.completeStep(step.id);
        }, 5000);
    }
    
    handleGenericStep(step) {
        this.completeStep(step.id);
    }
    
    completeStep(stepId) {
        this.completedSteps.add(stepId);
        this.saveProgress();
        
        // Remove tutorial UI
        const ui = document.getElementById('tutorial-ui');
        if (ui) ui.remove();
        
        // Give rewards if any
        const step = this.tutorialSteps.find(s => s.id === stepId);
        if (step?.reward) {
            this.giveRewards(step.reward);
        }
        
        // Move to next step
        const currentIndex = this.tutorialSteps.findIndex(s => s.id === stepId);
        if (currentIndex < this.tutorialSteps.length - 1) {
            this.currentStep = this.tutorialSteps[currentIndex + 1];
            setTimeout(() => this.showStep(this.currentStep), 1000);
        } else {
            this.finishOnboarding();
        }
    }
    
    skipStep() {
        if (this.currentStep) {
            this.completeStep(this.currentStep.id);
        }
    }
    
    finishOnboarding() {
        logger.info('[PlayerOnboarding] Onboarding complete!');
        this.saveProgress();
        
        // Show completion message
        const completionUI = document.createElement('div');
        completionUI.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 40px;
            border-radius: 15px;
            text-align: center;
            z-index: 10000;
            border: 3px solid #FFD700;
        `;
        completionUI.innerHTML = `
            <h2 style="color: #FFD700; margin-bottom: 15px;">Onboarding Complete!</h2>
            <p>You're all set to explore Dynasty of Emberveil!</p>
            <button onclick="this.parentElement.remove()" style="
                padding: 10px 30px;
                background: #4CAF50;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                margin-top: 20px;
                font-size: 16px;
            ">Start Adventure</button>
        `;
        document.body.appendChild(completionUI);
    }
    
    waitForAction(action, callback) {
        // Placeholder - implement action listeners
        setTimeout(callback, 3000);
    }
    
    waitForUIOpen(uiElement, callback) {
        // Placeholder - implement UI listeners
        setTimeout(callback, 2000);
    }
    
    giveRewards(reward) {
        logger.info('[PlayerOnboarding] Giving rewards:', reward);
        // Implement reward distribution
    }
    
    generateWhatsNew() {
        return [
            '• New biome: Eternal Gardens',
            '• 5 new legendary items added',
            '• Guild wars now active',
            '• New seasonal event: Winter Festival'
        ];
    }
    
    generateChangeList() {
        return [
            '• Balance: Warrior skills buffed by 10%',
            '• New: Pet battle system',
            '• Fixed: Various bug fixes',
            '• Event: Double XP weekend coming soon'
        ];
    }
    
    getLastActivity() {
        const saveData = this.loadSaveData();
        return saveData?.lastLocation || 'Emberforge Plains';
    }
    
    loadSaveData() {
        try {
            const data = localStorage.getItem('dynasty_save');
            return data ? JSON.parse(data) : null;
        } catch (error) {
            logger.error('[PlayerOnboarding] Failed to load save data:', error);
            return null;
        }
    }
    
    saveProgress() {
        try {
            const progress = {
                completedSteps: Array.from(this.completedSteps),
                playerType: this.playerType,
                lastUpdate: Date.now()
            };
            localStorage.setItem('dynasty_onboarding', JSON.stringify(progress));
        } catch (error) {
            logger.error('[PlayerOnboarding] Failed to save progress:', error);
        }
    }
    
    loadProgress() {
        try {
            const data = localStorage.getItem('dynasty_onboarding');
            if (data) {
                const progress = JSON.parse(data);
                this.completedSteps = new Set(progress.completedSteps || []);
            }
        } catch (error) {
            logger.error('[PlayerOnboarding] Failed to load progress:', error);
        }
    }
}

export default PlayerOnboardingSystem;
