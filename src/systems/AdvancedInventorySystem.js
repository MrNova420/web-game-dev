/**
 * AdvancedInventorySystem - Complete inventory management with categories
 * Handles equipment, consumables, materials, and quest items
 */

export class AdvancedInventorySystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        this.maxSlots = 50;
        this.inventory = {
            equipment: [],
            consumables: [],
            materials: [],
            questItems: [],
            misc: []
        };
        
        this.equipped = {
            weapon: null,
            offhand: null,
            helmet: null,
            chest: null,
            legs: null,
            boots: null,
            gloves: null,
            accessory1: null,
            accessory2: null
        };
        
        this.itemDatabase = this.createItemDatabase();
        
        this.init();
    }
    
    init() {
        console.log('🎒 Advanced Inventory System initialized');
    }
    
    createItemDatabase() {
        return {
            // Weapons
            iron_sword: {
                name: 'Iron Sword',
                type: 'weapon',
                slot: 'weapon',
                rarity: 'common',
                stats: { attack: 10 },
                value: 100,
                icon: '⚔️'
            },
            steel_sword: {
                name: 'Steel Sword',
                type: 'weapon',
                slot: 'weapon',
                rarity: 'uncommon',
                stats: { attack: 20 },
                value: 250,
                icon: '⚔️'
            },
            mage_staff: {
                name: 'Mage Staff',
                type: 'weapon',
                slot: 'weapon',
                rarity: 'uncommon',
                stats: { attack: 15, mp: 20 },
                value: 200,
                icon: '🪄'
            },
            
            // Armor
            leather_armor: {
                name: 'Leather Armor',
                type: 'equipment',
                slot: 'chest',
                rarity: 'common',
                stats: { defense: 5 },
                value: 80,
                icon: '🥼'
            },
            iron_armor: {
                name: 'Iron Armor',
                type: 'equipment',
                slot: 'chest',
                rarity: 'uncommon',
                stats: { defense: 12 },
                value: 200,
                icon: '🥼'
            },
            
            // Consumables
            health_potion: {
                name: 'Health Potion',
                type: 'consumable',
                rarity: 'common',
                effect: 'heal',
                value: 50,
                hp: 50,
                stackable: true,
                maxStack: 99,
                icon: '🧪'
            },
            mana_potion: {
                name: 'Mana Potion',
                type: 'consumable',
                rarity: 'common',
                effect: 'restore_mana',
                value: 40,
                mp: 50,
                stackable: true,
                maxStack: 99,
                icon: '💙'
            },
            elixir: {
                name: 'Elixir',
                type: 'consumable',
                rarity: 'rare',
                effect: 'full_restore',
                value: 200,
                stackable: true,
                maxStack: 10,
                icon: '🍷'
            },
            
            // Materials
            iron_ore: {
                name: 'Iron Ore',
                type: 'material',
                rarity: 'common',
                value: 10,
                stackable: true,
                maxStack: 999,
                icon: '🪨'
            },
            wood: {
                name: 'Wood',
                type: 'material',
                rarity: 'common',
                value: 5,
                stackable: true,
                maxStack: 999,
                icon: '🪵'
            },
            crystal: {
                name: 'Magic Crystal',
                type: 'material',
                rarity: 'rare',
                value: 100,
                stackable: true,
                maxStack: 99,
                icon: '💎'
            }
        };
    }
    
    addItem(itemId, quantity = 1) {
        const itemData = this.itemDatabase[itemId];
        if (!itemData) {
            console.error(`Item ${itemId} not found`);
            return false;
        }
        
        // Check inventory space
        const category = this.inventory[itemData.type] || this.inventory.misc;
        
        // Handle stackable items
        if (itemData.stackable) {
            const existingItem = category.find(item => item.id === itemId);
            if (existingItem) {
                existingItem.quantity += quantity;
                existingItem.quantity = Math.min(existingItem.quantity, itemData.maxStack || 99);
                console.log(`Added ${quantity} ${itemData.name} (total: ${existingItem.quantity})`);
                return true;
            }
        }
        
        // Add new item
        const newItem = {
            id: itemId,
            ...itemData,
            quantity: itemData.stackable ? quantity : 1
        };
        
        category.push(newItem);
        
        console.log(`Added ${itemData.name} to inventory`);
        
        // Show notification
        if (this.gameEngine.modernUISystem) {
            this.gameEngine.modernUISystem.showNotification(
                `Obtained: ${itemData.icon} ${itemData.name}`,
                'success',
                2000
            );
        }
        
        return true;
    }
    
    removeItem(itemId, quantity = 1) {
        for (const category in this.inventory) {
            const items = this.inventory[category];
            const index = items.findIndex(item => item.id === itemId);
            
            if (index !== -1) {
                const item = items[index];
                
                if (item.stackable) {
                    item.quantity -= quantity;
                    if (item.quantity <= 0) {
                        items.splice(index, 1);
                    }
                } else {
                    items.splice(index, 1);
                }
                
                return true;
            }
        }
        
        return false;
    }
    
    equipItem(itemId) {
        // Find item in inventory
        let item = null;
        let category = null;
        
        for (const cat in this.inventory) {
            const found = this.inventory[cat].find(i => i.id === itemId);
            if (found) {
                item = found;
                category = cat;
                break;
            }
        }
        
        if (!item || !item.slot) {
            console.error('Item cannot be equipped');
            return false;
        }
        
        // Unequip current item in slot
        if (this.equipped[item.slot]) {
            this.unequipItem(item.slot);
        }
        
        // Equip new item
        this.equipped[item.slot] = item;
        this.removeItem(itemId, 1);
        
        // Apply stats
        this.applyEquipmentStats();
        
        console.log(`Equipped ${item.name}`);
        
        if (this.gameEngine.modernUISystem) {
            this.gameEngine.modernUISystem.showNotification(
                `Equipped: ${item.icon} ${item.name}`,
                'success',
                2000
            );
        }
        
        return true;
    }
    
    unequipItem(slot) {
        const item = this.equipped[slot];
        if (!item) return false;
        
        this.equipped[slot] = null;
        this.addItem(item.id, 1);
        
        // Recalculate stats
        this.applyEquipmentStats();
        
        console.log(`Unequipped ${item.name}`);
        
        return true;
    }
    
    applyEquipmentStats() {
        if (!this.gameEngine.player) return;
        
        // Reset to base stats
        const player = this.gameEngine.player;
        
        // Apply equipment bonuses
        let bonusAttack = 0;
        let bonusDefense = 0;
        let bonusHp = 0;
        let bonusMp = 0;
        
        for (const slot in this.equipped) {
            const item = this.equipped[slot];
            if (item && item.stats) {
                bonusAttack += item.stats.attack || 0;
                bonusDefense += item.stats.defense || 0;
                bonusHp += item.stats.hp || 0;
                bonusMp += item.stats.mp || 0;
            }
        }
        
        // Apply bonuses (simplified)
        console.log(`Equipment bonuses: +${bonusAttack} ATK, +${bonusDefense} DEF`);
    }
    
    useConsumable(itemId) {
        const item = this.inventory.consumables.find(i => i.id === itemId);
        if (!item) {
            console.error('Consumable not found');
            return false;
        }
        
        // Apply effect
        if (this.gameEngine.player) {
            const player = this.gameEngine.player;
            
            switch (item.effect) {
                case 'heal':
                    player.stats.hp = Math.min(
                        player.stats.hp + item.hp,
                        player.stats.maxHp
                    );
                    console.log(`Restored ${item.hp} HP`);
                    break;
                    
                case 'restore_mana':
                    player.stats.mp = Math.min(
                        player.stats.mp + item.mp,
                        player.stats.maxMp
                    );
                    console.log(`Restored ${item.mp} MP`);
                    break;
                    
                case 'full_restore':
                    player.stats.hp = player.stats.maxHp;
                    player.stats.mp = player.stats.maxMp;
                    console.log('Fully restored HP and MP');
                    break;
            }
        }
        
        this.removeItem(itemId, 1);
        
        return true;
    }
    
    getTotalItemCount() {
        let total = 0;
        for (const category in this.inventory) {
            total += this.inventory[category].length;
        }
        return total;
    }
    
    getInventoryValue() {
        let total = 0;
        for (const category in this.inventory) {
            this.inventory[category].forEach(item => {
                total += item.value * (item.quantity || 1);
            });
        }
        return total;
    }
    
    sortInventory(category) {
        if (!this.inventory[category]) return;
        
        this.inventory[category].sort((a, b) => {
            // Sort by rarity, then name
            const rarityOrder = { common: 0, uncommon: 1, rare: 2, epic: 3, legendary: 4 };
            const rarityDiff = (rarityOrder[b.rarity] || 0) - (rarityOrder[a.rarity] || 0);
            
            if (rarityDiff !== 0) return rarityDiff;
            return a.name.localeCompare(b.name);
        });
    }
    
    update(deltaTime) {
        // Update item effects, buffs, etc.
    }
    
    dispose() {
        console.log('🎒 Advanced Inventory System disposed');
    }
}
