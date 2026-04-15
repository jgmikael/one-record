#!/usr/bin/env node

/**
 * Post-install script
 * Ensures necessary directories and symlinks exist
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Running post-install setup...');

// Create data directory
const dataDir = path.join(__dirname, '..', 'apps', 'api', 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log('  ✓ Created data directory');
}

// Create public directory for API
const publicDir = path.join(__dirname, '..', 'apps', 'api', 'public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
    console.log('  ✓ Created public directory');
}

// Create samples symlink (for serving samples via API)
const samplesLink = path.join(publicDir, 'samples');
const samplesTarget = path.join(__dirname, '..', 'samples');
try {
    if (!fs.existsSync(samplesLink)) {
        fs.symlinkSync(path.relative(publicDir, samplesTarget), samplesLink);
        console.log('  ✓ Created samples symlink');
    }
} catch (err) {
    // Symlink might fail on Windows, copy instead
    if (err.code === 'EPERM' || err.code === 'EEXIST') {
        console.log('  ⚠ Symlink creation skipped (not required)');
    } else {
        console.error('  ⚠ Warning: Could not create symlink:', err.message);
    }
}

// Copy web files to API public directory
const webPublic = path.join(__dirname, '..', 'apps', 'web', 'public');
const apiPublic = path.join(__dirname, '..', 'apps', 'api', 'public');

function copyRecursive(src, dest) {
    if (!fs.existsSync(src)) return;
    
    const stat = fs.statSync(src);
    if (stat.isDirectory()) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        const files = fs.readdirSync(src);
        files.forEach(file => {
            copyRecursive(path.join(src, file), path.join(dest, file));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

// Copy web files
const webFiles = ['index.html', 'styles.css', 'app.js'];
webFiles.forEach(file => {
    const src = path.join(webPublic, file);
    const dest = path.join(apiPublic, file);
    if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
    }
});
console.log('  ✓ Copied web files');

console.log('✅ Post-install complete');
