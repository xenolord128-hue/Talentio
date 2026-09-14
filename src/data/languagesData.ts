export interface LanguageItem {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  rtl?: boolean;
}

export const SUPPORTED_LANGUAGES: LanguageItem[] = [
  { code: 'en', name: 'English', nativeName: 'English (US/Global)', flag: '🇺🇸' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰', rtl: true },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', rtl: true },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '简体中文', flag: '🇨🇳' },
  { code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '繁體中文', flag: '🇹🇼' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' }
];

export const LANGUAGE_MAP = new Map<string, LanguageItem>(
  SUPPORTED_LANGUAGES.map(lang => [lang.code.toLowerCase(), lang])
);

export function getLanguageByCode(code?: string): LanguageItem {
  if (!code) return SUPPORTED_LANGUAGES[0];
  const normalized = code.toLowerCase().trim();
  const direct = LANGUAGE_MAP.get(normalized);
  if (direct) return direct;

  // Handle prefix matches like "zh" -> "zh-CN", "en-US" -> "en"
  const prefix = normalized.split('-')[0];
  for (const lang of SUPPORTED_LANGUAGES) {
    if (lang.code.toLowerCase().startsWith(prefix)) {
      return lang;
    }
  }

  return SUPPORTED_LANGUAGES[0];
}

export function getLanguageName(code?: string): string {
  const item = getLanguageByCode(code);
  return item.name;
}

export function isRtlLanguage(code?: string): boolean {
  if (!code) return false;
  const item = getLanguageByCode(code);
  return !!item.rtl;
}

/**
 * Fast client-side script detector based on Unicode ranges and language patterns.
 */
export function detectLanguageFromText(text: string, fallbackLang: string = 'en'): string {
  if (!text || !text.trim()) return fallbackLang;

  // Bengali range: \u0980-\u09FF
  if (/[\u0980-\u09FF]/.test(text)) return 'bn';

  // Devanagari (Hindi): \u0900-\u097F
  if (/[\u0900-\u097F]/.test(text)) return 'hi';

  // Arabic / Urdu range: \u0600-\u06FF, \u0750-\u077F, \u08A0-\u08FF
  if (/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(text)) {
    // Specific Urdu characters: ٹ, ڈ, ڑ, ں, ے, ۃ, ہ
    if (/[\u0679\u0688\u0691\u06BA\u06D2]/.test(text)) {
      return 'ur';
    }
    return 'ar';
  }

  // Japanese Hiragana & Katakana: \u3040-\u309F, \u30A0-\u30FF
  if (/[\u3040-\u309F\u30A0-\u30FF]/.test(text)) return 'ja';

  // Korean Hangul: \uAC00-\uD7AF, \u1100-\u11FF
  if (/[\uAC00-\uD7AF\u1100-\u11FF]/.test(text)) return 'ko';

  // Chinese Hanzi: \u4E00-\u9FFF
  if (/[\u4E00-\u9FFF]/.test(text)) return 'zh-CN';

  // Russian / Cyrillic: \u0400-\u04FF
  if (/[\u0400-\u04FF]/.test(text)) return 'ru';

  // Thai: \u0E00-\u0E7F
  if (/[\u0E00-\u0E7F]/.test(text)) return 'th';

  // Vietnamese specific characters (diacritics)
  if (/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđĐ]/.test(text)) {
    return 'vi';
  }

  // Spanish specific characters: ¿, ¡, ñ, á, é, í, ó, ú
  if (/[¿¡ñ]/i.test(text)) return 'es';

  // German specific characters: ä, ö, ü, ß
  if (/[äöüß]/i.test(text)) return 'de';

  // French specific characters: ç, œ, æ, è, é, ê, ë
  if (/[œç]/i.test(text)) return 'fr';

  return fallbackLang;
}
