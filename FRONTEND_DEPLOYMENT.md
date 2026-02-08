# Frontend Deployment Guide

## Architecture

- **Framework:** React 19 (Create React App)
- **Build Tool:** webpack (via react-scripts)
- **Web Server:** Nginx 1.25
- **Container:** Multi-stage Docker build
- **CI/CD:** GitHub Actions

## Environment Variables

### Production
```
REACT_APP_API_BASE_URL=https://booking-oselya.pp.ua
```

### Development
```
REACT_APP_API_BASE_URL=http://localhost:5000
```

## Local Development
```bash
cd frontend
npm install
npm start
```

Access at: http://localhost:3000

## Production Build
```bash
cd frontend
docker build -t booking-frontend .
docker run -p 3001:80 booking-frontend
```

Access at: http://localhost:3001

## Deployment to AWS

### Prerequisites
- Docker and Docker Compose installed on server
- Nginx reverse proxy configured
- SSL certificates (Cloudflare Origin)

### Steps

1. Pull latest image:
```bash
docker pull spartakj/booking-frontend:latest
```

2. Deploy with docker-compose:
```bash
docker-compose -f docker-compose.frontend.yml up -d
```

3. Verify deployment:
```bash
curl http://localhost:3001
docker logs booking-frontend
```

## Nginx Configuration (Server)

Frontend runs on port 3001, proxied through main Nginx:
```nginx
location / {
    proxy_pass http://localhost:3001;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

## CI/CD Pipeline

Triggered on push to:
- `devops/frontend-deployment`
- `Inna`

Jobs:
1. **Lint and Test** - Run tests and type checking
2. **Build and Push** - Build Docker image and push to DockerHub
3. **Security Scan** - Scan for vulnerabilities with Trivy

## Monitoring

Health check endpoint: `http://localhost:3001/`

Check logs:
```bash
docker logs -f booking-frontend
```

## Troubleshooting

### Build fails
```bash
cd frontend
npm install
npm run build
```

### Container won't start
```bash
docker logs booking-frontend
```

### API connection issues
Check REACT_APP_API_BASE_URL in container:
```bash
docker exec booking-frontend env | grep REACT_APP
```
