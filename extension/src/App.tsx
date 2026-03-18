import { useState, useEffect } from 'react'
import { SignedIn, SignedOut, SignIn, useAuth } from '@clerk/chrome-extension'
import { Button, Container, Title, Text, Stack } from '@mantine/core'

function App() {
  return (
    <Container w={400} p="md">
      <SignedOut>
         <Stack align="center" gap="md">
            <Title order={3}>Density Scout</Title>
            <Text>Please sign in to your staff account.</Text>
            <SignIn routing="virtual" />
         </Stack>
      </SignedOut>
      <SignedIn>
         <ScannerInterface />
      </SignedIn>
    </Container>
  )
}

function ScannerInterface() {
   const { getToken } = useAuth();
   const [domain, setDomain] = useState<string>('');
   const [scanning, setScanning] = useState(false);
   const [result, setResult] = useState<any>(null);

   useEffect(() => {
     // Check if running in Chrome Extension environment
     if (typeof chrome !== 'undefined' && chrome.tabs) {
         chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
           if (tabs[0]?.url) {
             try {
               const url = new URL(tabs[0].url);
               setDomain(url.hostname.replace('www.', ''));
             } catch (e) {
               console.error("Invalid URL:", tabs[0].url);
             }
           }
         });
     } else {
         // Fallback for local Vite dev server testing
         setDomain('stripe.com');
     }
   }, []);

   const analyzeDomain = async () => {
      setScanning(true);
      try {
         const token = await getToken();
         // Connect to the monolithic backend API
         const res = await fetch('http://localhost:3000/api/lookup', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ domain })
         });
         
         if (!res.ok) {
           console.error('API Error:', res.statusText);
           setScanning(false);
           return;
         }

         const data = await res.json();
         setResult(data);
      } catch (e) {
         console.error('Failed to look up domain', e);
      }
      setScanning(false);
   }

   return (
       <Stack gap="md">
           <Title order={3}>Density Scout</Title>
           {domain ? (
              <Text>Active Site: <strong>{domain}</strong></Text>
           ) : (
              <Text c="red">No active domain detected.</Text>
           )}
           
           <Button loading={scanning} onClick={analyzeDomain} disabled={!domain} fullWidth>
              Analyze Domain
           </Button>

           {result && (
              <Stack gap="xs" mt="sm">
                 <Text>Total Employees: <strong>{result.totalEmployees}</strong></Text>
                 <Text>IT Staff: <Text component="span" c={result.isHighValueLead ? 'green.4' : 'inherit'} fw={700}>{result.itEmployeeCount}</Text></Text>
                 <Text fw={700}>Density Score: {result.densityScore}%</Text>
                 
                 {result.isHighValueLead && (
                     <Text c="green" size="sm" mt="xs">
                        🎯 Target Acquired! Hubspot Synced.
                     </Text>
                 )}
              </Stack>
           )}
       </Stack>
   )
}

export default App
