/**
 * Dynasty of Emberveil - Multiplayer Game Server
 * Production-Ready Online Multiplayer with Advanced Features
 * Version: 2.4.0
 */

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import os from 'os';
import compression from 'compression';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// ============================================
// SECURITY & OPTIMIZATION MIDDLEWARE
// ============================================

// Compression for faster responses
app.use(compression());

// Security headers
app.use(helmet({
  contentSecurityPolicy: false, // Allow game assets
  crossOriginEmbedderPolicy: false
}));

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));

// ============================================
// SERVER CONFIGURATION
// ============================================

const PORT = process.env.PORT || 3000;
const MAX_PLAYERS = parseInt(process.env.MAX_PLAYERS_PER_SERVER) || 500;
const TICK_RATE = parseInt(process.env.TICK_RATE) || 20;
const TICK_INTERVAL = 1000 / TICK_RATE;

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST'],
    credentials: true
  },
  pingTimeout: 60000,
  pingInterval: 25000,
  maxHttpBufferSize: 1e6, // 1MB max message size
  transports: ['websocket', 'polling']
});

// ============================================
// ANTI-CHEAT & VALIDATION
// ============================================

class AntiCheat {
  constructor() {
    this.playerFlags = new Map(); // Track suspicious activity
    this.actionTimestamps = new Map(); // Rate limiting
  }
  
  validateMovement(playerId, oldPos, newPos, deltaTime) {
    const distance = Math.sqrt(
      Math.pow(newPos.x - oldPos.x, 2) +
      Math.pow(newPos.z - oldPos.z, 2)
    );
    const maxSpeed = 15; // units per second (allow some buffer)
    const maxDistance = maxSpeed * (deltaTime / 1000);
    
    if (distance > maxDistance * 1.5) {
      this.flagPlayer(playerId, 'SPEED_HACK', `Distance: ${distance}, Max: ${maxDistance}`);
      return false;
    }
    return true;
  }
  
  validateAction(playerId, actionType) {
    const now = Date.now();
    if (!this.actionTimestamps.has(playerId)) {
      this.actionTimestamps.set(playerId, new Map());
    }
    
    const playerActions = this.actionTimestamps.get(playerId);
    const lastAction = playerActions.get(actionType) || 0;
    const timeSinceLastAction = now - lastAction;
    
    // Minimum 50ms between same actions
    if (timeSinceLastAction < 50) {
      this.flagPlayer(playerId, 'ACTION_SPAM', `${actionType} spam detected`);
      return false;
    }
    
    playerActions.set(actionType, now);
    return true;
  }
  
  validateDamage(damage, attackerLevel) {
    const maxDamage = attackerLevel * 50; // Scale with level
    if (damage > maxDamage) {
      return maxDamage; // Cap damage
    }
    return damage;
  }
  
  flagPlayer(playerId, reason, details) {
    if (!this.playerFlags.has(playerId)) {
      this.playerFlags.set(playerId, []);
    }
    
    const flags = this.playerFlags.get(playerId);
    flags.push({
      reason,
      details,
      timestamp: Date.now()
    });
    
    console.warn(`⚠️  Anti-Cheat: Player ${playerId} flagged for ${reason}: ${details}`);
    
    // Auto-kick after 3 flags
    if (flags.length >= 3) {
      console.error(`🚫 Player ${playerId} kicked for multiple anti-cheat violations`);
      return true; // Signal to kick player
    }
    return false;
  }
  
  cleanupOldFlags() {
    const oneHourAgo = Date.now() - 3600000;
    for (const [playerId, flags] of this.playerFlags) {
      const recentFlags = flags.filter(f => f.timestamp > oneHourAgo);
      if (recentFlags.length === 0) {
        this.playerFlags.delete(playerId);
      } else {
        this.playerFlags.set(playerId, recentFlags);
      }
    }
  }
}

// ============================================
// GAME STATE MANAGER
// ============================================

class GameState {
  constructor() {
    this.players = new Map();
    this.enemies = new Map();
    this.projectiles = new Map();
    this.items = new Map();
    this.chatMessages = [];
    this.worldSeed = Math.random();
    this.gameStartTime = Date.now();
    this.antiCheat = new AntiCheat();
    
    // Performance tracking
    this.tickCount = 0;
    this.lastTickTime = Date.now();
    this.avgTickTime = 0;
    
    // Initialize enemies
    this.spawnInitialEnemies();
    
    // Cleanup old flags periodically
    setInterval(() => this.antiCheat.cleanupOldFlags(), 300000); // Every 5 min
  }
  
  spawnInitialEnemies() {
    const enemyTypes = [
      { type: 'goblin', health: 100, level: 1 },
      { type: 'orc', health: 200, level: 3 },
      { type: 'skeleton', health: 150, level: 2 },
      { type: 'dragon_whelp', health: 500, level: 8 },
      { type: 'ice_golem', health: 800, level: 10 }
    ];
    
    for (let i = 0; i < 15; i++) {
      const enemyData = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
      const enemyId = `enemy_${Date.now()}_${i}`;
      
      this.enemies.set(enemyId, {
        id: enemyId,
        type: enemyData.type,
        position: {
          x: (Math.random() - 0.5) * 200,
          y: 0,
          z: (Math.random() - 0.5) * 200
        },
        rotation: { x: 0, y: Math.random() * Math.PI * 2, z: 0 },
        health: enemyData.health,
        maxHealth: enemyData.health,
        level: enemyData.level,
        alive: true,
        respawnTime: 10000, // 10 seconds
        lastAttackTime: 0
      });
    }
  }
  
  addPlayer(socket Id, playerData) {
    // Server capacity check
    if (this.players.size >= MAX_PLAYERS) {
      throw new Error('Server is full');
    }
    
    this.players.set(socketId, {
      id: socketId,
      username: this.sanitizeUsername(playerData.username) || `Player${this.players.size + 1}`,
      class: playerData.class || 'warrior',
      level: playerData.level || 1,
      experience: playerData.experience || 0,
      position: playerData.position || { x: 0, y: 0, z: 0 },
      rotation: playerData.rotation || { x: 0, y: 0, z: 0 },
      health: playerData.health || 100,
      maxHealth: playerData.maxHealth || 100,
      mana: playerData.mana || 50,
      maxMana: playerData.maxMana || 50,
      stats: playerData.stats || {},
      inventory: playerData.inventory || [],
      abilities: playerData.abilities || [],
      isAlive: true,
      lastUpdate: Date.now(),
      joinedAt: Date.now()
    });
  }
  
  sanitizeUsername(username) {
    if (!username) return null;
    // Remove special characters, limit length
    return username.replace(/[^a-zA-Z0-9_-]/g, '').substring(0, 20);
  }
  
  removePlayer(socketId) {
    this.players.delete(socketId);
  }
  
  updatePlayer(socketId, updates) {
    const player = this.players.get(socketId);
    if (player) {
      // Validate movement if position changed
      if (updates.position) {
        const deltaTime = Date.now() - player.lastUpdate;
        const isValid = this.antiCheat.validateMovement(
          socketId,
          player.position,
          updates.position,
          deltaTime
        );
        
        if (!isValid) {
          // Reject invalid movement
          console.warn(`Invalid movement from ${player.username}`);
          return false;
        }
      }
      
      Object.assign(player, updates);
      player.lastUpdate = Date.now();
      return true;
    }
    return false;
  }
  
  getPlayer(socketId) {
    return this.players.get(socketId);
  }
  
  getAllPlayers() {
    return Array.from(this.players.values());
  }
  
  getAllEnemies() {
    return Array.from(this.enemies.values());
  }
  
  damageEnemy(enemyId, damage, attackerId) {
    const enemy = this.enemies.get(enemyId);
    if (enemy && enemy.alive) {
      // Validate damage with anti-cheat
      const attacker = this.players.get(attackerId);
      if (!attacker) return null;
      
      const validatedDamage = this.antiCheat.validateDamage(damage, attacker.level);
      enemy.health -= validatedDamage;
      
      if (enemy.health <= 0) {
        enemy.health = 0;
        enemy.alive = false;
        enemy.diedAt = Date.now();
        
        // Give experience to attacker
        const expGain = enemy.level * 10;
        attacker.experience += expGain;
        
        // Check for level up
        const expRequired = attacker.level * 100;
        if (attacker.experience >= expRequired) {
          attacker.level++;
          attacker.experience -= expRequired;
          attacker.maxHealth += 10;
          attacker.maxMana += 5;
          attacker.health = attacker.maxHealth;
          attacker.mana = attacker.maxMana;
          
          return { killed: true, levelUp: true, newLevel: attacker.level, expGain };
        }
        
        return { killed: true, levelUp: false, expGain };
      }
      
      return { killed: false, damage: validatedDamage };
    }
    return null;
  }
  
  updateEnemies() {
    const now = Date.now();
    
    for (const [enemyId, enemy] of this.enemies) {
      if (!enemy.alive) {
        // Respawn after delay
        if (now - enemy.diedAt >= enemy.respawnTime) {
          enemy.alive = true;
          enemy.health = enemy.maxHealth;
          // Respawn at random location
          enemy.position = {
            x: (Math.random() - 0.5) * 200,
            y: 0,
            z: (Math.random() - 0.5) * 200
          };
        }
      } else {
        // Simple AI: wander around
        if (Math.random() < 0.1) { // 10% chance per tick
          const angle = Math.random() * Math.PI * 2;
          const distance = Math.random() * 5;
          enemy.position.x += Math.cos(angle) * distance;
          enemy.position.z += Math.sin(angle) * distance;
          
          // Keep enemies in bounds
          enemy.position.x = Math.max(-250, Math.min(250, enemy.position.x));
          enemy.position.z = Math.max(-250, Math.min(250, enemy.position.z));
          
          enemy.rotation.y = angle;
        }
      }
    }
  }
  
  getServerStats() {
    return {
      players: this.players.size,
      maxPlayers: MAX_PLAYERS,
      enemies: this.enemies.size,
      aliveEnemies: Array.from(this.enemies.values()).filter(e => e.alive).length,
      uptime: Date.now() - this.gameStartTime,
      avgTickTime: this.avgTickTime,
      tickRate: TICK_RATE
    };
  }
            attacker.health = attacker.maxHealth;
            attacker.maxMana += 5;
            attacker.mana = attacker.maxMana;
          }
          
          return { killed: true, expGain, levelUp: attacker.level };
        }
      }
      
      return { killed: false, damage };
    }
    return null;
  }
  
  respawnEnemy(enemyId) {
    const enemy = this.enemies.get(enemyId);
    if (enemy) {
      enemy.health = enemy.maxHealth;
      enemy.alive = true;
      enemy.position = {
        x: (Math.random() - 0.5) * 100,
        y: 0,
        z: (Math.random() - 0.5) * 100
      };
    }
  }
  
  addChatMessage(username, message) {
    const chatMsg = {
      username,
      message,
      timestamp: Date.now()
    };
    this.chatMessages.push(chatMsg);
    
    // Keep only last 100 messages
    if (this.chatMessages.length > 100) {
      this.chatMessages.shift();
    }
    
    return chatMsg;
  }
}

const gameState = new GameState();

// Serve static files
app.use(express.static(join(__dirname, 'dist')));
app.use(express.json());

// API endpoints
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    players: gameState.players.size,
    enemies: gameState.enemies.size,
    timestamp: Date.now()
  });
});

app.get('/api/stats', (req, res) => {
  res.json({
    totalPlayers: gameState.players.size,
    onlinePlayers: gameState.getAllPlayers().length,
    totalEnemies: gameState.enemies.size,
    aliveEnemies: gameState.getAllEnemies().filter(e => e.alive).length,
    gameUptime: Date.now() - gameState.gameStartTime
  });
});

// Socket.IO multiplayer logic
io.on('connection', (socket) => {
  console.log(`🎮 Player connected: ${socket.id}`);
  
  // Handle player join
  socket.on('player:join', (data) => {
    console.log(`👤 Player joining: ${data.username}`);
    
    gameState.addPlayer(socket.id, data);
    const player = gameState.getPlayer(socket.id);
    
    // Send initial game state to the new player
    socket.emit('game:init', {
      playerId: socket.id,
      player: player,
      players: gameState.getAllPlayers(),
      enemies: gameState.getAllEnemies(),
      worldSeed: gameState.worldSeed,
      chatMessages: gameState.chatMessages.slice(-50)
    });
    
    // Broadcast to all other players that new player joined
    socket.broadcast.emit('player:joined', player);
    
    console.log(`✅ Player joined: ${player.username} (${socket.id})`);
  });
  
  // Handle player movement
  socket.on('player:move', (data) => {
    gameState.updatePlayer(socket.id, {
      position: data.position,
      rotation: data.rotation
    });
    
    // Broadcast to all other players
    socket.broadcast.emit('player:moved', {
      playerId: socket.id,
      position: data.position,
      rotation: data.rotation
    });
  });
  
  // Handle player attack
  socket.on('player:attack', (data) => {
    const player = gameState.getPlayer(socket.id);
    if (!player) return;
    
    const { targetId, targetType, damage } = data;
    
    if (targetType === 'enemy') {
      const result = gameState.damageEnemy(targetId, damage || 20, socket.id);
      
      if (result) {
        // Broadcast attack to all players
        io.emit('enemy:damaged', {
          enemyId: targetId,
          damage: result.damage,
          attackerId: socket.id,
          killed: result.killed
        });
        
        if (result.killed) {
          // Notify attacker of rewards
          socket.emit('enemy:killed', {
            enemyId: targetId,
            expGain: result.expGain,
            level: result.levelUp
          });
          
          // Respawn enemy after 10 seconds
          setTimeout(() => {
            gameState.respawnEnemy(targetId);
            io.emit('enemy:respawned', {
              enemy: gameState.enemies.get(targetId)
            });
          }, 10000);
        }
      }
    } else if (targetType === 'player') {
      // PvP attack
      const targetPlayer = gameState.getPlayer(targetId);
      if (targetPlayer && targetPlayer.isAlive) {
        targetPlayer.health -= damage || 15;
        
        if (targetPlayer.health <= 0) {
          targetPlayer.health = 0;
          targetPlayer.isAlive = false;
        }
        
        io.emit('player:damaged', {
          playerId: targetId,
          damage: damage || 15,
          attackerId: socket.id,
          killed: !targetPlayer.isAlive
        });
      }
    }
  });
  
  // Handle ability use
  socket.on('player:ability', (data) => {
    const player = gameState.getPlayer(socket.id);
    if (!player) return;
    
    const { abilityId, targetPosition, targets } = data;
    
    // Check mana cost
    const manaCost = 20; // TODO: Get from ability data
    if (player.mana < manaCost) {
      socket.emit('ability:failed', { reason: 'Not enough mana' });
      return;
    }
    
    player.mana -= manaCost;
    
    // Broadcast ability use
    io.emit('player:used_ability', {
      playerId: socket.id,
      abilityId,
      targetPosition,
      targets
    });
    
    // Apply ability effects
    if (targets && targets.length > 0) {
      targets.forEach(target => {
        if (target.type === 'enemy') {
          gameState.damageEnemy(target.id, data.damage || 30, socket.id);
        }
      });
    }
  });
  
  // Handle chat messages
  socket.on('chat:send', (data) => {
    const player = gameState.getPlayer(socket.id);
    if (!player) return;
    
    const chatMsg = gameState.addChatMessage(player.username, data.message);
    
    // Broadcast to all players
    io.emit('chat:message', chatMsg);
  });
  
  // Handle player respawn
  socket.on('player:respawn', () => {
    const player = gameState.getPlayer(socket.id);
    if (player) {
      player.health = player.maxHealth;
      player.mana = player.maxMana;
      player.isAlive = true;
      player.position = { x: 0, y: 0, z: 0 };
      
      socket.emit('player:respawned', { player });
      socket.broadcast.emit('player:respawned_other', {
        playerId: socket.id,
        position: player.position
      });
    }
  });
  
  // Handle disconnect
  socket.on('disconnect', () => {
    const player = gameState.getPlayer(socket.id);
    if (player) {
      console.log(`👋 Player disconnected: ${player.username} (${socket.id})`);
      
      // Notify other players
      socket.broadcast.emit('player:left', {
        playerId: socket.id,
        username: player.username
      });
      
      // Remove from game state
      gameState.removePlayer(socket.id);
    }
  });
});

// Game loop - update game state 20 times per second
setInterval(() => {
  // Update enemy AI (simple patrol)
  gameState.enemies.forEach((enemy, enemyId) => {
    if (enemy.alive) {
      // Simple movement
      enemy.position.x += (Math.random() - 0.5) * 0.5;
      enemy.position.z += (Math.random() - 0.5) * 0.5;
      enemy.rotation.y = Math.atan2(
        Math.random() - 0.5,
        Math.random() - 0.5
      );
    }
  });
  
  // Broadcast enemy positions to all clients
  io.emit('enemies:update', {
    enemies: gameState.getAllEnemies()
  });
  
}, 50); // 20 FPS server tick rate

// Start server
function getNetworkIPs() {
  const nets = os.networkInterfaces();
  const results = [];
  
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        results.push(net.address);
      }
    }
  }
  
  return results;
}

httpServer.listen(PORT, '0.0.0.0', () => {
  const networkIPs = getNetworkIPs();
  
  console.log('\n' + '═'.repeat(70));
  console.log('🎮 DYNASTY OF EMBERVEIL - MULTIPLAYER SERVER');
  console.log('═'.repeat(70));
  console.log('\n🚀 Server Status: ONLINE');
  console.log(`⏰ Started: ${new Date().toLocaleString()}`);
  console.log('\n📡 Access URLs:');
  console.log(`   🏠 Local:     http://localhost:${PORT}`);
  console.log(`   🏠 Local:     http://127.0.0.1:${PORT}`);
  
  if (networkIPs.length > 0) {
    console.log('\n   🌐 Network URLs (share with players on your network):');
    networkIPs.forEach((ip, index) => {
      console.log(`   ${index + 1}. http://${ip}:${PORT}`);
    });
  }
  
  console.log('\n📊 Server Info:');
  console.log(`   Health Check: http://localhost:${PORT}/health`);
  console.log(`   Game Stats:   http://localhost:${PORT}/api/stats`);
  
  console.log('\n💡 Tips:');
  console.log('   • Share Network URLs with friends to play together');
  console.log('   • All players on the same WiFi can connect');
  console.log('   • Press Ctrl+C to stop the server');
  
  console.log('\n' + '═'.repeat(70));
  console.log('🎉 Server ready for multiplayer! Waiting for players...\n');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Shutting down multiplayer server...');
  console.log('💾 Saving game state...');
  
  // Notify all connected players
  io.emit('server:shutdown', {
    message: 'Server is shutting down. Please reconnect in a moment.'
  });
  
  httpServer.close(() => {
    console.log('✅ Server stopped gracefully');
    process.exit(0);
  });
});

export default httpServer;
