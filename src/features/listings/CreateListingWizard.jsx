import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Stepper } from '../../components/ui/Stepper';
import { Tabs } from '../../components/ui/Tabs';
import { useAuthStore } from '../../store/authStore';
import { createListing } from '../../services/listingsService';
import { toast } from '../../store/toastStore';
import { REGIONS_DATA, BUILDING_TYPES } from '../../constants/regions';
import { AMENITIES_LIST, RULES_LIST } from '../../constants/amenities';
import {
  Plus,
  Trash2,
  AlertCircle,
  FileCheck,
  CheckCircle2
} from 'lucide-react';
import './CreateListingWizard.css';

export const CreateListingWizard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isAuthenticated, openLoginModal } = useAuthStore();

  const [activeStep, setActiveStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Listing state
  const [formData, setFormData] = useState({
    type: 'RENT',                 // 'RENT' | 'SALE'
    rentMode: 'ENTIRE',           // 'ENTIRE' | 'ROOM'
    title: '',
    description: '',
    region: 'tashkent_city',
    district: 'yunusabad',
    address: '',
    distanceToMetro: '',
    coordinates: [41.3111, 69.2797],
    roomsCount: 2,
    areaTotal: 65,
    areaLiving: 45,
    floor: 3,
    totalFloors: 9,
    buildingType: 'brick',
    condition: 'furnished',
    repairType: 'euro',
    price: 450,
    currency: 'USD',
    isUtilityIncluded: false,
    paymentTerm: 'POSTPAY',       // 'PREPAY' | 'POSTPAY' | 'MONTHLY'
    deposit: 450,                 // Postpay bo'lsa kamida 1 oylik narx
    minRentalPeriodMonths: 6,
    isBargain: false,
    amenities: ['wifi', 'ac', 'furniture', 'washing_machine'],
    rules: ['no_smoking', 'family_only'],
    ownershipDoc: 'kadastr_doc_uploaded.pdf',
    coverImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    // Xona-xona rasmlar va detallar
    roomsData: [
      {
        name: '1-xona (Mehmonxona)',
        area: 24,
        capacity: 2,
        price: 250,
        photos: [
          'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80'
        ],
        drawbacks: 'Konditsioner pulti yangilanishi lozim.'
      }
    ],
    commonAreas: [
      {
        name: 'Oshxona',
        photo: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
        notes: 'Gaz plitasi, muzlatgich mavjud.'
      }
    ]
  });

  const steps = [
    { title: t('wizard.step_basic') },
    { title: t('wizard.step_rooms') },
    { title: t('wizard.step_amenities') },
    { title: t('wizard.step_price') },
    { title: t('wizard.step_documents') }
  ];

  // Room boshqaruvi
  const handleAddRoom = () => {
    setFormData((prev) => ({
      ...prev,
      roomsData: [
        ...prev.roomsData,
        {
          name: `${prev.roomsData.length + 1}-xona`,
          area: 18,
          capacity: 2,
          price: 150,
          photos: [
            'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1540518614846-7ede433c4ef3?auto=format&fit=crop&w=600&q=80'
          ],
          drawbacks: ''
        }
      ]
    }));
  };

  const handleRemoveRoom = (idx) => {
    setFormData((prev) => ({
      ...prev,
      roomsData: prev.roomsData.filter((_, i) => i !== idx)
    }));
  };

  const handleUpdateRoom = (idx, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.roomsData];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, roomsData: updated };
    });
  };

  // Common area boshqaruvi
  const handleAddCommonArea = () => {
    setFormData((prev) => ({
      ...prev,
      commonAreas: [
        ...prev.commonAreas,
        {
          name: 'Hammom & Sanuzel',
          photo: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
          notes: 'Toza kafel va yangi santexnika'
        }
      ]
    }));
  };

  const handleAmenityToggle = (id) => {
    setFormData((prev) => {
      const exists = prev.amenities.includes(id);
      return {
        ...prev,
        amenities: exists ? prev.amenities.filter((a) => a !== id) : [...prev.amenities, id]
      };
    });
  };

  const handleRuleToggle = (id) => {
    setFormData((prev) => {
      const exists = prev.rules.includes(id);
      return {
        ...prev,
        rules: exists ? prev.rules.filter((r) => r !== id) : [...prev.rules, id]
      };
    });
  };

  // Validatsiya tekshiruvi
  const isCurrentStepValid = () => {
    if (activeStep === 0) {
      return formData.title.trim().length > 5 && formData.address.trim().length > 3;
    }
    if (activeStep === 1) {
      // Har bir xonada kamida 3 ta rasm bo'lishi MAJBURIY
      for (const r of formData.roomsData) {
        if (!r.photos || r.photos.length < 3) return false;
      }
      return true;
    }
    if (activeStep === 3) {
      if (formData.price <= 0) return false;
      // Agar POSTPAY bo'lsa zalog va min muddat majburiy
      if (formData.type === 'RENT' && formData.paymentTerm === 'POSTPAY') {
        if (!formData.deposit || formData.deposit < formData.price) return false;
        if (!formData.minRentalPeriodMonths) return false;
      }
      return true;
    }
    if (activeStep === 4) {
      // Sotuvda yoki ijarada kadastr/egalik hujjati yuklanishi majburiy
      return !!formData.ownershipDoc;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.warning('Eʼlon qoʻshish uchun avval tizimga kiring');
      openLoginModal();
      return;
    }

    setSubmitting(true);
    try {
      await createListing(formData, user?.id);
      toast.success(t('wizard.success_submitted'));
      navigate('/my-listings');
    } catch (err) {
      toast.error('Xatolik: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container neo-wizard-page">
      <div className="neo-wizard-header">
        <h1 className="neo-wizard-title">{t('wizard.create_title')}</h1>
        <p className="neo-wizard-subtitle">
          Barcha maʼlumotlarni shaffof va toʻliq toʻldiring. Eʼlon moderatsiyadan soʻng eʼlon qilinadi.
        </p>
      </div>

      <Card padding="lg" className="neo-wizard-box">
        <Stepper steps={steps} currentStep={activeStep} onStepClick={(idx) => idx <= activeStep && setActiveStep(idx)} />

        <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
          {/* STEP 0: ASOSIY MA'LUMOTLAR */}
          {activeStep === 0 && (
            <div className="neo-wizard-step-content">
              {/* Type: RENT / SALE */}
              <div className="neo-quiz-row">
                <label className="neo-label">{t('wizard.type_select')}:</label>
                <Tabs
                  tabs={[
                    { id: 'RENT', label: 'IJARA (Rent)' },
                    { id: 'SALE', label: 'SOTUV (Sale)' }
                  ]}
                  activeTab={formData.type}
                  onChange={(val) => setFormData({ ...formData, type: val })}
                  size="lg"
                />
              </div>

              {/* Mode (Ijara bo'lsa: Butun uy yoki Xona-xona) */}
              {formData.type === 'RENT' && (
                <div className="neo-quiz-row">
                  <label className="neo-label">{t('wizard.mode_select')}:</label>
                  <Tabs
                    tabs={[
                      { id: 'ENTIRE', label: 'Butun uy / xonadon' },
                      { id: 'ROOM', label: 'Xona-xona (talabalar/yotoqxona uslubi)' }
                    ]}
                    activeTab={formData.rentMode}
                    onChange={(val) => setFormData({ ...formData, rentMode: val })}
                  />
                </div>
              )}

              <Input
                label={t('wizard.title_input')}
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Masalan: Yunusobod 4-mavzeda shinam 3 xonali evro-taʼmir xonadon"
                required
              />

              <div className="neo-quiz-grid-2">
                <Select
                  label="Viloyat / Shahar"
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  options={REGIONS_DATA.map((r) => ({ value: r.id, label: r.name.uz }))}
                />

                <Input
                  label="Tuman va manzil"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Masalan: Yunusobod 4-mavze, 12-uy"
                  required
                />
              </div>

              <div className="neo-quiz-grid-2">
                <Input
                  label="Metro / Transportgacha masofa"
                  value={formData.distanceToMetro}
                  onChange={(e) => setFormData({ ...formData, distanceToMetro: e.target.value })}
                  placeholder="Shahriston metro - 400 metr"
                />

                <Select
                  label="Bino turi"
                  value={formData.buildingType}
                  onChange={(e) => setFormData({ ...formData, buildingType: e.target.value })}
                  options={BUILDING_TYPES.map((b) => ({ value: b.id, label: b.name.uz }))}
                />
              </div>

              <div className="neo-quiz-grid-2">
                <Input
                  label="Qavat / Jami qavatlar"
                  value={`${formData.floor}/${formData.totalFloors}`}
                  onChange={(e) => {
                    const parts = e.target.value.split('/');
                    setFormData({
                      ...formData,
                      floor: parseInt(parts[0], 10) || 1,
                      totalFloors: parseInt(parts[1], 10) || 5
                    });
                  }}
                  placeholder="3/9"
                />

                <Input
                  label="Umumiy maydon (m²)"
                  type="number"
                  value={formData.areaTotal}
                  onChange={(e) => setFormData({ ...formData, areaTotal: Number(e.target.value) })}
                />
              </div>
            </div>
          )}

          {/* STEP 1: XONALAR VA RASMLAR (KAMIDA 3 TA RASM MAJBURIY) */}
          {activeStep === 1 && (
            <div className="neo-wizard-step-content">
              <div
                style={{
                  padding: 14,
                  background: 'var(--info-light)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--info)',
                  display: 'flex',
                  gap: 10,
                  fontSize: '0.88rem'
                }}
              >
                <AlertCircle size={22} style={{ flexShrink: 0 }} />
                <span>
                  <strong>Shaffoflik talabi:</strong> Har bir xonaning kamida 3 ta rasmi va ochiq kamchiliklari
                  kiritilishi shart! Shuningdek umumiy xonalar (oshxona, hammom) rasmlarini qoʻshing.
                </span>
              </div>

              {formData.roomsData.map((room, idx) => (
                <div key={idx} className="neo-room-builder-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4>{room.name || `Xona #${idx + 1}`}</h4>
                    {formData.roomsData.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveRoom(idx)}
                        style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: 4 }}
                      >
                        <Trash2 size={16} /> Oʻchirish
                      </button>
                    )}
                  </div>

                  <div className="neo-quiz-grid-2" style={{ marginTop: 12 }}>
                    <Input
                      label={t('wizard.room_name')}
                      value={room.name}
                      onChange={(e) => handleUpdateRoom(idx, 'name', e.target.value)}
                    />
                    <Input
                      label="Maydoni (m²)"
                      type="number"
                      value={room.area}
                      onChange={(e) => handleUpdateRoom(idx, 'area', Number(e.target.value))}
                    />
                  </div>

                  {formData.rentMode === 'ROOM' && (
                    <div className="neo-quiz-grid-2" style={{ marginTop: 12 }}>
                      <Input
                        label={t('wizard.room_capacity')}
                        type="number"
                        value={room.capacity}
                        onChange={(e) => handleUpdateRoom(idx, 'capacity', Number(e.target.value))}
                      />
                      <Input
                        label={t('wizard.room_price')}
                        type="number"
                        value={room.price}
                        onChange={(e) => handleUpdateRoom(idx, 'price', Number(e.target.value))}
                      />
                    </div>
                  )}

                  {/* Kamida 3 ta rasm */}
                  <div style={{ marginTop: 12 }}>
                    <label className="neo-label" style={{ marginBottom: 6, display: 'block' }}>
                      {t('wizard.room_photos_req')} ({room.photos.length} ta yuklangan):
                    </label>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      {room.photos.map((p, pIdx) => (
                        <div key={pIdx} className="neo-room-thumb-preview">
                          <img src={p} alt={`Photo ${pIdx + 1}`} />
                          <span className="neo-photo-idx">{pIdx + 1}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sharoit yoki kamchiliklar matni */}
                  <div style={{ marginTop: 14 }}>
                    <Input
                      label={t('wizard.drawback_input')}
                      value={room.drawbacks}
                      onChange={(e) => handleUpdateRoom(idx, 'drawbacks', e.target.value)}
                      placeholder="Masalan: Konditsioner faqat zalda bor, bu xonada yoʻq..."
                    />
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="default"
                icon={<Plus size={16} />}
                onClick={handleAddRoom}
              >
                {t('wizard.add_room')}
              </Button>

              {/* Umumiy xonalar */}
              <div style={{ marginTop: 24 }}>
                <h4 style={{ marginBottom: 12 }}>Umumiy xonalar (Oshxona, hammom)</h4>
                {formData.commonAreas.map((ca, idx) => (
                  <div key={idx} className="neo-room-builder-card" style={{ marginBottom: 12 }}>
                    <strong>{ca.name}</strong>
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                      {ca.notes}
                    </p>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  icon={<Plus size={15} />}
                  onClick={handleAddCommonArea}
                >
                  Umumiy xona qoʻshish
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: SHAROIT VA QOIDALAR */}
          {activeStep === 2 && (
            <div className="neo-wizard-step-content">
              <label className="neo-label" style={{ marginBottom: 12, display: 'block' }}>
                Mavjud qulayliklar:
              </label>
              <div className="neo-amenities-selector">
                {AMENITIES_LIST.map((am) => {
                  const isChecked = formData.amenities.includes(am.id);
                  return (
                    <button
                      key={am.id}
                      type="button"
                      className={`neo-amenity-select-pill ${isChecked ? 'is-selected' : ''}`}
                      onClick={() => handleAmenityToggle(am.id)}
                    >
                      <CheckCircle2 size={16} color={isChecked ? 'var(--primary)' : 'var(--text-muted)'} />
                      <span>{am.label.uz}</span>
                    </button>
                  );
                })}
              </div>

              <div style={{ marginTop: 24 }}>
                <label className="neo-label" style={{ marginBottom: 12, display: 'block' }}>
                  Uy qoidalari:
                </label>
                <div className="neo-amenities-selector">
                  {RULES_LIST.map((rule) => {
                    const isChecked = formData.rules.includes(rule.id);
                    return (
                      <button
                        key={rule.id}
                        type="button"
                        className={`neo-amenity-select-pill ${isChecked ? 'is-selected' : ''}`}
                        onClick={() => handleRuleToggle(rule.id)}
                      >
                        <CheckCircle2 size={16} color={isChecked ? 'var(--warning)' : 'var(--text-muted)'} />
                        <span>{rule.label.uz}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: NARX VA TO'LOV SHARTLARI (OY OXIRIDA BO'LSA ZALOG VA MIN MUDDAT MAJBURIY) */}
          {activeStep === 3 && (
            <div className="neo-wizard-step-content">
              <div className="neo-quiz-grid-2">
                <Input
                  label="Narxi ($)"
                  type="number"
                  value={formData.price}
                  onChange={(e) => {
                    const p = Number(e.target.value);
                    setFormData({
                      ...formData,
                      price: p,
                      deposit: formData.paymentTerm === 'POSTPAY' ? p : formData.deposit
                    });
                  }}
                  required
                />

                {formData.type === 'RENT' && (
                  <Select
                    label={t('listing.payment_term')}
                    value={formData.paymentTerm}
                    onChange={(e) => {
                      const term = e.target.value;
                      setFormData({
                        ...formData,
                        paymentTerm: term,
                        deposit: term === 'POSTPAY' ? formData.price : formData.deposit
                      });
                    }}
                    options={[
                      { value: 'PREPAY', label: t('listing.term_prepay') },
                      { value: 'POSTPAY', label: t('listing.term_postpay') },
                      { value: 'MONTHLY', label: t('listing.term_monthly') }
                    ]}
                  />
                )}
              </div>

              {/* Agar POSTPAY bo'lsa zalog va min muddat majburiy */}
              {formData.type === 'RENT' && formData.paymentTerm === 'POSTPAY' && (
                <div
                  style={{
                    padding: 16,
                    background: 'var(--warning-light)',
                    borderRadius: 'var(--radius-md)',
                    marginTop: 16
                  }}
                >
                  <strong style={{ color: '#92400e', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <AlertCircle size={18} />
                    Oy oxirida toʻlov sharti talabi:
                  </strong>
                  <p style={{ fontSize: '0.85rem', color: '#78350f', marginTop: 4, marginBottom: 14 }}>
                    Ijara toʻlovi oy oxirida toʻlanishi tanlanganda, kamida 1 oylik Zalog (Depozit) va minimal ijara
                    muddati kiritilishi qonuniy majburiydir!
                  </p>

                  <div className="neo-quiz-grid-2">
                    <Input
                      label={`Zalog (Depozit) summasi ($) - Kamida $${formData.price}`}
                      type="number"
                      value={formData.deposit}
                      onChange={(e) => setFormData({ ...formData, deposit: Number(e.target.value) })}
                      min={formData.price}
                      required
                    />

                    <Input
                      label="Minimal ijara muddati (oy)"
                      type="number"
                      value={formData.minRentalPeriodMonths}
                      onChange={(e) => setFormData({ ...formData, minRentalPeriodMonths: Number(e.target.value) })}
                      min={1}
                      required
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: HUJJATLAR & YUKLASH (KADASTR MAJBURIY) */}
          {activeStep === 4 && (
            <div className="neo-wizard-step-content">
              <label className="neo-label" style={{ marginBottom: 8, display: 'block' }}>
                {t('wizard.ownership_doc')}:
              </label>

              <div
                className="neo-inset"
                style={{
                  padding: 24,
                  textAlign: 'center',
                  border: '2px dashed var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                  <FileCheck size={40} color="var(--primary)" />
                  <strong>Kadastr / Egalik guvohnomasi yuklandi</strong>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    kadastr_doc_verified.pdf (Admin moderatsiyasiga tayyor)
                  </span>
                </div>
              </div>

              <div
                style={{
                  marginTop: 20,
                  padding: 14,
                  background: 'var(--primary-light)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--primary)',
                  fontSize: '0.88rem'
                }}
              >
                Eʼloningizni yuborganingizdan soʻng u darhol <strong>"Moderatsiyada"</strong> holatiga oʻtadi.
                Admin egalik hujjatlari va JSHSHIRni tekshirgach, platformada barchaga koʻrinadi.
              </div>
            </div>
          )}

          {/* Wizard Navigation Footer */}
          <div className="neo-wizard-actions">
            {activeStep > 0 ? (
              <Button type="button" variant="default" onClick={() => setActiveStep((p) => p - 1)}>
                {t('wizard.prev')}
              </Button>
            ) : <div />}

            {activeStep < steps.length - 1 ? (
              <Button
                type="button"
                variant="primary"
                onClick={() => isCurrentStepValid() && setActiveStep((p) => p + 1)}
                disabled={!isCurrentStepValid()}
              >
                {t('wizard.next')}
              </Button>
            ) : (
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={submitting}
                disabled={!isCurrentStepValid()}
              >
                {t('wizard.submit')}
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
};
