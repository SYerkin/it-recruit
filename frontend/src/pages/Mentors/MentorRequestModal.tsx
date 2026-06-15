import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, CreditCard, ArrowRight } from 'lucide-react';
import { mentorApi, Mentor } from '@shared/api';
import { useAuthStore } from '@app/store/auth.store';

interface Props {
  mentor: Mentor;
  onClose: () => void;
}

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  @media (max-width: 640px) {
    align-items: flex-start;
    padding: 8px;
    overflow-y: auto;
  }
`;

const Modal = styled(motion.div)`
  background: #fff;
  border-radius: 24px;
  width: 100%;
  max-width: 480px;
  padding: 32px;
  position: relative;
  box-shadow: 0 24px 64px rgba(0,0,0,0.15);
  max-height: calc(100vh - 48px);
  overflow-y: auto;
  @media (max-width: 640px) {
    border-radius: 16px;
    padding: 18px 14px;
    max-height: calc(100vh - 16px);
  }
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: none;
  background: #f3f4f6;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  &:hover { background: #e5e7eb; }
  @media (max-width: 640px) {
    top: 10px;
    right: 10px;
    width: 32px;
    height: 32px;
  }
`;

const Title = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #1d1d1f;
  margin-bottom: 4px;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 24px;
  padding-right: 30px;
`;

const Steps = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 28px;
`;

const Step = styled.div<{ $active?: boolean; $done?: boolean }>`
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: ${p => p.$done ? '#7c3aed' : p.$active ? '#a78bfa' : '#e5e7eb'};
  transition: background 0.3s;
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
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 15px;
  transition: border-color 0.2s;
  &:focus { outline: none; border-color: #7c3aed; }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 15px;
  resize: vertical;
  min-height: 90px;
  font-family: inherit;
  transition: border-color 0.2s;
  &:focus { outline: none; border-color: #7c3aed; }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 15px;
  background: #fff;
  cursor: pointer;
  &:focus { outline: none; border-color: #7c3aed; }
`;

const Btn = styled.button<{ $variant?: 'primary' | 'outline' }>`
  width: 100%;
  padding: 14px;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: ${p => p.$variant === 'outline' ? '2px solid #e5e7eb' : 'none'};
  background: ${p => p.$variant === 'outline' ? '#fff' : 'linear-gradient(135deg, #667eea, #764ba2)'};
  color: ${p => p.$variant === 'outline' ? '#374151' : '#fff'};
  &:hover { opacity: 0.9; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const PriceBox = styled.div`
  background: #f5f3ff;
  border-radius: 14px;
  padding: 16px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const PriceLabel = styled.span`
  font-size: 14px;
  color: #6b7280;
`;

const PriceValue = styled.span`
  font-size: 22px;
  font-weight: 800;
  color: #7c3aed;
  @media (max-width: 640px) {
    font-size: 20px;
  }
`;

const SuccessBlock = styled.div`
  text-align: center;
  padding: 24px 0;
  h3 { font-size: 22px; font-weight: 700; color: #1d1d1f; margin: 16px 0 8px; }
  p { font-size: 15px; color: #6b7280; line-height: 1.6; }
`;

const CardRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 0;
  }
`;

export const MentorRequestModal: React.FC<Props> = ({ mentor, onClose }) => {
  const { user } = useAuthStore();
  const [step, setStep] = useState(1); // 1=form, 2=payment, 3=success
  const [loading, setLoading] = useState(false);
  const [requestId, setRequestId] = useState<number | null>(null);

  const getUserDisplayName = () => {
    const firstName = user?.profile?.firstName?.trim?.() || '';
    const lastName = user?.profile?.lastName?.trim?.() || '';
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName;
  };

  const [form, setForm] = useState({
    name: getUserDisplayName(),
    email: user?.email || '',
    goal: '',
    message: '',
  });

  const [card, setCard] = useState({
    number: '',
    expiry: '',
    cvv: '',
    holder: '',
  });

  const isFree = mentor.pricePerSession === 0;

  useEffect(() => {
    if (!user) return;
    setForm((prev) => ({
      ...prev,
      name: prev.name || getUserDisplayName(),
      email: prev.email || user.email || '',
    }));
  }, [user]);

  const handleFormSubmit = async () => {
    if (!form.name || !form.email || !form.goal) return;
    setLoading(true);
    try {
      const res = await mentorApi.createRequest(mentor.id, form);
      setRequestId(res.data.id);
      if (isFree) {
        setStep(3);
      } else {
        setStep(2);
      }
    } catch (e) {
      alert('Ошибка при отправке заявки');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!card.number || !card.holder || !card.expiry || !card.cvv) return;
    if (!requestId) return;
    setLoading(true);
    try {
      await mentorApi.paySession(mentor.id, {
        requestId,
        cardNumber: card.number,
        cardHolder: card.holder,
      });
      setStep(3);
    } catch (e) {
      alert('Ошибка оплаты');
    } finally {
      setLoading(false);
    }
  };

  const formatCard = (v: string) =>
    v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

  const formatExpiry = (v: string) =>
    v.replace(/\D/g, '').slice(0, 4).replace(/^(.{2})(.+)/, '$1/$2');

  return (
    <AnimatePresence>
      <Overlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <Modal
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={e => e.stopPropagation()}
        >
          <CloseBtn onClick={onClose}><X size={18} /></CloseBtn>

          {step < 3 && (
            <>
              <Title>Записаться к {mentor.name}</Title>
              <Subtitle>{mentor.title}</Subtitle>
              <Steps>
                <Step $done={step > 1} $active={step === 1} />
                {!isFree && <Step $done={step > 2} $active={step === 2} />}
              </Steps>
            </>
          )}

          {step === 1 && (
            <>
              <FormGroup>
                <Label>Ваше имя</Label>
                <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Алибек Дюсенов" />
              </FormGroup>
              <FormGroup>
                <Label>Email</Label>
                <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
              </FormGroup>
              <FormGroup>
                <Label>Цель сессии</Label>
                <Select value={form.goal} onChange={e => setForm({ ...form, goal: e.target.value })}>
                  <option value="">Выберите цель...</option>
                  <option value="Найти первую работу в IT">Найти первую работу в IT</option>
                  <option value="Вырасти до Middle">Вырасти до Middle</option>
                  <option value="Сменить стек технологий">Сменить стек технологий</option>
                  <option value="Подготовка к собеседованию">Подготовка к собеседованию</option>
                  <option value="Разбор проекта / код-ревью">Разбор проекта / код-ревью</option>
                  <option value="Карьерная консультация">Карьерная консультация</option>
                  <option value="Другое">Другое</option>
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>Сообщение (необязательно)</Label>
                <Textarea
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder="Расскажите о себе и что хотите получить от сессии..."
                />
              </FormGroup>
              <Btn onClick={handleFormSubmit} disabled={loading || !form.name || !form.email || !form.goal}>
                {loading ? 'Отправляем...' : isFree ? 'Записаться бесплатно' : <>Далее — оплата <ArrowRight size={16} /></>}
              </Btn>
            </>
          )}

          {step === 2 && !isFree && (
            <>
              <PriceBox>
                <PriceLabel>Сессия {mentor.sessionDuration} мин с {mentor.name}</PriceLabel>
                <PriceValue>{mentor.pricePerSession.toLocaleString('ru')} ₸</PriceValue>
              </PriceBox>
              <FormGroup>
                <Label>Номер карты</Label>
                <Input
                  value={card.number}
                  onChange={e => setCard({ ...card, number: formatCard(e.target.value) })}
                  placeholder="0000 0000 0000 0000"
                  maxLength={19}
                />
              </FormGroup>
              <FormGroup>
                <Label>Имя держателя</Label>
                <Input
                  value={card.holder}
                  onChange={e => setCard({ ...card, holder: e.target.value.toUpperCase() })}
                  placeholder="ALIBEK DUSSENOV"
                />
              </FormGroup>
              <CardRow>
                <FormGroup>
                  <Label>Срок действия</Label>
                  <Input
                    value={card.expiry}
                    onChange={e => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>CVV</Label>
                  <Input
                    type="password"
                    value={card.cvv}
                    onChange={e => setCard({ ...card, cvv: e.target.value.replace(/\D/g,'').slice(0,3) })}
                    placeholder="•••"
                    maxLength={3}
                  />
                </FormGroup>
              </CardRow>
              <Btn onClick={handlePayment} disabled={loading || !card.number || !card.holder || !card.expiry || !card.cvv}>
                <CreditCard size={18} />
                {loading ? 'Обрабатываем...' : `Оплатить ${mentor.pricePerSession.toLocaleString('ru')} ₸`}
              </Btn>
            </>
          )}

          {step === 3 && (
            <SuccessBlock>
              <CheckCircle size={56} color="#7c3aed" />
              <h3>Заявка отправлена!</h3>
              <p>
                {isFree
                  ? `${mentor.name} получит уведомление и свяжется с вами в ближайшее время.`
                  : `Оплата прошла успешно. ${mentor.name} свяжется с вами для подтверждения времени сессии.`}
              </p>
              <Btn style={{ marginTop: 24 }} onClick={onClose}>Закрыть</Btn>
            </SuccessBlock>
          )}
        </Modal>
      </Overlay>
    </AnimatePresence>
  );
};
