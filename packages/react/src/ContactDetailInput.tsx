import { ContactDetail, ContactPoint } from '@medplum/fhirtypes';
import React, { useRef, useState } from 'react';
import { ContactPointInput } from './ContactPointInput';
import { Input } from './Input';
import { InputRow } from './InputRow';

export interface ContactDetailInputProps {
  name: string;
  defaultValue?: ContactDetail;
  onChange?: (value: ContactDetail) => void;
}

export function ContactDetailInput(props: ContactDetailInputProps): JSX.Element {
  const [contactPoint, setContactDetail] = useState(props.defaultValue);

  const ref = useRef<ContactDetail>();
  ref.current = contactPoint;

  function setContactDetailWrapper(newValue: ContactDetail): void {
    setContactDetail(newValue);
    if (props.onChange) {
      props.onChange(newValue);
    }
  }

  function setName(name: string): void {
    const newValue: ContactDetail = { ...ref.current, name };
    if (!name) {
      delete newValue.name;
    }
    setContactDetailWrapper(newValue);
  }

  function setTelecom(telecom: ContactPoint | undefined): void {
    const newValue: ContactDetail = { ...ref.current, telecom: telecom && [telecom] };
    if (!telecom) {
      delete newValue.telecom;
    }
    setContactDetailWrapper(newValue);
  }

  return (
    <InputRow>
      <Input
        name={props.name + '-name'}
        placeholder="Name"
        style={{ width: 180 }}
        defaultValue={contactPoint?.name}
        onChange={setName}
      />
      <ContactPointInput
        name={props.name + '-telecom'}
        defaultValue={contactPoint?.telecom?.[0]}
        onChange={setTelecom}
      />
    </InputRow>
  );
}
