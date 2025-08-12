# Hindalco C-PSMS Backend

## Overview

The Hindalco Centralized Permit & Safety Management System (C-PSMS) backend is built using Spring Boot, providing a robust and scalable REST API for managing permits and user authentication. This project aims to facilitate the management of permits while ensuring security and performance.

## Features

- **RESTful API**: A complete set of endpoints for managing permits and user authentication.
- **JWT Authentication**: Secure user authentication using JSON Web Tokens.
- **Role-Based Access Control**: Different user roles with specific permissions.
- **Integration with Google AI**: Risk assessment for permits using Google AI services.
- **Database Management**: Utilizes PostgreSQL with Spring Data JPA for data persistence.

## Project Structure

The project follows a standard Spring Boot structure:

```
src
├── main
│   ├── java
│   │   └── com
│   │       └── hindalco
│   │           └── cpsms
│   │               ├── CpsmsApplication.java
│   │               ├── config
│   │               ├── controller
│   │               ├── dto
│   │               ├── entity
│   │               ├── repository
│   │               ├── service
│   │               ├── security
│   │               └── exception
│   └── resources
│       ├── application.yml
│       ├── application-dev.yml
│       ├── application-prod.yml
│       └── db
│           └── migration
│               └── V1__Initial_schema.sql
└── test
    └── java
        └── com
            └── hindalco
                └── cpsms
```

## Getting Started

### Prerequisites

- Java 11 or higher
- Maven
- PostgreSQL
- Docker (optional)

### Setup Instructions

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd hindalco-cpsms-backend
   ```

2. **Configure the database**:
   Update the `application.yml` file with your PostgreSQL database credentials.

3. **Run the application**:
   You can run the application using Maven:
   ```
   mvn spring-boot:run
   ```

4. **Docker Setup** (optional):
   Build the Docker image:
   ```
   docker build -t hindalco-cpsms-backend .
   ```
   Run the Docker container:
   ```
   docker run -p 8080:8080 hindalco-cpsms-backend
   ```

### API Documentation

API endpoints are documented using Swagger. Access the documentation at:
```
http://localhost:8080/swagger-ui.html
```

## Testing

Unit tests are included in the project. You can run the tests using Maven:
```
mvn test
```

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.