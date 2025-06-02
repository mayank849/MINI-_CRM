# ClientNest CRM Platform

This project is a Mini CRM Platform built as part of the Xeno SDE Internship Assignment. It enables customer segmentation, personalized campaign delivery, and incorporates AI-powered features.

🚀 **Assignment Goal:** Build a Mini CRM Platform that enables customer segmentation, personalized campaign delivery, and intelligent insights using modern tools and approaches.

---

## Table of Contents

1.  [Live Demo](#live-demo)
2.  [Demo Video](#demo-video)
3.  [Features Implemented](#features-implemented)
4.  [Tech Stack](#tech-stack)
5.  [Architecture Diagram](#architecture-diagram)
6.  [Getting Started](#getting-started)
    *   [Prerequisites](#prerequisites)
    *   [Backend Setup](#backend-setup)
    *   [Frontend Setup](#frontend-setup)
7.  [API Documentation](#api-documentation)
8.  [AI Integration](#ai-integration)
9.  [Known Limitations & Assumptions](#known-limitations--assumptions)
10. [Future Scope](#future-scope)

---

## Live Demo

[Frontend Link](https://clientnest-crm.vercel.app) <br>
[Backend Link](https://clientnest-crm.onrender.com)<br>
Wait for 30secs to 1min after opening backend link, then open frontend link for full functioning.

---

## Demo Video

[Demo Video Link]() 

---

## Features Implemented

*   **Data Ingestion APIs:**
    *   Secure REST APIs for ingesting customers and order data.
    *   Backend validation of uploaded data.
    *   Swagger UI for API documentation and testing.
    *   Implemented a pub-sub architecture using RedisStreams via RedisCloud.
    *   Actual data persistence happens asynchronously via a consumer service.
*   **Campaign Creation UI:**
    *   **Audience Segmentation:**
        *   Define audience segments using flexible rule logic (e.g., `spend > 10000 AND visits < 3`).
        *   Combine conditions using AND/OR logic.
        *   Dynamic rule builder for creating segment conditions (field, operator, value).
        *   Advanced UX features like drag-and-drop rule builders implemented. 
        *   A comprehensive campaign history page with detailed delivery stats (sent, failed, audience size) and sorting is not yet fully implemented.
    *   **Campaign Definition:**
        *   Create campaigns with a name, message content, and optional intent.
        *   Link campaigns to pre-defined audience segment rules.
        *   Select specific customers for a campaign.
*   **Authentication:**
    *   Google OAuth 2.0 based authentication for secure access.
    *   Ensures only logged-in users can create audiences or view/manage campaigns.
*   **AI Integration:**
    *   **AI-Driven Message Suggestions:**
        *   When creating a new campaign, after adding rules in the rule builder, users can click "Suggest Campaign Names"
        *   On the campaign details page, users can click "Generate AI Summary" to get a concise overview of the campaign
*   **Core CRM Functionality:**
    *   Customer Data Management – Collect, store, and manage customer profiles, purchase history, and interaction logs.

    *   Segmentation & Targeting – Create audience segments based on rules or behavior for personalized marketing and engagement.

    *   Campaign Execution & Tracking – Launch communication campaigns and track delivery, engagement, and performance metrics.

---

## Tech Stack

*   **Frontend:**
    *   Next.js (v15+ with App Router)
    *   React (v19+)
    *   JavaScript
    *   ShadCN (for UI components)
    *   Tailwind CSS (for styling)
    *   Lucide Reacr (for icons)
    *   @google/generative-ai (for LLM API integration)
*   **Backend:**
    *   Node.js
    *   Express.js
    *   JavaScript
    *   MongoDB (with Mongoose ODM)
    *   Redis Streams
*   **Authentication:**
    *   Google OAuth 2.0 on NextJS frontend
*   **API Documentation:**
    *   Swagger (OpenAPI)
*   **AI:**
    *   Google Gemini API (for campaign summarization and campaign name suggestion.)
*   **Development Tools:**
    *   VS Code
    *   Git & GitHub

---

**🔐 Authentication:**
Users log in via Google OAuth2.

**🖥️ Frontend:**
UI for Dashboard, Campaign Creation, and History.
Interacts with the backend to view data and trigger campaigns.

**🧠 Backend (REST API):**
Manages campaigns, orders, customers, and delivery receipts.
Publishes campaign tasks to Redis Streams.

**🔄 Pub/Sub Layer:**
Redis Stream used for queuing campaign and customer/order events.

**⚙️ Workers:**
CampaignWorker.js: Processes new campaigns, finds target customers.
StreamConsumer.js: Sends customers/orders asynchronously to backend database via pub-sub architecture.

**🗃️ Data Store:**
MongoDB stores customers, campaigns, and message logs.

**📡 Vendor API:**
Simulates message delivery and sends status updates.



## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

*   Node.js (v18.x or later recommended)
*   npm (v9.x or later) or yarn
*   MongoDB instance (local or a cloud-hosted version like MongoDB Atlas)
*   Google Cloud Platform project with OAuth 2.0 credentials enabled.
*   Redis instance

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd server
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the `server` directory by copying `.env.example` 

    Replace placeholders with your actual credentials.

4.  **Run the backend server:**
    ```bash
    npm run dev
    ```
    The backend server should start, typically on `http://localhost:8000`.

5.  **Run the Stream consumer:**
    ```bash
    node consumers/streamConsumer.js
    ```
    Separate Node.js script/service
    Subscribes to stream:customers, stream:orders
    Reads data from the stream
    Saves valid entries to MongoDB
    No need to run this, unless want to add new data to the database.

6.  **Run the Campaign consumer:**
    ```bash
    node consumers/campaignWorker.js
    ```
    Run this alongside the backend server whenever your application is live and users can create campaigns.

    This worker listens to the campaign.created Redis channel. When a campaign is created via the API, this worker:
    * Queries customers based on campaign rules
    * Publishes delivery tasks for each eligible customer



### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd client
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the `client` directory by copying `.env.example` 
    Replace placeholders with your actual credentials. 

4.  **Run the frontend development server:**
    ```bash
    npm run dev
    ```
    The frontend application should start, typically on `http://localhost:3000`.

---

## API Documentation

The backend API is documented using Swagger (OpenAPI). Once the backend server is running, you can access the Swagger UI at:
`http://localhost:8000/api-docs` (or your backend URL + `/api-docs`)

This interface allows you to view all available API endpoints, their request/response schemas, and test them directly.

---

## AI Integration

*   **AI-Driven Message Suggestions:**
    *   The platform integrates with Google Gemini to provide AI-powered message suggestions for campaigns.
    *   When creating a campaign, users can click a button to "Generate Message with AI".
    *   The frontend sends the campaign name and a sanitized version of the selected segment rule to a Next.js API route (`/api/generateGeminiMessage`).
    *   This API route then calls the Google Gemini API with a prompt constructed from this information.
    *   The generated message is returned to the frontend and populated into the message content field.
    *   The `GEMINI_API_KEY` environment variable in the frontend's `.env.local` is used for this feature.

---

## Known Limitations & Assumptions

*   **Google Auth:** Currently it is only implemented at the frontend level, not integrated with JWT tokens in the backend.
*   **AI Features:** AI integration is currently limited to campaign summarization and suggesting campaign names according to the rules applied. Other suggested AI use cases (Natural Language to Segment Rules, Performance Summarization, etc.) are not implemented.
*   **Error Handling:** While basic error handling is in place, more granular error feedback to the user and comprehensive backend logging could be improved.
*   **Testing:** No automated unit or integration tests are included in the current version.

---

## Future Scope

*   Extend delivery capabilities beyond dummy SMS to include email, WhatsApp, push notifications, and in-app messages.
*   Build a dashboard with live tracking of campaign performance, customer engagement, and delivery heatmaps
*   Migrate to distributed architecture (e.g., microservices with Kubernetes), integrate horizontal scaling for message processing, and optimize Redis usage for higher throughput.
*   Integrate more AI-powered features (e.g., natural language to segment rules, give message suggestions via MongDB queries).
*   Enhance UX/UI with more interactive elements.
*   Implement comprehensive automated testing (unit, integration, e2e).
*   Improve error handling and system logging.



---

Thank you for the opportunity to work on this assignment!
