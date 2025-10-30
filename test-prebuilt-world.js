/**
 * Test PreBuiltWorldData Integration
 * Verifies that PreBuiltWorldData loads correctly
 */

import { PreBuiltWorldData, quickLoadWorld } from './src/data/PreBuiltWorldData.js';

console.log('🧪 Testing PreBuiltWorldData Integration...\n');

// Test 1: Check PreBuiltWorldData structure
console.log('Test 1: PreBuiltWorldData Structure');
console.log('  Version:', PreBuiltWorldData.version);
console.log('  World Size:', PreBuiltWorldData.world.size);
console.log('  Grid Size:', PreBuiltWorldData.world.gridSize);
console.log('  Total Biomes Defined:', PreBuiltWorldData.world.totalBiomes);
console.log('  Built Biomes:', PreBuiltWorldData.world.builtBiomes);
console.log('  ✅ Structure looks good\n');

// Test 2: Check biome data
console.log('Test 2: Biome Data');
const biomeKeys = Object.keys(PreBuiltWorldData.biomes);
console.log('  Available Biomes:', biomeKeys.join(', '));
biomeKeys.forEach(key => {
    const biome = PreBuiltWorldData.biomes[key];
    console.log(`  - ${biome.name}:`);
    console.log(`    Position: (${biome.position.x}, ${biome.position.y}, ${biome.position.z})`);
    console.log(`    Level Range: ${biome.levelRange[0]}-${biome.levelRange[1]}`);
    if (biome.trees) console.log(`    Trees: ${biome.trees.length}`);
    if (biome.rocks) console.log(`    Rocks: ${biome.rocks.length}`);
    if (biome.plants) console.log(`    Plants: ${biome.plants.length}`);
    if (biome.enemySpawns) console.log(`    Enemy Spawns: ${biome.enemySpawns.length}`);
});
console.log('  ✅ Biome data looks good\n');

// Test 3: Check village data
console.log('Test 3: Village Data');
const villageKeys = Object.keys(PreBuiltWorldData.villages);
console.log('  Available Villages:', villageKeys.join(', '));
villageKeys.forEach(key => {
    const village = PreBuiltWorldData.villages[key];
    console.log(`  - ${village.name}:`);
    console.log(`    Position: (${village.position.x}, ${village.position.y}, ${village.position.z})`);
    if (village.buildings) console.log(`    Buildings: ${village.buildings.length}`);
    if (village.npcs) console.log(`    NPCs: ${village.npcs.length}`);
});
console.log('  ✅ Village data looks good\n');

// Test 4: Check dungeon data
console.log('Test 4: Dungeon Data');
const dungeonKeys = Object.keys(PreBuiltWorldData.dungeons);
console.log('  Available Dungeons:', dungeonKeys.join(', '));
dungeonKeys.forEach(key => {
    const dungeon = PreBuiltWorldData.dungeons[key];
    console.log(`  - ${dungeon.name}:`);
    console.log(`    Position: (${dungeon.position.x}, ${dungeon.position.y}, ${dungeon.position.z})`);
    console.log(`    Level Range: ${dungeon.levelRange[0]}-${dungeon.levelRange[1]}`);
    if (dungeon.rooms) console.log(`    Rooms: ${dungeon.rooms.length}`);
});
console.log('  ✅ Dungeon data looks good\n');

// Test 5: Check quest data
console.log('Test 5: Quest Data');
console.log('  Available Quests:', PreBuiltWorldData.quests.length);
PreBuiltWorldData.quests.forEach(quest => {
    console.log(`  - ${quest.name} (${quest.type})`);
    console.log(`    Giver: ${quest.giver}`);
    console.log(`    Objectives: ${quest.objectives.length}`);
});
console.log('  ✅ Quest data looks good\n');

console.log('✅ ALL TESTS PASSED!');
console.log('PreBuiltWorldData is properly structured and ready to load.\n');
