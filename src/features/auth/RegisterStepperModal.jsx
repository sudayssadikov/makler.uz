import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Stepper } from '../../components/ui/Stepper';
import { useAuthStore } from '../../store/authStore';
import { ShieldCheck, Upload, AlertCircle, FileCheck } from 'lucide-react';

export const RegisterStepperModal = () => {
  const { t } = useTranslation();
  const { isRegisterModalOpen, closeRegisterModal, openLoginModal, register } = useAuthStore();

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    pinfl: '',
    passportPhoto: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
    phone: '+998 90 999 88 77',
    otp: '123456'
  });

  const [errors, setErrors] = useState({});

  const steps = [
    { title: t('auth.step_personal') },
    { title: t('auth.step_identity') },
    { title: t('auth.step_phone') }
  ];

  const isPhoneValid = (value) => /^\+998\d{9}$/.test(String(value || '').replace(/[\s-]/g, ''));

  const validateStep = () => {
    const errs = {};
    if (activeStep === 0) {
      if (!formData.firstName.trim()) errs.firstName = t('auth.err_required_first');
      if (!formData.lastName.trim()) errs.lastName = t('auth.err_required_last');
      if (!formData.birthDate) errs.birthDate = t('auth.err_required_birth');
    } else if (activeStep === 1) {
      if (!formData.pinfl || formData.pinfl.length !== 14 || !/^\d+$/.test(formData.pinfl)) {
        errs.pinfl = t('auth.err_pinfl_length');
      }
      if (!formData.passportPhoto) {
        errs.passportPhoto = t('auth.err_passport_required');
      }
    } else if (activeStep === 2) {
      if (!isPhoneValid(formData.phone)) errs.phone = t('auth.err_phone_format');
      if (String(formData.otp || '').replace(/\D/g, '').length !== 6) {
        errs.otp = t('auth.err_otp_length');
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setActiveStep((prev) => Math.max(0, prev - 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    setLoading(true);
    try {
      await register(formData);
      setActiveStep(0);
    } finally {
      setLoading(false);
    }
  };

  const handlePinflChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 14);
    setFormData({ ...formData, pinfl: val });
  };

  return (
    <Modal
      isOpen={isRegisterModalOpen}
      onClose={closeRegisterModal}
      title={t('auth.register_title')}
      maxWidth="620px"
    >
      <Stepper steps={steps} currentStep={activeStep} onStepClick={(idx) => setActiveStep(idx)} />

      <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
        {/* Step 1: Shaxsiy ma'lumotlar */}
        {activeStep === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input
              label={t('auth.first_name')}
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              placeholder="Masalan: Sardor"
              error={errors.firstName}
              required
            />
            <Input
              label={t('auth.last_name')}
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              placeholder="Masalan: Aliyev"
              error={errors.lastName}
              required
            />
            <Input
              label={t('auth.birth_date')}
              type="date"
              value={formData.birthDate}
              onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
              error={errors.birthDate}
              required
            />
          </div>
        )}

        {/* Step 2: JSHSHIR & Pasport yuklash */}
        {activeStep === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div
              style={{
                padding: 14,
                background: 'var(--info-light)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--info)',
                display: 'flex',
                gap: 10,
                fontSize: '0.86rem',
                lineHeight: 1.4
              }}
            >
              <AlertCircle size={22} style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong>Nega JSHSHIR kerak?</strong>
                <p style={{ marginTop: 4 }}>{t('auth.pinfl_hint')}</p>
              </div>
            </div>

            <Input
              label={t('auth.pinfl')}
              value={formData.pinfl}
              onChange={handlePinflChange}
              placeholder="31204951230012 (14 ta raqam)"
              maxLength={14}
              error={errors.pinfl}
              hint="Pasportingiz pastki qismidagi 14 xonali shaxsiy identifikatsiya raqami"
              required
            />

            <div>
              <label className="neo-label" style={{ marginBottom: 8, display: 'block' }}>
                {t('auth.passport_upload')}
              </label>
              <div
                className="neo-inset"
                style={{
                  padding: 20,
                  textAlign: 'center',
                  cursor: 'pointer',
                  border: '2px dashed var(--border-subtle)',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                {formData.passportPhoto ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <FileCheck size={36} color="var(--primary)" />
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary)' }}>
                      {t('auth.passport_uploaded')}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      pasport_id_doc.jpg (Tasdiqlashga tayyor)
                    </span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <Upload size={32} color="var(--text-muted)" />
                    <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                      Rasm yoki PDF faylni yuklang
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Telefon & OTP */}
        {activeStep === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input
              label={t('auth.phone')}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder={t('auth.phone_placeholder')}
              error={errors.phone}
              required
            />

            <div
              style={{
                padding: 12,
                background: 'var(--primary-light)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: '0.85rem'
              }}
            >
              <ShieldCheck size={18} />
              <span>SMS tasdiqlash kodi: <strong>123456</strong></span>
            </div>

            <Input
              label={t('auth.enter_otp')}
              value={formData.otp}
              onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
              placeholder="123456"
              maxLength={6}
              error={errors.otp}
              required
            />
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, gap: 12 }}>
          {activeStep > 0 ? (
            <Button type="button" variant="default" onClick={handlePrev}>
              {t('wizard.prev')}
            </Button>
          ) : <div />}

          {activeStep < steps.length - 1 ? (
            <Button type="button" variant="primary" onClick={handleNext}>
              {t('wizard.next')}
            </Button>
          ) : (
            <Button type="submit" variant="primary" loading={loading}>
              {t('auth.complete_register')}
            </Button>
          )}
        </div>
      </form>

      <div style={{ marginTop: 20, textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        Akkauntingiz bormi?{' '}
        <button
          type="button"
          onClick={openLoginModal}
          style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'underline' }}
        >
          {t('nav.login')}
        </button>
      </div>
    </Modal>
  );
};
