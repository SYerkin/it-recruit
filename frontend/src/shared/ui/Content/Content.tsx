import React from 'react';
import styled from 'styled-components';

interface ContentProps {
  minHeight?: string;
  padding?: string;
  children?: React.ReactNode;
}

const StyledContent = styled.main<ContentProps>`
  min-height: ${(props) => props.minHeight || 'auto'};
  padding: ${(props) => props.padding || '0'};
  flex: 1;
`;

export const Content: React.FC<ContentProps> = ({ children, ...props }) => {
  return <StyledContent {...props}>{children}</StyledContent>;
};

