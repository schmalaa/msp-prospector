import { requireUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import AdminClient from './AdminClient';

export default async function AdminPage() {
  await requireUser();
  const clerkUser = await currentUser();

  if (clerkUser?.emailAddresses[0]?.emailAddress !== 'schmalaa@gmail.com') {
    redirect('/dashboard');
  }

  // Fetch all users securely on the backend
  const allUsers = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return <AdminClient initialUsers={allUsers} />;
}
