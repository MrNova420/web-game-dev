import * as THREE from 'three';

/**
 * Survival System - Hunger, Thirst, Temperature, Health, Stamina
 * Complete survival mechanics for immersive gameplay
 */
export class SurvivalSystem {
    constructor(player) {
        this.player = player;
        
        // Survival stats (0-100)
        this.stats = {
            health: 100,
            maxHealth: 100,
            hunger: 100,
            maxHunger: 100,
            thirst: 100,
            maxThirst: 100,
            stamina: 100,
            maxStamina: 100,
            temperature: 37, // Body temperature (Celsius)
            energy: 100,
            maxEnergy: 100
        };
        
        // Decay rates (per second)
        this.decayRates = {
            hunger: 0.1, // Lose 0.1 hunger per second
            thirst: 0.15, // Lose 0.15 thirst per second (faster than hunger)
            stamina: 5, // Lose 5 stamina per second when sprinting
            staminaRegen: 10, // Regen 10 stamina per second when not sprinting
            energy: 0.05 // Lose energy slowly over time
        };
        
        // Status effects
        this.statusEffects = {
            starving: false,
            dehydrated: false,
            exhausted: false,
            freezing: false,
            overheating: false,
            wellFed: false,
            hydrated: false,
            energized: false
        };
        
        // Environmental temperature
        this.environmentalTemp = 20; // Default comfortable temperature
        
        this.initialize();
    }
    
    initialize() {
        // Start with full stats
        this.stats.health = this.stats.maxHealth;
        this.stats.hunger = this.stats.maxHunger;
        this.stats.thirst = this.stats.maxThirst;
        this.stats.stamina = this.stats.maxStamina;
        this.stats.energy = this.stats.maxEnergy;
    }
    
    eat(foodItem) {
        // Restore hunger based on food type
        const hungerRestore = foodItem.hungerValue || 20;
        this.stats.hunger = Math.min(this.stats.hunger + hungerRestore, this.stats.maxHunger);
        
        // Some foods also restore health
        if (foodItem.healthValue) {
            this.stats.health = Math.min(this.stats.health + foodItem.healthValue, this.stats.maxHealth);
        }
        
        // Apply well-fed buff if hunger > 90
        if (this.stats.hunger > 90) {
            this.statusEffects.wellFed = true;
            setTimeout(() => this.statusEffects.wellFed = false, 60000); // 1 minute buff
        }
        
        return true;
    }
    
    drink(drinkItem) {
        // Restore thirst
        const thirstRestore = drinkItem.thirstValue || 25;
        this.stats.thirst = Math.min(this.stats.thirst + thirstRestore, this.stats.maxThirst);
        
        // Apply hydrated buff if thirst > 90
        if (this.stats.thirst > 90) {
            this.statusEffects.hydrated = true;
            setTimeout(() => this.statusEffects.hydrated = false, 60000);
        }
        
        return true;
    }
    
    rest() {
        // Restore energy and stamina
        this.stats.energy = this.stats.maxEnergy;
        this.stats.stamina = this.stats.maxStamina;
        this.statusEffects.exhausted = false;
        this.statusEffects.energized = true;
        
        setTimeout(() => this.statusEffects.energized = false, 120000); // 2 minute buff
    }
    
    sprint(deltaTime) {
        // Drain stamina when sprinting
        if (this.stats.stamina > 0) {
            this.stats.stamina -= this.decayRates.stamina * deltaTime;
            if (this.stats.stamina < 0) this.stats.stamina = 0;
            return true; // Can sprint
        }
        return false; // Cannot sprint
    }
    
    takeDamage(amount) {
        this.stats.health -= amount;
        if (this.stats.health < 0) this.stats.health = 0;
        return this.stats.health > 0; // Return true if still alive
    }
    
    heal(amount) {
        this.stats.health = Math.min(this.stats.health + amount, this.stats.maxHealth);
    }
    
    setEnvironmentalTemperature(temp) {
        this.environmentalTemp = temp;
    }
    
    update(deltaTime) {
        // Decay hunger and thirst over time
        this.stats.hunger -= this.decayRates.hunger * deltaTime;
        this.stats.thirst -= this.decayRates.thirst * deltaTime;
        this.stats.energy -= this.decayRates.energy * deltaTime;
        
        // Clamp values
        this.stats.hunger = Math.max(0, this.stats.hunger);
        this.stats.thirst = Math.max(0, this.stats.thirst);
        this.stats.energy = Math.max(0, this.stats.energy);
        
        // Regenerate stamina when not sprinting
        if (this.stats.stamina < this.stats.maxStamina) {
            this.stats.stamina += this.decayRates.staminaRegen * deltaTime;
            this.stats.stamina = Math.min(this.stats.stamina, this.stats.maxStamina);
        }
        
        // Temperature regulation
        const tempDiff = this.environmentalTemp - this.stats.temperature;
        this.stats.temperature += tempDiff * 0.01 * deltaTime; // Slowly adjust body temp
        
        // Check for status effects
        this.checkStatusEffects();
        
        // Apply damage from severe conditions
        this.applyEnvironmentalDamage(deltaTime);
    }
    
    checkStatusEffects() {
        // Starvation
        this.statusEffects.starving = this.stats.hunger < 10;
        
        // Dehydration
        this.statusEffects.dehydrated = this.stats.thirst < 10;
        
        // Exhaustion
        this.statusEffects.exhausted = this.stats.energy < 10;
        
        // Temperature effects
        this.statusEffects.freezing = this.stats.temperature < 35;
        this.statusEffects.overheating = this.stats.temperature > 39;
    }
    
    applyEnvironmentalDamage(deltaTime) {
        // Take damage when starving
        if (this.statusEffects.starving) {
            this.takeDamage(5 * deltaTime);
        }
        
        // Take damage when severely dehydrated
        if (this.statusEffects.dehydrated) {
            this.takeDamage(10 * deltaTime); // Dehydration kills faster
        }
        
        // Take damage from extreme temperatures
        if (this.statusEffects.freezing) {
            this.takeDamage(3 * deltaTime);
        }
        if (this.statusEffects.overheating) {
            this.takeDamage(4 * deltaTime);
        }
    }
    
    getStats() {
        return { ...this.stats };
    }
    
    getStatusEffects() {
        return { ...this.statusEffects };
    }
    
    isAlive() {
        return this.stats.health > 0;
    }
    
    getHungerPercent() {
        return (this.stats.hunger / this.stats.maxHunger) * 100;
    }
    
    getThirstPercent() {
        return (this.stats.thirst / this.stats.maxThirst) * 100;
    }
    
    getHealthPercent() {
        return (this.stats.health / this.stats.maxHealth) * 100;
    }
    
    getStaminaPercent() {
        return (this.stats.stamina / this.stats.maxStamina) * 100;
    }
}
