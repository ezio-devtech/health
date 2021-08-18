import { allOk, MedplumClient } from '@medplum/core';
import { MedplumProvider } from '@medplum/ui';
import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { ChangePasswordPage } from './ChangePasswordPage';

const mockRouter = {
  push: (path: string, state: any) => {
    console.log('Navigate to: ' + path + ' (state=' + JSON.stringify(state) + ')');
  },
  listen: () => (() => undefined) // Return mock "unlisten" handler
}

function mockFetch(url: string, options: any): Promise<any> {
  let status = 404;
  let result: any;

  if (options.method === 'POST' && url.endsWith('/auth/changepassword')) {
    const { oldPassword } = JSON.parse(options.body);
    if (oldPassword === 'orange') {
      status = 200;
      result = allOk;
    } else {
      result = {
        resourceType: 'OperationOutcome',
        issue: [{
          expression: ['oldPassword'],
          details: {
            text: 'Incorrect password'
          }
        }]
      };
    }
  }

  const response: any = {
    request: {
      url,
      options
    },
    status,
    ...result
  };

  return Promise.resolve({
    json: () => Promise.resolve(response)
  });
}

const medplum = new MedplumClient({
  baseUrl: 'https://example.com/',
  clientId: 'my-client-id',
  fetch: mockFetch
});

const setup = () => {
  return render(
    <MedplumProvider medplum={medplum} router={mockRouter}>
      <ChangePasswordPage />
    </MedplumProvider>
  );
};

describe('ChangePasswordPage', () => {

  test('Renders', () => {
    const utils = setup();
    const input = utils.getByTestId('submit') as HTMLButtonElement;
    expect(input.innerHTML).toBe('Change password');
  });

  test('Submit success', async () => {
    setup();

    await act(async () => {
      fireEvent.change(screen.getByTestId('oldPassword'), { target: { value: 'orange' } });
      fireEvent.change(screen.getByTestId('newPassword'), { target: { value: 'purple' } });
      fireEvent.change(screen.getByTestId('confirmPassword'), { target: { value: 'purple' } });
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('submit'));
    });

    expect(screen.getByTestId('success')).not.toBeUndefined();
  });

  test('Wrong old password', async () => {
    setup();

    await act(async () => {
      fireEvent.change(screen.getByTestId('oldPassword'), { target: { value: 'watermelon' } });
      fireEvent.change(screen.getByTestId('newPassword'), { target: { value: 'purple' } });
      fireEvent.change(screen.getByTestId('confirmPassword'), { target: { value: 'purple' } });
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('submit'));
    });

    expect(screen.getByText('Incorrect password')).not.toBeUndefined();
  });

});
