import { render, screen } from '@testing-library/react';
import React from 'react';
import { HumanNameDisplay } from './HumanNameDisplay';

describe('HumanNameDisplay', () => {

  test('Renders', () => {
    render(
      <HumanNameDisplay
        value={{
          given: ['Alice'],
          family: 'Smith',
          use: 'official'
        }}
      />
    );

    expect(screen.getByText('Alice Smith')).not.toBeUndefined();
  });

  test('Renders with options', () => {
    render(
      <HumanNameDisplay
        value={{
          given: ['Alice'],
          family: 'Smith',
          use: 'official'
        }}
        options={{ all: true }}
      />
    );

    expect(screen.getByText('Alice Smith [official]')).not.toBeUndefined();
  });

  test('Handles null name', () => {
    expect(HumanNameDisplay({})).toBeNull();
  });

});
