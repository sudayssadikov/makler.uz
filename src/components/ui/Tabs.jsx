import React from 'react';
import './Tabs.css';

export const Tabs = ({
  tabs = [],
  activeTab,
  onChange,
  className = '',
  size = 'md' // 'sm' | 'md' | 'lg'
}) => {
  return (
    <div className={`neo-tabs-container neo-tabs-${size} ${className}`} role="tablist">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            className={`neo-tab-btn ${isActive ? 'is-active' : ''}`}
            onClick={() => onChange(tab.id)}
            type="button"
          >
            {tab.icon && <span className="neo-tab-icon">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className="neo-tab-badge">{tab.badge}</span>
            )}
          </button>
        );
      })}
    </div>
  );
};
