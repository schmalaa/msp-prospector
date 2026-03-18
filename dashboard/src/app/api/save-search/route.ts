import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const { headcountRange, location, maxItStaff } = await req.json();

    if (!headcountRange || !location || maxItStaff === undefined) {
      return NextResponse.json({ error: 'Missing required search parameters.' }, { status: 400 });
    }

    const savedSearch = await prisma.savedSearch.create({
      data: {
        userId: user.id,
        headcountRange,
        location,
        maxItStaff
      }
    });

    return NextResponse.json(savedSearch);
  } catch (error: any) {
    console.error('Error saving search:', error);
    return NextResponse.json({ error: 'Failed to save search parameters.' }, { status: 500 });
  }
}
