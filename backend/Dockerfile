# Build stage
FROM maven:3.9.6-eclipse-temurin-21-jammy AS build
WORKDIR /app
COPY pom.xml .
COPY ticketverse-auth-service ./ticketverse-auth-service
COPY ticketverse-event-service ./ticketverse-event-service
COPY ticketverse-booking-service ./ticketverse-booking-service
COPY ticketverse-contact-service ./ticketverse-contact-service
COPY ticketverse-gateway ./ticketverse-gateway
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /app/ticketverse-auth-service/target/*.jar auth.jar
COPY --from=build /app/ticketverse-event-service/target/*.jar event.jar
COPY --from=build /app/ticketverse-booking-service/target/*.jar booking.jar
COPY --from=build /app/ticketverse-contact-service/target/*.jar contact.jar
COPY --from=build /app/ticketverse-gateway/target/*.jar gateway.jar

EXPOSE 8080
# The CMD is overridden in render.yaml via dockerCommand
CMD ["java", "-version"]
