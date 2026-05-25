# Quick Deployment Reference

## Build Commands

```bash
# Clean build JAR
mvn clean package -DskipTests

# Run locally
java -jar target/backend-0.0.1-SNAPSHOT.jar

# Run with Maven
mvn spring-boot:run

# Build Docker image
docker build -t hospital-backend:latest .

# Run Docker container
docker run -d -p 8080:8080 \
  -e MONGO_URI="mongodb+srv://user:pass@cluster.mongodb.net/db" \
  -e JWT_SECRET="your-secret-key" \
  hospital-backend:latest
```

## Environment Variables

```
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/hospital_db
MONGO_DB=hospital_db
JWT_SECRET=your-secure-random-key-min-32-chars
PORT=8080
FRONTEND_URL=http://localhost:5173
```

## Health Checks

```bash
# Health endpoint
curl http://localhost:8080/api/health

# Actuator health
curl http://localhost:8080/actuator/health

# Readiness probe
curl http://localhost:8080/api/health/ready

# Liveness probe
curl http://localhost:8080/api/health/live
```

## Test API Endpoints

```bash
# Register user
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"test123","role":"ADMIN"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"test123"}'

# Get all patients
curl http://localhost:8080/api/patients \
  -H "Authorization: Bearer TOKEN_HERE"
```

## Deployment Checklist

- [ ] Update JWT_SECRET with strong random value
- [ ] Configure MONGO_URI for production
- [ ] Set FRONTEND_URL to your domain
- [ ] Build: `mvn clean package -DskipTests`
- [ ] Test locally: `java -jar target/backend-0.0.1-SNAPSHOT.jar`
- [ ] Test health: `curl http://localhost:8080/api/health`
- [ ] Build Docker: `docker build -t hospital-backend:latest .`
- [ ] Push to Docker registry
- [ ] Deploy to platform (Render, AWS, K8s, etc.)
- [ ] Verify health endpoints
- [ ] Test all API endpoints
- [ ] Configure monitoring
- [ ] Enable backups

## Docker Registry Push (Example)

```bash
# Tag image
docker tag hospital-backend:latest myregistry/hospital-backend:latest

# Login to registry
docker login myregistry

# Push image
docker push myregistry/hospital-backend:latest
```

## Kubernetes Deployment (Example)

```bash
# Create secret for env vars
kubectl create secret generic hms-secrets \
  --from-literal=mongo-uri="mongodb+srv://..." \
  --from-literal=jwt-secret="..."

# Deploy using manifest
kubectl apply -f k8s-deployment.yaml

# Check status
kubectl get pods
kubectl logs deployment/hospital-backend
```

## Render Deployment Steps

1. Push to GitHub
2. Create Web Service on Render.com
3. Connect repository
4. Set Environment Variables:
   - MONGO_URI
   - JWT_SECRET
5. Build Command: `mvn clean package -DskipTests`
6. Start Command: `java -XX:+UseG1GC -XX:MaxRAMPercentage=75.0 -jar target/backend-0.0.1-SNAPSHOT.jar`
7. Deploy

## Troubleshooting

```bash
# View build logs
docker build -t test:latest . --progress=plain

# View container logs
docker logs container-id

# SSH into container
docker exec -it container-id /bin/sh

# Check port
netstat -an | grep 8080

# Test connectivity
nc -zv localhost 8080
```

## Performance Monitoring

```bash
# View metrics
curl http://localhost:8080/actuator/metrics

# View specific metric
curl http://localhost:8080/actuator/metrics/jvm.memory.usage

# View all available metrics
curl http://localhost:8080/actuator/metrics | jq '.names[]'
```

## Database Commands (MongoDB)

```bash
# Connect to MongoDB Atlas
mongosh "mongodb+srv://user:pass@cluster.mongodb.net/hospital_db"

# View collections
show collections

# Count documents
db.patients.countDocuments()
db.doctors.countDocuments()
db.appointments.countDocuments()

# View sample document
db.patients.findOne()
```

## Version Info

- Java: 21 LTS
- Spring Boot: 3.3.0
- Maven: 3.8.1+
- Docker: 20.10+
- Kubernetes: 1.20+

---

For detailed instructions, see DEPLOYMENT.md
