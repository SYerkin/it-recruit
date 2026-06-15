import React, { useState } from 'react';
import styled from 'styled-components';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, X, Star, Check } from 'lucide-react';
import { mentorApi, Mentor } from '@shared/api';

const Page = styled.div`
  padding: 40px;
`;

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 800;
  color: #1e1b4b;
  margin-bottom: 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const AddBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #7c3aed;
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  &:hover { background: #6d28d9; }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  border: 1px solid #f3f4f6;
`;

const CardHeader = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const Avatar = styled.div<{ $url?: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${p => p.$url ? `url(${p.$url}) center/cover` : 'linear-gradient(135deg, #667eea, #764ba2)'};
  color: white;
  font-size: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const MentorName = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #1d1d1f;
  margin-bottom: 2px;
`;

const MentorTitle = styled.p`
  font-size: 13px;
  color: #6b7280;
`;

const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
  font-size: 13px;
  color: #374151;
`;

const SkillsWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin: 12px 0;
`;

const SkillTag = styled.span`
  padding: 3px 8px;
  background: #f5f3ff;
  color: #7c3aed;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
`;

const CardFooter = styled.div`
  display: flex;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid #f3f4f6;
`;

const IconBtn = styled.button<{ $variant?: 'danger' }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid ${p => p.$variant === 'danger' ? '#fecaca' : '#e5e7eb'};
  background: ${p => p.$variant === 'danger' ? '#fff5f5' : '#fff'};
  color: ${p => p.$variant === 'danger' ? '#ef4444' : '#374151'};
  font-size: 12px;
  cursor: pointer;
  &:hover { background: ${p => p.$variant === 'danger' ? '#fee2e2' : '#f5f3ff'}; }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

const Modal = styled.div`
  background: #fff;
  border-radius: 20px;
  padding: 32px;
  width: 540px;
  max-width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #1d1d1f;
  margin-bottom: 24px;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border: none;
  background: #f3f4f6;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
`;

const Input = styled.input`
  width: 100%;
  padding: 11px 14px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  &:focus { outline: none; border-color: #7c3aed; }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 11px 14px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  &:focus { outline: none; border-color: #7c3aed; }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const SaveBtn = styled.button`
  width: 100%;
  padding: 13px;
  margin-top: 8px;
  background: #7c3aed;
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  &:hover { background: #6d28d9; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const Toast = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: #1d1d1f;
  color: #fff;
  padding: 14px 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  z-index: 9999;
`;

const EMPTY_FORM = {
  name: '', title: '', company: '', bio: '', skills: '',
  experienceYears: 0, pricePerSession: 0, sessionDuration: 60, avatarUrl: '',
};

export const AdminMentors: React.FC = () => {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Mentor | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<typeof EMPTY_FORM>(EMPTY_FORM);
  const [toast, setToast] = useState('');

  const { data } = useQuery({
    queryKey: ['mentors-admin'],
    queryFn: () => mentorApi.getAll(),
  });
  const mentors = data?.data || [];

  const createMutation = useMutation({
    mutationFn: (d: any) => mentorApi.create({ ...d, skills: d.skills.split(',').map((s: string) => s.trim()).filter(Boolean) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['mentors-admin'] }); setCreating(false); setForm(EMPTY_FORM); showToast('Ментор добавлен'); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, d }: { id: number; d: any }) =>
      mentorApi.update(id, { ...d, skills: d.skills.split(',').map((s: string) => s.trim()).filter(Boolean) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['mentors-admin'] }); setEditing(null); showToast('Ментор обновлён'); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => mentorApi.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['mentors-admin'] }); showToast('Ментор деактивирован'); },
  });

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const openEdit = (m: Mentor) => {
    setEditing(m);
    setForm({
      name: m.name, title: m.title, company: m.company || '', bio: m.bio,
      skills: Array.isArray(m.skills) ? m.skills.join(', ') : '',
      experienceYears: m.experienceYears, pricePerSession: m.pricePerSession,
      sessionDuration: m.sessionDuration, avatarUrl: m.avatarUrl || '',
    });
  };

  const handleSave = () => {
    if (editing) updateMutation.mutate({ id: editing.id, d: form });
    else createMutation.mutate(form);
  };

  const formModal = (
    <Overlay onClick={() => { setEditing(null); setCreating(false); }}>
      <Modal onClick={e => e.stopPropagation()}>
        <CloseBtn onClick={() => { setEditing(null); setCreating(false); }}><X size={16} /></CloseBtn>
        <ModalTitle>{editing ? 'Редактировать ментора' : 'Добавить ментора'}</ModalTitle>
        <FormGroup><Label>Имя *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></FormGroup>
        <FormGroup><Label>Должность *</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Senior Frontend Dev at Kaspi" /></FormGroup>
        <FormGroup><Label>Компания</Label><Input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} /></FormGroup>
        <FormGroup><Label>URL аватара</Label><Input value={form.avatarUrl} onChange={e => setForm({ ...form, avatarUrl: e.target.value })} placeholder="https://..." /></FormGroup>
        <FormGroup><Label>О менторе *</Label><Textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} /></FormGroup>
        <FormGroup><Label>Навыки (через запятую)</Label><Input value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} placeholder="React, TypeScript, Node.js" /></FormGroup>
        <Row>
          <FormGroup><Label>Лет опыта</Label><Input type="number" min={0} value={form.experienceYears} onChange={e => setForm({ ...form, experienceYears: +e.target.value })} /></FormGroup>
          <FormGroup><Label>Цена (₸, 0=бесплатно)</Label><Input type="number" min={0} value={form.pricePerSession} onChange={e => setForm({ ...form, pricePerSession: +e.target.value })} /></FormGroup>
        </Row>
        <FormGroup><Label>Длительность сессии (мин)</Label><Input type="number" min={30} value={form.sessionDuration} onChange={e => setForm({ ...form, sessionDuration: +e.target.value })} /></FormGroup>
        <SaveBtn disabled={!form.name || !form.title || !form.bio} onClick={handleSave}>
          {createMutation.isPending || updateMutation.isPending ? 'Сохраняем...' : 'Сохранить'}
        </SaveBtn>
      </Modal>
    </Overlay>
  );

  return (
    <Page>
      <PageTitle>
        Менторы ({mentors.length})
        <AddBtn onClick={() => { setForm(EMPTY_FORM); setCreating(true); }}>
          <Plus size={18} /> Добавить ментора
        </AddBtn>
      </PageTitle>

      <Grid>
        {mentors.map(m => (
          <Card key={m.id}>
            <CardHeader>
              <Avatar $url={m.avatarUrl || undefined}>{!m.avatarUrl && m.name.charAt(0)}</Avatar>
              <div>
                <MentorName>{m.name}</MentorName>
                <MentorTitle>{m.title}</MentorTitle>
                <RatingRow><Star size={13} fill="#f59e0b" color="#f59e0b" />{m.rating.toFixed(1)} ({m.reviewsCount})</RatingRow>
              </div>
            </CardHeader>
            <SkillsWrap>
              {(Array.isArray(m.skills) ? m.skills : []).slice(0, 5).map(s => <SkillTag key={s}>{s}</SkillTag>)}
            </SkillsWrap>
            <p style={{ fontSize: 13, color: '#6b7280' }}>
              {m.pricePerSession === 0 ? 'Бесплатно' : `${m.pricePerSession.toLocaleString('ru')} ₸`} · {m.sessionDuration} мин
            </p>
            <CardFooter>
              <IconBtn onClick={() => openEdit(m)}><Edit2 size={14} />Редактировать</IconBtn>
              <IconBtn $variant="danger" onClick={() => deleteMutation.mutate(m.id)}><Trash2 size={14} />Удалить</IconBtn>
            </CardFooter>
          </Card>
        ))}
      </Grid>

      {(creating || editing) && formModal}
      {toast && <Toast><Check size={16} color="#10b981" /> {toast}</Toast>}
    </Page>
  );
};
