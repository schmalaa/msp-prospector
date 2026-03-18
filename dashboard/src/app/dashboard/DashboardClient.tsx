'use client';

import { Container, Title, Text, Card, Group, Progress, SimpleGrid, Badge, Table, Button, ActionIcon } from '@mantine/core';
import { IconSearch, IconUser, IconBuilding, IconArrowRight, IconMapPin } from '@tabler/icons-react';
import Link from 'next/link';

interface DashboardClientProps {
  user: any; // Using any for brevity, maps to Prisma User
  initialSearches: any[];
  initialLeads: any[];
}

export function DashboardClient({ user, initialSearches, initialLeads }: DashboardClientProps) {
  // Determine max credits for progress bar
  let maxCredits = 100;
  const currentPlan = user.plan.toUpperCase();
  if (currentPlan === 'PRO') maxCredits = 500;
  if (currentPlan === 'ENTERPRISE') maxCredits = 5000;

  const creditPercentage = Math.min(100, Math.max(0, (user.credits / maxCredits) * 100));

  return (
    <Container size="lg" py="xl">
      <Title order={2} mb="md" style={{ color: 'var(--mantine-color-gray-0)' }}>
        Account Dashboard
      </Title>

      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" mb="xl">
        {/* Credits Card */}
        <Card withBorder radius="md" p="xl" style={{ backgroundColor: '#1E1F22' }}>
          <Group justify="space-between" mb="xs">
            <Text fz="sm" c="dimmed" fw={700} tt="uppercase">
              Remaining API Credits
            </Text>
            <Badge color="targetYellow" variant="light">
              {user.plan} PLAN
            </Badge>
          </Group>
          <Text fz={36} fw={800} style={{ color: 'var(--mantine-color-gray-0)' }}>
            {user.credits.toLocaleString()} <Text component="span" fz="sm" c="dimmed" fw={600}>/ {maxCredits.toLocaleString()}</Text>
          </Text>
          <Progress 
            value={creditPercentage} 
            mt="md" 
            size="lg" 
            radius="xl"
            color="targetYellow"
            bg="dark.6"
          />
          <Group mt="md" justify="flex-end">
             <Button component={Link} href="/pricing" variant="subtle" color="targetYellow" size="xs">
               Manage Plan
             </Button>
          </Group>
        </Card>

        {/* Quick Actions */}
        <Card withBorder radius="md" p="xl" style={{ backgroundColor: '#1E1F22' }}>
          <Text fz="sm" c="dimmed" fw={700} tt="uppercase" mb="md">
            Quick Actions
          </Text>
          <Group grow>
            <Button 
              component={Link} 
              href="/dashboard/scanner" 
              leftSection={<IconSearch size={16} />}
              color="targetYellow"
              variant="outline"
            >
              New TargetZero Scan
            </Button>
          </Group>
        </Card>
      </SimpleGrid>

      {/* Saved Leads Table */}
      <Title order={4} mb="sm" mt="xl" style={{ color: 'var(--mantine-color-gray-0)' }}>
        Saved High-Value Leads
      </Title>
      {initialLeads.length > 0 ? (
        <Card withBorder p={0} radius="md" style={{ backgroundColor: '#1E1F22', overflow: 'hidden' }}>
          <Table verticalSpacing="sm" horizontalSpacing="md" striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Company</Table.Th>
                <Table.Th>Est. Total Staff</Table.Th>
                <Table.Th>IT Staff</Table.Th>
                <Table.Th>Density</Table.Th>
                <Table.Th />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {initialLeads.map((lead) => (
                <Table.Tr key={lead.id}>
                  <Table.Td>
                    <Group gap="sm">
                      <IconBuilding size={16} color="var(--mantine-color-targetYellow-5)" />
                      <Text fw={600} size="sm">{lead.companyName}</Text>
                    </Group>
                    <Text size="xs" c="dimmed">{lead.domain}</Text>
                  </Table.Td>
                  <Table.Td>{lead.totalEmployees.toLocaleString()}</Table.Td>
                  <Table.Td>
                    <Badge color="red" variant="light" size="sm">
                      {lead.itEmployeeCount} detected
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text fw={700} c="targetYellow">{lead.densityScore}%</Text>
                  </Table.Td>
                  <Table.Td>
                    <Button variant="light" size="xs" color="gray" rightSection={<IconArrowRight size={14} />}>
                      View details
                    </Button>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>
      ) : (
        <Text c="dimmed" size="sm" fs="italic">No leads saved yet. Run a scan to find targets.</Text>
      )}

      {/* Saved Searches Table */}
      <Title order={4} mb="sm" mt="xl" style={{ color: 'var(--mantine-color-gray-0)' }}>
        Saved Search Configurations
      </Title>
      {initialSearches.length > 0 ? (
        <Card withBorder p={0} radius="md" style={{ backgroundColor: '#1E1F22', overflow: 'hidden' }}>
          <Table verticalSpacing="sm" horizontalSpacing="md">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Target Location</Table.Th>
                <Table.Th>Headcount Range</Table.Th>
                <Table.Th>Max IT Staff</Table.Th>
                <Table.Th />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {initialSearches.map((search) => (
                <Table.Tr key={search.id}>
                  <Table.Td>
                    <Group gap="xs">
                      <IconMapPin size={14} color="gray" />
                      <Text size="sm" fw={500}>{search.location}</Text>
                    </Group>
                  </Table.Td>
                  <Table.Td><Badge variant="outline" color="gray">{search.headcountRange}</Badge></Table.Td>
                  <Table.Td><Text size="sm" fw={700}>≤ {search.maxItStaff}</Text></Table.Td>
                  <Table.Td>
                      <Button variant="subtle" size="xs" color="targetYellow">Re-run</Button>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>
      ) : (
        <Text c="dimmed" size="sm" fs="italic">No searches saved.</Text>
      )}
    </Container>
  );
}
