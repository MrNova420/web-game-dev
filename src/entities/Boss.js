/**
import { logger } from '../core/Logger.js';
 * Boss - Boss enemy class for Dynasty of Emberveil
 * Powerful unique enemies that appear on boss floors
 */

import * as THREE from 'three';
import { Enemy } from './Enemy.js';

export class Boss extends Enemy {
    constructor(scene, type, position) {
        super(scene, type, position);
        
        this.isBoss = true;
        this.phase = 1;
        this.maxPhases = 3;
        this.phaseThresholds = [0.66, 0.33]; // HP percentages for phase transitions
        
        // Boss-specific stats (much stronger than regular enemies)
        this.stats.hp *= 10;
        this.stats.attack *= 2;
        this.stats.defense *= 2;
        this.stats.exp *= 10;
        this.maxHp = this.stats.hp;
        
        // Special abilities
        this.specialAbilities = this.getSpecialAbilities();
        this.abilityTimer = 0;
        this.abilityCooldown = 5; // seconds between special abilities
        
        // Make boss visually larger
        this.mesh.scale.set(2, 2, 2);
        
        // Add boss indicator
        this.addBossIndicator();
        
        logger.info(`👑 Boss spawned: ${this.stats.name}`);
    }
    
    getSpecialAbilities() {
        const bossAbilities = {
            corrupted_angel: [
                { name: 'Divine Judgment', damage: 50, effect: 'aoe' },
                { name: 'Holy Smite', damage: 40, effect: 'targeted' },
                { name: 'Purifying Light', damage: 30, effect: 'heal' }
            ],
            weed_golem: [
                { name: 'Root Slam', damage: 60, effect: 'aoe' },
                { name: 'Toxic Spores', damage: 25, effect: 'dot' },
                { name: 'Nature\'s Wrath', damage: 45, effect: 'summon' }
            ],
            shadow_bard: [
                { name: 'Death Song', damage: 35, effect: 'aoe' },
                { name: 'Shadow Melody', damage: 40, effect: 'confusion' },
                { name: 'Crescendo', damage: 70, effect: 'charged' }
            ],
            smoke_imp: [
                { name: 'Smoke Bomb', damage: 30, effect: 'blind' },
                { name: 'Toxic Cloud', damage: 20, effect: 'dot' },
                { name: 'Imp Swarm', damage: 35, effect: 'summon' }
            ],
            essence_wraith: [
                { name: 'Soul Drain', damage: 45, effect: 'drain' },
                { name: 'Essence Burst', damage: 50, effect: 'aoe' },
                { name: 'Spirit Form', damage: 0, effect: 'invulnerable' }
            ]
        };
        
        return bossAbilities[this.type] || bossAbilities.smoke_imp;
    }
    
    addBossIndicator() {
        // Add glowing ring around boss
        const ringGeometry = new THREE.RingGeometry(2, 2.3, 32);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: 0xffd60a,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.7
        });
        
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = -Math.PI / 2;
        ring.position.y = 0.1;
        this.mesh.add(ring);
        
        // Animate ring
        this.mesh.userData.ring = ring;
        this.mesh.userData.ringRotation = 0;
    }
    
    update(delta, player) {
        super.update(delta, player);
        
        if (!this.isAlive) return;
        
        // Check for phase transitions
        this.checkPhaseTransition();
        
        // Use special abilities
        this.abilityTimer += delta;
        if (this.abilityTimer >= this.abilityCooldown) {
            this.useSpecialAbility(player);
            this.abilityTimer = 0;
        }
        
        // Animate ring
        if (this.mesh.userData.ring) {
            this.mesh.userData.ringRotation += delta;
            this.mesh.userData.ring.rotation.z = this.mesh.userData.ringRotation;
        }
    }
    
    checkPhaseTransition() {
        const hpPercent = this.stats.hp / this.maxHp;
        
        if (this.phase === 1 && hpPercent <= this.phaseThresholds[0]) {
            this.enterPhase(2);
        } else if (this.phase === 2 && hpPercent <= this.phaseThresholds[1]) {
            this.enterPhase(3);
        }
    }
    
    enterPhase(phase) {
        this.phase = phase;
        logger.info(`👑 ${this.stats.name} enters Phase ${phase}!`);
        
        // Increase stats each phase
        this.stats.attack *= 1.3;
        this.stats.speed *= 1.2;
        this.abilityCooldown *= 0.8; // Faster abilities
        
        // Visual effect
        this.mesh.material.emissiveIntensity = 0.8 + (phase * 0.2);
        
        // Show phase transition notification
        this.showPhaseNotification(phase);
    }
    
    useSpecialAbility(player) {
        if (!player || !this.specialAbilities) return;
        
        const ability = this.specialAbilities[Math.floor(Math.random() * this.specialAbilities.length)];
        
        logger.info(`👑 ${this.stats.name} uses ${ability.name}!`);
        
        // Apply ability effect based on type
        switch (ability.effect) {
            case 'aoe':
                // Damage all in range
                const distance = this.mesh.position.distanceTo(player.mesh.position);
                if (distance < 10) {
                    player.takeDamage(ability.damage);
                }
                break;
                
            case 'targeted':
                // Damage player directly
                player.takeDamage(ability.damage);
                break;
                
            case 'heal':
                // Heal self
                this.stats.hp = Math.min(this.maxHp, this.stats.hp + ability.damage);
                break;
                
            case 'drain':
                // Damage and heal
                player.takeDamage(ability.damage);
                this.stats.hp = Math.min(this.maxHp, this.stats.hp + ability.damage / 2);
                break;
        }
        
        this.showAbilityNotification(ability.name);
    }
    
    showPhaseNotification(phase) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 215, 0, 0.9);
            border: 3px solid #ffd60a;
            border-radius: 15px;
            padding: 30px 50px;
            color: #1a0033;
            font-size: 2.5em;
            font-weight: bold;
            z-index: 9999;
            animation: bossPhase 3s ease-out;
            box-shadow: 0 0 40px #ffd60a;
        `;
        notification.textContent = `⚠️ PHASE ${phase} ⚠️`;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 3000);
    }
    
    showAbilityNotification(abilityName) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 30%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(157, 78, 221, 0.9);
            border: 2px solid #c77dff;
            border-radius: 10px;
            padding: 15px 30px;
            color: white;
            font-size: 1.5em;
            font-weight: bold;
            z-index: 9999;
            animation: abilityPopup 2s ease-out;
        `;
        notification.textContent = `👑 ${abilityName}`;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 2000);
    }
    
    takeDamage(amount) {
        // Bosses take reduced damage
        const reducedDamage = Math.floor(amount * 0.8);
        return super.takeDamage(reducedDamage);
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes bossPhase {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
        20% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
        80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    }
    
    @keyframes abilityPopup {
        0% { opacity: 0; transform: translate(-50%, -80px); }
        20% { opacity: 1; transform: translate(-50%, -50%); }
        80% { opacity: 1; transform: translate(-50%, -50%); }
        100% { opacity: 0; transform: translate(-50%, -20px); }
    }
`;
document.head.appendChild(style);
