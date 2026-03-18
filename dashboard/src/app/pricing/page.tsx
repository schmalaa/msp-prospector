import { requireUser } from '@/lib/auth';
import { PricingClient } from './PricingClient';

export default async function PricingPage() {
  // Wait for user sync and check current plan
  const user = await requireUser();

  return <PricingClient currentPlan={user.plan} />;
}
