import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Tabs } from '../../components/ui/Tabs';
import { processEscrowPayment } from '../../services/requestsService';
import { toast } from '../../store/toastStore';
import confetti from 'canvas-confetti';
import { ShieldCheck, CreditCard, CheckCircle2 } from 'lucide-react';
import './PaymentModal.css';

export const PaymentModal = ({ isOpen, onClose, request, onSuccess }) => {
  const { t } = useTranslation();
  const [provider, setProvider] = useState('click'); // 'click' | 'payme'
  const [cardNumber, setCardNumber] = useState('8600 4912 3456 7890');
  const [expireDate, setExpireDate] = useState('12/28');
  const [processing, setProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [cardError, setCardError] = useState('');
  const [expError, setExpError] = useState('');

  if (!isOpen || !request) return null;

  const handleCardFormat = (e) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 16);
    val = val.replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(val);
    if (cardError) setCardError('');
  };

  const handleExpFormat = (e) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (val.length >= 3) val = val.slice(0, 2) + '/' + val.slice(2);
    setExpireDate(val);
    if (expError) setExpError('');
  };

  const handlePay = async (e) => {
    e.preventDefault();

    // Karta validatsiyasi: 16 raqam + MM/YY format
    if (cardNumber.replace(/\D/g, '').length !== 16) {
      setCardError(t('payment.err_card_length'));
      return;
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expireDate)) {
      setExpError(t('payment.err_card_exp'));
      return;
    }
    setProcessing(true);
    try {
      await processEscrowPayment(request.id, provider, { cardNumber, expireDate });
      setIsSuccess(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      toast.success(t('payment.success'));
      if (onSuccess) onSuccess();
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      toast.error('Toʻlovda xatolik: ' + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const tabsList = [
    { id: 'click', label: 'Click Evolution' },
    { id: 'payme', label: 'Payme' }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('payment.modal_title')} maxWidth="500px">
      {isSuccess ? (
        <div style={{ textAlign: 'center', padding: '30px 10px' }}>
          <div className="neo-pay-success-icon">
            <CheckCircle2 size={48} color="var(--success)" />
          </div>
          <h3 style={{ marginTop: 16 }}>{t('payment.success')}</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: 8, fontSize: '0.9rem' }}>
            $30 xizmat haqi Escrow xavfsiz hamyonida muzlatildi. Kontaktlar ochildi!
          </p>
        </div>
      ) : (
        <form onSubmit={handlePay} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="neo-escrow-security-callout">
            <ShieldCheck size={24} color="var(--primary)" />
            <div>
              <strong>Escrow Kafolati:</strong>
              <p>{t('payment.desc')}</p>
            </div>
          </div>

          <div>
            <label className="neo-label" style={{ marginBottom: 8, display: 'block' }}>
              {t('payment.choose_method')}:
            </label>
            <Tabs
              tabs={tabsList}
              activeTab={provider}
              onChange={setProvider}
              size="md"
            />
          </div>

          <div className="neo-card-simulation-box">
            <div className="neo-card-chip" />
            <div className="neo-card-logo">{provider.toUpperCase()}</div>
            <Input
              label={t('payment.card_number')}
              value={cardNumber}
              onChange={handleCardFormat}
              placeholder="8600 0000 0000 0000"
              icon={<CreditCard size={18} />}
              error={cardError}
              required
            />
            <div style={{ width: '130px', marginTop: 10 }}>
              <Input
                label={t('payment.card_exp')}
                value={expireDate}
                onChange={handleExpFormat}
                placeholder="MM/YY"
                maxLength={5}
                error={expError}
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <small style={{ color: 'var(--text-muted)' }}>Toʻlov summasi:</small>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>
                $30.00
              </div>
            </div>
            <Button type="submit" variant="primary" size="lg" loading={processing}>
              {processing ? t('payment.simulating') : t('payment.confirm_pay')}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
