# Getting Started: TargetZero Density Scout

This guide explains how to run the newly consolidated `msp-prospector` Next.js monolithic project.

## Architecture

The project has been optimized for straightforward deployment to Vercel:

1.  **`dashboard`**: A Next.js (App Router) monolithic web application. This contains both the React frontend and the backend API logic (Serverless Functions) to scan for leads via Apollo and Proxycurl.
2.  **`extensions/density-score-ui`**: A HubSpot React UI extension that places the "Density Score" card directly on Company records.

## Prerequisites

1.  **Node.js**: Ensure you have Node v18+ installed (`node -v`).
2.  **HubSpot Account**: You need a HubSpot Developer Account and a target Sandbox/Test portal.
3.  **API Keys**:
    *   **HubSpot Private App Token**: Needs scopes for `crm.objects.companies.read` and `crm.objects.companies.write`.
    *   **Proxycurl API Key**: Required for the employee headcount validation (`https://nubela.co/proxycurl/`).
    *   **Apollo.io API Key**: Required for the initial geo/headcount company discovery.

---

## 🚀 Phase 1: Running the Next.js Dashboard & Scanner

Everything required to find leads is now housed inside the `dashboard` directory.

1.  **Install dependencies**:
    ```bash
    cd dashboard
    npm install
    ```

2.  **Configure Environment Variables**:
    *   Create a `.env.local` file inside the `dashboard` folder.
    *   Add your API keys:
        ```env
        HUBSPOT_ACCESS_TOKEN=your_hubspot_token_here
        PROXYCURL_API_KEY=your_proxycurl_token_here
        APOLLO_API_KEY=your_apollo_token_here
        ```

3.  **Start the Development Server**:
    ```bash
    npm run dev
    ```

4.  **Scan for Leads**: 
    Open `http://localhost:3000` in your browser. Navigate to the Scanner, enter your target headcount and location, and click **Run Scanner** to hit the `/api/scan` route. Any "High Value" leads found (0-2 IT staff) will automatically be pushed to your HubSpot CRM.

---

## 🎨 Phase 2: Deploying the HubSpot UI Extension

The UI extension renders the custom "Density Score" card directly on Company records in HubSpot. **This does not run on Vercel.**

1.  **Install the HubSpot CLI globally**:
    ```bash
    npm install -g @hubspot/cli
    ```

2.  **Authenticate your CLI with your HubSpot account**:
    ```bash
    hs auth
    ```

3.  **Install local extension dependencies**:
    ```bash
    cd extensions/density-score-ui
    npm install
    ```

4.  **Start the local development server to test the UI**:
    ```bash
    hs project dev
    ```
    *Open any Company record in HubSpot to see the "MSP Density Score" card requesting data.*

5.  **Build and Deploy to Production**:
    ```bash
    npm run build
    hs project upload
    ```

---

## ☁️ Deployment

**To Vercel (Dashboard & Serverless API)**
1. Push this repository to GitHub.
2. Import the project into Vercel.
3. Set the Framework Preset to **Next.js** and the Root Directory to `dashboard`.
4. Add your `.env.local` variables into Vercel's Environment Variables settings.
5. Deploy.
