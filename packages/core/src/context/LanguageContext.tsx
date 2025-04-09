'use client';
import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';


import enCore from '../locales/en/core.json';
import itCore from '../locales/it/core.json';
import enWallet from '../locales/en/wallet.json';
import itWallet from '../locales/it/wallet.json';
import enPayments from '../locales/en/payments.json';
import itPayments from '../locales/it/payments.json';


export type SupportedLanguage = 'en' | 'it';


interface TranslationResources {
  core: { [key: string]: string };
  wallet: { [key: string]: string };
  payments: { [key: string]: string };
}


const resources: Record<SupportedLanguage, TranslationResources> = {
  en: {
    core: enCore,
    wallet: enWallet,
    payments: enPayments,
  },
  it: {
    core: itCore,
    wallet: itWallet,
    payments: itPayments,
  },
};


interface LanguageContextProps {
  language: SupportedLanguage;
  changeLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, namespace?: keyof TranslationResources) => string;
}


export const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

// Define props for the provider
interface LanguageProviderProps {
  children: React.ReactNode;
  defaultLanguage?: SupportedLanguage;
}

// Create the provider component
export const LanguageProvider: React.FC<LanguageProviderProps> = ({ 
  children,
  defaultLanguage = 'en' 
}) => {
  const [language, setLanguage] = useState<SupportedLanguage>(defaultLanguage);

  // Function to change language
  const changeLanguage = useCallback((lang: SupportedLanguage) => {
    setLanguage(lang);
  }, []);

  // Memoized translation function
  const t = useCallback((key: string, namespace: keyof TranslationResources = 'core'): string => {
    const nsResources = resources[language]?.[namespace];
    if (!nsResources) {
      console.warn(`[MegoLang] Namespace "${namespace}" not found for language "${language}"`);
      return key; 
    }
    const translation = nsResources[key];
    if (translation === undefined) {
      console.warn(`[MegoLang] Key "${key}" not found in namespace "${namespace}" for language "${language}"`);
      return key; 
    }
    return translation;
  }, [language]); 

  
  const contextValue = useMemo(() => ({ language, changeLanguage, t }), [
    language,
    changeLanguage,
    t,
  ]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}; 