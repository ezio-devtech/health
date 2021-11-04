import { MedplumClient, Patient } from '@medplum/core';
import { render, waitFor } from '@testing-library/react';
import { randomUUID } from 'crypto';
import React from 'react';
import { MedplumProvider } from './MedplumProvider';
import { ResourceName, ResourceNameProps } from './ResourceName';

const patient: Patient = {
  resourceType: 'Patient',
  id: randomUUID(),
  name: [{
    given: ['Alice'],
    family: 'Smith'
  }]
};

function mockFetch(url: string, options: any): Promise<any> {
  const response: any = {
    request: {
      url,
      options
    },
    ...patient
  };

  return Promise.resolve({
    blob: () => Promise.resolve(response),
    json: () => Promise.resolve(response)
  });
}

const medplum = new MedplumClient({
  baseUrl: 'https://example.com/',
  clientId: 'my-client-id',
  fetch: mockFetch
});

describe('ResourceName', () => {

  beforeAll(async () => {
    await medplum.signIn('admin@medplum.com', 'admin', 'practitioner', 'openid');
  });

  const setup = (args: ResourceNameProps) => {
    return render(
      <MedplumProvider medplum={medplum}>
        <ResourceName {...args} />
      </MedplumProvider>
    );
  };

  test('Renders system', () => {
    const utils = setup({ value: { reference: 'system' } });
    expect(utils.getByText('System')).not.toBeUndefined();
  });

  test('Renders resource directly', async () => {
    const utils = setup({
      value: patient
    });

    await waitFor(() => utils.getByText('Alice Smith'));

    expect(utils.getByText('Alice Smith')).not.toBeUndefined();
  });

  test('Renders resource directly as link', async () => {
    const utils = setup({
      value: patient,
      link: true
    });

    await waitFor(() => utils.getByText('Alice Smith'));

    expect(utils.getByText('Alice Smith')).not.toBeUndefined();
  });

  test('Renders after loading the resource', async () => {
    const utils = setup({
      value: {
        reference: 'Patient/' + patient.id
      }
    });

    await waitFor(() => utils.getByText('Alice Smith'));

    expect(utils.getByText('Alice Smith')).not.toBeUndefined();
  });

});
