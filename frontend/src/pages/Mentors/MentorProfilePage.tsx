import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Star, Clock3, Briefcase, Sparkles, MessageCircle, Verified, Zap } from 'lucide-react';
import { mentorApi } from '@shared/api';
import { MentorRequestModal } from './MentorRequestModal';

const float = keyframes`
  0% { transform: translate3d(0, 0, 0); }
  50% { transform: translate3d(0, -10px, 0); }
  100% { transform: translate3d(0, 0, 0); }
`;

const Page = styled.div`
  max-width: 1020px;
  margin: 0 auto;
  padding: 24px;
  min-height: 100vh;
  background:
    radial-gradient(circle at 0% 0%, rgba(99, 102, 241, 0.12), transparent 35%),
    radial-gradient(circle at 100% 100%, rgba(20, 184, 166, 0.1), transparent 35%),
    linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%);
  @media (max-width: 640px) {
    padding: 14px;
  }
`;

const Back = styled.button`
  border: none;
  background: transparent;
  color: #475569;
  font-size: 14px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  margin-bottom: 14px;
`;

const Hero = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 30px;
  margin-bottom: 16px;
  border: 1px solid #cbd5e1;
  box-shadow: 0 22px 54px rgba(15, 23, 42, 0.16);
  @media (max-width: 640px) {
    border-radius: 18px;
  }
`;

const HeroTop = styled.div`
  position: relative;
  background: linear-gradient(125deg, #020617 0%, #312e81 42%, #0f766e 100%);
  color: #fff;
  padding: 28px;
  @media (max-width: 640px) {
    padding: 16px;
  }
`;

const Orb = styled.div`
  position: absolute;
  border-radius: 999px;
  filter: blur(76px);
  opacity: 0.4;
  pointer-events: none;
  animation: ${float} 7s ease-in-out infinite;
`;

const OrbA = styled(Orb)`
  width: 240px;
  height: 240px;
  top: -80px;
  right: -30px;
  background: #a78bfa;
`;

const OrbB = styled(Orb)`
  width: 280px;
  height: 280px;
  bottom: -140px;
  left: -80px;
  background: #22d3ee;
  animation-delay: 1.2s;
`;

const Header = styled.div`
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 14px;
  align-items: start;
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const Avatar = styled.div<{ $url?: string }>`
  width: 100px;
  height: 100px;
  border-radius: 24px;
  border: 2px solid rgba(255, 255, 255, 0.26);
  background: ${({ $url }) => ($url ? `url(${$url}) center/cover` : 'linear-gradient(135deg, #22d3ee, #6366f1)')};
  color: #fff;
  font-size: 36px;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  @media (max-width: 640px) {
    width: 82px;
    height: 82px;
    border-radius: 18px;
    font-size: 28px;
  }
`;

const Name = styled.h1`
  font-size: clamp(30px, 5vw, 50px);
  line-height: 0.95;
  letter-spacing: -0.04em;
  font-weight: 900;
  margin-bottom: 5px;
  color: #ffffff;
`;

const Title = styled.p`
  color: rgba(255, 255, 255, 0.86);
  font-size: 15px;
  margin-bottom: 10px;
`;

const Chips = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  @media (max-width: 640px) {
    gap: 6px;
  }
`;

const Chip = styled.div`
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.24);
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  font-size: 11px;
  font-weight: 800;
  padding: 5px 9px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  @media (max-width: 640px) {
    font-size: 10px;
    padding: 4px 8px;
  }
`;

const HeroBottom = styled.div`
  background: rgba(255, 255, 255, 0.92);
  padding: 18px 22px 20px;
  display: grid;
  grid-template-columns: 1.25fr 1fr;
  gap: 16px;
  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
  @media (max-width: 640px) {
    padding: 14px;
  }
`;

const BioTitle = styled.h2`
  font-size: 16px;
  font-weight: 900;
  color: #0f172a;
  margin-bottom: 8px;
`;

const Bio = styled.p`
  color: #334155;
  font-size: 15px;
  line-height: 1.75;
`;

const Booking = styled.div`
  border-radius: 18px;
  border: 1px solid #c7d2fe;
  background: linear-gradient(135deg, #eef2ff 0%, #ecfeff 100%);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: space-between;
`;

const BookingLabel = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 999px;
  border: 1px solid #c7d2fe;
  background: #fff;
  color: #3730a3;
  width: fit-content;
  padding: 4px 9px;
  font-size: 10px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-weight: 800;
`;

const Price = styled.div`
  font-size: 34px;
  line-height: 1;
  font-weight: 900;
  color: #0f172a;
  @media (max-width: 640px) {
    font-size: 28px;
  }
`;

const PriceHint = styled.div`
  color: #64748b;
  font-size: 12px;
`;

const BookBtn = styled.button`
  height: 44px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  background: linear-gradient(135deg, #4f46e5, #0ea5e9);
  color: #fff;
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 0.02em;
`;

const Section = styled.div`
  border-radius: 22px;
  border: 1px solid #cbd5e1;
  background: rgba(255, 255, 255, 0.84);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
  padding: 20px;
  margin-bottom: 14px;
  @media (max-width: 640px) {
    border-radius: 16px;
    padding: 14px;
  }
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 900;
  color: #0f172a;
  margin-bottom: 12px;
`;

const Skills = styled.div`
  display: flex;
  gap: 7px;
  flex-wrap: wrap;
`;

const Skill = styled.span`
  border-radius: 999px;
  border: 1px solid #a5f3fc;
  background: #ecfeff;
  color: #115e59;
  padding: 6px 11px;
  font-size: 11px;
  font-weight: 800;
`;

const Review = styled.div`
  border-bottom: 1px solid #e2e8f0;
  padding: 12px 0;
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const ReviewTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-bottom: 5px;
  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ReviewUser = styled.div`
  font-size: 13px;
  color: #0f172a;
  font-weight: 800;
`;

const ReviewDate = styled.div`
  font-size: 11px;
  color: #94a3b8;
`;

const ReviewText = styled.p`
  color: #334155;
  font-size: 14px;
  line-height: 1.6;
`;

const Empty = styled.div`
  border-radius: 16px;
  border: 1px dashed #94a3b8;
  background: rgba(255, 255, 255, 0.8);
  padding: 24px;
  color: #64748b;
  text-align: center;
`;

export const MentorProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['mentor', id],
    queryFn: () => mentorApi.getById(parseInt(id || '0', 10)),
    enabled: !!id,
  });

  const mentor = data?.data;
  if (isLoading) return <Page><Empty>Загружаем профиль ментора...</Empty></Page>;
  if (!mentor) return <Page><Empty>Ментор не найден.</Empty></Page>;

  const skills = Array.isArray(mentor.skills) ? mentor.skills : [];
  const reviews = mentor.reviews || [];

  return (
    <Page>
      <Back onClick={() => navigate('/mentors')}>
        <ArrowLeft size={15} />
        Назад к менторам
      </Back>

      <Hero>
        <HeroTop>
          <OrbA />
          <OrbB />
          <Header>
            <Avatar $url={mentor.avatarUrl || undefined}>{!mentor.avatarUrl && mentor.name.charAt(0)}</Avatar>
            <div>
              <Name>{mentor.name}</Name>
              <Title>
                {mentor.title}
                {mentor.company ? ` · ${mentor.company}` : ''}
              </Title>
              <Chips>
                <Chip>
                  <Star size={12} fill="#f59e0b" color="#f59e0b" />
                  {mentor.rating.toFixed(1)} / 5
                </Chip>
                <Chip>
                  <Briefcase size={12} />
                  {mentor.experienceYears} лет опыта
                </Chip>
                <Chip>
                  <Clock3 size={12} />
                  {mentor.sessionDuration} мин
                </Chip>
                <Chip>
                  <Verified size={12} />
                  Проверенный
                </Chip>
              </Chips>
            </div>
          </Header>
        </HeroTop>

        <HeroBottom>
          <div>
            <BioTitle>О менторе</BioTitle>
            <Bio>{mentor.bio}</Bio>
          </div>
          <Booking>
            <BookingLabel>
              <Zap size={11} />
              fast track
            </BookingLabel>
            <div>
              <Price>{mentor.pricePerSession === 0 ? 'Бесплатно' : `${mentor.pricePerSession.toLocaleString('ru')} ₸`}</Price>
              <PriceHint>за {mentor.sessionDuration} минут практической сессии</PriceHint>
            </div>
            <BookBtn onClick={() => setShowModal(true)}>Забронировать сессию</BookBtn>
          </Booking>
        </HeroBottom>
      </Hero>

      <Section>
        <SectionTitle>
          <Sparkles size={17} style={{ verticalAlign: 'text-bottom', marginRight: 6 }} />
          Навыки и зона экспертизы
        </SectionTitle>
        <Skills>
          {skills.map((skill) => (
            <Skill key={skill}>{skill}</Skill>
          ))}
        </Skills>
      </Section>

      <Section>
        <SectionTitle>
          <MessageCircle size={17} style={{ verticalAlign: 'text-bottom', marginRight: 6 }} />
          Отзывы ({reviews.length})
        </SectionTitle>
        {reviews.length === 0 ? (
          <Empty>Пока нет отзывов. Будьте первым, кто оставит фидбек после сессии.</Empty>
        ) : (
          reviews.map((review) => (
            <Review key={review.id}>
              <ReviewTop>
                <div>
                  <ReviewUser>{review.user?.email?.split('@')[0] || 'Пользователь'}</ReviewUser>
                  <ReviewDate>{new Date(review.createdAt).toLocaleDateString('ru-RU')}</ReviewDate>
                </div>
                <div style={{ color: '#f59e0b', fontSize: 13, fontWeight: 900 }}>
                  {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                </div>
              </ReviewTop>
              {review.comment && <ReviewText>{review.comment}</ReviewText>}
            </Review>
          ))
        )}
      </Section>

      {showModal && <MentorRequestModal mentor={mentor} onClose={() => setShowModal(false)} />}
    </Page>
  );
};
