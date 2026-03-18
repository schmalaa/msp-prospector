import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser();
    const url = new URL(req.url);
    const plan = url.searchParams.get('plan');

    if (!plan || !['FREE', 'PRO', 'ENTERPRISE'].includes(plan.toUpperCase())) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const uppercasePlan = plan.toUpperCase();
    let awardedCredits = 0;
    if (uppercasePlan === 'FREE') awardedCredits = 100;
    if (uppercasePlan === 'PRO') awardedCredits = 1500;
    if (uppercasePlan === 'ENTERPRISE') awardedCredits = 5000;

    await prisma.user.update({
      where: { id: user.id },
      data: {
        plan: uppercasePlan,
        credits: awardedCredits
      }
    });

    return NextResponse.redirect(new URL('/dashboard', req.url));

  } catch (err) {
    return NextResponse.json({ error: 'Unauthorized or database error' }, { status: 401 });
  }
}
