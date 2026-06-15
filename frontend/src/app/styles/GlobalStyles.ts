import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  :root {
    /* Apple System Colors */
    --color-system-blue: #007AFF;
    --color-system-gray-1: #8E8E93;
    --color-system-gray-2: #AEAEB2;
    --color-system-gray-3: #C7C7CC;
    --color-system-gray-4: #D1D1D6;
    --color-system-gray-5: #E5E5EA;
    --color-system-gray-6: #F2F2F7;
    
    /* Text Colors */
    --color-text-primary: #1D1D1F;
    --color-text-secondary: rgba(29, 29, 31, 0.6);
    --color-text-tertiary: rgba(29, 29, 31, 0.4);
    --color-text-white: #FFFFFF;
    
    /* Background Colors */
    --color-bg-primary: #F5F5F7;
    --color-bg-secondary: #FFFFFF;
    --color-bg-glass: rgba(255, 255, 255, 0.7);
    --color-bg-glass-border: rgba(255, 255, 255, 0.5);
    
    /* Shadows */
    --shadow-soft: 0 8px 32px rgba(0, 0, 0, 0.04);
    --shadow-medium: 0 12px 48px rgba(0, 0, 0, 0.08);
    --shadow-strong: 0 20px 64px rgba(0, 0, 0, 0.12);
    
    /* Spacing */
    --spacing-xs: 4px;
    --spacing-sm: 8px;
    --spacing-md: 16px;
    --spacing-lg: 24px;
    --spacing-xl: 32px;
    --spacing-2xl: 48px;
    --spacing-3xl: 64px;
    --spacing-4xl: 96px;
    
    /* Border Radius */
    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 18px;
    --radius-xl: 24px;
    --radius-pill: 999px;
    
    /* Transitions */
    --transition-fast: 0.15s cubic-bezier(0.4, 0, 0.2, 1);
    --transition-base: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    --transition-slow: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'SF Pro Text', 'Helvetica Neue', sans-serif;
    font-size: 17px;
    line-height: 1.6;
    color: var(--color-text-primary);
    background-color: var(--color-bg-primary);
    overflow-x: hidden;
  }

  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.2;
    color: var(--color-text-primary);
  }

  h1 {
    font-size: 48px;
    font-weight: 800;
    letter-spacing: -0.03em;
  }

  h2 {
    font-size: 36px;
    font-weight: 700;
  }

  h3 {
    font-size: 28px;
    font-weight: 600;
  }

  h4 {
    font-size: 22px;
    font-weight: 600;
  }

  p {
    line-height: 1.6;
    color: var(--color-text-primary);
  }

  a {
    color: var(--color-system-blue);
    text-decoration: none;
    transition: opacity var(--transition-fast);
    
    &:hover {
      opacity: 0.7;
    }
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    outline: none;
    background: none;
  }

  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
    outline: none;
  }

  /* Scrollbar Styling (Webkit) */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: var(--color-system-gray-4);
    border-radius: var(--radius-pill);
    
    &:hover {
      background: var(--color-system-gray-3);
    }
  }

  /* Selection */
  ::selection {
    background: var(--color-system-blue);
    color: var(--color-text-white);
  }
`;



