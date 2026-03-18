'use client';

import React, { useState } from 'react';
import { Title, Text, Container, Paper, Table, Badge, Button, Group, Menu, ActionIcon } from '@mantine/core';
import { IconDotsVertical, IconCheck } from '@tabler/icons-react';
import { User } from '@prisma/client';

interface AdminClientProps {
  initialUsers: User[];
}

export default function AdminClient({ initialUsers }: AdminClientProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const upgradeUser = async (userId: string, planAction: string) => {
    setUpdatingId(userId);
    try {
      const response = await fetch('/api/admin/update-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, planAction }),
      });

      if (!response.ok) {
        alert('Failed to update user plan');
        return;
      }

      const updatedUser = await response.json();
      setUsers((prev) =>
        prev.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      );
    } catch (error) {
      console.error(error);
      alert('Error escalating privileges');
    } finally {
      setUpdatingId(null);
    }
  };

  const rows = users.map((user) => (
    <Table.Tr key={user.id}>
      <Table.Td>
        <Text size="sm" fw={500} c="gray.2">{user.email || 'Unknown'}</Text>
        <Text size="xs" c="dimmed">{user.id}</Text>
      </Table.Td>
      <Table.Td>
        <Badge
          color={
            user.plan.toUpperCase() === 'ENTERPRISE'
              ? 'yellow.5'
              : user.plan.toUpperCase() === 'PRO'
              ? 'blue.5'
              : 'gray'
          }
          variant="light"
        >
          {user.plan}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Text size="sm" c="gray.3" fw={600}>
          {user.credits.toLocaleString()} / <span style={{ color: '#EAB308' }}>{(user.scansPerformed || 0).toLocaleString()} Scans</span>
        </Text>
      </Table.Td>
      <Table.Td>
        <Text size="sm" c="dimmed">
          {new Date(user.createdAt).toLocaleDateString()}
        </Text>
      </Table.Td>
      <Table.Td>
        <Menu shadow="md" width={200} position="bottom-end">
          <Menu.Target>
            <ActionIcon variant="subtle" color="gray" loading={updatingId === user.id}>
              <IconDotsVertical size={16} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Manual Upgrades</Menu.Label>
            <Menu.Item onClick={() => upgradeUser(user.id, 'upgrade_pro')}>
              Execute Pro Upgrade Key
            </Menu.Item>
            <Menu.Item onClick={() => upgradeUser(user.id, 'upgrade_enterprise')}>
              Execute Enterprise Upgrade Key
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item color="red" onClick={() => upgradeUser(user.id, 'downgrade_free')}>
              Downgrade to Free Tier
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Container size="xl" py="xl">
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={1} size="h2" mb={4} c="gray.1" style={{ letterSpacing: '-0.5px' }}>
            System Administration
          </Title>
          <Text c="dimmed" size="sm">
            Globally restricted intelligence port. Real-time SaaS user trajectory.
          </Text>
        </div>
        <Badge color="red.7" variant="dot" size="lg">
          Schmalaa Override Enabled
        </Badge>
      </Group>

      <Paper withBorder radius="md" p="md" bg="#1A1B1E" style={{ borderColor: '#2C2E33' }}>
        <Table verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>User Details</Table.Th>
              <Table.Th>Active Tier</Table.Th>
              <Table.Th>Credits / Lifetime Scans</Table.Th>
              <Table.Th>Join Date</Table.Th>
              <Table.Th></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Paper>
    </Container>
  );
}
