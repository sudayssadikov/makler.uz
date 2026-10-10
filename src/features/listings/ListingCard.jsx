import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { getFavorites, toggleFavorite } from '../../services/listingsService';
import {
  Heart,
  MapPin,
  Maximize2,
  Home,
  CheckCircle,
  Percent,
  AlertCircle,
  Train,
  Image as ImageIcon
} from 'lucide-react';
import './ListingCard.css';

export const ListingCard = ({ listing, matchScore = null }) => {
  const { t } = useTranslation();
  const [isFav, setIsFav] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    getFavorites().then((favs) => setIsFav(favs.includes(listing.id)));
  }, [listing.id]);

  const handleFavClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = await toggleFavorite(listing.id);
    setIsFav(updated.includes(listing.id));
  };

  const isRent = listing.type === 'RENT';
  const isRoom = listing.rentMode === 'ROOM';

  return (
    <Card className="neo-listing-card" padding="none">
      <Link to={`/listings/${listing.id}`} className="neo-listing-link">
        {/* Cover Image & Badges */}
        <div className="neo-listing-img-box">
          {!imgError && listing.coverImage ? (
            <img
              src={listing.coverImage}
              alt={listing.title}
              className="neo-listing-img"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="neo-listing-img-fallback">
              <ImageIcon size={32} color="var(--primary)" opacity={0.6} />
              <span>{listing.district || 'Makler.uz'}</span>
            </div>
          )}

          {/* Top Badges */}
          <div className="neo-listing-top-badges">
            <Badge variant={isRent ? 'info' : 'accent'} size="sm">
              {isRent ? t('listing.type_rent') : t('listing.type_sale')}
            </Badge>

            {isRoom && (
              <Badge variant="warning" size="sm">
                {t('listing.room_by_room')}
              </Badge>
            )}

            {listing.status === 'HOLD' && (
              <Badge variant="warning" size="sm">
                Band qilinmoqda
              </Badge>
            )}

            {listing.status === 'RESERVED' && (
              <Badge variant="accent" size="sm">
                Band qilingan
              </Badge>
            )}

            {listing.status === 'HANDED_OVER' && (
              <Badge variant="info" size="sm">
                Topshirilmoqda
              </Badge>
            )}

            {listing.status === 'RENTED' && (
              <Badge variant="neutral" size="sm">
                Ijaraga berildi
              </Badge>
            )}

            {listing.status === 'SOLD' && (
              <Badge variant="neutral" size="sm">
                Sotildi
              </Badge>
            )}

            {matchScore !== null && (
              <Badge variant="success" size="sm" icon={<Percent size={12} />}>
                {matchScore}% {t('listing.match')}
              </Badge>
            )}
          </div>

          {/* Favorite button */}
          <button
            type="button"
            className={`neo-fav-btn ${isFav ? 'is-fav' : ''}`}
            onClick={handleFavClick}
            aria-label="Save to favorites"
          >
            <Heart
              size={16}
              fill={isFav ? 'var(--danger)' : 'none'}
              color={isFav ? 'var(--danger)' : 'currentColor'}
            />
          </button>
        </div>

        {/* Content Details */}
        <div className="neo-listing-info">
          {/* Price */}
          <div className="neo-listing-price-row">
            <div className="neo-listing-price">
              ${listing.price.toLocaleString()}
              {isRent && <span className="neo-price-unit">{t('listing.per_month')}</span>}
            </div>
            {listing.paymentTerm === 'POSTPAY' && (
              <span className="neo-term-badge" title="Oy oxirida toʻlov (Zalog bor)">
                {t('listing.deposit')}: ${listing.deposit}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="neo-listing-title">{listing.title}</h3>

          {/* Location & Metro */}
          <div className="neo-listing-meta">
            <div className="neo-meta-item">
              <MapPin size={14} />
              <span>{listing.address || listing.district}</span>
            </div>
            {listing.distanceToMetro && (
              <div className="neo-meta-item neo-metro-dist">
                <Train size={14} />
                <span>{listing.distanceToMetro}</span>
              </div>
            )}
          </div>

          {/* Room Specs */}
          <div className="neo-listing-specs">
            <span className="neo-spec-tag">
              <Home size={14} /> {listing.roomsCount} {t('listing.rooms')}
            </span>
            <span className="neo-spec-tag">
              <Maximize2 size={14} /> {listing.areaTotal} {t('listing.area')}
            </span>
            <span className="neo-spec-tag">
              {listing.floor}/{listing.totalFloors} {t('listing.floor')}
            </span>
          </div>

          {/* Footer note: Verified owner and drawback preview */}
          <div className="neo-listing-footer">
            <div className="neo-owner-badge">
              <CheckCircle size={13} color="var(--primary)" />
              <span>{t('listing.verified_owner')}</span>
            </div>
            {listing.roomsData?.[0]?.drawbacks && (
              <div className="neo-drawback-flag" title={listing.roomsData[0].drawbacks}>
                <AlertCircle size={13} color="var(--warning)" />
                <span>{t('listing.has_drawback')}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </Card>
  );
};
