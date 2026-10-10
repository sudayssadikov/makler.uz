import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { getMyListings, deleteListing, updateListing } from '../../services/listingsService';
import { useAuthStore } from '../../store/authStore';
import { toast } from '../../store/toastStore';
import { PlusCircle, Trash2, Power, Eye } from 'lucide-react';

export const MyListingsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sahifa ochilganda va tugmalar bosilganda — bir xil manba. Har bir
  // chaqiruvchi natijani o'z holatiga o'zi yozadi (effect ichida setState
  // chaqirilishi qoidaga xilof).
  const loadMyListings = useCallback(async () => {
    // User yoki demo egasi bo'yicha olish
    const ownerId = user?.id || 'user_owner_1';
    return getMyListings(ownerId);
  }, [user?.id]);

  const applyMyListings = useCallback((data) => {
    setMyListings(data);
    setLoading(false);
  }, []);

  const reloadMyListings = useCallback(async () => {
    applyMyListings(await loadMyListings());
  }, [loadMyListings, applyMyListings]);

  useEffect(() => {
    let active = true;
    loadMyListings().then((data) => {
      if (active) applyMyListings(data);
    });
    return () => { active = false; };
  }, [loadMyListings, applyMyListings]);

  const handleDelete = async (id) => {
    if (window.confirm('Haqiqatan ham bu eʼlonni oʻchirmoqchimisiz?')) {
      await deleteListing(id);
      toast.info('Eʼlon oʻchirildi');
      reloadMyListings();
    }
  };

  const handleToggleStatus = async (item) => {
    const nextStatus = item.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    await updateListing(item.id, { status: nextStatus });
    toast.success(`Eʼlon holati: ${nextStatus === 'ACTIVE' ? 'Faollashtirildi' : 'Toʻxtatildi'}`);
    reloadMyListings();
  };

  return (
    <div className="container" style={{ paddingBottom: 50 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1>{t('nav.my_listings')}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Siz qoʻshgan koʻchmas mulk eʼlonlarini boshqarish va tahrirlash
          </p>
        </div>
        <Button variant="primary" icon={<PlusCircle size={18} />} onClick={() => navigate('/add-listing')}>
          Yangi eʼlon qoʻshish
        </Button>
      </div>

      {loading ? (
        <div>Yuklanmoqda...</div>
      ) : myListings.length === 0 ? (
        <Card padding="lg" style={{ textAlign: 'center' }}>
          <h3>Sizda hali eʼlonlar yoʻq</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>
            Birinchi eʼloningizni joylashtiring va tez fursatda ijarachi yoki xaridor toping.
          </p>
          <Button variant="primary" style={{ marginTop: 16 }} onClick={() => navigate('/add-listing')}>
            Eʼlon qoʻshish
          </Button>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {myListings.map((item) => (
            <Card key={item.id} padding="md" style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
              <img
                src={item.coverImage}
                alt={item.title}
                style={{ width: 140, height: 100, objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
              />

              <div style={{ flex: 1, minWidth: 240 }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                  <Badge variant={item.status === 'ACTIVE' ? 'success' : 'warning'} size="sm">
                    {item.status}
                  </Badge>
                  <Badge variant="neutral" size="sm">
                    {item.type}
                  </Badge>
                </div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: 4 }}>{item.title}</h3>
                <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '1.1rem' }}>
                  ${item.price} / oy
                </div>
                <small style={{ color: 'var(--text-muted)' }}>{item.address}</small>
              </div>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Button variant="default" size="sm" icon={<Eye size={15} />} onClick={() => navigate(`/listings/${item.id}`)}>
                  Koʻrish
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  icon={<Power size={15} />}
                  onClick={() => handleToggleStatus(item)}
                >
                  {item.status === 'ACTIVE' ? 'Toʻxtatish' : 'Faollashtirish'}
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  icon={<Trash2 size={15} />}
                  onClick={() => handleDelete(item.id)}
                >
                  Oʻchirish
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
