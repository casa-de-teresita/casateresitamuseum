// src/context/LanguageContext.jsx - VERSION AMÉLIORÉE
import { createContext, useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { translations } from '../data/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Détecter la langue depuis l'URL ou localStorage
  const location = useLocation();
  const navigate = useNavigate();
  
  const [language, setLanguage] = useState(() => {
    // 1. Vérifier l'URL d'abord
    if (location.pathname.startsWith('/es/')) {
      return 'es';
    } else if (location.pathname.startsWith('/en/')) {
      return 'en';
    }
    
    // 2. Sinon, utiliser localStorage
    const saved = localStorage.getItem('language');
    return saved || 'es'; // Défaut: espagnol (Bolivia)
  });

  // Synchroniser avec l'URL quand la route change
  useEffect(() => {
    const pathLang = location.pathname.startsWith('/es/') ? 'es' : 
                     location.pathname.startsWith('/en/') ? 'en' : null;
    
    if (pathLang && pathLang !== language) {
      console.log(`🌐 URL language detected: ${pathLang}, updating context`);
      setLanguage(pathLang);
      localStorage.setItem('language', pathLang);
    }
  }, [location.pathname]);

  // Sauvegarder dans localStorage
  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'es' : 'en';
    setLanguage(newLang);
    
    // Si on est sur une page blog/museum, naviguer vers la nouvelle langue
    const currentPath = location.pathname;
    
    if (currentPath.match(/^\/(en|es)\/(blog|museum)/)) {
      const newPath = currentPath.replace(/^\/(en|es)/, `/${newLang}`);
      console.log(`🔄 Navigating to: ${newPath}`);
      navigate(newPath, { replace: true });
    }
  };

  // Fonction pour changer de langue avec redirection
  const setLanguageWithRedirect = (newLang, targetPath = null) => {
    setLanguage(newLang);
    
    if (targetPath) {
      navigate(targetPath, { replace: true });
    }
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      toggleLanguage, 
      setLanguageWithRedirect,
      t 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};