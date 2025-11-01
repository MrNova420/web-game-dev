import { logger } from '../core/Logger.js';
/**
 * FriendsAndChatSystem.js
 * Phase 6 - Friends and Chat System
 * Friend management, direct messaging, and chat channels
 * ~700 lines
 */

export class FriendsAndChatSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // Friends management
        this.friends = new Map(); // friendId -> friend data
        this.friendRequests = new Map(); // requestId -> request data
        this.blockedUsers = new Set();
        
        // Chat system
        this.chatChannels = new Map();
        this.privateMessages = new Map(); // conversationId -> messages
        this.chatHistory = [];
        this.maxChatHistory = 100;
        
        // Online status
        this.onlineStatus = 'online'; // online, away, busy, invisible
        this.customStatus = '';
        
        // Initialize default channels
        this.initializeChannels();
        
        // Chat settings
        this.settings = {
            profanityFilter: true,
            allowPrivateMessages: true,
            allowFriendRequests: true,
            showOnlineStatus: true,
            chatNotifications: true,
            soundEnabled: true
        };
    }
    
    /**
     * Initialize default chat channels
     */
    initializeChannels() {
        this.chatChannels.set('global', {
            id: 'global',
            name: 'Global',
            type: 'public',
            messages: [],
            members: new Set(),
            maxMessages: 100
        });
        
        this.chatChannels.set('trade', {
            id: 'trade',
            name: 'Trade',
            type: 'public',
            messages: [],
            members: new Set(),
            maxMessages: 50
        });
        
        this.chatChannels.set('guild', {
            id: 'guild',
            name: 'Guild',
            type: 'guild',
            messages: [],
            members: new Set(),
            maxMessages: 100
        });
        
        this.chatChannels.set('party', {
            id: 'party',
            name: 'Party',
            type: 'party',
            messages: [],
            members: new Set(),
            maxMessages: 50
        });
    }
    
    /**
     * Send friend request
     */
    sendFriendRequest(targetUserId, message = '') {
        // Check if already friends
        if (this.friends.has(targetUserId)) {
            return { success: false, message: 'Already friends' };
        }
        
        // Check if already sent request
        for (const [requestId, request] of this.friendRequests) {
            if (request.to === targetUserId && request.status === 'pending') {
                return { success: false, message: 'Friend request already sent' };
            }
        }
        
        // Check if blocked
        if (this.blockedUsers.has(targetUserId)) {
            return { success: false, message: 'Cannot send request to blocked user' };
        }
        
        const requestId = `request_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const request = {
            id: requestId,
            from: this.gameEngine.player?.id || 'player',
            to: targetUserId,
            message: message,
            timestamp: Date.now(),
            status: 'pending'
        };
        
        this.friendRequests.set(requestId, request);
        
        logger.info(`Sent friend request to ${targetUserId}`);
        return { success: true, requestId: requestId };
    }
    
    /**
     * Accept friend request
     */
    acceptFriendRequest(requestId) {
        const request = this.friendRequests.get(requestId);
        if (!request || request.status !== 'pending') {
            return { success: false, message: 'Invalid request' };
        }
        
        // Add as friend
        const friend = {
            id: request.from,
            addedDate: Date.now(),
            nickname: null,
            notes: '',
            favorite: false,
            lastOnline: Date.now(),
            onlineStatus: 'online'
        };
        
        this.friends.set(request.from, friend);
        
        // Update request status
        request.status = 'accepted';
        request.acceptedDate = Date.now();
        
        // Create private conversation
        this.createPrivateConversation(request.from);
        
        logger.info(`Accepted friend request from ${request.from}`);
        return { success: true, friend: friend };
    }
    
    /**
     * Decline friend request
     */
    declineFriendRequest(requestId) {
        const request = this.friendRequests.get(requestId);
        if (!request || request.status !== 'pending') {
            return { success: false, message: 'Invalid request' };
        }
        
        request.status = 'declined';
        request.declinedDate = Date.now();
        
        logger.info(`Declined friend request from ${request.from}`);
        return { success: true };
    }
    
    /**
     * Remove friend
     */
    removeFriend(friendId) {
        if (!this.friends.has(friendId)) {
            return { success: false, message: 'Not in friends list' };
        }
        
        this.friends.delete(friendId);
        
        // Remove private conversation
        const conversationId = this.getConversationId(friendId);
        this.privateMessages.delete(conversationId);
        
        logger.info(`Removed friend ${friendId}`);
        return { success: true };
    }
    
    /**
     * Block user
     */
    blockUser(userId) {
        // Remove from friends if present
        if (this.friends.has(userId)) {
            this.removeFriend(userId);
        }
        
        // Add to blocked list
        this.blockedUsers.add(userId);
        
        logger.info(`Blocked user ${userId}`);
        return { success: true };
    }
    
    /**
     * Unblock user
     */
    unblockUser(userId) {
        if (!this.blockedUsers.has(userId)) {
            return { success: false, message: 'User not blocked' };
        }
        
        this.blockedUsers.delete(userId);
        
        logger.info(`Unblocked user ${userId}`);
        return { success: true };
    }
    
    /**
     * Set friend nickname
     */
    setFriendNickname(friendId, nickname) {
        const friend = this.friends.get(friendId);
        if (!friend) {
            return { success: false, message: 'Friend not found' };
        }
        
        friend.nickname = nickname;
        return { success: true };
    }
    
    /**
     * Toggle friend favorite
     */
    toggleFriendFavorite(friendId) {
        const friend = this.friends.get(friendId);
        if (!friend) {
            return { success: false, message: 'Friend not found' };
        }
        
        friend.favorite = !friend.favorite;
        return { success: true, favorite: friend.favorite };
    }
    
    /**
     * Send message to channel
     */
    sendChannelMessage(channelId, message, type = 'chat') {
        const channel = this.chatChannels.get(channelId);
        if (!channel) {
            return { success: false, message: 'Channel not found' };
        }
        
        // Apply profanity filter
        if (this.settings.profanityFilter) {
            message = this.filterProfanity(message);
        }
        
        const messageObj = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            channelId: channelId,
            userId: this.gameEngine.player?.id || 'player',
            username: this.gameEngine.player?.name || 'Player',
            message: message,
            type: type, // chat, system, announcement, trade
            timestamp: Date.now(),
            edited: false
        };
        
        // Add to channel
        channel.messages.push(messageObj);
        
        // Trim old messages
        if (channel.messages.length > channel.maxMessages) {
            channel.messages.shift();
        }
        
        // Add to chat history
        this.chatHistory.push(messageObj);
        if (this.chatHistory.length > this.maxChatHistory) {
            this.chatHistory.shift();
        }
        
        // Trigger notification
        if (this.settings.chatNotifications) {
            this.triggerChatNotification(messageObj);
        }
        
        return { success: true, message: messageObj };
    }
    
    /**
     * Send private message
     */
    sendPrivateMessage(recipientId, message) {
        // Check if blocked
        if (this.blockedUsers.has(recipientId)) {
            return { success: false, message: 'Cannot message blocked user' };
        }
        
        // Check settings
        if (!this.settings.allowPrivateMessages) {
            return { success: false, message: 'Private messages disabled' };
        }
        
        // Apply profanity filter
        if (this.settings.profanityFilter) {
            message = this.filterProfanity(message);
        }
        
        const conversationId = this.getConversationId(recipientId);
        
        // Create conversation if doesn't exist
        if (!this.privateMessages.has(conversationId)) {
            this.createPrivateConversation(recipientId);
        }
        
        const messageObj = {
            id: `pm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            conversationId: conversationId,
            from: this.gameEngine.player?.id || 'player',
            to: recipientId,
            message: message,
            timestamp: Date.now(),
            read: false,
            edited: false
        };
        
        const conversation = this.privateMessages.get(conversationId);
        conversation.messages.push(messageObj);
        conversation.lastMessage = messageObj;
        conversation.unreadCount++;
        
        // Trigger notification
        if (this.settings.chatNotifications) {
            this.triggerPMNotification(messageObj);
        }
        
        return { success: true, message: messageObj };
    }
    
    /**
     * Get conversation ID for two users
     */
    getConversationId(userId) {
        const playerId = this.gameEngine.player?.id || 'player';
        const ids = [playerId, userId].sort();
        return `conv_${ids[0]}_${ids[1]}`;
    }
    
    /**
     * Create private conversation
     */
    createPrivateConversation(userId) {
        const conversationId = this.getConversationId(userId);
        
        if (!this.privateMessages.has(conversationId)) {
            this.privateMessages.set(conversationId, {
                id: conversationId,
                participants: [this.gameEngine.player?.id || 'player', userId],
                messages: [],
                lastMessage: null,
                unreadCount: 0,
                createdDate: Date.now()
            });
        }
    }
    
    /**
     * Mark conversation as read
     */
    markConversationRead(conversationId) {
        const conversation = this.privateMessages.get(conversationId);
        if (!conversation) return false;
        
        for (const message of conversation.messages) {
            if (message.to === (this.gameEngine.player?.id || 'player')) {
                message.read = true;
            }
        }
        
        conversation.unreadCount = 0;
        return true;
    }
    
    /**
     * Get channel messages
     */
    getChannelMessages(channelId, limit = 50) {
        const channel = this.chatChannels.get(channelId);
        if (!channel) return [];
        
        return channel.messages.slice(-limit);
    }
    
    /**
     * Get private messages
     */
    getPrivateMessages(userId, limit = 50) {
        const conversationId = this.getConversationId(userId);
        const conversation = this.privateMessages.get(conversationId);
        
        if (!conversation) return [];
        
        return conversation.messages.slice(-limit);
    }
    
    /**
     * Get unread message count
     */
    getUnreadCount() {
        let count = 0;
        
        for (const conversation of this.privateMessages.values()) {
            count += conversation.unreadCount;
        }
        
        return count;
    }
    
    /**
     * Get friends list
     */
    getFriends(filter = 'all') {
        const friendsList = Array.from(this.friends.values());
        
        switch (filter) {
            case 'online':
                return friendsList.filter(f => f.onlineStatus === 'online');
            case 'offline':
                return friendsList.filter(f => f.onlineStatus === 'offline');
            case 'favorite':
                return friendsList.filter(f => f.favorite);
            default:
                return friendsList;
        }
    }
    
    /**
     * Get pending friend requests
     */
    getPendingRequests() {
        return Array.from(this.friendRequests.values())
            .filter(r => r.status === 'pending' && r.to === (this.gameEngine.player?.id || 'player'));
    }
    
    /**
     * Set online status
     */
    setOnlineStatus(status, customMessage = '') {
        const validStatuses = ['online', 'away', 'busy', 'invisible'];
        if (!validStatuses.includes(status)) {
            return { success: false, message: 'Invalid status' };
        }
        
        this.onlineStatus = status;
        this.customStatus = customMessage;
        
        // Broadcast status change to friends
        this.broadcastStatusChange();
        
        return { success: true };
    }
    
    /**
     * Broadcast status change
     */
    broadcastStatusChange() {
        // Would send to server in multiplayer
        logger.info(`Status changed to ${this.onlineStatus}`);
    }
    
    /**
     * Update chat settings
     */
    updateSettings(settings) {
        this.settings = { ...this.settings, ...settings };
        this.saveSettings();
        return { success: true };
    }
    
    /**
     * Filter profanity
     */
    filterProfanity(message) {
        // Simple profanity filter
        const badWords = ['badword1', 'badword2']; // Placeholder
        let filtered = message;
        
        for (const word of badWords) {
            const regex = new RegExp(word, 'gi');
            filtered = filtered.replace(regex, '*'.repeat(word.length));
        }
        
        return filtered;
    }
    
    /**
     * Trigger chat notification
     */
    triggerChatNotification(message) {
        if (!this.settings.soundEnabled) return;
        
        // Play sound
        if (this.gameEngine.audioSystem) {
            this.gameEngine.audioSystem.playSound('chat_message');
        }
        
        // Show notification
        logger.info(`[${message.channelId}] ${message.username}: ${message.message}`);
    }
    
    /**
     * Trigger private message notification
     */
    triggerPMNotification(message) {
        if (!this.settings.soundEnabled) return;
        
        // Play sound
        if (this.gameEngine.audioSystem) {
            this.gameEngine.audioSystem.playSound('pm_received');
        }
        
        // Show notification
        logger.info(`[PM] New message from ${message.from}`);
    }
    
    /**
     * Create custom channel (for guilds/parties)
     */
    createCustomChannel(channelId, name, type, members = []) {
        if (this.chatChannels.has(channelId)) {
            return { success: false, message: 'Channel already exists' };
        }
        
        this.chatChannels.set(channelId, {
            id: channelId,
            name: name,
            type: type,
            messages: [],
            members: new Set(members),
            maxMessages: 100,
            createdDate: Date.now()
        });
        
        return { success: true };
    }
    
    /**
     * Delete custom channel
     */
    deleteCustomChannel(channelId) {
        const channel = this.chatChannels.get(channelId);
        if (!channel || ['global', 'trade'].includes(channelId)) {
            return { success: false, message: 'Cannot delete system channel' };
        }
        
        this.chatChannels.delete(channelId);
        return { success: true };
    }
    
    /**
     * Join channel
     */
    joinChannel(channelId) {
        const channel = this.chatChannels.get(channelId);
        if (!channel) {
            return { success: false, message: 'Channel not found' };
        }
        
        const playerId = this.gameEngine.player?.id || 'player';
        channel.members.add(playerId);
        
        // Send system message
        this.sendChannelMessage(channelId, `${this.gameEngine.player?.name || 'Player'} joined the channel`, 'system');
        
        return { success: true };
    }
    
    /**
     * Leave channel
     */
    leaveChannel(channelId) {
        const channel = this.chatChannels.get(channelId);
        if (!channel) {
            return { success: false, message: 'Channel not found' };
        }
        
        const playerId = this.gameEngine.player?.id || 'player';
        channel.members.delete(playerId);
        
        // Send system message
        this.sendChannelMessage(channelId, `${this.gameEngine.player?.name || 'Player'} left the channel`, 'system');
        
        return { success: true };
    }
    
    /**
     * Get social stats
     */
    getStats() {
        return {
            friendsCount: this.friends.size,
            onlineFriendsCount: this.getFriends('online').length,
            pendingRequestsCount: this.getPendingRequests().length,
            blockedUsersCount: this.blockedUsers.size,
            unreadMessagesCount: this.getUnreadCount(),
            channelsCount: this.chatChannels.size,
            onlineStatus: this.onlineStatus
        };
    }
    
    /**
     * Save data
     */
    save() {
        const data = {
            friends: Array.from(this.friends.entries()),
            friendRequests: Array.from(this.friendRequests.entries()),
            blockedUsers: Array.from(this.blockedUsers),
            onlineStatus: this.onlineStatus,
            customStatus: this.customStatus,
            settings: this.settings
        };
        
        localStorage.setItem('social_data', JSON.stringify(data));
    }
    
    /**
     * Load data
     */
    load() {
        const saved = localStorage.getItem('social_data');
        if (!saved) return;
        
        try {
            const data = JSON.parse(saved);
            this.friends = new Map(data.friends || []);
            this.friendRequests = new Map(data.friendRequests || []);
            this.blockedUsers = new Set(data.blockedUsers || []);
            this.onlineStatus = data.onlineStatus || 'online';
            this.customStatus = data.customStatus || '';
            this.settings = data.settings || this.settings;
        } catch (error) {
            logger.error('Failed to load social data:', error);
        }
    }
    
    /**
     * Save settings
     */
    saveSettings() {
        localStorage.setItem('chat_settings', JSON.stringify(this.settings));
    }
}
