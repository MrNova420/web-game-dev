/**
 * Dynamic Event System - Phase 9
 * Manages world events, seasonal events, boss spawns, and special occasions
 * Uses external Kenney UI assets for event notifications
 */

export class DynamicEventSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // Event types with vibrant anime colors
        this.eventTypes = this.initializeEventTypes();
        this.activeEvents = [];
        this.eventHistory = [];
        this.eventCooldowns = new Map();
        
        // Event scheduling
        this.nextEventTime = 0;
        this.minEventInterval = 300; // 5 minutes
        this.maxEventInterval = 900; // 15 minutes
        
        this.init();
    }
    
    init() {
        console.log('🎉 Initializing Dynamic Event System...');
        this.scheduleNextEvent();
        console.log('✅ Dynamic Event System initialized');
    }
    
    /**
     * Initialize event types with anime-styled visuals
     */
    initializeEventTypes() {
        return {
            METEOR_SHOWER: {
                name: 'Meteor Shower',
                description: 'Meteors rain from the sky! Collect rare star fragments.',
                color: '#FFFF00',
                icon: 'meteor_icon',
                duration: 180, // 3 minutes
                cooldown: 3600, // 1 hour
                rewards: ['star_fragment', 'cosmic_dust', 'meteor_ore'],
                spawnRate: 5, // meteors per second
                externalAssets: {
                    particles: 'Kenney/meteor_particles',
                    sound: 'Freesound/meteor_impact'
                }
            },
            
            BOSS_INVASION: {
                name: 'Boss Invasion',
                description: 'A powerful boss has appeared! Defeat it for legendary loot.',
                color: '#FF0066',
                icon: 'boss_invasion_icon',
                duration: 600, // 10 minutes
                cooldown: 7200, // 2 hours
                bossTypes: ['DRAGON', 'DEMON_LORD', 'ANCIENT_GOLEM', 'KRAKEN'],
                rewards: ['legendary_weapon', 'boss_soul', 'unique_armor'],
                externalAssets: {
                    models: 'Mixamo/boss_creatures',
                    sound: 'Freesound/boss_roar'
                }
            },
            
            TREASURE_HUNT: {
                name: 'Treasure Hunt',
                description: 'Hidden treasures have appeared across the world!',
                color: '#FFFF00',
                icon: 'treasure_icon',
                duration: 300, // 5 minutes
                cooldown: 1800, // 30 minutes
                treasureCount: 10,
                rewards: ['gold_chest', 'rare_items', 'equipment'],
                externalAssets: {
                    models: 'Quaternius/treasure_chests',
                    particles: 'Kenney/sparkle_particles'
                }
            },
            
            DOUBLE_XP: {
                name: 'Double Experience',
                description: 'Gain double experience for all activities!',
                color: '#00FFFF',
                icon: 'xp_boost_icon',
                duration: 1800, // 30 minutes
                cooldown: 10800, // 3 hours
                multiplier: 2.0,
                externalAssets: {
                    ui: 'Kenney/xp_boost_banner'
                }
            },
            
            DOUBLE_LOOT: {
                name: 'Double Loot',
                description: 'Enemies drop twice as much loot!',
                color: '#00FF00',
                icon: 'loot_boost_icon',
                duration: 1800, // 30 minutes
                cooldown: 10800, // 3 hours
                multiplier: 2.0,
                externalAssets: {
                    ui: 'Kenney/loot_boost_banner'
                }
            },
            
            BLOOD_MOON: {
                name: 'Blood Moon',
                description: 'The moon turns red! Enemies are stronger but drop better loot.',
                color: '#FF0000',
                icon: 'blood_moon_icon',
                duration: 420, // 7 minutes
                cooldown: 14400, // 4 hours
                enemyMultiplier: 1.5,
                lootMultiplier: 3.0,
                externalAssets: {
                    skybox: 'PolyHaven/blood_moon_sky',
                    sound: 'Freesound/ominous_ambient'
                }
            },
            
            RAINBOW_STORM: {
                name: 'Rainbow Storm',
                description: 'A magical rainbow storm! All magic damage increased.',
                color: '#FF00FF',
                secondaryColor: '#00FFFF',
                icon: 'rainbow_icon',
                duration: 300, // 5 minutes
                cooldown: 5400, // 90 minutes
                magicDamageMultiplier: 1.5,
                externalAssets: {
                    particles: 'Kenney/rainbow_particles',
                    weather: 'rainbow_rain'
                }
            },
            
            SUPPLY_DROP: {
                name: 'Supply Drop',
                description: 'Supply crates are falling from the sky!',
                color: '#FFFFFF',
                icon: 'supply_drop_icon',
                duration: 180, // 3 minutes
                cooldown: 3600, // 1 hour
                crateCount: 20,
                rewards: ['potions', 'materials', 'consumables'],
                externalAssets: {
                    models: 'Quaternius/supply_crates',
                    particles: 'Kenney/parachute'
                }
            },
            
            FISHING_FRENZY: {
                name: 'Fishing Frenzy',
                description: 'Fish are biting like crazy! Catch rare fish easily.',
                color: '#00FFFF',
                icon: 'fishing_icon',
                duration: 900, // 15 minutes
                cooldown: 7200, // 2 hours
                catchRateMultiplier: 3.0,
                rareFishChance: 0.5,
                externalAssets: {
                    ui: 'Kenney/fishing_banner'
                }
            },
            
            MANA_SURGE: {
                name: 'Mana Surge',
                description: 'Magical energy floods the world! Unlimited mana.',
                color: '#9900FF',
                icon: 'mana_surge_icon',
                duration: 300, // 5 minutes
                cooldown: 10800, // 3 hours
                unlimitedMana: true,
                externalAssets: {
                    particles: 'Kenney/mana_particles',
                    sound: 'Freesound/magical_hum'
                }
            },
            
            PET_PARADE: {
                name: 'Pet Parade',
                description: 'Rare pets appear everywhere! Catch them while you can.',
                color: '#FF69B4',
                icon: 'pet_parade_icon',
                duration: 600, // 10 minutes
                cooldown: 14400, // 4 hours
                rarePetSpawnRate: 10,
                externalAssets: {
                    models: 'Mixamo/cute_creatures',
                    sound: 'Freesound/animal_sounds'
                }
            },
            
            GOLD_RUSH: {
                name: 'Gold Rush',
                description: 'Gold drops are tripled! Time to get rich!',
                color: '#FFFF00',
                icon: 'gold_rush_icon',
                duration: 1200, // 20 minutes
                cooldown: 10800, // 3 hours
                goldMultiplier: 3.0,
                externalAssets: {
                    particles: 'Kenney/coin_particles',
                    ui: 'Kenney/gold_banner'
                }
            },
            
            CHAOS_RIFT: {
                name: 'Chaos Rift',
                description: 'A rift to another dimension opens! Fight chaos monsters.',
                color: '#FF00FF',
                secondaryColor: '#9900FF',
                icon: 'chaos_rift_icon',
                duration: 600, // 10 minutes
                cooldown: 21600, // 6 hours
                portalCount: 5,
                chaosMonsters: ['VOID_BEAST', 'CHAOS_ELEMENTAL', 'RIFT_DEMON'],
                rewards: ['chaos_essence', 'void_crystal', 'dimensional_shard'],
                externalAssets: {
                    models: 'Quaternius/portal',
                    particles: 'Kenney/void_particles'
                }
            }
        };
    }
    
    /**
     * Schedule next random event
     */
    scheduleNextEvent() {
        const interval = this.minEventInterval + 
            Math.random() * (this.maxEventInterval - this.minEventInterval);
        this.nextEventTime = Date.now() / 1000 + interval;
        console.log(`📅 Next event scheduled in ${Math.floor(interval / 60)} minutes`);
    }
    
    /**
     * Start a specific event
     */
    startEvent(eventId, forced = false) {
        if (!this.eventTypes[eventId]) {
            console.warn(`Unknown event: ${eventId}`);
            return false;
        }
        
        const eventType = this.eventTypes[eventId];
        
        // Check cooldown
        if (!forced && this.eventCooldowns.has(eventId)) {
            const cooldownEnd = this.eventCooldowns.get(eventId);
            if (Date.now() / 1000 < cooldownEnd) {
                console.log(`Event ${eventType.name} is on cooldown`);
                return false;
            }
        }
        
        const event = {
            id: eventId,
            type: eventType,
            startTime: Date.now() / 1000,
            endTime: Date.now() / 1000 + eventType.duration,
            active: true
        };
        
        this.activeEvents.push(event);
        this.eventHistory.push({
            id: eventId,
            startTime: event.startTime,
            endTime: event.endTime
        });
        
        // Set cooldown
        this.eventCooldowns.set(eventId, event.endTime + eventType.cooldown);
        
        console.log(`🎉 Event started: ${eventType.name}!`);
        
        // Apply event effects
        this.applyEventEffects(event);
        
        // Create magical visual effect
        if (this.gameEngine.magicalBackgroundSystem) {
            this.gameEngine.magicalBackgroundSystem.createSparkBurst(
                { x: 0, y: 10, z: 0 },
                eventType.color,
                300
            );
        }
        
        return true;
    }
    
    /**
     * Apply event effects to the game
     */
    applyEventEffects(event) {
        const eventType = event.type;
        
        switch (event.id) {
            case 'DOUBLE_XP':
                // Apply XP multiplier
                if (this.gameEngine.player) {
                    this.gameEngine.player.xpMultiplier = eventType.multiplier;
                }
                break;
                
            case 'DOUBLE_LOOT':
                // Apply loot multiplier
                if (this.gameEngine.player) {
                    this.gameEngine.player.lootMultiplier = eventType.multiplier;
                }
                break;
                
            case 'BLOOD_MOON':
                // Increase enemy difficulty and loot
                if (this.gameEngine.enemyManager) {
                    this.gameEngine.enemyManager.difficultyMultiplier = eventType.enemyMultiplier;
                    this.gameEngine.enemyManager.lootMultiplier = eventType.lootMultiplier;
                }
                break;
                
            case 'MANA_SURGE':
                // Unlimited mana
                if (this.gameEngine.player) {
                    this.gameEngine.player.unlimitedMana = true;
                }
                break;
                
            case 'GOLD_RUSH':
                // Triple gold drops
                if (this.gameEngine.economySystem) {
                    this.gameEngine.economySystem.goldMultiplier = eventType.goldMultiplier;
                }
                break;
                
            case 'METEOR_SHOWER':
                // Spawn meteors
                this.spawnMeteors(eventType.spawnRate);
                break;
                
            case 'BOSS_INVASION':
                // Spawn boss
                this.spawnBoss(eventType.bossTypes);
                break;
                
            case 'TREASURE_HUNT':
                // Spawn treasure chests
                this.spawnTreasures(eventType.treasureCount);
                break;
                
            case 'CHAOS_RIFT':
                // Spawn chaos portals
                this.spawnChaosRifts(eventType.portalCount);
                break;
        }
    }
    
    /**
     * Remove event effects
     */
    removeEventEffects(event) {
        const eventType = event.type;
        
        switch (event.id) {
            case 'DOUBLE_XP':
                if (this.gameEngine.player) {
                    this.gameEngine.player.xpMultiplier = 1.0;
                }
                break;
                
            case 'DOUBLE_LOOT':
                if (this.gameEngine.player) {
                    this.gameEngine.player.lootMultiplier = 1.0;
                }
                break;
                
            case 'BLOOD_MOON':
                if (this.gameEngine.enemyManager) {
                    this.gameEngine.enemyManager.difficultyMultiplier = 1.0;
                    this.gameEngine.enemyManager.lootMultiplier = 1.0;
                }
                break;
                
            case 'MANA_SURGE':
                if (this.gameEngine.player) {
                    this.gameEngine.player.unlimitedMana = false;
                }
                break;
                
            case 'GOLD_RUSH':
                if (this.gameEngine.economySystem) {
                    this.gameEngine.economySystem.goldMultiplier = 1.0;
                }
                break;
        }
    }
    
    /**
     * End an active event
     */
    endEvent(event) {
        event.active = false;
        this.removeEventEffects(event);
        
        console.log(`Event ended: ${event.type.name}`);
        
        // Remove from active events
        const index = this.activeEvents.indexOf(event);
        if (index > -1) {
            this.activeEvents.splice(index, 1);
        }
    }
    
    /**
     * Spawn meteors for meteor shower event
     */
    spawnMeteors(spawnRate) {
        // Implementation would spawn meteor objects
        console.log(`☄️ Spawning meteors at rate: ${spawnRate}/second`);
    }
    
    /**
     * Spawn boss for boss invasion event
     */
    spawnBoss(bossTypes) {
        const bossType = bossTypes[Math.floor(Math.random() * bossTypes.length)];
        console.log(`👹 Boss spawned: ${bossType}`);
    }
    
    /**
     * Spawn treasure chests
     */
    spawnTreasures(count) {
        console.log(`💎 Spawning ${count} treasure chests`);
    }
    
    /**
     * Spawn chaos rifts
     */
    spawnChaosRifts(count) {
        console.log(`🌀 Spawning ${count} chaos rifts`);
    }
    
    /**
     * Get active events
     */
    getActiveEvents() {
        return this.activeEvents.filter(e => e.active);
    }
    
    /**
     * Get upcoming events
     */
    getUpcomingEvents() {
        const now = Date.now() / 1000;
        const events = [];
        
        Object.keys(this.eventTypes).forEach(eventId => {
            const cooldownEnd = this.eventCooldowns.get(eventId) || 0;
            if (cooldownEnd <= now) {
                events.push({
                    id: eventId,
                    type: this.eventTypes[eventId],
                    availableIn: 0
                });
            } else {
                events.push({
                    id: eventId,
                    type: this.eventTypes[eventId],
                    availableIn: cooldownEnd - now
                });
            }
        });
        
        return events.sort((a, b) => a.availableIn - b.availableIn);
    }
    
    /**
     * Update event system
     */
    update(deltaTime) {
        const now = Date.now() / 1000;
        
        // Check if it's time for next event
        if (now >= this.nextEventTime) {
            // Pick random event
            const availableEvents = Object.keys(this.eventTypes).filter(eventId => {
                const cooldownEnd = this.eventCooldowns.get(eventId) || 0;
                return cooldownEnd <= now;
            });
            
            if (availableEvents.length > 0) {
                const randomEvent = availableEvents[Math.floor(Math.random() * availableEvents.length)];
                this.startEvent(randomEvent);
            }
            
            this.scheduleNextEvent();
        }
        
        // Update active events
        this.activeEvents.forEach(event => {
            if (event.active && now >= event.endTime) {
                this.endEvent(event);
            }
        });
    }
}
