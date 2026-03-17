import { ApolloClient, ApolloCompany } from './apolloClient.js';
import { ProxycurlClient } from './proxycurlClient.js';
import { HubspotClient, DepartmentalDensity } from './hubspotClient.js';

export class DensityScanner {
  private apollo: ApolloClient;
  private proxycurl: ProxycurlClient;
  private hubspot: HubspotClient;

  constructor(apolloKey: string, proxycurlKey: string, hubspotKey: string) {
    this.apollo = new ApolloClient(apolloKey);
    this.proxycurl = new ProxycurlClient(proxycurlKey);
    this.hubspot = new HubspotClient(hubspotKey);
  }

  async run(headcountRange: string = "30,100", locations: string[] = ["Ohio", "Columbus"], dryRun: boolean = false): Promise<DepartmentalDensity[]> {
    console.log(`Starting scan for companies. Headcount: ${headcountRange}, Locations: ${locations.join(', ')}...`);
    
    const results: DepartmentalDensity[] = [];
    
    // 1. Fetch companies
    const companies = await this.apollo.searchCompanies(headcountRange, locations);
    console.log(`Found ${companies.length} potential companies from Apollo.`);

    for (const company of companies) {
      if (!company.linkedin_url) {
        console.log(`Skipping ${company.name} - No LinkedIn URL.`);
        continue;
      }

      const domain = company.website_url ? new URL(company.website_url).hostname.replace('www.', '') : company.name.toLowerCase().replace(/\s+/g, '') + '.com';

      try {
        console.log(`Checking ${company.name} (${company.linkedin_url})...`);
        
        // 2. Evaluate Departmental Density via Proxycurl
        const result = await this.proxycurl.checkDepartmentalDensity(domain, company.linkedin_url);
        
        // 3. Filter for Hits
        if (result.hit) {
          const leadData: DepartmentalDensity = {
            companyName: company.name,
            domain: domain,
            totalEmployees: result.total,
            itEmployeeCount: result.itCount,
            densityScore: 0,
            isHighValueLead: true
          };
          
          results.push(leadData);
          console.log(`[HIT] Found 0 IT employees for ${company.name}!`);
          
          if (!dryRun) {
            // 4. Push to HubSpot integration
            await this.hubspot.pushLead(leadData);
          } else {
             console.log(`[DRY RUN] Skipping HubSpot push for ${company.name}.`);
          }
        } else {
           console.log(`[MISS] ${company.name} has ${result.itCount} IT employees out of ${result.total}.`);
        }
      } catch (error: any) {
        console.error(`Error processing company ${company.name}:`, error.message);
      }
    }
    
    console.log('Scan complete.');
    return results;
  }
}
