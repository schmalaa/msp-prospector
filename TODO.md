# TargetZero: Future Roadmap & Growth Ideas

This document outlines potential features and enhancements to make the TargetZero engine more robust, increase the volume of high-quality leads, and provide more value to the MSP sales process.

## 🎯 1. Enhanced Lead Data & Enrichment

*   **Decision-Maker Contact Extraction:** Currently, the tool finds *companies*. It should automatically use the Apollo API to find the CEO, Founder, or Managing Director and push them into HubSpot as **Contacts** associated with the Company.
*   **Technology Stack Profiling:** Integrate with BuiltWith or Wappalyzer APIs to detect the company's tech stack. 
    *   *Why:* If they are using Google Workspace vs. Microsoft 365, the MSP can tailor their pitch.
*   **Cybersecurity Posture Check (The "Scare" Factor):** Run an automated scan for missing DMARC/SPF/DKIM records on their domain or check if their website SSL certificate is expiring soon. This provides an immediate, actionable pain point for the cold outreach. 

## 🧠 2. Advanced Prospecting Signals

*   **Hiring Intent Trigger:** Scan job boards (Indeed, LinkedIn) to see if the target company is currently attempting to hire an "IT Support Specialist" or "Systems Administrator".
    *   *Why:* If they are hiring, they acknowledge the pain. Pitching an outsourced MSP contract is often cheaper and provides better coverage than a single W-2 hire.
*   **Compliance-Driven Targeting:** Allow filtering by highly regulated industries (Healthcare/HIPAA, Finance/FINRA, DoD Contractors/CMMC). These companies *must* have robust IT, making them desperate for MSPs if their internal headcount is 0-2.
*   **Funding Events:** Integrate crunchbase to target companies that recently received Series A or B funding. They are scaling rapidly, have budget, and usually lack mature IT infrastructure.

## ⚙️ 3. Workflow & Automation Enhancements

*   **Automated HubSpot Sequences:** Instead of just creating the Company record, automatically enroll the associated Contact into a specific HubSpot Email Sequence tailored to the "Low IT Staff" angle (e.g., subject line: *"What happens when your sole IT guy takes a vacation?"*).
*   **Scheduled Background Sweeps:** Replace the manual "Run Scanner" button with a weekly cron job (e.g., GitHub Actions, Vercel Cron) that sweeps a specific state/region and drips 10-20 fresh leads into HubSpot every Monday morning.
*   ~~**Sales Rep Chrome Extension:** Build a lightweight Chrome Extension. When an MSP sales rep is browsing a random company's website, they can click a button to instantly calculate the Density Score and sync it to HubSpot.~~ (Completed)

## 📊 4. UI/UX Improvements

*   ~~**TargetZero Aesthetic Overhaul:** Implement a high-contrast Cyber-Executive UI matching modern SaaS tools with Charcoal dark mode and Electric Yellow branding.~~ (Completed)

*   **Dashboard Analytics:** Add a home screen to the Vercel dashboard showing metrics: "Leads Found This Month", "Estimated Pipeline Value", and "Top Industries Scanned".
*   **Batch CSV Export:** Allow users to export the generated lead list to a CSV, in case they want to upload it to a dialer or an email marketing system outside of HubSpot.
*   **Cost Management Safeguards:** Proxycurl and Apollo APIs can get expensive. Add a UI element showing API credit usage and set daily limits to prevent budget overruns.


## 📊 5. Make it a product

*   ~~**Sales Rep Chrome Extension:** Integrate Clerk authentication and only allow access to the scanner API to authenticated users.~~ (Completed)
*   **Subscription Model:** Charge a monthly fee for access to the scanner. 
*   **API Access:** Allow users to access the scanner API to integrate it into their own sales process.


