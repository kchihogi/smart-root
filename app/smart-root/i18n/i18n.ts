import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import en from './locales/en.json';
import es from './locales/es.json';
import zhCN from './locales/zh-CN.json';
import zhTW from './locales/zh-TW.json';
import fr from './locales/fr.json';
import de from './locales/de.json';
import ja from './locales/ja.json';
import ptBR from './locales/pt-BR.json';
import ru from './locales/ru.json';
import ar from './locales/ar.json';
import ko from './locales/ko.json';

const locales = Localization.getLocales();
const locale = locales[0]?.languageTag ?? 'en';

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    fallbackLng: 'en',
    lng: locale,
    resources: {
      en: {
        translation: en,
      },
      es: {
        translation: es,
      },
      'zh-CN': {
        translation: zhCN,
      },
      'zh-TW': {
        translation: zhTW,
      },
      fr: {
        translation: fr,
      },
      de: {
        translation: de,
      },
      pt: {
        translation: ptBR,
      },
      ru: {
        translation: ru,
      },
      ar: {
        translation: ar,
      },
      ko: {
        translation: ko,
      },
      ja: {
        translation: ja,
      },
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

function cl(): string {
  switch (i18n.language) {
    case 'en':
      return 'en';
    case 'es':
      return 'es';
    case 'zh-CN':
      return 'zh-CN';
    case 'zh-TW':
      return 'zh-TW';
    case 'fr':
      return 'fr';
    case 'de':
      return 'de';
    case 'pt':
      return 'pt-BR';
    case 'ru':
      return 'ru';
    case 'ar':
      return 'ar';
    case 'ko':
      return 'ko';
    case 'ja':
    case 'ja-JP':
      return 'ja';
    default:
      return 'en';
  }
}

export const currentLanguage = cl();
