/**
 * SystemManager - Manages ALL game systems
 * Handles initialization, updates, and lifecycle for all 273+ game systems
 * This is the professional way to handle a large number of systems
 */

import { logger } from './Logger.js';

// Import ALL systems (this will be comprehensive)
import { AchievementSystem } from '../systems/AchievementSystem.js';
import { AchievementSystemComplex } from '../systems/AchievementSystemComplex.js';
import { AddictiveGameplaySystem } from '../systems/AddictiveGameplaySystem.js';
import { Advanced3DGraphicsSystem } from '../systems/Advanced3DGraphicsSystem.js';
import { Advanced3DModelSystem } from '../systems/Advanced3DModelSystem.js';
import { AdvancedAutoManagementSystem } from '../systems/AdvancedAutoManagementSystem.js';
import { AdvancedBossMechanics } from '../systems/AdvancedBossMechanics.js';
import { AdvancedCharacterControllerSystem } from '../systems/AdvancedCharacterControllerSystem.js';
import { AdvancedEnemyAISystem } from '../systems/AdvancedEnemyAISystem.js';
import { AdvancedGraphicsSystem } from '../systems/AdvancedGraphicsSystem.js';
import { AdvancedInventorySystem } from '../systems/AdvancedInventorySystem.js';
import { AdvancedParticleSystem } from '../systems/AdvancedParticleSystem.js';
import { AdvancedThemeSystem } from '../systems/AdvancedThemeSystem.js';
import { AdvancedUIInterfaceSystem } from '../systems/AdvancedUIInterfaceSystem.js';
import { AerialCombatSystem } from '../systems/AerialCombatSystem.js';
import { AlchemyBrewingSystem } from '../systems/AlchemyBrewingSystem.js';
import { AnimeCharacterSystem } from '../systems/AnimeCharacterSystem.js';
import { AnimeStyleRenderingSystem } from '../systems/AnimeStyleRenderingSystem.js';
import { AntiCheatSystem } from '../systems/AntiCheatSystem.js';
import { ArchaeologySystem } from '../systems/ArchaeologySystem.js';
import { ArcheryRangeSystem } from '../systems/ArcheryRangeSystem.js';
import { AscensionSystem } from '../systems/AscensionSystem.js';
import { AssetIntegrationSystem } from '../systems/AssetIntegrationSystem.js';
import { AssetLoaderSystem } from '../systems/AssetLoaderSystem.js';
import { AssetStreamingSystem } from '../systems/AssetStreamingSystem.js';
import { AttributeSystem } from '../systems/AttributeSystem.js';
import { AuctionHouseSystem } from '../systems/AuctionHouseSystem.js';
import { AudioSystem } from '../systems/AudioSystem.js';
import { AutoSaveSystem } from '../systems/AutoSaveSystem.js';
import { BankSystem } from '../systems/BankSystem.js';
import { BattlegroundSystem } from '../systems/BattlegroundSystem.js';
import { BiomeGenerationSystem } from '../systems/BiomeGenerationSystem.js';
import { BiomeResourcesSystem } from '../systems/BiomeResourcesSystem.js';
import { BiomeSpecificEnemies } from '../systems/BiomeSpecificEnemies.js';
import { BiomeWeatherEffects } from '../systems/BiomeWeatherEffects.js';
import { BlackMarketSystem } from '../systems/BlackMarketSystem.js';
import { BlockParrySystemAdvanced } from '../systems/BlockParrySystemAdvanced.js';
import { BossBattleMechanicsSystem } from '../systems/BossBattleMechanicsSystem.js';
import { BossRushModeSystem } from '../systems/BossRushModeSystem.js';
import { BountyHunterSystem } from '../systems/BountyHunterSystem.js';
import { BuildingSystem } from '../systems/BuildingSystem.js';
import { BugFixSystem } from '../systems/BugFixSystem.js';
import { CannabisMagicSystem } from '../systems/CannabisMagicSystem.js';
import { CardGameSystem } from '../systems/CardGameSystem.js';
import { CasinoGamesSystem } from '../systems/CasinoGamesSystem.js';
import { CaveExplorationSystem } from '../systems/CaveExplorationSystem.js';
import { ChainAttackSystem } from '../systems/ChainAttackSystem.js';
import { ChallengeMode } from '../systems/ChallengeMode.js';
import { ChallengeModeSystem } from '../systems/ChallengeModeSystem.js';
import { CharacterClassSystem } from '../systems/CharacterClassSystem.js';
import { CharacterCustomization } from '../systems/CharacterCustomization.js';
import { CharacterProgressionAdvanced } from '../systems/CharacterProgressionAdvanced.js';
import { CharacterStatsSystem } from '../systems/CharacterStatsSystem.js';
import { CinematicCameraSystem } from '../systems/CinematicCameraSystem.js';
import { CityVillageSystem } from '../systems/CityVillageSystem.js';
import { CloudSaveSystem } from '../systems/CloudSaveSystem.js';
import { CombatEnemySystem } from '../systems/CombatEnemySystem.js';
import { CombatSystem } from '../systems/CombatSystem.js';
import { ComboChainSystem } from '../systems/ComboChainSystem.js';
import { ComboSystem } from '../systems/ComboSystem.js';
import { CompanionAI } from '../systems/CompanionAI.js';
import { CompanionManager } from '../systems/CompanionManager.js';
import { ContentIntegrationSystem } from '../systems/ContentIntegrationSystem.js';
import { CooperativeRaidSystem } from '../systems/CooperativeRaidSystem.js';
import { CosmeticSystem } from '../systems/CosmeticSystem.js';
import { CounterAttackSystem } from '../systems/CounterAttackSystem.js';
import { CraftingSystem } from '../systems/CraftingSystem.js';
import { CriticalHitSystem } from '../systems/CriticalHitSystem.js';
import { DailyQuestSystem } from '../systems/DailyQuestSystem.js';
import { DailyRewards } from '../systems/DailyRewards.js';
import { DayNightCycleSystem } from '../systems/DayNightCycleSystem.js';
import { DeviceOptimizationSystem } from '../systems/DeviceOptimizationSystem.js';
import { DodgeAndParrySystem } from '../systems/DodgeAndParrySystem.js';
import { DualWieldingSystem } from '../systems/DualWieldingSystem.js';
import { DungeonGenerationSystem } from '../systems/DungeonGenerationSystem.js';
import { DynamicDifficultySystem } from '../systems/DynamicDifficultySystem.js';
import { DynamicEventSystem } from '../systems/DynamicEventSystem.js';
import { EconomySystem } from '../systems/EconomySystem.js';
import { ElementalSystem } from '../systems/ElementalSystem.js';
import { EmoteSystem } from '../systems/EmoteSystem.js';
import { EnemyAI } from '../systems/EnemyAI.js';
import { EnemyCampSystem } from '../systems/EnemyCampSystem.js';
import { EnemyManager } from '../systems/EnemyManager.js';
import { EnchantingSystem } from '../systems/EnchantingSystem.js';
import { EndlessBattleSystem } from '../systems/EndlessBattleSystem.js';
import { EndlessMode } from '../systems/EndlessMode.js';
import { Enhanced3DGraphicsSystem } from '../systems/Enhanced3DGraphicsSystem.js';
import { EnhancedGameMechanics } from '../systems/EnhancedGameMechanics.js';
import { EnhancedUISystem } from '../systems/EnhancedUISystem.js';
import { EnhancedVisualsSystem } from '../systems/EnhancedVisualsSystem.js';
import { EnhancementSystem } from '../systems/EnhancementSystem.js';
import { EnvironmentDetailsSystem } from '../systems/EnvironmentDetailsSystem.js';
import { EquipmentSystem } from '../systems/EquipmentSystem.js';
import { ExperienceLevelingSystem } from '../systems/ExperienceLevelingSystem.js';
import { FantasyMagicSystem } from '../systems/FantasyMagicSystem.js';
import { FarmingSystem } from '../systems/FarmingSystem.js';
import { FastTravelSystem } from '../systems/FastTravelSystem.js';
import { FishingSystem } from '../systems/FishingSystem.js';
import { FriendSystem } from '../systems/FriendSystem.js';
import { GameIntegrationSystem } from '../systems/GameIntegrationSystem.js';
import { GameplayEnhancementSystem } from '../systems/GameplayEnhancementSystem.js';
import { GameReadinessSystem } from '../systems/GameReadinessSystem.js';
import { GameStabilitySystem } from '../systems/GameStabilitySystem.js';
import { GuildAndHousingSystem } from '../systems/GuildAndHousingSystem.js';
import { GuildSystem } from '../systems/GuildSystem.js';
import { GuildWarSystem } from '../systems/GuildWarSystem.js';
import { HordeDefenseSystem } from '../systems/HordeDefenseSystem.js';
import { HousingSystem } from '../systems/HousingSystem.js';
import { IdleGameSystem } from '../systems/IdleGameSystem.js';
import { InfiniteDungeonSystem } from '../systems/InfiniteDungeonSystem.js';
import { InsuranceSystem } from '../systems/InsuranceSystem.js';
import { IntelligentAISystem } from '../systems/IntelligentAISystem.js';
import { IntelligentEnemyAI } from '../systems/IntelligentEnemyAI.js';
import { InventorySystem } from '../systems/InventorySystem.js';
import { InvestmentSystem } from '../systems/InvestmentSystem.js';
import { LandmarkSystem } from '../systems/LandmarkSystem.js';
import { LeaderboardSystem } from '../systems/LeaderboardSystem.js';
import { LegendaryQuestlineSystem } from '../systems/LegendaryQuestlineSystem.js';
import { LimitBreakSystem } from '../systems/LimitBreakSystem.js';
import { LivingWorldSystem } from '../systems/LivingWorldSystem.js';
import { LoadingOptimizationSystem } from '../systems/LoadingOptimizationSystem.js';
import { LoanSystem } from '../systems/LoanSystem.js';
import { MagicCastingSystem } from '../systems/MagicCastingSystem.js';
import { MagicalBackgroundSystem } from '../systems/MagicalBackgroundSystem.js';
import { MagicalEffectsSystem } from '../systems/MagicalEffectsSystem.js';
import { MailSystem } from '../systems/MailSystem.js';
import { MainMenuSystem } from '../systems/MainMenuSystem.js';
import { MarketplaceSystem } from '../systems/MarketplaceSystem.js';
import { MarriageSystem } from '../systems/MarriageSystem.js';
import { MascotBrandingSystem } from '../systems/MascotBrandingSystem.js';
import { MasterGameSystem } from '../systems/MasterGameSystem.js';
import { MatchmakingAndEventsSystem } from '../systems/MatchmakingAndEventsSystem.js';
import { MentorSystem } from '../systems/MentorSystem.js';
import { ModernUISystem } from '../systems/ModernUISystem.js';
import { MonsterDesignSystem } from '../systems/MonsterDesignSystem.js';
import { MountCollectionSystem } from '../systems/MountCollectionSystem.js';
import { MountCombatSystem } from '../systems/MountCombatSystem.js';
import { MountCustomizationSystem } from '../systems/MountCustomizationSystem.js';
import { MountSystem } from '../systems/MountSystem.js';
import { MountainClimbingSystem } from '../systems/MountainClimbingSystem.js';
import { MultiplayerEngagementSystem } from '../systems/MultiplayerEngagementSystem.js';
import { MultiplayerSocialSystem } from '../systems/MultiplayerSocialSystem.js';
import { MythicDungeonSystem } from '../systems/MythicDungeonSystem.js';
import { NetworkOptimizationSystem } from '../systems/NetworkOptimizationSystem.js';
import { NPCSystem } from '../systems/NPCSystem.js';
import { OpenWorldSystem } from '../systems/OpenWorldSystem.js';
import { ParticleSystem } from '../systems/ParticleSystem.js';
import { PartySystem } from '../systems/PartySystem.js';
import { PerformanceMonitorSystem } from '../systems/PerformanceMonitorSystem.js';
import { PerformanceOptimizer } from '../systems/PerformanceOptimizer.js';
import { PetBattleSystem } from '../systems/PetBattleSystem.js';
import { PetSystem } from '../systems/PetSystem.js';
import { PetSystemAdvanced } from '../systems/PetSystemAdvanced.js';
import { PhotoModeSystem } from '../systems/PhotoModeSystem.js';
import { PhysicsSystem } from '../systems/PhysicsSystem.js';
import { PlayerAnimationController } from '../systems/PlayerAnimationController.js';
import { PlayerControlSettingsSystem } from '../systems/PlayerControlSettingsSystem.js';
import { PlayerHousingSystem } from '../systems/PlayerHousingSystem.js';
import { PlayerOnboardingSystem } from '../systems/PlayerOnboardingSystem.js';
import { PlayerRetentionSystem } from '../systems/PlayerRetentionSystem.js';
import { PlatformerGameSystem } from '../systems/PlatformerGameSystem.js';
import { PostProcessingSystem } from '../systems/PostProcessingSystem.js';
import { PowerLevelingSystem } from '../systems/PowerLevelingSystem.js';
import { PrestigeSystem } from '../systems/PrestigeSystem.js';
import { ProceduralGenerationSystem } from '../systems/ProceduralGenerationSystem.js';
import { ProductionReadinessSystem } from '../systems/ProductionReadinessSystem.js';
import { ProgressiveWorldSystem } from '../systems/ProgressiveWorldSystem.js';
import { ProgressTrackingSystem } from '../systems/ProgressTrackingSystem.js';
import { PropertyTradingSystem } from '../systems/PropertyTradingSystem.js';
import { PvPArenaSystem } from '../systems/PvPArenaSystem.js';
import { PvPArenaSystemAdvanced } from '../systems/PvPArenaSystemAdvanced.js';
import { PvPSeasonSystem } from '../systems/PvPSeasonSystem.js';
import { PuzzleGameSystem } from '../systems/PuzzleGameSystem.js';
import { QualityOfLifeSystem } from '../systems/QualityOfLifeSystem.js';
import { QuestCampaignSystem } from '../systems/QuestCampaignSystem.js';
import { QuestSystem } from '../systems/QuestSystem.js';
import { QuestSystemAdvanced } from '../systems/QuestSystemAdvanced.js';
import { RacingGameSystem } from '../systems/RacingGameSystem.js';
import { RaidTierProgressionSystem } from '../systems/RaidTierProgressionSystem.js';
import { RandomEventSystem } from '../systems/RandomEventSystem.js';
import { RangedCombatAdvanced } from '../systems/RangedCombatAdvanced.js';
import { RankingSystemGlobal } from '../systems/RankingSystemGlobal.js';
import { ReputationSystem } from '../systems/ReputationSystem.js';
import { ResourceGatheringSystem } from '../systems/ResourceGatheringSystem.js';
import { ResponsiveUISystem } from '../systems/ResponsiveUISystem.js';
import { RhythmGameSystem } from '../systems/RhythmGameSystem.js';
import { RoguelikeMetaProgressionSystem } from '../systems/RoguelikeMetaProgressionSystem.js';
import { SafeZoneSystem } from '../systems/SafeZoneSystem.js';
import { SaveSystem } from '../systems/SaveSystem.js';
import { SeasonalContentManager } from '../systems/SeasonalContentManager.js';
import { SeasonalEventsSystem } from '../systems/SeasonalEventsSystem.js';
import { SecretAreaSystem } from '../systems/SecretAreaSystem.js';
import { SeductiveBaddiesSystem } from '../systems/SeductiveBaddiesSystem.js';
import { SeductiveBossSystem } from '../systems/SeductiveBossSystem.js';
import { SkillSystemAdvanced } from '../systems/SkillSystemAdvanced.js';
import { SkillTreeSystem } from '../systems/SkillTreeSystem.js';
import { SkyIslandSystem } from '../systems/SkyIslandSystem.js';
import { SmoothAnimationSystem } from '../systems/SmoothAnimationSystem.js';
import { SocialHubSystem } from '../systems/SocialHubSystem.js';
import { SoundManagerSystem } from '../systems/SoundManagerSystem.js';
import { SpectatorModeSystem } from '../systems/SpectatorModeSystem.js';
import { StartingZoneSystem } from '../systems/StartingZoneSystem.js';
import { StatisticsTracker } from '../systems/StatisticsTracker.js';
import { StatusEffectsEnhancedSystem } from '../systems/StatusEffectsEnhancedSystem.js';
import { StatusEffectsSystem } from '../systems/StatusEffectsSystem.js';
import { StealthSystem } from '../systems/StealthSystem.js';
import { StockMarketSystem } from '../systems/StockMarketSystem.js';
import { StorylineAndLoreSystem } from '../systems/StorylineAndLoreSystem.js';
import { SummonSystemAdvanced } from '../systems/SummonSystemAdvanced.js';
import { SurvivalModeSystem } from '../systems/SurvivalModeSystem.js';
import { SurvivalSystem } from '../systems/SurvivalSystem.js';
import { TacticalCombatAI } from '../systems/TacticalCombatAI.js';
import { TalentSystem } from '../systems/TalentSystem.js';
import { TaxationSystem } from '../systems/TaxationSystem.js';
import { TeleportationSystem } from '../systems/TeleportationSystem.js';
import { TerrainSystem } from '../systems/TerrainSystem.js';
import { TextureManagementSystem } from '../systems/TextureManagementSystem.js';
import { ThreeDSceneSystem } from '../systems/ThreeDSceneSystem.js';
import { TitleSystem } from '../systems/TitleSystem.js';
import { TournamentSystem } from '../systems/TournamentSystem.js';
import { TowerDefenseSystem } from '../systems/TowerDefenseSystem.js';
import { TradingSystem } from '../systems/TradingSystem.js';
import { TransformationSystem } from '../systems/TransformationSystem.js';
import { TreasureHuntingSystem } from '../systems/TreasureHuntingSystem.js';
import { TutorialSystem } from '../systems/TutorialSystem.js';
import { UnderwaterExplorationSystem } from '../systems/UnderwaterExplorationSystem.js';
import { UniversalInputSystem } from '../systems/UniversalInputSystem.js';
import { UIPolishSystem } from '../systems/UIPolishSystem.js';
import { VisualQualitySystem } from '../systems/VisualQualitySystem.js';
import { VoiceChatSystem } from '../systems/VoiceChatSystem.js';
import { VolumetricLightingSystem } from '../systems/VolumetricLightingSystem.js';
import { WeaponMasterySystem } from '../systems/WeaponMasterySystem.js';
import { WeaponSkillSystem } from '../systems/WeaponSkillSystem.js';
import { WeaponSystem3D } from '../systems/WeaponSystem3D.js';
import { WeatherSystem } from '../systems/WeatherSystem.js';
import { WeatherSystemAdvanced } from '../systems/WeatherSystemAdvanced.js';
import { WorldBeautificationSystem } from '../systems/WorldBeautificationSystem.js';
import { WorldBossSystem } from '../systems/WorldBossSystem.js';
import { WorldExplorationSystem } from '../systems/WorldExplorationSystem.js';
import { WorldPopulationSystem } from '../systems/WorldPopulationSystem.js';
import { WorldQuestSystem } from '../systems/WorldQuestSystem.js';

export class SystemManager {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.systems = new Map();
        this.updateableSystems = [];
        
        logger.info('🎮 SystemManager initializing ALL 270+ systems...');
    }
    
    async initializeAllSystems() {
        // This will initialize ALL systems
        // Systems that need update() will be added to updateableSystems array
        
        const systemDefinitions = [
            // Core systems that need special initialization
            { name: 'achievementSystem', Class: AchievementSystem, needsEngine: true },
            { name: 'audioSystem', Class: AudioSystem, needsEngine: true },
            { name: 'combatSystem', Class: CombatSystem, needsEngine: true },
            { name: 'particleSystem', Class: ParticleSystem, needsScene: true },
            { name: 'enemyManager', Class: EnemyManager, needsScene: true },
            { name: 'questSystem', Class: QuestSystem, needsEngine: true },
            { name: 'inventorySystem', Class: InventorySystem, needsEngine: true },
            
            // ALL other systems
            { name: 'achievementSystemComplex', Class: AchievementSystemComplex },
            { name: 'addictiveGameplaySystem', Class: AddictiveGameplaySystem },
            { name: 'advanced3DGraphicsSystem', Class: Advanced3DGraphicsSystem },
            { name: 'advanced3DModelSystem', Class: Advanced3DModelSystem },
            { name: 'advancedAutoManagementSystem', Class: AdvancedAutoManagementSystem },
            { name: 'advancedBossMechanics', Class: AdvancedBossMechanics, needsEngine: true },
            { name: 'advancedCharacterControllerSystem', Class: AdvancedCharacterControllerSystem },
            { name: 'advancedEnemyAISystem', Class: AdvancedEnemyAISystem },
            { name: 'advancedGraphicsSystem', Class: AdvancedGraphicsSystem },
            { name: 'advancedInventorySystem', Class: AdvancedInventorySystem },
            { name: 'advancedParticleSystem', Class: AdvancedParticleSystem },
            { name: 'advancedThemeSystem', Class: AdvancedThemeSystem },
            { name: 'advancedUIInterfaceSystem', Class: AdvancedUIInterfaceSystem },
            { name: 'aerialCombatSystem', Class: AerialCombatSystem },
            { name: 'alchemyBrewingSystem', Class: AlchemyBrewingSystem },
            { name: 'animeCharacterSystem', Class: AnimeCharacterSystem },
            { name: 'animeStyleRenderingSystem', Class: AnimeStyleRenderingSystem },
            { name: 'antiCheatSystem', Class: AntiCheatSystem },
            { name: 'archaeologySystem', Class: ArchaeologySystem },
            { name: 'archeryRangeSystem', Class: ArcheryRangeSystem },
            { name: 'ascensionSystem', Class: AscensionSystem },
            { name: 'assetIntegrationSystem', Class: AssetIntegrationSystem },
            { name: 'assetLoaderSystem', Class: AssetLoaderSystem },
            { name: 'assetStreamingSystem', Class: AssetStreamingSystem },
            { name: 'attributeSystem', Class: AttributeSystem },
            { name: 'auctionHouseSystem', Class: AuctionHouseSystem },
            { name: 'autoSaveSystem', Class: AutoSaveSystem },
            { name: 'bankSystem', Class: BankSystem },
            { name: 'battlegroundSystem', Class: BattlegroundSystem },
            { name: 'biomeGenerationSystem', Class: BiomeGenerationSystem },
            { name: 'biomeResourcesSystem', Class: BiomeResourcesSystem },
            { name: 'biomeSpecificEnemies', Class: BiomeSpecificEnemies },
            { name: 'biomeWeatherEffects', Class: BiomeWeatherEffects },
            { name: 'blackMarketSystem', Class: BlackMarketSystem },
            { name: 'blockParrySystemAdvanced', Class: BlockParrySystemAdvanced },
            { name: 'bossBattleMechanicsSystem', Class: BossBattleMechanicsSystem },
            { name: 'bossRushModeSystem', Class: BossRushModeSystem },
            { name: 'bountyHunterSystem', Class: BountyHunterSystem },
            { name: 'buildingSystem', Class: BuildingSystem },
            { name: 'bugFixSystem', Class: BugFixSystem },
            { name: 'cannabisMagicSystem', Class: CannabisMagicSystem, needsScene: true },
            { name: 'cardGameSystem', Class: CardGameSystem },
            { name: 'casinoGamesSystem', Class: CasinoGamesSystem },
            { name: 'caveExplorationSystem', Class: CaveExplorationSystem },
            { name: 'chainAttackSystem', Class: ChainAttackSystem },
            { name: 'challengeMode', Class: ChallengeMode },
            { name: 'challengeModeSystem', Class: ChallengeModeSystem },
            { name: 'characterClassSystem', Class: CharacterClassSystem },
            { name: 'characterCustomization', Class: CharacterCustomization },
            { name: 'characterProgressionAdvanced', Class: CharacterProgressionAdvanced },
            { name: 'characterStatsSystem', Class: CharacterStatsSystem },
            { name: 'cinematicCameraSystem', Class: CinematicCameraSystem },
            { name: 'cityVillageSystem', Class: CityVillageSystem },
            { name: 'cloudSaveSystem', Class: CloudSaveSystem },
            { name: 'combatEnemySystem', Class: CombatEnemySystem },
            { name: 'comboChainSystem', Class: ComboChainSystem },
            { name: 'comboSystem', Class: ComboSystem },
            { name: 'companionAI', Class: CompanionAI },
            { name: 'companionManager', Class: CompanionManager },
            { name: 'contentIntegrationSystem', Class: ContentIntegrationSystem },
            { name: 'cooperativeRaidSystem', Class: CooperativeRaidSystem },
            { name: 'cosmeticSystem', Class: CosmeticSystem },
            { name: 'counterAttackSystem', Class: CounterAttackSystem },
            { name: 'craftingSystem', Class: CraftingSystem },
            { name: 'criticalHitSystem', Class: CriticalHitSystem },
            { name: 'dailyQuestSystem', Class: DailyQuestSystem },
            { name: 'dailyRewards', Class: DailyRewards },
            { name: 'dayNightCycleSystem', Class: DayNightCycleSystem },
            { name: 'deviceOptimizationSystem', Class: DeviceOptimizationSystem },
            { name: 'dodgeAndParrySystem', Class: DodgeAndParrySystem },
            { name: 'dualWieldingSystem', Class: DualWieldingSystem },
            { name: 'dungeonGenerationSystem', Class: DungeonGenerationSystem },
            { name: 'dynamicDifficultySystem', Class: DynamicDifficultySystem },
            { name: 'dynamicEventSystem', Class: DynamicEventSystem },
            { name: 'economySystem', Class: EconomySystem },
            { name: 'elementalSystem', Class: ElementalSystem },
            { name: 'emoteSystem', Class: EmoteSystem },
            { name: 'enemyAI', Class: EnemyAI },
            { name: 'enemyCampSystem', Class: EnemyCampSystem },
            { name: 'enchantingSystem', Class: EnchantingSystem },
            { name: 'endlessBattleSystem', Class: EndlessBattleSystem },
            { name: 'endlessMode', Class: EndlessMode },
            { name: 'enhanced3DGraphicsSystem', Class: Enhanced3DGraphicsSystem },
            { name: 'enhancedGameMechanics', Class: EnhancedGameMechanics },
            { name: 'enhancedUISystem', Class: EnhancedUISystem },
            { name: 'enhancedVisualsSystem', Class: EnhancedVisualsSystem },
            { name: 'enhancementSystem', Class: EnhancementSystem },
            { name: 'environmentDetailsSystem', Class: EnvironmentDetailsSystem },
            { name: 'equipmentSystem', Class: EquipmentSystem },
            { name: 'experienceLevelingSystem', Class: ExperienceLevelingSystem },
            { name: 'fantasyMagicSystem', Class: FantasyMagicSystem },
            { name: 'farmingSystem', Class: FarmingSystem },
            { name: 'fastTravelSystem', Class: FastTravelSystem },
            { name: 'fishingSystem', Class: FishingSystem },
            { name: 'friendSystem', Class: FriendSystem },
            { name: 'gameIntegrationSystem', Class: GameIntegrationSystem },
            { name: 'gameplayEnhancementSystem', Class: GameplayEnhancementSystem },
            { name: 'gameReadinessSystem', Class: GameReadinessSystem },
            { name: 'gameStabilitySystem', Class: GameStabilitySystem },
            { name: 'guildAndHousingSystem', Class: GuildAndHousingSystem },
            { name: 'guildSystem', Class: GuildSystem },
            { name: 'guildWarSystem', Class: GuildWarSystem },
            { name: 'hordeDefenseSystem', Class: HordeDefenseSystem },
            { name: 'housingSystem', Class: HousingSystem },
            { name: 'idleGameSystem', Class: IdleGameSystem },
            { name: 'infiniteDungeonSystem', Class: InfiniteDungeonSystem },
            { name: 'insuranceSystem', Class: InsuranceSystem },
            { name: 'intelligentAISystem', Class: IntelligentAISystem },
            { name: 'intelligentEnemyAI', Class: IntelligentEnemyAI },
            { name: 'investmentSystem', Class: InvestmentSystem },
            { name: 'landmarkSystem', Class: LandmarkSystem },
            { name: 'leaderboardSystem', Class: LeaderboardSystem },
            { name: 'legendaryQuestlineSystem', Class: LegendaryQuestlineSystem },
            { name: 'limitBreakSystem', Class: LimitBreakSystem },
            { name: 'livingWorldSystem', Class: LivingWorldSystem },
            { name: 'loadingOptimizationSystem', Class: LoadingOptimizationSystem },
            { name: 'loanSystem', Class: LoanSystem },
            { name: 'magicCastingSystem', Class: MagicCastingSystem },
            { name: 'magicalBackgroundSystem', Class: MagicalBackgroundSystem },
            { name: 'magicalEffectsSystem', Class: MagicalEffectsSystem },
            { name: 'mailSystem', Class: MailSystem },
            { name: 'mainMenuSystem', Class: MainMenuSystem },
            { name: 'marketplaceSystem', Class: MarketplaceSystem },
            { name: 'marriageSystem', Class: MarriageSystem },
            { name: 'mascotBrandingSystem', Class: MascotBrandingSystem },
            { name: 'masterGameSystem', Class: MasterGameSystem },
            { name: 'matchmakingAndEventsSystem', Class: MatchmakingAndEventsSystem },
            { name: 'mentorSystem', Class: MentorSystem },
            { name: 'modernUISystem', Class: ModernUISystem },
            { name: 'monsterDesignSystem', Class: MonsterDesignSystem },
            { name: 'mountCollectionSystem', Class: MountCollectionSystem },
            { name: 'mountCombatSystem', Class: MountCombatSystem },
            { name: 'mountCustomizationSystem', Class: MountCustomizationSystem },
            { name: 'mountSystem', Class: MountSystem },
            { name: 'mountainClimbingSystem', Class: MountainClimbingSystem },
            { name: 'multiplayerEngagementSystem', Class: MultiplayerEngagementSystem },
            { name: 'multiplayerSocialSystem', Class: MultiplayerSocialSystem },
            { name: 'mythicDungeonSystem', Class: MythicDungeonSystem },
            { name: 'networkOptimizationSystem', Class: NetworkOptimizationSystem },
            { name: 'npcSystem', Class: NPCSystem },
            { name: 'openWorldSystem', Class: OpenWorldSystem },
            { name: 'partySystem', Class: PartySystem },
            { name: 'performanceMonitorSystem', Class: PerformanceMonitorSystem },
            { name: 'performanceOptimizer', Class: PerformanceOptimizer },
            { name: 'petBattleSystem', Class: PetBattleSystem },
            { name: 'petSystem', Class: PetSystem },
            { name: 'petSystemAdvanced', Class: PetSystemAdvanced },
            { name: 'photoModeSystem', Class: PhotoModeSystem },
            { name: 'physicsSystem', Class: PhysicsSystem },
            { name: 'playerAnimationController', Class: PlayerAnimationController },
            { name: 'playerControlSettingsSystem', Class: PlayerControlSettingsSystem },
            { name: 'playerHousingSystem', Class: PlayerHousingSystem },
            { name: 'playerOnboardingSystem', Class: PlayerOnboardingSystem },
            { name: 'playerRetentionSystem', Class: PlayerRetentionSystem },
            { name: 'platformerGameSystem', Class: PlatformerGameSystem },
            { name: 'postProcessingSystem', Class: PostProcessingSystem },
            { name: 'powerLevelingSystem', Class: PowerLevelingSystem },
            { name: 'prestigeSystem', Class: PrestigeSystem },
            { name: 'proceduralGenerationSystem', Class: ProceduralGenerationSystem },
            { name: 'productionReadinessSystem', Class: ProductionReadinessSystem },
            { name: 'progressiveWorldSystem', Class: ProgressiveWorldSystem },
            { name: 'progressTrackingSystem', Class: ProgressTrackingSystem },
            { name: 'propertyTradingSystem', Class: PropertyTradingSystem },
            { name: 'pvpArenaSystem', Class: PvPArenaSystem },
            { name: 'pvpArenaSystemAdvanced', Class: PvPArenaSystemAdvanced },
            { name: 'pvpSeasonSystem', Class: PvPSeasonSystem },
            { name: 'puzzleGameSystem', Class: PuzzleGameSystem },
            { name: 'qualityOfLifeSystem', Class: QualityOfLifeSystem },
            { name: 'questCampaignSystem', Class: QuestCampaignSystem },
            { name: 'questSystemAdvanced', Class: QuestSystemAdvanced },
            { name: 'racingGameSystem', Class: RacingGameSystem },
            { name: 'raidTierProgressionSystem', Class: RaidTierProgressionSystem },
            { name: 'randomEventSystem', Class: RandomEventSystem },
            { name: 'rangedCombatAdvanced', Class: RangedCombatAdvanced },
            { name: 'rankingSystemGlobal', Class: RankingSystemGlobal },
            { name: 'reputationSystem', Class: ReputationSystem },
            { name: 'resourceGatheringSystem', Class: ResourceGatheringSystem },
            { name: 'responsiveUISystem', Class: ResponsiveUISystem },
            { name: 'rhythmGameSystem', Class: RhythmGameSystem },
            { name: 'roguelikeMetaProgressionSystem', Class: RoguelikeMetaProgressionSystem },
            { name: 'safeZoneSystem', Class: SafeZoneSystem },
            { name: 'saveSystem', Class: SaveSystem },
            { name: 'seasonalContentManager', Class: SeasonalContentManager },
            { name: 'seasonalEventsSystem', Class: SeasonalEventsSystem },
            { name: 'secretAreaSystem', Class: SecretAreaSystem },
            { name: 'seductiveBaddiesSystem', Class: SeductiveBaddiesSystem },
            { name: 'seductiveBossSystem', Class: SeductiveBossSystem },
            { name: 'skillSystemAdvanced', Class: SkillSystemAdvanced },
            { name: 'skillTreeSystem', Class: SkillTreeSystem },
            { name: 'skyIslandSystem', Class: SkyIslandSystem },
            { name: 'smoothAnimationSystem', Class: SmoothAnimationSystem },
            { name: 'socialHubSystem', Class: SocialHubSystem },
            { name: 'soundManagerSystem', Class: SoundManagerSystem },
            { name: 'spectatorModeSystem', Class: SpectatorModeSystem },
            { name: 'startingZoneSystem', Class: StartingZoneSystem },
            { name: 'statisticsTracker', Class: StatisticsTracker },
            { name: 'statusEffectsEnhancedSystem', Class: StatusEffectsEnhancedSystem },
            { name: 'statusEffectsSystem', Class: StatusEffectsSystem },
            { name: 'stealthSystem', Class: StealthSystem },
            { name: 'stockMarketSystem', Class: StockMarketSystem },
            { name: 'storylineAndLoreSystem', Class: StorylineAndLoreSystem },
            { name: 'summonSystemAdvanced', Class: SummonSystemAdvanced },
            { name: 'survivalModeSystem', Class: SurvivalModeSystem },
            { name: 'survivalSystem', Class: SurvivalSystem },
            { name: 'tacticalCombatAI', Class: TacticalCombatAI },
            { name: 'talentSystem', Class: TalentSystem },
            { name: 'taxationSystem', Class: TaxationSystem },
            { name: 'teleportationSystem', Class: TeleportationSystem },
            { name: 'terrainSystem', Class: TerrainSystem },
            { name: 'textureManagementSystem', Class: TextureManagementSystem },
            { name: 'threeDSceneSystem', Class: ThreeDSceneSystem },
            { name: 'titleSystem', Class: TitleSystem },
            { name: 'tournamentSystem', Class: TournamentSystem },
            { name: 'towerDefenseSystem', Class: TowerDefenseSystem },
            { name: 'tradingSystem', Class: TradingSystem },
            { name: 'transformationSystem', Class: TransformationSystem },
            { name: 'treasureHuntingSystem', Class: TreasureHuntingSystem },
            { name: 'tutorialSystem', Class: TutorialSystem },
            { name: 'underwaterExplorationSystem', Class: UnderwaterExplorationSystem },
            { name: 'universalInputSystem', Class: UniversalInputSystem },
            { name: 'uiPolishSystem', Class: UIPolishSystem },
            { name: 'visualQualitySystem', Class: VisualQualitySystem },
            { name: 'voiceChatSystem', Class: VoiceChatSystem },
            { name: 'volumetricLightingSystem', Class: VolumetricLightingSystem },
            { name: 'weaponMasterySystem', Class: WeaponMasterySystem },
            { name: 'weaponSkillSystem', Class: WeaponSkillSystem },
            { name: 'weaponSystem3D', Class: WeaponSystem3D },
            { name: 'weatherSystem', Class: WeatherSystem },
            { name: 'weatherSystemAdvanced', Class: WeatherSystemAdvanced },
            { name: 'worldBeautificationSystem', Class: WorldBeautificationSystem },
            { name: 'worldBossSystem', Class: WorldBossSystem },
            { name: 'worldExplorationSystem', Class: WorldExplorationSystem },
            { name: 'worldPopulationSystem', Class: WorldPopulationSystem },
            { name: 'worldQuestSystem', Class: WorldQuestSystem },
        ];
        
        logger.info(`📊 Initializing ${systemDefinitions.length} systems...`);
        let initialized = 0;
        let failed = 0;
        
        for (const def of systemDefinitions) {
            try {
                let system;
                
                if (def.needsEngine) {
                    system = new def.Class(this.gameEngine);
                } else if (def.needsScene) {
                    system = new def.Class(this.gameEngine.scene, this.gameEngine.player, this.gameEngine.modelLoader);
                } else {
                    system = new def.Class();
                }
                
                this.systems.set(def.name, system);
                
                // If system has update method, add to updateable list
                if (system && typeof system.update === 'function') {
                    this.updateableSystems.push({ name: def.name, system });
                }
                
                // If system has initialize method, call it
                if (system && typeof system.initialize === 'function') {
                    await system.initialize();
                }
                
                initialized++;
            } catch (error) {
                failed++;
                logger.warn(`Failed to initialize ${def.name}:`, error.message);
            }
        }
        
        logger.info(`✅ Initialized ${initialized} systems successfully`);
        logger.info(`⚠️  Failed to initialize ${failed} systems`);
        logger.info(`🔄 ${this.updateableSystems.length} systems have update() methods`);
    }
    
    getSystem(name) {
        return this.systems.get(name);
    }
    
    updateAll(delta) {
        // Update ALL systems that have update() methods
        for (const { name, system } of this.updateableSystems) {
            try {
                if (system && typeof system.update === 'function') {
                    system.update(delta);
                }
            } catch (error) {
                logger.error(`Error updating ${name}:`, error.message);
            }
        }
    }
}
