import React from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import styled from 'styled-components';
import { Briefcase, Mail, Lock, ArrowRight, User } from 'lucide-react';
import { useAuthStore } from '@app/store/auth.store';
import { useTranslation } from 'react-i18next';

// Modern Split Layout
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
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V4h4V2h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V4h4V2H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    opacity: 0.3;
  }
  
  @media (max-width: 968px) {
    display: none;
  }
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

const FormContainer = styled.div`
  width: 100%;
  max-width: 440px;
  animation: slideIn 0.6s ease-out;
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

const FormHeader = styled.div`
  margin-bottom: var(--spacing-3xl);
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
  line-height: 1.5;
`;

const RoleBadge = styled.div<{ role: string }>`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: 8px 16px;
  background: ${({ role }) =>
    role === 'HR'
      ? 'rgba(0, 122, 255, 0.1)'
      : 'rgba(88, 86, 214, 0.1)'};
  border-radius: 12px;
  margin-top: var(--spacing-md);
  font-size: 14px;
  font-weight: 600;
  color: ${({ role }) =>
    role === 'HR' ? '#007AFF' : '#5856D6'};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
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

const StyledInput = styled.input<{ hasError?: boolean; hasIcon?: boolean }>`
  width: 100%;
  height: 56px;
  padding: 0 ${({ hasIcon }) => (hasIcon ? '48px' : '16px')} 0 ${({ hasIcon }) => (hasIcon ? '48px' : '16px')};
  font-size: 16px;
  font-family: inherit;
  background: var(--color-bg-secondary);
  border: 2px solid ${({ hasError }) => (hasError ? '#FF3B30' : 'var(--color-system-gray-4)')};
  border-radius: 16px;
  color: var(--color-text-primary);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &::placeholder {
    color: var(--color-text-tertiary);
  }

  &:focus {
    outline: none;
    border-color: var(--color-system-blue);
    box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.1);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.span`
  font-size: 13px;
  color: #FF3B30;
  font-weight: 500;
  margin-top: 8px;
  display: block;
`;

const ErrorMessageBox = styled.div`
  padding: var(--spacing-md);
  background: rgba(255, 59, 48, 0.1);
  border: 1px solid rgba(255, 59, 48, 0.3);
  border-radius: 12px;
  color: #FF3B30;
  font-size: 15px;
  text-align: center;
  animation: shake 0.5s ease-out;
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
  }
`;

const PrimaryButton = styled.button<{ disabled?: boolean }>`
  width: 100%;
  height: 56px;
  background: linear-gradient(135deg, #007AFF 0%, #5856D6 100%);
  box-shadow: 0 4px 16px rgba(0, 122, 255, 0.3);
  border-radius: 16px;
  border: none;
  color: #FFFFFF;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  position: relative;
  overflow: hidden;
  margin-top: var(--spacing-md);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.5s;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 122, 255, 0.4);
    
    &::before {
      left: 100%;
    }
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
  margin-top: var(--spacing-2xl);
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const FooterLink = styled(Link)`
  color: var(--color-text-secondary);
  font-size: 15px;
  text-decoration: none;
  transition: color 0.2s;
  
  &:hover {
    color: var(--color-system-blue);
  }
  
  strong {
    color: var(--color-system-blue);
    font-weight: 600;
  }
`;

const registerSchema = z.object({
  email: z.string().email('invalid_email'),
  password: z.string().min(6, 'password_min'),
  confirmPassword: z.string(),
  role: z.enum(['ADMIN', 'HR', 'CANDIDATE']),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'password_mismatch',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = (searchParams.get('role') as 'CANDIDATE' | 'HR' | null) || 'CANDIDATE';
  const { t } = useTranslation();

  const { register: registerUser, isLoading, error, clearError, user, isAuthenticated } = useAuthStore();

  React.useEffect(() => {
    if (!isAuthenticated || !user) return;
    navigate(user.role === 'ADMIN' ? '/admin' : '/dashboard', { replace: true });
  }, [isAuthenticated, user, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: role === 'HR' ? 'HR' : 'CANDIDATE',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    clearError();
    try {
      await registerUser(data.email, data.password, data.role);
      const currentUser = useAuthStore.getState().user;
      navigate(currentUser?.role === 'ADMIN' ? '/admin' : '/dashboard', { replace: true });
    } catch (err) {
      // Ошибка обрабатывается в store
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
          <BrandTitle>{t('auth.register.brandTitle')}</BrandTitle>
          <BrandSubtitle>{t('auth.register.brandSubtitle')}</BrandSubtitle>
        </BrandContent>
      </LeftSide>

      <RightSide>
        <FormContainer>
          <FormHeader>
            <Title>{t('auth.register.title')}</Title>
            <Subtitle>
              {role === 'HR' ? t('auth.register.subtitleHR') : t('auth.register.subtitleCandidate')}
            </Subtitle>
            <RoleBadge role={role}>
              <User size={16} />
              {role === 'HR' ? t('auth.register.roleHR') : t('auth.register.roleCandidate')}
            </RoleBadge>
          </FormHeader>

          {error && <ErrorMessageBox>{error}</ErrorMessageBox>}

          <Form onSubmit={handleSubmit(onSubmit)}>
            <InputWrapper>
              <InputIcon>
                <Mail size={20} />
              </InputIcon>
              <StyledInput
                hasIcon
                type="email"
                placeholder={t('auth.register.emailPlaceholder')}
                hasError={!!errors.email}
                {...register('email')}
              />
              {errors.email && (
                <ErrorMessage>{t('auth.register.invalidEmail')}</ErrorMessage>
              )}
            </InputWrapper>

            <InputWrapper>
              <InputIcon>
                <Lock size={20} />
              </InputIcon>
              <StyledInput
                hasIcon
                type="password"
                placeholder={t('auth.register.passwordPlaceholder')}
                hasError={!!errors.password}
                {...register('password')}
              />
              {errors.password && (
                <ErrorMessage>{t('auth.register.passwordMin')}</ErrorMessage>
              )}
            </InputWrapper>

            <InputWrapper>
              <InputIcon>
                <Lock size={20} />
              </InputIcon>
              <StyledInput
                hasIcon
                type="password"
                placeholder={t('auth.register.confirmPasswordPlaceholder')}
                hasError={!!errors.confirmPassword}
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <ErrorMessage>{t('auth.register.passwordMismatch')}</ErrorMessage>
              )}
            </InputWrapper>

            <input type="hidden" {...register('role')} />

            <PrimaryButton type="submit" disabled={isLoading}>
              {isLoading ? t('auth.register.submitting') : t('auth.register.submit')}
              {!isLoading && <ArrowRight size={20} />}
            </PrimaryButton>
          </Form>

          <FooterLinks>
            <FooterLink to="/login">
              {t('auth.register.hasAccount')} <strong>{t('auth.register.login')}</strong>
            </FooterLink>
          </FooterLinks>
        </FormContainer>
      </RightSide>
    </Container>
  );
};
