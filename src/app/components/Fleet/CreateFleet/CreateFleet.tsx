import { useFetch } from '@app/hooks/useFetch';
import {
  ActionGroup,
  Alert,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Form,
  FormGroup,
  Grid,
  PageSection,
  PageSectionVariants,
  Stack,
  StackItem,
  TextInput,
  Title,
} from '@patternfly/react-core';
import { Fleet, GitConfigProviderSpec, InlineConfigProviderSpec, KubernetesSecretProviderSpec } from '@types';
import { Formik, useFormikContext } from 'formik';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import LabelsField from '../../form/LabelsField';
import { FleetFormValues } from './types';
import ConfigTemplateForm from './ConfigTemplateForm';
import * as yaml from 'js-yaml';
import { getErrorMessage } from '@app/utils/error';

const getFleetResource = (values: FleetFormValues): Fleet => ({
  apiVersion: 'v1alpha1',
  kind: 'Fleet',
  metadata: {
    name: values.name,
  },
  spec: {
    selector: {
      matchLabels: values.labels.reduce((acc, { key, value }) => {
        acc[key] = value;
        return acc;
      }, {}),
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
        config: values.configTemplates.map((ct) => {
          if (ct.type === 'git') {
            return {
              name: ct.name,
              gitRef: {
                path: ct.path,
                repoURL: ct.repoURL,
                targetRevision: ct.targetRevision,
              },
            } as GitConfigProviderSpec;
          }
          if (ct.type === 'kube') {
            return {
              name: ct.name,
              secretRef: {
                mountPath: ct.mountPath,
                name: ct.secretName,
                namespace: ct.secretNs,
              },
            } as KubernetesSecretProviderSpec;
          }
          return {
            inline: yaml.load(ct.inline),
            name: ct.name,
          } as InlineConfigProviderSpec;
        }),
      },
    },
  },
});

type CreateFleetFormProps = {
  children?: React.ReactNode;
};

const CreateFleetForm: React.FC<CreateFleetFormProps> = ({ children }) => {
  const navigate = useNavigate();
  const { values, setFieldValue, submitForm, isSubmitting } = useFormikContext<FleetFormValues>();
  return (
    <Form>
      <Grid hasGutter span={8}>
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
        <FormGroup label="Labels" isRequired>
          <LabelsField labels={values.labels} setLabels={(newLabels) => setFieldValue('labels', newLabels)} />
        </FormGroup>
        <FormGroup label="Configuration templates" isRequired>
          <ConfigTemplateForm />
        </FormGroup>
      </Grid>
      {children}
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
  const [error, setError] = React.useState<string>();
  return (
    <PageSection variant={PageSectionVariants.light}>
      <Stack hasGutter>
        <StackItem>
          <Breadcrumb>
            <BreadcrumbItem to="/devicemanagement/fleets">Fleets</BreadcrumbItem>
            <BreadcrumbItem to="#" isActive>
              Create fleet
            </BreadcrumbItem>
          </Breadcrumb>
          <Title headingLevel="h1" size="3xl">
            Create fleet
          </Title>
        </StackItem>
        <StackItem>
          <Formik<FleetFormValues>
            initialValues={{
              name: '',
              osImage: '',
              labels: [],
              configTemplates: [
                {
                  type: 'git',
                  name: '',
                  path: '',
                  repoURL: '',
                  targetRevision: '',
                },
              ],
            }}
            onSubmit={async (values) => {
              setError(undefined);
              try {
                await post<Fleet>('fleets', getFleetResource(values));
                navigate('/devicemanagement/fleets');
              } catch (e) {
                setError(getErrorMessage(e));
              }
            }}
          >
            <CreateFleetForm>
              {error && (
                <Alert isInline variant="danger" title="An error occured">
                  {error}
                </Alert>
              )}
            </CreateFleetForm>
          </Formik>
        </StackItem>
      </Stack>
    </PageSection>
  );
};

export default CreateFleet;
