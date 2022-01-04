import { Identifier } from '@medplum/fhirtypes';
import React, { useState } from 'react';
import { InputRow } from './InputRow';
import { TextField } from './TextField';

export interface IdentifierInputProps {
  name: string;
  defaultValue?: Identifier;
  onChange?: (value: Identifier) => void;
}

export function IdentifierInput(props: IdentifierInputProps): JSX.Element {
  const [value, setValue] = useState(props.defaultValue);

  function setValueWrapper(newValue: Identifier): void {
    setValue(newValue);
    if (props.onChange) {
      props.onChange(newValue);
    }
  }

  return (
    <InputRow>
      <TextField
        placeholder="System"
        defaultValue={value?.system}
        onChange={(e) =>
          setValueWrapper({
            ...value,
            system: (e.currentTarget as HTMLInputElement).value,
          })
        }
      />
      <TextField
        placeholder="Value"
        defaultValue={value?.value}
        onChange={(e) =>
          setValueWrapper({
            ...value,
            value: (e.currentTarget as HTMLInputElement).value,
          })
        }
      />
    </InputRow>
  );
}
