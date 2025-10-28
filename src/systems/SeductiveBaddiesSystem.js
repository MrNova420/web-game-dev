/**
 * Seductive Baddies System
 * Hot anime-inspired boss characters with unique personalities and combat styles
 */

export class SeductiveBaddiesSystem {
    constructor() {
        this.baddies = this.initializeBaddies();
        this.encounterHistory = [];
        this.affectionLevels = {};
        this.defeatedCount = {};
    }

    initializeBaddies() {
        return [
            {
                id: 'crimson_empress',
                name: 'Crimson Empress Scarlet',
                title: 'The Flame Enchantress',
                appearance: {
                    hair: 'Long flowing crimson hair',
                    eyes: 'Fierce ruby red eyes',
                    outfit: 'Elegant red battle dress with gold accents',
                    features: 'Confident smirk, battle-hardened beauty'
                },
                personality: 'Dominant, confident, respects strength',
                element: 'fire',
                level: 50,
                stats: {
                    hp: 50000,
                    attack: 2500,
                    defense: 1800,
                    magic: 3000,
                    speed: 2200
                },
                abilities: [
                    'Crimson Dance - Multi-hit fire slashes',
                    'Empress Authority - Dominate weaker foes',
                    'Flame Temptation - Charm and burn damage',
                    'Ultimate: Scarlet Apocalypse'
                ],
                dropTable: {
                    'Crimson Kiss Token': 0.1,
                    'Empress Battle Dress': 0.05,
                    'Flame Heart Crystal': 0.15,
                    'Legendary Fire Weapon': 0.03
                },
                dialogue: {
                    encounter: 'Oh? You dare challenge me? Show me your strength, darling~',
                    halfHealth: 'Impressive... You\'re making my heart race!',
                    defeat: 'You\'ve won my respect... and perhaps something more...'
                },
                affectionRewards: {
                    50: 'Empress Battle Outfit (cosmetic)',
                    100: 'Crimson Familiar (pet)',
                    200: 'Ultimate Fire Skill: Scarlet Flame',
                    500: 'Special Scene: Private Training Session'
                }
            },
            {
                id: 'frost_queen',
                name: 'Frost Queen Elsa',
                title: 'The Ice Princess',
                appearance: {
                    hair: 'Silver-white hair with ice crystals',
                    eyes: 'Cold blue eyes that warm when you impress her',
                    outfit: 'Regal ice-crystal gown with bare shoulders',
                    features: 'Elegant, untouchable beauty'
                },
                personality: 'Cool and distant, but melts for the right person',
                element: 'ice',
                level: 55,
                stats: {
                    hp: 48000,
                    attack: 2300,
                    defense: 2500,
                    magic: 3500,
                    speed: 1900
                },
                abilities: [
                    'Frozen Heart - Ice barrier + reflect damage',
                    'Absolute Zero Kiss - Freeze and massive damage',
                    'Ice Queen\'s Blessing - Self-heal + attack buff',
                    'Ultimate: Eternal Winter Storm'
                ],
                dropTable: {
                    'Frozen Heart Fragment': 0.12,
                    'Ice Queen Crown': 0.04,
                    'Eternal Ice Shard': 0.18,
                    'Legendary Ice Weapon': 0.03
                },
                dialogue: {
                    encounter: 'Few dare approach me... Are you different from the rest?',
                    halfHealth: 'This warmth I feel... what is it?',
                    defeat: 'You\'ve melted my frozen heart... Stay close to me.'
                },
                affectionRewards: {
                    50: 'Ice Princess Tiara (cosmetic)',
                    100: 'Frozen Familiar (pet)',
                    200: 'Ultimate Ice Skill: Eternal Freeze',
                    500: 'Special Scene: Ice Palace Romance'
                }
            },
            {
                id: 'shadow_assassin',
                name: 'Shadow Assassin Yuki',
                title: 'The Silent Death',
                appearance: {
                    hair: 'Short black hair with purple highlights',
                    eyes: 'Mysterious purple eyes',
                    outfit: 'Tight black leather assassin suit',
                    features: 'Lithe, dangerous, strikingly beautiful'
                },
                personality: 'Mysterious, playful, deadly serious in battle',
                element: 'dark',
                level: 60,
                stats: {
                    hp: 42000,
                    attack: 3500,
                    defense: 1500,
                    magic: 2800,
                    speed: 4000
                },
                abilities: [
                    'Shadow Strike - Teleport behind + critical',
                    'Deadly Dance - Multi-hit combo with evasion',
                    'Assassination Attempt - One-hit kill chance',
                    'Ultimate: Dance of Death'
                ],
                dropTable: {
                    'Shadow Essence': 0.15,
                    'Assassin\'s Kiss Mark': 0.08,
                    'Void Blade Fragment': 0.12,
                    'Legendary Dark Weapon': 0.03
                },
                dialogue: {
                    encounter: 'Shhh~ Let\'s dance in the shadows, shall we?',
                    halfHealth: 'You can keep up with me? Interesting~',
                    defeat: 'I\'ll be watching you from the shadows... always.'
                },
                affectionRewards: {
                    50: 'Shadow Assassin Outfit (cosmetic)',
                    100: 'Shadow Cat Familiar (pet)',
                    200: 'Ultimate Shadow Skill: Void Step',
                    500: 'Special Scene: Moonlight Rooftop Meeting'
                }
            },
            {
                id: 'lightning_valkyrie',
                name: 'Lightning Valkyrie Freya',
                title: 'The Thunder Goddess',
                appearance: {
                    hair: 'Golden blonde hair flowing with electricity',
                    eyes: 'Electric blue eyes crackling with power',
                    outfit: 'Divine armor with exposed midriff',
                    features: 'Powerful, warrior goddess beauty'
                },
                personality: 'Proud warrior, seeks worthy opponents',
                element: 'lightning',
                level: 65,
                stats: {
                    hp: 55000,
                    attack: 3800,
                    defense: 2200,
                    magic: 3200,
                    speed: 3500
                },
                abilities: [
                    'Valkyrie Strike - Lightning-fast slash',
                    'Thunder Judgement - AOE lightning damage',
                    'Divine Spark - Revive at 1 HP once',
                    'Ultimate: Ragnarok Thunder'
                ],
                dropTable: {
                    'Thunder God Essence': 0.10,
                    'Valkyrie Wings': 0.05,
                    'Divine Lightning Spear': 0.08,
                    'Legendary Lightning Weapon': 0.03
                },
                dialogue: {
                    encounter: 'A challenger! Prove yourself worthy of battle with me!',
                    halfHealth: 'Magnificent! You fight like a true warrior!',
                    defeat: 'You are worthy... Fight by my side, warrior.'
                },
                affectionRewards: {
                    50: 'Valkyrie Armor Set (cosmetic)',
                    100: 'Thunder Hawk Familiar (pet)',
                    200: 'Ultimate Lightning Skill: Gods Judgement',
                    500: 'Special Scene: Hall of Warriors Feast'
                }
            },
            {
                id: 'nature_dryad',
                name: 'Nature Dryad Sylvia',
                title: 'The Forest Enchantress',
                appearance: {
                    hair: 'Green hair adorned with flowers',
                    eyes: 'Emerald green eyes full of life',
                    outfit: 'Living flower dress, natural beauty',
                    features: 'Ethereal, otherworldly gorgeous'
                },
                personality: 'Gentle but protective of nature',
                element: 'nature',
                level: 52,
                stats: {
                    hp: 45000,
                    attack: 2100,
                    defense: 2000,
                    magic: 3800,
                    speed: 2000
                },
                abilities: [
                    'Forest Embrace - Healing + DOT vines',
                    'Nature\'s Wrath - Summon forest guardians',
                    'Life Drain Kiss - Steal HP and buffs',
                    'Ultimate: Gaia\'s Judgement'
                ],
                dropTable: {
                    'Ancient Seed': 0.14,
                    'Dryad\'s Blessing': 0.10,
                    'World Tree Branch': 0.09,
                    'Legendary Nature Weapon': 0.03
                },
                dialogue: {
                    encounter: 'The forest speaks of your arrival... Show me your intentions.',
                    halfHealth: 'You fight with honor... Nature smiles upon you.',
                    defeat: 'Join me in protecting this world... my champion.'
                },
                affectionRewards: {
                    50: 'Dryad Outfit (cosmetic)',
                    100: 'Forest Spirit Familiar (pet)',
                    200: 'Ultimate Nature Skill: World Tree Power',
                    500: 'Special Scene: Sacred Forest Grove'
                }
            },
            {
                id: 'celestial_maiden',
                name: 'Celestial Maiden Aurora',
                title: 'The Starlight Princess',
                appearance: {
                    hair: 'Shimmering silver hair like starlight',
                    eyes: 'Galaxy-colored eyes with swirling nebulae',
                    outfit: 'Flowing celestial robes revealing curves',
                    features: 'Divine beauty, literally glowing'
                },
                personality: 'Innocent yet powerful, curious about mortals',
                element: 'light',
                level: 70,
                stats: {
                    hp: 58000,
                    attack: 2800,
                    defense: 2400,
                    magic: 4500,
                    speed: 2600
                },
                abilities: [
                    'Starlight Caress - Heal and damage simultaneously',
                    'Celestial Judgement - Purifying light beam',
                    'Divine Protection - Invulnerability shield',
                    'Ultimate: Genesis Star Fall'
                ],
                dropTable: {
                    'Star Fragment': 0.11,
                    'Celestial Halo': 0.06,
                    'Divine Essence': 0.13,
                    'Legendary Light Weapon': 0.03
                },
                dialogue: {
                    encounter: 'A mortal seeking the stars? How fascinating~',
                    halfHealth: 'Your determination shines brighter than any star!',
                    defeat: 'You\'ve touched my heart... Descend with me to the mortal world.'
                },
                affectionRewards: {
                    50: 'Celestial Wings (cosmetic)',
                    100: 'Star Phoenix Familiar (pet)',
                    200: 'Ultimate Light Skill: Salvation',
                    500: 'Special Scene: Starlit Confession'
                }
            },
            {
                id: 'demon_queen',
                name: 'Demon Queen Lilith',
                title: 'The Temptress of Darkness',
                appearance: {
                    hair: 'Black hair with red streaks',
                    eyes: 'Glowing red eyes with slit pupils',
                    outfit: 'Revealing demonic armor with chains',
                    features: 'Dangerously seductive, demonic horns and tail'
                },
                personality: 'Seductive, dominant, loves strong souls',
                element: 'dark',
                level: 75,
                stats: {
                    hp: 65000,
                    attack: 3500,
                    defense: 2100,
                    magic: 4200,
                    speed: 2800
                },
                abilities: [
                    'Demonic Seduction - Charm + life drain',
                    'Hell\'s Embrace - Fire + dark combo attack',
                    'Queen\'s Command - Control summoned demons',
                    'Ultimate: Demon King\'s Bride'
                ],
                dropTable: {
                    'Demon Queen\'s Mark': 0.09,
                    'Succubus Heart': 0.07,
                    'Hell Flame Core': 0.12,
                    'Legendary Dark Weapon': 0.03
                },
                dialogue: {
                    encounter: 'Your soul looks delicious... Come, entertain me~',
                    halfHealth: 'Such passion! I want to devour you!',
                    defeat: 'You\'ve conquered the Demon Queen... claim your prize.'
                },
                affectionRewards: {
                    50: 'Demon Queen Outfit (cosmetic)',
                    100: 'Imp Familiar (pet)',
                    200: 'Ultimate Dark Skill: Demon Transformation',
                    500: 'Special Scene: Throne Room Submission'
                }
            },
            {
                id: 'dragon_empress',
                name: 'Dragon Empress Tiamat',
                title: 'The Five-Headed Calamity',
                appearance: {
                    hair: 'Multi-colored hair (red, blue, green, white, black)',
                    eyes: 'Dragon eyes that shift colors',
                    outfit: 'Dragon scale bikini armor',
                    features: 'Majestic, terrifying beauty with dragon features'
                },
                personality: 'Proud, ancient, respects only the strongest',
                element: 'arcane',
                level: 100,
                stats: {
                    hp: 100000,
                    attack: 5000,
                    defense: 4000,
                    magic: 5500,
                    speed: 3000
                },
                abilities: [
                    'Five Element Breath - All elements at once',
                    'Dragon\'s Majesty - Intimidate + stat debuff',
                    'Empress Transformation - True dragon form',
                    'Ultimate: World Eater Dragon'
                ],
                dropTable: {
                    'Dragon Empress Scale': 0.05,
                    'Five Element Heart': 0.02,
                    'Dragon God Core': 0.08,
                    'Legendary Mythic Weapon': 0.01
                },
                dialogue: {
                    encounter: 'Kneel before the Dragon Empress, mortal!',
                    halfHealth: 'What?! No one has pushed me this far in centuries!',
                    defeat: 'Impossible... You\'ve won my eternal devotion, my king.'
                },
                affectionRewards: {
                    50: 'Dragon Empress Crown (cosmetic)',
                    100: 'Baby Dragon Familiar (pet)',
                    200: 'Ultimate Dragon Skill: Dragon God Form',
                    500: 'Special Scene: Dragon\'s Lair Ceremony'
                }
            }
        ];
    }

    encounterBaddie(baddieId, playerLevel, playerPower) {
        const baddie = this.baddies.find(b => b.id === baddieId);
        if (!baddie) return null;

        // Check if player is strong enough
        const powerRatio = playerPower / (baddie.stats.attack + baddie.stats.magic);
        
        const encounter = {
            baddie: baddie,
            difficulty: powerRatio < 0.5 ? 'impossible' : 
                       powerRatio < 0.7 ? 'very_hard' :
                       powerRatio < 0.9 ? 'hard' :
                       powerRatio < 1.2 ? 'fair' : 'easy',
            dialogue: baddie.dialogue.encounter,
            rewards: this.calculateRewards(baddie, powerRatio)
        };

        this.encounterHistory.push({
            baddieId: baddieId,
            timestamp: Date.now(),
            difficulty: encounter.difficulty
        });

        return encounter;
    }

    defeatBaddie(baddieId, performance) {
        const baddie = this.baddies.find(b => b.id === baddieId);
        if (!baddie) return null;

        // Track defeats
        this.defeatedCount[baddieId] = (this.defeatedCount[baddieId] || 0) + 1;

        // Increase affection based on performance
        const affectionGain = performance === 'perfect' ? 20 :
                            performance === 'excellent' ? 15 :
                            performance === 'good' ? 10 : 5;

        this.affectionLevels[baddieId] = (this.affectionLevels[baddieId] || 0) + affectionGain;

        // Check for affection rewards
        const rewards = [];
        const currentAffection = this.affectionLevels[baddieId];
        
        Object.entries(baddie.affectionRewards).forEach(([threshold, reward]) => {
            if (currentAffection >= parseInt(threshold) && currentAffection - affectionGain < parseInt(threshold)) {
                rewards.push({
                    type: 'affection_reward',
                    reward: reward,
                    affectionLevel: threshold
                });
            }
        });

        // Roll for drops
        Object.entries(baddie.dropTable).forEach(([item, chance]) => {
            if (Math.random() < chance) {
                rewards.push({
                    type: 'drop',
                    item: item
                });
            }
        });

        return {
            baddie: baddie,
            dialogue: baddie.dialogue.defeat,
            affectionGain: affectionGain,
            currentAffection: currentAffection,
            rewards: rewards,
            defeatsCount: this.defeatedCount[baddieId]
        };
    }

    calculateRewards(baddie, powerRatio) {
        const baseExp = baddie.level * 1000;
        const baseGold = baddie.level * 500;
        
        // Better rewards for harder fights
        const difficultyMultiplier = powerRatio < 0.7 ? 2.0 :
                                     powerRatio < 0.9 ? 1.5 :
                                     powerRatio < 1.2 ? 1.0 : 0.8;

        return {
            exp: Math.floor(baseExp * difficultyMultiplier),
            gold: Math.floor(baseGold * difficultyMultiplier),
            potentialDrops: Object.keys(baddie.dropTable)
        };
    }

    getBaddieAffection(baddieId) {
        return this.affectionLevels[baddieId] || 0;
    }

    getAvailableBaddies(playerLevel) {
        // Only show baddies within reasonable level range
        return this.baddies.filter(b => 
            b.level <= playerLevel + 20 && 
            b.level >= playerLevel - 10
        );
    }

    getNextAffectionReward(baddieId) {
        const baddie = this.baddies.find(b => b.id === baddieId);
        if (!baddie) return null;

        const currentAffection = this.affectionLevels[baddieId] || 0;
        const rewardThresholds = Object.keys(baddie.affectionRewards).map(Number).sort((a, b) => a - b);
        
        const nextThreshold = rewardThresholds.find(t => t > currentAffection);
        
        if (nextThreshold) {
            return {
                threshold: nextThreshold,
                reward: baddie.affectionRewards[nextThreshold],
                progress: currentAffection,
                remaining: nextThreshold - currentAffection
            };
        }

        return null; // Max affection reached
    }

    getAllBaddies() {
        return this.baddies;
    }
}
