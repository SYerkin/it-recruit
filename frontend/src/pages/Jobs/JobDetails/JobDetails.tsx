import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  Building2,
  Calendar,
  Clock,
  Code,
  Gift,
  Heart,
  Send,
  CheckCircle,
  Globe,
  Linkedin,
  Twitter,
  Share2,
  Star,
  ChevronRight,
  Users,
  Eye
} from 'lucide-react';
import { jobApi, applicationApi, favoriteApi } from '@shared/api';
import { useAuthStore } from '@app/store/auth.store';
import { formatSalary } from '@shared/utils/formatSalary';

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  background: #f9fafb;
  padding-bottom: 80px;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  color: #1d1d1f;
`;

const HeroSection = styled.div`
  position: relative;
  height: 256px;
  width: 100%;
  background: #1d1d1f;
  overflow: hidden;

  @media (min-width: 768px) {
    height: 320px;
  }
`;

const HeroImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.6;
`;

const HeroOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, #1d1d1f, transparent, transparent);
`;

const BackButton = styled.button`
  position: absolute;
  top: 24px;
  left: 24px;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.2);
  }

  @media (min-width: 768px) {
    left: 48px;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1152px;
  margin: 0 auto;
  padding: 0 16px;
  position: relative;
  margin-top: -80px;
  z-index: 10;

  @media (min-width: 768px) {
    padding: 0 32px;
  }
`;

const HeaderRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 32px;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const HeaderCard = styled.div`
  flex: 1;
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;

  @media (min-width: 768px) {
    padding: 32px;
  }
`;

const BadgesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
`;

const Badge = styled.span<{ $variant?: 'active' | 'blue' | 'purple' }>`
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: ${({ $variant }) => ($variant === 'active' ? 700 : 600)};
  letter-spacing: 0.05em;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 4px;

  ${({ $variant }) => {
    if ($variant === 'active') {
      return `
        background: #dcfce7;
        color: #15803d;
      `;
    }
    if ($variant === 'blue') {
      return `
        background: #dbeafe;
        color: #2563eb;
      `;
    }
    if ($variant === 'purple') {
      return `
        background: #f3e8ff;
        color: #9333ea;
      `;
    }
    return `
      background: #f3f4f6;
      color: #374151;
    `;
  }}
`;

const JobTitle = styled.h1`
  font-size: 30px;
  font-weight: 800;
  color: #1d1d1f;
  margin-bottom: 16px;
  line-height: 1.2;

  @media (min-width: 768px) {
    font-size: 36px;
  }
`;

const JobMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap-y: 8px;
  gap-x: 24px;
  color: #6b7280;
  font-size: 14px;

  @media (min-width: 768px) {
    font-size: 16px;
  }
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  span {
    font-weight: 500;
    color: #1d1d1f;
  }
`;

const ActionsCard = styled.div`
  display: none;
  flex-direction: column;
  gap: 12px;
  width: 288px;
  margin-top: 32px;

  @media (min-width: 768px) {
    display: flex;
    margin-top: 0;
  }
`;

const StickyCard = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  text-align: center;
  position: sticky;
  top: 24px;
`;

const SalaryLabel = styled.div`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 4px;
`;

const SalaryAmount = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #1d1d1f;
  margin-bottom: 24px;
`;

const ActionButton = styled.button<{ $variant?: 'primary' | 'secondary' | 'favorite' | 'favoriteActive' | 'disabled' }>`
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 15px;

  ${({ $variant }) => {
    if ($variant === 'primary') {
      return `
        background: #2563eb;
        color: #fff;
        margin-bottom: 12px;

        &:hover {
          background: #1d4ed8;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }
      `;
    }
    if ($variant === 'favorite' || $variant === 'favoriteActive') {
      return `
        border: 2px solid ${$variant === 'favoriteActive' ? '#fecaca' : '#e5e7eb'};
        background: ${$variant === 'favoriteActive' ? '#fef2f2' : '#fff'};
        color: ${$variant === 'favoriteActive' ? '#ef4444' : '#374151'};

        &:hover {
          background: ${$variant === 'favoriteActive' ? '#fee2e2' : '#f9fafb'};
        }
      `;
    }
    if ($variant === 'disabled') {
      return `
        background: #dcfce7;
        color: #15803d;
        cursor: default;
      `;
    }
    return '';
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const GridLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;

  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Section = styled.section`
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  @media (min-width: 768px) {
    padding: 32px;
  }
`;

const SectionTitleStyled = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #1d1d1f;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const IconWrapper = styled.div`
  padding: 8px;
  background: #dbeafe;
  color: #2563eb;
  border-radius: 8px;
`;

const Description = styled.div`
  color: #4b5563;
  line-height: 1.7;
  white-space: pre-line;
`;

const ResponsibilitiesList = styled.ul`
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ResponsibilityItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  color: #4b5563;
`;

const Dot = styled.div`
  margin-top: 6px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #2563eb;
  flex-shrink: 0;
`;

const SkillsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const SkillTag = styled.span`
  padding: 8px 16px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #374151;
  font-weight: 500;
  transition: all 0.2s;
  cursor: default;

  &:hover {
    background: #f3f4f6;
  }
`;

const RecommendedList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const RecommendedCard = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: #fff;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:hover {
    border-color: #bfdbfe;
    box-shadow: 0 8px 24px rgba(37, 99, 235, 0.08);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 16px;
    gap: 12px;
  }
`;

const RecommendedInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const RecommendedName = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #1d1d1f;
  margin-bottom: 4px;
`;

const RecommendedHeadline = styled.div`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 12px;
`;

const MatchedSkillsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const MatchedSkillTag = styled.span`
  padding: 4px 10px;
  border-radius: 999px;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 12px;
  font-weight: 600;
`;

const MatchScoreBadge = styled.div<{ $score: number }>`
  flex-shrink: 0;
  min-width: 72px;
  padding: 12px 10px;
  border-radius: 14px;
  text-align: center;
  background: ${({ $score }) => ($score >= 80 ? '#ecfdf5' : $score >= 50 ? '#eff6ff' : '#f9fafb')};
  border: 1px solid ${({ $score }) => ($score >= 80 ? '#86efac' : $score >= 50 ? '#bfdbfe' : '#e5e7eb')};
`;

const MatchScoreValue = styled.div<{ $score: number }>`
  font-size: 24px;
  font-weight: 800;
  color: ${({ $score }) => ($score >= 80 ? '#15803d' : $score >= 50 ? '#1d4ed8' : '#6b7280')};
`;

const MatchScoreLabel = styled.div`
  font-size: 11px;
  color: #6b7280;
  margin-top: 2px;
`;

const RecommendedActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
`;

const RecommendedButton = styled.button`
  padding: 8px 14px;
  border-radius: 10px;
  border: 1px solid #dbeafe;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #dbeafe;
  }
`;

const BenefitsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const BenefitItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  background: rgba(219, 234, 254, 0.5);
  border: 1px solid #bfdbfe;
`;

const OfficeGallery = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  height: 192px;
`;

const OfficeImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.5s;

  &:hover {
    transform: scale(1.05);
  }
`;

const CompanyCard = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const CompanyHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
`;

const CompanyLogo = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
  color: #9ca3af;
`;

const CompanyInfo = styled.div``;

const CompanyName = styled.h3`
  font-weight: 700;
  color: #1d1d1f;
  font-size: 18px;
  margin-bottom: 4px;
`;

const CompanyIndustry = styled.div`
  font-size: 14px;
  color: #6b7280;
`;

const CompanyDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
`;

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
`;

const DetailLabel = styled.span`
  color: #6b7280;
`;

const DetailValue = styled.span`
  font-weight: 500;
  color: #1d1d1f;
`;

const SocialButtons = styled.div`
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
`;

const SocialButton = styled.button`
  padding: 8px;
  border-radius: 999px;
  background: #f9fafb;
  color: #4b5563;
  border: none;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f3f4f6;
  }
`;

const SectionTitleSmall = styled.h3`
  font-weight: 700;
  color: #1d1d1f;
  margin-bottom: 16px;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const MapSection = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 4px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const MapContainer = styled.div`
  position: relative;
  width: 100%;
  height: 192px;
  background: #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
`;

const MapIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 12px;
`;

const MapLink = styled.a`
  display: block;
  width: 100%;
  height: 100%;
  position: relative;
  text-decoration: none;
  color: inherit;
`;

const MapPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom right, #dbeafe, #e9d5ff);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  cursor: pointer;
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.9;
  }
`;

const MapMarker = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 32px;
  height: 32px;
  background: #2563eb;
  border-radius: 50%;
  border: 4px solid #fff;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MapAddressText = styled.div`
  position: absolute;
  bottom: 8px;
  left: 8px;
  right: 8px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  font-size: 12px;
  padding: 8px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  font-weight: 500;
  color: #4b5563;
`;

const SimilarJobsSection = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const SimilarJobsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SimilarJobCard = styled.div`
  cursor: pointer;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid transparent;
  transition: all 0.2s;

  &:hover {
    background: #f9fafb;
    border-color: #e5e7eb;
  }
`;

const SimilarJobTitle = styled.h4`
  font-weight: 700;
  color: #1d1d1f;
  font-size: 14px;
  margin-bottom: 4px;
  transition: color 0.2s;

  ${SimilarJobCard}:hover & {
    color: #2563eb;
  }
`;

const SimilarJobMeta = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  margin-top: 4px;
`;

const SimilarJobCompany = styled.span`
  color: #6b7280;
`;

const SimilarJobSalary = styled.span`
  font-weight: 500;
  color: #1d1d1f;
`;

const ViewAllButton = styled.button`
  width: 100%;
  text-align: center;
  font-size: 14px;
  color: #2563eb;
  font-weight: 500;
  padding: 8px;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    text-decoration: underline;
  }
`;

const MobileActionBar = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-top: 1px solid #e5e7eb;
  padding: 16px;
  z-index: 50;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.05);

  @media (min-width: 768px) {
    display: none;
  }
`;

const MobileFavoriteButton = styled.button<{ $active: boolean }>`
  padding: 12px;
  border-radius: 12px;
  border: 2px solid ${({ $active }) => ($active ? '#fecaca' : '#e5e7eb')};
  background: ${({ $active }) => ($active ? '#fef2f2' : '#fff')};
  color: ${({ $active }) => ($active ? '#ef4444' : '#4b5563')};
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    background: ${({ $active }) => ($active ? '#fee2e2' : '#f9fafb')};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const MobileActionButton = styled.button<{ $variant?: 'primary' | 'disabled' }>`
  flex: 1;
  padding: 12px;
  border-radius: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 15px;

  ${({ $variant }) => {
    if ($variant === 'primary') {
      return `
        background: #2563eb;
        color: #fff;

        &:active {
          transform: scale(0.95);
        }
      `;
    }
    if ($variant === 'disabled') {
      return `
        background: #dcfce7;
        color: #15803d;
        cursor: default;
      `;
    }
    return '';
  }}
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
`;

const ModalContent = styled(motion.div)`
  background: #fff;
  border-radius: 24px;
  width: 100%;
  max-width: 512px;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const ModalHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(249, 250, 251, 0.5);
`;

const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #1d1d1f;
`;

const ModalCloseButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 18px;

  &:hover {
    background: #e5e7eb;
    color: #4b5563;
  }
`;

const ModalBody = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const JobPreview = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: rgba(219, 234, 254, 0.5);
  border: 1px solid #bfdbfe;
  border-radius: 12px;
  margin-bottom: 16px;
`;

const JobPreviewLogo = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2563eb;
  font-weight: 700;
  font-size: 18px;
`;

const JobPreviewInfo = styled.div``;

const JobPreviewTitle = styled.div`
  font-weight: 700;
  color: #1d1d1f;
  margin-bottom: 4px;
`;

const JobPreviewCompany = styled.div`
  font-size: 14px;
  color: #6b7280;
`;

const TextareaLabel = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
`;

const TextareaStyled = styled.textarea`
  width: 100%;
  height: 160px;
  padding: 16px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 15px;
  font-family: inherit;
  resize: none;
  transition: all 0.2s;
  outline: none;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
  }

  &::placeholder {
    color: #d1d5db;
  }
`;

const TextareaCounter = styled.div`
  font-size: 12px;
  color: #9ca3af;
  margin-top: 8px;
  text-align: right;
`;

const ModalFooter = styled.div`
  padding: 24px;
  background: #f9fafb;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  border-top: 1px solid #e5e7eb;
`;

const ModalButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s;

  ${({ $variant }) => {
    if ($variant === 'primary') {
      return `
        background: #2563eb;
        color: #fff;
        padding: 12px 32px;

        &:hover {
          background: #1d4ed8;
          box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3);
          transform: translateY(-2px);
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `;
    }
    return `
      color: #4b5563;
      background: transparent;

      &:hover {
        background: #e5e7eb;
      }
    `;
  }}
`;

const LoadingContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
  color: #6b7280;
`;

const ErrorContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
  flex-direction: column;
  text-align: center;
`;

const ErrorTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #1d1d1f;
  margin-bottom: 16px;
`;

const ErrorButton = styled.button`
  padding: 12px 24px;
  background: #2563eb;
  color: #fff;
  border-radius: 12px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #1d4ed8;
  }
`;

// Helper component
const SectionTitle: React.FC<{ icon: any; title: string }> = ({ icon: Icon, title }) => (
  <SectionTitleStyled>
    <IconWrapper>
      <Icon size={20} />
    </IconWrapper>
    {title}
  </SectionTitleStyled>
);

export const JobDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuthStore();
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyStep, setApplyStep] = useState(1);
  const [coverLetter, setCoverLetter] = useState('');
  const [applySuccess, setApplySuccess] = useState(false);

  // Load job
  const { data: jobData, isLoading, error } = useQuery({
    queryKey: ['job', id],
    queryFn: () => jobApi.getJobById(Number(id)),
    enabled: !!id,
  });

  const job = jobData?.data;
  const isHrViewer = isAuthenticated && (user?.role === 'HR' || user?.role === 'ADMIN');

  const { data: recommendedData, isLoading: isRecommendedLoading } = useQuery({
    queryKey: ['job', id, 'recommended-candidates'],
    queryFn: () => jobApi.getRecommendedCandidates(Number(id), 3),
    enabled: !!id && isHrViewer,
  });

  const recommendedCandidates = recommendedData?.data || [];
  const { data: similarJobsData } = useQuery({
    queryKey: ['jobs', 'similar', id],
    queryFn: () => jobApi.getJobs({ 
      status: 'ACTIVE',
      companyId: job?.companyId,
      limit: 3 
    }),
    enabled: !!job?.companyId,
  });

  const similarJobs = (similarJobsData?.data || [])
    .filter((j: any) => j.id !== Number(id))
    .slice(0, 3);

  // Check if job is favorited
  const { data: favoriteData } = useQuery({
    queryKey: ['favorite', id],
    queryFn: () => favoriteApi.checkFavoriteJob(Number(id)),
    enabled: !!id && isAuthenticated && user?.role === 'CANDIDATE',
  });

  const isFavorite = favoriteData?.data?.isFavorite || false;

  // Check if already applied
  const { data: applicationCheckData } = useQuery({
    queryKey: ['applicationCheck', id],
    queryFn: async () => {
      try {
        const applications = await applicationApi.getMyApplications();
        const hasApplied = applications.data.some((app: any) => app.jobId === Number(id));
        return { hasApplied };
      } catch {
        return { hasApplied: false };
      }
    },
    enabled: !!id && isAuthenticated && user?.role === 'CANDIDATE',
  });

  const hasApplied = applicationCheckData?.hasApplied || false;

  // Toggle favorite
  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      if (isFavorite) {
        return await favoriteApi.removeFavoriteJob(Number(id!));
      } else {
        return await favoriteApi.addFavoriteJob(Number(id!));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorite', id] });
    },
  });

  // Apply for job
  const applyMutation = useMutation({
    mutationFn: async () => {
      return await applicationApi.applyForJob(Number(id!), { coverLetter: coverLetter.trim() || undefined });
    },
    onSuccess: () => {
      setApplyStep(3);
      setApplySuccess(true);
      queryClient.invalidateQueries({ queryKey: ['job', id] });
      queryClient.invalidateQueries({ queryKey: ['applicationCheck', id] });
      queryClient.invalidateQueries({ queryKey: ['applications', 'my'] });
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || 'Не удалось отправить отклик');
    },
  });

  const openApplyModal = () => {
    setApplyStep(1);
    setCoverLetter('');
    setApplySuccess(false);
    setShowApplyModal(true);
  };

  const closeApplyModal = () => {
    setShowApplyModal(false);
    setApplyStep(1);
    setApplySuccess(false);
  };

  // formatSalary imported from @shared/utils/formatSalary

  const getTagLabel = (value: string | null | undefined, type: 'schedule' | 'mode' | 'level'): string => {
    if (!value) return '';
    const labels: Record<string, Record<string, string>> = {
      schedule: {
        FULL_TIME: 'Полный день',
        PART_TIME: 'Частичная занятость',
      },
      mode: {
        OFFICE: 'Офис',
        REMOTE: 'Удаленно',
        HYBRID: 'Гибрид',
      },
      level: {
        INTERN: 'Стажер',
        JUNIOR: 'Junior',
        MIDDLE: 'Middle',
        SENIOR: 'Senior',
      },
    };
    return labels[type]?.[value] || value;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Опубликовано вчера';
    if (diffDays < 7) return `Опубликовано ${diffDays} дня назад`;
    if (diffDays < 30) return `Опубликовано ${Math.floor(diffDays / 7)} недели назад`;
    return `Опубликовано ${Math.floor(diffDays / 30)} месяца назад`;
  };

  // Mock office images (can be replaced with real data from company)
  const officeImages = [
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?auto=format&fit=crop&w=800&q=80"
  ];


  if (isLoading) {
    return (
      <LoadingContainer>
        <div>Загрузка...</div>
      </LoadingContainer>
    );
  }

  if (error || !job) {
    return (
      <ErrorContainer>
        <ErrorTitle>Вакансия не найдена</ErrorTitle>
        <ErrorButton onClick={() => navigate('/jobs')}>
          Вернуться к вакансиям
        </ErrorButton>
      </ErrorContainer>
    );
  }

  const canApply = isAuthenticated && user?.role === 'CANDIDATE' && job.status === 'ACTIVE' && !hasApplied;
  const canFavorite = isAuthenticated && user?.role === 'CANDIDATE';
  const companyInitials = job.company?.name?.charAt(0).toUpperCase() || 'C';

  return (
    <PageContainer>
      {/* 1. HERO HEADER WITH COVER */}
      <HeroSection>
        <HeroImage 
          src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
          alt="Office cover" 
        />
        <HeroOverlay />
        <BackButton onClick={() => navigate(-1)}>
          <ArrowLeft size={16} />
          Назад к поиску
        </BackButton>
      </HeroSection>

      <ContentWrapper>
        {/* HEADER CONTENT */}
        <HeaderRow>
          <HeaderCard>
            <BadgesContainer>
              <Badge $variant={job.status === 'ACTIVE' ? 'active' : undefined}>
                {job.status === 'ACTIVE' ? 'Активная вакансия' : job.status}
              </Badge>
              {job.workSchedule && (
                <Badge $variant="blue">
                  <Clock size={12} /> {getTagLabel(job.workSchedule, 'schedule')}
                </Badge>
              )}
              {job.workMode && (
                <Badge $variant="purple">
                  {getTagLabel(job.workMode, 'mode')}
                </Badge>
              )}
            </BadgesContainer>
            
            <JobTitle>{job.title}</JobTitle>
            
            <JobMeta>
              <MetaItem>
                <Building2 size={18} style={{ color: '#9ca3af' }} />
                <span>{job.company?.name}</span>
              </MetaItem>
              {job.company?.address && (
                <MetaItem>
                  <MapPin size={18} style={{ color: '#9ca3af' }} />
                  <span>{job.company.address}</span>
                </MetaItem>
              )}
              <MetaItem>
                <Calendar size={18} style={{ color: '#9ca3af' }} />
                <span>{formatDate(job.createdAt)}</span>
              </MetaItem>
              {job.viewsCount != null && (
                <MetaItem>
                  <Eye size={18} style={{ color: '#9ca3af' }} />
                  <span>{job.viewsCount} просмотров</span>
                </MetaItem>
              )}
            </JobMeta>
          </HeaderCard>

          {/* ACTIONS CARD (DESKTOP) */}
          <ActionsCard>
            <StickyCard>
              <SalaryLabel>Заработная плата</SalaryLabel>
              <SalaryAmount>{formatSalary(job.salaryMin, job.salaryMax, job.currency)}</SalaryAmount>
              
              {hasApplied ? (
                <ActionButton $variant="disabled" disabled>
                  <CheckCircle size={20} /> Вы откликнулись
                </ActionButton>
              ) : canApply ? (
                <ActionButton 
                  $variant="primary"
                  onClick={openApplyModal}
                >
                  Откликнуться <Send size={18} />
                </ActionButton>
              ) : !isAuthenticated ? (
                <ActionButton 
                  $variant="primary"
                  onClick={() => navigate('/login')}
                >
                  Войти для отклика
                </ActionButton>
              ) : null}
              
              {canFavorite && (
                <ActionButton 
                  $variant={isFavorite ? 'favoriteActive' : 'favorite'}
                  onClick={() => toggleFavoriteMutation.mutate()}
                  disabled={toggleFavoriteMutation.isPending}
                >
                  <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
                  {isFavorite ? 'В избранном' : 'В избранное'}
                </ActionButton>
              )}

              {isAuthenticated && (user?.role === 'HR' || user?.role === 'ADMIN') && (
                <ActionButton 
                  $variant="secondary"
                  onClick={() => navigate(`/jobs/${id}/hiring`)}
                  style={{ marginTop: '12px' }}
                >
                  <Users size={18} />
                  Воронка найма
                </ActionButton>
              )}
            </StickyCard>
          </ActionsCard>
        </HeaderRow>

        {/* MAIN GRID LAYOUT */}
        <GridLayout>
          {/* LEFT COLUMN (CONTENT) */}
          <LeftColumn>
            {/* ABOUT JOB */}
            <Section>
              <SectionTitle icon={Briefcase} title="Описание вакансии" />
              <Description>{job.description}</Description>

              {job.responsibilities && (
                <ResponsibilitiesList>
                  <h3 style={{ fontWeight: 700, color: '#1d1d1f', marginBottom: '16px' }}>Чем предстоит заниматься:</h3>
                  {job.responsibilities.split('\n').map((item: string, i: number) => (
                    <ResponsibilityItem key={i}>
                      <Dot />
                      {item.replace(/•\s*/, '')}
                    </ResponsibilityItem>
                  ))}
                </ResponsibilitiesList>
              )}
            </Section>

            {/* SKILLS */}
            {job.requiredSkills && job.requiredSkills.length > 0 && (
              <Section>
                <SectionTitle icon={Code} title="Требуемые навыки" />
                <SkillsContainer>
                  {job.requiredSkills.map((js: any) => (
                    <SkillTag key={js.skill.id}>{js.skill.name}</SkillTag>
                  ))}
                </SkillsContainer>
              </Section>
            )}

            {isHrViewer && (
              <Section>
                <SectionTitle icon={Users} title="Рекомендованные кандидаты" />
                {isRecommendedLoading ? (
                  <Description>Загрузка подходящих кандидатов...</Description>
                ) : recommendedCandidates.length > 0 ? (
                  <RecommendedList>
                    {recommendedCandidates.map((candidate) => (
                      <RecommendedCard key={candidate.candidateProfileId}>
                        <RecommendedInfo>
                          <RecommendedName>
                            {candidate.lastName} {candidate.firstName}
                          </RecommendedName>
                          <RecommendedHeadline>
                            {candidate.headline || 'Кандидат'}
                            {candidate.isOpenToWork ? ' · Ищет работу' : ''}
                          </RecommendedHeadline>
                          {candidate.matchedSkills.length > 0 && (
                            <MatchedSkillsRow>
                              {candidate.matchedSkills.map((skill) => (
                                <MatchedSkillTag key={skill}>{skill}</MatchedSkillTag>
                              ))}
                            </MatchedSkillsRow>
                          )}
                          <RecommendedActions>
                            <RecommendedButton
                              type="button"
                              onClick={() => navigate(`/candidates/${candidate.userId}`)}
                            >
                              Открыть профиль
                            </RecommendedButton>
                          </RecommendedActions>
                        </RecommendedInfo>
                        <MatchScoreBadge $score={candidate.matchScore}>
                          <MatchScoreValue $score={candidate.matchScore}>
                            {candidate.matchScore}%
                          </MatchScoreValue>
                          <MatchScoreLabel>совпадение</MatchScoreLabel>
                        </MatchScoreBadge>
                      </RecommendedCard>
                    ))}
                  </RecommendedList>
                ) : (
                  <Description>Подходящих кандидатов пока не найдено.</Description>
                )}
              </Section>
            )}

            {/* BENEFITS */}
            {job.benefits && (
              <Section>
                <SectionTitle icon={Gift} title="Что мы предлагаем" />
                <BenefitsGrid>
                  {job.benefits.split('\n').map((benefit: string, i: number) => (
                    <BenefitItem key={i}>
                      <CheckCircle size={18} style={{ color: '#2563eb', flexShrink: 0 }} />
                      <span style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}>
                        {benefit.replace(/•\s*/, '')}
                      </span>
                    </BenefitItem>
                  ))}
                </BenefitsGrid>
              </Section>
            )}

            {/* OFFICE GALLERY */}
            <Section>
              <SectionTitle icon={Building2} title="Наш офис" />
              <OfficeGallery>
                {officeImages.map((img: string, i: number) => (
                  <OfficeImage key={i} src={img} alt="Office" />
                ))}
              </OfficeGallery>
            </Section>
          </LeftColumn>

          {/* RIGHT COLUMN (SIDEBAR) */}
          <RightColumn>
            {/* COMPANY CARD */}
            <CompanyCard>
              <CompanyHeader>
                <CompanyLogo>{companyInitials}</CompanyLogo>
                <CompanyInfo>
                  <CompanyName>{job.company?.name}</CompanyName>
                  <CompanyIndustry>IT Компания</CompanyIndustry>
                </CompanyInfo>
              </CompanyHeader>

              <CompanyDetails>
                <DetailRow>
                  <DetailLabel>Размер команды</DetailLabel>
                  <DetailValue>{job.company?.employeeCount || 'Не указано'}</DetailValue>
                </DetailRow>
                {job.company?.address && (
                  <DetailRow>
                    <DetailLabel>Локация</DetailLabel>
                    <DetailValue>{job.company.address}</DetailValue>
                  </DetailRow>
                )}
              </CompanyDetails>

              <SocialButtons>
                <SocialButton>
                  <Linkedin size={20} />
                </SocialButton>
                <SocialButton>
                  <Twitter size={20} />
                </SocialButton>
                <SocialButton>
                  <Globe size={20} />
                </SocialButton>
                <SocialButton>
                  <Share2 size={20} />
                </SocialButton>
              </SocialButtons>
            </CompanyCard>

            {/* MAP SECTION */}
            {job.company?.address && (
              <MapSection>
                <MapContainer>
                  <MapIframe
                    src={`https://widgets.2gis.com/widget?type=firmsonmap&options=%7B%22zoom%22%3A13%7D&query=${encodeURIComponent(job.company.address)}`}
                    title="Карта 2GIS"
                    allowFullScreen
                    loading="lazy"
                  />
                </MapContainer>
              </MapSection>
            )}

            {/* SIMILAR JOBS */}
            {similarJobs.length > 0 && (
              <SimilarJobsSection>
                <SectionTitleSmall>Похожие вакансии</SectionTitleSmall>
                <SimilarJobsList>
                  {similarJobs.map((similar: any) => (
                    <SimilarJobCard 
                      key={similar.id} 
                      onClick={() => navigate(`/jobs/${similar.id}`)}
                    >
                      <SimilarJobTitle>{similar.title}</SimilarJobTitle>
                      <SimilarJobMeta>
                        <SimilarJobCompany>{similar.company?.name}</SimilarJobCompany>
                        <SimilarJobSalary>{formatSalary(similar.salaryMin, similar.salaryMax, similar.currency)}</SimilarJobSalary>
                      </SimilarJobMeta>
                    </SimilarJobCard>
                  ))}
                  <ViewAllButton onClick={() => navigate('/jobs')}>
                    Смотреть все
                  </ViewAllButton>
                </SimilarJobsList>
              </SimilarJobsSection>
            )}
          </RightColumn>
        </GridLayout>
      </ContentWrapper>

      {/* MOBILE FIXED ACTION BAR */}
      <MobileActionBar>
        {canFavorite && (
          <MobileFavoriteButton 
            $active={isFavorite}
            onClick={() => toggleFavoriteMutation.mutate()}
            disabled={toggleFavoriteMutation.isPending}
          >
            <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
          </MobileFavoriteButton>
        )}
        {hasApplied ? (
          <MobileActionButton $variant="disabled" disabled>
            <CheckCircle size={20} /> Отклик отправлен
          </MobileActionButton>
        ) : canApply ? (
          <MobileActionButton 
            $variant="primary"
            onClick={openApplyModal}
          >
            Откликнуться
          </MobileActionButton>
        ) : !isAuthenticated ? (
          <MobileActionButton 
            $variant="primary"
            onClick={() => navigate('/login')}
          >
            Войти для отклика
          </MobileActionButton>
        ) : null}
      </MobileActionBar>

      {/* APPLY MODAL */}
      <AnimatePresence>
        {showApplyModal && (
          <ModalOverlay onClick={closeApplyModal}>
            <ModalContent 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalHeader>
                <ModalTitle>Отклик на вакансию</ModalTitle>
                <ModalCloseButton onClick={closeApplyModal}>
                  ✕
                </ModalCloseButton>
              </ModalHeader>
              
              <ModalBody>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
                  {[1, 2, 3].map((step) => (
                    <div
                      key={step}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12,
                        fontWeight: 700,
                        color: applyStep >= step ? '#fff' : '#6b7280',
                        background: applyStep >= step ? '#2563eb' : '#e5e7eb',
                      }}
                    >
                      {step}
                    </div>
                  ))}
                </div>

                {applyStep === 1 && (
                  <div>
                    <h4 style={{ marginBottom: 10 }}>Шаг 1: Проверьте профиль</h4>
                    <JobPreview>
                      <JobPreviewLogo>{companyInitials}</JobPreviewLogo>
                      <JobPreviewInfo>
                        <JobPreviewTitle>{job.title}</JobPreviewTitle>
                        <JobPreviewCompany>{job.company?.name}</JobPreviewCompany>
                      </JobPreviewInfo>
                    </JobPreview>
                    <div style={{ fontSize: 14, color: '#4b5563' }}>
                      Убедитесь, что ваш профиль и резюме актуальны перед отправкой отклика.
                    </div>
                  </div>
                )}

                {applyStep === 2 && (
                  <div>
                    <h4 style={{ marginBottom: 10 }}>Шаг 2: Сопроводительное письмо</h4>
                    <TextareaLabel>Сопроводительное письмо (рекомендуется)</TextareaLabel>
                    <TextareaStyled
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      placeholder="Здравствуйте! Меня заинтересовала ваша вакансия..."
                    />
                    <TextareaCounter>{coverLetter.length} символов</TextareaCounter>
                  </div>
                )}

                {applyStep === 3 && (
                  <div>
                    {!applySuccess ? (
                      <>
                        <h4 style={{ marginBottom: 10 }}>Шаг 3: Подтверждение</h4>
                        <JobPreview>
                          <JobPreviewLogo>{companyInitials}</JobPreviewLogo>
                          <JobPreviewInfo>
                            <JobPreviewTitle>{job.title}</JobPreviewTitle>
                            <JobPreviewCompany>{job.company?.name}</JobPreviewCompany>
                          </JobPreviewInfo>
                        </JobPreview>
                        <div style={{ fontSize: 14, color: '#4b5563' }}>
                          Проверьте данные и отправьте отклик. После отправки сможете отслеживать статус в Dashboard.
                        </div>
                      </>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '16px 0' }}>
                        <CheckCircle size={44} color="#16a34a" />
                        <h4 style={{ marginTop: 8 }}>Отклик отправлен!</h4>
                        <div style={{ color: '#4b5563', fontSize: 14 }}>Теперь можно отслеживать прогресс по заявке.</div>
                      </div>
                    )}
                  </div>
                )}
              </ModalBody>

              <ModalFooter>
                {!applySuccess && (
                  <ModalButton $variant="secondary" onClick={closeApplyModal}>
                    Отмена
                  </ModalButton>
                )}

                {applyStep > 1 && !applySuccess && (
                  <ModalButton $variant="secondary" onClick={() => setApplyStep((s) => Math.max(1, s - 1))}>
                    Назад
                  </ModalButton>
                )}

                {applyStep < 3 && (
                  <ModalButton $variant="primary" onClick={() => setApplyStep((s) => Math.min(3, s + 1))}>
                    Далее
                  </ModalButton>
                )}

                {applyStep === 3 && !applySuccess && (
                  <ModalButton $variant="primary" onClick={() => applyMutation.mutate()} disabled={applyMutation.isPending}>
                    {applyMutation.isPending ? 'Отправка...' : 'Отправить отклик'}
                  </ModalButton>
                )}

                {applySuccess && (
                  <ModalButton
                    $variant="primary"
                    onClick={() => {
                      closeApplyModal();
                      navigate('/dashboard');
                    }}
                  >
                    Отслеживать статус
                  </ModalButton>
                )}
              </ModalFooter>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </PageContainer>
  );
};
