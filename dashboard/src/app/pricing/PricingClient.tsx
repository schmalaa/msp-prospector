'use client';

import { Container, Title, Text, SimpleGrid, Card, Group, Button, List, ThemeIcon, Badge } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';

interface PricingClientProps {
  currentPlan: string;
}

export function PricingClient({ currentPlan }: PricingClientProps) {
  const plans = [
    {
      title: 'Free',
      price: '$0',
      description: 'Test the engine and see the lead quality.',
      features: ['100 Scan Credits', 'HubSpot Native Sync', 'Dashboard Access', 'Basic Tech Stack Enriches'],
      buttonLabel: currentPlan === 'FREE' ? 'Current Plan' : 'Downgrade',
      actionEndpoint: null,
      internalName: 'FREE'
    },
    {
      title: 'Pro',
      price: '$149',
      period: '/mo',
      description: 'For growing MSPs needing consistent high-value pipeline generation.',
      features: ['1,500 Scan Credits', 'HubSpot Native Sync', 'Priority Support', 'Chrome Extension Access', 'Save unlimited searches'],
      buttonLabel: currentPlan === 'PRO' ? 'Current Plan' : 'Upgrade to Pro',
      actionEndpoint: '/api/upgrade?plan=PRO',
      popular: true,
      internalName: 'PRO'
    },
    {
      title: 'Enterprise',
      price: '$899',
      period: '/mo',
      description: 'For large agencies managing multiple regions with heavy scanner automation.',
      features: ['5,000 Scan Credits', 'Dedicated Account Manager', 'Custom CRM Integrations', 'Chrome Extension Access', 'Unlimited searches & saves'],
      buttonLabel: currentPlan === 'ENTERPRISE' ? 'Current Plan' : 'Upgrade to Enterprise',
      actionEndpoint: '/api/upgrade?plan=ENTERPRISE',
      internalName: 'ENTERPRISE'
    }
  ];

  return (
    <Container size="lg" py="xl">
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <Title order={1} mb="md" fw={900} style={{ color: 'var(--mantine-color-gray-0)' }}>
          Fuel Your Pipeline with <span style={{ color: 'var(--mantine-color-targetYellow-filled)' }}>TargetZero</span>
        </Title>
        <Text c="dimmed" size="lg" mx="auto">
          Identify companies with aging infrastructure and minimal IT teams instantly. Bypass gatekeepers and target high-value MRR contracts.
        </Text>
      </div>

      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl">
        {plans.map((plan) => (
          <Card 
            key={plan.title} 
            padding="xl" 
            radius="md" 
            style={{ 
              display: 'flex', 
              flexDirection: 'column',
              backgroundColor: '#1E1F22',
              border: plan.popular 
                ? '2px solid var(--mantine-color-targetYellow-filled)' 
                : '1px solid rgba(255,255,255,0.05)',
              position: 'relative'
            }}
          >
            {plan.popular && (
              <Badge 
                color="targetYellow" 
                variant="filled" 
                size="sm" 
                style={{ position: 'absolute', top: 12, right: 12 }}
              >
                Most Popular
              </Badge>
            )}

            <Text fz="xs" tt="uppercase" fw={700} c="dimmed" mb="xs">
              {plan.title}
            </Text>
            
            <Group align="flex-end" gap="xs" mb="sm">
              <Text fz={48} fw={800} lh={1} style={{ color: 'var(--mantine-color-gray-0)' }}>
                {plan.price}
              </Text>
              {plan.period && (
                <Text fz="xl" c="dimmed" fw={600} style={{ marginBottom: 4 }}>
                  {plan.period}
                </Text>
              )}
            </Group>

            <Text c="dimmed" fz="sm" mb="xl">
              {plan.description}
            </Text>

            <List
              spacing="md"
              size="sm"
              icon={
                <ThemeIcon size={20} radius="xl" color="targetYellow" variant="light">
                  <IconCheck size={14} stroke={3} />
                </ThemeIcon>
              }
              style={{ flex: 1 }}
            >
              {plan.features.map((feature, i) => (
                <List.Item key={i}>
                  <Text c="gray.3" size="sm">{feature}</Text>
                </List.Item>
              ))}
            </List>

            <Button
              mt="xl"
              fullWidth
              variant={plan.popular ? 'filled' : 'outline'}
              color="targetYellow"
              disabled={currentPlan === plan.internalName}
              component={plan.actionEndpoint ? "a" : "button"}
              href={plan.actionEndpoint || undefined}
            >
              {plan.buttonLabel}
            </Button>
          </Card>
        ))}
      </SimpleGrid>
    </Container>
  );
}
