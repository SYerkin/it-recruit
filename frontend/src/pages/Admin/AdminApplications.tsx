import React, { useState } from 'react';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@shared/api';

const Page = styled.div`
  padding: 40px;
`;

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 800;
  color: #1e1b4b;
  margin-bottom: 28px;
`;

const Filters = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const FilterChip = styled.button<{ $active?: boolean }>`
  padding: 8px 16px;
  border-radius: 20px;
  border: 2px solid ${p => p.$active ? '#7c3aed' : '#e5e7eb'};
  background: ${p => p.$active ? '#7c3aed' : '#fff'};
  color: ${p => p.$active ? '#fff' : '#6b7280'};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  &:hover { border-color: #7c3aed; }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
`;

const Th = styled.th`
  text-align: left;
  padding: 14px 20px;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: #f9fafb;
  border-bottom: 1px solid #f3f4f6;
`;

const Td = styled.td`
  padding: 16px 20px;
  font-size: 14px;
  color: #374151;
  border-bottom: 1px solid #f9fafb;
  vertical-align: top;
`;

const Tr = styled.tr`
  &:hover td { background: #f9fafb; }
  &:last-child td { border-bottom: none; }
`;

const StatusBadge = styled.span<{ $status: string }>`
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  background: ${p => STATUS_COLORS[p.$status]?.bg || '#f3f4f6'};
  color: ${p => STATUS_COLORS[p.$status]?.text || '#6b7280'};
`;

const JobName = styled.div`
  font-weight: 600;
  color: #1d1d1f;
  font-size: 14px;
`;

const CompanyName = styled.div`
  font-size: 12px;
  color: #9ca3af;
  margin-top: 2px;
`;

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  APPLIED: { bg: '#dbeafe', text: '#1e40af' },
  SCREENING: { bg: '#fef3c7', text: '#92400e' },
  INTERVIEW: { bg: '#ede9fe', text: '#5b21b6' },
  OFFER: { bg: '#d1fae5', text: '#065f46' },
  HIRED: { bg: '#d1fae5', text: '#065f46' },
  REJECTED: { bg: '#fee2e2', text: '#991b1b' },
};

const STATUS_LABELS: Record<string, string> = {
  '': 'Все',
  APPLIED: 'Отклик',
  SCREENING: 'Скрининг',
  INTERVIEW: 'Интервью',
  OFFER: 'Оффер',
  HIRED: 'Принят',
  REJECTED: 'Отказ',
};

const TotalBadge = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: #9ca3af;
  margin-left: 8px;
`;

export const AdminApplications: React.FC = () => {
  const [status, setStatus] = useState('');

  const { data } = useQuery({
    queryKey: ['admin-applications', status],
    queryFn: () => adminApi.getApplications({ status: status || undefined, limit: 100 }),
  });

  const applications = data?.data?.applications || [];
  const total = data?.data?.total || 0;

  return (
    <Page>
      <PageTitle>
        Заявки
        <TotalBadge>({total})</TotalBadge>
      </PageTitle>

      <Filters>
        {Object.entries(STATUS_LABELS).map(([val, label]) => (
          <FilterChip key={val} $active={status === val} onClick={() => setStatus(val)}>
            {label}
          </FilterChip>
        ))}
      </Filters>

      <Table>
        <thead>
          <tr>
            <Th>#</Th>
            <Th>Кандидат</Th>
            <Th>Вакансия / Компания</Th>
            <Th>Статус</Th>
            <Th>Дата подачи</Th>
          </tr>
        </thead>
        <tbody>
          {applications.map(app => (
            <Tr key={app.id}>
              <Td>{app.id}</Td>
              <Td>
                {app.candidateProfile.firstName} {app.candidateProfile.lastName}
              </Td>
              <Td>
                <JobName>{app.job.title}</JobName>
                <CompanyName>{app.job.company.name}</CompanyName>
              </Td>
              <Td>
                <StatusBadge $status={app.status}>
                  {STATUS_LABELS[app.status] || app.status}
                </StatusBadge>
              </Td>
              <Td>{new Date(app.createdAt).toLocaleDateString('ru', { day: 'numeric', month: 'short', year: 'numeric' })}</Td>
            </Tr>
          ))}
          {applications.length === 0 && (
            <tr>
              <Td colSpan={5} style={{ textAlign: 'center', color: '#9ca3af', padding: 40 }}>
                Заявок не найдено
              </Td>
            </tr>
          )}
        </tbody>
      </Table>
    </Page>
  );
};
