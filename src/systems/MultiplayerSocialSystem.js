/**
 * MultiplayerSocialSystem - Player interaction and community features
 * Enables cooperative play, chat, and social gathering
 */

export class MultiplayerSocialSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        this.players = new Map(); // Other players in the world
        this.localPlayer = null;
        
        this.chatMessages = [];
        this.maxChatMessages = 100;
        
        this.socialFeatures = {
            chat: true,
            emotes: true,
            trading: true,
            grouping: true,
            friendsList: true
        };
        
        this.groups = new Map();
        this.friends = new Set();
        
        this.emotes = [
            { name: 'wave', icon: '👋', animation: 'wave' },
            { name: 'dance', icon: '💃', animation: 'dance' },
            { name: 'laugh', icon: '😄', animation: 'laugh' },
            { name: 'bow', icon: '🙇', animation: 'bow' },
            { name: 'cheer', icon: '🎉', animation: 'cheer' },
            { name: 'sit', icon: '🪑', animation: 'sit' }
        ];
        
        this.init();
    }
    
    init() {
        this.setupChatUI();
        this.setupSocialHub();
        
        logger.info('👥 Multiplayer Social System initialized');
    }
    
    setupChatUI() {
        // Create chat container
        const chatContainer = document.createElement('div');
        chatContainer.id = 'game-chat';
        chatContainer.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            width: 400px;
            max-height: 300px;
            background: rgba(0, 0, 0, 0.7);
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 10px;
            padding: 10px;
            font-family: Arial, sans-serif;
            color: white;
            overflow-y: auto;
            z-index: 1000;
        `;
        
        // Create chat input
        const chatInput = document.createElement('input');
        chatInput.id = 'chat-input';
        chatInput.type = 'text';
        chatInput.placeholder = 'Press Enter to chat...';
        chatInput.style.cssText = `
            width: 100%;
            padding: 8px;
            margin-top: 10px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 5px;
            color: white;
            font-size: 14px;
        `;
        
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && chatInput.value.trim()) {
                this.sendChatMessage(chatInput.value);
                chatInput.value = '';
            }
        });
        
        const messagesContainer = document.createElement('div');
        messagesContainer.id = 'chat-messages';
        messagesContainer.style.cssText = `
            max-height: 250px;
            overflow-y: auto;
            margin-bottom: 10px;
        `;
        
        chatContainer.appendChild(messagesContainer);
        chatContainer.appendChild(chatInput);
        document.body.appendChild(chatContainer);
        
        this.chatContainer = messagesContainer;
        this.chatInput = chatInput;
    }
    
    setupSocialHub() {
        // Social hub for player gathering
        logger.info('🏛️ Social hub initialized');
    }
    
    sendChatMessage(message, channel = 'global') {
        const chatMessage = {
            id: Date.now(),
            player: this.localPlayer?.name || 'Player',
            message: message,
            channel: channel,
            timestamp: new Date().toLocaleTimeString()
        };
        
        this.chatMessages.push(chatMessage);
        
        // Keep only last N messages
        if (this.chatMessages.length > this.maxChatMessages) {
            this.chatMessages.shift();
        }
        
        this.displayChatMessage(chatMessage);
        
        // Broadcast to other players (simulated for now)
        logger.info(`[${channel}] ${chatMessage.player}: ${message}`);
    }
    
    displayChatMessage(chatMessage) {
        if (!this.chatContainer) return;
        
        const messageElement = document.createElement('div');
        messageElement.style.cssText = `
            padding: 5px;
            margin: 2px 0;
            border-radius: 3px;
            background: rgba(255, 255, 255, 0.05);
        `;
        
        const channelColor = {
            global: '#4CAF50',
            party: '#2196F3',
            whisper: '#9C27B0',
            system: '#FFC107'
        }[chatMessage.channel] || '#fff';
        
        // Create elements safely without innerHTML to prevent XSS
        const channelSpan = document.createElement('span');
        channelSpan.style.cssText = `color: ${channelColor}; font-weight: bold;`;
        channelSpan.textContent = `[${chatMessage.channel}]`;
        
        const playerSpan = document.createElement('span');
        playerSpan.style.color = '#FFD700';
        playerSpan.textContent = `${chatMessage.player}:`;
        
        const messageSpan = document.createElement('span');
        messageSpan.textContent = chatMessage.message;
        
        const timeSpan = document.createElement('span');
        timeSpan.style.cssText = 'color: #888; font-size: 11px; float: right;';
        timeSpan.textContent = chatMessage.timestamp;
        
        messageElement.appendChild(channelSpan);
        messageElement.appendChild(document.createTextNode(' '));
        messageElement.appendChild(playerSpan);
        messageElement.appendChild(document.createTextNode(' '));
        messageElement.appendChild(messageSpan);
        messageElement.appendChild(timeSpan);
        
        this.chatContainer.appendChild(messageElement);
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
    }
    
    addPlayer(playerId, playerData) {
        this.players.set(playerId, playerData);
        
        // Show join message
        this.sendChatMessage(`${playerData.name} joined the game`, 'system');
        
        logger.info(`👤 Player joined: ${playerData.name}`);
    }
    
    removePlayer(playerId) {
        const player = this.players.get(playerId);
        if (player) {
            this.sendChatMessage(`${player.name} left the game`, 'system');
            this.players.delete(playerId);
        }
    }
    
    createGroup(groupName, leaderId) {
        const group = {
            id: Date.now(),
            name: groupName,
            leader: leaderId,
            members: [leaderId],
            maxMembers: 5,
            created: Date.now()
        };
        
        this.groups.set(group.id, group);
        
        this.sendChatMessage(`Group "${groupName}" created!`, 'system');
        
        return group;
    }
    
    joinGroup(groupId, playerId) {
        const group = this.groups.get(groupId);
        if (!group) return false;
        
        if (group.members.length >= group.maxMembers) {
            this.sendChatMessage('Group is full!', 'system');
            return false;
        }
        
        group.members.push(playerId);
        this.sendChatMessage(`You joined group "${group.name}"`, 'party');
        
        return true;
    }
    
    leaveGroup(groupId, playerId) {
        const group = this.groups.get(groupId);
        if (!group) return false;
        
        const index = group.members.indexOf(playerId);
        if (index !== -1) {
            group.members.splice(index, 1);
            
            if (group.members.length === 0) {
                this.groups.delete(groupId);
            }
        }
        
        return true;
    }
    
    performEmote(emoteName) {
        const emote = this.emotes.find(e => e.name === emoteName);
        if (!emote) return;
        
        // Show emote above player
        this.sendChatMessage(`${emote.icon} *${emoteName}*`, 'system');
        
        // Trigger animation
        logger.info(`Performing emote: ${emoteName}`);
    }
    
    addFriend(playerId) {
        this.friends.add(playerId);
        this.sendChatMessage('Friend added!', 'system');
    }
    
    removeFriend(playerId) {
        this.friends.delete(playerId);
    }
    
    whisper(targetPlayerId, message) {
        this.sendChatMessage(`[To ${targetPlayerId}] ${message}`, 'whisper');
    }
    
    getOnlinePlayers() {
        return Array.from(this.players.values());
    }
    
    getNearbyPlayers(position, radius = 10) {
        return this.getOnlinePlayers().filter(player => {
            if (!player.position) return false;
            const dx = player.position.x - position.x;
            const dz = player.position.z - position.z;
            return Math.sqrt(dx * dx + dz * dz) <= radius;
        });
    }
    
    update(deltaTime) {
        // Update player positions, states, etc.
    }
    
    dispose() {
        if (this.chatContainer && this.chatContainer.parentElement) {
            this.chatContainer.parentElement.remove();
        }
        
        logger.info('👥 Multiplayer Social System disposed');
    }
}
