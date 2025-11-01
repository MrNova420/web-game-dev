import { logger } from '../core/Logger.js';
/**
 * FriendSystem.js
 * Friend list, online status, and social features.
 * All UI from Kenney + game-icons.net.
 */

export class FriendSystem {
  constructor() {
    this.friendLists = new Map();
    this.maxFriends = 200;
    this.ui = {
      friend_list: '/assets/ui/social/friend_list.png',             // Kenney UI Pack
      add_friend: '/assets/ui/social/add_friend.png'                // Kenney UI Pack
    };
    this.icons = {
      online: '/assets/icons/social/online.png',                    // game-icons.net
      offline: '/assets/icons/social/offline.png',                  // game-icons.net
      busy: '/assets/icons/social/busy.png'                         // game-icons.net
    };
  }

  addFriend(playerId, friendId) {
    logger.info(`${playerId} added friend: ${friendId}`);
    logger.info(`  Icon: ${this.icons.online}`);
  }
}
