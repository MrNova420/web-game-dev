#!/usr/bin/env node

/**
 * Update build timestamp in index.html to force cache invalidation
 * Run this before each build to ensure browsers load the latest version
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const indexPath = join(__dirname, 'index.html');
const timestamp = Date.now();

console.log('🔄 Updating build timestamp...');

try {
    let content = readFileSync(indexPath, 'utf8');
    
    // Replace the placeholder with actual timestamp
    content = content.replace(
        'BUILD_TIMESTAMP_PLACEHOLDER',
        timestamp.toString()
    );
    
    writeFileSync(indexPath, content, 'utf8');
    
    console.log(`✅ Build timestamp updated: ${timestamp}`);
    console.log(`📅 Date: ${new Date(timestamp).toISOString()}`);
} catch (error) {
    console.error('❌ Failed to update timestamp:', error.message);
    process.exit(1);
}
