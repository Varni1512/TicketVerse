# Build stage
FROM maven:3.9.6-eclipse-temurin-17-jammy AS build
WORKDIR /app
COPY pom.xml .
COPY ticketverse-auth-service ./ticketverse-auth-service
COPY ticketverse-event-service ./ticketverse-event-service
COPY ticketverse-booking-service ./ticketverse-booking-service
COPY ticketverse-contact-service ./ticketverse-contact-service
COPY ticketverse-gateway ./ticketverse-gateway
COPY ticketverse-notification-service ./ticketverse-notification-service
COPY ticketverse-analytics-service ./ticketverse-analytics-service
COPY ticketverse-audit-service ./ticketverse-audit-service
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jre-jammy
ARG SERVICE_NAME
WORKDIR /app
COPY --from=build /app/${SERVICE_NAME}/target/*.jar app.jar

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]
