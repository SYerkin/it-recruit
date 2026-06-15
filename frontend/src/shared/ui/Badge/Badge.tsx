import React from 'react';
import styled from 'styled-components';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
}

const StyledBadge = styled.span<BadgeProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${({ size }) => (size === 'sm' ? '4px 10px' : '6px 12px')};
  font-size: ${({ size }) => (size === 'sm' ? '13px' : '15px')};
  font-weight: 600;
  border-radius: var(--radius-pill);
  letter-spacing: -0.01em;
  white-space: nowrap;

  ${({ variant }) => {
    switch (variant) {
      case 'primary':
        return `
          background: rgba(0, 122, 255, 0.1);
          color: var(--color-system-blue);
        `;
      case 'success':
        return `
          background: rgba(52, 199, 89, 0.1);
          color: #34C759;
        `;
      case 'warning':
        return `
          background: rgba(255, 204, 0, 0.1);
          color: #FFCC00;
        `;
      case 'danger':
        return `
          background: rgba(255, 59, 48, 0.1);
          color: #FF3B30;
        `;
      default:
        return `
          background: var(--color-system-gray-6);
          color: var(--color-text-primary);
        `;
    }
  }}
`;

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
}) => {
  return (
    <StyledBadge variant={variant} size={size}>
      {children}
    </StyledBadge>
  );
};



