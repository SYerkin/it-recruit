import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  X,
  MapPin,
  DollarSign,
  Briefcase,
  SlidersHorizontal,
  ArrowRight
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { jobApi, Job, applicationApi, skillApi } from '@shared/api';
import { useAuthStore } from '@app/store/auth.store';
import { JobCard } from '@shared/ui/JobCard';
import { useTranslation } from 'react-i18next';

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 24px;
  min-height: 100vh;
  background: #f9fafb;

  @media (max-width: 768px) {
    padding: 16px 14px 32px;
  }
`;

const Header = styled.div`
  margin-bottom: 40px;

  @media (max-width: 768px) {
    margin-bottom: 20px;
  }
`;

const Title = styled.h1`
  font-size: 48px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #1d1d1f;
  margin-bottom: 12px;

  @media (max-width: 768px) {
    font-size: 28px;
    margin-bottom: 6px;
  }
`;

const Subtitle = styled.p`
  font-size: 18px;
  color: #6b7280;

  @media (max-width: 768px) {
    font-size: 14px;
    line-height: 1.45;
  }
`;

const MobileFiltersToggle = styled.button<{ $active?: boolean }>`
  display: none;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 14px 16px;
  margin-bottom: 12px;
  border-radius: 14px;
  border: 1px solid ${({ $active }) => ($active ? '#bfdbfe' : '#e5e7eb')};
  background: ${({ $active }) => ($active ? '#eff6ff' : '#fff')};
  color: #1d1d1f;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const FiltersContainer = styled.div<{ $mobileOpen?: boolean }>`
  background: #fff;
  border-radius: 24px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;

  @media (max-width: 768px) {
    display: ${({ $mobileOpen }) => ($mobileOpen ? 'block' : 'none')};
    border-radius: 16px;
    padding: 16px;
    margin-bottom: 16px;
  }
`;

const SearchBar = styled.div`
  position: relative;
  margin-bottom: 24px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 16px 20px 16px 56px;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  font-size: 16px;
  transition: all 0.3s;
  background: #f9fafb;

  @media (max-width: 768px) {
    padding: 14px 16px 14px 48px;
    font-size: 15px;
    border-radius: 12px;
  }

  &:focus {
    outline: none;
    border-color: #3b82f6;
    background: #fff;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  width: 20px;
  height: 20px;
`;

const FiltersRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FilterLabel = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #374151;
`;

const FilterSelect = styled.select`
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 15px;
  background: #fff;
  color: #1d1d1f;
  cursor: pointer;
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  }
`;

const FilterInput = styled.input`
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 15px;
  background: #fff;
  color: #1d1d1f;
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  }
`;

const SkillsFilter = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;

  @media (max-width: 768px) {
    flex-wrap: nowrap;
    overflow-x: auto;
    padding-bottom: 4px;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

const SkillTag = styled.button<{ $active: boolean }>`
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 500;
  border: 2px solid ${({ $active }) => ($active ? '#3b82f6' : '#e5e7eb')};
  background: ${({ $active }) => ($active ? '#3b82f6' : '#fff')};
  color: ${({ $active }) => ($active ? '#fff' : '#374151')};
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;

  &:hover {
    border-color: #3b82f6;
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    padding: 7px 12px;
    font-size: 13px;
  }
`;

const ClearFilters = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
  background: #f3f4f6;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 16px;

  &:hover {
    background: #e5e7eb;
    color: #374151;
  }
`;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    margin-bottom: 14px;
  }
`;

const ResultsCount = styled.div`
  font-size: 16px;
  color: #6b7280;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const JobsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 14px;
  }
`;

const MobileSearchBar = styled.div`
  display: none;
  position: relative;
  margin-bottom: 12px;

  @media (max-width: 768px) {
    display: block;
  }
`;

const DesktopSearchBar = styled(SearchBar)`
  @media (max-width: 768px) {
    display: none;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 24px;
  background: #fff;
  border-radius: 24px;
  border: 2px dashed #e5e7eb;
`;

const EmptyStateTitle = styled.h3`
  font-size: 24px;
  font-weight: 700;
  color: #1d1d1f;
  margin-bottom: 12px;
`;

const EmptyStateText = styled.p`
  font-size: 16px;
  color: #6b7280;
  margin-bottom: 24px;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 80px 24px;
  color: #6b7280;
  font-size: 18px;
`;

export const Jobs: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuthStore();
  const { t } = useTranslation();

  // Get filters from URL
  const search = searchParams.get('search') || '';
  const workMode = searchParams.get('workMode') || '';
  const workSchedule = searchParams.get('workSchedule') || '';
  const experienceLevel = searchParams.get('experienceLevel') || '';
  const minSalary = searchParams.get('minSalary') || '';
  const selectedSkills = searchParams.get('skills')?.split(',').filter(Boolean) || [];

  // Local state - sync with URL params
  const [localSearch, setLocalSearch] = useState(search);
  const [localWorkMode, setLocalWorkMode] = useState(workMode);
  const [localWorkSchedule, setLocalWorkSchedule] = useState(workSchedule);
  const [localExperienceLevel, setLocalExperienceLevel] = useState(experienceLevel);
  const [localMinSalary, setLocalMinSalary] = useState(minSalary);
  const [localSelectedSkills, setLocalSelectedSkills] = useState<string[]>(selectedSkills);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sync local state when URL params change
  useEffect(() => {
    setLocalSearch(search);
    setLocalWorkMode(workMode);
    setLocalWorkSchedule(workSchedule);
    setLocalExperienceLevel(experienceLevel);
    setLocalMinSalary(minSalary);
    setLocalSelectedSkills(selectedSkills);
  }, [search, workMode, workSchedule, experienceLevel, minSalary, selectedSkills.join(',')]);

  // Load skills
  const { data: skillsData } = useQuery({
    queryKey: ['skills'],
    queryFn: () => skillApi.getAllSkills(),
  });

  const skills = skillsData?.data || [];

  // Load jobs with filters
  const { data, isLoading, error } = useQuery({
    queryKey: ['jobs', 'all', search, workMode, workSchedule, experienceLevel, minSalary, selectedSkills.join(',')],
    queryFn: () =>
      jobApi.getJobs({
        search: search || undefined,
        status: 'ACTIVE',
        ...(workMode && { workMode }),
        ...(minSalary && { minSalary: parseInt(minSalary) }),
      }),
  });

  // Load applications for candidate
  const { data: applicationsData } = useQuery({
    queryKey: ['applications', 'my'],
    queryFn: () => applicationApi.getMyApplications(),
    enabled: isAuthenticated && user?.role === 'CANDIDATE',
  });

  const jobs = data?.data || [];
  const applications = applicationsData?.data || [];
  const appliedJobIds = new Set(applications.map((app: any) => app.jobId));

  // Filter jobs by additional filters (client-side for workSchedule, experienceLevel, skills)
  const filteredJobs = useMemo(() => {
    return jobs.filter((job: Job) => {
      if (workSchedule && job.workSchedule !== workSchedule) return false;
      if (experienceLevel && job.experienceLevel !== experienceLevel) return false;
      if (selectedSkills.length > 0) {
        const jobSkills = job.requiredSkills?.map((js) => js.skill.name.toLowerCase()) || [];
        const hasSkill = selectedSkills.some((skill) =>
          jobSkills.some((js) => js.includes(skill.toLowerCase()))
        );
        if (!hasSkill) return false;
      }
      return true;
    });
  }, [jobs, workSchedule, experienceLevel, selectedSkills]);

  const handleSearch = (value: string) => {
    setLocalSearch(value);
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set('search', value);
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  const handleFilterChange = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const handleSkillToggle = (skillName: string) => {
    const newSkills = localSelectedSkills.includes(skillName)
      ? localSelectedSkills.filter((s) => s !== skillName)
      : [...localSelectedSkills, skillName];
    
    setLocalSelectedSkills(newSkills);
    const newParams = new URLSearchParams(searchParams);
    if (newSkills.length > 0) {
      newParams.set('skills', newSkills.join(','));
    } else {
      newParams.delete('skills');
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setLocalSearch('');
    setLocalWorkMode('');
    setLocalWorkSchedule('');
    setLocalExperienceLevel('');
    setLocalMinSalary('');
    setLocalSelectedSkills([]);
    setSearchParams({});
  };

  const hasActiveFilters = search || workMode || workSchedule || experienceLevel || minSalary || selectedSkills.length > 0;

  const handleJobClick = (id: number) => {
    navigate(`/jobs/${id}`);
  };

  const handleApply = (id: number) => {
    navigate(`/jobs/${id}`);
  };

  return (
    <Container>
      <Header>
        <Title>{t('jobs.title')}</Title>
        <Subtitle>{t('jobs.subtitle')}</Subtitle>
      </Header>

      <MobileSearchBar>
        <SearchIcon />
        <SearchInput
          type="text"
          placeholder={t('jobs.searchPlaceholder')}
          value={localSearch}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </MobileSearchBar>

      <MobileFiltersToggle
        type="button"
        $active={mobileFiltersOpen || !!hasActiveFilters}
        onClick={() => setMobileFiltersOpen((prev) => !prev)}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <SlidersHorizontal size={18} />
          {t('jobs.filtersToggle', { defaultValue: 'Фильтры' })}
          {hasActiveFilters ? ` · ${filteredJobs.length}` : ''}
        </span>
        <Filter size={16} />
      </MobileFiltersToggle>

      <FiltersContainer $mobileOpen={mobileFiltersOpen}>
        <DesktopSearchBar>
          <SearchIcon />
          <SearchInput
            type="text"
            placeholder={t('jobs.searchPlaceholder')}
            value={localSearch}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </DesktopSearchBar>

        <FiltersRow>
          <FilterGroup>
            <FilterLabel>
              <MapPin size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
              {t('jobs.modeLabel')}
            </FilterLabel>
            <FilterSelect
              value={localWorkMode}
              onChange={(e) => { setLocalWorkMode(e.target.value); handleFilterChange('workMode', e.target.value); }}
            >
              <option value="">{t('jobs.modeAll')}</option>
              <option value="OFFICE">{t('jobs.modeOffice')}</option>
              <option value="REMOTE">{t('jobs.modeRemote')}</option>
              <option value="HYBRID">{t('jobs.modeHybrid')}</option>
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>
              <Briefcase size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
              {t('jobs.scheduleLabel')}
            </FilterLabel>
            <FilterSelect
              value={localWorkSchedule}
              onChange={(e) => { setLocalWorkSchedule(e.target.value); handleFilterChange('workSchedule', e.target.value); }}
            >
              <option value="">{t('jobs.scheduleAll')}</option>
              <option value="FULL_TIME">{t('jobs.scheduleFull')}</option>
              <option value="PART_TIME">{t('jobs.schedulePart')}</option>
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>
              <Briefcase size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
              {t('jobs.levelLabel')}
            </FilterLabel>
            <FilterSelect
              value={localExperienceLevel}
              onChange={(e) => { setLocalExperienceLevel(e.target.value); handleFilterChange('experienceLevel', e.target.value); }}
            >
              <option value="">{t('jobs.levelAll')}</option>
              <option value="INTERN">{t('jobs.levelIntern')}</option>
              <option value="JUNIOR">{t('jobs.levelJunior')}</option>
              <option value="MIDDLE">{t('jobs.levelMiddle')}</option>
              <option value="SENIOR">{t('jobs.levelSenior')}</option>
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>
              <DollarSign size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
              {t('jobs.salaryLabel')}
            </FilterLabel>
            <FilterInput
              type="number"
              placeholder={t('jobs.salaryPlaceholder')}
              value={localMinSalary}
              onChange={(e) => { setLocalMinSalary(e.target.value); handleFilterChange('minSalary', e.target.value); }}
            />
          </FilterGroup>
        </FiltersRow>

        {skills.length > 0 && (
          <FilterGroup>
            <FilterLabel>{t('jobs.skillsLabel')}</FilterLabel>
            <SkillsFilter>
              {skills.slice(0, 20).map((skill) => (
                <SkillTag
                  key={skill.id}
                  $active={localSelectedSkills.includes(skill.name)}
                  onClick={() => handleSkillToggle(skill.name)}
                >
                  {skill.name}
                </SkillTag>
              ))}
            </SkillsFilter>
          </FilterGroup>
        )}

        {hasActiveFilters && (
          <ClearFilters onClick={clearFilters}>
            <X size={16} />
            {t('jobs.clearFilters')}
          </ClearFilters>
        )}
      </FiltersContainer>

      <ResultsHeader>
        <ResultsCount>
          {t('jobs.foundCount', { count: filteredJobs.length }).replace('<1>', '').replace('</1>', '')}
        </ResultsCount>
      </ResultsHeader>

      {isLoading ? (
        <LoadingState>{t('jobs.loading')}</LoadingState>
      ) : error ? (
        <EmptyState>
          <EmptyStateTitle>{t('jobs.errorTitle')}</EmptyStateTitle>
          <EmptyStateText>{t('jobs.errorText')}</EmptyStateText>
        </EmptyState>
      ) : filteredJobs.length === 0 ? (
        <EmptyState>
          <EmptyStateTitle>{t('jobs.emptyTitle')}</EmptyStateTitle>
          <EmptyStateText>{t('jobs.emptyText')}</EmptyStateText>
        </EmptyState>
      ) : (
        <JobsGrid>
          {filteredJobs.map((job: Job, index: number) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03, duration: 0.4 }}
            >
              <JobCard
                id={job.id}
                title={job.title}
                description={job.description}
                company={job.company?.name}
                companyAddress={job.company?.address}
                salaryMin={job.salaryMin}
                salaryMax={job.salaryMax}
                currency={job.currency}
                skills={job.requiredSkills?.map((js) => ({
                  id: js.skill.id,
                  name: js.skill.name,
                })) || []}
                workSchedule={job.workSchedule}
                workMode={job.workMode}
                workType={job.workType}
                experienceLevel={job.experienceLevel}
                hasApplied={appliedJobIds.has(job.id)}
                onClick={handleJobClick}
                onApply={appliedJobIds.has(job.id) ? undefined : handleApply}
              />
            </motion.div>
          ))}
        </JobsGrid>
      )}
    </Container>
  );
};
