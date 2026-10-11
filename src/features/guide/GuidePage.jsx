import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  UserCheck,
  Search,
  Send,
  CreditCard,
  FileCheck,
  ArrowRight,
  Sparkles,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import './GuidePage.css';

export const GuidePage = () => {
  const navigate = useNavigate();

  const steps = [
    {
      num: 1,
      title: 'Roʻyxatdan oʻtish va JSHSHIR Tasdiqlash',
      icon: <UserCheck size={24} color="var(--primary)" />,
      badge: 'Boshlangʻich qadam',
      desc: 'Platformada 6 xonali SMS kod (demo: 123456) orqali kiring. Eʼlon joylash yoki zayavka yuborish uchun 14 xonali JSHSHIR bilan profilingizni tasdiqlang.',
      actionLabel: 'Profilga oʻtish / Roʻyxatdan oʻtish',
      actionUrl: '/'
    },
    {
      num: 2,
      title: 'Smart Quiz orqali Eʼlon qidirish',
      icon: <Search size={24} color="var(--info)" />,
      badge: '90%+ Moslik',
      desc: 'Bosh sahifadagi yoki /search sahifasidagi aniq select filtrlari orqali (erkin matnsiz) oʻzingizga mos xonadon yoki talabalar uchun xona-xona ijarani toping.',
      actionLabel: 'Qidiruvni boshlash',
      actionUrl: '/search'
    },
    {
      num: 3,
      title: 'Eʼlonga Zayavka yuborish',
      icon: <Send size={24} color="var(--accent)" />,
      badge: 'Ega tasdigʻi',
      desc: 'Eʼlon batafsil sahifasida ("ListingDetails") xona yoki butun uyni tanlab zayavka topshiring. Mulk egasi 48 soat ichida qabul qilishi bilan uy 24 soatga siz uchun HOLD (band) boʻladi.',
      actionLabel: 'Eʼlonlarni koʻrish',
      actionUrl: '/search'
    },
    {
      num: 4,
      title: '30$ Koʻrsatish xizmati toʻlovi (Escrow)',
      icon: <CreditCard size={24} color="var(--warning)" />,
      badge: '100% Kafolat',
      desc: 'Click yoki Payme simulyatsiyasi orqali 30$ toʻlang (yoki avvalgi bepul kuponingizni ishlating). Uy boshqalar uchun darhol RESERVED boʻladi va platforma agenti biriktiriladi.',
      actionLabel: 'Zayavkalarga oʻtish',
      actionUrl: '/requests'
    },
    {
      num: 5,
      title: 'Agent bilan koʻrish & SMS OTP Shartnoma',
      icon: <FileCheck size={24} color="var(--success)" />,
      badge: 'Qonuniy himoya',
      desc: 'Makler.uz agenti uyni joyiga borib koʻrsatadi. Uyni yoqtirsangiz, rasmiy shartnoma SMS OTP orqali ikkala tomon imzolaydi va koʻchib kirish tasdiqlanadi.',
      actionLabel: 'Shartnomalarga oʻtish',
      actionUrl: '/contracts'
    }
  ];

  return (
    <div className="container guide-page-root">
      <div className="guide-header">
        <div className="guide-pill">
          <Sparkles size={16} />
          <span>Sinovchi uchun qoʻllanma</span>
        </div>
        <h1 className="guide-title">Platformani Sinash Boʻyicha 5 Qadamli Yoʻriqnoma</h1>
        <p className="guide-subtitle">
          Makler.uz yangi ish modelini (vositachisiz emas — platforma agenti xizmati va $30 kafolati)
          boshidan oxirigacha sinab koʻring.
        </p>
      </div>

      <div className="guide-steps-list">
        {steps.map((s) => (
          <Card key={s.num} padding="lg" className="guide-step-card">
            <div className="step-num-bubble">{s.num}</div>
            <div className="step-content">
              <div className="step-top-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {s.icon}
                  <h3 className="step-title">{s.title}</h3>
                </div>
                <Badge variant="accent">{s.badge}</Badge>
              </div>
              <p className="step-desc">{s.desc}</p>
              <div className="step-action-row">
                <Button
                  variant="default"
                  size="sm"
                  icon={<ArrowRight size={15} />}
                  onClick={() => navigate(s.actionUrl)}
                >
                  {s.actionLabel}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card padding="lg" className="guide-feedback-callout">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <HelpCircle size={32} color="var(--primary)" />
          <div>
            <h3>Savollaringiz yoki takliflaringiz bormi?</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 4 }}>
              Sinov davomida tushunarsiz tuyulgan har qanday jihat haqida fikr bildiring.
            </p>
          </div>
        </div>
        <Button
          variant="primary"
          size="md"
          icon={<ExternalLink size={16} />}
          onClick={() => window.open(import.meta.env.VITE_FEEDBACK_URL || 'https://t.me/makler_uz_support', '_blank')}
        >
          Fikr bildirish
        </Button>
      </Card>
    </div>
  );
};
