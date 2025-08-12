# Hindalco C-PSMS: Alternate Production Blueprint (Spring Boot Backend)

## 1. Executive Summary

This document outlines an alternate enterprise-grade system architecture for the Hindalco Centralized Permit & Safety Management System (C-PSMS), proposing a backend built with **Spring Boot (Java)**. The current application is a prototype developed with a monolithic Next.js structure. For a production-level deployment requiring enterprise-grade stability, security, and integration capabilities, a decoupled architecture featuring a Spring Boot backend and a Next.js frontend is a powerful and common industry pattern.

This blueprint details this decoupled, service-oriented architecture, leveraging the strengths of the Java ecosystem for the backend and Next.js for the frontend presentation layer.

**Core Architectural Goals:**

*   **Enterprise-Grade Reliability:** Leverage the stability and battle-tested nature of the Spring Framework for mission-critical backend operations.
*   **Scalability & Performance:** Independently scale the stateless Spring Boot backend and the Next.js frontend.
*   **Enhanced Security:** Utilize the comprehensive and mature security features of Spring Security.
*   **Maintainability & Talent Pool:** Tap into the vast ecosystem and talent pool available for Java and Spring Boot development.

## 2. High-Level System Architecture

The production architecture transitions from the MVP's monolithic model to a decoupled system. The primary change from the other blueprint is the replacement of the Node.js backend with a **Spring Boot REST API**.

```
+----------------+      +------------------+
| User (Browser) |      | Security (Mobile)|
+----------------+      +------------------+
       |                        |
       v (HTTPS)                v (HTTPS)
+-------------------------------------------------+
|              Load Balancer (Cloud)              |
+-------------------------------------------------+
       |                                |
 (serves web app)                 (proxies API requests)
       |                                |
       v                                v
+----------------------+        +--------------------------------------+
| Next.js Frontend     |        |     Spring Boot Backend API Service    |
| (Hosted on Vercel)   |        | (Hosted on Cloud Run / GKE / Fargate)|
|----------------------|        |--------------------------------------|
| - UI Rendering       |        | [ @RestController (API Endpoints) ]  |
| - Client-side State  |<------>| [ Middleware (Spring Security Filters) ]|
| - API Communication  |  (JWT) | [ @Service (Business Logic) ]        |
+----------------------+        | [ @Repository (Spring Data JPA) ]    |
                                +-----------------|--------------------+
                                      |           |           |
                                      v           v           v
                          +-----------+-----------+-----------+
                          |           |           |           |
+----------------+  +-----------+ +--------+ +--------------+ +-------------+
| PostgreSQL DB  |  | Google AI | | Redis  | | Object Store | | QR / Maps   |
| (Cloud SQL/RDS)|  | (Java SDK)| | Cache  | | (S3/GCS)     | | Services    |
+----------------+  +-----------+ +--------+ +--------------+ +-------------+

```

## 3. Frontend Architecture (Next.js)

The frontend architecture remains largely the same as in the Node.js blueprint. It will be a pure presentation layer communicating with the Spring Boot backend API.

*   **Framework:** **Next.js (App Router)**.
*   **State Management:**
    *   **Server State & Caching:** **SWR** or **React Query** for managing data from the backend.
    *   **Global Client State:** **React Context** for authentication state (user object, JWT).
    *   **Form State:** **React Hook Form** with **Zod** for schema validation.
*   **Component Strategy:**
    *   **Server Components:** Default for non-interactive content.
    *   **Client Components (`'use client'`):** Used for interactivity (forms, maps, etc.).
*   **API Communication:** A dedicated API client module (e.g., using `axios`) will be created to communicate with the Spring Boot REST API. It will handle attaching the JWT `Authorization: Bearer <token>` header and centralized error handling.
*   **Deployment:** **Vercel** is the recommended platform for hosting the Next.js frontend.

## 4. Backend Architecture (Spring Boot + Java/Kotlin)

The backend will be a stateless, horizontally scalable REST API service built with Spring Boot.

*   **Framework:** **Spring Boot** with **Java** (or Kotlin). This stack is chosen for its robustness, dependency injection, vast library support (Spring Projects), and strong performance for enterprise applications.
*   **API Design:** A versioned **RESTful API** (e.g., `/api/v1/...`). API specifications will be documented using **SpringDoc-OpenAPI (Swagger)** for automatic, code-first API documentation.
*   **Authentication & Authorization:**
    *   **Framework:** **Spring Security**. Provides a comprehensive and highly customizable authentication and authorization framework.
    *   **Authentication:** **JSON Web Tokens (JWT)**.
        1.  User submits credentials to `/api/v1/auth/login`.
        2.  A custom `AuthenticationProvider` validates credentials against the database.
        3.  Upon success, a `JwtService` generates a short-lived **Access Token** and a long-lived, securely stored **Refresh Token**.
        4.  A custom filter in the Spring Security filter chain will validate the JWT on every incoming request to a protected endpoint.
    *   **Authorization:** **Role-Based Access Control (RBAC)** will be implemented using Spring Security's method-level security. Annotations like `@PreAuthorize("hasRole('SAFETY_OFFICER')")` will be used on service methods or controller endpoints to protect them.
*   **Database & ORM:**
    *   **Database:** **PostgreSQL** on a managed service (**Google Cloud SQL** or **Amazon RDS**).
    *   **ORM:** **Spring Data JPA** with **Hibernate** as the persistence provider. This simplifies data access layer creation through a powerful repository pattern.
*   **Core Database Entities (Example):**
    ```java
    @Entity
    @Table(name = "permits")
    public class Permit {
        @Id
        private String id;
        private String description;
        // ... other fields
        
        @ManyToOne
        @JoinColumn(name="issued_by_id")
        private User issuedBy;
    }
    ```
*   **AI Integration Note:** The Genkit TypeScript flow would be replaced. A new `@Service` class in Spring Boot (e.g., `GoogleAiService`) would use the **Google Cloud AI Platform Java SDK**. This service would be responsible for calling the Gemini model with the appropriate prompt to assess permit risk. The `GOOGLE_API_KEY` would be securely managed via Spring Boot's externalized configuration (e.g., environment variables or a secret manager).
*   **Service-Oriented Structure:**
    *   `@RestController`: Handles HTTP requests, maps them to DTOs, and calls services.
    *   `@Service`: Contains the core business logic (e.g., `PermitService`, `AuthService`). Transactions are typically managed at this layer with `@Transactional`.
    *   `@Repository`: Spring Data JPA interfaces for database operations (e.g., `PermitRepository extends JpaRepository<Permit, String>`).
    *   `DTOs (Data Transfer Objects)`: Plain Java objects used to transfer data between the API layer and the service layer, preventing exposure of internal entity models.

## 5. Infrastructure & DevOps

*   **Hosting:**
    *   **Frontend:** Vercel.
    *   **Backend:** The Spring Boot application will be packaged as a **containerized Docker image**. This image will be deployed to a scalable container platform like **Google Cloud Run**, **AWS Fargate**, or a Kubernetes cluster (**Google Kubernetes Engine**, **Amazon EKS**).
*   **Database:** **Google Cloud SQL** or **Amazon RDS** for managed PostgreSQL.
*   **Caching:** A managed **Redis** instance for caching sessions or frequently accessed data.
*   **Object Storage:** **Google Cloud Storage** or **Amazon S3** for storing generated PDFs and other assets.
*   **CI/CD Pipeline:** A **GitHub Actions** workflow with two separate deployment jobs:
    1.  **Frontend Job:** Builds, tests, and deploys the Next.js app to Vercel.
    2.  **Backend Job:** Uses **Maven** or **Gradle** to build the Spring Boot application (a `.jar` file), creates a Docker image, runs integration tests, pushes the image to a container registry (GCR/ECR), and deploys the new version to the backend hosting service.
*   **Logging & Monitoring:** Integrate with an observability platform like **Datadog** or **New Relic**. The Spring Boot application will use **Micrometer** for metrics and **SLF4J with Logback/Log4j2** for logging, which can then be forwarded to a centralized logging service.

## 6. Data Flow Example: Creating a New Permit

1.  **User Action:** An employee submits the `PermitForm` in the Next.js frontend.
2.  **Frontend:** The API client sends a `POST` request to the Spring Boot backend at `/api/v1/permits` with a DTO payload and the user's JWT.
3.  **Backend (Controller):** The `@RestController` receives the request. The Spring Security filter chain has already validated the JWT. The controller validates the DTO (`@Valid` annotation).
4.  **Backend (Service Layer):** The `@Service`-annotated `PermitService` is called. It orchestrates the process:
    a. It calls the `GoogleAiService` to get the risk assessment from the Google AI Platform.
    b. It constructs a new `Permit` entity object with the data.
5.  **Backend (Data Layer):** The `PermitService` calls `permitRepository.save(newPermit)`. Spring Data JPA and Hibernate translate this into a SQL `INSERT` statement and execute it within a transaction.
6.  **Backend (Response):** The API returns a `201 Created` response to the frontend, containing the newly created permit data (as a DTO).
7.  **Frontend (UI Update):** The frontend's SWR/React Query cache is updated with the new permit, causing the UI to re-render and show the new permit.
