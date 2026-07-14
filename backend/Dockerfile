# Build stage
FROM maven:3.9.6-eclipse-temurin-21-jammy AS build
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
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /app/ticketverse-auth-service/target/*.jar auth.jar
COPY --from=build /app/ticketverse-event-service/target/*.jar event.jar
COPY --from=build /app/ticketverse-booking-service/target/*.jar booking.jar
COPY --from=build /app/ticketverse-contact-service/target/*.jar contact.jar
COPY --from=build /app/ticketverse-gateway/target/*.jar gateway.jar
COPY --from=build /app/ticketverse-notification-service/target/*.jar notification.jar
COPY --from=build /app/ticketverse-analytics-service/target/*.jar analytics.jar
COPY --from=build /app/ticketverse-audit-service/target/*.jar audit.jar

EXPOSE 8080
# The CMD is overridden in render.yaml via dockerCommand
CMD ["java", "-version"]
