import { DensityScanner } from './services/densityScanner.js';

// Main execution entry point
async function main() {
  const APOLLO_KEY = process.env.APOLLO_API_KEY || 'MOCK_APOLLO_KEY';
  const PROXYCURL_KEY = process.env.PROXYCURL_API_KEY || 'MOCK_PROXYCURL_KEY';
  const HUBSPOT_KEY = process.env.HUBSPOT_API_KEY || 'MOCK_HUBSPOT_KEY';

  const scanner = new DensityScanner(APOLLO_KEY, PROXYCURL_KEY, HUBSPOT_KEY);
  
  await scanner.run("30,100", ["Ohio", "Columbus"]);
}

main().catch(console.error);
