import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { companyApi, jobApi } from '@shared/api';
import { 
  ArrowLeft, 
  MapPin, 
  Building2,
  Users,
  Briefcase,
  Globe,
  Linkedin,
  Github,
  Play,
  FileText,
  CheckCircle,
  Code2,
  Database,
  Cloud,
  Terminal,
  Layers,
  Zap,
  Shield,
  Heart,
  Calendar,
  ShieldCheck
} from 'lucide-react';
import { Button } from '@shared/ui/Button';
import { JobCard } from '@shared/ui/JobCard';
import { CompanyMap } from '@shared/ui/CompanyMap/CompanyMap';

// --- STYLED COMPONENTS ---
const PageContainer = styled.div`
  min-height: 100vh;
  background: #fff;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  color: #1d1d1f;
  padding-bottom: 80px;
`;

const HeroSection = styled.div`
  position: relative;
  height: 400px;
  overflow: hidden;

  @media (min-width: 768px) {
    height: 500px;
  }
`;

const HeroImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const HeroOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.4), transparent);
`;

const HeroContent = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 24px;

  @media (min-width: 768px) {
    padding: 48px;
  }
`;

const HeroInner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 32px;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: flex-end;
  }
`;

const LogoContainer = styled.div`
  width: 96px;
  height: 96px;
  background: #fff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  @media (min-width: 768px) {
    width: 128px;
    height: 128px;
  }
`;

const LogoImage = styled.div<{ $initials?: string }>`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 48px;

  @media (min-width: 768px) {
    font-size: 64px;
  }
`;

const LogoImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
`;

const HeroText = styled.div`
  flex: 1;
  color: #fff;
  margin-bottom: 8px;
`;

const HeroTitle = styled.h1`
  font-size: 36px;
  font-weight: 800;
  margin-bottom: 8px;
  letter-spacing: -0.02em;
  color: #fff;

  @media (min-width: 768px) {
    font-size: 48px;
  }
`;

const HeroTagline = styled.p`
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  max-width: 672px;
  font-weight: 300;

  @media (min-width: 768px) {
    font-size: 20px;
  }
`;

const SocialButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
`;

const SocialButton = styled.button`
  padding: 10px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  color: #fff;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const TabsContainer = styled.div`
  position: sticky;
  top: 0;
  z-index: 40;
  background: #fff;
  border-bottom: 1px solid #f3f4f6;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const TabsInner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  gap: 32px;
`;

const TabButton = styled.button<{ $active: boolean }>`
  padding: 20px 0;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
  background: none;
  border-top: none;
  border-left: none;
  border-right: none;
  cursor: pointer;
  color: ${({ $active }) => $active ? '#dc2626' : '#6b7280'};
  border-bottom-color: ${({ $active }) => $active ? '#dc2626' : 'transparent'};

  &:hover {
    color: ${({ $active }) => $active ? '#dc2626' : '#1d1d1f'};
  }
`;

const ContentWrapper = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 48px 24px;
`;

const Grid2Cols = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 48px;

  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr;
  }
`;

const Section = styled.div`
  margin-bottom: 64px;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #1d1d1f;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Description = styled.p`
  font-size: 18px;
  line-height: 1.7;
  color: #4b5563;
  margin-bottom: 32px;
`;

const MetaLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 24px;
`;

const MetaLink = styled.a`
  color: #2563eb;
  text-decoration: none;
  font-size: 15px;
  &:hover {
    text-decoration: underline;
  }
`;

const DocumentsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
`;

const DocumentLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  color: #1d4ed8;
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
`;

const HrReviewsBox = styled.div`
  margin: 24px 0;
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  background: #fff;
`;

const HrReviewsTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #1d1d1f;
  margin-bottom: 8px;
`;

const HrReviewItem = styled.div`
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const CultureGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const CultureCard = styled.div`
  background: #f9fafb;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
`;

const CultureIcon = styled.div`
  color: #dc2626;
  margin-bottom: 16px;
`;

const CultureTitle = styled.h3`
  font-weight: 700;
  color: #1d1d1f;
  margin-bottom: 8px;
`;

const CultureDesc = styled.p`
  font-size: 14px;
  color: #4b5563;
`;

const StatsCard = styled.div`
  background: #1d1d1f;
  color: #fff;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
`;

const StatsTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 24px;
`;

const StatsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const StatLabel = styled.span`
  color: rgba(255, 255, 255, 0.6);
`;

const StatValue = styled.span`
  font-weight: 700;
  font-size: 20px;
`;

const VideoWidget = styled.div`
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  height: 192px;
  cursor: pointer;
  margin-top: 24px;
  transition: transform 0.5s;

  &:hover {
    transform: scale(1.02);
  }
`;

const VideoImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const VideoOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;

  &:hover {
    background: rgba(0, 0, 0, 0.4);
  }
`;

const PlayButton = styled.div`
  width: 64px;
  height: 64px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 4px;
  transition: transform 0.3s;

  ${VideoWidget}:hover & {
    transform: scale(1.1);
  }
`;

const VideoText = styled.div`
  position: absolute;
  bottom: 16px;
  left: 16px;
  color: #fff;
  font-weight: 700;
`;

const TechStackGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const TechCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 24px;
  transition: box-shadow 0.3s;
  background: #fff;

  &:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
`;

const TechTitle = styled.h3`
  font-weight: 700;
  color: #1d1d1f;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TechTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const TechTag = styled.span`
  padding: 6px 12px;
  background: #f9fafb;
  color: #374151;
  font-size: 14px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
`;

const HiringProcessSection = styled.div`
  background: #f9fafb;
  border-radius: 24px;
  padding: 48px 32px;

  @media (min-width: 768px) {
    padding: 48px;
  }
`;

const HiringTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 40px;
  text-align: center;
`;

const ProcessLine = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 2px;
  background: #e5e7eb;
  transform: translateY(-50%);
  display: none;

  @media (min-width: 768px) {
    display: block;
  }
`;

const ProcessGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
  position: relative;

  @media (min-width: 768px) {
    grid-template-columns: repeat(5, 1fr);
  }
`;

const ProcessStep = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  z-index: 10;
`;

const StepNumber = styled.div`
  width: 48px;
  height: 48px;
  background: #fff;
  border: 4px solid #e5e7eb;
  color: #9ca3af;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  margin-bottom: 16px;
  transition: all 0.3s;

  ${ProcessStep}:hover & {
    border-color: #dc2626;
    color: #dc2626;
  }
`;

const StepTitle = styled.h3`
  font-weight: 700;
  color: #1d1d1f;
  margin-bottom: 4px;
`;

const StepDesc = styled.p`
  font-size: 12px;
  color: #6b7280;
`;

const JobsSection = styled.div``;

const JobsHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const Select = styled.select`
  padding: 8px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
  outline: none;
  font-size: 14px;
  cursor: pointer;
  transition: border-color 0.2s;

  &:focus {
    border-color: #dc2626;
  }
`;

const JobsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const JobCardWrapper = styled.div`
  background: #fff;
  border: 1px solid #e5e7eb;
  padding: 24px;
  border-radius: 12px;
  transition: all 0.3s;
  cursor: pointer;

  &:hover {
    border-color: #fecaca;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
`;

const JobTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #1d1d1f;
  margin-bottom: 8px;
  transition: color 0.2s;

  ${JobCardWrapper}:hover & {
    color: #dc2626;
  }
`;

const JobMeta = styled.div`
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;
`;

const JobMetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ViewButton = styled.button`
  padding: 8px 24px;
  border-radius: 8px;
  background: #f3f4f6;
  color: #1d1d1f;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 16px;

  ${JobCardWrapper}:hover & {
    background: #dc2626;
    color: #fff;
  }
`;

const LifeSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
`;

const LifeGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
  align-items: center;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const BenefitsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const BenefitItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
`;

const BenefitText = styled.span`
  font-weight: 500;
  color: #374151;
`;

const PhotosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
`;

const Photo = styled.img`
  width: 100%;
  height: 256px;
  object-fit: cover;
  border-radius: 16px;

  &:nth-child(2) {
    transform: translateY(32px);
  }
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

// --- MOCK DATA (можно заменить на данные из API) ---
const MOCK_CULTURE = [
  { title: "Data Driven", desc: "Мы принимаем решения на основе данных, а не мнений.", icon: Database },
  { title: "Скорость", desc: "Мы быстро запускаем MVP и улучшаем их на основе фидбека.", icon: Zap },
  { title: "Открытость", desc: "У нас нет кабинетов. Любой может подойти к CEO с идеей.", icon: Users },
];

const MOCK_STACK = [
  { category: "Frontend", items: ["React", "TypeScript", "Next.js", "Redux Toolkit", "Webpack"], icon: Layers, color: "#2563eb" },
  { category: "Backend", items: ["Java 17", "Spring Boot", "Go", "Microservices", "gRPC"], icon: Code2, color: "#16a34a" },
  { category: "Database", items: ["PostgreSQL", "MongoDB", "Redis", "Elasticsearch"], icon: Database, color: "#ea580c" },
  { category: "DevOps", items: ["Kubernetes", "Docker", "Jenkins", "GitLab CI", "Prometheus"], icon: Cloud, color: "#9333ea" },
];

const MOCK_HIRING_PROCESS = [
  { step: 1, title: "Заявка", desc: "Отклик на сайте или через LinkedIn" },
  { step: 2, title: "HR Скриннинг", desc: "30 минут звонок с рекрутером" },
  { step: 3, title: "Тех. интервью", desc: "Live-coding и System Design" },
  { step: 4, title: "Финал", desc: "Встреча с руководителем направления" },
  { step: 5, title: "Оффер", desc: "Добро пожаловать в команду!" },
];

const MOCK_BENEFITS = [
  "ДМС со стоматологией и страховкой для семьи",
  "MacBook Pro последних моделей",
  "Бюджет на обучение и конференции",
  "Бесплатные обеды и кофейня в офисе",
  "Фитнес-зал и йога в офисе",
  "Релокационный пакет"
];

// --- COMPONENT ---
export const CompanyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'about' | 'jobs' | 'life'>('about');

  const { data, isLoading, error } = useQuery({
    queryKey: ['company', id],
    queryFn: () => companyApi.getById(Number(id)),
    enabled: !!id,
  });
  const { data: hrReviewsData } = useQuery({
    queryKey: ['company-hr-reviews', id],
    queryFn: () => companyApi.getHrReviews(Number(id)),
    enabled: !!id,
  });

  const company = data?.data;
  const jobs = company?.jobs || [];
  const hrReviews = hrReviewsData?.data?.reviews || [];
  const initials = company?.name?.charAt(0).toUpperCase() || 'C';

  // Mock stats (можно заменить на реальные данные)
  const stats = [
    { label: "Сотрудников", value: company?.employeeCount || "—" },
    { label: "Вакансий", value: jobs.length.toString() },
    { label: "Основана", value: company?.foundedYear ? String(company.foundedYear) : "—" },
    { label: "Офисы", value: company?.address || "—" },
    { label: "HR рейтинг", value: hrReviewsData?.data?.averageRating ? `${hrReviewsData.data.averageRating}/10` : "—" },
  ];

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingState>Загрузка информации о компании...</LoadingState>
      </PageContainer>
    );
  }

  if (error || !company) {
    return (
      <PageContainer>
        <ErrorState>
          <ErrorTitle>Компания не найдена</ErrorTitle>
          <Button variant="primary" onClick={() => navigate('/companies')} style={{ marginTop: '16px' }}>
            Вернуться к списку компаний
          </Button>
        </ErrorState>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* HERO SECTION */}
      <HeroSection>
        <HeroImage 
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80" 
          alt="Office Cover" 
        />
        <HeroOverlay />
        <HeroContent>
          <HeroInner>
            <LogoContainer>
              <LogoImage $initials={initials}>
                {company.logoUrl ? <LogoImg src={`${(import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace('/api', '')}${company.logoUrl}`} alt={company.name} /> : initials}
              </LogoImage>
            </LogoContainer>
            <HeroText>
              <HeroTitle>
                {company.name}{' '}
                {company.isVerified && <ShieldCheck size={24} style={{ display: 'inline-block', color: '#86efac', verticalAlign: 'middle' }} />}
              </HeroTitle>
              <HeroTagline>
                {company.description || "Создаем продукты, которые меняют жизнь миллионов"}
              </HeroTagline>
            </HeroText>
            <SocialButtons>
              <SocialButton>
                <Globe size={20} />
              </SocialButton>
              <SocialButton>
                <Linkedin size={20} />
              </SocialButton>
              <SocialButton>
                <Github size={20} />
              </SocialButton>
            </SocialButtons>
          </HeroInner>
        </HeroContent>
      </HeroSection>

      {/* TABS */}
      <TabsContainer>
        <TabsInner>
          <TabButton 
            $active={activeTab === 'about'}
            onClick={() => setActiveTab('about')}
          >
            О компании
          </TabButton>
          <TabButton 
            $active={activeTab === 'jobs'}
            onClick={() => setActiveTab('jobs')}
          >
            Вакансии ({jobs.length})
          </TabButton>
          <TabButton 
            $active={activeTab === 'life'}
            onClick={() => setActiveTab('life')}
          >
            Жизнь в {company.name}
          </TabButton>
        </TabsInner>
      </TabsContainer>

      <ContentWrapper>
        <AnimatePresence mode="wait">
          {/* TAB: ABOUT */}
          {activeTab === 'about' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '64px' }}
            >
              <Grid2Cols>
                <div>
                  <Section>
                    <SectionTitle>Кто мы такие</SectionTitle>
                    <Description>
                      {company.description || "Ведущая технологическая компания. Мы создаем инновационные продукты и решения."}
                    </Description>
                    {(company.website || company.socialLinks?.linkedin || company.socialLinks?.telegram || company.socialLinks?.instagram || company.socialLinks?.hh) && (
                      <MetaLinks>
                        {company.website && <MetaLink href={company.website} target="_blank" rel="noreferrer">Сайт компании</MetaLink>}
                        {company.socialLinks?.linkedin && <MetaLink href={company.socialLinks.linkedin} target="_blank" rel="noreferrer">LinkedIn</MetaLink>}
                        {company.socialLinks?.telegram && <MetaLink href={company.socialLinks.telegram} target="_blank" rel="noreferrer">Telegram</MetaLink>}
                        {company.socialLinks?.instagram && <MetaLink href={company.socialLinks.instagram} target="_blank" rel="noreferrer">Instagram</MetaLink>}
                        {company.socialLinks?.hh && <MetaLink href={company.socialLinks.hh} target="_blank" rel="noreferrer">hh.ru</MetaLink>}
                      </MetaLinks>
                    )}
                    {!!company.documents?.length && (
                      <>
                        <SectionTitle style={{ fontSize: 18, marginBottom: 12 }}>Документы компании</SectionTitle>
                        <DocumentsList>
                          {company.documents.map((doc, index) => (
                            <DocumentLink
                              key={`${doc}-${index}`}
                              href={doc.startsWith('http') ? doc : `${(import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace('/api', '')}${doc}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <FileText size={14} />
                              Документ {index + 1}
                            </DocumentLink>
                          ))}
                        </DocumentsList>
                      </>
                    )}
                    {company.address && <CompanyMap address={company.address} />}
                    {hrReviewsData?.data && (
                      <HrReviewsBox>
                        <HrReviewsTitle>Команда и HR</HrReviewsTitle>
                        <div style={{ marginBottom: 12, color: '#374151' }}>
                          Средний рейтинг HR: <strong>{hrReviewsData.data.averageRating ?? '—'}</strong> / 10 ({hrReviewsData.data.totalReviews})
                        </div>
                        {!hrReviews.length ? (
                          <div style={{ color: '#6b7280', fontSize: 14 }}>Пока нет отзывов от кандидатов.</div>
                        ) : (
                          hrReviews.slice(0, 6).map((review: any) => (
                            <HrReviewItem key={review.id}>
                              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                                Оценка: {review.rating}/10
                              </div>
                              {review.comment && <div style={{ fontSize: 14, color: '#4b5563', marginBottom: 4 }}>{review.comment}</div>}
                              {review.application?.job?.title && (
                                <div style={{ fontSize: 12, color: '#9ca3af' }}>Вакансия: {review.application.job.title}</div>
                              )}
                            </HrReviewItem>
                          ))
                        )}
                      </HrReviewsBox>
                    )}
                    
                    <CultureGrid>
                      {MOCK_CULTURE.map((item, i) => {
                        const Icon = item.icon;
                        return (
                          <CultureCard key={i}>
                            <CultureIcon>
                              <Icon size={24} />
                            </CultureIcon>
                            <CultureTitle>{item.title}</CultureTitle>
                            <CultureDesc>{item.desc}</CultureDesc>
                          </CultureCard>
                        );
                      })}
                    </CultureGrid>
                  </Section>
                </div>

                <div>
                  <StatsCard>
                    <StatsTitle>Коротко о главном</StatsTitle>
                    <StatsList>
                      {stats.map((stat, i) => (
                        <StatItem key={i}>
                          <StatLabel>{stat.label}</StatLabel>
                          <StatValue>{stat.value}</StatValue>
                        </StatItem>
                      ))}
                    </StatsList>
                  </StatsCard>

                  <VideoWidget>
                    <VideoImage 
                      src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" 
                      alt="Video" 
                    />
                    <VideoOverlay>
                      <PlayButton>
                        <Play size={24} fill="#fff" />
                      </PlayButton>
                    </VideoOverlay>
                    <VideoText>Посмотрите наше видео</VideoText>
                  </VideoWidget>
                </div>
              </Grid2Cols>

              {/* TECH STACK */}
              <Section>
                <SectionTitle>
                  <Terminal size={24} style={{ color: '#dc2626' }} />
                  Наш технический стек
                </SectionTitle>
                <TechStackGrid>
                  {MOCK_STACK.map((cat, i) => {
                    const Icon = cat.icon;
                    return (
                      <TechCard key={i}>
                        <TechTitle>
                          <Icon size={18} style={{ color: cat.color }} />
                          {cat.category}
                        </TechTitle>
                        <TechTags>
                          {cat.items.map((tech) => (
                            <TechTag key={tech}>{tech}</TechTag>
                          ))}
                        </TechTags>
                      </TechCard>
                    );
                  })}
                </TechStackGrid>
              </Section>

              {/* HIRING PROCESS */}
              <Section>
                <HiringProcessSection>
                  <HiringTitle>Ваш путь в команду</HiringTitle>
                  {/* <ProcessLine /> */}
                  <ProcessGrid>
                    {MOCK_HIRING_PROCESS.map((step, i) => (
                      <ProcessStep key={i}>
                        <StepNumber>{step.step}</StepNumber>
                        <StepTitle>{step.title}</StepTitle>
                        <StepDesc>{step.desc}</StepDesc>
                      </ProcessStep>
                    ))}
                  </ProcessGrid>
                </HiringProcessSection>
              </Section>
            </motion.div>
          )}

          {/* TAB: JOBS */}
          {activeTab === 'jobs' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <JobsSection>
                <JobsHeader>
                  <SectionTitle>Открытые позиции</SectionTitle>
                  <FiltersContainer>
                    <Select>
                      <option>Все департаменты</option>
                      <option>IT & Разработка</option>
                      <option>Продукт</option>
                    </Select>
                    <Select>
                      <option>Все города</option>
                      <option>Алматы</option>
                      <option>Астана</option>
                    </Select>
                  </FiltersContainer>
                </JobsHeader>

                {jobs.length > 0 ? (
                  <JobsList>
                    {jobs.map((job: any) => (
                      <JobCardWrapper 
                        key={job.id}
                        onClick={() => navigate(`/jobs/${job.id}`)}
                      >
                        <JobTitle>{job.title}</JobTitle>
                        <JobMeta>
                          <JobMetaItem>
                            <Layers size={14} />
                            {job.workMode || 'Офис'}
                          </JobMetaItem>
                          <JobMetaItem>
                            <MapPin size={14} />
                            {company.address || 'Не указано'}
                          </JobMetaItem>
                          <JobMetaItem>
                            <Users size={14} />
                            {job.experienceLevel || 'Любой'}
                          </JobMetaItem>
                        </JobMeta>
                        <ViewButton>Смотреть</ViewButton>
                      </JobCardWrapper>
                    ))}
                  </JobsList>
                ) : (
                  <div style={{ textAlign: 'center', padding: '48px', color: '#6b7280' }}>
                    У компании пока нет активных вакансий
                  </div>
                )}
              </JobsSection>
            </motion.div>
          )}

          {/* TAB: LIFE */}
          {activeTab === 'life' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LifeSection>
                <LifeGrid>
                  <div>
                    <SectionTitle style={{ fontSize: '32px', marginBottom: '24px' }}>
                      Забота о команде
                    </SectionTitle>
                    <BenefitsList>
                      {MOCK_BENEFITS.map((benefit, i) => (
                        <BenefitItem key={i}>
                          <CheckCircle size={20} style={{ color: '#16a34a', flexShrink: 0 }} />
                          <BenefitText>{benefit}</BenefitText>
                        </BenefitItem>
                      ))}
                    </BenefitsList>
                  </div>
                  <PhotosGrid>
                    <Photo 
                      src="https://images.unsplash.com/photo-1577412647305-991150c7d163?auto=format&fit=crop&w=600&q=80" 
                      alt="Office 1" 
                    />
                    <Photo 
                      src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=600&q=80" 
                      alt="Office 2" 
                    />
                  </PhotosGrid>
                </LifeGrid>
              </LifeSection>
            </motion.div>
          )}
        </AnimatePresence>
      </ContentWrapper>
    </PageContainer>
  );
};
