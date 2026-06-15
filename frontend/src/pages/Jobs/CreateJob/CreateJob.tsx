import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import styled, { keyframes } from 'styled-components';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { jobApi, companyApi, skillApi } from '@shared/api';
import { Briefcase, DollarSign, FileText, ArrowRight, ArrowLeft, Code, Gift, X, Sparkles, Layout, Zap, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Animations ---
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
  background-color: #F8F9FB;
  min-height: 100vh;
`;

const HeaderSection = styled.div`
  margin-bottom: 40px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const BackLink = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #636e72;
  font-size: 14px;
  font-weight: 500;
  background: none;
  border: none;
  cursor: pointer;
  margin-bottom: 16px;
  transition: all 0.2s;
  width: fit-content;

  &:hover {
    color: #007AFF;
    transform: translateX(-4px);
  }
`;

const Title = styled.h1`
  font-size: 40px;
  font-weight: 800;
  color: #1d1d1f;
  letter-spacing: -0.04em;
`;

const Subtitle = styled.p`
  font-size: 18px;
  color: #86868b;
  line-height: 1.5;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Card = styled.div`
  background: #ffffff;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.02);
  animation: ${fadeIn} 0.5s ease-out;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #1d1d1f;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;

  svg {
    color: #007AFF;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #4b4b4b;
  margin-left: 4px;
`;

const Input = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  height: 52px;
  padding: 0 20px;
  border-radius: 14px;
  background: #f5f5f7;
  border: 2px solid ${({ $hasError }) => ($hasError ? '#ff3b30' : 'transparent')};
  font-size: 16px;
  transition: all 0.2s;

  &:focus {
    outline: none;
    background: #ffffff;
    border-color: #007AFF;
    box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.1);
  }

  &::placeholder {
    color: #b2bec3;
  }
`;

const Textarea = styled.textarea<{ $hasError?: boolean }>`
  width: 100%;
  min-height: 140px;
  padding: 16px 20px;
  border-radius: 14px;
  background: #f5f5f7;
  border: 2px solid ${({ $hasError }) => ($hasError ? '#ff3b30' : 'transparent')};
  font-size: 16px;
  line-height: 1.6;
  resize: vertical;
  transition: all 0.2s;

  &:focus {
    outline: none;
    background: #ffffff;
    border-color: #007AFF;
  }
`;

// --- Custom Toggle Group (Chip styles) ---
const ToggleGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const ToggleItem = styled.label<{ $active: boolean }>`
  padding: 10px 18px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background: ${({ $active }) => ($active ? '#007AFF' : '#f5f5f7')};
  color: ${({ $active }) => ($active ? '#ffffff' : '#636e72')};
  border: 1px solid ${({ $active }) => ($active ? '#007AFF' : 'transparent')};

  &:hover {
    background: ${({ $active }) => ($active ? '#0062cc' : '#e8e8ed')};
  }

  input {
    display: none;
  }
`;

const ErrorMessage = styled.span`
  font-size: 13px;
  color: #FF3B30;
  font-weight: 500;
`;

const ErrorBox = styled.div`
  padding: var(--spacing-md);
  background: rgba(255, 59, 48, 0.1);
  border: 1px solid rgba(255, 59, 48, 0.3);
  border-radius: 12px;
  color: #FF3B30;
  font-size: 15px;
  text-align: center;
  margin-bottom: var(--spacing-lg);
`;

const SubmitSection = styled.div`
  margin-top: 24px;
  padding: 32px;
  background: #1d1d1f;
  border-radius: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
`;

const ActionButton = styled.button`
  height: 56px;
  padding: 0 32px;
  background: #007AFF;
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 17px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: #0062cc;
    transform: scale(1.02);
  }

  &:disabled {
    background: #4b4b4b;
    cursor: not-allowed;
  }
`;

const createJobSchema = z.object({
  title: z.string().min(1, 'Название вакансии обязательно'),
  description: z.string().min(1, 'Описание обязательно'),
  responsibilities: z.string().min(1, 'Обязанности обязательны'),
  benefits: z.string().optional(),
  salaryMin: z.number().int().positive().optional().nullable().or(z.literal('')),
  salaryMax: z.number().int().positive().optional().nullable().or(z.literal('')),
  currency: z.string().default('USD'),
  status: z.enum(['DRAFT', 'ACTIVE', 'CLOSED']).default('DRAFT'),
  requiredSkillIds: z.array(z.number()).min(1, 'Необходимо выбрать минимум один навык'),
  workSchedule: z.enum(['FULL_TIME', 'PART_TIME']).optional().nullable(),
  workMode: z.enum(['OFFICE', 'REMOTE', 'HYBRID']).optional().nullable(),
  workType: z.enum(['PERMANENT', 'PROJECT']).optional().nullable(),
  experienceLevel: z.enum(['INTERN', 'JUNIOR', 'MIDDLE', 'SENIOR']).optional().nullable(),
});

type CreateJobFormData = z.infer<typeof createJobSchema>;

const SkillsSelect = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
`;

const SkillsInput = styled(Input)`
  margin-bottom: var(--spacing-sm);
`;

const SelectedSkills = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
`;

const SkillBadge = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background: #007AFF;
  color: white;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 4px 10px rgba(0, 122, 255, 0.2);

  svg {
    cursor: pointer;
    opacity: 0.8;
    &:hover { opacity: 1; }
  }
`;

const SkillsDropdown = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background: var(--color-bg-primary);
  border: 2px solid var(--color-system-gray-4);
  border-radius: 12px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
`;

const SkillOption = styled.div`
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: var(--color-bg-secondary);
  }
`;


export const CreateJob: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<number[]>([]);
  const [skillsSearch, setSkillsSearch] = useState('');
  const [skillsDropdownOpen, setSkillsDropdownOpen] = useState(false);
  const [isCreatingSkill, setIsCreatingSkill] = useState(false);

  // Проверяем наличие компании
  const { data: companyData } = useQuery({
    queryKey: ['company', 'my'],
    queryFn: async () => {
      try {
        return await companyApi.getMyCompany();
      } catch (error: any) {
        if (error.message === 'COMPANY_NOT_FOUND' || error.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },
    retry: false,
  });

  const company = companyData?.data;

  // Загружаем список навыков
  const { data: skillsData } = useQuery({
    queryKey: ['skills', skillsSearch],
    queryFn: () => skillApi.getAllSkills({ search: skillsSearch }),
  });

  const skills = skillsData?.data || [];
  const filteredSkills = skills.filter(
    (skill) => !selectedSkills.includes(skill.id)
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateJobFormData>({
    resolver: zodResolver(createJobSchema),
    defaultValues: {
      currency: 'USD',
      status: 'DRAFT',
      requiredSkillIds: [],
    },
  });

  const addSkill = (skillId: number) => {
    const newSkills = [...selectedSkills, skillId];
    setSelectedSkills(newSkills);
    setValue('requiredSkillIds', newSkills);
    setSkillsSearch('');
    setSkillsDropdownOpen(false);
  };

  const removeSkill = (skillId: number) => {
    const newSkills = selectedSkills.filter((id) => id !== skillId);
    setSelectedSkills(newSkills);
    setValue('requiredSkillIds', newSkills);
  };

  const createNewSkill = async () => {
    if (!skillsSearch.trim()) return;
    
    setIsCreatingSkill(true);
    try {
      const response = await skillApi.createSkill({ name: skillsSearch.trim() });
      if (response.success && response.data) {
        addSkill(response.data.id);
        setSkillsSearch('');
        // Обновляем список навыков
        queryClient.invalidateQueries({ queryKey: ['skills'] });
      }
    } catch (error: any) {
      alert(error.response?.data?.error || 'Не удалось создать навык');
    } finally {
      setIsCreatingSkill(false);
    }
  };

  // Закрываем dropdown при клике вне его
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-skills-dropdown]')) {
        setSkillsDropdownOpen(false);
      }
    };

    if (skillsDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [skillsDropdownOpen]);

  const createMutation = useMutation({
    mutationFn: async (data: CreateJobFormData) => {
      return await jobApi.createJob({
        ...data,
        salaryMin: data.salaryMin || undefined,
        salaryMax: data.salaryMax || undefined,
        requiredSkillIds: selectedSkills.length > 0 ? selectedSkills : undefined,
        workSchedule: data.workSchedule || undefined,
        workMode: data.workMode || undefined,
        workType: data.workType || undefined,
        experienceLevel: data.experienceLevel || undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['company'] });
      navigate('/dashboard');
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || err.message || 'Ошибка создания вакансии');
    },
  });

  const onSubmit = async (data: CreateJobFormData) => {
    setError(null);
    
    if (!company) {
      setError('Сначала создайте компанию');
      navigate('/company/create');
      return;
    }

    createMutation.mutate(data);
  };

  if (!company) {
    return (
      <Container>
        <BackLink onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={16} /> Назад к панели управления
        </BackLink>
        <HeaderSection>
          <Title>Создать вакансию</Title>
          <Subtitle>Для создания вакансии необходимо сначала создать компанию</Subtitle>
        </HeaderSection>
        <ActionButton onClick={() => navigate('/company/create')}>
          Создать компанию
          <ArrowRight size={20} />
        </ActionButton>
      </Container>
    );
  }

  const watchAll = watch(); // Следим за всеми полями для стилизации ToggleItem

  return (
    <Container>
      <BackLink onClick={() => navigate('/dashboard')}>
        <ArrowLeft size={16} /> Назад к панели управления
      </BackLink>

      <HeaderSection>
        <Title>Новая вакансия</Title>
        <Subtitle>Заполните детали, чтобы привлечь лучших талантов для вашей команды</Subtitle>
      </HeaderSection>

      {error && <ErrorBox>{error}</ErrorBox>}

      <Form onSubmit={handleSubmit(onSubmit)}>
        {/* Карточка 1: Основное */}
        <Card>
          <SectionTitle><Layout size={20} /> Информация о позиции</SectionTitle>
          <InputGroup>
            <Label>Название вакансии</Label>
            <Input 
              $hasError={!!errors.title}
              placeholder="Напр. Senior Frontend Engineer" 
              {...register('title')} 
            />
            {errors.title && <ErrorMessage>{errors.title.message}</ErrorMessage>}
          </InputGroup>

          <InputGroup>
            <Label>Описание вакансии</Label>
            <Textarea 
              $hasError={!!errors.description}
              placeholder="Расскажите о миссии роли и ожиданиях..." 
              {...register('description')} 
            />
            {errors.description && <ErrorMessage>{errors.description.message}</ErrorMessage>}
          </InputGroup>

          <InputGroup>
            <Label>Обязанности</Label>
            <Textarea 
              $hasError={!!errors.responsibilities}
              placeholder="Список задач, которые предстоит решать..." 
              {...register('responsibilities')} 
            />
            {errors.responsibilities && <ErrorMessage>{errors.responsibilities.message}</ErrorMessage>}
          </InputGroup>

        </Card>

        {/* Карточка 2: Стек */}
        <Card>
          <SectionTitle><Code size={20} /> Технологический стек</SectionTitle>
          <div style={{ position: 'relative' }} data-skills-dropdown>
            <Input 
              placeholder="Поиск навыков (React, Node.js, Python...)" 
              value={skillsSearch}
              onChange={(e) => {
                setSkillsSearch(e.target.value);
                setSkillsDropdownOpen(true);
              }}
              onFocus={() => setSkillsDropdownOpen(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && skillsSearch.trim() && filteredSkills.length === 0) {
                  e.preventDefault();
                  createNewSkill();
                }
              }}
            />
            <SkillsDropdown $isOpen={skillsDropdownOpen && (filteredSkills.length > 0 || skillsSearch.trim().length > 0)}>
              {filteredSkills.slice(0, 10).map((skill) => (
                <SkillOption
                  key={skill.id}
                  onClick={() => addSkill(skill.id)}
                >
                  {skill.name}
                </SkillOption>
              ))}
              {filteredSkills.length === 0 && skillsSearch.trim().length > 0 && (
                <SkillOption
                  onClick={createNewSkill}
                  style={{ 
                    background: '#007AFF', 
                    color: 'white',
                    fontWeight: 600
                  }}
                >
                  + Создать "{skillsSearch.trim()}"
                </SkillOption>
              )}
            </SkillsDropdown>
          </div>
          <AnimatePresence>
            {selectedSkills.length > 0 && (
              <SelectedSkills>
                {selectedSkills.map((skillId) => {
                  const skill = skills.find((s) => s.id === skillId);
                  return skill ? (
                    <SkillBadge 
                      key={skillId}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                    >
                      {skill.name}
                      <X size={14} onClick={() => removeSkill(skillId)} />
                    </SkillBadge>
                  ) : null;
                })}
              </SelectedSkills>
            )}
          </AnimatePresence>
          {errors.requiredSkillIds && (
            <ErrorMessage>{errors.requiredSkillIds.message}</ErrorMessage>
          )}
        </Card>

        {/* Карточка 3: Условия */}
        <Card>
          <SectionTitle><Zap size={20} /> Условия и формат</SectionTitle>
          <div style={{ display: 'grid', gap: '24px' }}>
            <InputGroup>
              <Label>Режим работы</Label>
              <ToggleGroup>
                {[
                  { val: 'OFFICE', lab: 'Офис' },
                  { val: 'REMOTE', lab: 'Удаленно' },
                  { val: 'HYBRID', lab: 'Гибрид' }
                ].map(item => (
                  <ToggleItem key={item.val} $active={watchAll.workMode === item.val}>
                    <input type="radio" value={item.val} {...register('workMode')} />
                    {item.lab}
                  </ToggleItem>
                ))}
              </ToggleGroup>
            </InputGroup>

            <InputGroup>
              <Label>Уровень позиции</Label>
              <ToggleGroup>
                {[
                  { val: 'JUNIOR', lab: 'Junior' },
                  { val: 'MIDDLE', lab: 'Middle' },
                  { val: 'SENIOR', lab: 'Senior' },
                  { val: 'INTERN', lab: 'Intern' }
                ].map(item => (
                  <ToggleItem key={item.val} $active={watchAll.experienceLevel === item.val}>
                    <input type="radio" value={item.val} {...register('experienceLevel')} />
                    {item.lab}
                  </ToggleItem>
                ))}
              </ToggleGroup>
            </InputGroup>

            <InputGroup>
              <Label>График работы</Label>
              <ToggleGroup>
                {[
                  { val: 'FULL_TIME', lab: 'Полный день' },
                  { val: 'PART_TIME', lab: 'Неполный день' }
                ].map(item => (
                  <ToggleItem key={item.val} $active={watchAll.workSchedule === item.val}>
                    <input type="radio" value={item.val} {...register('workSchedule')} />
                    {item.lab}
                  </ToggleItem>
                ))}
              </ToggleGroup>
            </InputGroup>

            <InputGroup>
              <Label>Тип работы</Label>
              <ToggleGroup>
                {[
                  { val: 'PERMANENT', lab: 'Постоянная' },
                  { val: 'PROJECT', lab: 'Проектная' }
                ].map(item => (
                  <ToggleItem key={item.val} $active={watchAll.workType === item.val}>
                    <input type="radio" value={item.val} {...register('workType')} />
                    {item.lab}
                  </ToggleItem>
                ))}
              </ToggleGroup>
            </InputGroup>
          </div>
        </Card>

        {/* Карточка 4: Деньги */}
        <Card>
          <SectionTitle><DollarSign size={20} /> Компенсация</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px', gap: '16px' }}>
            <Input 
              type="number" 
              placeholder="От" 
              $hasError={!!errors.salaryMin}
              {...register('salaryMin', { valueAsNumber: true })} 
            />
            <Input 
              type="number" 
              placeholder="До" 
              $hasError={!!errors.salaryMax}
              {...register('salaryMax', { valueAsNumber: true })} 
            />
            <select 
              style={{ 
                borderRadius: '14px', 
                border: '2px solid transparent', 
                background: '#f5f5f7', 
                padding: '0 10px',
                fontSize: '16px',
                height: '52px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              {...register('currency')}
              onFocus={(e) => {
                e.target.style.background = '#ffffff';
                e.target.style.borderColor = '#007AFF';
              }}
              onBlur={(e) => {
                e.target.style.background = '#f5f5f7';
                e.target.style.borderColor = 'transparent';
              }}
            >
              <option value="USD">USD ($)</option>
              <option value="KZT">KZT (₸)</option>
            </select>
          </div>
          {errors.salaryMin && <ErrorMessage>{errors.salaryMin.message}</ErrorMessage>}
          {errors.salaryMax && <ErrorMessage>{errors.salaryMax.message}</ErrorMessage>}
        </Card>

        {/* Финальный блок */}
        <SubmitSection>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Info size={20} />
            <p style={{ opacity: 0.8, fontSize: '14px', margin: 0, color: 'white'}}>
              Вакансия будет сохранена как черновик и станет видна кандидатам после активации.
            </p>
          </div>
          <ActionButton type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? 'Публикация...' : 'Опубликовать вакансию'}
            <ArrowRight size={20} />
          </ActionButton>
        </SubmitSection>
      </Form>
    </Container>
  );
};

