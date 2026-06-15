import React from 'react';
import styled from 'styled-components';

interface TextProps {
  content?: string;
  fontSize?: string;
  color?: string;
  children?: React.ReactNode;
}

const StyledText = styled.p<TextProps>`
  margin: 0;
  font-size: ${(props) => props.fontSize || '16px'};
  color: ${(props) => props.color || '#4a5568'};
  line-height: 1.6;
`;

export const Text: React.FC<TextProps> = ({ content, children, ...props }) => {
  return <StyledText {...props}>{content || children}</StyledText>;
};

