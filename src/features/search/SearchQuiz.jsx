import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/ui/Card';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { Tabs } from '../../components/ui/Tabs';
import { ListingCard } from '../listings/ListingCard';
import { getListings, calculateMatchScore } from '../../services/listingsService';
import { REGIONS_DATA } from '../../constants/regions';
import { AMENITIES_LIST } from '../../constants/amenities';
import { toast } from '../../store/toastStore';
import {
  Compass,
  Sparkles,
  Bookmark,
  SlidersHorizontal,
  CheckCircle2
} from 'lucide-react';
import './SearchQuiz.css';

// Qidiruvning boshlang'ich qiymatlari ham, boshlang'ich qidiruv ham bir xil
// konstantadan olinadi — effect ichida state'ga bog'lanish shart emas.
const DEFAULT_CRITERIA = {
  purpose: 'RENT',
  rentMode: 'ENTIRE',
  region: 'tashkent_city',
  district: '',
  roomsCount: '',
  condition: '',
  priceBracket: '',
  paymentTerm: '',
  amenities: []
};
const DEFAULT_SORT = 'match';

const sortListingsPure = (list, sortType) => {
  const sorted = [...list];
  if (sortType === 'match') {
    sorted.sort((a, b) => b.matchScore - a.matchScore);
  } else if (sortType === 'price_asc') {
    sorted.sort((a, b) => a.price - b.price);
  } else if (sortType === 'price_desc') {
    sorted.sort((a, b) => b.price - a.price);
  }
  return sorted;
};

// Qidiruv mantiqi — komponentdan tashqari pure yordamchi funksiya.
// Komponentdan eksport qilinmaydi: only-export-components qoidasiga ko'ra
// fayl faqat komponent eksport qilishi kerak.
const runSearchListings = async (criteria, sortType) => {
  const all = await getListings();

  const effectiveCriteria = {
    ...criteria,
    maxPrice: criteria.priceBracket ? Number(criteria.priceBracket) : undefined
  };
  const scored = all.map((listing) => ({
    ...listing,
    matchScore: calculateMatchScore(listing, effectiveCriteria)
  }));

  const filtered = scored.filter((item) => {
    if (criteria.purpose && item.type !== criteria.purpose) return false;
    if (criteria.purpose === 'RENT' && criteria.rentMode && item.rentMode !== criteria.rentMode) return false;
    if (criteria.region && item.region !== criteria.region) return false;
    if (criteria.district && item.district !== criteria.district) return false;
    if (criteria.condition && item.condition !== criteria.condition) return false;
    if (criteria.paymentTerm && item.paymentTerm !== criteria.paymentTerm) return false;
    if (effectiveCriteria.maxPrice && item.price > effectiveCriteria.maxPrice) return false;
    return true;
  });

  return sortListingsPure(filtered, sortType);
};

export const SearchQuiz = () => {
  const { t } = useTranslation();

  // ONLY SELECT and segmented buttons — NO FREE TEXT!
  const [criteria, setCriteria] = useState({ ...DEFAULT_CRITERIA });

  // Tumanlar hududdan kelib chiqadigan (derived) ro'yxat — useEffect + setState
  // o'rniga renderda hisoblanadi, ortiqcha render zanjiri bo'lmaydi.
  const districtsList = useMemo(() => {
    const reg = REGIONS_DATA.find((r) => r.id === criteria.region);
    return reg ? reg.districts.map((d) => ({ value: d.id, label: d.name.uz })) : [];
  }, [criteria.region]);

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true); // sahifa ochilishi bilan qidiruv boshlanadi
  const [sortBy, setSortBy] = useState(DEFAULT_SORT);

  const handleAmenityToggle = (id) => {
    setCriteria((prev) => {
      const exists = prev.amenities.includes(id);
      return {
        ...prev,
        amenities: exists ? prev.amenities.filter((a) => a !== id) : [...prev.amenities, id]
      };
    });
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      setResults(await runSearchListings(criteria, sortBy));
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setResults(sortListingsPure(results, newSort));
  };

  const handleSaveSearch = () => {
    localStorage.setItem('makler_saved_quiz', JSON.stringify(criteria));
    toast.success(t('search.search_saved'));
  };

  // Birinchi marta yuklanganda avtomatik qidiruvni boshlash. Toza modul
  // funksiyasi chaqiriladi — effect ichida setState zanjiri yo'q.
  useEffect(() => {
    let active = true;
    runSearchListings(DEFAULT_CRITERIA, DEFAULT_SORT).then((initial) => {
      if (active) {
        setResults(initial);
        setLoading(false);
      }
    });
    return () => { active = false; };
  }, []);

  return (
    <div className="container neo-quiz-page">
      {/* Quiz Header */}
      <div className="neo-quiz-header">
        <div className="neo-quiz-header-badge">
          <Compass size={16} /> Aqlli soʻrovnoma
        </div>
        <h1 className="neo-quiz-title">{t('search.quiz_title')}</h1>
        <p className="neo-quiz-subtitle">{t('search.quiz_subtitle')}</p>
      </div>

      {/* Structured Questionnaire Form - Strictly Selection Based */}
      <Card padding="lg" className="neo-quiz-box">
        {/* Purpose Tabs: IJARA / SOTUV */}
        <div className="neo-quiz-row">
          <label className="neo-label">{t('search.purpose')}:</label>
          <Tabs
            tabs={[
              { id: 'RENT', label: t('search.rent') },
              { id: 'SALE', label: t('search.buy') }
            ]}
            activeTab={criteria.purpose}
            onChange={(val) => setCriteria({ ...criteria, purpose: val })}
            size="lg"
          />
        </div>

        {/* Rent Mode (Faqat ijara bo'lsa) */}
        {criteria.purpose === 'RENT' && (
          <div className="neo-quiz-row">
            <label className="neo-label">{t('search.rent_type')}:</label>
            <Tabs
              tabs={[
                { id: 'ENTIRE', label: t('search.entire_house') },
                { id: 'ROOM', label: t('search.room_by_room') }
              ]}
              activeTab={criteria.rentMode}
              onChange={(val) => setCriteria({ ...criteria, rentMode: val })}
            />
          </div>
        )}

        {/* Region & District (Select only) */}
        <div className="neo-quiz-grid-2">
          <Select
            label={t('search.region')}
            value={criteria.region}
            onChange={(e) => setCriteria({ ...criteria, region: e.target.value, district: '' })}
            options={REGIONS_DATA.map((r) => ({ value: r.id, label: r.name.uz }))}
            placeholder={false}
          />

          <Select
            label={t('search.district')}
            value={criteria.district}
            onChange={(e) => setCriteria({ ...criteria, district: e.target.value })}
            options={districtsList}
            placeholder="Barcha tumanlar"
          />
        </div>

        {/* Room count & Furnishing Level (Select only) */}
        <div className="neo-quiz-grid-2">
          <Select
            label={t('search.room_count')}
            value={criteria.roomsCount}
            onChange={(e) => setCriteria({ ...criteria, roomsCount: e.target.value })}
            options={[
              { value: '1', label: '1 xonali' },
              { value: '2', label: '2 xonali' },
              { value: '3', label: '3 xonali' },
              { value: '4', label: '4+ xonali' }
            ]}
            placeholder="Ixtiyoriy xonalar soni"
          />

          <Select
            label={t('search.condition')}
            value={criteria.condition}
            onChange={(e) => setCriteria({ ...criteria, condition: e.target.value })}
            options={[
              { value: 'furnished', label: t('search.furnished') },
              { value: 'standard', label: t('search.standard') },
              { value: 'unfurnished', label: t('search.unfurnished') }
            ]}
            placeholder="Jihozlanish darajasi"
          />
        </div>

        {/* Payment Term & Price bracket (Select only) */}
        <div className="neo-quiz-grid-2">
          <Select
            label={t('search.payment_type')}
            value={criteria.paymentTerm}
            onChange={(e) => setCriteria({ ...criteria, paymentTerm: e.target.value })}
            options={[
              { value: 'PREPAY', label: 'Oldindan toʻlov' },
              { value: 'POSTPAY', label: 'Oy oxirida toʻlov (Zalogli)' },
              { value: 'MONTHLY', label: 'Oylik toʻlov' }
            ]}
            placeholder="Toʻlov sharti"
          />

          <Select
            label={t('search.price_range')}
            value={criteria.priceBracket}
            onChange={(e) => setCriteria({ ...criteria, priceBracket: e.target.value })}
            options={
              criteria.purpose === 'RENT'
                ? [
                    { value: '200', label: '$200 gacha (Hamyonbop)' },
                    { value: '500', label: '$500 gacha (Oʻrtacha shinam)' },
                    { value: '1000', label: '$1000 gacha (Premium)' },
                    { value: '2000', label: '$2000 gacha (VIP/Lyuks)' }
                  ]
                : [
                    { value: '50000', label: '$50,000 gacha' },
                    { value: '90000', label: '$90,000 gacha' },
                    { value: '150000', label: '$150,000 gacha' },
                    { value: '300000', label: '$300,000 gacha' }
                  ]
            }
            placeholder="Maksimal byudjet"
          />
        </div>

        {/* Amenities Select Pills */}
        <div style={{ marginTop: 10 }}>
          <label className="neo-label" style={{ marginBottom: 10, display: 'block' }}>
            {t('search.amenities')}:
          </label>
          <div className="neo-amenities-selector">
            {AMENITIES_LIST.map((am) => {
              const isSelected = criteria.amenities.includes(am.id);
              return (
                <button
                  key={am.id}
                  type="button"
                  className={`neo-amenity-select-pill ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => handleAmenityToggle(am.id)}
                >
                  <CheckCircle2 size={15} color={isSelected ? 'var(--primary)' : 'var(--text-muted)'} />
                  <span>{am.label.uz}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="neo-quiz-actions">
          <Button
            variant="default"
            icon={<Bookmark size={16} />}
            onClick={handleSaveSearch}
          >
            {t('search.save_search')}
          </Button>

          <Button
            variant="primary"
            size="lg"
            icon={<Sparkles size={18} />}
            onClick={handleSearch}
            loading={loading}
          >
            {t('search.find_btn')}
          </Button>
        </div>
      </Card>

      {/* Results Header and Sorter */}
      <div className="neo-results-header">
        <div className="neo-results-count">
          <strong>{results.length} ta</strong> mos xonadon topildi
        </div>

        <div className="neo-results-sort">
          <SlidersHorizontal size={16} color="var(--text-muted)" />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {t('search.sort_by')}:
          </span>
          <Tabs
            tabs={[
              { id: 'match', label: t('search.sort_match') },
              { id: 'price_asc', label: t('search.sort_price_asc') },
              { id: 'price_desc', label: t('search.sort_price_desc') }
            ]}
            activeTab={sortBy}
            onChange={handleSortChange}
            size="sm"
          />
        </div>
      </div>

      {/* Results Grid */}
      {results.length > 0 ? (
        <div className="grid-responsive" style={{ marginTop: 24 }}>
          {results.map((item) => (
            <ListingCard key={item.id} listing={item} matchScore={item.matchScore} />
          ))}
        </div>
      ) : (
        <Card padding="lg" style={{ textAlign: 'center', marginTop: 30 }}>
          <h3>{t('search.empty_title')}</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>
            {t('search.empty_desc')}
          </p>
        </Card>
      )}
    </div>
  );
};
