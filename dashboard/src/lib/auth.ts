import { auth, currentUser } from '@clerk/nextjs/server';
import prisma from './prisma';
import { redirect } from 'next/navigation';

export async function requireUser() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/');
  }

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses[0]?.emailAddress || 'no-email@clerk.com';

  // Lazy sync user to database if they don't exist yet
  let dbUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        id: userId,
        plan: 'Free',
        credits: 100,
        email: email,
      },
    });
  } else if (!dbUser.email) {
    // Backfill email if it's currently null
    dbUser = await prisma.user.update({
      where: { id: userId },
      data: { email: email },
    });
  }

  return dbUser;
}
