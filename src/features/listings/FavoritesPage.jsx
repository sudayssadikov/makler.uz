import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ListingCard } from './ListingCard';
import { getListings, getFavorites } from '../../services/listingsService';
import { Heart } from 'lucide-react';

export const FavoritesPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [favoriteListings, setFavoriteListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getListings(), getFavorites()]).then(([all, favIds]) => {
      setFavoriteListings(all.filter((item) => favIds.includes(item.id)));
      setLoading(false);
    });
  }, []);

  return (
    <div className="container" style={{ paddingBottom: 50 }}>
      <div style={{ marginBottom: 24 }}>
        <h1>{t('nav.favorites')}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Sizga yoqqan va saqlab qoʻyilgan eʼlonlar roʻyxati
        </p>
      </div>

      {loading ? (
        <div>Yuklanmoqda...</div>
      ) : favoriteListings.length === 0 ? (
        <Card padding="lg" style={{ textAlign: 'center', marginTop: 20 }}>
          <Heart size={40} color="var(--text-muted)" style={{ margin: '0 auto 10px' }} />
          <h3>Sevimlilar roʻyxati boʻsh</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: 6 }}>
            Eʼlon kartalaridagi yurakcha belgisini bosib, ularni bu yerga saqlashingiz mumkin.
          </p>
          <Button variant="primary" onClick={() => navigate('/search')} style={{ marginTop: 16 }}>
            Eʼlonlarni koʻrish
          </Button>
        </Card>
      ) : (
        <div className="grid-responsive">
          {favoriteListings.map((item) => (
            <ListingCard key={item.id} listing={item} />
          ))}
        </div>
      )}
    </div>
  );
};
