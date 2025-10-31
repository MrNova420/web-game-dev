#!/usr/bin/env node

/**
 * Game Loading Verification Script
 * Verifies that the game bundles are built correctly and server serves them
 */

import { existsSync, statSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔍 GAME LOADING VERIFICATION');
console.log('═'.repeat(80));

let allTestsPassed = true;

// Test 1: Check if dist folder exists
console.log('\n📁 Test 1: Checking dist folder...');
const distPath = join(__dirname, 'dist');
if (existsSync(distPath)) {
    console.log('   ✅ dist folder exists');
} else {
    console.log('   ❌ dist folder missing - run "npm run build"');
    allTestsPassed = false;
}

// Test 2: Check bundle sizes
console.log('\n📦 Test 2: Checking bundle sizes...');
const expectedBundles = [
    { name: 'index.html', minSize: 40000, maxSize: 60000 }, // 40-60 KB
    { pattern: 'index-*.js', minSize: 1000000, maxSize: 1500000 }, // 1.0-1.5 MB
    { pattern: 'three-*.js', minSize: 500000, maxSize: 700000 }, // 500-700 KB
    { pattern: 'cannon-*.js', minSize: 70000, maxSize: 100000 } // 70-100 KB
];

const fs = await import('fs');
const assetsPath = join(distPath, 'assets');

for (const bundle of expectedBundles) {
    if (bundle.pattern) {
        // Find file matching pattern
        if (existsSync(assetsPath)) {
            const files = fs.readdirSync(assetsPath);
            const match = files.find(f => {
                const regex = new RegExp(bundle.pattern.replace('*', '.*'));
                return regex.test(f);
            });
            
            if (match) {
                const filePath = join(assetsPath, match);
                const stats = statSync(filePath);
                const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
                
                if (stats.size >= bundle.minSize && stats.size <= bundle.maxSize) {
                    console.log(`   ✅ ${match}: ${sizeMB} MB`);
                } else {
                    console.log(`   ⚠️  ${match}: ${sizeMB} MB (expected ${(bundle.minSize/1024/1024).toFixed(2)}-${(bundle.maxSize/1024/1024).toFixed(2)} MB)`);
                }
            } else {
                console.log(`   ❌ No file matching ${bundle.pattern}`);
                allTestsPassed = false;
            }
        }
    } else {
        // Check specific file
        const filePath = join(distPath, bundle.name);
        if (existsSync(filePath)) {
            const stats = statSync(filePath);
            const sizeKB = (stats.size / 1024).toFixed(2);
            
            if (stats.size >= bundle.minSize && stats.size <= bundle.maxSize) {
                console.log(`   ✅ ${bundle.name}: ${sizeKB} KB`);
            } else {
                console.log(`   ⚠️  ${bundle.name}: ${sizeKB} KB (expected ${(bundle.minSize/1024).toFixed(0)}-${(bundle.maxSize/1024).toFixed(0)} KB)`);
            }
        } else {
            console.log(`   ❌ ${bundle.name} missing`);
            allTestsPassed = false;
        }
    }
}

// Test 3: Calculate total bundle size
console.log('\n📊 Test 3: Total bundle size...');
if (existsSync(assetsPath)) {
    const files = fs.readdirSync(assetsPath);
    let totalSize = 0;
    
    files.forEach(file => {
        if (file.endsWith('.js')) {
            const stats = statSync(join(assetsPath, file));
            totalSize += stats.size;
        }
    });
    
    const totalMB = (totalSize / (1024 * 1024)).toFixed(2);
    console.log(`   Total JS bundle size: ${totalMB} MB`);
    
    if (totalSize >= 1700000 && totalSize <= 2100000) {  // 1.7 - 2.1 MB
        console.log(`   ✅ Total size is in expected range (1.7-2.1 MB)`);
    } else {
        console.log(`   ⚠️  Total size outside expected range (got ${totalMB} MB, expected 1.7-2.1 MB)`);
    }
}

// Test 4: Check if server can serve files (optional - only if server is running)
console.log('\n🌐 Test 4: Checking if server is running...');
const testServer = () => {
    return new Promise((resolve) => {
        const req = http.get('http://localhost:3000/health', (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    if (json.status === 'ok') {
                        console.log('   ✅ Server is running and responding');
                        resolve(true);
                    } else {
                        console.log('   ⚠️  Server responding but status not ok');
                        resolve(false);
                    }
                } catch (e) {
                    console.log('   ⚠️  Server responding but invalid JSON');
                    resolve(false);
                }
            });
        });
        
        req.on('error', () => {
            console.log('   ℹ️  Server not running (run "npm start" to test)');
            resolve(null); // null means server not running, but that's ok
        });
        
        req.setTimeout(2000, () => {
            req.destroy();
            console.log('   ⚠️  Server timeout');
            resolve(false);
        });
    });
};

const serverRunning = await testServer();

// Final summary
console.log('\n' + '═'.repeat(80));
if (allTestsPassed && serverRunning !== false) {
    console.log('✅ ALL CHECKS PASSED - Game should load correctly!');
    console.log('\n💡 To start the game, run: npm start');
    console.log('   Then open: http://localhost:3000');
    process.exit(0);
} else {
    console.log('⚠️  SOME CHECKS FAILED - See details above');
    if (!existsSync(distPath)) {
        console.log('\n💡 Run "npm run build" to build the game');
    }
    process.exit(1);
}
