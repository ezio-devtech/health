import { Avatar, Group, Stack, Text, UnstyledButton } from '@mantine/core';
import { ProjectMembership } from '@medplum/fhirtypes';
import React from 'react';
import { Logo } from '../Logo';
import { useMedplum } from '../MedplumProvider';

export interface ChooseProfileFormProps {
  login: string;
  memberships: ProjectMembership[];
  handleAuthResponse: (response: any) => void;
}

export function ChooseProfileForm(props: ChooseProfileFormProps): JSX.Element {
  const medplum = useMedplum();
  return (
    <Stack>
      <div className="medplum-center">
        <Logo size={32} />
        <Text size="lg" weight={500}>
          Choose profile
        </Text>
      </div>
      {props.memberships.map((membership: ProjectMembership) => (
        <UnstyledButton
          key={membership.id}
          onClick={() => {
            medplum
              .post('auth/profile', {
                login: props.login,
                profile: membership.id,
              })
              .then(props.handleAuthResponse)
              .catch(console.log);
          }}
        >
          <Group>
            <Avatar radius="xl" />
            <div style={{ flex: 1 }}>
              <Text size="sm" weight={500}>
                {membership.profile?.display}
              </Text>
              <Text color="dimmed" size="xs">
                {membership.project?.display}
              </Text>
            </div>
          </Group>
        </UnstyledButton>
      ))}
    </Stack>
  );
}
