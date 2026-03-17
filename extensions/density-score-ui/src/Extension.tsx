import React from 'react';
import {
  hubspot,
  Text,
  Alert,
  Flex,
  Box,
  LoadingSpinner,
  Tag,
  Divider,
} from '@hubspot/ui-extensions';

type ExtensionProps = {
  context: {
    crm: {
      objectId: number;
    };
  };
  runServerlessFunction: (options: { name: string; parameters?: any }) => Promise<any>;
};

const DensityScoreCard = ({ context, runServerlessFunction }: ExtensionProps) => {
  const [loading, setLoading] = React.useState(true);
  const [densityData, setDensityData] = React.useState<{
    densityScore: number;
    itCount: number;
    total: number;
    isHighValue: boolean;
  } | null>(null);

  React.useEffect(() => {
    // In a real implementation we would fetch this from a serverless function 
    // or custom object data attached to the CRM record.
    // For scaffolding, we simulate fetching the density score.
    runServerlessFunction({ name: 'getDensityScore', parameters: { companyId: context.crm.objectId } })
      .then((res: any) => {
        if (res.response) {
          setDensityData(res.response);
        }
      })
      .catch((err: any) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [context.crm.objectId]);

  if (loading) {
    return <LoadingSpinner label="Calculating Density Score..." />;
  }

  if (!densityData) {
    return <Alert title="No Data Found" variant="warning">Could not retrieve density score for this company.</Alert>;
  }

  return (
    <Flex direction="column" gap="small">
      <Box>
        <Text variant="microcopy">Departmental Density</Text>
        <Flex align="center" gap="small">
          <Text variant="heading1">{densityData.densityScore}%</Text>
          {densityData.isHighValue && (
            <Tag variant="success">High Value Lead</Tag>
          )}
        </Flex>
      </Box>
      <Divider />
      <Box>
        <Text><strong>Total Employees:</strong> {densityData.total}</Text>
        <Text><strong>IT Employees:</strong> {densityData.itCount}</Text>
      </Box>
      {densityData.isHighValue ? (
        <Alert title="Prospecting Recommended" variant="success">
          This company has 0 dedicated IT staff. They are an ideal candidate for MSP services!
        </Alert>
      ) : (
        <Alert title="Low Priority" variant="info">
          This company already has IT staff. Proceed with caution.
        </Alert>
      )}
    </Flex>
  );
};

// Register via standard HubSpot UI extensions pattern
hubspot.extend(({ context, runServerlessFunction }) => (
  <DensityScoreCard context={context} runServerlessFunction={runServerlessFunction} />
));
