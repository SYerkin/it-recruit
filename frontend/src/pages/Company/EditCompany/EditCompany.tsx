import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import styled from 'styled-components';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { companyApi } from '@shared/api';
import { ArrowLeft, ArrowRight, Building2, FileText, MapPin, ShieldCheck, Upload, Users } from 'lucide-react';
import { getApiOrigin } from '@shared/api/config';
import { Button } from '@shared/ui/Button';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  @media (max-width: 768px) {
    padding: 0 4px;
  }
`;
const Form = styled.form`display: flex; flex-direction: column; gap: 20px;`;
const Section = styled.div`display: flex; flex-direction: column; gap: 12px;`;
const Input = styled.input`
  height: 46px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  padding: 0 12px;
  @media (max-width: 480px) {
    height: 44px;
    font-size: 15px;
  }
`;
const TextArea = styled.textarea`
  min-height: 90px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  padding: 10px 12px;
  resize: vertical;
  @media (max-width: 480px) {
    min-height: 84px;
    font-size: 15px;
  }
`;
const Label = styled.label`font-size: 14px; font-weight: 600; color: #111827;`;
const Card = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 16px;
  background: #fff;
  @media (max-width: 480px) {
    padding: 12px;
    border-radius: 12px;
  }
`;
const ErrorBox = styled.div`padding: 10px; border: 1px solid #fecaca; background: #fef2f2; color: #b91c1c; border-radius: 10px;`;
const Small = styled.div`font-size: 13px; color: #4b5563;`;
const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;
const BackButton = styled.button`
  display:flex;
  gap:8px;
  align-items:center;
  background:none;
  border:none;
  color:#6b7280;
  cursor:pointer;
  margin-bottom:16px;
`;
const LogoPreview = styled.img`width: 80px; height: 80px; object-fit: cover; border-radius: 12px; border: 1px solid #e5e7eb;`;

const schema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  description: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  address2gis: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  industry: z.string().optional().nullable(),
  foundedYear: z.coerce.number().optional().nullable(),
  employeeCount: z.string().optional().nullable(),
  logoUrl: z.string().optional().nullable(),
  linkedin: z.string().optional().nullable(),
  hh: z.string().optional().nullable(),
  telegram: z.string().optional().nullable(),
  instagram: z.string().optional().nullable(),
});
type FormData = z.infer<typeof schema>;

export const EditCompany: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [docs, setDocs] = useState<string[]>([]);
  const [verificationComment, setVerificationComment] = useState('');

  const { data: companyData, isLoading } = useQuery({
    queryKey: ['company', 'my'],
    queryFn: async () => {
      try {
        return await companyApi.getMyCompany();
      } catch (e: any) {
        if (e.message === 'COMPANY_NOT_FOUND' || e.response?.status === 404) return null;
        throw e;
      }
    },
    retry: false,
  });
  const company = companyData?.data;

  const { data: verificationData, refetch: refetchVerification } = useQuery({
    queryKey: ['company', 'verification-status', company?.id],
    queryFn: () => companyApi.getVerificationStatus(company!.id),
    enabled: !!company?.id,
  });

  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  React.useEffect(() => {
    if (!company) return;
    reset({
      name: company.name,
      description: company.description || '',
      address: company.address || '',
      address2gis: company.address2gis || '',
      website: company.website || '',
      industry: company.industry || '',
      foundedYear: company.foundedYear || undefined,
      employeeCount: company.employeeCount || '',
      logoUrl: company.logoUrl || '',
      linkedin: company.socialLinks?.linkedin || '',
      hh: company.socialLinks?.hh || '',
      telegram: company.socialLinks?.telegram || '',
      instagram: company.socialLinks?.instagram || '',
    });
    setDocs(company.documents || []);
  }, [company, reset]);

  const updateMutation = useMutation({
    mutationFn: companyApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company'] });
      navigate('/dashboard');
    },
    onError: (e: any) => setError(e?.response?.data?.error || 'Ошибка сохранения'),
  });

  const verificationMutation = useMutation({
    mutationFn: () => companyApi.createVerificationRequest({ documents: docs.map((url) => ({ url })), comment: verificationComment || undefined }),
    onSuccess: async () => {
      await refetchVerification();
      setVerificationComment('');
    },
    onError: (e: any) => setError(e?.response?.data?.error || 'Не удалось отправить заявку'),
  });

  const onSubmit = (data: FormData) => {
    setError(null);
    updateMutation.mutate({
      name: data.name,
      description: data.description || null,
      address: data.address || null,
      address2gis: data.address2gis || null,
      website: data.website || null,
      industry: data.industry || null,
      foundedYear: data.foundedYear || null,
      employeeCount: data.employeeCount || null,
      logoUrl: data.logoUrl || null,
      socialLinks: {
        linkedin: data.linkedin || '',
        hh: data.hh || '',
        telegram: data.telegram || '',
        instagram: data.instagram || '',
      },
      documents: docs,
    });
  };

  const handleLogo = async (file: File) => {
    try {
      const uploaded = await companyApi.uploadLogo(file);
      setValue('logoUrl', uploaded.data.url);
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Не удалось загрузить логотип');
    }
  };

  const handleDoc = async (file: File) => {
    try {
      const uploaded = await companyApi.uploadDocument(file);
      setDocs((prev) => [...prev, uploaded.data.url]);
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Не удалось загрузить документ');
    }
  };

  if (isLoading) return <Container>Загрузка...</Container>;
  if (!company) {
    return (
      <Container>
        <BackButton onClick={() => navigate('/dashboard')}><ArrowLeft size={16} />Назад</BackButton>
        <h2>Компания не найдена</h2>
        <Button variant="primary" onClick={() => navigate('/company/create')}>Создать компанию</Button>
      </Container>
    );
  }

  const logoUrl = watch('logoUrl');
  const apiOrigin = getApiOrigin();

  return (
    <Container>
      <BackButton onClick={() => navigate('/dashboard')}><ArrowLeft size={16} />Назад</BackButton>
      <h1>Редактирование компании</h1>
      {error && <ErrorBox>{error}</ErrorBox>}

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <Section>
            <Label><Building2 size={16} /> Название</Label>
            <Input {...register('name')} />
            {errors.name && <Small>{errors.name.message}</Small>}
          </Section>
          <Section>
            <Label><FileText size={16} /> Описание</Label>
            <TextArea {...register('description')} />
          </Section>
          <Row>
            <Section>
              <Label><MapPin size={16} /> Адрес</Label>
              <Input {...register('address')} />
            </Section>
            <Section>
              <Label>Ссылка 2GIS</Label>
              <Input {...register('address2gis')} />
            </Section>
          </Row>
          <Row>
            <Section>
              <Label>Сайт</Label>
              <Input {...register('website')} />
            </Section>
            <Section>
              <Label>Отрасль</Label>
              <Input {...register('industry')} placeholder="IT, Fintech, E-commerce..." />
            </Section>
          </Row>
          <Row>
            <Section>
              <Label>Год основания</Label>
              <Input type="number" {...register('foundedYear')} />
            </Section>
            <Section>
              <Label><Users size={16} /> Кол-во сотрудников</Label>
              <Input {...register('employeeCount')} />
            </Section>
          </Row>
        </Card>

        <Card>
          <Section>
            <Label>Логотип</Label>
            {logoUrl && <LogoPreview src={`${apiOrigin}${logoUrl}`} alt="logo" />}
            <Input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleLogo(e.target.files[0])} />
          </Section>
          <Section>
            <Label>Соцсети</Label>
            <Row>
              <Input placeholder="LinkedIn" {...register('linkedin')} />
              <Input placeholder="hh.ru" {...register('hh')} />
            </Row>
            <Row>
              <Input placeholder="Telegram" {...register('telegram')} />
              <Input placeholder="Instagram" {...register('instagram')} />
            </Row>
          </Section>
        </Card>

        <Card>
          <Section>
            <Label><ShieldCheck size={16} /> Верификация компании</Label>
            <Small>Статус: {verificationData?.data?.isVerified ? 'Одобрено' : verificationData?.data?.request?.status || 'Не отправляли'}</Small>
            {verificationData?.data?.request?.adminComment && (
              <Small>Комментарий админа: {verificationData.data.request.adminComment}</Small>
            )}
            <Input type="file" accept=".pdf,image/*" onChange={(e) => e.target.files?.[0] && handleDoc(e.target.files[0])} />
            <Small>Документы: {docs.length}</Small>
            <TextArea
              placeholder="Комментарий к заявке (необязательно)"
              value={verificationComment}
              onChange={(e) => setVerificationComment(e.target.value)}
            />
            <Button
              variant="secondary"
              type="button"
              onClick={() => verificationMutation.mutate()}
              disabled={verificationMutation.isPending || docs.length === 0 || verificationData?.data?.request?.status === 'PENDING'}
            >
              <Upload size={16} /> Отправить на верификацию
            </Button>
          </Section>
        </Card>

        <Button variant="primary" type="submit" disabled={updateMutation.isPending}>
          {updateMutation.isPending ? 'Сохранение...' : 'Сохранить изменения'} <ArrowRight size={16} />
        </Button>
      </Form>
    </Container>
  );
};
