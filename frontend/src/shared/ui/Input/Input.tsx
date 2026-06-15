import React from 'react';
import styled from 'styled-components';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'fullWidth'> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const InputWrapper = styled.div<{ $fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
`;

const Label = styled.label`
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-primary);
  letter-spacing: -0.01em;
`;

const StyledInput = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: 14px 18px;
  font-size: 17px;
  font-family: inherit;
  background: var(--color-bg-secondary);
  border: 1px solid ${({ $hasError }) => ($hasError ? '#FF3B30' : 'var(--color-system-gray-4)')};
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  transition: all var(--transition-base);

  &::placeholder {
    color: var(--color-text-tertiary);
  }

  &:focus {
    outline: none;
    border-color: var(--color-system-blue);
    box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: var(--color-system-gray-6);
  }
`;

const ErrorMessage = styled.span`
  font-size: 13px;
  color: #FF3B30;
  font-weight: 500;
`;

export const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth,
  ...props
}) => {
  return (
    <InputWrapper $fullWidth={fullWidth}>
      {label && <Label>{label}</Label>}
      <StyledInput $hasError={!!error} {...props} />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </InputWrapper>
  );
};


