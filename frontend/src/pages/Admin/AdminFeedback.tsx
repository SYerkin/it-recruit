import React, { useState } from 'react';
import styled from 'styled-components';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle, MessageSquare, Bug, Lightbulb } from 'lucide-react';
import { adminApi, FeedbackMessage } from '@shared/api';

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

const FeedbackCard = styled.div<{ $read: boolean }>`
  background: ${p => p.$read ? '#fff' : '#f5f3ff'};
  border: 1px solid ${p => p.$read ? '#f3f4f6' : '#ddd6fe'};
  border-radius: 16px;
  padding: 20px 24px;
  display: flex;
  gap: 16px;
  align-items: flex-start;
`;

const TypeIcon = styled.div<{ $type: string }>`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${p => p.$type === 'BUG_REPORT' ? '#fee2e2' : p.$type === 'SUGGESTION' ? '#dbeafe' : '#f5f3ff'};
  color: ${p => p.$type === 'BUG_REPORT' ? '#ef4444' : p.$type === 'SUGGESTION' ? '#3b82f6' : '#7c3aed'};
`;

const Content = styled.div`
  flex: 1;
`;

const FeedbackHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
`;

const SenderInfo = styled.div``;

const SenderName = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: #1d1d1f;
`;

const SenderEmail = styled.span`
  font-size: 13px;
  color: #9ca3af;
  margin-left: 8px;
`;

const FeedbackDate = styled.span`
  font-size: 12px;
  color: #9ca3af;
`;

const TypeBadge = styled.span<{ $type: string }>`
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  background: ${p => p.$type === 'BUG_REPORT' ? '#fee2e2' : p.$type === 'SUGGESTION' ? '#dbeafe' : '#f5f3ff'};
  color: ${p => p.$type === 'BUG_REPORT' ? '#ef4444' : p.$type === 'SUGGESTION' ? '#3b82f6' : '#7c3aed'};
  margin-left: 8px;
`;

const Message = styled.p`
  font-size: 14px;
  color: #374151;
  line-height: 1.6;
`;

const ReadBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 12px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: #fff;
  font-size: 12px;
  color: #6b7280;
  cursor: pointer;
  white-space: nowrap;
  &:hover { background: #f5f3ff; color: #7c3aed; border-color: #7c3aed; }
`;

const TYPE_LABELS: Record<string, string> = {
  SUGGESTION: 'Предложение',
  BUG_REPORT: 'Баг',
  GENERAL: 'Общее',
};

const TYPE_ICONS: Record<string, React.ReactNode> = {
  SUGGESTION: <Lightbulb size={18} />,
  BUG_REPORT: <Bug size={18} />,
  GENERAL: <MessageSquare size={18} />,
};

export const AdminFeedback: React.FC = () => {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const { data } = useQuery({
    queryKey: ['admin-feedback', filter],
    queryFn: () => adminApi.getFeedback(filter === 'unread' ? { isRead: false } : undefined),
  });

  const markRead = useMutation({
    mutationFn: (id: number) => adminApi.markFeedbackRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-feedback'] }),
  });

  const messages = data?.data || [];

  return (
    <Page>
      <PageTitle>Обратная связь ({messages.length})</PageTitle>

      <Filters>
        <Chip $active={filter === 'all'} onClick={() => setFilter('all')}>Все</Chip>
        <Chip $active={filter === 'unread'} onClick={() => setFilter('unread')}>Непрочитанные</Chip>
      </Filters>

      <List>
        {messages.map(m => (
          <FeedbackCard key={m.id} $read={m.isRead}>
            <TypeIcon $type={m.type}>{TYPE_ICONS[m.type] || <MessageSquare size={18} />}</TypeIcon>
            <Content>
              <FeedbackHeader>
                <SenderInfo>
                  <SenderName>{m.name}</SenderName>
                  <SenderEmail>{m.email}</SenderEmail>
                  <TypeBadge $type={m.type}>{TYPE_LABELS[m.type] || m.type}</TypeBadge>
                </SenderInfo>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <FeedbackDate>{new Date(m.createdAt).toLocaleDateString('ru', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</FeedbackDate>
                  {!m.isRead && (
                    <ReadBtn onClick={() => markRead.mutate(m.id)}>
                      <CheckCircle size={13} />Прочитано
                    </ReadBtn>
                  )}
                </div>
              </FeedbackHeader>
              <Message>{m.message}</Message>
            </Content>
          </FeedbackCard>
        ))}
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60, color: '#9ca3af' }}>
            <MessageSquare size={40} style={{ marginBottom: 12 }} />
            <p>Нет сообщений</p>
          </div>
        )}
      </List>
    </Page>
  );
};
