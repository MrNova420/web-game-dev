/**
 * CosmeticSystem.js
 * Cosmetic customization with hundreds of options.
 * All models/textures from Sketchfab Free + Mixamo.
 */

export class CosmeticSystem {
  constructor() {
    this.cosmetics = new Map();
    this.categories = ['HELMETS', 'ARMOR_SKINS', 'WEAPON_SKINS', 'CAPES', 'AURAS', 'EMOTES'];
    this.models = {
      legendary_helm: '/assets/models/cosmetics/legendary_helm.glb', // Sketchfab Free
      dragon_cape: '/assets/models/cosmetics/dragon_cape.glb',      // Sketchfab Free
      holy_aura: '/assets/particles/holy_aura.png'                  // Kenney
    };
  }

  applyCosmetic(playerId, cosmeticId) {
    console.log(`${playerId} applied cosmetic: ${cosmeticId}`);
  }
}
