import { Container, Title, Text, Stack } from '@mantine/core';

export default function PrivacyPage() {
  return (
    <Container size="md" py={60}>
      <Title order={1} mb="xl" style={{ color: 'var(--mantine-color-gray-0)' }}>
        Privacy Policy
      </Title>

      <Stack gap="xl">
        <section>
          <Title order={3} mb="sm" style={{ color: 'var(--mantine-color-gray-2)' }}>1. Data Collection</Title>
          <Text c="dimmed" lh={1.6}>
            TargetZero collects only the absolute minimum data required to facilitate your use of the SaaS platform. We collect your email address and profile details strictly for authentication mapping via Clerk. We also store your IP address to prevent abuse and enforce API rate-limits.
          </Text>
        </section>

        <section>
          <Title order={3} mb="sm" style={{ color: 'var(--mantine-color-gray-2)' }}>2. Target Data Storage</Title>
          <Text c="dimmed" lh={1.6}>
            Any search filters and specific firmographic leads you explicitly "Save to Dashboard" are permanently persisted to our encrypted databases. We do not sell, rent, or distribute your private lead pipelines. You retain total ownership over the targets you discover through our density scanning algorithm.
          </Text>
        </section>

        <section>
          <Title order={3} mb="sm" style={{ color: 'var(--mantine-color-gray-2)' }}>3. Third-Party Integrations</Title>
          <Text c="dimmed" lh={1.6}>
            In order to analyze infrastructure density, TargetZero passes strictly the target company names/domains to our data providers (including but not limited to Apollo.io and Proxycurl). We do not transmit your personal identifiable information (PII) to these third parties except when explicitly required to negotiate CRM data-syncing protocols (e.g. HubSpot OAuth).
          </Text>
        </section>
      </Stack>
    </Container>
  );
}
