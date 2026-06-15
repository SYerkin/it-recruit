import React from 'react';
import styled from 'styled-components';
import { NavLink, Routes, Route, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  ClipboardList,
  Users,
  BookOpen,
  GraduationCap,
  ShieldCheck,
  MessageSquare,
  LogOut,
} from 'lucide-react';
import { useAuthStore } from '@app/store/auth.store';
import { AdminDashboard } from './AdminDashboard';
import { AdminCompanies } from './AdminCompanies';
import { AdminApplications } from './AdminApplications';
import { AdminUsers } from './AdminUsers';
import { AdminMentors } from './AdminMentors';
import { AdminFeedback } from './AdminFeedback';
import { AdminMentorApplications } from './AdminMentorApplications';
import { AdminVerification } from './AdminVerification';
import { AdminRecommendations } from './AdminRecommendations';

const Wrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
`;

const Sidebar = styled.nav`
  width: 240px;
  background: #1e1b4b;
  display: flex;
  flex-direction: column;
  padding: 28px 0;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  height: 100vh;
`;

const SidebarTop = styled.div`
  padding: 0 20px 28px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  margin-bottom: 12px;
`;

const LogoText = styled.div`
  font-size: 18px;
  font-weight: 800;
  color: #fff;
  margin-bottom: 2px;
`;

const LogoSub = styled.div`
  font-size: 12px;
  color: rgba(255,255,255,0.4);
  font-weight: 500;
`;

const NavItems = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 0 12px;
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 12px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255,255,255,0.55);
  text-decoration: none;
  transition: all 0.15s;
  &:hover { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.9); }
  &.active { background: rgba(167,139,250,0.2); color: #a78bfa; }
`;

const SidebarBottom = styled.div`
  padding: 12px;
  border-top: 1px solid rgba(255,255,255,0.08);
`;

const LogoutBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 11px 12px;
  border-radius: 10px;
  background: none;
  border: none;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255,255,255,0.4);
  cursor: pointer;
  transition: all 0.15s;
  &:hover { background: rgba(239,68,68,0.15); color: #f87171; }
`;

const Content = styled.main`
  flex: 1;
  overflow-y: auto;
`;

const NAV_LINKS = [
  { to: '/admin', label: 'Дашборд', icon: LayoutDashboard, end: true },
  { to: '/admin/companies', label: 'Компании', icon: Building2 },
  { to: '/admin/applications', label: 'Заявки', icon: ClipboardList },
  { to: '/admin/users', label: 'Пользователи', icon: Users },
  { to: '/admin/mentors', label: 'Менторы', icon: GraduationCap },
  { to: '/admin/mentor-applications', label: 'Заявки менторов', icon: GraduationCap },
  { to: '/admin/recommendations', label: 'Рекомендации', icon: BookOpen },
  { to: '/admin/verification', label: 'Верификация', icon: ShieldCheck },
  { to: '/admin/feedback', label: 'Обратная связь', icon: MessageSquare },
];

export const AdminLayout: React.FC = () => {
  const { logout } = useAuthStore();

  return (
    <Wrapper>
      <Sidebar>
        <SidebarTop>
          <LogoText>IT Recruit</LogoText>
          <LogoSub>Администратор</LogoSub>
        </SidebarTop>

        <NavItems>
          {NAV_LINKS.map(({ to, label, icon: Icon, end }) => (
            <NavItem key={to} to={to} end={end}>
              <Icon size={18} />
              {label}
            </NavItem>
          ))}
        </NavItems>

        <SidebarBottom>
          <LogoutBtn onClick={logout}>
            <LogOut size={18} />
            Выйти
          </LogoutBtn>
        </SidebarBottom>
      </Sidebar>

      <Content>
        <Routes>
          <Route index element={<AdminDashboard />} />
          <Route path="companies" element={<AdminCompanies />} />
          <Route path="applications" element={<AdminApplications />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="mentors" element={<AdminMentors />} />
          <Route path="mentor-applications" element={<AdminMentorApplications />} />
          <Route path="recommendations" element={<AdminRecommendations />} />
          <Route path="verification" element={<AdminVerification />} />
          <Route path="feedback" element={<AdminFeedback />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </Content>
    </Wrapper>
  );
};
