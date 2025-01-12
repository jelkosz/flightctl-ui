import { useFetch } from '@app/hooks/useFetch';
import { useFetchPeriodically } from '@app/hooks/useFetchPeriodically';
import {
  Alert,
  Bullseye,
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateHeader,
  PageSection,
  PageSectionVariants,
  Spinner,
  Stack,
  StackItem,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from '@patternfly/react-core';
import { ActionsColumn, Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { FleetList } from '@types';
import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const FleetTable = () => {
  const [fleetList, loading, error, refetch] = useFetchPeriodically<FleetList>('fleets');
  const { remove } = useFetch();

  if (error) {
    return <Alert variant="danger" title="An error occured" isInline />;
  }

  if (loading) {
    return (
      <Bullseye>
        <Spinner />
      </Bullseye>
    );
  }

  if (!fleetList?.items?.length) {
    // TODO UXD needed (design, copy and placing)
    return (
      <EmptyState>
        <EmptyStateHeader titleText={<>You haven&apos;t created any fleets yet</>} headingLevel="h4" />
        <EmptyStateBody>Create a new fleet using the &quot;Create&quot; button</EmptyStateBody>
      </EmptyState>
    );
  }

  return (
    <Table aria-label="Fleets table">
      <Thead>
        <Tr>
          <Th>Name</Th>
          <Th>Source</Th>
          <Th>Devices</Th>
          <Th>In-sync</Th>
          <Th>Status</Th>
          <Td />
        </Tr>
      </Thead>
      <Tbody>
        {fleetList.items.map((fleet) => (
          <Tr key={fleet.metadata.name}>
            <Td dataLabel="Name">
              <Link to={`${fleet.metadata.name}`}>{fleet.metadata.name}</Link>
            </Td>
            <Td dataLabel="Source">{fleet.spec.template.spec.os?.image || '-'}</Td>
            <Td dataLabel="Devices">-</Td>
            <Td dataLabel="In-sync">-</Td>
            <Td dataLabel="Status">-</Td>
            <Td isActionCell>
              <ActionsColumn
                items={[
                  {
                    title: 'Delete',
                    onClick: async () => {
                      await remove(`fleets/${fleet.metadata.name}`);
                      refetch();
                    },
                  },
                ]}
              />
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

const FleetList = () => {
  const navigate = useNavigate();

  return (
    <PageSection variant={PageSectionVariants.light}>
      <Stack hasGutter>
        <StackItem>
          <Title headingLevel="h1" size="3xl">
            Fleets
          </Title>
        </StackItem>
        <StackItem>
          <Toolbar>
            <ToolbarContent>
              <ToolbarItem>
                <Button variant="primary" onClick={() => navigate('/devicemanagement/fleets/create')}>
                  Create
                </Button>
              </ToolbarItem>
            </ToolbarContent>
          </Toolbar>
        </StackItem>
        <StackItem>
          <FleetTable />
        </StackItem>
      </Stack>
    </PageSection>
  );
};

export default FleetList;
