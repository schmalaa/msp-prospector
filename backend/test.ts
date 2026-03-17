import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const url = `https://api.apollo.io/api/v1/mixed_companies/search`;
const payload = {
  api_key: process.env.APOLLO_API_KEY,
  organization_num_employees_ranges: ["30,100"],
  organization_locations: ["Ohio", "Columbus"],
  page: 1,
  display_mode: 'organization'
};

fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(payload)
})
  .then(async res => {
    const text = await res.text();
    console.log(res.status, text);
    process.exit(0);
  })
  .catch(err => console.error(err));
