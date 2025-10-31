/**
 * CombatSystem - Handles combat mechanics
 */

export class CombatSystem {
    constructor(engine) {
        this.engine = engine;
        this.combatLog = [];
    }
    
    update(delta) {
        // TODO: Implement AI for enemies
        // Update enemy behavior, attack patterns, etc.
    }
    
    dealDamage(attacker, target, baseDamage) {
        const damage = Math.max(1, baseDamage - (target.defense || 0));
        
        if (target.takeDamage) {
            target.takeDamage(damage);
        } else if (target.userData) {
            target.userData.hp = Math.max(0, target.userData.hp - damage);
            if (target.userData.hp <= 0) {
                target.userData.isAlive = false;
            }
        }
        
        this.logCombat(`${attacker.name || 'Attacker'} deals ${damage} damage to ${target.name || 'Enemy'}`);
        
        return damage;
    }
    
    calculateCritical(attacker, baseDamage) {
        const critChance = 0.15; // 15% critical chance
        const critMultiplier = 2.0;
        
        if (Math.random() < critChance) {
            this.logCombat('💥 CRITICAL HIT!');
            return baseDamage * critMultiplier;
        }
        
        return baseDamage;
    }
    
    logCombat(message) {
        this.combatLog.push({
            message: message,
            timestamp: Date.now()
        });
        
        // Keep only last 20 messages
        if (this.combatLog.length > 20) {
            this.combatLog.shift();
        }
        
        logger.info(`⚔️ ${message}`);
    }
    
    getCombatLog() {
        return this.combatLog;
    }
}
