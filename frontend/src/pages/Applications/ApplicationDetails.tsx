import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import { ArrowLeft, Mail, Calendar, Briefcase, MapPin, User, FileText, Award, GraduationCap, MessageSquare, Send, Paperclip, Star } from 'lucide-react';
import { applicationApi } from '@shared/api';
import { useAuthStore } from '@app/store/auth.store';
import { Button } from '@shared/ui/Button';
import { Card } from '@shared/ui/Card';
import { Badge } from '@shared/ui/Badge';

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-2xl);
  @media (max-width: 640px) {
    align-items: flex-start;
    flex-direction: column;
    gap: 10px;
  }
`;

const BackButton = styled(Button)`
  flex-shrink: 0;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--color-text-primary);
  @media (max-width: 640px) {
    font-size: 24px;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
`;

const Section = styled(Card)`
  padding: var(--spacing-xl);
  @media (max-width: 640px) {
    padding: var(--spacing-md);
  }
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: var(--spacing-lg);
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  @media (max-width: 640px) {
    font-size: 20px;
  }
`;

const InfoRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  @media (max-width: 640px) {
    flex-direction: column;
    gap: 6px;
  }
`;

const InfoLabel = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-secondary);
  min-width: 150px;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  @media (max-width: 640px) {
    min-width: 0;
    font-size: 13px;
  }
`;

const InfoValue = styled.div`
  font-size: 15px;
  color: var(--color-text-primary);
  flex: 1;
`;

const StatusBadge = styled(Badge)<{ $status: string }>`
  background: ${({ $status }) => {
    if ($status === 'APPLIED') return 'rgba(0, 122, 255, 0.1)';
    if ($status === 'SCREENING') return 'rgba(255, 149, 0, 0.1)';
    if ($status === 'INTERVIEW') return 'rgba(88, 86, 214, 0.1)';
    if ($status === 'OFFER') return 'rgba(52, 199, 89, 0.1)';
    if ($status === 'REJECTED') return 'rgba(255, 59, 48, 0.1)';
    return 'rgba(142, 142, 147, 0.1)';
  }};
  color: ${({ $status }) => {
    if ($status === 'APPLIED') return '#007AFF';
    if ($status === 'SCREENING') return '#FF9500';
    if ($status === 'INTERVIEW') return '#5856D6';
    if ($status === 'OFFER') return '#34C759';
    if ($status === 'REJECTED') return '#FF3B30';
    return '#8E8E93';
  }};
`;

const CoverLetter = styled.div`
  padding: var(--spacing-lg);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  line-height: 1.6;
  white-space: pre-wrap;
`;

const SkillsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
`;

const ExperienceItem = styled.div`
  padding: var(--spacing-md);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-md);
`;

const ExperienceTitle = styled.div`
  font-size: 17px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
`;

const ExperienceMeta = styled.div`
  font-size: 14px;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-sm);
`;

const ExperienceDescription = styled.div`
  font-size: 15px;
  color: var(--color-text-primary);
  line-height: 1.6;
`;

const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    APPLIED: 'Отклик отправлен',
    SCREENING: 'На рассмотрении',
    INTERVIEW: 'Собеседование',
    OFFER: 'Предложение',
    HIRED: 'Принят в работу',
    REJECTED: 'Отклонено',
  };
  return labels[status] || status;
};

const ChatSection = styled(Section)`
  display: flex;
  flex-direction: column;
`;

const ChatTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MessagesList = styled.div`
  max-height: 280px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 12px;
`;

const MessageBubble = styled.div<{ $isOwn: boolean }>`
  max-width: 85%;
  align-self: ${({ $isOwn }) => ($isOwn ? 'flex-end' : 'flex-start')};
  padding: 10px 14px;
  border-radius: 12px;
  background: ${({ $isOwn }) => ($isOwn ? '#2563eb' : 'var(--color-bg-secondary)')};
  color: ${({ $isOwn }) => ($isOwn ? '#fff' : 'var(--color-text-primary)')};
  font-size: 14px;
  @media (max-width: 640px) {
    max-width: 100%;
  }
`;

const MessageMeta = styled.div<{ $isOwn: boolean }>`
  font-size: 11px;
  opacity: 0.85;
  margin-top: 4px;
`;

const ChatForm = styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: flex-end;
  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const ChatInput = styled.input`
  flex: 1;
  min-width: 120px;
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 14px;
  @media (max-width: 640px) {
    width: 100%;
  }
`;

const ChatFileLabel = styled.label`
  padding: 10px 12px;
  background: var(--color-bg-secondary);
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  @media (max-width: 640px) {
    width: 100%;
    justify-content: center;
  }
`;

const ChatSendBtn = styled.button`
  padding: 10px 18px;
  background: var(--color-primary, #2563eb);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  &:disabled {
    opacity: 0.6;
  }
  @media (max-width: 640px) {
    width: 100%;
    justify-content: center;
  }
`;

const FeedbackBlock = styled.div`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--color-border);
`;

const AverageBadge = styled.span`
  display: inline-block;
  background: #fef3c7;
  color: #92400e;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
`;

const FeedbackItem = styled.div`
  font-size: 14px;
  color: var(--color-text-secondary);
  padding: 6px 0;
`;

const FeedbackFormSection = styled(Card)`
  padding: var(--spacing-xl);
  border: 2px solid #fde68a;
  background: #fffbeb;
  @media (max-width: 640px) {
    padding: var(--spacing-md);
  }
`;

const StarRow = styled.div`
  display: flex;
  gap: 6px;
  margin: 8px 0 16px;
`;

const StarBtn = styled.button<{ $filled: boolean }>`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ $filled }) => ($filled ? '#f59e0b' : '#d1d5db')};
  padding: 2px;
  transition: color 0.15s;
  &:hover { color: #f59e0b; }
`;

const CriteriaGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const CriteriaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const CriteriaLabel = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-secondary);
`;

const CriteriaStars = styled.div`
  display: flex;
  gap: 3px;
`;

const FeedbackTextarea = styled.textarea`
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 14px;
  outline: none;
  resize: vertical;
  min-height: 80px;
  margin-bottom: 12px;
  &:focus { border-color: #7c3aed; }
`;

const FEEDBACK_CRITERIA = [
  { key: 'communication', label: 'Общение' },
  { key: 'professionalism', label: 'Профессионализм' },
  { key: 'speed', label: 'Скорость ответа' },
  { key: 'transparency', label: 'Прозрачность' },
];

const formatMessageDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

export const ApplicationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [chatText, setChatText] = useState('');
  const [chatFile, setChatFile] = useState<{ name: string; base64: string } | null>(null);
  const [fbRating, setFbRating] = useState(0);
  const [fbCriteria, setFbCriteria] = useState<Record<string, number>>({});
  const [fbComment, setFbComment] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['application', id],
    queryFn: () => applicationApi.getApplicationById(Number(id!)),
    enabled: !!id,
  });

  const { data: chatData } = useQuery({
    queryKey: ['chat', id],
    queryFn: () => applicationApi.getChat(Number(id!)),
    enabled: !!id,
    refetchInterval: 3000,
  });

  const application = data?.data;
  const chatMessages = chatData?.data?.messages ?? [];
  const hasCurrentUserFeedback = !!application?.feedbacks?.find((f: any) => f.authorId === user?.id);
  const canLeaveFeedback =
    !!user &&
    (application?.status === 'HIRED' || application?.status === 'REJECTED') &&
    ['HR', 'ADMIN', 'CANDIDATE'].includes(user.role) &&
    !hasCurrentUserFeedback;
  const feedbackFormTitle = user?.role === 'CANDIDATE' ? 'Оцените HR и процесс' : 'Оцените взаимодействие';

  const sendChatMutation = useMutation({
    mutationFn: (payload: { body?: string; attachment?: string; attachmentName?: string }) =>
      applicationApi.sendChatMessage(Number(id!), payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat', id] });
      setChatText('');
      setChatFile(null);
    },
  });

  const submitFeedbackMutation = useMutation({
    mutationFn: () => applicationApi.submitFeedback(Number(id!), {
      rating: fbRating,
      criteriaRatings: Object.keys(fbCriteria).length > 0 ? fbCriteria : null,
      comment: fbComment.trim() || null,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['application', id] });
      setFbRating(0);
      setFbCriteria({});
      setFbComment('');
    },
  });

  useEffect(() => {
    if (!id || !chatMessages.length || !user?.id) return;
    const lastFromOther = [...chatMessages].reverse().find((m) => m.authorId !== user.id);
    if (lastFromOther && !lastFromOther.readAt) {
      applicationApi.markChatRead(Number(id), lastFromOther.id).then(() => {
        queryClient.invalidateQueries({ queryKey: ['chat', id] });
      });
    }
  }, [id, chatMessages, user?.id, queryClient]);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
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

  if (isLoading) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: 'var(--spacing-4xl)' }}>Загрузка...</div>
      </Container>
    );
  }

  if (error || !application) {
    return (
      <Container>
        <Header>
          <BackButton variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
            Назад
          </BackButton>
          <Title>Ошибка загрузки</Title>
        </Header>
        <div style={{ padding: 'var(--spacing-xl)', textAlign: 'center', background: '#fff', borderRadius: 12, border: '1px solid var(--color-border)' }}>
          <p>Не удалось загрузить отклик</p>
        </div>
      </Container>
    );
  }

  if (!application.job) {
    return (
      <Container>
        <Header>
          <BackButton variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
            Назад
          </BackButton>
          <Title>Ошибка данных</Title>
        </Header>
      </Container>
    );
  }
  const job = application.job;

  return (
    <Container>
      <Header>
        <BackButton variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          Назад
        </BackButton>
        <Title>Детали отклика</Title>
      </Header>

      <Content>
        {/* Информация о вакансии */}
        <Section>
          <SectionTitle>
            <Briefcase size={24} />
            Вакансия
          </SectionTitle>
          <InfoRow>
            <InfoLabel>Название</InfoLabel>
            <InfoValue>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/jobs/${job.id}`)}
                style={{ padding: 0, height: 'auto', textDecoration: 'underline' }}
              >
                {job.title}
              </Button>
            </InfoValue>
          </InfoRow>
          {job.company && (
            <InfoRow>
              <InfoLabel>Компания</InfoLabel>
              <InfoValue>{job.company.name}</InfoValue>
            </InfoRow>
          )}
          {job.company?.address && (
            <InfoRow>
              <InfoLabel>
                <MapPin size={16} />
                Адрес
              </InfoLabel>
              <InfoValue>{job.company.address}</InfoValue>
            </InfoRow>
          )}
        </Section>

        {/* Информация о кандидате */}
        {application.candidateProfile && (
          <Section>
            <SectionTitle>
              <User size={24} />
              Кандидат
            </SectionTitle>
            <InfoRow>
              <InfoLabel>Имя</InfoLabel>
              <InfoValue>
                {application.candidateProfile.firstName} {application.candidateProfile.lastName}
              </InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>
                <Mail size={16} />
                Email
              </InfoLabel>
              <InfoValue>{application.candidateProfile.user.email}</InfoValue>
            </InfoRow>
            {application.candidateProfile.user.telegramUsername && (
              <InfoRow>
                <InfoLabel>Telegram</InfoLabel>
                <InfoValue>
                  <a
                    href={`https://t.me/${application.candidateProfile.user.telegramUsername.replace(/^@/, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'var(--color-primary, #2563eb)' }}
                  >
                    @{application.candidateProfile.user.telegramUsername.replace(/^@/, '')}
                  </a>
                </InfoValue>
              </InfoRow>
            )}
            {application.candidateProfile.headline && (
              <InfoRow>
                <InfoLabel>Заголовок</InfoLabel>
                <InfoValue>{application.candidateProfile.headline}</InfoValue>
              </InfoRow>
            )}
            {application.candidateProfile.skills && application.candidateProfile.skills.length > 0 && (
              <InfoRow>
                <InfoLabel>Навыки</InfoLabel>
                <InfoValue>
                  <SkillsContainer>
                    {application.candidateProfile.skills.map((skillItem: any) => (
                      <Badge key={skillItem.skill.id} variant="default" size="sm">
                        {skillItem.skill.name}
                      </Badge>
                    ))}
                  </SkillsContainer>
                </InfoValue>
              </InfoRow>
            )}
          </Section>
        )}

        {/* Опыт работы */}
        {application.candidateProfile?.workExperiences && application.candidateProfile.workExperiences.length > 0 && (
          <Section>
            <SectionTitle>
              <Briefcase size={24} />
              Опыт работы
            </SectionTitle>
            {application.candidateProfile.workExperiences.map((exp: any) => (
              <ExperienceItem key={exp.id}>
                <ExperienceTitle>{exp.position}</ExperienceTitle>
                <ExperienceMeta>
                  {exp.companyName} • {new Date(exp.startDate).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long' })} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long' }) : 'Настоящее время'}
                </ExperienceMeta>
                {exp.description && <ExperienceDescription>{exp.description}</ExperienceDescription>}
              </ExperienceItem>
            ))}
          </Section>
        )}

        {/* Образование */}
        {application.candidateProfile?.educations && application.candidateProfile.educations.length > 0 && (
          <Section>
            <SectionTitle>
              <GraduationCap size={24} />
              Образование
            </SectionTitle>
            {application.candidateProfile.educations.map((edu: any) => (
              <ExperienceItem key={edu.id}>
                <ExperienceTitle>{edu.degree}</ExperienceTitle>
                <ExperienceMeta>
                  {edu.institution} • {new Date(edu.startDate).getFullYear()} - {edu.endDate ? new Date(edu.endDate).getFullYear() : 'Настоящее время'}
                </ExperienceMeta>
                {edu.fieldOfStudy && <ExperienceDescription>{edu.fieldOfStudy}</ExperienceDescription>}
              </ExperienceItem>
            ))}
          </Section>
        )}

        {/* Сертификаты */}
        {application.candidateProfile?.certificates && application.candidateProfile.certificates.length > 0 && (
          <Section>
            <SectionTitle>
              <Award size={24} />
              Сертификаты
            </SectionTitle>
            {application.candidateProfile.certificates.map((cert: any) => (
              <ExperienceItem key={cert.id}>
                <ExperienceTitle>{cert.title}</ExperienceTitle>
                <ExperienceMeta>
                  {cert.issuer} • {new Date(cert.issueDate).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long' })}
                </ExperienceMeta>
              </ExperienceItem>
            ))}
          </Section>
        )}

        {/* Сопроводительное письмо */}
        {application.coverLetter && (
          <Section>
            <SectionTitle>
              <FileText size={24} />
              Сопроводительное письмо
            </SectionTitle>
            <CoverLetter>{application.coverLetter}</CoverLetter>
          </Section>
        )}

        {/* Статус и даты */}
        <Section>
          <SectionTitle>Информация об отклике</SectionTitle>
          <InfoRow>
            <InfoLabel>Статус</InfoLabel>
            <InfoValue>
              <StatusBadge $status={application.status}>
                {getStatusLabel(application.status)}
              </StatusBadge>
            </InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>
              <Calendar size={16} />
              Дата отклика
            </InfoLabel>
            <InfoValue>
              {new Date(application.createdAt).toLocaleDateString('ru-RU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </InfoValue>
          </InfoRow>
        </Section>

        {/* Чат с кандидатом */}
        <ChatSection>
          <ChatTitle>
            <MessageSquare size={20} />
            Чат с кандидатом
          </ChatTitle>
          <MessagesList>
            {chatMessages.length === 0 && (
              <div style={{ color: 'var(--color-text-secondary)', fontSize: 14, padding: 16 }}>Пока нет сообщений.</div>
            )}
            {chatMessages.map((msg) => {
              const isOwn = msg.authorId === user?.id;
              return (
                <MessageBubble key={msg.id} $isOwn={isOwn}>
                  {msg.body && <div>{msg.body}</div>}
                  {msg.attachmentUrl && (
                    <a href={`${apiOrigin}${msg.attachmentUrl}`} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>
                      {msg.attachmentName || 'Файл'}
                    </a>
                  )}
                  <MessageMeta $isOwn={isOwn}>
                    {formatMessageDate(msg.createdAt)}
                    {!isOwn && msg.readAt && ' ✓ Прочитано'}
                  </MessageMeta>
                </MessageBubble>
              );
            })}
          </MessagesList>
          <ChatForm onSubmit={handleSendChat}>
            <ChatInput type="text" placeholder="Сообщение..." value={chatText} onChange={(e) => setChatText(e.target.value)} />
            <ChatFileLabel>
              <Paperclip size={16} />
              Файл
              <input type="file" hidden accept="*" onChange={onChatFileChange} />
            </ChatFileLabel>
            {chatFile && <span style={{ fontSize: 12 }}>{chatFile.name}</span>}
            <ChatSendBtn type="submit" disabled={sendChatMutation.isPending || (!chatText.trim() && !chatFile)}>
              <Send size={16} /> Отправить
            </ChatSendBtn>
          </ChatForm>
        </ChatSection>

        {/* Форма для оставления отзыва (только для HIRED/REJECTED и если ещё не оставлен) */}
        {canLeaveFeedback && (
          <FeedbackFormSection>
            <SectionTitle><Star size={20} style={{ color: '#f59e0b' }} /> {feedbackFormTitle}</SectionTitle>
            <div style={{ fontSize: 14, marginBottom: 8 }}>Общая оценка (1–10):</div>
            <StarRow>
              {Array.from({ length: 10 }, (_, i) => (
                <StarBtn key={i} $filled={i < fbRating} onClick={() => setFbRating(i + 1)} type="button">
                  <Star size={22} fill={i < fbRating ? '#f59e0b' : 'none'} />
                </StarBtn>
              ))}
            </StarRow>
            <CriteriaGrid>
              {FEEDBACK_CRITERIA.map(({ key, label }) => (
                <CriteriaItem key={key}>
                  <CriteriaLabel>{label}</CriteriaLabel>
                  <CriteriaStars>
                    {Array.from({ length: 10 }, (_, i) => (
                      <StarBtn
                        key={i}
                        $filled={i < (fbCriteria[key] || 0)}
                        onClick={() => setFbCriteria((prev) => ({ ...prev, [key]: i + 1 }))}
                        type="button"
                      >
                        <Star size={16} fill={i < (fbCriteria[key] || 0) ? '#f59e0b' : 'none'} />
                      </StarBtn>
                    ))}
                  </CriteriaStars>
                </CriteriaItem>
              ))}
            </CriteriaGrid>
            <FeedbackTextarea
              placeholder="Комментарий (необязательно)"
              value={fbComment}
              onChange={(e) => setFbComment(e.target.value)}
            />
            <Button
              variant="primary"
              onClick={() => submitFeedbackMutation.mutate()}
              disabled={fbRating === 0 || submitFeedbackMutation.isPending}
            >
              {submitFeedbackMutation.isPending ? 'Отправка...' : 'Отправить оценку'}
            </Button>
            {submitFeedbackMutation.isError && (
              <div style={{ color: '#dc2626', fontSize: 13, marginTop: 8 }}>Не удалось отправить. Попробуйте снова.</div>
            )}
          </FeedbackFormSection>
        )}

        {/* Отзывы и средняя оценка (для завершённых заявок) */}
        {(application.status === 'HIRED' || application.status === 'REJECTED') && (application.feedbacks?.length ?? 0) > 0 && (
          <Section>
            <SectionTitle>Отзывы о процессе</SectionTitle>
            {application.averageRating != null && (
              <AverageBadge>Средняя оценка: {application.averageRating} из 10</AverageBadge>
            )}
            {application.averageRatingsByCriterion && Object.keys(application.averageRatingsByCriterion).length > 0 && (
              <div style={{ marginBottom: 12, fontSize: 13, color: 'var(--color-text-secondary)' }}>
                {[
                  { key: 'communication', label: 'Общение' },
                  { key: 'speed', label: 'Скорость ответа' },
                  { key: 'transparency', label: 'Прозрачность' },
                  { key: 'professionalism', label: 'Профессионализм' },
                ].filter((c) => application.averageRatingsByCriterion?.[c.key] != null).map((c) => (
                  <span key={c.key} style={{ marginRight: 16 }}>{c.label}: {application.averageRatingsByCriterion![c.key]}</span>
                ))}
              </div>
            )}
            <FeedbackBlock>
              {application.feedbacks?.map((f: any) => (
                <FeedbackItem key={f.id}>
                  <strong>
                    {f.authorRole === 'HR' || f.author?.role === 'HR' ? 'HR' : 'Кандидат'}
                  </strong>{' '}
                  — {f.rating} из 10
                  {f.criteriaRatings && Object.keys(f.criteriaRatings).length > 0 && (
                    <span style={{ marginLeft: 6 }}>
                      ({Object.entries(f.criteriaRatings).map(([k, v]) => `${k}: ${v}`).join(', ')})
                    </span>
                  )}
                  {f.comment && ` — «${f.comment}»`}
                </FeedbackItem>
              ))}
            </FeedbackBlock>
          </Section>
        )}
      </Content>
    </Container>
  );
};

