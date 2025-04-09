'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import '../css/index.css';
import { SupportedLanguage } from '../context/LanguageContext';

const languages = [
  { code: 'it', name: 'Italiano' },
  { code: 'en', name: 'English' },
];

const ItFlag = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2">
      <rect width="1" height="2" fill="#009246"/>
      <rect width="1" height="2" x="1" fill="#fff"/>
      <rect width="1" height="2" x="2" fill="#ce2b37"/>
    </svg>
  );

const UkFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5 3">
      <rect width="5" height="3" fill="#012169"/>
      <path d="M0,0 L5,3 M5,0 L0,3" stroke="#fff" strokeWidth="0.6"/>
      <path d="M0,0 L5,3 M5,0 L0,3" stroke="#C8102E" strokeWidth="0.4"/>
      <path d="M2.5,0 V3 M0,1.5 H5" stroke="#fff" strokeWidth="1"/>
      <path d="M2.5,0 V3 M0,1.5 H5" stroke="#C8102E" strokeWidth="0.6"/>
  </svg>
);

const FallbackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
     <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A11.978 11.978 0 0112 15c-1.417 0-2.757-.27-3.968-.747m-1.21 3.753A8.973 8.973 0 0112 18c1.17 0 2.273-.218 3.263-.618m-3.263 7.378A11.96 11.96 0 0112 21c-2.11 0-4.073-.566-5.686-1.5M4.582 7.596A8.997 8.997 0 0112 6c1.62 0 3.124.42 4.418 1.154m0 0A11.953 11.953 0 0012 10.5c1.513 0 2.94-.318 4.207-.874m-4.207 5.625A8.962 8.962 0 0112 15c-1.108 0-2.14-.194-3.074-.543M3 12c0-.778.099-1.533.284-2.253m0 0A8.959 8.959 0 002.999 12c0 .778.099 1.533.284 2.253m0 0A11.978 11.978 0 0012 15c1.417 0 2.757.27 3.968-.747m1.21 3.753A8.973 8.973 0 0012 18c-1.17 0-2.273-.218-3.263-.618m3.263 7.378A11.96 11.96 0 0012 21c-2.11 0-4.073-.566-5.686-1.5m7.418-13.404A8.997 8.997 0 0012 6c-1.62 0-3.124.42-4.418 1.154m0 0A11.953 11.953 0 0112 10.5c-1.513 0-2.94-.318-4.207-.874m4.207 5.625A8.962 8.962 0 0012 15c1.108 0 2.14-.194 3.074-.543M21 12c0-.778-.099-1.533-.284-2.253m0 0A8.959 8.959 0 0119.001 12c0 .778-.099 1.533-.284 2.253m0 0A11.978 11.978 0 0112 15c-1.417 0-2.757-.27-3.968-.747m-1.21 3.753A8.973 8.973 0 0112 18c-1.17 0-2.273-.218-3.263-.618m3.263 7.378A11.96 11.96 0 0112 21c-2.11 0-4.073-.566-5.686-1.5" />
  </svg>
);


export const LanguageSelector: React.FC = () => {
  const { language, changeLanguage: changeLangContext } = useLanguage(); 
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const changeLanguage = (lng: string) => {
    changeLangContext(lng as SupportedLanguage); 
    setIsOpen(false);
  };

  // Effect to handle clicks outside the dropdown 
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  // Function to get the correct flag/icon based on current language (from i18n instance)
  const renderCurrentLanguageIcon = () => {
    const currentLang = language;
    if (currentLang.startsWith('it')) { 
      return <ItFlag />;
    } else if (currentLang.startsWith('en')) { 
      return <UkFlag />;
    } else {
      return <FallbackIcon />;
    }
  };

  return (
    <div className="language-selector-container" ref={dropdownRef}>
      <div>
        {/* Button to toggle dropdown */} 
        <button
          type="button"
          className="language-selector-button"
          id="options-menu"
          aria-haspopup="true"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
        >
          {renderCurrentLanguageIcon()}
        </button>
      </div>

      {/* Dropdown menu */} 
      {isOpen && (
        <div
          className="language-selector-dropdown"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <div role="none">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`language-selector-option ${ 
                  language.startsWith(lang.code) ? 'selected' : '' 
                }`}
                role="menuitem"
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
