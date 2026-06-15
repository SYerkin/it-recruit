import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { MessageCircle, X, Send, CheckCircle } from 'lucide-react';
import { feedbackApi } from '@shared/api';

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(124, 58, 237, 0.4); }
  50% { box-shadow: 0 0 0 8px rgba(124, 58, 237, 0); }
`;

const Fab = styled.button`
  position: fixed;
  bottom: 32px;
  right: 32px;
  z-index: 9000;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7c3aed, #6d28d9);
  color: #fff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(124, 58, 237, 0.4);
  animation: ${pulse} 3s ease-in-out infinite;
  transition: transform 0.2s;
  &:hover { transform: scale(1.1); }
  &:active { transform: scale(0.95); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 9001;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 32px;
`;

const Modal = styled.div`
  background: #fff;
  border-radius: 24px;
  padding: 32px;
  width: 400px;
  max-width: calc(100vw - 64px);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.2);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const ModalTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #1d1d1f;
`;

const CloseBtn = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: #f3f4f6;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover { background: #e5e7eb; }
`;

const Field = styled.div`
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
  padding: 10px 14px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 14px;
  box-sizing: border-box;
  &:focus { outline: none; border-color: #7c3aed; }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 14px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 14px;
  background: #fff;
  &:focus { outline: none; border-color: #7c3aed; }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 10px 14px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 14px;
  resize: vertical;
  min-height: 100px;
  box-sizing: border-box;
  font-family: inherit;
  &:focus { outline: none; border-color: #7c3aed; }
`;

const SubmitBtn = styled.button`
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #7c3aed, #6d28d9);
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: opacity 0.2s;
  &:hover { opacity: 0.9; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const SuccessBox = styled.div`
  text-align: center;
  padding: 24px 0;
`;

const SuccessIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #d1fae5;
  color: #10b981;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
`;

export const FeedbackButton: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', type: 'GENERAL', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    try {
      await feedbackApi.send(form);
      setSent(true);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSent(false);
    setForm({ name: '', email: '', type: 'GENERAL', message: '' });
  };

  return (
    <>
      {!open && (
        <Fab onClick={() => setOpen(true)} title="Обратная связь">
          <MessageCircle size={24} />
        </Fab>
      )}

      {open && (
        <Overlay onClick={handleClose}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>{sent ? 'Спасибо!' : 'Обратная связь'}</ModalTitle>
              <CloseBtn onClick={handleClose}>
                <X size={16} />
              </CloseBtn>
            </ModalHeader>

            {sent ? (
              <SuccessBox>
                <SuccessIcon>
                  <CheckCircle size={32} />
                </SuccessIcon>
                <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.6 }}>
                  Ваше сообщение получено. Мы обязательно его рассмотрим!
                </p>
              </SuccessBox>
            ) : (
              <form onSubmit={handleSubmit}>
                <Field>
                  <Label>Ваше имя</Label>
                  <Input
                    placeholder="Иван Иванов"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </Field>
                <Field>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="ivan@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </Field>
                <Field>
                  <Label>Тип обращения</Label>
                  <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                    <option value="GENERAL">Общее пожелание</option>
                    <option value="SUGGESTION">Предложение</option>
                    <option value="BUG_REPORT">Сообщить об ошибке</option>
                  </Select>
                </Field>
                <Field>
                  <Label>Сообщение</Label>
                  <Textarea
                    placeholder="Расскажите, что думаете о платформе..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                  />
                </Field>
                <SubmitBtn type="submit" disabled={loading}>
                  <Send size={16} />
                  {loading ? 'Отправляем...' : 'Отправить'}
                </SubmitBtn>
              </form>
            )}
          </Modal>
        </Overlay>
      )}
    </>
  );
};
