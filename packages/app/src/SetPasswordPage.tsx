import { Button, Center, PasswordInput, Title } from '@mantine/core';
import { badRequest } from '@medplum/core';
import { OperationOutcome } from '@medplum/fhirtypes';
import { Document, Form, getErrorsForInput, Logo, MedplumLink, useMedplum } from '@medplum/react';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

export function SetPasswordPage(): JSX.Element {
  const { id, secret } = useParams() as { id: string; secret: string };
  const medplum = useMedplum();
  const [outcome, setOutcome] = useState<OperationOutcome>();
  const [success, setSuccess] = useState(false);

  return (
    <Document width={450}>
      <Form
        style={{ maxWidth: 400 }}
        onSubmit={(formData: Record<string, string>) => {
          if (formData.password !== formData.confirmPassword) {
            setOutcome(badRequest('Passwords do not match', 'confirmPassword'));
            return;
          }
          setOutcome(undefined);
          const body = {
            id,
            secret,
            password: formData.password,
          };
          medplum
            .post('auth/setpassword', body)
            .then(() => setSuccess(true))
            .catch(setOutcome);
        }}
      >
        <Center sx={{ flexDirection: 'column' }}>
          <Logo size={32} />
          <Title>Set password</Title>
        </Center>
        {!success && (
          <>
            <PasswordInput
              name="password"
              label="New password"
              required={true}
              error={getErrorsForInput(outcome, 'password')}
            />
            <PasswordInput
              name="confirmPassword"
              label="Confirm new password"
              required={true}
              error={getErrorsForInput(outcome, 'confirmPassword')}
            />
            <div className="medplum-signin-buttons">
              <div></div>
              <div>
                <Button type="submit">Set password</Button>
              </div>
            </div>
          </>
        )}
        {success && (
          <div data-testid="success">
            Password set. You can now&nbsp;<MedplumLink to="/signin">sign in</MedplumLink>.
          </div>
        )}
      </Form>
    </Document>
  );
}
