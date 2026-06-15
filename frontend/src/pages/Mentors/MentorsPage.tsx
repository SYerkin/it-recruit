import React, { useMemo, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { Search, Star, Clock3, Briefcase, Sparkles, ArrowUpRight, Filter, Zap, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { mentorApi, Mentor, feedbackApi } from '@shared/api';
import { MentorRequestModal } from './MentorRequestModal';
import { useAuthStore } from '@app/store/auth.store';
import { useTranslation } from 'react-i18next';

const drift = keyframes`
  0% { transform: translate3d(0, 0, 0) rotate(0deg); }
  50% { transform: translate3d(16px, -10px, 0) rotate(4deg); }
  100% { transform: translate3d(0, 0, 0) rotate(0deg); }
`;

const shine = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const Page = styled.div`
  max-width: 1260px;
  margin: 0 auto;
  padding: 24px;
  min-height: 100vh;
  position: relative;
  isolation: isolate;
  background:
    radial-gradient(circle at 15% 10%, rgba(99, 102, 241, 0.2), transparent 28%),
    radial-gradient(circle at 90% 85%, rgba(20, 184, 166, 0.16), transparent 36%),
    linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%);
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    background-image: linear-gradient(rgba(148, 163, 184, 0.12) 1px, transparent 1px),
      linear-gradient(90deg, rgba(148, 163, 184, 0.12) 1px, transparent 1px);
    background-size: 42px 42px;
    mask-image: radial-gradient(circle at 50% 30%, black 20%, transparent 72%);
    pointer-events: none;
  }
  @media (max-width: 768px) {
    padding: 14px;
  }
`;

const Hero = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 34px;
  margin-bottom: 26px;
  padding: 56px 30px;
  color: #fff;
  background: linear-gradient(120deg, #020617 0%, #312e81 28%, #0f766e 70%, #0ea5e9 100%);
  background-size: 220% 220%;
  animation: ${shine} 12s ease infinite;
  box-shadow: 0 26px 70px rgba(15, 23, 42, 0.4);
  @media (max-width: 768px) {
    border-radius: 22px;
    padding: 28px 16px;
    margin-bottom: 16px;
  }
`;

const Orb = styled.div`
  position: absolute;
  border-radius: 999px;
  filter: blur(75px);
  opacity: 0.4;
  pointer-events: none;
`;

const OrbA = styled(Orb)`
  width: 280px;
  height: 280px;
  top: -80px;
  right: -20px;
  background: #a78bfa;
  animation: ${drift} 8s ease-in-out infinite;
`;

const OrbB = styled(Orb)`
  width: 320px;
  height: 320px;
  left: -90px;
  bottom: -160px;
  background: #22d3ee;
  animation: ${drift} 9.5s ease-in-out infinite reverse;
`;

const Label = styled.div`
  position: relative;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  padding: 5px 11px;
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 800;
  margin-bottom: 12px;
`;

const HeroTitle = styled.h1`
  position: relative;
  z-index: 2;
  font-size: clamp(34px, 6vw, 72px);
  line-height: 0.95;
  letter-spacing: -0.04em;
  color: #fff;
  font-weight: 900;
  max-width: 820px;
  margin-bottom: 14px;
`;

const HeroSubtitle = styled.p`
  position: relative;
  z-index: 2;
  max-width: 760px;
  font-size: 17px;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.86);
  margin-bottom: 20px;
  @media (max-width: 768px) {
    font-size: 14px;
    line-height: 1.55;
  }
`;

const HeroActions = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  gap: 10px;
  margin-bottom: 18px;
  flex-wrap: wrap;
  @media (max-width: 640px) {
    flex-direction: column;
    width: 100%;
  }
`;

const HeroBtn = styled.button<{ $secondary?: boolean }>`
  height: 40px;
  padding: 0 14px;
  border-radius: 10px;
  border: ${({ $secondary }) => ($secondary ? '1px solid rgba(255,255,255,0.25)' : 'none')};
  background: ${({ $secondary }) => ($secondary ? 'rgba(255,255,255,0.12)' : '#fff')};
  color: ${({ $secondary }) => ($secondary ? '#fff' : '#111827')};
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.02em;
  cursor: pointer;
  @media (max-width: 640px) {
    width: 100%;
    justify-content: center;
  }
`;

const HeroStats = styled.div`
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const Stat = styled.div`
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  padding: 10px 12px;
  .value {
    font-size: 24px;
    font-weight: 900;
    letter-spacing: -0.03em;
  }
  .hint {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.8);
  }
`;

const Panel = styled.div`
  border-radius: 20px;
  padding: 16px;
  margin-bottom: 10px;
  border: 1px solid #cbd5e1;
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(10px);
`;

const Toolbar = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
`;

const SearchWrap = styled.div`
  position: relative;
  flex: 1;
  min-width: 240px;
  @media (max-width: 640px) {
    min-width: 100%;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  height: 48px;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  padding: 0 12px 0 42px;
  background: #fff;
  font-size: 14px;
  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.12);
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 13px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
`;

const Chips = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const Chip = styled.button<{ $active: boolean }>`
  border: 1px solid ${({ $active }) => ($active ? '#6366f1' : '#cbd5e1')};
  border-radius: 999px;
  height: 38px;
  padding: 0 13px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.02em;
  color: ${({ $active }) => ($active ? '#312e81' : '#475569')};
  background: ${({ $active }) => ($active ? '#e0e7ff' : '#fff')};
  cursor: pointer;
`;

const ResultRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-size: 13px;
  color: #334155;
  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
`;

const Grid = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-auto-flow: dense;
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled(motion.div)`
  position: relative;
  overflow: hidden;
  border-radius: 22px;
  border: 1px solid #cbd5e1;
  background: linear-gradient(160deg, #ffffff 0%, #f8fafc 62%, #eef2ff 100%);
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.09);
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  &:hover {
    transform: translateY(-4px) rotate(-0.4deg);
    box-shadow: 0 22px 48px rgba(15, 23, 42, 0.16);
  }
  &:nth-child(6n + 1) {
    transform: rotate(-0.9deg);
  }
  &:nth-child(6n + 2) {
    transform: rotate(0.8deg);
  }
  &:nth-child(5n + 1) {
    grid-column: span 2;
    @media (max-width: 980px) {
      grid-column: span 1;
    }
  }
  @media (max-width: 640px) {
    border-radius: 16px;
    &:nth-child(6n + 1),
    &:nth-child(6n + 2) {
      transform: none;
    }
    &:hover {
      transform: none;
    }
  }
`;

const CardDecor = styled.div`
  position: absolute;
  width: 140px;
  height: 140px;
  border-radius: 999px;
  top: -60px;
  right: -40px;
  background: radial-gradient(circle at 30% 30%, rgba(99, 102, 241, 0.4), rgba(14, 165, 233, 0.05));
`;

const CardTop = styled.div`
  padding: 18px 18px 14px;
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 10px;
`;

const Avatar = styled.div<{ $url?: string }>`
  width: 56px;
  height: 56px;
  border-radius: 14px;
  flex-shrink: 0;
  border: 1px solid #cbd5e1;
  background: ${({ $url }) => ($url ? `url(${$url}) center/cover` : 'linear-gradient(135deg, #4f46e5, #14b8a6)')};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 22px;
`;

const Meta = styled.div`
  flex: 1;
  min-width: 0;
`;

const Name = styled.h3`
  font-size: 17px;
  font-weight: 900;
  color: #0f172a;
  margin-bottom: 2px;
`;

const Title = styled.p`
  color: #64748b;
  font-size: 12px;
  line-height: 1.45;
`;

const Rating = styled.div`
  margin-top: 6px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border-radius: 999px;
  border: 1px solid #fed7aa;
  background: #fff7ed;
  color: #9a3412;
  padding: 4px 9px;
  font-size: 11px;
  font-weight: 800;
`;

const Bio = styled.p`
  color: #334155;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Skills = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const Skill = styled.span`
  border-radius: 999px;
  border: 1px solid #a5f3fc;
  background: #ecfeff;
  color: #115e59;
  padding: 4px 9px;
  font-size: 11px;
  font-weight: 700;
`;

const CardBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 12px 18px;
  border-top: 1px solid #e2e8f0;
  background: rgba(255, 255, 255, 0.8);
  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Info = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  font-size: 11px;
  font-weight: 700;
  div {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
`;

const Price = styled.div`
  text-align: right;
  .value {
    font-size: 17px;
    font-weight: 900;
    color: #0f172a;
  }
  .hint {
    font-size: 10px;
    color: #94a3b8;
  }
  @media (max-width: 640px) {
    text-align: left;
  }
`;

const Action = styled.div`
  padding: 10px 18px 16px;
  border-top: 1px dashed #cbd5e1;
`;

const ActionBtn = styled.button`
  width: 100%;
  height: 42px;
  border: 1px solid #c7d2fe;
  border-radius: 11px;
  background: linear-gradient(135deg, #eef2ff 0%, #ecfeff 100%);
  color: #3730a3;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.02em;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
`;

const Empty = styled.div`
  border-radius: 16px;
  border: 1px dashed #94a3b8;
  background: rgba(255, 255, 255, 0.82);
  padding: 56px 20px;
  text-align: center;
  color: #64748b;
`;

const MentorApplyOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1200;
  background: rgba(2, 6, 23, 0.62);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  @media (max-width: 640px) {
    align-items: flex-start;
    padding: 8px;
    overflow-y: auto;
  }
`;

const MentorApplyModal = styled.div`
  width: 100%;
  max-width: 560px;
  border-radius: 18px;
  border: 1px solid #cbd5e1;
  background: #fff;
  box-shadow: 0 22px 48px rgba(15, 23, 42, 0.2);
  padding: 20px;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  @media (max-width: 640px) {
    border-radius: 14px;
    padding: 14px;
    max-height: calc(100vh - 16px);
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
`;

const ModalTitle = styled.h3`
  font-size: 22px;
  font-weight: 900;
  color: #0f172a;
`;

const CloseButton = styled.button`
  width: 34px;
  height: 34px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const ModalForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ModalInput = styled.input`
  height: 42px;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  padding: 0 12px;
  font-size: 14px;
`;

const ModalTextArea = styled.textarea`
  min-height: 90px;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  padding: 10px 12px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
`;

const ModalSubmit = styled.button`
  height: 44px;
  border: none;
  border-radius: 11px;
  background: linear-gradient(135deg, #4f46e5, #0ea5e9);
  color: #fff;
  font-size: 13px;
  font-weight: 900;
  cursor: pointer;
  margin-top: 4px;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ModalHint = styled.div`
  font-size: 12px;
  color: #64748b;
`;

const FILTER_TECH_OPTIONS = ['React', 'Node.js', 'Python', 'DevOps'];

export const MentorsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [showMentorApply, setShowMentorApply] = useState(false);
  const [mentorApplyLoading, setMentorApplyLoading] = useState(false);
  const [mentorApplyDone, setMentorApplyDone] = useState(false);
  const [mentorApplyForm, setMentorApplyForm] = useState({
    name: '',
    email: user?.email || '',
    currentTitle: '',
    experienceYears: '',
    skills: '',
    bio: '',
    motivation: '',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['mentors', search, activeFilter],
    queryFn: () =>
      mentorApi.getAll({
        search: search || undefined,
        free: activeFilter === 'free' ? true : undefined,
        skill: activeFilter && activeFilter !== 'free' ? activeFilter : undefined,
      }),
  });

  const mentors = data?.data || [];
  const totalSessions = useMemo(() => mentors.length * 8, [mentors.length]);

  const onMentorApplySubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!mentorApplyForm.name || !mentorApplyForm.email || !mentorApplyForm.currentTitle || !mentorApplyForm.bio || !mentorApplyForm.motivation) {
      return;
    }
    setMentorApplyLoading(true);
    try {
      await feedbackApi.applyMentor({
        name: mentorApplyForm.name,
        email: mentorApplyForm.email,
        currentTitle: mentorApplyForm.currentTitle,
        experienceYears: Number(mentorApplyForm.experienceYears) || 0,
        skills: mentorApplyForm.skills,
        bio: mentorApplyForm.bio,
        motivation: mentorApplyForm.motivation,
      });
      setMentorApplyDone(true);
    } catch {
      alert(t('mentors.errorSubmit'));
    } finally {
      setMentorApplyLoading(false);
    }
  };

  const filterOptions = [
    { label: t('mentors.filterAll'), value: '' },
    { label: t('mentors.filterFree'), value: 'free' },
    ...FILTER_TECH_OPTIONS.map((v) => ({ label: v, value: v })),
  ];

  return (
    <Page>
      <Hero>
        <OrbA />
        <OrbB />
        <Label>
          <Zap size={12} />
          IT Recruit Mentorship
        </Label>
        <HeroTitle>{t('mentors.heroTitle')}</HeroTitle>
        <HeroSubtitle>{t('mentors.heroSubtitle')}</HeroSubtitle>
        <HeroActions>
          <HeroBtn onClick={() => setShowMentorApply(true)}>{t('mentors.becomeMentor')}</HeroBtn>
          <HeroBtn $secondary onClick={() => navigate('/recommendations')}>{t('mentors.viewMaterials')}</HeroBtn>
        </HeroActions>
        <HeroStats>
          <Stat>
            <div className="value">{mentors.length}+</div>
            <div className="hint">{t('mentors.activeMentors')}</div>
          </Stat>
          <Stat>
            <div className="value">{totalSessions}+</div>
            <div className="hint">{t('mentors.sessionsPerMonth')}</div>
          </Stat>
          <Stat>
            <div className="value">4.9/5</div>
            <div className="hint">{t('mentors.avgRating')}</div>
          </Stat>
        </HeroStats>
      </Hero>

      <Panel>
        <Toolbar>
          <SearchWrap>
            <SearchIcon size={16} />
            <SearchInput
              placeholder={t('mentors.searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </SearchWrap>
          <Chips>
            {filterOptions.map((option) => (
              <Chip key={option.value} $active={activeFilter === option.value} onClick={() => setActiveFilter(option.value)}>
                {option.label}
              </Chip>
            ))}
          </Chips>
        </Toolbar>
      </Panel>

      <ResultRow>
        <span>
          <Sparkles size={13} style={{ verticalAlign: 'text-bottom', marginRight: 6 }} />
          {t('mentors.foundCount')} <strong>{mentors.length}</strong>
        </span>
        <span>
          <Filter size={13} style={{ verticalAlign: 'text-bottom', marginRight: 6 }} />
          {activeFilter || t('mentors.modeAll')}
        </span>
      </ResultRow>

      {isLoading ? (
        <Empty>{t('mentors.loading')}</Empty>
      ) : mentors.length === 0 ? (
        <Empty>{t('mentors.empty')}</Empty>
      ) : (
        <Grid>
          {mentors.map((mentor, index) => {
            const skills = Array.isArray(mentor.skills) ? mentor.skills : [];
            return (
              <Card
                key={mentor.id}
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                onClick={() => navigate(`/mentors/${mentor.id}`)}
              >
                <CardDecor />
                <CardTop>
                  <Header>
                    <Avatar $url={mentor.avatarUrl || undefined}>{!mentor.avatarUrl && mentor.name.charAt(0)}</Avatar>
                    <Meta>
                      <Name>{mentor.name}</Name>
                      <Title>
                        {mentor.title}
                        {mentor.company ? ` · ${mentor.company}` : ''}
                      </Title>
                      <Rating>
                        <Star size={11} fill="#f59e0b" color="#f59e0b" />
                        {mentor.rating.toFixed(1)} · {mentor.reviewsCount} {t('mentors.reviews')}
                      </Rating>
                    </Meta>
                  </Header>
                  <Bio>{mentor.bio}</Bio>
                  <Skills>
                    {skills.slice(0, 5).map((skill) => <Skill key={skill}>{skill}</Skill>)}
                  </Skills>
                </CardTop>

                <CardBottom>
                  <Info>
                    <div><Briefcase size={12} />{mentor.experienceYears} {t('mentors.years')}</div>
                    <div><Clock3 size={12} />{mentor.sessionDuration} {t('mentors.min')}</div>
                  </Info>
                  <Price>
                    <div className="value">
                      {mentor.pricePerSession === 0 ? t('mentors.free') : `${mentor.pricePerSession.toLocaleString('ru')} ₸`}
                    </div>
                    <div className="hint">{t('mentors.perSession')}</div>
                  </Price>
                </CardBottom>

                <Action>
                  <ActionBtn onClick={(event) => { event.stopPropagation(); setSelectedMentor(mentor); }}>
                    {t('mentors.bookSlot')} <ArrowUpRight size={13} />
                  </ActionBtn>
                </Action>
              </Card>
            );
          })}
        </Grid>
      )}

      {selectedMentor && <MentorRequestModal mentor={selectedMentor} onClose={() => setSelectedMentor(null)} />}

      {showMentorApply && (
        <MentorApplyOverlay onClick={() => setShowMentorApply(false)}>
          <MentorApplyModal onClick={(event) => event.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>{t('mentors.applyTitle')}</ModalTitle>
              <CloseButton onClick={() => setShowMentorApply(false)}><X size={16} /></CloseButton>
            </ModalHeader>

            {mentorApplyDone ? (
              <div style={{ textAlign: 'center', padding: '18px 0' }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>{t('mentors.applyDone')}</div>
                <div style={{ fontSize: 14, color: '#64748b', marginBottom: 14 }}>{t('mentors.applyDoneText')}</div>
                <ModalSubmit onClick={() => setShowMentorApply(false)}>{t('mentors.close')}</ModalSubmit>
              </div>
            ) : (
              <ModalForm onSubmit={onMentorApplySubmit}>
                <ModalInput placeholder={t('mentors.namePlaceholder')} value={mentorApplyForm.name} onChange={(event) => setMentorApplyForm((prev) => ({ ...prev, name: event.target.value }))} />
                <ModalInput type="email" placeholder={t('mentors.emailPlaceholder')} value={mentorApplyForm.email} onChange={(event) => setMentorApplyForm((prev) => ({ ...prev, email: event.target.value }))} />
                <ModalInput placeholder={t('mentors.titlePlaceholder')} value={mentorApplyForm.currentTitle} onChange={(event) => setMentorApplyForm((prev) => ({ ...prev, currentTitle: event.target.value }))} />
                <ModalInput type="number" min={0} placeholder={t('mentors.expPlaceholder')} value={mentorApplyForm.experienceYears} onChange={(event) => setMentorApplyForm((prev) => ({ ...prev, experienceYears: event.target.value }))} />
                <ModalInput placeholder={t('mentors.skillsPlaceholder')} value={mentorApplyForm.skills} onChange={(event) => setMentorApplyForm((prev) => ({ ...prev, skills: event.target.value }))} />
                <ModalTextArea placeholder={t('mentors.bioPlaceholder')} value={mentorApplyForm.bio} onChange={(event) => setMentorApplyForm((prev) => ({ ...prev, bio: event.target.value }))} />
                <ModalTextArea placeholder={t('mentors.motivationPlaceholder')} value={mentorApplyForm.motivation} onChange={(event) => setMentorApplyForm((prev) => ({ ...prev, motivation: event.target.value }))} />
                <ModalHint>{t('mentors.applyHint')}</ModalHint>
                <ModalSubmit type="submit" disabled={mentorApplyLoading}>
                  {mentorApplyLoading ? t('mentors.submitting') : t('mentors.submit')}
                </ModalSubmit>
              </ModalForm>
            )}
          </MentorApplyModal>
        </MentorApplyOverlay>
      )}
    </Page>
  );
};
