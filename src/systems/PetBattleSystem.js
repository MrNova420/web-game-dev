/**
 * PetBattleSystem.js
 * Phase 5 - Pet Battle System
 * PvP pet combat, tournaments, and pet breeding
 * ~400 lines
 */

export class PetBattleSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.activeBattles = new Map(); // battleId -> battle data
        this.petStats = new Map(); // petId -> combat stats
        this.tournaments = [];
        this.breedingPairs = new Map();
        
        // Battle configuration
        this.battleConfig = {
            maxPetsPerTeam: 3,
            turnTimeLimit: 30, // seconds
            maxRounds: 20,
            elementalAdvantages: {
                fire: { strong: ['nature', 'ice'], weak: ['water', 'earth'] },
                water: { strong: ['fire', 'earth'], weak: ['lightning', 'nature'] },
                earth: { strong: ['lightning', 'wind'], weak: ['nature', 'water'] },
                lightning: { strong: ['water', 'wind'], weak: ['earth', 'fire'] },
                nature: { strong: ['water', 'earth'], weak: ['fire', 'ice'] },
                ice: { strong: ['nature', 'wind'], weak: ['fire', 'lightning'] },
                wind: { strong: ['ice', 'lightning'], weak: ['earth'] },
                light: { strong: ['dark'], weak: ['dark'] },
                dark: { strong: ['light'], weak: ['light'] },
                neutral: { strong: [], weak: [] }
            },
            statusEffects: {
                burn: { damage: 5, duration: 3, type: 'dot' },
                poison: { damage: 3, duration: 5, type: 'dot' },
                freeze: { chance: 0.5, duration: 1, type: 'stun' },
                paralyze: { chance: 0.25, duration: 2, type: 'stun' },
                sleep: { duration: 2, type: 'disable' },
                confuse: { duration: 2, type: 'chaos' }
            }
        };
        
        // Pet abilities database
        this.abilityDatabase = this.createAbilityDatabase();
        
        // Tournament configuration
        this.tournamentConfig = {
            ranks: ['bronze', 'silver', 'gold', 'platinum', 'diamond', 'master', 'legend'],
            prizePools: {
                bronze: { gold: 100, tokens: 10 },
                silver: { gold: 500, tokens: 50 },
                gold: { gold: 2000, tokens: 200 },
                platinum: { gold: 10000, tokens: 1000 },
                diamond: { gold: 50000, tokens: 5000 },
                master: { gold: 200000, tokens: 20000 },
                legend: { gold: 1000000, tokens: 100000, legendary_item: true }
            }
        };
    }
    
    /**
     * Create ability database
     */
    createAbilityDatabase() {
        return {
            // Basic attacks
            scratch: {
                name: 'Scratch',
                type: 'physical',
                element: 'neutral',
                power: 20,
                accuracy: 100,
                cooldown: 0,
                description: 'A basic scratching attack'
            },
            bite: {
                name: 'Bite',
                type: 'physical',
                element: 'neutral',
                power: 25,
                accuracy: 95,
                cooldown: 0,
                description: 'Bites the enemy with sharp teeth'
            },
            
            // Elemental attacks
            ember: {
                name: 'Ember',
                type: 'magical',
                element: 'fire',
                power: 30,
                accuracy: 100,
                cooldown: 1,
                effects: [{ type: 'burn', chance: 0.3 }],
                description: 'Shoots small flames at the enemy'
            },
            water_gun: {
                name: 'Water Gun',
                type: 'magical',
                element: 'water',
                power: 30,
                accuracy: 100,
                cooldown: 1,
                description: 'Sprays water at the enemy'
            },
            thunder_shock: {
                name: 'Thunder Shock',
                type: 'magical',
                element: 'lightning',
                power: 30,
                accuracy: 100,
                cooldown: 1,
                effects: [{ type: 'paralyze', chance: 0.3 }],
                description: 'Zaps the enemy with electricity'
            },
            vine_whip: {
                name: 'Vine Whip',
                type: 'physical',
                element: 'nature',
                power: 30,
                accuracy: 100,
                cooldown: 1,
                description: 'Whips the enemy with vines'
            },
            
            // Advanced attacks
            flamethrower: {
                name: 'Flamethrower',
                type: 'magical',
                element: 'fire',
                power: 70,
                accuracy: 100,
                cooldown: 2,
                effects: [{ type: 'burn', chance: 0.5 }],
                description: 'Releases a stream of intense flames'
            },
            hydro_pump: {
                name: 'Hydro Pump',
                type: 'magical',
                element: 'water',
                power: 80,
                accuracy: 90,
                cooldown: 3,
                description: 'Blasts the enemy with high-pressure water'
            },
            thunderbolt: {
                name: 'Thunderbolt',
                type: 'magical',
                element: 'lightning',
                power: 75,
                accuracy: 100,
                cooldown: 2,
                effects: [{ type: 'paralyze', chance: 0.4 }],
                description: 'Strikes with a powerful lightning bolt'
            },
            
            // Status moves
            roar: {
                name: 'Roar',
                type: 'status',
                element: 'neutral',
                power: 0,
                accuracy: 100,
                cooldown: 3,
                effects: [{ type: 'fear', duration: 2 }],
                description: 'Intimidates the enemy with a fierce roar'
            },
            heal: {
                name: 'Heal',
                type: 'status',
                element: 'light',
                power: 0,
                accuracy: 100,
                cooldown: 4,
                healing: 50,
                description: 'Restores HP'
            },
            protect: {
                name: 'Protect',
                type: 'status',
                element: 'neutral',
                power: 0,
                accuracy: 100,
                cooldown: 5,
                effects: [{ type: 'shield', duration: 1 }],
                description: 'Blocks the next attack'
            },
            
            // Ultimate abilities
            hyper_beam: {
                name: 'Hyper Beam',
                type: 'magical',
                element: 'neutral',
                power: 120,
                accuracy: 90,
                cooldown: 5,
                recoil: 0.5,
                description: 'Devastating beam attack with recoil'
            },
            dragon_rage: {
                name: 'Dragon Rage',
                type: 'magical',
                element: 'fire',
                power: 100,
                accuracy: 100,
                cooldown: 4,
                description: 'Unleashes draconic fury'
            },
            meteor_strike: {
                name: 'Meteor Strike',
                type: 'magical',
                element: 'earth',
                power: 110,
                accuracy: 85,
                cooldown: 4,
                aoe: true,
                description: 'Calls down meteors on all enemies'
            }
        };
    }
    
    /**
     * Initialize pet for battle
     */
    initializePetForBattle(pet) {
        const stats = {
            petId: pet.id,
            name: pet.name,
            level: pet.level || 1,
            element: pet.element || 'neutral',
            currentHP: pet.stats.hp,
            maxHP: pet.stats.hp,
            attack: pet.stats.attack || 10,
            defense: pet.stats.defense || 10,
            speed: pet.stats.speed || 10,
            abilities: pet.abilities || ['scratch', 'bite'],
            activeEffects: [],
            cooldowns: new Map()
        };
        
        this.petStats.set(pet.id, stats);
        return stats;
    }
    
    /**
     * Start a pet battle
     */
    startBattle(player1Pets, player2Pets, battleType = 'pvp') {
        const battleId = `battle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const battle = {
            id: battleId,
            type: battleType,
            player1: {
                pets: player1Pets.map(pet => this.initializePetForBattle(pet)),
                activePet: 0,
                wins: 0
            },
            player2: {
                pets: player2Pets.map(pet => this.initializePetForBattle(pet)),
                activePet: 0,
                wins: 0
            },
            turn: 1,
            round: 1,
            maxRounds: this.battleConfig.maxRounds,
            phase: 'active', // active, ended
            turnOrder: [],
            battleLog: [],
            startTime: Date.now()
        };
        
        // Determine turn order based on speed
        this.calculateTurnOrder(battle);
        
        this.activeBattles.set(battleId, battle);
        this.logBattle(battle, `Battle started: ${battleType.toUpperCase()}`);
        
        return battleId;
    }
    
    /**
     * Calculate turn order based on pet speed
     */
    calculateTurnOrder(battle) {
        const pet1 = battle.player1.pets[battle.player1.activePet];
        const pet2 = battle.player2.pets[battle.player2.activePet];
        
        if (pet1.speed > pet2.speed) {
            battle.turnOrder = ['player1', 'player2'];
        } else if (pet2.speed > pet1.speed) {
            battle.turnOrder = ['player2', 'player1'];
        } else {
            // Equal speed - random
            battle.turnOrder = Math.random() < 0.5 ? ['player1', 'player2'] : ['player2', 'player1'];
        }
    }
    
    /**
     * Execute pet ability
     */
    executeAbility(battleId, playerId, abilityName) {
        const battle = this.activeBattles.get(battleId);
        if (!battle || battle.phase !== 'active') return null;
        
        const attacker = battle[playerId];
        const defender = playerId === 'player1' ? battle.player2 : battle.player1;
        
        const attackerPet = attacker.pets[attacker.activePet];
        const defenderPet = defender.pets[defender.activePet];
        
        const ability = this.abilityDatabase[abilityName];
        if (!ability) return null;
        
        // Check cooldown
        if (attackerPet.cooldowns.has(abilityName)) {
            const remainingCooldown = attackerPet.cooldowns.get(abilityName);
            if (remainingCooldown > 0) {
                this.logBattle(battle, `${attackerPet.name}'s ${ability.name} is on cooldown!`);
                return null;
            }
        }
        
        // Roll accuracy
        if (Math.random() * 100 > ability.accuracy) {
            this.logBattle(battle, `${attackerPet.name}'s ${ability.name} missed!`);
            return { hit: false };
        }
        
        const result = {
            hit: true,
            damage: 0,
            healing: 0,
            critical: false,
            effectApplied: null
        };
        
        // Calculate damage
        if (ability.power > 0) {
            let damage = ability.power;
            
            // Apply attack/defense
            const attackMod = attackerPet.attack / 100;
            const defenseMod = defenderPet.defense / 100;
            damage = Math.floor(damage * attackMod / defenseMod);
            
            // Type advantage
            const typeMultiplier = this.calculateTypeAdvantage(ability.element, defenderPet.element);
            damage = Math.floor(damage * typeMultiplier);
            
            // Critical hit
            if (Math.random() < 0.1) {
                damage = Math.floor(damage * 2);
                result.critical = true;
            }
            
            // Apply damage
            defenderPet.currentHP = Math.max(0, defenderPet.currentHP - damage);
            result.damage = damage;
            
            this.logBattle(battle, 
                `${attackerPet.name} used ${ability.name}! ` +
                `${result.critical ? 'Critical hit! ' : ''}` +
                `Dealt ${damage} damage to ${defenderPet.name}!`
            );
            
            // Check if defender fainted
            if (defenderPet.currentHP <= 0) {
                this.handlePetFaint(battle, defender, defenderPet);
            }
        }
        
        // Apply healing
        if (ability.healing) {
            const healing = ability.healing;
            attackerPet.currentHP = Math.min(attackerPet.maxHP, attackerPet.currentHP + healing);
            result.healing = healing;
            this.logBattle(battle, `${attackerPet.name} healed ${healing} HP!`);
        }
        
        // Apply status effects
        if (ability.effects) {
            for (const effect of ability.effects) {
                if (Math.random() <= (effect.chance || 1.0)) {
                    this.applyStatusEffect(battle, defenderPet, effect);
                    result.effectApplied = effect.type;
                }
            }
        }
        
        // Set cooldown
        if (ability.cooldown > 0) {
            attackerPet.cooldowns.set(abilityName, ability.cooldown);
        }
        
        // Apply recoil
        if (ability.recoil) {
            const recoilDamage = Math.floor(result.damage * ability.recoil);
            attackerPet.currentHP = Math.max(0, attackerPet.currentHP - recoilDamage);
            this.logBattle(battle, `${attackerPet.name} took ${recoilDamage} recoil damage!`);
        }
        
        return result;
    }
    
    /**
     * Calculate type advantage multiplier
     */
    calculateTypeAdvantage(attackElement, defenseElement) {
        const advantages = this.battleConfig.elementalAdvantages[attackElement];
        if (!advantages) return 1.0;
        
        if (advantages.strong.includes(defenseElement)) return 2.0;
        if (advantages.weak.includes(defenseElement)) return 0.5;
        return 1.0;
    }
    
    /**
     * Apply status effect to pet
     */
    applyStatusEffect(battle, pet, effect) {
        const statusConfig = this.battleConfig.statusEffects[effect.type];
        if (!statusConfig) return;
        
        pet.activeEffects.push({
            type: effect.type,
            duration: effect.duration || statusConfig.duration,
            turnsRemaining: effect.duration || statusConfig.duration,
            ...statusConfig
        });
        
        this.logBattle(battle, `${pet.name} is affected by ${effect.type}!`);
    }
    
    /**
     * Process status effects at start of turn
     */
    processStatusEffects(battle, pet) {
        for (let i = pet.activeEffects.length - 1; i >= 0; i--) {
            const effect = pet.activeEffects[i];
            
            // Apply damage over time
            if (effect.type === 'dot' && effect.damage) {
                pet.currentHP = Math.max(0, pet.currentHP - effect.damage);
                this.logBattle(battle, `${pet.name} takes ${effect.damage} ${effect.type} damage!`);
            }
            
            // Check stun/disable
            if (effect.type === 'stun' || effect.type === 'disable') {
                if (Math.random() <= effect.chance || effect.type === 'disable') {
                    this.logBattle(battle, `${pet.name} is ${effect.type}!`);
                    return true; // Skip turn
                }
            }
            
            // Decrease duration
            effect.turnsRemaining--;
            if (effect.turnsRemaining <= 0) {
                pet.activeEffects.splice(i, 1);
                this.logBattle(battle, `${pet.name} recovered from ${effect.type}!`);
            }
        }
        
        return false; // Can act
    }
    
    /**
     * Handle pet fainting
     */
    handlePetFaint(battle, player, pet) {
        this.logBattle(battle, `${pet.name} fainted!`);
        
        // Check if player has more pets
        const alivePets = player.pets.filter(p => p.currentHP > 0);
        if (alivePets.length === 0) {
            this.endBattle(battle, player === battle.player1 ? 'player2' : 'player1');
        } else {
            // Switch to next alive pet
            player.activePet = player.pets.findIndex(p => p.currentHP > 0);
            this.logBattle(battle, `Switched to ${player.pets[player.activePet].name}!`);
            this.calculateTurnOrder(battle);
        }
    }
    
    /**
     * Switch active pet
     */
    switchPet(battleId, playerId, newPetIndex) {
        const battle = this.activeBattles.get(battleId);
        if (!battle) return false;
        
        const player = battle[playerId];
        const newPet = player.pets[newPetIndex];
        
        if (!newPet || newPet.currentHP <= 0) {
            return false;
        }
        
        player.activePet = newPetIndex;
        this.logBattle(battle, `Switched to ${newPet.name}!`);
        this.calculateTurnOrder(battle);
        
        return true;
    }
    
    /**
     * End battle
     */
    endBattle(battle, winnerId) {
        battle.phase = 'ended';
        battle.winner = winnerId;
        battle.endTime = Date.now();
        battle.duration = battle.endTime - battle.startTime;
        
        this.logBattle(battle, `Battle ended! Winner: ${winnerId}`);
        
        // Award rewards
        this.awardBattleRewards(battle, winnerId);
        
        return battle;
    }
    
    /**
     * Award battle rewards
     */
    awardBattleRewards(battle, winnerId) {
        if (battle.type === 'tournament') {
            const tournament = this.tournaments.find(t => t.battleId === battle.id);
            if (tournament) {
                const prizes = this.tournamentConfig.prizePools[tournament.rank];
                // Award prizes to winner
                console.log(`Tournament winner ${winnerId} receives:`, prizes);
            }
        }
        
        // Award experience to all participating pets
        for (const player of [battle.player1, battle.player2]) {
            for (const pet of player.pets) {
                const exp = Math.floor(50 * battle.round);
                console.log(`${pet.name} gained ${exp} experience!`);
            }
        }
    }
    
    /**
     * Update battle cooldowns
     */
    updateCooldowns(battle) {
        for (const player of [battle.player1, battle.player2]) {
            for (const pet of player.pets) {
                for (const [ability, cooldown] of pet.cooldowns) {
                    if (cooldown > 0) {
                        pet.cooldowns.set(ability, cooldown - 1);
                    } else {
                        pet.cooldowns.delete(ability);
                    }
                }
            }
        }
    }
    
    /**
     * Start tournament
     */
    startTournament(rank, participants) {
        const tournament = {
            id: `tournament_${Date.now()}`,
            rank: rank,
            participants: participants,
            bracket: this.generateTournamentBracket(participants),
            currentRound: 1,
            prizes: this.tournamentConfig.prizePools[rank],
            startTime: Date.now()
        };
        
        this.tournaments.push(tournament);
        return tournament;
    }
    
    /**
     * Generate tournament bracket
     */
    generateTournamentBracket(participants) {
        // Simple single-elimination bracket
        const bracket = [];
        for (let i = 0; i < participants.length; i += 2) {
            if (i + 1 < participants.length) {
                bracket.push({
                    player1: participants[i],
                    player2: participants[i + 1],
                    winner: null
                });
            }
        }
        return bracket;
    }
    
    /**
     * Log battle event
     */
    logBattle(battle, message) {
        battle.battleLog.push({
            round: battle.round,
            turn: battle.turn,
            message: message,
            timestamp: Date.now()
        });
        console.log(`[Battle ${battle.id}] ${message}`);
    }
    
    /**
     * Get battle status
     */
    getBattleStatus(battleId) {
        const battle = this.activeBattles.get(battleId);
        if (!battle) return null;
        
        return {
            id: battle.id,
            type: battle.type,
            round: battle.round,
            phase: battle.phase,
            player1: {
                activePet: battle.player1.pets[battle.player1.activePet],
                petCount: battle.player1.pets.filter(p => p.currentHP > 0).length
            },
            player2: {
                activePet: battle.player2.pets[battle.player2.activePet],
                petCount: battle.player2.pets.filter(p => p.currentHP > 0).length
            },
            log: battle.battleLog.slice(-10) // Last 10 messages
        };
    }
}
