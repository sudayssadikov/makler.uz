import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuthStore } from '../../store/authStore';
import { Phone, ShieldCheck, Chrome } from 'lucide-react';

export const LoginModal = () => {
  const { t } = useTranslation();
  const { isLoginModalOpen, closeLoginModal, openRegisterModal, loginPhone, loginGoogle } = useAuthStore();

  const [phone, setPhone] = useState('+998 90 123 45 67');
  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [otpError, setOtpError] = useState('');

  // +998 bilan boshlanib, jami 12 ta raqam (bo'shliqlarsiz)
  const isPhoneValid = (value) => /^\+998\d{9}$/.test(String(value || '').replace(/[\s-]/g, ''));

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    if (!isPhoneValid(phone)) {
      setPhoneError(t('auth.err_phone_format'));
      return;
    }
    setPhoneError('');
    setStep('otp');
    setOtp('123456'); // Qulay demo uchun mock SMS kod avtomatik beriladi
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (String(otp).replace(/\D/g, '').length !== 6) {
      setOtpError(t('auth.err_otp_length'));
      return;
    }
    setOtpError('');
    setLoading(true);
    try {
      await loginPhone(phone, otp);
      setStep('phone');
    } catch (err) {
      setOtpError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await loginGoogle();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isLoginModalOpen} onClose={closeLoginModal} title={t('auth.welcome_back')}>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 20, fontSize: '0.92rem' }}>
        {t('auth.login_desc')}
      </p>

      {step === 'phone' ? (
        <form onSubmit={handlePhoneSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input
            label={t('auth.phone')}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t('auth.phone_placeholder')}
            icon={<Phone size={18} />}
            error={phoneError}
            required
          />

          <Button type="submit" variant="primary" size="lg">
            {t('auth.send_code')}
          </Button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '10px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t('auth.or')}</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
          </div>

          <Button
            type="button"
            variant="default"
            size="lg"
            icon={<Chrome size={18} color="#ea4335" />}
            onClick={handleGoogle}
            loading={loading}
          >
            {t('auth.google_login')}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div
            style={{
              padding: 12,
              background: 'var(--primary-light)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <ShieldCheck size={18} />
            <span>Mock SMS kod yuborildi: <strong>123456</strong></span>
          </div>

          <Input
            label={t('auth.enter_otp')}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="123456"
            maxLength={6}
            error={otpError}
            required
            autoFocus
          />

          <div style={{ display: 'flex', gap: 12 }}>
            <Button type="button" variant="default" onClick={() => setStep('phone')} style={{ flex: 1 }}>
              Ortga
            </Button>
            <Button type="submit" variant="primary" loading={loading} style={{ flex: 2 }}>
              {t('auth.verify_otp')}
            </Button>
          </div>
        </form>
      )}

      <div style={{ marginTop: 24, textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        Akkauntingiz yoʻqmi?{' '}
        <button
          type="button"
          onClick={openRegisterModal}
          style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'underline' }}
        >
          {t('auth.register_title')}
        </button>
      </div>
    </Modal>
  );
};
