import { logger } from "./Logger.js";
/**
 * InputManager - Handles keyboard and mouse input
 */

export class InputManager {
    constructor(canvas, engine) {
        this.canvas = canvas;
        this.engine = engine;
        
        this.keys = {};
        this.mousePosition = { x: 0, y: 0 };
        this.mouseButtons = {};
        
        this.init();
    }
    
    init() {
        // Keyboard events
        window.addEventListener('keydown', (e) => this.onKeyDown(e));
        window.addEventListener('keyup', (e) => this.onKeyUp(e));
        
        // Mouse events
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
        
        // Ability buttons
        const abilityButtons = document.querySelectorAll('.ability-button');
        abilityButtons.forEach(button => {
            button.addEventListener('click', () => {
                const key = button.getAttribute('data-key');
                if (key) {
                    this.engine.useAbility(key);
                }
            });
        });
        
        // Inventory toggle button
        const inventoryToggle = document.getElementById('inventory-toggle');
        if (inventoryToggle) {
            inventoryToggle.addEventListener('click', () => {
                this.toggleInventory();
            });
        }
        
        logger.info('🎮 Input manager initialized');
    }
    
    onKeyDown(event) {
        this.keys[event.key.toLowerCase()] = true;
        
        // Handle movement keys
        if (this.engine.player) {
            switch(event.key.toLowerCase()) {
                case 'w':
                case 'arrowup':
                    this.engine.player.moveForward = true;
                    break;
                case 's':
                case 'arrowdown':
                    this.engine.player.moveBackward = true;
                    break;
                case 'a':
                case 'arrowleft':
                    this.engine.player.moveLeft = true;
                    break;
                case 'd':
                case 'arrowright':
                    this.engine.player.moveRight = true;
                    break;
            }
        }
        
        // Handle ability keys (Q, W, E, R)
        if (['q', 'e', 'r'].includes(event.key.toLowerCase())) {
            this.engine.useAbility(event.key.toLowerCase());
            event.preventDefault();
        }
        
        // Handle inventory toggle (I key)
        if (event.key.toLowerCase() === 'i') {
            this.toggleInventory();
            event.preventDefault();
        }
    }
    
    onKeyUp(event) {
        this.keys[event.key.toLowerCase()] = false;
        
        // Handle movement keys
        if (this.engine.player) {
            switch(event.key.toLowerCase()) {
                case 'w':
                case 'arrowup':
                    this.engine.player.moveForward = false;
                    break;
                case 's':
                case 'arrowdown':
                    this.engine.player.moveBackward = false;
                    break;
                case 'a':
                case 'arrowleft':
                    this.engine.player.moveLeft = false;
                    break;
                case 'd':
                case 'arrowright':
                    this.engine.player.moveRight = false;
                    break;
            }
        }
    }
    
    onMouseMove(event) {
        const rect = this.canvas.getBoundingClientRect();
        this.mousePosition.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mousePosition.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }
    
    onMouseDown(event) {
        this.mouseButtons[event.button] = true;
        
        // Left click - basic attack
        if (event.button === 0 && this.engine.player) {
            this.engine.player.attack();
        }
    }
    
    onMouseUp(event) {
        this.mouseButtons[event.button] = false;
    }
    
    isKeyPressed(key) {
        return this.keys[key.toLowerCase()] || false;
    }
    
    isMouseButtonPressed(button) {
        return this.mouseButtons[button] || false;
    }
    
    toggleInventory() {
        const inventoryPanel = document.getElementById('inventory-panel');
        if (inventoryPanel) {
            inventoryPanel.classList.toggle('visible');
            
            // Update inventory content if visible
            if (inventoryPanel.classList.contains('visible')) {
                this.updateInventoryDisplay();
            }
        }
    }
    
    updateInventoryDisplay() {
        const inventoryContent = document.getElementById('inventory-content');
        const inventory = this.engine.inventorySystem;
        
        if (!inventoryContent || !inventory) return;
        
        inventoryContent.innerHTML = '';
        
        // Equipment section
        const equipmentSection = document.createElement('div');
        equipmentSection.innerHTML = '<h4>Equipment</h4>';
        Object.keys(inventory.equipment).forEach(slot => {
            const item = inventory.equipment[slot];
            const slotDiv = document.createElement('div');
            slotDiv.className = 'inventory-item';
            slotDiv.textContent = `${slot}: ${item ? item.name : 'Empty'}`;
            if (item) {
                slotDiv.style.color = item.color;
            }
            equipmentSection.appendChild(slotDiv);
        });
        inventoryContent.appendChild(equipmentSection);
        
        // Items section
        const itemsSection = document.createElement('div');
        itemsSection.innerHTML = '<h4>Items</h4>';
        if (inventory.items.length === 0) {
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'inventory-item';
            emptyDiv.textContent = 'No items';
            emptyDiv.style.opacity = '0.6';
            itemsSection.appendChild(emptyDiv);
        } else {
            inventory.items.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'inventory-item';
                itemDiv.style.color = item.color;
                itemDiv.textContent = item.name + (item.stack ? ` x${item.stack}` : '');
                itemsSection.appendChild(itemDiv);
            });
        }
        inventoryContent.appendChild(itemsSection);
    }
}
