import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import {
  Search, MapPin, ArrowRight, Code2, Terminal,
  Building2, Users, Zap, ShieldCheck, TrendingUp, Briefcase,
  FileText, Layout, Target, CheckCircle, Star
} from 'lucide-react';
import { JobCard } from '@shared/ui/JobCard';
import { useQuery } from '@tanstack/react-query';
import { jobApi, Job, applicationApi, statsApi, companyApi } from '@shared/api';
import { useAuthStore } from '@app/store/auth.store';
import { formatSalary } from '@shared/utils/formatSalary';
import { useTranslation } from 'react-i18next';

// Aurora Animation
const floatAurora = keyframes`
  0% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(-20px) scale(1.05); }
  100% { transform: translateY(0px) scale(1); }
`;

const floatY = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
`;

const scrollX = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
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

// Hero Section
const HeroSection = styled.section`
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: #fff;
  color: #1d1d1f;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  margin-bottom: 0;
  @media (max-width: 768px) {
    min-height: auto;
    padding: 72px 0 40px;
  }
  @media (max-width: 480px) {
    padding: 64px 0 32px;
  }
`;

// Noise Overlay
const NoiseOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url("https://grainy-gradients.vercel.app/noise.svg");
  opacity: 0.05;
  pointer-events: none;
  z-index: 2;
`;

// Aurora Background
const AuroraBackground = styled.div`
  position: absolute;
  width: 150%;
  height: 150%;
  top: -25%;
  left: -25%;
  background: radial-gradient(
    circle at center,
    rgba(56, 189, 248, 0.08) 0%,
    rgba(124, 58, 237, 0.08) 25%,
    rgba(236, 72, 153, 0.08) 50%,
    rgba(255, 255, 255, 0) 70%
  );
  filter: blur(80px);
  z-index: 1;
  animation: ${floatAurora} 10s ease-in-out infinite;
`;

// Container
const Container = styled.div`
  position: relative;
  z-index: 10;
  width: 100%;
  padding: 0 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-width: 480px) {
    padding: 0 14px;
  }
`;

// Badge
const Badge = styled(motion.div)`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 500;
  color: #1d1d1f;
  margin-bottom: 24px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  @media (max-width: 480px) {
    font-size: 12px;
    padding: 6px 12px;
    margin-bottom: 16px;
  }
`;

const BadgeDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4ade80;
  box-shadow: 0 0 10px #4ade80;
`;

// Typography
const HeroTitle = styled(motion.h1)`
  font-size: clamp(48px, 8vw, 96px);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.04em;
  margin-bottom: 24px;
  color: #1d1d1f;
  text-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    font-size: clamp(32px, 9vw, 44px);
    line-height: 1.1;
    margin-bottom: 16px;
  }
`;

const TitleGradient = styled.span`
  display: block;
  background: linear-gradient(to right, #60a5fa, #c084fc);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
`;

const HeroSubtitle = styled(motion.p)`
  font-size: clamp(18px, 2vw, 24px);
  color: #86868b;
  max-width: 600px;
  line-height: 1.6;
  margin-bottom: 48px;
  @media (max-width: 640px) {
    margin-bottom: 20px;
    line-height: 1.45;
    font-size: 16px;
    padding: 0 4px;
  }
`;

// Search Bar
const SearchBarWrapper = styled(motion.form)`
  position: relative;
  width: 100%;
  max-width: 700px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 24px;
  padding: 8px;
  display: flex;
  align-items: center;
  box-shadow:
    0 20px 40px -10px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

  &:hover,
  &:focus-within {
    border-color: rgba(0, 0, 0, 0.2);
    box-shadow:
      0 30px 60px -12px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(0, 0, 0, 0.1),
      0 0 0 4px rgba(0, 0, 0, 0.02);
    transform: translateY(-2px);
  }
  @media (max-width: 640px) {
    border-radius: 16px;
    padding: 6px;
    max-width: 100%;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  color: #1d1d1f;
  font-size: 18px;
  padding: 16px;
  outline: none;
  min-width: 0;

  &::placeholder {
    color: #86868b;
  }
  @media (max-width: 640px) {
    font-size: 15px;
    padding: 12px;
  }
`;

const SearchButton = styled.button`
  background: #1d1d1f;
  color: #fff;
  border: none;
  width: 56px;
  height: 56px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s;
  flex-shrink: 0;

  &:hover {
    transform: scale(1.05);
    background: #000;
  }

  &:active {
    transform: scale(0.95);
  }
  @media (max-width: 640px) {
    width: 46px;
    height: 46px;
    border-radius: 14px;
  }
`;

const Divider = styled.div`
  width: 1px;
  height: 32px;
  background: rgba(0, 0, 0, 0.1);
  margin: 0 16px;
  display: none;

  @media (min-width: 640px) {
    display: block;
  }
`;

const LocationWrapper = styled.div`
  display: none;
  align-items: center;
  gap: 8px;
  color: #86868b;
  margin-right: 16px;
  font-size: 14px;
  white-space: nowrap;

  @media (min-width: 640px) {
    display: flex;
  }
`;

// Floating Cards
const FloatingCard = styled(motion.div)<{ $position: 'left' | 'right' }>`
  position: absolute;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 16px 24px;
  border-radius: 16px;
  display: none;
  align-items: center;
  gap: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  z-index: 12;
  animation: ${floatY} 6s ease-in-out infinite;
  animation-delay: ${({ $position }) => ($position === 'left' ? '0s' : '2s')};

  @media (min-width: 1024px) {
    display: flex;
  }

  ${({ $position }) =>
    $position === 'left'
      ? `
    top: 20%;
    left: 10%;
  `
      : `
    bottom: 25%;
    right: 12%;
  `}
`;

const IconBox = styled.div<{ $gradient: string }>`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  background: ${({ $gradient }) => $gradient};
`;

const CardText = styled.div`
  strong {
    display: block;
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 2px;
    color: #1d1d1f;
  }

  span {
    font-size: 13px;
    color: #86868b;
  }
`;

// Jobs Section
const JobsSection = styled.section`
  position: relative;
  z-index: 10;
  background: #fff;
  padding: var(--spacing-4xl) 160px;
  min-height: 100vh;

  @media (max-width: 1400px) {
    padding: var(--spacing-4xl) 120px;
  }

  @media (max-width: 1200px) {
    padding: var(--spacing-4xl) 80px;
  }

  @media (max-width: 968px) {
    padding: var(--spacing-4xl) 60px;
  }

  @media (max-width: 768px) {
    padding: var(--spacing-3xl) var(--spacing-lg);
    min-height: auto;
  }

  @media (max-width: 480px) {
    padding: var(--spacing-2xl) var(--spacing-md);
  }
`;

const SectionTitle = styled.h2`
  font-size: 36px;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: var(--spacing-2xl);
  color: #1d1d1f;
  text-align: center;
  @media (max-width: 640px) {
    font-size: 26px;
    margin-bottom: var(--spacing-lg);
    line-height: 1.2;
  }
`;

const JobsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: var(--spacing-xl);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }
`;

// Light themed wrapper for JobCard with glassmorphism to match dark background
const JobCardWrapper = styled.div`
  & > div {
    background: rgba(255, 255, 255, 0.98) !important;
    backdrop-filter: blur(20px) !important;
    -webkit-backdrop-filter: blur(20px) !important;
    border: 1px solid rgba(255, 255, 255, 0.4) !important;
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.2),
      0 0 0 1px rgba(255, 255, 255, 0.1) inset !important;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;

    &:hover {
      transform: translateY(-4px) scale(1.01) !important;
      box-shadow: 
        0 16px 48px rgba(0, 0, 0, 0.3),
        0 0 0 1px rgba(255, 255, 255, 0.2) inset !important;
      border-color: rgba(255, 255, 255, 0.6) !important;
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: var(--spacing-4xl);
  color: #86868b;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: var(--spacing-4xl);
  color: #86868b;
`;

// Logos Marquee
const LogosSection = styled.div`
  padding: 40px 0;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
  overflow: hidden;
  white-space: nowrap;
`;

const LogosContainer = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 64px;
  padding-left: 64px;
  animation: ${scrollX} 40s linear infinite;
  @media (max-width: 640px) {
    gap: 28px;
    padding-left: 28px;
  }
`;

const LogoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 700;
  color: #9ca3af;
  transition: all 0.3s;
  filter: grayscale(100%);
  opacity: 0.7;

  &:hover {
    color: #1d1d1f;
    filter: grayscale(0%);
    opacity: 1;
  }
  @media (max-width: 640px) {
    font-size: 15px;
  }
`;

// Stats Section
const StatsSection = styled.section`
  padding: 80px 0;
  background: #fff;
  @media (max-width: 640px) {
    padding: 48px 0;
  }
`;

const StatsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;
  text-align: center;

  @media (max-width: 640px) {
    gap: 20px 12px;
  }

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StatNumber = styled.div`
  font-size: 48px;
  font-weight: 800;
  background: linear-gradient(to bottom right, #1d1d1f, #4b5563);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 8px;
  @media (max-width: 640px) {
    font-size: 34px;
  }
`;

const StatLabel = styled.div`
  color: #6b7280;
  font-weight: 500;
  font-size: 14px;

  @media (max-width: 640px) {
    font-size: 12px;
    line-height: 1.35;
  }
`;

// Value Props Section
const ValuePropsSection = styled.section<{ $bg?: string }>`
  padding: 96px 0;
  background: ${({ $bg }) => $bg || '#fff'};

  @media (max-width: 768px) {
    padding: 56px 0;
  }
`;

const ValuePropsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;

  @media (max-width: 640px) {
    padding: 0 16px;
  }
`;

const ValuePropsHeader = styled.div`
  text-align: center;
  margin-bottom: 64px;
  max-width: 768px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 640px) {
    margin-bottom: 32px;
  }
`;

const ValuePropsTitle = styled.h2`
  font-size: 36px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #1d1d1f;
  margin-bottom: 16px;

  @media (max-width: 640px) {
    font-size: 26px;
    margin-bottom: 10px;
  }
`;

const ValuePropsSubtitle = styled.p`
  font-size: 18px;
  color: #6b7280;
  line-height: 1.6;

  @media (max-width: 640px) {
    font-size: 15px;
    line-height: 1.5;
  }
`;

const BentoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  grid-auto-rows: minmax(280px, auto);

  @media (max-width: 640px) {
    gap: 16px;
    grid-auto-rows: auto;
  }

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const BentoCard = styled(motion.div)<{ $span?: number; $bg?: string }>`
  background: ${({ $bg }) => $bg || '#f9fafb'};
  border-radius: 32px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid #e5e7eb;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;

  ${({ $span }) => $span && `
    @media (min-width: 1024px) {
      grid-column: span ${$span};
    }
  `}

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 640px) {
    border-radius: 20px;
    padding: 24px 20px;
    min-height: auto;
  }
`;

const BentoIcon = styled.div<{ $color: string }>`
  width: 56px;
  height: 56px;
  background: #fff;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  color: ${({ $color }) => $color};
  margin-bottom: 24px;
`;

const BentoTitle = styled.h3`
  font-size: 24px;
  font-weight: 700;
  color: #1d1d1f;
  margin-bottom: 12px;

  @media (max-width: 640px) {
    font-size: 20px;
    margin-bottom: 8px;
  }
`;

const BentoText = styled.p`
  color: #4b5563;
  line-height: 1.6;
  max-width: 500px;
`;

const BentoDecorative = styled.div<{ $color: string }>`
  position: absolute;
  right: 0;
  bottom: 0;
  width: 256px;
  height: 256px;
  background: ${({ $color }) => $color};
  border-radius: 50% 0 0 0;
  opacity: 0.2;
  transition: transform 0.5s;

  ${BentoCard}:hover & {
    transform: scale(1.1);
  }
`;

// CTA Section
const CTASection = styled.section`
  position: relative;
  padding: 160px 24px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
  color: #fff;
  text-align: center;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 72px 16px;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const CTAGlow = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 800px;
  height: 800px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(139, 92, 246, 0.2) 50%, transparent 70%);
  border-radius: 50%;
  filter: blur(120px);
  pointer-events: none;
  animation: ${floatAurora} 8s ease-in-out infinite;
`;

const CTAContainer = styled.div`
  position: relative;
  z-index: 10;
  max-width: 900px;
  margin: 0 auto;
`;

const CTATitle = styled(motion.h2)`
  font-size: clamp(36px, 6vw, 72px);
  font-weight: 800;
  letter-spacing: -0.03em;
  margin-bottom: 32px;
  background: linear-gradient(135deg, #ffffff 0%, #e0e7ff 50%, #ffffff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 40px rgba(255, 255, 255, 0.1);
  line-height: 1.1;
`;

const CTAText = styled(motion.p)`
  font-size: clamp(18px, 2.5vw, 24px);
  color: #cbd5e1;
  margin-bottom: 48px;
  line-height: 1.7;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  font-weight: 400;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
`;

const CTAButton = styled(motion.button)`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  color: #0f172a;
  padding: 20px 48px;
  border-radius: 999px;
  font-size: 18px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 
    0 10px 40px rgba(255, 255, 255, 0.2),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset,
    0 4px 20px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    transition: left 0.5s;
  }

  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 
      0 20px 60px rgba(255, 255, 255, 0.3),
      0 0 0 1px rgba(255, 255, 255, 0.2) inset,
      0 8px 30px rgba(0, 0, 0, 0.3);
    background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%);
  }

  &:hover::before {
    left: 100%;
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }
`;

const CTADecorative = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 1;
  
  &::before {
    content: '';
    position: absolute;
    top: 10%;
    left: 10%;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
    border-radius: 50%;
    filter: blur(60px);
    animation: ${floatAurora} 12s ease-in-out infinite;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 10%;
    right: 10%;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%);
    border-radius: 50%;
    filter: blur(80px);
    animation: ${floatAurora} 15s ease-in-out infinite reverse;
  }
`;

// Animation variants
const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  // Загружаем статистику
  const { data: statsData } = useQuery({
    queryKey: ['stats', 'public'],
    queryFn: () => statsApi.getPublicStats(),
  });

  // Загружаем featured companies
  const { data: featuredCompaniesData } = useQuery({
    queryKey: ['companies', 'featured'],
    queryFn: () => companyApi.getFeatured(10),
  });

  // Загружаем trending jobs (только 6)
  const { data, isLoading, error } = useQuery({
    queryKey: ['jobs', 'trending'],
    queryFn: () =>
      jobApi.getJobs({
        status: 'ACTIVE',
        trending: true,
        limit: 6,
      }),
  });

  // Загружаем отклики кандидата для проверки статуса
  const { data: applicationsData } = useQuery({
    queryKey: ['applications', 'my'],
    queryFn: () => applicationApi.getMyApplications(),
    enabled: isAuthenticated && user?.role === 'CANDIDATE',
  });

  const jobs = (data?.data || []).slice(0, 6);
  const applications = applicationsData?.data || [];
  const appliedJobIds = new Set(applications.map((app: any) => app.jobId));
  const stats = statsData?.data;
  const featuredCompanies = featuredCompaniesData?.data || [];

  // Получаем количество активных вакансий для badge
  const activeJobsCount = stats?.activeJobs || jobs.length;

  // Получаем примеры вакансий для floating cards
  const featuredJobs = jobs.slice(0, 2);

  const fmtJobSalary = (job: Job) =>
    formatSalary(job.salaryMin, job.salaryMax, job.currency) || t('home.salaryUnset');

  const handleJobClick = (id: number) => {
    navigate(`/jobs/${id}`);
  };

  const handleApply = (id: number) => {
    console.log('Apply to job:', id);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by query key
  };

  return (
    <>
      <HeroSection>
        <NoiseOverlay />
        <AuroraBackground />

        {/* Floating Card Left */}
        {featuredJobs[0] && (
          <FloatingCard
            $position="left"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            onClick={() => handleJobClick(featuredJobs[0].id)}
            style={{ cursor: 'pointer' }}
          >
            <IconBox $gradient="linear-gradient(135deg, #3b82f6, #8b5cf6)">
              <Code2 size={20} />
            </IconBox>
            <CardText>
              <strong>{featuredJobs[0].title}</strong>
              <span>
                {featuredJobs[0].company?.name || t('home.company')} • {fmtJobSalary(featuredJobs[0])}
              </span>
            </CardText>
          </FloatingCard>
        )}

        {/* Floating Card Right */}
        {featuredJobs[1] && (
          <FloatingCard
            $position="right"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            onClick={() => handleJobClick(featuredJobs[1].id)}
            style={{ cursor: 'pointer' }}
          >
            <IconBox $gradient="linear-gradient(135deg, #ec4899, #f43f5e)">
              <Terminal size={20} />
            </IconBox>
            <CardText>
              <strong>{featuredJobs[1].title}</strong>
              <span>
                {featuredJobs[1].company?.name || t('home.company')} • {fmtJobSalary(featuredJobs[1])}
              </span>
            </CardText>
          </FloatingCard>
        )}

        <Container>
          {/* Badge */}
          <Badge
            initial="hidden"
            animate="visible"
            variants={fadeUpVariants}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <BadgeDot />
            {isLoading ? t('home.badgeLoading') : t('home.badge', { count: activeJobsCount, companies: stats?.companies || 0 })}
          </Badge>

          {/* Title */}
          <HeroTitle
            initial="hidden"
            animate="visible"
            variants={fadeUpVariants}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {t('home.title')} <br />
            <TitleGradient>{t('home.titleGradient')}</TitleGradient>
          </HeroTitle>

          {/* Subtitle */}
          <HeroSubtitle
            initial="hidden"
            animate="visible"
            variants={fadeUpVariants}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {t('home.subtitle')}
          </HeroSubtitle>

          {/* Search Bar */}
          <SearchBarWrapper
            onSubmit={handleSearch}
            initial="hidden"
            animate="visible"
            variants={fadeUpVariants}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Search color="#86868b" size={24} style={{ marginLeft: 16, flexShrink: 0 }} />
            <SearchInput
              placeholder={t('home.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <Divider />

            <LocationWrapper>
              <MapPin size={16} />
              <span>{t('home.locationPlaceholder')}</span>
            </LocationWrapper>

            <SearchButton type="submit">
              <ArrowRight size={24} />
            </SearchButton>
          </SearchBarWrapper>
        </Container>
      </HeroSection>

      {/* Logos Marquee */}
      {featuredCompanies.length > 0 && (
        <LogosSection>
          <LogosContainer>
            {[...featuredCompanies, ...featuredCompanies, ...featuredCompanies].map((company: any, i: number) => (
              <LogoItem key={`${company.id}-${i}`}>
                <Briefcase size={20} />
                <span>{company.name}</span>
              </LogoItem>
            ))}
          </LogosContainer>
        </LogosSection>
      )}

      {/* Stats Section */}
      {stats && (
        <StatsSection>
          <StatsContainer>
            <StatsGrid>
              <StatItem>
                <StatNumber>{stats.activeJobs.toLocaleString()}+</StatNumber>
                <StatLabel>{t('home.statsJobs')}</StatLabel>
              </StatItem>
              <StatItem>
                <StatNumber>{stats.companies.toLocaleString()}+</StatNumber>
                <StatLabel>{t('home.statsCompanies')}</StatLabel>
              </StatItem>
              <StatItem>
                <StatNumber>{(stats.candidates / 1000).toFixed(0)}k</StatNumber>
                <StatLabel>{t('home.statsCandidates')}</StatLabel>
              </StatItem>
              <StatItem>
                <StatNumber>{stats.avgTimeToOffer} {t('home.statsAvgTime')}</StatNumber>
                <StatLabel>{t('home.statsAvgTimeLabel')}</StatLabel>
              </StatItem>
            </StatsGrid>
          </StatsContainer>
        </StatsSection>
      )}

      {/* Value Props Section */}
      <ValuePropsSection>
        <ValuePropsContainer>
          <ValuePropsHeader>
            <ValuePropsTitle>{t('home.whyTitle')}</ValuePropsTitle>
            <ValuePropsSubtitle>{t('home.whySubtitle')}</ValuePropsSubtitle>
          </ValuePropsHeader>

          <BentoGrid>
            <BentoCard $span={2} $bg="#dcfce7" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div>
                <BentoIcon $color="#16a34a">
                  <Zap size={28} />
                </BentoIcon>
                <BentoTitle>{t('home.fastTrackTitle')}</BentoTitle>
                <BentoText>{t('home.fastTrackText')}</BentoText>
              </div>
              <BentoDecorative $color="#86efac" />
            </BentoCard>

            <BentoCard $bg="#f3f4f6" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <div>
                <BentoIcon $color="#2563eb">
                  <ShieldCheck size={28} />
                </BentoIcon>
                <BentoTitle>{t('home.verifiedTitle')}</BentoTitle>
                <BentoText>{t('home.verifiedText')}</BentoText>
              </div>
            </BentoCard>

            <BentoCard $bg="#f3f4f6" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <div>
                <BentoIcon $color="#9333ea">
                  <Code2 size={28} />
                </BentoIcon>
                <BentoTitle>{t('home.stackTitle')}</BentoTitle>
                <BentoText>{t('home.stackText')}</BentoText>
              </div>
            </BentoCard>

            <BentoCard $span={2} $bg="#dbeafe" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
              <div>
                <BentoIcon $color="#2563eb">
                  <TrendingUp size={28} />
                </BentoIcon>
                <BentoTitle>{t('home.salaryTitle')}</BentoTitle>
                <BentoText>{t('home.salaryText')}</BentoText>
              </div>
              <BentoDecorative $color="#93c5fd" />
            </BentoCard>
          </BentoGrid>
        </ValuePropsContainer>
      </ValuePropsSection>

      {/* Ecosystem Section - New Features */}
      <ValuePropsSection $bg="#f9fafb">
        <ValuePropsContainer>
          <ValuePropsHeader>
            <ValuePropsTitle>{t('home.ecosystemTitle')}</ValuePropsTitle>
            <ValuePropsSubtitle>{t('home.ecosystemSubtitle')}</ValuePropsSubtitle>
          </ValuePropsHeader>

          <BentoGrid>
            {/* Resume Builder */}
            <BentoCard
              $bg="#fff"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onClick={() => navigate('/resume')}
              style={{ cursor: 'pointer' }}
            >
              <div>
                <BentoIcon $color="#8b5cf6" style={{ background: '#8b5cf6', color: 'white', boxShadow: '0 10px 20px rgba(139, 92, 246, 0.4)' }}>
                  <FileText size={28} />
                </BentoIcon>
                <BentoTitle>{t('home.resumeTitle')}</BentoTitle>
                <BentoText>{t('home.resumeText')}</BentoText>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', color: '#8b5cf6', marginTop: '24px' }}>
                {t('home.resumeLink')} <ArrowRight size={16} />
              </div>
            </BentoCard>

            {/* Hiring Tracking */}
            <BentoCard
              $bg="#fff"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              onClick={() => navigate('/dashboard')}
              style={{ cursor: 'pointer' }}
            >
              <div>
                <BentoIcon $color="#3b82f6" style={{ background: '#3b82f6', color: 'white', boxShadow: '0 10px 20px rgba(59, 130, 246, 0.4)' }}>
                  <Layout size={28} />
                </BentoIcon>
                <BentoTitle>{t('home.trackingTitle')}</BentoTitle>
                <BentoText>{t('home.trackingText')}</BentoText>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', color: '#3b82f6', marginTop: '24px' }}>
                {t('home.trackingLink')} <ArrowRight size={16} />
              </div>
            </BentoCard>

            {/* Recommendations */}
            <BentoCard
              $bg="#fff"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              onClick={() => navigate('/recommendations')}
              style={{ cursor: 'pointer' }}
            >
              <div>
                <BentoIcon $color="#10b981" style={{ background: '#10b981', color: 'white', boxShadow: '0 10px 20px rgba(16, 185, 129, 0.4)' }}>
                  <Target size={28} />
                </BentoIcon>
                <BentoTitle>{t('home.growthTitle')}</BentoTitle>
                <BentoText>{t('home.growthText')}</BentoText>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', color: '#10b981', marginTop: '24px' }}>
                {t('home.growthLink')} <ArrowRight size={16} />
              </div>
            </BentoCard>

            {/* Company Brand (Large Card) */}
            <BentoCard
              $span={3}
              $bg="#111827"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              onClick={() => navigate('/company/create')}
              style={{ cursor: 'pointer', color: '#fff' }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '40px' }}>
                <div style={{ maxWidth: '600px' }}>
                  <div style={{ display: 'inline-block', padding: '6px 12px', background: 'rgba(255,255,255,0.1)', borderRadius: '99px', fontSize: '14px', fontWeight: '700', marginBottom: '24px' }}>
                    {t('home.forCompanies')}
                  </div>
                  <h3 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '16px', color: '#fff' }}>{t('home.brandTitle')}</h3>
                  <p style={{ color: '#9ca3af', fontSize: '18px', lineHeight: 1.6, marginBottom: '32px' }}>
                    {t('home.brandText')}
                  </p>
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate('/company/create'); }}
                    style={{
                      background: '#fff', color: '#000', padding: '16px 32px',
                      borderRadius: '16px', fontWeight: '700', fontSize: '16px',
                      border: 'none', cursor: 'pointer', display: 'flex',
                      alignItems: 'center', gap: '8px', transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.25)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    {t('home.brandLink')} <ArrowRight size={18} />
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <img
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80"
                    alt="Office"
                    style={{ borderRadius: '24px', width: '400px', maxWidth: '100%', transform: 'rotate(3deg)', border: '4px solid rgba(255,255,255,0.1)' }}
                  />
                  <div style={{ position: 'absolute', bottom: '-20px', left: '-20px', background: '#fff', color: '#000', padding: '16px', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Star size={24} fill="#facc15" stroke="none" />
                    <div>
                      <div style={{ fontWeight: '800', fontSize: '18px' }}>4.9 / 5.0</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>{t('home.companyRating')}</div>
                    </div>
                  </div>
                </div>
              </div>
            </BentoCard>
          </BentoGrid>
        </ValuePropsContainer>
      </ValuePropsSection>

      {/* Jobs Section */}
      <JobsSection>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '48px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <SectionTitle>{t('home.freshJobsTitle')}</SectionTitle>
            <p style={{ textAlign: 'center', color: '#6b7280' }}>{t('home.freshJobsSubtitle')}</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={() => navigate('/jobs')}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '12px 24px', borderRadius: '999px',
                border: '1px solid #e5e7eb', fontWeight: 500,
                color: '#1d1d1f', background: '#fff', cursor: 'pointer', transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#f9fafb'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              {t('home.allJobs')} <ArrowRight size={18} />
            </button>
          </div>
        </div>
        {isLoading ? (
          <LoadingState>{t('home.loadingJobs')}</LoadingState>
        ) : error ? (
          <EmptyState>
            <div>{t('home.errorJobs')}</div>
            {error instanceof Error && (
              <div style={{ marginTop: '8px', fontSize: '14px', color: '#ff3b30' }}>
                {error.message}
              </div>
            )}
          </EmptyState>
        ) : jobs.length === 0 ? (
          <EmptyState>{t('home.emptyJobs')}</EmptyState>
        ) : (
          <JobsGrid>
            {jobs.map((job: Job, index: number) => (
              <JobCardWrapper
                key={job.id}
                as={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
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
              </JobCardWrapper>
            ))}
          </JobsGrid>
        )}
      </JobsSection>

      {/* CTA Section */}
      <CTASection>
        <CTADecorative />
        <CTAGlow
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <CTAContainer>
          <CTATitle
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {t('home.ctaTitle')}
          </CTATitle>
          <CTAText
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {t('home.ctaText')}
            <br />
            <span style={{ color: '#94a3b8', fontSize: '0.9em' }}>{t('home.ctaNoSpam')}</span>
          </CTAText>
          <CTAButton
            onClick={() => user ? navigate('/jobs') : navigate('/register')}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {user ? t('home.ctaBtnAuth') : t('home.ctaBtnGuest')}
          </CTAButton>
        </CTAContainer>
      </CTASection>
    </>
  );
};
