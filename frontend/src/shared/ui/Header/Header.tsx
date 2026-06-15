import React from 'react';
import styled from 'styled-components';

interface HeaderProps {
  title?: string;
  height?: string;
  children?: React.ReactNode;
}

const StyledHeader = styled.header<HeaderProps>`
  height: ${(props) => props.height || '60px'};
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 600;
`;

export const Header: React.FC<HeaderProps> = ({ title, children, ...props }) => {
  return (
    <StyledHeader {...props}>
      {title && <Title>{title}</Title>}
      {children}
    </StyledHeader>
  );
};

