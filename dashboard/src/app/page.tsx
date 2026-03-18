'use client';

import { Container, Title, Text, Button, Group, Box, SimpleGrid, Card, ThemeIcon, rem, Stack, Badge } from '@mantine/core';
import { IconTargetArrow, IconUsersGroup, IconRefreshAlert, IconArrowRight, IconShieldCheck, IconDatabaseImport } from '@tabler/icons-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <Box>
      {/* Hero Section */}
      <Box 
        style={{
          paddingTop: rem(120),
          paddingBottom: rem(80),
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container size="lg" style={{ position: 'relative', zIndex: 1 }}>
          <Stack align="center" gap="lg" ta="center">
            <Badge variant="outline" color="targetYellow" size="lg" radius="xs" mb="sm" fw={800} style={{ border: '2px solid' }}>
              The Ultimate Prospecting Wedge for MSPs
            </Badge>

            <Title
              order={1}
              style={(theme) => ({
                fontSize: rem(72),
                fontWeight: 900,
                lineHeight: 1.1,
                letterSpacing: '-2px',
                color: '#FFFFFF'
              })}
            >
              Stop Fighting Gatekeepers.<br />
              <span style={{ color: 'var(--mantine-color-targetYellow-5)' }}>Start Closing Deals.</span>
            </Title>

            <Text c="gray.4" size="xl" maw={700} mx="auto" mt="md" fw={400} style={{ letterSpacing: '0.5px' }}>
              TargetZero engine cross-references live organizational data to instantly find 30–100 employee companies with <b style={{ color: '#FFFFFF' }}>low</b> internal IT staff (&le; 2). No gatekeepers. Just direct access to CEOs who actually need you.
            </Text>

            <Group mt={40} justify="center">
              <Button 
                component={Link} 
                href="/dashboard/scanner" 
                size="xl" 
                radius="sm" 
                color="targetYellow"
                rightSection={<IconArrowRight size={20} />}
                style={{
                  color: '#000000',
                  boxShadow: '0 0 30px rgba(234, 179, 8, 0.2)',
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Launch TargetZero Scanner
              </Button>
            </Group>
          </Stack>
        </Container>
      </Box>

      {/* Features Section */}
      <Container size="lg" py={80}>
        <Title order={2} ta="center" mb={60} style={{ fontSize: rem(36), fontWeight: 800, color: '#FFFFFF' }}>
          Why MSPs Choose TargetZero
        </Title>

        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl">
          <Card p="xl" radius="sm">
            <ThemeIcon size={60} radius="sm" variant="filled" color="targetYellow" mb="xl">
              <IconTargetArrow style={{ width: rem(32), height: rem(32), color: '#000000' }} />
            </ThemeIcon>
            <Title order={3} mb="md" fw={700} c="white">The Perfect Wedge</Title>
            <Text c="gray.4" lh={1.6}>
              Stop pitching "co-managed IT" to hostile sysadmins who see you as a threat. Target late-stage startups and mid-market firms looking for their first real IT infrastructure partner.
            </Text>
          </Card>

          <Card p="xl" radius="sm">
            <ThemeIcon size={60} radius="sm" variant="filled" color="targetYellow" mb="xl">
              <IconUsersGroup style={{ width: rem(32), height: rem(32), color: '#000000' }} />
            </ThemeIcon>
            <Title order={3} mb="md" fw={700} c="white">Live Org-Chart Data</Title>
            <Text c="gray.4" lh={1.6}>
              Forget static intent data. We hit live APIs (Apollo & LinkedIn) simultaneously to parse exact departmental structure and mathematically prove they lack an IT team.
            </Text>
          </Card>

          <Card p="xl" radius="sm">
            <ThemeIcon size={60} radius="sm" variant="filled" color="targetYellow" mb="xl">
              <IconDatabaseImport style={{ width: rem(32), height: rem(32), color: '#000000' }} />
            </ThemeIcon>
            <Title order={3} mb="md" fw={700} c="white">HubSpot Native</Title>
            <Text c="gray.4" lh={1.6}>
              Once a target is verified, sync it straight into your CRM pipelines with a custom Density Fit Score. Trigger automated campaigns immediately.
            </Text>
          </Card>
        </SimpleGrid>
      </Container>

      {/* Social Proof / Stats */}
      <Box style={(theme) => ({ 
        backgroundColor: '#1E1F22',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
      })} py={80} mt={40}>
        <Container size="lg">
          <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl" ta="center">
            <Stack gap="xs">
              <Title order={2} c="targetYellow.5" style={{ fontSize: rem(48) }}>90%</Title>
              <Text fw={700} tt="uppercase" c="white" style={{ letterSpacing: 1 }}>Higher Close Rate</Text>
              <Text size="sm" c="gray.4">when bypassing existing IT gatekeepers</Text>
            </Stack>
            <Stack gap="xs">
              <Title order={2} c="targetYellow.5" style={{ fontSize: rem(48) }}>Zero</Title>
              <Text fw={700} tt="uppercase" c="white" style={{ letterSpacing: 1 }}>Rip-and-Replace</Text>
              <Text size="sm" c="gray.4">Be their first true enterprise IT partner</Text>
            </Stack>
            <Stack gap="xs">
              <Title order={2} c="targetYellow.5" style={{ fontSize: rem(48) }}>Real-Time</Title>
              <Text fw={700} tt="uppercase" c="white" style={{ letterSpacing: 1 }}>API Cross-Checking</Text>
              <Text size="sm" c="gray.4">Guaranteed accuracy on departmental headcount</Text>
            </Stack>
          </SimpleGrid>
        </Container>
      </Box>
    </Box>
  );
}
