import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { applicationApi, type ApplicationFeedback } from '@shared/api';
import { useAuthStore } from '@app/store/auth.store';
import { 
  CheckCircle, 
  Clock, 
  Calendar,
  ArrowLeft,
  MessageSquare,
  Star,
  Send,
  Paperclip,
  FileText,
  ExternalLink
} from 'lucide-react';
import { Button } from '@shared/ui/Button';

// --- TYPES ---
type Stage = 'APPLIED' | 'SCREENING' | 'INTERVIEW' | 'OFFER' | 'HIRED' | 'REJECTED';

interface TimelineStep {
  id: Stage;
  title: string;
  description: string;
  date?: string;
}

const FEEDBACK_CRITERIA: { key: string; label: string }[] = [
  { key: 'communication', label: 'Общение' },
  { key: 'speed', label: 'Скорость ответа' },
  { key: 'transparency', label: 'Прозрачность процесса' },
  { key: 'professionalism', label: 'Профессионализм' },
];

function averageCriteriaRating(criteriaRatings: Record<string, number> | null | undefined): number | null {
  if (!criteriaRatings || Object.keys(criteriaRatings).length === 0) return null;
  const values = Object.values(criteriaRatings).filter((v) => v >= 1 && v <= 10);
  if (values.length === 0) return null;
  return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10;
}

function displayRating(f: { rating: number; criteriaRatings?: Record<string, number> | null }): number {
  const avg = averageCriteriaRating(f.criteriaRatings ?? null);
  if (avg != null) return Math.round(avg);
  return f.rating;
}

const TIMELINE_STEPS: TimelineStep[] = [
  { 
    id: 'APPLIED', 
    title: 'Принято приглашение', 
    description: 'Вы приняли приглашение от работодателя. Ваше резюме отправлено в HR-отдел для рассмотрения.' 
  },
  { 
    id: 'SCREENING', 
    title: 'HR Скриннинг', 
    description: 'Рекрутер просматривает ваш профиль и резюме. Проверка соответствия требованиям вакансии.' 
  },
  { 
    id: 'INTERVIEW', 
    title: 'Техническое интервью', 
    description: 'Встреча с командой для оценки технических навыков и культурного соответствия. Ожидайте фидбек в течение 2-3 дней.' 
  },
  { 
    id: 'OFFER', 
    title: 'Предложение о работе', 
    description: 'Мы готовим для вас оффер с деталями условий работы, зарплаты и бенефитов.' 
  },
  { 
    id: 'HIRED', 
    title: 'Принят в работу', 
    description: 'Поздравляем! Вы приняты в команду. Ожидайте дальнейших инструкций от HR.' 
  },
];

// --- STYLED COMPONENTS ---
const PageContainer = styled.div`
  min-height: 100vh;
  background: #fff;
  padding: 24px;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;

  @media (min-width: 768px) {
    padding: 48px;
  }
`;

const ContentWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 32px;
  color: #6b7280;
  font-size: 15px;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #1d1d1f;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 48px;
`;

const LogoContainer = styled.div`
  display: inline-block;
  padding: 12px;
  background: #f3f4f6;
  border-radius: 16px;
  margin-bottom: 16px;
`;

const Logo = styled.div`
  width: 32px;
  height: 32px;
  background: #dc2626;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 18px;
`;

const JobTitle = styled.h2`
  font-size: 32px;
  font-weight: 700;
  color: #1d1d1f;
  margin-bottom: 8px;
`;

const JobSubtitle = styled.p`
  color: #6b7280;
  font-size: 16px;
`;

const TimelineCard = styled.div`
  background: #fff;
  border: 1px solid #e5e7eb;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border-radius: 24px;
  padding: 48px 32px;
  position: relative;
  overflow: hidden;

  @media (min-width: 768px) {
    padding: 48px;
  }
`;

const TimelineLine = styled.div`
  position: absolute;
  top: 48px;
  left: 39px;
  bottom: 48px;
  width: 2px;
  background: #e5e7eb;
  z-index: 0;
`;

const TimelineSteps = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
  position: relative;
  z-index: 10;
`;

const TimelineItem = styled.div<{ $isPending: boolean }>`
  display: flex;
  gap: 24px;
  position: relative;
  opacity: ${({ $isPending }) => $isPending ? 0.4 : 1};
  filter: ${({ $isPending }) => $isPending ? 'blur(0.5px)' : 'none'};
  transition: all 0.3s;
`;

const StatusIndicator = styled.div<{ $isCompleted: boolean; $isCurrent: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid;
  flex-shrink: 0;
  transition: all 0.5s;
  position: relative;
  z-index: 10;

  ${({ $isCompleted, $isCurrent }) => {
    if ($isCompleted) {
      return `
        background: #16a34a;
        border-color: #dcfce7;
        color: #fff;
      `;
    }
    if ($isCurrent) {
      return `
        background: #2563eb;
        border-color: #dbeafe;
        color: #fff;
        transform: scale(1.1);
        box-shadow: 0 0 0 8px rgba(37, 99, 235, 0.1);
      `;
    }
    return `
      background: #fff;
      border-color: #e5e7eb;
      color: #d1d5db;
    `;
  }}
`;

const TimelineContent = styled.div`
  flex: 1;
  padding-top: 4px;
`;

const StepHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
`;

const StepTitle = styled.h3<{ $isCurrent: boolean }>`
  font-weight: 700;
  font-size: 18px;
  color: ${({ $isCurrent }) => $isCurrent ? '#2563eb' : '#1d1d1f'};
`;

const StepDate = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #9ca3af;
  background: #f9fafb;
  padding: 4px 12px;
  border-radius: 999px;
`;

const StepDescription = styled.p`
  font-size: 14px;
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 16px;
`;

const ActionBlock = styled(motion.div)`
  background: #eff6ff;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #bfdbfe;
  margin-top: 16px;
`;

const ActionTitle = styled.h4`
  font-weight: 700;
  font-size: 14px;
  color: #1e40af;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ActionText = styled.p`
  font-size: 14px;
  color: #1e40af;
  margin-bottom: 12px;
  line-height: 1.6;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const ActionButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s;

  ${({ $variant }) => {
    if ($variant === 'primary') {
      return `
        background: #2563eb;
        color: #fff;

        &:hover {
          background: #1d4ed8;
        }
      `;
    }
    return `
      background: #fff;
      color: #2563eb;
      border: 1px solid #bfdbfe;

      &:hover {
        background: #eff6ff;
      }
    `;
  }}
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 80px 24px;
  color: #6b7280;
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 80px 24px;
`;

const ErrorTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #1d1d1f;
  margin-bottom: 16px;
`;

const FeedbackCard = styled(motion.div)`
  margin-top: 32px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
`;

const FeedbackTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #1d1d1f;
  margin-bottom: 8px;
`;

const FeedbackSubtitle = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 20px;
  line-height: 1.5;
`;

const StarRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

const StarButton = styled.button<{ $filled: boolean }>`
  padding: 4px;
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ $filled }) => ($filled ? '#f59e0b' : '#d1d5db')};
  transition: color 0.2s;

  &:hover {
    color: #f59e0b;
  }
`;

const FeedbackTextarea = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  margin-bottom: 16px;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
  }
`;

const FeedbackSubmitBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: #1d4ed8;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const MyFeedbackSummary = styled.div`
  padding: 16px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 12px;
  margin-bottom: 12px;
`;

const MyFeedbackText = styled.p`
  font-size: 14px;
  color: #166534;
  margin: 0;
`;

const ChatCard = styled(motion.div)`
  margin-top: 32px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
`;

const ChatTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #1d1d1f;
  padding: 16px 20px;
  margin: 0;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MessagesList = styled.div`
  max-height: 320px;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const MessageBubble = styled.div<{ $isOwn: boolean }>`
  max-width: 85%;
  align-self: ${({ $isOwn }) => ($isOwn ? 'flex-end' : 'flex-start')};
  padding: 10px 14px;
  border-radius: 12px;
  background: ${({ $isOwn }) => ($isOwn ? '#2563eb' : '#f3f4f6')};
  color: ${({ $isOwn }) => ($isOwn ? '#fff' : '#1f2937')};
  font-size: 14px;
  line-height: 1.5;
`;

const MessageMeta = styled.div<{ $isOwn: boolean }>`
  font-size: 11px;
  color: ${({ $isOwn }) => ($isOwn ? 'rgba(255,255,255,0.8)' : '#6b7280')};
  margin-top: 4px;
  display: flex;
  gap: 8px;
  align-items: center;
`;

const ChatForm = styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid #e5e7eb;
  align-items: flex-end;
`;

const ChatInput = styled.input`
  flex: 1;
  min-width: 120px;
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  &:focus {
    outline: none;
    border-color: #2563eb;
  }
`;

const ChatFileLabel = styled.label`
  padding: 10px 12px;
  background: #f3f4f6;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #374151;
  &:hover {
    background: #e5e7eb;
  }
`;

const ChatSendBtn = styled.button`
  padding: 10px 18px;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  &:hover:not(:disabled) {
    background: #1d4ed8;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const FeedbackListCard = styled(motion.div)`
  margin-top: 24px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
`;

const FeedbackListTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #1d1d1f;
  margin: 0 0 8px 0;
`;

const AverageBadge = styled.span`
  display: inline-block;
  background: #fef3c7;
  color: #92400e;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 16px;
`;

const FeedbackListItem = styled.div`
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
  font-size: 14px;
  color: #4b5563;
  &:last-child {
    border-bottom: none;
  }
`;

const HRContactCard = styled(motion.div)`
  margin-top: 24px;
  padding: 20px;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 12px;
`;

const HRContactTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #0c4a6e;
  margin: 0 0 12px 0;
`;

const HRContactRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #075985;
  margin-bottom: 6px;
  a {
    color: #0369a1;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const HistoryCard = styled(motion.div)`
  margin-top: 24px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
`;

const HistoryTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #1d1d1f;
  margin: 0 0 10px 0;
`;

const HistoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #f3f4f6;
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const HistoryMeta = styled.div`
  font-size: 12px;
  color: #9ca3af;
`;

// --- COMPONENT ---
export const CandidateTimeline: React.FC = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [criteriaRatings, setCriteriaRatings] = useState<Record<string, number>>({});

  // Check if user is a candidate
  if (user?.role !== 'CANDIDATE') {
    return (
      <PageContainer>
        <ErrorState>
          <ErrorTitle>Доступ запрещен</ErrorTitle>
          <p style={{ color: '#6b7280', marginBottom: '16px' }}>
            Эта страница доступна только для кандидатов.
          </p>
          <Button variant="primary" onClick={() => navigate('/dashboard')} style={{ marginTop: '16px' }}>
            Вернуться в Dashboard
          </Button>
        </ErrorState>
      </PageContainer>
    );
  }

  const { data: applicationData, isLoading } = useQuery({
    queryKey: ['application', applicationId],
    queryFn: () => applicationApi.getApplicationById(Number(applicationId!)),
    enabled: !!applicationId && user?.role === 'CANDIDATE',
  });

  const application = applicationData?.data;
  const status = (application?.status || 'APPLIED') as Stage;
  const job = application?.job;
  const feedbacks = application?.feedbacks ?? [];
  const statusHistory = application?.statusHistory ?? [];
  const myFeedback = feedbacks.find((f: ApplicationFeedback) => f.authorId === user?.id);

  const criteriaValues = Object.values(criteriaRatings).filter((v) => v >= 1 && v <= 10);
  const effectiveRating =
    criteriaValues.length > 0
      ? Math.round(criteriaValues.reduce((a, b) => a + b, 0) / criteriaValues.length)
      : feedbackRating || myFeedback?.rating || 0;

  const submitFeedbackMutation = useMutation({
    mutationFn: (payload: { rating: number; criteriaRatings?: Record<string, number> | null; comment?: string | null }) =>
      applicationApi.submitFeedback(Number(applicationId!), payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['application', applicationId] });
    },
  });

  const canLeaveFeedback = (status === 'HIRED' || status === 'REJECTED') && !!applicationId;

  const [chatText, setChatText] = useState('');
  const [chatFile, setChatFile] = useState<{ name: string; base64: string } | null>(null);

  const { data: chatData } = useQuery({
    queryKey: ['chat', applicationId],
    queryFn: () => applicationApi.getChat(Number(applicationId!)),
    enabled: !!applicationId,
    refetchInterval: 3000,
  });

  const chatMessages = chatData?.data?.messages ?? [];

  const sendChatMutation = useMutation({
    mutationFn: (payload: { body?: string; attachment?: string; attachmentName?: string }) =>
      applicationApi.sendChatMessage(Number(applicationId!), payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat', applicationId] });
      setChatText('');
      setChatFile(null);
    },
  });

  useEffect(() => {
    if (!applicationId || !chatMessages.length || !user?.id) return;
    const lastFromOther = [...chatMessages].reverse().find((m) => m.authorId !== user.id);
    if (lastFromOther && !lastFromOther.readAt) {
      applicationApi.markChatRead(Number(applicationId), lastFromOther.id).then(() => {
        queryClient.invalidateQueries({ queryKey: ['chat', applicationId] });
      });
    }
  }, [applicationId, chatMessages, user?.id, queryClient]);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (sendChatMutation.isPending) return;
    if (!chatText.trim() && !chatFile) return;
    sendChatMutation.mutate({
      body: chatText.trim() || undefined,
      attachment: chatFile?.base64,
      attachmentName: chatFile?.name,
    });
  };

  const onChatFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      if (base64) setChatFile({ name: file.name, base64 });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const apiOrigin = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/api\/?$/, '');

  useEffect(() => {
    if (myFeedback) {
      setFeedbackRating(myFeedback.rating);
      setFeedbackComment(myFeedback.comment || '');
      setCriteriaRatings(myFeedback.criteriaRatings || {});
    }
  }, [myFeedback?.id, myFeedback?.rating, myFeedback?.comment, myFeedback?.criteriaRatings]);
  
  const hrEmail = job?.creator?.email;
  
  const handleWriteToHR = () => {
    if (hrEmail) {
      window.location.href = `mailto:${hrEmail}?subject=Вопрос по заявке #${application?.id} - ${job?.title}`;
    } else {
      alert('Контактная информация HR не найдена. Пожалуйста, свяжитесь с компанией через их официальный сайт.');
    }
  };

  // Verify that this application belongs to the current candidate
  // Note: We need to check this after application is loaded
  // The backend should also verify this, but we add client-side check for better UX

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const statusLabel = (value: string | null | undefined) => {
    const map: Record<string, string> = {
      APPLIED: 'Отклик создан',
      SCREENING: 'На скрининге',
      INTERVIEW: 'Интервью',
      OFFER: 'Оффер',
      HIRED: 'Принят',
      REJECTED: 'Отклонен',
    };
    if (!value) return '—';
    return map[value] || value;
  };

  // Real dates from status history
  const getStageDate = (stageId: Stage) => {
    const historyItem = statusHistory.find((item) => item.toStatus === stageId);
    if (!historyItem) return undefined;
    return formatDate(historyItem.createdAt);
  };

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingState>Загрузка информации о заявке...</LoadingState>
      </PageContainer>
    );
  }

  if (!application) {
    return (
      <PageContainer>
        <ErrorState>
          <ErrorTitle>Заявка не найдена</ErrorTitle>
          <Button variant="primary" onClick={() => navigate('/dashboard')} style={{ marginTop: '16px' }}>
            Вернуться в Dashboard
          </Button>
        </ErrorState>
      </PageContainer>
    );
  }

  // Verify that this application belongs to the current candidate
  // Backend should handle this, but we add client-side check for better UX
  if (application.candidateProfile?.user?.id && application.candidateProfile.user.id !== user?.id) {
    return (
      <PageContainer>
        <ErrorState>
          <ErrorTitle>Доступ запрещен</ErrorTitle>
          <p style={{ color: '#6b7280', marginBottom: '16px' }}>
            Вы не имеете доступа к этой заявке.
          </p>
          <Button variant="primary" onClick={() => navigate('/dashboard')} style={{ marginTop: '16px' }}>
            Вернуться в Dashboard
          </Button>
        </ErrorState>
      </PageContainer>
    );
  }

  // Find current step index, handling HIRED and REJECTED
  const getCurrentStepIndex = () => {
    if (status === 'REJECTED') {
      return -1; // Special case for rejected
    }
    if (status === 'HIRED') {
      return TIMELINE_STEPS.length - 1; // Last step (HIRED)
    }
    const index = TIMELINE_STEPS.findIndex(step => step.id === status);
    return index >= 0 ? index : 0;
  };

  const currentStepIndex = getCurrentStepIndex();
  const companyInitials = job?.company?.name?.charAt(0).toUpperCase() || 'C';

  return (
    <PageContainer>
      <ContentWrapper>
        <BackButton onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={18} />
          Назад
        </BackButton>

        <Header>
          <LogoContainer>
            <Logo>{companyInitials}</Logo>
          </LogoContainer>
          <JobTitle>{job?.title || 'Вакансия'}</JobTitle>
          <JobSubtitle>Ваш прогресс по заявке #{application.id}</JobSubtitle>
        </Header>

        {job?.creator && (
          <HRContactCard initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <HRContactTitle>Контакт HR по этой заявке</HRContactTitle>
            {job.company?.name && (
              <HRContactRow>
                <strong>Компания:</strong> {job.company.name}
              </HRContactRow>
            )}
            <HRContactRow>
              <strong>Email:</strong>{' '}
              <a href={`mailto:${job.creator.email}`}>{job.creator.email}</a>
            </HRContactRow>
            {job.creator.telegramUsername && (
              <HRContactRow>
                <strong>Telegram:</strong>{' '}
                <a href={`https://t.me/${job.creator.telegramUsername.replace(/^@/, '')}`} target="_blank" rel="noopener noreferrer">
                  @{job.creator.telegramUsername.replace(/^@/, '')}
                </a>
              </HRContactRow>
            )}
          </HRContactCard>
        )}

        <TimelineCard>
          <TimelineLine />
          <TimelineSteps>
            {TIMELINE_STEPS.map((step, index) => {
              const isCompleted = index < currentStepIndex || (status === 'HIRED' && index === TIMELINE_STEPS.length - 1);
              const isCurrent = index === currentStepIndex && status !== 'REJECTED';
              const isPending = index > currentStepIndex && status !== 'REJECTED';
              const stepDate = getStageDate(step.id);

              return (
                <TimelineItem key={step.id} $isPending={isPending}>
                  <StatusIndicator $isCompleted={isCompleted} $isCurrent={isCurrent}>
                    {isCompleted ? (
                      <CheckCircle size={20} />
                    ) : isCurrent ? (
                      <Clock size={20} />
                    ) : (
                      <div style={{ width: '8px', height: '8px', background: '#d1d5db', borderRadius: '50%' }} />
                    )}
                  </StatusIndicator>

                  <TimelineContent>
                    <StepHeader>
                      <StepTitle $isCurrent={isCurrent}>{step.title}</StepTitle>
                      {stepDate && <StepDate>{stepDate}</StepDate>}
                    </StepHeader>
                    <StepDescription>{step.description}</StepDescription>

                    {isCurrent && (
                      <ActionBlock
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3 }}
                      >
                        <ActionTitle>
                          <Calendar size={14} />
                          Следующий шаг:
                        </ActionTitle>
                        <ActionText>
                          {status === 'INTERVIEW' 
                            ? 'Вам необходимо подготовиться к техническому интервью. Детали отправлены на вашу почту.'
                            : status === 'SCREENING'
                            ? 'Рекрутер свяжется с вами в ближайшее время. Проверьте почту и телефон.'
                            : 'Ожидайте обновления статуса.'}
                        </ActionText>
                        <ActionButtons>
                          {status === 'INTERVIEW' && (
                            <>
                              <ActionButton $variant="primary">
                                Подтвердить встречу
                              </ActionButton>
                              <ActionButton $variant="secondary">
                                Перенести
                              </ActionButton>
                            </>
                          )}
                          <ActionButton $variant="secondary" onClick={handleWriteToHR}>
                            <MessageSquare size={14} style={{ marginRight: '6px' }} />
                            Написать HR
                          </ActionButton>
                          {job?.creator?.telegramUsername && (
                            <ActionButton
                              $variant="secondary"
                              as="a"
                              href={`https://t.me/${job.creator.telegramUsername.replace(/^@/, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ textDecoration: 'none', color: 'inherit' }}
                            >
                              <ExternalLink size={14} style={{ marginRight: '6px' }} />
                              Telegram
                            </ActionButton>
                          )}
                        </ActionButtons>
                      </ActionBlock>
                    )}

                    {status === 'HIRED' && step.id === 'HIRED' && (
                      <ActionBlock
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        style={{ background: '#dcfce7', borderColor: '#86efac' }}
                      >
                        <ActionTitle style={{ color: '#15803d' }}>
                          🎉 Поздравляем! Вы приняты в команду!
                        </ActionTitle>
                        <ActionText style={{ color: '#166534' }}>
                          HR свяжется с вами в ближайшее время для обсуждения деталей оформления и первого рабочего дня.
                        </ActionText>
                      </ActionBlock>
                    )}

                    {status === 'REJECTED' && index === TIMELINE_STEPS.length - 1 && (
                      <ActionBlock
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        style={{ background: '#fef2f2', borderColor: '#fecaca' }}
                      >
                        <ActionTitle style={{ color: '#dc2626' }}>
                          Заявка отклонена
                        </ActionTitle>
                        <ActionText style={{ color: '#991b1b' }}>
                          К сожалению, на данный момент мы не можем предложить вам эту позицию. 
                          Вы можете подать заявку на другие вакансии.
                        </ActionText>
                        <ActionButtons>
                          <ActionButton 
                            $variant="primary" 
                            onClick={() => navigate('/jobs')}
                            style={{ background: '#dc2626' }}
                          >
                            Смотреть другие вакансии
                          </ActionButton>
                        </ActionButtons>
                      </ActionBlock>
                    )}
                  </TimelineContent>
                </TimelineItem>
              );
            })}
          </TimelineSteps>
        </TimelineCard>

        <HistoryCard initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <HistoryTitle>История отклика</HistoryTitle>
          {statusHistory.length === 0 ? (
            <div style={{ color: '#9ca3af', fontSize: 14 }}>История пока недоступна.</div>
          ) : (
            [...statusHistory].reverse().map((item) => (
              <HistoryItem key={item.id}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#1d1d1f' }}>
                    {statusLabel(item.fromStatus)} → {statusLabel(item.toStatus)}
                  </div>
                  {item.note && <div style={{ fontSize: 13, color: '#6b7280' }}>{item.note}</div>}
                  {item.changedBy?.email && (
                    <HistoryMeta>
                      Изменил: {item.changedBy.email} ({item.changedByRole || item.changedBy.role})
                    </HistoryMeta>
                  )}
                </div>
                <HistoryMeta>{formatDate(item.createdAt)}</HistoryMeta>
              </HistoryItem>
            ))
          )}
        </HistoryCard>

        <ChatCard initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <ChatTitle>
            <MessageSquare size={20} />
            Чат с HR
          </ChatTitle>
          <MessagesList>
            {chatMessages.length === 0 && (
              <div style={{ color: '#9ca3af', fontSize: 14, textAlign: 'center', padding: 24 }}>
                Пока нет сообщений. Напишите HR или прикрепите файл.
              </div>
            )}
            {chatMessages.map((msg) => {
              const isOwn = msg.authorId === user?.id;
              return (
                <MessageBubble key={msg.id} $isOwn={isOwn}>
                  {msg.body && <div>{msg.body}</div>}
                  {msg.attachmentUrl && (
                    <a
                      href={`${apiOrigin}${msg.attachmentUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'inherit', textDecoration: 'underline', display: 'flex', alignItems: 'center', gap: 6, marginTop: msg.body ? 6 : 0 }}
                    >
                      <FileText size={14} />
                      {msg.attachmentName || 'Файл'}
                    </a>
                  )}
                  <MessageMeta $isOwn={isOwn}>
                    <span>{formatDate(msg.createdAt)}</span>
                    {!isOwn && msg.readAt && <span>✓ Прочитано</span>}
                  </MessageMeta>
                </MessageBubble>
              );
            })}
          </MessagesList>
          <ChatForm onSubmit={handleSendChat}>
            <ChatInput
              type="text"
              placeholder="Сообщение..."
              value={chatText}
              onChange={(e) => setChatText(e.target.value)}
            />
            <ChatFileLabel>
              <Paperclip size={16} />
              <span>Файл</span>
              <input type="file" hidden accept="*" onChange={onChatFileChange} />
            </ChatFileLabel>
            {chatFile && <span style={{ fontSize: 12, color: '#6b7280' }}>{chatFile.name}</span>}
            <ChatSendBtn type="submit" disabled={sendChatMutation.isPending || (!chatText.trim() && !chatFile)}>
              <Send size={16} />
              Отправить
            </ChatSendBtn>
          </ChatForm>
        </ChatCard>

        {canLeaveFeedback && feedbacks.length > 0 && (
          <FeedbackListCard initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <FeedbackListTitle>Отзывы о процессе</FeedbackListTitle>
            {application?.averageRating != null && (
              <>
                {feedbacks.length === 1 && feedbacks[0].authorId === user?.id ? (
                  <AverageBadge>Ваша оценка процесса: {displayRating(feedbacks[0])} из 10</AverageBadge>
                ) : (
                  <AverageBadge>
                    Средняя оценка: {application.averageRating} из 10 (на основе {feedbacks.length} отзывов)
                  </AverageBadge>
                )}
              </>
            )}
            {application?.averageRatingsByCriterion && Object.keys(application.averageRatingsByCriterion).length > 0 && feedbacks.length > 1 && (
              <div style={{ marginBottom: 12, fontSize: 13, color: '#6b7280' }}>
                {FEEDBACK_CRITERIA.filter((c) => application.averageRatingsByCriterion?.[c.key] != null)
                  .map((c) => `${c.label}: ${application.averageRatingsByCriterion?.[c.key]}`)
                  .join(', ')}
              </div>
            )}
            <div>
              {feedbacks.map((f) => {
                const isMyFeedback = f.authorId === user?.id;
                const label = isMyFeedback
                  ? 'Ваш отзыв о процессе найма'
                  : f.author?.role === 'HR'
                    ? 'Отзыв HR (о вас)'
                    : 'Отзыв кандидата';
                return (
                  <FeedbackListItem key={f.id}>
                    <strong>{label}</strong> — {displayRating(f)} из 10
                    {f.criteriaRatings && Object.keys(f.criteriaRatings).length > 0 && (
                      <span style={{ marginLeft: 8 }}>
                        ({FEEDBACK_CRITERIA.filter((c) => f.criteriaRatings?.[c.key]).map((c) => `${c.label}: ${f.criteriaRatings![c.key]}`).join(', ')})
                      </span>
                    )}
                    {f.comment && ` — «${f.comment}»`}
                  </FeedbackListItem>
                );
              })}
            </div>
          </FeedbackListCard>
        )}

        {canLeaveFeedback && (
          <FeedbackCard
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FeedbackTitle>Оцените процесс найма</FeedbackTitle>
            <FeedbackSubtitle>
              Шкала от 1 до 10. Укажите общую оценку и по критериям (по желанию), оставьте комментарий.
            </FeedbackSubtitle>

            {myFeedback && (
              <MyFeedbackSummary>
                <MyFeedbackText>
                  Ваш отзыв: {displayRating(myFeedback)} из 10
                  {myFeedback.criteriaRatings && Object.keys(myFeedback.criteriaRatings).length > 0 && ` (${FEEDBACK_CRITERIA.filter((c) => myFeedback.criteriaRatings?.[c.key]).map((c) => `${c.label}: ${myFeedback.criteriaRatings![c.key]}`).join(', ')})`}
                  {myFeedback.comment ? ` — «${myFeedback.comment}»` : ''}
                </MyFeedbackText>
              </MyFeedbackSummary>
            )}

            {FEEDBACK_CRITERIA.map((c) => (
              <div key={c.key} style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                <label style={{ minWidth: 140, fontSize: 14 }}>{c.label}</label>
                <select
                  value={criteriaRatings[c.key] ?? ''}
                  onChange={(e) => {
                    const next = { ...criteriaRatings, [c.key]: e.target.value ? Number(e.target.value) : 0 };
                    setCriteriaRatings(next);
                    const filled = Object.entries(next).filter(([, v]) => v >= 1 && v <= 10);
                    if (filled.length > 0) {
                      const avg = filled.reduce((s, [, v]) => s + v, 0) / filled.length;
                      setFeedbackRating(Math.round(avg));
                    }
                  }}
                  style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 14 }}
                >
                  <option value="">—</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
            ))}

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: 8, fontSize: 14 }}>
                Общая оценка (1–10){criteriaValues.length > 0 ? ' — считается по критериям выше' : ''}
              </label>
              <StarRow>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <StarButton
                    key={n}
                    type="button"
                    $filled={n <= effectiveRating}
                    onClick={() => setFeedbackRating(n)}
                    title={`${n}`}
                  >
                    <Star size={22} fill={n <= effectiveRating ? 'currentColor' : 'none'} />
                  </StarButton>
                ))}
              </StarRow>
            </div>

            <FeedbackTextarea
              placeholder="Комментарий (по желанию)"
              value={feedbackComment || (myFeedback?.comment ?? '') || ''}
              onChange={(e) => setFeedbackComment(e.target.value)}
              maxLength={2000}
            />
            <FeedbackSubmitBtn
              type="button"
              disabled={submitFeedbackMutation.isPending || effectiveRating < 1}
              onClick={() => {
                const criteria = Object.fromEntries(
                  Object.entries(criteriaRatings).filter(([, v]) => v >= 1 && v <= 10)
                ) as Record<string, number>;
                const rating =
                  criteriaValues.length > 0
                    ? Math.round(criteriaValues.reduce((a, b) => a + b, 0) / criteriaValues.length)
                    : feedbackRating || myFeedback?.rating || 0;
                if (rating < 1) return;
                submitFeedbackMutation.mutate({
                  rating,
                  criteriaRatings: Object.keys(criteria).length ? criteria : undefined,
                  comment: feedbackComment.trim() || (myFeedback?.comment ?? null) || null,
                });
              }}
            >
              {submitFeedbackMutation.isPending ? (
                'Отправка...'
              ) : (
                <>
                  <Send size={16} />
                  {myFeedback ? 'Обновить отзыв' : 'Отправить отзыв'}
                </>
              )}
            </FeedbackSubmitBtn>
          </FeedbackCard>
        )}
      </ContentWrapper>
    </PageContainer>
  );
};
