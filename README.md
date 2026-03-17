# Getting Started: MSP Departmental Density Scout

This guide explains how to take the scaffolded `msp-prospector` project and get it running live.

## Prerequisites

1.  **Node.js**: Ensure you have Node v18+ installed (`node -v`).
2.  **HubSpot Account**: You need a HubSpot Developer Account and a target Sandbox/Test portal.
3.  **API Keys**:
    *   **HubSpot Private App Token**: Needs scopes for `crm.objects.companies.read` and `crm.objects.companies.write`.
    *   **Proxycurl API Key**: Required for the employee headcount validation (`https://nubela.co/proxycurl/`).
    *   **Apollo.io API Key**: Required for the initial geo/headcount company discovery.

## 🛠️ Phase 1: Running the Backend Scanner

The backend is a Node.js script that pulls leads from Apollo, validates them against Proxycurl, and pushes "High Value" (0 IT staff) hits to HubSpot.

1.  **Install dependencies and build the TypeScript files**:
    ```bash
    cd backend
    npm install
    npx tsc
    ```

2.  **Configure Environment Variables**:
    *   Rename `.env.template` to `.env`.
    *   Fill in your actual API keys in the `.env` file.

3.  **Create an entry point (Optional but Recommended)**:
    Create a simple file like `run.js` (or edit the bottom of `dist/index.js` to execute) to actually call the `DensityScanner`.

    ```javascript
    // run.js
    import { DensityScanner } from './dist/services/densityScanner.js';
    import dotenv from 'dotenv';
    dotenv.config();

    async function start() {
        const scanner = new DensityScanner(
            process.env.APOLLO_API_KEY,
            process.env.PROXYCURL_API_KEY,
            process.env.HUBSPOT_ACCESS_TOKEN
        );
        
        // Scan for companies with 30-100 employees in Ohio
        await scanner.run("30,100", ["Ohio", "Columbus"]);
    }
    
    start();
    ```

4.  **Execute the Terminal Scanner**:
    ```bash
    node run.js
    ```
    *You should see console outputs indicating the gathering of Apollo leads, the checking of Proxycurl departments, and the pushing of hits to HubSpot.*

## 🧪 Phase 1b: Running the Interactive Web Dashboard

Instead of the terminal, you can test the density scanner visually using the custom React frontend.

1. **Start the Backend API Server**:
   ```bash
   cd backend
   npx ts-node src/server.ts
   ```

2. **Start the Frontend Development Server**:
   Open a new terminal window:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Scan visually**: Open the provided localhost link in your browser, enter the headcount and location, and click **Run Scanner** to see the glassmorphic results grid populate with high-value leads.

## 🎨 Phase 2: Deploying the HubSpot UI Extension

The UI extension renders the custom "Density Score" card directly on Company records in HubSpot.

1.  **Install the HubSpot CLI globally**:
    ```bash
    npm install -g @hubspot/cli
    ```

2.  **Authenticate your CLI with your HubSpot account**:
    ```bash
    hs auth
    ```
    *Follow the browser prompts to copy your personal access key.*

3.  **Install local extension dependencies**:
    ```bash
    cd extensions/density-score-ui
    npm install
    ```

4.  **Start the local development server to test the UI**:
    To see the card update in real-time as you code, run:
    ```bash
    hs project dev
    ```
    *This will upload a draft version to your portal. Open any Company record in HubSpot, and you should see the "MSP Density Score" card requesting data.*

5.  **Build and Deploy to Production**:
    Once you are satisfied with the UI, build it and permanently upload it to your portal:
    ```bash
    npm run build
    hs project upload
    ```

## 🚀 Next Steps

*   **Automation**: Set up a Cron job (e.g., via GitHub Actions or an AWS EC2 instance) to run the `backend` scanner script every week.
*   **Serverless Data Fetching**: Right now, the React UI Extension mocks the density score fetch. You will need to write a HubSpot Serverless Function (`hs project create serverless ...`) that reads the `custom properties` on the Company record (the ones pushed by our backend script) and returns them to the React frontend.
