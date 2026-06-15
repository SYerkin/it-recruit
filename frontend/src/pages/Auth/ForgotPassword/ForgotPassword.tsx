import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Briefcase, ArrowLeft, Mail, Lock, ArrowRight } from 'lucide-react';
import { authApi } from '@shared/api';
import { useTranslation } from 'react-i18next';

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  overflow: hidden;
  background: #FBFBFD;
`;

const LeftSide = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: var(--spacing-4xl);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
  @media (max-width: 968px) {
    display: none;
  }
`;

const BrandContent = styled.div`
  position: relative;
  z-index: 1;
  color: white;
  max-width: 500px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-4xl);
`;

const LogoIcon = styled.div`
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.3);
`;

const LogoText = styled.h1`
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: white;
`;

const BrandTitle = styled.h2`
  font-size: 48px;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.1;
  margin-bottom: var(--spacing-lg);
  color: white;
  @media (max-width: 1200px) {
    font-size: 36px;
  }
`;

const BrandSubtitle = styled.p`
  font-size: 20px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
  opacity: 0.95;
`;

const RightSide = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-4xl);
  position: relative;
  overflow-y: auto;
  @media (max-width: 968px) {
    padding: var(--spacing-xl);
  }
`;

const Content = styled.div`
  width: 100%;
  max-width: 440px;
`;

const Title = styled.h1`
  font-size: 36px;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-primary);
`;

const Subtitle = styled.p`
  font-size: 17px;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: var(--spacing-2xl);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
`;

const InputWrapper = styled.div`
  position: relative;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-tertiary);
  z-index: 1;
  pointer-events: none;
`;

const StyledInput = styled.input<{ $hasError?: boolean; $hasIcon?: boolean }>`
  width: 100%;
  height: 56px;
  padding: 0 16px 0 ${({ $hasIcon }) => ($hasIcon ? '48px' : '16px')};
  font-size: 16px;
  font-family: inherit;
  background: var(--color-bg-secondary);
  border: 2px solid ${({ $hasError }) => ($hasError ? '#FF3B30' : 'var(--color-system-gray-4)')};
  border-radius: 16px;
  color: var(--color-text-primary);
  transition: all 0.2s ease;

  &::placeholder {
    color: var(--color-text-tertiary);
  }

  &:focus {
    outline: none;
    border-color: var(--color-system-blue);
    box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.1);
  }
`;

const ErrorMessage = styled.span`
  font-size: 13px;
  color: #FF3B30;
  font-weight: 500;
  margin-top: 6px;
  display: block;
`;

const ErrorBox = styled.div`
  padding: 12px 16px;
  background: rgba(255, 59, 48, 0.1);
  border: 1px solid rgba(255, 59, 48, 0.3);
  border-radius: 12px;
  color: #FF3B30;
  font-size: 14px;
`;

const SuccessBox = styled.div`
  padding: 12px 16px;
  background: rgba(52, 199, 89, 0.1);
  border: 1px solid rgba(52, 199, 89, 0.3);
  border-radius: 12px;
  color: #34c759;
  font-size: 14px;
`;

const PrimaryButton = styled.button<{ disabled?: boolean }>`
  width: 100%;
  height: 56px;
  background: linear-gradient(135deg, #007AFF 0%, #5856D6 100%);
  box-shadow: 0 4px 16px rgba(0, 122, 255, 0.3);
  border-radius: 16px;
  border: none;
  color: #fff;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 122, 255, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: var(--spacing-xl);
  color: var(--color-text-secondary);
  font-size: 15px;
  text-decoration: none;
  &:hover {
    color: var(--color-system-blue);
  }
`;

export const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (newPassword.length < 6) {
      setError(t('auth.forgotPassword.passwordMin'));
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(t('auth.forgotPassword.passwordMismatch'));
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.forgotPassword(email.trim(), newPassword);
      setSuccess(res.message || t('auth.forgotPassword.successMsg'));
      setEmail('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || t('auth.forgotPassword.passwordMin'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <LeftSide>
        <BrandContent>
          <Logo>
            <LogoIcon>
              <Briefcase size={28} color="white" />
            </LogoIcon>
            <LogoText>IT Recruit</LogoText>
          </Logo>
          <BrandTitle>{t('auth.forgotPassword.brandTitle')}</BrandTitle>
          <BrandSubtitle>{t('auth.forgotPassword.brandSubtitle')}</BrandSubtitle>
        </BrandContent>
      </LeftSide>

      <RightSide>
        <Content>
          <Title>{t('auth.forgotPassword.title')}</Title>
          <Subtitle>{t('auth.forgotPassword.subtitle')}</Subtitle>

          {error && <ErrorBox>{error}</ErrorBox>}
          {success && <SuccessBox>{success}</SuccessBox>}

          <Form onSubmit={handleSubmit}>
            <InputWrapper>
              <InputIcon><Mail size={20} /></InputIcon>
              <StyledInput
                $hasIcon
                type="email"
                placeholder={t('auth.forgotPassword.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </InputWrapper>
            <InputWrapper>
              <InputIcon><Lock size={20} /></InputIcon>
              <StyledInput
                $hasIcon
                type="password"
                placeholder={t('auth.forgotPassword.newPasswordPlaceholder')}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={6}
                required
              />
            </InputWrapper>
            <InputWrapper>
              <InputIcon><Lock size={20} /></InputIcon>
              <StyledInput
                $hasIcon
                type="password"
                placeholder={t('auth.forgotPassword.confirmPasswordPlaceholder')}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </InputWrapper>
            <PrimaryButton type="submit" disabled={loading}>
              {loading ? t('auth.forgotPassword.submitting') : t('auth.forgotPassword.submit')}
              {!loading && <ArrowRight size={20} />}
            </PrimaryButton>
          </Form>

          <BackLink to="/login">
            <ArrowLeft size={18} />
            {t('auth.forgotPassword.backToLogin')}
          </BackLink>
        </Content>
      </RightSide>
    </Container>
  );
};
