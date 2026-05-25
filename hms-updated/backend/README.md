# Hospital Management System - Backend

A modern Hospital Management System backend built with Spring Boot 3.3, MongoDB, and JWT authentication.

## Features

✅ **RESTful API** - Complete REST API for hospital operations
✅ **MongoDB Integration** - Scalable NoSQL database with MongoDB Atlas
✅ **JWT Authentication** - Secure token-based authentication
✅ **Role-Based Access** - Support for ADMIN, DOCTOR, and PATIENT roles
✅ **Docker Ready** - Production-ready Docker configuration
✅ **Cloud Deployable** - Ready for Render, AWS, Kubernetes, and other platforms
✅ **Health Checks** - Built-in health and readiness probes for orchestration
✅ **Comprehensive API** - Patient, Doctor, Appointment, and Dashboard management

## Technology Stack

- **Framework**: Spring Boot 3.3.0
- **Language**: Java 21 LTS
- **Database**: MongoDB
- **Authentication**: JWT (jjwt 0.11.5)
- **Security**: Spring Security Crypto (BCrypt)
- **Build Tool**: Maven 3.8.1+
- **Containerization**: Docker

## Quick Start

### Prerequisites

- Java 21 JDK or later
- Maven 3.8.1 or later
- MongoDB Atlas account or local MongoDB

### Local Development

1. **Clone and Setup**
   ```bash
   git clone <repository>
   cd hms-updated/backend
   cp .env.example .env
   ```

2. **Configure Environment**
   
   Edit `.env` and set:
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A secure random string (min 32 characters)
   
   Example:
   ```env
   MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/hospital_db
   JWT_SECRET=your-secure-random-key-here
   PORT=8080
   ```

3. **Install Dependencies**
   ```bash
   mvn clean install
   ```

4. **Run Application**
   ```bash
   mvn spring-boot:run
   ```
   
   Application will start on http://localhost:8080

## API Documentation

### Authentication Endpoints

**Register User**
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "doctor1",
  "password": "securepassword",
  "role": "DOCTOR"
}

Response: 201 Created
{
  "id": "123abc",
  "username": "doctor1",
  "role": "DOCTOR"
}
```

**Login**
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "doctor1",
  "password": "securepassword"
}

Response: 200 OK
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "role": "DOCTOR",
  "username": "doctor1"
}
```

### Patient Management

**List All Patients**
```
GET /api/patients
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": "patient1",
    "name": "John Doe",
    "age": 45,
    "gender": "M",
    "disease": "Diabetes",
    "phone": "1234567890",
    "email": "john@example.com",
    "address": "123 Main St"
  }
]
```

**Create Patient**
```
POST /api/patients
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe",
  "age": 45,
  "gender": "M",
  "disease": "Diabetes",
  "phone": "1234567890",
  "email": "john@example.com",
  "address": "123 Main St"
}

Response: 201 Created
```

**Get Patient**
```
GET /api/patients/{id}
Authorization: Bearer <token>
```

**Update Patient**
```
PUT /api/patients/{id}
Authorization: Bearer <token>
Content-Type: application/json

{ ... patient data ... }
```

**Delete Patient**
```
DELETE /api/patients/{id}
Authorization: Bearer <token>

Response: 204 No Content
```

### Doctor Management

Similar endpoints to Patient management:
- `GET /api/doctors`
- `GET /api/doctors/{id}`
- `POST /api/doctors`
- `PUT /api/doctors/{id}`
- `DELETE /api/doctors/{id}`

### Appointment Management

**Create Appointment**
```
POST /api/appointments
Authorization: Bearer <token>
Content-Type: application/json

{
  "doctorId": "doctor1",
  "patientId": "patient1",
  "appointmentDate": "2026-06-15",
  "appointmentTime": "10:30",
  "notes": "Regular checkup"
}

Response: 201 Created
```

**Get All Appointments**
```
GET /api/appointments
Authorization: Bearer <token>
```

**Update Appointment Status**
```
PUT /api/appointments/{id}/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "COMPLETED"
}
```

**Delete Appointment**
```
DELETE /api/appointments/{id}
Authorization: Bearer <token>
```

### Dashboard

**Get Statistics**
```
GET /api/dashboard/stats
Authorization: Bearer <token>

Response: 200 OK
{
  "totalDoctors": 5,
  "totalPatients": 25,
  "totalAppointments": 40,
  "scheduledAppointments": 30,
  "completedAppointments": 10
}
```

### Health Checks

**Application Health**
```
GET /api/health

Response: 200 OK
{
  "status": "UP",
  "service": "Hospital Management System - Backend"
}
```

## Building and Deployment

### Build JAR

```bash
mvn clean package -DskipTests
```

Creates `target/backend-0.0.1-SNAPSHOT.jar`

### Run JAR

```bash
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

### Docker Build

```bash
docker build -t hospital-backend:latest .
```

### Docker Run

```bash
docker run -d \
  --name hospital-backend \
  -p 8080:8080 \
  -e MONGO_URI="mongodb+srv://user:password@cluster.mongodb.net/hospital_db" \
  -e JWT_SECRET="your-secret-key" \
  hospital-backend:latest
```

## Deployment Guide

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)

### Render Deployment

1. Push code to GitHub
2. Create Web Service on Render.com
3. Connect GitHub repository
4. Set environment variables:
   - `MONGO_URI`
   - `JWT_SECRET`
5. Render will auto-build and deploy

### AWS/Kubernetes Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for comprehensive guide

## Production Checklist

Before deploying to production, see [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)

Key points:
- [ ] Update JWT_SECRET with strong random value
- [ ] Configure production MongoDB instance
- [ ] Set FRONTEND_URL for CORS
- [ ] Enable monitoring and alerting
- [ ] Configure backups
- [ ] Test all endpoints

## Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MONGO_URI` | Yes | - | MongoDB connection string |
| `MONGO_DB` | No | hospital_db | Database name |
| `JWT_SECRET` | Yes | - | JWT signing secret |
| `PORT` | No | 8080 | Server port |
| `FRONTEND_URL` | No | http://localhost:5173 | Frontend origin for CORS |

### Application Properties

See `src/main/resources/application.properties` for detailed configuration

## Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/hms/backend/
│   │   │   ├── BackendApplication.java
│   │   │   ├── controller/          # REST endpoints
│   │   │   ├── entity/              # MongoDB documents
│   │   │   ├── repository/          # Data access layer
│   │   │   ├── security/            # JWT utilities
│   │   │   └── config/              # Spring configuration
│   │   └── resources/
│   │       └── application.properties
│   └── test/
├── Dockerfile
├── pom.xml
├── .env.example
├── DEPLOYMENT.md
└── README.md
```

## API Response Format

### Success Response
```json
{
  "id": "123abc",
  "name": "John Doe",
  "...": "..."
}
```

### Error Response
```json
{
  "error": "Username already exists"
}
```

HTTP Status Codes:
- `200 OK` - Successful GET request
- `201 Created` - Successful POST request
- `204 No Content` - Successful DELETE request
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Invalid credentials
- `404 Not Found` - Resource not found
- `409 Conflict` - Duplicate entry
- `500 Internal Server Error` - Server error

## Troubleshooting

**MongoDB Connection Failed**
- Verify MONGO_URI format
- Check MongoDB Atlas IP whitelist
- Ensure network connectivity

**JWT Token Invalid**
- Ensure JWT_SECRET is consistent across deployments
- Check token expiration (10 hours default)

**Port Already in Use**
- Change PORT environment variable
- Kill existing process on the port

**CORS Errors**
- Update FRONTEND_URL environment variable
- Check browser console for exact error

## Development

### Running Tests

```bash
mvn test
```

### Code Style

- Follow Spring Framework conventions
- Use Lombok for boilerplate reduction
- Add javadoc for public methods

### Logging

Logs are configured in `application.properties`:
- `com.hms` level: INFO
- Root level: WARN
- Framework level: WARN

## Security

- Passwords hashed with BCrypt (SHA-256 + salt)
- JWT tokens expire after 10 hours
- CORS enabled for frontend integration
- Input validation on all endpoints
- Role-based access control

## Performance

- MongoDB connection pool: 5-10 connections
- G1 garbage collector for efficient memory management
- Async processing where applicable
- Database indexing enabled

## Monitoring

Health endpoints:
- `/api/health` - Application health
- `/api/health/ready` - Readiness for traffic
- `/api/health/live` - Liveness check
- `/actuator/health` - Spring Boot Actuator
- `/actuator/metrics` - Application metrics

## Contributing

1. Create a feature branch
2. Make changes and commit
3. Push to GitHub
4. Create pull request
5. Ensure all tests pass

## License

This project is part of the Hospital Management System suite.

## Support

For issues or questions, create an issue in the GitHub repository.

## Version History

- **v0.0.1** (2026-05-25) - Initial release
  - All CRUD operations for Patients, Doctors, Appointments
  - JWT-based authentication
  - Role-based access control
  - Docker support
  - Health check endpoints

---

**Last Updated**: 2026-05-25
**Status**: Production Ready ✅
