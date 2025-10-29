/**
 * CasinoGamesSystem.js
 * Phase 8 - Casino Games System
 * Blackjack, Slots, Poker, and other gambling mini-games
 * ~500 lines
 */

export class CasinoGamesSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // Casino currency
        this.chips = 1000; // Starting chips
        this.totalWinnings = 0;
        this.totalLosses = 0;
        
        // Game states
        this.activeGames = new Map();
        
        // Casino statistics
        this.stats = {
            blackjackGames: 0,
            blackjackWins: 0,
            slotsSpins: 0,
            slotsWins: 0,
            pokerHands: 0,
            pokerWins: 0,
            biggestWin: 0,
            biggestLoss: 0
        };
        
        // Slot machine configurations
        this.slotSymbols = ['🍒', '🍋', '🍊', '🍇', '💎', '7️⃣', '🔔', '⭐'];
        this.slotPayouts = {
            '🍒🍒🍒': 5,
            '🍋🍋🍋': 10,
            '🍊🍊🍊': 15,
            '🍇🍇🍇': 20,
            '💎💎💎': 50,
            '7️⃣7️⃣7️⃣': 100,
            '🔔🔔🔔': 75,
            '⭐⭐⭐': 150
        };
    }
    
    /**
     * Start Blackjack game
     */
    startBlackjack(bet) {
        if (bet > this.chips) {
            return { success: false, message: 'Not enough chips' };
        }
        
        if (bet < 10) {
            return { success: false, message: 'Minimum bet is 10 chips' };
        }
        
        const gameId = `blackjack_${Date.now()}`;
        const deck = this.createDeck();
        this.shuffleDeck(deck);
        
        const game = {
            id: gameId,
            type: 'blackjack',
            bet: bet,
            deck: deck,
            playerHand: [],
            dealerHand: [],
            stage: 'dealing',
            result: null
        };
        
        // Deal initial cards
        game.playerHand.push(this.drawCard(game.deck));
        game.dealerHand.push(this.drawCard(game.deck));
        game.playerHand.push(this.drawCard(game.deck));
        game.dealerHand.push(this.drawCard(game.deck));
        
        game.stage = 'player_turn';
        
        // Deduct bet
        this.chips -= bet;
        
        // Check for blackjack
        if (this.calculateHandValue(game.playerHand) === 21) {
            return this.resolveBlackjack(gameId);
        }
        
        this.activeGames.set(gameId, game);
        this.stats.blackjackGames++;
        
        return {
            success: true,
            gameId: gameId,
            playerHand: game.playerHand,
            dealerUpCard: game.dealerHand[0],
            playerValue: this.calculateHandValue(game.playerHand)
        };
    }
    
    /**
     * Hit in Blackjack
     */
    blackjackHit(gameId) {
        const game = this.activeGames.get(gameId);
        if (!game || game.type !== 'blackjack' || game.stage !== 'player_turn') {
            return { success: false, message: 'Invalid game state' };
        }
        
        game.playerHand.push(this.drawCard(game.deck));
        const value = this.calculateHandValue(game.playerHand);
        
        if (value > 21) {
            // Bust
            game.stage = 'complete';
            game.result = 'bust';
            this.totalLosses += game.bet;
            if (game.bet > this.stats.biggestLoss) {
                this.stats.biggestLoss = game.bet;
            }
            return {
                success: true,
                playerHand: game.playerHand,
                playerValue: value,
                result: 'bust',
                chips: this.chips
            };
        }
        
        return {
            success: true,
            playerHand: game.playerHand,
            playerValue: value
        };
    }
    
    /**
     * Stand in Blackjack
     */
    blackjackStand(gameId) {
        const game = this.activeGames.get(gameId);
        if (!game || game.type !== 'blackjack' || game.stage !== 'player_turn') {
            return { success: false, message: 'Invalid game state' };
        }
        
        game.stage = 'dealer_turn';
        
        // Dealer draws to 17
        while (this.calculateHandValue(game.dealerHand) < 17) {
            game.dealerHand.push(this.drawCard(game.deck));
        }
        
        return this.resolveBlackjack(gameId);
    }
    
    /**
     * Resolve Blackjack game
     */
    resolveBlackjack(gameId) {
        const game = this.activeGames.get(gameId);
        if (!game) return null;
        
        const playerValue = this.calculateHandValue(game.playerHand);
        const dealerValue = this.calculateHandValue(game.dealerHand);
        
        let winnings = 0;
        let result;
        
        if (playerValue === 21 && game.playerHand.length === 2) {
            // Blackjack! 3:2 payout
            result = 'blackjack';
            winnings = game.bet * 2.5;
        } else if (dealerValue > 21) {
            // Dealer bust
            result = 'dealer_bust';
            winnings = game.bet * 2;
        } else if (playerValue > dealerValue) {
            // Player wins
            result = 'win';
            winnings = game.bet * 2;
        } else if (playerValue === dealerValue) {
            // Push
            result = 'push';
            winnings = game.bet;
        } else {
            // Dealer wins
            result = 'loss';
            winnings = 0;
        }
        
        this.chips += winnings;
        const profit = winnings - game.bet;
        
        if (profit > 0) {
            this.totalWinnings += profit;
            this.stats.blackjackWins++;
            if (profit > this.stats.biggestWin) {
                this.stats.biggestWin = profit;
            }
        } else if (profit < 0) {
            this.totalLosses += Math.abs(profit);
        }
        
        game.stage = 'complete';
        game.result = result;
        game.winnings = winnings;
        
        this.activeGames.delete(gameId);
        
        return {
            success: true,
            result: result,
            playerHand: game.playerHand,
            dealerHand: game.dealerHand,
            playerValue: playerValue,
            dealerValue: dealerValue,
            winnings: winnings,
            profit: profit,
            chips: this.chips
        };
    }
    
    /**
     * Spin slot machine
     */
    spinSlots(bet) {
        if (bet > this.chips) {
            return { success: false, message: 'Not enough chips' };
        }
        
        if (bet < 1) {
            return { success: false, message: 'Minimum bet is 1 chip' };
        }
        
        this.chips -= bet;
        this.stats.slotsSpins++;
        
        // Generate random result
        const reel1 = this.slotSymbols[Math.floor(Math.random() * this.slotSymbols.length)];
        const reel2 = this.slotSymbols[Math.floor(Math.random() * this.slotSymbols.length)];
        const reel3 = this.slotSymbols[Math.floor(Math.random() * this.slotSymbols.length)];
        
        const result = `${reel1}${reel2}${reel3}`;
        const payout = this.slotPayouts[result] || 0;
        const winnings = payout * bet;
        
        this.chips += winnings;
        const profit = winnings - bet;
        
        if (winnings > 0) {
            this.stats.slotsWins++;
            this.totalWinnings += profit;
            if (profit > this.stats.biggestWin) {
                this.stats.biggestWin = profit;
            }
        } else {
            this.totalLosses += bet;
        }
        
        return {
            success: true,
            reels: [reel1, reel2, reel3],
            payout: payout,
            winnings: winnings,
            profit: profit,
            chips: this.chips
        };
    }
    
    /**
     * Start Poker game (simplified 5-card draw)
     */
    startPoker(bet) {
        if (bet > this.chips) {
            return { success: false, message: 'Not enough chips' };
        }
        
        if (bet < 20) {
            return { success: false, message: 'Minimum bet is 20 chips' };
        }
        
        const gameId = `poker_${Date.now()}`;
        const deck = this.createDeck();
        this.shuffleDeck(deck);
        
        const game = {
            id: gameId,
            type: 'poker',
            bet: bet,
            deck: deck,
            hand: [],
            discarded: [],
            stage: 'initial_deal'
        };
        
        // Deal 5 cards
        for (let i = 0; i < 5; i++) {
            game.hand.push(this.drawCard(game.deck));
        }
        
        game.stage = 'draw';
        this.chips -= bet;
        
        this.activeGames.set(gameId, game);
        this.stats.pokerHands++;
        
        return {
            success: true,
            gameId: gameId,
            hand: game.hand
        };
    }
    
    /**
     * Draw cards in Poker
     */
    pokerDraw(gameId, cardIndices) {
        const game = this.activeGames.get(gameId);
        if (!game || game.type !== 'poker' || game.stage !== 'draw') {
            return { success: false, message: 'Invalid game state' };
        }
        
        // Discard and draw new cards
        for (const index of cardIndices) {
            if (index >= 0 && index < game.hand.length) {
                game.discarded.push(game.hand[index]);
                game.hand[index] = this.drawCard(game.deck);
            }
        }
        
        return this.resolvePoker(gameId);
    }
    
    /**
     * Resolve Poker game
     */
    resolvePoker(gameId) {
        const game = this.activeGames.get(gameId);
        if (!game) return null;
        
        const handRank = this.evaluatePokerHand(game.hand);
        const payouts = {
            'Royal Flush': 800,
            'Straight Flush': 50,
            'Four of a Kind': 25,
            'Full House': 9,
            'Flush': 6,
            'Straight': 4,
            'Three of a Kind': 3,
            'Two Pair': 2,
            'Pair (Jacks or Better)': 1
        };
        
        const payout = payouts[handRank] || 0;
        const winnings = payout * game.bet;
        
        this.chips += winnings;
        const profit = winnings - game.bet;
        
        if (winnings > 0) {
            this.stats.pokerWins++;
            this.totalWinnings += profit;
            if (profit > this.stats.biggestWin) {
                this.stats.biggestWin = profit;
            }
        } else {
            this.totalLosses += game.bet;
        }
        
        game.stage = 'complete';
        this.activeGames.delete(gameId);
        
        return {
            success: true,
            hand: game.hand,
            handRank: handRank,
            payout: payout,
            winnings: winnings,
            profit: profit,
            chips: this.chips
        };
    }
    
    /**
     * Card deck utilities
     */
    createDeck() {
        const suits = ['♠', '♥', '♦', '♣'];
        const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        const deck = [];
        
        for (const suit of suits) {
            for (const rank of ranks) {
                deck.push({ rank, suit });
            }
        }
        
        return deck;
    }
    
    shuffleDeck(deck) {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
    }
    
    drawCard(deck) {
        return deck.pop();
    }
    
    /**
     * Calculate Blackjack hand value
     */
    calculateHandValue(hand) {
        let value = 0;
        let aces = 0;
        
        for (const card of hand) {
            if (card.rank === 'A') {
                aces++;
                value += 11;
            } else if (['J', 'Q', 'K'].includes(card.rank)) {
                value += 10;
            } else {
                value += parseInt(card.rank);
            }
        }
        
        // Adjust for aces
        while (value > 21 && aces > 0) {
            value -= 10;
            aces--;
        }
        
        return value;
    }
    
    /**
     * Evaluate Poker hand (simplified)
     */
    evaluatePokerHand(hand) {
        const ranks = hand.map(c => c.rank);
        const suits = hand.map(c => c.suit);
        const rankCounts = {};
        
        for (const rank of ranks) {
            rankCounts[rank] = (rankCounts[rank] || 0) + 1;
        }
        
        const counts = Object.values(rankCounts).sort((a, b) => b - a);
        const isFlush = suits.every(s => s === suits[0]);
        const rankValues = {'A': 14, 'K': 13, 'Q': 12, 'J': 11};
        for (let i = 2; i <= 10; i++) rankValues[i.toString()] = i;
        
        const sortedValues = ranks.map(r => rankValues[r]).sort((a, b) => a - b);
        const isStraight = sortedValues.every((v, i) => i === 0 || v === sortedValues[i - 1] + 1);
        const isRoyalFlush = isStraight && isFlush && sortedValues[0] === 10;
        
        if (isRoyalFlush) return 'Royal Flush';
        if (isStraight && isFlush) return 'Straight Flush';
        if (counts[0] === 4) return 'Four of a Kind';
        if (counts[0] === 3 && counts[1] === 2) return 'Full House';
        if (isFlush) return 'Flush';
        if (isStraight) return 'Straight';
        if (counts[0] === 3) return 'Three of a Kind';
        if (counts[0] === 2 && counts[1] === 2) return 'Two Pair';
        if (counts[0] === 2 && ['J', 'Q', 'K', 'A'].includes(Object.keys(rankCounts).find(r => rankCounts[r] === 2))) {
            return 'Pair (Jacks or Better)';
        }
        
        return 'High Card';
    }
    
    /**
     * Buy chips
     */
    buyChips(amount) {
        const cost = amount; // 1:1 gold to chips conversion
        
        if (this.gameEngine.economySystem) {
            if (!this.gameEngine.economySystem.canAfford(cost)) {
                return { success: false, message: 'Not enough gold' };
            }
            this.gameEngine.economySystem.spendGold(cost);
        }
        
        this.chips += amount;
        return { success: true, chips: this.chips };
    }
    
    /**
     * Cash out chips
     */
    cashOutChips(amount) {
        if (amount > this.chips) {
            return { success: false, message: 'Not enough chips' };
        }
        
        this.chips -= amount;
        
        if (this.gameEngine.economySystem) {
            this.gameEngine.economySystem.addGold(amount);
        }
        
        return { success: true, chips: this.chips, gold: amount };
    }
    
    /**
     * Get casino statistics
     */
    getStats() {
        return {
            chips: this.chips,
            totalWinnings: this.totalWinnings,
            totalLosses: this.totalLosses,
            netProfit: this.totalWinnings - this.totalLosses,
            ...this.stats
        };
    }
    
    /**
     * Save casino progress
     */
    save() {
        const data = {
            chips: this.chips,
            totalWinnings: this.totalWinnings,
            totalLosses: this.totalLosses,
            stats: this.stats
        };
        localStorage.setItem('casino_data', JSON.stringify(data));
    }
    
    /**
     * Load casino progress
     */
    load() {
        const saved = localStorage.getItem('casino_data');
        if (!saved) return;
        
        try {
            const data = JSON.parse(saved);
            this.chips = data.chips || 1000;
            this.totalWinnings = data.totalWinnings || 0;
            this.totalLosses = data.totalLosses || 0;
            this.stats = data.stats || this.stats;
        } catch (error) {
            console.error('Failed to load casino data:', error);
        }
    }
}
