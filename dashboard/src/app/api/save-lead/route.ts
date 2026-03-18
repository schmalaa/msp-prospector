import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const lead = await req.json();

    if (!lead || !lead.companyName || !lead.domain) {
      return NextResponse.json({ error: 'Missing core lead data.' }, { status: 400 });
    }

    const savedLead = await prisma.savedLead.create({
      data: {
        userId: user.id,
        companyName: lead.companyName,
        domain: lead.domain,
        linkedinUrl: lead.linkedinUrl,
        totalEmployees: lead.totalEmployees,
        itEmployeeCount: lead.itEmployeeCount,
        densityScore: lead.densityScore,
        techStack: JSON.stringify(lead.techStack || []),
        decisionMakers: JSON.stringify(lead.decisionMakers || [])
      }
    });

    return NextResponse.json(savedLead);
  } catch (error: any) {
    console.error('Error saving lead:', error);
    return NextResponse.json({ error: 'Failed to save lead.' }, { status: 500 });
  }
}
