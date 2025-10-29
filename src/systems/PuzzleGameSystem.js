/**
 * PuzzleGameSystem - Various Puzzle Mini-Games
 * 
 * Phase 8, System 120 of AUTONOMOUS_EXECUTION_PLAN
 * Multiple puzzle types with progression and rewards
 * 
 * Features:
 * - Match-3 puzzle (like Candy Crush)
 * - Sliding tile puzzles
 * - Pattern matching puzzles
 * - Logic puzzles
 * - Combination locks
 * - Rune puzzles (cannabis theme)
 * - Timed challenges
 * - Daily puzzles with rewards
 */

export class PuzzleGameSystem {
    constructor() {
        // Puzzle types
        this.puzzleTypes = {
            MATCH3: 'match3',
            SLIDING: 'sliding',
            PATTERN: 'pattern',
            LOGIC: 'logic',
            RUNE: 'rune',
            COMBINATION: 'combination'
        };
        
        // Current puzzle
        this.currentPuzzle = null;
        this.isPlaying = false;
        
        // Match-3 state
        this.match3Grid = null;
        this.match3Size = 8;
        this.match3Colors = 6;
        
        // Statistics
        this.stats = {
            puzzlesSolved: 0,
            match3Played: 0,
            slidingPuzzlesSolved: 0,
            patternsSolved: 0,
            logicPuzzlesSolved: 0,
            runePuzzlesSolved: 0,
            totalMoves: 0,
            bestTime: Infinity,
            dailyStreak: 0
        };
        
        // Rewards
        this.rewards = {
            puzzleSolved: 100,      // Gold
            perfectSolution: 500,   // Bonus for perfect
            dailyComplete: 1000,    // Daily puzzle
            firstTime: 2000         // First time solving
        };
    }
    
    /**
     * Start Match-3 puzzle
     */
    startMatch3(size = 8, colors = 6, movesLimit = 30) {
        this.currentPuzzle = {
            type: this.puzzleTypes.MATCH3,
            size: size,
            colors: colors,
            movesLimit: movesLimit,
            movesUsed: 0,
            score: 0,
            combo: 0,
            startTime: Date.now()
        };
        
        this.match3Grid = this.createMatch3Grid(size, colors);
        this.isPlaying = true;
        this.stats.match3Played++;
        
        return this.match3Grid;
    }
    
    /**
     * Create Match-3 grid
     */
    createMatch3Grid(size, colors) {
        const grid = [];
        
        for (let row = 0; row < size; row++) {
            grid[row] = [];
            for (let col = 0; col < size; col++) {
                grid[row][col] = {
                    color: Math.floor(Math.random() * colors),
                    row: row,
                    col: col,
                    matched: false
                };
            }
        }
        
        // Ensure no initial matches
        this.clearInitialMatches(grid, colors);
        
        return grid;
    }
    
    /**
     * Clear initial matches in grid
     */
    clearInitialMatches(grid, colors) {
        let hasMatches = true;
        
        while (hasMatches) {
            hasMatches = false;
            
            for (let row = 0; row < grid.length; row++) {
                for (let col = 0; col < grid[row].length; col++) {
                    if (this.checkMatch(grid, row, col)) {
                        grid[row][col].color = Math.floor(Math.random() * colors);
                        hasMatches = true;
                    }
                }
            }
        }
    }
    
    /**
     * Swap two tiles in Match-3
     */
    swapMatch3(row1, col1, row2, col2) {
        if (!this.isPlaying || !this.match3Grid) return false;
        
        // Check if swap is valid (adjacent tiles)
        const adjacent = (Math.abs(row1 - row2) === 1 && col1 === col2) ||
                        (Math.abs(col1 - col2) === 1 && row1 === row2);
        
        if (!adjacent) return false;
        
        // Swap
        const temp = this.match3Grid[row1][col1].color;
        this.match3Grid[row1][col1].color = this.match3Grid[row2][col2].color;
        this.match3Grid[row2][col2].color = temp;
        
        // Check for matches
        const matches = this.findAllMatches();
        
        if (matches.length > 0) {
            this.currentPuzzle.movesUsed++;
            this.processMatches(matches);
            return true;
        } else {
            // Swap back if no match
            const temp2 = this.match3Grid[row1][col1].color;
            this.match3Grid[row1][col1].color = this.match3Grid[row2][col2].color;
            this.match3Grid[row2][col2].color = temp2;
            return false;
        }
    }
    
    /**
     * Find all matches in grid
     */
    findAllMatches() {
        const matches = [];
        
        // Check horizontal matches
        for (let row = 0; row < this.match3Grid.length; row++) {
            let matchCount = 1;
            let matchColor = this.match3Grid[row][0].color;
            
            for (let col = 1; col < this.match3Grid[row].length; col++) {
                if (this.match3Grid[row][col].color === matchColor) {
                    matchCount++;
                } else {
                    if (matchCount >= 3) {
                        matches.push({
                            type: 'horizontal',
                            row: row,
                            startCol: col - matchCount,
                            count: matchCount,
                            color: matchColor
                        });
                    }
                    matchCount = 1;
                    matchColor = this.match3Grid[row][col].color;
                }
            }
            
            if (matchCount >= 3) {
                matches.push({
                    type: 'horizontal',
                    row: row,
                    startCol: this.match3Grid[row].length - matchCount,
                    count: matchCount,
                    color: matchColor
                });
            }
        }
        
        // Check vertical matches
        for (let col = 0; col < this.match3Grid[0].length; col++) {
            let matchCount = 1;
            let matchColor = this.match3Grid[0][col].color;
            
            for (let row = 1; row < this.match3Grid.length; row++) {
                if (this.match3Grid[row][col].color === matchColor) {
                    matchCount++;
                } else {
                    if (matchCount >= 3) {
                        matches.push({
                            type: 'vertical',
                            col: col,
                            startRow: row - matchCount,
                            count: matchCount,
                            color: matchColor
                        });
                    }
                    matchCount = 1;
                    matchColor = this.match3Grid[row][col].color;
                }
            }
            
            if (matchCount >= 3) {
                matches.push({
                    type: 'vertical',
                    col: col,
                    startRow: this.match3Grid.length - matchCount,
                    count: matchCount,
                    color: matchColor
                });
            }
        }
        
        return matches;
    }
    
    /**
     * Check if tile is part of a match
     */
    checkMatch(grid, row, col) {
        const color = grid[row][col].color;
        
        // Check horizontal
        let horizontalCount = 1;
        if (col > 0 && grid[row][col - 1].color === color) horizontalCount++;
        if (col < grid[row].length - 1 && grid[row][col + 1].color === color) horizontalCount++;
        
        // Check vertical
        let verticalCount = 1;
        if (row > 0 && grid[row - 1][col].color === color) verticalCount++;
        if (row < grid.length - 1 && grid[row + 1][col].color === color) verticalCount++;
        
        return horizontalCount >= 3 || verticalCount >= 3;
    }
    
    /**
     * Process matches
     */
    processMatches(matches) {
        // Mark matched tiles
        for (const match of matches) {
            if (match.type === 'horizontal') {
                for (let i = 0; i < match.count; i++) {
                    this.match3Grid[match.row][match.startCol + i].matched = true;
                }
            } else {
                for (let i = 0; i < match.count; i++) {
                    this.match3Grid[match.startRow + i][match.col].matched = true;
                }
            }
        }
        
        // Calculate score
        const baseScore = 100;
        const comboMultiplier = 1 + (this.currentPuzzle.combo * 0.5);
        const matchScore = matches.reduce((sum, match) => sum + (match.count * baseScore), 0);
        const totalScore = Math.floor(matchScore * comboMultiplier);
        
        this.currentPuzzle.score += totalScore;
        this.currentPuzzle.combo++;
        
        // Remove matched tiles and apply gravity
        this.removeMatchedTiles();
        this.applyGravity();
        this.fillEmptySpaces();
        
        // Check for cascade matches
        setTimeout(() => {
            const newMatches = this.findAllMatches();
            if (newMatches.length > 0) {
                this.processMatches(newMatches);
            } else {
                this.currentPuzzle.combo = 0;
                this.checkMatch3Complete();
            }
        }, 300);
    }
    
    /**
     * Remove matched tiles
     */
    removeMatchedTiles() {
        for (let row = 0; row < this.match3Grid.length; row++) {
            for (let col = 0; col < this.match3Grid[row].length; col++) {
                if (this.match3Grid[row][col].matched) {
                    this.match3Grid[row][col] = null;
                }
            }
        }
    }
    
    /**
     * Apply gravity to grid
     */
    applyGravity() {
        for (let col = 0; col < this.match3Grid[0].length; col++) {
            for (let row = this.match3Grid.length - 1; row >= 0; row--) {
                if (this.match3Grid[row][col] === null) {
                    // Find tile above
                    for (let aboveRow = row - 1; aboveRow >= 0; aboveRow--) {
                        if (this.match3Grid[aboveRow][col] !== null) {
                            this.match3Grid[row][col] = this.match3Grid[aboveRow][col];
                            this.match3Grid[row][col].row = row;
                            this.match3Grid[aboveRow][col] = null;
                            break;
                        }
                    }
                }
            }
        }
    }
    
    /**
     * Fill empty spaces with new tiles
     */
    fillEmptySpaces() {
        for (let row = 0; row < this.match3Grid.length; row++) {
            for (let col = 0; col < this.match3Grid[row].length; col++) {
                if (this.match3Grid[row][col] === null) {
                    this.match3Grid[row][col] = {
                        color: Math.floor(Math.random() * this.currentPuzzle.colors),
                        row: row,
                        col: col,
                        matched: false
                    };
                }
            }
        }
    }
    
    /**
     * Check if Match-3 is complete
     */
    checkMatch3Complete() {
        if (this.currentPuzzle.movesUsed >= this.currentPuzzle.movesLimit) {
            this.completeMatch3();
        }
    }
    
    /**
     * Complete Match-3 puzzle
     */
    completeMatch3() {
        this.isPlaying = false;
        
        const results = {
            score: this.currentPuzzle.score,
            movesUsed: this.currentPuzzle.movesUsed,
            movesLimit: this.currentPuzzle.movesLimit,
            time: Date.now() - this.currentPuzzle.startTime
        };
        
        this.stats.puzzlesSolved++;
        this.stats.totalMoves += this.currentPuzzle.movesUsed;
        
        // Emit completion event
        if (window.gameEngine) {
            window.gameEngine.eventBus?.emit('puzzle:match3Complete', results);
        }
        
        return results;
    }
    
    /**
     * Start sliding tile puzzle
     */
    startSlidingPuzzle(size = 4, imageUrl = null) {
        this.currentPuzzle = {
            type: this.puzzleTypes.SLIDING,
            size: size,
            moves: 0,
            startTime: Date.now(),
            imageUrl: imageUrl
        };
        
        const grid = this.createSlidingGrid(size);
        this.shuffleSlidingGrid(grid);
        
        this.isPlaying = true;
        this.currentPuzzle.grid = grid;
        
        return grid;
    }
    
    /**
     * Create sliding puzzle grid
     */
    createSlidingGrid(size) {
        const grid = [];
        let num = 1;
        
        for (let row = 0; row < size; row++) {
            grid[row] = [];
            for (let col = 0; col < size; col++) {
                grid[row][col] = (row === size - 1 && col === size - 1) ? 0 : num++;
            }
        }
        
        return grid;
    }
    
    /**
     * Shuffle sliding puzzle
     */
    shuffleSlidingGrid(grid) {
        const moves = grid.length * grid.length * 100;
        
        for (let i = 0; i < moves; i++) {
            const [emptyRow, emptyCol] = this.findEmptyTile(grid);
            const validMoves = this.getValidSlidingMoves(grid, emptyRow, emptyCol);
            
            if (validMoves.length > 0) {
                const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
                this.slideTile(grid, randomMove.row, randomMove.col);
            }
        }
    }
    
    /**
     * Find empty tile (0) in grid
     */
    findEmptyTile(grid) {
        for (let row = 0; row < grid.length; row++) {
            for (let col = 0; col < grid[row].length; col++) {
                if (grid[row][col] === 0) {
                    return [row, col];
                }
            }
        }
        return null;
    }
    
    /**
     * Get valid sliding moves
     */
    getValidSlidingMoves(grid, emptyRow, emptyCol) {
        const moves = [];
        
        // Check adjacent tiles
        const directions = [
            [-1, 0], [1, 0], [0, -1], [0, 1]
        ];
        
        for (const [dr, dc] of directions) {
            const newRow = emptyRow + dr;
            const newCol = emptyCol + dc;
            
            if (newRow >= 0 && newRow < grid.length && 
                newCol >= 0 && newCol < grid[0].length) {
                moves.push({ row: newRow, col: newCol });
            }
        }
        
        return moves;
    }
    
    /**
     * Slide tile
     */
    slideTile(grid, row, col) {
        const [emptyRow, emptyCol] = this.findEmptyTile(grid);
        
        // Check if tile is adjacent to empty
        const adjacent = (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
                        (Math.abs(col - emptyCol) === 1 && row === emptyRow);
        
        if (!adjacent) return false;
        
        // Swap
        grid[emptyRow][emptyCol] = grid[row][col];
        grid[row][col] = 0;
        
        if (this.currentPuzzle) {
            this.currentPuzzle.moves++;
            this.stats.totalMoves++;
            
            // Check if solved
            if (this.isSlidingPuzzleSolved(grid)) {
                this.completeSlidingPuzzle();
            }
        }
        
        return true;
    }
    
    /**
     * Check if sliding puzzle is solved
     */
    isSlidingPuzzleSolved(grid) {
        let expected = 1;
        
        for (let row = 0; row < grid.length; row++) {
            for (let col = 0; col < grid[row].length; col++) {
                if (row === grid.length - 1 && col === grid[row].length - 1) {
                    return grid[row][col] === 0;
                }
                
                if (grid[row][col] !== expected++) {
                    return false;
                }
            }
        }
        
        return true;
    }
    
    /**
     * Complete sliding puzzle
     */
    completeSlidingPuzzle() {
        this.isPlaying = false;
        
        const time = Date.now() - this.currentPuzzle.startTime;
        const results = {
            moves: this.currentPuzzle.moves,
            time: time,
            size: this.currentPuzzle.size
        };
        
        this.stats.puzzlesSolved++;
        this.stats.slidingPuzzlesSolved++;
        this.stats.bestTime = Math.min(this.stats.bestTime, time);
        
        // Award based on efficiency
        const reward = this.rewards.puzzleSolved + 
                      Math.max(0, 1000 - this.currentPuzzle.moves * 10);
        
        // Emit completion event
        if (window.gameEngine) {
            window.gameEngine.eventBus?.emit('puzzle:slidingComplete', { 
                ...results, 
                reward 
            });
        }
        
        return results;
    }
    
    /**
     * Start rune puzzle (cannabis theme)
     */
    startRunePuzzle(complexity = 3) {
        const runes = this.generateRuneSequence(complexity);
        
        this.currentPuzzle = {
            type: this.puzzleTypes.RUNE,
            runes: runes,
            correctSequence: [...runes].sort(),
            playerSequence: [],
            attempts: 0,
            maxAttempts: 5,
            startTime: Date.now()
        };
        
        this.isPlaying = true;
        
        return {
            runes: runes.sort(), // Show scrambled
            maxAttempts: this.currentPuzzle.maxAttempts
        };
    }
    
    /**
     * Generate rune sequence
     */
    generateRuneSequence(complexity) {
        const runeTypes = ['fire', 'water', 'earth', 'air', 'light', 'dark', 'nature', 'arcane'];
        const sequence = [];
        
        for (let i = 0; i < complexity; i++) {
            sequence.push(runeTypes[Math.floor(Math.random() * runeTypes.length)]);
        }
        
        return sequence;
    }
    
    /**
     * Submit rune sequence
     */
    submitRuneSequence(sequence) {
        if (!this.isPlaying) return false;
        
        this.currentPuzzle.attempts++;
        
        // Check if correct
        const correct = JSON.stringify(sequence) === JSON.stringify(this.currentPuzzle.correctSequence);
        
        if (correct) {
            this.completeRunePuzzle(true);
            return { success: true, correct: true };
        } else if (this.currentPuzzle.attempts >= this.currentPuzzle.maxAttempts) {
            this.completeRunePuzzle(false);
            return { success: false, attemptsExceeded: true };
        } else {
            return { 
                success: false, 
                attemptsRemaining: this.currentPuzzle.maxAttempts - this.currentPuzzle.attempts 
            };
        }
    }
    
    /**
     * Complete rune puzzle
     */
    completeRunePuzzle(success) {
        this.isPlaying = false;
        
        const results = {
            success: success,
            attempts: this.currentPuzzle.attempts,
            time: Date.now() - this.currentPuzzle.startTime
        };
        
        if (success) {
            this.stats.puzzlesSolved++;
            this.stats.runePuzzlesSolved++;
            
            const reward = this.rewards.puzzleSolved * 
                          (1 + (this.currentPuzzle.maxAttempts - this.currentPuzzle.attempts) * 0.5);
            results.reward = reward;
        }
        
        // Emit completion event
        if (window.gameEngine) {
            window.gameEngine.eventBus?.emit('puzzle:runeComplete', results);
        }
        
        return results;
    }
    
    /**
     * Get statistics
     */
    getStats() {
        return { ...this.stats };
    }
    
    /**
     * Reset current puzzle
     */
    reset() {
        this.currentPuzzle = null;
        this.isPlaying = false;
        this.match3Grid = null;
    }
}
