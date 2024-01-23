import React from 'react';
import { fetchData } from '@app/utils/commonFunctions';
import { useAuth } from 'react-oidc-context';
import {
  Card,
  CardBody,
  Chip,
  ChipGroup,
  Flex,
  FlexItem,
  MenuToggle,
  MenuToggleElement,
  Divider,
  SearchInput,
  Dropdown,
  DropdownList,
  DropdownItem,
  PageSection,
  Title,
  CardHeader,
} from '@patternfly/react-core';
import { DevicesDonuts } from './devicesDonuts';
import { DevicesGrid } from './devicesGrid';
import { Filter } from './filter';
import { Legend } from './legend';
const Overview: React.FunctionComponent = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState(null);
  const auth = useAuth();

  function getDevices() {
    if (auth.user?.access_token) {
      fetchData("devices", auth.user?.access_token).then((data) => {
        /*
        data = {"apiVersion":"v1alpha1","items":[{"apiVersion":"v1alpha1","kind":"Device","metadata":{"creationTimestamp":"2023-12-10T22:50:53Z","name":"8fef85736b9b2462e8f4f258030544429305ab0fd7ae5591f3afe467e3ff081f"},"spec":{},"status":{"systemInfo":{"architecture":"amd64","bootID":"c7dd6c0d-5d98-49c1-8b56-ce8d09880c81","machineID":"5ef22615044c4074b15af426073394b8","operatingSystem":"linux"}}},{"apiVersion":"v1alpha1","kind":"Device","metadata":{"creationTimestamp":"2023-12-10T22:51:05Z","name":"686d7f89b3767d121fb2b1c5c6c2fbd9da86aefd70591cbed3e00af98f4391cd"},"spec":{},"status":{"systemInfo":{"architecture":"amd64","bootID":"c7dd6c0d-5d98-49c1-8b56-ce8d09880c81","machineID":"5ef22615044c4074b15af426073394b8","operatingSystem":"linux"}}},{"apiVersion":"v1alpha1","kind":"Device","metadata":{"creationTimestamp":"2023-12-10T22:51:07Z","name":"87f0bfee4d9be24d3f5b9e004c49ad58a6ba06e647e86748092134fcfec67d76"},"spec":{},"status":{"systemInfo":{"architecture":"amd64","bootID":"c7dd6c0d-5d98-49c1-8b56-ce8d09880c81","machineID":"5ef22615044c4074b15af426073394b8","operatingSystem":"linux"}}},{"apiVersion":"v1alpha1","kind":"Device","metadata":{"creationTimestamp":"2023-12-10T22:51:14Z","name":"700925fb021b534018cd8749b2656cae7eba6d87aa6dda1cec093a055a38e16c"},"spec":{},"status":{"systemInfo":{"architecture":"amd64","bootID":"c7dd6c0d-5d98-49c1-8b56-ce8d09880c81","machineID":"5ef22615044c4074b15af426073394b8","operatingSystem":"linux"}}},{"apiVersion":"v1alpha1","kind":"Device","metadata":{"creationTimestamp":"2023-12-10T22:51:22Z","name":"c18d0582c13f3890f5b2de6733feede3665e8f7570539a74a63b784b91e9483f"},"spec":{},"status":{"systemInfo":{"architecture":"amd64","bootID":"c7dd6c0d-5d98-49c1-8b56-ce8d09880c81","machineID":"5ef22615044c4074b15af426073394b8","operatingSystem":"linux"}}},{"apiVersion":"v1alpha1","kind":"Device","metadata":{"creationTimestamp":"2023-12-10T22:51:26Z","name":"5571d36e302d014c8cef703f2d070a529efe6d06c98633b0779794b7a1e7b7de"},"spec":{},"status":{"systemInfo":{"architecture":"amd64","bootID":"c7dd6c0d-5d98-49c1-8b56-ce8d09880c81","machineID":"5ef22615044c4074b15af426073394b8","operatingSystem":"linux"}}},{"apiVersion":"v1alpha1","kind":"Device","metadata":{"creationTimestamp":"2023-12-10T22:51:42Z","name":"0e7c323d0390a68450d456f6df9aa83fc2ed70ba3d0083ed9d9238d03769ed47"},"spec":{},"status":{"systemInfo":{"architecture":"amd64","bootID":"c7dd6c0d-5d98-49c1-8b56-ce8d09880c81","machineID":"5ef22615044c4074b15af426073394b8","operatingSystem":"linux"}}},{"apiVersion":"v1alpha1","kind":"Device","metadata":{"creationTimestamp":"2023-12-10T22:51:43Z","name":"c03f5b14be069e3268bec6355b78aa63831f3ccda806624f24558ea0ba87de9e"},"spec":{},"status":{"systemInfo":{"architecture":"amd64","bootID":"c7dd6c0d-5d98-49c1-8b56-ce8d09880c81","machineID":"5ef22615044c4074b15af426073394b8","operatingSystem":"linux"}}},{"apiVersion":"v1alpha1","kind":"Device","metadata":{"creationTimestamp":"2023-12-10T22:51:44Z","name":"2e2086871c0352bb3d99edb9968ae4c2342bc2405d67c16e5fd0fba4d8a33a28"},"spec":{},"status":{"systemInfo":{"architecture":"amd64","bootID":"c7dd6c0d-5d98-49c1-8b56-ce8d09880c81","machineID":"5ef22615044c4074b15af426073394b8","operatingSystem":"linux"}}},{"apiVersion":"v1alpha1","kind":"Device","metadata":{"creationTimestamp":"2023-12-10T22:51:44Z","name":"3c5bb8b9d6f0281e036e41216c1fc7e4039ad2cd1abafb35fe196f186a75918c"},"spec":{},"status":{"systemInfo":{"architecture":"amd64","bootID":"c7dd6c0d-5d98-49c1-8b56-ce8d09880c81","machineID":"5ef22615044c4074b15af426073394b8","operatingSystem":"linux"}}}],"kind":"DeviceList","metadata":{}};
    
        */
          // actualizar el objeto DevicesGrid con data
          console.log("setData");
          setData(data);
          

          setIsLoading(false);
      });
    }
  }
  React.useEffect(() => {
    console.log("useEffect getDevices")
    getDevices();
    const interval = setInterval(() => {
      console.log("interval getDevices")
      getDevices();
    }, 20000);
    return () => clearInterval(interval);
  }, [auth]);

  
  return (
    <PageSection>
      <Title headingLevel="h1" size="lg" style={{ marginBottom: '15px' }}>Overview</Title>

      <Card isCompact={true} isFlat={true} >
        <CardHeader>
        <table>
        <tbody>
          <tr>
            <td>
              <Filter />
            </td>
          </tr>
        </tbody>
      </table>
        </CardHeader>
        <CardBody>
            <Flex alignItems={{ default: "alignItemsCenter" }} justifyContent={{ default: 'justifyContentSpaceAround' }} >
            <FlexItem>
              <DevicesGrid data={data}></DevicesGrid>
            </FlexItem>
            <Divider
              orientation={{
                default: 'vertical'
              }}
              inset={{ default: 'insetSm' }}
            />
            <FlexItem>
              <DevicesDonuts></DevicesDonuts>
            </FlexItem>
          </Flex>
          <br></br><br></br>
              <Legend />

        </CardBody>
      </Card>
      
    </PageSection>
  )
};

export { Overview };

