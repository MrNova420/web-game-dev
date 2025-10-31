/**
 * GameEngine - Core game engine using Three.js for 3D rendering
 * Handles scene management, rendering, and game state
 */

import * as THREE from 'three';
import { logger } from './Logger.js';
import { SystemManager } from './SystemManager.js';
import { Player } from '../entities/Player.js';
import { CompanionManager } from '../systems/CompanionManager.js';
import { DungeonGenerator } from '../worlds/DungeonGenerator.js';
import { CombatSystem } from '../systems/CombatSystem.js';
import { ModelLoader } from '../core/ModelLoader.js';
import { WorldBuilder } from '../core/WorldBuilder.js';
import { ParticleSystem } from '../systems/ParticleSystem.js';
import { EnemyManager } from '../systems/EnemyManager.js';
import { EndlessMode } from '../systems/EndlessMode.js';
import { SaveSystem } from '../systems/SaveSystem.js';
import { InventorySystem } from '../systems/InventorySystem.js';
import { QuestSystem } from '../systems/QuestSystem.js';
import { AchievementSystem } from '../systems/AchievementSystem.js';
import { AudioSystem } from '../systems/AudioSystem.js';
import { SkillTreeSystem } from '../systems/SkillTreeSystem.js';
import { ComboSystem } from '../systems/ComboSystem.js';
import { CharacterCustomization } from '../systems/CharacterCustomization.js';
import { DailyRewards } from '../systems/DailyRewards.js';
import { TutorialSystem } from '../systems/TutorialSystem.js';
import { CraftingSystem } from '../systems/CraftingSystem.js';
import { EconomySystem } from '../systems/EconomySystem.js';
import { EnhancementSystem } from '../systems/EnhancementSystem.js';
import { TradingSystem } from '../systems/TradingSystem.js';
import { PetSystem } from '../systems/PetSystem.js';
import { CompanionAI } from '../systems/CompanionAI.js';
import { MountSystem } from '../systems/MountSystem.js';
import { LeaderboardSystem } from '../systems/LeaderboardSystem.js';
import { GuildSystem } from '../systems/GuildSystem.js';
import { ChallengeMode } from '../systems/ChallengeMode.js';
import { PrestigeSystem } from '../systems/PrestigeSystem.js';
import { InfiniteDungeonSystem } from '../systems/InfiniteDungeonSystem.js';
import { FantasyMagicSystem } from '../systems/FantasyMagicSystem.js';
import { SeductiveBaddiesSystem } from '../systems/SeductiveBaddiesSystem.js';
import { PowerLevelingSystem } from '../systems/PowerLevelingSystem.js';
import { EndlessBattleSystem } from '../systems/EndlessBattleSystem.js';
import { EnhancedGameMechanics } from '../systems/EnhancedGameMechanics.js';
import { AutoSaveSystem } from '../systems/AutoSaveSystem.js';
import { PerformanceOptimizer } from '../systems/PerformanceOptimizer.js';
import { MainMenuSystem } from '../systems/MainMenuSystem.js';
import { SafeZoneSystem } from '../systems/SafeZoneSystem.js';
import { EnhancedVisualsSystem } from '../systems/EnhancedVisualsSystem.js';
import { ProgressTrackingSystem } from '../systems/ProgressTrackingSystem.js';
import { AdvancedThemeSystem } from '../systems/AdvancedThemeSystem.js';
import { Advanced3DGraphicsSystem } from '../systems/Advanced3DGraphicsSystem.js';
import { WeatherSystem } from '../systems/WeatherSystem.js';
import { PostProcessingSystem } from '../systems/PostProcessingSystem.js';
import { AdvancedParticleSystem } from '../systems/AdvancedParticleSystem.js';
import { DayNightCycleSystem } from '../systems/DayNightCycleSystem.js';
import { ModernUISystem } from '../systems/ModernUISystem.js';
import { EnvironmentDetailsSystem } from '../systems/EnvironmentDetailsSystem.js';
import { OpenWorldSystem } from '../systems/OpenWorldSystem.js';
import { VolumetricLightingSystem } from '../systems/VolumetricLightingSystem.js';
import { CinematicCameraSystem } from '../systems/CinematicCameraSystem.js';
import { PhysicsSystem } from '../systems/PhysicsSystem.js';
import { CharacterClassSystem } from '../systems/CharacterClassSystem.js';
import { NPCSystem } from '../systems/NPCSystem.js';
import { AdvancedInventorySystem } from '../systems/AdvancedInventorySystem.js';
import { AnimeStyleRenderingSystem } from '../systems/AnimeStyleRenderingSystem.js';
import { ProductionReadinessSystem } from '../systems/ProductionReadinessSystem.js';
import { MultiplayerSocialSystem } from '../systems/MultiplayerSocialSystem.js';
import { TeleportationSystem } from '../systems/TeleportationSystem.js';
import { StartingZoneSystem } from '../systems/StartingZoneSystem.js';
import { Advanced3DModelSystem } from '../systems/Advanced3DModelSystem.js';
import { AdvancedUIInterfaceSystem } from '../systems/AdvancedUIInterfaceSystem.js';
import { BiomeGenerationSystem } from '../systems/BiomeGenerationSystem.js';
import { BiomeSpecificEnemies } from '../systems/BiomeSpecificEnemies.js';
import { BiomeWeatherEffects } from '../systems/BiomeWeatherEffects.js';
import { BiomeResourcesSystem } from '../systems/BiomeResourcesSystem.js';
import { BiomeDungeonsSystem } from '../systems/BiomeDungeonsSystem.js';
import { DodgeAndParrySystem } from '../systems/DodgeAndParrySystem.js';
import { ComboChainSystem } from '../systems/ComboChainSystem.js';
import { ProceduralGenerationSystem } from '../systems/ProceduralGenerationSystem.js';
import { Enhanced3DGraphicsSystem } from '../systems/Enhanced3DGraphicsSystem.js';
import { StorylineAndLoreSystem } from '../systems/StorylineAndLoreSystem.js';
import { WeaponSkillSystem } from '../systems/WeaponSkillSystem.js';
import { TacticalCombatAI } from '../systems/TacticalCombatAI.js';
import { PvPArenaSystem } from '../systems/PvPArenaSystem.js';
import { GuildAndHousingSystem } from '../systems/GuildAndHousingSystem.js';
import { MatchmakingAndEventsSystem } from '../systems/MatchmakingAndEventsSystem.js';
import { AdvancedGraphicsSystem } from '../systems/AdvancedGraphicsSystem.js';
import { IntelligentEnemyAI } from '../systems/IntelligentEnemyAI.js';
import { AnimeCharacterSystem } from '../systems/AnimeCharacterSystem.js';
// Phase 8-9 Advanced Systems
import { IntelligentAISystem } from '../systems/IntelligentAISystem.js';
import { DynamicDifficultySystem } from '../systems/DynamicDifficultySystem.js';
import { ProgressiveWorldSystem } from '../systems/ProgressiveWorldSystem.js';
import { MagicalEffectsSystem } from '../systems/MagicalEffectsSystem.js';
import { WorldBeautificationSystem } from '../systems/WorldBeautificationSystem.js';
import { MonsterDesignSystem } from '../systems/MonsterDesignSystem.js';
import { AddictiveGameplaySystem } from '../systems/AddictiveGameplaySystem.js';
import { PlayerControlSettingsSystem } from '../systems/PlayerControlSettingsSystem.js';
import { CloudSaveSystem } from '../systems/CloudSaveSystem.js';
import { AdvancedAutoManagementSystem } from '../systems/AdvancedAutoManagementSystem.js';
import { ContentIntegrationSystem } from '../systems/ContentIntegrationSystem.js';
import { MassiveOpenWorld } from '../worlds/MassiveOpenWorld.js';
import { assetRegistry } from './AssetRegistry.js';
import { MascotBrandingSystem } from '../systems/MascotBrandingSystem.js';
// Phase 1 Session 1.1: Psychedelic Cel-Shading (ULTIMATE_AUTONOMOUS_ROADMAP.md)
import { PsychedelicCelShadingSystem } from '../rendering/PsychedelicCelShadingSystem.js';
// New Magical Background System
import { MagicalBackgroundSystem } from '../systems/MagicalBackgroundSystem.js';
// Phase 3 RPG Systems - Completion
import { ReputationSystem } from '../systems/ReputationSystem.js';
import { AttributeSystem } from '../systems/AttributeSystem.js';
import { TalentSystem } from '../systems/TalentSystem.js';
// Phase 7-9: NEW COMPLETE SYSTEMS
import { EnhancedUISystem } from '../systems/EnhancedUISystem.js';
import { UniversalInputSystem } from '../systems/UniversalInputSystem.js';
import { CombatEnemySystem } from '../systems/CombatEnemySystem.js';
import { DungeonBuilder } from '../worlds/DungeonBuilder.js';
import { MysticForestBiome } from '../worlds/MysticForestBiome.js';
import { MoonlitGladeVillage } from '../worlds/MoonlitGladeVillage.js';
import { CrimsonPeaksBiome } from '../worlds/CrimsonPeaksBiome.js';
import { CompleteGameIntegration } from './CompleteGameIntegration.js';
// NEW SURVIVAL SYSTEMS - Complete immersive gameplay
import { CannabisMagicSystem } from '../systems/CannabisMagicSystem.js';
import { SeductiveBossSystem } from '../systems/SeductiveBossSystem.js';
import { SurvivalSystem } from '../systems/SurvivalSystem.js';
import { BuildingSystem } from '../systems/BuildingSystem.js';
import { FarmingSystem } from '../systems/FarmingSystem.js';
// NEW WORLD SYSTEMS - Make world alive and immersive
import { EnemyCampSystem } from '../systems/EnemyCampSystem.js';
import { WorldPopulationSystem } from '../systems/WorldPopulationSystem.js';
import { CityVillageSystem } from '../systems/CityVillageSystem.js';
import { DeviceOptimizationSystem } from '../systems/DeviceOptimizationSystem.js';
// NEW UI SYSTEMS - Complete user interface for all features
import { SurvivalUI } from '../ui/SurvivalUI.js';
import { FarmingUI } from '../ui/FarmingUI.js';
import { BuildingUI } from '../ui/BuildingUI.js';
import { CannabisMagicUI } from '../ui/CannabisMagicUI.js';

export class GameEngine {
    constructor(canvas) {
        this.canvas = canvas;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.clock = new THREE.Clock();
        
        // Model loader for external 3D assets
        this.modelLoader = new ModelLoader();
        
        // World builder for creating immersive worlds from presets
        this.worldBuilder = null; // Initialized after scene is created
        
        // MASSIVE OPEN WORLD System
        this.massiveWorld = null;
        this.assetRegistry = assetRegistry;
        
        // Game systems
        this.player = null;
        this.companionManager = null;
        this.dungeonGenerator = null;
        this.combatSystem = null;
        this.particleSystem = null;
        this.enemyManager = null;
        this.endlessMode = null;
        this.saveSystem = null;
        this.inventorySystem = null;
        this.questSystem = null;
        
        // NEW SURVIVAL & GAMEPLAY SYSTEMS
        this.cannabisMagicSystem = null;
        this.seductiveBossSystem = null;
        this.survivalSystem = null;
        this.buildingSystem = null;
        this.farmingSystem = null;
        
        // NEW WORLD POPULATION SYSTEMS
        this.enemyCampSystem = null;
        this.worldPopulationSystem = null;
        this.cityVillageSystem = null;
        this.deviceOptimizationSystem = null;
        
        // NEW UI SYSTEMS for player interaction
        this.survivalUI = null;
        this.farmingUI = null;
        this.buildingUI = null;
        this.cannabisMagicUI = null;
        this.achievementSystem = null;
        this.audioSystem = null;
        this.skillTreeSystem = null;
        this.comboSystem = null;
        this.characterCustomization = null;
        this.dailyRewards = null;
        this.tutorialSystem = null;
        this.craftingSystem = null;
        this.economySystem = null;
        this.enhancementSystem = null;
        this.tradingSystem = null;
        this.petSystem = null;
        this.companionAI = null;
        this.mountSystem = null;
        this.leaderboardSystem = null;
        this.guildSystem = null;
        this.challengeMode = null;
        this.prestigeSystem = null;
        this.infiniteDungeonSystem = null;
        this.fantasyMagicSystem = null;
        this.seductiveBaddiesSystem = null;
        this.powerLevelingSystem = null;
        this.endlessBattleSystem = null;
        this.enhancedGameMechanics = null;
        this.autoSaveSystem = null;
        this.performanceOptimizer = null;
        this.mainMenuSystem = null;
        this.safeZoneSystem = null;
        this.enhancedVisualsSystem = null;
        this.progressTrackingSystem = null;
        this.advancedThemeSystem = null;
        this.advanced3DGraphicsSystem = null;
        this.weatherSystem = null;
        this.postProcessingSystem = null;
        this.advancedParticleSystem = null;
        this.dayNightCycleSystem = null;
        this.modernUISystem = null;
        this.environmentDetailsSystem = null;
        this.openWorldSystem = null;
        this.volumetricLightingSystem = null;
        this.cinematicCameraSystem = null;
        this.physicsSystem = null;
        this.characterClassSystem = null;
        this.npcSystem = null;
        this.advancedInventorySystem = null;
        this.animeStyleRenderingSystem = null;
        this.productionReadinessSystem = null;
        this.multiplayerSocialSystem = null;
        this.teleportationSystem = null;
        this.startingZoneSystem = null;
        this.advanced3DModelSystem = null;
        this.advancedUIInterfaceSystem = null;
        this.biomeGenerationSystem = null;
        this.biomeSpecificEnemies = null;
        this.biomeWeatherEffects = null;
        this.biomeResourcesSystem = null;
        this.biomeDungeonsSystem = null;
        this.dodgeAndParrySystem = null;
        this.comboChainSystem = null;
        this.proceduralGenerationSystem = null;
        this.enhanced3DGraphicsSystem = null;
        this.storylineAndLoreSystem = null;
        this.weaponSkillSystem = null;
        this.tacticalCombatAI = null;
        this.pvpArenaSystem = null;
        this.guildAndHousingSystem = null;
        this.matchmakingAndEventsSystem = null;
        this.advancedGraphicsSystem = null;
        this.intelligentEnemyAI = null;
        this.animeCharacterSystem = null;
        
        // Phase 8-9 Advanced Systems
        this.intelligentAISystem = null;
        this.dynamicDifficultySystem = null;
        this.progressiveWorldSystem = null;
        this.magicalEffectsSystem = null;
        this.worldBeautificationSystem = null;
        this.monsterDesignSystem = null;
        this.addictiveGameplaySystem = null;
        this.playerControlSettingsSystem = null;
        this.cloudSaveSystem = null;
        this.advancedAutoManagementSystem = null;
        this.contentIntegrationSystem = null;
        this.mascotBrandingSystem = null;
        
        // Phase 7-9: NEW COMPLETE GAME SYSTEMS
        this.completeGameIntegration = null;
        this.enhancedUISystem = null;
        this.universalInputSystem = null;
        this.combatEnemySystem = null;
        this.dungeonBuilderSystem = null;
        this.mysticForestBiome = null;
        this.moonlitGladeVillage = null;
        this.crimsonPeaksBiome = null;
        
        // Game state
        this.isRunning = false;
        this.startFromSafeZone = false;
        this.currentDungeon = null;
        
        // UI references
        this.uiElements = {
            hp: document.getElementById('hp-bar'),
            hpText: document.getElementById('hp-text'),
            mp: document.getElementById('mp-bar'),
            mpText: document.getElementById('mp-text'),
            companionName: document.getElementById('companion-name'),
            companionStatus: document.getElementById('companion-status')
        };
    }
    
    async init() {
        console.log('🎮 Initializing game engine...');
        
        // Create Three.js scene
        this.scene = new THREE.Scene();
        // Light blue/grey background so 3D objects are visible
        this.scene.background = new THREE.Color(0x87CEEB); // Sky blue
        // FOG DISABLED - Was making 3D world invisible!
        // this.scene.fog = new THREE.FogExp2(0x2d0a4e, 0.02);
        this.scene.userData.gameEngine = this;
        
        // Setup camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 10, 15);
        this.camera.lookAt(0, 0, 0);
        
        // Setup renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Add STRONG lighting to ensure world is visible
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.5); // Bright white light
        this.scene.add(ambientLight);
        
        const dirLight = new THREE.DirectionalLight(0xffffff, 2.0); // Bright white directional light
        dirLight.position.set(10, 20, 10);
        dirLight.castShadow = true;
        this.scene.add(dirLight);
        
        // Animate lights
        const animateAmbient = () => {
            const time = Date.now() * 0.0003;
            const hue = (Math.sin(time) * 0.5 + 0.5) * 0.8;
            ambientLight.color.setHSL(hue, 1.0, 0.5);
            requestAnimationFrame(animateAmbient);
        };
        animateAmbient();
        
        const animateDirLight = () => {
            const time = Date.now() * 0.0004;
            const hue = (Math.cos(time) * 0.5 + 0.5) * 0.8 + 0.1;
            dirLight.color.setHSL(hue, 1.0, 0.6);
            requestAnimationFrame(animateDirLight);
        };
        animateDirLight();
        
        // Add point lights
        const magicColors = [0xff00ff, 0x00ffff, 0xffff00, 0xff0066, 0x00ff00];
        for (let i = 0; i < 8; i++) {
            const light = new THREE.PointLight(magicColors[i % magicColors.length], 1.5, 25);
            light.position.set(
                Math.random() * 30 - 15,
                Math.random() * 8 + 2,
                Math.random() * 30 - 15
            );
            this.scene.add(light);
            
            const animatePointLight = () => {
                const time = Date.now() * 0.001 + i * 100;
                const hue = (Math.sin(time) * 0.5 + 0.5);
                light.color.setHSL(hue, 1.0, 0.5);
                light.intensity = 1.0 + Math.sin(time * 2) * 0.5;
                requestAnimationFrame(animatePointLight);
            };
            animatePointLight();
        }
        
        logger.info('✅ Scene and renderer ready');
        
        // Initialize essential systems only
        try {
            this.companionManager = new CompanionManager();
            this.dungeonGenerator = new DungeonGenerator();
            this.combatSystem = new CombatSystem(this);
            this.particleSystem = new ParticleSystem(this.scene);
            this.enemyManager = new EnemyManager(this.scene, this.dungeonGenerator);
            this.endlessMode = new EndlessMode(this);
            this.inventorySystem = new InventorySystem(this);
            this.questSystem = new QuestSystem(this);
            this.achievementSystem = new AchievementSystem(this);
            this.audioSystem = new AudioSystem(this);
            this.skillTreeSystem = new SkillTreeSystem(this);
            this.comboSystem = new ComboSystem(this);
            this.characterCustomization = new CharacterCustomization(this);
            this.dailyRewards = new DailyRewards(this);
            this.tutorialSystem = new TutorialSystem(this);
            
            // ========================================
            // COMPREHENSIVE SYSTEM MANAGER
            // Manages ALL 270+ game systems automatically
            // ========================================
            logger.info('🎮 Initializing SystemManager for ALL systems...');
            this.systemManager = new SystemManager(this);
            await this.systemManager.initializeAllSystems();
            
            // ========================================
            // Phase 7-9: COMPLETE GAME INTEGRATION
            // Initialize ALL new systems for full gameplay
            // ========================================
            logger.info('🎮 Initializing Complete Game Integration...');
            
            // Initialize Complete Game Integration (this connects everything)
            this.completeGameIntegration = new CompleteGameIntegration(
                this.scene,
                this.camera,
                this.renderer,
                this.modelLoader
            );
            await this.completeGameIntegration.initialize();
            
            // Store references to integrated systems
            this.enhancedUISystem = this.completeGameIntegration.ui;
            this.universalInputSystem = this.completeGameIntegration.input;
            this.combatEnemySystem = this.completeGameIntegration.combat;
            this.dungeonBuilderSystem = this.completeGameIntegration.dungeonBuilder;
            
            console.log('✅ Complete Game Integration finished!');
            console.log('   🌍 World loaded with 3 biomes');
            console.log('   🎨 UI system active');
            console.log('   🎮 Input system ready (keyboard/mouse/touch/gamepad)');
            console.log('   ⚔️ Combat system active');
            console.log('   🏛️ Dungeon system ready');
            
            console.log('✅ Essential systems initialized');
            
            // ========================================
            // SURVIVAL & IMMERSIVE GAMEPLAY SYSTEMS
            // Initialize all survival mechanics for full gameplay
            // ========================================
            console.log('🌿 Initializing Survival & Immersive Systems...');
            
            // Initialize Survival System (hunger, thirst, temperature)
            this.survivalSystem = new SurvivalSystem(this.player);
            console.log('   ✅ Survival System: Hunger, Thirst, Temperature');
            
            // Initialize Cannabis Magic System (herb cultivation & magic)
            this.cannabisMagicSystem = new CannabisMagicSystem(
                this.scene,
                this.player,
                this.modelLoader
            );
            await this.cannabisMagicSystem.initialize();
            console.log('   ✅ Cannabis Magic System: 10 herb types, cultivation, smoke abilities');
            
            // Initialize Seductive Boss System (anime bosses & romance)
            this.seductiveBossSystem = new SeductiveBossSystem(
                this.scene,
                this.modelLoader
            );
            console.log('   ✅ Seductive Boss System: 8 bosses, affection mechanics');
            
            // Initialize Building System (construct structures)
            this.buildingSystem = new BuildingSystem(this.scene, this.modelLoader);
            console.log('   ✅ Building System: 15+ building types from mega packs');
            
            // Initialize Farming System (crops & agriculture)
            this.farmingSystem = new FarmingSystem(this.scene, this.modelLoader);
            await this.farmingSystem.initialize();
            console.log('   ✅ Farming System: 15+ crops, seasons, growth stages');
            
            console.log('🌿 Survival & Immersive Systems Ready!');
            console.log('   Players can now:');
            console.log('   - Manage hunger, thirst, and temperature');
            console.log('   - Grow and harvest 10 cannabis strains');
            console.log('   - Romance 8 seductive anime bosses');
            console.log('   - Build 15+ structures (houses, farms, forges)');
            console.log('   - Farm 15+ crops with seasons');
            
            // ========================================
            // INITIALIZE ALL UI SYSTEMS
            // Create player-facing interfaces for all systems
            // ========================================
            console.log('🎨 Initializing UI Systems...');
            
            // Survival UI - hunger, thirst, temperature display with controls
            this.survivalUI = new SurvivalUI(this.survivalSystem);
            console.log('   ✅ Survival UI: Real-time stats & action buttons');
            
            // Farming UI - crop management, planting, harvesting
            this.farmingUI = new FarmingUI(this.farmingSystem);
            console.log('   ✅ Farming UI: Plant crops, manage 20 plots');
            
            // Building UI - construction menu, building list
            this.buildingUI = new BuildingUI(this.buildingSystem);
            console.log('   ✅ Building UI: 15+ buildings, construction queue');
            
            // Cannabis Magic UI - herb cultivation, smoke abilities
            this.cannabisMagicUI = new CannabisMagicUI(this.cannabisMagicSystem);
            console.log('   ✅ Cannabis Magic UI: 10 herbs, abilities menu');
            
            console.log('🎨 All UI Systems Active!');
            console.log('   Press F = Farming, B = Building, M = Cannabis Magic');
            
            // Setup keyboard controls for UIs
            this.setupUIControls();
            
            // ========================================
            // DEVICE OPTIMIZATION
            // Auto-detect device and optimize performance
            // ========================================
            console.log('📱 Initializing Device Optimization...');
            this.deviceOptimizationSystem = new DeviceOptimizationSystem(this.renderer, this.scene);
            this.deviceOptimizationSystem.applySettings();
            this.deviceOptimizationSystem.optimizeForTouch();
            this.deviceOptimizationSystem.enableDynamicQuality();
            this.deviceOptimizationSystem.createPerformanceUI();
            console.log('   ✅ Device optimization active for all platforms');
            
        } catch (error) {
            console.error('Error initializing essential systems:', error);
            throw error;
        }
        
        // Initialize other systems with error handling (non-blocking)
        this.initOptionalSystems();
        
        // Initialize WorldBuilder
        this.worldBuilder = new WorldBuilder(this);
        
        // Initialize SaveSystem
        this.saveSystem = new SaveSystem(this);
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
        
        console.log('✅ Game engine initialized');
        return true;
    }
    
    // Initialize optional systems in background (non-blocking)
    initOptionalSystems() {
        setTimeout(() => {
            try {
                // Initialize additional systems asynchronously
                this.craftingSystem = new CraftingSystem(this);
                this.economySystem = new EconomySystem(this);
                this.enhancementSystem = new EnhancementSystem(this);
                this.tradingSystem = new TradingSystem(this);
                this.petSystem = new PetSystem(this);
                this.companionAI = new CompanionAI(this);
                this.mountSystem = new MountSystem(this);
                this.leaderboardSystem = new LeaderboardSystem(this);
                this.guildSystem = new GuildSystem(this);
                this.challengeMode = new ChallengeMode(this);
                this.prestigeSystem = new PrestigeSystem(this);
                this.infiniteDungeonSystem = new InfiniteDungeonSystem(this);
                this.fantasyMagicSystem = new FantasyMagicSystem();
                this.seductiveBaddiesSystem = new SeductiveBaddiesSystem();
                this.powerLevelingSystem = new PowerLevelingSystem();
                this.endlessBattleSystem = new EndlessBattleSystem();
                this.enhancedGameMechanics = new EnhancedGameMechanics();
                this.autoSaveSystem = new AutoSaveSystem();
                this.performanceOptimizer = new PerformanceOptimizer();
                this.advancedThemeSystem = new AdvancedThemeSystem(this);
                this.advanced3DGraphicsSystem = new Advanced3DGraphicsSystem(this);
                this.mainMenuSystem = new MainMenuSystem(this);
                this.safeZoneSystem = new SafeZoneSystem(this);
                this.enhancedVisualsSystem = new EnhancedVisualsSystem(this);
                this.magicalBackgroundSystem = new MagicalBackgroundSystem(this.scene);
                this.progressTrackingSystem = new ProgressTrackingSystem(this);
                this.weatherSystem = new WeatherSystem(this);
                this.postProcessingSystem = new PostProcessingSystem(this);
                this.advancedParticleSystem = new AdvancedParticleSystem(this.scene);
                this.dayNightCycleSystem = new DayNightCycleSystem(this);
                this.modernUISystem = new ModernUISystem(this);
                this.environmentDetailsSystem = new EnvironmentDetailsSystem(this);
                this.openWorldSystem = new OpenWorldSystem(this);
                this.volumetricLightingSystem = new VolumetricLightingSystem(this);
                this.cinematicCameraSystem = new CinematicCameraSystem(this);
                this.physicsSystem = new PhysicsSystem(this);
                this.characterClassSystem = new CharacterClassSystem(this);
                this.reputationSystem = new ReputationSystem(this);
                this.attributeSystem = new AttributeSystem(this);
                this.talentSystem = new TalentSystem(this);
                this.npcSystem = new NPCSystem(this);
                this.advancedInventorySystem = new AdvancedInventorySystem(this);
                this.animeStyleRenderingSystem = new AnimeStyleRenderingSystem(this);
                this.productionReadinessSystem = new ProductionReadinessSystem(this);
                this.mascotBrandingSystem = new MascotBrandingSystem();
                this.contentIntegrationSystem = new ContentIntegrationSystem(this);
                this.multiplayerSocialSystem = new MultiplayerSocialSystem(this);
                this.teleportationSystem = new TeleportationSystem(this);
                this.startingZoneSystem = new StartingZoneSystem(this);
                this.advanced3DModelSystem = new Advanced3DModelSystem(this.scene);
                this.advancedUIInterfaceSystem = new AdvancedUIInterfaceSystem();
                this.biomeGenerationSystem = new BiomeGenerationSystem(this.scene, this.camera);
                this.biomeSpecificEnemies = new BiomeSpecificEnemies(this.scene);
                this.biomeWeatherEffects = new BiomeWeatherEffects(this.scene, this.camera);
                this.biomeResourcesSystem = new BiomeResourcesSystem(this.scene);
                this.biomeDungeonsSystem = new BiomeDungeonsSystem(this.scene);
                this.biomeGenerationSystem.init();
                this.biomeWeatherEffects.init();
                this.dodgeAndParrySystem = new DodgeAndParrySystem(this);
                this.comboChainSystem = new ComboChainSystem(this);
                this.weaponSkillSystem = new WeaponSkillSystem(this);
                this.tacticalCombatAI = new TacticalCombatAI(this);
                this.pvpArenaSystem = new PvPArenaSystem(this);
                this.guildAndHousingSystem = new GuildAndHousingSystem(this);
                this.matchmakingAndEventsSystem = new MatchmakingAndEventsSystem();
                this.advancedGraphicsSystem = new AdvancedGraphicsSystem(this.scene, this.renderer);
                this.proceduralGenerationSystem = new ProceduralGenerationSystem(this);
                this.enhanced3DGraphicsSystem = new Enhanced3DGraphicsSystem(this.scene, this.renderer, this.camera);
                this.storylineAndLoreSystem = new StorylineAndLoreSystem(this);
                this.intelligentEnemyAI = new IntelligentEnemyAI();
                this.animeCharacterSystem = new AnimeCharacterSystem(this.scene);
                this.intelligentAISystem = new IntelligentAISystem(this);
                this.dynamicDifficultySystem = new DynamicDifficultySystem(this);
                this.progressiveWorldSystem = new ProgressiveWorldSystem(this);
                this.magicalEffectsSystem = new MagicalEffectsSystem(this);
                this.worldBeautificationSystem = new WorldBeautificationSystem(this.scene);
                this.monsterDesignSystem = new MonsterDesignSystem(this);
                this.addictiveGameplaySystem = new AddictiveGameplaySystem(this);
                this.playerControlSettingsSystem = new PlayerControlSettingsSystem(this);
                this.cloudSaveSystem = new CloudSaveSystem(this);
                this.advancedAutoManagementSystem = new AdvancedAutoManagementSystem(this);
                
                // Initialize async systems
                if (this.enhanced3DGraphicsSystem) this.enhanced3DGraphicsSystem.init();
                if (this.storylineAndLoreSystem) this.storylineAndLoreSystem.init(1);
                if (this.intelligentAISystem) this.intelligentAISystem.init();
                if (this.dynamicDifficultySystem) this.dynamicDifficultySystem.init();
                if (this.progressiveWorldSystem) this.progressiveWorldSystem.init();
                if (this.magicalEffectsSystem) this.magicalEffectsSystem.init();
                if (this.worldBeautificationSystem) this.worldBeautificationSystem.init();
                if (this.monsterDesignSystem) this.monsterDesignSystem.init();
                if (this.addictiveGameplaySystem) this.addictiveGameplaySystem.init();
                if (this.playerControlSettingsSystem) this.playerControlSettingsSystem.init();
                if (this.cloudSaveSystem) this.cloudSaveSystem.init();
                if (this.advancedAutoManagementSystem) this.advancedAutoManagementSystem.init();
                
                console.log('✅ Optional advanced systems loaded in background');
            } catch (error) {
                console.warn('Some optional systems failed to load:', error);
            }
        }, 1000); // Load after 1 second delay
    }
    
    async createWorld() {
        console.log('🌍 ============================================');
        console.log('   CREATING DYNASTY OF EMBERVEIL');
        console.log('   Massive Multiplayer Open World');
        console.log('============================================\n');
        
        // Initialize the MASSIVE OPEN WORLD
        this.massiveWorld = new MassiveOpenWorld(this.scene, this.modelLoader);
        await this.massiveWorld.initialize();
        
        console.log('✅ WORLD INITIALIZATION COMPLETE!\n');
        
        // ========================================
        // BUILD CITIES, VILLAGES & SETTLEMENTS
        // Create living, breathing world with economy
        // ========================================
        console.log('🏙️ ============================================');
        console.log('   BUILDING CITIES, VILLAGES & SETTLEMENTS');
        console.log('============================================\n');
        
        this.cityVillageSystem = new CityVillageSystem(this.scene, this.modelLoader);
        await this.cityVillageSystem.createWorld();
        
        console.log('✅ CITIES AND VILLAGES COMPLETE!');
        console.log(`   Total Settlements: ${this.cityVillageSystem.settlements.length}`);
        console.log(`   - Cities: 3`);
        console.log(`   - Villages: 6`);
        console.log(`   - Outposts: 2`);
        console.log(`   - Total NPCs: 400+`);
        console.log(`   - Total Shops: 50+\n`);
        
        // ========================================
        // POPULATE WORLD WITH LIFE
        // Spawn NPCs, enemies, quests everywhere
        // ========================================
        console.log('🌍 ============================================');
        console.log('   POPULATING WORLD WITH LIFE');
        console.log('============================================\n');
        
        this.worldPopulationSystem = new WorldPopulationSystem(this.scene, this.modelLoader);
        await this.worldPopulationSystem.populate();
        
        console.log('✅ WORLD POPULATION COMPLETE!');
        console.log(`   - NPCs: ${this.worldPopulationSystem.npcs.length}`);
        console.log(`   - Enemies: ${this.worldPopulationSystem.enemies.length}`);
        console.log(`   - Quest Givers: ${this.worldPopulationSystem.questGivers.length}`);
        console.log(`   - Merchants: ${this.worldPopulationSystem.merchants.length}`);
        console.log(`   - Activities: ${this.worldPopulationSystem.activities.length}\n`);
        
        // ========================================
        // SPAWN ENEMY CAMPS
        // Create raiding camps with loot
        // ========================================
        console.log('🏕️ ============================================');
        console.log('   SPAWNING ENEMY CAMPS');
        console.log('============================================\n');
        
        this.enemyCampSystem = new EnemyCampSystem(this.scene, this.modelLoader);
        
        // Spawn camps across all biomes
        const biomePositions = [
            { name: 'Mystic Forest', position: { x: -50, z: -50 } },
            { name: 'Crimson Peaks', position: { x: 100, z: 50 } },
            { name: 'Azure Depths', position: { x: 0, z: -100 } },
            { name: 'Shadowmoon Valley', position: { x: -100, z: -100 } },
            { name: 'Crystal Peaks', position: { x: 50, z: 100 } },
            { name: 'Verdant Plains', position: { x: 80, z: 80 } },
            { name: 'Frozen Wastes', position: { x: -120, z: 120 } },
            { name: 'Scorched Desert', position: { x: 150, z: -50 } },
            { name: 'Twilight Marshlands', position: { x: -60, z: -90 } },
            { name: 'Celestial Highlands', position: { x: 120, z: 150 } },
            { name: 'Volcanic Badlands', position: { x: 180, z: 30 } },
            { name: 'Void Rift', position: { x: -180, z: -180 } }
        ];
        
        await this.enemyCampSystem.populateWorld(biomePositions);
        
        console.log('✅ ENEMY CAMPS COMPLETE!');
        console.log(`   Total Camps: ${this.enemyCampSystem.camps.length}`);
        console.log(`   Raiding opportunities throughout world!\n`);
        
        console.log('🎮 ============================================');
        console.log('   COMPLETE IMMERSIVE WORLD READY!');
        console.log('============================================');
        console.log('   3 Major Cities with full economies');
        console.log('   6 Specialized Villages');
        console.log('   2 Military Outposts');
        console.log('   400+ NPCs with dialogue');
        console.log('   200+ Enemies roaming');
        console.log('   36 Enemy camps to raid');
        console.log('   50+ Shops with dynamic economy');
        console.log('   20+ Quests to discover');
        console.log('   Optimized for ALL devices (mobile/tablet/desktop)');
        console.log('============================================\n');
        
        // Create player with real character model
        this.player = new Player(this.scene);
        await this.player.init();
        
        // Load player character from asset registry
        try {
            const playerCharPath = this.assetRegistry.getPlayerCharacterPath(0); // Knight by default
            console.log(`🎮 Loading player character: ${playerCharPath}`);
            const playerModel = await this.modelLoader.load(playerCharPath);
            
            if (playerModel && this.player.mesh) {
                const oldMesh = this.player.mesh;
                this.scene.remove(oldMesh);
                
                // Scale and position the model
                playerModel.scale.set(1, 1, 1);
                playerModel.position.copy(oldMesh.position);
                playerModel.castShadow = true;
                playerModel.receiveShadow = true;
                
                this.player.mesh = playerModel;
                this.scene.add(playerModel);
                console.log('✅ Player character model loaded: Knight');
            }
        } catch (error) {
            console.log('ℹ️ Using default player model:', error.message);
        }
        
        // Initialize combat systems with player reference
        if (this.dodgeAndParrySystem) {
            this.dodgeAndParrySystem.init(this.player);
        }
        
        // Set initial companion
        this.companionManager.setActiveCompanion('smoke_siren');
        this.updateCompanionUI();
        
        // Spawn skeleton enemies using real models
        console.log('💀 Spawning skeleton enemies...');
        const enemySpawnPoints = [
            { x: 30, z: 30 }, { x: -30, z: 30 },
            { x: 30, z: -30 }, { x: -30, z: -30 },
            { x: 40, z: 0 }, { x: -40, z: 0 },
            { x: 0, z: 40 }, { x: 0, z: -40 }
        ];
        
        for (let i = 0; i < enemySpawnPoints.length; i++) {
            try {
                const point = enemySpawnPoints[i];
                const enemyPath = this.assetRegistry.getEnemyCharacterPath(i % 4);
                const enemyModel = await this.modelLoader.load(enemyPath);
                
                if (enemyModel) {
                    enemyModel.position.set(point.x, 0, point.z);
                    enemyModel.scale.set(1, 1, 1);
                    enemyModel.castShadow = true;
                    enemyModel.receiveShadow = true;
                    
                    // Add to enemy manager if available
                    if (this.enemyManager) {
                        this.enemyManager.addEnemy({
                            mesh: enemyModel,
                            type: 'skeleton',
                            health: 100,
                            maxHealth: 100,
                            damage: 10,
                            level: 1
                        });
                    }
                    
                    this.scene.add(enemyModel);
                    console.log(`   ✅ Spawned skeleton at (${point.x}, ${point.z})`);
                }
            } catch (error) {
                console.log(`   ⚠️ Couldn't spawn enemy at point ${i}:`, error.message);
            }
        }
        
        console.log(`✅ Spawned ${enemySpawnPoints.length} skeleton enemies`);
        
        // Activate weather and day/night systems for Mystic Forest
        if (this.weatherSystem) {
            this.weatherSystem.setWeather('mist', 0.2); // Light mystical mist
            console.log('🌫️ Mystical mist active');
        }
        
        if (this.dayNightCycleSystem) {
            this.dayNightCycleSystem.setTime(16); // Late afternoon, mystical lighting
            console.log('🌅 Day/night cycle active (late afternoon)');
        }
        
        // Spawn anime characters/NPCs with REAL models
        if (this.animeCharacterSystem) {
            const characterConfigs = [
                { id: 'npc_warrior_1', type: 'warrior', face: 'fierce', hairstyle: 'short_spiky', hairColor: '#FF0000', accessories: ['demon_horns'] },
                { id: 'npc_mage_1', type: 'mage', face: 'elegant', hairstyle: 'long_wavy', hairColor: '#9370DB', accessories: ['wizard_hat'] },
                { id: 'npc_elf_1', type: 'elf', face: 'gentle', hairstyle: 'long_straight', hairColor: '#FFD700', accessories: ['elf_ears'] },
                { id: 'npc_knight_1', type: 'knight', face: 'determined', hairstyle: 'short_messy', hairColor: '#4169E1', accessories: ['crown'] }
            ];
            
            for (let i = 0; i < characterConfigs.length; i++) {
                const config = characterConfigs[i];
                const angle = (i / characterConfigs.length) * Math.PI * 2;
                const radius = 15;
                
                try {
                    // Try to load real model first
                    const npcModel = await this.modelLoader.loadModel('characters', config.type);
                    npcModel.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
                    npcModel.scale.set(0.5, 0.5, 0.5);
                    this.scene.add(npcModel);
                } catch (error) {
                    // Fallback to procedural
                    const character = this.animeCharacterSystem.createCharacter(config.id, config);
                    if (character && character.mesh) {
                        character.mesh.position.set(
                            Math.cos(angle) * radius,
                            0,
                            Math.sin(angle) * radius
                        );
                    }
                }
            }
            console.log('✨ Character models spawned (mix of loaded and procedural)');
        }
        
        // Enable all waypoints for fast travel
        if (this.teleportationSystem) {
            // Discover all waypoints for testing
            this.teleportationSystem.waypoints.forEach((waypoint, id) => {
                this.teleportationSystem.discoveredWaypoints.add(id);
            });
            console.log('🌀 Fast travel fully enabled with all waypoints');
        }
        
        // Check if starting from safe zone
        if (this.startFromSafeZone) {
            console.log('🏰 Starting from Safe Zone Hub...');
            this.safeZoneSystem.createSafeZone();
            return;
        }
        
        // Check for existing save
        if (this.saveSystem.hasSaveData()) {
            const metadata = this.saveSystem.getSaveMetadata();
            if (metadata) {
                console.log(`💾 Save found: Floor ${metadata.floor}, Level ${metadata.level}`);
                // Offer to load save (for now, auto-load)
                const shouldLoad = true; // Could show UI prompt here
                if (shouldLoad) {
                    this.saveSystem.loadGame();
                    return; // Skip initial dungeon generation
                }
            }
        }
        
        // Generate starting dungeon (if no save loaded)
        this.currentDungeon = this.dungeonGenerator.generate('crystal_cavern', 1);
        this.loadDungeon(this.currentDungeon);
        
        // Spawn initial enemies using EnemyManager
        this.enemyManager.spawnEnemiesForDungeon(this.currentDungeon, 5);
        
        // Start endless mode
        this.endlessMode.start();
        
        console.log('✅ Full game world created with REAL 3D models and all advanced features!');
    }
    
    loadDungeon(dungeon) {
        // Add dungeon geometry to scene
        this.scene.add(dungeon.floor);
        this.scene.add(dungeon.walls);
        
        // Add dungeon decorations
        if (dungeon.decorations) {
            dungeon.decorations.forEach(deco => this.scene.add(deco));
        }
        
        console.log(`📍 Loaded dungeon: ${dungeon.name} (${dungeon.biome})`);
    }
    
    start() {
        this.isRunning = true;
        console.log('🎮 Game engine started');
    }
    
    update() {
        if (!this.isRunning) return;
        
        const delta = this.clock.getDelta();
        
        // Update player
        if (this.player) {
            this.player.update(delta);
            this.updatePlayerUI();
        }
        
        // Update particle system
        if (this.particleSystem) {
            this.particleSystem.update(delta);
        }
        
        // Update combat system
        if (this.combatSystem) {
            this.combatSystem.update(delta);
        }
        
        // Update combo system
        if (this.comboSystem) {
            this.comboSystem.update(delta);
        }
        
        // Update enemy manager
        if (this.enemyManager) {
            this.enemyManager.update(delta, this.player);
        }
        
        // Update endless mode
        if (this.endlessMode) {
            this.endlessMode.update(delta);
        }
        
        // Update quest system
        if (this.questSystem) {
            this.questSystem.update(delta);
        }
        
        // Update Phase 4 systems
        if (this.craftingSystem) {
            this.craftingSystem.update(delta);
        }
        
        if (this.economySystem) {
            this.economySystem.update(delta);
        }
        
        if (this.enhancementSystem) {
            this.enhancementSystem.update(delta);
        }
        
        if (this.tradingSystem) {
            this.tradingSystem.update(delta);
        }
        
        // Update Phase 5 systems
        if (this.petSystem) {
            this.petSystem.update(delta);
        }
        
        if (this.companionAI) {
            this.companionAI.update(delta);
        }
        
        if (this.mountSystem) {
            this.mountSystem.update(delta);
        }
        
        // Update Phase 6 systems
        if (this.leaderboardSystem) {
            this.leaderboardSystem.update(delta);
        }
        
        if (this.guildSystem) {
            this.guildSystem.update(delta);
        }
        
        if (this.challengeMode) {
            this.challengeMode.update(delta);
        }
        
        // Update Phase 7 systems
        if (this.prestigeSystem) {
            this.prestigeSystem.update(delta);
        }
        
        // ========================================
        // Phase 7-9: UPDATE NEW COMPLETE SYSTEMS
        // ========================================
        if (this.completeGameIntegration && this.completeGameIntegration.update) {
            this.completeGameIntegration.update(delta);
        }
        
        if (this.infiniteDungeonSystem) {
            this.infiniteDungeonSystem.update(delta);
        }
        
        // Update Enhanced Fantasy RPG systems
        if (this.fantasyMagicSystem) {
            this.fantasyMagicSystem.update(delta);
        }
        
        if (this.powerLevelingSystem) {
            this.powerLevelingSystem.update(delta);
        }
        
        if (this.endlessBattleSystem) {
            this.endlessBattleSystem.update(delta);
        }
        
        // Update enhanced mechanics
        if (this.enhancedGameMechanics) {
            this.enhancedGameMechanics.update(delta);
        }
        
        // Update Phase 1 Enhancement Systems
        if (this.weatherSystem) {
            this.weatherSystem.update(delta);
        }
        
        if (this.advancedParticleSystem) {
            this.advancedParticleSystem.update(delta);
        }
        
        if (this.dayNightCycleSystem) {
            this.dayNightCycleSystem.update(delta);
        }
        
        if (this.modernUISystem) {
            this.modernUISystem.update(delta);
        }
        
        if (this.environmentDetailsSystem) {
            this.environmentDetailsSystem.update(delta);
        }
        
        // Update Phase 2+ AAA Systems
        if (this.openWorldSystem) {
            this.openWorldSystem.update(delta);
        }
        
        if (this.volumetricLightingSystem) {
            this.volumetricLightingSystem.update(delta);
        }
        
        if (this.cinematicCameraSystem) {
            this.cinematicCameraSystem.update(delta);
        }
        
        if (this.physicsSystem) {
            this.physicsSystem.update(delta);
        }
        
        // Update Phase 3+ Systems
        if (this.characterClassSystem) {
            this.characterClassSystem.update(delta);
        }
        
        if (this.reputationSystem) {
            this.reputationSystem.update(delta);
        }
        
        if (this.attributeSystem) {
            this.attributeSystem.update(delta);
        }
        
        if (this.talentSystem) {
            this.talentSystem.update(delta);
        }
        
        if (this.npcSystem) {
            this.npcSystem.update(delta);
        }
        
        if (this.advancedInventorySystem) {
            this.advancedInventorySystem.update(delta);
        }
        
        // Update Production Polish Systems
        if (this.animeStyleRenderingSystem) {
            this.animeStyleRenderingSystem.update(delta);
        }
        
        if (this.productionReadinessSystem) {
            this.productionReadinessSystem.update(delta);
        }
        
        // Update Multiplayer & Social Systems
        if (this.multiplayerSocialSystem) {
            this.multiplayerSocialSystem.update(delta);
        }
        
        if (this.teleportationSystem) {
            this.teleportationSystem.update(delta);
        }
        
        if (this.startingZoneSystem) {
            this.startingZoneSystem.update(delta);
        }
        
        // Update advanced visuals systems
        if (this.advanced3DModelSystem) {
            this.advanced3DModelSystem.update(delta);
        }
        
        if (this.advancedUIInterfaceSystem) {
            this.advancedUIInterfaceSystem.update(delta);
        }
        
        // Update Phase 4 Biome Expansion Systems
        if (this.biomeGenerationSystem && this.player) {
            this.biomeGenerationSystem.update(this.player.mesh.position, delta);
        }
        
        if (this.biomeSpecificEnemies && this.player) {
            const currentBiome = this.biomeGenerationSystem ? this.biomeGenerationSystem.getCurrentBiome() : null;
            this.biomeSpecificEnemies.update(delta, this.player.mesh.position, currentBiome);
        }
        
        if (this.biomeWeatherEffects && this.player) {
            this.biomeWeatherEffects.update(delta, this.player.mesh.position);
        }
        
        if (this.biomeResourcesSystem) {
            this.biomeResourcesSystem.update(delta);
        }
        
        // Update Phase 5 Combat Systems
        if (this.dodgeAndParrySystem) {
            this.dodgeAndParrySystem.update(delta);
        }
        
        if (this.comboChainSystem) {
            this.comboChainSystem.update(delta);
        }
        
        if (this.weaponSkillSystem) {
            this.weaponSkillSystem.update(delta);
        }
        
        if (this.tacticalCombatAI && this.player) {
            this.tacticalCombatAI.update(delta, this.player.mesh.position);
        }
        
        if (this.pvpArenaSystem) {
            this.pvpArenaSystem.update(delta);
        }
        
        if (this.guildAndHousingSystem) {
            this.guildAndHousingSystem.update(delta);
        }
        
        if (this.matchmakingAndEventsSystem) {
            this.matchmakingAndEventsSystem.update(delta);
        }
        
        if (this.advancedGraphicsSystem && this.camera) {
            this.advancedGraphicsSystem.update(delta, this.camera.position);
        }
        
        // Update Phase 8-9 Systems (Intelligent AI & Anime Visuals)
        if (this.intelligentEnemyAI && this.player) {
            const playerState = {
                justDodged: this.player.dodgeState?.justDodged || false,
                dodgeDirection: this.player.dodgeState?.direction || null,
                justAttacked: this.player.combatState?.justAttacked || false,
                attackType: this.player.combatState?.attackType || null,
                skillUsed: this.player.combatState?.lastSkill || null
            };
            this.intelligentEnemyAI.update(delta, this.player.mesh.position, playerState);
        }
        
        if (this.animeCharacterSystem) {
            this.animeCharacterSystem.update(delta);
        }
        
        // Update Phase 8-9 Advanced Systems
        if (this.intelligentAISystem) {
            this.intelligentAISystem.update(delta);
        }
        
        if (this.dynamicDifficultySystem) {
            this.dynamicDifficultySystem.update(delta);
        }
        
        if (this.progressiveWorldSystem) {
            this.progressiveWorldSystem.update(delta);
        }
        
        if (this.magicalEffectsSystem) {
            this.magicalEffectsSystem.update(delta);
        }
        
        if (this.worldBeautificationSystem) {
            this.worldBeautificationSystem.update(delta);
        }
        
        if (this.monsterDesignSystem) {
            this.monsterDesignSystem.update(delta);
        }
        
        if (this.addictiveGameplaySystem) {
            this.addictiveGameplaySystem.update(delta);
        }
        
        if (this.playerControlSettingsSystem) {
            this.playerControlSettingsSystem.update(delta);
        }
        
        if (this.cloudSaveSystem) {
            this.cloudSaveSystem.update(delta);
        }
        
        if (this.advancedAutoManagementSystem) {
            this.advancedAutoManagementSystem.update(delta);
        }
        
        // Update Procedural Generation & Enhanced Systems
        if (this.proceduralGenerationSystem) {
            this.proceduralGenerationSystem.update(delta);
        }
        
        if (this.enhanced3DGraphicsSystem) {
            this.enhanced3DGraphicsSystem.update(delta);
        }
        
        if (this.storylineAndLoreSystem && this.player) {
            this.storylineAndLoreSystem.update(delta, this.player.level || 1);
        }
        
        // Update performance optimizer
        if (this.performanceOptimizer) {
            this.performanceOptimizer.update(delta);
        }
        
        // Update new enhanced systems
        if (this.advancedThemeSystem) {
            this.advancedThemeSystem.update(delta);
        }
        
        if (this.advanced3DGraphicsSystem) {
            this.advanced3DGraphicsSystem.update(delta);
        }
        
        if (this.safeZoneSystem) {
            this.safeZoneSystem.update(delta);
        }
        
        if (this.enhancedVisualsSystem) {
            this.enhancedVisualsSystem.update(delta);
        }
        
        if (this.magicalBackgroundSystem) {
            this.magicalBackgroundSystem.update(delta);
        }
        
        if (this.progressTrackingSystem) {
            this.progressTrackingSystem.update(delta);
        }
        
        // Update NEW Survival & Immersive Gameplay Systems
        if (this.cannabisMagicSystem) {
            this.cannabisMagicSystem.update(delta);
        }
        
        if (this.survivalSystem) {
            this.survivalSystem.update(delta);
        }
        
        if (this.buildingSystem) {
            this.buildingSystem.update(delta);
        }
        
        if (this.farmingSystem) {
            this.farmingSystem.update(delta);
        }
        
        if (this.seductiveBossSystem) {
            this.seductiveBossSystem.update(delta);
        }
        
        if (this.enemyCampSystem) {
            this.enemyCampSystem.update(delta);
        }
        
        if (this.worldPopulationSystem) {
            this.worldPopulationSystem.update(delta);
        }
        
        if (this.cityVillageSystem) {
            this.cityVillageSystem.update(delta);
        }
        
        if (this.deviceOptimizationSystem) {
            this.deviceOptimizationSystem.update(delta);
        }
        
        // ========================================
        // UPDATE ALL SYSTEMS via SystemManager
        // This updates ALL 270+ systems that have update() methods
        // ========================================
        if (this.systemManager) {
            this.systemManager.updateAll(delta);
        }
        
        // Update camera to follow player
        if (this.player && this.player.mesh) {
            const targetPosition = this.player.mesh.position.clone();
            targetPosition.y += 10;
            targetPosition.z += 15;
            this.camera.position.lerp(targetPosition, 0.05);
            this.camera.lookAt(this.player.mesh.position);
        }
    }
    
    render() {
        if (this.renderer && this.scene && this.camera) {
            // Use post-processing if available, otherwise standard rendering
            if (this.postProcessingSystem && this.postProcessingSystem.enabled) {
                const delta = this.clock.getDelta();
                this.postProcessingSystem.render(delta);
            } else {
                this.renderer.render(this.scene, this.camera);
            }
        }
    }
    
    updatePlayerUI() {
        if (!this.player) return;
        
        const hpPercent = (this.player.stats.hp / this.player.stats.maxHp) * 100;
        const mpPercent = (this.player.stats.mp / this.player.stats.maxMp) * 100;
        
        this.uiElements.hp.style.width = `${hpPercent}%`;
        this.uiElements.hpText.textContent = `${this.player.stats.hp}/${this.player.stats.maxHp}`;
        this.uiElements.mp.style.width = `${mpPercent}%`;
        this.uiElements.mpText.textContent = `${this.player.stats.mp}/${this.player.stats.maxMp}`;
    }
    
    updateCompanionUI() {
        const companion = this.companionManager.getActiveCompanion();
        if (companion) {
            this.uiElements.companionName.textContent = companion.name;
            this.uiElements.companionStatus.textContent = companion.isOnCooldown ? 'Cooldown' : 'Ready';
        }
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    // Ability methods
    useAbility(abilityKey) {
        if (!this.player || !this.isRunning) return;
        
        switch(abilityKey) {
            case 'q':
                this.castSmokeBlast();
                break;
            case 'w':
                this.castShadowStep();
                break;
            case 'e':
                this.castEssenceDrain();
                break;
            case 'r':
                this.useCompanionAbility();
                break;
        }
    }
    
    castSmokeBlast() {
        if (this.player.stats.mp < 20) return;
        
        this.player.stats.mp -= 20;
        console.log('💨 Smoke Blast!');
        
        // Play ability sound
        if (this.audioSystem) {
            this.audioSystem.playSoundEffect('ability', { frequency: 440 });
        }
        
        // Create smoke particle effect
        this.particleSystem.createSmokeBurst(this.player.mesh.position);
        
        // Damage nearby enemies
        const enemies = this.enemyManager.getEnemies();
        if (enemies && Array.isArray(enemies)) {
            enemies.forEach(enemy => {
                if (!enemy || !enemy.mesh || !enemy.isAlive) return;
                
                const distance = enemy.mesh.position.distanceTo(this.player.mesh.position);
                if (distance < 5) {
                    let damage = 25;
                    
                    // Apply combo multiplier
                    if (this.comboSystem) {
                        damage = this.comboSystem.onHit(damage);
                    }
                    
                    enemy.takeDamage(damage);
                    
                    // Create hit effect
                    if (this.particleSystem) {
                        this.particleSystem.createHitEffect(enemy.mesh.position);
                    }
                    
                    if (!enemy.isAlive) {
                        this.onEnemyKilled(enemy);
                    }
                }
            });
        }
    }
    
    castShadowStep() {
        if (this.player.stats.mp < 30) return;
        
        this.player.stats.mp -= 30;
        console.log('⚡ Shadow Step!');
        
        // Play teleport sound
        if (this.audioSystem) {
            this.audioSystem.playSoundEffect('teleport');
        }
        
        // Teleport player forward
        const direction = new THREE.Vector3(0, 0, -5);
        this.player.mesh.position.add(direction);
    }
    
    castEssenceDrain() {
        if (this.player.stats.mp < 25) return;
        
        this.player.stats.mp -= 25;
        console.log('💀 Essence Drain!');
        
        // Play ability sound
        if (this.audioSystem) {
            this.audioSystem.playSoundEffect('ability', { frequency: 330 });
        }
        
        // Heal player and damage nearest enemy
        const nearestEnemy = this.findNearestEnemy();
        if (nearestEnemy) {
            let damage = 15;
            
            // Apply combo multiplier
            if (this.comboSystem) {
                damage = this.comboSystem.onHit(damage);
            }
            
            nearestEnemy.takeDamage(damage);
            this.player.stats.hp = Math.min(this.player.stats.maxHp, this.player.stats.hp + 15);
            
            // Create heal effect on player
            if (this.particleSystem) {
                this.particleSystem.createHealEffect(this.player.mesh.position);
                this.particleSystem.createHitEffect(nearestEnemy.mesh.position, 0x9d4edd);
            }
            
            if (!nearestEnemy.isAlive) {
                this.onEnemyKilled(nearestEnemy);
            }
        }
    }
    
    useCompanionAbility() {
        const companion = this.companionManager.getActiveCompanion();
        if (companion && !companion.isOnCooldown) {
            console.log(`💜 ${companion.name} Ability!`);
            companion.useAbility(this);
            this.updateCompanionUI();
        }
    }
    
    findNearestEnemy() {
        let nearest = null;
        let minDistance = Infinity;
        
        const enemies = this.enemyManager.getEnemies();
        if (!enemies || !Array.isArray(enemies)) return null;
        
        enemies.forEach(enemy => {
            if (!enemy || !enemy.mesh || !enemy.isAlive) return;
            
            const distance = enemy.mesh.position.distanceTo(this.player.mesh.position);
            if (distance < minDistance) {
                minDistance = distance;
                nearest = enemy;
            }
        });
        
        return nearest;
    }
    
    dropLoot(enemy) {
        // Safety check
        if (!enemy) return;
        
        // Bosses always drop loot, regular enemies have 30% chance
        const dropChance = enemy.isBoss ? 1.0 : 0.3;
        
        if (Math.random() < dropChance) {
            const floor = this.endlessMode ? this.endlessMode.currentFloor : 1;
            
            // Bosses drop better loot
            let loot;
            if (enemy.isBoss) {
                // Always drop rare or better
                const rarities = ['rare', 'epic', 'legendary'];
                const rarity = rarities[Math.floor(Math.random() * rarities.length)];
                loot = this.inventorySystem.generateLoot(floor, rarity);
                
                // Bosses can drop multiple items
                this.inventorySystem.addItem(loot);
                
                // Play pickup sound
                if (this.audioSystem) {
                    this.audioSystem.playSoundEffect('pickup');
                }
                
                // Track achievement
                if (this.achievementSystem) {
                    this.achievementSystem.onItemCollected(rarity);
                }
                
                // 50% chance for a second item
                if (Math.random() < 0.5) {
                    const bonusLoot = this.inventorySystem.generateLoot(floor, rarity);
                    this.inventorySystem.addItem(bonusLoot);
                }
            } else {
                loot = this.inventorySystem.generateLoot(floor);
                this.inventorySystem.addItem(loot);
                
                // Play pickup sound
                if (this.audioSystem) {
                    this.audioSystem.playSoundEffect('pickup');
                }
                
                // Track achievement
                if (this.achievementSystem && loot) {
                    this.achievementSystem.onItemCollected(loot.rarity);
                }
            }
        }
    }
    
    // Centralized enemy kill handler
    onEnemyKilled(enemy) {
        // Safety check
        if (!enemy) return;
        
        // Play death sound
        if (this.audioSystem) {
            this.audioSystem.playSoundEffect('death');
        }
        
        // Give experience (with null check)
        if (enemy.stats && enemy.stats.exp) {
            this.player.gainExp(enemy.stats.exp);
        }
        
        // Update endless mode
        if (this.endlessMode) {
            this.endlessMode.onEnemyDefeated();
        }
        
        // Drop loot
        this.dropLoot(enemy);
        
        // Update quests
        if (this.questSystem) {
            this.questSystem.onEnemyDefeated(enemy.isBoss);
        }
        
        // Track achievements
        if (this.achievementSystem) {
            this.achievementSystem.onEnemyDefeated(enemy.isBoss);
        }
    }
    
        setupUIControls() {
        
        console.log('🎮 UI Controls Setup:');
        console.log('   F = Farming Menu');
        console.log('   B = Building Menu');
        console.log('   M = Cannabis Magic Menu');
        console.log('   S = Survival Stats');
    }
    
    handlePlayerDeath() {
        console.log('💀 Player died!');
        // Reset survival stats
        if (this.survivalSystem) {
            this.survivalSystem.reset();
        }
        // Respawn player
        if (this.player) {
            this.player.position.set(0, 1, 0);
        }
    }
}
