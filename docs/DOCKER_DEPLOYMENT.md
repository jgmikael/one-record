# Docker Deployment Guide

## Quick Start with Docker

### Using Docker Compose (Recommended)

```bash
# Clone repository
git clone https://github.com/jgmikael/one-record.git
cd one-record

# Start with Docker Compose
docker-compose up -d

# Check logs
docker-compose logs -f

# Stop
docker-compose down
```

**Access**: http://localhost:3001

### Using Docker Build

```bash
# Build image
docker build -t one-record-demo .

# Run container
docker run -d \
  --name one-record \
  -p 3001:3001 \
  -v one-record-data:/app/apps/api/data \
  one-record-demo

# Check logs
docker logs -f one-record

# Stop container
docker stop one-record
docker rm one-record
```

## Configuration

### Environment Variables

Create a `.env` file or pass environment variables:

```bash
docker run -d \
  --name one-record \
  -p 3001:3001 \
  -e PORT=3001 \
  -e NODE_ENV=production \
  -e SEED_DB=true \
  -v one-record-data:/app/apps/api/data \
  one-record-demo
```

**Available Variables**:
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development|production)
- `DB_PATH` - Database path
- `SEED_DB` - Seed sample data (true|false)

### Persistent Storage

The database is stored in `/app/apps/api/data` inside the container.

**Volume Mount Options**:

```bash
# Named volume (recommended)
-v one-record-data:/app/apps/api/data

# Bind mount (for easy access)
-v $(pwd)/data:/app/apps/api/data

# Specific file
-v $(pwd)/one-record.db:/app/apps/api/data/one-record.db
```

## Docker Compose Configuration

### Basic Setup

```yaml
version: '3.8'

services:
  one-record:
    image: one-record-demo:latest
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - SEED_DB=true
    volumes:
      - one-record-data:/app/apps/api/data
    restart: unless-stopped

volumes:
  one-record-data:
```

### With PostgreSQL (Future)

```yaml
version: '3.8'

services:
  one-record:
    image: one-record-demo:latest
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - DB_TYPE=postgres
      - DB_HOST=postgres
      - DB_PORT=5432
      - DB_NAME=onerecord
      - DB_USER=onerecord
      - DB_PASSWORD=changeme
    depends_on:
      - postgres
    restart: unless-stopped

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: onerecord
      POSTGRES_USER: onerecord
      POSTGRES_PASSWORD: changeme
    volumes:
      - postgres-data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres-data:
```

## Health Checks

The Docker image includes a built-in health check:

```bash
# Check container health
docker inspect --format='{{.State.Health.Status}}' one-record

# View health check logs
docker inspect --format='{{range .State.Health.Log}}{{.Output}}{{end}}' one-record
```

**Health Check Details**:
- Interval: 30 seconds
- Timeout: 3 seconds
- Start period: 40 seconds
- Retries: 3
- Endpoint: http://localhost:3001/api/health

## Production Deployment

### Build for Production

```bash
# Build optimized image
docker build \
  --build-arg NODE_ENV=production \
  -t one-record-demo:1.0.0 \
  -t one-record-demo:latest \
  .

# Tag for registry
docker tag one-record-demo:latest registry.example.com/one-record-demo:1.0.0

# Push to registry
docker push registry.example.com/one-record-demo:1.0.0
```

### Deploy on Production Server

```bash
# Pull from registry
docker pull registry.example.com/one-record-demo:1.0.0

# Run with production config
docker run -d \
  --name one-record-prod \
  --restart always \
  -p 3001:3001 \
  -e NODE_ENV=production \
  -e PORT=3001 \
  -v /var/lib/one-record/data:/app/apps/api/data \
  -v /var/log/one-record:/app/logs \
  --memory="512m" \
  --cpus="1.0" \
  registry.example.com/one-record-demo:1.0.0
```

### Behind Nginx Reverse Proxy

**nginx.conf**:

```nginx
upstream one-record {
    server localhost:3001;
}

server {
    listen 80;
    server_name one-record.example.com;

    location / {
        proxy_pass http://one-record;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Kubernetes Deployment (Advanced)

### Basic Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: one-record
spec:
  replicas: 2
  selector:
    matchLabels:
      app: one-record
  template:
    metadata:
      labels:
        app: one-record
    spec:
      containers:
      - name: one-record
        image: registry.example.com/one-record-demo:1.0.0
        ports:
        - containerPort: 3001
        env:
        - name: NODE_ENV
          value: "production"
        - name: PORT
          value: "3001"
        volumeMounts:
        - name: data
          mountPath: /app/apps/api/data
        livenessProbe:
          httpGet:
            path: /api/health
            port: 3001
          initialDelaySeconds: 40
          periodSeconds: 30
        readinessProbe:
          httpGet:
            path: /api/health
            port: 3001
          initialDelaySeconds: 10
          periodSeconds: 5
      volumes:
      - name: data
        persistentVolumeClaim:
          claimName: one-record-data

---
apiVersion: v1
kind: Service
metadata:
  name: one-record
spec:
  selector:
    app: one-record
  ports:
  - port: 80
    targetPort: 3001
  type: LoadBalancer
```

## Monitoring

### Container Logs

```bash
# Follow logs
docker-compose logs -f one-record

# Last 100 lines
docker-compose logs --tail=100 one-record

# Logs since specific time
docker-compose logs --since 2024-01-01T00:00:00 one-record
```

### Resource Usage

```bash
# Real-time stats
docker stats one-record

# Resource usage history
docker stats --no-stream one-record
```

### Database Backup

```bash
# Backup database
docker exec one-record sqlite3 /app/apps/api/data/one-record.db ".backup /tmp/backup.db"
docker cp one-record:/tmp/backup.db ./backup-$(date +%Y%m%d).db

# Restore database
docker cp ./backup-20240101.db one-record:/tmp/restore.db
docker exec one-record sqlite3 /app/apps/api/data/one-record.db ".restore /tmp/restore.db"
```

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker logs one-record

# Check health status
docker inspect one-record | grep -A 10 Health

# Run interactively for debugging
docker run -it --rm one-record-demo /bin/sh
```

### Database Permission Issues

```bash
# Fix permissions
docker exec -u root one-record chown -R node:node /app/apps/api/data
```

### Port Already in Use

```bash
# Use different port
docker run -p 3002:3001 one-record-demo

# Or update docker-compose.yml
ports:
  - "3002:3001"
```

### Update Container

```bash
# Pull latest image
docker-compose pull

# Recreate container
docker-compose up -d
```

## Security Best Practices

1. **Don't run as root**: Image uses `node` user
2. **Use secrets**: Don't hardcode credentials
3. **Limit resources**: Set memory and CPU limits
4. **Network isolation**: Use Docker networks
5. **Regular updates**: Keep base image updated
6. **Scan images**: Use `docker scan` for vulnerabilities

```bash
# Scan for vulnerabilities
docker scan one-record-demo:latest
```

## Multi-Stage Build Optimization

The Dockerfile uses multi-stage builds to:
- Minimize final image size
- Separate build and runtime dependencies
- Improve security by excluding dev tools

**Build stages**:
1. **builder**: Compile TypeScript
2. **production**: Runtime environment only

---

For more deployment options, see [README.md](../README.md#development).
