import React, { useState, useRef, useEffect, useCallback, useMemo, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, Plus, Trash2, User, Briefcase, 
  Code, GraduationCap, Layout, Mail, Phone, 
  Github, Linkedin, ExternalLink, ChevronDown, ChevronUp, Printer, MapPin, CheckCircle, LayoutDashboard
} from 'lucide-react';
import { useAuthStore } from '@app/store/auth.store';

// --- TYPES ---
interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  link: string;
  tech: string;
}

interface ResumeData {
  fullName: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  about: string;
  github: string;
  linkedin: string;
  skills: string[];
  experience: Experience[];
  projects: Project[];
  isOpenToWork: boolean;
}

// --- STYLED COMPONENTS ---
const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f9fafb;

  @media (min-width: 1024px) {
    flex-direction: row;
  }
`;

const MobileViewSwitcher = styled.div`
  display: flex;
  gap: 8px;
  padding: 10px 12px;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 15;

  @media (min-width: 1024px) {
    display: none;
  }

  @media print {
    display: none !important;
  }
`;

const MobileViewButton = styled.button<{ $active: boolean }>`
  flex: 1;
  height: 38px;
  border-radius: 10px;
  border: 1px solid ${({ $active }) => ($active ? '#bfdbfe' : '#e5e7eb')};
  background: ${({ $active }) => ($active ? '#eff6ff' : '#fff')};
  color: ${({ $active }) => ($active ? '#1d4ed8' : '#4b5563')};
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
`;

const SidebarContainer = styled.div<{ $mobileHidden?: boolean }>`
  width: 100%;
  background: #fff;
  border-right: 1px solid #e5e7eb;
  height: 100vh;
  overflow-y: auto;
  padding: 24px;

  @media (max-width: 1023px) {
    height: auto;
    overflow: visible;
    padding: 14px;
    display: ${({ $mobileHidden }) => ($mobileHidden ? 'none' : 'block')};
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
  }

  @media (min-width: 1024px) {
    width: 33.333333%;
  }

  @media print {
    display: none !important;
  }
`;

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 12px;
  @media (max-width: 1023px) {
    margin-bottom: 18px;
  }
`;

const CabinetButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #e5e7eb;
    color: #1f2937;
  }
  @media (max-width: 640px) {
    width: 100%;
    justify-content: center;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  @media (max-width: 640px) {
    width: 100%;
  }
`;

const SidebarTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #1d1d1f;
  display: flex;
  align-items: center;
  gap: 8px;
  @media (max-width: 640px) {
    font-size: 20px;
  }
`;

const PrintButton = styled.button`
  padding: 8px;
  background: #dbeafe;
  color: #2563eb;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #bfdbfe;
  }
`;

const SectionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SectionCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
`;

const SectionHeader = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: #f9fafb;
  border: none;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #f3f4f6;
  }
  @media (max-width: 640px) {
    padding: 12px;
  }
`;

const SectionHeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #374151;
  font-size: 15px;
`;

const SectionContent = styled.div`
  padding: 16px;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 16px;
  @media (max-width: 640px) {
    padding: 12px;
  }
`;

const AnimatedSectionContent = styled(motion.div)`
  padding: 16px;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  resize: none;
  transition: all 0.2s;
  font-family: inherit;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const Grid2Cols = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const ExperienceItem = styled.div`
  position: relative;
  padding: 16px;
  border: 1px solid #f3f4f6;
  border-radius: 12px;
  background: rgba(249, 250, 251, 0.5);
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 6px;
  color: #f87171;
  background: transparent;
  border: none;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #dc2626;
    background: #fef2f2;
  }
`;

const AddButton = styled.button`
  width: 100%;
  padding: 12px;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  color: #6b7280;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 500;
  font-size: 14px;

  &:hover {
    border-color: #2563eb;
    color: #2563eb;
    background: #eff6ff;
  }
`;

const HintText = styled.div`
  margin-top: 8px;
  font-size: 12px;
  color: #9ca3af;
`;

const PreviewContainer = styled.div<{ $mobileHidden?: boolean }>`
  flex: 1;
  background: #f3f4f6;
  padding: 32px;
  height: 100vh;
  overflow-y: auto;
  display: flex;
  justify-content: center;

  @media (max-width: 1023px) {
    height: auto;
    min-height: calc(100vh - 70px);
    padding: 12px;
    display: ${({ $mobileHidden }) => ($mobileHidden ? 'none' : 'flex')};
  }

  @media print {
    display: flex !important;
    padding: 0;
    height: auto;
    overflow: visible;
    background: white;
  }
`;

const ResumePaper = styled.div`
  width: 210mm;
  min-height: 297mm;
  background: #fff;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  padding: 40px 56px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  color: #1d1d1f;

  @media (max-width: 1023px) {
    width: 100%;
    min-height: auto;
    padding: 22px 16px;
    gap: 20px;
  }

  @media print {
    box-shadow: none;
    padding: 40px 56px;
    width: 210mm;
    min-height: 297mm;
  }
`;

const ResumeHeader = styled.header`
  border-bottom: 2px solid #1d1d1f;
  padding-bottom: 32px;
  @media (max-width: 640px) {
    padding-bottom: 18px;
  }
`;

const ResumeName = styled.h1`
  font-size: 36px;
  font-weight: 800;
  color: #1d1d1f;
  margin-bottom: 8px;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  @media (max-width: 640px) {
    font-size: 26px;
  }
`;

const ResumeRole = styled.div`
  font-size: 20px;
  color: #2563eb;
  font-weight: 500;
  margin-bottom: 16px;
  @media (max-width: 640px) {
    font-size: 16px;
  }
`;

const ResumeContacts = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 14px 28px;
  font-size: 14px;
  color: #4b5563;
  @media (max-width: 640px) {
    gap: 8px 12px;
    font-size: 13px;
  }
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ResumeSection = styled.section``;

const SectionTitle = styled.h3`
  font-size: 12px;
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 12px;
`;

const AboutText = styled.p`
  font-size: 14px;
  line-height: 1.7;
  color: #374151;
`;

const ExperienceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const ExperienceItemPreview = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;
  gap: 16px;
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 6px;
  }
`;

const ExperiencePeriod = styled.div`
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
  padding-top: 2px;
`;

const ExperienceContent = styled.div``;

const ExperienceRole = styled.div`
  font-weight: 700;
  color: #1d1d1f;
  font-size: 18px;
  margin-bottom: 4px;
  @media (max-width: 640px) {
    font-size: 16px;
  }
`;

const ExperienceCompany = styled.div`
  color: #2563eb;
  font-weight: 500;
  font-size: 14px;
  margin-bottom: 8px;
`;

const ExperienceDescription = styled.div`
  font-size: 14px;
  color: #4b5563;
  line-height: 1.7;
  white-space: pre-line;
`;

const SkillsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const SkillTag = styled.span`
  padding: 6px 12px;
  background: #f3f4f6;
  color: #374151;
  font-size: 14px;
  font-weight: 500;
  border-radius: 6px;

  @media print {
    border: 1px solid #e5e7eb;
  }
`;

const ProjectsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ProjectItem = styled.div`
  border-left: 2px solid #e5e7eb;
  padding-left: 16px;
`;

const ProjectName = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  color: #1d1d1f;
  margin-bottom: 4px;
`;

const ProjectDescription = styled.p`
  font-size: 14px;
  color: #4b5563;
  margin-bottom: 4px;
  line-height: 1.6;
`;

const ProjectTech = styled.div`
  font-size: 12px;
  color: #2563eb;
  font-family: monospace;
`;

const OpenToWorkToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #eff6ff;
  border: 2px solid #bfdbfe;
  border-radius: 12px;
  margin-bottom: 16px;
  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
`;

const ToggleLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  flex: 1;
  font-weight: 600;
  color: #1e40af;
  font-size: 15px;
  @media (max-width: 640px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const ToggleSwitch = styled.input`
  width: 48px;
  height: 24px;
  appearance: none;
  background: #cbd5e1;
  border-radius: 12px;
  position: relative;
  cursor: pointer;
  transition: background 0.2s;

  &:checked {
    background: #2563eb;
  }

  &::before {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #fff;
    top: 2px;
    left: 2px;
    transition: transform 0.2s;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  &:checked::before {
    transform: translateX(24px);
  }
`;

const StatusBadge = styled.div<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  background: ${({ $active }) => $active ? '#dcfce7' : '#f3f4f6'};
  color: ${({ $active }) => $active ? '#16a34a' : '#6b7280'};
  margin-left: auto;
  @media (max-width: 640px) {
    margin-left: 0;
  }
`;

// --- INITIAL STATE ---
const INITIAL_DATA: ResumeData = {
  fullName: "Алихан Смаилов",
  role: "Senior Frontend Developer",
  email: "alikhan@example.com",
  phone: "+7 (777) 123-45-67",
  location: "Алматы, Казахстан",
  about: "Разработчик с 5+ годами опыта. Специализируюсь на React экосистеме. Люблю создавать быстрые и доступные интерфейсы. Активно участвую в Open Source и выступаю на митапах.",
  github: "github.com/alikhan",
  linkedin: "linkedin.com/in/alikhan",
  skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Node.js", "GraphQL", "Docker", "CI/CD"],
  experience: [
    {
      id: "1",
      company: "Kaspi.kz",
      role: "Middle Frontend Developer",
      period: "Янв 2022 — Наст. время",
      description: "• Разработал новый модуль платежей, увеличив конверсию на 15%.\n• Оптимизировал сборку проекта, сократив время билда с 15 до 4 минут.\n• Внедрил дизайн-систему на базе Storybook."
    },
    {
      id: "2",
      company: "Kolesa Group",
      role: "Junior Frontend Developer",
      period: "Июн 2020 — Дек 2021",
      description: "• Поддержка легаси кода на jQuery и миграция на React.\n• Верстка адаптивных лендингов для маркетинговых кампаний."
    }
  ],
  projects: [
    {
      id: "1",
      name: "E-commerce Dashboard",
      description: "Админ-панель для управления товарами и заказами с графиками аналитики.",
      link: "demo-shop.vercel.app",
      tech: "React, Recharts, Firebase"
    }
  ],
  isOpenToWork: false
};

// --- DEBOUNCE HOOK ---
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// --- COMPONENT ---
export const ResumeBuilder: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [data, setData] = useState<ResumeData>(INITIAL_DATA);
  const [activeSection, setActiveSection] = useState<string | null>('personal');
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor');
  
  // Локальные состояния для полей ввода (для мгновенного отображения)
  const [localData, setLocalData] = useState<ResumeData>(INITIAL_DATA);
  
  // Ref для хранения активного элемента с фокусом
  const activeElementRef = useRef<{ element: HTMLElement | null; selectionStart: number | null; selectionEnd: number | null }>({
    element: null,
    selectionStart: null,
    selectionEnd: null,
  });
  
  // Debounce для обновления основного состояния (5000ms задержка - изменения применяются через 5 секунд после окончания ввода)
  const debouncedLocalData = useDebounce(localData, 5000);
  
  // Синхронизируем debounced значение с основным состоянием
  useEffect(() => {
    setData(debouncedLocalData);
  }, [debouncedLocalData]);
  
  // Восстанавливаем фокус после обновления
  useLayoutEffect(() => {
    if (activeElementRef.current.element) {
      const { element, selectionStart, selectionEnd } = activeElementRef.current;
      // Используем requestAnimationFrame для гарантированного восстановления фокуса
      requestAnimationFrame(() => {
        if (element && document.activeElement !== element) {
          try {
            element.focus();
            if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
              if (selectionStart !== null && selectionEnd !== null) {
                // Используем setTimeout для установки позиции курсора после фокуса
                setTimeout(() => {
                  element.setSelectionRange(selectionStart, selectionEnd);
                }, 0);
              }
            }
          } catch (e) {
            // Игнорируем ошибки фокуса
          }
        }
      });
    }
  });
  
  // Мемоизируем функции обновления для предотвращения лишних перерендеров
  const updateField = useCallback((field: keyof ResumeData, value: any) => {
    // Сохраняем информацию о текущем фокусе
    const activeElement = document.activeElement as HTMLElement | null;
    if (activeElement && (activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement)) {
      activeElementRef.current = {
        element: activeElement,
        selectionStart: activeElement.selectionStart,
        selectionEnd: activeElement.selectionEnd,
      };
    }
    
    setLocalData(prev => {
      // Используем функциональное обновление для предотвращения проблем с фокусом
      const newData = { ...prev, [field]: value };
      return newData;
    });
  }, []);


  const updateFieldImmediate = useCallback((field: keyof ResumeData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
    setLocalData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handlePrint = () => {
    setData(localData);
    setMobileView('preview');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.print();
      });
    });
  };

  const addExperience = useCallback(() => {
    const newExp = { 
      id: Date.now().toString(), 
      company: '', 
      role: '', 
      period: '', 
      description: '' 
    };
    setData(prev => ({
      ...prev,
      experience: [...prev.experience, newExp]
    }));
    setLocalData(prev => ({
      ...prev,
      experience: [...prev.experience, newExp]
    }));
  }, []);

  const removeExperience = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
    setLocalData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  }, []);

  const updateExperience = useCallback((id: string, field: keyof Experience, value: string) => {
    setLocalData(prev => {
      // Создаем новый массив с обновленным элементом
      const updatedExperience = prev.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      );
      return { ...prev, experience: updatedExperience };
    });
  }, []);

  const addProject = useCallback(() => {
    const newProj = { 
      id: Date.now().toString(), 
      name: '', 
      description: '', 
      link: '', 
      tech: '' 
    };
    setData(prev => ({
      ...prev,
      projects: [...prev.projects, newProj]
    }));
    setLocalData(prev => ({
      ...prev,
      projects: [...prev.projects, newProj]
    }));
  }, []);

  const removeProject = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.filter(proj => proj.id !== id)
    }));
    setLocalData(prev => ({
      ...prev,
      projects: prev.projects.filter(proj => proj.id !== id)
    }));
  }, []);

  const updateProject = useCallback((id: string, field: keyof Project, value: string) => {
    // Сохраняем информацию о текущем фокусе
    const activeElement = document.activeElement as HTMLElement | null;
    if (activeElement && (activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement)) {
      activeElementRef.current = {
        element: activeElement,
        selectionStart: activeElement.selectionStart,
        selectionEnd: activeElement.selectionEnd,
      };
    }
    
    setLocalData(prev => {
      // Создаем новый массив с обновленным элементом
      const updatedProjects = prev.projects.map(proj => 
        proj.id === id ? { ...proj, [field]: value } : proj
      );
      return { ...prev, projects: updatedProjects };
    });
  }, []);

  // Sidebar Component - мемоизирован для предотвращения перерендеров
  const Sidebar = useMemo(() => (
    <SidebarContainer $mobileHidden={mobileView === 'preview'}>
      <SidebarHeader>
        <SidebarTitle>
          <Layout size={24} style={{ color: '#2563eb' }} />
          Редактор
        </SidebarTitle>
        <HeaderActions>
          <CabinetButton type="button" onClick={() => navigate('/dashboard')} title="Перейти в личный кабинет">
            <LayoutDashboard size={18} />
            Личный кабинет
          </CabinetButton>
          <PrintButton onClick={handlePrint} title="Скачать PDF">
            <Printer size={20} />
          </PrintButton>
        </HeaderActions>
      </SidebarHeader>

      <SectionsContainer>
        {/* OPEN TO WORK TOGGLE */}
        <OpenToWorkToggle>
          <ToggleLabel>
            <CheckCircle size={20} />
            <span>Ищу работу</span>
            <ToggleSwitch
              type="checkbox"
              checked={localData.isOpenToWork}
              onChange={(e) => updateFieldImmediate('isOpenToWork', e.target.checked)}
            />
          </ToggleLabel>
          <StatusBadge $active={localData.isOpenToWork}>
            {localData.isOpenToWork ? 'Активно' : 'Не активно'}
          </StatusBadge>
        </OpenToWorkToggle>

        {/* PERSONAL INFO */}
        <SectionCard>
          <SectionHeader 
            onClick={() => setActiveSection(activeSection === 'personal' ? null : 'personal')}
          >
            <SectionHeaderContent>
              <User size={18} />
              Личные данные
            </SectionHeaderContent>
            {activeSection === 'personal' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </SectionHeader>
          
          {activeSection === 'personal' && (
            <SectionContent>
                <Input 
                  placeholder="ФИО" 
                  value={localData.fullName}
                  onChange={e => updateField('fullName', e.target.value)}
                  onBlur={(e) => {
                    // Сохраняем фокус при потере, если нужно
                  }}
                />
                <Input 
                  placeholder="Желаемая должность" 
                  value={localData.role}
                  onChange={e => updateField('role', e.target.value)}
                />
                <Textarea 
                  placeholder="О себе (кратко)" 
                  value={localData.about}
                  onChange={e => updateField('about', e.target.value)}
                  style={{ height: '96px' }}
                />
                <Grid2Cols>
                  <Input 
                    placeholder="Email" 
                    value={localData.email}
                    onChange={e => updateField('email', e.target.value)}
                  />
                  <Input 
                    placeholder="Телефон" 
                    value={localData.phone}
                    onChange={e => updateField('phone', e.target.value)}
                  />
                </Grid2Cols>
                <Input 
                  placeholder="Локация (Алматы)" 
                  value={localData.location}
                  onChange={e => updateField('location', e.target.value)}
                />
                <Input 
                  placeholder="GitHub (github.com/username)" 
                  value={localData.github}
                  onChange={e => updateField('github', e.target.value)}
                />
                <Input 
                  placeholder="LinkedIn (linkedin.com/in/username)" 
                  value={localData.linkedin}
                  onChange={e => updateField('linkedin', e.target.value)}
                />
            </SectionContent>
          )}
        </SectionCard>

        {/* EXPERIENCE */}
        <SectionCard>
          <SectionHeader 
            onClick={() => setActiveSection(activeSection === 'experience' ? null : 'experience')}
          >
            <SectionHeaderContent>
              <Briefcase size={18} />
              Опыт работы
            </SectionHeaderContent>
            {activeSection === 'experience' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </SectionHeader>
          
          {activeSection === 'experience' && (
            <SectionContent>
                {localData.experience.map((exp) => (
                  <ExperienceItem key={exp.id}>
                    <DeleteButton onClick={() => removeExperience(exp.id)}>
                      <Trash2 size={14} />
                    </DeleteButton>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <Input 
                        placeholder="Компания" 
                        value={exp.company}
                        onChange={e => updateExperience(exp.id, 'company', e.target.value)}
                      />
                      <Input 
                        placeholder="Должность" 
                        value={exp.role}
                        onChange={e => updateExperience(exp.id, 'role', e.target.value)}
                      />
                      <Input 
                        placeholder="Период (2020 - 2021)" 
                        value={exp.period}
                        onChange={e => updateExperience(exp.id, 'period', e.target.value)}
                      />
                      <Textarea 
                        placeholder="Описание обязанностей и достижений..." 
                        value={exp.description}
                        onChange={e => updateExperience(exp.id, 'description', e.target.value)}
                        style={{ height: '96px' }}
                      />
                    </div>
                  </ExperienceItem>
                ))}
                <AddButton onClick={addExperience}>
                  <Plus size={16} />
                  Добавить место работы
                </AddButton>
            </SectionContent>
          )}
        </SectionCard>

        {/* SKILLS */}
        <SectionCard>
          <SectionHeader 
            onClick={() => setActiveSection(activeSection === 'skills' ? null : 'skills')}
          >
            <SectionHeaderContent>
              <Code size={18} />
              Навыки
            </SectionHeaderContent>
            {activeSection === 'skills' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </SectionHeader>
          
          {activeSection === 'skills' && (
            <SectionContent>
                <Textarea 
                  placeholder="Введите навыки через запятую (React, Redux, ...)" 
                  value={localData.skills.join(', ')}
                  onChange={e => updateField('skills', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                  style={{ height: '96px' }}
                />
                <HintText>
                  Совет: Указывайте только релевантные навыки для желаемой вакансии.
                </HintText>
            </SectionContent>
          )}
        </SectionCard>

        {/* PROJECTS */}
        <SectionCard>
          <SectionHeader 
            onClick={() => setActiveSection(activeSection === 'projects' ? null : 'projects')}
          >
            <SectionHeaderContent>
              <GraduationCap size={18} />
              Проекты
            </SectionHeaderContent>
            {activeSection === 'projects' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </SectionHeader>
          
          {activeSection === 'projects' && (
            <SectionContent>
                {localData.projects.map((proj) => (
                  <ExperienceItem key={proj.id}>
                    <DeleteButton onClick={() => removeProject(proj.id)}>
                      <Trash2 size={14} />
                    </DeleteButton>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <Input 
                        placeholder="Название проекта" 
                        value={proj.name}
                        onChange={e => updateProject(proj.id, 'name', e.target.value)}
                      />
                      <Textarea 
                        placeholder="Описание проекта" 
                        value={proj.description}
                        onChange={e => updateProject(proj.id, 'description', e.target.value)}
                        style={{ height: '64px' }}
                      />
                      <Input 
                        placeholder="Ссылка (demo.vercel.app)" 
                        value={proj.link}
                        onChange={e => updateProject(proj.id, 'link', e.target.value)}
                      />
                      <Input 
                        placeholder="Технологии (React, TypeScript)" 
                        value={proj.tech}
                        onChange={e => updateProject(proj.id, 'tech', e.target.value)}
                      />
                    </div>
                  </ExperienceItem>
                ))}
                <AddButton onClick={addProject}>
                  <Plus size={16} />
                  Добавить проект
                </AddButton>
            </SectionContent>
          )}
        </SectionCard>
      </SectionsContainer>
    </SidebarContainer>
  ), [localData, activeSection, updateField, updateFieldImmediate, addExperience, removeExperience, updateExperience, addProject, removeProject, updateProject, handlePrint, mobileView]);

  // Preview Component - мемоизирован для предотвращения перерендеров при изменении localData
  const Preview = useMemo(() => (
    <PreviewContainer id="resume-print-area" $mobileHidden={mobileView === 'editor'}>
      <ResumePaper>
        {/* HEADER */}
        <ResumeHeader>
          <ResumeName>{localData.fullName || 'Ваше Имя'}</ResumeName>
          <ResumeRole>{localData.role || 'Должность'}</ResumeRole>
          
          <ResumeContacts>
            {localData.email && (
              <ContactItem>
                <Mail size={14} />
                {localData.email}
              </ContactItem>
            )}
            {localData.phone && (
              <ContactItem>
                <Phone size={14} />
                {localData.phone}
              </ContactItem>
            )}
            {localData.location && (
              <ContactItem>
                <MapPin size={14} />
                {localData.location}
              </ContactItem>
            )}
            {localData.linkedin && (
              <ContactItem>
                <Linkedin size={14} />
                {localData.linkedin.replace(/^https?:\/\//, '')}
              </ContactItem>
            )}
            {localData.github && (
              <ContactItem>
                <Github size={14} />
                {localData.github.replace(/^https?:\/\//, '')}
              </ContactItem>
            )}
            {localData.isOpenToWork && (
              <ContactItem>
                <CheckCircle size={14} />
                <span style={{ fontWeight: 600, color: '#16a34a' }}>Ищу работу</span>
              </ContactItem>
            )}
          </ResumeContacts>
        </ResumeHeader>

        {/* ABOUT */}
        {localData.about && (
          <ResumeSection>
            <SectionTitle>О себе</SectionTitle>
            <AboutText>{localData.about}</AboutText>
          </ResumeSection>
        )}

        {/* EXPERIENCE */}
        {localData.experience.length > 0 && (
          <ResumeSection>
            <SectionTitle>Опыт работы</SectionTitle>
            <ExperienceList>
              {localData.experience.map(exp => (
                <ExperienceItemPreview key={exp.id}>
                  <ExperiencePeriod>{exp.period || 'Период'}</ExperiencePeriod>
                  <ExperienceContent>
                    <ExperienceRole>{exp.role || 'Должность'}</ExperienceRole>
                    <ExperienceCompany>{exp.company || 'Компания'}</ExperienceCompany>
                    <ExperienceDescription>{exp.description}</ExperienceDescription>
                  </ExperienceContent>
                </ExperienceItemPreview>
              ))}
            </ExperienceList>
          </ResumeSection>
        )}

        {/* SKILLS */}
        {localData.skills.length > 0 && (
          <ResumeSection>
            <SectionTitle>Навыки</SectionTitle>
            <SkillsList>
              {localData.skills.map((skill, i) => (
                <SkillTag key={i}>{skill}</SkillTag>
              ))}
            </SkillsList>
          </ResumeSection>
        )}

        {/* PROJECTS */}
        {localData.projects.length > 0 && (
          <ResumeSection>
            <SectionTitle>Проекты</SectionTitle>
            <ProjectsList>
              {localData.projects.map(proj => (
                <ProjectItem key={proj.id}>
                  <ProjectName>
                    {proj.name || 'Название проекта'}
                    {proj.link && <ExternalLink size={12} style={{ color: '#9ca3af' }} />}
                  </ProjectName>
                  {proj.description && (
                    <ProjectDescription>{proj.description}</ProjectDescription>
                  )}
                  {proj.tech && <ProjectTech>{proj.tech}</ProjectTech>}
                </ProjectItem>
              ))}
            </ProjectsList>
          </ResumeSection>
        )}
      </ResumePaper>
    </PreviewContainer>
  ), [localData, mobileView]);

  return (
    <>
      <style>{`
        @media print {
          @page { 
            margin: 0; 
            size: A4;
          }
          body { 
            background: white; 
          }
          body * {
            visibility: hidden;
          }
          #resume-print-area,
          #resume-print-area * {
            visibility: visible;
          }
          #resume-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          * {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>
      <Container>
        <MobileViewSwitcher>
          <MobileViewButton $active={mobileView === 'editor'} onClick={() => setMobileView('editor')}>
            Редактор
          </MobileViewButton>
          <MobileViewButton $active={mobileView === 'preview'} onClick={() => setMobileView('preview')}>
            Превью
          </MobileViewButton>
        </MobileViewSwitcher>
        {Sidebar}
        {Preview}
      </Container>
    </>
  );
};
