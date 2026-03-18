import { NextRequest, NextResponse } from 'next/server';
import { ApolloClient } from '../../../services/apolloClient';
import { ProxycurlClient } from '../../../services/proxycurlClient';
import { HubspotClient } from '../../../services/hubspotClient';
import { DepartmentalDensity } from '../../../services/densityScanner';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { domain, maxItStaff = 2 } = await req.json();

    if (!domain) {
      return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
    }

    const APOLLO_KEY = process.env.APOLLO_API_KEY || '';
    const PROXYCURL_KEY = process.env.PROXYCURL_API_KEY || '';
    const HUBSPOT_KEY = process.env.HUBSPOT_ACCESS_TOKEN || '';

    const apollo = new ApolloClient(APOLLO_KEY);
    const proxycurl = new ProxycurlClient(PROXYCURL_KEY);
    const hubspot = new HubspotClient(HUBSPOT_KEY);

    const result = await proxycurl.checkDepartmentalDensity(domain, '', maxItStaff);
    
    let techStack: any[] = [];
    try {
        techStack = await apollo.enrichOrganization(domain);
        techStack = techStack.slice(0, 5);
    } catch (e) {
        console.error(`Failed to enrich tech stack for ${domain}`);
    }

    const leadData: DepartmentalDensity = {
        companyName: domain.split('.')[0] || domain, // Basic fallback name
        domain,
        totalEmployees: result.total,
        itEmployeeCount: result.itCount,
        densityScore: result.total > 0 ? Number(((result.itCount / result.total) * 100).toFixed(2)) : 0,
        isHighValueLead: result.hit,
        techStack,
        decisionMakers: [],
        decisionMakersFound: 0
    };

    if (result.hit) {
        const companyId = await hubspot.pushLead(leadData);
        if (companyId) {
            const decisionMakers = await apollo.searchDecisionMakers(domain);
            leadData.decisionMakersFound = decisionMakers.length;
            leadData.decisionMakers = decisionMakers;
            
            for (const dm of decisionMakers) {
                await hubspot.createAndAssociateContact(companyId, dm);
            }
        }
    }

    return NextResponse.json(leadData);

  } catch (error: any) {
    console.error('Lookup API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
