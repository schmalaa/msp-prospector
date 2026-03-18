import { ProxycurlClient } from './src/services/proxycurlClient';
import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8');
let key = env.split('\n').find(l => l.startsWith('PROXYCURL_API_KEY'))?.split('=')[1].trim();
key = key?.replace(/\"/g, '');

if (!key) throw new Error("No key found");

const client = new ProxycurlClient(key);
client.checkDepartmentalDensity('hubspot.com', 'https://www.linkedin.com/company/hubspot', 5)
  .then(res => console.log('Result:', res))
  .catch(console.error);
