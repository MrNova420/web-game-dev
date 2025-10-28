# Dynasty of Emberveil - Simple Deployment Guide

## 🎮 Quick Start - Play Locally

### Method 1: Development Server (Recommended for Development)
```bash
# Install dependencies (first time only)
npm install

# Start development server with hot reload
npm run dev
```
Opens at `http://localhost:3000` - changes reload automatically

### Method 2: Production Build + Serve
```bash
# Build and serve production version
npm run serve:prod
```
Opens at `http://localhost:8000` - serves the optimized production build

### Method 3: Manual Build + Custom Server
```bash
# Build the game
npm run build

# Then use ANY of these to serve the dist folder:

# Option A: Node.js serve script
node serve.cjs 8080 prod

# Option B: Python
cd dist && python3 -m http.server 8080

# Option C: PHP
cd dist && php -S localhost:8080

# Option D: Any HTTP server pointed at dist/ folder
```

---

## 🌐 Deploy to Web (Actual Hosting)

The `dist/` folder contains the complete game ready to deploy. Just upload it to any web host.

### Method 1: Netlify Drop (Easiest)
1. Build the game: `npm run build`
2. Go to [drop.netlify.com](https://app.netlify.com/drop)
3. Drag and drop the `dist/` folder
4. Done! Get instant URL

### Method 2: Vercel
1. Build: `npm run build`
2. Install Vercel CLI: `npm install -g vercel`
3. Run: `vercel --prod`
4. Follow prompts

### Method 3: Any Web Host (Shared Hosting, VPS, etc.)
1. Build: `npm run build`
2. Upload entire `dist/` folder contents to your web root
3. Make sure `index.html` is accessible
4. Done!

**Supported Hosts:**
- Traditional web hosting (cPanel, Plesk, etc.)
- DigitalOcean, Linode, AWS, Google Cloud
- Static hosts: Cloudflare Pages, Firebase Hosting, Surge.sh
- Any server that can serve static HTML/JS files

---

## 🔧 Important: Ensuring New Version Deploys

### The Problem
If you see the old version after updating, it's a caching issue.

### The Solution (Already Included)

**1. Cache-Busting in HTML** (Already in index.html):
```html
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="0">
<meta name="game-version" content="2.0.0">
```

**2. Service Worker Cleanup** (Already in index.html):
- Automatically unregisters old service workers
- Clears old caches on page load

**3. Vite Build Hashing** (Already configured):
- Each build generates unique filenames: `index-CTXkk27W.js`
- Browser automatically downloads new files

### Force New Version to Load

**For Users:**
- Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- Or clear browser cache

**For Deployment:**
1. Build: `npm run build`
2. Upload the NEW `dist/` folder (replace old one completely)
3. Files have unique hashes, so browsers fetch new versions automatically

---

## 📂 What Gets Deployed

The `dist/` folder contains:
```
dist/
├── index.html          # Entry point
└── assets/
    ├── cannon-[hash].js   # Physics engine (84KB)
    ├── three-[hash].js    # 3D graphics (498KB)
    └── index-[hash].js    # Game code (659KB)
```

**Total Size:**
- Minified: ~1.24MB
- Gzipped: ~323KB (what users actually download)

---

## 🐛 Troubleshooting

### "Old version still showing"
1. **Build fresh**: `rm -rf dist && npm run build`
2. **Clear browser cache**: Ctrl+Shift+R
3. **Check file hashes**: Look at filenames in dist/assets/ - they should be different
4. **Verify upload**: Make sure you uploaded the NEW dist folder

### "Assets not loading (404)"
- Check that you uploaded the entire `dist/` folder contents
- Verify `index.html` and `assets/` folder are at the root of your web directory
- Don't put files in a subdirectory unless you configure it (see Advanced section)

### "Game won't start"
- Open browser console (F12) → Check for errors
- Verify all files in `dist/assets/` uploaded successfully
- Test locally first: `npm run preview`

### "Build fails"
```bash
# Clear everything and reinstall
rm -rf node_modules dist
npm install
npm run build
```

---

## 🚀 Deployment Workflow

### Every time you update the game:

1. **Make changes** to source files
2. **Test locally**: `npm run dev`
3. **Build production**: `npm run build`
4. **Test production locally**: `npm run preview` or `npm run serve:prod`
5. **Deploy**: Upload the `dist/` folder to your host
6. **Verify**: Visit your site and hard-refresh (Ctrl+Shift+R)

---

## 📊 Version Tracking

**Current Version**: 2.0.0 (see package.json)

**Update version before building**:
```bash
npm version patch  # 2.0.0 → 2.0.1
npm version minor  # 2.0.0 → 2.1.0
npm version major  # 2.0.0 → 3.0.0
```

Then build and deploy as usual.

---

## 🎯 Quick Deploy Checklist

- [ ] Run `npm run build`
- [ ] Verify dist/ folder exists and has new files
- [ ] Test locally with `npm run preview`
- [ ] Upload entire dist/ contents to web host
- [ ] Visit site and hard-refresh (Ctrl+Shift+R)
- [ ] Check console (F12) for any errors
- [ ] Verify game version in browser title

---

## 📝 Notes

- **Always build before deploying**: `npm run build` creates the production files
- **The dist/ folder is now tracked in git**: So the built version is always available
- **Each build has unique hashes**: Prevents caching issues automatically
- **No server backend needed**: This is a pure client-side game
- **Works on any static host**: Just needs to serve HTML/JS files

---

## 🆘 Still Having Issues?

1. Delete the dist/ folder: `rm -rf dist`
2. Rebuild: `npm run build`
3. Test locally: `npm run preview`
4. If local works but deployed doesn't:
   - Verify you uploaded the entire dist/ folder
   - Check file permissions on host
   - Clear browser cache completely
   - Try incognito/private window

