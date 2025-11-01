import { logger } from '../core/Logger.js';
/**
 * MailSystem.js
 * In-game mail with item/gold attachments.
 * All UI from Kenney + game-icons.net.
 */

export class MailSystem {
  constructor() {
    this.mailboxes = new Map();
    this.ui = {
      mailbox: '/assets/ui/mail/mailbox.png',                       // Kenney UI Pack
      new_mail: '/assets/ui/mail/new_mail_icon.png'                 // Kenney UI Pack
    };
  }

  sendMail(senderId, recipientId, subject, body, attachments = []) {
    logger.info(`${senderId} sent mail to ${recipientId}: ${subject}`);
    logger.info(`  UI: ${this.ui.mailbox}`);
  }
}
