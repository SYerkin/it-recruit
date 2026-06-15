import React, { useState } from 'react';
import styled from 'styled-components';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import { adminApi, MentorApplication } from '@shared/api';

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
`;

const Chip = styled.button<{ $active?: boolean }>`
  padding: 8px 16px;
  border-radius: 20px;
  border: 2px solid ${p => p.$active ? '#7c3aed' : '#e5e7eb'};
  background: ${p => p.$active ? '#7c3aed' : '#fff'};
  color: ${p => p.$active ? '#fff' : '#6b7280'};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const AppCard = styled.div`
  background: #fff;
  border-radius: 16px;
  border: 1px solid #f3f4f6;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  overflow: hidden;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  cursor: pointer;
  &:hover { background: #fafafa; }
`;

const ApplicantName = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #1d1d1f;
  margin-bottom: 2px;
`;

const ApplicantMeta = styled.p`
  font-size: 13px;
  color: #6b7280;
`;

const StatusBadge = styled.span<{ $status: string }>`
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  background: ${p => p.$status === 'APPROVED' ? '#d1fae5' : p.$status === 'REJECTED' ? '#fee2e2' : '#fef3c7'};
  color: ${p => p.$status === 'APPROVED' ? '#065f46' : p.$status === 'REJECTED' ? '#991b1b' : '#92400e'};
`;

const CardBody = styled.div`
  padding: 0 24px 24px;
  border-top: 1px solid #f3f4f6;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin: 16px 0;
`;

const InfoItem = styled.div``;

const InfoLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
`;

const InfoValue = styled.div`
  font-size: 14px;
  color: #374151;
`;

const TextBlock = styled.div`
  margin-bottom: 16px;
`;

const ActionRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 16px;
`;

const ApproveBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #10b981;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  &:hover { background: #059669; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const RejectBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #fee2e2;
  color: #ef4444;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  &:hover { background: #fecaca; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const CommentInput = styled.input`
  flex: 1;
  padding: 10px 14px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  &:focus { outline: none; border-color: #7c3aed; }
`;

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'На рассмотрении',
  APPROVED: 'Одобрено',
  REJECTED: 'Отклонено',
};

export const AdminMentorApplications: React.FC = () => {
  const qc = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [expanded, setExpanded] = useState<number | null>(null);
  const [comments, setComments] = useState<Record<number, string>>({});

  const { data } = useQuery({
    queryKey: ['admin-mentor-apps', statusFilter],
    queryFn: () => adminApi.getMentorApplications({ status: statusFilter || undefined }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status, adminComment }: { id: number; status: string; adminComment?: string }) =>
      adminApi.updateMentorApplication(id, { status, adminComment }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-mentor-apps'] }),
  });

  const applications = data?.data || [];

  return (
    <Page>
      <PageTitle>Заявки на менторство ({applications.length})</PageTitle>

      <Filters>
        {['PENDING', 'APPROVED', 'REJECTED', ''].map(s => (
          <Chip key={s} $active={statusFilter === s} onClick={() => setStatusFilter(s)}>
            {s ? STATUS_LABELS[s] : 'Все'}
          </Chip>
        ))}
      </Filters>

      <List>
        {applications.map(app => (
          <AppCard key={app.id}>
            <CardHeader onClick={() => setExpanded(expanded === app.id ? null : app.id)}>
              <div>
                <ApplicantName>{app.name}</ApplicantName>
                <ApplicantMeta>{app.currentTitle} · {app.experienceYears} лет опыта · {app.email}</ApplicantMeta>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <StatusBadge $status={app.status}>{STATUS_LABELS[app.status]}</StatusBadge>
                {expanded === app.id ? <ChevronUp size={18} color="#9ca3af" /> : <ChevronDown size={18} color="#9ca3af" />}
              </div>
            </CardHeader>

            {expanded === app.id && (
              <CardBody>
                <InfoGrid>
                  <InfoItem>
                    <InfoLabel>Навыки</InfoLabel>
                    <InfoValue>{app.skills}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Опыт</InfoLabel>
                    <InfoValue>{app.experienceYears} лет</InfoValue>
                  </InfoItem>
                </InfoGrid>

                <TextBlock>
                  <InfoLabel>О себе</InfoLabel>
                  <InfoValue style={{ marginTop: 6, lineHeight: 1.6 }}>{app.bio}</InfoValue>
                </TextBlock>
                <TextBlock>
                  <InfoLabel>Почему хочу стать ментором</InfoLabel>
                  <InfoValue style={{ marginTop: 6, lineHeight: 1.6 }}>{app.motivation}</InfoValue>
                </TextBlock>

                {app.status === 'PENDING' && (
                  <ActionRow>
                    <CommentInput
                      placeholder="Комментарий (необязательно)..."
                      value={comments[app.id] || ''}
                      onChange={e => setComments({ ...comments, [app.id]: e.target.value })}
                    />
                    <ApproveBtn
                      disabled={updateMutation.isPending}
                      onClick={() => updateMutation.mutate({ id: app.id, status: 'APPROVED', adminComment: comments[app.id] })}
                    >
                      <Check size={16} /> Одобрить
                    </ApproveBtn>
                    <RejectBtn
                      disabled={updateMutation.isPending}
                      onClick={() => updateMutation.mutate({ id: app.id, status: 'REJECTED', adminComment: comments[app.id] })}
                    >
                      <X size={16} /> Отклонить
                    </RejectBtn>
                  </ActionRow>
                )}

                {app.adminComment && (
                  <div style={{ marginTop: 12, padding: '10px 14px', background: '#f9fafb', borderRadius: 10, fontSize: 13, color: '#6b7280' }}>
                    Комментарий: {app.adminComment}
                  </div>
                )}
              </CardBody>
            )}
          </AppCard>
        ))}
        {applications.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60, color: '#9ca3af', fontSize: 15 }}>
            Заявок нет
          </div>
        )}
      </List>
    </Page>
  );
};
