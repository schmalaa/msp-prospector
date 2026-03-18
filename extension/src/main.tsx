import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ClerkProvider } from '@clerk/chrome-extension'
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'

// The user must provide this key in their environment
const PUBLISHABLE_KEY = process.env.VITE_CLERK_PUBLISHABLE_KEY || "YOUR_CLERK_PUBLISHABLE_KEY_HERE";

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <MantineProvider defaultColorScheme="dark">
        <App />
      </MantineProvider>
    </ClerkProvider>
  </React.StrictMode>
)
