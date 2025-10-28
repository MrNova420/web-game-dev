// MatchmakingAndEventsSystem.js - Phase 6 Social Features Completion
// Implements dungeon finder, raid formation, and community events

export class MatchmakingAndEventsSystem {
    constructor() {
        this.queue = new Map(); // roleType -> array of players
        this.groups = new Map(); // groupId -> group data
        this.events = new Map(); // eventId -> event data
        this.communityGoals = new Map(); // goalId -> goal data
        this.eventCalendar = [];
        this.nextGroupId = 1;
        this.nextEventId = 1;
        
        this.initializeRoles();
        this.initializeEvents();
        this.initializeCommunityGoals();
    }
    
    initializeRoles() {
        this.roles = {
            tank: { name: 'Tank', maxPerGroup: 2, icon: '🛡️' },
            healer: { name: 'Healer', maxPerGroup: 2, icon: '❤️' },
            dps: { name: 'DPS', maxPerGroup: 6, icon: '⚔️' }
        };
        
        this.queue.set('tank', []);
        this.queue.set('healer', []);
        this.queue.set('dps', []);
    }
    
    initializeEvents() {
        this.eventTypes = [
            { id: 'invasion', name: 'Monster Invasion', duration: 3600000, reward: 10000 },
            { id: 'festival', name: 'Harvest Festival', duration: 7200000, reward: 5000 },
            { id: 'tournament', name: 'Grand Tournament', duration: 5400000, reward: 20000 },
            { id: 'raid_boss', name: 'World Boss Raid', duration: 1800000, reward: 15000 },
            { id: 'treasure_hunt', name: 'Treasure Hunt', duration: 3600000, reward: 8000 },
            { id: 'defense', name: 'City Defense', duration: 2700000, reward: 12000 }
        ];
        
        // Schedule initial events
        this.scheduleWeeklyEvents();
    }
    
    initializeCommunityGoals() {
        this.goalTemplates = [
            { id: 'kill_monsters', name: 'Slay 100,000 Monsters', target: 100000, reward: { gold: 50000, title: 'Monster Slayer' } },
            { id: 'complete_quests', name: 'Complete 10,000 Quests', target: 10000, reward: { exp: 100000, mount: 'Community Mount' } },
            { id: 'craft_items', name: 'Craft 50,000 Items', target: 50000, reward: { gold: 30000, recipe: 'Legendary Recipe' } },
            { id: 'gather_resources', name: 'Gather 200,000 Resources', target: 200000, reward: { gold: 40000, buff: 'Community Blessing' } },
            { id: 'donate_gold', name: 'Donate 10,000,000 Gold', target: 10000000, reward: { title: 'Generous Benefactor', statue: true } }
        ];
        
        // Create initial community goals
        this.createCommunityGoal('kill_monsters');
        this.createCommunityGoal('complete_quests');
    }
    
    // ===== MATCHMAKING SYSTEM =====
    
    queueForDungeon(playerId, playerName, role, dungeonType, playerLevel) {
        if (!this.roles[role]) {
            return { success: false, error: 'Invalid role' };
        }
        
        const queueEntry = {
            playerId,
            playerName,
            role,
            dungeonType,
            playerLevel,
            queueTime: Date.now(),
            status: 'queued'
        };
        
        const roleQueue = this.queue.get(role);
        roleQueue.push(queueEntry);
        
        // Try to form a group
        this.tryFormGroup(dungeonType);
        
        return {
            success: true,
            position: roleQueue.length,
            estimatedWait: this.estimateWaitTime(role, dungeonType)
        };
    }
    
    tryFormGroup(dungeonType) {
        const requiredComposition = {
            tank: 1,
            healer: 1,
            dps: 3
        };
        
        // Check if we have enough players of each role
        let availablePlayers = {
            tank: this.queue.get('tank').filter(p => p.dungeonType === dungeonType && p.status === 'queued'),
            healer: this.queue.get('healer').filter(p => p.dungeonType === dungeonType && p.status === 'queued'),
            dps: this.queue.get('dps').filter(p => p.dungeonType === dungeonType && p.status === 'queued')
        };
        
        if (availablePlayers.tank.length >= requiredComposition.tank &&
            availablePlayers.healer.length >= requiredComposition.healer &&
            availablePlayers.dps.length >= requiredComposition.dps) {
            
            // Form the group
            const groupMembers = [
                ...availablePlayers.tank.slice(0, requiredComposition.tank),
                ...availablePlayers.healer.slice(0, requiredComposition.healer),
                ...availablePlayers.dps.slice(0, requiredComposition.dps)
            ];
            
            const groupId = this.nextGroupId++;
            const group = {
                groupId,
                dungeonType,
                members: groupMembers,
                leader: groupMembers[0].playerId,
                status: 'ready',
                createdAt: Date.now(),
                instance: null
            };
            
            this.groups.set(groupId, group);
            
            // Mark players as grouped and remove from queue
            groupMembers.forEach(member => {
                member.status = 'grouped';
                member.groupId = groupId;
                
                const roleQueue = this.queue.get(member.role);
                const index = roleQueue.indexOf(member);
                if (index > -1) {
                    roleQueue.splice(index, 1);
                }
            });
            
            return group;
        }
        
        return null;
    }
    
    leaveQueue(playerId) {
        for (const [role, roleQueue] of this.queue.entries()) {
            const index = roleQueue.findIndex(p => p.playerId === playerId);
            if (index > -1) {
                roleQueue.splice(index, 1);
                return { success: true };
            }
        }
        return { success: false, error: 'Not in queue' };
    }
    
    estimateWaitTime(role, dungeonType) {
        // Simple estimation based on role demand
        const queueLengths = {
            tank: this.queue.get('tank').length,
            healer: this.queue.get('healer').length,
            dps: this.queue.get('dps').length
        };
        
        const bottleneck = Math.max(
            Math.ceil(queueLengths.tank / 1),
            Math.ceil(queueLengths.healer / 1),
            Math.ceil(queueLengths.dps / 3)
        );
        
        // Average 2 minutes per group formation
        return bottleneck * 120000; // milliseconds
    }
    
    getQueueStatus(playerId) {
        for (const [role, roleQueue] of this.queue.entries()) {
            const entry = roleQueue.find(p => p.playerId === playerId);
            if (entry) {
                return {
                    inQueue: true,
                    role,
                    position: roleQueue.indexOf(entry) + 1,
                    waitTime: Date.now() - entry.queueTime,
                    estimatedRemaining: this.estimateWaitTime(role, entry.dungeonType)
                };
            }
        }
        return { inQueue: false };
    }
    
    // ===== RAID FORMATION SYSTEM =====
    
    createRaidGroup(leaderId, leaderName, raidType) {
        const groupId = this.nextGroupId++;
        const group = {
            groupId,
            type: 'raid',
            raidType,
            leader: leaderId,
            members: [{
                playerId: leaderId,
                playerName: leaderName,
                role: 'tank',
                ready: false
            }],
            maxMembers: 10,
            status: 'forming',
            composition: { tank: 0, healer: 0, dps: 0 },
            createdAt: Date.now()
        };
        
        this.groups.set(groupId, group);
        return group;
    }
    
    joinRaidGroup(groupId, playerId, playerName, role) {
        const group = this.groups.get(groupId);
        if (!group || group.type !== 'raid') {
            return { success: false, error: 'Invalid raid group' };
        }
        
        if (group.members.length >= group.maxMembers) {
            return { success: false, error: 'Group is full' };
        }
        
        // Check role limits
        const roleCount = group.members.filter(m => m.role === role).length;
        if (roleCount >= this.roles[role].maxPerGroup) {
            return { success: false, error: 'Too many players with this role' };
        }
        
        group.members.push({
            playerId,
            playerName,
            role,
            ready: false
        });
        
        group.composition[role]++;
        
        return { success: true, group };
    }
    
    setPlayerReady(groupId, playerId, ready) {
        const group = this.groups.get(groupId);
        if (!group) return { success: false };
        
        const member = group.members.find(m => m.playerId === playerId);
        if (member) {
            member.ready = ready;
            
            // Check if all members are ready
            const allReady = group.members.every(m => m.ready);
            if (allReady && group.members.length >= 5) {
                group.status = 'ready';
            }
            
            return { success: true, allReady, group };
        }
        
        return { success: false };
    }
    
    // ===== COMMUNITY EVENTS SYSTEM =====
    
    scheduleWeeklyEvents() {
        const now = Date.now();
        const dayInMs = 86400000;
        
        // Schedule events for the next 7 days
        for (let day = 0; day < 7; day++) {
            const eventTime = now + (day * dayInMs) + (Math.random() * dayInMs);
            const eventType = this.eventTypes[Math.floor(Math.random() * this.eventTypes.length)];
            
            const event = {
                id: this.nextEventId++,
                type: eventType.id,
                name: eventType.name,
                startTime: eventTime,
                endTime: eventTime + eventType.duration,
                status: 'scheduled',
                participants: [],
                progress: 0,
                reward: eventType.reward,
                description: this.getEventDescription(eventType.id)
            };
            
            this.events.set(event.id, event);
            this.eventCalendar.push(event);
        }
        
        // Sort calendar by start time
        this.eventCalendar.sort((a, b) => a.startTime - b.startTime);
    }
    
    getEventDescription(eventType) {
        const descriptions = {
            invasion: 'Monsters are attacking the city! Defend against waves of enemies.',
            festival: 'Join the harvest festival with special quests and mini-games.',
            tournament: 'Compete in the grand tournament for glory and prizes.',
            raid_boss: 'A world boss has appeared! Team up to defeat it.',
            treasure_hunt: 'Search the world for hidden treasures and rare items.',
            defense: 'Protect the city walls from an incoming siege.'
        };
        return descriptions[eventType] || 'A special event is happening!';
    }
    
    joinEvent(eventId, playerId, playerName) {
        const event = this.events.get(eventId);
        if (!event) {
            return { success: false, error: 'Event not found' };
        }
        
        if (event.status === 'completed') {
            return { success: false, error: 'Event already completed' };
        }
        
        if (!event.participants.find(p => p.playerId === playerId)) {
            event.participants.push({ playerId, playerName, contribution: 0 });
        }
        
        return { success: true, event };
    }
    
    contributeToEvent(eventId, playerId, amount) {
        const event = this.events.get(eventId);
        if (!event || event.status !== 'active') {
            return { success: false };
        }
        
        const participant = event.participants.find(p => p.playerId === playerId);
        if (participant) {
            participant.contribution += amount;
            event.progress += amount;
            
            return { success: true, progress: event.progress };
        }
        
        return { success: false };
    }
    
    // ===== COMMUNITY GOALS SYSTEM =====
    
    createCommunityGoal(templateId) {
        const template = this.goalTemplates.find(t => t.id === templateId);
        if (!template) return null;
        
        const goal = {
            id: `goal_${Date.now()}`,
            ...template,
            progress: 0,
            contributors: new Map(),
            startTime: Date.now(),
            endTime: Date.now() + 604800000, // 7 days
            status: 'active',
            rewardsClaimed: false
        };
        
        this.communityGoals.set(goal.id, goal);
        return goal;
    }
    
    contributeToGoal(goalId, playerId, playerName, amount) {
        const goal = this.communityGoals.get(goalId);
        if (!goal || goal.status !== 'active') {
            return { success: false };
        }
        
        goal.progress += amount;
        
        const currentContribution = goal.contributors.get(playerId) || { playerName, amount: 0 };
        currentContribution.amount += amount;
        goal.contributors.set(playerId, currentContribution);
        
        // Check if goal is completed
        if (goal.progress >= goal.target) {
            goal.status = 'completed';
            goal.completedAt = Date.now();
        }
        
        return {
            success: true,
            progress: goal.progress,
            target: goal.target,
            percentage: (goal.progress / goal.target) * 100,
            completed: goal.status === 'completed'
        };
    }
    
    getActiveGoals() {
        const activeGoals = [];
        for (const goal of this.communityGoals.values()) {
            if (goal.status === 'active') {
                activeGoals.push({
                    id: goal.id,
                    name: goal.name,
                    progress: goal.progress,
                    target: goal.target,
                    percentage: (goal.progress / goal.target) * 100,
                    reward: goal.reward,
                    timeRemaining: goal.endTime - Date.now()
                });
            }
        }
        return activeGoals;
    }
    
    claimGoalReward(goalId, playerId) {
        const goal = this.communityGoals.get(goalId);
        if (!goal || goal.status !== 'completed') {
            return { success: false, error: 'Goal not completed' };
        }
        
        const contributor = goal.contributors.get(playerId);
        if (!contributor) {
            return { success: false, error: 'Did not contribute to this goal' };
        }
        
        return {
            success: true,
            reward: goal.reward,
            contribution: contributor.amount
        };
    }
    
    // ===== EVENT CALENDAR =====
    
    getEventCalendar(days = 7) {
        const now = Date.now();
        const futureTime = now + (days * 86400000);
        
        return this.eventCalendar
            .filter(event => event.startTime >= now && event.startTime <= futureTime)
            .map(event => ({
                id: event.id,
                name: event.name,
                type: event.type,
                startTime: event.startTime,
                duration: event.endTime - event.startTime,
                status: event.status,
                description: event.description
            }));
    }
    
    voteForNextEvent(playerId, eventType) {
        if (!this.eventVotes) {
            this.eventVotes = new Map();
        }
        
        if (!this.eventVotes.has(playerId)) {
            this.eventVotes.set(playerId, eventType);
            return { success: true, votes: this.getVoteTally() };
        }
        
        return { success: false, error: 'Already voted' };
    }
    
    getVoteTally() {
        const tally = {};
        for (const eventType of this.eventVotes.values()) {
            tally[eventType] = (tally[eventType] || 0) + 1;
        }
        return tally;
    }
    
    // ===== UPDATE LOOP =====
    
    update(deltaTime) {
        const now = Date.now();
        
        // Update events
        for (const event of this.events.values()) {
            if (event.status === 'scheduled' && now >= event.startTime) {
                event.status = 'active';
            } else if (event.status === 'active' && now >= event.endTime) {
                event.status = 'completed';
            }
        }
        
        // Update community goals
        for (const goal of this.communityGoals.values()) {
            if (goal.status === 'active' && now >= goal.endTime) {
                goal.status = 'expired';
            }
        }
    }
}
