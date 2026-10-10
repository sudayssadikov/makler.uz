import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/Button';
import { Chip } from '../../components/ui/Chip';
import { Avatar } from '../../components/ui/Avatar';
import { ListingCard } from '../listings/ListingCard';
import { getListings } from '../../services/listingsService';
import { REGIONS_DATA } from '../../constants/regions';
import {
  Sparkles,
  Compass,
  PlusCircle,
  Search,
  MapPin,
  Home,
  ShieldCheck,
  Lock,
  FileCheck,
  CheckCircle2,
  Users,
  Building,
  ArrowRight,
  Star,
  XCircle
} from 'lucide-react';
import './HomePage.css';

export const HomePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Listings state
  const [allListings, setAllListings] = useState([]);
  const [activeCategory, setActiveCategory] = useState('ALL');

  // Hero Search Card state
  const [searchPurpose, setSearchPurpose] = useState('RENT'); // 'RENT' | 'SALE'
  const [searchRegion, setSearchRegion] = useState('tashkent_city');
  const [searchRooms, setSearchRooms] = useState('');
  const [searchPrice, setSearchPrice] = useState('');
  const [isRoomByRoom, setIsRoomByRoom] = useState(false);

  useEffect(() => {
    getListings().then((data) => setAllListings(data));
  }, []);

  // Filter listings based on active tab
  const filteredListings = allListings.filter((item) => {
    if (activeCategory === 'RENT') return item.type === 'RENT';
    if (activeCategory === 'SALE') return item.type === 'SALE';
    if (activeCategory === 'ROOM') return item.rentMode === 'ROOM';
    return true;
  }).slice(0, 6);

  // Handle Search Submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchPurpose) params.set('purpose', searchPurpose);
    if (searchRegion) params.set('region', searchRegion);
    if (searchRooms) params.set('rooms', searchRooms === '4' ? '4' : searchRooms);
    // "100-300" kabi oraliq → SearchQuiz maksimal byudjetni (priceBracket) raqam kutadi
    if (searchPrice) params.set('price', searchPrice.split('-')[1] || searchPrice);
    if (isRoomByRoom) params.set('rentType', 'ROOM');
    navigate(`/search?${params.toString()}`);
  };

  // Quick chips handler
  const handleQuickChip = (filterType, val) => {
    const params = new URLSearchParams();
    if (filterType === 'region') params.set('region', val);
    if (filterType === 'rentType') params.set('rentType', val);
    if (filterType === 'purpose') params.set('purpose', val);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="makler-home-root">
      {/* ====================================================================
          3.1 HERO SECTION (Split Layout)
          ==================================================================== */}
      <section className="makler-hero-section">
        <div className="container makler-hero-container">
          {/* Left Column: Headline, CTAs, Live Metrics */}
          <div className="makler-hero-left">
            <div className="makler-hero-badge animate-fade-in">
              <Sparkles size={15} className="hero-badge-icon" />
              <span>{t('home.hero_badge')}</span>
            </div>

            <h1 className="makler-hero-title">
              {t('home.hero_title_part1')}{' '}
              <span className="text-gradient">{t('home.hero_title_keyword')}</span>{' '}
              {t('home.hero_title_part2')}
            </h1>

            <p className="makler-hero-subtitle">
              {t('home.hero_subtitle')}
            </p>

            <div className="makler-hero-cta-group">
              <Button
                variant="primary"
                size="lg"
                icon={<Compass size={20} />}
                onClick={() => navigate('/search')}
                className="hero-primary-cta"
              >
                {t('home.start_search')}
              </Button>

              <Button
                variant="default"
                size="lg"
                icon={<PlusCircle size={20} />}
                onClick={() => navigate('/add-listing')}
                className="hero-secondary-cta"
              >
                {t('home.post_property')}
              </Button>
            </div>

            {/* 3 Live Counters */}
            <div className="makler-hero-metrics">
              <div className="hero-metric-item">
                <span className="hero-metric-num">10,000+</span>
                <span className="hero-metric-label">{t('home.stat_verified_users')}</span>
              </div>
              <div className="hero-metric-divider" />
              <div className="hero-metric-item">
                <span className="hero-metric-num">2,400+</span>
                <span className="hero-metric-label">{t('home.stat_active_listings')}</span>
              </div>
              <div className="hero-metric-divider" />
              <div className="hero-metric-item">
                <span className="hero-metric-num">1,800+</span>
                <span className="hero-metric-label">{t('home.stat_protected_deals')}</span>
              </div>
            </div>
          </div>

          {/* Right Column: High Quality Homes Collage + Floating Badges */}
          <div className="makler-hero-right">
            <div className="makler-hero-visual-box">
              {/* Main Photo */}
              <div className="hero-img-card hero-img-card-main">
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
                  alt="Modern Apartment Interior"
                  className="hero-img-cover"
                />
              </div>

              {/* Secondary Photo */}
              <div className="hero-img-card hero-img-card-sub">
                <img
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80"
                  alt="Cozy Living Room"
                  className="hero-img-cover"
                />
              </div>

              {/* Third Photo */}
              <div className="hero-img-card hero-img-card-accent">
                <img
                  src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=500&q=80"
                  alt="Apartment Exterior"
                  className="hero-img-cover"
                />
              </div>

              {/* Floating Glass Badges */}
              <div className="hero-glass-badge hero-glass-badge-1 animate-float">
                <ShieldCheck size={18} color="var(--success)" />
                <span className="glass-badge-text">{t('home.floating_jshshir')}</span>
              </div>

              <div className="hero-glass-badge hero-glass-badge-2 animate-float" style={{ animationDelay: '1.5s' }}>
                <Lock size={18} color="var(--accent)" />
                <span className="glass-badge-text">{t('home.floating_escrow')}</span>
              </div>

              <div className="hero-glass-badge hero-glass-badge-3 animate-float" style={{ animationDelay: '3s' }}>
                <FileCheck size={18} color="var(--primary)" />
                <span className="glass-badge-text">{t('home.floating_contract')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ====================================================================
            FLOATING SEARCH CARD (Raised, Overlapping Hero Bottom)
            ==================================================================== */}
        <div className="container makler-search-card-wrapper">
          <div className="neo-card makler-search-card">
            {/* Purpose Tabs: Ijara vs Sotuv */}
            <div className="makler-search-tabs">
              <button
                type="button"
                className={`makler-search-tab ${searchPurpose === 'RENT' ? 'active' : ''}`}
                onClick={() => setSearchPurpose('RENT')}
              >
                {t('home.search_tab_rent')}
              </button>
              <button
                type="button"
                className={`makler-search-tab ${searchPurpose === 'SALE' ? 'active' : ''}`}
                onClick={() => setSearchPurpose('SALE')}
              >
                {t('home.search_tab_sale')}
              </button>
            </div>

            {/* Search Input Row */}
            <form onSubmit={handleSearchSubmit} className="makler-search-form">
              <div className="search-field-col">
                <label className="search-field-label">
                  <MapPin size={14} /> {t('search.region')}
                </label>
                <select
                  value={searchRegion}
                  onChange={(e) => setSearchRegion(e.target.value)}
                  className="search-select-input"
                >
                  {REGIONS_DATA.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name.uz}
                    </option>
                  ))}
                </select>
              </div>

              <div className="search-field-col">
                <label className="search-field-label">
                  <Home size={14} /> {t('search.room_count')}
                </label>
                <select
                  value={searchRooms}
                  onChange={(e) => setSearchRooms(e.target.value)}
                  className="search-select-input"
                >
                  <option value="">{t('search.all')}</option>
                  <option value="1">1 xona</option>
                  <option value="2">2 xona</option>
                  <option value="3">3 xona</option>
                  <option value="4">4+ xona</option>
                </select>
              </div>

              <div className="search-field-col">
                <label className="search-field-label">
                  <Lock size={14} /> {t('search.price_range')}
                </label>
                <select
                  value={searchPrice}
                  onChange={(e) => setSearchPrice(e.target.value)}
                  className="search-select-input"
                >
                  <option value="">{t('search.all')}</option>
                  <option value="100-300">$100 - $300</option>
                  <option value="300-600">$300 - $600</option>
                  <option value="600-1200">$600 - $1,200</option>
                  <option value="1200+">$1,200+</option>
                </select>
              </div>

              {/* Room-by-room toggle for Rent */}
              {searchPurpose === 'RENT' && (
                <div className="search-field-col search-toggle-col">
                  <label className="search-toggle-label">
                    <input
                      type="checkbox"
                      checked={isRoomByRoom}
                      onChange={(e) => setIsRoomByRoom(e.target.checked)}
                      className="search-checkbox"
                    />
                    <span className="search-toggle-text">{t('home.room_by_room_toggle')}</span>
                  </label>
                </div>
              )}

              {/* Submit CTA button */}
              <div className="search-field-submit">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  icon={<Search size={18} />}
                  className="search-submit-btn"
                >
                  {t('search.find_btn')}
                </Button>
              </div>
            </form>
          </div>

          {/* Quick Filter Chips */}
          <div className="makler-quick-chips-row">
            <Chip
              icon={<MapPin size={14} />}
              onClick={() => handleQuickChip('region', 'tashkent_city')}
            >
              {t('home.chip_tashkent')}
            </Chip>
            <Chip
              icon={<Users size={14} />}
              onClick={() => handleQuickChip('rentType', 'ROOM')}
            >
              {t('home.chip_students')}
            </Chip>
            <Chip
              icon={<Building size={14} />}
              onClick={() => handleQuickChip('purpose', 'SALE')}
            >
              {t('home.chip_new_buildings')}
            </Chip>
            <Chip
              icon={<MapPin size={14} />}
              onClick={() => handleQuickChip('region', 'samarkand')}
            >
              {t('home.chip_samarkand')}
            </Chip>
          </div>
        </div>
      </section>

      {/* ====================================================================
          3.2 TRUST & SECURITY HIGHLIGHTS (Ishonch Bloki - 4 Cards)
          ==================================================================== */}
      <section className="section makler-trust-section">
        <div className="container">
          <div className="makler-section-header">
            <h2 className="makler-section-title">{t('home.trust_title')}</h2>
            <p className="makler-section-subtitle">{t('home.hero_subtitle')}</p>
          </div>

          <div className="makler-trust-grid">
            <div className="neo-card makler-trust-card">
              <div className="trust-icon-box glow-primary">
                <ShieldCheck size={26} color="var(--primary)" />
              </div>
              <h3 className="trust-card-title">{t('home.trust_badge1')}</h3>
              <p className="trust-card-desc">{t('home.trust_badge1_desc')}</p>
            </div>

            <div className="neo-card makler-trust-card">
              <div className="trust-icon-box glow-accent">
                <Lock size={26} color="var(--accent)" />
              </div>
              <h3 className="trust-card-title">{t('home.trust_badge2')}</h3>
              <p className="trust-card-desc">{t('home.trust_badge2_desc')}</p>
            </div>

            <div className="neo-card makler-trust-card">
              <div className="trust-icon-box glow-info">
                <Home size={26} color="var(--info)" />
              </div>
              <h3 className="trust-card-title">{t('home.trust_badge3')}</h3>
              <p className="trust-card-desc">{t('home.trust_badge3_desc')}</p>
            </div>

            <div className="neo-card makler-trust-card">
              <div className="trust-icon-box glow-success">
                <FileCheck size={26} color="var(--success)" />
              </div>
              <h3 className="trust-card-title">{t('home.trust_badge4')}</h3>
              <p className="trust-card-desc">{t('home.trust_badge4_desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          3.3 FEATURED LISTINGS (Tavsiya etilgan e'lonlar)
          ==================================================================== */}
      <section className="section makler-featured-section">
        <div className="container">
          <div className="featured-header-row">
            <div>
              <h2 className="makler-section-title">{t('home.featured_title')}</h2>
              <p className="makler-section-subtitle">{t('home.latest_listings')}</p>
            </div>

            {/* Category tabs */}
            <div className="featured-tabs-wrap">
              <button
                type="button"
                className={`neo-chip ${activeCategory === 'ALL' ? 'active' : ''}`}
                onClick={() => setActiveCategory('ALL')}
              >
                {t('home.tab_all')}
              </button>
              <button
                type="button"
                className={`neo-chip ${activeCategory === 'RENT' ? 'active' : ''}`}
                onClick={() => setActiveCategory('RENT')}
              >
                {t('home.tab_rent')}
              </button>
              <button
                type="button"
                className={`neo-chip ${activeCategory === 'SALE' ? 'active' : ''}`}
                onClick={() => setActiveCategory('SALE')}
              >
                {t('home.tab_sale')}
              </button>
              <button
                type="button"
                className={`neo-chip ${activeCategory === 'ROOM' ? 'active' : ''}`}
                onClick={() => setActiveCategory('ROOM')}
              >
                {t('home.tab_room')}
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="makler-listings-grid">
            {filteredListings.map((item) => (
              <ListingCard key={item.id} listing={item} />
            ))}
          </div>

          <div className="featured-footer-cta">
            <Button
              variant="default"
              size="lg"
              icon={<ArrowRight size={18} />}
              onClick={() => navigate('/search')}
            >
              {t('home.view_all_listings')}
            </Button>
          </div>
        </div>
      </section>

      {/* ====================================================================
          3.4 HOW IT WORKS (Qanday ishlaydi - 4-step Horizontal Timeline)
          ==================================================================== */}
      <section className="section makler-how-section">
        <div className="container">
          <div className="makler-section-header">
            <h2 className="makler-section-title">{t('home.how_it_works')}</h2>
            <p className="makler-section-subtitle">4 ta oson va toʻliq himoyalangan bosqich</p>
          </div>

          <div className="makler-timeline-container">
            <div className="timeline-connecting-line" />

            <div className="timeline-steps-grid">
              <div className="neo-card timeline-step-card">
                <div className="timeline-step-badge">1</div>
                <div className="timeline-icon-box">
                  <Compass size={24} color="var(--primary)" />
                </div>
                <h4 className="timeline-step-title">{t('home.step1_title')}</h4>
                <p className="timeline-step-desc">{t('home.step1_desc')}</p>
              </div>

              <div className="neo-card timeline-step-card">
                <div className="timeline-step-badge">2</div>
                <div className="timeline-icon-box">
                  <Lock size={24} color="var(--accent)" />
                </div>
                <h4 className="timeline-step-title">{t('home.step2_title')}</h4>
                <p className="timeline-step-desc">{t('home.step2_desc')}</p>
              </div>

              <div className="neo-card timeline-step-card">
                <div className="timeline-step-badge">3</div>
                <div className="timeline-icon-box">
                  <ShieldCheck size={24} color="var(--success)" />
                </div>
                <h4 className="timeline-step-title">{t('home.step3_title')}</h4>
                <p className="timeline-step-desc">{t('home.step3_desc')}</p>
              </div>

              <div className="neo-card timeline-step-card">
                <div className="timeline-step-badge">4</div>
                <div className="timeline-icon-box">
                  <FileCheck size={24} color="var(--info)" />
                </div>
                <h4 className="timeline-step-title">{t('home.step4_title')}</h4>
                <p className="timeline-step-desc">{t('home.step4_desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          3.5 SECURITY ARCHITECTURE (Xavfsizlik Solishtiruvi)
          ==================================================================== */}
      <section className="section makler-security-section">
        <div className="container">
          <div className="makler-section-header">
            <h2 className="makler-section-title">{t('home.security_title')}</h2>
            <p className="makler-section-subtitle">{t('home.security_subtitle')}</p>
          </div>

          <div className="makler-comparison-grid">
            {/* Old Way */}
            <div className="neo-card comparison-card comparison-old">
              <div className="comparison-header">
                <div className="comparison-icon-wrap old">
                  <XCircle size={24} color="var(--danger)" />
                </div>
                <h3 className="comparison-title">{t('home.security_old_title')}</h3>
              </div>
              <ul className="comparison-list">
                <li>
                  <XCircle size={18} color="var(--danger)" />
                  <span>{t('home.security_old_1')}</span>
                </li>
                <li>
                  <XCircle size={18} color="var(--danger)" />
                  <span>{t('home.security_old_2')}</span>
                </li>
                <li>
                  <XCircle size={18} color="var(--danger)" />
                  <span>{t('home.security_old_3')}</span>
                </li>
              </ul>
            </div>

            {/* Makler.uz Way */}
            <div className="neo-card comparison-card comparison-new">
              <div className="comparison-header">
                <div className="comparison-icon-wrap new glow-primary">
                  <ShieldCheck size={24} color="var(--primary)" />
                </div>
                <h3 className="comparison-title text-gradient">{t('home.security_new_title')}</h3>
              </div>
              <ul className="comparison-list">
                <li>
                  <CheckCircle2 size={18} color="var(--success)" />
                  <span>{t('home.security_new_1')}</span>
                </li>
                <li>
                  <CheckCircle2 size={18} color="var(--success)" />
                  <span>{t('home.security_new_2')}</span>
                </li>
                <li>
                  <CheckCircle2 size={18} color="var(--success)" />
                  <span>{t('home.security_new_3')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          3.6 SOCIAL PROOF & TESTIMONIALS (Ijtimoiy Isbot)
          ==================================================================== */}
      <section className="section makler-testimonials-section">
        <div className="container">
          <div className="makler-section-header">
            <h2 className="makler-section-title">{t('home.testimonials_title')}</h2>
            <p className="makler-section-subtitle">{t('home.testimonials_subtitle')}</p>
          </div>

          <div className="makler-testimonials-grid">
            <div className="neo-card testimonial-card">
              <div className="testimonial-rating">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="var(--accent)" color="var(--accent)" />
                ))}
              </div>
              <p className="testimonial-quote">
                “Toshkentda 3 yil ijarada yashab, har gal maklerga 250$ toʻlardim. Makler.uz orqali toʻgʻridan-toʻgʻri egasidan 30$ Escrow himoyasi bilan topdim. Shartnoma ham telefon orqali rasmiylashdi!”
              </p>
              <div className="testimonial-user-row">
                <Avatar name="Jahongir Rahmatov" size="md" />
                <div className="testimonial-user-meta">
                  <div className="testimonial-name">Jahongir Rahmatov</div>
                  <div className="testimonial-role">Ijarachi · Chilonzor</div>
                </div>
              </div>
            </div>

            <div className="neo-card testimonial-card">
              <div className="testimonial-rating">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="var(--accent)" color="var(--accent)" />
                ))}
              </div>
              <p className="testimonial-quote">
                “Xonadonimni ijaraga berishda har xil odamlardan choʻchirdim. Bu platformada ijarachining JSHSHIR tekshirilgani va inventar akti borligi menga toʻliq xotirjamlik berdi.”
              </p>
              <div className="testimonial-user-row">
                <Avatar name="Umida Zokirova" size="md" />
                <div className="testimonial-user-meta">
                  <div className="testimonial-name">Umida Zokirova</div>
                  <div className="testimonial-role">Uy egasi · Mirobod</div>
                </div>
              </div>
            </div>

            <div className="neo-card testimonial-card">
              <div className="testimonial-rating">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="var(--accent)" color="var(--accent)" />
                ))}
              </div>
              <p className="testimonial-quote">
                “Talabalar uchun xona-xona qidiruv super qulay! Sheriklar bilan alohida xonani koʻrib, barcha nuqsonlari rasmlarda ochiq koʻrsatilganini koʻrib tanladik.”
              </p>
              <div className="testimonial-user-row">
                <Avatar name="Bekzod Aliyev" size="md" />
                <div className="testimonial-user-meta">
                  <div className="testimonial-name">Bekzod Aliyev</div>
                  <div className="testimonial-role">Talaba · Yunusobod</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          3.7 FINAL CTA BANNER (Yakuniy CTA)
          ==================================================================== */}
      <section className="container" style={{ marginBottom: 96 }}>
        <div className="makler-cta-banner">
          <div className="cta-banner-content">
            <h2 className="cta-banner-title">{t('home.cta_banner_title')}</h2>
            <p className="cta-banner-desc">{t('home.cta_banner_desc')}</p>
            <div className="cta-banner-btn-row">
              <Button
                variant="primary"
                size="lg"
                icon={<Compass size={20} />}
                onClick={() => navigate('/search')}
                className="cta-solid-btn"
              >
                {t('home.cta_quiz_btn')}
              </Button>
              <Button
                variant="default"
                size="lg"
                icon={<PlusCircle size={20} />}
                onClick={() => navigate('/add-listing')}
                className="cta-outline-btn"
              >
                {t('home.cta_post_btn')}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
