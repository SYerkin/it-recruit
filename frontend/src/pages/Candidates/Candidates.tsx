import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { candidateApi } from '@shared/api';
import { User, Mail, MapPin, Briefcase, Search, Sparkles, TrendingUp } from 'lucide-react';
import { Card } from '@shared/ui/Card';
import { Badge } from '@shared/ui/Badge';
import { Input } from '@shared/ui/Input';
import { Button } from '@shared/ui/Button';
import { useAuthStore } from '@app/store/auth.store';

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-2xl) var(--spacing-lg) var(--spacing-4xl);
  position: relative;
`;

const DecorativeBlob = styled.div<{ $top?: string; $left?: string; $right?: string; $color: string }>`
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  filter: blur(80px);
  opacity: 0.3;
  z-index: 0;
  animation: ${float} 8s ease-in-out infinite;
  ${({ $top }) => $top && `top: ${$top};`}
  ${({ $left }) => $left && `left: ${$left};`}
  ${({ $right }) => $right && `right: ${$right};`}
  pointer-events: none;
`;

const Header = styled.div`
  margin-bottom: var(--spacing-3xl);
  position: relative;
  z-index: 1;
  animation: ${fadeIn} 0.6s ease-out;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
`;

const Title = styled.h1`
  font-size: 48px;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin: 0;
  color: var(--color-text-primary);
  background: linear-gradient(135deg, #007AFF 0%, #5856D6 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const TitleIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(0, 122, 255, 0.1), rgba(88, 86, 214, 0.1));
  display: flex;
  align-items: center;
  justify-content: center;
  color: #007AFF;
`;

const Subtitle = styled.p`
  font-size: 20px;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin: 0;
`;

const StatsBar = styled.div`
  display: flex;
  gap: var(--spacing-xl);
  margin-top: var(--spacing-xl);
  padding: var(--spacing-lg);
  background: rgba(0, 122, 255, 0.05);
  border-radius: 16px;
  border: 1px solid rgba(0, 122, 255, 0.1);
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--color-text-primary);
  font-weight: 600;
  
  svg {
    color: #007AFF;
  }
`;

const SearchSection = styled.div`
  margin-bottom: var(--spacing-3xl);
  display: flex;
  gap: var(--spacing-md);
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const CandidatesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: var(--spacing-xl);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CandidateCard = styled(Card)`
  padding: var(--spacing-2xl);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.05);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #007AFF, #5856D6);
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 122, 255, 0.15);
    border-color: rgba(0, 122, 255, 0.2);
    
    &::before {
      transform: scaleX(1);
    }
  }
`;

const CandidateHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
`;

const CandidateAvatar = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-system-blue), #5856D6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 24px;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
  transition: transform 0.3s ease;
  
  ${CandidateCard}:hover & {
    transform: scale(1.1) rotate(5deg);
  }
`;

const CandidateInfo = styled.div`
  flex: 1;
`;

const CandidateName = styled.h3`
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: var(--spacing-xs);
  color: var(--color-text-primary);
`;

const CandidateHeadline = styled.p`
  font-size: 15px;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-sm);
`;

const CandidateMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  font-size: 14px;
  color: var(--color-text-secondary);
  margin-top: var(--spacing-md);
`;

const SkillsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
`;

const EmptyState = styled.div`
  text-align: center;
  padding: var(--spacing-4xl);
  color: var(--color-text-secondary);
`;

const LoadingState = styled.div`
  text-align: center;
  padding: var(--spacing-4xl);
  color: var(--color-text-secondary);
`;

export const Candidates: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = React.useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['candidates', searchQuery],
    queryFn: () => candidateApi.getCandidates({ search: searchQuery || undefined }),
    enabled: user?.role === 'HR' || user?.role === 'ADMIN',
  });

  const candidates = data?.data || [];

  if (user?.role !== 'HR' && user?.role !== 'ADMIN') {
    return (
      <Container>
        <EmptyState>У вас нет доступа к этой странице</EmptyState>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container>
        <LoadingState>Загрузка кандидатов...</LoadingState>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <EmptyState>Ошибка загрузки кандидатов</EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <DecorativeBlob $top="-100px" $left="-100px" $color="rgba(0, 122, 255, 0.2)" />
      <DecorativeBlob $top="200px" $right="-150px" $color="rgba(88, 86, 214, 0.2)" />
      
      <Header>
        <TitleWrapper>
          <TitleIcon>
            <User size={28} />
          </TitleIcon>
          <Title>Кандидаты</Title>
        </TitleWrapper>
        <Subtitle>Просматривайте профили кандидатов и находите подходящих специалистов</Subtitle>
        {candidates.length > 0 && (
          <StatsBar>
            <StatItem>
              <TrendingUp size={20} />
              <span>{candidates.length} {candidates.length === 1 ? 'кандидат' : candidates.length < 5 ? 'кандидата' : 'кандидатов'}</span>
            </StatItem>
            <StatItem>
              <Sparkles size={20} />
              <span>{candidates.filter((c: any) => c.profile?.isOpenToWork).length} ищут работу</span>
            </StatItem>
          </StatsBar>
        )}
      </Header>

      <SearchSection>
        <Input
          placeholder="Поиск по имени, навыкам..."
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button variant="primary">
          <Search size={20} />
          Поиск
        </Button>
      </SearchSection>

      {candidates.length === 0 ? (
        <EmptyState>Кандидаты не найдены</EmptyState>
      ) : (
        <CandidatesGrid>
          {candidates.map((candidate: any) => {
            const profile = candidate.profile;
            if (!profile) return null;

            const initials = `${profile.firstName?.charAt(0) || ''}${profile.lastName?.charAt(0) || ''}`.toUpperCase() || 'U';

            return (
              <CandidateCard
                key={candidate.id}
                onClick={() => navigate(`/candidates/${candidate.id}`)}
              >
                <CandidateHeader>
                  <CandidateAvatar>{initials}</CandidateAvatar>
                  <CandidateInfo>
                    <CandidateName>
                      {profile.firstName} {profile.lastName}
                    </CandidateName>
                    {profile.headline && (
                      <CandidateHeadline>{profile.headline}</CandidateHeadline>
                    )}
                  </CandidateInfo>
                </CandidateHeader>

                <CandidateMeta>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                    <Mail size={16} />
                    {candidate.email}
                  </div>
                  {profile.isOpenToWork !== undefined && (
                    <div>
                      <Badge variant={profile.isOpenToWork ? 'success' : 'default'} size="sm">
                        {profile.isOpenToWork ? 'Ищу работу' : 'Не ищу работу'}
                      </Badge>
                    </div>
                  )}
                </CandidateMeta>

                {profile.skills && profile.skills.length > 0 && (
                  <SkillsContainer>
                    {profile.skills.slice(0, 5).map((cs: any) => (
                      <Badge key={cs.skill.id} variant="default" size="sm">
                        {cs.skill.name}
                      </Badge>
                    ))}
                    {profile.skills.length > 5 && (
                      <Badge variant="default" size="sm">
                        +{profile.skills.length - 5}
                      </Badge>
                    )}
                  </SkillsContainer>
                )}
              </CandidateCard>
            );
          })}
        </CandidatesGrid>
      )}
    </Container>
  );
};

