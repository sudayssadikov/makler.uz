import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sparkles, BookOpen } from 'lucide-react';
import './DemoBanner.css';

export const DemoBanner = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  // Agar demo rejimi o'chirilgan bo'lsa (masalan VITE_DEMO_MODE=false), banner ko'rinmaydi
  const isDemo = import.meta.env.VITE_DEMO_MODE !== 'false';
  if (!isDemo) return null;

  const getBannerText = () => {
    const lang = i18n.language || 'uz';
    if (lang === 'ru') {
      return 'Демо-версия: тестовые данные, платежи имитированы.';
    }
    if (lang === 'en') {
      return 'Demo Mode: testing data only, payments are simulated.';
    }
    return 'Demo versiya: maʼlumotlar sinov uchun, toʻlovlar haqiqiy emas.';
  };

  return (
    <div className="demo-banner-root animate-fade-in">
      <div className="container demo-banner-inner">
        <div className="demo-banner-left">
          <Sparkles size={14} className="demo-sparkle-icon" />
          <span className="demo-banner-text">{getBannerText()}</span>
        </div>

        <div className="demo-banner-right">
          <button
            type="button"
            className="demo-action-btn"
            onClick={() => navigate('/guide')}
            title="Sinov yoʻriqnomasi sahifasi"
          >
            <BookOpen size={12} />
            <span>Qoʻllanma</span>
          </button>
        </div>
      </div>
    </div>
  );
};
