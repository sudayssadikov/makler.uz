import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getListingById } from '../../services/listingsService';
import { createRequest } from '../../services/requestsService';
import { useAuthStore } from '../../store/authStore';
import { toast } from '../../store/toastStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Skeleton } from '../../components/ui/Skeleton';
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
  ChevronLeft
} from 'lucide-react';
import './ListingDetails.css';

export const ListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, isAuthenticated, openLoginModal } = useAuthStore();

  const [listing, setListing] = useState(null);
  const [loadedId, setLoadedId] = useState(null);
  // loading holati renderda kelib chiqadi — effect ichida setLoading(true)
  // zanjiri kerak emas (id o'zgarganda avtomatik true bo'ladi).
  const loading = loadedId !== id;
  const [activePhoto, setActivePhoto] = useState(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestNote, setRequestNote] = useState('');
  const [submittingRequest, setSubmittingRequest] = useState(false);

  useEffect(() => {
    let active = true;
    getListingById(id).then((data) => {
      if (!active) return;
      setListing(data);
      if (data) setActivePhoto(data.coverImage);
      setLoadedId(id);
    });
    return () => { active = false; };
  }, [id]);

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
      await createRequest(listing.id, user.id, listing.ownerId, requestNote);
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

  return (
    <div className="container neo-details-page">
      {/* Back button */}
      <button className="neo-btn neo-back-btn" onClick={() => navigate(-1)}>
        <ChevronLeft size={18} /> Ortga
      </button>

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
          </div>
        </div>

        {/* Room photos thumbnails */}
        <div className="neo-photo-strip">
          <button
            type="button"
            className={`neo-thumb-btn ${activePhoto === listing.coverImage ? 'is-active' : ''}`}
            onClick={() => setActivePhoto(listing.coverImage)}
          >
            <img src={listing.coverImage} alt="Cover" />
          </button>

          {listing.roomsData?.map((room, rIdx) =>
            room.photos?.map((photo, pIdx) => (
              <button
                key={`${rIdx}-${pIdx}`}
                type="button"
                className={`neo-thumb-btn ${activePhoto === photo ? 'is-active' : ''}`}
                onClick={() => setActivePhoto(photo)}
                title={`${room.name} (${pIdx + 1}-rasm)`}
              >
                <img src={photo} alt={room.name} />
              </button>
            ))
          )}

          {listing.commonAreas?.map((area, aIdx) => (
            <button
              key={`common-${aIdx}`}
              type="button"
              className={`neo-thumb-btn ${activePhoto === area.photo ? 'is-active' : ''}`}
              onClick={() => setActivePhoto(area.photo)}
              title={area.name}
            >
              <img src={area.photo} alt={area.name} />
            </button>
          ))}
        </div>
      </div>

      {/* Two columns layout: Content & Sidebar */}
      <div className="neo-details-grid">
        {/* Left column: Information */}
        <div className="neo-details-main">
          {/* Title and price card */}
          <Card padding="lg">
            <div className="neo-details-header">
              <div>
                <h1 className="neo-details-title">{listing.title}</h1>
                <div className="neo-details-address">
                  <MapPin size={16} />
                  <span>{listing.address}</span>
                  {listing.distanceToMetro && (
                    <span className="neo-details-metro">
                      <Train size={15} /> {listing.distanceToMetro}
                    </span>
                  )}
                </div>
              </div>

              <div className="neo-details-pricing">
                <div className="neo-details-price">
                  ${listing.price.toLocaleString()}
                  {isRent && <span className="neo-details-unit">{t('listing.per_month')}</span>}
                </div>
                {listing.paymentTerm === 'POSTPAY' && (
                  <div className="neo-details-postpay-note">
                    Oy oxirida toʻlov | Depozit (Zalog): ${listing.deposit}
                  </div>
                )}
              </div>
            </div>

            {/* Core specs pills */}
            <div className="neo-specs-pills">
              <div className="neo-spec-pill">
                <Home size={18} />
                <div>
                  <small>Xonalar</small>
                  <strong>{listing.roomsCount} xona</strong>
                </div>
              </div>
              <div className="neo-spec-pill">
                <Maximize2 size={18} />
                <div>
                  <small>Maydoni</small>
                  <strong>{listing.areaTotal} m²</strong>
                </div>
              </div>
              <div className="neo-spec-pill">
                <Calendar size={18} />
                <div>
                  <small>Qavat</small>
                  <strong>{listing.floor} / {listing.totalFloors}</strong>
                </div>
              </div>
            </div>
          </Card>

          {/* Description */}
          <Card padding="lg" style={{ marginTop: 24 }}>
            <h3 className="neo-section-heading">Batafsil maʼlumot</h3>
            <p className="neo-desc-text">{listing.description}</p>
          </Card>

          {/* Xona-xona rasmlar va har bir xonaning kamchiliklari/sharoitlari */}
          <Card padding="lg" style={{ marginTop: 24 }}>
            <h3 className="neo-section-heading">{t('listing.room_photos')}</h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
              Shaffoflik kafolati: Har bir xonaning alohida kamida 3 ta rasmi va ochiq-oydin kamchiliklari
            </p>

            <div className="neo-rooms-breakdown">
              {listing.roomsData?.map((room, idx) => (
                <div key={idx} className="neo-room-block">
                  <div className="neo-room-header">
                    <h4>{room.name} ({room.area} m²)</h4>
                    {room.price > 0 && <span className="neo-room-price">${room.price} / oy</span>}
                  </div>

                  {/* Room Photos */}
                  <div className="neo-room-mini-gallery">
                    {room.photos?.map((p, pIdx) => (
                      <img
                        key={pIdx}
                        src={p}
                        alt={`${room.name} ${pIdx + 1}`}
                        className="neo-room-thumb"
                        onClick={() => setActivePhoto(p)}
                      />
                    ))}
                  </div>

                  {/* Room Drawbacks / Conditions */}
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
              <img
                src={listing.owner?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80'}
                alt="Egasi"
                className="neo-owner-img"
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
                  Platforma vositachisiz va xavfsiz ishlashi uchun, kontaktlar faqat 30$ Escrow toʻlangach va ega rozi boʻlgach ochiladi.
                </p>
              </div>
            </div>

            {/* Send Request Button */}
            <Button
              variant="primary"
              size="lg"
              className="neo-action-full-btn"
              icon={<Send size={18} />}
              onClick={handleOpenRequest}
            >
              {t('listing.send_request')}
            </Button>
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
                    <span>Zalog (Depozit):</span>
                    <strong style={{ color: 'var(--warning)' }}>${listing.deposit}</strong>
                  </div>
                )}
                <div className="neo-term-row">
                  <span>Minimal ijara muddati:</span>
                  <strong>{listing.minRentalPeriodMonths} {t('listing.months')}</strong>
                </div>
                <div className="neo-term-row">
                  <span>Kommunal toʻlovlar:</span>
                  <strong>{listing.isUtilityIncluded ? 'Narx ichida' : 'Alohida hisoblanadi'}</strong>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Send Request Modal */}
      <Modal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        title={t('listing.send_request')}
      >
        <form onSubmit={handleSendRequest} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Eʼlon egasiga zayavka yuboring. Egasi koʻrib chiqib rozi boʻlgach, 30$ Escrow toʻlov oynasi ochiladi va kontaktlar almashiniladi.
          </p>

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
