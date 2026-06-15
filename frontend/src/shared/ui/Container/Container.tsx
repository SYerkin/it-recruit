import React from 'react';
import styled from 'styled-components';

interface ContainerProps {
  padding?: string;
  margin?: string;
  maxWidth?: string;
  children?: React.ReactNode;
}

const StyledContainer = styled.div<ContainerProps>`
  padding: ${(props) => props.padding || '0'};
  margin: ${(props) => props.margin || '0'};
  max-width: ${(props) => props.maxWidth || '100%'};
  width: 100%;
  box-sizing: border-box;
`;

export const Container: React.FC<ContainerProps> = ({ children, ...props }) => {
  return <StyledContainer {...props}>{children}</StyledContainer>;
};

