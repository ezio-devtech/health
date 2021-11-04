import { Bundle, Communication, Media, MedplumClient, ServiceRequest } from '@medplum/core';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { randomUUID } from 'crypto';
import React from 'react';
import { MedplumProvider } from './MedplumProvider';
import { ServiceRequestTimeline, ServiceRequestTimelineProps } from './ServiceRequestTimeline';

const serviceRequestId = randomUUID();

const serviceRequest: ServiceRequest = {
  resourceType: 'ServiceRequest',
  id: serviceRequestId
};

const communications: Bundle = {
  resourceType: 'Bundle',
  entry: [
    {
      resource: {
        resourceType: 'Communication',
        id: randomUUID(),
        meta: {
          lastUpdated: new Date().toISOString(),
          author: {
            reference: 'Practitioner/123'
          }
        },
        payload: [{
          contentString: 'Hello world'
        }]
      }
    }
  ]
};

const media: Bundle = {
  resourceType: 'Bundle',
  entry: [
    {
      resource: {
        resourceType: 'Media',
        id: randomUUID(),
        meta: {
          lastUpdated: new Date().toISOString(),
          author: {
            reference: 'Practitioner/123'
          }
        },
        content: {
          contentType: 'text/plain',
          url: 'https://example.com/test.txt'
        }
      }
    }
  ]
};

const newComment: Communication = {
  resourceType: 'Communication',
  id: randomUUID(),
  payload: [{
    contentString: 'Test comment'
  }]
};

const newMedia: Media = {
  resourceType: 'Media',
  id: randomUUID(),
  content: {
    contentType: 'text/plain',
    url: 'https://example.com/test2.txt'
  }
};

function mockFetch(url: string, options: any): Promise<any> {
  const method = options.method ?? 'GET';
  let result: any;

  if (method === 'POST' && url.endsWith('/auth/login')) {
    result = {
      profile: {
        resourceType: 'Practitioner',
        id: '123'
      }
    };
  } else if (method === 'GET' && url.includes('/fhir/R4/ServiceRequest/' + serviceRequestId)) {
    result = serviceRequest;
  } else if (method === 'GET' && url.includes('/fhir/R4/Communication?')) {
    result = communications;
  } else if (method === 'GET' && url.includes('/fhir/R4/Media?')) {
    result = media;
  } else if (method === 'POST' && url.includes('/fhir/R4/Communication')) {
    result = newComment;
  } else if (method === 'POST' && url.includes('/fhir/R4/Media')) {
    result = newMedia;
  }

  const response: any = {
    request: {
      url,
      options
    },
    ...result
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

describe('ServiceRequestTimeline', () => {

  beforeAll(async () => {
    await medplum.signIn('admin@medplum.com', 'admin', 'practitioner', 'openid');
  });

  const setup = (args: ServiceRequestTimelineProps) => {
    return render(
      <MedplumProvider medplum={medplum}>
        <ServiceRequestTimeline {...args} />
      </MedplumProvider>
    );
  };

  test('Renders reference', async () => {
    setup({ serviceRequest: { reference: 'ServiceRequest/' + serviceRequestId } });

    await act(async () => {
      await waitFor(() => screen.getAllByTestId('timeline-item'));
    });

    const items = screen.getAllByTestId('timeline-item');
    expect(items).not.toBeUndefined();
    expect(items.length).toEqual(2);
  });

  test('Renders resource', async () => {
    setup({ serviceRequest });

    await act(async () => {
      await waitFor(() => screen.getAllByTestId('timeline-item'));
    });

    const items = screen.getAllByTestId('timeline-item');
    expect(items).not.toBeUndefined();
    expect(items.length).toEqual(2);
  });

  test('Create comment', async () => {
    setup({ serviceRequest });

    // Wait for initial load
    await act(async () => {
      await waitFor(() => screen.getAllByTestId('timeline-item'));
    });

    // Enter the comment text
    await act(async () => {
      fireEvent.change(screen.getByTestId('timeline-input'), { target: { value: 'Test comment' } });
    });

    // Submit the form
    await act(async () => {
      fireEvent.submit(screen.getByTestId('timeline-form'), { target: { text: 'Test comment' } });
    });

    // Wait for new comment
    await act(async () => {
      await waitFor(() => screen.getAllByTestId('timeline-item'));
    });

    const items = screen.getAllByTestId('timeline-item');
    expect(items).not.toBeUndefined();
    expect(items.length).toEqual(3);
  });

  test('Upload media', async () => {
    setup({ serviceRequest });

    // Wait for initial load
    await act(async () => {
      await waitFor(() => screen.getAllByTestId('timeline-item'));
    });

    // Upload the file
    await act(async () => {
      const files = [
        new File(['hello'], 'hello.txt', { type: 'text/plain' })
      ];
      fireEvent.change(screen.getByTestId('upload-file-input'), { target: { files } });
    });

    // Wait for new comment
    await act(async () => {
      await waitFor(() => screen.getAllByTestId('timeline-item'));
    });

    const items = screen.getAllByTestId('timeline-item');
    expect(items).not.toBeUndefined();
    expect(items.length).toEqual(3);
  });

});
