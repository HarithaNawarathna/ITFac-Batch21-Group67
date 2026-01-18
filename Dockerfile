# Use Eclipse Temurin 21 as base image (matches compiled JAR version)
FROM eclipse-temurin:21-jdk

# Set working directory
WORKDIR /app

# Copy the JAR file
COPY qa-training-app.jar app.jar

# Copy application properties
COPY application.properties application.properties

# Expose port 8080
EXPOSE 8080

# Set environment variables for database connection
ENV SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/qa_training?useSSL=false&allowPublicKeyRetrieval=true
ENV SPRING_DATASOURCE_USERNAME=root
ENV SPRING_DATASOURCE_PASSWORD=password

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]