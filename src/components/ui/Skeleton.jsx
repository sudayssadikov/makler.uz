import React from 'react';
import './Skeleton.css';

export const Skeleton = ({
  width = '100%',
  height = '20px',
  borderRadius = 'var(--radius-md)',
  className = ''
}) => {
  return (
    <div
      className={`neo-skeleton ${className}`}
      style={{ width, height, borderRadius }}
    />
  );
};

export const CardSkeleton = () => {
  return (
    <div className="neo-card-box padding-md" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Skeleton height="180px" borderRadius="var(--radius-md)" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Skeleton width="45%" height="24px" />
        <Skeleton width="25%" height="20px" />
      </div>
      <Skeleton width="80%" height="16px" />
      <Skeleton width="60%" height="16px" />
      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        <Skeleton width="30%" height="36px" />
        <Skeleton width="70%" height="36px" />
      </div>
    </div>
  );
};
