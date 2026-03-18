'use client';

import { useState } from 'react';
import { Container, Title, Text, Card, Group, TextInput, Button, SimpleGrid, Badge, Skeleton, Box, Stack, Autocomplete, ActionIcon, Tooltip, NumberInput, Modal, Table, rem } from '@mantine/core';
import { IconSearch, IconBuildings, IconUserOff, IconAlertCircle, IconMapPin, IconServer2, IconBookmark, IconCheck } from '@tabler/icons-react';

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", 
  "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", 
  "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", 
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", 
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

interface ApolloContact {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  title: string;
  linkedin_url: string;
}

interface DepartmentalDensity {
  companyName: string;
  domain: string;
  totalEmployees: number;
  itEmployeeCount: number;
  densityScore: number;
  isHighValueLead: boolean;
  decisionMakersFound?: number;
  decisionMakers?: ApolloContact[];
  techStack?: { name: string, category: string }[];
}

export default function Home() {
  const [headcountRange, setHeadcountRange] = useState('30,100');
  const [location, setLocation] = useState('Ohio');
  const [maxItStaff, setMaxItStaff] = useState<number | string>(2);
  const [results, setResults] = useState<DepartmentalDensity[]>([]);
  const [scanStats, setScanStats] = useState<{scanned: number, hits: number, contacts: number} | null>(null);
  const [selectedLead, setSelectedLead] = useState<DepartmentalDensity | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [savingSearch, setSavingSearch] = useState(false);
  const [searchSaved, setSearchSaved] = useState(false);
  const [savingLead, setSavingLead] = useState<string | null>(null);
  const [savedLeads, setSavedLeads] = useState<Set<string>>(new Set());

  const handleSaveSearch = async () => {
    setSavingSearch(true);
    try {
      await fetch('/api/save-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ headcountRange, location, maxItStaff: Number(maxItStaff) })
      });
      setSearchSaved(true);
      setTimeout(() => setSearchSaved(false), 3000);
    } catch (e) {
      console.error(e);
    }
    setSavingSearch(false);
  };

  const handleSaveLead = async (lead: DepartmentalDensity) => {
    setSavingLead(lead.domain);
    try {
      await fetch('/api/save-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead)
      });
      setSavedLeads(prev => new Set(prev).add(lead.domain));
    } catch (e) {
      console.error(e);
    }
    setSavingLead(null);
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
          const data = await res.json();
          setLocation(`${data.city || data.locality}, ${data.principalSubdivision}`);
        } catch (err) {
          setError('Failed to reverse geocode location.');
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError(err.message || 'Failed to get location from browser.');
        setLoading(false);
      }
    );
  };

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults([]);
    setScanStats(null);
    setLogs([]);

    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          headcountRange,
          locations: [location],
          maxItStaff: Number(maxItStaff),
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      
      if (!response.body) {
         throw new Error('No readable stream available');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamFinished = false;

      while (!streamFinished) {
        const { value, done } = await reader.read();
        if (done) {
          streamFinished = true;
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        const events = chunk.split('\n\n').filter(Boolean);

        for (const eventStr of events) {
          if (eventStr.startsWith('event: ')) {
             // Basic naive parse of SSE format: `event: xyz\ndata: {...}`
             const lines = eventStr.split('\n');
             const eventType = lines[0].replace('event: ', '').trim();
             const dataStr = lines[1]?.replace('data: ', '').trim() || '{}';
             
             try {
               const parsedData = JSON.parse(dataStr);
               
               if (eventType === 'progress') {
                 setLogs(prev => [...prev, parsedData.message]);
               } else if (eventType === 'complete') {
                 setResults(parsedData.results || []);
                 setScanStats(parsedData.stats || null);
                 setLoading(false);
               } else if (eventType === 'error') {
                 setError(parsedData.message);
                 setLoading(false);
               }
             } catch (e) {
               console.error("Failed to parse SSE data chunk", dataStr);
             }
          }
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to execute scan.');
      setLoading(false);
    }
  };

  return (
    <Container size="xl" py={60}>
      <Stack align="center" mb={60}>
        <Title
          order={1}
          style={() => ({
            fontSize: rem(64),
            lineHeight: 1.1,
            fontWeight: 800,
            color: '#FFFFFF',
            textAlign: 'center',
            letterSpacing: '-1.5px'
          })}
        >
          Target<span style={{ color: 'var(--mantine-color-targetYellow-5)' }}>Zero</span>
        </Title>
        <Text c="dimmed" size="xl" ta="center" maw={600}>
          Identify high-value MSP prospects by discovering companies with low internal IT staff (&le; {maxItStaff}).
        </Text>
      </Stack>

      <Card p="xl" radius="lg" mb={40} style={{ overflow: 'visible' }}>
        <form onSubmit={handleScan}>
          <Group align="flex-end" justify="center" gap="xl">
            <TextInput
              label="Headcount Range"
              placeholder="e.g. 30,100"
              value={headcountRange}
              onChange={(e) => setHeadcountRange(e.currentTarget.value)}
              required
              w={280}
              size="md"
              classNames={{ label: 'uppercase tracking-wider text-xs mb-1 opacity-70 whitespace-nowrap' }}
            />
            
            <NumberInput
              label="Max IT Staff"
              placeholder="e.g. 2"
              value={maxItStaff}
              onChange={setMaxItStaff}
              min={0}
              max={100}
              required
              w={140}
              size="md"
              classNames={{ label: 'uppercase tracking-wider text-xs mb-1 opacity-70 whitespace-nowrap' }}
            />

            <Autocomplete
              label={
                <Group justify="space-between" align="center" wrap="nowrap" style={{ width: '100%', marginBottom: 4 }}>
                  <span style={{ whiteSpace: 'nowrap' }} className="required-label">Primary Location <span style={{ color: 'var(--mantine-color-error)' }}>*</span></span>
                  <Tooltip label="Use my current location">
                    <ActionIcon 
                      size="sm" 
                      variant="light" 
                      color="targetYellow" 
                      onClick={handleUseMyLocation}
                      style={{ cursor: 'pointer', flexShrink: 0 }}
                    >
                      <IconMapPin size={14} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              }
              placeholder="e.g. Ohio"
              value={location}
              onChange={setLocation}
              data={US_STATES}
              withAsterisk={false}
              required
              w={280}
              size="md"
              classNames={{ label: 'uppercase tracking-wider text-xs opacity-70 w-full block whitespace-nowrap' }}
            />

            <Stack gap="xs" style={{ alignItems: 'center' }}>
              <Button
                type="submit"
                size="md"
                leftSection={<IconSearch size={18} />}
                loading={loading}
                color="targetYellow"
                w={200}
                style={{ color: '#000000', boxShadow: '0 0 20px rgba(234, 179, 8, 0.2)' }}
              >
                Run Scanner
              </Button>
              <Button 
                variant="subtle" 
                color={searchSaved ? "green" : "gray"} 
                size="xs" 
                leftSection={searchSaved ? <IconCheck size={14} /> : <IconBookmark size={14} />}
                onClick={handleSaveSearch}
                loading={savingSearch}
              >
                {searchSaved ? 'Search Saved' : 'Save Search Params'}
              </Button>
            </Stack>
          </Group>
        </form>
      </Card>

      {error && (
        <Card bg="red.9" withBorder={false} mb={40}>
          <Group>
            <IconAlertCircle color="white" />
            <Text c="white" fw={500}>{error}</Text>
          </Group>
        </Card>
      )}

      {(loading || logs.length > 0) && (
        <Card p="xl" radius="md" mb={40} withBorder>
          <Group mb="md">
            {loading ? (
              <>
                <IconSearch size={24} className="animate-pulse" color="var(--mantine-color-targetYellow-5)" />
                <Text fw={600} size="lg">Scanner running in real-time...</Text>
              </>
            ) : (
              <>
                <IconBuildings size={24} color="var(--mantine-color-targetYellow-5)" />
                <Text fw={600} size="lg">Scan Complete.</Text>
              </>
            )}
          </Group>
          
          <Box 
            p="md" 
            style={(theme) => ({
              backgroundColor: 'var(--mantine-color-dark-8)', 
              color: 'var(--mantine-color-dark-0)', 
              borderRadius: '8px',
              border: '1px solid var(--mantine-color-dark-5)',
              height: '300px',
              overflowY: 'auto',
              fontFamily: 'monospace'
            })}
          >
            {logs.length === 0 ? (
              <Text size="sm" c="dimmed">Initializing scanner engine...</Text>
            ) : (
              logs.map((log, idx) => (
                <Text key={idx} size="sm" mb={6} style={{ color: log.includes('Target Acquired') ? 'var(--mantine-color-green-4)' : 'inherit' }}>
                  <span style={{ opacity: 0.5, marginRight: '8px' }}>[{new Date().toLocaleTimeString()}]</span>
                  {log}
                </Text>
              ))
            )}
            <div ref={(el) => { el?.scrollIntoView({ behavior: 'smooth' }); }} />
          </Box>
        </Card>
      )}

      {!loading && results.length === 0 && !error && logs.length === 0 && (
        <Box ta="center" py={80} style={{ opacity: 0.5 }}>
          <IconBuildings size={60} stroke={1} />
          <Text mt="md" size="lg">Ready to scan. Enter criteria to find leads.</Text>
        </Box>
      )}

      {!loading && results.length === 0 && !error && logs.length > 0 && (
        <Box ta="center" py={40} mb={40}>
          <Text size="xl" fw={600} c="dimmed">No High-Value Leads found.</Text>
          <Text c="dimmed">The scanner checked the candidates but none met the criteria of {maxItStaff} or fewer IT staff. Try adjusting the headcount range, location, or increasing the max IT staff.</Text>
        </Box>
      )}

      {!loading && scanStats && (
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md" mb={40}>
          <Card ta="center" p="md" radius="md" withBorder>
            <Text size="xs" tt="uppercase" c="dimmed" fw={700} mb={4}>Candidates Scanned</Text>
            <Text size="xl" fw={800}>{scanStats.scanned}</Text>
          </Card>
          <Card ta="center" p="md" radius="md" withBorder>
            <Text size="xs" tt="uppercase" c="dimmed" fw={700} mb={4}>High-Value Targets</Text>
            <Text size="xl" fw={800} c="green.5">{scanStats.hits}</Text>
          </Card>
          <Card ta="center" p="md" radius="md" withBorder>
            <Text size="xs" tt="uppercase" c="dimmed" fw={700} mb={4}>Contacts Synced</Text>
            <Text size="xl" fw={800} c="targetYellow.5">{scanStats.contacts}</Text>
          </Card>
        </SimpleGrid>
      )}

      {!loading && results.length > 0 && (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xl">
          {results.map((lead, idx) => (
            <Card 
              key={idx} 
              p="xl" 
              onClick={() => setSelectedLead(lead)}
              style={(theme) => ({
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 8px 24px rgba(0,0,0,0.15)`
                },
                ...(lead.itEmployeeCount <= Number(maxItStaff) && {
                  border: `2px solid var(--mantine-color-targetYellow-filled)`
                })
              })}
            >
              {lead.isHighValueLead && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  backgroundColor: `var(--mantine-color-targetYellow-filled)`
                }} />
              )}
              
              <Group justify="space-between" align="flex-start" mb="xl">
                <div>
                  <Title order={3} mb={4}>{lead.companyName}</Title>
                  <Text component="a" href={`https://${lead.domain}`} target="_blank" size="sm" c="dimmed" style={{ textDecoration: 'none' }}>
                    {lead.domain}
                  </Text>
                </div>
                {lead.isHighValueLead && (
                  <Badge variant="light" color="green" size="lg" radius="sm">
                    High Value 🎯
                  </Badge>
                )}
              </Group>

              {lead.techStack && lead.techStack.length > 0 && (
                <Box mb="xl" p="md" style={{ backgroundColor: 'var(--mantine-color-dark-8)', borderRadius: '8px' }}>
                  <Text size="xs" c="dimmed" tt="uppercase" className="tracking-wider" mb="xs">
                    <Group gap={6}>
                      <IconServer2 size={12} />
                      Key Infrastructure
                    </Group>
                  </Text>
                  <Group gap="xs">
                    {lead.techStack.map(tech => (
                      <Badge key={tech.name} variant="light" color="gray" size="xs" title={tech.category} style={{ textTransform: 'none' }}>
                        {tech.name}
                      </Badge>
                    ))}
                  </Group>
                </Box>
              )}

              <Group grow align="flex-start" mt="auto">
                <Box>
                  <Text size="xs" tt="uppercase" c="dimmed" fw={600} mb={4}>Total Staff</Text>
                  <Text size="xl" fw={700}>{lead.totalEmployees}</Text>
                </Box>
                <Box>
                  <Text size="xs" tt="uppercase" c="dimmed" fw={600} mb={4}>IT Staff</Text>
                  <Group gap="xs">
                    {lead.itEmployeeCount <= Number(maxItStaff) && <IconUserOff size={16} color="var(--mantine-color-green-5)" />}
                    <Text 
                      size="xl" 
                      fw={700} 
                      c={lead.itEmployeeCount <= Number(maxItStaff) ? 'green.4' : 'inherit'}
                    >
                      {lead.itEmployeeCount}
                    </Text>
                  </Group>
                </Box>
                <Box>
                  <Text size="xs" tt="uppercase" c="dimmed" fw={600} mb={4}>Score</Text>
                  <Text size="xl" fw={700}>{lead.densityScore}%</Text>
                </Box>
                <Box>
                  <Text size="xs" tt="uppercase" c="dimmed" fw={600} mb={4}>Contacts Auto-Synced</Text>
                  <Group gap="xs">
                    <IconBuildings size={16} color="var(--mantine-color-targetYellow-5)" />
                    <Text size="xl" fw={700} c="targetYellow.4">
                      {lead.decisionMakersFound || 0}
                    </Text>
                  </Group>
                </Box>
              </Group>
            </Card>
          ))}
        </SimpleGrid>
      )}

      <Modal 
        opened={!!selectedLead} 
        onClose={() => setSelectedLead(null)}
        size="xl"
        title={
          <Group gap="sm">
            <Title order={3}>{selectedLead?.companyName}</Title>
            {selectedLead?.isHighValueLead && <Badge color="green" variant="light">High Value 🎯</Badge>}
          </Group>
        }
      >
        {selectedLead && (
          <Stack gap="xl">
            <Card withBorder p="md" radius="md" bg="dark.8">
              <Text size="sm" c="dimmed" mb="xs">Density Analysis</Text>
              <Text>
                We discovered <strong>{selectedLead.totalEmployees}</strong> total employees, but only <strong>{selectedLead.itEmployeeCount}</strong> core IT staff. This gives them an extreme density vulnerability score of <Text component="span" fw={700} c="red.4">{selectedLead.densityScore}%</Text>.
              </Text>
            </Card>

            {selectedLead.techStack && selectedLead.techStack.length > 0 && (
              <Box>
                <Title order={5} mb="md">Infrastructure</Title>
                <Group gap="xs">
                  {selectedLead.techStack.map(tech => (
                    <Badge key={tech.name} variant="light" color="gray" size="md" title={tech.category} style={{ textTransform: 'none' }}>
                      {tech.name}
                    </Badge>
                  ))}
                </Group>
              </Box>
            )}

            {selectedLead.decisionMakers && selectedLead.decisionMakers.length > 0 && (
              <Box>
                <Title order={5} mb="md">Synced Contacts</Title>
                <Table striped highlightOnHover withTableBorder>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Name</Table.Th>
                      <Table.Th>Title</Table.Th>
                      <Table.Th>Email</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {selectedLead.decisionMakers.map(dm => (
                      <Table.Tr key={dm.id}>
                        <Table.Td>
                          <Text component="a" href={dm.linkedin_url || '#'} target="_blank" c="blue" size="sm">
                            {dm.first_name} {dm.last_name}
                          </Text>
                        </Table.Td>
                        <Table.Td><Text size="sm">{dm.title}</Text></Table.Td>
                        <Table.Td><Text size="sm" c="dimmed">{dm.email || 'Not found'}</Text></Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Box>
            )}

            <Group justify="flex-end" mt="md">
              <Button 
                variant="light" 
                color={savedLeads.has(selectedLead.domain) ? "green" : "targetYellow"} 
                leftSection={savedLeads.has(selectedLead.domain) ? <IconCheck size={16} /> : <IconBookmark size={16} />}
                onClick={() => handleSaveLead(selectedLead)}
                loading={savingLead === selectedLead.domain}
                disabled={savedLeads.has(selectedLead.domain)}
              >
                {savedLeads.has(selectedLead.domain) ? 'Saved to Dashboard' : 'Save Lead'}
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>

    </Container>
  );
}
