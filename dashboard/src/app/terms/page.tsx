import { Container, Title, Text, Stack } from '@mantine/core';

export default function TermsPage() {
  return (
    <Container size="md" py={60}>
      <Title order={1} mb="xl" style={{ color: 'var(--mantine-color-gray-0)' }}>
        Terms of Service
      </Title>

      <Stack gap="xl">
        <section>
          <Title order={3} mb="sm" style={{ color: 'var(--mantine-color-gray-2)' }}>1. Acceptance of Terms</Title>
          <Text c="dimmed" lh={1.6}>
            By accessing or using TargetZero, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service. These terms apply to all visitors, users, and others who access or use the software.
          </Text>
        </section>

        <section>
          <Title order={3} mb="sm" style={{ color: 'var(--mantine-color-gray-2)' }}>2. Subscription and API Credits</Title>
          <Text c="dimmed" lh={1.6}>
            TargetZero utilizes an API-credit consumption model. Credits are strictly non-refundable once consumed by the density scanning engine. Pro and Enterprise subscription tiers grant a recurring monthly allotment of API credits. Subscriptions automatically renew unless canceled. TargetZero reserves the right to modify credit allocation logic based on external provider (Apollo/Proxycurl) API cost fluctuations.
          </Text>
        </section>

        <section>
          <Title order={3} mb="sm" style={{ color: 'var(--mantine-color-gray-2)' }}>3. Fair Use & Rate Limiting</Title>
          <Text c="dimmed" lh={1.6}>
            You agree not to bypass, circumvent, or attempt to disable the platform's API rate limiting or credit deduction mechanisms. Automated scraping of the TargetZero dashboard or programmatic abuse of the `/api/scan` endpoint will result in immediate account termination without refund.
          </Text>
        </section>

        <section>
          <Title order={3} mb="sm" style={{ color: 'var(--mantine-color-gray-2)' }}>4. Limitation of Liability</Title>
          <Text c="dimmed" lh={1.6}>
            TargetZero aggregates data from public infrastructure tools and professional networks. We do not guarantee the 100% accuracy of Total Employee counts, IT headcounts, or technical infrastructure analysis. TargetZero shall not be held liable for lost revenue, lost profits, or any indirect damages resulting from the use or inability to use the platform.
          </Text>
        </section>
      </Stack>
    </Container>
  );
}
