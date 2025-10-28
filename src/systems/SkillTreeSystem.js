/**
 * SkillTreeSystem - Manages player skill trees and talents
 * Provides deep customization and build variety
 */

export class SkillTreeSystem {
    constructor(engine) {
        this.engine = engine;
        this.skillTrees = this.createSkillTrees();
        this.unlockedSkills = new Set();
        this.skillPoints = 0;
        
        // UI elements
        this.skillPanel = null;
        
        this.init();
        console.log('🌳 Skill Tree System initialized');
    }
    
    init() {
        this.createSkillUI();
        
        // Player earns 1 skill point per level
        this.updateSkillPoints();
    }
    
    createSkillTrees() {
        return {
            // Combat Tree - Offensive abilities
            combat: {
                name: '⚔️ Combat Mastery',
                color: '#ff0844',
                skills: {
                    power_boost: {
                        id: 'power_boost',
                        name: 'Power Boost',
                        description: 'Increases attack damage by 15%',
                        maxRank: 3,
                        cost: 1,
                        prereq: null,
                        effect: (rank) => ({ attackMultiplier: 1 + (rank * 0.15) })
                    },
                    critical_strike: {
                        id: 'critical_strike',
                        name: 'Critical Strike',
                        description: 'Chance to deal double damage',
                        maxRank: 3,
                        cost: 1,
                        prereq: 'power_boost',
                        effect: (rank) => ({ critChance: rank * 0.1 })
                    },
                    berserker_rage: {
                        id: 'berserker_rage',
                        name: 'Berserker Rage',
                        description: 'Deal more damage at low HP',
                        maxRank: 1,
                        cost: 2,
                        prereq: 'critical_strike',
                        effect: (rank) => ({ berserkerMode: true })
                    },
                    area_mastery: {
                        id: 'area_mastery',
                        name: 'Area Mastery',
                        description: 'Increase AOE ability range by 30%',
                        maxRank: 2,
                        cost: 1,
                        prereq: 'power_boost',
                        effect: (rank) => ({ aoeRangeMultiplier: 1 + (rank * 0.3) })
                    },
                    execute: {
                        id: 'execute',
                        name: 'Execute',
                        description: 'Deal massive damage to enemies below 20% HP',
                        maxRank: 1,
                        cost: 2,
                        prereq: 'area_mastery',
                        effect: (rank) => ({ executeThreshold: 0.2 })
                    }
                }
            },
            
            // Defense Tree - Survivability
            defense: {
                name: '🛡️ Guardian\'s Path',
                color: '#0099ff',
                skills: {
                    vitality: {
                        id: 'vitality',
                        name: 'Vitality',
                        description: 'Increases max HP by 20%',
                        maxRank: 3,
                        cost: 1,
                        prereq: null,
                        effect: (rank) => ({ hpMultiplier: 1 + (rank * 0.2) })
                    },
                    iron_skin: {
                        id: 'iron_skin',
                        name: 'Iron Skin',
                        description: 'Reduces damage taken by 10%',
                        maxRank: 3,
                        cost: 1,
                        prereq: 'vitality',
                        effect: (rank) => ({ damageReduction: rank * 0.1 })
                    },
                    regeneration: {
                        id: 'regeneration',
                        name: 'Regeneration',
                        description: 'Slowly regenerate HP in combat',
                        maxRank: 3,
                        cost: 1,
                        prereq: 'vitality',
                        effect: (rank) => ({ hpRegen: rank * 0.5 })
                    },
                    last_stand: {
                        id: 'last_stand',
                        name: 'Last Stand',
                        description: 'Survive lethal damage once per floor',
                        maxRank: 1,
                        cost: 3,
                        prereq: 'iron_skin',
                        effect: (rank) => ({ lastStand: true })
                    },
                    barrier: {
                        id: 'barrier',
                        name: 'Arcane Barrier',
                        description: 'Create a shield that absorbs damage',
                        maxRank: 2,
                        cost: 2,
                        prereq: 'regeneration',
                        effect: (rank) => ({ shieldStrength: rank * 50 })
                    }
                }
            },
            
            // Magic Tree - Spell power and resource
            magic: {
                name: '✨ Mystical Arts',
                color: '#9d4edd',
                skills: {
                    mana_pool: {
                        id: 'mana_pool',
                        name: 'Expanded Mana Pool',
                        description: 'Increases max MP by 25%',
                        maxRank: 3,
                        cost: 1,
                        prereq: null,
                        effect: (rank) => ({ mpMultiplier: 1 + (rank * 0.25) })
                    },
                    spell_power: {
                        id: 'spell_power',
                        name: 'Spell Power',
                        description: 'Increases ability damage by 20%',
                        maxRank: 3,
                        cost: 1,
                        prereq: 'mana_pool',
                        effect: (rank) => ({ spellPowerMultiplier: 1 + (rank * 0.2) })
                    },
                    mana_efficiency: {
                        id: 'mana_efficiency',
                        name: 'Mana Efficiency',
                        description: 'Reduces ability costs by 15%',
                        maxRank: 3,
                        cost: 1,
                        prereq: 'mana_pool',
                        effect: (rank) => ({ manaCostReduction: rank * 0.15 })
                    },
                    spell_echo: {
                        id: 'spell_echo',
                        name: 'Spell Echo',
                        description: '20% chance to cast abilities twice',
                        maxRank: 1,
                        cost: 3,
                        prereq: 'spell_power',
                        effect: (rank) => ({ spellEchoChance: 0.2 })
                    },
                    arcane_surge: {
                        id: 'arcane_surge',
                        name: 'Arcane Surge',
                        description: 'Rapidly regenerate MP for 5 seconds',
                        maxRank: 1,
                        cost: 2,
                        prereq: 'mana_efficiency',
                        effect: (rank) => ({ arcaneSurge: true })
                    }
                }
            },
            
            // Utility Tree - Movement and quality of life
            utility: {
                name: '🌟 Wielder\'s Gift',
                color: '#52b788',
                skills: {
                    swift_footed: {
                        id: 'swift_footed',
                        name: 'Swift Footed',
                        description: 'Increases movement speed by 15%',
                        maxRank: 3,
                        cost: 1,
                        prereq: null,
                        effect: (rank) => ({ speedMultiplier: 1 + (rank * 0.15) })
                    },
                    essence_collector: {
                        id: 'essence_collector',
                        name: 'Essence Collector',
                        description: 'Gain 25% more experience',
                        maxRank: 3,
                        cost: 1,
                        prereq: 'swift_footed',
                        effect: (rank) => ({ expMultiplier: 1 + (rank * 0.25) })
                    },
                    treasure_hunter: {
                        id: 'treasure_hunter',
                        name: 'Treasure Hunter',
                        description: 'Increases item drop rate by 20%',
                        maxRank: 3,
                        cost: 1,
                        prereq: 'swift_footed',
                        effect: (rank) => ({ dropRateBonus: rank * 0.2 })
                    },
                    lucky_find: {
                        id: 'lucky_find',
                        name: 'Lucky Find',
                        description: 'Higher chance for rare items',
                        maxRank: 2,
                        cost: 2,
                        prereq: 'treasure_hunter',
                        effect: (rank) => ({ rarityBonus: rank * 0.15 })
                    },
                    second_wind: {
                        id: 'second_wind',
                        name: 'Second Wind',
                        description: 'Cooldowns refresh on floor clear',
                        maxRank: 1,
                        cost: 2,
                        prereq: 'essence_collector',
                        effect: (rank) => ({ secondWind: true })
                    }
                }
            }
        };
    }
    
    createSkillUI() {
        // Create skill tree toggle button
        const toggleButton = document.createElement('div');
        toggleButton.id = 'skilltree-toggle';
        toggleButton.innerHTML = '🌳 Skills (K)';
        toggleButton.style.cssText = `
            position: absolute;
            bottom: 100px;
            right: 350px;
            background: linear-gradient(135deg, #2d0a4e, #4a0e7a);
            border: 2px solid #9d4edd;
            border-radius: 10px;
            padding: 10px 20px;
            color: #fff;
            cursor: pointer;
            font-weight: bold;
            pointer-events: auto;
            z-index: 100;
        `;
        toggleButton.addEventListener('click', () => this.togglePanel());
        toggleButton.addEventListener('mouseenter', () => {
            toggleButton.style.background = 'linear-gradient(135deg, #4a0e7a, #9d4edd)';
        });
        toggleButton.addEventListener('mouseleave', () => {
            toggleButton.style.background = 'linear-gradient(135deg, #2d0a4e, #4a0e7a)';
        });
        document.getElementById('ui-overlay').appendChild(toggleButton);
        
        // Create skill tree panel
        this.skillPanel = document.createElement('div');
        this.skillPanel.id = 'skilltree-panel';
        this.skillPanel.style.cssText = `
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 80%;
            max-width: 900px;
            max-height: 80vh;
            overflow-y: auto;
            background: rgba(0, 0, 0, 0.95);
            border: 3px solid #9d4edd;
            border-radius: 15px;
            padding: 20px;
            color: #fff;
            display: none;
            pointer-events: auto;
            z-index: 1000;
            box-shadow: 0 0 50px rgba(157, 78, 221, 0.5);
        `;
        document.getElementById('ui-overlay').appendChild(this.skillPanel);
        
        this.updateSkillUI();
        
        // Add keyboard shortcut
        document.addEventListener('keydown', (e) => {
            if (e.key === 'k' || e.key === 'K') {
                this.togglePanel();
            }
        });
    }
    
    togglePanel() {
        const isVisible = this.skillPanel.style.display === 'block';
        this.skillPanel.style.display = isVisible ? 'none' : 'block';
        if (!isVisible) {
            this.updateSkillUI();
        }
    }
    
    updateSkillUI() {
        if (!this.skillPanel) return;
        
        this.updateSkillPoints();
        
        let html = '<div style="text-align: center; margin-bottom: 20px;">';
        html += '<h2 style="color: #c77dff; margin-bottom: 10px;">🌳 Skill Trees</h2>';
        html += `<p style="color: #ffd60a; font-size: 1.2em; font-weight: bold;">Skill Points Available: ${this.skillPoints}</p>`;
        html += '<p style="color: #aaa; font-size: 0.9em;">Click on skills to unlock them. Some skills require prerequisites.</p>';
        html += '</div>';
        
        // Display each tree
        Object.entries(this.skillTrees).forEach(([treeId, tree]) => {
            html += `<div style="margin-bottom: 30px; border: 2px solid ${tree.color}; border-radius: 10px; padding: 15px;">`;
            html += `<h3 style="color: ${tree.color}; margin-bottom: 15px;">${tree.name}</h3>`;
            html += '<div style="display: flex; flex-wrap: wrap; gap: 10px;">';
            
            Object.values(tree.skills).forEach(skill => {
                const currentRank = this.getSkillRank(skill.id);
                const canUnlock = this.canUnlockSkill(skill);
                const isMaxed = currentRank >= skill.maxRank;
                
                let bgColor = 'rgba(45, 10, 78, 0.5)';
                if (currentRank > 0) {
                    bgColor = `rgba(${parseInt(tree.color.slice(1, 3), 16)}, ${parseInt(tree.color.slice(3, 5), 16)}, ${parseInt(tree.color.slice(5, 7), 16)}, 0.3)`;
                }
                
                const opacity = (!canUnlock && currentRank === 0) ? 0.5 : 1;
                const cursor = (canUnlock || currentRank > 0) ? 'pointer' : 'not-allowed';
                
                html += `
                    <div 
                        data-skill-id="${skill.id}" 
                        data-tree-id="${treeId}"
                        class="skill-node"
                        style="
                            background: ${bgColor};
                            border: 2px solid ${tree.color};
                            border-radius: 10px;
                            padding: 12px;
                            width: 180px;
                            cursor: ${cursor};
                            opacity: ${opacity};
                            transition: all 0.3s;
                        "
                    >
                        <div style="font-weight: bold; color: ${tree.color}; margin-bottom: 5px;">${skill.name}</div>
                        <div style="color: #aaa; font-size: 0.85em; margin-bottom: 8px;">${skill.description}</div>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="color: ${isMaxed ? '#52b788' : '#ffd60a'};">
                                ${currentRank}/${skill.maxRank}
                            </span>
                            <span style="color: #e0aaff; font-size: 0.9em;">
                                Cost: ${skill.cost} ${skill.cost === 1 ? 'point' : 'points'}
                            </span>
                        </div>
                        ${skill.prereq ? `<div style="color: #888; font-size: 0.8em; margin-top: 5px;">Requires: ${this.skillTrees[treeId].skills[skill.prereq].name}</div>` : ''}
                    </div>
                `;
            });
            
            html += '</div></div>';
        });
        
        html += '<div style="text-align: center; margin-top: 20px;">';
        html += '<button id="reset-skills-btn" style="background: linear-gradient(135deg, #ff0844, #ff6b9d); border: none; border-radius: 8px; padding: 10px 20px; color: #fff; font-weight: bold; cursor: pointer; font-size: 1em;">Reset All Skills (Free)</button>';
        html += '</div>';
        
        this.skillPanel.innerHTML = html;
        
        // Add click handlers for skill nodes
        const skillNodes = this.skillPanel.querySelectorAll('.skill-node');
        skillNodes.forEach(node => {
            node.addEventListener('click', () => {
                const skillId = node.getAttribute('data-skill-id');
                const treeId = node.getAttribute('data-tree-id');
                this.unlockSkill(treeId, skillId);
            });
            
            // Hover effect
            node.addEventListener('mouseenter', () => {
                if (node.style.cursor === 'pointer') {
                    node.style.transform = 'scale(1.05)';
                    node.style.boxShadow = `0 0 20px ${this.skillTrees[node.getAttribute('data-tree-id')].color}`;
                }
            });
            node.addEventListener('mouseleave', () => {
                node.style.transform = 'scale(1)';
                node.style.boxShadow = 'none';
            });
        });
        
        // Add reset button handler
        const resetBtn = document.getElementById('reset-skills-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetAllSkills());
        }
    }
    
    updateSkillPoints() {
        if (!this.engine.player) return;
        
        const level = this.engine.player.stats.level;
        const spentPoints = this.getSpentPoints();
        this.skillPoints = level - spentPoints;
    }
    
    getSpentPoints() {
        let total = 0;
        Object.values(this.skillTrees).forEach(tree => {
            Object.values(tree.skills).forEach(skill => {
                const rank = this.getSkillRank(skill.id);
                total += rank * skill.cost;
            });
        });
        return total;
    }
    
    getSkillRank(skillId) {
        // Count how many times this skill has been unlocked
        let count = 0;
        this.unlockedSkills.forEach(id => {
            if (id.startsWith(skillId + '_')) {
                count++;
            }
        });
        return count;
    }
    
    canUnlockSkill(skill) {
        // Check if player has enough skill points
        if (this.skillPoints < skill.cost) return false;
        
        // Check if skill is already maxed
        if (this.getSkillRank(skill.id) >= skill.maxRank) return false;
        
        // Check prerequisite
        if (skill.prereq) {
            const prereqRank = this.getSkillRank(skill.prereq);
            if (prereqRank === 0) return false;
        }
        
        return true;
    }
    
    unlockSkill(treeId, skillId) {
        const skill = this.skillTrees[treeId].skills[skillId];
        
        if (!this.canUnlockSkill(skill)) {
            console.log('Cannot unlock skill:', skill.name);
            return false;
        }
        
        // Add skill to unlocked set with rank suffix
        const currentRank = this.getSkillRank(skillId);
        this.unlockedSkills.add(`${skillId}_${currentRank + 1}`);
        
        console.log(`🌳 Unlocked: ${skill.name} (Rank ${currentRank + 1})`);
        
        // Apply skill effect
        this.applySkillEffect(skill, currentRank + 1);
        
        // Update UI
        this.updateSkillUI();
        
        // Play sound
        if (this.engine.audioSystem) {
            this.engine.audioSystem.playSoundEffect('level_up');
        }
        
        // Save
        if (this.engine.saveSystem) {
            this.engine.saveSystem.saveGame('Skill unlocked');
        }
        
        return true;
    }
    
    applySkillEffect(skill, rank) {
        const effect = skill.effect(rank);
        const player = this.engine.player;
        
        // Apply stat multipliers
        if (effect.hpMultiplier) {
            const oldMax = player.stats.maxHp;
            player.stats.maxHp = Math.floor(player.baseStats.maxHp * this.getTotalMultiplier('hp'));
            player.stats.hp += (player.stats.maxHp - oldMax); // Add difference to current HP
        }
        
        if (effect.mpMultiplier) {
            const oldMax = player.stats.maxMp;
            player.stats.maxMp = Math.floor(player.baseStats.maxMp * this.getTotalMultiplier('mp'));
            player.stats.mp += (player.stats.maxMp - oldMax);
        }
        
        // Store effects for combat calculations
        if (!player.skillEffects) {
            player.skillEffects = {};
        }
        
        Object.assign(player.skillEffects, effect);
    }
    
    getTotalMultiplier(stat) {
        let multiplier = 1.0;
        
        this.unlockedSkills.forEach(unlockedId => {
            const [skillId] = unlockedId.split('_');
            
            // Find skill in trees
            for (const tree of Object.values(this.skillTrees)) {
                const skill = tree.skills[skillId];
                if (skill) {
                    const rank = parseInt(unlockedId.split('_')[1]);
                    const effect = skill.effect(rank);
                    
                    if (stat === 'hp' && effect.hpMultiplier) {
                        multiplier *= effect.hpMultiplier;
                    }
                    if (stat === 'mp' && effect.mpMultiplier) {
                        multiplier *= effect.mpMultiplier;
                    }
                    break;
                }
            }
        });
        
        return multiplier;
    }
    
    resetAllSkills() {
        this.unlockedSkills.clear();
        
        // Reset player to base stats (will be recalculated)
        if (this.engine.player) {
            this.engine.player.skillEffects = {};
        }
        
        this.updateSkillUI();
        
        console.log('🔄 All skills reset');
        
        if (this.engine.saveSystem) {
            this.engine.saveSystem.saveGame('Skills reset');
        }
    }
    
    // Get active skill effects for combat calculations
    getActiveEffects() {
        const effects = {
            attackMultiplier: 1.0,
            critChance: 0,
            aoeRangeMultiplier: 1.0,
            damageReduction: 0,
            hpRegen: 0,
            spellPowerMultiplier: 1.0,
            manaCostReduction: 0,
            speedMultiplier: 1.0,
            expMultiplier: 1.0,
            dropRateBonus: 0,
            rarityBonus: 0,
            berserkerMode: false,
            executeThreshold: 0,
            lastStand: false,
            shieldStrength: 0,
            spellEchoChance: 0,
            arcaneSurge: false,
            secondWind: false,
            luckyFind: false
        };
        
        this.unlockedSkills.forEach(unlockedId => {
            const [skillId] = unlockedId.split('_');
            
            for (const tree of Object.values(this.skillTrees)) {
                const skill = tree.skills[skillId];
                if (skill) {
                    const rank = parseInt(unlockedId.split('_')[1]);
                    const skillEffect = skill.effect(rank);
                    
                    // Merge effects
                    Object.keys(skillEffect).forEach(key => {
                        if (typeof skillEffect[key] === 'number') {
                            if (key.includes('Multiplier')) {
                                effects[key] *= skillEffect[key];
                            } else {
                                effects[key] += skillEffect[key];
                            }
                        } else {
                            effects[key] = skillEffect[key];
                        }
                    });
                    break;
                }
            }
        });
        
        return effects;
    }
    
    // Save/Load
    getSaveData() {
        return {
            unlockedSkills: Array.from(this.unlockedSkills),
            skillPoints: this.skillPoints
        };
    }
    
    loadSaveData(data) {
        if (data.unlockedSkills) {
            this.unlockedSkills = new Set(data.unlockedSkills);
            
            // Reapply all skill effects
            this.unlockedSkills.forEach(unlockedId => {
                const [skillId, rankStr] = unlockedId.split('_');
                const rank = parseInt(rankStr);
                
                for (const tree of Object.values(this.skillTrees)) {
                    const skill = tree.skills[skillId];
                    if (skill) {
                        this.applySkillEffect(skill, rank);
                        break;
                    }
                }
            });
        }
        
        this.updateSkillPoints();
        this.updateSkillUI();
    }
}
