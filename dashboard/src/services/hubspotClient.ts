import { Client } from '@hubspot/api-client';
import { ApolloContact } from './apolloClient';

export interface DepartmentalDensity {
  companyName: string;
  domain: string;
  totalEmployees: number;
  itEmployeeCount: number;
  densityScore: number;
  isHighValueLead: boolean;
  decisionMakersFound?: number;
}

export class HubspotClient {
  private hubspot: Client;

  constructor(accessToken: string) {
    this.hubspot = new Client({ accessToken });
  }

  async pushLead(lead: DepartmentalDensity): Promise<string | null> {
    console.log(`[HubSpot] Processing lead: ${lead.companyName} (${lead.domain})`);

    try {
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
        const existingId = searchResponse.results[0].id;
        console.log(`[HubSpot] Company exists. ID: ${existingId}. Updating custom property.`);
        await this.hubspot.crm.companies.basicApi.update(existingId, {
          properties: {
             "msp_fit_score": "High",
             "departmental_density_score": lead.densityScore.toString()
          }
        });
        return existingId;
      } else {
        console.log(`[HubSpot] Company not found. Creating new Company.`);
        const createResponse = await this.hubspot.crm.companies.basicApi.create({
          properties: {
            "name": lead.companyName,
            "domain": lead.domain,
            "msp_fit_score": "High",
            "departmental_density_score": lead.densityScore.toString(),
            "numberofemployees": lead.totalEmployees.toString()
          }
        });
        console.log(`[HubSpot] Successfully created ${lead.companyName}`);
        return createResponse.id;
      }
    } catch (e: any) {
      console.error(`[HubSpot Error] Failed to sync ${lead.companyName}. Error:`, e.message);
      return null;
    }
  }

  async createAndAssociateContact(companyId: string, contact: ApolloContact): Promise<void> {
    console.log(`[HubSpot] Processing decision maker: ${contact.first_name} ${contact.last_name}`);
    
    try {
      // 1. Create Contact
      const createResponse = await this.hubspot.crm.contacts.basicApi.create({
        properties: {
          firstname: contact.first_name || '',
          lastname: contact.last_name || '',
          email: contact.email || '',
          jobtitle: contact.title || '',
        }
      });
      
      const newContactId = createResponse.id;
      console.log(`[HubSpot] Created contact ID ${newContactId}. Associating to company ${companyId}...`);

      // 2. Associate Contact with Company
      await this.hubspot.crm.associations.v4.basicApi.create(
        "contacts",
        newContactId,
        "companies",
        companyId,
        [
          {
            "associationCategory": "HUBSPOT_DEFINED" as any,
            "associationTypeId": 280 // Standard "Contact to Company" primary association
          }
        ]
      );
      console.log(`[HubSpot] Successfully associated ${contact.first_name} with company.`);
    } catch (e: any) {
        console.error(`[HubSpot Error] Failed to create/associate contact ${contact.first_name}. Error:`, e.message);
    }
  }
}
