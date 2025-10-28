# Dynasty of Emberveil - Complete Deployment Instructions

## 🚀 Automated GitHub Pages Deployment (Recommended)

### Setup (One-Time)

1. **Enable GitHub Pages** in your repository:
   - Go to Settings → Pages
   - Source: "GitHub Actions"
   - Save

2. **Push to main/master branch**:
   ```bash
   git add .
   git commit -m "Enable automated deployment"
   git push origin main
   ```

3. **Automatic Deployment**:
   - Every push to `main` or `master` automatically triggers deployment
   - Build process runs via GitHub Actions
   - Site deploys to: `https://[username].github.io/web-game-dev/`
   - Check Actions tab to monitor deployment progress

### Manual Trigger
You can also manually trigger deployment:
- Go to Actions tab
- Select "Deploy to GitHub Pages" workflow
- Click "Run workflow"

### Deployment Status
- ✅ Green checkmark = Successfully deployed
- ❌ Red X = Deployment failed (check logs)
- 🟡 Yellow dot = In progress

---

## 🏠 Local Development

### Quick Start
```bash
# Install dependencies (first time only)
npm install

# Start development server with hot reload
npm run dev
```

The game will open at `http://localhost:3000` with automatic reloading on file changes.

### Local Production Build
```bash
# Build for production
npm run build

# Preview the production build locally
npm run preview
```

Preview runs at `http://localhost:4173`

---

## 🌐 Alternative Deployment Methods

### 1. Netlify (Easy, Free Tier Available)

**Via GitHub Integration:**
1. Sign up at [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub repository
4. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Base directory: (leave empty)
5. Click "Deploy site"

**Via CLI:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the game
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

### 2. Vercel (Easy, Free Tier Available)

**Via GitHub Integration:**
1. Sign up at [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Vercel auto-detects Vite config
4. Click "Deploy"

**Via CLI:**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### 3. Static File Hosting

#### GitHub Pages (Manual)
```bash
# Build the game
npm run build

# Install gh-pages
npm install -g gh-pages

# Deploy to gh-pages branch
gh-pages -d dist
```

#### Any Static Host (Cloudflare Pages, AWS S3, etc.)
```bash
# Build the game
npm run build

# Upload the entire 'dist' folder to your static host
# Make sure to set 'dist/index.html' as the entry point
```

### 4. Docker Deployment

**Dockerfile:**
```dockerfile
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Deploy:**
```bash
# Build Docker image
docker build -t dynasty-of-emberveil .

# Run container
docker run -d -p 8080:80 dynasty-of-emberveil
```

### 5. Custom Server (Node.js)

Use the included `serve.js`:
```bash
# Build first
npm run build

# Serve on custom port
node serve.js 8080 prod
```

Or use npm scripts:
```bash
npm run serve:prod  # Serves on port 8000
```

---

## 🔧 Configuration for Different Deployment Targets

### For GitHub Pages
**vite.config.js** is already configured with:
```javascript
base: process.env.NODE_ENV === 'production' ? '/web-game-dev/' : '/'
```

### For Custom Domain or Root Deployment
Edit `vite.config.js`:
```javascript
base: '/'  // Always use root
```

Then rebuild:
```bash
npm run build
```

### For Subdirectory Deployment
Edit `vite.config.js`:
```javascript
base: '/your-subdirectory/'
```

---

## 🐛 Troubleshooting

### Issue: Old version still showing after deployment

**Solution 1: Clear Browser Cache**
- Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- Or clear browser cache manually

**Solution 2: Verify Deployment**
- Check GitHub Actions logs for errors
- Verify dist folder was uploaded
- Check GitHub Pages URL directly

**Solution 3: Cache-Control Headers**
The game includes cache-busting meta tags:
```html
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="0">
```

And service worker cleanup in index.html.

### Issue: Build fails

**Check Node version:**
```bash
node --version  # Should be 18+ or 20+
```

**Clear cache and reinstall:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Issue: Assets not loading (404 errors)

**Check base path in vite.config.js:**
- For GitHub Pages: `/repository-name/`
- For root deployment: `/`

**Rebuild after changing base:**
```bash
npm run build
```

### Issue: Game not starting

**Check browser console (F12):**
- Look for JavaScript errors
- Check Network tab for failed requests
- Ensure all assets loaded successfully

**Test locally first:**
```bash
npm run preview
```

---

## 📊 Monitoring Deployment

### GitHub Actions
- Go to repository → Actions tab
- View workflow runs and logs
- Download artifacts if needed

### Build Metrics
Current build output:
- **Size**: ~1.24MB JavaScript
- **Gzipped**: ~324KB
- **Assets**: Optimized and chunked

### Performance
- **Target**: 60 FPS on medium settings
- **Load Time**: ~2-5 seconds (depends on connection)
- **Compatibility**: Modern browsers (Chrome 90+, Firefox 88+, Edge 90+)

---

## 🔄 Update Workflow

To deploy updates:

1. **Make your changes** in the code
2. **Test locally**:
   ```bash
   npm run dev
   ```
3. **Build and test**:
   ```bash
   npm run build
   npm run preview
   ```
4. **Commit and push**:
   ```bash
   git add .
   git commit -m "Your update description"
   git push origin main
   ```
5. **Automatic deployment** starts immediately
6. **Verify** at your GitHub Pages URL (usually takes 1-2 minutes)

---

## 🎮 Version Management

**Current Version**: Check `package.json` → version field

**Update version**:
```bash
npm version patch  # 1.0.0 → 1.0.1
npm version minor  # 1.0.0 → 1.1.0
npm version major  # 1.0.0 → 2.0.0
```

**Version in game**: Updated in `index.html`:
```html
<meta name="game-version" content="2.0.0">
```

---

## 📝 Checklist for Production Deployment

- [ ] All features tested locally
- [ ] Build completes without errors
- [ ] No console errors in browser
- [ ] Game loads and runs smoothly
- [ ] All assets loading correctly
- [ ] Performance meets targets (60 FPS)
- [ ] Mobile/tablet tested (if applicable)
- [ ] Documentation updated
- [ ] Version number updated
- [ ] Committed and pushed to main branch
- [ ] GitHub Actions workflow completed successfully
- [ ] Live site verified and tested

---

## 🆘 Support

If deployment issues persist:
1. Check GitHub Actions logs for specific errors
2. Verify GitHub Pages is enabled in repository settings
3. Ensure repository is public (or GitHub Pages enabled for private repos)
4. Clear browser cache completely
5. Try accessing from incognito/private window
6. Check browser console for errors

**Note**: It may take 1-5 minutes for changes to propagate to GitHub Pages after a successful deployment.
