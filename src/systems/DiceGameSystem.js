import { logger } from '../core/Logger.js';
/**
 * DiceGameSystem.js
 * Casino dice game mini-game with multiple game modes
 * Uses external assets: Sketchfab Free (dice models), Kenney UI Pack, game-icons.net
 * Part of Phase 8 - Mini-Games & Activities
 */

export class DiceGameSystem {
  constructor() {
    this.enabled = false;
    this.currentGame = null;
    
    // External asset paths
    this.assets = {
      diceModels: {
        standard: '/assets/models/dice/d6_standard.glb',        // Sketchfab Free
        golden: '/assets/models/dice/d6_golden.glb',
        crystal: '/assets/models/dice/d6_crystal.glb',
        obsidian: '/assets/models/dice/d6_obsidian.glb'
      },
      tables: {
        craps: '/assets/models/casino/craps_table.glb',         // Sketchfab Free
        poker_dice: '/assets/models/casino/poker_table.glb'
      },
      casino_environment: '/assets/models/casino/casino_interior.glb',  // Quaternius
      chips: {
        white: '/assets/models/casino/chip_white.glb',          // Sketchfab Free
        red: '/assets/models/casino/chip_red.glb',
        blue: '/assets/models/casino/chip_blue.glb',
        gold: '/assets/models/casino/chip_gold.glb'
      },
      ui: {
        icons: 'game-icons.net',                                // game-icons.net
        panels: '/assets/ui/kenney_ui_pack/',                   // Kenney UI Pack
        buttons: '/assets/ui/kenney_ui_pack/buttons/'
      },
      audio: {
        dice_roll: '/assets/audio/freesound/dice_roll.ogg',    // Freesound
        dice_land: '/assets/audio/freesound/dice_land.ogg',
        win: '/assets/audio/freesound/casino_win.ogg',
        lose: '/assets/audio/freesound/casino_lose.ogg',
        chips: '/assets/audio/freesound/chips_clink.ogg'
      }
    };
    
    // Game modes
    this.gameModes = {
      CRAPS: 'craps',
      POKER_DICE: 'poker_dice',
      LIARS_DICE: 'liars_dice',
      FARKLE: 'farkle',
      YAHTZEE: 'yahtzee',
      PIG: 'pig'
    };
    
    // Betting chips
    this.chipValues = [
      { value: 10, color: 'white', model: this.assets.chips.white },
      { value: 50, color: 'red', model: this.assets.chips.red },
      { value: 100, color: 'blue', model: this.assets.chips.blue },
      { value: 500, color: 'gold', model: this.assets.chips.gold }
    ];
    
    // Player stats
    this.playerStats = {
      balance: 1000,
      totalWon: 0,
      totalLost: 0,
      gamesPlayed: 0,
      biggestWin: 0,
      winStreak: 0,
      currentStreak: 0
    };
    
    // Craps game state
    this.crapsGame = {
      point: null,
      phase: 'come_out',
      bets: {
        pass_line: 0,
        dont_pass: 0,
        field: 0,
        come: 0,
        odds: 0
      }
    };
    
    // Poker dice hands
    this.pokerHands = [
      { name: 'Five of a Kind', payout: 1000, check: (dice) => this.checkFiveOfKind(dice) },
      { name: 'Four of a Kind', payout: 200, check: (dice) => this.checkFourOfKind(dice) },
      { name: 'Full House', payout: 100, check: (dice) => this.checkFullHouse(dice) },
      { name: 'Straight', payout: 75, check: (dice) => this.checkStraight(dice) },
      { name: 'Three of a Kind', payout: 30, check: (dice) => this.checkThreeOfKind(dice) },
      { name: 'Two Pair', payout: 15, check: (dice) => this.checkTwoPair(dice) },
      { name: 'One Pair', payout: 5, check: (dice) => this.checkOnePair(dice) }
    ];
    
    // Achievements
    this.achievements = [
      { id: 'lucky_seven', name: 'Lucky Seven', description: 'Roll a 7 on come out', unlocked: false },
      { id: 'high_roller', name: 'High Roller', description: 'Win 5000 in one game', unlocked: false },
      { id: 'hot_streak', name: 'Hot Streak', description: 'Win 10 games in a row', unlocked: false },
      { id: 'five_kind', name: 'Quintuple', description: 'Roll five of a kind', unlocked: false },
      { id: 'poker_master', name: 'Poker Master', description: 'Get all poker hands', unlocked: false },
      { id: 'farkle_free', name: 'Farkle Free', description: 'Play 20 Farkle rounds without farkling', unlocked: false }
    ];
    
    // Dice physics
    this.dicePhysics = {
      gravity: -9.81,
      restitution: 0.6,
      friction: 0.3,
      angularDamping: 0.5
    };
  }
  
  /**
   * Initialize the dice game system
   */
  init() {
    logger.info('DiceGameSystem: Initializing with external assets');
    logger.info(`  - Dice models: Sketchfab Free (4 types)`);
    logger.info(`  - Casino tables: Sketchfab Free`);
    logger.info(`  - Environment: Quaternius Casino Pack`);
    logger.info(`  - UI: Kenney UI Pack + game-icons.net`);
    this.enabled = true;
  }
  
  /**
   * Start a dice game
   */
  startGame(mode, betAmount = 10) {
    if (this.playerStats.balance < betAmount) {
      logger.info('DiceGameSystem: Insufficient balance');
      return false;
    }
    
    this.currentGame = {
      mode: mode,
      bet: betAmount,
      dice: [],
      rollCount: 0,
      score: 0
    };
    
    logger.info(`DiceGameSystem: Starting ${mode} game with bet ${betAmount}`);
    return true;
  }
  
  /**
   * Roll dice with physics simulation
   */
  rollDice(count = 2, diceType = 'standard') {
    const results = [];
    const model = this.assets.diceModels[diceType];
    
    logger.info(`DiceGameSystem: Rolling ${count} ${diceType} dice (${model})`);
    
    for (let i = 0; i < count; i++) {
      const result = Math.floor(Math.random() * 6) + 1;
      results.push({
        value: result,
        model: model,
        position: { x: Math.random() * 2 - 1, y: 5, z: Math.random() * 2 - 1 },
        rotation: { x: Math.random() * 360, y: Math.random() * 360, z: Math.random() * 360 },
        velocity: { x: Math.random() * 2 - 1, y: 0, z: Math.random() * 2 - 1 },
        angularVelocity: { x: Math.random() * 10, y: Math.random() * 10, z: Math.random() * 10 }
      });
    }
    
    this.currentGame.dice = results;
    this.currentGame.rollCount++;
    
    return results;
  }
  
  /**
   * Play Craps game
   */
  playCraps(betType, amount) {
    if (!this.currentGame || this.currentGame.mode !== this.gameModes.CRAPS) {
      this.startGame(this.gameModes.CRAPS, amount);
    }
    
    const dice = this.rollDice(2);
    const total = dice[0].value + dice[1].value;
    
    logger.info(`DiceGameSystem: Craps roll: ${total} (${dice[0].value} + ${dice[1].value})`);
    
    let win = false;
    let payout = 0;
    
    if (this.crapsGame.phase === 'come_out') {
      if (total === 7 || total === 11) {
        win = true;
        payout = amount * 2;
        this.unlockAchievement('lucky_seven');
      } else if (total === 2 || total === 3 || total === 12) {
        win = false;
      } else {
        this.crapsGame.point = total;
        this.crapsGame.phase = 'point';
        logger.info(`DiceGameSystem: Point established: ${total}`);
      }
    } else if (this.crapsGame.phase === 'point') {
      if (total === this.crapsGame.point) {
        win = true;
        payout = amount * 2;
        this.crapsGame.phase = 'come_out';
        this.crapsGame.point = null;
      } else if (total === 7) {
        win = false;
        this.crapsGame.phase = 'come_out';
        this.crapsGame.point = null;
      }
    }
    
    this.updateBalance(win, payout, amount);
    return { win, payout, total, dice };
  }
  
  /**
   * Play Poker Dice game
   */
  playPokerDice(betAmount) {
    if (!this.currentGame || this.currentGame.mode !== this.gameModes.POKER_DICE) {
      this.startGame(this.gameModes.POKER_DICE, betAmount);
    }
    
    const dice = this.rollDice(5, 'golden');
    const values = dice.map(d => d.value).sort((a, b) => a - b);
    
    logger.info(`DiceGameSystem: Poker dice: [${values.join(', ')}]`);
    
    // Check for hands (highest first)
    let hand = null;
    let payout = 0;
    
    for (const pokerHand of this.pokerHands) {
      if (pokerHand.check(values)) {
        hand = pokerHand;
        payout = betAmount * (pokerHand.payout / 10);
        break;
      }
    }
    
    const win = hand !== null;
    this.updateBalance(win, payout, betAmount);
    
    if (hand && hand.name === 'Five of a Kind') {
      this.unlockAchievement('five_kind');
    }
    
    return { win, hand: hand ? hand.name : 'No Hand', payout, dice, values };
  }
  
  /**
   * Check poker hand: Five of a Kind
   */
  checkFiveOfKind(dice) {
    return dice.every(d => d === dice[0]);
  }
  
  /**
   * Check poker hand: Four of a Kind
   */
  checkFourOfKind(dice) {
    const counts = this.getCounts(dice);
    return Object.values(counts).includes(4);
  }
  
  /**
   * Check poker hand: Full House
   */
  checkFullHouse(dice) {
    const counts = this.getCounts(dice);
    const values = Object.values(counts).sort();
    return values.length === 2 && values[0] === 2 && values[1] === 3;
  }
  
  /**
   * Check poker hand: Straight
   */
  checkStraight(dice) {
    const unique = [...new Set(dice)].sort((a, b) => a - b);
    if (unique.length !== 5) return false;
    return unique[4] - unique[0] === 4;
  }
  
  /**
   * Check poker hand: Three of a Kind
   */
  checkThreeOfKind(dice) {
    const counts = this.getCounts(dice);
    return Object.values(counts).includes(3);
  }
  
  /**
   * Check poker hand: Two Pair
   */
  checkTwoPair(dice) {
    const counts = this.getCounts(dice);
    const pairs = Object.values(counts).filter(c => c === 2);
    return pairs.length === 2;
  }
  
  /**
   * Check poker hand: One Pair
   */
  checkOnePair(dice) {
    const counts = this.getCounts(dice);
    return Object.values(counts).includes(2);
  }
  
  /**
   * Get counts of each die value
   */
  getCounts(dice) {
    const counts = {};
    for (const value of dice) {
      counts[value] = (counts[value] || 0) + 1;
    }
    return counts;
  }
  
  /**
   * Update player balance
   */
  updateBalance(win, payout, bet) {
    this.playerStats.gamesPlayed++;
    
    if (win) {
      this.playerStats.balance += payout;
      this.playerStats.totalWon += payout;
      this.playerStats.currentStreak++;
      
      if (this.playerStats.currentStreak > this.playerStats.winStreak) {
        this.playerStats.winStreak = this.playerStats.currentStreak;
        
        if (this.playerStats.winStreak >= 10) {
          this.unlockAchievement('hot_streak');
        }
      }
      
      if (payout > this.playerStats.biggestWin) {
        this.playerStats.biggestWin = payout;
        
        if (payout >= 5000) {
          this.unlockAchievement('high_roller');
        }
      }
      
      logger.info(`DiceGameSystem: Won ${payout}! Balance: ${this.playerStats.balance}`);
    } else {
      this.playerStats.balance -= bet;
      this.playerStats.totalLost += bet;
      this.playerStats.currentStreak = 0;
      logger.info(`DiceGameSystem: Lost ${bet}. Balance: ${this.playerStats.balance}`);
    }
  }
  
  /**
   * Unlock achievement
   */
  unlockAchievement(id) {
    const achievement = this.achievements.find(a => a.id === id);
    if (achievement && !achievement.unlocked) {
      achievement.unlocked = true;
      logger.info(`DiceGameSystem: Achievement unlocked: ${achievement.name}`);
    }
  }
  
  /**
   * Update system
   */
  update(deltaTime) {
    if (!this.enabled || !this.currentGame) return;
    
    // Update dice physics simulation
    for (const die of this.currentGame.dice) {
      if (die.velocity) {
        // Apply gravity
        die.velocity.y += this.dicePhysics.gravity * deltaTime;
        
        // Update position
        die.position.x += die.velocity.x * deltaTime;
        die.position.y += die.velocity.y * deltaTime;
        die.position.z += die.velocity.z * deltaTime;
        
        // Update rotation
        die.rotation.x += die.angularVelocity.x * deltaTime;
        die.rotation.y += die.angularVelocity.y * deltaTime;
        die.rotation.z += die.angularVelocity.z * deltaTime;
        
        // Apply damping
        die.angularVelocity.x *= (1 - this.dicePhysics.angularDamping * deltaTime);
        die.angularVelocity.y *= (1 - this.dicePhysics.angularDamping * deltaTime);
        die.angularVelocity.z *= (1 - this.dicePhysics.angularDamping * deltaTime);
        
        // Check for ground collision
        if (die.position.y <= 0) {
          die.position.y = 0;
          die.velocity.y = -die.velocity.y * this.dicePhysics.restitution;
          die.velocity.x *= (1 - this.dicePhysics.friction);
          die.velocity.z *= (1 - this.dicePhysics.friction);
          
          // Stop if velocity is low
          if (Math.abs(die.velocity.y) < 0.1 && 
              Math.abs(die.velocity.x) < 0.1 && 
              Math.abs(die.velocity.z) < 0.1) {
            die.velocity = null; // Dice has settled
          }
        }
      }
    }
  }
  
  /**
   * Get system info
   */
  getInfo() {
    return {
      name: 'DiceGameSystem',
      version: '1.0.0',
      phase: 'Phase 8 - Mini-Games',
      enabled: this.enabled,
      gameModes: Object.keys(this.gameModes).length,
      achievements: this.achievements.length,
      playerBalance: this.playerStats.balance,
      gamesPlayed: this.playerStats.gamesPlayed,
      externalAssets: {
        models: 'Sketchfab Free (dice, tables, chips)',
        environment: 'Quaternius Casino Pack',
        ui: 'Kenney UI Pack + game-icons.net',
        audio: 'Freesound'
      }
    };
  }
}
