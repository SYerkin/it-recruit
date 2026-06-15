import React, { useState } from 'react';
import styled from 'styled-components';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, X, ChevronDown, ChevronRight, Check } from 'lucide-react';
import { recommendationApi, RecommendationCategory, RecommendationItem } from '@shared/api';

const Page = styled.div`padding: 40px;`;
const PageTitle = styled.h1`font-size: 28px; font-weight: 800; color: #1e1b4b; margin-bottom: 28px; display: flex; align-items: center; justify-content: space-between;`;
const AddBtn = styled.button`display: flex; align-items: center; gap: 8px; padding: 10px 20px; background: #7c3aed; color: #fff; border: none; border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer; &:hover { background: #6d28d9; }`;
const CatCard = styled.div`background: #fff; border-radius: 16px; margin-bottom: 20px; box-shadow: 0 2px 12px rgba(0,0,0,0.05); border: 1px solid #f3f4f6; overflow: hidden;`;
const CatHeader = styled.div`display: flex; align-items: center; justify-content: space-between; padding: 18px 24px; cursor: pointer; background: #fafafa; border-bottom: 1px solid #f3f4f6;`;
const CatTitle = styled.div`font-size: 17px; font-weight: 700; color: #1e1b4b; display: flex; align-items: center; gap: 8px;`;
const CatActions = styled.div`display: flex; gap: 8px; align-items: center;`;
const IconBtn = styled.button<{ $danger?: boolean }>`padding: 6px; border: none; background: ${({ $danger }) => ($danger ? '#fef2f2' : '#f3f4f6')}; color: ${({ $danger }) => ($danger ? '#dc2626' : '#6b7280')}; border-radius: 8px; cursor: pointer; display: flex; align-items: center; &:hover { opacity: 0.8; }`;
const ItemsTable = styled.table`width: 100%; border-collapse: collapse;`;
const Th = styled.th`text-align: left; padding: 10px 16px; font-size: 12px; color: #6b7280; font-weight: 600; text-transform: uppercase; background: #f9fafb; border-bottom: 1px solid #f3f4f6;`;
const Td = styled.td`padding: 12px 16px; font-size: 14px; border-bottom: 1px solid #f9fafb; vertical-align: middle;`;
const Badge = styled.span<{ $free: boolean }>`font-size: 12px; padding: 3px 8px; border-radius: 999px; background: ${({ $free }) => ($free ? '#dcfce7' : '#fee2e2')}; color: ${({ $free }) => ($free ? '#166534' : '#b91c1c')};`;
const AddItemRow = styled.div`padding: 12px 24px; background: #fafafa; display: flex; gap: 8px; align-items: center;`;

const Overlay = styled.div`position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 100; display: flex; align-items: center; justify-content: center;`;
const Modal = styled.div`background: #fff; border-radius: 20px; padding: 32px; width: 520px; max-width: 95vw; max-height: 90vh; overflow-y: auto;`;
const ModalTitle = styled.h2`font-size: 22px; font-weight: 800; color: #1e1b4b; margin-bottom: 24px;`;
const Field = styled.div`display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px;`;
const Label = styled.label`font-size: 14px; font-weight: 600; color: #374151;`;
const Input = styled.input`height: 44px; border: 1px solid #d1d5db; border-radius: 10px; padding: 0 12px; font-size: 14px; outline: none; &:focus { border-color: #7c3aed; }`;
const Textarea = styled.textarea`border: 1px solid #d1d5db; border-radius: 10px; padding: 10px 12px; font-size: 14px; outline: none; resize: vertical; min-height: 80px; &:focus { border-color: #7c3aed; }`;
const Select = styled.select`height: 44px; border: 1px solid #d1d5db; border-radius: 10px; padding: 0 12px; font-size: 14px; outline: none;`;
const ModalFooter = styled.div`display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px;`;
const PrimaryBtn = styled.button`padding: 10px 24px; background: #7c3aed; color: #fff; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; &:hover { background: #6d28d9; } &:disabled { opacity: 0.5; }`;
const SecondaryBtn = styled.button`padding: 10px 24px; background: #f3f4f6; color: #374151; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; &:hover { background: #e5e7eb; }`;

type CatForm = { title: string; icon: string; sortOrder: string };
type ItemForm = { title: string; description: string; url: string; tags: string; isFree: boolean; sortOrder: string };

const defaultCatForm: CatForm = { title: '', icon: '', sortOrder: '0' };
const defaultItemForm: ItemForm = { title: '', description: '', url: '', tags: '', isFree: true, sortOrder: '0' };

export const AdminRecommendations: React.FC = () => {
  const queryClient = useQueryClient();
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [catModal, setCatModal] = useState<{ open: boolean; editing?: RecommendationCategory }>({ open: false });
  const [itemModal, setItemModal] = useState<{ open: boolean; categoryId?: number; editing?: RecommendationItem }>({ open: false });
  const [catForm, setCatForm] = useState<CatForm>(defaultCatForm);
  const [itemForm, setItemForm] = useState<ItemForm>(defaultItemForm);

  const { data, isLoading } = useQuery({ queryKey: ['recommendations'], queryFn: recommendationApi.getAll });
  const categories = data?.data || [];

  const createCat = useMutation({
    mutationFn: () => recommendationApi.createCategory({ title: catForm.title, icon: catForm.icon || undefined, sortOrder: Number(catForm.sortOrder) }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['recommendations'] }); setCatModal({ open: false }); },
  });

  const updateCat = useMutation({
    mutationFn: (id: number) => recommendationApi.updateCategory(id, { title: catForm.title, icon: catForm.icon || undefined, sortOrder: Number(catForm.sortOrder) }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['recommendations'] }); setCatModal({ open: false }); },
  });

  const createItem = useMutation({
    mutationFn: () => recommendationApi.createItem({
      categoryId: itemModal.categoryId!,
      title: itemForm.title,
      description: itemForm.description || undefined,
      url: itemForm.url || undefined,
      tags: itemForm.tags ? itemForm.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      isFree: itemForm.isFree,
      sortOrder: Number(itemForm.sortOrder),
    }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['recommendations'] }); setItemModal({ open: false }); },
  });

  const updateItem = useMutation({
    mutationFn: (id: number) => recommendationApi.updateItem(id, {
      title: itemForm.title,
      description: itemForm.description || undefined,
      url: itemForm.url || undefined,
      tags: itemForm.tags ? itemForm.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      isFree: itemForm.isFree,
      sortOrder: Number(itemForm.sortOrder),
    }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['recommendations'] }); setItemModal({ open: false }); },
  });

  const deleteItem = useMutation({
    mutationFn: (id: number) => recommendationApi.deleteItem(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['recommendations'] }),
  });

  const toggleExpand = (id: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const openAddCat = () => { setCatForm(defaultCatForm); setCatModal({ open: true }); };
  const openEditCat = (cat: RecommendationCategory) => { setCatForm({ title: cat.title, icon: cat.icon || '', sortOrder: String(cat.sortOrder) }); setCatModal({ open: true, editing: cat }); };
  const openAddItem = (catId: number) => { setItemForm(defaultItemForm); setItemModal({ open: true, categoryId: catId }); };
  const openEditItem = (item: RecommendationItem) => {
    setItemForm({ title: item.title, description: item.description || '', url: item.url || '', tags: (item.tags || []).join(', '), isFree: item.isFree, sortOrder: String(item.sortOrder) });
    setItemModal({ open: true, categoryId: item.categoryId, editing: item });
  };

  const saveCat = () => { if (catModal.editing) updateCat.mutate(catModal.editing.id); else createCat.mutate(); };
  const saveItem = () => { if (itemModal.editing) updateItem.mutate(itemModal.editing.id); else createItem.mutate(); };

  if (isLoading) return <Page>Загрузка...</Page>;

  return (
    <Page>
      <PageTitle>
        Рекомендации
        <AddBtn onClick={openAddCat}><Plus size={16} /> Добавить категорию</AddBtn>
      </PageTitle>

      {categories.length === 0 && (
        <div style={{ color: '#6b7280', textAlign: 'center', padding: '48px' }}>Нет категорий. Добавьте первую!</div>
      )}

      {categories.map((cat) => (
        <CatCard key={cat.id}>
          <CatHeader onClick={() => toggleExpand(cat.id)}>
            <CatTitle>
              {expanded.has(cat.id) ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              {cat.icon && <span>{cat.icon}</span>}
              {cat.title}
              <span style={{ fontSize: 13, fontWeight: 400, color: '#9ca3af' }}>({cat.items?.length || 0} ресурсов)</span>
            </CatTitle>
            <CatActions onClick={(e) => e.stopPropagation()}>
              <IconBtn onClick={() => openEditCat(cat)}><Edit2 size={15} /></IconBtn>
            </CatActions>
          </CatHeader>

          {expanded.has(cat.id) && (
            <>
              <ItemsTable>
                <thead>
                  <tr>
                    <Th>Название</Th>
                    <Th>URL</Th>
                    <Th>Теги</Th>
                    <Th>Тип</Th>
                    <Th></Th>
                  </tr>
                </thead>
                <tbody>
                  {(cat.items || []).map((item) => (
                    <tr key={item.id}>
                      <Td><strong>{item.title}</strong>{item.description && <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{item.description}</div>}</Td>
                      <Td>{item.url ? <a href={item.url} target="_blank" rel="noreferrer" style={{ color: '#7c3aed', fontSize: 13 }}>Открыть</a> : '—'}</Td>
                      <Td style={{ fontSize: 12 }}>{(item.tags || []).join(', ') || '—'}</Td>
                      <Td><Badge $free={item.isFree}>{item.isFree ? 'Бесплатно' : 'Платно'}</Badge></Td>
                      <Td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <IconBtn onClick={() => openEditItem(item)}><Edit2 size={14} /></IconBtn>
                          <IconBtn $danger onClick={() => { if (confirm('Удалить ресурс?')) deleteItem.mutate(item.id); }}><Trash2 size={14} /></IconBtn>
                        </div>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </ItemsTable>
              <AddItemRow>
                <AddBtn onClick={() => openAddItem(cat.id)} style={{ padding: '7px 14px', fontSize: 13 }}>
                  <Plus size={14} /> Добавить ресурс
                </AddBtn>
              </AddItemRow>
            </>
          )}
        </CatCard>
      ))}

      {/* Category modal */}
      {catModal.open && (
        <Overlay onClick={() => setCatModal({ open: false })}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalTitle>{catModal.editing ? 'Редактировать категорию' : 'Новая категория'}</ModalTitle>
            <Field>
              <Label>Название *</Label>
              <Input value={catForm.title} onChange={(e) => setCatForm((p) => ({ ...p, title: e.target.value }))} placeholder="Курсы по React, Карьерные советы..." />
            </Field>
            <Field>
              <Label>Иконка (эмодзи)</Label>
              <Input value={catForm.icon} onChange={(e) => setCatForm((p) => ({ ...p, icon: e.target.value }))} placeholder="📚" />
            </Field>
            <Field>
              <Label>Порядок сортировки</Label>
              <Input type="number" value={catForm.sortOrder} onChange={(e) => setCatForm((p) => ({ ...p, sortOrder: e.target.value }))} />
            </Field>
            <ModalFooter>
              <SecondaryBtn onClick={() => setCatModal({ open: false })}>Отмена</SecondaryBtn>
              <PrimaryBtn onClick={saveCat} disabled={!catForm.title || createCat.isPending || updateCat.isPending}>
                {createCat.isPending || updateCat.isPending ? 'Сохранение...' : 'Сохранить'}
              </PrimaryBtn>
            </ModalFooter>
          </Modal>
        </Overlay>
      )}

      {/* Item modal */}
      {itemModal.open && (
        <Overlay onClick={() => setItemModal({ open: false })}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalTitle>{itemModal.editing ? 'Редактировать ресурс' : 'Новый ресурс'}</ModalTitle>
            <Field>
              <Label>Название *</Label>
              <Input value={itemForm.title} onChange={(e) => setItemForm((p) => ({ ...p, title: e.target.value }))} placeholder="React — официальная документация" />
            </Field>
            <Field>
              <Label>Описание</Label>
              <Textarea value={itemForm.description} onChange={(e) => setItemForm((p) => ({ ...p, description: e.target.value }))} placeholder="Краткое описание ресурса" />
            </Field>
            <Field>
              <Label>URL</Label>
              <Input value={itemForm.url} onChange={(e) => setItemForm((p) => ({ ...p, url: e.target.value }))} placeholder="https://react.dev" />
            </Field>
            <Field>
              <Label>Теги (через запятую)</Label>
              <Input value={itemForm.tags} onChange={(e) => setItemForm((p) => ({ ...p, tags: e.target.value }))} placeholder="React, Beginner, Free" />
            </Field>
            <Field>
              <Label>Тип</Label>
              <Select value={itemForm.isFree ? 'free' : 'paid'} onChange={(e) => setItemForm((p) => ({ ...p, isFree: e.target.value === 'free' }))}>
                <option value="free">Бесплатно</option>
                <option value="paid">Платно</option>
              </Select>
            </Field>
            <Field>
              <Label>Порядок сортировки</Label>
              <Input type="number" value={itemForm.sortOrder} onChange={(e) => setItemForm((p) => ({ ...p, sortOrder: e.target.value }))} />
            </Field>
            <ModalFooter>
              <SecondaryBtn onClick={() => setItemModal({ open: false })}>Отмена</SecondaryBtn>
              <PrimaryBtn onClick={saveItem} disabled={!itemForm.title || createItem.isPending || updateItem.isPending}>
                {createItem.isPending || updateItem.isPending ? 'Сохранение...' : 'Сохранить'}
              </PrimaryBtn>
            </ModalFooter>
          </Modal>
        </Overlay>
      )}
    </Page>
  );
};
