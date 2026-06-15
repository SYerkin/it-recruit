import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { companyApi, Company } from '@shared/api';
import { Building2, MapPin, Users, Briefcase, TrendingUp, Sparkles } from 'lucide-react';
import { Card } from '@shared/ui/Card';
import { Badge } from '@shared/ui/Badge';

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
  background: linear-gradient(135deg, #AF52DE 0%, #FF9500 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const TitleIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(175, 82, 222, 0.1), rgba(255, 149, 0, 0.1));
  display: flex;
  align-items: center;
  justify-content: center;
  color: #AF52DE;
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
  background: rgba(175, 82, 222, 0.05);
  border-radius: 16px;
  border: 1px solid rgba(175, 82, 222, 0.1);
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--color-text-primary);
  font-weight: 600;
  
  svg {
    color: #AF52DE;
  }
`;

const CompaniesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: var(--spacing-xl);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CompanyCard = styled(Card)`
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
    background: linear-gradient(90deg, #AF52DE, #FF9500);
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(175, 82, 222, 0.15);
    border-color: rgba(175, 82, 222, 0.2);
    
    &::before {
      transform: scaleX(1);
    }
  }
`;

const CompanyHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
`;

const CompanyLogo = styled.div`
  width: 64px;
  height: 64px;
  border-radius: var(--radius-md);
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
  
  ${CompanyCard}:hover & {
    transform: scale(1.1) rotate(-5deg);
  }
`;

const CompanyInfo = styled.div`
  flex: 1;
`;

const CompanyName = styled.h3`
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-primary);
`;

const CompanyDescription = styled.p`
  font-size: 15px;
  line-height: 1.6;
  color: var(--color-text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: var(--spacing-md);
`;

const CompanyMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: 14px;
  color: var(--color-text-secondary);
`;

const JobsCount = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-system-gray-5);
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

export const Companies: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const pageSize = 12;

  const { data, isLoading, error } = useQuery({
    queryKey: ['companies'],
    queryFn: companyApi.getAllCompanies,
  });

  const companies = data?.data || [];
  const paginated = companies.slice((page - 1) * pageSize, page * pageSize);
  const pagesCount = Math.max(1, Math.ceil(companies.length / pageSize));

  if (isLoading) {
    return (
      <Container>
        <LoadingState>Загрузка компаний...</LoadingState>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <EmptyState>Ошибка загрузки компаний</EmptyState>
      </Container>
    );
  }

  const totalJobs = companies.reduce((sum: number, company: any) => {
    return sum + (company._count?.jobs || company.jobs?.length || 0);
  }, 0);

  return (
    <Container>
      <DecorativeBlob $top="-100px" $left="-100px" $color="rgba(175, 82, 222, 0.2)" />
      <DecorativeBlob $top="200px" $right="-150px" $color="rgba(255, 149, 0, 0.2)" />
      
      <Header>
        <TitleWrapper>
          <TitleIcon>
            <Building2 size={28} />
          </TitleIcon>
          <Title>Компании</Title>
        </TitleWrapper>
        <Subtitle>Ознакомьтесь с компаниями, которые размещают вакансии на нашей платформе</Subtitle>
        {companies.length > 0 && (
          <StatsBar>
            <StatItem>
              <TrendingUp size={20} />
              <span>{companies.length} {companies.length === 1 ? 'компания' : companies.length < 5 ? 'компании' : 'компаний'}</span>
            </StatItem>
            <StatItem>
              <Briefcase size={20} />
              <span>{totalJobs} {totalJobs === 1 ? 'вакансия' : totalJobs < 5 ? 'вакансии' : 'вакансий'}</span>
            </StatItem>
          </StatsBar>
        )}
      </Header>

      {companies.length === 0 ? (
        <EmptyState>Компании не найдены</EmptyState>
      ) : (
        <CompaniesGrid>
          {paginated.map((company: any) => (
            <CompanyCard
              key={company.id}
              onClick={() => navigate(`/companies/${company.id}`)}
            >
              <CompanyHeader>
                <CompanyLogo>
                  {company.name.charAt(0).toUpperCase()}
                </CompanyLogo>
                <CompanyInfo>
                  <CompanyName>{company.name}</CompanyName>
                  {company.isVerified && <Badge variant="success" size="sm">Проверено</Badge>}
                  {company.description && (
                    <CompanyDescription>{company.description}</CompanyDescription>
                  )}
                </CompanyInfo>
              </CompanyHeader>

              <CompanyMeta>
                {company.address && (
                  <MetaItem>
                    <MapPin size={16} />
                    {company.address}
                  </MetaItem>
                )}
                {company.employeeCount && (
                  <MetaItem>
                    <Users size={16} />
                    {company.employeeCount} сотрудников
                  </MetaItem>
                )}
              </CompanyMeta>

              <JobsCount>
                <Briefcase size={16} />
                <span>
                  {company._count?.jobs || company.jobs?.length || 0} вакансий
                </span>
              </JobsCount>
            </CompanyCard>
          ))}
        </CompaniesGrid>
      )}
      {companies.length > pageSize && (
        <div style={{ marginTop: 20, display: 'flex', gap: 8, justifyContent: 'center' }}>
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Назад</button>
          <span>Страница {page} / {pagesCount}</span>
          <button disabled={page === pagesCount} onClick={() => setPage((p) => p + 1)}>Вперёд</button>
        </div>
      )}
    </Container>
  );
};

