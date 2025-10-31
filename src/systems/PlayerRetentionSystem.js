/**
 * Player Retention System
 * Keeps players engaged and coming back with daily rewards, weekly events, and comeback bonuses
 * All rewards use external assets (Kenney UI, game-icons.net)
 */

export class PlayerRetentionSystem {
  constructor() {
    this.dailyRewards = this.setupDailyRewards();
    this.weeklyQuests = this.setupWeeklyQuests();
    this.monthlyEvents = this.setupMonthlyEvents();
    this.comebackRewards = this.setupComebackRewards();
    this.loyaltySystem = this.setupLoyaltySystem();
    
    this.playerData = {
      lastLogin: null,
      loginStreak: 0,
      totalLogins: 0,
      weeklyQuestsCompleted: 0,
      loyaltyPoints: 0
    };
  }

  setupDailyRewards() {
    return {
      day1: { gold: 100, icon: '/assets/icons/gold.png' }, // game-icons.net
      day2: { gold: 150, icon: '/assets/icons/gold.png' },
      day3: { gold: 200, mount: 'Basic Horse', icon: '/assets/icons/horse.png' },
      day4: { gold: 250, icon: '/assets/icons/gold.png' },
      day5: { gold: 300, weapon: 'Steel Sword', icon: '/assets/icons/sword.png' },
      day6: { gold: 350, icon: '/assets/icons/gold.png' },
      day7: { gold: 500, legendary: 'Mystery Box', icon: '/assets/icons/treasure.png' },
      // Weeks 2-4 with escalating rewards
      day14: { gold: 1000, mount: 'War Horse', icon: '/assets/icons/horse.png' },
      day21: { gold: 2000, legendary: 'Epic Weapon Box', icon: '/assets/icons/epic.png' },
      day30: { gold: 5000, legendary: 'Legendary Mount', icon: '/assets/icons/legendary.png' }
    };
  }

  setupWeeklyQuests() {
    return [
      { id: 1, name: 'Dungeon Master', requirement: 'Complete 5 dungeons', reward: { gold: 1000, exp: 5000 }, icon: '/assets/icons/dungeon.png' },
      { id: 2, name: 'PvP Warrior', requirement: 'Win 10 PvP matches', reward: { gold: 1500, pvpTokens: 100 }, icon: '/assets/icons/pvp.png' },
      { id: 3, name: 'Guild Hero', requirement: 'Contribute 1000 guild points', reward: { gold: 800, guildTokens: 50 }, icon: '/assets/icons/guild.png' },
      { id: 4, name: 'World Explorer', requirement: 'Discover 3 new areas', reward: { gold: 1200, mount: 'Explorer Mount' }, icon: '/assets/icons/explore.png' },
      { id: 5, name: 'Social Butterfly', requirement: 'Make 5 new friends', reward: { gold: 500, socialTokens: 20 }, icon: '/assets/icons/friends.png' }
    ];
  }

  setupMonthlyEvents() {
    return {
      january: { name: 'Winter Festival', rewards: ['Snow Mount', 'Ice Weapon'], icon: '/assets/icons/winter.png' },
      february: { name: 'Love Festival', rewards: ['Heart Mount', 'Cupid Bow'], icon: '/assets/icons/heart.png' },
      march: { name: 'Spring Bloom', rewards: ['Flower Mount', 'Nature Staff'], icon: '/assets/icons/spring.png' },
      april: { name: 'Treasure Hunt', rewards: ['Gold Mount', 'Lucky Sword'], icon: '/assets/icons/treasure.png' },
      may: { name: 'Warriors Tournament', rewards: ['Champion Mount', 'Victory Axe'], icon: '/assets/icons/tournament.png' },
      june: { name: 'Summer Solstice', rewards: ['Sun Mount', 'Solar Blade'], icon: '/assets/icons/sun.png' },
      july: { name: 'Independence Celebration', rewards: ['Freedom Mount', 'Liberty Weapon'], icon: '/assets/icons/celebration.png' },
      august: { name: 'Harvest Festival', rewards: ['Harvest Mount', 'Reaper Scythe'], icon: '/assets/icons/harvest.png' },
      september: { name: 'Autumn Equinox', rewards: ['Leaf Mount', 'Forest Bow'], icon: '/assets/icons/autumn.png' },
      october: { name: 'Halloween Horror', rewards: ['Ghost Mount', 'Cursed Blade'], icon: '/assets/icons/halloween.png' },
      november: { name: 'Thanks giving Feast', rewards: ['Turkey Mount', 'Feast Hammer'], icon: '/assets/icons/feast.png' },
      december: { name: 'Winter Solstice', rewards: ['Reindeer Mount', 'Gift Sword'], icon: '/assets/icons/winter.png' }
    };
  }

  setupComebackRewards() {
    return {
      week1: { gold: 500, item: 'Welcome Back Box', icon: '/assets/icons/welcome.png' },
      week2: { gold: 1000, item: 'Returning Hero Box', icon: '/assets/icons/hero.png' },
      month1: { gold: 2000, mount: 'Comeback Mount', icon: '/assets/icons/comeback.png' },
      month3: { gold: 5000, legendary: 'Veteran Reward Box', icon: '/assets/icons/veteran.png' }
    };
  }

  setupLoyaltySystem() {
    return {
      tiers: [
        { level: 1, pointsRequired: 0, benefits: 'Basic rewards' },
        { level: 2, pointsRequired: 1000, benefits: '5% gold bonus' },
        { level: 3, pointsRequired: 5000, benefits: '10% gold bonus, exclusive mount' },
        { level: 4, pointsRequired: 10000, benefits: '15% gold bonus, exclusive title' },
        { level: 5, pointsRequired: 25000, benefits: '20% gold bonus, legendary weapon' }
      ],
      pointsPerDay: 10,
      pointsPerWeeklyQuest: 50,
      pointsPerMonthlyEvent: 200
    };
  }

  onLogin(player) {
    const now = Date.now();
    const lastLogin = this.playerData.lastLogin;
    
    // Check if new day
    if (!lastLogin || this.isNewDay(lastLogin, now)) {
      this.grantDailyReward(player);
      this.updateLoginStreak(player, lastLogin, now);
    }
    
    // Check comeback rewards
    if (lastLogin && this.getDaysSinceLastLogin(lastLogin, now) >= 7) {
      this.grantComebackReward(player, lastLogin, now);
    }
    
    // Update loyalty points
    this.playerData.loyaltyPoints += this.loyaltySystem.pointsPerDay;
    this.playerData.lastLogin = now;
    this.playerData.totalLogins++;
  }

  grantDailyReward(player) {
    const day = this.playerData.loginStreak + 1;
    const reward = this.dailyRewards[`day${day}`] || this.dailyRewards.day1;
    
    // Grant rewards (all external assets)
    player.addGold(reward.gold);
    if (reward.mount) player.addMount(reward.mount);
    if (reward.weapon) player.addWeapon(reward.weapon);
    if (reward.legendary) player.addItem(reward.legendary);
    
    // Show UI notification (Kenney UI Pack)
    this.showRewardNotification(reward);
  }

  updateLoginStreak(player, lastLogin, now) {
    if (!lastLogin || this.getDaysSinceLastLogin(lastLogin, now) > 1) {
      // Streak broken, reset
      this.playerData.loginStreak = 1;
    } else {
      // Continue streak
      this.playerData.loginStreak++;
      
      // Milestone rewards every 7 days
      if (this.playerData.loginStreak % 7 === 0) {
        this.grantStreakMilestoneReward(player, this.playerData.loginStreak);
      }
    }
  }

  grantComebackReward(player, lastLogin, now) {
    const daysAway = this.getDaysSinceLastLogin(lastLogin, now);
    
    let reward;
    if (daysAway >= 90) reward = this.comebackRewards.month3;
    else if (daysAway >= 30) reward = this.comebackRewards.month1;
    else if (daysAway >= 14) reward = this.comebackRewards.week2;
    else reward = this.comebackRewards.week1;
    
    player.addGold(reward.gold);
    if (reward.item) player.addItem(reward.item);
    if (reward.mount) player.addMount(reward.mount);
    if (reward.legendary) player.addItem(reward.legendary);
    
    this.showComebackNotification(reward, daysAway);
  }

  grantStreakMilestoneReward(player, streak) {
    const milestoneReward = {
      gold: streak * 100,
      title: `${streak}-Day Veteran`,
      icon: '/assets/icons/milestone.png' // game-icons.net
    };
    
    player.addGold(milestoneReward.gold);
    player.addTitle(milestoneReward.title);
    this.showMilestoneNotification(milestoneReward, streak);
  }

  completeWeeklyQuest(player, questId) {
    const quest = this.weeklyQuests.find(q => q.id === questId);
    if (!quest) return;
    
    // Grant rewards
    player.addGold(quest.reward.gold);
    if (quest.reward.exp) player.addExp(quest.reward.exp);
    if (quest.reward.pvpTokens) player.addCurrency('pvpTokens', quest.reward.pvpTokens);
    if (quest.reward.guildTokens) player.addCurrency('guildTokens', quest.reward.guildTokens);
    if (quest.reward.socialTokens) player.addCurrency('socialTokens', quest.reward.socialTokens);
    if (quest.reward.mount) player.addMount(quest.reward.mount);
    
    // Update loyalty points
    this.playerData.loyaltyPoints += this.loyaltySystem.pointsPerWeeklyQuest;
    this.playerData.weeklyQuestsCompleted++;
    
    this.showQuestCompleteNotification(quest);
  }

  participateInMonthlyEvent(player, month) {
    const event = this.monthlyEvents[month];
    if (!event) return;
    
    // Grant event rewards
    event.rewards.forEach(reward => {
      if (reward.includes('Mount')) player.addMount(reward);
      else player.addWeapon(reward);
    });
    
    // Update loyalty points
    this.playerData.loyaltyPoints += this.loyaltySystem.pointsPerMonthlyEvent;
    
    this.showEventNotification(event);
  }

  getLoyaltyTier() {
    const points = this.playerData.loyaltyPoints;
    let tier = this.loyaltySystem.tiers[0];
    
    for (const t of this.loyaltySystem.tiers) {
      if (points >= t.pointsRequired) tier = t;
      else break;
    }
    
    return tier;
  }

  // Helper methods
  isNewDay(lastLogin, now) {
    const lastDate = new Date(lastLogin);
    const nowDate = new Date(now);
    return lastDate.getDate() !== nowDate.getDate();
  }

  getDaysSinceLastLogin(lastLogin, now) {
    return Math.floor((now - lastLogin) / (1000 * 60 * 60 * 24));
  }

  showRewardNotification(reward) {
    // UI notification using Kenney UI Pack
    logger.info('Daily Reward:', reward);
  }

  showComebackNotification(reward, daysAway) {
    logger.info(`Welcome back! You were away for ${daysAway} days. Here's your reward:`, reward);
  }

  showMilestoneNotification(reward, streak) {
    logger.info(`${streak}-Day Login Streak!`, reward);
  }

  showQuestCompleteNotification(quest) {
    logger.info('Weekly Quest Complete:', quest.name);
  }

  showEventNotification(event) {
    logger.info('Monthly Event:', event.name);
  }
}
