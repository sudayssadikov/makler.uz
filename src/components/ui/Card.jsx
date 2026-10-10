import React from 'react';
import './Card.css';

export const Card = ({
  children,
  className = '',
  inset = false,
  hoverable = true,
  onClick,
  padding = 'md', // 'none' | 'sm' | 'md' | 'lg'
  ...props
}) => {
  const classes = `neo-card-box ${inset ? 'neo-card-inset' : 'neo-card-outset'} ${
    hoverable ? 'is-hoverable' : ''
  } padding-${padding} ${className}`;

  return (
    <div className={classes} onClick={onClick} {...props}>
      {children}
    </div>
  );
};
