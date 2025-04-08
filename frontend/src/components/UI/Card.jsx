// src/components/UI/Card.jsx
import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  hoverable = false,
  padded = true,
}) => {
  return (
    <div 
      className={`
        bg-white rounded-lg shadow
        ${hoverable ? 'hover:shadow-lg transition-shadow duration-200' : ''}
        ${padded ? 'p-6' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;