import React, { useEffect, useState } from 'react';
import { PopupModality } from './payments/interfaces/popup-enum';

interface MegoPopupProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  title?: string;
  modality?: PopupModality;
  autoCloseTime?: number; // in millisecondi
}

export const MegoPopup: React.FC<MegoPopupProps> = ({
  isOpen,
  onClose,
  message,
  title = 'Attention',
  modality = PopupModality.Info,
  autoCloseTime = 5000 // 5 secondi di default
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const [animationState, setAnimationState] = useState('hidden');

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      setAnimationState('entering');
      const enterTimeout = setTimeout(() => {
        setAnimationState('visible');
      }, 10);

      // Auto-chiusura dopo il tempo specificato
      const autoCloseTimeout = setTimeout(() => {
        handleClose();
      }, autoCloseTime);

      return () => {
        clearTimeout(enterTimeout);
        clearTimeout(autoCloseTimeout);
      };
    }
  }, [isOpen, autoCloseTime]);

  const handleClose = () => {
    setIsClosing(true);
    setAnimationState('exiting');
    setTimeout(() => {
      onClose();
      setIsClosing(false);
      setAnimationState('hidden');
    }, 300); // Durata dell'animazione
  };

  if (!isOpen && !isClosing) return null;

  // Determina il colore dell'icona in base alla modalità
  const getIconColor = () => {
    switch (modality) {
      case PopupModality.Success:
        return '#10B981'; // verde
      case PopupModality.Error:
        return '#EF4444'; // rosso
      case PopupModality.Info:
      default:
        return '#FFFFFF'; // bianco
    }
  };

  // Determina l'icona in base alla modalità
  const getIcon = () => {
    switch (modality) {
      case PopupModality.Success:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={getIconColor()} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        );
      case PopupModality.Error:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={getIconColor()} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        );
      case PopupModality.Info:
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={getIconColor()} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        );
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      pointerEvents: 'none'
    }}>
      <div style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: animationState === 'visible' ? 1 : 0,
        transition: 'opacity 0.3s ease',
        pointerEvents: 'auto'
      }} onClick={handleClose}></div>
      
      <div style={{
        backgroundColor: 'black',
        border: '1px solid #333',
        borderRadius: '12px',
        padding: '24px',
        width: '90%',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transform: animationState === 'visible' 
          ? 'translateY(0)' 
          : animationState === 'entering' || animationState === 'exiting'
            ? 'translateY(30%)' 
            : 'translateY(100%)',
        opacity: animationState === 'visible' ? 1 : animationState === 'entering' || animationState === 'exiting' ? 1 : 0,
        transition: 'transform 0.3s ease, opacity 0.3s ease',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
        zIndex: 1001,
        pointerEvents: 'auto'
      }}>
        {getIcon()}
        
        <h3 style={{
          color: 'white',
          fontSize: '18px',
          fontWeight: 'bold',
          margin: '16px 0 8px',
          textAlign: 'center'
        }}>
          {title}
        </h3>
        
        <p style={{
          color: 'white',
          fontSize: '14px',
          margin: '0 0 24px',
          textAlign: 'center'
        }}>
          {message}
        </p>
        
        <button 
          onClick={handleClose}
          style={{
            padding: '10px 40px',
            borderRadius: '50px',
            border: 'none',
            background: 'linear-gradient(to right, #4ADE80, #3B82F6)',
            color: 'white',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'opacity 0.2s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
          onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
        >
          Ok
        </button>
      </div>
    </div>
  );
};
