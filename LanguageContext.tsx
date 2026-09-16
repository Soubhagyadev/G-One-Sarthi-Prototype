import React, { createContext, useContext } from 'react';
import type { Language } from './i18n';
import { t } from './i18n';

type LanguageContextType = {
  language: Language;
  t: (key: Parameters<typeof import('./i18n').t>[0], ...args: any[]) => string;
  fontMedium: string;
  fontBold: string;
  isIndic: boolean;
  // Returns safe letterSpacing and lineHeight multiplier for large headings
  headingStyle: (fontSize: number, latinLineHeight: number) => {
    letterSpacing: number;
    lineHeight: number;
  };
};

export const LanguageContext = createContext<LanguageContextType>({
  language: 'English',
  t: (key) => key as string,
  fontMedium: 'Lora-Medium',
  fontBold: 'Lora-Bold',
  isIndic: false,
  headingStyle: (_fs, lh) => ({ letterSpacing: -1.5, lineHeight: lh }),
});

export function useLanguage() {
  return useContext(LanguageContext);
}

// Returns the correct font family names for a given language
export function getFonts(language: Language): { fontMedium: string; fontBold: string } {
  switch (language) {
    case 'Assamese':
      return { fontMedium: 'NotoSerif-Bengali', fontBold: 'NotoSerif-Bengali-Bold' };
    case 'Hindi':
    case 'Bodo':
      return { fontMedium: 'NotoSerif-Devanagari', fontBold: 'NotoSerif-Devanagari-Bold' };
    default:
      return { fontMedium: 'Lora-Medium', fontBold: 'Lora-Bold' };
  }
}

function isIndicLanguage(language: Language): boolean {
  return language === 'Assamese' || language === 'Hindi' || language === 'Bodo';
}

type Props = {
  language: Language;
  children: React.ReactNode;
};

export function LanguageProvider({ language, children }: Props) {
  const { fontMedium, fontBold } = getFonts(language);
  const isIndic = isIndicLanguage(language);

  const translate = (key: Parameters<typeof t>[0], ...args: any[]) =>
    t(key, language, ...args);

  // For large headings: Indic scripts need no negative letter-spacing
  // and more generous line height (1.4x font size vs Latin 1.27x)
  const headingStyle = (fontSize: number, latinLineHeight: number) => ({
    letterSpacing: isIndic ? 0 : -(fontSize * 0.037),
    lineHeight: isIndic ? Math.round(fontSize * 1.45) : latinLineHeight,
  });

  return (
    <LanguageContext.Provider value={{ language, t: translate, fontMedium, fontBold, isIndic, headingStyle }}>
      {children}
    </LanguageContext.Provider>
  );
}
