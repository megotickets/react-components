import React, { ButtonHTMLAttributes } from 'react';
import '../css/index.css';

interface MegoButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isProcessing?: boolean;
  processingText?: string;
}

export const MegoButton: React.FC<MegoButtonProps> = ({
  onClick,
  disabled,
  isProcessing = false,
  processingText = 'Processing...',
  children,
  className = '',
  type = 'button',
  ...restProps
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isProcessing}
      className={`mego-button font-satoshi ${className}`}
      type={type}
      {...restProps}
    >
      {isProcessing ? processingText : children}
    </button>
  );
};