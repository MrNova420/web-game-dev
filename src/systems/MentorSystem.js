import { logger } from '../core/Logger.js';
/**
 * MentorSystem.js - Phase 5
 */
export class MentorSystem {
  constructor() { this.mentors = new Map(); this.icons = { mentor: '/assets/icons/social/mentor.png' }; }  // game-icons.net
  assignMentor(studentId, mentorId) { logger.info(`${mentorId} mentors ${studentId}`); }
}
