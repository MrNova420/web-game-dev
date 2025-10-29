# Dynasty of Emberveil - Complete Deployment Guide

## Table of Contents
1. [Local Development](#local-development)
2. [Local Network (LAN) Deployment](#local-network-lan-deployment)
3. [Beta Testing Setup](#beta-testing-setup)
4. [Production Deployment](#production-deployment)
5. [Platform-Specific Guides](#platform-specific-guides)
6. [Multi-Device Support](#multi-device-support)
7. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Local Development

### Prerequisites
- Node.js 18+ installed
- Git installed
- Modern web browser

### Setup Steps
```bash
# Clone repository
git clone https://github.com/MrNova420/web-game-dev.git
cd web-game-dev

# Install dependencies
npm install

# Start development server
npm run dev
```

Server will start at `http://localhost:5173`

---

## Local Network (LAN) Deployment

### For Beta Testing in Your Household

#### Option 1: Using Vite Dev Server (Recommended for Testing)

**Step 1: Configure Vite for Network Access**

Edit `vite.config.js`:
```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '0.0.0.0', // Allow external connections
    port: 5173,
    strictPort: true
  }
});
```

**Step 2: Start Server**
```bash
npm run dev
```

**Step 3: Find Your Local IP**

Windows:
```cmd
ipconfig
```
Look for "IPv4 Address" (usually starts with 192.168.x.x)

Mac/Linux:
```bash
ifconfig | grep "inet "
# or
ip addr show
```

**Step 4: Connect from Other Devices**

On any device on the same WiFi network, navigate to:
```
http://YOUR_LOCAL_IP:5173
```
Example: `http://192.168.1.100:5173`

#### Option 2: Using Production Build

**Step 1: Build the Game**
```bash
npm run build
```

**Step 2: Serve with Simple HTTP Server**
```bash
# Using Python
cd dist
python -m http.server 8080 --bind 0.0.0.0

# Using Node's http-server
npm install -g http-server
http-server dist -p 8080 -a 0.0.0.0
```

**Step 3: Access from Devices**
```
http://YOUR_LOCAL_IP:8080
```

#### Option 3: Using Docker (Most Stable)

**Step 1: Create Dockerfile** (already included)

**Step 2: Build & Run**
```bash
docker build -t dynasty-of-emberveil .
docker run -d -p 8080:80 dynasty-of-emberveil
```

**Step 3: Access from Devices**
```
http://YOUR_LOCAL_IP:8080
```

### Firewall Configuration

**Windows:**
```powershell
# Allow port through firewall
netsh advfirewall firewall add rule name="Dynasty Game" dir=in action=allow protocol=TCP localport=5173
```

**Mac:**
```bash
# System Preferences > Security & Privacy > Firewall > Firewall Options
# Add port 5173
```

**Linux:**
```bash
sudo ufw allow 5173/tcp
```

---

## Beta Testing Setup

### Long-Term Local Testing

#### Using PM2 (Process Manager)

**Step 1: Install PM2**
```bash
npm install -g pm2
```

**Step 2: Create Ecosystem File**

Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'dynasty-game',
    script: 'npm',
    args: 'run preview',
    watch: false,
    autorestart: true,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      HOST: '0.0.0.0',
      PORT: 8080
    }
  }]
};
```

**Step 3: Start with PM2**
```bash
npm run build
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Enable on system boot
```

**Step 4: Monitoring**
```bash
pm2 monit      # Real-time monitoring
pm2 logs       # View logs
pm2 restart dynasty-game  # Restart if needed
```

### Setting Up Analytics for Beta Testing

**Step 1: Add Analytics** (in `index.html`)
```html
<script>
  // Simple analytics for beta testing
  const logEvent = (event, data) => {
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, data, timestamp: Date.now() })
    });
  };
  
  window.addEventListener('load', () => logEvent('page_load'));
  window.addEventListener('error', (e) => logEvent('error', e.message));
</script>
```

---

## Production Deployment

### Option 1: Netlify (Easiest)

**Step 1: Build Configuration**

Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Step 2: Deploy**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

**Alternative: GitHub Integration**
1. Push code to GitHub
2. Go to Netlify.com
3. Click "New site from Git"
4. Select repository
5. Auto-deploys on push

### Option 2: Vercel

**Step 1: Install Vercel CLI**
```bash
npm install -g vercel
```

**Step 2: Deploy**
```bash
vercel --prod
```

### Option 3: AWS S3 + CloudFront

**Step 1: Build**
```bash
npm run build
```

**Step 2: Upload to S3**
```bash
aws s3 sync dist/ s3://your-bucket-name --delete
```

**Step 3: Configure CloudFront**
- Create distribution
- Point to S3 bucket
- Enable HTTPS
- Set custom domain

### Option 4: DigitalOcean App Platform

**Step 1: Create App**
```bash
doctl apps create --spec .do/app.yaml
```

**Step 2: Configure** (create `.do/app.yaml`):
```yaml
name: dynasty-of-emberveil
services:
  - name: web
    github:
      repo: MrNova420/web-game-dev
      branch: main
    build_command: npm run build
    run_command: npm run preview
    envs:
      - key: NODE_ENV
        value: production
    http_port: 8080
```

### Option 5: Self-Hosted VPS

**Step 1: Server Setup**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Nginx
sudo apt install -y nginx

# Install PM2
sudo npm install -g pm2
```

**Step 2: Deploy Application**
```bash
# Clone repository
cd /var/www
sudo git clone https://github.com/MrNova420/web-game-dev.git
cd web-game-dev

# Install & Build
sudo npm install
sudo npm run build

# Copy to Nginx directory
sudo cp -r dist/* /var/www/html/
```

**Step 3: Configure Nginx**

Create `/etc/nginx/sites-available/dynasty`:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Step 4: Enable & Restart**
```bash
sudo ln -s /etc/nginx/sites-available/dynasty /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**Step 5: SSL with Let's Encrypt**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## Platform-Specific Guides

### Desktop (Windows/Mac/Linux)

**All modern browsers supported:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Recommended specs:**
- CPU: Intel i5 or equivalent
- RAM: 4GB minimum, 8GB recommended
- GPU: Dedicated GPU recommended for best performance

### Mobile (iOS/Android)

**iOS:**
- Safari on iOS 14+
- Chrome on iOS
- Add to Home Screen for app-like experience

**Android:**
- Chrome 90+
- Firefox 88+
- Samsung Internet 14+

**Add to Home Screen:**
```html
<!-- Already configured in index.html -->
<link rel="manifest" href="/manifest.json">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
```

### Tablet

**Optimized for:**
- iPad (all models)
- Android tablets (7"+ screens)
- Microsoft Surface

**Touch controls enabled:**
- Tap to interact
- Pinch to zoom
- Swipe to rotate camera

### Smart TV / Console Browsers

**Supported:**
- PlayStation browser
- Xbox Edge browser
- Smart TV browsers (limited)

**Recommended:** Use gamepad/controller for best experience

---

## Multi-Device Support

### Responsive Design

Game automatically adapts to:
- Desktop: Full controls, keyboard + mouse
- Tablet: Touch-optimized UI, on-screen controls
- Mobile: Simplified UI, gyroscope support
- TV: Gamepad-optimized, large UI elements

### Cross-Device Progression

**Cloud Save System:**
```javascript
// Automatically syncs across devices
// Save to cloud
await saveToCloud(playerData);

// Load from cloud
const data = await loadFromCloud(playerId);
```

**Play on Multiple Devices:**
1. Create account on any device
2. Play and progress
3. Log in on another device
4. Continue where you left off

---

## Monitoring & Maintenance

### Performance Monitoring

**Built-in Monitoring:**
- FPS tracking
- Memory usage
- Network latency
- Error logging

**External Services:**

**Option 1: Sentry (Error Tracking)**
```bash
npm install @sentry/browser
```

**Option 2: Google Analytics**
```html
<!-- Add to index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
```

### Player Feedback

**In-Game Feedback System:**
- Bug reporting
- Feature requests
- Performance issues

**Analytics Dashboard:**
- Active players
- Session duration
- Popular features
- Error rates

### Content Updates

**Zero-Downtime Updates:**
```bash
# Build new version
npm run build

# Deploy
# ... deployment command ...

# Users auto-refresh on next visit
```

**Version Control:**
```javascript
// Check for updates
if (currentVersion !== latestVersion) {
  showUpdateNotification();
}
```

---

## Troubleshooting

### Common Issues

**Issue: Can't connect from other devices**
- Check firewall settings
- Verify devices on same network
- Check IP address is correct

**Issue: Slow performance**
- Reduce graphics quality
- Close background apps
- Check network connection

**Issue: Assets not loading**
- Clear browser cache
- Check internet connection
- Verify asset URLs

### Getting Help

**Support Channels:**
- GitHub Issues
- Discord Community
- Email Support

---

## Security Best Practices

### For Local Network
- Use strong WiFi password
- Enable firewall
- Monitor connected devices

### For Production
- Enable HTTPS
- Set up CORS properly
- Rate limit API calls
- Regular security updates

---

## Performance Optimization

### Build Optimization
```bash
# Already configured in vite.config.js
npm run build
```

**Optimizations:**
- Code splitting
- Tree shaking
- Asset compression
- Lazy loading

### CDN Configuration

**Using CloudFlare:**
1. Add site to CloudFlare
2. Update DNS
3. Enable caching
4. Enable minification

---

## Backup & Recovery

### Backup Player Data
```bash
# Export from database
mongodump --db dynasty --out backup/

# Export local storage
# Built-in export functionality
```

### Disaster Recovery
```bash
# Restore from backup
mongorestore --db dynasty backup/dynasty/

# Rollback deployment
git revert HEAD
npm run build
# ... redeploy ...
```

---

## Conclusion

Dynasty of Emberveil supports deployment across:
- ✅ Local development
- ✅ Local network (LAN) for household testing
- ✅ Beta testing with monitoring
- ✅ Production on multiple platforms
- ✅ All device types (desktop, mobile, tablet, TV)
- ✅ Long-term play with cloud saves

Choose the deployment option that best fits your needs. For household beta testing, use the LAN deployment. For public release, use one of the production platforms.

For additional help, refer to platform-specific documentation or contact support.
