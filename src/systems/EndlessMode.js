/**
 * EndlessMode - Manages infinite dungeon progression
 * Endless gameplay system for Dynasty of Emberveil
 */

export class EndlessMode {
    constructor(engine) {
        this.engine = engine;
        this.currentFloor = 1;
        this.enemiesDefeated = 0;
        this.timeElapsed = 0;
        this.highestFloor = 1;
        this.totalRuns = 0;
        this.isActive = false;
        
        // Difficulty scaling
        this.difficultyMultiplier = 1.0;
        this.enemyHealthMultiplier = 1.0;
        this.enemyDamageMultiplier = 1.0;
        this.enemySpeedMultiplier = 1.0;
        
        // Floor types
        this.isBossFloor = false;
        this.floorModifier = null;
        
        this.initializeUI();
    }
    
    initializeUI() {
        // Add floor counter to UI
        const uiOverlay = document.getElementById('ui-overlay');
        
        const floorPanel = document.createElement('div');
        floorPanel.id = 'floor-panel';
        floorPanel.className = 'hud';
        floorPanel.style.cssText = 'top: 20px; left: 50%; transform: translateX(-50%); text-align: center; min-width: 200px;';
        floorPanel.innerHTML = `
            <div style="font-size: 1.2em; font-weight: bold; color: #c77dff;">
                FLOOR <span id="floor-number">1</span>
            </div>
            <div style="font-size: 0.8em; color: #e0aaff; margin-top: 5px;">
                <span id="enemies-defeated">0</span> Enemies Defeated
            </div>
            <div style="font-size: 0.8em; color: #e0aaff;">
                Time: <span id="time-elapsed">0:00</span>
            </div>
        `;
        uiOverlay.appendChild(floorPanel);
    }
    
    start() {
        this.isActive = true;
        this.currentFloor = 1;
        this.enemiesDefeated = 0;
        this.timeElapsed = 0;
        this.totalRuns++;
        this.updateDifficulty();
        this.updateUI();
        
        console.log('🎮 Endless Mode Started!');
    }
    
    update(delta) {
        if (!this.isActive) return;
        
        this.timeElapsed += delta;
        this.updateUI();
        
        // Track time-based achievements
        if (this.engine.achievementSystem) {
            this.engine.achievementSystem.onTimeElapsed(Math.floor(this.timeElapsed));
        }
        
        // Check if floor is cleared
        if (this.isFloorCleared()) {
            this.advanceFloor();
        }
    }
    
    isFloorCleared() {
        const enemies = this.engine.enemyManager.getEnemies();
        return enemies.length === 0 && this.enemiesDefeated > 0;
    }
    
    advanceFloor() {
        this.currentFloor++;
        
        if (this.currentFloor > this.highestFloor) {
            this.highestFloor = this.currentFloor;
        }
        
        // Notify quest system about floor
        if (this.engine.questSystem) {
            this.engine.questSystem.onFloorReached(this.currentFloor);
        }
        
        // Check if boss floor
        this.isBossFloor = (this.currentFloor % 5 === 0);
        
        // Apply floor modifier
        this.applyFloorModifier();
        
        // Update difficulty
        this.updateDifficulty();
        
        // Generate new dungeon
        this.generateFloor();
        
        // Show floor transition
        this.showFloorTransition();
        
        // Auto-save on floor advancement
        if (this.engine.saveSystem) {
            this.engine.saveSystem.saveGame('Floor completion');
        }
        
        console.log(`⬆️ Advanced to Floor ${this.currentFloor}`);
    }
    
    updateDifficulty() {
        // Exponential scaling
        this.difficultyMultiplier = 1.0 + (this.currentFloor * 0.1);
        this.enemyHealthMultiplier = 1.0 + (this.currentFloor * 0.15);
        this.enemyDamageMultiplier = 1.0 + (this.currentFloor * 0.08);
        this.enemySpeedMultiplier = Math.min(2.0, 1.0 + (this.currentFloor * 0.05));
    }
    
    applyFloorModifier() {
        const modifiers = [
            { name: 'Speed Boost', effect: 'enemy_speed_up' },
            { name: 'Tank Mode', effect: 'enemy_health_up' },
            { name: 'Berserker', effect: 'enemy_damage_up' },
            { name: 'Swarm', effect: 'extra_enemies' },
            { name: 'Elite Guard', effect: 'elite_enemies' }
        ];
        
        // 30% chance of modifier
        if (Math.random() < 0.3) {
            this.floorModifier = modifiers[Math.floor(Math.random() * modifiers.length)];
            console.log(`🎲 Floor Modifier: ${this.floorModifier.name}`);
        } else {
            this.floorModifier = null;
        }
    }
    
    generateFloor() {
        // Clear current dungeon
        if (this.engine.currentDungeon) {
            this.engine.scene.remove(this.engine.currentDungeon.floor);
            this.engine.scene.remove(this.engine.currentDungeon.walls);
            if (this.engine.currentDungeon.decorations) {
                this.engine.currentDungeon.decorations.forEach(deco => this.engine.scene.remove(deco));
            }
        }
        
        // Clear enemies
        this.engine.enemyManager.clearAllEnemies();
        
        // Select biome based on floor
        const biomes = ['crystal_cavern', 'fungal_city', 'vine_cathedral', 'broken_starship', 'twilight_throne'];
        const biomeIndex = Math.floor((this.currentFloor - 1) / 5) % biomes.length;
        const biome = biomes[biomeIndex];
        
        // Generate new dungeon
        this.engine.currentDungeon = this.engine.dungeonGenerator.generate(biome, this.currentFloor);
        this.engine.loadDungeon(this.engine.currentDungeon);
        
        // Play biome music
        if (this.engine.audioSystem) {
            this.engine.audioSystem.playMusic(biome);
        }
        
        // Track floor achievement
        if (this.engine.achievementSystem) {
            this.engine.achievementSystem.onFloorReached(this.currentFloor);
        }
        
        // Spawn enemies or boss
        if (this.isBossFloor) {
            // Play boss appear sound
            if (this.engine.audioSystem) {
                this.engine.audioSystem.playSoundEffect('boss_appear');
            }
            
            // Spawn a boss
            this.engine.enemyManager.spawnBoss(this.engine.currentDungeon);
        } else {
            // Spawn regular enemies based on floor
            const enemyCount = Math.min(15, 5 + Math.floor(this.currentFloor / 2));
            
            // Apply modifier
            let actualCount = enemyCount;
            if (this.floorModifier && this.floorModifier.effect === 'extra_enemies') {
                actualCount = Math.floor(enemyCount * 1.5);
            }
            
            this.engine.enemyManager.spawnEnemiesForDungeon(this.engine.currentDungeon, actualCount);
        }
        
        // Apply difficulty multipliers to spawned enemies
        this.applyDifficultyToEnemies();
    }
    
    applyDifficultyToEnemies() {
        const enemies = this.engine.enemyManager.getEnemies();
        enemies.forEach(enemy => {
            enemy.stats.hp = Math.floor(enemy.stats.hp * this.enemyHealthMultiplier);
            enemy.maxHp = enemy.stats.hp;
            enemy.stats.attack = Math.floor(enemy.stats.attack * this.enemyDamageMultiplier);
            enemy.stats.speed = enemy.stats.speed * this.enemySpeedMultiplier;
            
            // Apply floor modifier effects
            if (this.floorModifier) {
                switch (this.floorModifier.effect) {
                    case 'enemy_speed_up':
                        enemy.stats.speed *= 1.5;
                        break;
                    case 'enemy_health_up':
                        enemy.stats.hp *= 1.5;
                        enemy.maxHp = enemy.stats.hp;
                        break;
                    case 'enemy_damage_up':
                        enemy.stats.attack *= 1.5;
                        break;
                    case 'elite_enemies':
                        enemy.stats.hp *= 2;
                        enemy.stats.attack *= 1.3;
                        enemy.maxHp = enemy.stats.hp;
                        // Make enemy glow gold for elite
                        enemy.mesh.material.emissiveIntensity = 0.8;
                        break;
                }
            }
            
            enemy.mesh.userData.hp = enemy.stats.hp;
        });
    }
    
    showFloorTransition() {
        // Create transition overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #1a0033 0%, #2d0a4e 50%, #4a0e7a 100%);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            animation: fadeIn 0.3s ease-in;
        `;
        
        const title = document.createElement('div');
        title.style.cssText = `
            font-size: 3em;
            font-weight: bold;
            color: #c77dff;
            margin-bottom: 20px;
        `;
        title.textContent = `FLOOR ${this.currentFloor}`;
        
        const subtitle = document.createElement('div');
        subtitle.style.cssText = `
            font-size: 1.5em;
            color: #e0aaff;
        `;
        
        if (this.isBossFloor) {
            subtitle.textContent = '⚔️ BOSS FLOOR ⚔️';
            subtitle.style.color = '#ff6b9d';
        } else if (this.floorModifier) {
            subtitle.textContent = `${this.floorModifier.name}`;
        } else {
            subtitle.textContent = this.engine.currentDungeon.name;
        }
        
        overlay.appendChild(title);
        overlay.appendChild(subtitle);
        document.body.appendChild(overlay);
        
        // Remove after 2 seconds
        setTimeout(() => {
            overlay.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(overlay);
            }, 300);
        }, 2000);
    }
    
    updateUI() {
        const floorNumber = document.getElementById('floor-number');
        const enemiesDefeated = document.getElementById('enemies-defeated');
        const timeElapsed = document.getElementById('time-elapsed');
        
        if (floorNumber) floorNumber.textContent = this.currentFloor;
        if (enemiesDefeated) enemiesDefeated.textContent = this.enemiesDefeated;
        if (timeElapsed) {
            const minutes = Math.floor(this.timeElapsed / 60);
            const seconds = Math.floor(this.timeElapsed % 60);
            timeElapsed.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    }
    
    onEnemyDefeated() {
        this.enemiesDefeated++;
        this.updateUI();
    }
    
    endRun(victory = false) {
        this.isActive = false;
        
        // Show run summary
        this.showRunSummary(victory);
    }
    
    showRunSummary(victory) {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;
        
        const panel = document.createElement('div');
        panel.style.cssText = `
            background: linear-gradient(135deg, #1a0033, #2d0a4e);
            border: 3px solid #9d4edd;
            border-radius: 20px;
            padding: 40px;
            max-width: 500px;
            text-align: center;
            box-shadow: 0 0 40px rgba(157, 78, 221, 0.5);
        `;
        
        const minutes = Math.floor(this.timeElapsed / 60);
        const seconds = Math.floor(this.timeElapsed % 60);
        
        panel.innerHTML = `
            <h1 style="color: ${victory ? '#52b788' : '#ff6b9d'}; font-size: 2.5em; margin-bottom: 20px;">
                ${victory ? '🎉 VICTORY!' : '💀 DEFEATED'}
            </h1>
            <div style="color: #e0aaff; font-size: 1.2em; margin: 10px 0;">
                <strong>Floor Reached:</strong> ${this.currentFloor}
            </div>
            <div style="color: #e0aaff; font-size: 1.2em; margin: 10px 0;">
                <strong>Enemies Defeated:</strong> ${this.enemiesDefeated}
            </div>
            <div style="color: #e0aaff; font-size: 1.2em; margin: 10px 0;">
                <strong>Time Survived:</strong> ${minutes}:${seconds.toString().padStart(2, '0')}
            </div>
            <div style="color: #e0aaff; font-size: 1.2em; margin: 10px 0;">
                <strong>Highest Floor:</strong> ${this.highestFloor}
            </div>
            <button id="restart-button" style="
                margin-top: 30px;
                padding: 15px 40px;
                font-size: 1.2em;
                background: linear-gradient(135deg, #9d4edd, #c77dff);
                border: none;
                border-radius: 10px;
                color: white;
                cursor: pointer;
                font-weight: bold;
                box-shadow: 0 4px 15px rgba(157, 78, 221, 0.4);
            ">
                TRY AGAIN
            </button>
        `;
        
        overlay.appendChild(panel);
        document.body.appendChild(overlay);
        
        // Restart button handler
        document.getElementById('restart-button').addEventListener('click', () => {
            document.body.removeChild(overlay);
            this.restart();
        });
    }
    
    restart() {
        // Reset player
        if (this.engine.player) {
            this.engine.player.stats.hp = this.engine.player.stats.maxHp;
            this.engine.player.stats.mp = this.engine.player.stats.maxMp;
            this.engine.player.mesh.position.set(0, 1, 0);
        }
        
        // Restart endless mode
        this.start();
        this.generateFloor();
    }
    
    getStats() {
        return {
            currentFloor: this.currentFloor,
            highestFloor: this.highestFloor,
            enemiesDefeated: this.enemiesDefeated,
            timeElapsed: this.timeElapsed,
            totalRuns: this.totalRuns
        };
    }
}
