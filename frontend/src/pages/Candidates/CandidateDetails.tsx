import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import { candidateApi, jobApi, invitationApi, companyApi } from '@shared/api';
import {
  ArrowLeft,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Award,
  Code,
  FileText,
  Target,
  Send,
  Eye,
  CheckCircle,
  Star,
} from 'lucide-react';
import { Button } from '@shared/ui/Button';
import { useAuthStore } from '@app/store/auth.store';

const Page = styled.div`
  min-height: 100vh;
  background: #f9fafb;
  padding: 24px 24px 80px;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;

  @media (max-width: 768px) {
    padding: 12px 12px 48px;
  }
`;

const TopSection = styled.div`
  max-width: 1100px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 0;
  }
`;

const HeroShell = styled.div`
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.08);

  @media (max-width: 768px) {
    border-radius: 20px;
    box-shadow: 0 12px 28px rgba(15, 23, 42, 0.14);
  }
`;

const Hero = styled.div`
  position: relative;
  background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 55%, #1d4ed8 100%);
  padding: 28px 32px 36px;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.35), transparent 45%);
    pointer-events: none;
  }

  @media (max-width: 768px) {
    padding: 16px 16px 22px;
  }
`;

const HeroInner = styled.div`
  position: relative;
  z-index: 1;
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  color: rgba(255, 255, 255, 0.85);
  font-size: 14px;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 999px;
  padding: 8px 16px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.18);
    color: #fff;
  }
`;

const HeroCard = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 24px;
  padding-bottom: 4px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
  }
`;

const Avatar = styled.div`
  width: 112px;
  height: 112px;
  border-radius: 24px;
  background: linear-gradient(135deg, #60a5fa, #818cf8);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 800;
  font-size: 40px;
  flex-shrink: 0;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.25);
  border: 3px solid rgba(255, 255, 255, 0.25);

  @media (max-width: 768px) {
    width: 72px;
    height: 72px;
    font-size: 28px;
    border-radius: 18px;
  }
`;

const HeroInfo = styled.div`
  flex: 1;
  min-width: 0;
  color: #fff;
`;

const Name = styled.h1`
  font-size: clamp(28px, 5vw, 42px);
  font-weight: 800;
  letter-spacing: -0.03em;
  margin: 0 0 8px;
  color: #ffffff;

  @media (max-width: 768px) {
    font-size: 24px;
    line-height: 1.15;
  }
`;

const Headline = styled.p`
  font-size: 18px;
  color: rgba(255, 255, 255, 0.82);
  margin: 0 0 16px;
  line-height: 1.5;
`;

const HeroMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const MetaPill = styled.span<{ $accent?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  background: ${({ $accent }) => ($accent ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 255, 255, 0.12)')};
  color: ${({ $accent }) => ($accent ? '#bbf7d0' : 'rgba(255, 255, 255, 0.92)')};
  border: 1px solid ${({ $accent }) => ($accent ? 'rgba(34, 197, 94, 0.35)' : 'rgba(255, 255, 255, 0.15)')};
`;

const Content = styled.div`
  max-width: 1100px;
  margin: 40px auto 0;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    margin-top: 20px;
    padding: 0 2px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;

  @media (min-width: 960px) {
    grid-template-columns: minmax(0, 1fr) 320px;
    align-items: start;
  }

  @media (max-width: 768px) {
    gap: 14px;
  }
`;

const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (min-width: 960px) {
    position: sticky;
    top: 24px;
  }
`;

const Panel = styled.section`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    border-radius: 18px;
    padding: 18px 16px;
  }
`;

const PanelTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 700;
  color: #1d1d1f;
  margin: 0 0 16px;
`;

const SummaryText = styled.p`
  margin: 0;
  font-size: 15px;
  line-height: 1.75;
  color: #374151;
`;

const SkillsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const SkillChip = styled.div<{ $level?: string }>`
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px 14px;
  border-radius: 12px;
  background: ${({ $level }) =>
    $level === 'ADVANCED' ? '#eff6ff' : $level === 'INTERMEDIATE' ? '#f0fdf4' : '#f9fafb'};
  border: 1px solid ${({ $level }) =>
    $level === 'ADVANCED' ? '#bfdbfe' : $level === 'INTERMEDIATE' ? '#bbf7d0' : '#e5e7eb'};
`;

const SkillName = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: #1d1d1f;
`;

const SkillMeta = styled.span`
  font-size: 12px;
  color: #6b7280;
`;

const Timeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const TimelineItem = styled.div`
  position: relative;
  padding: 0 0 24px 20px;
  border-left: 2px solid #e5e7eb;

  &:last-child {
    padding-bottom: 0;
  }

  &::before {
    content: '';
    position: absolute;
    left: -6px;
    top: 4px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #2563eb;
    border: 2px solid #fff;
    box-shadow: 0 0 0 2px #dbeafe;
  }
`;

const TimelineTitle = styled.h3`
  margin: 0 0 4px;
  font-size: 17px;
  font-weight: 700;
  color: #1d1d1f;
`;

const TimelineMeta = styled.div`
  font-size: 14px;
  color: #2563eb;
  font-weight: 600;
  margin-bottom: 6px;
`;

const TimelineDate = styled.div`
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 8px;
`;

const TimelineText = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.65;
  color: #4b5563;
`;

const ContactRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
  font-size: 14px;
  color: #374151;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  svg {
    color: #2563eb;
    flex-shrink: 0;
  }
`;

const StatBox = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border-radius: 14px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
`;

const StatValue = styled.div`
  font-size: 22px;
  font-weight: 800;
  color: #1d1d1f;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: #6b7280;
`;

const ReviewCard = styled.div`
  padding: 16px;
  border-radius: 14px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ReviewRating = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 16px;
  font-weight: 700;
  color: #1d1d1f;
  margin-bottom: 8px;
`;

const HuntingModal = styled.div<{ $isOpen: boolean }>`
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  z-index: 1000;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

const ModalContent = styled.div`
  max-width: 560px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  background: #fff;
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
`;

const ModalTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 140px;
  padding: 14px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 15px;
  font-family: inherit;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #2563eb;
  }
`;

const Select = styled.select`
  width: 100%;
  height: 48px;
  padding: 0 14px;
  font-size: 15px;
  font-family: inherit;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  color: #1d1d1f;

  &:focus {
    outline: none;
    border-color: #2563eb;
  }
`;

const FieldLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 14px;
  color: #374151;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
`;

const Centered = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 80px 24px;
  text-align: center;
`;

const proficiencyLabel: Record<string, string> = {
  BASIC: 'Базовый',
  INTERMEDIATE: 'Средний',
  ADVANCED: 'Продвинутый',
};

export const CandidateDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [isHuntingModalOpen, setIsHuntingModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<number | ''>('');
  const [message, setMessage] = useState('');

  const { data: candidateData, isLoading, error } = useQuery({
    queryKey: ['candidate', id],
    queryFn: () => candidateApi.getCandidateById(Number(id)),
    enabled: !!id && (user?.role === 'HR' || user?.role === 'ADMIN'),
  });

  const candidate = candidateData?.data;
  const profile = candidate?.profile;

  const { data: reviewsData } = useQuery({
    queryKey: ['candidate-reviews', id],
    queryFn: () => candidateApi.getCandidateReviews(Number(id)),
    enabled: !!id && (user?.role === 'HR' || user?.role === 'ADMIN'),
  });

  const { data: companyData } = useQuery({
    queryKey: ['company', 'my'],
    queryFn: async () => {
      try {
        return await companyApi.getMyCompany();
      } catch (err: any) {
        if (err.message === 'COMPANY_NOT_FOUND' || err.response?.status === 404) {
          return { success: true, data: null };
        }
        throw err;
      }
    },
    enabled: (user?.role === 'HR' || user?.role === 'ADMIN') && isHuntingModalOpen,
    retry: false,
  });

  const company = companyData?.data;

  const { data: jobsData } = useQuery({
    queryKey: ['myJobs', company?.id],
    queryFn: () => jobApi.getJobs({ status: 'ACTIVE', companyId: company?.id }),
    enabled: (user?.role === 'HR' || user?.role === 'ADMIN') && isHuntingModalOpen && !!company?.id,
  });

  const jobs = jobsData?.data || [];

  const huntingMutation = useMutation({
    mutationFn: async () => {
      if (!selectedJobId || !profile) return;
      return invitationApi.createInvitation({
        jobId: Number(selectedJobId),
        candidateProfileId: profile.id,
        message: message.trim() || undefined,
      });
    },
    onSuccess: () => {
      setIsHuntingModalOpen(false);
      setSelectedJobId('');
      setMessage('');
      queryClient.invalidateQueries({ queryKey: ['candidate', id] });
      alert('Приглашение успешно отправлено!');
    },
    onError: (err: any) => {
      alert(err.response?.data?.error || 'Не удалось отправить приглашение');
    },
  });

  if (isLoading) {
    return (
      <Page>
        <Centered>Загрузка профиля...</Centered>
      </Page>
    );
  }

  if (error || !candidate || !profile) {
    return (
      <Page>
        <Centered>
          <h2 style={{ marginBottom: 16 }}>Кандидат не найден</h2>
          <Button variant="primary" onClick={() => navigate('/candidates')}>
            Вернуться к списку
          </Button>
        </Centered>
      </Page>
    );
  }

  const initials = `${profile.firstName?.charAt(0) || ''}${profile.lastName?.charAt(0) || ''}`.toUpperCase() || 'U';
  const canHunt = user?.role === 'HR' || user?.role === 'ADMIN';

  const formatPeriod = (startDate: string, endDate?: string | null) => {
    const start = new Date(startDate).toLocaleDateString('ru-RU', { year: 'numeric', month: 'short' });
    const end = endDate
      ? new Date(endDate).toLocaleDateString('ru-RU', { year: 'numeric', month: 'short' })
      : 'настоящее время';
    return `${start} — ${end}`;
  };

  return (
    <>
      <Page>
        <TopSection>
          <HeroShell>
            <Hero>
              <HeroInner>
                <BackButton type="button" onClick={() => navigate(-1)}>
                  <ArrowLeft size={16} />
                  Назад
                </BackButton>
                <HeroCard>
                  <Avatar>{initials}</Avatar>
                  <HeroInfo>
                    <Name>
                      {profile.lastName} {profile.firstName}
                    </Name>
                    {profile.headline && <Headline>{profile.headline}</Headline>}
                    <HeroMeta>
                      {profile.isOpenToWork && (
                        <MetaPill $accent>
                          <CheckCircle size={14} />
                          Ищет работу
                        </MetaPill>
                      )}
                      <MetaPill>
                        <Eye size={14} />
                        {profile.viewsCount || 0} просмотров
                      </MetaPill>
                      {(profile.skills?.length ?? 0) > 0 && (
                        <MetaPill>
                          <Code size={14} />
                          {profile.skills!.length} навыков
                        </MetaPill>
                      )}
                    </HeroMeta>
                  </HeroInfo>
                </HeroCard>
              </HeroInner>
            </Hero>
          </HeroShell>
        </TopSection>

        <Content>
          <Grid>
            <MainColumn>
              {profile.summary && (
                <Panel>
                  <PanelTitle>
                    <FileText size={20} />
                    О себе
                  </PanelTitle>
                  <SummaryText>{profile.summary}</SummaryText>
                </Panel>
              )}

              {(profile.skills?.length ?? 0) > 0 && (
                <Panel>
                  <PanelTitle>
                    <Code size={20} />
                    Навыки
                  </PanelTitle>
                  <SkillsGrid>
                    {profile.skills!.map((cs) => (
                      <SkillChip key={cs.skill.id} $level={cs.proficiencyLevel}>
                        <SkillName>{cs.skill.name}</SkillName>
                        <SkillMeta>
                          {cs.proficiencyLevel
                            ? proficiencyLabel[cs.proficiencyLevel] || cs.proficiencyLevel
                            : 'Уровень не указан'}
                          {cs.yearsOfExperience ? ` · ${cs.yearsOfExperience} лет` : ''}
                        </SkillMeta>
                      </SkillChip>
                    ))}
                  </SkillsGrid>
                </Panel>
              )}

              {(profile.workExperiences?.length ?? 0) > 0 && (
                <Panel>
                  <PanelTitle>
                    <Briefcase size={20} />
                    Опыт работы
                  </PanelTitle>
                  <Timeline>
                    {profile.workExperiences!.map((exp) => (
                      <TimelineItem key={exp.id}>
                        <TimelineTitle>{exp.position}</TimelineTitle>
                        <TimelineMeta>{exp.companyName}</TimelineMeta>
                        <TimelineDate>{formatPeriod(exp.startDate, exp.endDate)}</TimelineDate>
                        {exp.description && <TimelineText>{exp.description}</TimelineText>}
                      </TimelineItem>
                    ))}
                  </Timeline>
                </Panel>
              )}

              {(profile.educations?.length ?? 0) > 0 && (
                <Panel>
                  <PanelTitle>
                    <GraduationCap size={20} />
                    Образование
                  </PanelTitle>
                  <Timeline>
                    {profile.educations!.map((edu) => (
                      <TimelineItem key={edu.id}>
                        <TimelineTitle>{edu.institution}</TimelineTitle>
                        <TimelineMeta>
                          {[edu.degree, edu.fieldOfStudy].filter(Boolean).join(' · ')}
                        </TimelineMeta>
                        {edu.startDate && (
                          <TimelineDate>{formatPeriod(edu.startDate, edu.endDate)}</TimelineDate>
                        )}
                        {edu.description && <TimelineText>{edu.description}</TimelineText>}
                      </TimelineItem>
                    ))}
                  </Timeline>
                </Panel>
              )}

              {(profile.certificates?.length ?? 0) > 0 && (
                <Panel>
                  <PanelTitle>
                    <Award size={20} />
                    Сертификаты
                  </PanelTitle>
                  <Timeline>
                    {profile.certificates!.map((cert) => (
                      <TimelineItem key={cert.id}>
                        <TimelineTitle>{cert.name}</TimelineTitle>
                        {cert.issuer && <TimelineMeta>{cert.issuer}</TimelineMeta>}
                        {cert.issueDate && (
                          <TimelineDate>
                            {new Date(cert.issueDate).toLocaleDateString('ru-RU', {
                              year: 'numeric',
                              month: 'long',
                            })}
                          </TimelineDate>
                        )}
                      </TimelineItem>
                    ))}
                  </Timeline>
                </Panel>
              )}

              {reviewsData?.data && reviewsData.data.totalReviews > 0 && (
                <Panel>
                  <PanelTitle>
                    <Star size={20} />
                    Отзывы от HR
                  </PanelTitle>
                  <StatBox style={{ marginBottom: 16 }}>
                    <StatValue>{reviewsData.data.averageRating ?? '—'}</StatValue>
                    <div>
                      <StatLabel>средний рейтинг</StatLabel>
                      <StatLabel>{reviewsData.data.totalReviews} отзывов</StatLabel>
                    </div>
                  </StatBox>
                  {(reviewsData.data.reviews || []).map((review: any) => (
                    <ReviewCard key={review.id}>
                      <ReviewRating>
                        <Star size={16} fill="#fbbf24" color="#fbbf24" />
                        {review.rating} / 10
                      </ReviewRating>
                      {review.comment && <TimelineText>{review.comment}</TimelineText>}
                      {review.application?.job?.title && (
                        <TimelineDate>Вакансия: {review.application.job.title}</TimelineDate>
                      )}
                    </ReviewCard>
                  ))}
                </Panel>
              )}
            </MainColumn>

            <Sidebar>
              <Panel>
                <PanelTitle>Контакты</PanelTitle>
                <ContactRow>
                  <Mail size={18} />
                  <span>{candidate.email}</span>
                </ContactRow>
                {profile.phone && (
                  <ContactRow>
                    <Phone size={18} />
                    <span>{profile.phone}</span>
                  </ContactRow>
                )}
              </Panel>

              <Panel>
                <PanelTitle>Статус</PanelTitle>
                <StatBox>
                  <StatValue>{profile.isOpenToWork ? 'Активен' : 'Пассивен'}</StatValue>
                  <StatLabel>{profile.isOpenToWork ? 'Открыт к предложениям' : 'Не ищет работу'}</StatLabel>
                </StatBox>
              </Panel>

              {canHunt && (
                <Panel>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => setIsHuntingModalOpen(true)}
                    style={{ width: '100%' }}
                  >
                    <Target size={20} />
                    Захантить
                  </Button>
                </Panel>
              )}
            </Sidebar>
          </Grid>
        </Content>
      </Page>

      <HuntingModal $isOpen={isHuntingModalOpen} onClick={() => setIsHuntingModalOpen(false)}>
        <div onClick={(e) => e.stopPropagation()}>
          <ModalContent>
            <ModalTitle>
              <Target size={24} />
              Захантить кандидата
            </ModalTitle>
            <div style={{ marginBottom: 16 }}>
              <FieldLabel>Выберите вакансию *</FieldLabel>
              <Select
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value ? Number(e.target.value) : '')}
              >
                <option value="">Выберите вакансию...</option>
                {jobs.map((job: any) => (
                  <option key={job.id} value={job.id}>
                    {job.title} {job.company?.name && `(${job.company.name})`}
                  </option>
                ))}
              </Select>
            </div>
            <div style={{ marginBottom: 8 }}>
              <FieldLabel>Персональное сообщение (необязательно)</FieldLabel>
              <Textarea
                placeholder="Напишите персональное сообщение кандидату..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <ModalActions>
              <Button
                variant="ghost"
                onClick={() => {
                  setIsHuntingModalOpen(false);
                  setSelectedJobId('');
                  setMessage('');
                }}
              >
                Отмена
              </Button>
              <Button
                variant="primary"
                onClick={() => huntingMutation.mutate()}
                disabled={huntingMutation.isPending || !selectedJobId}
              >
                <Send size={18} />
                {huntingMutation.isPending ? 'Отправка...' : 'Отправить'}
              </Button>
            </ModalActions>
          </ModalContent>
        </div>
      </HuntingModal>
    </>
  );
};
