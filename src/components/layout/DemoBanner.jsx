import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/authStore';
import { resetDemoStorage } from '../../services/storage';
import { toast } from '../../store/toastStore';
import { Sparkles, RotateCcw, User, Shield, Briefcase, Home, BookOpen } from 'lucide-react';
import './DemoBanner.css';

export const DemoBanner = () => {
  const { i18n } = useTranslation();
  const { switchRole } = useAuthStore();
  const navigate = useNavigate();

  // Agar demo rejimi o'chirilgan bo'lsa (masalan VITE_DEMO_MODE=false), banner ko'rinmaydi
  const isDemo = import.meta.env.VITE_DEMO_MODE !== 'false';
  if (!isDemo) return null;

  const handleResetData = () => {
    if (window.confirm('Barcha demo maʼlumotlar boshlangʻich holatga qaytarilsinmi?')) {
      resetDemoStorage();
      toast.success('Demo maʼlumotlar muvaffaqiyatli tiklandi!');
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  const handleQuickSwitch = (role) => {
    switchRole(role);
    toast.info(`Rol ${role} ga almashtirildi`);
    if (role === 'AGENT') {
      navigate('/agent');
    } else if (role === 'ADMIN') {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

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
          <div className="demo-roles-group">
            <span className="demo-roles-label">Tez kirish:</span>
            <button
              type="button"
              className="demo-role-btn"
              onClick={() => handleQuickSwitch('USER')}
              title="Qidiruvchi (Jasur Mansurov) sifatida"
            >
              <User size={12} />
              <span>Qidiruvchi</span>
            </button>
            <button
              type="button"
              className="demo-role-btn"
              onClick={() => handleQuickSwitch('OWNER')}
              title="Uy egasi (Azizbek Qodirov) sifatida"
            >
              <Home size={12} />
              <span>Ega</span>
            </button>
            <button
              type="button"
              className="demo-role-btn"
              onClick={() => handleQuickSwitch('AGENT')}
              title="Agent (Farrux Zokirov) sifatida"
            >
              <Briefcase size={12} />
              <span>Agent</span>
            </button>
            <button
              type="button"
              className="demo-role-btn"
              onClick={() => handleQuickSwitch('ADMIN')}
              title="Admin sifatida"
            >
              <Shield size={12} />
              <span>Admin</span>
            </button>
          </div>

          <button
            type="button"
            className="demo-action-btn"
            onClick={() => navigate('/guide')}
            title="Sinov yoʻriqnomasi sahifasi"
          >
            <BookOpen size={12} />
            <span>Qoʻllanma</span>
          </button>

          <button
            type="button"
            className="demo-action-btn demo-reset-btn"
            onClick={handleResetData}
            title="Barcha oʻzgarishlarni boshlangʻich holatga qaytarish"
          >
            <RotateCcw size={12} />
            <span>Maʼlumotni tiklash</span>
          </button>
        </div>
      </div>
    </div>
  );
};
