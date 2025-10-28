# Complete Deployment Guide - Dynasty of Emberveil

## Deployment Options Overview

| Method | Difficulty | Cost | Best For |
|--------|-----------|------|----------|
| **Static Hosting** | Easy | Free | Quick deployment |
| **VPS** | Medium | $5-20/mo | Full control |
| **Docker** | Medium | Varies | Containerized |
| **Cloud (AWS/Azure)** | Hard | Varies | Enterprise scale |

---

## Option 1: Static Hosting (Recommended for Most Users)

Static hosting is perfect for client-side games. No server needed!

### A. Netlify (Easiest)

**Pros**: Free, automatic builds, custom domains, CDN included  
**Cons**: 100 GB bandwidth/month limit (free tier)

#### Steps:

1. **Build the game**
   ```bash
   npm run build
   ```

2. **Create Netlify account**
   - Go to https://www.netlify.com/
   - Sign up (free)

3. **Deploy via CLI**
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli

   # Login
   netlify login

   # Deploy
   netlify deploy --prod --dir=dist
   ```

4. **Or deploy via UI**
   - Drag & drop `dist` folder to Netlify
   - Site deploys instantly

5. **Custom domain** (optional)
   - Buy domain or use existing
   - Add DNS records in Netlify settings
   - Auto SSL certificate included

**Live URL**: `https://your-site-name.netlify.app`

---

### B. Vercel (Alternative to Netlify)

**Pros**: Free, excellent performance, easy GitHub integration  
**Cons**: Similar bandwidth limits

#### Steps:

1. **Build the game**
   ```bash
   npm run build
   ```

2. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Follow prompts**
   - Link to Git repo (optional)
   - Configure settings
   - Deploy!

**Live URL**: `https://your-project.vercel.app`

---

### C. GitHub Pages (Free, Simple)

**Pros**: Completely free, integrates with GitHub  
**Cons**: Must be public repo, slower than Netlify/Vercel

#### Steps:

1. **Update vite.config.js**
   ```javascript
   export default {
     base: '/web-game-dev/', // Your repo name
     build: {
       outDir: 'dist'
     }
   }
   ```

2. **Build**
   ```bash
   npm run build
   ```

3. **Install gh-pages**
   ```bash
   npm install -D gh-pages
   ```

4. **Add to package.json**
   ```json
   {
     "scripts": {
       "deploy": "gh-pages -d dist"
     }
   }
   ```

5. **Deploy**
   ```bash
   npm run deploy
   ```

6. **Enable GitHub Pages**
   - Go to repo Settings > Pages
   - Source: gh-pages branch
   - Save

**Live URL**: `https://username.github.io/web-game-dev/`

---

### D. Cloudflare Pages

**Pros**: Free, global CDN, unlimited bandwidth  
**Cons**: Slightly more complex setup

#### Steps:

1. **Build**
   ```bash
   npm run build
   ```

2. **Create Cloudflare account**
   - Go to https://pages.cloudflare.com/
   - Sign up (free)

3. **Create new project**
   - Connect GitHub repo OR upload dist/
   - Configure:
     - Build command: `npm run build`
     - Build output: `dist`

4. **Deploy**
   - Automatic on every push (if GitHub connected)
   - Or manual upload of dist/

**Live URL**: `https://your-project.pages.dev`

---

## Option 2: VPS Deployment (Full Control)

Use a Virtual Private Server for complete control.

### Recommended Providers:
- **DigitalOcean**: $5-10/month droplets
- **Linode**: $5/month instances
- **Vultr**: $5/month instances
- **AWS Lightsail**: $3.50-5/month

### Setup Steps (Ubuntu 22.04):

#### 1. Create VPS

```bash
# SSH into your server
ssh root@your-server-ip
```

#### 2. Install Node.js

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Verify
node --version
npm --version
```

#### 3. Install Nginx

```bash
# Install Nginx
apt install -y nginx

# Start Nginx
systemctl start nginx
systemctl enable nginx
```

#### 4. Clone and Build

```bash
# Navigate to web directory
cd /var/www

# Clone repo
git clone https://github.com/MrNova420/web-game-dev.git
cd web-game-dev

# Install and build
npm install
npm run build
```

#### 5. Configure Nginx

```bash
# Create config
nano /etc/nginx/sites-available/dynasty-emberveil
```

**Paste this configuration**:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    root /var/www/web-game-dev/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing - serve index.html for all routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

#### 6. Enable Site

```bash
# Create symlink
ln -s /etc/nginx/sites-available/dynasty-emberveil /etc/nginx/sites-enabled/

# Test config
nginx -t

# Restart Nginx
systemctl restart nginx
```

#### 7. Setup SSL (Free with Let's Encrypt)

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get certificate
certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal is configured automatically
```

#### 8. Setup Firewall

```bash
# Allow SSH, HTTP, HTTPS
ufw allow 22
ufw allow 80
ufw allow 443
ufw enable
```

**Your site is now live at**: `https://your-domain.com`

---

## Option 3: Docker Deployment

Containerize the game for consistent deployment anywhere.

### Dockerfile

Create `Dockerfile` in project root:

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source
COPY . .

# Build
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy build output
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf

Create `nginx.conf`:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Build and Run

```bash
# Build Docker image
docker build -t dynasty-emberveil:latest .

# Run container
docker run -d -p 80:80 --name dynasty-game dynasty-emberveil:latest

# Or use docker-compose
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  game:
    build: .
    ports:
      - "80:80"
    restart: unless-stopped
    container_name: dynasty-emberveil
```

**Run with**:
```bash
docker-compose up -d
```

---

## Option 4: Cloud Deployment

### AWS S3 + CloudFront (Scalable)

#### 1. Build

```bash
npm run build
```

#### 2. Create S3 Bucket

```bash
# Install AWS CLI
pip install awscli

# Configure
aws configure

# Create bucket
aws s3 mb s3://dynasty-emberveil

# Upload
aws s3 sync dist/ s3://dynasty-emberveil/ --acl public-read
```

#### 3. Enable Static Website

```bash
aws s3 website s3://dynasty-emberveil/ --index-document index.html --error-document index.html
```

#### 4. Setup CloudFront (CDN)

- Go to AWS CloudFront console
- Create distribution
- Origin: S3 bucket
- Default root object: `index.html`
- Custom error responses: 404 → /index.html

#### 5. Add Custom Domain (Optional)

- Route 53 or your DNS provider
- Point to CloudFront distribution
- SSL certificate via AWS Certificate Manager (free)

---

## Performance Optimization

### Build Optimization

```javascript
// vite.config.js
export default {
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'three': ['three'],
          'cannon': ['cannon-es']
        }
      }
    }
  }
}
```

### CDN Configuration

```nginx
# Cache headers
location ~* \.(js|css)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

location ~* \.(png|jpg|jpeg|gif|ico|svg)$ {
    expires 6M;
    add_header Cache-Control "public, immutable";
}

location ~* \.(woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### Compression

```nginx
# Gzip
gzip on;
gzip_vary on;
gzip_min_length 256;
gzip_types
    text/plain
    text/css
    text/xml
    text/javascript
    application/javascript
    application/json
    application/xml+rss
    application/atom+xml
    image/svg+xml;
```

---

## Monitoring & Analytics

### Google Analytics

Add to `index.html` (before `</head>`):

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Uptime Monitoring

Use services like:
- UptimeRobot (free)
- Pingdom
- StatusCake

---

## Security Best Practices

### Headers

```nginx
# Security headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" always;
```

### HTTPS Only

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

---

## Backup & Updates

### Auto-deployment with GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy to Netlify
        uses: netlify/actions/cli@master
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
        with:
          args: deploy --prod --dir=dist
```

---

## Troubleshooting Deployment

### Build Fails
```bash
# Clear cache
rm -rf node_modules dist
npm install
npm run build
```

### 404 Errors on Routes
- Ensure SPA routing configured in server
- `try_files $uri /index.html` in Nginx
- Or configure rewrite rules

### Slow Loading
- Enable gzip compression
- Use CDN
- Optimize images
- Code splitting

### Mixed Content Errors
- Ensure all assets use HTTPS
- Update absolute URLs to relative
- Configure CSP headers

---

## Cost Estimate

| Deployment Type | Monthly Cost | Traffic | Notes |
|----------------|--------------|---------|-------|
| Netlify Free | $0 | 100 GB | Perfect for small/medium traffic |
| Vercel Free | $0 | 100 GB | Similar to Netlify |
| GitHub Pages | $0 | 100 GB | Free forever |
| Cloudflare Pages | $0 | Unlimited | Best free option |
| DigitalOcean | $5-10 | Unlimited* | Full control |
| AWS S3+CloudFront | $1-5 | 100 GB-1TB | Pay as you go |
| Dedicated Server | $20-100+ | Unlimited | Enterprise |

*Within fair use policy

---

## Recommended Setup

**For Beginners**: Netlify or Vercel  
**For Developers**: VPS (DigitalOcean)  
**For Scale**: AWS S3 + CloudFront  
**For Free**: GitHub Pages or Cloudflare Pages

---

## Post-Deployment Checklist

- [ ] Site loads correctly
- [ ] All routes work (SPA routing)
- [ ] HTTPS enabled
- [ ] Custom domain configured (if applicable)
- [ ] Analytics tracking
- [ ] Performance optimized (gzip, caching)
- [ ] Security headers configured
- [ ] Backup strategy in place
- [ ] Monitoring/uptime checks
- [ ] Error tracking (Sentry, etc.)

---

**Version**: 1.0.0  
**Last Updated**: 2025-10-28  
**Status**: Complete Deployment Guide ✅
