/**
 * EmoteSystem.js
 * Character emotes and expressions.
 * All animations from Mixamo, icons from game-icons.net.
 */

export class EmoteSystem {
  constructor() {
    this.emotes = {
      wave: { animation: '/assets/animations/emote_wave.fbx', icon: '/assets/icons/emotes/wave.png' },           // Mixamo + game-icons.net
      dance: { animation: '/assets/animations/emote_dance.fbx', icon: '/assets/icons/emotes/dance.png' },        // Mixamo + game-icons.net
      laugh: { animation: '/assets/animations/emote_laugh.fbx', icon: '/assets/icons/emotes/laugh.png' },        // Mixamo + game-icons.net
      sit: { animation: '/assets/animations/emote_sit.fbx', icon: '/assets/icons/emotes/sit.png' },              // Mixamo + game-icons.net
      cry: { animation: '/assets/animations/emote_cry.fbx', icon: '/assets/icons/emotes/cry.png' }               // Mixamo + game-icons.net
    };
  }

  playEmote(playerId, emoteName) {
    const emote = this.emotes[emoteName];
    console.log(`${playerId} emote: ${emoteName}`);
    console.log(`  Animation: ${emote.animation}`);
    console.log(`  Icon: ${emote.icon}`);
  }
}
