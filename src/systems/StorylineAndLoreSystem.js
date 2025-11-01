import { logger } from '../core/Logger.js';
/**
 * StorylineAndLoreSystem.js
 * Deep storyline, lore, narrative, and world-building system
 * Integrates story into gameplay with dynamic narration
 * ~500 lines
 */

export class StorylineAndLoreSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // Main storyline chapters
        this.chapters = {
            prologue: {
                id: 'prologue',
                title: 'The Awakening',
                description: 'You awaken in the mystical realm of Emberveil, a world shrouded in twilight and mystery.',
                unlockLevel: 1,
                quests: ['awakening_quest', 'first_steps', 'discover_power'],
                loreEntries: ['world_origin', 'twilight_curse', 'ancient_prophecy'],
                completed: false
            },
            chapter1: {
                id: 'chapter1',
                title: 'Shadows of the Past',
                description: 'Ancient ruins whisper secrets of a civilization long forgotten, and dark forces stir in the depths.',
                unlockLevel: 10,
                quests: ['ruins_investigation', 'shadow_threat', 'lost_artifact'],
                loreEntries: ['ancient_civilization', 'shadow_realm_origin', 'first_guardians'],
                completed: false
            },
            chapter2: {
                id: 'chapter2',
                title: 'The Elemental War',
                description: 'The balance of elements has been disrupted. Fire, Ice, Shadow, and Light clash for dominance.',
                unlockLevel: 20,
                quests: ['elemental_conflict', 'restore_balance', 'unite_factions'],
                loreEntries: ['elemental_lords', 'great_war', 'balance_breaking'],
                completed: false
            },
            chapter3: {
                id: 'chapter3',
                title: 'Rise of the Dynasty',
                description: 'You must unite the scattered kingdoms under a single banner to face the coming darkness.',
                unlockLevel: 30,
                quests: ['kingdom_alliance', 'crown_retrieval', 'coronation'],
                loreEntries: ['dynasty_history', 'royal_bloodline', 'crown_power'],
                completed: false
            },
            chapter4: {
                id: 'chapter4',
                title: 'The Void Awakens',
                description: 'An ancient evil stirs beyond reality itself. The Void threatens to consume all existence.',
                unlockLevel: 40,
                quests: ['void_investigation', 'seal_breaches', 'final_battle'],
                loreEntries: ['void_entity', 'reality_fabric', 'ultimate_sacrifice'],
                completed: false
            }
        };
        
        // Lore encyclopedia
        this.lore = {
            world_origin: {
                title: 'The Birth of Emberveil',
                category: 'World History',
                content: `In the beginning, there was only the Void - an endless expanse of nothingness. From this void, the First Light emerged, and with it, the realm of Emberveil was born. The world exists in perpetual twilight, caught between day and night, a testament to the balance that must be maintained.`,
                discovered: false,
                unlockCondition: 'Start game'
            },
            twilight_curse: {
                title: 'The Eternal Twilight',
                category: 'Curses & Blessings',
                content: `The realm of Emberveil is cursed to exist in eternal twilight. Neither fully in light nor darkness, this state grants the world unique magical properties but also attracts forces from both extremes. Some say the twilight is a blessing, others a curse - but all agree it is the source of the realm's power.`,
                discovered: false,
                unlockCondition: 'Complete Prologue'
            },
            ancient_prophecy: {
                title: 'Prophecy of the Chosen',
                category: 'Prophecies',
                content: `"When twilight fades and shadows grow long, a hero shall rise from beyond the veil. With power drawn from light and dark, they shall unite the scattered realms and face the Void itself. Only through balance shall salvation come."`,
                discovered: false,
                unlockCondition: 'Reach Level 5'
            },
            ancient_civilization: {
                title: 'The Emberborn Empire',
                category: 'Ancient History',
                content: `Long before the current age, the Emberborn Empire ruled all of Emberveil. Masters of fire and shadow magic, they built magnificent cities that touched the sky. Their hubris led them to delve too deep into forbidden knowledge, unleashing the Shadow Plague that consumed their civilization in a single night.`,
                discovered: false,
                unlockCondition: 'Discover Ancient Ruins'
            },
            elemental_lords: {
                title: 'The Four Elemental Lords',
                category: 'Legendary Beings',
                content: `Four primordial beings embody the fundamental forces: Infernus the Flame Lord, Glacius the Frost Monarch, Umbra the Shadow Queen, and Lux the Light Sovereign. Once allies in maintaining balance, they now war for supremacy, threatening to tear the realm apart.`,
                discovered: false,
                unlockCondition: 'Complete Chapter 1'
            },
            void_entity: {
                title: 'The Nameless Void',
                category: 'Cosmic Threats',
                content: `Beyond the boundaries of reality lurks an entity without name or form - pure entropy given consciousness. It seeks to unmake all creation, returning everything to the primordial void. The ancient seals that bind it weaken with each passing century.`,
                discovered: false,
                unlockCondition: 'Reach Level 40'
            }
        };
        
        // Active story events
        this.activeEvents = [];
        
        // Character relationships and development
        this.characters = {
            mentor: {
                name: 'Eldrin the Wise',
                role: 'Mentor',
                relationship: 0,
                dialogues: [
                    'The path ahead is fraught with danger, but I sense great potential within you.',
                    'The ancient texts speak of one who would bridge light and shadow.',
                    'Remember, true power comes not from strength alone, but from understanding.'
                ],
                unlocked: true
            },
            rival: {
                name: 'Sable Nightshade',
                role: 'Rival',
                relationship: 0,
                dialogues: [
                    'You think you can surpass me? Prove it.',
                    "I've been training since before you even knew magic existed.",
                    'Perhaps... you are worthy of respect after all.'
                ],
                unlocked: false,
                unlockLevel: 10
            },
            mysterious_ally: {
                name: 'The Veiled One',
                role: 'Mysterious Ally',
                relationship: 0,
                dialogues: [
                    'The threads of fate are tangled... interesting.',
                    'I have seen your future in the smoke of time.',
                    'When the moment comes, you will know what must be done.'
                ],
                unlocked: false,
                unlockLevel: 20
            }
        };
        
        // Story choices and consequences
        this.playerChoices = [];
        this.worldState = {
            alignment: 'neutral', // light, neutral, shadow
            reputation: {
                light_faction: 0,
                shadow_faction: 0,
                neutral_faction: 0
            },
            majorDecisions: []
        };
        
        logger.info('📖 StorylineAndLoreSystem initialized');
    }
    
    /**
     * Initialize storyline
     */
    init(playerLevel) {
        this.unlockChapter('prologue');
        this.discoverLore('world_origin');
        
        logger.info('📜 Storyline begins...');
    }
    
    /**
     * Unlock a story chapter
     */
    unlockChapter(chapterId) {
        const chapter = this.chapters[chapterId];
        if (!chapter) return;
        
        logger.info(`📖 Chapter Unlocked: ${chapter.title}`);
        logger.info(`   ${chapter.description}`);
        
        // Unlock associated lore entries
        chapter.loreEntries.forEach(loreId => {
            this.discoverLore(loreId);
        });
        
        // Trigger chapter start event
        this.triggerStoryEvent({
            type: 'chapter_start',
            chapterId,
            title: chapter.title,
            description: chapter.description
        });
    }
    
    /**
     * Discover a lore entry
     */
    discoverLore(loreId) {
        const entry = this.lore[loreId];
        if (!entry || entry.discovered) return;
        
        entry.discovered = true;
        logger.info(`📚 Lore Discovered: ${entry.title}`);
        logger.info(`   ${entry.content.substring(0, 100)}...`);
        
        // Show notification to player
        this.showLoreNotification(entry);
    }
    
    /**
     * Show lore notification
     */
    showLoreNotification(entry) {
        // This would integrate with the UI system
        logger.info(`✨ New Lore Entry: ${entry.title} (${entry.category})`);
    }
    
    /**
     * Trigger story event
     */
    triggerStoryEvent(event) {
        this.activeEvents.push({
            ...event,
            timestamp: Date.now(),
            active: true
        });
        
        // Display narrative text
        this.displayNarrative(event);
    }
    
    /**
     * Display narrative text
     */
    displayNarrative(event) {
        logger.info(`\n═══════════════════════════════════════`);
        logger.info(`📜 ${event.title}`);
        logger.info(`───────────────────────────────────────`);
        logger.info(`   ${event.description}`);
        logger.info(`═══════════════════════════════════════\n`);
    }
    
    /**
     * Make story choice
     */
    makeChoice(choiceId, option) {
        const choice = {
            id: choiceId,
            option,
            timestamp: Date.now()
        };
        
        this.playerChoices.push(choice);
        
        // Apply consequences
        this.applyChoiceConsequences(choiceId, option);
        
        logger.info(`⚖️ Choice Made: ${choiceId} - ${option}`);
    }
    
    /**
     * Apply choice consequences
     */
    applyChoiceConsequences(choiceId, option) {
        // Different choices affect world state and reputation
        const consequences = {
            help_village: {
                light: { reputation: { light_faction: 10 }, alignment: 'light' },
                ignore: { reputation: { neutral_faction: 5 }, alignment: 'neutral' },
                attack: { reputation: { shadow_faction: 15 }, alignment: 'shadow' }
            },
            spare_enemy: {
                mercy: { reputation: { light_faction: 15 }, alignment: 'light' },
                kill: { reputation: { shadow_faction: 10 }, alignment: 'shadow' }
            },
            ancient_power: {
                accept: { reputation: { shadow_faction: 20 }, alignment: 'shadow' },
                refuse: { reputation: { light_faction: 20 }, alignment: 'light' }
            }
        };
        
        const consequence = consequences[choiceId]?.[option];
        if (!consequence) return;
        
        // Update reputation
        if (consequence.reputation) {
            Object.entries(consequence.reputation).forEach(([faction, value]) => {
                this.worldState.reputation[faction] += value;
            });
        }
        
        // Update alignment
        if (consequence.alignment) {
            this.updateAlignment(consequence.alignment);
        }
        
        // Record major decision
        this.worldState.majorDecisions.push({
            choiceId,
            option,
            timestamp: Date.now()
        });
    }
    
    /**
     * Update player alignment
     */
    updateAlignment(direction) {
        const alignments = ['shadow', 'neutral', 'light'];
        const currentIndex = alignments.indexOf(this.worldState.alignment);
        const targetIndex = alignments.indexOf(direction);
        
        // Gradually shift alignment
        if (targetIndex > currentIndex) {
            if (currentIndex < alignments.length - 1) {
                this.worldState.alignment = alignments[currentIndex + 1];
            }
        } else if (targetIndex < currentIndex) {
            if (currentIndex > 0) {
                this.worldState.alignment = alignments[currentIndex - 1];
            }
        }
        
        logger.info(`⚖️ Alignment shifted to: ${this.worldState.alignment}`);
    }
    
    /**
     * Get character dialogue
     */
    getCharacterDialogue(characterId, context = 'general') {
        const character = this.characters[characterId];
        if (!character || !character.unlocked) return null;
        
        // Select appropriate dialogue based on relationship and context
        const dialogueIndex = Math.min(
            Math.floor(character.relationship / 30),
            character.dialogues.length - 1
        );
        
        return {
            character: character.name,
            role: character.role,
            text: character.dialogues[dialogueIndex]
        };
    }
    
    /**
     * Improve character relationship
     */
    improveRelationship(characterId, amount) {
        const character = this.characters[characterId];
        if (!character) return;
        
        character.relationship = Math.min(100, character.relationship + amount);
        logger.info(`💖 Relationship with ${character.name}: ${character.relationship}%`);
        
        // Unlock new dialogues or events at certain thresholds
        if (character.relationship >= 50 && character.relationship - amount < 50) {
            logger.info(`✨ ${character.name} now trusts you more deeply`);
        }
    }
    
    /**
     * Get current chapter
     */
    getCurrentChapter(playerLevel) {
        let currentChapter = null;
        
        Object.values(this.chapters).forEach(chapter => {
            if (playerLevel >= chapter.unlockLevel && !chapter.completed) {
                if (!currentChapter || chapter.unlockLevel > currentChapter.unlockLevel) {
                    currentChapter = chapter;
                }
            }
        });
        
        return currentChapter;
    }
    
    /**
     * Complete chapter
     */
    completeChapter(chapterId) {
        const chapter = this.chapters[chapterId];
        if (!chapter) return;
        
        chapter.completed = true;
        logger.info(`✅ Chapter Completed: ${chapter.title}`);
        
        // Unlock next chapter if available
        const nextChapterId = this.getNextChapter(chapterId);
        if (nextChapterId) {
            const nextChapter = this.chapters[nextChapterId];
            if (nextChapter) {
                logger.info(`📖 Next Chapter Available: ${nextChapter.title}`);
            }
        }
    }
    
    /**
     * Get next chapter
     */
    getNextChapter(currentChapterId) {
        const chapterOrder = ['prologue', 'chapter1', 'chapter2', 'chapter3', 'chapter4'];
        const currentIndex = chapterOrder.indexOf(currentChapterId);
        return chapterOrder[currentIndex + 1];
    }
    
    /**
     * Get all discovered lore
     */
    getDiscoveredLore() {
        return Object.entries(this.lore)
            .filter(([_, entry]) => entry.discovered)
            .map(([id, entry]) => ({ id, ...entry }));
    }
    
    /**
     * Get lore by category
     */
    getLoreByCategory(category) {
        return this.getDiscoveredLore().filter(entry => entry.category === category);
    }
    
    /**
     * Get world state summary
     */
    getWorldState() {
        return {
            alignment: this.worldState.alignment,
            reputation: this.worldState.reputation,
            majorDecisions: this.worldState.majorDecisions.length,
            discoveredLore: this.getDiscoveredLore().length,
            completedChapters: Object.values(this.chapters).filter(c => c.completed).length
        };
    }
    
    /**
     * Update system
     */
    update(deltaTime, playerLevel) {
        // Check for chapter unlocks
        const currentChapter = this.getCurrentChapter(playerLevel);
        if (currentChapter && !currentChapter.unlocked) {
            this.unlockChapter(currentChapter.id);
            currentChapter.unlocked = true;
        }
        
        // Unlock characters based on level
        Object.entries(this.characters).forEach(([id, character]) => {
            if (!character.unlocked && playerLevel >= (character.unlockLevel || 0)) {
                character.unlocked = true;
                logger.info(`👤 New Character Unlocked: ${character.name} (${character.role})`);
            }
        });
        
        // Update active story events
        this.activeEvents = this.activeEvents.filter(event => {
            const age = Date.now() - event.timestamp;
            return age < 30000; // Events expire after 30 seconds
        });
    }
    
    /**
     * Get storyline progress
     */
    getProgress() {
        const totalChapters = Object.keys(this.chapters).length;
        const completedChapters = Object.values(this.chapters).filter(c => c.completed).length;
        const totalLore = Object.keys(this.lore).length;
        const discoveredLore = this.getDiscoveredLore().length;
        
        return {
            chapters: `${completedChapters}/${totalChapters}`,
            lore: `${discoveredLore}/${totalLore}`,
            choices: this.playerChoices.length,
            alignment: this.worldState.alignment,
            charactersUnlocked: Object.values(this.characters).filter(c => c.unlocked).length
        };
    }
}
