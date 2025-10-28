/**
 * GameEngine - Core game engine using Three.js for 3D rendering
 * Handles scene management, rendering, and game state
 */

import * as THREE from 'three';
import { Player } from '../entities/Player.js';
import { CompanionManager } from '../systems/CompanionManager.js';
import { DungeonGenerator } from '../worlds/DungeonGenerator.js';
import { CombatSystem } from '../systems/CombatSystem.js';
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

export class GameEngine {
    constructor(canvas) {
        this.canvas = canvas;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.clock = new THREE.Clock();
        
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
        // Create Three.js scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a0033);
        this.scene.fog = new THREE.FogExp2(0x2d0a4e, 0.02);
        
        // Store game engine reference in scene for systems to access
        this.scene.userData.gameEngine = this;
        
        // Setup camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
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
        
        // Add ambient lighting (purple twilight)
        const ambientLight = new THREE.AmbientLight(0x9d4edd, 0.4);
        this.scene.add(ambientLight);
        
        // Add directional light (moon-like)
        const dirLight = new THREE.DirectionalLight(0xc77dff, 0.6);
        dirLight.position.set(10, 20, 10);
        dirLight.castShadow = true;
        dirLight.shadow.camera.near = 0.1;
        dirLight.shadow.camera.far = 100;
        dirLight.shadow.camera.left = -20;
        dirLight.shadow.camera.right = 20;
        dirLight.shadow.camera.top = 20;
        dirLight.shadow.camera.bottom = -20;
        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;
        this.scene.add(dirLight);
        
        // Add atmospheric point lights (smoke magic effect)
        for (let i = 0; i < 5; i++) {
            const light = new THREE.PointLight(0x9d4edd, 0.5, 20);
            light.position.set(
                Math.random() * 20 - 10,
                Math.random() * 5 + 2,
                Math.random() * 20 - 10
            );
            this.scene.add(light);
        }
        
        // Initialize game systems with error handling
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
        } catch (error) {
            console.error('Error initializing core systems:', error);
            throw new Error('Failed to initialize core game systems: ' + error.message);
        }
        
        // Phase 4: Crafting & Economy Systems
        try {
            this.craftingSystem = new CraftingSystem(this);
            this.economySystem = new EconomySystem(this);
            this.enhancementSystem = new EnhancementSystem(this);
            this.tradingSystem = new TradingSystem(this);
        } catch (error) {
            console.error('Error initializing Phase 4 systems:', error);
            // Continue with degraded functionality
            console.warn('Game will continue without some Phase 4 features');
        }
        
        // Phase 5: Pet/Companion Combat Systems
        try {
            this.petSystem = new PetSystem(this);
            this.companionAI = new CompanionAI(this);
            this.mountSystem = new MountSystem(this);
        } catch (error) {
            console.error('Error initializing Phase 5 systems:', error);
            console.warn('Game will continue without some Phase 5 features');
        }
        
        // Phase 6: Social & Leaderboards (Complete)
        try {
            this.leaderboardSystem = new LeaderboardSystem(this);
            this.guildSystem = new GuildSystem(this);
            this.challengeMode = new ChallengeMode(this);
        } catch (error) {
            console.error('Error initializing Phase 6 systems:', error);
            console.warn('Game will continue without some Phase 6 features');
        }
        
        // Phase 7: Advanced Progression
        try {
            this.prestigeSystem = new PrestigeSystem(this);
            this.infiniteDungeonSystem = new InfiniteDungeonSystem(this);
        } catch (error) {
            console.error('Error initializing Phase 7 systems:', error);
            console.warn('Game will continue without some Phase 7 features');
        }
        
        // Enhanced Fantasy RPG Systems
        try {
            this.fantasyMagicSystem = new FantasyMagicSystem();
            this.seductiveBaddiesSystem = new SeductiveBaddiesSystem();
            this.powerLevelingSystem = new PowerLevelingSystem();
            this.endlessBattleSystem = new EndlessBattleSystem();
        } catch (error) {
            console.error('Error initializing enhanced RPG systems:', error);
            console.warn('Game will continue without some enhanced RPG features');
        }
        
        // Enhanced Game Mechanics & Optimizations
        try {
            this.enhancedGameMechanics = new EnhancedGameMechanics();
            this.autoSaveSystem = new AutoSaveSystem();
            this.performanceOptimizer = new PerformanceOptimizer();
            
            // New Enhanced Systems
            this.advancedThemeSystem = new AdvancedThemeSystem(this);
            this.advanced3DGraphicsSystem = new Advanced3DGraphicsSystem(this);
            this.mainMenuSystem = new MainMenuSystem(this);
            this.safeZoneSystem = new SafeZoneSystem(this);
            this.enhancedVisualsSystem = new EnhancedVisualsSystem(this);
            this.progressTrackingSystem = new ProgressTrackingSystem(this);
            
            // New Phase 1 Enhancement Systems - 3D Graphics & Atmosphere
            this.weatherSystem = new WeatherSystem(this);
            this.postProcessingSystem = new PostProcessingSystem(this);
            this.advancedParticleSystem = new AdvancedParticleSystem(this.scene);
            this.dayNightCycleSystem = new DayNightCycleSystem(this);
            this.modernUISystem = new ModernUISystem(this);
            this.environmentDetailsSystem = new EnvironmentDetailsSystem(this);
            
            // Phase 2+ AAA Systems - Open World & Cinematic
            this.openWorldSystem = new OpenWorldSystem(this);
            this.volumetricLightingSystem = new VolumetricLightingSystem(this);
            this.cinematicCameraSystem = new CinematicCameraSystem(this);
            this.physicsSystem = new PhysicsSystem(this);
            
            // Phase 3+ Character & World Systems
            this.characterClassSystem = new CharacterClassSystem(this);
            this.npcSystem = new NPCSystem(this);
            this.advancedInventorySystem = new AdvancedInventorySystem(this);
            
            // Production Polish Systems
            this.animeStyleRenderingSystem = new AnimeStyleRenderingSystem(this);
            this.productionReadinessSystem = new ProductionReadinessSystem(this);
            
            // Multiplayer & Social Systems
            this.multiplayerSocialSystem = new MultiplayerSocialSystem(this);
            this.teleportationSystem = new TeleportationSystem(this);
            this.startingZoneSystem = new StartingZoneSystem(this);
            
            // Advanced Visuals & UI Systems
            this.advanced3DModelSystem = new Advanced3DModelSystem(this.scene);
            this.advancedUIInterfaceSystem = new AdvancedUIInterfaceSystem();
            
            // Phase 4: Biome Expansion Systems (NEW)
            this.biomeGenerationSystem = new BiomeGenerationSystem(this.scene, this.camera);
            this.biomeSpecificEnemies = new BiomeSpecificEnemies(this.scene);
            this.biomeWeatherEffects = new BiomeWeatherEffects(this.scene, this.camera);
            this.biomeResourcesSystem = new BiomeResourcesSystem(this.scene);
            this.biomeDungeonsSystem = new BiomeDungeonsSystem(this.scene);
            
            // Initialize Phase 4 systems
            this.biomeGenerationSystem.init();
            this.biomeWeatherEffects.init();
            
            console.log('🎨 Phase 1 Enhancement Systems initialized (Weather, Post-Processing, Advanced Particles, Day/Night, Modern UI, Environment Details)');
            console.log('🌍 Phase 2+ AAA Systems initialized (Open World, Volumetric Lighting, Cinematic Camera, Physics)');
            console.log('👤 Phase 3+ Character & World Systems initialized (Character Classes, NPCs, Advanced Inventory)');
            console.log('✨ Production Polish Systems initialized (Anime Style Rendering, Production Readiness)');
            console.log('👥 Multiplayer & Social Systems initialized (Social, Teleportation, Starting Zone)');
            console.log('🎮 Advanced Visuals Systems initialized (3D Models, UI Interface)');
            console.log('🌲 Phase 4 Biome Expansion Systems initialized (5 systems: Generation, Enemies, Weather, Resources, Dungeons)');
        } catch (error) {
            console.error('Error initializing enhanced mechanics:', error);
            console.warn('Game will continue without some enhanced mechanics');
        }
        
        // Make save system aware of all systems
        try {
            this.saveSystem = new SaveSystem(this);
        } catch (error) {
            console.error('Error initializing save system:', error);
            throw new Error('Failed to initialize save system: ' + error.message);
        }
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
        
        return true;
    }
    
    async createWorld() {
        // Create player
        this.player = new Player(this.scene);
        await this.player.init();
        
        // Set initial companion
        this.companionManager.setActiveCompanion('smoke_siren');
        this.updateCompanionUI();
        
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
        
        if (this.progressTrackingSystem) {
            this.progressTrackingSystem.update(delta);
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
        enemies.forEach(enemy => {
            const distance = enemy.mesh.position.distanceTo(this.player.mesh.position);
            if (distance < 5 && enemy.isAlive) {
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
        enemies.forEach(enemy => {
            if (!enemy.isAlive) return;
            const distance = enemy.mesh.position.distanceTo(this.player.mesh.position);
            if (distance < minDistance) {
                minDistance = distance;
                nearest = enemy;
            }
        });
        
        return nearest;
    }
    
    dropLoot(enemy) {
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
        // Play death sound
        if (this.audioSystem) {
            this.audioSystem.playSoundEffect('death');
        }
        
        // Give experience
        this.player.gainExp(enemy.stats.exp);
        
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
}
