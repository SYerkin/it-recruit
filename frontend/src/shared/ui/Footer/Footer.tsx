import React from 'react';
import styled from 'styled-components';

interface FooterProps {
  text?: string;
  height?: string;
  children?: React.ReactNode;
}

const StyledFooter = styled.footer<FooterProps>`
  height: ${(props) => props.height || '60px'};
  background: #2d3748;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: auto;
`;

const FooterText = styled.p`
  margin: 0;
  font-size: 14px;
`;

export const Footer: React.FC<FooterProps> = ({ text, children, ...props }) => {
  return (
    <StyledFooter {...props}>
      {text && <FooterText>{text}</FooterText>}
      {children}
    </StyledFooter>
  );
};

