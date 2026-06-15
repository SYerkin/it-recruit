import React from 'react';
import styled from 'styled-components';

interface GlassPanelProps {
  children: React.ReactNode;
  padding?: string;
  borderRadius?: string;
  blur?: string;
  backgroundColor?: string;
  borderColor?: string;
  shadow?: string;
}

const StyledGlassPanel = styled.div<GlassPanelProps>`
  background: ${({ backgroundColor }) => backgroundColor || 'var(--color-bg-glass)'};
  backdrop-filter: blur(${({ blur }) => blur || '20px'});
  -webkit-backdrop-filter: blur(${({ blur }) => blur || '20px'});
  border: 1px solid ${({ borderColor }) => borderColor || 'var(--color-bg-glass-border)'};
  border-radius: ${({ borderRadius }) => borderRadius || 'var(--radius-xl)'};
  padding: ${({ padding }) => padding || 'var(--spacing-xl)'};
  box-shadow: ${({ shadow }) => shadow || 'var(--shadow-soft)'};
  position: relative;
  overflow: hidden;

  /* Subtle gradient overlay for depth */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.8),
      transparent
    );
    pointer-events: none;
  }
`;

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  ...props
}) => {
  return <StyledGlassPanel {...props}>{children}</StyledGlassPanel>;
};


