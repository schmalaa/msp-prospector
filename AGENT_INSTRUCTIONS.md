# MSP Departmental Density Scout - Agent Instructions

Welcome, fellow agent! If you are reading this, you are working on the **MSP Departmental Density Scout** project. 
This document provides the context, architecture, and core logic required for you to successfully assist the user in modifying or extending this application.

## 🎯 Project Objective
The goal is to provide a prospecting tool for an MSP (Managed Service Provider) to identify "High-Value Leads".
A High-Value Lead is defined as a company that fits specific **Firmographics** (e.g., 30-100 employees in the Columbus, OH region) and has **Low IT/Technology Staff (≤ 2)** (e.g., maximum 2 employees in IT, SysAdmin, Help Desk, or CTO roles).

## 🏗️ Architecture & Tech Stack
The project is split into two primary components:

1. **Backend logic (Node.js/TypeScript `backend/`)**
   - **Apollo API (`apolloClient.ts`)**: Used for the initial broad search filter to gather companies matching the firmographic criteria (Headcount ranges and location).
   - **Proxycurl API (`proxycurlClient.ts`)**: Used for the deep-dive scan. Specifically, it calls the Employee Listing Count endpoint to check the `it` employee count. This is cost-efficient (10 credits) compared to a full listing search.
   - **HubSpot SDK (`hubspotClient.ts`)**: Integrates with HubSpot via the official `@hubspot/api-client`. It checks if a company exists by domain. If not, it creates a new Company record and updates a custom property (`msp_fit_score` to "High") and the `departmental_density_score`.
   - **Core Engine (`densityScanner.ts`)**: Connects the Apollo gathering phase, the Proxycurl verification phase, and the HubSpot pushing phase.

2. **CRM UI Extension (`extensions/density-score-ui/`)**
   - A React-based UI Extension for HubSpot built using `@hubspot/ui-extensions`.
   - It is designed to sit on the HubSpot Company record and visually display the calculated Density Score and IT Staff breakdown (e.g., "IT Staff: 0 | Total: 45").

## 🧠 Core Logic Reminders
If you are asked to update the filtering logic, remember:
- **Success Condition**: `Total Employees > 30 AND itCount <= 2`.
- Only push to HubSpot if the success condition is met.
- Ensure cost efficiency: Do not query expensive Proxycurl endpoints if the cheaper Employee Count API reveals the company already has multiple IT employees.

## 🔑 Environment Variables
The backend relies on the following environment variables (defined in `backend/.env`):
- `HUBSPOT_ACCESS_TOKEN`: The HubSpot Private App token.
- `PROXYCURL_API_KEY`: API key for Nubela Proxycurl.
- `APOLLO_API_KEY`: API key for Apollo.io.

## 💻 Commands
- **Run dashboard UI and scanner endpoint**: `cd dashboard && npm run dev`
- **Verify types**: `cd dashboard && npm run build` (This runs Next.js build compilation including typechecks)

Please keep this context in mind when making edits or debugging issues across the codebase.
