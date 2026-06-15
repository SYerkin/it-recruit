import React from 'react';
import { Container } from '@shared/ui/Container';
import { Header } from '@shared/ui/Header';
import { Footer } from '@shared/ui/Footer';
import { Content } from '@shared/ui/Content';
import { Card } from '@shared/ui/Card';
import { Text } from '@shared/ui/Text';

export interface LayoutNode {
  type: string;
  props?: Record<string, any>;
  children?: LayoutNode[];
}

interface LayoutRendererProps {
  config: LayoutNode;
}

const componentMap: Record<string, React.ComponentType<any>> = {
  Container,
  Header,
  Footer,
  Content,
  Card,
  Text,
};

export const LayoutRenderer: React.FC<LayoutRendererProps> = ({ config }) => {
  const Component = componentMap[config.type];

  if (!Component) {
    console.warn(`Unknown component type: ${config.type}`);
    return null;
  }

  const children = config.children?.map((child, index) => (
    <LayoutRenderer key={index} config={child} />
  ));

  return <Component {...(config.props || {})}>{children}</Component>;
};

