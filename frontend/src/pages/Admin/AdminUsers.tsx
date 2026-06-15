import React, { useState } from 'react';
import styled from 'styled-components';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, KeyRound, X, Check } from 'lucide-react';
import { adminApi, AdminUser } from '@shared/api';

const Page = styled.div`
  padding: 40px;
`;

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 800;
  color: #1e1b4b;
  margin-bottom: 28px;
`;

const Toolbar = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const SearchWrap = styled.div`
  position: relative;
  flex: 1;
  min-width: 200px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 11px 16px 11px 42px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 14px;
  background: #fff;
  &:focus { outline: none; border-color: #7c3aed; }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 13px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
`;

const RoleFilter = styled.select`
  padding: 11px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 14px;
  background: #fff;
  cursor: pointer;
  &:focus { outline: none; border-color: #7c3aed; }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
`;

const Th = styled.th`
  text-align: left;
  padding: 14px 20px;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: #f9fafb;
  border-bottom: 1px solid #f3f4f6;
`;

const Td = styled.td`
  padding: 16px 20px;
  font-size: 14px;
  color: #374151;
  border-bottom: 1px solid #f9fafb;
`;

const Tr = styled.tr`
  &:hover td { background: #f9fafb; }
  &:last-child td { border-bottom: none; }
`;

const RoleBadge = styled.span<{ $role: string }>`
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  background: ${p => p.$role === 'ADMIN' ? '#fef3c7' : p.$role === 'HR' ? '#dbeafe' : '#d1fae5'};
  color: ${p => p.$role === 'ADMIN' ? '#92400e' : p.$role === 'HR' ? '#1e40af' : '#065f46'};
`;

const ActionBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 12px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: #fff;
  font-size: 13px;
  color: #374151;
  cursor: pointer;
  transition: all 0.15s;
  &:hover { background: #f5f3ff; border-color: #7c3aed; color: #7c3aed; }
`;

// Modal
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Modal = styled.div`
  background: #fff;
  border-radius: 20px;
  padding: 32px;
  width: 400px;
  max-width: 90vw;
  position: relative;
`;

const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #1d1d1f;
  margin-bottom: 20px;
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
  padding: 12px 14px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  &:focus { outline: none; border-color: #7c3aed; }
`;

const SaveBtn = styled.button`
  width: 100%;
  padding: 13px;
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
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
`;

export const AdminUsers: React.FC = () => {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [toast, setToast] = useState('');

  const { data } = useQuery({
    queryKey: ['admin-users', search, role],
    queryFn: () => adminApi.getUsers({ search: search || undefined, role: role || undefined }),
  });

  const mutation = useMutation({
    mutationFn: ({ id, password }: { id: number; password: string }) =>
      adminApi.resetPassword(id, password),
    onSuccess: () => {
      setSelectedUser(null);
      setNewPassword('');
      showToast('Пароль обновлён');
    },
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const users = data?.data || [];

  return (
    <Page>
      <PageTitle>Пользователи ({users.length})</PageTitle>

      <Toolbar>
        <SearchWrap>
          <SearchIcon size={16} />
          <SearchInput
            placeholder="Поиск по email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </SearchWrap>
        <RoleFilter value={role} onChange={e => setRole(e.target.value)}>
          <option value="">Все роли</option>
          <option value="ADMIN">Администраторы</option>
          <option value="HR">HR</option>
          <option value="CANDIDATE">Кандидаты</option>
        </RoleFilter>
      </Toolbar>

      <Table>
        <thead>
          <tr>
            <Th>ID</Th>
            <Th>Email</Th>
            <Th>Имя</Th>
            <Th>Роль</Th>
            <Th>Компания / Профиль</Th>
            <Th>Дата регистрации</Th>
            <Th>Действия</Th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <Tr key={u.id}>
              <Td>{u.id}</Td>
              <Td>{u.email}</Td>
              <Td>
                {u.profile ? `${u.profile.firstName} ${u.profile.lastName}`.trim() || '—' : '—'}
              </Td>
              <Td><RoleBadge $role={u.role}>{u.role}</RoleBadge></Td>
              <Td>{u.company?.name || '—'}</Td>
              <Td>{new Date(u.createdAt).toLocaleDateString('ru')}</Td>
              <Td>
                <ActionBtn onClick={() => setSelectedUser(u)}>
                  <KeyRound size={14} /> Сменить пароль
                </ActionBtn>
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>

      {selectedUser && (
        <Overlay onClick={() => setSelectedUser(null)}>
          <Modal onClick={e => e.stopPropagation()}>
            <CloseBtn onClick={() => setSelectedUser(null)}><X size={16} /></CloseBtn>
            <ModalTitle>Сменить пароль</ModalTitle>
            <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 20 }}>
              Пользователь: <strong>{selectedUser.email}</strong>
            </p>
            <FormGroup>
              <Label>Новый пароль</Label>
              <Input
                type="password"
                placeholder="Минимум 6 символов"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
            </FormGroup>
            <SaveBtn
              disabled={newPassword.length < 6 || mutation.isPending}
              onClick={() => mutation.mutate({ id: selectedUser.id, password: newPassword })}
            >
              {mutation.isPending ? 'Сохраняем...' : 'Сохранить новый пароль'}
            </SaveBtn>
          </Modal>
        </Overlay>
      )}

      {toast && (
        <Toast><Check size={16} color="#10b981" /> {toast}</Toast>
      )}
    </Page>
  );
};
