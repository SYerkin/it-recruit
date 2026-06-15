import React from 'react';
import styled, { css } from 'styled-components';

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'variant' | 'size'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

const StyledButton = styled.button<{ variant?: string; size?: string; $fullWidth?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  font-weight: 600;
  font-size: 17px;
  letter-spacing: -0.01em;
  border-radius: var(--radius-pill);
  transition: all var(--transition-base);
  cursor: pointer;
  outline: none;
  position: relative;
  overflow: hidden;

  /* Size variants */
  ${({ size }) => {
    switch (size) {
      case 'sm':
        return css`
          padding: 8px 16px;
          font-size: 15px;
        `;
      case 'lg':
        return css`
          padding: 16px 32px;
          font-size: 19px;
        `;
      default:
        return css`
          padding: 12px 24px;
          font-size: 17px;
        `;
    }
  }}

  /* Width */
  ${({ $fullWidth }) =>
    $fullWidth &&
    css`
      width: 100%;
    `}

  /* Variant styles */
  ${({ variant }) => {
    switch (variant) {
      case 'primary':
        return css`
          background: var(--color-system-blue);
          color: var(--color-text-white);
          box-shadow: none;

          &:hover:not(:disabled) {
            transform: scale(1.02);
            box-shadow: 0 4px 16px rgba(0, 122, 255, 0.3);
          }

          &:active:not(:disabled) {
            transform: scale(0.98);
          }

          &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
        `;

      case 'secondary':
        return css`
          background: var(--color-bg-secondary);
          color: var(--color-text-primary);
          border: 1px solid var(--color-system-gray-4);

          &:hover:not(:disabled) {
            transform: scale(1.02);
            background: var(--color-system-gray-6);
            border-color: var(--color-system-gray-3);
          }

          &:active:not(:disabled) {
            transform: scale(0.98);
          }

          &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
        `;

      case 'ghost':
        return css`
          background: transparent;
          color: var(--color-text-primary);

          &:hover:not(:disabled) {
            background: rgba(0, 0, 0, 0.04);
            transform: scale(1.02);
          }

          &:active:not(:disabled) {
            transform: scale(0.98);
          }

          &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
        `;

      case 'danger':
        return css`
          background: #FF3B30;
          color: var(--color-text-white);

          &:hover:not(:disabled) {
            transform: scale(1.02);
            box-shadow: 0 4px 16px rgba(255, 59, 48, 0.3);
          }

          &:active:not(:disabled) {
            transform: scale(0.98);
          }

          &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
        `;

      default:
        return css`
          background: var(--color-system-blue);
          color: var(--color-text-white);
        `;
    }
  }}
`;

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  ...props
}) => {
  return (
    <StyledButton variant={variant} size={size} $fullWidth={fullWidth} {...props}>
      {children}
    </StyledButton>
  );
};

