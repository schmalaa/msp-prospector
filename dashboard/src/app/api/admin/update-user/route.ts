import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const clerkUser = await currentUser();
    const requestEmail = clerkUser?.emailAddresses[0]?.emailAddress;

    if (!clerkUser || requestEmail !== 'schmalaa@gmail.com') {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    const { userId, planAction } = await req.json();

    if (!userId || !planAction) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Determine target credits based on plan upgrade payload
    let targetCredits = 0;
    let newPlanName = 'Free';

    if (planAction === 'upgrade_pro') {
      targetCredits = 500;
      newPlanName = 'Pro';
    } else if (planAction === 'upgrade_enterprise') {
      targetCredits = 5000;
      newPlanName = 'Enterprise';
    } else if (planAction === 'downgrade_free') {
      targetCredits = 100;
      newPlanName = 'Free';
    } else {
      return new NextResponse('Invalid plan action', { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        plan: newPlanName,
        credits: targetCredits,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating manual user plan:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
