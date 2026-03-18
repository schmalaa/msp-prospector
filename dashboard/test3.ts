import fetch from 'node-fetch';
import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8');
let key = env.split('\n').find(l => l.startsWith('PROXYCURL_API_KEY'))?.split('=')[1].trim();
key = key?.replace(/\"/g, '');

const u = 'https://nubela.co/proxycurl/api/linkedin/company/employees/count';
const targetUrl = 'https://www.linkedin.com/company/hubspot';

fetch(u + '?url=' + encodeURIComponent(targetUrl), {
  headers: { 'Authorization': 'Bearer ' + key }
}).then(async (r: any) => {
  console.log(r.status, r.statusText);
  console.log(await r.text());
}).catch(console.error);
