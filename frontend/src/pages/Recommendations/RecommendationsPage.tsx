import React from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { ArrowUpRight, Compass, Flame, LibraryBig, Sparkles, Orbit, Wand2 } from 'lucide-react';
import { recommendationApi } from '@shared/api';
import { useTranslation } from 'react-i18next';

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.35; }
  50% { transform: scale(1.08); opacity: 0.6; }
  100% { transform: scale(1); opacity: 0.35; }
`;

const gradientMove = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const Page = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  min-height: 100vh;
  position: relative;
  background:
    radial-gradient(circle at 18% 0%, rgba(99, 102, 241, 0.16), transparent 28%),
    radial-gradient(circle at 100% 75%, rgba(14, 165, 233, 0.12), transparent 34%),
    linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%);
`;

const Hero = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 34px;
  padding: 44px 30px;
  margin-bottom: 20px;
  color: #fff;
  background: linear-gradient(125deg, #020617 0%, #1e1b4b 34%, #115e59 70%, #0ea5e9 100%);
  background-size: 230% 230%;
  animation: ${gradientMove} 14s ease infinite;
  box-shadow: 0 30px 66px rgba(2, 6, 23, 0.4);
`;

const HeroGlow = styled.div`
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 999px;
  filter: blur(82px);
  pointer-events: none;
  animation: ${pulse} 7.5s ease-in-out infinite;
`;

const HeroGlowA = styled(HeroGlow)`
  top: -80px;
  right: -40px;
  background: #a78bfa;
`;

const HeroGlowB = styled(HeroGlow)`
  bottom: -140px;
  left: -90px;
  background: #22d3ee;
  animation-delay: 1.8s;
`;

const HeroLabel = styled.div`
  position: relative;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid rgba(255, 255, 255, 0.26);
  background: rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  padding: 5px 11px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 12px;
`;

const HeroTitle = styled.h1`
  position: relative;
  z-index: 2;
  font-size: clamp(34px, 6vw, 70px);
  line-height: 0.95;
  letter-spacing: -0.04em;
  font-weight: 900;
  margin-bottom: 12px;
  color: #fff;
`;

const HeroSubtitle = styled.p`
  position: relative;
  z-index: 2;
  max-width: 800px;
  color: rgba(255, 255, 255, 0.86);
  line-height: 1.7;
  font-size: 16px;
  margin-bottom: 14px;
`;

const HeroBadges = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const HeroBadge = styled.div`
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.24);
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  padding: 6px 11px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

const Controls = styled.div`
  border-radius: 18px;
  border: 1px solid #cbd5e1;
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(10px);
  padding: 14px;
  margin-bottom: 12px;
`;

const Tabs = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const Tab = styled.button<{ $active: boolean }>`
  height: 38px;
  border-radius: 999px;
  border: 1px solid ${({ $active }) => ($active ? '#6366f1' : '#cbd5e1')};
  background: ${({ $active }) => ($active ? '#e0e7ff' : '#fff')};
  color: ${({ $active }) => ($active ? '#312e81' : '#475569')};
  padding: 0 12px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.02em;
  cursor: pointer;
`;

const CategoryRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
`;

const CategoryTitle = styled.h2`
  font-size: 22px;
  font-weight: 900;
  color: #0f172a;
  letter-spacing: -0.02em;
`;

const CategoryMeta = styled.div`
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  grid-auto-flow: dense;
  gap: 14px;
`;

const Card = styled.a`
  position: relative;
  overflow: hidden;
  display: block;
  border-radius: 20px;
  border: 1px solid #cbd5e1;
  text-decoration: none;
  color: inherit;
  min-height: 196px;
  padding: 16px;
  background: linear-gradient(160deg, #ffffff 0%, #f8fafc 62%, #e0f2fe 100%);
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.1);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  &:hover {
    transform: translateY(-4px) rotate(-0.3deg);
    box-shadow: 0 20px 42px rgba(15, 23, 42, 0.16);
  }
  &:nth-child(5n + 1) {
    grid-column: span 2;
    @media (max-width: 960px) {
      grid-column: span 1;
    }
  }
  &:nth-child(7n + 2) {
    transform: rotate(-0.8deg);
  }
  &:nth-child(7n + 4) {
    transform: rotate(0.7deg);
  }
`;

const CardGlow = styled.div`
  position: absolute;
  width: 150px;
  height: 150px;
  border-radius: 999px;
  right: -50px;
  top: -70px;
  opacity: 0.36;
  background: radial-gradient(circle at 30% 30%, #818cf8, rgba(56, 189, 248, 0.08));
`;

const CardTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 8px;
`;

const CardTitle = styled.h3`
  font-size: 16px;
  font-weight: 900;
  color: #0f172a;
`;

const Badge = styled.span<{ $free: boolean }>`
  border-radius: 999px;
  border: 1px solid ${({ $free }) => ($free ? '#86efac' : '#fecaca')};
  background: ${({ $free }) => ($free ? '#dcfce7' : '#fee2e2')};
  color: ${({ $free }) => ($free ? '#166534' : '#b91c1c')};
  padding: 5px 9px;
  white-space: nowrap;
  font-size: 11px;
  font-weight: 800;
`;

const Description = styled.p`
  color: #334155;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 10px;
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const Tag = styled.span`
  border-radius: 999px;
  border: 1px solid #cbd5e1;
  background: rgba(255, 255, 255, 0.86);
  color: #334155;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 9px;
`;

const CardFooter = styled.div`
  margin-top: 12px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #4f46e5;
  font-size: 12px;
  font-weight: 900;
`;

const Cta = styled.div`
  margin-top: 20px;
  border-radius: 24px;
  border: 1px solid #c7d2fe;
  background: linear-gradient(135deg, #eef2ff 0%, #ecfeff 100%);
  padding: 22px;
  box-shadow: 0 10px 26px rgba(15, 23, 42, 0.09);
  display: flex;
  justify-content: space-between;
  gap: 14px;
  align-items: center;
  @media (max-width: 680px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const CtaText = styled.div`
  h3 {
    font-size: 22px;
    font-weight: 900;
    color: #0f172a;
    margin-bottom: 4px;
  }
  p {
    color: #475569;
    font-size: 14px;
    line-height: 1.6;
    max-width: 760px;
  }
`;

const CtaLink = styled(Link)`
  height: 43px;
  border-radius: 12px;
  text-decoration: none;
  background: linear-gradient(135deg, #4f46e5, #0ea5e9);
  color: #fff;
  font-size: 13px;
  font-weight: 900;
  padding: 0 16px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

const Empty = styled.div`
  border-radius: 16px;
  border: 1px dashed #94a3b8;
  background: rgba(255, 255, 255, 0.84);
  padding: 42px 16px;
  text-align: center;
  color: #64748b;
`;

export const RecommendationsPage: React.FC = () => {
  const { t } = useTranslation();
  const [activeId, setActiveId] = React.useState<number | null>(null);
  const { data, isLoading, error } = useQuery({
    queryKey: ['recommendations'],
    queryFn: recommendationApi.getAll,
  });

  const categories = data?.data || [];
  React.useEffect(() => {
    if (!activeId && categories.length) {
      setActiveId(categories[0].id);
    }
  }, [activeId, categories]);

  if (isLoading) return <Page><Empty>{t('recommendations.loading')}</Empty></Page>;
  if (error) return <Page><Empty>{t('recommendations.error')}</Empty></Page>;
  if (!categories.length) return <Page><Empty>{t('recommendations.empty')}</Empty></Page>;

  const activeCategory = categories.find((category) => category.id === activeId) || categories[0];

  return (
    <Page>
      <Hero>
        <HeroGlowA />
        <HeroGlowB />
        <HeroLabel>
          <Wand2 size={12} />
          Creative Learning Hub
        </HeroLabel>
        <HeroTitle>{t('recommendations.heroTitle')}</HeroTitle>
        <HeroSubtitle>{t('recommendations.heroSubtitle')}</HeroSubtitle>
        <HeroBadges>
          <HeroBadge><Compass size={13} />{t('recommendations.badgePersonal')}</HeroBadge>
          <HeroBadge><Flame size={13} />{t('recommendations.badgeHot')}</HeroBadge>
          <HeroBadge><LibraryBig size={13} />{t('recommendations.badgeCurated')}</HeroBadge>
          <HeroBadge><Orbit size={13} />{t('recommendations.badgeSkillmap')}</HeroBadge>
        </HeroBadges>
      </Hero>

      <Controls>
        <Tabs>
          {categories.map((category) => (
            <Tab key={category.id} $active={category.id === activeCategory.id} onClick={() => setActiveId(category.id)}>
              {category.icon ? `${category.icon} ` : ''}
              {category.title}
            </Tab>
          ))}
        </Tabs>
      </Controls>

      <CategoryRow>
        <CategoryTitle>
          <Sparkles size={17} style={{ verticalAlign: 'text-bottom', marginRight: 6, color: '#4f46e5' }} />
          {activeCategory.title}
        </CategoryTitle>
        <CategoryMeta>{t('recommendations.materialsCount', { count: activeCategory.items.length })}</CategoryMeta>
      </CategoryRow>

      <Grid>
        {activeCategory.items.map((item) => (
          <Card key={item.id} href={item.url || '#'} target="_blank" rel="noreferrer">
            <CardGlow />
            <CardTop>
              <CardTitle>{item.title}</CardTitle>
              <Badge $free={item.isFree}>{item.isFree ? t('recommendations.free') : t('recommendations.paid')}</Badge>
            </CardTop>
            {item.description && <Description>{item.description}</Description>}
            {item.tags && item.tags.length > 0 && (
              <Tags>{item.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}</Tags>
            )}
            <CardFooter>{t('recommendations.openLink')} <ArrowUpRight size={13} /></CardFooter>
          </Card>
        ))}
      </Grid>

      <Cta>
        <CtaText>
          <h3>{t('recommendations.ctaTitle')}</h3>
          <p>{t('recommendations.ctaText')}</p>
        </CtaText>
        <CtaLink to="/mentors">
          {t('recommendations.ctaLink')} <ArrowUpRight size={14} />
        </CtaLink>
      </Cta>
    </Page>
  );
};
