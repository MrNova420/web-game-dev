# Simple Deployment Guide

## Quick Deploy (5 Minutes)

### Option 1: Netlify (Easiest) ⚡

1. **Create account**: https://netlify.com
2. **Drag & drop** the `dist` folder after building
3. **Done!** Your game is live

```bash
# Build first
npm run build

# Upload dist/ folder to Netlify
```

**Free tier includes**:
- HTTPS
- Custom domain
- 100GB bandwidth/month
- Automatic deploys

---

### Option 2: Vercel (Fast) 🚀

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Deploy**:
```bash
npm run build
vercel dist/
```

3. **Follow prompts** - Done in 30 seconds!

---

### Option 3: GitHub Pages (Free) 🆓

1. **Push to GitHub**:
```bash
git add .
git commit -m "Ready to deploy"
git push origin main
```

2. **Enable GitHub Pages**:
- Go to repository Settings
- Pages section
- Source: `gh-pages` branch
- Save

3. **Deploy**:
```bash
npm run build
npx gh-pages -d dist
```

**Your site**: `https://yourusername.github.io/repo-name/`

---

### Option 4: Local Network (Testing) 🏠

**Share on local network** (e.g., play on phone):

```bash
# Build and serve
npm run build
npm run serve:prod

# Find your IP
# Windows: ipconfig
# Mac/Linux: ifconfig
```

**Access from any device on network**:
`http://YOUR-IP:8000`

Example: `http://192.168.1.100:8000`

---

## Custom Domain

### Add Custom Domain (After Deploy)

#### Netlify:
1. Domain settings → Add custom domain
2. Update DNS records at your domain provider
3. Wait 24 hours for propagation

#### Vercel:
```bash
vercel domains add yourdomain.com
```

#### GitHub Pages:
1. Add `CNAME` file to `dist/` with your domain
2. Update DNS records

---

## Environment Variables

If you need environment variables:

### Netlify:
- Site settings → Environment variables
- Add variables
- Redeploy

### Vercel:
- Project settings → Environment Variables
- Add variables
- Redeploy

### GitHub Pages:
- Use repository secrets
- GitHub Actions workflow

---

## SSL/HTTPS

**All platforms provide free SSL automatically!**

- Netlify: Automatic Let's Encrypt
- Vercel: Automatic
- GitHub Pages: Automatic

---

## Deploy Commands Reference

```bash
# Netlify CLI
npm install -g netlify-cli
netlify deploy --prod

# Vercel CLI
npm install -g vercel
vercel --prod

# GitHub Pages
npm install -g gh-pages
npm run build && npx gh-pages -d dist

# Manual upload
npm run build
# Upload dist/ to any static host
```

---

## Troubleshooting

### Build Fails
```bash
# Clear and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Site Not Loading
1. Check if `index.html` is in `dist/`
2. Verify all paths are relative (not absolute)
3. Check browser console for errors
4. Clear browser cache

### 404 Errors
- Ensure SPA routing is configured
- Add `_redirects` file for Netlify
- Add `vercel.json` for Vercel
- GitHub Pages may need `404.html`

---

## Production Checklist

- [ ] Run `npm run build`
- [ ] Test `npm run serve:prod`
- [ ] Check console for errors (F12)
- [ ] Test on mobile
- [ ] Verify save/load works
- [ ] Check performance (60 FPS)
- [ ] Deploy to hosting
- [ ] Test live site
- [ ] Add custom domain (optional)
- [ ] Set up analytics (optional)

---

## Cost Comparison

| Platform | Free Tier | Paid Plans | Best For |
|----------|-----------|------------|----------|
| **Netlify** | 100GB/month | $19/month | Easy deploy, team |
| **Vercel** | 100GB/month | $20/month | Next.js, serverless |
| **GitHub Pages** | 100GB/month | Free forever | Open source |
| **Cloudflare** | Unlimited | $20/month | Performance, CDN |

**Recommendation**: Start with GitHub Pages (free), upgrade to Netlify/Vercel if you need more bandwidth.

---

## Quick Links

- **Netlify**: https://netlify.com
- **Vercel**: https://vercel.com
- **GitHub Pages**: https://pages.github.com
- **Cloudflare Pages**: https://pages.cloudflare.com

---

**That's it!** Your game is now live and playable worldwide! 🎮✨
