import { allOk, MedplumClient } from '@medplum/core';
import { MedplumProvider } from '@medplum/ui';
import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { SetPasswordPage } from './SetPasswordPage';

function mockFetch(url: string, options: any): Promise<any> {
  let status = 404;
  let result: any;

  if (options.method === 'POST' && url.endsWith('/auth/setpassword')) {
    const { password } = JSON.parse(options.body);
    if (password === 'orange') {
      status = 200;
      result = allOk;
    } else {
      result = {
        resourceType: 'OperationOutcome',
        issue: [{
          expression: ['password'],
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

function setup(url: string) {
  render(
    <MedplumProvider medplum={medplum}>
      <MemoryRouter initialEntries={[url]} initialIndex={0}>
        <Routes>
          <Route path="/setpassword/:id/:secret" element={<SetPasswordPage />} />
        </Routes>
      </MemoryRouter>
    </MedplumProvider>
  );
}

describe('SetPasswordPage', () => {

  test('Renders', () => {
    setup('/setpassword/123/456');
    const input = screen.getByTestId('submit') as HTMLButtonElement;
    expect(input.innerHTML).toBe('Set password');
  });

  test('Submit success', async () => {
    setup('/setpassword/123/456');

    await act(async () => {
      fireEvent.change(screen.getByTestId('password'), { target: { value: 'orange' } });
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('submit'));
    });

    expect(screen.getByTestId('success')).toBeInTheDocument();
  });

  test('Wrong old password', async () => {
    setup('/setpassword/123/456');

    await act(async () => {
      fireEvent.change(screen.getByTestId('password'), { target: { value: 'watermelon' } });
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('submit'));
    });

    expect(screen.getByText('Incorrect password')).toBeInTheDocument();
  });

});
