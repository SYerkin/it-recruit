import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { User, Briefcase, LogOut, Menu, X } from 'lucide-react';
import { useAuthStore } from '@app/store/auth.store';
import { useTranslation } from 'react-i18next';
import i18n from '@shared/i18n/i18n';

const HeaderContainer = styled.header<{ $isHomePage?: boolean }>`
  position: sticky;
  top: 0;
  z-index: 100;
  background: ${({ $isHomePage }) =>
    $isHomePage
      ? 'rgba(0, 0, 0, 0.3)'
      : 'rgba(255, 255, 255, 0.7)'};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid
    ${({ $isHomePage }) =>
      $isHomePage ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
  padding: var(--spacing-md) var(--spacing-lg);
  @media (max-width: 768px) {
    padding: 10px 14px;
  }
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const Logo = styled(Link)<{ $isHomePage?: boolean }>`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: ${({ $isHomePage }) =>
    $isHomePage ? '#fff' : 'var(--color-text-primary)'};
  text-decoration: none;
  flex-shrink: 0;
  @media (max-width: 768px) {
    font-size: 18px;
    gap: 0;
  }
`;

const LogoText = styled.span`
  @media (max-width: 768px) {
    display: none;
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: var(--spacing-xl);
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)<{ $isHomePage?: boolean }>`
  font-size: 17px;
  font-weight: 500;
  color: ${({ $isHomePage }) =>
    $isHomePage ? 'rgba(255, 255, 255, 0.8)' : 'var(--color-text-secondary)'};
  transition: color var(--transition-fast);
  text-decoration: none;
  
  &:hover {
    color: ${({ $isHomePage }) =>
      $isHomePage ? '#fff' : 'var(--color-text-primary)'};
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  @media (max-width: 768px) {
    gap: 8px;
  }
`;

const UserButton = styled.button<{ $isHomePage?: boolean }>`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: 8px 16px;
  border-radius: var(--radius-pill);
  background: transparent;
  color: ${({ $isHomePage }) =>
    $isHomePage ? '#fff' : 'var(--color-text-primary)'};
  font-size: 15px;
  font-weight: 500;
  transition: all var(--transition-fast);
  @media (max-width: 768px) {
    padding: 8px;
    min-width: 36px;
    min-height: 36px;
    justify-content: center;
    border-radius: 10px;
    border: 1px solid ${({ $isHomePage }) => ($isHomePage ? 'rgba(255,255,255,0.2)' : '#e5e7eb')};
  }
  
  &:hover {
    background: ${({ $isHomePage }) =>
      $isHomePage ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)'};
  }
`;

const UserButtonText = styled.span`
  @media (max-width: 768px) {
    display: none;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: 8px 16px;
  border-radius: var(--radius-pill);
  background: transparent;
  color: var(--color-text-primary);
  font-size: 15px;
  font-weight: 500;
`;

const LogoutButton = styled.button<{ $isHomePage?: boolean }>`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: 8px 16px;
  border-radius: var(--radius-pill);
  background: transparent;
  color: ${({ $isHomePage }) =>
    $isHomePage ? 'rgba(255, 255, 255, 0.7)' : 'var(--color-text-secondary)'};
  font-size: 15px;
  font-weight: 500;
  transition: all var(--transition-fast);
  cursor: pointer;
  @media (max-width: 768px) {
    display: none;
  }
  
  &:hover {
    background: ${({ $isHomePage }) =>
      $isHomePage ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)'};
    color: ${({ $isHomePage }) =>
      $isHomePage ? '#fff' : 'var(--color-text-primary)'};
  }
`;

const MobileMenuButton = styled.button<{ $isHomePage?: boolean }>`
  display: none;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid ${({ $isHomePage }) => ($isHomePage ? 'rgba(255,255,255,0.3)' : '#e5e7eb')};
  background: ${({ $isHomePage }) => ($isHomePage ? 'rgba(255,255,255,0.12)' : '#fff')};
  color: ${({ $isHomePage }) => ($isHomePage ? '#fff' : '#111827')};
  align-items: center;
  justify-content: center;
  cursor: pointer;
  @media (max-width: 768px) {
    display: inline-flex;
  }
`;

const MobileMenuOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(15, 23, 42, 0.5);
`;

const MobileMenuPanel = styled.div<{ $isHomePage?: boolean }>`
  position: absolute;
  top: 64px;
  left: 12px;
  right: 12px;
  border-radius: 14px;
  border: 1px solid ${({ $isHomePage }) => ($isHomePage ? 'rgba(255,255,255,0.2)' : '#e5e7eb')};
  background: ${({ $isHomePage }) => ($isHomePage ? 'rgba(15, 23, 42, 0.92)' : '#fff')};
  backdrop-filter: blur(8px);
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MobileLink = styled(Link)<{ $isHomePage?: boolean }>`
  padding: 10px 12px;
  border-radius: 10px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  color: ${({ $isHomePage }) => ($isHomePage ? '#fff' : '#0f172a')};
  &:hover {
    background: ${({ $isHomePage }) => ($isHomePage ? 'rgba(255,255,255,0.12)' : '#f8fafc')};
  }
`;

const MobileActionButton = styled.button<{ $isHomePage?: boolean }>`
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid ${({ $isHomePage }) => ($isHomePage ? 'rgba(255,255,255,0.22)' : '#e5e7eb')};
  background: ${({ $isHomePage }) => ($isHomePage ? 'rgba(255,255,255,0.08)' : '#fff')};
  color: ${({ $isHomePage }) => ($isHomePage ? '#fff' : '#111827')};
  font-size: 14px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`;

const LangButton = styled.button<{ $isHomePage?: boolean; $active?: boolean }>`
  padding: 5px 10px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  border: 1px solid ${({ $isHomePage, $active }) =>
    $active
      ? ($isHomePage ? 'rgba(255,255,255,0.6)' : '#1d1d1f')
      : ($isHomePage ? 'rgba(255,255,255,0.2)' : '#e5e7eb')};
  background: ${({ $isHomePage, $active }) =>
    $active
      ? ($isHomePage ? 'rgba(255,255,255,0.2)' : '#1d1d1f')
      : 'transparent'};
  color: ${({ $isHomePage, $active }) =>
    $active
      ? ($isHomePage ? '#fff' : '#fff')
      : ($isHomePage ? 'rgba(255,255,255,0.7)' : '#6b7280')};
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    opacity: 0.85;
  }
  @media (max-width: 768px) {
    padding: 4px 8px;
    font-size: 11px;
    border-radius: 6px;
  }
`;

const LangGroup = styled.div`
  display: flex;
  gap: 4px;
  @media (max-width: 768px) {
    gap: 2px;
  }
`;

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { t } = useTranslation();
  const isHomePage = location.pathname === '/';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lang, setLang] = useState(i18n.language || 'ru');

  const switchLang = (l: string) => {
    i18n.changeLanguage(l);
    localStorage.setItem('lang', l);
    setLang(l);
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <HeaderContainer $isHomePage={isHomePage}>
      <HeaderContent>
        <Logo to="/" $isHomePage={isHomePage}>
          <Briefcase size={24} />
          <LogoText>IT Recruit</LogoText>
        </Logo>

        <Nav>
          <NavLink to="/jobs" $isHomePage={isHomePage}>{t('header.jobs')}</NavLink>
          {isAuthenticated && (user?.role === 'HR' || user?.role === 'ADMIN') && (
            <NavLink to="/candidates" $isHomePage={isHomePage}>{t('header.candidates')}</NavLink>
          )}
          <NavLink to="/companies" $isHomePage={isHomePage}>{t('header.companies')}</NavLink>
          <NavLink to="/recommendations" $isHomePage={isHomePage}>{t('header.recommendations')}</NavLink>
        </Nav>

        <UserSection>
          <LangGroup>
            <LangButton $isHomePage={isHomePage} $active={lang === 'ru'} onClick={() => switchLang('ru')}>RU</LangButton>
            <LangButton $isHomePage={isHomePage} $active={lang === 'en'} onClick={() => switchLang('en')}>EN</LangButton>
          </LangGroup>
          <MobileMenuButton
            $isHomePage={isHomePage}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={t('header.openMenu')}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </MobileMenuButton>
          {isAuthenticated && user ? (
            <>
              <UserButton $isHomePage={isHomePage} onClick={() => navigate('/dashboard')}>
                <User size={20} />
                <UserButtonText>{t('header.dashboard')}</UserButtonText>
              </UserButton>
              <LogoutButton $isHomePage={isHomePage} onClick={handleLogout}>
                <LogOut size={18} />
                {t('header.logout')}
              </LogoutButton>
            </>
          ) : (
            <UserButton $isHomePage={isHomePage} onClick={() => navigate('/login')}>
              <User size={20} />
              <UserButtonText>{t('header.login')}</UserButtonText>
            </UserButton>
          )}
        </UserSection>
      </HeaderContent>

      {mobileMenuOpen && (
        <MobileMenuOverlay onClick={() => setMobileMenuOpen(false)}>
          <MobileMenuPanel $isHomePage={isHomePage} onClick={(event) => event.stopPropagation()}>
            <MobileLink $isHomePage={isHomePage} to="/jobs" onClick={() => setMobileMenuOpen(false)}>
              {t('header.jobs')}
            </MobileLink>
            {(isAuthenticated && (user?.role === 'HR' || user?.role === 'ADMIN')) && (
              <MobileLink $isHomePage={isHomePage} to="/candidates" onClick={() => setMobileMenuOpen(false)}>
                {t('header.candidates')}
              </MobileLink>
            )}
            <MobileLink $isHomePage={isHomePage} to="/companies" onClick={() => setMobileMenuOpen(false)}>
              {t('header.companies')}
            </MobileLink>
            <MobileLink $isHomePage={isHomePage} to="/recommendations" onClick={() => setMobileMenuOpen(false)}>
              {t('header.recommendations')}
            </MobileLink>
            <MobileLink $isHomePage={isHomePage} to="/mentors" onClick={() => setMobileMenuOpen(false)}>
              {t('header.mentors')}
            </MobileLink>
            {isAuthenticated ? (
              <MobileActionButton $isHomePage={isHomePage} onClick={handleLogout}>
                <LogOut size={16} />
                {t('header.logout')}
              </MobileActionButton>
            ) : (
              <MobileActionButton
                $isHomePage={isHomePage}
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/login');
                }}
              >
                <User size={16} />
                {t('header.login')}
              </MobileActionButton>
            )}
          </MobileMenuPanel>
        </MobileMenuOverlay>
      )}
    </HeaderContainer>
  );
};


