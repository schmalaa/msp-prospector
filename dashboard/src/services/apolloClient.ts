export interface ApolloCompany {
  id: string;
  name: string;
  linkedin_url: string;
  website_url: string;
}

export interface ApolloContact {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  title: string;
  linkedin_url: string;
}

export interface ApolloTech {
  uid: string;
  name: string;
  category: string;
}

interface ApolloSearchResponse {
  organizations: ApolloCompany[];
  pagination: {
    page: number;
    total_pages: number;
    total_entries: number;
  };
}

export class ApolloClient {
  private apiKey: string;
  private baseUrl = 'https://api.apollo.io/api/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async searchCompanies(headcountRange: string, locations: string[]): Promise<ApolloCompany[]> {
    const url = `${this.baseUrl}/organizations/search`;
    
    const payload = {
      organization_num_employees_ranges: [headcountRange],
      organization_locations: locations,
      page: 1,
      per_page: 100
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'X-Api-Key': this.apiKey
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Apollo API error: ${response.status} ${response.statusText} - ${errText}`);
    }

    const data = await response.json() as ApolloSearchResponse;
    return data.organizations || [];
  }

  async searchDecisionMakers(domain: string): Promise<ApolloContact[]> {
    const url = `${this.baseUrl}/people/search`;
    
    const payload = {
      q_organization_domains: domain,
      person_titles: ["CEO", "Founder", "President", "Managing Director", "Owner"],
      page: 1
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'X-Api-Key': this.apiKey
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
        console.error(`Apollo People API error: ${response.status}`);
        return [];
    }

    const data = await response.json() as { contacts: ApolloContact[] };
    return data.contacts || [];
  }

  async enrichOrganization(domain: string): Promise<ApolloTech[]> {
    const url = `${this.baseUrl}/organizations/enrich?domain=${domain}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'X-Api-Key': this.apiKey
      }
    });

    if (!response.ok) {
        console.error(`Apollo Enrich API error: ${response.status}`);
        return [];
    }

    const data = await response.json() as any;
    const org = data.organization;
    
    if (org && org.current_technologies) {
      return org.current_technologies as ApolloTech[];
    }
    
    return [];
  }
}
