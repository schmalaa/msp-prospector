import { auth, currentUser } from '@clerk/nextjs/server';
import prisma from './prisma';

export async function requireUser() {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('Unauthorized');
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
        email: email,
        credits: 100, // Give them 100 intro credits to test functionality
        plan: 'FREE',
      },
    });
  }

  return dbUser;
}
