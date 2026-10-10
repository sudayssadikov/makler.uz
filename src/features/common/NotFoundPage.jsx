import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Home, AlertTriangle } from 'lucide-react';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <Card padding="lg" style={{ textAlign: 'center', maxWidth: 480 }}>
        <div
          style={{
            width: 70,
            height: 70,
            borderRadius: 'var(--radius-full)',
            background: 'var(--warning-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}
        >
          <AlertTriangle size={36} color="var(--warning)" />
        </div>
        <h1 style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--primary)' }}>404</h1>
        <h2 style={{ marginTop: 8 }}>Sahifa topilmadi</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: 8, fontSize: '0.92rem' }}>
          Siz qidirayotgan sahifa mavjud emas yoki boshqa manzilga koʻchirilgan boʻlishi mumkin.
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
