/**
 * Progressive World System
 * Phase 8.3 - World tiers, region evolution, random events, and world bosses
 */

import * as THREE from 'three';

export class ProgressiveWorldSystem {
    constructor(scene) {
        this.scene = scene;
        
        // World tiers (10 tiers total)
        this.worldTiers = [];
        this.currentTier = 1;
        this.maxTier = 10;
        
        // Regions that evolve
        this.regions = [];
        this.evolvedRegions = new Set();
        
        // Random events
        this.activeEvents = [];
        this.eventTypes = [
            'METEOR_STORM',
            'MONSTER_INVASION',
            'TREASURE_SPAWN',
            'BOSS_SPAWN',
            'WEATHER_DISASTER',
            'RESOURCE_ABUNDANCE',
            'PORTAL_OPENING',
            'CELESTIAL_BLESSING'
        ];
        
        // World bosses
        this.worldBosses = [];
        this.activeWorldBosses = [];
        this.bossSpawnTimer = 0;
        
        // Dynamic quests
        this.dynamicQuests = [];
        this.questPool = [];
        
        // Territory control
        this.territories = [];
        this.guildTerritories = new Map();
        
        // World state
        this.worldState = {
            corruption: 0,
            order: 100,
            magic: 50,
            nature: 50,
            technology: 0
        };
        
        // Community progress
        this.communityProgress = {
            monstersSlain: 0,
            bossesDefeated: 0,
            dungeonsCleared: 0,
            questsCompleted: 0,
            treasuresFound: 0
        };
        
        this.initialize();
    }
    
    initialize() {
        console.log('🌍 Progressive World System initialized');
        
        // Create world tiers
        this.createWorldTiers();
        
        // Create regions
        this.createRegions();
        
        // Create world bosses
        this.createWorldBosses();
        
        // Create territories
        this.createTerritories();
        
        // Start event system
        this.startEventSystem();
    }
    
    /**
     * Create 10 world tiers with progressive unlocking
     */
    createWorldTiers() {
        for (let i = 1; i <= this.maxTier; i++) {
            this.worldTiers.push({
                tier: i,
                name: `Tier ${i}: ${this.getTierName(i)}`,
                unlocked: i === 1,
                requiredLevel: i * 10,
                requiredProgress: (i - 1) * 1000,
                enemyLevelRange: [i * 10, i * 10 + 9],
                lootQuality: i,
                features: this.getTierFeatures(i)
            });
        }
    }
    
    getTierName(tier) {
        const names = [
            'Awakening Plains',
            'Shadowed Forests',
            'Crystal Highlands',
            'Volcanic Wastes',
            'Frozen Tundra',
            'Sky Islands',
            'Abyssal Depths',
            'Celestial Peaks',
            'Void Realm',
            'Ascension'
        ];
        return names[tier - 1] || 'Unknown';
    }
    
    getTierFeatures(tier) {
        const features = [];
        
        if (tier >= 2) features.push('Elite Enemies');
        if (tier >= 3) features.push('World Bosses');
        if (tier >= 4) features.push('Random Events');
        if (tier >= 5) features.push('Territory Control');
        if (tier >= 6) features.push('Mythic Dungeons');
        if (tier >= 7) features.push('Legendary Crafting');
        if (tier >= 8) features.push('Divine Artifacts');
        if (tier >= 9) features.push('World PvP');
        if (tier >= 10) features.push('Ascension Trials');
        
        return features;
    }
    
    /**
     * Create evolving regions
     */
    createRegions() {
        const regionData = [
            {
                name: 'Starting Village',
                position: new THREE.Vector3(0, 0, 0),
                size: 50,
                type: 'town',
                evolution: ['Settlement', 'Town', 'City', 'Capital']
            },
            {
                name: 'Dark Forest',
                position: new THREE.Vector3(100, 0, 0),
                size: 80,
                type: 'forest',
                evolution: ['Corrupted', 'Cleansed', 'Sacred Grove']
            },
            {
                name: 'Mountain Pass',
                position: new THREE.Vector3(0, 0, 100),
                size: 60,
                type: 'mountain',
                evolution: ['Blocked', 'Accessible', 'Fortified']
            },
            {
                name: 'Ancient Ruins',
                position: new THREE.Vector3(150, 0, 150),
                size: 70,
                type: 'ruins',
                evolution: ['Abandoned', 'Excavated', 'Restored', 'Sanctified']
            },
            {
                name: 'Coastal Bay',
                position: new THREE.Vector3(-100, 0, -100),
                size: 90,
                type: 'coast',
                evolution: ['Quiet', 'Trading Port', 'Naval Base']
            }
        ];
        
        regionData.forEach(data => {
            this.regions.push({
                ...data,
                currentEvolution: 0,
                completionProgress: 0,
                requiredCompletion: 100,
                activeQuests: [],
                npcs: [],
                resources: []
            });
        });
    }
    
    /**
     * Create world bosses
     */
    createWorldBosses() {
        this.worldBosses = [
            {
                name: 'Ancient Dragon Tyranthos',
                level: 20,
                type: 'dragon',
                spawnLocation: new THREE.Vector3(200, 50, 200),
                respawnTime: 7200000, // 2 hours
                maxPlayers: 20,
                phases: 4,
                rewards: ['legendary_weapon', 'dragon_scale', 'massive_exp']
            },
            {
                name: 'Void Kraken',
                level: 30,
                type: 'kraken',
                spawnLocation: new THREE.Vector3(-200, 0, -200),
                respawnTime: 10800000, // 3 hours
                maxPlayers: 25,
                phases: 3,
                rewards: ['mythic_armor', 'void_essence', 'kraken_eye']
            },
            {
                name: 'Celestial Phoenix',
                level: 40,
                type: 'phoenix',
                spawnLocation: new THREE.Vector3(0, 100, 0),
                respawnTime: 14400000, // 4 hours
                maxPlayers: 30,
                phases: 5,
                rewards: ['divine_artifact', 'phoenix_feather', 'rebirth_token']
            },
            {
                name: 'Corrupted Titan',
                level: 50,
                type: 'titan',
                spawnLocation: new THREE.Vector3(300, 0, 300),
                respawnTime: 21600000, // 6 hours
                maxPlayers: 40,
                phases: 6,
                rewards: ['ascension_key', 'titan_core', 'world_blessing']
            }
        ];
    }
    
    /**
     * Create territories for guild control
     */
    createTerritories() {
        const territoryLocations = [
            { name: 'Northern Outpost', pos: new THREE.Vector3(0, 0, 200) },
            { name: 'Eastern Fortress', pos: new THREE.Vector3(200, 0, 0) },
            { name: 'Southern Keep', pos: new THREE.Vector3(0, 0, -200) },
            { name: 'Western Citadel', pos: new THREE.Vector3(-200, 0, 0) },
            { name: 'Central Tower', pos: new THREE.Vector3(0, 0, 0) }
        ];
        
        territoryLocations.forEach(loc => {
            this.territories.push({
                name: loc.name,
                position: loc.pos,
                controlRadius: 50,
                owner: null,
                benefits: {
                    expBonus: 0.1,
                    lootBonus: 0.1,
                    spawnReduction: 0.2
                },
                defenseLevel: 0,
                captureProgress: 0
            });
        });
    }
    
    /**
     * Start random event system
     */
    startEventSystem() {
        // Events trigger every 5-15 minutes
        this.eventInterval = setInterval(() => {
            if (Math.random() < 0.7) { // 70% chance
                this.triggerRandomEvent();
            }
        }, 300000 + Math.random() * 600000); // 5-15 minutes
    }
    
    /**
     * Update world system
     */
    update(deltaTime, player, communityData) {
        // Update world tier
        this.updateWorldTier(player);
        
        // Update regions
        this.updateRegions(deltaTime);
        
        // Update active events
        this.updateEvents(deltaTime);
        
        // Update world bosses
        this.updateWorldBosses(deltaTime);
        
        // Update dynamic quests
        this.updateDynamicQuests(player);
        
        // Update world state
        this.updateWorldState(communityData);
        
        // Update territories
        this.updateTerritories(deltaTime);
    }
    
    /**
     * Update current world tier based on player progress
     */
    updateWorldTier(player) {
        if (!player) return;
        
        const nextTier = this.currentTier + 1;
        if (nextTier > this.maxTier) return;
        
        const tierData = this.worldTiers[nextTier - 1];
        
        if (player.level >= tierData.requiredLevel && 
            this.communityProgress.monstersSlain >= tierData.requiredProgress) {
            
            this.unlockTier(nextTier);
        }
    }
    
    /**
     * Unlock new world tier
     */
    unlockTier(tier) {
        if (tier > this.maxTier || tier <= this.currentTier) return;
        
        this.currentTier = tier;
        const tierData = this.worldTiers[tier - 1];
        tierData.unlocked = true;
        
        console.log(`🎊 World Tier ${tier} Unlocked: ${tierData.name}`);
        
        // Trigger tier unlock event
        this.triggerEvent({
            type: 'TIER_UNLOCK',
            tier: tier,
            duration: 300000, // 5 minutes celebration
            position: new THREE.Vector3(0, 0, 0),
            effects: ['fireworks', 'buff_all_players', 'bonus_exp']
        });
        
        // Spawn tier boss
        if (tier >= 3) {
            this.spawnTierBoss(tier);
        }
    }
    
    /**
     * Update region evolution
     */
    updateRegions(deltaTime) {
        this.regions.forEach(region => {
            if (region.completionProgress >= region.requiredCompletion) {
                this.evolveRegion(region);
            }
        });
    }
    
    /**
     * Evolve a region to next stage
     */
    evolveRegion(region) {
        const nextEvolution = region.currentEvolution + 1;
        
        if (nextEvolution >= region.evolution.length) return;
        
        region.currentEvolution = nextEvolution;
        region.completionProgress = 0;
        region.requiredCompletion += 50; // More progress needed each time
        
        const newState = region.evolution[nextEvolution];
        
        console.log(`✨ ${region.name} evolved to: ${newState}`);
        
        // Apply evolution changes
        this.applyRegionEvolution(region, newState);
        
        this.evolvedRegions.add(region.name);
    }
    
    /**
     * Apply changes when region evolves
     */
    applyRegionEvolution(region, newState) {
        // Add new NPCs
        region.npcs.push({
            type: 'merchant',
            quality: region.currentEvolution + 1
        });
        
        // Add new resources
        region.resources.push({
            type: 'rare_material',
            tier: region.currentEvolution
        });
        
        // Improve region benefits
        region.benefits = {
            expBonus: 0.05 * region.currentEvolution,
            safeZone: region.currentEvolution >= 2
        };
        
        // Visual changes would be applied here
        this.updateRegionVisuals(region);
    }
    
    /**
     * Update active events
     */
    updateEvents(deltaTime) {
        this.activeEvents = this.activeEvents.filter(event => {
            event.timeRemaining -= deltaTime * 1000;
            
            if (event.timeRemaining <= 0) {
                this.endEvent(event);
                return false;
            }
            
            return true;
        });
    }
    
    /**
     * Trigger random world event
     */
    triggerRandomEvent() {
        const eventType = this.eventTypes[Math.floor(Math.random() * this.eventTypes.length)];
        const location = this.getRandomLocation();
        
        const event = {
            type: eventType,
            position: location,
            timeRemaining: 600000, // 10 minutes
            startTime: Date.now(),
            participants: [],
            rewards: this.getEventRewards(eventType)
        };
        
        this.activeEvents.push(event);
        
        console.log(`🌟 World Event Started: ${eventType} at ${location.x}, ${location.z}`);
        
        this.applyEventEffects(event);
    }
    
    /**
     * Trigger specific event
     */
    triggerEvent(eventData) {
        this.activeEvents.push({
            ...eventData,
            timeRemaining: eventData.duration,
            startTime: Date.now()
        });
        
        this.applyEventEffects(eventData);
    }
    
    /**
     * Apply event effects to world
     */
    applyEventEffects(event) {
        switch (event.type) {
            case 'METEOR_STORM':
                this.spawnMeteors(event.position, 20);
                break;
                
            case 'MONSTER_INVASION':
                this.spawnInvasion(event.position, 50);
                break;
                
            case 'TREASURE_SPAWN':
                this.spawnTreasureChests(event.position, 10);
                break;
                
            case 'BOSS_SPAWN':
                this.spawnEventBoss(event.position);
                break;
                
            case 'WEATHER_DISASTER':
                this.triggerWeatherDisaster(event.position);
                break;
                
            case 'RESOURCE_ABUNDANCE':
                this.spawnAbundantResources(event.position);
                break;
                
            case 'PORTAL_OPENING':
                this.openPortal(event.position);
                break;
                
            case 'CELESTIAL_BLESSING':
                this.applyCelestialBlessing(event.position);
                break;
        }
    }
    
    /**
     * End event and distribute rewards
     */
    endEvent(event) {
        console.log(`Event ended: ${event.type}`);
        
        // Distribute rewards to participants
        if (event.participants && event.participants.length > 0) {
            event.participants.forEach(participant => {
                this.giveEventRewards(participant, event.rewards);
            });
        }
    }
    
    /**
     * Get rewards for event type
     */
    getEventRewards(eventType) {
        const rewards = {
            METEOR_STORM: ['stardust', 'cosmic_ore', 'exp_bonus'],
            MONSTER_INVASION: ['honor_points', 'rare_loot', 'exp_bonus'],
            TREASURE_SPAWN: ['gold', 'gems', 'rare_items'],
            BOSS_SPAWN: ['legendary_loot', 'boss_token', 'massive_exp'],
            WEATHER_DISASTER: ['elemental_essence', 'survival_badge'],
            RESOURCE_ABUNDANCE: ['resources_x5', 'gathering_exp'],
            PORTAL_OPENING: ['portal_key', 'otherworldly_items'],
            CELESTIAL_BLESSING: ['stat_boost', 'exp_boost', 'luck_boost']
        };
        
        return rewards[eventType] || ['exp_bonus'];
    }
    
    /**
     * Update world bosses
     */
    updateWorldBosses(deltaTime) {
        this.bossSpawnTimer += deltaTime * 1000;
        
        // Check for boss respawns
        this.worldBosses.forEach(bossData => {
            if (!bossData.lastDeath) return;
            
            const timeSinceDeath = Date.now() - bossData.lastDeath;
            
            if (timeSinceDeath >= bossData.respawnTime) {
                this.spawnWorldBoss(bossData);
            }
        });
        
        // Update active boss encounters
        this.activeWorldBosses.forEach(boss => {
            this.updateBossEncounter(boss, deltaTime);
        });
    }
    
    /**
     * Spawn world boss
     */
    spawnWorldBoss(bossData) {
        const boss = {
            ...bossData,
            health: bossData.maxHealth || 1000000,
            currentPhase: 1,
            participants: [],
            spawnTime: Date.now(),
            active: true
        };
        
        this.activeWorldBosses.push(boss);
        
        console.log(`🐉 World Boss Spawned: ${boss.name} at level ${boss.level}`);
        
        // Announce to all players
        this.announceWorldBoss(boss);
    }
    
    /**
     * Spawn tier-specific boss
     */
    spawnTierBoss(tier) {
        const bossData = {
            name: `Tier ${tier} Guardian`,
            level: tier * 10,
            type: 'guardian',
            spawnLocation: this.getRandomLocation(),
            maxPlayers: 15 + tier * 2,
            phases: tier,
            rewards: [`tier_${tier}_key`, 'massive_exp', 'tier_gear']
        };
        
        this.spawnWorldBoss(bossData);
    }
    
    /**
     * Update boss encounter
     */
    updateBossEncounter(boss, deltaTime) {
        if (!boss.active) return;
        
        // Check phase transitions
        const healthPercent = boss.health / boss.maxHealth;
        const expectedPhase = Math.ceil((1 - healthPercent) * boss.phases);
        
        if (expectedPhase > boss.currentPhase && expectedPhase <= boss.phases) {
            this.transitionBossPhase(boss, expectedPhase);
        }
        
        // Check enrage timer (30 minutes)
        const elapsed = Date.now() - boss.spawnTime;
        if (elapsed > 1800000 && !boss.enraged) {
            this.enrageBoss(boss);
        }
    }
    
    /**
     * Transition boss to next phase
     */
    transitionBossPhase(boss, newPhase) {
        boss.currentPhase = newPhase;
        
        console.log(`${boss.name} entered Phase ${newPhase}!`);
        
        // Add new abilities
        boss.currentAbilities = boss.phaseAbilities?.[newPhase] || [];
        
        // Heal boss slightly
        boss.health += boss.maxHealth * 0.1;
        
        // Visual effects
        this.triggerPhaseTransition(boss);
    }
    
    /**
     * Enrage boss (soft enrage mechanic)
     */
    enrageBoss(boss) {
        boss.enraged = true;
        boss.damage *= 2;
        boss.attackSpeed *= 1.5;
        
        console.log(`💢 ${boss.name} is ENRAGED!`);
    }
    
    /**
     * Boss defeated
     */
    onBossDefeated(boss) {
        boss.active = false;
        boss.lastDeath = Date.now();
        
        console.log(`🏆 World Boss Defeated: ${boss.name}`);
        
        // Distribute rewards
        boss.participants.forEach(participant => {
            this.giveBossRewards(participant, boss.rewards);
        });
        
        // Update community progress
        this.communityProgress.bossesDefeated++;
        
        // Remove from active bosses
        const index = this.activeWorldBosses.indexOf(boss);
        if (index !== -1) {
            this.activeWorldBosses.splice(index, 1);
        }
    }
    
    /**
     * Update dynamic quests based on world state
     */
    updateDynamicQuests(player) {
        // Generate new quests based on world state
        if (this.dynamicQuests.length < 10) {
            const quest = this.generateDynamicQuest(player);
            if (quest) {
                this.dynamicQuests.push(quest);
            }
        }
        
        // Remove expired quests
        this.dynamicQuests = this.dynamicQuests.filter(q => {
            return Date.now() - q.createdTime < 3600000; // 1 hour expiry
        });
    }
    
    /**
     * Generate dynamic quest
     */
    generateDynamicQuest(player) {
        const questTypes = [
            'defend_region',
            'collect_resources',
            'defeat_boss',
            'explore_area',
            'help_npcs'
        ];
        
        const type = questTypes[Math.floor(Math.random() * questTypes.length)];
        const region = this.regions[Math.floor(Math.random() * this.regions.length)];
        
        return {
            id: `quest_${Date.now()}`,
            type: type,
            title: this.getQuestTitle(type),
            description: this.getQuestDescription(type, region),
            region: region,
            objectives: this.getQuestObjectives(type),
            rewards: this.getQuestRewards(type),
            createdTime: Date.now(),
            difficulty: this.currentTier
        };
    }
    
    /**
     * Update territories
     */
    updateTerritories(deltaTime) {
        this.territories.forEach(territory => {
            // Apply benefits to guild members in territory
            if (territory.owner) {
                this.applyTerritoryBenefits(territory);
            }
            
            // Decay capture progress if contested
            if (territory.captureProgress > 0 && territory.captureProgress < 100) {
                territory.captureProgress -= deltaTime * 0.1;
                territory.captureProgress = Math.max(0, territory.captureProgress);
            }
        });
    }
    
    /**
     * Update world state based on community actions
     */
    updateWorldState(communityData) {
        if (!communityData) return;
        
        // Corruption increases with monster spawns
        this.worldState.corruption += 0.001;
        
        // Order increases with quests completed
        if (communityData.questsCompleted > 0) {
            this.worldState.order += 0.01;
        }
        
        // Magic increases with spell usage
        if (communityData.spellsCast > 0) {
            this.worldState.magic += 0.01;
        }
        
        // Clamp values
        Object.keys(this.worldState).forEach(key => {
            this.worldState[key] = Math.max(0, Math.min(100, this.worldState[key]));
        });
        
        // Trigger world events based on state
        this.checkWorldStateEvents();
    }
    
    /**
     * Check for world state triggered events
     */
    checkWorldStateEvents() {
        // High corruption triggers invasion
        if (this.worldState.corruption > 80 && Math.random() < 0.01) {
            this.triggerEvent({
                type: 'MONSTER_INVASION',
                duration: 1200000,
                position: this.getRandomLocation()
            });
        }
        
        // High order triggers blessing
        if (this.worldState.order > 90 && Math.random() < 0.01) {
            this.triggerEvent({
                type: 'CELESTIAL_BLESSING',
                duration: 600000,
                position: new THREE.Vector3(0, 0, 0)
            });
        }
    }
    
    /**
     * Helper methods
     */
    
    getRandomLocation() {
        const range = 200;
        return new THREE.Vector3(
            Math.random() * range * 2 - range,
            0,
            Math.random() * range * 2 - range
        );
    }
    
    updateRegionVisuals(region) {
        // Visual updates would be applied here
        console.log(`Updated visuals for ${region.name}`);
    }
    
    announceWorldBoss(boss) {
        console.log(`📢 WORLD ANNOUNCEMENT: ${boss.name} has appeared!`);
    }
    
    spawnMeteors(position, count) {
        console.log(`☄️ Spawning ${count} meteors at`, position);
    }
    
    spawnInvasion(position, count) {
        console.log(`👹 Spawning invasion of ${count} monsters at`, position);
    }
    
    spawnTreasureChests(position, count) {
        console.log(`💰 Spawning ${count} treasure chests at`, position);
    }
    
    spawnEventBoss(position) {
        console.log(`👑 Spawning event boss at`, position);
    }
    
    triggerWeatherDisaster(position) {
        console.log(`🌪️ Triggering weather disaster at`, position);
    }
    
    spawnAbundantResources(position) {
        console.log(`🌾 Spawning abundant resources at`, position);
    }
    
    openPortal(position) {
        console.log(`🌀 Opening portal at`, position);
    }
    
    applyCelestialBlessing(position) {
        console.log(`✨ Applying celestial blessing at`, position);
    }
    
    giveEventRewards(participant, rewards) {
        console.log(`Giving event rewards to participant:`, rewards);
    }
    
    giveBossRewards(participant, rewards) {
        console.log(`Giving boss rewards to participant:`, rewards);
    }
    
    triggerPhaseTransition(boss) {
        console.log(`Phase transition for ${boss.name}`);
    }
    
    applyTerritoryBenefits(territory) {
        // Apply benefits to guild members
    }
    
    getQuestTitle(type) {
        const titles = {
            defend_region: 'Defend the Region',
            collect_resources: 'Gather Resources',
            defeat_boss: 'Defeat the Boss',
            explore_area: 'Explore Unknown Territory',
            help_npcs: 'Help the Locals'
        };
        return titles[type] || 'Dynamic Quest';
    }
    
    getQuestDescription(type, region) {
        return `Complete objectives in ${region.name}`;
    }
    
    getQuestObjectives(type) {
        return [{ task: 'Complete objective', progress: 0, required: 1 }];
    }
    
    getQuestRewards(type) {
        return ['exp', 'gold', 'reputation'];
    }
    
    /**
     * Get system status
     */
    getStatus() {
        return {
            currentTier: this.currentTier,
            activeEvents: this.activeEvents.length,
            activeWorldBosses: this.activeWorldBosses.length,
            evolvedRegions: this.evolvedRegions.size,
            worldState: this.worldState,
            communityProgress: this.communityProgress
        };
    }
    
    /**
     * Cleanup
     */
    destroy() {
        if (this.eventInterval) {
            clearInterval(this.eventInterval);
        }
        this.activeEvents = [];
        this.activeWorldBosses = [];
    }
}
