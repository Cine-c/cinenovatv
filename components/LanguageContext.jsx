import { createContext, useContext, useState, useEffect } from 'react';

export const SUPPORTED_LANGUAGES = [
  { code: 'en-US', label: 'English' },
  { code: 'es-ES', label: 'Espa\u00f1ol' },
  { code: 'fr-FR', label: 'Fran\u00e7ais' },
  { code: 'de-DE', label: 'Deutsch' },
  { code: 'it-IT', label: 'Italiano' },
  { code: 'pt-BR', label: 'Portugu\u00eas (BR)' },
  { code: 'ja-JP', label: '\u65e5\u672c\u8a9e' },
  { code: 'ko-KR', label: '\ud55c\uad6d\uc5b4' },
  { code: 'zh-CN', label: '\u4e2d\u6587' },
  { code: 'hi-IN', label: '\u0939\u093f\u0928\u094d\u0926\u0940' },
  { code: 'ar-SA', label: '\u0627\u0644\u0639\u0631\u0628\u064a\u0629' },
  { code: 'ru-RU', label: '\u0420\u0443\u0441\u0441\u043a\u0438\u0439' },
  { code: 'nl-NL', label: 'Nederlands' },
  { code: 'sv-SE', label: 'Svenska' },
  { code: 'pl-PL', label: 'Polski' },
  { code: 'tr-TR', label: 'T\u00fcrk\u00e7e' },
];

const LANG_CODES = SUPPORTED_LANGUAGES.map((l) => l.code);

const LanguageContext = createContext({ language: 'en-US', setLanguage: () => {} });

function detectBrowserLanguage() {
  if (typeof navigator === 'undefined') return 'en-US';
  const nav = navigator.language || navigator.languages?.[0] || 'en-US';
  // Exact match first
  if (LANG_CODES.includes(nav)) return nav;
  // Match by primary subtag (e.g. "fr" -> "fr-FR")
  const primary = nav.split('-')[0].toLowerCase();
  const match = SUPPORTED_LANGUAGES.find((l) => l.code.split('-')[0].toLowerCase() === primary);
  return match ? match.code : 'en-US';
}

export function LanguageProvider({ children }) {
  const [language, setLang] = useState('en-US');

  useEffect(() => {
    const stored = localStorage.getItem('tmdb-language');
    if (stored && LANG_CODES.includes(stored)) {
      setLang(stored);
    } else {
      const detected = detectBrowserLanguage();
      setLang(detected);
      localStorage.setItem('tmdb-language', detected);
      document.cookie = `tmdb-lang=${detected};path=/;max-age=31536000;SameSite=Lax`;
    }
  }, []);

  const setLanguage = (code) => {
    if (!LANG_CODES.includes(code)) return;
    localStorage.setItem('tmdb-language', code);
    document.cookie = `tmdb-lang=${code};path=/;max-age=31536000;SameSite=Lax`;
    // Reload so SSR pages pick up the cookie
    window.location.reload();
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
