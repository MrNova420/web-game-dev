/**
 * EnemyAI - Advanced enemy AI behaviors and decision-making
 * Provides patrol patterns, aggro mechanics, and intelligent combat
 */

export class EnemyAI {
    constructor(enemy, engine) {
        this.enemy = enemy;
        this.engine = engine;
        
        // AI State
        this.state = 'idle'; // idle, patrol, chase, attack, flee
        this.previousState = 'idle';
        this.stateTimer = 0;
        
        // Behavior parameters
        this.detectionRange = 15;
        this.attackRange = 3;
        this.fleeHealthThreshold = 0.2; // Flee when below 20% HP
        this.patrolRadius = 10;
        this.chaseSpeed = 1.2; // Multiplier when chasing
        
        // Patrol system
        this.spawnPosition = enemy.mesh ? enemy.mesh.position.clone() : null;
        this.patrolPoints = [];
        this.currentPatrolIndex = 0;
        this.patrolWaitTime = 2; // seconds to wait at each point
        
        // Aggro system
        this.aggroTarget = null;
        this.aggroLevel = 0;
        this.maxAggroDistance = 25; // Maximum chase distance
        
        // Combat AI
        this.lastAttackTime = 0;
        this.attackCooldown = 2;
        this.combatTimer = 0;
        
        this.init();
    }
    
    init() {
        // Generate patrol points around spawn
        if (this.spawnPosition) {
            this.generatePatrolPoints();
        }
    }
    
    generatePatrolPoints() {
        const numPoints = 4;
        this.patrolPoints = [];
        
        for (let i = 0; i < numPoints; i++) {
            const angle = (i / numPoints) * Math.PI * 2;
            const radius = this.patrolRadius * (0.5 + Math.random() * 0.5);
            
            this.patrolPoints.push({
                x: this.spawnPosition.x + Math.cos(angle) * radius,
                z: this.spawnPosition.z + Math.sin(angle) * radius
            });
        }
    }
    
    update(delta) {
        if (!this.enemy.mesh || this.enemy.isDead) return;
        
        this.stateTimer += delta;
        this.combatTimer += delta;
        
        // Update aggro
        this.updateAggro();
        
        // State machine
        switch (this.state) {
            case 'idle':
                this.updateIdle(delta);
                break;
            case 'patrol':
                this.updatePatrol(delta);
                break;
            case 'chase':
                this.updateChase(delta);
                break;
            case 'attack':
                this.updateAttack(delta);
                break;
            case 'flee':
                this.updateFlee(delta);
                break;
        }
        
        // Check for state transitions
        this.checkStateTransitions();
    }
    
    updateAggro() {
        const player = this.engine.player;
        if (!player || !player.mesh) return;
        
        const distance = this.getDistanceToPlayer();
        
        // Detect player
        if (distance < this.detectionRange && !this.aggroTarget) {
            this.aggroTarget = player;
            this.aggroLevel = 100;
            this.changeState('chase');
        }
        
        // Lose aggro if too far
        if (this.aggroTarget && distance > this.maxAggroDistance) {
            this.aggroLevel = 0;
            this.aggroTarget = null;
            this.changeState('patrol');
        }
        
        // Decay aggro over time
        if (this.aggroLevel > 0 && this.state !== 'chase' && this.state !== 'attack') {
            this.aggroLevel = Math.max(0, this.aggroLevel - 10 * (1/60)); // Decay per second
        }
    }
    
    updateIdle(delta) {
        // Transition to patrol after idle time
        if (this.stateTimer > 3) {
            this.changeState('patrol');
        }
    }
    
    updatePatrol(delta) {
        if (this.patrolPoints.length === 0) {
            this.changeState('idle');
            return;
        }
        
        const target = this.patrolPoints[this.currentPatrolIndex];
        const dx = target.x - this.enemy.mesh.position.x;
        const dz = target.z - this.enemy.mesh.position.z;
        const distance = Math.sqrt(dx * dx + dz * dz);
        
        if (distance < 1) {
            // Reached patrol point, wait then move to next
            if (this.stateTimer > this.patrolWaitTime) {
                this.currentPatrolIndex = (this.currentPatrolIndex + 1) % this.patrolPoints.length;
                this.stateTimer = 0;
            }
        } else {
            // Move toward patrol point
            const speed = (this.enemy.speed || 2) * delta;
            const dirX = dx / distance;
            const dirZ = dz / distance;
            
            this.enemy.mesh.position.x += dirX * speed;
            this.enemy.mesh.position.z += dirZ * speed;
            
            // Face movement direction
            this.enemy.mesh.rotation.y = Math.atan2(dx, dz);
        }
    }
    
    updateChase(delta) {
        const player = this.engine.player;
        if (!player || !player.mesh) {
            this.changeState('patrol');
            return;
        }
        
        const distance = this.getDistanceToPlayer();
        
        // Chase player
        const dx = player.mesh.position.x - this.enemy.mesh.position.x;
        const dz = player.mesh.position.z - this.enemy.mesh.position.z;
        
        const speed = (this.enemy.speed || 2) * this.chaseSpeed * delta;
        const dirX = dx / distance;
        const dirZ = dz / distance;
        
        this.enemy.mesh.position.x += dirX * speed;
        this.enemy.mesh.position.z += dirZ * speed;
        
        // Face player
        this.enemy.mesh.rotation.y = Math.atan2(dx, dz);
        
        // Switch to attack if in range
        if (distance < this.attackRange) {
            this.changeState('attack');
        }
    }
    
    updateAttack(delta) {
        const player = this.engine.player;
        if (!player || !player.mesh) {
            this.changeState('patrol');
            return;
        }
        
        const distance = this.getDistanceToPlayer();
        
        // Face player
        const dx = player.mesh.position.x - this.enemy.mesh.position.x;
        const dz = player.mesh.position.z - this.enemy.mesh.position.z;
        this.enemy.mesh.rotation.y = Math.atan2(dx, dz);
        
        // Attack if cooldown ready
        const currentTime = Date.now() / 1000;
        if (currentTime - this.lastAttackTime > this.attackCooldown) {
            this.performAttack();
            this.lastAttackTime = currentTime;
        }
        
        // Return to chase if out of range
        if (distance > this.attackRange + 1) {
            this.changeState('chase');
        }
    }
    
    updateFlee(delta) {
        const player = this.engine.player;
        if (!player || !player.mesh) {
            this.changeState('patrol');
            return;
        }
        
        // Flee away from player
        const dx = this.enemy.mesh.position.x - player.mesh.position.x;
        const dz = this.enemy.mesh.position.z - player.mesh.position.z;
        const distance = Math.sqrt(dx * dx + dz * dz);
        
        if (distance < 0.1) return; // Avoid division by zero
        
        const speed = (this.enemy.speed || 2) * 1.5 * delta; // Flee faster
        const dirX = dx / distance;
        const dirZ = dz / distance;
        
        this.enemy.mesh.position.x += dirX * speed;
        this.enemy.mesh.position.z += dirZ * speed;
        
        // Face away from player
        this.enemy.mesh.rotation.y = Math.atan2(dx, dz);
        
        // Return to patrol if safe distance reached
        if (distance > this.detectionRange) {
            this.changeState('patrol');
        }
    }
    
    checkStateTransitions() {
        const player = this.engine.player;
        if (!player) return;
        
        // Check health for flee behavior
        const healthPercent = this.enemy.stats.hp / this.enemy.stats.maxHp;
        if (healthPercent < this.fleeHealthThreshold && this.state !== 'flee') {
            this.changeState('flee');
            return;
        }
        
        // Check distance for aggro/deaggro
        const distance = this.getDistanceToPlayer();
        
        if (this.state === 'idle' || this.state === 'patrol') {
            if (distance < this.detectionRange) {
                this.aggroTarget = player;
                this.changeState('chase');
            }
        }
    }
    
    performAttack() {
        const player = this.engine.player;
        if (!player) return;
        
        const damage = this.enemy.stats?.attack || 10;
        
        // Deal damage to player
        if (player.takeDamage) {
            player.takeDamage(damage);
        }
        
        // Play attack sound
        if (this.engine.audioSystem) {
            this.engine.audioSystem.playSoundEffect('hit');
        }
        
        // Create attack effect
        if (this.engine.particleSystem && this.enemy.mesh) {
            this.engine.particleSystem.createHitEffect(
                this.enemy.mesh.position,
                0xff4444
            );
        }
        
        // Attack animation (scale pulse)
        if (this.enemy.mesh) {
            const originalScale = this.enemy.mesh.scale.clone();
            this.enemy.mesh.scale.multiplyScalar(1.3);
            setTimeout(() => {
                if (this.enemy.mesh) {
                    this.enemy.mesh.scale.copy(originalScale);
                }
            }, 100);
        }
    }
    
    changeState(newState) {
        if (this.state === newState) return;
        
        this.previousState = this.state;
        this.state = newState;
        this.stateTimer = 0;
        
        // State entry logic
        if (newState === 'patrol' && this.patrolPoints.length === 0) {
            this.generatePatrolPoints();
        }
    }
    
    getDistanceToPlayer() {
        const player = this.engine.player;
        if (!player || !player.mesh || !this.enemy.mesh) return Infinity;
        
        const dx = player.mesh.position.x - this.enemy.mesh.position.x;
        const dz = player.mesh.position.z - this.enemy.mesh.position.z;
        return Math.sqrt(dx * dx + dz * dz);
    }
    
    // Called when enemy takes damage
    onDamaged(damage, source) {
        // Increase aggro
        this.aggroLevel = 100;
        this.aggroTarget = source;
        
        // React to damage
        if (this.state === 'idle' || this.state === 'patrol') {
            this.changeState('chase');
        }
    }
    
    // Get current behavior state for debugging
    getDebugInfo() {
        return {
            state: this.state,
            aggroLevel: this.aggroLevel,
            distanceToPlayer: this.getDistanceToPlayer().toFixed(1),
            patrolPoint: this.currentPatrolIndex
        };
    }
}
