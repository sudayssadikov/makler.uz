import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ShieldAlert, Home } from 'lucide-react';

export const ForbiddenPage = () => {
  const navigate = useNavigate();

  return (
    <div className="container" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card padding="lg" style={{ maxWidth: 480, textAlign: 'center' }}>
        <div style={{ width: 70, height: 70, borderRadius: 'var(--radius-full)', background: 'var(--danger-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <ShieldAlert size={36} color="var(--danger)" />
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--danger)' }}>403</h1>
        <h2 style={{ marginTop: 8 }}>Ruxsat etilmagan (Forbidden)</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: 8, fontSize: '0.92rem' }}>
          Ushbu sahifaga kirish huquqingiz yoʻq. Bu sahifa faqat tizim maʼmurlari (Admin) uchun moʻljallangan.
        </p>
        <Button
          variant="primary"
          icon={<Home size={18} />}
          onClick={() => navigate('/')}
          style={{ marginTop: 24 }}
        >
          Bosh sahifaga qaytish
        </Button>
      </Card>
    </div>
  );
};
