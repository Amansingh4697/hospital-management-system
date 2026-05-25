# ── Build stage ───────────────────────────────────────────────
# Build with JDK, compile and package the application
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src

# Install Maven
RUN apk add --no-cache maven
RUN mvn clean package -DskipTests

# ── Run stage ──────────────────────────────────────────────────
# Run with lightweight JRE only
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
VOLUME /tmp

# Copy the compiled JAR from build stage
COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar app.jar

# Health check for container orchestration
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

# Run the application with proper Java settings
# -XX:+UseG1GC for garbage collection
# -XX:MaxRAMPercentage=75.0 to use 75% of container memory
ENTRYPOINT ["java", "-XX:+UseG1GC", "-XX:MaxRAMPercentage=75.0", "-jar", "/app/app.jar"]
