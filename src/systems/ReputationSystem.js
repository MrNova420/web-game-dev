/**
 * Reputation System - Phase 3 RPG Core
 * Manages faction reputation, ranks, rewards, and special vendor access
 * Uses external Kenney UI assets for faction badges and emblems
 */

export class ReputationSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // Faction definitions with vibrant anime colors
        this.factions = this.initializeFactions();
        
        // Player reputation with each faction
        this.playerReputation = {};
        
        // Reputation thresholds for ranks
        this.reputationRanks = {
            HATED: -12000,
            HOSTILE: -6000,
            UNFRIENDLY: -3000,
            NEUTRAL: 0,
            FRIENDLY: 3000,
            HONORED: 6000,
            REVERED: 12000,
            EXALTED: 21000
        };
        
        // Rewards and perks per rank
        this.rankRewards = {};
        
        this.init();
    }
    
    init() {
        console.log('🏆 Initializing Reputation System...');
        
        // Initialize player reputation for all factions
        Object.keys(this.factions).forEach(factionId => {
            this.playerReputation[factionId] = 0; // Start neutral
        });
        
        this.setupRankRewards();
        
        console.log('✅ Reputation System initialized with', Object.keys(this.factions).length, 'factions');
    }
    
    /**
     * Initialize all game factions with anime-themed colors and descriptions
     */
    initializeFactions() {
        return {
            EMBER_KNIGHTS: {
                name: 'Ember Knights',
                description: 'Valiant warriors who protect the realm with fire magic',
                color: '#FF00FF', // Magenta
                secondaryColor: '#FFFF00', // Yellow
                icon: 'ember_knight_badge', // External Kenney asset
                location: 'Ember Citadel',
                leader: 'Commander Blaze',
                enemies: ['SHADOW_LEGION'],
                allies: ['CRYSTAL_MAGES'],
                benefits: {
                    vendors: ['Fire Weapons', 'Flame Armor', 'Phoenix Mounts'],
                    quests: ['Dragon Slayer', 'Inferno Trials'],
                    abilities: ['Flame Dash', 'Ember Shield']
                }
            },
            
            CRYSTAL_MAGES: {
                name: 'Crystal Mages',
                description: 'Mystical spellcasters who harness crystal energy',
                color: '#00FFFF', // Cyan
                secondaryColor: '#FFFFFF', // White
                icon: 'crystal_mage_emblem',
                location: 'Crystal Spire',
                leader: 'Archmage Prisma',
                enemies: ['SHADOW_LEGION'],
                allies: ['EMBER_KNIGHTS', 'NATURE_GUARDIANS'],
                benefits: {
                    vendors: ['Crystal Staves', 'Arcane Robes', 'Teleport Scrolls'],
                    quests: ['Crystal Corruption', 'Mana Wellspring'],
                    abilities: ['Crystal Barrier', 'Prismatic Beam']
                }
            },
            
            SHADOW_LEGION: {
                name: 'Shadow Legion',
                description: 'Dark warriors who embrace shadow magic and chaos',
                color: '#9900FF', // Purple
                secondaryColor: '#FF00FF', // Magenta
                icon: 'shadow_legion_mark',
                location: 'Dark Citadel',
                leader: 'Lord Umbra',
                enemies: ['EMBER_KNIGHTS', 'CRYSTAL_MAGES', 'NATURE_GUARDIANS'],
                allies: [],
                benefits: {
                    vendors: ['Shadow Blades', 'Dark Armor', 'Void Pets'],
                    quests: ['Embrace Darkness', 'Void Rituals'],
                    abilities: ['Shadow Step', 'Dark Pact']
                }
            },
            
            NATURE_GUARDIANS: {
                name: 'Nature Guardians',
                description: 'Protectors of the wild and masters of nature magic',
                color: '#00FF00', // Green
                secondaryColor: '#FFFF00', // Yellow
                icon: 'nature_guardian_seal',
                location: 'Verdant Grove',
                leader: 'Elder Sylvan',
                enemies: ['SHADOW_LEGION'],
                allies: ['CRYSTAL_MAGES'],
                benefits: {
                    vendors: ['Living Wood Bows', 'Leaf Armor', 'Beast Companions'],
                    quests: ['Forest Preservation', 'Ancient Tree'],
                    abilities: ['Nature\'s Blessing', 'Vine Entangle']
                }
            },
            
            SKY_PIRATES: {
                name: 'Sky Pirates',
                description: 'Free-spirited adventurers who rule the skies',
                color: '#FF6600', // Orange
                secondaryColor: '#FFFF00', // Yellow
                icon: 'sky_pirate_flag',
                location: 'Floating Islands',
                leader: 'Captain Zephyr',
                enemies: [],
                allies: [],
                benefits: {
                    vendors: ['Flying Mounts', 'Wind Weapons', 'Airship Parts'],
                    quests: ['Sky Treasure Hunt', 'Cloud Racing'],
                    abilities: ['Wind Glide', 'Sky Jump']
                }
            },
            
            MECHANICAL_GUILD: {
                name: 'Mechanical Guild',
                description: 'Inventors and engineers who blend magic with technology',
                color: '#FFFFFF', // White
                secondaryColor: '#00FFFF', // Cyan
                icon: 'mechanical_guild_gear',
                location: 'Steam City',
                leader: 'Guildmaster Cogsworth',
                enemies: [],
                allies: ['CRYSTAL_MAGES'],
                benefits: {
                    vendors: ['Mechanical Pets', 'Tech Weapons', 'Gadgets'],
                    quests: ['Invention Contest', 'Repair Automaton'],
                    abilities: ['Deploy Turret', 'Mechanical Repair']
                }
            },
            
            CELESTIAL_ORDER: {
                name: 'Celestial Order',
                description: 'Holy warriors blessed by celestial beings',
                color: '#FFFFFF', // White
                secondaryColor: '#FFFF00', // Golden
                icon: 'celestial_order_halo',
                location: 'Sky Temple',
                leader: 'High Priest Lumina',
                enemies: ['SHADOW_LEGION'],
                allies: ['EMBER_KNIGHTS', 'NATURE_GUARDIANS'],
                benefits: {
                    vendors: ['Holy Weapons', 'Light Armor', 'Angel Wings'],
                    quests: ['Divine Blessing', 'Purify Corruption'],
                    abilities: ['Divine Shield', 'Healing Light']
                }
            },
            
            MERCHANTS_GUILD: {
                name: 'Merchants Guild',
                description: 'Wealthy traders who control commerce across the realm',
                color: '#FFFF00', // Gold
                secondaryColor: '#FF6600', // Orange
                icon: 'merchants_guild_coin',
                location: 'Trade Hub',
                leader: 'Master Merchant Goldleaf',
                enemies: [],
                allies: ['SKY_PIRATES', 'MECHANICAL_GUILD'],
                benefits: {
                    vendors: ['Rare Items', 'Discounts', 'Exotic Goods'],
                    quests: ['Trading Routes', 'Caravan Escort'],
                    abilities: ['Bargaining Mastery', 'Lucky Find']
                }
            }
        };
    }
    
    /**
     * Setup rewards for each reputation rank
     */
    setupRankRewards() {
        this.rankRewards = {
            HATED: {
                description: 'Faction will attack on sight',
                discount: 0,
                questAccess: 0,
                vendorAccess: []
            },
            HOSTILE: {
                description: 'Faction is very unfriendly',
                discount: 0,
                questAccess: 0,
                vendorAccess: []
            },
            UNFRIENDLY: {
                description: 'Faction dislikes you',
                discount: 0,
                questAccess: 0,
                vendorAccess: []
            },
            NEUTRAL: {
                description: 'Faction has no opinion',
                discount: 0,
                questAccess: 10,
                vendorAccess: ['basic']
            },
            FRIENDLY: {
                description: 'Faction likes you',
                discount: 5,
                questAccess: 25,
                vendorAccess: ['basic', 'common']
            },
            HONORED: {
                description: 'Faction respects you greatly',
                discount: 10,
                questAccess: 50,
                vendorAccess: ['basic', 'common', 'rare'],
                title: 'Honored {factionName}'
            },
            REVERED: {
                description: 'Faction reveres your deeds',
                discount: 15,
                questAccess: 75,
                vendorAccess: ['basic', 'common', 'rare', 'epic'],
                title: 'Revered {factionName}',
                mount: true
            },
            EXALTED: {
                description: 'Highest honor with faction',
                discount: 25,
                questAccess: 100,
                vendorAccess: ['basic', 'common', 'rare', 'epic', 'legendary'],
                title: 'Exalted Champion of {factionName}',
                mount: true,
                tabard: true,
                factionAbility: true
            }
        };
    }
    
    /**
     * Gain reputation with a faction
     */
    gainReputation(factionId, amount, reason = '') {
        if (!this.factions[factionId]) {
            console.warn(`Unknown faction: ${factionId}`);
            return;
        }
        
        const oldRep = this.playerReputation[factionId];
        this.playerReputation[factionId] += amount;
        const newRep = this.playerReputation[factionId];
        
        const oldRank = this.getReputation Rank(oldRep);
        const newRank = this.getReputationRank(newRep);
        
        // Check if rank changed
        if (oldRank !== newRank) {
            this.onRankChanged(factionId, oldRank, newRank);
        }
        
        // Modify reputation with allied/enemy factions
        const faction = this.factions[factionId];
        
        // Allies gain reduced reputation
        if (faction.allies) {
            faction.allies.forEach(allyId => {
                if (this.factions[allyId]) {
                    this.playerReputation[allyId] += Math.floor(amount * 0.25);
                }
            });
        }
        
        // Enemies lose reputation
        if (faction.enemies) {
            faction.enemies.forEach(enemyId => {
                if (this.factions[enemyId]) {
                    this.playerReputation[enemyId] -= Math.floor(amount * 0.5);
                }
            });
        }
        
        console.log(`+${amount} reputation with ${this.factions[factionId].name}${reason ? ` (${reason})` : ''}`);
    }
    
    /**
     * Get current reputation rank with faction
     */
    getReputationRank(reputation) {
        if (reputation >= this.reputationRanks.EXALTED) return 'EXALTED';
        if (reputation >= this.reputationRanks.REVERED) return 'REVERED';
        if (reputation >= this.reputationRanks.HONORED) return 'HONORED';
        if (reputation >= this.reputationRanks.FRIENDLY) return 'FRIENDLY';
        if (reputation >= this.reputationRanks.NEUTRAL) return 'NEUTRAL';
        if (reputation >= this.reputationRanks.UNFRIENDLY) return 'UNFRIENDLY';
        if (reputation >= this.reputationRanks.HOSTILE) return 'HOSTILE';
        return 'HATED';
    }
    
    /**
     * Handle reputation rank changes
     */
    onRankChanged(factionId, oldRank, newRank) {
        const faction = this.factions[factionId];
        const rewards = this.rankRewards[newRank];
        
        console.log(`🎊 Reputation rank up with ${faction.name}: ${oldRank} → ${newRank}!`);
        
        // Grant rewards
        if (rewards.title) {
            const title = rewards.title.replace('{factionName}', faction.name);
            console.log(`🏆 New title unlocked: ${title}`);
        }
        
        if (rewards.mount) {
            console.log(`🐎 Faction mount unlocked!`);
        }
        
        if (rewards.tabard) {
            console.log(`👕 Faction tabard unlocked!`);
        }
        
        if (rewards.factionAbility) {
            console.log(`⚡ Faction ability unlocked!`);
        }
        
        // Show notification with magical effects
        if (this.gameEngine.magicalBackgroundSystem) {
            this.gameEngine.magicalBackgroundSystem.createSparkBurst(
                { x: 0, y: 2, z: 0 },
                faction.color,
                100
            );
        }
    }
    
    /**
     * Get player's current reputation info with a faction
     */
    getReputationInfo(factionId) {
        if (!this.factions[factionId]) return null;
        
        const faction = this.factions[factionId];
        const reputation = this.playerReputation[factionId];
        const rank = this.getReputationRank(reputation);
        const rewards = this.rankRewards[rank];
        
        // Calculate progress to next rank
        const rankKeys = Object.keys(this.reputationRanks);
        const currentRankIndex = rankKeys.indexOf(rank);
        const nextRank = rankKeys[currentRankIndex + 1];
        const nextRankThreshold = nextRank ? this.reputationRanks[nextRank] : null;
        
        let progress = 0;
        if (nextRankThreshold) {
            const currentThreshold = this.reputationRanks[rank];
            progress = ((reputation - currentThreshold) / (nextRankThreshold - currentThreshold)) * 100;
        }
        
        return {
            faction: faction,
            reputation: reputation,
            rank: rank,
            rewards: rewards,
            nextRank: nextRank,
            progress: Math.max(0, Math.min(100, progress))
        };
    }
    
    /**
     * Check if player can access faction vendor
     */
    canAccessVendor(factionId, vendorTier) {
        const info = this.getReputationInfo(factionId);
        if (!info) return false;
        
        return info.rewards.vendorAccess.includes(vendorTier);
    }
    
    /**
     * Get discount percentage for faction vendors
     */
    getVendorDiscount(factionId) {
        const info = this.getReputationInfo(factionId);
        return info ? info.rewards.discount : 0;
    }
    
    /**
     * Get all factions and their current reputation
     */
    getAllReputations() {
        const result = [];
        
        Object.keys(this.factions).forEach(factionId => {
            result.push(this.getReputationInfo(factionId));
        });
        
        return result.sort((a, b) => b.reputation - a.reputation);
    }
    
    /**
     * Update reputation system
     */
    update(deltaTime) {
        // Reputation system is mostly event-driven
        // Could add passive reputation decay here if needed
    }
}
