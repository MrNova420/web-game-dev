import { logger } from '../core/Logger.js';
/**
 * GuildAndHousingSystem.js
 * Phase 6 - Guild Enhancement and Player Housing System
 * Combines guild management, housing, and marketplace features
 * ~800 lines
 */

export class GuildAndHousingSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // Guild system
        this.guilds = new Map();
        this.guildMembers = new Map(); // playerId -> guildId
        
        // Guild perks by level
        this.guildPerks = {
            1: { name: 'Basic Storage', benefit: 'storage_slots', value: 50 },
            5: { name: 'Enhanced Gathering', benefit: 'gathering_bonus', value: 1.1 },
            10: { name: 'Combat Bonus', benefit: 'damage_bonus', value: 1.05 },
            15: { name: 'Advanced Storage', benefit: 'storage_slots', value: 100 },
            20: { name: 'Guild Mount', benefit: 'special_mount', value: 'guild_wolf' },
            25: { name: 'Experience Boost', benefit: 'exp_bonus', value: 1.15 },
            30: { name: 'Elite Storage', benefit: 'storage_slots', value: 200 },
            35: { name: 'War Banner', benefit: 'guild_ability', value: 'war_banner' },
            40: { name: 'Master Perks', benefit: 'all_stats', value: 1.1 },
            50: { name: 'Legendary Status', benefit: 'prestige', value: 'max' }
        };
        
        // Player housing
        this.playerHouses = new Map();
        
        // House types and their capacities
        this.houseTypes = {
            cottage: {
                name: 'Cozy Cottage',
                cost: 10000,
                furnitureSlots: 20,
                decorationSlots: 30,
                size: 'small',
                rooms: ['main_room']
            },
            house: {
                name: 'Comfortable House',
                cost: 50000,
                furnitureSlots: 50,
                decorationSlots: 75,
                size: 'medium',
                rooms: ['living_room', 'bedroom', 'kitchen']
            },
            villa: {
                name: 'Luxurious Villa',
                cost: 200000,
                furnitureSlots: 100,
                decorationSlots: 150,
                size: 'large',
                rooms: ['living_room', 'bedroom', 'kitchen', 'study', 'garden']
            },
            mansion: {
                name: 'Grand Mansion',
                cost: 1000000,
                furnitureSlots: 200,
                decorationSlots: 300,
                size: 'massive',
                rooms: ['great_hall', 'bedroom', 'kitchen', 'study', 'garden', 'library', 'workshop']
            }
        };
        
        // Furniture catalog
        this.furnitureCatalog = {
            // Basic furniture
            wooden_chair: { name: 'Wooden Chair', cost: 50, category: 'seating', size: 1 },
            wooden_table: { name: 'Wooden Table', cost: 100, category: 'surface', size: 2 },
            simple_bed: { name: 'Simple Bed', cost: 200, category: 'bed', size: 3, benefit: { rest_bonus: 1.1 } },
            
            // Crafting stations
            basic_forge: { name: 'Basic Forge', cost: 1000, category: 'crafting', benefit: { smithing_bonus: 1.1 } },
            alchemy_table: { name: 'Alchemy Table', cost: 1500, category: 'crafting', benefit: { alchemy_bonus: 1.1 } },
            enchanting_station: { name: 'Enchanting Station', cost: 2000, category: 'crafting', benefit: { enchanting_bonus: 1.1 } },
            
            // Storage
            small_chest: { name: 'Small Chest', cost: 300, category: 'storage', benefit: { storage_slots: 20 } },
            large_chest: { name: 'Large Chest', cost: 1000, category: 'storage', benefit: { storage_slots: 50 } },
            vault: { name: 'Secure Vault', cost: 5000, category: 'storage', benefit: { storage_slots: 100 } },
            
            // Decorations
            painting: { name: 'Painting', cost: 500, category: 'decoration' },
            rug: { name: 'Rug', cost: 300, category: 'decoration' },
            chandelier: { name: 'Chandelier', cost: 1500, category: 'decoration', benefit: { mood: 1.05 } }
        };
        
        // Marketplace
        this.marketplace = {
            listings: [],
            transactions: [],
            fees: 0.05 // 5% transaction fee
        };
        
        // Guild wars
        this.guildWars = [];
        
        logger.info('🏰 GuildAndHousingSystem initialized');
    }
    
    /**
     * Create a guild
     */
    createGuild(founderId, guildName, tag) {
        // Check if name/tag is taken
        for (const guild of this.guilds.values()) {
            if (guild.name === guildName || guild.tag === tag) {
                return { success: false, reason: 'name_taken' };
            }
        }
        
        const guild = {
            id: `guild_${Date.now()}`,
            name: guildName,
            tag: tag,
            founder: founderId,
            leader: founderId,
            members: [founderId],
            level: 1,
            experience: 0,
            nextLevel: 1000,
            treasury: 0,
            perks: [],
            createdAt: Date.now(),
            hall: {
                level: 1,
                customization: [],
                storage: []
            },
            ranks: {
                [founderId]: 'leader'
            }
        };
        
        this.guilds.set(guild.id, guild);
        this.guildMembers.set(founderId, guild.id);
        
        logger.info(`🏰 Guild created: ${guildName} [${tag}]`);
        
        return { success: true, guildId: guild.id };
    }
    
    /**
     * Invite player to guild
     */
    inviteToGuild(guildId, inviterId, targetId) {
        const guild = this.guilds.get(guildId);
        if (!guild) return { success: false, reason: 'guild_not_found' };
        
        // Check permissions
        if (guild.ranks[inviterId] !== 'leader' && guild.ranks[inviterId] !== 'officer') {
            return { success: false, reason: 'no_permission' };
        }
        
        // Check if target already in guild
        if (this.guildMembers.has(targetId)) {
            return { success: false, reason: 'already_in_guild' };
        }
        
        // In real implementation, would send invitation to target
        logger.info(`📨 Guild invitation sent to ${targetId} from ${guild.name}`);
        
        return { success: true };
    }
    
    /**
     * Join guild
     */
    joinGuild(playerId, guildId) {
        const guild = this.guilds.get(guildId);
        if (!guild) return { success: false, reason: 'guild_not_found' };
        
        guild.members.push(playerId);
        guild.ranks[playerId] = 'member';
        this.guildMembers.set(playerId, guildId);
        
        logger.info(`✅ ${playerId} joined ${guild.name}`);
        
        return { success: true };
    }
    
    /**
     * Contribute to guild
     */
    contributeToGuild(playerId, amount, type = 'gold') {
        const guildId = this.guildMembers.get(playerId);
        if (!guildId) return { success: false, reason: 'not_in_guild' };
        
        const guild = this.guilds.get(guildId);
        
        if (type === 'gold') {
            guild.treasury += amount;
        } else if (type === 'experience') {
            guild.experience += amount;
            
            // Check for level up
            while (guild.experience >= guild.nextLevel) {
                guild.experience -= guild.nextLevel;
                guild.level++;
                guild.nextLevel = Math.floor(guild.nextLevel * 1.5);
                
                this.onGuildLevelUp(guild);
            }
        }
        
        logger.info(`💰 ${playerId} contributed ${amount} ${type} to ${guild.name}`);
        
        return { success: true };
    }
    
    /**
     * Handle guild level up
     */
    onGuildLevelUp(guild) {
        logger.info(`🎉 ${guild.name} reached level ${guild.level}!`);
        
        // Unlock perks
        const perk = this.guildPerks[guild.level];
        if (perk) {
            guild.perks.push(perk);
            logger.info(`✨ Unlocked perk: ${perk.name}`);
        }
        
        // Upgrade hall
        if (guild.level % 10 === 0) {
            guild.hall.level++;
            logger.info(`🏰 Guild hall upgraded to level ${guild.hall.level}!`);
        }
    }
    
    /**
     * Declare guild war
     */
    declareGuildWar(attackerGuildId, defenderGuildId) {
        const attacker = this.guilds.get(attackerGuildId);
        const defender = this.guilds.get(defenderGuildId);
        
        if (!attacker || !defender) {
            return { success: false, reason: 'guild_not_found' };
        }
        
        const war = {
            id: `war_${Date.now()}`,
            attacker: attackerGuildId,
            defender: defenderGuildId,
            attackerScore: 0,
            defenderScore: 0,
            startTime: Date.now(),
            endTime: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
            status: 'active'
        };
        
        this.guildWars.push(war);
        
        logger.info(`⚔️ Guild war declared: ${attacker.name} vs ${defender.name}!`);
        
        return { success: true, warId: war.id };
    }
    
    /**
     * Buy house
     */
    buyHouse(playerId, houseType) {
        if (this.playerHouses.has(playerId)) {
            return { success: false, reason: 'already_own_house' };
        }
        
        const houseConfig = this.houseTypes[houseType];
        if (!houseConfig) {
            return { success: false, reason: 'invalid_house_type' };
        }
        
        // In real implementation, would check player gold
        
        const house = {
            id: `house_${Date.now()}`,
            ownerId: playerId,
            type: houseType,
            config: houseConfig,
            furniture: [],
            decorations: [],
            visitors: [],
            permissions: {
                public: false,
                friends: true,
                guild: false
            },
            garden: {
                plants: [],
                harvestReady: 0
            },
            purchasedAt: Date.now()
        };
        
        this.playerHouses.set(playerId, house);
        
        logger.info(`🏠 ${playerId} purchased ${houseConfig.name}`);
        
        return { success: true, house };
    }
    
    /**
     * Place furniture in house
     */
    placeFurniture(playerId, furnitureId, position) {
        const house = this.playerHouses.get(playerId);
        if (!house) return { success: false, reason: 'no_house' };
        
        const furnitureItem = this.furnitureCatalog[furnitureId];
        if (!furnitureItem) return { success: false, reason: 'invalid_furniture' };
        
        // Check capacity
        if (house.furniture.length >= house.config.furnitureSlots) {
            return { success: false, reason: 'capacity_full' };
        }
        
        house.furniture.push({
            id: furnitureId,
            data: furnitureItem,
            position,
            placedAt: Date.now()
        });
        
        logger.info(`🪑 Placed ${furnitureItem.name} in house`);
        
        return { success: true };
    }
    
    /**
     * Plant in garden
     */
    plantInGarden(playerId, plantType) {
        const house = this.playerHouses.get(playerId);
        if (!house) return { success: false, reason: 'no_house' };
        
        if (!house.config.rooms.includes('garden')) {
            return { success: false, reason: 'no_garden' };
        }
        
        const plant = {
            type: plantType,
            plantedAt: Date.now(),
            harvestAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
            wateredAt: Date.now()
        };
        
        house.garden.plants.push(plant);
        
        logger.info(`🌱 Planted ${plantType} in garden`);
        
        return { success: true };
    }
    
    /**
     * Harvest garden
     */
    harvestGarden(playerId) {
        const house = this.playerHouses.get(playerId);
        if (!house) return { success: false, reason: 'no_house' };
        
        const currentTime = Date.now();
        const harvested = [];
        
        house.garden.plants = house.garden.plants.filter(plant => {
            if (currentTime >= plant.harvestAt) {
                harvested.push(plant.type);
                return false;
            }
            return true;
        });
        
        if (harvested.length > 0) {
            logger.info(`🌾 Harvested from garden: ${harvested.join(', ')}`);
        }
        
        return { success: true, harvested };
    }
    
    /**
     * List item on marketplace
     */
    listItem(sellerId, itemId, price, quantity = 1) {
        const listing = {
            id: `listing_${Date.now()}`,
            seller: sellerId,
            itemId,
            price,
            quantity,
            listedAt: Date.now(),
            expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
            status: 'active'
        };
        
        this.marketplace.listings.push(listing);
        
        logger.info(`🏪 Item listed: ${itemId} for ${price} gold`);
        
        return { success: true, listingId: listing.id };
    }
    
    /**
     * Buy from marketplace
     */
    buyFromMarketplace(buyerId, listingId) {
        const listing = this.marketplace.listings.find(l => l.id === listingId && l.status === 'active');
        
        if (!listing) {
            return { success: false, reason: 'listing_not_found' };
        }
        
        // Calculate with fee
        const totalCost = listing.price * (1 + this.marketplace.fees);
        const sellerProfit = listing.price * (1 - this.marketplace.fees);
        
        // In real implementation, would check buyer gold and transfer items
        
        listing.status = 'sold';
        listing.buyer = buyerId;
        listing.soldAt = Date.now();
        
        this.marketplace.transactions.push({
            listingId,
            buyer: buyerId,
            seller: listing.seller,
            price: listing.price,
            timestamp: Date.now()
        });
        
        logger.info(`💰 ${buyerId} bought ${listing.itemId} for ${totalCost} gold`);
        
        return { success: true, totalCost, sellerProfit };
    }
    
    /**
     * Search marketplace
     */
    searchMarketplace(filters = {}) {
        let results = this.marketplace.listings.filter(l => l.status === 'active');
        
        if (filters.itemId) {
            results = results.filter(l => l.itemId.includes(filters.itemId));
        }
        
        if (filters.maxPrice) {
            results = results.filter(l => l.price <= filters.maxPrice);
        }
        
        if (filters.minPrice) {
            results = results.filter(l => l.price >= filters.minPrice);
        }
        
        // Sort by price
        results.sort((a, b) => {
            if (filters.sortBy === 'price_asc') return a.price - b.price;
            if (filters.sortBy === 'price_desc') return b.price - a.price;
            return b.listedAt - a.listedAt; // Default: newest first
        });
        
        return results;
    }
    
    /**
     * Get guild benefits for player
     */
    getGuildBenefits(playerId) {
        const guildId = this.guildMembers.get(playerId);
        if (!guildId) return {};
        
        const guild = this.guilds.get(guildId);
        const benefits = {};
        
        guild.perks.forEach(perk => {
            if (!benefits[perk.benefit]) {
                benefits[perk.benefit] = perk.value;
            } else if (typeof perk.value === 'number') {
                benefits[perk.benefit] *= perk.value;
            }
        });
        
        return benefits;
    }
    
    /**
     * Get house benefits for player
     */
    getHouseBenefits(playerId) {
        const house = this.playerHouses.get(playerId);
        if (!house) return {};
        
        const benefits = {};
        
        house.furniture.forEach(furniture => {
            if (furniture.data.benefit) {
                Object.entries(furniture.data.benefit).forEach(([key, value]) => {
                    if (!benefits[key]) {
                        benefits[key] = value;
                    } else if (typeof value === 'number') {
                        benefits[key] += value - 1; // Stack bonuses
                    }
                });
            }
        });
        
        return benefits;
    }
    
    /**
     * Update system
     */
    update(deltaTime) {
        // Update guild wars
        this.guildWars.forEach(war => {
            if (war.status === 'active' && Date.now() >= war.endTime) {
                this.endGuildWar(war);
            }
        });
        
        // Clean up expired marketplace listings
        this.marketplace.listings = this.marketplace.listings.filter(listing => {
            if (listing.status === 'active' && Date.now() >= listing.expiresAt) {
                listing.status = 'expired';
                return false;
            }
            return listing.status === 'active';
        });
    }
    
    /**
     * End guild war
     */
    endGuildWar(war) {
        war.status = 'ended';
        
        const winner = war.attackerScore > war.defenderScore ? war.attacker : war.defender;
        war.winner = winner;
        
        const winnerGuild = this.guilds.get(winner);
        logger.info(`🏆 Guild war ended! Winner: ${winnerGuild.name}`);
        
        // Award rewards
        winnerGuild.treasury += 50000;
        winnerGuild.experience += 10000;
    }
    
    /**
     * Get system state
     */
    getState() {
        return {
            totalGuilds: this.guilds.size,
            totalHouses: this.playerHouses.size,
            activeListings: this.marketplace.listings.filter(l => l.status === 'active').length,
            activeWars: this.guildWars.filter(w => w.status === 'active').length
        };
    }
}
