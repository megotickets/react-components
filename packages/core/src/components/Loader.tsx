import React from 'react';
import { useLanguage } from '../hooks/useLanguage';

interface LoaderProps {
  message?: string;
  fullScreen?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({
  message,
}) => {
  const { t } = useLanguage();

  const displayMessage = message || t('loadingMessage', 'core');

  return (
    <div style={{ 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        boxShadow: '0 -1px 0 rgba(255, 255, 255, 1)',
        animation: 'spin 1s linear infinite'
      }}></div>
      <p className="mego-font-medium" style={{ marginTop: '16px', color: 'white' }}>{displayMessage}</p>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
