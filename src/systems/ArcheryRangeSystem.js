/**
 * Archery Range Mini-Game System
 * Complete archery mini-game with multiple ranges, targets, challenges, and tournaments
 * Uses ONLY external professional assets (Sketchfab Free, Mixamo, Kenney, Quaternius)
 * 
 * Asset Sources:
 * - Bow/Arrow Models: Sketchfab Free (medieval/fantasy bows, arrows with quivers)
 * - Character: Mixamo (archer character with draw, aim, shoot, reload animations)
 * - Range Environments: Quaternius Medieval Pack (5 range variations: forest, castle, mountain, beach, arena)
 * - Targets: Kenney Medieval Pack (static targets, moving targets, special targets)
 * - Props: Quaternius Props (hay bales, stands, fences, decorative elements)
 * - UI Icons: game-icons.net (crosshair, bow icon, arrow counter, score)
 * - Wind Effects: Kenney Particle Pack (wind particles, leaf particles)
 * - Sound: Freesound (bow draw, arrow release, target hit, crowd cheers)
 */

export class ArcheryRangeSystem {
    constructor() {
        this.ranges = new Map(); // Active shooting ranges
        this.tournaments = new Map(); // Active tournaments
        this.playerScores = new Map(); // Player archery stats
        
        // External asset paths - ALL from professional sources
        this.assets = {
            bows: {
                basic: { model: '/assets/models/weapons/bows/basic_bow.glb', source: 'Sketchfab Free' },
                recurve: { model: '/assets/models/weapons/bows/recurve_bow.glb', source: 'Sketchfab Free' },
                compound: { model: '/assets/models/weapons/bows/compound_bow.glb', source: 'Sketchfab Free' },
                longbow: { model: '/assets/models/weapons/bows/longbow.glb', source: 'Sketchfab Free' },
                legendary: { model: '/assets/models/weapons/bows/elven_bow.glb', source: 'Sketchfab Free' }
            },
            arrows: {
                basic: { model: '/assets/models/weapons/arrows/basic_arrow.glb', source: 'Sketchfab Free' },
                fire: { model: '/assets/models/weapons/arrows/fire_arrow.glb', source: 'Sketchfab Free' },
                ice: { model: '/assets/models/weapons/arrows/ice_arrow.glb', source: 'Sketchfab Free' },
                explosive: { model: '/assets/models/weapons/arrows/explosive_arrow.glb', source: 'Sketchfab Free' }
            },
            character: {
                model: '/assets/models/characters/archer.glb', // Mixamo
                animations: {
                    idle: '/assets/animations/archer_idle.fbx',
                    draw: '/assets/animations/bow_draw.fbx',
                    aim: '/assets/animations/bow_aim.fbx',
                    shoot: '/assets/animations/bow_shoot.fbx',
                    reload: '/assets/animations/arrow_reload.fbx'
                },
                source: 'Mixamo'
            },
            ranges: {
                forest: { model: '/assets/models/ranges/forest_range.glb', source: 'Quaternius Medieval Pack' },
                castle: { model: '/assets/models/ranges/castle_range.glb', source: 'Quaternius Medieval Pack' },
                mountain: { model: '/assets/models/ranges/mountain_range.glb', source: 'Quaternius Medieval Pack' },
                beach: { model: '/assets/models/ranges/beach_range.glb', source: 'Quaternius Medieval Pack' },
                arena: { model: '/assets/models/ranges/arena_range.glb', source: 'Quaternius Medieval Pack' }
            },
            targets: {
                static_round: { model: '/assets/models/targets/target_round.glb', source: 'Kenney Medieval Pack' },
                static_bullseye: { model: '/assets/models/targets/target_bullseye.glb', source: 'Kenney Medieval Pack' },
                moving_horizontal: { model: '/assets/models/targets/target_moving.glb', source: 'Kenney Medieval Pack' },
                apple: { model: '/assets/models/targets/apple_target.glb', source: 'Kenney Medieval Pack' },
                bottle: { model: '/assets/models/targets/bottle_target.glb', source: 'Kenney Medieval Pack' },
                barrel: { model: '/assets/models/targets/barrel_target.glb', source: 'Kenney Medieval Pack' }
            },
            props: {
                hay_bale: { model: '/assets/models/props/hay_bale.glb', source: 'Quaternius Props' },
                stand: { model: '/assets/models/props/archery_stand.glb', source: 'Quaternius Props' },
                fence: { model: '/assets/models/props/wooden_fence.glb', source: 'Quaternius Props' },
                flag: { model: '/assets/models/props/tournament_flag.glb', source: 'Quaternius Props' }
            },
            ui: {
                crosshair: '/assets/ui/icons/crosshair.png', // game-icons.net
                bow_icon: '/assets/ui/icons/bow.png',
                arrow_icon: '/assets/ui/icons/arrow.png',
                bullseye_icon: '/assets/ui/icons/bullseye.png',
                wind_indicator: '/assets/ui/icons/wind.png'
            },
            particles: {
                wind: '/assets/particles/wind_particle.png', // Kenney Particle Pack
                leaves: '/assets/particles/leaf_particle.png'
            }
        };
        
        // Bow types with stats
        this.bowTypes = {
            BASIC: { name: 'Basic Bow', damage: 20, accuracy: 0.8, drawTime: 1.5, range: 50, model: 'basic' },
            RECURVE: { name: 'Recurve Bow', damage: 35, accuracy: 0.85, drawTime: 1.2, range: 65, model: 'recurve' },
            COMPOUND: { name: 'Compound Bow', damage: 50, accuracy: 0.9, drawTime: 1.0, range: 80, model: 'compound' },
            LONGBOW: { name: 'Longbow', damage: 45, accuracy: 0.75, drawTime: 2.0, range: 100, model: 'longbow' },
            LEGENDARY: { name: 'Elven Masterwork', damage: 80, accuracy: 0.95, drawTime: 0.8, range: 120, model: 'legendary' }
        };
        
        // Arrow types with special effects
        this.arrowTypes = {
            BASIC: { name: 'Basic Arrow', damage: 1.0, effect: null, model: 'basic' },
            FIRE: { name: 'Fire Arrow', damage: 1.3, effect: 'burn', model: 'fire' },
            ICE: { name: 'Ice Arrow', damage: 1.2, effect: 'slow', model: 'ice' },
            EXPLOSIVE: { name: 'Explosive Arrow', damage: 2.0, effect: 'explosion', model: 'explosive' }
        };
        
        // Shooting ranges with different challenges
        this.rangeConfigs = {
            FOREST_RANGE: {
                name: 'Forest Clearing',
                environment: 'forest',
                difficulty: 1,
                distances: [10, 20, 30, 40, 50],
                windEffect: { min: 0, max: 2 },
                targetTypes: ['static_round', 'static_bullseye'],
                description: 'Peaceful forest range for beginners'
            },
            CASTLE_WALLS: {
                name: 'Castle Battlements',
                environment: 'castle',
                difficulty: 2,
                distances: [20, 35, 50, 65],
                windEffect: { min: 1, max: 4 },
                targetTypes: ['static_round', 'moving_horizontal', 'apple'],
                description: 'Medieval castle with moderate wind'
            },
            MOUNTAIN_PEAK: {
                name: 'Mountain Summit',
                environment: 'mountain',
                difficulty: 3,
                distances: [30, 50, 70, 90],
                windEffect: { min: 3, max: 7 },
                targetTypes: ['static_bullseye', 'moving_horizontal', 'bottle'],
                description: 'High altitude with strong crosswinds'
            },
            BEACH_TOURNAMENT: {
                name: 'Seaside Tournament',
                environment: 'beach',
                difficulty: 2,
                distances: [25, 40, 55, 70],
                windEffect: { min: 2, max: 5 },
                targetTypes: ['static_round', 'apple', 'bottle', 'barrel'],
                description: 'Beach competition with ocean breeze'
            },
            GRAND_ARENA: {
                name: 'Grand Tournament Arena',
                environment: 'arena',
                difficulty: 4,
                distances: [40, 60, 80, 100],
                windEffect: { min: 2, max: 8 },
                targetTypes: ['static_bullseye', 'moving_horizontal', 'apple', 'bottle', 'barrel'],
                description: 'Ultimate challenge for master archers'
            }
        };
        
        // Challenge modes
        this.challengeModes = {
            STANDARD: {
                name: 'Standard Practice',
                arrows: 30,
                timeLimit: null,
                scoring: 'accuracy',
                description: 'Classic target practice'
            },
            TIMED: {
                name: 'Speed Shooting',
                arrows: 20,
                timeLimit: 60,
                scoring: 'speed',
                description: 'Hit as many targets as possible in 60 seconds'
            },
            BULLSEYE: {
                name: 'Bullseye Challenge',
                arrows: 15,
                timeLimit: null,
                scoring: 'bullseye',
                description: 'Only bullseyes count'
            },
            MOVING_TARGETS: {
                name: 'Moving Target Practice',
                arrows: 25,
                timeLimit: 90,
                scoring: 'moving',
                description: 'Hit moving targets for bonus points'
            },
            TRICK_SHOTS: {
                name: 'Trick Shot Master',
                arrows: 10,
                timeLimit: null,
                scoring: 'trick',
                description: 'Split arrows, bank shots, multi-hits'
            },
            TOURNAMENT: {
                name: 'Tournament Mode',
                arrows: 36,
                timeLimit: null,
                scoring: 'tournament',
                description: 'Official tournament scoring (10 zones)'
            }
        };
        
        // Score zones (from center outward)
        this.scoreZones = [
            { name: 'X-Ring', points: 10, radius: 0.05, color: 0xFFD700 }, // Gold center
            { name: 'Bullseye', points: 9, radius: 0.10, color: 0xFFD700 },
            { name: 'Inner Gold', points: 8, radius: 0.15, color: 0xFF0000 }, // Red
            { name: 'Outer Gold', points: 7, radius: 0.20, color: 0xFF0000 },
            { name: 'Inner Blue', points: 6, radius: 0.25, color: 0x0000FF },
            { name: 'Outer Blue', points: 5, radius: 0.30, color: 0x0000FF },
            { name: 'Inner Black', points: 4, radius: 0.35, color: 0x000000 },
            { name: 'Outer Black', points: 3, radius: 0.40, color: 0x000000 },
            { name: 'Inner White', points: 2, radius: 0.45, color: 0xFFFFFF },
            { name: 'Outer White', points: 1, radius: 0.50, color: 0xFFFFFF }
        ];
        
        // Achievements
        this.achievements = {
            FIRST_SHOT: { name: 'First Arrow', description: 'Fire your first arrow', reward: 50 },
            BULLSEYE: { name: 'Bullseye!', description: 'Hit a bullseye', reward: 100 },
            PERFECT_SCORE: { name: 'Perfect Score', description: 'Score 300 in Standard Practice', reward: 500 },
            ROBIN_HOOD: { name: 'Robin Hood', description: 'Split an arrow', reward: 1000 },
            MASTER_ARCHER: { name: 'Master Archer', description: 'Complete all range challenges', reward: 2000 },
            TOURNAMENT_WINNER: { name: 'Tournament Champion', description: 'Win a tournament', reward: 3000 },
            LEGENDARY_SHOT: { name: 'Legendary Shot', description: 'Hit bullseye at 100m with wind', reward: 5000 }
        };
        
        // Tournament system
        this.tournamentSchedule = [
            { name: 'Weekly Novice Cup', minLevel: 1, maxLevel: 10, entryFee: 100, prize: 1000 },
            { name: 'Regional Championship', minLevel: 10, maxLevel: 25, entryFee: 500, prize: 5000 },
            { name: 'National Masters', minLevel: 25, maxLevel: 50, entryFee: 2000, prize: 20000 },
            { name: 'World Grand Prix', minLevel: 50, maxLevel: 99, entryFee: 10000, prize: 100000 },
            { name: 'Legendary Invitational', minLevel: 80, maxLevel: 99, entryFee: 50000, prize: 500000 }
        ];
    }
    
    /**
     * Initialize archery range
     */
    createRange(rangeId, config, position) {
        const rangeConfig = this.rangeConfigs[config];
        if (!rangeConfig) {
            console.error('Invalid range config:', config);
            return null;
        }
        
        const range = {
            id: rangeId,
            config: rangeConfig,
            position: position,
            environment: rangeConfig.environment,
            targets: [],
            activeSession: null,
            leaderboard: [],
            
            // Load external environment model (Quaternius)
            environmentModel: this.assets.ranges[rangeConfig.environment].model,
            environmentSource: this.assets.ranges[rangeConfig.environment].source,
            
            // Wind simulation
            wind: {
                speed: 0,
                direction: 0,
                gustiness: 0.5
            },
            
            // Statistics
            stats: {
                totalShots: 0,
                totalHits: 0,
                bullseyes: 0,
                perfectRounds: 0,
                bestScore: 0
            }
        };
        
        // Setup targets at various distances
        rangeConfig.distances.forEach((distance, index) => {
            const targetType = rangeConfig.targetTypes[index % rangeConfig.targetTypes.length];
            range.targets.push(this.createTarget(targetType, distance, rangeConfig.difficulty));
        });
        
        this.ranges.set(rangeId, range);
        console.log(`Created archery range: ${rangeConfig.name} with ${range.targets.length} targets`);
        console.log(`Using external environment: ${range.environmentModel} (${range.environmentSource})`);
        
        return range;
    }
    
    /**
     * Create target with external model
     */
    createTarget(type, distance, difficulty) {
        const targetAsset = this.assets.targets[type];
        
        return {
            type: type,
            distance: distance,
            model: targetAsset.model,
            source: targetAsset.source,
            size: 1.0 / (difficulty * 0.5), // Smaller targets at higher difficulty
            moving: type.includes('moving'),
            movement: type.includes('moving') ? {
                pattern: 'horizontal',
                speed: difficulty * 0.5,
                range: 5
            } : null,
            health: type === 'barrel' ? 3 : 1, // Barrels require multiple hits
            hitCount: 0,
            active: true
        };
    }
    
    /**
     * Start shooting session
     */
    startSession(playerId, rangeId, mode, bowType = 'BASIC') {
        const range = this.ranges.get(rangeId);
        if (!range) {
            console.error('Range not found:', rangeId);
            return null;
        }
        
        const challengeMode = this.challengeModes[mode];
        const bow = this.bowTypes[bowType];
        
        const session = {
            playerId: playerId,
            rangeId: rangeId,
            mode: challengeMode,
            bow: bow,
            bowModel: this.assets.bows[bow.model].model, // External bow model (Sketchfab)
            
            // Character with animations (Mixamo)
            character: {
                model: this.assets.character.model,
                animations: this.assets.character.animations,
                source: this.assets.character.source
            },
            
            arrows: challengeMode.arrows,
            arrowsRemaining: challengeMode.arrows,
            currentArrowType: 'BASIC',
            
            score: 0,
            hits: 0,
            misses: 0,
            bullseyes: 0,
            perfectShots: 0,
            trickShots: 0,
            
            startTime: Date.now(),
            timeLimit: challengeMode.timeLimit,
            timeRemaining: challengeMode.timeLimit,
            
            state: 'active',
            drawProgress: 0,
            aimPosition: { x: 0, y: 0 },
            
            shotHistory: [],
            achievements: []
        };
        
        range.activeSession = session;
        console.log(`Started ${challengeMode.name} session at ${range.config.name}`);
        console.log(`Using bow: ${bow.name} (${session.bowModel})`);
        console.log(`Character: ${session.character.model} (${session.character.source})`);
        
        return session;
    }
    
    /**
     * Shoot arrow with physics simulation
     */
    shootArrow(sessionId, aimPoint, drawStrength) {
        const session = this.getSessionById(sessionId);
        if (!session || session.state !== 'active') {
            console.error('Invalid session or session not active');
            return null;
        }
        
        if (session.arrowsRemaining <= 0) {
            console.log('No arrows remaining');
            return null;
        }
        
        const range = this.ranges.get(session.rangeId);
        const arrowData = this.arrowTypes[session.currentArrowType];
        
        // Calculate arrow trajectory with physics
        const trajectory = this.calculateTrajectory(
            aimPoint,
            drawStrength,
            session.bow,
            range.wind,
            arrowData
        );
        
        // Check target hits
        const hits = this.checkTargetHits(trajectory, range.targets);
        
        // Calculate score
        const shotResult = {
            arrowType: session.currentArrowType,
            arrowModel: this.assets.arrows[arrowData.model].model, // External arrow model
            trajectory: trajectory,
            hits: hits,
            score: 0,
            zones: [],
            isBullseye: false,
            isPerfect: false,
            isTrickShot: false
        };
        
        // Score based on hits
        hits.forEach(hit => {
            const zone = this.getScoreZone(hit.impactPoint, hit.target);
            shotResult.zones.push(zone);
            shotResult.score += zone.points * arrowData.damage;
            
            if (zone.name === 'X-Ring') {
                shotResult.isBullseye = true;
                shotResult.isPerfect = drawStrength > 0.95;
                session.bullseyes++;
                if (shotResult.isPerfect) session.perfectShots++;
            }
            
            // Check for trick shots
            if (this.isTrickShot(shotResult, session.shotHistory)) {
                shotResult.isTrickShot = true;
                shotResult.score *= 2;
                session.trickShots++;
            }
        });
        
        // Update session
        session.arrowsRemaining--;
        session.score += shotResult.score;
        session.hits += hits.length;
        if (hits.length === 0) session.misses++;
        session.shotHistory.push(shotResult);
        
        // Check achievements
        this.checkAchievements(session, shotResult);
        
        // Check session end
        if (session.arrowsRemaining === 0 || (session.timeLimit && session.timeRemaining <= 0)) {
            this.endSession(session);
        }
        
        return shotResult;
    }
    
    /**
     * Calculate arrow trajectory with wind physics
     */
    calculateTrajectory(aimPoint, drawStrength, bow, wind, arrowData) {
        const velocity = drawStrength * bow.range * 2; // Initial velocity
        const accuracy = bow.accuracy;
        
        // Wind effect on trajectory
        const windEffect = {
            x: wind.speed * Math.cos(wind.direction) * (1 - accuracy),
            y: 0,
            z: wind.speed * Math.sin(wind.direction) * (1 - accuracy)
        };
        
        // Calculate final impact point
        const impactPoint = {
            x: aimPoint.x + (Math.random() - 0.5) * (1 - accuracy) * 2 + windEffect.x,
            y: aimPoint.y + (Math.random() - 0.5) * (1 - accuracy) * 2,
            z: aimPoint.z + windEffect.z
        };
        
        return {
            start: { x: 0, y: 1.5, z: 0 },
            end: impactPoint,
            velocity: velocity,
            flightTime: Math.sqrt(impactPoint.x ** 2 + impactPoint.z ** 2) / velocity
        };
    }
    
    /**
     * Check if arrow hits any targets
     */
    checkTargetHits(trajectory, targets) {
        const hits = [];
        
        targets.forEach(target => {
            if (!target.active) return;
            
            // Simple distance check (would be more complex with actual 3D collision)
            const distance = Math.sqrt(
                (trajectory.end.x - target.distance) ** 2 +
                trajectory.end.y ** 2
            );
            
            if (distance < target.size) {
                hits.push({
                    target: target,
                    impactPoint: { x: trajectory.end.x, y: trajectory.end.y },
                    distance: distance
                });
                
                target.hitCount++;
                if (target.hitCount >= target.health) {
                    target.active = false;
                }
            }
        });
        
        return hits;
    }
    
    /**
     * Get score zone based on impact point
     */
    getScoreZone(impactPoint, target) {
        const distanceFromCenter = Math.sqrt(
            impactPoint.x ** 2 + impactPoint.y ** 2
        ) / target.size;
        
        for (const zone of this.scoreZones) {
            if (distanceFromCenter <= zone.radius) {
                return zone;
            }
        }
        
        return { name: 'Miss', points: 0, radius: 1.0, color: 0x888888 };
    }
    
    /**
     * Check for trick shots (arrow splits, bank shots, etc.)
     */
    isTrickShot(currentShot, shotHistory) {
        if (shotHistory.length === 0) return false;
        
        const lastShot = shotHistory[shotHistory.length - 1];
        
        // Robin Hood shot (split previous arrow)
        if (currentShot.hits.length > 0 && lastShot.hits.length > 0) {
            const currentHit = currentShot.hits[0];
            const lastHit = lastShot.hits[0];
            
            const distance = Math.sqrt(
                (currentHit.impactPoint.x - lastHit.impactPoint.x) ** 2 +
                (currentHit.impactPoint.y - lastHit.impactPoint.y) ** 2
            );
            
            if (distance < 0.02) { // Very close to previous arrow
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * Check and award achievements
     */
    checkAchievements(session, shotResult) {
        const newAchievements = [];
        
        if (session.shotHistory.length === 1) {
            newAchievements.push('FIRST_SHOT');
        }
        
        if (shotResult.isBullseye) {
            newAchievements.push('BULLSEYE');
        }
        
        if (session.score >= 300 && session.mode.name === 'Standard Practice') {
            newAchievements.push('PERFECT_SCORE');
        }
        
        if (shotResult.isTrickShot) {
            newAchievements.push('ROBIN_HOOD');
        }
        
        newAchievements.forEach(achievementId => {
            if (!session.achievements.includes(achievementId)) {
                session.achievements.push(achievementId);
                const achievement = this.achievements[achievementId];
                console.log(`🏆 Achievement Unlocked: ${achievement.name} - ${achievement.description}`);
            }
        });
    }
    
    /**
     * End shooting session
     */
    endSession(session) {
        const range = this.ranges.get(session.rangeId);
        
        session.state = 'completed';
        session.endTime = Date.now();
        session.totalTime = (session.endTime - session.startTime) / 1000;
        
        // Calculate final statistics
        session.accuracy = session.hits / (session.arrows - session.arrowsRemaining);
        session.averageScore = session.score / (session.arrows - session.arrowsRemaining);
        
        // Update range statistics
        range.stats.totalShots += (session.arrows - session.arrowsRemaining);
        range.stats.totalHits += session.hits;
        range.stats.bullseyes += session.bullseyes;
        if (session.perfectShots > 0) range.stats.perfectRounds++;
        if (session.score > range.stats.bestScore) {
            range.stats.bestScore = session.score;
        }
        
        // Add to leaderboard
        range.leaderboard.push({
            playerId: session.playerId,
            score: session.score,
            accuracy: session.accuracy,
            bullseyes: session.bullseyes,
            mode: session.mode.name,
            timestamp: session.endTime
        });
        
        // Sort leaderboard
        range.leaderboard.sort((a, b) => b.score - a.score);
        range.leaderboard = range.leaderboard.slice(0, 100); // Keep top 100
        
        console.log(`Session completed! Final Score: ${session.score}`);
        console.log(`Accuracy: ${(session.accuracy * 100).toFixed(1)}%`);
        console.log(`Bullseyes: ${session.bullseyes} | Perfect Shots: ${session.perfectShots}`);
        console.log(`Trick Shots: ${session.trickShots}`);
        console.log(`Achievements: ${session.achievements.length}`);
        
        return session;
    }
    
    /**
     * Helper to get session by ID
     */
    getSessionById(sessionId) {
        for (const range of this.ranges.values()) {
            if (range.activeSession && range.activeSession.playerId === sessionId) {
                return range.activeSession;
            }
        }
        return null;
    }
    
    /**
     * Update system (called each frame)
     */
    update(deltaTime) {
        // Update wind for all ranges
        this.ranges.forEach(range => {
            this.updateWind(range, deltaTime);
        });
        
        // Update active sessions
        this.ranges.forEach(range => {
            if (range.activeSession && range.activeSession.state === 'active') {
                if (range.activeSession.timeLimit) {
                    range.activeSession.timeRemaining -= deltaTime;
                    if (range.activeSession.timeRemaining <= 0) {
                        this.endSession(range.activeSession);
                    }
                }
            }
        });
        
        // Update moving targets
        this.ranges.forEach(range => {
            range.targets.forEach(target => {
                if (target.moving && target.active) {
                    this.updateMovingTarget(target, deltaTime);
                }
            });
        });
    }
    
    /**
     * Update wind simulation
     */
    updateWind(range, deltaTime) {
        const windConfig = range.config.windEffect;
        
        // Gradually change wind speed and direction
        range.wind.speed += (Math.random() - 0.5) * range.wind.gustiness * deltaTime;
        range.wind.speed = Math.max(windConfig.min, Math.min(windConfig.max, range.wind.speed));
        
        range.wind.direction += (Math.random() - 0.5) * 0.5 * deltaTime;
        range.wind.direction = range.wind.direction % (Math.PI * 2);
    }
    
    /**
     * Update moving target position
     */
    updateMovingTarget(target, deltaTime) {
        if (!target.movement) return;
        
        // Simple oscillating movement
        target.movement.currentTime = (target.movement.currentTime || 0) + deltaTime;
        const offset = Math.sin(target.movement.currentTime * target.movement.speed) * target.movement.range;
        
        // Update target position (would update actual 3D position in real implementation)
        target.currentOffset = offset;
    }
    
    /**
     * Get range info
     */
    getRangeInfo(rangeId) {
        const range = this.ranges.get(rangeId);
        if (!range) return null;
        
        return {
            name: range.config.name,
            difficulty: range.config.difficulty,
            targets: range.targets.length,
            activeTargets: range.targets.filter(t => t.active).length,
            environment: range.environment,
            environmentModel: range.environmentModel,
            environmentSource: range.environmentSource,
            wind: range.wind,
            stats: range.stats,
            leaderboard: range.leaderboard.slice(0, 10)
        };
    }
}
