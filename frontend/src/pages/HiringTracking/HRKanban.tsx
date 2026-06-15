import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { applicationApi, jobApi, invitationApi } from '@shared/api';
import { useAuthStore } from '@app/store/auth.store';
import { 
  MessageSquare, 
  FileText, 
  User, 
  Clock, 
  Plus,
  ChevronLeft,
  ChevronRight,
  UserPlus
} from 'lucide-react';

// --- TYPES ---
type Stage = 'APPLIED' | 'SCREENING' | 'INTERVIEW' | 'OFFER' | 'HIRED' | 'REJECTED';

interface StageConfig {
  id: Stage;
  label: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
}

const STAGES: StageConfig[] = [
  { id: 'APPLIED', label: 'Принято приглашение', bgColor: '#f3f4f6', textColor: '#4b5563', borderColor: '#e5e7eb' },
  { id: 'SCREENING', label: 'Скриннинг', bgColor: '#dbeafe', textColor: '#2563eb', borderColor: '#bfdbfe' },
  { id: 'INTERVIEW', label: 'Интервью', bgColor: '#f3e8ff', textColor: '#9333ea', borderColor: '#e9d5ff' },
  { id: 'OFFER', label: 'Оффер', bgColor: '#fef3c7', textColor: '#d97706', borderColor: '#fde68a' },
  { id: 'HIRED', label: 'Принят в работу', bgColor: '#dcfce7', textColor: '#15803d', borderColor: '#86efac' },
  { id: 'REJECTED', label: 'Отказы', bgColor: '#fee2e2', textColor: '#dc2626', borderColor: '#fecaca' },
];

// --- STYLED COMPONENTS ---
const PageContainer = styled.div`
  min-height: 100vh;
  background: #f9fafb;
  padding: 24px;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;
  @media (max-width: 768px) {
    padding: 14px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 16px;
  @media (max-width: 640px) {
    margin-bottom: 18px;
    gap: 10px;
  }
`;

const HeaderLeft = styled.div``;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #1d1d1f;
  margin-bottom: 4px;
  @media (max-width: 640px) {
    font-size: 20px;
  }
`;

const Subtitle = styled.p`
  color: #6b7280;
  font-size: 14px;
  @media (max-width: 640px) {
    font-size: 12px;
  }
`;

const AddButton = styled.button`
  padding: 10px 20px;
  background: #2563eb;
  color: #fff;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #1d4ed8;
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: scale(0.95);
  }
  @media (max-width: 640px) {
    width: 100%;
    justify-content: center;
  }
`;

const KanbanContainer = styled.div`
  display: flex;
  gap: 24px;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 16px;
  width: 100%;
  max-width: 100%;
  
  /* Smooth scrolling */
  scroll-behavior: smooth;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
    
    &:hover {
      background: #94a3b8;
    }
  }
  @media (max-width: 640px) {
    gap: 12px;
  }
`;

const Column = styled.div<{ $bgColor: string; $borderColor: string }>`
  width: 320px;
  min-width: 320px;
  max-width: 320px;
  flex-shrink: 0;
  background: ${({ $bgColor }) => $bgColor};
  border-radius: 12px;
  border: 1px solid ${({ $borderColor }) => $borderColor};
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 200px);
  @media (max-width: 640px) {
    width: 88vw;
    min-width: 88vw;
    max-width: 88vw;
    max-height: calc(100vh - 170px);
  }
`;

const ColumnHeader = styled.div<{ $bgColor: string; $textColor: string; $borderColor: string }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 2px solid ${({ $borderColor }) => $borderColor || '#fff'};
  background: ${({ $bgColor }) => $bgColor};
  border-radius: 12px 12px 0 0;
`;

const ColumnTitle = styled.span<{ $textColor: string }>`
  font-weight: 700;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ $textColor }) => $textColor};
`;

const ColumnCount = styled.span`
  background: rgba(255, 255, 255, 0.5);
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  color: #1d1d1f;
`;

const ColumnContent = styled.div`
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  flex: 1;
  min-height: 500px;
`;

const CandidateCard = styled(motion.div)<{ $isDragging?: boolean }>`
  background: #fff;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  cursor: grab;
  transition: all 0.2s;
  opacity: ${({ $isDragging }) => ($isDragging ? 0.5 : 1)};
  position: relative;

  &:active {
    cursor: grabbing;
  }

  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const CandidateInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 16px;
  flex-shrink: 0;
`;

const CandidateDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

const CandidateName = styled.h4`
  font-weight: 700;
  font-size: 14px;
  color: #1d1d1f;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CandidateRole = styled.div`
  font-size: 12px;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const RatingBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  background: #fef3c7;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  color: #d97706;
  flex-shrink: 0;
`;

const LastActivity = styled.div`
  font-size: 12px;
  color: #6b7280;
  background: #f9fafb;
  padding: 8px;
  border-radius: 8px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const CardActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #f3f4f6;
  opacity: 0.4;
  transition: opacity 0.2s;

  ${CandidateCard}:hover & {
    opacity: 1;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  padding: 6px;
  background: transparent;
  border: none;
  color: #6b7280;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #f3f4f6;
    color: #1d1d1f;
  }
`;

const MoveButtons = styled.div`
  display: flex;
  gap: 4px;
`;

const MoveButton = styled.button<{ $disabled?: boolean }>`
  padding: 6px;
  background: ${({ $disabled }) => $disabled ? 'transparent' : '#eff6ff'};
  border: none;
  color: ${({ $disabled }) => $disabled ? '#d1d5db' : '#2563eb'};
  cursor: ${({ $disabled }) => $disabled ? 'not-allowed' : 'pointer'};
  border-radius: 6px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;

  &:hover:not(:disabled) {
    background: #dbeafe;
  }
`;

const EmptyColumn = styled.div`
  text-align: center;
  padding: 48px 16px;
  color: #9ca3af;
  font-size: 14px;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 48px;
  color: #6b7280;
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 48px;
  color: #dc2626;
`;

// --- COMPONENT ---
export const HRKanban: React.FC = () => {
  const [draggingAppId, setDraggingAppId] = useState<number | null>(null);
  const [dragOverStage, setDragOverStage] = useState<Stage | null>(null);
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  // Check if user is HR or Admin
  if (user?.role !== 'HR' && user?.role !== 'ADMIN') {
    return (
      <PageContainer>
        <ErrorState>
          <div style={{ textAlign: 'center', padding: '48px', color: '#dc2626' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px' }}>Доступ запрещен</h2>
            <p style={{ color: '#6b7280', marginBottom: '16px' }}>
              Эта страница доступна только для HR и администраторов.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                padding: '10px 20px',
                background: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Вернуться в Dashboard
            </button>
          </div>
        </ErrorState>
      </PageContainer>
    );
  }

  // Load job
  const { data: jobData } = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => jobApi.getJobById(Number(jobId)),
    enabled: !!jobId,
  });

  // Load applications
  const { data: applicationsData, isLoading } = useQuery({
    queryKey: ['applications', 'job', jobId],
    queryFn: () => applicationApi.getJobApplications(Number(jobId!)),
    enabled: !!jobId,
  });

  // Load invitations
  const { data: invitationsData } = useQuery({
    queryKey: ['invitations', 'job', jobId],
    queryFn: () => invitationApi.getJobInvitations(Number(jobId!)),
    enabled: !!jobId,
  });

  const applications = applicationsData?.data || [];
  const invitations = invitationsData?.data || [];
  const job = jobData?.data;

  // Update application status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ applicationId, status }: { applicationId: number; status: string }) => {
      return applicationApi.updateApplicationStatus(applicationId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications', 'job', jobId] });
    },
  });

  const moveCandidate = (applicationId: number, newStage: Stage) => {
    updateStatusMutation.mutate({ applicationId, status: newStage });
  };

  const handleDragStart = (applicationId: number) => {
    setDraggingAppId(applicationId);
  };

  const handleDragEnd = () => {
    setDraggingAppId(null);
    setDragOverStage(null);
  };

  const handleDropToStage = (stage: Stage) => {
    if (!draggingAppId) return;
    const app = applications.find((item: any) => item.id === draggingAppId);
    if (!app) return;
    if (app.status !== stage) {
      moveCandidate(draggingAppId, stage);
    }
    handleDragEnd();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Сегодня';
    if (diffDays === 1) return 'Вчера';
    if (diffDays < 7) return `${diffDays} дня назад`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} недели назад`;
    return `${Math.floor(diffDays / 30)} месяца назад`;
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (firstName) return firstName[0].toUpperCase();
    return 'C';
  };

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingState>Загрузка заявок...</LoadingState>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <HeaderLeft>
          <Title>Воронка найма</Title>
          <Subtitle>
            {job ? `Вакансия: ${job.title}` : 'Загрузка...'}
            <span style={{ marginLeft: '16px', fontSize: '12px', color: '#6b7280' }}>
              💡 Используйте стрелки ← → на карточках кандидатов для продвижения по этапам
            </span>
          </Subtitle>
        </HeaderLeft>
        <AddButton onClick={() => navigate(`/jobs/${jobId}`)}>
          <Plus size={16} />
          Добавить кандидата
        </AddButton>
      </Header>

      <KanbanContainer>
        {STAGES.map((stage) => {
          const stageApplications = applications.filter(
            (app: any) => (app.status || 'APPLIED') === stage.id
          );

          return (
            <Column 
              key={stage.id} 
              $bgColor={dragOverStage === stage.id ? '#eef2ff' : stage.bgColor}
              $borderColor={stage.borderColor}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverStage(stage.id);
              }}
              onDragLeave={() => setDragOverStage((prev) => (prev === stage.id ? null : prev))}
              onDrop={(e) => {
                e.preventDefault();
                handleDropToStage(stage.id);
              }}
            >
              <ColumnHeader $bgColor={stage.bgColor} $textColor={stage.textColor} $borderColor={stage.borderColor}>
                <ColumnTitle $textColor={stage.textColor}>
                  {stage.label}
                </ColumnTitle>
                <ColumnCount>{stageApplications.length}</ColumnCount>
              </ColumnHeader>
              <ColumnContent>
                {stageApplications.length > 0 ? (
                  stageApplications.map((app: any) => {
                    const candidate = app.candidateProfile;
                    const initials = getInitials(candidate?.firstName, candidate?.lastName);
                    const currentStageIndex = STAGES.findIndex(s => s.id === (app.status || 'APPLIED'));
                    
                    return (
                      <CandidateCard
                        key={app.id}
                        layoutId={app.id.toString()}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        draggable
                        onDragStart={(e) => {
                          e.stopPropagation();
                          handleDragStart(app.id);
                        }}
                        onDragEnd={handleDragEnd}
                        $isDragging={draggingAppId === app.id}
                        onClick={() => navigate(`/applications/${app.id}`)}
                      >
                        <CardHeader>
                          <CandidateInfo>
                            <Avatar>{initials}</Avatar>
                            <CandidateDetails>
                              <CandidateName>
                                {candidate?.firstName} {candidate?.lastName}
                              </CandidateName>
                              <CandidateRole>
                                {candidate?.headline || 'Кандидат'}
                              </CandidateRole>
                            </CandidateDetails>
                          </CandidateInfo>
                        </CardHeader>

                        <LastActivity>
                          <Clock size={12} />
                          {formatDate(app.createdAt)}
                        </LastActivity>

                        {/* Show invitation info if this application came from invitation */}
                        {(() => {
                          const relatedInvitation = invitations.find((inv: any) => 
                            inv.candidateProfileId === app.candidateProfileId && 
                            inv.jobId === app.jobId &&
                            inv.status === 'ACCEPTED'
                          );
                          return relatedInvitation ? (
                            <div style={{ 
                              fontSize: '11px', 
                              color: '#059669', 
                              background: '#d1fae5', 
                              padding: '4px 8px', 
                              borderRadius: '6px',
                              marginBottom: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}>
                              <UserPlus size={10} />
                              Приглашен {relatedInvitation.invitedBy?.email || 'HR'}
                            </div>
                          ) : null;
                        })()}

                        <CardActions>
                          <ActionButtons>
                            <ActionButton 
                              onClick={(e) => {
                                e.stopPropagation();
                                // TODO: Open chat
                              }}
                              title="Чат"
                            >
                              <MessageSquare size={16} />
                            </ActionButton>
                            <ActionButton 
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/candidates/${candidate?.id}`);
                              }}
                              title="Профиль"
                            >
                              <User size={16} />
                            </ActionButton>
                            <ActionButton 
                              onClick={(e) => {
                                e.stopPropagation();
                                // TODO: Open resume
                              }}
                              title="Резюме"
                            >
                              <FileText size={16} />
                            </ActionButton>
                          </ActionButtons>
                          
                          <MoveButtons>
                            {currentStageIndex > 0 && (
                              <MoveButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveCandidate(app.id, STAGES[currentStageIndex - 1].id);
                                }}
                                title="Назад"
                              >
                                <ChevronLeft size={14} />
                              </MoveButton>
                            )}
                            {currentStageIndex < STAGES.length - 1 && (
                              <MoveButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveCandidate(app.id, STAGES[currentStageIndex + 1].id);
                                }}
                                title="Вперед"
                              >
                                <ChevronRight size={14} />
                              </MoveButton>
                            )}
                          </MoveButtons>
                        </CardActions>
                      </CandidateCard>
                    );
                  })
                ) : (
                  <EmptyColumn>Нет кандидатов</EmptyColumn>
                )}
              </ColumnContent>
            </Column>
          );
        })}
      </KanbanContainer>
    </PageContainer>
  );
};
