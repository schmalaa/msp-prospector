import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs';
import { Geist, Geist_Mono } from "next/font/google";
import "@mantine/core/styles.css";
import "./globals.css";
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { theme } from './theme';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TargetZero",
  description: "MSP Prospecting Engine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: '#141517', // Stark charcoal background
        }}
      >
        <MantineProvider defaultColorScheme="dark" theme={theme}>
          <Header />
          <main style={{ padding: '20px 0', flex: 1 }}>
            {children}
          </main>
          <Footer />
        </MantineProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
