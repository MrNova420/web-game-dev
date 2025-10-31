/**
 * GameplayEnhancementSystem - Makes gameplay more fun, engaging, and polished
 * Enhances: Combat feel, exploration rewards, progression satisfaction
 * Adds: Juice, feedback, rewards, surprises, quality-of-life features
 */

export class GameplayEnhancementSystem {
    constructor() {
        this.enhancements = new Map();
        this.activeFeatures = new Set();
        this.playerFeedback = [];
        
        logger.info('[GameplayEnhancementSystem] Initializing gameplay enhancements...');
        
        this.setupEnhancements();
    }

    /**
     * Setup all gameplay enhancements
     */
    setupEnhancements() {
        // Combat feel enhancements
        this.enhancements.set('combatJuice', {
            hitStop: true,              // Freeze frame on hit
            screenShake: true,          // Screen shake on impacts
            slowMo: true,               // Slow motion on crits
            particleBursts: true,       // Particle explosions
            soundEffects: true          // Impact sounds
        });

        // Exploration enhancements
        this.enhancements.set('exploration', {
            discoveryRewards: true,     // Rewards for finding secrets
            landmarkMarkers: true,      // Mark interesting locations
            treasureHints: true,        // Subtle hints for treasure
            environmentalStories: true  // Lore in environment
        });

        // Progression enhancements
        this.enhancements.set('progression', {
            levelUpCelebration: true,   // Big celebration on level up
            skillUnlockEffect: true,    // Flash effect on skill unlock
            achievementPopup: true,     // Satisfying achievement popup
            progressBars: true,         // Visual progress indicators
            milestoneRewards: true      // Extra rewards at milestones
        });

        // Quality of life features
        this.enhancements.set('qol', {
            autoLoot: false,            // Optional auto-loot
            questTracker: true,         // On-screen quest tracker
            minimapIcons: true,         // Icons on minimap
            fastTravel: true,           // Quick fast travel
            repairAll: true             // Repair all items at once
        });

        // Social features
        this.enhancements.set('social', {
            emoteWheel: true,           // Quick emote access
            guildChat: true,            // In-game guild chat
            partyMarkers: true,         // See party members on map
            friendStatus: true          // See friend online status
        });

        logger.info(`[GameplayEnhancementSystem] ${this.enhancements.size} enhancement categories loaded`);
    }

    /**
     * Apply combat juice enhancements
     */
    applyCombatJuice(event) {
        const enhancements = this.enhancements.get('combatJuice');
        if (!enhancements) return;

        // Hit stop (freeze frame)
        if (enhancements.hitStop && event.type === 'hit') {
            this.applyHitStop(event.damage);
        }

        // Screen shake
        if (enhancements.screenShake && event.type === 'impact') {
            this.applyScreenShake(event.intensity || 1.0);
        }

        // Slow motion on critical hits
        if (enhancements.slowMo && event.critical) {
            this.applySlowMotion(0.3, 300); // 0.3x speed for 300ms
        }

        // Particle bursts
        if (enhancements.particleBursts) {
            this.createParticleBurst(event.position, event.element || 'physical');
        }

        // Sound effects
        if (enhancements.soundEffects) {
            this.playImpactSound(event.type, event.damage);
        }
    }

    /**
     * Apply hit stop (freeze frame effect)
     */
    applyHitStop(damage) {
        const duration = Math.min(damage * 2, 100); // Max 100ms
        
        logger.info(`[GameplayEnhancementSystem] Hit stop: ${duration}ms`);
        
        // Freeze game for brief moment
        if (typeof window !== 'undefined' && window.game) {
            const originalTimeScale = window.game.timeScale || 1.0;
            window.game.timeScale = 0;
            
            setTimeout(() => {
                if (window.game) {
                    window.game.timeScale = originalTimeScale;
                }
            }, duration);
        }
    }

    /**
     * Apply screen shake
     */
    applyScreenShake(intensity) {
        logger.info(`[GameplayEnhancementSystem] Screen shake: ${intensity}`);
        
        // Shake camera
        if (typeof window !== 'undefined' && window.game && window.game.camera) {
            const camera = window.game.camera;
            const originalPosition = camera.position.clone();
            
            const shakeAmount = intensity * 0.1;
            const duration = 200; // ms
            const startTime = Date.now();
            
            const shake = () => {
                const elapsed = Date.now() - startTime;
                if (elapsed < duration) {
                    camera.position.x = originalPosition.x + (Math.random() - 0.5) * shakeAmount;
                    camera.position.y = originalPosition.y + (Math.random() - 0.5) * shakeAmount;
                    requestAnimationFrame(shake);
                } else {
                    camera.position.copy(originalPosition);
                }
            };
            
            shake();
        }
    }

    /**
     * Apply slow motion effect
     */
    applySlowMotion(timeScale, duration) {
        logger.info(`[GameplayEnhancementSystem] Slow motion: ${timeScale}x for ${duration}ms`);
        
        if (typeof window !== 'undefined' && window.game) {
            const originalTimeScale = window.game.timeScale || 1.0;
            window.game.timeScale = timeScale;
            
            setTimeout(() => {
                if (window.game) {
                    window.game.timeScale = originalTimeScale;
                }
            }, duration);
        }
    }

    /**
     * Create particle burst
     */
    createParticleBurst(position, element) {
        // Create particle effect at position with element color
        const elementColors = {
            physical: 0xFFFFFF,
            fire: 0xFF4500,
            ice: 0x00BFFF,
            lightning: 0xFFFF00,
            holy: 0xFFD700,
            dark: 0x9400D3,
            nature: 0x00FF00,
            arcane: 0xFF00FF
        };

        const color = elementColors[element] || 0xFFFFFF;
        
        logger.info(`[GameplayEnhancementSystem] Particle burst: ${element} at`, position);
        
        // Actual particle creation would happen here
        // Using Kenney Particle Pack sprites
    }

    /**
     * Play impact sound
     */
    playImpactSound(type, damage) {
        // Sound intensity based on damage
        const volume = Math.min(damage / 100, 1.0);
        
        logger.info(`[GameplayEnhancementSystem] Impact sound: ${type}, volume: ${volume}`);
        
        // Actual sound playback would happen here
        // Using Freesound audio effects
    }

    /**
     * Apply exploration enhancements
     */
    enhanceExploration(discoveryEvent) {
        const enhancements = this.enhancements.get('exploration');
        if (!enhancements) return;

        // Discovery rewards
        if (enhancements.discoveryRewards && discoveryEvent.type === 'secret') {
            this.grantDiscoveryReward(discoveryEvent);
        }

        // Landmark markers
        if (enhancements.landmarkMarkers && discoveryEvent.type === 'landmark') {
            this.addLandmarkMarker(discoveryEvent.location, discoveryEvent.name);
        }

        // Treasure hints
        if (enhancements.treasureHints) {
            this.provideTreasureHint(discoveryEvent.location);
        }
    }

    /**
     * Grant discovery reward
     */
    grantDiscoveryReward(discovery) {
        const rewards = {
            xp: discovery.rarity * 100,
            gold: discovery.rarity * 50,
            title: discovery.rare ? `${discovery.name} Explorer` : null
        };

        logger.info(`[GameplayEnhancementSystem] Discovery reward:`, rewards);
        
        // Show reward notification
        this.showRewardNotification(rewards);
    }

    /**
     * Show reward notification
     */
    showRewardNotification(rewards) {
        // Display popup with rewards
        logger.info('[GameplayEnhancementSystem] Showing reward notification:', rewards);
        
        // UI would display this beautifully with animations
    }

    /**
     * Add landmark marker
     */
    addLandmarkMarker(location, name) {
        logger.info(`[GameplayEnhancementSystem] Adding landmark: ${name} at`, location);
        
        // Add marker to map
        // Using game-icons.net for marker icon
    }

    /**
     * Provide treasure hint
     */
    provideTreasureHint(playerLocation) {
        // Check if treasure is nearby
        // Provide subtle visual/audio hint
        logger.info('[GameplayEnhancementSystem] Checking for nearby treasure...');
    }

    /**
     * Apply progression enhancements
     */
    enhanceProgression(progressEvent) {
        const enhancements = this.enhancements.get('progression');
        if (!enhancements) return;

        // Level up celebration
        if (enhancements.levelUpCelebration && progressEvent.type === 'levelUp') {
            this.celebrateLevelUp(progressEvent.newLevel);
        }

        // Skill unlock effect
        if (enhancements.skillUnlockEffect && progressEvent.type === 'skillUnlock') {
            this.showSkillUnlockEffect(progressEvent.skill);
        }

        // Achievement popup
        if (enhancements.achievementPopup && progressEvent.type === 'achievement') {
            this.showAchievementPopup(progressEvent.achievement);
        }

        // Milestone rewards
        if (enhancements.milestoneRewards && progressEvent.isMilestone) {
            this.grantMilestoneReward(progressEvent);
        }
    }

    /**
     * Celebrate level up
     */
    celebrateLevelUp(newLevel) {
        logger.info(`[GameplayEnhancementSystem] LEVEL UP! New level: ${newLevel}`);
        
        // Full screen effect
        // Particle burst from player
        // Sound effect
        // Screen flash
        // Level up text with animation
        
        // Using Kenney particles for burst
        // Using Freesound for fanfare
    }

    /**
     * Show skill unlock effect
     */
    showSkillUnlockEffect(skill) {
        logger.info(`[GameplayEnhancementSystem] Skill unlocked: ${skill.name}`);
        
        // Flash effect
        // Skill icon appears with animation
        // Sound effect
        
        // Using game-icons.net for skill icon
    }

    /**
     * Show achievement popup
     */
    showAchievementPopup(achievement) {
        logger.info(`[GameplayEnhancementSystem] Achievement unlocked: ${achievement.name}`);
        
        // Slide in from side
        // Achievement icon + name + description
        // Sound effect
        // Stays for 5 seconds then fades out
        
        // Using Kenney UI Pack for popup design
        // Using game-icons.net for achievement icon
    }

    /**
     * Grant milestone reward
     */
    grantMilestoneReward(milestone) {
        const rewards = {
            type: 'milestone',
            level: milestone.level,
            items: ['Milestone Chest', 'Title'],
            xp: 1000,
            gold: 500
        };

        logger.info(`[GameplayEnhancementSystem] Milestone reward at level ${milestone.level}:`, rewards);
        
        this.showRewardNotification(rewards);
    }

    /**
     * Apply quality of life features
     */
    applyQoLFeatures() {
        const features = this.enhancements.get('qol');
        if (!features) return;

        // These would be available in settings/options
        logger.info('[GameplayEnhancementSystem] QoL features available:', features);
    }

    /**
     * Toggle enhancement feature
     */
    toggleFeature(category, featureName, enabled) {
        const enhancements = this.enhancements.get(category);
        if (enhancements && enhancements.hasOwnProperty(featureName)) {
            enhancements[featureName] = enabled;
            logger.info(`[GameplayEnhancementSystem] ${category}.${featureName} = ${enabled}`);
            return true;
        }
        return false;
    }

    /**
     * Get all enhancement settings
     */
    getEnhancementSettings() {
        const settings = {};
        for (const [category, enhancements] of this.enhancements.entries()) {
            settings[category] = { ...enhancements };
        }
        return settings;
    }

    /**
     * Get player feedback summary
     */
    getFeedbackSummary() {
        return {
            total: this.playerFeedback.length,
            positive: this.playerFeedback.filter(f => f.sentiment === 'positive').length,
            negative: this.playerFeedback.filter(f => f.sentiment === 'negative').length,
            recent: this.playerFeedback.slice(-10)
        };
    }
}
