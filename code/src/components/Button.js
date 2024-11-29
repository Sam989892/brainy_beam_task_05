import React from 'react';

const Button = ({ label, onClick, className }) => {
  return (
    <button 
      className={`calculator-button ${className || ''}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default Button; 