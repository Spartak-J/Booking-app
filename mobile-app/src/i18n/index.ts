import { useMemo } from 'react';

import { Language, useLanguageStore } from '@/store/languageStore';

type Dictionary = Record<string, string>;

import uk from './uk';
import en from './en';
import de from './de';
import it from './it';
import pl from './pl';
import tr from './tr';
import ce from './ce';
import sp from './sp';
import fr from './fr';

const translations: Partial<Record<Language, Dictionary>> = {
  uk,
  en,
  de,
  it,
  pl,
  tr,
  ce,
  sp,
  fr,
};


export const useTranslation = () => {
  const lang = useLanguageStore((s) => s.language);

  const t = useMemo(
    () =>
      (key: string) =>
        translations[lang]?.[key] ?? translations.uk?.[key] ?? key,
    [lang],
  );

  return { t, lang };
};
