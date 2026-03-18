'use client';

import { Container, Group, Text, Anchor } from '@mantine/core';
import { IconCrosshair } from '@tabler/icons-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer style={{ 
      marginTop: 'auto',
      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      backgroundColor: '#1E1F22',
      padding: '40px 0'
    }}>
      <Container size="xl">
        <Group justify="space-between" align="center">
          <Group gap="sm">
             <IconCrosshair size={24} color="var(--mantine-color-targetYellow-5)" />
             <Text fw={700} c="gray.0" size="lg" style={{ letterSpacing: '-0.5px' }}>
               Target<span style={{ color: 'var(--mantine-color-targetYellow-5)' }}>Zero</span>
             </Text>
          </Group>

          <Group gap="xl">
            <Anchor component={Link} href="/terms" c="dimmed" size="sm" style={{ textDecoration: 'none' }}>
              Terms of Service
            </Anchor>
            <Anchor component={Link} href="/privacy" c="dimmed" size="sm" style={{ textDecoration: 'none' }}>
              Privacy Policy
            </Anchor>
            <Anchor component={Link} href="/pricing" c="dimmed" size="sm" style={{ textDecoration: 'none' }}>
              Pricing
            </Anchor>
          </Group>
        </Group>

        <Text mt="xl" size="xs" c="dimmed">
          © {new Date().getFullYear()} TargetZero Engine. All rights reserved. Do not distribute.
        </Text>
      </Container>
    </footer>
  );
}
