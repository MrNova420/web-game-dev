/**
 * MascotBrandingSystem - Game mascots, branding icons, and visual identity
 * Creates graphical, mature fantasy mascots and branding elements
 */

export class MascotBrandingSystem {
    constructor() {
        this.mascots = this.initializeMascots();
        this.brandColors = this.initializeBrandColors();
        this.iconLibrary = this.initializeIconLibrary();
        this.currentMascot = 'emberveil_guardian';
        
        logger.info('🎭 Mascot & Branding System initialized');
    }
    
    initializeMascots() {
        // Graphical, mature fantasy mascots - NOT basic or girly
        return {
            emberveil_guardian: {
                name: 'Emberveil Guardian',
                description: 'Dark armored sentinel with glowing purple energy',
                personality: 'Stoic, powerful, mysterious',
                visualStyle: 'Sharp angular armor, ethereal purple flames',
                primaryColor: '#8b00ff',
                secondaryColor: '#ff69b4',
                accentColor: '#d4af37',
                svg: this.createGuardianMascotSVG(),
                uses: ['logo', 'loading_screen', 'achievements', 'power_ups']
            },
            
            shadow_assassin: {
                name: 'Shadow Assassin',
                description: 'Sleek rogue with dual blades and dark energy',
                personality: 'Swift, deadly, tactical',
                visualStyle: 'Flowing shadows, crimson accents, twin daggers',
                primaryColor: '#1a0033',
                secondaryColor: '#dc143c',
                accentColor: '#00ced1',
                svg: this.createAssassinMascotSVG(),
                uses: ['stealth_mode', 'pvp', 'rogue_class', 'combat_ui']
            },
            
            arcane_sorcerer: {
                name: 'Arcane Sorcerer',
                description: 'Mystical mage wielding cosmic magic',
                personality: 'Wise, powerful, ancient',
                visualStyle: 'Flowing robes, floating runes, magical staff',
                primaryColor: '#4169e1',
                secondaryColor: '#9d4edd',
                accentColor: '#ffd700',
                svg: this.createSorcererMascotSVG(),
                uses: ['magic_system', 'spell_icons', 'skill_tree', 'mana_ui']
            },
            
            battle_berserker: {
                name: 'Battle Berserker',
                description: 'Fierce warrior with massive weapon and battle scars',
                personality: 'Aggressive, unstoppable, dominant',
                visualStyle: 'Heavy armor, glowing red eyes, intimidating presence',
                primaryColor: '#8b0000',
                secondaryColor: '#ff4500',
                accentColor: '#696969',
                svg: this.createBerserkerMascotSVG(),
                uses: ['warrior_class', 'rage_mode', 'boss_battles', 'strength_ui']
            },
            
            frost_reaper: {
                name: 'Frost Reaper',
                description: 'Ice-wielding death knight with frozen aura',
                personality: 'Cold, merciless, calculating',
                visualStyle: 'Icy armor, frozen blade, frost particles',
                primaryColor: '#00ffff',
                secondaryColor: '#4682b4',
                accentColor: '#e0ffff',
                svg: this.createReaperMascotSVG(),
                uses: ['ice_abilities', 'death_knight', 'frozen_biome', 'frost_effects']
            }
        };
    }
    
    initializeBrandColors() {
        return {
            primary: {
                dark: '#0a0e27',
                medium: '#1a2847',
                light: '#2d4a7c',
                vibrant: '#8b00ff'
            },
            accent: {
                gold: '#d4af37',
                crimson: '#dc143c',
                emerald: '#50c878',
                arcane: '#9d4edd',
                frost: '#00ced1'
            },
            gradient: {
                power: 'linear-gradient(135deg, #8b00ff, #ff69b4, #d4af37)',
                combat: 'linear-gradient(135deg, #dc143c, #ff4500, #8b0000)',
                magic: 'linear-gradient(135deg, #4169e1, #9d4edd, #ffd700)',
                frost: 'linear-gradient(135deg, #00ffff, #4682b4, #e0ffff)',
                shadow: 'linear-gradient(135deg, #1a0033, #dc143c, #00ced1)'
            }
        };
    }
    
    initializeIconLibrary() {
        // SVG icons for UI elements - graphical and mature
        return {
            // Character/Class Icons
            warrior: this.createWarriorIcon(),
            mage: this.createMageIcon(),
            rogue: this.createRogueIcon(),
            paladin: this.createPaladinIcon(),
            necromancer: this.createNecromancerIcon(),
            
            // Combat Icons
            sword: this.createSwordIcon(),
            shield: this.createShieldIcon(),
            magic_staff: this.createStaffIcon(),
            dual_blades: this.createDualBladesIcon(),
            battle_axe: this.createBattleAxeIcon(),
            
            // Resource Icons
            health_orb: this.createHealthOrbIcon(),
            mana_crystal: this.createManaCrystalIcon(),
            experience_star: this.createExpStarIcon(),
            gold_coin: this.createGoldCoinIcon(),
            skill_point: this.createSkillPointIcon(),
            
            // Status Icons
            strength_buff: this.createStrengthBuffIcon(),
            defense_buff: this.createDefenseBuffIcon(),
            speed_buff: this.createSpeedBuffIcon(),
            poison_debuff: this.createPoisonDebuffIcon(),
            stun_debuff: this.createStunDebuffIcon(),
            
            // UI Element Icons
            quest_scroll: this.createQuestScrollIcon(),
            achievement_trophy: this.createAchievementTrophyIcon(),
            inventory_bag: this.createInventoryBagIcon(),
            settings_gear: this.createSettingsGearIcon(),
            map_compass: this.createMapCompassIcon()
        };
    }
    
    // MASCOT SVG GENERATORS - Graphical, mature designs
    
    createGuardianMascotSVG() {
        return `
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <!-- Emberveil Guardian - Dark armored sentinel -->
            <defs>
                <linearGradient id="guardianGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#8b00ff;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#ff69b4;stop-opacity:1" />
                </linearGradient>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            
            <!-- Helmet/Head -->
            <path d="M 100 30 L 120 50 L 115 80 L 85 80 L 80 50 Z" 
                  fill="url(#guardianGlow)" stroke="#d4af37" stroke-width="2" filter="url(#glow)"/>
            
            <!-- Glowing Eyes -->
            <circle cx="90" cy="55" r="5" fill="#ff69b4" filter="url(#glow)"/>
            <circle cx="110" cy="55" r="5" fill="#ff69b4" filter="url(#glow)"/>
            
            <!-- Armored Body -->
            <path d="M 85 80 L 115 80 L 120 140 L 100 160 L 80 140 Z" 
                  fill="#1a0033" stroke="#8b00ff" stroke-width="3" filter="url(#glow)"/>
            
            <!-- Chest Emblem -->
            <circle cx="100" cy="110" r="15" fill="#8b00ff" stroke="#d4af37" stroke-width="2" filter="url(#glow)"/>
            <path d="M 100 100 L 100 120 M 90 110 L 110 110" stroke="#ffd700" stroke-width="3"/>
            
            <!-- Shoulder Pauldrons -->
            <ellipse cx="75" cy="85" rx="15" ry="10" fill="#8b00ff" stroke="#d4af37" stroke-width="2"/>
            <ellipse cx="125" cy="85" rx="15" ry="10" fill="#8b00ff" stroke="#d4af37" stroke-width="2"/>
            
            <!-- Energy Aura -->
            <circle cx="100" cy="100" r="80" fill="none" stroke="#8b00ff" stroke-width="2" opacity="0.3"/>
            <circle cx="100" cy="100" r="85" fill="none" stroke="#ff69b4" stroke-width="1" opacity="0.2"/>
        </svg>`;
    }
    
    createAssassinMascotSVG() {
        return `
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <!-- Shadow Assassin - Sleek and deadly -->
            <defs>
                <linearGradient id="shadowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#1a0033;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#dc143c;stop-opacity:1" />
                </linearGradient>
            </defs>
            
            <!-- Hood -->
            <path d="M 100 20 L 80 40 L 85 70 L 115 70 L 120 40 Z" 
                  fill="url(#shadowGrad)" stroke="#00ced1" stroke-width="2"/>
            
            <!-- Face Shadow -->
            <ellipse cx="100" cy="55" rx="15" ry="20" fill="#000000" opacity="0.8"/>
            <path d="M 95 55 L 105 55" stroke="#dc143c" stroke-width="2"/>
            
            <!-- Body/Cloak -->
            <path d="M 85 70 L 115 70 L 110 150 L 90 150 Z" 
                  fill="#1a0033" stroke="#dc143c" stroke-width="2"/>
            
            <!-- Dual Daggers -->
            <path d="M 70 100 L 60 120 L 65 125 L 75 105 Z" 
                  fill="#696969" stroke="#00ced1" stroke-width="2"/>
            <path d="M 130 100 L 140 120 L 135 125 L 125 105 Z" 
                  fill="#696969" stroke="#00ced1" stroke-width="2"/>
            
            <!-- Shadow Aura -->
            <circle cx="100" cy="100" r="75" fill="#1a0033" opacity="0.2"/>
        </svg>`;
    }
    
    createSorcererMascotSVG() {
        return `
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <!-- Arcane Sorcerer - Mystical power -->
            <defs>
                <radialGradient id="magicGlow">
                    <stop offset="0%" style="stop-color:#9d4edd;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#4169e1;stop-opacity:0.3" />
                </radialGradient>
            </defs>
            
            <!-- Wizard Hat -->
            <path d="M 100 10 L 115 60 L 130 65 L 70 65 L 85 60 Z" 
                  fill="#4169e1" stroke="#ffd700" stroke-width="2"/>
            
            <!-- Head -->
            <circle cx="100" cy="75" r="18" fill="#9d4edd" stroke="#ffd700" stroke-width="2"/>
            
            <!-- Mystical Beard -->
            <path d="M 95 85 Q 100 95 105 85" fill="none" stroke="#ffd700" stroke-width="2"/>
            
            <!-- Robes -->
            <path d="M 82 75 L 118 75 L 125 160 L 75 160 Z" 
                  fill="#4169e1" stroke="#9d4edd" stroke-width="3"/>
            
            <!-- Staff -->
            <line x1="130" y1="60" x2="135" y2="160" stroke="#696969" stroke-width="4"/>
            <circle cx="130" cy="50" r="12" fill="url(#magicGlow)" stroke="#ffd700" stroke-width="2"/>
            
            <!-- Floating Runes -->
            <text x="60" y="100" font-size="20" fill="#9d4edd" opacity="0.7">✦</text>
            <text x="140" y="120" font-size="20" fill="#ffd700" opacity="0.7">✧</text>
            <text x="80" y="140" font-size="20" fill="#4169e1" opacity="0.7">⚝</text>
        </svg>`;
    }
    
    createBerserkerMascotSVG() {
        return `
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <!-- Battle Berserker - Pure rage -->
            <defs>
                <linearGradient id="rageGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#8b0000;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#ff4500;stop-opacity:1" />
                </linearGradient>
            </defs>
            
            <!-- Horned Helmet -->
            <path d="M 100 25 L 120 45 L 115 75 L 85 75 L 80 45 Z" 
                  fill="#696969" stroke="#8b0000" stroke-width="3"/>
            <path d="M 75 40 L 65 25 L 70 45" fill="none" stroke="#696969" stroke-width="4"/>
            <path d="M 125 40 L 135 25 L 130 45" fill="none" stroke="#696969" stroke-width="4"/>
            
            <!-- Glowing Red Eyes -->
            <circle cx="90" cy="55" r="6" fill="#ff0000"/>
            <circle cx="110" cy="55" r="6" fill="#ff0000"/>
            
            <!-- Massive Armored Body -->
            <path d="M 85 75 L 115 75 L 130 150 L 70 150 Z" 
                  fill="url(#rageGlow)" stroke="#696969" stroke-width="4"/>
            
            <!-- Battle Scars -->
            <line x1="95" y1="90" x2="105" y2="100" stroke="#8b0000" stroke-width="2"/>
            <line x1="88" y1="110" x2="98" y2="115" stroke="#8b0000" stroke-width="2"/>
            
            <!-- Massive Battle Axe -->
            <line x1="140" y1="70" x2="145" y2="150" stroke="#696969" stroke-width="5"/>
            <path d="M 135 70 L 155 60 L 145 80 Z" fill="#ff4500" stroke="#8b0000" stroke-width="2"/>
            
            <!-- Rage Aura -->
            <circle cx="100" cy="100" r="82" fill="none" stroke="#ff4500" stroke-width="3" opacity="0.4"/>
        </svg>`;
    }
    
    createReaperMascotSVG() {
        return `
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <!-- Frost Reaper - Ice and death -->
            <defs>
                <linearGradient id="frostGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#00ffff;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#4682b4;stop-opacity:1" />
                </linearGradient>
            </defs>
            
            <!-- Hooded Cloak -->
            <path d="M 100 15 L 75 40 L 80 75 L 120 75 L 125 40 Z" 
                  fill="url(#frostGrad)" stroke="#e0ffff" stroke-width="2"/>
            
            <!-- Face of Death -->
            <ellipse cx="100" cy="55" rx="12" ry="15" fill="#000033"/>
            <circle cx="95" cy="50" r="3" fill="#00ffff"/>
            <circle cx="105" cy="50" r="3" fill="#00ffff"/>
            
            <!-- Icy Armor Body -->
            <path d="M 80 75 L 120 75 L 125 155 L 75 155 Z" 
                  fill="#4682b4" stroke="#00ffff" stroke-width="3"/>
            
            <!-- Ice Crystals -->
            <polygon points="100,95 95,105 105,105" fill="#00ffff" opacity="0.8"/>
            <polygon points="85,110 80,120 90,120" fill="#e0ffff" opacity="0.7"/>
            <polygon points="115,110 110,120 120,120" fill="#e0ffff" opacity="0.7"/>
            
            <!-- Frozen Scythe -->
            <line x1="140" y1="80" x2="135" y2="140" stroke="#4682b4" stroke-width="4"/>
            <path d="M 135 80 L 155 70 Q 160 75 155 85 Z" 
                  fill="#00ffff" stroke="#e0ffff" stroke-width="2"/>
            
            <!-- Frost Aura -->
            <circle cx="100" cy="100" r="78" fill="none" stroke="#00ffff" stroke-width="2" opacity="0.3"/>
            <circle cx="100" cy="100" r="83" fill="none" stroke="#e0ffff" stroke-width="1" opacity="0.2"/>
        </svg>`;
    }
    
    // ICON GENERATORS - Graphical UI icons
    
    createWarriorIcon() {
        return `
        <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="28" fill="#8b0000" stroke="#ff4500" stroke-width="3"/>
            <path d="M 32 15 L 35 25 L 45 22 L 37 32 L 45 42 L 35 39 L 32 49 L 29 39 L 19 42 L 27 32 L 19 22 L 29 25 Z" 
                  fill="#ffd700" stroke="#ff4500" stroke-width="2"/>
        </svg>`;
    }
    
    createMageIcon() {
        return `
        <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="28" fill="#4169e1" stroke="#9d4edd" stroke-width="3"/>
            <circle cx="32" cy="28" r="12" fill="#9d4edd" stroke="#ffd700" stroke-width="2"/>
            <polygon points="32,16 28,36 36,36" fill="#ffd700"/>
            <circle cx="24" cy="20" r="3" fill="#ffd700" opacity="0.7"/>
            <circle cx="40" cy="20" r="3" fill="#ffd700" opacity="0.7"/>
            <circle cx="32" cy="12" r="3" fill="#ffd700" opacity="0.7"/>
        </svg>`;
    }
    
    createRogueIcon() {
        return `
        <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="28" fill="#1a0033" stroke="#dc143c" stroke-width="3"/>
            <path d="M 20 25 L 28 32 L 20 39" fill="none" stroke="#00ced1" stroke-width="3"/>
            <path d="M 44 25 L 36 32 L 44 39" fill="none" stroke="#00ced1" stroke-width="3"/>
            <line x1="32" y1="20" x2="32" y2="44" stroke="#dc143c" stroke-width="2"/>
        </svg>`;
    }
    
    createHealthOrbIcon() {
        return `
        <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <radialGradient id="healthGrad">
                    <stop offset="0%" style="stop-color:#ff1493;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#dc143c;stop-opacity:1" />
                </radialGradient>
            </defs>
            <circle cx="32" cy="32" r="28" fill="url(#healthGrad)" stroke="#ff69b4" stroke-width="3"/>
            <path d="M 32 20 L 28 28 L 36 28 L 32 36 L 36 36 L 28 36 L 32 44" 
                  fill="none" stroke="#ffffff" stroke-width="3"/>
            <circle cx="32" cy="32" r="24" fill="none" stroke="#ffffff" stroke-width="1" opacity="0.3"/>
        </svg>`;
    }
    
    createManaCrystalIcon() {
        return `
        <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="manaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#00bfff;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#0000cd;stop-opacity:1" />
                </linearGradient>
            </defs>
            <polygon points="32,10 50,28 32,54 14,28" 
                     fill="url(#manaGrad)" stroke="#00ffff" stroke-width="3"/>
            <polygon points="32,10 32,54 50,28" fill="#4169e1" opacity="0.5"/>
            <circle cx="32" cy="28" r="8" fill="#00ffff" opacity="0.6"/>
        </svg>`;
    }
    
    createExpStarIcon() {
        return `
        <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <radialGradient id="expGrad">
                    <stop offset="0%" style="stop-color:#ffd700;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#d4af37;stop-opacity:1" />
                </radialGradient>
            </defs>
            <polygon points="32,8 38,26 58,26 42,38 48,56 32,44 16,56 22,38 6,26 26,26" 
                     fill="url(#expGrad)" stroke="#ffec8b" stroke-width="2"/>
            <circle cx="32" cy="32" r="10" fill="#ffd700"/>
        </svg>`;
    }
    
    createSwordIcon() {
        return `
        <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
            <line x1="15" y1="50" x2="50" y2="15" stroke="#696969" stroke-width="6"/>
            <polygon points="50,10 55,15 50,20" fill="#d4af37"/>
            <rect x="10" y="48" width="8" height="8" fill="#8b4513" transform="rotate(45 14 52)"/>
            <circle cx="52" cy="13" r="5" fill="#dc143c"/>
        </svg>`;
    }
    
    createShieldIcon() {
        return `
        <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
            <path d="M 32 8 L 12 18 L 12 38 Q 12 55 32 60 Q 52 55 52 38 L 52 18 Z" 
                  fill="#4682b4" stroke="#d4af37" stroke-width="3"/>
            <path d="M 32 12 L 18 20 L 18 38 Q 18 50 32 54 Q 46 50 46 38 L 46 20 Z" 
                  fill="#5a9fd4" stroke="#ffd700" stroke-width="2"/>
            <polygon points="32,24 28,32 36,32" fill="#ffd700"/>
        </svg>`;
    }
    
    // Additional icon generators...
    createStaffIcon() {
        return `<svg viewBox="0 0 64 64"><line x1="32" y1="10" x2="32" y2="54" stroke="#696969" stroke-width="4"/><circle cx="32" cy="10" r="8" fill="#9d4edd" stroke="#ffd700" stroke-width="2"/></svg>`;
    }
    
    createDualBladesIcon() {
        return `<svg viewBox="0 0 64 64"><line x1="20" y1="15" x2="44" y2="49" stroke="#696969" stroke-width="3"/><line x1="44" y1="15" x2="20" y2="49" stroke="#696969" stroke-width="3"/></svg>`;
    }
    
    createBattleAxeIcon() {
        return `<svg viewBox="0 0 64 64"><line x1="32" y1="10" x2="32" y2="54" stroke="#8b4513" stroke-width="5"/><path d="M 15 20 Q 32 15 49 20 L 49 30 Q 32 35 15 30 Z" fill="#696969" stroke="#8b0000" stroke-width="2"/></svg>`;
    }
    
    createGoldCoinIcon() {
        return `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="24" fill="#ffd700" stroke="#d4af37" stroke-width="3"/><text x="32" y="40" font-size="24" fill="#8b4513" text-anchor="middle" font-weight="bold">G</text></svg>`;
    }
    
    createSkillPointIcon() {
        return `<svg viewBox="0 0 64 64"><polygon points="32,10 38,26 56,26 42,36 48,52 32,42 16,52 22,36 8,26 26,26" fill="#9d4edd" stroke="#ffd700" stroke-width="2"/></svg>`;
    }
    
    createStrengthBuffIcon() {
        return `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="26" fill="#ff4500" opacity="0.3"/><path d="M 25 28 L 32 20 L 39 28 L 35 28 L 35 44 L 29 44 L 29 28 Z" fill="#ff0000"/></svg>`;
    }
    
    createDefenseBuffIcon() {
        return `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="26" fill="#4682b4" opacity="0.3"/><path d="M 32 12 L 16 22 L 16 38 Q 16 50 32 54 Q 48 50 48 38 L 48 22 Z" fill="#4169e1"/></svg>`;
    }
    
    createSpeedBuffIcon() {
        return `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="26" fill="#00ced1" opacity="0.3"/><path d="M 15 32 L 30 20 L 30 28 L 49 28 L 49 36 L 30 36 L 30 44 Z" fill="#00ffff"/></svg>`;
    }
    
    createPoisonDebuffIcon() {
        return `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="26" fill="#32cd32" opacity="0.3"/><path d="M 28 20 Q 32 26 36 20 L 40 36 Q 40 48 32 52 Q 24 48 24 36 Z" fill="#228b22"/></svg>`;
    }
    
    createStunDebuffIcon() {
        return `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="26" fill="#ffd700" opacity="0.3"/><path d="M 32 16 L 35 28 L 48 28 L 38 36 L 42 48 L 32 40 L 22 48 L 26 36 L 16 28 L 29 28 Z" fill="#ffff00"/></svg>`;
    }
    
    createQuestScrollIcon() {
        return `<svg viewBox="0 0 64 64"><rect x="12" y="8" width="40" height="48" rx="4" fill="#f5deb3" stroke="#8b4513" stroke-width="2"/><line x1="20" y1="20" x2="44" y2="20" stroke="#8b4513" stroke-width="2"/><line x1="20" y1="28" x2="44" y2="28" stroke="#8b4513" stroke-width="1"/><line x1="20" y1="36" x2="44" y2="36" stroke="#8b4513" stroke-width="1"/></svg>`;
    }
    
    createAchievementTrophyIcon() {
        return `<svg viewBox="0 0 64 64"><path d="M 24 12 L 24 22 L 18 28 L 18 36 L 24 36 L 28 36 L 28 44 L 22 44 L 22 52 L 42 52 L 42 44 L 36 44 L 36 36 L 40 36 L 46 36 L 46 28 L 40 22 L 40 12 Z" fill="#ffd700" stroke="#d4af37" stroke-width="2"/><rect x="24" y="12" width="16" height="10" fill="#dc143c"/></svg>`;
    }
    
    createInventoryBagIcon() {
        return `<svg viewBox="0 0 64 64"><path d="M 20 18 L 16 28 L 16 52 L 48 52 L 48 28 L 44 18 Z" fill="#8b4513" stroke="#654321" stroke-width="2"/><path d="M 26 18 Q 32 12 38 18" fill="none" stroke="#654321" stroke-width="3"/></svg>`;
    }
    
    createSettingsGearIcon() {
        return `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="12" fill="#696969"/><path d="M 32 8 L 36 18 L 46 14 L 46 24 L 56 28 L 52 38 L 60 46 L 50 50 L 46 60 L 36 56 L 32 56 L 22 60 L 18 50 L 8 46 L 12 38 L 8 28 L 18 24 L 18 14 L 28 18 Z" fill="#4682b4" stroke="#696969" stroke-width="2"/></svg>`;
    }
    
    createMapCompassIcon() {
        return `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="26" fill="#4169e1" stroke="#d4af37" stroke-width="3"/><polygon points="32,12 36,28 32,32 28,28" fill="#dc143c"/><polygon points="32,52 28,36 32,32 36,36" fill="#ffffff"/><circle cx="32" cy="32" r="4" fill="#ffd700"/></svg>`;
    }
    
    createPaladinIcon() {
        return `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="28" fill="#ffd700" stroke="#fff" stroke-width="3"/><path d="M 32 16 L 32 48 M 20 32 L 44 32" stroke="#fff" stroke-width="4"/></svg>`;
    }
    
    createNecromancerIcon() {
        return `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="28" fill="#1a0033" stroke="#9370db" stroke-width="3"/><path d="M 24 28 Q 32 20 40 28 Q 32 36 24 28" fill="#9370db"/><circle cx="32" cy="38" r="6" fill="#9370db"/></svg>`;
    }
    
    // Utility Methods
    
    getMascot(mascotId) {
        return this.mascots[mascotId] || this.mascots.emberveil_guardian;
    }
    
    getIcon(iconName) {
        return this.iconLibrary[iconName] || this.iconLibrary.settings_gear;
    }
    
    getBrandColor(category, shade) {
        return this.brandColors[category]?.[shade] || '#8b00ff';
    }
    
    getGradient(gradientName) {
        return this.brandColors.gradient[gradientName] || this.brandColors.gradient.power;
    }
    
    setCurrentMascot(mascotId) {
        if (this.mascots[mascotId]) {
            this.currentMascot = mascotId;
            logger.info(`🎭 Mascot changed to: ${this.mascots[mascotId].name}`);
        }
    }
    
    injectMascotIntoUI(containerId, mascotId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const mascot = this.getMascot(mascotId);
        container.innerHTML = mascot.svg;
        container.style.width = '100%';
        container.style.height = '100%';
    }
    
    injectIconIntoUI(containerId, iconName) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const icon = this.getIcon(iconName);
        container.innerHTML = icon;
        container.style.width = '100%';
        container.style.height = '100%';
    }
}
