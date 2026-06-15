import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { useAuthStore } from '@app/store/auth.store';
import { companyApi, applicationApi, jobApi, favoriteApi, invitationApi, authApi, candidateApi } from '@shared/api';
import { 
  Eye, 
  Briefcase, 
  CheckCircle, 
  TrendingUp,
  FileText,
  Heart,
  Building2,
  User,
  Plus,
  Edit,
  ArrowUpRight,
  MoreHorizontal,
  Search,
  Bell,
  Play,
  Pause,
  Clock,
  XCircle,
  FileEdit,
  Mail,
  UserPlus,
  X
} from 'lucide-react';
import { Button } from '@shared/ui/Button';
import { JobCard as UIJobCard } from '@shared/ui/JobCard';
import { Badge } from '@shared/ui/Badge';

// Animations
const float = keyframes`
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(20px, -20px); }
`;

const fadeUp = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(20px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
`;

// Dashboard Container
const DashboardContainer = styled.div`
  position: relative;
  width: 100%;
  background-color: #f5f5f7;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  color: #1d1d1f;
  padding: 0;
  overflow-x: hidden;

  @media (max-width: 768px) {
    padding: 0 0 24px;
  }
`;

// Background Effects
const NoiseOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url("https://grainy-gradients.vercel.app/noise.svg");
  opacity: 0.03;
  pointer-events: none;
  z-index: 1;
  filter: invert(1);
`;

const AuroraBlob = styled.div<{ $top?: string; $left?: string; $bottom?: string; $right?: string; $width?: string; $height?: string; $gradient?: string }>`
  position: absolute;
  filter: blur(80px);
  z-index: 0;
  opacity: 0.6;
  animation: ${float} 10s ease-in-out infinite;
  top: ${({ $top }) => $top || 'auto'};
  left: ${({ $left }) => $left || 'auto'};
  bottom: ${({ $bottom }) => $bottom || 'auto'};
  right: ${({ $right }) => $right || 'auto'};
  width: ${({ $width }) => $width || '50vw'};
  height: ${({ $height }) => $height || '50vw'};
  background: ${({ $gradient }) => $gradient || 'radial-gradient(circle, rgba(0,122,255,0.15), transparent 70%)'};

  @media (max-width: 768px) {
    display: none;
  }
`;

// Main Content
const MainContent = styled.main`
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;

  @media (max-width: 768px) {
    padding: 14px 12px;
  }
`;

// Header
const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    margin-bottom: 20px;
    align-items: flex-start;
  }
`;

const WelcomeText = styled.div`
  min-width: 0;

  h1 {
    font-size: 32px;
    font-weight: 700;
    letter-spacing: -0.02em;
    margin: 0 0 8px 0;
    color: #1d1d1f;
  }

  p {
    margin: 0;
    color: #86868b;
    font-size: 17px;
    line-height: 1.45;
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 24px;
      line-height: 1.15;
    }

    p {
      font-size: 14px;
    }
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 16px;
`;

const IconBtn = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);

  &:hover {
    transform: scale(1.05);
  }
`;

const Avatar = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%);
  border: 2px solid #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`;

// Stats Grid
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
    margin-bottom: 20px;
  }
`;

const StatCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }

  @media (max-width: 768px) {
    border-radius: 16px;
    padding: 14px 12px;

    &:hover {
      transform: none;
    }
  }
`;

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    margin-bottom: 10px;
  }
`;

const StatIcon = styled.div<{ $bg?: string; $color?: string }>`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  background: ${({ $bg }) => $bg || 'rgba(0,122,255,0.1)'};
  color: ${({ $color }) => $color || '#007AFF'};

  @media (max-width: 768px) {
    width: 34px;
    height: 34px;
    border-radius: 10px;

    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

const StatValue = styled.div`
  font-size: 36px;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 4px;
  color: #1d1d1f;

  @media (max-width: 768px) {
    font-size: 26px;
  }
`;

const StatLabel = styled.div`
  color: #86868b;
  font-size: 14px;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 11px;
    line-height: 1.3;
  }
`;

const TrendBadge = styled.div`
  background: #E5F9E0;
  color: #34C759;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 99px;
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 10px;
    padding: 3px 6px;
  }
`;

// Content Split
const ContentSplit = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

// Glass Panel
const GlassPanel = styled(motion.div)`
  background: #fff;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.03);
  overflow: visible;
  max-height: none;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    border-radius: 18px;
    padding: 16px 14px;
  }
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 12px;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    align-items: flex-start;
    margin-bottom: 16px;
  }
`;

const PanelTitle = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: #1d1d1f;
  display: flex;
  align-items: center;
  min-width: 0;

  @media (max-width: 768px) {
    font-size: 17px;
    line-height: 1.25;
  }
`;

// Application Item
const AppItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.2s;
  gap: 12px;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    padding-left: 8px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    padding: 14px 0;

    &:hover {
      padding-left: 0;
    }
  }
`;

const ItemActions = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: column;
  flex-shrink: 0;

  @media (max-width: 768px) {
    flex-direction: row;
    width: 100%;

    button {
      flex: 1;
    }
  }
`;

const CompanyInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0;
  flex: 1;

  @media (max-width: 768px) {
    gap: 12px;
  }
`;

const CompanyLogo = styled.div<{ $bg?: string; $color?: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${({ $bg }) => $bg || '#f0f0f0'};
  color: ${({ $color }) => $color || '#666'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 18px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 16px;
    border-radius: 10px;
  }
`;

const JobDetails = styled.div`
  min-width: 0;

  h4 {
    margin: 0 0 4px 0;
    font-size: 16px;
    font-weight: 600;
    color: #1d1d1f;
    line-height: 1.3;
  }

  span {
    color: #86868b;
    font-size: 14px;
  }

  @media (max-width: 768px) {
    h4 {
      font-size: 15px;
    }

    span {
      font-size: 13px;
    }
  }
`;

const StatusBadge = styled.span<{ $status: string }>`
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
  white-space: nowrap;
  background: ${({ $status }) => {
    if ($status === 'INTERVIEW' || $status === 'SCREENING') return 'rgba(52, 199, 89, 0.1)';
    if ($status === 'APPLIED') return 'rgba(255, 149, 0, 0.1)';
    if ($status === 'OFFER') return 'rgba(0, 122, 255, 0.1)';
    if ($status === 'REJECTED') return 'rgba(255, 59, 48, 0.1)';
    return 'rgba(142, 142, 147, 0.1)';
  }};
  color: ${({ $status }) => {
    if ($status === 'INTERVIEW' || $status === 'SCREENING') return '#34C759';
    if ($status === 'APPLIED') return '#FF9500';
    if ($status === 'OFFER') return '#007AFF';
    if ($status === 'REJECTED') return '#FF3B30';
    return '#8E8E93';
  }};
`;

// Profile Widget
const ProfileWidget = styled(GlassPanel)`
  text-align: center;
`;

const ProfileAvatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%);
  margin: 0 auto 16px;
  border: 3px solid #fff;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 700;
  color: #fff;
`;

const ProfileName = styled.h3`
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1d1d1f;
`;

const ProfileTitle = styled.span`
  color: #86868b;
  font-size: 14px;
`;

const ProfileProgress = styled.div`
  margin-top: 16px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #f0f0f0;
  border-radius: 99px;
  overflow: hidden;
  margin-bottom: 8px;
`;

const ProgressFill = styled.div<{ $width?: number }>`
  height: 100%;
  background: linear-gradient(90deg, #007AFF, #5856D6);
  border-radius: 99px;
  width: ${({ $width }) => $width || 75}%;
  transition: width 0.3s ease;
`;

const ProgressText = styled.p`
  font-size: 12px;
  color: #86868b;
  margin-top: 12px;
  line-height: 1.4;
`;

const EditButton = styled.button`
  width: 100%;
  margin-top: 24px;
  padding: 12px;
  background: #f5f5f7;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  color: #1d1d1f;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover {
    background: #e5e5ea;
    transform: translateY(-1px);
  }
`;

const ViewersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 14px;
`;

const ViewerItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  background: rgba(0, 0, 0, 0.02);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    padding: 12px;
  }
`;

const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const HistoryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  background: rgba(0, 0, 0, 0.02);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    padding: 12px;
  }
`;

const statusLabel = (status?: string | null) => {
  const map: Record<string, string> = {
    APPLIED: 'Отклик отправлен',
    SCREENING: 'Скрининг',
    INTERVIEW: 'Интервью',
    OFFER: 'Оффер',
    HIRED: 'Принят',
    REJECTED: 'Отклонен',
  };
  if (!status) return '—';
  return map[status] || status;
};

// Jobs Grid
const JobsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  margin-top: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
    margin-top: 14px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: #86868b;

  @media (max-width: 768px) {
    padding: 28px 12px;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const FormRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: flex-end;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;

    input {
      width: 100% !important;
    }

    button {
      width: 100%;
    }
  }
`;

const ResumePromo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 24px;

  & > div:first-child {
    flex: 1;
    min-width: 0;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;

    button {
      width: 100%;
      justify-content: center;
    }
  }
`;

const EmptyStateTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #1d1d1f;
`;

const EmptyStateText = styled.p`
  font-size: 15px;
  margin-bottom: 24px;
  line-height: 1.6;
`;

// Animation variants
const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Invitations Section Component
const InvitationsSection: React.FC<{
  invitations: any[];
  queryClient: any;
  navigate: any;
}> = ({ invitations, queryClient, navigate }) => {
  const acceptMutation = useMutation({
    mutationFn: (invitationId: number) => invitationApi.acceptInvitation(invitationId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['invitations', 'my'] });
      queryClient.invalidateQueries({ queryKey: ['applications', 'my', 'candidate'] });
      // Redirect to tracking page if application was created
      if (data?.data?.application?.id) {
        navigate(`/applications/${data.data.application.id}/tracking`);
      } else {
        alert('Приглашение принято! Заявка создана автоматически.');
      }
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || 'Не удалось принять приглашение');
    },
  });

  const declineMutation = useMutation({
    mutationFn: (invitationId: number) => invitationApi.declineInvitation(invitationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations', 'my'] });
      alert('Приглашение отклонено');
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || 'Не удалось отклонить приглашение');
    },
  });

  return (
    <GlassPanel
      initial="hidden"
      animate="visible"
      variants={fadeUpVariants}
      transition={{ duration: 0.6, delay: 0.9 }}
      style={{ marginTop: '24px' }}
    >
      <PanelHeader>
        <PanelTitle>
          <UserPlus size={20} style={{ marginRight: '8px' }} />
          Приглашения от работодателей
        </PanelTitle>
        <Badge variant="success" size="sm">
          {invitations.length} нов{invitations.length === 1 ? 'ое' : 'ых'}
        </Badge>
      </PanelHeader>
      <div>
        {invitations.map((invitation: any) => (
          <AppItem
            key={invitation.id}
            onClick={() => navigate(`/jobs/${invitation.job?.id}`)}
            style={{ marginBottom: '12px' }}
          >
            <CompanyInfo>
              <CompanyLogo $bg="#FFF4E6" $color="#FF9500">
                {invitation.job?.title?.[0] || 'J'}
              </CompanyLogo>
              <JobDetails>
                <h4>{invitation.job?.title || 'Вакансия'}</h4>
                <span>
                  Приглашение от {invitation.invitedBy?.email || 'HR'}
                </span>
                {invitation.message && (
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                    {invitation.message}
                  </div>
                )}
              </JobDetails>
            </CompanyInfo>
            <ItemActions>
              <Button
                variant="primary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  acceptMutation.mutate(invitation.id);
                }}
                disabled={acceptMutation.isPending}
              >
                <CheckCircle size={14} style={{ marginRight: '4px' }} />
                Принять
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  declineMutation.mutate(invitation.id);
                }}
                disabled={declineMutation.isPending}
              >
                <X size={14} style={{ marginRight: '4px' }} />
                Отклонить
              </Button>
            </ItemActions>
          </AppItem>
        ))}
      </div>
    </GlassPanel>
  );
};

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, checkAuth } = useAuthStore();
  const [telegramInput, setTelegramInput] = useState('');
  React.useEffect(() => {
    setTelegramInput(user?.telegramUsername?.replace(/^@/, '') ?? '');
  }, [user?.telegramUsername]);

  const updateMeMutation = useMutation({
    mutationFn: (telegramUsername: string | null) => authApi.updateMe({ telegramUsername: telegramUsername || null }),
    onSuccess: () => { checkAuth(); },
  });

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const changePasswordMutation = useMutation({
    mutationFn: (password: string) => authApi.changePassword(password),
    onSuccess: () => {
      setNewPassword('');
      setConfirmPassword('');
      alert('Пароль успешно изменён');
    },
    onError: (err: any) => {
      alert(err.response?.data?.error || 'Не удалось изменить пароль');
    },
  });

  // Загружаем компанию для HR
  const { data: companyData, isLoading: companyLoading } = useQuery({
    queryKey: ['company', 'my'],
    queryFn: async () => {
      try {
        return await companyApi.getMyCompany();
      } catch (error: any) {
        if (error.message === 'COMPANY_NOT_FOUND' || error.response?.status === 404) {
          return { success: true, data: null };
        }
        throw error;
      }
    },
    enabled: (user?.role === 'HR' || user?.role === 'ADMIN') && !!user,
    retry: false,
  });

  // Загружаем вакансии для HR
  const { data: jobsData, isLoading: jobsLoading } = useQuery({
    queryKey: ['jobs', 'myCompany'],
    queryFn: () => jobApi.getJobs({ companyId: companyData?.data?.id }),
    enabled: (user?.role === 'HR' || user?.role === 'ADMIN') && !!user && !!companyData?.data?.id,
  });

  // Загружаем заявки для HR
  const { data: applicationsData } = useQuery({
    queryKey: ['applications', 'my', 'hr'],
    queryFn: () => applicationApi.getMyJobApplications(),
    enabled: (user?.role === 'HR' || user?.role === 'ADMIN') && !!user,
  });

  const company = companyData?.data || null;
  const applications = applicationsData?.data || [];
  const jobs = jobsData?.data || [];

  // Статистика для HR
  const totalViews = jobs.reduce((sum: number, job: any) => sum + (job.viewsCount || 0), 0);
  const activeJobs = jobs.filter((job: any) => job.status === 'ACTIVE').length;
  const totalApplications = applications.length;
  const interviewApplications = applications.filter((app: any) => app.status === 'INTERVIEW' || app.status === 'SCREENING').length;

  // Загружаем отклики для кандидата
  const { data: candidateApplicationsData, isLoading: applicationsLoading, error: applicationsError } = useQuery({
    queryKey: ['applications', 'my', 'candidate'],
    queryFn: () => applicationApi.getMyApplications(),
    enabled: user?.role === 'CANDIDATE' && !!user,
  });

  // Загружаем избранные вакансии для кандидата
  const { data: favoritesData } = useQuery({
    queryKey: ['favorites', 'my'],
    queryFn: () => favoriteApi.getMyFavoriteJobs(),
    enabled: user?.role === 'CANDIDATE' && !!user,
  });

  const { data: profileViewersData } = useQuery({
    queryKey: ['candidates', 'me', 'profile-viewers'],
    queryFn: () => candidateApi.getMyProfileViewers(),
    enabled: user?.role === 'CANDIDATE' && !!user,
  });

  const candidateApplications = candidateApplicationsData?.data || [];
  const favoriteJobs = favoritesData?.data || [];

  // Debug: Log applications data for candidate
  React.useEffect(() => {
    if (user?.role === 'CANDIDATE') {
      console.log('[Dashboard Candidate] Applications debug:', {
        count: candidateApplications.length,
        applications: candidateApplications,
        rawData: candidateApplicationsData,
        error: applicationsError,
        userProfileId: user?.profile?.id,
        userId: user?.id
      });
    }
  }, [candidateApplications, candidateApplicationsData, applicationsError, user]);

  // Загружаем приглашения для кандидата
  const { data: invitationsData } = useQuery({
    queryKey: ['invitations', 'my'],
    queryFn: () => invitationApi.getMyInvitations(),
    enabled: user?.role === 'CANDIDATE' && !!user,
  });

  const invitations = invitationsData?.data || [];
  const pendingInvitations = invitations.filter((inv: any) => inv.status === 'PENDING');

  // Мутация для изменения статуса вакансии
  const updateJobStatusMutation = useMutation({
    mutationFn: async ({ jobId, status }: { jobId: number; status: string }) => {
      return await jobApi.updateJob(jobId, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company'] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });

  const toggleJobStatus = async (job: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = job.status === 'DRAFT' ? 'ACTIVE' : job.status === 'ACTIVE' ? 'DRAFT' : job.status;
    updateJobStatusMutation.mutate({ jobId: job.id, status: newStatus });
  };

  if (!user) {
    return null;
  }

  // Получаем имя пользователя
  const getUserName = () => {
    if (user.profile?.firstName && user.profile?.lastName) {
      return `${user.profile.firstName} ${user.profile.lastName}`;
    }
    return user.email.split('@')[0];
  };

  const userName = getUserName();
  const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  // HR Dashboard
  if (user.role === 'HR' || user.role === 'ADMIN') {
    const recentApplications = applications.slice(0, 3);
    const recentJobs = jobs.slice(0, 3);

    return (
      <DashboardContainer>
        <NoiseOverlay />
        <AuroraBlob $top="-10%" $left="-10%" $gradient="radial-gradient(circle, rgba(0,122,255,0.15), transparent 70%)" />
        <AuroraBlob $bottom="-10%" $right="-10%" $gradient="radial-gradient(circle, rgba(175,82,222,0.15), transparent 70%)" $width="60vw" $height="60vw" />

        <MainContent>
          <Header>
            <WelcomeText>
              <motion.h1
                initial="hidden"
                animate="visible"
                variants={fadeUpVariants}
                transition={{ duration: 0.6 }}
              >
                Добро пожаловать, {userName}! 👋
              </motion.h1>
              <motion.p
                initial="hidden"
                animate="visible"
                variants={fadeUpVariants}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                {totalApplications > 0 
                  ? `У вас ${totalApplications} ${totalApplications === 1 ? 'новая заявка' : totalApplications < 5 ? 'новые заявки' : 'новых заявок'} от кандидатов.`
                  : 'Начните размещать вакансии, чтобы получать отклики.'}
              </motion.p>
            </WelcomeText>
          </Header>

          {/* Stats Grid */}
          <StatsGrid>
            <StatCard
              initial="hidden"
              animate="visible"
              variants={fadeUpVariants}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <StatHeader>
                <StatIcon $bg="rgba(0,122,255,0.1)" $color="#007AFF">
                  <Eye size={20} />
                </StatIcon>
                <TrendBadge>
                  <TrendingUp size={12} /> +12%
                </TrendBadge>
              </StatHeader>
              <StatValue>{totalViews.toLocaleString()}</StatValue>
              <StatLabel>Просмотров вакансий</StatLabel>
            </StatCard>

            <StatCard
              initial="hidden"
              animate="visible"
              variants={fadeUpVariants}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <StatHeader>
                <StatIcon $bg="rgba(175,82,222,0.1)" $color="#AF52DE">
                  <Briefcase size={20} />
                </StatIcon>
              </StatHeader>
              <StatValue>{activeJobs}</StatValue>
              <StatLabel>Активных вакансий</StatLabel>
            </StatCard>

            <StatCard
              initial="hidden"
              animate="visible"
              variants={fadeUpVariants}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <StatHeader>
                <StatIcon $bg="rgba(255,149,0,0.1)" $color="#FF9500">
                  <FileText size={20} />
                </StatIcon>
              </StatHeader>
              <StatValue>{totalApplications}</StatValue>
              <StatLabel>Всего заявок</StatLabel>
            </StatCard>

            <StatCard
              initial="hidden"
              animate="visible"
              variants={fadeUpVariants}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <StatHeader>
                <StatIcon $bg="rgba(52,199,89,0.1)" $color="#34C759">
                  <CheckCircle size={20} />
                </StatIcon>
              </StatHeader>
              <StatValue>{interviewApplications}</StatValue>
              <StatLabel>На собеседовании</StatLabel>
            </StatCard>
          </StatsGrid>

          {/* Company/User Info Section */}
          <GlassPanel
            initial="hidden"
            animate="visible"
            variants={fadeUpVariants}
            transition={{ duration: 0.6, delay: 0.6 }}
            style={{ marginBottom: '24px' }}
          >
            <PanelHeader>
              <PanelTitle>
                <Building2 size={24} style={{ marginRight: '12px' }} />
                {company ? 'Информация о компании' : 'Информация о вас'}
              </PanelTitle>
              {company && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/company/edit')}
                >
                  <Edit size={16} />
                  Редактировать
                </Button>
              )}
            </PanelHeader>
            {company ? (
              <div>
                <InfoGrid>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#86868b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Название</div>
                    <div style={{ fontSize: '20px', fontWeight: 600, color: '#1d1d1f' }}>{company.name}</div>
                  </div>
                  {company.employeeCount && (
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#86868b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Штат сотрудников</div>
                      <div style={{ fontSize: '20px', fontWeight: 600, color: '#1d1d1f' }}>{company.employeeCount}</div>
                    </div>
                  )}
                  {company.address && (
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#86868b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Адрес</div>
                      <div style={{ fontSize: '17px', color: '#1d1d1f' }}>{company.address}</div>
                    </div>
                  )}
                </InfoGrid>
                {company.description && (
                  <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#86868b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Описание</div>
                    <div style={{ fontSize: '17px', color: '#1d1d1f', lineHeight: '1.6' }}>{company.description}</div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <InfoGrid>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#86868b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</div>
                    <div style={{ fontSize: '17px', color: '#1d1d1f' }}>{user.email}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#86868b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Роль</div>
                    <div style={{ fontSize: '17px', color: '#1d1d1f' }}>{user.role === 'HR' ? 'HR-менеджер' : user.role === 'ADMIN' ? 'Администратор' : 'Кандидат'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#86868b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Дата регистрации</div>
                    <div style={{ fontSize: '17px', color: '#1d1d1f' }}>
                      {new Date(user.createdAt).toLocaleDateString('ru-RU', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                </InfoGrid>
                <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                  <EmptyState style={{ padding: '24px' }}>
                    <Building2 size={48} color="#86868b" style={{ marginBottom: '16px' }} />
                    <EmptyStateTitle>У вас еще нет компании</EmptyStateTitle>
                    <EmptyStateText>
                      Создайте компанию, чтобы начать размещать вакансии и искать таланты
                    </EmptyStateText>
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => navigate('/company/create')}
                    >
                      <Plus size={16} />
                      Создать компанию
                    </Button>
                  </EmptyState>
                </div>
              </div>
            )}
          </GlassPanel>

          {/* Content Split */}
          <ContentSplit>
            {/* Left: Recent Applications */}
            <GlassPanel
              initial="hidden"
              animate="visible"
              variants={fadeUpVariants}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <PanelHeader>
                <PanelTitle>Мои заявки</PanelTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/dashboard')}
                >
                  Все заявки
                </Button>
              </PanelHeader>
              {recentApplications.length > 0 ? (
                <div>
                  {recentApplications.map((app: any) => (
                    <AppItem
                      key={app.id}
                      onClick={() => {
                        const jobId = app.jobId || app.job?.id;
                        if (jobId) {
                          navigate(`/jobs/${jobId}/hiring`);
                        }
                      }}
                    >
                      <CompanyInfo>
                        <CompanyLogo $bg="#FFE5D9" $color="#FF3B30">
                          {app.candidateProfile?.firstName?.[0] || 'C'}
                        </CompanyLogo>
                        <JobDetails>
                          <h4>
                            {app.candidateProfile?.firstName} {app.candidateProfile?.lastName}
                          </h4>
                          <span>{app.job?.title || 'Вакансия'}</span>
                        </JobDetails>
                      </CompanyInfo>
                      <StatusBadge $status={app.status}>
                        {app.status === 'APPLIED' ? 'Отправлено' :
                         app.status === 'SCREENING' ? 'На рассмотрении' :
                         app.status === 'INTERVIEW' ? 'Интервью' :
                         app.status === 'OFFER' ? 'Предложение' :
                         app.status === 'REJECTED' ? 'Отклонено' : app.status}
                      </StatusBadge>
                    </AppItem>
                  ))}
                </div>
              ) : (
                <EmptyState>
                  <FileText size={48} color="#86868b" style={{ marginBottom: '16px' }} />
                  <EmptyStateTitle>Пока нет заявок</EmptyStateTitle>
                  <EmptyStateText>
                    Создайте вакансию, чтобы начать получать отклики
                  </EmptyStateText>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => navigate('/jobs/create')}
                  >
                    <Plus size={16} />
                    Создать вакансию
                  </Button>
                </EmptyState>
              )}
            </GlassPanel>

            {/* Right: Company Widget */}
            <div>
              <GlassPanel
                initial="hidden"
                animate="visible"
                variants={fadeUpVariants}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <PanelHeader>
                  <PanelTitle>Компания</PanelTitle>
                  <MoreHorizontal size={20} color="#86868b" />
                </PanelHeader>
                {company ? (
                  <>
                    <div style={{ textAlign: 'center', margin: '24px 0' }}>
                      <CompanyLogo $bg="linear-gradient(135deg, #007AFF, #5856D6)" $color="#fff" style={{ margin: '0 auto 16px', width: '80px', height: '80px', fontSize: '32px' }}>
                        {company.name[0].toUpperCase()}
                      </CompanyLogo>
                      <ProfileName>{company.name}</ProfileName>
                      {company.employeeCount && (
                        <ProfileTitle>{company.employeeCount} сотрудников</ProfileTitle>
                      )}
                    </div>
                    <EditButton onClick={() => navigate('/company/edit')}>
                      Редактировать <ArrowUpRight size={16} />
                    </EditButton>
                  </>
                ) : (
                  <EmptyState>
                    <Building2 size={48} color="#86868b" style={{ marginBottom: '16px' }} />
                    <EmptyStateTitle>Нет компании</EmptyStateTitle>
                    <EmptyStateText>
                      Создайте компанию, чтобы начать размещать вакансии
                    </EmptyStateText>
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => navigate('/company/create')}
                    >
                      <Plus size={16} />
                      Создать компанию
                    </Button>
                  </EmptyState>
                )}
              </GlassPanel>
            </div>
          </ContentSplit>

          {/* Jobs Section */}
          <GlassPanel
            initial="hidden"
            animate="visible"
            variants={fadeUpVariants}
            transition={{ duration: 0.6, delay: 0.9 }}
            style={{ marginTop: '24px' }}
          >
            <PanelHeader>
              <PanelTitle>Мои вакансии</PanelTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/jobs/create')}
              >
                <Plus size={16} />
                Создать вакансию
              </Button>
            </PanelHeader>
            {jobsLoading ? (
              <EmptyState>
                <EmptyStateText>Загрузка вакансий...</EmptyStateText>
              </EmptyState>
            ) : jobs.length > 0 ? (
              <JobsGrid>
                {jobs.map((job: any) => (
                  <div key={job.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/jobs/${job.id}`)}>
                    <UIJobCard
                      id={job.id}
                      title={job.title}
                      description={job.description}
                      company={job.company?.name}
                      companyAddress={job.company?.address}
                      salaryMin={job.salaryMin}
                      salaryMax={job.salaryMax}
                      currency={job.currency}
                      skills={job.requiredSkills?.map((js: any) => ({
                        id: js.skill.id,
                        name: js.skill.name,
                      })) || []}
                      workSchedule={job.workSchedule}
                      workMode={job.workMode}
                      workType={job.workType}
                      experienceLevel={job.experienceLevel}
                      onClick={() => navigate(`/jobs/${job.id}`)}
                    />
                  </div>
                ))}
              </JobsGrid>
            ) : (
              <EmptyState>
                <Briefcase size={48} color="#86868b" style={{ marginBottom: '16px' }} />
                <EmptyStateTitle>У вас пока нет вакансий</EmptyStateTitle>
                <EmptyStateText>
                  Создайте вакансию, чтобы начать привлекать таланты
                </EmptyStateText>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => navigate('/jobs/create')}
                  style={{ marginTop: '16px' }}
                >
                  <Plus size={16} />
                  Создать первую вакансию
                </Button>
              </EmptyState>
            )}
          </GlassPanel>
        </MainContent>
      </DashboardContainer>
    );
  }

  // CANDIDATE Dashboard
  if (user.role === 'CANDIDATE') {
    const profileViews = profileViewersData?.data?.totalViews ?? user.profile?.viewsCount ?? 0;
    const allViewers = profileViewersData?.data?.viewers || [];
    const recentViewers = allViewers.slice(0, 12);
    const uniqueViewers = profileViewersData?.data?.uniqueViewers ?? recentViewers.length;
    const totalApplicationsCount = candidateApplications.length;
    const activeApplications = candidateApplications.filter((app: any) => 
      app.status === 'INTERVIEW' || app.status === 'SCREENING' || app.status === 'OFFER'
    ).length;
    const favoriteCount = favoriteJobs.length;
    const applicationHistory = candidateApplications
      .flatMap((app: any) =>
        (app.statusHistory || []).map((history: any) => ({
          ...history,
          applicationId: app.id,
          jobTitle: app.job?.title || 'Вакансия',
          companyName: app.job?.company?.name || 'Компания',
          currentStatus: app.status,
        }))
      )
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 8);

  // Вычисляем процент заполненности профиля
  const calculateProfileCompletion = () => {
    if (!user.profile) return 0;
    let filled = 0;
    let total = 6;
    
    if (user.profile.firstName) filled++;
    if (user.profile.lastName) filled++;
    if (user.profile.headline) filled++;
    if (user.profile.summary) filled++;
    if (user.profile.skills && user.profile.skills.length > 0) filled++;
    if (user.profile.workExperiences && user.profile.workExperiences.length > 0) filled++;
    
    return Math.round((filled / total) * 100);
  };

  const profileCompletion = calculateProfileCompletion();
  const recentApplications = candidateApplications.slice(0, 3);

  return (
    <DashboardContainer>
      <NoiseOverlay />
      <AuroraBlob $top="-10%" $left="-10%" $gradient="radial-gradient(circle, rgba(0,122,255,0.15), transparent 70%)" />
      <AuroraBlob $bottom="-10%" $right="-10%" $gradient="radial-gradient(circle, rgba(175,82,222,0.15), transparent 70%)" $width="60vw" $height="60vw" />

      <MainContent>
        <Header>
          <WelcomeText>
            <motion.h1
              initial="hidden"
              animate="visible"
              variants={fadeUpVariants}
              transition={{ duration: 0.6 }}
            >
              Добро пожаловать, {userName}! 👋
            </motion.h1>
            <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeUpVariants}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {activeApplications > 0 
                ? `У вас ${activeApplications} ${activeApplications === 1 ? 'активный отклик' : 'активных отклика'}.`
                : 'Начните искать вакансии, которые подходят вам.'}
            </motion.p>
          </WelcomeText>
        </Header>

        {/* Stats Grid */}
        <StatsGrid>
          <StatCard
            initial="hidden"
            animate="visible"
            variants={fadeUpVariants}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <StatHeader>
              <StatIcon $bg="rgba(0,122,255,0.1)" $color="#007AFF">
                <Eye size={20} />
              </StatIcon>
              <TrendBadge>
                <TrendingUp size={12} /> HR: {uniqueViewers}
              </TrendBadge>
            </StatHeader>
            <StatValue>{profileViews.toLocaleString()}</StatValue>
            <StatLabel>Просмотров профиля</StatLabel>
          </StatCard>

          <StatCard
            initial="hidden"
            animate="visible"
            variants={fadeUpVariants}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <StatHeader>
              <StatIcon $bg="rgba(175,82,222,0.1)" $color="#AF52DE">
                <Briefcase size={20} />
              </StatIcon>
            </StatHeader>
            <StatValue>{totalApplicationsCount}</StatValue>
            <StatLabel>Активных откликов</StatLabel>
          </StatCard>

          <StatCard
            initial="hidden"
            animate="visible"
            variants={fadeUpVariants}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <StatHeader>
              <StatIcon $bg="rgba(255,149,0,0.1)" $color="#FF9500">
                <CheckCircle size={20} />
              </StatIcon>
            </StatHeader>
            <StatValue>{activeApplications}</StatValue>
            <StatLabel>На собеседовании</StatLabel>
          </StatCard>

          <StatCard
            initial="hidden"
            animate="visible"
            variants={fadeUpVariants}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <StatHeader>
              <StatIcon $bg="rgba(255,59,48,0.1)" $color="#FF3B30">
                <Heart size={20} />
              </StatIcon>
            </StatHeader>
            <StatValue>{favoriteCount}</StatValue>
            <StatLabel>Избранных вакансий</StatLabel>
          </StatCard>
        </StatsGrid>

        <GlassPanel
          initial="hidden"
          animate="visible"
          variants={fadeUpVariants}
          transition={{ duration: 0.6, delay: 0.55 }}
          style={{ marginBottom: '24px' }}
        >
          <PanelHeader>
            <PanelTitle>Компании, которые смотрели профиль</PanelTitle>
          </PanelHeader>
          {recentViewers.length === 0 ? (
            <div style={{ fontSize: 14, color: '#9ca3af' }}>
              Пока нет просмотров от HR.
            </div>
          ) : (
            <HistoryList>
              {recentViewers.map((viewer: any) => (
                <HistoryRow key={`viewer-company-${viewer.id}`}>
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: '#1d1d1f',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {viewer.hr?.company?.name || 'Компания не указана'}
                    </div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>
                      HR: {viewer.hr?.email || 'неизвестно'}
                    </div>
                    <div style={{ fontSize: 11, color: '#9ca3af' }}>
                      Первый просмотр: {new Date(viewer.firstViewedAt).toLocaleString('ru-RU', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#1d1d1f' }}>x{viewer.viewsCount}</div>
                    <div style={{ fontSize: 11, color: '#9ca3af' }}>
                      {new Date(viewer.lastViewedAt).toLocaleString('ru-RU', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </HistoryRow>
              ))}
            </HistoryList>
          )}
          {allViewers.length > recentViewers.length && (
            <div style={{ marginTop: 10, fontSize: 12, color: '#9ca3af' }}>
              Показано {recentViewers.length} из {allViewers.length}
            </div>
          )}
        </GlassPanel>

        {/* User Info Section */}
        <GlassPanel
          initial="hidden"
          animate="visible"
          variants={fadeUpVariants}
          transition={{ duration: 0.6, delay: 0.6 }}
          style={{ marginBottom: '24px' }}
        >
          <PanelHeader>
            <PanelTitle>
              <User size={24} style={{ marginRight: '12px' }} />
              Информация о вас
            </PanelTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/profile/edit')}
            >
              <Edit size={16} />
              Редактировать
            </Button>
          </PanelHeader>
          <div>
            <InfoGrid>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#86868b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</div>
                <div style={{ fontSize: '17px', color: '#1d1d1f' }}>{user.email}</div>
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#86868b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Имя</div>
                <div style={{ fontSize: '17px', color: '#1d1d1f' }}>
                  {user.profile?.firstName && user.profile?.lastName
                    ? `${user.profile.firstName} ${user.profile.lastName}`
                    : 'Не указано'}
                </div>
              </div>
              {user.profile?.headline && (
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#86868b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Заголовок</div>
                  <div style={{ fontSize: '17px', color: '#1d1d1f' }}>{user.profile.headline}</div>
                </div>
              )}
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#86868b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Статус поиска</div>
                <div style={{ fontSize: '17px', color: '#1d1d1f' }}>
                  {user.profile?.isOpenToWork ? 'Ищу работу' : 'Не ищу работу'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#86868b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Дата регистрации</div>
                <div style={{ fontSize: '17px', color: '#1d1d1f' }}>
                  {new Date(user.createdAt).toLocaleDateString('ru-RU', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#86868b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Telegram (для связи)</div>
                <FormRow>
                  <span style={{ fontSize: '17px', color: '#1d1d1f' }}>@</span>
                  <input
                    type="text"
                    value={telegramInput}
                    onChange={(e) => setTelegramInput(e.target.value.replace(/^@/, '').replace(/[^a-zA-Z0-9_]/g, ''))}
                    placeholder="username"
                    style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '15px', width: '160px' }}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateMeMutation.mutate(telegramInput.trim() || null)}
                    disabled={updateMeMutation.isPending}
                  >
                    {updateMeMutation.isPending ? 'Сохранение...' : 'Сохранить'}
                  </Button>
                </FormRow>
              </div>
              <div style={{ gridColumn: '1 / -1', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#86868b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Сменить пароль</div>
                <FormRow>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Новый пароль (мин. 6 символов)"
                    style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '15px', width: '220px' }}
                  />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Повторите пароль"
                    style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '15px', width: '220px' }}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (newPassword.length < 6) {
                        alert('Пароль должен быть не менее 6 символов');
                        return;
                      }
                      if (newPassword !== confirmPassword) {
                        alert('Пароли не совпадают');
                        return;
                      }
                      changePasswordMutation.mutate(newPassword);
                    }}
                    disabled={changePasswordMutation.isPending || !newPassword || !confirmPassword}
                  >
                    {changePasswordMutation.isPending ? 'Сохранение...' : 'Сменить пароль'}
                  </Button>
                </FormRow>
              </div>
            </InfoGrid>
            {user.profile?.summary && (
              <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#86868b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>О себе</div>
                <div style={{ fontSize: '17px', color: '#1d1d1f', lineHeight: '1.6' }}>{user.profile.summary}</div>
              </div>
            )}
          </div>
        </GlassPanel>

        {/* Resume Builder Card */}
        <GlassPanel
          initial="hidden"
          animate="visible"
          variants={fadeUpVariants}
          transition={{ duration: 0.6, delay: 0.65 }}
          style={{ marginBottom: '24px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff' }}
        >
          <ResumePromo>
            <div style={{ flex: 1, minWidth: '250px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: '48px', height: '48px', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileEdit size={24} color="#fff" />
                </div>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: '#fff' }}>Конструктор резюме</h3>
                  <p style={{ fontSize: '14px', margin: 0, color: 'rgba(255, 255, 255, 0.8)' }}>Создайте профессиональное резюме за 5 минут</p>
                </div>
              </div>
              <p style={{ fontSize: '15px', lineHeight: '1.6', color: 'rgba(255, 255, 255, 0.9)', margin: 0 }}>
                Заполните данные, посмотрите превью в реальном времени и экспортируйте в PDF. Ваше резюме готово к отправке!
              </p>
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/resume')}
              style={{ 
                background: '#fff', 
                color: '#667eea',
                fontWeight: 600,
                padding: '12px 24px',
                whiteSpace: 'nowrap'
              }}
            >
              <FileEdit size={18} style={{ marginRight: '8px' }} />
              Создать резюме
            </Button>
          </ResumePromo>
        </GlassPanel>

        {/* Content Split */}
        <ContentSplit>
          {/* Left: Recent Applications */}
          <GlassPanel
            initial="hidden"
            animate="visible"
            variants={fadeUpVariants}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <PanelHeader>
              <PanelTitle>Мои отклики</PanelTitle>
              {candidateApplications.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/dashboard')}
                >
                  Все отклики ({candidateApplications.length})
                </Button>
              )}
            </PanelHeader>
            {applicationsLoading ? (
              <div style={{ textAlign: 'center', padding: '48px', color: '#6b7280' }}>
                Загрузка откликов...
              </div>
            ) : recentApplications.length > 0 ? (
              <div>
                {recentApplications.map((app: any) => (
                  <AppItem
                    key={app.id}
                    onClick={() => navigate(`/applications/${app.id}/tracking`)}
                  >
                    <CompanyInfo>
                      <CompanyLogo $bg="#E3F2FD" $color="#2196F3">
                        {app.job?.company?.name?.[0] || app.job?.title?.[0] || 'C'}
                      </CompanyLogo>
                      <JobDetails>
                        <h4>{app.job?.title || 'Вакансия'}</h4>
                        <span>{app.job?.company?.name || 'Компания'}</span>
                      </JobDetails>
                    </CompanyInfo>
                    <StatusBadge $status={app.status}>
                      {app.status === 'APPLIED' ? 'Отправлено' :
                       app.status === 'SCREENING' ? 'На рассмотрении' :
                       app.status === 'INTERVIEW' ? 'Интервью' :
                       app.status === 'OFFER' ? 'Предложение' :
                       app.status === 'HIRED' ? 'Принят' :
                       app.status === 'REJECTED' ? 'Отклонено' : app.status}
                    </StatusBadge>
                  </AppItem>
                ))}
              </div>
            ) : (
              <EmptyState>
                <Briefcase size={48} color="#86868b" style={{ marginBottom: '16px' }} />
                <EmptyStateTitle>У вас пока нет откликов</EmptyStateTitle>
                <EmptyStateText>
                  Найдите подходящие вакансии и отправьте отклик
                </EmptyStateText>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => navigate('/jobs')}
                >
                  Найти вакансии
                </Button>
              </EmptyState>
            )}
          </GlassPanel>

          {/* Right: Profile Widget */}
          <ProfileWidget
            initial="hidden"
            animate="visible"
            variants={fadeUpVariants}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <PanelHeader>
              <PanelTitle>Ваш профиль</PanelTitle>
              <MoreHorizontal size={20} color="#86868b" />
            </PanelHeader>
            
            <div style={{ textAlign: 'center', margin: '24px 0' }}>
              <ProfileAvatar>{userInitials}</ProfileAvatar>
              <ProfileName>{userName}</ProfileName>
              <ProfileTitle>{user.profile?.headline || 'Кандидат'}</ProfileTitle>
            </div>
            <ProfileProgress>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 8, fontWeight: 500 }}>
                <span>Заполненность</span>
                <span>{profileCompletion}%</span>
              </div>
              <ProgressBar>
                <ProgressFill $width={profileCompletion} />
              </ProgressBar>
              <ProgressText>
                {profileCompletion < 50 
                  ? 'Добавьте больше информации в профиль, чтобы повысить видимость.'
                  : profileCompletion < 100
                  ? 'Добавьте сертификаты и пет-проекты, чтобы повысить видимость на 20%.'
                  : 'Ваш профиль полностью заполнен!'}
              </ProgressText>

              <div style={{ marginTop: 16, textAlign: 'left' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#86868b', marginBottom: 8 }}>
                  Кто смотрел профиль
                </div>
                {recentViewers.length === 0 ? (
                  <div style={{ fontSize: 12, color: '#9ca3af' }}>Пока нет просмотров от HR.</div>
                ) : (
                  <ViewersList>
                    {recentViewers.map((viewer: any) => (
                      <ViewerItem key={viewer.id}>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#1d1d1f', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {viewer.hr?.company?.name || viewer.hr?.email || 'HR'}
                          </div>
                          <div style={{ fontSize: 11, color: '#86868b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {viewer.hr?.email}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: '#1d1d1f' }}>x{viewer.viewsCount}</div>
                          <div style={{ fontSize: 10, color: '#9ca3af' }}>
                            {new Date(viewer.lastViewedAt).toLocaleDateString('ru-RU')}
                          </div>
                        </div>
                      </ViewerItem>
                    ))}
                  </ViewersList>
                )}
              </div>
            </ProfileProgress>
            <EditButton onClick={() => navigate('/profile/edit')}>
              Редактировать <ArrowUpRight size={16} />
            </EditButton>
          </ProfileWidget>
        </ContentSplit>

        {/* Favorite Jobs */}
        {favoriteJobs.length > 0 && (
          <GlassPanel
            initial="hidden"
            animate="visible"
            variants={fadeUpVariants}
            transition={{ duration: 0.6, delay: 0.8 }}
            style={{ marginTop: '24px' }}
          >
            <PanelHeader>
              <PanelTitle>Избранные вакансии</PanelTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
              >
                Все избранные
              </Button>
            </PanelHeader>
            <JobsGrid>
              {favoriteJobs.slice(0, 3).map((job: any) => (
                <div key={job.id} onClick={() => navigate(`/jobs/${job.id}`)}>
                  <UIJobCard
                    id={job.id}
                    title={job.title}
                    description={job.description}
                    company={job.company?.name}
                    companyAddress={job.company?.address}
                    salaryMin={job.salaryMin}
                    salaryMax={job.salaryMax}
                    currency={job.currency}
                    skills={job.requiredSkills?.map((js: any) => ({
                      id: js.skill.id,
                      name: js.skill.name,
                    })) || []}
                    workSchedule={job.workSchedule}
                    workMode={job.workMode}
                    workType={job.workType}
                    experienceLevel={job.experienceLevel}
                    onClick={() => navigate(`/jobs/${job.id}`)}
                  />
                </div>
              ))}
            </JobsGrid>
          </GlassPanel>
        )}

        {/* Invitations Section */}
        {pendingInvitations.length > 0 && (
          <GlassPanel
            initial="hidden"
            animate="visible"
            variants={fadeUpVariants}
            transition={{ duration: 0.6, delay: 0.9 }}
            style={{ marginTop: '24px' }}
          >
            <PanelHeader>
              <PanelTitle>
                <UserPlus size={20} style={{ marginRight: '8px' }} />
                Приглашения от работодателей
              </PanelTitle>
              <Badge variant="success" size="sm">
                {pendingInvitations.length} нов{pendingInvitations.length === 1 ? 'ое' : 'ых'}
              </Badge>
            </PanelHeader>
            <div>
              {pendingInvitations.map((invitation: any) => {
                const acceptMutation = useMutation({
                  mutationFn: () => invitationApi.acceptInvitation(invitation.id),
                  onSuccess: (data) => {
                    queryClient.invalidateQueries({ queryKey: ['invitations', 'my'] });
                    queryClient.invalidateQueries({ queryKey: ['applications', 'my', 'candidate'] });
                    // Redirect to tracking page if application was created
                    if (data?.data?.application?.id) {
                      navigate(`/applications/${data.data.application.id}/tracking`);
                    } else {
                      alert('Приглашение принято! Заявка создана автоматически.');
                    }
                  },
                  onError: (error: any) => {
                    alert(error.response?.data?.error || 'Не удалось принять приглашение');
                  },
                });

                const declineMutation = useMutation({
                  mutationFn: () => invitationApi.declineInvitation(invitation.id),
                  onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ['invitations', 'my'] });
                    alert('Приглашение отклонено');
                  },
                  onError: (error: any) => {
                    alert(error.response?.data?.error || 'Не удалось отклонить приглашение');
                  },
                });

                return (
                  <AppItem
                    key={invitation.id}
                    onClick={() => navigate(`/jobs/${invitation.job?.id}`)}
                    style={{ marginBottom: '12px' }}
                  >
                    <CompanyInfo>
                      <CompanyLogo $bg="#FFF4E6" $color="#FF9500">
                        {invitation.job?.title?.[0] || 'J'}
                      </CompanyLogo>
                      <JobDetails>
                        <h4>{invitation.job?.title || 'Вакансия'}</h4>
                        <span>
                          Приглашение от {invitation.invitedBy?.email || 'HR'}
                        </span>
                        {invitation.message && (
                          <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                            {invitation.message}
                          </div>
                        )}
                      </JobDetails>
                    </CompanyInfo>
                    <ItemActions>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          acceptMutation.mutate();
                        }}
                        disabled={acceptMutation.isPending}
                      >
                        <CheckCircle size={14} style={{ marginRight: '4px' }} />
                        Принять
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          declineMutation.mutate();
                        }}
                        disabled={declineMutation.isPending}
                      >
                        <X size={14} style={{ marginRight: '4px' }} />
                        Отклонить
                      </Button>
                    </ItemActions>
                  </AppItem>
                );
              })}
            </div>
          </GlassPanel>
        )}

        <GlassPanel
          initial="hidden"
          animate="visible"
          variants={fadeUpVariants}
          transition={{ duration: 0.6, delay: 1.0 }}
          style={{ marginTop: '24px' }}
        >
          <PanelHeader>
            <PanelTitle>История откликов</PanelTitle>
          </PanelHeader>
          {applicationHistory.length === 0 ? (
            <div style={{ color: '#9ca3af', fontSize: 14 }}>
              Пока нет изменений по статусам откликов.
            </div>
          ) : (
            <HistoryList>
              {applicationHistory.map((item: any) => (
                <HistoryRow key={`${item.applicationId}-${item.id}`}>
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: '#1d1d1f',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {item.jobTitle}
                    </div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>
                      {statusLabel(item.fromStatus)} → {statusLabel(item.toStatus)}
                    </div>
                    <div style={{ fontSize: 11, color: '#9ca3af' }}>
                      {item.companyName}
                      {item.changedBy?.email ? ` · ${item.changedBy.email}` : ''}
                      {item.changedByRole ? ` (${item.changedByRole})` : ''}
                    </div>
                    {item.note && (
                      <div style={{ fontSize: 11, color: '#6b7280', marginTop: 4 }}>
                        {item.note}
                      </div>
                    )}
                    <div style={{ marginTop: 6 }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/applications/${item.applicationId}/tracking`)}
                      >
                        Открыть трекинг
                      </Button>
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: '#9ca3af', flexShrink: 0 }}>
                    {new Date(item.createdAt).toLocaleString('ru-RU', {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </HistoryRow>
              ))}
            </HistoryList>
          )}
        </GlassPanel>
      </MainContent>
    </DashboardContainer>
  );
  }

  // Fallback for other roles
  return (
    <DashboardContainer>
      <MainContent>
        <div style={{ textAlign: 'center', padding: '48px', color: '#6b7280' }}>
          Dashboard не доступен для вашей роли.
        </div>
      </MainContent>
    </DashboardContainer>
  );
};
