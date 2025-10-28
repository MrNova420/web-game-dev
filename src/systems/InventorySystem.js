/**
 * InventorySystem - Manages player inventory and equipment
 * Handles items, equipment slots, and item management
 */

export class InventorySystem {
    constructor(engine) {
        this.engine = engine;
        this.maxSlots = 30;
        this.items = [];
        this.equipment = {
            weapon: null,
            armor: null,
            accessory1: null,
            accessory2: null
        };
        
        // Item rarities
        this.rarities = {
            common: { color: '#ffffff', multiplier: 1.0 },
            uncommon: { color: '#52b788', multiplier: 1.2 },
            rare: { color: '#66ccff', multiplier: 1.5 },
            epic: { color: '#c77dff', multiplier: 2.0 },
            legendary: { color: '#ffd60a', multiplier: 3.0 }
        };
        
        console.log('🎒 Inventory System initialized');
    }
    
    addItem(item) {
        if (this.items.length >= this.maxSlots) {
            console.log('Inventory full!');
            return false;
        }
        
        // Stack consumables
        if (item.type === 'consumable') {
            const existing = this.items.find(i => 
                i.id === item.id && i.stack < i.maxStack
            );
            if (existing) {
                existing.stack++;
                this.updateUI();
                return true;
            }
        }
        
        this.items.push(item);
        this.updateUI();
        this.showItemPickup(item);
        return true;
    }
    
    removeItem(itemId) {
        const index = this.items.findIndex(item => item.id === itemId);
        if (index !== -1) {
            this.items.splice(index, 1);
            this.updateUI();
            return true;
        }
        return false;
    }
    
    equipItem(itemId) {
        const item = this.items.find(i => i.id === itemId);
        if (!item || !item.slot) return false;
        
        // Unequip current item in slot
        if (this.equipment[item.slot]) {
            this.unequipItem(item.slot);
        }
        
        // Equip new item
        this.equipment[item.slot] = item;
        this.removeItem(itemId);
        
        // Apply stats
        this.applyEquipmentStats(item, true);
        
        console.log(`Equipped ${item.name}`);
        this.updateUI();
        return true;
    }
    
    unequipItem(slot) {
        const item = this.equipment[slot];
        if (!item) return false;
        
        // Add back to inventory
        this.items.push(item);
        
        // Remove stats
        this.applyEquipmentStats(item, false);
        
        this.equipment[slot] = null;
        console.log(`Unequipped ${item.name}`);
        this.updateUI();
        return true;
    }
    
    applyEquipmentStats(item, apply) {
        const player = this.engine.player;
        const multiplier = apply ? 1 : -1;
        
        if (item.stats) {
            if (item.stats.attack) {
                player.stats.attack += item.stats.attack * multiplier;
            }
            if (item.stats.defense) {
                player.stats.defense += item.stats.defense * multiplier;
            }
            if (item.stats.maxHp) {
                player.stats.maxHp += item.stats.maxHp * multiplier;
                if (apply) {
                    player.stats.hp = Math.min(player.stats.hp, player.stats.maxHp);
                }
            }
            if (item.stats.maxMp) {
                player.stats.maxMp += item.stats.maxMp * multiplier;
                if (apply) {
                    player.stats.mp = Math.min(player.stats.mp, player.stats.maxMp);
                }
            }
            if (item.stats.speed) {
                player.stats.speed += item.stats.speed * multiplier;
            }
        }
        
        this.engine.updatePlayerUI();
    }
    
    useConsumable(itemId) {
        const item = this.items.find(i => i.id === itemId);
        if (!item || item.type !== 'consumable') return false;
        
        const player = this.engine.player;
        
        // Apply consumable effects
        if (item.effect === 'heal_hp') {
            player.stats.hp = Math.min(
                player.stats.hp + item.value,
                player.stats.maxHp
            );
            this.showEffect('❤️ +' + item.value + ' HP', '#ff6b9d');
        } else if (item.effect === 'restore_mp') {
            player.stats.mp = Math.min(
                player.stats.mp + item.value,
                player.stats.maxMp
            );
            this.showEffect('💙 +' + item.value + ' MP', '#66ccff');
        } else if (item.effect === 'buff_attack') {
            player.stats.attack += item.value;
            setTimeout(() => {
                player.stats.attack -= item.value;
            }, item.duration * 1000);
            this.showEffect('⚔️ Attack +' + item.value, '#ffd60a');
        }
        
        // Reduce stack or remove
        if (item.stack > 1) {
            item.stack--;
        } else {
            this.removeItem(itemId);
        }
        
        this.engine.updatePlayerUI();
        return true;
    }
    
    generateLoot(floor, rarity = null) {
        // Determine rarity if not specified
        if (!rarity) {
            const rand = Math.random();
            if (rand < 0.50) rarity = 'common';
            else if (rand < 0.75) rarity = 'uncommon';
            else if (rand < 0.90) rarity = 'rare';
            else if (rand < 0.97) rarity = 'epic';
            else rarity = 'legendary';
        }
        
        const rarityData = this.rarities[rarity];
        const baseStats = 10 + floor * 2;
        const statValue = Math.floor(baseStats * rarityData.multiplier);
        
        // Random item type
        const types = ['weapon', 'armor', 'accessory', 'consumable'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        let item = {
            id: `item_${Date.now()}_${Math.random()}`,
            rarity: rarity,
            type: type,
            level: floor,
            color: rarityData.color
        };
        
        switch (type) {
            case 'weapon':
                item.name = this.generateWeaponName(rarity);
                item.slot = 'weapon';
                item.stats = {
                    attack: statValue
                };
                break;
                
            case 'armor':
                item.name = this.generateArmorName(rarity);
                item.slot = 'armor';
                item.stats = {
                    defense: statValue,
                    maxHp: statValue * 5
                };
                break;
                
            case 'accessory':
                item.name = this.generateAccessoryName(rarity);
                item.slot = Math.random() < 0.5 ? 'accessory1' : 'accessory2';
                item.stats = {
                    maxMp: statValue * 3,
                    speed: Math.floor(statValue * 0.3)
                };
                break;
                
            case 'consumable':
                const consumables = [
                    { name: 'Health Potion', effect: 'heal_hp', value: 50 },
                    { name: 'Mana Potion', effect: 'restore_mp', value: 50 },
                    { name: 'Attack Elixir', effect: 'buff_attack', value: 10, duration: 30 }
                ];
                const consumable = consumables[Math.floor(Math.random() * consumables.length)];
                item.name = consumable.name;
                item.effect = consumable.effect;
                item.value = Math.floor(consumable.value * rarityData.multiplier);
                item.duration = consumable.duration;
                item.stack = 1;
                item.maxStack = 99;
                break;
        }
        
        return item;
    }
    
    generateWeaponName(rarity) {
        const prefixes = ['Smoke', 'Shadow', 'Crystal', 'Void', 'Dream', 'Twilight'];
        const bases = ['Blade', 'Staff', 'Dagger', 'Scythe', 'Wand'];
        const suffixes = ['of Power', 'of Wisdom', 'of Speed', 'of the Ancients', 'of Eternity'];
        
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const base = bases[Math.floor(Math.random() * bases.length)];
        
        if (rarity === 'legendary' || rarity === 'epic') {
            const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
            return `${prefix} ${base} ${suffix}`;
        }
        
        return `${prefix} ${base}`;
    }
    
    generateArmorName(rarity) {
        const prefixes = ['Emberveil', 'Mystic', 'Ethereal', 'Divine', 'Corrupted'];
        const bases = ['Robes', 'Armor', 'Vestments', 'Cloak', 'Mantle'];
        
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const base = bases[Math.floor(Math.random() * bases.length)];
        
        return `${prefix} ${base}`;
    }
    
    generateAccessoryName(rarity) {
        const prefixes = ['Enchanted', 'Blessed', 'Cursed', 'Ancient', 'Radiant'];
        const bases = ['Ring', 'Amulet', 'Talisman', 'Charm', 'Pendant'];
        
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const base = bases[Math.floor(Math.random() * bases.length)];
        
        return `${prefix} ${base}`;
    }
    
    showItemPickup(item) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 150px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.9);
            border: 2px solid ${item.color};
            border-radius: 10px;
            padding: 15px 30px;
            color: ${item.color};
            font-size: 1.2em;
            font-weight: bold;
            z-index: 9999;
            animation: slideDown 2s ease-out;
            box-shadow: 0 0 20px ${item.color}80;
        `;
        notification.textContent = `✨ ${item.name}`;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 2000);
    }
    
    showEffect(text, color) {
        const effect = document.createElement('div');
        effect.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: ${color};
            font-size: 2em;
            font-weight: bold;
            z-index: 9999;
            animation: floatUp 1s ease-out;
            text-shadow: 0 0 10px ${color};
        `;
        effect.textContent = text;
        
        document.body.appendChild(effect);
        
        setTimeout(() => {
            if (effect.parentNode) {
                document.body.removeChild(effect);
            }
        }, 1000);
    }
    
    updateUI() {
        // Update inventory UI if visible
        const inventoryPanel = document.getElementById('inventory-panel');
        if (inventoryPanel && inventoryPanel.classList.contains('visible')) {
            const inputManager = window.gameEngine?.inputManager;
            if (inputManager && inputManager.updateInventoryDisplay) {
                inputManager.updateInventoryDisplay();
            }
        }
    }
    
    renderInventory(container) {
        container.innerHTML = '<h3>Inventory</h3>';
        
        // Equipment slots
        const equipmentDiv = document.createElement('div');
        equipmentDiv.innerHTML = '<h4>Equipment</h4>';
        Object.keys(this.equipment).forEach(slot => {
            const item = this.equipment[slot];
            const slotDiv = document.createElement('div');
            slotDiv.textContent = `${slot}: ${item ? item.name : 'Empty'}`;
            equipmentDiv.appendChild(slotDiv);
        });
        container.appendChild(equipmentDiv);
        
        // Items
        const itemsDiv = document.createElement('div');
        itemsDiv.innerHTML = '<h4>Items</h4>';
        this.items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.style.color = item.color;
            itemDiv.textContent = item.name + (item.stack ? ` x${item.stack}` : '');
            itemsDiv.appendChild(itemDiv);
        });
        container.appendChild(itemsDiv);
    }
    
    getSaveData() {
        return {
            items: this.items,
            equipment: this.equipment
        };
    }
    
    loadSaveData(data) {
        if (data.items) this.items = data.items;
        if (data.equipment) this.equipment = data.equipment;
        
        // Reapply equipment stats
        Object.values(this.equipment).forEach(item => {
            if (item) {
                this.applyEquipmentStats(item, true);
            }
        });
        
        this.updateUI();
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        0% { opacity: 0; transform: translate(-50%, -50px); }
        20% { opacity: 1; transform: translate(-50%, 0); }
        80% { opacity: 1; transform: translate(-50%, 0); }
        100% { opacity: 0; transform: translate(-50%, 20px); }
    }
    
    @keyframes floatUp {
        0% { opacity: 0; transform: translate(-50%, -50%); }
        20% { opacity: 1; transform: translate(-50%, -60%); }
        100% { opacity: 0; transform: translate(-50%, -100%); }
    }
`;
document.head.appendChild(style);
