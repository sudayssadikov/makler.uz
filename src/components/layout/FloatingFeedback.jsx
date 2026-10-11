import React from 'react';
import { MessageSquareShare } from 'lucide-react';
import './FloatingFeedback.css';

export const FloatingFeedback = () => {
  const feedbackUrl = import.meta.env.VITE_FEEDBACK_URL || 'https://t.me/makler_uz_support';

  return (
    <a
      href={feedbackUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="floating-feedback-btn animate-fade-in"
      aria-label="Fikr bildirish"
      title="Fikr bildirish (Telegram / Google Form)"
    >
      <MessageSquareShare size={18} />
      <span className="feedback-text">Fikr bildirish</span>
    </a>
  );
};
