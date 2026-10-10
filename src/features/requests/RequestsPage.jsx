import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { PaymentModal } from '../payments/PaymentModal';
import { getRequests, transitionRequestStatus, checkExpiredPayments } from '../../services/requestsService';
import { generateContractFromRequest } from '../../services/contractsService';
import { useAuthStore } from '../../store/authStore';
import { toast } from '../../store/toastStore';
import { REQUEST_STATUS, STATUS_LABELS } from '../../constants/requestStatus';
import {
  Clock,
  CheckCircle2,
  XCircle,
  CreditCard,
  FileText,
  Lock,
  Unlock,
  User,
  Phone
} from 'lucide-react';
import './RequestsPage.css';

export const RequestsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequestForPay, setSelectedRequestForPay] = useState(null);

  // Zayavkalarni yuklash. Handlers (tugmalar) uchun ham, sahifa ochilgandagi
  // effect uchun ham bir xil manba — lekin har bir chaqiruvchi natijani o'z
  // holatiga o'zi yozadi (effect ichida setState chaqirilishi qoidaga xilof).
  const loadRequests = useCallback(async () => {
    // 48 soatlik kafolat: muddati o'tgan to'lovlar avval avtomatik bekor qilinadi
    const expired = await checkExpiredPayments();
    // Faqat joriy foydalanuvchiga tegishli zayavkalar (maxfiylik)
    const data = await getRequests(user?.id);
    return { expiredCount: expired.length, data };
  }, [user?.id]);

  const applyRequests = useCallback((loaded) => {
    if (loaded.expiredCount > 0) {
      toast.warning(t('request_flow.expired_auto_cancelled', { count: loaded.expiredCount }));
    }
    setRequests(loaded.data);
    setLoading(false);
  }, [t]);

  useEffect(() => {
    let active = true;
    loadRequests().then((loaded) => {
      if (active) applyRequests(loaded);
    });
    return () => { active = false; };
  }, [loadRequests, applyRequests]);

  const reloadRequests = useCallback(async () => {
    applyRequests(await loadRequests());
  }, [loadRequests, applyRequests]);

  // Ega zayavkani qabul qilishi
  const handleAccept = async (reqId) => {
    try {
      await transitionRequestStatus(reqId, REQUEST_STATUS.ACCEPTED, 'Egasi zayavkani qabul qildi. Toʻlov ochildi');
      toast.success('Zayavka qabul qilindi. Qidiruvchiga toʻlov ochildi.');
      reloadRequests();
    } catch (err) {
      toast.error('Xatolik: ' + err.message);
    }
  };

  // Ega zayavkani rad qilishi
  const handleReject = async (reqId) => {
    try {
      await transitionRequestStatus(reqId, REQUEST_STATUS.REJECTED, 'Egasi zayavkani rad etdi');
      toast.info('Zayavka rad etildi.');
      reloadRequests();
    } catch (err) {
      toast.error('Xatolik: ' + err.message);
    }
  };

  // SUBMITTED holatdagi zayavkani foydalanuvchi bekor qilishi
  const handleCancel = async (reqId) => {
    try {
      await transitionRequestStatus(reqId, REQUEST_STATUS.CANCELLED, 'Foydalanuvchi tomonidan bekor qilindi');
      toast.info(t('request_flow.cancelled'));
      reloadRequests();
    } catch (err) {
      toast.error('Xatolik: ' + err.message);
    }
  };

  // Nizo ochish
  const handleDispute = async (reqId) => {
    try {
      await transitionRequestStatus(reqId, REQUEST_STATUS.DISPUTED, 'Foydalanuvchi tomonidan arbitraj nizosi ochildi');
      toast.warning('Nizo ochildi! Admin koʻrib chiqadi.');
      reloadRequests();
    } catch (err) {
      toast.error('Xatolik: ' + err.message);
    }
  };

  // Shartnoma tuzishga o'tish
  const handleCreateContract = async (req) => {
    try {
      const contract = await generateContractFromRequest(req);
      toast.success('Shartnoma loyihasi tayyorlandi!');
      navigate(`/contracts/${contract.id}`);
    } catch (err) {
      toast.error('Xatolik: ' + err.message);
    }
  };

  return (
    <div className="container neo-requests-page">
      <div className="neo-requests-header">
        <h1 className="neo-requests-title">{t('request_flow.title')}</h1>
        <p className="neo-requests-subtitle">
          Barcha zayavkalar, 30$ Escrow toʻlovlari va shartnomalar holati yagona xavfsiz tizimda.
        </p>
      </div>

      {loading ? (
        <div>Yuklanmoqda...</div>
      ) : requests.length === 0 ? (
        <Card padding="lg" style={{ textAlign: 'center', marginTop: 20 }}>
          <h3>Hozircha faol zayavkalar yoʻq</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>
            Uylarni qidirib, oʻzingizga yoqqan variantga zayavka yuboring.
          </p>
          <Button variant="primary" onClick={() => navigate('/search')} style={{ marginTop: 16 }}>
            Uylarni qidirish
          </Button>
        </Card>
      ) : (
        <div className="neo-requests-list">
          {requests.map((req) => {
            const statusConfig = STATUS_LABELS[req.status] || { uz: req.status, color: 'neutral' };
            const isPaid = req.status !== REQUEST_STATUS.SUBMITTED && req.status !== REQUEST_STATUS.PAYMENT_PENDING && req.status !== REQUEST_STATUS.REJECTED;

            return (
              <Card key={req.id} padding="lg" className="neo-request-card">
                {/* Header row: ID, Status, Listing Title */}
                <div className="neo-req-top">
                  <div>
                    <span className="neo-req-id">Zayavka #{req.id}</span>
                    <h3 className="neo-req-listing-title">{req.listing?.title || 'Koʻchmas mulk eʼloni'}</h3>
                  </div>
                  <Badge variant={statusConfig.color} size="md">
                    {statusConfig.uz}
                  </Badge>
                </div>

                {/* 48-Hour Guarantee Timer Banner (Agar to'langan bo'lsa yoki to'lov kutilayotgan bo'lsa) */}
                {(req.status === REQUEST_STATUS.PAYMENT_PENDING || req.status === REQUEST_STATUS.PAID_ESCROW) && (
                  <div className="neo-timer-banner">
                    <Clock size={18} color="var(--warning)" />
                    <div>
                      <strong>{t('request_flow.timer_48h')} 41 soat 35 daqiqa qoldi</strong>
                      <p>{t('request_flow.timer_desc')}</p>
                    </div>
                  </div>
                )}

                {/* Details Grid: Parties, Contacts & Escrow Info */}
                <div className="neo-req-details-grid">
                  {/* Parties & Contacts */}
                  <div className="neo-req-box">
                    <h4>Tomonlar maʼlumotlari</h4>
                    <div className="neo-req-user-row">
                      <User size={16} />
                      <span>Qidiruvchi: <strong>{req.tenant?.firstName} {req.tenant?.lastName}</strong></span>
                    </div>
                    <div className="neo-req-user-row">
                      <User size={16} />
                      <span>Mulkiy ega: <strong>{req.owner?.firstName} {req.owner?.lastName}</strong></span>
                    </div>

                    {/* Contacts: HIDDEN before payment & admin confirmation, REVEALED after */}
                    <div className="neo-contacts-reveal-area">
                      {isPaid ? (
                        <div className="neo-contacts-revealed">
                          <Unlock size={16} color="var(--success)" />
                          <div>
                            <span style={{ color: 'var(--success)', fontWeight: 700 }}>Kontaktlar ochiq:</span>
                            <p><Phone size={13} /> {req.owner?.phone || '+998 93 111 22 33'}</p>
                            <small>JSHSHIR: {req.owner?.pinfl || '32508924560098'}</small>
                          </div>
                        </div>
                      ) : (
                        <div className="neo-contacts-locked">
                          <Lock size={16} color="var(--text-muted)" />
                          <span>Kontaktlar yashirin (Toʻlovdan soʻng ochiladi)</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Financial & Escrow status */}
                  <div className="neo-req-box">
                    <h4>Moliyaviy holat</h4>
                    <div className="neo-financial-line">
                      <span>Mulk oylik narxi:</span>
                      <strong>${req.listing?.price} / oy</strong>
                    </div>
                    <div className="neo-financial-line">
                      <span>Xizmat haqi (Escrow):</span>
                      <strong style={{ color: req.escrowAmount > 0 ? 'var(--primary)' : 'var(--text-muted)' }}>
                        ${req.escrowAmount || 30} {req.escrowAmount > 0 ? '(Muzlatilgan)' : '(Kutilmoqda)'}
                      </strong>
                    </div>
                    {req.paymentTransactionId && (
                      <div className="neo-financial-line">
                        <span>Tranzaksiya:</span>
                        <small>{req.paymentTransactionId} ({req.paymentProvider?.toUpperCase()})</small>
                      </div>
                    )}
                  </div>
                </div>

                {/* Timeline History */}
                <div className="neo-timeline-box">
                  <h4 style={{ marginBottom: 12 }}>Jarayon xronologiyasi (Timeline)</h4>
                  <div className="neo-timeline-list">
                    {req.history?.map((h, hIdx) => (
                      <div key={hIdx} className="neo-timeline-item">
                        <div className="neo-timeline-dot" />
                        <div className="neo-timeline-content">
                          <strong>{h.note || h.status}</strong>
                          <small>{new Date(h.timestamp).toLocaleString('uz-UZ')}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons based on status machine */}
                <div className="neo-req-actions">
                  {/* Agar SUBMITTED bo'lsa: Ega qabul qilishi yoki rad etishi mumkin,
                      Qidiruvchi esa hali to'lov qilinmagani uchun bekor qilishi mumkin */}
                  {req.status === REQUEST_STATUS.SUBMITTED && (
                    <>
                      <Button variant="primary" icon={<CheckCircle2 size={16} />} onClick={() => handleAccept(req.id)}>
                        {t('request_flow.accept_btn')}
                      </Button>
                      <Button variant="default" icon={<XCircle size={16} />} onClick={() => handleCancel(req.id)}>
                        {t('request_flow.cancel_btn')}
                      </Button>
                      <Button variant="danger" icon={<XCircle size={16} />} onClick={() => handleReject(req.id)}>
                        {t('request_flow.reject_btn')}
                      </Button>
                    </>
                  )}

                  {/* Agar PAYMENT_PENDING bo'lsa: Qidiruvchi 30$ to'lashi mumkin */}
                  {req.status === REQUEST_STATUS.PAYMENT_PENDING && (
                    <Button
                      variant="primary"
                      icon={<CreditCard size={16} />}
                      onClick={() => setSelectedRequestForPay(req)}
                    >
                      {t('request_flow.pay_30_btn')}
                    </Button>
                  )}

                  {/* Agar PAID_ESCROW yoki ADMIN_REVIEW bo'lsa: Shartnoma tuzishga o'tish */}
                  {(req.status === REQUEST_STATUS.PAID_ESCROW || req.status === REQUEST_STATUS.ADMIN_REVIEW) && (
                    <Button
                      variant="primary"
                      icon={<FileText size={16} />}
                      onClick={() => handleCreateContract(req)}
                    >
                      Elektron shartnoma tuzish
                    </Button>
                  )}

                  {/* Agar shartnoma tuzilayotgan bo'lsa */}
                  {req.status === REQUEST_STATUS.CONTRACT_DRAFTING && (
                    <Button
                      variant="primary"
                      icon={<FileText size={16} />}
                      onClick={() => navigate('/contracts')}
                    >
                      Shartnomani koʻrish va imzolash
                    </Button>
                  )}

                  {/* Nizo ochish yoki bekor qilish */}
                  {req.status !== REQUEST_STATUS.COMPLETED && req.status !== REQUEST_STATUS.CANCELLED && req.status !== REQUEST_STATUS.REJECTED && (
                    <Button variant="default" size="sm" onClick={() => handleDispute(req.id)}>
                      {t('request_flow.dispute_btn')}
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* 30$ Escrow Payment Modal */}
      {selectedRequestForPay && (
        <PaymentModal
          isOpen={!!selectedRequestForPay}
          onClose={() => setSelectedRequestForPay(null)}
          request={selectedRequestForPay}
          onSuccess={fetchRequests}
        />
      )}
    </div>
  );
};
