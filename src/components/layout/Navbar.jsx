import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  Building2,
  Search,
  PlusCircle,
  FileText,
  Clock,
  Shield,
  Sun,
  Moon,
  ChevronDown,
  Bell,
  Heart,
  User,
  LogOut,
  CheckCircle,
  AlertTriangle,
  Menu,
  X,
  Sparkles,
  Sliders
} from 'lucide-react';
import './Navbar.css';

export const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useThemeStore();
  const {
    user,
    isAuthenticated,
    isAdmin,
    openLoginModal,
    openRegisterModal,
    logout,
    switchRole
  } = useAuthStore();

  const [scrolled, setScrolled] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [avatarDropdownOpen, setAvatarDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const langRef = useRef(null);
  const avatarRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();

  // Scroll detection for navbar shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangDropdownOpen(false);
      }
      if (avatarRef.current && !avatarRef.current.contains(e.target)) {
        setAvatarDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setLangDropdownOpen(false);
  };

  const currentLangLabel = (i18n.language || 'uz').toUpperCase();

  const getVerificationBadge = () => {
    if (!user) return null;
    const status = user.verificationStatus || user.status;
    if (status === 'VERIFIED') {
      return (
        <Badge variant="success" size="sm" icon={<CheckCircle size={12} />}>
          {t('auth.status_verified')}
        </Badge>
      );
    }
    if (status === 'PENDING') {
      return (
        <Badge variant="warning" size="sm" icon={<Clock size={12} />}>
          {t('auth.status_pending')}
        </Badge>
      );
    }
    return (
      <Badge variant="neutral" size="sm" icon={<AlertTriangle size={12} />}>
        {t('auth.status_unverified')}
      </Badge>
    );
  };

  const isUserUnverified =
    isAuthenticated &&
    user &&
    (user.verificationStatus === 'UNVERIFIED' || user.verificationStatus === 'PENDING');

  return (
    <>
      <header className={`makler-navbar-root ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="container makler-navbar-inner">
          {/* 1. Left Brand / Logo (Clean, no tagline) */}
          <Link to="/" className="makler-brand" aria-label="Makler.uz">
            <div className="makler-brand-badge">
              <Building2 size={22} className="makler-brand-icon" />
            </div>
            <div className="makler-brand-name">
              Makler<span className="makler-brand-suffix">.uz</span>
            </div>
          </Link>

          {/* 2. Center Desktop Navigation (Clean, single line, inset pill active) */}
          <nav className="makler-nav-center" aria-label="Main Navigation">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `makler-nav-link ${isActive ? 'active' : ''}`}
            >
              <span>{t('nav.home')}</span>
            </NavLink>

            <NavLink
              to="/search"
              className={({ isActive }) => `makler-nav-link ${isActive ? 'active' : ''}`}
            >
              <Search size={15} />
              <span>{t('nav.search')}</span>
            </NavLink>

            <NavLink
              to="/add-listing"
              className={({ isActive }) => `makler-nav-link ${isActive ? 'active' : ''}`}
            >
              <PlusCircle size={15} />
              <span>{t('nav.add_listing')}</span>
            </NavLink>

            <NavLink
              to="/requests"
              className={({ isActive }) => `makler-nav-link ${isActive ? 'active' : ''}`}
            >
              <Clock size={15} />
              <span>{t('nav.requests')}</span>
            </NavLink>

            <NavLink
              to="/contracts"
              className={({ isActive }) => `makler-nav-link ${isActive ? 'active' : ''}`}
            >
              <FileText size={15} />
              <span>{t('nav.contracts')}</span>
            </NavLink>

            {isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) => `makler-nav-link makler-nav-admin ${isActive ? 'active' : ''}`}
              >
                <Shield size={15} />
                <span>{t('nav.admin')}</span>
              </NavLink>
            )}
          </nav>

          {/* 3. Right Action Tools */}
          <div className="makler-nav-right">
            {/* Language Selector Dropdown */}
            <div className="makler-dropdown-wrap" ref={langRef}>
              <button
                type="button"
                className="neo-btn-icon makler-lang-trigger"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                aria-label="Change language"
              >
                <span className="makler-lang-code">{currentLangLabel}</span>
                <ChevronDown size={13} className={`dropdown-chevron ${langDropdownOpen ? 'open' : ''}`} />
              </button>

              {langDropdownOpen && (
                <div className="makler-menu-dropdown animate-fade-in">
                  <button
                    type="button"
                    className={`makler-menu-item ${i18n.language === 'uz' ? 'active' : ''}`}
                    onClick={() => changeLanguage('uz')}
                  >
                    <span>Oʻzbekcha</span>
                    {i18n.language === 'uz' && <span className="active-dot" />}
                  </button>
                  <button
                    type="button"
                    className={`makler-menu-item ${i18n.language === 'ru' ? 'active' : ''}`}
                    onClick={() => changeLanguage('ru')}
                  >
                    <span>Русский</span>
                    {i18n.language === 'ru' && <span className="active-dot" />}
                  </button>
                  <button
                    type="button"
                    className={`makler-menu-item ${i18n.language === 'en' ? 'active' : ''}`}
                    onClick={() => changeLanguage('en')}
                  >
                    <span>English</span>
                    {i18n.language === 'en' && <span className="active-dot" />}
                  </button>
                </div>
              )}
            </div>

            {/* Theme Toggle (Animated sun/moon) */}
            <button
              type="button"
              className="neo-btn-icon makler-theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            >
              {theme === 'dark' ? (
                <Sun size={18} className="theme-icon sun" />
              ) : (
                <Moon size={18} className="theme-icon moon" />
              )}
            </button>

            {/* Notifications Button with subtle badge dot */}
            <div className="makler-dropdown-wrap" ref={notifRef}>
              <button
                type="button"
                className="neo-btn-icon"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                aria-label="Notifications"
              >
                <Bell size={18} />
                <span className="badge-dot" />
              </button>

              {notificationsOpen && (
                <div className="makler-menu-dropdown notif-menu animate-fade-in">
                  <div className="notif-header">
                    <span className="notif-title">{t('nav.requests')}</span>
                    <span className="notif-count">2</span>
                  </div>
                  <div className="notif-item" onClick={() => { navigate('/requests'); setNotificationsOpen(false); }}>
                    <div className="notif-item-title">Yangi ijara zayavkasi</div>
                    <div className="notif-item-desc">Toshkent, Chilonzor 2 xonali uy uchun</div>
                  </div>
                  <div className="notif-item" onClick={() => { navigate('/contracts'); setNotificationsOpen(false); }}>
                    <div className="notif-item-title">Shartnoma tayyor</div>
                    <div className="notif-item-desc">SMS OTP orqali imzolash kutilmoqda</div>
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar Menu or Auth Buttons */}
            {isAuthenticated && user ? (
              <div className="makler-dropdown-wrap" ref={avatarRef}>
                <button
                  type="button"
                  className="makler-avatar-btn"
                  onClick={() => setAvatarDropdownOpen(!avatarDropdownOpen)}
                  aria-label="User menu"
                >
                  <Avatar
                    src={user.avatar}
                    name={`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Foydalanuvchi'}
                    size="md"
                    status={user.verificationStatus === 'VERIFIED' ? 'verified' : null}
                  />
                  <ChevronDown size={14} className={`dropdown-chevron ${avatarDropdownOpen ? 'open' : ''}`} />
                </button>

                {avatarDropdownOpen && (
                  <div className="makler-menu-dropdown profile-menu animate-fade-in">
                    {/* User Profile Summary Header */}
                    <div className="profile-menu-header">
                      <Avatar
                        src={user.avatar}
                        name={`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Foydalanuvchi'}
                        size="lg"
                      />
                      <div className="profile-menu-meta">
                        <div className="profile-menu-name">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="profile-menu-phone">{user.phone}</div>
                        <div className="profile-menu-badges">
                          <Badge variant={user.role === 'ADMIN' ? 'accent' : 'primary'} size="sm">
                            {user.role || 'USER'}
                          </Badge>
                          {getVerificationBadge()}
                        </div>
                      </div>
                    </div>

                    <div className="profile-menu-divider" />

                    {/* Navigation Items inside Avatar Dropdown */}
                    <button
                      type="button"
                      className="makler-menu-item"
                      onClick={() => {
                        navigate('/my-listings');
                        setAvatarDropdownOpen(false);
                      }}
                    >
                      <Building2 size={16} />
                      <span>{t('nav.my_listings')}</span>
                    </button>

                    <button
                      type="button"
                      className="makler-menu-item"
                      onClick={() => {
                        navigate('/favorites');
                        setAvatarDropdownOpen(false);
                      }}
                    >
                      <Heart size={16} />
                      <span>{t('nav.favorites')}</span>
                    </button>

                    <button
                      type="button"
                      className="makler-menu-item"
                      onClick={() => {
                        navigate('/requests');
                        setAvatarDropdownOpen(false);
                      }}
                    >
                      <Clock size={16} />
                      <span>{t('nav.requests')}</span>
                    </button>

                    <button
                      type="button"
                      className="makler-menu-item"
                      onClick={() => {
                        navigate('/contracts');
                        setAvatarDropdownOpen(false);
                      }}
                    >
                      <FileText size={16} />
                      <span>{t('nav.contracts')}</span>
                    </button>

                    {/* Demo Role Switcher inside menu */}
                    <div className="profile-menu-divider" />
                    <button
                      type="button"
                      className="makler-menu-item role-toggle-item"
                      onClick={() => {
                        switchRole(isAdmin ? 'USER' : 'ADMIN');
                      }}
                    >
                      <Sliders size={16} />
                      <span>Rolni almashtirish:</span>
                      <strong className="role-tag">{isAdmin ? 'ADMIN' : 'USER'}</strong>
                    </button>

                    <div className="profile-menu-divider" />

                    {/* Logout */}
                    <button
                      type="button"
                      className="makler-menu-item logout-item"
                      onClick={() => {
                        logout();
                        setAvatarDropdownOpen(false);
                      }}
                    >
                      <LogOut size={16} />
                      <span>{t('nav.logout')}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="makler-auth-actions">
                <Button variant="default" size="sm" onClick={openLoginModal}>
                  {t('nav.login')}
                </Button>
                <Button variant="primary" size="sm" onClick={openRegisterModal}>
                  {t('nav.register')}
                </Button>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              className="neo-btn-icon makler-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation drawer"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Verification Alert Banner (if logged in but unverified or pending) */}
        {isUserUnverified && !bannerDismissed && (
          <div className="makler-verify-banner animate-fade-in">
            <div className="container makler-verify-banner-inner">
              <div className="makler-verify-text">
                <Sparkles size={16} className="makler-verify-icon" />
                <span>Profilni tasdiqlang → eʼlon qoʻyish va shartnomalar ochiladi</span>
              </div>
              <div className="makler-verify-actions">
                <button
                  type="button"
                  className="makler-verify-cta"
                  onClick={openRegisterModal}
                >
                  Tasdiqlash
                </button>
                <button
                  type="button"
                  className="makler-verify-close"
                  onClick={() => setBannerDismissed(true)}
                  aria-label="Dismiss banner"
                >
                  <X size={15} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="makler-mobile-drawer animate-fade-in">
            <div className="makler-mobile-drawer-links">
              <NavLink to="/" end onClick={() => setMobileMenuOpen(false)}>
                {t('nav.home')}
              </NavLink>
              <NavLink to="/search" onClick={() => setMobileMenuOpen(false)}>
                {t('nav.search')}
              </NavLink>
              <NavLink to="/add-listing" onClick={() => setMobileMenuOpen(false)}>
                {t('nav.add_listing')}
              </NavLink>
              <NavLink to="/requests" onClick={() => setMobileMenuOpen(false)}>
                {t('nav.requests')}
              </NavLink>
              <NavLink to="/contracts" onClick={() => setMobileMenuOpen(false)}>
                {t('nav.contracts')}
              </NavLink>
              {isAuthenticated && (
                <>
                  <NavLink to="/my-listings" onClick={() => setMobileMenuOpen(false)}>
                    {t('nav.my_listings')}
                  </NavLink>
                  <NavLink to="/favorites" onClick={() => setMobileMenuOpen(false)}>
                    {t('nav.favorites')}
                  </NavLink>
                </>
              )}
              {isAdmin && (
                <NavLink to="/admin" onClick={() => setMobileMenuOpen(false)}>
                  {t('nav.admin')}
                </NavLink>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Mobile Bottom Tab Bar (Fixed at bottom on phones) */}
      <nav className="makler-mobile-bottom-bar" aria-label="Mobile Navigation">
        <NavLink to="/" end className={({ isActive }) => `bottom-tab ${isActive ? 'active' : ''}`}>
          <Building2 size={20} />
          <span>{t('nav.home')}</span>
        </NavLink>
        <NavLink to="/search" className={({ isActive }) => `bottom-tab ${isActive ? 'active' : ''}`}>
          <Search size={20} />
          <span>{t('nav.search')}</span>
        </NavLink>
        <NavLink to="/add-listing" className={({ isActive }) => `bottom-tab ${isActive ? 'active' : ''}`}>
          <PlusCircle size={20} />
          <span>{t('nav.add_listing')}</span>
        </NavLink>
        <NavLink to="/requests" className={({ isActive }) => `bottom-tab ${isActive ? 'active' : ''}`}>
          <Clock size={20} />
          <span>{t('nav.requests')}</span>
        </NavLink>
        {isAuthenticated ? (
          <NavLink to="/my-listings" className={({ isActive }) => `bottom-tab ${isActive ? 'active' : ''}`}>
            <User size={20} />
            <span>{t('nav.profile')}</span>
          </NavLink>
        ) : (
          <button type="button" className="bottom-tab" onClick={openLoginModal}>
            <User size={20} />
            <span>{t('nav.login')}</span>
          </button>
        )}
      </nav>
    </>
  );
};
