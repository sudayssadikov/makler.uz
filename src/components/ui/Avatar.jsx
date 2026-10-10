import React, { useState } from 'react';
import './Avatar.css';

/**
 * World-class Avatar component with graceful image fallback to initials
 * with a vibrant gradient circle and Neumorphic shadow.
 */
export const Avatar = ({
  src,
  name = 'User',
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  className = '',
  status = null, // 'online' | 'verified' | null
  ...props
}) => {
  const [hasError, setHasError] = useState(false);

  // Compute initials (e.g. "Sherzod Adminov" -> "SA")
  const getInitials = (str) => {
    if (!str) return 'U';
    const parts = str.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  };

  // Deterministic gradient selection based on name
  const gradients = [
    'linear-gradient(135deg, #6C7CFF 0%, #8B5CF6 100%)',
    'linear-gradient(135deg, #FFB547 0%, #F59E0B 100%)',
    'linear-gradient(135deg, #34D399 0%, #059669 100%)',
    'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)',
    'linear-gradient(135deg, #38BDF8 0%, #2563EB 100%)'
  ];
  const charCodeSum = (name || '').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const selectedGradient = gradients[charCodeSum % gradients.length];

  const showImage = src && !hasError;

  return (
    <div className={`neo-avatar neo-avatar-${size} ${className}`} {...props}>
      {showImage ? (
        <img
          src={src}
          alt={name}
          className="neo-avatar-img"
          onError={() => setHasError(true)}
          loading="lazy"
        />
      ) : (
        <div
          className="neo-avatar-fallback"
          style={{ background: selectedGradient }}
          aria-label={name}
        >
          {getInitials(name)}
        </div>
      )}
      {status === 'verified' && <span className="neo-avatar-status verified" />}
      {status === 'online' && <span className="neo-avatar-status online" />}
    </div>
  );
};
