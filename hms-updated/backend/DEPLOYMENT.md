# Hospital Management System - Backend Deployment Guide

## Overview

This is a Spring Boot 3.3.0 application with MongoDB database using Java 21. The application is designed to be containerized and deployed on cloud platforms like Render, AWS, or any Kubernetes-compatible environment.

## Prerequisites

- Java 21 JDK
- Maven 3.8.1+
- MongoDB Atlas account (or MongoDB instance)
- Docker (for containerization)

## Local Development Setup

### 1. Create Environment Configuration

Copy `.env.example` to `.env` and update with your values:

```bash
cp .env.example .env
```

Edit `.env` and set:
- `MONGO_URI`: Your MongoDB connection string
- `JWT_SECRET`: A secure random string for JWT signing
- `PORT`: Server port (default: 8080)

### 2. Install Dependencies

```bash
mvn clean install
```

### 3. Run the Application

```bash
mvn spring-boot:run
```

The application will start on http://localhost:8080

## API Endpoints

### Health Checks
- `GET /api/health` - Application status
- `GET /api/health/ready` - Readiness probe
- `GET /api/health/live` - Liveness probe
- `GET /actuator/health` - Spring Boot health endpoint

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token

### Patients
- `GET /api/patients` - List all patients
- `GET /api/patients/{id}` - Get patient by ID
- `POST /api/patients` - Create new patient
- `PUT /api/patients/{id}` - Update patient
- `DELETE /api/patients/{id}` - Delete patient

### Doctors
- `GET /api/doctors` - List all doctors
- `GET /api/doctors/{id}` - Get doctor by ID
- `POST /api/doctors` - Create new doctor
- `PUT /api/doctors/{id}` - Update doctor
- `DELETE /api/doctors/{id}` - Delete doctor

### Appointments
- `GET /api/appointments` - List all appointments
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/{id}/status` - Update appointment status
- `DELETE /api/appointments/{id}` - Delete appointment

### Dashboard
- `GET /api/dashboard/stats` - Get system statistics

## Building Docker Image

### Build the Image

```bash
docker build -t hospital-management-system:latest .
```

### Run Container Locally

```bash
docker run -d \
  --name hms-backend \
  -p 8080:8080 \
  -e MONGO_URI="mongodb+srv://user:password@cluster.mongodb.net/hospital_db" \
  -e JWT_SECRET="your-secret-key" \
  hospital-management-system:latest
```

## Production Deployment

### Environment Variables Required

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `MONGO_DB` | Database name | `hospital_db` |
| `JWT_SECRET` | JWT signing secret (min 32 chars) | `ChangeMe!SomeSecureRandomKey12345` |
| `PORT` | Server port | `8080` |
| `FRONTEND_URL` | Frontend origin for CORS | `https://yourdomain.com` |

### Deployment Checklist

- [ ] Update `JWT_SECRET` with a strong, random value
- [ ] Configure `MONGO_URI` with production MongoDB instance
- [ ] Set `FRONTEND_URL` to your frontend domain
- [ ] Enable CORS for your frontend domain (in CorsConfig.java if needed)
- [ ] Test health endpoints: `GET /api/health`
- [ ] Review and update logging levels in `application.properties`
- [ ] Configure monitoring and alerting
- [ ] Set up database backups for MongoDB
- [ ] Enable connection pooling (configured in application.properties)

### Deploying on Render

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect GitHub repository
4. Configure environment variables in Render dashboard
5. Set build command: `mvn clean package -DskipTests`
6. Set start command: `java -XX:+UseG1GC -XX:MaxRAMPercentage=75.0 -jar target/backend-0.0.1-SNAPSHOT.jar`
7. Deploy

### Deploying on AWS (ECS/Fargate)

1. Build Docker image: `docker build -t hospital-backend:latest .`
2. Push to ECR: `aws ecr push hospital-backend:latest`
3. Create ECS task definition with environment variables
4. Create service and run task

### Deploying on Kubernetes

1. Build and push Docker image to registry
2. Create Kubernetes deployment manifest
3. Create ConfigMap for non-sensitive config
4. Create Secret for sensitive data (MONGO_URI, JWT_SECRET)
5. Configure Ingress for routing

## Monitoring & Troubleshooting

### Health Check

```bash
curl http://localhost:8080/api/health
```

### Metrics

```bash
curl http://localhost:8080/actuator/metrics
```

### Logs

Application logs are output to console in Docker containers. Check logs with:

```bash
docker logs hms-backend
```

### Common Issues

**MongoDB Connection Failed**
- Verify `MONGO_URI` is correct
- Check IP whitelist in MongoDB Atlas
- Ensure network connectivity

**JWT Token Expired**
- Tokens expire after 10 hours (default)
- User must login again to get new token

**CORS Errors**
- Update `FRONTEND_URL` in environment
- Verify CORS configuration in `CorsConfig.java`

## Database Setup

### MongoDB Collections

The application automatically creates the following collections:

- `users` - User accounts with roles (ADMIN, DOCTOR, PATIENT)
- `patients` - Patient information
- `doctors` - Doctor information
- `appointments` - Appointment records

### Initial Data

Create initial users via POST to `/api/auth/register`:

```json
{
  "username": "admin",
  "password": "securepassword",
  "role": "ADMIN"
}
```

## Performance Tuning

### Java Runtime Options

The Dockerfile includes optimal JVM settings:
- `XX:+UseG1GC` - Use G1 garbage collector
- `XX:MaxRAMPercentage=75.0` - Use 75% of container memory

### Database Connection Pool

Configured in `application.properties`:
- Max size: 10 connections
- Min size: 5 connections

Adjust based on your traffic patterns.

## Security Best Practices

1. **JWT Secret**: Use a strong, randomly generated secret (minimum 32 characters)
2. **MongoDB**: 
   - Enable authentication
   - Use connection string with credentials
   - Enable IP whitelist
3. **HTTPS**: Deploy behind HTTPS reverse proxy
4. **Passwords**: Hashed with BCrypt before storage
5. **CORS**: Restrict to known frontend domains

## Version Information

- **Java**: 21 LTS
- **Spring Boot**: 3.3.0
- **MongoDB**: Compatible with 3.6+
- **Build Tool**: Maven 3.8.1+

## Support & Documentation

- Spring Boot Docs: https://spring.io/projects/spring-boot
- MongoDB Java Driver: https://docs.mongodb.com/drivers/java/
- JWT Library: https://github.com/jwtk/jjwt

## License

This project is part of the Hospital Management System suite.
