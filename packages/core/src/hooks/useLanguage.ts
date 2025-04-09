import { useContext } from 'react';
import { LanguageContext, SupportedLanguage } from '../context/LanguageContext';

// Define return type matching the context value
interface UseLanguageReturn {
  language: SupportedLanguage;
  changeLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, namespace?: 'core' | 'wallet' | 'payments') => string;
}

export const useLanguage = (): UseLanguageReturn => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 