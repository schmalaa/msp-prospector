export interface EmployeeCountData {
  employee_count: number;
}

export class ProxycurlClient {
  private apiKey: string;
  private baseUrl = 'https://nubela.co/api/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getEmployeeCount(domain: string): Promise<EmployeeCountData> {
    const url = new URL(`${this.baseUrl}/company/employee-count`);
    url.searchParams.append('website', `https://${domain}`);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`Proxycurl API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as EmployeeCountData;
    return data;
  }

  async checkDepartmentalDensity(domain: string, linkedinUrl: string, maxItStaff: number = 2): Promise<{
    hit: boolean;
    total: number;
    itCount: number;
  }> {
    try {
      const counts = await this.getEmployeeCount(domain);
      const total = counts.employee_count || 0;
      
      // With the new API we only get global employee count.
      // We estimate IT staff as 5% of the total company size for now.
      const estimatedItCount = Math.ceil(total * 0.05);

      if (total > 30 && estimatedItCount <= maxItStaff) {
          return { hit: true, total, itCount: estimatedItCount };
      }

      return { hit: false, total, itCount: estimatedItCount || 0 };
    } catch (e) {
      console.error(`Error checking density for ${domain}:`, e);
      return { hit: false, total: 0, itCount: 0 };
    }
  }
}
