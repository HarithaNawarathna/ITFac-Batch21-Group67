# QA Training App

A Spring Boot application for QA training with MySQL database.

## Prerequisites

- Docker
- Docker Compose

## Getting Started

### 1. Start the Application

```bash
docker-compose up --build
```

### 2. Access the Application

- Application: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui.html
- API Docs: http://localhost:8080/v3/api-docs

### 3. Stop the Application

```bash
docker-compose down
```

## Database

- MySQL runs in a Docker container
- Database: `qa_training`
- Port: `3306`
- Username: `root`
- Password: `password`

## Useful Commands

```bash
# Run in background
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop and remove volumes (deletes database data)
docker-compose down -v

# Restart services
docker-compose restart
```

## Troubleshooting

If you encounter issues:

1. Make sure Docker is running
2. Check if ports 8080 and 3306 are available
3. Try removing old containers: `docker-compose down -v`
4. Rebuild from scratch: `docker-compose up --build --force-recreate`


## Running tests

The automated test suite is located in the `test_cases` directory (it uses Maven). Basic Java/Maven knowledge is required.

Prerequisites:
- Java 11+ (or the Java version required by the project)
- Maven (installed and on your PATH)
- The application under test should be running if the tests target the live API (recommended).

Common workflows:

1) Run tests against a running application (recommended)

- Start the app and DB in the background:

```bash
docker-compose up -d --build
```

- Run all tests:

```bash
cd test_cases
mvn clean test
```

- Generate an HTML surefire report (optional):

```bash
mvn surefire-report:report
# report will be generated at test_cases/target/site/surefire-report.html
```

2) Run tests without starting the application (only for tests which don't require the app)

```bash
cd test_cases
mvn -DskipTests=false test
```

3) Run a single test class

- By class name:

```bash
cd test_cases
mvn -Dtest=LoginApiTest test
```

- By fully-qualified name (if needed):

```bash
mvn -Dtest=com.chamika.tests.LoginApiTest test
```

Where to find results:

- Console output: summary of tests
- Detailed Surefire reports: `test_cases/target/surefire-reports/`
- HTML report: `test_cases/target/site/surefire-report.html` (if generated)

Notes and troubleshooting for tests:
- If tests fail with connection errors, ensure the application and MySQL container are running and healthy (`docker-compose ps` and `docker-compose logs`).
- If tests need specific test data, make sure the DB has the expected seed data or reset volumes (`docker-compose down -v` then `docker-compose up --build`).
- To run Maven with more verbose output for debugging add `-X` (e.g. `mvn -X test`).

If you'd like, I can also:
- Add a small shell script to automate starting the app and running tests.
- Add a short section explaining how to run individual Cucumber feature files (if the test suite uses Cucumber).
