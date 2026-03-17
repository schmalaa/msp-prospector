import { Client } from '@hubspot/api-client';

export interface DepartmentalDensity {
  companyName: string;
  domain: string;
  totalEmployees: number;
  itEmployeeCount: number;
  densityScore: number;
  isHighValueLead: boolean;
}

export class HubspotClient {
  private hubspot: Client;

  constructor(accessToken: string) {
    this.hubspot = new Client({ accessToken });
  }

  async pushLead(lead: DepartmentalDensity): Promise<void> {
    console.log(`[HubSpot] Processing lead: ${lead.companyName} (${lead.domain})`);

    try {
      // 1. Check if company exists by domain
      const searchResponse = await this.hubspot.crm.companies.searchApi.doSearch({
        filterGroups: [{
          filters: [{
            propertyName: "domain",
            operator: "EQ" as any,
            value: lead.domain
          }]
        }],
        properties: ["domain", "name", "msp_fit_score"],
        sorts: [],
        limit: 1,
        after: "0"
      });

      if (searchResponse.total > 0) {
        // Company exists, update it if needed
        const existingId = searchResponse.results[0].id;
        console.log(`[HubSpot] Company exists. ID: ${existingId}. Updating custom property.`);
        await this.hubspot.crm.companies.basicApi.update(existingId, {
          properties: {
             "msp_fit_score": "High",
             "departmental_density_score": lead.densityScore.toString()
          }
        });
      } else {
        // 2. Create Company
        console.log(`[HubSpot] Company not found. Creating new Company.`);
        await this.hubspot.crm.companies.basicApi.create({
          properties: {
            "name": lead.companyName,
            "domain": lead.domain,
            "msp_fit_score": "High",
            "departmental_density_score": lead.densityScore.toString(),
            "numberofemployees": lead.totalEmployees.toString()
          }
        });
      }
      console.log(`[HubSpot] Successfully synced ${lead.companyName}`);
    } catch (e: any) {
      console.error(`[HubSpot Error] Failed to sync ${lead.companyName}. Error:`, e.message);
    }
  }
}
