import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import styled from 'styled-components';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { companyApi } from '@shared/api';
import { Building2, Users, FileText, ArrowRight, Upload, MapPin, Calendar, Image, ExternalLink } from 'lucide-react';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: var(--spacing-4xl) var(--spacing-lg);
  @media (max-width: 768px) {
    padding: var(--spacing-2xl) var(--spacing-md);
  }
`;

const Header = styled.div`
  margin-bottom: var(--spacing-4xl);
  @media (max-width: 768px) {
    margin-bottom: var(--spacing-2xl);
  }
`;

const Title = styled.h1`
  font-size: 48px;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin-bottom: var(--spacing-md);
  color: var(--color-text-primary);
  @media (max-width: 768px) {
    font-size: 34px;
  }
  @media (max-width: 480px) {
    font-size: 28px;
  }
`;

const Subtitle = styled.p`
  font-size: 20px;
  color: var(--color-text-secondary);
  line-height: 1.6;
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2xl);
  @media (max-width: 768px) {
    gap: var(--spacing-xl);
  }
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: var(--spacing-md);
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
`;

const Label = styled.label`
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
`;

const StyledInput = styled.input<{ hasError?: boolean }>`
  width: 100%;
  height: 56px;
  padding: 0 16px;
  font-size: 16px;
  font-family: inherit;
  background: var(--color-bg-secondary);
  border: 2px solid ${({ hasError }) => (hasError ? '#FF3B30' : 'var(--color-system-gray-4)')};
  border-radius: 16px;
  color: var(--color-text-primary);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:focus {
    outline: none;
    border-color: var(--color-system-blue);
    box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.1);
  }
  @media (max-width: 480px) {
    height: 50px;
    font-size: 15px;
  }
`;

const StyledTextarea = styled.textarea<{ hasError?: boolean }>`
  width: 100%;
  min-height: 120px;
  padding: 16px;
  font-size: 16px;
  font-family: inherit;
  background: var(--color-bg-secondary);
  border: 2px solid ${({ hasError }) => (hasError ? '#FF3B30' : 'var(--color-system-gray-4)')};
  border-radius: 16px;
  color: var(--color-text-primary);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  resize: vertical;

  &:focus {
    outline: none;
    border-color: var(--color-system-blue);
    box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.1);
  }
  @media (max-width: 480px) {
    min-height: 100px;
    font-size: 15px;
  }
`;

const Select = styled.select<{ hasError?: boolean }>`
  width: 100%;
  height: 56px;
  padding: 0 16px;
  font-size: 16px;
  font-family: inherit;
  background: var(--color-bg-secondary);
  border: 2px solid ${({ hasError }) => (hasError ? '#FF3B30' : 'var(--color-system-gray-4)')};
  border-radius: 16px;
  color: var(--color-text-primary);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: var(--color-system-blue);
    box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.1);
  }
  @media (max-width: 480px) {
    height: 50px;
    font-size: 15px;
  }
`;

const ErrorMessage = styled.span`
  font-size: 13px;
  color: #FF3B30;
  font-weight: 500;
`;

const FileUploadArea = styled.div`
  border: 2px dashed var(--color-system-gray-4);
  border-radius: 16px;
  padding: var(--spacing-2xl);
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: var(--color-bg-secondary);

  &:hover {
    border-color: var(--color-system-blue);
    background: rgba(0, 122, 255, 0.05);
  }
  @media (max-width: 480px) {
    padding: var(--spacing-lg);
  }
`;

const FileInput = styled.input`
  display: none;
`;

const FileList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-bg-primary);
  border-radius: 8px;
  font-size: 14px;
  gap: 10px;
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const RemoveFileButton = styled.button`
  color: #FF3B30;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  
  &:hover {
    opacity: 0.7;
  }
`;

const SubmitButton = styled.button<{ disabled?: boolean }>`
  width: 100%;
  height: 56px;
  background: linear-gradient(135deg, #007AFF 0%, #5856D6 100%);
  box-shadow: 0 4px 16px rgba(0, 122, 255, 0.3);
  border-radius: 16px;
  border: none;
  color: #FFFFFF;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-xl);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 122, 255, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  @media (max-width: 480px) {
    height: 52px;
    font-size: 16px;
  }
`;

const ErrorBox = styled.div`
  padding: var(--spacing-md);
  background: rgba(255, 59, 48, 0.1);
  border: 1px solid rgba(255, 59, 48, 0.3);
  border-radius: 12px;
  color: #FF3B30;
  font-size: 15px;
  text-align: center;
`;

const createCompanySchema = z.object({
  name: z.string().min(1, 'Название компании обязательно'),
  description: z.string().optional(),
  address: z.string().optional(),
  address2gis: z.string().url('Введите корректную ссылку на 2GIS').optional().or(z.literal('')),
  foundedYear: z.string().optional(),
  employeeCount: z.string().optional(),
});

type CreateCompanyFormData = z.infer<typeof createCompanySchema>;

export const CreateCompany: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [documents, setDocuments] = useState<string[]>([]);
  const [officePhotos, setOfficePhotos] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCompanyFormData>({
    resolver: zodResolver(createCompanySchema),
  });

  const createMutation = useMutation({
    mutationFn: companyApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company'] });
      navigate('/');
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || 'Ошибка создания компании');
    },
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // В реальном приложении здесь будет загрузка файлов на сервер
      // Пока просто сохраняем имена файлов
      const fileNames = Array.from(files).map((file) => file.name);
      setDocuments([...documents, ...fileNames]);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // В реальном приложении здесь будет загрузка фото на сервер
      // Пока просто сохраняем имена файлов
      const fileNames = Array.from(files).map((file) => file.name);
      setOfficePhotos([...officePhotos, ...fileNames]);
    }
  };

  const removeDocument = (index: number) => {
    setDocuments(documents.filter((_, i) => i !== index));
  };

  const removePhoto = (index: number) => {
    setOfficePhotos(officePhotos.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: CreateCompanyFormData) => {
    setError(null);
    createMutation.mutate({
      ...data,
      address2gis: data.address2gis || undefined,
      foundedYear: data.foundedYear ? parseInt(data.foundedYear) : undefined,
      documents: documents.length > 0 ? documents : undefined,
      officePhotos: officePhotos.length > 0 ? officePhotos : undefined,
    });
  };

  return (
    <Container>
      <Header>
        <Title>Создать компанию</Title>
        <Subtitle>
          Заполните информацию о вашей компании. Это поможет кандидатам лучше понять вашу организацию.
        </Subtitle>
      </Header>

      {error && <ErrorBox>{error}</ErrorBox>}

      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormSection>
          <SectionTitle>
            <Building2 size={24} />
            Основная информация
          </SectionTitle>

          <InputWrapper>
            <Label>
              <Building2 size={18} />
              Название компании *
            </Label>
            <StyledInput
              placeholder="Например: Tech Solutions Inc."
              hasError={!!errors.name}
              {...register('name')}
            />
            {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
          </InputWrapper>

          <InputWrapper>
            <Label>
              <FileText size={18} />
              Описание компании
            </Label>
            <StyledTextarea
              placeholder="Расскажите о вашей компании, её миссии, ценностях и культуре..."
              hasError={!!errors.description}
              {...register('description')}
            />
            {errors.description && (
              <ErrorMessage>{errors.description.message}</ErrorMessage>
            )}
          </InputWrapper>

          <InputWrapper>
            <Label>
              <MapPin size={18} />
              Адрес
            </Label>
            <StyledInput
              placeholder="Например: Алматы, ул. Абая, 150"
              hasError={!!errors.address}
              {...register('address')}
            />
            {errors.address && <ErrorMessage>{errors.address.message}</ErrorMessage>}
          </InputWrapper>

          <InputWrapper>
            <Label>
              <ExternalLink size={18} />
              Ссылка на адрес в 2GIS
            </Label>
            <StyledInput
              placeholder="https://2gis.kz/almaty/firm/..."
              hasError={!!errors.address2gis}
              {...register('address2gis')}
            />
            {errors.address2gis && <ErrorMessage>{errors.address2gis.message}</ErrorMessage>}
          </InputWrapper>

          <InputWrapper>
            <Label>
              <Calendar size={18} />
              Год основания
            </Label>
            <StyledInput
              type="number"
              placeholder="Например: 2010"
              min="1800"
              max={new Date().getFullYear()}
              hasError={!!errors.foundedYear}
              {...register('foundedYear')}
            />
            {errors.foundedYear && <ErrorMessage>{errors.foundedYear.message}</ErrorMessage>}
          </InputWrapper>

          <InputWrapper>
            <Label>
              <Users size={18} />
              Штат сотрудников
            </Label>
            <Select {...register('employeeCount')}>
              <option value="">Выберите размер компании</option>
              <option value="1-10">1-10 сотрудников</option>
              <option value="11-50">11-50 сотрудников</option>
              <option value="51-200">51-200 сотрудников</option>
              <option value="201-500">201-500 сотрудников</option>
              <option value="500+">500+ сотрудников</option>
            </Select>
          </InputWrapper>
        </FormSection>

        <FormSection>
          <SectionTitle>
            <Image size={24} />
            Фото офиса
          </SectionTitle>

          <FileUploadArea onClick={() => document.getElementById('photo-input')?.click()}>
            <Image size={32} color="var(--color-text-tertiary)" />
            <p style={{ marginTop: 'var(--spacing-md)', color: 'var(--color-text-secondary)' }}>
              Нажмите для загрузки фото офиса
            </p>
            <p style={{ fontSize: '14px', color: 'var(--color-text-tertiary)', marginTop: 'var(--spacing-xs)' }}>
              Поддерживаются JPG, PNG, WEBP
            </p>
          </FileUploadArea>

          <FileInput
            id="photo-input"
            type="file"
            multiple
            accept="image/*"
            onChange={handlePhotoUpload}
          />

          {officePhotos.length > 0 && (
            <FileList>
              {officePhotos.map((photo, index) => (
                <FileItem key={index}>
                  <span>{photo}</span>
                  <RemoveFileButton type="button" onClick={() => removePhoto(index)}>
                    Удалить
                  </RemoveFileButton>
                </FileItem>
              ))}
            </FileList>
          )}
        </FormSection>

        <FormSection>
          <SectionTitle>
            <Upload size={24} />
            Документы (опционально)
          </SectionTitle>

          <FileUploadArea onClick={() => document.getElementById('file-input')?.click()}>
            <Upload size={32} color="var(--color-text-tertiary)" />
            <p style={{ marginTop: 'var(--spacing-md)', color: 'var(--color-text-secondary)' }}>
              Нажмите для загрузки документов
            </p>
            <p style={{ fontSize: '14px', color: 'var(--color-text-tertiary)', marginTop: 'var(--spacing-xs)' }}>
              Поддерживаются PDF, DOC, DOCX
            </p>
          </FileUploadArea>

          <FileInput
            id="file-input"
            type="file"
            multiple
            accept=".pdf,.doc,.docx"
            onChange={handleFileUpload}
          />

          {documents.length > 0 && (
            <FileList>
              {documents.map((doc, index) => (
                <FileItem key={index}>
                  <span>{doc}</span>
                  <RemoveFileButton type="button" onClick={() => removeDocument(index)}>
                    Удалить
                  </RemoveFileButton>
                </FileItem>
              ))}
            </FileList>
          )}
        </FormSection>

        <SubmitButton type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? 'Создание...' : 'Создать компанию'}
          {!createMutation.isPending && <ArrowRight size={20} />}
        </SubmitButton>
      </Form>
    </Container>
  );
};

