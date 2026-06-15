import React, { useState } from 'react';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { Search, Building2 } from 'lucide-react';
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

const Toolbar = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
`;

const SearchWrap = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 11px 16px 11px 42px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 14px;
  background: #fff;
  &:focus { outline: none; border-color: #7c3aed; }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 13px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  border: 1px solid #f3f4f6;
`;

const CardHeader = styled.div`
  display: flex;
  gap: 14px;
  align-items: center;
  margin-bottom: 16px;
`;

const CompanyIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #f5f3ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #7c3aed;
  flex-shrink: 0;
  font-size: 20px;
  font-weight: 700;
`;

const CompanyInfo = styled.div``;

const CompanyName = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #1d1d1f;
  margin-bottom: 2px;
`;

const OwnerEmail = styled.p`
  font-size: 13px;
  color: #9ca3af;
`;

const StatsRow = styled.div`
  display: flex;
  gap: 16px;
  padding-top: 16px;
  border-top: 1px solid #f3f4f6;
`;

const Stat = styled.div`
  flex: 1;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #1d1d1f;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: #9ca3af;
  margin-top: 2px;
`;

export const AdminCompanies: React.FC = () => {
  const [search, setSearch] = useState('');

  const { data } = useQuery({
    queryKey: ['admin-companies'],
    queryFn: adminApi.getCompanies,
  });

  const companies = ((data as any)?.data || []).filter((c: any) =>
    !search || c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Page>
      <PageTitle>Компании ({companies.length})</PageTitle>

      <Toolbar>
        <SearchWrap>
          <SearchIcon size={16} />
          <SearchInput
            placeholder="Поиск по названию..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </SearchWrap>
      </Toolbar>

      <Grid>
        {companies.map((c: any) => (
          <Card key={c.id}>
            <CardHeader>
              <CompanyIcon>
                {c.name.charAt(0)}
              </CompanyIcon>
              <CompanyInfo>
                <CompanyName>{c.name}</CompanyName>
                <OwnerEmail>{c.owner?.email}</OwnerEmail>
              </CompanyInfo>
            </CardHeader>

            {c.description && (
              <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.5, marginBottom: 16,
                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {c.description}
              </p>
            )}

            <StatsRow>
              <Stat>
                <StatValue>{c._count?.jobs || 0}</StatValue>
                <StatLabel>Вакансий</StatLabel>
              </Stat>
              {c.employeeCount && (
                <Stat>
                  <StatValue style={{ fontSize: 14 }}>{c.employeeCount}</StatValue>
                  <StatLabel>Сотрудников</StatLabel>
                </Stat>
              )}
              {c.foundedYear && (
                <Stat>
                  <StatValue>{c.foundedYear}</StatValue>
                  <StatLabel>Год основания</StatLabel>
                </Stat>
              )}
            </StatsRow>
          </Card>
        ))}
      </Grid>

      {companies.length === 0 && (
        <div style={{ textAlign: 'center', padding: 80, color: '#9ca3af' }}>
          <Building2 size={40} style={{ marginBottom: 12 }} />
          <p>Компаний не найдено</p>
        </div>
      )}
    </Page>
  );
};
