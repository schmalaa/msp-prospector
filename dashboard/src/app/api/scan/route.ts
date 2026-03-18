import { NextRequest, NextResponse } from 'next/server';
import { DensityScanner } from '../../../services/densityScanner';
import { requireUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    
    if (user.credits < 10) {
      return NextResponse.json(
        { error: 'Insufficient credits. Please upgrade your plan in the Dashboard to continue scanning.' },
        { status: 402 }
      );
    }

    // IP Fingerprinting & Free-Tier Abuse Protection
    const forwardedFor = req.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown';

    if (user.plan === 'Free' && ip !== 'unknown') {
      const isAbusing = await prisma.user.findFirst({
        where: {
          lastIpAddress: ip,
          id: { not: user.id },
          scansPerformed: { gt: 0 }
        }
      });

      if (isAbusing) {
        return NextResponse.json(
          { error: 'Our systems indicate this network/device has already consumed its introductory free tier tokens on a separate account. Please log into the primary account or upgrade your profile to continue scaling your pipeline.' },
          { status: 403 }
        );
      }
    }

    const { headcountRange, locations, maxItStaff = 2 } = await req.json();
    
    if (!headcountRange || !locations || !Array.isArray(locations)) {
      return NextResponse.json(
        { error: 'headcountRange and locations array are required in the body' },
        { status: 400 }
      );
    }

    const APOLLO_KEY = process.env.APOLLO_API_KEY || '';
    const PROXYCURL_KEY = process.env.PROXYCURL_API_KEY || '';
    const HUBSPOT_KEY = process.env.HUBSPOT_ACCESS_TOKEN || '';

    // Create a streaming response
    const encoder = new TextEncoder();
    
    const stream = new ReadableStream({
      async start(controller) {
        const sendEvent = (event: string, data: any) => {
          controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
        };

        try {
          const scanner = new DensityScanner(APOLLO_KEY, PROXYCURL_KEY, HUBSPOT_KEY);
          
          sendEvent('progress', { message: 'Initializing scan engine...' });
          sendEvent('progress', { message: 'Deducting 10 API scan credits from account...' });

          // Deduct credits asynchronously so it doesn't block the stream
          prisma.user.update({
            where: { id: user.id },
            data: { 
              credits: { decrement: 10 },
              scansPerformed: { increment: 1 },
              lastIpAddress: ip
            }
          }).catch(console.error);

          // Run scanner with the onProgress callback mapped to our SSE stream
          const scanPayload = await scanner.run(
            headcountRange, 
            locations, 
            maxItStaff,
            true, // dryRun for UI testing
            (msg) => sendEvent('progress', { message: msg })
          );
          
          // Send final results and stats
          sendEvent('complete', scanPayload);
          controller.close();
        } catch (streamError: any) {
          sendEvent('error', { message: streamError.message });
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('Scan Request Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
