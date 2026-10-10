import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Lock, FileCheck, Phone, Mail, MapPin } from 'lucide-react';
import './Footer.css';

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="makler-footer-root">
      <div className="container">
        <div className="makler-footer-grid">
          {/* Column 1: Brand & Security Badges */}
          <div className="footer-brand-col">
            <Link to="/" className="footer-logo">
              Makler<span className="footer-logo-dot">.uz</span>
            </Link>
            <p className="footer-desc">
              Oʻzbekistondagi birinchi shaffof, xavfsiz va toʻliq tekshirilgan koʻchmas mulk platformasi.
              Escrow toʻlov tizimi va qonuniy elektron shartnomalar bilan himoyalangan.
            </p>
            <div className="footer-badges-list">
              <span className="footer-badge">
                <ShieldCheck size={14} color="var(--success)" /> JSHSHIR Tasdiqlangan
              </span>
              <span className="footer-badge">
                <Lock size={14} color="var(--accent)" /> $30 Escrow Himoyasi
              </span>
              <span className="footer-badge">
                <FileCheck size={14} color="var(--primary)" /> SMS Imzo (OTP)
              </span>
            </div>
          </div>

          {/* Column 2: Platform Navigation */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">Platforma</h4>
            <ul className="footer-links">
              <li>
                <Link to="/">{t('nav.home')}</Link>
              </li>
              <li>
                <Link to="/search">{t('nav.search')}</Link>
              </li>
              <li>
                <Link to="/add-listing">{t('nav.add_listing')}</Link>
              </li>
              <li>
                <Link to="/requests">{t('nav.requests')}</Link>
              </li>
              <li>
                <Link to="/contracts">{t('nav.contracts')}</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Security & Legal */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">Xavfsizlik</h4>
            <ul className="footer-links">
              <li>
                <Link to="/search">JSHSHIR tekshiruvi qoidalari</Link>
              </li>
              <li>
                <Link to="/search">30$ Escrow hamyon kafolati</Link>
              </li>
              <li>
                <Link to="/search">Uy holati akti va inventar</Link>
              </li>
              <li>
                <Link to="/search">Nizolarni hal qilish nizomi</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Support */}
          <div className="footer-contact-col">
            <h4 className="footer-col-title">Aloqa</h4>
            <div className="footer-contact-items">
              <div className="contact-item">
                <Phone size={15} color="var(--primary)" />
                <span>+998 (71) 200-00-00</span>
              </div>
              <div className="contact-item">
                <Mail size={15} color="var(--primary)" />
                <span>info@makler.uz</span>
              </div>
              <div className="contact-item">
                <MapPin size={15} color="var(--primary)" />
                <span>Toshkent sh., Amir Temur shoh koʻchasi 107B</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom Row */}
        <div className="makler-footer-bottom">
          <p>© 2026 Makler.uz — Barcha huquqlar himoyalangan.</p>
          <p className="footer-tech-tag">React 18 · Soft Neumorphic Design System</p>
        </div>
      </div>
    </footer>
  );
};
