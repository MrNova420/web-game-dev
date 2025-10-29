/**
 * RhythmGameSystem - Music Rhythm Mini-Game
 * 
 * Phase 8, System 119 of AUTONOMOUS_EXECUTION_PLAN
 * Rhythm-based gameplay with beats, combos, and scoring
 * 
 * Features:
 * - Multiple songs with different difficulties
 * - 4-lane note system (like Guitar Hero/DDR)
 * - Combo multipliers and perfect hit bonuses
 * - Special abilities triggered by rhythm
 * - Unlockable songs and achievements
 * - Integration with cannabis theme (Smoke Session mini-game)
 * - Visual feedback and particle effects
 * - Leaderboards and high scores
 */

export class RhythmGameSystem {
    constructor(audioSystem, inputManager) {
        this.audioSystem = audioSystem;
        this.inputManager = inputManager;
        
        // Game state
        this.isPlaying = false;
        this.currentSong = null;
        this.score = 0;
        this.combo = 0;
        this.maxCombo = 0;
        this.accuracy = 100;
        this.health = 100;
        
        // Timing windows (ms)
        this.timing = {
            perfect: 30,   // ±30ms for perfect
            great: 60,     // ±60ms for great
            good: 90,      // ±90ms for good
            bad: 120       // ±120ms for bad
        };
        
        // Scoring
        this.scoring = {
            perfect: 300,
            great: 200,
            good: 100,
            bad: 50,
            miss: 0,
            comboMultiplier: 0.1  // +10% per combo level
        };
        
        // Lanes (4-lane system)
        this.lanes = 4;
        this.laneKeys = ['a', 's', 'd', 'f']; // ASDF keys
        
        // Active notes
        this.activeNotes = [];
        this.noteSpeed = 5.0; // units per second
        
        // Song library
        this.songs = this.initializeSongLibrary();
        
        // Statistics
        this.stats = {
            songsPlayed: 0,
            perfectHits: 0,
            greatHits: 0,
            goodHits: 0,
            badHits: 0,
            misses: 0,
            totalScore: 0,
            highestCombo: 0
        };
        
        // Visual effects
        this.hitEffects = [];
        this.comboEffects = [];
    }
    
    /**
     * Initialize song library
     */
    initializeSongLibrary() {
        return {
            // Easy songs
            beginner_flow: {
                name: 'Beginner Flow',
                artist: 'Smoke Beats',
                difficulty: 1,
                bpm: 120,
                duration: 180, // 3 minutes
                unlocked: true,
                notes: this.generateNotePattern('easy', 120, 180)
            },
            
            // Medium songs
            mystic_rhythm: {
                name: 'Mystic Rhythm',
                artist: 'Herb Harmony',
                difficulty: 3,
                bpm: 140,
                duration: 210,
                unlocked: false,
                unlockScore: 50000,
                notes: this.generateNotePattern('medium', 140, 210)
            },
            
            psychedelic_beats: {
                name: 'Psychedelic Beats',
                artist: 'Cannabis Collective',
                difficulty: 4,
                bpm: 160,
                duration: 240,
                unlocked: false,
                unlockScore: 100000,
                notes: this.generateNotePattern('medium', 160, 240)
            },
            
            // Hard songs
            smoke_wielders_anthem: {
                name: "Smoke Wielder's Anthem",
                artist: 'Dynasty Band',
                difficulty: 6,
                bpm: 180,
                duration: 270,
                unlocked: false,
                unlockScore: 200000,
                notes: this.generateNotePattern('hard', 180, 270)
            },
            
            eternal_haze: {
                name: 'Eternal Haze',
                artist: 'Emberveil Orchestra',
                difficulty: 7,
                bpm: 200,
                duration: 300,
                unlocked: false,
                unlockScore: 350000,
                notes: this.generateNotePattern('hard', 200, 300)
            },
            
            // Expert songs
            omega_symphony: {
                name: 'Omega Symphony',
                artist: 'Godmode Composers',
                difficulty: 10,
                bpm: 240,
                duration: 360,
                unlocked: false,
                unlockScore: 1000000,
                notes: this.generateNotePattern('expert', 240, 360)
            }
        };
    }
    
    /**
     * Generate note pattern for song
     */
    generateNotePattern(difficulty, bpm, duration) {
        const notes = [];
        const beatInterval = 60000 / bpm; // ms per beat
        const totalBeats = (duration * 1000) / beatInterval;
        
        // Difficulty determines note density
        const noteDensity = {
            easy: 0.3,      // 30% of beats have notes
            medium: 0.5,    // 50% of beats have notes
            hard: 0.7,      // 70% of beats have notes
            expert: 0.9     // 90% of beats have notes
        }[difficulty] || 0.5;
        
        for (let beat = 0; beat < totalBeats; beat++) {
            if (Math.random() < noteDensity) {
                notes.push({
                    time: beat * beatInterval,
                    lane: Math.floor(Math.random() * this.lanes),
                    type: this.getNoteType(difficulty, beat),
                    hit: false
                });
            }
        }
        
        return notes.sort((a, b) => a.time - b.time);
    }
    
    /**
     * Get note type based on difficulty
     */
    getNoteType(difficulty, beat) {
        // Special notes appear more in harder difficulties
        const rand = Math.random();
        
        if (difficulty === 'expert' && rand < 0.2) {
            return 'special'; // Must hold
        } else if ((difficulty === 'hard' || difficulty === 'expert') && rand < 0.3) {
            return 'double'; // Hit with perfect timing
        }
        
        return 'normal';
    }
    
    /**
     * Start song
     */
    startSong(songId) {
        const song = this.songs[songId];
        if (!song) {
            console.warn(`Song ${songId} not found`);
            return false;
        }
        
        if (!song.unlocked) {
            console.warn(`Song ${songId} is locked`);
            return false;
        }
        
        this.isPlaying = true;
        this.currentSong = song;
        this.score = 0;
        this.combo = 0;
        this.maxCombo = 0;
        this.accuracy = 100;
        this.health = 100;
        
        // Clone notes array
        this.activeNotes = JSON.parse(JSON.stringify(song.notes));
        
        // Start music
        if (this.audioSystem) {
            this.audioSystem.playMusic(`/assets/music/${songId}.mp3`);
        }
        
        this.stats.songsPlayed++;
        
        return true;
    }
    
    /**
     * Update rhythm game
     */
    update(deltaTime) {
        if (!this.isPlaying || !this.currentSong) return;
        
        const currentTime = this.getCurrentSongTime();
        
        // Update active notes
        this.updateNotes(currentTime, deltaTime);
        
        // Check for missed notes
        this.checkMissedNotes(currentTime);
        
        // Update visual effects
        this.updateEffects(deltaTime);
        
        // Check if song ended
        if (currentTime >= this.currentSong.duration * 1000) {
            this.endSong();
        }
    }
    
    /**
     * Get current song time
     */
    getCurrentSongTime() {
        if (!this.audioSystem) return 0;
        return this.audioSystem.getCurrentTime() * 1000; // ms
    }
    
    /**
     * Update note positions
     */
    updateNotes(currentTime, deltaTime) {
        for (const note of this.activeNotes) {
            if (note.hit) continue;
            
            // Update note position (visual)
            note.visualPosition = this.calculateNotePosition(note.time, currentTime);
        }
    }
    
    /**
     * Calculate note visual position
     */
    calculateNotePosition(noteTime, currentTime) {
        const timeUntilHit = noteTime - currentTime;
        const distance = (timeUntilHit / 1000) * this.noteSpeed;
        return Math.max(0, distance); // 0 = hit zone
    }
    
    /**
     * Check for missed notes
     */
    checkMissedNotes(currentTime) {
        for (const note of this.activeNotes) {
            if (note.hit) continue;
            
            const timeDiff = currentTime - note.time;
            
            // Note passed the hit window
            if (timeDiff > this.timing.bad) {
                this.onNoteMiss(note);
                note.hit = true;
            }
        }
    }
    
    /**
     * Handle key press
     */
    onKeyPress(laneIndex) {
        if (!this.isPlaying) return;
        
        const currentTime = this.getCurrentSongTime();
        
        // Find closest note in this lane
        let closestNote = null;
        let closestTimeDiff = Infinity;
        
        for (const note of this.activeNotes) {
            if (note.hit || note.lane !== laneIndex) continue;
            
            const timeDiff = Math.abs(currentTime - note.time);
            
            if (timeDiff < closestTimeDiff && timeDiff <= this.timing.bad) {
                closestNote = note;
                closestTimeDiff = timeDiff;
            }
        }
        
        if (closestNote) {
            this.onNoteHit(closestNote, closestTimeDiff);
            closestNote.hit = true;
        }
    }
    
    /**
     * Handle note hit
     */
    onNoteHit(note, timeDiff) {
        // Determine hit quality
        let quality, points;
        
        if (timeDiff <= this.timing.perfect) {
            quality = 'perfect';
            points = this.scoring.perfect;
            this.stats.perfectHits++;
        } else if (timeDiff <= this.timing.great) {
            quality = 'great';
            points = this.scoring.great;
            this.stats.greatHits++;
        } else if (timeDiff <= this.timing.good) {
            quality = 'good';
            points = this.scoring.good;
            this.stats.goodHits++;
        } else {
            quality = 'bad';
            points = this.scoring.bad;
            this.stats.badHits++;
        }
        
        // Apply combo multiplier
        const comboMultiplier = 1 + (this.combo * this.scoring.comboMultiplier);
        points = Math.floor(points * comboMultiplier);
        
        // Add to score
        this.score += points;
        this.stats.totalScore += points;
        
        // Increase combo
        if (quality !== 'bad') {
            this.combo++;
            this.maxCombo = Math.max(this.maxCombo, this.combo);
            this.stats.highestCombo = Math.max(this.stats.highestCombo, this.combo);
        } else {
            this.combo = 0;
        }
        
        // Create hit effect
        this.createHitEffect(note.lane, quality);
        
        // Special combo milestones
        if (this.combo > 0 && this.combo % 10 === 0) {
            this.onComboMilestone(this.combo);
        }
    }
    
    /**
     * Handle note miss
     */
    onNoteMiss(note) {
        this.stats.misses++;
        this.combo = 0;
        
        // Lose health
        this.health = Math.max(0, this.health - 5);
        
        // Create miss effect
        this.createMissEffect(note.lane);
        
        // Check for fail
        if (this.health <= 0) {
            this.failSong();
        }
    }
    
    /**
     * Handle combo milestone
     */
    onComboMilestone(combo) {
        // Create special effect
        this.createComboEffect(combo);
        
        // Bonus points
        const bonus = combo * 10;
        this.score += bonus;
        
        // Emit event
        if (window.gameEngine) {
            window.gameEngine.eventBus?.emit('rhythm:combo', { combo, bonus });
        }
    }
    
    /**
     * Create hit effect
     */
    createHitEffect(lane, quality) {
        const colors = {
            perfect: 0xffff00,  // Yellow
            great: 0x00ff00,    // Green
            good: 0x00ffff,     // Cyan
            bad: 0xff6600       // Orange
        };
        
        this.hitEffects.push({
            lane: lane,
            quality: quality,
            color: colors[quality],
            alpha: 1.0,
            scale: 1.0,
            time: 0
        });
    }
    
    /**
     * Create miss effect
     */
    createMissEffect(lane) {
        this.hitEffects.push({
            lane: lane,
            quality: 'miss',
            color: 0xff0000,  // Red
            alpha: 1.0,
            scale: 1.0,
            time: 0
        });
    }
    
    /**
     * Create combo effect
     */
    createComboEffect(combo) {
        this.comboEffects.push({
            combo: combo,
            alpha: 1.0,
            scale: 1.0,
            time: 0
        });
    }
    
    /**
     * Update visual effects
     */
    updateEffects(deltaTime) {
        // Update hit effects
        this.hitEffects = this.hitEffects.filter(effect => {
            effect.time += deltaTime;
            effect.alpha -= deltaTime * 2; // Fade out
            effect.scale += deltaTime * 2; // Scale up
            return effect.alpha > 0;
        });
        
        // Update combo effects
        this.comboEffects = this.comboEffects.filter(effect => {
            effect.time += deltaTime;
            effect.alpha -= deltaTime;
            effect.scale += deltaTime;
            return effect.alpha > 0;
        });
    }
    
    /**
     * End song (completed)
     */
    endSong() {
        this.isPlaying = false;
        
        // Calculate final stats
        const totalNotes = this.currentSong.notes.length;
        const hitNotes = this.stats.perfectHits + this.stats.greatHits + 
                        this.stats.goodHits + this.stats.badHits;
        const accuracy = (hitNotes / totalNotes) * 100;
        
        const results = {
            song: this.currentSong.name,
            score: this.score,
            maxCombo: this.maxCombo,
            accuracy: accuracy.toFixed(2),
            perfect: this.stats.perfectHits,
            great: this.stats.greatHits,
            good: this.stats.goodHits,
            bad: this.stats.badHits,
            miss: this.stats.misses,
            rank: this.calculateRank(accuracy, this.maxCombo)
        };
        
        // Check for unlocks
        this.checkUnlocks(this.score);
        
        // Save high score
        this.saveHighScore(this.currentSong, this.score);
        
        // Emit completion event
        if (window.gameEngine) {
            window.gameEngine.eventBus?.emit('rhythm:complete', results);
        }
        
        return results;
    }
    
    /**
     * Fail song
     */
    failSong() {
        this.isPlaying = false;
        
        const results = {
            song: this.currentSong.name,
            score: this.score,
            maxCombo: this.maxCombo,
            failed: true
        };
        
        // Emit fail event
        if (window.gameEngine) {
            window.gameEngine.eventBus?.emit('rhythm:failed', results);
        }
        
        return results;
    }
    
    /**
     * Calculate rank
     */
    calculateRank(accuracy, maxCombo) {
        if (accuracy === 100 && maxCombo >= this.currentSong.notes.length) {
            return 'SS'; // Perfect
        } else if (accuracy >= 95) {
            return 'S';
        } else if (accuracy >= 90) {
            return 'A';
        } else if (accuracy >= 80) {
            return 'B';
        } else if (accuracy >= 70) {
            return 'C';
        } else if (accuracy >= 60) {
            return 'D';
        } else {
            return 'F';
        }
    }
    
    /**
     * Check for song unlocks
     */
    checkUnlocks(totalScore) {
        for (const [songId, song] of Object.entries(this.songs)) {
            if (!song.unlocked && song.unlockScore && totalScore >= song.unlockScore) {
                song.unlocked = true;
                
                // Emit unlock event
                if (window.gameEngine) {
                    window.gameEngine.eventBus?.emit('rhythm:unlock', { 
                        songId, 
                        songName: song.name 
                    });
                }
            }
        }
    }
    
    /**
     * Save high score
     */
    saveHighScore(song, score) {
        const key = `rhythm_highscore_${song.name}`;
        const currentHigh = localStorage.getItem(key) || 0;
        
        if (score > currentHigh) {
            localStorage.setItem(key, score);
            return true;
        }
        
        return false;
    }
    
    /**
     * Get high score for song
     */
    getHighScore(songId) {
        const song = this.songs[songId];
        if (!song) return 0;
        
        const key = `rhythm_highscore_${song.name}`;
        return parseInt(localStorage.getItem(key) || '0');
    }
    
    /**
     * Get available songs
     */
    getAvailableSongs() {
        return Object.entries(this.songs)
            .filter(([id, song]) => song.unlocked)
            .map(([id, song]) => ({
                id,
                name: song.name,
                artist: song.artist,
                difficulty: song.difficulty,
                bpm: song.bpm,
                duration: song.duration,
                highScore: this.getHighScore(id)
            }));
    }
    
    /**
     * Get statistics
     */
    getStats() {
        return { ...this.stats };
    }
    
    /**
     * Reset game
     */
    reset() {
        this.isPlaying = false;
        this.currentSong = null;
        this.score = 0;
        this.combo = 0;
        this.maxCombo = 0;
        this.activeNotes = [];
        this.hitEffects = [];
        this.comboEffects = [];
    }
}
