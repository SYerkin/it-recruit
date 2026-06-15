import React from 'react';
import styled from 'styled-components';

interface CardProps {
  children: React.ReactNode;
  padding?: string;
  borderRadius?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

const StyledCard = styled.div<CardProps>`
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-system-gray-5);
  border-radius: ${({ borderRadius }) => borderRadius || 'var(--radius-lg)'};
  padding: ${({ padding }) => padding || 'var(--spacing-lg)'};
  box-shadow: var(--shadow-soft);
  transition: all var(--transition-base);
  cursor: ${({ onClick, hoverable }) => (onClick || hoverable ? 'pointer' : 'default')};

  ${({ hoverable, onClick }) =>
    (hoverable || onClick) &&
    `
    &:hover {
      transform: scale(1.02);
      box-shadow: var(--shadow-medium);
      border-color: var(--color-system-gray-4);
    }

    &:active {
      transform: scale(0.98);
    }
  `}
`;

export const Card: React.FC<CardProps> = ({
  children,
  padding,
  borderRadius,
  hoverable,
  onClick,
}) => {
  return (
    <StyledCard
      padding={padding}
      borderRadius={borderRadius}
      hoverable={hoverable}
      onClick={onClick}
    >
      {children}
    </StyledCard>
  );
};
