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
  isForced: boolean;
}


export const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);


interface LanguageProviderProps {
  children: React.ReactNode;
  defaultLanguage?: SupportedLanguage;
  forcedLanguage?: SupportedLanguage;
}

// Key for localStorage (save language preference)
const LOCAL_STORAGE_KEY = 'mego-language'; 


export const LanguageProvider: React.FC<LanguageProviderProps> = ({ 
  children,
  defaultLanguage = 'en', 
  forcedLanguage
}) => {
  const isActuallyForced = !!forcedLanguage && !!resources[forcedLanguage];
  
  const initialLang = isActuallyForced ? forcedLanguage : defaultLanguage;
  const [language, setLanguage] = useState<SupportedLanguage>(initialLang);

  useEffect(() => {
    if (!isActuallyForced) {
      const storedLanguage = localStorage.getItem(LOCAL_STORAGE_KEY) as SupportedLanguage | null;
      if (storedLanguage && resources[storedLanguage]) {
        setLanguage(storedLanguage);
      } else {
        setLanguage(defaultLanguage);
        localStorage.setItem(LOCAL_STORAGE_KEY, defaultLanguage);
      }
    }
    else if (language !== forcedLanguage) {
      setLanguage(forcedLanguage);
    }
  }, [defaultLanguage, forcedLanguage, language]);


  const changeLanguage = useCallback((lang: SupportedLanguage) => {
    if (!isActuallyForced) {
      setLanguage(lang);
      localStorage.setItem(LOCAL_STORAGE_KEY, lang);
    }
  }, [isActuallyForced]);

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

  
  const contextValue = useMemo(() => ({
    language,
    changeLanguage,
    t,
    isForced: isActuallyForced
  }), [
    language,
    changeLanguage,
    t,
    isActuallyForced
  ]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}; 