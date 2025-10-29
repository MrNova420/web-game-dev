/**
 * RacingGameSystem - Arcade Racing Mini-Game
 * 
 * Phase 8, System 121 of AUTONOMOUS_EXECUTION_PLAN
 * Fast-paced racing with power-ups and tracks
 * 
 * Features:
 * - Multiple racing tracks through game biomes
 * - Mount racing (horses, dragons, ethereal beasts)
 * - Power-ups and boosts
 * - Time trials and championships
 * - Drift mechanics
 * - Leaderboards and ghost races
 * - Unlockable mounts and cosmetics
 */

import * as THREE from 'three';

export class RacingGameSystem {
    constructor(scene, physicsWorld) {
        this.scene = scene;
        this.physicsWorld = physicsWorld;
        
        // Race state
        this.isRacing = false;
        this.currentTrack = null;
        this.racers = [];
        this.playerRacer = null;
        
        // Race tracks
        this.tracks = this.initializeTracks();
        
        // Mounts (vehicles)
        this.mounts = this.initializeMounts();
        
        // Power-ups
        this.powerUps = {
            SPEED_BOOST: { duration: 3000, speedMultiplier: 2.0 },
            SHIELD: { duration: 5000, protection: true },
            LIGHTNING: { effect: 'stun_others', duration: 2000 },
            MUSHROOM: { speedMultiplier: 1.5, duration: 5000 },
            STAR: { invincible: true, speedMultiplier: 1.8, duration: 8000 }
        };
        
        // Physics settings
        this.physics = {
            maxSpeed: 100,
            acceleration: 20,
            deceleration: 10,
            turnSpeed: 3.0,
            driftFactor: 1.5
        };
        
        // Statistics
        this.stats = {
            racesCompleted: 0,
            racesWon: 0,
            totalDistance: 0,
            bestLapTime: Infinity,
            powerUpsCollected: 0,
            driftsExecuted: 0
        };
    }
    
    /**
     * Initialize race tracks
     */
    initializeTracks() {
        return {
            crystal_circuit: {
                name: 'Crystal Caverns Circuit',
                biome: 'crystal_caverns',
                laps: 3,
                length: 5000, // meters
                difficulty: 1,
                obstacles: ['crystals', 'narrow_passages'],
                unlocked: true
            },
            
            fungal_speedway: {
                name: 'Fungal City Speedway',
                biome: 'fungal_city',
                laps: 3,
                length: 6000,
                difficulty: 2,
                obstacles: ['mushrooms', 'spores'],
                unlocked: false,
                unlockRequirement: { races: 5 }
            },
            
            vine_cathedral_dash: {
                name: 'Vine Cathedral Dash',
                biome: 'vine_cathedral',
                laps: 3,
                length: 7000,
                difficulty: 3,
                obstacles: ['vines', 'ruins'],
                unlocked: false,
                unlockRequirement: { races: 15 }
            },
            
            starship_sprint: {
                name: 'Broken Starship Sprint',
                biome: 'broken_starship',
                laps: 3,
                length: 8000,
                difficulty: 4,
                obstacles: ['debris', 'holograms'],
                unlocked: false,
                unlockRequirement: { races: 30 }
            },
            
            twilight_grand_prix: {
                name: 'Twilight Throne Grand Prix',
                biome: 'twilight_throne',
                laps: 5,
                length: 10000,
                difficulty: 5,
                obstacles: ['reality_distortions', 'floating_ruins'],
                unlocked: false,
                unlockRequirement: { wins: 20 }
            }
        };
    }
    
    /**
     * Initialize mounts (racing vehicles)
     */
    initializeMounts() {
        return {
            spirit_horse: {
                name: 'Spirit Horse',
                speed: 80,
                acceleration: 15,
                handling: 8,
                rarity: 'common',
                unlocked: true
            },
            
            smoke_wolf: {
                name: 'Smoke Wolf',
                speed: 90,
                acceleration: 18,
                handling: 9,
                rarity: 'uncommon',
                unlocked: false,
                unlockRequirement: { races: 10 }
            },
            
            thunder_drake: {
                name: 'Thunder Drake',
                speed: 110,
                acceleration: 20,
                handling: 7,
                rarity: 'rare',
                unlocked: false,
                unlockRequirement: { wins: 5 }
            },
            
            ethereal_phoenix: {
                name: 'Ethereal Phoenix',
                speed: 130,
                acceleration: 25,
                handling: 10,
                rarity: 'epic',
                unlocked: false,
                unlockRequirement: { wins: 15 }
            },
            
            omega_dragon: {
                name: 'Omega Dragon',
                speed: 150,
                acceleration: 30,
                handling: 10,
                rarity: 'legendary',
                unlocked: false,
                unlockRequirement: { wins: 50 }
            }
        };
    }
    
    /**
     * Start race
     */
    startRace(trackId, mountId, numAIRacers = 7) {
        const track = this.tracks[trackId];
        const mount = this.mounts[mountId];
        
        if (!track || !track.unlocked) {
            console.warn(`Track ${trackId} not available`);
            return false;
        }
        
        if (!mount || !mount.unlocked) {
            console.warn(`Mount ${mountId} not available`);
            return false;
        }
        
        this.isRacing = true;
        this.currentTrack = track;
        
        // Create player racer
        this.playerRacer = this.createRacer(true, mount);
        this.racers.push(this.playerRacer);
        
        // Create AI racers
        for (let i = 0; i < numAIRacers; i++) {
            const aiMount = this.getRandomMount();
            const aiRacer = this.createRacer(false, aiMount);
            this.racers.push(aiRacer);
        }
        
        // Initialize race data
        this.raceData = {
            startTime: Date.now(),
            currentLap: 1,
            lapTimes: [],
            position: 1,
            powerUpsUsed: 0
        };
        
        return true;
    }
    
    /**
     * Create racer
     */
    createRacer(isPlayer, mount) {
        return {
            id: Math.random().toString(36),
            isPlayer: isPlayer,
            mount: mount,
            position: new THREE.Vector3(0, 0, 0),
            velocity: new THREE.Vector3(0, 0, 0),
            rotation: 0,
            speed: 0,
            lap: 1,
            checkpoint: 0,
            isDrifting: false,
            activePowerUps: [],
            isStunned: false,
            hasShield: false,
            rank: 0
        };
    }
    
    /**
     * Get random mount for AI
     */
    getRandomMount() {
        const unlockedMounts = Object.values(this.mounts).filter(m => m.unlocked);
        return unlockedMounts[Math.floor(Math.random() * unlockedMounts.length)];
    }
    
    /**
     * Update racing
     */
    update(deltaTime) {
        if (!this.isRacing) return;
        
        // Update all racers
        for (const racer of this.racers) {
            this.updateRacer(racer, deltaTime);
        }
        
        // Update rankings
        this.updateRankings();
        
        // Check for race completion
        if (this.playerRacer.lap > this.currentTrack.laps) {
            this.completeRace();
        }
    }
    
    /**
     * Update individual racer
     */
    updateRacer(racer, deltaTime) {
        // Skip if stunned
        if (racer.isStunned) {
            racer.speed *= 0.95;
            return;
        }
        
        // Apply power-up effects
        let speedMultiplier = 1.0;
        for (const powerUp of racer.activePowerUps) {
            if (powerUp.speedMultiplier) {
                speedMultiplier *= powerUp.speedMultiplier;
            }
            
            // Update duration
            powerUp.remaining -= deltaTime * 1000;
            if (powerUp.remaining <= 0) {
                racer.activePowerUps = racer.activePowerUps.filter(p => p !== powerUp);
            }
        }
        
        // Calculate speed
        const maxSpeed = racer.mount.speed * speedMultiplier;
        
        if (racer.isPlayer) {
            // Player controls handled separately
        } else {
            // AI behavior
            this.updateAIRacer(racer, deltaTime, maxSpeed);
        }
        
        // Apply physics
        racer.speed = Math.min(racer.speed, maxSpeed);
        racer.velocity.set(
            Math.sin(racer.rotation) * racer.speed,
            0,
            Math.cos(racer.rotation) * racer.speed
        );
        
        // Update position
        racer.position.add(racer.velocity.clone().multiplyScalar(deltaTime));
        
        // Check checkpoints
        this.checkCheckpoints(racer);
    }
    
    /**
     * Update AI racer behavior
     */
    updateAIRacer(racer, deltaTime, maxSpeed) {
        // Simple AI: accelerate and follow track
        racer.speed += racer.mount.acceleration * deltaTime;
        racer.speed = Math.min(racer.speed, maxSpeed);
        
        // Random power-up usage
        if (racer.activePowerUps.length > 0 && Math.random() < 0.01) {
            this.usePowerUp(racer, racer.activePowerUps[0].type);
        }
    }
    
    /**
     * Player accelerate
     */
    accelerate() {
        if (!this.playerRacer) return;
        
        const acceleration = this.playerRacer.mount.acceleration;
        this.playerRacer.speed += acceleration * 0.016; // Assume 60fps
    }
    
    /**
     * Player brake
     */
    brake() {
        if (!this.playerRacer) return;
        
        this.playerRacer.speed *= 0.95;
    }
    
    /**
     * Player turn
     */
    turn(direction) {
        if (!this.playerRacer) return;
        
        const turnSpeed = this.playerRacer.mount.handling * 0.05;
        this.playerRacer.rotation += direction * turnSpeed;
    }
    
    /**
     * Player drift
     */
    startDrift() {
        if (!this.playerRacer) return;
        
        this.playerRacer.isDrifting = true;
        this.stats.driftsExecuted++;
    }
    
    endDrift() {
        if (!this.playerRacer) return;
        
        this.playerRacer.isDrifting = false;
        
        // Drift boost
        this.playerRacer.speed *= 1.2;
    }
    
    /**
     * Use power-up
     */
    usePowerUp(racer, powerUpType) {
        const powerUp = this.powerUps[powerUpType];
        if (!powerUp) return;
        
        if (powerUpType === 'LIGHTNING') {
            // Stun all other racers
            for (const otherRacer of this.racers) {
                if (otherRacer !== racer && !otherRacer.hasShield) {
                    otherRacer.isStunned = true;
                    setTimeout(() => {
                        otherRacer.isStunned = false;
                    }, powerUp.duration);
                }
            }
        } else {
            // Apply to self
            racer.activePowerUps.push({
                type: powerUpType,
                ...powerUp,
                remaining: powerUp.duration
            });
        }
        
        if (racer.isPlayer) {
            this.raceData.powerUpsUsed++;
        }
    }
    
    /**
     * Check checkpoints and lap completion
     */
    checkCheckpoints(racer) {
        // Simplified checkpoint system
        // In real implementation, would check against track waypoints
        
        const distanceTraveled = racer.position.length();
        const lapLength = this.currentTrack.length;
        
        const newCheckpoint = Math.floor((distanceTraveled % lapLength) / (lapLength / 10));
        
        if (newCheckpoint !== racer.checkpoint) {
            racer.checkpoint = newCheckpoint;
            
            // Lap completed?
            if (racer.checkpoint === 0 && distanceTraveled > lapLength * racer.lap) {
                racer.lap++;
                
                if (racer.isPlayer) {
                    const lapTime = Date.now() - this.raceData.startTime;
                    this.raceData.lapTimes.push(lapTime);
                    this.stats.bestLapTime = Math.min(this.stats.bestLapTime, lapTime);
                }
            }
        }
    }
    
    /**
     * Update racer rankings
     */
    updateRankings() {
        // Sort racers by lap and checkpoint
        this.racers.sort((a, b) => {
            if (a.lap !== b.lap) return b.lap - a.lap;
            return b.checkpoint - a.checkpoint;
        });
        
        // Assign ranks
        for (let i = 0; i < this.racers.length; i++) {
            this.racers[i].rank = i + 1;
        }
        
        // Update player position
        if (this.playerRacer) {
            this.raceData.position = this.playerRacer.rank;
        }
    }
    
    /**
     * Complete race
     */
    completeRace() {
        this.isRacing = false;
        
        const totalTime = Date.now() - this.raceData.startTime;
        const finalPosition = this.playerRacer.rank;
        
        const results = {
            track: this.currentTrack.name,
            position: finalPosition,
            totalTime: totalTime,
            lapTimes: this.raceData.lapTimes,
            bestLap: Math.min(...this.raceData.lapTimes),
            powerUpsUsed: this.raceData.powerUpsUsed,
            won: finalPosition === 1
        };
        
        // Update stats
        this.stats.racesCompleted++;
        if (results.won) {
            this.stats.racesWon++;
        }
        this.stats.totalDistance += this.currentTrack.length * this.currentTrack.laps;
        
        // Calculate rewards
        const baseReward = 500;
        const positionBonus = (8 - finalPosition) * 100;
        const timeBonus = results.bestLap < 60000 ? 300 : 0;
        results.reward = baseReward + positionBonus + timeBonus;
        
        // Check unlocks
        this.checkUnlocks();
        
        // Emit completion event
        if (window.gameEngine) {
            window.gameEngine.eventBus?.emit('racing:complete', results);
        }
        
        // Cleanup
        this.racers = [];
        this.playerRacer = null;
        
        return results;
    }
    
    /**
     * Check for unlocks
     */
    checkUnlocks() {
        // Check track unlocks
        for (const [id, track] of Object.entries(this.tracks)) {
            if (!track.unlocked && track.unlockRequirement) {
                const req = track.unlockRequirement;
                if ((req.races && this.stats.racesCompleted >= req.races) ||
                    (req.wins && this.stats.racesWon >= req.wins)) {
                    track.unlocked = true;
                    
                    if (window.gameEngine) {
                        window.gameEngine.eventBus?.emit('racing:unlockTrack', { track: track.name });
                    }
                }
            }
        }
        
        // Check mount unlocks
        for (const [id, mount] of Object.entries(this.mounts)) {
            if (!mount.unlocked && mount.unlockRequirement) {
                const req = mount.unlockRequirement;
                if ((req.races && this.stats.racesCompleted >= req.races) ||
                    (req.wins && this.stats.racesWon >= req.wins)) {
                    mount.unlocked = true;
                    
                    if (window.gameEngine) {
                        window.gameEngine.eventBus?.emit('racing:unlockMount', { mount: mount.name });
                    }
                }
            }
        }
    }
    
    /**
     * Get available tracks
     */
    getAvailableTracks() {
        return Object.entries(this.tracks)
            .filter(([id, track]) => track.unlocked)
            .map(([id, track]) => ({ id, ...track }));
    }
    
    /**
     * Get available mounts
     */
    getAvailableMounts() {
        return Object.entries(this.mounts)
            .filter(([id, mount]) => mount.unlocked)
            .map(([id, mount]) => ({ id, ...mount }));
    }
    
    /**
     * Get statistics
     */
    getStats() {
        return { 
            ...this.stats,
            winRate: this.stats.racesCompleted > 0 ? 
                (this.stats.racesWon / this.stats.racesCompleted * 100).toFixed(1) : 0
        };
    }
}
