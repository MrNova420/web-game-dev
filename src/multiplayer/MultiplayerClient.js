/**
 * MultiplayerClient - Client-side multiplayer integration
 * Handles real-time communication with game server
 */

import { io } from 'socket.io-client';

export class MultiplayerClient {
  constructor(gameEngine) {
    this.gameEngine = gameEngine;
    this.socket = null;
    this.connected = false;
    this.playerId = null;
    this.otherPlayers = new Map();
    this.serverEnemies = new Map();
    
    // Connection settings
    this.serverURL = this.detectServerURL();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    
    console.log('🌐 Multiplayer Client initialized');
    console.log(`📡 Server URL: ${this.serverURL}`);
  }
  
  detectServerURL() {
    // Auto-detect server URL based on current page
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    
    // If on localhost development, use port 3000
    if (host.includes('localhost:5173') || host.includes('127.0.0.1:5173')) {
      return 'http://localhost:3000';
    }
    
    // Otherwise use same host
    return `${window.location.protocol}//${host}`;
  }
  
  connect(playerData = {}) {
    console.log('🔌 Connecting to multiplayer server...');
    
    this.socket = io(this.serverURL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      timeout: 10000
    });
    
    this.setupEventHandlers();
    
    // Join game after connection
    this.socket.on('connect', () => {
      console.log('✅ Connected to multiplayer server');
      this.connected = true;
      this.reconnectAttempts = 0;
      
      // Send player join request
      this.socket.emit('player:join', {
        username: playerData.username || `Player${Math.floor(Math.random() * 1000)}`,
        class: playerData.class || 'warrior',
        level: playerData.level || 1,
        position: this.gameEngine.player?.position || { x: 0, y: 0, z: 0 }
      });
    });
    
    return new Promise((resolve, reject) => {
      this.socket.on('game:init', (data) => {
        resolve(data);
      });
      
      this.socket.on('connect_error', (error) => {
        console.error('❌ Connection error:', error.message);
        reject(error);
      });
      
      setTimeout(() => {
        if (!this.connected) {
          reject(new Error('Connection timeout'));
        }
      }, 10000);
    });
  }
  
  setupEventHandlers() {
    // Connection events
    this.socket.on('disconnect', (reason) => {
      console.log('🔌 Disconnected from server:', reason);
      this.connected = false;
      this.showDisconnectMessage(reason);
    });
    
    this.socket.on('reconnect', (attemptNumber) => {
      console.log(`🔄 Reconnected after ${attemptNumber} attempts`);
      this.showReconnectMessage();
    });
    
    this.socket.on('reconnect_failed', () => {
      console.error('❌ Failed to reconnect to server');
      this.showReconnectFailedMessage();
    });
    
    // Game state events
    this.socket.on('game:init', (data) => {
      this.handleGameInit(data);
    });
    
    // Player events
    this.socket.on('player:joined', (playerData) => {
      this.handlePlayerJoined(playerData);
    });
    
    this.socket.on('player:left', (data) => {
      this.handlePlayerLeft(data);
    });
    
    this.socket.on('player:moved', (data) => {
      this.handlePlayerMoved(data);
    });
    
    this.socket.on('player:damaged', (data) => {
      this.handlePlayerDamaged(data);
    });
    
    this.socket.on('player:used_ability', (data) => {
      this.handlePlayerAbility(data);
    });
    
    // Enemy events
    this.socket.on('enemies:update', (data) => {
      this.handleEnemiesUpdate(data);
    });
    
    this.socket.on('enemy:damaged', (data) => {
      this.handleEnemyDamaged(data);
    });
    
    this.socket.on('enemy:respawned', (data) => {
      this.handleEnemyRespawned(data);
    });
    
    // Chat events
    this.socket.on('chat:message', (data) => {
      this.handleChatMessage(data);
    });
    
    // Server events
    this.socket.on('server:shutdown', (data) => {
      this.showServerShutdownMessage(data.message);
    });
  }
  
  // Game initialization
  handleGameInit(data) {
    console.log('🎮 Game initialized', data);
    this.playerId = data.playerId;
    
    // Update player data
    if (this.gameEngine.player && data.player) {
      Object.assign(this.gameEngine.player, data.player);
    }
    
    // Spawn other players
    data.players.forEach(player => {
      if (player.id !== this.playerId) {
        this.spawnOtherPlayer(player);
      }
    });
    
    // Sync enemies
    data.enemies.forEach(enemy => {
      this.syncEnemy(enemy);
    });
    
    // Load chat history
    if (data.chatMessages && data.chatMessages.length > 0) {
      data.chatMessages.forEach(msg => {
        this.addChatMessage(msg);
      });
    }
    
    this.showConnectedMessage(data.players.length);
  }
  
  // Player joined
  handlePlayerJoined(playerData) {
    console.log(`👤 Player joined: ${playerData.username}`);
    this.spawnOtherPlayer(playerData);
    this.showPlayerJoinedNotification(playerData.username);
  }
  
  // Player left
  handlePlayerLeft(data) {
    console.log(`👋 Player left: ${data.username}`);
    this.removeOtherPlayer(data.playerId);
    this.showPlayerLeftNotification(data.username);
  }
  
  // Player moved
  handlePlayerMoved(data) {
    const player = this.otherPlayers.get(data.playerId);
    if (player && player.mesh) {
      // Smooth interpolation
      player.targetPosition = data.position;
      player.targetRotation = data.rotation;
    }
  }
  
  // Player damaged
  handlePlayerDamaged(data) {
    if (data.playerId === this.playerId && this.gameEngine.player) {
      // We got hit!
      this.gameEngine.player.takeDamage(data.damage);
      this.showDamageIndicator(data.damage);
      
      if (data.killed) {
        this.handlePlayerDeath();
      }
    } else {
      // Another player got hit
      const player = this.otherPlayers.get(data.playerId);
      if (player) {
        this.showDamageNumber(player.mesh.position, data.damage);
      }
    }
  }
  
  // Player ability
  handlePlayerAbility(data) {
    const player = data.playerId === this.playerId ? 
      this.gameEngine.player : 
      this.otherPlayers.get(data.playerId);
    
    if (player) {
      this.playAbilityEffect(player, data.abilityId, data.targetPosition);
    }
  }
  
  // Enemy updates
  handleEnemiesUpdate(data) {
    data.enemies.forEach(enemyData => {
      this.syncEnemy(enemyData);
    });
  }
  
  handleEnemyDamaged(data) {
    const enemy = this.serverEnemies.get(data.enemyId);
    if (enemy && this.gameEngine.enemyManager) {
      // Find enemy in scene
      const sceneEnemy = this.gameEngine.enemyManager.enemies.find(e => e.id === data.enemyId);
      if (sceneEnemy) {
        this.showDamageNumber(sceneEnemy.mesh.position, data.damage);
        
        if (data.killed) {
          this.playDeathAnimation(sceneEnemy);
        }
      }
    }
  }
  
  handleEnemyRespawned(data) {
    this.syncEnemy(data.enemy);
    this.playRespawnEffect(data.enemy.position);
  }
  
  // Chat message
  handleChatMessage(data) {
    this.addChatMessage(data);
  }
  
  // Send player position updates
  sendMovement(position, rotation) {
    if (this.connected && this.socket) {
      this.socket.emit('player:move', {
        position,
        rotation
      });
    }
  }
  
  // Send attack
  sendAttack(targetId, targetType, damage) {
    if (this.connected && this.socket) {
      this.socket.emit('player:attack', {
        targetId,
        targetType,
        damage
      });
    }
  }
  
  // Send ability use
  sendAbility(abilityId, targetPosition, targets, damage) {
    if (this.connected && this.socket) {
      this.socket.emit('player:ability', {
        abilityId,
        targetPosition,
        targets,
        damage
      });
    }
  }
  
  // Send chat message
  sendChatMessage(message) {
    if (this.connected && this.socket) {
      this.socket.emit('chat:send', {
        message
      });
    }
  }
  
  // Request respawn
  requestRespawn() {
    if (this.connected && this.socket) {
      this.socket.emit('player:respawn');
    }
  }
  
  // Helper methods
  spawnOtherPlayer(playerData) {
    if (this.otherPlayers.has(playerData.id)) return;
    
    // Create player mesh in scene
    const playerMesh = this.gameEngine.modelLoader?.createPlayerMesh({
      class: playerData.class,
      position: playerData.position
    });
    
    if (playerMesh) {
      this.otherPlayers.set(playerData.id, {
        ...playerData,
        mesh: playerMesh,
        targetPosition: playerData.position,
        targetRotation: playerData.rotation
      });
      
      this.gameEngine.scene.add(playerMesh);
    }
  }
  
  removeOtherPlayer(playerId) {
    const player = this.otherPlayers.get(playerId);
    if (player && player.mesh) {
      this.gameEngine.scene.remove(player.mesh);
    }
    this.otherPlayers.delete(playerId);
  }
  
  syncEnemy(enemyData) {
    this.serverEnemies.set(enemyData.id, enemyData);
    
    if (this.gameEngine.enemyManager) {
      // Update or create enemy in scene
      let sceneEnemy = this.gameEngine.enemyManager.enemies.find(e => e.id === enemyData.id);
      
      if (!sceneEnemy && enemyData.alive) {
        // Spawn new enemy
        sceneEnemy = this.gameEngine.enemyManager.spawnEnemy(enemyData);
      } else if (sceneEnemy) {
        // Update position
        sceneEnemy.mesh.position.copy(enemyData.position);
        sceneEnemy.mesh.rotation.y = enemyData.rotation.y;
        sceneEnemy.health = enemyData.health;
        sceneEnemy.alive = enemyData.alive;
      }
    }
  }
  
  // Update loop - interpolate other players
  update(deltaTime) {
    if (!this.connected) return;
    
    this.otherPlayers.forEach((player, playerId) => {
      if (player.mesh && player.targetPosition) {
        // Smooth interpolation
        player.mesh.position.lerp(player.targetPosition, 0.3);
        
        if (player.targetRotation) {
          player.mesh.rotation.y = player.targetRotation.y;
        }
      }
    });
  }
  
  // UI Notifications
  showConnectedMessage(playerCount) {
    this.showNotification(`✅ Connected to server! ${playerCount} player(s) online`, 'success');
  }
  
  showDisconnectMessage(reason) {
    this.showNotification(`🔌 Disconnected: ${reason}`, 'warning');
  }
  
  showReconnectMessage() {
    this.showNotification('🔄 Reconnected to server!', 'success');
  }
  
  showReconnectFailedMessage() {
    this.showNotification('❌ Failed to reconnect. Please refresh the page.', 'error');
  }
  
  showPlayerJoinedNotification(username) {
    this.showNotification(`👤 ${username} joined the game`, 'info');
  }
  
  showPlayerLeftNotification(username) {
    this.showNotification(`👋 ${username} left the game`, 'info');
  }
  
  showServerShutdownMessage(message) {
    this.showNotification(`⚠️ ${message}`, 'warning');
  }
  
  showNotification(message, type = 'info') {
    // Use game's notification system if available
    if (this.gameEngine.modernUISystem) {
      this.gameEngine.modernUISystem.showNotification(message, type);
    } else {
      console.log(`[${type.toUpperCase()}] ${message}`);
    }
  }
  
  showDamageIndicator(damage) {
    // Flash screen red
    if (this.gameEngine.scene) {
      // TODO: Add damage overlay effect
      console.log(`💥 Took ${damage} damage!`);
    }
  }
  
  showDamageNumber(position, damage) {
    // Show floating damage number
    // TODO: Create floating text at position
    console.log(`💥 Damage: ${damage}`);
  }
  
  playAbilityEffect(player, abilityId, targetPosition) {
    // Play ability visual/sound effects
    console.log(`✨ ${player.username || 'Player'} used ability: ${abilityId}`);
  }
  
  playDeathAnimation(enemy) {
    // Play death animation
    console.log(`💀 Enemy defeated: ${enemy.type}`);
  }
  
  playRespawnEffect(position) {
    // Play respawn particle effect
    console.log(`✨ Enemy respawned at`, position);
  }
  
  handlePlayerDeath() {
    console.log('💀 You died!');
    // Show death screen with respawn button
    setTimeout(() => {
      this.requestRespawn();
    }, 3000);
  }
  
  addChatMessage(data) {
    const chatContainer = document.getElementById('chat-messages');
    if (chatContainer) {
      const msgElement = document.createElement('div');
      msgElement.className = 'chat-message';
      msgElement.innerHTML = `
        <span class="chat-username">${data.username}:</span>
        <span class="chat-text">${data.message}</span>
      `;
      chatContainer.appendChild(msgElement);
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }
  
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.connected = false;
      console.log('👋 Disconnected from multiplayer server');
    }
  }
}
