import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

async function testEndpoint(endpoint: string) {
  const url = `https://api.apollo.io/api/v1/${endpoint}`;
  console.log(`Testing ${endpoint}...`);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'X-Api-Key': process.env.APOLLO_API_KEY as string
      },
      body: JSON.stringify({
        organization_num_employees_ranges: ["30,100"],
        organization_locations: ["Ohio"],
        page: 1
      })
    });
    
    const text = await res.text();
    console.log(`Status: ${res.status}`);
    if (res.status === 200) {
      console.log('SUCCESS! Endpoint is accessible.');
    } else {
        console.log(`Error Response: ${text.substring(0, 200)}...`);
    }
  } catch (e) {
    console.error(`Fetch failed:`, e);
  }
  console.log('-------------------');
}

async function run() {
  await testEndpoint('mixed_companies/search');
  await testEndpoint('organizations/search');
}

run();
