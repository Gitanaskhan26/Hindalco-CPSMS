# Hindalco C-PSMS MVP: System Design & Architecture

This document provides a comprehensive overview of the Hindalco Centralized Permit & Safety Management System (C-PSMS) MVP. It details the system architecture, technology stack, and functionality of its core components.

## 1. Core Features

The C-PSMS MVP is a digital permit-to-work system designed to enhance safety and efficiency at an industrial plant. Its primary features include:

-   **Dual Authentication System**: Separate, secure login flows for both employees and visitors.
-   **Role-Based Access Control (RBAC)**: The user interface and available actions adapt based on the employee's department (e.g., Security, Safety), providing relevant tools and information.
-   **Digital Permit Creation**: A streamlined form for creating work permits.
-   **AI-Powered Risk Assessment**: A Genkit-based AI flow analyzes permit descriptions to automatically assess the risk level (Low, Medium, High).
-   **Interactive Plant Map**: A live map (using Leaflet) that visualizes the real-time locations of active work permits and visitors.
-   **QR Code Generation**: Secure QR codes are generated for approved permits and visitor passes for quick validation.
-   **Visitor Pass Management**: A dedicated workflow for the Security department to request and manage visitor passes.

## 2. System Architecture

The application is built as a modern, monolithic web application using the Next.js App Router. This architecture integrates the frontend and backend into a single, cohesive codebase, simplifying development and deployment for the MVP.

![System Architecture Diagram](https://placehold.co/800x450.png?text=System%20Architecture%20Diagram)
*<p align="center" data-ai-hint="architecture diagram">Diagram outlining the flow from client to Next.js server, Genkit, and back.</p>*

-   **Frontend**: Built with **React** and **Next.js**, utilizing the App Router for routing and layout management. The UI is composed of **Server Components** by default for improved performance and **Client Components** (`'use client'`) for interactivity.
-   **Backend**: The backend is powered by **Node.js** and is fully integrated within Next.js. We use **Server Actions** to handle all data mutations (e.g., creating permits, requesting visitor passes) securely on the server without needing to write separate API endpoints.
-   **AI Integration**: Artificial intelligence capabilities are handled by **Genkit**. The `assessPermitRisk` flow is a server-side function that communicates with the Google AI platform to analyze permit data and return a structured risk assessment.
-   **Styling**: A combination of **Tailwind CSS** for utility-first styling and **ShadCN UI** for a pre-built, accessible, and themeable component library. The theme is customized to match Hindalco's branding guidelines.
-   **State Management**: Global user authentication and session state are managed using **React Context API** (`UserProvider`). For complex form state, we use **React Hook Form** with **Zod** for schema validation.
-   **Database (Mocked)**: In this MVP, the database is simulated using mock data arrays stored in the `src/lib/` directory. These files export functions that mimic database queries.

### MVP vs. Production Architecture

It is important to note the distinction between the current prototype architecture and the proposed architecture for a full-scale production deployment.

-   **Current MVP Architecture**: The application uses a **monolithic Next.js structure**. The backend logic (Server Actions) is tightly coupled with the frontend framework. This is highly efficient for rapid prototyping and development.
-   **Proposed Production Architecture**: For a production model, a more scalable, decoupled architecture is recommended. This would involve:
    -   A dedicated **backend service** built with **Node.js and Express.js**.
    -   A **PostgreSQL** database managed with the **Prisma ORM**.
    -   The Next.js frontend would communicate with the backend via a secure **REST or GraphQL API**.
    This separation of concerns provides better scalability, maintainability, and allows for independent development and deployment of the frontend and backend services.

## 3. Technology Stack

| Category      | Technology                                    | Purpose                                                                          |
| ------------- | --------------------------------------------- | -------------------------------------------------------------------------------- |
| **Framework**   | [Next.js](https://nextjs.org/) (App Router)   | Full-stack React framework for frontend, backend (Node.js), and routing.         |
| **Language**    | [TypeScript](https://www.typescriptlang.org/) | Adds static typing to JavaScript for improved code quality and maintainability.  |
| **UI Library**  | [React](https://react.dev/)                   | Core library for building the user interface.                                    |
| **Styling**     | [Tailwind CSS](https://tailwindcss.com/)      | A utility-first CSS framework for rapid UI development.                            |
| **Components**  | [ShadCN UI](https://ui.shadcn.com/)           | A collection of accessible, re-usable, and beautifully designed UI components.   |
| **AI**          | [Genkit](https://firebase.google.com/docs/genkit) | Google's framework for building production-ready AI-powered features.        |
| **Mapping**     | [Leaflet](https://leafletjs.com/)             | An open-source JavaScript library for interactive maps.                            |
| **Validation**  | [Zod](https://zod.dev/)                       | TypeScript-first schema validation for forms and API responses.                  |
| **Forms**       | [React Hook Form](https://react-hook-form.com/) | Performant and flexible library for managing form state and validation.          |

**Note on Production Stack:** The technology choices above reflect the current prototype. As detailed in the architecture section, a production version of this application would evolve to use a dedicated **Node.js + Express.js backend** with a **PostgreSQL** database and **Prisma ORM**, separating it from the Next.js frontend.

---

## 4. Project Structure & Component Breakdown

The project follows a standard Next.js App Router structure.

```
src
├── ai/
│   ├── flows/assess-permit-risk.ts   # Genkit flow for AI risk assessment.
│   └── genkit.ts                     # Genkit configuration.
├── app/
│   ├── (dashboard)/                  # Route group for pages with the main layout.
│   │   ├── page.tsx                  # Main dashboard.
│   │   ├── map/page.tsx              # Live plant map view.
│   │   ├── permits/page.tsx          # Page to view all permits.
│   │   └── scan/page.tsx             # QR code scanning interface.
│   ├── login/page.tsx                # Employee login page.
│   ├── visitor/page.tsx              # Dedicated dashboard for a logged-in visitor.
│   └── layout.tsx                    # Root layout for the entire application.
├── components/
│   ├── ui/                           # ShadCN UI components.
│   ├── app-wrapper.tsx               # Handles auth redirects and layout switching.
│   ├── hindalco-header.tsx           # Main application header and navigation.
│   ├── map-view.tsx                  # The interactive Leaflet map component.
│   ├── permit-form.tsx               # Dialog for creating a new work permit.
│   └── visitor-request-form.tsx      # Dialog for requesting a visitor pass.
├── context/
│   └── user-context.tsx              # React Context for managing user session.
├── lib/
│   ├── actions.ts                    # Server Actions (backend logic for mutations).
│   ├── data.ts                       # Mock database for permits.
│   ├── employee-data.ts              # Mock database for employees.
│   ├── visitor-data.ts               # Mock database for visitors.
│   └── types.ts                      # Central TypeScript type definitions.
└── ...
```

### Key Component Functionality

-   **`user-context.tsx`**: Manages the global authentication state. It handles login/logout logic, persists the user session to `localStorage`, and provides user data to all components.
-   **`app-wrapper.tsx`**: A critical component that wraps all pages. It reads the user state from `UserContext` and performs necessary redirects (e.g., sending unauthenticated users to the login page).
-   **Login Pages (`app/login/**`)**: Client components that handle user input for authentication. They call the respective login functions from `UserContext` and display feedback using toasts.
-   **Dashboard (`app/page.tsx`)**: The central hub for employees. It uses **Role-Based Access Control (RBAC)** to conditionally render components.
    -   **Safety Dept**: Sees a "High-Risk Permits for Review" card.
    -   **Security Dept**: Sees a "Request Visitor Pass" button.
-   **`permit-form.tsx`**: A dialog containing a form managed by `react-hook-form`. On submission, it calls the `createPermit` Server Action.
-   **`actions.ts`**: Contains the backend logic. The `createPermit` function validates input using Zod, calls the `assessPermitRisk` AI flow, and simulates saving a new permit. This file runs **only on the server**.
-   **`map-view.tsx`**: A client component that dynamically imports and renders a Leaflet map. It receives permit and visitor data as props and is responsible for rendering custom markers (pins for permits, glowing dots for visitors).
-   **`visitor-page.tsx`**: A dedicated view for a logged-in visitor, displaying their digital pass with a QR code and continuously tracking their location in the background (while the tab is open).

## 5. Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Environment Variables

You will need a Google AI API key to run the AI risk assessment feature.

1.  Create a file named `.env` in the root of the project.
2.  Add your API key to the file:
    ```
    GOOGLE_API_KEY=your_google_ai_api_key_here
    ```

### Installation & Running

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Run the development server:**
    The application runs on `http://localhost:9002`.
    ```bash
    npm run dev
    ```

## 6. Future Improvements

-   **Production Backend & Database Integration**: Transition from the integrated Next.js backend to a dedicated **Node.js + Express.js** service. Replace the mock data files in `src/lib/` with a real database connection to **PostgreSQL**, managed by **Prisma ORM**.
-   **Real-time Notifications**: Implement a real-time notification system (e.g., using WebSockets or a service like Firebase) for permit approvals and visitor requests.
-   **Full Visitor Approval Workflow**: Build the UI for department heads to approve or reject visitor pass requests.
-   **QR Code Scanning Logic**: Implement the client-side logic in `scan/page.tsx` to use the camera feed to read QR codes and validate them against the backend.
-   **Background Location on Mobile**: For true background location tracking, the application would need to be built as a native mobile app (e.g., using React Native), as web browsers have strict limitations.
