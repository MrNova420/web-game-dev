# Dynasty of Emberveil - Deployment Guide

## Table of Contents
1. [Local Development](#local-development)
2. [Building for Production](#building-for-production)
3. [Deployment Methods](#deployment-methods)
4. [Server Configuration](#server-configuration)
5. [Environment Variables](#environment-variables)
6. [Performance Optimization](#performance-optimization)
7. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Local Development

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm 9+ or yarn 1.22+
- Modern web browser (Chrome 90+, Firefox 88+, Edge 90+, Safari 14+)
- 2GB RAM minimum, 4GB recommended
- Git (for version control)

### Quick Start (Fastest Method)

```bash
# Clone the repository
git clone https://github.com/MrNova420/web-game-dev.git
cd web-game-dev

# Install dependencies
npm install

# Start development server
npm run dev

# Game runs at http://localhost:5173
```

### Alternative: Python Simple Server

```bash
# Build the game first
npm run build

# Serve from dist folder
cd dist
python3 -m http.server 8000

# Open http://localhost:8000
```

### Alternative: Node.js HTTP Server

```bash
# Install http-server globally
npm install -g http-server

# Build and serve
npm run build
cd dist
http-server -p 8000

# Open http://localhost:8000
```

### Development Commands

```bash
# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Lint code
npm run lint

# Run tests (when implemented)
npm run test
```

### Development Configuration

**vite.config.js**:
```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/', // Change for subdirectory deployment
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // Enable for debugging
    minify: 'terser', // or 'esbuild' for faster builds
    target: 'es2015',
    rollupOptions: {
      output: {
        manualChunks: {
          // Code splitting for better performance
          three: ['three'],
          cannon: ['cannon-es']
        }
      }
    }
  },
  server: {
    port: 5173,
    host: true, // Listen on all addresses
    open: true // Auto-open browser
  }
});
```

---

## Building for Production

### Standard Build

```bash
# Clean build
rm -rf dist
npm run build

# Output in dist/ folder
# - index.html
# - assets/ (JS, CSS, images)
```

### Optimized Build

```bash
# Build with source maps for debugging
VITE_SOURCEMAP=true npm run build

# Build with specific base URL
VITE_BASE_URL=/game npm run build
```

### Build Output Structure

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js      # Main bundle
│   ├── three-[hash].js      # Three.js chunk
│   ├── cannon-[hash].js     # Cannon-es chunk
│   ├── index-[hash].css     # Styles
│   └── [images/models]      # Static assets
└── favicon.ico
```

### Build Verification

```bash
# Preview production build locally
npm run preview

# Or use http-server
cd dist
http-server -p 8080 -c-1

# Test in different browsers
# - Chrome/Edge: http://localhost:8080
# - Firefox: http://localhost:8080
# - Safari: http://localhost:8080
```

---

## Deployment Methods

### Method 1: Static Hosting (Recommended)

#### Netlify

1. **Via CLI**:
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

2. **Via Git Integration**:
- Connect GitHub repository to Netlify
- Build command: `npm run build`
- Publish directory: `dist`
- Auto-deploys on git push

**netlify.toml**:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Build and deploy
vercel --prod
```

**vercel.json**:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

#### GitHub Pages

```bash
# Install gh-pages
npm install -D gh-pages

# Add to package.json scripts:
# "deploy": "npm run build && gh-pages -d dist"

# Deploy
npm run deploy
```

**Update vite.config.js** for GitHub Pages:
```javascript
base: '/web-game-dev/', // Your repo name
```

### Method 2: Cloud Platforms

#### AWS S3 + CloudFront

```bash
# Build
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DIST_ID \
  --paths "/*"
```

#### Google Cloud Storage

```bash
# Build
npm run build

# Upload
gsutil -m rsync -r -d dist/ gs://your-bucket-name

# Set cache control
gsutil -m setmeta -h "Cache-Control:public,max-age=31536000" \
  gs://your-bucket-name/assets/**
```

#### Azure Static Web Apps

```bash
# Install Azure CLI
npm install -g @azure/static-web-apps-cli

# Deploy
swa deploy --env production
```

### Method 3: Docker Container

**Dockerfile**:
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Build and run**:
```bash
# Build Docker image
docker build -t dynasty-of-emberveil .

# Run container
docker run -d -p 8080:80 dynasty-of-emberveil

# Open http://localhost:8080
```

### Method 4: Traditional VPS/Server

```bash
# SSH into your server
ssh user@your-server.com

# Install Node.js (if not installed)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and build
git clone https://github.com/MrNova420/web-game-dev.git
cd web-game-dev
npm install
npm run build

# Serve with Nginx (see Server Configuration)
```

---

## Server Configuration

### Nginx Configuration

**/etc/nginx/sites-available/dynasty-of-emberveil**:
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/dynasty-of-emberveil/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types
        text/plain
        text/css
        text/javascript
        application/javascript
        application/json
        application/x-javascript
        application/xml
        application/xml+rss
        image/svg+xml;

    # Cache static assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/dynasty-of-emberveil \
            /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Apache Configuration

**.htaccess**:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css
  AddOutputFilterByType DEFLATE application/javascript application/json
</IfModule>

# Caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType text/css "access plus 1 year"
</IfModule>
```

### SSL/HTTPS Setup (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal (already set up)
sudo certbot renew --dry-run
```

---

## Environment Variables

Create **.env** file (for future backend integration):

```env
# API Configuration
VITE_API_URL=https://api.yourdomain.com
VITE_WS_URL=wss://api.yourdomain.com

# Feature Flags
VITE_ENABLE_CLOUD_SYNC=false
VITE_ENABLE_MULTIPLAYER=false
VITE_ENABLE_ANALYTICS=true

# CDN Configuration
VITE_CDN_URL=https://cdn.yourdomain.com

# Environment
VITE_ENVIRONMENT=production
VITE_VERSION=1.0.0
```

Access in code:
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
const isProduction = import.meta.env.VITE_ENVIRONMENT === 'production';
```

---

## Performance Optimization

### Build Optimization

1. **Enable Minification**:
```javascript
// vite.config.js
build: {
  minify: 'terser',
  terserOptions: {
    compress: {
      drop_console: true, // Remove console.logs
      drop_debugger: true
    }
  }
}
```

2. **Code Splitting**:
```javascript
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'three': ['three'],
        'cannon': ['cannon-es'],
        'game-core': [
          './src/core/GameEngine.js',
          './src/core/Player.js'
        ],
        'game-systems': [
          './src/systems/CraftingSystem.js',
          './src/systems/EconomySystem.js'
        ]
      }
    }
  }
}
```

3. **Asset Optimization**:
```bash
# Install image optimization
npm install -D vite-plugin-imagemin

# Update vite.config.js
import viteImagemin from 'vite-plugin-imagemin';

plugins: [
  viteImagemin({
    gifsicle: { optimizationLevel: 7 },
    optipng: { optimizationLevel: 7 },
    mozjpeg: { quality: 80 },
    pngquant: { quality: [0.8, 0.9], speed: 4 },
    svgo: {
      plugins: [
        { name: 'removeViewBox' },
        { name: 'removeEmptyAttrs', active: false }
      ]
    }
  })
]
```

### CDN Integration

Use CDN for static assets:

```javascript
// vite.config.js
build: {
  rollupOptions: {
    external: ['three', 'cannon-es'], // If using CDN
    output: {
      globals: {
        three: 'THREE',
        'cannon-es': 'CANNON'
      }
    }
  }
}
```

**index.html**:
```html
<script src="https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/dist/cannon-es.min.js"></script>
```

### Caching Strategy

**Service Worker** (for PWA):
```javascript
// public/sw.js
const CACHE_NAME = 'dynasty-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/index.js',
  '/assets/index.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
```

---

## Monitoring & Maintenance

### Health Checks

Create **/health** endpoint:
```javascript
// health.js
export function getHealthStatus() {
  return {
    status: 'healthy',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: performance.now(),
    memory: performance.memory
  };
}
```

### Error Tracking

Integrate Sentry:
```bash
npm install @sentry/browser
```

```javascript
import * as Sentry from '@sentry/browser';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  environment: import.meta.env.VITE_ENVIRONMENT,
  release: import.meta.env.VITE_VERSION
});
```

### Analytics

```javascript
// Google Analytics
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'GA_MEASUREMENT_ID');
```

### Logging

```javascript
class Logger {
  static log(message, data = {}) {
    if (import.meta.env.DEV) {
      console.log(message, data);
    }
    // Send to logging service in production
  }

  static error(message, error) {
    console.error(message, error);
    // Send to error tracking service
  }
}
```

### Backup Strategy

1. **Code**: Git repository (GitHub)
2. **User Data**: Auto-save system with cloud sync
3. **Database**: Daily backups (when backend implemented)
4. **Assets**: CDN with redundancy

### Update Strategy

1. **Versioning**: Use semantic versioning (1.0.0)
2. **Changelog**: Maintain CHANGELOG.md
3. **Rolling Updates**: Deploy to staging first
4. **Cache Busting**: Build hashes handle this automatically
5. **Rollback Plan**: Keep previous version available

```bash
# Tag release
git tag -a v1.0.0 -m "Release 1.0.0"
git push origin v1.0.0

# Create release branch
git checkout -b release/v1.0.0
```

---

## Troubleshooting Deployment

### Build Errors

```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### CORS Issues

If using external APIs:
```javascript
// vite.config.js
server: {
  proxy: {
    '/api': {
      target: 'https://api.yourdomain.com',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

### Memory Issues

```bash
# Increase Node.js memory limit
NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

### Large Bundle Size

1. Analyze bundle:
```bash
npm install -D rollup-plugin-visualizer

# Add to vite.config.js
import { visualizer } from 'rollup-plugin-visualizer';

plugins: [
  visualizer({ open: true })
]
```

2. Implement lazy loading:
```javascript
const HeavyComponent = () => import('./HeavyComponent.js');
```

---

## Quick Deployment Checklist

- [ ] Run `npm install`
- [ ] Run `npm run build`
- [ ] Test build with `npm run preview`
- [ ] Verify all assets load correctly
- [ ] Test in multiple browsers
- [ ] Check mobile responsiveness
- [ ] Verify HTTPS is working
- [ ] Configure caching headers
- [ ] Set up monitoring/analytics
- [ ] Configure error tracking
- [ ] Document deployment process
- [ ] Set up CI/CD pipeline
- [ ] Create backup strategy
- [ ] Test rollback procedure

---

## Support

For deployment issues:
- Check build logs
- Review browser console
- Check server logs
- Verify environment variables
- Test locally first

**Happy Deploying!** 🚀
