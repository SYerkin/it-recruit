import React from 'react';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { Users, Building2, Briefcase, ClipboardList, GraduationCap, MessageSquare, ShieldCheck } from 'lucide-react';
import { adminApi } from '@shared/api';

const Page = styled.div`
  padding: 40px;
`;

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 800;
  color: #1e1b4b;
  margin-bottom: 8px;
`;

const PageSub = styled.p`
  font-size: 15px;
  color: #6b7280;
  margin-bottom: 36px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const StatCard = styled.div<{ $color: string }>`
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  border-left: 4px solid ${p => p.$color};
`;

const StatIcon = styled.div<{ $color: string }>`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: ${p => p.$color}18;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  color: ${p => p.$color};
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 800;
  color: #1d1d1f;
  line-height: 1;
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const Card = styled.div`
  background: #fff;
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
`;

const CardTitle = styled.h2`
  font-size: 17px;
  font-weight: 700;
  color: #1d1d1f;
  margin-bottom: 20px;
`;

const StatusRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f3f4f6;
  &:last-child { border-bottom: none; }
`;

const StatusName = styled.span`
  font-size: 14px;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatusDot = styled.span<{ $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${p => p.$color};
  display: inline-block;
`;

const StatusCount = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #1d1d1f;
`;

const AlertCard = styled.div`
  background: #fef3c7;
  border: 1px solid #fcd34d;
  border-radius: 14px;
  padding: 16px 20px;
  margin-bottom: 24px;
  display: flex;
  gap: 12px;
  align-items: center;
  font-size: 14px;
  color: #92400e;
`;

const STATUS_COLORS: Record<string, string> = {
  APPLIED: '#3b82f6',
  SCREENING: '#f59e0b',
  INTERVIEW: '#8b5cf6',
  OFFER: '#10b981',
  HIRED: '#059669',
  REJECTED: '#ef4444',
};

const STATUS_LABELS: Record<string, string> = {
  APPLIED: 'Отклики',
  SCREENING: 'Скрининг',
  INTERVIEW: 'Интервью',
  OFFER: 'Оффер',
  HIRED: 'Принят',
  REJECTED: 'Отказ',
};

export const AdminDashboard: React.FC = () => {
  const { data } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: adminApi.getStats,
    refetchInterval: 60_000,
  });

  const stats = data?.data;

  return (
    <Page>
      <PageTitle>Дашборд</PageTitle>
      <PageSub>Обзор платформы в реальном времени</PageSub>

      {stats && (stats.unreadFeedback > 0 || stats.pendingVerifications > 0) && (
        <AlertCard>
          <MessageSquare size={18} />
          {stats.unreadFeedback > 0 && <span>{stats.unreadFeedback} непрочитанных сообщений. </span>}
          {stats.pendingVerifications > 0 && <span>{stats.pendingVerifications} заявок менторов ожидают проверки.</span>}
        </AlertCard>
      )}

      <StatsGrid>
        <StatCard $color="#7c3aed">
          <StatIcon $color="#7c3aed"><Users size={22} /></StatIcon>
          <StatValue>{stats?.users.total ?? '—'}</StatValue>
          <StatLabel>Всего пользователей</StatLabel>
        </StatCard>
        <StatCard $color="#3b82f6">
          <StatIcon $color="#3b82f6"><Users size={22} /></StatIcon>
          <StatValue>{stats?.users.hr ?? '—'}</StatValue>
          <StatLabel>HR-специалистов</StatLabel>
        </StatCard>
        <StatCard $color="#10b981">
          <StatIcon $color="#10b981"><Users size={22} /></StatIcon>
          <StatValue>{stats?.users.candidates ?? '—'}</StatValue>
          <StatLabel>Кандидатов</StatLabel>
        </StatCard>
        <StatCard $color="#f59e0b">
          <StatIcon $color="#f59e0b"><Building2 size={22} /></StatIcon>
          <StatValue>{stats?.companies ?? '—'}</StatValue>
          <StatLabel>Компаний</StatLabel>
        </StatCard>
        <StatCard $color="#ef4444">
          <StatIcon $color="#ef4444"><Briefcase size={22} /></StatIcon>
          <StatValue>{stats?.activeJobs ?? '—'}</StatValue>
          <StatLabel>Активных вакансий</StatLabel>
        </StatCard>
        <StatCard $color="#6366f1">
          <StatIcon $color="#6366f1"><ClipboardList size={22} /></StatIcon>
          <StatValue>{stats?.applications.total ?? '—'}</StatValue>
          <StatLabel>Всего заявок</StatLabel>
        </StatCard>
        <StatCard $color="#06b6d4">
          <StatIcon $color="#06b6d4"><GraduationCap size={22} /></StatIcon>
          <StatValue>{stats?.mentors ?? '—'}</StatValue>
          <StatLabel>Активных менторов</StatLabel>
        </StatCard>
        <StatCard $color="#84cc16">
          <StatIcon $color="#84cc16"><MessageSquare size={22} /></StatIcon>
          <StatValue>{stats?.unreadFeedback ?? '—'}</StatValue>
          <StatLabel>Новых сообщений</StatLabel>
        </StatCard>
      </StatsGrid>

      <Row>
        <Card>
          <CardTitle>Заявки по статусам</CardTitle>
          {stats?.applications.byStatus && Object.keys(STATUS_LABELS).map(key => (
            <StatusRow key={key}>
              <StatusName>
                <StatusDot $color={STATUS_COLORS[key] || '#9ca3af'} />
                {STATUS_LABELS[key]}
              </StatusName>
              <StatusCount>{stats.applications.byStatus[key] || 0}</StatusCount>
            </StatusRow>
          ))}
          {!stats && <p style={{ color: '#9ca3af', fontSize: 14 }}>Загрузка...</p>}
        </Card>

        <Card>
          <CardTitle>Статус платформы</CardTitle>
          <StatusRow>
            <StatusName><StatusDot $color="#10b981" /> База данных</StatusName>
            <StatusCount style={{ color: '#10b981', fontSize: 13 }}>Онлайн</StatusCount>
          </StatusRow>
          <StatusRow>
            <StatusName><StatusDot $color="#10b981" /> API сервер</StatusName>
            <StatusCount style={{ color: '#10b981', fontSize: 13 }}>Онлайн</StatusCount>
          </StatusRow>
          <StatusRow>
            <StatusName><StatusDot $color={stats?.pendingVerifications ? '#f59e0b' : '#10b981'} /> Заявки менторов</StatusName>
            <StatusCount style={{ color: stats?.pendingVerifications ? '#f59e0b' : '#10b981', fontSize: 13 }}>
              {stats?.pendingVerifications ? `${stats.pendingVerifications} ожидает` : 'Нет новых'}
            </StatusCount>
          </StatusRow>
          <StatusRow>
            <StatusName><StatusDot $color={stats?.unreadFeedback ? '#f59e0b' : '#10b981'} /> Обратная связь</StatusName>
            <StatusCount style={{ color: stats?.unreadFeedback ? '#f59e0b' : '#10b981', fontSize: 13 }}>
              {stats?.unreadFeedback ? `${stats.unreadFeedback} новых` : 'Всё прочитано'}
            </StatusCount>
          </StatusRow>
        </Card>
      </Row>
    </Page>
  );
};
