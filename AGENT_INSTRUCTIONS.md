# TargetZero Engine - Agent Instructions

Welcome, fellow agent! If you are reading this, you are working on the **TargetZero** project. 
This document provides the context, architecture, and core logic required for you to successfully assist the user in modifying or extending this application.

## 🎯 Project Objective
The goal is to provide a prospecting tool for an MSP (Managed Service Provider) to identify "High-Value Leads".
A High-Value Lead is defined as a company that fits specific **Firmographics** (e.g., 30-100 employees in the Columbus, OH region) and has **Low IT/Technology Staff (≤ 2)** (e.g., maximum 2 employees in IT, SysAdmin, Help Desk, or CTO roles).

## 🏗️ Architecture & Tech Stack
The project is split into two primary components:

1. **Backend logic (Next.js/TypeScript `dashboard/`)**
   - **Database Layer (Prisma ORM & SQLite)**: The application has been fully productized into a SaaS framework. `schema.prisma` defines `User`, `SavedSearch`, and `SavedLead` tables powered by the Prisma v5 `library` engine.
   - **Apollo API (`apolloClient.ts`)**: Used for the initial broad search filter to gather companies matching the firmographic criteria.
   - **Proxycurl API (`proxycurlClient.ts`)**: Used for the deep-dive scan checking the `it` employee count visually.
   - **HubSpot SDK (`hubspotClient.ts`)**: Integrates with HubSpot via the official API to sync density data conditionally.
   - **Core Engine (`densityScanner.ts`)**: Connects the phases and maps data back visually to the authenticated user's React stream.

2. **Sales Rep Chrome Extension (`extension/`)**
   - A Vite/React Chrome extension leveraging `@crxjs/vite-plugin`.
   - Uses Clerk for authentication (`@clerk/chrome-extension`) and allows sales reps to instantly query the TargetZero backend for the current active Chrome tab.

3. **CRM UI Extension (`extensions/density-score-ui/`)**
   - A React-based UI Extension for HubSpot built using `@hubspot/ui-extensions`.
   - It is designed to sit on the HubSpot Company record and visually display the calculated Density Score and IT Staff breakdown (e.g., "IT Staff: 0 | Total: 45").

## 🎨 UI/UX Guidelines
The TargetZero dashboard follows a strict "Cyber-Executive" aesthetic. 
- **Colors**: Do not use soft purples, blues, or gradients. The primary background palette is flat deep charcoal (`#141517` scaling to `#1E1F22`). 
- **Accents**: The primary accent color is stark, electric yellow (`#FFD500`, known as `targetYellow` in Mantine). 
- **Borders**: Eschew drop-shadows and blur filters in favor of sharp, 1px solid borders (`rgba(255,255,255,0.05)` or yellow halos for active states).

## 🧠 Core Logic Reminders
If you are asked to update the filtering logic, remember:
- **API Credits**: The `DensityScanner` route (`/api/scan`) MUST deduct 10 database credits immediately from the authenticated user via Prisma. If credits fall below 10, execution blocks with a `402 Payment Required`. Wait for Clerk autologins to lazily sync users into the database (`src/lib/auth.ts`).
- **Success Condition**: `Total Employees > 30 AND itCount <= {maxItStaff}`. Do not hardcode 2 anymore, it is dynamically set in the frontend.
- Only push to HubSpot if the success condition is met.

## 🔑 Environment Variables
The backend relies on the following environment variables (defined in `backend/.env`):
- `HUBSPOT_ACCESS_TOKEN`: The HubSpot Private App token.
- `PROXYCURL_API_KEY`: API key for Nubela Proxycurl.
- `APOLLO_API_KEY`: API key for Apollo.io.

## 💻 Commands
- **Run dashboard UI and scanner endpoint**: `cd dashboard && npm run dev`
- **Verify types**: `cd dashboard && npm run build` (This runs Next.js build compilation including typechecks)

Please keep this context in mind when making edits or debugging issues across the codebase.
