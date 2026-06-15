import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import styled, { keyframes } from 'styled-components';
import { useAuthStore } from '@app/store/auth.store';
import {
  Briefcase,
  Mail,
  Phone,
  Lock,
  ArrowRight,
  ArrowLeft,
  Zap,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const float = keyframes`
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(16px, -20px) scale(1.05); }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
  background: #f5f5f7;
`;

const LeftSide = styled.div`
  flex: 1.1;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 64px 72px;
  background: linear-gradient(145deg, #5b6eea 0%, #6d4fa8 45%, #764ba2 100%);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V4h4V2h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V4h4V2H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    opacity: 0.35;
  }

  @media (max-width: 968px) {
    display: none;
  }
`;

const AuroraBlob = styled.div<{ $top?: string; $left?: string; $right?: string; $bottom?: string; $size?: string; $color?: string }>`
  position: absolute;
  width: ${({ $size }) => $size || '320px'};
  height: ${({ $size }) => $size || '320px'};
  top: ${({ $top }) => $top || 'auto'};
  left: ${({ $left }) => $left || 'auto'};
  right: ${({ $right }) => $right || 'auto'};
  bottom: ${({ $bottom }) => $bottom || 'auto'};
  border-radius: 50%;
  background: ${({ $color }) => $color || 'rgba(255, 255, 255, 0.12)'};
  filter: blur(60px);
  animation: ${float} 12s ease-in-out infinite;
  pointer-events: none;
`;

const RightSide = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 64px;
  position: relative;
  overflow-y: auto;
  background: linear-gradient(180deg, #fbfbfd 0%, #f0f1f5 100%);

  @media (max-width: 968px) {
    padding: 24px 20px 32px;
    background: #fbfbfd;
  }
`;

const BackHomeButton = styled(Link)`
  position: absolute;
  top: 28px;
  left: 28px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(0, 0, 0, 0.06);
  color: #1d1d1f;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  &:hover {
    background: #fff;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
    color: #007aff;
    transform: translateY(-1px);
  }

  @media (max-width: 968px) {
    top: 16px;
    left: 16px;
    padding: 8px 12px;
    font-size: 13px;
  }
`;

const BrandContent = styled.div`
  position: relative;
  z-index: 1;
  color: white;
  max-width: 520px;
`;

const LogoLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 48px;
  text-decoration: none;
  color: inherit;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

const LogoIcon = styled.div`
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.28);
`;

const LogoText = styled.span`
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: white;
`;

const BrandTitle = styled.h2`
  font-size: 52px;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.08;
  margin: 0 0 20px;
  color: white;

  @media (max-width: 1200px) {
    font-size: 40px;
  }
`;

const BrandSubtitle = styled.p`
  font-size: 19px;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
`;

const FeatureList = styled.ul`
  list-style: none;
  margin: 44px 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 16px;
`;

const FeatureIcon = styled.div`
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.14);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.22);
`;

const FeatureText = styled.div`
  strong {
    display: block;
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 4px;
    color: #fff;
  }

  span {
    font-size: 14px;
    line-height: 1.5;
    color: rgba(255, 255, 255, 0.82);
  }
`;

const StatsRow = styled.div`
  display: flex;
  gap: 32px;
  margin-top: 48px;
  padding-top: 32px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
`;

const StatItem = styled.div`
  strong {
    display: block;
    font-size: 28px;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: #fff;
    line-height: 1.1;
  }

  span {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.75);
    margin-top: 4px;
    display: block;
  }
`;

const FormCard = styled.div`
  width: 100%;
  max-width: 480px;
  padding: 48px 44px;
  background: #fff;
  border-radius: 28px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow:
    0 24px 64px -24px rgba(0, 0, 0, 0.14),
    0 0 0 1px rgba(255, 255, 255, 0.6) inset;
  animation: ${slideIn} 0.55s ease-out;

  @media (max-width: 968px) {
    max-width: 440px;
    padding: 0;
    background: transparent;
    border: none;
    box-shadow: none;
    border-radius: 0;
  }
`;

const FormHeader = styled.div`
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 34px;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin: 0 0 8px;
  color: #1d1d1f;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #6b7280;
  line-height: 1.55;
  margin: 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const InputLabel = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
`;

const InputField = styled.div`
  position: relative;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  z-index: 1;
  pointer-events: none;
  line-height: 0;
`;

const StyledInput = styled.input<{ $hasError?: boolean; $hasIcon?: boolean }>`
  width: 100%;
  height: 54px;
  padding: 0 16px 0 ${({ $hasIcon }) => ($hasIcon ? '48px' : '16px')};
  font-size: 16px;
  font-family: inherit;
  background: #f9fafb;
  border: 1.5px solid ${({ $hasError }) => ($hasError ? '#ff3b30' : '#e5e7eb')};
  border-radius: 14px;
  color: #1d1d1f;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;
    border-color: #007aff;
    background: #fff;
    box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.span`
  font-size: 13px;
  color: #ff3b30;
  font-weight: 500;
  margin-top: 8px;
  display: block;
`;

const ErrorMessageBox = styled.div`
  padding: 14px 16px;
  background: rgba(255, 59, 48, 0.08);
  border: 1px solid rgba(255, 59, 48, 0.22);
  border-radius: 12px;
  color: #ff3b30;
  font-size: 14px;
  text-align: center;
  margin-bottom: 4px;
`;

const ForgotRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: -4px;
`;

const ForgotLink = styled(Link)`
  font-size: 14px;
  font-weight: 500;
  color: #007aff;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const PrimaryButton = styled.button<{ disabled?: boolean }>`
  width: 100%;
  height: 54px;
  background: linear-gradient(135deg, #007aff 0%, #5856d6 100%);
  box-shadow: 0 8px 24px rgba(0, 122, 255, 0.28);
  border-radius: 14px;
  border: none;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 4px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 12px 28px rgba(0, 122, 255, 0.35);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const FooterLinks = styled.div`
  margin-top: 28px;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
  text-align: center;
`;

const FooterLink = styled(Link)`
  color: #6b7280;
  font-size: 15px;
  text-decoration: none;
  transition: color 0.2s;

  &:hover {
    color: #007aff;
  }

  strong {
    color: #007aff;
    font-weight: 600;
  }
`;

const loginSchema = z.object({
  identifier: z.string().min(1, 'required'),
  password: z.string().min(1, 'required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const FEATURES = [
  { icon: Zap, titleKey: 'auth.login.feature1Title', textKey: 'auth.login.feature1Text' },
  { icon: ShieldCheck, titleKey: 'auth.login.feature2Title', textKey: 'auth.login.feature2Text' },
  { icon: FileText, titleKey: 'auth.login.feature3Title', textKey: 'auth.login.feature3Text' },
] as const;

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError, user, isAuthenticated } = useAuthStore();
  const { t } = useTranslation();

  React.useEffect(() => {
    if (!isAuthenticated || !user) return;
    navigate(user.role === 'ADMIN' ? '/admin' : '/dashboard', { replace: true });
  }, [isAuthenticated, user, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const identifier = watch('identifier');
  const isPhone = identifier && /^[\d\s\-+()]+$/.test(identifier) && !identifier.includes('@');

  const onSubmit = async (data: LoginFormData) => {
    clearError();
    try {
      await login(data.identifier, data.password);
      const currentUser = useAuthStore.getState().user;
      navigate(currentUser?.role === 'ADMIN' ? '/admin' : '/dashboard', { replace: true });
    } catch {
      // Ошибка обрабатывается в store
    }
  };

  return (
    <Container>
      <LeftSide>
        <AuroraBlob $top="-80px" $left="-60px" $size="360px" $color="rgba(255,255,255,0.14)" />
        <AuroraBlob $bottom="-100px" $right="-40px" $size="400px" $color="rgba(88,86,214,0.35)" />

        <BrandContent>
          <LogoLink to="/">
            <LogoIcon>
              <Briefcase size={28} color="white" />
            </LogoIcon>
            <LogoText>IT Recruit</LogoText>
          </LogoLink>

          <BrandTitle>{t('auth.login.brandTitle')}</BrandTitle>
          <BrandSubtitle>{t('auth.login.brandSubtitle')}</BrandSubtitle>

          <FeatureList>
            {FEATURES.map(({ icon: Icon, titleKey, textKey }) => (
              <FeatureItem key={titleKey}>
                <FeatureIcon>
                  <Icon size={22} color="white" />
                </FeatureIcon>
                <FeatureText>
                  <strong>{t(titleKey)}</strong>
                  <span>{t(textKey)}</span>
                </FeatureText>
              </FeatureItem>
            ))}
          </FeatureList>

          <StatsRow>
            <StatItem>
              <strong>32+</strong>
              <span>{t('auth.login.statJobs')}</span>
            </StatItem>
            <StatItem>
              <strong>11+</strong>
              <span>{t('auth.login.statCompanies')}</span>
            </StatItem>
            <StatItem>
              <strong>4ч</strong>
              <span>{t('auth.login.statResponse')}</span>
            </StatItem>
          </StatsRow>
        </BrandContent>
      </LeftSide>

      <RightSide>
        <BackHomeButton to="/">
          <ArrowLeft size={18} />
          {t('auth.login.backToHome')}
        </BackHomeButton>

        <FormCard>
          <FormHeader>
            <Title>{t('auth.login.title')}</Title>
            <Subtitle>{t('auth.login.subtitle')}</Subtitle>
          </FormHeader>

          {error && <ErrorMessageBox>{error}</ErrorMessageBox>}

          <Form onSubmit={handleSubmit(onSubmit)}>
            <InputWrapper>
              <InputLabel htmlFor="login-identifier">{t('auth.login.identifierLabel')}</InputLabel>
              <InputField>
                <InputIcon>
                  {isPhone ? <Phone size={20} /> : <Mail size={20} />}
                </InputIcon>
                <StyledInput
                  id="login-identifier"
                  $hasIcon
                  type="text"
                  placeholder={isPhone ? '+7 (999) 123-45-67' : t('auth.login.emailPlaceholder')}
                  $hasError={!!errors.identifier}
                  autoComplete="username"
                  {...register('identifier')}
                />
              </InputField>
              {errors.identifier && (
                <ErrorMessage>{t('auth.login.emailRequired')}</ErrorMessage>
              )}
            </InputWrapper>

            <InputWrapper>
              <InputLabel htmlFor="login-password">{t('auth.login.passwordPlaceholder')}</InputLabel>
              <InputField>
                <InputIcon>
                  <Lock size={20} />
                </InputIcon>
                <StyledInput
                  id="login-password"
                  $hasIcon
                  type="password"
                  placeholder="••••••••"
                  $hasError={!!errors.password}
                  autoComplete="current-password"
                  {...register('password')}
                />
              </InputField>
              {errors.password && (
                <ErrorMessage>{t('auth.login.passwordRequired')}</ErrorMessage>
              )}
            </InputWrapper>

            <ForgotRow>
              <ForgotLink to="/forgot-password">
                {t('auth.login.forgotPassword')}
              </ForgotLink>
            </ForgotRow>

            <PrimaryButton type="submit" disabled={isLoading}>
              {isLoading ? t('auth.login.submitting') : t('auth.login.submit')}
              {!isLoading && <ArrowRight size={20} />}
            </PrimaryButton>
          </Form>

          <FooterLinks>
            <FooterLink to="/auth">
              {t('auth.login.noAccount')} <strong>{t('auth.login.register')}</strong>
            </FooterLink>
          </FooterLinks>
        </FormCard>
      </RightSide>
    </Container>
  );
};
