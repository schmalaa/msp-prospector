import { ProxycurlClient } from './src/services/proxycurlClient';
import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8');
let key = env.split('\n').find(l => l.startsWith('PROXYCURL_API_KEY'))?.split('=')[1].trim();
key = key?.replace(/\"/g, '');

const urls = [
  'https://nubela.co/proxycurl/api/linkedin/company/employee/count',
  'https://nubela.co/proxycurl/api/linkedin/company/employees/count',
  'https://nubela.co/proxycurl/api/v2/linkedin/company/employee/count',
  'https://nubela.co/proxycurl/api/v2/linkedin/company/employees/count',
  'https://nubela.co/proxycurl/api/v1/company/employees/count'
];

async function test() {
  for (const u of urls) {
    const res = await fetch(u + '?url=https://www.linkedin.com/company/hubspot', {
      headers: { 'Authorization': 'Bearer ' + key }
    });
    console.log(u, res.status);
    if(res.status === 200) {
       console.log(await res.json());
    }
  }
}
test();
