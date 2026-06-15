import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '@shared/ui/Button';
import { Briefcase, User, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: var(--spacing-lg);
  background: var(--color-bg-primary);
`;

const Content = styled.div`
  max-width: 600px;
  width: 100%;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 48px;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin-bottom: var(--spacing-md);
  background: linear-gradient(135deg, var(--color-text-primary), var(--color-text-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 36px;
  }
`;

const Subtitle = styled.p`
  font-size: 21px;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-4xl);
`;

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-2xl);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const OptionCard = styled.button<{ selected?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-2xl);
  background: var(--color-bg-secondary);
  border: 2px solid ${({ selected }) => (selected ? 'var(--color-system-blue)' : 'var(--color-system-gray-4)')};
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-base);
  text-align: center;

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-medium);
    border-color: var(--color-system-blue);
  }

  ${({ selected }) =>
    selected &&
    `
    background: rgba(0, 122, 255, 0.05);
    box-shadow: var(--shadow-medium);
  `}
`;

const IconWrapper = styled.div`
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  color: var(--color-system-blue);
`;

const OptionTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
`;

const OptionDescription = styled.p`
  font-size: 15px;
  color: var(--color-text-secondary);
  margin: 0;
`;

const ActionButton = styled(Button)`
  margin-top: var(--spacing-xl);
`;

const LoginLink = styled.p`
  margin-top: var(--spacing-xl);
  color: var(--color-text-secondary);
  font-size: 15px;
  
  a {
    color: var(--color-system-blue);
    font-weight: 600;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const UserTypeSelection: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedRole, setSelectedRole] = React.useState<'CANDIDATE' | 'HR' | null>(null);

  const handleContinue = () => {
    if (selectedRole) {
      navigate(`/register?role=${selectedRole}`);
    }
  };

  return (
    <Container>
      <Content>
        <Title>{t('auth.userType.title')}</Title>
        <Subtitle>{t('auth.userType.subtitle')}</Subtitle>

        <OptionsGrid>
          <OptionCard selected={selectedRole === 'CANDIDATE'} onClick={() => setSelectedRole('CANDIDATE')}>
            <IconWrapper><User size={32} /></IconWrapper>
            <OptionTitle>{t('auth.userType.candidateTitle')}</OptionTitle>
            <OptionDescription>{t('auth.userType.candidateDesc')}</OptionDescription>
          </OptionCard>

          <OptionCard selected={selectedRole === 'HR'} onClick={() => setSelectedRole('HR')}>
            <IconWrapper><Briefcase size={32} /></IconWrapper>
            <OptionTitle>{t('auth.userType.hrTitle')}</OptionTitle>
            <OptionDescription>{t('auth.userType.hrDesc')}</OptionDescription>
          </OptionCard>
        </OptionsGrid>

        <ActionButton variant="primary" size="lg" fullWidth onClick={handleContinue} disabled={!selectedRole}>
          {t('auth.userType.continue')}
        </ActionButton>

        <LoginLink>
          {t('auth.userType.hasAccount')} <a href="/login">{t('auth.userType.login')}</a>
        </LoginLink>
      </Content>
    </Container>
  );
};

