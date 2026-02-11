import { useMemo } from 'react';

import { Language, useLanguageStore } from '@/store/languageStore';

type Dictionary = Record<string, string>;

import uk from './uk';
import en from './en';
import ru from './ru';
const translations: Record<Language, Dictionary> = {
  uk,
  en,
  ru,
};


export const useTranslation = () => {
  const lang = useLanguageStore((s) => s.language);

  const t = useMemo(
    () =>
      (key: string) =>
        (translations[lang] as Dictionary)[key] ?? (translations.uk as Dictionary)[key] ?? key,
    [lang],
  );

  return { t, lang };
};
