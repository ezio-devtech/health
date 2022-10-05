import { Tabs } from '@mantine/core';
import { Bundle, BundleEntry, OperationOutcome, Resource, ResourceType } from '@medplum/fhirtypes';
import { Document, MedplumLink, ResourceDiff, TitleBar, useMedplum } from '@medplum/react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loading } from '../components/Loading';

export function ResourceVersionPage(): JSX.Element {
  const navigate = useNavigate();
  const { resourceType, id, versionId, tab } = useParams() as {
    resourceType: string;
    id: string;
    versionId: string;
    tab: string;
  };
  const medplum = useMedplum();
  const [loading, setLoading] = useState<boolean>(true);
  const [historyBundle, setHistoryBundle] = useState<Bundle | undefined>();
  const [error, setError] = useState<OperationOutcome | undefined>();

  useEffect(() => {
    setError(undefined);
    setLoading(true);
    medplum
      .readHistory(resourceType as ResourceType, id)
      .then((result) => setHistoryBundle(result))
      .then(() => setLoading(false))
      .catch((reason) => {
        setError(reason);
        setLoading(false);
      });
  }, [medplum, resourceType, id]);

  if (loading) {
    return <Loading />;
  }

  if (!historyBundle) {
    return (
      <Document>
        <h1>Resource not found</h1>
        <MedplumLink to={`/${resourceType}`}>Return to search page</MedplumLink>
      </Document>
    );
  }

  const entries = historyBundle.entry as BundleEntry[];
  const index = entries.findIndex((entry) => entry.resource?.meta?.versionId === versionId);
  if (index === -1) {
    return (
      <Document>
        <h1>Version not found</h1>
        <MedplumLink to={`/${resourceType}/${id}`}>Return to resource</MedplumLink>
      </Document>
    );
  }

  const value = entries[index].resource as Resource;
  const prev = index < entries.length - 1 ? entries[index + 1].resource : undefined;
  const defaultTab = 'diff';
  return (
    <>
      <TitleBar>
        <h1>{`${resourceType} ${id}`}</h1>
      </TitleBar>
      <Tabs
        value={tab || defaultTab}
        onTabChange={(name: string) => navigate(`/${resourceType}/${id}/_history/${versionId}/${name}`)}
      >
        <Tabs.List>
          <Tabs.Tab value="diff">Diff</Tabs.Tab>
          <Tabs.Tab value="raw">Raw</Tabs.Tab>
        </Tabs.List>

        <Document>
          {error && <pre data-testid="error">{JSON.stringify(error, undefined, 2)}</pre>}
          <Tabs.Panel value="diff">
            {prev ? (
              <>
                <ul>
                  <li>Current: {value.meta?.versionId}</li>
                  <li>
                    Previous:{' '}
                    <MedplumLink to={`/${resourceType}/${id}/_history/${prev.meta?.versionId}`}>
                      {prev.meta?.versionId}
                    </MedplumLink>
                  </li>
                </ul>
                <ResourceDiff original={prev} revised={value} />
              </>
            ) : (
              <>
                <ul>
                  <li>Current: {value.meta?.versionId}</li>
                  <li>Previous: (none)</li>
                </ul>
                <pre>{JSON.stringify(value, undefined, 2)}</pre>
              </>
            )}
          </Tabs.Panel>

          <Tabs.Panel value="raw">
            <pre>{JSON.stringify(value, undefined, 2)}</pre>
          </Tabs.Panel>
        </Document>
      </Tabs>
    </>
  );
}
