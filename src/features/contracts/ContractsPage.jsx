import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { getContractById, signContractWithOtp, addInventoryItem, confirmMoveIn } from '../../services/contractsService';
import { getFromStorage, STORAGE_KEYS } from '../../services/storage';
import { toast } from '../../store/toastStore';
import jsPDF from 'jspdf';
import {
  ShieldCheck,
  CheckCircle,
  Download,
  AlertTriangle,
  Plus,
  KeyRound,
  ArrowRight
} from 'lucide-react';
import './ContractsPage.css';

export const ContractsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // Storage'dan o'qish render vaqtidagi boshlang'ich holat — effect ichida
  // setState zanjiri kerak emas (sahifa har ochilishda qayta mount bo'ladi).
  const [contracts] = useState(() => getFromStorage(STORAGE_KEYS.CONTRACTS, []));

  return (
    <div className="container neo-contracts-page">
      <div className="neo-contracts-header">
        <h1 className="neo-contracts-title">{t('contract.title')}</h1>
        <p className="neo-contracts-subtitle">
          Qonuniy elektron ijara shartnomalari, SMS-imzo va uy holati inventar akti.
        </p>
      </div>

      <div className="neo-contracts-list">
        {contracts.map((c) => (
          <Card key={c.id} padding="lg" className="neo-contract-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className="neo-contract-id">Shartnoma #{c.id}</span>
                <h3 style={{ marginTop: 4 }}>{c.propertyAddress}</h3>
              </div>
              <Badge variant={c.status === 'SIGNED' ? 'success' : 'warning'} size="md">
                {c.status === 'SIGNED' ? 'Imzolangan' : 'Loyiha holatida'}
              </Badge>
            </div>

            <div className="neo-contract-meta-grid">
              <div>
                <small style={{ color: 'var(--text-muted)' }}>Ijaraga beruvchi:</small>
                <div><strong>{c.landlordName}</strong> (JSHSHIR: {c.landlordPinfl})</div>
              </div>
              <div>
                <small style={{ color: 'var(--text-muted)' }}>Ijarachi:</small>
                <div><strong>{c.tenantName}</strong> (JSHSHIR: {c.tenantPinfl})</div>
              </div>
              <div>
                <small style={{ color: 'var(--text-muted)' }}>Oylik toʻlov:</small>
                <div><strong>${c.monthlyPrice} / oy</strong></div>
              </div>
              <div>
                <small style={{ color: 'var(--text-muted)' }}>Zalog (Depozit):</small>
                <div><strong style={{ color: 'var(--warning)' }}>${c.depositAmount}</strong></div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, borderTop: '1px solid var(--border-subtle)', paddingTop: 14 }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                {c.landlordSigned && c.tenantSigned ? (
                  <span style={{ color: 'var(--success)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <CheckCircle size={14} /> Ikki tomonlama SMS orqali tasdiqlangan
                  </span>
                ) : (
                  <span>Imzolash kutilmoqda</span>
                )}
              </div>

              <Button
                variant="primary"
                icon={<ArrowRight size={16} />}
                onClick={() => navigate(`/contracts/${c.id}`)}
              >
                Shartnomani koʻrish va imzolash
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export const ContractDetailsPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();

  // Qaysi id uchun shartnoma yuklangani holatda saqlanadi — loading holati
  // renderda kelib chiqadi (effect ichida setLoading(true) zanjiri yo'q).
  const [loaded, setLoaded] = useState({ loadedId: null, contract: null });
  const contract = loaded.loadedId === id ? loaded.contract : null;
  const loading = loaded.loadedId !== id;
  const [signModalOpen, setSignModalOpen] = useState(false);
  const [signParty, setSignParty] = useState('tenant');
  const [smsOtp, setSmsOtp] = useState('778899');
  const [signing, setSigning] = useState(false);

  // Inventar qo'shish modal
  const [invModalOpen, setInvModalOpen] = useState(false);
  const [invItem, setInvItem] = useState('');
  const [invCondition, setInvCondition] = useState('');

  const loadContract = useCallback(async () => {
    return getContractById(id);
  }, [id]);

  const applyContract = useCallback((data) => {
    setLoaded({ loadedId: id, contract: data });
  }, [id]);

  useEffect(() => {
    let active = true;
    loadContract().then((data) => {
      if (active) applyContract(data);
    });
    return () => { active = false; };
  }, [loadContract, applyContract]);

  const reloadContract = useCallback(async () => {
    applyContract(await loadContract());
  }, [loadContract, applyContract]);

  if (loading || !contract) return <div className="container">Yuklanmoqda...</div>;

  const handleOpenSign = (party) => {
    setSignParty(party);
    setSignModalOpen(true);
  };

  const handleConfirmSign = async (e) => {
    e.preventDefault();
    setSigning(true);
    try {
      await signContractWithOtp(contract.id, signParty, smsOtp);
      toast.success('Elektron imzo muvaffaqiyatli qoʻyildi!');
      setSignModalOpen(false);
      reloadContract();
    } catch (err) {
      toast.error('Xatolik: ' + err.message);
    } finally {
      setSigning(false);
    }
  };

  const handleAddInventory = async (e) => {
    e.preventDefault();
    if (!invItem) return;
    try {
      await addInventoryItem(contract.id, {
        item: invItem,
        condition: invCondition || 'Yaxshi holatda',
        photo: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80'
      });
      toast.success('Inventar aktiga yangi element qoʻshildi');
      setInvModalOpen(false);
      reloadContract();
    } catch (err) {
      toast.error('Xatolik: ' + err.message);
    }
  };

  const handleConfirmMoveIn = async () => {
    try {
      await confirmMoveIn(contract.id);
      toast.success('Koʻchib kirish va inventar akti tasdiqlandi!');
      reloadContract();
    } catch (err) {
      toast.error('Xatolik: ' + err.message);
    }
  };

  // PDF yuklab olish
  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('ELEKTRON IJARA SHARTNOMASI', 20, 20);
    doc.setFontSize(11);
    doc.text(`Shartnoma raqami: #${contract.id}`, 20, 30);
    doc.text(`Sana: ${new Date(contract.createdAt).toLocaleDateString()}`, 20, 38);
    doc.text('------------------------------------------------------------', 20, 44);

    doc.text(`1. TOMONLAR:`, 20, 52);
    doc.text(`Ijaraga beruvchi: ${contract.landlordName} (JSHSHIR: ${contract.landlordPinfl})`, 25, 60);
    doc.text(`Ijarachi: ${contract.tenantName} (JSHSHIR: ${contract.tenantPinfl})`, 25, 68);

    doc.text(`2. MULK MANZILI:`, 20, 78);
    doc.text(`${contract.propertyAddress}`, 25, 86);

    doc.text(`3. MOLIYAVIY SHARTLAR:`, 20, 96);
    doc.text(`Oylik ijara to'lovi: $${contract.monthlyPrice} USD`, 25, 104);
    doc.text(`Xavfsizlik depoziti (Zalog): $${contract.depositAmount} USD`, 25, 112);
    if (contract.isPostPayDepositRequired) {
      doc.text(`Maxsus band: To'lov oy oxirida bo'lgani sababli, 1 oylik depozit majburiydir.`, 25, 120);
    }
    doc.text(`Minimal ijara muddati: ${contract.minRentalMonths} oy`, 25, 128);
    doc.text(`Muddatidan oldin chiqish jarimasi: ${contract.penaltyEarlyExit}`, 25, 136);

    doc.text(`4. ELEKTRON IMZOLAR:`, 20, 150);
    doc.text(`Ijaraga beruvchi: ${contract.landlordSigned ? 'IMZOLANGAN (SMS OTP orqali)' : 'Imzolanmagan'}`, 25, 158);
    doc.text(`Ijarachi: ${contract.tenantSigned ? 'IMZOLANGAN (SMS OTP orqali)' : 'Imzolanmagan'}`, 25, 166);

    doc.save(`shartnoma_${contract.id}.pdf`);
    toast.success('PDF shartnoma yuklab olindi!');
  };

  return (
    <div className="container neo-contract-details-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2>Rasmiy Elektron Ijara Shartnomasi #{contract.id}</h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Oʻzbekiston Respublikasi Fuqarolik Kodeksiga muvofiq tuzilgan
          </span>
        </div>

        <Button variant="default" icon={<Download size={16} />} onClick={handleDownloadPdf}>
          {t('contract.download_pdf')}
        </Button>
      </div>

      <div className="neo-contract-paper-view">
        <Card padding="lg" className="neo-contract-paper">
          {/* 1. Tomonlar */}
          <div className="neo-contract-section">
            <h3>1. Shartnoma Tomonlari</h3>
            <div className="neo-parties-grid">
              <div className="neo-party-card">
                <span className="neo-party-label">Ijaraga beruvchi (Landlord):</span>
                <h4>{contract.landlordName}</h4>
                <div className="neo-pinfl-badge">
                  <ShieldCheck size={14} /> JSHSHIR: {contract.landlordPinfl}
                </div>
                <div style={{ marginTop: 12 }}>
                  {contract.landlordSigned ? (
                    <Badge variant="success" size="sm" icon={<CheckCircle size={13} />}>
                      SMS orqali imzolangan ({new Date(contract.landlordSignedAt).toLocaleDateString()})
                    </Badge>
                  ) : (
                    <Button variant="primary" size="sm" onClick={() => handleOpenSign('landlord')}>
                      Ega sifatida imzolash
                    </Button>
                  )}
                </div>
              </div>

              <div className="neo-party-card">
                <span className="neo-party-label">Ijarachi (Tenant):</span>
                <h4>{contract.tenantName}</h4>
                <div className="neo-pinfl-badge">
                  <ShieldCheck size={14} /> JSHSHIR: {contract.tenantPinfl}
                </div>
                <div style={{ marginTop: 12 }}>
                  {contract.tenantSigned ? (
                    <Badge variant="success" size="sm" icon={<CheckCircle size={13} />}>
                      SMS orqali imzolangan ({new Date(contract.tenantSignedAt).toLocaleDateString()})
                    </Badge>
                  ) : (
                    <Button variant="primary" size="sm" onClick={() => handleOpenSign('tenant')}>
                      Ijarachi sifatida imzolash
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 2. Predmet va Manzil */}
          <div className="neo-contract-section" style={{ marginTop: 24 }}>
            <h3>2. Shartnoma Predmeti va Manzil</h3>
            <p>Ijaraga beruvchi quyidagi manzildagi mulkni ijarachiga vaqtincha foydalanishga topshiradi:</p>
            <div className="neo-address-box">
              <strong>{contract.propertyAddress}</strong>
            </div>
          </div>

          {/* 3. Moliyaviy majburiyatlar & Zalog bandi */}
          <div className="neo-contract-section" style={{ marginTop: 24 }}>
            <h3>3. Toʻlov tartibi va Zalog (Depozit) bandi</h3>
            <div className="neo-terms-table">
              <div className="neo-terms-table-row">
                <span>Oylik ijara toʻlovi:</span>
                <strong>${contract.monthlyPrice} USD</strong>
              </div>
              <div className="neo-terms-table-row">
                <span>Xavfsizlik depoziti (Zalog):</span>
                <strong style={{ color: 'var(--warning)' }}>${contract.depositAmount} USD</strong>
              </div>
              <div className="neo-terms-table-row">
                <span>Minimal ijara muddati:</span>
                <strong>{contract.minRentalMonths} oy</strong>
              </div>
              <div className="neo-terms-table-row">
                <span>Muddatidan oldin chiqish jarimasi:</span>
                <strong>{contract.penaltyEarlyExit}</strong>
              </div>
            </div>

            {/* Alohida maxsus depozit bandi */}
            {contract.isPostPayDepositRequired && (
              <div className="neo-deposit-clause-highlight">
                <AlertTriangle size={20} color="var(--warning)" style={{ flexShrink: 0 }} />
                <div>
                  <strong>MAJBURIY BAND: OY OXIRIDA TOʻLOV VA ZALOG TALABI</strong>
                  <p>
                    Ushbu shartnomaga asosan ijara toʻlovi har oyning oxirida toʻlanadi. Shu munosabat bilan,
                    ijarachi kamida 1 oylik ijara summasi miqdorida ($ {contract.depositAmount}) depozit (zalog)
                    qoʻyishga majburdir. Mazkur zalog ijarachi uydan chiqqanda, mulk holati tekshirilib toʻliq qaytariladi.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 4. Uy holati akti (Inventar) */}
          <div className="neo-contract-section" style={{ marginTop: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3>4. Uy holati akti (Inventarizatsiya)</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {t('contract.inventory_desc')}
                </p>
              </div>
              <Button variant="default" size="sm" icon={<Plus size={15} />} onClick={() => setInvModalOpen(true)}>
                Inventar qoʻshish
              </Button>
            </div>

            <div className="neo-inventory-grid">
              {contract.inventoryAct?.map((inv, idx) => (
                <div key={idx} className="neo-inventory-card">
                  <img src={inv.photo} alt={inv.item} />
                  <div className="neo-inventory-info">
                    <strong>{inv.item}</strong>
                    <p>Holati: {inv.condition}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Move-in confirmation button */}
            {!contract.moveInConfirmed && (
              <div style={{ marginTop: 18, textAlign: 'center' }}>
                <Button variant="primary" onClick={handleConfirmMoveIn}>
                  Uy holatini koʻrib chiqdim — Koʻchib kirishni tasdiqlash
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* SMS OTP elektron imzo modali */}
      <Modal
        isOpen={signModalOpen}
        onClose={() => setSignModalOpen(false)}
        title={t('contract.sign_with_sms')}
        maxWidth="460px"
      >
        <form onSubmit={handleConfirmSign} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ padding: 12, background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: 'var(--radius-md)', fontSize: '0.86rem' }}>
            <KeyRound size={18} style={{ display: 'inline', marginRight: 6 }} />
            Telefoningizga SMS tasdiqlash kodi yuborildi: <strong>{smsOtp}</strong>
          </div>

          <Input
            label={t('contract.otp_placeholder')}
            value={smsOtp}
            onChange={(e) => setSmsOtp(e.target.value)}
            placeholder="6 xonali SMS kod"
            maxLength={6}
            required
            autoFocus
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 10 }}>
            <Button variant="default" onClick={() => setSignModalOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" variant="primary" loading={signing}>
              {t('contract.sign_btn')}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Inventar qo'shish modali */}
      <Modal
        isOpen={invModalOpen}
        onClose={() => setInvModalOpen(false)}
        title="Yangi jihoz / mebel inventariga qoʻshish"
      >
        <form onSubmit={handleAddInventory} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input
            label="Jihoz yoki mebel nomi"
            value={invItem}
            onChange={(e) => setInvItem(e.target.value)}
            placeholder="Masalan: LG Smart TV 55 dyuym"
            required
          />

          <Input
            label="Holati va kamchiliklari"
            value={invCondition}
            onChange={(e) => setInvCondition(e.target.value)}
            placeholder="Masalan: Tirnalgan joyi yoʻq, pulti bor"
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <Button variant="default" onClick={() => setInvModalOpen(false)}>
              Bekor qilish
            </Button>
            <Button type="submit" variant="primary">
              Qoʻshish
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
