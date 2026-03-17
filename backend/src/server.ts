import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { DensityScanner } from './services/densityScanner.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const APOLLO_KEY = process.env.APOLLO_API_KEY || '';
const PROXYCURL_KEY = process.env.PROXYCURL_API_KEY || '';
const HUBSPOT_KEY = process.env.HUBSPOT_ACCESS_TOKEN || '';

app.post('/api/scan', async (req, res) => {
  try {
    const { headcountRange, locations } = req.body;
    
    if (!headcountRange || !locations || !Array.isArray(locations)) {
      return res.status(400).json({ error: 'headcountRange and locations array are required in the body' });
    }

    const scanner = new DensityScanner(APOLLO_KEY, PROXYCURL_KEY, HUBSPOT_KEY);
    
    // We pass true to indicate it's a dry run from the UI (so we don't spam HubSpot during testing)
    const results = await scanner.run(headcountRange, locations, true);
    
    res.json({ results });
  } catch (error: any) {
    console.error('Scan Error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Test API Server running on http://localhost:${PORT}`);
});
