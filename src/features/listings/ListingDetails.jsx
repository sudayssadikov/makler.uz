import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getListingById, getSimilarActiveListings } from '../../services/listingsService';
import { createRequest } from '../../services/requestsService';
import { useAuthStore } from '../../store/authStore';
import { toast } from '../../store/toastStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Skeleton } from '../../components/ui/Skeleton';
import { ListingCard } from './ListingCard';
import {
  MapPin,
  Home,
  Maximize2,
  Calendar,
  ShieldCheck,
  Lock,
  Train,
  CheckCircle2,
  AlertTriangle,
  Send,
  ChevronLeft,
  Clock,
  Compass
} from 'lucide-react';
import './ListingDetails.css';

export const ListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, isAuthenticated, openLoginModal } = useAuthStore();

  const [listing, setListing] = useState(null);
  const [loadedId, setLoadedId] = useState(null);
  const loading = loadedId !== id;
  const [activePhoto, setActivePhoto] = useState(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestNote, setRequestNote] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [similarListings, setSimilarListings] = useState([]);
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    let active = true;
    getListingById(id).then((data) => {
      if (!active) return;
      setListing(data);
      if (data) {
        setActivePhoto(data.coverImage);
        if (['RESERVED', 'HANDED_OVER', 'RENTED', 'SOLD'].includes(data.status)) {
          getSimilarActiveListings(data.id, data.region).then(setSimilarListings);
        }
      }
      setLoadedId(id);
    });
    return () => { active = false; };
  }, [id]);

  // HOLD taymeri (24 soat)
  useEffect(() => {
    if (listing?.status !== 'HOLD' || !listing?.holdExpiresAt) return;
    const updateTimer = () => {
      const diff = new Date(listing.holdExpiresAt).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft('00:00:00');
        getListingById(id).then(setListing);
        return;
      }
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(
        `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
      );
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [listing?.status, listing?.holdExpiresAt, id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '40px 0' }}>
        <Skeleton height="400px" borderRadius="var(--radius-xl)" />
        <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
          <Skeleton height="250px" />
          <Skeleton height="250px" />
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '80px 0' }}>
        <h2>Eʼlon topilmadi</h2>
        <Button variant="primary" onClick={() => navigate('/search')} style={{ marginTop: 20 }}>
          Qidiruvga qaytish
        </Button>
      </div>
    );
  }

  // QOIDA 2: To'g'ridan-to'g'ri havola ochilsa "Bu uy band qilingan" sahifasi (o'xshash e'lonlar bilan)
  if (['RESERVED', 'HANDED_OVER', 'RENTED', 'SOLD'].includes(listing.status)) {
    return (
      <div className="container neo-details-page" style={{ paddingTop: 24, paddingBottom: 64 }}>
        <button className="neo-btn neo-back-btn" onClick={() => navigate(-1)} style={{ marginBottom: 24 }}>
          <ChevronLeft size={18} /> Ortga
        </button>

        <Card padding="lg" style={{ textAlign: 'center', padding: '48px 24px', marginBottom: 48 }}>
          <div
            style={{
              width: 68,
              height: 68,
              borderRadius: 'var(--radius-full)',
              background: 'rgba(255, 181, 71, 0.15)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16
            }}
          >
            <Lock size={32} color="var(--accent)" />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', marginBottom: 8 }}>
            Bu uy allaqachon band qilingan
          </h2>
          <p style={{ maxWidth: 560, margin: '0 auto 24px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            "{listing.title}" uyi boʻyicha $30 Escrow toʻlovi tasdiqlangan va rasmiy shartnoma jarayoni ketmoqda. Hozirda yangi zayavka qabul qilinmaydi.
          </p>
          <Button
            variant="primary"
            size="lg"
            icon={<Compass size={18} />}
            onClick={() => navigate('/search')}
          >
            Boshqa uylarni qidirish
          </Button>
        </Card>

        {similarListings.length > 0 && (
          <div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: 20 }}>
              Siz uchun oʻxshash boshqa faol eʼlonlar:
            </h3>
            <div className="makler-listings-grid">
              {similarListings.map((sim) => (
                <ListingCard key={sim.id} listing={sim} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  const handleOpenRequest = () => {
    if (!isAuthenticated) {
      toast.warning('Zayavka yuborish uchun avval tizimga kiring');
      openLoginModal();
      return;
    }
    setIsRequestModalOpen(true);
  };

  const handleSendRequest = async (e) => {
    e.preventDefault();
    setSubmittingRequest(true);
    try {
      await createRequest(listing.id, user.id, listing.ownerId, requestNote, selectedRoomId || null);
      toast.success(t('listing.request_sent'));
      setIsRequestModalOpen(false);
      navigate(`/requests`);
    } catch (err) {
      toast.error('Xatolik yuz berdi: ' + err.message);
    } finally {
      setSubmittingRequest(false);
    }
  };

  const isRent = listing.type === 'RENT';
  const isHold = listing.status === 'HOLD';

  return (
    <div className="container neo-details-page">
      {/* Back button */}
      <button className="neo-btn neo-back-btn" onClick={() => navigate(-1)}>
        <ChevronLeft size={18} /> Ortga
      </button>

      {/* QOIDA 1: HOLD alert banner with live countdown timer */}
      {isHold && (
        <div className="neo-hold-alert-banner animate-fade-in">
          <Clock size={22} color="var(--warning)" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text)' }}>
              Ushbu uy ayni paytda band qilinmoqda (Hold)
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: 2 }}>
              Mulk egasi zayavkani qabul qilgan. Toʻlov uchun berilgan 24 soatlik vaqt: <strong>{timeLeft || '23:59:59'}</strong>. Agar toʻlov qilinmasa, uy yana faol boʻladi.
            </div>
          </div>
        </div>
      )}

      {/* Main Hero Gallery */}
      <div className="neo-gallery-section">
        <div className="neo-main-photo-wrapper">
          <img src={activePhoto} alt={listing.title} className="neo-main-photo" />
          <div className="neo-gallery-badge-row">
            <Badge variant={isRent ? 'info' : 'accent'} size="md">
              {isRent ? t('listing.type_rent') : t('listing.type_sale')}
            </Badge>
            {listing.rentMode === 'ROOM' && (
              <Badge variant="warning" size="md">Xona-xona ijara</Badge>
            )}
            {isHold && (
              <Badge variant="warning" size="md">
                Band qilinmoqda ({timeLeft})
              </Badge>
            )}
          </div>
        </div>

        {/* Room photos thumbnails */}
        <div className="neo-photo-strip">
          <button
            type="button"
            className={`neo-thumb-btn ${activePhoto === listing.coverImage ? 'is-active' : ''}`}
            onClick={() => setActivePhoto(listing.coverImage)}
          >
            <img src={listing.coverImage} alt="Asosiy" />
          </button>
          {listing.roomsData?.map((room) =>
            room.photos?.map((ph, idx) => (
              <button
                key={`${room.id}-${idx}`}
                type="button"
                className={`neo-thumb-btn ${activePhoto === ph ? 'is-active' : ''}`}
                onClick={() => setActivePhoto(ph)}
              >
                <img src={ph} alt={room.name} />
              </button>
            ))
          )}
        </div>
      </div>

      {/* Details Grid: Left Content, Right Sticky Action Box */}
      <div className="neo-details-grid">
        {/* Left Column: Specs, Rooms breakdown, Drawbacks, Amenities */}
        <div className="neo-details-main">
          {/* Main title & Price */}
          <div className="neo-details-header">
            <div>
              <h1 className="neo-details-title">{listing.title}</h1>
              <div className="neo-details-address">
                <MapPin size={16} color="var(--primary)" />
                <span>{listing.address || listing.district}, {listing.region}</span>
                {listing.distanceToMetro && (
                  <span className="neo-details-metro">
                    <Train size={15} /> {listing.distanceToMetro}
                  </span>
                )}
              </div>
            </div>

            <div className="neo-details-price-box">
              <div className="neo-details-price">
                ${listing.price.toLocaleString()}
                {isRent && <span className="neo-price-sub">{t('listing.per_month')}</span>}
              </div>
              <Badge variant="success" size="sm">
                100% Shaffof
              </Badge>
            </div>
          </div>

          {/* Quick specs pill row */}
          <div className="neo-specs-pills-row">
            <div className="neo-spec-pill">
              <Home size={18} color="var(--primary)" />
              <div>
                <span className="spec-label">{t('listing.rooms')}</span>
                <strong>{listing.roomsCount} xona</strong>
              </div>
            </div>
            <div className="neo-spec-pill">
              <Maximize2 size={18} color="var(--primary)" />
              <div>
                <span className="spec-label">{t('listing.area')}</span>
                <strong>{listing.areaTotal} m²</strong>
              </div>
            </div>
            <div className="neo-spec-pill">
              <Calendar size={18} color="var(--primary)" />
              <div>
                <span className="spec-label">{t('listing.floor')}</span>
                <strong>{listing.floor} / {listing.totalFloors}</strong>
              </div>
            </div>
          </div>

          {/* Tavsif */}
          <Card padding="lg" style={{ marginTop: 24 }}>
            <h3 className="neo-section-heading">Tavsif va maʼlumot</h3>
            <p className="neo-details-desc">{listing.description}</p>
          </Card>

          {/* Xona-xona shaffof rasmlar & kamchiliklar */}
          <Card padding="lg" style={{ marginTop: 24 }}>
            <h3 className="neo-section-heading">{t('listing.room_photos')}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: 16 }}>
              Har bir xona alohida suratga olingan va kamchiliklari ochiq koʻrsatilgan:
            </p>

            <div className="neo-rooms-breakdown-list">
              {listing.roomsData?.map((room) => (
                <div key={room.id} className="neo-room-item-box">
                  <div className="neo-room-header">
                    <h4>{room.name}</h4>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      {room.price && (
                        <span className="neo-room-price">${room.price} / oy</span>
                      )}
                      {room.status === 'RESERVED' && (
                        <Badge variant="accent" size="sm">Band qilingan</Badge>
                      )}
                    </div>
                  </div>

                  {/* Room photos */}
                  <div className="neo-room-photos-grid">
                    {room.photos?.map((ph, idx) => (
                      <img
                        key={idx}
                        src={ph}
                        alt={`${room.name} ${idx + 1}`}
                        onClick={() => setActivePhoto(ph)}
                        className="neo-room-photo-thumb"
                      />
                    ))}
                  </div>

                  {/* Known drawback or note */}
                  {room.drawbacks && (
                    <div className="neo-room-drawback-alert">
                      <AlertTriangle size={18} />
                      <div>
                        <strong>Sharoit yoki kamchiliklar:</strong>
                        <p>{room.drawbacks}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Umumiy xonalar (Oshxona, hammom) */}
            {listing.commonAreas?.length > 0 && (
              <div style={{ marginTop: 24 }}>
                <h4 style={{ marginBottom: 12 }}>{t('listing.common_areas')}</h4>
                <div className="neo-common-areas-grid">
                  {listing.commonAreas.map((ca, idx) => (
                    <div key={idx} className="neo-common-card" onClick={() => setActivePhoto(ca.photo)}>
                      <img src={ca.photo} alt={ca.name} />
                      <div className="neo-common-info">
                        <strong>{ca.name}</strong>
                        <p>{ca.notes}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Qulayliklar & Uy qoidalari */}
          <Card padding="lg" style={{ marginTop: 24 }}>
            <h3 className="neo-section-heading">{t('listing.features')}</h3>
            <div className="neo-amenities-tags">
              {listing.amenities?.map((amenity, idx) => (
                <span key={idx} className="neo-amenity-tag">
                  <CheckCircle2 size={16} color="var(--primary)" />
                  <span>{amenity}</span>
                </span>
              ))}
            </div>

            {listing.rules?.length > 0 && (
              <div style={{ marginTop: 24 }}>
                <h4 style={{ marginBottom: 12 }}>{t('listing.rules')}</h4>
                <div className="neo-rules-tags">
                  {listing.rules.map((rule, idx) => (
                    <span key={idx} className="neo-rule-tag">
                      <AlertTriangle size={15} color="var(--warning)" />
                      <span>{rule}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right column: Action Sidebar */}
        <div className="neo-details-sidebar">
          {/* Landlord Card & Hidden Contacts */}
          <Card padding="lg" className="neo-owner-card">
            <h3 className="neo-section-heading">Mulk egasi</h3>

            <div className="neo-owner-profile">
              <Avatar
                src={listing.owner?.avatar}
                name={`${listing.owner?.firstName || ''} ${listing.owner?.lastName || ''}`.trim() || 'Egasi'}
                size="lg"
              />
              <div>
                <h4 className="neo-owner-name">{listing.owner?.firstName} {listing.owner?.lastName}</h4>
                <Badge variant="success" size="sm" icon={<ShieldCheck size={13} />}>
                  JSHSHIR Tasdiqlangan
                </Badge>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  Reyting: ★ {listing.owner?.rating || 4.9} ({listing.owner?.dealsCount || 4} ta bitim)
                </div>
              </div>
            </div>

            {/* Hidden Contacts Security Notice */}
            <div className="neo-hidden-contacts-box">
              <Lock size={20} color="var(--warning)" />
              <div>
                <strong>{t('listing.hidden_contacts')}</strong>
                <p>
                  {t('listing.hidden_contacts_desc')}
                </p>
              </div>
            </div>

            {/* Send Request Button (Disabled if HOLD) */}
            <Button
              variant={isHold ? 'default' : 'primary'}
              size="lg"
              className="neo-action-full-btn"
              icon={<Send size={18} />}
              onClick={handleOpenRequest}
              disabled={isHold}
            >
              {isHold ? `Band qilinmoqda (${timeLeft})` : t('listing.send_request')}
            </Button>
            {isHold && (
              <p style={{ fontSize: '0.78rem', color: 'var(--warning)', textAlign: 'center', marginTop: 8 }}>
                Boshqa foydalanuvchi toʻlov qilishi kutilmoqda
              </p>
            )}
          </Card>

          {/* Lease Terms Summary Card */}
          {isRent && (
            <Card padding="lg" style={{ marginTop: 24 }}>
              <h3 className="neo-section-heading">{t('listing.payment_term')}</h3>
              <div className="neo-terms-list">
                <div className="neo-term-row">
                  <span>Toʻlov sharti:</span>
                  <strong>{listing.paymentTerm === 'POSTPAY' ? 'Oy oxirida' : 'Oylik oldindan'}</strong>
                </div>
                {listing.paymentTerm === 'POSTPAY' && (
                  <div className="neo-term-row">
                    <span>Zalog summasi:</span>
                    <strong>${listing.deposit} (majburiy)</strong>
                  </div>
                )}
                <div className="neo-term-row">
                  <span>Minimal muddat:</span>
                  <strong>{listing.minRentPeriodMonths || 3} oy</strong>
                </div>
                <div className="neo-term-row">
                  <span>Elektron shartnoma:</span>
                  <strong style={{ color: 'var(--success)' }}>100% Rasmiy (SMS OTP)</strong>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Request Modal */}
      <Modal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        title={t('listing.send_request')}
      >
        <form onSubmit={handleSendRequest} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Eʼlon egasiga zayavka yuboring. Egasi koʻrib chiqib rozi boʻlgach, 30$ Escrow toʻlov oynasi ochiladi va kontaktlar almashiniladi.
          </p>

          {listing.rentMode === 'ROOM' && listing.roomsData?.length > 0 && (
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: 6, display: 'block' }}>
                Qaysi xona uchun zayavka bermoqchisiz?
              </label>
              <select
                value={selectedRoomId}
                onChange={(e) => setSelectedRoomId(e.target.value)}
                style={{
                  width: '100%',
                  height: 44,
                  padding: '0 12px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)'
                }}
              >
                <option value="">Barcha xonalar / butun uy</option>
                {listing.roomsData.map((r) => (
                  <option key={r.id} value={r.id} disabled={r.status === 'RESERVED'}>
                    {r.name} - ${r.price || listing.price} {r.status === 'RESERVED' ? '(Band)' : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          <Input
            label="Qoʻshimcha xabar yoki talablar (ixtiyoriy)"
            value={requestNote}
            onChange={(e) => setRequestNote(e.target.value)}
            placeholder="Masalan: 15-apreldan boshlab koʻchib kirmoqchimiz, 2 kishimiz..."
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 10 }}>
            <Button variant="default" onClick={() => setIsRequestModalOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" variant="primary" loading={submittingRequest}>
              Zayavkani yuborish
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
