import { requireUser } from '@/lib/auth';
import { DashboardClient } from './DashboardClient';
import prisma from '@/lib/prisma';

export default async function DashboardPage() {
  const user = await requireUser();
  
  // Fetch their saved data
  const savedSearches = await prisma.savedSearch.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  const savedLeads = await prisma.savedLead.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 10
  });

  return (
    <DashboardClient 
      user={user} 
      initialSearches={savedSearches} 
      initialLeads={savedLeads} 
    />
  );
}
