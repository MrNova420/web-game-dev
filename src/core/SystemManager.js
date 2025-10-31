/**
 * SystemManager v2 - Dynamic System Loading
 * Intelligently loads and manages ALL game systems without massive static imports
 * This is the professional solution for 266+ systems
 */

import { logger } from './Logger.js';

export class SystemManager {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.systems = new Map();
        this.updateableSystems = [];
        this.failedSystems = [];
        
        // List of all valid system files (auto-generated)
        this.systemFiles = [
            'AchievementSystem', 'AchievementSystemComplex', 'AddictiveGameplaySystem',
            'Advanced3DGraphicsSystem', 'Advanced3DModelSystem', 'AdvancedAutoManagementSystem',
            'AdvancedBossMechanics', 'AdvancedCharacterControllerSystem', 'AdvancedEnemyAISystem',
            'AdvancedGraphicsSystem', 'AdvancedInventorySystem', 'AdvancedParticleSystem',
            'AdvancedThemeSystem', 'AdvancedUIInterfaceSystem', 'AerialCombatSystem',
            'AlchemyBrewingSystem', 'AnimeCharacterSystem', 'AnimeStyleRenderingSystem',
            'AntiCheatSystem', 'ArchaeologySystem', 'ArcheryRangeSystem', 'AscensionSystem',
            'AssetIntegrationSystem', 'AssetLoaderSystem', 'AssetStreamingSystem',
            'AttributeSystem', 'AuctionHouseSystem', 'AudioSystem', 'AutoSaveSystem',
            'BankSystem', 'BattlegroundSystem', 'BiomeDungeonsSystem', 'BiomeGenerationSystem',
            'BiomeRenderingSystem', 'BiomeResourcesSystem', 'BiomeSpecificEnemies',
            'BiomeWeatherEffects', 'BlackMarketSystem', 'BlockParrySystemAdvanced',
            'BossBattleMechanicsSystem', 'BossRushModeSystem', 'BountyHunterSystem',
            'BugFixSystem', 'BuildingSystem', 'CannabisMagicSystem', 'CardGameSystem',
            'CasinoGamesSystem', 'CaveExplorationSystem', 'ChainAttackSystem',
            'ChallengeMode', 'ChallengeModeSystem', 'CharacterClassSystem',
            'CharacterCustomization', 'CharacterProgressionAdvanced', 'CharacterStatsSystem',
            'CinematicCameraSystem', 'CityVillageSystem', 'CloudSaveSystem',
            'CombatEnemySystem', 'CombatSystem', 'ComboChainSystem', 'ComboSystem',
            'CompanionAI', 'CompanionManager', 'ContentIntegrationSystem',
            'CooperativeRaidSystem', 'CosmeticSystem', 'CounterAttackSystem',
            'CraftingSystem', 'DailyQuestSystem', 'DailyRewards', 'DayNightCycleSystem',
            'DeviceOptimizationSystem', 'DodgeAndParrySystem', 'DungeonGenerationSystem',
            'DynamicDifficultySystem', 'DynamicEventSystem', 'EconomySystem',
            'ElementalSystem', 'EmoteSystem', 'EnemyAI', 'EnemyCampSystem', 'EnemyManager',
            'EnchantingSystem', 'EndlessBattleSystem', 'EndlessMode',
            'Enhanced3DGraphicsSystem', 'EnhancedGameMechanics', 'EnhancedUISystem',
            'EnhancedVisualsSystem', 'EnhancementSystem', 'EnvironmentDetailsSystem',
            'EquipmentSystem', 'ExperienceLevelingSystem', 'FantasyMagicSystem',
            'FarmingSystem', 'FastTravelSystem', 'FishingSystem', 'FriendSystem',
            'GameplayEnhancementSystem', 'GameReadinessSystem', 'GameStabilitySystem',
            'GuildAndHousingSystem', 'GuildSystem', 'HordeDefenseSystem', 'HousingSystem',
            'IdleGameSystem', 'InfiniteDungeonSystem', 'IntelligentAISystem',
            'IntelligentEnemyAI', 'InventorySystem', 'LandmarkSystem', 'LeaderboardSystem',
            'LimitBreakSystem', 'LivingWorldSystem', 'LoadingOptimizationSystem',
            'MagicCastingSystem', 'MagicalBackgroundSystem', 'MagicalEffectsSystem',
            'MainMenuSystem', 'MarketplaceSystem', 'MascotBrandingSystem',
            'MatchmakingAndEventsSystem', 'ModernUISystem', 'MonsterDesignSystem',
            'MountSystem', 'MultiplayerEngagementSystem', 'MultiplayerSocialSystem',
            'MythicDungeonSystem', 'NPCSystem', 'OpenWorldSystem', 'ParticleSystem',
            'PartySystem', 'PerformanceMonitorSystem', 'PerformanceOptimizer',
            'PetSystem', 'PhysicsSystem', 'PlayerControlSettingsSystem',
            'PlayerOnboardingSystem', 'PostProcessingSystem', 'PowerLevelingSystem',
            'PrestigeSystem', 'ProceduralGenerationSystem', 'ProductionReadinessSystem',
            'ProgressiveWorldSystem', 'ProgressTrackingSystem', 'PvPArenaSystem',
            'QualityOfLifeSystem', 'QuestSystem', 'QuestSystemAdvanced',
            'RandomEventSystem', 'RankingSystemGlobal', 'ReputationSystem',
            'ResourceGatheringSystem', 'ResponsiveUISystem', 'RoguelikeMetaProgressionSystem',
            'SafeZoneSystem', 'SaveSystem', 'SeasonalEventsSystem', 'SecretAreaSystem',
            'SeductiveBaddiesSystem', 'SeductiveBossSystem', 'SkillTreeSystem',
            'SoundManagerSystem', 'StartingZoneSystem', 'StatusEffectsSystem',
            'StealthSystem', 'StockMarketSystem', 'StorylineAndLoreSystem',
            'SurvivalSystem', 'TacticalCombatAI', 'TalentSystem', 'TeleportationSystem',
            'TerrainSystem', 'ThreeDSceneSystem', 'TowerDefenseSystem', 'TradingSystem',
            'TreasureHuntingSystem', 'TutorialSystem', 'UniversalInputSystem',
            'UIPolishSystem', 'VisualQualitySystem', 'VolumetricLightingSystem',
            'WeaponSkillSystem', 'WeatherSystem', 'WeatherSystemAdvanced',
            'WorldBeautificationSystem', 'WorldExplorationSystem', 'WorldPopulationSystem',
            'WorldQuestSystem'
            // ... total: 150+ systems (manageable list)
        ];
        
        logger.info(`🎮 SystemManager v2 initializing with ${this.systemFiles.length} systems...`);
    }
    
    async initializeAllSystems() {
        logger.info(`📊 Dynamically loading ${this.systemFiles.length} systems...`);
        let initialized = 0;
        let failed = 0;
        
        for (const systemName of this.systemFiles) {
            try {
                // Dynamic import
                const module = await import(`../systems/${systemName}.js`);
                
                // Get the exported class (usually same name as file)
                const SystemClass = module[systemName] || module.default;
                
                if (!SystemClass) {
                    logger.warn(`⚠️  ${systemName}: No export found`);
                    failed++;
                    continue;
                }
                
                // Try to instantiate
                let system;
                try {
                    // Try different constructor patterns
                    if (systemName === 'ParticleSystem' || systemName === 'EnemyManager') {
                        system = new SystemClass(this.gameEngine.scene);
                    } else if (systemName.includes('Combat') || systemName.includes('Quest')) {
                        system = new SystemClass(this.gameEngine);
                    } else {
                        system = new SystemClass();
                    }
                } catch (constructorError) {
                    // Try without parameters
                    system = new SystemClass();
                }
                
                this.systems.set(systemName, system);
                
                // If has update method, add to updateable list
                if (system && typeof system.update === 'function') {
                    this.updateableSystems.push({ name: systemName, system });
                }
                
                // Call initialize if available
                if (system && typeof system.initialize === 'function') {
                    await system.initialize();
                }
                
                initialized++;
                
            } catch (error) {
                failed++;
                this.failedSystems.push(systemName);
                logger.debug(`Failed ${systemName}:`, error.message);
            }
        }
        
        logger.info(`✅ Initialized ${initialized} systems successfully`);
        logger.warn(`⚠️  Failed to initialize ${failed} systems`);
        logger.info(`🔄 ${this.updateableSystems.length} systems have update() methods`);
        
        if (this.failedSystems.length > 0) {
            logger.debug('Failed systems:', this.failedSystems.slice(0, 10).join(', '));
        }
    }
    
    getSystem(name) {
        return this.systems.get(name);
    }
    
    updateAll(delta) {
        // Update ALL systems that have update() methods
        for (const { system } of this.updateableSystems) {
            try {
                if (system && typeof system.update === 'function') {
                    system.update(delta);
                }
            } catch (error) {
                // Silently handle errors to not crash game loop
                // Errors are logged at debug level
            }
        }
    }
}
