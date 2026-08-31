export interface CountryItem {
  code: string;
  name: string;
  callingCode: string;
  flag: string;
  currencyCode: string;
  timezone?: string;
  region?: string;
}

export const COUNTRIES_DATA: CountryItem[] = [
  { code: 'BD', name: 'Bangladesh', callingCode: '+880', flag: '🇧🇩', currencyCode: 'BDT', region: 'Asia', timezone: 'UTC+6' },
  { code: 'US', name: 'United States', callingCode: '+1', flag: '🇺🇸', currencyCode: 'USD', region: 'Americas', timezone: 'UTC-5' },
  { code: 'GB', name: 'United Kingdom', callingCode: '+44', flag: '🇬🇧', currencyCode: 'GBP', region: 'Europe', timezone: 'UTC+0' },
  { code: 'CA', name: 'Canada', callingCode: '+1', flag: '🇨🇦', currencyCode: 'CAD', region: 'Americas', timezone: 'UTC-5' },
  { code: 'AU', name: 'Australia', callingCode: '+61', flag: '🇦🇺', currencyCode: 'AUD', region: 'Oceania', timezone: 'UTC+10' },
  { code: 'DE', name: 'Germany', callingCode: '+49', flag: '🇩🇪', currencyCode: 'EUR', region: 'Europe', timezone: 'UTC+1' },
  { code: 'FR', name: 'France', callingCode: '+33', flag: '🇫🇷', currencyCode: 'EUR', region: 'Europe', timezone: 'UTC+1' },
  { code: 'IN', name: 'India', callingCode: '+91', flag: '🇮🇳', currencyCode: 'INR', region: 'Asia', timezone: 'UTC+5:30' },
  { code: 'PK', name: 'Pakistan', callingCode: '+92', flag: '🇵🇰', currencyCode: 'PKR', region: 'Asia', timezone: 'UTC+5' },
  { code: 'JP', name: 'Japan', callingCode: '+81', flag: '🇯🇵', currencyCode: 'JPY', region: 'Asia', timezone: 'UTC+9' },
  { code: 'CN', name: 'China', callingCode: '+86', flag: '🇨🇳', currencyCode: 'CNY', region: 'Asia', timezone: 'UTC+8' },
  { code: 'KR', name: 'South Korea', callingCode: '+82', flag: '🇰🇷', currencyCode: 'KRW', region: 'Asia', timezone: 'UTC+9' },
  { code: 'AE', name: 'United Arab Emirates', callingCode: '+971', flag: '🇦🇪', currencyCode: 'AED', region: 'Middle East', timezone: 'UTC+4' },
  { code: 'SA', name: 'Saudi Arabia', callingCode: '+966', flag: '🇸🇦', currencyCode: 'SAR', region: 'Middle East', timezone: 'UTC+3' },
  { code: 'SG', name: 'Singapore', callingCode: '+65', flag: '🇸🇬', currencyCode: 'SGD', region: 'Asia', timezone: 'UTC+8' },
  { code: 'MY', name: 'Malaysia', callingCode: '+60', flag: '🇲🇾', currencyCode: 'MYR', region: 'Asia', timezone: 'UTC+8' },
  { code: 'ID', name: 'Indonesia', callingCode: '+62', flag: '🇮🇩', currencyCode: 'IDR', region: 'Asia', timezone: 'UTC+7' },
  { code: 'PH', name: 'Philippines', callingCode: '+63', flag: '🇵🇭', currencyCode: 'PHP', region: 'Asia', timezone: 'UTC+8' },
  { code: 'VN', name: 'Vietnam', callingCode: '+84', flag: '🇻🇳', currencyCode: 'VND', region: 'Asia', timezone: 'UTC+7' },
  { code: 'TH', name: 'Thailand', callingCode: '+66', flag: '🇹🇭', currencyCode: 'THB', region: 'Asia', timezone: 'UTC+7' },
  { code: 'NL', name: 'Netherlands', callingCode: '+31', flag: '🇳🇱', currencyCode: 'EUR', region: 'Europe', timezone: 'UTC+1' },
  { code: 'CH', name: 'Switzerland', callingCode: '+41', flag: '🇨🇭', currencyCode: 'CHF', region: 'Europe', timezone: 'UTC+1' },
  { code: 'SE', name: 'Sweden', callingCode: '+46', flag: '🇸🇪', currencyCode: 'SEK', region: 'Europe', timezone: 'UTC+1' },
  { code: 'NO', name: 'Norway', callingCode: '+47', flag: '🇳🇴', currencyCode: 'NOK', region: 'Europe', timezone: 'UTC+1' },
  { code: 'DK', name: 'Denmark', callingCode: '+45', flag: '🇩🇰', currencyCode: 'DKK', region: 'Europe', timezone: 'UTC+1' },
  { code: 'FI', name: 'Finland', callingCode: '+358', flag: '🇫🇮', currencyCode: 'EUR', region: 'Europe', timezone: 'UTC+2' },
  { code: 'ES', name: 'Spain', callingCode: '+34', flag: '🇪🇸', currencyCode: 'EUR', region: 'Europe', timezone: 'UTC+1' },
  { code: 'IT', name: 'Italy', callingCode: '+39', flag: '🇮🇹', currencyCode: 'EUR', region: 'Europe', timezone: 'UTC+1' },
  { code: 'PT', name: 'Portugal', callingCode: '+351', flag: '🇵🇹', currencyCode: 'EUR', region: 'Europe', timezone: 'UTC+0' },
  { code: 'IE', name: 'Ireland', callingCode: '+353', flag: '🇮🇪', currencyCode: 'EUR', region: 'Europe', timezone: 'UTC+0' },
  { code: 'NZ', name: 'New Zealand', callingCode: '+64', flag: '🇳🇿', currencyCode: 'NZD', region: 'Oceania', timezone: 'UTC+12' },
  { code: 'BR', name: 'Brazil', callingCode: '+55', flag: '🇧🇷', currencyCode: 'BRL', region: 'Americas', timezone: 'UTC-3' },
  { code: 'MX', name: 'Mexico', callingCode: '+52', flag: '🇲🇽', currencyCode: 'MXN', region: 'Americas', timezone: 'UTC-6' },
  { code: 'AR', name: 'Argentina', callingCode: '+54', flag: '🇦🇷', currencyCode: 'USD', region: 'Americas', timezone: 'UTC-3' },
  { code: 'CL', name: 'Chile', callingCode: '+56', flag: '🇨🇱', currencyCode: 'USD', region: 'Americas', timezone: 'UTC-4' },
  { code: 'CO', name: 'Colombia', callingCode: '+57', flag: '🇨🇴', currencyCode: 'USD', region: 'Americas', timezone: 'UTC-5' },
  { code: 'EG', name: 'Egypt', callingCode: '+20', flag: '🇪🇬', currencyCode: 'EGP', region: 'Africa', timezone: 'UTC+2' },
  { code: 'ZA', name: 'South Africa', callingCode: '+27', flag: '🇿🇦', currencyCode: 'ZAR', region: 'Africa', timezone: 'UTC+2' },
  { code: 'NG', name: 'Nigeria', callingCode: '+234', flag: '🇳🇬', currencyCode: 'NGN', region: 'Africa', timezone: 'UTC+1' },
  { code: 'KE', name: 'Kenya', callingCode: '+254', flag: '🇰🇪', currencyCode: 'KES', region: 'Africa', timezone: 'UTC+3' },
  { code: 'TR', name: 'Turkey', callingCode: '+90', flag: '🇹🇷', currencyCode: 'TRY', region: 'Europe/Asia', timezone: 'UTC+3' },
  { code: 'QA', name: 'Qatar', callingCode: '+974', flag: '🇶🇦', currencyCode: 'QAR', region: 'Middle East', timezone: 'UTC+3' },
  { code: 'KW', name: 'Kuwait', callingCode: '+965', flag: '🇰🇼', currencyCode: 'KWD', region: 'Middle East', timezone: 'UTC+3' },
  { code: 'OM', name: 'Oman', callingCode: '+968', flag: '🇴🇲', currencyCode: 'OMR', region: 'Middle East', timezone: 'UTC+4' },
  { code: 'BH', name: 'Bahrain', callingCode: '+973', flag: '🇧🇭', currencyCode: 'BHD', region: 'Middle East', timezone: 'UTC+3' },
  { code: 'PL', name: 'Poland', callingCode: '+48', flag: '🇵🇱', currencyCode: 'PLN', region: 'Europe', timezone: 'UTC+1' },
  { code: 'CZ', name: 'Czech Republic', callingCode: '+420', flag: '🇨🇿', currencyCode: 'EUR', region: 'Europe', timezone: 'UTC+1' },
  { code: 'AT', name: 'Austria', callingCode: '+43', flag: '🇦🇹', currencyCode: 'EUR', region: 'Europe', timezone: 'UTC+1' },
  { code: 'BE', name: 'Belgium', callingCode: '+32', flag: '🇧🇪', currencyCode: 'EUR', region: 'Europe', timezone: 'UTC+1' },
  { code: 'GR', name: 'Greece', callingCode: '+30', flag: '🇬🇷', currencyCode: 'EUR', region: 'Europe', timezone: 'UTC+2' },
  { code: 'HU', name: 'Hungary', callingCode: '+36', flag: '🇭🇺', currencyCode: 'HUF', region: 'Europe', timezone: 'UTC+1' },
  { code: 'RO', name: 'Romania', callingCode: '+40', flag: '🇷🇴', currencyCode: 'RON', region: 'Europe', timezone: 'UTC+2' },
  { code: 'UA', name: 'Ukraine', callingCode: '+380', flag: '🇺🇦', currencyCode: 'USD', region: 'Europe', timezone: 'UTC+2' },
  { code: 'LK', name: 'Sri Lanka', callingCode: '+94', flag: '🇱🇰', currencyCode: 'LKR', region: 'Asia', timezone: 'UTC+5:30' },
  { code: 'NP', name: 'Nepal', callingCode: '+977', flag: '🇳🇵', currencyCode: 'NPR', region: 'Asia', timezone: 'UTC+5:45' },
  { code: 'MA', name: 'Morocco', callingCode: '+212', flag: '🇲🇦', currencyCode: 'MAD', region: 'Africa', timezone: 'UTC+1' },
  { code: 'GH', name: 'Ghana', callingCode: '+233', flag: '🇬🇭', currencyCode: 'GHS', region: 'Africa', timezone: 'UTC+0' }
];

export const getCountryByCode = (code: string): CountryItem => {
  return COUNTRIES_DATA.find(c => c.code.toUpperCase() === code.toUpperCase()) || COUNTRIES_DATA[0];
};

export const getCountryByName = (name: string): CountryItem | undefined => {
  return COUNTRIES_DATA.find(c => c.name.toLowerCase() === name.toLowerCase());
};
