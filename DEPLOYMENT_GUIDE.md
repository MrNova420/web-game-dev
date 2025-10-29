# Dynasty of Emberveil - Complete Deployment & Multiplayer Guide

## 🎮 Quick Navigation
- [Local Development](#local-development)
- [Local WiFi/Network Deployment](#local-wifinetwork-deployment) ⭐ NEW
- [Production Deployment](#production-deployment)
- [Multiplayer Infrastructure](#multiplayer-infrastructure) ⭐ NEW
- [Stress Testing 15,000 Players](#stress-testing) ⭐ NEW

---

## Local Development

### Prerequisites
- Node.js 18+ (LTS)
- npm 9+ or yarn 1.22+
- Modern browser (Chrome 120+, Firefox 121+, Edge 120+)

### Quick Start
```bash
npm install
npm run dev
# Access at http://localhost:5173
```

---

## Local WiFi/Network Deployment

### Method 1: Vite Dev Server (Recommended)

The vite.config.js has been updated to support local network access by default.

**Start server:**
```bash
npm run dev
```

**Access from any device on your network:**
1. Server will display network URLs automatically:
   ```
   VITE v5.x.x  ready in xxx ms

   ➜  Local:   http://localhost:5173/
   ➜  Network: http://192.168.1.100:5173/
   ```
2. Use the Network URL on any device connected to the same WiFi
3. Example: `http://192.168.1.100:5173`

**Find your IP manually:**
```bash
# Windows
ipconfig

# macOS/Linux
ifconfig
# or
hostname -I
```

### Method 2: Production Build with http-server

```bash
# Build game
npm run build

# Install http-server globally (one time)
npm install -g http-server

# Serve on network
cd dist
http-server -p 8080 -a 0.0.0.0

# Access at http://YOUR_LOCAL_IP:8080
```

### Method 3: Node.js Express Server

Create `local-server.js`:
```javascript
const express = require('express');
const path = require('path');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🎮 Dynasty of Emberveil`);
  console.log(`   Local:    http://localhost:${PORT}`);
  
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        console.log(`   Network:  http://${net.address}:${PORT}`);
      }
    }
  }
});
```

Run:
```bash
npm install express
node local-server.js
```

### Firewall Configuration

**Windows:**
```powershell
New-NetFirewallRule -DisplayName "Dynasty Game" -Direction Inbound -LocalPort 5173,8080 -Protocol TCP -Action Allow
```

**macOS:**
- System Preferences → Security & Privacy → Firewall → Allow incoming connections

**Linux (ufw):**
```bash
sudo ufw allow 5173/tcp
sudo ufw allow 8080/tcp
sudo ufw reload
```

---

## Production Deployment

### Static Hosting (Single-Player)

#### Netlify
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

#### Vercel
```bash
npm install -g vercel
npm run build
vercel --prod
```

#### GitHub Pages
```bash
npm install -g gh-pages
npm run build
gh-pages -d dist
```

---

## Multiplayer Infrastructure

### Architecture

```
┌─────────────┐
│   Clients   │ (15,000+ concurrent players)
└──────┬──────┘
       │ WebSocket/HTTP
┌──────▼──────┐
│Load Balancer│ (NGINX/HAProxy)
└──────┬──────┘
   ┌───┴───┐
┌──▼──┐ ┌──▼──┐ ┌──▼──┐
│Node │ │Node │ │Node │ (Game Servers)
│ 1   │ │ 2   │ │ 3   │
└──┬──┘ └──┬──┘ └──┬──┘
   └───┬───┴───┬───┘
┌──────▼───────▼──────┐
│       Redis         │ (Sessions)
└──────┬──────────────┘
┌──────▼──────┐
│ PostgreSQL  │ (Player Data)
└─────────────┘
```

### Quick Setup (Docker Compose)

**Create docker-compose.yml:**
```yaml
version: '3.8'

services:
  game-server-1:
    build: .
    ports:
      - "3001:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/dynasty
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis

  game-server-2:
    build: .
    ports:
      - "3002:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/dynasty
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - game-server-1
      - game-server-2

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: dynasty
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"

  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana
    ports:
      - "3050:3000"
    environment:
      GF_SECURITY_ADMIN_PASSWORD: admin

volumes:
  postgres_data:
  redis_data:
```

**Start:**
```bash
docker-compose up -d
```

### Game Server Implementation

**Install dependencies:**
```bash
npm install express socket.io redis pg dotenv cors helmet compression
```

**Create server/gameServer.js** - See full implementation in `/docs/MULTIPLAYER_SETUP.md`

---

## Stress Testing

### Test 15,000 Concurrent Players

**Install k6:**
```bash
# macOS
brew install k6

# Windows
choco install k6

# Linux
snap install k6
```

**Create stress-test.js:**
```javascript
import { check, sleep } from 'k6';
import ws from 'k6/ws';

export let options = {
  stages: [
    { duration: '2m', target: 1000 },
    { duration: '5m', target: 5000 },
    { duration: '10m', target: 10000 },
    { duration: '15m', target: 15000 },
    { duration: '10m', target: 15000 }, // Hold at 15k
    { duration: '5m', target: 0 },
  ],
  thresholds: {
    'ws_connecting': ['p(95)<500'],
    'ws_msgs_received': ['rate>1000'],
  }
};

export default function() {
  const url = 'ws://localhost:80/socket.io/';
  
  ws.connect(url, {}, function(socket) {
    socket.on('open', () => {
      socket.send(JSON.stringify({
        type: 'join_game',
        playerId: `player_${__VU}_${__ITER}`,
        username: `Player${__VU}`
      }));
    });
    
    socket.on('message', (msg) => {
      // Handle messages
    });
    
    socket.setInterval(() => {
      socket.send(JSON.stringify({
        type: 'move',
        position: {
          x: Math.random() * 100,
          y: 0,
          z: Math.random() * 100
        }
      }));
    }, 1000);
    
    socket.setTimeout(() => socket.close(), 60000);
  });
  
  sleep(1);
}
```

**Run test:**
```bash
k6 run stress-test.js
```

**Monitor during test:**
- Grafana: `http://localhost:3050` (admin/admin)
- Prometheus: `http://localhost:9090`
- Health: `http://localhost:80/health`

### Performance Targets

For 15,000 concurrent players:
- Connection time: p95 < 500ms
- Message latency: p95 < 100ms
- Server CPU: < 80%
- Memory: < 16GB
- Network: Stable throughput

### Scaling Recommendations

| Players | Servers | CPU | RAM | Redis | DB |
|---------|---------|-----|-----|-------|-----|
| 0-1K    | 1       | 2   | 4GB | 1     | 1   |
| 1K-5K   | 2-3     | 4   | 8GB | 1     | 1   |
| 5K-10K  | 5-8     | 8   | 16GB| 3     | 2   |
| 10K-15K | 10-15   | 16  | 32GB| 5     | 3   |
| 15K+    | 20+     | 32  | 64GB| 10    | 5   |

---

## Monitoring

### Key Metrics

1. **Players**: Active connections, joins/leaves per second
2. **Latency**: WebSocket ping, message round-trip time
3. **Throughput**: Messages/sec, bandwidth usage
4. **Resources**: CPU, memory, disk I/O
5. **Errors**: Connection failures, timeouts, crashes

### Grafana Dashboards

Access: `http://localhost:3050`

Pre-configured panels:
- Active Players Over Time
- Message Latency (p50, p95, p99)
- Server Resource Usage
- Error Rate
- Database Query Performance

---

## Database Schema

**Create tables:**
```sql
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE,
  level INTEGER DEFAULT 1,
  experience BIGINT DEFAULT 0,
  class VARCHAR(50),
  position JSONB,
  stats JSONB,
  inventory JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_players_level ON players(level DESC);
CREATE INDEX idx_players_exp ON players(experience DESC);

CREATE TABLE game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES players(id),
  started_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP,
  actions_count INTEGER DEFAULT 0
);

CREATE TABLE player_actions (
  id BIGSERIAL PRIMARY KEY,
  player_id UUID REFERENCES players(id),
  action_type VARCHAR(50),
  action_data JSONB,
  timestamp TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_actions_player ON player_actions(player_id, timestamp DESC);
```

---

## Environment Variables

Create `.env`:
```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://postgres:password@localhost:5432/dynasty
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
SESSION_SECRET=your-session-secret
CLIENT_URL=http://localhost:5173
ENABLE_METRICS=true
```

---

## Security Checklist

- [ ] Use HTTPS in production
- [ ] Implement rate limiting
- [ ] Validate all user inputs
- [ ] Use JWT for authentication
- [ ] Configure CORS properly
- [ ] Keep dependencies updated
- [ ] Enable firewall rules
- [ ] Use environment variables for secrets
- [ ] Implement DDoS protection
- [ ] Regular security audits

---

## Troubleshooting

### Can't connect from other devices
```bash
# Check if server is listening on 0.0.0.0
netstat -an | grep 5173

# Check firewall
sudo ufw status

# Verify network connectivity
ping YOUR_LOCAL_IP
```

### Port already in use
```bash
# Find process
lsof -i :5173

# Kill process
kill -9 PID
```

### High latency
- Check network bandwidth
- Monitor server resources
- Review database queries
- Check Redis connection pool

### Memory leaks
- Monitor heap size
- Use Node.js --inspect
- Review event listeners
- Check for circular references

---

## Support & Resources

- **GitHub**: https://github.com/MrNova420/web-game-dev
- **Issues**: Report bugs and feature requests
- **Docs**: `/docs` folder for detailed guides
- **Health Check**: `http://localhost:3000/health`

---

## Latest Updates

✅ Local WiFi deployment support
✅ Multiplayer infrastructure guide
✅ Stress testing for 15,000 players
✅ Production-ready configuration
✅ Comprehensive monitoring setup
