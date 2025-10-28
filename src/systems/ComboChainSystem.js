/**
 * ComboChainSystem.js
 * Phase 5.2 - Advanced Combo Chain System
 * Implements multi-hit combos, finishers, and combo multipliers
 * ~400 lines
 */

export class ComboChainSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // Combo configuration
        this.comboConfig = {
            resetTime: 3000, // 3 seconds to continue combo
            multiplierIncrease: 0.25, // +25% damage per combo hit
            maxMultiplier: 3.0, // Max 300% damage
            finisherThreshold: 5, // 5 hits to unlock finisher
            perfectTimingWindow: 200 // ms window for perfect timing bonus
        };
        
        // Combo state
        this.currentCombo = 0;
        this.comboMultiplier = 1.0;
        this.lastHitTime = 0;
        this.comboActive = false;
        this.finisherAvailable = false;
        this.comboChain = [];
        this.totalDamageDealt = 0;
        
        // Combo moves database
        this.comboMoves = {
            // Basic combos
            light_attack: {
                name: 'Light Attack',
                damage: 10,
                hitCount: 1,
                nextMoves: ['light_attack', 'heavy_attack', 'skill_1'],
                animationTime: 300
            },
            heavy_attack: {
                name: 'Heavy Attack',
                damage: 25,
                hitCount: 1,
                nextMoves: ['light_attack', 'heavy_attack'],
                animationTime: 500
            },
            skill_1: {
                name: 'Skill Strike',
                damage: 35,
                hitCount: 2,
                nextMoves: ['skill_2', 'finisher_basic'],
                animationTime: 600
            },
            skill_2: {
                name: 'Power Slash',
                damage: 45,
                hitCount: 3,
                nextMoves: ['finisher_advanced'],
                animationTime: 700
            },
            
            // Finishers
            finisher_basic: {
                name: 'Basic Finisher',
                damage: 100,
                hitCount: 1,
                isFinisher: true,
                nextMoves: [],
                animationTime: 1000,
                minCombo: 5
            },
            finisher_advanced: {
                name: 'Advanced Finisher',
                damage: 200,
                hitCount: 1,
                isFinisher: true,
                nextMoves: [],
                animationTime: 1500,
                minCombo: 10
            },
            finisher_ultimate: {
                name: 'Ultimate Finisher',
                damage: 500,
                hitCount: 5,
                isFinisher: true,
                nextMoves: [],
                animationTime: 2000,
                minCombo: 20
            }
        };
        
        // Class-specific combo trees
        this.classComboTrees = {
            warrior: {
                basic: ['light_attack', 'heavy_attack', 'heavy_attack', 'finisher_basic'],
                advanced: ['light_attack', 'light_attack', 'skill_1', 'heavy_attack', 'finisher_advanced'],
                ultimate: ['skill_1', 'skill_2', 'heavy_attack', 'heavy_attack', 'finisher_ultimate']
            },
            mage: {
                basic: ['skill_1', 'light_attack', 'skill_1', 'finisher_basic'],
                advanced: ['skill_1', 'skill_2', 'skill_1', 'finisher_advanced'],
                ultimate: ['skill_2', 'skill_2', 'skill_1', 'skill_2', 'finisher_ultimate']
            },
            rogue: {
                basic: ['light_attack', 'light_attack', 'light_attack', 'finisher_basic'],
                advanced: ['light_attack', 'light_attack', 'skill_1', 'light_attack', 'finisher_advanced'],
                ultimate: ['light_attack', 'skill_1', 'light_attack', 'skill_2', 'finisher_ultimate']
            }
        };
        
        // Visual effects for combos
        this.comboEffects = {
            colors: [
                0xffffff, // 1-2 hits
                0xffff00, // 3-4 hits
                0xff9900, // 5-9 hits
                0xff0000, // 10-14 hits
                0xff00ff, // 15-19 hits
                0x9d4edd  // 20+ hits
            ]
        };
        
        console.log('⚔️ ComboChainSystem initialized');
    }
    
    /**
     * Execute a combo move
     */
    executeMove(moveId) {
        const currentTime = Date.now();
        const move = this.comboMoves[moveId];
        
        if (!move) {
            console.warn('Unknown move:', moveId);
            return null;
        }
        
        // Check if combo has expired
        if (this.comboActive && currentTime - this.lastHitTime > this.comboConfig.resetTime) {
            this.resetCombo();
        }
        
        // Check if move is valid in current combo
        if (this.comboChain.length > 0) {
            const lastMove = this.comboMoves[this.comboChain[this.comboChain.length - 1]];
            if (!lastMove.nextMoves.includes(moveId)) {
                console.warn('Invalid combo move');
                return null;
            }
        }
        
        // Check finisher requirements
        if (move.isFinisher && this.currentCombo < move.minCombo) {
            console.warn('Not enough combo for finisher');
            return null;
        }
        
        // Check for perfect timing
        const isPerfectTiming = this.checkPerfectTiming(currentTime);
        
        // Calculate damage with multiplier
        const baseDamage = move.damage;
        const finalDamage = baseDamage * this.comboMultiplier * (isPerfectTiming ? 1.5 : 1.0);
        
        // Update combo state
        this.currentCombo += move.hitCount;
        this.comboChain.push(moveId);
        this.lastHitTime = currentTime;
        this.comboActive = true;
        this.totalDamageDealt += finalDamage;
        
        // Update multiplier
        this.updateMultiplier();
        
        // Check for finisher availability
        this.checkFinisherAvailability();
        
        // Reset combo if finisher executed
        if (move.isFinisher) {
            setTimeout(() => this.resetCombo(), move.animationTime);
        }
        
        console.log(`⚔️ ${move.name} | Combo: ${this.currentCombo} | Multiplier: ${this.comboMultiplier.toFixed(2)}x | Damage: ${finalDamage.toFixed(0)}`);
        
        return {
            move,
            damage: finalDamage,
            combo: this.currentCombo,
            multiplier: this.comboMultiplier,
            perfectTiming: isPerfectTiming,
            finisherReady: this.finisherAvailable
        };
    }
    
    /**
     * Check if timing was perfect
     */
    checkPerfectTiming(currentTime) {
        if (this.comboChain.length === 0) return false;
        
        const timeSinceLastHit = currentTime - this.lastHitTime;
        const lastMove = this.comboMoves[this.comboChain[this.comboChain.length - 1]];
        
        // Perfect timing is hitting right after animation ends
        const perfectWindow = lastMove.animationTime;
        return Math.abs(timeSinceLastHit - perfectWindow) <= this.comboConfig.perfectTimingWindow;
    }
    
    /**
     * Update combo multiplier
     */
    updateMultiplier() {
        const multiplier = 1.0 + (this.currentCombo * this.comboConfig.multiplierIncrease);
        this.comboMultiplier = Math.min(multiplier, this.comboConfig.maxMultiplier);
    }
    
    /**
     * Check if finisher is available
     */
    checkFinisherAvailability() {
        this.finisherAvailable = this.currentCombo >= this.comboConfig.finisherThreshold;
    }
    
    /**
     * Reset combo
     */
    resetCombo() {
        if (this.currentCombo > 0) {
            console.log(`💥 Combo ended! Total hits: ${this.currentCombo} | Total damage: ${this.totalDamageDealt.toFixed(0)}`);
        }
        
        this.currentCombo = 0;
        this.comboMultiplier = 1.0;
        this.comboActive = false;
        this.finisherAvailable = false;
        this.comboChain = [];
        this.totalDamageDealt = 0;
    }
    
    /**
     * Get available next moves
     */
    getNextMoves() {
        if (this.comboChain.length === 0) {
            return ['light_attack', 'heavy_attack', 'skill_1'];
        }
        
        const lastMove = this.comboMoves[this.comboChain[this.comboChain.length - 1]];
        return lastMove.nextMoves;
    }
    
    /**
     * Get combo color based on hit count
     */
    getComboColor() {
        if (this.currentCombo === 0) return 0xffffff;
        
        const index = Math.min(
            Math.floor(this.currentCombo / 5),
            this.comboEffects.colors.length - 1
        );
        return this.comboEffects.colors[index];
    }
    
    /**
     * Get class combo tree
     */
    getClassComboTree(className) {
        return this.classComboTrees[className] || this.classComboTrees.warrior;
    }
    
    /**
     * Execute preset combo
     */
    executePresetCombo(className, comboType) {
        const comboTree = this.classComboTrees[className];
        if (!comboTree || !comboTree[comboType]) {
            console.warn('Unknown combo preset');
            return;
        }
        
        const moves = comboTree[comboType];
        console.log(`🎯 Executing ${className} ${comboType} combo:`, moves.join(' → '));
        
        // This would execute the combo moves in sequence
        // For now, just log it
        return moves;
    }
    
    /**
     * Update system
     */
    update(deltaTime) {
        const currentTime = Date.now();
        
        // Auto-reset combo if expired
        if (this.comboActive && currentTime - this.lastHitTime > this.comboConfig.resetTime) {
            this.resetCombo();
        }
    }
    
    /**
     * Get combo state
     */
    getState() {
        return {
            combo: this.currentCombo,
            multiplier: this.comboMultiplier,
            finisherAvailable: this.finisherAvailable,
            comboActive: this.comboActive,
            nextMoves: this.getNextMoves(),
            comboColor: this.getComboColor(),
            totalDamage: this.totalDamageDealt,
            timeRemaining: Math.max(0, this.comboConfig.resetTime - (Date.now() - this.lastHitTime))
        };
    }
    
    /**
     * Get combo statistics
     */
    getStatistics() {
        return {
            highestCombo: this.currentCombo,
            totalMoves: this.comboChain.length,
            averageDamagePerHit: this.comboChain.length > 0 ? this.totalDamageDealt / this.comboChain.length : 0,
            movesUsed: this.comboChain
        };
    }
}
