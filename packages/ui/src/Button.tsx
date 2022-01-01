import React from 'react';
import './Button.css';

export interface ButtonProps {
  type?: 'button' | 'submit';
  primary?: boolean;
  danger?: boolean;
  borderless?: boolean;
  size?: 'small' | 'medium' | 'large';
  onClick?: (e: React.MouseEvent) => void;
  children: React.ReactNode;
  testid?: string;
}

export function Button(props: ButtonProps): JSX.Element {
  const className =
    'btn' +
    (props.primary || props.type === 'submit' ? ' btn-primary' : '') +
    (props.danger ? ' btn-danger' : '') +
    (props.borderless ? ' btn-borderless' : '') +
    (props.size ? ' btn-' + props.size : '');
  return (
    <button type={props.type || 'button'} className={className} onClick={props.onClick} data-testid={props.testid}>
      {props.children}
    </button>
  );
}
