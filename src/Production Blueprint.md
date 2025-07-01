
# Hindalco C-PSMS: Production Architecture Blueprint

## 1. Executive Summary

This document outlines the proposed enterprise-grade system architecture for the Hindalco Centralized Permit & Safety Management System (C-PSMS). The current application is a rapidly developed MVP using a monolithic Next.js structure with a mock database. To support a full-scale, production-level deployment, a more robust, scalable, and maintainable architecture is required.

This blueprint details a decoupled, service-oriented architecture, separating the frontend presentation layer from the backend business logic and data persistence layers.

**Core Architectural Goals:**

*   **Scalability:** Independently scale the frontend and backend services to handle fluctuating loads.
*   **Reliability:** Ensure high availability and fault tolerance through redundancy and managed services.
*   **Maintainability:** Enable parallel development, simplified updates, and a clear separation of concerns.
*   **Security:** Implement a defense-in-depth security strategy, protecting data at every layer.

## 2. High-Level System Architecture

The production architecture transitions from the MVP's monolithic model to a decoupled system comprising a **Next.js Frontend**, a **Node.js Backend API**, a **PostgreSQL Database**, and other managed cloud services.

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
| Next.js Frontend     |        |      Node.js Backend API Service     |
| (Hosted on Vercel)   |        | (Hosted on Cloud Run / AWS Fargate)  |
|----------------------|        |--------------------------------------|
| - UI Rendering       |        | [ Controllers (API Endpoints) ]      |
| - Client-side State  |<------>| [ Middleware (Auth, Validation) ]    |
| - API Communication  |  (JWT) | [ Service Layer (Business Logic) ]   |
+----------------------+        | [ Data Access Layer (Prisma ORM) ]   |
                                +-----------------|--------------------+
                                      |           |           |
                                      v           v           v
                          +-----------+-----------+-----------+
                          |           |           |           |
+----------------+  +-----------+ +--------+ +--------------+ +-------------+
| PostgreSQL DB  |  | Google AI | | Redis  | | Object Store | | QR / Maps   |
| (Cloud SQL/RDS)|  | (Genkit)  | | Cache  | | (S3/GCS)     | | Services    |
+----------------+  +-----------+ +--------+ +--------------+ +-------------+

```

## 3. Frontend Architecture (Next.js)

The frontend will be a pure presentation layer, responsible for rendering the UI and communicating with the backend API.

*   **Framework:** **Next.js (App Router)**. Chosen for its performance benefits (Server Components), optimized builds, and excellent developer experience.
*   **State Management:**
    *   **Server State & Caching:** **SWR** or **React Query** will be used to manage all data fetched from the backend API. This provides automatic caching, revalidation, and a streamlined approach to data fetching, reducing boilerplate and improving UI consistency.
    *   **Global Client State:** **React Context** (as currently implemented with `UserProvider`) will manage the global authentication state (e.g., the logged-in user object and JWT).
    *   **Form State:** **React Hook Form** with **Zod** for schema validation remains the ideal choice for managing complex form states efficiently and safely.
*   **Component Strategy:**
    *   **Server Components:** The default for all pages and components that display data but do not require user interactivity. This minimizes the client-side JavaScript bundle size.
    *   **Client Components (`'use client'`):** Used only where necessary for interactivity, such as forms (`PermitForm`), the interactive map (`MapView`), and components with `useEffect` or `useState` hooks.
*   **API Communication:** A dedicated API client module will be created (e.g., using `axios` or a custom `fetch` wrapper). This client will automatically attach the JWT `Authorization` header to all outgoing requests and handle response interceptors for centralized error handling (e.g., logging out the user on a 401 Unauthorized response).
*   **Deployment:** **Vercel** is the recommended platform for hosting the Next.js frontend. It offers seamless integration, automatic CI/CD, global CDN, and serverless function support for the Next.js backend routes.

## 4. Backend Architecture (Node.js + Express.js)

The backend will be a stateless, horizontally scalable REST API service responsible for all business logic, data persistence, and secure communication with external services.

*   **Framework:** **Node.js** with **Express.js** and **TypeScript**. This stack is chosen for its high performance with I/O-bound operations, a vast ecosystem of libraries, and language consistency with the frontend team.
*   **API Design:** A versioned **RESTful API** (e.g., `/api/v1/...`). API specifications will be documented using the **OpenAPI 3.0 (Swagger)** standard to ensure clear communication between frontend and backend teams.
*   **Authentication & Authorization:**
    *   **Authentication:** **JSON Web Tokens (JWT)**.
        1.  User submits credentials to `/api/v1/auth/login`.
        2.  Server validates credentials against the database.
        3.  Server issues a short-lived **Access Token** (e.g., 15 minutes) and a long-lived, securely stored **Refresh Token** (e.g., 7 days).
        4.  The frontend stores these tokens securely (Access Token in memory, Refresh Token in an HttpOnly cookie). The Access Token is sent in the `Authorization: Bearer <token>` header with every API request.
    *   **Authorization:** **Role-Based Access Control (RBAC)** will be implemented via Express middleware. Protected routes will verify the JWT and check the user's role (e.g., `Safety Officer`, `Security`, `Employee`) from the token's payload against the required permission for that endpoint.
*   **Database & ORM:**
    *   **Database:** **PostgreSQL**. A powerful, open-source relational database known for its reliability, data integrity, and robust feature set. It will be hosted on a managed service like **Google Cloud SQL** or **Amazon RDS** for automated backups, scaling, and maintenance.
    *   **ORM:** **Prisma**. Provides a type-safe database client and a powerful migration system, making database interactions safe, intuitive, and easy to manage.
*   **Core Database Schema:**
    *   `User`: Stores employee and visitor information, credentials, and role ID.
    *   `Role`: Defines roles (e.g., `Admin`, `Safety`, `Security`).
    *   `Permit`: Stores all permit data, including foreign keys to the issuing and approving users.
    *   `PermitStatusHistory`: Tracks all status changes for a permit.
    *   `VisitorRequest`: Manages requests for visitor passes.
    *   `Notification`: Stores user-specific notifications.
*   **AI Integration (Genkit):** The `assessPermitRisk` Genkit flow will be called exclusively from the backend's `PermitService`. The `GOOGLE_API_KEY` will be stored securely as an environment variable on the backend server, never exposed to the frontend.
*   **Service-Oriented Structure:**
    *   `Controllers`: Handle incoming HTTP requests, validate input, and call the appropriate services.
    *   `Services`: Contain the core business logic (e.g., `PermitService.create()`, `AuthService.login()`).
    *   `Data Access Layer`: All direct database interactions are performed through Prisma models.

## 5. Infrastructure & DevOps

*   **Hosting:**
    *   **Frontend:** Vercel.
    *   **Backend:** A containerized Docker image of the Node.js app deployed to a serverless container platform like **Google Cloud Run** or **AWS Fargate**. This provides auto-scaling and simplified management.
*   **Database:** **Google Cloud SQL** or **Amazon RDS** for a managed PostgreSQL instance.
*   **Caching:** A managed **Redis** instance (e.g., Memorystore, ElastiCache) will be used to cache user sessions and frequently accessed, non-critical data to reduce database load.
*   **Object Storage:** **Google Cloud Storage** or **Amazon S3** will be used to store generated PDF files for permits/passes and any user-uploaded content like avatars. This is more cost-effective and scalable than storing files in the database.
*   **CI/CD Pipeline:** A **GitHub Actions** workflow will be configured with two separate deployment jobs:
    1.  **Frontend Job:** On a push to the `main` branch, automatically builds, tests, and deploys the Next.js app to Vercel.
    2.  **Backend Job:** On a push to the `main` branch, builds the Docker image, runs tests, pushes the image to a container registry (GCR/ECR), and deploys the new version to the backend hosting service (Cloud Run/Fargate).
*   **Logging & Monitoring:** An observability platform like **Datadog**, **New Relic**, or a cloud-native solution (**AWS CloudWatch**, **Google Cloud's Operations Suite**) will be integrated for centralized logging, error tracking, and performance monitoring of both frontend and backend services.

## 6. Data Flow Example: Creating a New Permit

1.  **User Action:** An employee fills out the `PermitForm` in the Next.js frontend and clicks "Submit".
2.  **Frontend:** The API client sends a `POST` request to the backend at `/api/v1/permits` with the form data and the user's JWT in the `Authorization` header.
3.  **Backend (API Gateway/Controller):** The backend receives the request. The auth middleware validates the JWT. The controller validates the request body using Zod.
4.  **Backend (Service Layer):** The `PermitService` is called. It invokes the `assessPermitRisk` Genkit flow to get the risk level and justification from the Google AI Platform.
5.  **Backend (Data Layer):** The `PermitService` constructs the full permit object and uses Prisma to save the new permit record to the **PostgreSQL** database. It also creates notification records for all relevant safety officers.
6.  **Backend (Response):** The API sends a `201 Created` response back to the frontend, containing the newly created permit object.
7.  **Frontend (UI Update):** The frontend's SWR/React Query cache is automatically updated with the new permit data, causing the UI to re-render in real-time to show the new permit in the list.

