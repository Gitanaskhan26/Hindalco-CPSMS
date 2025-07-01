# Hindalco C-PSMS MVP: System Design & Architecture

This document provides a comprehensive overview of the Hindalco Centralized Permit & Safety Management System (C-PSMS) MVP. It details the system architecture, technology stack, and functionality of its core components.

## 1. Core Features

The C-PSMS MVP is a digital permit-to-work system designed to enhance safety and efficiency at an industrial plant. Its primary features include:

-   **Dual Authentication System**: Separate, secure login flows for both employees and visitors. Employees use their official code and date of birth, while visitors use a pre-issued ID, ensuring that access is segregated and appropriate for each user type.
-   **Role-Based Access Control (RBAC)**: The user interface and available actions adapt based on the employee's department (e.g., Security, Safety), providing relevant tools and information. For instance, the Security department can request visitor passes, while the Safety department gets a prioritized view of high-risk permits needing review.
-   **Digital Permit Creation**: A streamlined form for creating work permits. This form captures essential details like work description and required Personal Protective Equipment (PPE).
-   **AI-Powered Risk Assessment**: A Genkit-based AI flow analyzes permit descriptions to automatically assess the risk level (Low, Medium, High). This provides an instant, consistent, and unbiased initial safety assessment, flagging potentially dangerous tasks for human review.
-   **Interactive Plant Map**: A live map (using Leaflet) that visualizes the real-time locations of active work permits and visitors. Permits are displayed as color-coded pins based on risk level, and visitors are shown as glowing dots, providing immediate situational awareness for all personnel.
-   **QR Code Generation**: Secure QR codes are generated for approved permits and visitor passes for quick validation. This eliminates paperwork and allows security personnel to instantly verify the status and details of any permit or visitor on-site.
-   **Visitor Pass Management**: A dedicated workflow for the Security department to request and manage visitor passes. The system captures visitor details and the purpose of their visit, which can then be routed for approval.

## 2. System Architecture

The application is built as a modern, monolithic web application using the Next.js App Router. This architecture integrates the frontend and backend into a single, cohesive codebase, simplifying development and deployment for the MVP.

```
+----------------+
| User (Browser) |
+----------------+
       |
       v (HTTPS)
+-----------------------------------------------------------+
|             Next.js Application (on Node.js)              |
|-----------------------------------------------------------|
|                                                           |
| [ Frontend: React Components, UI/UX (ShadCN, Tailwind) ]  |
|         (Client-side Interactivity, Rendering)            |
|                                                           |
|                      ^          |                         |
| (Rendered HTML/CSS)  |          v (Calls Server Actions)  |
|                      |                                    |
| [ Backend: Server Logic & Data Fetching (`'use server'`) ]|
|   (Handles mutations, business logic, auth checks)        |
|         |                  |                   |          |
+---------|------------------|-------------------|----------+
          | (Server-side)    | (Server-side)     | (Server-side)
          v                  v                   v
+-----------------+  +-----------------+ +-------------------+
| Genkit AI Flow  |  | Mock Database   | | External Services |
| (assessPermit..)|  | (`/lib/*.ts`)   | |-------------------|
+-----------------+  +-----------------+ | - Leaflet Tiles   |
          |                              | - QR Server API   |
          v (API Call)                   +-------------------+
+-----------------+
| Google AI       |
| Platform        |
+-----------------+
```

-   **Frontend**: Built with **React** and **Next.js**, utilizing the App Router for routing and layout management. The UI is composed of **Server Components** by default for improved performance (as they render on the server and send minimal JavaScript to the client) and **Client Components** (`'use client'`) for pages or components requiring interactivity (e.g., forms, maps).
-   **Backend**: The backend is powered by **Node.js** and is fully integrated within Next.js. We use **Server Actions** to handle all data mutations (e.g., creating permits, requesting visitor passes) securely on the server without needing to write separate API endpoints. This code lives in files marked with `'use server';`.
-   **AI Integration**: Artificial intelligence capabilities are handled by **Genkit**. The `assessPermitRisk` flow is a server-side function that communicates with the Google AI platform to analyze permit data and return a structured risk assessment. This logic is also marked as `'use server';`, ensuring API keys and prompts are never exposed to the client.
-   **Styling**: A combination of **Tailwind CSS** for utility-first styling and **ShadCN UI** for a pre-built, accessible, and themeable component library. The theme is customized to match Hindalco's branding guidelines.
-   **State Management**: Global user authentication and session state are managed using **React Context API** (`UserProvider`). This context wraps the application and provides user data to all components through a React Context. For complex form state, we use **React Hook Form** with **Zod** for robust schema validation.
-   **Database (Mocked)**: In this MVP, the database is simulated using mock data arrays stored in the `src/lib/` directory. These files export `async` functions that mimic database queries, making it easy to swap them out for a real database connection in the future.

### MVP vs. Production Architecture

It is important to note the distinction between the current prototype architecture and the proposed architecture for a full-scale production deployment.

-   **Current MVP Architecture**: The application uses a **monolithic Next.js structure**. The backend logic (Server Actions) is tightly coupled with the frontend framework. This is highly efficient for rapid prototyping and development, as it reduces boilerplate and simplifies the data-fetching model.
-   **Proposed Production Architecture**: For a production model, a more scalable, decoupled architecture is recommended. This would involve:
    -   A dedicated **backend service** built with **Node.js and Express.js**. This service would handle all business logic, database interactions, and authentication.
    -   A **PostgreSQL** database managed with the **Prisma ORM**. PostgreSQL provides robust relational data integrity, and Prisma offers a type-safe and intuitive way to interact with the database.
    -   The Next.js frontend would communicate with the backend via a secure **REST or GraphQL API**.
    This separation of concerns provides better scalability (frontend and backend can be scaled independently), maintainability (teams can work on different services without conflict), and allows for independent development and deployment of the frontend and backend services.

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

## 4. Detailed System Workflows

This section describes the end-to-end processes for different users of the C-PSMS application.

### 4.1 Employee Workflow: Role-Based Dashboards
The employee experience is tailored to their role, providing relevant information and actions to maximize efficiency and safety.

1.  **Authentication**: An employee starts at the **`login`** page. They enter their unique Employee Code and Date of Birth. This data is handled by the `useUser` context, which calls a mock backend service (`fetchEmployeeDetails`). Upon successful validation, the employee's profile (including name, department, and designation) is stored in the React Context and persisted to `localStorage` to maintain the session. The `AppWrapper` component then redirects them to the main dashboard.

2.  **The Main Dashboard (`/page.tsx`)**: This is the central hub for employees. It provides a high-level overview of plant safety through several key components:
    *   **Stats Cards**: Display key metrics like "Active Permits," "Pending Approval," and "High Risk Today."
    *   **Recent Permits & Visitors**: Lists of the most recently created permits and currently active visitors, offering quick access to their details.

3.  **Role-Based Access Control (RBAC) in Action**: The dashboard dynamically adapts based on the logged-in employee's department, a core feature of the system:
    *   **For the Safety Department**: A prominent **"High-Risk Permits for Review"** card is displayed at the top. This card is conditionally rendered only for users in the "Safety" or "Fire and Safety" departments. It filters for permits that are both `high-risk` and `pending`, allowing safety officers to immediately prioritize and address the most critical tasks.
    *   **For the Security Department**: A **"Request Visitor Pass"** button is added to the header actions. This provides a direct shortcut to the `VisitorRequestForm` dialog, a common and critical task for the security team. This button is only visible to users in the "Security" department.
    *   All other employees see a standard view, ensuring the interface remains uncluttered and relevant to their roles.

### 4.2 Permit Creation & AI Risk Assessment
This workflow streamlines the creation of a work permit and leverages AI for an instant, unbiased risk assessment.

1.  **Initiation**: An employee clicks the "New Permit" button, which opens the **`PermitForm`** dialog.
2.  **Data Entry**: The form, managed by `react-hook-form` and validated by `zod`, captures the essential details: a description of the work to be performed and a list of the required Personal Protective Equipment (PPE).
3.  **Server Action**: Upon submission, the form doesn't make a traditional API call. Instead, it directly invokes the **`createPermit` Server Action** located in `src/lib/actions.ts`. This ensures the entire process is type-safe from front to back.
4.  **AI Analysis**: The `createPermit` action, running securely on the server, calls the **`assessPermitRisk` Genkit flow**. This AI flow takes the work description and PPE list, sends them to the Google AI platform with a specialized prompt, and receives a structured JSON response containing a `riskLevel` ('low', 'medium', or 'high') and a `justification`.
5.  **Finalization**: The server action then generates a unique permit ID, creates a QR code URL containing the permit's essential data, and combines all this information into a new `Permit` object.
6.  **UI Update**: The `createPermit` action returns the newly created permit object to the client-side component, which then updates the application's state, adding the new permit to the list and map in real-time.

### 4.3 Visitor Workflow: Secure Access & Live Tracking
This process ensures that visitors are properly authenticated and their location is tracked while on-site.

1.  **Visitor Authentication**: Visitors use a separate, streamlined login page at **`/login/visitor`**. They enter a pre-issued Visitor ID and their Date of Birth.
2.  **Geolocation & QR Code Generation**: Upon successful login, the application immediately requests access to the user's device location via the browser's Geolocation API.
    *   **If Successful**: The visitor's latitude and longitude are captured and stored in their session. This location data is essential for generating a valid QR code for their digital pass.
    *   **If Denied or Failed**: The user is still logged in, but a prominent alert appears on their page explaining that location access is required to generate the QR code pass. This prevents visitors from moving around the facility without being trackable on the map.
3.  **The Visitor Page (`/visitor/page.tsx`)**: This page serves as the visitor's digital identity within the plant.
    *   It displays their name, photo, and the validity period of their pass.
    *   The centerpiece is the unique QR code, which security can scan for instant verification.
    *   In the background, a `useEffect` hook periodically calls `navigator.geolocation.getCurrentPosition` (e.g., every 30 seconds). If a new location is detected, it calls the `updateUserLocation` function from the `UserContext`. This updates the visitor's coordinates in the global state, ensuring their position is updated in near real-time on the main plant map.

### 4.4 The Interactive Plant Map: Centralized Situational Awareness
The map is the visual heart of the C-PSMS, providing a live overview of all activities.

-   **Visualization**: The **`MapView`** component uses the Leaflet library to display a map of the plant. It fetches all active permits and visitors and renders them as custom markers.
-   **Permit Markers**: Permits are shown as color-coded map pins (Red for High, Orange for Medium, Green for Low risk), allowing for immediate visual risk assessment.
-   **Visitor Markers**: Visitors are represented by glowing blue dots, making them easily distinguishable from work permits.
-   **Interactivity**: Clicking on any marker (permit or visitor) pans the map to center it, scales it up to indicate selection, and opens a popup with key details (like Permit ID or Visitor Name). This action also updates the state of the parent page to highlight the corresponding card in the sidebar list, creating a seamless, connected experience between the map and the list view.

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
    The application runs on `http://localhost:9003`.
    ```bash
    npm run dev
    ```

## 6. Future Improvements

-   **Production Backend & Database Integration**: Transition from the integrated Next.js backend to a dedicated **Node.js + Express.js** service. Replace the mock data files in `src/lib/` with a real database connection to **PostgreSQL**, managed by the **Prisma ORM**. This is the most critical step for moving to production.
-   **Real-time Notifications**: Implement a real-time notification system (e.g., using WebSockets or a service like Firebase Cloud Messaging) for permit approvals and visitor requests. This would provide instant feedback to users instead of them needing to refresh the page.
-   **Full Visitor Approval Workflow**: Build the UI for department heads to approve or reject visitor pass requests that are submitted by the Security department. This would involve creating a new page and updating the backend to handle the change in status.
-   **QR Code Scanning Logic**: Implement the client-side logic in `scan/page.tsx` to use the camera feed to read QR codes. This would involve adding a QR code decoding library and then using the decoded data to fetch permit/visitor details from the backend for validation.
-   **Background Location on Mobile**: For true background location tracking (even when the app isn't open), the application would need to be built as a native mobile app (e.g., using React Native), as web browsers have strict limitations on background processes to conserve battery and protect user privacy.
-   **Testing and QA**: Add a comprehensive testing suite, including unit tests for components and server actions, and end-to-end tests to simulate user flows.
-   **CI/CD Pipeline**: Set up a Continuous Integration/Continuous Deployment pipeline (e.g., using GitHub Actions) to automate testing and deployment processes.

## 7. Committing to GitHub
To commit the whole project to GitHub, follow these steps:
### Step 1: Download Your Project
Download the project files from this development environment. There should be an "Export" or "Download Code" option available in the IDE's menu that will package all the files into a `.zip` archive for you.

### Step 2: Set Up a New Repository on GitHub
Go to GitHub.com and log in.
Click the + icon in the top-right corner and select New repository.
Give your repository a name (e.g., hindalco-cpsms-app) and an optional description.
Choose whether to make it public or private.
Click Create repository.
### Step 3: Upload Your Code
After you've created the repository, GitHub will give you instructions. Since you're uploading an existing project, you'll want to follow the steps for "…or push an existing repository from the command line".

First, unzip the project you downloaded onto your local machine. Then, open a terminal or command prompt, navigate into the project's root folder, and run the following commands:

```bash
# Initialize a Git repository in your project folder
git init -b main

# Add all the files to be tracked by Git
git add .

# Create your first commit
git commit -m "Initial commit of Hindalco C-PSMS MVP"

# Connect your local repository to the one you created on GitHub
# (Replace with your own repository URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git

# Push your code to GitHub
git push -u origin main
```
## 8. I want to download this for local testing
I've already ensured the `README.md` file contains all the necessary instructions. Here is a summary of the steps you'll need to follow once you download and unzip the project code:

### 1. Create the Environment File

In the root directory of the project, create a new file named `.env`.
Inside this file, add your Google AI API key like this:
GOOGLE_API_KEY=your_google_ai_api_key_here
This is necessary for the AI-powered risk assessment feature to work.
### 2. Install Dependencies

Open your terminal, navigate to the project's root folder, and run the following command. This will download all the necessary packages for the project.
`npm install`
### 3. Run the Development Server

Once the installation is complete, run this command to start the application:
`npm run dev`
The application will then be available for you to test at `http://localhost:9003` in your web browser.

Let me know if you have any other questions!
