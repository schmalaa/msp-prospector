import fetch from 'node-fetch';

export interface ApolloCompany {
  id: string;
  name: string;
  linkedin_url: string;
  website_url: string;
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
    
    // In a real application, we might want to paginate, but for now we fetch the first page
    const payload = {
      organization_num_employees_ranges: [headcountRange],
      organization_locations: locations,
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
      const errText = await response.text();
      throw new Error(`Apollo API error: ${response.status} ${response.statusText} - ${errText}`);
    }

    const data = await response.json() as ApolloSearchResponse;
    return data.organizations || [];
  }
}
