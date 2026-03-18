'use client';
import { Group, Title, Button, Container } from '@mantine/core';
import { SignInButton, UserButton, useAuth } from '@clerk/nextjs';
import { IconCrosshair } from '@tabler/icons-react';
import Link from 'next/link';

export function Header() {
  const { isLoaded, userId } = useAuth();

  return (
    <header style={{ 
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        backgroundColor: '#1E1F22',
        position: 'sticky',
        top: 0,
        zIndex: 100
    }}>
      <Container size="xl">
        <Group justify="space-between" h={70}>
            <Group gap="sm" style={{ cursor: 'pointer' }} onClick={() => window.location.href = '/'}>
               <IconCrosshair size={28} color="var(--mantine-color-targetYellow-5)" />
               <Title order={3} c="gray.0" style={{ letterSpacing: '-0.5px' }}>
                 Target<span style={{ color: 'var(--mantine-color-targetYellow-5)' }}>Zero</span>
               </Title>
            </Group>

            <Group>
                {!isLoaded ? null : userId ? (
                    <>
                        <Button component={Link} href="/dashboard" variant="subtle" color="gray" size="sm">Dashboard</Button>
                        <Button component={Link} href="/pricing" variant="subtle" color="targetYellow" size="sm">Pricing</Button>
                        <UserButton 
                        appearance={{
                            elements: {
                                userButtonAvatarBox: {
                                    width: 40,
                                    height: 40
                                }
                            }
                        }}
                    />
                    </>
                ) : (
                    <SignInButton mode="modal">
                        <Button color="targetYellow" radius="sm">
                            Sign In
                        </Button>
                    </SignInButton>
                )}
            </Group>
        </Group>
      </Container>
    </header>
  );
}
