import { useFetch } from '@app/hooks/useFetch';
import {
  ActionGroup,
  Button,
  Form,
  FormGroup,
  PageSection,
  PageSectionVariants,
  Stack,
  StackItem,
  TextInput,
  Title,
} from '@patternfly/react-core';
import { Fleet } from '@types';
import { Formik, useFormikContext } from 'formik';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';

type FleetFormValues = {
  name: string;
  osImage: string;
};

const getFleetResource = (values: FleetFormValues) => ({
  apiVersion: 'v1alpha1',
  kind: 'Fleet',
  metadata: {
    name: values.name,
  },
  spec: {
    selector: {
      matchLabels: {
        fleet: values.name,
      },
    },
    template: {
      metadata: {
        labels: {
          fleet: values.name,
        },
      },
      spec: {
        os: {
          image: values.osImage,
        },
        config: [],
      },
    },
  },
});

const CreateFleetForm = () => {
  const navigate = useNavigate();
  const { values, setFieldValue, submitForm, isSubmitting } = useFormikContext<FleetFormValues>();
  return (
    <Form>
      <FormGroup label="Name" isRequired>
        <TextInput aria-label="Name" value={values.name} onChange={(_, value) => setFieldValue('name', value)} />
      </FormGroup>
      <FormGroup label="OS image" isRequired>
        <TextInput
          aria-label="OS image"
          value={values.osImage}
          onChange={(_, value) => setFieldValue('osImage', value)}
        />
      </FormGroup>
      <ActionGroup>
        <Button variant="primary" onClick={submitForm} isLoading={isSubmitting} isDisabled={isSubmitting}>
          Create fleet
        </Button>
        <Button variant="link" isDisabled={isSubmitting} onClick={() => navigate(-1)}>
          Cancel
        </Button>
      </ActionGroup>
    </Form>
  );
};

const CreateFleet = () => {
  const navigate = useNavigate();
  const { post } = useFetch();
  return (
    <PageSection variant={PageSectionVariants.light}>
      <Stack hasGutter>
        <StackItem>
          <Title headingLevel="h1" size="3xl">
            Create fleet
          </Title>
        </StackItem>
        <StackItem>
          <Formik<FleetFormValues>
            initialValues={{
              name: '',
              osImage: '',
            }}
            onSubmit={async (values) => {
              await post<Fleet>('fleets', getFleetResource(values));
              navigate('/devicemanagement/fleets');
            }}
          >
            <CreateFleetForm />
          </Formik>
        </StackItem>
      </Stack>
    </PageSection>
  );
};

export default CreateFleet;
