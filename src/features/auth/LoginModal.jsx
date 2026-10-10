import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ErrorBoundary } from '../../components/ui/ErrorBoundary';
import { useAuthStore } from '../../store/authStore';
import { Phone, ShieldCheck, Chrome, ArrowLeft } from 'lucide-react';

export const LoginModal = () => {
  const { t } = useTranslation();
  const {
    isLoginModalOpen,
    closeLoginModal,
    openRegisterModal,
    loginWithPhone,
    loginGoogle,
    requestOtp
  } = useAuthStore();

  const [phone, setPhone] = useState('+998 90 123 45 67');
  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [shake, setShake] = useState(false);

  const otpInputRefs = useRef([]);

  // Modal 'otp' bosqichiga o'tganda birinchi katakka fokus beriladi.
  // (DOM side-effect — setState emas, shuning uchun effect to'g'ri.)
  useEffect(() => {
    if (isLoginModalOpen && step === 'otp') {
      setTimeout(() => {
        if (otpInputRefs.current[0]) {
          otpInputRefs.current[0].focus();
        }
      }, 100);
    }
  }, [isLoginModalOpen, step]);

  const isPhoneValid = (value) => /^\+998\d{9}$/.test(String(value || '').replace(/[\s-]/g, ''));

  const getErrorMessage = (err) => {
    if (!err) return '';
    const code = err.code || '';
    switch (code) {
      case 'INVALID_OTP':
        return t('auth.err_invalid_otp');
      case 'OTP_EXPIRED':
        return t('auth.err_otp_expired');
      case 'TOO_MANY_ATTEMPTS':
        return t('auth.err_too_many_attempts');
      case 'USER_NOT_FOUND':
        return t('auth.err_user_not_found');
      case 'ACCOUNT_BLOCKED':
        return t('auth.err_account_blocked');
      case 'NETWORK_ERROR':
        return t('auth.err_network');
      case 'VALIDATION_ERROR':
        return err.message || t('auth.err_phone_format');
      default:
        return err.message || t('auth.err_unknown');
    }
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    if (!isPhoneValid(phone)) {
      setPhoneError(t('auth.err_phone_format'));
      return;
    }
    setPhoneError('');
    setLoading(true);
    try {
      if (requestOtp) {
        await requestOtp(phone);
      }
      // Demo qulayligi: mock SMS kod 123456 avtomatik to'ldiriladi.
      // (Event hodisasida to'ldiriladi — effect ichida emas.)
      setOtpDigits(['1', '2', '3', '4', '5', '6']);
      setStep('otp');
      setOtpError('');
    } catch (err) {
      console.error('requestOtp error:', err);
      setPhoneError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    // Only accept numbers
    const clean = value.replace(/\D/g, '');
    const newDigits = [...otpDigits];

    if (clean.length > 1) {
      // Paste multi-digit handling
      const pasted = clean.slice(0, 6).split('');
      pasted.forEach((char, i) => {
        if (i < 6) newDigits[i] = char;
      });
      setOtpDigits(newDigits);
      const nextIndex = Math.min(pasted.length, 5);
      if (otpInputRefs.current[nextIndex]) {
        otpInputRefs.current[nextIndex].focus();
      }
      return;
    }

    newDigits[index] = clean;
    setOtpDigits(newDigits);
    setOtpError('');

    if (clean && index < 5) {
      if (otpInputRefs.current[index + 1]) {
        otpInputRefs.current[index + 1].focus();
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otpDigits[index] && index > 0) {
        const newDigits = [...otpDigits];
        newDigits[index - 1] = '';
        setOtpDigits(newDigits);
        if (otpInputRefs.current[index - 1]) {
          otpInputRefs.current[index - 1].focus();
        }
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasteData) return;
    const newDigits = [...otpDigits];
    pasteData.split('').forEach((char, i) => {
      newDigits[i] = char;
    });
    setOtpDigits(newDigits);
    const targetIdx = Math.min(pasteData.length, 5);
    otpInputRefs.current[targetIdx]?.focus();
  };

  const handleOtpSubmit = async (e) => {
    if (e) e.preventDefault();
    const code = otpDigits.join('');
    if (code.length !== 6) {
      setOtpError(t('auth.err_otp_length'));
      triggerShake();
      return;
    }

    setOtpError('');
    setLoading(true);
    try {
      await loginWithPhone(phone, code);
      setStep('phone');
      setOtpDigits(['', '', '', '', '', '']);
    } catch (err) {
      console.error('loginWithPhone error:', err);
      setOtpError(getErrorMessage(err));
      triggerShake();
      // Focus back to first box
      if (otpInputRefs.current[0]) {
        otpInputRefs.current[0].focus();
      }
    } finally {
      setLoading(false);
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 600);
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await loginGoogle();
    } catch (err) {
      console.error('Google login error:', err);
      setPhoneError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isLoginModalOpen} onClose={closeLoginModal} title={t('auth.welcome_back')}>
      <ErrorBoundary fallback={(err, reset) => (
        <div style={{ padding: 16, textAlign: 'center' }}>
          <p style={{ color: 'var(--danger)', marginBottom: 12 }}>{t('auth.err_unknown')}</p>
          <Button variant="default" size="sm" onClick={reset}>Qayta urinish</Button>
        </div>
      )}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 20, fontSize: '0.92rem' }}>
          {t('auth.login_desc')}
        </p>

        {step === 'phone' ? (
          <form onSubmit={handlePhoneSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input
              label={t('auth.phone')}
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setPhoneError('');
              }}
              placeholder={t('auth.phone_placeholder')}
              icon={<Phone size={18} />}
              error={phoneError}
              required
            />

            <Button type="submit" variant="primary" size="lg" loading={loading} disabled={loading}>
              {t('auth.send_code')}
            </Button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '8px 0' }}>
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
              disabled={loading}
            >
              {t('auth.google_login')}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div
              style={{
                padding: '12px 14px',
                background: 'var(--primary-light)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: 'var(--neo-inset)'
              }}
            >
              <ShieldCheck size={18} />
              <span>Mock SMS kod: <strong>123456</strong> ({phone})</span>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 8, fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {t('auth.enter_otp')}
              </label>

              {/* 6 alohida katak */}
              <div
                style={{
                  display: 'flex',
                  gap: 10,
                  justifyContent: 'center',
                  animation: shake ? 'neoOtpShake 0.45s ease-in-out' : 'none'
                }}
              >
                {otpDigits.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (otpInputRefs.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    onPaste={handleOtpPaste}
                    disabled={loading}
                    style={{
                      width: 46,
                      height: 52,
                      textAlign: 'center',
                      fontSize: '1.4rem',
                      fontWeight: 700,
                      borderRadius: 12,
                      border: otpError ? '2px solid var(--danger)' : '1px solid var(--border-subtle)',
                      background: 'var(--bg-card)',
                      color: 'var(--text-primary)',
                      boxShadow: digit ? 'var(--neo-inset)' : 'var(--neo-outset)',
                      outline: 'none',
                      transition: 'all 0.15s ease'
                    }}
                  />
                ))}
              </div>

              {otpError && (
                <div style={{ color: 'var(--danger)', fontSize: '0.82rem', marginTop: 8, textAlign: 'center', fontWeight: 500 }}>
                  {otpError}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
              <Button
                type="button"
                variant="default"
                icon={<ArrowLeft size={16} />}
                onClick={() => {
                  setStep('phone');
                  setOtpError('');
                }}
                disabled={loading}
                style={{ flex: 1 }}
              >
                Ortga
              </Button>

              <Button
                type="submit"
                variant="primary"
                loading={loading}
                disabled={loading || otpDigits.join('').length !== 6}
                style={{ flex: 2 }}
              >
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
            style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {t('auth.register_title')}
          </button>
        </div>
      </ErrorBoundary>
    </Modal>
  );
};
