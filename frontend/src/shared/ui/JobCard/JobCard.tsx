import React from 'react';
import styled from 'styled-components';
import { Card } from '../Card';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { MapPin, DollarSign, CheckCircle } from 'lucide-react';
import { formatSalary } from '@shared/utils/formatSalary';
import { useTranslation } from 'react-i18next';

interface JobCardProps {
  id: number;
  title: string;
  description: string;
  company?: string;
  companyAddress?: string | null;
  location?: string;
  salaryMin?: number | null;
  salaryMax?: number | null;
  currency?: string;
  skills?: Array<{ id: number; name: string }>;
  workSchedule?: string | null;
  workMode?: string | null;
  workType?: string | null;
  experienceLevel?: string | null;
  hasApplied?: boolean;
  onApply?: (id: number) => void;
  onClick?: (id: number) => void;
}

const JobCardContainer = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  min-height: 200px;
`;

const JobHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--spacing-md);
`;

const JobInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
`;

const CompanyLogo = styled.div`
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, var(--color-system-blue), #5856D6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 20px;
  flex-shrink: 0;
`;

const JobTitle = styled.h3`
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--color-text-primary);
  margin: 0;
`;

const CompanyName = styled.p`
  font-size: 17px;
  font-weight: 500;
  color: var(--color-text-secondary);
  margin: 0;
`;

const JobMeta = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
  margin-top: var(--spacing-xs);
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: 15px;
  color: var(--color-text-tertiary);
`;

const Description = styled.p`
  font-size: 15px;
  line-height: 1.6;
  color: var(--color-text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
`;

const SkillsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-xs);
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  margin-top: var(--spacing-sm);
`;

const Tag = styled(Badge)`
  font-size: 12px;
  padding: 4px 10px;
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-system-gray-5);
`;


export const JobCard: React.FC<JobCardProps> = ({
  id,
  title,
  description,
  company,
  companyAddress,
  location,
  salaryMin,
  salaryMax,
  currency = 'USD',
  skills = [],
  workSchedule,
  workMode,
  workType,
  experienceLevel,
  hasApplied = false,
  onApply,
  onClick,
}) => {
  const { t } = useTranslation();

  const getTagLabel = (value: string | null | undefined, type: 'schedule' | 'mode' | 'type' | 'level'): string => {
    if (!value) return '';
    const key = `jobCard.${type}.${value}`;
    const translated = t(key);
    return translated === key ? value : translated;
  };

  const handleClick = () => {
    onClick?.(id);
  };

  const handleApply = (e: React.MouseEvent) => {
    e.stopPropagation();
    onApply?.(id);
  };

  return (
    <JobCardContainer hoverable onClick={handleClick}>
      <JobHeader>
        <CompanyLogo>
          {company?.charAt(0).toUpperCase() || 'J'}
        </CompanyLogo>
        <JobInfo>
          <JobTitle>{title}</JobTitle>
          {company && <CompanyName>{company}</CompanyName>}
          <JobMeta>
            {location && (
              <MetaItem>
                <MapPin size={16} />
                {location}
              </MetaItem>
            )}
            {(salaryMin || salaryMax) && (
              <MetaItem>
                <DollarSign size={16} />
                {formatSalary(salaryMin, salaryMax, currency)}
              </MetaItem>
            )}
          </JobMeta>
        </JobInfo>
      </JobHeader>

      <Description>{description}</Description>

      {companyAddress && (
        <MetaItem style={{ marginTop: 'var(--spacing-xs)' }}>
          <MapPin size={16} />
          {companyAddress}
        </MetaItem>
      )}

      {skills.length > 0 && (
        <SkillsContainer>
          {skills.slice(0, 4).map((skill) => (
            <Badge key={skill.id} variant="default" size="sm">
              {skill.name}
            </Badge>
          ))}
          {skills.length > 4 && (
            <Badge variant="default" size="sm">
              +{skills.length - 4}
            </Badge>
          )}
        </SkillsContainer>
      )}

      {(workSchedule || workMode || workType || experienceLevel) && (
        <TagsContainer>
          {workSchedule && (
            <Tag variant="default" size="sm">
              {getTagLabel(workSchedule, 'schedule')}
            </Tag>
          )}
          {workMode && (
            <Tag variant="default" size="sm">
              {getTagLabel(workMode, 'mode')}
            </Tag>
          )}
          {workType && (
            <Tag variant="default" size="sm">
              {getTagLabel(workType, 'type')}
            </Tag>
          )}
          {experienceLevel && (
            <Tag variant="default" size="sm">
              {getTagLabel(experienceLevel, 'level')}
            </Tag>
          )}
        </TagsContainer>
      )}

      <CardFooter>
        <Button variant="ghost" size="sm">
          {t('jobCard.details')}
        </Button>
        {hasApplied ? (
          <Button variant="secondary" size="sm" disabled>
            <CheckCircle size={16} style={{ marginRight: 'var(--spacing-xs)' }} />
            {t('jobCard.applied')}
          </Button>
        ) : onApply ? (
          <Button variant="primary" size="sm" onClick={handleApply}>
            {t('jobCard.apply')}
          </Button>
        ) : null}
      </CardFooter>
    </JobCardContainer>
  );
};


