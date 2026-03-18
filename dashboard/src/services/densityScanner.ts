import { ApolloClient, ApolloCompany, ApolloTech, ApolloContact } from './apolloClient';
import { ProxycurlClient } from './proxycurlClient';
import { HubspotClient } from './hubspotClient';

export interface DepartmentalDensity {
  companyName: string;
  domain: string;
  totalEmployees: number;
  itEmployeeCount: number;
  densityScore: number;
  isHighValueLead: boolean;
  decisionMakersFound?: number;
  decisionMakers?: ApolloContact[];
  techStack?: ApolloTech[];
}

export class DensityScanner {
  private apollo: ApolloClient;
  private proxycurl: ProxycurlClient;
  private hubspot: HubspotClient;

  constructor(apolloKey: string, proxycurlKey: string, hubspotKey: string) {
    this.apollo = new ApolloClient(apolloKey);
    this.proxycurl = new ProxycurlClient(proxycurlKey);
    this.hubspot = new HubspotClient(hubspotKey);
  }

  async run(headcountRange: string = "30,100", locations: string[] = ["Ohio", "Columbus"], maxItStaff: number = 2, dryRun: boolean = false, onProgress?: (msg: string) => void): Promise<{ results: DepartmentalDensity[], stats: { scanned: number, hits: number, contacts: number } }> {
    const log = (msg: string) => {
      onProgress && onProgress(msg);
      // We still keep console.log for server debugging
      console.log(msg);
    };

    log(`Initializing deep scan for headcount ${headcountRange} in ${locations.join(', ')}...`);
    
    const results: DepartmentalDensity[] = [];
    
    const companies = await this.apollo.searchCompanies(headcountRange, locations);
    log(`Discovered ${companies.length} candidate companies matching parameters.`);
    
    const stats = { scanned: companies.length, hits: 0, contacts: 0 };

    for (const company of companies) {
      if (!company.linkedin_url) {
        // log(`Skipping ${company.name} - No LinkedIn URL.`);
        continue;
      }

      const domain = company.website_url ? new URL(company.website_url).hostname.replace('www.', '') : company.name.toLowerCase().replace(/\s+/g, '') + '.com';

      try {
        // We only log the high-level events to the UI
        // log(`Scanning ${company.name}...`);
        
        const result = await this.proxycurl.checkDepartmentalDensity(domain, company.linkedin_url, maxItStaff);
        
        if (result.hit) {
          stats.hits++;
          log(`Target Acquired: ${company.name} is a High-Value Lead!`);
          
          let techStack: ApolloTech[] = [];
          try {
             techStack = await this.apollo.enrichOrganization(domain);
             // Sort and take the top 5 most interesting tools to avoid overloading the UI
             techStack = techStack.slice(0, 5);
          } catch (e) {
             console.error(`Failed to enrich tech stack for ${company.name}`);
          }

          const leadData: DepartmentalDensity = {
            companyName: company.name,
            domain,
            totalEmployees: result.total,
            itEmployeeCount: result.itCount,
            densityScore: Number(((result.itCount / result.total) * 100).toFixed(2)),
            isHighValueLead: true,
            techStack
          };
          
          results.push(leadData);
          log(`Target Acquired: ${company.name} fits High-Value profile.`);
          
          if (!dryRun) {
            const companyId = await this.hubspot.pushLead(leadData);
            
            if (companyId) {
                log(`Assembling Contact Network for ${company.name}...`);
                const decisionMakers = await this.apollo.searchDecisionMakers(domain);
                leadData.decisionMakersFound = decisionMakers.length;
                leadData.decisionMakers = decisionMakers;
                stats.contacts += decisionMakers.length;
                
                for (const dm of decisionMakers) {
                    await this.hubspot.createAndAssociateContact(companyId, dm);
                }
                log(`Successfully synced ${company.name} and ${decisionMakers.length} contacts to CRM.`);
            }
          } else {
             // Mock data block for UI testing without burning API credits
             const mockCount = Math.floor(Math.random() * 3) + 1; // Random 1-3
             leadData.decisionMakersFound = mockCount;
             leadData.decisionMakers = Array.from({ length: mockCount }).map((_, i) => ({
                 id: `mock-${i}`,
                 first_name: 'Test',
                 last_name: `Contact ${i+1}`,
                 email: `test${i+1}@${domain}`,
                 title: 'CEO',
                 linkedin_url: `https://linkedin.com/in/test${i+1}`
             }));
             stats.contacts += mockCount;
          }
        } else {
           if (result.total === 0 && result.itCount === 0) {
             // Silently skip companies without sufficient data to avoid spamming the logs
             // log(`Insufficient public data to evaluate ${company.name}.`);
           } else {
             log(`Target Rejected: ${company.name} has ${result.itCount} IT staff (Criteria: ≤ ${maxItStaff}).`);
           }
        }
      } catch (error: any) {
        // Only log critical errors to console, not UI, to prevent "API failure" spam
        console.error(`Error processing company ${company.name}: ${error.message}`);
      }
    }
    
    if (results.length === 0) {
      log('Scan complete. Nothing found.');
    } else {
      log('Scan complete. All targets secured.');
    }
    
    return { results, stats };
  }
}
