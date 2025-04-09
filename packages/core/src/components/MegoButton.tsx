import React, { ButtonHTMLAttributes } from 'react';
import '../css/index.css';
import { useLanguage } from '../hooks/useLanguage';

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
  const { t } = useLanguage();

  const displayProcessingText = processingText || t('processing', 'core');

  return (
    <button
      onClick={onClick}
      disabled={disabled || isProcessing}
      className={`mego-button font-satoshi ${className}`}
      type={type}
      {...restProps}
    >
      {isProcessing ? displayProcessingText : children}
    </button>
  );
};